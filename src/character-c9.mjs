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
import {guideFor,DEEP_NOTES} from './lesson-guides.mjs';
import {sourceCharacterLinks,sourceCharacterComparisonSet,sourceCharacterContextTrails} from './source-bridges-c9.mjs';
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
 const words=wordLinks(lesson),related=sourceCharacterLinks(lesson.id),contrasts=sourceCharacterComparisonSet(lesson.id),trails=sourceCharacterContextTrails(lesson.id),sentences=sourceSentences(lesson);
 const heading='<header class="c9-character-heading"><div><a href="#/learn" class="c9-character-back">← Learn / Character lessons</a>'+
  '<h1><span lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</span><span>'+txt(lesson.meaning,esc)+'</span></h1>'+
  '</div>'+
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
   '<span class="c9-character-sample-english"'+(showTranslations?'':' hidden')+'>'+txt(previewSentence.english,esc)+'</span>':'')+
  '<div class="c9-character-sample-words">'+previewWords.map(w=>'<span><strong lang="zh-Hans">'+txt(w.hanzi,esc)+'</strong>'+'<small class="c9-character-word-gloss"'+(showTranslations?'':' hidden')+'>'+txt(w.english,esc)+'</small>'+act('lookup-word','Open word →','c9-button c9-button--quiet c9-button--small','data-word="'+txt(w.hanzi,esc)+'"')+'</span>').join('')+'</div>'+
  '<div class="c9-character-sample-links">'+act('c9-character-jump',icon('pen')+' Free writing →','c9-button c9-button--secondary c9-button--small','data-section="writing" aria-controls="c9-writing"')+act('c9-character-reader','Read the original lesson →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(lesson.id,esc)+'"')+'</div></div>';
 const sourceAudio=renderC9ListeningDeck([
  ...(previewWords[0]?[{label:'Whole word',...previewWords[0]}]:[]),
  ...(previewSentence?[{label:'Source sentence',...previewSentence}]:[])
 ],act,esc,{title:'Listen to words in context',compact:true,showPinyin,showTranslations:true});
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
  '<p class="c9-character-audio-notice">Pronunciation uses a device Mandarin voice when available; no certified recording is supplied.</p>'+
  '<div class="c9-character-first-actions" aria-label="Study this source character now">'+
  act('c9-character-jump',icon('pen')+' Free writing →','c9-button c9-button--primary','data-section="writing" aria-controls="c9-writing"')+
  act('c9-character-jump',icon('book')+' Read example sentences →','c9-button c9-button--secondary','data-section="sentences" aria-controls="c9-sentences"')+
  '</div>'+sourceSample+sourceAudio+'</div></section>';
 const evidence='<aside class="c9-character-evidence" aria-label="Source metadata and learner evidence">'+
  '<section class="c9-character-info c9-unified-card"><h3>Character details</h3>'+
  row('Original lesson',''+(index+1)+' / '+DEMO_LESSONS.length)+
  row('Authored study unit',group?txt(group.name,esc):'Unassigned')+
  row('Official HSK level','Not supplied')+
  row('Radical and stroke count','Unverified / unavailable')+
  row('Stroke-order data','Not installed')+
  (p31?row('Original P31 category',txt(p31.category,esc)):'')+'</section>'+
  '<section class="c9-character-info c9-unified-card"><h3>Learning record</h3>'+
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
  '<header class="c9-character-section-head"><div><h2 id="c9-writing-title">Copy, trace, then recall</h2></div><span class="c9-badge">Ungraded</span></header>'+
  '<p>Choose a guided writing task, draw using touch, mouse or keyboard, then compare repeated attempts. All ink and comparisons stay in this mounted tab, without assessment credit or stored handwriting.</p>'+
  '<div class="c9-writing-modes" role="group" aria-label="Choose writing exercise">'+
   '<button type="button" class="c9-button c9-button--secondary" data-writing-mode="copy" aria-pressed="true">1 · Copy</button>'+
   '<button type="button" class="c9-button c9-button--secondary" data-writing-mode="trace" aria-pressed="false">2 · Trace print</button>'+
   '<button type="button" class="c9-button c9-button--secondary" data-writing-mode="recall" aria-pressed="false">3 · Recall from meaning</button>'+
  '</div>'+
  '<div class="c9-writing-task" role="group" aria-labelledby="c9-writing-task-title"><strong id="c9-writing-task-title">Copy with the original character visible</strong><p id="c9-writing-task-desc">Observe the reference, then write it without tracing. Move to recall when ready.</p></div>'+
  '<div class="c9-writing-workspace"><div class="c9-writing-guide" aria-label="Original reference for self-check"><span id="c9-writing-reference" lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</span><div class="c9-writing-cue" id="c9-writing-recall-cue" hidden><strong>Recall cue</strong><span>'+txt(lesson.meaning,esc)+'</span>'+(showPinyin?'<small>'+txt(lesson.pinyin,esc)+'</small>':'<small>Pinyin hidden in settings</small>')+'</div><small>Source lesson · no stroke order supplied</small></div>'+
  '<div class="c9-writing-pad"><details class="c9-writing-instructions"><summary>Touch, mouse and keyboard controls</summary><p id="c9-writing-keyboard-help" class="c9-writing-keyboard-help">Drag to write. With a keyboard: focus the pad, move with arrow keys (Shift for larger steps), press Space or Enter to start/end a line, and Escape to lift the pen. Undo reverses the latest line. Keeping an attempt clears the pad for a retry.</p></details>'+
  '<div class="c9-writing-canvas-wrap"><span id="c9-writing-trace-glyph" class="c9-writing-trace-glyph" lang="zh-Hans" aria-hidden="true" hidden>'+txt(lesson.hanzi,esc)+'</span><canvas id="c9-writing-canvas" tabindex="0" role="group" aria-label="Ungraded Chinese character writing surface with pointer or keyboard" aria-describedby="c9-writing-keyboard-help c9-writing-feedback" aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Space Enter Escape" width="640" height="640">Canvas drawing unavailable; use the original source glyph and lesson.</canvas></div>'+
  '<div class="c9-writing-controls"><span id="c9-writing-feedback" role="status">Copy · no lines · nothing saved</span>'+
  '<div class="c9-inline"><button type="button" id="c9-writing-reference-toggle" class="c9-button c9-button--secondary c9-button--small" hidden aria-pressed="false" aria-controls="c9-writing-reference">Reveal reference</button><button type="button" id="c9-writing-trace-toggle" class="c9-button c9-button--secondary c9-button--small" aria-pressed="false" aria-controls="c9-writing-trace-glyph">Show print overlay</button><button type="button" id="c9-writing-undo" class="c9-button c9-button--secondary c9-button--small" disabled>Undo</button><button type="button" id="c9-writing-clear" class="c9-button c9-button--secondary c9-button--small" disabled>Clear</button></div></div>'+
  '<div class="c9-writing-attempt-controls"><button type="button" id="c9-writing-keep" class="c9-button c9-button--primary c9-button--small" disabled>Keep attempt &amp; retry</button><button type="button" id="c9-writing-compare" class="c9-button c9-button--secondary c9-button--small" disabled aria-expanded="false" aria-controls="c9-writing-attempt-review">Compare with last attempt</button></div>'+
  '<section id="c9-writing-attempt-review" class="c9-writing-attempt-review" aria-label="Previous local attempt" hidden><div><strong>Previous attempt · this tab only</strong><p>Compare with your current drawing or reveal the original printed character. This is personal reflection, not handwriting recognition.</p></div><canvas id="c9-writing-previous-canvas" width="320" height="320" role="img" aria-label="Your previous handwritten attempt, reproduced locally from your drawing">Previous attempt preview requires canvas support.</canvas></section>'+
  '</div></div>'+
  '<div class="c9-character-caution"><strong>Stroke-order limitation.</strong> No verified stroke sequence, stroke count, radical decomposition or handwriting recognition source is installed. Tracing uses only the existing printed source glyph. Copying, recalling and comparing do not create grades, study events or evidence of canonical stroke order.</div></section>';
 const grammar='<section class="c9-character-section" id="c9-overview" aria-labelledby="c9-overview-title">'+
  '<header class="c9-character-section-head"><div><h2 id="c9-overview-title">Meaning and usage</h2></div></header>'+
  '<div class="c9-character-guidance"><div><span class="c9-eyebrow">CHARACTER INSIGHT</span><h3>'+txt(guide.topic,esc)+'</h3><p>'+txt(guide.explanation,esc)+'</p><p>'+txt(guide.comparison,esc)+'</p></div>'+
  (p31?'<div><span class="c9-eyebrow">ADDITIONAL ORIGINAL GUIDANCE</span><h3>'+txt(p31.grammarTitle,esc)+'</h3>'+
    '<p>'+txt(p31.grammarExplanation,esc)+'</p>'+
    '<p><strong>Common misunderstanding:</strong> '+txt(p31.pitfall,esc)+'</p>'+
    '<p><strong>Pronunciation note:</strong> '+txt(p31.pronunciation,esc)+'</p></div>':'')+
  '</div><p class="c9-character-provenance c9-unified-source-note">These are authored learning explanations, not verified paleographic etymologies or decomposition metadata.</p></section>';
 const vocabulary='<section class="c9-character-section" id="c9-vocabulary" aria-labelledby="c9-vocabulary-title">'+
  '<header class="c9-character-section-head"><div><h2 id="c9-vocabulary-title">Words containing '+txt(lesson.hanzi,esc)+'</h2></div><span class="c9-badge">'+words.length+' shown</span></header>'+
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
  '<div><h2 id="c9-sentences-title">Example sentences</h2></div>'+
  act('c9-character-support',showTranslations?'Hide translations':'Show translations','c9-button c9-button--secondary c9-button--small','aria-pressed="'+showTranslations+'"')+'</header>'+
  '<p>These are existing authored source sentences, not generated or newly certified examples.</p>'+
  '<p class="c9-character-example-summary">'+sentences.length+' distinct original sentence'+(sentences.length===1?'':'s')+' available</p><div class="c9-character-example-list">'+sentences.map(({s,source},i)=>
    '<article class="c9-character-example"><span class="c9-character-example-index">'+String(i+1).padStart(2,'0')+'</span>'+
    '<div><p lang="zh-Hans">'+txt(s.hanzi,esc)+'</p>'+
    '<div class="c9-character-example-translation"'+(showTranslations?'':' hidden')+'>'+(showPinyin?'<span>'+txt(s.pinyin,esc)+'</span>':'')+
    '<span>'+txt(s.english,esc)+'</span></div>'+
    '<small class="c9-character-example-hidden"'+(showTranslations?' hidden':'')+'>Translations hidden for self-study; this does not create assessment credit.</small>'+
    '<small>'+txt(source,esc)+'</small></div>'+
    act('speak',icon('audio')+'Listen','c9-button c9-button--secondary c9-button--small','data-text="'+txt(s.hanzi,esc)+'"')+
    '</article>').join('')+'</div>'+
  '<div class="c9-character-inline-actions c9-unified-actions"><a class="c9-button c9-button--secondary" href="#/sentences">Sentence library</a>'+
  act('c9-character-reader','Sentence comprehension →','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+'</div></section>';
 const authoredNote=DEEP_NOTES[lesson.hanzi]?.[2]||null;
 const authoredContrastWords=authoredNote?WORDS.filter(w=>w.hanzi.length>=2&&
  authoredNote.includes(w.hanzi)&&w.senses.length).slice(0,5):[];
 const authoredContrast=authoredNote?'<div class="c9-authored-contrast"><div>'+
  '<span class="c9-eyebrow">P65 · ORIGINAL AUTHOR COMPARISON</span>'+
  '<h3>Compare the taught forms, not imagined character structure</h3>'+
  '<p>'+txt(authoredNote,esc)+'</p>'+
  '<small>Original authored teaching note for '+txt(lesson.hanzi,esc)+'. This does not assert visually confusable forms, shared radicals or etymology.</small></div>'+
  (authoredContrastWords.length?'<div class="c9-authored-contrast-words">'+authoredContrastWords.map(w=>
   '<article><strong lang="zh-Hans">'+txt(w.hanzi,esc)+'</strong>'+
   '<span>'+txt(w.pinyin,esc)+' · '+txt(w.senses.slice(0,2).join(' / '),esc)+'</span>'+
   act('lookup-word','Open original entry →','c9-button c9-button--secondary c9-button--small',
    'data-id="'+txt(w.key,esc)+'"')+'</article>').join('')+'</div>':'')+'</div>':'';
 const guidedComparisons=contrasts.length?'<section class="c9-character-source-comparisons" aria-labelledby="c9-character-comparisons-title">'+
 '<div class="c9-character-compare-header"><span class="c9-eyebrow">P65 · ORIGINAL LESSON CONTRASTS</span>'+
 '<h3 id="c9-character-comparisons-title">Compare these two authored uses</h3>'+
 '<p>Read two source lesson sentences first. Predict how each character is used, then reveal their original meaning and Pinyin. These are teaching comparisons, not validated visual confusables or a scored test.</p></div>'+
 '<div class="c9-character-compare-grid">'+contrasts.map(({lesson:other,relation,words:via,sample})=>
 '<article><span class="c9-eyebrow">'+txt(relation,esc)+'</span>'+
 '<div class="c9-character-compare-pair"><span lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</span><span aria-hidden="true">↔</span><span lang="zh-Hans">'+txt(other.hanzi,esc)+'</span></div>'+
 '<div class="c9-character-compare-context"><p lang="zh-Hans">'+txt(lesson.sentence.hanzi,esc)+'</p>'+
 '<p lang="zh-Hans">'+txt(sample.hanzi,esc)+'</p></div>'+
 '<details><summary>Reveal original source meanings and readings</summary>'+
 '<div class="c9-character-compare-reveal"><div><strong lang="zh-Hans">'+txt(lesson.hanzi,esc)+'</strong>'+
 '<span>'+txt(lesson.pinyin,esc)+' · '+txt(lesson.meaning,esc)+'</span>'+
 '<small>'+txt(lesson.sentence.english,esc)+'</small></div>'+
 '<div><strong lang="zh-Hans">'+txt(other.hanzi,esc)+'</strong>'+
 '<span>'+txt(other.pinyin,esc)+' · '+txt(other.meaning,esc)+'</span>'+
 '<small>'+txt(sample.english,esc)+'</small></div></div></details>'+
 (via.length?'<small>Shared existing whole word: '+via.map(w=>txt(w.hanzi,esc)).join(' · ')+'</small>':'')+
 '<div class="c9-character-compare-actions">'+
 act('c9-character-open','Study other original lesson →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(other.id,esc)+'"')+
 act('lookup-word','Explore a source word →','c9-button c9-button--quiet c9-button--small',
  'data-id="'+txt(via[0]?.key||words[0]?.key||'',esc)+'"'+((via[0]||words[0])?'':' disabled'))+
 '</div></article>').join('')+'</div>'+
 '<p class="c9-character-provenance">Revealing or comparing examples creates no StudyEvent, scheduled review target or mastery grade. No radical, stroke or etymology claim is implied.</p></section>':
 '<p>No eligible authored character comparison exists for this original lesson; unverified pairings are not generated.</p>';
 
 const characterTrails=trails.length?'<section class="c9-character-context-trails" aria-label="Original whole-word usage trails">'+
  '<h3>Follow this written character into full words</h3>'+
  '<p>Each card comes from a canonical whole-word index and a matching authored source sentence. Shared writing is not proof of radical origin, pronunciation or meaning.</p>'+
  '<div class="c9-character-trail-grid">'+trails.map(item=>'<article><strong lang="zh-Hans">'+txt(item.wordHanzi,esc)+'</strong>'+
   '<small>'+txt(item.pinyin,esc)+' · '+txt(item.senses.slice(0,2).join(' / '),esc)+'</small>'+
   '<p lang="zh-Hans">'+txt(item.source.hanzi,esc)+'</p>'+
   '<details><summary>Reveal authored sentence reference</summary><span>'+txt(item.source.pinyin,esc)+'</span><small>'+txt(item.source.english,esc)+'</small></details>'+
   '<div class="c9-character-trail-actions">'+act('lookup-word','Open indexed word →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(item.wordKey,esc)+'"')+
   (item.link.sourceType==='sentence'?act('sentence-select','Open source sentence →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(item.link.sourceId,esc)+'"'):
    act('c9-source-open-story-line','Read passage source →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(item.link.sourceId,esc)+'" data-index="'+item.link.lineIndex+'"'))+'</div></article>').join('')+'</div></section>':'';
 const connections='<section class="c9-character-section" id="c9-connections" aria-labelledby="c9-connections-title">'+
  '<header class="c9-character-section-head"><div><h2 id="c9-connections-title">Related characters</h2></div></header>'+
  '<p>Relationships below only indicate that both characters occur in the same indexed whole word; no radical, etymological or semantic relationship is asserted.</p>'+
  authoredContrast+guidedComparisons+characterTrails+
  (related.length?'<div class="c9-character-related">'+related.map(({lesson:other,words:via})=>
    '<article><div><strong lang="zh-Hans">'+txt(other.hanzi,esc)+'</strong>'+
    '<span>'+txt(other.pinyin,esc)+' · '+txt(other.meaning,esc)+'</span>'+
    '<small>Shared indexed word: '+via.slice(0,2).map(w=>txt(w.hanzi,esc)).join(', ')+'</small>'+
    '<div class="c9-character-link-evidence">'+via.slice(0,2).map(w=>
     '<div><strong lang="zh-Hans">'+txt(w.hanzi,esc)+'</strong>'+
     '<span>'+txt(w.pinyin,esc)+' · '+txt(w.senses.slice(0,2).join(' / '),esc)+'</span>'+
     (w.examples[0]?'<small>Original authored example: <span lang="zh-Hans">'+txt(w.examples[0].hanzi,esc)+'</span> · '+txt(w.examples[0].english,esc)+'</small>':'<small>No authored usage sentence recorded for this word.</small>')+
     act('lookup-word','Study complete word →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(w.key,esc)+'"')+
     '</div>').join('')+'</div></div>'+
    act('c9-character-open','Study character →','c9-button c9-button--secondary c9-button--small','data-id="'+txt(other.id,esc)+'"')+'</article>').join('')+'</div>':
  '<div class="c9-empty"><strong>No source-linked character found.</strong><p>The available vocabulary index has no other demo character sharing a word with this character.</p></div>')+
  '</section>';
 const footer='<footer class="c9-character-footer"><div><p class="c9-eyebrow">NEXT LEARNING ACTION</p><h2>Practise with the existing learning system</h2>'+
   '<p>Practice, review and lesson introduction remain separate processes. Browsing character information never awards mastery.</p></div>'+
   '<div class="c9-character-inline-actions c9-unified-actions">'+act('c9-character-lesson','Open original lesson →','c9-button c9-button--primary','data-id="'+txt(lesson.id,esc)+'"')+
    act('practice-lesson','Independent practice','c9-button c9-button--secondary','data-id="'+txt(lesson.id,esc)+'"')+
    '<a href="#/review" class="c9-button c9-button--secondary">Scheduled review</a></div></footer>';
 return '<div class="c9-character-page" data-translations="'+String(showTranslations)+'">'+heading+'<div class="c9-character-top">'+identity+navigation+evidence+'</div>'+sequence+
 '<div class="c9-character-body">'+grammar+writing+vocabulary+examples+connections+'</div>'+footer+'</div>';
}

/* P61–P63: source-owned copy, print tracing and independent handwritten
 * recall on the existing C9 canvas. This is ephemeral UI-only state; it never
 * mutates canonical Review, lessons, mastery, IndexedDB or Account records. */
let disposeWriting=null;
export function disconnectC9Writing(){if(disposeWriting){disposeWriting();disposeWriting=null;}}
export function connectC9Writing(root){
 disconnectC9Writing();
 const canvas=root.querySelector('#c9-writing-canvas');if(!canvas)return;
 const el=id=>root.querySelector('#'+id);
 const undo=el('c9-writing-undo'),clear=el('c9-writing-clear');
 const keep=el('c9-writing-keep'),compare=el('c9-writing-compare');
 const feedback=el('c9-writing-feedback'),task=el('c9-writing-task-title'),taskDesc=el('c9-writing-task-desc');
 const guide=el('c9-writing-reference'),cue=el('c9-writing-recall-cue');
 const trace=el('c9-writing-trace-glyph'),traceToggle=el('c9-writing-trace-toggle');
 const referenceToggle=el('c9-writing-reference-toggle');
 const review=el('c9-writing-attempt-review'),previousCanvas=el('c9-writing-previous-canvas');
 const modeButtons=[...root.querySelectorAll('[data-writing-mode]')];
 const context=canvas.getContext?.('2d'),previewContext=previousCanvas?.getContext?.('2d');
 if(!context){
  canvas.hidden=true;if(feedback)feedback.textContent='Canvas drawing is unavailable in this browser.';
  for(const b of [...modeButtons,undo,clear,keep,compare,traceToggle,referenceToggle])if(b)b.disabled=true;
  return;
 }
 let strokes=[],active=null,previous=null,attemptCount=0,ratio=1;
 let mode='copy',traceVisible=false,referenceVisible=false,reviewVisible=false;
 let cursor=[.5,.5],keyboardDrawing=false,keyboardFocused=false;
 const taskCopy={
  copy:['Copy with the original character visible','Observe the original glyph at left; write it on the blank square. The printed overlay stays off.'],
  trace:['Trace the printed character','A faint printable glyph appears beneath your pen. It is not a stroke sequence or a handwriting grade.'],
  recall:['Recall from the English meaning','The nearby reference is covered. Write from the meaning cue, then reveal the original to check yourself. Other sections of this page may contain the character.']
 };
 const signal=()=>{
  if(undo)undo.disabled=!strokes.length;
  if(clear)clear.disabled=!strokes.length;
  if(keep)keep.disabled=!strokes.length;
  if(compare)compare.disabled=!previous?.length;
  if(feedback)feedback.textContent=mode[0].toUpperCase()+mode.slice(1)+' · '+strokes.length+' line'+(strokes.length===1?'':'s')+
   (keyboardDrawing?' · keyboard pen down':' · pen up')+(traceVisible?' · print overlay on':'')+
   (mode==='recall'&&referenceVisible?' · source revealed':'')+' · '+attemptCount+' prior attempt'+(attemptCount===1?'':'s')+' · not scored or saved';
 };
 const modes=()=>{
  if(task)task.textContent=taskCopy[mode][0];
  if(taskDesc)taskDesc.textContent=taskCopy[mode][1];
  if(guide)guide.hidden=mode==='recall'&&!referenceVisible;
  if(cue)cue.hidden=mode!=='recall';
  if(trace)trace.hidden=!traceVisible;
  if(traceToggle){
   traceToggle.setAttribute('aria-pressed',String(traceVisible));
   traceToggle.textContent=traceVisible?'Hide print overlay':'Show print overlay';
  }
  if(referenceToggle){
   referenceToggle.hidden=mode!=='recall';
   referenceToggle.setAttribute('aria-pressed',String(referenceVisible));
   referenceToggle.textContent=referenceVisible?'Cover reference':'Reveal reference';
  }
  for(const b of modeButtons)b.setAttribute('aria-pressed',String(b.dataset.writingMode===mode));
  signal();
 };
 const drawPaths=(ctx,paths,width,height)=>{
  const ink=getComputedStyle(canvas).getPropertyValue('--c9-ink').trim()||
   getComputedStyle(document.documentElement).getPropertyValue('--c9-ink').trim()||'#202827';
  ctx.setTransform(width,0,0,height,0,0);
  ctx.clearRect(0,0,1,1);
  ctx.strokeStyle=ink;ctx.lineWidth=.009;ctx.lineCap='round';ctx.lineJoin='round';
  for(const points of paths){
   if(!points.length)continue;
   ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
   if(points.length===1)ctx.lineTo(points[0][0]+.0001,points[0][1]+.0001);
   else for(const [x,y] of points.slice(1))ctx.lineTo(x,y);
   ctx.stroke();
  }
 };
 const paintPreview=()=>{
  if(!previewContext||!previous?.length)return;
  const r=previousCanvas.getBoundingClientRect();
  const width=Math.max(1,Math.round((r.width||160)*Math.min(2,window.devicePixelRatio||1)));
  const height=Math.max(1,Math.round((r.height||160)*Math.min(2,window.devicePixelRatio||1)));
  if(previousCanvas.width!==width||previousCanvas.height!==height){previousCanvas.width=width;previousCanvas.height=height;}
  drawPaths(previewContext,previous,width,height);
 };
 const paint=()=>{
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  ratio=Math.min(2,window.devicePixelRatio||1);
  const width=Math.max(1,Math.round(rect.width*ratio)),height=Math.max(1,Math.round(rect.height*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  drawPaths(context,strokes,width,height);
  if(keyboardFocused){
   context.beginPath();context.lineWidth=.003;
   context.moveTo(Math.max(0,cursor[0]-.015),cursor[1]);context.lineTo(Math.min(1,cursor[0]+.015),cursor[1]);
   context.moveTo(cursor[0],Math.max(0,cursor[1]-.015));context.lineTo(cursor[0],Math.min(1,cursor[1]+.015));
   context.stroke();
  }
  if(reviewVisible)paintPreview();
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
 const move=e=>{if(!active)return;e.preventDefault();active.push(point(e));paint();};
 const up=e=>{
  if(!active)return;active.push(point(e));active=null;signal();paint();
  if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
 };
 const cancel=()=>{active=null;signal();paint();};
 const clearAction=()=>{strokes=[];active=null;keyboardDrawing=false;signal();paint();};
 const undoAction=()=>{strokes.pop();active=null;keyboardDrawing=false;signal();paint();};
 const setMode=e=>{
  const selected=e.currentTarget.dataset.writingMode;
  if(!taskCopy[selected])return;
  mode=selected;traceVisible=selected==='trace';referenceVisible=false;
  modes();paint(); // existing ink intentionally stays until Clear or Keep & retry
 };
 const toggleTrace=()=>{traceVisible=!traceVisible;modes();paint();};
 const toggleReference=()=>{if(mode!=='recall')return;referenceVisible=!referenceVisible;modes();};
 const keepAction=()=>{
  if(!strokes.length)return;
  previous=strokes.map(points=>points.map(([x,y])=>[x,y]));
  attemptCount++;
  strokes=[];active=null;keyboardDrawing=false;
  reviewVisible=true;if(review)review.hidden=false;
  if(compare)compare.setAttribute('aria-expanded','true');
  if(mode==='recall')referenceVisible=false;
  modes();paint();paintPreview();
 };
 const toggleComparison=()=>{
  if(!previous?.length)return;
  reviewVisible=!reviewVisible;if(review)review.hidden=!reviewVisible;
  if(compare)compare.setAttribute('aria-expanded',String(reviewVisible));
  if(reviewVisible)paintPreview();
 };
 const keydown=e=>{
  const movement={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(movement[e.key]){
   e.preventDefault();const [x,y]=movement[e.key],step=e.shiftKey?.04:.015;
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
  if(e.key==='Escape'&&keyboardDrawing){e.preventDefault();keyboardDrawing=false;active=null;signal();paint();}
 };
 const focusCanvas=()=>{keyboardFocused=true;paint();};
 const blurCanvas=()=>{keyboardFocused=false;keyboardDrawing=false;active=null;signal();paint();};
 const registrations=[];
 const listen=(target,type,fn)=>{if(target){target.addEventListener(type,fn);registrations.push([target,type,fn]);}};
 listen(canvas,'pointerdown',down);listen(canvas,'pointermove',move);
 listen(canvas,'pointerup',up);listen(canvas,'pointercancel',cancel);
 listen(canvas,'keydown',keydown);listen(canvas,'focus',focusCanvas);listen(canvas,'blur',blurCanvas);
 listen(undo,'click',undoAction);listen(clear,'click',clearAction);
 listen(keep,'click',keepAction);listen(compare,'click',toggleComparison);
 listen(traceToggle,'click',toggleTrace);listen(referenceToggle,'click',toggleReference);
 for(const b of modeButtons)listen(b,'click',setMode);
 let observer=null;
 if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(paint);observer.observe(canvas);}
 else listen(window,'resize',paint);
 modes();paint();
 disposeWriting=()=>{
  observer?.disconnect();
  for(const [target,type,fn] of registrations)target.removeEventListener(type,fn);
  strokes=[];previous=null;active=null;
 };
}
