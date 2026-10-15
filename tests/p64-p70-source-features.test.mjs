import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {DEEP_NOTES} from '../src/lesson-guides.mjs';
import {WORDS,findWord,sourceWordComparisons} from '../src/lexicon.mjs';
import {freshState} from '../src/study.mjs';
import {SENTENCE_LIBRARY,sentencePracticeId} from '../src/sentence-library.mjs';
import {STORIES} from '../src/stories.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {c9TypingRecommendations,renderC9TypingPath,c9WordCatalogResults} from '../src/libraries-c9.mjs';
import {renderC9PersonalTextReader,c9ReadingRecommendations,renderC9ReadingContinuation} from '../src/media-c9.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const act=(name,label,cls='',props='')=>'<button data-action="'+esc(name)+'" class="'+esc(cls)+'" '+props+'>'+label+'</button>';

test('P65–P66 canonical vocabulary comparisons retain original keys, exact pinyin, source examples and honest relationships',()=>{
 assert.ok(WORDS.length>0);
 let found=0;
 for(const w of WORDS.slice(0,180)){
  const comparisons=sourceWordComparisons(w.key,{limit:3});
  assert.ok(comparisons.length<=3);
  assert.equal(new Set(comparisons.map(c=>c.word.key)).size,comparisons.length);
  for(const c of comparisons){
   found++;
   assert.equal(findWord(c.word.key),c.word);
   assert.notEqual(c.word.key,w.key);
   assert.ok(c.word.source);
   assert.ok(['Same written form, different indexed reading',
     'Same indexed pinyin, different written word',
     'Shared written component; different whole-word entry'].includes(c.relation));
   if(c.comparisonEvidence)assert.ok(c.word.examples.includes(c.comparisonEvidence));
  }
 }
 assert.ok(found>0,'Expect some source-grounded whole-word neighbors');
 assert.deepEqual(sourceWordComparisons('absent-key'),[]);
});

test('P65 authored character contrasts do not fabricate radicals or visual confusables',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const source=DEMO_LESSONS.find(l=>DEEP_NOTES[l.hanzi]&&DEEP_NOTES[l.hanzi][2]);
 assert.ok(source);
 const html=renderC9CharacterStudy({lesson:source,state,act,esc});
 assert.ok(html.includes('P65 · ORIGINAL AUTHOR COMPARISON'));
 assert.ok(html.includes(esc(DEEP_NOTES[source.hanzi][2])));
 assert.ok(html.includes('does not assert visually confusable forms'));
 assert.equal(JSON.stringify(state),before);
});

test('P66 word library displays canonical contrasted words without new grading events',()=>{
 const source=WORDS.find(w=>sourceWordComparisons(w.key).length>0);
 assert.ok(source,'An existing word must have a source-backed comparison');
 const state=freshState();state.bookmarkedWords.push(source.key);
 const before=JSON.stringify(state);
 const html=c9WordCatalogResults(state,{query:'',filter:'saved',page:0},act,esc);
 assert.ok(html.includes('c9-word-contrast'));
 assert.ok(html.includes('Compare original written words and readings'));
 assert.ok(html.includes('data-action="c9-word-open"'));
 assert.equal(JSON.stringify(state),before);
});

test('P67–P68 reading continuation prioritizes genuine wrong/assisted source evidence without inventing levels',()=>{
 assert.ok(STORIES.length>4);
 const state=freshState(),miss=STORIES[3];
 const current=state.readingEvents||[];
 current.push({id:'synthetic-reading',storyId:miss.id,mode:'comprehension',correct:false,assisted:false});
 const before=JSON.stringify(state),items=c9ReadingRecommendations(state,{limit:4});
 assert.equal(items.length,4);
 assert.equal(items[0].story.id,miss.id,'Actual unresolved attempt appears first');
 const html=renderC9ReadingContinuation(state,STORIES[0].id,act,esc);
 assert.ok(html.includes(miss.title));
 assert.ok(html.includes('data-action="c9-media-open-story"'));
 assert.ok(html.includes('No estimated level, proficiency claim'));
 assert.equal(JSON.stringify(state),before,'Reading discovery must not record new evidence');
});

test('P70 recommendations derive ONLY from original production sentenceEvents and prioritize retry',()=>{
 const first=SENTENCE_LIBRARY[0],second=SENTENCE_LIBRARY[1];
 assert.ok(first&&second);
 const state=freshState(),initial=JSON.stringify(state);
 assert.equal(c9TypingRecommendations(state,{limit:6}).length,6);
 assert.equal(c9TypingRecommendations(state,{limit:6})[0].sentence.id,first.id);
 state.sentenceEvents.push({id:'e1',taskId:sentencePracticeId(second.id,'production'),
  correct:false,assisted:false,at:Date.now()});
 assert.equal(c9TypingRecommendations(state,{limit:6})[0].sentence.id,second.id);
 const html=renderC9TypingPath(state,act,esc);
 assert.ok(html.includes('c9-typing-start'));
 assert.ok(html.includes('Type Mandarin from meaning'));
 assert.ok(html.includes('Needs independent retry'));
 assert.ok(!html.includes('Official HSK completion'));
 assert.ok(initial.includes('"sentenceEvents":[]'));
});

test('P70 typed production handoff uses original sentence focus and grading writer, not another engine',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const start=app.indexOf("if(name==='c9-typing-start')"),end=app.indexOf("if(name==='sentence-select')",start);
 assert.ok(start>=0&&end>start);
 const handler=app.slice(start,end);
 for(const text of ["openLibrarySentence(id)","libraryMode='production'","libraryPracticeFocus=true",
   "libraryAssisted=false","libraryShowPinyin=false","libraryTyped=''"])
  assert.ok(handler.includes(text),text);
 assert.ok(app.includes('checkSentence(q.task,response)'));
 assert.ok(app.includes('addSentenceEvent(prev,'));
});

test('P69 private reader source links and word save are native, not user-text imports into source',()=>{
 const src=readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8');
 const feature=src.slice(src.indexOf('/* P69 original-roadmap personal reading:'));
 for(const keyword of ['tokenizeSentence(line)','SENTENCE_LIBRARY.find(s=>s.hanzi===line)',
   'personalReaderMined','data-action="word-bookmark"','data-action="sentence-select"',
   'navigator.clipboard.writeText'])
  assert.ok(feature.includes(keyword),keyword);
 for(const forbidden of ['indexedDB','localStorage','addSentenceEvent(','gradeCard('])
  assert.ok(!feature.includes(forbidden),forbidden);
 const html=renderC9PersonalTextReader(esc,freshState());
 assert.ok(html.includes('c9-personal-input'));
 assert.ok(html.includes('Nothing is sent to the server'));
});
