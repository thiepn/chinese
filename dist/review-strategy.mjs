/** Diversified due-only queue; no fabricated grades or predicted retention. */
import {dueCards,cardInfo,DAY} from './study.mjs';
export function reviewPlan(state,{now=Date.now(),focus='all',limit=10}={}){
 const due=dueCards(state,now);const recent=new Map();for(const e of state.events||[])recent.set(e.cardId,e);
 const family=id=>{const k=cardInfo(id)?.type||'';return k==='reading'||k==='wordread0'?'pronunciation':k==='sentence'?'sentences':'meanings'};
 const rows=due.filter(id=>{const f=family(id);return focus==='all'||focus==='weak'||focus===f}).map((id,index)=>{
  const ev=recent.get(id),card=state.cards[id],overdue=Math.max(0,(now-card.due)/DAY);const needs=!!ev&&(ev.grade===0||ev.correct===false||ev.assisted);
  const score=(needs?50:0)+Math.min(14,overdue)+(!ev?9:0);return {id,index,score,needs,family:family(id),reason:needs?'Recent miss or assisted attempt':!ev?'First independent check':overdue>=1?'Overdue review':'Scheduled review'};
 }).sort((a,b)=>b.score-a.score||a.index-b.index);
 const output=[],used=new Set();let lastFamily=null,lastLesson=null;while(output.length<Math.max(1,Math.min(50,limit))&&used.size<rows.length){const next=rows.find(r=>!used.has(r.id)&&r.family!==lastFamily&&cardInfo(r.id)?.lesson.id!==lastLesson)||rows.find(r=>!used.has(r.id)&&r.family!==lastFamily)||rows.find(r=>!used.has(r.id)&&cardInfo(r.id)?.lesson.id!==lastLesson)||rows.find(r=>!used.has(r.id));if(!next)break;used.add(next.id);output.push(next);lastFamily=next.family;lastLesson=cardInfo(next.id)?.lesson.id;}
 return output;
}
