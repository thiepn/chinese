import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {startPlacement,answerPlacement,skipPlacement,placementQuestion,placementSuggestion,validatePlacement,PLACEMENT_TOTAL} from '../src/placement.mjs';
import {sentenceAssessment,validateSentenceAssessments,SENTENCE_MODES} from '../src/sentence-assessment.mjs';
import {remediationPlan,skillDiagnostics,weeklyEvidence} from '../src/learning-coach.mjs';
import {createGuidedSession,guidedQuestion,recordGuidedAnswer,advanceGuidedSession,validateGuidedSession,evaluateGuided} from '../src/guided-session.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {addDrillRecord} from '../src/practice-records.mjs';
import {addReadingEvent,READING_MODES} from '../src/reader-records.mjs';
const now=Date.parse('2026-10-12T12:00:00Z');

test('complete authored content from previous five batches remains available',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);
 assert.ok(DEMO_LESSONS.slice(0,74).every(l=>l.words.length===2));
 assert.ok(!DEMO_LESSONS.some(l=>Number.isInteger(l.officialHskLevel)));
});
test('placement questions are stable six unique complete four-option questions',()=>{
 assert.equal(PLACEMENT_TOTAL,6);const questions=Array.from({length:PLACEMENT_TOTAL},(_,i)=>placementQuestion(i));
 assert.equal(new Set(questions.map(q=>q.lessonId)).size,6);
 for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options.includes(q.answer));}
 assert.equal(placementQuestion(-1),null);assert.equal(placementQuestion(PLACEMENT_TOTAL),null);
});
test('placement works across resumable checkpointed answers without granting mastery',()=>{
 let state=freshState();const cards=structuredClone(state.cards);
 state=startPlacement(state);validateState(state);
 for(let i=0;i<PLACEMENT_TOTAL;i++){
  const q=placementQuestion(i);const prior=state;
  state=answerPlacement(state,i%2===0?q.answer:q.options.find(x=>x!==q.answer));
  assert.equal(prior.placement.answers.length,i,'prior state unmodified');
  assert.equal(state.placement.answers.length,i+1);validateState(state);
 }
 assert.equal(state.placement.status,'completed');assert.equal(state.placement.answers.filter(x=>x.correct).length,3);
 assert.equal(placementSuggestion(state).correct,3);assert.deepEqual(state.cards,cards);assert.equal(state.events.length,0);assert.equal(state.learned.length,0);
 assert.throws(()=>answerPlacement(state,placementQuestion(0).answer),/No active/);
 const restored=importBackup(JSON.parse(JSON.stringify(backupDocument(state))));
 assert.deepEqual(restored.placement,state.placement);
});
test('placement can be skipped without changing learner history',()=>{
 const original=freshState();const next=skipPlacement(startPlacement(original));
 assert.equal(next.placement.status,'skipped');assert.equal(placementSuggestion(next),null);
 assert.equal(next.events.length,0);assert.equal(next.learned.length,0);
 assert.equal(original.placement,null);
});
test('invalid placement options and tampered backup fields fail closed',()=>{
 const active=startPlacement(freshState());
 assert.throws(()=>answerPlacement(active,'anything goes'),/Invalid placement/);
 assert.throws(()=>validatePlacement({status:'completed',answers:[]}),/Invalid demonstration/);
 assert.throws(()=>validateState({...active,placement:{status:'active',answers:[{lessonId:'fake',correct:true}]}}),/Invalid demonstration/);
 const old=freshState();delete old.placement;delete old.practiceSession;
 const recovered=importBackup(JSON.parse(JSON.stringify(backupDocument(old))));
 assert.equal(validateState(recovered),true);
});
test('two distinct connected sentence tasks available across all 12 demo readings',()=>{
 assert.deepEqual(SENTENCE_MODES,['line-meaning','line-order']);
 assert.equal(validateSentenceAssessments(),true);
 for(const story of STORIES){
  const meaning=sentenceAssessment(story.id,'line-meaning');
  assert.equal(meaning.kind,'choice');assert.ok(meaning.options.includes(meaning.answer));
  assert.equal(meaning.options.length,4);assert.ok(meaning.hanzi);
  const order=sentenceAssessment(story.id,'line-order');
  assert.equal(order.kind,'ordering');assert.equal(order.chunks.length,story.lines.length);
  assert.equal(order.chunks.join(''),order.answer);
 }
 assert.equal(sentenceAssessment('unapproved-story','line-order'),null);
});
test('sentence sessions grade correctly and store reading events without scheduled credit',()=>{
 for(const mode of ['line-meaning','line-order']){
  const s=freshState();s.practiceSession={id:`test-${mode}`,limit:5,cursor:0,correct:0,assisted:0,feedback:null,startedAt:now,
   items:[...Array(5)].map(()=>({type:'story',id:STORIES[0].id,mode}))};
  validateGuidedSession(s.practiceSession);const q=guidedQuestion(s.practiceSession);
  const next=recordGuidedAnswer(s,{response:q.answer,order:q.chunks?.map((_,i)=>i)||[],eventId:`event-${mode}`,now});
  assert.equal(next.practiceSession.feedback.correct,true);
  assert.equal(next.events.length,0);assert.deepEqual(next.cards,s.cards);
  assert.equal(next.readingEvents[0].mode,mode);
  const continued=advanceGuidedSession(next);assert.equal(continued.practiceSession.cursor,1);
  assert.equal(importBackup(backupDocument(continued)).readingEvents[0].mode,mode);
 }
});
test('new guided session sentence-only mode and pronunciation mode remain valid',()=>{
 let state=freshState();for(const l of DEMO_LESSONS.slice(0,8))state=addLesson(state,l.id,now);
 for(const focus of ['sentences','pronunciation','weak']){
  const sess=createGuidedSession(state,{limit:20,focus,id:`focus-${focus}`,now});
  assert.equal(validateGuidedSession(sess),true);
  for(let cursor=0;cursor<sess.limit;cursor++){
   const q=guidedQuestion({...sess,cursor});assert.ok(q);
   if(q.kind==='choice')assert.ok(q.options.includes(q.answer));
   const result=evaluateGuided(q,q.answer,q.chunks?.map((_,i)=>i)||[]);assert.equal(result.correct,true,`${focus}: ${q.mode}`);
  }
  if(focus==='sentences')assert.ok(sess.items.every(item=>item.type==='story'));
  if(focus==='pronunciation')assert.ok(sess.items.every(item=>item.type==='drill'&&['word-pinyin','reading-choice'].includes(item.mode)));
 }
});
test('weak focus specifically selects pinyin practice for observed pronunciation errors',()=>{
 let s=addLesson(freshState(),DEMO_LESSONS[0].id,now);
 s=gradeCard(s,`${DEMO_LESSONS[0].id}:reading`,0,now+100,'tone-miss',{correct:false,errorType:'tone'});
 const sess=createGuidedSession(s,{limit:5,focus:'weak',id:'tone-weak',now:now+200});
 assert.equal(sess.items[0].id,DEMO_LESSONS[0].id);
 assert.equal(sess.items[0].mode,'word-pinyin');
});
test('coaching uses actual mistakes across scheduled reviews and extra practice',()=>{
 let s=addLesson(freshState(),DEMO_LESSONS[0].id,now);
 s=gradeCard(s,`${DEMO_LESSONS[0].id}:reading`,0,now+100,'err-pron',{correct:false,errorType:'tone'});
 s=addDrillRecord(s,DEMO_LESSONS[0].id,'word-meaning',false,false,'err-mean',now+200);
 const plan=remediationPlan(s,{now:now+300});
 assert.ok(plan.some(x=>x.skill==='pronunciation'&&x.misses===1));
 assert.ok(plan.some(x=>x.skill==='meaning'&&x.misses===1));
 const diagnostics=skillDiagnostics(s);
 assert.ok(diagnostics.find(x=>x.id==='pronunciation').reviewedErrors>0);
 assert.ok(diagnostics.find(x=>x.id==='meaning').practiceErrors>0);
});
test('weekly evidence keeps scheduled and supplemental attempts separate',()=>{
 let s=addLesson(freshState(),DEMO_LESSONS[0].id,now-2e3);
 s=gradeCard(s,`${DEMO_LESSONS[0].id}:meaning`,2,now-2e3,'good',{correct:true});
 s=addDrillRecord(s,DEMO_LESSONS[0].id,'recognition',true,true,'assisted',now-1e3);
 s=addReadingEvent(s,STORIES[0].id,'comprehension',true,false,'independent',now-500);
 const w=weeklyEvidence(s,now);
 assert.equal(w.current.attempts,3);assert.equal(w.current.independentCorrect,2);
 assert.equal(w.current.assisted,1);assert.equal(w.current.scheduled,1);assert.equal(w.current.practice,2);
});
test('reading-mode extension preserves existing event history and rejects unsupported types',()=>{
 for(const old of ['comprehension','cloze','ordering','pronunciation'])assert.ok(READING_MODES.includes(old));
 assert.ok(READING_MODES.includes('line-meaning'));
 assert.ok(READING_MODES.includes('line-order'));
 assert.throws(()=>addReadingEvent(freshState(),STORIES[0].id,'fabricated',true,false,'fake'),/Invalid reading/);
});
test('new UI sections are connected to navigation, storage gating and lesson teaching',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const key of ['onboardingPanel','coachPanel','lessonQuiz','storage-check','placement-restart','lesson-check-submit','guidedReadingContext','coach-analytics','line-order','review-pick'])assert.ok(app.includes(key),key);
 const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');assert.ok(html.includes('data-route="practice"'));
});
test('offline shell caches all imported batch6 modules with a qualified newer cache revision',()=>{
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 for(const module of ['placement.mjs','learning-coach.mjs','sentence-assessment.mjs','guided-session.mjs','study.mjs','practice-records.mjs'])assert.ok(sw.includes(`'./${module}'`),module);
 assert.match(sw,/character-study-working-v(?:[7-9]|[1-9][0-9])/,'cache revision must advance beyond Batch 6');
});
