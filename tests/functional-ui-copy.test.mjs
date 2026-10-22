import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LearnHub} from '../src/learn-hub-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {freshState} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';

const read=(path)=>readFileSync(new URL(path,import.meta.url),'utf8');
const esc=(v)=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const act=(name,label,classes='',attrs='')=>'<button type="button" data-action="'+name+'" class="'+classes+'" '+attrs+'>'+label+'</button>';

test('Home labels communicate real learning rather than motivational filler',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9Home(state,act,esc);
 assert.match(html,/<h1>Today<\/h1>/);
 assert.match(html,/No lessons introduced/);
 assert.doesNotMatch(html,/A quiet place to begin Chinese|Continue learning, one step at a time|LEARN BEYOND FLASHCARDS|THIEPN CHINESE · TODAY/);
 assert.match(html,/Introduced does not mean mastered/);
 assert.match(html,/not an official HSK syllabus/);
 assert.match(html,/data-action="hub-lesson"/);
 assert.match(html,/c9-home-roadmap/);
 assert.match(html,/c9-home-source-preview/);
 assert.equal(JSON.stringify(state),before);
});
test('Learn remains navigable with actual unit, source and progress evidence',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9LearnHub(state,{view:'home',query:'',status:'all',kind:'all',unit:'all',page:0},act,esc);
 assert.match(html,/<h1>Learn Chinese<\/h1>/);
 assert.match(html,/<h2 id="c9-units-title">Units<\/h2>/);
 assert.match(html,/id="c9-learn-query"/);
 assert.match(html,/id="c9-learn-status"/);
 assert.match(html,/Introduction is not a mastery grade/);
 assert.match(html,/not mastery or official HSK levels/);
 assert.match(html,/data-action="c9-lesson-open"/);
 assert.doesNotMatch(html,/LEARNING AREAS|LESSON DISCOVERY|Open any lesson|follow the numbered course/);
 assert.equal(JSON.stringify(state),before);
});
test('Lesson keeps authored material, independent introduction and direct section controls',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9LessonWorkspace({lesson:DEMO_LESSONS[0],state,nativeMarkup:'',act,esc});
 assert.match(html,/c9-lesson-source-preview/);
 assert.match(html,/Read-only preview/);
 assert.match(html,/data-action="c9-lesson-jump"/);
 assert.match(html,/Teaching steps, not completion|teaching steps, not completion/i);
 assert.match(html,/Lesson introduction remains an explicit action/);
 assert.doesNotMatch(html,/BEFORE YOU BEGIN · ORIGINAL CONTENT|FOLLOW THE LESSON IN ORDER|YOUR ACTUAL LEARNING RECORD/);
 assert.equal(JSON.stringify(state),before);
});
test('Existing Home, Learn and Lesson CSS makes important labels readable',()=>{
 const css=[read('../src/styles-c9-home.css'),read('../src/styles-c9-learn.css'),read('../src/styles-c9-lesson.css')];
 for(const s of css)assert.match(s,/font-size:14px/);
 for(const [pattern,index] of [
  [/\.c9-home-stat>small\s*\{[^}]*font-size:14px/,0],
  [/\.c9-home-progress-note\s*\{[^}]*font-size:14px/,0],
  [/\.c9-discovery-search-label\s*\{[^}]*font-size:14px/,1],
  [/\.c9-lesson-copy>span\s*\{[^}]*font-size:14px/,1],
  [/\.c9-lesson-nav-copy small\s*\{[^}]*font-size:14px/,2],
  [/\.c9-lesson-evidence span\s*\{[^}]*font-size:14px/,2],
 ])assert.match(css[index],pattern);
});
