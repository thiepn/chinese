/** P41 source-linked learner reading. The canonical STORIES, readingEvents,
 * beginnerQuestion, grammar and Sentence Workshop own all assessment evidence.
 */
import {P41_PASSAGES} from './p41-readings.mjs';
import {STORIES} from './stories.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
const storyFor=p=>STORIES.find(st=>st.beginner?.p41?.id===p.id)||null;
const attempts=(state,id)=>(state.readingEvents||[]).filter(e=>e.storyId===id);
export const p41Next=state=>P41_PASSAGES.find(p=>{
 const st=storyFor(p);
 return st&&!attempts(state,st.id).some(e=>e.correct&&!e.assisted);
})||P41_PASSAGES[0];
export function p41Overview(state,act,esc,{compact=false,stage='all',query='',page=0,selected=null}={}){
 const q=String(query).trim().toLocaleLowerCase();
 const pool=P41_PASSAGES.filter(p=>(stage==='all'||String(p.stage)===String(stage))&&
 (!q||[p.title,p.theme,p.format,p.notes.teaching,p.notes.misconception,...p.grammarIds,
 ...p.lines.map(l=>l.hanzi)].join(' ').toLocaleLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(pool.length/6)),current=Math.max(0,Math.min(pages-1,Number(page)||0));
 const attempted=P41_PASSAGES.filter(p=>{const st=storyFor(p);return st&&attempts(state,st.id).length>0;}).length;
 const correct=P41_PASSAGES.filter(p=>{const st=storyFor(p);return st&&attempts(state,st.id).some(e=>e.correct&&!e.assisted);}).length;
 const next=p41Next(state);
 return '<section class="p41-overview" aria-label="P41 intermediate original reading">'+
 '<div class="p41-hero"><div><p class="eyebrow">P41 · ORIGINAL INTERMEDIATE READING</p>'+
 '<h2>Read the evidence. Distinguish what actually happened.</h2>'+
 '<p>Twelve progressively complex, sixteen-sentence original texts: four coherent sections each, complete tone-marked Pinyin and English translations, 36 source-evidence comprehension questions, source-linked vocabulary, P40 grammar and independent written recall. These are teaching targets, not an official HSK 3.0 reader.</p></div>'+
 '<div class="p41-progress"><strong>'+attempted+' / '+P41_PASSAGES.length+'</strong><span>Readings attempted</span>'+
 '<strong>'+correct+' / '+P41_PASSAGES.length+'</strong><span>With an independent correct practice response, not certified mastery</span>'+
 act('p41-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div></div>'+
 (compact?'<div class="button-row">'+act('p41-browse','Browse twelve readings →','button outline')+'</div>':
 '<div class="p41-filters" role="group" aria-label="P41 reading progression">'+
 [['all','All passages'],['3','Intermediate stage 1'],['4','Intermediate stage 2'],['5','Intermediate stage 3']].map(([v,label])=>
 act('p41-stage',label,'p41-filter '+(String(stage)===v?'active':''),'data-stage="'+v+'" aria-pressed="'+(String(stage)===v)+'"')).join('')+'</div>'+
 '<label for="p41-search">Find by passage, topic, Chinese expression or grammar</label>'+
 '<input id="p41-search" type="search" value="'+esc(query)+'" placeholder="Try 资料, evidence, g116" autocomplete="off">'+
 '<div class="p41-grid">'+pool.slice(current*6,current*6+6).map(p=>{
 const st=storyFor(p),n=st?attempts(state,st.id).length:0;
 return act('p41-open','<small>'+String(p.sequence).padStart(2,'0')+' · '+esc(p.theme)+' · Stage '+(p.stage-2)+'</small>'+
 '<strong>'+esc(p.title)+'</strong><em>'+esc(p.format)+'</em><span>16 sentences · 4 sections · 3 evidence questions</span>'+
 '<span>'+(n?n+' practice attempts':'Not attempted')+(st&&(state.bookmarkedStories||[]).includes(st.id)?' · Saved':'')+'</span>',
 'p41-card '+(selected===p.id?'active':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+
 (!pool.length?'<p class="muted">No readings match the selected filters.</p>':'')+
 '<nav class="p41-pages" aria-label="P41 reading pages">'+act('p41-prev','← Previous','button outline small',current>0?'':'disabled')+
 '<span>Page '+(current+1)+' / '+pages+'</span>'+act('p41-next-page','Next →','button outline small',current<pages-1?'':'disabled')+'</nav>')+'</section>';
}
export function p41PassagePanel(story,act,esc,{section='all',pinyin=false,english=false,assisted=false}={}){
 const p=story?.beginner?.p41;if(!p)return '';
 const sectionValue=String(section);
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const matches=WORDS.filter(w=>w.hanzi.length>=2&&p.lines.some(l=>l.hanzi.includes(w.hanzi))).slice(0,10);
 const chars=P39_CHARACTER_GUIDES.filter(g=>p.lines.some(l=>l.hanzi.includes(g.hanzi))).slice(0,6);
 return '<section class="p41-study" aria-label="P41 four-section passage">'+
 '<div class="p41-study-head"><div><p class="eyebrow">INTERMEDIATE READING '+p.sequence+' / '+P41_PASSAGES.length+
 ' · '+esc(p.format.toUpperCase())+'</p><h3>'+esc(p.title)+'</h3><p>'+esc(p.notes.teaching)+'</p></div>'+
 '<span>16 complete sentences · 4 connected sections</span></div>'+
 '<nav class="p41-sections" aria-label="Reading sections">'+
 [['all','Entire text'],...p.paragraphs.map((part,i)=>[String(i+1),(i+1)+'. '+part.title])].map(([value,label])=>
 act('p41-section',label,'p41-section-btn '+(sectionValue===value?'active':''),'data-section="'+value+'" aria-pressed="'+(sectionValue===value)+'"')).join('')+
 act('p41-next-section','Next section →','button outline small')+'</nav>'+
 '<div class="p41-text">'+p.paragraphs.filter((part,i)=>sectionValue==='all'||sectionValue===String(i+1)).map(part=>
 '<article class="p41-paragraph"><h4>'+esc(part.title)+'</h4>'+
 p.lines.slice(part.start,part.end+1).map((l,i)=>'<div class="p41-line"><span>'+(part.start+i+1)+'</span>'+
 '<div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+(pinyin?'<small class="p41-pinyin">'+esc(l.pinyin)+'</small>':'')+
 (english?'<small class="p41-english">'+esc(l.english)+'</small>':'')+'</div>'+
 act('speak','Listen','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>').join('')+'</article>').join('')+'</div>'+
 '<div class="p41-support">'+act('p41-pinyin',pinyin?'Hide Pinyin':'Reveal Pinyin · assisted','button outline small')+
 act('p41-english',english?'Hide translation':'Reveal English · assisted','button outline small')+
 act('p41-audio','Listen to this section','button outline small')+
 '<span>'+(assisted?'Help shown · subsequent reading answers assisted':'Read independently before requesting support')+'</span></div>'+
 '<div class="p41-teaching"><article><h4>How to interpret the source</h4><p>'+esc(p.notes.teaching)+'</p></article>'+
 '<article><h4>Common unsupported inference</h4><p>'+esc(p.notes.misconception)+'</p></article>'+
 '<article><h4>Evidence questions</h4><p>Use the existing three native modes: detail, reason and sequence. Each explanation points to a precise original line after you answer.</p></article></div>'+
 '<div class="p41-crosslinks"><h4>Continue with the original course</h4><div class="button-row">'+
 act('p41-write','Reconstruct the final sentence from memory →','button primary','data-id="'+p.id+'"')+
 act('p41-next-reading','Next reading →','button outline')+
 act('p41-browse','All P41 readings →','button outline')+'</div>'+
 (grammar.length?'<div class="p41-links"><strong>Original P40 and earlier grammar</strong>'+grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+'</div>':'')+
 (chars.length?'<div class="p41-links"><strong>P39 contextual character lessons</strong>'+chars.map(g=>act('p39-open',esc(g.hanzi)+' · '+esc(g.meaning),'button outline small','data-id="'+g.id+'"')).join('')+'</div>':'')+
 (matches.length?'<div class="p41-links"><strong>Canonical vocabulary and Wordbook</strong>'+matches.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin),'button outline small','data-id="'+esc(w.key)+'"')).join('')+'</div>':'')+
 '</div><p class="p41-disclaimer">Original independently authored illustrative Mandarin. Exact-form checks have limited alternate-translation coverage. Revealing explanations or translations affects the native assisted flag; reading practice never creates scheduled-review mastery.</p></section>';
}
