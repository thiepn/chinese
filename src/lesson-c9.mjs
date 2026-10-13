/**
 * Concept 9 / C9-05 — source-aware lesson presentation.
 * Accepts the existing lessonDetails HTML from app.mjs verbatim: native actions,
 * source material, grading and introduction writers remain authoritative.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {lessonGroups} from './study-groups.mjs';
import {cardsForLesson,dueCards} from './study.mjs';

export const C9_LESSON_SECTIONS=Object.freeze([
 {id:'overview',name:'Character & sounds',description:'Meaning, Mandarin pronunciation and tone contrasts'},
 {id:'grammar',name:'Grammar & insight',description:'Explanations, companion patterns and helpful distinctions'},
 {id:'vocabulary',name:'Vocabulary',description:'Words built from this character and listening actions'},
 {id:'context',name:'Read & communicate',description:'Sentences, connected stories and natural exchanges'},
 {id:'practice',name:'Recall & practice',description:'Formative questions with their native feedback'},
 {id:'finish',name:'Next actions',description:'Introduce the lesson or continue practising'}
]);
const safeNum=(value)=>Number.isFinite(value)?Math.max(0,value):0;
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
 const due=new Set(dueCards(state)).size;
 const thisDue=[...ids].filter(id=>state.cards?.[id]&&state.cards[id].due<=Date.now()).length;
 const history=(state.events||[]).filter(e=>ids.has(e.cardId));
 const independent=history.filter(e=>e.correct===true&&e.assisted!==true).length;
 const introduced=(state.learned||[]).includes(l.id);
 return '<section class="c9-lesson-context-card" aria-labelledby="c9-lesson-record-title">'+
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
 return '<section class="c9-lesson-context-card" aria-labelledby="c9-lesson-sources-title">'+
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
 const heading='<header class="c9-lesson-header"><div class="c9-lesson-heading-main">'+
  act('c9-learn-back','← All lessons','c9-button c9-button--quiet c9-button--small')+
  '<p class="c9-eyebrow">UNIT '+String(group?.index??1).padStart(2,'0')+
  ' · LESSON '+String(index+1).padStart(3,'0')+' / '+DEMO_LESSONS.length+' · ORIGINAL DEMONSTRATION</p>'+
  '<div class="c9-lesson-title-row"><div><h1 id="c9-lesson-title" tabindex="-1"><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span><span>'+esc(lesson.meaning)+'</span></h1>'+
  '<p class="c9-lesson-pronunciation">'+(showPinyin?esc(lesson.pinyin):'Pinyin hidden by your learning preference')+'</p></div>'+
  '<span class="c9-badge '+(introduced?'c9-badge--success':'')+'">'+(introduced?'Introduced':'Not introduced')+'</span></div>'+
  '<p>Study the character, its useful words, grammar and real sentences. Introduction and independent scheduled recall are distinct actions.</p></div>'+
  '<div class="c9-lesson-header-actions"><div class="c9-lesson-pager">'+lessonMove(lesson,-1,act,esc)+lessonMove(lesson,1,act,esc)+'</div>'+
  act('course-lesson','Guided Daily Journey →','c9-button c9-button--primary','data-id="'+esc(lesson.id)+'"')+
  '</div></header>';
 const tabs='<nav class="c9-lesson-sections" aria-label="Lesson sections">'+C9_LESSON_SECTIONS.map(s=>jumpButton(s,selected,act,esc)).join('')+'</nav>';
 return '<div class="c9-lesson-workspace">'+heading+
  '<div class="c9-lesson-layout"><aside class="c9-lesson-left" aria-label="Lesson outline"><div class="c9-lesson-side-head">LEARNING SECTIONS</div>'+
  tabs+'<p class="c9-lesson-outline-note">Sections are study material, not completion checkboxes. The page does not mark stages as passed.</p></aside>'+
  '<div class="c9-lesson-main" id="c9-lesson-content" aria-label="Lesson learning material">'+nativeMarkup+
  '<nav class="c9-lesson-bottom-nav" aria-label="Adjacent lessons">'+lessonMove(lesson,-1,act,esc)+lessonMove(lesson,1,act,esc)+'</nav></div>'+
  '<aside class="c9-lesson-right" aria-label="Learning evidence and related material">'+evidencePanel(lesson,state,act,esc)+continuationPanel(lesson,state,act,esc)+'</aside></div></div>';
}
