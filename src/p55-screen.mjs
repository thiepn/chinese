/** P55 advanced progression is a single navigation and presentation layer.
 * Canonical P50–P54 original sources, Reader, Dialogues, P43, Wordbook,
 * Sentence Workshop and Review remain untouched academic authorities.
 */
import {P55_BRIEFS} from './p55-briefs.mjs';
import {p55Source,p55Reference,p55BriefEvidence,p55Next,p55NativeWords} from './p55-study.mjs';
import {dueCards} from './study.mjs';
export const P55_STEPS=Object.freeze([
 {id:'sources',label:'Source comparison'},
 {id:'language',label:'Register and repair'},
 {id:'write',label:'Independent writing'},
 {id:'speak',label:'Spoken transfer'}
].map(x=>Object.freeze(x)));
const shortStatus=events=>!events.length?'No submission':events.at(-1).correct?
 events.at(-1).assisted?'Latest correct with help':'Latest independently correct':'Latest incorrect';
const sourceState=(e,c)=>'<span>'+c+': '+shortStatus(e.reading)+
 ' Reader · '+shortStatus(e.listening)+' Dialogue</span>';
function sourceCard(id,e,act,esc,{reveal=false,qIndex=0}={}){
 const source=p55Source(id),first=p55Reference(id,'reading',qIndex),heard=p55Reference(id,'dialogue',qIndex),
 sourceType=id.split('-')[0].toUpperCase();
 if(!source)return '<p>Original source unavailable. No synthetic evidence supplied.</p>';
 return '<article class="p55-source-card"><header><small>'+sourceType+' · '+esc(id)+'</small>'+
 '<h4>'+esc(source.title)+'</h4></header>'+
 '<p>'+esc(source.goal||source.scenario||'Original source material')+'</p>'+
 '<p class="p55-source-status">'+sourceState(e,id)+'</p>'+
 '<div class="p55-source-actions">'+
 act('p55-open-original','Open original lesson →','button outline small','data-source="'+esc(id)+'"')+
 (e.native?.story?act('p55-native-read','Native Reader →','button outline small','data-source="'+esc(id)+'"'):'')+
 (e.native?.dialogue?act('p55-native-listen','Native Dialogue →','button outline small','data-source="'+esc(id)+'"'):'')+'</div>'+
 (first?'<div class="p55-source-quote"><strong>Canonical Reader question '+(qIndex+1)+'</strong>'+
 '<p>'+esc(first.question.prompt)+'</p>'+
 (reveal?'<div class="p55-revealed"><span>Recorded source sentence '+(first.index+1)+
 (first.sourceIndex===null?'':' · document '+(first.sourceIndex+1))+'</span>'+
 '<p lang="zh-Hans">'+esc(first.hanzi)+'</p>'+
 '<small>'+esc(first.pinyin)+'</small><p>'+esc(first.english)+'</p>'+
 '<p><strong>Canonical answer:</strong> '+esc(first.question.answer)+'</p>'+
 '<p>'+esc(first.question.explanation||'')+'</p></div>':'<p class="muted">Source quotation hidden until you compare independently.</p>')+
 '</div>':'')+
 (heard?'<div class="p55-source-quote"><strong>Canonical Dialogue question '+(qIndex+1)+'</strong>'+
 '<p>'+esc(heard.question.prompt)+'</p>'+
 (reveal?'<div class="p55-revealed">'+(heard.evidenceIndexed?
 '<span>Original speaker '+esc(heard.speaker||'')+' · turn '+(heard.index+1)+'</span>'+
 '<p lang="zh-Hans">'+esc(heard.hanzi)+'</p>'+
 '<small>'+esc(heard.pinyin)+'</small><p>'+esc(heard.english)+'</p>':
 '<p>The original Dialogue question does not identify a specific supporting turn. No line reference is invented; listen in the canonical Dialogue to evaluate this answer.</p>')+
 '<p><strong>Canonical answer:</strong> '+esc(heard.question.answer)+'</p>'+
 '<p>'+esc(heard.question.explanation||'')+'</p></div>':'<p class="muted">Return to the native hearing before revealing evidence.</p>')+
 '</div>':'')+'</article>';
}
export function p55Overview(state,act,esc,{selected='',query=''}={}){
 const next=p55Next(state);
 const term=query.trim().toLocaleLowerCase();
 const cards=P55_BRIEFS.filter(x=>[x.title,x.retrieval,x.pitfall,x.writing,x.model.hanzi,
  p55Source(x.from)?.title,p55Source(x.to)?.title].join(' ').toLocaleLowerCase().includes(term));
 const practiced=P55_BRIEFS.filter(x=>p55BriefEvidence(state,x).nativeAttempts>0).length;
 return '<section class="p55-overview" aria-label="P50 to P55 consolidated advanced Mandarin">'+
 '<header class="p55-overview-head"><p class="eyebrow">P55 · CONSOLIDATED ADVANCED MANDARIN</p>'+
 '<h2>One route through the original material.</h2>'+
 '<p>Read two original sources, hear the native dialogues, reconstruct a different question, revise your own Mandarin in P43, and transfer the same evidence accurately into speech.</p>'+
 '<p class="muted">'+practiced+' of '+P55_BRIEFS.length+
 ' paired contexts have at least one native submission. That is activity, not completed lessons, assessed writing, speaking mastery or an HSK grade.</p>'+
 '<p>'+dueCards(state).length+' cards are genuinely due in the original Review scheduler.</p>'+
 '<div class="p55-actions">'+act('p55-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+
 act('p55-review','Go to canonical Review →','button outline')+'</div></header>'+
 '<label for="p55-search">Find a source pair, correction or topic</label>'+
 '<input id="p55-search" type="search" value="'+esc(query)+'" placeholder="survey, consent, causation, correction, 源">'+
 '<div class="p55-catalog">'+cards.map(b=>{const evidence=p55BriefEvidence(state,b);
 return act('p55-open','<small>PAIR '+String(b.sequence).padStart(2,'0')+' · '+esc(b.from.toUpperCase())+
 ' / '+esc(b.to.toUpperCase())+'</small><strong>'+esc(b.title)+'</strong>'+
 '<span>'+esc(b.retrieval)+'</span><em>'+evidence.nativeAttempts+
 ' actual native submission(s) across linked sources and fixed sentence practice</em>',
 'p55-catalog-card '+(selected===b.id?'active':''),'data-id="'+b.id+'"');
 }).join('')+'</div>'+
 (!cards.length?'<p role="status">No original paired context matches this search.</p>':'')+
 '</section>';
}
export function p55Lesson(b,state,act,esc,{step='sources',qIndex=0,reveal=false,showModel=false,showSupport=false}={}){
 if(!b)return '';
 const e=p55BriefEvidence(state,b),words=p55NativeWords(b),from=p55Source(b.from),to=p55Source(b.to);
 return '<section class="p55-study" aria-label="Original advanced Mandarin learning consolidation">'+
 '<header class="p55-heading"><p class="eyebrow">P55 · PAIRED LEARNING CONTEXT '+b.sequence+' / '+P55_BRIEFS.length+'</p>'+
 '<h2>'+esc(b.title)+'</h2><p>'+esc(b.retrieval)+'</p>'+
 '<div class="p55-actions">'+act('p55-next','Find next source evidence to practise →','button outline')+
 act('p55-review','Review genuinely due cards →','button outline')+'</div></header>'+
 '<nav class="p55-steps" aria-label="Source to independent argument pathway">'+
 P55_STEPS.map(s=>act('p55-step',esc(s.label),
 'p55-step '+(step===s.id?'active':''),'data-step="'+s.id+'" aria-pressed="'+(step===s.id)+'"')).join('')+'</nav>'+
 (step==='sources'?'<div class="p55-pane"><h3>Reconstruct the argument without the old question wording</h3>'+
 '<p><strong>Different-question retrieval:</strong> '+esc(b.retrieval)+'</p>'+
 '<p>First retrieve the original passages and spoken evidence, then answer in Mandarin in your own words. The question below is an ungraded self-recall instruction; actual questions and saved submissions remain in their original Reader and Dialogue.</p>'+
 '<div class="p55-actions">'+act('p55-question-prev','Earlier canonical evidence question','button outline')+
 '<span class="p55-question-count">Original question '+(qIndex+1)+' of 3 from each source</span>'+
 act('p55-question-next','Next canonical evidence question','button outline')+'</div>'+
 '<div class="p55-pair">'+sourceCard(b.from,e.left,act,esc,{qIndex,reveal})+
 sourceCard(b.to,e.right,act,esc,{qIndex,reveal})+'</div>'+
 '<div class="p55-actions">'+act('p55-reveal',reveal?'Hide original citations and answers':
 'Compare answer against exact canonical source citations','button outline')+
 act('p55-step','Continue to contextual language →','button primary','data-step="language"')+'</div>'+
 '<p class="muted">Revealing source answers here does not submit, award credit, or create a Review event. Native grading is available only in the original lesson.</p></div>':'')+
 (step==='language'?'<div class="p55-pane"><h3>Choose register without changing factual scope</h3>'+
 '<p><strong>Misconception to repair:</strong> '+esc(b.pitfall)+'</p>'+
 '<p><strong>Fair objection:</strong> '+esc(b.objection)+'</p>'+
 '<p>Translate the claim for an institutional audience and then explain it conversationally. Check that the source, quantifier, date, measurement and certainty do not change.</p>'+
 '<div class="p55-register-grid">'+words.map(w=>'<article class="p55-register"><h4 lang="zh-Hans">'+esc(w.hanzi)+'</h4>'+
 (showSupport?'<p>'+esc(w.pinyin)+' · '+esc(w.meaning)+'</p>':'<p class="muted">Recall the reading and scope first.</p>')+
 (w.key?act('lookup-word','Open canonical Wordbook entry →','button outline small','data-id="'+esc(w.key)+'"'):'<p>Canonical entry unavailable.</p>')+'</article>').join('')+'</div>'+
 '<div class="p55-actions">'+act('p55-support',showSupport?'Hide pronunciation and meaning':'Show original Pinyin and meaning','button outline')+
 act('p55-step','Prepare independent writing →','button primary','data-step="write"')+'</div>'+
 '<p class="muted">Wordbook holds lexical notes; existing native sentence events hold exact-form practice. There is no separate P55 vocabulary review or invented learning record.</p></div>':'')+
 (step==='write'?'<div class="p55-pane"><h3>First draft, source repair, independent second draft</h3>'+
 '<p><strong>Your independent task:</strong> '+esc(b.writing)+'</p>'+
 '<div class="p55-writing-plan">'+[
 ['Draft one · evidence','Name both original records and the strongest statement each supports; add one clear but qualified conclusion.'],
 ['Draft two · correction','Identify a plausible overclaim, make the strongest fair objection, and edit only the unsupported inference.'],
 ['Draft three · transfer','Rewrite for a different audience without changing any figure, source authority, date, or scope.']
 ].map(([name,copy])=>'<article><h4>'+esc(name)+'</h4><p>'+esc(copy)+'</p></article>').join('')+'</div>'+
 '<p><strong>Explicit misconception correction:</strong> '+esc(b.pitfall)+'</p>'+
 '<p><strong>Fair counterargument:</strong> '+esc(b.objection)+'</p>'+
 '<div class="p55-actions">'+act('p55-copy-brief','Copy source-grounded writing task','button outline')+
 act('p55-p43','Open existing P43 independent writing →','button primary')+
 act('p55-step','Prepare an independent oral defense →','button outline','data-step="speak"')+'</div>'+
 '<p class="muted">P43 is the original tab-local writing and revision workspace. This bridge does not insert hidden text, overwrite drafts, persist essays, or grant a grade.</p></div>':'')+
 (step==='speak'?'<div class="p55-pane"><h3>Defend the same evidence independently in spoken Mandarin</h3>'+
 '<p>'+esc(b.speaking)+'</p>'+
 '<div class="p55-speaking-plan">'+[
 ['Opening · source attribution','Name the two distinct original records and the question each was able to address.'],
 ['Challenge · fair objection',b.objection],
 ['Reply · justified scope',b.pitfall],
 ['Close · register transfer','Give a formal conclusion and a shorter natural conversational explanation without exaggerating either one.']
 ].map(([name,copy])=>'<article><h4>'+esc(name)+'</h4><p>'+esc(copy)+'</p></article>').join('')+'</div>'+
 '<p>Speak before revealing any authored sentence. Neither device text-to-speech nor your own response is assessed as independent speaking.</p>'+
 '<div class="p55-actions">'+act('p55-reveal-model',showModel?'Hide original bilingual model':
 'Compare an original evidence-qualified Mandarin model after speaking','button outline')+
 act('p55-step','Return to source evidence →','button outline','data-step="sources"')+'</div>'+
 (showModel?'<article class="p55-authored-model"><h4>Original teaching model · not a graded answer</h4>'+
 '<p lang="zh-Hans">'+esc(b.model.hanzi)+'</p>'+
 '<small>'+esc(b.model.pinyin)+'</small><p>'+esc(b.model.english)+'</p>'+
 act('p55-workshop','Native exact-form reconstruction →','button outline small')+'</article>':'')+
 '<p class="muted">Model reconstruction checks one fixed sentence in the original Sentence Workshop. It is not a measure of free argumentation or pronunciation proficiency.</p></div>':'')+
 '<footer class="p55-native-history"><h4>Actual canonical submissions</h4>'+
 '<p>'+esc(b.from)+': '+e.left.reading.length+' Reader · '+e.left.listening.length+' Dialogue. '+
 esc(b.to)+': '+e.right.reading.length+' Reader · '+e.right.listening.length+
 ' Dialogue. New original exact-form model: '+e.sentences.length+' submissions.</p>'+
 '<p>This is learner activity only. Self-recall, reading citations, writing prompts and spoken preparation add no events.</p>'+
 '<div class="p55-actions">'+act('p55-next','Continue the original P50–P54 source pathway →','button primary')+
 act('p55-overview','Browse the complete consolidated pathway →','button outline')+'</div></footer></section>';
}
export function p55WritingContext(b,act,esc){
 if(!b)return '';
 const left=p55Reference(b.from,'reading',0),right=p55Reference(b.to,'reading',0);
 return '<aside class="p55-return-strip" aria-label="Original source-based writing handoff">'+
 '<div><strong>P55 source-grounded writing context</strong><p>'+esc(b.title)+
 ' · '+esc(b.from)+' / '+esc(b.to)+'</p>'+
 '<p>'+esc(b.writing)+'</p><p><strong>Correction:</strong> '+esc(b.pitfall)+'</p>'+
 '<div class="p55-handoff-evidence">'+[left,right].map((item,i)=>item?
 '<p><strong>Original '+(i?'second':'first')+' evidence anchor:</strong> '+
 '<span lang="zh-Hans">'+esc(item.hanzi)+'</span> · '+esc(item.english)+'</p>':'').join('')+'</div>'+
 '<small>The P43 editor still owns tab-local drafts; no text was inserted automatically.</small></div>'+
 '<div class="p55-actions">'+act('p55-copy-brief','Copy writing brief','button outline small')+
 act('p55-return','Return to the source pair →','button outline small')+'</div></aside>';
}
