import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {WORDS,findWord} from '../src/lexicon.mjs';
import {STORIES,findStory} from '../src/stories.mjs';
import {SENTENCE_LIBRARY} from '../src/sentence-library.mjs';
import {freshState} from '../src/study.mjs';
import {sourceWordContextPairs,sourceCharacterContextTrails,sourceReadingCrossContexts} from '../src/source-bridges-c9.mjs';
import {renderC9ReadingHub} from '../src/media-c9.mjs';
import {renderC9CharacterStudy} from '../src/character-c9.mjs';
import {c9WordCatalogResults} from '../src/libraries-c9.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const act=(name,label,cls='',attrs='')=>'<button data-action="'+esc(name)+'" '+attrs+'>'+label+'</button>';
const originalLink=link=>link.sourceType==='sentence'?
 SENTENCE_LIBRARY.some(s=>s.id===link.sourceId):
 link.sourceType==='story'&&Boolean(findStory(link.sourceId)?.lines[link.lineIndex]);
test('P66 context pairs derive two DISTINCT authored sentence/passage sources and valid canonical IDs',()=>{
 const word=WORDS.find(w=>sourceWordContextPairs(w.key,{limit:1}).length);
 assert.ok(word,'at least one real original word has two differing native source contexts');
 const pairs=sourceWordContextPairs(word.key,{limit:3});
 assert.ok(pairs.length>0&&pairs.length<=3);
 for(const p of pairs){
  assert.equal(p.wordKey,word.key);
  assert.ok(p.first.hanzi.includes(word.hanzi)&&p.second.hanzi.includes(word.hanzi));
  assert.notEqual(p.first.hanzi,p.second.hanzi);
  assert.ok(originalLink(p.firstLink)&&originalLink(p.secondLink));
 }
 assert.deepEqual(sourceWordContextPairs('unindexed-nonexistent'),[]);
 const html=c9WordCatalogResults(freshState(),{query:word.hanzi},act,esc);
 assert.match(html,/c9-source-context-pairs/);
 assert.match(html,/Study two original source contexts/);
 assert.match(html,/sentence-select|c9-source-open-story-line/);
});
test('P64 character trails contain only indexed whole words, authored lines, and source handoffs',()=>{
 const lesson=DEMO_LESSONS.find(l=>sourceCharacterContextTrails(l.id).length);
 assert.ok(lesson,'at least one original lesson has original whole-word context evidence');
 const trails=sourceCharacterContextTrails(lesson.id,{limit:4});
 const state=freshState(),snapshot=JSON.stringify(state);
 for(const path of trails){
  assert.equal(path.character,lesson.hanzi);
  assert.ok(path.wordHanzi.includes(lesson.hanzi));
  assert.equal(findWord(path.wordKey)?.hanzi,path.wordHanzi);
  assert.ok(path.source.hanzi.includes(path.wordHanzi));
  assert.ok(originalLink(path.link));
 }
 const html=renderC9CharacterStudy({lesson,state,act,esc});
 assert.match(html,/c9-character-context-trails/);
 assert.match(html,/Reveal authored sentence reference/);
 assert.equal(JSON.stringify(state),snapshot);
 assert.deepEqual(sourceCharacterContextTrails('unindexed-lesson'),[]);
});
test('P67–P68 reading paths retain exact source line and other-source identities, no new proficiency claim',()=>{
 const story=STORIES.find(s=>sourceReadingCrossContexts(s.id).length);
 assert.ok(story,'at least one original published passage has a word also found in another original context');
 const rows=sourceReadingCrossContexts(story.id,{limit:4});
 assert.ok(rows.length>0&&rows.length<=4);
 for(const p of rows){
  assert.equal(p.storyId,story.id);
  assert.equal(p.sourceLine.hanzi,story.lines[p.lineIndex].hanzi);
  assert.equal(findWord(p.wordKey)?.hanzi,p.wordHanzi);
  assert.ok(p.sourceLine.hanzi.includes(p.wordHanzi));
  assert.ok(p.counterpart.hanzi.includes(p.wordHanzi));
  assert.ok(originalLink(p.link));
  assert.ok(!p.claim.includes('certified'));
 }
 assert.deepEqual(sourceReadingCrossContexts('missing-story'),[]);
 const state=freshState(),snapshot=JSON.stringify(state);
 const hidden=renderC9ReadingHub(state,story,act,esc,{sourceHelpRevealed:false});
 const shown=renderC9ReadingHub(state,story,act,esc,{sourceHelpRevealed:true});
 assert.match(hidden,/c9-cross-source-reading/);
 assert.match(hidden,/Reveal bilingual source evidence/);
 assert.doesNotMatch(hidden,/c9-cross-reading-reference/);
 assert.match(shown,/c9-cross-reading-reference/);
 assert.match(shown,/Original source help is open/);
 assert.equal(JSON.stringify(state),snapshot);
});
