import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,grammarIdFromHash,grammarQuestion,gradeGrammarQuestion} from '../src/grammar-course.mjs';

test('all original two- and three-digit grammar deep links resolve to exact canonical source IDs',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164);
 assert.equal(GRAMMAR_PRACTICE_TASKS.length,164*5);
 for(const lesson of GRAMMAR_LESSONS){
  const hash='#/grammar/'+lesson.id;
  assert.equal(grammarIdFromHash(hash),lesson.id,hash);
 }
 for(const [hash] of [
  ['#/grammar/g12extra'],['#/grammar/g128trailing'],['#/grammar/g164/'],
  ['#/grammar/g165'],['#/grammar/g00'],['#/grammar/g1'],
  ['#/grammar/g001'],['#/grammars/g128'],['#/grammar/g128?mode=cloze'],
  ['#/grammar/'],['#/grammar/g128#g12'],['#/grammar/g128/../g12'],
  ['#/grammar/g999'],['#/grammar/g1280'],['#/grammar/G128'],['#/learn/g128'],
  [''],[null],[undefined]
 ])assert.equal(grammarIdFromHash(hash),null,String(hash));
 assert.equal(grammarIdFromHash('#/grammar/g12'),'g12');
 assert.equal(grammarIdFromHash('#/grammar/g128'),'g128');
 assert.equal(grammarIdFromHash('#/grammar/g164'),'g164');
});

test('g128 original hypothetical cloze meaning and grading survive deep-link repair',()=>{
 const q=grammarQuestion(grammarIdFromHash('#/grammar/g128'),'cloze');
 assert.equal(q.id,'grammar:g128:cloze');
 assert.equal(q.taskId,q.id);
 assert.equal(q.mode,'cloze');
 assert.equal(q.context,'＿＿时间不够，我们也不能随便修改数据。');
 assert.equal(q.targetMeaning,'Even if time is short, we cannot change the data casually.');
 assert.equal(q.answer,'即使');
 assert.deepEqual(new Set(q.options),new Set(['即使','虽然','因为']));
 assert.equal(q.model.hanzi,'即使时间不够，我们也不能随便修改数据。');
 assert.equal(q.context.replace(/＿＿|____/,q.answer),q.model.hanzi);
 const wrong=gradeGrammarQuestion(q,'虽然');
 assert.equal(wrong.correct,false);
 assert.match(wrong.message,/different context/i);
 assert.match(q.grammar.contrast,/factual concession/);
 assert.equal(gradeGrammarQuestion(q,'即使').correct,true);
 assert.equal(grammarQuestion('g12','cloze').taskId,'grammar:g12:cloze');
 assert.equal(grammarQuestion('g164','cloze').taskId,'grammar:g164:cloze');
});
