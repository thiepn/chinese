/**
 * C9-27 — Authored independent Mandarin writing, native source continuity.
 * P43 remains the ONLY open-ended authoring experience. This is a presentation
 * adapter around its original studio, not a second essay engine or state store.
 * The app owns one ephemeral tab-local draft, original libraries own evidence.
 */
import {P43_UNITS,findP43Unit,P43_REVIEW_CRITERIA} from './p43-course.mjs';
import {p43Overview,p43ProductionStudio} from './p43-screen.mjs';
import {P48_ARGUMENTS,findP48Argument,P48_REVISION_CHECKS} from './p48-arguments.mjs';
import {P50_ARGUMENTS,findP50Argument,P50_REVISION} from './p50-arguments.mjs';
import {P51_ARGUMENTS,findP51Argument,P51_REVISION} from './p51-arguments.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {SENTENCE_TASKS} from './sentence-workshop.mjs';

const transferSets=Object.freeze({
 48:Object.freeze({records:P48_ARGUMENTS,find:findP48Argument,criteria:P48_REVISION_CHECKS}),
 50:Object.freeze({records:P50_ARGUMENTS,find:findP50Argument,criteria:P50_REVISION}),
 51:Object.freeze({records:P51_ARGUMENTS,find:findP51Argument,criteria:P51_REVISION})
});
export const c9WritingUnit=findP43Unit;
export const c9WritingTransfer=(phase,readingId)=>transferSets[phase]?.find(readingId)||null;
export const c9WritingLinkedUnit=(phase,sourceId)=>{
 if(Number(phase)===43)return findP43Unit(sourceId);
 const transfer=c9WritingTransfer(Number(phase),sourceId);
 return transfer?findP43Unit(transfer.p43Id):null;
};
export const c9WritingNativeReference=(phase,sourceId)=>{
 const transfer=c9WritingTransfer(Number(phase),sourceId);
 if(!transfer)return null;
 const story=STORIES.find(x=>x.beginner?.['p'+phase]?.id===sourceId)||null;
 const dialogue=DIALOGUES.find(x=>x['p'+phase]?.readingId===sourceId)||null;
 const task=SENTENCE_TASKS.find(x=>x.id==='p'+phase+':argument:'+sourceId+':model0')||null;
 return {story,dialogue,task};
};
function sourcesFor(phase,sourceId){
 const transfer=c9WritingTransfer(phase,sourceId);
 if(!transfer)return null;
 return {...transfer,phase,criteria:transferSets[phase].criteria,...c9WritingNativeReference(phase,sourceId)};
}
const criterionLabel=(c)=>c.title||c.label||c.prompt||c.question;
const criterionQuestion=(c)=>c.prompt||c.question||c.label||'';
const isChecked=(session,phase,id)=>Boolean(session.transferReview?.includes(phase+':'+id));
const learned=(state,id,field,list)=>(state[list]||[]).some(e=>e[field]===id&&e.correct===true&&!e.assisted);
function nativeHistory(state,source){
 return [
  source.story&&learned(state,source.story.id,'storyId','readingEvents')?'An independent source reading answer is recorded':null,
  source.dialogue&&learned(state,source.dialogue.id,'dialogueId','dialogueEvents')?'An independent dialogue answer is recorded':null,
  source.task&&learned(state,source.task.id,'taskId','sentenceEvents')?'An independent exact-form task is recorded':null
 ].filter(Boolean);
}
function transferPanel(state,session,act,esc){
 const phase=Number(session.transferPhase),source=sourcesFor(phase,session.sourceId);
 if(!source)return '';
 const progress=nativeHistory(state,source);
 const linked=[
  source.story?act('c9-writing-native','Read the original source →','c9-button c9-button--secondary c9-button--small',
   'data-kind="story" data-id="'+esc(source.story.id)+'"'):'',
  source.dialogue?act('c9-writing-native','Listen to the authored conversation →','c9-button c9-button--secondary c9-button--small',
   'data-kind="dialogue" data-id="'+esc(source.dialogue.id)+'"'):'',
  source.task?act('c9-writing-native','Reconstruct an original model sentence →','c9-button c9-button--secondary c9-button--small',
   'data-kind="task" data-id="'+esc(source.task.id)+'"'):''
 ].filter(Boolean).join('');
 const steps=Object.freeze([
  ['A','Identify whose evidence is being described, and whether it supports the claim.'],
  ['B','State a fair objection without changing the source’s scope or certainty.'],
  ['C','Explain a reasoned response that distinguishes proposal, decision and consequence.'],
  ['D','Check register, target audience and remaining uncertainty, then revise the underlying P43 draft.']
 ]);
 const models=session.transferModels||false;
 const modelList=source.models||[];
 return '<section class="c9-writing-transfer" aria-labelledby="c9-transfer-title">'+
 '<div class="c9-writing-transfer-head"><div><p class="c9-eyebrow">ORIGINAL P'+phase+' · SOURCE-BASED TRANSFER</p>'+
 '<h2 id="c9-transfer-title">'+esc(source.claim||'Independent source-based argument')+'</h2>'+
 '<p>The authored reading and the original P43 composition are linked by their historical source IDs; reviewing this argument does not produce a new score.</p></div>'+
 '<span class="c9-writing-source-ref">'+esc(source.readingId)+'</span></div>'+
 '<div class="c9-writing-claim-grid">'+[
  ['Claim to evaluate',source.claim],['Fair objection',source.objection],
  ['Evidence-based response',source.rebuttal],['Misconception to repair',source.misconception]
 ].map(([label,value])=>'<article><h3>'+esc(label)+'</h3><p>'+esc(value||'Refer to the authored original source.')+'</p></article>').join('')+'</div>'+
 '<div class="c9-writing-action-grid"><div><h3>Independent production brief</h3><p>'+esc(source.writing||'Write an original Chinese response.')+'</p></div>'+
 '<div><h3>Spoken transfer</h3><p>'+esc(source.oral||'Explain your reasoning aloud in Chinese.')+'</p>'+
 '<small>Device audio may demonstrate original text. Your speech is not recorded or evaluated.</small></div></div>'+
 '<div class="c9-writing-process"><h3>Build a verifiable argument</h3><ol>'+
 steps.map(([n,v])=>'<li><span>'+n+'</span><p>'+esc(v)+'</p></li>').join('')+'</ol></div>'+
 '<section class="c9-writing-review" aria-label="Source-specific self-review"><h3>Review against the authored source</h3>'+
 '<p>Self-checks are local reflection notes, not independent proof of correctness.</p>'+
 source.criteria.map(item=>{
  const checked=isChecked(session,phase,item.id);
  return act('c9-writing-criterion','<span class="c9-writing-review-icon" aria-hidden="true">'+(checked?'✓':'○')+'</span>'+
   '<span><strong>'+esc(criterionLabel(item))+'</strong><small>'+esc(criterionQuestion(item))+'</small></span>',
   'c9-writing-review-row'+(checked?' is-checked':''),
   'data-phase="'+phase+'" data-id="'+esc(item.id)+'" role="checkbox" aria-checked="'+checked+'"');
 }).join('')+'</section>'+
 '<section class="c9-writing-models"><div><h3>Original fixed-form models</h3><p>Reveal these only after making an independent attempt. They are not an essay grade.</p></div>'+
 act('c9-writing-models',models?'Hide the supplied models':'Reveal P'+phase+' models · assisted','c9-button c9-button--secondary c9-button--small',
 'aria-pressed="'+models+'"')+
 (models?'<div class="c9-writing-model-grid">'+modelList.map((m,i)=>'<article><span>Model '+(i+1)+'</span>'+
 '<strong lang="zh-Hans">'+esc(m.hanzi)+'</strong><small>'+esc(m.pinyin)+'</small>'+
 '<p>'+esc(m.english)+'</p><p>'+esc(m.purpose||'Original authored model')+'</p></article>').join('')+'</div>':'')+
 '</section>'+
 '<div class="c9-writing-native-links"><h3>Continue in the original, single-authority activities</h3>'+
 '<div>'+linked+'</div><p>'+
 (progress.length?esc(progress.join(' · ')):'No independently correct native linked evidence found; inspecting this material does not mark it complete.')+
 '</p></div>'+
 '</section>';
}
export function renderC9WritingWorkspace(state,session,act,esc){
 const unit=findP43Unit(session.unitId)||P43_UNITS[0];
 const validTransfer=c9WritingTransfer(session.transferPhase,session.sourceId);
 const info='<section class="c9-writing-intro"><p class="c9-eyebrow">C9 · ORIGINAL ADVANCED PRODUCTION</p>'+
 '<h1>Write, revise and defend your reasoning.</h1>'+
 '<p>The P43 authored writing studio is the only open-ended composition workspace. P48, P50 and P51 add source-grounded prompts and review criteria around the same editor, not a second essay store or semantic grading system.</p>'+
 '<p class="c9-writing-privacy">Writing remains in this tab until you deliberately export a private draft backup. No open-ended draft is sent to learner progress or a server.</p>'+
 '<div class="c9-writing-intro-links"><a href="#/advanced">Original Advanced Course</a><a href="#/stories">Original Readings</a><a href="#/workshop">Native Sentence Workshop</a></div></section>';
 const backup='<section class="c9-writing-portability" aria-labelledby="c9-writing-backup-title">'+
 '<div><h2 id="c9-writing-backup-title">Keep a copy of your writing</h2>'+
 '<p>Download your draft and up to 12 revision snapshots as a private JSON file, or select a previous backup. Export and import are manual; no cloud sync or automatic recovery is implied.</p></div>'+
 '<div class="c9-writing-backup-controls">'+
 act('c9-writing-backup-export','Export private draft backup','c9-button c9-button--primary c9-button--small',
 (session.draft?.trim()||session.revisions?.length?'':'disabled'))+
 '<label for="c9-writing-backup-file">Import a previous backup</label>'+
 '<input id="c9-writing-backup-file" type="file" accept=".json,application/json" aria-describedby="c9-writing-backup-title"></div>'+
 (session.importError?'<p class="c9-writing-import-error" role="alert">'+esc(session.importError)+'</p>':'')+
 '<p class="c9-writing-portability-note">Your file contains private writing. Keep it in a trusted location; importing never automatically overwrites current work.</p>'+
 '</section>';
 const links='<details class="c9-writing-catalog" '+(session.catalogOpen?'open':'')+'><summary>Choose a P43 original composition topic · '+P43_UNITS.length+' units</summary>'+
 p43Overview(act,esc,{selected:unit.id,filter:session.filter||'all',query:session.query||''})+'</details>';
 const pending=session.pending?'<section class="c9-writing-pending" role="alert"><h2>Confirm what happens to the unsent draft</h2>'+
 '<p>'+(session.pending==='discard'?'Discard this tab’s draft and snapshot history?':
 session.pending.startsWith('restore:')?'Replace the active editor text with the selected snapshot?':
 session.pending==='import'?'Replace the current in-tab writing with the selected private backup ('+
 esc(session.importCandidate?.unitId||'unknown unit')+', '+
 (session.importCandidate?.revisions?.length||0)+' snapshots)? The current draft and revisions will be lost unless exported first.':
 'Switching source contexts would replace the current tab-local composition. Copy your writing first if you want to keep it.')+'</p>'+
 '<div>'+act('p43-stay',session.pending==='import'?'Cancel import':'Keep current writing','c9-button c9-button--secondary')+
 act('p43-switch-confirm','Confirm change','c9-button c9-button--primary')+'</div></section>':'';
 const studio=p43ProductionStudio(unit,act,esc,{
  draft:session.draft||'',revisions:session.revisions||[],compare:session.compare??-1,
  reveal:session.reveal||false,step:session.step||'plan',
  rubric:session.rubric||[],pending:'',showEvidence:session.showEvidence||false
 });
 const active=validTransfer?transferPanel(state,session,act,esc):'';
 return '<div class="c9-writing-workspace">'+info+backup+links+pending+active+studio+
 '<p class="c9-writing-footer">No HSK-certified proficiency, essay score, speech recording, AI evaluation or fabricated source is claimed. In this tab, source hints and model reveals are assistance, not grade evidence.</p></div>';
}


/**
 * Ephemeral P43 composition controller — no new persistence/learner state.
 * Reading, dialogue, fixed-sentence events remain delegated to app.mjs.
 */
export const c9WritingState={
 unitId:P43_UNITS[0].id,transferPhase:0,sourceId:null,draft:'',revisions:[],
 compare:-1,reveal:false,step:'plan',rubric:[],pending:'',pendingTarget:null,
 showEvidence:false,transferModels:false,transferReview:[],
 filter:'all',query:'',catalogOpen:false,importCandidate:null,importError:''
};
const writingHasWork=()=>Boolean(c9WritingState.draft.trim()||c9WritingState.revisions.length);
const resetWriting=({unitId=P43_UNITS[0].id,phase=0,sourceId=null}={})=>{
 const w=c9WritingState;
 Object.assign(w,{unitId,transferPhase:Number(phase),sourceId,draft:'',revisions:[],
  compare:-1,reveal:false,step:'plan',rubric:[],pending:'',pendingTarget:null,
  showEvidence:false,transferModels:false,transferReview:[],importCandidate:null,importError:''});
};
export function openC9WritingSource(phase,sourceId,{go,alertUser}){
 const unit=c9WritingLinkedUnit(phase,sourceId);
 if(!unit){alertUser('No historical P43 writing source is linked to this material.','error');return false;}
 return requestC9Writing({unitId:unit.id,phase:Number(phase),sourceId},{go});
}
function requestC9Writing(target,{go}){
 const w=c9WritingState;
 if(!findP43Unit(target.unitId))return false;
 const changed=w.unitId!==target.unitId||w.transferPhase!==Number(target.phase||0)||
  w.sourceId!==(target.sourceId||null);
 if(changed&&writingHasWork()){w.pending='switch';w.pendingTarget=target;}
 else if(changed)resetWriting(target);
 else{w.pending='';w.pendingTarget=null;}
 go('writing');return true;
}

/** C9-30: portable P43 editorial export only. NO browser storage, network,
 * learner database, autosave, background writes, or grading authority.
 * Reading imported data never mutates an existing session until confirmation.
 */
const C9_WRITING_BACKUP_FORMAT='thiepn-chinese-p43-writing';
const C9_WRITING_BACKUP_MAX_BYTES=420000;
const C9_WRITING_TEXT_MAX=42000;
function createC9WritingBackup(w){
 return {
  format:C9_WRITING_BACKUP_FORMAT,version:1,exportedAt:new Date().toISOString(),
  unitId:w.unitId,transferPhase:w.transferPhase,sourceId:w.sourceId,
  draft:w.draft,revisions:[...w.revisions],compare:w.compare,
  step:w.step,rubric:[...w.rubric],showEvidence:!!w.showEvidence,
  reveal:!!w.reveal,transferModels:!!w.transferModels,
  transferReview:[...w.transferReview]
 };
}
function parseC9WritingBackup(raw){
 if(typeof raw!=='string'||new Blob([raw]).size>C9_WRITING_BACKUP_MAX_BYTES)
  throw Error('Backup exceeds the 420 KB local import limit.');
 const b=JSON.parse(raw);
 if(!b||b.format!==C9_WRITING_BACKUP_FORMAT||b.version!==1)
  throw Error('Not a supported C9 P43 writing backup.');
 if(!findP43Unit(b.unitId))throw Error('The original P43 writing unit does not exist.');
 const phase=Number(b.transferPhase||0),sourceId=b.sourceId||null;
 if(![0,43,48,50,51].includes(phase)||phase!==0&&
   c9WritingLinkedUnit(phase,sourceId)?.id!==b.unitId)
  throw Error('The backup source does not match the original P43 unit.');
 if(typeof b.draft!=='string'||b.draft.length>C9_WRITING_TEXT_MAX||
   !Array.isArray(b.revisions)||b.revisions.length>12||
   b.revisions.some(t=>typeof t!=='string'||t.length>C9_WRITING_TEXT_MAX))
  throw Error('Backup draft or revision content is invalid.');
 const compare=Number(b.compare);
 const step=['plan','compose','revise','speak'].includes(b.step)?b.step:'compose';
 const rubric=Array.isArray(b.rubric)?b.rubric.filter(id=>
  P43_REVIEW_CRITERIA.some(c=>c.id===id)).slice(0,12):[];
 const allowed=transferSets[phase]?.criteria||[];
 const reviews=Array.isArray(b.transferReview)?b.transferReview.filter(key=>
  typeof key==='string'&&allowed.some(c=>phase+':'+c.id===key)).slice(0,18):[];
 return {unitId:b.unitId,phase,sourceId,draft:b.draft,
  revisions:b.revisions.slice(),compare:Number.isInteger(compare)&&compare>=0&&
   compare<b.revisions.length?compare:-1,step,rubric,showEvidence:!!b.showEvidence,
  reveal:!!b.reveal,transferModels:!!b.transferModels,transferReview:reviews};
}
export async function handleC9WritingBackupFile(e,{render,alertUser}){
 if(e.target.id!=='c9-writing-backup-file')return false;
 const file=e.target.files?.[0];e.target.value='';
 if(!file)return true;
 const w=c9WritingState;
 try{
  if(file.size>C9_WRITING_BACKUP_MAX_BYTES)throw Error('File exceeds the 420 KB writing backup limit.');
  const candidate=parseC9WritingBackup(await file.text());
  w.importCandidate=candidate;w.importError='';w.pending='import';w.pendingTarget=null;
  render();
 }catch(err){
  w.importCandidate=null;w.pending='';w.importError=err instanceof Error?
   err.message:'The writing file could not be read.';
  render();alertUser(w.importError,'error');
 }
 return true;
}

export function hasC9UncopiedWriting(){
 const w=c9WritingState;
 return Boolean(w.draft.trim()||w.revisions.length);
}
export function handleC9WritingInput(e,root){
 const w=c9WritingState;
 if(e.target.id==='p43-draft'){
  w.draft=e.target.value;
  const status=root.querySelector('.p43-draft-status');
  if(status){
   const count=Array.from(w.draft).filter(ch=>/\p{Script=Han}/u.test(ch)).length;
   const label=status.querySelector('span');
   if(label)label.textContent=count+' Hanzi characters · in-tab draft only';
  }
  for(const a of ['p43-save','p43-copy']){
   const button=root.querySelector('[data-action="'+a+'"]');
   if(button)button.disabled=!w.draft.trim();
  }
  return true;
 }
 if(e.target.id==='p43-search'){
  w.query=e.target.value;const q=w.query.toLocaleLowerCase().trim();
  for(const button of root.querySelectorAll('.p43-catalog .p43-unit')){
   const u=findP43Unit(button.dataset.id);
   const match=!u||!q||[u.title,u.theme,u.goal,u.sourceClaim,u.misconception]
    .join(' ').toLocaleLowerCase().includes(q);
   button.hidden=!match||(w.filter!=='all'&&u.stage!==Number(w.filter));
  }
  return true;
 }
 return false;
}
/**
 * Returns true only for handled writing actions. No automatic grading.
 * api exposes the existing native app handlers, not a duplicate engine.
 */
export async function handleC9WritingAction(button,api){
 const name=button.dataset.action,id=button.dataset.id,w=c9WritingState;
 const {go,render,alertUser,speak,act,setWorkshopTask,openAdvanced,rememberHandoff}=api;
 // P43 authorial teaching crosslinks use the original native handlers, but
 // retain a source-scoped path back to this exact in-tab composition.
 if(api.currentRoute?.()==='writing'&&(name==='grammar-select'||name==='lookup-word')){
  rememberHandoff(name==='grammar-select'?'grammar':'explore',id);
  return false;
 }
 if(name==='c9-writing-backup-export'){
  if(!writingHasWork())return true;
  const text=JSON.stringify(createC9WritingBackup(w),null,2);
  if(new Blob([text]).size>C9_WRITING_BACKUP_MAX_BYTES){
   alertUser('Backup exceeds the local export limit. Copy the text instead.','error');return true;
  }
  let url=null;
  try{
   url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));
   const anchor=document.createElement('a');
   anchor.href=url;anchor.download='chinese-writing-'+w.unitId+'-'+
    new Date().toISOString().slice(0,10)+'.json';
   anchor.style.display='none';document.body.appendChild(anchor);anchor.click();anchor.remove();
   alertUser('Backup download requested. Keep the private JSON file somewhere safe.');
  }catch{alertUser('File export is not available in this browser. Copy your writing manually.','error');}
  finally{if(url)setTimeout(()=>URL.revokeObjectURL(url),1200);}
  return true;
 }
 if(name==='c9-writing-source')return openC9WritingSource(Number(button.dataset.phase),id,api);
 if(name==='c9-writing-models'){
  if(c9WritingTransfer(w.transferPhase,w.sourceId)){w.transferModels=!w.transferModels;render();}
  return true;
 }
 if(name==='c9-writing-criterion'){
  const phase=Number(button.dataset.phase),source=c9WritingTransfer(phase,w.sourceId);
  const values=transferSets[phase]?.criteria||[];
  if(phase!==w.transferPhase||!source||!values.some(x=>x.id===id))return true;
  const key=phase+':'+id;
  w.transferReview=w.transferReview.includes(key)?
   w.transferReview.filter(x=>x!==key):[...w.transferReview,key];
  render();return true;
 }
 if(name==='c9-writing-native'){
  const native=c9WritingNativeReference(w.transferPhase,w.sourceId);
  const kind=button.dataset.kind;
  if(!native||native[kind]?.id!==id){
   alertUser('The original linked activity is unavailable.','error');return true;
  }
  if(kind==='story'){rememberHandoff('stories',id);await act({dataset:{action:'c9-media-open-story',id}});}
  if(kind==='dialogue'){rememberHandoff('dialogues',id);await act({dataset:{action:'c9-media-open-dialogue',id}});}
  if(kind==='task'){rememberHandoff('workshop',id);setWorkshopTask(id,Boolean(w.transferModels||w.reveal||w.showEvidence));}
  return true;
 }
 if(name==='p43-enter'){go('writing');return true;}
 if(name==='p43-filter'){
  if(['all','1','2','3'].includes(button.dataset.filter)){
   w.filter=button.dataset.filter;w.catalogOpen=true;render();
  }
  return true;
 }
 if(name==='p43-open'||name==='p43-next'){
  const u=name==='p43-open'?findP43Unit(id):
   P43_UNITS[(P43_UNITS.findIndex(x=>x.id===w.unitId)+1)%P43_UNITS.length];
  if(u)requestC9Writing({unitId:u.id,phase:0,sourceId:null},api);
  return true;
 }
 if(name==='p43-stay'){w.pending='';w.pendingTarget=null;w.importCandidate=null;w.importError='';render();return true;}
 if(name==='p43-switch-confirm'){
  if(w.pending==='import'&&w.importCandidate){
   const b=w.importCandidate;
   resetWriting({unitId:b.unitId,phase:b.phase,sourceId:b.sourceId});
   Object.assign(w,{draft:b.draft,revisions:[...b.revisions],compare:b.compare,
    step:b.step,rubric:[...b.rubric],showEvidence:b.showEvidence,
    reveal:b.reveal,transferModels:b.transferModels,transferReview:[...b.transferReview]});
  }else if(w.pending==='discard'){
   resetWriting({unitId:w.unitId,phase:w.transferPhase,sourceId:w.sourceId});
  }else if(w.pending.startsWith('restore:')){
   const index=Number(w.pending.slice(8));
   if(Number.isInteger(index)&&w.revisions[index]!==undefined){
    w.draft=w.revisions[index];w.step='revise';
   }
   w.pending='';w.pendingTarget=null;
  }else if(w.pending==='switch'&&w.pendingTarget){
   resetWriting(w.pendingTarget);
  }else{w.pending='';w.pendingTarget=null;}
  render();return true;
 }
 if(name==='p43-step'){
  if(['plan','compose','revise','speak'].includes(button.dataset.step)){
   w.step=button.dataset.step;render();
  }
  return true;
 }
 if(name==='p43-evidence'){w.showEvidence=!w.showEvidence;render();return true;}
 if(name==='p43-reveal'){w.reveal=!w.reveal;render();return true;}
 if(name==='p43-save'){
  if(!w.draft.trim())return true;
  if(w.revisions.at(-1)===w.draft){alertUser('Current text matches the latest in-tab snapshot.');return true;}
  if(w.revisions.length>=12){alertUser('Snapshot limit reached. Copy your text before replacing versions.','error');return true;}
  w.revisions.push(w.draft);w.compare=w.revisions.length-1;w.step='revise';render();return true;
 }
 if(name==='p43-copy'){
  if(!w.draft.trim())return true;
  try{await navigator.clipboard.writeText(w.draft);
   alertUser('Your writing was copied; no proficiency score was created.');
  }catch{alertUser('Clipboard unavailable. Select the text in the editor and copy manually.','error');}
  return true;
 }
 if(name==='p43-discard'){
  if(writingHasWork()){w.pending='discard';w.pendingTarget=null;render();}
  return true;
 }
 if(name==='p43-version'){
  const i=Number(button.dataset.version);
  if(Number.isInteger(i)&&i>=0&&i<w.revisions.length){w.compare=i;render();}
  return true;
 }
 if(name==='p43-restore'){
  const i=Number(button.dataset.version);
  if(Number.isInteger(i)&&i>=0&&i<w.revisions.length&&w.draft!==w.revisions[i]){
   w.pending='restore:'+i;w.pendingTarget=null;render();
  }
  return true;
 }
 if(name==='p43-criterion'){
  if(P43_REVIEW_CRITERIA.some(x=>x.id===id)){
   w.rubric=w.rubric.includes(id)?w.rubric.filter(x=>x!==id):[...w.rubric,id];render();
  }
  return true;
 }
 if(name==='p43-model-audio'){
  const u=findP43Unit(w.unitId);
  if(u)speak(u.lines.map(x=>x.hanzi).join(' '));
  return true;
 }
 if(name==='p43-workshop'){
  const u=findP43Unit(w.unitId),i=Number(button.dataset.line);
  if(!u||![4,9].includes(i))return true;
  const taskId='p43:'+u.id+':line'+i;
  rememberHandoff('workshop',taskId);
  setWorkshopTask(taskId,Boolean(w.reveal||w.showEvidence||w.transferModels));
  return true;
 }
 if(name==='p41-open'||name==='p42-open'){
  if(name==='p41-open'){
   const story=STORIES.find(x=>x.beginner?.p41?.id===id);
   if(story){rememberHandoff('stories',story.id);await act({dataset:{action:'c9-media-open-story',id:story.id}});return true;}
  }else{
   const dialogue=DIALOGUES.find(x=>x.p42?.id===id);
   if(dialogue){rememberHandoff('dialogues',dialogue.id);await act({dataset:{action:'c9-media-open-dialogue',id:dialogue.id}});return true;}
  }
  alertUser('Referenced original reading or conversation unavailable.','error');return true;
 }
 if(name==='p44-open'||name==='p45-open'){
  rememberHandoff('advanced',id);openAdvanced(name==='p44-open'?44:45,id);return true;
 }
 return false;
}
