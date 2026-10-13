/** P45 cumulative learner interface. Original scheduled recall remains in Review;
 * per-source evidence is read-only; new answers use existing dialogue/workshop.
 */
import {P45_TRANSFERS,p45Evidence} from './p45-course.mjs';
import {p45Recommendations,p45EvidenceFor,p45Summary} from './p45-review.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
import {DIALOGUES,dialogueQuestion} from './dialogues.mjs';
const linkFor=scene=>DIALOGUES.find(d=>d.p45?.id===scene.id);
const groupName=i=>i<6?'Foundation transfer':i<12?'Evidence and interpretation':'Independent revision';
export function p45Overview(state,act,esc,{compact=false,selected=null,filter='all'}={}){
 const stats=p45Summary(state),recs=p45Recommendations(state);
 const items=recs.filter(x=>filter==='all'||filter==='needs'&&x.evidence.missed.length||
 filter==='new'&&!x.evidence.events[0].event||filter==='independent'&&x.evidence.events[0].event?.correct&&!x.evidence.events[0].event?.assisted);
 const next=recs[0];
 return '<section class="p45-overview" aria-label="P45 cumulative review and independent transfer">'+
 '<div class="p45-hero"><div><p class="eyebrow">P45 · ORIGINAL CUMULATIVE TRANSFER</p>'+
 '<h2>Return to evidence. Apply the meaning independently.</h2>'+
 '<p>Eighteen mixed-skill original Mandarin challenges with 72 contextual spoken lines, 36 native comprehension checks and 18 exact-form written responses. Each reconnects historical P39 characters, P40 grammar, P41 reading, P42 listening, P43 writing and P44 integrated situations.</p>'+
 '<p class="muted">Practice statuses are based on the original native event histories, not a second progress store or predicted CEFR/HSK mastery. Source evidence and due reviews remain separate.</p></div>'+
 '<div class="p45-count"><strong>'+stats.casesAttempted+' / '+P45_TRANSFERS.length+'</strong><span>Cases with native answer attempts</span>'+
 '<strong>'+stats.casesWithIndependentCorrect+' / '+P45_TRANSFERS.length+'</strong><span>Cases with at least one independently correct dialogue response (not mastery)</span>'+
 (next?act('p45-open','Suggested: '+esc(next.caseItem.title)+' →','button primary','data-id="'+next.caseItem.id+'"'):'')+'</div></div>'+
 (compact?act('p45-enter','Open cumulative transfer workspace →','button outline'):
 '<nav class="p45-filters" aria-label="Evidence-based filters">'+
 [['all','All 18'],['needs','Missed or assisted source work'],['new','No P45 attempt'],['independent','Independent answer']].map(([key,label])=>
 act('p45-filter',label,'p45-filter '+(filter===key?'active':''),'data-filter="'+key+'" aria-pressed="'+(filter===key)+'"')).join('')+'</nav>'+
 '<div class="p45-grid">'+items.map(x=>{
 const s=x.caseItem,ev=x.evidence;
 return act('p45-open','<small>TRANSFER '+String(s.sequence).padStart(2,'0')+' · '+esc(groupName(s.sequence-1))+'</small>'+
 '<strong>'+esc(s.title)+'</strong><span>'+esc(x.action)+'</span>'+
 '<em>'+esc(ev.events[0].status)+' · '+ev.dueCards.length+' linked P39 scheduled cards due</em>',
 'p45-card '+(selected===s.id?'selected':''),'data-id="'+s.id+'"');
 }).join('')+'</div>'+
 (!items.length?'<p class="muted">No challenges match this recorded-evidence filter. The original review queue may still contain other due material.</p>':'')+
 '<div class="p45-actions">'+act('p45-native-review','Open original due-card Review →','button outline')+
 act('p45-next','Try another source-backed challenge →','button outline')+'</div>')+
 '</section>';
}
export function p45Learning(s,state,act,esc,{stage='read',revealed=false,sourceHelp=false,assisted=false,questionIndex=0,feedback=null}={}){
 if(!s)return '';
 const current=p45EvidenceFor(state,s),source=s.sourceCase;
 const native=linkFor(s),q=native&&dialogueQuestion(native.id,questionIndex);
 const anchor=feedback?p45Evidence(s.id,questionIndex):null;
 const known=P39_CHARACTER_GUIDES.filter(x=>s.turns.some(t=>t.hanzi.includes(x.hanzi))).slice(0,6);
 const grammar=s.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const words=WORDS.filter(w=>w.hanzi.length>1&&s.turns.some(t=>t.hanzi.includes(w.hanzi))).slice(0,6);
 return '<section class="p45-learning" aria-label="Cumulative source-linked learner workspace">'+
 '<header class="p45-case-header"><div><p class="eyebrow">P45 · CASE '+s.sequence+' / '+P45_TRANSFERS.length+' · '+esc(s.theme)+'</p>'+
 '<h2>'+esc(s.title)+'</h2><p>'+esc(s.goal)+'</p></div>'+
 act('p45-next','Another case →','button outline')+'</header>'+
 '<nav class="p45-steps" aria-label="Cumulative learning steps">'+
 [['read','1 · Recall source'],['listen','2 · Hear exchange'],['check','3 · Decide'],['produce','4 · Produce & return']].map(([key,label])=>
 act('p45-stage',label,'p45-step '+(stage===key?'active':''),'data-stage="'+key+'" aria-pressed="'+(stage===key)+'"')).join('')+'</nav>'+
 (stage==='read'?'<div class="p45-source"><h3>Read the underlying record before answering</h3>'+
 '<p>'+esc(s.goal)+'</p>'+
 (source?source.brief.map((l,i)=>'<div class="p45-source-line"><span>'+String(i+1)+'</span><div><p lang="zh-Hans">'+esc(l.hanzi)+'</p>'+
 (sourceHelp?'<small class="p45-pronunciation">'+esc(l.pinyin)+'</small><small>'+esc(l.english)+'</small>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(l.hanzi)+'"')+'</div>').join(''):'')+
 '<div class="p45-actions">'+act('p45-source-help',sourceHelp?'Hide translation':'Reveal source translation · assisted','button outline')+
 (source?act('p44-open','Open the original P44 applied source →','button outline','data-id="'+source.id+'"'):'')+
 act('p45-stage','Continue to listening →','button primary','data-stage="listen"')+'</div>'+
 '<aside class="p45-repair"><strong>Meaning contrast</strong><p>'+esc(s.pitfall)+'</p></aside></div>':'')+
 (stage==='listen'?'<div class="p45-audio"><h3>Listen without a visible transcript first</h3>'+
 '<p>Device-synthesized Mandarin, not recorded native-speaker audio or an oral assessment.</p>'+
 '<div class="p45-actions">'+act('p45-play','Play full dialogue','button primary')+
 act('p45-play-slow','Replay slower','button outline')+
 act('p45-transcript',revealed?'Hide transcript':'Reveal complete Hanzi, Pinyin & English · assisted','button outline')+'</div>'+
 s.turns.map((line,i)=>'<div class="p45-turn"><strong>'+esc(line.speaker)+' / '+(i+1)+'</strong><div>'+
 (revealed?'<p lang="zh-Hans">'+esc(line.hanzi)+'</p><small class="p45-pronunciation">'+esc(line.pinyin)+'</small><small>'+esc(line.english)+'</small>':
 '<p>Listen to this spoken turn. Identify the speaker’s intention before revealing the text.</p>')+
 '</div>'+act('p45-turn-audio','Hear turn','button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p45-actions">'+act('p45-stage','Check the implied meaning →','button primary','data-stage="check"')+'</div></div>':'')+
 (stage==='check'?'<div class="p45-check"><h3>Independent contextual decision '+(questionIndex+1)+' / '+s.questions.length+'</h3>'+
 '<p>'+esc(q?.prompt||'Source question unavailable')+'</p>'+
 (feedback?'<div class="p45-feedback" role="status"><strong>'+(
 feedback.correct?(feedback.assisted?'Correct response, assisted':'Correct native answer recorded independently'):
 'Not the reference answer')+'</strong><p>Reference: '+esc(q?.answer||'')+'</p>'+
 (anchor?'<div><span>Source turn '+(anchor.turn+1)+'</span><p lang="zh-Hans">'+esc(anchor.line.hanzi)+'</p>'+
 '<small class="p45-pronunciation">'+esc(anchor.line.pinyin)+'</small><p>'+esc(anchor.line.english)+'</p>'+
 '<p>'+esc(anchor.reason)+'</p></div>':'')+
 '<p class="muted">Recorded only by the original dialogue event writer; no mastery, score prediction or separate scheduler.</p></div>'+
 '<div class="p45-actions">'+act('p45-question-next',questionIndex+1<s.questions.length?'Next question →':'Continue to written transfer →','button primary')+
 act('p45-question-retry','Try question again','button outline')+'</div>':
 '<div class="p45-choices">'+(q?.options||[]).map(opt=>act('p45-answer',esc(opt),'choice','data-option="'+esc(opt)+'"')).join('')+'</div>'+
 '<div class="p45-actions">'+act('p45-reveal','Show reference · assisted','button outline')+
 act('p45-stage','Skip to written transfer →','button outline','data-stage="produce"')+'</div>')+'</div>':'')+
 (stage==='produce'?'<div class="p45-produce"><h3>Produce a justified response from memory</h3>'+
 '<p>'+esc(s.oral)+'</p><p>Write the original fixed response in the canonical Sentence Workshop. Then speak a different wording aloud and check the source yourself. The app does not grade original paragraphs or spoken responses.</p>'+
 '<div class="p45-actions">'+act('p45-write','Native exact sentence reconstruction →','button primary')+
 (source?act('p43-open','Original P43 two-paragraph composition →','button outline','data-id="'+source.writingId+'"'):'')+
 act('p45-oral-model','Hear model as device speech · assisted','button outline')+'</div>'+
 '<div class="p45-repair"><strong>Misconception-specific repair</strong><p>'+esc(s.pitfall)+'</p>'+
 '<p>Try correcting the false interpretation in one Chinese sentence without copying the reference.</p></div>'+
 '<div class="p45-actions">'+act('p45-next','Try independent transfer with another source →','button primary')+'</div></div>':'')+
 '<aside class="p45-evidence"><h3>Original learner evidence (read-only)</h3>'+
 '<p>'+esc(current.reason)+'</p><div class="p45-evidence-grid">'+current.events.map(v=>'<div><strong>'+esc(v.name)+'</strong><span>'+esc(v.status)+'</span></div>').join('')+'</div>'+
 '<div class="p45-actions">'+act('p45-native-review','Original scheduled Review ('+current.dueCards.length+' P39 cards linked here) →','button outline')+
 (source?act('p41-open','P41 source reading →','button outline small','data-id="'+source.readingId+'"'):'')+
 (source?act('p42-open','P42 contextual listening →','button outline small','data-id="'+source.dialogueId+'"'):'')+
 (source?act('p44-open','P44 five-skill case →','button outline small','data-id="'+source.id+'"'):'')+'</div>'+
 '<div class="p45-actions">'+grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+
 known.map(g=>act('p39-open',esc(g.hanzi)+' · '+esc(g.pinyin),'button outline small','data-id="'+g.id+'"')).join('')+
 words.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin),'button outline small','data-id="'+w.key+'"')).join('')+'</div></aside>'+
 '<p class="p45-disclosure">Source-help selection and the active stage are temporary tab context, not another progress record. The canonical review scheduler alone determines which introduced characters are due. Comprehension and fixed-form writing are individual practice events; unassisted correct answers are not equivalent to HSK certification.</p>'+
 '</section>';
}
