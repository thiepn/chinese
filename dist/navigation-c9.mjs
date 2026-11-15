/**
 * C9-28 — Read-only, tab-local source handoff and writing continuation notices.
 * Does not persist, submit, grade or manufacture any study event.
 */
export function renderC9NativeHandoff(trail,act,esc){
 if(!trail)return '';
 const label=trail.origin==='writing'?'Return to my composition':
  trail.origin==='skills'?'Return to Skill Paths':'Return to Advanced Course';
 const detail=trail.origin==='writing'?
  'Your in-tab draft and revision snapshots remain in the original Writing Studio.':
  trail.origin==='skills'?
  'Your selected skill, original source, learning stage and support settings remain in this tab.':
  'Your advanced phase, search, source and translation settings remain in this tab.';
 return '<aside class="c9-native-handoff" aria-label="Return to original source" role="note">'+
 '<div><span class="c9-eyebrow">OPENED FROM '+(trail.origin==='writing'?'WRITING STUDIO':trail.origin==='skills'?'SKILL PATHS':'ADVANCED COURSE')+'</span>'+
 '<strong>'+esc(trail.title||trail.sourceId||'Original source')+'</strong>'+
 '<p>'+detail+' This return changes no learning evidence.</p></div>'+
 act('c9-native-handoff-return','← '+label,'c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}
export function renderC9DraftContinuation(hasDraft,route,act,esc){
 if(!hasDraft||route==='writing')return '';
 return '<aside class="c9-writing-continuation" aria-label="Unsent writing in this tab" role="note">'+
 '<div><strong>Unsent Chinese writing remains in this tab</strong>'+
 '<p>Continue editing your original P43 composition, or export its private JSON backup before closing. Your draft and snapshots remain in-tab unless you explicitly export; they are not learning grades.</p></div>'+
 act('c9-native-resume-writing','Resume my writing →','c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}

export function renderC9SkillWritingReturn(bridge,act,esc){
 if(!bridge?.sourceId)return '';
 return '<aside class="c9-native-handoff c9-skills-writing-return" role="note" aria-label="Return from original writing to Skill Paths">'+
 '<div><span class="c9-eyebrow">OPENED FROM SKILL PATHS</span>'+
 '<strong>'+esc(bridge.title||bridge.sourceId)+'</strong>'+
 '<p>The current P43 composition remains in the same tab. Returning to the original skill does not store, grade, discard or replace this writing.</p></div>'+
 act('c9-skills-return-writing','← Return to the original skill source','c9-button c9-button--secondary c9-button--small')+
 '</aside>';
}
