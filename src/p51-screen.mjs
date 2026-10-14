/** P51 original HSK 5-targeted register, vocabulary and source fidelity learner experience.
 * Read-only native evidence; all writes delegated to existing Course,
 * Reader, Dialogue and Sentence Workshop actions in app.mjs.
 */
import {P51_CHARACTERS} from './p51-foundations.mjs';
import {P51_PASSAGES} from './p51-readings.mjs';
import {P51_DIALOGUES} from './p51-dialogues.mjs';
import {findP51Argument,P51_REVISION} from './p51-arguments.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {dueCards} from './study.mjs';
export const P51_STAGES=Object.freeze([
 {id:'language',label:'Register & vocabulary'},
 {id:'read',label:'Register-aware reading'},
 {id:'listen',label:'Register-sensitive listening'},
 {id:'produce',label:'Reframe & revise'}
].map(x=>Object.freeze(x)));
export const p51Story=p=>STORIES.find(s=>s.beginner?.p51?.id===p.id)||null;
export const p51NativeDialogue=p=>DIALOGUES.find(d=>d.p51?.readingId===p.id)||null;
export function p51Evidence(state,p){
 const story=p51Story(p),dialogue=p51NativeDialogue(p);
 const reading=(state.readingEvents||[]).filter(e=>e.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id);
 const writing=(state.sentenceEvents||[]).filter(e=>
  e.taskId==='beginner-reading:'+story?.id+':writing'||
  e.taskId?.startsWith('p51:argument:'+p.id+':')||
  e.taskId?.startsWith('p51:dialogue:'+dialogue?.p51?.id+':'));
 const chars=P51_CHARACTERS.slice((p.sequence-1)*5,p.sequence*5);
 const introduced=chars.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&
  (state.learned||[]).includes(l.id)));
 const due=new Set(dueCards(state)),scheduled=chars.filter(g=>
  DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&[...due].some(id=>id.startsWith(l.id+':'))));
 return Object.freeze({story,dialogue,reading,listening,writing,chars,introduced,scheduled,
  lastReading:reading[reading.length-1]||null,lastListening:listening[listening.length-1]||null,
  independentReading:reading.some(e=>e.correct&&!e.assisted),
  independentListening:listening.some(e=>e.correct&&!e.assisted)});
}
export function p51Next(state,after=null){
 const i=P51_PASSAGES.findIndex(p=>p.id===after);
 const order=i<0?P51_PASSAGES:[...P51_PASSAGES.slice(i+1),...P51_PASSAGES.slice(0,i+1)];
 return order.find(p=>{const e=p51Evidence(state,p);return [
  e.lastReading,e.lastListening].some(x=>x&&(!x.correct||x.assisted));})||
  order.find(p=>{const e=p51Evidence(state,p);return !e.reading.length||!e.listening.length;})||
  order[0]||P51_PASSAGES[0];
}
export function p51Overview(state,act,esc,{compact=false,selected='',query=''}={}){
 const q=query.toLocaleLowerCase().trim(),next=p51Next(state);
 const filtered=P51_PASSAGES.filter(p=>!q||[p.title,p.theme,p.goal,p.contrast,
  ...p.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const shown=P51_CHARACTERS.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&
  (state.learned||[]).includes(l.id))).length;
 return '<section class="p51-overview" aria-label="P51 advanced HSK 5-targeted Mandarin">'+
 '<header class="p51-hero"><p class="eyebrow">P51 · ORIGINAL ADVANCED MANDARIN BRIDGE</p>'+
 '<h2>Reason across records. Choose precise Mandarin. Defend a conclusion.</h2>'+
 '<p>20 original contextual characters, 40 register-aware word families, eight advanced discourse constructions, four 16-sentence reading dossiers, four multi-speaker conversations and four original argumentative production briefs.</p>'+
 '<p class="muted">Editorial HSK 5 target, not an official HSK list, automatic proficiency grade or native-speaker recording.</p>'+
 '<p>'+shown+' / 24 character lessons introduced · '+dueCards(state).length+
 ' genuinely due cards across the original scheduler</p>'+
 act('p51-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</header>'+
 (compact?act('p51-enter','Enter advanced HSK 5-targeted discourse →','button outline'):
 '<label for="p51-search">Search Chinese, source meaning or scenario</label>'+
 '<input id="p51-search" type="search" value="'+esc(query)+'" placeholder="e.g. 效率, survey, evidence">'+
 '<div class="p51-cases">'+filtered.map(p=>{
 const e=p51Evidence(state,p);
 const last=x=>!x?'not attempted':x.correct?(x.assisted?'correct with help':'correct independently'):'incorrect';
 return act('p51-open','<small>CASE '+p.sequence+' · '+esc(p.theme)+'</small><strong>'+esc(p.title)+'</strong>'+
 '<span>'+esc(p.goal)+'</span><em>Reader '+last(e.lastReading)+' · Dialogue '+last(e.lastListening)+
 ' · '+e.introduced.length+'/5 character lessons introduced</em>',
 'p51-case '+(selected===p.id?'active':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+
 (!filtered.length?'<p class="muted">No original P51 cases match the current query.</p>':'')+
 '<div class="p51-actions">'+act('p51-review','Original scheduled Review →','button outline')+
 act('p49-enter','P49 cumulative transfer →','button outline')+'</div>')+'</section>';
}
function renderLine(l,i,assist,act,esc){
 return '<div class="p51-line"><span>'+(i+1)+'</span><div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (assist?'<small>'+esc(l.pinyin)+'</small><span>'+esc(l.english)+'</span>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>';
}
export function p51Lesson(p,state,act,esc,{stage='language',readingHelp=false,
 listeningHelp=false,models=false,readingIndex=0,listeningIndex=0,
 readingFeedback=null,listeningFeedback=null,checks=[]}={}){
 if(!p)return '';
 const e=p51Evidence(state,p),d=P51_DIALOGUES.find(x=>x.readingId===p.id),
  a=findP51Argument(p.id),rq=p.questions[readingIndex],lq=d?.questions[listeningIndex];
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const chosen=new Set(checks);
 return '<section class="p51-lesson" aria-label="P51 integrated advanced Mandarin">'+
 '<header class="p51-heading"><div><p class="eyebrow">P51 · CASE '+p.sequence+' / '+P51_PASSAGES.length+'</p>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(p.goal)+'</p></div>'+
 act('p51-next','Another source case →','button outline')+'</header>'+
 '<nav class="p51-stages" aria-label="Four learning stages">'+P51_STAGES.map(x=>
 act('p51-stage',esc(x.label),'p51-step '+(stage===x.id?'active':''),
 'data-stage="'+x.id+'" aria-pressed="'+(stage===x.id)+'"')).join('')+'</nav>'+
 (stage==='language'?'<div class="p51-pane"><h3>Characters, contextual word families and formal discourse</h3>'+
 '<p>Each character belongs to the original Course; its contextual expressions belong to the canonical Wordbook. New g157–g164 structures are taught and practised in the original Grammar course.</p>'+
 '<div class="p51-characters">'+e.chars.map(g=>{
 const lesson=DEMO_LESSONS.find(l=>l.hanzi===g.hanzi);
 return '<article class="p51-character"><h4 lang="zh-Hans">'+esc(g.hanzi)+' <small>'+esc(g.pinyin)+'</small></h4>'+
 '<p>'+esc(g.meaning)+'</p><p>'+esc(g.teaching)+'</p>'+
 '<p class="p51-pitfall">'+esc(g.pitfall)+'</p>'+
 g.words.map(w=>{
 const word=WORDS.find(x=>x.key===canonicalWordKey(w.hanzi,w.pinyin));
 return '<div class="p51-word"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong>'+
 '<span>'+esc(w.pinyin)+' · '+esc(w.english)+'</span>'+
 (word?act('lookup-word','Wordbook →','button outline small','data-id="'+esc(word.key)+'"'):'')+'</div>';
 }).join('')+
 g.examples.map(x=>'<div class="p51-model"><p lang="zh-Hans">'+esc(x.hanzi)+'</p>'+
 '<small>'+esc(x.pinyin)+'</small><span>'+esc(x.english)+'</span></div>').join('')+
 (lesson?act('p51-character','Study original Course lesson →','button outline small',
 'data-hanzi="'+esc(g.hanzi)+'"'):'')+'</article>';
 }).join('')+'</div>'+
 '<h3>Case-related formal grammar</h3><div class="p51-grammar">'+grammar.map(g=>
 '<article><h4>'+esc(g.pattern)+'</h4><p>'+esc(g.explanation)+'</p>'+
 '<p><strong>Contrast:</strong> '+esc(g.contrast)+'</p>'+
 '<p><strong>Misconception:</strong> '+esc(g.pitfall)+'</p>'+
 act('grammar-select','Original grammar practice →','button outline small','data-id="'+g.id+'"')+'</article>').join('')+'</div>'+
 '<div class="p51-actions">'+act('p51-stage','Continue to 16-line reading →','button primary','data-stage="read"')+'</div></div>':'')+
 (stage==='read'?'<div class="p51-pane"><h3>Read four connected source sections</h3>'+
 '<p>'+esc(p.contrast)+'</p>'+
 p.paragraphs.map(s=>'<article class="p51-source"><h4>'+esc(s.title)+'</h4>'+
 p.lines.slice(s.start,s.end+1).map((l,i)=>renderLine(l,s.start+i,readingHelp,act,esc)).join('')+
 '</article>').join('')+
 '<div class="p51-actions">'+act('p51-reading-help',readingHelp?'Hide translation support':
 'Reveal complete Pinyin and English · assisted','button outline')+'</div>'+
 '<div class="p51-question"><h4>Canonical Reader evidence '+(readingIndex+1)+' / '+p.questions.length+'</h4>'+
 '<p>'+esc(rq?.prompt||'')+'</p>'+
 (readingFeedback?'<div class="p51-feedback" role="status"><strong>'+(
 readingFeedback.revealed?'Reference revealed without an answer event':readingFeedback.correct?
 readingFeedback.assisted?'Correct, assisted':'Correct native Reader answer':'Incorrect native Reader answer')+'</strong>'+
 '<p>Reference: '+esc(rq.answer)+'</p><p><strong>Evidence line '+(rq.evidence+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(p.lines[rq.evidence]?.hanzi||'')+'</p>'+
 '<small>'+esc(p.lines[rq.evidence]?.pinyin||'')+'</small>'+
 '<p>'+esc(p.lines[rq.evidence]?.english||'')+'</p>'+
 '<p>'+esc(rq.explanation)+'</p></div>'+
 '<div class="p51-actions">'+act('p51-reader-next',readingIndex+1<p.questions.length?
 'Next evidence question →':'Continue to listening →','button primary')+
 act('p51-reader-retry','Retry independently','button outline')+'</div>':
 '<div class="p51-options">'+(rq?.options||[]).map(o=>
 act('p51-reader-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p51-actions">'+act('p51-reader-model','Reveal reference · assisted','button outline')+
 act('p51-stage','Continue without submission →','button outline','data-stage="listen"')+'</div>')+'</div></div>':'')+
 (stage==='listen'?'<div class="p51-pane"><h3>Track each speaker's evidence and objection</h3>'+
 '<p>Listen before opening the transcript. Device synthesized playback is not recorded human speech or a pronunciation assessment.</p>'+
 '<div class="p51-actions">'+act('p51-play','Play full debate','button primary')+
 act('p51-play-slow','Replay slowly','button outline')+
 act('p51-listening-help',listeningHelp?'Hide bilingual transcript':
 'Reveal bilingual transcript · assisted','button outline')+'</div>'+
 (d?.turns||[]).map((t,i)=>'<div class="p51-turn"><strong>'+esc(t.speaker)+'</strong><div>'+
 (listeningHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p>'+
 '<small>'+esc(t.pinyin)+'</small><span>'+esc(t.english)+'</span>':
 '<p>Listen and distinguish observation, inference, proposal or approved action.</p>')+'</div>'+
 act('p51-turn-play','Hear turn '+(i+1),'button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p51-question"><h4>Original Dialogue evidence '+(listeningIndex+1)+' / '+(d?.questions.length||0)+'</h4>'+
 '<p>'+esc(lq?.prompt||'')+'</p>'+
 (listeningFeedback?'<div class="p51-feedback" role="status"><strong>'+(
 listeningFeedback.revealed?'Reference revealed, no response submitted':listeningFeedback.correct?
 listeningFeedback.assisted?'Correct, assisted':'Correct native Dialogue answer':'Incorrect native Dialogue answer')+'</strong>'+
 '<p>Reference: '+esc(lq.answer)+'</p>'+
 '<p><strong>Evidence turn '+(lq.evidenceIndex+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(d.turns[lq.evidenceIndex]?.hanzi||'')+'</p>'+
 '<small>'+esc(d.turns[lq.evidenceIndex]?.pinyin||'')+'</small>'+
 '<p>'+esc(d.turns[lq.evidenceIndex]?.english||'')+'</p>'+
 '<p>'+esc(lq.explanation)+'</p></div>'+
 '<div class="p51-actions">'+act('p51-listener-next',listeningIndex+1<d.questions.length?
 'Next listening question →':'Continue to argumentation →','button primary')+
 act('p51-listener-retry','Retry','button outline')+'</div>':
 '<div class="p51-options">'+(lq?.options||[]).map(o=>
 act('p51-listener-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p51-actions">'+act('p51-listener-model','Reveal reference · assisted','button outline')+
 act('p51-stage','Continue to writing →','button outline','data-stage="produce"')+'</div>')+'</div></div>':'')+
 (stage==='produce'?'<div class="p51-pane"><h3>Independent four-paragraph argument and spoken defence</h3>'+
 '<p><strong>Task:</strong> '+esc(a?.writing||p.goal)+'</p>'+
 '<div class="p51-argument">'+[
 ['1. Source-supported position',a?.claim],
 ['2. Fair opposing argument',a?.objection],
 ['3. Evidence-backed rebuttal',a?.rebuttal],
 ['4. Revised conclusion and limit',a?.misconception]
 ].map(([t,body])=>'<article><h4>'+esc(t)+'</h4><p>'+esc(body||'')+'</p></article>').join('')+'</div>'+
 '<p><strong>Independent oral preparation:</strong> '+esc(a?.oral||p.oral)+'</p>'+
 '<p>Draft and revise in the original P43 studio; source models only provide fixed-form reconstruction. P51 never grades open writing or speech.</p>'+
 '<div class="p51-actions">'+act('p51-p43','Open original P43 writing studio →','button primary')+
 act('p51-write','Reconstruct the original reading conclusion →','button outline','data-kind="reading"')+'</div>'+
 '<h3>Manual evidence and revision checks</h3>'+
 P51_REVISION.map(x=>act('p51-check',
 '<strong>'+(chosen.has(x.id)?'☑ ':'☐ ')+esc(x.title)+'</strong><span>'+esc(x.prompt)+'</span>',
 'p51-check '+(chosen.has(x.id)?'checked':''),'data-id="'+x.id+'" role="checkbox" aria-checked="'+chosen.has(x.id)+'"')).join('')+
 '<p class="p51-disclosure">'+chosen.size+' / '+P51_REVISION.length+
 ' checked this tab; not a grade or saved proficiency result.</p>'+
 '<div class="p51-actions">'+act('p51-models',models?'Hide source models':
 'Reveal Pinyin/English models · assisted','button outline')+'</div>'+
 (models?(a?.models||[]).map((m,i)=>'<div class="p51-model"><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><span>'+esc(m.english)+'</span>'+
 '<p>'+esc(m.purpose)+'</p></div>').join(''):'')+
 (a?.models||[]).map((m,i)=>'<div class="p51-actions">'+
 act('p51-argument-write','Exact-form model '+(i+1)+' →','button outline','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p51-actions">'+act('p51-next','Apply to another debate →','button primary')+'</div></div>':'')+
 '<aside class="p51-evidence"><h3>Original learner evidence</h3>'+
 '<p>'+e.reading.length+' Reader submissions · '+e.listening.length+
 ' Dialogue submissions · '+e.writing.length+' exact Sentence Workshop events · '+
 e.introduced.length+'/5 introduced characters · '+e.scheduled.length+
 ' character groups currently due in the original scheduler.</p>'+
 '<div class="p51-actions">'+act('p51-review','Original due Review →','button outline')+
 (p.priorCase?act('p50-open','P50 source prerequisite '+esc(p.priorCase)+' →','button outline',
 'data-id="'+esc(p.priorCase)+'"'):'')+
 act('p50-enter','P50 original advanced discourse →','button outline')+
 act('p49-enter','P49 independent transfer →','button outline')+'</div></aside>'+
 '<p class="p51-disclosure">All assistance is explicitly shown, all native fixed-reference answers retain their original event writers, and no duplicate scheduled or personal-data store was created. Original instructional material is not official HSK certification.</p>'+
 '</section>';
}
