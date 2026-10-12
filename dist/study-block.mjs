/** Batch 15 — checkpointed multi-lesson study blocks. Supplemental orchestration only.
 * Study blocks record their own milestones and NEVER call gradeCard or touch cards/events.
 */
import {DEMO_LESSONS, findLesson} from './demo-lessons.mjs';
import {adaptiveLadderSuggestions} from './sentence-ladder.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {personalizedBlockPlan} from './block-coach.mjs';

const validId=x=>typeof x==='string'&&x.length>0&&x.length<=100;
const validTime=x=>Number.isFinite(x)&&x>=0;
const KINDS=Object.freeze(['journey','ladder','contrast','pronunciation']);
export const BLOCK_KINDS=KINDS;
function attempts(state,kind,lessonId){return kind==='journey'?(state.courseEvents||[]).filter(e=>e.lessonId===lessonId&&e.stage==='completed').length:(state.ladderEvents||[]).filter(e=>e.lessonId===lessonId&&e.stage==='tone').length;}
export function selectBlockLessons(state,{focus='balanced',count=2}={}){
 if(!['balanced','weak','new'].includes(focus)||![2,3,4].includes(count))throw Error('Invalid block preferences');
 const newLessons=DEMO_LESSONS.filter(l=>!(state.courseEvents||[]).some(e=>e.lessonId===l.id&&e.stage==='completed'));
 const history=(state.courseEvents||[]).filter(e=>e.stage!=='completed');
 const struggling=DEMO_LESSONS.map(lesson=>{
  const recent=history.filter(e=>e.lessonId===lesson.id).slice(-12);
  const errors=recent.filter(e=>!e.correct||e.assisted).length;
  const lastGood=recent.filter(e=>e.correct&&!e.assisted).length;
  const missedReview=(state.events||[]).filter(e=>e.cardId.startsWith(lesson.id+':')&&e.grade<2).slice(-5).length;
  return {lesson,score:errors*3+missedReview*2-lastGood};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.lesson.order-b.lesson.order).map(x=>x.lesson);
 const extras=adaptiveLadderSuggestions(state,{limit:12}).filter(x=>x.unresolved>0).map(x=>x.lesson);
 const evidenceRank=focus==='weak'?personalizedBlockPlan(state,{focus:'weak',count:4}).filter(x=>x.unresolved.length||x.due).map(x=>x.lesson):[];
 const ordered=focus==='new'?[...newLessons,...struggling,...extras]:focus==='weak'?[...evidenceRank,...struggling,...extras,...newLessons]:[...struggling.slice(0,1),...newLessons,...struggling,...extras];
 const chosen=[];for(const l of [...ordered,...DEMO_LESSONS]){if(!chosen.some(x=>x.id===l.id))chosen.push(l);if(chosen.length===count)break;}
 return chosen;
}
export function validateBlockExtensions(state){
 const s=state.studyBlock;
 if(s!==undefined&&s!==null){
  if(!s||!validId(s.id)||!['balanced','weak','new'].includes(s.focus)||!Array.isArray(s.lessonIds)||s.lessonIds.length<2||s.lessonIds.length>4||new Set(s.lessonIds).size!==s.lessonIds.length||!s.lessonIds.every(id=>!!findLesson(id))||!validTime(s.startedAt)||!Array.isArray(s.steps)||s.steps.length!==s.lessonIds.length*2+2||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>=s.steps.length)throw Error('Invalid study block checkpoint');
  for(let i=0;i<s.steps.length;i++){const step=s.steps[i];if(!step||step.lessonId!==(i<s.lessonIds.length*2?s.lessonIds[Math.floor(i/2)]:s.lessonIds.at(-1))||step.kind!==(i<s.lessonIds.length*2?KINDS[i%2]:KINDS[2+i-s.lessonIds.length*2])||!Number.isSafeInteger(step.baseline)||step.baseline<0)throw Error('Invalid study block step');}
 }
 if(s!==undefined&&s!==null&&(typeof s.assistanceUsed!=='boolean'||(s.feedback!==null&&s.feedback!==undefined&&(!s.feedback||typeof s.feedback.correct!=='boolean'||typeof s.feedback.assisted!=='boolean'||typeof s.feedback.message!=='string'||s.feedback.message.length>500))))throw Error('Invalid cross-lesson checkpoint');
 if(state.studyBlockEvents!==undefined){
  if(!Array.isArray(state.studyBlockEvents)||state.studyBlockEvents.length>20000)throw Error('Invalid study block history');
  const ids=new Set();for(const e of state.studyBlockEvents){if(!e||!validId(e.id)||ids.has(e.id)||!validId(e.blockId)||!['step','check','finished','abandoned'].includes(e.type)||!validTime(e.at)|| (e.type==='step'&&(!findLesson(e.lessonId)||!KINDS.includes(e.kind)))||(e.type==='check'&&(!findLesson(e.lessonId)||!['contrast','pronunciation'].includes(e.kind)||!Number.isInteger(e.stepIndex)||e.stepIndex<0||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean')))throw Error('Invalid study block event');ids.add(e.id);}
 }
 return true;
}
export function startBlock(state,{id,focus='balanced',count=2,at=Date.now(),lessonIds=null}={}){
 if(state.studyBlock||!validId(id)||!validTime(at)||!['balanced','weak','new'].includes(focus)||![2,3,4].includes(count))throw Error('Cannot start study block');
 const lessons=lessonIds||selectBlockLessons(state,{focus,count}).map(l=>l.id);
 if(!Array.isArray(lessons)||lessons.length!==count||new Set(lessons).size!==count||!lessons.every(id=>!!findLesson(id)))throw Error('Invalid study block lesson selection');
 const n=structuredClone(state);n.studyBlock={id,focus,lessonIds:[...lessons],cursor:0,startedAt:at,assistanceUsed:false,feedback:null,steps:[...lessons.flatMap(lessonId=>KINDS.slice(0,2).map(kind=>({lessonId,kind,baseline:attempts(state,kind,lessonId)}))),...KINDS.slice(2).map(kind=>({lessonId:lessons.at(-1),kind,baseline:0}))]};
 validateBlockExtensions(n);return n;
}
export function blockCurrent(state){const s=state.studyBlock;if(!s)return null;const step=s.steps[s.cursor];return {...step,index:s.cursor,total:s.steps.length,lesson:findLesson(step.lessonId)};}
export function blockStepReady(state){const step=blockCurrent(state);if(!step)return false;
 if(step.kind==='contrast'||step.kind==='pronunciation')return (state.studyBlockEvents||[]).some(e=>e.type==='check'&&e.blockId===state.studyBlock.id&&e.stepIndex===step.index);
 if(step.kind==='journey'&&state.courseJourney?.lessonId===step.lessonId)return false;
 if(step.kind==='ladder'&&state.ladderSession?.lessonId===step.lessonId)return false;
 return attempts(state,step.kind,step.lessonId)>step.baseline;
}
export function advanceBlock(state,{id,at=Date.now()}={}){
 if(!blockStepReady(state)||!validId(id)||!validTime(at)||(state.studyBlockEvents||[]).some(e=>e.id===id))throw Error('Finish this lesson activity before advancing the study block');
 const n=structuredClone(state),step=blockCurrent(state);n.studyBlockEvents??=[];
 n.studyBlockEvents.push({id,blockId:n.studyBlock.id,type:'step',lessonId:step.lessonId,kind:step.kind,at});
 if(n.studyBlock.cursor+1===n.studyBlock.steps.length){n.studyBlockEvents.push({id:`${id}:finish`,blockId:n.studyBlock.id,type:'finished',at});n.studyBlock=null;n.blockTrail=null;}
 else {n.studyBlock.cursor++;n.studyBlock.assistanceUsed=false;n.studyBlock.feedback=null;}
 validateBlockExtensions(n);return n;
}
export function abandonBlock(state,{id,at=Date.now()}={}){
 if(!state.studyBlock||!validId(id)||!validTime(at))throw Error('No study block in progress');const n=structuredClone(state);n.studyBlockEvents??=[];n.studyBlockEvents.push({id,blockId:n.studyBlock.id,type:'abandoned',at});n.studyBlock=null;n.blockTrail=null;validateBlockExtensions(n);return n;
}
export function blockStatistics(state){const ev=state.studyBlockEvents||[];const finished=new Set(ev.filter(e=>e.type==='finished').map(e=>e.blockId));return {finished:finished.size,steps:ev.filter(e=>e.type==='step').length,active:!!state.studyBlock,remaining:state.studyBlock?state.studyBlock.steps.length-state.studyBlock.cursor:0};}
export function blockSkillEvidence(state){const s=state.studyBlock;if(!s)return [];
 return s.lessonIds.map(id=>{const course=(state.courseEvents||[]).filter(e=>e.lessonId===id&&e.stage!=='completed'),ladder=(state.ladderEvents||[]).filter(e=>e.lessonId===id);
 const attempts=[...course,...ladder],independent=attempts.filter(e=>e.correct&&!e.assisted).length,mistakes=attempts.filter(e=>!e.correct||e.assisted).length;
 return {lessonId:id,attempts:attempts.length,independent,mistakes};});
}

/** Two cross-lesson checks; historical answers are supplemental and cannot grade the scheduler. */
export function blockBridgeQuestion(state){const s=state.studyBlock,step=blockCurrent(state);if(!s||!step||!['contrast','pronunciation'].includes(step.kind))return null;
 const lesson=findLesson(s.lessonIds.at(-1)),other=findLesson(s.lessonIds[0]);
 if(step.kind==='contrast'){
  const answer=lesson.sentence.english,others=[other.sentence.english,...DEMO_LESSONS.filter(l=>l.id!==lesson.id&&l.id!==other.id).slice(0,3).map(l=>l.sentence.english)];
  const rank=x=>[...x].reduce((h,c)=>((h*33+c.codePointAt(0))>>>0),lesson.order*31);
  const options=[answer,...new Set(others.filter(x=>x!==answer))].slice(0,4).sort((a,b)=>rank(a)-rank(b));
  return {kind:'choice',prompt:'Which English meaning matches this complete Chinese sentence?',hanzi:lesson.sentence.hanzi,answer,options,teaching:`${lesson.sentence.hanzi} · ${lesson.sentence.pinyin} · ${answer}`};
 }
 const word=lesson.words[1];return {kind:'pinyin',prompt:'Recall the complete pronunciation of this vocabulary word, including its lexical tones.',hanzi:word.hanzi,answer:word.pinyin,teaching:`${word.hanzi} · ${word.pinyin} · ${word.english}`};
}
export function useBlockHint(state){const q=blockBridgeQuestion(state);if(!q||state.studyBlock.feedback)throw Error('No unanswered cross-lesson checkpoint');const n=structuredClone(state);n.studyBlock.assistanceUsed=true;return n;}
export function answerBlockBridge(state,{id,response='',reveal=false,at=Date.now()}={}){
 const q=blockBridgeQuestion(state),s=state.studyBlock,step=blockCurrent(state);
 if(!q||s.feedback||blockStepReady(state)||!validId(id)||!validTime(at)||(state.studyBlockEvents||[]).some(e=>e.id===id)||(!reveal&&!String(response).trim()))throw Error('Invalid cross-lesson answer');
 const result=reveal?{correct:false,message:'Answer revealed; independent recall not credited'}:q.kind==='pinyin'?toneExplanation(response,q.answer):{correct:response===q.answer,message:response===q.answer?'Correct in this demonstrated context.':'Check the complete contextual sentence meaning.'};
 const n=structuredClone(state),assisted=!!reveal||s.assistanceUsed;
 n.studyBlockEvents??=[];n.studyBlockEvents.push({id,blockId:s.id,type:'check',stepIndex:s.cursor,lessonId:step.lessonId,kind:step.kind,correct:!!result.correct,assisted,at});
 n.studyBlock.feedback={correct:!!result.correct,assisted,message:String(result.detail||result.message||'Check the reference').slice(0,500)};
 validateBlockExtensions(n);return n;
}
