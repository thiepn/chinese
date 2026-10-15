/**
 * Concept 9 C9-06 — signature Character Study.
 * Presentation and ephemeral, ungraded handwriting only.
 * Existing Demo Lessons / Lexicon / study.mjs remain the single content and progress authorities.
 * No radical/etymology/stroke-order claims without a real authoritative dataset.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {findP31Guide} from './p31-foundations.mjs';
import {guideFor} from './lesson-guides.mjs';
import {lessonGroups} from './study-groups.mjs';
import {cardsForLesson,dueCards} from './study.mjs';
import {renderC9ListeningDeck} from './ui-c9.mjs';

const tabs=Object.freeze([
 ['overview','Character'],
 ['writing','Writing'],
 ['vocabulary','Words'],
 ['sentences','Sentences'],
 ['connections','Connections']
]);
const txt=(v,esc)=>esc(String(v??''));
function row(heading,value){return '<div class="c9-character-fact"><span>'+heading+'</span><strong>'+value+'</strong></div>';}
function icon(name){
 const paths={
  audio:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  pen:'<path d="m3 21 5-1 12-12-4-4L4 16l-1 5Z"/><path d="m14 6 4 4"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  book:'<path d="M12 7v14M12 7C9 5 6 5 3 6v14c3-1 6-1 9 1M12 7c3-2 6-2 9-1v14c-3-1-6-1-9 1"/>',
  repeat:'<path d="M3 12a9 9 0 1 1 3 6.7M3 17v4h4"/>'
 };
 return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.arrow)+'</svg>';
}
function sourceSentences(lesson){
 const examples=[
  {s:lesson.sentence,source:'Original character lesson'},
  ...(lesson.extraSentence?[{s:lesson.extraSentence,source:'Original additional example'}]:[]),
  ...(findP31Guide(lesson.id)?.examples||[]).map(s=>({s,source:'P31 original teaching'})),
  ...SENTENCE_LIBRARY.filter(s=>s.hanzi.includes(lesson.hanzi)).slice(0,7).map(s=>({s,source:'Original sentence library'}))
 ];
 const seen=new Set();
 return examples.filter(x=>x.s?.hanzi&&x.s?.pinyin&&x.s?.english&&
  !seen.has(x.s.hanzi)&&Boolean(seen.add(x.s.hanzi))).slice(0,9);
}
function wordLinks(lesson){
 const set=new Set(lesson.words.map(w=>w.hanzi));
 const matched=WORDS.filter(w=>w.hanzi.includes(lesson.hanzi));
 return matched.sort((a,b)=>Number(set.has(b.hanzi))-Number(set.has(a.hanzi))
  ||a.hanzi.length-b.hanzi.length||a.hanzi.localeCompare(b.hanzi,'zh')).slice(0,18);
}
function relationLessons(lesson,words){
 const linked=new Map();
 for(const w of words){
  for(const id of w.relatedLessonIds||[]){
   if(id===lesson.id)continue;
   const other=DEMO_LESSONS.find(x=>x.id===id);
   if(other&&!linked.has(id))linked.set(id,{other,words:[w.hanzi]});
   else if(other&&!linked.get(id).words.includes(w.hanzi))linked.get(id).words.push(w.hanzi);
  }
 }
 return [...linked.values()].slice(0,9);
}
export function renderC9CharacterStudy({lesson,state,act,esc,showTranslations=true,showPinyin=true}){
 if(!lesson)return '<div class="c9-empty">The requested original character lesson is unavailable. <a href="#/learn">Return to learning</a>.</div>';
 const index=DEMO_LESSONS.findIndex(l=>l.id===lesson.id);
 const before=DEMO_LESSONS[index-1],after=DEMO_LESSONS[index+1];
 const group=lessonGroups().find(g=>g.lessons.some(l=>l.id===lesson.id));
 const guide=guideFor(lesson),p31=findP31Guide(lesson.id);
 const introduced=(state.learned||[]).includes(lesson.id);
 const ids=cardsForLesson(lesson.id);
 const due=new Set(dueCards(state));
 const lessonDue=ids.filter(x=>due.has(x)).length;
 const observed=(state.events||[]).filter(e=>ids.includes(e.cardId)&&e.correct===true&&!e.assisted).length;
 const words=wordLinks(lesson),related=relationLessons(lesson,words),sentences=sourceSentences(lesson);
 const heading='<header class="c9-character-heading"><div><a href="#/learn" class="c9-character-back">← Learn / Character lessons</a>'+
  '<p class="c9-eyebrow">CHARACTER STUDY · ORIGINAL SOURCE</p><h1>Study a character in depth</h1>'+
  '<p>Understand pronunciation, meaning, whole words and contextual examples before choosing independent recall.</p></div>'+
  '<div class="c9-character-neighbors">'+
  (before?act('c9-character-open','← Previous','c9-button c9-button--secondary c9-button--small','data-id="'+txt(before.id,esc)+'"'):'<span>First lesson</span>')+
  (after?act('c9-character-open','Next →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(after.id,esc)+'"'):'<span>Final lesson</span>')+
  '</div></header>';
 const previewSentence=lesson.sentence?.hanzi&&lesson.sentence?.english?lesson.sentence:null;
 const previewWords=(lesson.words||[]).filter(w=>w?.hanzi&&w?.english).slice(0,2);
 const sourceSample='<div class="c9-character-source-sample" aria-label="Source-backed character study preview">'+
  '<div class="c9-character-sample-head"><span class="c9-eyebrow">USE IT IN CONTEXT</span>'+
  act('c9-character-jump','Read examples →','c9-button c9-button--quiet c9-button--small','data-section="sentences" aria-controls="c9-sentences"')+'</div>'+
  (previewSentence?'<p lang="zh-Hans" class="c9-character-sample-hanzi">'+txt(previewSentence.hanzi,esc)+'</p>'+
   (showPinyin?'<span class="c9-character-sample-pinyin">'+txt(previewSentence.pinyin,esc)+'</span>':'')+
   (showTranslations?'<span class="c9-character-sample-english">'+txt(previewSentence.english,esc)+'</span>':''):'')+
  '<div class="c9-character-sample-words">'+previewWords.map(w=>'<span><strong lang="zh-Hans">'+txt(w.hanzi,esc)+'</strong>'+(showTranslations?'<small>'+txt(w.english,esc)+'</small>':'')+act('lookup-word','Open word →','c9-button c9-button--quiet c9-button--small','data-word="'+txt(w.hanzi,esc)+'"')+'</span>').join('')+'</div>'+
  '<div class="c9-character-sample-links">'+act('c9-character-jump',icon('pen')+' Free writing →','c9-button c9-button--secondary c9-button--small','data-section="writing" aria-controls="c9-writing"')+act('c9-character-reader','Read the original lesson →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(lesson.id,esc)+'"')+'</div></div>';
 const sourceAudio=renderC9ListeningDeck([
  ...(previewWords[0]?[{label:'Whole word',...previewWords[0]}]:[]),
  ...(previewSentence?[{label:'Source sentence',...previewSentence}]:[])
 ],act,esc,{title:'Listen to words in context',compact:true,showPinyin,showTranslations});
 const identity='<section class="c9-character-identity" aria-labelledby="c9-character-name">'+
  '<div class="c9-character-glyph-wrap"><div class="c9-character-glyph" lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</div><span class="c9-character-seal">'+txt(lesson.hanzi,esc)+' · ORIGINAL STUDY</span></div>'+
  '<div class="c9-character-identity-content"><span class="c9-eyebrow">LESSON '+String(index+1).padStart(3,'0')+' / '+DEMO_LESSONS.length+
  (group?' · UNIT '+group.index:'')+'</span>'+
  '<h2 id="c9-character-name">'+txt(lesson.meaning,esc)+'</h2>'+
  '<p class="c9-character-pinyin">'+(showPinyin?txt(lesson.pinyin,esc):'Pinyin hidden in settings')+'</p>'+
  '<p class="c9-character-note">'+txt(lesson.note,esc)+'</p>'+
  '<div class="c9-character-hero-actions">'+act('speak',icon('audio')+'Hear the character','c9-button c9-button--primary','data-text="'+txt(lesson.hanzi,esc)+'"')+
  act('c9-character-lesson',icon('book')+'Full lesson','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+
  act('practice-lesson',icon('repeat')+'Recall practice','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+'</div>'+
  '<p class="c9-character-audio-notice">Pronunciation uses a device Mandarin voice when available; no certified recording is supplied.</p>'+sourceSample+sourceAudio+'</div></section>';
 const evidence='<aside class="c9-character-evidence" aria-label="Source metadata and learner evidence">'+
  '<section class="c9-character-info c9-unified-card"><p class="c9-eyebrow">SOURCE INFORMATION</p><h3>Character details</h3>'+
  row('Original lesson',''+(index+1)+' / '+DEMO_LESSONS.length)+
  row('Authored study unit',group?txt(group.name,esc):'Unassigned')+
  row('Official HSK level','Not supplied')+
  row('Radical and stroke count','Unverified / unavailable')+
  row('Stroke-order data','Not installed')+
  (p31?row('Original P31 category',txt(p31.category,esc)):'')+'</section>'+
  '<section class="c9-character-info c9-unified-card"><p class="c9-eyebrow">YOUR ACTUAL EVIDENCE</p><h3>Learning record</h3>'+
  row('Introduction',introduced?'Introduced':'Not introduced')+
  row('Registered recall targets',ids.filter(id=>Boolean(state.cards?.[id])).length+' / '+ids.length)+
  row('Due for review',String(lessonDue))+
  row('Correct unassisted attempts',String(observed))+
  '<p>Introduction, due status and correct attempts are separate facts, not a mastery percentage.</p>'+
  (introduced?'<a href="#/review" class="c9-button c9-button--secondary c9-button--block">Go to scheduled review</a>':
    '<p>To create scheduled review targets, introduce this character explicitly in its original lesson.</p>')+'</section></aside>';
 const navigation='<nav class="c9-character-tabs" aria-label="Character study sections">'+tabs.map(([id,label],index)=>
  '<button type="button" class="c9-character-tab'+(index===0?' is-current':'')+'" data-action="c9-character-jump" data-section="'+id+'"'+(index===0?' aria-current="location"':'')+'>'+String(index+1).padStart(2,'0')+' · '+txt(label,esc)+'</button>').join('')+'</nav>';
 const sequence='<div class="c9-character-learning-sequence" role="group" aria-label="Original study sections">'+
  '<span class="c9-character-sequence-kicker">STUDY ROUTE</span>'+
  '<div><span>Understand</span><span>Write freely</span><span>Study words</span><span>Read in context</span></div>'+
  '<small>Teaching and ungraded writing are not mastery checkpoints.</small></div>';
 const writing='<section class="c9-character-section" id="c9-writing" aria-labelledby="c9-writing-title">'+
  '<header class="c9-character-section-head"><div><p class="c9-eyebrow">MANUAL CHARACTER PRACTICE</p><h2 id="c9-writing-title">Write by hand</h2></div><span class="c9-badge">Ungraded</span></header>'+
  '<p>Compare your marks with the original glyph. Draw freely with touch, mouse or keyboard; practice stays on this screen and receives no grade.</p>'+
  '<div class="c9-writing-workspace"><div class="c9-writing-guide" aria-label="Reference glyph in square guide"><span lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</span><small>Reference only</small></div>'+
  '<div class="c9-writing-pad"><details class="c9-writing-instructions" open><summary>Touch, mouse and keyboard controls</summary><p id="c9-writing-keyboard-help" class="c9-writing-keyboard-help">Drag to write. With a keyboard: focus the pad, move with arrow keys (Shift for larger steps), press Space or Enter to start/end a stroke, and Escape to lift the pen. Undo and Clear work from the keyboard. Nothing is graded or saved.</p></details><div class="c9-writing-canvas-wrap"><span id="c9-writing-trace-glyph" class="c9-writing-trace-glyph" lang="zh-Hans" aria-hidden="true" hidden>'+txt(lesson.hanzi,esc)+'</span><canvas id="c9-writing-canvas" tabindex="0" role="group" aria-label="Optional keyboard-operated and freehand Chinese writing pad, ungraded" aria-describedby="c9-writing-keyboard-help c9-writing-feedback" aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Space Enter Escape" width="640" height="640">The writing pad requires canvas support. The reference character and original lesson are still available.</canvas></div>'+
  '<div class="c9-writing-controls"><span id="c9-writing-feedback" role="status">Free practice · no saved strokes</span>'+
  '<div class="c9-inline"><button type="button" id="c9-writing-trace-toggle" class="c9-button c9-button--secondary c9-button--small" aria-pressed="false" aria-controls="c9-writing-trace-glyph">Show printed tracing guide</button><button type="button" id="c9-writing-undo" class="c9-button c9-button--secondary c9-button--small" disabled>Undo</button>'+
  '<button type="button" id="c9-writing-clear" class="c9-button c9-button--secondary c9-button--small" disabled>Clear</button></div></div></div></div>'+
  '<div class="c9-character-caution"><strong>Stroke-order limitation.</strong> Verified sequence diagrams, canonical stroke counts, automatic recognition and grading are not installed. The optional faint printed-glyph overlay is a visual tracing guide only; it provides no stroke sequence or direction. This canvas is unrestricted handwriting practice, not an authoritative stroke-order demonstration.</div></section>';
 const grammar='<section class="c9-character-section" id="c9-overview" aria-labelledby="c9-overview-title">'+
  '<header class="c9-character-section-head"><div><p class="c9-eyebrow">TEACHING NOTES</p><h2 id="c9-overview-title">Meaning and usage</h2></div></header>'+
  '<div class="c9-character-guidance"><div><span class="c9-eyebrow">CHARACTER INSIGHT</span><h3>'+txt(guide.topic,esc)+'</h3><p>'+txt(guide.explanation,esc)+'</p><p>'+txt(guide.comparison,esc)+'</p></div>'+
  (p31?'<div><span class="c9-eyebrow">ADDITIONAL ORIGINAL GUIDANCE</span><h3>'+txt(p31.grammarTitle,esc)+'</h3>'+
    '<p>'+txt(p31.grammarExplanation,esc)+'</p>'+
    '<p><strong>Common misunderstanding:</strong> '+txt(p31.pitfall,esc)+'</p>'+
    '<p><strong>Pronunciation note:</strong> '+txt(p31.pronunciation,esc)+'</p></div>':'')+
  '</div><p class="c9-character-provenance c9-unified-source-note">These are authored learning explanations, not verified paleographic etymologies or decomposition metadata.</p></section>';
 const vocabulary='<section class="c9-character-section" id="c9-vocabulary" aria-labelledby="c9-vocabulary-title">'+
  '<header class="c9-character-section-head"><div><p class="c9-eyebrow">WHOLE-WORD MEANINGS</p><h2 id="c9-vocabulary-title">Words containing '+txt(lesson.hanzi,esc)+'</h2></div><span class="c9-badge">'+words.length+' shown</span></header>'+
  '<p>Shared writing is a discovery link, not proof that every compound has the same meaning. Study the complete word.</p>'+
  (words.length?'<div class="c9-character-word-list">'+words.map(word=>{
   const current=lesson.words.some(w=>w.hanzi===word.hanzi);
   return '<article class="c9-character-word"><div><div class="c9-character-word-head"><strong lang="zh-Hans">'+txt(word.hanzi,esc)+'</strong><span class="c9-character-word-origin">'+(current?'LESSON WORD':'INDEXED WORD')+'</span></div><span>'+
    (showPinyin?txt(word.pinyin,esc):'Pinyin hidden')+'</span>'+
    '<p>'+txt(word.senses.join(' / '),esc)+'</p>'+
    (current?'<small>Included in the original character lesson</small>':'<small>Existing vocabulary index</small>')+'</div>'+
    '<div class="c9-character-word-actions">'+act('speak','Listen','c9-button c9-button--quiet c9-button--small','data-text="'+txt(word.hanzi,esc)+'"')+
    act('lookup-word','Word details ↗','c9-button c9-button--secondary c9-button--small','data-id="'+txt(word.key,esc)+'"')+
    '</div></article>';
  }).join('')+'</div>':'<p>No additional indexed words are available for this character.</p>')+
  '</section>';
 const examples='<section class="c9-character-section" id="c9-sentences" aria-labelledby="c9-sentences-title"><header class="c9-character-section-head">'+
  '<div><p class="c9-eyebrow">LANGUAGE IN CONTEXT</p><h2 id="c9-sentences-title">Example sentences</h2></div>'+
  act('c9-character-support',showTranslations?'Hide translations':'Show translations','c9-button c9-button--secondary c9-button--small','aria-pressed="'+showTranslations+'"')+'</header>'+
  '<p>These are existing authored source sentences, not generated or newly certified examples.</p>'+
  '<p class="c9-character-example-summary">'+sentences.length+' distinct original sentence'+(sentences.length===1?'':'s')+' available</p><div class="c9-character-example-list">'+sentences.map(({s,source},i)=>
    '<article class="c9-character-example"><span class="c9-character-example-index">'+String(i+1).padStart(2,'0')+'</span>'+
    '<div><p lang="zh-Hans">'+txt(s.hanzi,esc)+'</p>'+
    (showTranslations?'<div class="c9-character-example-translation">'+(showPinyin?'<span>'+txt(s.pinyin,esc)+'</span>':'')+
    '<span>'+txt(s.english,esc)+'</span></div>':'<small>Translations hidden for self-study; this does not create assessment credit.</small>')+
    '<small>'+txt(source,esc)+'</small></div>'+
    act('speak',icon('audio')+'Listen','c9-button c9-button--secondary c9-button--small','data-text="'+txt(s.hanzi,esc)+'"')+
    '</article>').join('')+'</div>'+
  '<div class="c9-character-inline-actions c9-unified-actions"><a class="c9-button c9-button--secondary" href="#/sentences">Sentence library</a>'+
  act('c9-character-reader','Sentence comprehension →','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+'</div></section>';
 const connections='<section class="c9-character-section" id="c9-connections" aria-labelledby="c9-connections-title">'+
  '<header class="c9-character-section-head"><div><p class="c9-eyebrow">WRITTEN LINKS</p><h2 id="c9-connections-title">Related characters</h2></div></header>'+
  '<p>Relationships below only indicate that both characters occur in the same indexed whole word; no radical, etymological or semantic relationship is asserted.</p>'+
  (related.length?'<div class="c9-character-related">'+related.map(({other,words:via})=>
    '<article><div><strong lang="zh-Hans">'+txt(other.hanzi,esc)+'</strong>'+
    '<span>'+txt(other.pinyin,esc)+' · '+txt(other.meaning,esc)+'</span>'+
    '<small>Shared indexed word: '+via.slice(0,2).map(x=>txt(x,esc)).join(', ')+'</small></div>'+
    act('c9-character-open','Study character →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(other.id,esc)+'"')+'</article>').join('')+'</div>':
  '<div class="c9-empty"><strong>No source-linked character found.</strong><p>The available vocabulary index has no other demo character sharing a word with this character.</p></div>')+
  '</section>';
 const footer='<footer class="c9-character-footer"><div><p class="c9-eyebrow">NEXT LEARNING ACTION</p><h2>Practise with the existing learning system</h2>'+
   '<p>Practice, review and lesson introduction remain separate processes. Browsing character information never awards mastery.</p></div>'+
   '<div class="c9-character-inline-actions c9-unified-actions">'+act('c9-character-lesson','Open original lesson →','c9-button c9-button--primary','data-id="'+txt(lesson.id,esc)+'"')+
    act('practice-lesson','Independent practice','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+
    '<a href="#/review" class="c9-button c9-button--secondary">Scheduled review</a></div></footer>';
 return '<div class="c9-character-page">'+heading+'<div class="c9-character-top">'+identity+navigation+evidence+'</div>'+sequence+
 '<div class="c9-character-body">'+grammar+writing+vocabulary+examples+connections+'</div>'+footer+'</div>';
}

/* Freehand writing is a disposable local UI affordance, never persisted or graded.
 * Pointer strokes are held in module closure for this mounted canvas only. */
let disposeWriting=null;
export function disconnectC9Writing(){if(disposeWriting){disposeWriting();disposeWriting=null;}}
export function connectC9Writing(root){
 disconnectC9Writing();
 const canvas=root.querySelector('#c9-writing-canvas');if(!canvas)return;
 const undo=root.querySelector('#c9-writing-undo'),clear=root.querySelector('#c9-writing-clear');
 const feedback=root.querySelector('#c9-writing-feedback');
 const trace=root.querySelector('#c9-writing-trace-glyph'),traceToggle=root.querySelector('#c9-writing-trace-toggle');
 let traceVisible=false;
 const toggleTrace=()=>{traceVisible=!traceVisible;if(trace)trace.hidden=!traceVisible;
  traceToggle?.setAttribute('aria-pressed',String(traceVisible));signal();};
 const context=canvas.getContext?.('2d');if(!context){
  canvas.hidden=true;if(feedback)feedback.textContent='Drawing is unavailable in this browser.';return;
 }
 let strokes=[],active=null,ratio=1;
 let cursor=[.5,.5],keyboardDrawing=false,keyboardFocused=false;
 const signal=()=>{
  if(undo)undo.disabled=!strokes.length;
  if(clear)clear.disabled=!strokes.length;
  if(feedback)feedback.textContent=(strokes.length?strokes.length+' line'+(strokes.length===1?'':'s'):'No lines')+(keyboardDrawing?' · keyboard pen down':' · pen up')+(traceVisible?' · printed glyph guide on':' · no printed guide')+' · not scored or saved';
 };
 const paint=()=>{
  const rect=canvas.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  ratio=Math.min(2,window.devicePixelRatio||1);
  const width=Math.max(1,Math.round(rect.width*ratio)),height=Math.max(1,Math.round(rect.height*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  context.setTransform(width,0,0,height,0,0);
  context.clearRect(0,0,1,1);
  const ink=getComputedStyle(canvas).getPropertyValue('--c9-ink').trim()||
   getComputedStyle(document.documentElement).getPropertyValue('--c9-ink').trim()||'#202827';
  context.strokeStyle=ink;context.lineWidth=0.009;
  context.lineCap='round';context.lineJoin='round';
  for(const points of strokes){
   if(!points.length)continue;
   context.beginPath();context.moveTo(points[0][0],points[0][1]);
   if(points.length===1){context.lineTo(points[0][0]+.0001,points[0][1]+.0001);}
   else for(const [x,y] of points.slice(1))context.lineTo(x,y);
   context.stroke();
  }
  if(keyboardFocused){
    context.beginPath();context.lineWidth=.003;
    context.moveTo(Math.max(0,cursor[0]-.015),cursor[1]);context.lineTo(Math.min(1,cursor[0]+.015),cursor[1]);
    context.moveTo(cursor[0],Math.max(0,cursor[1]-.015));context.lineTo(cursor[0],Math.min(1,cursor[1]+.015));
    context.stroke();
  }
 };
 const point=e=>{
  const r=canvas.getBoundingClientRect();
  return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),
   Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];
 };
 const down=e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  e.preventDefault();keyboardDrawing=false;active=[point(e)];strokes.push(active);
  try{canvas.setPointerCapture(e.pointerId);}catch{}
  signal();paint();
 };
 const move=e=>{
  if(!active)return;
  e.preventDefault();active.push(point(e));paint();
 };
 const up=e=>{
  if(!active)return;active.push(point(e));active=null;paint();
  if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
 };
 const cancel=()=>{active=null;paint();};
 const clearAction=()=>{strokes=[];active=null;keyboardDrawing=false;signal();paint();};
 const undoAction=()=>{strokes.pop();active=null;keyboardDrawing=false;signal();paint();};
 const keydown=e=>{
  const movement={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(movement[e.key]){
   e.preventDefault();
   const [x,y]=movement[e.key],step=e.shiftKey?.04:.015;
   cursor=[Math.max(.02,Math.min(.98,cursor[0]+x*step)),
    Math.max(.02,Math.min(.98,cursor[1]+y*step))];
   if(keyboardDrawing&&active)active.push([...cursor]);
   paint();return;
  }
  if(e.key===' '||e.key==='Enter'){
   e.preventDefault();if(e.repeat)return;
   keyboardDrawing=!keyboardDrawing;
   if(keyboardDrawing){active=[[...cursor]];strokes.push(active);}
   else active=null;
   signal();paint();return;
  }
  if(e.key==='Escape'&&keyboardDrawing){
   e.preventDefault();keyboardDrawing=false;active=null;signal();paint();
  }
 };
 const focusCanvas=()=>{keyboardFocused=true;paint();};
 const blurCanvas=()=>{keyboardFocused=false;keyboardDrawing=false;active=null;signal();paint();};
 canvas.addEventListener('pointerdown',down);
 canvas.addEventListener('pointermove',move);
 canvas.addEventListener('pointerup',up);
 canvas.addEventListener('pointercancel',cancel);
 canvas.addEventListener('keydown',keydown);
 canvas.addEventListener('focus',focusCanvas);
 canvas.addEventListener('blur',blurCanvas);
 undo?.addEventListener('click',undoAction);
 clear?.addEventListener('click',clearAction);
 traceToggle?.addEventListener('click',toggleTrace);
 let observer=null;
 if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(paint);observer.observe(canvas);}
 paint();signal();
 disposeWriting=()=>{
  observer?.disconnect();
  canvas.removeEventListener('pointerdown',down);
  canvas.removeEventListener('pointermove',move);
  canvas.removeEventListener('pointerup',up);
  canvas.removeEventListener('pointercancel',cancel);
  canvas.removeEventListener('keydown',keydown);
  canvas.removeEventListener('focus',focusCanvas);
  canvas.removeEventListener('blur',blurCanvas);
  undo?.removeEventListener('click',undoAction);
  clear?.removeEventListener('click',clearAction);
 traceToggle?.removeEventListener('click',toggleTrace);
  strokes=[];active=null;
 };
}
