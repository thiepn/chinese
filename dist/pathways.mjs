/** Explainable study sequence based on exposure and observed skills; not an HSK level. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {lessonGroups,dueCards,cardInfo} from './study.mjs';
export function lessonPath(state,{limit=6}={}){
 const introduced=new Set(state.learned);const results=[];
 const deficits=new Map();for(const event of state.events||[]){const id=event.cardId?.split(':')[0];if(!findLesson(id))continue;const prev=deficits.get(id)||0;deficits.set(id,event.correct===false||event.grade===0?Math.min(8,prev+2):Math.max(0,prev-1));}
 const due=new Map();for(const card of dueCards(state)){const id=cardInfo(card)?.lesson.id;if(id)due.set(id,(due.get(id)||0)+1);}
 const next=DEMO_LESSONS.find(l=>!introduced.has(l.id));
 if(next)results.push({id:next.id,kind:'new',reason:'Next unintroduced lesson in the demonstration sequence',score:200});
 for(const lesson of DEMO_LESSONS){if(!introduced.has(lesson.id))continue;const misses=deficits.get(lesson.id)||0,overdue=due.get(lesson.id)||0;if(misses||overdue)results.push({id:lesson.id,kind:'revisit',reason:misses?`${misses} remaining error-priority signals`:`${overdue} due skill checks`,score:40+misses*4+overdue});}
 if(!results.length){const lesson=DEMO_LESSONS[0];results.push({id:lesson.id,kind:'explore',reason:'Revisit an original demonstration lesson',score:0});}
 return results.sort((a,b)=>b.score-a.score||findLesson(a.id).order-findLesson(b.id).order).slice(0,Math.max(1,Math.min(15,limit))).map(r=>({...r,lesson:findLesson(r.id)}));
}
export function unitOverview(state){return lessonGroups().map(unit=>{const introduced=unit.lessons.filter(l=>state.learned.includes(l.id)).length;const next=unit.lessons.find(l=>!state.learned.includes(l.id));return {index:unit.index,name:unit.name,total:unit.lessons.length,introduced,next:next?.id||null,status:introduced===unit.lessons.length?'Introduced':introduced?'In progress':'Not started'};});}
