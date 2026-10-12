/** Batch 20: read-only, evidence-based course overview and continuity diagnostics.
 * No mutation, no simulated proficiency, and no scheduled-review grades.
 */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {dueCards} from './study.mjs';
import {activeLearningSessions} from './learning-hub.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';

const EVENTS=[['Scheduled reviews','events'],['Guided journeys','courseEvents'],['Corrections','courseRepairEvents'],['Sentence ladders','ladderEvents'],['Study blocks','studyBlockEvents'],['Readings','readingEvents'],['Dialogues','dialogueEvents'],['Fluency practice','fluencyEvents'],['Wordbook','wordPracticeEvents'],['Word senses','senseEvents'],['Sentence writing','sentenceEvents'],['Context trails','blockTrailEvents']];
function length(value){return Array.isArray(value)?value.length:0;}

/** Careful about claims: an event is an observation, not a learned skill or calibrated mastery. */
export function courseOverview(state,{now=Date.now()}={}){
 const learned=Array.isArray(state.learned)?state.learned:[];
 const sessions=activeLearningSessions(state);
 const kinds=EVENTS.map(([label,key])=>({label,key,count:length(state[key])}));
 const lastIntroduced=Array.isArray(state.introductions)?[...state.introductions].sort((a,b)=>b.at-a.at)[0]:null;
 const lastLesson=lastIntroduced?findLesson(lastIntroduced.id):null;
 const nextLesson=DEMO_LESSONS.find(l=>!learned.includes(l.id))||null;
 const reviews=Array.isArray(state.events)?state.events:[];
 const independent=reviews.filter(e=>e.correct===true&&e.assisted!==true).length;
 const assisted=reviews.filter(e=>e.assisted===true).length;
 const due=dueCards(state,now).length;
 return {introduced:learned.length,total:DEMO_LESSONS.length,remaining:DEMO_LESSONS.length-learned.length,
  lastLesson,nextLesson,due,sessions,types:kinds,
  scheduled:{attempts:reviews.length,independent,assisted},
  supplementary:kinds.filter(k=>k.key!=='events').reduce((n,k)=>n+k.count,0),
  savedWords:length(state.bookmarkedWords),savedReadings:length(state.bookmarkedStories),
  library:{readings:STORIES.length,dialogues:DIALOGUES.length},
  dataRevision:state.revision,lastSaved:state.updatedAt||null,
  notices:['Introduced is not mastered.','Activity and assisted responses are not independent recall.','Local browser storage can be cleared: keep an exported backup.']};
}

/** Stable shortcut suggestions derived from actual learning state. */
export function courseShortcuts(state,opts={}){
 const overview=courseOverview(state,opts);
 const result=[];
 if(overview.sessions.length){const s=overview.sessions[0];result.push({kind:'resume',label:`Resume ${s.label}`,description:s.detail,route:s.route,source:s.kind});}
 if(overview.due)result.push({kind:'review',label:`Review ${overview.due} due prompts`,description:'Only graded recall updates the scheduling history.',route:'review'});
 if(overview.nextLesson)result.push({kind:'lesson',label:`Continue with ${overview.nextLesson.hanzi}`,description:`Lesson ${overview.nextLesson.order}: ${overview.nextLesson.meaning}`,route:'learn',lessonId:overview.nextLesson.id});
 if(overview.savedWords)result.push({kind:'wordbook',label:`Practice ${overview.savedWords} saved words`,description:'Supplemental practice; does not change review mastery.',route:'wordbook'});
 result.push({kind:'plan',label:'Review your 7-day plan',description:'Personalized daily workload and corrections.',route:'plan'});
 return result.slice(0,4);
}

export function recoverySnapshot(state){
 const overview=courseOverview(state);
 return {version:state.version,revision:state.revision,learned:overview.introduced,
  scheduledEvents:overview.scheduled.attempts,supplementaryEvents:overview.supplementary,
  sessions:overview.sessions.map(s=>({kind:s.kind,label:s.label,detail:s.detail,route:s.route})),
  wordbook:overview.savedWords,bookmarks:overview.savedReadings,
  generatedAt:new Date().toISOString()};
}
