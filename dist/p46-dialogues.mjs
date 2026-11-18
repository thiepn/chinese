/** P46 original upper-intermediate listening source. Uses established DIALOGUES
 * event writer and device TTS; audio is synthesized, not a human recording.
 */
import {P46_DIALOGUES_A} from './p46-dialogues-a.mjs';
import {P46_DIALOGUES_B} from './p46-dialogues-b.mjs';
const entries=[P46_DIALOGUES_A,P46_DIALOGUES_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
export const P46_DIALOGUES=Object.freeze(entries.map((block,i)=>{
 const [header,...body]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,readingId,theme,goal,teaching,pitfall]=header.split('|');
 const turns=body.filter(x=>x.startsWith('D|')).map(x=>{
  const [speaker,hanzi,pinyin,english]=x.slice(2).split('|');return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const questions=body.filter(x=>x.startsWith('Q|')).map(x=>{
  const [prompt,answer,wrong1,wrong2,evidenceIndex,explanation]=x.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),
   evidenceIndex:Number(evidenceIndex),explanation});
 });
 return Object.freeze({
  id:'p46-dialogue-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,readingId,goal,teaching,pitfall,
  turns:Object.freeze(turns),questions:Object.freeze(questions),
  source:'original-p46-authorial',officialHskLevel:null
 });
}));
export const findP46Dialogue=id=>P46_DIALOGUES.find(s=>s.id===id)||null;
export const P46_DIALOGUE_WRITING_TASKS=Object.freeze(P46_DIALOGUES.map(d=>{
 const t=d.turns[5];
 return Object.freeze({id:'p46:dialogue:'+d.id+':final',kind:'p46-dialogue-exact',
  p46DialogueId:d.id,hanzi:t.hanzi,pinyin:t.pinyin,english:t.english,
  explanation:d.teaching,misconception:d.pitfall});
}));
