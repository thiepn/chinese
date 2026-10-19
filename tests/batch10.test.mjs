import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,validateState,addLesson,gradeCard} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {SENSE_CASES} from '../src/sense-lab.mjs';
import {SENTENCE_TASKS} from '../src/sentence-workshop.mjs';
import {validConnectedItem,connectedQuestion,gradeConnected,recordConnectedAttempt,contextualWeaknesses,contextualProgress} from '../src/connected-practice.mjs';
import {createGuidedSession,guidedQuestion,recordGuidedAnswer,advanceGuidedSession,validateGuidedSession,evaluateGuided} from '../src/guided-session.mjs';
import {pronunciationPath,pronunciationRemedy} from '../src/pronunciation-path.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
const now=Date.parse('2026-10-12T17:00:00Z');
const base=()=>freshState();
test('original corpus retained; no claimed official HSK source',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);assert.ok(DIALOGUES.length>=10);assert.equal(SENSE_CASES.length,12);assert.ok(SENTENCE_TASKS.length>=24);
 assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null));
});
test('contextual question registry rejects unapproved IDs, steps and unsupported modes',()=>{
 for(const item of [{type:'sense',id:'x',mode:'meaning'},{type:'mission',id:DIALOGUES[0].id,step:9,mode:'dialogue'},{type:'sentence',id:SENTENCE_TASKS[0].id,mode:'meaning'}]){
  assert.equal(validConnectedItem(item),false);assert.throws(()=>connectedQuestion(item),/Unapproved/);
 }
});
test('all 12 contextual sense prompts have unique correct options, Chinese context and explanations',()=>{
 for(const c of SENSE_CASES){const item={type:'sense',id:c.id,mode:'meaning'};assert.ok(validConnectedItem(item));const q=connectedQuestion(item);assert.equal(q.sourceType,'sense');assert.ok(q.options.includes(q.answer));assert.equal(gradeConnected(item,c.answer).correct,true);assert.equal(gradeConnected(item,q.options.find(o=>o!==q.answer)).correct,false);assert.ok(q.hanzi&&q.explanation);}
});
test('all 24 sentence tasks reconstruct Chinese instead of checking arbitrary translation',()=>{
 for(const t of SENTENCE_TASKS.slice(0,24)){const item={type:'sentence',id:t.id,mode:'reconstruct'};assert.ok(validConnectedItem(item));const q=connectedQuestion(item);assert.equal(q.kind,'hanzi');assert.equal(gradeConnected(item,q.answer).correct,true);assert.equal(gradeConnected(item,t.english).correct,false);}
});
test('all 30 dialogue mission stages are individually available and grade independently',()=>{
 for(const d of DIALOGUES.slice(0,10)){for(let step=0;step<3;step++){const item={type:'mission',id:d.id,step,mode:'dialogue'};assert.ok(validConnectedItem(item));const q=connectedQuestion(item);assert.equal(q.sourceType,'mission');assert.equal(gradeConnected(item,q.answer).correct,true);}}
});
test('connected supplemental writes never mutate review events, cards, or lesson introductions',()=>{
 let s=addLesson(base(),DEMO_LESSONS[0].id,now);s=gradeCard(s,`${DEMO_LESSONS[0].id}:meaning`,0,now,'prior-miss',{correct:false});const before=structuredClone(s);
 const items=[{type:'sense',id:SENSE_CASES[0].id,mode:'meaning'},{type:'sentence',id:SENTENCE_TASKS[0].id,mode:'reconstruct'},{type:'mission',id:DIALOGUES[0].id,mode:'dialogue',step:2}];
 for(const [i,item] of items.entries()){s=recordConnectedAttempt(s,item,{eventId:`conn-${i}`,correct:true,assisted:true,now});s=recordConnectedAttempt(s,item,{eventId:`conn-${i}`,correct:true,assisted:true,now});}
 validateState(s);assert.deepEqual(s.cards,before.cards);assert.deepEqual(s.events,before.events);assert.deepEqual(s.learned,before.learned);assert.deepEqual(s.introductions,before.introductions);assert.equal(s.senseEvents.length,1);assert.equal(s.sentenceEvents.length,1);assert.equal(s.missionEvents.length,1);
 assert.equal(contextualProgress(s).reduce((a,v)=>a+v.independent,0),0);
});
test('weaknesses prefer actual independent misses to already independently resolved case',()=>{
 const a={type:'sense',id:SENSE_CASES[0].id,mode:'meaning'};
 let s=recordConnectedAttempt(base(),a,{eventId:'miss',correct:false,assisted:false,now});
 assert.equal(contextualWeaknesses(s)[0].id,a.id);
 s=recordConnectedAttempt(s,a,{eventId:'good1',correct:true,assisted:false,now:now+1});
 s=recordConnectedAttempt(s,a,{eventId:'good2',correct:true,assisted:false,now:now+2});
 const item=contextualWeaknesses(s).find(v=>v.id===a.id&&v.type==='sense');assert.equal(item.weakness,1);
});
test('guided connected study creates valid resumable 5/10/20 question plans',()=>{
 for(const limit of [5,10,20]){const s=createGuidedSession(base(),{limit,focus:'connected',id:`guided-${limit}`,now});validateGuidedSession(s);assert.equal(s.items.length,limit);assert.ok(s.items.every(validConnectedItem));}
});
test('balanced and weak sessions now include contextual types alongside legacy drills',()=>{
 for(const focus of ['balanced','weak']){const session=createGuidedSession(base(),{limit:20,focus,id:`blend-${focus}`,now});assert.ok(session.items.some(validConnectedItem));assert.ok(session.items.some(item=>item.type==='drill'||item.type==='story'));}
});
test('guided tone, exact-written-Chinese and meaning checks use correct question validation',()=>{
 const cases=[{type:'sentence',id:SENTENCE_TASKS[0].id,mode:'reconstruct'},{type:'sense',id:SENSE_CASES[0].id,mode:'meaning'},{type:'mission',id:DIALOGUES[0].id,mode:'dialogue',step:2}];
 for(const item of cases){const q=connectedQuestion(item);assert.equal(evaluateGuided(q,q.answer).correct,true);}
});
test('hint state is durable through checkpoint and correct assisted answers do not count independent',()=>{
 let s=base();s.practiceSession=createGuidedSession(s,{limit:5,focus:'connected',id:'persist-hint',now});
 // Simulate persisted hint after switching routes or reloading the browser.
 s.practiceSession.assistanceUsed=true;validateState(s);
 const q=guidedQuestion(s.practiceSession);const next=recordGuidedAnswer(s,{response:q.answer,eventId:'persist-hint-answer',now});
 assert.equal(next.practiceSession.feedback.correct,true);assert.equal(next.practiceSession.feedback.assisted,true);
 assert.equal(next.events.length,0);assert.deepEqual(next.cards,{});
 assert.equal(contextualProgress(next).reduce((a,v)=>a+v.independent,0),0);
 const advanced=advanceGuidedSession(next);assert.equal(advanced.practiceSession.correct,0);assert.equal(advanced.practiceSession.assisted,1);assert.equal(advanced.practiceSession.assistanceUsed,false);
});
test('a genuine independent correct guided question increments only supplemental progress',()=>{
 let s=base();s.practiceSession=createGuidedSession(s,{limit:5,focus:'connected',id:'independent',now});const q=guidedQuestion(s.practiceSession);
 const recorded=recordGuidedAnswer(s,{response:q.answer,eventId:'independent-a',now});assert.equal(recorded.practiceSession.feedback.correct,true);assert.equal(recorded.practiceSession.feedback.assisted,false);
 const advanced=advanceGuidedSession(recorded);assert.equal(advanced.practiceSession.correct,1);assert.deepEqual(advanced.events,[]);assert.deepEqual(advanced.cards,{});
});
test('v1 backup with existing guided session imports unchanged and accepts new contextual histories',()=>{
 let old=base();delete old.senseEvents;delete old.sentenceEvents;delete old.missionEvents;old.practiceSession=createGuidedSession(old,{limit:5,focus:'balanced',id:'legacy-batch9',now});delete old.practiceSession.assistanceUsed;
 const restored=importBackup(backupDocument(old));validateState(restored);assert.equal(restored.version,1);assert.equal(restored.practiceSession.id,'legacy-batch9');
 const next=recordConnectedAttempt(restored,{type:'sense',id:SENSE_CASES[0].id,mode:'meaning'},{eventId:'after-restore',correct:false,assisted:false,now});
 assert.equal(importBackup(backupDocument(next)).senseEvents.length,1);
});
test('no invalid guided assistance type accepted from an imported backup',()=>{
 const s=base();s.practiceSession=createGuidedSession(s,{limit:5,focus:'connected',id:'invalid',now});s.practiceSession.assistanceUsed='false';assert.throws(()=>validateState(s),/guided practice/);
});
test('pronunciation guidance has contour explanation for all lexical tones without acoustic claim',()=>{
 const info=pronunciationPath('nǐ hǎo');assert.equal(info.syllables.length,2);assert.equal(info.syllables[0].tone,3);assert.match(info.advice,/not judge your spoken voice/);
 assert.equal(pronunciationPath('abc###'),null);assert.match(pronunciationRemedy('nǐ','tone'),/lexical tone/);
});
test('UI practice controls, context bridge, CSS and offline manifest include new local modules',()=>{
 const read=n=>readFileSync(new URL(`../src/${n}`,import.meta.url),'utf8');const app=read('app.mjs'),sw=read('sw.js'),css=read('styles.css');
 for(const s of ['connected-session','open-connected-item','guided-pause','toneTeachingPanel','contextBridgePanel','assistanceUsed'])assert.ok(app.includes(s),s);
 for(const s of ['connected-practice.mjs','pronunciation-path.mjs','working-v87'])assert.ok(sw.includes(s),s);
 for(const s of ['.connection-bridge','.tone-teaching','.connected-analytics'])assert.ok(css.includes(s),s);
});
import {dialogueWordLinks,storyWordLinks,writtenWordMatches} from '../src/context-links.mjs';
test('dialogue and reading links use only actual indexed demo written forms, no HSK claims',()=>{
 for(const d of DIALOGUES.slice(0,10)){const links=dialogueWordLinks(d.id);assert.ok(links.every(w=>w.officialHskLevel===null&&d.lines.some(l=>l.hanzi.includes(w.hanzi))));}
 for(const s of STORIES){const links=storyWordLinks(s.id);assert.ok(links.every(w=>w.officialHskLevel===null&&s.lines.some(l=>l.hanzi.includes(w.hanzi))));}
 assert.deepEqual(dialogueWordLinks('unknown'),[]);assert.deepEqual(storyWordLinks('unknown'),[]);assert.deepEqual(writtenWordMatches([{hanzi:'missing-demo'}]),[]);
});
import {reviewPlan} from '../src/review-strategy.mjs';
test('review queue avoids adjacent duplicate lesson and skill when alternatives exist, remains due-only',()=>{
 let s=base();for(const l of DEMO_LESSONS.slice(0,4))s=addLesson(s,l.id,now);
 const queue=reviewPlan(s,{now:now+1000,limit:20});assert.equal(queue.length,20);
 for(let i=1;i<queue.length;i++){assert.notEqual(queue[i].id,queue[i-1].id);if(i<12){assert.notEqual(queue[i].family,queue[i-1].family);assert.notEqual(queue[i].id.split(':')[0],queue[i-1].id.split(':')[0]);}}
 assert.equal(s.events.length,0);
});
