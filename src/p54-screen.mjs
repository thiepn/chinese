/** P54 original advanced learner journey. Native Reader, Dialogue, Wordbook,
 * P43 writing and Sentence Workshop remain exclusive learning authorities.
 */
import {P54_CASES,P54_SELF_REVIEW} from './p54-course.mjs';
import {P54_REGISTER_PAIRS} from './p54-register.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {dueCards} from './study.mjs';
export const P54_STAGES=Object.freeze([
 ['register','Register & contextual expressions'],
 ['read','Source reading and evidence'],
 ['listen','Multi-speaker listening'],
 ['produce','Independent argument and revision'],
 ['transfer','Unfamiliar context transfer']
].map(([id,label])=>Object.freeze({id,label})));
export const p54Story=c=>STORIES.find(s=>s.beginner?.p54?.id===c.id)||null;
export const p54NativeDialogue=c=>DIALOGUES.find(d=>d.p54?.caseId===c.id)||null;
export function p54Evidence(state,c){
 const story=p54Story(c),dialogue=p54NativeDialogue(c);
 const reading=(state.readingEvents||[]).filter(x=>x.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(x=>x.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(x=>x.taskId?.startsWith('p54:source:'+c.id+':'));
 const vocab=P54_REGISTER_PAIRS.slice((c.sequence-1)*3,c.sequence*3);
 const registerIds=vocab.map(x=>'p54:register:'+x.id+':');
 const registerEvents=(state.sentenceEvents||[]).filter(x=>registerIds.some(prefix=>x.taskId?.startsWith(prefix)));
 return {story,dialogue,reading,listening,writing,registerEvents};
}
export function p54Next(state,after=null){
 const i=P54_CASES.findIndex(c=>c.id===after);
 const order=i<0?P54_CASES:[...P54_CASES.slice(i+1),...P54_CASES.slice(0,i+1)];
 return order.find(c=>{const e=p54Evidence(state,c);return !e.reading.length||!e.listening.length;})||
 order.find(c=>{const e=p54Evidence(state,c);return [e.reading.at(-1),e.listening.at(-1)].some(x=>x&&(!x.correct||x.assisted));})||order[0];
}
function status(events){
 const e=events.at(-1);
 return !e?'Not attempted':e.correct?(e.assisted?'Latest correct with help':'Latest correct independently'):'Latest incorrect';
}
function resultBox(q,reference,r,esc){
 if(!r)return '';
 return '<div class="p54-feedback" role="status"><strong>'+
 (r.revealed?'Reference displayed; no attempt saved':r.correct?
 r.assisted?'Correct with assistance':'Correct independently':'Incorrect · examine source evidence')+'</strong>'+
 '<p>Original answer: '+esc(q.answer)+'</p><p><strong>Evidence: </strong>'+esc(reference)+'</p>'+
 '<p>'+esc(q.explanation)+'</p></div>';
}
export function p54Overview(state,act,esc,{query='',selected=''}={}){
 const term=query.trim().toLocaleLowerCase(),next=p54Next(state);
 const cases=P54_CASES.filter(c=>[c.title,c.theme,c.goal,c.pitfall,
  ...c.lines.flatMap(x=>[x.hanzi,x.english])].join(' ').toLocaleLowerCase().includes(term));
 return '<section class="p54-overview" aria-label="P54 cumulative Mandarin source cases">'+
 '<header><p class="eyebrow">P54 · ORIGINAL CUMULATIVE ADVANCED MANDARIN</p>'+
 '<h2>Explain the sources. Correct the overclaim. Rebuild independently.</h2>'+
 '<p>Four sixteen-sentence dossiers, four multi-speaker conversations, original exact-source questions, twelve register contrasts, canonical Wordbook context, and guided independent drafting.</p>'+
 '<p class="muted">Original HSK 5-targeted educational work, not a licensed official syllabus, exam result, or automatic spoken/written proficiency assessment.</p>'+
 '<p>'+dueCards(state).length+' genuinely due cards in the original Review system; no P54 mastery schedule is invented.</p>'+
 act('p54-open','Continue source study: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</header>'+
 '<label for="p54-search">Find a case or phrase</label>'+
 '<input id="p54-search" type="search" value="'+esc(query)+'" placeholder="分母, timestamp, quotation, survey, prediction">'+
 '<div class="p54-case-grid">'+cases.map(c=>{const e=p54Evidence(state,c);
 return act('p54-open','<small>CASE '+c.sequence+' · '+esc(c.theme)+'</small>'+
 '<strong>'+esc(c.title)+'</strong><span>'+esc(c.goal)+'</span>'+
 '<em>Reader: '+status(e.reading)+' · Dialogue: '+status(e.listening)+
 ' · '+e.writing.length+' exact-form responses</em>',
 'p54-case '+(selected===c.id?'active':''),'data-id="'+c.id+'"');
 }).join('')+'</div>'+(!cases.length?'<p class="muted">No original dossier matches the search.</p>':'')+
 '<div class="p54-actions">'+act('p53-return','Previous P53 source study →','button outline')+
 act('p54-review','Original due-card Review →','button outline')+'</div></section>';
}
export function p54Lesson(c,state,act,esc,{stage='register',readingIndex=0,listeningIndex=0,
 readingHelp=false,listeningHelp=false,models=false,checks=[],
 readingFeedback=null,listeningFeedback=null}={}){
 if(!c)return '';
 const e=p54Evidence(state,c),rq=c.questions[readingIndex],dq=c.dialogueQuestions[listeningIndex],
 selectedChecks=new Set(checks),vocab=P54_REGISTER_PAIRS.slice((c.sequence-1)*3,c.sequence*3);
 return '<section class="p54-journey" aria-label="P54 advanced source-based Mandarin">'+
 '<header class="p54-heading"><p class="eyebrow">P54 · CASE '+c.sequence+' / '+P54_CASES.length+'</p>'+
 '<h2>'+esc(c.title)+'</h2><p>'+esc(c.goal)+'</p>'+
 act('p54-next','Another original source context →','button outline')+'</header>'+
 '<nav class="p54-stages" aria-label="Five integrated learning stages">'+P54_STAGES.map(s=>
 act('p54-stage',esc(s.label),'p54-stage '+(stage===s.id?'active':''),
 'data-stage="'+s.id+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='register'?'<div class="p54-pane"><h3>Choose expressions according to authority, audience and evidence</h3>'+
 '<p>These are contextual distinctions, not a fabricated official HSK vocabulary list. Original Wordbook entries own the lexical record; fixed-form examples can be reconstructed in the native Sentence Workshop.</p>'+
 '<div class="p54-vocab-grid">'+vocab.map(pair=>'<article class="p54-vocab"><p class="eyebrow">'+esc(pair.category)+'</p>'+
 '<h4>'+esc(pair.left.hanzi)+' / '+esc(pair.right.hanzi)+'</h4>'+
 '<p>'+esc(pair.teaching)+'</p>'+
 [pair.left,pair.right].map((word,i)=>{const native=WORDS.find(x=>x.key===canonicalWordKey(word.hanzi,word.pinyin));
 const ex=pair.examples[i];
 return '<div class="p54-word"><h5 lang="zh-Hans">'+esc(word.hanzi)+'</h5>'+
 '<small>'+esc(word.pinyin)+' · '+esc(word.meaning)+'</small>'+
 '<p lang="zh-Hans">'+esc(ex.hanzi)+'</p><small>'+esc(ex.pinyin)+'</small><p>'+esc(ex.english)+'</p>'+
 '<div class="p54-actions">'+(native?act('lookup-word','Canonical Wordbook →','button outline small','data-id="'+esc(native.key)+'"'):'')+
 act('p54-register-write','Reconstruct contextual sentence →','button outline small','data-pair="'+pair.id+'" data-index="'+i+'"')+'</div></div>';
 }).join('')+'</article>').join('')+'</div>'+
 '<div class="p54-actions">'+act('p54-stage','Continue to 16-sentence reading →','button primary','data-stage="read"')+'</div></div>':'')+
 (stage==='read'?'<div class="p54-pane"><h3>Compare four documentary authorities</h3>'+
 '<p>Read first without translation. Which record is historical, estimated, newly verified, or merely interpretive? Keep the source timestamp and quantified scope.</p>'+
 '<div class="p54-sources">'+c.sources.map(src=>'<article class="p54-source"><header><small>RECORD '+(src.index+1)+'</small>'+
 '<h4>'+esc(src.name)+'</h4></header>'+
 src.lines.map((line,i)=>'<div class="p54-line"><span>'+(src.start+i+1)+'</span><div>'+
 '<p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 (readingHelp?'<small>'+esc(line.pinyin)+'</small><p>'+esc(line.english)+'</p>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(line.hanzi)+'"')+'</div>').join('')+'</article>').join('')+'</div>'+
 '<div class="p54-actions">'+act('p54-reading-help',readingHelp?'Hide bilingual support':
 'Reveal bilingual support · assisted','button outline')+
 act('p54-native-read','Original Reader practice →','button outline')+'</div>'+
 '<div class="p54-question"><h4>Canonical Reader evidence '+(readingIndex+1)+' / '+c.questions.length+'</h4>'+
 '<p>'+esc(rq.prompt)+'</p>'+
 (readingFeedback?resultBox(rq,'Record '+(c.lines[rq.evidenceIndex].sourceIndex+1)+', sentence '+(rq.evidenceIndex+1)+
 ': '+c.lines[rq.evidenceIndex].hanzi+' · '+c.lines[rq.evidenceIndex].english,readingFeedback,esc)+
 '<div class="p54-actions">'+act('p54-reader-next',readingIndex+1<c.questions.length?
 'Next evidence question →':'Continue to listening →','button primary')+
 act('p54-reader-retry','Retry original question','button outline')+'</div>':
 '<div class="p54-options">'+rq.options.map(option=>act('p54-reader-answer',esc(option),'choice','data-option="'+esc(option)+'"')).join('')+'</div>'+
 '<div class="p54-actions">'+act('p54-reader-model','Reveal answer · no attempt','button outline')+
 act('p54-stage','Continue without submitting →','button outline','data-stage="listen"')+'</div>')+'</div></div>':'')+
 (stage==='listen'?'<div class="p54-pane"><h3>Recognize claims and limits across speakers</h3>'+
 '<p>Use device-local Mandarin synthesis, not a human recording. Speak after listening; pronunciation and spontaneous responses are not scored.</p>'+
 '<div class="p54-actions">'+act('p54-play','Play full conversation','button primary')+
 act('p54-slow','Play slowly','button outline')+
 act('p54-listening-help',listeningHelp?'Hide transcript':'Reveal bilingual transcript · assisted','button outline')+
 act('p54-native-listen','Original Dialogue practice →','button outline')+'</div>'+
 '<div class="p54-turns">'+c.turns.map((t,i)=>'<article class="p54-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (listeningHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small>'+esc(t.pinyin)+'</small>'+
 '<p>'+esc(t.english)+'</p>':'<p class="muted">Turn '+(i+1)+' · Listen for source, objection, and correction.</p>')+'</div>'+
 act('p54-turn','Hear turn '+(i+1),'button outline small','data-index="'+i+'"')+'</article>').join('')+'</div>'+
 '<div class="p54-question"><h4>Canonical Dialogue evidence '+(listeningIndex+1)+' / '+c.dialogueQuestions.length+'</h4>'+
 '<p>'+esc(dq.prompt)+'</p>'+
 (listeningFeedback?resultBox(dq,'Speaker '+c.turns[dq.evidenceIndex].speaker+
 ': '+c.turns[dq.evidenceIndex].hanzi+' · '+c.turns[dq.evidenceIndex].english,listeningFeedback,esc)+
 '<div class="p54-actions">'+act('p54-listener-next',listeningIndex+1<c.dialogueQuestions.length?
 'Next listening evidence →':'Continue to argument preparation →','button primary')+
 act('p54-listener-retry','Retry independently','button outline')+'</div>':
 '<div class="p54-options">'+dq.options.map(option=>act('p54-listener-answer',esc(option),'choice','data-option="'+esc(option)+'"')).join('')+'</div>'+
 '<div class="p54-actions">'+act('p54-listener-model','Reveal reference · no attempt','button outline')+
 act('p54-stage','Continue to argument →','button outline','data-stage="produce"')+'</div>')+'</div></div>':'')+
 (stage==='produce'?'<div class="p54-pane"><h3>Build and revise an independently defensible argument</h3>'+
 '<p>Write an original three-part Mandarin analysis before consulting the models; keep the strongest objection and source-specific repair.</p>'+
 '<div class="p54-argument">'+[
 ['1. Claim grounded in records',c.goal],
 ['2. Fair counterargument',c.objection],
 ['3. Misconception-specific correction',c.pitfall]
 ].map(([title,body])=>'<article><h4>'+esc(title)+'</h4><p>'+esc(body)+'</p></article>').join('')+'</div>'+
 '<p><strong>Formal audience task:</strong> '+esc(c.formalTask)+'</p>'+
 '<p><strong>Conversational challenge:</strong> '+esc(c.informalTask)+'</p>'+
 '<p>First draft: identify which statement is supported by which record. Second draft: repair the strongest unsupported sentence. Third draft: adapt to a new audience without expanding the evidence.</p>'+
 '<div class="p54-actions">'+act('p54-p43','Original P43 multi-draft writing →','button primary')+
 act('p54-models',models?'Hide example sentences':'Reveal contextual models after drafting','button outline')+'</div>'+
 (models?'<div class="p54-models">'+c.models.map((m,i)=>'<article>'+
 '<p lang="zh-Hans">'+esc(m.hanzi)+'</p><small>'+esc(m.pinyin)+'</small>'+
 '<p>'+esc(m.english)+'</p><p>'+esc(m.purpose)+'</p>'+
 act('p54-write','Original exact-sentence reconstruction →','button outline small','data-index="'+i+'"')+'</article>').join('')+'</div>':'')+
 '<p class="muted">Original P43 drafting is tab-local and not a graded, persistent essay record. Copy important work before refreshing the browser.</p>'+
 act('p54-stage','Transfer into a different domain →','button primary','data-stage="transfer"')+'</div>':'')+
 (stage==='transfer'?'<div class="p54-pane"><h3>Cumulative different-context retrieval: P50–P54 reasoning</h3>'+
 '<p>Without looking at the original model, connect this source dispute with a different original P53 case. Identify what transfers, what does not, and why a similar expression may need a different evidentiary qualification.</p>'+
 '<div class="p54-transfer"><article><h4>Earlier independently grounded case</h4>'+
 '<p>Return to '+esc(c.priorCase)+' and recover its source distinction, a legitimate opposing interpretation, and a cautious Mandarin conclusion.</p>'+
 act('p54-prior','Open exact P53 source case '+esc(c.priorCase)+' →','button outline','data-id="'+esc(c.priorCase)+'"')+'</article>'+
 '<article><h4>Unseen transfer in the current case</h4><p>'+esc(c.goal)+'</p>'+
 '<p><strong>Incorrect shortcut to avoid:</strong> '+esc(c.pitfall)+'</p>'+
 '<p><strong>Formal register:</strong> '+esc(c.formalTask)+'</p><p><strong>Independent speaking:</strong> '+esc(c.informalTask)+'</p></article></div>'+
 '<h4>Self-review, not stored progress</h4>'+
 P54_SELF_REVIEW.map(x=>act('p54-check',(selectedChecks.has(x.id)?'✓ ':'○ ')+esc(x.label),
 'p54-check '+(selectedChecks.has(x.id)?'selected':''),
 'data-id="'+x.id+'" aria-pressed="'+selectedChecks.has(x.id)+'"')).join('')+
 '<p>'+selectedChecks.size+' / '+P54_SELF_REVIEW.length+' temporary checks; no fabricated HSK score or proficiency assertion.</p>'+
 '<div class="p54-actions">'+act('p54-p43','Revise again in original P43 writing →','button primary')+
 act('p54-next','Apply to another independent source dossier →','button outline')+'</div></div>':'')+
 '<footer class="p54-history"><h4>Recorded native evidence only</h4><p>'+
 e.reading.length+' original Reader events · '+e.listening.length+
 ' original Dialogue events · '+e.writing.length+' exact-model sentence events · '+
 e.registerEvents.length+' contextual sentence events</p>'+
 '<p>Only real submitted questions appear here; revealing answers, self-review checkmarks and oral rehearsal never create artificial attempts.</p>'+
 '<div class="p54-actions">'+act('p54-review','Original scheduled Review →','button outline')+
 act('p53-return','Return to P53 →','button outline')+'</div></footer></section>';
}
