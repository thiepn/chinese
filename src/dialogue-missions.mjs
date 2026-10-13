/** Three-stage dialogue comprehension: meaning, text evidence, tone-accurate reading. */
import {DIALOGUES,findDialogue} from './dialogues.mjs';
import {toneExplanation} from './tone-coach.mjs';
// Curated line indexes supporting the first comprehension question in each dialogue.
const evidence=[1,1,1,0,0,1,1,1,0,1];
export const MISSION_STAGES=Object.freeze(['meaning','evidence','pinyin']);
export function missionQuestion(dialogueId,step){const d=findDialogue(dialogueId);if(!d||!Number.isInteger(step)||step<0||step>2)return null;
 if(step===0){const q=d.questions[0];return {kind:'choice',prompt:q.prompt,options:q.options,answer:q.answer,explanation:'Use the exchange to infer the speaker’s meaning.'};}
 if(step===1){const target=d.lines[d.p34?.evidenceIndex??d.p33?.evidenceIndex??evidence[DIALOGUES.indexOf(d)]??1];return {kind:'choice',prompt:'Which Chinese speaking turn supplies the best evidence for the first answer?',options:d.lines.map(l=>l.hanzi),answer:target.hanzi,explanation:`Speaker ${target.speaker} provides the supporting statement.`};}
 const target=d.lines[1];return {kind:'pinyin',prompt:'Type the complete pinyin of Speaker B’s line, with tones.',hanzi:target.hanzi,answer:target.pinyin,explanation:'Check the individual syllables and lexical tones in the line.'};
}
export function gradeMission(q,input){if(!q||typeof input!=='string')throw Error('Invalid mission answer');return q.kind==='pinyin'?toneExplanation(input,q.answer):{correct:q.answer===input,reason:q.answer===input?'correct':'meaning',message:q.answer===input?'Correct evidence.':'Compare the answer with the conversation.'};}
export function validateMissionEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid mission history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||!findDialogue(e.dialogueId)||!MISSION_STAGES.includes(e.stage)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid mission event');seen.add(e.id);}return true;}
export function addMissionEvent(state,{id,dialogueId,step,correct,assisted=false,at=Date.now()}){const next=structuredClone(state);next.missionEvents??=[];if(next.missionEvents.some(e=>e.id===id))return next;next.missionEvents.push({id,dialogueId,stage:MISSION_STAGES[step],correct,assisted,at});validateMissionEvents(next.missionEvents);return next;}
export function missionStats(state){const all=state.missionEvents||[];return {attempts:all.length,independent:all.filter(e=>e.correct&&!e.assisted).length,conversations:new Set(all.map(e=>e.dialogueId)).size};}
