/** P52 native cross-source editorial journey; presentation only.
 * The original Reader, Dialogue and Sentence Workshop own persisted attempts.
 */
import {P52_CASES,P52_DIALOGUES} from './p52-course.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
export const P52_STAGES=Object.freeze([
 Object.freeze({id:'records',label:'Compare source records'}),
 Object.freeze({id:'hearing',label:'Hear opposing interpretations'}),
 Object.freeze({id:'revision',label:'Defend a revised conclusion'})
]);
export const p52Story=c=>STORIES.find(s=>s.beginner?.p52?.id===c.id)||null;
export const p52NativeDialogue=c=>DIALOGUES.find(d=>d.p52?.caseId===c.id)||null;
export function p52Evidence(state,c){
 const story=p52Story(c),dialogue=p52NativeDialogue(c);
 const reading=(state.readingEvents||[]).filter(x=>x.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(x=>x.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(x=>x.taskId?.startsWith('p52:source:'+c.id+':')||
 x.taskId==='beginner-reading:'+story?.id+':writing');
 return {story,dialogue,reading,listening,writing};
}
export function p52Next(state,from=null){
 const i=P52_CASES.findIndex(x=>x.id===from);
 const order=i<0?P52_CASES:[...P52_CASES.slice(i+1),...P52_CASES.slice(0,i+1)];
 return order.find(c=>{const e=p52Evidence(state,c);return [e.reading.at(-1),e.listening.at(-1)].some(x=>x&&(!x.correct||x.assisted));})||
 order.find(c=>{const e=p52Evidence(state,c);return !e.reading.length||!e.listening.length;})||order[0];
}
function sourceLine(l,i,show,act,esc){
 return '<div class="p52-line"><span class="p52-number">'+(i+1)+'</span>'+
 '<div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (show?'<small>'+esc(l.pinyin)+'</small><p>'+esc(l.english)+'</p>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>';
}
function feedbackPanel(question,reference,feedback,esc){
 if(!feedback)return '';
 return '<div class="p52-feedback" role="status"><strong>'+
 (feedback.revealed?'Reference revealed · no attempt saved':feedback.correct?
 (feedback.assisted?'Correct with help':'Correct independently'):'Incorrect · compare the evidence')+'</strong>'+
 '<p>'+esc(question.answer)+'</p><p><strong>Source reference:</strong> '+esc(reference)+'</p>'+
 '<p>'+esc(question.explanation)+'</p></div>';
}
export function p52Overview(state,act,esc,{selected='',query=''}={}){
 const q=query.trim().toLocaleLowerCase(),next=p52Next(state);
 const results=P52_CASES.filter(c=>[c.title,c.theme,c.scenario,c.goal,...c.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const label=events=>!events.length?'No attempt':events.at(-1).correct?
 (events.at(-1).assisted?'Assisted correct':'Independent correct'):'Latest incorrect';
 return '<section class="p52-overview"><header><p class="eyebrow">P52 · INDEPENDENT CROSS-SOURCE SYNTHESIS</p>'+
 '<h2>Read the records. Challenge the conclusion. Repair the language.</h2>'+
 '<p>Four original multi-record Mandarin dossiers, 36 fully translated source sentences, four multi-speaker hearings, 24 source-evidence questions and eight exact-form models. Compare genuine differences between fictional independent classroom records without inventing facts.</p>'+
 '<p class="muted">Authorial HSK 5-targeted transition, not official HSK material, automatic essay grading or assessed speech.</p>'+
 act('p52-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</header>'+
 '<label for="p52-search">Find a source comparison case</label><input id="p52-search" type="search" value="'+esc(query)+'" placeholder="registration, revision, delivery, evidence">'+
 '<div class="p52-cases">'+results.map(c=>{const e=p52Evidence(state,c);
 return act('p52-open','<small>CASE '+c.sequence+' · '+esc(c.theme)+'</small><strong>'+esc(c.title)+'</strong>'+
 '<span>'+esc(c.scenario)+'</span><em>Reader: '+label(e.reading)+' · Dialogue: '+label(e.listening)+
 ' · '+e.writing.length+' native sentence attempt(s)</em>','p52-case '+(c.id===selected?'active':''),'data-id="'+c.id+'"');
 }).join('')+'</div>'+(results.length?'':'<p class="muted">No matching original case.</p>')+
 '<div class="p52-actions">'+act('p51-return','Return to P51 source fluency →','button outline')+
 act('p52-review','Due-card Review →','button outline')+'</div></section>';
}
export function p52Lesson(c,state,act,esc,{stage='records',readingIndex=0,listeningIndex=0,
 readingHelp=false,listeningHelp=false,showModels=false,readingFeedback=null,listeningFeedback=null,checks=[]}={}){
 if(!c)return '';
 const evidence=p52Evidence(state,c),rq=c.questions[readingIndex],dq=c.dialogueQuestions[listeningIndex];
 const chosen=new Set(checks);
 return '<section class="p52-journey" aria-label="P52 original source comparison">'+
 '<header class="p52-heading"><p class="eyebrow">P52 · ORIGINAL SOURCE CASE '+c.sequence+' / '+P52_CASES.length+'</p>'+
 '<h2>'+esc(c.title)+'</h2><p>'+esc(c.goal)+'</p>'+
 '<p class="muted">Three independent authored records · '+c.lines.length+' source sentences · '+c.turns.length+' speaker turns</p>'+
 act('p52-next','Next investigation →','button outline')+'</header>'+
 '<nav class="p52-stages" aria-label="P52 stages">'+P52_STAGES.map(s=>act('p52-stage',
 esc(s.label),'p52-step '+(stage===s.id?'active':''),'data-stage="'+s.id+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='records'?'<div class="p52-pane"><h3>Compare separate documentary authorities</h3>'+
 '<p>Before answering, identify which record establishes each claim and which question remains unmeasured.</p>'+
 '<div class="p52-source-grid">'+c.sources.map(src=>'<article class="p52-source"><h4>Record '+(src.index+1)+': '+esc(src.name)+'</h4>'+
 src.lines.map((line,j)=>sourceLine(line,src.index*3+j,readingHelp,act,esc)).join('')+'</article>').join('')+'</div>'+
 '<div class="p52-actions">'+act('p52-reading-help',readingHelp?'Hide Pinyin and translation':
 'Reveal Pinyin and translation · assisted','button outline')+'</div>'+
 '<section class="p52-question"><h4>Canonical Reader · evidence '+(readingIndex+1)+' / '+c.questions.length+'</h4>'+
 '<p>'+esc(rq?.prompt||'')+'</p>'+
 (readingFeedback?feedbackPanel(rq,'Record '+(c.lines[rq.evidence].sourceIndex+1)+', line '+(rq.evidence+1)+': '+c.lines[rq.evidence].hanzi+' · '+c.lines[rq.evidence].english,readingFeedback,esc)+
 '<div class="p52-actions">'+act('p52-reader-next',readingIndex+1<c.questions.length?'Next evidence →':'Proceed to hearing →','button primary')+
 act('p52-reader-retry','Retry this question','button outline')+'</div>':
 '<div class="p52-options">'+rq.options.map(o=>act('p52-reader-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p52-actions">'+act('p52-reader-model','Reveal source answer · assisted','button outline')+
 act('p52-stage','Proceed without submitting →','button outline','data-stage="hearing"')+'</div>')+'</section>'+
 act('p52-native-read','Open full original Reader →','button outline')+'</div>':'')+
 (stage==='hearing'?'<div class="p52-pane"><h3>Reconstruct disagreement before viewing the transcript</h3>'+
 '<p>Device-local Mandarin text-to-speech is synthetic. Listening and pronunciation are not human assessed.</p>'+
 '<div class="p52-actions">'+act('p52-play','Play the full hearing','button primary')+
 act('p52-play-slow','Replay slowly','button outline')+
 act('p52-listening-help',listeningHelp?'Hide translated transcript':'Reveal transcript · assisted','button outline')+'</div>'+
 c.turns.map((t,i)=>'<article class="p52-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (listeningHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small>'+esc(t.pinyin)+'</small><p>'+esc(t.english)+'</p>':
 '<p class="muted">Turn '+(i+1)+' · Listen to identify the claim or challenge.</p>')+'</div>'+
 act('p52-turn-play','Hear turn '+(i+1),'button outline small','data-index="'+i+'"')+'</article>').join('')+
 '<section class="p52-question"><h4>Canonical Dialogue · question '+(listeningIndex+1)+' / '+c.dialogueQuestions.length+'</h4>'+
 '<p>'+esc(dq.prompt)+'</p>'+
 (listeningFeedback?feedbackPanel(dq,'Speaker '+c.turns[dq.evidenceIndex].speaker+': '+c.turns[dq.evidenceIndex].hanzi+' · '+c.turns[dq.evidenceIndex].english,listeningFeedback,esc)+
 '<div class="p52-actions">'+act('p52-listener-next',listeningIndex+1<c.dialogueQuestions.length?'Next listening evidence →':'Proceed to independent synthesis →','button primary')+
 act('p52-listener-retry','Retry this question','button outline')+'</div>':
 '<div class="p52-options">'+dq.options.map(o=>act('p52-listener-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p52-actions">'+act('p52-listener-model','Reveal dialogue answer · assisted','button outline')+
 act('p52-stage','Proceed without submitting →','button outline','data-stage="revision"')+'</div>')+'</section>'+
 act('p52-native-listen','Open canonical Dialogues →','button outline')+'</div>':'')+
 (stage==='revision'?'<div class="p52-pane"><h3>Synthesize without overstating the record</h3>'+
 '<div class="p52-synthesis"><article><h4>Independent brief</h4><p>'+esc(c.goal)+'</p></article>'+
 '<article><h4>Fair objection</h4><p>'+esc(c.objection)+'</p></article>'+
 '<article><h4>Misconception-specific repair</h4><p>'+esc(c.pitfall)+'</p></article></div>'+
 '<p>Write your own source-qualified Chinese paragraph first: original claim, documentary comparison, fair objection, correction, and remaining uncertainty. Explain the same result conversationally and formally aloud. Neither free writing nor speech is automatically evaluated or stored here.</p>'+
 '<div class="p52-actions">'+act('p52-model',showModels?'Hide authored models':'Compare after drafting · show models','button outline')+
 act('p52-p43','Use original P43 independent drafting →','button primary')+'</div>'+
 (showModels?'<div class="p52-models">'+c.models.map((m,i)=>'<article><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><p>'+esc(m.english)+'</p><p>'+esc(m.purpose)+'</p>'+
 act('p52-write','Reconstruct in native Sentence Workshop →','button outline small','data-index="'+i+'"')+'</article>').join('')+'</div>':'')+
 '<h4>Self-review: not a proficiency score</h4>'+[
 ['sources','Did I name the record behind each figure, quotation and date?'],
 ['distinctions','Did I separate planned, observed and completed events?'],
 ['objection','Did I represent the strongest legitimate objection fairly?'],
 ['limits','Did I avoid converting missing evidence into certainty?'],
 ['register','Can I explain the same supported facts in formal and familiar language?'],
 ['oral','Can I deliver the conclusion aloud without reading a model?']
 ].map(([id,label])=>act('p52-check',(chosen.has(id)?'✓ ':'○ ')+esc(label),'p52-check '+(chosen.has(id)?'selected':''),'data-id="'+id+'" aria-pressed="'+chosen.has(id)+'"')).join('')+
 '<p class="muted">These temporary checkboxes are self-review cues, not recorded attempts or mastery.</p>'+
 '<div class="p52-actions">'+act('p52-next','Next independent dossier →','button primary')+
 act('p51-return','Review P51 foundation →','button outline')+'</div></div>':'')+
 '<footer class="p52-evidence"><span>Actual native evidence · Reader: '+evidence.reading.length+
 ' · Dialogue: '+evidence.listening.length+' · exact-form sentence attempts: '+evidence.writing.length+
 '</span><p>Not an automatic CEFR/HSK result. Source records are original educational fiction.</p></footer></section>';
}
