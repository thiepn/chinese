import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const act=(name,label,classes='',attrs='')=>'<button type="button" data-action="'+name+'" class="'+classes+'" '+attrs+'>'+label+'</button>';
const state=freshState();
const snapshot=JSON.stringify(state);

test('C9-47 Home first fold uses original sentence and actual course progress',()=>{
 const html=renderC9Home(state,act,esc,{storageReady:true,offline:false,offlineShell:'ready'});
 const example=DEMO_LESSONS[0].sentence;
 assert.ok(html.includes('c9-home-first-fold'));
 assert.ok(html.includes('c9-home-source-preview'));
 assert.ok(html.includes(esc(example.hanzi)));
 assert.ok(html.includes(esc(example.english)));
 const hidden=renderC9Home(state,act,esc,{storageReady:true,offline:false,offlineShell:'ready',showPinyin:false});
 assert.ok(hidden.includes(esc(example.hanzi)));
 assert.ok(!hidden.includes('<small>'+esc(example.pinyin)+'</small>'));
 assert.ok(html.includes('0 / '+DEMO_LESSONS.length));
 assert.ok(!html.includes('HSK 1 progress'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('C9-47 Lesson previews source-owned word and sentence, with native section actions',()=>{
 const lesson=DEMO_LESSONS[0];
 const html=renderC9LessonWorkspace({lesson,state,nativeMarkup:'',act,esc,showPinyin:false});
 assert.ok(html.includes('c9-lesson-source-preview'));
 assert.ok(html.includes(esc(lesson.words[0].hanzi)));
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(html.includes(esc(lesson.sentence.english)));
 assert.ok(html.includes('data-section="vocabulary"'));
 assert.ok(html.includes('data-section="context"'));
 assert.ok(html.includes('Pinyin hidden'));
 assert.ok(html.includes('Read-only preview'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('C9-47 Character keeps original examples, accessible jumps, and truthful stroke limits',()=>{
 const lesson=DEMO_LESSONS[0];
 const html=renderC9CharacterStudy({lesson,state,act,esc,showTranslations:false,showPinyin:false});
 assert.ok(html.includes('c9-character-source-sample'));
 assert.ok(html.includes('c9-character-sample-hanzi'));
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(!html.includes('c9-character-sample-english'));
 assert.ok(html.includes('data-section="writing"'));
 assert.ok(html.includes('data-section="sentences"'));
 assert.ok(html.includes('Stroke-order data</span><strong>Not installed'));
 assert.ok(html.indexOf('class="c9-character-tabs"')<html.indexOf('class="c9-character-evidence"'));
 assert.equal(JSON.stringify(state),snapshot);
});
