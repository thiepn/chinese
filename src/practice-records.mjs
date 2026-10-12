/** Supplemental assessment records, intentionally excluded from scheduled-review mastery. */
import {findLesson} from './demo-lessons.mjs';
import {DRILL_MODES} from './drills.mjs';
import {findStory} from './stories.mjs';
import {findWord} from './lexicon.mjs';
export function validatePracticeExtensions(state){
 if(state.drillEvents!==undefined){if(!Array.isArray(state.drillEvents)||state.drillEvents.length>50000)throw Error('Invalid drill history');const seen=new Set();for(const e of state.drillEvents){if(!e||typeof e.id!=='string'||e.id.length>100||seen.has(e.id)||!findLesson(e.lessonId)||!DRILL_MODES.includes(e.mode)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid drill record');seen.add(e.id)}}
 if(state.bookmarkedWords!==undefined&&(!Array.isArray(state.bookmarkedWords)||state.bookmarkedWords.length>500||new Set(state.bookmarkedWords).size!==state.bookmarkedWords.length||state.bookmarkedWords.some(key=>!findWord(key))))throw Error('Invalid saved vocabulary');
 if(state.bookmarkedStories!==undefined&&(!Array.isArray(state.bookmarkedStories)||new Set(state.bookmarkedStories).size!==state.bookmarkedStories.length||state.bookmarkedStories.some(id=>!findStory(id))))throw Error('Invalid reading bookmarks');
 if(state.settings.readingLarge!==undefined&&typeof state.settings.readingLarge!=='boolean')throw Error('Invalid reading size');return true;
}
export function addDrillRecord(state,lessonId,mode,correct,assisted,id,at=Date.now()){
 if(!findLesson(lessonId)||!DRILL_MODES.includes(mode)||typeof correct!=='boolean'||typeof assisted!=='boolean'||typeof id!=='string'||!id||id.length>100||!Number.isFinite(at)||at<0)throw Error('Invalid drill result');
 const next=structuredClone(state);next.drillEvents??=[];if(next.drillEvents.some(e=>e.id===id))return next;
 next.drillEvents.push({id,lessonId,mode,correct,assisted,at});validatePracticeExtensions(next);next.updatedAt=new Date(at).toISOString();return next;
}
export function toggleStoryBookmark(state,id){if(!findStory(id))throw Error('Unavailable demo reading');const next=structuredClone(state);const list=next.bookmarkedStories??[];next.bookmarkedStories=list.includes(id)?list.filter(x=>x!==id):[...list,id];return next;}
export function practiceSummary(state){const ev=state.drillEvents||[];return {attempts:ev.length,independentCorrect:ev.filter(e=>e.correct&&!e.assisted).length,distinctLessons:new Set(ev.map(e=>e.lessonId)).size,bookmarked:(state.bookmarkedStories||[]).length};}

export function toggleWordBookmark(state,key){if(!findWord(key))throw Error('Unavailable demonstration vocabulary');const next=structuredClone(state);const words=next.bookmarkedWords||[];next.bookmarkedWords=words.includes(key)?words.filter(item=>item!==key):[...words,key];return next;}
export function bookmarkedVocabulary(state){return (state.bookmarkedWords||[]).map(findWord).filter(Boolean);}
