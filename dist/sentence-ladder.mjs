/** Batch 14: optional, saveable sentence/word learning ladder. Never schedules mastery. */
import {DEMO_LESSONS, findLesson} from './demo-lessons.mjs';
import {makeOptions} from './exercises.mjs';
import {toneExplanation} from './tone-coach.mjs';
const STAGES=Object.freeze(['word','meaning','order','tone']);
const validId=s=>typeof s==='string'&&s.length>0&&s.length<=100;
const finiteTime=x=>Number.isFinite(x)&&x>=0;
export const LADDER_STAGES=STAGES;
const normalize=s=>String(s).normalize('NFC').replace(/[\s\u3000。，！？.!?,;；、]/gu,'');
export function sentenceChunks(lessonId){
 const lesson=findLesson(lessonId);if(!lesson)throw Error('Unknown lesson');
 // Orthographic chunks: never claim these are verified grammatical word boundaries.
 const chars=Array.from(lesson.sentence.hanzi);const chunks=[];
 const size=Math.max(2,Math.ceil(chars.length/4));
 for(let i=0;i<chars.length;i+=size)chunks.push(chars.slice(i,i+size).join(''));
 return chunks;
}
export function ladderQuestion(session){
 if(!session||!findLesson(session.lessonId)||!STAGES[session.cursor])return null;
 const lesson=findLesson(session.lessonId),word=lesson.words[session.wordIndex||0],stage=STAGES[session.cursor];
 if(stage==='word')return {stage,kind:'choice',prompt:`Which complete word means “${word.english}”?`,answer:word.hanzi,options:lesson.words.map(x=>x.hanzi),teaching:`${word.hanzi} · ${word.pinyin} · ${word.english}`};
 if(stage==='meaning')return {stage,kind:'choice',prompt:'What does this complete Chinese sentence mean?',hanzi:lesson.sentence.hanzi,answer:lesson.sentence.english,options:makeOptions(lesson.sentence.english,'sentence',lesson.id),teaching:`${lesson.sentence.hanzi} · ${lesson.sentence.pinyin} · ${lesson.sentence.english}`};
 if(stage==='order')return {stage,kind:'order',prompt:'Rebuild the original sentence by selecting each Chinese text chunk in order.',answer:lesson.sentence.hanzi,chunks:sentenceChunks(lesson.id),teaching:`${lesson.sentence.hanzi} · ${lesson.sentence.pinyin} · ${lesson.sentence.english}`};
 return {stage,kind:'pinyin',prompt:`Write the complete pronunciation of ${word.hanzi}, including lexical tones.`,hanzi:word.hanzi,answer:word.pinyin,teaching:`${word.hanzi} · ${word.pinyin} · ${word.english}`};
}
export function validateLadderExtensions(state){
 const events=state.ladderEvents;
 if(events!==undefined){
  if(!Array.isArray(events)||events.length>40000)throw Error('Invalid sentence ladder events');
  const ids=new Set();
  for(const e of events){if(!e||!validId(e.id)||ids.has(e.id)||!validId(e.sessionId)||!findLesson(e.lessonId)||!STAGES.includes(e.stage)||![0,1].includes(e.wordIndex)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!finiteTime(e.at))throw Error('Invalid sentence ladder event');ids.add(e.id);}
 }
 const s=state.ladderSession;
 if(s!==undefined&&s!==null){
  if(!s||!validId(s.id)||!findLesson(s.lessonId)||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>=STAGES.length||![0,1].includes(s.wordIndex)||typeof s.assistanceUsed!=='boolean'||!Array.isArray(s.selected)||new Set(s.selected).size!==s.selected.length||!finiteTime(s.startedAt))throw Error('Invalid sentence ladder checkpoint');
  const chunkCount=sentenceChunks(s.lessonId).length;
  if(!s.selected.every(i=>Number.isInteger(i)&&i>=0&&i<chunkCount)||s.selected.length>chunkCount)throw Error('Invalid sentence selection');
  if(s.cursor!==2&&s.selected.length)throw Error('Unexpected sentence selection');
  if(s.feedback!==null&&(typeof s.feedback!=='object'||typeof s.feedback.correct!=='boolean'||typeof s.feedback.assisted!=='boolean'||typeof s.feedback.message!=='string'||s.feedback.message.length>500))throw Error('Invalid sentence ladder feedback');
 }
 return true;
}
export function startLadder(state,lessonId,{id,at=Date.now()}={}){
 if(!findLesson(lessonId)||!validId(id)||!finiteTime(at))throw Error('Invalid ladder start');
 if(state.ladderSession)throw Error('Finish or discard the existing sentence ladder');
 const n=structuredClone(state),previous=(state.ladderEvents||[]).filter(e=>e.lessonId===lessonId&&e.stage==='tone');
 n.ladderSession={id,lessonId,cursor:0,wordIndex:previous.length%2,assistanceUsed:false,selected:[],feedback:null,startedAt:at};
 validateLadderExtensions(n);return n;
}
export function ladderSelect(state,index){
 const s=state.ladderSession;if(!s||s.cursor!==2||s.feedback||!Number.isInteger(index)||index<0||index>=sentenceChunks(s.lessonId).length||s.selected.includes(index))throw Error('Cannot select this sentence chunk');
 const n=structuredClone(state);n.ladderSession.selected.push(index);validateLadderExtensions(n);return n;
}
export function ladderUndo(state){
 const s=state.ladderSession;if(!s||s.cursor!==2||s.feedback||!s.selected.length)throw Error('Nothing to undo');
 const n=structuredClone(state);n.ladderSession.selected.pop();return n;
}
export function ladderHint(state){
 const s=state.ladderSession;if(!s||s.feedback)throw Error('No question awaiting a hint');
 const n=structuredClone(state);n.ladderSession.assistanceUsed=true;return n;
}
export function answerLadder(state,{id,response='',reveal=false,at=Date.now()}={}){
 const s=state.ladderSession,q=ladderQuestion(s);
 if(!q||s.feedback||!validId(id)||!finiteTime(at)||[...(state.ladderEvents||[])].some(e=>e.id===id))throw Error('Invalid or duplicate ladder answer');
 if(!reveal&&!String(response).trim()&&q.kind!=='order')throw Error('Answer required');
 let result;
 if(reveal)result={correct:false,message:'Reference revealed. The response is assisted.'};
 else if(q.kind==='order'){
  if(s.selected.length!==q.chunks.length)throw Error('Place every sentence chunk before checking');
  result={correct:normalize(s.selected.map(i=>q.chunks[i]).join(''))===normalize(q.answer),message:'This task checks the original written sentence, not every valid alternative wording.'};
 } else if(q.kind==='pinyin'){const checked=toneExplanation(response,q.answer);result={correct:checked.correct,message:checked.detail||checked.message,reason:checked.reason};}
 else result={correct:response===q.answer,message:response===q.answer?'Correct in this demonstrated context.':'This answer does not match the specific teaching example.'};
 const assisted=!!reveal||s.assistanceUsed,n=structuredClone(state);
 n.ladderEvents??=[];n.ladderEvents.push({id,sessionId:s.id,lessonId:s.lessonId,stage:q.stage,wordIndex:s.wordIndex,correct:!!result.correct,assisted,at});
 n.ladderSession.feedback={correct:!!result.correct,assisted,message:String(result.message).slice(0,500),reason:result.reason||''};
 validateLadderExtensions(n);return n;
}
export function advanceLadder(state){
 const s=state.ladderSession;if(!s?.feedback)throw Error('Check the current ladder question before advancing');
 const n=structuredClone(state);
 if(s.cursor===STAGES.length-1)n.ladderSession=null;
 else n.ladderSession={...s,cursor:s.cursor+1,assistanceUsed:false,selected:[],feedback:null};
 validateLadderExtensions(n);return n;
}
export function abandonLadder(state){const n=structuredClone(state);n.ladderSession=null;return n;}
export function ladderSummary(state,lessonId){
 if(!findLesson(lessonId))return null;
 const events=(state.ladderEvents||[]).filter(e=>e.lessonId===lessonId),last=events.at(-1),current=last?events.filter(e=>e.sessionId===last.sessionId):[];
 return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,assisted:events.filter(e=>e.assisted).length,misses:events.filter(e=>!e.correct).length,recent:STAGES.map(stage=>({stage,event:current.findLast(e=>e.stage===stage)||null})),active:state.ladderSession?.lessonId===lessonId};
}
/** Deterministic, explainable supplemental recommendation; it does not change due dates or grades. */
export function adaptiveLadderSuggestions(state,{limit=4}={}){
 return DEMO_LESSONS.map(lesson=>{
  const ls=ladderSummary(state,lesson.id),course=(state.courseEvents||[]).filter(e=>e.lessonId===lesson.id&&e.stage!=='completed'),repair=(state.courseRepairEvents||[]).filter(e=>e.lessonId===lesson.id);
  const failures=[...course,...repair,...(state.ladderEvents||[]).filter(e=>e.lessonId===lesson.id)].filter(e=>!e.correct||e.assisted);
  const lastSuccess=[...course,...repair,...(state.ladderEvents||[]).filter(e=>e.lessonId===lesson.id)].filter(e=>e.correct&&!e.assisted);
  const unresolved=failures.filter(e=>!lastSuccess.some(ok=>ok.stage===e.stage&&ok.at>=e.at));
  const reviewMisses=(state.events||[]).filter(e=>e.cardId.startsWith(lesson.id+':')&&e.grade<2);
  const score=Math.min(unresolved.length,8)*5+Math.min(reviewMisses.length,3)*2+(state.learned.includes(lesson.id)?0:1);
  const reason=unresolved.length?`${unresolved.length} unresolved assisted or incorrect skill attempts`:reviewMisses.length?'Previously missed scheduled reviews':ls.attempts===0?'Sentence Ladder not yet practiced':'Further connected practice';
  return {id:lesson.id,lesson,score,reason,unresolved:unresolved.length};
 }).sort((a,b)=>b.score-a.score||a.lesson.order-b.lesson.order).slice(0,Math.max(1,Math.min(limit,12)));
}
