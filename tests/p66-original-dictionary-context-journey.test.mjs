import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORDS} from '../src/lexicon.mjs';
import {STORIES} from '../src/stories.mjs';
import {SENTENCE_LIBRARY} from '../src/sentence-library.mjs';
import {freshState} from '../src/study.mjs';
import {sourceWordUsage,sourceWordCoverage} from '../src/source-bridges-c9.mjs';
import {c9WordCatalogResults,renderC9VocabularyLibrary,C9_WORD_CONTEXT_FILTERS} from '../src/libraries-c9.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,classes='',attrs='')=>'<button type="button" data-action="'+esc(name)+'" '+attrs+'>'+label+'</button>';

test('P66 canonical Wordbook has separate original sentence and passage coverage, no guessed HSK or sense credit',()=>{
 assert.deepEqual([...C9_WORD_CONTEXT_FILTERS],['all','sentence','story','lexical-only']);
 const example=WORDS.find(w=>sourceWordCoverage(w.key).stories>0&&sourceWordCoverage(w.key).sentences>0);
 assert.ok(example,'At least one original indexed word occurs in an authored sentence and reading');
 const evidence=sourceWordCoverage(example.key);
 assert.equal(evidence.sentences,SENTENCE_LIBRARY.filter(x=>x.hanzi.includes(example.hanzi)).length);
 assert.equal(evidence.stories,STORIES.flatMap(x=>x.lines).filter(x=>x.hanzi.includes(example.hanzi)).length);
 assert.equal(evidence.examples,example.examples.length);
 assert.deepEqual(sourceWordCoverage('noncanonical-word-id'),{sentences:0,stories:0,examples:0});
});

test('P66 authored source contexts preserve all canonical identities for duplicate Chinese surfaces',()=>{
 const example=WORDS.find(w=>sourceWordCoverage(w.key).stories>0&&sourceWordCoverage(w.key).sentences>0);
 assert.ok(example);
 const rows=sourceWordUsage(example.key,{limit:20});
 assert.ok(rows.length);
 assert.equal(new Set(rows.map(x=>x.hanzi)).size,rows.length);
 assert.ok(rows.some(r=>r.links.some(l=>l.sourceType==='sentence')));
 assert.ok(rows.some(r=>r.links.some(l=>l.sourceType==='story')));
 for(const row of rows){
  assert.ok(Object.isFrozen(row)&&Object.isFrozen(row.links));
  assert.ok(row.hanzi.includes(example.hanzi));
  assert.equal(row.claim,'Exact written-form occurrence; lexical sense in context is not independently verified');
  for(const link of row.links){
   if(link.sourceType==='sentence'){
    const s=SENTENCE_LIBRARY.find(x=>x.id===link.sourceId);
    assert.ok(s&&s.hanzi===row.hanzi);
   }else if(link.sourceType==='story'){
    const s=STORIES.find(x=>x.id===link.sourceId);
    assert.ok(s&&s.lines[link.lineIndex]?.hanzi===row.hanzi);
   }else{
    assert.equal(link.sourceType,'word');assert.equal(link.sourceId,example.key);
    assert.ok(example.examples.some(x=>x.hanzi===row.hanzi));
   }
  }
 }
});

test('P66 source-filtered Wordbook has native exact line actions and keeps grading private',()=>{
 const word=WORDS.find(w=>sourceWordCoverage(w.key).stories>0);
 assert.ok(word);
 const state=freshState();state.bookmarkedWords.push(word.key);
 const snapshot=JSON.stringify(state);
 const html=c9WordCatalogResults(state,{filter:'saved',context:'story'},act,esc);
 assert.ok(html.includes('c9-word-evidence-actions'));
 assert.ok(html.includes('data-action="c9-source-open-story-line"'));
 assert.ok(html.includes('data-index="'));
 assert.ok(html.includes('Written-form evidence:'));
 assert.ok(!html.includes('Official HSK completion'));
 assert.equal(JSON.stringify(state),snapshot);
 const complete=renderC9VocabularyLibrary(state,{query:'',filter:'saved',context:'story',page:0},act,esc);
 assert.ok(complete.includes('id="c9-word-context"'));
 assert.ok(complete.includes('value="story" selected'));
 assert.ok(complete.includes('</select></label></div>'));
});

test('P66 original dictionary-to-passage action keeps canonical unanswered-response and original reader writer',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const a=app.indexOf("if(name==='c9-source-open-story-line')");
 const b=app.indexOf("if(name==='c9-media-open-story')",a);
 assert.ok(a>0&&b>a);
 const handler=app.slice(a,b);
 for(const required of ['findStory(id)','Number(button.dataset.index)','c9-media-open-story',
  'storyFocusIndex=index','paragraphFor(target,index)','data-c9-story-line','No learning answer recorded'])
  assert.ok(handler.includes(required),required);
 assert.ok(!handler.includes('addReadingEvent('));
 assert.ok(app.includes("if(e.target.id==='c9-word-context')"));
 assert.ok(app.includes("c9WordContext='all'"));
 assert.ok(app.includes("const assisted=storyAssist||name==='story-skip'"));
});

test('Original context bridge never writes grades, Account data or arbitrary text into canonical source',()=>{
 const source=readFileSync(new URL('../src/source-bridges-c9.mjs',import.meta.url),'utf8');
 for(const forbidden of ['indexedDB','localStorage','fetch(','addReadingEvent(','addSentenceEvent(','gradeCard('])
  assert.ok(!source.includes(forbidden),'Source projector must not call '+forbidden);
});
