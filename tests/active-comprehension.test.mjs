// Active comprehension regression suite: the Everyday reading series and the
// listening-first drills are accurate, integrated into existing catalogs and
// workflows, and preserve all prior learner-facing data and identities.
import test from 'node:test';
import assert from 'node:assert/strict';
import { STORIES } from '../src/stories.mjs';
import { BEGINNER_READING_COUNT } from '../src/beginner-reading-content.mjs';
import { EVERYDAY_READINGS,EVERYDAY_READING_ROWS } from '../src/everyday-readings.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';
import { DIALOGUES } from '../src/dialogues.mjs';
import { GRAMMAR_LESSONS,findGrammarLesson } from '../src/grammar-course.mjs';
import { WORDS } from '../src/lexicon.mjs';
import { DRILL_MODES,buildDrill,gradeDrill,validateDrills } from '../src/drills.mjs';
import * as spokenReadings from '../src/spoken-readings.mjs';
import { parsePinyin,evaluatePinyin } from '../src/exercises.mjs';

const clean=p=>String(p).replace(/[^\p{L}\p{N}\s'’\-·]/gu,' ');
const parseable=p=>parsePinyin(clean(p));
// Characters taught in context by the everyday readings beyond the existing
// corpus and the everyday vocabulary pack (shared 挺 with the dialogue pack).
const NEW_CHARS=new Set(['凉','姑','娘','拉','挺','捡','摄','敲','智','滤','炖','烤','脏','脚','街','铃','频','飘']);

test('everyday readings: twelve narratives with aligned pinyin and real evidence questions',()=>{
 assert.equal(EVERYDAY_READINGS.length,12);
 for(const r of EVERYDAY_READINGS){
  const [title,theme,purpose,level,lines,questions,order,cloze,writing,grammar,word]=r;
  assert.ok(title&&theme&&purpose&&Number.isInteger(level),title+' metadata');
  assert.equal(lines.length,6,title+' lines');
  for(const [hanzi,pinyin,english] of lines){
   assert.ok(hanzi&&pinyin&&english,title+' line fields');
   const parsed=parseable(pinyin);
   assert.ok(parsed,title+' pinyin parses: '+pinyin);
   const chars=(hanzi.match(/[\u4e00-\u9fff]/g)||[]).length;
   const erhua=(hanzi.match(/儿/g)||[]).length;
   assert.ok(parsed.length===chars||parsed.length===chars-erhua,title+' syllable/character alignment: '+hanzi);
  }
  assert.equal(questions.length,3,title+' questions');
  for(const q of questions){
   assert.equal(q.length,7,title+' question fields');
   assert.ok(q.slice(1,5).includes(q[1]),title+' answer among options');
   assert.equal(new Set(q.slice(1,5)).size,4,title+' options distinct');
   assert.ok(Number.isInteger(q[5])&&q[5]>=0&&q[5]<lines.length,title+' evidence line');
   assert.ok(q[6],title+' explanation');
  }
  assert.ok(lines.some(l=>l[0]===order.join('')),title+' order chunks rebuild a line');
  assert.ok(lines[cloze[0]]&&lines[cloze[0]][0].includes(cloze[1]),title+' cloze answer sits in its line');
  assert.ok(cloze[1]!==cloze[2]&&new Set(cloze.slice(1)).size===4,title+' cloze options distinct');
  assert.equal(writing.length,5,title+' writing fields');
  assert.ok(parseable(writing[2]),title+' writing pinyin parses');
  for(const g of grammar)assert.ok(findGrammarLesson(g),title+' grammar id resolves: '+g);
  assert.ok(word.length===3&&word[0]&&word[1]&&word[2],title+' focus word');
 }
});

test('everyday readings: catalog integration keeps historical story identities',()=>{
 assert.equal(STORIES.length,176);
 assert.deepEqual(STORIES.slice(164).map(s=>s.id),Array.from({length:12},(_,i)=>'story-'+String(165+i).padStart(2,'0')));
 for(const s of STORIES.slice(164)){
  assert.equal(s.origin,'original-everyday-reading',s.id+' origin');
  assert.equal(s.officialHskLevel,null,s.id+' no HSK claims');
  assert.ok(s.beginner&&s.beginner.questions.length===3,s.id+' reading questions');
  assert.ok(s.beginner.writing&&s.beginner.grammarIds.length===3&&s.beginner.focusWord,s.id+' study fields');
  assert.equal(s.beginner.source,'original-everyday-reading',s.id+' source label');
  assert.ok(s.beginner.grade.includes('not official HSK'),s.id+' honest grade label');
 }
 assert.equal(STORIES[0].id,'story-01');
 assert.equal(STORIES[163].title,'The internship notice and actual contract');
 assert.equal(BEGINNER_READING_COUNT,126,'historical beginner adapter count unchanged');
 assert.ok(!STORIES.some(s=>EVERYDAY_READINGS.some(r=>r[0]===s.title)&&s.origin!=='original-everyday-reading'));
 assert.equal(new Set(STORIES.map(s=>s.title)).size,176,'story titles unique');
});

test('everyday readings: characters are corpus-traceable or declared new',()=>{
 const corpus=new Set();
 for(const w of WORDS)for(const c of w.hanzi)corpus.add(c);
 for(const l of DEMO_LESSONS){corpus.add(l.hanzi);for(const w of l.words)for(const c of w.hanzi)corpus.add(c);
  for(const c of l.sentence.hanzi)corpus.add(c);if(l.extraSentence)for(const c of l.extraSentence.hanzi)corpus.add(c);}
 for(const s of STORIES.slice(0,164))for(const line of s.lines)for(const c of line.hanzi)corpus.add(c);
 for(const d of DIALOGUES)for(const l of d.lines)for(const c of l.hanzi)corpus.add(c);
 const text=EVERYDAY_READINGS.map(r=>r[4].map(l=>l[0]).join('')+r[5].flat().join('')+r[7].slice(1).join('')+r[8].join('')).join('');
 for(const ch of text.match(/[\u4e00-\u9fff]/g)||[]){
  assert.ok(corpus.has(ch)||NEW_CHARS.has(ch),'untraceable character in reading series: '+ch);
 }
});

test('listening drills: three audio-first modes build and grade correctly',()=>{
 assert.deepEqual(DRILL_MODES,['recognition','word-meaning','word-pinyin','word-build','sentence-cloze','reading-choice','listen-meaning','listen-pinyin','tone-ear','sound-family','radical-clue']);
 assert.equal(validateDrills(),true);
 const meaning=buildDrill('demo-01','listen-meaning');
 assert.equal(meaning.kind,'choice');
 assert.equal(meaning.speak,'我');
 assert.ok(!('hanzi' in meaning),'audio-first prompts hide the text');
 assert.ok(meaning.options.includes(meaning.answer)&&new Set(meaning.options).size===4);
 const dictation=buildDrill('demo-02','listen-pinyin');
 assert.equal(dictation.kind,'pinyin');
 assert.equal(dictation.answer,'nǐ');
 assert.equal(dictation.speak,'你');
 const tone=buildDrill('demo-01','tone-ear');
 assert.equal(tone.answer,'Third tone');
 assert.ok(new Set(tone.options).size===4&&tone.options.includes('Third tone'));
 assert.equal(buildDrill('demo-24','tone-ear').answer,'Fourth tone');
 assert.equal(gradeDrill(dictation,'ni3').correct,true);
 assert.equal(gradeDrill(dictation,'ní').correct,false,'wrong tone still fails');
 assert.equal(gradeDrill(tone,'Third tone').correct,true);
 assert.equal(gradeDrill(tone,'First tone').correct,false);
});

test('listening drills: tone coverage spans the whole lesson corpus',()=>{
 for(const l of DEMO_LESSONS){
  const d=buildDrill(l.id,'tone-ear');
  const parsed=parsePinyin(l.pinyin);
  const expected={1:'First tone',2:'Second tone',3:'Third tone',4:'Fourth tone',5:'Neutral tone'}[parsed[0].tone];
  assert.equal(d.answer,expected,l.id+' tone target');
 }
});

test('listening drills: ambiguous isolated readings speak a disambiguating word',()=>{
 const huan=buildDrill('demo-253','tone-ear');
 assert.equal(huan.speak,'还书','还 huán must not be spoken in isolation (TTS says hái)');
 assert.equal(huan.answer,'Second tone');
 assert.ok(huan.prompt.includes('first syllable'));
 const dictation=buildDrill('demo-253','listen-pinyin');
 assert.equal(dictation.speak,'还书');
 assert.equal(dictation.answer,'huán shū','dictation target is the spoken word, not the bare character');
 const de=buildDrill('demo-78','tone-ear');
 assert.equal(de.speak,'我的','的 must be heard in context');
 assert.ok(de.prompt.includes('second syllable'));
 assert.equal(de.answer,'Neutral tone');
 const jue=buildDrill('demo-93','listen-pinyin');
 assert.equal(jue.speak,'觉得','觉 jué must be heard in a word');
 const meMeaning=buildDrill('demo-36','listen-meaning');
 assert.equal(meMeaning.speak,'什么');
 assert.equal(meMeaning.answer,'what');
 const safe=buildDrill('demo-02','listen-pinyin');
 assert.equal(safe.speak,'你','safe characters stay isolated and short');
 assert.equal(safe.answer,'nǐ');
});

test('listening drills: the spoken syllable under test always matches the taught reading',()=>{
 const {isolatedReadingUnsafe}=spokenReadings;
 for(const l of DEMO_LESSONS){
  const d=buildDrill(l.id,'tone-ear');
  const taught=parsePinyin(l.pinyin)[0];
  if(isolatedReadingUnsafe(l.hanzi,taught.tone)){
   const spoken=parsePinyin(d.spokenPinyin);
   assert.ok(spoken.length>1,l.id+' unsafe reading should speak a word context');
   const target=spoken[d.toneIndex??0];
   assert.equal(target.syllable,taught.syllable,l.id+' spoken syllable matches taught syllable');
   assert.equal(target.tone,taught.tone,l.id+' spoken tone matches taught tone');
  }else{
   assert.equal(d.speak,l.hanzi,l.id+' safe reading speaks the character alone');
  }
 }
});

test('listening drills: polyphone table flags the known misleading cases',()=>{
 assert.ok(spokenReadings.POLYPHONE_READINGS['还'].includes('hái'));
 assert.ok(spokenReadings.POLYPHONE_READINGS['调'].includes('diào'));
 assert.ok(spokenReadings.isolatedReadingUnsafe('了',5));
 assert.equal(spokenReadings.isolatedReadingUnsafe('你',3),false);
});

test('preservation: core catalogs and learner identities are untouched',()=>{
 assert.equal(DEMO_LESSONS.length,428);
 assert.equal(DIALOGUES.length,202);
 assert.equal(GRAMMAR_LESSONS.length,190);
 assert.equal(WORDS.length,1130,'reviewed lexicon total with everyday focus words merged');
 const fengjing=WORDS.find(w=>w.hanzi==='风景');
 assert.ok(fengjing&&fengjing.senses.includes('scenery; view')&&fengjing.source.includes('everyday'));
 assert.ok(evaluatePinyin('ni3','nǐ').correct,'pinyin grading unchanged');
});
