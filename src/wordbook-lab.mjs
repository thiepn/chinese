/** P23 vocabulary-first lessons using the existing Wordbook answer/event writer.
 * Vocabulary introduction and journey steps are separate from scheduled SRS
 * and never imply HSK completion or character mastery.
 */
import {WORDS,findWord} from './lexicon.mjs';
import {evaluateAnswer,evaluateMeaning} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
const comparable=w=>w.senses[0]||'';
export const VOCABULARY_STEPS=Object.freeze(['meaning','context','pinyin','typed','listening']);
export const WORD_PRACTICE_MODES=Object.freeze(['meaning','pinyin','typed','context','listening']);
const isKey=k=>typeof k==='string'&&!!findWord(k);
const safeEventId=id=>typeof id==='string'&&id.length>0&&id.length<=100;
const validTime=at=>Number.isFinite(at)&&at>=0;
export function validateVocabularyLearning(state){
 if(state.vocabularyIntroduced!==undefined&&(!Array.isArray(state.vocabularyIntroduced)||state.vocabularyIntroduced.length>3000||new Set(state.vocabularyIntroduced).size!==state.vocabularyIntroduced.length||state.vocabularyIntroduced.some(key=>!isKey(key))))throw Error('Invalid vocabulary learning list');
 const journey=state.vocabularyJourney;
 if(journey!==undefined&&journey!==null&&(!journey||!isKey(journey.key)||!Number.isInteger(journey.step)||journey.step<0||journey.step>=VOCABULARY_STEPS.length))throw Error('Invalid vocabulary journey');
 return true;
}
export function introduceVocabulary(state,key){
 if(!isKey(key))throw Error('Unavailable original vocabulary');
 const next=structuredClone(state);next.vocabularyIntroduced??=[];
 if(!next.vocabularyIntroduced.includes(key))next.vocabularyIntroduced.push(key);
 return next;
}
export function beginVocabularyJourney(state,key){
 if(!isKey(key))throw Error('Unavailable original vocabulary');
 const next=introduceVocabulary(state,key);
 next.vocabularyJourney={key,step:0};return next;
}
export function advanceVocabularyJourney(state){
 const current=state.vocabularyJourney;
 if(!current)throw Error('No current vocabulary journey');
 const next=structuredClone(state);
 next.vocabularyJourney=current.step+1>=VOCABULARY_STEPS.length?null:{...current,step:current.step+1};
 return next;
}
export function endVocabularyJourney(state){
 const next=structuredClone(state);next.vocabularyJourney=null;return next;
}
export function vocabularyProgress(state,key){
 const events=(state.wordPracticeEvents||[]).filter(event=>event.key===key);
 const modes=WORD_PRACTICE_MODES.map(mode=>{
  const selected=events.filter(event=>event.mode===mode);
  return {mode,attempts:selected.length,independent:selected.filter(event=>event.correct&&!event.assisted).length,last:selected.at(-1)||null};
 });
 return {introduced:(state.vocabularyIntroduced||[]).includes(key),bookmarked:(state.bookmarkedWords||[]).includes(key),attempts:events.length,modes};
}
export function wordbookSequence(state,focus='all'){
 const saved=(state.bookmarkedWords||[]).filter(isKey);
 const introduced=(state.vocabularyIntroduced||[]).filter(isKey);
 const keys=focus==='catalog'?WORDS.map(w=>w.key):focus==='learning'?introduced:saved;
 if(['catalog','learning','all'].includes(focus))return keys;
 if(focus==='missed')return keys.filter(key=>{const last=(state.wordPracticeEvents||[]).filter(e=>e.key===key).at(-1);return last&&(!last.correct||last.assisted);});
 if(focus==='unpracticed')return keys.filter(key=>!(state.wordPracticeEvents||[]).some(e=>e.key===key));
 return keys;
}
function optionsFor(word,count=4){
 const alternatives=WORDS.filter(item=>item.key!==word.key&&!word.senses.some(s=>item.senses.includes(s))).map(comparable);
 const seed=[...word.key].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,17);
 const pool=[...new Set(alternatives)].filter(Boolean);
 const offset=seed%Math.max(1,pool.length);
 const options=[comparable(word),...[...pool.slice(offset),...pool.slice(0,offset)].slice(0,count-1)];
 const shift=seed%options.length;
 return [...options.slice(shift),...options.slice(0,shift)];
}
export function wordbookQuestion(state,index=0,mode='meaning',focus='all',fixedKey=null){
 if(!WORD_PRACTICE_MODES.includes(mode))return null;
 const keys=fixedKey&&isKey(fixedKey)?[fixedKey]:wordbookSequence(state,focus);
 if(!keys.length)return null;
 const word=findWord(keys[((index%keys.length)+keys.length)%keys.length]);
 if(!word)return null;
 const example=word.examples[0]||null;
 const base={key:word.key,mode,hanzi:word.hanzi,pinyin:word.pinyin,senses:word.senses,notes:word.notes,examples:word.examples,collocations:word.collocations,example};
 if(mode==='pinyin')return {...base,kind:'pinyin',prompt:'Write the complete pronunciation, including tones.',answer:word.pinyin};
 if(mode==='typed')return {...base,kind:'typed',prompt:'Recall the English meaning without answer choices.',answer:comparable(word)};
 if(mode==='listening')return {...base,kind:'choice',prompt:'Listen to the word, then choose its English meaning.',answer:comparable(word),options:optionsFor(word)};
 if(mode==='context')return {...base,kind:'choice',prompt:example?'What does the highlighted word mean in this sentence?':'Choose the meaning of this word.',answer:comparable(word),options:optionsFor(word)};
 return {...base,kind:'choice',prompt:'Choose the meaning of the complete word.',answer:comparable(word),options:optionsFor(word)};
}
export function gradeWordbookQuestion(q,response){
 if(!q||typeof response!=='string')throw Error('Invalid vocabulary answer');
 if(q.kind==='pinyin')return toneExplanation(response,q.answer);
 if(q.kind==='typed')return evaluateMeaning(response,(q.senses||[q.answer]).join('; '));
 return evaluateAnswer(response,q.answer,'choice');
}
export function validateWordPracticeEvents(events){
 if(events===undefined)return true;
 if(!Array.isArray(events)||events.length>30000)throw Error('Invalid vocabulary practice history');
 const seen=new Set();
 for(const e of events)if(!e||!safeEventId(e.id)||seen.has(e.id)||!isKey(e.key)||!WORD_PRACTICE_MODES.includes(e.mode)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!validTime(e.at))throw Error('Invalid vocabulary practice event');
 else seen.add(e.id);
 return true;
}
export function addWordPracticeEvent(state,{id,key,mode,correct,assisted=false,at=Date.now()}){
 if(!isKey(key)||!WORD_PRACTICE_MODES.includes(mode)||typeof correct!=='boolean'||typeof assisted!=='boolean'||!safeEventId(id)||!validTime(at))throw Error('Invalid vocabulary answer');
 const next=structuredClone(state);next.wordPracticeEvents??=[];
 if(next.wordPracticeEvents.some(event=>event.id===id))return next;
 next.wordPracticeEvents.push({id,key,mode,correct,assisted,at});
 return next;
}
export function wordbookStats(state){
 const events=state.wordPracticeEvents||[];
 return {saved:(state.bookmarkedWords||[]).length,introduced:(state.vocabularyIntroduced||[]).length,
 attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,
 weak:[...new Set(events.filter(e=>!e.correct||e.assisted).map(e=>e.key))].filter(key=>{const last=events.filter(e=>e.key===key).at(-1);return last&&!last.correct;})};
}
