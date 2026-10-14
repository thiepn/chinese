/** P51 editorial register-sensitive grammar g157–g164; canonical Grammar
 * course owns presentation, answer evaluation and exact-form writing.
 */
import {P51_GRAMMAR_SOURCE} from './p51-grammar-source.mjs';
const records=P51_GRAMMAR_SOURCE.trim().split('\n').filter(Boolean);
export const P51_GRAMMAR_ROWS=Object.freeze(records.map((s,i)=>{
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,first,second,choice]=s.split('|');
 const a=first.split('~'),b=second.split('~'),[correct,wrongA,wrongB]=choice.split('~');
 const index=a[0].indexOf(correct);
 const masked=index<0?a[0].replace(/。$/,'＿＿。'):a[0].slice(0,index)+'＿＿'+a[0].slice(index+correct.length);
 const chars=[...b[0]],step=Math.max(2,Math.ceil(chars.length/6)),chunks=[];
 for(let j=0;j<chars.length;j+=step)chunks.push(chars.slice(j,j+step).join(''));
 return Object.freeze(['g'+(157+i),chapter,title,pattern,explanation,contrast,pitfall,anchor,
  Object.freeze(a),Object.freeze(b),
  Object.freeze([masked,correct,wrongA,wrongB,...a]),
  Object.freeze(['Reconstruct a source- and register-faithful original statement.',...b,Object.freeze(chunks)])]);
}));
