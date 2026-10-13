/**
 * C9-02 — presentation-only shell behaviour.
 * The existing app.mjs owns routes, learning state, and event writers.
 * This module only updates shell labels/group context and controls the native
 * mobile destination dialog. No storage, routing or academic writes.
 */
export const C9_ROUTE_LABELS = Object.freeze({
  today:'Home', plan:'Study Plan', pathway:'Learning Pathway',
  learn:'Learn', character:'Character Study', review:'Review', explore:'Explore', find:'Search',
  progress:'Progress', settings:'Settings', reader:'Character Reading',
  stories:'Reading & Stories', practice:'Practice Lab', dialogues:'Conversations',
  wordbook:'My Wordbook', senses:'Word Senses', workshop:'Sentence Workshop',
  journey:'Daily Journey', ladder:'Sentence Ladder', block:'Study Blocks',
  fluency:'Fluency Studio', pinyin:'Pinyin & Sounds', grammar:'Grammar',
  sentences:'Sentence Library'
});
const COURSE_ROUTES=new Set([
  'learn','character','reader','stories','practice','dialogues','wordbook','senses',
  'workshop','journey','ladder','block','fluency','pinyin','grammar',
  'sentences','pathway','plan'
]);
const EXPLORE_ROUTES=new Set(['explore','find']);
const PERSONAL_ROUTES=new Set(['progress','settings']);
let connected=false;
let restoreDrawerFocus=false;
let modalSupported=false;

function contextFor(route){
  if(COURSE_ROUTES.has(route))return 'learn';
  if(EXPLORE_ROUTES.has(route))return 'explore';
  if(PERSONAL_ROUTES.has(route))return 'more';
  if(route==='today'||route==='review')return route;
  return 'more';
}

export function syncC9Shell(route){
  const label=C9_ROUTE_LABELS[route]||'Home';
  const current=document.getElementById('c9-current-section');
  if(current)current.textContent=label;
  const mobile=document.getElementById('c9-mobile-current');
  if(mobile)mobile.textContent=label;
  const active=contextFor(route);

  // Mobile has one selected destination: a direct page or More for secondary
  // routes. Desktop may additionally highlight the Learn parent context.
  for(const a of document.querySelectorAll('.c9-mobile-nav [data-c9-primary]')){
    a.classList.remove('is-context');
  }
  for(const a of document.querySelectorAll('.c9-sidebar [data-c9-context]')){
    a.classList.toggle('is-context',a.dataset.c9Context===active&&a.dataset.route!==route);
  }
  const more=document.getElementById('c9-more-toggle');
  if(more){
    const inMore=active==='more'||!['today','learn','review','explore'].includes(route);
    more.classList.toggle('is-context',inMore);
    more.setAttribute('aria-label',inMore
      ?'More destinations, current section '+label
      :'More learning destinations');
  }
  const details=document.querySelector('.c9-sidebar .more-tools');
  if(details&&details.querySelector('[data-route="'+route+'"]'))details.open=true;

  // If another controller navigates, do not leave the old menu over the page.
  const dialog=document.getElementById('c9-mobile-drawer');
  if(dialog?.open){restoreDrawerFocus=false;dialog.close();}
  return label;
}

export function connectC9Shell(){
 if(connected)return;
 connected=true;
 const toggle=document.getElementById('c9-more-toggle');
 const drawer=document.getElementById('c9-mobile-drawer');
 const close=document.getElementById('c9-drawer-close');
 if(!toggle||!drawer)return;
 modalSupported=typeof drawer.showModal==='function';
 const setExpanded=expanded=>toggle.setAttribute('aria-expanded',String(expanded));
 const focusCurrent=()=>(
  drawer.querySelector('[aria-current="page"]')||
  drawer.querySelector('a[href^="#/"]')||close)?.focus({preventScroll:true});
 const dismiss=(restore=true)=>{
  if(!drawer.open)return;
  restoreDrawerFocus=restore;
  if(typeof drawer.close==='function')drawer.close();
  else{drawer.removeAttribute('open');setExpanded(false);if(restore)toggle.focus({preventScroll:true});}
 };
 toggle.addEventListener('click',()=>{
  if(drawer.open){dismiss(true);return;}
  restoreDrawerFocus=false;
  if(modalSupported)drawer.showModal();
  else drawer.setAttribute('open','');
  setExpanded(true);
  focusCurrent();
 });
 close?.addEventListener('click',()=>dismiss(true));
 drawer.addEventListener('cancel',()=>{restoreDrawerFocus=true;});
 drawer.addEventListener('close',()=>{
  setExpanded(false);
  if(restoreDrawerFocus)toggle.focus({preventScroll:true});
  restoreDrawerFocus=false;
 });
 drawer.addEventListener('click',event=>{
  if(event.target===drawer){dismiss(true);return;}
  if(event.target.closest('a[href^="#/"]')){
    // Route changes move focus to the new page heading. Do not steal it back
    // to the now-closed menu toggle.
    dismiss(false);
  }
 });
 // For older WebViews using a nonmodal dialog fallback, keep keyboard users
 // inside the opened navigation and support Escape to dismiss.
 drawer.addEventListener('keydown',event=>{
  if(!drawer.open||modalSupported)return;
  if(event.key==='Escape'){event.preventDefault();dismiss(true);return;}
  if(event.key!=='Tab')return;
  const items=[...drawer.querySelectorAll('a[href],button:not([disabled])')];
  if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 window.addEventListener('resize',()=>{
  if(window.innerWidth>800&&drawer.open)dismiss(false);
 });
}