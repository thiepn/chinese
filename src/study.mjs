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
import {validateSentenceBookmarks} from './sentence-library.mjs';
import {validateMissionEvents} from './dialogue-missions.mjs';
import {validateCourseExtensions} from './course-journey.mjs';
import {validateCourseContinuation} from './course-continuation.mjs';
import {validateLadderExtensions} from './sentence-ladder.mjs';
import {validateBlockExtensions} from './study-block.mjs';
import {validateTrail} from './context-trail.mjs';
import {validateFluency} from './fluency-studio.mjs';
import {validatePlanExtensions} from './daily-plan.mjs';
import {validateProductionEvents} from './production-log.mjs';
import {lessonGroups as sharedLessonGroups} from './study-groups.mjs';
import {findWord} from './lexicon.mjs';
export const STATE_VERSION=1;
const originalKinds=['meaning','reading','word0','word1','wordread0','sentence'];
export const DAY=86400000;
// Review scheduler v3: legacy fixed multipliers scaled by per-card ease
// (default 2.5 reproduces the legacy interval exactly), deterministic fuzz for
// mature intervals only (short intervals stay exact), an interval cap, and
// lapse/leech flags. Untouched legacy cards keep their stored schedule until
// their next grade; all new card fields are optional and additive.
const EASE_DEFAULT=2.5,EASE_MIN=1.3,EASE_MAX=2.8,INTERVAL_CAP=365,LEECH_LAPSES=8;
const GRADE_FLOORS=[2/1440,1,3,7];
const EASE_STEP=[-0.2,-0.15,0,0.05];
function clampEase(value){return Math.min(EASE_MAX,Math.max(EASE_MIN,Number.isFinite(value)?value:EASE_DEFAULT));}
// Deterministic ±5% fuzz keyed by card identity and attempt count, so the same
// state grades identically in every tab while mature reviews stop bunching.
function fuzzFactor(cardId,grade,repetitions){let n=2166136261;const key=`${cardId}|${grade}|${repetitions}`;for(let i=0;i<key.length;i++){n^=key.charCodeAt(i);n=Math.imul(n,16777619)>>>0;}n=(Math.imul(n,1664525)+1013904223)>>>0;return 0.95+(n%10000)/10000*0.10;}
export function baseInterval(prevInterval,grade,ease=EASE_DEFAULT){const prev=Math.max(0,prevInterval),factor=clampEase(ease)/EASE_DEFAULT;
 const growth=[2/1440,prev*1.25*factor,prev*2.2*factor,prev*2.8*factor][grade];
 return Math.max(GRADE_FLOORS[grade],growth);}
export function freshState(){return {version:STATE_VERSION,revision:0,learned:[],cards:{},events:[],readingEvents:[],drillEvents:[],bookmarkedStories:[],bookmarkedWords:[],bookmarkedSentences:[],dialogueEvents:[],wordPracticeEvents:[],vocabularyIntroduced:[],vocabularyJourney:null,senseEvents:[],sentenceEvents:[],missionEvents:[],practiceSession:null,courseJourney:null,courseEvents:[],courseRepairSession:null,courseRepairEvents:[],ladderSession:null,ladderEvents:[],studyBlock:null,studyBlockEvents:[],blockTrail:null,blockTrailEvents:[],fluencySession:null,fluencyEvents:[],fluencyCompletions:[],dailyPlan:{minutes:15,focus:'balanced'},mistakePins:[],placement:null,introductions:[],scheduledWords:[],productionEvents:[],settings:{dailyNew:5,showPinyin:true,dark:false,readingLarge:false,hanziLarge:false},updatedAt:null};}
export function cardsForLesson(id){const lesson=findLesson(id);if(!lesson)return [];
 // Existing Batch 20 lessons retain their exact six card identities.
 const extended=lesson.order<=74?[]:[...lesson.words.slice(2).map((_,i)=>`word${i+2}`),...lesson.words.slice(1).map((_,i)=>`wordread${i+1}`)];
 return [...originalKinds,...extended].map(kind=>`${id}:${kind}`);}
// Opt-in vocabulary deck: scheduled lexicon words own exactly two cards in a
// namespace of their own, so lesson card identities never move.
export function wordCardsFor(key){return ['word:'+key+':meaning','word:'+key+':reading'];}

export function cardInfo(id){const wordMatch=/^word:(.+):(meaning|reading)$/.exec(String(id));
 if(wordMatch){const word=findWord(wordMatch[1]);if(!word)return null;const isMeaning=wordMatch[2]==='meaning';
  return {id:String(id),type:isMeaning?'meaning':'reading',wordKey:word.key,
   lesson:{id:null,hanzi:word.hanzi,pinyin:word.pinyin,meaning:word.senses.join('; '),note:word.notes[0]||''},
   prompt:word.hanzi,question:isMeaning?'What does this word mean?':'Type the word’s complete pinyin.',
   answer:isMeaning?word.senses.join('; '):word.pinyin,kind:isMeaning?'meaning':'pinyin',reading:isMeaning?word.pinyin:null};}
 const match=/^(demo-\d{2,3}):(meaning|reading|word[0-9]+|wordread[0-9]+|sentence)$/.exec(String(id));if(!match||!cardsForLesson(match[1]).includes(id))return null;
 const lesson=findLesson(match[1]);if(!lesson)return null;const type=match[2];
 if(type==='meaning')return {id,type,lesson,prompt:lesson.hanzi,question:'What does this character mean?',answer:lesson.meaning,kind:'meaning',reading:lesson.pinyin};
 if(type==='reading')return {id,type,lesson,prompt:lesson.hanzi,question:'Type the pinyin, including its tone.',answer:lesson.pinyin,kind:'pinyin',reading:null};
 if(type.startsWith('wordread')){const w=lesson.words[Number(type.slice(8))];return w?{id,type,lesson,prompt:w.hanzi,wordHanzi:w.hanzi,question:'Type the word’s complete pinyin.',answer:w.pinyin,kind:'pinyin',reading:null}:null;}
 if(type==='sentence')return {id,type,lesson,prompt:lesson.sentence.hanzi,question:'Choose the best English meaning of this sentence.',answer:lesson.sentence.english,kind:'choice',reading:null};
 const w=lesson.words[Number(type.slice(4))];return w?{id,type,lesson,prompt:w.hanzi,wordHanzi:w.hanzi,question:'What does this word mean?',answer:w.english,kind:'meaning',reading:w.pinyin}:null;}
export function validateState(input){if(!input||input.version!==STATE_VERSION||!Array.isArray(input.learned)||!input.learned.every(id=>DEMO_IDS.has(id))||new Set(input.learned).size!==input.learned.length||!input.cards||typeof input.cards!=='object'||Array.isArray(input.cards)||!Array.isArray(input.events)||input.events.length>100000)throw new Error('Invalid or incompatible learning history');
 validateReadingEvents(input.readingEvents);validatePracticeExtensions(input);validateGuidedSession(input.practiceSession);validatePlacement(input.placement);validateDialogueEvents(input.dialogueEvents);validateWordPracticeEvents(input.wordPracticeEvents);validateVocabularyLearning(input);validateSenseEvents(input.senseEvents);validateSentenceEvents(input.sentenceEvents);validateSentenceBookmarks(input);validateMissionEvents(input.missionEvents);validateCourseExtensions(input);validateCourseContinuation(input);validateLadderExtensions(input);validateBlockExtensions(input);validateTrail(input);validateFluency(input);validatePlanExtensions(input);validateProductionEvents(input.productionEvents);
 if('introductions'in input&&(!Array.isArray(input.introductions)||input.introductions.length>10000||input.introductions.some(item=>!item||!DEMO_IDS.has(item.id)||!Number.isFinite(item.at)||!input.learned.includes(item.id))))throw new Error('Invalid introduction history');
 if(!input.settings||!Number.isInteger(input.settings.dailyNew)||input.settings.dailyNew<1||input.settings.dailyNew>30||typeof input.settings.showPinyin!=='boolean'||typeof input.settings.dark!=='boolean')throw new Error('Invalid settings');
 if('hanziLarge' in input.settings && typeof input.settings.hanziLarge!=='boolean')throw new Error('Invalid Hanzi text-size preference');
 if(!Number.isSafeInteger(input.revision)||input.revision<0)throw new Error('Invalid data revision');
 if('scheduledWords'in input&&(!Array.isArray(input.scheduledWords)||input.scheduledWords.length>5000||new Set(input.scheduledWords).size!==input.scheduledWords.length||input.scheduledWords.some(k=>typeof k!=='string'||!findWord(k))))throw new Error('Invalid scheduled-word history');
 for(const [id,c] of Object.entries(input.cards)){const info=cardInfo(id);if(!info||!c||!Number.isFinite(c.due)||!Number.isFinite(c.interval)||c.interval<0||!Number.isInteger(c.repetitions)||c.repetitions<0||c.repetitions>100000)throw new Error('Invalid review-card data');
   if(info.wordKey){if(!Array.isArray(input.scheduledWords)||!input.scheduledWords.includes(info.wordKey))throw new Error('Invalid review-card data');}
   else if(!input.learned.includes(id.split(':')[0]))throw new Error('Invalid review-card data');
   if('ease'in c&&(!Number.isFinite(c.ease)||c.ease<1||c.ease>3))throw new Error('Invalid review-card data');
   if('lapses'in c&&(!Number.isInteger(c.lapses)||c.lapses<0||c.lapses>100000))throw new Error('Invalid review-card data');
   if('leech'in c&&typeof c.leech!=='boolean')throw new Error('Invalid review-card data');}
 const seen=new Set();for(const ev of input.events){if(!ev||typeof ev.id!=='string'||ev.id.length>100||seen.has(ev.id)||!cardInfo(ev.cardId)||!Number.isFinite(ev.at)||![0,1,2,3].includes(ev.grade)||('correct'in ev&&typeof ev.correct!=='boolean')||('assisted'in ev&&typeof ev.assisted!=='boolean'))throw new Error('Invalid review-history event');seen.add(ev.id);}return true;}
export function upgradedState(input,now=Date.now()){validateState(input);const result=structuredClone(input);let changed=false;
 if(!result.scheduledWords){result.scheduledWords=[];changed=true}
 for(const id of result.learned)for(const cid of cardsForLesson(id))if(!result.cards[cid]){result.cards[cid]={due:now,interval:0,repetitions:0,lastGrade:null};changed=true}
 for(const key of result.scheduledWords)for(const cid of wordCardsFor(key))if(!result.cards[cid]){result.cards[cid]={due:now,interval:0,repetitions:0,lastGrade:null};changed=true}
 return changed?result:null;}
export function addLesson(state,id,now=Date.now()){if(!findLesson(id))throw new Error('Only approved, original demo lessons are available');const next=structuredClone(state);if(!next.learned.includes(id)){next.learned.push(id);next.introductions??=[];next.introductions.push({id,at:now});}
 for(const cardId of cardsForLesson(id))if(!next.cards[cardId])next.cards[cardId]={due:now,interval:0,repetitions:0,lastGrade:null};next.updatedAt=new Date(now).toISOString();return next;}
export function scheduleWord(state,key,now=Date.now()){if(!findWord(key))throw new Error('Only canonical vocabulary words can be scheduled');const next=structuredClone(state);next.scheduledWords??=[];if(!next.scheduledWords.includes(key))next.scheduledWords.push(key);
 for(const cardId of wordCardsFor(key))if(!next.cards[cardId])next.cards[cardId]={due:now,interval:0,repetitions:0,lastGrade:null};next.updatedAt=new Date(now).toISOString();return next;}
export function unscheduleWord(state,key){const next=structuredClone(state);next.scheduledWords=(next.scheduledWords||[]).filter(k=>k!==key);
 for(const cardId of wordCardsFor(key))delete next.cards[cardId];next.updatedAt=new Date().toISOString();return next;}
export function gradeCard(state,id,grade,now=Date.now(),eventId,metadata={}){if(!cardInfo(id)||!state.cards[id])throw new Error('Review target unavailable');if(![0,1,2,3].includes(grade))throw new Error('Invalid review grade');if(!eventId||typeof eventId!=='string'||eventId.length>100)throw new Error('Missing review event identity');if(state.events.some(e=>e.id===eventId))return structuredClone(state);
 if(metadata.correct===false&&grade>0)throw new Error('Incorrect answers cannot receive passing credit');if(metadata.assisted===true&&grade>0)throw new Error('Revealed answers cannot receive independent credit');
 const next=structuredClone(state),c=next.cards[id],prev=Math.max(0,c.interval);
 const ease=clampEase(c.ease);
 let interval=baseInterval(prev,grade,ease);
 if(grade>0&&interval>7)interval=Math.max(GRADE_FLOORS[grade],interval*fuzzFactor(id,grade,c.repetitions));
 interval=Math.min(INTERVAL_CAP,interval);
 c.due=now+interval*DAY;c.interval=interval;c.repetitions=grade===0?0:c.repetitions+1;c.lastGrade=grade;c.ease=clampEase(ease+EASE_STEP[grade]);
 if(grade===0){c.lapses=(Number.isInteger(c.lapses)?c.lapses:0)+1;if(c.lapses>=LEECH_LAPSES)c.leech=true;}
 const ev={id:eventId,cardId:id,grade,at:now,policy:'review-v3'};if(typeof metadata.correct==='boolean')ev.correct=metadata.correct;if(typeof metadata.assisted==='boolean')ev.assisted=metadata.assisted;if(typeof metadata.errorType==='string')ev.errorType=metadata.errorType.slice(0,32);
 next.events.push(ev);next.updatedAt=new Date(now).toISOString();return next;}
export function dueCards(state,now=Date.now()){return Object.entries(state.cards).filter(([id,c])=>cardInfo(id)&&c.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([id])=>id);}
export function leechCards(state){return Object.keys(state.cards).filter(id=>state.cards[id]?.leech===true);}
export function nextLesson(state){return DEMO_LESSONS.find(x=>!state.learned.includes(x.id))||null;}
export function summary(state,now=Date.now()){const today=new Date(now).toDateString();const introducedToday=(state.introductions||[]).filter(item=>new Date(item.at).toDateString()===today).length;const successes=state.events.filter(e=>e.correct===true&&!e.assisted).length;return {learned:state.learned.length,total:DEMO_LESSONS.length,cards:Object.keys(state.cards).length,due:dueCards(state,now).length,attempts:state.events.length,successful:successes,introducedToday,dailyGoal:state.settings.dailyNew,next:nextLesson(state)};}
export function lessonGroups(){return sharedLessonGroups();}
