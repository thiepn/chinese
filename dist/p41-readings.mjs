/** P41 source-owned intermediate passages. Editorial targets, not official
 * HSK 3.0 membership. Complete original Hanzi/Pinyin/English passages are
 * append-only material in the pre-existing P28/P34/P38 reader engine.
 */
import {P41_READING_A} from './p41-reading-a.mjs';
import {P41_READING_B} from './p41-reading-b.mjs';
import {P41_READING_C} from './p41-reading-c.mjs';
import {P41_READING_D} from './p41-reading-d.mjs';
const bodies=[P41_READING_A,P41_READING_B,P41_READING_C,P41_READING_D]
 .flatMap(text=>text.trim().split(/\n\s*\n/).filter(Boolean));
const freezeLine=([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english});
const optionsWords=['计划','资料','通知','问题','消息','方法','安排','结果','规则','建议','确认','比较','责任','讨论'];
const parse=(block,i)=>{
 const [header,...rest]=block.split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,format,grammar,word,teaching,misconception]=header.split('|');
 const [wordHanzi,wordPinyin,wordMeaning]=word.split('~');
 const lines=rest.filter(x=>x.startsWith('L|')).map(x=>freezeLine(x.slice(2).split('|')));
 const questions=rest.filter(x=>x.startsWith('Q|')).map(row=>{
  const [mode,prompt,answer,wrong1,wrong2,wrong3,evidence,explanation]=row.slice(2).split('|');
  return Object.freeze({mode,prompt,answer,options:Object.freeze([answer,wrong1,wrong2,wrong3]),
   evidence:Number(evidence),explanation});
 });
 const linkedWord=lines.some(s=>s.hanzi.includes(wordHanzi))?wordHanzi:
  optionsWords.find(w=>lines.some(s=>s.hanzi.includes(w)))||'';
 const focusLine=Math.max(0,lines.findIndex(s=>s.hanzi.includes(linkedWord)));
 const finalWord=wordHanzi===linkedWord?{hanzi:wordHanzi,pinyin:wordPinyin,english:wordMeaning}:
  {hanzi:linkedWord,pinyin:'',english:'Contextual focus word — see canonical Wordbook'};
 const rivals=optionsWords.filter(w=>w!==linkedWord&&!lines[focusLine].hanzi.includes(w)).slice(0,3);
 const orderLine=13,reading=lines[orderLine],parts=Array.from(reading.hanzi);
 const count=Math.max(2,Math.ceil(parts.length/6)),chunks=[];
 for(let n=0;n<parts.length;n+=count)chunks.push(parts.slice(n,n+count).join(''));
 const writing=lines[15];
 return Object.freeze({
  id:'p41-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,format,
  stage:i<4?3:i<8?4:5,source:'original-p41-authorial',
  lines:Object.freeze(lines),questions:Object.freeze(questions),
  grammarIds:Object.freeze(grammar.split(',')),focusWord:Object.freeze(finalWord),
  cloze:Object.freeze({line:focusLine,word:linkedWord,choices:Object.freeze([linkedWord,...rivals])}),
  orderLine,chunks:Object.freeze(chunks),
  paragraphs:Object.freeze([
   {start:0,end:3,title:'Situation and initial evidence'},
   {start:4,end:7,title:'Complication and competing interpretations'},
   {start:8,end:11,title:'Investigation and reasoning'},
   {start:12,end:15,title:'Decision, result and limitations'}
  ]),
  writing:Object.freeze({hanzi:writing.hanzi,pinyin:writing.pinyin,english:writing.english,
   prompt:'Reconstruct the final Chinese sentence from its English meaning without looking at the passage.',
   explanation:teaching+' '+misconception}),
  notes:Object.freeze({teaching,misconception,
   pronunciation:'Read full sentences with lexical tones and natural phrasing; device synthesized speech is not certified.',
   pragmatics:'Distinguish what was proposed, evidenced, confirmed and actually completed in the given text.'}),
  officialHskLevel:null
 });
};
export const P41_PASSAGES=Object.freeze(bodies.map(parse));
export const findP41Passage=id=>P41_PASSAGES.find(p=>p.id===id)||null;
export const P41_READING_ROWS=Object.freeze(P41_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,'Read a '+p.format+'; '+p.notes.teaching,p.stage,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 p.chunks,
 Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation]),
 p.grammarIds,
 Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 'Original P41 intermediate reading. '+p.notes.misconception
])));
