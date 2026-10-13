/** P48 original HSK 4-targeted comparative long readings. Each line was
 * written for this course; HSK membership/certification is not implied.
 * They append only to the native STORIES and readingEvents registry.
 */
import {P48_READING_A} from './p48-reading-a.mjs';
import {P48_READING_B} from './p48-reading-b.mjs';
const raw=[P48_READING_A,P48_READING_B].flatMap(x=>x.trim().split(/\n\s*\n/).filter(Boolean));
const fallbackWords=['审核','解释','证据','记录','说明','确认','报告','时间','参加','决定','材料'];
export const P48_PASSAGES=Object.freeze(raw.map((entry,i)=>{
 const [header,...rows]=entry.trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const [title,theme,goal,grammars,focus,contrast,oral,preceding]=header.split('|');
 const [wordHanzi,wordPinyin,wordEnglish]=focus.split('~');
 const lines=rows.filter(x=>x.startsWith('L|')).map(x=>{
  const [hanzi,pinyin,english]=x.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english});
 });
 const questions=rows.filter(x=>x.startsWith('Q|')).map(x=>{
  const [prompt,answer,wrongA,wrongB,evidence,explanation]=x.slice(2).split('|');
  return Object.freeze({
   prompt,answer,options:Object.freeze([answer,wrongA,wrongB,'None of the claims is supported.']),
   evidence:Number(evidence),explanation
  });
 });
 const attested=[wordHanzi,...fallbackWords].find(w=>lines.some(l=>l.hanzi.includes(w)))||'';
 const lineIndex=Math.max(0,lines.findIndex(l=>l.hanzi.includes(attested)));
 const focusWord=Object.freeze(attested===wordHanzi?
  {hanzi:wordHanzi,pinyin:wordPinyin,english:wordEnglish}:
  {hanzi:attested,pinyin:'',english:'See the existing Wordbook for this attested expression'});
 const final=lines[19],units=[...final.hanzi],step=Math.ceil(units.length/6);
 const chunks=[];for(let n=0;n<units.length;n+=step)chunks.push(units.slice(n,n+step).join(''));
 const alternatives=fallbackWords.filter(x=>x!==attested&&!lines[lineIndex].hanzi.includes(x)).slice(0,3);
 return Object.freeze({
  id:'p48-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,goal,contrast,oral,
  priorCase:preceding,grammarIds:Object.freeze(grammars.split(',')),
  lines:Object.freeze(lines),questions:Object.freeze(questions),
  focusWord,focusLine:lineIndex,chunks:Object.freeze(chunks),
  sections:Object.freeze([
   Object.freeze({id:'first',name:'Source A · earlier record',start:0,end:4}),
   Object.freeze({id:'second',name:'Source B · competing record',start:5,end:9}),
   Object.freeze({id:'verification',name:'Verification · limits and counterclaims',start:10,end:14}),
   Object.freeze({id:'argument',name:'Synthesis · supported conclusion',start:15,end:19})
  ]),
  paragraphs:Object.freeze([
   Object.freeze({start:0,end:4,title:'First source and initial claim'}),
   Object.freeze({start:5,end:9,title:'Second source and apparent conflict'}),
   Object.freeze({start:10,end:14,title:'Verification and limitations'}),
   Object.freeze({start:15,end:19,title:'Argument and revised conclusion'})
  ]),
  cloze:Object.freeze({line:lineIndex,word:attested,choices:Object.freeze([attested,...alternatives])}),
  writing:Object.freeze({hanzi:final.hanzi,pinyin:final.pinyin,english:final.english,
   prompt:'Reconstruct the source-supported conclusion in Chinese.',
   explanation:goal+' '+contrast}),
  source:'original-p48-authorial',officialHskLevel:null
 });
}));
export const findP48Passage=id=>P48_PASSAGES.find(p=>p.id===id)||null;
export const P48_READING_ROWS=Object.freeze(P48_PASSAGES.map(p=>Object.freeze([
 p.title,p.theme,p.goal,8,
 Object.freeze(p.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(p.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 p.chunks,Object.freeze([p.cloze.line,p.cloze.word,...p.cloze.choices.slice(1)]),
 Object.freeze([p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation]),
 p.grammarIds,Object.freeze([p.focusWord.hanzi,p.focusWord.pinyin,p.focusWord.english]),
 p.contrast
])));
