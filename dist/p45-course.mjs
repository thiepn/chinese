/** P45 cumulative transfer registry: appended native assessment content only.
 * Original Mandarin situations, never official HSK 3.0 or generated mastery.
 */
import {P45_TRANSFER_A} from './p45-transfer-a.mjs';
import {P45_TRANSFER_B} from './p45-transfer-b.mjs';
import {P45_TRANSFER_C} from './p45-transfer-c.mjs';
import {P44_SCENARIOS} from './p44-course.mjs';
const data=[P45_TRANSFER_A,P45_TRANSFER_B,P45_TRANSFER_C]
 .flatMap(t=>t.trim().split(/\n\s*\n/).filter(Boolean));
const parse=(block,i)=>{
 const [header,...rows]=block.split('\n').map(t=>t.trim()).filter(Boolean);
 const [title,sourceId,theme,goal,pitfall,oral]=header.split('|');
 const turns=rows.filter(r=>r.startsWith('T|')).map(row=>{
  const [speaker,hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=rows.filter(r=>r.startsWith('Q|')).map(row=>{
  const [prompt,answer,wrong1,wrong2,evidenceTurn,explanation]=row.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),
   evidenceTurn:Number(evidenceTurn),explanation});
 });
 const [hanzi,pinyin,english,purpose]=(rows.find(r=>r.startsWith('W|'))||'').slice(2).split('|');
 const source=P44_SCENARIOS.find(s=>s.id===sourceId);
 return Object.freeze({
  id:'p45-'+String(i+1).padStart(2,'0'),sequence:i+1,
  title,sourceId,theme,goal,pitfall,oral,
  turns:Object.freeze(turns),questions:Object.freeze(questions),
  response:Object.freeze({hanzi,pinyin,english,purpose}),
  grammarIds:Object.freeze(source?.grammarIds||[]),
  source:'original-p45-authorial',sourceCase:source||null,officialHskLevel:null
 });
};
export const P45_TRANSFERS=Object.freeze(data.map(parse));
export const findP45Transfer=id=>P45_TRANSFERS.find(c=>c.id===id)||null;
export const P45_WRITING_TASKS=Object.freeze(P45_TRANSFERS.map(c=>Object.freeze({
 id:'p45:'+c.id+':response',kind:'p45-exact-evidence-response',p45TransferId:c.id,
 hanzi:c.response.hanzi,pinyin:c.response.pinyin,english:c.response.english,
 explanation:c.response.purpose,pitfall:c.pitfall,sourceCaseId:c.sourceId
})));
export const p45Evidence=(transferId,index)=>{
 const c=findP45Transfer(transferId),q=c?.questions[index];
 return c&&q?Object.freeze({turn:q.evidenceTurn,line:c.turns[q.evidenceTurn],
  reason:q.explanation,pitfall:c.pitfall}):null;
};
