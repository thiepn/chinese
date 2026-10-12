/** Transparent, non-calibrated recommendations based on observed learner activity. */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {dueCards} from './study.mjs';
export function lessonRecommendations(state,now=Date.now(),limit=4){
 const introduced=new Set(state.learned),due=new Set(dueCards(state,now));
 const result=DEMO_LESSONS.map((lesson,index)=>{
  const prefix=lesson.id+':';const events=state.events.filter(e=>e.cardId.startsWith(prefix));
  const failures=events.filter(e=>e.correct===false||e.grade===0).length;
  const correctIndependent=events.filter(e=>e.correct===true&&!e.assisted).length;
  const matchingDue=[...due].filter(id=>id.startsWith(prefix)).length;
  const recentErrors=events.slice(-5).filter(e=>e.correct===false||e.assisted===true).length;
  const supplemental=(state.drillEvents||[]).filter(e=>e.lessonId===lesson.id);
  const extraErrors=supplemental.slice(-5).filter(e=>!e.correct).length;
  const unseen=!introduced.has(lesson.id);
  // Defer new lessons when existing learned material has repeated unresolved errors.
  const score=unseen ? 25-Math.min(15,index*0.18) : matchingDue*13+recentErrors*9+failures*3+extraErrors*2-Math.min(8,correctIndependent);
  const reason=unseen?'New lesson in the demonstration sequence':recentErrors?'Recent recall difficulty':matchingDue?'Scheduled review is due':extraErrors?'Extra practice was missed':'Previously studied';
  return {lessonId:lesson.id,score,reason,introduced:!unseen,due:matchingDue,errors:failures+extraErrors};
 });
 // Never represent this heuristic as a calibrated prediction of retention.
 return result.sort((a,b)=>b.score-a.score||DEMO_LESSONS.findIndex(l=>l.id===a.lessonId)-DEMO_LESSONS.findIndex(l=>l.id===b.lessonId)).slice(0,Math.max(0,Math.min(10,limit)));
}
export function recommendedPracticeLessons(state,limit=8){
 const ranked=lessonRecommendations(state,Date.now(),Math.max(limit,8));
 return ranked.map(x=>x.lessonId).slice(0,limit);
}
