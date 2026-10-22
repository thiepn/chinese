import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {freshState} from '../src/study.mjs';
import {renderC9LearnHub,renderC9LessonBrowser} from '../src/learn-hub-c9.mjs';
import {HSK_TARGETS,hskTargetGroup,hskTargetLessons,hskTargetReadings,hskTargetMissions,renderC9HSKTargets} from '../src/hsk-targets-c9.mjs';
import {lessonGroups} from '../src/study-groups.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(action,label,cls='',extra='')=>'<button data-action="'+esc(action)+'" class="'+cls+'" '+extra+'>'+label+'</button>';
const ui=(level='all')=>({query:'',unit:'all',level,status:'all',kind:'all',saved:false,page:0,view:'catalog'});
test('HSK 1–5 are separate authored difficulty targets, not invented official HSK membership',()=>{
 assert.deepEqual(HSK_TARGETS.map(t=>t.id),['1','2','3','4','5','6','7-9']);
 assert.ok(HSK_TARGETS.every(t=>t.officialMapping===false));
 const groups=lessonGroups();
 const seen=new Set();
 for(const target of HSK_TARGETS.slice(0,5)){
  const lessons=hskTargetLessons(target.id);
  assert.ok(lessons.length>0,'No original source available for '+target.name);
  assert.ok(lessons.every(l=>DEMO_LESSONS.includes(l)&&l.officialHskLevel===null));
  for(const l of lessons){assert.ok(!seen.has(l.id),'Duplicated level entry '+l.id);seen.add(l.id);}
 }
 assert.equal(seen.size,DEMO_LESSONS.length,'Each existing original character lesson belongs to exactly one provisional study group');
 assert.equal(hskTargetLessons('6').length,0,'Do not mislabel earlier characters as official HSK 6');
 assert.equal(hskTargetLessons('7-9').length,0);
 for(const g of groups)assert.ok(['1','2','3','4','5'].includes(hskTargetGroup(g)));
});
test('HSK 6 and HSK 7–9 link to actual original advanced sources without inventing course membership',()=>{
 const reads=hskTargetReadings('6'),missions=hskTargetMissions('7-9');
 assert.equal(reads.length,5);
 assert.ok(reads.every(s=>s.beginner?.source==='original-p71'&&s.approval==='DEMO_ONLY'&&s.officialHskLevel===null));
 assert.ok(hskTargetMissions('6').every(m=>m.band===6));
 assert.ok(missions.length>0);
 assert.ok(missions.every(m=>m.band>=7&&m.officialHskLevel===null));
 assert.deepEqual(hskTargetReadings('5'),[]);
 assert.deepEqual(hskTargetMissions('5'),[]);
});
test('Learn presents direct HSK target choices before sequential suggestions and exposes native no-gate actions',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const html=renderC9LearnHub(state,ui(),act,esc);
 assert.ok(html.indexOf('Choose your HSK target')<html.indexOf('YOUR NEXT LESSON'));
 assert.equal((html.match(/data-action="c9-hsk-select"/g)||[]).length,7);
 for(const level of HSK_TARGETS)assert.ok(html.includes('data-level="'+level.id+'" aria-pressed="false"'));
 const l5=hskTargetLessons('5')[0],selected=renderC9LearnHub(state,ui('5'),act,esc);
 assert.match(selected,/HSK 5 practice/);
 assert.match(selected,/aria-pressed="true"/);
 assert.ok(selected.includes('data-id="'+l5.id+'"'),'Chosen target must open original lesson by canonical ID');
 assert.ok(!selected.includes('YOUR NEXT LESSON'),'Do not force beginner-first featured lesson after choosing HSK5');
 assert.ok(selected.includes('Browse all'));
 assert.equal(JSON.stringify(state),before,'Choosing levels must not mutate learner state');
});
test('HSK-level browser filters the actual lesson collection and preserves original introduction evidence',()=>{
 const state=freshState(),l1=hskTargetLessons('1')[0],l4=hskTargetLessons('4')[0];
 const selected4=renderC9LessonBrowser(state,ui('4'),act,esc);
 const selected1=renderC9LessonBrowser(state,ui('1'),act,esc);
 assert.ok(selected4.includes('data-id="'+l4.id+'"'));
 assert.ok(!selected4.includes('data-id="'+l1.id+'"'));
 assert.ok(selected1.includes('data-id="'+l1.id+'"'));
 const introduced={...state,learned:[l4.id]};
 const withHistory=renderC9HSKTargets(introduced,'4',act,esc);
 assert.ok(withHistory.includes('1 / '+hskTargetLessons('4').length+' introduced'));
 assert.ok(withHistory.includes('Not introduced'));
 assert.ok(withHistory.includes('Browse all '+hskTargetLessons('4').length+' lessons'));
 assert.ok(withHistory.includes('without prerequisites'));
});
test('Advanced targets have real original reading and mission buttons but do not masquerade as a fully mapped syllabus',()=>{
 const state=freshState();
 const six=renderC9HSKTargets(state,'6',act,esc);
 const sourceList=six.split('<div class="c9-level-lesson-list">')[1]?.split('</div>')[0]||'';
 assert.equal((sourceList.match(/data-action="c9-media-open-story"/g)||[]).length,5);
 assert.ok(six.includes('data-action="pathway-select"'));
 const advanced=renderC9HSKTargets(state,'7-9',act,esc);
 assert.ok(advanced.includes('data-action="pathway-select"'));
 assert.ok(advanced.includes('provisional'));
 assert.ok(!advanced.includes('certified HSK 7'));
 assert.ok(!six.includes('HSK 6 completed'));
});
