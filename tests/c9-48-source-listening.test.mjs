import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
import {renderC9ListeningDeck} from '../src/ui-c9.mjs';
import {renderC9Home} from '../src/home-c9.mjs';
import {renderC9LessonWorkspace} from '../src/lesson-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const act=(name,label,cls='',props='')=>'<button data-action="'+name+'" class="'+cls+'" '+props+'>'+label+'</button>';
const first=DEMO_LESSONS[0];

test('C9-48 listening projection preserves actual Hanzi and never fabricates playback or grades',()=>{
 const clips=[{label:'Source example',hanzi:first.sentence.hanzi,pinyin:first.sentence.pinyin,english:first.sentence.english}];
 const html=renderC9ListeningDeck(clips,act,esc,{showPinyin:false,showTranslations:false});
 assert.ok(html.includes('Mandarin listening practice'));
 assert.ok(html.includes('data-text="'+esc(first.sentence.hanzi)+'"'));
 assert.ok(!html.includes(first.sentence.pinyin));
 assert.ok(!html.includes(first.sentence.english));
 assert.ok(html.includes('data-rate="slow"'));
 assert.ok(html.includes('data-action="speech-stop"'));
 assert.ok(html.includes('not a verified recording or pronunciation assessment'));
 assert.equal(renderC9ListeningDeck([{label:'missing',hanzi:''}],act,esc),'');
});

test('C9-48 Home displays real next-lesson listening and no false review credit',()=>{
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9Home(state,act,esc,{showPinyin:false});
 assert.ok(html.includes('c9-home-first-fold'));
 assert.ok(html.includes('c9-home-source-preview'));
 assert.ok(html.includes('data-text="'+esc(first.sentence.hanzi)+'"'));
 assert.ok(!html.includes('<small>'+first.sentence.pinyin+'</small>'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('C9-48 Lesson makes original character-word-sentence audible using ONE native speak action',()=>{
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9LessonWorkspace({lesson:first,state,nativeMarkup:'',act,esc,showPinyin:false});
 assert.equal((html.match(/class="c9-listening-clip"/g)||[]).length,3);
 for(const hanzi of [first.hanzi,first.words[0].hanzi,first.sentence.hanzi])
  assert.ok(html.includes('data-text="'+esc(hanzi)+'"'),hanzi);
 assert.ok(html.includes('Read-only preview'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('C9-48 Character keeps original study, private writing and device speech separate',()=>{
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9CharacterStudy({lesson:first,state,act,esc,showPinyin:false});
 assert.ok(html.includes('c9-character-source-sample'));
 assert.ok(html.includes('c9-listening-deck--compact'));
 assert.ok(html.includes('data-text="'+esc(first.words[0].hanzi)+'"'));
 assert.ok(html.includes('data-text="'+esc(first.sentence.hanzi)+'"'));
 assert.ok(html.includes('c9-writing-canvas'));
 assert.ok(html.includes('id="c9-writing-trace-glyph"'));
 assert.ok(html.includes('id="c9-writing-trace-toggle"'));
 assert.ok(html.includes('aria-pressed="false"'));
 assert.ok(html.includes('no stroke sequence or direction'));
 assert.ok(html.includes('Stroke-order data</span><strong>Not installed'));
 assert.equal(JSON.stringify(state),snapshot);
});

test('C9-48 speech lifecycle cancels obsolete source requests and preserves original storage and grading',()=>{
 const src=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(src.includes('c9AwaitMandarinVoice'));
 assert.ok(src.includes("synthesis.addEventListener('voiceschanged'"));
 assert.ok(src.includes('if(request!==c9SpeechGeneration)return'));
 assert.ok(src.includes("if(name==='speech-stop')"));
 assert.ok(src.includes('if(destination!==previous||sameScreenSourceChanged||pathwayMissionExit){stopC9Speech()'));
 assert.ok(src.includes("button.dataset.rate==='slow'?0.68:demoSpeechRate"));
 assert.ok(!src.includes('webkitSpeechRecognition'));
});

test('C9-48 reversible printed-glyph tracing never saves, sequences or grades strokes',()=>{
 const src=readFileSync(new URL('../src/character-c9.mjs',import.meta.url),'utf8');
 assert.ok(src.includes("traceToggle?.addEventListener('click',toggleTrace)"));
 assert.ok(src.includes("traceToggle?.removeEventListener('click',toggleTrace)"));
 assert.ok(src.includes("traceToggle?.setAttribute('aria-pressed',String(traceVisible))"));
 assert.ok(src.includes("trace.hidden=!traceVisible"));
 assert.ok(src.includes("Nothing is graded or saved."));
 assert.ok(src.includes('No lines'));
});
