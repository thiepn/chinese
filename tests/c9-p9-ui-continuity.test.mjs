import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
const act=(name,label,css='',attrs='')=>`<button data-action="${name}" class="${css}" ${attrs}>${label}</button>`;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
test('P9 Home keeps original due/course/plan authority and primary actions in compact dashboard',()=>{
 const html=renderC9Home(freshState(),act,esc);
 for(const key of ['c9-home-lead-grid','c9-home-hero-course','c9-home-plan','c9-home-metrics','c9-home-shortcuts','c9-home-roadmap','hub-primary','hub-task','hub-lesson'])assert.ok(html.includes(key),key);
 assert.ok(html.indexOf('c9-home-lead-grid')<html.indexOf('c9-home-metrics'));
 assert.match(html,/Original character course/);
 assert.doesNotMatch(html,/HSK 1 progress|12.day streak|92% accuracy/);
});
test('P9 Lesson introduces visual source-specific lesson without displacing original native sections',()=>{
 const lesson=DEMO_LESSONS[0];const native='<section id="c9-lesson-overview" class="c9-native-section" tabindex="-1" aria-label="Character"></section>';
 const html=renderC9LessonWorkspace({lesson,state:freshState(),nativeMarkup:native,act,esc});
 assert.ok(html.includes('c9-lesson-visual-entry'));
 assert.ok(html.includes('data-section="overview"'));
 assert.ok(html.includes('c9-lesson-stage-heading'));
 assert.ok(html.includes('c9-lesson-start-status'));
 assert.ok(html.includes('c9-lesson-side-head'));
});
test('P9 Character signature hero uses original Hanzi, first source sentence, original words and ungraded writing',()=>{
 const lesson=DEMO_LESSONS[0];const html=renderC9CharacterStudy({lesson,state:freshState(),act,esc});
 for(const name of ['c9-character-glyph','c9-character-quick-source','c9-character-quick-words','c9-writing-canvas','c9-character-tabs'])assert.ok(html.includes(name),name);
 assert.ok(html.includes(esc(lesson.hanzi)));
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.match(html,/not scored or saved|not an authoritative stroke-order demonstration/);
});
test('P9 native sidebar retains every original study destination and bounded lesson navigation styles',()=>{
 const shell=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 assert.ok(shell.includes('class="c9-sidebar-study-more"'));
 for(const route of ['skills','writing','advanced','pathway','plan'])assert.ok(shell.includes(`data-route="${route}"`),route);
 const css=readFileSync(new URL('../src/styles-c9-lesson.css',import.meta.url),'utf8');
 assert.match(css,/\.c9-lesson-left,\.c9-lesson-sections,\.c9-lesson-nav-button\{min-width:0;max-width:100%/);
});
