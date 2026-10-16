import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {FLUENCY_BANK,FLUENCY_KINDS,planFluency,fluencyPriority,beginFluency,fluencyCurrent,fluencyHint,fluencyAnswer,advanceFluency,abandonFluency,fluencySummary} from '../src/fluency-studio.mjs';
const newSession=(base=freshState(),options={})=>beginFluency(base,{id:'session-17',at:100,...options});
const originalCounts={lessons:74,stories:12,dialogues:10};
test('original teaching inventories remain unchanged and every fluency prompt has a real demo origin',()=>{
 assert.ok(DEMO_LESSONS.length>=originalCounts.lessons);assert.ok(STORIES.length>=originalCounts.stories);assert.ok(DIALOGUES.length>=originalCounts.dialogues);
 assert.ok(FLUENCY_BANK.length>=12+24+12+10+2*74);
 for(const q of FLUENCY_BANK){assert.ok(q.id&&q.prompt&&q.answer&&q.context&&q.teaching);assert.ok(FLUENCY_KINDS.includes(q.kind));assert.ok(q.options===undefined||q.options.includes(q.answer));assert.ok(q.origin?.id);}
});
test('balanced sessions cover all five independent supplemental activities with unique IDs',()=>{
 const s=newSession();assert.equal(s.fluencySession.questionIds.length,8);assert.equal(new Set(s.fluencySession.questionIds).size,8);
 const kinds=new Set(s.fluencySession.questionIds.map(id=>FLUENCY_BANK.find(q=>q.id===id).kind));assert.equal(kinds.size,5);
 assert.deepEqual(s.events,[]);assert.deepEqual(s.cards,{});assert.equal(validateState(s),true);
});
test('session focus and length are bounded; invalid modes and sizes rejected',()=>{
 for(const focus of ['balanced','context','pronunciation','weak'])for(const size of [6,8,12,16])assert.equal(planFluency(freshState(),{size,focus}).length,size);
 assert.throws(()=>planFluency(freshState(),{focus:'unlicensed'}));assert.throws(()=>planFluency(freshState(),{size:500}));
});
test('pronunciation practice is prominent in tone focus',()=>{
 const ids=planFluency(freshState(),{focus:'pronunciation',size:12});
 assert.ok(ids.filter(id=>id.startsWith('tone:')).length>=6);
});
test('weak mode prioritizes a previously missed fluency prompt',()=>{
 const prior=FLUENCY_BANK.find(q=>q.kind==='writing');const s=freshState();s.fluencyEvents=[{id:'bad',sessionId:'old',questionId:prior.id,correct:false,assisted:false,reason:'incorrect',at:100}];
 assert.ok(fluencyPriority(s,prior).score>=20);
 assert.ok(planFluency(s,{focus:'weak',size:8}).slice(0,4).includes(prior.id));
});
test('support state persists in a v1 backup and prevents independent credit',()=>{
 let s=fluencyHint(newSession());assert.equal(s.fluencySession.assisted,true);
 s=importBackup(backupDocument(s));assert.equal(s.fluencySession.assisted,true);
 const q=fluencyCurrent(s);s=fluencyAnswer(s,{id:'a1',response:q.answer,at:200});assert.equal(s.fluencySession.feedback.correct,true);assert.equal(s.fluencyEvents[0].assisted,true);
 assert.equal(fluencySummary(s).independent,0);assert.equal(validateState(s),true);
});
test('reveal is always assisted and cannot become independent success',()=>{
 let s=newSession();s=fluencyAnswer(s,{id:'revealed',reveal:true,at:250});assert.deepEqual([s.fluencyEvents[0].correct,s.fluencyEvents[0].assisted],[false,true]);assert.equal(fluencySummary(s).independent,0);
});
test('answers commit once and second submission cannot double-credit a skill',()=>{
 let s=newSession(),q=fluencyCurrent(s);s=fluencyAnswer(s,{id:'unique',response:q.answer,at:250});assert.throws(()=>fluencyAnswer(s,{id:'unique',response:q.answer,at:300}));assert.equal(s.fluencyEvents.length,1);
 assert.throws(()=>fluencyHint(s));
});
test('complete multi-skill sessions are checkpointed and summarize only independent correct answers',()=>{
 let s=newSession();const reviews=JSON.stringify({events:s.events,cards:s.cards});
 for(let i=0;i<8;i++){const q=fluencyCurrent(s);s=fluencyAnswer(s,{id:`ans${i}`,response:q.answer,at:200+i*2});assert.equal(s.fluencySession.cursor,i);s=advanceFluency(s,{id:`next${i}`,at:201+i*2});}
 assert.equal(s.fluencySession,null);assert.equal(s.fluencyCompletions.length,1);assert.equal(s.fluencyCompletions[0].count,8);
 assert.equal(s.fluencyCompletions[0].independent,8);assert.equal(JSON.stringify({events:s.events,cards:s.cards}),reviews);assert.equal(validateState(s),true);
});
test('a completed step is recovered in the same place from an exported backup',()=>{
 let s=newSession(),q=fluencyCurrent(s);s=fluencyAnswer(s,{id:'answer',response:q.answer,at:200});s=importBackup(backupDocument(s));assert.ok(s.fluencySession.feedback);assert.equal(s.fluencySession.cursor,0);
 s=advanceFluency(s,{id:'continue',at:220});assert.equal(s.fluencySession.cursor,1);assert.equal(s.fluencySession.feedback,null);
});
test('discard retains saved attempts but clears only the active checkpoint',()=>{
 let s=newSession();s=fluencyAnswer(s,{id:'answer',response:fluencyCurrent(s).answer});s=abandonFluency(s);assert.equal(s.fluencySession,null);assert.equal(s.fluencyEvents.length,1);assert.equal(validateState(s),true);
});
test('prior scheduled-review observations are byte-identical across supplementary activity',()=>{
 let s=addLesson(freshState(),DEMO_LESSONS[0].id,100);s=gradeCard(s,`${DEMO_LESSONS[0].id}:reading`,0,200,'review-one',{correct:false});const before=JSON.stringify({events:s.events,cards:s.cards,learned:s.learned});
 s=beginFluency(s,{id:'newsession'});s=fluencyAnswer(s,{id:'answer-one',response:fluencyCurrent(s).answer});assert.equal(JSON.stringify({events:s.events,cards:s.cards,learned:s.learned}),before);
});
test('written-tone feedback distinguishes lexical tones',()=>{
 let s=beginFluency(freshState(),{id:'tones',focus:'pronunciation',size:6});const q=fluencyCurrent(s);assert.equal(q.answer,'wǒmen');
 s=fluencyAnswer(s,{id:'bad-tone',response:'wo2men'});assert.equal(s.fluencySession.feedback.correct,false);assert.equal(s.fluencySession.feedback.reason,'tone');assert.match(s.fluencySession.feedback.message,/second.*third|second tone.*third tone/i);
});
test('contextual sense exercises use the authored context and retain distinct readings',()=>{
 const a=FLUENCY_BANK.filter(q=>q.kind==='sense'&&q.hanzi.includes('银行'));
 assert.equal(a.length,1);assert.match(a[0].teaching,/háng/);assert.notEqual(a[0].answer,FLUENCY_BANK.find(q=>q.kind==='sense'&&q.hanzi.includes('行走')).answer);
});
test('old version-one backup without any Batch 17 extension remains valid',()=>{
 let old=freshState();delete old.fluencySession;delete old.fluencyEvents;delete old.fluencyCompletions;
 assert.equal(validateState(importBackup(backupDocument(old))),true);
});
test('invalid external imported histories and session pointers fail validation',()=>{
 const s=newSession();s.fluencySession.questionIds[0]='not-approved';assert.throws(()=>validateState(s));
 const x=newSession();x.fluencyEvents=[{id:'same',sessionId:'s',questionId:FLUENCY_BANK[0].id,correct:true,assisted:false,reason:'correct',at:100},{id:'same',sessionId:'s',questionId:FLUENCY_BANK[0].id,correct:false,assisted:false,reason:'wrong',at:200}];assert.throws(()=>validateState(x));
 const y=newSession();y.fluencySession.feedback={correct:true,assisted:'no',message:'bad',reason:'correct'};assert.throws(()=>validateState(y));
});
test('new route, source navigation, accessibility hooks and pre-cache all present',async()=>{
 const [app,html,css,sw]=await Promise.all(['app.mjs','index.html','styles.css','sw.js'].map(n=>readFile(`src/${n}`,'utf8')));
 for(const keyword of ['renderFluency','fluency-start','fluency-answer','fluency-hint','fluency-source','fluency-analytics','fluency-entry','fluencySummary'])assert.ok(app.includes(keyword),keyword);
 assert.match(html,/href="#\/fluency"/);assert.match(css,/\.fluency-work/);assert.match(sw,/character-study-working-v64/);assert.match(sw,/fluency-studio\.mjs/);
});
