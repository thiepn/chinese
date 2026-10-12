/** Batch 16: optional, checkpointed reading→dialogue→pronunciation trail within a Study Block.
 * All observations remain supplementary; does not write scheduled reviews or mastery.
 */
import {findLesson} from './demo-lessons.mjs';
import {STORIES,findStory} from './stories.mjs';
import {DIALOGUES,findDialogue} from './dialogues.mjs';
import {crossLessonConnections} from './cross-lesson.mjs';
import {toneExplanation} from './tone-coach.mjs';
const validId=x=>typeof x==='string'&&x.length>0&&x.length<=100;
const validTime=x=>Number.isFinite(x)&&x>=0;
const validText=x=>typeof x==='string'&&x.length<=600;
const KINDS=['reading-evidence','dialogue-evidence','word-pronunciation'];
export const TRAIL_KINDS=Object.freeze(KINDS);

export function trailSources(state){
 const b=state.studyBlock;if(!b)return null;
 const matches=crossLessonConnections(b.lessonIds);
 const story=findStory(matches.readings[0]?.id)||STORIES[0];
 const dialogue=findDialogue(matches.dialogues[0]?.id)||DIALOGUES[0];
 const last=findLesson(b.lessonIds.at(-1));
 return {story,dialogue,word:last.words[1],lessonId:last.id,relatedStory:!!matches.readings.length,relatedDialogue:!!matches.dialogues.length};
}
function sourceCheck(trail,state){const s=trailSources(state);return !!s&&trail.storyId===s.story.id&&trail.dialogueId===s.dialogue.id&&trail.lessonId===s.lessonId&&[0,1].includes(trail.wordIndex);}
export function validateTrail(state){
 const t=state.blockTrail;
 if(t!==undefined&&t!==null){if(!state.studyBlock||!validId(t.blockId)||t.blockId!==state.studyBlock.id||!sourceCheck(t,state)||!Number.isInteger(t.cursor)||t.cursor<0||t.cursor>=3||typeof t.assisted!=='boolean'||(t.feedback!==null&&t.feedback!==undefined&&(!t.feedback||typeof t.feedback.correct!=='boolean'||typeof t.feedback.assisted!=='boolean'||!validText(t.feedback.message))))throw Error('Invalid contextual trail checkpoint');}
 if(state.blockTrailEvents!==undefined){
  if(!Array.isArray(state.blockTrailEvents)||state.blockTrailEvents.length>20000)throw Error('Invalid context trail event history');const seen=new Set();
  for(const e of state.blockTrailEvents){if(!e||!validId(e.id)||seen.has(e.id)||!validId(e.blockId)||!['answer','finished'].includes(e.type)||!validTime(e.at)||(e.type==='answer'&&(!KINDS.includes(e.kind)||!Number.isInteger(e.step)||e.step<0||e.step>=3||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'))){throw Error('Invalid context trail event');}seen.add(e.id);}
 }
 return true;
}
export function beginTrail(state){
 const s=trailSources(state);if(!s||state.blockTrail)throw Error('Cannot start a contextual trail');
 const n=structuredClone(state);n.blockTrail={blockId:state.studyBlock.id,storyId:s.story.id,dialogueId:s.dialogue.id,lessonId:s.lessonId,wordIndex:1,cursor:0,assisted:false,feedback:null};validateTrail(n);return n;
}
export function trailQuestion(state){
 const t=state.blockTrail;if(!t)return null;
 if(t.cursor===0){const story=findStory(t.storyId),index=story.lines.findIndex(line=>state.studyBlock.lessonIds.some(id=>findLesson(id).words.some(w=>line.hanzi.includes(w.hanzi))));const target=index>=0?index:1;
  return {kind:KINDS[0],source:story.title,context:story.lines.map(l=>l.hanzi),question:`Which Chinese sentence expresses: “${story.lines[target].english}”?`,answer:story.lines[target].hanzi,options:story.lines.map(l=>l.hanzi),help:story.lines[target].pinyin};}
 if(t.cursor===1){const dialogue=findDialogue(t.dialogueId),idx=dialogue.lines.findIndex(line=>state.studyBlock.lessonIds.some(id=>findLesson(id).words.some(w=>line.hanzi.includes(w.hanzi))));const target=idx>=0?idx:1;
  return {kind:KINDS[1],source:dialogue.title,context:dialogue.lines.map(l=>`${l.speaker}: ${l.hanzi}`),question:`Which spoken line means: “${dialogue.lines[target].english}”?`,answer:dialogue.lines[target].hanzi,options:dialogue.lines.map(l=>l.hanzi),help:dialogue.lines[target].pinyin};}
 const l=findLesson(t.lessonId),word=l.words[t.wordIndex];return {kind:KINDS[2],source:l.meaning,context:[l.sentence.hanzi],question:`Type the complete pinyin, with tones, for ${word.hanzi} as taught in this word.`,answer:word.pinyin,options:null,help:word.english};
}
export function trailHint(state){if(!state.blockTrail||state.blockTrail.feedback)throw Error('No unanswered trail stage');const n=structuredClone(state);n.blockTrail.assisted=true;return n;}
export function answerTrail(state,{id,response='',reveal=false,at=Date.now()}={}){
 const t=state.blockTrail,q=trailQuestion(state);if(!t||!q||t.feedback||!validId(id)||!validTime(at)||(!reveal&&!String(response).trim())||(state.blockTrailEvents||[]).some(e=>e.id===id))throw Error('Invalid trail answer');
 const result=reveal?{correct:false,detail:'Reference revealed; no independent credit.'}:q.options?{correct:response===q.answer,detail:response===q.answer?'Correct sentence in context.':'Compare the meaning with the full original exchange.'}:toneExplanation(response,q.answer);
 const n=structuredClone(state),assisted=t.assisted||!!reveal;
 n.blockTrailEvents??=[];n.blockTrailEvents.push({id,blockId:t.blockId,type:'answer',step:t.cursor,kind:q.kind,correct:!!result.correct,assisted,at});
 n.blockTrail.feedback={correct:!!result.correct,assisted,message:String(result.detail||result.message||'Use the complete context.').slice(0,600)};
 validateTrail(n);return n;
}
export function nextTrail(state,{id,at=Date.now()}={}){
 const t=state.blockTrail;if(!t?.feedback||!validId(id)||!validTime(at)||(state.blockTrailEvents||[]).some(e=>e.id===id))throw Error('Trail stage incomplete');
 const n=structuredClone(state);
 if(t.cursor===2){n.blockTrailEvents??=[];n.blockTrailEvents.push({id,blockId:t.blockId,type:'finished',at});n.blockTrail=null;}
 else n.blockTrail={...t,cursor:t.cursor+1,assisted:false,feedback:null};
 validateTrail(n);return n;
}
export function trailSummary(state){const ev=state.blockTrailEvents||[],answers=ev.filter(e=>e.type==='answer');return {completed:ev.filter(e=>e.type==='finished').length,attempts:answers.length,independent:answers.filter(e=>e.correct&&!e.assisted).length,assisted:answers.filter(e=>e.assisted).length,active:!!state.blockTrail};}
