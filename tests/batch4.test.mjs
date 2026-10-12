import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS,findLesson} from '../src/demo-lessons.mjs';
import {buildDrill,gradeDrill,DRILL_MODES,validateDrills} from '../src/drills.mjs';
import {freshState,addLesson,gradeCard,validateState,dueCards} from '../src/study.mjs';
import {practiceSummary,addDrillRecord,toggleStoryBookmark} from '../src/practice-records.mjs';
import {learningAnalytics,cardEvidence,prioritizedDue} from '../src/insights.mjs';
import {guideFor,DEEP_NOTES} from '../src/lesson-guides.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {readFile} from 'node:fs/promises';

test('all 74 lessons offer six distinct valid synthetic exercise formats',()=>{
 assert.equal(DEMO_LESSONS.length,74);assert.equal(DRILL_MODES.length,6);assert.equal(validateDrills(),true);
 for(const l of DEMO_LESSONS)for(const mode of DRILL_MODES){const d=buildDrill(l.id,mode);assert.ok(d,`${l.id}/${mode}`);
 if(d.kind==='choice'){assert.equal(d.options.length,4);assert.equal(new Set(d.options).size,4);assert.ok(d.options.includes(d.answer));assert.ok(gradeDrill(d,d.answer).correct)}
 else if(d.kind==='pinyin')assert.ok(gradeDrill(d,d.answer).correct,`${l.id} ${d.answer}`);
 else {assert.equal(d.kind,'ordering');assert.ok(gradeDrill(d,d.answer,d.chunks.map((_,i)=>i)).correct);assert.equal(gradeDrill(d,d.answer,[1,0]).correct,false)}
 }
});
test('deep lesson notes provide safe, non-etymological teaching explanations',()=>{
 assert.ok(Object.keys(DEEP_NOTES).length>=24);
 for(const l of DEMO_LESSONS){const g=guideFor(l);assert.ok(g.topic&&g.explanation&&g.comparison);assert.ok(g.comparison.length>=20);}
 assert.equal(guideFor(null),null);
});
test('supplemental drill record is deduplicated and does not change scheduled mastery',()=>{
 const s=addLesson(freshState(),'demo-01',1700000000000);const baseline={cards:structuredClone(s.cards),events:structuredClone(s.events),learned:[...s.learned]};
 const a=addDrillRecord(s,'demo-01','word-build',true,false,'unique-1',1700000000100);
 const b=addDrillRecord(a,'demo-01','word-build',true,false,'unique-1',1700000000100);
 assert.deepEqual(a.drillEvents,b.drillEvents);assert.deepEqual(a.cards,baseline.cards);assert.deepEqual(a.events,baseline.events);assert.deepEqual(a.learned,baseline.learned);
 assert.equal(practiceSummary(a).independentCorrect,1);assert.equal(validateState(a),true);
 const c=addDrillRecord(a,'demo-01','word-meaning',true,true,'unique-2',1700000000200);assert.equal(practiceSummary(c).independentCorrect,1);
 assert.equal(importBackup(backupDocument(c)).drillEvents.length,2);
});
test('old Batch 2 / Batch 3 backups without Batch 4 fields remain valid',()=>{
 const legacy=addLesson(freshState(),'demo-05',1700000000000);delete legacy.drillEvents;delete legacy.bookmarkedStories;delete legacy.settings.readingLarge;
 assert.equal(validateState(legacy),true);
 const restored=importBackup(backupDocument(legacy));assert.deepEqual(restored,legacy);
 const withNewRecord=addDrillRecord(restored,'demo-05','reading-choice',false,false,'new-1');assert.equal(withNewRecord.drillEvents.length,1);
});
test('invalid drill events/bookmarks/reading size are rejected',()=>{
 const s=freshState();for(const value of [[{id:'x',lessonId:'fake',mode:'recognition',correct:true,assisted:false,at:1}],
 [{id:'x',lessonId:'demo-01',mode:'none',correct:true,assisted:false,at:1}],
 [{id:'x',lessonId:'demo-01',mode:'recognition',correct:true,assisted:false,at:1},{id:'x',lessonId:'demo-01',mode:'recognition',correct:true,assisted:false,at:2}]]){
 assert.throws(()=>validateState({...s,drillEvents:value}));}
 for(const value of [['fake'],['story-01','story-01']])assert.throws(()=>validateState({...s,bookmarkedStories:value}));
 assert.throws(()=>validateState({...s,settings:{...s.settings,readingLarge:'yes'}}));
 assert.throws(()=>addDrillRecord(s,'fake','recognition',true,false,'id'));
});
test('bookmarks toggle, preserve existing history and survive backups',()=>{
 const s=addLesson(freshState(),'demo-01');const withBookmark=toggleStoryBookmark(s,'story-01');assert.deepEqual(withBookmark.bookmarkedStories,['story-01']);
 assert.deepEqual(withBookmark.events,s.events);assert.deepEqual(toggleStoryBookmark(withBookmark,'story-01').bookmarkedStories,[]);
 assert.deepEqual(importBackup(backupDocument(withBookmark)).bookmarkedStories,['story-01']);
 assert.throws(()=>toggleStoryBookmark(s,'missing'));
});
test('weak-skill priority is derived from attempts and does not fabricate progress',()=>{
 const now=1700000000000;let s=addLesson(freshState(),'demo-01',now);let ids=dueCards(s,now);
 assert.equal(ids.length,6);assert.equal(prioritizedDue(s,now,'weak').length,6);
 s=gradeCard(s,ids[0],0,now,'bad-1',{correct:false,assisted:false});
 const ranked=prioritizedDue(s,now+200000,'weak');assert.equal(ranked[0],ids[0]);assert.equal(cardEvidence(s,ids[0]).failures,1);
 assert.equal(learningAnalytics(s,now).skills.reduce((a,b)=>a+b.attempts,0),1);assert.equal(learningAnalytics(s,now).correct14,0);
 assert.equal(s.events.length,1);
});
test('UI wires practice route, larger reading, deep lessons, review-priority and retains legacy routes',async()=>{
 const app=await readFile(new URL('../src/app.mjs',import.meta.url),'utf8');
 const html=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
 const sw=await readFile(new URL('../src/sw.js',import.meta.url),'utf8');
 for(const needle of ['renderPractice','drill-mode','drill-answer','drill-check','drill-order-add','story-bookmark','reading-text-size','prioritizedDue','guideFor(l)','learningAnalytics(state)'])assert.ok(app.includes(needle),needle);
 for(const name of ['practice','today','learn','review','stories','explore'])assert.ok(html.includes(`data-route="${name}"`));
 for(const name of ['drills.mjs','insights.mjs','practice-records.mjs','lesson-guides.mjs'])assert.ok(sw.includes(name));
});
