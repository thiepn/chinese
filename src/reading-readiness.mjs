/** Reading readiness: how much of a reading sits inside the learner's studied
 * vocabulary. Purely descriptive evidence — it never claims mastery, and it
 * never touches review scheduling on its own. Word coverage uses the same
 * whole-word matching as the existing lexicon links; shorter words contained
 * inside longer matched words are not counted twice.
 */
import {WORDS,findWord} from './lexicon.mjs';
import {findLesson} from './demo-lessons.mjs';
export function studiedHanzi(state){
 const known=new Set();
 for(const id of state?.learned||[]){const lesson=findLesson(id);if(!lesson)continue;
  known.add(lesson.hanzi);for(const w of lesson.words)known.add(w.hanzi.replace(/\s/g,''));}
 for(const key of state?.vocabularyIntroduced||[]){const w=findWord(key);if(w)known.add(w.hanzi);}
 for(const key of state?.scheduledWords||[]){const w=findWord(key);if(w)known.add(w.hanzi);}
 return known;
}
function maximalMatches(text){
 const raw=WORDS.filter(w=>text.includes(w.hanzi));
 return raw.filter(w=>!raw.some(o=>o!==w&&o.hanzi.includes(w.hanzi)&&o.hanzi!==w.hanzi));
}
export function storyReadiness(state,story){
 const text=(story?.lines||[]).map(l=>l.hanzi).join('');
 const known=studiedHanzi(state);
 const used=maximalMatches(text);
 const unknown=used.filter(w=>!known.has(w.hanzi));
 const covered=used.length-unknown.length;
 const percent=used.length?Math.round(100*covered/used.length):100;
 return {used:used.length,covered,unknown,percent,
  label:percent>=90?'Ready to read independently':percent>=75?'Nearly ready \u2014 pre-study a few words':percent>=50?'Pre-study recommended':'Many new words \u2014 study before reading'};
}
