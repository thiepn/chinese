/** Batch 19: a single navigation model over existing, independently recorded learning modes.
 * Pure view projection: NEVER records responses, creates review grades or changes user state.
 */
import {DEMO_LESSONS, findLesson} from './demo-lessons.mjs';
import {dueCards} from './study.mjs';
import {plannedDays, mistakeCollections, nextConnectedMaterial, planPreferences} from './daily-plan.mjs';

const LABELS=Object.freeze({block:'Study Block',repair:'Targeted correction',journey:'Daily Journey',ladder:'Sentence Ladder',fluency:'Fluency Studio',practice:'Practice Lab',placement:'Placement check',trail:'Context Trail'});

export function activeLearningSessions(state){
 const sessions=[];
 const add=(kind,session,detail,route,priority)=>{
  if(!session)return;
  sessions.push({kind,label:LABELS[kind],detail:String(detail),route,priority,
   // This is a local session-start timestamp, not a prediction of proficiency.
   startedAt:Number.isFinite(session.startedAt)?session.startedAt:0});
 };
 const b=state.studyBlock;
 add('block',b,b?`Step ${b.cursor+1} of ${b.steps.length} · ${b.lessonIds.length} lessons`:'','block',0);
 const r=state.courseRepairSession;
 add('repair',r,r?`Correcting ${findLesson(r.lessonId)?.hanzi||'a demo lesson'} · step ${r.index+1} of ${r.stages.length}`:'','journey',1);
 const c=state.courseJourney;
 add('journey',c,c?`${findLesson(c.lessonId)?.hanzi||'Demo lesson'} · guided stage ${c.cursor+1} of 6`:'','journey',2);
 const l=state.ladderSession;
 add('ladder',l,l?`${findLesson(l.lessonId)?.hanzi||'Demo lesson'} · stage ${l.cursor+1} of 4`:'','ladder',3);
 const f=state.fluencySession;
 add('fluency',f,f?`Question ${f.cursor+1} of ${f.questionIds.length}`:'','fluency',4);
 const p=state.practiceSession;
 add('practice',p,p?`Question ${p.cursor+1} of ${p.limit}`:'','practice',5);
 const t=state.blockTrail;
 add('trail',t,t?`Context connection in progress`:'','block',6);
 if(state.placement?.status==='active')add('placement',state.placement,`${state.placement.answers?.length||0} of 6 checked`,'today',7);
 return sessions.sort((a,b)=>a.priority-b.priority);
}

/** A deterministic daily route; active work outranks starting duplicate work.
 * A due review is not the same thing as a completed lesson, and no review is graded here.
 */
export function learningHub(state,{now=Date.now()}={}){
 const sessions=activeLearningSessions(state);
 const upcoming=dueCards(state,now);
 const plan=plannedDays(state,{now,days:1})[0];
 const collections=mistakeCollections(state);
 const connected=nextConnectedMaterial(state);
 const nextLesson=DEMO_LESSONS.find(l=>!state.learned.includes(l.id))||null;
 const prefs=planPreferences(state);
 let primary;
 if(sessions.length){const s=sessions[0];primary={kind:'resume',route:s.route,label:`Resume ${s.label}`,detail:s.detail,source:s.kind};}
 else if(upcoming.length){primary={kind:'review',route:'review',label:`Review ${upcoming.length} due skill${upcoming.length===1?'':'s'}`,detail:'Scheduled recall; only a submitted and graded independent review can change the review schedule.'};}
 else if(collections.unresolved.length){primary={kind:'remediation',route:'plan',label:'Correct an observed mistake',detail:`${collections.unresolved.length} unresolved item${collections.unresolved.length===1?'':'s'} · no automatic mastery credit`};}
 else if(nextLesson){primary={kind:'journey',route:'journey',label:`Learn ${nextLesson.hanzi} in context`,detail:`Lesson ${nextLesson.order} · character → words → sentence → tones`,lessonId:nextLesson.id};}
 else primary={kind:'fluency',route:'fluency',label:'Continue contextual practice',detail:'All demo lessons introduced; practice remains separate from scheduled review.'};
 const cards=plan.tasks.map((task,index)=>({id:task.type,kind:task.type,label:task.label,reason:task.why,minutes:task.minutes,done:task.done,index}));
 return {primary,sessions,plan,preferences:prefs,cards,due:upcoming.length,unresolved:collections.unresolved.length,
  recentMistakes:collections.unresolved.slice(0,4),nextLesson,connected,
  introduced:state.learned.length,total:DEMO_LESSONS.length,
  summary:'Learning observations, course completion and scheduled recall remain distinct.'};
}

/** Route metadata for a consistent contextual navigation footer, rather than repeated walls of buttons. */
export const LEARNING_DESTINATIONS=Object.freeze([
 {route:'today',label:'Today',detail:'Next action and recoverable sessions'},
 {route:'plan',label:'Study Plan',detail:'Personal schedule and saved mistakes'},
 {route:'learn',label:'Learn',detail:'Characters, complete words and sentences'},
 {route:'review',label:'Review',detail:'Due independent recall'},
 {route:'stories',label:'Readings',detail:'Contextual reading'},
 {route:'dialogues',label:'Dialogues',detail:'Conversation comprehension'},
 {route:'fluency',label:'Practice',detail:'Mixed contextual work'},
 {route:'explore',label:'Explore',detail:'Characters and vocabulary'},
]);
