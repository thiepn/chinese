import test from 'node:test';
import assert from 'node:assert/strict';
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
