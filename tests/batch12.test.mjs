import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState,validateState,addLesson,gradeCard} from '../src/study.mjs';
import {startCourse,advanceCourse,courseQuestion,answerCourse,finishCourse} from '../src/course-journey.mjs';
import {unresolvedCourseSkills,courseDayPlan,startCourseRepair,repairQuestion,useRepairHint,answerCourseRepair,advanceCourseRepair,abandonCourseRepair,courseRepairSummary,validateCourseContinuation} from '../src/course-continuation.mjs';
import {importBackup,backupDocument} from '../src/study-storage.mjs';
const lesson=DEMO_LESSONS[1],at=Date.parse('2026-10-12T13:00:00Z');
const begin=(state=freshState(),lessonId=lesson.id)=>advanceCourse(startCourse(state,lessonId,{id:'j-1',now:at}));
const record=(s,ans,{id='a1',t=at+100,reveal=false}={})=>answerCourse(s,{id,now:t,response:ans,reveal});
const q=(s)=>courseQuestion(s.courseJourney);
function finishAttempt(s,{badStage='character',assist=false}={}){
 let out=begin(s);for(let i=1;i<=4;i++){
  const item=q(out);const answer= item.stage===badStage?'an incorrect learning response':item.answer;
  if(item.stage===badStage&&assist)out=record(out,answer,{id:`stage-${i}`,t:at+i*100,reveal:true});
  else out=record(out,answer,{id:`stage-${i}`,t:at+i*100});
  out=advanceCourse(out);
 }
 return finishCourse(out,{id:'done-1',now:at+500});
}
test('Batch 12 retains every old demo lesson and only original demonstration source status',()=>{assert.ok(DEMO_LESSONS.length>=74);assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null&&l.approval==='DEMO_ONLY'));});
test('fresh state has optional repair fields; legacy v1 backup omitting them is valid',()=>{const state=freshState();assert.deepEqual(state.courseRepairEvents,[]);assert.equal(state.courseRepairSession,null);delete state.courseRepairEvents;delete state.courseRepairSession;assert.equal(validateState(state),true);assert.equal(importBackup(backupDocument(state)).version,1);});
test('first course sees the first word, a repeated guided course assesses a different contextual word',()=>{let s=begin();assert.equal(q({...s,courseJourney:{...s.courseJourney,cursor:2}}).answer,lesson.words[0].english);s=finishAttempt(freshState(),{badStage:'nonsense'});s=advanceCourse(startCourse(s,lesson.id,{id:'j-repeat',now:at+10000}));assert.equal(q({...s,courseJourney:{...s.courseJourney,cursor:2}}).answer,lesson.words[1].english);});
test('an incorrect character checkpoint becomes independent remediation rather than scheduled mastery',()=>{let s=finishAttempt(freshState());assert.ok(unresolvedCourseSkills(s,lesson.id).some(x=>x.stage==='character'));assert.equal(s.events.length,0);assert.equal(Object.keys(s.cards).length,0);});
test('remediation picks the missed skill and provides answerable item',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});assert.deepEqual(s.courseRepairSession.stages,['character']);const item=repairQuestion(s.courseRepairSession);assert.equal(item.stage,'character');assert.ok(item.options.includes(item.answer));});
test('independent remediation correct answer closes the weakness without scheduled review credit',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});s=answerCourseRepair(s,{response:repairQuestion(s.courseRepairSession).answer,id:'repair-response-1',now:at+700});assert.deepEqual(unresolvedCourseSkills(s,lesson.id),[]);assert.equal(s.events.length,0);assert.equal(Object.keys(s.cards).length,0);s=advanceCourseRepair(s);assert.equal(s.courseRepairSession,null);assert.equal(courseRepairSummary(s).independent,1);});
test('help and reveal are recorded as assisted and do not close weakness',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});s=useRepairHint(s);s=answerCourseRepair(s,{response:repairQuestion(s.courseRepairSession).answer,id:'repair-response-1',now:at+700});assert.equal(s.courseRepairEvents[0].assisted,true);assert.equal(unresolvedCourseSkills(s,lesson.id).length,1);s=advanceCourseRepair(s);assert.equal(s.courseRepairSession,null);});
test('reveal never creates independent success',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});s=answerCourseRepair(s,{reveal:true,id:'repair-response-1',now:at+700});assert.equal(s.courseRepairEvents[0].assisted,true);assert.equal(s.courseRepairEvents[0].correct,false);});
test('duplicate remediation event ids are rejected atomically',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});s=answerCourseRepair(s,{reveal:true,id:'repair-response-1',now:at+700});assert.throws(()=>answerCourseRepair(s,{response:'ok',id:'repair-response-1',now:at+710}));assert.equal(s.courseRepairEvents.length,1);});
test('resuming an unfinished repair retains the assistance flag and checkpoint in a v1 backup',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});s=useRepairHint(s);const restored=importBackup(JSON.parse(JSON.stringify(backupDocument(s))));assert.equal(restored.courseRepairSession.assistanceUsed,true);assert.equal(repairQuestion(restored.courseRepairSession).stage,'character');assert.equal(validateState(restored),true);});
test('abandoning repair keeps historical learning events and prior cards',()=>{let s=addLesson(finishAttempt(freshState()),lesson.id,at+1000);const cards=structuredClone(s.cards);s=startCourseRepair(s,lesson.id,{id:'repair1',now:at+1200});s=abandonCourseRepair(s);assert.equal(s.courseRepairSession,null);assert.deepEqual(s.cards,cards);assert.equal(s.courseEvents.length,5);});
test('repair may be interrupted while saved journey continues independently',()=>{let s=begin();s=record(s,'bad',{t:at+1});s=advanceCourse(s);s=startCourseRepair(s,lesson.id,{id:'repair1',now:at+200});assert.equal(s.courseJourney.cursor,2);s=useRepairHint(s);s=abandonCourseRepair(s);assert.equal(s.courseJourney.cursor,2);assert.equal(s.courseJourney.assistanceUsed,false);});
test('validators reject duplicate, forged, nonsensical or cross-history conflicting repair events',()=>{const s=finishAttempt(freshState());const base={id:'bad1',sessionId:'repair1',lessonId:lesson.id,stage:'character',correct:false,assisted:false,at};for(const ev of [{...base,stage:'completed'},{...base,lessonId:'not-a-real-lesson'},{...base,at:NaN},{...base,id:'stage-1'}]){assert.throws(()=>validateState({...s,courseRepairEvents:[ev]}));}assert.throws(()=>validateState({...s,courseRepairEvents:[base,base]}));});
test('invalid saved repair index, missing stage, or unusable hint is rejected',()=>{let s=startCourseRepair(finishAttempt(freshState()),lesson.id,{id:'repair1',now:at+600});for(const r of [{...s.courseRepairSession,index:3},{...s.courseRepairSession,stages:[]},{...s.courseRepairSession,assistanceUsed:'yes'}])assert.throws(()=>validateCourseContinuation({...s,courseRepairSession:r}));s=useRepairHint(s);assert.throws(()=>useRepairHint({...s,courseRepairSession:{...s.courseRepairSession,feedback:{correct:true,assisted:true,message:'done'}}}));});
test('next-day study plan represents due cards but never assigns completion to new day',()=>{let s=addLesson(finishAttempt(freshState()),lesson.id,at+1000);const today=courseDayPlan(s,at+1500);assert.equal(today.completedToday,1);assert.equal(today.repairCount,1);assert.equal(today.due,6);const following=courseDayPlan(s,at+86400000);assert.equal(following.completedToday,0);assert.ok(following.nextDaySuggestion.includes('Correct'));});
test('a regular scheduled review event is not replaced by a supplemental remediation event',()=>{let s=addLesson(finishAttempt(freshState()),lesson.id,at+1000);const target=`${lesson.id}:meaning`;s=gradeCard(s,target,2,at+1500,'real-review',{correct:true,assisted:false});const before=structuredClone(s.events),cards=structuredClone(s.cards);s=startCourseRepair(s,lesson.id,{id:'repair1',now:at+1600});s=answerCourseRepair(s,{response:repairQuestion(s.courseRepairSession).answer,id:'new',now:at+1700});assert.deepEqual(s.events,before);assert.deepEqual(s.cards,cards);});
test('all 74 demo lessons offer answerable optional remediation checks',()=>{for(const l of DEMO_LESSONS){let s=startCourseRepair(freshState(),l.id,{id:'r1',now:at});assert.ok(s.courseRepairSession.stages.length>=2);for(const stage of s.courseRepairSession.stages){const index=s.courseRepairSession.stages.indexOf(stage);const item=repairQuestion({...s.courseRepairSession,index});assert.ok(item.answer);if(item.kind==='choice')assert.ok(item.options.includes(item.answer),l.id);}}});
test('app and service worker ship repair module and expose the course follow-up UI',()=>{const a=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');assert.match(a,/course-repair-start/);assert.match(a,/repair-entry/);assert.match(a,/next-day study sequence/);assert.match(sw,/course-continuation\.mjs/);assert.match(sw,/working-v86/);});
test('repeated journey tracks the second vocabulary word into later targeted correction',()=>{
 let s=finishAttempt(freshState(),{badStage:'nonsense'});
 s=advanceCourse(startCourse(s,lesson.id,{id:'j-repeat',now:at+10000}));
 s=record(s,courseQuestion(s.courseJourney).answer,{id:'repeat1',t:at+10100});s=advanceCourse(s);
 const second=courseQuestion(s.courseJourney);assert.equal(second.answer,lesson.words[1].english);
 s=record(s,'incorrect contextual word sense',{id:'repeat2',t:at+10200});s=advanceCourse(s);
 for(const [id,t] of [['repeat3',10300],['repeat4',10400]]){s=record(s,courseQuestion(s.courseJourney).answer,{id,t:at+t});s=advanceCourse(s);}
 s=finishCourse(s,{id:'done2',now:at+10500});
 s=startCourseRepair(s,lesson.id,{id:'repair-repeat',now:at+11000});
 assert.equal(s.courseRepairSession.wordIndex,1);
 assert.equal(repairQuestion(s.courseRepairSession).answer,lesson.words[1].english);
});
test('second guided pass can use genuine contextual sentence cloze without exposing its missing word',()=>{
 const matching=DEMO_LESSONS.find(l=>l.words.some(w=>l.sentence.hanzi.includes(w.hanzi)));
 assert.ok(matching);
 const q=courseQuestion({lessonId:matching.id,cursor:3,wordIndex:1});
 assert.equal(q.kind,'choice');assert.ok(q.options.includes(q.answer));
 if(q.prompt.includes('Complete the sentence')){assert.ok(q.hanzi.includes('＿＿'));assert.ok(!q.hanzi.includes(q.answer));}
});
