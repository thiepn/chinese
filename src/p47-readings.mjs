/** P47 original advanced connected Mandarin reading source.
 * Existing STORIES and readingEvents remain the sole authoritative reader.
 */
import {P47_READINGS_A} from './p47-reading-a.mjs';
import {P47_READINGS_B} from './p47-reading-b.mjs';
const blocks=[P47_READINGS_A,P47_READINGS_B].flatMap(source=>
 source.trim().split(/\n\s*\n/).filter(Boolean));
const existingVocabulary=['确认','数据','报告','记录','申请','选择','价格','讨论','说明','问题','历史','时间'];
export const P47_PASSAGES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rest]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,goal,grammar,word,contrast,oral]=header.split('|');
 const [focusHanzi,focusPinyin,focusEnglish]=word.split('~');
 const lines=rest.filter(row=>row.startsWith('L|')).map(row=>{
  const [hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english});
 });
 const questions=rest.filter(row=>row.startsWith('Q|')).map(row=>{
  const [prompt,answer,wrong1,wrong2,evidence,explanation]=row.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([
   answer,wrong1,wrong2,'The source does not establish any of those conclusions.'
  ]),evidence:Number(evidence),explanation});
 });
 const attested=[focusHanzi,...existingVocabulary].find(w=>lines.some(l=>l.hanzi.includes(w)))||'';
 const focus=attested===focusHanzi?
  Object.freeze({hanzi:focusHanzi,pinyin:focusPinyin,english:focusEnglish}):
  Object.freeze({hanzi:attested,pinyin:'',english:'See original Wordbook for this contextual term'});
 const focusLine=Math.max(0,lines.findIndex(l=>l.hanzi.includes(attested)));
 const last=lines[15],chars=[...last.hanzi],step=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 const rivals=existingVocabulary.filter(w=>w!==attested&&!lines[focusLine].hanzi.includes(w)).slice(0,3);
 return Object.freeze({
  id:'p47-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,goal,contrast,oral,
  grammarIds:Object.freeze(grammar.split(',')),focusWord:focus,focusLine,
  lines:Object.freeze(lines),questions:Object.freeze(questions),chunks:Object.freeze(chunks),
  paragraphs:Object.freeze([
   Object.freeze({start:0,end:3,title:'Initial source and disputed meaning'}),
   Object.freeze({start:4,end:7,title:'Additional evidence and competing inferences'}),
   Object.freeze({start:8,end:11,title:'Revision and responsible decision'}),
   Object.freeze({start:12,end:15,title:'Outcome, limitations and transfer'})
  ]),
  cloze:Object.freeze({line:focusLine,word:attested,choices:Object.freeze([attested,...rivals])}),
  writing:Object.freeze({hanzi:last.hanzi,pinyin:last.pinyin,english:last.english,
   prompt:'Reconstruct the final original Chinese sentence from its meaning without copying.',
   explanation:goal+' '+contrast}),
  source:'original-p47-authorial',officialHskLevel:null
 });
}));
export const findP47Passage=id=>P47_PASSAGES.find(p=>p.id===id)||null;
export const P47_READING_ROWS=Object.freeze(P47_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,p.goal,7,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([
  q.prompt,...q.options,q.evidence,q.explanation
 ]))),
 p.chunks,Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,
  p.writing.english,p.writing.explanation]),
 p.grammarIds,Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 p.contrast
])));
