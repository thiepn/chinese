/** P46 source-authored upper-intermediate grammar imported into the
 * original GRAMMAR_LESSONS and native grammar writing/choice practice.
 * g125 onwards follows P40's 30 g95–g124 lessons.
 */
import {P46_GRAMMAR_SOURCE} from './p46-grammar-source.mjs';
const groups=P46_GRAMMAR_SOURCE.trim().split('\n').filter(Boolean);
export const P46_GRAMMAR_ROWS=Object.freeze(groups.map((line,i)=>{
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,
  exA,exB,clozeSource]=line.split('|');
 const unpack=t=>t.split('~');
 const a=unpack(exA),b=unpack(exB);
 const [correct,wrongA,wrongB]=clozeSource.split('~');
 const index=a[0].indexOf(correct);
 const masked=index<0?a[0].replace(/。$/,'＿＿。'):a[0].slice(0,index)+'＿＿'+a[0].slice(index+correct.length);
 const chunkSize=Math.max(2,Math.ceil([...b[0]].length/6));
 const chunks=[];for(let j=0;j<[...b[0]].length;j+=chunkSize)chunks.push([...b[0]].slice(j,j+chunkSize).join(''));
 return Object.freeze([
  'g'+(125+i),chapter,title,pattern,explanation,contrast,pitfall,anchor,
  Object.freeze(a),Object.freeze(b),
  Object.freeze([masked,correct,wrongA,wrongB,...a]),
  Object.freeze(['Reconstruct a precise new sentence using '+pattern+'.',...b,Object.freeze(chunks)])
 ]);
}));
