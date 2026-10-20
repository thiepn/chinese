import test from 'node:test';
import assert from 'node:assert/strict';
import {P47_GRAMMAR_ROWS} from '../src/p47-grammar.mjs';
import {GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,findGrammarLesson,grammarQuestion,gradeGrammarQuestion} from '../src/grammar-course.mjs';

const hanzi='他为了减少错误反复修改报告，结果反而增加了错误。';
const pinyin="Tā wèile jiǎnshǎo cuòwù fǎnfù xiūgǎi bàogào, jiéguǒ fǎn'ér zēngjiā le cuòwù.";
const english='He repeatedly revised the report to reduce errors, but ended up introducing more mistakes instead.';

test('P47 g141 反而 illustrates counterexpectation rather than a predictable causal benefit',()=>{
 const row=P47_GRAMMAR_ROWS.find(r=>r[0]==='g141');
 assert.ok(row,'canonical original g141 row');
 assert.match(row[2],/Contrary to expectation/);
 assert.match(row[4],/opposite to what the previous fact/);
 assert.match(row[6],/contrasted consequence really differs/);
 assert.deepEqual(row[9],[hanzi,pinyin,english]);
 assert.match(row[8][0],/虽然价格更低.*反而更不合适/);
 assert.match(row[9][0],/为了减少错误.*反而增加了错误/);
 assert.ok(!row[9][0].includes('没有随便猜测年份'));
 assert.ok(!row[9][2].includes('more credible as a result'));
});

test('source g141 production and ordering reuse corrected authentic Mandarin/Pinyin/English with unchanged task IDs',()=>{
 const lesson=findGrammarLesson('g141');
 assert.ok(lesson);
 assert.equal(lesson.id,'g141');
 assert.deepEqual(lesson.examples[1],{hanzi,pinyin,english});
 assert.deepEqual(lesson.transformation.model,{hanzi,pinyin,english});
 assert.equal(lesson.transformation.chunks.join(''),hanzi);
 for(const mode of ['production','ordering','transformation']){
  const q=grammarQuestion('g141',mode);
  const task=GRAMMAR_PRACTICE_TASKS.find(t=>t.id==='grammar:g141:'+mode);
  assert.ok(task);
  assert.equal(q.id,'grammar:g141:'+mode);
  assert.equal(q.taskId,task.id);
  assert.equal(q.answer,hanzi);
  assert.equal(task.hanzi,hanzi);
  assert.equal(task.pinyin,pinyin);
  assert.equal(q.model.english,english);
  assert.equal(gradeGrammarQuestion(q,hanzi).correct,true);
  assert.equal(gradeGrammarQuestion(q,'他没有随便猜测年份，报告反而变得更可信了。').correct,false);
 }
 const meaning=grammarQuestion('g141','meaning');
 assert.equal(meaning.answer,lesson.examples[0].english);
 assert.equal(gradeGrammarQuestion(meaning,meaning.answer).correct,true);
 const cloze=grammarQuestion('g141','cloze');
 assert.equal(cloze.answer,'反而');
 assert.deepEqual(new Set(cloze.options),new Set(['反而','因此','只有']));
 assert.equal(gradeGrammarQuestion(cloze,'反而').correct,true);
});

test('original source identities and non-official curriculum boundaries remain unchanged',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164);
 assert.equal(GRAMMAR_PRACTICE_TASKS.length,164*5);
 assert.equal(new Set(GRAMMAR_LESSONS.map(l=>l.id)).size,164);
 for(const id of ['g140','g141','g142']){
  const row=findGrammarLesson(id);
  assert.ok(row);
  for(const mode of ['meaning','cloze','ordering','transformation','production']){
   assert.ok(grammarQuestion(id,mode));
   assert.ok(GRAMMAR_PRACTICE_TASKS.some(t=>t.id==='grammar:'+id+':'+mode));
  }
 }
});
