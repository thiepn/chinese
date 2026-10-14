/** P46 original multi-paragraph reading lessons; all source sentences have
 * complete Hanzi, tone-marked Pinyin, and English, not certified HSK copy.
 * Native reader adapter follows historical P41 rows without renumbering.
 */
import {P46_READINGS_A} from './p46-readings-a.mjs';
import {P46_READINGS_B} from './p46-readings-b.mjs';
const blocks=[P46_READINGS_A,P46_READINGS_B]
 .flatMap(source=>source.trim().split(/\n\s*\n/).filter(Boolean));
const alternativeWords=['确认','数据','报告','记录','申请','选择','价格','讨论','说明','问题','历史','时间'];
export const P46_PASSAGES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rest]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,goal,grammar,word,contrast,oral]=header.split('|');
 const [focusHanzi,focusPinyin,focusEnglish]=word.split('~');
 const lines=rest.filter(row=>row.startsWith('L|')).map(row=>{
  const [hanzi,pinyin,english]=row.slice(2).split('|');return Object.freeze({hanzi,pinyin,english});
 });
 const questions=rest.filter(row=>row.startsWith('Q|')).map(row=>{
  const [prompt,answer,wrong1,wrong2,evidence,explanation]=row.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([answer,wrong1,wrong2,'None of these statements is supported.']),
   evidence:Number(evidence),explanation});
 });
 const available=[focusHanzi,...alternativeWords].find(w=>lines.some(l=>l.hanzi.includes(w)))||'';
 const focus=available===focusHanzi?
  Object.freeze({hanzi:focusHanzi,pinyin:focusPinyin,english:focusEnglish}):
  Object.freeze({hanzi:available,pinyin:'',english:'Source-attested term; open the original Wordbook'});
 const focusLine=Math.max(0,lines.findIndex(l=>l.hanzi.includes(available)));
 const target=lines[11];
 const pieces=[...target.hanzi],step=Math.max(2,Math.ceil(pieces.length/6));
 const chunks=[];for(let j=0;j<pieces.length;j+=step)chunks.push(pieces.slice(j,j+step).join(''));
 const rivals=alternativeWords.filter(x=>x!==available&&!lines[focusLine].hanzi.includes(x)).slice(0,3);
 return Object.freeze({
  id:'p46-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,goal,contrast,oral,
  grammarIds:Object.freeze(grammar.split(',')),focusWord:focus,focusLine,
  lines:Object.freeze(lines),questions:Object.freeze(questions),chunks:Object.freeze(chunks),
  paragraphs:Object.freeze([
   {start:0,end:3,title:'Source, context and initial interpretation'},
   {start:4,end:7,title:'Competing evidence and reasons'},
   {start:8,end:11,title:'Revised decision and limitations'}]),
  cloze:Object.freeze({line:focusLine,word:available,choices:Object.freeze([available,...rivals])}),
  writing:Object.freeze({hanzi:target.hanzi,pinyin:target.pinyin,english:target.english,
   prompt:'Independently reconstruct the final upper-intermediate sentence.',
   explanation:goal+' '+contrast}),
  source:'original-p46-authorial',officialHskLevel:null
 });
}));
export const findP46Passage=id=>P46_PASSAGES.find(p=>p.id===id)||null;
export const P46_READING_ROWS=Object.freeze(P46_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,p.goal,6,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 p.chunks,Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation]),
 p.grammarIds,Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 p.contrast
])));
