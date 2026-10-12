/** Checkpointed mixed practice. Outcomes are supplemental and NEVER grant scheduled-review mastery. */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {buildDrill,gradeDrill,DRILL_MODES} from './drills.mjs';
import {STORIES,findStory,storyExercise} from './stories.mjs';
import {evaluateAnswer} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {sentenceAssessment,SENTENCE_MODES} from './sentence-assessment.mjs';
import {CONTEXT_MODES,contextQuestion,recentRemediation} from './context-lab.mjs';
import {addDrillRecord} from './practice-records.mjs';
import {addReadingEvent} from './reader-records.mjs';
import {CONNECTED_TYPES,validConnectedItem,connectedQuestion,gradeConnected,recordConnectedAttempt,contextualWeaknesses} from './connected-practice.mjs';
export const SESSION_MODES=Object.freeze([...DRILL_MODES,...CONNECTED_TYPES,...['comprehension','cloze','ordering','pronunciation',...SENTENCE_MODES,...CONTEXT_MODES].map(x=>'story-'+x)]);
export const SESSION_LIMITS=Object.freeze([5,10,20]);
function isValidItem(item){return item&&typeof item==='object'&&
  (item.type==='drill'&&!!findLesson(item.id)&&DRILL_MODES.includes(item.mode)||item.type==='story'&&!!findStory(item.id)&&['comprehension','cloze','ordering','pronunciation',...SENTENCE_MODES,...CONTEXT_MODES].includes(item.mode)||validConnectedItem(item));}
export function validateGuidedSession(session){if(session==null)return true;
 if(!session||typeof session!=='object'||typeof session.id!=='string'||session.id.length>100||!session.id||!SESSION_LIMITS.includes(session.limit)||!Array.isArray(session.items)||session.items.length!==session.limit||!session.items.every(isValidItem)||!Number.isInteger(session.cursor)||session.cursor<0||session.cursor>session.items.length||!Number.isFinite(session.startedAt)||session.startedAt<0||typeof session.correct!=='number'||session.correct<0||session.correct>session.cursor||typeof session.assisted!=='number'||session.assisted<0||session.assisted>session.cursor||session.correct+session.assisted>session.cursor||!((session.assistanceUsed===undefined||typeof session.assistanceUsed==='boolean')&&(session.feedback===null||session.feedback&&typeof session.feedback==='object'&&typeof session.feedback.correct==='boolean'&&typeof session.feedback.assisted==='boolean'&&typeof session.feedback.message==='string'&&session.feedback.message.length<=300&&typeof session.feedback.reference==='string'&&session.feedback.reference.length<=200)))throw Error('Invalid guided practice session');
 if(session.feedback&&session.cursor>=session.limit)throw Error('Completed session cannot have outstanding feedback');
 return true;}
export function createGuidedSession(state,{limit=10,focus='balanced',id,now=Date.now()}={}){
 if(!SESSION_LIMITS.includes(limit)||!['balanced','weak','reading','sentences','pronunciation','connected'].includes(focus)||typeof id!=='string'||!id||id.length>100)throw Error('Invalid practice session settings');
 const learned=new Set(state.learned);let lessonIds=DEMO_LESSONS.filter(l=>learned.has(l.id)).map(l=>l.id);
 if(!lessonIds.length)lessonIds=DEMO_LESSONS.slice(0,12).map(l=>l.id);
 const errorCount=id=>state.events.filter(e=>e.cardId.startsWith(id+':')&&e.correct===false).length+(state.drillEvents||[]).filter(e=>e.lessonId===id&&!e.correct).length;
 if(focus==='weak'){const rank=new Map(recentRemediation(state,{limit:74}).map((e,i)=>[e.id,i]));lessonIds.sort((a,b)=>(rank.get(a)??999)-(rank.get(b)??999)||errorCount(b)-errorCount(a)||DEMO_LESSONS.findIndex(l=>l.id===a)-DEMO_LESSONS.findIndex(l=>l.id===b));}
 const offset=focus==='weak'?0:(state.drillEvents||[]).length%lessonIds.length;if(focus!=='weak')lessonIds=[...lessonIds.slice(offset),...lessonIds.slice(0,offset)];
 const items=[];
 const connected=contextualWeaknesses(state);
 const connectedOffset=((state.senseEvents||[]).length+(state.sentenceEvents||[]).length+(state.missionEvents||[]).length)%connected.length;
 for(let i=0;i<limit;i++){
  if(focus==='connected'||(focus==='weak'&&i%2===1)||(focus==='balanced'&&i%5===2)){
   const at=focus==='weak'?Math.floor(i/2):focus==='balanced'?Math.floor(i/5):i;
   items.push({...connected[(at+(focus==='weak'?0:connectedOffset))%connected.length]});continue;
  }
  const storyIndex=(i+Math.floor((state.readingEvents||[]).length/3))%STORIES.length;
  const doStory=focus==='sentences'||(focus==='reading'?i%3!==2:focus==='balanced'?i%4===3:focus==='weak'?i%5===4:false);
  if(doStory){const modes=focus==='sentences'?['line-meaning','line-order','connection','evidence','comprehension','cloze']:['comprehension','cloze','ordering','pronunciation','line-meaning','line-order','evidence','connection'];
   items.push({type:'story',id:STORIES[storyIndex].id,mode:modes[i%modes.length]});}
  else {const lessonId=lessonIds[(i+Math.floor(i/4))%lessonIds.length];let selected=DRILL_MODES[(i+offset)%DRILL_MODES.length];
   if(focus==='pronunciation')selected=i%2?'reading-choice':'word-pinyin';
   if(focus==='weak'){const recent=[...state.events].reverse().find(e=>e.cardId.startsWith(lessonId+':')&&(e.correct===false||e.grade===0));
     selected=recent?.cardId.endsWith(':reading')||recent?.cardId.endsWith(':wordread0')?'word-pinyin':recent?.cardId.endsWith(':sentence')?'sentence-cloze':i%2?'word-meaning':'recognition';}
   items.push({type:'drill',id:lessonId,mode:selected});}

 }
 const session={id,limit,items,cursor:0,correct:0,assisted:0,startedAt:now,feedback:null,assistanceUsed:false};validateGuidedSession(session);return session;
}
export function guidedQuestion(session){validateGuidedSession(session);if(!session||session.cursor>=session.items.length)return null;
 const item=session.items[session.cursor];
 const question=CONNECTED_TYPES.includes(item.type)?connectedQuestion(item):item.type==='drill'?buildDrill(item.id,item.mode):SENTENCE_MODES.includes(item.mode)?sentenceAssessment(item.id,item.mode):CONTEXT_MODES.includes(item.mode)?contextQuestion(item.id,item.mode):storyExercise(findStory(item.id),item.mode);
 if(!question)throw Error('Missing approved demonstration question');
 return {...question,sourceType:item.type,sourceId:item.id,mode:item.mode,explanation:question.explanation|| (item.type==='story'?findStory(item.id).title:'')};
}
export function evaluateGuided(question,response,order=[]){if(question.kind==='ordering'){
  const ok=order.length===question.chunks.length&&order.every((v,i)=>v===i);
  return {correct:ok,reason:ok?'correct':'ordering',message:ok?'Correct sequence.':'Review the order shown in the reference.'};
 }
 if(CONNECTED_TYPES.includes(question.sourceType))return gradeConnected({type:question.sourceType,id:question.sourceId,mode:question.mode,...(question.sourceType==='mission'?{step:question.missionStep}:{})},response);
 if(question.sourceType==='drill')return gradeDrill(question,response,order);
 return question.kind==='pinyin'?toneExplanation(response,question.answer):evaluateAnswer(response,question.answer,question.kind);
}
export function recordGuidedAnswer(state,{response='',order=[],assisted=false,reveal=false,eventId,now=Date.now()}={}){
 validateGuidedSession(state.practiceSession);const session=state.practiceSession;
 if(!session||session.cursor>=session.limit||session.feedback)throw Error('No unanswered guided question');
 if(typeof eventId!=='string'||!eventId||eventId.length>100)throw Error('Invalid event identity');
 const question=guidedQuestion(session);
 if(!reveal&&(!String(response).trim()&&!(question.kind==='ordering'&&order.length)))throw Error('Answer required');
 const result=reveal?{correct:false,reason:'revealed',message:'Reference revealed; no independent success.'}:evaluateGuided(question,response,order);
 const isAssisted=!!assisted||!!session.assistanceUsed||!!reveal;
 const item=session.items[session.cursor];
 let next=CONNECTED_TYPES.includes(item.type)?recordConnectedAttempt(state,item,{eventId,correct:!!result.correct,assisted:isAssisted,now}):item.type==='drill'?addDrillRecord(state,item.id,item.mode,!!result.correct,isAssisted,eventId,now):addReadingEvent(state,item.id,item.mode,!!result.correct,isAssisted,eventId,now);
 const feedback={correct:!!result.correct,assisted:isAssisted,reason:result.reason||'checked',message:String(result.detail||result.message).slice(0,300),reference:String(question.answer).slice(0,200)};
 next.practiceSession={...session,feedback};return next;
}
export function advanceGuidedSession(state){validateGuidedSession(state.practiceSession);const session=state.practiceSession;if(!session?.feedback)throw Error('No answered guided question');
 const correct=session.correct+Number(session.feedback.correct&&!session.feedback.assisted),assisted=session.assisted+Number(session.feedback.assisted);
 const next=structuredClone(state);next.practiceSession={...session,cursor:session.cursor+1,correct,assisted,feedback:null,assistanceUsed:false};validateGuidedSession(next.practiceSession);return next;
}
export function abandonGuidedSession(state){const next=structuredClone(state);next.practiceSession=null;return next;}
