/** Batch 12: course remediation & day-plan projections. Demo-only, never scheduled-review mastery. */
import {findLesson,DEMO_LESSONS} from './demo-lessons.mjs';
import {courseQuestion,courseNextLesson,lastCourseCompletion} from './course-journey.mjs';
import {evaluateAnswer} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {dueCards} from './study.mjs';
const SKILLS=['character','vocabulary','sentence','recall'];
const MAX=15000;
const safeId=x=>typeof x==='string'&&x.length>0&&x.length<=100;
function validNow(n){return Number.isFinite(n)&&n>=0;}
function lastIndependentSuccess(events,lessonId,stage){return [...events].reverse().find(e=>e.lessonId===lessonId&&e.stage===stage&&!e.assisted&&e.correct)||null;}
export function unresolvedCourseSkills(state,lessonId){
 if(!findLesson(lessonId))return [];
 const source=[...(state.courseEvents||[]),...(state.courseRepairEvents||[])];
 return SKILLS.flatMap(stage=>{
  const attempts=source.filter(e=>e.lessonId===lessonId&&e.stage===stage);
  const misses=attempts.filter(e=>!e.correct||e.assisted);
  if(!misses.length)return [];
  const lastSuccess=lastIndependentSuccess(attempts,lessonId,stage);
  const pending=misses.filter(e=>!lastSuccess||e.at>lastSuccess.at||(e.at===lastSuccess.at&&e.id!==lastSuccess.id));
  return pending.length?[{stage,errors:pending.length,lastAt:Math.max(...pending.map(e=>e.at)),reason:stage==='recall'?'Pronunciation and tones':stage==='sentence'?'Sentence comprehension':stage==='vocabulary'?'Meaning in a complete word':'Character meaning'}]:[];
 }).sort((a,b)=>b.errors-a.errors||b.lastAt-a.lastAt||SKILLS.indexOf(a.stage)-SKILLS.indexOf(b.stage));
}
export function courseDayPlan(state,now=Date.now()){
 if(!validNow(now))throw Error('Invalid study day');
 const start=new Date(now);start.setHours(0,0,0,0);const dayStart=start.getTime();
 const tomorrow=new Date(start);tomorrow.setDate(tomorrow.getDate()+1);
 const current=state.courseJourney?.lessonId||courseNextLesson(state);
 const recent=state.courseEvents||[];
 const completedToday=recent.filter(e=>e.stage==='completed'&&e.at>=dayStart&&e.at<tomorrow.getTime()).length;
 const lastDone=[...recent].reverse().find(e=>e.stage==='completed'&&e.at<=now);
 const lessonId=lastDone?.lessonId||current;
 const repairs=unresolvedCourseSkills(state,lessonId);
 return {dayStart,dayEnd:tomorrow.getTime(),due:dueCards(state,now).length,completedToday,recommendedLessonId:current,lastCompletedLessonId:lastDone?.lessonId||null,repairLessonId:repairs.length?lessonId:null,repairCount:repairs.length,openJourney:!!state.courseJourney,focus:repairs.length?`Revisit ${repairs[0].reason.toLowerCase()}`:completedToday?'Consolidate your latest lesson':'Start one connected lesson',nextDaySuggestion:state.courseJourney?'Resume your saved lesson checkpoint':repairs.length?'Correct any remaining independent-recall gaps, then review due items':'Review due items and continue the next lesson'};
}
export function validateCourseContinuation(state){
 const history=state.courseRepairEvents;
 if(history!==undefined){
  if(!Array.isArray(history)||history.length>MAX)throw Error('Invalid course repair history');
  const ids=new Set((state.courseEvents||[]).map(e=>e.id));
  for(const e of history){if(!e||!safeId(e.id)||ids.has(e.id)||!findLesson(e.lessonId)||!SKILLS.includes(e.stage)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!validNow(e.at)||!safeId(e.sessionId))throw Error('Invalid course repair event');ids.add(e.id);}
 }
 const s=state.courseRepairSession;
 if(s!==undefined&&s!==null){
  if(!s||!safeId(s.id)||!findLesson(s.lessonId)||!Array.isArray(s.stages)||!s.stages.length||s.stages.length>4||new Set(s.stages).size!==s.stages.length||!s.stages.every(v=>SKILLS.includes(v))||!Number.isInteger(s.index)||s.index<0||s.index>=s.stages.length||typeof s.assistanceUsed!=='boolean'||!validNow(s.startedAt)||(s.wordIndex!==undefined&&![0,1].includes(s.wordIndex))|| (s.feedback!==null&&(!s.feedback||typeof s.feedback.correct!=='boolean'||typeof s.feedback.assisted!=='boolean'||(s.feedback.reason!==undefined&&(typeof s.feedback.reason!=='string'||s.feedback.reason.length>32))||typeof s.feedback.message!=='string'||s.feedback.message.length>400)))throw Error('Invalid course repair checkpoint');
 }
 return true;
}
export function startCourseRepair(state,lessonId,{id,now=Date.now()}={}){
 if(!findLesson(lessonId)||!safeId(id)||!validNow(now))throw Error('Invalid repair session');
 if(state.courseRepairSession)throw Error('Finish the saved remediation first');
 const pending=unresolvedCourseSkills(state,lessonId);
 const stages=pending.length?pending.map(x=>x.stage):['vocabulary','sentence','recall'];
 const next=structuredClone(state);const last=[...(state.courseEvents||[])].reverse().find(e=>e.lessonId===lessonId&&e.wordIndex!==undefined);const wordIndex=state.courseJourney?.lessonId===lessonId?state.courseJourney.wordIndex||0:last?.wordIndex||0;next.courseRepairSession={id,lessonId,stages,index:0,feedback:null,assistanceUsed:false,startedAt:now,wordIndex};validateCourseContinuation(next);return next;
}
export function repairQuestion(session){if(!session)return null;const stage=session.stages[session.index];const index={character:1,vocabulary:2,sentence:3,recall:4}[stage];return {...courseQuestion({lessonId:session.lessonId,cursor:index,wordIndex:session.wordIndex||0}),stage};}
export function useRepairHint(state){const s=state.courseRepairSession;if(!s||s.feedback)throw Error('No active unanswered remediation');const next=structuredClone(state);next.courseRepairSession.assistanceUsed=true;return next;}
export function answerCourseRepair(state,{response='',reveal=false,id,now=Date.now()}={}){
 const s=state.courseRepairSession;if(!s||s.feedback||!safeId(id)||!validNow(now))throw Error('No active remediation assessment');
 if([...(state.courseRepairEvents||[]),...(state.courseEvents||[])].some(e=>e.id===id))throw Error('Duplicate remediation attempt');
 if(!reveal&&!String(response).trim())throw Error('An answer is required');
 const q=repairQuestion(s);
 const result=reveal?{correct:false,message:'Answer revealed; this attempt is assisted.'}:q.kind==='pinyin'?toneExplanation(response,q.answer):evaluateAnswer(response,q.answer,'choice');
 const assisted=!!s.assistanceUsed||!!reveal;
 const next=structuredClone(state);next.courseRepairEvents??=[];
 next.courseRepairEvents.push({id,sessionId:s.id,lessonId:s.lessonId,stage:q.stage,correct:!!result.correct,assisted,at:now});
 next.courseRepairSession.feedback={correct:!!result.correct,assisted,reason:String(result.reason||'').slice(0,32),message:String(result.detail||result.message||'Compare your answer with the reference.').slice(0,400)};
 validateCourseContinuation(next);return next;
}
export function advanceCourseRepair(state){const s=state.courseRepairSession;if(!s||!s.feedback)throw Error('Check the answer before continuing');const next=structuredClone(state);next.courseRepairSession=s.index===s.stages.length-1?null:{...s,index:s.index+1,feedback:null,assistanceUsed:false};validateCourseContinuation(next);return next;}
export function abandonCourseRepair(state){const next=structuredClone(state);next.courseRepairSession=null;return next;}
export function courseRepairSummary(state){const events=state.courseRepairEvents||[];return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,assisted:events.filter(e=>e.assisted).length,missed:events.filter(e=>!e.correct).length};}
