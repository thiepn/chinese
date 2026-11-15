// Beginner teaching-depth regression suite: the CHARACTER INSIGHT teaching for
// the first 31 lessons must explain the sentence grammar that appears in the
// lessons' own content, must not invent curriculum material or proficiency
// claims, and must preserve lesson identities, review cards, grading behavior,
// and backup/storage contracts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS,findLesson } from '../src/demo-lessons.mjs';
import { DEEP_NOTES,guideFor } from '../src/lesson-guides.mjs';
import { cardInfo,cardsForLesson,addLesson,gradeCard,freshState,validateState } from '../src/study.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';

const DAY=86400000;
const BEGINNER=DEMO_LESSONS.slice(0,31);
const HANZI_SEQUENCE='我你好是人中文学生书看吃喝水茶大小天日月说听有不再家老师朋友来';

// Function words and patterns the entries are expected to teach, plus the two
// deliberate negative examples (是好, 不有) shown to warn beginners off errors.
const TAUGHT_GRAMMAR=new Set(['的','们','吗','很','是','不是','了','都','和','在','想','喜欢','会','没有','那个','一杯','一本','一','杯','本','是好','不有','它','看见','听见','在这里','在教室','在书店','在书店看','在学校']);

test('teaching depth: every lesson 1-31 has complete guidance',()=>{
 for(const lesson of BEGINNER){
  const entry=DEEP_NOTES[lesson.hanzi];
  assert.ok(entry,'missing DEEP_NOTES entry for lesson '+lesson.id+' ('+lesson.hanzi+')');
  assert.equal(entry.length,3,'entry for '+lesson.hanzi+' must be [topic, explanation, comparison]');
  for(const [i,part] of entry.entries()){
   assert.equal(typeof part,'string');
   assert.ok(part.trim().length>0,'entry '+lesson.hanzi+' slot '+i+' is empty');
  }
  assert.ok(entry[1].length>=60,'explanation for '+lesson.hanzi+' is too thin for a beginner');
  const guide=guideFor(lesson);
  assert.equal(guide.topic,entry[0]);
  assert.equal(guide.explanation,entry[1]);
 }
});

test('teaching depth: core grammar is explained where it first appears',()=>{
 const teaches=(hanzi,...needles)=>{
  const text=DEEP_NOTES[hanzi].join(' ');
  for(const needle of needles)assert.ok(text.includes(needle),
   'entry '+hanzi+' should teach "'+needle+'"');
 };
 teaches('我','们','的');            // plural and possession in lesson 1 words
 teaches('你','吗');                // yes-no questions in lesson 2 sentence
 teaches('好','很','adjective');    // 很 + adjective
 teaches('是','不是','bú shì','adjective'); // identity, negation sandhi, no 是 before adjectives
 teaches('学','在','place');        // locative 在
 teaches('生','的','possessor');    // possession
 teaches('看','了','吗');           // result complement with 了 and 吗
 teaches('水','measure word');      // measure words
 teaches('大','都','all');          // 都
 teaches('不','没有','bú shì');     // negation and non-existent 不有 warning
 teaches('有','没有','measure word 本');
 teaches('师','和','都');           // noun linking and group 都
 teaches('朋','了');                // first 了 exposure
});

test('teaching depth: citations trace to real corpus content or taught grammar',()=>{
 const corpus=new Set();
 for(const lesson of DEMO_LESSONS){
  corpus.add(lesson.hanzi);
  for(const w of lesson.words)corpus.add(w.hanzi);
  corpus.add(lesson.sentence.hanzi);
 }
 for(const lesson of BEGINNER){
  const text=DEEP_NOTES[lesson.hanzi].join(' ');
  const citations=[...new Set(text.match(/[一-鿿]+/g)||[])];
  assert.ok(citations.length>0,'entry '+lesson.hanzi+' lost its Chinese examples');
  for(const citation of citations){
   if(TAUGHT_GRAMMAR.has(citation))continue;
   let traceable=corpus.has(citation);
   if(!traceable)for(const item of corpus)if(item.includes(citation)){traceable=true;break}
   assert.ok(traceable,'entry '+lesson.hanzi+' cites untraceable text: '+citation);
  }
 }
});

test('teaching depth: no fabricated proficiency or HSK/CEFR claims',()=>{
 for(const lesson of BEGINNER){
  const text=DEEP_NOTES[lesson.hanzi].join(' ');
  assert.doesNotMatch(text,/\b(HSK|CEFR|A1|A2|B1|B2|C1|C2)\b/,'entry '+lesson.hanzi+' must not claim level alignment');
  assert.doesNotMatch(text,/proficien|fluency level|certif/i,'entry '+lesson.hanzi+' must not claim proficiency');
 }
});

test('preservation: lesson identities and ordering are unchanged',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(BEGINNER.map(l=>l.hanzi).join(''),HANZI_SEQUENCE);
 BEGINNER.forEach((lesson,i)=>assert.equal(lesson.id,'demo-'+String(i+1).padStart(2,'0')));
 assert.ok(findLesson('demo-01'));
 assert.equal(findLesson('demo-31').hanzi,'来');
});

test('preservation: review-card identities are unchanged',()=>{
 assert.deepEqual([...cardsForLesson('demo-01')].sort(),[
  'demo-01:meaning','demo-01:reading','demo-01:sentence',
  'demo-01:word0','demo-01:word1','demo-01:wordread0',
 ]);
 assert.equal(cardInfo('demo-01:wordread0').answer,'wǒmen');
 assert.equal(cardInfo('demo-02:wordread0').answer,'nǐ hǎo');
});

test('preservation: grading behavior is unchanged',()=>{
 const state=addLesson(freshState(),'demo-01',1000);
 const good=gradeCard(state,'demo-01:meaning',2,1000,'ev-good',{correct:true,assisted:false});
 assert.equal(good.cards['demo-01:meaning'].interval,3);
 assert.equal(good.cards['demo-01:meaning'].due,1000+3*DAY);
 const again=gradeCard(good,'demo-01:meaning',0,2000,'ev-again',{correct:false,assisted:false});
 assert.equal(again.cards['demo-01:meaning'].interval,2/1440);
 assert.equal(again.cards['demo-01:meaning'].repetitions,0);
 assert.throws(()=>gradeCard(state,'demo-01:meaning',2,1000,'ev-bad',{correct:false,assisted:false}),
  /passing credit/,'incorrect answers must not receive passing credit');
});

test('preservation: earlier pinyin correction still holds',()=>{
 const lesson=DEMO_LESSONS.find(l=>l.words.some(w=>w.hanzi==='修改稿'));
 const word=lesson.words.find(w=>w.hanzi==='修改稿');
 assert.equal(word.pinyin,'xiūgǎigǎo');
 assert.equal(cardInfo(lesson.id+':wordread1').answer,'xiūgǎigǎo');
});

test('preservation: backup and storage contracts are unchanged',()=>{
 const state=addLesson(freshState(),'demo-01',1000);
 assert.doesNotThrow(()=>validateState(state));
 const doc=backupDocument(state);
 assert.equal(doc.format,'character-study-demo-backup');
 assert.equal(doc.formatVersion,1);
 assert.equal(doc.origin,'original-editorial-demo');
 const restored=importBackup(doc);
 assert.ok(restored);
 assert.deepEqual(restored.learned,state.learned);
 assert.deepEqual(Object.keys(restored.cards).sort(),Object.keys(state.cards).sort());
});

test('review corrections: fixed entries are pinned and old defects stay gone',()=>{
 const entry=hanzi=>DEEP_NOTES[hanzi].join(' ');
 // demo-18 (天): 很好 recognized as adjective predicate; the old rule/evidence
 // mismatch ("Time expressions come before the verb" over a verbless sentence)
 // is gone; the canonical lesson translation is quoted verbatim.
 const t18=entry('天');
 assert.ok(t18.includes('The weather will be good tomorrow.'),'demo-18 must quote the canonical translation verbatim');
 assert.ok(t18.includes('no verb'),'demo-18 must recognize the verbless adjective predicate');
 assert.doesNotMatch(t18,/Time expressions come before the verb/,'demo-18 must not state a verb rule over a verbless example');
 // demo-05 (人): restricted, non-obligatory 们 replaces the overbroad plural claim.
 const t5=entry('人');
 assert.ok(t5.includes('There are many people here.'),'demo-05 must quote the canonical translation verbatim');
 assert.ok(t5.includes('们'),'demo-05 must mention 们 as restricted plural marking');
 assert.doesNotMatch(t5,/do not change form for plural/,'demo-05 must not claim nouns never take plural marking');
 // demo-19 (日): gloss matches the canonical lesson translation.
 const t19=entry('日');
 assert.ok(t19.includes('I write in a diary every day.'),'demo-19 must quote the canonical translation verbatim');
 assert.doesNotMatch(t19,/my diary/,'demo-19 must not reword the canonical translation');
 // demo-08 (学) and demo-11 (看): no references to vocabulary taught later.
 const t8=entry('学');
 assert.ok(t8.includes('在学校'),'demo-08 keeps its own-sentence example');
 assert.doesNotMatch(t8,/在书店/,'demo-08 must not cite 书店 (first taught in demo-10)');
 const t11=entry('看');
 assert.ok(t11.includes('看见'),'demo-11 keeps its own-word teaching');
 assert.doesNotMatch(t11,/听见/,'demo-11 must not cite 听见 (first taught in demo-22)');
 // demo-10 (书): 看 reconciled as a verb with the conventional phrase 看书.
 const t10=entry('书');
 assert.ok(t10.includes('看书'),'demo-10 keeps its verb-object teaching');
 assert.ok(t10.includes('look'),'demo-10 states 看 own meaning');
 assert.doesNotMatch(t10,/看 "read"/,'demo-10 must not gloss 看 alone as "read"');
 assert.doesNotMatch(t10,/turns 看/,'demo-10 must not claim the object changes the verb meaning');
});

test('review corrections: quoted sentence glosses stay consistent with canonical translations',()=>{
 const strip=s=>String(s).replace(/[。？！.!?]$/,'');
 const norm=s=>String(s).toLowerCase().replace(/[。？！.!?]$/,'').trim();
 for(const lesson of BEGINNER){
  const text=DEEP_NOTES[lesson.hanzi].join(' ');
  const quoted=new RegExp(strip(lesson.sentence.hanzi).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s+"([^"]+)"').exec(text);
  if(!quoted)continue; // entry does not quote a gloss directly after its sentence
  assert.ok(norm(lesson.sentence.english).includes(norm(quoted[1])),
   lesson.id+' quote "'+quoted[1]+'" diverges from canonical "'+lesson.sentence.english+'"');
 }
});
