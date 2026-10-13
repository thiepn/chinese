/** P49 review suggestions inspect historical native learner events.
 * No duplicate score, mastery state, scheduler, dates or data writers.
 */
import {P49_CASES} from './p49-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {STORIES} from './stories.mjs';
import {dueCards} from './study.mjs';
const latest=(events,predicate)=>[...(events||[])].reverse().find(predicate)||null;
export const p49NativeDialogue=c=>DIALOGUES.find(d=>d.p49?.id===c.id)||null;
export function p49LinkedSource(c){
 const story=STORIES.find(s=>s.beginner?.[c.sourceType]?.id===c.sourceId)||null;
 const dialogue=DIALOGUES.find(d=>d[c.sourceType]?.id===c.sourceId)||null;
 return {story,dialogue,source:c.linked};
}
export function p49Evidence(state,c){
 const native=p49NativeDialogue(c);
 const linked=p49LinkedSource(c),dEvents=state.dialogueEvents||[],rEvents=state.readingEvents||[];
 const ownEvents=dEvents.filter(e=>e.dialogueId===native?.id);
 const historicalDialogue=latest(dEvents,e=>e.dialogueId===linked.dialogue?.id);
 const historicalReading=latest(rEvents,e=>e.storyId===linked.story?.id);
 const byQuestion=c.questions.map((q,i)=>{
  const event=latest(ownEvents,e=>e.question===i);
  return Object.freeze({
   index:i,question:q,event,
   needsRepair:!!event&&(!event.correct||event.assisted),
   independentlyCorrect:ownEvents.some(e=>e.question===i&&e.correct&&!e.assisted)
  });
 });
 const writing=(state.sentenceEvents||[]).filter(e=>e.taskId?.startsWith('p49:'+c.id+':'));
 const difficult=byQuestion.filter(q=>q.needsRepair);
 const priorProblem=[historicalReading,historicalDialogue].filter(e=>e&&(!e.correct||e.assisted));
 return Object.freeze({
  native,linked,byQuestion,ownEvents,writing,
  historicalReading,historicalDialogue,difficult,priorProblem,
  unattempted:byQuestion.filter(q=>!q.event),
  independentCount:byQuestion.filter(q=>q.independentlyCorrect).length
 });
}
export function p49Recommendations(state,{limit=12}={}){
 const due=dueCards(state);
 const records=P49_CASES.map(c=>{
  const evidence=p49Evidence(state,c);
  const priority=evidence.difficult.length*95+
   evidence.priorProblem.length*30+
   (evidence.ownEvents.length===0?28:0)+
   evidence.unattempted.length*10+
   (evidence.writing.some(x=>!x.correct||x.assisted)?12:0);
  const reason=evidence.difficult.length?
   'Retry native missed or assisted questions without a model':
   evidence.priorProblem.length?
   'Repair an observed difficulty from the connected original source':
   evidence.unattempted.length?
   'Attempt original questions not yet answered in this case':
   'Reconstruct a source model, then transfer to an unseen context';
  const nextQuestion=evidence.difficult[0]?.index??evidence.unattempted[0]?.index??0;
  return Object.freeze({caseItem:c,evidence,priority,reason,nextQuestion,
   globalDue:due.length});
 });
 return Object.freeze(records.sort((a,b)=>b.priority-a.priority||
  a.caseItem.sequence-b.caseItem.sequence).slice(0,limit));
}
export function p49Totals(state){
 const recommendations=p49Recommendations(state);
 return Object.freeze({
  cases:P49_CASES.length,
  attempted:recommendations.filter(r=>r.evidence.ownEvents.length>0).length,
  questionsAttempted:recommendations.reduce((n,r)=>n+r.evidence.byQuestion.filter(q=>q.event).length,0),
  independentReferenceAnswers:recommendations.reduce((n,r)=>n+r.evidence.independentCount,0),
  recordedWriting:recommendations.reduce((n,r)=>n+r.evidence.writing.length,0),
  due:dueCards(state).length
 });
}
