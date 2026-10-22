/**
 * C9-03: read-only Home dashboard projection over existing learning authorities.
 * No state writes, grades, HSK certification claims, or second scheduling engine.
 */
import {courseOverview,courseShortcuts} from './course-overview.mjs';
import {learningHub} from './learning-hub.mjs';
import {lessonGroups} from './study-groups.mjs';
import {hskTargetLessons,hskTargetPractice,HSK_TARGETS} from './hsk-targets-c9.mjs';
import {renderC9ListeningDeck} from './ui-c9.mjs';

const ICONS=Object.freeze({
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  book:'<path d="M12 7v14M12 7C9 5 6 5 3 6v14c3-1 6-1 9 1M12 7c3-2 6-2 9-1v14c-3-1-6-1-9 1"/>',
  repeat:'<path d="M3 12a9 9 0 1 1 3 6.7M3 17v4h4M12 7v5l3 2"/>',
  character:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 5v14M5 12h14"/>',
  browse:'<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4z"/>',
  check:'<path d="m4 12 5 5 11-11"/>',
  activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  time:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
});
function icon(name){
 return '<svg class="c9-home-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||ICONS.arrow)+'</svg>';
}
function routeLink(route,label,iconName,extra=''){
 return '<a class="c9-home-route '+extra+'" href="#/'+route+'">'+icon(iconName)+'<span>'+label+'</span>'+icon('chevron')+'</a>';
}
function metric(value,label,detail){
 return '<div class="c9-home-stat"><strong class="c9-tabular">'+value+'</strong><span>'+label+'</span><small>'+detail+'</small></div>';
}
function progress(value,max,label){
 const count=Number.isFinite(value)?Math.max(0,value):0;
 const total=Number.isFinite(max)?Math.max(0,max):0;
 const pct=total?Math.min(100,Math.round(count/total*100)):0;
 return '<div class="c9-home-progress" role="group" aria-label="'+label+'"><div class="c9-home-progress-head"><span>'+label+'</span><strong class="c9-tabular">'+count+' / '+total+'</strong></div><div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+Math.min(count,total)+'"><span style="width:'+pct+'%"></span></div></div>';
}
function taskRow(task,act,esc){
 const recorded=task.done===true;
 return '<li class="c9-home-task '+(recorded?'is-recorded':'')+'"><span class="c9-home-task-mark" aria-hidden="true">'+(recorded?icon('check'):icon('time'))+'</span><div class="c9-home-task-content"><strong>'+esc(task.label)+'</strong><span>'+esc(task.reason)+'</span><small>'+esc(String(task.minutes))+' min suggested · '+(recorded?'Activity recorded today':'No activity recorded today')+'</small></div>'+act('hub-task',recorded?'Repeat':'Open','c9-button c9-button--secondary c9-button--small','data-kind="'+esc(task.kind)+'" aria-label="'+(recorded?'Repeat ':'Open ')+esc(task.label)+'"')+'</li>';
}
/**
 * The renderer is deliberately pure. Online and storage flags are display-only:
 * the existing mutate()/IndexedDB pathway is still sole authority for writes.
 */
export function renderC9Home(state,act,esc,{storageReady=true,offline=false,offlineShell='checking',showPinyin=true,selectedLevel='all'}={}){
 const overview=courseOverview(state),hub=learningHub(state);
 const plan=hub.plan,primary=hub.primary;
 const hasActivity=overview.introduced>0||overview.scheduled.attempts>0||overview.supplementary>0||hub.sessions.length>0;
 const shortcuts=courseShortcuts(state);
 const lesson=overview.nextLesson;
 const lessonIsPrimary=Boolean(lesson&&primary.kind==='journey');
 const last=overview.lastLesson;

 const storageNotice=!storageReady?'<div class="c9-home-notice c9-home-notice--warning" role="status"><strong>Local saving is unavailable</strong><span>You can browse the available material, but progress cannot be saved until browser storage works. Existing learning records have not been changed.</span></div>':'';
 const offlineNotice='<div id="c9-home-offline-notice" class="c9-home-notice" role="status"'+(offline?'':' hidden')+'><strong>Offline</strong><span>'+
 (offlineShell==='ready'?'The compiled original lessons and runtime assets are available offline according to the controlling service worker. Progress still depends on local browser storage.':
 offlineShell==='incomplete'?'Some original offline assets are missing from the current cache. Reconnect before starting an offline lesson.':
 offlineShell==='outdated'?'The active offline worker is from an older source manifest. Reconnect and reload online to finish updating before offline study.':
 'The offline source cache is not confirmed complete on this device. Reconnect to prepare it.')+
 '</span></div>';
 const offlineRecovery='<div id="c9-home-offline-repair" class="c9-home-notice c9-home-offline-repair" role="note"'+
  (!offline&&['incomplete','checking'].includes(offlineShell)?'':' hidden')+'>'+
  '<strong>Offline content recovery</strong>'+
  '<span>Check and repair missing original cached sources without changing your local learning records.</span>'+
  '<span data-c9-offline-count>Cache coverage has not yet been verified by this service worker.</span>'+
  act('c9-offline-repair','Prepare missing offline assets','c9-button c9-button--secondary c9-button--small')+
  '</div>';
 const offlineUpgrade='<div id="c9-home-offline-upgrade" class="c9-home-notice" role="status"'+
  (!offline&&offlineShell==='outdated'?'':' hidden')+'>'+
  '<strong>Update offline lessons</strong><span>An older cached version currently controls this tab. Before reloading, copy or export any unsaved private P43 writing. Reload online to let the current service worker prepare its original lessons. Your local review history is not reset.</span></div>';
 const scenery='<svg class="c9-home-mountains" viewBox="0 0 430 175" aria-hidden="true" focusable="false"><path d="M0 151Q51 120 77 126Q120 57 158 106Q189 126 218 73Q262 28 317 108Q358 71 430 130V175H0Z" fill="currentColor" opacity=".08"/><path d="M0 151Q51 120 77 126Q120 57 158 106Q189 126 218 73Q262 28 317 108Q358 71 430 130" fill="none" stroke="currentColor" opacity=".17"/><path d="M181 133h91m-76 0 17-18h38l17 18m-60-19 5-10h37l7 10m-12 19v-16m-22 16v-16m-21-15h69" fill="none" stroke="currentColor" opacity=".19"/><path d="M20 157h150m132 0h128" stroke="currentColor" opacity=".13"/></svg>';
 const nextSource=lesson?.sentence?.hanzi&&lesson?.sentence?.english?
  '<div class="c9-home-source-preview" aria-label="Next original lesson sentence"><span>'+(lessonIsPrimary?'AUTHORED EXAMPLE · NEXT LESSON':'OPTIONAL · NEXT CHARACTER LESSON')+'</span><strong lang="zh-Hans">'+esc(lesson.sentence.hanzi)+'</strong>'+(showPinyin?'<small>'+esc(lesson.sentence.pinyin)+'</small>':'')+'<p>'+esc(lesson.sentence.english)+'</p>'+
  '<details class="c9-home-listening"><summary>Listen and shadow this sentence ↘</summary>'+
  renderC9ListeningDeck([{label:'Next source sentence',hanzi:lesson.sentence.hanzi}],act,esc,{title:'Hear the next sentence',compact:true})+
  '</details><div class="c9-home-source-actions" role="group" aria-label="Continue this exact original Chinese example">'+act('hub-lesson','Open complete lesson →','c9-button '+(lessonIsPrimary?'c9-button--primary':'c9-button--secondary')+' c9-button--small','data-id="'+esc(lesson.id)+'"')+act('c9-character-open','Explore this character','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</div></div>':'';
 const courseCaption=lesson?(lessonIsPrimary?'LESSON ':'OPTIONAL NEXT LESSON · ')+String(lesson.order).padStart(3,'0')+' OF '+overview.total:'ORIGINAL CHARACTER COURSE';
 const heroKicker=lessonIsPrimary?'START HERE · CHARACTER COURSE':
  primary.kind==='resume'?'CONTINUE SAVED WORK':
  primary.kind==='review'?'DUE NOW · SCHEDULED RECALL':
  primary.kind==='remediation'?'NEXT STEP · REPAIR OBSERVED MISTAKES':'NEXT STEP · ORIGINAL PRACTICE';
 const heroAction=primary.kind==='resume'?'Resume saved activity':
  primary.kind==='review'?'Begin due review':
  primary.kind==='remediation'?'Open mistake corrections':'Continue studying';
 const hero='<section class="c9-home-hero" aria-labelledby="c9-home-next"><div class="c9-home-hero-copy"><span class="c9-home-kicker">'+heroKicker+'</span>'+
  '<h2 id="c9-home-next">'+(lessonIsPrimary?'Lesson '+String(lesson.order).padStart(3,'0')+' · <span lang="zh-Hans">'+esc(lesson.hanzi)+'</span> · '+esc(lesson.meaning):esc(primary.label))+'</h2>'+
  '<p>'+(lessonIsPrimary?'Study the character first, then its pronunciation, vocabulary, sentences and guided practice.':esc(primary.detail))+'</p>'+
  '<div class="c9-home-hero-actions">'+
  (lessonIsPrimary?act('hub-lesson',(hasActivity?'Continue lesson ':'Start lesson ')+String(lesson.order).padStart(3,'0')+' '+icon('arrow'),'c9-button c9-button--primary','data-id="'+esc(lesson.id)+'"'):
   act('hub-primary',heroAction+' '+icon('arrow'),'c9-button c9-button--primary'))+
  (lesson&&!lessonIsPrimary?act('hub-lesson','Lesson '+String(lesson.order).padStart(3,'0')+' (optional)','c9-button c9-button--secondary','data-id="'+esc(lesson.id)+'"'):'')+
  (overview.due&&primary.kind!=='review'?'<a class="c9-button c9-button--secondary" href="#/review">Review · '+overview.due+' due</a>':'')+
  '</div>'+nextSource+'</div><div class="c9-home-art">'+scenery+'<span class="c9-home-hero-seal" lang="zh-Hans">'+(lesson?esc(lesson.hanzi):'学')+'</span><span class="c9-home-art-caption">'+courseCaption+'</span></div></section>';
 const greeting='<header class="c9-home-heading"><div><p class="c9-home-kicker">THIEPN CHINESE · TODAY</p><h1>'+(hasActivity?'Continue learning, one step at a time.':'A quiet place to begin Chinese.')+'</h1><p>Original characters, complete words and source sentences. Your next action is ready below.</p></div><span class="c9-home-date" aria-label="Local learning status">'+overview.introduced+' introduced · '+overview.due+' due</span></header>';
 const metrics='<section class="c9-home-metrics" aria-label="Your actual learning records">'+
  metric(overview.due,'Due for review','Scheduled recall prompts')+
  metric(overview.introduced+' / '+overview.total,'Lessons introduced','Original demonstration lessons')+
  metric(overview.scheduled.independent,'Independent recall','Correct scheduled attempts')+
  metric(overview.savedWords,'Saved vocabulary','Words in your wordbook')+'</section>';
 const today='<section class="c9-home-panel c9-unified-card c9-home-plan" aria-labelledby="c9-home-plan-title"><div class="c9-home-panel-heading"><div><p class="c9-home-kicker">STUDY ROUTINE</p><h2 id="c9-home-plan-title">Today’s study plan</h2></div><span class="c9-home-plan-time">'+icon('time')+esc(String(plan.minutes))+' min target</span></div><p class="c9-home-panel-desc">Suggested activities, not required tasks. A recorded attempt is not proof of mastery.</p><ol class="c9-home-tasks">'+hub.cards.map(t=>taskRow(t,act,esc)).join('')+'</ol><div class="c9-home-footer-link"><a href="#/plan">Edit workload and view the seven-day plan '+icon('arrow')+'</a></div></section>';
 const studyProgress='<section class="c9-home-panel c9-unified-card c9-home-learning" aria-labelledby="c9-home-progress-title"><div class="c9-home-panel-heading"><div><p class="c9-home-kicker">YOUR COURSE</p><h2 id="c9-home-progress-title">Learning progress</h2></div><a href="#/progress" class="c9-home-small-link">Details '+icon('arrow')+'</a></div>'+
  progress(overview.introduced,overview.total,'Original character lessons introduced')+
  '<p class="c9-home-progress-note">Introduced does not mean mastered. This original curriculum is not an official HSK syllabus.</p>'+
  (last?'<div class="c9-home-last"><span>Last introduced lesson</span><strong lang="zh-Hans">'+esc(last.hanzi)+'</strong><span>'+esc(last.pinyin)+' · '+esc(last.meaning)+'</span>'+act('hub-lesson','Revisit','c9-button c9-button--secondary c9-button--small','data-id="'+esc(last.id)+'"')+'</div>':
   '<div class="c9-home-quiet-state">'+icon('book')+'<div><strong>Your course starts here.</strong><p>Open an original lesson and introduce its character before building scheduled recall.</p></div></div>')+
  (lesson?'<div class="c9-home-next-lesson"><div><span>Next unintroduced lesson</span><strong lang="zh-Hans">'+esc(lesson.hanzi)+'</strong><span>'+esc(lesson.pinyin)+' · '+esc(lesson.meaning)+'</span></div>'+act('hub-lesson','Open lesson','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</div>':
  '<p class="c9-home-progress-note">All original demonstration lessons have been introduced. Scheduled review and contextual study remain available.</p>')+
  '</section>';
 const quick='<section class="c9-home-panel c9-unified-card c9-home-shortcuts" aria-labelledby="c9-home-actions-title"><div class="c9-home-panel-heading"><div><p class="c9-home-kicker">QUICK ACCESS</p><h2 id="c9-home-actions-title">Study a skill</h2></div></div><div class="c9-home-shortcut-grid">'+
  routeLink('learn','Lessons','book')+
  routeLink('review','Review','repeat')+
  routeLink('explore','Vocabulary','browse')+
  routeLink('stories','Reading','character')+'</div>'+
  '<div class="c9-home-footer-link"><a href="#/find">Find characters, grammar and more '+icon('arrow')+'</a></div></section>';
 const continuation=hub.sessions.length?
  '<section class="c9-home-panel c9-unified-card c9-home-continuation" aria-labelledby="c9-home-cont-title"><div class="c9-home-panel-heading"><div><p class="c9-home-kicker">RECOVERABLE WORK</p><h2 id="c9-home-cont-title">Unfinished sessions</h2></div><span class="c9-badge">'+hub.sessions.length+' saved</span></div><div class="c9-home-resume-list">'+hub.sessions.slice(0,3).map(s=>'<div class="c9-home-resume-item"><div><strong>'+esc(s.label)+'</strong><span>'+esc(s.detail)+'</span></div>'+act('hub-resume','Resume','c9-button c9-button--secondary c9-button--small','data-kind="'+esc(s.kind)+'"')+'</div>').join('')+'</div></section>':
  '<section class="c9-home-panel c9-unified-card c9-home-continuation" aria-labelledby="c9-home-cont-title"><div class="c9-home-panel-heading"><div><p class="c9-home-kicker">CONTINUITY</p><h2 id="c9-home-cont-title">Continue in context</h2></div></div><p class="c9-home-panel-desc">Choose your next activity from the existing course. Browsing does not award review credit.</p><div class="c9-home-context-links">'+shortcuts.filter(s=>s.kind!=='review').slice(0,3).map(s=>'<a href="#/'+esc(s.route)+'"><span><strong>'+esc(s.label)+'</strong><small>'+esc(s.description)+'</small></span>'+icon('arrow')+'</a>').join('')+'</div></section>';
 const units=lessonGroups(),introducedSet=new Set(state.learned||[]);
 const openUnits=units.filter(u=>u.lessons.some(l=>!introducedSet.has(l.id)));
 const suggestedUnits=(openUnits.length?openUnits:units).slice(0,3);
 const roadmap='<section class="c9-home-panel c9-unified-card c9-home-roadmap" aria-labelledby="c9-home-roadmap-title">'+
  '<div class="c9-home-panel-heading"><div><p class="c9-home-kicker">CHARACTER FOUNDATIONS</p><h2 id="c9-home-roadmap-title">Your course units</h2></div><a class="c9-home-small-link" href="#/learn">Browse all '+units.length+' units '+icon('arrow')+'</a></div>'+
  '<p class="c9-home-panel-desc">Continue from introduced lessons. Unit counts represent your local learning record, not mastery.</p>'+
  '<div class="c9-home-roadmap-grid">'+suggestedUnits.map(u=>{
   const completed=u.lessons.filter(l=>introducedSet.has(l.id)).length;
   const next=u.lessons.find(l=>!introducedSet.has(l.id))||u.lessons[0];
   return '<article class="c9-home-roadmap-unit"><div class="c9-home-roadmap-top"><span>UNIT '+String(u.index).padStart(2,'0')+'</span><strong>'+completed+' / '+u.lessons.length+' introduced</strong></div>'+
    '<h3>'+esc(u.name)+'</h3>'+
    progress(completed,u.lessons.length,'Unit '+String(u.index)+' introduced lessons')+
    '<div class="c9-home-roadmap-next"><span class="c9-home-roadmap-hanzi" lang="zh-Hans">'+esc(next.hanzi)+'</span><div><strong>'+esc(next.pinyin)+'</strong><small>'+esc(next.meaning)+'</small></div>'+
    act('hub-lesson',completed===u.lessons.length?'Revisit':'Study next','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"')+'</div></article>';
  }).join('')+'</div></section>';
 const connected='<section class="c9-home-panel c9-unified-card c9-home-source-paths" aria-labelledby="c9-home-source-paths-title">'+
  '<div class="c9-home-panel-heading"><div><p class="c9-home-kicker">LEARN BEYOND FLASHCARDS</p><h2 id="c9-home-source-paths-title">Study Chinese in context</h2></div><a class="c9-home-small-link" href="#/find">Search sources '+icon('arrow')+'</a></div>'+
  '<p class="c9-home-panel-desc">Return to original reading, conversations, grammar and pronunciation. These independent activities never award scheduled-review grades.</p>'+
  '<div class="c9-home-source-grid">'+[
    ['stories','Connected reading',overview.library.readings+' source readings','book'],
    ['dialogues','Everyday conversations',overview.library.dialogues+' source dialogues','activity'],
    ['grammar','Understand grammar','Original explanations and practice','character'],
    ['pinyin','Pronunciation','Sounds, tones and listening','repeat']
   ].map(([route,label,detail,symbol])=>'<a class="c9-home-source-card" href="#/'+route+'">'+icon(symbol)+'<span><strong>'+esc(label)+'</strong><small>'+esc(detail)+'</small></span>'+icon('chevron')+'</a>').join('')+'</div></section>';
 const readiness='<div class="c9-home-status-row"><span id="c9-home-connectivity" role="status">'+
 (offline?'Offline':'Online')+' · '+
 (offlineShell==='ready'?'Static source cache verified':offlineShell==='checking'?'Checking offline cache':
 offlineShell==='incomplete'?'Offline cache incomplete':
 offlineShell==='outdated'?'Previous offline version active':
 offlineShell==='installing'?'Preparing offline content':'Offline shell not ready')+
 '</span><span>Progress stored only in this browser</span></div>';
 const lastId=(state.introductions||[]).at(-1)?.id||last?.id;
 const inferred=HSK_TARGETS.find(t=>hskTargetLessons(t.id).some(l=>l.id===lastId))?.id||'1';
 const level=HSK_TARGETS.some(t=>t.id===selectedLevel)?selectedLevel:inferred;
 const available=hskTargetLessons(level),learned=new Set(state.learned||[]);
 const next=available.find(l=>!learned.has(l.id))||available[0]||null;
 const sources=hskTargetPractice(level);
 const reading=sources.readings[0],dialogue=sources.dialogues[0],mission=sources.missions[0];
 const selected=next?{id:next.id,kind:'lesson',label:'Lesson '+next.order+' · '+next.meaning,action:'c9-lesson-open'}:
  reading?{id:reading.id,kind:'reading',label:reading.title,action:'c9-media-open-story'}:
  dialogue?{id:dialogue.id,kind:'dialogue',label:dialogue.title,action:'c9-media-open-dialogue'}:
  mission?{id:mission.id,kind:'mission',label:mission.title,action:'pathway-select'}:null;
 const levelTitle=HSK_TARGETS.find(t=>t.id===level)?.name||'HSK 1';
 const firstAction=hub.sessions.length?act('hub-primary','Resume saved activity →','c9-button c9-button--primary'):
  selected?act(selected.action,(available.some(l=>learned.has(l.id))?'Continue ':'Start ')+selected.kind+' →',
   'c9-button c9-button--primary','data-id="'+esc(selected.id)+'"'):
  '<a class="c9-button c9-button--primary" href="#/learn/level/'+esc(level)+'">'+esc(levelTitle)+' · Open course →</a>';
 return '<div class="c9-home">'+storageNotice+offlineNotice+offlineRecovery+offlineUpgrade+
  '<section class="c9-home-course-launch"><h1>'+esc(levelTitle)+' · '+esc(selected?.label||'Learn Chinese')+'</h1>'+
  ''+
  '<div class="c9-home-course-actions">'+firstAction+
  '<a class="c9-button c9-button--secondary" href="#/learn/level/'+esc(level)+'">View '+esc(levelTitle)+'</a><a class="c9-home-level-link" href="#/learn">Change level</a></div></section>'+
  (overview.due?'<section class="c9-course-review"><strong>'+overview.due+' review cards due</strong>'+
   '<a href="#/review" class="c9-button c9-button--secondary">Review now</a></section>':'')+
  '<details class="c9-home-explore-more"><summary><strong>Progress and other resources</strong></summary>'+
  '<div class="c9-home-explore-content">'+greeting+
  '<div class="c9-home-first-fold">'+hero+today+'</div>'+metrics+studyProgress+continuation+roadmap+connected+
  '</div></details>'+readiness+'</div>';
}
