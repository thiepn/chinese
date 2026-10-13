// P26 sentence discovery, contextual teaching, and integrated Sentence Workshop practice.
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY,SENTENCE_TOPICS,SENTENCE_MODES,findLibrarySentence,sentenceQuestion,
 sentenceContext,searchSentences,sentenceBookmarked,hasSentenceMode} from './sentence-library.mjs';
const names={meaning:'Meaning',cloze:'Fill the blank',ordering:'Rebuild',transformation:'Transform',production:'Write Chinese'};
const voice=(hanzi,act,esc,text='▶ Listen')=>act('speak',text,'button outline small',`data-text="${esc(hanzi)}"`);
function itemButton(s,selected,saved,act,esc){
 return `<button type="button" class="p26-sentence-item ${s.id===selected?'selected':''}" data-action="sentence-select" data-id="${esc(s.id)}" aria-current="${s.id===selected?'true':'false'}">
 <span class="p26-item-meta"><span>${esc(s.id.slice(-3))} · ${esc(s.topic)}</span>${saved?'<span aria-label="Saved">★</span>':''}</span>
 <strong lang="zh-Hans">${esc(s.hanzi)}</strong><small>${esc(s.english)}</small></button>`;
}
export function sentenceResultsPanel(state,act,esc){
 const result=searchSentences({...state,state:state.learner});
 const pages=Math.max(1,Math.ceil(result.length/18)),page=Math.min(state.page,pages-1);
 const subset=result.slice(page*18,(page+1)*18);
 return {result,pages,page,html:`<div class="p26-list" id="sentence-search-list" role="group" aria-label="Sentence results">
 ${subset.length?subset.map(s=>itemButton(s,state.selected,sentenceBookmarked(state.learner,s.id),act,esc)).join(''):'<p class="muted">No sentences match the current filters. Try removing a topic or search term.</p>'}
 </div><nav class="p26-pager" aria-label="Sentence results pagination"><span>${result.length?`${page*18+1}–${Math.min(result.length,(page+1)*18)}`:'0'} of ${result.length}</span>
 ${act('sentence-prev-page','← Previous','button outline small',page?'':'disabled')}${act('sentence-next-page','Next →','button outline small',page<pages-1?'':'disabled')}</nav>`};
}
function referenceLinks(ctx,act,esc){
 return `<section class="p26-connections" aria-label="Sentence connections"><div class="panel-heading"><h3>Connect this sentence to your learning</h3><span class="muted">Linked by authored topic or visible shared words</span></div>
 ${ctx.grammar.length?`<div class="p26-link-group"><strong>Grammar constructions</strong><div>${ctx.grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small',`data-id="${g.id}"`)).join('')}</div></div>`:''}
 ${ctx.words.length?`<div class="p26-link-group"><strong>Vocabulary</strong><div>${ctx.words.map(w=>act('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.senses[0])}`,'button outline small',`data-id="${esc(w.key)}"`)).join('')}</div></div>`:''}
 ${ctx.chars.length?`<div class="p26-link-group"><strong>Character lessons</strong><div>${ctx.chars.map(l=>act('open-lesson',`<span lang="zh-Hans">${esc(l.hanzi)}</span> · ${esc(l.meaning)}`,'button outline small',`data-id="${esc(l.id)}"`)).join('')}</div></div>`:''}
 ${ctx.readings.length?`<div class="p26-link-group"><strong>Read more in connected passages</strong><div>${ctx.readings.map(s=>act('open-story-link',esc(s.title)+' →','button outline small',`data-id="${esc(s.id)}"`)).join('')}</div></div>`:''}
 ${ctx.dialogues.length?`<div class="p26-link-group"><strong>Related conversations</strong><div>${ctx.dialogues.map(d=>act('hub-dialogue',esc(d.title)+' →','button outline small',`data-id="${esc(d.id)}"`)).join('')}</div></div>`:''}
 <p class="muted">Reading and dialogue links use shared written words; they are contextual suggestions, not guaranteed matches of every grammatical use.</p></section>`;
}
function nearbyPanel(ctx,act,esc){
 const s=ctx.s;
 return `<section class="p26-context" aria-label="Connected situational examples"><div class="panel-heading"><div><p class="eyebrow">SCENE: ${esc(s.topic.toUpperCase())}</p><h3>Read the situation, not only one line</h3></div><span class="muted">${esc(s.purpose)} · difficulty ${s.difficulty}/3</span></div>
 <p>These sentences share a practical situation. Compare what changes in speaker, time, word choice or conversational purpose.</p>
 <div class="p26-context-grid">${ctx.near.map(n=>`<button type="button" data-action="sentence-select" data-id="${esc(n.id)}"><strong lang="zh-Hans">${esc(n.hanzi)}</strong><span>${esc(n.pinyin)}</span><small>${esc(n.english)}</small></button>`).join('')}</div>
 ${s.variant?`<div class="p26-variation"><p class="eyebrow">ORIGINAL TRANSFORMATION · ${esc(s.variant.kind.toUpperCase())}</p>
 <p>${esc(s.variant.explanation)}</p><div class="p26-variation-pair"><div><span>Original</span><strong lang="zh-Hans">${esc(s.hanzi)}</strong><small>${esc(s.english)}</small></div>
 <span aria-hidden="true">→</span><div><span>Changed</span><strong lang="zh-Hans">${esc(s.variant.hanzi)}</strong><small>${esc(s.variant.pinyin)}</small><small>${esc(s.variant.english)}</small>${voice(s.variant.hanzi,act,esc)}</div></div>
 ${act('sentence-mode','Practice this transformation →','button primary small','data-mode="transformation"')}</div>`:''}
 </section>`;
}
function taskPanel(ui,s,act,esc){
 const q=sentenceQuestion(s.id,ui.mode);
 if(!q)return '<p>There is no authored transformation for this sentence. Select another practice mode.</p>';
 const choice=q.kind==='choice',ordering=q.kind==='ordering',complete=ui.feedback;
 const selected=new Set(ui.order),build=ui.order.map(i=>q.chunks?.[i]||'').join('');
 return `<section class="p26-practice" aria-label="Contextual sentence practice"><div class="panel-heading"><div><p class="eyebrow">PRACTICE ONE REAL SENTENCE</p><h3>${esc(names[ui.mode])}</h3></div><span class="muted">Supplemental attempt history</span></div>
 <div class="p26-modes" role="group" aria-label="Sentence study modes">${SENTENCE_MODES.map(m=>act('sentence-mode',esc(names[m]),'p26-mode '+(m===ui.mode?'selected':''),`data-mode="${m}" aria-pressed="${m===ui.mode}" ${hasSentenceMode(s,m)?'':'disabled'}`)).join('')}</div>
 <div class="p26-task"><h3>${esc(q.prompt)}</h3><p class="p26-task-context" lang="${choice?'zh-Hans':ui.mode==='transformation'?'zh-Hans':'en'}">${esc(q.context)}</p>
 ${complete?`<div class="p26-feedback ${complete.correct&&!complete.assisted?'correct':'incorrect'}" role="status"><strong>${complete.correct&&!complete.assisted?'Model answer accepted':'Study the model and explanation'}</strong><p>${esc(complete.message)}</p><div><strong lang="zh-Hans">${esc(q.model.hanzi)}</strong><span>${esc(q.model.pinyin)}</span><p>${esc(q.model.english)}</p></div><p>${esc(q.explanation)}</p>${voice(q.model.hanzi,act,esc,'▶ Hear the reference')}</div>
 <div class="button-row">${act('sentence-next-mode','Try another skill →','button primary')}${act('sentence-next','Next sentence →','button outline')}</div>`:
 choice?`<div class="choice-list">${q.options.map((option,i)=>act('sentence-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(option)}`,'choice',`data-option="${esc(option)}"`)).join('')}</div>
 <div class="button-row">${act('sentence-hint','See a hint · assisted','button outline small')}${act('sentence-reveal','Reveal model answer','button outline small')}</div>`:
 ordering?`<div class="p26-order"><p class="muted">Tap each chunk in the order needed to reconstruct the sentence.</p><div class="p26-assembled" aria-live="polite">${build?`<strong lang="zh-Hans">${esc(build)}</strong>`:'<span class="muted">Your Chinese sentence appears here</span>'}</div>
 <div class="p26-chunks">${q.order.map(i=>act('sentence-chunk',esc(q.chunks[i]),'p26-chunk',`data-index="${i}" ${selected.has(i)?'disabled':''}`)).join('')}</div>
 <div class="button-row">${act('sentence-undo','Undo','button outline small',ui.order.length?'':'disabled')}${act('sentence-clear','Start again','button outline small',ui.order.length?'':'disabled')}</div>
 <div class="button-row">${act('sentence-answer','Check word order →','button primary',ui.order.length===q.chunks.length?'':'disabled')}${act('sentence-hint','Show Pinyin · assisted','button outline small')}${act('sentence-reveal','Reveal model','button outline small')}</div></div>`:
 `<div class="answer-entry"><label for="sentence-library-entry">Write the taught Chinese sentence</label><textarea id="sentence-library-entry" rows="3" placeholder="Enter Chinese characters" spellcheck="false" autocomplete="off" autocapitalize="off">${esc(ui.typed)}</textarea></div>
 <div class="button-row">${act('sentence-answer','Check written sentence →','button primary',ui.typed.trim()?'':'disabled')}${act('sentence-hint','Show Pinyin · assisted','button outline small')}${act('sentence-reveal','Reveal model','button outline small')}</div>`}
 ${!complete&&ui.assisted?`<p class="p26-hint">Assisted pronunciation cue: ${esc(q.model.pinyin)}</p>`:''}
 </div><p class="muted">${ui.focus?'Independent focus mode: reference sentence and connected examples stay hidden until you submit.':'Teaching mode: the source is visible. Answers here are saved as assisted; start focused recall for independent practice.'} All attempts reuse Sentence Workshop records, never scheduled mastery.</p>
 </section>`;
}
export function renderSentenceScreen(ui,act,esc,title,gated){
 const chosen=findLibrarySentence(ui.selected)||SENTENCE_LIBRARY[0],ctx=sentenceContext(chosen.id);
 const result=sentenceResultsPanel(ui,act,esc),saved=(ui.learner.bookmarkedSentences||[]).length;
 const areas=[...new Set(SENTENCE_TOPICS.map(t=>t.area))];
 const purposes=[...new Set(SENTENCE_TOPICS.map(t=>t.purpose))];
 return `${title('CONTEXTUAL SENTENCE LIBRARY','Make Mandarin sentences useful.','Study authored sentences inside everyday situations, understand grammar patterns, save expressions and practise complete Chinese production.')}${gated()}
 <section class="simple-panel p26-overview"><div class="p26-stats">${[[SENTENCE_LIBRARY.length,'Authored base sentences'],[SENTENCE_TOPICS.length,'Daily situations'],[SENTENCE_LIBRARY.filter(s=>s.variant).length,'Written transformations'],[saved,'Saved expressions']].map(([n,label])=>`<div><strong>${n}</strong><span>${label}</span></div>`).join('')}</div><p>Original Simplified Mandarin teaching content; neither official HSK corpus nor native-recorded audio. The library uses the same source-linked course and sentence practice systems.</p></section>
 <section class="p26-layout ${ui.focus&&!ui.feedback?'p26-focus':''}"><aside class="p26-browser" ${ui.focus&&!ui.feedback?'aria-hidden="true"':''}><div class="p26-browser-head"><h2>Find a sentence</h2><label for="sentence-library-query">Search Chinese, Pinyin, English or grammar</label><input id="sentence-library-query" type="search" value="${esc(ui.query)}" placeholder="Search a situation or phrase">
 <div class="p26-filters"><label>Collection<select id="sentence-library-collection"><option value="all" ${ui.source==='all'?'selected':''}>All original sentences</option><option value="original-p32" ${ui.source==='original-p32'?'selected':''}>P32 · Grammar sentence mastery</option><option value="original-p35" ${ui.source==='original-p35'?'selected':''}>P35 · New character & vocabulary sentences</option><option value="original-p36" ${ui.source==='original-p36'?'selected':''}>P36 · Elementary grammar in context</option><option value="original-p26" ${ui.source==='original-p26'?'selected':''}>Earlier sentence library</option></select></label><label>Situation<select id="sentence-library-topic"><option value="all">All situations</option>${SENTENCE_TOPICS.map(t=>`<option value="${t.id}" ${ui.topic===t.id?'selected':''}>${esc(t.title)}</option>`).join('')}</select></label>
 <label>Topic area<select id="sentence-library-area"><option value="all">All areas</option>${areas.map(a=>`<option value="${esc(a)}" ${ui.area===a?'selected':''}>${esc(a)}</option>`).join('')}</select></label>
 <label>Complexity<select id="sentence-library-level"><option value="all">All levels</option>${[1,2,3].map(n=>`<option value="${n}" ${String(ui.difficulty)===String(n)?'selected':''}>${n} / 3</option>`).join('')}</select></label>
 <label>Grammar pattern<select id="sentence-library-grammar"><option value="all">All grammar</option>${GRAMMAR_LESSONS.map(g=>`<option value="${g.id}" ${ui.grammar===g.id?'selected':''}>${esc(g.title)}</option>`).join('')}</select></label>
 <label>Communicative purpose<select id="sentence-library-purpose"><option value="all">All purposes</option>${purposes.map(p=>`<option value="${esc(p)}" ${ui.purpose===p?'selected':''}>${esc(p)}</option>`).join('')}</select></label>
 <label>Tone-marked pronunciation<select id="sentence-library-tone"><option value="all">All lexical tones</option>${[1,2,3,4].map(n=>`<option value="tone${n}" ${ui.tone==='tone'+n?'selected':''}>Contains tone ${n}</option>`).join('')}</select></label></div>
 <label class="p26-saved-filter"><input id="sentence-library-saved" type="checkbox" ${ui.savedOnly?'checked':''}> Saved sentences only</label>
 <div class="button-row">${act('sentence-show-saved',saved?'Study saved sentences →':'Browse all →','button outline small')}</div></div>
 <div id="sentence-results">${result.html}</div></aside>
 <article class="p26-detail"><div class="p26-heading"><p class="eyebrow">EXPRESSION ${esc(chosen.id.slice(-3))} / ${SENTENCE_LIBRARY.length} · ${esc(chosen.topic.toUpperCase())}</p>
 <div class="p26-heading-flags"><span>Difficulty ${chosen.difficulty}/3</span><span>${esc(chosen.purpose)}</span></div>
 ${ui.focus&&!ui.feedback?'<h2 class="p26-hidden-reference">Reference hidden for focused recall</h2>':`<h2 lang="zh-Hans">${esc(chosen.hanzi)}</h2>`}
 ${(!ui.focus||ui.feedback)&&ui.showPinyin?`<p class="p26-pinyin">${esc(chosen.pinyin)}</p>`:''}
 ${(!ui.focus||ui.feedback)&&ui.showEnglish?`<p class="p26-meaning">${esc(chosen.english)}</p>`:''}
 <div class="button-row">${act('sentence-focus',ui.focus?'Exit focused recall':'Start focused recall','button primary')}${!ui.focus||ui.feedback?voice(chosen.hanzi,act,esc,'▶ Hear Mandarin · device voice'):''}
 ${act('sentence-save',sentenceBookmarked(ui.learner,chosen.id)?'★ Saved':'☆ Save sentence','button outline small',`data-id="${chosen.id}"`)}
 ${act('sentence-toggle-pinyin',ui.showPinyin?'Hide Pinyin':'Show Pinyin','button outline small')}
 ${act('sentence-toggle-english',ui.showEnglish?'Hide English':'Show English','button outline small')}</div></div>
 <div class="p26-detail-nav">${act('sentence-previous','← Previous','button outline small')}${act('sentence-next','Next sentence →','button primary')}${act('sentence-workshop','Write in Sentence Workshop →','button outline small')}</div>
 ${(!ui.focus||ui.feedback)?nearbyPanel(ctx,act,esc):''}${taskPanel(ui,chosen,act,esc)}
 </article></section>${(!ui.focus||ui.feedback)?referenceLinks(ctx,act,esc):''}
 <section class="simple-panel p26-end"><h3>Use the sentence in the rest of the course</h3><p>Continue into a grammar lesson, a character study unit or a topical reading. Authored example sentences extend the existing curriculum rather than replacing it.</p>
 <div class="button-row">${act('sentence-next','Continue discovering sentences →','button primary')}${act('sentence-workshop','Sentence Workshop →','button outline')}${act('grammar-open','Grammar course →','button outline')}</div></section>`;
}