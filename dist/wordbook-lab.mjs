/** Independent wordbook retrieval, outside scheduled-review and HSK mastery. */
import {WORDS,findWord} from './lexicon.mjs';
import {evaluateAnswer} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
const comparable=(w)=>w.senses[0]||'';
export function wordbookSequence(state,focus='all'){
 const keys=(state.bookmarkedWords||[]).filter(key=>findWord(key));
 if(focus==='all')return keys;
 if(focus==='missed')return keys.filter(key=>{const last=(state.wordPracticeEvents||[]).filter(e=>e.key===key).at(-1);return last&&!last.correct;});
 if(focus==='unpracticed')return keys.filter(key=>!(state.wordPracticeEvents||[]).some(e=>e.key===key));
 return keys;
}
export function wordbookQuestion(state,index=0,mode='meaning',focus='all'){
 const keys=wordbookSequence(state,focus);if(!keys.length)return null;
 const word=findWord(keys[((index%keys.length)+keys.length)%keys.length]);if(!['meaning','pinyin'].includes(mode))return null;
 if(mode==='pinyin')return {key:word.key,kind:'pinyin',mode,hanzi:word.hanzi,prompt:'Type the pronunciation, including tones.',answer:word.pinyin};
 const wrong=WORDS.filter(w=>w.key!==word.key&&comparable(w)!==comparable(word)).map(w=>comparable(w)).filter(Boolean);
 const pool=[...new Set(wrong)];const offset=WORDS.findIndex(w=>w.key===word.key);const distractors=[...pool.slice(offset),...pool.slice(0,offset)].slice(0,3);
 return {key:word.key,kind:'choice',mode,hanzi:word.hanzi,prompt:'Choose the English meaning.',answer:comparable(word),options:[...distractors,comparable(word)].sort((a,b)=>a.localeCompare(b))};
}
export function gradeWordbookQuestion(q,response){if(!q||typeof response!=='string')throw Error('Invalid wordbook answer');return q.kind==='pinyin'?toneExplanation(response,q.answer):evaluateAnswer(response,q.answer,q.kind);}
export function validateWordPracticeEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid wordbook practice history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||!findWord(e.key)||!['meaning','pinyin'].includes(e.mode)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid word practice event');seen.add(e.id)}return true;}
export function addWordPracticeEvent(state,{id,key,mode,correct,assisted=false,at=Date.now()}){if(!findWord(key)||!['meaning','pinyin'].includes(mode)||typeof correct!=='boolean'||typeof assisted!=='boolean'||typeof id!=='string'||!id||id.length>100||!Number.isFinite(at)||at<0)throw Error('Invalid word practice result');const next=structuredClone(state);next.wordPracticeEvents??=[];if(next.wordPracticeEvents.some(e=>e.id===id))return next;next.wordPracticeEvents.push({id,key,mode,correct,assisted,at});validateWordPracticeEvents(next.wordPracticeEvents);return next;}
export function wordbookStats(state){const ev=state.wordPracticeEvents||[];return {saved:(state.bookmarkedWords||[]).length,attempts:ev.length,independent:ev.filter(e=>e.correct&&!e.assisted).length,weak:[...new Set(ev.filter(e=>!e.correct).map(e=>e.key))].filter(key=>(ev.filter(e=>e.key===key).at(-1)?.correct)===false)};}
