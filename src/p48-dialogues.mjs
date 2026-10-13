/** P48 three-voice comparative listening. Original DIALOGUES remains the
 * only answer/assistance writer. Device speech synthesis, not real audio.
 */
import {P48_DIALOGUE_A} from './p48-dialogue-a.mjs';
import {P48_DIALOGUE_B} from './p48-dialogue-b.mjs';
const blocks=[P48_DIALOGUE_A,P48_DIALOGUE_B].flatMap(x=>x.trim().split(/\n\s*\n/).filter(Boolean));
export const P48_DIALOGUES=Object.freeze(blocks.map((raw,i)=>{
 const [header,...rows]=raw.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,readingId,theme,goal,teaching,pitfall]=header.split('|');
 const turns=rows.filter(x=>x.startsWith('D|')).map(x=>{
  const [speaker,hanzi,pinyin,english]=x.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=rows.filter(x=>x.startsWith('Q|')).map(x=>{
  const [prompt,answer,wrongA,wrongB,evidenceIndex,explanation]=x.slice(2).split('|');
  return Object.freeze({prompt,answer,
   options:Object.freeze([answer,wrongA,wrongB]),
   evidenceIndex:Number(evidenceIndex),explanation});
 });
 return Object.freeze({
  id:'p48-dialogue-'+String(i+1).padStart(2,'0'),title,readingId,theme,
  goal,teaching,pitfall,turns:Object.freeze(turns),questions:Object.freeze(questions),
  source:'original-p48-authorial',officialHskLevel:null
 });
}));
export const P48_DIALOGUE_WRITING_TASKS=Object.freeze(P48_DIALOGUES.flatMap(d=>[6,9].map(i=>{
 const sentence=d.turns[i];
 return Object.freeze({
  id:'p48:dialogue:'+d.id+':turn'+i,kind:'p48-dialogue-evidence-exact',
  p48DialogueId:d.id,hanzi:sentence.hanzi,pinyin:sentence.pinyin,
  english:sentence.english,explanation:d.teaching,misconception:d.pitfall
 });
})));
export const findP48Dialogue=id=>P48_DIALOGUES.find(x=>x.id===id)||null;
