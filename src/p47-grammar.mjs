/** P47 authorial advanced grammar extends native g135–g146, immediately
 * following P46 g125–g134. No parallel grammar grading is introduced.
 */
import {P47_GRAMMAR_A} from './p47-grammar-a.mjs';
import {P47_GRAMMAR_B} from './p47-grammar-b.mjs';
const records=[P47_GRAMMAR_A,P47_GRAMMAR_B].join('\n').trim().split('\n').filter(Boolean);
export const P47_GRAMMAR_ROWS=Object.freeze(records.map((line,i)=>{
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,first,second,choice]=line.split('|');
 const a=first.split('~'),b=second.split('~'),[correct,wrongA,wrongB]=choice.split('~');
 const start=a[0].indexOf(correct);
 const masked=start<0?a[0].replace(/。$/,'＿＿。'):a[0].slice(0,start)+'＿＿'+a[0].slice(start+correct.length);
 const chars=[...b[0]],step=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 return Object.freeze([
  'g'+(135+i),chapter,title,pattern,explanation,contrast,pitfall,anchor,
  Object.freeze(a),Object.freeze(b),
  Object.freeze([masked,correct,wrongA,wrongB,...a]),
  Object.freeze(['Reconstruct a source-faithful sentence expressing '+pattern+'.',...b,Object.freeze(chunks)])
 ]);
}));
