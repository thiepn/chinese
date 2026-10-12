/** Optional demonstration placement: a learning-path suggestion, NEVER mastery, HSK or certification. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
export const PLACEMENT_POSITIONS=Object.freeze([0,5,17,29,47,65]);
export const PLACEMENT_TOTAL=PLACEMENT_POSITIONS.length;
export function placementQuestion(index){
 if(!Number.isInteger(index)||index<0||index>=PLACEMENT_TOTAL)return null;
 const lesson=DEMO_LESSONS[PLACEMENT_POSITIONS[index]];
 const alternatives=DEMO_LESSONS.filter(l=>l.id!==lesson.id && l.meaning!==lesson.meaning)
  .slice(index*7,index*7+3).map(l=>l.meaning);
 const options=[lesson.meaning,...alternatives];
 const step=index%options.length;
 return {lessonId:lesson.id, hanzi:lesson.hanzi, prompt:'Which meaning best matches this character?',answer:lesson.meaning,
  options:[...options.slice(step),...options.slice(0,step)]};
}
export function validatePlacement(p){
 if(p===undefined||p===null)return true;
 if(!p||!['active','completed','skipped'].includes(p.status)||!Array.isArray(p.answers)||p.answers.length>PLACEMENT_TOTAL||
    !p.answers.every((x,i)=>x&&x.lessonId===placementQuestion(i).lessonId&&typeof x.correct==='boolean')||
    (p.status==='active'&&p.answers.length>=PLACEMENT_TOTAL)||
    (p.status==='completed'&&p.answers.length!==PLACEMENT_TOTAL)||
    (p.status==='skipped'&&p.answers.length>PLACEMENT_TOTAL))throw Error('Invalid demonstration placement');
 return true;
}
export function startPlacement(state){if(state.placement?.status==='completed')throw Error('Placement already completed');
 const next=structuredClone(state);next.placement={status:'active',answers:[]};return next;}
export function answerPlacement(state,response){validatePlacement(state.placement);const p=state.placement;
 if(!p||p.status!=='active')throw Error('No active placement');
 const q=placementQuestion(p.answers.length);
 if(typeof response!=='string'||!q.options.includes(response))throw Error('Invalid placement option');
 const next=structuredClone(state);next.placement.answers.push({lessonId:q.lessonId,correct:response===q.answer});
 if(next.placement.answers.length===PLACEMENT_TOTAL)next.placement.status='completed';return next;
}
export function skipPlacement(state){const next=structuredClone(state);next.placement={status:'skipped',answers:[]};return next;}
export function placementSuggestion(state){const p=state.placement;
 if(p?.status!=='completed')return null;
 const correct=p.answers.filter(a=>a.correct).length;
 const firstMiss=p.answers.findIndex(a=>!a.correct);
 // Conservative suggestions only: do not grant lessons or progress from placement.
 const position=firstMiss<0?PLACEMENT_POSITIONS[4]:Math.max(0,firstMiss===0?0:PLACEMENT_POSITIONS[firstMiss-1]);
 const lesson=findLesson(DEMO_LESSONS[position].id);
 return {lessonId:lesson.id,correct,total:PLACEMENT_TOTAL,explanation:'Diagnostic choices guide a suggested starting point only. No lessons have been completed or mastered.'};
}
