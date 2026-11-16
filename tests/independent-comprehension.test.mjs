// Independent comprehension suite: reading readiness metering, meaning-radical
// teaching, and the assessment-honesty fixes are accurate, leak-free and safe.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { studiedHanzi,storyReadiness } from '../src/reading-readiness.mjs';
import { MEANING_RADICALS,SEMANTIC_OF,radicalOf,semanticOf } from '../src/meaning-radicals.mjs';
import { PHONETIC_FAMILIES } from '../src/phonetic-families.mjs';
import { DRILL_MODES,buildDrill,validateDrills } from '../src/drills.mjs';
import { freshState,addLesson,scheduleWord } from '../src/study.mjs';
import { STORIES } from '../src/stories.mjs';
import { WORDS,findWord } from '../src/lexicon.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';

test('reading readiness: studied set derives from every real source',()=>{
 const empty=studiedHanzi(freshState());
 assert.equal(empty.size,0);
 let s=addLesson(freshState(),'demo-01',1000);
 const known=studiedHanzi(s);
 assert.ok(known.has('我')&&known.has('我们')&&known.has('我的'),'learned lesson characters and words count');
 s=scheduleWord(s,'打包|dabao',1000);
 assert.ok(studiedHanzi(s).has('打包'),'scheduled deck words count');
});

test('reading readiness: coverage math is honest and counts each word once',()=>{
 const story=STORIES.find(x=>x.beginner?.source==='original-everyday-reading');
 const base=storyReadiness(freshState(),story);
 assert.ok(base.used>0&&base.percent===0,'a fresh learner knows none of the words');
 let s=freshState();
 for(const w of base.unknown.slice(0,5))s=scheduleWord(s,w.key);
 const after=storyReadiness(s,story);
 assert.equal(after.percent,Math.round(100*after.covered/after.used));
 assert.ok(after.percent>base.percent,'studying words raises readiness');
 assert.equal(after.unknown.length,base.unknown.length-5);
 // No word contained inside another matched word is counted separately.
 for(const w of after.unknown)assert.ok(!after.unknown.some(o=>o!==w&&o.hanzi.includes(w.hanzi)),'no substring double counting: '+w.hanzi);
 for(const w of base.unknown)assert.ok(findWord(w.key),'unknown entries are real lexicon words');
 // Labels follow measured coverage: fully covered vs untouched.
 const tiny={lines:[{hanzi:'我们我的。'}]};
 const unready=storyReadiness(freshState(),tiny);
 assert.equal(unready.percent,0);
 assert.ok(unready.label.includes('Many new words'),'fresh learner sees a study-first label');
 const ready=storyReadiness(addLesson(freshState(),'demo-01',1000),tiny);
 assert.equal(ready.percent,100,'both words of the fixture are demo-01 words');
 assert.equal(ready.label,'Ready to read independently','a fully covered reading is labeled ready');
});

test('meaning radicals: dataset integrity and honest semantics',()=>{
 const glyphs=new Set();
 for(const r of MEANING_RADICALS){
  assert.ok(r.glyph&&r.name&&r.meaning,r.glyph+' fields');
  assert.ok(!glyphs.has(r.glyph),r.glyph+' unique');glyphs.add(r.glyph);
  assert.ok(r.examples.length>=2&&r.examples.every(e=>e.length>=1),r.glyph+' examples');
 }
 assert.ok(MEANING_RADICALS.length>=45,'a substantial reference');
 for(const [hanzi,glyph] of Object.entries(SEMANTIC_OF)){
  assert.ok(radicalOf(glyph),hanzi+' semantic mapping resolves: '+glyph);
 }
 assert.equal(semanticOf('清').glyph,'氵');
 assert.equal(semanticOf('房').glyph,'户');
 assert.equal(semanticOf('我'),null,'unauthored characters stay honest');
 const familyChars=new Set(PHONETIC_FAMILIES.flatMap(f=>f.members.map(m=>m.hanzi)));
 for(const hanzi of Object.keys(SEMANTIC_OF))assert.ok(familyChars.has(hanzi),'semantic data covers family members: '+hanzi);
});

test('radical-clue drill: unambiguous options and honest framing',()=>{
 assert.ok(DRILL_MODES.includes('radical-clue'));
 assert.equal(validateDrills(),true);
 for(let i=1;i<=428;i++){
  const d=buildDrill('demo-'+String(i).padStart(2,'0'),'radical-clue');
  assert.equal(new Set(d.options).size,4,i+' distinct options');
  assert.ok(d.options.includes(d.answer),i+' answer present');
  assert.ok(d.explanation.includes('Hints, not guarantees.'),i+' honest framing');
  const byGlyph=new Map(MEANING_RADICALS.map(r=>[r.glyph,r]));
  const byMeaning=new Map(MEANING_RADICALS.map(r=>[r.meaning,r]));
  const pick=byGlyph.get(d.answer)||byMeaning.get(d.answer);
  const others=d.options.filter(o=>o!==d.answer).map(o=>byGlyph.get(o)||byMeaning.get(o));
  assert.ok(pick&&others.every(Boolean),i+' options resolve to radicals');
  assert.ok(others.every(r=>r.name!==pick.name),i+' no near-duplicate distractor of the same component family');
  assert.equal(new Set(others.map(r=>r.name)).size,3,i+' distractor names distinct');
 }
});

test('assessment honesty: listening drills hide the target and word-deck evidence is separated',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes("listeningNow"),'listening modes anonymize the lesson selector');
 assert.ok(app.includes('The target text stays hidden while this listening drill is active'),'the honesty note renders');
 assert.ok(app.includes("startsWith('word:')&&type.some"),'character buckets exclude word-deck events');
 assert.ok(app.includes("['Scheduled vocabulary',null,()=>deckEvidence]"),'word-deck evidence has its own label');
 // Every drill mode must have a practice tab (a smoke run caught unreachable modes).
 const tabSegment=app.split('practice-tabs')[1]?.split('</div>')[0]||'';
 assert.ok(tabSegment.includes('drill-mode'),'practice tab list present');
 for(const mode of DRILL_MODES)assert.ok(tabSegment.includes("'"+mode+"'"),'practice tab exists for '+mode);
});

test('preservation: core identities are untouched',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(STORIES.length,176);
 assert.equal(WORDS.length,1130);
 assert.equal(DRILL_MODES.length,11);
});
