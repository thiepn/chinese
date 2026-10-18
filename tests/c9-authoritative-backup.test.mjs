import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/study.mjs';
import {backupDocument} from '../src/study-storage.mjs';
import {exportSavedBackup,previewSavedBackup} from '../src/backup-preview.mjs';

test('export reads the authoritative database snapshot, not stale tab state',async()=>{
 const stale=freshState(),persisted=freshState();
 persisted.revision=12;
 persisted.settings.dark=true;
 const before=JSON.stringify(persisted);
 let reads=0;
 const db={id:'native'};
 const snapshot=await exportSavedBackup(db,async x=>{
  assert.equal(x,db);reads++;return persisted;
 });
 assert.equal(reads,1);
 assert.equal(snapshot.revision,12);
 assert.equal(snapshot.document.learner.settings.dark,true);
 assert.equal(snapshot.document.learner.revision,12);
 assert.equal(snapshot.document.formatVersion,1);
 assert.equal(stale.revision,0);
 assert.equal(JSON.stringify(persisted),before);
 assert.notEqual(snapshot.document.learner,persisted);
});

test('export fails closed rather than offering a fabricated empty recovery backup',async()=>{
 await assert.rejects(exportSavedBackup(null),/Local database unavailable/);
 await assert.rejects(exportSavedBackup({},async()=>{throw Error('Database connection lost');}),/Database connection lost/);
});

test('import preview uses latest readback for CAS baseline and retains original backup identity',async()=>{
 const current=freshState(),incoming=freshState();
 current.revision=41;
 current.settings.showPinyin=false;
 incoming.revision=9;
 const document=backupDocument(incoming);
 const before=JSON.stringify(current);
 let reads=0;
 const inspection=await previewSavedBackup({id:'db'},document,{bytes:200},async()=>{
  reads++;return current;
 });
 assert.equal(reads,1);
 assert.equal(inspection.preview.current.revision,41);
 assert.equal(inspection.preview.incoming.revision,9);
 assert.equal(inspection.preview.explicitReplacement,true);
 assert.deepEqual(inspection.learner,incoming);
 assert.equal(JSON.stringify(current),before);
 assert.equal(document.learner.version,1);
});

test('failed preview cannot initiate a replacement or read unavailable local history',async()=>{
 const valid=backupDocument(freshState());
 await assert.rejects(previewSavedBackup(null,valid),/Local database unavailable/);
 await assert.rejects(previewSavedBackup({},valid,{},async()=>{throw Error('IDB read failure');}),/IDB read failure/);
 await assert.rejects(previewSavedBackup({},valid,{bytes:8_000_001},async()=>freshState()),/8 MB/);
});
