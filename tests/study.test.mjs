import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS, demoSearch, allowedDemoLesson, findLesson } from '../src/demo-lessons.mjs';
import { freshState, validateState, addLesson, gradeCard, dueCards, cardInfo, summary, cardsForLesson, upgradedState, lessonGroups } from '../src/study.mjs';
import { backupDocument, importBackup } from '../src/study-storage.mjs';

test('original content has no official HSK membership and all lessons have complete linked words and sentences',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 for(const lesson of DEMO_LESSONS){
  assert.equal(lesson.officialHskLevel,null);assert.ok(allowedDemoLesson(lesson));assert.equal(findLesson(lesson.id),lesson);
  assert.ok(lesson.words.length>=2);assert.ok(lesson.pinyin&&lesson.meaning);
  assert.ok(lesson.sentence.hanzi&&lesson.sentence.pinyin&&lesson.sentence.english);
  for(const word of lesson.words)assert.ok(word.hanzi&&word.pinyin&&word.english);
 }
 for(const lesson of DEMO_LESSONS.slice(0,74)){
  assert.ok(lesson.sentence.hanzi.includes(lesson.hanzi));
  assert.ok(lesson.words.every(word=>word.hanzi.includes(lesson.hanzi)));
 }
 assert.equal(new Set(DEMO_LESSONS.map(x=>x.id)).size,DEMO_LESSONS.length);
});
test('non-approved/missing lesson cannot be published',()=>{
 assert.equal(findLesson('unapproved'),null);assert.equal(allowedDemoLesson({...DEMO_LESSONS[0],approval:'PENDING'}),false);
 assert.equal(allowedDemoLesson({...DEMO_LESSONS[0],officialHskLevel:1}),false);
});
test('search supports hanzi, english and diacritic-free pinyin',()=>{
 assert.ok(demoSearch('school').some(x=>x.hanzi==='学'));
 assert.ok(demoSearch('xue').some(x=>x.hanzi==='学'));
 assert.ok(demoSearch('书').some(x=>x.hanzi==='书'));
 assert.equal(demoSearch('not-found-word-9652').length,0);
});
test('learning registers independent recognition, pronunciation and lexical targets',()=>{
 const state=addLesson(freshState(),'demo-01',1000);
 assert.equal(state.learned.length,1);assert.equal(cardsForLesson('demo-01').length,6);
 assert.equal(Object.keys(state.cards).length,6);assert.equal(dueCards(state,1000).length,6);
 assert.match(cardInfo('demo-01:reading').question,/pinyin/);
 assert.match(cardInfo('demo-01:word0').question,/word/);
 validateState(state);
});
test('review policy schedules deterministic delayed returns and does not double grade duplicate IDs',()=>{
 const base=addLesson(freshState(),'demo-01',1000);
 const a=gradeCard(base,'demo-01:meaning',2,2000,'fixed-event');
 const b=gradeCard(base,'demo-01:meaning',2,2000,'fixed-event');
 assert.deepEqual(a,b);assert.equal(a.events.length,1);assert.equal(a.cards['demo-01:meaning'].due,2000+3*86400000);
 const same=gradeCard(a,'demo-01:meaning',2,2000,'fixed-event');assert.deepEqual(same,a);
 assert.equal(base.events.length,0);
});
test('different skills are not auto-credited and failures relearn',()=>{
 const base=addLesson(freshState(),'demo-01',0);
 const improved=gradeCard(base,'demo-01:meaning',3,3000,'evt01');
 assert.equal(improved.cards['demo-01:reading'].lastGrade,null);
 const retry=gradeCard(improved,'demo-01:meaning',0,5000,'evt02');
 assert.equal(retry.cards['demo-01:meaning'].repetitions,0);
 assert.equal(retry.cards['demo-01:meaning'].due,5000+2*60000);
});
test('progress does not claim calibrated mastery',()=>{
 const base=addLesson(freshState(),'demo-01',0);
 const m=summary(base,0);assert.equal(m.learned,1);assert.equal(m.cards,6);assert.equal(m.attempts,0);
 assert.equal('mastery' in m,false);
});
test('backup roundtrips with strict curriculum origin',()=>{
 const base=addLesson(freshState(),'demo-02',123);
 const doc=backupDocument(base);assert.deepEqual(importBackup(doc),base);
 assert.throws(()=>importBackup({...doc,origin:'hsk-official'}),/Unrecognized/);
});
test('unknown target and malformed user history fail closed',()=>{
 assert.throws(()=>addLesson(freshState(),'test-official-list'),/Only approved/);
 assert.throws(()=>gradeCard(freshState(),'demo-01:reading',3,1,'x'),/unavailable/);
 assert.throws(()=>validateState({...freshState(),learned:['official-hsk-01']}),/Invalid/);
 assert.throws(()=>validateState({...freshState(),events:[{id:'x',cardId:'bad',at:1,grade:3}]}),/Invalid/);
});
test('offline source includes functional modules without external runtime dependencies',async()=>{
 const {readFile}=await import('node:fs/promises');
 const html=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
 const sw=await readFile(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.match(html,/href="#main"/);assert.match(html,/aria-label="Primary mobile navigation"/);
 assert.match(sw,/demo-lessons\.mjs/);assert.match(sw,/study-storage\.mjs/);
});


test('newly added independent pronunciation and sentence targets have distinct meanings',()=>{
 const ids=cardsForLesson('demo-01');assert.deepEqual(ids.map(id=>id.split(':')[1]),['meaning','reading','word0','word1','wordread0','sentence']);
 assert.equal(cardInfo('demo-01:wordread0').kind,'pinyin');assert.equal(cardInfo('demo-01:sentence').kind,'choice');
});
test('legacy saved progress migrates additional targets with no fabricated grades',()=>{
 const current=addLesson(freshState(),'demo-01',1000);delete current.cards['demo-01:wordread0'];delete current.cards['demo-01:sentence'];
 const migrated=upgradedState(current,2000);assert.equal(Object.keys(migrated.cards).length,6);assert.equal(migrated.events.length,0);
 assert.equal(migrated.cards['demo-01:sentence'].due,2000);assert.equal(upgradedState(migrated),null);
});
test('a revealed or incorrect attempt cannot earn a passing event',()=>{
 const current=addLesson(freshState(),'demo-01',0);
 assert.throws(()=>gradeCard(current,'demo-01:reading',2,100,'bad',{correct:false}),/Incorrect/);
 assert.throws(()=>gradeCard(current,'demo-01:reading',2,100,'bad',{correct:true,assisted:true}),/Revealed/);
 const result=gradeCard(current,'demo-01:reading',0,100,'good',{correct:false,errorType:'tone'});
 assert.equal(result.events[0].correct,false);assert.equal(result.events[0].errorType,'tone');
});
test('original and advanced units cover every approved demo lesson exactly once',()=>{
 const groups=lessonGroups();assert.ok(groups.length>20);
 assert.equal(groups[0].name,'Foundations');assert.deepEqual(groups[19].range,[191,202]);
 assert.deepEqual(groups.flatMap(g=>g.lessons.map(l=>l.id)),DEMO_LESSONS.map(l=>l.id));
});

test('daily introduction goal distinguishes actual lesson completion from historical imported lessons',()=>{
 const now=Date.UTC(2026,9,12,10);const base=freshState();const a=addLesson(base,'demo-01',now);
 assert.equal(summary(a,now).introducedToday,1);assert.equal(summary(a,now).dailyGoal,5);
 assert.equal(summary(a,now+2*86400000).introducedToday,0);
 const same=addLesson(a,'demo-01',now+3000);assert.equal(same.introductions.length,1);
});
