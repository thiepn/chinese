// P31 curriculum presentation inside the existing app. All actions route to
// canonical character, word, sentence, grammar, reading and writing systems.
import {P31_CHARACTER_GUIDES,P31_THEMES,findP31Guide,nextP31Guide} from './p31-foundations.mjs';
import {P31_VOCABULARY} from './p31-vocabulary.mjs';
import {canonicalWordKey,findWord,wordFamily} from './lexicon.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES} from './stories.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';

function seen(state,id){return (state.learned||[]).includes(id);}
const unit=(guide,state,act,esc)=>act('p31-open-lesson',
 `<span class="p31-card-glyph" lang="zh-Hans">${esc(guide.hanzi)}</span><span class="p31-card-text"><strong>${esc(guide.pinyin)}</strong><small>${esc(guide.meaning)}</small><small>${esc(guide.category)}</small></span><span class="p31-card-flag">${seen(state,guide.id)?'Introduced':'New'} ↗</span>`,
 'p31-character-card '+(seen(state,guide.id)?'introduced':''),`data-id="${guide.id}"`);
export function p31Overview(state,act,esc,compact=false){
 const progress=P31_CHARACTER_GUIDES.filter(g=>seen(state,g.id)).length;
 const next=nextP31Guide(state);
 const vocabularyKeys=P31_VOCABULARY.map(w=>canonicalWordKey(w.hanzi,w.pinyin));
 const wordCount=vocabularyKeys.filter(key=>(state.vocabularyIntroduced||[]).includes(key)).length;
 return `<section class="p31-overview ${compact?'compact':''}"><div class="p31-overview-copy"><p class="eyebrow">NEW ORIGINAL BEGINNER MANDARIN · P31</p>
 <h2>Understand more of everyday Chinese</h2>
 <p>Start with practical words, hear the tones, then use each character in two connected sentences. Original authored study groups only—not official HSK 3.0 syllabus assignments.</p>
 <div class="p31-overview-actions">
 ${next?act('p31-open-lesson',`Continue with ${esc(next.hanzi)} →`,'button primary',`data-id="${next.id}"`):''}
 ${act('p31-open-library','Explore all new characters and words →','button outline')}
 </div></div><div class="p31-overview-numbers">
 <div><strong>${progress}<small> / ${P31_CHARACTER_GUIDES.length}</small></strong><span>Character lessons introduced</span></div>
 <div><strong>${wordCount}<small> / ${P31_VOCABULARY.length}</small></strong><span>Enriched words introduced independently</span></div>
 <div><strong>${P31_CHARACTER_GUIDES.length*2}</strong><span>Original character example sentences</span></div>
 </div></section>`;
}
export function p31LessonShelf(state,act,esc,{theme='all',page=0}={}){
 const choices=P31_CHARACTER_GUIDES.filter(g=>theme==='all'||g.category===theme);
 const maxPage=Math.max(0,Math.ceil(choices.length/12)-1),shown=Math.max(0,Math.min(page,maxPage));
 const selection=choices.slice(shown*12,(shown+1)*12),next=nextP31Guide(state,theme);
 return `<section class="p31-course-library" id="p31-course-library">
 <div class="p31-heading"><div><p class="eyebrow">58 ORIGINAL CHARACTER LESSONS · SEVEN LEARNING THEMES</p><h2>Learn new characters by situation</h2></div>
 <span>Choose a theme, continue an unintroduced lesson or open any previous lesson.</span></div>
 <div class="p31-theme-tabs" role="group" aria-label="New character lesson themes">
 ${['all',...P31_THEMES].map(item=>act('p31-theme',item==='all'?'All new lessons':esc(item),'p31-theme '+(theme===item?'active':''),`data-theme="${esc(item)}" aria-pressed="${theme===item}"`)).join('')}
 </div>
 <div class="p31-shelf-head"><span>${choices.length} original characters · ${choices.filter(g=>seen(state,g.id)).length} introduced</span>
 ${next?act('p31-open-lesson',`Next: ${esc(next.hanzi)} · ${esc(next.meaning)} →`,'button outline small',`data-id="${next.id}"`):''}</div>
 <div class="p31-character-grid">${selection.map(g=>unit(g,state,act,esc)).join('')}</div>
 <div class="p31-shelf-pagination"><span>Page ${shown+1} / ${maxPage+1}</span>
 ${act('p31-prev','← Previous','button outline small',shown?'':'disabled')}
 ${act('p31-next','Next →','button outline small',shown<maxPage?'':'disabled')}</div>
 </section>`;
}
export function p31LessonTeaching(lesson,act,esc){
 const g=findP31Guide(lesson?.id);if(!g)return '';
 const related=STORIES.filter(s=>s.lines.some(l=>l.hanzi.includes(g.hanzi))).slice(0,2);
 const sentences=SENTENCE_LIBRARY.filter(s=>s.hanzi.includes(g.hanzi)).slice(0,3);
 const grammar=GRAMMAR_LESSONS.filter(x=>g.examples.some(e=>x.examples?.some(ge=>e.hanzi.includes(ge.hanzi)))).slice(0,2);
 return `<section class="p31-lesson-teaching" aria-label="Extended original character teaching">
 <div class="p31-lesson-kicker"><span>${esc(g.category)} · Lesson ${String(144+g.sequence).padStart(3,'0')}</span>
 <span>Original curriculum · not an official HSK assignment</span></div>
 <div class="p31-lesson-learning"><div><p class="eyebrow">HOW THIS CHARACTER WORKS</p>
 <h3>${esc(g.grammarTitle)}</h3><p>${esc(g.explanation)}</p><div class="p31-rule"><strong>Pattern</strong><span>${esc(g.grammarPattern)}</span>
 <p>${esc(g.grammarExplanation)}</p></div></div>
 <div><p class="eyebrow">SOUND & CONTEXT</p><strong>${esc(g.pronunciation)}</strong>
 <div class="p31-misconception"><span>Common confusion</span><p>${esc(g.pitfall)}</p></div></div></div>
 <div class="p31-word-family"><div class="p31-section-heading"><h3>Three complete words containing <span lang="zh-Hans">${esc(g.hanzi)}</span></h3>
 <small>Each word is learnable in the existing vocabulary journey.</small></div>
 <div class="p31-related-words">${g.words.map(w=>{
 const word=findWord(canonicalWordKey(w.hanzi,w.pinyin));
 return `<div class="p31-word"><strong lang="zh-Hans">${esc(w.hanzi)}</strong><span>${esc(w.pinyin)}</span><p>${esc(w.english)}</p>
 <div>${word?act('vocabulary-start','Learn this complete word →','button outline small',`data-id="${esc(word.key)}"`):''}
 ${word?act('lookup-word','Meaning and examples ↗','button outline small',`data-id="${esc(word.key)}"`):''}</div></div>`;
 }).join('')}</div></div>
 <div class="p31-practice-bridge"><div><p class="eyebrow">TRANSFER FROM SEEING TO WRITING</p><h3>Build the complete Chinese sentence</h3>
 <p>Use the existing Sentence Workshop to reconstruct the original example from its English meaning. Other valid translations are not automatically marked correct.</p></div>
 <div class="button-row">${act('p31-writing','Write example A →','button primary',`data-id="${g.id}" data-line="0"`)}
 ${act('p31-writing','Write example B →','button outline',`data-id="${g.id}" data-line="1"`)}
 ${act('course-lesson','Six-stage guided lesson →','button outline',`data-id="${g.id}"`)}</div></div>
 <div class="p31-course-links"><p class="eyebrow">NEXT PRACTICAL CONNECTIONS</p>
 <div class="button-row">${act('pinyin-open','Pinyin and tones →','button outline small')}
 ${act('grammar-open','Grammar course →','button outline small')}
 ${act('sentence-open','Complete sentence library →','button outline small')}
 ${act('pathway-open','Progressive learning pathway →','button outline small')}</div>
 ${grammar.length?`<p class="p31-rel-label">Related grammar examples</p><div class="button-row">${grammar.map(x=>act('grammar-select',esc(x.title)+' ↗','button outline small',`data-id="${x.id}"`)).join('')}</div>`:''}
 ${sentences.length?`<p class="p31-rel-label">This character in existing original sentences</p><div class="p31-rel-sentences">${sentences.map(s=>act('sentence-select',`<strong lang="zh-Hans">${esc(s.hanzi)}</strong><small>${esc(s.english)}</small>`,'p31-context-link',`data-id="${s.id}"`)).join('')}</div>`:''}
 ${related.length?`<p class="p31-rel-label">Connected readings where this character occurs</p><div class="button-row">${related.map(story=>act('open-story-link',esc(story.title)+' ↗','button outline small',`data-id="${story.id}"`)).join('')}</div>`:''}
 </div></section>`;
}
export function p31VocabularyShelf(state,act,esc,{page=0}={}){
 const shown=Math.max(0,Math.min(page,Math.ceil(P31_VOCABULARY.length/12)-1));
 const pool=P31_VOCABULARY.slice(shown*12,(shown+1)*12);
 return `<section class="p31-vocabulary-shelf">
 <div class="p31-heading"><div><p class="eyebrow">40 EXPANDED VOCABULARY TEACHING RECORDS</p><h2>Everyday words in more than one context</h2></div>
 <span>Original examples, meaning distinctions and collocations.</span></div>
 <div class="p31-vocabulary-grid">${pool.map(row=>{
 const word=findWord(canonicalWordKey(row.hanzi,row.pinyin));
 if(!word)return '';
 const intro=(state.vocabularyIntroduced||[]).includes(word.key);
 return `<article class="p31-vocab-card"><div><strong lang="zh-Hans">${esc(word.hanzi)}</strong><span>${esc(word.pinyin)}</span></div>
 <h3>${esc(word.senses[0])}</h3><p>${esc(row.note)}</p><div class="p31-vocab-usage">
 <span class="eyebrow">AUTHORED EXAMPLE</span><p lang="zh-Hans">${esc(row.examples[0].hanzi)}</p>
 <small>${esc(row.examples[0].english)}</small></div>
 <div class="p31-vocab-footer"><span>${intro?'Introduced':'New'} · ${word.examples.length} contextual examples</span>
 ${act('vocabulary-start','Study word →','button primary small',`data-id="${esc(word.key)}"`)}
 ${act('lookup-word','Details','button outline small',`data-id="${esc(word.key)}"`)}</div></article>`;
 }).join('')}</div>
 <div class="p31-shelf-pagination"><span>Page ${shown+1} / ${Math.ceil(P31_VOCABULARY.length/12)}</span>
 ${act('p31-words-prev','← Previous','button outline small',shown?'':'disabled')}
 ${act('p31-words-next','Next →','button outline small',shown<Math.ceil(P31_VOCABULARY.length/12)-1?'':'disabled')}</div></section>`;
}