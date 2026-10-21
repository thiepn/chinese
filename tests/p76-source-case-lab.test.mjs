import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {p76Cases,renderP76CaseLab} from '../src/p76-case-lab.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES,dialogueQuestion,addDialogueEvent} from '../src/dialogues.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';
test('P76 five distinct original paired-source cases preserve exact canonical source ownership',()=>{
 const cases=p76Cases();assert.equal(cases.length,5);
 assert.equal(new Set(cases.map(c=>c.readingId)).size,5);
 assert.equal(new Set(cases.map(c=>c.dialogueId)).size,5);
 for(const c of cases){
  const story=STORIES.find(s=>s.id===c.readingId),dialogue=DIALOGUES.find(d=>d.id===c.dialogueId);
  assert.ok(story?.beginner?.p71&&dialogue?.p75);
  assert.equal(dialogue.p75.readingId,story.beginner.p71.id);
  assert.strictEqual(c.readingEvidence.hanzi,story.lines[c.readingEvidence.index].hanzi);
  assert.strictEqual(c.dialogueEvidence.hanzi,dialogue.lines[c.dialogueEvidence.index].hanzi);
  assert.ok(dialogueQuestion(c.dialogueId,c.nativeQuestion));
  assert.ok(c.claim.length>35&&c.task.length>80&&c.spoken.length>70);
  assert.equal(c.approval,'DEMO_ONLY');assert.equal(c.editorialStatus,'unreviewed');
  assert.equal(c.officialHskLevel,null);
 }
});
test('P76 native owner projections are read-only and expose the original conversation and P43 handoffs',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderP76CaseLab(state,'',act,esc);
 assert.equal((html.match(/data-action="c9-media-open-dialogue"/g)||[]).length,10);
 assert.equal((html.match(/Continue with an original follow-up conversation/g)||[]).length,5);
 assert.equal((html.match(/data-action="c9-p71-open-composition"/g)||[]).length,5);
 assert.equal((html.match(/data-action="c9-media-open-story"/g)||[]).length,5);
 assert.equal((html.match(/<details>/g)||[]).length,5);
 assert.match(html,/DEMO_ONLY \/ UNREVIEWED/);
 assert.equal(JSON.stringify(state),before);
 const c=p76Cases()[0],q=dialogueQuestion(c.dialogueId,c.nativeQuestion);
 const next=addDialogueEvent(state,{id:'p76-native-1',dialogueId:c.dialogueId,question:c.nativeQuestion,answer:q.answer,at:1000});
 const updated=renderP76CaseLab(next,c.dialogueId,act,esc);
 assert.match(updated,/Negotiation question: independent correct/);
 assert.equal(state.dialogueEvents.length,0);
});
test('P76 introduces no new assessment, persistence or certified language authority',()=>{
 const s=readFileSync(new URL('../src/p76-case-lab.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(s,/\b(addDialogueEvent|addReadingEvent|addSentenceEvent|indexedDB|localStorage|fetch)\s*\(/);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.match(app,/character-study-working-v95-f4-source-fidelity/);
 assert.match(sw,/character-study-working-v95-f4-source-fidelity/);
});
