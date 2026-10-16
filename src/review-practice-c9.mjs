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
const cardFamily=(info)=>info.type==='reading'||info.type.startsWith('wordread')?'pronunciation':
 info.type==='sentence'?'sentences':'meanings';
const latestCardEvent=(state,id)=>[...(state.events||[])].reverse().find(e=>e.cardId===id);
const experienceNote=(info,result,esc)=>{
 const last=result?.reason;
 const correction=last==='tone'?'The syllables match, but a tone or a boundary does not. Say each syllable aloud and compare the marked vowels.':
  last==='syllables'?'The syllable spelling differs. Check the initial, final and syllable boundaries before practising its tone.':
  last==='format'?'Enter complete Pinyin with numbered tones or tone marks. A bare romanization may hide an incorrect tone.':
  last==='choice'?'Compare the whole Chinese sentence with the intended English interpretation, not just one familiar word.':
  last==='meaning'?'Compare the complete English sense. Related but different meanings are not accepted by the native exact evaluator.':
  last==='assisted'?'A revealed reference is study assistance. This attempt cannot receive independent-success credit.':
  result?.correct?'Independent recall was checked against the original reference. The next grade is recorded only after you choose it.':
  'Use the source explanation and the reference to identify the mismatch.';
 return '<div class="c9-review-source-context"><p class="c9-eyebrow">SOURCE-BASED REPAIR</p>'+
  '<p>'+esc(correction)+'</p>'+
  '<dl><div><dt>Original lesson</dt><dd>'+esc(info.lesson.hanzi)+' · '+esc(info.lesson.pinyin)+' · '+esc(info.lesson.meaning)+'</dd></div>'+
  '<div><dt>Teaching context</dt><dd>'+esc(info.lesson.note||'Use the source lesson to review the character in context.')+'</dd></div>'+
  (info.type==='sentence'?'<div><dt>Original translation</dt><dd>'+esc(info.lesson.sentence.english)+'</dd></div>':'')+
  '</dl></div>';
};
const progress=(done,total,label)=>{
 const value=total?Math.min(100,Math.round(100*done/total)):0;
 return '<div class="c9-assessment-progress"><div><span>'+label+'</span><strong>'+done+' / '+total+'</strong></div>'+
 '<div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+Math.min(total,Math.max(0,done))+'"><span style="width:'+value+'%"></span></div></div>';
};
const stat=(n,label)=>'<div class="c9-assessment-stat"><strong>'+count(n)+'</strong><span>'+label+'</span></div>';
const title=(eyebrow,name,desc)=>'<header class="c9-assessment-title"><p class="c9-eyebrow">'+eyebrow+'</p>'+
 '<h1>'+name+'</h1><p>'+desc+'</p></header>';
const link=(route,text)=>'<a href="#/'+route+'" class="c9-button c9-button--secondary">'+text+'</a>';

export function renderC9Review({
 state,queue=null,focus='all',size=10,done=0,correct=0,skipped=0,paused=false,invalidated=0,
 revealed=false,response='',selected='',result=null,action,esc,toneTeachingPanel,
 reviewWorkspace
}){
 const due=dueCards(state),overview=summary(state);
 const filtered=due.filter(id=>{
  const info=cardInfo(id);
  if(!info)return false;
  if(focus==='pronunciation'||focus==='meanings'||focus==='sentences')return cardFamily(info)===focus;
  return true;
 });
 const subnote='<p class="c9-assessment-disclaimer c9-unified-source-note">The original demonstration scheduler is uncalibrated. Independent correct answers are observations, not certified mastery.</p>';
 if(queue===null){
  const plan=reviewPlan(state,{now:Date.now(),focus,limit:Math.min(50,size)});
  const why=plan.slice(0,5).map((item,i)=>{
    const info=cardInfo(item.id),last=latestCardEvent(state,item.id);
    return '<li><div><span class="c9-review-reason-number">'+(i+1)+'</span><strong>'+
      esc(info?.prompt||item.family)+'</strong></div><span>'+esc(item.reason)+
      (last?' · '+(last.assisted?'Prior assistance recorded':last.correct===false?'Prior miss recorded':'Prior graded answer'):'')+
      '</span></li>';
  }).join('');
  return '<div class="c9-assessment c9-review-setup">'+
    title('SCHEDULED RECALL','Review what is due','Review the prompts due now, or practise independently without changing their schedule.')+
    '<div class="c9-assessment-stats">'+stat(due.length,'Due now')+stat(overview.cards,'Registered recall targets')+
      stat(overview.successful,'Independent correct attempts')+'</div>'+
    '<section class="c9-assessment-panel c9-unified-card c9-review-start" aria-labelledby="c9-review-start-title">'+
    '<p class="c9-eyebrow">READY WHEN YOU ARE</p><h2 id="c9-review-start-title">'+
      (filtered.length?'Start with '+Math.min(filtered.length,size)+' original prompts':'No scheduled prompts match this focus')+'</h2>'+
    '<p class="c9-assessment-note">'+(filtered.length?'Review uses your original due cards. You choose each grade; opening this page does not record progress.':
       'Your review queue is clear for this focus. You can practise freely or study another original lesson.')+'</p>'+
    '<div class="c9-assessment-actions c9-unified-actions">'+
     (filtered.length?action('review-begin','Review now →','c9-button c9-button--primary'):
       link('practice','Practise without scheduling →'))+
     (filtered.length?link('practice','Practise freely'):link('learn','Open next lesson'))+
     (filtered.length?link('learn','Browse lessons'):'')+'</div>'+
    '<details class="c9-review-options"><summary>Change focus or session length <span>'+
       esc(focusOptions.find(([key])=>key===focus)?.[1]||'All due skills')+' · up to '+size+' prompts</span></summary>'+
     '<div class="c9-review-options-body"><div class="c9-assessment-selects"><label for="review-focus">Recall focus<select id="review-focus">'+
      focusOptions.map(([id,label])=>'<option value="'+id+'"'+(focus===id?' selected':'')+'>'+label+'</option>').join('')+
      '</select></label><label for="review-size">Session length<select id="review-size">'+[5,10,20,50].map(n=>
      '<option value="'+n+'"'+(size===n?' selected':'')+'>Up to '+n+' prompts</option>').join('')+'</select></label></div>'+
     '<p class="c9-assessment-note">'+filtered.length+' due prompt'+(filtered.length===1?'':'s')+
       ' match this focus. '+plan.length+' enter this session; unanswered and skipped prompts remain due.</p>'+
     '<div class="c9-review-skill-overview" aria-label="Due prompts by skill">'+
      [['meanings','Meaning'],['pronunciation','Pinyin'],['sentences','Sentences']].map(([key,label])=>
       '<div><strong>'+due.filter(id=>cardFamily(cardInfo(id))===key).length+'</strong><span>'+label+'</span></div>').join('')+
      '</div></div></details>'+
    '<details class="c9-review-priorities"><summary>Why these prompts come first</summary>'+
     '<div class="c9-review-options-body">'+(why?'<ol class="c9-assessment-reasons">'+why+'</ol>':
      '<p>No due prompts for the selected focus. No substitute grades or tasks are created.</p>')+
     '<p class="c9-assessment-note">Keyboard: 1–4 for choices, Enter to check, S to skip. Only the original grade buttons reschedule cards.</p>'+
     '</div></details></section>'+
    '<details class="c9-assessment-extra"><summary>Study recommendations and other Review tools</summary><div>'+reviewWorkspace(state,action,esc)+'</div></details>'+
    subnote+'</div>';
 }
 if(paused&&queue.length){
  const next=cardInfo(queue[0]);
  return '<div class="c9-assessment c9-review-paused">'+
   title('REVIEW · PAUSED IN THIS TAB','Your queue is still here','This is an in-tab pause, not persistent session storage. A browser reload discards only the remaining ungraded queue; native graded history stays saved.')+
   '<div class="c9-assessment-stats">'+stat(queue.length,'Prompts remaining')+
    stat(done,'Graded in this session')+stat(skipped,'Skipped, not graded')+'</div>'+
   '<section class="c9-assessment-panel c9-unified-card c9-review-resume"><p class="c9-eyebrow">NEXT ORIGINAL PROMPT</p>'+
    '<h2>'+(next?esc(next.prompt):'Next due prompt')+'</h2>'+
    '<p>Focus: '+esc(focusOptions.find(([key])=>key===focus)?.[1]||'All due skills')+
    '. Pausing preserves your current answer in this tab. A reload discards only the ungraded session, not saved grades.</p>'+
    (invalidated?'<p class="c9-assessment-note">'+invalidated+' card(s) became unavailable or were already reviewed in another tab. No grade was invented.</p>':'')+
    '<div class="c9-assessment-actions c9-unified-actions">'+
     action('review-resume','Resume original queue →','c9-button c9-button--primary')+
     action('review-stop','Discard remaining queue','c9-button c9-button--secondary')+
     link('practice','Open Practice Lab')+'</div></section>'+subnote+'</div>';
 }
 if(!queue.length){
  return '<div class="c9-assessment c9-review-complete">'+
   title('REVIEW · FINISHED','Session finished','The individual answers you graded were saved by the original scheduler. Skips were not graded.')+
   '<div class="c9-assessment-stats">'+stat(done,'Graded responses')+stat(correct,'Correct independent responses')+
    stat(skipped,'Skipped prompts')+stat(due.length,'Still due')+'</div>'+ 
   (invalidated?'<p class="c9-assessment-note">'+invalidated+' outdated queue item(s) were ignored without grading after a state refresh.</p>':'')+
   '<section class="c9-assessment-panel c9-unified-card c9-assessment-finish"><h2>Choose what comes next</h2><p>Repeat with another focus, return to your original lessons, or practise contextual reading. Results do not certify proficiency.</p>'+
   '<div class="c9-assessment-actions c9-unified-actions">'+action('review-restart','Set up another review →','c9-button c9-button--primary')+
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
   '<div class="c9-assessment-actions c9-unified-actions">'+action('submit-review','Check answer','c9-button c9-button--primary',
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
    experienceNote(c,result,esc)+
    action('open-lesson','Study the original lesson (no grade)','c9-button c9-button--quiet c9-button--small','data-id="'+esc(c.lesson.id)+'"')+
    action('speak','Listen with device voice','c9-button c9-button--secondary c9-button--small','data-text="'+esc(c.prompt)+'"')+
    '<div class="c9-assessment-actions c9-unified-actions">'+(result?.correct?
      action('grade','Good · next','c9-button c9-button--primary','data-grade="2"')+
      action('grade','Easy · next','c9-button c9-button--secondary','data-grade="3"'):
      action('grade','Again · next','c9-button c9-button--primary','data-grade="0"'))+
    '</div><p class="c9-assessment-note">Only the native grading action writes review history. Reveals are assisted, never independent correct.</p></div>');
 return '<div class="c9-assessment c9-review-active">'+
  title('ACTIVE SCHEDULED RECALL','Recall before revealing','Only an explicit native grade changes the card schedule. This queue survives in-tab navigation, but not reloading or closing the tab.')+
  '<div class="c9-assessment-panel c9-unified-card c9-assessment-live"><div class="c9-assessment-queue"><span>QUESTION '+(done+skipped+1)+' OF '+total+'</span>'+
  '<span>'+queue.length+' remaining · '+correct+' independent correct</span></div>'+
  progress(done+skipped,total,'Current review session')+
  '<div class="c9-assessment-question"><p class="c9-eyebrow">'+family(c)+'</p>'+
  '<p class="c9-assessment-hanzi" lang="zh-Hans">'+esc(c.prompt)+'</p><h2>'+esc(c.question)+'</h2></div>'+
  details+'</div>'+
  '<div class="c9-assessment-endnote"><span>'+(invalidated?invalidated+' stale card(s) omitted without grading. ':'')+'Leaving this screen retains the in-tab queue. Unsubmitted answers are not saved across a reload.</span>'+
  '<div class="c9-assessment-actions">'+action('review-pause','Pause and keep queue','c9-button c9-button--secondary')+link('learn','Back to lessons')+'</div></div>'+subnote+'</div>';
}

export function renderC9PracticeHeader(state,action,esc){
 const guide=state.practiceSession,drill=practiceSummary(state);
 const recent=[...(state.drillEvents||[])].reverse().slice(0,3);
 const guideActive=Boolean(guide&&guide.cursor<guide.limit);
 return title('PRACTICE LAB · SUPPLEMENTARY','Practise with purpose',
  'Choose an original exercise or return to a saved guided checkpoint. Supplemental answers never change scheduled-review intervals.')+
 '<div class="c9-assessment-stats">'+stat(drill.attempts,'Recorded standalone attempts')+
  stat(drill.independentCorrect,'Independent correct drills')+
  stat(guide?guide.cursor+Number(Boolean(guide.feedback)):0,'Recorded guided responses')+'</div>'+
 '<section class="c9-practice-continuity" aria-label="Practice recovery"><div>'+
  '<p class="c9-eyebrow">'+(guide?'PERSISTED GUIDED SESSION':'START A SOURCE-BASED SESSION')+'</p>'+
  '<strong>'+(guide?guideActive?'Guided practice · question '+(guide.cursor+1)+' of '+guide.limit:
   'Guided practice · all '+guide.limit+' questions answered':'Build a guided practice session')+'</strong>'+
  '<p>'+(guide?'Already recorded answers are saved in original local learner data. An unsubmitted response is not saved.':
   'Choose a learning focus below. Only independently attempted original questions produce records.')+'</p></div>'+
  '<div class="c9-practice-continuity-actions">'+
   (guide?action('c9-practice-jump',guideActive?'Open saved question →':'Review finished session →',
    'c9-button c9-button--primary','data-target="c9-native-guided"'):
    action('c9-practice-jump','Choose a session →','c9-button c9-button--primary','data-target="c9-native-guided"'))+
   link('review','Scheduled Review →')+'</div></section>'+
 (recent.length?'<div class="c9-practice-history" aria-label="Recent genuine drill attempts"><strong>Last recorded drills</strong><div>'+
  recent.map(e=>'<span>'+esc(e.mode.replaceAll('-',' '))+' · '+(e.assisted?'Assisted':e.correct?'Independent correct':'Incorrect')+'</span>').join('')+
  '</div></div>':'');
}
/** Source-linked choices scroll to the existing native players; they do not submit or simulate answers. */
export function renderC9PracticePaths(state,action){
 if(state.practiceSession)return '';
 return '<section class="c9-practice-paths" aria-label="Choose a genuine practice activity">'+
 '<div><p class="c9-eyebrow">CHOOSE YOUR WORKSPACE</p><h2>Three ways to practise</h2></div>'+
 '<div class="c9-practice-path-grid">'+
 '<article class="c9-unified-card"><span class="c9-eyebrow">01 · CONTINUOUS</span><h3>Guided mixed session</h3><p>Make multiple decisions, receive immediate feedback, and resume after an app restart from the saved checkpoint.</p>'+
 action('c9-practice-jump','Choose guided focus →','c9-button c9-button--primary','data-target="c9-native-guided"')+'</article>'+
 '<article class="c9-unified-card"><span class="c9-eyebrow">02 · FOCUSED</span><h3>Standalone original drills</h3><p>Practise meanings, tones, word order, and sentence choices. Attempts are recorded separately from scheduled review.</p>'+
 action('c9-practice-jump','Find an exercise →','c9-button c9-button--secondary','data-target="c9-native-drills"')+'</article>'+
 '<article class="c9-unified-card"><span class="c9-eyebrow">03 · DUE FIRST</span><h3>Scheduled recall</h3><p>Review genuinely due cards using the original grading and scheduling authority, not these supplemental exercises.</p>'+
 link('review','Review due cards →')+'</article></div></section>';
}
export function renderC9GuidedStep(state,esc){
 const g=state.practiceSession;
 if(!g)return '';
 const done=Math.min(g.cursor,g.limit),saved=done+Number(Boolean(g.feedback));
 const correct=g.correct+Number(Boolean(g.feedback?.correct&&!g.feedback?.assisted));
 const assisted=g.assisted+Number(Boolean(g.feedback?.assisted));
 const percent=g.limit?Math.round(100*saved/g.limit):0;
 return '<div class="c9-guided-checkpoint" role="group" aria-label="Saved guided checkpoint">'+
  '<div><span class="c9-eyebrow">AUTHENTIC LEARNER CHECKPOINT</span><strong>'+
  (done>=g.limit?'All saved questions answered':'Question '+(done+1)+' / '+g.limit)+'</strong></div>'+
  '<div class="c9-guided-checkpoint-track" role="progressbar" aria-label="Questions with saved answers" aria-valuemin="0" aria-valuemax="'+g.limit+'" aria-valuenow="'+done+'">'+
   '<span style="width:'+percent+'%"></span></div>'+
  '<div class="c9-guided-checkpoint-detail"><span>'+saved+' recorded answers</span>'+
  '<span>'+correct+' independently correct</span><span>'+assisted+' assisted</span></div>'+
  '<p>Responses persist only after the original check is saved; unfinished input is local to this open screen. A hint or reveal marks the next response assisted.</p>'+
  '</div>';
}
