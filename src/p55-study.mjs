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
const referenceIndex=(question)=>question?.evidenceIndex??question?.evidence??0;
export function p55Reference(id,kind='reading',index=0){
 const original=p55Source(id);if(!original)return null;
 const pool=kind==='dialogue'?original.dialogueQuestions||[]:original.questions||[];
 const q=pool[Math.max(0,Math.min(index,pool.length-1))];
 const sourceIndex=referenceIndex(q);
 const item=kind==='dialogue'?original.turns?.[sourceIndex]:original.lines?.[sourceIndex];
 return item?Object.freeze({question:q,kind,index:sourceIndex,
  hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,
  sourceIndex:item.sourceIndex??null,speaker:item.speaker??null}):null;
}
export function p55Evidence(state,id){
 const native=p55Native(id);
 if(!native)return {native:null,reading:[],listening:[]};
 return {native,
  reading:(state.readingEvents||[]).filter(e=>e.storyId===native.story?.id),
  listening:(state.dialogueEvents||[]).filter(e=>e.dialogueId===native.dialogue?.id)};
}
export const P55_PAIR_VOCAB_IDS=Object.freeze([
 'p54-register-02','p54-register-10','p54-register-04','p54-register-07',
 'p54-register-01','p54-register-11','p54-register-08','p54-register-12',
 'p54-register-09','p54-register-05','p54-register-08','p54-register-06'
]);
export const p55PairVocab=brief=>P54_REGISTER_PAIRS.find(p=>
 p.id===P55_PAIR_VOCAB_IDS[brief.sequence-1])||null;
export const p55NativeWords=brief=>{
 const pair=p55PairVocab(brief);
 return pair?[pair.left,pair.right].map(w=>({
  ...w,key:WORDS.find(x=>x.key===canonicalWordKey(w.hanzi,w.pinyin))?.key||null
 })): [];
};
export function p55BriefEvidence(state,brief){
 const left=p55Evidence(state,brief.from),right=p55Evidence(state,brief.to);
 const sentences=(state.sentenceEvents||[]).filter(x=>x.taskId==='p55:transfer:'+brief.id+':model');
 return {left,right,sentences,
  nativeAttempts:left.reading.length+left.listening.length+
   right.reading.length+right.listening.length+sentences.length};
}
function needsAttention(events){
 return events.length>0&&events.at(-1).correct===false;
}
export function p55Next(state,current=null){
 const start=Math.max(0,P55_BRIEFS.findIndex(x=>x.id===current));
 const order=current?[...P55_BRIEFS.slice(start+1),...P55_BRIEFS.slice(0,start+1)]:P55_BRIEFS;
 return order.find(b=>{const e=p55BriefEvidence(state,b);return needsAttention(e.left.reading)||
  needsAttention(e.left.listening)||needsAttention(e.right.reading)||needsAttention(e.right.listening);
 })||order.find(b=>{const e=p55BriefEvidence(state,b);
 return !e.left.reading.length||!e.left.listening.length||
  !e.right.reading.length||!e.right.listening.length;
 })||order[0];
}
/** Exact source IDs and their native route action only: no parallel reader. */
export const P55_ROUTE_BY_PHASE=Object.freeze({
 p50:'discourse50',p51:'register51',p52:'synthesis52',
 p53:'argument53',p54:'fluency54'
});
