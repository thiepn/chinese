/** P47 original source-backed upper-intermediate listening; native DIALOGUES
 * owns answer history. Playback is device TTS, never recorded human audio.
 */
import {P47_DIALOGUES_A} from './p47-dialogues-a.mjs';
import {P47_DIALOGUES_B} from './p47-dialogues-b.mjs';
const blocks=[P47_DIALOGUES_A,P47_DIALOGUES_B].flatMap(s=>
 s.trim().split(/\n\s*\n/).filter(Boolean));
export const P47_DIALOGUES=Object.freeze(blocks.map((block,i)=>{
 const [header,...body]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,readingId,theme,goal,teaching,pitfall]=header.split('|');
 const turns=body.filter(row=>row.startsWith('D|')).map(row=>{
  const [speaker,hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=body.filter(row=>row.startsWith('Q|')).map(row=>{
  const [prompt,answer,wrong1,wrong2,evidenceIndex,explanation]=row.slice(2).split('|');
  return Object.freeze({
   prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),
   evidenceIndex:Number(evidenceIndex),explanation
  });
 });
 return Object.freeze({
  id:'p47-dialogue-'+String(i+1).padStart(2,'0'),sequence:i+1,
  title,readingId,theme,goal,teaching,pitfall,turns:Object.freeze(turns),
  questions:Object.freeze(questions),source:'original-p47-authorial',officialHskLevel:null
 });
}));
export const findP47Dialogue=id=>P47_DIALOGUES.find(x=>x.id===id)||null;
export const P47_DIALOGUE_WRITING_TASKS=Object.freeze(P47_DIALOGUES.flatMap(d=>[3,7].map(i=>{
 const line=d.turns[i];
 return Object.freeze({
  id:'p47:dialogue:'+d.id+':turn'+i,kind:'p47-listening-to-writing',
  p47DialogueId:d.id,hanzi:line.hanzi,pinyin:line.pinyin,english:line.english,
  explanation:d.teaching,misconception:d.pitfall
 });
})));
