/** P51 original argumentative register transfer. Only P43 handles private
 * multi-draft writing; model reconstruction uses canonical sentenceEvents.
 */
import {P51_ARGUMENT_SOURCE} from './p51-argument-source.mjs';
const blocks=P51_ARGUMENT_SOURCE.trim().split(/\n\s*\n/).filter(Boolean);
export const P51_ARGUMENTS=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [readingId,p43Id,claim,objection,rebuttal,writing,oral,misconception]=header.split('|');
 const models=rows.filter(x=>x.startsWith('M|')).map(x=>{
  const [hanzi,pinyin,english,purpose]=x.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({id:'p51-argument-'+String(i+1).padStart(2,'0'),
  readingId,p43Id,claim,objection,rebuttal,writing,oral,misconception,
  models:Object.freeze(models),source:'original-p51-authorial',officialHskLevel:null});
}));
export const findP51Argument=id=>P51_ARGUMENTS.find(x=>x.readingId===id)||null;
export const P51_ARGUMENT_TASKS=Object.freeze(P51_ARGUMENTS.flatMap(x=>x.models.map((m,i)=>
 Object.freeze({id:'p51:argument:'+x.readingId+':model'+i,kind:'p51-register-source-exact',
  p51ArgumentId:x.readingId,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
  explanation:m.purpose,misconception:x.misconception}))));
export const P51_REVISION=Object.freeze([
 Object.freeze({id:'source',title:'Trace exact authority',prompt:'Have I distinguished a proposed, approved and completed decision?'}),
 Object.freeze({id:'evidence',title:'Keep limits and time',prompt:'Have I preserved sampling, uncertainty, date and consent conditions?'}),
 Object.freeze({id:'register',title:'Choose audience-appropriate tone',prompt:'Can I phrase the same grounded fact formally and conversationally?'}),
 Object.freeze({id:'counter',title:'Present opposing reasons fairly',prompt:'Did I accurately state a legitimate counterargument?'}),
 Object.freeze({id:'repair',title:'Repair overstatements',prompt:'Have I identified and corrected unsupported certainty or motive?'}),
 Object.freeze({id:'oral',title:'Explain without the model',prompt:'Can I give an independently organized explanation aloud without reading source models?'})
]);
