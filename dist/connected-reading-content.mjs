/** P27 expanded original reading content. Historical readings remain first and unchanged. */
import {CONNECTED_READING_DATA_A} from './connected-reading-data-a.mjs';
import {CONNECTED_READING_DATA_B} from './connected-reading-data-b.mjs';
import {READING_PARAGRAPH_GUIDES} from './reading-paragraph-guides.mjs';
export const CONNECTED_READING_DATA=Object.freeze([...CONNECTED_READING_DATA_A,...CONNECTED_READING_DATA_B]);
export const CONNECTED_READING_ROWS=Object.freeze(CONNECTED_READING_DATA.map((r,i)=>{
 const lines=r.paragraphs.flat();
 const q=r.q[0];
 const cloze=r.cloze;
 return [r.title,r.theme,lines,[q[1],q[2],q[3],q[4],q[5]],
   [cloze[0],cloze[1],cloze[1],cloze[2],cloze[3],cloze[4]],
   r.order, Object.freeze({
     type:r.type,difficulty:r.level,
     paragraphs:Object.freeze(r.paragraphs.map((p,j)=>Object.freeze({
       start:j*3,end:j*3+p.length-1,
       title:['Opening & context','Development & evidence','Outcome & interpretation'][j],
       summary:READING_PARAGRAPH_GUIDES[r.title]?.[j]?.[0]||'',
       focus:READING_PARAGRAPH_GUIDES[r.title]?.[j]?.[1]||''
     }))),
     questions:Object.freeze(r.q.map(([mode,prompt,answer,wrong1,wrong2,wrong3,evidence,explanation])=>Object.freeze({
       mode,prompt,answer,options:Object.freeze([answer,wrong1,wrong2,wrong3]),
       evidence,explanation
     }))),
     grammarIds:Object.freeze([...r.grammar]),
     writing:Object.freeze({
       prompt:r.writing[0],hanzi:r.writing[1],pinyin:r.writing[2],english:r.writing[3],explanation:r.writing[4]
     }),
     introduction:'Read all three connected paragraphs before answering. Notice how each new sentence changes the situation.',
     takeaways:'Use the passage itself as evidence. Infer only what the source supports; do not confuse possible conclusions with stated facts.'
   })];
}));
