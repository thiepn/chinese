import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,addLesson,gradeCard,validateState,dueCards} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {learningHub,activeLearningSessions,LEARNING_DESTINATIONS} from '../src/learning-hub.mjs';
import {contentConnections,nextInCollection} from '../src/context-continuity.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {FLUENCY_BANK} from '../src/fluency-studio.mjs';
const stamp=new Date(2026,9,12,12).getTime();
const original=()=>freshState();
test('Batch 19 retains independently authored demonstration curriculum counts',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);assert.ok(DIALOGUES.length>=10);assert.ok(FLUENCY_BANK.length>=206);
 assert.ok(DEMO_LESSONS.every(l=>l.officialHskLevel===null));
});
test('Unified course home chooses next unintroduced lesson, never fabricates mastery',()=>{
 const s=original();const before=structuredClone(s),h=learningHub(s,{now:stamp});
 assert.equal(h.primary.kind,'journey');assert.equal(h.primary.lessonId,DEMO_LESSONS[0].id);
 assert.equal(h.introduced,0);assert.equal(h.cards.length,4);assert.equal(h.plan.minutes,15);
 assert.deepEqual(s,before);
});
test('Due recall takes precedence over new lessons without modifying the grade',()=>{
 const s=addLesson(original(),'demo-01',stamp-86400000);
 const before=JSON.stringify([s.cards,s.events]);const h=learningHub(s,{now:stamp});
 assert.equal(h.primary.kind,'review');assert.equal(h.due,6);
 assert.equal(JSON.stringify([s.cards,s.events]),before);
});
test('Previously recorded unresolved error suggests remediation when no recall is due',()=>{
 let s=addLesson(original(),'demo-01',100);
 s=gradeCard(s,'demo-01:reading',0,200,'fail',{correct:false,assisted:false});
 for(const x of Object.values(s.cards))x.due=stamp+100000;
 assert.equal(learningHub(s,{now:stamp}).primary.kind,'remediation');
 assert.equal(learningHub(s,{now:stamp}).unresolved,1);
});
test('Saved Study Block is recommended before due scheduled review',()=>{
 let s=addLesson(original(),'demo-01',stamp-1000);
 s.studyBlock={id:'local-block',focus:'balanced',lessonIds:['demo-01','demo-02'],cursor:0,startedAt:stamp,assistanceUsed:false,feedback:null,
 steps:[{lessonId:'demo-01',kind:'journey',baseline:0},{lessonId:'demo-01',kind:'ladder',baseline:0},{lessonId:'demo-02',kind:'journey',baseline:0},{lessonId:'demo-02',kind:'ladder',baseline:0},{lessonId:'demo-02',kind:'contrast',baseline:0},{lessonId:'demo-02',kind:'pronunciation',baseline:0}]};
 assert.equal(validateState(s),true);const h=learningHub(s,{now:stamp});
 assert.equal(h.primary.kind,'resume');assert.equal(h.primary.route,'block');assert.equal(h.sessions[0].detail.includes('Step 1 of 6'),true);
});
test('All existing activity checkpoint types retain distinct resume routes',()=>{
 const s=original();s.practiceSession={cursor:3,limit:10};s.courseJourney={lessonId:'demo-02',cursor:3};s.ladderSession={lessonId:'demo-01',cursor:2};
 s.fluencySession={cursor:1,questionIds:['f0','f1','f2']};
 const sessions=activeLearningSessions(s);
 assert.deepEqual(sessions.map(x=>x.kind),['journey','ladder','fluency','practice']);
 assert.deepEqual(sessions.map(x=>x.route),['journey','ladder','fluency','practice']);
});
test('Legacy v1 backups load without newly invented persisted hub state',()=>{
 const s=original();delete s.dailyPlan;delete s.mistakePins;delete s.courseJourney;delete s.fluencySession;
 const restored=importBackup(backupDocument(s));assert.equal(validateState(restored),true);
 assert.equal(learningHub(restored,{now:stamp}).cards.length,4);
 assert.equal('learningHub' in restored,false);assert.equal(restored.version,1);
});
test('Hub action selection does not consume session histories or grant recall',()=>{
 let s=addLesson(original(),'demo-01',stamp);
 const before=JSON.stringify([s.cards,s.events,s.courseEvents,s.fluencyEvents]);
 for(let i=0;i<20;i++){learningHub(s,{now:stamp});activeLearningSessions(s)}
 assert.equal(JSON.stringify([s.cards,s.events,s.courseEvents,s.fluencyEvents]),before);
});
test('Lesson context links reference only matching original words and passages',()=>{
 for(const lesson of DEMO_LESSONS){const v=contentConnections(lesson.id);assert.equal(v.lesson.id,lesson.id);
  assert.ok(v.words.every(w=>lesson.words.some(l=>l.hanzi===w.hanzi)));
  for(const r of v.stories){const story=STORIES.find(x=>x.id===r.id);assert.ok(story);assert.ok(r.matches.every(w=>story.lines.some(line=>line.hanzi.includes(w))))}
  for(const d of v.dialogues){const dialogue=DIALOGUES.find(x=>x.id===d.id);assert.ok(dialogue);assert.ok(d.matches.every(w=>dialogue.lines.some(line=>line.hanzi.includes(w))))}
 }
 assert.deepEqual(contentConnections('fake').stories,[]);
});
test('Context continuation handles unknown IDs safely and cycles only provided content',()=>{
 assert.equal(nextInCollection([], 'anything'),null);
 assert.equal(nextInCollection(STORIES,'missing').id,STORIES[0].id);
 assert.equal(nextInCollection(STORIES,STORIES.at(-1).id).id,STORIES[0].id);
});
test('All key course and source routes are available in unified navigation',()=>{
 for(const id of ['today','plan','learn','review','stories','dialogues','fluency','explore'])assert.ok(LEARNING_DESTINATIONS.some(x=>x.route===id));
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const marker of ['hubHomePanel','hubResumeStrip','renderC9ContextNav','hub-primary','hub-resume','hub-task','hub-lesson','hub-dialogue','wordDetail','contentConnections'])assert.ok(app.includes(marker),marker);
});
test('Mobile navigation and static cache include all new app modules with no official HSK data',()=>{
 const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.equal((html.match(/href="#\/plan" data-route="plan"/g)||[]).length,2);
 assert.match(html,/More learning tools/);assert.match(sw,/character-study-working-v86/);
 assert.match(sw,/learning-hub\.mjs/);assert.match(sw,/context-continuity\.mjs/);
 assert.ok(!sw.includes('official-hsk-2025.json'));
});
