/** P28 authored graded reading adapter. Beginner grades are instructional,
 * not official HSK levels and do not affect canonical scheduled review. */
import {BEGINNER_READING_A} from './beginner-reading-a.mjs';
import {BEGINNER_READING_B} from './beginner-reading-b.mjs';
const raw=[...BEGINNER_READING_A,...BEGINNER_READING_B];
function fallbackChunks(lines){
 const target=lines[0][0];
 const units=Array.from(target);
 const out=[];for(let i=0;i<units.length;i+=2)out.push(units.slice(i,i+2).join(''));
 return out;
}
export const BEGINNER_READING_ROWS=Object.freeze(raw.map((r,i)=>{
 const [title,theme,purpose,level,lines,questions,order,cloze,writing,grammar,word,bridge]=r;
 const chosen=lines.find(l=>l[0]===order.join(''));
 const reordered=chosen?order:fallbackChunks(lines);
 const modeQuestions=questions.map((q,j)=>Object.freeze({id:'beginner:'+String(i+1).padStart(2,'0')+':'+j,
  mode:['beginner-detail','beginner-reason','beginner-sequence'][j],
  prompt:q[0],answer:q[1],options:Object.freeze(q.slice(1,5)),evidence:q[5],
  explanation:q[6]}));
 const meta=Object.freeze({
  id:'beginner-'+String(i+1).padStart(2,'0'),
  grade:level===1?'First steps':'Building confidence',
  level,format:'short connected reading',purpose,
  questions:Object.freeze(modeQuestions),
  grammarIds:Object.freeze([...grammar]),
  focusWord:Object.freeze({hanzi:word[0],pinyin:word[1],english:word[2]}),
  bridge,writing:Object.freeze({prompt:writing[0],hanzi:writing[1],pinyin:writing[2],
   english:writing[3],explanation:writing[4]}),
  paragraphs:Object.freeze([{start:0,end:2,title:'Read the situation'},{start:3,end:5,title:'Follow what happens next'}])
 });
 const first=modeQuestions[0];
 return Object.freeze([title,theme,lines,[first.prompt,...first.options],
  [cloze[0],cloze[1],cloze[1],cloze[2],cloze[3],cloze[4]],reordered,null,meta]);
}));
export const BEGINNER_READING_COUNT=BEGINNER_READING_ROWS.length;
