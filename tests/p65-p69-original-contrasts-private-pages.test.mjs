import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {WORDS} from '../src/lexicon.mjs';
import {SENTENCE_LIBRARY} from '../src/sentence-library.mjs';
import {STORIES} from '../src/stories.mjs';
import {freshState} from '../src/study.mjs';
import {sourceCharacterComparisonSet} from '../src/source-bridges-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {renderC9PersonalTextReader} from '../src/media-c9.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',extra='')=>'<button data-action="'+esc(name)+'" '+extra+'>'+label+'</button>';

test('P65 original character comparison derives real lesson pronunciations, words and source sentences only',()=>{
 const lesson=DEMO_LESSONS.find(x=>sourceCharacterComparisonSet(x.id).length);
 assert.ok(lesson,'At least one original source character comparison must exist');
 const before=JSON.stringify(lesson),rows=sourceCharacterComparisonSet(lesson.id,{limit:5});
 assert.ok(rows.length>0&&rows.length<=5);
 for(const item of rows){
  assert.ok(DEMO_LESSONS.includes(item.lesson)&&item.lesson.id!==lesson.id);
  assert.equal(item.sample.hanzi,item.lesson.sentence.hanzi);
  assert.equal(item.sample.english,item.lesson.sentence.english);
  assert.ok(['Same indexed Pinyin','Same Pinyin letters, different recorded tone','Both appear in an indexed whole word'].includes(item.relation));
  for(const word of item.words){
   assert.ok(WORDS.some(w=>w.key===word.key));
   assert.ok(word.hanzi.includes(lesson.hanzi)&&word.hanzi.includes(item.lesson.hanzi));
  }
 }
 assert.equal(JSON.stringify(lesson),before);
 assert.deepEqual(sourceCharacterComparisonSet('fake-original-id'),[]);
});
test('P65 original self-check is reveal-based, ungraded and routed to original characters',()=>{
 const lesson=DEMO_LESSONS.find(x=>sourceCharacterComparisonSet(x.id).length);
 assert.ok(lesson);
 const state=freshState(),snapshot=JSON.stringify(state);
 const html=renderC9CharacterStudy({lesson,state,act,esc});
 assert.ok(html.includes('c9-character-source-comparisons'));
 assert.ok(html.includes('Reveal original source meanings and readings'));
 assert.ok(html.includes('c9-character-compare-pair'));
 assert.ok(html.includes(esc(lesson.sentence.hanzi)));
 assert.ok(html.includes('data-action="c9-character-open"'));
 assert.ok(html.includes('no StudyEvent')&&html.includes('not validated visual confusables'));
 assert.equal(JSON.stringify(state),snapshot);
});
test('P69 source-linked private reader offers page browsing and exact authored reader handoffs',()=>{
 const src=readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8');
 for(const marker of [
  'PERSONAL_READER_PAGE_SIZE=12','personalReaderPage*PERSONAL_READER_PAGE_SIZE',
  'data-personal-page="1"','data-personal-page="-1"',
  'personalLines(personalReaderAnalyzed)[Number(mine.dataset.personalMine)]',
  "text.hanzi===line", "data-action=\"c9-source-open-story-line\"",
  'id="c9-personal-copy-study"','sourceNotes',
  'Exact original sentence IDs:', 'Exact original reading:',
  'if(next!==personalReaderAnalyzed&&(personalReaderMined.length||personalRecallDraft.trim())',
  "if(next!==personalReaderAnalyzed){personalReaderMined=[];personalReaderPage=0;personalRecallIndex=-1;"
 ])assert.ok(src.includes(marker),marker);
 assert.ok(STORIES.some(story=>story.lines.some(line=>line.hanzi)));
 assert.ok(SENTENCE_LIBRARY.some(s=>s.hanzi));
 const html=renderC9PersonalTextReader(esc,freshState());
 assert.ok(html.includes('up to 1200 characters'));
 assert.ok(html.includes('browsable pages of 12'));
 const privateSource=src.slice(src.indexOf('/* P69 original-roadmap personal reading:'));
 for(const bad of ['localStorage','indexedDB','fetch(','addReadingEvent(','addSentenceEvent('])
  assert.ok(!privateSource.includes(bad),'private text must remain local: '+bad);
});
