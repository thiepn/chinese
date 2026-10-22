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
 for(const [plain,expected] of [['hao3','hǎo'],['zhou1','zhōu'],['liu4','liù'],['hui4','huì'],['nv3','nǚ'],['nve4','nüè'],['xie4','xiè'],['xiao1','xiāo']]){
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

// The published P24 406-entry chart and the written-answer engine now share the
// same permitted syllable spellings. Impossible blends must not be rewarded.
test('P24 source syllable grid rejects manufactured Mandarin initial-final combinations',async()=>{
 const {PINYIN_SYLLABLE_GROUPS}=await import('../src/pinyin-syllables.mjs');
 const listed=PINYIN_SYLLABLE_GROUPS.flatMap(g=>g.forms);
 assert.equal(listed.length,406,'reuse the original published P24 inventory');
 assert.equal(new Set(listed).size,406);
 // An unseparated source-owned compound (喜爱 xǐài) remains readable;
 // this phase does not migrate canonical word keys or rewrite legacy authors.
 assert.ok(parsePinyin('xǐài'));
 assert.equal(evaluatePinyin('nue4','nüè').correct,false,'n/l require ü, not bare u');
 assert.deepEqual(parsePinyin('wánr'),[{syllable:'wanr',tone:2}], 'Erhua suffix is one rhotacized syllable');
 assert.equal(evaluatePinyin('wánr','wánr').correct,true,'Preserve original 玩儿 reading and grading');
 assert.equal(parsePinyin('biong'),null,'ng interjection cannot create an invalid blend');
 for(const invalid of ['fiong','biong','shiong','fing','beiong','kiong','piong']){
  assert.ok(!listed.includes(invalid),invalid);
  assert.equal(parsePinyin(invalid),null,invalid);
  assert.equal(evaluatePinyin(invalid+'1','nǐ').reason,'format',invalid);
  assert.equal(evaluatePinyin(invalid+'1',invalid+'1').reason,'source',invalid);
 }
 for(const valid of ['bā','píng','zhōng','xiōng','qióng','nǚ','lüè','yuán','wǒ','xiè','zhī','er2']){
  assert.ok(parsePinyin(valid),valid);
 }
});
test('P24 exact authored syllable inventory remains compatible with original character and word sources',async()=>{
 const {PINYIN_SYLLABLE_GROUPS:fromFoundations,PINYIN_WORD_MODELS}=await import('../src/pinyin-foundations.mjs');
 const {PINYIN_SYLLABLE_GROUPS:fromAuthority}=await import('../src/pinyin-syllables.mjs');
 assert.equal(fromFoundations,fromAuthority,'P24 UI and validation share exact original objects');
 for(const group of fromAuthority){
  for(const syllable of group.forms){
   const parsed=parsePinyin(syllable.replaceAll('ü','v')+'1');
   assert.ok(parsed,syllable);
   assert.equal(parsed.map(s=>s.syllable).join(''),syllable.replaceAll('ü','v'),syllable);
  }
 }
 for(const lesson of DEMO_LESSONS){
  assert.ok(parsePinyin(lesson.pinyin),'Original character '+lesson.id+' '+lesson.pinyin);
  for(const word of lesson.words)assert.ok(parsePinyin(word.pinyin),'Original word '+lesson.id+' '+word.hanzi+' '+word.pinyin);
 }
 for(const model of PINYIN_WORD_MODELS)assert.ok(parsePinyin(model.pinyin),'Original P24 word '+model.hanzi);
});
