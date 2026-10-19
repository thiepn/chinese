import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DIALOGUES,findDialogue,dialogueQuestion,addDialogueEvent} from '../src/dialogues.mjs';
import {P75_DIALOGUES,P75_DIALOGUE_ROWS,findP75Dialogue} from '../src/p75-dialogues.mjs';
import {STORIES} from '../src/stories.mjs';
import {renderC9DialogueHub,renderC9P75DialogueEvidence,renderC9ReadingHub} from '../src/media-c9.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,css='',attrs='')=>'<button data-action="'+esc(name)+'" '+attrs+'>'+label+'</button>';
const native=DIALOGUES.filter(d=>d.p75);
test('five new authorial dialogues append after historical dialogue IDs and expose 40 unique full Mandarin turns',()=>{
 assert.equal(P75_DIALOGUES.length,5);
 assert.equal(P75_DIALOGUE_ROWS.length,5);
 assert.equal(native.length,5);
 assert.deepEqual(DIALOGUES.slice(-10,-5),native);
 assert.equal(DIALOGUES.slice(-5).every(d=>Boolean(d.p77)),true);
 const old=DIALOGUES.slice(0,-5);
 for(let i=0;i<old.length;i++)assert.equal(old[i].id,'dialogue-'+String(i+1).padStart(2,'0'));
 const titles=new Set(),turns=new Set(),sourceIds=new Set();
 for(const [i,d] of native.entries()){
  const source=P75_DIALOGUES[i];
  assert.equal(d.p75,source);
  assert.equal(findP75Dialogue(source.id),source);
  assert.equal(findDialogue(d.id),d);
  assert.equal(source.approval,'DEMO_ONLY');
  assert.equal(source.editorialStatus,'unreviewed');
  assert.equal(source.officialHskLevel,null);
  assert.equal(d.lines.length,8);
  assert.equal(d.questions.length,3);
  assert.ok(!titles.has(d.title));titles.add(d.title);
  assert.ok(!sourceIds.has(source.readingId));sourceIds.add(source.readingId);
  const related=STORIES.find(story=>story.beginner?.p71?.id===source.readingId);
  assert.ok(related,'source-owned canonical companion reading '+source.readingId);
  assert.equal(related.approval,'DEMO_ONLY');
  const speakers=new Set(d.lines.map(turn=>turn.speaker));
  assert.ok(speakers.size>=2,'genuine negotiated multi-speaker exchange');
  for(const turn of d.lines){
   assert.ok(turn.hanzi.trim()&&turn.pinyin.trim()&&turn.english.trim());
   assert.ok(!turns.has(turn.hanzi),'new source dialogue line duplicated');
   turns.add(turn.hanzi);
  }
  for(const [j,q] of source.questions.entries()){
   assert.equal(dialogueQuestion(d.id,j).answer,q.answer);
   assert.ok(d.questions[j].options.includes(q.answer));
   assert.equal(new Set(q.options).size,4);
   assert.ok(Number.isInteger(q.evidenceIndex)&&q.evidenceIndex>=0&&q.evidenceIndex<8);
   assert.ok(q.explanation.length>30);
   assert.equal(d.lines[q.evidenceIndex].hanzi,source.turns[q.evidenceIndex].hanzi);
  }
 }
 assert.equal(turns.size,40);
 assert.equal(native.reduce((n,x)=>n+x.questions.length,0),15);
});
test('only native dialogue event writer may record source responses, assisted evidence stays honest',()=>{
 const original=freshState(),snapshot=JSON.stringify(original),d=native[0],q=d.questions[0];
 const first=addDialogueEvent(original,{id:'p75-native-a',dialogueId:d.id,question:0,answer:q.answer,assisted:false,at:1700000000000});
 assert.equal(JSON.stringify(original),snapshot);
 assert.equal(first.dialogueEvents.at(-1).correct,true);
 assert.equal(first.dialogueEvents.at(-1).assisted,false);
 const second=addDialogueEvent(first,{id:'p75-native-b',dialogueId:d.id,question:0,answer:q.answer,assisted:true,at:1700000001000});
 assert.equal(second.dialogueEvents.at(-1).assisted,true);
 assert.equal(second.dialogueEvents.at(-1).correct,true);
 assert.equal(findDialogue(d.id),d);
});
test('native conversation shelf and P71 continuation render correctly with original progress and source links',()=>{
 const state=freshState(),before=JSON.stringify(state),d=native[0],story=STORIES.find(s=>s.beginner?.p71?.id===d.p75.readingId);
 const hub=renderC9DialogueHub(state,d,act,esc,{query:'',filter:'all',page:0});
 assert.match(hub,/c9-p75-dialogue-course/);
 assert.match(hub,/DEMO_ONLY/);
 for(const row of native)assert.ok(hub.includes(esc(row.title)));
 assert.equal((hub.match(/c9-p75-dialogue-grid/g)||[]).length,1);
 assert.ok(hub.includes('data-action="c9-media-open-story"'));
 assert.ok(hub.includes('data-action="c9-p71-open-composition"'));
 const read=renderC9ReadingHub(state,story,act,esc,{sourceHelpRevealed:false});
 assert.match(read,/Practise source-linked original conversation/);
 assert.ok(read.includes('data-id="'+d.id+'"'));
 assert.equal(JSON.stringify(state),before);
});
test('new source evidence is withheld until original dialogue submission and cites exact original turn',()=>{
 const d=native[0],q=d.p75.questions[0];
 assert.equal(renderC9P75DialogueEvidence(d,0,null,act,esc),'');
 const shown=renderC9P75DialogueEvidence(d,0,{correct:true,assisted:false},act,esc);
 assert.ok(shown.includes(d.lines[q.evidenceIndex].hanzi));
 assert.ok(shown.includes(esc(d.lines[q.evidenceIndex].pinyin)));
 assert.ok(!shown.includes('<script>'),'Source evidence remains HTML-escaped');
 assert.ok(shown.includes(q.explanation));
 assert.match(shown,/Native answer recorded without source assistance/);
 assert.match(renderC9P75DialogueEvidence(d,0,{correct:true,assisted:true},act,esc),/assisted/);
 assert.equal(renderC9P75DialogueEvidence(DIALOGUES[0],0,{correct:true},act,esc),'');
});
test('P75 authorial data includes no new audio/grader/official HSK values and retains paired offline cache',()=>{
 const source=readFileSync(new URL('../src/p75-dialogues.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/\b(fetch|indexedDB|localStorage|addDialogueEvent|addReadingEvent|gradeCard)\s*\(/);
 assert.doesNotMatch(source,/officialHskLevel:[1-9]/);
 assert.match(source,/DEMO_ONLY/);
 assert.match(app,/character-study-working-v83-pinyin-written-accent-integrity/);
 assert.match(sw,/character-study-working-v83-pinyin-written-accent-integrity/);
 assert.match(app,/if\(dialogueSupport&&\(findDialogue\(dialogueId\)\?\.p34\|\|findDialogue\(dialogueId\)\?\.p75\|\|findDialogue\(dialogueId\)\?\.p77\)\)p34TranscriptViewed=true/);
});
