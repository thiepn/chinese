import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {parsePinyin,evaluatePinyin,evaluateMeaning,evaluateAnswer,makeOptions,makeCloze} from '../src/exercises.mjs';
test('tone-marked and numeric Mandarin pinyin match independently of keyboard convention',()=>{
 for(const [source,input] of [['nǐ','ni3'],['wǒmen','wo3men5'],['xuésheng','xue2sheng'],['xuéxiào','xue2xiao4'],['zhōngwén','zhong1wen2'],['lǜ','lv4'],['lǜ','lü4'],['lǜ','lu:4'],['hǎo','hao3'],['péngyou','peng2you'],['zàijiàn','zai4jian4']]){
  const result=evaluatePinyin(input,source);assert.equal(result.correct,true,`${source} / ${input}: ${JSON.stringify(result)}`);
 }
});
test('tone differs from syllable spelling and empty answers fail conservatively',()=>{
 assert.equal(evaluatePinyin('ma2','mǎ').reason,'tone');
 assert.equal(evaluatePinyin('li3','nǐ').reason,'syllables');
 assert.equal(evaluatePinyin('', 'nǐ').reason,'format');
 assert.equal(evaluatePinyin('ni3?', 'nǐ').reason,'format');
 assert.equal(evaluatePinyin('ni','nǐ').correct,false);
});
test('meaning answers accept only reviewed textual senses, not arbitrary partial strings',()=>{
 assert.equal(evaluateMeaning('  ME ', 'I; me').correct,true);
 assert.equal(evaluateMeaning('the school','school').correct,true);
 assert.equal(evaluateMeaning('a person','person; people').correct,true);
 assert.equal(evaluateMeaning('schoolboy','school').correct,false);
 assert.equal(evaluateMeaning('something else','school').correct,false);
});
test('multiple-choice answers are evaluated literally, with deterministic options',()=>{
 const lesson=DEMO_LESSONS[0];const options=makeOptions(lesson.sentence.english,'sentence',lesson.id);
 assert.equal(options.length,4);assert.ok(options.includes(lesson.sentence.english));assert.deepEqual(options,makeOptions(lesson.sentence.english,'sentence',lesson.id));
 assert.equal(evaluateAnswer(lesson.sentence.english,lesson.sentence.english,'choice').correct,true);
 assert.equal(evaluateAnswer('wrong',lesson.sentence.english,'choice').correct,false);
});
test('cloze exercises preserve the target sentence and avoid fabricated HSK memberships',()=>{
 const matched=DEMO_LESSONS.map(makeCloze).filter(Boolean);assert.ok(matched.length>20);
 for(const x of matched){assert.ok(x.prompt.includes('＿＿'));assert.ok(x.options.includes(x.answer));assert.equal(new Set(x.options).size,x.options.length)}
 assert.ok(DEMO_LESSONS.every(x=>x.officialHskLevel===null&&x.approval==='DEMO_ONLY'));
});
test('all 74 original lessons remain well-formed and contain two related words',()=>{
 assert.ok(DEMO_LESSONS.length>=74);for(const lesson of DEMO_LESSONS.slice(0,74)){assert.equal(lesson.words.length,2);assert.ok(lesson.sentence.hanzi.includes(lesson.hanzi));for(const w of lesson.words)assert.ok(w.hanzi.includes(lesson.hanzi));}
});

test('Mandarin tone-mark orthography never awards credit for the right contour on the wrong vowel',()=>{
 for(const [invalid,correct,numbers] of [
  ['haǒ','hǎo','hao3'],      // a has priority over o
  ['zhoū','zhōu','zhou1'],  // ou marks o, not u
  ['lìu','liù','liu4'],      // shortened iu marks u
  ['hùi','huì','hui4'],      // shortened ui marks i
  ['nǜe','nüè','nve4'],    // üe marks e
  ['xìe','xiè','xie4'],    // e precedes i
  ['xiaō','xiāo','xiao1']   // a before o
 ]){
  assert.equal(evaluatePinyin(invalid,correct).correct,false,invalid);
  assert.equal(evaluatePinyin(invalid,correct).reason,'spelling',invalid);
  assert.equal(evaluatePinyin(correct,numbers).correct,true,correct);
  assert.equal(evaluatePinyin(numbers,correct).correct,true,numbers);
 }
 assert.equal(evaluatePinyin('nǐ haǒ','nǐ hǎo').reason,'spelling');
 assert.equal(evaluatePinyin('hǎo3','hǎo').correct,true,'matching redundant numeric tone is historical accepted input');
 assert.equal(evaluatePinyin('nǐ','nì').reason,'tone','a real tonal contrast remains separate from orthographic location');
});
test('Original Pinyin lessons and numbered orthography agree on accent placement',async()=>{
 const {PINYIN_RULES,PINYIN_WORD_MODELS,toneMarkedSyllable,evaluateSoundQuestion,PINYIN_QUESTIONS}=await import('../src/pinyin-foundations.mjs');
 for(const [plain,expected] of [['hao3','hǎo'],['zhou1','zhōu'],['liu4','liù'],['hui4','huì'],['nv3','nǚ'],['nue4','nuè'],['xie4','xiè'],['xiao1','xiāo']]){
  assert.equal(toneMarkedSyllable(plain),expected,plain);
  assert.equal(evaluatePinyin(expected,plain).correct,true,plain);
 }
 for(const r of PINYIN_RULES.filter(x=>x.id!=='apostrophe'&&x.id!=='spacing')){
  const [numeric,marked]=r.conversion.split(' → ');
  assert.ok(marked, r.id);
  assert.equal(evaluatePinyin(marked,numeric).correct,true,r.id);
 }
 for(const row of PINYIN_WORD_MODELS){
  const q=PINYIN_QUESTIONS.find(x=>x.kind==='pinyin'&&x.displayText===row.hanzi);
  assert.ok(q,row.hanzi);
  assert.equal(q.answer,row.pinyin);
  assert.equal(evaluateSoundQuestion(q,row.pinyin).correct,true,row.hanzi);
 }
});
