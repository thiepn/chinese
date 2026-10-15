import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {DRILL_MODES} from '../src/drills.mjs';
import {lessonRecommendations} from '../src/recommendations.mjs';
import {createGuidedSession,guidedQuestion,evaluateGuided,validateGuidedSession,recordGuidedAnswer,advanceGuidedSession,abandonGuidedSession} from '../src/guided-session.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';

const now=Date.parse('2026-10-12T12:00:00Z');
test('prior curriculum and readings retained, no official HSK memberships',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);assert.equal(DRILL_MODES.length,6);
 assert.ok(DEMO_LESSONS.slice(0,74).every(l=>l.words.length===2));
 assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null||l.officialHskLevel===undefined));
});
test('recommendations prioritize real observed errors while preserving stable lesson IDs',()=>{
 let s=freshState();const id=DEMO_LESSONS[0].id;s=addLesson(s,id,now);
 s=gradeCard(s,`${id}:reading`,0,now+1000,'ev-1',{correct:false});
 const ranked=lessonRecommendations(s,now+2000,10);
 assert.equal(ranked[0].lessonId,id);assert.match(ranked[0].reason,/difficulty|Scheduled/);
 assert.ok(ranked.every(x=>DEMO_LESSONS.some(l=>l.id===x.lessonId)));
});
test('new practice sessions are structurally valid across limits and focus modes',()=>{
 let s=freshState();for(const l of DEMO_LESSONS.slice(0,12))s=addLesson(s,l.id,now);
 for(const limit of [5,10,20])for(const focus of ['balanced','reading','weak']){
  const x=createGuidedSession(s,{limit,focus,id:`sess-${limit}-${focus}`,now});
  assert.equal(x.items.length,limit);assert.ok(x.items.some(it=>it.type==='drill'));assert.equal(validateGuidedSession(x),true);
  for(let i=0;i<x.items.length;i++){const clone={...x,cursor:i};const q=guidedQuestion(clone);assert.ok(q?.answer);if(q.kind==='choice')assert.ok(q.options.includes(q.answer));}
 }
});
test('guided question accepts exact correct answers, including character ordering and tonal pinyin',()=>{
 let s=freshState();s=addLesson(s,DEMO_LESSONS[0].id,now);
 const session=createGuidedSession(s,{limit:20,focus:'balanced',id:'all-modes',now});
 for(let cursor=0;cursor<20;cursor++){
  const q=guidedQuestion({...session,cursor});
  const order=q.kind==='ordering'?q.chunks.map((_,i)=>i):[];
  const result=evaluateGuided(q,q.answer,order);
  assert.equal(result.correct,true,`${q.mode}: ${q.answer}`);
 }
});
test('guided outcomes commit as supplemental events, can checkpoint and never credit scheduled cards',()=>{
 let state=freshState();state=addLesson(state,DEMO_LESSONS[0].id,now);
 const baselineCards=structuredClone(state.cards),baselineEvents=state.events.length;
 state.practiceSession=createGuidedSession(state,{limit:5,id:'resume-this',focus:'balanced',now});
 const q=guidedQuestion(state.practiceSession);
 state=recordGuidedAnswer(state,{response:q.answer,order:q.chunks?.map((_,i)=>i)||[],eventId:'attempt-1',now});
 assert.equal(state.practiceSession.cursor,0);assert.equal(state.practiceSession.feedback.correct,true);
 assert.equal(state.events.length,baselineEvents);assert.deepEqual(state.cards,baselineCards);
 assert.equal((state.drillEvents?.length||0)+(state.readingEvents?.length||0),1);
 validateState(state);
 state=advanceGuidedSession(state);assert.equal(state.practiceSession.cursor,1);assert.equal(state.practiceSession.correct,1);
 const restored=importBackup(JSON.parse(JSON.stringify(backupDocument(state))));
 assert.equal(restored.practiceSession.cursor,1);assert.equal(guidedQuestion(restored.practiceSession).answer,guidedQuestion(state.practiceSession).answer);
 state=abandonGuidedSession(state);assert.equal(state.practiceSession,null);
 assert.equal(state.drillEvents.length+state.readingEvents.length,1);
});
test('answer reveal is assisted and never counted as independently correct',()=>{
 let state=freshState();state.practiceSession=createGuidedSession(state,{limit:5,id:'reveal-only',focus:'reading',now});
 state=recordGuidedAnswer(state,{reveal:true,eventId:'revealed-1',now});
 assert.equal(state.practiceSession.feedback.assisted,true);assert.equal(state.practiceSession.feedback.correct,false);
 state=advanceGuidedSession(state);assert.equal(state.practiceSession.correct,0);assert.equal(state.practiceSession.assisted,1);
});
test('invalid sessions and duplicate answers rejected, without modifying original state',()=>{
 let s=freshState();s.practiceSession=createGuidedSession(s,{limit:5,id:'guard',now});
 assert.throws(()=>recordGuidedAnswer(s,{response:'',eventId:'empty'}),/Answer required/);
 assert.equal(s.practiceSession.feedback,null);
 assert.throws(()=>validateGuidedSession({...s.practiceSession,items:[{type:'drill',id:'fake',mode:'recognition'}]}));
 const q=guidedQuestion(s.practiceSession);
 s=recordGuidedAnswer(s,{response:q.answer,eventId:'once',now});
 assert.throws(()=>recordGuidedAnswer(s,{response:q.answer,eventId:'twice'}),/No unanswered/);
});
test('legacy Batch 4 backups without a practiceSession remain importable',()=>{
 const old=freshState();delete old.practiceSession;
 const doc=backupDocument(old);const loaded=importBackup(JSON.parse(JSON.stringify(doc)));
 assert.equal(loaded.practiceSession,undefined);assert.equal(validateState(loaded),true);
});
test('source contains new navigation, guided practice, reading and recovery states',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const symbol of ['renderGuidedPractice','guided-start','guided-next','guided-reveal','open-story-link','lessonRecommendations','Resume saved session'])assert.ok(app.includes(symbol),symbol);
 assert.ok(!app.includes('[data-action="import-open",'));
});
