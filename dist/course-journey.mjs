/** Cohesive original-demo course progression. No certified HSK content or scheduled-review credit. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {makeOptions,evaluateAnswer} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {lessonGroups} from './study-groups.mjs';

export const COURSE_STAGES=Object.freeze(['prepare','character','vocabulary','sentence','recall','followup']);
const MAX_EVENTS=15000;
const eventStages=new Set([...COURSE_STAGES,'completed']);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function safeId(id){return typeof id==='string'&&id.length>0&&id.length<=100;}
export function validateCourseExtensions(state){
 const j=state.courseJourney;
 if(j!==undefined&&j!==null){
  if(!j||!findLesson(j.lessonId)||!safeId(j.id)||!Number.isInteger(j.cursor)||j.cursor<0||j.cursor>=COURSE_STAGES.length||(j.wordIndex!==undefined&&![0,1].includes(j.wordIndex))||!Number.isFinite(j.startedAt)||j.startedAt<0||typeof j.assistanceUsed!=='boolean'||(j.feedback!==null&&(!j.feedback||typeof j.feedback.correct!=='boolean'||typeof j.feedback.assisted!=='boolean'||(j.feedback.reason!==undefined&&(typeof j.feedback.reason!=='string'||j.feedback.reason.length>32))||typeof j.feedback.message!=='string'||j.feedback.message.length>400)))throw Error('Invalid course checkpoint');
 }
 if(state.courseEvents!==undefined){if(!Array.isArray(state.courseEvents)||state.courseEvents.length>MAX_EVENTS)throw Error('Invalid course event history');const ids=new Set();for(const e of state.courseEvents){if(!e||!safeId(e.id)||ids.has(e.id)||!findLesson(e.lessonId)||!eventStages.has(e.stage)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0||(e.wordIndex!==undefined&&![0,1].includes(e.wordIndex)))throw Error('Invalid course event');ids.add(e.id);}}
 return true;
}
export function startCourse(state,lessonId,{id,now=Date.now()}={}){
 if(!findLesson(lessonId)||!safeId(id)||!Number.isFinite(now)||now<0)throw Error('Invalid original-demo journey');
 if(state.courseJourney)throw Error('Pause or finish your active journey before replacing it');
 const next=structuredClone(state);const repeats=(state.courseEvents||[]).filter(e=>e.lessonId===lessonId&&e.stage==='completed').length;next.courseJourney={id,lessonId,cursor:0,feedback:null,assistanceUsed:false,startedAt:now,wordIndex:repeats%2};return next;
}
export function courseQuestion(j){if(!j)return null;const lesson=findLesson(j.lessonId);if(!lesson)return null;const stage=COURSE_STAGES[j.cursor];
 if(stage==='prepare')return {stage,kind:'prepare',prompt:'Preview your learning connections',context:lesson.note,answer:null};
 if(stage==='character'){const options=[lesson.meaning,...DEMO_LESSONS.filter(l=>l.id!==lesson.id).slice((lesson.order*3)%64,(lesson.order*3)%64+3).map(l=>l.meaning)];return {stage,kind:'choice',prompt:`What does ${lesson.hanzi} mean in this lesson?`,hanzi:lesson.hanzi,answer:lesson.meaning,options:[...new Set(options)].sort((a,b)=>((a.length*11+lesson.order)%17)-((b.length*11+lesson.order)%17)||a.localeCompare(b))};}
 if(stage==='vocabulary'){const word=lesson.words[j.wordIndex===1?1:0];return {stage,kind:'choice',prompt:`What does ${word.hanzi} mean in this word?`,hanzi:word.hanzi,answer:word.english,options:makeOptions(word.english,'word',lesson.id)};}
 if(stage==='sentence'){
  const word=lesson.words.find(w=>lesson.sentence.hanzi.includes(w.hanzi));
  if(j.wordIndex===1&&word){
    const rivals=DEMO_LESSONS.filter(l=>l.id!==lesson.id).map(l=>l.words[0].hanzi).filter(w=>w!==word.hanzi&&w.length===word.hanzi.length).slice(lesson.order%10,lesson.order%10+3);
    const options=[...new Set([word.hanzi,...rivals])];
    if(options.length>=2)return {stage,kind:'choice',prompt:'Complete the sentence with the matching Chinese word.',hanzi:lesson.sentence.hanzi.replace(word.hanzi,'＿＿'),answer:word.hanzi,options};
  }
  return {stage,kind:'choice',prompt:'Select the meaning of this sentence.',hanzi:lesson.sentence.hanzi,answer:lesson.sentence.english,options:makeOptions(lesson.sentence.english,'sentence',lesson.id)};
 }
 if(stage==='recall'){if(j.wordIndex===1){const word=lesson.words[1];return {stage,kind:'pinyin',prompt:'Recall the complete vocabulary word pronunciation, including every lexical tone.',hanzi:word.hanzi,answer:word.pinyin};}return {stage,kind:'pinyin',prompt:'Recall the character pronunciation, with the correct tone.',hanzi:lesson.hanzi,answer:lesson.pinyin};}
 return {stage,kind:'followup',prompt:'Finish your learning journey',answer:null};
}
export function useCourseHint(state){const j=state.courseJourney;if(!j||j.feedback)throw Error('No active unanswered journey checkpoint');const next=structuredClone(state);next.courseJourney.assistanceUsed=true;return next;}
export function answerCourse(state,{response='',reveal=false,id,now=Date.now()}={}){
 const j=state.courseJourney;if(!j||j.feedback||j.cursor===0||j.cursor===5)throw Error('No active assessment checkpoint');
 if(!safeId(id)||!Number.isFinite(now)||now<0)throw Error('Invalid course event identity');
 if((state.courseEvents||[]).some(e=>e.id===id))throw Error('Duplicate course event');
 const question=courseQuestion(j);if(!reveal&&!String(response).trim())throw Error('Answer the question before checking');
 const result=reveal?{correct:false,reason:'revealed',message:'Reference shown; independent success was not awarded.'}:question.kind==='pinyin'?toneExplanation(response,question.answer):evaluateAnswer(response,question.answer,'choice');
 const assisted=!!j.assistanceUsed||!!reveal;
 const next=structuredClone(state);next.courseEvents??=[];next.courseEvents.push({id,lessonId:j.lessonId,stage:question.stage,correct:!!result.correct,assisted,at:now,wordIndex:j.wordIndex===1?1:0});next.courseJourney.feedback={correct:!!result.correct,assisted,reason:String(result.reason||'').slice(0,32),message:String(result.detail||result.message||'Review the reference.').slice(0,400)};validateCourseExtensions(next);return next;
}
export function advanceCourse(state){const j=state.courseJourney;if(!j||j.cursor>=5||(j.cursor!==0&&!j.feedback))throw Error('Finish the current checkpoint first');const next=structuredClone(state);next.courseJourney={...j,cursor:j.cursor+1,feedback:null,assistanceUsed:false};return next;}
export function finishCourse(state,{id,now=Date.now()}={}){
 const j=state.courseJourney;if(!j||j.cursor!==5||!safeId(id)||!Number.isFinite(now)||now<0)throw Error('Follow-up stage is not ready');
 if((state.courseEvents||[]).some(e=>e.id===id))throw Error('Duplicate course event');
 const next=structuredClone(state);next.courseEvents??=[];next.courseEvents.push({id,lessonId:j.lessonId,stage:'completed',correct:true,assisted:false,at:now,wordIndex:j.wordIndex===1?1:0});next.courseJourney=null;validateCourseExtensions(next);return next;
}
export function pauseCourse(state){const next=structuredClone(state);next.courseJourney=null;return next;}
export function lastCourseCompletion(state,id){return [...(state.courseEvents||[])].reverse().find(e=>e.lessonId===id&&e.stage==='completed')||null;}
export function courseMetrics(state){const all=state.courseEvents||[],finished=new Set(all.filter(e=>e.stage==='completed').map(e=>e.lessonId)),independent=all.filter(e=>e.stage!=='completed'&&e.correct&&!e.assisted),attempts=all.filter(e=>e.stage!=='completed');return {finished:finished.size,attempts:attempts.length,independent:independent.length,assisted:attempts.filter(e=>e.assisted).length,missed:attempts.filter(e=>!e.correct).length,active:state.courseJourney?.lessonId||null};}
export function lessonPrerequisites(lessonId,state){const l=findLesson(lessonId);if(!l)return [];
 const earlier=DEMO_LESSONS.filter(x=>x.order<l.order);const links=earlier.filter(x=>l.words.some(w=>x.words.some(z=>z.hanzi===w.hanzi))||l.words.some(w=>w.hanzi.includes(x.hanzi))||l.sentence.hanzi.includes(x.hanzi)).slice(-3);
 const previous=earlier.at(-1);if(previous&&!links.some(x=>x.id===previous.id))links.unshift(previous);
 return links.slice(0,3).map(x=>({id:x.id,hanzi:x.hanzi,meaning:x.meaning,studied:state.learned.includes(x.id),reason:x.id===previous?.id?'Previous course lesson':'A related character or vocabulary connection'}));
}
export function courseConnections(lessonId){const l=findLesson(lessonId);if(!l)return {words:[],readings:[],dialogues:[]};
 const words=l.words.map(w=>({hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english}));const matches=lines=>lines.some(line=>words.some(w=>line.hanzi.includes(w.hanzi)));
 return {words,readings:STORIES.filter(s=>matches(s.lines)).slice(0,4).map(s=>({id:s.id,title:s.title})),dialogues:DIALOGUES.filter(d=>matches(d.lines)).slice(0,3).map(d=>({id:d.id,title:d.title}))};
}
export function courseUnitMilestones(state){return lessonGroups().map(g=>{const complete=g.lessons.filter(l=>lastCourseCompletion(state,l.id)).length;return {id:g.index,title:g.name,total:g.lessons.length,completed:complete,introduced:g.lessons.filter(l=>state.learned.includes(l.id)).length,achieved:complete===g.lessons.length};});}
export function courseNextLesson(state){return state.courseJourney?.lessonId||DEMO_LESSONS.find(l=>!lastCourseCompletion(state,l.id))?.id||DEMO_LESSONS[0].id;}
