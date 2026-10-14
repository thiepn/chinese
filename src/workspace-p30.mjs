// P30 original course workspace and unified discovery. Read-only views.
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS,plain} from './lexicon.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {PATHWAY_MISSIONS,pathwayResume} from './pathway-course.mjs';
import {WORKSPACE_COACHING,WORKSPACE_COACHING_CATEGORIES} from './workspace-coaching-p30.mjs';
import {courseOverview,courseShortcuts} from './course-overview.mjs';
import {learningHub} from './learning-hub.mjs';
import {C9_ADVANCED_PHASES,c9AdvancedSourceLines} from './advanced-c9.mjs';

export const WORKSPACE_DESTINATIONS=Object.freeze([
 ['learn','Characters','Study writing, meanings and example words',DEMO_LESSONS.length],
 ['explore','Vocabulary','Complete words, senses and context',WORDS.length],
 ['grammar','Grammar','Natural sentence patterns and transformations',GRAMMAR_LESSONS.length],
 ['sentences','Sentences','Learn whole everyday expressions',SENTENCE_LIBRARY.length],
 ['stories','Reading','From beginner stories to extended texts',STORIES.length],
 ['dialogues','Conversations','Follow everyday dialogue and responses',DIALOGUES.length],
 ['pinyin','Sounds & tones','Initials, finals and Pinyin contrasts',null],
 ['pathway','Learning pathway','Integrated original course missions',PATHWAY_MISSIONS.length],
 ['skills','Skill Paths','Study original contexts by practical learning skill',null],
 ['advanced','Advanced sources','P35–P51 original context and specialist evidence',C9_ADVANCED_PHASES.reduce((n,p)=>n+p.records.length,0)]
]);
const norm=x=>plain(String(x??''));
const make=(kind,id,title,description,words)=>{
 const search=norm([title,description,words].join(' '));
 return Object.freeze({kind,id,title,description,search});
};
export const COURSE_INDEX=Object.freeze([
 ...DEMO_LESSONS.map(x=>make('characters',x.id,x.hanzi,x.pinyin+' · '+x.meaning,x.note+' '+x.words.map(w=>w.hanzi+' '+w.english).join(' '))),
 ...WORDS.map(x=>make('words',x.key,x.hanzi,x.pinyin+' · '+x.senses.join(', '),x.notes.join(' ')+' '+x.examples.map(e=>e.hanzi).join(' '))),
 ...GRAMMAR_LESSONS.map(x=>make('grammar',x.id,x.title,x.pattern+' · '+x.explanation,x.contrast+' '+x.pitfall)),
 ...SENTENCE_LIBRARY.map(x=>make('sentences',x.id,x.hanzi,x.pinyin+' · '+x.english,x.topic+' '+x.purpose)),
 ...STORIES.map(x=>make('reading',x.id,x.title,x.theme,x.lines.map(l=>l.hanzi+' '+l.english).join(' '))),
 ...DIALOGUES.map(x=>make('dialogues',x.id,x.title,'Connected conversation',x.lines.map(l=>l.hanzi+' '+l.english).join(' '))),
 ...PATHWAY_MISSIONS.map(x=>make('pathway',x.id,x.title,'Band '+x.band+' · '+x.purpose,x.lines.map(l=>l.hanzi+' '+l.english).join(' '))),
 // Search-only composite refs never replace the original source or learner IDs.
 ...C9_ADVANCED_PHASES.flatMap(phase=>phase.records.map(source=>make('advanced',
  'p'+phase.phase+':'+source.id,source.title||source.hanzi||source.grammarTitle||source.goal||source.id,
  'Original P'+phase.phase+' · '+phase.title+' · '+(source.theme||source.category||phase.focus),
  [source.id,source.pinyin,source.goal,source.contrast,source.explanation,
   source.teaching,source.misconception,source.pitfall,source.sourceClaim,
   ...c9AdvancedSourceLines(source).slice(0,32).flatMap(row=>[row.hanzi,row.pinyin,row.english])].filter(Boolean).join(' '))))
]);
export const FIND_CATEGORIES=Object.freeze([['all','All'],['characters','Characters'],['words','Words'],
 ['grammar','Grammar'],['sentences','Sentences'],['reading','Reading'],['dialogues','Dialogues'],['pathway','Pathway'],
 ['advanced','Advanced sources']]);
function savedResult(x,s){
 if(x.kind==='words')return (s.bookmarkedWords||[]).includes(x.id);
 if(x.kind==='sentences')return (s.bookmarkedSentences||[]).includes(x.id);
 if(x.kind==='reading')return (s.bookmarkedStories||[]).includes(x.id);
 if(x.kind==='characters')return (s.learned||[]).includes(x.id);
 return false;
}
export function courseSearch({query='',kind='all',saved=false,state={}}={}){
 const q=norm(query.trim());
 return COURSE_INDEX.map((x,index)=>{
  if(kind!=='all'&&kind!==x.kind||saved&&!savedResult(x,state))return null;
  const name=norm(x.title),desc=norm(x.description);
  const score=!q?1:name===q?100:name.startsWith(q)?75:name.includes(q)?60:desc.includes(q)?40:x.search.includes(q)?15:0;
  return score?{x,index,score}:null;
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.index-b.index).map(row=>row.x);
}
export function courseSearchResults(ui,act,esc){
 const matches=courseSearch(ui),last=Math.max(0,Math.ceil(matches.length/18)-1);
 const page=Math.min(last,Math.max(0,ui.page||0));
 const list=matches.slice(page*18,(page+1)*18);
 return {total:matches.length,page,pages:last+1,html:`<div class="p30-find-head"><strong>${matches.length} source entries</strong><span>${list.length?`${page*18+1}–${page*18+list.length}`:'0'} shown</span></div>
 <div class="p30-find-list">${list.length?list.map(x=>act('p30-open-result',`<span class="p30-result-type">${esc(x.kind)}</span><strong>${esc(x.title)}</strong><small>${esc(x.description)}</small><span aria-hidden="true">↗</span>`,'p30-result',`data-kind="${x.kind}" data-id="${esc(x.id)}"`)).join(''):'<p class="p30-no-results">No entries match these filters. Try a source term, Chinese text, Pinyin, or clear saved-only filtering.</p>'}</div>
 <div class="p30-pagination"><span>Page ${page+1} / ${last+1}</span>${act('p30-page-prev','← Previous','button outline small',page?'':'disabled')}${act('p30-page-next','Next →','button outline small',page<last?'':'disabled')}</div>`};
}
export function unifiedSearchPage(ui,act,esc,title,gated){
 const result=courseSearchResults(ui,act,esc);
 return `${title('COURSE LIBRARY','Find a lesson, word or expression.','One search across original character, vocabulary, grammar, sentence, reading, dialogue, pathway and P35–P51 advanced sources.')}
 ${gated()}<section class="p30-search-page"><label for="p30-query">Search across all course material</label>
 <input id="p30-query" type="search" spellcheck="false" autocomplete="off" placeholder="Search 学校, xué, location, travel…" value="${esc(ui.query)}">
 <div class="p30-search-filters" role="group" aria-label="Content type">${FIND_CATEGORIES.map(([kind,label])=>act('p30-filter',esc(label),'p30-filter '+(ui.kind===kind?'active':''),`data-kind="${kind}" aria-pressed="${ui.kind===kind}"`)).join('')}</div>
 <label class="p30-saved-filter"><input id="p30-saved" type="checkbox" ${ui.saved?'checked':''}> Only saved or introduced native material (advanced sources have no saved flag)</label>
 <div id="p30-results">${result.html}</div></section>
 <p class="p30-source-note">Search opens original teaching and canonical learning routes, never creates a parallel record. Advanced sources carry original P35–P51 IDs but no HSK certification.</p>`;
}
export function courseMap(act,esc){
 return `<section class="p30-courses"><div class="p30-section-title"><div><p class="eyebrow">ONE CONNECTED COURSE</p><h2>Explore a learning skill</h2></div>${act('p30-search','Search the course →','button outline small')}</div>
 <div class="p30-course-grid">${WORKSPACE_DESTINATIONS.map(([route,title,description,count],i)=>`<a href="#/${route}" class="p30-course-tile"><span>${String(i+1).padStart(2,'0')} / ${esc(route.toUpperCase())}</span><strong>${esc(title)}</strong><p>${esc(description)}</p><small>${count===null?'Interactive guide':count+' original entries'} <b aria-hidden="true">↗</b></small></a>`).join('')}</div></section>`;
}
export function coachingPanel({index=0,category='all'}={},act,esc){
 const items=WORKSPACE_COACHING.filter(x=>category==='all'||x.category===category),note=items[((index%items.length)+items.length)%items.length]||WORKSPACE_COACHING[0];
 return `<section class="p30-coach"><div class="p30-section-title"><div><p class="eyebrow">ORIGINAL LANGUAGE COACHING</p><h2>One distinction worth learning</h2></div><span class="muted">${WORKSPACE_COACHING.length} teaching notes</span></div>
 <div class="p30-coach-filters">${['all',...WORKSPACE_COACHING_CATEGORIES].map(kind=>act('p30-coach-filter',kind==='all'?'All':esc(kind),'p30-filter '+(category===kind?'active':''),`data-kind="${kind}"`)).join('')}</div>
 <article class="p30-coach-card"><div class="p30-coach-lesson"><p class="eyebrow">${esc(note.category)} / ${esc(note.title)}</p>
 <h3 lang="zh-Hans">${esc(note.hanzi)}</h3><p class="p30-coach-pinyin">${esc(note.pinyin)}</p><p>${esc(note.english)}</p>
 <div class="p30-coach-explanation"><strong>What to notice</strong><p>${esc(note.explanation)}</p></div>
 <div class="p30-coach-explanation"><strong>Common confusion</strong><p>${esc(note.misconception)}</p></div></div>
 <div class="p30-coach-next"><span class="eyebrow">TRY THIS NEXT</span><p>${esc(note.prompt)}</p>
 ${act('speak','▶ Device Mandarin voice','button outline small',`data-text="${esc(note.hanzi)}"`)}
 ${act('p30-coach-write','Write this example →','button primary',`data-id="${note.id}"`)}${act('p30-coach-destination','Study this topic →','button outline small',`data-route="${note.route}"`)}
 ${act('p30-coach-next','Next teaching note →','button outline small')}</div></article></section>`;
}
export function dashboardHome(state,act,esc,coach){
 const o=courseOverview(state),hub=learningHub(state);
 const shortcuts=courseShortcuts(state);
 return `<div class="p30-home"><section class="p30-hero"><div class="p30-hero-meta"><span class="eyebrow">YOUR NEXT REAL STUDY ACTION</span><span>Local-first · no official HSK assignment</span></div>
 <div class="p30-hero-columns"><div><h2>${esc(hub.primary.label)}</h2><p>${esc(hub.primary.detail)}</p>
 <div class="button-row">${act('hub-primary','Continue where the course needs you →','button primary')}${act('hub-go','Open daily plan →','button outline','data-route="plan"')}</div></div>
 <div class="p30-hero-numbers"><div><strong>${o.due}</strong><small>Due scheduled prompts</small></div><div><strong>${o.introduced} / ${o.total}</strong><small>Characters introduced</small></div><div><strong>${o.supplementary}</strong><small>Supplementary attempts</small></div></div></div></section>
 <section class="p30-today-route"><div class="p30-section-title"><div><p class="eyebrow">YOUR LEARNING DAY</p><h2>Understand · Recall · Use</h2></div></div>
 <div class="p30-route-grid">${[
 ['01','Understand','A new character, word family or grammar pattern in context','learn'],
 ['02','Recall','Retrieve due items without relying on hints','review'],
 ['03','Use','Read a connected passage or practice a natural exchange','stories']
 ].map(([n,title,description,route])=>`<a href="#/${route}"><span>${n}</span><h3>${title}</h3><p>${description}</p><b>Open ${title.toLowerCase()} →</b></a>`).join('')}</div></section>
 ${coachingPanel(coach,act,esc)}${courseMap(act,esc)}
 <section class="p30-continuity"><h2>Shortcuts from your study history</h2><div>${shortcuts.slice(0,4).map(s=>`<a href="#/${s.route}"><strong>${esc(s.label)}</strong><span>${esc(s.description)}</span></a>`).join('')}</div></section></div>`;
}
export function learnWorkspace(state,act,esc,coach){
 const o=courseOverview(state),next=o.nextLesson;
 return `<section class="p30-learn-lead"><div><p class="eyebrow">CHARACTERS IN REAL LANGUAGE</p>
 <h2>${next?`Meet <span lang="zh-Hans">${esc(next.hanzi)}</span> in context`:'Continue learning through real contexts'}</h2>
 <p>${next?`${esc(next.pinyin)} · ${esc(next.meaning)}. Learn its meaning, compare related words, then continue the existing six-stage lesson player.`:'All existing character lessons have been introduced. Reading, production and scheduled recall remain separate.'}</p>
 <div class="button-row">${next?act('course-lesson','Begin this guided lesson →','button primary',`data-id="${next.id}"`):act('hub-go','See your reviews →','button primary','data-route="review"')}
 ${act('pathway-open','Original nine-band pathway →','button outline')}</div></div>
 <div class="p30-learn-count"><strong>${o.introduced} / ${o.total}</strong><span>Characters introduced, not certified mastered</span><div class="p30-rail"><i style="width:${o.total?Math.min(100,100*o.introduced/o.total):0}%"></i></div></div></section>
 ${courseMap(act,esc)}${coachingPanel(coach,act,esc)}`;
}
export function reviewWorkspace(state,act,esc){
 const o=courseOverview(state);
 return `<section class="p30-review-lead"><div><p class="eyebrow">INDEPENDENT RECALL</p><h2>${o.due?`${o.due} scheduled prompts due`:'No scheduled prompts due right now'}</h2><p>Review results remain separate from browsing, assisted explanations and supplementary practice. Skipping does not create a successful result.</p></div>
 <div class="button-row">${act('hub-go','Study saved words →','button outline small','data-route="wordbook"')}${act('hub-go','Sentence writing →','button outline small','data-route="workshop"')}${act('hub-go','Pinyin study →','button outline small','data-route="pinyin"')}</div></section>
 <details class="p30-review-guide"><summary>How to practise without confusing recall and assistance</summary><div><p><strong>Independent:</strong> Retrieve and submit before revealing the answer.</p><p><strong>Assisted:</strong> Use a hint to learn but do not interpret it as independent recall.</p><p><strong>Uncertain:</strong> Leave the prompt due and return to its lesson.</p></div></details>`;
}
export function exploreWorkspace(state,act,esc){
 const words=WORDS.length,saved=(state.bookmarkedWords||[]).length;
 return `<section class="p30-explore-lead"><div><p class="eyebrow">DISCOVER LANGUAGE THROUGH CONNECTIONS</p><h2>Words belong inside sentences</h2>
 <p>Explore original word meanings and contextual examples, then follow related grammar and reading links. Dictionary entries are not official HSK assignments.</p></div>
 <div class="p30-explore-numbers"><strong>${words}</strong><span>Canonical words</span><strong>${saved}</strong><span>Saved vocabulary</span></div>
 <div class="button-row">${act('p30-search','Search all course material →','button primary')}${act('hub-go','Original sentences →','button outline','data-route="sentences"')}</div></section>`;
}
export function progressWorkspace(state,act,esc){
 const o=courseOverview(state);
 const read=new Set((state.readingEvents||[]).map(e=>e.storyId)).size;
 const dialogue=new Set((state.dialogueEvents||[]).map(e=>e.dialogueId)).size;
 const path=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('pathway:')&&e.correct&&!e.assisted).length;
 const measures=[['Characters introduced',o.introduced,o.total,'learn'],['Readings attempted',read,STORIES.length,'stories'],['Dialogues attempted',dialogue,DIALOGUES.length,'dialogues']];
 return `<section class="p30-evidence"><div class="p30-section-title"><div><p class="eyebrow">WHAT YOUR RECORDS ACTUALLY SHOW</p><h2>Practice evidence, not a proficiency claim</h2></div></div>
 <p>Character introductions, independent review answers and other study attempts are different observations. Do not infer official HSK completion from any counter.</p>
 <div class="p30-evidence-numbers"><article><strong>${o.introduced}</strong><span>Introduced character lessons</span></article>
 <article><strong>${o.scheduled.independent}</strong><span>Independent correct scheduled attempts</span></article>
 <article><strong>${o.scheduled.assisted}</strong><span>Assisted scheduled attempts</span></article><article><strong>${path}</strong><span>Independent correct pathway responses</span></article></div>
 <div class="p30-evidence-lower"><div><h3>Collection exposure</h3>${measures.map(([label,n,total,route])=>`<a href="#/${route}" class="p30-evidence-row"><span>${esc(label)}</span><strong>${n} / ${total}</strong><div class="p30-rail"><i style="width:${total?Math.min(100,100*n/total):0}%"></i></div></a>`).join('')}</div>
 <div><h3>Supplementary event types</h3>${o.types.filter(k=>k.key!=='events').sort((a,b)=>b.count-a.count).slice(0,7).map(k=>`<div class="p30-evidence-type"><span>${esc(k.label)}</span><strong>${k.count}</strong></div>`).join('')}</div></div>
 <div class="button-row">${act('hub-go','Scheduled review →','button primary','data-route="review"')}${act('hub-go','Daily plan →','button outline','data-route="plan"')}${act('pathway-open','Connected pathway →','button outline')}</div></section>`;
}