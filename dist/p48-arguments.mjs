/** P48 argument-writing handoff, source models and self-review criteria.
 * P43 remains the only independent editable paragraph workspace; P48 has no
 * second essay store and no automatic assessment of free expression.
 */
import {P48_ARGUMENT_SOURCE} from './p48-argument-source.mjs';
const units=P48_ARGUMENT_SOURCE.trim().split(/\n\s*\n/).filter(Boolean);
export const P48_ARGUMENTS=Object.freeze(units.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [readingId,p43Id,claim,objection,rebuttal,writing,oral,misconception]=header.split('|');
 const models=rows.filter(x=>x.startsWith('M|')).map(x=>{
  const [hanzi,pinyin,english,purpose]=x.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({
  id:'p48-argument-'+String(i+1).padStart(2,'0'),readingId,p43Id,
  claim,objection,rebuttal,writing,oral,misconception,
  models:Object.freeze(models),source:'original-p48-authorial',officialHskLevel:null
 });
}));
export const findP48Argument=readingId=>P48_ARGUMENTS.find(x=>x.readingId===readingId)||null;
export const P48_ARGUMENT_TASKS=Object.freeze(P48_ARGUMENTS.flatMap(x=>x.models.map((m,i)=>
 Object.freeze({
  id:'p48:argument:'+x.readingId+':model'+i,kind:'p48-source-exact-writing',
  p48ArgumentId:x.readingId,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
  explanation:m.purpose,misconception:x.misconception
 }))));
export const P48_REVISION_CHECKS=Object.freeze([
 Object.freeze({id:'source-a',title:'Source A attribution',question:'Did you identify which specific earlier statement is a preference, estimate, record or proposal?'}),
 Object.freeze({id:'source-b',title:'Source B attribution',question:'Did you explain how the second source changes, qualifies or fails to establish the first claim?'}),
 Object.freeze({id:'claim',title:'Scoped position',question:'Does your position match what the sources actually establish, without universal or certified claims?'}),
 Object.freeze({id:'objection',title:'Fair counterargument',question:'Did you present the opposing practical concern fairly and separately from its evidentiary status?'}),
 Object.freeze({id:'rebuttal',title:'Evidence-backed response',question:'Does your reply answer the objection with an identifiable source and a stated limit?'}),
 Object.freeze({id:'revision',title:'Clarity and revision',question:'On rereading aloud, can a new reader distinguish what happened, what was proposed and what remains unknown?'})
]);
