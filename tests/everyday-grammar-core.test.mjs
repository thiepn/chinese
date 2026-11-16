// Everyday Grammar Core regression suite: the g165..g181 beginner grammar
// lessons fill audited holes in the grammar course with intact row invariants,
// parseable pinyin, traceable characters, generated practice tasks, and no
// change to lesson identities, review cards, or canonical demo content.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS,findLesson } from '../src/demo-lessons.mjs';
import { GRAMMAR_LESSONS,GRAMMAR_CHAPTERS,GRAMMAR_PRACTICE_TASKS,findGrammarLesson } from '../src/grammar-course.mjs';
import { EVERYDAY_GRAMMAR_ROWS } from '../src/everyday-grammar.mjs';
import { parsePinyin,evaluateMeaning,evaluatePinyin } from '../src/exercises.mjs';
import { renderGrammarScreen } from '../src/grammar-screen.mjs';
import { gradeCard,addLesson,freshState,validateState,baseInterval,leechCards,DAY } from '../src/study.mjs';
import { reviewPlan } from '../src/review-strategy.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';

const NEW_IDS=['g165','g166','g167','g168','g169','g170','g171','g172','g173','g174','g175','g176','g177','g178','g179','g180','g181'];
const CHAPTERS=new Set(['Foundations','Questions','Nouns & classifiers','Time & location','Actions & aspect','Connections & comparisons']);
// Characters introduced by these lessons that no existing corpus row contains.
const NEW_CHARS=new Set(['叫','块','往']);
const parseable=p=>parsePinyin(String(p).replace(/[^\p{L}\p{N}\s'’\-·]/gu,' ').replace(/(?<=[\p{L}])r(?=\s|$)/gu,''));

test('everyday grammar: 17 audited hole-filling lessons exist in difficulty order',()=>{
 assert.equal(EVERYDAY_GRAMMAR_ROWS.length,17);
 assert.deepEqual(EVERYDAY_GRAMMAR_ROWS.map(r=>r[0]),NEW_IDS);
 for(const id of NEW_IDS){
  const lesson=findGrammarLesson(id);
  assert.ok(lesson,'missing grammar lesson '+id);
  assert.ok(CHAPTERS.has(lesson.chapter),id+' chapter');
  assert.ok(lesson.order>=165&&lesson.order<=181,id+' order');
  assert.ok(lesson.title&&lesson.pattern&&lesson.explanation&&lesson.contrast&&lesson.pitfall,id+' prose fields');
  const expectedAnchor=DEMO_LESSONS.find(l=>l.hanzi===lesson.anchor)?.id||null;
  assert.equal(lesson.characterLessonId,expectedAnchor,id+' anchor linkage');
 }
 assert.equal(GRAMMAR_LESSONS.length,181);
 // Difficulty progression: staples before advanced structures.
 assert.ok(NEW_IDS.indexOf('g165')<NEW_IDS.indexOf('g178')&&NEW_IDS.indexOf('g178')<NEW_IDS.indexOf('g181'));
});

test('everyday grammar: row invariants hold for every new lesson',()=>{
 for(const id of NEW_IDS){
  const lesson=findGrammarLesson(id);
  assert.equal(lesson.examples.length,2,id+' examples');
  for(const ex of lesson.examples){
   assert.ok(ex.hanzi&&ex.pinyin&&ex.english,id+' example fields');
   assert.ok(parseable(ex.pinyin),id+' example pinyin parses: '+ex.pinyin);
  }
  // Cloze: masking, answer position, and completed sentence must agree.
  const cloze=lesson.cloze;
  assert.ok(cloze.masked.includes('＿＿'),id+' cloze masked');
  const row=findRow(id);
  assert.equal(row[10][4],row[10][0].replace('＿＿',row[10][1]),id+' cloze completed matches masked+answer');
  assert.ok(row[10][1]!==row[10][2]&&row[10][1]!==row[10][3]&&row[10][2]!==row[10][3],id+' cloze options distinct');
  // Transformation: chunks must rebuild the model exactly.
  assert.equal(row[11][4].join(''),row[11][1],id+' transformation chunks rebuild model');
  assert.ok(parseable(row[11][2]),id+' transformation pinyin parses');
  assert.ok(parseable(row[10][5]),id+' cloze pinyin parses');
  assert.ok(row[11][0]&&row[11][3]&&row[10][6],id+' prompts and english');
 }
 function findRow(id){return EVERYDAY_GRAMMAR_ROWS.find(r=>r[0]===id)}
});

test('everyday grammar: every character is corpus-traceable or declared new',()=>{
 const corpus=new Set();
 for(const lesson of DEMO_LESSONS){
  corpus.add(lesson.hanzi);
  for(const w of lesson.words)for(const c of w.hanzi)corpus.add(c);
  for(const c of lesson.sentence.hanzi)corpus.add(c);
  if(lesson.extraSentence)for(const c of lesson.extraSentence.hanzi)corpus.add(c);
 }
 for(const row of EVERYDAY_GRAMMAR_ROWS){
  const text=[row[7],...row[8],...row[9],...row[10],...row[11],...row[11][4]].join('');
  for(const ch of text.match(/[\u4e00-\u9fff]/g)||[]){
   assert.ok(corpus.has(ch)||NEW_CHARS.has(ch),row[0]+' uses untraceable character: '+ch);
  }
 }
});

test('everyday grammar: five practice modes generate for each new lesson',()=>{
 for(const id of NEW_IDS){
  const tasks=GRAMMAR_PRACTICE_TASKS.filter(t=>t.grammarId===id);
  assert.equal(tasks.length,5,id+' practice tasks');
  for(const t of tasks)assert.ok(t.hanzi&&t.pinyin&&t.english&&t.mode,id+' task fields');
 }
 assert.ok(GRAMMAR_CHAPTERS.some(ch=>ch.lessons.includes('g165')));
 assert.ok(GRAMMAR_CHAPTERS.some(ch=>ch.lessons.includes('g181')));
});

// ---- Meaning grading: conservative, zero false accepts ----
test('meaning grading: approved answers accept case, articles and curated variants',()=>{
 assert.equal(evaluateMeaning('the book','a book').correct,true);
 assert.equal(evaluateMeaning('Hi','hello').correct,true);
 assert.equal(evaluateMeaning('mandarin','Chinese (language)').correct,true);
 assert.equal(evaluateMeaning('a bit','a little').correct,true);
 assert.equal(evaluateMeaning('purchase','to buy').correct,true);
 assert.equal(evaluateMeaning('phone','telephone').correct,true);
 assert.equal(evaluateMeaning('to speak','to speak; say').correct,true);
 assert.equal(evaluateMeaning('talk','to speak; say').correct,true);
 assert.equal(evaluateMeaning('student','student').correct,true);
});
test('meaning grading: near-miss input never earns automatic credit',()=>{
 for(const [input,ref] of [['hell0','hello'],['spek','to speak'],['there','three'],['form','from'],['books','book'],['buy book','buy books']]){
  const r=evaluateMeaning(input,ref);
  assert.equal(r.correct,false,input+' vs '+ref+' must not pass');
 }
 assert.equal(evaluateMeaning('hell0','hello').reason,'near-miss');
 assert.equal(evaluateMeaning('teacher','student').reason,'meaning');
 assert.equal(evaluateMeaning('','hello').reason,'empty');
});
test('meaning grading: pinyin grading is unchanged by this work',()=>{
 assert.equal(evaluatePinyin('ni3','nǐ').correct,true);
 assert.equal(evaluatePinyin('nǐ','ní').reason,'tone');
 assert.equal(evaluatePinyin('xyz','nǐ').correct,false);
});

// ---- Review scheduler v3 ----
test('scheduler v3: default ease reproduces the legacy interval formula exactly',()=>{
 for(const prev of [0,1,3,10,50,200]){
  assert.equal(baseInterval(prev,0,2.5),2/1440,'grade 0');
  assert.equal(baseInterval(prev,1,2.5),Math.max(1,prev*1.25),'grade 1');
  assert.equal(baseInterval(prev,2,2.5),Math.max(3,prev*2.2),'grade 2');
  assert.equal(baseInterval(prev,3,2.5),Math.max(7,prev*2.8),'grade 3');
 }
});
test('scheduler v3: short intervals stay exact and legacy due dates are preserved',()=>{
 const base=addLesson(freshState(),'demo-01',1000);
 const good=gradeCard(base,'demo-01:meaning',2,1000,'evt-g2');
 assert.equal(good.cards['demo-01:meaning'].due,1000+3*DAY);
 assert.equal(good.cards['demo-01:meaning'].interval,3);
 const again=gradeCard(base,'demo-01:meaning',0,5000,'evt-g0');
 assert.equal(again.cards['demo-01:meaning'].due,5000+2*60000);
 const easy=gradeCard(base,'demo-01:meaning',3,1000,'evt-g3');
 assert.equal(easy.cards['demo-01:meaning'].due,1000+7*DAY);
 const twin=gradeCard(base,'demo-01:meaning',2,1000,'evt-g2b');
 assert.equal(twin.cards['demo-01:meaning'].due,good.cards['demo-01:meaning'].due);
});
test('scheduler v3: fuzz is deterministic and bounded on mature intervals only',()=>{
 const s=addLesson(freshState(),'demo-01',0);
 s.cards['demo-01:meaning'].interval=30;
 const graded=gradeCard(s,'demo-01:meaning',2,1000,'evt-fuzz');
 const interval=graded.cards['demo-01:meaning'].interval;
 assert.ok(interval>=66*0.95-1e-9&&interval<=66*1.05+1e-9,'fuzz bounds: '+interval);
 const again=gradeCard(s,'demo-01:meaning',2,1000,'evt-fuzz2');
 assert.equal(again.cards['demo-01:meaning'].interval,interval,'fuzz is deterministic per card and attempt');
});
test('scheduler v3: interval cap and per-card ease adapt to performance',()=>{
 const s=addLesson(freshState(),'demo-01',0);
 s.cards['demo-01:meaning'].interval=200;
 const capped=gradeCard(s,'demo-01:meaning',3,1000,'evt-cap');
 assert.equal(capped.cards['demo-01:meaning'].interval,365);
 const hard=gradeCard(addLesson(freshState(),'demo-01',0),'demo-01:meaning',1,1000,'evt-hard');
 assert.equal(hard.cards['demo-01:meaning'].ease,2.35);
 assert.ok(baseInterval(10,2,1.3)<baseInterval(10,2,2.5),'lower ease shortens intervals');
 let clamped=addLesson(freshState(),'demo-01',0);
 for(let i=0;i<20;i++)clamped=gradeCard(clamped,'demo-01:meaning',1,1000,'evt-clamp-'+i);
 assert.equal(clamped.cards['demo-01:meaning'].ease,1.3);
});
test('scheduler v3: lapses accumulate, leeches surface, nothing is suspended',()=>{
 let s=addLesson(freshState(),'demo-01',0);
 for(let i=0;i<7;i++){s=gradeCard(s,'demo-01:meaning',0,1000+i,'evt-lap-'+i);assert.equal(leechCards(s).length,0);}
 assert.equal(s.cards['demo-01:meaning'].lapses,7);
 s=gradeCard(s,'demo-01:meaning',0,2000,'evt-lap-8');
 assert.deepEqual(leechCards(s),['demo-01:meaning']);
 assert.equal(s.cards['demo-01:meaning'].leech,true);
 assert.ok(s.learned.includes('demo-01'),'leech is flagged, never suspended');
 assert.doesNotThrow(()=>validateState(s));
 const plan=reviewPlan(s,{now:2000+2*60000+1});
 assert.ok(plan.some(r=>r.reason==='Repeated lapse target (leech)'),'leech surfaces in the review priority');
});
test('scheduler v3: pre-v3 card shapes validate and backups round-trip',()=>{
 const old=addLesson(freshState(),'demo-01',1000);
 old.cards['demo-01:meaning']={due:1000,interval:3,repetitions:1,lastGrade:2};
 assert.doesNotThrow(()=>validateState(old));
 const graded=gradeCard(old,'demo-01:meaning',2,2000,'evt-old');
 assert.doesNotThrow(()=>validateState(graded));
 assert.deepEqual(importBackup(backupDocument(graded)),graded);
 for(const badCard of [
  {due:1,interval:1,repetitions:0,lastGrade:null,ease:'high'},
  {due:1,interval:1,repetitions:0,lastGrade:null,lapses:-1},
  {due:1,interval:1,repetitions:0,lastGrade:null,leech:'yes'}]){
  assert.throws(()=>validateState({...old,cards:{'demo-01:meaning':badCard}}),/Invalid/);
 }
});
test('scheduler v3: grading invariants and event idempotency are unchanged',()=>{
 const s=addLesson(freshState(),'demo-01',0);
 assert.throws(()=>gradeCard(s,'demo-01:meaning',2,1000,'x1',{correct:false}),/passing credit/);
 assert.throws(()=>gradeCard(s,'demo-01:meaning',2,1000,'x2',{assisted:true}),/independent credit/);
 const graded=gradeCard(s,'demo-01:meaning',2,1000,'x3',{correct:true,assisted:false});
 assert.equal(graded.events[0].policy,'review-v3');
 const dup=gradeCard(graded,'demo-01:meaning',2,1000,'x3');
 assert.equal(dup.events.length,1);
});

// ---- Lesson-to-exercise connections ----
test('everyday grammar: rows carry library match tokens for real sentence linkage',()=>{
 for(const row of EVERYDAY_GRAMMAR_ROWS){
  assert.ok(Array.isArray(row[12]),row[0]+' matchTokens');
 }
 assert.deepEqual(EVERYDAY_GRAMMAR_ROWS.find(r=>r[0]==='g165')[12],['是不是','有没有']);
 assert.deepEqual(EVERYDAY_GRAMMAR_ROWS.find(r=>r[0]==='g181')[12],[],'g181 relies on example fallback by design');
});
test('grammar screen: new lessons link to real practice sentences without dead ends',()=>{
 const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const act=(n,label)=>`<button>${label}</button>`;
 const base={mode:'meaning',typed:'',order:[],feedback:null,assisted:false,sentenceEvents:[],showEnglish:true,chapter:'all',query:''};
 const g165=renderGrammarScreen({...base,lessonId:'g165'},act,esc,()=>'',()=>'');
 assert.ok(g165.includes('有没有小一点的袋子'),'g165 must show a real library sentence using the pattern');
 assert.ok(!g165.includes('Browse all sentences with this pattern'),'no dead library filter for untagged lessons');
 const g181=renderGrammarScreen({...base,lessonId:'g181'},act,esc,()=>'',()=>'');
 assert.ok(g181.includes('这本书我看过。'),'g181 falls back to its own examples');
 assert.ok(g181.includes('Zhè běn shū'),'fallback examples keep pinyin');
 const legacy=renderGrammarScreen({...base,lessonId:'g01'},act,esc,()=>'',()=>'');
 assert.ok(legacy.includes('Browse all sentences with this pattern'),'tagged legacy lessons keep the library browse CTA');
});

// ---- Long-interval and near-miss contract probes ----
test('scheduler v3: long review chains grow monotonically and stay under the cap',()=>{
 let s=addLesson(freshState(),'demo-01',0);
 let prevDue=0;
 for(let i=0;i<12;i++){
  s=gradeCard(s,'demo-01:meaning',2,1000+i,'evt-chain-'+i);
  const c=s.cards['demo-01:meaning'];
  assert.ok(c.interval<=365,'interval capped: '+c.interval);
  assert.ok(c.interval>=3,'interval floor: '+c.interval);
  assert.ok(c.due>prevDue,'due grows monotonically');
  prevDue=c.due;
 }
 assert.equal(s.cards['demo-01:meaning'].interval,365,'chain reaches the cap');
 const hard=gradeCard(s,'demo-01:meaning',1,99000,'evt-chain-hard');
 assert.equal(hard.cards['demo-01:meaning'].interval,365,'hard grade keeps legacy growth but the cap holds');
 const again=gradeCard(s,'demo-01:meaning',0,100000,'evt-chain-again');
 assert.equal(again.cards['demo-01:meaning'].interval,2/1440,'grade 0 resets a capped card to the 2-minute relearn');
});
test('near-miss meaning answers cannot earn passing review grades',()=>{
 const verdict=evaluateMeaning('hell0','hello');
 assert.equal(verdict.correct,false);
 assert.equal(verdict.reason,'near-miss');
 const s=addLesson(freshState(),'demo-01',0);
 assert.throws(()=>gradeCard(s,'demo-01:meaning',2,1000,'evt-near',{correct:verdict.correct,assisted:false}),/passing credit/);
 const graded=gradeCard(s,'demo-01:meaning',0,1000,'evt-near-0',{correct:verdict.correct,assisted:false});
 assert.equal(graded.cards['demo-01:meaning'].repetitions,0,'a near-miss resets progress like any other miss');
});
