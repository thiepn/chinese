/** P47 original upper-intermediate contextual learning course.
 * This presentation reads canonical learner evidence and invokes original
 * action names; no separate grading, progress, SRS or HSK level authority.
 */
import {P47_CHARACTER_GUIDES} from './p47-foundations.mjs';
import {P47_PASSAGES} from './p47-readings.mjs';
import {P47_DIALOGUES} from './p47-dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {dueCards} from './study.mjs';
import {findP47Production} from './p47-production.mjs';
export const P47_STAGES=Object.freeze([
 {id:'words',label:'Words & characters'},{id:'grammar',label:'Discourse grammar'},
 {id:'read',label:'Read 4 paragraphs'},{id:'listen',label:'Hear 8 turns'},
 {id:'produce',label:'Independent transfer'}
].map(x=>Object.freeze(x)));
export const p47Story=p=>STORIES.find(x=>x.beginner?.p47?.id===p.id)||null;
export const p47NativeDialogue=p=>DIALOGUES.find(x=>x.p47?.readingId===p.id)||null;
export function p47Evidence(state,p){
 const story=p47Story(p),dialogue=p47NativeDialogue(p);
 const reading=(state.readingEvents||[]).filter(e=>e.storyId===story?.id);
 const listening=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id);
 const sentences=(state.sentenceEvents||[]).filter(e=>
  e.taskId==='beginner-reading:'+story?.id+':writing'||
  e.taskId?.startsWith('p47:dialogue:'+dialogue?.p47?.id+':'));
 const chars=P47_CHARACTER_GUIDES.slice((p.sequence-1)*4,p.sequence*4);
 const learned=new Set(state.learned||[]);
 const introduced=chars.filter(c=>DEMO_LESSONS.some(l=>l.hanzi===c.hanzi&&learned.has(l.id)));
 const due=new Set(dueCards(state));
 const scheduled=chars.filter(c=>DEMO_LESSONS.some(l=>l.hanzi===c.hanzi&&
  [...due].some(id=>id.startsWith(l.id+':'))));
 const native=(arr)=>arr.some(e=>e.correct&&!e.assisted);
 const last=(arr)=>arr.length?arr[arr.length-1]:null;
 return {story,dialogue,reading,listening,sentences,chars,introduced,scheduled,
  hasIndependentReading:native(reading),hasIndependentDialogue:native(listening),
  lastReading:last(reading),lastListening:last(listening)};
}
export function p47Next(state,after=null){
 const index=P47_PASSAGES.findIndex(p=>p.id===after);
 const order=index<0?P47_PASSAGES:[...P47_PASSAGES.slice(index+1),...P47_PASSAGES.slice(0,index+1)];
 return order.find(p=>{
  const e=p47Evidence(state,p);
  return e.lastReading&&!e.lastReading.correct||
   e.lastListening&&!e.lastListening.correct||
   e.lastReading?.assisted||e.lastListening?.assisted;
 })||order.find(p=>{
  const e=p47Evidence(state,p);return !e.reading.length||!e.listening.length;
 })||order[0]||P47_PASSAGES[0];
}
function wordDetails(s,act,esc){
 const record=WORDS.find(w=>w.key===canonicalWordKey(s.hanzi,s.pinyin));
 return '<div class="p47-term"><strong lang="zh-Hans">'+esc(s.hanzi)+'</strong>'+
  '<span>'+esc(s.pinyin)+' · '+esc(s.english)+'</span>'+
  (record?act('lookup-word','Wordbook →','button outline small','data-id="'+esc(record.key)+'"'):'')+'</div>';
}
export function p47Overview(state,act,esc,{compact=false,selected='',query=''}={}){
 const next=p47Next(state),q=String(query||'').trim().toLocaleLowerCase();
 const cases=P47_PASSAGES.filter(p=>!q||[p.title,p.theme,p.goal,p.contrast,
 ...p.lines.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q));
 const introduced=P47_CHARACTER_GUIDES.filter(c=>DEMO_LESSONS.some(l=>
  l.hanzi===c.hanzi&&(state.learned||[]).includes(l.id))).length;
 const independent=P47_PASSAGES.filter(p=>{
  const ev=p47Evidence(state,p);return ev.hasIndependentReading&&ev.hasIndependentDialogue;
 }).length;
 return '<section class="p47-overview" aria-label="P47 contextual vocabulary and grammar">'+
 '<div class="p47-hero"><p class="eyebrow">P47 · ORIGINAL UPPER-INTERMEDIATE</p>'+
 '<h2>Read the evidence. Connect the argument. Explain independently.</h2>'+
 '<p>24 original characters with contextual word families, twelve advanced discourse structures, six four-paragraph readings and six eight-turn spoken cases. Historical P31–P46 learning records stay authoritative.</p>'+
 '<p class="muted">Original HSK 4-targeted material; not an official syllabus or verified proficiency level. Device speech is synthesized and free production is self-assessed.</p>'+
 '<div class="p47-stats"><span><strong>'+introduced+' / '+P47_CHARACTER_GUIDES.length+
 '</strong> new character lessons introduced</span><span><strong>'+independent+' / '+P47_PASSAGES.length+
 '</strong> cases with independent correct reading and listening evidence (not mastery)</span></div>'+
 act('p47-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div>'+
 (compact?act('p47-enter','Open contextual advanced practice →','button outline'):
 '<label for="p47-search">Search Chinese, situations and meaning contrasts</label>'+
 '<input id="p47-search" type="search" value="'+esc(query)+'" placeholder="e.g. 隐私, consent, evidence">'+
 '<div class="p47-units">'+cases.map(p=>{
 const ev=p47Evidence(state,p);
 const last=ev.lastReading||ev.lastListening;
 const status=last?(last.correct&&!last.assisted?'last answer correct independently':
 last.correct?'last answer correct with help':'last answer incorrect'):'no recorded answer';
 return act('p47-open','<small>CASE '+p.sequence+' · '+esc(p.theme)+'</small>'+
 '<strong>'+esc(p.title)+'</strong><span>'+esc(p.goal)+'</span>'+
 '<em>'+ev.introduced.length+'/4 characters introduced · '+esc(status)+
 ' · '+ev.scheduled.length+' linked character(s) with genuinely due cards</em>',
 'p47-unit '+(p.id===selected?'active':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+(!cases.length?'<p class="muted">No original P47 cases match this search.</p>':'')+
 '<div class="p47-actions">'+act('p47-review','Open canonical scheduled Review →','button outline')+
 act('p46-enter','Return to P46 upper-intermediate foundations →','button outline')+
 act('p48-enter','Continue to P48 multi-source reading and argumentation →','button primary')+'</div>')+'</section>';
}
export function p47Lesson(p,state,act,esc,{stage='words',readingHelp=false,listeningHelp=false,
 readingIndex=0,listeningIndex=0,readingFeedback=null,listeningFeedback=null,assisted=false,productionModels=false}={}){
 if(!p)return '';
 const ev=p47Evidence(state,p),d=P47_DIALOGUES.find(s=>s.readingId===p.id);
 const production=findP47Production(p.id);
 const rq=p.questions[readingIndex],lq=d?.questions[listeningIndex];
 const grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 return '<section class="p47-lesson" aria-label="P47 multi-skill connected case">'+
 '<header class="p47-heading"><div><p class="eyebrow">P47 · CASE '+p.sequence+' / '+P47_PASSAGES.length+'</p>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(p.goal)+'</p></div>'+
 act('p47-next','Next context →','button outline')+'</header>'+
 '<nav class="p47-steps" aria-label="Five learning sections">'+P47_STAGES.map(s=>
 act('p47-stage',esc(s.label),'p47-step '+(stage===s.id?'active':''),
 'data-stage="'+s.id+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
 (stage==='words'?'<div class="p47-pane"><h3>Contextual character and vocabulary families</h3>'+
 '<p>Study each form through its native Course card. A word family supplies a teaching context; the original Wordbook preserves lexical meanings and actual example records.</p>'+
 '<div class="p47-character-grid">'+ev.chars.map(g=>{
 const native=DEMO_LESSONS.find(l=>l.hanzi===g.hanzi);
 const learned=!!native&&(state.learned||[]).includes(native.id);
 return '<article class="p47-character"><div class="p47-hanzi"><strong lang="zh-Hans">'+esc(g.hanzi)+'</strong>'+
 '<div><span>'+esc(g.pinyin)+'</span><small>'+esc(g.meaning)+'</small></div></div>'+
 '<p>'+esc(g.teaching)+'</p><p class="p47-pitfall">'+esc(g.pitfall)+'</p>'+
 g.words.map(w=>wordDetails(w,act,esc)).join('')+
 g.examples.map(s=>'<div class="p47-model"><p lang="zh-Hans">'+esc(s.hanzi)+'</p>'+
 '<small>'+esc(s.pinyin)+'</small><span>'+esc(s.english)+'</span></div>').join('')+
 '<div class="p47-actions">'+act('p47-character',learned?'Review character in Course →':'Introduce character in Course →',
 'button outline','data-hanzi="'+esc(g.hanzi)+'"')+
 act('p47-character-write','Native exact sentence →','button outline small','data-hanzi="'+esc(g.hanzi)+'"')+'</div></article>';
 }).join('')+'</div>'+
 '<div class="p47-actions">'+act('p47-stage','Continue to discourse grammar →','button primary','data-stage="grammar"')+'</div></div>':'')+
 (stage==='grammar'?'<div class="p47-pane"><h3>Choose the argument structure, not just the connector</h3>'+
 '<p>Grammar examples below belong to the original g135–g146 series. Follow the links for the existing native meaning, cloze, ordering and production modes.</p>'+
 '<div class="p47-grammar-grid">'+grammar.map(g=>'<article><h4>'+esc(g.title)+'</h4>'+
 '<p class="p47-pattern">'+esc(g.pattern)+'</p><p>'+esc(g.explanation)+'</p>'+
 '<p><strong>Contrast:</strong> '+esc(g.contrast)+'</p>'+
 '<p class="p47-pitfall"><strong>Common error:</strong> '+esc(g.pitfall)+'</p>'+
 g.examples.map(e=>'<div class="p47-model"><p lang="zh-Hans">'+esc(e.hanzi)+'</p>'+
 '<small>'+esc(e.pinyin)+'</small><span>'+esc(e.english)+'</span></div>').join('')+
 act('grammar-select','Native Grammar activities →','button outline small','data-id="'+g.id+'"')+'</article>').join('')+'</div>'+
 '<div class="p47-actions">'+act('p47-stage','Continue to reading →','button primary','data-stage="read"')+'</div></div>':'')+
 (stage==='read'?'<div class="p47-pane"><h3>Read four connected paragraphs; explain what each establishes</h3>'+
 '<p>'+esc(p.contrast)+'</p>'+
 p.paragraphs.map((part,i)=>'<article class="p47-paragraph"><h4>'+(i+1)+'. '+esc(part.title)+'</h4>'+
 p.lines.slice(part.start,part.end+1).map((line,j)=>'<div class="p47-line"><span>'+(part.start+j+1)+'</span><div>'+
 '<p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 (readingHelp?'<small>'+esc(line.pinyin)+'</small><span>'+esc(line.english)+'</span>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(line.hanzi)+'"')+'</div>').join('')+'</article>').join('')+
 '<div class="p47-actions">'+act('p47-reading-help',readingHelp?'Hide language support':
 'Reveal Pinyin & English · assisted','button outline')+'</div>'+
 '<div class="p47-question"><h4>Native reading evidence '+(readingIndex+1)+' / '+p.questions.length+'</h4>'+
 '<p>'+esc(rq?.prompt||'')+'</p>'+
 (readingFeedback?'<div class="p47-feedback" role="status"><strong>'+(
 readingFeedback.correct?(readingFeedback.assisted?'Correct, assisted':'Correct canonical reading attempt'):
 'Review the supporting evidence')+'</strong>'+
 '<p>Reference: '+esc(rq.answer)+'</p>'+
 '<p><strong>Evidence line '+(rq.evidence+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(p.lines[rq.evidence]?.hanzi||'')+'</p>'+
 '<small>'+esc(p.lines[rq.evidence]?.pinyin||'')+'</small><p>'+esc(p.lines[rq.evidence]?.english||'')+'</p>'+
 '<p>'+esc(rq.explanation)+'</p></div>'+
 '<div class="p47-actions">'+act('p47-reader-next',readingIndex+1<p.questions.length?'Next evidence question →':'Continue to listening →',
 'button primary')+act('p47-reader-retry','Try again','button outline')+'</div>':
 '<div class="p47-answers">'+(rq?.options||[]).map(o=>act('p47-reader-answer',esc(o),'choice',
 'data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p47-actions">'+act('p47-reader-reveal','Show model · assisted','button outline')+
 act('p47-stage','Continue without submitting →','button outline','data-stage="listen"')+'</div>')+
 '</div></div>':'')+
 (stage==='listen'?'<div class="p47-pane"><h3>Listen to the eight-turn exchange before reading its script</h3>'+
 '<p>Device-generated Mandarin playback is not a native-speaker recording or microphone evaluation. Answer only from the script and source meaning.</p>'+
 '<div class="p47-actions">'+act('p47-play','Play whole exchange','button primary')+
 act('p47-play-slow','Replay slower','button outline')+
 act('p47-listening-help',listeningHelp?'Hide transcript':
 'Reveal Hanzi, Pinyin & English · assisted','button outline')+'</div>'+
 (d?.turns||[]).map((turn,i)=>'<div class="p47-turn"><strong>'+esc(turn.speaker)+' · '+(i+1)+'</strong><div>'+
 (listeningHelp?'<p lang="zh-Hans">'+esc(turn.hanzi)+'</p><small>'+esc(turn.pinyin)+'</small><span>'+esc(turn.english)+'</span>':
 '<p>Listen to the turn. Determine what is known, suggested, pending or denied.</p>')+'</div>'+
 act('p47-turn-play','Hear turn','button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p47-question"><h4>Native spoken-evidence question '+(listeningIndex+1)+' / '+(d?.questions.length||0)+'</h4>'+
 '<p>'+esc(lq?.prompt||'')+'</p>'+
 (listeningFeedback?'<div class="p47-feedback" role="status"><strong>'+(
 listeningFeedback.correct?(listeningFeedback.assisted?'Correct, assisted':'Correct canonical dialogue attempt'):
 'Review the original spoken turn')+'</strong><p>Reference: '+esc(lq.answer)+'</p>'+
 '<p><strong>Source turn '+(lq.evidenceIndex+1)+'</strong></p>'+
 '<p lang="zh-Hans">'+esc(d.turns[lq.evidenceIndex]?.hanzi||'')+'</p>'+
 '<small>'+esc(d.turns[lq.evidenceIndex]?.pinyin||'')+'</small>'+
 '<p>'+esc(d.turns[lq.evidenceIndex]?.english||'')+'</p>'+
 '<p>'+esc(lq.explanation)+'</p></div>'+
 '<div class="p47-actions">'+act('p47-listener-next',listeningIndex+1<d.questions.length?
 'Next listening question →':'Continue to independent production →','button primary')+
 act('p47-listener-retry','Try again','button outline')+'</div>':
 '<div class="p47-answers">'+(lq?.options||[]).map(o=>act('p47-listener-answer',esc(o),'choice',
 'data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p47-actions">'+act('p47-listener-reveal','Show model · assisted','button outline')+
 act('p47-stage','Continue to production →','button outline','data-stage="produce"')+'</div>')+
 '</div></div>':'')+
 (stage==='produce'?'<div class="p47-pane"><h3>Independently summarize, justify and revise</h3>'+
 '<p><strong>Independent writing:</strong> '+esc(production?.writing||p.oral)+'</p>'+
 '<p><strong>Independent spoken response:</strong> '+esc(production?.oral||p.oral)+'</p>'+
 '<p>Prepare both without consulting models first. Original P43 holds editable two-paragraph self-review in tab memory; the source sentences below are exact reconstruction only, not a free-text grader.</p>'+
 '<div class="p47-actions">'+act('p47-production-help',productionModels?'Hide bilingual model · assisted':'Show source-backed bilingual models · assisted','button outline')+'</div>'+
 (productionModels?(production?.models||[]).map((m,i)=>'<div class="p47-model"><p lang="zh-Hans">'+esc(m.hanzi)+'</p>'+
 '<small>'+esc(m.pinyin)+'</small><span>'+esc(m.english)+'</span>'+
 '<p>'+esc(m.purpose)+'</p>'+
 act('speak','Hear the model','button outline small','data-text="'+esc(m.hanzi)+'"')+'</div>').join(''):'')+
 '<div class="p47-actions">'+(production?.models||[]).map((m,i)=>
 act('p47-production-write','Reconstruct evidence response '+(i+1)+' →','button outline','data-index="'+i+'"')).join('')+'</div>'+
 '<div class="p47-actions">'+
 act('p47-write','Reconstruct reading conclusion in native Workshop →','button primary','data-kind="reading"')+
 act('p47-write','Reconstruct spoken turn 4 →','button outline','data-kind="turn3"')+
 act('p47-write','Reconstruct spoken turn 8 →','button outline','data-kind="turn7"')+
 (production?act('p43-open','Independent source-linked P43 paragraphs →','button outline','data-id="'+production.writingId+'"'):
 act('p43-enter','Independent paragraphs in P43 →','button outline'))+'</div>'+
 '<p class="p47-pitfall"><strong>Meaning to preserve:</strong> '+esc(p.contrast)+'</p>'+
 '<div class="p47-actions">'+act('p47-next','Continue to another difficult context →','button primary')+'</div></div>':'')+
 '<aside class="p47-evidence"><h3>Existing progress evidence and further practice</h3>'+
 '<p>'+ev.reading.length+' native Reader submissions; '+ev.listening.length+
 ' native Dialogue submissions; '+ev.sentences.length+' exact sentence events; '+
 ev.introduced.length+'/4 original Course introductions; '+
 ev.scheduled.length+' case-related characters with due cards in the original scheduler.</p>'+
 '<div class="p47-actions">'+act('p47-review','Open genuinely due cards in canonical Review →','button outline')+
 act('p46-enter','Earlier P46 grammar and reading foundations →','button outline')+
 act('p45-enter','P45 cumulative independent transfer →','button outline')+
 act('p44-enter','P44 five-skill integrated practice →','button outline')+
 act('p48-enter','P48 source comparison and independent argument →','button outline')+'</div></aside>'+
 '<p class="p47-disclosure">Source-help toggles and stage selection are temporary in-tab context. Native dialogue, reading, exact sentence and SRS writers are the only progress authorities. Correct responses are not official HSK certification, pronunciation assessment or open-ended writing grades.</p>'+
 '</section>';
}
