// Lesson-note teaching regression suite: the notes of the improved mid-course
// lessons (demo-34..demo-66) teach their own sentence's grammar on the primary
// learner-facing surface, quote canonical translations consistently, cite only
// real corpus material, and preserve canonical data and learner contracts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_LESSONS,findLesson } from '../src/demo-lessons.mjs';
import { DEEP_NOTES,guideFor } from '../src/lesson-guides.mjs';
import { cardInfo,cardsForLesson,addLesson,gradeCard,freshState,validateState } from '../src/study.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';

const IMPROVED=['demo-34','demo-35','demo-39','demo-40','demo-42','demo-44','demo-48','demo-49','demo-50','demo-52','demo-53','demo-56','demo-57','demo-58','demo-62','demo-63','demo-66'];
// Function words/composites taught explicitly in the notes, beyond corpus words.
const TAUGHT_GRAMMAR=new Set(['的','了','吗','没去','不会','不会说中文']);
const norm=s=>String(s).toLowerCase().replace(/[。？！.!?]$/,'').trim();
const esc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

test('note teaching: each improved note teaches its own sentence and quotes the canonical translation',()=>{
 for(const id of IMPROVED){
  const lesson=findLesson(id);
  assert.ok(lesson,'missing lesson '+id);
  assert.ok(lesson.note.includes(lesson.sentence.hanzi),
   id+' note must carry its own sentence for correct lesson-to-guidance association');
  const quoted=new RegExp(esc(lesson.sentence.hanzi)+'\\s*"([^"]+)"').exec(lesson.note);
  assert.ok(quoted,id+' note must quote the sentence with an English gloss');
  assert.ok(norm(lesson.sentence.english).includes(norm(quoted[1])),
   id+' gloss "'+quoted[1]+'" diverges from canonical "'+lesson.sentence.english+'"');
  // The improved note is the teaching text learners see via guideFor.
  const guide=guideFor(lesson);
  assert.ok(guide&&guide.explanation.length>0);
  assert.ok(guide.explanation===lesson.note||guide.explanation===(DEEP_NOTES[lesson.hanzi]||[])[1],
   id+' guideFor must surface the improved teaching text');
 }
});

test('note teaching: citations trace to real corpus content or taught grammar',()=>{
 const corpus=new Set();
 for(const lesson of DEMO_LESSONS){
  corpus.add(lesson.hanzi);
  for(const w of lesson.words)corpus.add(w.hanzi);
  corpus.add(lesson.sentence.hanzi);
  if(lesson.extraSentence)corpus.add(lesson.extraSentence.hanzi);
 }
 for(const id of IMPROVED){
  const lesson=findLesson(id);
  for(const citation of new Set(lesson.note.match(/[一-鿿]+/g)||[])){
   if(TAUGHT_GRAMMAR.has(citation))continue;
   let traceable=corpus.has(citation);
   if(!traceable)for(const item of corpus)if(item.includes(citation)){traceable=true;break}
   assert.ok(traceable,id+' note cites untraceable text: '+citation);
  }
 }
});

test('preservation: canonical hanzi and pinyin of the improved lessons are unchanged',()=>{
 const expected=[
  ['demo-34','会','huì','我会说一点中文。','Wǒ huì shuō yìdiǎn Zhōngwén.'],
  ['demo-35','什','shén','你想吃什么？','Nǐ xiǎng chī shénme?'],
  ['demo-39','哪','nǎ','你住在哪里？','Nǐ zhù zài nǎlǐ?'],
  ['demo-40','谁','shéi','谁在门口？','Shéi zài ménkǒu?'],
  ['demo-42','少','shǎo','我今天喝的水很少。','Wǒ jīntiān hē de shuǐ hěn shǎo.'],
  ['demo-44','今','jīn','今天我不去学校。','Jīntiān wǒ bú qù xuéxiào.'],
  ['demo-48','点','diǎn','我想吃一点点心。','Wǒ xiǎng chī yìdiǎn diǎnxin.'],
  ['demo-49','分','fēn','我等了你五分钟。','Wǒ děng le nǐ wǔ fēnzhōng.'],
  ['demo-50','钟','zhōng','还有十分钟。','Hái yǒu shí fēnzhōng.'],
  ['demo-52','话','huà','我现在不能说话。','Wǒ xiànzài bù néng shuōhuà.'],
  ['demo-53','脑','nǎo','我用电脑学习中文。','Wǒ yòng diànnǎo xuéxí Zhōngwén.'],
  ['demo-56','车','chē','我坐火车去北京。','Wǒ zuò huǒchē qù Běijīng.'],
  ['demo-57','火','huǒ','火车来了。','Huǒchē lái le.'],
  ['demo-58','坐','zuò','我坐车去学校。','Wǒ zuò chē qù xuéxiào.'],
  ['demo-62','东','dōng','桌上有很多东西。','Zhuō shàng yǒu hěn duō dōngxi.'],
  ['demo-63','西','xī','我想买一点东西。','Wǒ xiǎng mǎi yìdiǎn dōngxi.'],
  ['demo-66','写','xiě','我给朋友写信。','Wǒ gěi péngyou xiě xìn.'],
 ];
 for(const [id,hanzi,pinyin,sentHanzi,sentPinyin] of expected){
  const lesson=findLesson(id);
  assert.equal(lesson.hanzi,hanzi,id+' hanzi');
  assert.equal(lesson.pinyin,pinyin,id+' pinyin');
  assert.equal(lesson.sentence.hanzi,sentHanzi,id+' sentence hanzi');
  assert.equal(lesson.sentence.pinyin,sentPinyin,id+' sentence pinyin');
 }
});

test('preservation: lesson IDs, ordering and review-card identities are unchanged',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(DEMO_LESSONS.slice(31,74).map(l=>l.hanzi).join(''),'去回会什么这那哪谁多少年今明时间点分钟电话脑手机车火坐走买钱东西工作写字读名爱喜欢身体');
 IMPROVED.forEach((id,i)=>assert.equal(findLesson(id).id,id));
 assert.deepEqual([...cardsForLesson('demo-35')].sort(),[
  'demo-35:meaning','demo-35:reading','demo-35:sentence',
  'demo-35:word0','demo-35:word1','demo-35:wordread0',
 ]);
 assert.equal(cardInfo('demo-35:wordread0').answer,'shénme');
 assert.deepEqual([...cardsForLesson('demo-49')].sort(),[
  'demo-49:meaning','demo-49:reading','demo-49:sentence',
  'demo-49:word0','demo-49:word1','demo-49:wordread0',
 ]);
 assert.equal(cardInfo('demo-49:wordread0').answer,'fēnzhōng');
});

test('preservation: earlier corrections, grading and backup contracts are unchanged',()=>{
 // Prior pinyin and editorial corrections.
 const pinyinLesson=DEMO_LESSONS.find(l=>l.words.some(w=>w.hanzi==='修改稿'));
 assert.equal(pinyinLesson.words.find(w=>w.hanzi==='修改稿').pinyin,'xiūgǎigǎo');
 assert.ok(DEEP_NOTES['天'].join(' ').includes('The weather will be good tomorrow.'));
 assert.ok(DEEP_NOTES['人'].join(' ').includes('们'));
 assert.doesNotMatch(DEEP_NOTES['人'].join(' '),/do not change form for plural/);
 // Grading behavior.
 const state=addLesson(freshState(),'demo-35',1000);
 const good=gradeCard(state,'demo-35:meaning',2,1000,'ev-good',{correct:true,assisted:false});
 assert.equal(good.cards['demo-35:meaning'].due,1000+3*86400000);
 assert.throws(()=>gradeCard(state,'demo-35:meaning',2,1000,'ev-bad',{correct:false,assisted:false}),/passing credit/);
 // Backup and storage contracts.
 assert.doesNotThrow(()=>validateState(state));
 const doc=backupDocument(state);
 assert.equal(doc.format,'character-study-demo-backup');
 assert.equal(doc.formatVersion,1);
 assert.equal(doc.origin,'original-editorial-demo');
 const restored=importBackup(doc);
 assert.deepEqual(restored.learned,state.learned);
});
