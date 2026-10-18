import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES} from '../src/stories.mjs';
import {beginnerQuestion,beginnerWritingTask} from '../src/beginner-reading.mjs';
import {SENTENCE_TASKS} from '../src/sentence-workshop.mjs';
import {p71ListeningPart,p71BlindStudyPrompt,renderP71BlindListening,p71PracticeContinuity,P71_BLIND_MODES} from '../src/p71-listening-c9.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {freshState} from '../src/study.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';
const sources=STORIES.filter(s=>s.beginner?.source==='original-p71');
test('P71–P75 playback parts are genuine original ten-line sources without transcript in question DOM',()=>{
 assert.equal(sources.length,5);
 for(const source of sources){
  assert.equal(source.lines.length,10);
  const p0=p71ListeningPart(source,0),p1=p71ListeningPart(source,1);
  assert.equal(p0,source.lines.slice(0,5).map(x=>x.hanzi).join(' '));
  assert.equal(p1,source.lines.slice(5,10).map(x=>x.hanzi).join(' '));
  assert.equal(p71ListeningPart(source,2),null);
  assert.equal(p71ListeningPart(source,-1),null);
  for(const [mode] of P71_BLIND_MODES){
   const q=p71BlindStudyPrompt(source,mode);
   assert.deepEqual(q,beginnerQuestion(source,mode));
   const hidden=renderP71BlindListening(source,mode,null,act,esc);
   assert.match(hidden,/Listen before looking at the Chinese/);
   assert.match(hidden,/data-action="c9-p71-blind-play"/);
   assert.match(hidden,/data-action="story-answer"/);
   assert.match(hidden,/data-action="c9-p71-blind-reveal"/);
   assert.match(hidden,/Speech synthesis|speech synthesis|device speech|speech synthesis is optional/i);
   for(const line of source.lines){
    assert.ok(!hidden.includes(line.hanzi),'blind transcript disclosed a complete Chinese source line');
    assert.ok(!hidden.includes(line.pinyin),'blind response exposed Pinyin');
   }
   assert.ok(!hidden.includes('data-text='));
   const answered=renderP71BlindListening(source,mode,{correct:true,assisted:false,message:'original grader',reference:q.answer},act,esc);
   assert.ok(answered.includes(q.evidenceLine.hanzi));
   assert.ok(answered.includes(esc(q.evidenceLine.english)));
   assert.match(answered,/data-action="c9-p71-workshop-writing"/);
   assert.match(answered,/NOT measured/);
  }
 }
 assert.equal(p71BlindStudyPrompt(STORIES[0],'beginner-detail'),null);
});
test('real authored writing tasks already exist in native Sentence Workshop by original canonical IDs',()=>{
 const all=new Set(SENTENCE_TASKS.map(s=>s.id));
 for(const source of sources){
  const task=beginnerWritingTask(source.id);
  assert.ok(task&&all.has(task.id));
  assert.equal(task.hanzi,source.lines[9].hanzi);
 }
});
test('progression only projects original answer/writing evidence, never infers listening or oral mastery',()=>{
 const source=sources[0],empty=freshState(),start=JSON.stringify(empty);
 const initial=p71PracticeContinuity(source,empty);
 assert.equal(initial.nextMode,'beginner-detail');
 assert.equal(initial.writingRecorded,false);
 assert.equal(initial.modes.length,3);
 assert.match(initial.note,/no verified listening/);
 assert.equal(JSON.stringify(empty),start);
 const a={...empty,readingEvents:[{id:'r1',storyId:source.id,mode:'beginner-detail',correct:true,assisted:false,at:1000},
  {id:'r2',storyId:source.id,mode:'beginner-reason',correct:true,assisted:true,at:2000}]};
 assert.equal(p71PracticeContinuity(source,a).nextMode,'beginner-reason');
 const all={...a,readingEvents:[...a.readingEvents,
  {id:'r3',storyId:source.id,mode:'beginner-reason',correct:true,assisted:false,at:3000},
  {id:'r4',storyId:source.id,mode:'beginner-sequence',correct:true,assisted:false,at:4000}]};
 assert.equal(p71PracticeContinuity(source,all).nextMode,'beginner-writing');
 const w={...all,sentenceEvents:[{id:'w1',taskId:beginnerWritingTask(source.id).id,correct:true,assisted:false,at:5000}]};
 assert.equal(p71PracticeContinuity(source,w).nextMode,null);
 assert.equal(p71PracticeContinuity(STORIES[0],w),null);
});
test('P71 course retains original source study and adds genuine blind + writing-native actions without new event writes',()=>{
 const source=sources[0],state=freshState(),before=JSON.stringify(state);
 const html=renderC9ReadingHub(state,source,act,esc);
 assert.equal((html.match(/data-action="c9-p71-blind-start"/g)||[]).length,5);
 assert.equal((html.match(/data-action="c9-p71-workshop-writing"/g)||[]).length>=5,true);
 assert.match(html,/Original mode evidence/);
 assert.match(html,/This does not verify listening, speech or mastery/);
 assert.equal(JSON.stringify(state),before);
 const mod=readFileSync(new URL('../src/p71-listening-c9.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(mod,/\b(addReadingEvent|addSentenceEvent|localStorage|indexedDB|fetch)\s*\(/);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.match(app,/if\(name==='c9-p71-blind-start'\)/);
 assert.match(app,/if\(name==='c9-p71-blind-reveal'\)/);
 assert.match(app,/if\(name==='c9-p71-workshop-writing'\)/);
 assert.match(app,/character-study-working-v80-learner-next-action-placement/);
 assert.match(sw,/character-study-working-v80-learner-next-action-placement/);
});
