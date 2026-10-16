import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORDS,findWord} from '../src/lexicon.mjs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES} from '../src/stories.mjs';
import {freshState} from '../src/study.mjs';
import {sourceWordUsage,sourceCharacterLinks,originalStoryWordSupport} from '../src/source-bridges-c9.mjs';
import {c9WordCatalogResults} from '../src/libraries-c9.mjs';
import {renderC9OriginalStoryWordSupport} from '../src/media-c9.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,cls='',attrs='')=>'<button type="button" data-action="'+esc(name)+'" class="'+esc(cls)+'" '+attrs+'>'+label+'</button>';

test('P66 word provenance links only authentic original word, sentence or story source IDs',()=>{
 const word=WORDS.find(w=>sourceWordUsage(w.key).some(r=>r.sourceType==='sentence'||r.sourceType==='story'));
 assert.ok(word,'At least one indexed word must occur in the original sentence or story catalog');
 const rows=sourceWordUsage(word.key,{limit:20});
 assert.ok(rows.length);
 assert.equal(new Set(rows.map(r=>r.hanzi)).size,rows.length);
 for(const row of rows){
  assert.ok(row.hanzi.includes(word.hanzi));
  assert.ok(row.pinyin&&row.english);
  assert.equal(row.claim,'Exact written-form occurrence; lexical sense in context is not independently verified');
  if(row.sourceType==='sentence')assert.match(row.sourceId,/^sent-\d{3}$/);
  if(row.sourceType==='story')assert.ok(STORIES.some(s=>s.id===row.sourceId&&s.lines[row.lineIndex]?.hanzi===row.hanzi));
  if(row.sourceType==='word')assert.equal(row.sourceId,word.key);
 }
 assert.deepEqual(sourceWordUsage('not-a-real-word'),[]);
});

test('P65 character associations are grounded only by canonical shared whole words',()=>{
 const pair=DEMO_LESSONS.find(l=>sourceCharacterLinks(l.id).length>0);
 assert.ok(pair,'At least one original character pair has an indexed shared word');
 const linked=sourceCharacterLinks(pair.id),ids=new Set();
 for(const item of linked){
  assert.ok(DEMO_LESSONS.includes(item.lesson));
  assert.notEqual(item.lesson.id,pair.id);
  assert.ok(!ids.has(item.lesson.id));ids.add(item.lesson.id);
  for(const word of item.words){
   assert.equal(findWord(word.key),word);
   assert.ok(word.hanzi.includes(pair.hanzi)&&word.hanzi.includes(item.lesson.hanzi));
   assert.ok(word.relatedLessonIds.includes(pair.id)&&word.relatedLessonIds.includes(item.lesson.id));
  }
 }
 assert.deepEqual(sourceCharacterLinks('demo-99999'),[]);
});

test('P66 native dictionary exposes source handoffs and refuses invented HSK/sense claims',()=>{
 const candidate=WORDS.find(w=>sourceWordUsage(w.key).some(r=>r.sourceType==='sentence'||r.sourceType==='story'));
 assert.ok(candidate);
 const state=freshState(),old=JSON.stringify(state);
 state.bookmarkedWords.push(candidate.key);
 const expected=JSON.stringify(state);
 const html=c9WordCatalogResults(state,{query:'',filter:'saved',page:0},act,esc);
 assert.ok(html.includes('c9-word-usage'));
 assert.ok(html.includes('source-owned examples and passages'));
 assert.ok(html.includes('data-action="sentence-select"')||html.includes('data-action="c9-media-open-story"'));
 assert.equal(JSON.stringify(state),expected);
 assert.notEqual(expected,old); // saved words in the fixture are explicit, not renderer mutations
});

test('P67/P68 reading source bridge never reveals a lexical sense before assistance',()=>{
 const story=STORIES.find(s=>originalStoryWordSupport(s.id,{}).length>0);
 assert.ok(story,'A source story must offer original whole-word learning links');
 const state=freshState(),old=JSON.stringify(state);
 const support=originalStoryWordSupport(story.id,state,{limit:24});
 assert.ok(support.length>0);
 assert.ok(support.every(x=>Number.isInteger(x.lineIndex)&&x.lineIndex>=0&&x.lineIndex<story.lines.length));
 const gated=renderC9OriginalStoryWordSupport(story,state,act,esc);
 assert.ok(gated.includes('c9-reading-vocabulary-help'));
 assert.ok(!gated.includes('data-action="word-bookmark"'));
 assert.ok(!gated.includes('data-action="lookup-word"'));
 const revealed=renderC9OriginalStoryWordSupport(story,state,act,esc,{revealed:true});
 const reviewed=renderC9OriginalStoryWordSupport(story,state,act,esc,{revealed:true,answered:true});
 assert.ok(reviewed.includes('Your previously recorded response and its independent/assisted status are unchanged.'));
 assert.ok(!reviewed.includes('current unsubmitted answer will be recorded as assisted.'));
 assert.ok(revealed.includes('c9-reading-vocabulary-caveat'));
 assert.ok(revealed.includes('data-action="lookup-word"'));
 assert.ok(revealed.includes('data-action="word-bookmark"')||revealed.includes('Multiple original readings'));
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes("if(name==='c9-reading-vocabulary-help')"));
 assert.ok(app.includes("storyAssist=true;"));
 assert.ok(app.includes("revealed:storyAssist||Boolean(storyResult)"));
 assert.ok(app.includes("const assisted=storyAssist||name==='story-skip'"));
 assert.equal(JSON.stringify(state),old);
});

test('New source module is a read-only projection; offline manifest caches it',()=>{
 const module=readFileSync(new URL('../src/source-bridges-c9.mjs',import.meta.url),'utf8');
 for(const forbidden of ['indexedDB','localStorage','fetch(','addReadingEvent(','addSentenceEvent(','gradeCard('])
  assert.ok(!module.includes(forbidden),'Source bridge cannot write through '+forbidden);
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 assert.ok(sw.includes("'./source-bridges-c9.mjs'"));
});
