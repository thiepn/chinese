/** Original demonstration drills. Never score these as official HSK attainment or scheduled-review mastery. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {evaluateAnswer,parsePinyin} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {toneName,isolatedReadingUnsafe} from './spoken-readings.mjs';
import {PHONETIC_FAMILIES,familyOf} from './phonetic-families.mjs';
import {MEANING_RADICALS} from './meaning-radicals.mjs';
export const DRILL_MODES=Object.freeze(['recognition','word-meaning','word-pinyin','word-build','sentence-cloze','reading-choice','listen-meaning','listen-pinyin','tone-ear','sound-family','radical-clue']);
const TONE_NAMES=Object.freeze({1:'First tone',2:'Second tone',3:'Third tone',4:'Fourth tone',5:'Neutral tone'});
function unique(a){return [...new Set(a)];}
function rotateOptions(answer, distractors,seed){const options=unique([answer,...distractors.filter(x=>x!==answer)]).slice(0,4);const shift=seed%options.length;return [...options.slice(shift),...options.slice(0,shift)];}
// Listening-first drills: the prompt never shows the hanzi or pinyin; the
// device voice plays the lesson character and the learner maps sound to
// meaning, spelling or tone. Supplemental like every other drill.
// Sound-family drill: characters sharing a phonetic component hint at a
// shared pronunciation. The exercise asks for a sibling of the family, never
// promising exact readings — tones and initials drift.
// Radical-clue drill: meaning components as honest hints (never guarantees).
function radicalClueDrill(l,seed){
 const pick=MEANING_RADICALS[seed%MEANING_RADICALS.length];
 const pool=[];for(const r of MEANING_RADICALS){if(r===pick||r.name===pick.name||pool.some(x=>x.name===r.name))continue;pool.push(r);}
 const explain=pick.glyph+' ('+pick.name+') hints at '+pick.meaning+': '+pick.examples.join(', ')+'. Hints, not guarantees.';
 if(seed%2===0)return {mode:'radical-clue',kind:'choice',prompt:'Which meaning does the component '+pick.glyph+' hint at?',answer:pick.meaning,options:rotateOptions(pick.meaning,pool.map(r=>r.meaning),seed+6),explanation:explain};
 return {mode:'radical-clue',kind:'choice',prompt:'Which component hints at \u201c'+pick.meaning+'\u201d?',answer:pick.glyph,options:rotateOptions(pick.glyph,pool.map(r=>r.glyph),seed+6),explanation:explain};
}
function soundFamilyDrill(l,seed){
 const own=familyOf(l.hanzi);
 const family=own||PHONETIC_FAMILIES[seed%PHONETIC_FAMILIES.length];
 const candidates=family.members.filter(m=>m.hanzi!==l.hanzi);
 const answer=candidates[seed%candidates.length];
 const others=[];
 for(const f of PHONETIC_FAMILIES){if(f===family)continue;const pick=f.members[(seed+others.length)%f.members.length];if(pick&&pick.hanzi!==answer.hanzi)others.push(pick.hanzi);}
 return {mode:'sound-family',kind:'choice',prompt:`Which character belongs to the same sound family as ${own?l.hanzi:family.anchor}?`,answer:answer.hanzi,options:rotateOptions(answer.hanzi,others,seed+5),explanation:`${family.note} ${family.members.map(m=>`${m.hanzi} ${m.pinyin} ${m.gloss}`).join('; ')}.`};
}
function spokenContext(l){
 const parsed=parsePinyin(l.pinyin);const taught=parsed&&parsed.length===1?parsed[0]:null;
 const tone=taught?taught.tone:5;
 if(!isolatedReadingUnsafe(l.hanzi,tone)||!taught)return {speak:l.hanzi,syllableIndex:0,word:null,tone};
 for(const w of l.words){
  const wp=parsePinyin(w.pinyin);if(!wp)continue;
  const idx=wp.findIndex(s=>s.syllable===taught.syllable&&s.tone===tone);
  if(idx>=0)return {speak:w.hanzi,syllableIndex:idx,word:w,tone};
 }
 return {speak:l.hanzi,syllableIndex:0,word:null,tone};
}
function listeningDrill(l,mode,seed){const others=DEMO_LESSONS.filter(x=>x.id!==l.id);const ctx=spokenContext(l);
 if(mode==='listen-meaning'){
  if(ctx.word)return {mode,kind:'choice',listen:true,speak:ctx.word.hanzi,prompt:'Listen and choose the meaning of the word you hear.',answer:ctx.word.english,options:rotateOptions(ctx.word.english,others.flatMap(x=>x.words.map(w=>w.english)).filter(x=>x!==ctx.word.english),seed+3),explanation:`${ctx.word.hanzi} · ${ctx.word.pinyin} · ${ctx.word.english} (context for ${l.hanzi} · ${l.pinyin})`};
  return {mode,kind:'choice',listen:true,speak:l.hanzi,prompt:'Listen and choose the meaning of what you hear.',answer:l.meaning,options:rotateOptions(l.meaning,others.filter(x=>x.meaning!==l.meaning).map(x=>x.meaning),seed+3),explanation:`${l.hanzi} · ${l.pinyin} · ${l.meaning}`};
 }
 if(mode==='listen-pinyin'){
  if(ctx.word)return {mode,kind:'pinyin',listen:true,speak:ctx.word.hanzi,prompt:'Listen and type the complete pinyin of the word you hear, with tones.',answer:ctx.word.pinyin,explanation:`${ctx.word.hanzi} · ${ctx.word.pinyin} · ${ctx.word.english} (context for ${l.hanzi} · ${l.pinyin})`};
  return {mode,kind:'pinyin',listen:true,speak:l.hanzi,prompt:'Listen and type the complete pinyin of what you hear, with tones.',answer:l.pinyin,explanation:`${l.hanzi} · ${l.pinyin} · ${l.meaning}`};
 }
 const name=toneName(ctx.tone);
 const ordinal=['first','second','third','fourth','fifth'][ctx.syllableIndex]||'first';
 return {mode,kind:'choice',listen:true,speak:ctx.speak,spokenPinyin:ctx.word?ctx.word.pinyin:l.pinyin,toneIndex:ctx.syllableIndex,prompt:`Listen and choose the tone of the ${ordinal} syllable you hear.`,answer:name,options:rotateOptions(name,Object.values(TONE_NAMES).filter(n=>n!==name),seed+4),explanation:`${l.hanzi} is read ${l.pinyin} · ${name.toLowerCase()}${ctx.word?`, heard in ${ctx.word.hanzi} (${ctx.word.pinyin})`:''}.`};
}export function buildDrill(lessonId,mode){const l=findLesson(lessonId);if(!l||!DRILL_MODES.includes(mode))return null;
 const others=DEMO_LESSONS.filter(x=>x.id!==lessonId);const seed=l.order;
 if(mode==='radical-clue')return radicalClueDrill(l,seed);
 if(mode==='sound-family')return soundFamilyDrill(l,seed);
 if(['listen-meaning','listen-pinyin','tone-ear'].includes(mode))return listeningDrill(l,mode,seed);
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
