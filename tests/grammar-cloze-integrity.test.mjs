import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAMMAR_LESSONS,grammarQuestion,gradeGrammarQuestion} from '../src/grammar-course.mjs';

test('all 164 original grammar cloze items retain the answer plus both authored distractors',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164,'the same append-only source IDs remain in place');
 for(const lesson of GRAMMAR_LESSONS){
  const q=grammarQuestion(lesson.id,'cloze');
  assert.ok(q,lesson.id);
  assert.equal(q.id,'grammar:'+lesson.id+':cloze');
  assert.equal(q.taskId,q.id);
  assert.equal(q.kind,'choice');
  assert.ok(q.context.includes('＿＿')||q.context.includes('____'),lesson.id);
  assert.equal(q.options.length,3,lesson.id+' '+lesson.title);
  assert.equal(new Set(q.options).size,3,lesson.id);
  assert.deepEqual(new Set(q.options),new Set(lesson.cloze.options),lesson.id);
  assert.equal(q.context.replace(/＿＿|____/,q.answer),q.model.hanzi,lesson.id);
  assert.equal(gradeGrammarQuestion(q,q.answer).correct,true,lesson.id);
  for(const distractor of lesson.cloze.options.slice(1)){
   assert.equal(gradeGrammarQuestion(q,distractor).correct,false,lesson.id+' '+distractor);
  }
 }
});

test('g19 temporal placement and g54 P32 future-time expressions keep contextual authored contrasts',()=>{
 for(const [id,correct,wrongA,wrongB,hanzi] of [
  ['g19','下午','是下午','在下午是','我下午去图书馆。'],
  ['g54','下周','是下周','在下周是','我下周去北京。']
 ]){
  const lesson=GRAMMAR_LESSONS.find(l=>l.id===id),q=grammarQuestion(id,'cloze');
  assert.ok(lesson);
  assert.equal(q.answer,correct);
  assert.deepEqual(new Set(q.options),new Set([correct,wrongA,wrongB]));
  assert.equal(q.model.hanzi,hanzi);
  assert.equal(q.context.replace(/＿＿|____/,correct),hanzi);
  assert.equal(gradeGrammarQuestion(q,correct).reason,'correct');
  assert.equal(gradeGrammarQuestion(q,wrongA).reason,'choice');
  assert.equal(gradeGrammarQuestion(q,wrongB).reason,'choice');
 }
});

test('meaning-choice deduplication remains independent from exact Chinese cloze construction',()=>{
 // All original meaning tasks retain the correct, explicit translation option.
 for(const lesson of GRAMMAR_LESSONS){
  const q=grammarQuestion(lesson.id,'meaning');
  assert.equal(q.answer,lesson.examples[0].english,lesson.id);
  assert.ok(q.options.includes(q.answer),lesson.id);
  assert.equal(new Set(q.options).size,q.options.length,lesson.id);
  assert.equal(gradeGrammarQuestion(q,q.answer).correct,true,lesson.id);
 }
 // No stored learning records or grades are consulted in this pure source check.
});
