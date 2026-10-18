import test from 'node:test';
import assert from 'node:assert/strict';
import {PINYIN_SANDHI,PINYIN_WORD_MODELS,PINYIN_QUESTIONS,evaluateSoundQuestion} from '../src/pinyin-foundations.mjs';
import {renderPinyinScreen} from '../src/pinyin-screen.mjs';
import {evaluatePinyin} from '../src/exercises.mjs';
import {freshState} from '../src/study.mjs';

const cases=[
 {hanzi:'不是',base:'bù shì',spoken:'bú shì',index:2},
 {hanzi:'一个',base:'yī gè',spoken:'yí ge',index:3},
 {hanzi:'一天',base:'yī tiān',spoken:'yì tiān',index:4}
];
test('P24 authorial source separates original citation tones and connected-speech forms',()=>{
 assert.equal(PINYIN_SANDHI.length,8);
 for(const {hanzi,base,spoken,index} of cases){
  const row=PINYIN_SANDHI[index];
  assert.equal(row.hanzi,hanzi);
  assert.equal(row.lexical,base);
  assert.equal(row.spoken,spoken);
  assert.notEqual(row.lexical,row.spoken,'base and contextual tone must differ');
  assert.match(row.explanation,/citation|underlying|isolation/i);
 }
 assert.match(PINYIN_SANDHI[3].explanation,/neutral ge/);
 assert.match(PINYIN_SANDHI[3].explanation,/fourth tone/);
});
test('P24 unchanged source-owned graded examples preserve existing sandhi answers',()=>{
 const existing=[['不是','bú shì'],['一个','yí ge'],['一天','yì tiān']];
 for(const [hanzi,spoken] of existing){
  assert.equal(PINYIN_WORD_MODELS.find(x=>x.hanzi===hanzi)?.pinyin,spoken);
  const sourceQuestion=PINYIN_QUESTIONS.find(x=>x.kind==='pinyin'&&x.displayText===hanzi);
  assert.ok(sourceQuestion,hanzi);
  assert.equal(sourceQuestion.answer,spoken);
  assert.equal(evaluateSoundQuestion(sourceQuestion,spoken).correct,true);
  assert.equal(evaluatePinyin(spoken,spoken).correct,true);
 }
 for(const index of [2,3,4]){
  const question=PINYIN_QUESTIONS.find(x=>x.id==='sandhi-'+index);
  assert.ok(question,'original task key preserved');
  assert.equal(question.answer,PINYIN_SANDHI[index].subtitle);
 }
});
test('P24 learner-facing screen labels citation and contextual tone separately without new grading',()=>{
 const action=(name,label,cls='',attr='')=>'<button data-action="'+name+'" '+attr+'>'+label+'</button>';
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const state=freshState(),before=JSON.stringify(state);
 const html=renderPinyinScreen({section:'sandhi'},action,esc,()=>'','');
 assert.match(html,/Citation\/base tones: bù shì/);
 assert.match(html,/Contextual spoken guide: bú shì/);
 assert.match(html,/Citation\/base tones: yī gè/);
 assert.match(html,/Contextual spoken guide: yí ge/);
 assert.match(html,/Citation\/base tones: yī tiān/);
 assert.match(html,/Contextual spoken guide: yì tiān/);
 assert.match(html,/not independently verified audio/);
 assert.doesNotMatch(html,/Written: bú shì/);
 assert.equal(JSON.stringify(state),before);
});
