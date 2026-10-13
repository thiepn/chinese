/**
 * C9-12 — presentation-only keyboard, focus and screen-reader helpers.
 * This module never reads or mutates learner progress, saves state, routes,
 * assessment evidence, network data or the original router.
 */
const focusable='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const safeFocus=el=>{if(!el)return false;try{el.focus({preventScroll:true});return document.activeElement===el;}catch{return false;}};
const isEditable=el=>Boolean(el?.closest?.('input,textarea,select,[contenteditable="true"]'));
export function captureC9Focus(root){
 const target=document.activeElement;
 if(!target||!root.contains(target)||target===root)return null;
 return {
  route:location.hash,
  id:target.id||null,
  action:target.dataset?.action||null,
  entry:target.dataset?.id||null,
  section:target.dataset?.section||null,
  grade:target.dataset?.grade||null,
  tag:target.tagName,
  selection:isEditable(target)&&typeof target.selectionStart==='number'?
   {start:target.selectionStart,end:target.selectionEnd}:null
 };
}
export function restoreC9Focus(root,snapshot){
 if(!snapshot||snapshot.route!==location.hash)return;
 let target=snapshot.id?root.querySelector('#'+CSS.escape(snapshot.id)):null;
 if(!target&&snapshot.action){
  target=[...root.querySelectorAll('[data-action]')].find(el=>
   el.dataset.action===snapshot.action&&
   (snapshot.entry===null||el.dataset.id===snapshot.entry)&&
   (snapshot.section===null||el.dataset.section===snapshot.section)&&
   (snapshot.grade===null||el.dataset.grade===snapshot.grade))||null;
 }
 // A reviewed or completed activity replaces its old action control.
 // Focus the new feedback or exercise title instead of silently returning to
 // the document body, but never focus a hidden disclosure.
 if(!target&&snapshot.action){
  target=root.querySelector('.c9-assessment-feedback[role="status"],.c9-review-complete h1,.c9-assessment-live h2,.c9-lesson-title-row h1,.c9-lesson-workspace h1');
  if(target&&!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
 }
 if(!target||target.disabled||target.closest('[hidden]'))return;
 if(!safeFocus(target))return;
 if(snapshot.selection&&typeof target.setSelectionRange==='function'){
  try{target.setSelectionRange(snapshot.selection.start,snapshot.selection.end);}catch{}
 }
}
export function announceC9Route(label,main){
 const announcement=document.getElementById('c9-route-announcement');
 if(announcement)announcement.textContent=label+' workspace';
 const heading=main.querySelector('#app-content h1')||main.querySelector('#app-content h2');
 if(heading){
  if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');
  if(safeFocus(heading))return;
 }
 safeFocus(main);
}
export function announceC9Interaction(message){
 const target=document.getElementById('c9-interaction-announcement');
 if(target)target.textContent=message;
}
export function installC9KeyboardHelp(){
 const dialog=document.getElementById('c9-shortcuts-dialog');
 const button=document.getElementById('c9-shortcuts-open');
 const close=document.getElementById('c9-shortcuts-close');
 if(!button||!dialog)return;
 const dismiss=()=>{
  if(typeof dialog.close==='function'&&dialog.open)dialog.close();
  else dialog.removeAttribute('open');
 };
 button.addEventListener('click',()=>{
  if(dialog.open){dismiss();return;}
  if(typeof dialog.showModal==='function')dialog.showModal();
  else dialog.setAttribute('open','');
  (close||dialog.querySelector(focusable))?.focus();
 });
 close?.addEventListener('click',dismiss);
 dialog.addEventListener('close',()=>safeFocus(button));
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
 dialog.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&typeof dialog.showModal!=='function'){e.preventDefault();dismiss();safeFocus(button);}
 });
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.isComposing||e.ctrlKey||e.altKey||e.metaKey||isEditable(e.target))return;
  if(e.key==='?'&&!document.querySelector('dialog[open]')){
   e.preventDefault();button.click();
  }
 });
}
