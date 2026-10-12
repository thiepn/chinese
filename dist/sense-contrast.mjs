/** Side-by-side contextual sense teaching after assessment; no official source claims. */
import {SENSE_CASES} from './sense-lab.mjs';
export function senseContrast(caseId){
 const current=SENSE_CASES.find(x=>x.id===caseId);if(!current)return null;
 const other=SENSE_CASES.find(x=>x.target===current.target&&x.id!==current.id&&x.answer!==current.answer);
 return {target:current.target,contexts:[current,...(other?[other]:[])].map(x=>({id:x.id,hanzi:x.hanzi,pinyin:x.pinyin,english:x.english,sense:x.answer,explanation:x.explanation})),hasContrast:!!other};
}
export function senseRepairQueue(state){
 return SENSE_CASES.map(item=>{
  const attempts=(state.senseEvents||[]).filter(e=>e.caseId===item.id).sort((a,b)=>a.at-b.at);
  const lastIndependent=[...attempts].reverse().find(e=>e.correct&&!e.assisted);
  const pending=attempts.filter(e=>(!e.correct||e.assisted)&&(!lastIndependent||e.at>lastIndependent.at));
  return {id:item.id,index:SENSE_CASES.indexOf(item),target:item.target,pending:pending.length,attempts:attempts.length,reason:pending.length?`${pending.length} unresolved context attempts`:!attempts.length?'New contextual distinction':'Already independently checked'};
 }).sort((a,b)=>b.pending-a.pending||a.attempts-b.attempts||a.index-b.index);
}
