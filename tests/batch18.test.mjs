import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {FLUENCY_BANK} from '../src/fluency-studio.mjs';
import {PLAN_FOCI,PLAN_MINUTES,planPreferences,setPlanPreferences,validatePlanExtensions,plannedDays,mistakeCatalog,mistakeCollections,toggleMistakePin,dailyEvidence,nextConnectedMaterial} from '../src/daily-plan.mjs';
const at=(y,m,d)=>new Date(y,m-1,d,12,0,0).getTime();
const s0=()=>freshState();
test('Batch 18 preserves all original independent demo content counts',()=>{assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);assert.ok(DIALOGUES.length>=10);assert.ok(FLUENCY_BANK.length>=206);});
test('planning defaults and all allowed workload/focus values round trip',()=>{
 assert.deepEqual(planPreferences(s0()),{minutes:15,focus:'balanced'});for(const minutes of PLAN_MINUTES)for(const focus of PLAN_FOCI){const s=setPlanPreferences(s0(),{minutes,focus});assert.equal(validateState(s),true);assert.deepEqual(planPreferences(importBackup(backupDocument(s))),{minutes,focus});}
});
test('unsupported preferences cannot corrupt state',()=>{assert.throws(()=>setPlanPreferences(s0(),{minutes:0,focus:'balanced'}));assert.throws(()=>setPlanPreferences(s0(),{minutes:15,focus:'exam-certified'}));const s=s0();s.dailyPlan={minutes:-4,focus:'balanced'};assert.throws(()=>validateState(s));});
test('seven-day plan determinism, real local calendar dates, no invented future review counts',()=>{
 const s=s0(),now=at(2026,10,12),days=plannedDays(s,{now});assert.equal(days.length,7);assert.equal(days[0].date,'2026-10-12');assert.equal(days.at(-1).date,'2026-10-18');assert.deepEqual(days,plannedDays(s,{now}));assert.ok(days[1].tasks.find(t=>t.type==='review').label==='Check due reviews');assert.equal(days[1].plannedOnly,true);
});
test('future suggested lessons progress instead of seven repeated identical lessons',()=>{const days=plannedDays(s0(),{now:at(2026,10,12)});const lessons=days.map(x=>x.tasks.find(t=>t.type==='journey').label);assert.equal(new Set(lessons).size,7);});
test('recorded daily evidence is distinct across review, journey, fluency and reading',()=>{const s=s0(),at0=at(2026,10,12);s.events=[{id:'r',cardId:'demo-01:reading',grade:0,correct:false,at:at0}];s.courseEvents=[{id:'c',lessonId:'demo-01',stage:'completed',correct:true,assisted:false,at:at0}];s.fluencyCompletions=[{id:'f',sessionId:'sf',at:at0,count:6,independent:4}];s.readingEvents=[];const ev=dailyEvidence(s,'2026-10-12');assert.deepEqual([ev.reviews,ev.journeys,ev.fluency,ev.reading],[1,1,1,0]);assert.equal(plannedDays(s,{now:at0})[0].tasks.filter(t=>t.done).length,3);});
test('scheduled review mistake identified with explicit source and safe reference',()=>{let s=addLesson(s0(),'demo-01',at(2026,10,11));s=gradeCard(s,'demo-01:reading',0,at(2026,10,12),'r-1',{correct:false,assisted:false});const m=mistakeCatalog(s).find(x=>x.id==='review:demo-01:reading');assert.equal(m.unresolved,true);assert.equal(m.source.id,'demo-01');assert.equal(m.attempts,1);assert.equal(validateState(s),true);});
test('independent later correct review resolves prior error without deleting history',()=>{let s=addLesson(s0(),'demo-01',100);s=gradeCard(s,'demo-01:reading',0,200,'bad',{correct:false});s=gradeCard(s,'demo-01:reading',2,400,'fixed',{correct:true,assisted:false});const m=mistakeCollections(s);assert.equal(m.unresolved.length,0);assert.equal(m.corrected.length,1);assert.equal(s.events.length,2);});
test('supplemental Fluency Studio errors enter collection but never scheduled review grade',()=>{let s=s0();const q=FLUENCY_BANK[0];s.fluencyEvents=[{id:'fail',sessionId:'f',questionId:q.id,correct:false,assisted:false,reason:'context',at:200}];const before=JSON.stringify([s.events,s.cards]);const x=mistakeCollections(s);assert.equal(x.unresolved.length,1);assert.equal(x.unresolved[0].source.type,q.origin.type);assert.equal(JSON.stringify([s.events,s.cards]),before);});
test('assisted correct attempt remains unresolved until independent success',()=>{let s=s0(),q=FLUENCY_BANK[0];s.fluencyEvents=[{id:'hinted',sessionId:'f',questionId:q.id,correct:true,assisted:true,reason:'correct',at:200}];assert.equal(mistakeCollections(s).unresolved.length,1);s.fluencyEvents.push({id:'independent',sessionId:'g',questionId:q.id,correct:true,assisted:false,reason:'correct',at:300});assert.equal(mistakeCollections(s).unresolved.length,0);});
test('course, ladder, remediation and study block histories contribute to follow-up list',()=>{
 const s=s0();for(const [name,stage] of [['courseEvents','sentence'],['ladderEvents','tone'],['courseRepairEvents','vocabulary']])s[name]=[{id:name,sessionId:'session-test',lessonId:'demo-01',stage,wordIndex:0,correct:false,assisted:false,at:300}];s.studyBlockEvents=[{id:'block',blockId:'block1',type:'check',lessonId:'demo-01',kind:'pronunciation',stepIndex:0,correct:false,assisted:false,at:310}];assert.equal(mistakeCollections(s).unresolved.length,4);assert.equal(validateState(s),true);
});
test('manual saved mistake collection persists through version-one backup import',()=>{
 let s=addLesson(s0(),'demo-01',100);s=gradeCard(s,'demo-01:meaning',0,200,'bad',{correct:false});const id='review:demo-01:meaning';s=toggleMistakePin(s,id);assert.deepEqual(s.mistakePins,[id]);s=importBackup(backupDocument(s));assert.deepEqual(mistakeCollections(s).saved.map(x=>x.id),[id]);s=toggleMistakePin(s,id);assert.equal(s.mistakePins.length,0);
});
test('pinned correction remains in saved collection even after later success',()=>{
 let s=addLesson(s0(),'demo-01',100);s=gradeCard(s,'demo-01:meaning',0,200,'bad',{correct:false});s=toggleMistakePin(s,'review:demo-01:meaning');s=gradeCard(s,'demo-01:meaning',3,300,'good',{correct:true});assert.equal(mistakeCollections(s).saved.length,1);assert.equal(mistakeCollections(s).saved[0].unresolved,false);
});
test('unknown, malformed and duplicated pin IDs rejected',()=>{
 assert.throws(()=>toggleMistakePin(s0(),'invented'));const s=s0();s.mistakePins=['review:invented'];assert.throws(()=>validateState(s));s.mistakePins=['review:invented','review:invented'];assert.throws(()=>validatePlanExtensions(s));
});
test('legacy v1 backups without Batch 18 properties remain importable and default safely',()=>{
 const legacy=s0();delete legacy.dailyPlan;delete legacy.mistakePins;const imported=importBackup(backupDocument(legacy));assert.equal(validateState(imported),true);assert.equal(planPreferences(imported).minutes,15);assert.deepEqual(mistakeCollections(imported).saved,[]);
});
test('new plan features never modify scheduled-review events or mastery projections',()=>{
 let s=addLesson(s0(),'demo-01',100);s=gradeCard(s,'demo-01:reading',0,200,'bad',{correct:false});const baseline=JSON.stringify({cards:s.cards,events:s.events,learned:s.learned});s=setPlanPreferences(s,{minutes:25,focus:'mistakes'});s=toggleMistakePin(s,'review:demo-01:reading');plannedDays(s,{now:300});assert.equal(JSON.stringify({cards:s.cards,events:s.events,learned:s.learned}),baseline);
});
test('related reading and dialogue recommendations select real original demo content',()=>{
 const s=s0();let n=nextConnectedMaterial(s);assert.equal(n.reading.id,STORIES[0].id);assert.equal(n.dialogue.id,DIALOGUES[0].id);s.readingEvents=[{id:'a',storyId:STORIES[0].id,at:200}];s.dialogueEvents=[{id:'b',dialogueId:DIALOGUES[0].id,at:200}];n=nextConnectedMaterial(s);assert.equal(n.reading.id,STORIES[1].id);assert.equal(n.dialogue.id,DIALOGUES[1].id);
});
test('planning window rejects invalid or unbounded ranges and clock timestamps',()=>{assert.throws(()=>plannedDays(s0(),{now:NaN}));assert.throws(()=>plannedDays(s0(),{now:100,days:1000}));assert.throws(()=>plannedDays(s0(),{now:-100}));});
test('existing 206 fluency question IDs and official HSK restrictions remain unchanged',()=>{assert.ok(FLUENCY_BANK.length>=206);assert.ok(DEMO_LESSONS.every(x=>x.officialHskLevel===null));});
test('plan route, keyboard actions, mobile link, browser cache and no external data sources',()=>{
 const read=name=>readFileSync(new URL(`../src/${name}`,import.meta.url),'utf8');const app=read('app.mjs'),html=read('index.html'),css=read('styles.css'),sw=read('sw.js');
 for(const id of ['renderPlan','plan-source','plan-pin','plan-minutes','plan-focus','plan-launch','nextConnectedMaterial','mistakeCollections','planSummaryPanel'])assert.ok(app.includes(id),id);
 assert.match(html,/href="#\/plan"/);assert.match(html,/More learning tools/);assert.match(css,/\.plan-task/);assert.match(sw,/character-study-working-v59/);assert.match(sw,/daily-plan\.mjs/);assert.ok(!sw.includes('official-hsk-2025.json'));
});
import {toneRepairSteps} from '../src/tone-coach.mjs';
test('written-tone repair provides specific location, contour and retry steps without speech claims',()=>{
 const result=toneRepairSteps('ni2','nǐ');assert.equal(result.status,'tone');assert.match(result.steps[0],/Syllable 1|second.*third/);assert.equal(result.steps.length,4);assert.match(result.steps.at(-1),/without looking/);
});
test('missing-syllable repair separates form problems from tone problems',()=>{
 const result=toneRepairSteps('ni3','nǐ hǎo');assert.equal(result.status,'syllables');assert.match(result.steps[0],/Syllable|missing|extra/);assert.ok(!result.steps.some(x=>/microphone|speech recognition/i.test(x)));
});
test('correct lexical tones are reported as typed evidence, not certified speech',()=>{
 const result=toneRepairSteps('ni3','nǐ');assert.equal(result.status,'correct');assert.match(result.steps[0],/typed answer/);
});
import {recentStudyRhythm} from '../src/daily-plan.mjs';
test('daily workload portions sum to learner-selected minutes across all plans',()=>{for(const minutes of PLAN_MINUTES){const s=setPlanPreferences(s0(),{minutes,focus:'balanced'});for(const day of plannedDays(s,{now:at(2026,10,12)}))assert.equal(day.tasks.reduce((n,t)=>n+t.minutes,0),minutes);}});
test('seven-day retrospective uses observed activity only and does not touch mastery',()=>{let s=addLesson(s0(),'demo-01',100);s=gradeCard(s,'demo-01:meaning',0,at(2026,10,12),'review-error',{correct:false});const before=JSON.stringify(s.cards);const history=recentStudyRhythm(s,{now:at(2026,10,12)});assert.equal(history.length,7);assert.equal(history.at(-1).reviews,1);assert.equal(history.at(-1).total,1);assert.equal(JSON.stringify(s.cards),before);});
