/** P52 immutable original course data: sourced comparative reading, native
 * dialogue questions, and fixed-model reconstruction. No learner-state writers. */
import {P52_RECORD_SOURCE} from './p52-source-records.mjs';
const blocks=P52_RECORD_SOURCE.trim().split(/\n\s*\n/).filter(Boolean);
const readQuestion=row=>{
 const [prompt,answer,wrong1,wrong2,index,explanation]=row.slice(2).split('|');
 return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2,'The source does not establish any of these conclusions.']),evidence:Number(index),explanation});
};
const dialogueQuestion=row=>{
 const [prompt,answer,wrong1,wrong2,index,explanation]=row.slice(3).split('|');
 return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),evidenceIndex:Number(index),explanation});
};
export const P52_CASES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,theme,scenario,sources,priorCase,p43Id,goal,objection,pitfall]=header.split('|');
 const lines=rows.filter(x=>x.startsWith('L|')).map(row=>{
  const [sourceIndex,hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({sourceIndex:Number(sourceIndex),hanzi,pinyin,english});
 });
 const turns=rows.filter(x=>x.startsWith('D|')).map(row=>{
  const [speaker,hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const models=rows.filter(x=>x.startsWith('M|')).map(row=>{
  const [hanzi,pinyin,english,purpose]=row.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 const labels=sources.split(';');
 return Object.freeze({id:'p52-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,scenario,
  priorCase,p43Id,goal,objection,pitfall,
  sources:Object.freeze(labels.map((name,j)=>Object.freeze({name,index:j,lines:Object.freeze(lines.filter(l=>l.sourceIndex===j))}))),
  lines:Object.freeze(lines),turns:Object.freeze(turns),
  questions:Object.freeze(rows.filter(x=>x.startsWith('Q|')).map(readQuestion)),
  dialogueQuestions:Object.freeze(rows.filter(x=>x.startsWith('DQ|')).map(dialogueQuestion)),
  models:Object.freeze(models),source:'original-p52-authorial',officialHskLevel:null});
}));
export const findP52Case=id=>P52_CASES.find(x=>x.id===id)||null;
export const P52_READING_ROWS=Object.freeze(P52_CASES.map(c=>{
 const end=c.lines[c.lines.length-1],chars=[...end.hanzi],size=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let i=0;i<chars.length;i+=size)chunks.push(chars.slice(i,i+size).join(''));
 const focus=c.lines[0].hanzi.slice(0,2);
 return Object.freeze([c.title,c.theme,c.goal,9,
  Object.freeze(c.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
  Object.freeze(c.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
  Object.freeze(chunks),Object.freeze([0,focus,'采访','以后','因为','讨论']),
  Object.freeze(['Reconstruct this source-qualified final conclusion.',end.hanzi,end.pinyin,end.english,c.pitfall]),
  Object.freeze(['g157','g162','g164']),Object.freeze(['记录','jìlù','record']),c.goal]);
}));
export const P52_DIALOGUES=Object.freeze(P52_CASES.map(c=>Object.freeze({
 id:'p52-dialogue-'+String(c.sequence).padStart(2,'0'),title:'Editorial hearing: '+c.title,
 caseId:c.id,theme:c.theme,goal:c.goal,teaching:c.goal,pitfall:c.pitfall,turns:c.turns,
 questions:c.dialogueQuestions,source:'original-p52-authorial',officialHskLevel:null
})));
export const P52_WRITING_TASKS=Object.freeze(P52_CASES.flatMap(c=>c.models.map((m,i)=>Object.freeze({
 id:'p52:source:'+c.id+':model'+i,kind:'p52-exact-source-repair',p52CaseId:c.id,
 hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,explanation:m.purpose,misconception:c.pitfall
}))));
