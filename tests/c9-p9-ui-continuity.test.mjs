import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
const act=(name,label,classes='',attrs='')=>'<button data-action="'+name+'" class="'+classes+'" '+attrs+'>'+label+'</button>';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

test('P9 Home exposes authored next study and actual unit roadmap without claiming mastery',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9Home(state,act,esc);
 for(const key of ['c9-home-first-fold','c9-home-source-preview','c9-home-plan','c9-home-metrics','c9-home-roadmap','hub-primary','hub-task','hub-lesson'])assert.ok(html.includes(key),key);
 assert.ok(html.indexOf('c9-home-roadmap')<html.indexOf('c9-home-record'));
 assert.ok(html.indexOf('c9-home-record')<html.indexOf('c9-home-explore-more'));
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

test('P9 source translations are reversible without replacing the writing canvas',()=>{
 const html=renderC9CharacterStudy({lesson:DEMO_LESSONS[0],state:freshState(),act,esc,showTranslations:false});
 assert.ok(html.includes('data-translations="false"'));
 assert.ok(html.includes('class="c9-character-example-translation" hidden'));
 assert.ok(html.includes('class="c9-character-sample-english" hidden'));
 assert.ok(html.includes('id="c9-writing-canvas"'));
 const src=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const section=src.slice(src.indexOf("if(name==='c9-character-support')"),src.indexOf("if(name==='c9-character-jump')"));
 assert.ok(section.includes("page.dataset.translations=String(c9CharacterShowTranslations)"));
 assert.ok(section.includes("node.hidden=!c9CharacterShowTranslations"));
 assert.ok(section.includes("button.textContent=c9CharacterShowTranslations"));
 assert.ok(src.includes('.c9-character-tabs [data-action='));
 assert.ok(src.includes('.c9-lesson-sections [data-action='));
});

test('P9 Home links the next authored character and sentence directly to the original lesson',()=>{
 const html=renderC9Home(freshState(),act,esc);
 const first=DEMO_LESSONS[0];
 assert.ok(html.includes('data-action="c9-character-open"'));
 assert.ok(html.includes('data-action="c9-lesson-open"'));
 assert.ok(html.includes('data-id="'+esc(first.id)+'" data-section="context"'));
 assert.ok(html.includes(esc(first.sentence.hanzi)));
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes("c9LastLessonId=id;c9LessonSection=targetSection||'overview'"));
 assert.ok(app.includes("target.focus({preventScroll:true})"));
});

test('P9 Lesson starts with authored native teaching, optional source preview, and one primary start action',()=>{
 const lesson=DEMO_LESSONS[0];
 const originalSection='<section id="c9-lesson-overview" class="c9-native-section" tabindex="-1" aria-label="Character"></section>';
 const html=renderC9LessonWorkspace({lesson,state:freshState(),nativeMarkup:originalSection,act,esc});
 assert.ok(html.includes('class="c9-lesson-resources"'));
 assert.ok(html.includes('Preview and listen to the source'));
 assert.ok(html.includes('data-action="c9-lesson-jump" class="c9-button c9-button--primary" data-section="overview"'));
 assert.ok(html.indexOf('c9-lesson-resources')<html.indexOf('c9-lesson-layout'));
 assert.ok(html.indexOf('c9-lesson-layout')<html.indexOf('id="c9-lesson-overview"'));
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(html.includes('six source-owned sections'));
});
test('P9 Character puts a source-specific heading and real writing/reading actions above the native canvas',()=>{
 const lesson=DEMO_LESSONS[0];
 const html=renderC9CharacterStudy({lesson,state:freshState(),act,esc});
 assert.ok(html.includes('<h1><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span><span>'+esc(lesson.meaning)+'</span></h1>'));
 assert.ok(html.includes('class="c9-character-first-actions"'));
 assert.ok(html.includes('data-section="writing" aria-controls="c9-writing"'));
 assert.ok(html.includes('data-section="sentences" aria-controls="c9-sentences"'));
 assert.ok(html.indexOf('c9-character-first-actions')<html.indexOf('c9-character-source-sample'));
 assert.ok(html.includes('Stroke-order data</span><strong>Not installed'));
});

test('P9 mobile first-fold audio is optional and action targets are not CSS-driven fake progress',()=>{
 const html=renderC9Home(freshState(),act,esc);
 assert.ok(html.includes('class="c9-home-listening"'));
 assert.ok(html.includes('Listen and shadow the original sentence'));
 assert.ok(html.includes('c9-home-source-actions'));
 assert.ok(html.indexOf('c9-home-listening')<html.indexOf('c9-home-source-actions'));
 const css=readFileSync(new URL('../src/styles-c9-home.css',import.meta.url),'utf8');
 assert.ok(css.includes('flex:0 0 auto!important'));
 assert.ok(css.includes('.c9-home-listening>summary'));
});
