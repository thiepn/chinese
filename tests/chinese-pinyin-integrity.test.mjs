// Regression suite: 修改稿 must be taught and graded as xiūgǎigǎo (改 = gǎi).
// The source previously carried "xiūgǎogǎo" in eight pinyin references and
// sentence transcriptions across P46/P47/P49/P50, which made evaluatePinyin
// reject the correct pronunciation and accept the wrong one on the
// demo-348 word-reading card. These tests pin the corrected reference through
// the canonical lesson data, the review card, and the grading evaluator, and
// guard every affected source context against silent reappearance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir,readFile } from 'node:fs/promises';
import { join,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';
import { findP46Guide } from '../src/p46-foundations.mjs';
import { cardInfo } from '../src/study.mjs';
import { evaluatePinyin } from '../src/exercises.mjs';
import { WORDS,wordsForWrittenForm } from '../src/lexicon.mjs';
import { P46_CHARS_A } from '../src/p46-chars-a.mjs';
import { P46_DIALOGUES_A } from '../src/p46-dialogues-a.mjs';
import { P46_READINGS_A } from '../src/p46-readings-a.mjs';
import { P47_READINGS_A } from '../src/p47-reading-a.mjs';
import { P49_CASES_C } from '../src/p49-cases-c.mjs';
import { P50_CHAR_C } from '../src/p50-character-c.mjs';

const WORD='修改稿';
const CORRECT='xiūgǎigǎo';
const WRONG=/[Xx]iūgǎogǎo/g;
const srcDir=join(dirname(fileURLToPath(import.meta.url)),'..','src');
const count=(text,re)=>(text.match(new RegExp(re.source,'g'))||[]).length;

// The canonical lesson and its word-reading review card, derived through the
// same adapters the application uses.
const lesson=DEMO_LESSONS.find(l=>l.words.some(w=>w.hanzi===WORD));
const wordIndex=lesson?lesson.words.findIndex(w=>w.hanzi===WORD):-1;
const word=wordIndex>=0?lesson.words[wordIndex]:null;
const card=lesson?cardInfo(`${lesson.id}:wordread${wordIndex}`):null;

test('A: canonical 修改稿 word reference is xiūgǎigǎo',()=>{
 assert.ok(lesson,'修改稿 must exist in the canonical lesson corpus');
 assert.equal(lesson.id,'demo-348','historical lesson identity must be preserved');
 assert.equal(word.pinyin,CORRECT);
 assert.equal(word.hanzi,WORD,'hanzi must be preserved');
 assert.equal(word.english,'revised draft','English meaning must be preserved');
 const guide=findP46Guide('稿');
 const guideWord=guide.words.find(w=>w.hanzi===WORD);
 assert.ok(guideWord,'P46 source adapter must expose the 修改稿 word');
 assert.equal(guideWord.pinyin,CORRECT);
 const lexiconWords=wordsForWrittenForm(WORD);
 assert.ok(lexiconWords.length>0,'lexicon must index 修改稿');
 for(const entry of lexiconWords)assert.equal(entry.pinyin,CORRECT,'lexicon reference for 修改稿 must be correct');
 assert.ok(WORDS.some(w=>w.hanzi===WORD&&w.pinyin===CORRECT));
});

test('B: word-reading review card exposes the corrected reference',()=>{
 assert.ok(card,`cardInfo must expose the ${lesson.id}:wordread${wordIndex} review card`);
 assert.equal(card.answer,CORRECT);
 assert.equal(card.prompt,WORD);
 assert.equal(card.kind,'pinyin');
 assert.match(card.question,/pinyin/i);
});

test('C: evaluatePinyin accepts xiūgǎigǎo and its numeric-tone equivalent',()=>{
 assert.equal(evaluatePinyin(CORRECT,card.answer).correct,true);
 assert.equal(evaluatePinyin('xiu1gai3gao3',card.answer).correct,true);
 assert.equal(evaluatePinyin(card.answer,CORRECT).correct,true);
});

test('D: evaluatePinyin rejects xiūgǎogǎo',()=>{
 assert.equal(evaluatePinyin('xiūgǎogǎo',card.answer).correct,false);
 assert.equal(evaluatePinyin('Xiūgǎogǎo',card.answer).correct,false);
 assert.equal(evaluatePinyin('xiugaogao3',card.answer).correct,false);
});

test('E: every affected P46/P47/P49/P50 source context uses the correct pronunciation',()=>{
 // [raw source export, module label, known pinyin transcriptions of 修改稿]
 const contexts=[
  [P46_CHARS_A,'p46-chars-a.mjs',2],
  [P46_DIALOGUES_A,'p46-dialogues-a.mjs',1],
  [P46_READINGS_A,'p46-readings-a.mjs',2],
  [P47_READINGS_A,'p47-reading-a.mjs',1],
  [P49_CASES_C,'p49-cases-c.mjs',1],
  [P50_CHAR_C,'p50-character-c.mjs',1],
 ];
 for(const [raw,label,expected] of contexts){
  assert.ok(raw.includes(WORD),label+' must keep its 修改稿 source text');
  assert.equal(count(raw,WRONG),0,label+' must not contain the wrong pronunciation');
  assert.equal(count(raw,/[Xx]iūgǎigǎo/g),expected,
   label+' must keep '+expected+' corrected pronunciation reference(s)');
 }
 // Sentence-level transcriptions, field by field.
 assert.ok(P46_CHARS_A.includes('修改稿~xiūgǎigǎo~revised draft'),'P46 word entry transcription');
 assert.ok(P46_CHARS_A.includes('Zhè shì xiūgǎigǎo, hái xūyào qǐng lǎoshī tíchū yìjiàn.'),'P46 example sentence transcription');
 assert.ok(P46_DIALOGUES_A.includes('dànshì xiūgǎigǎo hái xūyào fùzérén shěnhé'),'P46 dialogue turn transcription');
 assert.ok(P46_READINGS_A.includes('Xiǎo Huáng zài xiūgǎigǎo zhōng'),'P46 reading line transcription');
 assert.ok(P46_READINGS_A.includes('bǎ xiūgǎigǎo lìkè fā dào'),'P46 reading line transcription');
 assert.ok(P47_READINGS_A.includes('Xiūgǎigǎo zhǐ bàogào èrshí míng'),'P47 sentence-initial transcription');
 assert.ok(P49_CASES_C.includes('xiān tíjiāo xiūgǎigǎo, bú huì'),'P49 case transcript');
 assert.ok(P50_CHAR_C.includes('xiūgǎigǎo cái kěyǐ zhèngshì gōngkāi.'),'P50 example sentence transcription');
});

test('F: the previous incorrect spelling cannot silently reappear',async()=>{
 const rawSources=[P46_CHARS_A,P46_DIALOGUES_A,P46_READINGS_A,P47_READINGS_A,P49_CASES_C,P50_CHAR_C];
 for(const raw of rawSources)assert.equal(count(raw,WRONG),0);
 assert.equal(count(JSON.stringify(DEMO_LESSONS),WRONG),0,'canonical lessons must not reintroduce the wrong spelling');
 assert.equal(count(JSON.stringify(WORDS),WRONG),0,'lexicon must not reintroduce the wrong spelling');
 for(const name of (await readdir(srcDir)).filter(n=>n.endsWith('.mjs'))){
  const source=await readFile(join(srcDir,name),'utf8');
  assert.equal(count(source,WRONG),0,'src/'+name+' must not contain the wrong 修改稿 pronunciation');
 }
});
