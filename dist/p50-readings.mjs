/** P50 original 20-line discursive reading bridge. Native STORIES and
 * readingEvents remain the only authoritative comprehension mechanism.
 */
import {P50_READ_A} from './p50-reading-a.mjs';
import {P50_READ_B} from './p50-reading-b.mjs';
const blocks=[P50_READ_A,P50_READ_B].flatMap(s=>s.trim().split(/\n\s*\n/).filter(Boolean));
const known=['确认','报告','证据','实施','审核','效率','范围','数据','记录','原因'];
export const P50_PASSAGES=Object.freeze(blocks.map((block,i)=>{
 const [header,...rows]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,goal,grammar,focus,contrast,oral,priorCase]=header.split('|');
 const [focusHanzi,focusPinyin,focusEnglish]=focus.split('~');
 const lines=rows.filter(s=>s.startsWith('L|')).map(s=>{
  const [hanzi,pinyin,english]=s.slice(2).split('|');return Object.freeze({hanzi,pinyin,english});
 });
 const questions=rows.filter(s=>s.startsWith('Q|')).map(s=>{
  const [prompt,answer,wrong1,wrong2,evidence,explanation]=s.slice(2).split('|');
  return Object.freeze({prompt,answer,options:Object.freeze([
   answer,wrong1,wrong2,'None of those conclusions is supported by the stated sources.'
  ]),evidence:Number(evidence),explanation});
 });
 const selected=[focusHanzi,...known].find(w=>lines.some(l=>l.hanzi.includes(w)))||'';
 const word=Object.freeze(selected===focusHanzi?
  {hanzi:focusHanzi,pinyin:focusPinyin,english:focusEnglish}:
  {hanzi:selected,pinyin:'',english:'See canonical Wordbook for this attested contextual term'});
 const focusLine=Math.max(0,lines.findIndex(l=>l.hanzi.includes(selected)));
 const ending=lines[19],chars=[...ending.hanzi],step=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 const rivals=known.filter(w=>w!==selected&&!lines[focusLine].hanzi.includes(w)).slice(0,3);
 return Object.freeze({
  id:'p50-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,goal,
  grammarIds:Object.freeze(grammar.split(',')),focusWord:word,focusLine,contrast,oral,priorCase,
  lines:Object.freeze(lines),questions:Object.freeze(questions),
  paragraphs:Object.freeze([
   Object.freeze({start:0,end:4,title:'Source A · observed records'}),
   Object.freeze({start:5,end:9,title:'Source B · interpretation and alternative'}),
   Object.freeze({start:10,end:14,title:'Authoritative clarification and verification'}),
   Object.freeze({start:15,end:19,title:'Revision, limitation and conclusion'})
  ]),
  chunks:Object.freeze(chunks),
  cloze:Object.freeze({line:focusLine,word:selected,choices:Object.freeze([selected,...rivals])}),
  writing:Object.freeze({hanzi:ending.hanzi,pinyin:ending.pinyin,english:ending.english,
   prompt:'Reconstruct the source-qualified Mandarin conclusion.',explanation:goal+' '+contrast}),
  source:'original-p50-authorial',officialHskLevel:null
 });
}));
export const findP50Passage=id=>P50_PASSAGES.find(p=>p.id===id)||null;
export const P50_READING_ROWS=Object.freeze(P50_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,p.goal,9,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 p.chunks,Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation]),
 p.grammarIds,Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 p.contrast
])));
