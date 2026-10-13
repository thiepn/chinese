/** Exact-form written sentence reconstruction: no open-ended translation judging. */
import {STORIES,findStory} from './stories.mjs';
import {GRAMMAR_PRACTICE_TASKS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY_TASKS} from './sentence-library.mjs';
export const SENTENCE_TASKS=Object.freeze([...STORIES.flatMap(story=>story.lines.slice(0,2).map((line,i)=>Object.freeze({id:`${story.id}:line${i}`,storyId:story.id,index:i,english:line.english,hanzi:line.hanzi,pinyin:line.pinyin}))),...GRAMMAR_PRACTICE_TASKS,...SENTENCE_LIBRARY_TASKS]);
const SENTENCE_TASK_IDS=new Set(SENTENCE_TASKS.map(t=>t.id));
export function sentenceTask(index=0){return SENTENCE_TASKS[((index%SENTENCE_TASKS.length)+SENTENCE_TASKS.length)%SENTENCE_TASKS.length];}
const comparable=s=>String(s).normalize('NFC').replace(/[\s\u3000。，！？.!?,;；、]/gu,'');
export function checkSentence(task,input){if(!task||!SENTENCE_TASK_IDS.has(task.id)||typeof input!=='string')throw Error('Invalid sentence task');const correct=comparable(input)===comparable(task.hanzi);return {correct,reason:correct?'correct':'exact-form',message:correct?'Exact written sentence accepted.':'Not the same Chinese sentence. This is an exact-reconstruction exercise: valid alternative translations are not automatically graded.',reference:task.hanzi};}
export function validateSentenceEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid sentence-workshop history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||!SENTENCE_TASK_IDS.has(e.taskId)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid sentence-workshop event');seen.add(e.id);}return true;}
export function addSentenceEvent(state,{id,taskId,correct,assisted=false,at=Date.now()}){const n=structuredClone(state);n.sentenceEvents??=[];if(n.sentenceEvents.some(e=>e.id===id))return n;n.sentenceEvents.push({id,taskId,correct,assisted,at});validateSentenceEvents(n.sentenceEvents);return n;}
export function sentenceStats(state){const events=state.sentenceEvents||[];return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,practiced:new Set(events.map(e=>e.taskId)).size};}
