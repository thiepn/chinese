/** P53 learner-facing evidence synthesis. All persisted learning attempts go
 * exclusively through the original Reader, Dialogue and Sentence Workshop.
 */
import {P53_CASES,P53_SELF_REVIEW} from './p53-course.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
export const P53_STAGES=Object.freeze([
 {id:'sources',label:'1 · Read & reconcile sources'},
 {id:'debate',label:'2 · Listen & challenge'},
 {id:'argument',label:'3 · Build an independent argument'},
 {id:'transfer',label:'4 · Revise in two registers'}
].map(x=>Object.freeze(x)));
export const p53Story=c=>STORIES.find(s=>s.beginner?.p53?.id===c.id)||null;
export const p53NativeDialogue=c=>DIALOGUES.find(d=>d.p53?.caseId===c.id)||null;
export function p53Evidence(state,c){
 const story=p53Story(c),dialogue=p53NativeDialogue(c);
 const reading=(state.readingEvents||[]).filter(x=>x.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(x=>x.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(x=>x.taskId?.startsWith('p53:argument:'+c.id+':')||
  x.taskId==='beginner-reading:'+story?.id+':writing');
 return {story,dialogue,reading,listening,writing};
}
export function p53Next(state,after=null){
 const i=P53_CASES.findIndex(c=>c.id===after);
 const order=i<0?P53_CASES:[...P53_CASES.slice(i+1),...P53_CASES.slice(0,i+1)];
 return order.find(c=>{const x=p53Evidence(state,c);
  return x.reading.length<3||x.listening.length<3;
 })||order.find(c=>{const x=p53Evidence(state,c);
  return [x.reading.at(-1),x.listening.at(-1)].some(e=>e&&(!e.correct||e.assisted));
 })||order[0];
}
const status=items=>!items.length?'Not attempted':items.at(-1).correct?
 (items.at(-1).assisted?'Latest correct with assistance':'Latest independently correct'):
 'Latest answer incorrect';
function feedback(q,ref,r,esc){
 return !r?'':'<div class="p53-feedback" role="status"><strong>'+
 (r.revealed?'Reference revealed · no attempt recorded':r.correct?
 (r.assisted?'Correct with support':'Correct independently'):'Incorrect · compare the original evidence')+'</strong>'+
 '<p>Reference answer: '+esc(q.answer)+'</p>'+
 '<p><strong>Source evidence:</strong> '+esc(ref)+'</p><p>'+esc(q.explanation)+'</p></div>';
}
export function p53Overview(state,act,esc,{query='',selected=''}={}){
 const term=query.trim().toLocaleLowerCase();
 const cases=P53_CASES.filter(c=>[c.title,c.theme,c.goal,c.objection,c.pitfall,
  ...c.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(term));
 const next=p53Next(state);
 return '<section class="p53-overview" aria-label="P53 source investigation index">'+
 '<header><p class="eyebrow">P53 · ORIGINAL ADVANCED INDEPENDENT ARGUMENTATION</p>'+
 '<h2>Defend what the evidence warrants—not what the headline promises.</h2>'+
 '<p>Four original 16-sentence multi-source dossiers, 32 multi-speaker turns, 24 canonical evidence questions, twelve bilingual exact-form models, and independent writing and speaking transfer.</p>'+
 '<p class="muted">Advanced editorial practice, not an official HSK level, professional certification or automatic essay/speech grade.</p>'+
 act('p53-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</header>'+
 '<label for="p53-search">Search case, Mandarin phrase, or source issue</label>'+
 '<input id="p53-search" type="search" value="'+esc(query)+'" placeholder="causation, access, consent, version, 因果">'+
 '<div class="p53-case-grid">'+cases.map(c=>{const e=p53Evidence(state,c);
  return act('p53-open','<small>CASE '+c.sequence+' · '+esc(c.theme)+'</small>'+
   '<strong>'+esc(c.title)+'</strong><span>'+esc(c.goal)+'</span>'+
   '<em>Reader: '+status(e.reading)+' · Listening: '+status(e.listening)+
   ' · '+e.writing.length+' exact-form attempts</em>',
  'p53-case '+(selected===c.id?'active':''),'data-id="'+c.id+'"');
 }).join('')+'</div>'+(cases.length?'':'<p>No original case matches this search.</p>')+
 '<div class="p53-actions">'+act('p52-return','P52 source investigation →','button outline')+
 act('p53-due','Original scheduled Review →','button outline')+'</div></section>';
}
export function p53Lesson(c,state,act,esc,{stage='sources',readingIndex=0,listeningIndex=0,
 readingHelp=false,listeningHelp=false,models=false,readingFeedback=null,listeningFeedback=null,checks=[]}={}){
 if(!c)return '';
 const e=p53Evidence(state,c),rq=c.questions[readingIndex],dq=c.dialogueQuestions[listeningIndex],
 picked=new Set(checks);
 return '<section class="p53-lesson" aria-label="P53 original source synthesis">'+
 '<header class="p53-heading"><p class="eyebrow">P53 · CASE '+c.sequence+' / '+P53_CASES.length+'</p>'+
 '<h2>'+esc(c.title)+'</h2><p>'+esc(c.goal)+'</p>'+
 '<p class="muted">Four separate fictional source records · '+c.lines.length+' connected bilingual sentences · '+c.turns.length+' spoken turns</p>'+
 act('p53-next','Different case →','button outline')+'</header>'+
 '<nav class="p53-stages" aria-label="Independent argumentation stages">'+P53_STAGES.map(s=>
  act('p53-stage',esc(s.label),'p53-stage '+(stage===s.id?'active':''),'data-stage="'+s.id+
  '" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='sources'?'<div class="p53-pane"><h3>Identify source scope before answering</h3>'+
 '<p>Which record states a rule, which is an observation, which is still a proposal, and which is an interpretation?</p>'+
 '<div class="p53-source-grid">'+c.sources.map(src=>
 '<article class="p53-source"><header><small>RECORD '+(src.index+1)+'</small><h4>'+esc(src.name)+'</h4></header>'+
 src.lines.map((line,j)=>'<div class="p53-source-line"><span>'+(src.start+j+1)+'</span><div>'+
 '<p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 (readingHelp?'<small>'+esc(line.pinyin)+'</small><p>'+esc(line.english)+'</p>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(line.hanzi)+'"')+'</div>').join('')+
 '</article>').join('')+'</div>'+
 '<div class="p53-actions">'+act('p53-reading-help',readingHelp?'Hide bilingual support':
 'Show Pinyin and English · assisted','button outline')+
 act('p53-native-read','Open canonical Reader →','button outline')+'</div>'+
 '<section class="p53-question"><h4>Original Reader evidence '+(readingIndex+1)+' / '+c.questions.length+'</h4>'+
 '<p>'+esc(rq.prompt)+'</p>'+
 (readingFeedback?feedback(rq,'Record '+(c.lines[rq.evidenceIndex].sourceIndex+1)+
  ', sentence '+(rq.evidenceIndex+1)+': '+c.lines[rq.evidenceIndex].hanzi+' · '+
  c.lines[rq.evidenceIndex].english,readingFeedback,esc)+
 '<div class="p53-actions">'+act('p53-reader-next',readingIndex+1<c.questions.length?
 'Next source question →':'Continue to oral challenge →','button primary')+
 act('p53-reader-retry','Try independently again','button outline')+'</div>':
 '<div class="p53-choices">'+rq.options.map(option=>
 act('p53-reader-answer',esc(option),'choice','data-option="'+esc(option)+'"')).join('')+'</div>'+
 '<div class="p53-actions">'+act('p53-reader-model','Reveal answer without submitting','button outline')+
 act('p53-stage','Skip to listening','button outline','data-stage="debate"')+'</div>')+'</section></div>':'')+
 (stage==='debate'?'<div class="p53-pane"><h3>Hear the strongest objection—and its limits</h3>'+
 '<p>Listen first, then distinguish an observable claim, an alternative explanation, and a correction. Device speech is synthetic, not a human recording or scored pronunciation.</p>'+
 '<div class="p53-actions">'+act('p53-play','Play complete dialogue','button primary')+
 act('p53-slow','Replay slowly','button outline')+
 act('p53-listening-help',listeningHelp?'Hide transcript':'Show bilingual transcript · assisted','button outline')+
 act('p53-native-listen','Native Dialogue practice →','button outline')+'</div>'+
 '<div class="p53-turns">'+c.turns.map((t,i)=>'<article class="p53-turn"><strong>'+esc(t.speaker)+'</strong>'+
 '<div>'+(listeningHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small>'+esc(t.pinyin)+'</small>'+
 '<p>'+esc(t.english)+'</p>':'<p class="muted">Turn '+(i+1)+' · Determine this speaker’s evidence or objection.</p>')+'</div>'+
 act('p53-turn','Hear '+(i+1),'button outline small','data-index="'+i+'"')+'</article>').join('')+'</div>'+
 '<section class="p53-question"><h4>Original Dialogue evidence '+(listeningIndex+1)+' / '+c.dialogueQuestions.length+'</h4>'+
 '<p>'+esc(dq.prompt)+'</p>'+
 (listeningFeedback?feedback(dq,'Turn '+(dq.evidenceIndex+1)+' · '+c.turns[dq.evidenceIndex].speaker+
 ': '+c.turns[dq.evidenceIndex].hanzi+' · '+c.turns[dq.evidenceIndex].english,listeningFeedback,esc)+
 '<div class="p53-actions">'+act('p53-listener-next',listeningIndex+1<c.dialogueQuestions.length?
 'Next oral evidence →':'Build your argument →','button primary')+
 act('p53-listener-retry','Retry without support','button outline')+'</div>':
 '<div class="p53-choices">'+dq.options.map(option=>
 act('p53-listener-answer',esc(option),'choice','data-option="'+esc(option)+'"')).join('')+'</div>'+
 '<div class="p53-actions">'+act('p53-listener-model','Reveal reference, no response event','button outline')+
 act('p53-stage','Continue to argument','button outline','data-stage="argument"')+'</div>')+'</section></div>':'')+
 (stage==='argument'?'<div class="p53-pane"><h3>Independent four-part source-backed argument</h3>'+
 '<p>Write the argument yourself in the original P43 drafting studio; this stage provides a brief, not a supplied essay. No free response is silently checked or saved as a grade.</p>'+
 '<div class="p53-argument-grid">'+[
 ['1 · Grounded thesis',c.goal],
 ['2 · Fair counterargument',c.objection],
 ['3 · Source reconciliation','Use records 1–4 to show which assertion each record can and cannot support. Distinguish evidence from the draft summary.'],
 ['4 · Qualified conclusion',c.pitfall]
 ].map(([name,copy])=>'<article><h4>'+esc(name)+'</h4><p>'+esc(copy)+'</p></article>').join('')+'</div>'+
 '<div class="p53-source-ledger"><h4>Evidence ledger: do not merge different authorities</h4>'+
 c.sources.map(src=>'<p><strong>Record '+(src.index+1)+': '+esc(src.name)+'</strong> — '+
 esc(src.lines[0].english)+' <em>What is still not established by this document?</em></p>').join('')+'</div>'+
 '<p><strong>Counterargument repair:</strong> '+esc(c.pitfall)+'</p>'+
 '<p><strong>Source cross-check:</strong> '+esc(c.formalTask)+'</p>'+
 '<div class="p53-actions">'+act('p53-p43','Draft and revise independently in P43 →','button primary')+
 act('p53-stage','Proceed to two-register transfer →','button outline','data-stage="transfer"')+'</div>'+
 '<p class="muted">The original P43 draft editor is tab-local. Its unsaved drafts are not study records or a durable backup. Copy important work before leaving or reloading.</p></div>':'')+
 (stage==='transfer'?'<div class="p53-pane"><h3>Reframe the same facts, not the source authority</h3>'+
 '<div class="p53-transfer-grid"><article><h4>Formal report or institutional notice</h4><p>'+esc(c.formalTask)+
 '</p><p>State source, effective scope, evidence limit, and a measured conclusion.</p></article>'+
 '<article><h4>Conversational spoken response</h4><p>'+esc(c.informalTask)+
 '</p><p>Explain naturally without turning a possibility into a guarantee.</p></article></div>'+
 '<p>Produce your own formal and informal Mandarin versions first. Speak both aloud. Do not treat device playback as your own pronunciation assessment.</p>'+
 '<div class="p53-actions">'+act('p53-p43','Continue original P43 multi-draft writing →','button primary')+
 act('p53-models',models?'Hide original model sentences':'Show original bilingual models after drafting','button outline')+'</div>'+
 (models?'<div class="p53-models">'+c.models.map((m,i)=>'<article><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><p>'+esc(m.english)+'</p><p>'+esc(m.purpose)+'</p>'+
 act('p53-write','Native exact-form reconstruction '+(i+1)+' →','button outline small','data-index="'+i+'"')+'</article>').join('')+'</div>':'')+
 '<h4>Independent self-review (tab-only, not a grade)</h4>'+
 '<div class="p53-check-grid">'+P53_SELF_REVIEW.map(x=>
 act('p53-check',(picked.has(x.id)?'✓ ':'○ ')+esc(x.label),
 'p53-check '+(picked.has(x.id)?'selected':''),'data-id="'+x.id+'" aria-pressed="'+picked.has(x.id)+'"')).join('')+'</div>'+
 '<p>'+picked.size+' / '+P53_SELF_REVIEW.length+' self-checks marked this tab; no mastery credit awarded.</p>'+
 '<div class="p53-actions">'+act('p53-next','Transfer to another source context →','button primary')+
 act('p53-prior','Revisit related P52 dossier →','button outline','data-id="'+esc(c.priorCase)+'"')+'</div></div>':'')+
 '<footer class="p53-history"><h4>Actual original learner history</h4>'+
 '<p>Reader: '+e.reading.length+' submissions · Dialogue: '+e.listening.length+
 ' submissions · exact-form sentence: '+e.writing.length+' submissions</p>'+
 '<p>Assistance is distinguished from independently correct submissions. Free writing, conversation and HSK proficiency are not automatically assessed.</p>'+
 '<div class="p53-actions">'+act('p53-due','Scheduled Review →','button outline')+
 act('p53-prior','Original P52 context →','button outline','data-id="'+esc(c.priorCase)+'"')+'</div></footer></section>';
}
