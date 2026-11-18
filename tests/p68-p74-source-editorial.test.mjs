import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES} from '../src/stories.mjs';
import {GRAMMAR_LESSONS} from '../src/grammar-course.mjs';
import {P68_SOURCE_READINGS} from '../src/p68-source-readings.mjs';
import {auditReadingSource,auditReadingInventory,p68NativeTransfer,readingReviewPacket} from '../src/reading-editorial-c9.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';
test('review every original manuscript: complete source packet and unreviewed status',()=>{
 const inventory=auditReadingInventory();
 assert.equal(inventory.total,STORIES.length);
 assert.equal(inventory.unreviewed,STORIES.length);
 assert.equal(inventory.p68,6);
 assert.equal(inventory.statuses.length,STORIES.length);
 assert.ok(inventory.flagged>=0&&inventory.flagged<=STORIES.length);
 for(const story of STORIES){
  const a=auditReadingSource(story),packet=readingReviewPacket(story.id);
  assert.equal(a.storyId,story.id);
  assert.equal(a.editorialStatus,'unreviewed');
  assert.equal(a.hskStatus,'not-authoritatively-mapped');
  assert.ok(a.manualReview.includes('Pinyin tones and names'));
  assert.ok(packet.includes('Canonical story ID: '+story.id));
  assert.ok(packet.includes('Status: UNREVIEWED'));
  assert.ok(packet.includes(story.lines[0].hanzi));
  assert.ok(packet.includes('Review outcome, reviewer identity, review date'));
  assert.ok(!packet.includes('readingEvents'));
 }
 assert.equal(auditReadingSource({...STORIES[0]}),null);
 assert.equal(readingReviewPacket('missing-story'),null);
});
test('P68 grammar paths contain exactly traceable Chinese markers, genuine old grammar IDs',()=>{
 const expected=[[['g05',3,'不要'],['g06',2,'没有']],
  [['g06',3,'没有']],[['g05',3,'不能']],
  [['g06',2,'没有'],['g05',5,'不能']],
  [['g06',2,'没有']],[['g05',2,'不确定'],['g06',5,'没有']]];
 const known=new Set(GRAMMAR_LESSONS.map(g=>g.id));
 assert.equal(P68_SOURCE_READINGS.length,6);
 for(let i=0;i<6;i++){
  const source=P68_SOURCE_READINGS[i],story=STORIES.find(s=>s.beginner?.p68===source);
  assert.ok(story);
  const t=p68NativeTransfer(story),a=auditReadingSource(story);
  assert.deepEqual(source.grammarEvidence.map(x=>[x.grammarId,x.lineIndex,x.token]),expected[i]);
  assert.deepEqual(source.grammarIds,source.grammarEvidence.map(x=>x.grammarId));
  assert.ok(t.grammar.every(x=>known.has(x.id)&&story.lines[x.lineIndex].hanzi.includes(x.token)));
  assert.equal(a.issues.length,0,a.issues.join('; '));
  assert.ok(readingReviewPacket(story.id).includes('## Exact source grammar bridges'));
  assert.ok(readingReviewPacket(story.id).includes('## Independent qualified editorial sign-off required'));
 }
 assert.equal(p68NativeTransfer(STORIES[0]),null);
});
test('UI opens native course and editor packet with concealed reference support and no writes',()=>{
 const story=STORIES.find(s=>s.beginner?.source==='original-p68');
 const state=freshState(),snapshot=JSON.stringify(state);
 const hidden=renderC9ReadingHub(state,story,act,esc,{sourceHelpRevealed:false});
 const revealed=renderC9ReadingHub(state,story,act,esc,{sourceHelpRevealed:true});
 assert.match(hidden,/c9-p68-editorial/);
 assert.match(hidden,/Copy original editorial review packet/);
 assert.match(hidden,/Whole original reading inventory/);
 assert.match(hidden,/c9-p68-native-transfer/);
 assert.match(hidden,/data-action="grammar-select"/);
 assert.match(hidden,/ORIGINAL LINE 4/);
 assert.match(hidden,/c9-cross-source-reveal/);
 assert.match(revealed,/native unanswered reading is assisted/);
 assert.ok(revealed.includes(story.lines[3].english));
 assert.equal(JSON.stringify(state),snapshot);
});
test('editor is source-only; still no authority to approve or grade',()=>{
 const mod=readFileSync(new URL('../src/reading-editorial-c9.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.doesNotMatch(mod,/\b(addReadingEvent|addSentenceEvent|updateState|gradeCard|indexedDB|localStorage|fetch)\s*\(/);
 assert.match(mod,/editorialStatus:'unreviewed'/);
 assert.match(app,/if\(name==='c9-reading-review-copy'\)/);
 assert.match(app,/character-study-working-v75-p77-shared-word-visuals-v1/);
 assert.match(sw,/character-study-working-v75-p77-shared-word-visuals-v1/);
});
