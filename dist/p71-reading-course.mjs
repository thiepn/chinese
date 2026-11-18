/** P71–P74 authorial source adapter. Appended only after all historical IDs.
 * Every answer uses the existing STORY, beginnerQuestion and reading/writing writers.
 * Internal level 6 = learning band, never official HSK membership.
 */
import {P71_MANUSCRIPTS} from './p71-manuscripts.mjs';
const chunks=hanzi=>{const units=Array.from(hanzi),size=Math.max(2,Math.ceil(units.length/6));
 const result=[];for(let i=0;i<units.length;i+=size)result.push(units.slice(i,i+size).join(''));return result;};
export const P71_SOURCE_READINGS=Object.freeze(P71_MANUSCRIPTS.map((r,i)=>{
 const end=r.lines.at(-1),order=chunks(end[0]),clozeLine=r.grammar[0][1],
 word=r.grammar[0][2];
 const wrong=['虽然','因为','如果'].filter(x=>x!==word).slice(0,3);
 const choices=Object.freeze([word,...wrong]);
 return Object.freeze({
  id:'p71-'+String(i+1).padStart(2,'0'),title:r.title,theme:r.theme,purpose:r.purpose,
  level:6,approval:'DEMO_ONLY',officialHskLevel:null,
  lines:Object.freeze(r.lines.map(x=>Object.freeze({hanzi:x[0],pinyin:x[1],english:x[2]}))),
  questions:Object.freeze(r.q.map(([prompt,answer,a,b,c,evidence,explanation],j)=>Object.freeze({
   id:'p71-'+String(i+1).padStart(2,'0')+':q'+(j+1),prompt,answer,
   options:Object.freeze([answer,a,b,c]),evidence,explanation
  }))),
  grammarEvidence:Object.freeze(r.grammar.map(([grammarId,lineIndex,token])=>Object.freeze({grammarId,lineIndex,token}))),
  grammarIds:Object.freeze(r.grammar.map(g=>g[0])),
  focusWord:Object.freeze({hanzi:r.focus[0],pinyin:r.focus[1],english:r.focus[2]}),
  listeningCue:Object.freeze({lineIndex:r.cue,hanzi:r.lines[r.cue][0],
   prompt:'Listen to this source sentence on your device, then answer an original reading question.'}),
  cloze:Object.freeze({line:clozeLine,word,choices}),
  order:Object.freeze(order),
  writing:Object.freeze({prompt:'Write the source-qualified final conclusion from its English meaning.',
   hanzi:end[0],pinyin:end[1],english:end[2],
   explanation:'Reconstruct the original taught model; other valid Chinese wording requires a fluent editor.'}),
  bridge:'Track the exact difference between preliminary information, independently checked evidence and the supported conclusion.'
 });
}));
export const P71_READING_ROWS=Object.freeze(P71_SOURCE_READINGS.map(x=>Object.freeze([
 x.title,x.theme,x.purpose,x.level,
 Object.freeze(x.lines.map(l=>Object.freeze([l.hanzi,l.pinyin,l.english]))),
 Object.freeze(x.questions.map(q=>Object.freeze([q.prompt,...q.options,q.evidence,q.explanation]))),
 x.order,Object.freeze([x.cloze.line,...x.cloze.choices]),
 Object.freeze([x.writing.prompt,x.writing.hanzi,x.writing.pinyin,x.writing.english,x.writing.explanation]),
 x.grammarIds,Object.freeze([x.focusWord.hanzi,x.focusWord.pinyin,x.focusWord.english]),x.bridge
])));
