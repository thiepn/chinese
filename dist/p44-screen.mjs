/** P44 integrated learning presentation; canonical reader, dialogue, writing and
 * scheduler remain the only assessors. All phase selection is tab/UI context.
 */
import {P44_SCENARIOS,P44_PHASES,p44Evidence} from './p44-course.mjs';
import {P45_TRANSFERS} from './p45-course.mjs';
import {DIALOGUES,dialogueQuestion} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {WORDS} from './lexicon.mjs';

const dialogueFor=s=>DIALOGUES.find(d=>d.p44?.id===s.id)||null;
export function p44Next(state,after=null){
 const index=P44_SCENARIOS.findIndex(s=>s.id===after);
 const ordered=index<0?P44_SCENARIOS:[...P44_SCENARIOS.slice(index+1),...P44_SCENARIOS.slice(0,index+1)];
 return ordered.find(s=>{
  const native=dialogueFor(s);
  return native&&!(state.dialogueEvents||[]).some(e=>e.dialogueId===native.id&&e.correct&&!e.assisted);
 })||ordered[0]||P44_SCENARIOS[0];
}
export function p44Overview(state,act,esc,{compact=false,selected='',query='',page=0}={}){
 const q=String(query||'').trim().toLocaleLowerCase();
 const items=P44_SCENARIOS.filter(s=>!q||[s.title,s.theme,s.goal,s.pitfall,s.revision,
 ...s.brief.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const maxPage=Math.max(0,Math.ceil(items.length/6)-1),current=Math.max(0,Math.min(maxPage,Number(page)||0));
 const engaged=P44_SCENARIOS.filter(s=>(state.dialogueEvents||[]).some(e=>e.dialogueId===dialogueFor(s)?.id)).length;
 const practiced=P44_SCENARIOS.filter(s=>(state.dialogueEvents||[]).some(e=>
  e.dialogueId===dialogueFor(s)?.id&&e.correct&&!e.assisted)).length;
 const next=p44Next(state);
 return '<section class="p44-overview" aria-label="P44 applied integrated Mandarin">'+
 '<div class="p44-hero"><div><p class="eyebrow">P44 · ORIGINAL INTEGRATED SKILLS</p>'+
 '<h2>Read → Listen → Understand → Write → Speak</h2>'+
 '<p>Twelve integrated Mandarin communication cases. Each supplies a complete five-sentence message, a four-turn spoken exchange, two evidence-specific questions and two native exact-response models, with P41 reading, P42 listening and P43 composition handoffs. Original authored teaching materials, not official HSK 3.0 certification.</p></div>'+
 '<div class="p44-progress"><strong>'+engaged+' / '+P44_SCENARIOS.length+'</strong><span>Native conversations attempted</span>'+
 '<strong>'+practiced+' / '+P44_SCENARIOS.length+'</strong><span>Independent correct dialogue response recorded; not mastery</span>'+
 act('p44-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div></div>'+
 (compact?act('p44-enter','Open the integrated course →','button outline'):
 '<label for="p44-search">Search situations, source meaning, or Chinese vocabulary</label>'+
 '<input type="search" id="p44-search" value="'+esc(query)+'" placeholder="e.g. 考虑, scheduling, evidence">'+
 '<div class="p44-cards">'+items.slice(current*6,current*6+6).map(s=>{
  const dialogue=dialogueFor(s),attempts=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id).length;
  return act('p44-open','<small>CASE '+String(s.sequence).padStart(2,'0')+' · '+esc(s.theme)+'</small>'+
   '<strong>'+esc(s.title)+'</strong><span>'+esc(s.goal)+'</span>'+
   '<em>5 source lines · 4 spoken turns · '+attempts+' native question attempts</em>',
   'p44-case '+(selected===s.id?'selected':''),'data-id="'+s.id+'"');
 }).join('')+'</div>'+(!items.length?'<p class="muted">No source scenarios match that search.</p>':'')+
 '<nav class="p44-pager" aria-label="Scenario pages">'+
 act('p44-prev-page','← Earlier','button outline small',current>0?'':'disabled')+
 '<span>'+(current+1)+' / '+(maxPage+1)+'</span>'+
 act('p44-next-page','More →','button outline small',current<maxPage?'':'disabled')+'</nav>')+'</section>';
}
export function p44Journey(s,state,act,esc,{phase='read',sourceHelp=false,transcriptHelp=false,assisted=false,questionIndex=0,feedback=null}={}){
 if(!s)return '';
 const native=dialogueFor(s),question=dialogueQuestion(native?.id,questionIndex);
 const transfers=P45_TRANSFERS.filter(t=>t.sourceId===s.id);
 const sourceEvidence=feedback?p44Evidence(s.id,questionIndex):null;
 const grammar=s.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const chars=P39_CHARACTER_GUIDES.filter(g=>s.brief.some(l=>l.hanzi.includes(g.hanzi))).slice(0,5);
 const words=WORDS.filter(w=>w.hanzi.length>1&&s.brief.some(l=>l.hanzi.includes(w.hanzi))).slice(0,7);
 const evidence=(state.dialogueEvents||[]).filter(e=>e.dialogueId===native?.id);
 const n=P44_PHASES.findIndex(p=>p.id===phase);
 return '<section class="p44-journey" aria-label="Five skill stages">'+
 '<header class="p44-heading"><div><p class="eyebrow">INTEGRATED CASE '+s.sequence+' / '+P44_SCENARIOS.length+' · '+esc(s.theme)+'</p>'+
 '<h2>'+esc(s.title)+'</h2><p>'+esc(s.goal)+'</p></div>'+
 act('p44-next-case','Next case →','button outline')+'</header>'+
 '<nav class="p44-steps" aria-label="Skill journey">'+P44_PHASES.map((p,i)=>
  act('p44-stage','<small>'+(i+1)+'</small><span>'+esc(p.name)+'</span>',
  'p44-step '+(phase===p.id?'active':''),'data-stage="'+p.id+'" aria-pressed="'+(phase===p.id)+'"')).join('')+'</nav>'+
 '<p class="p44-context">'+esc(P44_PHASES[n]?.description||'Choose a stage')+'</p>'+
 (phase==='read'?'<article class="p44-reading"><h3>Original message: read before checking the meaning</h3>'+
 '<p>'+esc(s.goal)+'</p>'+
 s.brief.map((l,i)=>'<div class="p44-line"><span>'+(i+1)+'</span><div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (sourceHelp?'<small class="p44-pinyin">'+esc(l.pinyin)+'</small><small>'+esc(l.english)+'</small>':'')+'</div>'+
 act('speak','Listen','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>').join('')+
 '<div class="p44-actions">'+act('p44-source-help',sourceHelp?'Hide translations':'Show Pinyin and English · assisted','button outline')+
 act('p41-open','Study the longer P41 source →','button outline','data-id="'+s.readingId+'"')+
 act('p44-stage','Continue to listening →','button primary','data-stage="listen"')+'</div>'+
 '<aside class="p44-mistake"><strong>Meaning to protect</strong><p>'+esc(s.pitfall)+'</p></aside></article>':'')+
 (phase==='listen'?'<article class="p44-listening"><h3>Listen before revealing the transcript</h3>'+
 '<p>These are original scripted turns read by your device synthesizer, not recorded speech. Listening is self-directed; no spoken-language rating is generated.</p>'+
 '<div class="p44-actions">'+act('p44-audio','Play complete exchange','button primary')+
 act('p44-audio-slow','Replay slowly','button outline')+
 act('p44-transcript',transcriptHelp?'Hide language support':'Reveal Chinese, Pinyin and English · assisted','button outline')+'</div>'+
 s.turns.map((t,i)=>'<div class="p44-turn"><strong>'+esc(t.speaker)+' · '+(i+1)+'</strong>'+
 '<div>'+(transcriptHelp?'<p lang="zh-Hans">'+esc(t.hanzi)+'</p><small class="p44-pinyin">'+esc(t.pinyin)+'</small>'+
 '<small>'+esc(t.english)+'</small>':'<p>Listen to the spoken turn, identify the speaker’s intention, and try to repeat it.</p>')+'</div>'+
 act('p44-play-turn','Play turn','button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p44-actions">'+act('p42-open','Related P42 conversation →','button outline','data-id="'+s.dialogueId+'"')+
 act('p44-stage','Check the spoken evidence →','button primary','data-stage="understand"')+'</div></article>':'')+
 (phase==='understand'?'<article class="p44-questions"><h3>Native comprehension · question '+(questionIndex+1)+' / '+s.questions.length+'</h3>'+
 '<p>'+esc(question?.prompt||'No question available')+'</p>'+
 (feedback?'<div class="p44-evidence" role="status"><strong>'+(
 feedback.correct?(feedback.assisted?'Correct response · assisted':'Correct native response recorded'):'Review the exact source')+'</strong>'+
 '<p>Reference answer: '+esc(question?.answer||'')+'</p>'+
 (sourceEvidence?'<p><strong>Supporting spoken turn '+(sourceEvidence.turn+1)+':</strong></p>'+
 '<p lang="zh-Hans">'+esc(sourceEvidence.model.hanzi)+'</p><small class="p44-pinyin">'+esc(sourceEvidence.model.pinyin)+'</small>'+
 '<p>'+esc(sourceEvidence.model.english)+'</p><p>'+esc(sourceEvidence.explanation)+'</p>':'')+
 '<p class="muted">'+(feedback.assisted?'Assisted dialogue practice only.':'Native dialogue evidence, not scheduled recall mastery.')+'</p></div>'+
 '<div class="p44-actions">'+act('p44-question-next',questionIndex+1<s.questions.length?'Next evidence question →':'Continue to writing →','button primary')+
 act('p44-question-retry','Retry this question','button outline')+'</div>':
 '<div class="p44-choices">'+(question?.options||[]).map(opt=>act('p44-answer',esc(opt),'choice','data-option="'+esc(opt)+'"')).join('')+'</div>'+
 '<div class="p44-actions">'+act('p44-reveal-answer','Reveal reference · assisted','button outline')+
 act('p44-stage','Continue without answering →','button outline','data-stage="write"')+'</div>')+
 '<p class="muted">'+evidence.length+' total attempts in original dialogue history for this P44 exchange. Assistance already shown on this case: '+(assisted?'yes':'no')+'.</p></article>':'')+
 (phase==='write'?'<article class="p44-transfer"><h3>Write from the combined evidence</h3>'+
 '<p>'+esc(s.revision)+'</p><p><strong>Native fixed sentence models:</strong> These check exact taught forms only. An original P43 composition is separate self-review, not automatically graded.</p>'+
 '<div class="p44-actions">'+act('p44-write','Write response 1 in Sentence Workshop →','button primary','data-index="0"')+
 act('p44-write','Write response 2 →','button outline','data-index="1"')+
 act('p43-open','Compose two original paragraphs in P43 →','button outline','data-id="'+s.writingId+'"')+'</div>'+
 '<p class="p44-mistake"><strong>Revision focus:</strong> '+esc(s.pitfall)+'</p>'+
 '<div class="p44-actions">'+act('p44-stage','Prepare independent speaking →','button primary','data-stage="speak"')+'</div></article>':'')+
 (phase==='speak'?'<article class="p44-oral"><h3>Explain the evidence aloud, independently</h3>'+
 '<ol><li>State what the original written notice or record established.</li>'+
 '<li>Describe what the speakers asked, doubted or confirmed.</li>'+
 '<li>Give a justified response without overstating an uncertain claim.</li>'+
 '<li>Try again without looking at a model, then self-check the source.</li></ol>'+
 '<p><strong>Common error to avoid:</strong> '+esc(s.pitfall)+'</p>'+
 '<p>This is speaking practice, not microphone recognition or a graded oral exam.</p>'+
 '<div class="p44-actions">'+act('p44-oral-model','Hear a source-backed spoken model · assisted','button outline')+
 act('p44-next-case','Continue to another scenario →','button primary')+'</div></article>':'')+
 '<aside class="p44-connect"><h3>Source-linked course connections</h3><div class="p44-actions">'+
 transfers.map(t=>act('p45-open','Cumulative transfer '+t.sequence+': '+esc(t.title)+' →','button outline small','data-id="'+t.id+'"')).join('')+
 act('p41-open','P41 · Original reading →','button outline small','data-id="'+s.readingId+'"')+
 act('p42-open','P42 · Spoken practice →','button outline small','data-id="'+s.dialogueId+'"')+
 act('p43-open','P43 · Independent composition →','button outline small','data-id="'+s.writingId+'"')+'</div>'+
 '<div class="p44-actions">'+grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+
 chars.map(g=>act('p39-open',esc(g.hanzi)+' · '+esc(g.pinyin),'button outline small','data-id="'+g.id+'"')).join('')+
 words.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin),'button outline small','data-id="'+w.key+'"')).join('')+'</div></aside>'+
 '<p class="p44-disclosure">All new cases are original intermediate teaching content only; their phase selection and source-help indicators live in this tab, not a second progress store. Native dialogue and exact-sentence submissions alone use existing owner-scoped practice authorities. Device speech synthesis is not recorded audio; open-ended writing and speaking are not automatically graded or certified.</p></section>';
}
