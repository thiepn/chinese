import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
import {WORDS,findWord} from '../src/lexicon.mjs';
import {tokenizeSentence} from '../src/stories.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {renderC9PersonalTextReader} from '../src/media-c9.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const act=(name,label,classes='',attrs='')=>
 '<button type="button" data-action="'+esc(name)+'" class="'+esc(classes)+'" '+attrs+'>'+label+'</button>';

test('P61–P63 source-owned handwriting renders real lessons with copy, tracing, recall and retry, without study writes',()=>{
 const state=freshState(),before=JSON.stringify(state);
 assert.equal(DEMO_LESSONS.length,428);
 for(const index of [0,137,300,427]){
  const lesson=DEMO_LESSONS[index];
  const html=renderC9CharacterStudy({lesson,state,act,esc,showPinyin:false,showTranslations:false});
  for(const control of ['data-writing-mode="copy"','data-writing-mode="trace"',
   'data-writing-mode="recall"','id="c9-writing-reference-toggle"',
   'id="c9-writing-keep"','id="c9-writing-compare"',
   'id="c9-writing-previous-canvas"'])
   assert.ok(html.includes(control),lesson.id+' missing '+control);
  assert.ok(html.includes(esc(lesson.hanzi)));
  assert.ok(html.includes(esc(lesson.meaning)));
  assert.ok(html.includes('Pinyin hidden in settings'));
  assert.ok(html.includes('No verified stroke sequence, stroke count'));
  assert.ok(html.includes('do not create grades, study events'));
 }
 assert.equal(JSON.stringify(state),before);
});

test('P61–P63 original writing controller only holds session ink and cleans up all listeners',()=>{
 const src=readFileSync(new URL('../src/character-c9.mjs',import.meta.url),'utf8');
 assert.ok(src.includes("const keepAction=()=>"));
 assert.ok(src.includes("previous=strokes.map(points=>points.map"));
 assert.ok(src.includes("traceVisible=selected==='trace'"));
 assert.ok(src.includes("referenceVisible=false"));
 assert.ok(src.includes("if(guide)guide.hidden=mode==='recall'&&!referenceVisible"));
 assert.ok(src.includes("target.removeEventListener(type,fn)"));
 for(const forbidden of ['indexedDB','gradeCard(','localStorage','navigator.sendBeacon','fetch('])
  assert.ok(!src.includes(forbidden),'Writing controller must not use '+forbidden);
});

test('P69 personal reader reveals only canonical glossary lookups; no new word IDs',()=>{
 assert.ok(WORDS.length>0);
 const word=WORDS.find(w=>w.hanzi.length>=2&&w.hanzi.length<8);
 assert.ok(word);
 assert.equal(findWord(word.key),word);
 const annotated=tokenizeSentence(word.hanzi);
 assert.ok(annotated.some(token=>token.text===word.hanzi&&token.entry?.wordKey===word.key));
 const html=renderC9PersonalTextReader(esc);
 for(const key of ['c9-personal-input','c9-personal-analyze','c9-personal-clear','c9-personal-results'])
  assert.ok(html.includes(key),key);
 assert.ok(html.includes('Nothing is sent to the server or saved to the learning database unless'));
});

test('P69 temporary personal text is never sent into approved stories, scoring or learner storage',()=>{
 const src=readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8');
 const section=src.slice(src.indexOf('/* P69 original-roadmap personal reading:'));
 assert.ok(section.includes('tokenizeSentence(line)'));
 assert.ok(section.includes('wordsForWrittenForm(token.text)'));
 assert.ok(section.includes("data-action=\"lookup-word\""));
 assert.ok(section.includes("personalReaderMined"));
 assert.ok(section.includes("navigator.clipboard?.writeText"));
 for(const forbidden of ['indexedDB','localStorage','fetch(','gradeCard(','addWordPracticeEvent('])
  assert.ok(!section.includes(forbidden),'Private reader must not use '+forbidden);
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes('renderC9PersonalTextReader(esc,state)'));
 assert.ok(app.includes('connectC9PersonalTextReader(root,esc,state)'));
 assert.ok(app.includes('disconnectC9PersonalTextReader()'));
});

test('New original learning surfaces retain paired offline revision and source assets',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.match(app,/character-study-working-v67-p64-p68-source-context-trails/);
 assert.match(sw,/character-study-working-v67-p64-p68-source-context-trails/);
 assert.ok(sw.includes("'./character-c9.mjs'"));
 assert.ok(sw.includes("'./media-c9.mjs'"));
});
