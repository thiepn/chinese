/** Batch 16: source-grounded study-block recommendations and observed-skill diagnostics.
 * Uses historical observations without calculating mastery probabilities or changing review grades.
 */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';

const SKILLS=['character','vocabulary','sentence','pronunciation'];
const STAGE_SKILL={character:'character',vocabulary:'vocabulary',sentence:'sentence',recall:'pronunciation',word:'vocabulary',meaning:'sentence',order:'sentence',tone:'pronunciation'};

export function lessonSkillLedger(state,lessonId){
 if(!findLesson(lessonId))return [];
 const observations=[...(state.courseEvents||[]).filter(e=>e.lessonId===lessonId&&STAGE_SKILL[e.stage]).map(e=>({...e,skill:STAGE_SKILL[e.stage],source:'course'})),...(state.ladderEvents||[]).filter(e=>e.lessonId===lessonId&&STAGE_SKILL[e.stage]).map(e=>({...e,skill:STAGE_SKILL[e.stage],source:'ladder'}))];
 const reviews=(state.events||[]).filter(e=>e.cardId?.startsWith(`${lessonId}:`)).map(e=>({...e,skill:inferReviewSkill(e.cardId),correct:e.correct===true||(!('correct' in e)&&e.grade>=2),assisted:e.assisted===true,source:'review'})).filter(e=>e.skill);
 const all=[...observations,...reviews].sort((a,b)=>a.at-b.at);
 return SKILLS.map(skill=>{
  const relevant=all.filter(e=>e.skill===skill),recent=relevant.slice(-5),last=recent.at(-1),unresolved=!!last&&(!last.correct||last.assisted),independent=recent.filter(e=>e.correct&&!e.assisted).length;
  return {skill,attempts:relevant.length,independent,unresolved,status:!last?'not assessed':unresolved?'revisit':'latest independent correct',source:last?.source||null,lastAt:last?.at||null};
 });
}
function inferReviewSkill(id){const tail=id.split(':').at(-1)||'';if(tail.includes('pron')||tail.includes('read')||tail.includes('pinyin'))return 'pronunciation';if(tail.includes('sentence'))return 'sentence';if(tail.includes('word'))return 'vocabulary';return 'character';}
export function lessonPriority(state,lessonId){
 const l=findLesson(lessonId);if(!l)return null;
 const ledger=lessonSkillLedger(state,lessonId),unresolved=ledger.filter(s=>s.unresolved),unseen=ledger.filter(s=>s.attempts===0),priorIntroduced=(state.learned||[]).includes(lessonId),completed=(state.courseEvents||[]).some(e=>e.lessonId===lessonId&&e.stage==='completed');
 const due=Object.entries(state.cards||{}).filter(([id,c])=>id.startsWith(lessonId+':')&&c.due<=Date.now()).length;
 return {lesson:l,ledger,unresolved,unseen,priorIntroduced,completed,due,score:unresolved.length*5+Math.min(due,6)*2+unseen.length-(completed?1:0),reason:unresolved.length?`Revisit ${unresolved.map(s=>s.skill).join(', ')}`:due?`${due} due recall target${due===1?'':'s'}`:!completed?'Ready for first guided completion':'Practice in a new context'};
}
export function personalizedBlockPlan(state,{focus='balanced',count=2}={}){
 if(!['balanced','weak','new'].includes(focus)||![2,3,4].includes(count))throw Error('Invalid block selection');
 const all=DEMO_LESSONS.map(l=>lessonPriority(state,l.id));
 const ranked=focus==='weak'?[...all].sort((a,b)=>b.unresolved.length-a.unresolved.length||b.due-a.due||b.score-a.score||a.lesson.order-b.lesson.order):focus==='new'?[...all].sort((a,b)=>Number(a.completed)-Number(b.completed)||a.lesson.order-b.lesson.order):[...all].sort((a,b)=>b.score-a.score||a.lesson.order-b.lesson.order);
 // Never claim weakest skill if no wrong/assisted evidence exists.
 return ranked.slice(0,count);
}
export function blockOverview(state){const items=DEMO_LESSONS.map(l=>lessonPriority(state,l.id));return {unresolved:items.filter(x=>x.unresolved.length).length,independent:items.reduce((n,x)=>n+x.ledger.filter(y=>y.status==='latest independent correct').length,0),notAssessed:items.reduce((n,x)=>n+x.unseen.length,0),top:items.filter(x=>x.unresolved.length).sort((a,b)=>b.unresolved.length-a.unresolved.length||a.lesson.order-b.lesson.order).slice(0,5)};}
