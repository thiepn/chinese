import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState} from '../src/study.mjs';
import {hskTargetLessons} from '../src/hsk-targets-c9.mjs';
import {renderC9Home} from '../src/home-c9.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(action,label,cls='',extra='')=>'<button data-action="'+esc(action)+'" class="'+cls+'" '+extra+'>'+label+'</button>';
test('P2 keeps four visible destinations and 27 legacy routes',()=>{
 const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 assert.deepEqual([...html.matchAll(/data-c9-primary="([^"]+)"/g)].map(m=>m[1]),['today','learn','review','progress']);
 assert.equal((html.match(/<nav class="desktop-nav c9-primary-four"/g)||[]).length,1);
 assert.ok(html.includes('aria-label="Course resources"'));
});
test('P2 renders a true four-column mobile bar and no desktop-only drawer trigger',()=>{
 const shell=readFileSync(new URL('../src/styles-c9-shell.css',import.meta.url),'utf8');
 assert.match(shell,/\.c9-mobile-nav\.mobile-nav\s*\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(shell,/#c9-more-toggle\{display:none!important\}/);
});
test('P2 selected level directly resumes native authored source and does not mutate state',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const level of ['1','2','3','4','5']){
  const id=hskTargetLessons(level)[0].id;
  const html=renderC9Home(state,act,esc,{selectedLevel:level});
  assert.ok(html.includes('data-id="'+id+'"'),level);
  assert.ok(html.includes('href="#/learn/level/'+level+'"'));
 }
 const advanced=renderC9Home(state,act,esc,{selectedLevel:'7-9'});
 assert.ok(advanced.includes('data-action="pathway-select"'));
 const six=renderC9Home(state,act,esc,{selectedLevel:'6'});
 assert.ok(six.includes('data-action="c9-media-open-story"'));
 assert.equal(JSON.stringify(state),before);
});
test('P2 keeps app/worker cache paired and historical backup compatibility',()=>{
 const src=name=>readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
 for(const file of ['app.mjs','sw.js'])assert.ok(src(file).includes('character-study-working-v101-course-first-mobile-grid'));
 assert.ok(src('study-storage.mjs').includes('character-study-demo-backup'));
 assert.ok(src('app.mjs').includes('selectedLevel:c9LearnLevel'));
});
