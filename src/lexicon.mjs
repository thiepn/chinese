/** Canonical vocabulary index. Original P21/P22 lesson word keys remain unchanged.
 * P23 editorial word records add explanations and example sentences without
 * assigning official HSK membership or changing established learner IDs.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {VOCABULARY_ADDITIONS} from './vocabulary-expansion.mjs';
import {P31_VOCABULARY} from './p31-vocabulary.mjs';
import {P33_SCENARIOS} from './p33-scenarios.mjs';
import {P35_VOCABULARY} from './p35-vocabulary.mjs';
import {P39_VOCABULARY} from './p39-foundations.mjs';
import {P46_VOCABULARY} from './p46-foundations.mjs';
import {P47_VOCABULARY} from './p47-foundations.mjs';
import {P50_VOCABULARY} from './p50-foundations.mjs';
import {P37_SCENES} from './p37-scenarios.mjs';

export const plain=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[\s'’-]/g,'');
export const canonicalWordKey=(hanzi,pinyin)=>hanzi+'|'+plain(pinyin);
const index=new Map();
function entry(hanzi,pinyin){
 const key=canonicalWordKey(hanzi,pinyin);
 if(!index.has(key))index.set(key,{key,hanzi,pinyin,senses:[],lessonIds:[],notes:[],examples:[],collocations:[],source:'original-demonstration',officialHskLevel:null});
 return index.get(key);
}
function addExample(record,example){
 if(!example?.hanzi||!example?.pinyin||!example?.english)return;
 if(!record.examples.some(x=>x.hanzi===example.hanzi))record.examples.push({hanzi:example.hanzi,pinyin:example.pinyin,english:example.english});
}
for(const lesson of DEMO_LESSONS)for(const word of lesson.words){
 const record=entry(word.hanzi,word.pinyin);
 if(!record.senses.includes(word.english))record.senses.push(word.english);
 if(!record.lessonIds.includes(lesson.id))record.lessonIds.push(lesson.id);
 if(lesson.sentence.hanzi.includes(word.hanzi))addExample(record,lesson.sentence);
 if(lesson.extraSentence?.hanzi.includes(word.hanzi))addExample(record,lesson.extraSentence);
 if(lesson.grammar?.explanation&&!record.notes.includes(lesson.grammar.explanation))record.notes.push(lesson.grammar.explanation);
}
for(const original of VOCABULARY_ADDITIONS){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 if(!record.notes.includes(original.note))record.notes.unshift(original.note);
 for(const example of original.examples)addExample(record,example);
 for(const phrase of original.collocations||[])if(!record.collocations.includes(phrase))record.collocations.push(phrase);
 record.source=record.lessonIds.length?'original-lessons-and-p23':'original-p23';
}
for(const original of P31_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 if(!record.notes.includes(original.note))record.notes.unshift(original.note);
 for(const example of original.examples)addExample(record,example);
 for(const phrase of original.collocations)if(!record.collocations.includes(phrase))record.collocations.push(phrase);
 record.source=record.lessonIds.length?'original-lessons-and-p31':'original-p31';
}
// P33 contextual vocabulary is indexed under canonical keys. No new state writer.
for(const scene of P33_SCENARIOS)for(const term of scene.vocabulary){
 const record=entry(term.hanzi,term.pinyin);
 if(!record.senses.includes(term.english))record.senses.push(term.english);
 const usage='P33 · '+scene.title+': '+scene.teaching;
 if(!record.notes.includes(usage))record.notes.push(usage);
 for(const sentence of term.examples)addExample(record,sentence);
 if(!record.source.includes('p33'))record.source=record.source==='original-demonstration'?'original-p33-context':record.source+'-and-p33';
}
// P37 original expressions extend the canonical dictionary without a new word store.
for(const scene of P37_SCENES)for(const term of scene.vocabulary){
 const record=entry(term.hanzi,term.pinyin);
 if(!record.senses.includes(term.english))record.senses.push(term.english);
 const teaching='P37 · '+scene.title+': '+scene.teaching;
 if(!record.notes.includes(teaching))record.notes.push(teaching);
 for(const sample of term.examples)addExample(record,sample);
 if(!record.source.includes('p37'))record.source=record.source==='original-demonstration'?'original-p37-context':record.source+'-and-p37';
}
// P35 authored contextual vocabulary extends the existing word index and IDs.
for(const original of P35_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 for(const note of [original.note,original.usage,original.contrast,original.pronunciation])
  if(note&&!record.notes.includes(note))record.notes.push(note);
 for(const example of original.examples)addExample(record,example);
 for(const phrase of original.collocations)if(!record.collocations.includes(phrase))record.collocations.push(phrase);
 for(const id of original.lessonIds)if(!record.lessonIds.includes(id))record.lessonIds.push(id);
 if(!record.source.includes('p35'))record.source=record.source==='original-demonstration'?'original-p35':record.source+'-and-p35';
}
// P39 source-attested intermediate words extend original canonical keys.
for(const original of P39_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 for(const note of original.notes)if(note&&!record.notes.includes(note))record.notes.push(note);
 for(const example of original.examples)addExample(record,example);
 for(const phrase of original.collocations)if(!record.collocations.includes(phrase))record.collocations.push(phrase);
 for(const lessonId of original.lessonIds)if(!record.lessonIds.includes(lessonId))record.lessonIds.push(lessonId);
 if(!record.source.includes('p39'))record.source=record.source==='original-demonstration'?'original-p39':record.source+'-and-p39';
}
// P46 original vocabulary enters the same canonical index and Wordbook keyspace.
for(const original of P46_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 for(const note of [original.note,original.contrast])if(note&&!record.notes.includes(note))record.notes.push(note);
 for(const ex of original.examples)addExample(record,ex);
 for(const phrase of original.collocations)if(!record.collocations.includes(phrase))record.collocations.push(phrase);
 const lesson=DEMO_LESSONS.find(l=>l.hanzi===original.hanzi[0]);
 if(lesson&&!record.lessonIds.includes(lesson.id))record.lessonIds.push(lesson.id);
 if(!record.source.includes('p46'))record.source=record.source==='original-demonstration'?'original-p46':record.source+'-and-p46';
}
// Original P47 word families reuse the canonical Wordbook keys and lesson mapping.
for(const original of P47_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 for(const note of [original.note,original.contrast])if(note&&!record.notes.includes(note))record.notes.push(note);
 for(const example of original.examples)addExample(record,example);
 for(const item of original.collocations)if(!record.collocations.includes(item))record.collocations.push(item);
 for(const chr of original.hanzi){
  const lesson=DEMO_LESSONS.find(l=>l.hanzi===chr);
  if(lesson&&!record.lessonIds.includes(lesson.id))record.lessonIds.push(lesson.id);
 }
 if(!record.source.includes('p47'))record.source=record.source==='original-demonstration'?'original-p47':record.source+'-and-p47';
}
// P50 native Wordbook extension retains pre-existing word keys and examples.
for(const original of P50_VOCABULARY){
 const record=entry(original.hanzi,original.pinyin);
 if(!record.senses.includes(original.meaning))record.senses.push(original.meaning);
 for(const note of [original.note,original.contrast])if(note&&!record.notes.includes(note))record.notes.push(note);
 for(const example of original.examples)addExample(record,example);
 for(const c of original.collocations)if(!record.collocations.includes(c))record.collocations.push(c);
 for(const chr of original.hanzi){
  const lesson=DEMO_LESSONS.find(l=>l.hanzi===chr);
  if(lesson&&!record.lessonIds.includes(lesson.id))record.lessonIds.push(lesson.id);
 }
 if(!record.source.includes('p50'))record.source=record.source==='original-demonstration'?'original-p50':record.source+'-and-p50';
}
const characterMap=new Map(DEMO_LESSONS.map(l=>[l.hanzi,l.id]));
export const WORDS=Object.freeze([...index.values()].map(item=>{
 // A written component can point to a character lesson; it does not assert
 // shared meaning between the lexical word and that character.
 const relatedLessonIds=[...new Set([...item.hanzi].map(c=>characterMap.get(c)).filter(Boolean))];
 return Object.freeze({...item,
  senses:Object.freeze([...item.senses]),lessonIds:Object.freeze([...item.lessonIds]),
  relatedLessonIds:Object.freeze(relatedLessonIds),
  notes:Object.freeze([...item.notes]),collocations:Object.freeze([...item.collocations]),
  examples:Object.freeze(item.examples.map(ex=>Object.freeze({...ex}))),
 });
}).sort((a,b)=>a.hanzi.localeCompare(b.hanzi,'zh')||a.key.localeCompare(b.key)));
const lookup=new Map(WORDS.map(w=>[w.key,w]));
export const findWord=key=>lookup.get(key)||null;
export function wordFamily(key,limit=12){
 const word=findWord(key);if(!word)return [];
 const chars=new Set([...word.hanzi]);
 return WORDS.filter(other=>other.key!==key&&[...other.hanzi].some(char=>chars.has(char)))
   .map(other=>({word:other,score:[...other.hanzi].filter(char=>chars.has(char)).length+(other.hanzi.startsWith(word.hanzi)?2:0)}))
   .sort((a,b)=>b.score-a.score||a.word.hanzi.localeCompare(b.word.hanzi,'zh'))
   .slice(0,limit).map(x=>x.word);
}
export function searchCatalog(query,kind='all'){
 const q=plain(query);
 const matches=values=>!q||values.some(v=>plain(v).includes(q));
 const score=values=>!q?0:Math.max(...values.map(v=>{const p=plain(v);return p===q?10:p.startsWith(q)?5:p.includes(q)?2:0;}));
 const chars=kind==='words'?[]:DEMO_LESSONS.filter(l=>matches([l.hanzi,l.pinyin,l.meaning,l.note])).map(l=>({type:'character',id:l.id,hanzi:l.hanzi,pinyin:l.pinyin,english:l.meaning,rank:score([l.hanzi,l.pinyin,l.meaning])}));
 const words=kind==='characters'?[]:WORDS.filter(w=>matches([w.hanzi,w.pinyin,...w.senses,...w.collocations,...w.notes])).map(w=>({type:'word',id:w.key,hanzi:w.hanzi,pinyin:w.pinyin,english:w.senses.join(' / '),rank:score([w.hanzi,w.pinyin,...w.senses])}));
 return [...chars,...words].sort((a,b)=>b.rank-a.rank||a.hanzi.localeCompare(b.hanzi,'zh'));
}
