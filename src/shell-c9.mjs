/**
 * C9-02 — presentation-only shell behaviour.
 * The existing app.mjs owns routes, learning state, and event writers.
 * This module only updates shell labels/group context and controls the native
 * mobile destination dialog. No storage, routing or academic writes.
 */
import {C9_ROUTE_LABELS,c9RouteInfo} from './ui-c9.mjs';
export {C9_ROUTE_LABELS} from './ui-c9.mjs';
let connected=false;
let restoreDrawerFocus=false;
let modalSupported=false;

function contextFor(route){return c9RouteInfo(route).parent;}

export function syncC9Shell(route,{due=0,storageReady=true}={}){
  const label=C9_ROUTE_LABELS[route]||'Home';
  const current=document.getElementById('c9-current-section');
  if(current)current.textContent=label;
  const category=document.getElementById('c9-current-category');
  if(category)category.textContent=c9RouteInfo(route).area;
  document.documentElement.dataset.c9Area=c9RouteInfo(route).group;
  document.documentElement.dataset.c9Route=route;
  const mobile=document.getElementById('c9-mobile-current');
  if(mobile)mobile.textContent=label;
  const active=contextFor(route);

  // Mobile has one selected destination: a direct page or More for secondary
  // routes. Desktop may additionally highlight the Learn parent context.
  for(const a of document.querySelectorAll('.c9-mobile-nav [data-c9-primary]')){
    a.classList.toggle('is-context',a.dataset.c9Primary===active&&a.dataset.route!==route);
  }
  for(const a of document.querySelectorAll('.c9-sidebar [data-c9-context]')){
    a.classList.toggle('is-context',a.dataset.c9Context===active&&a.dataset.route!==route);
  }
  const more=document.getElementById('c9-more-toggle');
  if(more){
    const inMore=active==='more';
    more.classList.toggle('is-context',inMore);
    more.setAttribute('aria-label',inMore
      ?'More destinations, current section '+label
      :'More learning destinations');
  }
  const count=Number.isFinite(due)?Math.max(0,Math.floor(due)):0;
  for(const id of ['c9-review-count','c9-mobile-review-count']){
    const el=document.getElementById(id);
    if(!el)continue;
    el.hidden=count===0;
    el.textContent=count>99?'99+':String(count);
    el.setAttribute('aria-label',count+' scheduled review prompts due');
  }
  const storage=document.getElementById('c9-storage-state');
  if(storage){
    storage.textContent=storageReady?'Local learning record':'Storage unavailable';
    storage.dataset.status=storageReady?'ready':'unavailable';
  }
  const pathways=document.querySelector('.c9-sidebar .c9-sidebar-study-more');
  if(pathways&&pathways.querySelector('[data-route="'+route+'"]'))pathways.open=true;
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