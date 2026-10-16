import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState,addLesson} from '../src/study.mjs';
import {renderC9Review} from '../src/review-practice-c9.mjs';
const act=(name,label,classes='',attrs='')=>'<button data-action="'+name+'" class="'+classes+'" '+attrs+'>'+label+'</button>';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

test('P9 Home exposes authored next study and actual unit roadmap without claiming mastery',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9Home(state,act,esc);
 for(const key of ['c9-home-first-fold','c9-home-source-preview','c9-home-plan','c9-home-metrics','c9-home-roadmap','hub-task','hub-lesson'])assert.ok(html.includes(key),key);
 assert.ok(html.indexOf('c9-home-roadmap')<html.indexOf('c9-home-explore-more'));
 assert.ok(html.includes('Start lesson 001'), 'Home must reveal its first lesson directly');
 assert.ok(html.includes('data-action="hub-lesson"'), 'Home must use original lesson authority');
 assert.ok(html.includes(esc(DEMO_LESSONS[0].sentence.hanzi)));
 assert.ok(html.includes('Introduced does not mean mastered'));
 assert.doesNotMatch(html,/HSK 1 progress|12.day streak|92% accuracy/);
 assert.equal(JSON.stringify(state),before);
});

test('P9 native sidebar keeps all five destinations in accessible nested navigation',()=>{
 const shell=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 assert.ok(shell.includes('<details class="c9-sidebar-study-more">'));
 assert.ok(shell.includes('<nav aria-label="Additional study pathways"'));
 for(const route of ['skills','writing','advanced','pathway','plan'])assert.ok(shell.includes('data-route="'+route+'"'),route);
 const sync=readFileSync(new URL('../src/shell-c9.mjs',import.meta.url),'utf8');
 assert.ok(sync.includes("pathways.open=true"));
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
