import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DIALOGUES} from '../src/dialogues.mjs';
import {c9DialogueTurnLabel,resolveC9DialogueTurnPlayback} from '../src/accessibility-c9.mjs';
import {renderC9TurnNavigator} from '../src/media-c9.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(n,label,cls='',attrs='')=>'<button data-action="'+esc(n)+'" '+attrs+'>'+label+'</button>';

test('all authored P75/P77 turns resolve individually without following unrelated focused index',()=>{
 const dialogs=DIALOGUES.filter(d=>d.p75||d.p77);
 assert.equal(dialogs.length,10);
 let checked=0;
 for(const d of dialogs){
  for(let index=0;index<d.lines.length;index++){
   const result=resolveC9DialogueTurnPlayback(d,{focused:0,requested:String(index),sourceId:d.id});
   assert.equal(result?.hanzi,d.lines[index].hanzi);
   assert.equal(result?.index,index);
   assert.equal(result?.speaker,d.lines[index].speaker);
   assert.equal(result?.label,'Turn '+(index+1)+' of '+d.lines.length+', speaker '+d.lines[index].speaker);
   assert.equal(result?.hanzi.includes('。')||result?.hanzi.includes('？')||result?.hanzi.includes('！'),true);
   checked++;
  }
  const navigator=renderC9TurnNavigator(d,3,act,esc);
  assert.match(navigator,/Play Turn 4 of 8, speaker/);
  assert.match(navigator,/slowly/);
 }
 assert.equal(checked,80);
});
test('malformed or stale source row requests cannot fall back to focused turn',()=>{
 const d=DIALOGUES.find(x=>x.p77);
 for(const requested of ['-1','999','1.2','0x1','01','NaN','',' 1',1,null]){
  assert.equal(resolveC9DialogueTurnPlayback(d,{focused:0,requested,sourceId:d.id}),null,String(requested));
 }
 assert.equal(resolveC9DialogueTurnPlayback(d,{focused:0,requested:'2',sourceId:'dialogue-01'}),null);
 assert.equal(resolveC9DialogueTurnPlayback(d,{focused:0,requested:'2'}),null);
 assert.equal(resolveC9DialogueTurnPlayback(d,{focused:7}).index,7,'navigator continues to use focused turn');
 assert.equal(resolveC9DialogueTurnPlayback(d,{focused:8}),null);
 assert.equal(resolveC9DialogueTurnPlayback(d,{focused:-1}),null);
 assert.equal(resolveC9DialogueTurnPlayback(null,{focused:0}),null);
});
test('guarded row audio controls carry source identity and index, never Hanzi text in HTML attributes',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.match(app,/data-turn-index="/);
 assert.match(app,/data-dialogue-id="/);
 assert.match(app,/resolveC9DialogueTurnPlayback\(d,/);
 assert.match(app,/syncC9DialogueTurnFocus\(d,selected.index,false\)/);
 assert.match(app,/selected.hanzi/);
 assert.doesNotMatch(app,/data-turn-index="\$\{index\}" data-text=/);
});
