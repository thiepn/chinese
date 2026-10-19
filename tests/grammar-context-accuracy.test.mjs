import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,grammarQuestion,gradeGrammarQuestion,findGrammarLesson} from '../src/grammar-course.mjs';
import {P36_REPAIR_CASES} from '../src/p36-course.mjs';
import {freshState} from '../src/study.mjs';

test('g12 authored train-station instruction matches specific Chinese, Pinyin and the original chunk answer',()=>{
 const l=findGrammarLesson('g12'),t=l.transformation;
 assert.ok(l);assert.equal(t.prompt,'Ask where the train station is.');
 assert.deepEqual([t.model.hanzi,t.model.pinyin,t.model.english],
  ['火车站在哪里？','Huǒchēzhàn zài nǎlǐ?','Where is the train station?']);
 assert.deepEqual(t.chunks,['火车站','在','哪里','？']);
 assert.equal(t.chunks.join(''),t.model.hanzi);
 for(const mode of ['ordering','transformation']){
  const q=grammarQuestion('g12',mode);
  assert.equal(q.id,'grammar:g12:'+mode);
  assert.equal(q.taskId,q.id);
  assert.equal(q.answer,'火车站在哪里？');
  assert.equal(q.model.pinyin,t.model.pinyin);
  assert.equal(gradeGrammarQuestion(q,q.answer).correct,true);
  assert.equal(gradeGrammarQuestion(q,'车站在哪里？').correct,false,
   'generic station must not silently satisfy the original specific train-station instruction');
  assert.equal(GRAMMAR_PRACTICE_TASKS.find(x=>x.id===q.id).hanzi,q.answer);
 }
});

test('g73 completed arrival model names the bus in all three original languages',()=>{
 const l=findGrammarLesson('g73');
 assert.ok(l);assert.equal(l.title,'Already versus not yet');
 assert.deepEqual([l.examples[0].hanzi,l.examples[0].pinyin,l.examples[0].english],
  ['公交车已经到了。','Gōngjiāo chē yǐjīng dào le.','The bus has already arrived.']);
 const m=grammarQuestion('g73','meaning');
 assert.equal(m.answer,l.examples[0].english);
 assert.equal(m.model.hanzi,l.examples[0].hanzi);
 assert.equal(m.model.pinyin,l.examples[0].pinyin);
 assert.equal(gradeGrammarQuestion(m,m.answer).correct,true);
 assert.equal(GRAMMAR_PRACTICE_TASKS.find(x=>x.id==='grammar:g73:meaning').hanzi,m.model.hanzi);
 const repair=P36_REPAIR_CASES.find(x=>x.grammarId==='g73');
 assert.ok(repair);assert.equal(repair.incorrect,'我已经还没做完作业。');
 assert.equal(repair.correct.hanzi,'我还没做完作业。');
 assert.equal(repair.taskId,'p36:fix:g73');
});

test('g75 original 听懂 context names a spoken question, not an awkward grammatical temporal clause',()=>{
 const l=findGrammarLesson('g75');assert.ok(l);
 assert.equal(l.examples[1].hanzi,'这个问题我还没听懂。');
 assert.equal(l.examples[1].pinyin,'Zhège wèntí wǒ hái méi tīng dǒng.');
 assert.equal(l.examples[1].english,"I still haven't understood the spoken question.");
 assert.equal(grammarQuestion('g75','production').answer,l.examples[1].hanzi);
 assert.equal(GRAMMAR_PRACTICE_TASKS.find(x=>x.id==='grammar:g75:production').english,
  l.examples[1].english);
});

test('original grammar IDs, counts, answer history authority and untouched source boundaries remain stable',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164);
 assert.equal(GRAMMAR_PRACTICE_TASKS.length,164*5);
 assert.equal(new Set(GRAMMAR_LESSONS.map(x=>x.id)).size,164);
 assert.deepEqual(['g12','g73','g75'].map(id=>findGrammarLesson(id)?.id),['g12','g73','g75']);
 const state=freshState(),before=JSON.stringify(state);
 for(const id of ['g12','g73','g75'])for(const mode of ['meaning','cloze','ordering','transformation','production']){
  const task=grammarQuestion(id,mode);assert.ok(task);assert.equal(task.taskId,'grammar:'+id+':'+mode);
 }
 assert.equal(JSON.stringify(state),before,'read-only source verification never writes grade evidence');
});
