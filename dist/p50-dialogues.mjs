/** P50 original advanced multi-speaker source conversations, native DIALOGUES
 * custody only. Device TTS is not recorded or authentic human audio.
 */
import {P50_DIALOGUE_A} from './p50-dialogue-a.mjs';
import {P50_DIALOGUE_B} from './p50-dialogue-b.mjs';
const blocks=[P50_DIALOGUE_A,P50_DIALOGUE_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
export const P50_DIALOGUES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,readingId,theme,goal,teaching,pitfall]=header.split('|');
 const turns=rows.filter(x=>x.startsWith('D|')).map(x=>{
  const [speaker,hanzi,pinyin,english]=x.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=rows.filter(x=>x.startsWith('Q|')).map(x=>{
  const [prompt,answer,wrongA,wrongB,evidenceIndex,explanation]=x.slice(2).split('|');
  return Object.freeze({prompt,answer,
   options:Object.freeze([answer,wrongA,wrongB]),evidenceIndex:Number(evidenceIndex),explanation});
 });
 return Object.freeze({
  id:'p50-dialogue-'+String(i+1).padStart(2,'0'),title,sequence:i+1,
  readingId,theme,goal,teaching,pitfall,
  turns:Object.freeze(turns),questions:Object.freeze(questions),
  source:'original-p50-authorial',officialHskLevel:null
 });
}));
export const findP50Dialogue=id=>P50_DIALOGUES.find(x=>x.id===id)||null;
export const P50_DIALOGUE_WRITING=Object.freeze(P50_DIALOGUES.flatMap(d=>[5,7].map(i=>{
 const x=d.turns[i];
 return Object.freeze({
  id:'p50:dialogue:'+d.id+':turn'+i,kind:'p50-listening-to-writing',p50DialogueId:d.id,
  hanzi:x.hanzi,pinyin:x.pinyin,english:x.english,
  explanation:d.teaching,misconception:d.pitfall
 });
})));
