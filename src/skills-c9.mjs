/**
 * C9-29 — Skill-first continuation over existing P35–P51 source authorities.
 * All state here is ephemeral presentation. Only original native activities
 * may append readingEvents, dialogueEvents, sentenceEvents or due reviews.
 */
import {C9_ADVANCED_PHASES,c9AdvancedNativeLinks,c9AdvancedSourceLines} from './advanced-c9.mjs';
import {P46_STAGES} from './p46-screen.mjs';
import {P47_STAGES} from './p47-screen.mjs';
import {P48_STAGES} from './p48-screen.mjs';
import {P49_STAGES} from './p49-screen.mjs';
import {P50_STAGES} from './p50-screen.mjs';
import {P51_STAGES} from './p51-screen.mjs';
import {P48_ARGUMENTS} from './p48-arguments.mjs';
import {P50_ARGUMENTS} from './p50-arguments.mjs';
import {P51_ARGUMENTS} from './p51-arguments.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {c9WritingLinkedUnit} from './writing-c9.mjs';

const track=(id,name,caption,phases,reason,deliverable)=>Object.freeze({
 id,name,caption,phases:Object.freeze(phases),reason,deliverable
});
export const C9_SKILL_TRACKS=Object.freeze([
 track('characters','Characters & meaningful words','Build forms and grammar in real sentences',
  [35,36,39,40],'Character recognition grows through words, sentence order and source-specific contrasts.',
  'Explain a character in context, then reconstruct an independently written sentence.'),
 track('conversation','Conversations & decisions','Understand speakers, intentions and responses',
  [37,42,44,45,49],'Track what each person claims or proposes before choosing a response.',
  'Listen to the actual native dialogue, respond and explain why the response fits.'),
 track('reading','Connected reading','From short texts to sustained source interpretation',
  [38,41,46,47],'Follow chronology, multiple paragraphs, contrasting evidence and corrected assumptions.',
  'Answer original reading questions and cite which lines support the conclusion.'),
 track('evidence','Evidence, nuance & register','Compare records and defend justified conclusions',
  [48,49,50,51],'Keep proposals, verified observations, source scope and register distinct.',
  'Explain a fair objection, qualify an answer and verify the underlying source.'),
 track('production','Independent writing & transfer','Plan, compose, revise and explain in Chinese',
  [43,44,48,50,51],'Use the original P43 writing authority with historically linked P48/P50/P51 source prompts.',
  'Write and revise two original paragraphs, then prepare an independent spoken explanation.')
]);
const stageName=Object.freeze({
 orientation:'Prepare',read:'Read source',listen:'Hear & respond',
 produce:'Independent production',review:'Revisit evidence'
});
const nativeStages=Object.freeze({
 46:P46_STAGES,47:P47_STAGES,48:P48_STAGES,49:P49_STAGES,
 50:P50_STAGES,51:P51_STAGES
});
const genericStages=Object.freeze([
 {id:'orientation',label:'Understand the task'},
 {id:'read',label:'Read the authored source'},
 {id:'review',label:'Inspect evidence'},
 {id:'produce',label:'Practice independently'}
]);
export const c9SkillTrack=id=>C9_SKILL_TRACKS.find(t=>t.id===id)||null;
export const c9SkillPhase=(phase)=>C9_ADVANCED_PHASES.find(p=>p.phase===Number(phase))||null;
export const c9SkillSource=(phase,sourceId)=>c9SkillPhase(phase)?.records.find(x=>x.id===sourceId)||null;
export const c9SkillStages=phase=>nativeStages[phase]||genericStages;
export const c9SkillStageId=(phase,requested)=>{
 const stages=c9SkillStages(phase);
 return stages.some(s=>s.id===requested)?requested:stages[0].id;
};
export const c9SkillPhaseInTrack=(trackId,phase)=>
 Boolean(c9SkillTrack(trackId)?.phases.includes(Number(phase)));
export const c9SkillLinks=(phase,source)=>{
 const native=c9SkillPhase(phase);
 return native&&source?c9AdvancedNativeLinks(native,source):[];
};
function evidenceFor(state,links){
 return links.map(link=>{
  const events=link.kind==='story'?state.readingEvents:
   link.kind==='dialogue'?state.dialogueEvents:
   link.kind==='workshop'?state.sentenceEvents:null;
  const key=link.kind==='story'?'storyId':link.kind==='dialogue'?'dialogueId':'taskId';
  if(link.kind==='lesson')return {
   ...link,observed:(state.learned||[]).includes(link.id),independent:false,assisted:false
  };
  const own=(events||[]).filter(e=>e[key]===link.id);
  return {...link,observed:own.length>0,
   independent:own.some(e=>e.correct&&!e.assisted),
   assisted:own.some(e=>e.assisted),last:own.at(-1)||null};
 });
}
function statusPhrase(events){
 if(!events.length)return 'No native assessment mapped';
 if(events.some(e=>e.independent))return 'Independent correct attempt recorded';
 if(events.some(e=>e.last&&!e.last.correct))return 'Review an incorrect native attempt';
 if(events.some(e=>e.assisted))return 'Previous native attempt involved help';
 if(events.some(e=>e.observed))return 'Source introduced or attempted';
 return 'Not yet attempted in native practice';
}
export function c9SkillSourceStatus(state,phase,source){
 const links=c9SkillLinks(phase,source),events=evidenceFor(state,links);
 return {links,events,label:statusPhrase(events),hasIndependent:events.some(e=>e.independent)};
}
export function c9SkillNextSource(state,trackId,after=null){
 const t=c9SkillTrack(trackId);if(!t)return null;
 const records=t.phases.flatMap(phase=>c9SkillPhase(phase)?.records.map(source=>({phase,source}))||[]);
 if(!records.length)return null;
 const start=records.findIndex(({phase,source})=>after?.phase===phase&&after?.id===source.id);
 const ordered=start<0?records:[...records.slice(start+1),...records.slice(0,start+1)];
 // Native events are the only evidence; browsing a source never advances it.
 return ordered.find(({phase,source})=>{
  const e=c9SkillSourceStatus(state,phase,source);
  return e.links.some(l=>l.kind!=='lesson')&&!e.hasIndependent;
 })||ordered.find(({phase,source})=>!c9SkillSourceStatus(state,phase,source).hasIndependent)||ordered[0];
}
const match=(source,q)=>{
 const text=[source.title,source.hanzi,source.pinyin,source.theme,source.category,
 source.goal,source.contrast,source.misconception,
 ...c9AdvancedSourceLines(source).slice(0,12).flatMap(r=>[r.hanzi,r.pinyin,r.english])]
  .filter(Boolean).join(' ').toLocaleLowerCase();
 return text.includes(q.toLocaleLowerCase());
};
function sourceTitle(source,phase){
 return source.title||source.hanzi||source.grammarTitle||source.goal||'Original P'+phase+' source';
}
function stageType(id){
 if(['characters','words','language','grammar','orientation'].includes(id))return 'orientation';
 if(['read','reading','compare','sources'].includes(id))return 'reading';
 if(['listen','listening'].includes(id))return 'listening';
 if(['meaning','repair','review'].includes(id))return 'review';
 if(['argue','production','produce','write'].includes(id))return 'production';
 return 'reading';
}
const sourceParagraphs=(source,lines)=>{
 if(Array.isArray(source.paragraphs)&&source.paragraphs.length){
  return source.paragraphs.map((p,i)=>({
   title:p.title||'Section '+(i+1),
   lines:lines.slice(Math.max(0,p.start),Math.min(lines.length,p.end+1)),
   start:p.start
  }));
 }
 return [{title:'Authored source',lines,start:0}];
};
function modelsOf(phase,id){
 const groups={48:P48_ARGUMENTS,50:P50_ARGUMENTS,51:P51_ARGUMENTS};
 return groups[phase]?.find(a=>a.readingId===id)||null;
}
function sourceAudio(phase,id){
 return DIALOGUES.find(d=>d['p'+phase]?.readingId===id||d['p'+phase]?.id===id)||null;
}
function authenticHandoff(phase,source,links,act,esc){
 const unit=c9WritingLinkedUnit(phase,source.id);
 const items=links.map(l=>act('c9-skills-native',l.label+' →',
 'c9-button c9-button--secondary c9-button--small',
 'data-kind="'+l.kind+'" data-id="'+esc(l.id)+'"')).join('');
 return '<div class="c9-skills-handoffs"><h4>Continue with the original assessment</h4>'+
 '<p>Only existing native lessons, reading, dialogue and exact-form writing can record learning evidence.</p>'+
 '<div>'+items+(unit?act('c9-skills-writing','Original independent writing studio →',
 'c9-button c9-button--primary c9-button--small'):'')+'</div>'+
 (!links.length&&!unit?'<p>No authoritative native assessment is linked to this source. This source is for ungraded study.</p>':'')+
 '</div>';
}
function stagePanel(phase,source,stage,ui,links,act,esc){
 const type=stageType(stage),lines=c9AdvancedSourceLines(source),
  models=modelsOf(phase,source.id),dialogue=sourceAudio(phase,source.id),
  support=Boolean(ui.support);
 const originalPhase=source.sourceType&&/^p(4[4-9])$/.test(source.sourceType)?
  c9SkillPhase(Number(source.sourceType.slice(1))):null;
 const originalRecord=originalPhase?.records.find(x=>x.id===source.sourceId);
 const preferredKind=type==='listening'?'dialogue':
  type==='reading'||type==='review'?'story':
  type==='production'?'workshop':null;
 const primary=links.find(x=>x.kind===preferredKind);
 const primaryAction=primary?'<div class="c9-skills-primary-handoff">'+
   act('c9-skills-native',
    type==='listening'?'Open the original assessed conversation →':
    type==='production'?'Reconstruct the original exact-form response →':
    'Open the original assessed reading →',
    'c9-button c9-button--primary c9-button--small',
    'data-kind="'+primary.kind+'" data-id="'+esc(primary.id)+'"')+
   '<small>Only the native assessment can write learning evidence.</small></div>':'';
 const historicalAccess=originalRecord?
  '<aside class="c9-skills-related-evidence"><strong>Original source connection · P'+
   originalPhase.phase+'</strong><p>'+esc(originalRecord.title||originalRecord.hanzi||originalRecord.goal||originalRecord.id)+
   '</p>'+act('c9-skills-related-source','Read the original referenced source →',
    'c9-button c9-button--secondary c9-button--small',
    'data-phase="'+originalPhase.phase+'" data-id="'+esc(originalRecord.id)+'"')+
   '</aside>':'';
 const intro={
  orientation:'Start with what the source actually says. Distinguish the original situation, participants, vocabulary and stated limitation.',
  reading:'Read the Chinese first. Follow each paragraph or authored line and avoid treating an inference as a quoted fact.',
  listening:'Listen before opening the transcript when device Mandarin voice is available. Your listening is not recorded or scored here.',
  review:'Compare the evidence with the claim. Use the original native questions to record any independent assessment.',
  production:'Give a reasoned response independently, then review source scope, register and sentence structure.'
 }[type];
 const header='<div class="c9-skills-stage-intro"><p>'+esc(intro)+'</p>'+
 (source.goal?'<blockquote>'+esc(source.goal)+'</blockquote>':'')+
 historicalAccess+primaryAction+'</div>';
 let content='';
 if(type==='orientation'){
  const focus=source.focusWord;
  const vocab=focus?.hanzi?WORDS.find(w=>w.key===canonicalWordKey(focus.hanzi,focus.pinyin)):null;
  const grammar=(source.grammarIds||[]).map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
  const nativeLesson=source.hanzi?DEMO_LESSONS.find(l=>l.id===source.id):null;
  content='<div class="c9-skills-facts">'+
   (focus?.hanzi?'<article><span>In-source vocabulary</span><strong lang="zh-Hans">'+esc(focus.hanzi)+'</strong><p>'+
   esc(focus.pinyin)+' · '+esc(focus.english)+'</p>'+
   (vocab?act('c9-skills-word','Open native Wordbook entry →','c9-button c9-button--secondary c9-button--small',
   'data-id="'+esc(vocab.key)+'"'):'')+'</article>':'')+
   (source.contrast?'<article><span>Contrast to understand</span><p>'+esc(source.contrast)+'</p></article>':'')+
   (source.misconception||source.pitfall?'<article><span>Misconception to avoid</span><p>'+esc(source.misconception||source.pitfall)+'</p></article>':'')+
   (nativeLesson?'<article><span>Canonical lesson</span>'+act('c9-skills-native','Open character lesson →',
    'c9-button c9-button--secondary c9-button--small','data-kind="lesson" data-id="'+esc(nativeLesson.id)+'"')+'</article>':'')+
   grammar.slice(0,4).map(g=>'<article><span>Original grammar teaching</span><strong>'+esc(g.title)+'</strong>'+
    act('c9-skills-grammar','Study this grammar →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(g.id)+'"')+'</article>').join('')+
   '</div>';
 }
 if(type==='reading'){
  content='<div class="c9-skills-reading">'+
   sourceParagraphs(source,lines).map((p,i)=>'<section><h4>'+esc(p.title)+'</h4>'+
   p.lines.map((line,j)=>'<div class="c9-skills-reading-line"><span class="c9-skills-line-index">'+(p.start+j+1)+'</span>'+
    '<div><strong lang="zh-Hans">'+esc(line.hanzi)+'</strong>'+
    (support?(line.pinyin?'<small>'+esc(line.pinyin)+'</small>':'')+
     (line.english?'<p>'+esc(line.english)+'</p>':''):'')+'</div>'+
    act('c9-skills-voice','Play line','c9-button c9-button--quiet c9-button--small',
    'data-index="'+(p.start+j)+'" data-audio="reading" aria-label="Play source line '+(p.start+j+1)+' using device voice"')+
    '</div>').join('')+'</section>').join('')+'</div>';
 }
 if(type==='listening'){
  // Not every editorial case has a source-linked native dialogue. In that
  // case, play ONLY actual authored Chinese lines, not empty fake turns.
  const turns=dialogue?.lines?.length?dialogue.lines:
   Array.isArray(source.turns)&&source.turns.length?source.turns:lines;
  content='<div class="c9-skills-listening">'+
   '<p>'+(dialogue?.lines?.length?'Original native dialogue linked to this source.':
    'No native paired dialogue identified. Hear the original source lines with your device voice; this is a reading aid, not a scored listening exercise.')+'</p>'+
   (!turns.length?'<p>No original Chinese source lines are available for device playback.</p>':'')+
   turns.slice(0,30).map((line,i)=>'<article><span>'+esc(line.speaker||'Source line')+' · '+(i+1)+'</span>'+
    act('c9-skills-voice','Play this turn →','c9-button c9-button--secondary c9-button--small',
    'data-index="'+i+'" data-audio="listening"')+
    (support?'<div><strong lang="zh-Hans">'+esc(line.hanzi)+'</strong>'+
     (line.pinyin?'<small>'+esc(line.pinyin)+'</small>':'')+
     (line.english?'<p>'+esc(line.english)+'</p>':'')+'</div>':'')+'</article>').join('')+'</div>';
 }
 if(type==='review'){
  content='<div class="c9-skills-questions"><h4>Original evidence prompts</h4>'+
   (source.questions||[]).slice(0,5).map((q,i)=>'<article><span>Prompt '+(i+1)+'</span>'+
    '<strong>'+esc(q.prompt)+'</strong>'+
    (support?'<p>Authored response: '+esc(q.answer)+'</p>'+
      (q.explanation?'<p>'+esc(q.explanation)+'</p>':''):'')+'</article>').join('')+
   (source.sourceId?'<p>Prior authored source: '+esc(source.sourceId)+
    '. Verify it before generalizing a conclusion.</p>':'')+
   '</div>';
 }
 if(type==='production'){
  const writing=typeof source.writing==='object'?source.writing.prompt:source.writing;
  const oral=source.oral;
  content='<div class="c9-skills-production">'+
   '<article><h4>Independent writing brief</h4><p>'+esc(writing||source.goal||'Write an original contextual Chinese response.')+'</p></article>'+
   (oral?'<article><h4>Spoken transfer</h4><p>'+esc(oral)+'</p><small>Unrecorded practice; no pronunciation evaluation.</small></article>':'')+
   (models?'<article><h4>Argument to refine</h4><p>'+esc(models.claim)+'</p>'+
     '<p>Fair objection: '+esc(models.objection)+'</p>'+
     (support?'<p>Authored response: '+esc(models.rebuttal)+'</p>':'')+'</article>':'')+
   (source.contrast?'<article><h4>Check the source contrast</h4><p>'+esc(source.contrast)+'</p></article>':'')+
   '</div>';
 }
 return header+content+authenticHandoff(phase,source,links,act,esc);
}
export function renderC9SkillsWorkspace(state,ui,act,esc){
 const track=c9SkillTrack(ui.track)||C9_SKILL_TRACKS[0];
 const phase=c9SkillPhaseInTrack(track.id,ui.phase)?c9SkillPhase(ui.phase):c9SkillPhase(track.phases[0]);
 const filter=String(ui.query||'').trim().toLocaleLowerCase();
 const candidates=track.phases.filter(n=>!ui.phaseOnly||n===phase.phase)
  .flatMap(n=>c9SkillPhase(n)?.records.map(source=>({phase:n,source}))||[])
  .filter(({source})=>!filter||match(source,filter));
 const source=c9SkillSource(phase.phase,ui.sourceId);
 const selected=source&&track.phases.includes(phase.phase)?source:null;
 const stage=c9SkillStageId(phase.phase,ui.stage),stages=c9SkillStages(phase.phase);
 const page=Math.max(0,Math.min(Math.floor((candidates.length-1)/12),ui.page||0));
 const pageRows=candidates.slice(page*12,page*12+12);
 const next=c9SkillNextSource(state,track.id,selected?{phase:phase.phase,id:selected.id}:null);
 const total=track.phases.reduce((n,id)=>n+(c9SkillPhase(id)?.records.length||0),0);
 const skillList='<nav class="c9-skills-tracks" aria-label="Choose learning skill">'+
 C9_SKILL_TRACKS.map(t=>act('c9-skills-track',
  '<strong>'+esc(t.name)+'</strong><small>'+esc(t.caption)+'</small>',
  'c9-skills-track'+(track===t?' is-active':''),
  'data-track="'+t.id+'" aria-pressed="'+(track===t)+'"')).join('')+'</nav>';
 const directory='<section class="c9-skills-directory" aria-label="Original course topics">'+
 '<header><div><p class="c9-eyebrow">SKILL · '+esc(track.name.toUpperCase())+'</p>'+
 '<h2>Choose a genuine source.</h2><p>'+esc(track.reason)+'</p></div>'+
 '<span>'+total+' original source entries · '+track.phases.length+' source collections</span></header>'+
 '<div class="c9-skills-directory-actions">'+
 act('c9-skills-continue','Continue from real native evidence →','c9-button c9-button--primary c9-button--small',
 next?'data-phase="'+next.phase+'" data-id="'+esc(next.source.id)+'"':'disabled')+
 '<label for="c9-skills-query">Find within this skill</label>'+
 '<input id="c9-skills-query" type="search" autocomplete="off" spellcheck="false" value="'+esc(ui.query||'')+
 '" placeholder="Find Chinese, Pinyin, topics, original source notes"></div>'+
 '<nav class="c9-skills-phase-strip" aria-label="Sources by historical phase">'+
 act('c9-skills-all','All sources','c9-skills-phase'+(!ui.phaseOnly?' is-active':''),
  'aria-pressed="'+!ui.phaseOnly+'"')+
 track.phases.map(n=>{
  const p=c9SkillPhase(n);
  return act('c9-skills-phase',esc(p?.title||'')+' <small>P'+n+'</small>',
  'c9-skills-phase'+(ui.phaseOnly&&phase.phase===n?' is-active':''),
  'data-phase="'+n+'" aria-pressed="'+(ui.phaseOnly&&phase.phase===n)+'"');
 }).join('')+'</nav>'+
 '<div id="c9-skills-results" class="c9-skills-results" aria-live="polite">'+
 '<p>'+candidates.length+' matching original source'+(candidates.length===1?'':'s')+
 ' · page '+(page+1)+' of '+Math.max(1,Math.ceil(candidates.length/12))+'</p>'+
 '<div class="c9-skills-source-grid">'+(pageRows.length?pageRows.map(({phase:n,source:x})=>{
  const observation=c9SkillSourceStatus(state,n,x);
  return act('c9-skills-source',
   '<small>'+esc(c9SkillPhase(n)?.focus||'Original source')+' · P'+n+'</small>'+
   '<strong>'+esc(sourceTitle(x,n))+'</strong>'+
   '<span>'+esc(x.theme||x.category||c9SkillPhase(n)?.goal||'Original authored context')+'</span>'+
   '<em>'+esc(observation.label)+'</em>',
   'c9-skills-source'+(phase.phase===n&&selected?.id===x.id?' is-active':''),
   'data-phase="'+n+'" data-id="'+esc(x.id)+'" aria-pressed="'+(phase.phase===n&&selected?.id===x.id)+'"');
 }).join(''):'<p>No original sources match. Clear the filter to browse all available entries.</p>')+
 '</div><div class="c9-skills-pagination">'+
 act('c9-skills-page','← Previous','c9-button c9-button--secondary c9-button--small',
 'data-dir="-1" '+(page>0?'':'disabled'))+
 act('c9-skills-page','Next →','c9-button c9-button--secondary c9-button--small',
 'data-dir="1" '+((page+1)*12<candidates.length?'':'disabled'))+'</div></div></section>';
 const active=selected?(()=>{
  const summary=c9SkillSourceStatus(state,phase.phase,selected);
  return '<section id="c9-skills-active" tabindex="-1" class="c9-skills-active" aria-labelledby="c9-skills-active-title">'+
   '<header><div><p class="c9-eyebrow">GUIDED SOURCE · ORIGINAL P'+phase.phase+'</p>'+
   '<h2 id="c9-skills-active-title">'+esc(sourceTitle(selected,phase.phase))+'</h2>'+
   '<p>'+esc(selected.theme||phase.goal||'Original Mandarin source')+'</p>'+
   '<span class="c9-skills-evidence">'+esc(summary.label)+'</span></div>'+
   act('c9-skills-dismiss','Close source','c9-button c9-button--quiet c9-button--small')+'</header>'+
   '<nav class="c9-skills-stages" aria-label="Stages for the selected source">'+
   stages.map((s,i)=>act('c9-skills-stage',
    '<span>'+(i+1)+'</span><strong>'+esc(s.label)+'</strong>',
    'c9-skills-stage'+(stage===s.id?' is-active':''),
    'data-stage="'+esc(s.id)+'" aria-pressed="'+(stage===s.id)+'"')).join('')+'</nav>'+
   '<div class="c9-skills-stage-controls">'+
   '<p>Source hints never create grades. Native assessment remains separate.</p>'+
   act('c9-skills-support',ui.support?'Hide supplied translations and model evidence':'Reveal source support · assisted',
    'c9-button c9-button--secondary c9-button--small','aria-pressed="'+Boolean(ui.support)+'"')+
   '</div>'+
   '<div class="c9-skills-stage-body">'+stagePanel(phase.phase,selected,stage,ui,summary.links,act,esc)+'</div>'+
   '<nav class="c9-skills-stage-next" aria-label="Continue this source">'+
   act('c9-skills-step','← Previous section','c9-button c9-button--secondary c9-button--small',
    'data-dir="-1" '+(stage===stages[0].id?'disabled':''))+
   act('c9-skills-step','Next learning section →','c9-button c9-button--primary c9-button--small',
    'data-dir="1" '+(stage===stages.at(-1).id?'disabled':''))+'</nav>'+
   '</section>';
 })():'<aside class="c9-skills-empty"><h3>Start with an original source.</h3>'+
 '<p>Choose an authored situation or continue from your existing native results. Reading a card does not count as completed learning.</p>'+
 '<p>Independent goal: '+esc(track.deliverable)+'</p></aside>';
 return '<div class="c9-skills-workspace">'+
 '<header class="c9-skills-intro"><div><p class="c9-eyebrow">ORIGINAL MANDARIN · LEARN BY SKILL</p>'+
 '<h1>A connected path through Mandarin.</h1>'+
 '<p>Choose what you want to learn, then study real original sources through guided stages. Native reading, conversation, writing and scheduled review remain the only evidence authorities.</p>'+
 '<div><a href="#/learn">Character lessons</a><a href="#/advanced">All original collections</a>'+
 '<a href="#/review">Scheduled review</a></div></div></header>'+
 skillList+directory+active+
 '<p class="c9-skills-caveat">Source IDs P35–P51 identify authorial curriculum phases, not achieved levels or an approved HSK 3.0 syllabus. Source guidance, assisted translations and device voice do not demonstrate mastery, graded writing or spoken accuracy.</p>'+
 '</div>';
}
