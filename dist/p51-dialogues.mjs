/** P51 original multi-speaker listening; DIALOGUES and dialogueEvents own grades. */
import {P51_DIALOGUE_A} from './p51-dialogue-a.mjs';
import {P51_DIALOGUE_B} from './p51-dialogue-b.mjs';
const blocks=[P51_DIALOGUE_A,P51_DIALOGUE_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
export const P51_DIALOGUES=Object.freeze(blocks.map((block,i)=>{
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
 return Object.freeze({id:'p51-dialogue-'+String(i+1).padStart(2,'0'),title,sequence:i+1,
  readingId,theme,goal,teaching,pitfall,turns:Object.freeze(turns),questions:Object.freeze(questions),
  source:'original-p51-authorial',officialHskLevel:null});
}));
export const findP51Dialogue=id=>P51_DIALOGUES.find(x=>x.id===id)||null;
export const P51_DIALOGUE_WRITING=Object.freeze(P51_DIALOGUES.flatMap(d=>[4,d.turns.length-1].map(i=>{
 const x=d.turns[i];
 return Object.freeze({id:'p51:dialogue:'+d.id+':turn'+i,kind:'p51-register-listening-to-writing',
  p51DialogueId:d.id,hanzi:x.hanzi,pinyin:x.pinyin,english:x.english,
  explanation:d.teaching,misconception:d.pitfall});
})));
