/**
 * C9-09 Clean Modular Scholar — Reading, Listening & Conversations.
 * Visual and read-only projections of original source content. All activity
 * evaluation and storage remain in app.mjs native action dispatch.
 */
import {STORIES,tokenizeSentence,storyExercise} from './stories.mjs';
import {findWord,wordsForWrittenForm} from './lexicon.mjs';
import {originalStoryWordSupport} from './source-bridges-c9.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {P34_LISTENING} from './p34-course.mjs';
import {p34StudyStats,p34NextReading,p34NextListening} from './p34-screen.mjs';

const count=(value,label)=>value+' '+label+(value===1?'':'s');
const intro=(category,title,description)=>'<header class="c9-media-title"><p class="c9-eyebrow">'+category+' · ORIGINAL MANDARIN</p><h1>'+title+'</h1><p>'+description+'</p></header>';
const fact=(value,description)=>'<div class="c9-media-fact"><strong>'+value+'</strong><span>'+description+'</span></div>';
const link=(route,label)=>'<a class="c9-button c9-button--secondary" href="#/'+route+'">'+label+'</a>';

/** C9-23 — Catalogs are read-only projections of canonical source and event IDs. */
export const C9_MEDIA_PAGE_SIZE=12;
const clean=v=>String(v??'').trim().toLocaleLowerCase();
const modeReading=['all','unattempted','repair','saved','independent'];
const modeDialogue=['all','unattempted','repair','independent','listening'];
const newest=(events,id,key)=>[...events].reverse().find(e=>e[key]===id)||null;
const independentlyCorrect=events=>events.some(e=>e.correct&&!e.assisted);
const stateFor=(events)=>!events.length?'Not attempted':independentlyCorrect(events)?'Independent answer observed':
  events.some(e=>e.assisted)?'Assisted / revisit':'Incorrect / revisit';
const passageKind=s=>s.extended?'Connected paragraphs':s.beginner?.source==='original-p34'?'P34 original reading':
 s.beginner?'Beginner connected text':'Short original reading';
function catalogControls(kind,options,act,esc){
 const reading=kind==='reading';
 const optionsByMode=reading?[
  ['all','All reading sources'],['unattempted','Not yet attempted'],['repair','Wrong / assisted'],['saved','Saved passages'],['independent','Independent correct observed']
 ]:[
  ['all','All conversations'],['unattempted','Not yet attempted'],['repair','Wrong / assisted'],
  ['independent','Independent correct observed'],['listening','P34 listening-first']
 ];
 return '<div class="c9-media-catalog-controls">'+
  '<label for="c9-'+kind+'-query">Find an original '+(reading?'passage':'conversation')+
   '<input id="c9-'+kind+'-query" class="c9-input" type="search" autocomplete="off" spellcheck="false" value="'+esc(options.query||'')+
    '" placeholder="'+(reading?'Search titles, themes or Chinese text':'Search conversation title')+'"></label>'+
  '<label for="c9-'+kind+'-filter">Source status<select id="c9-'+kind+'-filter" class="c9-select">'+
   optionsByMode.map(([key,label])=>'<option value="'+key+'"'+(options.filter===key?' selected':'')+'>'+label+'</option>').join('')+
   '</select></label>'+
  act('c9-media-reset','Reset discovery','c9-button c9-button--quiet c9-button--small','data-kind="'+kind+'"')+
 '</div>';
}
function catalogPager(kind,page,pages,total,act){
 return '<div class="c9-media-catalog-pager" role="group" aria-label="'+kind+' catalog pagination"><span>'+
 total+' matching sources · Page '+(page+1)+' / '+pages+'</span><div class="c9-inline">'+
 act('c9-media-page','← Previous','c9-button c9-button--secondary c9-button--small',
  'data-kind="'+kind+'" data-delta="-1" '+(page===0?'disabled':''))+
 act('c9-media-page','Next →','c9-button c9-button--secondary c9-button--small',
  'data-kind="'+kind+'" data-delta="1" '+(page===pages-1?'disabled':''))+
 '</div></div>';
}
export function renderC9ReadingCatalog(state,currentId,options,act,esc){
 const histories=state.readingEvents||[],saved=new Set(state.bookmarkedStories||[]);
 const mode=modeReading.includes(options.filter)?options.filter:'all',term=clean(options.query);
 const matches=STORIES.filter(s=>{
  const ev=histories.filter(e=>e.storyId===s.id),independent=independentlyCorrect(ev);
  if(mode==='unattempted'&&ev.length||mode==='repair'&&(!ev.length||independent)||
     mode==='saved'&&!saved.has(s.id)||mode==='independent'&&!independent)return false;
  return !term||[s.title,s.theme,...s.lines.flatMap(l=>[l.hanzi,l.pinyin,l.english])].some(text=>clean(text).includes(term));
 });
 const pages=Math.max(1,Math.ceil(matches.length/C9_MEDIA_PAGE_SIZE));
 const page=Math.min(pages-1,Math.max(0,Number.isInteger(options.page)?options.page:0));
 const visible=matches.slice(page*C9_MEDIA_PAGE_SIZE,(page+1)*C9_MEDIA_PAGE_SIZE);
 return '<div class="c9-media-catalog-results" role="region" aria-label="Reading source results">'+
 (visible.length?'<div class="c9-media-entry-grid">'+visible.map(s=>{
  const history=histories.filter(e=>e.storyId===s.id);
  const status=stateFor(history),current=s.id===currentId;
  return '<article class="c9-media-entry'+(current?' is-current':'')+'">'+
   '<div class="c9-media-entry-meta"><span class="c9-media-entry-type">'+esc(passageKind(s))+'</span>'+
    (saved.has(s.id)?'<span>Saved</span>':'')+'</div>'+
   '<h3>'+esc(s.title)+'</h3><p>'+esc(s.theme)+' · '+s.lines.length+' original sentences</p>'+
   '<div class="c9-media-entry-example"><p lang="zh-Hans">'+esc(s.lines[0]?.hanzi||'')+'</p>'+
    '<small>Source excerpt · read in original workspace</small></div>'+
   '<p class="c9-media-entry-history">'+esc(status)+'</p>'+
   act('c9-media-open-story',current?'Return to selected passage →':'Open original passage →',
      'c9-button '+(current?'c9-button--primary':'c9-button--secondary')+' c9-button--small',
      'data-id="'+esc(s.id)+'"')+'</article>';
 }).join('')+'</div>':
 '<div class="c9-media-no-results" role="status"><strong>No matching readings</strong><p>Change the filter or search terms. No reading progress was modified.</p>'+
 act('c9-media-reset','View all sources','c9-button c9-button--secondary','data-kind="reading"')+'</div>')+
 catalogPager('reading',page,pages,matches.length,act)+'</div>';
}
export function renderC9DialogueCatalog(state,currentId,options,act,esc){
 const histories=state.dialogueEvents||[],mode=modeDialogue.includes(options.filter)?options.filter:'all',term=clean(options.query);
 const matches=DIALOGUES.filter(d=>{
  const ev=histories.filter(e=>e.dialogueId===d.id),independent=independentlyCorrect(ev);
  if(mode==='unattempted'&&ev.length||mode==='repair'&&(!ev.length||independent)||
     mode==='independent'&&!independent||mode==='listening'&&!d.p34)return false;
  return !term||[d.title,d.p33?.theme,d.p34?.theme,d.p33?.goal].some(x=>clean(x).includes(term));
 });
 const pages=Math.max(1,Math.ceil(matches.length/C9_MEDIA_PAGE_SIZE));
 const page=Math.min(pages-1,Math.max(0,Number.isInteger(options.page)?options.page:0));
 const visible=matches.slice(page*C9_MEDIA_PAGE_SIZE,(page+1)*C9_MEDIA_PAGE_SIZE);
 return '<div class="c9-media-catalog-results" role="region" aria-label="Conversation source results">'+
 (visible.length?'<div class="c9-media-entry-grid">'+visible.map(d=>{
  const ev=histories.filter(e=>e.dialogueId===d.id),current=d.id===currentId;
  return '<article class="c9-media-entry'+(current?' is-current':'')+'">'+
   '<div class="c9-media-entry-meta"><span class="c9-media-entry-type">'+
      (d.p34?'LISTENING-FIRST · TRANSCRIPT GUARDED':d.p33?'SITUATIONAL CONVERSATION':'ORIGINAL DIALOGUE')+
    '</span></div>'+
   '<h3>'+esc(d.title)+'</h3><p>'+count(d.lines.length,'original turn')+' · '+count(d.questions.length,'native question')+'</p>'+
   '<p class="c9-media-entry-history">'+esc(stateFor(ev))+'</p>'+
   '<p class="c9-media-entry-guard">'+(d.p34?'Text and translations remain behind the original transcript reveal.':'Speak or listen, then check the meaning in the original player.')+'</p>'+
   act('c9-media-open-dialogue',current?'Return to current conversation →':'Open original dialogue →',
    'c9-button '+(current?'c9-button--primary':'c9-button--secondary')+' c9-button--small',
    'data-id="'+esc(d.id)+'"')+'</article>';
 }).join('')+'</div>':
 '<div class="c9-media-no-results" role="status"><strong>No matching conversations</strong><p>Try another source status or title.</p>'+
 act('c9-media-reset','View all sources','c9-button c9-button--secondary','data-kind="dialogue"')+'</div>')+
 catalogPager('dialogue',page,pages,matches.length,act)+'</div>';
}
/**
 * Original P67/P68 vocabulary handoff for the native reader.
 * Source definitions are only revealed after explicit assisted action or
 * completing the native check, so graded reading cannot silently receive hints.
 */
export function renderC9OriginalStoryWordSupport(story,state,act,esc,{revealed=false,answered=false}={}){
 const items=originalStoryWordSupport(story?.id,state);
 if(!items.length)return '<p class="c9-reading-vocabulary-empty">No original indexed whole words are available in this passage.</p>';
 const heading='<div class="c9-reading-vocabulary-head"><span class="c9-eyebrow">ORIGINAL SOURCE · STUDY WORDS IN CONTEXT</span>'+
  '<h3>Words in this reading</h3><p>'+items.length+' distinct indexed written form'+(items.length===1?'':'s')+
  ' shown from the existing lexicon, not newly imported material. Reading these hints makes an unanswered native exercise assisted.</p></div>';
 if(!revealed)return '<section class="c9-reading-vocabulary" aria-label="Optional reading vocabulary support">'+heading+
  '<div class="c9-reading-vocabulary-gate"><p>Try the native comprehension question first for an independent result. Open indexed word support only if needed.</p>'+
  act('c9-reading-vocabulary-help','Study original word meanings · assisted','c9-button c9-button--secondary c9-button--small')+
  '</div></section>';
 const saved=new Set(state?.bookmarkedWords||[]);
 const list=items.map(item=>{
  const word=item.wordKey&&findWord(item.wordKey);
  const meanings=item.ambiguous?item.readings.map(w=>
   '<li><strong>'+esc(w.pinyin)+'</strong> · '+esc(w.senses.slice(0,2).join(' / '))+
    act('lookup-word','Original entry →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(w.key)+'"')+'</li>').join(''):null;
  return '<article class="c9-reading-vocabulary-item"><span class="c9-eyebrow">SENTENCE '+(item.lineIndex+1)+'</span>'+
   '<strong lang="zh-Hans">'+esc(item.hanzi)+'</strong>'+
   (item.ambiguous?'<p>Multiple original readings; choose by context, no automatic meaning selection.</p>'+
    '<ul>'+meanings+'</ul>':
    '<p>'+esc(word?.pinyin||'')+' · '+esc(word?.senses.slice(0,2).join(' / ')||'')+'</p>'+
    '<small>'+(item.introduced?'At least one linked original character lesson has been introduced':'No linked character introduction recorded; this is not a vocabulary mastery judgment')+'</small>'+
    '<div class="c9-reading-vocabulary-actions">'+
      act('lookup-word','Dictionary details','c9-button c9-button--secondary c9-button--small','data-id="'+esc(word.key)+'"')+
      act('word-bookmark',saved.has(word.key)?'Unsave original word':'Save original word',
       'c9-button c9-button--quiet c9-button--small','data-id="'+esc(word.key)+'"')+
      (word.relatedLessonIds[0]?act('c9-reader-character','Study original character','c9-button c9-button--quiet c9-button--small','data-id="'+esc(word.relatedLessonIds[0])+'"'):'')+
    '</div>')+'</article>';
 }).join('');
 return '<section class="c9-reading-vocabulary" aria-label="Original reading vocabulary support">'+heading+
  '<p class="c9-reading-vocabulary-caveat" role="status">'+(answered?'Source help opened after checking. Your previously recorded response and its independent/assisted status are unchanged.':'Assisted source support is visible. The current unsubmitted answer will be recorded as assisted.')+' Written-form matches do not certify the correct lexical sense.</p>'+
  '<div class="c9-reading-vocabulary-grid">'+list+'</div>'+
  (items.length>=24?'<small>Showing at most 24 original written forms. The passage and native exercises are unchanged.</small>':'')+
  '</section>';
}

export function renderC9ReadingNavigator(story,focusIndex,act,esc){
 const focused=Number.isInteger(focusIndex)&&focusIndex>=0&&focusIndex<story.lines.length;
 const index=focused?focusIndex:0;
 const source=story.lines[index];
 return '<section class="c9-reading-navigator" aria-label="Reading sentence navigation">'+
 '<div class="c9-reading-nav-header"><div><p class="c9-eyebrow">READ THE ORIGINAL SOURCE</p><h3>'+
   (focused?'Sentence '+(index+1)+' / '+story.lines.length:'Select a sentence · '+story.lines.length+' total')+'</h3>'+
   '<p>Move through the text without revealing an answer or creating a practice record.</p></div>'+
   '<div class="c9-inline">'+
   act('c9-media-reading-line','← Previous','c9-button c9-button--secondary c9-button--small','data-dir="-1" '+(focused&&index===0?'disabled':''))+
   act('c9-media-reading-line','Next sentence →','c9-button c9-button--primary c9-button--small','data-dir="1" '+(focused&&index===story.lines.length-1?'disabled':''))+
   '</div></div>'+
 '<div class="c9-reading-sentence-index" role="group" aria-label="Go to original sentence">'+
 story.lines.map((_,i)=>act('c9-media-reading-jump',String(i+1),'c9-reading-number'+(focused&&index===i?' is-active':''),
 'data-index="'+i+'" aria-label="Go to sentence '+(i+1)+'" '+(focused&&index===i?'aria-current="step"':''))).join('')+
 '</div><p class="c9-reading-nav-caveat">Pinyin, translation and glossary help remain explicit assisted controls in the native reader.</p></section>';
}
export function renderC9ListeningWorkflow(dialogue,question,feedback,assisted,act,esc){
 const last=Boolean(feedback),p34=Boolean(dialogue.p34);
 return '<section class="c9-listening-journey" aria-label="Listening and comprehension workflow">'+
 '<div><p class="c9-eyebrow">'+(p34?'LISTENING-FIRST · P34':'CONVERSATION COMPREHENSION')+'</p>'+
 '<h3>Listen → interpret → check → study</h3></div>'+
 '<div class="c9-listening-journey-steps">'+
 '<span>1 · '+(p34?'Audio before transcript':'Hear the original turns')+'</span>'+
 '<span>2 · '+(last?'Checked original question':'Answer without help')+'</span>'+
 '<span>3 · '+(last?'Review source feedback':'Reveal only if needed')+'</span></div>'+
 '<div class="c9-listening-journey-actions">'+
 act('c9-media-listen-whole','Play dialogue','c9-button c9-button--primary c9-button--small')+
 act('c9-media-listen-slow','Play slowly · device voice','c9-button c9-button--secondary c9-button--small')+
 '</div><p class="c9-listening-journey-note">'+
 (assisted?'Transcript/support is visible: the native answer will be marked assisted.':
  'Listening and playback do not automatically submit answers. Opening translation or transcript invokes the original assistance rules.')+
 '</p></section>';
}
/** P67–P68: source-only continuation using original passage IDs and observed
 * independent readingEvents. A reading is never claimed as a certified HSK
 * level, or completed by opening/previewing it. */
/** P67–P68 original source reader course. This read-only projection uses only
 * historical readingEvents and source-supported original storyExercise modes.
 * It is not a new scheduler, grader, HSK level, or content/identity store. */
export const C9_READING_QUEUE_FILTERS=Object.freeze(['all','retry','unattempted','saved','independent']);
export const C9_READING_QUEUE_PAGE_SIZE=6;
const SOURCE_READING_MODES=Object.freeze(['comprehension','cloze','ordering','pronunciation']);
const modeLabel=mode=>({comprehension:'Understand the passage',cloze:'Complete the sentence',
 ordering:'Rebuild the original sentence',pronunciation:'Recall Pinyin with tones'})[mode]||mode;

export function c9ReadingStudyCatalog(state,{filter='all',page=0}={}){
 const byId=new Map(),saved=new Set(state.bookmarkedStories||[]);
 for(const record of state.readingEvents||[]){
  if(!byId.has(record.storyId))byId.set(record.storyId,[]);
  byId.get(record.storyId).push(record);
 }
 const source=STORIES.map((story,index)=>{
  const originalModes=SOURCE_READING_MODES.filter(mode=>Boolean(storyExercise(story,mode)));
  const recorded=byId.get(story.id)||[],last=recorded.at(-1)||null;
  const everIndependent=recorded.some(e=>e.correct&&!e.assisted);
  const latestIndependent=Boolean(last?.correct&&!last.assisted);
  const stage=!last?'unattempted':latestIndependent?'independent':'retry';
  const modeHistory=originalModes.map(mode=>{
   const attempts=recorded.filter(e=>e.mode===mode);
   const lastMode=attempts.at(-1)||null;
   return {mode,attempts:attempts.length,last:lastMode,
    independent:attempts.some(e=>e.correct&&!e.assisted)};
  });
  const recommended=modeHistory.find(m=>m.last&&(!m.last.correct||m.last.assisted))||
   modeHistory.find(m=>!m.independent)||modeHistory[0]||null;
  const priority=stage==='retry'?0:stage==='unattempted'?(saved.has(story.id)?1:2):3;
  return {story,index,history:{last,independent:everIndependent,latestIndependent,
     attempts:recorded.length},stage,priority,saved:saved.has(story.id),
    recommendedMode:recommended?.mode||null,modeHistory};
 });
 const mode=C9_READING_QUEUE_FILTERS.includes(filter)?filter:'all';
 const filtered=source.filter(x=>mode==='all'||(mode==='saved'?x.saved:x.stage===mode))
  .sort((a,b)=>a.priority-b.priority||a.index-b.index);
 const pages=Math.max(1,Math.ceil(filtered.length/C9_READING_QUEUE_PAGE_SIZE));
 const current=Math.min(pages-1,Math.max(0,Number.isInteger(page)?page:0));
 const counts=Object.freeze({all:source.length,retry:source.filter(x=>x.stage==='retry').length,
  unattempted:source.filter(x=>x.stage==='unattempted').length,
  independent:source.filter(x=>x.stage==='independent').length,
  saved:source.filter(x=>x.saved).length});
 return {items:filtered.slice(current*C9_READING_QUEUE_PAGE_SIZE,(current+1)*C9_READING_QUEUE_PAGE_SIZE),
  all:filtered,counts,page:current,pages,filter:mode};
}
/** Preserve compatibility with older read-only recommendation callers. */
export function c9ReadingRecommendations(state,{limit=4}={}){
 return c9ReadingStudyCatalog(state).all.slice(0,Math.max(0,Math.min(16,Number.isInteger(limit)?limit:4)));
}
export function renderC9ReadingContinuation(state,currentId,act,esc,options={}){
 const catalog=c9ReadingStudyCatalog(state,options);
 const controls=[['all','All original readings'],['retry','Latest attempt needs retry'],
  ['unattempted','Not yet attempted'],['saved','Saved passages'],
  ['independent','Latest independently correct']];
 return '<section class="c9-reading-queue" aria-labelledby="c9-reading-queue-title">'+
  '<div class="c9-reading-queue-head"><div><span class="c9-eyebrow">P67–P68 · ORIGINAL READING CONTINUATION</span>'+
  '<h2 id="c9-reading-queue-title">Continue reading, then practise</h2>'+
  '<p>Choose a source passage and a real available exercise. Unresolved attempts come first; previously passed material is still marked for retry after a later unsuccessful response. Reading and grading remain in the original player. No estimated level, proficiency claim or completion award is generated.</p></div></div>'+
  '<div class="c9-reading-queue-controls"><label for="c9-reading-queue-filter">Original reading history'+
  '<select id="c9-reading-queue-filter" class="c9-select">'+controls.map(([value,label])=>
    '<option value="'+value+'"'+(catalog.filter===value?' selected':'')+'>'+esc(label)+' · '+catalog.counts[value]+'</option>').join('')+
  '</select></label><span role="status">'+catalog.all.length+' matching passages · page '+(catalog.page+1)+' / '+catalog.pages+'</span></div>'+
  (catalog.items.length?'<div class="c9-reading-queue-items">'+catalog.items.map(({story,history,stage,recommendedMode,modeHistory,saved})=>
   '<article'+(story.id===currentId?' class="is-current"':'')+'><span class="c9-eyebrow">'+esc(passageKind(story))+' · '+story.lines.length+' source sentences'+(saved?' · Saved':'')+'</span>'+
   '<h3>'+esc(story.title)+'</h3><p>'+esc(story.theme)+'</p>'+
   '<small>'+(stage==='retry'?'Latest attempt was incorrect or assisted; retry independently':stage==='independent'?
    'Latest reading attempt was independently correct':'No original reading answer recorded')+
    (history.independent&&!history.latestIndependent?' · Earlier independent correct answer also recorded':'')+'</small>'+
   '<div class="c9-reading-queue-actions">'+
   (recommendedMode?act('c9-reading-queue-start',modeLabel(recommendedMode)+' →','c9-button c9-button--primary c9-button--small',
    'data-id="'+esc(story.id)+'" data-mode="'+esc(recommendedMode)+'"'):'')+
   act('c9-media-open-story',story.id===currentId?'Return to current passage →':'Open original passage →',
    'c9-button c9-button--secondary c9-button--small','data-id="'+esc(story.id)+'"')+'</div>'+
   '<small>'+modeHistory.filter(m=>m.independent).length+' / '+modeHistory.length+
    ' available source exercise modes with at least one independent correct answer (not mastery)</small>'+
   '</article>').join('')+'</div>':'<p role="status">No original passage matches this filter. Choose another recorded status to continue.</p>')+
  '<nav class="c9-reading-queue-pages" aria-label="Original reading continuation pages">'+
   act('c9-reading-queue-page','← Previous','c9-button c9-button--secondary c9-button--small',
     'data-delta="-1" '+(catalog.page===0?'disabled':''))+
   '<span>Page '+(catalog.page+1)+' / '+catalog.pages+'</span>'+
   act('c9-reading-queue-page','Next →','c9-button c9-button--secondary c9-button--small',
     'data-delta="1" '+(catalog.page===catalog.pages-1?'disabled':''))+'</nav>'+
  '</section>';
}

export function renderC9ReadingHub(state,story,act,esc,options={}){
 const histories=state.readingEvents||[],attempted=new Set(histories.map(e=>e.storyId));
 const independent=new Set(histories.filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 const p34=p34StudyStats(state),next=p34NextReading(state);
 const own=histories.filter(e=>e.storyId===story.id),last=own[own.length-1];
 return '<div class="c9-media-overview">'+intro('READING WORKSPACE','Read Mandarin in context',
 'Follow an original passage, interpret the context and check your own answer. Any saved evidence comes from the native reader.')+
 '<div class="c9-media-facts">'+fact(STORIES.length,'Original passages')+
 fact(attempted.size,'Passages with recorded attempts')+
 fact(independent.size,'Passages with independent correct evidence')+'</div>'+
 '<section class="c9-media-lead c9-unified-card"><div><p class="c9-eyebrow">CURRENT READING · '+esc(passageKind(story))+'</p>'+
 '<h2>'+esc(story.title)+'</h2>'+
 '<p>'+esc(story.theme)+' · '+story.lines.length+' original source sentences. '+
  (last?'Last recorded attempt: '+(last.assisted?'assisted':last.correct?'independent correct':'incorrect')+'. ':
  'No recorded reading attempt for this text. ')+
 'Opening a reading never marks it complete. The link identifies only the public source, not your private response or support settings.</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+
 act('c9-media-focus-native','Open passage and questions →','c9-button c9-button--primary','data-target="c9-native-reading"')+
 act('c9-media-copy-reading','Copy reading link','c9-button c9-button--secondary','data-id="'+esc(story.id)+'"')+
 link('dialogues','Continue to listening')+'</div></div>'+
 '<div class="c9-media-lead-aside"><span>ORIGINAL P34 READING RECORDS</span>'+
 '<strong>'+p34.readings+' / 25</strong><p>Texts with at least one independent correct recorded answer</p>'+
 (next?act('p34-open-reading','Continue original P34 →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
 '</div></section>'+
 renderC9ReadingContinuation(state,story.id,act,esc,options.queue||{})+
 '<section class="c9-media-discovery" aria-label="Find an original reading">'+
 '<div class="c9-media-discovery-header"><h2>Reading library</h2><p>Find a published original text or revisit a recorded difficulty. Search is source-only and changes no progress.</p></div>'+
 catalogControls('reading',options,act,esc)+
 '<div id="c9-reading-results" aria-live="polite">'+renderC9ReadingCatalog(state,story.id,options,act,esc)+'</div></section>'+
 '<p class="c9-media-provenance c9-unified-source-note">Practice evidence is not reading-level certification. Source texts are original editorial learning material, not an official HSK corpus.</p></div>';
}
export function renderC9DialogueHub(state,dialogue,act,esc,options={}){
 const histories=state.dialogueEvents||[],attempted=new Set(histories.map(e=>e.dialogueId));
 const independent=new Set(histories.filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 const listening=p34StudyStats(state),next=p34NextListening(state);
 const own=histories.filter(e=>e.dialogueId===dialogue.id),last=own[own.length-1];
 return '<div class="c9-media-overview">'+intro('LISTENING & CONVERSATION','Listen. Understand. Respond.',
 'Listen before reading the transcript. Follow speaker turns, check one original contextual question, then compare source evidence.')+
 '<div class="c9-media-facts">'+fact(DIALOGUES.length,'Original conversations')+
 fact(attempted.size,'Conversations with recorded attempts')+
 fact(independent.size,'Conversations with independent correct evidence')+'</div>'+
 '<section class="c9-media-lead c9-unified-card"><div><p class="c9-eyebrow">CURRENT CONVERSATION · '+
 (dialogue.p34?'LISTENING-FIRST':'SOURCE DIALOGUE')+'</p><h2>'+esc(dialogue.title)+'</h2>'+
 '<p>'+count(dialogue.lines.length,'speaking turn')+' · '+count(dialogue.questions.length,'source question')+'. '+
 (last?'Last recorded answer was '+(last.assisted?'assisted':last.correct?'independently correct':'incorrect')+'.':
 'No recorded answer yet.')+' Source links never include private answers or reveal the transcript.</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+
 act('c9-media-focus-native','Open original listening player →','c9-button c9-button--primary','data-target="c9-native-dialogue"')+
 act('c9-media-copy-dialogue','Copy conversation link','c9-button c9-button--secondary','data-id="'+esc(dialogue.id)+'"')+
 link('stories','Read an original passage')+'</div></div>'+
 '<div class="c9-media-lead-aside"><span>ORIGINAL P34 LISTENING EVIDENCE</span>'+
 '<strong>'+listening.listening+' / '+P34_LISTENING.length+'</strong>'+
 '<p>Listening situations with independent correct answers</p>'+
 (next?act('p34-open-listening','Continue P34 listening →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
 '</div></section>'+
 '<section class="c9-media-discovery" aria-label="Find an original conversation">'+
 '<div class="c9-media-discovery-header"><h2>Conversation library</h2><p>Browse actual dialogues without exposing listening-first text or awarding progress.</p></div>'+
 catalogControls('dialogue',options,act,esc)+
 '<div id="c9-dialogue-results" aria-live="polite">'+renderC9DialogueCatalog(state,dialogue.id,options,act,esc)+'</div></section>'+
 '<p class="c9-media-provenance c9-unified-source-note">Audio is device speech synthesis, not human-recorded or pronunciation-assessed audio. Transcript reveals remain explicitly assisted.</p></div>';
}
/**
 * C9-57 public-source communication rehearsal.
 * Read-only, ephemeral view over the existing authored dialogue and story.
 * No speech recognition, fluency grade, shadow StudyEvent or saved progress.
 */
export function c9RoleplaySource(d,ui={}){
 const roles=[...new Set((d?.lines||[]).map(line=>line.speaker))];
 const role=roles.includes(ui.role)?ui.role:(roles[1]||roles[0]||null);
 const indices=(d?.lines||[]).flatMap((line,i)=>line.speaker===role?[i]:[]);
 const position=Math.max(0,Math.min(indices.length-1,Number.isInteger(ui.position)?ui.position:0));
 const index=indices[position];
 return {roles,role,indices,position,index,reply:d?.lines?.[index]||null,
  cue:index>0?d.lines[index-1]:null};
}
export function renderC9DialogueRoleplay(d,ui,act,esc){
 const source=c9RoleplaySource(d,ui);
 if(!source.reply)return '';
 const displayed=Boolean(ui.revealed),entry=String(ui.typed||''),hasDraft=Boolean(entry.trim());
 const exact=displayed&&hasDraft&&entry.normalize('NFC').trim()===source.reply.hanzi.normalize('NFC').trim();
 const buttons=source.roles.map(role=>act('c9-roleplay-role','Speaker '+esc(role),
  'c9-button '+(role===source.role?'c9-button--primary':'c9-button--secondary')+' c9-button--small',
  'data-role="'+esc(role)+'" aria-pressed="'+String(role===source.role)+'"')).join('');
 return '<section class="c9-source-rehearsal c9-unified-card" id="c9-roleplay-studio" tabindex="-1" aria-labelledby="c9-roleplay-title">'+
  '<header><div><span class="c9-eyebrow">ORIGINAL CONVERSATION · UNGRADED REHEARSAL</span>'+
  '<h2 id="c9-roleplay-title">Take a speaking role</h2><p>Hear the previous turn, answer aloud as a speaker, then compare with the original script. You may also type your reply. No microphone recording, speech recognition or automatic pronunciation grade is used.</p></div>'+
  '<span class="c9-badge">Turn '+(source.position+1)+' / '+source.indices.length+'</span></header>'+
  '<div class="c9-rehearsal-roles" role="group" aria-label="Choose your original speaking role">'+buttons+'</div>'+
  '<div class="c9-rehearsal-context"><p class="c9-eyebrow">YOUR CUE · SOURCE TURN '+(source.index+1)+'</p>'+
  '<strong>Reply as Speaker '+esc(source.role)+'</strong>'+
  (source.cue?'<p>Speaker '+esc(source.cue.speaker)+' speaks first. Listen to the authored cue, then respond without looking at the target line.</p>':
   '<p>You open this conversation. Say your first line before checking the original source.</p>')+
  (source.cue?act('c9-roleplay-hear-cue','Hear preceding turn','c9-button c9-button--primary c9-button--small'):'')+
  '<p class="c9-rehearsal-caveat">Audio uses optional device Mandarin TTS, not a verified native-speaker recording.</p></div>'+
  '<label class="c9-rehearsal-label" for="c9-roleplay-entry">Optional: type your Mandarin reply before revealing the reference</label>'+
  '<textarea id="c9-roleplay-entry" rows="2" maxlength="500" lang="zh-Hans" spellcheck="false" placeholder="Speak aloud, or type the Chinese sentence from memory"'+(displayed?' disabled':'')+'>'+esc(entry)+'</textarea>'+
  '<div class="c9-rehearsal-actions">'+
  (!displayed?act('c9-roleplay-spoke',ui.spoken?'Spoken aloud · self-reported':'I spoke the line aloud','c9-button c9-button--secondary c9-button--small','aria-pressed="'+Boolean(ui.spoken)+'"')+
   act('c9-roleplay-reveal','Compare with original script','c9-button c9-button--primary c9-button--small'):
   act('c9-roleplay-listen-reply','Hear original reply','c9-button c9-button--secondary c9-button--small'))+
  '</div>'+
  (displayed?'<div class="c9-rehearsal-reference" role="status"><span class="c9-eyebrow">SOURCE-EXACT REFERENCE · ASSISTED</span>'+
   '<p lang="zh-Hans">'+esc(source.reply.hanzi)+'</p><small>'+esc(source.reply.pinyin)+'</small>'+
   '<p>'+esc(source.reply.english)+'</p>'+
   (hasDraft?'<p>'+(exact?'Your typed Chinese exactly matches the original written form. This does not assess pronunciation or communicative fluency.':
    'Compare your typed wording with the original. No correctness grade was assigned.')+'</p>':'')+
   '<p>Opening this reference makes pending native comprehension or mission answers assisted.</p></div>':'')+
  '<nav class="c9-rehearsal-steps" aria-label="Move between source-authored speaking turns">'+
  act('c9-roleplay-move','← Previous reply','c9-button c9-button--secondary c9-button--small','data-delta="-1" '+(!source.position?'disabled':''))+
  act('c9-roleplay-retry','Try this reply again','c9-button c9-button--secondary c9-button--small')+
  act('c9-roleplay-move','Next reply →','c9-button c9-button--primary c9-button--small','data-delta="1" '+(source.position===source.indices.length-1?'disabled':''))+
  '</nav>'+
  '<div class="c9-rehearsal-native"><p>To record actual question evidence, use the original contextual listening assessment. This rehearsal never writes a grade.</p>'+
  act('c9-media-focus-native','Open native listening assessment →','c9-button c9-button--secondary c9-button--small','data-target="c9-native-dialogue"')+
  (d.p34?act('p34-write-listening','Original listening-to-writing task →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(d.p34.id)+'"'):'')+
  '</div></section>';
}
export function c9ReadingRecallSource(story,ui={}){
 const index=Math.max(0,Math.min((story?.lines?.length||1)-1,Number.isInteger(ui.index)?ui.index:0));
 return {index,line:story?.lines?.[index]||null,total:story?.lines?.length||0};
}
export function renderC9ReadingRecall(story,ui,act,esc){
 const source=c9ReadingRecallSource(story,ui);
 if(!source.line)return '';
 const revealed=Boolean(ui.revealed),draft=String(ui.typed||'');
 const exact=revealed&&draft.trim()&&draft.normalize('NFC').trim()===source.line.hanzi.normalize('NFC').trim();
 return '<section class="c9-source-rehearsal c9-unified-card" id="c9-reading-recall" tabindex="-1" aria-labelledby="c9-reading-recall-title">'+
  '<header><div><span class="c9-eyebrow">ORIGINAL READING · UNGRADED LISTEN & WRITE</span>'+
  '<h2 id="c9-reading-recall-title">Listen, cover and rewrite</h2>'+
  '<p>Play an original passage sentence, try reproducing it in Chinese, then compare the exact source. This is a private, temporary writing drill—not a graded dictation or reading-comprehension result.</p></div>'+
  '<span class="c9-badge">Sentence '+(source.index+1)+' / '+source.total+'</span></header>'+
  '<div class="c9-rehearsal-context"><strong>Original passage: '+esc(story.title)+'</strong>'+
  '<p>The sentence is hidden in this drill until you reveal the reference. The full reader below is still available for ordinary study.</p>'+
  act('c9-reading-recall-listen','Hear original sentence','c9-button c9-button--primary c9-button--small')+
  act('c9-reading-recall-listen-slow','Play slowly','c9-button c9-button--secondary c9-button--small')+
  '</div>'+
  '<label class="c9-rehearsal-label" for="c9-reading-recall-entry">Type the original Chinese sentence from listening or memory</label>'+
  '<textarea id="c9-reading-recall-entry" rows="2" maxlength="500" lang="zh-Hans" spellcheck="false"'+(revealed?' disabled':'')+' placeholder="Write the sentence before comparing">'+esc(draft)+'</textarea>'+
  (!revealed?'<div class="c9-rehearsal-actions">'+act('c9-reading-recall-reveal','Compare with source','c9-button c9-button--primary c9-button--small')+'</div>':
   '<div class="c9-rehearsal-reference" role="status"><span class="c9-eyebrow">ORIGINAL SOURCE REVEALED · ASSISTED</span>'+
   '<p lang="zh-Hans">'+esc(source.line.hanzi)+'</p><small>'+esc(source.line.pinyin)+'</small><p>'+esc(source.line.english)+'</p>'+
   '<p>'+(draft.trim()?(exact?'Typed characters match the source exactly; no grade is recorded.':
    'Compare your writing directly with the original sentence. No grade is recorded.'):'No written attempt was submitted; this is reference study.')+'</p>'+
   '<p>Showing this source reference also marks an unanswered original reading check assisted.</p></div>')+
  '<nav class="c9-rehearsal-steps" aria-label="Next original reading sentence">'+
  act('c9-reading-recall-move','← Previous','c9-button c9-button--secondary c9-button--small','data-delta="-1" '+(!source.index?'disabled':''))+
  act('c9-reading-recall-retry','Try again','c9-button c9-button--secondary c9-button--small')+
  act('c9-reading-recall-move','Next sentence →','c9-button c9-button--primary c9-button--small','data-delta="1" '+(source.index===source.total-1?'disabled':''))+'</nav>'+
  '<div class="c9-rehearsal-native"><p>Independent reading evidence still comes only from the original passage question and grader below.</p>'+
  act('c9-media-focus-native','Open native reading questions →','c9-button c9-button--secondary c9-button--small','data-target="c9-native-reading"')+
  '</div></section>';
}

export function renderC9TurnNavigator(d,active,act,esc){
 const current=Math.max(0,Math.min(active,d.lines.length-1)),line=d.lines[current];
 return '<nav class="c9-media-turn-nav" aria-label="Conversation turn navigation">'+
 '<div><p class="c9-eyebrow">SPEAKER-BY-SPEAKER LISTENING</p><strong>Turn '+(current+1)+' / '+d.lines.length+'</strong>'+
 '<span>Speaker '+esc(line?.speaker||'A')+' · moving between turns does not reveal the source transcript or record an answer</span></div>'+
 '<div class="c9-media-turn-actions">'+
 act('c9-media-turn','← Previous','c9-button c9-button--secondary c9-button--small','data-dir="-1" '+(current===0?'disabled':''))+
 act('c9-media-listen-turn','Play focused turn','c9-button c9-button--primary c9-button--small')+
 act('c9-media-listen-turn-slow','Slower · focused turn','c9-button c9-button--secondary c9-button--small')+
 act('c9-media-turn','Next turn →','c9-button c9-button--secondary c9-button--small','data-dir="1" '+(current===d.lines.length-1?'disabled':''))+
 '</div></nav>';
}
export function renderC9ReaderIntro(lesson,act,esc){
 return intro('SENTENCE READING','Read one sentence carefully',
 'Keep the original comprehension and cloze checks separate from scheduled Review. Source details and translation remain behind native reveal controls.')+
 '<div class="c9-media-reader-source"><span class="c9-eyebrow">ORIGINAL CHARACTER LESSON</span>'+
 '<strong><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span> '+esc(lesson.meaning)+'</strong>'+
 '<span>'+esc(lesson.pinyin)+'</span>'+
 '<div class="c9-inline">'+act('speak','Listen using device voice','c9-button c9-button--secondary c9-button--small','data-text="'+esc(lesson.sentence.hanzi)+'"')+
 act('c9-reader-character','Related character study →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</div></div>';
}


/* P69 original-roadmap personal reading: tokenize private, user-pasted text using
 * the existing canonical STORY glossary and Lexicon; never treat user text as
 * approved editorial curriculum, record a StudyEvent, or transmit it. */
let personalReaderText='',personalReaderAnalyzed='',personalReaderMined=[];
let disconnectPersonalReader=null;
const PERSONAL_READER_LIMIT=1200;
const allPersonalLines=text=>String(text).match(/[^。！？!?；;\n]+[。！？!?；;]?/gu)?.map(s=>s.trim()).filter(Boolean)||[];
const personalLines=text=>allPersonalLines(text).slice(0,32);
const personalHanzi=text=>/\p{Script=Han}/u.test(text);
export function renderC9PersonalTextReader(esc,state={}){
 const text=personalReaderText;
 return '<section class="c9-personal-reader" aria-labelledby="c9-personal-reader-title"><details>'+
  '<summary><strong id="c9-personal-reader-title">Read my own Chinese text</strong><span>Private, optional · source-linked dictionary · no grading</span></summary>'+
  '<div class="c9-personal-reader-body"><p>Paste a short passage to identify words already present in the original app glossary. Unknown text stays unmarked. This workspace holds text, word matches and mined sentences only in this browser tab until refresh or close. At most 32 text segments are annotated. Nothing is sent to the server or saved to the learning database unless you deliberately save an existing canonical word through the native Wordbook.</p>'+
  '<label for="c9-personal-input">My Chinese passage · up to '+PERSONAL_READER_LIMIT+' characters</label>'+
  '<textarea id="c9-personal-input" rows="5" maxlength="'+PERSONAL_READER_LIMIT+'" spellcheck="false" lang="zh-Hans" placeholder="Paste your own Mandarin passage here">'+esc(text)+'</textarea>'+
  '<div class="c9-personal-actions"><button type="button" id="c9-personal-analyze" class="c9-button c9-button--primary c9-button--small">Annotate with existing dictionary</button>'+
  '<button type="button" id="c9-personal-clear" class="c9-button c9-button--secondary c9-button--small">Clear my text</button>'+
  '<span id="c9-personal-status" role="status">Annotations are private study aids, not translations or grades.</span></div>'+
  '<div id="c9-personal-results" aria-live="polite">'+personalReaderResults(esc,state)+'</div></div></details></section>';
}
function personalReaderResults(esc,state={}){
 if(!personalReaderAnalyzed)return '';
 const allLines=allPersonalLines(personalReaderAnalyzed),lines=allLines.slice(0,32);
 if(!lines.length)return '<p>No sentences to annotate. Try pasting Chinese text.</p>';
 const sources=new Map(),unmatched=new Set(),ambiguous=new Map();
 const view=lines.map((line,i)=>{
  const tokens=tokenizeSentence(line);
  const text=tokens.map(token=>{
   const readings=wordsForWrittenForm(token.text);
   // Source tokenizer may pick one entry for a multi-reading written form.
   // Do not silently present that entry as the correct contextual sense.
   if(readings.length>1){
    ambiguous.set(token.text,readings);
    return '<span class="c9-personal-ambiguous" lang="zh-Hans" title="Multiple indexed readings; interpret from context">'+esc(token.text)+'<sup aria-label="multiple readings">?</sup></span>';
   }
   const word=readings[0]||(token.entry?.wordKey&&findWord(token.entry.wordKey));
   if(word){
    const item=sources.get(word.key)||{word,count:0};
    item.count++;sources.set(word.key,item);
    return '<button type="button" class="c9-personal-term" data-action="lookup-word" data-id="'+esc(word.key)+'" title="'+esc(word.pinyin+' · '+word.senses.join(' / '))+'" lang="zh-Hans">'+esc(token.text)+'</button>';
   }
   if(personalHanzi(token.text))unmatched.add(token.text);
   return '<span lang="zh-Hans">'+esc(token.text)+'</span>';
  }).join('');
  const original=SENTENCE_LIBRARY.find(s=>s.hanzi===line);
  const mined=personalReaderMined.includes(line);
  return '<article class="c9-personal-line"><div class="c9-personal-line-text">'+text+'</div>'+
   (original?'<small>Exact match: '+esc(original.id)+' · '+esc(original.topic)+'</small>'+
    '<button type="button" class="c9-button c9-button--secondary c9-button--small" data-action="sentence-select" data-id="'+esc(original.id)+'">Open original sentence task →</button>':'')+
   '<button type="button" data-personal-mine="'+i+'" aria-pressed="'+mined+'" class="c9-button c9-button--secondary c9-button--small">'+(mined?'Remove from list':'Mine this sentence')+'</button></article>';
 }).join('');
 const saved=new Set(state.bookmarkedWords||[]);
 const matches=[...sources.values()].sort((a,b)=>b.count-a.count||a.word.hanzi.localeCompare(b.word.hanzi,'zh')).slice(0,24);
 const indexed='<section class="c9-personal-index" aria-label="Indexed words in my passage"><h3>Words confirmed in existing source index</h3>'+
  '<p>'+sources.size+' indexed whole-word record'+(sources.size===1?'':'s')+
  ' · '+ambiguous.size+' written form'+(ambiguous.size===1?'':'s')+' with multiple readings'+
  ' · '+unmatched.size+' unmatched Hanzi token'+(unmatched.size===1?'':'s')+
  '. A dictionary match does not establish the intended meaning in context.</p>'+
  (matches.length?'<div class="c9-personal-index-grid">'+matches.map(({word,count})=>
   '<article><strong lang="zh-Hans">'+esc(word.hanzi)+'</strong><span>'+esc(word.pinyin)+'</span>'+
   '<span>'+esc(word.senses.slice(0,2).join(' / '))+'</span><small>'+count+' indexed occurrence'+(count===1?'':'s')+'</small>'+
   (word.examples[0]?'<small lang="zh-Hans">'+esc(word.examples[0].hanzi)+'</small>':'')+
   '<div><button type="button" data-action="lookup-word" data-id="'+esc(word.key)+'" class="c9-button c9-button--secondary c9-button--small">Details</button>'+
   '<button type="button" data-action="word-bookmark" data-id="'+esc(word.key)+'" class="c9-button c9-button--quiet c9-button--small">'+(saved.has(word.key)?'Unsave':'Save word')+'</button></div></article>').join('')+'</div>':'<p>No unambiguous indexed whole words detected.</p>')+
  (sources.size>matches.length?'<p>Showing the first 24 indexed words; the passage remains unchanged.</p>':'')+
  '</section>';
 const alternatives=ambiguous.size?'<section class="c9-personal-ambiguities" aria-label="Multiple indexed readings"><h3>Choose a reading from context</h3>'+
  '<p>The original dictionary records more than one reading for these written forms. Nothing is chosen automatically.</p>'+
  [...ambiguous.entries()].map(([hanzi,readings])=>
   '<article><strong lang="zh-Hans">'+esc(hanzi)+'</strong><div>'+
   readings.map(word=>'<span><b>'+esc(word.pinyin)+'</b> · '+esc(word.senses.slice(0,2).join(' / '))+
    '<button type="button" data-action="lookup-word" class="c9-button c9-button--secondary c9-button--small" data-id="'+esc(word.key)+'">View this reading</button></span>').join('')+
   '</div></article>').join('')+'</section>':'';
 return '<div class="c9-personal-result-head"><strong>'+lines.length+' private passage segment'+(lines.length===1?'':'s')+'</strong><small>Only original indexed words become lookups; pasted text remains ungraded.</small></div>'+
  (allLines.length>32?'<p class="c9-personal-limit" role="status">Only the first 32 of '+allLines.length+' segments are annotated or mineable. The remainder stays in the input above.</p>':'')+
  '<div class="c9-personal-lines">'+view+'</div>'+indexed+alternatives+
  '<div class="c9-personal-mined"><strong>My temporary sentence list · '+personalReaderMined.length+'</strong>'+
   '<p>Not part of the original sentence curriculum or learning scores. Copy the list before refreshing this page if you want to keep it.</p>'+
   (personalReaderMined.length?'<ol>'+personalReaderMined.map(s=>'<li lang="zh-Hans">'+esc(s)+'</li>').join('')+'</ol>':'')+
   '<button type="button" id="c9-personal-copy" class="c9-button c9-button--secondary c9-button--small" '+(personalReaderMined.length?'':'disabled')+'>Copy my mined sentences</button></div>';
}
export function connectC9PersonalTextReader(root,esc,state={}){
 if(disconnectPersonalReader){disconnectPersonalReader();disconnectPersonalReader=null;}
 const input=root.querySelector('#c9-personal-input');if(!input)return;
 const panel=root.querySelector('#c9-personal-results'),status=root.querySelector('#c9-personal-status');
 const analyze=root.querySelector('#c9-personal-analyze'),clear=root.querySelector('#c9-personal-clear');
 const details=input.closest('details');
 if(details&&(personalReaderAnalyzed||personalReaderText))details.open=true;
 const update=()=>{
  if(!panel)return;
  panel.hidden=!(personalReaderAnalyzed&&personalReaderText.trim()===personalReaderAnalyzed);
  if(!panel.hidden)panel.innerHTML=personalReaderResults(esc,state);
 };
 const onInput=()=>{
  personalReaderText=input.value.slice(0,PERSONAL_READER_LIMIT);
  update();
  if(status&&personalReaderText.trim()!==personalReaderAnalyzed)
   status.textContent='Text edited. Re-annotate this version; prior sentence selections remain in tab memory until replacement.';
 };
 const onAnalyze=()=>{
  personalReaderText=input.value.slice(0,PERSONAL_READER_LIMIT);
  const next=personalReaderText.trim();
  if(next!==personalReaderAnalyzed&&personalReaderMined.length&&
   !window.confirm('Replace annotated passage and clear '+personalReaderMined.length+' mined sentence(s)? Copy them first if needed.')){
   update();
   if(status)status.textContent='Previous selections retained. Restore the earlier text or copy the list before replacing it.';
   return;
  }
  if(next!==personalReaderAnalyzed)personalReaderMined=[];
  personalReaderAnalyzed=next;update();
  if(status)status.textContent=personalReaderAnalyzed?
   (personalHanzi(personalReaderAnalyzed)?'Annotated using existing original word records. No text saved.':'No Chinese characters detected. No learning evidence changed.'):'Paste text before annotating.';
 };
 const onClear=()=>{
  if((personalReaderText||personalReaderMined.length)&&!window.confirm('Discard your private pasted passage and temporary mined sentences?'))return;
  personalReaderText='';personalReaderAnalyzed='';personalReaderMined=[];input.value='';update();
  if(status)status.textContent='Private text cleared from this tab.';
 };
 const onPanelClick=async e=>{
  const mine=e.target.closest('[data-personal-mine]');
  if(mine){
   const line=personalLines(personalReaderAnalyzed)[Number(mine.dataset.personalMine)];
   if(!line)return;
   personalReaderMined=personalReaderMined.includes(line)?personalReaderMined.filter(s=>s!==line):
    [...personalReaderMined,line];
   update();if(status)status.textContent=personalReaderMined.length+' temporary sentences in your list.';
   return;
  }
  if(e.target.closest('#c9-personal-copy')){
   try{
    if(!navigator.clipboard?.writeText)throw Error('Clipboard permission unavailable');
    await navigator.clipboard.writeText(personalReaderMined.join('\n'));
    if(status)status.textContent='Mined sentences copied. Check your clipboard before closing this page.';
   }catch{if(status)status.textContent='Automatic clipboard copy unavailable. Select the listed text to copy it manually.';}
  }
 };
 update();input.addEventListener('input',onInput);analyze?.addEventListener('click',onAnalyze);
 clear?.addEventListener('click',onClear);panel?.addEventListener('click',onPanelClick);
 disconnectPersonalReader=()=>{
  input.removeEventListener('input',onInput);analyze?.removeEventListener('click',onAnalyze);
  clear?.removeEventListener('click',onClear);panel?.removeEventListener('click',onPanelClick);
 };
}
export function disconnectC9PersonalTextReader(){
 if(disconnectPersonalReader){disconnectPersonalReader();disconnectPersonalReader=null;}
}
