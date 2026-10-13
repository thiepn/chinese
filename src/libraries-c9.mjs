/** C9-07: Read-only library discovery; original routes and writers own all study actions. */
import {WORDS,plain} from './lexicon.mjs';
import {GRAMMAR_CHAPTERS,GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY,SENTENCE_TOPICS} from './sentence-library.mjs';

export const C9_WORD_FILTERS=Object.freeze(['all','saved','introduced','new']);
const count=(n,label)=>n+' '+label+(n===1?'':'s');
const pct=(done,total)=>total?Math.max(0,Math.min(100,Math.round(100*done/total))):0;
const heading=(type,name,desc)=>'<div class="c9-library-heading"><p class="c9-eyebrow">'+type+' · ORIGINAL SOURCE</p><h2>'+name+'</h2><p>'+desc+'</p></div>';
const metrics=(items)=>'<div class="c9-library-metrics">'+items.map(([value,label])=>'<div><strong>'+value+'</strong><span>'+label+'</span></div>').join('')+'</div>';
const bar=(done,total,label)=>'<div class="c9-library-bar"><div><span>'+label+'</span><strong>'+done+' / '+total+'</strong></div><div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+pct(done,total)+'%"></span></div></div>';
const paragraph=(text)=>'<p class="c9-library-disclaimer">'+text+'</p>';
const PAGE=12;

export function c9WordCatalogResults(state,{query='',filter='all',page=0}={},act,esc){
 const saved=new Set(state.bookmarkedWords||[]),introduced=new Set(state.vocabularyIntroduced||[]);
 const term=plain(query),mode=C9_WORD_FILTERS.includes(filter)?filter:'all';
 const words=WORDS.filter(w=>
  (mode==='all'||(mode==='saved'?saved.has(w.key):mode==='introduced'?introduced.has(w.key):!introduced.has(w.key)))&&
  (!term||[w.hanzi,w.pinyin,...w.senses,...w.collocations,...w.notes].some(v=>plain(v).includes(term))));
 const last=Math.max(0,Math.ceil(words.length/PAGE)-1);
 const current=Math.max(0,Math.min(last,Number.isInteger(page)?page:0));
 const results=words.slice(current*PAGE,(current+1)*PAGE);
 return '<div class="c9-library-results-caption" role="status"><strong>'+count(words.length,'matching indexed word')+'</strong><span>Page '+(current+1)+' of '+(last+1)+'</span></div>'+
 (results.length?'<div class="c9-library-words">'+results.map(w=>{
  const introducedHere=introduced.has(w.key),savedHere=saved.has(w.key),ex=w.examples[0];
  return '<article class="c9-library-word"><div class="c9-library-word-head"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><span>'+esc(w.pinyin)+'</span></div>'+
   '<div class="c9-library-word-copy"><strong>'+esc(w.senses.slice(0,2).join(' / '))+'</strong>'+
   '<span class="c9-badge'+(introducedHere?' c9-badge--success':'')+'">'+(introducedHere?'Introduced':savedHere?'Saved':'Not introduced')+'</span>'+
   (ex?'<p lang="zh-Hans">'+esc(ex.hanzi)+'</p><small>'+esc(ex.pinyin)+' · '+esc(ex.english)+'</small>':
   '<small>No indexed example sentence for this word.</small>')+
   '<small>'+esc(w.source)+' · Original vocabulary</small></div>'+
   '<div class="c9-library-word-actions">'+act('speak','Listen','c9-button c9-button--quiet c9-button--small','data-text="'+esc(w.hanzi)+'"')+
   act('c9-word-open','Full details →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(w.key)+'"')+'</div></article>';
 }).join('')+'</div>':'<div class="c9-empty"><strong>No matching words</strong><p>Try another word, Pinyin spelling or meaning, or change the saved/introduction filter.</p></div>')+
 '<div class="c9-library-pages"><span>'+ (words.length?String(current*PAGE+1)+'–'+String(current*PAGE+results.length):'0')+' of '+words.length+'</span>'+
 '<div class="c9-inline">'+act('c9-word-page','Previous','c9-button c9-button--secondary c9-button--small','data-delta="-1" '+(current===0?'disabled':''))+
 act('c9-word-page','Next','c9-button c9-button--secondary c9-button--small','data-delta="1" '+(current===last?'disabled':''))+'</div></div>';
}
export function renderC9VocabularyLibrary(state,ui,act,esc){
 const saved=new Set(state.bookmarkedWords||[]),introduced=new Set(state.vocabularyIntroduced||[]);
 return '<section class="c9-library c9-library-vocabulary" aria-label="Canonical vocabulary library">'+
 heading('VOCABULARY','Words in context','Search source-backed words and open the existing dictionary, pronunciation and practice tools.')+
 metrics([[WORDS.length,'Canonical words'],[WORDS.filter(w=>saved.has(w.key)).length,'Saved words'],
 [WORDS.filter(w=>introduced.has(w.key)).length,'Introduced words']])+
 '<div class="c9-library-filters"><label for="c9-word-query">Search Chinese, Pinyin, meanings and examples<input type="search" id="c9-word-query" class="c9-input" value="'+esc(ui.query)+'" placeholder="学校, xué, food…" autocomplete="off" spellcheck="false"></label>'+
 '<label for="c9-word-status">Word status<select id="c9-word-status" class="c9-select">'+
 [['all','All indexed words'],['saved','Saved words'],['introduced','Introduced words'],['new','Not introduced']].map(([key,label])=>
  '<option value="'+key+'"'+(ui.filter===key?' selected':'')+'>'+label+'</option>').join('')+'</select></label></div>'+
 '<div id="c9-word-catalog" aria-live="polite">'+c9WordCatalogResults(state,ui,act,esc)+'</div>'+
 paragraph('Word introduction, bookmarking and extra practice are separate from scheduled recall and do not imply HSK mastery.')+'</section>';
}
export function renderC9GrammarDirectory(state,act,esc){
 const events=(state.sentenceEvents||[]).filter(e=>typeof e.taskId==='string'&&e.taskId.startsWith('grammar:'));
 const attempted=new Set(events.map(e=>e.taskId.split(':')[1]));
 return '<section class="c9-library c9-library-grammar" aria-label="Grammar course discovery">'+
 heading('GRAMMAR','Grammar chapters','Open authored patterns, contrasts and misconception-aware lessons. The existing grammar player performs all exercises.')+
 metrics([[GRAMMAR_LESSONS.length,'Grammar lessons'],[GRAMMAR_CHAPTERS.length,'Chapters'],
 [events.filter(e=>e.correct&&!e.assisted).length,'Independent correct attempts']])+
 '<div class="c9-library-chapters">'+GRAMMAR_CHAPTERS.map(ch=>{
  const entries=GRAMMAR_LESSONS.filter(g=>g.chapterNumber===ch.number);
  const seen=entries.filter(g=>attempted.has(g.id)).length;
  const next=entries.find(g=>!attempted.has(g.id))||entries[0];
  return '<article class="c9-library-chapter"><div class="c9-library-tile-head"><span>'+String(ch.number).padStart(2,'0')+'</span><div><h3>'+esc(ch.name)+'</h3><small>'+count(entries.length,'authored lesson')+'</small></div></div>'+
   bar(seen,entries.length,'Lessons with a recorded practice attempt')+
   '<div class="c9-library-links">'+entries.slice(0,3).map(g=>act('grammar-select',esc(g.title),'c9-library-text-button','data-id="'+esc(g.id)+'"')).join('')+'</div>'+
   (next?act('grammar-select','Open '+esc(next.title)+' →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
   '</article>';
 }).join('')+'</div>'+
 paragraph('An attempted lesson is not a completed lesson; independent answers are original sentence-event evidence, not a calculated mastery score.')+'</section>';
}
export function renderC9SentenceDirectory(state,act,esc){
 const saved=new Set(state.bookmarkedSentences||[]);
 const events=(state.sentenceEvents||[]).filter(e=>typeof e.taskId==='string'&&e.taskId.startsWith('context:'));
 const attempted=new Set(events.map(e=>e.taskId.split(':')[1]));
 const correct=new Set(events.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId.split(':')[1]));
 return '<section class="c9-library c9-library-sentences" aria-label="Situation-based sentence discovery">'+
 heading('SENTENCES','Explore real situations','Read original complete sentences, compare their meaning, and continue into native writing practice.')+
 metrics([[SENTENCE_LIBRARY.length,'Original sentences'],[saved.size,'Saved expressions'],
 [correct.size,'Expressions with independent correct practice']])+
 '<div class="c9-library-section-head"><h3>Browse situations</h3>'+
 act('c9-sentence-all','All sentences →','c9-button c9-button--secondary c9-button--small')+'</div>'+
 '<div class="c9-library-topics">'+SENTENCE_TOPICS.map(topic=>{
  const examples=SENTENCE_LIBRARY.filter(s=>s.topicId===topic.id);
  const s=examples[0],savedHere=examples.filter(s=>saved.has(s.id)).length;
  const attempts=examples.filter(s=>attempted.has(s.id)).length;
  return '<article class="c9-library-topic"><p class="c9-eyebrow">ORIGINAL TOPIC · COMPLEXITY '+topic.difficulty+'/3</p>'+
   '<h4>'+esc(topic.title)+'</h4><p>'+esc(topic.purpose)+'</p>'+
   (s?'<p class="c9-library-topic-hanzi" lang="zh-Hans">'+esc(s.hanzi)+'</p>':'')+
   '<span>'+examples.length+' sentences · '+savedHere+' saved · '+attempts+' attempted</span>'+
   act('c9-sentence-topic','Open situation →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(topic.id)+'"')+
   '</article>';
 }).join('')+'</div>'+
 paragraph('All situations and levels are original authored material, not certified HSK alignment or a new progress engine.')+'</section>';
}
