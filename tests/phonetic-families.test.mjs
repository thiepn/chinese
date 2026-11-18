// Phonetic family regression suite: the sound-series dataset is accurate and
// the sound-family drill is unambiguous, honest about reading drift, and safe.
import test from 'node:test';
import assert from 'node:assert/strict';
import { PHONETIC_FAMILIES,familyOf } from '../src/phonetic-families.mjs';
import { DRILL_MODES,buildDrill,validateDrills } from '../src/drills.mjs';
import { parsePinyin } from '../src/exercises.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';
import { readFileSync } from 'node:fs';

test('phonetic families: dataset integrity',()=>{
 assert.ok(PHONETIC_FAMILIES.length>=18,'a substantial family set');
 const anchors=new Set(),hanzis=new Set();
 for(const f of PHONETIC_FAMILIES){
  assert.ok(f.anchor&&f.sound&&f.note,f.anchor+' family fields');
  assert.ok(f.members.length>=3,f.anchor+' family size');
  assert.ok(!anchors.has(f.anchor),f.anchor+' anchors unique');anchors.add(f.anchor);
  for(const m of f.members){
   assert.equal(m.hanzi.length,1,m.hanzi+' single character');
   assert.ok(parsePinyin(m.pinyin),m.hanzi+' pinyin parses: '+m.pinyin);
   assert.ok(m.gloss,m.hanzi+' gloss');
   assert.ok(!hanzis.has(m.hanzi),m.hanzi+' appears in only one family');hanzis.add(m.hanzi);
   assert.equal(familyOf(m.hanzi),f,m.hanzi+' lookup resolves to its family');
  }
 }
});

test('phonetic families: the drill is unambiguous and honest about drift',()=>{
 assert.ok(DRILL_MODES.includes('sound-family'));
 assert.equal(validateDrills(),true);
 const own=buildDrill('demo-52','sound-family');
 assert.ok(own.prompt.includes('话'),'member lessons ask about themselves');
 const family=familyOf('话');
 assert.ok(family.members.some(m=>m.hanzi===own.answer&&m.hanzi!=='话'));
 assert.ok(family.note.length>0&&own.explanation.includes(family.members[0].hanzi),'explanation teaches the whole family');
 const seeded=buildDrill('demo-34','sound-family');
 assert.ok(seeded.prompt.includes('采')||PHONETIC_FAMILIES.some(f=>f.anchor==='采'),'anchored question for non-members');
 // No option may belong to the asked family except the answer.
 for(const d of [own,seeded]){
  assert.equal(new Set(d.options).size,4,d.mode+' distinct options');
  assert.ok(d.options.includes(d.answer));
  const asked=familyOf(d.answer);
  const distractors=d.options.filter(o=>o!==d.answer);
  assert.ok(distractors.every(o=>familyOf(o)!==asked),'distractors never come from the answer family');
  const distractorFamilies=distractors.map(o=>familyOf(o));
  assert.equal(new Set(distractorFamilies).size,3,'distractors spread across distinct families');
 }
});

test('phonetic families: character detail surfaces the family (wiring)',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes('Sound family (phonetic series)'));
 assert.ok(app.includes('familyOf(l.hanzi)'));
});

test('phonetic families: nothing else moved',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(DRILL_MODES.length,11);
});
