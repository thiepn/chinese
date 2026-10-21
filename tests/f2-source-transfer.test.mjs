import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {p76Cases,p76CaseEvidence,renderP76CaseLab} from '../src/p76-case-lab.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES,addDialogueEvent,dialogueQuestion} from '../src/dialogues.mjs';
import {addReadingEvent} from '../src/reader-records.mjs';
import {GRAMMAR_LESSONS} from '../src/grammar-course.mjs';
import {findWord,wordsForWrittenForm} from '../src/lexicon.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,style='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';

test('F2: five cases link exact P71–P75–P77 original evidence and real grammar, word and character identities',()=>{
 const cases=p76Cases();
 assert.equal(cases.length,5);
 assert.equal(new Set(cases.map(c=>c.nextDialogueId)).size,5);
 for(const c of cases){
  const read=STORIES.find(x=>x.id===c.readingId);
  const prior=DIALOGUES.find(x=>x.id===c.dialogueId);
  const next=DIALOGUES.find(x=>x.id===c.nextDialogueId);
  assert.ok(read?.beginner?.p71&&prior?.p75&&next?.p77);
  assert.equal(prior.p75.readingId,read.beginner.p71.id);
  assert.equal(next.p77.previous,prior.p75.id);
  assert.equal(next.p77.readingId,read.beginner.p71.id);
  assert.deepEqual(c.readingEvidence,{...read.lines[c.readingEvidence.index],index:c.readingEvidence.index});
  assert.deepEqual(c.dialogueEvidence,{...prior.lines[c.dialogueEvidence.index],index:c.dialogueEvidence.index});
  assert.equal(c.nextDialogueQuestion,0);
  assert.equal(next.p77.questions[0].evidenceIndex,c.nextDialogueEvidence.index);
  assert.deepEqual(c.nextDialogueEvidence,{...next.lines[c.nextDialogueEvidence.index],index:c.nextDialogueEvidence.index});
  assert.equal(c.nextQuestionExplanation,next.p77.questions[0].explanation);
  assert.equal(c.grammar.length,read.beginner.p71.grammarEvidence.length);
  assert.ok(c.grammar.length>=2);
  for(const g of c.grammar){
   const lesson=GRAMMAR_LESSONS.find(x=>x.id===g.id);
   assert.equal(g.title,lesson.title);
   assert.ok(g.source.hanzi.includes(g.token));
   assert.equal(g.source.hanzi,read.lines[g.lineIndex].hanzi);
   assert.ok(read.beginner.p71.grammarEvidence.some(x=>x.grammarId===g.id&&x.lineIndex===g.lineIndex&&x.token===g.token));
  }
  const focus=read.beginner.p71.focusWord;
  assert.equal(c.focusWord.hanzi,focus.hanzi);
  const options=wordsForWrittenForm(focus.hanzi);
  assert.equal(c.focusWord.wordKey,options.length===1?options[0].key:null);
  if(c.focusWord.wordKey)assert.equal(findWord(c.focusWord.wordKey),options[0]);
  for(const ch of c.characters)assert.ok(DEMO_LESSONS.some(x=>x.id===ch.id&&x.hanzi===ch.hanzi&&focus.hanzi.includes(ch.hanzi)));
  assert.equal(c.approval,'DEMO_ONLY');
  assert.equal(c.officialHskLevel,null);
 }
});

test('F2: no P71/P75/P77 bilingual source, keys, or grammar anchors leak into the unattempted case-lab DOM',()=>{
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderP76CaseLab(state,'',act,esc);
 for(const c of p76Cases()){
  for(const row of [c.readingEvidence,c.dialogueEvidence,c.nextDialogueEvidence]){
   assert.ok(!html.includes(esc(row.hanzi)),'Pre-answer bilingual source exposed: '+c.id);
   assert.ok(!html.includes(esc(row.pinyin)),'Pre-answer pinyin exposed: '+c.id);
  }
  assert.ok(!html.includes(esc(c.nextQuestionExplanation)),'Pre-answer explanation disclosed: '+c.id);
 }
 assert.equal((html.match(/<details>/g)||[]).length,5);
 assert.ok(!html.includes('data-action="grammar-select"'));
 assert.ok(!html.includes('data-action="lookup-word"'));
 assert.ok(html.includes('P77 follow-up evidence withheld'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('F2: true native records unlock only their own stage; incorrect and assisted evidence never becomes independent',()=>{
 const c=p76Cases()[0],original=freshState(),before=JSON.stringify(original);
 const step1=addReadingEvent(original,c.readingId,'beginner-reason',false,true,'f2-read',1000);
 const p1=p76CaseEvidence(step1,c);
 assert.equal(p1.reading.status,'assisted');assert.equal(p1.prior.reviewed,false);assert.equal(p1.followup.reviewed,false);
 const html1=renderP76CaseLab(step1,'',act,esc);
 assert.ok(html1.includes(esc(c.readingEvidence.hanzi)));
 assert.ok(!html1.includes(esc(c.dialogueEvidence.hanzi)));
 assert.ok(!html1.includes(esc(c.nextDialogueEvidence.hanzi)));
 for(const grammar of c.grammar)assert.ok(html1.includes('data-id="'+esc(grammar.id)+'"'));
 if(c.focusWord.wordKey)assert.ok(html1.includes('data-id="'+esc(c.focusWord.wordKey)+'"'));
 const prior=dialogueQuestion(c.dialogueId,c.nativeQuestion);
 const step2=addDialogueEvent(step1,{id:'f2-prior',dialogueId:c.dialogueId,question:c.nativeQuestion,answer:prior.answer,at:2000});
 let state=p76CaseEvidence(step2,c);
 assert.equal(state.prior.status,'independent correct');assert.equal(state.followup.reviewed,false);
 const html2=renderP76CaseLab(step2,'',act,esc);
 assert.ok(html2.includes(esc(c.dialogueEvidence.hanzi)));
 assert.ok(!html2.includes(esc(c.nextDialogueEvidence.hanzi)));
 const next=dialogueQuestion(c.nextDialogueId,c.nextDialogueQuestion);
 const step3=addDialogueEvent(step2,{id:'f2-next',dialogueId:c.nextDialogueId,question:c.nextDialogueQuestion,answer:next.answer,assisted:true,at:3000});
 state=p76CaseEvidence(step3,c);
 assert.equal(state.followup.status,'assisted');assert.equal(state.followup.everIndependent,false);
 const html3=renderP76CaseLab(step3,'',act,esc);
 assert.ok(html3.includes(esc(c.nextDialogueEvidence.hanzi)));
 assert.ok(html3.includes(esc(c.nextQuestionExplanation)));
 const wrong=addDialogueEvent(step3,{id:'f2-later',dialogueId:c.dialogueId,question:c.nativeQuestion,answer:'not the authored choice',at:4000});
 state=p76CaseEvidence(wrong,c);
 assert.equal(state.prior.status,'incorrect');
 assert.equal(state.prior.everIndependent,true);
 assert.match(renderP76CaseLab(wrong,'',act,esc),/earlier independent correct evidence/);
 assert.equal(JSON.stringify(original),before);
 assert.equal(p76CaseEvidence(original,c).followup.attempts,0);
});

test('F2 uses only original read-only projections, no shadow grades or external language claims',()=>{
 const source=readFileSync(new URL('../src/p76-case-lab.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/\b(addReadingEvent|addDialogueEvent|addSentenceEvent|indexedDB|localStorage|fetch|MediaRecorder)\s*\(/);
 assert.match(source,/wordsForWrittenForm/);
 assert.match(source,/grammarEvidence/);
 assert.match(source,/DEMO_ONLY/);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.match(app,/renderC9DialogueHub/);
 assert.match(readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8'),/renderP76CaseLab/);
});
