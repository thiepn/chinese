import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,findGrammarLesson,grammarQuestion,gradeGrammarQuestion} from '../src/grammar-course.mjs';
import {P36_REPAIR_CASES} from '../src/p36-course.mjs';
import {P47_GRAMMAR_ROWS} from '../src/p47-grammar.mjs';

test('F1: advanced grammar meaning questions use original same-source, same-chapter translations, not unrelated entry-level choices',()=>{
 for(const id of ['g135','g141','g142','g146']){
  const lesson=findGrammarLesson(id),q=grammarQuestion(id,'meaning');
  assert.equal(q.id,'grammar:'+id+':meaning');
  assert.equal(q.answer,lesson.examples[0].english);
  assert.equal(q.options.length,4,id);
  assert.equal(new Set(q.options).size,4,id);
  assert.deepEqual(new Set(q.options).size,4);
  for(const answer of q.options){
   assert.ok(P47_GRAMMAR_ROWS.some(row=>row[8][2]===answer),
    id+': alternatives must be independently authored P47 translations, not invented translations');
  }
  assert.equal(gradeGrammarQuestion(q,q.answer).correct,true);
  for(const other of q.options.filter(answer=>answer!==q.answer))
   assert.equal(gradeGrammarQuestion(q,other).correct,false,id+' '+other);
 }
 assert.ok(grammarQuestion('g141','meaning').options.includes(findGrammarLesson('g142').examples[0].english));
});

test('F1: every original grammar meaning question has four distinct source translations and an unchanged correct answer',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164);
 assert.equal(GRAMMAR_PRACTICE_TASKS.length,820);
 for(const lesson of GRAMMAR_LESSONS){
  const q=grammarQuestion(lesson.id,'meaning');
  assert.equal(q.id,'grammar:'+lesson.id+':meaning');
  assert.equal(q.taskId,q.id);
  assert.equal(q.answer,lesson.examples[0].english);
  assert.equal(q.model.hanzi,lesson.examples[0].hanzi);
  assert.equal(q.model.pinyin,lesson.examples[0].pinyin);
  assert.equal(q.options.length,4,lesson.id);
  assert.equal(new Set(q.options).size,4,lesson.id);
  assert.equal(q.options.filter(a=>a===q.answer).length,1,lesson.id);
  for(const option of q.options)assert.ok(GRAMMAR_LESSONS.some(l=>l.examples[0].english===option),lesson.id);
 }
});

test('F1: Chinese broadcast, emphatic degree, obligation and alternative-question tasks retain original canonical IDs and align their English',()=>{
 const checks=[
  ['g78','我听不清楚广播。',"I can't hear the broadcast clearly.",'Say that I cannot hear the broadcast clearly.'],
  ['g82','这顿饭太好吃了！','This meal is so delicious!','Exclaim that this meal is so delicious.'],
  ['g92','你想喝茶还是水？','Would you like tea or water?','Ask your friend to choose between tea and water.']
 ];
 for(const [id,hanzi,english,prompt] of checks){
  const lesson=findGrammarLesson(id),task=grammarQuestion(id,'transformation');
  assert.equal(lesson.transformation.model.hanzi,hanzi);
  assert.equal(lesson.transformation.model.english,english);
  assert.equal(lesson.transformation.prompt,prompt);
  assert.equal(task.id,'grammar:'+id+':transformation');
  assert.equal(task.answer,hanzi);
  assert.equal(task.model.english,prompt);
  assert.equal(task.chunks,null);
  assert.equal(gradeGrammarQuestion(task,hanzi).correct,true);
  assert.equal(GRAMMAR_PRACTICE_TASKS.find(t=>t.id===task.id).english,prompt);
  const repair=P36_REPAIR_CASES.find(x=>x.grammarId===id);
  assert.equal(repair.correct.english,english);
  assert.equal(repair.intendedMeaning,english);
  assert.equal(repair.taskId,'p36:fix:'+id);
 }
 const g90=findGrammarLesson('g90');
 assert.equal(g90.examples[1].hanzi,'进教室以前必须先敲门。');
 assert.equal(g90.examples[1].english,'You must knock before entering the classroom.');
 assert.equal(grammarQuestion('g90','production').model.english,g90.examples[1].english);
 assert.equal(GRAMMAR_PRACTICE_TASKS.find(t=>t.id==='grammar:g90:production').english,g90.examples[1].english);
});

test('F1: authored cloze distractors, pronunciation and original writing authority are unchanged',()=>{
 for(const lesson of GRAMMAR_LESSONS){
  const q=grammarQuestion(lesson.id,'cloze');
  assert.deepEqual(new Set(q.options),new Set(lesson.cloze.options),lesson.id);
  assert.equal(gradeGrammarQuestion(q,q.answer).correct,true,lesson.id);
  assert.equal(q.context.replace(/____|＿＿/,q.answer),q.model.hanzi,lesson.id);
 }
 for(const id of ['g78','g82','g90','g92','g141']){
  for(const mode of ['meaning','cloze','ordering','transformation','production']){
   const q=grammarQuestion(id,mode);
   assert.equal(q.taskId,'grammar:'+id+':'+mode);
   assert.ok(GRAMMAR_PRACTICE_TASKS.find(t=>t.id===q.taskId));
  }
 }
});
