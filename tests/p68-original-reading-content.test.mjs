import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P68_SOURCE_READINGS,P68_READING_ROWS} from '../src/p68-source-readings.mjs';
import {STORIES,validateStory,storyExercise} from '../src/stories.mjs';
import {BEGINNER_READING_ROWS} from '../src/beginner-reading-content.mjs';
import {BEGINNER_STORIES,beginnerQuestion,beginnerStoryLinks,beginnerWritingTask} from '../src/beginner-reading.mjs';
import {GRAMMAR_LESSONS} from '../src/grammar-course.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {freshState} from '../src/study.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';
test('P68 adds genuinely authored scenes with six bilingual lines, 3 source-specific evidence questions and a native writing model',()=>{
 assert.equal(P68_SOURCE_READINGS.length,6);
 assert.equal(P68_READING_ROWS.length,6);
 const titles=new Set(),sourceLines=new Set(),grammar=new Set(GRAMMAR_LESSONS.map(g=>g.id));
 for(const [index,r] of P68_SOURCE_READINGS.entries()){
  assert.equal(r.id,'p68-'+String(index+1).padStart(2,'0'));
  assert.equal(r.approval,'DEMO_ONLY');assert.equal(r.officialHskLevel,null);
  assert.ok(!titles.has(r.title));titles.add(r.title);
  assert.equal(r.lines.length,6);assert.equal(r.questions.length,3);
  assert.equal(r.writing.hanzi,r.lines[5].hanzi);
  assert.equal(r.order.join(''),r.lines[5].hanzi);
  assert.ok(r.lines[r.cloze.line].hanzi.includes(r.cloze.answer));
  assert.ok(r.grammarIds.every(id=>grammar.has(id)),'source grammar bridge IDs must exist');
  assert.ok(r.lines.some(l=>l.hanzi.includes(r.focusWord.hanzi)),'word focus must occur in original passage');
  for(const line of r.lines){
   assert.ok(line.hanzi&&line.pinyin&&line.english);
   assert.ok(!sourceLines.has(line.hanzi),'duplicated source sentence across new scenes');
   sourceLines.add(line.hanzi);
  }
  for(const [i,q] of r.questions.entries()){
   assert.equal(q.id,r.id+':q'+(i+1));
   assert.ok(Number.isInteger(q.evidence)&&q.evidence>=0&&q.evidence<6);
   assert.equal(new Set(q.options).size,4);
   assert.equal(q.options[0],q.answer);
   assert.ok(q.explanation.length>=25);
  }
 }
 assert.equal(sourceLines.size,36);
});
test('All P68 source rows append after historical canonical story IDs and reuse sole native readers',()=>{
 const newStories=STORIES.filter(s=>s.beginner?.source==='original-p68');
 assert.equal(newStories.length,6);
 assert.deepEqual(newStories.map(s=>s.title),P68_SOURCE_READINGS.map(r=>r.title));
 assert.deepEqual(STORIES.slice(-11,-5).map(s=>s.id),newStories.map(s=>s.id));
 assert.equal(STORIES.slice(-5).every(s=>s.beginner?.source==='original-p71'),true);
 assert.deepEqual(newStories.map(s=>s.id),[...newStories].map(s=>s.id));
 assert.equal(BEGINNER_READING_ROWS.length,BEGINNER_STORIES.length);
 for(const [i,story] of newStories.entries()){
  assert.ok(validateStory(story));
  assert.equal(story.approval,'DEMO_ONLY');assert.equal(story.officialHskLevel,null);
  assert.equal(story.origin,'original-p68-evidence-reading');
  assert.equal(story.beginner.p68,P68_SOURCE_READINGS[i]);
  const links=beginnerStoryLinks(story);
  assert.ok(links.grammar.length>=1&&links.grammar.every(g=>P68_SOURCE_READINGS[i].grammarIds.includes(g.id)));
  assert.ok(links.words.some(w=>story.lines.some(l=>l.hanzi.includes(w.hanzi))));
  for(const mode of ['comprehension','cloze','ordering','pronunciation']){
   assert.ok(storyExercise(story,mode),'original story engine: '+mode);
  }
  for(const mode of ['beginner-detail','beginner-reason','beginner-sequence','beginner-writing']){
   const q=beginnerQuestion(story,mode);
   assert.ok(q);
   if(mode!=='beginner-writing')assert.equal(q.evidenceLine.hanzi,story.lines[q.evidence].hanzi);
  }
  assert.equal(beginnerWritingTask(story.id).hanzi,story.lines[5].hanzi);
 }
 const oldStories=STORIES.slice(0,-6);
 for(let i=0;i<oldStories.length;i++)assert.equal(oldStories[i].id,'story-'+String(i+1).padStart(2,'0'));
});
test('P68 course UI shows actual source status and native reader handoffs without creating evidence',()=>{
 const newStories=STORIES.filter(s=>s.beginner?.source==='original-p68'),state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9ReadingHub(state,newStories[0],act,esc);
 assert.match(html,/c9-p68-course/);
 assert.match(html,/six-sentence/i);
 assert.match(html,/DEMO_ONLY/);
 for(const s of newStories)assert.ok(html.includes(s.title));
 assert.equal((html.match(/data-action="c9-media-open-story"/g)||[]).length>=6,true);
 assert.match(html,/data-action="c9-reading-queue-start"/);
 assert.equal(JSON.stringify(state),snapshot);
});
test('P68 original curriculum content and app/worker remain offline; no fabricated validation',()=>{
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const manifest=readFileSync(new URL('../src/p68-source-readings.mjs',import.meta.url),'utf8');
 assert.match(sw,/character-study-working-v81-placement-route-focus/);
 assert.match(app,/character-study-working-v81-placement-route-focus/);
 assert.doesNotMatch(manifest,/localStorage|indexedDB|fetch\(|addReadingEvent\(|gradeCard\(|officialHskLevel:[1-9]/);
});
