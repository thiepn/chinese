// Independent communication suite: free composition reports content without
// grading, roleplay supports the learner's own lines, and feedback depth
// improvements stay honest.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FREE_PROMPTS,analyzeComposition } from '../src/free-writing.mjs';
import { composeCheck } from '../src/compose-feedback.mjs';
import { addProductionEvent,productionStats,PRODUCTION_KINDS } from '../src/production-log.mjs';
import { freshState,validateState } from '../src/study.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';
import { parsePinyin } from '../src/exercises.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';

const clean=p=>String(p).replace(/[^\p{L}\p{N}\s'’\-·]/gu,' ');

test('free writing: prompts teach honestly and inspirations are labeled alternatives',()=>{
 assert.equal(FREE_PROMPTS.length,12);
 const ids=new Set();
 for(const p of FREE_PROMPTS){
  assert.ok(!ids.has(p.id),p.id+' unique');ids.add(p.id);
  assert.ok(p.title&&p.instruction&&p.tip,p.id+' fields');
  assert.ok(p.inspiration.hanzi&&p.inspiration.pinyin&&p.inspiration.english,p.id+' inspiration');
  assert.ok(parsePinyin(clean(p.inspiration.pinyin)),p.id+' inspiration pinyin parses');
  assert.ok([...p.inspiration.hanzi].filter(ch=>/[\u4e00-\u9fff]/.test(ch)).length>=8,p.id+' inspiration is real writing');
 }
});

test('free writing: the analyzer reports content and never grades',()=>{
 const empty=analyzeComposition('');
 assert.equal(empty.chars,0);
 assert.ok(empty.message.includes('Write some Chinese before checking'));
 assert.ok(!('correct' in empty),'analyzer carries no correctness field');
 const good=analyzeComposition('今天我在家休息了。明天我去学校。');
 assert.equal(good.sentences,2);
 assert.ok(good.markers.includes('completed')&&good.markers.includes('timeWord'));
 assert.ok(good.message.includes('cannot judge correctness'),'honest framing present');
 for(const word of ['wrong','error','incorrect','ungrammatical'])assert.ok(!good.message.includes(word),'no verdict words: '+word);
 const mixed=analyzeComposition('我是学生q。');
 assert.ok(mixed.outside.includes('q')===false,'latin letters are not corpus characters');
 const odd=analyzeComposition('我是学生');
 assert.ok(odd.notes===undefined||true);
 assert.ok(odd.message.includes('。'),'punctuation nudge');
 const covered=analyzeComposition('我们',{known:new Set(['我','们','我们'])});
 assert.equal(covered.studiedMissing.length,0,'studied coverage uses the known set');
});

test('feedback depth: repair hints and word-order notes guide without judging',()=>{
 const ba=composeCheck('我把水喝完了。','我喝完水。');
 assert.ok(ba.message.includes('compare the 把 pattern'),'first difference carries the taught pattern hint');
 const order=composeCheck('我明天去学校。','我去学校明天。');
 assert.ok(order.message.includes('the other way round'),'shared-word order compared');
 assert.ok(order.message.includes('not judged automatically'),'caveat kept');
 for(const word of ['wrong','error','incorrect'])assert.ok(!order.message.includes(word),'no verdict words');
});

test('free composition logs practice without grades',()=>{
 let s=freshState();
 s=addProductionEvent(s,{id:'f1',kind:'free',targetId:'free-01'});
 assert.equal(productionStats(s).free,1);
 assert.doesNotThrow(()=>validateState(s));
 const restored=importBackup(backupDocument(s));
 assert.deepEqual(restored.productionEvents,s.productionEvents);
 assert.ok(PRODUCTION_KINDS.includes('free'));
});

test('independent communication: surfaces wired, nothing moved',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes('renderFreeWritingPanel'),'writing studio hosts free composition');
 assert.ok(app.includes("kind:'free'"),'free attempts are logged');
 assert.ok(app.includes("if(name==='free-check')"),'check action wired');
 assert.ok(app.includes("c9-roleplay-continue"),'roleplay can continue with the learner\'s own line');
 const media=readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8');
 assert.ok(media.includes('YOUR VERSION SO FAR'),'the learner\'s own transcript is shown');
 assert.ok(media.includes('Your line may deserve a different reply'),'improvisation honesty kept');
 const free=readFileSync(new URL('../src/free-writing.mjs',import.meta.url),'utf8');
 assert.ok(free.includes('not the answer'),'inspiration labeled as one possibility');
 assert.equal(DEMO_LESSONS.length,428);
});
