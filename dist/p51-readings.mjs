/** P51 original connected register and evidence readings; only original STORIES
 * owns reading answer submissions and historical IDs.
 */
import {P51_READ_A} from './p51-read-a.mjs';
import {P51_READ_B} from './p51-read-b.mjs';
const blocks=[P51_READ_A,P51_READ_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
const known=['澄清','确认','报告','记录','说明','范围','通知','证据','申请','预约'];
export const P51_PASSAGES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,goal,grammar,focus,contrast,oral,priorCase]=header.split('|');
 const [focusHanzi,focusPinyin,focusEnglish]=focus.split('~');
 const lines=rows.filter(s=>s.startsWith('L|')).map(s=>{
  const [hanzi,pinyin,english]=s.slice(2).split('|');return Object.freeze({hanzi,pinyin,english});
 });
 const questions=rows.filter(s=>s.startsWith('Q|')).map(s=>{
  const [prompt,answer,wrong1,wrong2,evidence,explanation]=s.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([
   answer,wrong1,wrong2,'None of those conclusions is supported by these sources.'
  ]),evidence:Number(evidence),explanation});
 });
 const focusWord=Object.freeze({hanzi:focusHanzi,pinyin:focusPinyin,english:focusEnglish});
 const selected=[focusHanzi,...known].find(w=>lines.some(l=>l.hanzi.includes(w)))||'';
 const focusLine=Math.max(0,lines.findIndex(l=>l.hanzi.includes(selected)));
 const ending=lines[15],chars=[...ending.hanzi],step=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 const rivals=known.filter(w=>w!==selected&&!lines[focusLine].hanzi.includes(w)).slice(0,3);
 return Object.freeze({
  id:'p51-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,goal,
  grammarIds:Object.freeze(grammar.split(',')),focusWord,focusLine,contrast,oral,priorCase,
  lines:Object.freeze(lines),questions:Object.freeze(questions),
  paragraphs:Object.freeze([
   Object.freeze({start:0,end:3,title:'Original statement and source scope'}),
   Object.freeze({start:4,end:7,title:'Overstatement and opposing interpretation'}),
   Object.freeze({start:8,end:11,title:'Clarification and verification'}),
   Object.freeze({start:12,end:15,title:'Revised language and independently defensible conclusion'})
  ]),
  chunks:Object.freeze(chunks),
  cloze:Object.freeze({line:focusLine,word:selected,choices:Object.freeze([selected,...rivals])}),
  writing:Object.freeze({hanzi:ending.hanzi,pinyin:ending.pinyin,english:ending.english,
   prompt:'Reconstruct the source-qualified Mandarin conclusion.',explanation:goal+' '+contrast}),
  source:'original-p51-authorial',officialHskLevel:null
 });
}));
export const findP51Passage=id=>P51_PASSAGES.find(p=>p.id===id)||null;
export const P51_READING_ROWS=Object.freeze(P51_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,p.goal,9,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 p.chunks,Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation]),
 p.grammarIds,Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 p.contrast
])));
