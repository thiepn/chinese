import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SENSE_CASES,addSenseEvent} from '../src/sense-lab.mjs';
import {senseContrast,senseRepairQueue} from '../src/sense-contrast.mjs';
import {freshState} from '../src/study.mjs';
test('all twelve teaching examples have one contrasting context with a different meaning',()=>{
 assert.equal(SENSE_CASES.length,12);
 for(const item of SENSE_CASES){const pair=senseContrast(item.id);assert.equal(pair.contexts.length,2);assert.notEqual(pair.contexts[0].sense,pair.contexts[1].sense);assert.equal(pair.contexts[0].id,item.id);}
});
test('mistakes are prioritized, but old errors can be resolved independently',()=>{
 let s=addSenseEvent(freshState(),{id:'e1',caseId:SENSE_CASES[0].id,correct:false,assisted:false,at:1000});
 assert.equal(senseRepairQueue(s)[0].id,SENSE_CASES[0].id);
 s=addSenseEvent(s,{id:'e2',caseId:SENSE_CASES[0].id,correct:true,assisted:false,at:2000});
 assert.equal(senseRepairQueue(s).find(x=>x.id===SENSE_CASES[0].id).pending,0);
 assert.equal(s.events.length,0);
});
test('assisted correct attempt remains unresolved',()=>{
 const s=addSenseEvent(freshState(),{id:'h1',caseId:SENSE_CASES[0].id,correct:true,assisted:true,at:1000});
 assert.equal(senseRepairQueue(s)[0].pending,1);
});
test('context comparison appears after feedback and is available offline',()=>{
 const app=readFileSync('src/app.mjs','utf8'),sw=readFileSync('src/sw.js','utf8');
 assert.match(app,/sense-compare-grid/);assert.match(app,/sense-weak/);assert.match(sw,/sense-contrast\.mjs/);
});
