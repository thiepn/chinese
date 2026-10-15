import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshState,validateState,addLesson,gradeCard} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {startBlock,advanceBlock,abandonBlock,selectBlockLessons} from '../src/study-block.mjs';
import {beginTrail,trailQuestion,trailSources,trailHint,answerTrail,nextTrail,trailSummary,validateTrail} from '../src/context-trail.mjs';
import {lessonSkillLedger,lessonPriority,personalizedBlockPlan,blockOverview} from '../src/block-coach.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
const a=DEMO_LESSONS[0].id,b=DEMO_LESSONS[1].id;
const block=()=>startBlock(freshState(),{id:'b16-block',count:2,lessonIds:[a,b],at:100});
test('old v1 backups lacking block trail and old course fields remain supported',()=>{
 const old=freshState();delete old.blockTrail;delete old.blockTrailEvents;delete old.studyBlock;delete old.studyBlockEvents;
 assert.equal(validateState(importBackup(backupDocument(old))),true);
});
test('trail starts only with an actual block and references existing original content',()=>{
 assert.throws(()=>beginTrail(freshState()));let s=beginTrail(block());assert.equal(s.blockTrail.cursor,0);assert.equal(validateState(s),true);
 const refs=trailSources(s);assert.ok(refs.story.lines.length>=3);assert.ok(refs.dialogue.lines.length>=3);
 assert.equal(s.events.length,0);assert.deepEqual(s.cards,{});
});
test('three context questions are distinct reading evidence, dialogue evidence, full-word pinyin',()=>{
 let s=beginTrail(block());for(const kind of ['reading-evidence','dialogue-evidence','word-pronunciation']){
  const q=trailQuestion(s);assert.equal(q.kind,kind);assert.ok(q.context.length);assert.ok(q.answer);if(q.options)assert.ok(q.options.includes(q.answer));
  s=answerTrail(s,{id:`answer-${kind}`,response:q.answer,at:200+s.blockTrail.cursor});
  assert.equal(s.blockTrail.feedback.correct,true);assert.equal(s.blockTrail.feedback.assisted,false);
  s=nextTrail(s,{id:`next-${kind}`,at:300+s.blockTrail.cursor});
 }
 assert.equal(s.blockTrail,null);assert.equal(trailSummary(s).completed,1);assert.equal(trailSummary(s).independent,3);
 assert.equal(s.events.length,0);assert.deepEqual(s.cards,{});assert.equal(validateState(importBackup(backupDocument(s))),true);
});
test('assistance flag survives backup and cannot be cleared by restarting answer',()=>{
 let s=trailHint(beginTrail(block()));s=importBackup(backupDocument(s));assert.equal(s.blockTrail.assisted,true);
 const q=trailQuestion(s);s=answerTrail(s,{id:'hinted',response:q.answer});assert.equal(s.blockTrailEvents[0].assisted,true);
 assert.throws(()=>answerTrail(s,{id:'again',response:q.answer}));
});
test('answer reveal never awards independent correctness',()=>{
 let s=beginTrail(block());s=answerTrail(s,{id:'reveal',reveal:true});assert.deepEqual({correct:s.blockTrailEvents[0].correct,assisted:s.blockTrailEvents[0].assisted},{correct:false,assisted:true});
 assert.equal(trailSummary(s).independent,0);
});
test('no double submission across a completed trail stage',()=>{
 let s=beginTrail(block());const q=trailQuestion(s);s=answerTrail(s,{id:'first',response:q.answer});assert.throws(()=>answerTrail(s,{id:'first',response:q.answer}));
 s=nextTrail(s,{id:'next'});assert.throws(()=>nextTrail(s,{id:'next'}));
});
test('untrusted malformed trail, orphan session and duplicate event identity rejected',()=>{
 let s=beginTrail(block());s.blockTrail.storyId='not-approved';assert.throws(()=>validateState(s));
 s=beginTrail(block());s.studyBlock=null;assert.throws(()=>validateState(s));
 s=beginTrail(block());s.blockTrailEvents=[{id:'x',blockId:'a',type:'finished',at:100},{id:'x',blockId:'a',type:'finished',at:100}];assert.throws(()=>validateState(s));
});
test('ending block discards only active trail checkpoint, preserving trail observations',()=>{
 let s=beginTrail(block());s=answerTrail(s,{id:'answer1',response:trailQuestion(s).answer});
 s=abandonBlock(s,{id:'end'});assert.equal(s.blockTrail,null);assert.equal(s.blockTrailEvents.length,1);assert.equal(s.events.length,0);assert.equal(validateState(s),true);
});
test('fresh learner skill ledger honestly reports four not-assessed skill facets',()=>{
 const s=freshState(),skills=lessonSkillLedger(s,a);assert.equal(skills.length,4);assert.equal(skills.filter(k=>k.status==='not assessed').length,4);
 assert.equal(blockOverview(s).unresolved,0);assert.equal(personalizedBlockPlan(s,{count:3}).length,3);
});
test('recent independent correct evidence resolves earlier assisted error without rewriting event history',()=>{
 let s=freshState();s.courseEvents=[{id:'mistake',lessonId:a,stage:'recall',correct:false,assisted:true,at:100},{id:'correct',lessonId:a,stage:'recall',correct:true,assisted:false,at:200}];
 assert.equal(lessonSkillLedger(s,a).find(k=>k.skill==='pronunciation').status,'latest independent correct');assert.equal(lessonPriority(s,a).unresolved.some(k=>k.skill==='pronunciation'),false);
 assert.equal(s.courseEvents.length,2);
});
test('last assisted attempt makes skill unresolved, even after earlier independent success',()=>{
 let s=freshState();s.courseEvents=[{id:'correct',lessonId:a,stage:'vocabulary',correct:true,assisted:false,at:100},{id:'hinted',lessonId:a,stage:'vocabulary',correct:true,assisted:true,at:200}];
 assert.equal(lessonPriority(s,a).unresolved.some(k=>k.skill==='vocabulary'),true);
 assert.equal(personalizedBlockPlan(s,{focus:'weak',count:2})[0].lesson.id,a);
});
test('review grades remain untouched by diagnostic reads and context trail',()=>{
 let s=addLesson(freshState(),a,100);s=gradeCard(s,`${a}:reading`,0,200,'r1',{correct:false});const prev=JSON.stringify({events:s.events,cards:s.cards});
 s=startBlock(s,{id:'with-review',count:2,lessonIds:[a,b]});s=beginTrail(s);const q=trailQuestion(s);s=answerTrail(s,{id:'r2',response:q.answer});
 assert.equal(JSON.stringify({events:s.events,cards:s.cards}),prev);
});
test('weak-priority selection retains count and no duplicate lessons',()=>{
 const s=freshState();for(const count of [2,3,4]){const got=selectBlockLessons(s,{focus:'weak',count});assert.equal(got.length,count);assert.equal(new Set(got.map(l=>l.id)).size,count);}
});
test('new UI and service worker register context trail, skill coach and offline modules',async()=>{
 const [app,css,sw]=await Promise.all(['app.mjs','styles.css','sw.js'].map(x=>readFile(`src/${x}`,'utf8')));
 for(const key of ['renderTrailPanel','trail-start','trail-answer','trail-next','blockDailyInsights'])assert.ok(app.includes(key),key);
 assert.match(css,/\.context-trail/);assert.match(sw,/character-study-working-v56/);assert.match(sw,/context-trail\.mjs/);assert.match(sw,/block-coach\.mjs/);
});
