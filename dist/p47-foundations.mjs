/** P47 source-owned upper-intermediate character/word families. All records
 * original, educational and not an official HSK 3.0 / HSK 4.0 inventory.
 * Historical demo lesson IDs are assigned by canonical DEMO_LESSONS append.
 */
import {P47_CHAR_A} from './p47-character-a.mjs';
import {P47_CHAR_B} from './p47-character-b.mjs';
import {P47_CHAR_C} from './p47-character-c.mjs';
import {P47_CHAR_D} from './p47-character-d.mjs';

const lines=[P47_CHAR_A,P47_CHAR_B,P47_CHAR_C,P47_CHAR_D].join('\n').trim().split('\n').filter(Boolean);
const triplet=value=>{
 const [hanzi,pinyin,english]=value.split('~');
 return Object.freeze({hanzi,pinyin,english});
};
export const P47_CHARACTER_GUIDES=Object.freeze(lines.map((source,i)=>{
 const [hanzi,pinyin,meaning,category,wordText,examples,teaching,pitfall]=source.split('|');
 return Object.freeze({
  id:'p47-character-'+String(i+1).padStart(2,'0'),sequence:i+1,
  hanzi,pinyin,meaning,category,
  words:Object.freeze(wordText.split(';').map(triplet)),
  examples:Object.freeze(examples.split(';').map(triplet)),
  teaching,pitfall,source:'original-p47-authorial',officialHskLevel:null
 });
}));
export const P47_CHARACTER_ROWS=Object.freeze(P47_CHARACTER_GUIDES.map(g=>Object.freeze([
 g.hanzi,g.pinyin,g.meaning,g.teaching,Object.freeze(g.words.map(w=>
  Object.freeze([w.hanzi,w.pinyin,w.english]))),
 Object.freeze([g.examples[0].hanzi,g.examples[0].pinyin,g.examples[0].english]),
 Object.freeze([g.examples[1].hanzi,g.examples[1].pinyin,g.examples[1].english]),
 'Meaning contrast: '+g.words.map(w=>w.hanzi).join(' / '),
 g.words.map(w=>w.hanzi).join(' · '),g.teaching,g.pitfall,
 'Practise connected Hanyu Pinyin tones and full contextual expressions, not isolated glosses.'
])));
export const P47_VOCABULARY=Object.freeze(P47_CHARACTER_GUIDES.flatMap(g=>g.words.map(w=>
 Object.freeze({
  hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english,
  note:g.teaching,contrast:g.pitfall,
  examples:Object.freeze(g.examples.filter(l=>l.hanzi.includes(w.hanzi))),
  collocations:Object.freeze(g.words.filter(x=>x.hanzi!==w.hanzi).map(x=>x.hanzi)),
  source:'original-p47-authorial',officialHskLevel:null
 }))));
export const P47_CHARACTER_WRITING_TASKS=Object.freeze(P47_CHARACTER_GUIDES.flatMap(g=>
 g.examples.map((s,i)=>Object.freeze({
  id:'p47:character:'+g.hanzi+':example'+i,kind:'p47-character-exact',
  p47Character:g.hanzi,hanzi:s.hanzi,pinyin:s.pinyin,english:s.english,
  explanation:g.teaching,misconception:g.pitfall
 }))));
export const findP47Guide=hanzi=>P47_CHARACTER_GUIDES.find(g=>g.hanzi===hanzi)||null;
