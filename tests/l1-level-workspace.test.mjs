import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,addLesson,dueCards,cardsForLesson,gradeCard} from '../src/study.mjs';
import {addReadingEvent} from '../src/reader-records.mjs';
import {addDialogueEvent} from '../src/dialogues.mjs';
import {addSentenceEvent} from '../src/sentence-workshop.mjs';
import {reviewPlan} from '../src/review-strategy.mjs';
import {hskTargetLessons,hskTargetPractice,renderC9HSKTargets,HSK_TARGETS} from '../src/hsk-targets-c9.mjs';
import {levelWorkspaceEvidence} from '../src/hsk-level-workspace-c9.mjs';

const action=(name,label,cls='',extra='')=>'<button class="'+cls+'" data-action="'+name+'" '+extra+'>'+label+'</button>';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const evidence=(state,level,now)=>levelWorkspaceEvidence(state,{lessons:hskTargetLessons(level),...hskTargetPractice(level)},now);

test('L1: all seven targets contain complete nested native course sections without competing activity tabs',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const target of HSK_TARGETS){
  const html=renderC9HSKTargets(state,target.id,action,esc,{now:1e9});
  assert.ok(html.includes(target.name+' course'));
  assert.ok(html.includes('provisional original difficulty target'));
  assert.ok(!html.includes('data-action="c9-level-pane"'),'Duplicate course activity tabs are not needed');
  for(const title of ['1. Course lessons','2. Vocabulary','3. Grammar and sentences','4. Reading','5. Listening and conversation'])
   assert.ok(html.includes(title),title);
  assert.ok(html.includes('c9-course-review'),'Original scheduled review must remain separate');
  assert.ok(html.includes('data-action="c9-hsk-back"'));
 }
 assert.equal(JSON.stringify(state),before);
});
test('L1: scheduled due and introduced counts are truly level-specific and grade authority remains original',()=>{
 const now=1_000_000_000;
 const first=hskTargetLessons('1')[0],fifth=hskTargetLessons('5')[0];
 const a=addLesson(addLesson(freshState(),first.id,now),fifth.id,now);
 const card1=cardsForLesson(first.id)[0],card5=cardsForLesson(fifth.id)[0];
 assert.ok(dueCards(a,now).includes(card1));
 assert.ok(dueCards(a,now).includes(card5));
 const e1=evidence(a,'1',now),e5=evidence(a,'5',now);
 assert.equal(e1.introduced,1);
 assert.equal(e5.introduced,1);
 assert.equal(e1.due,cardsForLesson(first.id).length);
 assert.equal(e5.due,cardsForLesson(fifth.id).length);
 assert.ok(e1.dueIds.every(id=>id.startsWith(first.id+':')));
 assert.ok(e5.dueIds.every(id=>id.startsWith(fifth.id+':')));
 const q=reviewPlan(a,{now,focus:'all',limit:50,lessonIds:new Set([fifth.id])});
 assert.ok(q.length>0&&q.every(x=>x.id.startsWith(fifth.id+':')));
 assert.equal(reviewPlan(a,{now,focus:'all',limit:50}).length,e1.due+e5.due,'Unscoped review must be unchanged');
 const graded=gradeCard(a,card5,2,now,'l1-review', {correct:true,assisted:false});
 assert.equal(evidence(graded,'5',now).due,e5.due-1);
 assert.equal(evidence(graded,'1',now).due,e1.due);
 assert.equal(evidence(graded,'5',now).independentReview,1);
 assert.equal(graded.events.at(-1).cardId,card5);
 assert.equal(a.events.length,0,'Rendering or selecting a level never records a grade');
});
test('L1: original reading, dialogue and grammar attempts drive visible skill evidence, not synthetic mastery',()=>{
 const now=1_000_000_000;
 const sources=hskTargetPractice('3');
 const reading=sources.readings[0],dialogue=sources.dialogues[0],grammar=sources.grammar[0];
 const base=freshState(),before=JSON.stringify(base);
 let s=addReadingEvent(base,reading.id,'comprehension',true,false,'l1-reading',now);
 s=addDialogueEvent(s,{id:'l1-dialogue',dialogueId:dialogue.id,question:0,answer:dialogue.questions[0].answer,at:now+1});
 s=addSentenceEvent(s,{id:'l1-grammar',taskId:'grammar:'+grammar.id+':meaning',correct:false,assisted:false,at:now+2});
 let e=evidence(s,'3',now+3);
 assert.equal(e.readingAttempts,1);
 assert.equal(e.independentReadings,1);
 assert.equal(e.dialogueAttempts,1);
 assert.equal(e.independentDialogues,1);
 assert.equal(e.grammarAttempts,1);
 assert.equal(e.independentGrammar,0);
 assert.equal(e.continuation.action,'grammar-select');
 assert.equal(e.continuation.id,grammar.id);
 assert.equal(evidence(s,'2',now+3).readingAttempts,0);
 assert.equal(evidence(s,'4',now+3).grammarAttempts,0);
 assert.equal(JSON.stringify(base),before);
});
test('L1: original lesson chapters are exact, non-overlapping per-level subsets, and independently navigable',()=>{
 const s=freshState();
 const all=new Set();
 for(const t of HSK_TARGETS){
  const l=hskTargetLessons(t.id),e=evidence(s,t.id,1e9);
  assert.equal(e.units.flatMap(u=>u.lessons).length,l.length);
  for(const u of e.units){
   assert.ok(u.lessons.length&&u.next&&u.lessons.some(a=>a.id===u.next.id));
   for(const lesson of u.lessons){
    assert.ok(l.includes(lesson));
    assert.ok(!all.has(lesson.id),'Duplicate chapter/lesson '+lesson.id);
    all.add(lesson.id);
   }
  }
  if(l.length){
   const html=renderC9HSKTargets(s,t.id,action,esc);
   assert.ok(html.includes('data-action="c9-level-unit"'));
   assert.ok(html.includes('Browse lesson units'));
  }
 }
 assert.equal(all.size,428);
 assert.equal(evidence(s,'6',1e9).due,0);
 assert.equal(evidence(s,'7-9',1e9).due,0);
 assert.ok(renderC9HSKTargets(s,'6',action,esc).includes('scheduled cards due'));
});
test('L1: level review and resume are non-mutating; no official HSK accomplishment or new scheduler',()=>{
 const s=freshState();
 for(const id of ['1','5','6','7-9']){
  const before=JSON.stringify(s),e=evidence(s,id,100);
  if(hskTargetLessons(id).length)assert.equal(e.continuation.action,'c9-lesson-open');
  else assert.ok(['c9-media-open-story','pathway-select'].includes(e.continuation.action));
  assert.equal(JSON.stringify(s),before);
 }
});
