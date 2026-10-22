import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {hskTargetLessons,hskTargetPractice,HSK_TARGETS} from '../src/hsk-targets-c9.mjs';
import {freshState,validateState} from '../src/study.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {buildP1CourseCatalog,buildP1CoverageMatrix,buildP1Inventory,
 P1_AUTHORITIES,P1_ROUTE_MIGRATION,P1_SOURCE_FAMILIES} from '../src/course-catalog-p1.mjs';

test('P1 route migration has an exact destination for every existing stable route',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const routes=app.match(/const stableRoutes=new Set\(\[([^\]]+)\]\)/)?.[1];
 assert.ok(routes,'Find canonical existing stableRoutes declaration');
 const original=[...routes.matchAll(/'([^']+)'/g)].map(m=>m[1]);
 const mapped=P1_ROUTE_MIGRATION.map(row=>row.route);
 assert.deepEqual(new Set(mapped),new Set(original));
 assert.equal(mapped.length,original.length,'No duplicate routes');
 assert.ok(P1_ROUTE_MIGRATION.every(row=>['home','course','review','me'].includes(row.destination)));
 assert.ok(P1_ROUTE_MIGRATION.every(row=>row.legacyHash==='#/'+row.route));
});

test('P1 catalog is a complete, unique hierarchy referencing original lesson IDs',()=>{
 const catalog=buildP1CourseCatalog();
 assert.deepEqual(catalog.map(l=>l.targetId),HSK_TARGETS.map(t=>t.id));
 const seen=new Set();
 for(const level of catalog){
  const expected=hskTargetLessons(level.targetId).map(l=>l.id).sort();
  const actual=level.units.flatMap(u=>u.lessons.map(l=>l.sourceId)).sort();
  assert.deepEqual(actual,expected);
  for(const lesson of level.units.flatMap(u=>u.lessons)){
   assert.equal(lesson.officialHskMembership,'NOT_VERIFIED');
   assert.equal(lesson.nativeLessonAction,'c9-lesson-open');
   assert.ok(DEMO_LESSONS.some(l=>l.id===lesson.sourceId));
   assert.ok(!seen.has(lesson.sourceId));seen.add(lesson.sourceId);
  }
  const source=hskTargetPractice(level.targetId);
  for(const [kind,expectedKey] of [['grammar','grammar'],['reading','readings'],['dialogue','dialogues'],['mission','missions']]){
   const shelf=level.sourceShelves.find(s=>s.kind===kind);
   assert.deepEqual(shelf.items.map(x=>x.id),source[expectedKey].map(x=>x.id));
  }
 }
 assert.equal(seen.size,DEMO_LESSONS.length,'No existing original character lesson lost');
 assert.equal(catalog[5].units.length,0,'Do not invent HSK 6 character lessons');
 assert.equal(catalog[6].units.length,0,'Do not invent HSK 7–9 units');
 assert.equal(catalog[6].unsequencedSources,true);
});

test('P1 coverage is reproducible source-only data and never official membership',()=>{
 const inventory=buildP1Inventory();
 const m=inventory.coverage;
 assert.equal(m.length,7);
 assert.deepEqual(m.map(x=>x.officialCumulativeVocabularyBenchmark),[300,500,1000,2000,3600,5400,11000]);
 for(const row of m){
  assert.equal(row.officialVocabularyMapping,'NOT_VERIFIED');
  assert.equal(row.officialCharacterMapping,'NOT_VERIFIED');
  assert.equal(row.officialGrammarMapping,'NOT_VERIFIED');
  assert.equal(row.officialTaskSkillMapping,'NOT_VERIFIED');
  assert.equal(row.contentRights,'ORIGINAL_DEMO_EDITORIAL_REVIEW_REQUIRED');
  assert.equal(row.fullCourseClaim,false);
  assert.ok(row.originalIndexedWordKeysFromLessons<=row.originalWordbookKeysLinkedToTarget+row.originalCharacterLessons*20,
   'Separate original word indices from official vocabulary benchmarks');
 }
 assert.deepEqual(m,buildP1CoverageMatrix(buildP1CourseCatalog()));
 assert.ok(P1_AUTHORITIES.some(x=>x.system==='backupRestore'));
 assert.ok(P1_SOURCE_FAMILIES.some(x=>x.family==='advanced-dialogues'));
});

test('P1 catalog and inventory do not mutate original learner state or backup identity',()=>{
 const original=freshState(),before=JSON.stringify(original);
 validateState(original);
 const legacy=backupDocument(original);
 const inventory=buildP1Inventory();
 assert.equal(JSON.stringify(original),before);
 assert.equal(legacy.format,'character-study-demo-backup');
 assert.equal(legacy.formatVersion,1);
 assert.deepEqual(importBackup(legacy),original);
 assert.ok(Object.isFrozen(inventory.course[0].units));
 assert.ok(!JSON.stringify(inventory).includes('"revision"'));
});
