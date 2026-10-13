/** P35 elementary Mandarin learning UI.
 * All navigation links go to the existing Course, Wordbook, Grammar, Reading,
 * Sentence Library and Workshop. No parallel progress/scoring engine.
 */
import {P35_CHARACTER_GUIDES,P35_THEMES,P35_WRITING_TASKS,findP35Guide,nextP35Guide} from './p35-foundations.mjs';
import {P35_VOCABULARY} from './p35-vocabulary.mjs';
import {WORDS,findWord,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {P31_CHARACTER_GUIDES} from './p31-foundations.mjs';
const learned=(state,id)=>(state.learned||[]).includes(id);
const results=(state,theme='all',status='all',query='')=>{
 const q=String(query).trim().toLocaleLowerCase();
 return P35_CHARACTER_GUIDES.filter(g=>(theme==='all'||g.category===theme)&&
 (status==='all'||(status==='introduced'?learned(state,g.id):!learned(state,g.id)))&&
 (!q||[g.hanzi,g.pinyin,g.meaning,g.explanation,g.category,...g.words.flatMap(w=>[w.hanzi,w.pinyin,w.english])].join(' ').toLocaleLowerCase().includes(q)));
};
export function p35Overview(state,act,esc,{compact=false}={}){
 const done=P35_CHARACTER_GUIDES.filter(g=>learned(state,g.id)).length;
 const wordDone=P35_VOCABULARY.filter(v=>(state.vocabularyIntroduced||[]).includes(canonicalWordKey(v.hanzi,v.pinyin))).length;
 const next=nextP35Guide(state);
 const previous=P31_CHARACTER_GUIDES.filter(g=>learned(state,g.id)).length;
 return '<section class="p35-home '+(compact?'compact':'')+'" aria-label="P35 expanded character and vocabulary course">'+
 '<div><p class="eyebrow">P35 · ORIGINAL ELEMENTARY MANDARIN</p><h2>Move beyond first-step Chinese</h2>'+
 '<p>70 new character lessons, contextual word families, tone contrasts, complete sentences and guided production. This is an original pedagogical sequence, not an official HSK 3.0 syllabus assignment.</p>'+
 '<div class="p35-metrics"><span><strong>'+done+' / 70</strong>characters introduced</span>'+
 '<span><strong>'+wordDone+' / '+P35_VOCABULARY.length+'</strong>contextual words introduced</span>'+
 '<span><strong>'+previous+' / '+P31_CHARACTER_GUIDES.length+'</strong>earlier P31 lessons introduced</span></div></div>'+
 '<div class="p35-home-actions">'+
 (next?act('p35-open-lesson','Continue '+esc(next.hanzi)+' · '+esc(next.meaning)+' →','button primary','data-id="'+next.id+'"'):'')+
 act('p35-browse','Browse all characters →','button outline')+
 act('p35-vocab-open','Study P35 words →','button outline')+'</div></section>';
}
export function p35CharacterShelf(state,act,esc,{theme='all',status='all',query='',page=0}={}){
 const pool=results(state,theme,status,query),last=Math.max(0,Math.ceil(pool.length/12)-1),shown=Math.max(0,Math.min(last,page));
 const selection=pool.slice(shown*12,shown*12+12),next=nextP35Guide(state,theme);
 return '<section id="p35-character-library" class="p35-library" aria-label="P35 character discovery">'+
 '<div class="p35-title-row"><div><p class="eyebrow">70 AUTHORED CHARACTER LESSONS</p><h2>Choose a character by useful situation</h2></div><span>'+pool.length+' matching · Page '+(shown+1)+' / '+(last+1)+'</span></div>'+
 '<div class="p35-filters" role="group" aria-label="Filter character unit">'+
 ['all',...P35_THEMES].map(x=>act('p35-theme',esc(x==='all'?'All themes':x),'p35-filter '+(theme===x?'active':''),'data-theme="'+esc(x)+'" aria-pressed="'+(theme===x)+'"')).join('')+'</div>'+
 '<div class="p35-filters" role="group" aria-label="Filter by previous introduction">'+
 [['all','All'],['new','Not introduced'],['introduced','Introduced']].map(([x,label])=>act('p35-status',label,'p35-filter '+(status===x?'active':''),'data-status="'+x+'" aria-pressed="'+(status===x)+'"')).join('')+'</div>'+
 '<label for="p35-search" class="p35-search-label">Character, Pinyin or English meaning</label>'+
 '<input id="p35-search" type="search" value="'+esc(query)+'" placeholder="e.g. jiè, help, 出口" autocomplete="off">'+
 '<div class="p35-characters">'+selection.map(g=>{
 const seen=learned(state,g.id);
 return act('p35-open-lesson','<span class="p35-char">'+esc(g.hanzi)+'</span><span class="p35-char-details"><strong>'+esc(g.pinyin)+'</strong><small>'+esc(g.meaning)+'</small><em>'+esc(g.category)+'</em></span><span class="p35-char-status">'+(seen?'Introduced':'New')+'</span>',
 'p35-character-row '+(seen?'seen':''),'data-id="'+g.id+'"');
 }).join('')+'</div>'+
 (!selection.length?'<p class="p35-no-match">No characters match these filters. Try another theme or search.</p>':'')+
 '<div class="p35-pagination">'+
 act('p35-page-prev','← Previous','button outline small',shown?'':'disabled')+
 '<span>Page '+(shown+1)+' of '+(last+1)+'</span>'+
 act('p35-page-next','Next →','button outline small',shown<last?'':'disabled')+'</div>'+
 (next?'<p class="p35-next-hint">Suggested next lesson: '+act('p35-open-lesson',esc(next.hanzi)+' '+esc(next.meaning)+' →','button outline small','data-id="'+next.id+'"')+'</p>':'')+'</section>';
}
export function p35LessonTeaching(lesson,act,esc){
 const g=findP35Guide(lesson?.id);if(!g)return '';
 const words=g.words.map(w=>({data:w,entry:findWord(canonicalWordKey(w.hanzi,w.pinyin))}));
 const matched=SENTENCE_LIBRARY.filter(s=>s.source==='original-p35'&&s.hanzi.includes(g.hanzi)).slice(0,5);
 const stories=STORIES.filter(st=>st.lines.some(line=>line.hanzi.includes(g.hanzi))).slice(0,2);
 const dialogues=DIALOGUES.filter(d=>d.lines.some(t=>t.hanzi.includes(g.hanzi))).slice(0,2);
 const relatedGrammar=GRAMMAR_LESSONS.filter(x=>g.examples.some(e=>x.examples?.some(ge=>e.hanzi.includes(ge.hanzi)))).slice(0,2);
 return '<section class="p35-teaching" aria-label="Detailed P35 original character instruction">'+
 '<div class="p35-teaching-label"><span>'+esc(g.category)+' · Lesson '+(202+g.sequence)+'</span><span>Original study material · not official HSK data</span></div>'+
 '<div class="p35-teaching-cols"><div><p class="eyebrow">MEANING & WORD FORMATION</p><h3>'+esc(g.grammarTitle)+'</h3>'+
 '<p>'+esc(g.explanation)+'</p><p class="p35-pattern"><strong>Language pattern:</strong> '+esc(g.grammarPattern)+
 '</p><p>'+esc(g.grammarExplanation)+'</p></div>'+
 '<div><p class="eyebrow">PRONUNCIATION & ERROR REPAIR</p><p>'+esc(g.pronunciation)+'</p>'+
 '<div class="p35-mistake"><strong>What learners confuse</strong><p>'+esc(g.pitfall)+'</p></div></div></div>'+
 '<div class="p35-lesson-words"><div class="p35-title-row"><h3>Word family and collocations</h3><small>Use the existing Wordbook to learn each expression.</small></div>'+
 '<div class="p35-family-grid">'+words.map(({data:w,entry})=>'<article class="p35-family-card"><div lang="zh-Hans">'+esc(w.hanzi)+'</div><strong>'+esc(w.pinyin)+'</strong><p>'+esc(w.english)+'</p>'+
 '<div class="p35-card-actions">'+(entry?act('vocabulary-start','Study word →','button primary small','data-id="'+esc(entry.key)+'"')+
 act('lookup-word','Context ↗','button outline small','data-id="'+esc(entry.key)+'"'):'')+'</div></article>').join('')+'</div></div>'+
 '<div class="p35-transfer"><h3>Retrieve a complete Mandarin sentence</h3><p>Read the model, then open the original Sentence Workshop and reconstruct it independently. Different valid translations may exist; the app checks one authored target.</p>'+
 g.examples.map((e,i)=>'<div class="p35-example"><div><strong lang="zh-Hans">'+esc(e.hanzi)+'</strong><small>'+esc(e.pinyin)+'</small><span>'+esc(e.english)+'</span></div>'+
 act('p35-write','Rebuild sentence '+(i+1)+' →','button outline small','data-id="'+g.id+'" data-index="'+i+'"')+'</div>').join('')+'</div>'+
 '<div class="p35-links"><h3>Connect with earlier Chinese</h3><div class="button-row">'+
 act('p31-open-library','Revisit P31 beginner characters →','button outline small')+
 act('grammar-open','Practise grammar →','button outline small')+
 act('p34-open-reading','P34 contextual reading →','button outline small','data-id="p34-01"')+
 act('open-practice','Review characters →','button outline small')+'</div>'+
 (relatedGrammar.length?'<p class="eyebrow">RELATED GRAMMAR LESSONS</p><div class="button-row">'+relatedGrammar.map(x=>act('grammar-select',esc(x.title)+' →','button outline small','data-id="'+x.id+'"')).join('')+'</div>':'')+
 (matched.length?'<p class="eyebrow">AUTHORIAL P35 SENTENCES</p><div class="p35-linked">'+matched.map(x=>act('sentence-select','<strong lang="zh-Hans">'+esc(x.hanzi)+'</strong><small>'+esc(x.english)+'</small>','p35-related-sentence','data-id="'+x.id+'"')).join('')+'</div>':'')+
 (stories.length?'<p class="eyebrow">READ THE CHARACTER IN CONTEXT</p><div class="button-row">'+stories.map(x=>act('open-story-link',esc(x.title)+' →','button outline small','data-id="'+x.id+'"')).join('')+'</div>':'')+
 (dialogues.length?'<p class="eyebrow">HEAR THE CHARACTER IN A DIALOGUE</p><div class="button-row">'+dialogues.map(x=>act('hub-dialogue',esc(x.title)+' →','button outline small','data-id="'+x.id+'"')).join('')+'</div>':'')+
 '</div></section>';
}
export function p35VocabShelf(state,act,esc,{page=0}={}){
 const last=Math.max(0,Math.ceil(P35_VOCABULARY.length/12)-1),shown=Math.max(0,Math.min(last,page));
 const words=P35_VOCABULARY.slice(shown*12,shown*12+12);
 return '<section id="p35-vocabulary-library" class="p35-vocab" aria-label="P35 contextual vocabulary">'+
 '<div class="p35-title-row"><div><p class="eyebrow">P35 · '+P35_VOCABULARY.length+' AUTHORED CONTEXTUAL WORD RECORDS</p>'+
 '<h2>Learn complete words in actual Mandarin sentences</h2></div><span>Page '+(shown+1)+' / '+(last+1)+'</span></div>'+
 '<div class="p35-vocab-grid">'+words.map(w=>{const rec=findWord(canonicalWordKey(w.hanzi,w.pinyin));const e=w.examples[0],seen=rec&&(state.vocabularyIntroduced||[]).includes(rec.key);
 return '<article class="p35-vocab-card"><div class="p35-vocab-top"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><span>'+esc(w.pinyin)+'</span></div>'+
 '<h3>'+esc(w.meaning)+'</h3><p>'+esc(w.note)+'</p>'+
 '<div class="p35-vocab-example"><strong lang="zh-Hans">'+esc(e.hanzi)+'</strong><small>'+esc(e.pinyin)+'</small><span>'+esc(e.english)+'</span></div>'+
 '<div class="p35-card-actions">'+(rec?act('vocabulary-start',seen?'Review word →':'Learn word →','button primary small','data-id="'+esc(rec.key)+'"')+
 act('lookup-word','All examples ↗','button outline small','data-id="'+esc(rec.key)+'"'):'')+'</div></article>';
 }).join('')+'</div>'+
 '<div class="p35-pagination">'+act('p35-vocab-prev','← Previous','button outline small',shown?'':'disabled')+
 '<span>Page '+(shown+1)+' / '+(last+1)+'</span>'+
 act('p35-vocab-next','Next →','button outline small',shown<last?'':'disabled')+'</div></section>';
}
