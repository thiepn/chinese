// P25 original grammar learning screen. All saving continues via Sentence Workshop events.
import {GRAMMAR_LESSONS,GRAMMAR_CHAPTERS,GRAMMAR_MODES,findGrammarLesson,grammarQuestion,grammarUnitLinks,shuffleGrammarChunks} from './grammar-course.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {p32RepairPanel,p32LearningHub} from './p32-learning.mjs';

const modeNames={meaning:'Comprehension',cloze:'Fill the gap',ordering:'Word order',transformation:'Transform',production:'Write Chinese'};
export function grammarLessonList({chapter='all',query='',selected='g01'},action,esc){
 const q=String(query).toLowerCase();
 return GRAMMAR_LESSONS.filter(l=>chapter==='all'||String(l.chapterNumber)===String(chapter)).map(l=>{
  const search=[l.title,l.pattern,l.anchor,...l.examples.map(e=>e.hanzi)].join(' ').toLowerCase();
  return `<button class="p25-unit ${l.id===selected?'active':''}" data-action="grammar-select" data-id="${esc(l.id)}" data-grammar-search="${esc(search)}" ${q&&!search.includes(q)?'hidden':''} aria-current="${l.id===selected?'true':'false'}"><span>${String(l.order).padStart(2,'0')}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.pattern)}</small></span><span aria-hidden="true">→</span></button>`;
 }).join('');
}
const voice=(s,action,esc)=>action('speak','▶ Listen · device voice','button outline small',`data-text="${esc(s)}"`);
function practicePanel(s,l,action,esc){
 const q=grammarQuestion(l.id,s.mode);const order=q.kind==='ordering'?s.order:[],selection=q.kind==='ordering'?order.map(i=>q.chunks[i]).join(''):s.typed;
 const selected=new Set(order),sorted=q.kind==='ordering'?shuffleGrammarChunks(q.chunks,l.order):[];
 return `<section class="p25-practice" aria-label="Interactive grammar practice"><div class="panel-heading"><div><p class="eyebrow">USE THE GRAMMAR</p><h3>Apply the pattern</h3></div><span class="muted">Practice answers are supplemental</span></div>
 <div class="p25-modes" role="group">${GRAMMAR_MODES.map(mode=>action('grammar-mode',esc(modeNames[mode]),'p25-mode '+(s.mode===mode?'active':''),`data-mode="${mode}" aria-pressed="${s.mode===mode}"`)).join('')}</div>
 <div class="p25-task"><p class="eyebrow">${esc(s.mode.toUpperCase())}</p><h3>${esc(q.prompt)}</h3>
 ${q.context?`<p class="p25-task-context" lang="${q.kind==='choice'&&s.mode==='meaning'?'zh-Hans':'en'}">${esc(q.context)}</p>`:''}
 ${s.feedback?`<div class="p25-result ${s.feedback.correct&&!s.feedback.assisted?'correct':'incorrect'}" role="status"><strong>${s.feedback.correct&&!s.feedback.assisted?'Model answer accepted':'Learning explanation'}</strong><p>${esc(s.feedback.message)}</p><p class="p25-model" lang="zh-Hans">${esc(q.model.hanzi)}</p><p class="muted">${esc(q.model.pinyin)} · ${esc(q.model.english)}</p><p>${esc(q.explanation)}</p><p class="muted">${esc(l.pitfall)}</p>${voice(q.model.hanzi,action,esc)}</div>
 <div class="button-row">${action('grammar-next-mode','Next skill →','button primary')}${action('grammar-next','Next grammar lesson →','button outline')}</div>`:
 q.kind==='choice'?`<div class="choice-list" role="group">${q.options.map((opt,i)=>action('grammar-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div><div class="button-row">${action('grammar-hint','Show hint · assisted','button outline small')}${action('grammar-reveal','Reveal explanation','button outline small')}</div>`:
 q.kind==='ordering'?`<div class="p25-order"><p class="muted">Tap word chunks in the intended order.</p><div class="p25-assembled" aria-live="polite">${selection?`<span lang="zh-Hans">${esc(selection)}</span>`:'Your sentence appears here…'}</div>
 <div class="p25-chunks">${sorted.map(item=>action('grammar-chunk',esc(item.text),'p25-chunk',`data-index="${item.i}" ${selected.has(item.i)?'disabled':''}`)).join('')}</div><div class="button-row">${action('grammar-undo','Undo last','button outline small',order.length?'':'disabled')}${action('grammar-reset','Start over','button outline small',order.length?'':'disabled')}</div></div>
 <div class="button-row">${action('grammar-answer','Check constructed sentence →','button primary',order.length===q.chunks.length?'':'disabled')}${action('grammar-hint','Pinyin hint · assisted','button outline small')}${action('grammar-reveal','Reveal model','button outline small')}</div>`:
 `<div class="answer-entry"><label for="grammar-entry">Type the complete Chinese model sentence</label><textarea id="grammar-entry" rows="2" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Write Chinese here">${esc(s.typed)}</textarea></div>
 <div class="button-row">${action('grammar-answer','Check written Chinese →','button primary',s.typed.trim()?'':'disabled')}${action('grammar-hint','Pinyin hint · assisted','button outline small')}${action('grammar-reveal','Reveal model','button outline small')}</div>`}
 ${!s.feedback&&s.assisted?`<p class="p25-hint">Assisted Pinyin hint: ${esc(q.model.pinyin)}</p>`:''}
 </div><p class="muted">Exact model reconstruction is not a judgment of every possible valid Chinese translation. Answers never grant scheduled-review mastery.</p></section>`;
}
function linksPanel(id,action,esc){
 const links=grammarUnitLinks(id);
 return `<section class="simple-panel p25-links"><h3>Continue with existing learning material</h3><p class="muted">Suggested connections from overlapping characters and vocabulary; not claims about linguistic mastery.</p>
 ${links.characters.length?`<div class="p25-linkrow"><strong>Character lesson</strong>${links.characters.map(l=>action('open-lesson',`<span lang="zh-Hans">${esc(l.hanzi)}</span> · ${esc(l.meaning)}`,'button outline small',`data-id="${esc(l.id)}"`)).join('')}</div>`:''}
 ${links.words.length?`<div class="p25-linkrow"><strong>Words in these examples</strong>${links.words.map(w=>action('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.senses[0])}`,'button outline small',`data-id="${esc(w.key)}"`)).join('')}</div>`:''}
 ${links.readings.length?`<div class="p25-linkrow"><strong>Related readings</strong>${links.readings.map(r=>action('open-story-link',esc(r.title)+' →','button outline small',`data-id="${esc(r.id)}"`)).join('')}</div>`:''}
 ${links.dialogues.length?`<div class="p25-linkrow"><strong>Related conversations</strong>${links.dialogues.map(d=>action('hub-dialogue',esc(d.title)+' →','button outline small',`data-id="${esc(d.id)}"`)).join('')}</div>`:''}</section>`;
}
export function renderGrammarScreen(s,action,esc,title,gated){
 const l=findGrammarLesson(s.lessonId)||GRAMMAR_LESSONS[0];
 const events=(s.sentenceEvents||[]).filter(e=>e.taskId.startsWith('grammar:'));
 const attempts=events.filter(e=>e.taskId.startsWith('grammar:'+l.id+':'));
 return `${title('STRUCTURED MANDARIN GRAMMAR','Learn the structure. Use the language.','Original Chinese explanations, examples, misconceptions, sentence building and writing, connected to the character course.')}${gated()}
 <section class="simple-panel p25-overview"><div class="p25-stats">${[[GRAMMAR_LESSONS.length,'Full grammar lessons'],[GRAMMAR_CHAPTERS.length,'Linked chapters'],[GRAMMAR_LESSONS.length*GRAMMAR_MODES.length,'Grammar exercises'],[events.length,'Practice answers']].map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div><p>Each lesson teaches a useful pattern through explanations, contrasts and two original bilingual examples. Practice independently or reveal help when needed.</p></section>
 <details class="c9-language-supplement"><summary>Additional original P32 grammar explanations & study resources</summary><div class="c9-language-supplement-body">${p32LearningHub({sentenceEvents:s.sentenceEvents||[]},action,esc)}</div></details>
 <nav class="p25-chapters" aria-label="Grammar chapters">${GRAMMAR_CHAPTERS.map(ch=>action('grammar-chapter',ch.number+'. '+esc(ch.name),'p25-chapter '+(String(ch.number)===String(s.chapter)?'active':''),`data-chapter="${ch.number}"`)).join('')}</nav>
 <div class="p25-layout"><aside class="p25-sidebar"><label for="grammar-query">Find a pattern</label><input type="search" id="grammar-query" value="${esc(s.query)}" placeholder="Search 是, word order, possession">
 <label for="grammar-chapter-select">Chapter</label><select id="grammar-chapter-select"><option value="all" ${s.chapter==='all'?'selected':''}>All chapters</option>${GRAMMAR_CHAPTERS.map(ch=>`<option value="${ch.number}" ${String(s.chapter)===String(ch.number)?'selected':''}>${ch.number}. ${esc(ch.name)}</option>`).join('')}</select>
 <div class="p25-list" id="grammar-lesson-list">${grammarLessonList({...s,selected:l.id},action,esc)}</div></aside>
 <article class="p25-lesson"><div class="p25-heading"><div class="c9-language-stage"><span>01 · LEARN THE RULE</span><span>02 · COMPARE EXAMPLES</span><span>03 · PRACTISE CHINESE</span></div><p class="eyebrow">LESSON ${l.order} OF ${GRAMMAR_LESSONS.length} · ${esc(l.chapter)}</p><h2>${esc(l.title)}</h2><p class="p25-pattern">${esc(l.pattern)}</p><small>${attempts.length} recorded practice answer${attempts.length===1?'':'s'} · original sentence-event history, not course mastery</small></div>
 <div class="p25-teaching"><section class="c9-grammar-source-panel"><p class="c9-eyebrow">AUTHORED GRAMMAR EXPLANATION</p><h3>How it works</h3><p>${esc(l.explanation)}</p></section><section class="c9-grammar-source-panel"><p class="c9-eyebrow">MEANINGFUL CONTRAST</p><h3>Compare the alternatives</h3><p>${esc(l.contrast)}</p></section><div class="p25-mistake"><strong>Common misconception</strong><p>${esc(l.pitfall)}</p></div></div>
 <div class="p25-example-heading"><h3>Meaningful Chinese examples</h3>${action('grammar-translation',s.showEnglish?'Hide English':'Reveal English','button outline small')}</div>
 <div class="p25-examples">${l.examples.map((e,i)=>`<article><p class="eyebrow">EXAMPLE ${i+1}</p><p lang="zh-Hans">${esc(e.hanzi)}</p><small>${esc(e.pinyin)}</small>${s.showEnglish?`<p>${esc(e.english)}</p>`:'<p class="muted">Reveal the English interpretation when ready.</p>'}${voice(e.hanzi,action,esc)}</article>`).join('')}</div>
 ${p32RepairPanel(l.id,action,esc)}
 ${practicePanel(s,l,action,esc)}
 <div class="p25-navigation">${action('grammar-previous','← Previous grammar lesson','button outline')}${action('grammar-next','Next grammar lesson →','button primary')}${action('grammar-pinyin','Pinyin & Sounds','button outline small')}${action('grammar-workshop','Sentence Workshop','button outline small')}</div></article></div>
 ${linksPanel(l.id,action,esc)}<section class="simple-panel p26-grammar-examples"><h3>Use this grammar in complete original sentences</h3><div>${SENTENCE_LIBRARY.filter(s=>s.grammarIds.includes(l.id)).slice(0,5).map(s=>action('sentence-select',`<strong lang="zh-Hans">${esc(s.hanzi)}</strong><small>${esc(s.english)}</small>`,'p26-mini-sentence',`data-id="${s.id}"`)).join('')}</div>${action('sentence-grammar-filter','Browse all sentences with this pattern →','button outline small',`data-id="${l.id}"`)}</section>`;
}