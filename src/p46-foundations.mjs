/** P46 original upper-intermediate teaching characters and attested vocabulary.
 * Appends to canonical DEMO_LESSONS / Wordbook; this is not an official HSK list.
 * Old lesson and word keys remain unchanged.
 */
import {P46_CHARS_A} from './p46-chars-a.mjs';
import {P46_CHARS_B} from './p46-chars-b.mjs';
import {P46_CHARS_C} from './p46-chars-c.mjs';
const records=[P46_CHARS_A,P46_CHARS_B,P46_CHARS_C].join('\n').trim().split('\n').filter(Boolean);
export const P46_CHARACTER_GUIDES=Object.freeze(records.map((s,i)=>{
 const [hanzi,pinyin,meaning,category,words,examples,teaching,pitfall]=s.split('|');
 const parse=row=>{const [hanzi,pinyin,english]=row.split('~');return Object.freeze({hanzi,pinyin,english})};
 return Object.freeze({id:'p46-character-'+String(i+1).padStart(2,'0'),sequence:i+1,hanzi,pinyin,meaning,category,
  words:Object.freeze(words.split(';').map(parse)),examples:Object.freeze(examples.split(';').map(parse)),
  teaching,pitfall,source:'original-p46-authorial',officialHskLevel:null});
}));
/** Native learner cards receive actual append-only demo IDs from demo-lessons.mjs. */
export const P46_CHARACTER_ROWS=Object.freeze(P46_CHARACTER_GUIDES.map(g=>Object.freeze([
 g.hanzi,g.pinyin,g.meaning,g.teaching,Object.freeze(g.words.map(w=>[w.hanzi,w.pinyin,w.english])),
 [g.examples[0].hanzi,g.examples[0].pinyin,g.examples[0].english],
 [g.examples[1].hanzi,g.examples[1].pinyin,g.examples[1].english],
 'Word meanings in context: '+g.hanzi,
 g.words.map(w=>w.hanzi).join(' / '),g.teaching,g.pitfall,
 'Attend to lexical tones, connected speech and the entire word.'
])));
export const P46_VOCABULARY=Object.freeze(P46_CHARACTER_GUIDES.flatMap(g=>g.words.map(w=>{
 const examples=g.examples.filter(x=>x.hanzi.includes(w.hanzi));
 return Object.freeze({hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english,
  note:g.teaching,contrast:g.pitfall,examples:Object.freeze(examples),
  collocations:Object.freeze(g.words.map(x=>x.hanzi).filter(x=>x!==w.hanzi)),source:'original-p46',
  officialHskLevel:null});
})));
export const P46_WRITING_TASKS=Object.freeze(P46_CHARACTER_GUIDES.flatMap(g=>g.examples.map((e,i)=>
 Object.freeze({id:'p46:character:'+g.hanzi+':example'+i,kind:'p46-character-exact',
  p46Character:g.hanzi,hanzi:e.hanzi,pinyin:e.pinyin,english:e.english,
  explanation:g.teaching,misconception:g.pitfall}))));
export const findP46Guide=hanzi=>P46_CHARACTER_GUIDES.find(g=>g.hanzi===hanzi)||null;
