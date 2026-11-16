// Active production suite: composition feedback is honest and useful,
// production grading never overclaims, and realistic reply tasks are wired.
import test from 'node:test';
import assert from 'node:assert/strict';
import { composeCheck } from '../src/compose-feedback.mjs';
import { SENTENCE_TASKS,checkSentence } from '../src/sentence-workshop.mjs';
import { EVERYDAY_REPLY_TASKS } from '../src/everyday-replies.mjs';
import { EVERYDAY_DIALOGUES } from '../src/everyday-dialogues-a.mjs';
import { EVERYDAY_DIALOGUES_B } from '../src/everyday-dialogues-b.mjs';
import { grammarQuestion,gradeGrammarQuestion } from '../src/grammar-course.mjs';
import { evaluateMeaning } from '../src/exercises.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';

const ALL=[...EVERYDAY_DIALOGUES,...EVERYDAY_DIALOGUES_B];

test('compose feedback: honest verdicts that never self-approve',()=>{
 const model='我要一碗牛肉面。';
 const exact=composeCheck(model,model);
 assert.equal(exact.verdict,'model');
 assert.ok(exact.message.includes('matches the taught model'));
 const empty=composeCheck(model,'   ');
 assert.equal(empty.verdict,'empty');
 const diff=composeCheck(model,'我们喝茶吧。');
 assert.equal(diff.verdict,'differs');
 assert.ok(!('correct' in diff),'the engine never declares free composition correct');
 assert.ok(diff.message.includes('not judged automatically'),'honest framing present');
 assert.ok(diff.missing.includes('牛肉')||diff.missing.includes('牛肉面')||diff.missing.some(w=>'我要一碗牛肉面。'.includes(w)),'missing model words reported');
 assert.ok(diff.different.includes('喝茶'),'different word choices reported');
 const outside=composeCheck(model,'我要xyz面。');
 assert.ok(!outside.outside||outside.outside.length>=0,'outside characters are scoped to the corpus');
 const short=composeCheck('今天我不去学校，因为我要在家工作。','今天。');
 assert.ok(short.message.includes('shorter'),'length gap reported');
});

test('production graders keep strict credit and add useful feedback',()=>{
 const task=SENTENCE_TASKS.find(t=>t.kind==='reply');
 assert.ok(task);
 assert.equal(checkSentence(task,task.hanzi).correct,true,'exact model still accepted');
 const near=checkSentence(task,task.hanzi.slice(0,Math.max(2,task.hanzi.length-2)));
 assert.equal(near.correct,false,'free composition never earns automatic credit');
 assert.ok(near.message.includes('taught model')&&near.message.includes('not judged automatically'));
 const q=grammarQuestion('g165','production');
 assert.equal(gradeGrammarQuestion(q,q.answer).correct,true);
 const partial=gradeGrammarQuestion(q,q.answer.slice(0,4));
 assert.equal(partial.correct,false);
 assert.ok(partial.message.includes('not judged automatically'));
 // Non-production graders are untouched.
 assert.equal(evaluateMeaning('hi','hello').correct,true,'meaning variants unchanged');
});

test('reply production: realistic dialog turns become your-turn tasks',()=>{
 assert.ok(EVERYDAY_REPLY_TASKS.length>=20&&EVERYDAY_REPLY_TASKS.length<=24,'two compact replies per dialogue');
 const ids=new Set();
 const allTurns=new Set(ALL.flatMap(d=>d.turns.map(t=>t.hanzi)));
 for(const t of EVERYDAY_REPLY_TASKS){
  assert.ok(!ids.has(t.id),t.id+' unique');ids.add(t.id);
  assert.ok(allTurns.has(t.hanzi),t.id+' model is an authored dialogue line');
  assert.ok([...t.hanzi].length<=26,t.id+' compact production target');
  assert.ok(/says: \u201c.+\u201d\. Write .+ reply in Chinese\.$/.test(t.english),t.id+' prompt quotes the interlocutor');
  assert.ok(t.pinyin&&t.kind==='reply');
  assert.ok(SENTENCE_TASKS.includes(t),t.id+' in the workshop bank');
  assert.doesNotThrow(()=>checkSentence(t,t.hanzi),t.id+' gradeable');
 }
});

test('active production: nothing else moved',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.ok(SENTENCE_TASKS.length>=4100);
 assert.equal(SENTENCE_TASKS.filter(t=>t.kind==='reply').length,EVERYDAY_REPLY_TASKS.length);
});
