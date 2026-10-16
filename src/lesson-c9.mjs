/**
 * Concept 9 / C9-05 — source-aware lesson presentation.
 * Accepts the existing lessonDetails HTML from app.mjs verbatim: native actions,
 * source material, grading and introduction writers remain authoritative.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {lessonGroups} from './study-groups.mjs';
import {cardsForLesson,dueCards} from './study.mjs';
import {canonicalWordKey,findWord} from './lexicon.mjs';
import {sourceWordUsage,sourceCharacterLinks} from './source-bridges-c9.mjs';
import {renderC9NativeStatus,renderC9ListeningDeck} from './ui-c9.mjs';

export const C9_LESSON_SECTIONS=Object.freeze([
 {id:'overview',name:'Character & sounds',description:'Meaning, Mandarin pronunciation and tone contrasts'},
 {id:'grammar',name:'Grammar & insight',description:'Explanations, companion patterns and helpful distinctions'},
 {id:'vocabulary',name:'Vocabulary',description:'Words built from this character and listening actions'},
 {id:'context',name:'Read & communicate',description:'Sentences, connected stories and natural exchanges'},
 {id:'practice',name:'Recall & practice',description:'Formative questions with their native feedback'},
 {id:'finish',name:'Next actions',description:'Introduce the lesson or continue practising'}
]);
/* C9-20 visual-only lesson staging over the original six native sections. */
function stageHeading(section,index,act,esc){
 const prev=C9_LESSON_SECTIONS[index-1],next=C9_LESSON_SECTIONS[index+1];
 return '<header class="c9-lesson-stage-heading"><div>'+
  '<span class="c9-lesson-stage-index">SECTION '+String(index+1).padStart(2,'0')+' / 06 · TEACHING, NOT CREDIT</span>'+
  '<h2>'+esc(section.name)+'</h2><p>'+esc(section.description)+'</p></div>'+
  '<div class="c9-lesson-stage-links">'+
  (prev?act('c9-lesson-jump','← '+esc(prev.name),'c9-button c9-button--quiet c9-button--small','data-section="'+prev.id+'"'):'')+
  (next?act('c9-lesson-jump',esc(next.name)+' →','c9-button c9-button--secondary c9-button--small','data-section="'+next.id+'"'):
  '<a href="#/review" class="c9-button c9-button--secondary c9-button--small">Scheduled review →</a>')+'</div></header>';
}
function composeNativeSections(markup,act,esc,selected,focused){
 // Inserts within the original source-owned section openers, never duplicates
 // grading controls, source records or the single learner-state writer.
 return markup.replace(/(<section id="c9-lesson-(overview|grammar|vocabulary|context|practice|finish)" class="c9-native-section" tabindex="-1" aria-label="[^"]*">)/g,
  (opener,_full,id)=>{
   const index=C9_LESSON_SECTIONS.findIndex(s=>s.id===id);
   return index<0?opener:opener.replace(/>$/, ' data-c9-step="'+(index+1)+'"'+(focused&&selected!==id?' hidden':'')+'>')+stageHeading(C9_LESSON_SECTIONS[index],index,act,esc);
  });
}

function jumpButton(section,selected,act,esc){
 const chosen=section.id===selected;
 return act('c9-lesson-jump',
  '<span class="c9-lesson-nav-mark" aria-hidden="true"></span><span class="c9-lesson-nav-copy"><strong>'+esc(section.name)+'</strong><small>'+esc(section.description)+'</small></span>',
  'c9-lesson-nav-button'+(chosen?' is-current':''),
  'data-section="'+section.id+'" aria-controls="c9-lesson-'+section.id+'" '+(chosen?'aria-current="location"':''));
}
function lessonMove(l,position,act,esc){
 const idx=DEMO_LESSONS.findIndex(x=>x.id===l.id);
 const target=DEMO_LESSONS[idx+position];
 if(!target)return '<span class="c9-lesson-edge" aria-label="'+(position<0?'First lesson':'Final lesson')+'">'+(position<0?'Start of course':'End of course')+'</span>';
 return act('c9-lesson-select',(position<0?'← Previous lesson':'Next lesson →'),
  'c9-button c9-button--secondary c9-lesson-edge-button','data-id="'+esc(target.id)+'"');
}
function evidencePanel(l,state,act,esc){
 const ids=new Set(cardsForLesson(l.id));
 const active=ids.size;
 const registered=[...ids].filter(id=>Boolean(state.cards?.[id]));
 const scheduledDue=new Set(dueCards(state));
 const due=scheduledDue.size;
 const thisDue=[...ids].filter(id=>scheduledDue.has(id)).length;
 const history=(state.events||[]).filter(e=>ids.has(e.cardId));
 const independent=history.filter(e=>e.correct===true&&e.assisted!==true).length;
 const introduced=(state.learned||[]).includes(l.id);
 return '<section class="c9-lesson-context-card c9-unified-card" aria-labelledby="c9-lesson-record-title">'+
  '<p class="c9-eyebrow">YOUR ACTUAL LEARNING RECORD</p><h3 id="c9-lesson-record-title">Lesson status</h3>'+
  '<div class="c9-lesson-evidence"><div><span>Introduction</span><strong>'+(introduced?'Introduced':'Not introduced')+'</strong></div>'+
  '<div><span>Registered review targets</span><strong>'+registered.length+' / '+active+'</strong></div>'+
  '<div><span>Due from this lesson</span><strong>'+thisDue+'</strong></div>'+
  '<div><span>Independent correct attempts</span><strong>'+independent+'</strong></div></div>'+
  '<p>These are separate observations, not percentage mastery or official HSK progress. '+due+' scheduled prompt'+(due===1?' is':'s are')+' due across your course.</p>'+
  (introduced?'<a class="c9-button c9-button--secondary c9-button--block" href="#/review">Open scheduled review →</a>':
  '<p class="c9-lesson-intro-hint">Lesson introduction remains an explicit action in the final section. Opening this page does not create review cards.</p>')+
  '</section>';
}
/**
 * C9-55 contextual transfer projection. Only existing canonical word keys,
 * authored sentence IDs, passage IDs and related original lesson IDs.
 * Written-form occurrence is NOT proof of a particular lexical sense or
 * grammatical relationship. Never stores a study event or grants credit.
 */
export function c9LessonTransferSources(lesson,state){
 const selected=[],sentences=[],readings=[],seenSentences=new Set(),seenReadings=new Set();
 for(const word of (lesson?.words||[])){
  const source=findWord(canonicalWordKey(word.hanzi,word.pinyin));
  if(!source||selected.some(row=>row.key===source.key))continue;
  selected.push({key:source.key,hanzi:source.hanzi,pinyin:source.pinyin,gloss:word.english});
  for(const usage of sourceWordUsage(source.key,{limit:20})){
   if(usage.sourceType==='sentence'&&!seenSentences.has(usage.sourceId)){
    seenSentences.add(usage.sourceId);
    sentences.push({id:usage.sourceId,hanzi:usage.hanzi,pinyin:usage.pinyin,english:usage.english,word:source.hanzi,sourceTitle:usage.sourceTitle});
   }
   if(usage.sourceType==='story'&&!seenReadings.has(usage.sourceId)){
    seenReadings.add(usage.sourceId);
    readings.push({id:usage.sourceId,hanzi:usage.hanzi,pinyin:usage.pinyin,english:usage.english,word:source.hanzi,sourceTitle:usage.sourceTitle,
     saved:Boolean(state?.bookmarkedStories?.includes(usage.sourceId))});
   }
  }
  if(selected.length>=3)break;
 }
 const related=sourceCharacterLinks(lesson?.id,{limit:3}).map(link=>({
  id:link.lesson.id,hanzi:link.lesson.hanzi,meaning:link.lesson.meaning,
  introduced:Boolean(state?.learned?.includes(link.lesson.id)),
  words:link.words.map(word=>word.hanzi)
 }));
 return {words:selected,sentences:sentences.slice(0,2),readings:readings.slice(0,2),related};
}
function continuationPanel(lesson,state,act,esc,{showPinyin=true}={}){
 const sources=c9LessonTransferSources(lesson,state);
 const known=sources.words.length;
 const surface=(row)=>'<strong lang="zh-Hans">'+esc(row.hanzi)+'</strong>'+
  (showPinyin?'<small>'+esc(row.pinyin)+'</small>':'')+
  '<span>'+esc(row.english)+'</span>';
 const wordRows=sources.words.map(w=>'<li><span><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong>'+
  (showPinyin?'<small>'+esc(w.pinyin)+'</small>':'')+'<span>'+esc(w.gloss)+'</span></span>'+
  act('lookup-word','Open dictionary','c9-button c9-button--secondary c9-button--small','data-id="'+esc(w.key)+'"')+'</li>').join('');
 const sentences=sources.sentences.map(row=>'<article class="c9-lesson-transfer-card"><div>'+
  '<span class="c9-eyebrow">ORIGINAL SENTENCE · '+esc(row.sourceTitle)+'</span>'+surface(row)+
  '<small>Includes the written form '+esc(row.word)+'; meaning must be checked in its context.</small></div>'+
  act('sentence-select','Practise this sentence →','c9-button c9-button--primary c9-button--small','data-id="'+esc(row.id)+'"')+'</article>').join('');
 const readings=sources.readings.map(row=>'<article class="c9-lesson-transfer-card"><div>'+
  '<span class="c9-eyebrow">ORIGINAL READING · '+esc(row.sourceTitle)+(row.saved?' · SAVED':'')+'</span>'+surface(row)+
  '<small>Passage contains the written form '+esc(row.word)+'; this is not a verified vocabulary-sense match.</small></div>'+
  act('c9-media-open-story','Open exact reading →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(row.id)+'"')+'</article>').join('');
 const related=sources.related.map(row=>'<li><span><strong lang="zh-Hans">'+esc(row.hanzi)+'</strong>'+
  '<span>'+esc(row.meaning)+' · '+(row.introduced?'Introduced':'Not introduced')+'</span>'+
  '<small>Indexed shared whole word: '+esc(row.words.join(', '))+'</small></span>'+
  act('c9-lesson-open','Related lesson →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(row.id)+'"')+'</li>').join('');
 return '<section class="c9-lesson-transfer c9-unified-card" id="c9-lesson-transfer" tabindex="-1" aria-labelledby="c9-lesson-transfer-title">'+
  '<header class="c9-lesson-transfer-head"><div><p class="c9-eyebrow">SOURCE-BACKED TRANSFER · NO AUTO CREDIT</p>'+
  '<h2 id="c9-lesson-transfer-title">Use this lesson in real context</h2>'+
  '<p>Follow exact indexed original content into dictionary, sentence practice or reading. Opening a source never marks a lesson as learned or changes review scheduling.</p></div>'+
  '<span class="c9-badge">'+known+' indexed word'+(known===1?'':'s')+'</span></header>'+
  (known?'<div class="c9-lesson-transfer-words"><h3>Study complete words</h3><ul>'+wordRows+'</ul></div>':
   '<p class="c9-assessment-note">No canonical dictionary entry is linked to this original lesson. Use the lesson’s own authored vocabulary instead.</p>')+
  ((sentences||readings)?'<div class="c9-lesson-transfer-sources">'+sentences+readings+'</div>':
   '<p class="c9-assessment-note">No exact original external sentence or reading match was found for these words. The lesson’s own sentence remains available above.</p>')+
  (related?'<details class="c9-lesson-transfer-related"><summary>Related character lessons from shared indexed words ('+sources.related.length+')</summary>'+
   '<ul>'+related+'</ul></details>':'')+
  '<details class="c9-lesson-transfer-other"><summary>Explore other study libraries</summary>'+
  '<nav aria-label="Original additional study modes">'+
  '<a href="#/reader">Character reading</a><a href="#/stories">All readings</a>'+
  '<a href="#/dialogues">Conversations</a><a href="#/grammar">Grammar</a></nav>'+
  '</details><p class="c9-assessment-note">These are written-form and source-index connections only, not verified etymology, word-sense, mastery or official HSK evidence.</p></section>';
}
export function renderC9LessonWorkspace({lesson,state,nativeMarkup,section='overview',focused=true,showPinyin=true,act,esc}){
 const index=DEMO_LESSONS.findIndex(l=>l.id===lesson.id);
 const groups=lessonGroups();
 const group=groups.find(g=>g.lessons.some(l=>l.id===lesson.id));
 const selected=C9_LESSON_SECTIONS.some(s=>s.id===section)?section:'overview';
 const introduced=(state.learned||[]).includes(lesson.id);
 const lessonDue=cardsForLesson(lesson.id).filter(id=>new Set(dueCards(state)).has(id)).length;
 const position=index+1;
 const positionPercent=Math.round(position/DEMO_LESSONS.length*100);
 const words=(lesson.words||[]).filter(w=>w?.hanzi&&w?.english).slice(0,2);
 const example=lesson.sentence?.hanzi&&lesson.sentence?.english?lesson.sentence:null;
 const preview='<section class="c9-lesson-source-preview" aria-labelledby="c9-lesson-source-title">'+
  '<div class="c9-lesson-preview-title"><div><p class="c9-eyebrow">BEFORE YOU BEGIN · ORIGINAL CONTENT</p><h2 id="c9-lesson-source-title">What you will learn</h2></div><div class="c9-lesson-preview-toolbar"><span class="c9-badge">Read-only preview</span>'+act('c9-lesson-jump','Start teaching ↓','c9-button c9-button--primary c9-button--small','data-section="overview" aria-controls="c9-lesson-overview"')+'</div></div>'+
  '<div class="c9-lesson-preview-grid">'+
   '<article class="c9-lesson-preview-character"><span>01 · CHARACTER</span><strong lang="zh-Hans">'+esc(lesson.hanzi)+'</strong><small>'+(showPinyin?esc(lesson.pinyin):'Pinyin hidden')+'</small><p>'+esc(lesson.meaning)+'</p>'+
   act('c9-lesson-jump','Study the character →','c9-button c9-button--secondary c9-button--small','data-section="overview" aria-controls="c9-lesson-overview"')+'</article>'+
   '<article class="c9-lesson-preview-words"><span>02 · WHOLE WORDS</span><div>'+words.map(w=>'<div class="c9-lesson-preview-word"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><span>'+(showPinyin?esc(w.pinyin)+' · ':'')+esc(w.english)+'</span>'+act('lookup-word','Word details →','c9-button c9-button--quiet c9-button--small','data-word="'+esc(w.hanzi)+'"')+'</div>').join('')+'</div>'+
   act('c9-lesson-jump','Study vocabulary →','c9-button c9-button--secondary c9-button--small','data-section="vocabulary" aria-controls="c9-lesson-vocabulary"')+'</article>'+
   (example?'<article class="c9-lesson-preview-sentence"><span>03 · CONTEXT SENTENCE</span><strong lang="zh-Hans">'+esc(example.hanzi)+'</strong>'+(showPinyin?'<small>'+esc(example.pinyin)+'</small>':'')+'<p>'+esc(example.english)+'</p>'+
   act('c9-lesson-jump','Read in context →','c9-button c9-button--secondary c9-button--small','data-section="context" aria-controls="c9-lesson-context"')+'</article>':'')+
  '</div><p class="c9-lesson-preview-disclaimer">These examples are teaching material. Browsing them never introduces a lesson or records a grade.</p></section>';
 const sourceAudio=renderC9ListeningDeck([
  {label:'Character',hanzi:lesson.hanzi,pinyin:lesson.pinyin,english:lesson.meaning},
  ...(words[0]?[{label:'Whole word',hanzi:words[0].hanzi,pinyin:words[0].pinyin,english:words[0].english}]:[]),
  ...(example?[{label:'Context sentence',...example}]:[])
 ],act,esc,{title:'Hear it, then read it',showPinyin});
 const heading='<header class="c9-lesson-header"><div class="c9-lesson-heading-main">'+
  act('c9-learn-back','← All lessons','c9-button c9-button--quiet c9-button--small')+
  '<p class="c9-eyebrow">UNIT '+String(group?.index??1).padStart(2,'0')+
  ' · LESSON '+String(index+1).padStart(3,'0')+' / '+DEMO_LESSONS.length+' · ORIGINAL DEMONSTRATION</p>'+
  '<div class="c9-lesson-title-row"><div><h1 id="c9-lesson-title" tabindex="-1"><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span><span>'+esc(lesson.meaning)+'</span></h1>'+
  '<p class="c9-lesson-pronunciation">'+(showPinyin?esc(lesson.pinyin):'Pinyin hidden by your learning preference')+'</p></div>'+
  '<div class="c9-lesson-record-badges"><span class="c9-badge '+(introduced?'c9-badge--success':'')+'">'+(introduced?'Introduced':'Not introduced')+'</span>'+
  (lessonDue?'<span class="c9-badge c9-lesson-due">'+lessonDue+' due</span>':'')+'</div></div>'+
  '<p>Study the character, useful complete words, original grammar and contextual sentences. Only the explicit introduction and graded assessment record progress.</p>'+
  '<div class="c9-lesson-course-position" role="group" aria-label="Lesson order in the original course"><div><span>Course position</span><strong>'+position+' / '+DEMO_LESSONS.length+' lessons</strong></div>'+
  '<div class="c9-progress" role="progressbar" aria-label="Lesson order, not mastery" aria-valuemin="0" aria-valuemax="'+DEMO_LESSONS.length+'" aria-valuenow="'+position+'"><span style="width:'+positionPercent+'%"></span></div>'+
  '<small>Curriculum position · not mastery or completion</small></div></div>'+
  '<div class="c9-lesson-header-actions c9-unified-actions"><div class="c9-lesson-pager">'+lessonMove(lesson,-1,act,esc)+lessonMove(lesson,1,act,esc)+'</div>'+
  act('c9-lesson-jump','Start at step 1 ↓','c9-button c9-button--primary','data-section="overview" aria-controls="c9-lesson-overview"')+
  act('c9-lesson-copy-link','Copy lesson link','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'" aria-label="Copy public link to original lesson '+position+'"')+
  '<details class="c9-lesson-extra"><summary>Other ways to study this lesson</summary><div class="c9-lesson-extra-actions">'+
  act('c9-character-open','Character Study','c9-button c9-button--secondary','data-id="'+esc(lesson.id)+'"')+
  act('c9-character-reader','Read original story','c9-button c9-button--secondary','data-id="'+esc(lesson.id)+'"')+
  act('course-lesson','Guided Daily Journey','c9-button c9-button--secondary','data-id="'+esc(lesson.id)+'"')+'</div></details>'+
  '</div></header>';
 const tabs='<nav class="c9-lesson-sections" aria-label="Lesson sections">'+C9_LESSON_SECTIONS.map(s=>jumpButton(s,selected,act,esc)).join('')+'</nav>';
 const teaching=composeNativeSections(nativeMarkup,act,esc,selected,focused);
 const activeIndex=C9_LESSON_SECTIONS.findIndex(s=>s.id===selected);
 const stagebar='<div class="c9-lesson-flow" aria-label="Teaching sequence">'+
   '<div class="c9-lesson-flow-heading"><span class="c9-eyebrow">FOLLOW THE LESSON IN ORDER</span>'+
   '<strong id="c9-lesson-flow-label">Step '+(activeIndex+1)+' of '+C9_LESSON_SECTIONS.length+' · '+esc(C9_LESSON_SECTIONS[activeIndex].name)+'</strong>'+
   '<p>These are teaching steps, not completion or mastery grades.</p></div>'+
   act('c9-lesson-mode',focused?'Show all sections':'Focus on one step','c9-button c9-button--secondary c9-button--small','aria-pressed="'+focused+'"')+
   '<div class="c9-lesson-flow-progress" role="progressbar" aria-label="Current teaching step, not mastery" aria-valuemin="1" aria-valuemax="'+C9_LESSON_SECTIONS.length+'" aria-valuenow="'+(activeIndex+1)+'">'+
   '<span style="width:'+((activeIndex+1)/C9_LESSON_SECTIONS.length*100)+'%"></span></div></div>';
 const stageFooters='<nav class="c9-lesson-stage-footers" aria-label="Continue through this lesson">'+
  C9_LESSON_SECTIONS.map((stage,i)=>'<div class="c9-lesson-step-footer" data-section="'+stage.id+'"'+(stage.id!==selected?' hidden':'')+'>'+
   '<span>STEP '+(i+1)+' / '+C9_LESSON_SECTIONS.length+' · '+esc(stage.name)+'</span>'+
   '<div class="c9-lesson-step-buttons">'+
   (i?act('c9-lesson-jump','← Previous step','c9-button c9-button--quiet','data-section="'+C9_LESSON_SECTIONS[i-1].id+'"'):'')+
   (i+1<C9_LESSON_SECTIONS.length?act('c9-lesson-jump','Next: '+esc(C9_LESSON_SECTIONS[i+1].name)+' →','c9-button c9-button--primary','data-section="'+C9_LESSON_SECTIONS[i+1].id+'"'):
    (introduced?
       '<span class="c9-lesson-finish-confirmation" role="status">Lesson introduced · original review targets registered</span>':
       '<span class="c9-lesson-finish-hint">Introduce this lesson using the source-owned action above when ready.</span>')+
    (introduced?lessonMove(lesson,1,act,esc):'')+
    '<a class="c9-button c9-button--secondary" href="#/review">Scheduled review →</a>')+
   '</div></div>').join('')+'</nav>';
 const status=renderC9NativeStatus(introduced?'success':'info',
  introduced?'Introduced · keep practising':'Learning is ready',
  introduced?'Scheduled independent recall is tracked separately from this lesson.':
   'Review prompts are registered only when you explicitly introduce the lesson in the final section.');
 const resources='<details class="c9-lesson-resources"><summary><span><strong>Preview original source and audio</strong>'+
  '<small>Character · indexed whole words · original sentence · device listening</small></span><span aria-hidden="true">Explore ↘</span></summary>'+
  '<div class="c9-lesson-resources-content">'+preview+sourceAudio+'</div></details>';
 return '<div class="c9-lesson-workspace" data-c9-focused="'+String(focused)+'">'+heading+
  '<div class="c9-lesson-layout"><aside class="c9-lesson-left" aria-label="Lesson outline"><div class="c9-lesson-side-head">LEARNING SECTIONS</div>'+
  tabs+'<p class="c9-lesson-outline-note">Sections are study material, not completion checkboxes. The page does not mark stages as passed.</p></aside>'+
  '<div class="c9-lesson-main" id="c9-lesson-content" aria-label="Lesson learning material">'+
  stagebar+'<div class="c9-lesson-start-status">'+status+'</div>'+teaching+stageFooters+
  continuationPanel(lesson,state,act,esc,{showPinyin})+resources+
  '<nav class="c9-lesson-bottom-nav" aria-label="Adjacent lessons">'+lessonMove(lesson,-1,act,esc)+lessonMove(lesson,1,act,esc)+'</nav></div>'+
  '<aside class="c9-lesson-right" aria-label="Learning evidence">'+evidencePanel(lesson,state,act,esc)+'</aside></div></div>';
}
