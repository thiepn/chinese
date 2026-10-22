import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace,c9LessonTransferSources} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState,addLesson} from '../src/study.mjs';
import {startPlacement} from '../src/placement.mjs';
import {learningHub} from '../src/learning-hub.mjs';
import {renderC9Review} from '../src/review-practice-c9.mjs';
import {findLibrarySentence} from '../src/sentence-library.mjs';
import {findStory,STORIES} from '../src/stories.mjs';
import {findDialogue,DIALOGUES} from '../src/dialogues.mjs';
import {renderC9ReadingHub,renderC9DialogueHub,c9RoleplaySource,c9ReadingRecallSource,renderC9DialogueRoleplay,renderC9ReadingRecall,c9DialogueQuestionRepair,renderC9DialogueQuestionRepair} from '../src/media-c9.mjs';
import {P33_SCENARIOS} from '../src/p33-scenarios.mjs';
import {p33DecisionSource,p33ScenarioTeaching} from '../src/p33-screen.mjs';
import {SENTENCE_TASKS} from '../src/sentence-workshop.mjs';
import {c9ConversationCircuit,renderC9ConversationCircuit,c9WorkshopSourceContinuation,renderC9WorkshopSourceContinuation} from '../src/conversation-circuit-c9.mjs';
import {P34_LISTENING} from '../src/p34-course.mjs';
import {P43_UNITS} from '../src/p43-course.mjs';
const act=(name,label,classes='',attrs='')=>'<button data-action="'+name+'" class="'+classes+'" '+attrs+'>'+label+'</button>';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

test('P9 Home exposes authored next study and actual unit roadmap without claiming mastery',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9Home(state,act,esc);
 for(const key of ['c9-home-first-fold','c9-home-source-preview','c9-home-plan','c9-home-metrics','c9-home-roadmap','hub-task','hub-lesson'])assert.ok(html.includes(key),key);
 assert.ok(html.indexOf('c9-home-explore-more')<html.indexOf('c9-home-roadmap'));
 assert.ok(html.includes('Start lesson 001'), 'Home must reveal its first lesson directly');
 assert.ok(html.includes('data-action="hub-lesson"'), 'Home must use original lesson authority');
 assert.ok(html.includes(esc(DEMO_LESSONS[0].sentence.hanzi)));
 assert.ok(html.includes('Introduced does not mean mastered'));
 assert.doesNotMatch(html,/HSK 1 progress|12.day streak|92% accuracy/);
 assert.equal(JSON.stringify(state),before);
});

test('P9 native sidebar keeps all five destinations in accessible nested navigation',()=>{
 const shell=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 assert.equal((shell.match(/<details class="c9-sidebar-study-more">/g)||[]).length,2);
 assert.ok(shell.includes('<nav aria-label="Additional study pathways"'));
 for(const route of ['skills','writing','advanced','pathway','plan'])assert.ok(shell.includes('data-route="'+route+'"'),route);
 const sync=readFileSync(new URL('../src/shell-c9.mjs',import.meta.url),'utf8');
 assert.ok(sync.includes('group.open=true'));
});

test('P9 Lesson retains six native sections and original read-only source previews',()=>{
 const lesson=DEMO_LESSONS[0];
 const native='<section id="c9-lesson-overview" class="c9-native-section" tabindex="-1" aria-label="Character"></section>';
 const html=renderC9LessonWorkspace({lesson,state:freshState(),nativeMarkup:native,act,esc});
 for(const key of ['c9-lesson-source-preview','c9-lesson-stage-heading','c9-lesson-start-status','c9-lesson-side-head'])assert.ok(html.includes(key),key);
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(html.includes('data-section="overview"'));
 assert.ok(html.includes('Read-only preview'));
});

test('P9 Character still prioritizes real whole words and sentence without fake stroke authority',()=>{
 const lesson=DEMO_LESSONS[0];
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9CharacterStudy({lesson,state,act,esc});
 for(const key of ['c9-character-glyph','c9-character-source-sample','c9-writing-canvas','c9-character-tabs'])assert.ok(html.includes(key),key);
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(html.includes('Stroke-order data</span><strong>Not installed'));
 assert.equal(JSON.stringify(state),before);
});

test('C9-50 integrated Character preserves native source links and ungraded writing on translation checks',()=>{
 const state=freshState(),before=JSON.stringify(state),lesson=DEMO_LESSONS[0];
 const html=renderC9CharacterStudy({lesson,state,act,esc,showTranslations:false});
 assert.ok(html.includes('data-translations="false"'));
 for(const key of ['class="c9-character-word-gloss" hidden','class="c9-character-example-translation" hidden',
  'class="c9-character-sample-english" hidden','class="c9-character-first-actions"',
  'data-action="lookup-word"','data-action="c9-character-reader"','id="c9-writing-canvas"'])
  assert.ok(html.includes(key),key);
 const source=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const start=source.indexOf("if(name==='c9-character-support')"),end=source.indexOf("if(name==='c9-character-jump')",start);
 assert.ok(start>0&&end>start);
 const handler=source.slice(start,end);
 assert.ok(handler.includes('page.dataset.translations=String(c9CharacterShowTranslations)'));
 assert.ok(handler.includes("node.hidden=!c9CharacterShowTranslations"));
 assert.ok(handler.includes("button.textContent=c9CharacterShowTranslations"));
 assert.ok(source.includes('.c9-character-tabs [data-action='));
 assert.ok(source.includes('.c9-lesson-sections [data-action='));
 assert.equal(JSON.stringify(state),before);
});

test('C9-50 P9 compact surfaces retain original guided and indexed curriculum authorities',()=>{
 const state=freshState(),before=JSON.stringify(state),lesson=DEMO_LESSONS[0];
 const home=renderC9Home(state,act,esc);
 assert.ok(home.includes('class="c9-home-listening"'));
 assert.ok(home.includes('Listen and shadow this sentence'));
 assert.ok(home.includes('data-action="hub-lesson"'));
 const html=renderC9LessonWorkspace({lesson,state,nativeMarkup:'',act,esc});
 assert.ok(html.includes('class="c9-lesson-resources"'));
 assert.ok(html.includes('Preview original source and audio'));
 assert.ok(html.includes('class="c9-lesson-preview-toolbar"'));
 assert.ok(html.includes('data-action="lookup-word"'));
 assert.ok(html.includes('data-action="c9-character-reader"'));
 assert.ok(html.indexOf('c9-lesson-layout')<html.indexOf('c9-lesson-resources'));
 assert.ok(html.indexOf('c9-lesson-resources')<html.indexOf('c9-lesson-bottom-nav'));
 assert.ok(html.includes('data-section="overview"'));
 assert.equal(JSON.stringify(state),before);
});

test('P9 native source disclosures stay visually and keyboard hidden until activated',()=>{
 const state=freshState(),previous=JSON.stringify(state);
 const html=renderC9LessonWorkspace({lesson:DEMO_LESSONS[0],state,nativeMarkup:'',act,esc});
 const home=renderC9Home(state,act,esc);
 assert.ok(html.includes('<details class="c9-lesson-resources">'));
 assert.ok(home.includes('<details class="c9-home-listening">'));
 const a=readFileSync(new URL('../src/styles-c9-lesson.css',import.meta.url),'utf8');
 const b=readFileSync(new URL('../src/styles-c9-home.css',import.meta.url),'utf8');
 assert.ok(a.includes('.c9-lesson-resources:not([open]) > .c9-lesson-resources-content{display:none!important}'));
 assert.ok(b.includes('.c9-home-listening:not([open]) > .c9-listening-deck{display:none!important}'));
 assert.equal(JSON.stringify(state),previous);
});


test('C9-53 native review presents start first and separates optional recall configuration',()=>{
 const first=DEMO_LESSONS[0],state=addLesson(freshState(),first.id,Date.now()-10000);
 const before=JSON.stringify(state);
 const args={state,action:act,esc,reviewWorkspace:()=>'',toneTeachingPanel:()=>''};
 const html=renderC9Review(args);
 assert.ok(html.includes('data-action="review-begin"'),'due review must start directly');
 assert.ok(html.includes('class="c9-review-options"'),'session customization remains optional');
 assert.ok(html.includes('<summary>Change focus or session length'));
 assert.ok(html.includes('id="review-focus"'));
 assert.ok(html.indexOf('data-action="review-begin"')<html.indexOf('id="review-focus"'),'primary recall precedes options');
 assert.equal(JSON.stringify(state),before,'renderer cannot alter graded authority');
 const fresh=renderC9Review({...args,state:freshState()});
 assert.ok(fresh.includes('Practise without scheduling'));
 assert.ok(!fresh.includes('data-action="review-begin"'),'cannot grade nonexistent due prompts');
});

test('C9-53 source-return helper preserves exact authored lessons and visible completion',()=>{
 const code=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const name of ['plan-source','fluency-source','foundation-unit','context-open','placement-lesson','guided-explore','story-linked']){
  assert.ok(code.includes(name),name+' original route was removed');
 }
 assert.ok(code.includes('function c9OpenAuthoredLesson(id)'), 'same original lesson source handoff is required');
 assert.ok(code.includes('catalog.open=true'), 'return must expose the native lesson catalog');
 assert.ok(!code.includes('displayLessonId=DEMO_LESSONS[idx+1].id;render();'), 'introduction must not silently advance the lesson');
 const state=addLesson(freshState(),DEMO_LESSONS[0].id,Date.now()-10000);
 const workspace=renderC9LessonWorkspace({lesson:DEMO_LESSONS[0],state,nativeMarkup:'',section:'finish',act,esc});
 assert.ok(workspace.includes('c9-lesson-finish-confirmation'));
 assert.ok(workspace.includes('data-action="c9-lesson-select"'));
 assert.ok(workspace.includes('Scheduled review'));
});


test('C9-54 original lesson identity can be linked without changing private learning records',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9LessonWorkspace({lesson:DEMO_LESSONS[0],state,nativeMarkup:'',act,esc});
 assert.ok(html.includes('data-action="c9-lesson-copy-link"'));
 assert.ok(html.includes('data-id="'+DEMO_LESSONS[0].id+'"'));
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes('learn:/^#\\/learn\\/(demo-\\d{2,3})$/'), 'known original ID route required');
 assert.ok(app.includes('findLesson(id)?id:null'),'must verify original source');
 assert.ok(app.includes("location.hash=target"),'source handoff should enter browser history');
 assert.ok(app.includes('c9OpenCatalogAfterHash'),'native catalog must be reachable by Back');
 assert.equal(JSON.stringify(state),before,'public source link may not alter learner state');
});


test('C9-55 original lesson transfer exposes only canonical source IDs without modifying learner state',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const cases=DEMO_LESSONS.map(lesson=>({lesson,transfer:c9LessonTransferSources(lesson,state)}));
 let withSentence=0,withReading=0,withRelated=0;
 for(const {lesson,transfer} of cases){
  assert.ok(transfer.words.length<=3&&transfer.sentences.length<=2&&transfer.readings.length<=2);
  const keys=new Set(transfer.words.map(x=>x.key));
  assert.equal(keys.size,transfer.words.length,'avoid duplicate original canonical words');
  for(const row of transfer.sentences){
   assert.ok(findLibrarySentence(row.id),'original sentence library identity, including canonical multi-digit IDs');
   assert.ok(transfer.words.some(word=>row.hanzi.includes(word.hanzi)),'exact written-form occurrence');
  }
  for(const row of transfer.readings){
   assert.ok(findStory(row.id)&&row.hanzi&&row.pinyin&&row.english,'authored story source identity and data only');
   assert.ok(transfer.words.some(word=>row.hanzi.includes(word.hanzi)),'passage example must include canonical word');
  }
  for(const row of transfer.related){
   assert.ok(DEMO_LESSONS.some(x=>x.id===row.id),'linked original lesson exists');
   assert.notEqual(row.id,lesson.id,'no self-loop');
  }
  if(transfer.sentences.length)withSentence++;
  if(transfer.readings.length)withReading++;
  if(transfer.related.length)withRelated++;
 }
 assert.ok(withSentence>20,'real source sentences must serve more than an isolated example');
 assert.ok(withReading>5,'real passage examples must exist for several original lessons');
 assert.ok(withRelated>5,'shared-word related lessons must exist in the original source');
 const lesson=DEMO_LESSONS[0],rendered=renderC9LessonWorkspace({lesson,state,nativeMarkup:'',act,esc,section:'context'});
 assert.ok(rendered.includes('id="c9-lesson-transfer"'));
 assert.ok(rendered.includes('data-action="lookup-word"'));
 assert.ok(rendered.includes('data-action="c9-lesson-transfer-jump"'));
 assert.ok(rendered.includes('No auto credit')||rendered.includes('NO AUTO CREDIT'));
 assert.equal(JSON.stringify(state),before,'transfer UI and projection are entirely read-only');
});


test('C9-56 original reading and conversation links use canonical source identity, never private learner evidence',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const source of STORIES)assert.strictEqual(findStory(source.id),source);
 for(const source of DIALOGUES)assert.strictEqual(findDialogue(source.id),source);
 for(const phrase of [
  "stories:/^#\\/stories\\/(story-\\d{2,4})$/",
  "dialogues:/^#\\/dialogues\\/(dialogue-\\d{2,4})$/",
  "screen==='stories'?(findStory(id)?id:null)",
  "screen==='dialogues'?(findDialogue(id)?id:null)",
  "function c9OpenMediaSource(screen,id)",
  "if(!c9ConfirmLeaveNativeAnswer(from))return false",
  "mediaSourceExit",
  "resetReadingNavigation()",
  "p34TranscriptViewed=false"
 ])assert.ok(app.includes(phrase),'source routing preserved: '+phrase);
 const reading=renderC9ReadingHub(state,STORIES[0],act,esc);
 const dialogue=renderC9DialogueHub(state,DIALOGUES[0],act,esc);
 assert.ok(reading.includes('data-action="c9-media-copy-reading"'));
 assert.ok(reading.includes('data-id="'+STORIES[0].id+'"'));
 assert.ok(dialogue.includes('data-action="c9-media-copy-dialogue"'));
 assert.ok(dialogue.includes('data-id="'+DIALOGUES[0].id+'"'));
 assert.equal(JSON.stringify(state),before,'opening public sources cannot create grades');
});


test('C9-57 all original conversations support ungraded role-taking with exact immutable source turns',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const dialogue of DIALOGUES){
  const source=c9RoleplaySource(dialogue,{});
  assert.ok(source.reply,'every authored dialogue must contain a playable speaking turn');
  assert.ok(source.roles.includes(source.role),'selected original speaker role');
  assert.strictEqual(source.reply,dialogue.lines[source.index],'never synthesize learner dialogue');
  assert.strictEqual(source.cue,source.index>0?dialogue.lines[source.index-1]:null);
  const html=renderC9DialogueRoleplay(dialogue,{role:source.role,position:0,revealed:false,typed:''},act,esc);
  for(const action of ['c9-roleplay-role','c9-roleplay-reveal','c9-roleplay-spoke','c9-roleplay-retry','c9-roleplay-move'])
   assert.ok(html.includes('data-action="'+action+'"'),'interactive original dialog: '+action);
  assert.ok(!html.includes('c9-rehearsal-reference'),'cannot leak hidden script before reveal');
  const revealed=renderC9DialogueRoleplay(dialogue,{role:source.role,position:0,revealed:true,typed:source.reply.hanzi},act,esc);
  assert.ok(revealed.includes(source.reply.hanzi));
  assert.ok(revealed.includes('This does not assess pronunciation'));
  assert.ok(revealed.includes('ASSISTED'));
  assert.ok(source.indices.every(i=>dialogue.lines[i].speaker===source.role));
 }
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const guard of ['c9RoleplayUi.referenceSeen','dialogueSupport=true','p34TranscriptViewed=true','missionSupport=true',
  "if(screen==='dialogues'&&!c9RoleplayUi.revealed", "if(name==='c9-roleplay-hear-cue')"])
  assert.ok(app.includes(guard),'preserve native assisted evidence and drafts: '+guard);
 assert.equal(JSON.stringify(state),before,'roleplay is not a second progress writer');
});

test('C9-57 every original reading supports ungraded source-exact listen-to-write',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const story of STORIES){
  const source=c9ReadingRecallSource(story,{index:story.lines.length+5});
  assert.strictEqual(source.line,story.lines[story.lines.length-1]);
  const html=renderC9ReadingRecall(story,{index:0,revealed:false,typed:''},act,esc);
  for(const action of ['c9-reading-recall-listen','c9-reading-recall-listen-slow',
   'c9-reading-recall-reveal','c9-reading-recall-move','c9-reading-recall-retry'])
   assert.ok(html.includes('data-action="'+action+'"'),'interactive source dictation: '+action);
  assert.ok(!html.includes('c9-rehearsal-reference'),'no original line is disclosed before reference');
  const revealed=renderC9ReadingRecall(story,{index:0,revealed:true,typed:story.lines[0].hanzi},act,esc);
  assert.ok(revealed.includes(story.lines[0].hanzi));
  assert.ok(revealed.includes('Typed characters match the source exactly'));
  assert.ok(revealed.includes('no grade'));
 }
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const guard of ['c9ReadingRecallUi.referenceSeen','storyAssist=true',
  "if(screen==='stories'&&!c9ReadingRecallUi.revealed", "if(name==='c9-reading-recall-reveal')"])
  assert.ok(app.includes(guard),'source-owned read/write and original grading: '+guard);
 assert.equal(JSON.stringify(state),before,'private learner history untouched');
});


test('C9-58 all 25 original P33 conversations offer two source-attested interactive decisions and native writing',()=>{
 const state=freshState(),before=JSON.stringify(state);
 assert.equal(P33_SCENARIOS.length,25,'this is the original authored scenario collection');
 for(const scene of P33_SCENARIOS){
  const dialogue=DIALOGUES.find(d=>d.p33?.id===scene.id);
  assert.ok(dialogue,'native original dialogue exists');
  assert.equal(scene.alternatives.length,2);
  assert.equal(p33DecisionSource(scene,-1),null,'no synthetic branch fallback');
  assert.equal(p33DecisionSource(scene,22),null,'invalid branch rejected');
  const options=scene.alternatives.map((alternative,index)=>{
   const choice=p33DecisionSource(scene,index);
   assert.strictEqual(choice.option,alternative,'original authored choice/reply');
   assert.strictEqual(choice.cue,scene.turns[0],'actual authored opening');
   assert.ok(alternative.reply.hanzi&&alternative.reply.pinyin&&alternative.reply.english);
   const beforeChoice=p33ScenarioTeaching(dialogue,index,act,esc,{typed:'',revealed:false});
   assert.ok(beforeChoice.includes('data-action="p33-decision-reveal"'));
   assert.ok(beforeChoice.includes('id="p33-decision-entry"'));
   assert.ok(!beforeChoice.includes('class="p33-decision-reference"'),'partner continuation hidden before self-check');
   const revealed=p33ScenarioTeaching(dialogue,index,act,esc,{typed:alternative.reply.hanzi,revealed:true});
   assert.ok(revealed.includes('class="p33-decision-reference"'));
   assert.ok(revealed.includes('Your written Chinese exactly matches'));
   assert.ok(revealed.includes(alternative.reply.pinyin));
   assert.ok(revealed.includes('Valid alternative replies are not automatically graded.')===false);
   assert.ok(revealed.includes('data-action="p33-decision-retry"'));
   return alternative.reply.hanzi;
  });
  assert.notEqual(options[0],options[1],'original alternatives lead to distinct authored partner responses');
  for(const turn of [1,4,7]){
   assert.ok(SENTENCE_TASKS.some(task=>task.id==='p33:'+scene.id+':turn'+turn),'reuses existing original graded writing task');
  }
 }
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const phrase of ["if(name==='p33-decision-reveal')","if(name==='p33-decision-retry')",
  "p33DecisionUi.referenceSeen=true","p33DecisionUi.referenceSeen||p34TranscriptViewed",
  "if(screen==='dialogues'&&p33Branch!==null&&!p33DecisionUi.revealed"])
  assert.ok(app.includes(phrase),'assist/protect original grading and draft: '+phrase);
 assert.equal(JSON.stringify(state),before,'P33 decision learning is ungraded read-only navigation');
});


test('C9-59 multi-situation circuits reuse original P33/P34/P43 IDs and only observed independent native evidence',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const dialogues=DIALOGUES.filter(d=>d.p33);
 assert.equal(dialogues.length,P33_SCENARIOS.length,'all 25 original scenes must map to existing native dialogues');
 let withMulti=0,withListening=0;
 for(const dialogue of dialogues){
  const projection=c9ConversationCircuit(dialogue,state);
  assert.ok(projection,'source-attested P33 circuit');
  assert.ok(projection.count>=1);
  assert.strictEqual(projection.current.dialogueId,dialogue.id);
  assert.equal(projection.sequence[projection.index].sceneId,dialogue.p33.id);
  assert.ok(projection.sequence.every(x=>P33_SCENARIOS.some(s=>s.id===x.sceneId&&s.theme===projection.theme)));
  assert.ok(projection.sequence.every(x=>findDialogue(x.dialogueId)?.p33?.id===x.sceneId));
  if(projection.count>1)withMulti++;
  if(projection.listening){
   withListening++;
   assert.ok(P34_LISTENING.some(x=>x.id===projection.listening.id));
   assert.equal(projection.listening.theme,projection.theme,'only EXACT P34 editorial theme label');
  }
  if(projection.writingUnit){
   assert.ok(P43_UNITS.some(u=>u.id===projection.writingUnit.id&&u.dialogueId===dialogue.id));
  }
  assert.ok(SENTENCE_TASKS.some(t=>t.id===projection.current.writingTaskId&&t.p33ScenarioId===dialogue.p33.id));
  assert.equal(projection.current.attempts,0);
  assert.equal(projection.current.independent,0);
  assert.equal(projection.current.writing,0);
  const html=renderC9ConversationCircuit(dialogue,state,act,esc);
  assert.ok(html.includes('id="c9-conversation-circuit"'));
  assert.ok(html.includes('data-action="c9-circuit-write"'));
  assert.ok(html.includes('data-id="'+projection.current.writingTaskId+'"'));
  assert.ok(html.includes('not a continuous invented conversation'));
  assert.ok(html.includes('original listening and questions')===false||projection.listening);
 }
 assert.ok(withMulti>=12,'majority of original P33 scenes must have same-theme multi-situation continuation');
 const target=dialogues.find(d=>c9ConversationCircuit(d,state).next);
 const projected=c9ConversationCircuit(target,state);
 const writeId=projected.current.writingTaskId;
 const historical={
  ...freshState(),
  dialogueEvents:[{id:'c9-59-q',dialogueId:target.id,question:0,correct:true,assisted:false,at:100}],
  missionEvents:[],
  sentenceEvents:[{id:'c9-59-w',taskId:writeId,correct:false,assisted:true,at:101}]
 };
 const evidence=c9ConversationCircuit(target,historical).current;
 assert.equal(evidence.attempts,1);assert.equal(evidence.independent,1);
 assert.equal(evidence.writing,1);assert.equal(evidence.independentWriting,0);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const needle of ["if(name==='c9-circuit-open')","if(name==='c9-circuit-write')",
  "c9OpenMediaSource('dialogues',selected.id)","c9OpenNativeWorkshopTask(index)",
  "return c9OpenMediaSource('dialogues',dialogue.id);"]){
  assert.ok(app.includes(needle),'original source controller: '+needle);
 }
 assert.equal(JSON.stringify(state),before,'circuit is a pure read-only source/evidence view');
});


test('C9-60 every original P33 circuit exposes all three canonical workshop prompts with honest per-task evidence',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const d of DIALOGUES.filter(x=>x.p33)){
  const projected=c9ConversationCircuit(d,state);
  assert.equal(projected.current.writingTasks.length,3,'exact three original P33 tasks');
  const sourceIds=projected.current.writingTasks.map(x=>x.id);
  assert.equal(new Set(sourceIds).size,3,'original IDs are distinct');
  for(let i=0;i<sourceIds.length;i++){
   const task=SENTENCE_TASKS.find(x=>x.id===sourceIds[i]);
   assert.ok(task&&task.p33ScenarioId===d.p33.id);
   assert.equal(projected.current.writingTasks[i].turn,task.p33Turn);
   const origin={kind:'p33',dialogueId:d.id,taskId:task.id};
   const continuation=c9WorkshopSourceContinuation(task.id,origin,state);
   assert.equal(continuation.dialogueId,d.id);
   assert.equal(continuation.position,i);
   assert.equal(continuation.nextTaskId,sourceIds[i+1]||null);
   assert.equal(continuation.attempts,0);
   assert.ok(renderC9WorkshopSourceContinuation(task.id,origin,state,act,esc).includes('id="c9-workshop-continuation"'));
   assert.equal(c9WorkshopSourceContinuation(task.id,{...origin,dialogueId:DIALOGUES[0].id==='__none'?'x':'forged-id'},state),null,'forged dialogue rejected');
   assert.equal(c9WorkshopSourceContinuation(task.id,{...origin,taskId:'forged'},state),null,'forged task rejected');
  }
  const html=renderC9ConversationCircuit(d,state,act,esc);
  assert.equal((html.match(/data-action="c9-circuit-write"/g)||[]).length,4,'existing first-task entry plus three distinct task entries');
  for(const id of sourceIds)assert.ok(html.includes('data-id="'+id+'"'));
 }
 const d=DIALOGUES.find(x=>x.p33),taskId=c9ConversationCircuit(d,state).current.writingTasks[1].id;
 const withHistory={...freshState(),sentenceEvents:[
  {id:'c9-60-a',taskId,correct:false,assisted:true,at:100},
  {id:'c9-60-b',taskId,correct:true,assisted:false,at:200}]};
 const actual=c9WorkshopSourceContinuation(taskId,{kind:'p33',dialogueId:d.id,taskId},withHistory);
 assert.equal(actual.attempts,2);
 assert.equal(actual.independent,1);
 assert.equal(c9ConversationCircuit(d,withHistory).current.writingTasks[1].attempts,2);
 assert.equal(c9ConversationCircuit(d,withHistory).current.writingTasks[1].independent,1);
 assert.equal(JSON.stringify(state),before,'source projection never writes new learner state');
});

test('C9-60 original P34 listening transfer verifies native audio writer IDs and correct source return',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const audio of P34_LISTENING){
  const dialogue=DIALOGUES.find(x=>x.p34?.id===audio.id);
  assert.ok(dialogue,'source audio has original dialogue');
  const task=SENTENCE_TASKS.find(x=>x.id==='p34:'+audio.id+':writing');
  assert.ok(task&&task.p34AudioId===audio.id,'P34 prompt uses existing sentence writer');
  const origin={kind:'p34',dialogueId:dialogue.id,taskId:task.id};
  const receipt=c9WorkshopSourceContinuation(task.id,origin,state);
  assert.equal(receipt.kind,'p34');
  assert.equal(receipt.count,1);
  assert.equal(receipt.nextTaskId,null);
  assert.equal(c9WorkshopSourceContinuation(task.id,{...origin,dialogueId:'forged'},state),null);
  const html=renderC9WorkshopSourceContinuation(task.id,origin,state,act,esc);
  assert.ok(html.includes('data-action="c9-workshop-return"'));
  assert.ok(!html.includes('data-action="c9-workshop-next-source"'));
 }
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const phrase of [
  "if(name==='c9-circuit-p34-write')","if(name==='c9-workshop-next-source')",
  "if(name==='c9-workshop-return')","if(name==='c9-workshop-listen')",
  "c9OpenMediaSource('dialogues',receipt.dialogueId)",
  "if(task.p33ScenarioId){sentenceSupport=true;render();}",
  "if(task.p33ScenarioId){sentenceSupport=true;render();}"
 ])assert.ok(app.includes(phrase),'native writer and genuine source authority: '+phrase);
 assert.equal(JSON.stringify(state),before);
});


test('C9-61 original dialogue question recovery uses every canonical question and immutable observed events',()=>{
 const pristine=freshState(),before=JSON.stringify(pristine);
 for(const dialogue of DIALOGUES){
  const model=c9DialogueQuestionRepair(dialogue,pristine);
  assert.equal(model.dialogueId,dialogue.id);
  assert.equal(model.questions.length,dialogue.questions.length);
  assert.equal(model.recommendedIndex,0,'unattempted original questions start with first');
  for(let i=0;i<dialogue.questions.length;i++){
   const q=model.questions[i];
   assert.equal(q.id,dialogue.questions[i].id);
   assert.equal(q.prompt,dialogue.questions[i].prompt);
   assert.equal(q.attempts,0);
   assert.equal(q.independent,0);
   assert.equal(q.status,'Unattempted');
  }
  const html=renderC9DialogueQuestionRepair(dialogue,pristine,0,
   (action,label,classes='',attrs='')=>'<button data-action="'+action+'" '+attrs+'>'+label+'</button>',esc);
  assert.ok(html.includes('id="c9-dialogue-question-repair"'));
  assert.ok(html.includes('data-action="c9-dialogue-repair-play"'));
  assert.equal(html.split('data-action="c9-dialogue-repair-select"').length-1,dialogue.questions.length+1);
  assert.ok(!html.includes('class="dialogue-pinyin"'),'the repair list cannot reveal P34 transcript');
 }
 const sample=DIALOGUES.find(d=>d.questions.length>=2);
 const state=freshState();
 state.dialogueEvents=[
  {id:'c9-repair-incorrect',dialogueId:sample.id,question:0,correct:false,assisted:false,at:1},
  {id:'c9-repair-assisted',dialogueId:sample.id,question:1,correct:true,assisted:true,at:2}
 ];
 let result=c9DialogueQuestionRepair(sample,state);
 assert.equal(result.questions[0].status,'Latest incorrect');
 assert.equal(result.questions[1].status,'Latest assisted');
 assert.equal(result.questions[1].independent,0);
 assert.equal(result.recommendedIndex,0,'incorrect needs priority over assisted');
 state.dialogueEvents.push({id:'c9-repair-independent',dialogueId:sample.id,question:0,correct:true,assisted:false,at:3});
 result=c9DialogueQuestionRepair(sample,state);
 assert.equal(result.questions[0].independent,1);
 assert.equal(result.recommendedIndex,1,'assisted answer requires independent practice');
 state.dialogueEvents.push({id:'c9-repair-later-miss',dialogueId:sample.id,question:0,correct:false,assisted:false,at:4});
 result=c9DialogueQuestionRepair(sample,state);
 assert.equal(result.questions[0].independent,1,'prior independent evidence cannot be erased');
 assert.equal(result.questions[0].status,'Latest incorrect');
 assert.equal(result.recommendedIndex,0,'most recent failed question surfaces again');
 state.dialogueEvents.push({id:'c9-repair-revealed',dialogueId:sample.id,question:0,correct:false,assisted:true,at:5});
 result=c9DialogueQuestionRepair(sample,state);
 assert.equal(result.questions[0].status,'Latest assisted · not correct','reference reveal preserves BOTH assistance and accuracy');
 assert.equal(result.questions[0].independent,1,'reference reveal never erases earlier independent evidence');
 assert.equal(result.questions[0].assisted,1);
 assert.equal(result.recommendedIndex,0);
 assert.equal(JSON.stringify(pristine),before,'read-only projection never alters learner records');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 for(const fragment of ["renderC9DialogueQuestionRepair(d,state,dialogueStep,action,esc)",
  "if(name==='c9-dialogue-repair-select')","model.questions.some(row=>row.index===index&&row.id===button.dataset.id)",
  "c9ConfirmLeaveNativeAnswer('dialogues')","dialogueStep=index;dialogueFeedback=null",
  "if(name==='c9-dialogue-repair-play')"])
  assert.ok(app.includes(fragment),'original guarded assessment handoff: '+fragment);
 assert.ok(!app.includes('addC9DialogueRepairEvent('),'no second native event writer');
});

test('V1 Home prioritizes saved optional placement over launching another lesson',()=>{
 const state=startPlacement(freshState()),before=JSON.stringify(state);
 assert.equal(learningHub(state).primary.kind,'resume');
 assert.equal(learningHub(state).primary.source,'placement');
 const html=renderC9Home(state,act,esc);
 const hero=html.slice(html.indexOf('<div class="c9-home-hero-actions">'),html.indexOf('<div class="c9-home-source-preview"'));
 assert.match(html,/CONTINUE SAVED WORK/);
 assert.match(html,/Resume Placement check/);
 assert.match(hero,/data-action="hub-primary"/);
 assert.match(hero,/Resume saved activity/);
 assert.match(hero,/Lesson 001 \(optional\)/);
 assert.ok(hero.indexOf('data-action="hub-primary"')<hero.indexOf('data-action="hub-lesson"'));
 assert.equal(JSON.stringify(state),before);
});
test('V1 Home keeps direct first lesson from an empty learner record',()=>{
 const html=renderC9Home(freshState(),act,esc);
 const hero=html.slice(html.indexOf('<div class="c9-home-hero-actions">'),html.indexOf('<div class="c9-home-source-preview"'));
 assert.match(hero,/data-action="hub-lesson"/);
 assert.match(hero,/Start lesson 001/);
 assert.doesNotMatch(hero,/data-action="hub-primary"/);
});
