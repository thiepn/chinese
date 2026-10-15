import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPathwayScreen} from '../src/pathway-screen.mjs';
import {freshState} from '../src/study.mjs';
import {readFileSync} from 'node:fs';

import {PATHWAY_MISSIONS,PATHWAY_BANDS,PATHWAY_MODES,pathwayIndependentTransfer,pathwayQuestion} from '../src/pathway-course.mjs';

test('every original mission offers a distinct ungraded independent changed-context transfer',()=>{
 assert.equal(PATHWAY_BANDS.length,9);
 assert.equal(PATHWAY_MISSIONS.length,36);
 const contexts=new Set();
 for(const mission of PATHWAY_MISSIONS){
  const t=pathwayIndependentTransfer(mission);
  assert.equal(t.missionId,mission.id);
  assert.equal(t.authority,'optional-self-review-only');
  assert.equal(t.graded,false);
  assert.equal(t.witness,mission.lines[0]);
  assert.equal(t.contrast,mission.lines[1]);
  assert.ok(t.context.length>90&&t.task.length>65);
  assert.equal(t.selfCheck.length,3);
  assert.ok(!contexts.has(t.context));
  contexts.add(t.context);
  for(const mode of PATHWAY_MODES)assert.equal(pathwayQuestion(mission.id,mode).task.pathwayId,mission.id);
 }
 assert.equal(contexts.size,36);
 assert.equal(pathwayIndependentTransfer({id:'unknown'}),null);
});

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const act=(name,label,cls='',props='')=>'<button type="button" data-action="'+name+'" class="'+cls+'" '+props+'>'+label+'</button>';

test('C9-49 all 36 canonical P29 missions expose source-linked private Mandarin transfer without grades',()=>{
 const learner=freshState(),original=JSON.stringify(learner);
 for(const m of PATHWAY_MISSIONS){
  const html=renderPathwayScreen({id:m.id,band:m.band,minutes:20,mode:'meaning',focus:true,
   feedback:{correct:true,assisted:false,message:'Original check complete'},
   assisted:false,typed:'',transferDraft:'我的回答',showPinyin:false,showEnglish:false,
   learner},act,esc,()=>' ',()=>'');
  for(const required of ['class="p29-transfer"','id="p29-transfer-draft"',
   'private response','pathway-transfer-clear','p29-transfer-selfcheck',
   'p29-transfer-witness','aria-label="'])assert.ok(html.includes(required),m.id+': '+required);
  assert.ok(html.includes('我的回答'));
  assert.ok(html.includes('data-text="'+esc(m.lines[0].hanzi)+'"'),m.id);
  assert.ok(html.includes('data-rate="slow"'));
  assert.ok(html.includes('not a model answer for the new situation'));
  assert.ok(!html.includes('data-action="pathway-transfer-grade"'));
  assert.ok(!html.includes('data-action="pathway-transfer-submit"'));
  assert.equal((html.match(/type="checkbox"/g)||[]).length,3);
 }
 assert.equal(JSON.stringify(learner),original);
});

test('C9-49 original pathway controller protects ungraded unsent text without persistent writers',()=>{
 const source=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const disclosure=readFileSync(new URL('../src/accessibility-c9.mjs',import.meta.url),'utf8');
 assert.ok(source.includes("screen==='pathway'&&String(pathwayTransferDraft||'').trim()"));
 assert.ok(source.includes("if(e.target.id==='p29-transfer-draft'){pathwayTransferDraft=e.target.value;return;}"));
 assert.ok(source.includes("if(name==='pathway-transfer-clear')"));
 assert.ok(source.includes("if(previous==='pathway')pathwayTransferDraft=''"));
 assert.ok(source.includes("function pathwayReset(){pathwayMode='meaning'"));
 assert.ok(disclosure.includes("'p29-transfer'"));
 assert.ok(disclosure.includes("'p29-transfer-witness'"));
 const start=source.indexOf("if(name==='pathway-transfer-clear')");
 const end=source.indexOf("if(name==='pathway-workshop')",start);
 assert.ok(start>0&&end>start);
 assert.ok(!/mutate\(|gradeCard\(|addSentenceEvent\(|localStorage|sessionStorage|indexedDB/.test(source.slice(start,end)));
});
