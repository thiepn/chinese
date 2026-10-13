/** P45 source-honest cumulative review routing.
 * Read-only derivations of original state, dueCards, dialogueEvents,
 * readingEvents and sentenceEvents. Never schedules a fake card or writes state.
 */
import {P45_TRANSFERS} from './p45-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {STORIES} from './stories.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {dueCards} from './study.mjs';

const latest=(events,predicate)=>{
 let last=null;
 for(const e of events||[])if(predicate(e)&&(!last||e.at>=last.at))last=e;
 return last;
};
const status=event=>!event?'not attempted':event.correct&&!event.assisted?
 'last answer correct independently':event.correct?'last correct response assisted':'last answer incorrect';
export function p45EvidenceFor(state,caseItem){
 const related=caseItem.sourceCase||null;
 const p45Dialogue=DIALOGUES.find(d=>d.p45?.id===caseItem.id);
 const p44Dialogue=DIALOGUES.find(d=>d.p44?.id===related?.id);
 const p42Dialogue=DIALOGUES.find(d=>d.p42?.id===related?.dialogueId);
 const story=STORIES.find(s=>s.beginner?.p41?.id===related?.readingId);
 const dialogueEvents=state.dialogueEvents||[],readingEvents=state.readingEvents||[],
       sentenceEvents=state.sentenceEvents||[];
 const events=[
  {name:'P45 independent transfer',event:latest(dialogueEvents,e=>e.dialogueId===p45Dialogue?.id),source:'p45'},
  {name:'P44 integrated conversation',event:latest(dialogueEvents,e=>e.dialogueId===p44Dialogue?.id),source:'p44'},
  {name:'P42 spoken conversation',event:latest(dialogueEvents,e=>e.dialogueId===p42Dialogue?.id),source:'p42'},
  {name:'P41 source reading',event:latest(readingEvents,e=>e.storyId===story?.id),source:'p41'},
  {name:'P45 exact written transfer',event:latest(sentenceEvents,e=>e.taskId==='p45:'+caseItem.id+':response'),source:'write'}
 ].map(item=>Object.freeze({...item,status:status(item.event)}));
 const studiedCharacters=P39_CHARACTER_GUIDES.filter(g=>
  caseItem.turns.some(t=>t.hanzi.includes(g.hanzi))).slice(0,8);
 const relevantLessons=new Set(studiedCharacters.map(g=>g.id));
 const due=new Set(dueCards(state));
 const dueIds=[...due].filter(id=>relevantLessons.has(id.split(':')[0]));
 const missed=events.filter(x=>x.event&&(!x.event.correct||x.event.assisted));
 const independent=events.filter(x=>x.event?.correct&&!x.event.assisted);
 return Object.freeze({
  events:Object.freeze(events),dueCards:Object.freeze(dueIds),
  missed:Object.freeze(missed),independent:Object.freeze(independent),
  p45DialogueId:p45Dialogue?.id||null,
  reason:missed.length?missed.map(e=>e.name+' ('+e.status+')').join('; '):
   dueIds.length?dueIds.length+' scheduled P39 card(s) due in original Review':
   !events.some(e=>e.event)?'No recorded source-linked attempts yet':
   'Revisit in a different context; no scheduled P45 due date exists'
 });
}
export function p45Recommendations(state,{limit=18}={}){
 const rows=P45_TRANSFERS.map((c,i)=>{
  const ev=p45EvidenceFor(state,c);
  const direct=ev.events[0];
  const priority=(direct.event&&!direct.event.correct?100:0)+
    (direct.event?.assisted?80:0)+
    (ev.missed.length?45:0)+(ev.dueCards.length?24:0)+
    (!direct.event?20:0)+(ev.independent.length===0?10:0);
  const action=direct.event&&(!direct.event.correct||direct.event.assisted)?
    'Retry the P45 source-evidence question without assistance':
    ev.dueCards.length?'Review scheduled P39 cards in the original review queue':
    ev.missed.length?'Return to the linked source that showed difficulty':
    !direct.event?'Try a new integrated independent transfer':
    'Apply the same concept to another case, without claiming mastery';
  return Object.freeze({caseItem:c,evidence:ev,priority,action,order:i});
 });
 return rows.sort((a,b)=>b.priority-a.priority||a.order-b.order)
   .slice(0,Math.max(0,Math.min(P45_TRANSFERS.length,limit)));
}
export function p45Summary(state){
 const events=state.dialogueEvents||[];
 const ids=new Set(DIALOGUES.filter(d=>d.p45).map(d=>d.id));
 const relevant=events.filter(e=>ids.has(e.dialogueId));
 const independentCases=new Set(relevant.filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 return Object.freeze({attempts:relevant.length,casesAttempted:new Set(relevant.map(e=>e.dialogueId)).size,
  casesWithIndependentCorrect:independentCases.size});
}
