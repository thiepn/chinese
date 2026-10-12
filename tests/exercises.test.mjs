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
 assert.equal(DEMO_LESSONS.length,74);for(const lesson of DEMO_LESSONS){assert.equal(lesson.words.length,2);assert.ok(lesson.sentence.hanzi.includes(lesson.hanzi));for(const w of lesson.words)assert.ok(w.hanzi.includes(lesson.hanzi));}
});
