/** P39 source-only intermediate character and vocabulary workspaces.
 * Every learner action routes to original Course, Wordbook, Reader or Workshop.
 */
import {P39_CHARACTER_GUIDES,P39_VOCABULARY,P39_THEMES,P39_WRITING_TASKS,findP39Guide,nextP39Guide} from './p39-foundations.mjs';
import {findWord,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
const known=(state,id)=>(state.learned||[]).includes(id);
function filtered(state,{theme='all',status='all',query=''}={}){
 const q=String(query).trim().toLocaleLowerCase();
 return P39_CHARACTER_GUIDES.filter(g=>
 (theme==='all'||g.category===theme)&&
 (status==='all'||(status==='introduced'?known(state,g.id):!known(state,g.id)))&&
 (!q||[g.hanzi,g.pinyin,g.meaning,g.category,g.explanation,...g.words.flatMap(w=>[w.hanzi,w.pinyin,w.english])].join(' ').toLocaleLowerCase().includes(q)));
}
export function p39Overview(state,act,esc,{compact=false}={}){
 const count=P39_CHARACTER_GUIDES.filter(g=>known(state,g.id)).length;
 const wordCount=P39_VOCABULARY.filter(w=>(state.vocabularyIntroduced||[]).includes(canonicalWordKey(w.hanzi,w.pinyin))).length;
 const next=nextP39Guide(state);
 const independent=new Set((state.sentenceEvents||[]).filter(e=>e.correct&&!e.assisted&&e.taskId.startsWith('p39:')).map(e=>e.taskId)).size;
 return '<section class="p39-overview '+(compact?'compact':'')+'" aria-label="P39 intermediate character and word study">'+
 '<div><p class="eyebrow">P39 · ORIGINAL INTERMEDIATE MANDARIN</p><h2>Read situations, distinguish meaning, produce sentences</h2>'+
 '<p>'+P39_CHARACTER_GUIDES.length+' character lessons and '+P39_WRITING_TASKS.length+' original contextual sentences across decisions, information, collaboration and community. HSK 3-targeted teaching only; not an official HSK 3.0 inventory or proficiency claim.</p>'+
 '<div class="p39-stats"><span><strong>'+count+' / '+P39_CHARACTER_GUIDES.length+'</strong>characters introduced</span>'+
 '<span><strong>'+wordCount+' / '+P39_VOCABULARY.length+'</strong>context-attested words introduced</span>'+
 '<span><strong>'+independent+' / '+P39_WRITING_TASKS.length+'</strong>independent sentence models</span></div></div>'+
 '<div class="p39-actions">'+(next?act('p39-open','Continue '+esc(next.hanzi)+' · '+esc(next.meaning)+' →','button primary','data-id="'+next.id+'"'):'')+
 act('p39-browse','Browse '+P39_CHARACTER_GUIDES.length+' characters →','button outline')+
 act('p39-vocab','Open contextual words →','button outline')+
 act('p39-sentences','Practise '+P39_WRITING_TASKS.length+' original sentences →','button outline')+'</div></section>';
}
export function p39CharacterShelf(state,act,esc,filters={}){
 const pool=filtered(state,filters),page=Math.max(0,Math.min(Math.max(0,Math.ceil(pool.length/10)-1),Number(filters.page)||0));
 const totalPages=Math.max(1,Math.ceil(pool.length/10));const current=pool.slice(page*10,page*10+10);
 return '<section class="p39-shelf" id="p39-character-library" aria-label="P39 intermediate characters">'+
 '<div class="p39-heading"><h2>Intermediate characters in context</h2><small>'+pool.length+' matching · Page '+(page+1)+' / '+totalPages+'</small></div>'+
 '<div class="p39-filters" role="group" aria-label="P39 theme">'+
 ['all',...P39_THEMES].map(theme=>act('p39-theme',esc(theme==='all'?'All themes':theme),'p39-chip '+((filters.theme||'all')===theme?'active':''),'data-theme="'+esc(theme)+'" aria-pressed="'+((filters.theme||'all')===theme)+'"')).join('')+'</div>'+
 '<div class="p39-filters" role="group" aria-label="P39 progress">'+
 [['all','All'],['new','Not introduced'],['introduced','Introduced']].map(([s,l])=>act('p39-status',l,'p39-chip '+((filters.status||'all')===s?'active':''),'data-status="'+s+'" aria-pressed="'+((filters.status||'all')===s)+'"')).join('')+'</div>'+
 '<label for="p39-search" class="p39-search-label">Search Chinese, tone-marked Pinyin or English</label>'+
 '<input type="search" id="p39-search" value="'+esc(filters.query||'')+'" placeholder="Try juédìng, compare, 资料" autocomplete="off">'+
 '<div class="p39-rows">'+current.map(g=>
 act('p39-open','<span class="p39-hanzi" lang="zh-Hans">'+esc(g.hanzi)+'</span><span><strong>'+esc(g.pinyin)+'</strong><small>'+esc(g.meaning)+'</small><em>'+esc(g.category)+'</em></span><span class="p39-state">'+(known(state,g.id)?'Introduced':'New')+'</span>',
 'p39-row','data-id="'+g.id+'"')).join('')+'</div>'+
 (!current.length?'<p>No character matches the selected filters.</p>':'')+
 '<div class="p39-pager">'+act('p39-prev','← Previous','button outline small',page?'':'disabled')+
 '<span>Page '+(page+1)+' / '+totalPages+'</span>'+
 act('p39-next','Next →','button outline small',page<totalPages-1?'':'disabled')+'</div></section>';
}
export function p39LessonTeaching(lesson,act,esc,state={}){
 const g=findP39Guide(lesson?.id);if(!g)return '';
 const closest=STORIES.filter(s=>s.lines.some(l=>l.hanzi.includes(g.hanzi))).slice(-3);
 const writing=g.examples.map((ex,i)=>{
 const id='p39:'+g.id+':line'+(i+1),results=(state.sentenceEvents||[]).filter(e=>e.taskId===id);
 const correct=results.some(e=>e.correct&&!e.assisted);
 return '<article class="p39-example"><div><strong lang="zh-Hans">'+esc(ex.hanzi)+'</strong><small>'+esc(ex.pinyin)+'</small><p>'+esc(ex.english)+'</p></div>'+
 '<div><span class="p39-evidence">'+(correct?'Independent model recorded':results.length?'Attempted':'Not attempted')+'</span>'+
 act('p39-write','Write this sentence →','button outline small','data-id="'+g.id+'" data-index="'+i+'"')+'</div></article>';
 }).join('');
 return '<section class="p39-teaching" aria-label="P39 source-linked intermediate character teaching">'+
 '<p class="eyebrow">'+esc(g.category)+' · LESSON '+g.order+' · AUTHORIAL HSK 3-TARGETED</p>'+
 '<h3>'+esc(g.grammarTitle)+'</h3><p>'+esc(g.explanation)+'</p>'+
 '<div class="p39-contrast"><strong>Meaning contrast and a specific misconception</strong><p>'+esc(g.pitfall)+'</p>'+
 '<p><strong>Pronunciation:</strong> '+esc(g.pronunciation)+'</p></div>'+
 '<h3>Useful word family</h3><div class="p39-word-grid">'+g.words.map(w=>{
  const record=findWord(canonicalWordKey(w.hanzi,w.pinyin));
  return '<article><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><small>'+esc(w.pinyin)+'</small><p>'+esc(w.english)+'</p>'+
  (record?act('vocabulary-start','Learn in Wordbook →','button outline small','data-id="'+esc(record.key)+'"'):'')+'</article>';
 }).join('')+'</div>'+
 '<h3>Produce the full sentence</h3><p>First study the model, then write the whole sentence independently. Native Workshop assesses the taught written form only and records whether assistance was used.</p>'+
 '<div class="p39-examples">'+writing+'</div>'+
 '<div class="button-row">'+act('p39-browse','Other P39 characters →','button outline small')+
 act('p39-vocab','Intermediate vocabulary →','button outline small')+
 act('p39-sentences','P39 Sentence Library →','button outline small')+
 act('grammar-open','Review grammar patterns →','button outline small')+
 act('open-practice','Scheduled character review →','button outline small')+'</div>'+
 (closest.length?'<h3>Encounter this character in earlier reading</h3><div class="button-row">'+
 closest.map(s=>act('open-story-link',esc(s.title)+' →','button outline small','data-id="'+s.id+'"')).join('')+'</div>':'')+
 '<p class="p39-disclaimer">Editorial teaching targets, not official HSK 3.0 character assignments. Models require later independent Mandarin review.</p></section>';
}
export function p39VocabShelf(state,act,esc,{page=0}={}){
 const count=Math.max(1,Math.ceil(P39_VOCABULARY.length/10));
 const current=Math.max(0,Math.min(count-1,Number(page)||0));
 return '<section class="p39-vocab" id="p39-vocab-library"><div class="p39-heading"><h2>P39 · Context-attested words</h2><small>'+P39_VOCABULARY.length+' records · Page '+(current+1)+' / '+count+'</small></div>'+
 '<p>Only words found in original authored sentences receive these extended context cards. All word families remain in the character lessons and canonical Wordbook.</p>'+
 '<div class="p39-word-grid">'+P39_VOCABULARY.slice(current*10,current*10+10).map(w=>{
 const existing=findWord(canonicalWordKey(w.hanzi,w.pinyin));
 const seen=existing&&(state.vocabularyIntroduced||[]).includes(existing.key);
 const e=w.examples[0];
 return '<article><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><small>'+esc(w.pinyin)+'</small><h3>'+esc(w.meaning)+'</h3>'+
 '<p>'+esc(w.notes[0])+'</p><div class="p39-example"><strong lang="zh-Hans">'+esc(e.hanzi)+'</strong><small>'+esc(e.pinyin)+'</small><p>'+esc(e.english)+'</p></div>'+
 '<div class="button-row">'+(existing?act('vocabulary-start',seen?'Review word →':'Study word →','button primary small','data-id="'+esc(existing.key)+'"')+
 act('lookup-word','All contexts →','button outline small','data-id="'+esc(existing.key)+'"'):'')+'</div></article>';
 }).join('')+'</div>'+
 '<div class="p39-pager">'+act('p39-word-prev','← Previous','button outline small',current?'':'disabled')+
 '<span>Page '+(current+1)+' / '+count+'</span>'+act('p39-word-next','Next →','button outline small',current<count-1?'':'disabled')+'</div></section>';
}
