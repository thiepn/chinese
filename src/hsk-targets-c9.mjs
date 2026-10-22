/** Read-only HSK-target navigation. Targets are NOT verified exam memberships. */
import {lessonGroups} from './study-groups.mjs';
import {STORIES} from './stories.mjs';
import {PATHWAY_MISSIONS} from './pathway-course.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
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
function studySources(state,id,act,esc){
 const items=hskTargetPractice(id);
 const categories=[
  ['Grammar',items.grammar,'grammar-select','grammar',g=>g.title],
  ['Reading',String(id)==='6'?[]:items.readings,'c9-media-open-story','stories',s=>s.title],
  ['Listening & dialogue',items.dialogues,'c9-media-open-dialogue','dialogues',d=>d.title]
 ];
 const groups=categories.filter(([,records])=>records.length).map(([label,records,action,route,name])=>
  '<section class="c9-level-source-group"><header><h3>'+label+'</h3><a href="#/'+route+'">All '+route+'</a></header>'+
  '<div class="c9-level-source-list">'+records.slice(0,3).map(item=>
   act(action,'<strong>'+esc(name(item))+'</strong><small>Original source</small>',
     'c9-level-source','data-id="'+esc(item.id)+'"')).join('')+'</div>'+
  '<span class="c9-level-source-count">'+records.length+' original sources</span></section>');
 return groups.length?'<section class="c9-level-skills" aria-label="Original grammar reading and listening for selected study target">'+
  '<h3>Practice by skill</h3><div class="c9-level-skills-grid">'+groups.join('')+'</div>'+
  '<p>Source selection is provisional. These activities reuse the original review, reading and dialogue assessments; they do not award an HSK level.</p></section>':'';
}
export function renderC9HSKTargets(state,selectedId,act,esc,{pane='learn',now=Date.now()}={}){
 const selected=HSK_TARGETS.find(t=>t.id===String(selectedId));
 const introduced=new Set(state.learned||[]);
 const choices=HSK_TARGETS.map(t=>{
  const lessons=hskTargetLessons(t.id),count=lessons.filter(l=>introduced.has(l.id)).length;
  return act('c9-hsk-select','<strong>'+esc(t.name)+'</strong><span>'+esc(t.focus)+'</span>'+
   '<small>'+(lessons.length?count+' / '+lessons.length+' introduced':t.id==='6'?'Five original source readings':'Advanced original missions')+'</small>',
   'c9-level-choice'+(selected?.id===t.id?' is-selected':''),
   'data-level="'+t.id+'" aria-pressed="'+(selected?.id===t.id)+'"');
 }).join('');
 const chooser='<section class="c9-level-entry" aria-labelledby="c9-level-title">'+
  '<h2 id="c9-level-title">Choose your HSK target</h2>'+
  '<div class="c9-level-grid" role="group" aria-label="Select HSK target difficulty">'+choices+'</div>'+
  '<p class="c9-level-caveat">Choose any level, without prerequisites. Original study stages are provisional, not a verified HSK 3.0 syllabus.</p></section>';
 if(!selected)return chooser;
 const lessons=hskTargetLessons(selected.id),readings=hskTargetReadings(selected.id),missions=hskTargetMissions(selected.id);
 const practice=hskTargetPractice(selected.id);
 const evidence=levelWorkspaceEvidence(state,{lessons,...practice},now);
 const selectedPane=['learn','practice','review'].includes(pane)?pane:'learn';
 const tabs='<nav class="c9-level-tabs" aria-label="'+esc(selected.name)+' learning activities">'+
  [['learn','Learn'],['practice','Practice'],['review','Review']].map(([value,label])=>
   act('c9-level-pane',label,'c9-level-tab'+(selectedPane===value?' is-selected':''),
     'data-pane="'+value+'" aria-pressed="'+(selectedPane===value)+'"')).join('')+'</nav>';

 const sorted=[...lessons.filter(l=>!introduced.has(l.id)),...lessons.filter(l=>introduced.has(l.id))];
 const entries=sorted.slice(0,8).map(l=>act('c9-lesson-open',
   '<span lang="zh-Hans">'+esc(l.hanzi)+'</span><strong>'+esc(l.pinyin)+' · '+esc(l.meaning)+'</strong>'+
   '<small>'+(introduced.has(l.id)?'Introduced':'Not introduced')+'</small>',
   'c9-level-lesson','data-id="'+esc(l.id)+'"'));
 if(sorted.length>8)entries.push(act('c9-hsk-browse','Browse all '+sorted.length+' lessons','c9-button c9-button--secondary','data-level="'+selected.id+'"'));
 const advanced=readings.map(s=>act('c9-media-open-story',
   '<strong>'+esc(s.title)+'</strong><small>Original source reading</small>',
   'c9-level-source','data-id="'+esc(s.id)+'"'));
 const missionEntries=missions.map(m=>act('pathway-select',
   '<strong>'+esc(m.title)+'</strong><small>Original band '+m.band+' mission</small>',
   'c9-level-source','data-id="'+esc(m.id)+'"'));
 const sourceEntries=entries.concat(advanced,missionEntries);
 const learn='<div class="c9-level-lesson-list">'+sourceEntries.join('')+'</div>'+
  renderLevelUnits(evidence,act,esc)+studySources(state,selected.id,act,esc);
 const practiceBody=studySources(state,selected.id,act,esc)+
  '<div class="c9-level-practice-stats"><strong>Recorded original attempts</strong><span>'+
   evidence.grammarAttempts+' grammar · '+evidence.readingAttempts+' reading · '+
   evidence.dialogueAttempts+' dialogue · '+evidence.missionAttempts+' mission</span></div>'+
  (missions.length?'<div class="c9-level-lesson-list">'+missionEntries.join('')+'</div>':'');
 return chooser+'<section class="c9-level-selected" aria-labelledby="c9-level-selected-title">'+
  '<h2 id="c9-level-selected-title">'+esc(selected.name)+' practice</h2>'+
  '<p>'+esc(selected.focus)+' · original authored study stage · official HSK mapping not verified</p>'+
  renderLevelEvidencePanel(evidence,act,esc)+tabs+
  (selectedPane==='review'?renderLevelReview(evidence,act,esc):
   selectedPane==='practice'?practiceBody:learn)+
  '</section>';
}
