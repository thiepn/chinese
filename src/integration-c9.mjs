/**
 * C9-25 — A single, read-only bridge over the *installed* canonical sources.
 * No storage, new learning ids, grades, generated tasks or cross-branch imports.
 * All actions return to the native app.mjs routes and assessment writers.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES,findStory} from './stories.mjs';
import {DIALOGUES,findDialogue} from './dialogues.mjs';
import {PATHWAY_MISSIONS} from './pathway-course.mjs';
import {P31_CHARACTER_GUIDES} from './p31-foundations.mjs';
import {P33_SCENARIOS} from './p33-scenarios.mjs';
import {P34_SCENES,P34_LISTENING} from './p34-course.mjs';
import {dueCards,summary} from './study.mjs';
import {C9_ADVANCED_PHASES} from './advanced-c9.mjs';

const tabs=Object.freeze([
 ['Characters','learn','Original character lessons',()=>DEMO_LESSONS.length],
 ['Words','wordbook','Canonical source words',()=>WORDS.length],
 ['Grammar','grammar','Authored grammar patterns',()=>GRAMMAR_LESSONS.length],
 ['Sentences','sentences','Original contextual sentences',()=>SENTENCE_LIBRARY.length],
 ['Readings','stories','Complete original passages',()=>STORIES.length],
 ['Dialogues','dialogues','Original conversation exchanges',()=>DIALOGUES.length],
 ['Pathway','pathway','Original native pathway missions',()=>PATHWAY_MISSIONS.length],
 ['Advanced course','advanced','P35–P51 original curricular collections',()=>C9_ADVANCED_PHASES.reduce((n,p)=>n+p.records.length,0)]
]);

export const C9_SOURCE_ROUTES=Object.freeze({
 characters:'learn',words:'explore',grammar:'grammar',sentences:'sentences',
 reading:'stories',dialogues:'dialogues',pathway:'pathway'
});
const skillSteps=[
 {kind:'lesson',title:'Understand a character',caption:'Open the existing lesson and its teaching sections'},
 {kind:'review',title:'Recall what is due',caption:'Only the native scheduler decides which prompts are due'},
 {kind:'reading',title:'Read in context',caption:'Answer the original passage question independently'},
 {kind:'dialogue',title:'Hear and respond',caption:'Device voice is optional; source questions hold the evidence'}
];
const resultCount=(events,id,key)=>events.some(e=>e[key]===id&&e.correct===true&&!e.assisted);
function nextReading(state){
 const ev=state.readingEvents||[];
 return STORIES.find(s=>!resultCount(ev,s.id,'storyId'))||STORIES[0]||null;
}
function nextDialogue(state){
 const ev=state.dialogueEvents||[];
 return DIALOGUES.find(d=>!resultCount(ev,d.id,'dialogueId'))||DIALOGUES[0]||null;
}
function sessionRoutes(state){
 return [
  ['Guided Practice','practice',state.practiceSession],
  ['Fluency Studio','fluency',state.fluencySession],
  ['Sentence Ladder','ladder',state.ladderSession],
  ['Study Block','block',state.studyBlock],
  ['Daily Journey','journey',state.courseJourney],
  ['Course Repair','journey',state.courseRepairSession],
  ['Vocabulary Journey','wordbook',state.vocabularyJourney]
 ].filter(([, ,v])=>Boolean(v));
}
function buttonTo(act,kind,id,text,esc,classes='c9-button c9-button--secondary'){
 const attr=id?'data-id="'+esc(id)+'"':'';
 return act('c9-integrate-'+kind,text,classes,attr);
}
export function renderC9LearningContinuity(state,act,esc,{compact=false}={}){
 const metrics=summary(state),due=dueCards(state).length;
 const lesson=DEMO_LESSONS.find(l=>!(state.learned||[]).includes(l.id))||DEMO_LESSONS[0];
 const passage=nextReading(state),dialogue=nextDialogue(state),sessions=sessionRoutes(state);
 const allReadingObserved=STORIES.length>0&&STORIES.every(s=>resultCount(state.readingEvents||[],s.id,'storyId'));
 const allDialogueObserved=DIALOGUES.length>0&&DIALOGUES.every(d=>resultCount(state.dialogueEvents||[],d.id,'dialogueId'));
 const content=[
  {id:'lesson',source:lesson,body:lesson?'<span lang="zh-Hans">'+esc(lesson.hanzi)+'</span> '+esc(lesson.pinyin)+' · '+esc(lesson.meaning):'Original lesson unavailable',context:lesson&&state.learned?.includes(lesson.id)?'All currently installed character lessons have been introduced':'Next not-yet-introduced original lesson'},
  {id:'review',source:null,body:due+' due scheduled prompt'+(due===1?'':'s'),context:due?'Review queue comes from the canonical scheduler':'Nothing scheduled as due right now'},
  {id:'reading',source:passage,body:passage?esc(passage.title):'No original passages available',context:passage?(allReadingObserved?'All original passages have at least one independently correct recorded response; revisit any text':'Prioritises texts lacking any independent correct recorded answer'):'No readable source is installed'},
  {id:'dialogue',source:dialogue,body:dialogue?esc(dialogue.title):'No original conversations available',context:dialogue?(allDialogueObserved?'All original dialogues have at least one independently correct recorded response; revisit any conversation':'Prioritises dialogues lacking an independently correct recorded response'):'No conversation source is installed'}
 ];
 return '<section class="c9-integrated-flow'+(compact?' is-compact':'')+'" aria-labelledby="c9-integrated-flow-title">'+
 '<header class="c9-integrated-header"><div><p class="c9-eyebrow">ONE ORIGINAL LEARNING PATH · NO SYNTHETIC GRADES</p>'+
 '<h2 id="c9-integrated-flow-title">Understand, recall, read, respond.</h2>'+
 '<p>Each action opens a real source or activity. Opening it does not record completion. Existing saved sessions and scheduled Review keep their own authorities.</p></div>'+
 '<a href="#/progress" class="c9-button c9-button--quiet c9-button--small">See actual progress →</a></header>'+
 '<div class="c9-integrated-steps">'+skillSteps.map((step,i)=>{
  const info=content[i],hasSource=step.kind==='review'||Boolean(info.source);
  return '<article class="c9-integrated-step"><div class="c9-integrated-step-top"><span>'+
  String(i+1).padStart(2,'0')+'</span><span>'+esc(step.title)+'</span></div>'+
  '<div class="c9-integrated-step-body"><strong>'+info.body+'</strong>'+
  '<p>'+esc(info.context)+'</p><small>'+esc(step.caption)+'</small></div>'+
  (hasSource?buttonTo(act,step.kind,info.source?.id,
    step.kind==='review'?(due?'Open due Review →':'Open Review →'):'Open original source →',esc,
    'c9-button '+(i===0?'c9-button--primary':'c9-button--secondary')+' c9-button--small'):'')+
  '</article>';
 }).join('')+'</div>'+
 (sessions.length?'<div class="c9-integrated-sessions"><strong>Saved native session'+(sessions.length===1?'':'s')+'</strong>'+
 '<div>'+sessions.map(([name,route])=>'<a class="c9-button c9-button--secondary c9-button--small" href="#/'+route+'">Resume '+esc(name)+' →</a>').join('')+'</div>'+
 '<p>Only persisted native checkpoints are represented. Unsent responses are not saved by navigation.</p></div>':
 '<p class="c9-integrated-none">No native work session is currently saved; Review history and other recorded answers are separate.</p>')+
 '<p class="c9-integrated-fact">Installed native course: '+metrics.learned+' / '+metrics.total+
 ' introduced character lessons · '+due+' due according to the original Review scheduler.</p></section>';
}
export function renderC9InstalledSourceAtlas(state,act,esc){
 const sources=[
 ['P31 · Character foundations',P31_CHARACTER_GUIDES.length,'learn','Original character family teaching'],
 ['P33 · Conversations',P33_SCENARIOS.length,'dialogues','Original scenarios and contextual decisions'],
 ['P34 · Connected readings',P34_SCENES.length,'stories','P34 original authored six-sentence sources'],
 ['P34 · Listening situations',P34_LISTENING.length,'dialogues','P34 listening-first device-voice situations']
 ];
 return '<section class="c9-integrated-atlas" aria-labelledby="c9-integrated-atlas-title">'+
 '<div class="c9-integrated-header"><div><p class="c9-eyebrow">WHAT IS REALLY INSTALLED IN THIS BRANCH</p>'+
 '<h2 id="c9-integrated-atlas-title">Original course materials</h2>'+
 '<p>These counts come from the imported canonical learning arrays, not from HSK level labels, simulated lessons or a remote catalog.</p></div>'+
 '<div class="c9-integrated-atlas-actions"><a href="#/advanced" class="c9-button c9-button--primary c9-button--small">Explore P35–P51 →</a><a href="#/find" class="c9-button c9-button--secondary c9-button--small">Search original material →</a></div></div>'+
 '<div class="c9-integrated-atlas-grid">'+tabs.map(([name,route,desc,total])=>
 '<a href="#/'+route+'" class="c9-integrated-atlas-tile"><span>'+esc(name)+'</span><strong>'+
 total()+'</strong><small>'+esc(desc)+'</small><span aria-hidden="true">→</span></a>').join('')+'</div>'+
 '<details class="c9-integrated-source-details"><summary>Original P31–P34 authored expansions <span>'+sources.length+' installed groups</span></summary>'+
 '<div>'+sources.map(([name,total,route,desc])=>'<a href="#/'+route+'"><strong>'+esc(name)+'</strong>'+
 '<span>'+total+' source entries</span><small>'+esc(desc)+'</small></a>').join('')+'</div></details>'+
 '<p class="c9-integrated-caveat">The original P35–P51 source files are present in this integration branch and their native lesson, grammar, reading, dialogue and writing exercise catalogs remain authoritative. The separate legacy P51 course-specific UI is not copied over wholesale; specialized ungraded source exploration and original native activity handoffs are available under Advanced Course. Official HSK certification and independently verified proficiency are not implied.</p></section>';
}
export function renderC9SourceReturn(handoff,currentRoute,act,esc){
 if(!handoff||!handoff.kind||!handoff.id||!handoff.origin)return '';
 if(currentRoute!==C9_SOURCE_ROUTES[handoff.kind])return '';
 const currentName=handoff.title||handoff.id;
 return '<aside class="c9-integrated-return" aria-label="Return to original source discovery">'+
 '<div><span class="c9-eyebrow">OPENED FROM '+(handoff.origin==='find'?'ORIGINAL SEARCH':'LEARN DISCOVERY')+'</span>'+
 '<strong>'+esc(currentName)+'</strong>'+
 '<small>'+esc(handoff.kind)+' · '+(handoff.origin==='find'?'Your search filters remain in this tab':'Your Learn discovery filters remain in this tab')+
 '. Source opening does not grade this material.</small></div>'+
 act('c9-integrate-return','← Back to '+(handoff.origin==='find'?'search results':'Learn discovery'),
 'c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}
export const c9LookupSource=(kind,id)=>{
 if(!Object.hasOwn(C9_SOURCE_ROUTES,kind))return null;
 const list={
  characters:DEMO_LESSONS,words:WORDS,grammar:GRAMMAR_LESSONS,
  sentences:SENTENCE_LIBRARY,reading:STORIES,dialogues:DIALOGUES,pathway:PATHWAY_MISSIONS
 }[kind];
 const row=list.find(x=>(x.key||x.id)===id);
 if(!row)return null;
 return {kind,id,title:row.title||row.hanzi||row.meaning||row.id,route:C9_SOURCE_ROUTES[kind]};
};
export function c9InstalledSourceCounts(){
 return Object.freeze(Object.fromEntries(tabs.map(([name,, ,read])=>[name,read()])));
}
