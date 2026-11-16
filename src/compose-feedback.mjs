/** Composition feedback: honest comparison of a free Chinese composition
 * against a taught model. It NEVER declares free composition correct or
 * incorrect on its own — it reports what differs (missing model words, words
 * chosen instead, characters outside the taught corpus) so the learner can
 * judge, exactly like a teacher pointing at the model. All grading surfaces
 * keep their existing strict exact-match verdicts for credit purposes.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
let corpus=null;
function corpusChars(){
 if(!corpus){corpus=new Set();
  for(const l of DEMO_LESSONS){for(const ch of l.hanzi)corpus.add(ch);
   for(const w of l.words)for(const ch of w.hanzi)corpus.add(ch);
   for(const ch of l.sentence.hanzi)corpus.add(ch);
   if(l.extraSentence)for(const ch of l.extraSentence.hanzi)corpus.add(ch);}
  for(const w of WORDS)for(const ch of w.hanzi)corpus.add(ch);}
 return corpus;
}
const strip=s=>String(s||'').normalize('NFC').replace(/[\s\u3000。，！？.!?,;；、：:“”"'‘’（）()]/gu,'');
export function composeCheck(model,answer){
 const m=strip(model),a=strip(answer);
 if(!a)return {verdict:'empty',message:'Write a Chinese sentence before checking.'};
 if(a===m)return {verdict:'model',message:'Your sentence matches the taught model exactly.'};
 const lexiconWords=[...new Set(WORDS.filter(w=>w.hanzi.length>=2).map(w=>w.hanzi))];
 const modelWords=lexiconWords.filter(w=>m.includes(w));
 const missing=modelWords.filter(w=>!a.includes(w));
 const answerWords=lexiconWords.filter(w=>a.includes(w));
 const different=answerWords.filter(w=>!m.includes(w));
 const chars=corpusChars();
 const outside=[...new Set([...a].filter(ch=>/[\u4e00-\u9fff]/.test(ch)&&!chars.has(ch)))];
 const notes=[];
 if(missing.length)notes.push('It does not use '+missing.slice(0,4).map(w=>'\u201c'+w+'\u201d').join(', ')+' from the model');
 if(different.length)notes.push('It expresses part of the meaning with different words ('+different.slice(0,4).map(w=>'\u201c'+w+'\u201d').join(', ')+') \u2014 compare them with the model');
 if(outside.length)notes.push('These characters are outside the lesson and vocabulary corpus: '+outside.slice(0,6).join(' '));
 if(a.length<Math.max(1,Math.floor(m.length*0.5)))notes.push('It is much shorter than the model');
 const message='Your sentence differs from the taught model. '+(notes.length?notes.join('. ')+'. ':'')+
  'Word order, synonyms and valid alternatives are not judged automatically \u2014 compare both sentences carefully before moving on.';
 return {verdict:'differs',missing,different,outside,message};
}
