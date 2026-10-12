/** Derived, searchable lexical index of original, non-official lesson examples. */
import { DEMO_LESSONS } from './demo-lessons.mjs';
function plain(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[\s'’-]/g,'');}
const index=new Map();
for(const lesson of DEMO_LESSONS){for(const word of lesson.words){const key=word.hanzi+'|'+plain(word.pinyin);let record=index.get(key);if(!record){record={key,hanzi:word.hanzi,pinyin:word.pinyin,senses:[],lessonIds:[],source:'original-demonstration',officialHskLevel:null};index.set(key,record);}
  if(!record.senses.includes(word.english))record.senses.push(word.english);
  if(!record.lessonIds.includes(lesson.id))record.lessonIds.push(lesson.id);
}}
export const WORDS=Object.freeze([...index.values()].map(w=>Object.freeze({...w,senses:Object.freeze(w.senses),lessonIds:Object.freeze(w.lessonIds)})).sort((a,b)=>a.hanzi.localeCompare(b.hanzi,'zh')));
export const findWord=(key)=>WORDS.find(w=>w.key===key)||null;
export function searchCatalog(query,kind='all'){
 const q=plain(query);const matched=(obj)=>!q||obj.some(value=>plain(value).includes(q));
 const chars=kind==='words'?[]:DEMO_LESSONS.filter(l=>matched([l.hanzi,l.pinyin,l.meaning,l.note])).map(l=>({type:'character',id:l.id,hanzi:l.hanzi,pinyin:l.pinyin,english:l.meaning}));
 const words=kind==='characters'?[]:WORDS.filter(w=>matched([w.hanzi,w.pinyin,...w.senses])).map(w=>({type:'word',id:w.key,hanzi:w.hanzi,pinyin:w.pinyin,english:w.senses.join(' / ')}));
 return [...chars,...words];
}
