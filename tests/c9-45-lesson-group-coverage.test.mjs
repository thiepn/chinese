import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {lessonGroups} from '../src/study-groups.mjs';
import {courseUnitMilestones} from '../src/course-journey.mjs';
import {freshState} from '../src/study.mjs';

// Regression: C9-44 exposed 428 originals, but unit-based Learn and milestones
// quietly stopped at 202. Every original must have exactly one discoverable unit.
test('all 428 source-qualified lessons appear in exactly one stable Learn unit',()=>{
 const groups=lessonGroups();
 assert.equal(DEMO_LESSONS.length,428);
 assert.deepEqual(groups.slice(0,6).map(g=>g.range),[[1,13],[14,26],[27,40],[41,52],[53,64],[65,74]]);
 assert.equal(groups[19].range[1],202);
 assert.ok(groups.length>20);
 const flattened=groups.flatMap(group=>group.lessons.map(lesson=>lesson.id));
 assert.equal(flattened.length,428);
 assert.equal(new Set(flattened).size,428);
 assert.deepEqual(flattened,DEMO_LESSONS.map(lesson=>lesson.id));
 for(const [i,group] of groups.entries()){
  assert.equal(group.index,i+1);
  assert.ok(group.lessons.length>0&&group.lessons.length<=(i<20?14:12));
  assert.deepEqual(group.lessons.map(lesson=>lesson.order),
   Array.from({length:group.range[1]-group.range[0]+1},(_,j)=>group.range[0]+j));
 }
});

test('original course milestones expose all units without fabricating completion',()=>{
 const state=freshState(),before=structuredClone(state);
 const milestones=courseUnitMilestones(state);
 assert.equal(milestones.reduce((n,m)=>n+m.total,0),DEMO_LESSONS.length);
 assert.equal(milestones.length,lessonGroups().length);
 assert.ok(milestones.every(m=>m.introduced===0&&m.completed===0&&!m.achieved));
 assert.deepEqual(state,before);
});
