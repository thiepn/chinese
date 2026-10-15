/** P55 read-only orchestration of original advanced P50–P54 sources.
 * Existing Reader, Dialogue, Sentence Workshop and P43 own every attempted
 * answer, learner draft or grade. This module neither stores nor grades.
 */
import {P55_BRIEFS} from './p55-briefs.mjs';
import {P50_PASSAGES} from './p50-readings.mjs';
import {P51_PASSAGES} from './p51-readings.mjs';
import {P52_CASES} from './p52-course.mjs';
import {P53_CASES} from './p53-course.mjs';
import {P54_CASES} from './p54-course.mjs';
import {P54_REGISTER_PAIRS} from './p54-register.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
export const P55_CATALOG=Object.freeze([...P50_PASSAGES,...P51_PASSAGES,
 ...P52_CASES,...P53_CASES,...P54_CASES]);
const byId=new Map(P55_CATALOG.map(x=>[x.id,x]));
export const p55Source=id=>byId.get(id)||null;
const caseDialogue=(phase,c)=>DIALOGUES.find(d=>{
 const meta=d[phase];return meta&&(meta.readingId===c.id||meta.caseId===c.id);
})||null;
export function p55Native(id){
 const c=p55Source(id);if(!c)return null;
 const phase=c.id.split('-')[0];
 const story=STORIES.find(x=>x.beginner?.[phase]?.id===c.id)||null;
 const dialogue=caseDialogue(phase,c);
 return {case:c,phase,story,dialogue};
}
/** A native dialogue may have original comprehension questions but no
 * line-level source index. Never invent a turn citation in that case.
 */
export function p55Reference(id,kind='reading',index=0){
 const original=p55Source(id),native=p55Native(id);
 if(!original)return null;
 const authoredDialogue=native?.dialogue?.[original.id.split('-')[0]]?.questions;
 const pool=kind==='dialogue'?
  (original.dialogueQuestions?.length?original.dialogueQuestions:
   authoredDialogue?.length?authoredDialogue:native?.dialogue?.questions||[]):
  original.questions||[];
 if(!Number.isInteger(index)||index<0||index>=pool.length)return null;
 const q=pool[index];
 // P50/P51 original dialogue metadata carries exact evidenceIndex, while
 // generic DIALOGUES questions are answer-only and lose the turn citation.
 // P52–P54 already provide their own sourced dialogueQuestions/turns.
 const explicit=q.evidenceIndex??q.evidence;
 const sourceIndex=Number.isInteger(explicit)&&explicit>=0?explicit:null;
 const lines=kind==='dialogue'?
  (original.turns?.length?original.turns:native?.dialogue?.lines):original.lines;
 const item=sourceIndex===null?null:lines?.[sourceIndex];
 return Object.freeze({question:q,kind,questionIndex:index,index:item?sourceIndex:null,
  hanzi:item?.hanzi||null,pinyin:item?.pinyin||null,english:item?.english||null,
  sourceIndex:item?.sourceIndex??null,speaker:item?.speaker??null,
  sourceLabel:item&&Number.isInteger(item.sourceIndex)?original.sources?.[item.sourceIndex]?.name||null:null,
  evidenceIndexed:Boolean(item)});
}
export function p55Evidence(state,id){
 const native=p55Native(id);
 if(!native)return {native:null,reading:[],listening:[]};
 return {native,
  reading:(state.readingEvents||[]).filter(e=>e.storyId===native.story?.id),
  listening:(state.dialogueEvents||[]).filter(e=>e.dialogueId===native.dialogue?.id)};
}
/** Only native events can establish a real submitted answer. Reading records
 * retain a mode but not the selected option; never infer a distractor.
 */
const ORIGINAL_READER_MODES=Object.freeze(['beginner-detail','beginner-reason','beginner-sequence']);
export function p58CanonicalQuestionResult(evidence,kind,index){
 if(!Number.isInteger(index)||index<0||index>=3)return null;
 const events=kind==='reading'?evidence.reading:evidence.listening;
 const relevant=kind==='reading'?
  events.filter(x=>x.mode===ORIGINAL_READER_MODES[index]):
  events.filter(x=>x.question===index);
 return relevant.at(-1)||null;
}
export function p58SourceQuestionCount(id,kind){
 const c=p55Source(id);if(!c)return 0;
 if(kind==='reading')return c.questions?.length||0;
 return c.dialogueQuestions?.length||p55Native(id)?.dialogue?.questions?.length||0;
}
export const P55_PAIR_VOCAB_IDS=Object.freeze([
 'p54-register-02','p54-register-10','p54-register-04','p54-register-07',
 'p54-register-01','p54-register-11','p54-register-08','p54-register-12',
 'p54-register-09','p54-register-05','p54-register-08','p54-register-06'
]);
export const p55PairVocab=brief=>P54_REGISTER_PAIRS.find(p=>
 p.id===P55_PAIR_VOCAB_IDS[brief.sequence-1])||null;
/** Prefer words demonstrably present in the *chosen original readings*.
 * Context examples retain exact historical source sentences; no inferred
 * dictionary etymologies, fabricated source references, or new word IDs.
 */
function sourceAttestedWords(id){
 const original=p55Source(id);if(!original)return [];
 const sentences=original.lines||[];
 return WORDS.filter(w=>[...w.hanzi].length>=2&&[...w.hanzi].length<=5&&
  sentences.some(line=>line.hanzi.includes(w.hanzi)))
  .map(w=>{
   const i=sentences.findIndex(line=>line.hanzi.includes(w.hanzi));
   const line=sentences[i];
   return {hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.senses[0]||'Canonical Wordbook entry',
    key:w.key,sourceId:id,lineIndex:i,context:line,attested:true};
  })
  .sort((a,b)=>b.hanzi.length-a.hanzi.length||a.lineIndex-b.lineIndex);
}
export const p55NativeWords=brief=>{
 if(!brief)return [];
 const first=sourceAttestedWords(brief.from),second=sourceAttestedWords(brief.to);
 const primary=[];
 if(first.length)primary.push(first[0]);
 if(second.length&&!primary.some(w=>w.key===second[0].key))
  primary.push(second[0]);
 for(const candidate of [...first.slice(1),...second.slice(1)])
  if(primary.length<4&&!primary.some(w=>w.key===candidate.key))primary.push(candidate);
 // The earlier P54 register contrast is an optional teaching reference only,
 // never falsely presented as attested in the two historical readings.
 if(primary.length>=2)return primary.slice(0,4);
 const contrast=p55PairVocab(brief);
 const fallback=contrast?[contrast.left,contrast.right].map(w=>{
  const key=canonicalWordKey(w.hanzi,w.pinyin);
  return {...w,key:WORDS.find(x=>x.key===key)?.key||null,
   sourceId:null,lineIndex:null,context:null,attested:false};
 }):[];
 return [...primary,...fallback.filter(w=>w.key&&!primary.some(x=>x.key===w.key))]
  .slice(0,4);
};
export function p55BriefEvidence(state,brief){
 const left=p55Evidence(state,brief.from),right=p55Evidence(state,brief.to);
 const sentences=(state.sentenceEvents||[]).filter(x=>x.taskId==='p55:transfer:'+brief.id+':model');
 return {left,right,sentences,
  nativeAttempts:left.reading.length+left.listening.length+
   right.reading.length+right.listening.length+sentences.length};
}
/** Read-only suggestions per actual canonical question, not one event per
 * whole passage. Missing Reader/Dialogue modules do not become phantom tasks.
 * This is navigation guidance, never a mastery or completion score.
 */
export function p59NativePending(state,brief){
 const groups=[brief.from,brief.to].map(id=>p55Evidence(state,id));
 const tasks=[];
 for(const e of groups){
  const native=e.native;if(!native)continue;
  if(native.story){
   for(let i=0;i<Math.min(ORIGINAL_READER_MODES.length,p58SourceQuestionCount(native.case.id,'reading'));i++){
    const mode=ORIGINAL_READER_MODES[i];
    tasks.push({sourceId:native.case.id,kind:'reading',question:i,
     event:e.reading.filter(x=>x.mode===mode).at(-1)||null});
   }
  }
  if(native.dialogue){
   for(let i=0;i<Math.min(3,p58SourceQuestionCount(native.case.id,'dialogue'));i++)
    tasks.push({sourceId:native.case.id,kind:'dialogue',question:i,
     event:e.listening.filter(x=>x.question===i).at(-1)||null});
  }
 }
 const next=tasks.find(x=>x.event&&(!x.event.correct||x.event.assisted))||
  tasks.find(x=>!x.event)||null;
 return Object.freeze({available:tasks.length,
  needsRepair:tasks.filter(x=>x.event&&(!x.event.correct||x.event.assisted)).length,
  untried:tasks.filter(x=>!x.event).length,
  next:next?Object.freeze({sourceId:next.sourceId,kind:next.kind,question:next.question}):null});
}
export function p55Next(state,current=null){
 const start=P55_BRIEFS.findIndex(x=>x.id===current);
 const order=start<0?P55_BRIEFS:
  [...P55_BRIEFS.slice(start+1),...P55_BRIEFS.slice(0,start+1)];
 return order.find(b=>p59NativePending(state,b).needsRepair>0)||
  order.find(b=>p59NativePending(state,b).untried>0)||
  order[0]||null;
}
/** Exact source IDs and their native route action only: no parallel reader. */
export const P55_ROUTE_BY_PHASE=Object.freeze({
 p50:'discourse50',p51:'register51',p52:'synthesis52',
 p53:'argument53',p54:'fluency54'
});
