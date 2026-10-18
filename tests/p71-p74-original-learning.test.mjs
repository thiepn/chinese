import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P71_MANUSCRIPTS} from '../src/p71-manuscripts.mjs';
import {P71_SOURCE_READINGS,P71_READING_ROWS} from '../src/p71-reading-course.mjs';
import {STORIES,validateStory,storyExercise} from '../src/stories.mjs';
import {beginnerQuestion,beginnerWritingTask} from '../src/beginner-reading.mjs';
import {GRAMMAR_LESSONS} from '../src/grammar-course.mjs';
import {auditReadingSource,readingReviewPacket,p68NativeTransfer,auditReadingInventory} from '../src/reading-editorial-c9.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {freshState} from '../src/study.mjs';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action=(name,label,cls='',extra='')=>'<button data-action="'+escape(name)+'" '+extra+'>'+label+'</button>';
test('P71 adds five genuinely different ten-line bilingual source manuscripts without changing historical IDs',()=>{
 assert.equal(P71_MANUSCRIPTS.length,5);assert.equal(P71_SOURCE_READINGS.length,5);assert.equal(P71_READING_ROWS.length,5);
 const passages=STORIES.filter(s=>s.beginner?.source==='original-p71');
 assert.deepEqual(passages.map(s=>s.title),P71_MANUSCRIPTS.map(b=>b.title));
 assert.deepEqual(STORIES.slice(-5),passages);
 const old=STORIES.slice(0,-5);for(let i=0;i<old.length;i++)assert.equal(old[i].id,'story-'+String(i+1).padStart(2,'0'));
 assert.equal(P71_SOURCE_READINGS.reduce((n,s)=>n+s.lines.length,0),50);
 assert.equal(P71_SOURCE_READINGS.reduce((n,s)=>n+s.questions.length,0),15);
 const unique=new Set(),grammarIds=new Set(GRAMMAR_LESSONS.map(g=>g.id));
 for(let i=0;i<passages.length;i++){
  const story=passages[i],source=P71_SOURCE_READINGS[i];
  assert.equal(story.beginner.p71,source);assert.equal(story.origin,'original-p71-upper-intermediate-original-reading');
  assert.equal(story.approval,'DEMO_ONLY');assert.equal(story.officialHskLevel,null);
  assert.equal(source.approval,'DEMO_ONLY');assert.equal(source.officialHskLevel,null);
  assert.equal(source.level,6);assert.equal(story.lines.length,10);assert.equal(source.questions.length,3);
  assert.ok(validateStory(story),'story source contract '+story.title);
  assert.equal(source.order.join(''),story.lines[9].hanzi);
  assert.equal(source.writing.hanzi,story.lines[9].hanzi);
  assert.equal(source.listeningCue.hanzi,story.lines[source.listeningCue.lineIndex].hanzi);
  assert.ok(story.lines.some(l=>l.hanzi.includes(source.focusWord.hanzi)));
  assert.equal(new Set(source.questions.map(q=>q.evidence)).size,3);
  for(const q of source.questions)assert.ok(q.evidence>=0&&q.evidence<10&&q.options.length===4&&new Set(q.options).size===4&&q.explanation);
  for(const b of source.grammarEvidence){
   assert.ok(grammarIds.has(b.grammarId));
   assert.ok(story.lines[b.lineIndex].hanzi.includes(b.token));
  }
  for(const line of story.lines){
   assert.ok(line.hanzi&&line.pinyin&&line.english);assert.ok(!unique.has(line.hanzi),'original sentence duplicate');
   unique.add(line.hanzi);
  }
  for(const mode of ['comprehension','cloze','ordering','pronunciation'])assert.ok(storyExercise(story,mode),mode);
  for(const mode of ['beginner-detail','beginner-reason','beginner-sequence','beginner-writing'])assert.ok(beginnerQuestion(story,mode),mode);
  assert.equal(beginnerWritingTask(story.id).hanzi,story.lines[9].hanzi);
 }
 assert.equal(unique.size,50);
});
test('P71 indexed discourse grammar, source review and bilingual handoffs remain native read-only evidence',()=>{
 const passages=STORIES.filter(s=>s.beginner?.source==='original-p71');
 assert.equal(auditReadingInventory().p71,5);
 for(const story of passages){
  const audit=auditReadingSource(story),trail=p68NativeTransfer(story),packet=readingReviewPacket(story.id);
  assert.deepEqual(audit.issues,[],story.title+': '+audit.issues.join('; '));
  assert.equal(audit.editorialStatus,'unreviewed');
  assert.equal(audit.hskStatus,'not-authoritatively-mapped');
  assert.equal(audit.sourcePath,'src/p71-manuscripts.mjs');
  assert.ok(packet.includes('Status: UNREVIEWED'));
  assert.ok(packet.includes(story.lines[9].hanzi));
  assert.ok(packet.includes('## Exact source grammar bridges'));
  assert.equal(trail.grammar.length,2);
  for(const g of trail.grammar)assert.equal(g.hanzi,story.lines[g.lineIndex].hanzi);
 }
});
test('native P71 source selection, device synthesis and production buttons never write progress by browsing',()=>{
 const story=STORIES.find(s=>s.beginner?.source==='original-p71'),state=freshState(),saved=JSON.stringify(state);
 const html=renderC9ReadingHub(state,story,action,escape,{sourceHelpRevealed:false});
 assert.match(html,/c9-p71-native-course/);
 assert.match(html,/upper-intermediate/i);
 assert.match(html,/device-generated Chinese speech/);
 assert.equal((html.match(/class="c9-p71-listening"/g)||[]).length,5);
 assert.equal((html.match(/data-action="speak"/g)||[]).length>=5,true);
 assert.equal((html.match(/data-mode="beginner-reason"/g)||[]).length,5);
 assert.equal((html.match(/data-mode="beginner-sequence"/g)||[]).length,5);
 assert.equal((html.match(/data-mode="beginner-writing"/g)||[]).length,5);
 assert.ok(html.includes('data-action="c9-reading-review-copy"'));
 assert.match(html,/Bilingual explanation withheld/);
 assert.equal(JSON.stringify(state),saved);
});
test('source modules preserve demo status and exact paired offline revision, no recorded or official audio',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 const src=readFileSync(new URL('../src/p71-manuscripts.mjs',import.meta.url),'utf8');
 assert.match(app,/character-study-working-v80-learner-next-action-placement/);
 assert.match(sw,/character-study-working-v80-learner-next-action-placement/);
 assert.doesNotMatch(src,/\b(fetch|localStorage|indexedDB|addReadingEvent|addSentenceEvent)\s*\(/);
 assert.doesNotMatch(src,/officialHskLevel:[1-9]/);
});
