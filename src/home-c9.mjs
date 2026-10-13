/**
 * C9-03: read-only Home dashboard projection over existing learning authorities.
 * No state writes, grades, HSK certification claims, or second scheduling engine.
 */
import {courseOverview,courseShortcuts} from './course-overview.mjs';
import {learningHub} from './learning-hub.mjs';

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
export function renderC9Home(state,act,esc,{storageReady=true,offline=false}={}){
 const overview=courseOverview(state),hub=learningHub(state);
 const plan=hub.plan,primary=hub.primary;
 const hasActivity=overview.introduced>0||overview.scheduled.attempts>0||overview.supplementary>0||hub.sessions.length>0;
 const shortcuts=courseShortcuts(state);
 const lesson=overview.nextLesson;
 const last=overview.lastLesson;
 const primaryLabel=primary.kind==='journey'&&!hasActivity?'Start learning':primary.kind==='resume'?'Resume saved study':'Continue learning';
 const storageNotice=!storageReady?'<div class="c9-home-notice c9-home-notice--warning" role="status"><strong>Local saving is unavailable</strong><span>You can browse the available material, but progress cannot be saved until browser storage works. Existing learning records have not been changed.</span></div>':'';
 const offlineNotice='<div id="c9-home-offline-notice" class="c9-home-notice" role="status"'+(offline?'':' hidden')+'><strong>Offline</strong><span>Available cached material can still be studied. Local progress depends on browser storage.</span></div>';
 const scenery='<svg class="c9-home-mountains" viewBox="0 0 430 175" aria-hidden="true" focusable="false"><path d="M0 151Q51 120 77 126Q120 57 158 106Q189 126 218 73Q262 28 317 108Q358 71 430 130V175H0Z" fill="currentColor" opacity=".08"/><path d="M0 151Q51 120 77 126Q120 57 158 106Q189 126 218 73Q262 28 317 108Q358 71 430 130" fill="none" stroke="currentColor" opacity=".17"/><path d="M181 133h91m-76 0 17-18h38l17 18m-60-19 5-10h37l7 10m-12 19v-16m-22 16v-16m-21-15h69" fill="none" stroke="currentColor" opacity=".19"/><path d="M20 157h150m132 0h128" stroke="currentColor" opacity=".13"/></svg>';
 const hero='<section class="c9-home-hero" aria-labelledby="c9-home-next"><div class="c9-home-hero-copy"><span class="c9-home-kicker">YOUR NEXT STEP · ORIGINAL COURSE</span><h2 id="c9-home-next">'+esc(primary.label)+'</h2><p>'+esc(primary.detail)+'</p><div class="c9-home-hero-actions">'+act('hub-primary',primaryLabel+' '+icon('arrow'),'c9-button c9-button--primary')+'<a class="c9-button c9-button--secondary" href="#/plan">View study plan</a></div></div><div class="c9-home-art">'+scenery+'<span class="c9-home-hero-seal" lang="zh-Hans">学</span></div></section>';
 const greeting='<header class="c9-home-heading"><div><p class="c9-home-kicker">THIEPN CHINESE · TODAY</p><h1>One focused learning day.</h1><p>Continue the most useful activity, then practise Chinese in context.</p></div><span class="c9-home-date" aria-label="Local activity status">Local-first learning</span></header>';
 const metrics='<section class="c9-home-metrics" aria-label="Your actual learning records">'+
  metric(overview.due,'Due for review','Scheduled recall prompts')+
  metric(overview.introduced+' / '+overview.total,'Lessons introduced','Original demonstration lessons')+
  metric(overview.scheduled.independent,'Independent recall','Correct scheduled attempts')+
  metric(overview.savedWords,'Saved vocabulary','Words in your wordbook')+'</section>';
 const today='<section class="c9-home-panel c9-unified-card c9-home-plan" aria-labelledby="c9-home-plan-title"><div class="c9-home-panel c9-unified-card-heading"><div><p class="c9-home-kicker">STUDY ROUTINE</p><h2 id="c9-home-plan-title">Today’s study plan</h2></div><span class="c9-home-plan-time">'+icon('time')+esc(String(plan.minutes))+' min target</span></div><p class="c9-home-panel c9-unified-card-desc">Suggested activities, not required tasks. A recorded attempt is not proof of mastery.</p><ol class="c9-home-tasks">'+hub.cards.map(t=>taskRow(t,act,esc)).join('')+'</ol><div class="c9-home-footer-link"><a href="#/plan">Edit workload and view the seven-day plan '+icon('arrow')+'</a></div></section>';
 const studyProgress='<section class="c9-home-panel c9-unified-card c9-home-learning" aria-labelledby="c9-home-progress-title"><div class="c9-home-panel c9-unified-card-heading"><div><p class="c9-home-kicker">YOUR COURSE</p><h2 id="c9-home-progress-title">Learning progress</h2></div><a href="#/progress" class="c9-home-small-link">Details '+icon('arrow')+'</a></div>'+
  progress(overview.introduced,overview.total,'Original character lessons introduced')+
  '<p class="c9-home-progress-note">Introduced does not mean mastered. This original curriculum is not an official HSK syllabus.</p>'+
  (last?'<div class="c9-home-last"><span>Last introduced lesson</span><strong lang="zh-Hans">'+esc(last.hanzi)+'</strong><span>'+esc(last.pinyin)+' · '+esc(last.meaning)+'</span>'+act('hub-lesson','Revisit','c9-button c9-button--secondary c9-button--small','data-id="'+esc(last.id)+'"')+'</div>':
   '<div class="c9-home-quiet-state">'+icon('book')+'<div><strong>Your course starts here.</strong><p>Open an original lesson and introduce its character before building scheduled recall.</p></div></div>')+
  (lesson?'<div class="c9-home-next-lesson"><div><span>Next unintroduced lesson</span><strong lang="zh-Hans">'+esc(lesson.hanzi)+'</strong><span>'+esc(lesson.pinyin)+' · '+esc(lesson.meaning)+'</span></div>'+act('hub-lesson','Open lesson','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</div>':
  '<p class="c9-home-progress-note">All original demonstration lessons have been introduced. Scheduled review and contextual study remain available.</p>')+
  '</section>';
 const quick='<section class="c9-home-panel c9-unified-card c9-home-shortcuts" aria-labelledby="c9-home-actions-title"><div class="c9-home-panel c9-unified-card-heading"><div><p class="c9-home-kicker">QUICK ACCESS</p><h2 id="c9-home-actions-title">Study a skill</h2></div></div><div class="c9-home-shortcut-grid">'+
  routeLink('learn','Lessons','book')+
  routeLink('review','Review','repeat')+
  routeLink('explore','Vocabulary','browse')+
  routeLink('stories','Reading','character')+'</div>'+
  '<div class="c9-home-footer-link"><a href="#/find">Find characters, grammar and more '+icon('arrow')+'</a></div></section>';
 const continuation=hub.sessions.length?
  '<section class="c9-home-panel c9-unified-card c9-home-continuation" aria-labelledby="c9-home-cont-title"><div class="c9-home-panel c9-unified-card-heading"><div><p class="c9-home-kicker">RECOVERABLE WORK</p><h2 id="c9-home-cont-title">Unfinished sessions</h2></div><span class="c9-badge">'+hub.sessions.length+' saved</span></div><div class="c9-home-resume-list">'+hub.sessions.slice(0,3).map(s=>'<div class="c9-home-resume-item"><div><strong>'+esc(s.label)+'</strong><span>'+esc(s.detail)+'</span></div>'+act('hub-resume','Resume','c9-button c9-button--secondary c9-button--small','data-kind="'+esc(s.kind)+'"')+'</div>').join('')+'</div></section>':
  '<section class="c9-home-panel c9-unified-card c9-home-continuation" aria-labelledby="c9-home-cont-title"><div class="c9-home-panel c9-unified-card-heading"><div><p class="c9-home-kicker">CONTINUITY</p><h2 id="c9-home-cont-title">Continue in context</h2></div></div><p class="c9-home-panel c9-unified-card-desc">Choose your next activity from the existing course. Browsing does not award review credit.</p><div class="c9-home-context-links">'+shortcuts.filter(s=>s.kind!=='review').slice(0,3).map(s=>'<a href="#/'+esc(s.route)+'"><span><strong>'+esc(s.label)+'</strong><small>'+esc(s.description)+'</small></span>'+icon('arrow')+'</a>').join('')+'</div></section>';
 const readiness='<div class="c9-home-status-row"><span id="c9-home-connectivity" role="status">'+(offline?'Offline · cache-dependent availability':'Online · local learner data')+'</span><span>Progress stored only in this browser</span></div>';
 return '<div class="c9-home">'+greeting+storageNotice+offlineNotice+hero+metrics+
  '<div class="c9-home-columns"><div class="c9-home-main-column">'+today+quick+'</div><div class="c9-home-side-column">'+studyProgress+continuation+'</div></div>'+
  readiness+'</div>';
}
