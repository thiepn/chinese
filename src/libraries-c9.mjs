import {renderC9EmptyState} from './ui-c9.mjs';
/** C9-07: Read-only library discovery; original routes and writers own all study actions. */
import {WORDS,plain,sourceWordComparisons} from './lexicon.mjs';
import {sourceWordUsage,sourceWordCoverage,sourceWordContextPairs} from './source-bridges-c9.mjs';
import {GRAMMAR_CHAPTERS,GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY,SENTENCE_TOPICS,sentencePracticeId} from './sentence-library.mjs';

export const C9_WORD_FILTERS=Object.freeze(['all','saved','introduced','new']);
export const C9_WORD_CONTEXT_FILTERS=Object.freeze(['all','sentence','story','lexical-only']);
const count=(n,label)=>n+' '+label+(n===1?'':'s');
const pct=(done,total)=>total?Math.max(0,Math.min(100,Math.round(100*done/total))):0;
const heading=(type,name,desc)=>'<div class="c9-library-heading"><p class="c9-eyebrow">'+type+' · ORIGINAL SOURCE</p><h2>'+name+'</h2><p>'+desc+'</p></div>';
const metrics=(items)=>'<div class="c9-library-metrics">'+items.map(([value,label])=>'<div><strong>'+value+'</strong><span>'+label+'</span></div>').join('')+'</div>';
const bar=(done,total,label)=>'<div class="c9-library-bar"><div><span>'+label+'</span><strong>'+done+' / '+total+'</strong></div><div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+pct(done,total)+'%"></span></div></div>';
const paragraph=(text)=>'<p class="c9-library-disclaimer c9-unified-source-note">'+text+'</p>';
const PAGE=12;

export function c9WordCatalogResults(state,{query='',filter='all',context='all',page=0}={},act,esc){
 const saved=new Set(state.bookmarkedWords||[]),introduced=new Set(state.vocabularyIntroduced||[]);
 const term=plain(query),mode=C9_WORD_FILTERS.includes(filter)?filter:'all';
 const sourceContext=C9_WORD_CONTEXT_FILTERS.includes(context)?context:'all';
 const words=WORDS.filter(w=>
  (mode==='all'||(mode==='saved'?saved.has(w.key):mode==='introduced'?introduced.has(w.key):!introduced.has(w.key)))&&
  (sourceContext==='all'||(sourceContext==='sentence'?sourceWordCoverage(w.key).sentences>0:
    sourceContext==='story'?sourceWordCoverage(w.key).stories>0:
    sourceWordCoverage(w.key).sentences===0&&sourceWordCoverage(w.key).stories===0))&&
  (!term||[w.hanzi,w.pinyin,...w.senses,...w.collocations,...w.notes,...w.examples.flatMap(e=>[e.hanzi,e.pinyin,e.english])].some(v=>plain(v).includes(term))));
 const last=Math.max(0,Math.ceil(words.length/PAGE)-1);
 const current=Math.max(0,Math.min(last,Number.isInteger(page)?page:0));
 const results=words.slice(current*PAGE,(current+1)*PAGE);
 const header='<div class="c9-library-results-caption" role="status"><div><strong>'+count(words.length,'matching indexed word')+'</strong>'+
  '<span>Original source catalog · '+WORDS.length+' indexed words</span></div>'+
  '<div class="c9-library-result-commands"><span>Page '+(current+1)+' / '+(last+1)+'</span>'+
  act('c9-word-reset','Reset filters','c9-button c9-button--quiet c9-button--small')+'</div></div>';
 const cards=results.length?'<div class="c9-library-words">'+results.map(w=>{
  const intro=introduced.has(w.key),savedHere=saved.has(w.key);
  const comparisons=sourceWordComparisons(w.key,{limit:3});
  const usage=sourceWordUsage(w.key,{limit:5});
  const coverage=sourceWordCoverage(w.key);
  const contextPairs=sourceWordContextPairs(w.key,{limit:2});
  return '<article class="c9-library-word"><div class="c9-library-word-head"><div><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong>'+
   '<span class="c9-library-pinyin">'+esc(w.pinyin)+'</span></div><div class="c9-library-word-badges">'+
   '<span class="c9-badge'+(intro?' c9-badge--success':'')+'">'+(intro?'Introduced':'Not introduced')+'</span>'+
   (savedHere?'<span class="c9-badge">Saved</span>':'')+'</div></div>'+
   '<p class="c9-library-word-meaning">'+esc(w.senses.slice(0,3).join(' / '))+'</p>'+
   (w.collocations.length?'<div class="c9-library-collocations"><span class="c9-eyebrow">AUTHORED COMBINATIONS</span><div>'+
    w.collocations.slice(0,3).map(c=>'<span lang="zh-Hans">'+esc(c)+'</span>').join('')+'</div></div>':'')+
   (w.examples.length?'<div class="c9-library-word-example"><span class="c9-eyebrow">SOURCE SENTENCE</span>'+
    '<p lang="zh-Hans">'+esc(w.examples[0].hanzi)+'</p><span class="c9-library-pinyin">'+esc(w.examples[0].pinyin)+'</span>'+
    '<small>'+esc(w.examples[0].english)+'</small></div>':'<p class="c9-library-word-fallback">No indexed bilingual example is available.</p>')+
   '<div class="c9-library-word-actions">'+
   act('speak','Listen','c9-button c9-button--quiet c9-button--small','data-text="'+esc(w.hanzi)+'"')+
   act('c9-word-open','Full details','c9-button c9-button--secondary c9-button--small','data-id="'+esc(w.key)+'"')+
   act('vocabulary-start','Learn word →','c9-button c9-button--study c9-button--small','data-id="'+esc(w.key)+'"')+
   act('word-bookmark',savedHere?'Unsave':'Save','c9-button c9-button--quiet c9-button--small','data-id="'+esc(w.key)+'"')+
   '</div>'+
   '<p class="c9-word-coverage">Written-form evidence: '+coverage.sentences+' original sentence'+(coverage.sentences===1?'':'s')+
   ' · '+coverage.stories+' passage line'+(coverage.stories===1?'':'s')+
   ' · '+coverage.examples+' authored word example'+(coverage.examples===1?'':'s')+'</p>'+
   (contextPairs.length?'<details class="c9-source-context-pairs"><summary>Study two original source contexts · '+contextPairs.length+' comparison'+(contextPairs.length===1?'':'s')+'</summary>'+
    '<p>First compare the two original Chinese sentences yourself, then reveal their authored readings and full-sentence meanings. A matching written word does not establish an identical lexical sense.</p>'+
    contextPairs.map(({first,second,firstLink,secondLink})=>
     '<article><div class="c9-source-pair-grid">'+[first,second].map(row=>
      '<p lang="zh-Hans">'+esc(row.hanzi)+'</p>').join('')+'</div>'+
     '<details><summary>Reveal original Pinyin and bilingual context · ungraded</summary>'+
     [first,second].map(row=>'<div class="c9-source-pair-reference"><span>'+esc(row.pinyin)+'</span><small>'+esc(row.english)+'</small></div>').join('')+
     '</details><div class="c9-source-pair-actions">'+[firstLink,secondLink].map(link=>
      link?.sourceType==='sentence'?act('sentence-select','Open original sentence →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(link.sourceId)+'"'):
      link?.sourceType==='story'?act('c9-source-open-story-line','Open original passage line →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(link.sourceId)+'" data-index="'+link.lineIndex+'"'):'').join('')+
     '</div></article>').join('')+'</details>':'')+
   '<details class="c9-library-word-more"><summary>Original notes & more examples</summary><div>'+
   w.notes.slice(0,2).map(n=>'<p>'+esc(n)+'</p>').join('')+
   w.examples.slice(1,3).map(ex=>'<p><strong lang="zh-Hans">'+esc(ex.hanzi)+'</strong><small>'+esc(ex.pinyin)+' · '+esc(ex.english)+'</small></p>').join('')+
   '<small>Source: '+esc(w.source.replaceAll('-',' '))+' · '+w.lessonIds.length+' lesson references</small></div></details>'+
   (comparisons.length?'<details class="c9-word-contrast"><summary>Compare original written words and readings · '+comparisons.length+'</summary>'+
    '<p>These are index-supported spelling, pronunciation or component links, not evidence that characters look confusable or share meaning.</p>'+
    '<div class="c9-word-contrast-list">'+comparisons.map(({word:other,relation,comparisonEvidence})=>
     '<article><span class="c9-eyebrow">'+esc(relation)+'</span><strong lang="zh-Hans">'+esc(other.hanzi)+'</strong>'+
     '<span class="c9-library-pinyin">'+esc(other.pinyin)+'</span><p>'+esc(other.senses.slice(0,2).join(' / '))+'</p>'+
     (comparisonEvidence?'<small lang="zh-Hans">'+esc(comparisonEvidence.hanzi)+'</small>'+
       '<small>'+esc(comparisonEvidence.english)+'</small>':'<small>No authored example indexed for this word.</small>')+
     act('c9-word-open','Compare full source →','c9-button c9-button--secondary c9-button--small',
      'data-id="'+esc(other.key)+'"')+'</article>').join('')+'</div></details>':'')+
   (usage.length?'<details class="c9-word-usage"><summary>Where this written word appears · '+usage.length+' authored example'+(usage.length===1?'':'s')+'</summary>'+
    '<p>These are exact written-form matches in source-owned examples and passages. Matching writing does not automatically establish the same word sense or reading.</p>'+
    '<div class="c9-word-usage-list">'+usage.map(e=>'<article>'+
     '<span class="c9-eyebrow">'+esc(e.sourceType==='word'?'Original word record':e.sourceType==='story'?'Original reading · '+e.sourceTitle:'Original sentence · '+e.sourceTitle)+'</span>'+
     '<p lang="zh-Hans">'+esc(e.hanzi)+'</p>'+
     '<span class="c9-library-pinyin">'+esc(e.pinyin)+'</span><small>'+esc(e.english)+'</small>'+
     '<div class="c9-word-evidence-actions">'+e.links.map(link=>
      link.sourceType==='sentence'?act('sentence-select','Practise source sentence →',
       'c9-button c9-button--secondary c9-button--small','data-id="'+esc(link.sourceId)+'"'):
      link.sourceType==='story'?act('c9-source-open-story-line','Read exact passage line '+(link.lineIndex+1)+' →',
       'c9-button c9-button--secondary c9-button--small',
       'data-id="'+esc(link.sourceId)+'" data-index="'+link.lineIndex+'"'):'').join('')+'</div>'+
     '</article>').join('')+'</div></details>':'')+
   '</article>';
 }).join('')+'</div>':renderC9EmptyState('No matching words','Try another word, Pinyin spelling or meaning, or clear the filters.',
   act('c9-word-reset','Show all words','c9-button c9-button--secondary'));
 return header+cards+
 '<nav class="c9-library-pages" aria-label="Word catalog pages"><span>'+
 (words.length?(current*PAGE+1)+'–'+(current*PAGE+results.length):'0')+' of '+words.length+'</span>'+
 '<div class="c9-inline">'+act('c9-word-page','← Previous','c9-button c9-button--secondary c9-button--small','data-delta="-1" '+(current===0?'disabled':''))+
 act('c9-word-page','Next →','c9-button c9-button--secondary c9-button--small','data-delta="1" '+(current===last?'disabled':''))+'</div></nav>';
}
export function renderC9VocabularyLibrary(state,ui,act,esc){
 const saved=new Set(state.bookmarkedWords||[]),introduced=new Set(state.vocabularyIntroduced||[]);
 const journey=state.vocabularyJourney,active=journey&&WORDS.find(w=>w.key===journey.key);
 return '<section class="c9-library c9-library-vocabulary" aria-labelledby="c9-library-words-title">'+
 '<header class="c9-library-hero"><div><p class="c9-eyebrow">VOCABULARY · ORIGINAL SOURCE RECORDS</p>'+
 '<h2 id="c9-library-words-title">Words in context</h2><p>Search complete words, tones, meanings, collocations and authored bilingual examples. Save interesting words and practise with the existing Wordbook.</p></div>'+
 '<a href="#/explore" class="c9-button c9-button--secondary">Full word dictionary →</a></header>'+
 metrics([[WORDS.length,'Original indexed words'],[WORDS.filter(w=>saved.has(w.key)).length,'Saved for study'],
 [WORDS.filter(w=>introduced.has(w.key)).length,'Introduced words']])+
 (active?'<section class="c9-library-continuity" aria-label="Recover your Wordbook lesson"><div>'+
  '<span class="c9-eyebrow">RECOVER ORIGINAL STUDY</span><h3>Continue '+esc(active.hanzi)+' · '+esc(active.pinyin)+'</h3>'+
  '<p>'+esc(active.senses[0])+' · Step '+(journey.step+1)+' / 5, saved in your native vocabulary journey.</p></div>'+
  act('vocabulary-resume','Resume →','c9-button c9-button--study')+'</section>':'')+
 '<div class="c9-library-section-head"><div><h3>Find a useful word</h3>'+
 '<p>Filter source entries without altering lesson introduction or review data.</p></div>'+
 act('c9-word-reset','Reset filters','c9-button c9-button--quiet c9-button--small')+'</div>'+
 '<div class="c9-library-filters"><label for="c9-word-query">Search characters, Pinyin, meanings and examples'+
 '<input type="search" id="c9-word-query" class="c9-input" value="'+esc(ui.query)+'" placeholder="学校, xué, learn…" autocomplete="off" spellcheck="false"></label>'+
 '<label for="c9-word-status">Word status<select id="c9-word-status" class="c9-select">'+
 [['all','All indexed words'],['saved','Saved words'],['introduced','Introduced words'],['new','Not introduced']].map(([key,label])=>
  '<option value="'+key+'"'+(ui.filter===key?' selected':'')+'>'+label+'</option>').join('')+'</select></label>'+ 
 '<label for="c9-word-context">Original source evidence<select id="c9-word-context" class="c9-select">'+
 [['all','All source words'],['sentence','Occurs in original sentences'],['story','Occurs in original readings'],['lexical-only','No sentence or reading occurrence']].map(([key,label])=>
  '<option value="'+key+'"'+(ui.context===key?' selected':'')+'>'+label+'</option>').join('')+'</select></label></div>'+
 '<div id="c9-word-catalog" aria-live="polite">'+c9WordCatalogResults(state,ui,act,esc)+'</div>'+
 paragraph('Saving a word and answering supplementary word exercises never grant scheduled-review mastery or official HSK proficiency.')+'</section>';
}
export function renderC9GrammarDirectory(state,act,esc){
 const events=(state.sentenceEvents||[]).filter(e=>typeof e.taskId==='string'&&e.taskId.startsWith('grammar:'));
 const attempted=new Set(events.map(e=>e.taskId.split(':')[1]));
 const recent=[...events].reverse().map(e=>GRAMMAR_LESSONS.find(g=>g.id===e.taskId.split(':')[1])).find(Boolean);
 return '<section class="c9-library c9-library-grammar" aria-label="Grammar course discovery">'+
 heading('GRAMMAR','Grammar chapters','Open authored patterns, contrasts and misconception-aware lessons. The existing grammar player performs all exercises.')+
 metrics([[GRAMMAR_LESSONS.length,'Grammar lessons'],[GRAMMAR_CHAPTERS.length,'Chapters'],
 [events.filter(e=>e.correct&&!e.assisted).length,'Independent correct attempts']])+
 (recent?'<div class="c9-library-continuity"><div><p class="c9-eyebrow">RECENT ORIGINAL PRACTICE</p><h3>'+esc(recent.title)+'</h3><p>Continue the last practiced authored pattern. Attempts are not completion grades.</p></div>'+
 act('grammar-select','Reopen pattern →','c9-button c9-button--study','data-id="'+esc(recent.id)+'"')+'</div>':'')+
 '<div class="c9-library-section-head"><div><h3>Learn the original chapter patterns</h3><p>Read an example before choosing a native grammar lesson. Every authored lesson is available below.</p></div></div>'+
 '<div class="c9-library-chapters">'+GRAMMAR_CHAPTERS.map(ch=>{
  const entries=GRAMMAR_LESSONS.filter(g=>g.chapterNumber===ch.number);
  const seen=entries.filter(g=>attempted.has(g.id)).length;
  const next=entries.find(g=>!attempted.has(g.id))||entries[0];
  return '<article class="c9-library-chapter c9-unified-card"><div class="c9-library-tile-head"><span>'+String(ch.number).padStart(2,'0')+'</span><div><h3>'+esc(ch.name)+'</h3><small>'+count(entries.length,'authored lesson')+'</small></div></div>'+
   bar(seen,entries.length,'Lessons with a recorded practice attempt')+
   (next?'<section class="c9-library-grammar-preview"><p class="c9-eyebrow">NEXT ORIGINAL PATTERN</p><h4>'+esc(next.title)+'</h4><p>'+esc(next.pattern)+'</p>'+
     '<div class="c9-library-word-example"><p lang="zh-Hans">'+esc(next.examples[0].hanzi)+'</p><span class="c9-library-pinyin">'+esc(next.examples[0].pinyin)+'</span>'+
     '<small>'+esc(next.examples[0].english)+'</small></div><p class="c9-library-pitfall"><strong>Common confusion:</strong> '+esc(next.pitfall)+'</p></section>':'')+
   '<details class="c9-library-chapter-lessons"><summary>All '+entries.length+' lessons</summary><div class="c9-library-links">'+
     entries.map(g=>act('grammar-select','<strong>'+esc(g.title)+'</strong><small>'+esc(g.pattern)+'</small>','c9-library-text-button','data-id="'+esc(g.id)+'"')).join('')+
     '</div></details>'+
   (next?act('grammar-select','Open '+esc(next.title)+' →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
   '</article>';
 }).join('')+'</div>'+
 paragraph('An attempted lesson is not a completed lesson; independent answers are original sentence-event evidence, not a calculated mastery score.')+'</section>';
}

/** P70: no duplicate typing grader or exercise store. These original
 * production task IDs already belong to Sentence Library's assessment engine.
 * Status is evidence from its existing sentenceEvents only. */

export const C9_TYPING_FILTERS=Object.freeze(['all','retry','unattempted','independent']);
export const C9_TYPING_PAGE_SIZE=6;
/** Lightweight read-only derivation of original production evidence. */
export function c9TypingCatalog(state,{topic='all',status='all',page=0}={}){
 const current=new Map();
 const independent=new Set();
 let totalAttempts=0;
 for(const event of state.sentenceEvents||[]){
  if(typeof event.taskId!=='string'||!event.taskId.startsWith('context:')||!event.taskId.endsWith(':production'))continue;
  totalAttempts++;
  current.set(event.taskId,event);
  if(event.correct&&!event.assisted)independent.add(event.taskId);
 }
 const selectedTopic=topic==='all'||SENTENCE_TOPICS.some(t=>t.id===topic)?topic:'all';
 const selectedStatus=C9_TYPING_FILTERS.includes(status)?status:'all';
 const all=SENTENCE_LIBRARY.filter(s=>selectedTopic==='all'||s.topicId===selectedTopic).map(sentence=>{
  const taskId=sentencePracticeId(sentence.id,'production');
  const last=current.get(taskId)||null;
  const stage=!last?'unattempted':last.correct&&!last.assisted?'independent':'retry';
  const priority=stage==='retry'?0:stage==='unattempted'?1:2;
  return {sentence,last,stage,priority,everIndependent:independent.has(taskId)};
 });
 const counts=Object.freeze({
  all:all.length,retry:all.filter(x=>x.stage==='retry').length,
  unattempted:all.filter(x=>x.stage==='unattempted').length,
  independent:all.filter(x=>x.stage==='independent').length
 });
 const filtered=all.filter(x=>selectedStatus==='all'||x.stage===selectedStatus)
  .sort((a,b)=>a.priority-b.priority||a.sentence.id.localeCompare(b.sentence.id));
 const pages=Math.max(1,Math.ceil(filtered.length/C9_TYPING_PAGE_SIZE));
 const currentPage=Math.min(pages-1,Math.max(0,Number.isInteger(page)?page:0));
 return {items:filtered.slice(currentPage*C9_TYPING_PAGE_SIZE,(currentPage+1)*C9_TYPING_PAGE_SIZE),
  all:filtered,counts,topic:selectedTopic,status:selectedStatus,page:currentPage,pages,
  totalAttempts,everIndependent:independent.size};
}
/** Backward-compatible source-only recommendations used by existing P70 tests. */
export function c9TypingRecommendations(state,{limit=6,topic='all'}={}){
 const entries=c9TypingCatalog(state,{topic}).all;
 return entries.slice(0,Math.max(0,Math.min(24,Number.isInteger(limit)?limit:6)));
}
export function renderC9TypingPath(state,act,esc,ui={}){
 const data=c9TypingCatalog(state,ui);
 const statuses=[
  ['all','All source sentences'],['retry','Retry latest unsuccessful'],
  ['unattempted','Not yet attempted'],['independent','Latest independent correct']
 ];
 return '<section class="c9-typing-path" aria-labelledby="c9-typing-path-title"><details class="c9-typing-disclosure">'+
  '<summary><span class="c9-eyebrow">P70 · ORIGINAL SENTENCE PRODUCTION</span><strong id="c9-typing-path-title">Type Mandarin from meaning</strong><span>Explore all original source-based typing tasks →</span></summary>'+
  '<div class="c9-typing-body"><header><p>Choose a topic or recorded practice status, then reconstruct its original Chinese model from the English meaning. The native Sentence Library checks answers and stores its own supplemental events; no parallel grading, official HSK label or fabricated feedback is introduced.</p></header>'+
  '<div class="c9-typing-evidence"><strong>'+data.everIndependent+' original production tasks have at least one independently correct recorded response</strong>'+
  '<span>'+data.totalAttempts+' native typed production attempts including assisted checks and retries; current status is based on the latest recorded attempt only.</span></div>'+
  '<div class="c9-typing-filters">'+
   '<label for="c9-typing-topic">Original topic<select id="c9-typing-topic" class="c9-select">'+
    '<option value="all">All original topics</option>'+
    SENTENCE_TOPICS.map(t=>'<option value="'+esc(t.id)+'"'+(data.topic===t.id?' selected':'')+'>'+esc(t.title)+'</option>').join('')+
   '</select></label>'+
   '<label for="c9-typing-status">Practice evidence<select id="c9-typing-status" class="c9-select">'+
    statuses.map(([key,label])=>'<option value="'+key+'"'+(data.status===key?' selected':'')+'>'+esc(label)+' · '+data.counts[key]+'</option>').join('')+
   '</select></label></div>'+
  '<div class="c9-typing-list-status" role="status">'+data.all.length+' matching original sentence'+(data.all.length===1?'':'s')+
   ' · page '+(data.page+1)+' of '+data.pages+'</div>'+
  (data.items.length?'<div class="c9-typing-cards">'+data.items.map(({sentence:s,last,stage})=>
   '<article><span class="c9-eyebrow">'+esc(s.source.replaceAll('-',' '))+' · '+esc(s.id)+'</span>'+
   '<h3>'+esc(s.topic)+'</h3><p>'+esc(s.english)+'</p>'+
   '<small>'+(stage==='retry'?'Latest attempt needs an independent retry':stage==='independent'?
     'Latest attempt independently correct':'Not yet attempted')+
    (last?.assisted?' · assisted attempt recorded':'')+'</small>'+
   act('c9-typing-start',stage==='independent'?'Revisit independently →':'Type original model →',
    'c9-button c9-button--secondary c9-button--small','data-id="'+esc(s.id)+'"')+'</article>').join('')+
   '</div>':'<p class="c9-library-disclaimer" role="status">No original sentence matches this filter. Change topic or status to continue.</p>')+
  '<nav class="c9-typing-pages" aria-label="Typing source pages">'+
   act('c9-typing-page','← Previous','c9-button c9-button--secondary c9-button--small','data-delta="-1" '+(data.page===0?'disabled':''))+
   '<span>Page '+(data.page+1)+' / '+data.pages+'</span>'+
   act('c9-typing-page','Next →','c9-button c9-button--secondary c9-button--small','data-delta="1" '+(data.page===data.pages-1?'disabled':''))+
  '</nav>'+
  '<p class="c9-library-disclaimer">Only the original taught Chinese model is automatically checked. Other valid expressions require human interpretation; native production events never confer scheduled mastery.</p>'+
  '</div></details></section>';
}

export function renderC9SentenceDirectory(state,act,esc){
 const saved=new Set(state.bookmarkedSentences||[]);
 const events=(state.sentenceEvents||[]).filter(e=>typeof e.taskId==='string'&&e.taskId.startsWith('context:'));
 const attempted=new Set(events.map(e=>e.taskId.split(':')[1]));
 const correct=new Set(events.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId.split(':')[1]));
 const recent=[...events].reverse().map(e=>SENTENCE_LIBRARY.find(s=>s.id===e.taskId.split(':')[1])).find(Boolean);
 return '<section class="c9-library c9-library-sentences" aria-label="Situation-based sentence discovery">'+
 heading('SENTENCES','Explore real situations','Read original complete sentences, compare their meaning, and continue into native writing practice.')+
 metrics([[SENTENCE_LIBRARY.length,'Original sentences'],[saved.size,'Saved expressions'],
 [correct.size,'Expressions with independent correct practice']])+
 (recent?'<div class="c9-library-continuity"><div><p class="c9-eyebrow">RECENT ORIGINAL SENTENCE</p><h3 lang="zh-Hans">'+esc(recent.hanzi)+'</h3><p>'+esc(recent.english)+' · '+esc(recent.topic)+'</p></div>'+
 act('sentence-select','Continue sentence →','c9-button c9-button--study','data-id="'+esc(recent.id)+'"')+'</div>':'')+
 '<div class="c9-library-section-head"><div><h3>Browse situations</h3><p>These editorial source groups lead to real sentence construction and contextual practice.</p></div>'+
 act('c9-sentence-all','All sentences →','c9-button c9-button--secondary c9-button--small')+'</div>'+
 '<div class="c9-library-topics">'+SENTENCE_TOPICS.map(topic=>{
  const examples=SENTENCE_LIBRARY.filter(s=>s.topicId===topic.id);
  const s=examples[0],savedHere=examples.filter(s=>saved.has(s.id)).length;
  const attempts=examples.filter(s=>attempted.has(s.id)).length;
  return '<article class="c9-library-topic c9-unified-card"><p class="c9-eyebrow">'+esc(topic.area)+' · ORIGINAL TOPIC · COMPLEXITY '+topic.difficulty+'/3</p>'+
   '<h4>'+esc(topic.title)+'</h4><p>'+esc(topic.purpose)+'</p>'+
   (s?'<div class="c9-library-topic-example"><p class="c9-library-topic-hanzi" lang="zh-Hans">'+esc(s.hanzi)+'</p><span class="c9-library-pinyin">'+esc(s.pinyin)+'</span><small>'+esc(s.english)+'</small></div>':'')+
   '<span>'+examples.length+' sentences · '+savedHere+' saved · '+attempts+' attempted</span>'+
   '<div class="c9-library-word-actions">'+act('c9-sentence-topic','Open situation →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(topic.id)+'"')+
   (s?act('sentence-select','First sentence','c9-button c9-button--quiet c9-button--small','data-id="'+esc(s.id)+'"'):'')+'</div>'+
   '</article>';
 }).join('')+'</div>'+
 paragraph('All situations and levels are original authored material, not certified HSK alignment or a new progress engine.')+'</section>';
}
