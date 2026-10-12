/** Original demonstration drills. Never score these as official HSK attainment or scheduled-review mastery. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {evaluateAnswer} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
export const DRILL_MODES=Object.freeze(['recognition','word-meaning','word-pinyin','word-build','sentence-cloze','reading-choice']);
function unique(a){return [...new Set(a)];}
function rotateOptions(answer, distractors,seed){const options=unique([answer,...distractors.filter(x=>x!==answer)]).slice(0,4);const shift=seed%options.length;return [...options.slice(shift),...options.slice(0,shift)];}
export function buildDrill(lessonId,mode){const l=findLesson(lessonId);if(!l||!DRILL_MODES.includes(mode))return null;
 const others=DEMO_LESSONS.filter(x=>x.id!==lessonId);const seed=l.order;
 if(mode==='recognition')return {mode,kind:'choice',prompt:`Select the character meaning “${l.meaning}”.`,answer:l.hanzi,options:rotateOptions(l.hanzi,others.filter(x=>x.meaning!==l.meaning).slice((seed*3)%Math.max(1,others.length-5)).map(x=>x.hanzi),seed),explanation:`${l.hanzi} · ${l.pinyin} · ${l.meaning}`};
 if(mode==='word-meaning'){const w=l.words[1];return {mode,kind:'choice',prompt:`What does ${w.hanzi} mean?`,hanzi:w.hanzi,answer:w.english,options:rotateOptions(w.english,others.flatMap(x=>x.words.map(w=>w.english)).filter(x=>x!==w.english),seed),explanation:`${w.hanzi} (${w.pinyin}) means ${w.english}.`};}
 if(mode==='word-pinyin'){const w=l.words[1];return {mode,kind:'pinyin',prompt:`Type the pinyin for ${w.hanzi}, including tones.`,hanzi:w.hanzi,answer:w.pinyin,explanation:`${w.hanzi} · ${w.pinyin} · ${w.english}`};}
 if(mode==='word-build'){const w=l.words.find(w=>[...w.hanzi.replace(/\s/g,'')].length>=2)||l.words[0];const chunks=[...w.hanzi.replace(/\s/g,'')];return {mode,kind:'ordering',prompt:`Arrange the characters to express “${w.english}”.`,answer:chunks.join(''),chunks,explanation:`${w.hanzi} · ${w.pinyin} · ${w.english}`};}
 if(mode==='sentence-cloze'){const w=l.words.find(w=>l.sentence.hanzi.includes(w.hanzi.replace(/\s/g,'')));const target=w?.hanzi.replace(/\s/g,'')||l.hanzi;const index=l.sentence.hanzi.indexOf(target);if(index<0)return null;const distractors=others.flatMap(x=>x.words.map(w=>w.hanzi.replace(/\s/g,''))).filter(x=>x!==target);return {mode,kind:'choice',prompt:'Choose the missing Chinese word or character.',hanzi:l.sentence.hanzi.slice(0,index)+'＿＿'+l.sentence.hanzi.slice(index+target.length),answer:target,options:rotateOptions(target,distractors,seed+2),explanation:`${l.sentence.hanzi} — ${l.sentence.english}`};}
 const reading=l.pinyin;const distractors=unique(others.map(x=>x.pinyin).filter(x=>x!==reading));return {mode,kind:'choice',prompt:`Select the correct pinyin for ${l.hanzi}.`,hanzi:l.hanzi,answer:reading,options:rotateOptions(reading,distractors,seed+1),explanation:`${l.hanzi} · ${reading} · ${l.meaning}`};
}
export function gradeDrill(drill,response,orderIndices=[]){if(!drill)return {correct:false,reason:'missing',message:'Exercise unavailable'};
 if(drill.kind==='ordering'){const correct=orderIndices.length===drill.chunks.length&&orderIndices.every((x,i)=>x===i);return {correct,reason:correct?'correct':'word-order',message:correct?'Correct character order.':'Review the target word’s character order.'};}
 if(drill.kind==='pinyin'){const result=toneExplanation(response,drill.answer);return {...result,message:result.detail||result.message};}
 return evaluateAnswer(response,drill.answer,drill.kind);
}
export function validateDrills(){for(const l of DEMO_LESSONS)for(const m of DRILL_MODES){const d=buildDrill(l.id,m);if(!d)throw Error(`Missing drill: ${l.id}/${m}`);if(d.kind==='choice'&&(d.options.length!==4||new Set(d.options).size!==4||!d.options.includes(d.answer)))throw Error(`Invalid distractors ${l.id}/${m}`);if(d.kind==='ordering'&&d.chunks.join('')!==d.answer)throw Error('Bad word build');}return true;}
