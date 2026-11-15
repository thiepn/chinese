/** P43 original intermediate independent writing and spoken-transfer source.
 * Source data only. The long composition is not a scored sentence task;
 * separate authorial anchor sentences reuse canonical Sentence Workshop.
 */
import {P43_WRITING_A} from './p43-writing-a.mjs';
import {P43_WRITING_B} from './p43-writing-b.mjs';
import {P43_WRITING_C} from './p43-writing-c.mjs';
const bodies=[P43_WRITING_A,P43_WRITING_B,P43_WRITING_C]
 .flatMap(file=>file.trim().split(/\n\s*\n/).filter(Boolean));
const parse=(block,i)=>{
 const [header,...content]=block.split('\n').filter(Boolean);
 const [title,theme,readingId,dialogueId,grammar,goal,misconception,revision,oral,sourceClaim]=header.split('|');
 const lines=content.filter(row=>row.startsWith('L|')).map(row=>{
  const [hanzi,pinyin,english]=row.slice(2).split('|');
  return Object.freeze({hanzi,pinyin,english});
 });
 return Object.freeze({
  id:'p43-'+String(i+1).padStart(2,'0'),sequence:i+1,title,theme,readingId,dialogueId,
  grammarIds:Object.freeze(grammar.split(',')),
  stage:1+Math.floor(i/4),goal,misconception,revision,oral,sourceClaim,
  planning:Object.freeze([
   'Paragraph 1: identify the actual situation, source facts, and the original assumption or proposed action.',
   'Paragraph 2: explain the evidence, change or consequence, and draw a justified conclusion.',
   'Keep chronology, agents and uncertainty consistent with the independently authored P41 source.'
  ]),
  sections:Object.freeze([{start:0,end:4,title:'Situation, proposed claim and evidence'},
   {start:5,end:9,title:'Correction, consequences and conclusion'}]),
  lines:Object.freeze(lines),source:'original-p43-authorial',officialHskLevel:null
 });
};
export const P43_UNITS=Object.freeze(bodies.map(parse));
export const findP43Unit=id=>P43_UNITS.find(u=>u.id===id)||null;
/** These are only exact-sentence transfer prompts, not open-ended essay grades. */
export const P43_WRITING_TASKS=Object.freeze(P43_UNITS.flatMap(u=>
 [4,9].map(index=>{
  const line=u.lines[index];
  return Object.freeze({id:'p43:'+u.id+':line'+index,
   kind:'p43-exact-sentence-transfer',p43UnitId:u.id,p43Line:index,
   english:line.english,hanzi:line.hanzi,pinyin:line.pinyin,
   explanation:u.goal,misconception:u.misconception,sourceClaim:u.sourceClaim});
 })));
export const P43_REVIEW_CRITERIA=Object.freeze([
 Object.freeze({id:'source',label:'Every factual claim agrees with the original reading; unsupported details are removed.'}),
 Object.freeze({id:'organization',label:'Two connected paragraphs distinguish context from result and conclude the task.'}),
 Object.freeze({id:'transition',label:'Natural temporal, causal or contrastive connectors match their intended meaning.'}),
 Object.freeze({id:'grammar',label:'Subjects, word order and the selected grammar patterns are meaningfully checked.'}),
 Object.freeze({id:'integrity',label:'Uncertain proposals, confirmed facts and completed actions are not conflated.'}),
 Object.freeze({id:'oral',label:'The meaning can be explained aloud independently without claiming speech grading.'})
]);
