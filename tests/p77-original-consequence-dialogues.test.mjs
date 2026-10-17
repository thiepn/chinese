import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P77_DIALOGUES,P77_DIALOGUE_ROWS,findP77Dialogue} from '../src/p77-dialogues.mjs';
import {DIALOGUES,findDialogue,dialogueQuestion,addDialogueEvent} from '../src/dialogues.mjs';
import {STORIES} from '../src/stories.mjs';
import {renderC9DialogueHub,renderC9P75DialogueEvidence} from '../src/media-c9.mjs';
import {p76Cases,renderP76CaseLab} from '../src/p76-case-lab.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,css='',attrs='')=>'<button data-action="'+esc(name)+'" '+attrs+'>'+label+'</button>';
const current=DIALOGUES.filter(d=>d.p77);
test('P77 appends exactly five distinct eight-turn original follow-up dialogues while retaining P75 IDs',()=>{
 assert.equal(P77_DIALOGUES.length,5);
 assert.equal(P77_DIALOGUE_ROWS.length,5);
 assert.deepEqual(DIALOGUES.slice(-5),current);
 assert.equal(current.length,5);
 assert.equal(DIALOGUES.slice(-10,-5).filter(d=>d.p75).length,5);
 assert.equal(DIALOGUES.reduce((n,d)=>n+d.p77?.turns.length||n,0)>=40,true);
 const titles=new Set(),hanzi=new Set(),refs=new Set();
 for(let i=0;i<current.length;i++){
  const d=current[i],source=P77_DIALOGUES[i];
  assert.equal(d.p77,source);
  assert.equal(findP77Dialogue(source.id),source);
  assert.equal(findDialogue(d.id),d);
  assert.equal(source.approval,'DEMO_ONLY');
  assert.equal(source.editorialStatus,'unreviewed');
  assert.equal(source.officialHskLevel,null);
  assert.equal(source.turns.length,8);
  assert.equal(source.questions.length,3);
  assert.ok(!titles.has(source.title));titles.add(source.title);
  assert.ok(!refs.has(source.readingId));refs.add(source.readingId);
  const previous=DIALOGUES.find(item=>item.p75?.id===source.previous);
  const reading=STORIES.find(story=>story.beginner?.p71?.id===source.readingId);
  assert.ok(previous&&reading);
  assert.equal(previous.p75.readingId,source.readingId);
  assert.ok(new Set(d.lines.map(t=>t.speaker)).size>=3,'Requires practical multi-party interaction');
  for(const turn of d.lines){
   assert.ok(turn.hanzi&&turn.pinyin&&turn.english);
   assert.ok(!hanzi.has(turn.hanzi),'No recycled P77 Mandarin line');
   hanzi.add(turn.hanzi);
  }
  for(let j=0;j<3;j++){
   const q=source.questions[j],original=dialogueQuestion(d.id,j);
   assert.equal(original.answer,q.answer);
   assert.ok(original.options.includes(q.answer));
   assert.equal(new Set(q.options).size,4);
   assert.ok(Number.isInteger(q.evidenceIndex)&&q.evidenceIndex>=0&&q.evidenceIndex<8);
   assert.equal(source.turns[q.evidenceIndex].hanzi,d.lines[q.evidenceIndex].hanzi);
   assert.ok(q.explanation.length>40);
  }
 }
 assert.equal(hanzi.size,40);
 assert.equal(current.reduce((n,d)=>n+d.questions.length,0),15);
 const historical=DIALOGUES.slice(0,-5);
 for(let i=0;i<historical.length;i++)assert.equal(historical[i].id,'dialogue-'+String(i+1).padStart(2,'0'));
});
test('native dialogue owns P77 answer events, without inventing listening skill or losing assisted provenance',()=>{
 const original=freshState(),snapshot=JSON.stringify(original),d=current[0],q=dialogueQuestion(d.id,0);
 const response=addDialogueEvent(original,{id:'p77-a',dialogueId:d.id,question:0,answer:q.answer,at:1200,assisted:false});
 assert.equal(response.dialogueEvents.at(-1).correct,true);
 assert.equal(response.dialogueEvents.at(-1).assisted,false);
 assert.equal(JSON.stringify(original),snapshot);
 const helped=addDialogueEvent(response,{id:'p77-b',dialogueId:d.id,question:0,answer:q.answer,at:1300,assisted:true});
 assert.equal(helped.dialogueEvents.at(-1).assisted,true);
 assert.equal(helped.dialogueEvents.at(-1).correct,true);
 const shown=renderC9P75DialogueEvidence(d,0,{correct:true,assisted:true},act,esc);
 assert.ok(shown.includes(d.lines[d.p77.questions[0].evidenceIndex].hanzi));
 assert.ok(shown.includes(esc(d.p77.questions[0].explanation)));
 assert.match(shown,/assisted/);
 assert.equal(renderC9P75DialogueEvidence(d,0,null,act,esc),'');
});
test('five source-owned P77 consequence journeys present native TTS-safe handoffs and original history only',()=>{
 const state=freshState(),before=JSON.stringify(state),d=current[0];
 const hub=renderC9DialogueHub(state,d,act,esc,{query:'',filter:'all',page:0});
 assert.match(hub,/c9-p77-consequence-course/);
 assert.match(hub,/DEMO_ONLY/);
 assert.match(hub,/UNREVIEWED/);
 assert.equal((hub.match(/class="c9-p77-consequence-actions"/g)||[]).length,5);
 for(const row of current)assert.ok(hub.includes(esc(row.title)));
 assert.ok(hub.includes('data-action="c9-media-open-dialogue"'));
 assert.ok(hub.includes('data-action="c9-p71-open-composition"'));
 assert.equal(JSON.stringify(state),before);
 const cases=p76Cases();
 assert.equal(cases.length,5);
 assert.ok(cases.every(c=>current.some(x=>x.id===c.nextDialogueId)));
 const caseHTML=renderP76CaseLab(state,d.id,act,esc);
 assert.ok(caseHTML.includes('Continue with an original follow-up conversation'));
 assert.equal((caseHTML.match(/Continue with an original follow-up conversation/g)||[]).length,5);
});
test('P77 authored source Pinyin matches Chinese demonstrative and contains no extra unscripted role',()=>{
 const ferry=P77_DIALOGUES[1].turns[4];
 assert.ok(ferry.hanzi.startsWith('现在还没有'));
 assert.ok(ferry.pinyin.startsWith('Xiànzài hái méiyǒu'));
 assert.doesNotMatch(ferry.pinyin,/Zǔzhīzhě shuō/);
 assert.ok(ferry.english.startsWith("We don't yet have"));
 const school=P77_DIALOGUES[2].turns[1];
 assert.ok(school.hanzi.startsWith('这些笔记'));
 assert.ok(school.pinyin.startsWith('Zhèxiē bǐjì'));
});
test('no added grader, storage, audio recording or claimed official proficiency in P77 source module',()=>{
 const module=readFileSync(new URL('../src/p77-dialogues.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.doesNotMatch(module,/\b(fetch|indexedDB|localStorage|addDialogueEvent|addReadingEvent|gradeCard|MediaRecorder)\s*\(/);
 assert.match(module,/DEMO_ONLY/);
 assert.match(app,/character-study-working-v75-p77-consequence-dialogues/);
 assert.match(sw,/character-study-working-v75-p77-consequence-dialogues/);
 assert.match(app,/findDialogue\(dialogueId\)\?\.p77/);
});
