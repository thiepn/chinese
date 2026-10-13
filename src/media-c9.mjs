/**
 * C9-09 Clean Modular Scholar — Reading, Listening & Conversations.
 * Visual and read-only projections of original source content. All activity
 * evaluation and storage remain in app.mjs native action dispatch.
 */
import {STORIES} from './stories.mjs';
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
 'Opening a reading never marks it complete.</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+
 act('c9-media-focus-native','Open passage and questions →','c9-button c9-button--primary','data-target="c9-native-reading"')+
 link('dialogues','Continue to listening')+'</div></div>'+
 '<div class="c9-media-lead-aside"><span>ORIGINAL P34 READING RECORDS</span>'+
 '<strong>'+p34.readings+' / 25</strong><p>Texts with at least one independent correct recorded answer</p>'+
 (next?act('p34-open-reading','Continue original P34 →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
 '</div></section>'+
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
 'No recorded answer yet.')+'</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+
 act('c9-media-focus-native','Open original listening player →','c9-button c9-button--primary','data-target="c9-native-dialogue"')+
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
