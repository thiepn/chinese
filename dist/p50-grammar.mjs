/** P50 original HSK 5-targeted discourse structures g147–g156.
 * These append to the canonical Grammar course and its exact-form writer.
 */
import {P50_GRAMMAR_A} from './p50-grammar-a.mjs';
import {P50_GRAMMAR_B} from './p50-grammar-b.mjs';
const records=[P50_GRAMMAR_A,P50_GRAMMAR_B].join('\n').trim().split('\n').filter(Boolean);
export const P50_GRAMMAR_ROWS=Object.freeze(records.map((line,i)=>{
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,first,second,choice]=line.split('|');
 const a=first.split('~'),b=second.split('~'),[correct,wrongA,wrongB]=choice.split('~');
 const start=a[0].indexOf(correct);
 const masked=start<0?a[0].replace(/。$/,'＿＿。'):a[0].slice(0,start)+'＿＿'+a[0].slice(start+correct.length);
 const chars=[...b[0]],step=Math.max(2,Math.ceil(chars.length/6));
 const chunks=[];for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 return Object.freeze([
  'g'+(147+i),chapter,title,pattern,explanation,contrast,pitfall,anchor,
  Object.freeze(a),Object.freeze(b),
  Object.freeze([masked,correct,wrongA,wrongB,...a]),
  Object.freeze(['Reconstruct a formally scoped original example for '+pattern+'.',...b,Object.freeze(chunks)])
 ]);
}));
