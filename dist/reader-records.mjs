/** Reading practice is supplementary evidence, not official certification or scheduler mastery. */
import { findStory } from './stories.mjs';
export const READING_MODES=Object.freeze(['comprehension','cloze','ordering','pronunciation','line-meaning','line-order','evidence','connection']);
export function validateReadingEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>50000)throw new Error('Invalid reading practice history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||e.id.length>100||seen.has(e.id)||!findStory(e.storyId)||!READING_MODES.includes(e.mode)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw new Error('Invalid reading practice event');seen.add(e.id);}return true;}
export function addReadingEvent(state,storyId,mode,correct,assisted,id,at=Date.now()){
 if(!findStory(storyId)||!READING_MODES.includes(mode)||typeof correct!=='boolean'||typeof assisted!=='boolean'||!id||typeof id!=='string'||id.length>100)throw new Error('Invalid reading practice attempt');
 const next=structuredClone(state);next.readingEvents??=[];
 if(next.readingEvents.some(e=>e.id===id))return next;
 next.readingEvents.push({id,storyId,mode,correct,assisted,at});validateReadingEvents(next.readingEvents);next.updatedAt=new Date(at).toISOString();return next;
}
export function storySummary(state){const ev=state.readingEvents||[];const correct=ev.filter(e=>e.correct&&!e.assisted);return {attempts:ev.length,independentCorrect:correct.length,storiesAttempted:new Set(ev.map(e=>e.storyId)).size,storiesRead:new Set(correct.map(e=>e.storyId)).size};}
