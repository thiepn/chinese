/** P47 original production exercises. Independent open-ended writing/speaking
 * remains self-reviewed and tab-local; exact model reconstruction uses only
 * the established canonical Sentence Workshop and sentenceEvents.
 */
import {P47_PRODUCTION_SOURCE} from './p47-production-source.mjs';
const blocks=P47_PRODUCTION_SOURCE.trim().split(/\n\s*\n/).filter(Boolean);
const writingUnits=['p43-03','p43-05','p43-09','p43-02','p43-09','p43-12'];
export const P47_PRODUCTION=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [readingId,writing,oral,pitfall]=header.split('|');
 const models=rows.filter(line=>line.startsWith('M|')).map(line=>{
  const [hanzi,pinyin,english,purpose]=line.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({
  id:'p47-production-'+String(i+1).padStart(2,'0'),
  readingId,writingId:writingUnits[i],writing,oral,pitfall,
  models:Object.freeze(models),source:'original-p47-authorial',
  officialHskLevel:null
 });
}));
export const findP47Production=id=>P47_PRODUCTION.find(p=>p.readingId===id)||null;
export const P47_PRODUCTION_TASKS=Object.freeze(P47_PRODUCTION.flatMap(p=>
 p.models.map((m,i)=>Object.freeze({
  id:'p47:transfer:'+p.readingId+':model'+i,kind:'p47-source-exact-transfer',
  p47ProductionId:p.readingId,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
  explanation:m.purpose,misconception:p.pitfall
 }))));
