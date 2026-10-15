/** P51 original register-aware advanced Mandarin; editorial HSK 5-targeted,
 * not an official vocabulary inventory or certification.
 */
import {P51_CHAR_A} from './p51-char-a.mjs';
import {P51_CHAR_B} from './p51-char-b.mjs';
import {P51_CHAR_C} from './p51-char-c.mjs';
import {P51_CHAR_D} from './p51-char-d.mjs';
const raw=[P51_CHAR_A,P51_CHAR_B,P51_CHAR_C,P51_CHAR_D].join('\n').trim().split('\n').filter(Boolean);
const triplet=v=>{const [hanzi,pinyin,english]=v.split('~');return Object.freeze({hanzi,pinyin,english});};
export const P51_CHARACTERS=Object.freeze(raw.map((line,i)=>{
 const [hanzi,pinyin,meaning,category,words,examples,teaching,pitfall]=line.split('|');
 return Object.freeze({id:'p51-character-'+String(i+1).padStart(2,'0'),sequence:i+1,hanzi,pinyin,meaning,category,
  // Split only at the next complete Hanzi~Pinyin~English entry. A source
  // gloss may itself contain a semicolon (e.g. 'approximately; probably').
  words:Object.freeze(words.split(/;(?=[^;~|]+~[^;~|]+~)/).map(triplet)),
  examples:Object.freeze(examples.split(';').map(triplet)),
  teaching,pitfall,source:'original-p51-authorial',officialHskLevel:null});
}));
export const P51_CHARACTER_ROWS=Object.freeze(P51_CHARACTERS.map(g=>Object.freeze([
 g.hanzi,g.pinyin,g.meaning,g.teaching,
 Object.freeze(g.words.map(w=>Object.freeze([w.hanzi,w.pinyin,w.english]))),
 Object.freeze([g.examples[0].hanzi,g.examples[0].pinyin,g.examples[0].english]),
 Object.freeze([g.examples[1].hanzi,g.examples[1].pinyin,g.examples[1].english]),
 'Register and meaning: '+g.words.map(w=>w.hanzi).join(' vs '),
 g.words.map(w=>w.hanzi).join(' · '),g.teaching,g.pitfall,
 'Compare conversational and formal use in contextual original examples.'
])));
export const P51_VOCABULARY=Object.freeze(P51_CHARACTERS.flatMap(g=>g.words.map(w=>
 Object.freeze({hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english,
  note:g.teaching,contrast:g.pitfall,
  examples:Object.freeze(g.examples.filter(e=>e.hanzi.includes(w.hanzi))),
  collocations:Object.freeze(g.words.filter(e=>e.hanzi!==w.hanzi).map(e=>e.hanzi)),
  source:'original-p51-authorial',officialHskLevel:null}))));
export const P51_CHARACTER_TASKS=Object.freeze(P51_CHARACTERS.flatMap(g=>g.examples.map((e,i)=>
 Object.freeze({id:'p51:character:'+g.hanzi+':example'+i,kind:'p51-register-exact',
  p51Character:g.hanzi,hanzi:e.hanzi,pinyin:e.pinyin,english:e.english,
  explanation:g.teaching,misconception:g.pitfall}))));
export const findP51Character=hanzi=>P51_CHARACTERS.find(g=>g.hanzi===hanzi)||null;
