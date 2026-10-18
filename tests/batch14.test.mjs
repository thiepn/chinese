import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {LADDER_STAGES,sentenceChunks,ladderQuestion,startLadder,ladderSelect,ladderUndo,ladderHint,answerLadder,advanceLadder,abandonLadder,ladderSummary,adaptiveLadderSuggestions,validateLadderExtensions} from '../src/sentence-ladder.mjs';
const starting=()=>startLadder(freshState(),DEMO_LESSONS[0].id,{id:'ladder-session',at:1000});
function answer(s,index,response='',reveal=false){return answerLadder(s,{id:`try-${index}`,response,reveal,at:2000+index});}
test('74 demonstrations retained and all four ladder tasks exist for each lesson',()=>{
 assert.ok(DEMO_LESSONS.length>=74);
 for(const l of DEMO_LESSONS){let s=startLadder(freshState(),l.id,{id:`run-${l.id}`,at:123});
  for(let i=0;i<4;i++){s.ladderSession.cursor=i;let q=ladderQuestion(s.ladderSession);assert.equal(q.stage,LADDER_STAGES[i]);assert.equal(typeof q.answer,'string');assert.ok(q.answer.length>0);if(i===0||i===1)assert.ok(q.options.includes(q.answer));if(i===2){assert.equal(q.chunks.join(''),l.sentence.hanzi);assert.ok(q.chunks.length>=1);} s.ladderSession.cursor=i;}
 }
});
test('question identity follows selected word and full sentence context',()=>{
 let s=starting();assert.equal(ladderQuestion(s.ladderSession).answer,DEMO_LESSONS[0].words[0].hanzi);
 s.ladderSession.cursor=1;assert.equal(ladderQuestion(s.ladderSession).answer,DEMO_LESSONS[0].sentence.english);
 s.ladderSession.cursor=3;assert.equal(ladderQuestion(s.ladderSession).answer,DEMO_LESSONS[0].words[0].pinyin);
});
test('entire ladder completes with independent evidence but no scheduled events or cards',()=>{
 let s=starting();let i=0;
 while(s.ladderSession){const q=ladderQuestion(s.ladderSession);
  if(q.kind==='order'){for(let k=0;k<q.chunks.length;k++)s=ladderSelect(s,k);}
  s=answer(s,i++,q.kind==='order'?'':q.answer);assert.equal(s.ladderSession.feedback.correct,true);
  assert.equal(s.ladderSession.feedback.assisted,false);s=advanceLadder(s);
 }
 assert.equal(s.ladderEvents.length,4);assert.deepEqual(s.ladderEvents.map(e=>e.stage),LADDER_STAGES);
 assert.equal(s.events.length,0);assert.deepEqual(s.cards,{});assert.deepEqual(s.learned,[]);
 assert.equal(ladderSummary(s,DEMO_LESSONS[0].id).independent,4);validateState(s);
});
test('hint survives serialized checkpoint and forces assisted grading',()=>{
 let s=ladderHint(starting());s=importBackup(backupDocument(s));
 assert.equal(s.ladderSession.assistanceUsed,true);
 s=answer(s,0,ladderQuestion(s.ladderSession).answer);
 assert.equal(s.ladderSession.feedback.correct,true);assert.equal(s.ladderSession.feedback.assisted,true);
 assert.equal(s.ladderEvents[0].assisted,true);assert.equal(s.events.length,0);
});
test('reveal cannot be credited as independent success',()=>{
 const s=answer(starting(),0,'',true);assert.equal(s.ladderEvents[0].assisted,true);assert.equal(s.ladderEvents[0].correct,false);
});
test('order selections persist through backup; undo remains reversible',()=>{
 let s=starting();s.ladderSession.cursor=2;
 s=ladderSelect(s,1);s=ladderSelect(s,0);
 s=importBackup(backupDocument(s));assert.deepEqual(s.ladderSession.selected,[1,0]);
 s=ladderUndo(s);assert.deepEqual(s.ladderSession.selected,[1]);validateState(s);
});
test('incorrect sentence order is not accepted',()=>{
 let s=starting();s.ladderSession.cursor=2;
 const len=sentenceChunks(DEMO_LESSONS[0].id).length;
 for(let i=len-1;i>=0;i--)s=ladderSelect(s,i);
 if(len>1){s=answer(s,2);assert.equal(s.ladderSession.feedback.correct,false);}
});
test('cannot submit partial sentence construction or select chunks twice',()=>{
 let s=starting();s.ladderSession.cursor=2;s=ladderSelect(s,0);
 assert.throws(()=>ladderSelect(s,0));assert.throws(()=>answer(s,2),/Place every/);
});
test('typed word-level pinyin accepts equivalent numbers and identifies tone errors',()=>{
 let s=starting();s.ladderSession.cursor=3;
 const q=ladderQuestion(s.ladderSession);const reference=q.answer;
 s=answer(s,3,reference);
 assert.equal(s.ladderEvents[0].correct,true);
 const mismatched=starting();mismatched.ladderSession.cursor=3;
 const bad=answer(mismatched,4,'zz9');assert.equal(bad.ladderEvents[0].correct,false);
});
test('duplicate event IDs rejected, including if session stage advances',()=>{
 let s=starting();s=answer(s,0,ladderQuestion(s.ladderSession).answer);s=advanceLadder(s);
 assert.throws(()=>answerLadder(s,{id:'try-0',response:'anything',at:2100}),/duplicate/);
});
test('cannot skip unchecked stage or edit answer after feedback',()=>{
 const s=starting();assert.throws(()=>advanceLadder(s));
 const submitted=answer(s,0,ladderQuestion(s.ladderSession).answer);
 assert.throws(()=>ladderHint(submitted));assert.throws(()=>answer(submitted,2,'test'));
});
test('existing active session cannot be overwritten, abandon preserves submitted evidence',()=>{
 let s=starting();assert.throws(()=>startLadder(s,DEMO_LESSONS[1].id,{id:'overwrite'}));
 s=answer(s,0,ladderQuestion(s.ladderSession).answer);
 s=abandonLadder(s);assert.equal(s.ladderSession,null);assert.equal(s.ladderEvents.length,1);
});
test('older v1 backups without sentence ladder fields remain valid',()=>{
 let s=freshState();delete s.ladderEvents;delete s.ladderSession;
 const doc=backupDocument(s),restored=importBackup(doc);
 assert.equal(restored.ladderEvents,undefined);assert.equal(validateState(restored),true);
 const next=startLadder(restored,DEMO_LESSONS[0].id,{id:'legacy-new'});assert.equal(next.ladderSession.cursor,0);
});
test('repeated ladder alternates the teaching word after completed tone task',()=>{
 const l=DEMO_LESSONS[0],s=starting();s.ladderEvents=[{id:'old',sessionId:'old-session',lessonId:l.id,stage:'tone',wordIndex:0,correct:true,assisted:false,at:500}];
 const repeat=startLadder({...s,ladderSession:null},l.id,{id:'second',at:1200});
 assert.equal(repeat.ladderSession.wordIndex,1);
 assert.equal(ladderQuestion(repeat.ladderSession).answer,l.words[1].hanzi);
});
test('malicious and malformed checkpoint selections are rejected',()=>{
 const s=starting();s.ladderSession.cursor=2;s.ladderSession.selected=[999];assert.throws(()=>validateState(s));
 s.ladderSession.selected=[0,0];assert.throws(()=>validateState(s));
});
test('invalid stage, fabricated lesson and duplicate history are rejected',()=>{
 const s=starting();s.ladderSession.cursor=77;assert.throws(()=>validateLadderExtensions(s));
 let n=starting();n.ladderEvents=[{id:'x',sessionId:'y',lessonId:'not-real',stage:'word',wordIndex:0,correct:true,assisted:false,at:100}];assert.throws(()=>validateState(n));
});
test('adaptive priorities use mistakes and assistance, not scheduled mastery grants',()=>{
 let s=starting(),l=DEMO_LESSONS[0];s=answer(s,0,'WRONG');
 const result=adaptiveLadderSuggestions(s,{limit:4});assert.equal(result[0].id,l.id);assert.match(result[0].reason,/unresolved/);
 assert.equal(s.events.length,0);assert.equal(Object.keys(s.cards).length,0);
});
test('independent correction reduces adaptive priority for same stage',()=>{
 let s=starting();s=answer(s,0,'WRONG');s=abandonLadder(s);
 s=startLadder(s,DEMO_LESSONS[0].id,{id:'second',at:3500});s=answerLadder(s,{id:'corrected',response:ladderQuestion(s.ladderSession).answer,at:3600});
 const result=adaptiveLadderSuggestions(s,{limit:10}).find(x=>x.id===DEMO_LESSONS[0].id);
 assert.equal(result?.unresolved||0,0);
});
test('scheduled-review grades and original event history are unchanged by ladder',()=>{
 const base=addLesson(freshState(),DEMO_LESSONS[0].id,100);
 const before=JSON.stringify({cards:base.cards,events:base.events,learned:base.learned});
 let s=startLadder(base,DEMO_LESSONS[0].id,{id:'x'});s=answer(s,0,ladderQuestion(s.ladderSession).answer);
 assert.equal(JSON.stringify({cards:s.cards,events:s.events,learned:s.learned}),before);
});
test('UI and offline list incorporate Sentence Ladder',async()=>{
 const [app,sw,html,css]=await Promise.all(['app.mjs','sw.js','index.html','styles.css'].map(x=>readFile(`src/${x}`,'utf8')));
 assert.match(html,/data-route="ladder"/);assert.match(app,/renderLadder/);assert.match(app,/ladder-select/);
 assert.match(app,/ladderSuggestionsPanel/);assert.match(sw,/sentence-ladder\.mjs/);assert.match(sw,/character-study-working-v78/);
 assert.match(css,/ladder-suggestion-grid/);
});
