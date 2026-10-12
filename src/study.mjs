/** Learning state and deterministic, explicitly uncalibrated demonstration scheduler. */
import { DEMO_LESSONS, DEMO_IDS, findLesson } from './demo-lessons.mjs';
import { validateReadingEvents } from './reader-records.mjs';
import { validatePracticeExtensions } from './practice-records.mjs';
import {validateGuidedSession} from './guided-session.mjs';
import {validatePlacement} from './placement.mjs';
import {validateDialogueEvents} from './dialogues.mjs';
import {validateWordPracticeEvents,validateVocabularyLearning} from './wordbook-lab.mjs';
import {validateSenseEvents} from './sense-lab.mjs';
import {validateSentenceEvents} from './sentence-workshop.mjs';
import {validateMissionEvents} from './dialogue-missions.mjs';
import {validateCourseExtensions} from './course-journey.mjs';
import {validateCourseContinuation} from './course-continuation.mjs';
import {validateLadderExtensions} from './sentence-ladder.mjs';
import {validateBlockExtensions} from './study-block.mjs';
import {validateTrail} from './context-trail.mjs';
import {validateFluency} from './fluency-studio.mjs';
import {validatePlanExtensions} from './daily-plan.mjs';
import {lessonGroups as sharedLessonGroups} from './study-groups.mjs';
export const STATE_VERSION=1;
const originalKinds=['meaning','reading','word0','word1','wordread0','sentence'];
export const DAY=86400000;
export function freshState(){return {version:STATE_VERSION,revision:0,learned:[],cards:{},events:[],readingEvents:[],drillEvents:[],bookmarkedStories:[],bookmarkedWords:[],dialogueEvents:[],wordPracticeEvents:[],vocabularyIntroduced:[],vocabularyJourney:null,senseEvents:[],sentenceEvents:[],missionEvents:[],practiceSession:null,courseJourney:null,courseEvents:[],courseRepairSession:null,courseRepairEvents:[],ladderSession:null,ladderEvents:[],studyBlock:null,studyBlockEvents:[],blockTrail:null,blockTrailEvents:[],fluencySession:null,fluencyEvents:[],fluencyCompletions:[],dailyPlan:{minutes:15,focus:'balanced'},mistakePins:[],placement:null,introductions:[],settings:{dailyNew:5,showPinyin:true,dark:false,readingLarge:false,hanziLarge:false},updatedAt:null};}
export function cardsForLesson(id){const lesson=findLesson(id);if(!lesson)return [];
 // Existing Batch 20 lessons retain their exact six card identities.
 const extended=lesson.order<=74?[]:[...lesson.words.slice(2).map((_,i)=>`word${i+2}`),...lesson.words.slice(1).map((_,i)=>`wordread${i+1}`)];
 return [...originalKinds,...extended].map(kind=>`${id}:${kind}`);}

export function cardInfo(id){const match=/^(demo-\d{2,3}):(meaning|reading|word[0-9]+|wordread[0-9]+|sentence)$/.exec(String(id));if(!match||!cardsForLesson(match[1]).includes(id))return null;
 const lesson=findLesson(match[1]);if(!lesson)return null;const type=match[2];
 if(type==='meaning')return {id,type,lesson,prompt:lesson.hanzi,question:'What does this character mean?',answer:lesson.meaning,kind:'meaning',reading:lesson.pinyin};
 if(type==='reading')return {id,type,lesson,prompt:lesson.hanzi,question:'Type the pinyin, including its tone.',answer:lesson.pinyin,kind:'pinyin',reading:null};
 if(type.startsWith('wordread')){const w=lesson.words[Number(type.slice(8))];return w?{id,type,lesson,prompt:w.hanzi,question:'Type the word’s complete pinyin.',answer:w.pinyin,kind:'pinyin',reading:null}:null;}
 if(type==='sentence')return {id,type,lesson,prompt:lesson.sentence.hanzi,question:'Choose the best English meaning of this sentence.',answer:lesson.sentence.english,kind:'choice',reading:null};
 const w=lesson.words[Number(type.slice(4))];return w?{id,type,lesson,prompt:w.hanzi,question:'What does this word mean?',answer:w.english,kind:'meaning',reading:w.pinyin}:null;}
export function validateState(input){if(!input||input.version!==STATE_VERSION||!Array.isArray(input.learned)||!input.learned.every(id=>DEMO_IDS.has(id))||new Set(input.learned).size!==input.learned.length||!input.cards||typeof input.cards!=='object'||Array.isArray(input.cards)||!Array.isArray(input.events)||input.events.length>100000)throw new Error('Invalid or incompatible learning history');
 validateReadingEvents(input.readingEvents);validatePracticeExtensions(input);validateGuidedSession(input.practiceSession);validatePlacement(input.placement);validateDialogueEvents(input.dialogueEvents);validateWordPracticeEvents(input.wordPracticeEvents);validateVocabularyLearning(input);validateSenseEvents(input.senseEvents);validateSentenceEvents(input.sentenceEvents);validateMissionEvents(input.missionEvents);validateCourseExtensions(input);validateCourseContinuation(input);validateLadderExtensions(input);validateBlockExtensions(input);validateTrail(input);validateFluency(input);validatePlanExtensions(input);
 if('introductions'in input&&(!Array.isArray(input.introductions)||input.introductions.length>10000||input.introductions.some(item=>!item||!DEMO_IDS.has(item.id)||!Number.isFinite(item.at)||!input.learned.includes(item.id))))throw new Error('Invalid introduction history');
 if(!input.settings||!Number.isInteger(input.settings.dailyNew)||input.settings.dailyNew<1||input.settings.dailyNew>30||typeof input.settings.showPinyin!=='boolean'||typeof input.settings.dark!=='boolean')throw new Error('Invalid settings');
 if('hanziLarge' in input.settings && typeof input.settings.hanziLarge!=='boolean')throw new Error('Invalid Hanzi text-size preference');
 if(!Number.isSafeInteger(input.revision)||input.revision<0)throw new Error('Invalid data revision');
 for(const [id,c] of Object.entries(input.cards)){if(!cardInfo(id)||!c||!Number.isFinite(c.due)||!Number.isFinite(c.interval)||c.interval<0||!Number.isInteger(c.repetitions)||c.repetitions<0||c.repetitions>100000||!input.learned.includes(id.split(':')[0]))throw new Error('Invalid review-card data');}
 const seen=new Set();for(const ev of input.events){if(!ev||typeof ev.id!=='string'||ev.id.length>100||seen.has(ev.id)||!cardInfo(ev.cardId)||!Number.isFinite(ev.at)||![0,1,2,3].includes(ev.grade)||('correct'in ev&&typeof ev.correct!=='boolean')||('assisted'in ev&&typeof ev.assisted!=='boolean'))throw new Error('Invalid review-history event');seen.add(ev.id);}return true;}
export function upgradedState(input,now=Date.now()){validateState(input);const result=structuredClone(input);let changed=false;
 for(const id of result.learned)for(const cid of cardsForLesson(id))if(!result.cards[cid]){result.cards[cid]={due:now,interval:0,repetitions:0,lastGrade:null};changed=true}
 return changed?result:null;}
export function addLesson(state,id,now=Date.now()){if(!findLesson(id))throw new Error('Only approved, original demo lessons are available');const next=structuredClone(state);if(!next.learned.includes(id)){next.learned.push(id);next.introductions??=[];next.introductions.push({id,at:now});}
 for(const cardId of cardsForLesson(id))if(!next.cards[cardId])next.cards[cardId]={due:now,interval:0,repetitions:0,lastGrade:null};next.updatedAt=new Date(now).toISOString();return next;}
export function gradeCard(state,id,grade,now=Date.now(),eventId,metadata={}){if(!cardInfo(id)||!state.cards[id])throw new Error('Review target unavailable');if(![0,1,2,3].includes(grade))throw new Error('Invalid review grade');if(!eventId||typeof eventId!=='string'||eventId.length>100)throw new Error('Missing review event identity');if(state.events.some(e=>e.id===eventId))return structuredClone(state);
 if(metadata.correct===false&&grade>0)throw new Error('Incorrect answers cannot receive passing credit');if(metadata.assisted===true&&grade>0)throw new Error('Revealed answers cannot receive independent credit');
 const next=structuredClone(state),c=next.cards[id],prev=Math.max(0,c.interval);
 const intervals=[2/1440,Math.max(1,prev*1.25),Math.max(3,prev*2.2),Math.max(7,prev*2.8)];const interval=intervals[grade];c.due=now+interval*DAY;c.interval=interval;c.repetitions=grade===0?0:c.repetitions+1;c.lastGrade=grade;
 const ev={id:eventId,cardId:id,grade,at:now,policy:'simple-demo-v2'};if(typeof metadata.correct==='boolean')ev.correct=metadata.correct;if(typeof metadata.assisted==='boolean')ev.assisted=metadata.assisted;if(typeof metadata.errorType==='string')ev.errorType=metadata.errorType.slice(0,32);
 next.events.push(ev);next.updatedAt=new Date(now).toISOString();return next;}
export function dueCards(state,now=Date.now()){return Object.entries(state.cards).filter(([id,c])=>cardInfo(id)&&c.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([id])=>id);}
export function nextLesson(state){return DEMO_LESSONS.find(x=>!state.learned.includes(x.id))||null;}
export function summary(state,now=Date.now()){const today=new Date(now).toDateString();const introducedToday=(state.introductions||[]).filter(item=>new Date(item.at).toDateString()===today).length;const successes=state.events.filter(e=>e.correct===true&&!e.assisted).length;return {learned:state.learned.length,total:DEMO_LESSONS.length,cards:Object.keys(state.cards).length,due:dueCards(state,now).length,attempts:state.events.length,successful:successes,introducedToday,dailyGoal:state.settings.dailyNew,next:nextLesson(state)};}
export function lessonGroups(){return sharedLessonGroups();}
