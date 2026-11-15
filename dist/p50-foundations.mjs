/** P50 advanced instructional characters and word families.
 * Original editorial HSK 5-targeted material, never an official inventory.
 * Only the canonical DEMO_LESSONS and Wordbook own introductions/review.
 */
import {P50_CHAR_A} from './p50-character-a.mjs';
import {P50_CHAR_B} from './p50-character-b.mjs';
import {P50_CHAR_C} from './p50-character-c.mjs';
const records=[P50_CHAR_A,P50_CHAR_B,P50_CHAR_C].join('\n').trim().split('\n').filter(Boolean);
const triplet=s=>{const [hanzi,pinyin,english]=s.split('~');return Object.freeze({hanzi,pinyin,english})};
export const P50_CHARACTER_GUIDES=Object.freeze(records.map((line,i)=>{
 const [hanzi,pinyin,meaning,category,words,examples,teaching,pitfall]=line.split('|');
 return Object.freeze({id:'p50-character-'+String(i+1).padStart(2,'0'),
  sequence:i+1,hanzi,pinyin,meaning,category,teaching,pitfall,
  words:Object.freeze(words.split(';').map(triplet)),
  examples:Object.freeze(examples.split(';').map(triplet)),
  source:'original-p50-authorial',officialHskLevel:null});
}));
export const P50_CHARACTER_ROWS=Object.freeze(P50_CHARACTER_GUIDES.map(g=>Object.freeze([
 g.hanzi,g.pinyin,g.meaning,g.teaching,
 Object.freeze(g.words.map(w=>Object.freeze([w.hanzi,w.pinyin,w.english]))),
 Object.freeze([g.examples[0].hanzi,g.examples[0].pinyin,g.examples[0].english]),
 Object.freeze([g.examples[1].hanzi,g.examples[1].pinyin,g.examples[1].english]),
 'Use in context: '+g.words.map(w=>w.hanzi).join(' / '),
 g.words.map(w=>w.hanzi).join(' · '),g.teaching,g.pitfall,
 'Read each compound with correct lexical tones; compare meaning and register.'
])));
export const P50_VOCABULARY=Object.freeze(P50_CHARACTER_GUIDES.flatMap(g=>g.words.map(w=>
 Object.freeze({hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english,
  note:g.teaching,contrast:g.pitfall,
  examples:Object.freeze(g.examples.filter(x=>x.hanzi.includes(w.hanzi))),
  collocations:Object.freeze(g.words.filter(x=>x.hanzi!==w.hanzi).map(x=>x.hanzi)),
  source:'original-p50-authorial',officialHskLevel:null}))));
export const P50_CHARACTER_TASKS=Object.freeze(P50_CHARACTER_GUIDES.flatMap(g=>
 g.examples.map((x,i)=>Object.freeze({id:'p50:character:'+g.hanzi+':example'+i,
  kind:'p50-character-exact',p50Character:g.hanzi,
  hanzi:x.hanzi,pinyin:x.pinyin,english:x.english,
  explanation:g.teaching,misconception:g.pitfall}))));
export const findP50Character=hanzi=>P50_CHARACTER_GUIDES.find(g=>g.hanzi===hanzi)||null;
