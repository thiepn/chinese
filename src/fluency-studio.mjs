/** Batch 17: connected multi-skill, local-first supplemental sessions.
 * Questions reference only original DEMO content. Session history never mutates SRS cards/events.
 */
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {STORIES,findStory} from './stories.mjs';
import {DIALOGUES,findDialogue} from './dialogues.mjs';
import {SENSE_CASES} from './sense-lab.mjs';
import {SENTENCE_TASKS,checkSentence} from './sentence-workshop.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {lessonSkillLedger} from './block-coach.mjs';

const ASSESSMENTS=[];
for(const [i,c] of SENSE_CASES.entries()) ASSESSMENTS.push(Object.freeze({id:`sense:${i}`,kind:'sense',skill:'context',origin:{type:'sense',id:c.id},hanzi:c.hanzi,context:c.hanzi,prompt:`In this sentence, what does ${c.target} mean?`,options:c.options,answer:c.answer,teaching:`${c.explanation} · ${c.pinyin}`}));
for(const [i,t] of SENTENCE_TASKS.entries()) ASSESSMENTS.push(Object.freeze({id:`write:${i}`,kind:'writing',skill:'sentence',origin:t.storyId?{type:'reading',id:t.storyId}:{type:'sentence',id:t.id},context:t.english,prompt:'Reconstruct the original Chinese sentence exactly. Valid alternative translations are not assessed here.',answer:t.hanzi,teaching:t.pinyin}));
for(const [i,s] of STORIES.entries()){
 const line=s.lines[1];ASSESSMENTS.push(Object.freeze({id:`read:${i}`,kind:'reading',skill:'sentence',origin:{type:'reading',id:s.id},context:s.lines.map(l=>l.hanzi).join('  '),prompt:`Which Chinese sentence means “${line.english}”?`,options:s.lines.map(l=>l.hanzi),answer:line.hanzi,teaching:line.pinyin}));
}
for(const [i,d] of DIALOGUES.entries()){
 const line=d.lines[1];ASSESSMENTS.push(Object.freeze({id:`talk:${i}`,kind:'dialogue',skill:'context',origin:{type:'dialogue',id:d.id},context:d.lines.map(l=>`${l.speaker}: ${l.hanzi}`).join('  '),prompt:`Which line means “${line.english}”?`,options:d.lines.map(l=>l.hanzi),answer:line.hanzi,teaching:line.pinyin}));
}
for(const l of DEMO_LESSONS) for(const [i,w] of l.words.entries()) ASSESSMENTS.push(Object.freeze({id:`tone:${l.id}:${i}`,kind:'tone',skill:'pronunciation',origin:{type:'lesson',id:l.id},hanzi:w.hanzi,context:`${w.hanzi} — ${w.english}`,prompt:'Type this complete word’s pinyin with lexical tones.',answer:w.pinyin,teaching:`${w.hanzi}: ${w.pinyin} · ${w.english}`}));
const LOOKUP=new Map(ASSESSMENTS.map(x=>[x.id,x]));
export const FLUENCY_KINDS=Object.freeze(['sense','writing','reading','dialogue','tone']);
export const FLUENCY_FOCUS=Object.freeze(['balanced','context','pronunciation','weak']);
export const FLUENCY_BANK=Object.freeze(ASSESSMENTS);
export const fluencyQuestion=id=>LOOKUP.get(id)||null;
const eventId=id=>typeof id==='string'&&id.length>0&&id.length<=100;
const time=t=>Number.isFinite(t)&&t>=0;

export function fluencyPriority(state,q){
 const past=(state.fluencyEvents||[]).filter(e=>e.questionId===q.id).sort((a,b)=>a.at-b.at);const last=past.at(-1);
 const unresolved=!!last&&(!last.correct||last.assisted);
 const lesson=q.origin.type==='lesson'?lessonSkillLedger(state,q.origin.id).find(s=>s.skill==='pronunciation'):null;
 const extra=q.kind==='sense'?(state.senseEvents||[]).filter(e=>e.caseId===q.origin.id):q.kind==='writing'?(state.sentenceEvents||[]).filter(e=>e.taskId===SENTENCE_TASKS[Number(q.id.split(':')[1])]?.id):[];
 const related=q.kind==='reading'?(state.readingEvents||[]).filter(e=>e.storyId===q.origin.id&&['evidence','line-meaning','comprehension'].includes(e.mode)):q.kind==='dialogue'?(state.dialogueEvents||[]).filter(e=>e.dialogueId===q.origin.id):[];
 const lastExtra=[...extra,...related].sort((a,b)=>a.at-b.at).at(-1);const externalUnresolved=!!lastExtra&&(!lastExtra.correct||lastExtra.assisted);
 return {score:(unresolved?25:0)+(externalUnresolved?12:0)+(lesson?.unresolved?8:0)+(past.length===0?6:0)-Math.min(past.length,10),reason:unresolved?'Previous attempt needs correction':externalUnresolved?'A related exercise needs another attempt':lesson?.unresolved?'Pronunciation was previously missed':past.length?'Spaced supplemental practice':'Not yet practiced here'};
}
export function planFluency(state,{size=8,focus='balanced'}={}){
 if(![6,8,12,16].includes(size)||!FLUENCY_FOCUS.includes(focus))throw Error('Invalid fluency session setup');
 const ids=[],taken=new Set();const candidates=ASSESSMENTS.map(q=>({q,...fluencyPriority(state,q)}));
 const ordered=[...candidates].sort((a,b)=>b.score-a.score||a.q.id.localeCompare(b.q.id));
 const weights=focus==='pronunciation'?['tone','tone','tone','writing','tone','reading','sense','dialogue']:focus==='context'?['sense','dialogue','reading','sense','writing','dialogue','tone']:['reading','tone','sense','dialogue','writing'];
 const lists=new Map(FLUENCY_KINDS.map(k=>[k,ordered.filter(x=>x.q.kind===k)]));
 if(focus==='weak'){
  // Front-load true unresolved observations, then distribute remaining skills.
  for(const x of ordered.filter(x=>x.score>=14).slice(0,Math.max(1,Math.floor(size/2)))){
   ids.push(x.q.id);taken.add(x.q.id);
  }
 }
 while(ids.length<size){let added=false;for(const kind of weights){const entry=(lists.get(kind)||[]).find(x=>!taken.has(x.q.id));if(entry){ids.push(entry.q.id);taken.add(entry.q.id);added=true;if(ids.length===size)break;}}if(!added)break;}
 return ids;
}
export function validateFluency(state){
 const s=state.fluencySession;
 if(s!==undefined&&s!==null){if(!eventId(s.id)||!FLUENCY_FOCUS.includes(s.focus)||!Array.isArray(s.questionIds)||![6,8,12,16].includes(s.questionIds.length)||new Set(s.questionIds).size!==s.questionIds.length||!s.questionIds.every(id=>LOOKUP.has(id))||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>=s.questionIds.length||typeof s.assisted!=='boolean'||!time(s.at)||!(s.feedback===null||s.feedback&&typeof s.feedback.correct==='boolean'&&typeof s.feedback.assisted==='boolean'&&typeof s.feedback.message==='string'&&s.feedback.message.length<=600&&typeof s.feedback.reason==='string'&&s.feedback.reason.length<=40))throw Error('Invalid Fluency Studio checkpoint');}
 if(state.fluencyEvents!==undefined){if(!Array.isArray(state.fluencyEvents)||state.fluencyEvents.length>30000)throw Error('Invalid Fluency Studio history');const used=new Set();for(const e of state.fluencyEvents){if(!e||!eventId(e.id)||used.has(e.id)||!eventId(e.sessionId)||!LOOKUP.has(e.questionId)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!time(e.at)||typeof e.reason!=='string'||e.reason.length>40)throw Error('Invalid fluency event');used.add(e.id);}}
 if(state.fluencyCompletions!==undefined){if(!Array.isArray(state.fluencyCompletions)||state.fluencyCompletions.length>5000)throw Error('Invalid fluency completions');const used=new Set();for(const c of state.fluencyCompletions){if(!c||!eventId(c.id)||used.has(c.id)||!eventId(c.sessionId)||!time(c.at)||![6,8,12,16].includes(c.count)||!Number.isInteger(c.independent)||c.independent<0||c.independent>c.count)throw Error('Invalid fluency completion');used.add(c.id);}}
 return true;
}
export function beginFluency(state,{id,size=8,focus='balanced',at=Date.now()}={}){if(state.fluencySession||!eventId(id)||!time(at))throw Error('Cannot begin fluency session');const questionIds=planFluency(state,{size,focus}),n=structuredClone(state);n.fluencySession={id,focus,questionIds,cursor:0,assisted:false,feedback:null,at};validateFluency(n);return n;}
export function fluencyCurrent(state){const s=state.fluencySession;return s?LOOKUP.get(s.questionIds[s.cursor])||null:null;}
export function fluencyHint(state){if(!state.fluencySession||state.fluencySession.feedback)throw Error('No unanswered fluency question');const n=structuredClone(state);n.fluencySession.assisted=true;validateFluency(n);return n;}
export function fluencyAnswer(state,{id,response='',reveal=false,at=Date.now()}={}){
 const s=state.fluencySession,q=fluencyCurrent(state);if(!s||!q||s.feedback||!eventId(id)||!time(at)||(state.fluencyEvents||[]).some(e=>e.id===id)||(!reveal&&!String(response).trim()))throw Error('Cannot record fluency answer');
 let result;
 if(reveal)result={correct:false,reason:'revealed',message:'Answer revealed; this was teaching support.'};
 else if(q.kind==='tone')result=toneExplanation(response,q.answer);
 else if(q.kind==='writing')result=checkSentence(SENTENCE_TASKS[Number(q.id.split(':')[1])],response);
 else result={correct:response===q.answer,reason:response===q.answer?'correct':'context',message:response===q.answer?'Interpretation matches this contextual example.':'Compare the original Chinese context with the meaning.'};
 const n=structuredClone(state),assisted=!!(s.assisted||reveal);
 n.fluencyEvents??=[];n.fluencyEvents.push({id,sessionId:s.id,questionId:q.id,correct:!!result.correct,assisted,reason:String(result.reason||'incorrect').slice(0,40),at});
 n.fluencySession.feedback={correct:!!result.correct,assisted,reason:String(result.reason||'incorrect').slice(0,40),message:String(result.detail||result.message||'Review the reference.').slice(0,600)};
 validateFluency(n);return n;
}
export function advanceFluency(state,{id,at=Date.now()}={}){const s=state.fluencySession;if(!s?.feedback||!eventId(id)||!time(at)||(state.fluencyCompletions||[]).some(e=>e.id===id))throw Error('Cannot advance unanswered fluency session');const n=structuredClone(state);if(s.cursor+1===s.questionIds.length){const events=(state.fluencyEvents||[]).filter(e=>e.sessionId===s.id);n.fluencyCompletions??=[];n.fluencyCompletions.push({id,sessionId:s.id,at,count:s.questionIds.length,independent:events.filter(e=>e.correct&&!e.assisted).length});n.fluencySession=null;}else n.fluencySession={...s,cursor:s.cursor+1,feedback:null,assisted:false};validateFluency(n);return n;}
export function abandonFluency(state){if(!state.fluencySession)throw Error('No fluency session');const n=structuredClone(state);n.fluencySession=null;return n;}
export function fluencySummary(state){const events=state.fluencyEvents||[],complete=state.fluencyCompletions||[];return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,assisted:events.filter(e=>e.assisted).length,completed:complete.length,active:!!state.fluencySession,unresolved:[...new Set(events.filter(e=>!e.correct||e.assisted).map(e=>e.questionId))].filter(id=>{const last=events.filter(e=>e.questionId===id).at(-1);return !!last&&(!last.correct||last.assisted)}).length};}
