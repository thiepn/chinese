/** P48 comparative text, multi-speaker evidence and argumentative transfer.
 * All recorded answers use original readingEvents, dialogueEvents and
 * sentenceEvents; open-ended argumentation uses the original P43 studio.
 */
import {P48_PASSAGES} from './p48-readings.mjs';
import {P48_DIALOGUES} from './p48-dialogues.mjs';
import {findP48Argument,P48_REVISION_CHECKS} from './p48-arguments.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
export const P48_STAGES=Object.freeze([
 {id:'compare',label:'Compare sources'},{id:'read',label:'Reading decisions'},
 {id:'listen',label:'Multiple speakers'},{id:'argue',label:'Argument & revision'}
].map(x=>Object.freeze(x)));
export const p48Story=p=>STORIES.find(s=>s.beginner?.p48?.id===p.id)||null;
export const p48NativeDialogue=p=>DIALOGUES.find(d=>d.p48?.readingId===p.id)||null;
export function p48Evidence(state,p){
 const story=p48Story(p),dialogue=p48NativeDialogue(p);
 const reading=(state.readingEvents||[]).filter(e=>e.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(e=>e.taskId==='beginner-reading:'+story?.id+':writing'||
  e.taskId?.startsWith('p48:argument:'+p.id+':')||
  e.taskId?.startsWith('p48:dialogue:'+dialogue?.p48?.id+':'));
 const mostRecent=arr=>arr.length?arr[arr.length-1]:null;
 return Object.freeze({
  story,dialogue,reading,listening,writing,
  lastReading:mostRecent(reading),lastListening:mostRecent(listening),
  independentlyAnsweredReading:reading.some(e=>e.correct&&!e.assisted),
  independentlyAnsweredListening:listening.some(e=>e.correct&&!e.assisted)
 });
}
export function p48Next(state,after=null){
 const index=P48_PASSAGES.findIndex(p=>p.id===after);
 const cases=index<0?P48_PASSAGES:[...P48_PASSAGES.slice(index+1),...P48_PASSAGES.slice(0,index+1)];
 return cases.find(p=>{
  const e=p48Evidence(state,p);
  return e.lastReading&&(!e.lastReading.correct||e.lastReading.assisted)||
   e.lastListening&&(!e.lastListening.correct||e.lastListening.assisted);
 })||cases.find(p=>{
  const e=p48Evidence(state,p);
  return !e.reading.length||!e.listening.length;
 })||cases[0]||P48_PASSAGES[0];
}
const status=e=>!e?'not attempted':e.correct?
 e.assisted?'last correct with assistance':'last independently correct':'last incorrect';
export function p48Overview(state,act,esc,{compact=false,selected='',query=''}={}){
 const next=p48Next(state),q=String(query||'').toLocaleLowerCase().trim();
 const cases=P48_PASSAGES.filter(p=>!q||[p.title,p.theme,p.goal,p.contrast,
  ...p.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const done=P48_PASSAGES.filter(p=>{
  const e=p48Evidence(state,p);
  return e.independentlyAnsweredReading&&e.independentlyAnsweredListening;
 }).length;
 return '<section class="p48-overview" aria-label="P48 advanced source argumentation">'+
 '<div class="p48-hero"><p class="eyebrow">P48 · ORIGINAL ADVANCED SOURCE EVIDENCE</p>'+
 '<h2>Compare the sources. Answer the objection. Revise your argument.</h2>'+
 '<p>Four authorial 20-sentence Mandarin dossiers, four multi-speaker conversations, independently answerable source questions and original counterargument writing briefs. Correct fixed-form attempts are not automatic free-writing or spoken proficiency grades.</p>'+
 '<p class="muted">'+done+' / '+P48_PASSAGES.length+
 ' dossiers have at least one independently correct original Reader and Dialogue event; this is not mastery or an official HSK result.</p>'+
 act('p48-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div>'+
 (compact?act('p48-enter','Enter advanced evidence practice →','button outline'):
 '<label for="p48-search">Find Chinese, an argument or a source claim</label>'+
 '<input id="p48-search" type="search" value="'+esc(query)+'" placeholder="e.g. 证据, access, training">'+
 '<div class="p48-cases">'+cases.map(p=>{
 const e=p48Evidence(state,p);
 return act('p48-open','<small>DOSSIER '+p.sequence+' · '+esc(p.theme)+'</small>'+
 '<strong>'+esc(p.title)+'</strong><span>'+esc(p.goal)+'</span>'+
 '<em>Reader: '+esc(status(e.lastReading))+' · Dialogue: '+esc(status(e.lastListening))+
 ' · '+e.writing.length+' native sentence events</em>',
 'p48-case '+(selected===p.id?'active':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+
 (!cases.length?'<p class="muted">No source-backed dossier matches this search.</p>':'')+
 '<div class="p48-actions">'+act('p48-review','Original due-card Review →','button outline')+
 act('p47-enter','Return to P47 advanced contextual language →','button outline')+'</div>')+
 '</section>';
}
function sectionLines(p,s,esc,act,translation){
 return '<article class="p48-source"><h4>'+esc(s.name)+'</h4>'+
 p.lines.slice(s.start,s.end+1).map((l,j)=>
 '<div class="p48-line"><span>'+(s.start+j+1)+'</span><div>'+
 '<p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (translation?'<small>'+esc(l.pinyin)+'</small><span>'+esc(l.english)+'</span>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>').join('')+
 '</article>';
}
export function p48Lesson(p,state,act,esc,{stage='compare',translations=false,transcript=false,
 readingIndex=0,listeningIndex=0,readingFeedback=null,listeningFeedback=null,models=false,
 checks=[]}={}){
 if(!p)return '';
 const e=p48Evidence(state,p),arg=findP48Argument(p.id);
 const d=P48_DIALOGUES.find(x=>x.readingId===p.id),rq=p.questions[readingIndex],lq=d?.questions[listeningIndex];
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const word=WORDS.find(w=>w.key===canonicalWordKey(p.focusWord.hanzi,p.focusWord.pinyin));
 const chosen=new Set(checks);
 return '<section class="p48-lesson" aria-label="P48 source comparison, argument and revision">'+
 '<header class="p48-heading"><div><p class="eyebrow">P48 · DOSSIER '+p.sequence+' / '+P48_PASSAGES.length+'</p>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(p.goal)+'</p></div>'+
 act('p48-next','Another source dossier →','button outline')+'</header>'+
 '<nav class="p48-stages" aria-label="Evidence learning stages">'+
 P48_STAGES.map(s=>act('p48-stage',esc(s.label),
 'p48-step '+(stage===s.id?'active':''),'data-stage="'+s.id+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='compare'?'<div class="p48-pane"><h3>First identify what each source actually says</h3>'+
 '<p>'+esc(p.contrast)+'</p>'+
 '<div class="p48-sources">'+p.sections.slice(0,2).map(s=>sectionLines(p,s,esc,act,translations)).join('')+'</div>'+
 '<div class="p48-claim"><strong>The unresolved comparison</strong><p>'+esc(p.contrast)+'</p>'+
 '<p>Source A and Source B are fictional authorial learning records within this dossier, not factual reports about real organizations. They present distinct kinds of evidence.</p></div>'+
 '<div class="p48-actions">'+act('p48-translation',translations?'Hide Pinyin/English':
 'Reveal Pinyin/English · assisted','button outline')+
 act('p48-stage','Read the verification and argument →','button primary','data-stage="read"')+'</div></div>':'')+
 (stage==='read'?'<div class="p48-pane"><h3>Read the verification and evidence-backed conclusion</h3>'+
 '<p>Compare the earlier sources with what was actually checked, approved, disputed or left unknown.</p>'+
 p.sections.map(s=>sectionLines(p,s,esc,act,translations)).join('')+
 '<div class="p48-actions">'+act('p48-translation',translations?'Hide bilingual assistance':
 'Show bilingual assistance · assisted','button outline')+'</div>'+
 '<div class="p48-questions"><h4>Original Reader question '+(readingIndex+1)+' / '+p.questions.length+'</h4>'+
 '<p>'+esc(rq?.prompt||'')+'</p>'+
 (readingFeedback?'<div class="p48-feedback" role="status"><strong>'+(
 readingFeedback.correct?(readingFeedback.assisted?'Correct with assistance':'Correct native Reader answer'):
 'The source does not support that selection')+'</strong>'+
 '<p>Reference answer: '+esc(rq.answer)+'</p>'+
 '<p><strong>Evidence line '+(rq.evidence+1)+'</strong></p><p lang="zh-Hans">'+esc(p.lines[rq.evidence]?.hanzi||'')+'</p>'+
 '<small>'+esc(p.lines[rq.evidence]?.pinyin||'')+'</small><p>'+esc(p.lines[rq.evidence]?.english||'')+'</p>'+
 '<p>'+esc(rq.explanation)+'</p></div>'+
 '<div class="p48-actions">'+act('p48-reader-next',readingIndex+1<p.questions.length?
 'Next independent question →':'Continue to multi-speaker listening →','button primary')+
 act('p48-reader-retry','Retry independently','button outline')+'</div>':
 '<div class="p48-choices">'+(rq?.options||[]).map(o=>act('p48-reader-answer',esc(o),
 'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p48-actions">'+act('p48-reader-model','Reveal answer · assisted','button outline')+
 act('p48-stage','Skip to listening →','button outline','data-stage="listen"')+'</div>')+'</div>'+
 '<div class="p48-teaching"><h4>Grammar and source vocabulary</h4><div class="p48-actions">'+
 grammar.map(g=>act('grammar-select',esc(g.pattern)+' →','button outline small','data-id="'+g.id+'"')).join('')+
 (word?act('lookup-word',esc(p.focusWord.hanzi)+' · Wordbook →','button outline small','data-id="'+esc(word.key)+'"'):'')+
 act('p47-enter','P47 foundations →','button outline small')+'</div></div></div>':'')+
 (stage==='listen'?'<div class="p48-pane"><h3>Listen to all three viewpoints before reading the script</h3>'+
 '<p>Device-generated Mandarin audio only. The native Dialogue assessment checks reference answers, not pronunciation or spontaneous speech.</p>'+
 '<div class="p48-actions">'+act('p48-play','Play full multi-speaker exchange','button primary')+
 act('p48-play-slow','Replay more slowly','button outline')+
 act('p48-transcript',transcript?'Hide dialogue script':'Reveal Hanzi, Pinyin and English · assisted','button outline')+'</div>'+
 (d?.turns||[]).map((t,i)=>'<div class="p48-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (transcript?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small>'+esc(t.pinyin)+'</small><span>'+esc(t.english)+'</span>':
 '<p>Listen, then decide which statement was asserted, challenged or supported.</p>')+'</div>'+
 act('p48-hear-turn','Hear turn '+(i+1),'button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p48-questions"><h4>Native spoken-evidence decision '+(listeningIndex+1)+' / '+(d?.questions.length||0)+'</h4>'+
 '<p>'+esc(lq?.prompt||'')+'</p>'+
 (listeningFeedback?'<div class="p48-feedback" role="status"><strong>'+(
 listeningFeedback.correct?(listeningFeedback.assisted?'Correct with assistance':'Correct native Dialogue answer'):
 'That interpretation is not supported')+'</strong>'+
 '<p>Reference answer: '+esc(lq.answer)+'</p>'+
 '<p><strong>Evidence turn '+(lq.evidenceIndex+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(d.turns[lq.evidenceIndex]?.hanzi||'')+'</p>'+
 '<small>'+esc(d.turns[lq.evidenceIndex]?.pinyin||'')+'</small><p>'+esc(d.turns[lq.evidenceIndex]?.english||'')+'</p>'+
 '<p>'+esc(lq.explanation)+'</p></div>'+
 '<div class="p48-actions">'+act('p48-listener-next',listeningIndex+1<d.questions.length?
 'Next spoken question →':'Proceed to argumentation →','button primary')+
 act('p48-listener-retry','Retry','button outline')+'</div>':
 '<div class="p48-choices">'+(lq?.options||[]).map(o=>act('p48-listener-answer',esc(o),
 'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p48-actions">'+act('p48-listener-model','Reveal reference · assisted','button outline')+
 act('p48-stage','Skip to argument →','button outline','data-stage="argue"')+'</div>')+'</div></div>':'')+
 (stage==='argue'?'<div class="p48-pane"><h3>Write, challenge and revise a four-paragraph argument</h3>'+
 '<p>'+esc(arg?.writing||p.goal)+'</p>'+
 '<div class="p48-argument-grid">'+[
 ['1 · Claim supported by sources',arg?.claim],
 ['2 · Fair counterargument',arg?.objection],
 ['3 · Source-based rebuttal',arg?.rebuttal],
 ['4 · Conclusion with limits',arg?.misconception]
 ].map(([title,desc])=>'<div><h4>'+esc(title)+'</h4><p>'+esc(desc||'')+'</p></div>').join('')+'</div>'+
 '<p><strong>Speak independently:</strong> '+esc(arg?.oral||p.oral)+'</p>'+
 '<p>Prepare a first draft in the existing P43 studio, revise it there, and return to this evidence checklist. No private composition is automatically saved or graded by P48.</p>'+
 '<div class="p48-actions">'+act('p48-open-p43','Open P43 paragraph drafting and revision →','button primary')+
 act('p48-write','Native exact-form conclusion →','button outline','data-kind="reading"')+'</div>'+
 '<h4>Source- and misconception-specific revision checklist</h4>'+
 '<div class="p48-checks">'+P48_REVISION_CHECKS.map(c=>
 act('p48-check','<span aria-hidden="true">'+(chosen.has(c.id)?'☑':'☐')+'</span> <strong>'+esc(c.title)+'</strong><span>'+esc(c.question)+'</span>',
 'p48-check '+(chosen.has(c.id)?'checked':''),'data-id="'+c.id+'" role="checkbox" aria-checked="'+chosen.has(c.id)+'"')).join('')+'</div>'+
 '<p class="p48-caveat">'+chosen.size+' / '+P48_REVISION_CHECKS.length+
 ' self-review checks selected in this tab. This is not teacher grading, mastery, or server-saved progress.</p>'+
 '<div class="p48-actions">'+act('p48-models',models?'Hide bilingual source models':'Reveal bilingual source models · assisted','button outline')+'</div>'+
 (models?(arg?.models||[]).map((m,i)=>'<div class="p48-model"><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><p>'+esc(m.english)+'</p><p>'+esc(m.purpose)+'</p>'+
 act('p48-argument-write','Practise exact model '+(i+1)+' →','button outline small','data-index="'+i+'"')+'</div>').join(''):'')+
 '<div class="p48-actions">'+act('p48-next','Apply the argument to a different case →','button primary')+'</div></div>':'')+
 '<aside class="p48-evidence"><h3>Canonical learning records</h3>'+
 '<p>'+e.reading.length+' Reader attempts; '+e.listening.length+' Dialogue attempts; '+
 e.writing.length+' exact native Sentence Workshop attempts. These are distinct from free argumentation.</p>'+
 '<div class="p48-actions">'+act('p48-review','Original due-card Review →','button outline')+
 act('p47-enter','P47 contextual reading →','button outline')+
 act('p46-enter','P46 upper-intermediate foundations →','button outline')+
 act('p45-enter','P45 cumulative review →','button outline')+
 act('p44-enter','P44 integrated scenes →','button outline')+'</div></aside>'+
 '<p class="p48-caveat">Independent oral responses and freely written arguments have no invented scores, microphones or certifications. Source translations, answer reference and model reveals mark subsequent native attempts as assisted for this tab. Draft and checklist controls never create new Account state or a second scheduler.</p></section>';
}
