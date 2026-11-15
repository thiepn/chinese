/** P50 original HSK 5-targeted advanced-discourse learner experience.
 * Read-only native evidence; all writes delegated to existing Course,
 * Reader, Dialogue and Sentence Workshop actions in app.mjs.
 */
import {P50_CHARACTER_GUIDES} from './p50-foundations.mjs';
import {P50_PASSAGES} from './p50-readings.mjs';
import {P50_DIALOGUES} from './p50-dialogues.mjs';
import {findP50Argument,P50_REVISION} from './p50-arguments.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {dueCards} from './study.mjs';
export const P50_STAGES=Object.freeze([
 {id:'language',label:'Words & grammar'},
 {id:'read',label:'Advanced reading'},
 {id:'listen',label:'Discourse listening'},
 {id:'produce',label:'Argue & revise'}
].map(x=>Object.freeze(x)));
export const p50Story=p=>STORIES.find(s=>s.beginner?.p50?.id===p.id)||null;
export const p50NativeDialogue=p=>DIALOGUES.find(d=>d.p50?.readingId===p.id)||null;
export function p50Evidence(state,p){
 const story=p50Story(p),dialogue=p50NativeDialogue(p);
 const reading=(state.readingEvents||[]).filter(e=>e.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(e=>
  e.taskId==='beginner-reading:'+story?.id+':writing'||
  e.taskId?.startsWith('p50:argument:'+p.id+':')||
  e.taskId?.startsWith('p50:dialogue:'+dialogue?.p50?.id+':'));
 const chars=P50_CHARACTER_GUIDES.slice((p.sequence-1)*6,p.sequence*6);
 const introduced=chars.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&
  (state.learned||[]).includes(l.id)));
 const due=new Set(dueCards(state)),scheduled=chars.filter(g=>
  DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&[...due].some(id=>id.startsWith(l.id+':'))));
 return Object.freeze({story,dialogue,reading,listening,writing,chars,introduced,scheduled,
  lastReading:reading[reading.length-1]||null,lastListening:listening[listening.length-1]||null,
  independentReading:reading.some(e=>e.correct&&!e.assisted),
  independentListening:listening.some(e=>e.correct&&!e.assisted)});
}
export function p50Next(state,after=null){
 const i=P50_PASSAGES.findIndex(p=>p.id===after);
 const order=i<0?P50_PASSAGES:[...P50_PASSAGES.slice(i+1),...P50_PASSAGES.slice(0,i+1)];
 return order.find(p=>{const e=p50Evidence(state,p);return [
  e.lastReading,e.lastListening].some(x=>x&&(!x.correct||x.assisted));})||
  order.find(p=>{const e=p50Evidence(state,p);return !e.reading.length||!e.listening.length;})||
  order[0]||P50_PASSAGES[0];
}
export function p50Overview(state,act,esc,{compact=false,selected='',query=''}={}){
 const q=query.toLocaleLowerCase().trim(),next=p50Next(state);
 const filtered=P50_PASSAGES.filter(p=>!q||[p.title,p.theme,p.goal,p.contrast,
  ...p.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const shown=P50_CHARACTER_GUIDES.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&
  (state.learned||[]).includes(l.id))).length;
 return '<section class="p50-overview" aria-label="P50 advanced HSK 5-targeted Mandarin">'+
 '<header class="p50-hero"><p class="eyebrow">P50 · ORIGINAL ADVANCED MANDARIN BRIDGE</p>'+
 '<h2>Reason across records. Choose precise Mandarin. Defend a conclusion.</h2>'+
 '<p>24 original contextual characters, 48 connected word families, ten formal discourse constructions, four 20-sentence reading dossiers, four multi-speaker conversations and four original argumentative production briefs.</p>'+
 '<p class="muted">Editorial HSK 5 target, not an official HSK list, automatic proficiency grade or native-speaker recording.</p>'+
 '<p>'+shown+' / 24 character lessons introduced · '+dueCards(state).length+
 ' genuinely due cards across the original scheduler</p>'+
 act('p50-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</header>'+
 (compact?act('p50-enter','Enter advanced HSK 5-targeted discourse →','button outline'):
 '<label for="p50-search">Search Chinese, source meaning or scenario</label>'+
 '<input id="p50-search" type="search" value="'+esc(query)+'" placeholder="e.g. 效率, survey, evidence">'+
 '<div class="p50-cases">'+filtered.map(p=>{
 const e=p50Evidence(state,p);
 const last=x=>!x?'not attempted':x.correct?(x.assisted?'correct with help':'correct independently'):'incorrect';
 return act('p50-open','<small>CASE '+p.sequence+' · '+esc(p.theme)+'</small><strong>'+esc(p.title)+'</strong>'+
 '<span>'+esc(p.goal)+'</span><em>Reader '+last(e.lastReading)+' · Dialogue '+last(e.lastListening)+
 ' · '+e.introduced.length+'/6 character lessons introduced</em>',
 'p50-case '+(selected===p.id?'active':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+
 (!filtered.length?'<p class="muted">No original P50 cases match the current query.</p>':'')+
 '<div class="p50-actions">'+act('p50-review','Original scheduled Review →','button outline')+
 act('p49-enter','P49 cumulative transfer →','button outline')+
 act('p51-enter','Continue to P51 register and source-based fluency →','button primary')+'</div>')+'</section>';
}
function renderLine(l,i,assist,act,esc){
 return '<div class="p50-line"><span>'+(i+1)+'</span><div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (assist?'<small>'+esc(l.pinyin)+'</small><span>'+esc(l.english)+'</span>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>';
}
export function p50Lesson(p,state,act,esc,{stage='language',readingHelp=false,
 listeningHelp=false,models=false,readingIndex=0,listeningIndex=0,
 readingFeedback=null,listeningFeedback=null,checks=[]}={}){
 if(!p)return '';
 const e=p50Evidence(state,p),d=P50_DIALOGUES.find(x=>x.readingId===p.id),
  a=findP50Argument(p.id),rq=p.questions[readingIndex],lq=d?.questions[listeningIndex];
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const chosen=new Set(checks);
 return '<section class="p50-lesson" aria-label="P50 integrated advanced Mandarin">'+
 '<header class="p50-heading"><div><p class="eyebrow">P50 · CASE '+p.sequence+' / '+P50_PASSAGES.length+'</p>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(p.goal)+'</p></div>'+
 act('p50-next','Another source case →','button outline')+'</header>'+
 '<nav class="p50-stages" aria-label="Four learning stages">'+P50_STAGES.map(x=>
 act('p50-stage',esc(x.label),'p50-step '+(stage===x.id?'active':''),
 'data-stage="'+x.id+'" aria-pressed="'+(stage===x.id)+'"')).join('')+'</nav>'+
 (stage==='language'?'<div class="p50-pane"><h3>Characters, contextual word families and formal discourse</h3>'+
 '<p>Each character belongs to the original Course; its contextual expressions belong to the canonical Wordbook. New g147–g156 structures are taught and practised in the original Grammar course.</p>'+
 '<div class="p50-characters">'+e.chars.map(g=>{
 const lesson=DEMO_LESSONS.find(l=>l.hanzi===g.hanzi);
 return '<article class="p50-character"><h4 lang="zh-Hans">'+esc(g.hanzi)+' <small>'+esc(g.pinyin)+'</small></h4>'+
 '<p>'+esc(g.meaning)+'</p><p>'+esc(g.teaching)+'</p>'+
 '<p class="p50-pitfall">'+esc(g.pitfall)+'</p>'+
 g.words.map(w=>{
 const word=WORDS.find(x=>x.key===canonicalWordKey(w.hanzi,w.pinyin));
 return '<div class="p50-word"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong>'+
 '<span>'+esc(w.pinyin)+' · '+esc(w.english)+'</span>'+
 (word?act('lookup-word','Wordbook →','button outline small','data-id="'+esc(word.key)+'"'):'')+'</div>';
 }).join('')+
 g.examples.map(x=>'<div class="p50-model"><p lang="zh-Hans">'+esc(x.hanzi)+'</p>'+
 '<small>'+esc(x.pinyin)+'</small><span>'+esc(x.english)+'</span></div>').join('')+
 (lesson?act('p50-character','Study original Course lesson →','button outline small',
 'data-hanzi="'+esc(g.hanzi)+'"'):'')+'</article>';
 }).join('')+'</div>'+
 '<h3>Case-related formal grammar</h3><div class="p50-grammar">'+grammar.map(g=>
 '<article><h4>'+esc(g.pattern)+'</h4><p>'+esc(g.explanation)+'</p>'+
 '<p><strong>Contrast:</strong> '+esc(g.contrast)+'</p>'+
 '<p><strong>Misconception:</strong> '+esc(g.pitfall)+'</p>'+
 act('grammar-select','Original grammar practice →','button outline small','data-id="'+g.id+'"')+'</article>').join('')+'</div>'+
 '<div class="p50-actions">'+act('p50-stage','Continue to 20-line reading →','button primary','data-stage="read"')+'</div></div>':'')+
 (stage==='read'?'<div class="p50-pane"><h3>Read four connected source sections</h3>'+
 '<p>'+esc(p.contrast)+'</p>'+
 p.paragraphs.map(s=>'<article class="p50-source"><h4>'+esc(s.title)+'</h4>'+
 p.lines.slice(s.start,s.end+1).map((l,i)=>renderLine(l,s.start+i,readingHelp,act,esc)).join('')+
 '</article>').join('')+
 '<div class="p50-actions">'+act('p50-reading-help',readingHelp?'Hide translation support':
 'Reveal complete Pinyin and English · assisted','button outline')+'</div>'+
 '<div class="p50-question"><h4>Canonical Reader evidence '+(readingIndex+1)+' / '+p.questions.length+'</h4>'+
 '<p>'+esc(rq?.prompt||'')+'</p>'+
 (readingFeedback?'<div class="p50-feedback" role="status"><strong>'+(
 readingFeedback.revealed?'Reference revealed without an answer event':readingFeedback.correct?
 readingFeedback.assisted?'Correct, assisted':'Correct native Reader answer':'Incorrect native Reader answer')+'</strong>'+
 '<p>Reference: '+esc(rq.answer)+'</p><p><strong>Evidence line '+(rq.evidence+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(p.lines[rq.evidence]?.hanzi||'')+'</p>'+
 '<small>'+esc(p.lines[rq.evidence]?.pinyin||'')+'</small>'+
 '<p>'+esc(p.lines[rq.evidence]?.english||'')+'</p>'+
 '<p>'+esc(rq.explanation)+'</p></div>'+
 '<div class="p50-actions">'+act('p50-reader-next',readingIndex+1<p.questions.length?
 'Next evidence question →':'Continue to listening →','button primary')+
 act('p50-reader-retry','Retry independently','button outline')+'</div>':
 '<div class="p50-options">'+(rq?.options||[]).map(o=>
 act('p50-reader-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p50-actions">'+act('p50-reader-model','Reveal reference · assisted','button outline')+
 act('p50-stage','Continue without submission →','button outline','data-stage="listen"')+'</div>')+'</div></div>':'')+
 (stage==='listen'?'<div class="p50-pane"><h3>Track each speaker’s evidence and objection</h3>'+
 '<p>Listen before opening the transcript. Device synthesized playback is not recorded human speech or a pronunciation assessment.</p>'+
 '<div class="p50-actions">'+act('p50-play','Play full debate','button primary')+
 act('p50-play-slow','Replay slowly','button outline')+
 act('p50-listening-help',listeningHelp?'Hide bilingual transcript':
 'Reveal bilingual transcript · assisted','button outline')+'</div>'+
 (d?.turns||[]).map((t,i)=>'<div class="p50-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (listeningHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p>'+
 '<small>'+esc(t.pinyin)+'</small><span>'+esc(t.english)+'</span>':
 '<p>Listen and distinguish observation, inference, proposal or approved action.</p>')+'</div>'+
 act('p50-turn-play','Hear turn '+(i+1),'button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p50-question"><h4>Original Dialogue evidence '+(listeningIndex+1)+' / '+(d?.questions.length||0)+'</h4>'+
 '<p>'+esc(lq?.prompt||'')+'</p>'+
 (listeningFeedback?'<div class="p50-feedback" role="status"><strong>'+(
 listeningFeedback.revealed?'Reference revealed, no response submitted':listeningFeedback.correct?
 listeningFeedback.assisted?'Correct, assisted':'Correct native Dialogue answer':'Incorrect native Dialogue answer')+'</strong>'+
 '<p>Reference: '+esc(lq.answer)+'</p>'+
 '<p><strong>Evidence turn '+(lq.evidenceIndex+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(d.turns[lq.evidenceIndex]?.hanzi||'')+'</p>'+
 '<small>'+esc(d.turns[lq.evidenceIndex]?.pinyin||'')+'</small>'+
 '<p>'+esc(d.turns[lq.evidenceIndex]?.english||'')+'</p>'+
 '<p>'+esc(lq.explanation)+'</p></div>'+
 '<div class="p50-actions">'+act('p50-listener-next',listeningIndex+1<d.questions.length?
 'Next listening question →':'Continue to argumentation →','button primary')+
 act('p50-listener-retry','Retry','button outline')+'</div>':
 '<div class="p50-options">'+(lq?.options||[]).map(o=>
 act('p50-listener-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p50-actions">'+act('p50-listener-model','Reveal reference · assisted','button outline')+
 act('p50-stage','Continue to writing →','button outline','data-stage="produce"')+'</div>')+'</div></div>':'')+
 (stage==='produce'?'<div class="p50-pane"><h3>Independent four-paragraph argument and spoken defence</h3>'+
 '<p><strong>Task:</strong> '+esc(a?.writing||p.goal)+'</p>'+
 '<div class="p50-argument">'+[
 ['1. Source-supported position',a?.claim],
 ['2. Fair opposing argument',a?.objection],
 ['3. Evidence-backed rebuttal',a?.rebuttal],
 ['4. Revised conclusion and limit',a?.misconception]
 ].map(([t,body])=>'<article><h4>'+esc(t)+'</h4><p>'+esc(body||'')+'</p></article>').join('')+'</div>'+
 '<p><strong>Independent oral preparation:</strong> '+esc(a?.oral||p.oral)+'</p>'+
 '<p>Draft and revise in the original P43 studio; source models only provide fixed-form reconstruction. P50 never grades open writing or speech.</p>'+
 '<div class="p50-actions">'+act('p50-p43','Open original P43 writing studio →','button primary')+
 act('p50-write','Reconstruct the original reading conclusion →','button outline','data-kind="reading"')+'</div>'+
 '<h3>Manual evidence and revision checks</h3>'+
 P50_REVISION.map(x=>act('p50-check',
 '<strong>'+(chosen.has(x.id)?'☑ ':'☐ ')+esc(x.title)+'</strong><span>'+esc(x.prompt)+'</span>',
 'p50-check '+(chosen.has(x.id)?'checked':''),'data-id="'+x.id+'" role="checkbox" aria-checked="'+chosen.has(x.id)+'"')).join('')+
 '<p class="p50-disclosure">'+chosen.size+' / '+P50_REVISION.length+
 ' checked this tab; not a grade or saved proficiency result.</p>'+
 '<div class="p50-actions">'+act('p50-models',models?'Hide source models':
 'Reveal Pinyin/English models · assisted','button outline')+'</div>'+
 (models?(a?.models||[]).map((m,i)=>'<div class="p50-model"><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><span>'+esc(m.english)+'</span>'+
 '<p>'+esc(m.purpose)+'</p></div>').join(''):'')+
 (a?.models||[]).map((m,i)=>'<div class="p50-actions">'+
 act('p50-argument-write','Exact-form model '+(i+1)+' →','button outline','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p50-actions">'+act('p50-next','Apply to another debate →','button primary')+'</div></div>':'')+
 '<aside class="p50-evidence"><h3>Original learner evidence</h3>'+
 '<p>'+e.reading.length+' Reader submissions · '+e.listening.length+
 ' Dialogue submissions · '+e.writing.length+' exact Sentence Workshop events · '+
 e.introduced.length+'/6 introduced characters · '+e.scheduled.length+
 ' character groups currently due in the original scheduler.</p>'+
 '<div class="p50-actions">'+act('p50-review','Original due Review →','button outline')+
 (p.priorCase?act('p49-open','P49 prerequisite '+esc(p.priorCase)+' →','button outline',
 'data-id="'+esc(p.priorCase)+'"'):'')+
 act('p48-enter','P48 comparative reading →','button outline')+
 act('p47-enter','P47 grammar foundations →','button outline')+
 act('p51-enter','P51 register-aware source transfer →','button outline')+'</div></aside>'+
 '<p class="p50-disclosure">All assistance is explicitly shown, all native fixed-reference answers retain their original event writers, and no duplicate scheduled or personal-data store was created. Original instructional material is not official HSK certification.</p>'+
 '</section>';
}
