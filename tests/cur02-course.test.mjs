import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {CUR02_LEVELS,chineseCourseCatalog,chineseCourseHash,parseChineseCourseSelection} from '../src/cur02-course.mjs';
import {renderChineseCourseLevels} from '../src/cur02-course-view.mjs';
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const action=(name,label,_className,attrs='')=>'<button data-action="'+name+'" '+attrs+'>'+label+'</button>';
test('all six CEFR categories exist; non-attested HSK/demo content is not silently labeled A1',()=>{
 const model=chineseCourseCatalog();
 assert.deepEqual(model.levels.map(x=>x.level),[...CUR02_LEVELS]);
 assert.ok(model.levels.every(x=>x.availability==='planned'&&x.lessons.length===0));
 assert.equal(model.unmapped.length,DEMO_LESSONS.length);
 assert.deepEqual(model.unmapped.map(x=>x.id),DEMO_LESSONS.map(x=>x.id));
});
test('native original lesson identities and review state are not touched by read-only presentation',()=>{
 const state={learned:[DEMO_LESSONS[0].id],courseJourney:{lessonId:DEMO_LESSONS[1].id}};
 const original=JSON.stringify(state);
 const markup=renderChineseCourseLevels(state,action,escape,'#/learn/level/unmapped');
 assert.match(markup,/Six-level Chinese course/);assert.match(markup,/Resume saved course lesson/);
 assert.match(markup,new RegExp('data-id="'+DEMO_LESSONS[1].id+'"'));
 assert.equal(JSON.stringify(state),original);
});
test('direct level entry, pagination and unsafe route rejection',()=>{
 assert.deepEqual(parseChineseCourseSelection('#/learn/level/C2'),{level:'C2',page:1});
 assert.deepEqual(parseChineseCourseSelection(chineseCourseHash('unmapped',2)),{level:'unmapped',page:2});
 assert.equal(parseChineseCourseSelection('#/learn/level/HSK1'),null);
 assert.equal(parseChineseCourseSelection('#/learn/level/A1/-1'),null);
 assert.throws(()=>chineseCourseHash('HSK1'));
});
test('a claimed CEFR match must be independently reviewed and source-identical',()=>{
 const id=DEMO_LESSONS[0].id;
 assert.throws(()=>chineseCourseCatalog(DEMO_LESSONS,new Map([[id,{level:'A1',sourceId:id,sourceStatus:'machine-guessed'}]])),/CUR02_UNVERIFIED_LEVEL/);
 assert.throws(()=>chineseCourseCatalog(DEMO_LESSONS,new Map([[id,{level:'A1',sourceId:'wrong',sourceStatus:'independently-reviewed-cefr'}]])),/CUR02_UNVERIFIED_LEVEL/);
 const mapped=chineseCourseCatalog(DEMO_LESSONS,new Map([[id,{level:'A1',sourceId:id,sourceStatus:'independently-reviewed-cefr'}]]));
 assert.equal(mapped.levels[0].lessons[0].id,id);assert.equal(mapped.unmapped.length,DEMO_LESSONS.length-1);
});
test('planned level displays a real, accessible escape to unmapped original material',()=>{
 const html=renderChineseCourseLevels({learned:[]},action,escape,'#/learn/level/B2');
 assert.match(html,/No original lessons have an independently verified B2 CEFR mapping/);
 assert.match(html,/Original lessons/);assert.doesNotMatch(html,/data-action="c9-lesson-open"/);
});
