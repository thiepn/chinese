/** Read-only HSK-target navigation. Targets are NOT verified exam memberships. */
import {lessonGroups} from './study-groups.mjs';
import {STORIES} from './stories.mjs';
import {PATHWAY_MISSIONS} from './pathway-course.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {WORDS} from './lexicon.mjs';
import {levelWorkspaceEvidence,renderLevelEvidencePanel,renderLevelUnits,renderLevelReview} from './hsk-level-workspace-c9.mjs';

export const HSK_TARGETS=Object.freeze([
 ['1','HSK 1','Foundations'],
 ['2','HSK 2','Everyday communication'],
 ['3','HSK 3','Connected situations'],
 ['4','HSK 4','Intermediate contexts'],
 ['5','HSK 5','Advanced reading and expression'],
 ['6','HSK 6','Upper-intermediate original readings'],
 ['7-9','HSK 7–9','Advanced exploration samples']
].map(([id,name,focus])=>Object.freeze({id,name,focus,officialMapping:false})));

export function hskTargetGroup(group){
 if(group.index<=20||group.name.startsWith('P31 '))return '1';
 if(group.name.startsWith('P35 '))return '2';
 if(group.name.startsWith('P39 '))return '3';
 if(group.name.startsWith('P46 ')||group.name.startsWith('P47 '))return '4';
 if(group.name.startsWith('P50 ')||group.name.startsWith('P51 '))return '5';
 return null;
}
export function hskTargetLessons(id){
 if(!HSK_TARGETS.some(t=>t.id===String(id)))return [];
 return lessonGroups().filter(g=>hskTargetGroup(g)===String(id)).flatMap(g=>g.lessons);
}
export function hskTargetReadings(id){
 return String(id)==='6'?STORIES.filter(s=>s.beginner?.source==='original-p71'):[];
}
export function hskTargetMissions(id){
 return PATHWAY_MISSIONS.filter(m=>String(id)==='6'?m.band===6:String(id)==='7-9'?m.band>=7:false);
}
// The references below are the author's original source families, not
// HSK examination membership. The stable native IDs and answer/history
// owners stay in grammar-course, STORIES and DIALOGUES.
const GRAMMAR_RANGES=Object.freeze({
 '1':[1,64],'2':[65,94],'3':[95,124],'4':[125,146],'5':[147,164]
});
const READING_SOURCES=Object.freeze({
 '1':['original-p34'],
 '2':['original-p38'],
 '3':['original-p41'],
 '4':['original-p46','original-p47','original-p48'],
 '5':['original-p50','original-p51'],
 '6':['original-p71']
});
const DIALOGUE_SOURCES=Object.freeze({
 '1':['p33','p34'],
 '2':['p37'],
 '3':['p42','p44','p45'],
 '4':['p46','p47','p48','p49'],
 '5':['p50','p51'],
 '6':['p75','p77']
});
export function hskTargetPractice(id){
 const k=String(id);
 if(!HSK_TARGETS.some(t=>t.id===k))return Object.freeze({grammar:[],readings:[],dialogues:[],missions:[]});
 const range=GRAMMAR_RANGES[k];
 const grammar=range?GRAMMAR_LESSONS.filter(g=>{const n=Number(g.id.slice(1));return /^g\d+$/.test(g.id)&&n>=range[0]&&n<=range[1];}):[];
 const sources=READING_SOURCES[k]||[];
 const readings=STORIES.filter(s=>sources.includes(s.beginner?.source));
 const traits=DIALOGUE_SOURCES[k]||[];
 const dialogues=DIALOGUES.filter(d=>traits.some(p=>Boolean(d[p])));
 return Object.freeze({grammar,readings,dialogues,missions:hskTargetMissions(k)});
}

/** Only keys from existing original indexed lessons. No official HSK mapping. */
export function hskTargetWords(id){
 const ids=new Set(hskTargetLessons(id).map(l=>l.id));
 return WORDS.filter(w=>w.lessonIds.some(x=>ids.has(x)));
}
function nextLevelActivity(state,lessons,practice){
 const learned=new Set(state.learned||[]);
 const first=lessons.find(l=>!learned.has(l.id));
 if(first)return {kind:'Course lesson',action:'c9-lesson-open',id:first.id,title:'Lesson '+first.order+' · '+first.meaning};
 const grammars=Array.isArray(state.sentenceEvents)?state.sentenceEvents:[];
 const grammar=practice.grammar.find(g=>!grammars.some(e=>e.taskId?.startsWith('grammar:'+g.id+':')&&e.correct&&!e.assisted));
 if(grammar)return {kind:'Grammar',action:'grammar-select',id:grammar.id,title:grammar.title};
 const readingEvents=Array.isArray(state.readingEvents)?state.readingEvents:[];
 const reading=practice.readings.find(s=>!readingEvents.some(e=>e.storyId===s.id&&e.correct&&!e.assisted));
 if(reading)return {kind:'Reading',action:'c9-media-open-story',id:reading.id,title:reading.title};
 const dialogueEvents=Array.isArray(state.dialogueEvents)?state.dialogueEvents:[];
 const dialogue=practice.dialogues.find(d=>!dialogueEvents.some(e=>e.dialogueId===d.id&&e.correct&&!e.assisted));
 if(dialogue)return {kind:'Listening',action:'c9-media-open-dialogue',id:dialogue.id,title:dialogue.title};
 if(practice.missions.length)return {kind:'Application',action:'pathway-select',id:practice.missions[0].id,title:practice.missions[0].title};
 if(lessons[0])return {kind:'Revisit lesson',action:'c9-lesson-open',id:lessons[0].id,title:lessons[0].meaning};
 return null;
}
function levelSourceGroup(title,records,action,act,esc,description=''){
 const anchor='c9-course-'+title.toLowerCase().replace(/[^a-z]+/g,'-');
 const row=x=>act(action,'<strong>'+esc(x.title)+'</strong>','c9-level-source','data-id="'+esc(x.id)+'"');
 return '<section class="c9-course-module" aria-labelledby="'+anchor+'"><h3 id="'+anchor+'">'+esc(title)+'</h3>'+
  (records.length?'<p>'+records.length+' original sources'+(description?' · '+esc(description):'')+'</p>'+
    '<div class="c9-level-source-list">'+records.slice(0,4).map(row).join('')+'</div>'+
    (records.length>4?'<details class="c9-course-expand"><summary>All '+records.length+' sources</summary>'+
     '<div class="c9-level-source-list">'+records.slice(4).map(row).join('')+'</div></details>':''):
    '<p>No dedicated original sources at this level.</p>')+'</section>';
}
export function renderC9HSKTargets(state,selectedId,act,esc,{pane='learn',now=Date.now()}={}){
 const selected=HSK_TARGETS.find(t=>t.id===String(selectedId));
 const learned=new Set(state.learned||[]);
 const choices=HSK_TARGETS.map(t=>{
  const lessons=hskTargetLessons(t.id),p=hskTargetPractice(t.id);
  const introduced=lessons.filter(l=>learned.has(l.id)).length;
  const coverage=lessons.length?introduced+' / '+lessons.length+' introduced':
    p.readings.length?p.readings.length+' readings · '+p.dialogues.length+' dialogues':
    p.missions.length+' original missions';
  return act('c9-hsk-select','<strong>'+esc(t.name)+'</strong><span>'+esc(t.focus)+'</span><small>'+coverage+'</small>',
   'c9-level-choice'+(selected?.id===t.id?' is-selected':''),
   'data-level="'+t.id+'" aria-pressed="'+(selected?.id===t.id)+'"');
 }).join('');
 const chooser='<section class="c9-level-entry" aria-labelledby="c9-level-title"><h2 id="c9-level-title">Choose your HSK target</h2>'+
  '<div class="c9-level-grid" role="group" aria-label="Choose study difficulty">'+choices+'</div>'+
  '<p class="c9-level-caveat">Open any level without prerequisites. Original difficulty collections are not verified official HSK 3.0 syllabi.</p></section>';
 if(!selected)return chooser;
 const lessons=hskTargetLessons(selected.id),practice=hskTargetPractice(selected.id),words=hskTargetWords(selected.id);
 const evidence=levelWorkspaceEvidence(state,{lessons,...practice},now);
 const next=nextLevelActivity(state,lessons,practice);
 const lessonRow=l=>act('c9-lesson-open','<span lang="zh-Hans">'+esc(l.hanzi)+'</span><strong>'+esc(l.meaning)+'</strong>'+
   '<small>Lesson '+l.order+' · '+esc(l.pinyin)+' · '+(learned.has(l.id)?'Introduced':'Not introduced')+'</small>',
   'c9-level-lesson','data-id="'+esc(l.id)+'"');
 const ordered=[...lessons.filter(l=>!learned.has(l.id)),...lessons.filter(l=>learned.has(l.id))];
 const wordRow=w=>act('vocabulary-start','<strong lang="zh-Hans">'+esc(w.hanzi)+'</strong>'+
  '<span>'+esc(w.pinyin)+'</span><span>'+esc(w.senses[0]||'Word study')+'</span>',
  'c9-course-word','data-id="'+esc(w.key)+'"');
 const mainAction=next?'<section class="c9-course-primary" aria-label="Next course activity"><div>'+
  '<span>'+esc(next.kind)+'</span><h2>'+esc(next.title)+'</h2></div>'+
  act(next.action,'Continue course →','c9-button c9-button--primary','data-id="'+esc(next.id)+'"')+'</section>':
  '<p>No authored activities are available.</p>';
 const sixReadings=selected.id==='6'?'<div class="c9-level-lesson-list">'+practice.readings.map(s=>
  act('c9-media-open-story','<strong>'+esc(s.title)+'</strong><small>Original reading</small>','c9-level-source',
   'data-id="'+esc(s.id)+'"')).join('')+'</div>':'';
 const lessonsPanel='<section class="c9-course-module" aria-labelledby="c9-course-lessons"><h3 id="c9-course-lessons">1. Course lessons</h3>'+
  (lessons.length?'<p>'+evidence.introduced+' / '+lessons.length+' introduced · characters, words, sentences and guided checks</p>'+
    '<div class="c9-level-lesson-list">'+ordered.slice(0,8).map(lessonRow).join('')+'</div>'+
    (lessons.length>8?act('c9-hsk-browse','Browse all '+lessons.length+' lessons',
      'c9-button c9-button--secondary','data-level="'+selected.id+'"'):'')+
    '<details class="c9-course-expand"><summary>Browse lesson units</summary>'+renderLevelUnits(evidence,act,esc)+'</details>':
    '<p>No dedicated original character lessons at this level.</p>'+sixReadings)+'</section>';
 const vocabPanel='<section class="c9-course-module" aria-labelledby="c9-course-words"><h3 id="c9-course-words">2. Vocabulary</h3>'+
  (words.length?'<p>'+words.length+' indexed original words from these lessons; not an official HSK wordlist.</p>'+
    '<div class="c9-course-words">'+words.slice(0,12).map(wordRow).join('')+'</div>'+
    (words.length>12?'<details class="c9-course-expand"><summary>Study all '+words.length+' indexed words</summary>'+
     '<div class="c9-course-words">'+words.slice(12).map(wordRow).join('')+'</div></details>':''):
    '<p>No dedicated original vocabulary lessons at this level.</p>')+'</section>';
 const grammar=levelSourceGroup('3. Grammar and sentences',practice.grammar,'grammar-select',act,esc,'practice included');
 const readings=levelSourceGroup('4. Reading',selected.id==='6'?[]:practice.readings,
  'c9-media-open-story',act,esc,'comprehension practice');
 const listening=levelSourceGroup('5. Listening and conversation',practice.dialogues,
  'c9-media-open-dialogue',act,esc,'device-voice playback');
 const missions=practice.missions.length?
  levelSourceGroup('6. Advanced application',practice.missions,'pathway-select',act,esc,'source-based missions'):'';
 const review='<section class="c9-course-review"><strong>'+evidence.due+' scheduled cards due</strong>'+
  (evidence.due?act('c9-level-review-start','Review due cards','c9-button c9-button--secondary'):
   '<a href="#/review" class="c9-button c9-button--secondary">Open Review</a>')+'</section>';
 return '<div class="c9-course-level">'+act('c9-hsk-back','← All levels','c9-button c9-button--quiet')+
  '<header class="c9-course-header"><h1>'+esc(selected.name)+' course</h1>'+
  '<p>'+esc(selected.focus)+' · original difficulty target, not a verified HSK syllabus.</p></header>'+
  mainAction+review+lessonsPanel+vocabPanel+grammar+readings+listening+missions+
  '<details class="c9-course-expand c9-course-switcher"><summary>Change level</summary>'+chooser+'</details></div>';
}
