/** P53 original independent source reconciliation, cross-register and argument work.
 * Classroom documents are fictional editorial examples, never HSK-certified
 * corpus rows, real administrative advice, or learner-progress authorities.
 */
import {P53_SOURCE_A} from './p53-source-a.mjs';
import {P53_SOURCE_B} from './p53-source-b.mjs';
const raw=[P53_SOURCE_A,P53_SOURCE_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
const recordLine=s=>{
 const [index,hanzi,pinyin,english]=s.slice(2).split('|');
 return Object.freeze({sourceIndex:Number(index),hanzi,pinyin,english});
};
const heardLine=s=>{
 const [speaker,hanzi,pinyin,english]=s.slice(2).split('|');
 return Object.freeze({speaker,hanzi,pinyin,english});
};
const question=(row,prefix)=>{
 const [prompt,answer,wrong1,wrong2,index,explanation]=row.slice(prefix.length).split('|');
 return Object.freeze({prompt,answer,
  options:Object.freeze([answer,wrong1,wrong2]),
  evidenceIndex:Number(index),explanation});
};
export const P53_CASES=Object.freeze(raw.map((block,i)=>{
 const [head,...rows]=block.split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,priorCase,p43Id,goal,objection,pitfall,formalTask,informalTask]=head.split('|');
 const labels=rows.filter(s=>s.startsWith('S|')).map(s=>s.slice(2));
 const lines=rows.filter(s=>s.startsWith('L|')).map(recordLine);
 const turns=rows.filter(s=>s.startsWith('D|')).map(heardLine);
 const questions=rows.filter(s=>s.startsWith('Q|')).map(s=>question(s,'Q|'));
 const dialogueQuestions=rows.filter(s=>s.startsWith('DQ|')).map(s=>question(s,'DQ|'));
 const models=rows.filter(s=>s.startsWith('M|')).map(s=>{
  const [hanzi,pinyin,english,purpose]=s.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 return Object.freeze({
  id:'p53-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,priorCase,p43Id,
  goal,objection,pitfall,formalTask,informalTask,
  lines:Object.freeze(lines),turns:Object.freeze(turns),
  questions:Object.freeze(questions),dialogueQuestions:Object.freeze(dialogueQuestions),
  models:Object.freeze(models),
  sources:Object.freeze(labels.map((name,index)=>Object.freeze({name,index,
   start:lines.findIndex(l=>l.sourceIndex===index),
   end:lines.findLastIndex(l=>l.sourceIndex===index),
   lines:Object.freeze(lines.filter(l=>l.sourceIndex===index))}))),
  source:'original-p53-authorial',officialHskLevel:null
 });
}));
export const findP53Case=id=>P53_CASES.find(c=>c.id===id)||null;
/** Canonical Reader row adapter. New rows append after all P52 history. */
export const P53_READING_ROWS=Object.freeze(P53_CASES.map(c=>{
 const final=c.lines.at(-1),chars=[...final.hanzi],size=Math.max(2,Math.ceil(chars.length/7));
 const chunks=[];for(let k=0;k<chars.length;k+=size)chunks.push(chars.slice(k,k+size).join(''));
 const focus=c.lines[0].hanzi.slice(0,2);
 const choices=['说明','目前','讨论'].filter(x=>x!==focus);
 while(choices.length<3)choices.push('记录');
 return Object.freeze([c.title,c.theme,c.goal,9,
  Object.freeze(c.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
  Object.freeze(c.questions.map(q=>Object.freeze([
   q.prompt,q.answer,...q.options.slice(1),'None of these conclusions follows from the specified records.',
   q.evidenceIndex,q.explanation
  ]))),
  Object.freeze(chunks),
  Object.freeze([0,focus,...choices.slice(0,3)]),
  Object.freeze(['Reconstruct a defensible Mandarin conclusion from these records.',
   final.hanzi,final.pinyin,final.english,c.pitfall]),
  Object.freeze(['g157','g162','g164']),
  Object.freeze(['说明','shuōmíng','explain or clarify']),
  c.goal
 ]);
}));
export const P53_DIALOGUES=Object.freeze(P53_CASES.map(c=>Object.freeze({
 id:'p53-dialogue-'+String(c.sequence).padStart(2,'0'),
 title:'Cross-source argument: '+c.title,caseId:c.id,
 turns:c.turns,questions:c.dialogueQuestions,source:'original-p53-authorial',
 officialHskLevel:null
})));
export const P53_WRITING_TASKS=Object.freeze(P53_CASES.flatMap(c=>c.models.map((m,index)=>Object.freeze({
 id:'p53:argument:'+c.id+':model'+index,
 kind:'p53-source-specific-exact-reconstruction',
 p53CaseId:c.id,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
 explanation:m.purpose,misconception:c.pitfall
}))));
export const P53_SELF_REVIEW=Object.freeze([
 {id:'provenance',label:'Which record establishes each figure, date, or policy claim?'},
 {id:'authority',label:'Did I distinguish draft, approval, observation, and implementation?'},
 {id:'counterpoint',label:'Did I state the legitimate objection before responding?'},
 {id:'limits',label:'Did I avoid claiming causation, access, or consent without evidence?'},
 {id:'formal',label:'Can I cite the sources in an audience-appropriate formal register?'},
 {id:'informal',label:'Can I explain the same qualified facts naturally to a friend?'},
 {id:'speech',label:'Can I defend my conclusion independently in spoken Mandarin?'}
].map(x=>Object.freeze(x)));
