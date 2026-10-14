/** P54 cumulative original advanced Mandarin source and language course.
 * Educational fiction; do not replace historical source IDs or native writers.
 */
import {P54_SOURCE_A} from './p54-source-a.mjs';
import {P54_SOURCE_B} from './p54-source-b.mjs';
import {P54_REGISTER_PAIRS} from './p54-register.mjs';
const bodies=[P54_SOURCE_A,P54_SOURCE_B].flatMap(x=>x.trim().split(/\n\s*\n/).filter(Boolean));
function question(s,prefix){
 const [prompt,answer,wrong1,wrong2,evidenceIndex,explanation]=s.slice(prefix.length).split('|');
 return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),
  evidenceIndex:Number(evidenceIndex),explanation});
}
export const P54_CASES=Object.freeze(bodies.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,theme,priorCase,p43Id,focus,goal,objection,pitfall,formalTask,informalTask]=header.split('|');
 const [hanzi,pinyin,english]=focus.split('~');
 const lines=rows.filter(x=>x.startsWith('L|')).map(x=>{
  const [sourceIndex,hanzi,pinyin,english]=x.slice(2).split('|');
  return Object.freeze({sourceIndex:Number(sourceIndex),hanzi,pinyin,english});
 });
 const turns=rows.filter(x=>x.startsWith('D|')).map(x=>{
  const [speaker,hanzi,pinyin,english]=x.slice(2).split('|');
  return Object.freeze({speaker,hanzi,pinyin,english});
 });
 const models=rows.filter(x=>x.startsWith('M|')).map(x=>{
  const [hanzi,pinyin,english,purpose]=x.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english,purpose});
 });
 const labels=rows.filter(x=>x.startsWith('S|')).map(x=>x.slice(2));
 const sources=labels.map((name,index)=>Object.freeze({name,index,
  start:lines.findIndex(x=>x.sourceIndex===index),
  end:lines.findLastIndex(x=>x.sourceIndex===index),
  lines:Object.freeze(lines.filter(x=>x.sourceIndex===index))
 }));
 return Object.freeze({id:'p54-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,priorCase,p43Id,
  focusWord:Object.freeze({hanzi,pinyin,english}),goal,objection,pitfall,formalTask,informalTask,
  lines:Object.freeze(lines),turns:Object.freeze(turns),sources:Object.freeze(sources),
  questions:Object.freeze(rows.filter(x=>x.startsWith('Q|')).map(x=>question(x,'Q|'))),
  dialogueQuestions:Object.freeze(rows.filter(x=>x.startsWith('DQ|')).map(x=>question(x,'DQ|'))),
  models:Object.freeze(models),source:'original-p54-authorial',officialHskLevel:null});
}));
export const findP54Case=id=>P54_CASES.find(x=>x.id===id)||null;
export const P54_READING_ROWS=Object.freeze(P54_CASES.map(c=>{
 const ending=c.lines.at(-1),characters=[...ending.hanzi],step=Math.max(2,Math.ceil(characters.length/7));
 const chunks=[];for(let i=0;i<characters.length;i+=step)chunks.push(characters.slice(i,i+step).join(''));
 const focus=c.focusWord.hanzi;
 const rivals=['计划','说明','报告','理由'].filter(x=>x!==focus).slice(0,3);
 return Object.freeze([c.title,c.theme,c.goal,9,
  Object.freeze(c.lines.map(x=>Object.freeze([x.hanzi,x.pinyin,x.english]))),
  Object.freeze(c.questions.map(q=>Object.freeze([q.prompt,...q.options,
   'None of those conclusions is supported by the named sources.',
   q.evidenceIndex,q.explanation]))),
  Object.freeze(chunks),Object.freeze([0,focus,...rivals]),
  Object.freeze(['Reconstruct the original evidence-limited Mandarin conclusion.',
   ending.hanzi,ending.pinyin,ending.english,c.pitfall]),
  Object.freeze(['g157','g162','g164']),
  Object.freeze([c.focusWord.hanzi,c.focusWord.pinyin,c.focusWord.english]),c.goal]);
}));
export const P54_DIALOGUES=Object.freeze(P54_CASES.map(c=>Object.freeze({
 id:'p54-dialogue-'+String(c.sequence).padStart(2,'0'),title:'Advanced independent briefing: '+c.title,
 caseId:c.id,turns:c.turns,questions:c.dialogueQuestions,
 source:'original-p54-authorial',officialHskLevel:null
})));
export const P54_WRITING_TASKS=Object.freeze(P54_CASES.flatMap(c=>c.models.map((m,i)=>Object.freeze({
 id:'p54:source:'+c.id+':model'+i,kind:'p54-original-evidence-reconstruction',
 p54CaseId:c.id,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
 explanation:m.purpose,misconception:c.pitfall
}))));
export const P54_REGISTER_TASKS=Object.freeze(P54_REGISTER_PAIRS.flatMap(c=>c.examples.map((m,i)=>Object.freeze({
 id:'p54:register:'+c.id+':example'+i,kind:'p54-register-usage-exact',
 p54RegisterId:c.id,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
 explanation:c.teaching,misconception:'Context matters: '+c.category
}))));
export const P54_SELF_REVIEW=Object.freeze([
 ['claim','Which document and date supports each claim?'],
 ['scope','Have I preserved quantifiers, denominators, and unknowns?'],
 ['counter','Did I acknowledge the strongest reasonable counterargument?'],
 ['causal','Have I distinguished observations from causal explanations?'],
 ['register','Did I preserve facts across institutional and conversational Mandarin?'],
 ['draft','Did my second draft remove unsupported statements?'],
 ['speech','Can I restate and defend the conclusion without reading the model?']
].map(([id,label])=>Object.freeze({id,label})));
