import test from 'node:test';
import assert from 'node:assert/strict';
import {P36_GRAMMAR_IDS,P36_GRAMMAR_ROWS,P36_REPAIR_CASES,P36_CORRECTION_TASKS} from '../src/p36-course.mjs';
import {findGrammarLesson,GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS} from '../src/grammar-course.mjs';
import {p36TeachingExtension} from '../src/p36-screen.mjs';
import {freshState} from '../src/study.mjs';

// Malformed models are original-context edits of the *same* source-owned
// transfer sentence, not an unrelated example from another activity.
const contextErrors=[
 ['g65','我今天早上没买了三瓶水。'],
 ['g66','商店已经关门过。'],
 ['g67','你吃着这道菜吗？'],
 ['g68','我不去过这个博物馆。'],
 ['g69','墙上挂过一张照片。'],
 ['g70','我已经听完中文录音了。'],
 ['g71','我昨天两个小时学习。'],
 ['g72','我每周运动三个。'],
 ['g73','我已经还没做完作业。'],
 ['g74','我昨天没坐了地铁。'],
 ['g75','我听了懂老师的话。'],
 ['g76','我写今天的笔记完了。'],
 ['g77','我找了到手机。'],
 ['g78','我不听清楚广播。'],
 ['g79','你上去吧，我在三楼。'],
 ['g80','我从商店里走进去。'],
 ['g81','同学汉字写的很整齐。'],
 ['g82','这顿饭比好吃了！'],
 ['g83','黑色外套跟蓝色外套暖和一点儿。'],
 ['g84','这间教室比那间一样安静。'],
 ['g85','课程比越来越有趣了。'],
 ['g86','我想又听一遍录音。'],
 ['g87','火车八点才到了。'],
 ['g88','朋友也在楼下等我。'],
 ['g89','我会用这台电脑吗？'],
 ['g90','考试以前我必须复习。'],
 ['g91','我去公园是练习说中文。'],
 ['g92','你想喝茶还是水吗？'],
 ['g93','因为我很累，但是今天在家休息。'],
 ['g94','因为下雨，我们就坐公交车。']
];
test('P36 all 30 source-owned repairs share the transfer target context, not unrelated scene',()=>{
 assert.equal(P36_GRAMMAR_IDS.length,30);
 assert.equal(P36_REPAIR_CASES.length,30);
 assert.equal(P36_CORRECTION_TASKS.length,30);
 assert.equal(P36_GRAMMAR_ROWS.length,30);
 assert.equal(new Set(contextErrors.map(r=>r[0])).size,30);
 assert.deepEqual(P36_GRAMMAR_IDS,contextErrors.map(r=>r[0]));
 const originalState=freshState(),snapshot=JSON.stringify(originalState);
 for(const [i,[id,incorrect]] of contextErrors.entries()){
  const lesson=findGrammarLesson(id),repair=P36_REPAIR_CASES[i],task=P36_CORRECTION_TASKS[i];
  assert.ok(lesson,id);
  assert.equal(repair.id,'p36:fix:'+id);
  assert.equal(repair.taskId,repair.id);
  assert.equal(repair.grammarId,id);
  assert.equal(repair.incorrect,incorrect,id);
  assert.equal(repair.correct.hanzi,lesson.transformation.model.hanzi,id);
  assert.equal(repair.correct.pinyin,lesson.transformation.model.pinyin,id);
  assert.equal(repair.correct.english,lesson.transformation.model.english,id);
  assert.equal(repair.intendedMeaning,lesson.transformation.model.english,id);
  assert.notEqual(incorrect,repair.correct.hanzi,id);
  assert.equal(P36_GRAMMAR_ROWS[i][11][1],repair.correct.hanzi,id);
  assert.equal(task.id,repair.taskId,id);
  assert.equal(task.grammarId,id);
  assert.equal(task.hanzi,repair.correct.hanzi,id);
  assert.equal(task.pinyin,repair.correct.pinyin,id);
  assert.ok(task.english.includes(incorrect),id);
  assert.ok(task.english.includes(repair.intendedMeaning),id);
  assert.equal(task.kind,'p36-grammar-correction');
  assert.equal(GRAMMAR_PRACTICE_TASKS.filter(t=>t.grammarId===id).length,5,id);
 }
 assert.equal(GRAMMAR_LESSONS.length,164);
 assert.equal(JSON.stringify(originalState),snapshot,'source read adds no learner credit');
});
test('P36 result versus potential complements teach accurate Mandarin patterns',()=>{
 const result=findGrammarLesson('g75'),potential=findGrammarLesson('g78');
 assert.match(result.title,/看懂.*听懂/);
 assert.equal(result.examples[0].hanzi,'我终于看懂了这句话。');
 assert.equal(result.examples[1].hanzi,'这个问题我还没听懂。');
 assert.match(potential.title,/V得懂.*V不懂/);
 assert.equal(potential.pattern,'verb + 得 / 不 + result');
 assert.match(potential.explanation,/看得懂.*听得懂/);
 assert.match(potential.explanation,/看不懂.*听不清楚/);
 assert.match(potential.explanation,/能看懂/);
 assert.match(potential.contrast,/听得懂/);
 assert.equal(potential.examples[0].hanzi,'这段中文我看不懂。');
 assert.equal(potential.examples[1].hanzi,'老师讲得很清楚，我听得懂。');
 assert.equal(potential.transformation.model.hanzi,'我听不清楚广播。');
});
test('P36 native teaching displays the case-specific wrong model next to its unchanged correct answer',()=>{
 const act=(name,label,_style='',extra='')=>'<button data-action="'+name+'" '+extra+'>'+label+'</button>';
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 for(const id of ['g65','g73','g75','g78','g84','g94']){
  const repair=P36_REPAIR_CASES.find(x=>x.grammarId===id);
  const html=p36TeachingExtension(findGrammarLesson(id),act,esc,{showModel:true});
  assert.match(html,/CONTEXT-SPECIFIC LANGUAGE REPAIR/);
  assert.ok(html.includes(repair.incorrect),id);
  assert.ok(html.includes(repair.correct.hanzi),id);
  assert.ok(html.includes(repair.correct.english),id);
  assert.ok(html.includes('data-id="'+id+'"'),id);
 }
});
