/** Batch 18: local-first, explainable multi-day study plan and reusable mistake collection.
 * No timer, account, HSK claim, server, background notification, or mastery modification.
 */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {cardInfo,dueCards} from './study.mjs';
import {FLUENCY_BANK,fluencyQuestion} from './fluency-studio.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';

const BANK=Object.freeze(new Map(FLUENCY_BANK.map(q=>[q.id,q])));
export const PLAN_FOCI=Object.freeze(['balanced','mistakes','reading','pronunciation']);
export const PLAN_MINUTES=Object.freeze([10,15,25,40]);
const DAY=86400000;
const properDate=at=>{const d=new Date(at);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const validTime=at=>Number.isFinite(at)&&at>=0;
export function planPreferences(state){return state.dailyPlan??{minutes:15,focus:'balanced'};}
export function validatePlanExtensions(state){
 const p=state.dailyPlan;
 if(p!==undefined&&(!p||!PLAN_MINUTES.includes(p.minutes)||!PLAN_FOCI.includes(p.focus)))throw Error('Invalid local study plan');
 const pins=state.mistakePins;
 if(pins!==undefined){
  if(!Array.isArray(pins)||pins.length>300||new Set(pins).size!==pins.length)throw Error('Invalid saved mistake collection');
  const allowed=new Set(mistakeCatalog(state).map(x=>x.id));
  if(pins.some(x=>typeof x!=='string'||x.length>140||!allowed.has(x)))throw Error('Invalid saved mistake collection');
 }
 return true;
}
export function setPlanPreferences(state,{minutes,focus}){
 if(!PLAN_MINUTES.includes(minutes)||!PLAN_FOCI.includes(focus))throw Error('Unsupported study plan preferences');
 const next=structuredClone(state);next.dailyPlan={minutes,focus};return next;
}
function item(id,kind,label,source,events,extra={}){
 const sorted=events.filter(e=>validTime(e.at)).sort((a,b)=>a.at-b.at);
 const last=sorted.at(-1);
 return {id,kind,label,source,attempts:sorted.length,unresolved:!!last&&(!last.correct||last.assisted),lastAt:last?.at??null,reason:last?.assisted?'Last response used assistance':last&&!last.correct?'Last answer needs correction':last?'Later independent success recorded':'Not yet attempted',...extra};
}
// All entries derive from existing, bounded, already validated learner histories.
export function mistakeCatalog(state){
 const result=[];
 const rev=new Map();for(const e of state.events||[]){const k=e.cardId;if(!rev.has(k))rev.set(k,[]);rev.get(k).push({...e,correct:e.correct??e.grade>0,assisted:e.assisted===true});}
 for(const [id,events] of rev){const card=cardInfo(id);if(!card)continue;if(!events.some(e=>!e.correct||e.assisted))continue;result.push(item(`review:${id}`,'review',`${card.lesson.hanzi} · ${card.question}`,{type:'lesson',id:card.lesson.id},events,{skill:card.type}));}
 const flu=new Map();for(const e of state.fluencyEvents||[]){if(!flu.has(e.questionId))flu.set(e.questionId,[]);flu.get(e.questionId).push(e);}
 for(const [id,events] of flu){const q=BANK.get(id);if(!q||!events.some(e=>!e.correct||e.assisted))continue;result.push(item(`fluency:${id}`,q.kind,`${q.hanzi||q.context.slice(0,36)} · ${q.prompt}`,q.origin,events,{skill:q.skill}));}
 const course=new Map();for(const e of state.courseEvents||[]){if(e.stage==='completed')continue;const k=`${e.lessonId}:${e.stage}`;if(!course.has(k))course.set(k,[]);course.get(k).push(e);}
 for(const [key,events] of course){if(!events.some(e=>!e.correct||e.assisted))continue;const [lessonId,stage]=key.split(':');const l=findLesson(lessonId);if(!l)continue;result.push(item(`course:${key}`,'course',`${l.hanzi} · ${stage} checkpoint`,{type:'lesson',id:l.id},events,{skill:stage}));}
 // Use existing supplemental histories without copying or modifying them.
 for(const [prefix,source,allowed] of [
  ['ladder',state.ladderEvents||[],null],
  ['repair',state.courseRepairEvents||[],null],
  ['block',state.studyBlockEvents||[],e=>e.type==='check']
 ]){
  const group=new Map();for(const e of source){if(allowed&&!allowed(e))continue;const key=`${e.lessonId}:${e.stage??e.kind}`;if(!group.has(key))group.set(key,[]);group.get(key).push(e);}
  for(const [key,events] of group){if(!events.some(e=>!e.correct||e.assisted))continue;const [lessonId,stage]=key.split(':');const l=findLesson(lessonId);if(!l)continue;result.push(item(`${prefix}:${key}`,prefix,`${l.hanzi} · ${stage} follow-up`,{type:'lesson',id:lessonId},events,{skill:stage}));}
 }
 return result.sort((a,b)=>Number(b.unresolved)-Number(a.unresolved)||(b.lastAt??0)-(a.lastAt??0)||a.id.localeCompare(b.id));
}
export function toggleMistakePin(state,id){if(!mistakeCatalog(state).some(item=>item.id===id))throw Error('No qualifying mistake evidence');const next=structuredClone(state);const existing=next.mistakePins??[];next.mistakePins=existing.includes(id)?existing.filter(x=>x!==id):[...existing,id];validatePlanExtensions(next);return next;}
export function mistakeCollections(state){const all=mistakeCatalog(state),pins=new Set(state.mistakePins||[]);return {all,unresolved:all.filter(x=>x.unresolved),saved:all.filter(x=>pins.has(x.id)),corrected:all.filter(x=>!x.unresolved),pins};}
const countDate=(events,date,predicate=()=>true)=>events.filter(e=>validTime(e.at)&&properDate(e.at)===date&&predicate(e)).length;
export function dailyEvidence(state,date){return {
  reviews:countDate(state.events||[],date),
  journeys:countDate(state.courseEvents||[],date,e=>e.stage==='completed'),
  fluency:countDate(state.fluencyCompletions||[],date),
  reading:countDate(state.readingEvents||[],date),
  dialogue:countDate(state.dialogueEvents||[],date),
  corrections:countDate(state.courseRepairEvents||[],date)+countDate(state.fluencyEvents||[],date,e=>e.correct&&!e.assisted)
 };}
export function plannedDays(state,{now=Date.now(),days=7}={}){
 if(!validTime(now)||!Number.isInteger(days)||days<1||days>14)throw Error('Invalid planning window');
 const prefs=planPreferences(state),mistakes=mistakeCollections(state),due=dueCards(state,now).length;
 const next=DEMO_LESSONS.find(l=>!state.learned.includes(l.id))||DEMO_LESSONS[0];
 const nextIndex=DEMO_LESSONS.findIndex(l=>l.id===next.id);
 const budget={review:Math.max(2,Math.round(prefs.minutes*.35)),journey:Math.max(2,Math.round(prefs.minutes*.30)),fluency:Math.max(2,Math.round(prefs.minutes*.20))};
 budget.context=prefs.minutes-budget.review-budget.journey-budget.fluency;
 const plans=[];
 for(let offset=0;offset<days;offset++){
  const day=new Date(now);day.setHours(12,0,0,0);day.setDate(day.getDate()+offset);
  const date=properDate(day.getTime()),evidence=dailyEvidence(state,date);
  const suggested=DEMO_LESSONS[Math.min(DEMO_LESSONS.length-1,nextIndex+offset)];
  const tasks=[
   {type:'review',label:offset===0?`${due} due review targets`:'Check due reviews',why:'Scheduled recall is tracked independently',minutes:budget.review,done:evidence.reviews>0},
   {type:'journey',label:`Connected lesson: ${suggested.hanzi}`,why:'Characters → words → contextual sentence',minutes:budget.journey,done:evidence.journeys>0},
   {type:'fluency',label:prefs.focus==='mistakes'||mistakes.unresolved.length?'Correct contextual mistakes':'Practice across contexts',why:mistakes.unresolved.length?`${mistakes.unresolved.length} unresolved observations in learning history`:'Mix word senses, reading and tones',minutes:budget.fluency,done:evidence.fluency>0},
   {type:(prefs.focus==='reading'||offset%2===0)?'reading':'dialogue',label:(prefs.focus==='reading'||offset%2===0)?'Read a connected story':'Understand a dialogue',why:'Apply vocabulary in longer context',minutes:budget.context,done:evidence.reading+evidence.dialogue>0}
  ];
  const order=prefs.focus==='reading'?['reading','journey','review','fluency']:prefs.focus==='pronunciation'?['fluency','review','journey','reading','dialogue']:prefs.focus==='mistakes'?['fluency','review','journey','reading','dialogue']:['review','journey','fluency','reading','dialogue'];
  tasks.sort((a,b)=>order.indexOf(a.type)-order.indexOf(b.type));
  plans.push({date,offset,minutes:prefs.minutes,tasks,evidence,observed:offset===0,plannedOnly:offset>0});
 }
 return plans;
}
export function nextConnectedMaterial(state){
 const readEvents=state.readingEvents||[],talkEvents=state.dialogueEvents||[];
 const readSeen=new Set(readEvents.map(e=>e.storyId));const talkSeen=new Set(talkEvents.map(e=>e.dialogueId));
 const recentRead=readEvents.at(-1),recentTalk=talkEvents.at(-1);
 const nextRead=STORIES.find(s=>!readSeen.has(s.id))||STORIES[(STORIES.findIndex(s=>s.id===recentRead?.storyId)+1)%STORIES.length]||STORIES[0];
 const nextTalk=DIALOGUES.find(d=>!talkSeen.has(d.id))||DIALOGUES[(DIALOGUES.findIndex(d=>d.id===recentTalk?.dialogueId)+1)%DIALOGUES.length]||DIALOGUES[0];
 return {reading:nextRead,dialogue:nextTalk,readAttempted:readSeen.size,dialoguesAttempted:talkSeen.size};
}

export function recentStudyRhythm(state,{now=Date.now(),days=7}={}){
 if(!validTime(now)||!Number.isInteger(days)||days<1||days>14)throw Error('Invalid retrospective window');
 const rows=[];for(let i=days-1;i>=0;i--){const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-i);const date=properDate(d.getTime()),e=dailyEvidence(state,date);rows.push({date,...e,total:e.reviews+e.journeys+e.fluency+e.reading+e.dialogue});}return rows;
}
