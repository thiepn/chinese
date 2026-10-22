import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAMMAR_LESSONS,GRAMMAR_PRACTICE_TASKS,grammarQuestion,gradeGrammarQuestion} from '../src/grammar-course.mjs';
import {renderGrammarScreen} from '../src/grammar-screen.mjs';

test('all original Mandarin cloze sentences expose the exact source-owned interpretation before choosing',()=>{
 assert.equal(GRAMMAR_LESSONS.length,164,'original grammar ID/rights boundary');
 for(const l of GRAMMAR_LESSONS){
  const q=grammarQuestion(l.id,'cloze');
  assert.equal(q.id,'grammar:'+l.id+':cloze');
  assert.equal(q.taskId,q.id);
  assert.equal(q.answer,l.cloze.answer);
  assert.equal(q.targetMeaning,l.cloze.completed.english);
  assert.equal(q.model.english,q.targetMeaning);
  assert.equal(q.model.hanzi,q.context.replace(/＿＿|____/,q.answer));
  assert.deepEqual(new Set(q.options),new Set(l.cloze.options),'authored wrong-answer alternatives remain');
  assert.equal(GRAMMAR_PRACTICE_TASKS.find(t=>t.id===q.id).english,q.targetMeaning,
   'existing canonical writing task retains matching English');
 }
});

test('g128 source distinction is hypothetical 即使, not a claim that factual 虽然 is always ungrammatical',()=>{
 const q=grammarQuestion('g128','cloze');
 assert.equal(q.context,'＿＿时间不够，我们也不能随便修改数据。');
 assert.equal(q.targetMeaning,'Even if time is short, we cannot change the data casually.');
 assert.deepEqual(new Set(q.options),new Set(['即使','因为','虽然']));
 assert.equal(q.model.hanzi,'即使时间不够，我们也不能随便修改数据。');
 assert.match(q.explanation,/虽然.*尽管.*factual concession.*即使.*hypothetical/u);
 assert.equal(gradeGrammarQuestion(q,'即使').correct,true);
 const factual=gradeGrammarQuestion(q,'虽然');
 assert.equal(factual.correct,false,'does not earn canonical intended-meaning credit');
 assert.equal(factual.reason,'choice','keep original source answer authority and event reason');
 assert.match(factual.message,/different context/);
 assert.doesNotMatch(factual.message,/ungrammatical|incorrect Chinese/i);
 const meaning=grammarQuestion('g128','meaning');
 assert.equal(meaning.answer,'Even if time is short, we cannot change the data casually.');
 assert.equal(gradeGrammarQuestion(meaning,meaning.answer).correct,true);
 assert.equal(gradeGrammarQuestion(meaning,'not the answer').message,'That was not the intended interpretation.',
  'meaning grading remains unchanged');
});

test('native P46 practice shows authored meaning and Chinese language marker before feedback',()=>{
 const s={lessonId:'g128',chapter:'6',query:'',mode:'cloze',typed:'',feedback:null,assisted:false,
  order:[],showEnglish:true,sentenceEvents:[]};
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const action=(id,label,cls,attrs='')=>'<button data-action="'+id+'" class="'+cls+'" '+attrs+'>'+label+'</button>';
 const html=renderGrammarScreen(s,action,esc,()=>'',()=>'');
 assert.match(html,/<p class="p25-task-context" lang="zh-Hans">＿＿时间不够，我们也不能随便修改数据。<\/p>/);
 assert.match(html,/<p class="p25-task-meaning">Even if time is short, we cannot change the data casually.<\/p>/);
 assert.ok(html.indexOf('p25-task-meaning')<html.indexOf('data-option="虽然"')||
  html.indexOf('p25-task-meaning')<html.indexOf('data-option="即使"'), 'the target meaning is displayed before answer buttons');
 assert.equal((html.match(/data-option="(?:即使|因为|虽然)"/g)||[]).length,3);
 const other=renderGrammarScreen({...s,mode:'meaning'},action,esc,()=>'',()=>'');
 assert.doesNotMatch(other,/p25-task-meaning/,'do not reveal correct meaning on comprehension choices');
});

test('context clarification changes no stored grades, lesson identities or original review evidence',()=>{
 const q=grammarQuestion('g128','cloze');
 assert.equal(q.grammar.id,'g128');
 assert.equal(q.taskId,'grammar:g128:cloze');
 assert.equal(GRAMMAR_PRACTICE_TASKS.filter(t=>t.grammarId==='g128').length,5);
 assert.equal(gradeGrammarQuestion(q,'虽然').correct,false);
 assert.equal(gradeGrammarQuestion(q,'即使').correct,true);
});
