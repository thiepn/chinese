/**
 * Concept 9 / C9-05 — source-aware lesson presentation.
 * Accepts the existing lessonDetails HTML from app.mjs verbatim: native actions,
 * source material, grading and introduction writers remain authoritative.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {lessonGroups} from './study-groups.mjs';
import {cardsForLesson,dueCards} from './study.mjs';
import {renderC9NativeStatus} from './ui-c9.mjs';

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
function composeNativeSections(markup,act,esc){
 // Inserts within the original source-owned section openers, never duplicates
 // grading controls, source records or the single learner-state writer.
 return markup.replace(/(<section id="c9-lesson-(overview|grammar|vocabulary|context|practice|finish)" class="c9-native-section" tabindex="-1" aria-label="[^"]*">)/g,
  (opener,_full,id)=>{
   const index=C9_LESSON_SECTIONS.findIndex(s=>s.id===id);
   return index<0?opener:opener+stageHeading(C9_LESSON_SECTIONS[index],index,act,esc);
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
function continuationPanel(l,state,act,esc){
 const group=lessonGroups().find(g=>g.lessons.some(x=>x.id===l.id));
 const number=DEMO_LESSONS.findIndex(x=>x.id===l.id)+1;
 const links=[
   ['#/reader','Focused character reading','Read'],
   ['#/stories','Connected reading','Read'],
   ['#/dialogues','Natural conversations','Listen'],
   ['#/grammar','Full grammar library','Grammar']
 ];
 return '<section class="c9-lesson-context-card c9-unified-card" aria-labelledby="c9-lesson-sources-title">'+
  '<p class="c9-eyebrow">CONNECTED STUDY</p><h3 id="c9-lesson-sources-title">Continue in context</h3>'+
  '<p>Lesson '+number+' of '+DEMO_LESSONS.length+(group?' · Unit '+group.index+' '+esc(group.name):'')+'</p>'+
  '<div class="c9-lesson-related">'+links.map(([href,label,k])=>'<a href="'+href+'"><span><small>'+k+'</small><strong>'+label+'</strong></span><span aria-hidden="true">↗</span></a>').join('')+'</div>'+
  '<p>Links open the existing native learning modes. They do not claim completion or change review scheduling.</p></section>';
}
export function renderC9LessonWorkspace({lesson,state,nativeMarkup,section='overview',showPinyin=true,act,esc}){
 const index=DEMO_LESSONS.findIndex(l=>l.id===lesson.id);
 const groups=lessonGroups();
 const group=groups.find(g=>g.lessons.some(l=>l.id===lesson.id));
 const selected=C9_LESSON_SECTIONS.some(s=>s.id===section)?section:'overview';
 const introduced=(state.learned||[]).includes(lesson.id);
 const lessonDue=cardsForLesson(lesson.id).filter(id=>new Set(dueCards(state)).has(id)).length;
 const position=index+1;
 const positionPercent=Math.round(position/DEMO_LESSONS.length*100);
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
  act('c9-character-open','Character Study →','c9-button c9-button--secondary','data-id="'+esc(lesson.id)+'"')+
  act('course-lesson','Guided Daily Journey →','c9-button c9-button--primary','data-id="'+esc(lesson.id)+'"')+
  '</div></header>';
 const introduction='<section class="c9-lesson-visual-entry" aria-label="Lesson introduction and learning steps"><div class="c9-lesson-visual-copy"><span class="c9-eyebrow">TODAY’S ORIGINAL LESSON</span><strong lang="zh-Hans">'+esc(lesson.hanzi)+'</strong><h2>'+esc(lesson.meaning)+'</h2><p>'+esc(lesson.pinyin)+' · Character, useful words, sentence context and recall.</p><div class="c9-lesson-visual-actions">'+act('c9-lesson-jump','Start with character & sounds →','c9-button c9-button--primary','data-section="overview"')+'</div></div><div class="c9-lesson-visual-art" aria-hidden="true"><svg viewBox="0 0 480 180" preserveAspectRatio="xMidYMax slice"><path d="M0 161Q65 118 130 144T256 103T480 144V180H0Z" fill="currentColor" opacity=".13"/><path d="M40 169Q96 72 153 132Q196 90 260 117Q328 18 431 139" fill="none" stroke="currentColor" stroke-width="2" opacity=".3"/><path d="M275 149h120m-104 0 15-18h72l14 18m-75-20 9-9h50l9 9m-29-7v-25m-41 52v-18m67 18v-18" fill="none" stroke="currentColor" opacity=".4"/></svg><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span></div></section>';
 const tabs='<nav class="c9-lesson-sections" aria-label="Lesson sections">'+C9_LESSON_SECTIONS.map(s=>jumpButton(s,selected,act,esc)).join('')+'</nav>';
 const teaching=composeNativeSections(nativeMarkup,act,esc);
 const status=renderC9NativeStatus(introduced?'success':'info',
  introduced?'Introduced · keep practising':'Learning is ready',
  introduced?'Scheduled independent recall is tracked separately from this lesson.':
   'Review prompts are registered only when you explicitly introduce the lesson in the final section.');
 return '<div class="c9-lesson-workspace">'+heading+
  '<div class="c9-lesson-layout"><aside class="c9-lesson-left" aria-label="Lesson outline"><div class="c9-lesson-side-head">LEARNING SECTIONS</div>'+
  tabs+'<p class="c9-lesson-outline-note">Sections are study material, not completion checkboxes. The page does not mark stages as passed.</p></aside>'+
  '<div class="c9-lesson-main" id="c9-lesson-content" aria-label="Lesson learning material">'+
  introduction+'<div class="c9-lesson-start-status">'+status+'</div>'+teaching+
  '<nav class="c9-lesson-bottom-nav" aria-label="Adjacent lessons">'+lessonMove(lesson,-1,act,esc)+lessonMove(lesson,1,act,esc)+'</nav></div>'+
  '<aside class="c9-lesson-right" aria-label="Learning evidence and related material">'+evidencePanel(lesson,state,act,esc)+continuationPanel(lesson,state,act,esc)+'</aside></div></div>';
}
