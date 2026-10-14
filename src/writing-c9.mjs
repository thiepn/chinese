/**
 * C9-27 — Authored independent Mandarin writing, native source continuity.
 * P43 remains the ONLY open-ended authoring experience. This is a presentation
 * adapter around its original studio, not a second essay engine or state store.
 * The app owns one ephemeral tab-local draft, original libraries own evidence.
 */
import {P43_UNITS,findP43Unit} from './p43-course.mjs';
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
   'data-kind="workshop" data-id="'+esc(source.task.id)+'"'):''
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
 '<p class="c9-writing-privacy">Your unsent draft and explicit snapshots exist only in this open tab. Copy them outside the app to retain them after closing or refreshing; none is saved to learner progress.</p>'+
 '<div class="c9-writing-intro-links"><a href="#/advanced">Original Advanced Course</a><a href="#/stories">Original Readings</a><a href="#/workshop">Native Sentence Workshop</a></div></section>';
 const links='<details class="c9-writing-catalog"><summary>Choose a P43 original composition topic · '+P43_UNITS.length+' units</summary>'+
 p43Overview(act,esc,{selected:unit.id,filter:session.filter||'all',query:session.query||''})+'</details>';
 const pending=session.pending?'<section class="c9-writing-pending" role="alert"><h2>Confirm what happens to the unsent draft</h2>'+
 '<p>'+(session.pending==='discard'?'Discard this tab’s draft and snapshot history?':
 session.pending.startsWith('restore:')?'Replace the active editor text with the selected snapshot?':
 'Switching source contexts would replace the current tab-local composition. Copy your writing first if you want to keep it.')+'</p>'+
 '<div>'+act('p43-stay','Keep current writing','c9-button c9-button--secondary')+
 act('p43-switch-confirm','Confirm change','c9-button c9-button--primary')+'</div></section>':'';
 const studio=p43ProductionStudio(unit,act,esc,{
  draft:session.draft||'',revisions:session.revisions||[],compare:session.compare??-1,
  reveal:session.reveal||false,step:session.step||'plan',
  rubric:session.rubric||[],pending:'',showEvidence:session.showEvidence||false
 });
 const active=validTransfer?transferPanel(state,session,act,esc):'';
 return '<div class="c9-writing-workspace">'+info+links+pending+active+studio+
 '<p class="c9-writing-footer">No HSK-certified proficiency, essay score, speech recording, AI evaluation or fabricated source is claimed. In this tab, source hints and model reveals are assistance, not grade evidence.</p></div>';
}
