/** Original-demo contextual activities for guided sessions. Not HSK or scheduled mastery. */
import {SENSE_CASES,evaluateSense,addSenseEvent} from './sense-lab.mjs';
import {SENTENCE_TASKS,checkSentence,addSentenceEvent} from './sentence-workshop.mjs';
import {DIALOGUES,findDialogue} from './dialogues.mjs';
import {missionQuestion,gradeMission,addMissionEvent} from './dialogue-missions.mjs';
import {findStory} from './stories.mjs';
export const CONNECTED_TYPES=Object.freeze(['sense','sentence','mission']);
export function validConnectedItem(item){
 if(!item||typeof item!=='object')return false;
 if(item.type==='sense')return SENSE_CASES.some(c=>c.id===item.id)&&item.mode==='meaning';
 if(item.type==='sentence')return SENTENCE_TASKS.some(t=>t.id===item.id)&&item.mode==='reconstruct';
 if(item.type==='mission')return !!findDialogue(item.id)&&Number.isInteger(item.step)&&item.step>=0&&item.step<=2&&item.mode==='dialogue';
 return false;
}
export function connectedQuestion(item){
 if(!validConnectedItem(item))throw Error('Unapproved contextual exercise');
 if(item.type==='sense'){
  const c=SENSE_CASES.find(x=>x.id===item.id);
  return {kind:'choice',prompt:`What does ${c.target} mean in this sentence?`,hanzi:c.hanzi,options:c.options,answer:c.answer,explanation:c.explanation,sourceType:'sense',sourceId:c.id,mode:item.mode,contextPinyin:c.pinyin,contextEnglish:c.english};
 }
 if(item.type==='sentence'){
  const task=SENTENCE_TASKS.find(t=>t.id===item.id);
  return {kind:'hanzi',prompt:`Reconstruct the exact Chinese sentence: ${task.english}`,answer:task.hanzi,explanation:'This checks exact written reconstruction, not all possible Chinese translations.',sourceType:'sentence',sourceId:task.id,mode:item.mode,contextPinyin:task.pinyin,contextEnglish:task.english,storyId:task.storyId};
 }
 const q=missionQuestion(item.id,item.step);
 return {...q,sourceType:'mission',sourceId:item.id,mode:item.mode,missionStep:item.step,explanation:q.explanation||'Find evidence in the conversation.',dialogue:findDialogue(item.id)};
}
export function gradeConnected(item,response){
 const q=connectedQuestion(item);
 if(item.type==='sense')return evaluateSense(item.id,response);
 if(item.type==='sentence')return checkSentence(SENTENCE_TASKS.find(t=>t.id===item.id),response);
 return gradeMission(q,response);
}
export function recordConnectedAttempt(state,item,{eventId,correct,assisted,now=Date.now()}){
 if(!validConnectedItem(item)||typeof eventId!=='string'||!eventId||eventId.length>100||typeof correct!=='boolean'||typeof assisted!=='boolean')throw Error('Invalid connected attempt');
 if(item.type==='sense')return addSenseEvent(state,{id:eventId,caseId:item.id,correct,assisted,at:now});
 if(item.type==='sentence')return addSentenceEvent(state,{id:eventId,taskId:item.id,correct,assisted,at:now});
 return addMissionEvent(state,{id:eventId,dialogueId:item.id,step:item.step,correct,assisted,at:now});
}
// Evidence is supplemental. A correct assisted attempt never cancels an independently missed target.
export function contextualWeaknesses(state){
 const groups=[
  ['sense',SENSE_CASES.map(c=>({type:'sense',id:c.id,mode:'meaning'})),state.senseEvents||[],e=>e.caseId],
  ['sentence',SENTENCE_TASKS.map(t=>({type:'sentence',id:t.id,mode:'reconstruct'})),state.sentenceEvents||[],e=>e.taskId],
  ['mission',DIALOGUES.flatMap(d=>[0,1,2].map(step=>({type:'mission',id:d.id,step,mode:'dialogue'}))),state.missionEvents||[],e=>`${e.dialogueId}:${['meaning','evidence','pinyin'].indexOf(e.stage)}`]
 ];
 const results=[];
 for(const [kind,items,events,key] of groups){
  const byKey=new Map();for(const e of events){const k=key(e);const previous=byKey.get(k)||{miss:0,correct:0,last:0};if(!e.correct)previous.miss++;if(e.correct&&!e.assisted)previous.correct++;previous.last=Math.max(previous.last,e.at);byKey.set(k,previous);}
  for(const item of items){const id=item.type==='mission'?`${item.id}:${item.step}`:item.id;const v=byKey.get(id)||{miss:0,correct:0,last:0};const unresolved=Math.max(0,v.miss-v.correct);results.push({...item,weakness:unresolved*5+(v.miss?1:0)+(v.correct===0?2:0),attempted:!!v.last,kind});}
 }
 return results.sort((a,b)=>b.weakness-a.weakness||Number(a.attempted)-Number(b.attempted)||a.type.localeCompare(b.type)||a.id.localeCompare(b.id));
}
export function contextualProgress(state){const rows=[['Word senses',state.senseEvents||[]],['Sentence writing',state.sentenceEvents||[]],['Dialogue reasoning',state.missionEvents||[]]];
 return rows.map(([name,events])=>({name,attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,misses:events.filter(e=>!e.correct).length}));
}
