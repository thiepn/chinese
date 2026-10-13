/**
 * C9-04 Clean Modular Scholar — source-backed course discovery.
 * Pure render/projection layer over the existing curriculum, pathway and learner state.
 * No new route, store, progress engine, assessment or official HSK claims.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {lessonGroups} from './study-groups.mjs';
import {plain} from './lexicon.mjs';
import {WORKSPACE_DESTINATIONS,courseSearch,FIND_CATEGORIES} from './workspace-p30.mjs';
import {courseOverview} from './course-overview.mjs';
import {learningHub} from './learning-hub.mjs';
import {PATHWAY_BANDS,PATHWAY_MISSIONS,PATHWAY_MODES,pathwayStats,pathwayResume,pathwayTaskId} from './pathway-course.mjs';

const SKILL_ICONS=Object.freeze({
 learn:'字',explore:'词',grammar:'文',sentences:'句',stories:'读',
 dialogues:'说',pinyin:'音',pathway:'路'
});
const n=s=>plain(String(s??'')).toLowerCase();
const tiny=(text)=>String(text??'');
const pct=(done,total)=>total?Math.max(0,Math.min(100,Math.round(done/total*100))):0;
const summaryText=(count,noun)=>count+' '+noun+(count===1?'':'s');
const title=(name,subtitle)=>'<header class="c9-discovery-head"><p class="c9-eyebrow">THIEPN CHINESE · ORIGINAL STUDY MATERIAL</p><h1>'+name+'</h1><p>'+subtitle+'</p></header>';
const progress=(done,total,label)=>'<div class="c9-discovery-progress"><div class="c9-discovery-progress-meta"><span>'+label+'</span><strong class="c9-tabular">'+done+' / '+total+'</strong></div><div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+pct(done,total)+'%"></span></div></div>';
const empty=(heading,description)=>'<div class="c9-empty c9-discovery-empty"><strong>'+heading+'</strong><p>'+description+'</p></div>';
const lessonCount=(group,learned)=>group.lessons.filter(l=>learned.has(l.id)).length;
const nextLesson=(group,learned)=>group.lessons.find(l=>!learned.has(l.id))||group.lessons[0];
const isKnownKind=kind=>FIND_CATEGORIES.some(([id])=>id===kind);
function lessonMatch(l,query,unitName){
 if(!query)return true;
 return n([l.hanzi,l.pinyin,l.meaning,l.note,l.order,unitName].join(' ')).includes(n(query));
}
function sourceHitText(entry,esc){
 const chinese=['characters','words','sentences'].includes(entry.kind);
 return '<span class="c9-discovery-result-title"'+(chinese?' lang="zh-Hans"':'')+'>'+esc(entry.title)+'</span>';
}
function lessonActions(lesson,learned,act,esc){
 return act('c9-lesson-open',learned?'Revisit':'Study lesson','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"');
}
function unitMatches(unit,search,selected,learned,status){
 if(selected!=='all'&&String(unit.index)!==String(selected))return false;
 return unit.lessons.some(l=>lessonMatch(l,search,unit.name)
   &&(status==='all'||(status==='introduced'?learned.has(l.id):!learned.has(l.id))));
}
export function renderC9LessonBrowser(state,ui,act,esc){
 const learned=new Set(state.learned||[]);
 const groups=lessonGroups();
 const filter=groups.filter(g=>unitMatches(g,ui.query,ui.unit,learned,ui.status));
 const lessons=filter.flatMap(g=>g.lessons.filter(l=>lessonMatch(l,ui.query,g.name)
   &&(ui.status==='all'||(ui.status==='introduced'?learned.has(l.id):!learned.has(l.id)))
   .map(l=>({lesson:l,unit:g})));
 const pageSize=12;
 const pages=Math.max(1,Math.ceil(lessons.length/pageSize));
 const page=Math.min(pages-1,Math.max(0,Number(ui.page)||0));
 const selected=lessons.slice(page*pageSize,(page+1)*pageSize);
 return '<div class="c9-discovery-browser-heading"><div><strong>'+summaryText(lessons.length,'matching lesson')+'</strong><span>'+filter.length+' / '+groups.length+' authored units</span></div><span>Showing '+(selected.length?page*pageSize+1:0)+'–'+(page*pageSize+selected.length)+'</span></div>'+
 (lessons.length?'<div class="c9-lesson-results">'+selected.map(({lesson:l,unit:g})=>{
  const introduced=learned.has(l.id);
  return '<article class="c9-lesson-row"><span class="c9-lesson-index c9-tabular">'+String(l.order).padStart(3,'0')+'</span><div class="c9-lesson-character" lang="zh-Hans">'+esc(l.hanzi)+'</div><div class="c9-lesson-copy"><strong>'+esc(l.pinyin)+' <span aria-hidden="true">·</span> '+esc(l.meaning)+'</strong><span>'+esc(g.name)+' · Original lesson</span></div><span class="c9-badge '+(introduced?'c9-badge--success':'')+'">'+(introduced?'Introduced':'Not introduced')+'</span>'+lessonActions(l,introduced,act,esc)+'</article>';
 }).join('')+'</div>':empty('No matching lessons','Try a different Chinese character, tone-marked Pinyin, meaning or unit. Adjust the introduction filter if needed.'))+
 '<div class="c9-discovery-pagination"><span>Page '+(page+1)+' of '+pages+'</span><div class="c9-inline">'+
 act('c9-lesson-page','Previous','c9-button c9-button--secondary c9-button--small','data-dir="-1" '+(page?'':'disabled'))+
 act('c9-lesson-page','Next','c9-button c9-button--secondary c9-button--small','data-dir="1" '+(page<pages-1?'':'disabled'))+'</div></div>';
}
export function renderC9SearchResults(state,ui,act,esc){
 const kind=isKnownKind(ui.kind)?ui.kind:'all';
 const items=courseSearch({query:ui.query,kind,saved:Boolean(ui.saved),state});
 const preview=items.slice(0,8);
 return '<div class="c9-discovery-browser-heading"><div><strong>'+summaryText(items.length,'matching source entry')+'</strong><span>Across original course materials</span></div><a href="#/find">Full search →</a></div>'+
 (items.length?'<div class="c9-discovery-results">'+preview.map(row=>{
  return act('c9-discovery-open','<span class="c9-discovery-result-type">'+esc(row.kind)+'</span>'+sourceHitText(row,esc)+
   '<small>'+esc(row.description)+'</small><span class="c9-discovery-result-arrow" aria-hidden="true">↗</span>',
   'c9-discovery-result','data-kind="'+esc(row.kind)+'" data-id="'+esc(row.id)+'"');
 }).join('')+'</div>':empty('No source entries found','Try a broader word, Pinyin spelling or another content category.'))+
 (items.length>8?'<p class="c9-discovery-more">Showing the first eight relevant entries. <a href="#/find">Use complete course search for all results</a>.</p>':'');
}
function skillCards(esc){
 return '<div class="c9-skill-grid">'+WORKSPACE_DESTINATIONS.map(([route,label,desc,count])=>
  '<a class="c9-skill-card" href="#/'+route+'"><span class="c9-skill-symbol" aria-hidden="true">'+(SKILL_ICONS[route]||'学')+
  '</span><span class="c9-skill-content"><strong>'+esc(label)+'</strong><span>'+esc(desc)+'</span><small>'+(count===null?'Native study guide':summaryText(count,'original entry'))+'</small></span><span aria-hidden="true">↗</span></a>').join('')+'</div>';
}
function unitCards(state,act,esc){
 const groups=lessonGroups(),learned=new Set(state.learned||[]);
 return '<div class="c9-unit-grid">'+groups.map(g=>{
  const introduced=lessonCount(g,learned),next=nextLesson(g,learned);
  return '<article class="c9-unit-card"><div class="c9-unit-header"><span class="c9-unit-index">UNIT '+String(g.index).padStart(2,'0')+'</span><span>'+introduced+' / '+g.lessons.length+' introduced</span></div>'+
   '<h3>'+esc(g.name)+'</h3>'+progress(introduced,g.lessons.length,'Introduced lessons')+
   '<div class="c9-unit-footer"><span>Next: <strong lang="zh-Hans">'+esc(next.hanzi)+'</strong> <small>'+esc(next.pinyin)+'</small></span>'+
   act('c9-unit-open','Explore unit','c9-button c9-button--secondary c9-button--small','data-unit="'+g.index+'"')+'</div></article>';
 }).join('')+'</div>';
}
export function renderC9LearnHub(state,ui,act,esc){
 const o=courseOverview(state),hub=learningHub(state);
 const unit=lessonGroups().find(x=>String(x.index)===String(ui.unit));
 const status=ui.status||'all',kind=isKnownKind(ui.kind)?ui.kind:'all';
 const intro=title('Your learning library','A clear path through original Chinese characters, vocabulary, grammar, reading and practical communication.');
 if(ui.view==='lesson'){
  const chosen=DEMO_LESSONS.find(l=>l.id===ui.selectedId)||DEMO_LESSONS[0];
  return '<section class="c9-lesson-heading">'+
   act('c9-learn-back','← All lessons','c9-button c9-button--quiet c9-button--small')+
   '<div><span class="c9-eyebrow">UNIT '+String(lessonGroups().find(g=>g.lessons.some(l=>l.id===chosen.id))?.index||1).padStart(2,'0')+' · ORIGINAL DEMO LESSON</span>'+
   '<h1><span lang="zh-Hans">'+esc(chosen.hanzi)+'</span> '+esc(chosen.meaning)+'</h1>'+
   '<p>'+esc(chosen.pinyin)+' · Learn through examples and native practice. Introduction is recorded only by the existing lesson workflow.</p></div></section>';
 }
 return '<div class="c9-discovery">'+intro+
  '<section class="c9-discovery-lead"><div><span class="c9-eyebrow">CONTINUE YOUR COURSE</span><h2>'+esc(hub.primary.label)+'</h2><p>'+esc(hub.primary.detail)+'</p>'+
  '<div class="c9-inline">'+act('hub-primary','Continue learning →','c9-button c9-button--primary')+
  '<a class="c9-button c9-button--secondary" href="#/pathway">Explore nine-band pathway</a></div></div>'+
  '<div class="c9-discovery-lead-stats">'+progress(o.introduced,o.total,'Demo lessons introduced')+
  '<p><strong>'+o.due+'</strong> scheduled recall prompts due</p><p>'+o.sessions.length+' recoverable sessions</p>'+
  '<small>Study progress is source evidence, not official HSK certification.</small></div></section>'+
  '<section class="c9-discovery-section" aria-labelledby="c9-skills-title"><div class="c9-discovery-section-head"><div><p class="c9-eyebrow">LEARNING AREAS</p><h2 id="c9-skills-title">Choose what to study</h2></div><a href="#/find">Search all content →</a></div>'+skillCards(esc)+'</section>'+
  '<section class="c9-discovery-section" aria-labelledby="c9-units-title"><div class="c9-discovery-section-head"><div><p class="c9-eyebrow">ORIGINAL LESSON UNITS</p><h2 id="c9-units-title">Build your foundations</h2></div><span class="c9-meta">'+lessonGroups().length+' units · '+DEMO_LESSONS.length+' original character lessons</span></div>'+
  '<p class="c9-discovery-note">All units are browseable. Introduction counts reflect actual saved learner history; units do not represent official HSK assignment or a locked syllabus.</p>'+
  unitCards(state,act,esc)+'</section>'+
  '<section class="c9-discovery-section c9-discovery-finder" aria-labelledby="c9-browse-title"><div class="c9-discovery-section-head"><div><p class="c9-eyebrow">LESSON DISCOVERY</p><h2 id="c9-browse-title">Find a character lesson</h2></div></div>'+
  '<label class="c9-discovery-search-label" for="c9-learn-query">Search characters, Pinyin, meanings and source material</label>'+
  '<input id="c9-learn-query" class="c9-input" type="search" autocomplete="off" spellcheck="false" placeholder="Try 学, xué, family, food…" value="'+esc(ui.query)+'">'+
  '<div class="c9-discovery-filters"><label for="c9-learn-unit">Lesson unit<select id="c9-learn-unit" class="c9-select"><option value="all">All units</option>'+lessonGroups().map(g=>
   '<option value="'+g.index+'"'+(String(ui.unit)===String(g.index)?' selected':'')+'>'+String(g.index).padStart(2,'0')+' · '+esc(g.name)+'</option>').join('')+'</select></label>'+
   '<label for="c9-learn-status">Learning evidence<select id="c9-learn-status" class="c9-select">'+[['all','All lessons'],['new','Not introduced'],['introduced','Introduced']].map(([v,label])=>
    '<option value="'+v+'"'+(status===v?' selected':'')+'>'+label+'</option>').join('')+'</select></label></div>'+
  '<div id="c9-lesson-browser" aria-live="polite">'+renderC9LessonBrowser(state,ui,act,esc)+'</div></section>'+
  '<section class="c9-discovery-section c9-discovery-finder" aria-labelledby="c9-content-title"><div class="c9-discovery-section-head"><div><p class="c9-eyebrow">CONNECTED CONTENT</p><h2 id="c9-content-title">Discover words and explanations</h2></div></div>'+
  '<div class="c9-discovery-category-list" role="group" aria-label="Filter original course content">'+FIND_CATEGORIES.map(([id,label])=>
   act('c9-content-kind',esc(label),'c9-discovery-chip'+(kind===id?' is-selected':''),'data-kind="'+id+'" aria-pressed="'+(kind===id)+'"')).join('')+'</div>'+
  '<label class="c9-discovery-saved"><input type="checkbox" id="c9-learn-saved"'+(ui.saved?' checked':'')+'> Saved or introduced entries (where supported)</label>'+
  '<div id="c9-learn-search-results" aria-live="polite">'+renderC9SearchResults(state,ui,act,esc)+'</div></section>'+
  '<p class="c9-discovery-disclaimer">Original independently authored demonstration materials; not an installed or verified official HSK 3.0 corpus. Following or opening content does not confer mastery.</p></div>';
}
function pathwayMissionStatus(m,events){
 const all=new Set(events.filter(e=>e.taskId.startsWith('pathway:'+m.id+':')).map(e=>e.taskId));
 const good=new Set(events.filter(e=>e.taskId.startsWith('pathway:'+m.id+':')&&e.correct&&!e.assisted).map(e=>e.taskId));
 return {attempted:all.size,independent:good.size};
}
export function renderC9PathwayHub(state,act,esc){
 const m=pathwayResume(state);
 const events=state.sentenceEvents||[];
 const intro=title('Nine-band study pathway','Original connected Mandarin missions, arranged from first interactions to advanced exploration. All bands remain accessible.');
 return '<div class="c9-discovery c9-pathway-hub">'+intro+
  '<section class="c9-discovery-lead"><div><p class="c9-eyebrow">PICK UP YOUR ORIGINAL PATHWAY</p><h2>Band '+m.band+' · '+esc(m.title)+'</h2><p>'+esc(m.purpose)+'</p>'+
  '<div class="c9-inline">'+act('pathway-select','Continue last attempted mission →','c9-button c9-button--primary','data-id="'+esc(m.id)+'"')+
  '<a class="c9-button c9-button--secondary" href="#/learn">Browse character lessons</a></div></div>'+
  '<div class="c9-discovery-lead-stats"><strong>'+PATHWAY_MISSIONS.length+'</strong><span>Original missions across nine authored bands</span><p>No locked levels or official HSK certificate claims.</p></div></section>'+
  '<section class="c9-discovery-section" aria-labelledby="c9-pathway-bands-title"><div class="c9-discovery-section-head"><div><p class="c9-eyebrow">COURSE STRUCTURE</p><h2 id="c9-pathway-bands-title">Explore every band</h2></div></div>'+
  '<div class="c9-band-grid">'+PATHWAY_BANDS.map(b=>{
    const stats=pathwayStats(state,b.number);
    const missions=PATHWAY_MISSIONS.filter(x=>x.band===b.number);
    return '<article class="c9-band-card"><div class="c9-band-header"><span class="c9-band-number">'+String(b.number).padStart(2,'0')+'</span>'+
     '<span class="c9-badge">'+esc(b.status)+'</span></div><h3>'+esc(b.title)+'</h3><p>'+esc(b.purpose)+'</p>'+
     progress(stats.independent,missions.length*PATHWAY_MODES.length,'Distinct independently correct task types')+
     '<small>'+stats.begun+' / '+missions.length+' missions attempted · '+stats.attempts+' recorded attempts</small>'+
     '<div class="c9-band-missions">'+missions.map(x=>{
       const rec=pathwayMissionStatus(x,events);
       return act('pathway-select','<span><strong>'+esc(x.title)+'</strong><small>'+rec.independent+' / '+PATHWAY_MODES.length+' independently correct skills'+
        (rec.attempted?' · attempted':' · not yet attempted')+'</small></span><span aria-hidden="true">↗</span>',
         'c9-band-mission','data-id="'+esc(x.id)+'"');
     }).join('')+'</div></article>';
  }).join('')+'</div></section>'+
  '<p class="c9-discovery-disclaimer">These are nine original study bands, not verified official HSK 3.0 levels. An independent correct task is evidence of that answer, not complete mission mastery or syllabus coverage.</p></div>';
}
