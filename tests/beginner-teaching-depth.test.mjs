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
