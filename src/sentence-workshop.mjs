/** Exact-form written sentence reconstruction: no open-ended translation judging. */
import {STORIES,findStory} from './stories.mjs';
import {GRAMMAR_PRACTICE_TASKS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY_TASKS} from './sentence-library.mjs';
import {READING_WRITING_TASKS} from './reading-depth.mjs';
import {BEGINNER_READING_WRITING_TASKS} from './beginner-reading.mjs';
import {PATHWAY_TASKS} from './pathway-course.mjs';
import {WORKSPACE_COACHING} from './workspace-coaching-p30.mjs';
import {P31_WRITING_TASKS} from './p31-foundations.mjs';
import {P32_CORRECTION_TASKS} from './p32-learning.mjs';
import {P33_WRITING_TASKS} from './p33-scenarios.mjs';
import {P34_LISTENING_WRITING_TASKS} from './p34-course.mjs';
import {P35_WRITING_TASKS} from './p35-foundations.mjs';
import {P39_WRITING_TASKS} from './p39-foundations.mjs';
import {P36_CORRECTION_TASKS} from './p36-course.mjs';
import {P40_CORRECTION_TASKS} from './p40-course.mjs';
import {P37_WRITING_TASKS} from './p37-scenarios.mjs';
import {P42_WRITING_TASKS} from './p42-course.mjs';
import {P43_WRITING_TASKS} from './p43-course.mjs';
import {P44_WRITING_TASKS} from './p44-course.mjs';
import {P45_WRITING_TASKS} from './p45-course.mjs';
import {P46_WRITING_TASKS} from './p46-foundations.mjs';
import {P46_DIALOGUE_WRITING_TASKS} from './p46-dialogues.mjs';
import {P47_CHARACTER_WRITING_TASKS} from './p47-foundations.mjs';
import {P47_DIALOGUE_WRITING_TASKS} from './p47-dialogues.mjs';
import {P47_PRODUCTION_TASKS} from './p47-production.mjs';
import {P48_ARGUMENT_TASKS} from './p48-arguments.mjs';
import {P48_DIALOGUE_WRITING_TASKS} from './p48-dialogues.mjs';
import {P49_WRITING_TASKS} from './p49-course.mjs';
import {P50_CHARACTER_TASKS} from './p50-foundations.mjs';
import {P50_ARGUMENT_TASKS} from './p50-arguments.mjs';
import {P50_DIALOGUE_WRITING} from './p50-dialogues.mjs';
import {P51_CHARACTER_TASKS} from './p51-foundations.mjs';
import {P51_ARGUMENT_TASKS} from './p51-arguments.mjs';
import {P51_DIALOGUE_WRITING} from './p51-dialogues.mjs';
import {P52_WRITING_TASKS} from './p52-course.mjs';
import {P53_WRITING_TASKS} from './p53-course.mjs';
import {P53_TRANSFER_TASKS} from './p53-transfer.mjs';
export const WORKSPACE_COACHING_TASKS=Object.freeze(WORKSPACE_COACHING.map(note=>Object.freeze({id:'p30-coach:'+note.id,kind:'coaching-production',coachingId:note.id,hanzi:note.hanzi,pinyin:note.pinyin,english:note.english,explanation:note.explanation})));
export const SENTENCE_TASKS=Object.freeze([...STORIES.flatMap(story=>story.lines.slice(0,2).map((line,i)=>Object.freeze({id:`${story.id}:line${i}`,storyId:story.id,index:i,english:line.english,hanzi:line.hanzi,pinyin:line.pinyin}))),...GRAMMAR_PRACTICE_TASKS,...SENTENCE_LIBRARY_TASKS,...READING_WRITING_TASKS,...BEGINNER_READING_WRITING_TASKS,...PATHWAY_TASKS,...WORKSPACE_COACHING_TASKS,...P31_WRITING_TASKS,...P32_CORRECTION_TASKS,...P33_WRITING_TASKS,...P34_LISTENING_WRITING_TASKS,...P35_WRITING_TASKS,...P36_CORRECTION_TASKS,...P37_WRITING_TASKS,...P39_WRITING_TASKS,...P40_CORRECTION_TASKS,...P42_WRITING_TASKS,...P43_WRITING_TASKS,...P44_WRITING_TASKS,...P45_WRITING_TASKS,...P46_WRITING_TASKS,...P46_DIALOGUE_WRITING_TASKS,...P47_CHARACTER_WRITING_TASKS,...P47_DIALOGUE_WRITING_TASKS,...P47_PRODUCTION_TASKS,...P48_ARGUMENT_TASKS,...P48_DIALOGUE_WRITING_TASKS,...P49_WRITING_TASKS,...P50_CHARACTER_TASKS,...P50_ARGUMENT_TASKS,...P50_DIALOGUE_WRITING,...P51_CHARACTER_TASKS,...P51_ARGUMENT_TASKS,...P51_DIALOGUE_WRITING,...P52_WRITING_TASKS,...P53_WRITING_TASKS,...P53_TRANSFER_TASKS]);
const SENTENCE_TASK_IDS=new Set(SENTENCE_TASKS.map(t=>t.id));
export function sentenceTask(index=0){return SENTENCE_TASKS[((index%SENTENCE_TASKS.length)+SENTENCE_TASKS.length)%SENTENCE_TASKS.length];}
const comparable=s=>String(s).normalize('NFC').replace(/[\s\u3000。，！？.!?,;；、]/gu,'');
export function checkSentence(task,input){if(!task||!SENTENCE_TASK_IDS.has(task.id)||typeof input!=='string')throw Error('Invalid sentence task');const correct=comparable(input)===comparable(task.hanzi);return {correct,reason:correct?'correct':'exact-form',message:correct?'Exact written sentence accepted.':'Not the same Chinese sentence. This is an exact-reconstruction exercise: valid alternative translations are not automatically graded.',reference:task.hanzi};}
export function validateSentenceEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid sentence-workshop history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||!SENTENCE_TASK_IDS.has(e.taskId)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid sentence-workshop event');seen.add(e.id);}return true;}
export function addSentenceEvent(state,{id,taskId,correct,assisted=false,at=Date.now()}){const n=structuredClone(state);n.sentenceEvents??=[];if(n.sentenceEvents.some(e=>e.id===id))return n;n.sentenceEvents.push({id,taskId,correct,assisted,at});validateSentenceEvents(n.sentenceEvents);return n;}
export function sentenceStats(state){const events=state.sentenceEvents||[];return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,practiced:new Set(events.map(e=>e.taskId)).size};}
