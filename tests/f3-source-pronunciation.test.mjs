import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES,storyExercise} from '../src/stories.mjs';
import {beginnerEvidence} from '../src/beginner-reading-screen.mjs';
import {addReadingEvent} from '../src/reader-records.mjs';
import {freshState} from '../src/study.mjs';
import {toneExplanation} from '../src/tone-coach.mjs';

const advanced=STORIES.filter(story=>['original-p68','original-p71'].includes(story.beginner?.source));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('F3: all eleven original P68/P71 readings quiz exactly their source-owned whole word and tone-marked Pinyin',()=>{
 assert.equal(advanced.length,11);
 assert.equal(advanced.filter(s=>s.beginner.source==='original-p68').length,6);
 assert.equal(advanced.filter(s=>s.beginner.source==='original-p71').length,5);
 for(const story of advanced){
  const source=story.beginner.p68||story.beginner.p71;
  const q=storyExercise(story,'pronunciation'),focus=source.focusWord;
  const cited=story.lines.findIndex(line=>line.hanzi.includes(focus.hanzi));
  assert.ok(cited>=0,story.title);
  assert.equal(q.display,focus.hanzi,story.title);
  assert.equal(q.answer,focus.pinyin,story.title);
  assert.equal(q.evidence,cited,story.title);
  assert.match(q.prompt,/with tones/);
  assert.ok(q.prompt.includes(focus.hanzi));
  assert.ok(q.explanation.includes('authored source focus word'));
  assert.ok(!q.prompt.includes(focus.pinyin),'Pinyin must not appear before answering');
  assert.equal(toneExplanation(focus.pinyin,q.answer).correct,true);
 }
});

test('F3: P71 manuscript grammar-cloze tokens do not displace the authored reading focus',()=>{
 const p71=advanced.filter(story=>story.beginner.source==='original-p71');
 assert.ok(p71.every(story=>story.beginner.p71.focusWord.hanzi!==story.cloze.answer));
 for(const story of p71){
  const question=storyExercise(story,'pronunciation');
  assert.notEqual(question.display,story.cloze.answer,'Must not grade the separate P71 discourse-marker cloze');
  assert.equal(question.answer,story.beginner.p71.focusWord.pinyin);
  assert.ok(storyExercise(story,'cloze').options.includes(story.cloze.answer));
  assert.ok(storyExercise(story,'ordering'));
 }
});

test('F3: original bilingual evidence is available only after answer; writer retains source IDs and assisted distinctions',()=>{
 const story=advanced.find(s=>s.beginner.source==='original-p71');
 const question=storyExercise(story,'pronunciation');
 const original=freshState(),snapshot=JSON.stringify(original);
 assert.equal(beginnerEvidence(story,question,null,esc),'');
 const reviewed=beginnerEvidence(story,question,{correct:true,assisted:false},esc);
 const line=story.lines[question.evidence];
 for(const value of [line.hanzi,line.pinyin,line.english])assert.ok(reviewed.includes(esc(value)));
 assert.ok(reviewed.includes('Evidence · sentence '+(question.evidence+1)));
 const state=addReadingEvent(original,story.id,'pronunciation',true,false,'f3-pron',1000);
 const assisted=addReadingEvent(state,story.id,'pronunciation',true,true,'f3-pron-helped',2000);
 assert.deepEqual(assisted.readingEvents.slice(-2).map(x=>[x.storyId,x.mode,x.correct,x.assisted]),
  [[story.id,'pronunciation',true,false],[story.id,'pronunciation',true,true]]);
 assert.equal(JSON.stringify(original),snapshot);
});

test('F3: historical reader pronunciation remains unchanged, and source adapter does not add any new grade authority',()=>{
 const prior=STORIES.find(s=>!s.beginner||!['original-p68','original-p71'].includes(s.beginner.source));
 assert.ok(prior);
 const q=storyExercise(prior,'pronunciation');
 assert.ok(q&&q.kind==='pinyin'&&q.answer&&q.display);
 assert.equal(q.evidence,undefined);
 const source=readFileSync(new URL('../src/stories.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/\b(addReadingEvent|addDialogueEvent|indexedDB|localStorage|fetch|MediaRecorder)\s*\(/);
 assert.match(source,/focusWord/);
 assert.doesNotMatch(source,/officialHskLevel:[1-9]/);
});
