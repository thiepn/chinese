import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshState,validateState,addLesson} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {startBlock,selectBlockLessons,blockCurrent,blockStepReady,advanceBlock,abandonBlock,blockStatistics,blockBridgeQuestion,answerBlockBridge,useBlockHint,validateBlockExtensions} from '../src/study-block.mjs';
import {crossLessonConnections} from '../src/cross-lesson.mjs';
import {startCourse,advanceCourse,courseQuestion,answerCourse,finishCourse} from '../src/course-journey.mjs';
import {startLadder,ladderQuestion,ladderSelect,answerLadder,advanceLadder} from '../src/sentence-ladder.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';

const lessons=DEMO_LESSONS.slice(0,2).map(l=>l.id);
const initial=()=>startBlock(freshState(),{id:'block-test',focus:'balanced',count:2,lessonIds:lessons,at:100});
function journey(state,lessonId,number){let s=startCourse(state,lessonId,{id:`course-${number}`,now:200+number*100});s=advanceCourse(s);
 for(let i=0;i<4;i++){const q=courseQuestion(s.courseJourney);s=answerCourse(s,{id:`j-${number}-${i}`,response:q.answer,now:300+i+number*100});s=advanceCourse(s);}
 return finishCourse(s,{id:`complete-${number}`,now:400+number*100});}
function ladder(state,lessonId,number){let s=startLadder(state,lessonId,{id:`ladder-${number}`,at:1000+number*100});
 for(let i=0;i<4;i++){const q=ladderQuestion(s.ladderSession);if(q.kind==='order')for(let j=0;j<q.chunks.length;j++)s=ladderSelect(s,j);
 s=answerLadder(s,{id:`ladder-a-${number}-${i}`,response:q.kind==='order'?'':q.answer,at:1100+number*100+i});s=advanceLadder(s);}
 return s;}
test('multi-lesson selection is deterministic, unique, size-bound and does not alter progress',()=>{
 const s=freshState();for(const focus of ['balanced','weak','new']){const items=selectBlockLessons(s,{focus,count:4});assert.equal(items.length,4);assert.equal(new Set(items.map(x=>x.id)).size,4);}assert.deepEqual(s,freshState());});
test('block start is an optional backwards-compatible state extension',()=>{
 const s=initial();assert.equal(validateState(s),true);assert.equal(s.studyBlock.steps.length,6);assert.equal(s.studyBlock.cursor,0);assert.deepEqual(s.events,[]);assert.deepEqual(s.cards,{});
 const backup=backupDocument(s);assert.equal(importBackup(backup).studyBlock.id,'block-test');
 const old=freshState();delete old.studyBlock;delete old.studyBlockEvents;assert.equal(validateState(importBackup(backupDocument(old))),true);
});
test('opening or previously finishing an activity cannot falsely satisfy a new block step',()=>{
 let s=journey(freshState(),lessons[0],97);s=startBlock(s,{id:'after-old',count:2,lessonIds:lessons});assert.equal(blockStepReady(s),false);
 assert.throws(()=>advanceBlock(s,{id:'invalid'}),/Finish this lesson activity/);
 s=startCourse(s,lessons[0],{id:'new-j'});assert.equal(blockStepReady(s),false);
});
test('actual six-stage journey and four-stage ladder advance only after completion, without scheduled grades',()=>{
 let s=initial();s=journey(s,lessons[0],1);assert.equal(blockStepReady(s),true);s=advanceBlock(s,{id:'step1'});
 assert.equal(blockCurrent(s).kind,'ladder');assert.equal(blockStepReady(s),false);
 s=ladder(s,lessons[0],1);assert.equal(blockStepReady(s),true);s=advanceBlock(s,{id:'step2'});
 s=journey(s,lessons[1],2);s=advanceBlock(s,{id:'step3'});
 s=ladder(s,lessons[1],2);s=advanceBlock(s,{id:'step4'});
 assert.equal(blockCurrent(s).kind,'contrast');assert.equal(s.events.length,0);assert.equal(Object.keys(s.cards).length,0);
 const q=blockBridgeQuestion(s);assert.ok(q.options.includes(q.answer));s=answerBlockBridge(s,{id:'bridge1',response:q.answer,at:10000});assert.equal(blockStepReady(s),true);s=advanceBlock(s,{id:'step5'});
 const p=blockBridgeQuestion(s);assert.equal(p.kind,'pinyin');s=answerBlockBridge(s,{id:'bridge2',response:p.answer,at:11000});s=advanceBlock(s,{id:'step6'});
 assert.equal(s.studyBlock,null);assert.equal(blockStatistics(s).finished,1);assert.equal(blockStatistics(s).steps,6);assert.equal(s.events.length,0);assert.equal(Object.keys(s.cards).length,0);
 assert.equal(validateState(importBackup(backupDocument(s))),true);
});
test('bridge hint survives state cloning and makes a correct answer assisted',()=>{
 let s=initial();s.studyBlock.cursor=4;s=useBlockHint(s);assert.equal(s.studyBlock.assistanceUsed,true);
 const q=blockBridgeQuestion(s);s=answerBlockBridge(s,{id:'hinted',response:q.answer,at:5000});assert.equal(s.studyBlockEvents.at(-1).assisted,true);assert.equal(s.studyBlockEvents.at(-1).correct,true);assert.equal(s.events.length,0);
});
test('bridge revealed answer is not independent success and cannot be answered twice',()=>{
 let s=initial();s.studyBlock.cursor=4;s=answerBlockBridge(s,{id:'revealed',reveal:true});assert.equal(s.studyBlockEvents.at(-1).correct,false);assert.equal(s.studyBlockEvents.at(-1).assisted,true);
 assert.throws(()=>answerBlockBridge(s,{id:'again',response:'x'}));
});
test('tone grader reports wrong tone in full word, without scheduled mastery credit',()=>{
 let s=initial();s.studyBlock.cursor=5;const q=blockBridgeQuestion(s);
 const wrong=q.answer.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/u,'a');
 s=answerBlockBridge(s,{id:'tone-bad',response:wrong==='a'? 'wrong':wrong});assert.equal(s.studyBlockEvents[0].kind,'pronunciation');assert.equal(s.studyBlockEvents[0].correct,false);assert.equal(s.events.length,0);
});
test('block checkpoints do not overwrite existing active lesson or review records',()=>{
 const learned=addLesson(freshState(),lessons[0],1234),existing=JSON.stringify({events:learned.events,cards:learned.cards,learned:learned.learned});
 const s=startBlock(learned,{id:'preserve',count:2,lessonIds:lessons});assert.equal(JSON.stringify({events:s.events,cards:s.cards,learned:s.learned}),existing);
});
test('abandon saves historical blocks without resetting exercises or local learner data',()=>{
 let s=initial();s=abandonBlock(s,{id:'abandon1',at:321});assert.equal(s.studyBlock,null);assert.equal(s.studyBlockEvents[0].type,'abandoned');assert.equal(validateState(s),true);
});
test('malformed checkpoints, unsupported lessons and duplicate event identities are rejected',()=>{
 let s=initial();s.studyBlock.steps[0].lessonId='not-approved';assert.throws(()=>validateState(s));
 s=initial();s.studyBlock.cursor=99;assert.throws(()=>validateState(s));
 s=initial();s.studyBlockEvents=[{id:'x',blockId:'b',type:'finished',at:100},{id:'x',blockId:'b',type:'finished',at:100}];assert.throws(()=>validateState(s));
});
test('all 74 lessons have complete original demo cross-links, with no assumed HSK membership',()=>{
 for(const l of DEMO_LESSONS){const result=crossLessonConnections([l.id,DEMO_LESSONS[0].id]);assert.ok(result.words.some(w=>w.lessonId===l.id));assert.match(result.notice,/literal written-form overlaps/);}
});
test('UI, browser script and offline asset declarations expose working Study Blocks',async()=>{
 const [app,html,sw,css]=await Promise.all(['app.mjs','index.html','sw.js','styles.css'].map(s=>readFile(`src/${s}`,'utf8')));
 assert.match(app,/renderBlock/);assert.match(app,/block-launch/);assert.match(app,/answerBlockBridge/);assert.match(html,/data-route="block"/);assert.match(sw,/study-block\.mjs/);assert.match(sw,/cross-lesson\.mjs/);assert.match(css,/\.block-step/);
});
test('cross-lesson meaning choices include a correct answer and are not always first',()=>{
 let first=0,notFirst=0;
 for(const l of DEMO_LESSONS.slice(1,35)){
  const s=startBlock(freshState(),{id:`quiz-${l.id}`,count:2,lessonIds:[DEMO_LESSONS[0].id,l.id]});s.studyBlock.cursor=4;
  const q=blockBridgeQuestion(s);assert.equal(q.options.filter(o=>o===q.answer).length,1);assert.ok(q.options.length>=2);
  if(q.options[0]===q.answer)first++;else notFirst++;
 }
 assert.ok(first>0&&notFirst>0);
});
