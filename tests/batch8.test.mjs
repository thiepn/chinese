import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {DIALOGUES,findDialogue,dialogueQuestion,addDialogueEvent,dialogueSummary} from '../src/dialogues.mjs';
import {wordbookQuestion,gradeWordbookQuestion,addWordPracticeEvent,wordbookStats} from '../src/wordbook-lab.mjs';
import {WORDS} from '../src/lexicon.mjs';
import {freshState,addLesson,gradeCard,dueCards,validateState} from '../src/study.mjs';
import {toggleWordBookmark} from '../src/practice-records.mjs';
import {lessonPath,unitOverview} from '../src/pathways.mjs';
import {reviewPlan} from '../src/review-strategy.mjs';
import {progressDiagnostics} from '../src/progress-diagnostics.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
const now=Date.parse('2026-10-12T11:00:00Z');

test('all 74 legacy lessons, 12 readings, and demo-only content boundaries survive',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);
 assert.ok(DEMO_LESSONS.every(l=>l.approval==='DEMO_ONLY'&&l.officialHskLevel===null));
 assert.ok(STORIES.every(s=>s.approval==='DEMO_ONLY'&&s.officialHskLevel===null));
});
test('ten hand-authored dialogues expose thirty turns and twenty unambiguous questions',()=>{
 assert.ok(DIALOGUES.length>=10);
 assert.equal(DIALOGUES.reduce((n,d)=>n+d.lines.length,0),30);
 assert.equal(DIALOGUES.reduce((n,d)=>n+d.questions.length,0),20);
 for(const d of DIALOGUES){assert.equal(findDialogue(d.id),d);for(const line of d.lines){assert.match(line.hanzi,/\p{Script=Han}/u);assert.ok(line.pinyin&&line.english&&['A','B'].includes(line.speaker));}
  for(const [i,q] of d.questions.entries()){assert.equal(dialogueQuestion(d.id,i),q);assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,3);}
 }
 assert.equal(dialogueQuestion('not-a-dialogue',0),null);
});
test('dialogue answers save independently from scheduled mastery',()=>{
 const base=freshState();const q=dialogueQuestion(DIALOGUES[0].id,0);
 const next=addDialogueEvent(base,{id:'d0',dialogueId:DIALOGUES[0].id,question:0,answer:q.answer,at:now});
 assert.deepEqual(base.dialogueEvents,[]);assert.equal(next.dialogueEvents[0].correct,true);
 assert.equal(next.learned.length,0);assert.equal(next.events.length,0);assert.equal(Object.keys(next.cards).length,0);
 assert.equal(dialogueSummary(next).independent,1);validateState(next);
});
test('hint-aided dialogue success stays assisted and does not credit independent activity',()=>{
 const id=DIALOGUES[1].id,q=dialogueQuestion(id,1);
 const state=addDialogueEvent(freshState(),{id:'hint1',dialogueId:id,question:1,answer:q.answer,assisted:true,at:now});
 assert.equal(state.dialogueEvents[0].correct,true);assert.equal(state.dialogueEvents[0].assisted,true);
 assert.equal(dialogueSummary(state).independent,0);
});
test('dialogue events are deduplicated and malformed/unapproved imports are rejected',()=>{
 const d=DIALOGUES[0],q=dialogueQuestion(d.id,0);
 const one=addDialogueEvent(freshState(),{id:'dup',dialogueId:d.id,question:0,answer:q.answer,at:now});
 const same=addDialogueEvent(one,{id:'dup',dialogueId:d.id,question:0,answer:q.answer,at:now});assert.equal(same.dialogueEvents.length,1);
 assert.throws(()=>validateState({...one,dialogueEvents:[{...one.dialogueEvents[0],dialogueId:'official-hsk'}]}),/Invalid dialogue/);
 assert.throws(()=>validateState({...one,dialogueEvents:[{...one.dialogueEvents[0],question:'0'}]}),/Invalid dialogue/);
 assert.throws(()=>validateState({...one,dialogueEvents:[one.dialogueEvents[0],one.dialogueEvents[0]]}),/Invalid dialogue/);
});
test('wordbook selects saved vocabulary without guessing official HSK levels',()=>{
 const state=toggleWordBookmark(freshState(),WORDS[0].key);
 const q=wordbookQuestion(state,0,'meaning');assert.equal(q.key,WORDS[0].key);
 assert.equal(q.kind,'choice');assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
 assert.ok(q.options.includes(q.answer));assert.equal(WORDS[0].officialHskLevel,null);
 assert.equal(wordbookQuestion(freshState()),null);assert.equal(wordbookQuestion(state,0,'invalid'),null);
});
test('wordbook pinyin distinguishes a correct tone and an incorrect tone',()=>{
 // Test against the unchanged demo word index rather than inventing an official lexeme.
 const w=WORDS.find(item=>/\p{Script=Han}/u.test(item.hanzi)&&/[āáǎàēéěèīíǐìōóǒòūúǔù]/.test(item.pinyin));
 assert.ok(w);const s=toggleWordBookmark(freshState(),w.key);const q=wordbookQuestion(s,0,'pinyin');
 assert.equal(gradeWordbookQuestion(q,q.answer).correct,true);
 const changed=q.answer.replace(/[āáǎàēéěèīíǐìōóǒòūúǔù]/,m=>({'ā':'á','á':'ǎ','ǎ':'à','à':'ā','ē':'é','é':'ě','ě':'è','è':'ē','ī':'í','í':'ǐ','ǐ':'ì','ì':'ī','ō':'ó','ó':'ǒ','ǒ':'ò','ò':'ō','ū':'ú','ú':'ǔ','ǔ':'ù','ù':'ū'}[m]));
 const failed=gradeWordbookQuestion(q,changed);assert.equal(failed.correct,false);assert.equal(failed.reason,'tone');
});
test('wordbook attempts remain supplementary, deduplicated and validated',()=>{
 const key=WORDS[0].key;const base=toggleWordBookmark(freshState(),key);
 const updated=addWordPracticeEvent(base,{id:'w1',key,mode:'meaning',correct:false,at:now});
 assert.equal(updated.wordPracticeEvents.length,1);assert.equal(updated.events.length,0);assert.equal(updated.learned.length,0);
 assert.equal(wordbookStats(updated).weak[0],key);
 const again=addWordPracticeEvent(updated,{id:'w1',key,mode:'meaning',correct:false,at:now});assert.equal(again.wordPracticeEvents.length,1);
 assert.throws(()=>validateState({...updated,wordPracticeEvents:[{...updated.wordPracticeEvents[0],key:'fake|fake'}]}),/Invalid (word|vocabulary) practice/);
});
test('legacy backups without new fields round-trip and accept subsequent new events',()=>{
 const old=freshState();delete old.dialogueEvents;delete old.wordPracticeEvents;
 const restored=importBackup(backupDocument(old));validateState(restored);
 const d=addDialogueEvent(restored,{id:'dialogue-v1',dialogueId:DIALOGUES[0].id,question:0,answer:dialogueQuestion(DIALOGUES[0].id,0).answer,at:now});
 const e=addWordPracticeEvent(d,{id:'word-v1',key:WORDS[0].key,mode:'meaning',correct:true,at:now});
 const rebuilt=importBackup(backupDocument(e));assert.equal(rebuilt.version,1);assert.equal(rebuilt.dialogueEvents.length,1);assert.equal(rebuilt.wordPracticeEvents.length,1);validateState(rebuilt);
});
test('existing guided-session and placement metadata survive extended backup unchanged',()=>{
 let s=freshState();s=addLesson(s,DEMO_LESSONS[0].id,now);
 s.placement={status:'skipped',answers:[]};
 s.practiceSession=null;
 const copy=importBackup(backupDocument(s));assert.deepEqual(copy.placement,s.placement);assert.deepEqual(copy.learned,s.learned);assert.equal(copy.events.length,0);
});
test('lesson path gives upcoming material plus explainable, prioritized recovery',()=>{
 let s=freshState();const first=DEMO_LESSONS[0].id;
 assert.equal(lessonPath(s)[0].id,first);s=addLesson(s,first,now);
 s=gradeCard(s,`${first}:meaning`,0,now,'recovery-error',{correct:false});
 const path=lessonPath(s);assert.equal(path[0].kind,'new');assert.ok(path.some(p=>p.kind==='revisit'&&p.id===first));
 assert.ok(path.every(p=>p.reason&&p.lesson&&Number.isFinite(p.score)));
});
test('unit tracking separates introduction from proficiency and preserves 74-lesson total',()=>{
 const units=unitOverview(freshState());assert.ok(units.length>=6);assert.equal(units.reduce((n,u)=>n+u.total,0),DEMO_LESSONS.length);assert.ok(units.every(u=>u.status==='Not started'));
 let s=freshState();for(const l of DEMO_LESSONS.filter(l=>l.order<=13))s=addLesson(s,l.id,now);
 const next=unitOverview(s);assert.equal(next[0].status,'Introduced');assert.equal(next[1].status,'Not started');
});
test('review planner retains only due cards and covers multiple independent skill families',()=>{
 let s=freshState();s=addLesson(s,DEMO_LESSONS[0].id,now);s=addLesson(s,DEMO_LESSONS[1].id,now);
 const plan=reviewPlan(s,{now:now+1000,limit:10});assert.equal(plan.length,10);assert.equal(new Set(plan.map(i=>i.id)).size,10);
 assert.ok(plan.every(i=>dueCards(s,now+1000).includes(i.id)));
 assert.ok(new Set(plan.map(i=>i.family)).size>1);
 assert.ok(reviewPlan(s,{now:now+1000,focus:'pronunciation',limit:10}).every(i=>i.family==='pronunciation'));
});
test('review planner prioritizes missed responses and does not fabricate grades',()=>{
 let s=addLesson(freshState(),DEMO_LESSONS[0].id,now);const missed=`${DEMO_LESSONS[0].id}:meaning`;
 s=gradeCard(s,missed,0,now,'missed',{correct:false});const before=s.events.length;
 const plan=reviewPlan(s,{now:now+3*60000,focus:'weak',limit:10});assert.equal(plan[0].id,missed);
 assert.equal(s.events.length,before);assert.equal(plan[0].reason,'Recent miss or assisted attempt');
});
test('progress diagnostics separate five evidence streams and ignore assisted successes',()=>{
 let s=freshState();s=addDialogueEvent(s,{id:'d1',dialogueId:DIALOGUES[2].id,question:0,answer:dialogueQuestion(DIALOGUES[2].id,0).answer,assisted:true,at:now});
 s=addWordPracticeEvent(s,{id:'w2',key:WORDS[0].key,mode:'meaning',correct:true,at:now});
 const d=progressDiagnostics(s,now+1000);assert.equal(d.sources.length,5);assert.equal(d.totalRecent,2);assert.equal(d.independentRecent,1);
 assert.equal(d.sources.find(x=>x.name==='Dialogues').assisted,1);assert.equal(d.sources.find(x=>x.name==='Saved-word practice').independent,1);
});
test('new features have reachable UI, local-only service worker entries, and v9 cache revision',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 for(const text of ['renderDialogues','renderWordbook','studyPathPanel','renderDiagnosticPanel','dialogue-answer','wordbook-answer','reviewPlan','open-dialogues'])assert.ok(app.includes(text),text);
 assert.ok(html.includes('#/dialogues')&&html.includes('#/wordbook'));
 for(const f of ['dialogues.mjs','wordbook-lab.mjs','pathways.mjs','review-strategy.mjs','progress-diagnostics.mjs'])assert.ok(sw.includes(f));
 assert.ok(sw.includes('working-v53'));assert.ok(!sw.includes('hsk-2025-data'));
});
