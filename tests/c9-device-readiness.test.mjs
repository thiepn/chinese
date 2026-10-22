import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectLocalReadback,offlineDeviceStatus,renderDeviceReadiness} from '../src/device-readiness-c9.mjs';
const act=(n,label,cls='',attr='')=>'<button data-action="'+n+'" '+attr+'>'+label+'</button>';
const esc=x=>String(x).replaceAll('<','&lt;');
test('device readback verifies a persisted revision without modifying storage',async()=>{
 const db={};let reads=0;
 const result=await inspectLocalReadback(db,8,async candidate=>{assert.equal(candidate,db);reads++;return {revision:8,learned:['private-id']};});
 assert.deepEqual(result,{status:'match',expectedRevision:8,actualRevision:8});
 assert.equal(reads,1);
});
test('device readback distinguishes cross-tab revision changes and errors without leaking records',async()=>{
 assert.equal((await inspectLocalReadback({},2,async()=>({revision:3}))).status,'changed');
 assert.deepEqual(await inspectLocalReadback(null,2,async()=>{throw Error('should not read');}),{status:'unavailable',expectedRevision:2,actualRevision:null});
 assert.deepEqual(await inspectLocalReadback({},2,async()=>{throw Error('private records');}),{status:'error',expectedRevision:2,actualRevision:null});
 assert.equal((await inspectLocalReadback({},2,async()=>({revision:-1}))).status,'error');
});
test('offline cache status discloses uncertainty and stale versions',()=>{
 assert.equal(offlineDeviceStatus('ready',{cached:8,total:8}).ready,true);
 assert.match(offlineDeviceStatus('ready',{cached:8,total:8}).message,/still need a device reload/);
 assert.match(offlineDeviceStatus('incomplete',{cached:7,total:8}).message,/unusable/);
 assert.match(offlineDeviceStatus('outdated',null).message,/previous version/);
});
test('device settings are responsive, accessible, and never silently count manual steps as passed',()=>{
 const html=renderDeviceReadiness({storageReady:true,revision:7,online:false,offlineShell:'incomplete',coverage:{cached:7,total:8},
  readback:{status:'changed',expectedRevision:7,actualRevision:8}},act,esc);
 assert.match(html,/role="status"/);
 assert.match(html,/Physical-device acceptance steps \(not automatically passed\)/);
 assert.match(html,/data-action="c9-device-check"/);
 assert.match(html,/data-action="c9-offline-repair"/);
 assert.match(html,/disabled/);
 assert.match(html,/7 \/ 8 readable compiled assets/);
 assert.match(html,/Saved revision 8 differs/);
 assert.doesNotMatch(html,/private-id/);
});

test('a same-revision but different original learner record fails content integrity',async()=>{
 const displayed={revision:19,learned:['demo-001'],events:[{id:'private-lesson-answer'}]};
 const stored={revision:19,learned:[],events:[]};
 const result=await inspectLocalReadback({},19,async()=>stored,displayed);
 assert.deepEqual(result,{status:'content-mismatch',expectedRevision:19,actualRevision:19});
 assert.doesNotMatch(JSON.stringify(result),/private-lesson-answer|demo-001/);
 const html=renderDeviceReadiness({storageReady:true,revision:19,online:true,
  offlineShell:'ready',coverage:{cached:8,total:8},readback:result},act,esc);
 assert.match(html,/content differs from the displayed learner record/);
 assert.doesNotMatch(html,/private-lesson-answer|demo-001/);
});
test('older matched readback is never presented as certifying the current revision',()=>{
 const html=renderDeviceReadiness({storageReady:true,revision:20,online:true,
  offlineShell:'ready',coverage:{cached:8,total:8},
  readback:{status:'match',expectedRevision:19,actualRevision:19}},act,esc);
 assert.match(html,/previous check belongs to an earlier displayed revision/);
 assert.doesNotMatch(html,/Read-only IndexedDB check matched revision/);
});
