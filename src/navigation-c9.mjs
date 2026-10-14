/**
 * C9-28 — Read-only, tab-local source handoff and writing continuation notices.
 * Does not persist, submit, grade or manufacture any study event.
 */
export function renderC9NativeHandoff(trail,act,esc){
 if(!trail)return '';
 const label=trail.origin==='writing'?'Return to my composition':'Return to Advanced Course';
 const detail=trail.origin==='writing'?
  'Your in-tab draft and revision snapshots remain in the original Writing Studio.':
  'Your advanced phase, search, source and translation settings remain in this tab.';
 return '<aside class="c9-native-handoff" aria-label="Return to original source" role="note">'+
 '<div><span class="c9-eyebrow">OPENED FROM '+(trail.origin==='writing'?'WRITING STUDIO':'ADVANCED COURSE')+'</span>'+
 '<strong>'+esc(trail.title||trail.sourceId||'Original source')+'</strong>'+
 '<p>'+detail+' This return changes no learning evidence.</p></div>'+
 act('c9-native-handoff-return','← '+label,'c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}
export function renderC9DraftContinuation(hasDraft,route,act,esc){
 if(!hasDraft||route==='writing')return '';
 return '<aside class="c9-writing-continuation" aria-label="Unsent writing in this tab" role="note">'+
 '<div><strong>Unsent Chinese writing remains in this tab</strong>'+
 '<p>Continue editing your original P43 composition, or copy it before refreshing or closing. Drafts and snapshots are not saved to learner progress.</p></div>'+
 act('c9-native-resume-writing','Resume my writing →','c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}
