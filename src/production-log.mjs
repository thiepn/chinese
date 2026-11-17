/** Self-reported production practice log. Records that the learner practiced
 * producing Mandarin aloud or in writing. These are PRACTICE records, not
 * grades: nothing here verifies pronunciation, fluency, or correctness beyond
 * one factual observation — whether a typed reply exactly matched the written
 * form of the model line (character equality only). Never feeds review.
 */
export const PRODUCTION_KINDS=Object.freeze(['shadow','typed','free']);
export function addProductionEvent(state,{id,kind,targetId,matched,at=Date.now()}={}){
 if(typeof id!=='string'||!id||id.length>100)throw new Error('Invalid production practice record');
 if(!PRODUCTION_KINDS.includes(kind))throw new Error('Invalid production practice record');
 if(typeof targetId!=='string'||!targetId||targetId.length>120)throw new Error('Invalid production practice record');
 if(!Number.isFinite(at)||(matched!==undefined&&typeof matched!=='boolean'))throw new Error('Invalid production practice record');
 const next=structuredClone(state);next.productionEvents=Array.isArray(next.productionEvents)?next.productionEvents:[];
 if(next.productionEvents.some(e=>e&&e.id===id))return next;
 if(next.productionEvents.length>=20000)throw new Error('Invalid production practice record');
 const ev={id,kind,targetId,at};if(matched!==undefined)ev.matched=matched;
 next.productionEvents.push(ev);return next;
}
export function validateProductionEvents(events){
 if(events===undefined)return true;
 if(!Array.isArray(events)||events.length>20000)throw new Error('Invalid production practice history');
 const seen=new Set();
 for(const e of events){
  if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||!PRODUCTION_KINDS.includes(e.kind)||
   typeof e.targetId!=='string'||!e.targetId||e.targetId.length>120||!Number.isFinite(e.at)||
   ('matched'in e&&typeof e.matched!=='boolean'))throw new Error('Invalid production practice history');
  if(!Object.keys(e).every(k=>['id','kind','targetId','at','matched'].includes(k)))throw new Error('Invalid production practice history');
  seen.add(e.id);
 }
 return true;
}
export function productionStats(state){
 const events=Array.isArray(state?.productionEvents)?state.productionEvents:[];
 return {total:events.length,
  spoken:events.filter(e=>e.kind==='shadow').length,
  typed:events.filter(e=>e.kind==='typed').length,
  free:events.filter(e=>e.kind==='free').length,
  matched:events.filter(e=>e.matched===true).length};
}
