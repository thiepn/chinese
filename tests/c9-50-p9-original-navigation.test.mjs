import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/study.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {WORDS} from '../src/lexicon.mjs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const act=(action,label,classes='',props='')=>'<button type="button" data-action="'+action+'" class="'+classes+'" '+props+'>'+label+'</button>';
const initial=DEMO_LESSONS[0];

test('C9-50 Home next-source actions target the exact original next lesson and character',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9Home(state,act,esc,{showPinyin:false,storageReady:true});
 assert.ok(html.includes('c9-home-first-fold'));
 assert.ok(html.includes('c9-home-source-actions'));
 assert.ok(html.includes('data-action="hub-lesson"'));
 assert.ok(html.includes('data-action="c9-character-open"'));
 assert.ok(html.includes('data-id="'+esc(initial.id)+'"'));
 assert.ok(html.includes(esc(initial.sentence.hanzi)));
 assert.ok(!html.includes('<small>'+esc(initial.sentence.pinyin)+'</small>'));
 assert.equal(JSON.stringify(state),before);
});

test('C9-50 Lesson source preview offers original indexed word handoff and native first-section jump',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9LessonWorkspace({lesson:initial,state,nativeMarkup:'',act,esc,showPinyin:false});
 assert.ok(html.includes('c9-lesson-preview-toolbar'));
 assert.ok(html.includes('Start teaching ↓'));
 assert.ok(html.includes('data-section="overview"'));
 assert.ok(html.includes('data-action="lookup-word"'));
 assert.ok(html.includes('data-word="'+esc(initial.words[0].hanzi)+'"'));
 assert.ok(html.includes('data-action="c9-character-reader"'));
 assert.ok(html.includes('data-id="'+esc(initial.id)+'"'));
 assert.ok(html.includes('data-action="c9-character-open"'));
 assert.ok(html.includes('Read-only preview'));
 assert.equal(JSON.stringify(state),before);
});

test('C9-50 every lesson word offered through native lookup exists in original word index',()=>{
 const indexed=new Set(WORDS.map(word=>word.hanzi));
 assert.equal(DEMO_LESSONS.length,428);
 for(const lesson of DEMO_LESSONS)
  for(const word of lesson.words)
   assert.ok(indexed.has(word.hanzi),lesson.id+' has unindexed source word '+word.hanzi);
});

test('C9-50 Character authentic words open native wordbook and Reader without implied grades',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const show=renderC9CharacterStudy({lesson:initial,state,act,esc,showTranslations:true,showPinyin:false});
 assert.ok(show.includes('c9-character-source-sample'));
 assert.ok(show.includes('data-action="lookup-word"'));
 assert.ok(show.includes('data-word="'+esc(initial.words[0].hanzi)+'"'));
 assert.ok(show.includes('data-action="c9-character-reader"'));
 assert.ok(show.includes('data-id="'+esc(initial.id)+'"'));
 assert.ok(show.includes('c9-writing-canvas'));
 assert.ok(show.includes('Stroke-order data</span><strong>Not installed'));
 const hidden=renderC9CharacterStudy({lesson:initial,state,act,esc,showTranslations:false,showPinyin:false});
 const section=hidden.split('class="c9-character-sample-words"')[1]?.split('class="c9-character-sample-links"')[0]||'';
 assert.ok(section.includes(esc(initial.words[0].hanzi)));
 assert.ok(!section.includes('<small>'+esc(initial.words[0].english)+'</small>'));
 assert.equal(JSON.stringify(state),before);
});
