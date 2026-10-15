import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P37_SCENES} from '../src/p37-scenarios.mjs';
import {P37_SCENES_A} from '../src/p37-scenes-a.mjs';
import {P37_SCENES_B} from '../src/p37-scenes-b.mjs';
import {P37_SCENES_C} from '../src/p37-scenes-c.mjs';
import {P37_SCENES_D} from '../src/p37-scenes-d.mjs';
import {P38_PASSAGES} from '../src/p38-readings.mjs';
import {P50_PASSAGES} from '../src/p50-readings.mjs';
import {P51_PASSAGES} from '../src/p51-readings.mjs';
import {p50Lesson} from '../src/p50-screen.mjs';
import {p51Lesson} from '../src/p51-screen.mjs';
import {freshState} from '../src/study.mjs';

const source=[...P37_SCENES_A,...P37_SCENES_B,...P37_SCENES_C,...P37_SCENES_D];
test('P37 retains all original four-part authored dialogue turns and stable IDs',()=>{
 assert.equal(P37_SCENES.length,30);
 for(let i=0;i<30;i++){
  const p=P37_SCENES[i];
  assert.equal(p.id,`p37-${String(i+1).padStart(2,'0')}`);
  assert.deepEqual(p.turns,source[i].turns);
  assert.ok(p.turns.every(t=>['A','B'].includes(t[0])&&t[1].length>1&&t[2].length>1&&t[3].length>1));
  for(const w of p.vocabulary){
   const expected=source[i].turns.filter(t=>t[1].includes(w.hanzi)).slice(0,2);
   assert.deepEqual(w.examples,expected.map(t=>({hanzi:t[1],pinyin:t[2],english:t[3]})));
  }
 }
});
test('P38 30 original source-bound reading texts and valid cloze indices',()=>{
 assert.equal(P38_PASSAGES.length,30);
 for(let i=0;i<30;i++){
  const p=P38_PASSAGES[i],raw=source[i];
  assert.equal(p.id,`p38-${String(i+1).padStart(2,'0')}`);
  assert.equal(p.originSceneId,`p37-${String(i+1).padStart(2,'0')}`);
  assert.ok(p.lines.every(l=>l.hanzi.length>1&&l.pinyin.length>1&&l.english.length>1));
  assert.deepEqual(p.lines.slice(3,11),raw.turns.map(t=>({hanzi:t[1],pinyin:t[2],english:t[3]})));
  assert.ok(p.cloze.line>=0 && p.lines[p.cloze.line].hanzi.includes(p.cloze.word));
  assert.equal(p.questions.length,3);
 }
});
test('Original P50/P51 listening stage renderers parse and render authored dialogue',()=>{
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;');
 const act=(name,label)=>`<button data-action="${name}">${label}</button>`;
 for(const [passages,render,step] of [[P50_PASSAGES,p50Lesson,'p50'],[P51_PASSAGES,p51Lesson,'p51']]){
  const html=render(passages[0],freshState(),act,esc,{stage:'listen'});
  assert.ok(html.includes(`${step}-pane`));
  assert.ok(html.includes('speaker’s evidence'));
  assert.ok(html.includes('data-action="'+step+'-play"'));
 }
});
test('Mobile Home primary buttons do not claim 160px of flex height',()=>{
 const css=readFileSync(new URL('../src/styles-c9-home.css',import.meta.url),'utf8');
 assert.match(css,/\.c9-home-hero-actions \.c9-button\{flex:0 0 auto;min-height:48px/);
 assert.doesNotMatch(css,/\.c9-home-hero-actions \.c9-button\{flex:1 1 160px/);
});
