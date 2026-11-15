/** P50 source-supported self-review, argument plans and native exact-form
 * model tasks; open-ended P43 writing and speech remain ungraded.
 */
import {P50_ARGUMENT_SOURCE} from './p50-argument-source.mjs';
const source=P50_ARGUMENT_SOURCE.trim().split(/\n\s*\n/).filter(Boolean);
export const P50_ARGUMENTS=Object.freeze(source.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [readingId,p43Id,claim,objection,rebuttal,writing,oral,misconception]=header.split('|');
 const models=rows.filter(x=>x.startsWith('M|')).map(x=>{
  const [hanzi,pinyin,english,purpose]=x.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({id:'p50-argument-'+String(i+1).padStart(2,'0'),
  readingId,p43Id,claim,objection,rebuttal,writing,oral,misconception,
  models:Object.freeze(models),source:'original-p50-authorial',officialHskLevel:null});
}));
export const findP50Argument=id=>P50_ARGUMENTS.find(x=>x.readingId===id)||null;
export const P50_ARGUMENT_TASKS=Object.freeze(P50_ARGUMENTS.flatMap(x=>
 x.models.map((m,i)=>Object.freeze({
  id:'p50:argument:'+x.readingId+':model'+i,kind:'p50-argument-exact',
  p50ArgumentId:x.readingId,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
  explanation:m.purpose,misconception:x.misconception
 }))));
export const P50_REVISION=Object.freeze([
 Object.freeze({id:'attribution',title:'Source attribution',prompt:'Have I identified what the observation, proposal and official notice actually state?'}),
 Object.freeze({id:'scope',title:'Scope and time',prompt:'Have I preserved sample limits, administrative jurisdiction, approval and start dates?'}),
 Object.freeze({id:'position',title:'Supported claim',prompt:'Is my conclusion supported by evidence rather than a forecast or persuasive wording?'}),
 Object.freeze({id:'counter',title:'Fair counterargument',prompt:'Have I represented a reasonable opposing view without a straw man?'}),
 Object.freeze({id:'rebuttal',title:'Evidence-backed rebuttal',prompt:'Does my response answer the objection with a verified distinction?'}),
 Object.freeze({id:'revision',title:'Clear independent revision',prompt:'Can I revise the prose and explain it aloud without reading a model?'})
]);
