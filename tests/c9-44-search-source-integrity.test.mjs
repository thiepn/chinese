import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS,DEMO_IDS,demoSearch,findLesson} from '../src/demo-lessons.mjs';
import {P51_CHARACTERS} from '../src/p51-foundations.mjs';

test('P51 preserves the authored semicolon in the existing gloss without a phantom word',()=>{
 const source=P51_CHARACTERS.find(row=>row.hanzi==='概');
 assert.ok(source);
 assert.deepEqual(source.words,[
  {hanzi:'概括',pinyin:'gàikuò',english:'summarize'},
  {hanzi:'大概',pinyin:'dàgài',english:'approximately; probably'}
 ]);
});

test('All original 428 lesson IDs and approved source word fields remain intact',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(DEMO_IDS.size,DEMO_LESSONS.length);
 for(const lesson of DEMO_LESSONS){
  assert.equal(findLesson(lesson.id),lesson);
  assert.equal(lesson.officialHskLevel,null);
  for(const word of lesson.words){
   for(const key of ['hanzi','pinyin','english'])
    assert.ok(typeof word[key]==='string'&&word[key].trim(),`${lesson.id}: ${key}`);
  }
 }
});

test('Native demo catalog search works for Hanzi, English, plain Pinyin and missing queries',()=>{
 assert.ok(demoSearch('school').some(item=>item.hanzi==='学'));
 assert.ok(demoSearch('xue').some(item=>item.hanzi==='学'));
 assert.ok(demoSearch('书').some(item=>item.hanzi==='书'));
 assert.ok(demoSearch('dàgài').some(item=>item.hanzi==='概'));
 assert.ok(demoSearch('probably').some(item=>item.hanzi==='概'));
 assert.equal(demoSearch('not-found-word-9652').length,0);
});
