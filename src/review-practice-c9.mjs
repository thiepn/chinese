/**
 * C9-08 — native Review & Practice presentation.
 * No grading, scheduling or persistence is implemented here. The existing app
 * owns the in-memory review queue, authoritative event writers, and persisted
 * guided practice session.
 */
import {dueCards,cardInfo,summary} from './study.mjs';
import {reviewPlan} from './review-strategy.mjs';
import {makeOptions} from './exercises.mjs';
import {practiceSummary} from './practice-records.mjs';

const focusOptions=Object.freeze([
 ['all','All due skills'],['weak','Prioritize weaker skills'],
 ['meanings','Character and word meanings'],['pronunciation','Pinyin and tones'],
 ['sentences','Sentence comprehension']
]);
const family=info=>info.kind==='pinyin'?'PRONUNCIATION & TONES':
 info.kind==='choice'?'SENTENCE COMPREHENSION':
 info.type==='meaning'?'CHARACTER MEANING':'VOCABULARY MEANING';
const count=(n)=>Number.isFinite(n)?Math.max(0,n):0;
const progress=(done,total,label)=>{
 const value=total?Math.min(100,Math.round(100*done/total)):0;
 return '<div class="c9-assessment-progress"><div><span>'+label+'</span><strong>'+done+' / '+total+'</strong></div>'+
 '<div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+value+'%"></span></div></div>';
};
const stat=(n,label)=>'<div class="c9-assessment-stat"><strong>'+count(n)+'</strong><span>'+label+'</span></div>';
const title=(eyebrow,name,desc)=>'<header class="c9-assessment-title"><p class="c9-eyebrow">'+eyebrow+'</p>'+
 '<h1>'+name+'</h1><p>'+desc+'</p></header>';
const link=(route,text)=>'<a href="#/'+route+'" class="c9-button c9-button--secondary">'+text+'</a>';

export function renderC9Review({
 state,queue=null,focus='all',size=10,done=0,correct=0,skipped=0,
 revealed=false,response='',selected='',result=null,action,esc,toneTeachingPanel,
 reviewWorkspace
}){
 const due=dueCards(state),overview=summary(state);
 const filtered=due.filter(id=>{
  const info=cardInfo(id);
  if(!info)return false;
  if(focus==='pronunciation')return info.kind==='pinyin';
  if(focus==='meanings')return info.kind==='meaning';
  if(focus==='sentences')return info.kind==='choice';
  return true;
 });
 const subnote='<p class="c9-assessment-disclaimer">The original demonstration scheduler is uncalibrated. Independent correct answers are observations, not certified mastery.</p>';
 if(queue===null){
  const plan=reviewPlan(state,{now:Date.now(),focus,limit:Math.min(4,size)});
  const why=plan.map(item=>'<li><strong>'+esc(item.family)+'</strong><span>'+esc(item.reason)+'</span></li>').join('');
  return '<div class="c9-assessment c9-review-setup">'+
    title('SCHEDULED RECALL · SETUP','Review what is due','Choose a source-backed focus and a manageable queue. Skipping does not grade or reschedule a card.')+
    '<div class="c9-assessment-stats">'+stat(due.length,'Currently due prompts')+stat(overview.cards,'Registered review targets')+
      stat(overview.successful,'Correct independent attempts')+'</div>'+
    '<div class="c9-assessment-columns"><section class="c9-assessment-panel" aria-labelledby="c9-review-settings-title">'+
     '<p class="c9-eyebrow">PERSONAL SESSION</p><h2 id="c9-review-settings-title">Set your focus</h2>'+
     '<div class="c9-assessment-selects"><label for="review-focus">Recall focus<select id="review-focus">'+
      focusOptions.map(([id,label])=>'<option value="'+id+'"'+(focus===id?' selected':'')+'>'+label+'</option>').join('')+
      '</select></label><label for="review-size">Session length<select id="review-size">'+[5,10,20,50].map(n=>
      '<option value="'+n+'"'+(size===n?' selected':'')+'>Up to '+n+' prompts</option>').join('')+'</select></label></div>'+
     '<p class="c9-assessment-note">'+filtered.length+' due prompt'+(filtered.length===1?'':'s')+' match this focus. Unanswered or skipped prompts remain due.</p>'+
     '<div class="c9-assessment-actions">'+action('review-begin','Begin scheduled review →','c9-button c9-button--primary',filtered.length?'':'disabled')+
     link('learn','Study new material')+'</div>'+
    '</section><section class="c9-assessment-panel c9-assessment-plan" aria-labelledby="c9-review-priority-title">'+
    '<p class="c9-eyebrow">EXISTING QUEUE PRIORITIES</p><h2 id="c9-review-priority-title">Why these come first</h2>'+
    (why?'<ol class="c9-assessment-reasons">'+why+'</ol>':
      '<div class="c9-empty"><strong>No due prompts for this focus</strong><p>You can introduce another source lesson or select a different skill. No grades have been fabricated.</p></div>')+
    '<p class="c9-assessment-note">Keyboard: 1–4 for choices, Enter to check, S to skip. Grading follows original app controls.</p></section></div>'+
    '<details class="c9-assessment-extra"><summary>Study recommendations and existing Review tools</summary><div>'+reviewWorkspace(state,action,esc)+'</div></details>'+
    subnote+'</div>';
 }
 if(!queue.length){
  return '<div class="c9-assessment c9-review-complete">'+
   title('REVIEW · FINISHED','Session finished','The individual answers you graded were saved by the original scheduler. Skips were not graded.')+
   '<div class="c9-assessment-stats">'+stat(done,'Graded responses')+stat(correct,'Correct independent responses')+
    stat(skipped,'Skipped prompts')+stat(due.length,'Still due')+'</div>'+
   '<section class="c9-assessment-panel c9-assessment-finish"><h2>Choose what comes next</h2><p>Repeat with another focus, return to your original lessons, or practise contextual reading. Results do not certify proficiency.</p>'+
   '<div class="c9-assessment-actions">'+action('review-restart','Set up another review →','c9-button c9-button--primary')+
   link('learn','Learn')+link('stories','Read in context')+'</div></section>'+subnote+'</div>';
 }
 const id=queue[0],c=cardInfo(id);
 if(!c)return '<div class="c9-empty"><strong>Review source unavailable</strong><p>Return to Review setup without awarding an answer.</p>'+
 action('review-restart','Back to setup','c9-button c9-button--secondary')+'</div>';
 const choices=c.kind==='choice'?makeOptions(c.answer,'sentence',c.lesson.id):[];
 const total=done+skipped+queue.length;
 const details=(!revealed?
   '<div class="c9-assessment-response"><p class="c9-assessment-note">Answer first. Pronunciation and reference meanings remain hidden until you check or explicitly reveal them.</p>'+
   (c.kind==='choice'?'<div class="choice-list c9-assessment-choices" role="group" aria-label="Choose sentence meaning">'+choices.map((opt,i)=>
     '<button type="button" class="choice'+(selected===opt?' selected':'')+'" data-action="review-pick" data-option="'+esc(opt)+'" aria-pressed="'+(selected===opt)+'"><span>'+String.fromCharCode(65+i)+'</span>'+esc(opt)+'</button>').join('')+'</div>':
   '<div class="answer-entry c9-assessment-entry"><label for="review-entry">'+(c.kind==='pinyin'?'Type full Pinyin with tone marks or numbers':'Type the English meaning')+'</label>'+
   '<input id="review-entry" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+esc(response)+
   '" placeholder="'+(c.kind==='pinyin'?'For example, nǐ or ni3':'Type your answer without hints')+'"></div>')+
   '<div class="c9-assessment-actions">'+action('submit-review','Check answer','c9-button c9-button--primary',
      (c.kind==='choice'?!selected:!response.trim())?'disabled':'')+
   action('reveal-review','Reveal reference (assisted)','c9-button c9-button--secondary')+
   action('review-skip','Skip without grading','c9-button c9-button--quiet')+'</div></div>':
   '<div class="review-answer c9-assessment-feedback '+(result?.correct?'correct':'incorrect')+'" role="status" aria-live="polite">'+
    '<p class="c9-eyebrow">'+(result?.correct?'INDEPENDENT ANSWER ACCEPTED':'LEARNING FEEDBACK')+'</p>'+
    '<h3>'+(result?.correct?'Correct response':'Compare with the source')+'</h3>'+
    '<p>'+esc(result?.message||'Review this answer.')+'</p>'+
    (response||selected?'<p>Your response: <strong>'+esc(response||selected)+'</strong></p>':'')+
    '<p>Reference: <strong>'+esc(c.answer)+'</strong></p>'+
    (c.reading?'<p class="c9-assessment-reading">'+esc(c.reading)+'</p>':'')+
    (c.kind==='pinyin'?toneTeachingPanel(c.answer,result?.reason||''):'')+
    action('speak','Listen with device voice','c9-button c9-button--secondary c9-button--small','data-text="'+esc(c.prompt)+'"')+
    '<div class="c9-assessment-actions">'+(result?.correct?
      action('grade','Good · next','c9-button c9-button--primary','data-grade="2"')+
      action('grade','Easy · next','c9-button c9-button--secondary','data-grade="3"'):
      action('grade','Again · next','c9-button c9-button--primary','data-grade="0"'))+
    '</div><p class="c9-assessment-note">Only the native grading action writes review history. Reveals are assisted, never independent correct.</p></div>');
 return '<div class="c9-assessment c9-review-active">'+
  title('ACTIVE SCHEDULED RECALL','Recall before revealing','One original due card at a time. Your queue is local to this open session; it is not a saved resumable task.')+
  '<div class="c9-assessment-panel c9-assessment-live"><div class="c9-assessment-queue"><span>QUESTION '+(done+skipped+1)+' OF '+total+'</span>'+
  '<span>'+queue.length+' remaining · '+correct+' independent correct</span></div>'+
  progress(done+skipped,total,'Current review session')+
  '<div class="c9-assessment-question"><p class="c9-eyebrow">'+family(c)+'</p>'+
  '<p class="c9-assessment-hanzi" lang="zh-Hans">'+esc(c.prompt)+'</p><h2>'+esc(c.question)+'</h2></div>'+
  details+'</div>'+
  '<div class="c9-assessment-endnote"><span>Leaving this page preserves graded history, but not the ungraded in-memory queue.</span>'+
  link('learn','Back to lessons')+'</div>'+subnote+'</div>';
}

export function renderC9PracticeHeader(state){
 const guide=state.practiceSession;
 const drill=practiceSummary(state);
 const progressText=guide?
  (guide.cursor>=guide.limit?'All guided questions answered':'Guided session at question '+(guide.cursor+1)+' of '+guide.limit):
  'No saved guided session in progress';
 return '<header class="c9-assessment-title"><p class="c9-eyebrow">PRACTICE LAB · SUPPLEMENTARY</p>'+
 '<h1>Practise with purpose</h1><p>Choose a standalone exercise or continue a source-linked guided session. This work never changes scheduled-review grades.</p></header>'+
 '<div class="c9-assessment-stats">'+
 stat(drill.attempts,'Standalone practice attempts')+stat(drill.independentCorrect,'Correct unassisted drill attempts')+
 stat(guide?guide.cursor:0,'Saved guided answers')+'</div>'+
 '<div class="c9-practice-continuity"><div><strong>'+(guide?'Saved session available':'Build a guided practice session')+'</strong>'+
 '<p>'+progressText+'. Guided answers and their cursor are saved after successful checks; individual standalone drill answers use existing supplemental records.</p></div>'+
 '<a class="c9-button c9-button--secondary" href="#/review">Scheduled review →</a></div>';
}
