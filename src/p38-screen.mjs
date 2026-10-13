/** P38 learner-facing extended reading workspace.
 * Display-only interface; canonical STORIES, readingEvents, sentenceEvents,
 * bookmarks and authorised review state remain the only authorities.
 */
import {P38_PASSAGES,findP38Passage} from './p38-readings.mjs';
import {STORIES} from './stories.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey,findWord} from './lexicon.mjs';
import {P37_SCENES} from './p37-scenarios.mjs';
const storyFor=passage=>STORIES.find(s=>s.beginner?.p38?.id===passage.id);
const attempted=(state,storyId)=>(state.readingEvents||[]).filter(e=>e.storyId===storyId);
export const p38Next=(state)=>{
 const answer=P38_PASSAGES.find(p=>{
  const st=storyFor(p);
  return st&&!attempted(state,st.id).some(e=>e.correct&&!e.assisted);
 });
 return answer||P38_PASSAGES[0];
};
const count=(state)=>P38_PASSAGES.filter(p=>{
 const st=storyFor(p);return st&&attempted(state,st.id).length;
}).length;
export function p38Overview(state,act,esc,{compact=false,stage='all',query='',page=0,selected=null}={}){
 const q=String(query).trim().toLocaleLowerCase();
 const candidates=P38_PASSAGES.filter(p=>(stage==='all'||String(p.level)===String(stage))&&
 (!q||[p.title,p.theme,p.format,p.notes.teaching,...p.grammarIds].join(' ').toLocaleLowerCase().includes(q)));
 const last=Math.max(0,Math.ceil(candidates.length/10)-1),current=Math.min(Math.max(page,0),last);
 const recent=p38Next(state);
 const done=P38_PASSAGES.filter(p=>{
  const st=storyFor(p);return st&&(state.readingEvents||[]).some(e=>e.storyId===st.id&&e.correct&&!e.assisted);
 }).length;
 return '<section class="p38-overview" aria-label="P38 elementary graded reader">'+
 '<div class="p38-summary"><div><p class="eyebrow">P38 · ELEMENTARY READING STUDIO</p><h2>Read beyond isolated sentences</h2>'+
 '<p>30 ten-line connected readings adapted from original P37 everyday conversations, with new original contextual framing, three source-evidence questions each, cloze, ordering, pronunciation and independent written recall. The reading adaptations are not independent official HSK texts.</p>'+
 '<p class="p38-source-note">These texts transparently reuse earlier original P37 Mandarin conversations. No published reading corpus, official HSK certification, live service data or audio recording is included.</p></div>'+
 '<div class="p38-metrics"><strong>'+count(state)+' / 30</strong><span>Readings attempted</span>'+
 '<strong>'+done+' / 30</strong><span>With a correct independent answer, not certified mastery</span>'+
 act('p38-open',esc('Continue: '+recent.title)+' →','button primary small','data-id="'+recent.id+'"')+'</div></div>'+
 (compact?'<div class="button-row">'+act('p38-browse','Browse all 30 readings →','button outline')+'</div>':
 '<div class="p38-filters" role="group" aria-label="Reading difficulty stage">'+
 [['all','All stages'],['2','Stage 1'],['3','Stage 2'],['4','Stage 3']].map(([v,name])=>act('p38-stage',name,'p38-filter '+(String(stage)===v?'active':''),'data-stage="'+v+'" aria-pressed="'+(String(stage)===v)+'"')).join('')+'</div>'+
 '<label for="p38-search">Search passage, situation or grammar</label>'+
 '<input id="p38-search" type="search" value="'+esc(query)+'" placeholder="e.g. appointments, study, g94" autocomplete="off">'+
 '<div class="p38-grid">'+candidates.slice(current*10,(current+1)*10).map(p=>{
 const st=storyFor(p),started=st?attempted(state,st.id):[];
 return act('p38-open','<span>'+String(p.sequence).padStart(2,'0')+' · '+esc(p.theme)+' · Stage '+(p.level-1)+'</span>'+
 '<strong>'+esc(p.title)+'</strong><small>'+esc(p.format)+' · 10 connected sentences</small>'+
 '<em>'+(started.length?started.length+' practice attempts':'Not attempted')+
 (st&&(state.bookmarkedStories||[]).includes(st.id)?' · Saved':'')+'</em>',
 'p38-passage-card '+(selected===p.id?'selected':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+
 (!candidates.length?'<p class="muted">No matching passages; clear the search or change the stage.</p>':'')+
 '<div class="p38-pagination">'+act('p38-page-prev','← Previous','button outline small',current?'':'disabled')+
 '<span>Page '+(current+1)+' / '+(last+1)+'</span>'+
 act('p38-page-next','Next →','button outline small',current<last?'':'disabled')+'</div>')+'</section>';
}
export function p38PassagePanel(story,act,esc,{section='all',pinyin=false,english=false,assisted=false}={}){
 const p=story?.beginner?.p38;if(!p)return '';
 const selected=section==='all'?'all':String(section);
 const groups=[[0,2,'Situation'],[3,6,'What happens'],[7,9,'Outcome']];
 const matchedWords=WORDS.filter(w=>w.hanzi.length>=2&&p.lines.some(l=>l.hanzi.includes(w.hanzi))).slice(0,8);
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const related=P37_SCENES.find(s=>s.id===p.originSceneId);
 return '<section class="p38-study" aria-label="P38 reading support and progression"><div class="p38-study-head">'+
 '<div><p class="eyebrow">READING '+p.sequence+' / 30 · '+esc(p.format.toUpperCase())+' · STAGE '+(p.level-1)+'</p>'+
 '<h3>'+esc(p.title)+'</h3><p>'+esc(p.notes.teaching)+'</p></div>'+
 '<span>10 lines · 3 sections</span></div>'+
 '<div class="p38-section-controls" role="group" aria-label="Select section">'+
 [['all','Full passage'],...groups.map((g,i)=>[String(i+1),String(i+1)+'. '+g[2]])].map(([v,n])=>
 act('p38-section',n,'p38-section-button '+(v===selected?'active':''),'data-section="'+v+'" aria-pressed="'+(v===selected)+'"')).join('')+
 act('p38-next-section','Next section →','button outline small')+'</div>'+
 '<div class="p38-section-preview"><h4>Read the selected section without translations</h4>'+
 groups.filter((g,i)=>selected==='all'||selected===String(i+1)).map(([start,end,name])=>'<div class="p38-paragraph">'+
 '<h5>'+esc(name)+'</h5>'+p.lines.slice(start,end+1).map((line,index)=>
 '<div class="p38-paragraph-line"><span class="p38-line-number">'+(start+index+1)+'</span>'+
 '<div><p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 (pinyin?'<small class="p38-pinyin">'+esc(line.pinyin)+'</small>':'')+
 (english?'<small class="p38-english">'+esc(line.english)+'</small>':'')+'</div>'+
 act('speak','Listen','button outline small','data-text="'+esc(line.hanzi)+'"')+'</div>').join('')+
 '</div>').join('')+'</div>'+
 '<div class="p38-support-controls">'+act('p38-pinyin',pinyin?'Hide Pinyin':'Show Pinyin · assisted','button outline small','aria-pressed="'+pinyin+'"')+
 act('p38-english',english?'Hide translation':'Show English · assisted','button outline small','aria-pressed="'+english+'"')+
 act('p38-audio','Play selected section','button outline small')+
 act('p38-audio-slow','Replay slowly','button outline small')+
 '<span>'+ (assisted?'Teaching support revealed · assisted answers':'Support hidden · independent reading available')+'</span></div>'+
 '<div class="p38-teaching"><article><h4>Meaning and grammar</h4><p>'+esc(p.notes.teaching)+'</p></article>'+
 '<article><h4>Pronunciation focus</h4><p>'+esc(p.notes.pronunciation)+'</p></article>'+
 '<article><h4>A common misunderstanding</h4><p>'+esc(p.notes.misconception)+'</p></article></div>'+
 '<div class="p38-links"><h4>Transfer this reading into other practice</h4><div class="button-row">'+
 (related?act('p37-open','Open original P37 conversation →','button outline small','data-id="'+related.id+'"'):'')+
 act('p38-write','Write from this reading independently →','button primary small','data-id="'+p.id+'"')+
 act('p38-next-reading','Next unmastered reading →','button outline small')+'</div>'+
 '<div class="p38-grammar-links">'+grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+'</div>'+
 '<div class="p38-vocabulary-links">'+matchedWords.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin),'button outline small','data-id="'+esc(w.key)+'"')).join('')+'</div></div>'+
 '<p class="p38-source-note">Context is adapted from earlier independently authored P37 material. Revealing Pinyin or English makes later reading answers assisted. Saving a bookmark records a personal preference, not assessed mastery.</p>'+
 '</section>';
}
