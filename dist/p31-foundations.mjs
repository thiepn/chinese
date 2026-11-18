// P31 original Simplified beginner curriculum rows, not official HSK 3.0 membership.
// Appends to the 144 historical character IDs; no legacy row is rewritten.
import {P31_ROWS_A} from './p31-character-a.mjs';
import {P31_ROWS_B} from './p31-character-b.mjs';
import {P31_ROWS_C} from './p31-character-c.mjs';
import {P31_ROWS_D} from './p31-character-d.mjs';
const raw=[...P31_ROWS_A,...P31_ROWS_B,...P31_ROWS_C,...P31_ROWS_D];
const category=i=>i<9?'Family & people':i<15?'Places and directions':i<21?'Home and surroundings':
 i<31?'Seasons and weather':i<39?'Food and meals':i<46?'Useful actions':'Qualities and comparisons';
export const P31_CHARACTER_ROWS=Object.freeze(raw.map(row=>Object.freeze(row.slice(0,10))));
export const P31_CHARACTER_GUIDES=Object.freeze(raw.map((r,i)=>Object.freeze({
 id:`demo-${String(145+i).padStart(2,'0')}`,hanzi:r[0],pinyin:r[1],meaning:r[2],
 category:category(i),sequence:i+1,
 explanation:r[3],grammarTitle:r[7],grammarPattern:r[8],grammarExplanation:r[9],
 pitfall:r[10],pronunciation:r[11],
 words:Object.freeze(r[4].map(w=>Object.freeze({hanzi:w[0],pinyin:w[1],english:w[2]}))),
 examples:Object.freeze([r[5],r[6]].map(([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english})))
})));
const byId=new Map(P31_CHARACTER_GUIDES.map(x=>[x.id,x]));
const byHanzi=new Map(P31_CHARACTER_GUIDES.map(x=>[x.hanzi,x]));
export const findP31Guide=ref=>byId.get(ref)||byHanzi.get(ref)||null;
export const P31_THEMES=Object.freeze([...new Set(P31_CHARACTER_GUIDES.map(x=>x.category))]);
export function nextP31Guide(state,theme='all',fromId=null){
 const pool=P31_CHARACTER_GUIDES.filter(g=>theme==='all'||g.category===theme);
 if(!pool.length)return null;
 const start=Math.max(-1,pool.findIndex(x=>x.id===fromId));
 const rotated=[...pool.slice(start+1),...pool.slice(0,start+1)];
 return rotated.find(g=>!(state.learned||[]).includes(g.id))||rotated[0]||pool[0];
}
export const P31_WRITING_TASKS=Object.freeze(P31_CHARACTER_GUIDES.flatMap(g=>
 g.examples.map((e,i)=>Object.freeze({id:`p31:${g.id}:line${i+1}`,kind:'p31-character-transfer',
  p31LessonId:g.id,hanzi:e.hanzi,pinyin:e.pinyin,english:e.english,
  explanation:g.grammarExplanation})) ));
