import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {GRAMMAR_LESSONS} from '../src/grammar-course.mjs';
import {hskTargetPractice,hskTargetLessons,renderC9HSKTargets,HSK_TARGETS} from '../src/hsk-targets-c9.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(action,label,style='',extra='')=>'<button data-action="'+esc(action)+'" '+extra+'>'+label+'</button>';

test('HSK target 1–5 each exposes real, disjoint, source-owned grammar and reading and dialogue collections',()=>{
 const seenGrammar=new Set(),seenReading=new Set(),seenDialogue=new Set();
 for(const t of HSK_TARGETS.slice(0,5)){
  const m=hskTargetPractice(t.id);
  assert.ok(hskTargetLessons(t.id).length>0,'missing original lessons at '+t.id);
  assert.ok(m.grammar.length>0,'missing original grammar at '+t.id);
  assert.ok(m.readings.length>0,'missing original reader at '+t.id);
  assert.ok(m.dialogues.length>0,'missing original listening/dialogue at '+t.id);
  for(const g of m.grammar){assert.ok(GRAMMAR_LESSONS.includes(g));assert.ok(!seenGrammar.has(g.id));seenGrammar.add(g.id);}
  for(const s of m.readings){assert.ok(STORIES.includes(s));assert.ok(!seenReading.has(s.id));seenReading.add(s.id);assert.equal(s.officialHskLevel,null);assert.equal(s.approval,'DEMO_ONLY');}
  for(const d of m.dialogues){assert.ok(DIALOGUES.includes(d));assert.ok(!seenDialogue.has(d.id));seenDialogue.add(d.id);}
 }
 assert.equal(seenGrammar.size,GRAMMAR_LESSONS.length,'Original grammar engine is represented exactly once without renumbering');
});
test('HSK target 6 has original reading + P75/P77 dialogue sources, 7-9 only advanced missions (not fabricated vocabulary)',()=>{
 const s=hskTargetPractice('6');
 assert.equal(s.grammar.length,0);
 assert.equal(s.readings.length,5);
 assert.ok(s.dialogues.some(d=>d.p75));
 assert.ok(s.dialogues.some(d=>d.p77));
 assert.ok(s.dialogues.every(d=>d.p75||d.p77));
 assert.ok(s.missions.every(m=>m.band===6));
 const advanced=hskTargetPractice('7-9');
 assert.deepEqual(advanced.grammar,[]);
 assert.deepEqual(advanced.readings,[]);
 assert.deepEqual(advanced.dialogues,[]);
 assert.ok(advanced.missions.length>0);
 assert.ok(advanced.missions.every(m=>m.band>=7));
 assert.deepEqual(hskTargetPractice('bogus'),{grammar:[],readings:[],dialogues:[],missions:[]});
});
test('Every level renders only valid native source selection actions, not shadow tasks or official examination scores',()=>{
 const state=freshState(),orig=JSON.stringify(state);
 for(const t of HSK_TARGETS){
  const html=renderC9HSKTargets(state,t.id,act,esc),m=hskTargetPractice(t.id);
  assert.ok(html.includes('provisional'),'No fake certification for '+t.id);
  if(m.grammar.length)assert.ok(html.includes('data-action="grammar-select" data-id="'+m.grammar[0].id+'"'));
  if(m.readings.length)assert.ok(html.includes('data-action="c9-media-open-story"'));
  if(m.dialogues.length)assert.ok(html.includes('data-action="c9-media-open-dialogue" data-id="'+m.dialogues[0].id+'"'));
  for(const s of m.readings)assert.equal(s.officialHskLevel,null);
 }
 assert.equal(JSON.stringify(state),orig,'Browsing must not introduce a lesson or grade a response');
 const source=readFileSync(new URL('../src/hsk-targets-c9.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/\b(addReadingEvent|addDialogueEvent|addSentenceEvent|indexedDB|localStorage|fetch|speechSynthesis)\s*\(/);
 assert.doesNotMatch(source,/officialHskLevel:\s*[1-9]/);
 assert.equal(DEMO_LESSONS.length,428);
});
test('All native source IDs preserve the existing authoritative exercise semantics',()=>{
 const a=hskTargetPractice('3');
 for(const g of a.grammar)assert.ok(/^g\d+$/.test(g.id));
 for(const story of a.readings)assert.ok(story.id.startsWith('story-')&&story.lines.every(l=>l.hanzi&&l.pinyin&&l.english));
 for(const d of a.dialogues)assert.ok(d.id.startsWith('dialogue-')&&d.questions.every(q=>q.id.startsWith(d.id+':q')));
});
