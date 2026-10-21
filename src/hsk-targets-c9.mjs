/** Read-only HSK-target navigation. Targets are NOT verified exam memberships. */
import {lessonGroups} from './study-groups.mjs';
import {STORIES} from './stories.mjs';
import {PATHWAY_MISSIONS} from './pathway-course.mjs';

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
export function renderC9HSKTargets(state,selectedId,act,esc){
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
 return chooser+'<section class="c9-level-selected" aria-labelledby="c9-level-selected-title">'+
  '<h2 id="c9-level-selected-title">'+esc(selected.name)+' practice</h2>'+
  '<p>'+esc(selected.focus)+' · provisional level selection</p>'+
  '<div class="c9-level-lesson-list">'+entries.concat(advanced,missionEntries).join('')+'</div>'+
  '<div class="c9-level-actions"><a class="c9-button c9-button--secondary" href="#/review">My review</a>'+
  '<a class="c9-button c9-button--secondary" href="#/skills">Study by skill</a></div></section>';
}
