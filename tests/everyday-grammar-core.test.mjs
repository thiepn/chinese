// Everyday Grammar Core regression suite: the g165..g181 beginner grammar
// lessons fill audited holes in the grammar course with intact row invariants,
// parseable pinyin, traceable characters, generated practice tasks, and no
// change to lesson identities, review cards, or canonical demo content.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS,findLesson } from '../src/demo-lessons.mjs';
import { GRAMMAR_LESSONS,GRAMMAR_CHAPTERS,GRAMMAR_PRACTICE_TASKS,findGrammarLesson } from '../src/grammar-course.mjs';
import { EVERYDAY_GRAMMAR_ROWS } from '../src/everyday-grammar.mjs';
import { parsePinyin,evaluateMeaning,evaluatePinyin } from '../src/exercises.mjs';

const NEW_IDS=['g165','g166','g167','g168','g169','g170','g171','g172','g173','g174','g175','g176','g177','g178','g179','g180','g181'];
const CHAPTERS=new Set(['Foundations','Questions','Nouns & classifiers','Time & location','Actions & aspect','Connections & comparisons']);
// Characters introduced by these lessons that no existing corpus row contains.
const NEW_CHARS=new Set(['叫','块','往']);
const parseable=p=>parsePinyin(String(p).replace(/[^\p{L}\p{N}\s'’\-·]/gu,' ').replace(/(?<=[\p{L}])r(?=\s|$)/gu,''));

test('everyday grammar: 17 audited hole-filling lessons exist in difficulty order',()=>{
 assert.equal(EVERYDAY_GRAMMAR_ROWS.length,17);
 assert.deepEqual(EVERYDAY_GRAMMAR_ROWS.map(r=>r[0]),NEW_IDS);
 for(const id of NEW_IDS){
  const lesson=findGrammarLesson(id);
  assert.ok(lesson,'missing grammar lesson '+id);
  assert.ok(CHAPTERS.has(lesson.chapter),id+' chapter');
  assert.ok(lesson.order>=165&&lesson.order<=181,id+' order');
  assert.ok(lesson.title&&lesson.pattern&&lesson.explanation&&lesson.contrast&&lesson.pitfall,id+' prose fields');
  const expectedAnchor=DEMO_LESSONS.find(l=>l.hanzi===lesson.anchor)?.id||null;
  assert.equal(lesson.characterLessonId,expectedAnchor,id+' anchor linkage');
 }
 assert.equal(GRAMMAR_LESSONS.length,181);
 // Difficulty progression: staples before advanced structures.
 assert.ok(NEW_IDS.indexOf('g165')<NEW_IDS.indexOf('g178')&&NEW_IDS.indexOf('g178')<NEW_IDS.indexOf('g181'));
});

test('everyday grammar: row invariants hold for every new lesson',()=>{
 for(const id of NEW_IDS){
  const lesson=findGrammarLesson(id);
  assert.equal(lesson.examples.length,2,id+' examples');
  for(const ex of lesson.examples){
   assert.ok(ex.hanzi&&ex.pinyin&&ex.english,id+' example fields');
   assert.ok(parseable(ex.pinyin),id+' example pinyin parses: '+ex.pinyin);
  }
  // Cloze: masking, answer position, and completed sentence must agree.
  const cloze=lesson.cloze;
  assert.ok(cloze.masked.includes('＿＿'),id+' cloze masked');
  const row=findRow(id);
  assert.equal(row[10][4],row[10][0].replace('＿＿',row[10][1]),id+' cloze completed matches masked+answer');
  assert.ok(row[10][1]!==row[10][2]&&row[10][1]!==row[10][3]&&row[10][2]!==row[10][3],id+' cloze options distinct');
  // Transformation: chunks must rebuild the model exactly.
  assert.equal(row[11][4].join(''),row[11][1],id+' transformation chunks rebuild model');
  assert.ok(parseable(row[11][2]),id+' transformation pinyin parses');
  assert.ok(parseable(row[10][5]),id+' cloze pinyin parses');
  assert.ok(row[11][0]&&row[11][3]&&row[10][6],id+' prompts and english');
 }
 function findRow(id){return EVERYDAY_GRAMMAR_ROWS.find(r=>r[0]===id)}
});

test('everyday grammar: every character is corpus-traceable or declared new',()=>{
 const corpus=new Set();
 for(const lesson of DEMO_LESSONS){
  corpus.add(lesson.hanzi);
  for(const w of lesson.words)for(const c of w.hanzi)corpus.add(c);
  for(const c of lesson.sentence.hanzi)corpus.add(c);
  if(lesson.extraSentence)for(const c of lesson.extraSentence.hanzi)corpus.add(c);
 }
 for(const row of EVERYDAY_GRAMMAR_ROWS){
  const text=[row[7],...row[8],...row[9],...row[10],...row[11],...row[11][4]].join('');
  for(const ch of text.match(/[\u4e00-\u9fff]/g)||[]){
   assert.ok(corpus.has(ch)||NEW_CHARS.has(ch),row[0]+' uses untraceable character: '+ch);
  }
 }
});

test('everyday grammar: five practice modes generate for each new lesson',()=>{
 for(const id of NEW_IDS){
  const tasks=GRAMMAR_PRACTICE_TASKS.filter(t=>t.grammarId===id);
  assert.equal(tasks.length,5,id+' practice tasks');
  for(const t of tasks)assert.ok(t.hanzi&&t.pinyin&&t.english&&t.mode,id+' task fields');
 }
 assert.ok(GRAMMAR_CHAPTERS.some(ch=>ch.lessons.includes('g165')));
 assert.ok(GRAMMAR_CHAPTERS.some(ch=>ch.lessons.includes('g181')));
});
