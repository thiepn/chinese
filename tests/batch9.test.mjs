import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {WORDS} from '../src/lexicon.mjs';
import {freshState,validateState,addLesson,gradeCard} from '../src/study.mjs';
import {toneExplanation,toneContrast} from '../src/tone-coach.mjs';
import {SENSE_CASES,senseCase,evaluateSense,addSenseEvent,senseStats} from '../src/sense-lab.mjs';
import {SENTENCE_TASKS,sentenceTask,checkSentence,addSentenceEvent,sentenceStats} from '../src/sentence-workshop.mjs';
import {MISSION_STAGES,missionQuestion,gradeMission,addMissionEvent,missionStats} from '../src/dialogue-missions.mjs';
import {wordbookSequence,wordbookQuestion,addWordPracticeEvent} from '../src/wordbook-lab.mjs';
import {toggleWordBookmark} from '../src/practice-records.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {progressDiagnostics} from '../src/progress-diagnostics.mjs';
const now=Date.parse('2026-10-12T10:00:00Z');
test('Batch 9 preserves all earlier demo content without invented HSK membership',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);assert.ok(DIALOGUES.length>=10);
 assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null&&l.approval==='DEMO_ONLY'));
 assert.ok(SENSE_CASES.every(x=>x.origin==='original-editorial-demo'&&x.officialHskLevel===null));
});
test('tone coach accepts numeric and marked pinyin and pinpoints mismatched tone',()=>{
 assert.equal(toneExplanation('ni3','nǐ').correct,true);
 const e=toneExplanation('ni2','nǐ');assert.equal(e.correct,false);assert.equal(e.reason,'tone');assert.match(e.detail,/Syllable 1/);assert.match(e.detail,/second/);assert.match(e.detail,/third/);
});
test('tone coach distinguishes wrong syllables and invalid input without false acoustic claims',()=>{
 const e=toneExplanation('ma3','nǐ');assert.equal(e.reason,'syllables');assert.match(e.detail,/Syllable 1/);
 const invalid=toneExplanation('12345','nǐ');assert.equal(invalid.correct,false);
 assert.match(toneExplanation('ni3','nǐ').detail,/not spoken pronunciation/);
 assert.ok(toneContrast('Nǐ hǎo').includes('third'));
});
test('12 hand-authored sense contexts yield distinct two-choice prompts and contextual reasons',()=>{
 assert.equal(SENSE_CASES.length,12);for(const s of SENSE_CASES){assert.equal(senseCase(SENSE_CASES.indexOf(s)),s);assert.equal(new Set(s.options).size,2);assert.ok(s.options.includes(s.answer));assert.ok(s.explanation&&s.pinyin&&s.english);}
 assert.equal(evaluateSense(SENSE_CASES[0].id,SENSE_CASES[0].answer).correct,true);
 assert.equal(evaluateSense(SENSE_CASES[0].id,SENSE_CASES[0].options.find(x=>x!==SENSE_CASES[0].answer)).correct,false);
});
test('sense attempts never create scheduled-review evidence, preserve assistance, and deduplicate',()=>{
 const base=freshState(),c=SENSE_CASES[2],id='sense-record';const n=addSenseEvent(base,{id,caseId:c.id,correct:true,assisted:true,at:now});
 assert.equal(n.events.length,0);assert.equal(n.learned.length,0);assert.equal(senseStats(n).independent,0);assert.equal(addSenseEvent(n,{id,caseId:c.id,correct:true,at:now}).senseEvents.length,1);
 validateState(n);assert.throws(()=>validateState({...n,senseEvents:[{...n.senseEvents[0],caseId:'official-hsk'}]}),/Invalid sense/);
});
test('all 24 original reading-based exact written sentence tasks are available',()=>{
 assert.ok(SENTENCE_TASKS.length>=24);for(const t of SENTENCE_TASKS.slice(0,24)){assert.ok(t.hanzi&&t.english&&t.pinyin);assert.equal(checkSentence(t,t.hanzi).correct,true);assert.equal(checkSentence(t,`${t.hanzi.replace(/[。！？]/g,'')} `).correct,true);assert.equal(checkSentence(t,'错误').correct,false);}
});
test('sentence workshop does not grade paraphrase or give mastery to assisted answers',()=>{
 const t=sentenceTask(1);assert.equal(checkSentence(t,t.english).correct,false);
 const n=addSentenceEvent(freshState(),{id:'sentence-record',taskId:t.id,correct:true,assisted:true,at:now});assert.equal(sentenceStats(n).independent,0);assert.equal(n.events.length,0);validateState(n);
 assert.equal(addSentenceEvent(n,{id:'sentence-record',taskId:t.id,correct:true,at:now}).sentenceEvents.length,1);
 assert.throws(()=>validateState({...n,sentenceEvents:[{...n.sentenceEvents[0],taskId:'invalid'}]}),/Invalid sentence-workshop/);
});
test('all ten dialogues support three steps with cited evidence and pinyin reference',()=>{
 assert.deepEqual(MISSION_STAGES,['meaning','evidence','pinyin']);for(const d of DIALOGUES.slice(0,10)){for(let i=0;i<3;i++){const q=missionQuestion(d.id,i);assert.ok(q&&q.prompt&&q.answer);if(q.kind==='choice')assert.ok(q.options.includes(q.answer));if(i===2)assert.equal(q.answer,d.lines[1].pinyin);}}
 assert.equal(missionQuestion('official-hsk',0),null);assert.equal(missionQuestion(DIALOGUES[0].id,3),null);
});
test('dialogue mission grades typed tones and keeps correct assisted answers supplementary',()=>{
 const d=DIALOGUES[0],q=missionQuestion(d.id,2);assert.equal(gradeMission(q,q.answer).correct,true);
 assert.equal(gradeMission(q,'nonsense').correct,false);
 const n=addMissionEvent(freshState(),{id:'mission-record',dialogueId:d.id,step:2,correct:true,assisted:true,at:now});assert.equal(missionStats(n).independent,0);assert.equal(n.events.length,0);assert.equal(n.learned.length,0);validateState(n);
 assert.equal(addMissionEvent(n,{id:'mission-record',dialogueId:d.id,step:2,correct:true,at:now}).missionEvents.length,1);
});
test('wordbook practice provides all / missed / unpracticed selections',()=>{
 let n=freshState();n=toggleWordBookmark(n,WORDS[0].key);n=toggleWordBookmark(n,WORDS[1].key);
 assert.equal(wordbookSequence(n,'all').length,2);assert.equal(wordbookSequence(n,'unpracticed').length,2);
 n=addWordPracticeEvent(n,{id:'miss',key:WORDS[0].key,mode:'meaning',correct:false,at:now});
 assert.equal(wordbookSequence(n,'missed').length,1);assert.equal(wordbookSequence(n,'unpracticed').length,1);
 assert.equal(wordbookQuestion(n,0,'meaning','missed').key,WORDS[0].key);
});
test('legacy v1 backups without Batch 9 histories import and remain writable',()=>{
 const old=freshState();delete old.senseEvents;delete old.sentenceEvents;delete old.missionEvents;
 let restored=importBackup(backupDocument(old));restored=addSentenceEvent(restored,{id:'legacy-new',taskId:SENTENCE_TASKS[0].id,correct:true,at:now});
 restored=addSenseEvent(restored,{id:'legacy-sense',caseId:SENSE_CASES[0].id,correct:false,at:now});
 restored=addMissionEvent(restored,{id:'legacy-mission',dialogueId:DIALOGUES[0].id,step:0,correct:true,at:now});
 const round=importBackup(backupDocument(restored));assert.equal(round.version,1);assert.equal(round.sentenceEvents.length,1);assert.equal(round.senseEvents.length,1);assert.equal(round.missionEvents.length,1);
});
test('new supplemental histories never mutate legacy review events, learned IDs or guided checkpoints',()=>{
 let n=addLesson(freshState(),DEMO_LESSONS[0].id,now);n=gradeCard(n,`${DEMO_LESSONS[0].id}:meaning`,0,now,'original-review',{correct:false});const before=structuredClone(n);
 n=addMissionEvent(n,{id:'new-m',dialogueId:DIALOGUES[0].id,step:1,correct:true,at:now});
 n=addSenseEvent(n,{id:'new-s',caseId:SENSE_CASES[0].id,correct:true,at:now});
 n=addSentenceEvent(n,{id:'new-w',taskId:SENTENCE_TASKS[0].id,correct:true,at:now});
 assert.deepEqual(n.events,before.events);assert.deepEqual(n.cards,before.cards);assert.deepEqual(n.learned,before.learned);assert.equal(n.practiceSession,null);
});
test('progress diagnostics report new evidence streams separately from existing ones',()=>{
 const state=addSenseEvent(freshState(),{id:'stat-s',caseId:SENSE_CASES[0].id,correct:true,at:now});
 const d=progressDiagnostics(state,now+1000);assert.equal(d.sources.length,5);assert.equal(d.extras.length,3);assert.equal(d.totalRecent,0);assert.equal(d.extras[0].independent,1);
});
test('new routes, handlers, responsive CSS and offline dependencies are connected',()=>{
 const r=n=>readFileSync(new URL(`../src/${n}`,import.meta.url),'utf8');const app=r('app.mjs'),sw=r('sw.js'),html=r('index.html'),css=r('styles.css');
 for(const route of ['senses','workshop'])assert.ok(app.includes(`route==='${route}'`)||app.includes(`${route}:render`));
 for(const word of ['mission-start','mission-answer','workshop-check','sense-answer','wordbook-focus','toneExplanation'])assert.ok(app.includes(word),word);
 for(const asset of ['tone-coach.mjs','sense-lab.mjs','sentence-workshop.mjs','dialogue-missions.mjs'])assert.ok(sw.includes(asset));
 for(const route of ['#/senses','#/workshop'])assert.ok(html.includes(route));assert.ok(sw.includes('working-v73'));assert.ok(css.includes('.learning-studio'));
});
