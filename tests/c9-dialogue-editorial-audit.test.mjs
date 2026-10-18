import test from 'node:test';
import assert from 'node:assert/strict';
import {DIALOGUES} from '../src/dialogues.mjs';
import {P75_DIALOGUES} from '../src/p75-dialogues.mjs';
import {P77_DIALOGUES} from '../src/p77-dialogues.mjs';
import {freshState} from '../src/study.mjs';
import {lintDialogueManuscript,auditDialogueSource,auditDialogueInventory,dialogueReviewPacket} from '../src/dialogue-editorial-c9.mjs';
import {renderC9DialogueHub,renderC9P75ConversationCourse,renderC9P77ConsequenceCourse} from '../src/media-c9.mjs';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(n,label,c='',a='')=>'<button data-action="'+escape(n)+'" '+a+'>'+label+'</button>';
test('source-only independent review audit indexes all unapproved P75/P77 dialogue turns and questions',()=>{
 const inventory=auditDialogueInventory();
 assert.deepEqual(inventory,{total:10,p75:5,p77:5,turns:80,questions:30,unreviewed:10,flagged:0});
 assert.equal(auditDialogueSource('missing'),null);
 assert.equal(dialogueReviewPacket('missing'),null);
 for(const source of [...P75_DIALOGUES,...P77_DIALOGUES]){
  const native=DIALOGUES.find(d=>d.p75===source||d.p77===source);
  const audit=auditDialogueSource(native.id),packet=dialogueReviewPacket(native.id);
  assert.equal(audit.issues.length,0,audit.issues.join('; '));
  assert.equal(audit.editorialStatus,'unreviewed');
  assert.equal(audit.officialHskLevel,null);
  assert.ok(packet.includes('Canonical dialogue ID: '+native.id));
  assert.ok(packet.includes('Hanzi: '+source.turns[7].hanzi));
  assert.ok(packet.includes('Evidence turn: '+(source.questions[0].evidenceIndex+1)));
  assert.ok(packet.includes('Answer: '+source.questions[0].answer));
  assert.ok(packet.includes('Reviewer identity, date, evidence'));
  assert.ok(!/learnerEvents|dialogueEvents|privateDraft|accountToken|accessToken/.test(packet));
 }
});
test('pure reviewer catches a defective proposed source without modifying or publishing source',()=>{
 const good=P77_DIALOGUES[0],bad=structuredClone(good),unchanged=JSON.stringify(good);
 bad.turns[0].pinyin='没有';
 bad.turns[1].hanzi=bad.turns[0].hanzi;
 bad.questions[0].evidenceIndex=100;
 bad.questions[1].options[1]=bad.questions[1].answer.toUpperCase();
 bad.questions[2].explanation='';
 const failures=lintDialogueManuscript(bad);
 assert.ok(failures.some(s=>s.includes('non-Latin')));
 assert.ok(failures.some(s=>s.includes('repeats an exact')));
 assert.ok(failures.some(s=>s.includes('does not reference')));
 assert.ok(failures.some(s=>s.includes('repeated options')));
 assert.ok(failures.some(s=>s.includes('lacks prompt')));
 assert.equal(JSON.stringify(good),unchanged);
});
test('editorial action is explicit on learner conversation catalog and never reveals answers before click',()=>{
 const state=freshState(),before=JSON.stringify(state),d=DIALOGUES.find(x=>x.p77);
 const html=renderC9DialogueHub(state,d,act,escape);
 assert.match(html,/data-action="c9-dialogue-review-copy"/);
 assert.match(html,/UNREVIEWED/);
 assert.match(html,/contains answer keys/i);
 assert.doesNotMatch(html,/editorial review approved/i);
 assert.equal(JSON.stringify(state),before);
 const c75=renderC9P75ConversationCourse(state,d.id,act,escape);
 const c77=renderC9P77ConsequenceCourse(state,d.id,act,escape);
 assert.equal((c75.match(/data-action="c9-dialogue-review-copy"/g)||[]).length,5);
 assert.equal((c77.match(/data-action="c9-dialogue-review-copy"/g)||[]).length,5);
});
