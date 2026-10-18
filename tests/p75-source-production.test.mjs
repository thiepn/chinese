import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES} from '../src/stories.mjs';
import {P43_UNITS} from '../src/p43-course.mjs';
import {p71ProductionSource,p71WritingUnit} from '../src/p71-production-c9.mjs';
import {openC9P71WritingSource,c9WritingState,renderC9WritingWorkspace} from '../src/writing-c9.mjs';
import {renderP71BlindListening} from '../src/p71-listening-c9.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {beginnerQuestion} from '../src/beginner-reading.mjs';
import {freshState} from '../src/study.mjs';
const sources=STORIES.filter(s=>s.beginner?.source==='original-p71');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';
test('P71 five substantive Mandarin production briefs are anchored to exact original source lines',()=>{
 assert.equal(sources.length,5);
 const audiences=new Set(),writing=new Set(),spoken=new Set();
 for(const story of sources){
  const brief=p71ProductionSource(story),unit=p71WritingUnit(story,P43_UNITS[0]);
  assert.ok(brief&&unit,'original P71 production source exists');
  assert.equal(brief.storyId,story.id);
  assert.equal(brief.sourceId,story.beginner.p71.id);
  assert.equal(brief.anchors.length,5);
  assert.equal(new Set(brief.anchors.map(a=>a.lineIndex)).size,5);
  for(const anchor of brief.anchors)assert.strictEqual(anchor.hanzi,story.lines[anchor.lineIndex].hanzi);
  assert.equal(brief.status,'DEMO_ONLY');assert.equal(brief.editorialStatus,'unreviewed');
  assert.equal(brief.officialHskLevel,null);
  assert.equal(unit.p71Source,true);
  assert.equal(unit.id,P43_UNITS[0].id,'native unit identity retained');
  assert.equal(unit.sourceRefStoryId,story.id);
  assert.deepEqual(unit.lines,story.lines);
  assert.deepEqual(unit.grammarIds,story.beginner.grammarIds);
  assert.equal(unit.sections[1].end,9);
  assert.equal(unit.readingId,null);
  assert.equal(unit.dialogueId,null);
  assert.ok(unit.planning.length>=3);
  assert.ok(brief.writing.length>90&&brief.oral.length>75);
  audiences.add(brief.audience);writing.add(brief.writing);spoken.add(brief.oral);
 }
 assert.equal(audiences.size,5);assert.equal(writing.size,5);assert.equal(spoken.size,5);
 assert.equal(p71ProductionSource(STORIES[0]),null);
 assert.equal(p71WritingUnit(STORIES[0],P43_UNITS[0]),null);
});
test('P75 completed listening offers original writing and oral transfer only after answer',()=>{
 for(const story of sources){
  const mode='beginner-reason',q=beginnerQuestion(story,mode);
  const hidden=renderP71BlindListening(story,mode,null,act,esc);
  assert.doesNotMatch(hidden,/c9-p71-production-bridge/);
  const answered=renderP71BlindListening(story,mode,{correct:true,assisted:false,reference:q.answer,message:'Original answer'},act,esc);
  const brief=p71ProductionSource(story);
  assert.match(answered,/data-action="c9-p71-open-composition"/);
  assert.match(answered,/c9-p71-production-bridge/);
  assert.ok(answered.includes(esc(brief.writing)));
  assert.ok(answered.includes(esc(brief.oral)));
  assert.ok(answered.includes(esc(brief.misconception)));
 }
});
test('P71 source handoff uses P43 controller and protects unsent private drafts',()=>{
 const source=sources[0];
 Object.assign(c9WritingState,{unitId:P43_UNITS[0].id,transferPhase:0,sourceId:null,
  p71StoryId:null,draft:'',revisions:[],pending:'',pendingTarget:null,step:'compose',showEvidence:false});
 const navigations=[],api={go:s=>{navigations.push(s);return true;},
  currentRoute:()=>navigations.at(-1)||'stories',render:()=>{},alertUser:()=>{}};
 assert.equal(openC9P71WritingSource(source.id,api),true);
 assert.equal(c9WritingState.p71StoryId,source.id);
 assert.equal(c9WritingState.unitId,P43_UNITS[0].id);
 assert.equal(navigations.at(-1),'writing');
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9WritingWorkspace(state,c9WritingState,act,esc);
 assert.ok(html.includes('c9-p71-writing-brief'));
 assert.ok(html.includes(p71ProductionSource(source).writing));
 assert.ok(html.includes(source.lines[9].hanzi)===false,'P71 full model not revealed before learner requests');
 assert.ok(html.includes('data-action="c9-p71-writing-open-source"'));
 assert.ok(html.includes('data-action="p43-save"')===false,'P43 save appears only while composing');
 assert.equal(JSON.stringify(state),snapshot);
 c9WritingState.draft='我认为这些来源有明显的区别。';
 assert.equal(openC9P71WritingSource(sources[1].id,api),true);
 assert.equal(c9WritingState.pending,'switch');
 assert.equal(c9WritingState.p71StoryId,source.id,'source identity remains unchanged before explicit confirmation');
 assert.equal(c9WritingState.draft,'我认为这些来源有明显的区别。');
 assert.equal(openC9P71WritingSource('not-a-story',api),false);
 Object.assign(c9WritingState,{draft:'',revisions:[],pending:'',pendingTarget:null,p71StoryId:null,step:'plan'});
});
test('no new grade writer, official audio or study store',()=>{
 for(const filename of ['p71-production-c9.mjs','p71-listening-c9.mjs']){
  const txt=readFileSync(new URL('../src/'+filename,import.meta.url),'utf8');
  assert.doesNotMatch(txt,/\b(addReadingEvent|addSentenceEvent|gradeCard|indexedDB|localStorage|fetch)\s*\(/);
 }
 const writing=readFileSync(new URL('../src/writing-c9.mjs',import.meta.url),'utf8');
 assert.match(writing,/p71StoryId/);
 assert.match(writing,/qualifiedP71/);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.match(app,/character-study-working-v78-guarded-turn-playback/);
 assert.match(sw,/character-study-working-v78-guarded-turn-playback/);
});
