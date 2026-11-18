// Everyday Mandarin Series regression suite: 12 colloquial dialogues, 9
// colloquial grammar lessons and the everyday vocabulary pack are accurate,
// integrated into existing catalogs, traceable, and preserve all prior work.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';
import { DIALOGUES } from '../src/dialogues.mjs';
import { EVERYDAY_DIALOGUES,EVERYDAY_DIALOGUE_ROWS } from '../src/everyday-dialogues-a.mjs';
import { EVERYDAY_DIALOGUES_B,EVERYDAY_DIALOGUE_ROWS_B } from '../src/everyday-dialogues-b.mjs';
import { COLLOQUIAL_GRAMMAR_ROWS } from '../src/colloquial-grammar.mjs';
import { EVERYDAY_VOCABULARY } from '../src/everyday-vocabulary.mjs';
import { GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,findGrammarLesson } from '../src/grammar-course.mjs';
import { WORDS,findWord } from '../src/lexicon.mjs';
import { parsePinyin,evaluatePinyin } from '../src/exercises.mjs';
import { gradeMission } from '../src/dialogue-missions.mjs';
import { STORIES } from '../src/stories.mjs';

const PACKS=[EVERYDAY_DIALOGUES,EVERYDAY_DIALOGUES_B];
const ALL_TURNS=PACKS.flatMap(p=>p.flatMap(d=>d.turns));
const clean=p=>String(p).replace(/[^\p{L}\p{N}\s'’\-·]/gu,' ');
const parseable=p=>parsePinyin(clean(p));
// Characters the Everyday series introduces beyond every existing corpus text.
const NEW_CHARS=new Set(['万','俩','厉','呀','呗','哈','喂','嗯','嘛','嘴','挺','架','橘','灰','脆']);
const CHAPTERS=new Set(['Foundations','Questions','Nouns & classifiers','Time & location','Actions & aspect','Connections & comparisons']);

test('everyday dialogues: schema, evidence and pragmatics questions hold',()=>{
 const all=PACKS.flatMap(p=>p);
 assert.equal(all.length,12);
 for(const d of all){
  assert.equal(d.turns.length,8,d.id+' turns');
  assert.equal(d.questions.length,3,d.id+' questions');
  assert.ok(d.theme&&d.goal&&d.register,d.id+' metadata');
  assert.equal(d.approval,'DEMO_ONLY',d.id+' approval');
  assert.equal(d.officialHskLevel,null,d.id+' no HSK claims');
  for(const t of d.turns){
   assert.ok(t.speaker&&t.hanzi&&t.pinyin&&t.english,d.id+' turn fields');
   const parsed=parseable(t.pinyin);
   assert.ok(parsed,d.id+' pinyin parses: '+t.pinyin);
   const chars=(t.hanzi.match(/[\u4e00-\u9fff]/g)||[]).length;
   const erhua=(t.hanzi.match(/儿/g)||[]).length;
   assert.ok(parsed.length===chars||parsed.length===chars-erhua,d.id+' syllable/character alignment: '+t.hanzi);
  }
  const qids=new Set();
  for(const q of d.questions){
   assert.ok(q.prompt&&q.answer&&q.explanation,d.id+' question fields');
   assert.ok(q.options.includes(q.answer),d.id+' answer is an option');
   assert.ok(new Set(q.options).size===q.options.length&&q.options.length>=3,d.id+' options distinct');
   assert.ok(Number.isInteger(q.evidenceIndex)&&q.evidenceIndex>=0&&q.evidenceIndex<d.turns.length,d.id+' evidence index');
   assert.ok(!qids.has(q.id),d.id+' question ids unique');qids.add(q.id);
  }
 }
});

test('everyday dialogues: catalog integration preserves all historical dialogue identities',()=>{
 assert.equal(DIALOGUES.length,202);
 assert.deepEqual(DIALOGUES.slice(190).map(d=>d.id),[
  'dialogue-191','dialogue-192','dialogue-193','dialogue-194','dialogue-195','dialogue-196',
  'dialogue-197','dialogue-198','dialogue-199','dialogue-200','dialogue-201','dialogue-202']);
 for(const d of DIALOGUES.slice(190))assert.ok(d.everyday&&d.everyday.id.startsWith('everyday-dialogue-'),d.id+' everyday provenance');
 assert.ok(!DIALOGUES.slice(0,190).some(d=>d.everyday),'historical dialogues keep empty provenance');
 assert.equal(new Set(DIALOGUES.map(d=>d.title)).size,202,'titles unique');
 assert.equal(DIALOGUES[0].title,'At the library');
 assert.equal(DIALOGUES[189].id,'dialogue-190');
 assert.equal(DIALOGUES.find(d=>d.id==='dialogue-191').lines.length,8);
});

test('everyday dialogues: rows and questions match the merged catalog options',()=>{
 for(const [pack,rows] of [[EVERYDAY_DIALOGUES,EVERYDAY_DIALOGUE_ROWS],[EVERYDAY_DIALOGUES_B,EVERYDAY_DIALOGUE_ROWS_B]]){
  assert.equal(rows.length,pack.length);
  pack.forEach((d,i)=>{
   assert.equal(rows[i][0],d.title);
   assert.deepEqual(rows[i][1],d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]));
   assert.deepEqual(rows[i][2],d.questions.map(q=>[q.prompt,...q.options]));
  });
 }
});

test('everyday dialogues: every character is corpus-traceable or declared new',()=>{
 const corpus=new Set();
 for(const w of WORDS)for(const c of w.hanzi)corpus.add(c);
 for(const l of DEMO_LESSONS){corpus.add(l.hanzi);for(const w of l.words)for(const c of w.hanzi)corpus.add(c);
  for(const c of l.sentence.hanzi)corpus.add(c);if(l.extraSentence)for(const c of l.extraSentence.hanzi)corpus.add(c);}
 for(const s of STORIES)for(const line of s.lines)for(const c of line.hanzi)corpus.add(c);
 for(const d of DIALOGUES.slice(0,190))for(const l of d.lines)for(const c of l.hanzi)corpus.add(c);
 const text=[...ALL_TURNS.map(t=>t.hanzi),...COLLOQUIAL_GRAMMAR_ROWS.flat(Infinity).filter(x=>typeof x==='string')].join('');
 for(const ch of text.match(/[\u4e00-\u9fff]/g)||[]){
  assert.ok(corpus.has(ch)||NEW_CHARS.has(ch),'untraceable character in new content: '+ch);
 }
});

test('colloquial grammar: nine spoken-pattern lessons follow the grammar schema',()=>{
 const ids=COLLOQUIAL_GRAMMAR_ROWS.map(r=>r[0]);
 assert.deepEqual(ids,['g182','g183','g184','g185','g186','g187','g188','g189','g190']);
 assert.equal(GRAMMAR_LESSONS.length,190);
 for(const r of COLLOQUIAL_GRAMMAR_ROWS){
  assert.ok(CHAPTERS.has(r[1]),r[0]+' chapter');
  const lesson=findGrammarLesson(r[0]);
  assert.ok(lesson&&lesson.title&&lesson.pattern&&lesson.explanation&&lesson.contrast&&lesson.pitfall,r[0]+' prose');
  for(const ex of [r[8],r[9]])assert.ok(parseable(ex[1]),r[0]+' example pinyin parses');
  assert.equal(r[10][4],r[10][0].replace('＿＿',r[10][1]),r[0]+' cloze completed matches');
  assert.ok(r[10][1]!==r[10][2]&&r[10][1]!==r[10][3]&&r[10][2]!==r[10][3],r[0]+' cloze options distinct');
  assert.equal(r[11][4].join(''),r[11][1],r[0]+' transformation chunks rebuild the model');
  assert.ok(parseable(r[10][5])&&parseable(r[11][2]),r[0]+' remaining pinyin parses');
  assert.ok(Array.isArray(r[12]),r[0]+' matchTokens');
  assert.equal(GRAMMAR_PRACTICE_TASKS.filter(t=>t.grammarId===r[0]).length,5,r[0]+' practice modes');
 }
});

test('everyday vocabulary: entries merge into the lexicon with usage notes',()=>{
 assert.ok(EVERYDAY_VOCABULARY.length>=50,'substantial vocabulary pack');
 const seen=new Set();
 for(const v of EVERYDAY_VOCABULARY){
  assert.ok(v.hanzi&&v.pinyin&&v.meaning&&v.note,v.hanzi+' fields');
  assert.ok(parseable(v.pinyin),v.hanzi+' pinyin parses: '+v.pinyin);
  assert.ok(!seen.has(v.hanzi),v.hanzi+' unique in pack');seen.add(v.hanzi);
  const word=WORDS.find(w=>w.hanzi===v.hanzi);
  assert.ok(word,v.hanzi+' present in WORDS');
  assert.ok(word.senses.includes(v.meaning),v.hanzi+' sense merged');
  assert.ok(word.notes.length>0,v.hanzi+' usage note present');
  assert.ok(word.source.includes('everyday'),v.hanzi+' source labelled');
  assert.equal(word.officialHskLevel,null,v.hanzi+' no HSK claims');
 }
});

test('erhua pinyin: the grader accepts r-suffix pinyin that real content uses',()=>{
 assert.ok(parsePinyin('nǎr'),'nar parses');
 assert.deepEqual(parsePinyin('yìdiǎnr').map(s=>s.syllable+':'+s.tone),['yi:4','dian:3','r:5']);
 assert.equal(evaluatePinyin('zhèr','zhèr').correct,true);
 const turn=EVERYDAY_DIALOGUES[0].turns[7];
 assert.ok(turn.hanzi.includes('这')&&turn.pinyin.includes('zhèr'),'fixture turn uses erhua');
 const verdict=gradeMission({kind:'pinyin',prompt:'x',answer:turn.pinyin},turn.pinyin.replace('Zhèr','zhèr'));
 assert.equal(verdict.correct,true,'erhua mission target is gradable');
});

test('preservation: lessons, historical grammar and pre-existing words are untouched',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(findGrammarLesson('g01').title,'Basic subject–verb–object order');
 assert.equal(findGrammarLesson('g181').title,'Topic-first sentences and dropped subjects');
 const aihao=WORDS.find(w=>w.hanzi==='爱好');
 assert.deepEqual(aihao.senses,['hobby; interest']);
 assert.equal(aihao.source,'original-demonstration');
});
