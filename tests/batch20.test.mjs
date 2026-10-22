import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,addLesson,gradeCard,validateState,dueCards} from '../src/study.mjs';
import {backupDocument} from '../src/study-storage.mjs';
import {courseOverview,courseShortcuts,recoverySnapshot} from '../src/course-overview.mjs';
import {previewBackup,restoreRequiresAcknowledgement,MAX_BACKUP_BYTES} from '../src/backup-preview.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {FLUENCY_BANK} from '../src/fluency-studio.mjs';
const fixed=Date.UTC(2026,9,12,12);
test('Batch 20 preserves the exact original demonstration curriculum',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.deepEqual(DEMO_LESSONS.slice(0,74).map(l=>l.id),
  Array.from({length:74},(_,i)=>'demo-'+String(i+1).padStart(2,'0')));
 assert.ok(STORIES.length>=12);assert.ok(DIALOGUES.length>=10);assert.ok(FLUENCY_BANK.length>=206);
 assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null));
});
test('Course overview reads fresh learner data without creating mastery events',()=>{
 const s=freshState(),before=structuredClone(s);const report=courseOverview(s,{now:fixed});
 assert.equal(report.introduced,0);assert.equal(report.total,DEMO_LESSONS.length);assert.equal(report.scheduled.attempts,0);assert.equal(report.supplementary,0);
 assert.equal(report.remaining,DEMO_LESSONS.length);assert.equal(report.sessions.length,0);assert.deepEqual(s,before);
});
test('Course overview keeps supplementary events independent from scheduled credit',()=>{
 let s=addLesson(freshState(),'demo-01',fixed-50000);s=gradeCard(s,'demo-01:meaning',2,fixed,'ev1',{correct:true,assisted:false});
 s.wordPracticeEvents=[];const before=structuredClone(s);const o=courseOverview(s,{now:fixed});
 assert.equal(o.scheduled.attempts,1);assert.equal(o.scheduled.independent,1);assert.equal(o.supplementary,0);
 assert.equal(dueCards(s,fixed).length,5);assert.deepEqual(s,before);
});
test('Course shortcuts prioritize real due reviews and give correct lesson links',()=>{
 const s=addLesson(freshState(),'demo-01',fixed-100);const paths=courseShortcuts(s,{now:fixed});
 assert.equal(paths[0].kind,'review');assert.equal(paths[0].route,'review');
 assert.equal(paths.find(x=>x.kind==='lesson').lessonId,'demo-02');
});
test('Recovery snapshot is a read-only summary not fabricated persistence evidence',()=>{
 const s=freshState();s.revision=23;s.bookmarkedWords=['demo-key'];const raw=JSON.stringify(s);const snapshot=recoverySnapshot(s);
 assert.equal(snapshot.revision,23);assert.equal(snapshot.wordbook,1);assert.equal(snapshot.scheduledEvents,0);
 assert.equal(JSON.stringify(s),raw);assert.equal(snapshot.version,1);
});
test('Backup preview is read-only and never mutates live progress',()=>{
 const current=addLesson(freshState(),'demo-01',fixed);
 const incoming=freshState();const first=structuredClone(current),second=structuredClone(incoming);
 const report=previewBackup(backupDocument(incoming),current,{bytes:500});
 assert.equal(report.mode,'replace-not-merge');assert.equal(report.current.learned,1);assert.equal(report.incoming.learned,0);
 assert.ok(report.warnings.some(w=>w.includes('introduced lessons')));
 assert.deepEqual(current,first);assert.deepEqual(incoming,second);
});
test('Legacy v1 backup still imports without optional learner extensions',()=>{
 const old=freshState();delete old.settings.hanziLarge;delete old.courseEvents;delete old.dailyPlan;delete old.fluencyEvents;
 assert.equal(validateState(old),true);
 const preview=previewBackup(backupDocument(old),freshState());assert.equal(preview.formatVersion,1);
 assert.equal(preview.incoming.scheduledEvents,0);
});
test('Backup rejects unsupported origin and incompatible version before preview',()=>{
 const doc=backupDocument(freshState());doc.origin='unknown';assert.throws(()=>previewBackup(doc,freshState()));
 doc.origin='original-editorial-demo';doc.formatVersion=22;assert.throws(()=>previewBackup(doc,freshState()));
});
test('Backup enforces upper byte limit and disallows malformed events',()=>{
 const doc=backupDocument(freshState());assert.throws(()=>previewBackup(doc,freshState(),{bytes:MAX_BACKUP_BYTES+1}));
 doc.learner.events.push({id:'broken',cardId:'nonexistent',grade:3,at:fixed});
 assert.throws(()=>previewBackup(doc,freshState()));
});
test('Restore requires explicitly typed REPLACE, and no other input',()=>{
 const p=previewBackup(backupDocument(freshState()),freshState());
 assert.equal(restoreRequiresAcknowledgement(p,'REPLACE'),true);
 for(const invalid of ['replace',' REPLACE','REPLACE ', '', 'DELETE',undefined])assert.equal(restoreRequiresAcknowledgement(p,invalid),false);
 assert.equal(restoreRequiresAcknowledgement(null,'REPLACE'),false);
});
test('Optional large-Hanzi setting validates and old backups remain valid',()=>{
 const s=freshState();assert.equal(s.settings.hanziLarge,false);assert.equal(validateState(s),true);
 s.settings.hanziLarge=true;assert.equal(validateState(s),true);
 s.settings.hanziLarge='yes';assert.throws(()=>validateState(s));
 delete s.settings.hanziLarge;assert.equal(validateState(s),true);
});
test('Source exposes explicit backup preview and safe separate restore action',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const token of ['backupPreviewPanel','restore-confirm','restore-cancel','restore-ack','finishOverviewPanel','recoveryCenterPanel','finish-next','MAX_BACKUP_BYTES'])assert.ok(app.includes(token),token);
 assert.equal(app.includes("if(!confirm(`Replace local data with this valid backup?"),false);
});
test('Service worker keeps Batch 20 modules in the active v53 offline contract',()=>{
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const current=sw.match(/^const CACHE='([^']+)'/m)?.[1];
 const expected=app.match(/^const C9_EXPECTED_OFFLINE_CACHE='([^']+)'/m)?.[1];
 assert.equal(current,expected);assert.match(current,/^character-study-working-v101-/);
 for(const token of ['course-overview.mjs','backup-preview.mjs','learning-hub.mjs'])assert.ok(sw.includes(token));
 assert.ok(!sw.includes('official-hsk-2025.json'));
});
test('Mobile course-navigation retains access to source learning tools',()=>{
 const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(html,/aria-label="Primary mobile navigation"/);assert.match(css,/\.hub-path-nav\{display:flex;overflow-x:auto/);
 assert.match(css,/\.finish-compare/);assert.match(css,/\[data-hanzi-size="large"\]/);
});
test('Restore transaction carries an expected revision for cross-tab safety',()=>{
 const source=readFileSync(new URL('../src/study-storage.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.match(source,/expectedRevision/);assert.match(source,/current\.revision!==expectedRevision/);
 assert.match(app,/expectedRevision:pendingRestore\.preview\.current\.revision/);
});
