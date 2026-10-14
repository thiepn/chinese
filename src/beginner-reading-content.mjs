/** P28 authored graded reading adapter. Beginner grades are instructional,
 * not official HSK levels and do not affect canonical scheduled review. */
import {BEGINNER_READING_A} from './beginner-reading-a.mjs';
import {BEGINNER_READING_B} from './beginner-reading-b.mjs';
import {P34_READING_ROWS} from './p34-course.mjs';
import {P38_PASSAGES,P38_READING_ROWS} from './p38-readings.mjs';
import {P41_PASSAGES,P41_READING_ROWS} from './p41-readings.mjs';
import {P46_PASSAGES,P46_READING_ROWS} from './p46-readings.mjs';
import {P47_PASSAGES,P47_READING_ROWS} from './p47-readings.mjs';
import {P48_PASSAGES,P48_READING_ROWS} from './p48-readings.mjs';
import {P50_PASSAGES,P50_READING_ROWS} from './p50-readings.mjs';
import {P51_PASSAGES,P51_READING_ROWS} from './p51-readings.mjs';
import {P52_CASES,P52_READING_ROWS} from './p52-course.mjs';
import {P53_CASES,P53_READING_ROWS} from './p53-course.mjs';
const historicalCount=BEGINNER_READING_A.length+BEGINNER_READING_B.length;
const p34End=historicalCount+P34_READING_ROWS.length;
const p38End=p34End+P38_READING_ROWS.length;
const p46Start=p38End+P41_READING_ROWS.length;
const p47Start=p46Start+P46_READING_ROWS.length;
const p48Start=p47Start+P47_READING_ROWS.length;
const p50Start=p48Start+P48_READING_ROWS.length;
const p51Start=p50Start+P50_READING_ROWS.length;
const p52Start=p51Start+P51_READING_ROWS.length;
const p53Start=p52Start+P52_READING_ROWS.length;
const raw=[...BEGINNER_READING_A,...BEGINNER_READING_B,...P34_READING_ROWS,...P38_READING_ROWS,...P41_READING_ROWS,...P46_READING_ROWS,...P47_READING_ROWS,...P48_READING_ROWS,...P50_READING_ROWS,...P51_READING_ROWS,...P52_READING_ROWS,...P53_READING_ROWS];
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
  id:'beginner-'+String(i+1).padStart(2,'0'),source:i>=p53Start?'original-p53':i>=p52Start?'original-p52':i>=p51Start?'original-p51':i>=p50Start?'original-p50':i>=p48Start?'original-p48':i>=p47Start?'original-p47':i>=p46Start?'original-p46':i>=p38End?'original-p41':i>=p34End?'original-p38':i>=historicalCount?'original-p34':'original-p28',
  grade:i>=p53Start?'Independent advanced argument and four-record synthesis · editorial HSK 5-targeted stage '+level:i>=p52Start?'Advanced independent multi-record synthesis · editorial HSK 5-targeted stage '+level:i>=p51Start?'Advanced original register/source fluency · editorial HSK 5-targeted stage '+level:i>=p50Start?'Advanced original discourse bridge · editorial HSK 5-targeted stage '+level:i>=p48Start?'Comparative source-based reading · original stage '+level:i>=p47Start?'Advanced contextual Mandarin · original stage '+level:i>=p46Start?'Upper-intermediate bridge · original stage '+level:i>=p38End?'Intermediate reading · authored stage '+level:i>=p34End?'Extended elementary reading · stage '+level:level===1?'First steps':'Building confidence',
  level,format:i>=p53Start?'four connected records with independently supported argument':i>=p52Start?'three independent records and comparative reasoning':i>=p51Start?'four-section register and source comparison':i>=p50Start?'advanced twenty-line comparative article':i>=p48Start?'comparative long-form source dossier':i>=p47Start?'four-paragraph connected article':i>=p46Start?'extended connected article':i>=p38End?P41_PASSAGES[i-p38End].format:i>=p34End?P38_PASSAGES[i-p34End].format:'short connected reading',purpose,
  questions:Object.freeze(modeQuestions),
  grammarIds:Object.freeze([...grammar]),
  focusWord:Object.freeze({hanzi:word[0],pinyin:word[1],english:word[2]}),
  bridge,writing:Object.freeze({prompt:writing[0],hanzi:writing[1],pinyin:writing[2],
   english:writing[3],explanation:writing[4]}),
  paragraphs:Object.freeze(i>=p53Start?P53_CASES[i-p53Start].sources.map(s=>({start:s.start,end:s.end,title:'Record '+(s.index+1)+': '+s.name})):i>=p52Start?P52_CASES[i-p52Start].sources.map(s=>({start:s.index*3,end:s.index*3+2,title:'Record '+(s.index+1)+': '+s.name})):i>=p51Start?P51_PASSAGES[i-p51Start].paragraphs:i>=p50Start?P50_PASSAGES[i-p50Start].paragraphs:i>=p48Start?P48_PASSAGES[i-p48Start].paragraphs:i>=p47Start?P47_PASSAGES[i-p47Start].paragraphs:i>=p46Start?P46_PASSAGES[i-p46Start].paragraphs:i>=p38End?P41_PASSAGES[i-p38End].paragraphs:i>=p34End?[
  {start:0,end:3,title:'Context and situation'},
  {start:4,end:8,title:'Development and spoken evidence'},
  {start:9,end:11,title:'Decision and conclusion'}
 ]:[{start:0,end:2,title:'Read the situation'},{start:3,end:5,title:'Follow what happens next'}]),
 p38:i>=p34End&&i<p38End?P38_PASSAGES[i-p34End]:null,
 p41:i>=p38End&&i<p46Start?P41_PASSAGES[i-p38End]:null,
 p46:i>=p46Start&&i<p47Start?P46_PASSAGES[i-p46Start]:null,
 p47:i>=p47Start&&i<p48Start?P47_PASSAGES[i-p47Start]:null,
 p48:i>=p48Start&&i<p50Start?P48_PASSAGES[i-p48Start]:null,
 p50:i>=p50Start&&i<p51Start?P50_PASSAGES[i-p50Start]:null,
 p51:i>=p51Start&&i<p52Start?P51_PASSAGES[i-p51Start]:null,
  p52:i>=p52Start&&i<p53Start?P52_CASES[i-p52Start]:null,
  p53:i>=p53Start?P53_CASES[i-p53Start]:null
 });
 const first=modeQuestions[0];
 return Object.freeze([title,theme,lines,[first.prompt,...first.options],
  [cloze[0],cloze[1],cloze[1],cloze[2],cloze[3],cloze[4]],reordered,null,meta]);
}));
export const BEGINNER_READING_COUNT=BEGINNER_READING_ROWS.length;
