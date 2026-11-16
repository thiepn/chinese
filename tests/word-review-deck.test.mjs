// Word review deck regression suite: opt-in scheduled review for canonical
// vocabulary words is additive, safe for every existing learner identity, and
// preserves backup and validation contracts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState,addLesson,gradeCard,cardInfo,cardsForLesson,wordCardsFor,dueCards,scheduleWord,unscheduleWord,validateState,upgradedState,leechCards } from '../src/study.mjs';
import { reviewPlan } from '../src/review-strategy.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';
import { WORDS,findWord } from '../src/lexicon.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';

const KEY='爱好|aihao';

test('word deck: scheduling creates two cards with the standard card shape',()=>{
 const s=scheduleWord(freshState(),KEY,1000);
 assert.deepEqual(s.scheduledWords,[KEY]);
 assert.deepEqual(Object.keys(s.cards).sort(),['word:爱好|aihao:meaning','word:爱好|aihao:reading'].sort());
 for(const id of wordCardsFor(KEY)){
  const info=cardInfo(id);
  assert.ok(info,id+' cardInfo resolves');
  assert.equal(info.wordKey,KEY);
  assert.equal(info.lesson.id,null,'word cards carry no lesson identity');
  assert.equal(info.prompt,'爱好');
  assert.ok(info.answer&&info.question);
 }
 assert.equal(cardInfo('word:爱好|aihao:meaning').kind,'meaning');
 assert.equal(cardInfo('word:爱好|aihao:reading').kind,'pinyin');
 assert.equal(cardInfo('word:爱好|aihao:reading').answer,'àihào');
 assert.equal(cardInfo('word:爱好|aihao:meaning').reading,'àihào');
 assert.deepEqual(dueCards(s,1000).sort(),wordCardsFor(KEY).sort());
 assert.doesNotThrow(()=>validateState(s));
});

test('word deck: scheduling is idempotent and unknown words fail closed',()=>{
 let s=scheduleWord(freshState(),KEY,1000);
 s=scheduleWord(s,KEY,2000);
 assert.deepEqual(s.scheduledWords,[KEY]);
 assert.equal(Object.keys(s.cards).length,2);
 assert.throws(()=>scheduleWord(freshState(),'not-a-word|xx',1000),/canonical vocabulary/);
});

test('word deck: grading works and the scheduler invariants hold on word cards',()=>{
 let s=scheduleWord(freshState(),KEY,1000);
 const verdict=gradeCard(s,'word:爱好|aihao:meaning',2,1000,'w-ev1',{correct:true,assisted:false});
 assert.equal(verdict.cards['word:爱好|aihao:meaning'].due,1000+3*86400000,'legacy exact interval preserved');
 assert.equal(verdict.events[0].policy,'review-v3');
 assert.throws(()=>gradeCard(s,'word:爱好|aihao:meaning',2,1000,'w-ev2',{correct:false}),/passing credit/);
 assert.throws(()=>gradeCard(s,'word:爱好|aihao:meaning',2,1000,'w-ev3',{assisted:true}),/independent credit/);
 assert.doesNotThrow(()=>validateState(verdict));
});

test('word deck: unscheduling removes cards but keeps the graded history',()=>{
 let s=scheduleWord(freshState(),KEY,1000);
 s=gradeCard(s,'word:爱好|aihao:reading',2,1000,'w-hist',{correct:true,assisted:false});
 s=unscheduleWord(s,KEY);
 assert.deepEqual(s.scheduledWords,[]);
 assert.deepEqual(Object.keys(s.cards),[]);
 assert.equal(s.events.length,1,'graded events are history, never deleted');
 assert.doesNotThrow(()=>validateState(s));
 const again=scheduleWord(s,KEY,5000);
 assert.equal(again.cards['word:爱好|aihao:reading'].repetitions,0,'a fresh schedule starts clean');
});

test('word deck: review queue and priorities accept word cards',()=>{
 let s=scheduleWord(freshState(),KEY,1000);
 s=addLesson(s,'demo-01',1000);
 const plan=reviewPlan(s,{now:1000,limit:20});
 assert.ok(plan.some(r=>r.id.startsWith('word:')),'scheduled words enter the review queue');
 const reading=plan.find(r=>r.id==='word:爱好|aihao:reading');
 if(reading)assert.equal(reading.family,'pronunciation');
 const meaning=plan.find(r=>r.id==='word:爱好|aihao:meaning');
 if(meaning)assert.equal(meaning.family,'meanings');
});

test('word deck: old states and backups migrate without any rewrite',()=>{
 const old=freshState();
 delete old.scheduledWords;
 assert.doesNotThrow(()=>validateState(old),'pre-deck states stay valid');
 const migrated=upgradedState(old,1000);
 assert.deepEqual(migrated.scheduledWords,[]);
 const s=scheduleWord(addLesson(freshState(),'demo-01',1000),KEY,1000);
 const restored=importBackup(backupDocument(s));
 assert.deepEqual(restored.scheduledWords,[KEY]);
 assert.deepEqual(restored.cards,s.cards);
 assert.throws(()=>validateState({...s,scheduledWords:[KEY,KEY]}),/Invalid scheduled-word/);
 assert.throws(()=>validateState({...s,scheduledWords:['nope|nope']}),/Invalid scheduled-word/);
 assert.throws(()=>validateState({...s,cards:{'word:other|key:meaning':{due:1,interval:0,repetitions:0,lastGrade:null}}}),/Invalid review-card data/);
});

test('word deck: lesson identities and the vocabulary corpus are untouched',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.deepEqual(cardsForLesson('demo-01').map(id=>id.split(':')[1]).sort(),['meaning','reading','sentence','word0','word1','wordread0'].sort());
 assert.ok(findWord(KEY)&&WORDS.length>=1130);
 const s=scheduleWord(freshState(),KEY,1000);
 assert.equal(cardsForLesson('demo-01').length,6,'lesson card sets never gain deck cards');
 assert.deepEqual(leechCards(s),[]);
});
