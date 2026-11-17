/** P49 original cumulative source-specific Mandarin retrieval.
 * All source IDs refer to existing P44–P48 authorities, not copies.
 * Each new multiple-choice answer is attached only to native DIALOGUES;
 * exact Chinese written models belong only to Sentence Workshop.
 */
import {P49_CASES_A} from './p49-cases-a.mjs';
import {P49_CASES_B} from './p49-cases-b.mjs';
import {P49_CASES_C} from './p49-cases-c.mjs';
import {P44_SCENARIOS} from './p44-course.mjs';
import {P45_TRANSFERS} from './p45-course.mjs';
import {P46_PASSAGES} from './p46-readings.mjs';
import {P47_PASSAGES} from './p47-readings.mjs';
import {P48_PASSAGES} from './p48-readings.mjs';

export const P49_HISTORICAL_SOURCES=Object.freeze({
 p44:P44_SCENARIOS,p45:P45_TRANSFERS,p46:P46_PASSAGES,
 p47:P47_PASSAGES,p48:P48_PASSAGES
});
const sources=[P49_CASES_A,P49_CASES_B,P49_CASES_C]
 .flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
export const P49_CASES=Object.freeze(sources.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [id,title,theme,sourceType,sourceId,grammarId,contrast,writing,oral]=header.split('|');
 const linked=P49_HISTORICAL_SOURCES[sourceType]?.find(s=>s.id===sourceId)||null;
 const turns=rows.filter(row=>row.startsWith('T|')).map(row=>{
  const [speaker,hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=rows.filter(row=>row.startsWith('Q|')).map(row=>{
  const [prompt,answer,wrongA,wrongB,evidenceTurn,explanation]=row.slice(2).split('|');
  return Object.freeze({prompt,answer,
   options:Object.freeze([answer,wrongA,wrongB]),
   evidenceTurn:Number(evidenceTurn),explanation});
 });
 const models=rows.filter(row=>row.startsWith('W|')).map(row=>{
  const [hanzi,pinyin,english,purpose]=row.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({
  id,title,sequence:i+1,theme,sourceType,sourceId,linked,
  grammarId,contrast,writing,oral,
  turns:Object.freeze(turns),questions:Object.freeze(questions),
  models:Object.freeze(models),
  source:'original-p49-authorial',officialHskLevel:null
 });
}));
export const findP49Case=id=>P49_CASES.find(c=>c.id===id)||null;
export const P49_WRITING_TASKS=Object.freeze(P49_CASES.flatMap(c=>c.models.map((m,i)=>
 Object.freeze({
  id:'p49:'+c.id+':model'+i,kind:'p49-cumulative-exact',
  p49CaseId:c.id,sourceId:c.sourceId,hanzi:m.hanzi,pinyin:m.pinyin,
  english:m.english,explanation:m.purpose,misconception:c.contrast
 }))));
export const P49_FOCUS_GROUPS=Object.freeze([
 Object.freeze({id:'sources',title:'Identify the original source',description:'A claim is only as strong as the record that supports it.'}),
 Object.freeze({id:'meaning',title:'Contrast two interpretations',description:'Distinguish what happened, what was proposed and what remains uncertain.'}),
 Object.freeze({id:'listen',title:'Retrieve from dialogue',description:'Answer novel source-specific questions using the canonical listening writer.'}),
 Object.freeze({id:'write',title:'Express independently',description:'Reconstruct authentic source models then formulate your own statement.'}),
 Object.freeze({id:'repair',title:'Return to real difficult items',description:'Use existing wrong/assisted native events and actual due cards.'})
]);
