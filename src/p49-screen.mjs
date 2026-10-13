/** P49 learner-first cumulative recall, misconception repair and native
 * source handoff; all original grading remains in Dialogue/Sentence/Review.
 */
import {P49_CASES,P49_FOCUS_GROUPS} from './p49-course.mjs';
import {p49Evidence,p49Recommendations,p49Totals} from './p49-review.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {dueCards} from './study.mjs';
export const P49_STAGES=Object.freeze([
 Object.freeze({id:'sources',label:'Trace evidence'}),
 Object.freeze({id:'meaning',label:'Repair meaning'}),
 Object.freeze({id:'listen',label:'Listen & retrieve'}),
 Object.freeze({id:'write',label:'Write & speak'}),
 Object.freeze({id:'repair',label:'Review returns'})
]);
const stateOf=answer=>!answer?'Not attempted':
 answer.correct?(answer.assisted?'Correct with help':'Last correct independently'):'Last incorrect';
const earlierAction=c=>'p'+c.sourceType.slice(1)+'-open';
export function p49Overview(state,act,esc,{compact=false,selected='',filter='all'}={}){
 const totals=p49Totals(state),results=p49Recommendations(state);
 const filtered=results.filter(r=>filter==='all'||
  filter==='needs'&&(r.evidence.difficult.length||r.evidence.priorProblem.length)||
  filter==='unseen'&&!r.evidence.ownEvents.length||
  filter==='reviewed'&&r.evidence.byQuestion.some(q=>q.independentlyCorrect));
 const next=filtered[0]||results[0];
 return '<section class="p49-overview" aria-label="P49 original cumulative independent transfer">'+
 '<div class="p49-hero"><p class="eyebrow">P49 · HSK 4-TARGETED ORIGINAL CUMULATIVE TRANSFER</p>'+
 '<h2>Revisit real evidence. Repair the exact misunderstanding. Transfer independently.</h2>'+
 '<p>Twelve original cases with 72 contextual Mandarin turns, 36 independent native Dialogue questions and 24 exact bilingual source response tasks. Each case leads back to its existing P44–P48 original authority, supported grammar, native writing and the original review queue.</p>'+
 '<p class="muted">Statuses reflect the existing event history and genuine due cards, not a second mastery engine or official HSK certificate.</p>'+
 '<div class="p49-summary">'+
 '<span><strong>'+totals.attempted+' / '+totals.cases+'</strong> cases attempted</span>'+
 '<span><strong>'+totals.independentReferenceAnswers+' / 36</strong> questions ever answered correctly without help (not mastery)</span>'+
 '<span><strong>'+totals.due+'</strong> genuinely due cards globally</span>'+
 '</div>'+
 (next?act('p49-open','Continue: '+esc(next.caseItem.title)+' →','button primary','data-id="'+next.caseItem.id+'"'):'')+
 '</div>'+
 (compact?act('p49-enter','Open cumulative independent transfer →','button outline'):
 '<nav class="p49-filters" aria-label="Native evidence filters">'+[
  ['all','All 12'],['needs','Difficult returns'],['unseen','Not started'],['reviewed','Independent answers']
 ].map(([id,label])=>act('p49-filter',label,'p49-filter '+(filter===id?'active':''),
 'data-filter="'+id+'" aria-pressed="'+(filter===id)+'"')).join('')+'</nav>'+
 '<div class="p49-cases">'+filtered.map(r=>{
 const c=r.caseItem,e=r.evidence;
 return act('p49-open','<small>CASE '+c.sequence+' · '+esc(c.theme)+'</small>'+
 '<strong>'+esc(c.title)+'</strong><span>'+esc(r.reason)+'</span>'+
 '<em>Prior source: '+esc(c.sourceId)+' · '+e.difficult.length+' difficult native questions · '+
 e.unattempted.length+' not yet attempted · '+e.writing.length+' original exact-form events</em>',
 'p49-case '+(selected===c.id?'active':''),'data-id="'+c.id+'"');
 }).join('')+'</div>'+(!filtered.length?'<p class="muted">No original P49 case matches this evidence filter.</p>':'')+
 '<div class="p49-actions">'+act('p49-review','Open genuine due cards in original Review →','button outline')+
 act('p48-enter','P48 advanced source comparison →','button outline')+'</div>')+'</section>';
}
export function p49Lesson(c,state,act,esc,{stage='sources',showSource=false,showTranscript=false,
 showModels=false,questionIndex=0,feedback=null}={}){
 if(!c)return '';
 const evidence=p49Evidence(state,c),g=GRAMMAR_LESSONS.find(x=>x.id===c.grammarId);
 const source=c.linked,q=c.questions[questionIndex],history=evidence.byQuestion[questionIndex];
 const latest=history?.event;
 const words=[...(c.linked?.focusWord?[c.linked.focusWord]:[])].filter(w=>w?.hanzi&&w?.pinyin);
 const nativeSourceLines=c.sourceType==='p44'||c.sourceType==='p45'?source?.turns:source?.lines;
 const selectedSource=Array.isArray(nativeSourceLines)?nativeSourceLines:[];
 return '<section class="p49-lesson" aria-label="Original cumulative lesson">'+
 '<header class="p49-heading"><div><p class="eyebrow">P49 · CASE '+c.sequence+' / '+P49_CASES.length+
 ' · '+esc(c.theme)+'</p><h2>'+esc(c.title)+'</h2>'+
 '<p>'+esc(c.contrast)+'</p></div>'+act('p49-next','Next difficult case →','button outline')+'</header>'+
 '<nav class="p49-stages" aria-label="Cumulative skill stages">'+P49_STAGES.map(s=>
 act('p49-stage',esc(s.label),'p49-stage '+(stage===s.id?'active':''),
 'data-stage="'+s.id+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='sources'?'<div class="p49-pane"><h3>1. Identify and reopen the authoritative original source</h3>'+
 '<p>This original P49 scenario connects to <strong>'+esc(c.sourceId)+'</strong> rather than copying or rewriting its assessment or learner record.</p>'+
 '<article class="p49-source"><h4>'+esc(source?.title||'Linked original learning source')+'</h4>'+
 '<p>'+esc(source?.goal||source?.theme||c.contrast)+'</p>'+
 '<div class="p49-actions">'+act(earlierAction(c),'Study original '+esc(c.sourceId)+' →',
 'button primary','data-id="'+esc(c.sourceId)+'"')+
 act('p49-source-help',showSource?'Hide source assistance':'Reveal original source lines · assisted','button outline')+'</div>'+
 (showSource?selectedSource.slice(0,10).map((l,i)=>
 '<div class="p49-line"><span>'+(i+1)+'</span><div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 '<small>'+esc(l.pinyin)+'</small><span>'+esc(l.english)+'</span></div></div>').join(''):'')+'</article>'+
 '<p>Return here to compare the original record with the new scenario before answering independently.</p>'+
 '<div class="p49-actions">'+act('p49-stage','Continue to meaning contrasts →','button primary','data-stage="meaning"')+'</div></div>':'')+
 (stage==='meaning'?'<div class="p49-pane"><h3>2. Repair a specific meaning distinction</h3>'+
 '<div class="p49-contrast"><strong>Do not confuse these claims</strong><p>'+esc(c.contrast)+'</p></div>'+
 '<p>Focus on the statement the evidence proves, what remains proposed, and what additional confirmation would be required.</p>'+
 (g?'<article class="p49-grammar"><h4>'+esc(g.title)+' · '+esc(g.pattern)+'</h4>'+
 '<p>'+esc(g.explanation)+'</p><p><strong>Meaning contrast:</strong> '+esc(g.contrast)+'</p>'+
 '<p><strong>Common mistake:</strong> '+esc(g.pitfall)+'</p>'+
 g.examples.slice(0,2).map(l=>'<div class="p49-model"><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 '<small>'+esc(l.pinyin)+'</small><span>'+esc(l.english)+'</span></div>').join('')+
 act('grammar-select','Practise the original grammar lesson →','button outline small','data-id="'+g.id+'"')+'</article>':'')+
 words.map(w=>'<div class="p49-actions">'+act('lookup-word','Study '+esc(w.hanzi)+' in original Wordbook →',
 'button outline','data-id="'+esc(canonicalWordKey(w.hanzi,w.pinyin))+'"')+'</div>').join('')+
 '<div class="p49-actions">'+act('p49-stage','Continue to independent listening →','button primary','data-stage="listen"')+'</div></div>':'')+
 (stage==='listen'?'<div class="p49-pane"><h3>3. Listen, retrieve, then justify your choice</h3>'+
 '<p>Read neither the transcript nor the reference response before answering if you want an independent attempt. Device-generated audio is not a native-speaker recording.</p>'+
 '<div class="p49-actions">'+act('p49-play','Listen to original conversation','button primary')+
 act('p49-play-slow','Replay more slowly','button outline')+
 act('p49-transcript',showTranscript?'Hide transcript':'Reveal full bilingual transcript · assisted','button outline')+'</div>'+
 c.turns.map((t,i)=>'<div class="p49-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (showTranscript?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small>'+esc(t.pinyin)+'</small><span>'+esc(t.english)+'</span>':
 '<p>Listen to the speaker. Identify the evidence rather than guessing from the scenario title.</p>')+'</div>'+
 act('p49-hear-turn','Hear '+(i+1),'button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p49-quiz"><h4>Canonical dialogue question '+(questionIndex+1)+' / '+c.questions.length+'</h4>'+
 '<p>'+esc(q?.prompt||'')+'</p><p class="p49-status">Previous native result: '+esc(stateOf(latest))+'</p>'+
 (feedback?'<div class="p49-feedback" role="status"><strong>'+(
 feedback.revealed?'Reference revealed, no answer recorded':feedback.correct?
 feedback.assisted?'Correct with assistance':'Correct native answer':'Incorrect native answer')+'</strong>'+
 '<p>Reference: '+esc(q.answer)+'</p><p><strong>Evidence turn '+(q.evidenceTurn+1)+':</strong></p>'+
 '<p lang="zh-Hans">'+esc(c.turns[q.evidenceTurn]?.hanzi||'')+'</p>'+
 '<small>'+esc(c.turns[q.evidenceTurn]?.pinyin||'')+'</small>'+
 '<p>'+esc(c.turns[q.evidenceTurn]?.english||'')+'</p><p>'+esc(q.explanation)+'</p>'+
 '</div><div class="p49-actions">'+act('p49-question-next',questionIndex+1<c.questions.length?
 'Next independent question →':'Continue to production →','button primary')+
 act('p49-question-retry','Try again','button outline')+'</div>':
 '<div class="p49-options">'+(q?.options||[]).map(o=>
 act('p49-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p49-actions">'+act('p49-reveal','Reveal source reference · assisted','button outline')+
 act('p49-stage','Continue without an answer →','button outline','data-stage="write"')+'</div>')+'</div></div>':'')+
 (stage==='write'?'<div class="p49-pane"><h3>4. Reconstruct and then express independently</h3>'+
 '<p><strong>Independent writing:</strong> '+esc(c.writing)+'</p>'+
 '<p><strong>Independent speaking:</strong> '+esc(c.oral)+'</p>'+
 '<p>First write or say the response in your own words. Then use the original Sentence Workshop to reconstruct an exact authored model. Free writing and speaking are self-reviewed, never automatically certified.</p>'+
 '<div class="p49-actions">'+act('p49-writing-models',showModels?'Hide bilingual models':'Reveal bilingual source responses · assisted','button outline')+
 act('p43-enter','Independent multi-paragraph P43 writing →','button outline')+'</div>'+
 (showModels?c.models.map((m,i)=>'<article class="p49-model"><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><span>'+esc(m.english)+'</span>'+
 '<p><strong>Why:</strong> '+esc(m.purpose)+'</p></article>').join(''):'')+
 c.models.map((m,i)=>'<div class="p49-transfer">'+
 '<span>Independent retrieval model '+(i+1)+': '+esc(m.english)+'</span>'+
 act('p49-write','Reconstruct exact source form →','button primary','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p49-actions">'+act('p49-stage','Review genuine difficult items →','button primary','data-stage="repair"')+'</div></div>':'')+
 (stage==='repair'?'<div class="p49-pane"><h3>5. Target real mistakes and return to the source</h3>'+
 '<p>These suggestions are derived from actual Reader, Dialogue, and Sentence Workshop attempts; they do not set due dates, erase old answers or fabricate proficiency.</p>'+
 '<div class="p49-repair-grid"><div><h4>P49 native evidence</h4>'+
 evidence.byQuestion.map(x=>'<div class="p49-repair-item"><strong>Question '+(x.index+1)+'</strong>'+
 '<p>'+esc(stateOf(x.event))+'</p>'+
 '<p>'+esc(x.needsRepair?'A wrong or assisted answer: return without the transcript.':
 !x.event?'This question has not been attempted yet.':
 'An independent correct reference answer exists; this is not mastery.')+'</p>'+
 act('p49-retry-question','Open question '+(x.index+1)+' →','button outline small',
 'data-index="'+x.index+'"')+'</div>').join('')+'</div>'+
 '<div><h4>Linked original records</h4>'+
 '<p>Original reading: '+esc(stateOf(evidence.historicalReading))+'</p>'+
 '<p>Original dialogue: '+esc(stateOf(evidence.historicalDialogue))+'</p>'+
 '<p>Exact P49 model attempts: '+evidence.writing.length+'</p>'+
 '<p>Genuine due cards in your original Review queue: '+dueCards(state).length+'</p>'+
 '<div class="p49-actions">'+act(earlierAction(c),'Return to original '+esc(c.sourceId)+' →','button outline',
 'data-id="'+esc(c.sourceId)+'"')+
 act('p49-review','Open canonical due Review →','button primary')+
 act('p49-next','Continue to next evidence-based case →','button outline')+'</div></div></div></div>':'')+
 '<aside class="p49-footer"><p>Original source '+esc(c.sourceId)+' · '+evidence.ownEvents.length+
 ' canonical P49 dialogue answer events · '+evidence.writing.length+
 ' exact sentence events. These counts do not grade your independent essay or speech.</p>'+
 '<div class="p49-actions">'+act(earlierAction(c),'Source →','button outline small',
 'data-id="'+esc(c.sourceId)+'"')+act('p48-enter','P48 argumentation →','button outline small')+
 act('p45-enter','P45 source recall →','button outline small')+
 act('p49-review','Original scheduled Review →','button outline small')+'</div></aside>'+
 '</section>';
}
