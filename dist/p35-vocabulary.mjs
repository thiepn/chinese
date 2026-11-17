/** P35 original contextual vocabulary editorial.
 * Complements canonical WORDS using the same (Hanzi, tone-marked Pinyin) key.
 * Words are authored inside the 70 P35 character lessons. All example
 * sentences are original from P32–P35; no generated/guessed Pinyin, no
 * publisher text, and no official HSK item membership is asserted.
 */
import {P35_CHARACTER_GUIDES} from './p35-foundations.mjs';
import {P33_SCENARIOS} from './p33-scenarios.mjs';
import {P34_SCENES} from './p34-course.mjs';
import {P32_SENTENCE_TOPICS_A} from './p32-sentences-a.mjs';
import {P32_SENTENCE_TOPICS_B} from './p32-sentences-b.mjs';
const sceneSentences=P33_SCENARIOS.flatMap(s=>s.turns.map(t=>({hanzi:t[1],pinyin:t[2],english:t[3]})));
const readingSentences=P34_SCENES.flatMap(s=>[...s.reading,...s.listen].map(r=>({
 hanzi:r.length===4?r[1]:r[0],
 pinyin:r.length===4?r[2]:r[1],
 english:r.length===4?r[3]:r[2]
})));
const baseSentences=[...P32_SENTENCE_TOPICS_A,...P32_SENTENCE_TOPICS_B].flatMap(t=>t[5].map(
 ([hanzi,pinyin,english])=>({hanzi,pinyin,english})));
const characterSentences=P35_CHARACTER_GUIDES.flatMap(g=>g.examples);
const contexts=[...characterSentences,...sceneSentences,...readingSentences,...baseSentences];
const normalize=s=>String(s).replace(/\s+/g,'');
const authored=new Map();
for(const guide of P35_CHARACTER_GUIDES){
 for(const word of guide.words){
  const key=word.hanzi+'|'+word.pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[\s'’-]/g,'');
  if(!authored.has(key))authored.set(key,{word,guides:[]});
  authored.get(key).guides.push(guide);
 }
}
export const P35_VOCABULARY=Object.freeze([...authored].flatMap(([key,{word,guides}])=>{
 const examples=[],seen=new Set(),target=normalize(word.hanzi);
 for(const line of contexts){
  if(!normalize(line.hanzi).includes(target)||seen.has(line.hanzi))continue;
  seen.add(line.hanzi);examples.push(Object.freeze({...line}));
  if(examples.length===4)break;
 }
 // A context-linked editorial needs an authentic example; unattested word
 // families still remain in canonical lesson words, but are not fabricated
 // as separate richly contextualized vocabulary entries.
 if(!examples.length)return [];
 const g=guides[0],related=[...new Set(g.words.map(w=>w.hanzi).filter(w=>w!==word.hanzi))];
 return [Object.freeze({
  key,hanzi:word.hanzi,pinyin:word.pinyin,meaning:word.english,
  note:'In the '+g.category.toLowerCase()+' unit, '+g.explanation+' The taught context for '+word.hanzi+
    ' distinguishes it from a nearby beginner construction: '+g.grammarExplanation,
  usage:g.grammarPattern,contrast:g.pitfall,pronunciation:g.pronunciation,
  examples:Object.freeze(examples),collocations:Object.freeze(related),
  lessonIds:Object.freeze([...new Set(guides.map(x=>x.id))]),origin:'original-authorial-p35',
  officialHskLevel:null
 })];
}));
export const P35_VOCAB_KEYS=Object.freeze(P35_VOCABULARY.map(w=>w.key));
