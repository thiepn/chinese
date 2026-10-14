/**
 * C9-26 — P35–P51 content integration without shadow learning authorities.
 * Phase/source selection is ephemeral. Canonical lessons, grammar, stories,
 * dialogues and Sentence Workshop alone may write learner evidence.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {SENTENCE_TASKS} from './sentence-workshop.mjs';
import {P35_CHARACTER_GUIDES} from './p35-foundations.mjs';
import {P36_GRAMMAR_IDS} from './p36-course.mjs';
import {P37_SCENES} from './p37-scenarios.mjs';
import {P38_PASSAGES} from './p38-readings.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {P40_GRAMMAR_IDS} from './p40-course.mjs';
import {P41_PASSAGES} from './p41-readings.mjs';
import {P42_SCENES} from './p42-course.mjs';
import {P43_UNITS} from './p43-course.mjs';
import {P44_SCENARIOS} from './p44-course.mjs';
import {P45_TRANSFERS} from './p45-course.mjs';
import {P46_PASSAGES} from './p46-readings.mjs';
import {P47_PASSAGES} from './p47-readings.mjs';
import {P48_PASSAGES} from './p48-readings.mjs';
import {P49_CASES} from './p49-course.mjs';
import {P50_PASSAGES} from './p50-readings.mjs';
import {P51_PASSAGES} from './p51-readings.mjs';
import {c9WritingLinkedUnit} from './writing-c9.mjs';

const grammarByIds=ids=>ids.map(id=>GRAMMAR_LESSONS.find(l=>l.id===id)).filter(Boolean);
const nativePhase=(phase,title,focus,records,kind,goal)=>Object.freeze({phase,title,focus,records,kind,goal});
export const C9_ADVANCED_PHASES=Object.freeze([
 nativePhase(35,'Character & vocabulary expansion','Character families',P35_CHARACTER_GUIDES,'character','Study useful new characters in original sentences'),
 nativePhase(36,'Everyday grammar & correction','Grammar in context',grammarByIds(P36_GRAMMAR_IDS),'grammar','Notice a grammar contrast and correct a specific misconception'),
 nativePhase(37,'Practical situations','Conversation choices',P37_SCENES,'dialogue','Understand an eight-turn situation and respond naturally'),
 nativePhase(38,'Connected reading','From dialogue to passage',P38_PASSAGES,'reading','Track meaning beyond a single exchange'),
 nativePhase(39,'Intermediate characters','Characters in real usage',P39_CHARACTER_GUIDES,'character','Use new words, collocations and complete sentences'),
 nativePhase(40,'Intermediate grammar','Structured sentence choices',grammarByIds(P40_GRAMMAR_IDS),'grammar','Choose form using context and meaningful contrasts'),
 nativePhase(41,'Intermediate reading','Evidence from passages',P41_PASSAGES,'reading','Follow connected texts and source-specific explanations'),
 nativePhase(42,'Interpersonal conversations','Situations and responses',P42_SCENES,'dialogue','Interpret the speaker’s intent and evidence'),
 nativePhase(43,'Independent writing','Develop and revise ideas',P43_UNITS,'writing','Plan original paragraphs and review source integrity'),
 nativePhase(44,'Integrated situations','Listen, read and write',P44_SCENARIOS,'transfer','Carry source evidence between practical tasks'),
 nativePhase(45,'Cumulative transfer','Apply what you understood',P45_TRANSFERS,'transfer','Explain choices across related contexts'),
 nativePhase(46,'Upper-intermediate bridge','Extended connected ideas',P46_PASSAGES,'reading','Move from sentences to sustained discourse'),
 nativePhase(47,'Contextual reasoning','Advanced connected reading',P47_PASSAGES,'reading','Distinguish interpretations from evidence'),
 nativePhase(48,'Arguments & perspectives','Compare sources',P48_PASSAGES,'reading','Evaluate a stated claim using its source'),
 nativePhase(49,'Source-specific application','Consolidated cross-source practice',P49_CASES,'transfer','Use prior evidence rather than assuming mastery'),
 nativePhase(50,'Advanced discourse','Sustained argumentation',P50_PASSAGES,'reading','Read longer evidence-based passages'),
 nativePhase(51,'Register & source fidelity','Professional and social transfer',P51_PASSAGES,'reading','Separate wording, register and source attribution')
]);
export const findC9AdvancedPhase=id=>C9_ADVANCED_PHASES.find(x=>x.phase===Number(id))||null;
const safeRows=x=>Array.isArray(x)?x:[];
function lineOf(entry){
 if(Array.isArray(entry))return entry.length>=4?
  {speaker:entry[0],hanzi:entry[1],pinyin:entry[2],english:entry[3]}:
  {hanzi:entry[0],pinyin:entry[1],english:entry[2]};
 if(typeof entry==='string')return {hanzi:entry};
 if(entry&&typeof entry==='object')return {
  speaker:entry.speaker,hanzi:entry.hanzi||entry.text||entry.model||'',
  pinyin:entry.pinyin,english:entry.english||entry.translation||entry.purpose
 };
 return null;
}
export function c9AdvancedSourceLines(source){
 const fields=['lines','turns','examples','brief','models','responses'];
 for(const field of fields){
  const rows=safeRows(source?.[field]).map(lineOf).filter(x=>x?.hanzi);
  if(rows.length)return rows;
 }
 return source?.sentence?[lineOf(source.sentence)].filter(Boolean):
 source?.hanzi?[lineOf(source)]:[];
}
function plainFields(source){
 const vocab=source?.vocabulary;
 return [
  source?.title,source?.theme,source?.category,source?.hanzi,source?.pinyin,
  source?.meaning,source?.goal,source?.teaching,source?.misconception,source?.pitfall,
  source?.contrast,source?.explanation,source?.sourceClaim,
  typeof vocab==='object'?vocab.hanzi:vocab,
  ...c9AdvancedSourceLines(source).slice(0,22).flatMap(x=>[x.hanzi,x.pinyin,x.english])
 ].filter(Boolean).join(' ').toLocaleLowerCase();
}
function titleOf(source,phase){
 return source?.title||source?.hanzi||source?.meaning||
  source?.grammarTitle||source?.goal||'Original P'+phase+' source '+(source?.id||'');
}
function detail(source){
 return [source?.goal,source?.explanation,source?.teaching,source?.contrast,
  source?.pitfall,source?.misconception,source?.revision,source?.oral,source?.sourceClaim]
  .filter(s=>typeof s==='string'&&s.trim()).slice(0,5);
}
/** Strictly native source matching: source IDs never invented for grades. */
export function c9AdvancedNativeLinks(phase,source){
 if(!phase||!source)return [];
 const links=[];
 const lesson=DEMO_LESSONS.find(l=>l.id===source.id)||(source.hanzi&&
  DEMO_LESSONS.find(l=>l.hanzi===source.hanzi));
 if(lesson)links.push({kind:'lesson',id:lesson.id,label:'Original character lesson'});
 const grammar=GRAMMAR_LESSONS.find(g=>g.id===source.id);
 if(grammar)links.push({kind:'grammar',id:grammar.id,label:'Original grammar exercise'});
 const story=STORIES.find(s=>
  (s.beginner?.['p'+phase.phase]?.id===source.id)||
  (s.title===source.title&&['reading','transfer','writing'].includes(phase.kind)));
 if(story)links.push({kind:'story',id:story.id,label:'Original passage & comprehension'});
 const dialogue=DIALOGUES.find(d=>
   d['p'+phase.phase]?.id===source.id||d['p'+phase.phase]?.readingId===source.id||
   (d.title===source.title&&['dialogue','transfer'].includes(phase.kind)));
 if(dialogue)links.push({kind:'dialogue',id:dialogue.id,label:'Original conversation & listening'});
 const tasks=SENTENCE_TASKS.filter(t=>t.p35LessonId===source.id||t.p39LessonId===source.id||
  t.id?.startsWith('p'+phase.phase+':'+source.id+':')||
  t.storyId===story?.id && Number.isInteger(phase.phase)&&phase.phase>=35);
 if(tasks.length)links.push({kind:'workshop',id:tasks[0].id,label:'Original written-answer exercise'});
 return links;
}
const observed=(rows,id,key)=>rows.some(e=>e[key]===id&&e.correct===true&&!e.assisted);
function sourceStatus(state,links){
 const history=[];
 for(const link of links){
  if(link.kind==='lesson'&&(state.learned||[]).includes(link.id))history.push('Character introduced');
  if(link.kind==='story'&&observed(state.readingEvents||[],link.id,'storyId'))history.push('Reading answer independently correct');
  if(link.kind==='dialogue'&&observed(state.dialogueEvents||[],link.id,'dialogueId'))history.push('Conversation answer independently correct');
  if(link.kind==='workshop'&&observed(state.sentenceEvents||[],link.id,'taskId'))history.push('Written model independently correct');
 }
 return history;
}
const PAGE_SIZE=9;
export function c9AdvancedFiltered(phase,query=''){
 if(!phase)return [];
 const term=String(query).trim().toLocaleLowerCase();
 return term?phase.records.filter(source=>plainFields(source).includes(term)):phase.records;
}
export function renderC9AdvancedWorkspace(state,ui,act,esc){
 const phase=findC9AdvancedPhase(ui.phase)||C9_ADVANCED_PHASES[0];
 const rows=c9AdvancedFiltered(phase,ui.query);
 const pages=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));
 const page=Math.min(Math.max(0,ui.page||0),pages-1);
 const list=rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
 const selected=phase.records.find(r=>r.id===ui.selected)||null;
 const activeLinks=selected?c9AdvancedNativeLinks(phase,selected):[];
 const lineRows=selected?c9AdvancedSourceLines(selected):[];
 const live=selected?sourceStatus(state,activeLinks):[];
 const intro='<header class="c9-advanced-intro"><div><p class="c9-eyebrow">C9 UI + ORIGINAL P35–P51 CURRICULUM</p>'+
 '<h1>Chinese across real contexts</h1>'+
 '<p>Seventeen original course expansions, using the same native character, vocabulary, grammar, reading, dialogue, writing and scheduled-review authorities. Phases describe editorial development, not achieved or official HSK levels.</p></div>'+
 '<a href="#/learn" class="c9-button c9-button--secondary">Return to Learn</a></header>';
 const stages='<nav class="c9-advanced-stages" aria-label="Advanced course phases">'+
 C9_ADVANCED_PHASES.map(p=>act('c9-advanced-phase',
 '<span>P'+p.phase+'</span><strong>'+esc(p.title)+'</strong><small>'+p.records.length+' sources</small>',
 'c9-advanced-stage'+(p.phase===phase.phase?' is-active':''),
 'data-phase="'+p.phase+'" aria-pressed="'+(p.phase===phase.phase)+'"')).join('')+'</nav>';
 const catalog='<section class="c9-advanced-catalog" aria-labelledby="c9-advanced-catalog-title">'+
 '<div class="c9-advanced-catalog-head"><div><p class="c9-eyebrow">PHASE '+phase.phase+' · '+esc(phase.focus)+'</p>'+
 '<h2 id="c9-advanced-catalog-title">'+esc(phase.title)+'</h2><p>'+esc(phase.goal)+'</p></div>'+
 '<span>'+phase.records.length+' installed original sources</span></div>'+
 '<label for="c9-advanced-query">Search this phase’s Chinese, English, Pinyin or teaching notes</label>'+
 '<input id="c9-advanced-query" type="search" autocomplete="off" spellcheck="false" value="'+esc(ui.query||'')+
 '" placeholder="Find an original source, phrase or misconception">'+
 '<div id="c9-advanced-results" class="c9-advanced-results"><div class="c9-advanced-result-meta">'+
 '<span>'+rows.length+' matching source'+(rows.length===1?'':'s')+'</span>'+
 '<span>Page '+(page+1)+' of '+pages+'</span></div>'+
 '<div class="c9-advanced-source-grid">'+(list.length?list.map(source=>{
  const links=c9AdvancedNativeLinks(phase,source),evidence=sourceStatus(state,links),lines=c9AdvancedSourceLines(source),first=lines[0];
  return act('c9-advanced-source','<span class="c9-eyebrow">ORIGINAL P'+phase.phase+' / '+esc(source.id)+'</span>'+
   '<strong'+(source.hanzi?' lang="zh-Hans"':'')+'>'+esc(titleOf(source,phase.phase))+'</strong>'+
   (first?'<span class="c9-advanced-source-line" lang="zh-Hans">'+esc(first.hanzi)+'</span>':'')+
   '<small>'+esc(source.theme||source.category||phase.focus)+'</small>'+
   '<span class="c9-advanced-source-evidence">'+(evidence.length?
    esc(evidence.join(' · ')):'No independently correct native evidence recorded')+'</span>',
  'c9-advanced-source'+(selected?.id===source.id?' is-active':''),
  'data-id="'+esc(source.id)+'" aria-pressed="'+(selected?.id===source.id)+'"');
 }).join(''):'<p class="c9-advanced-no-match">No original material matches this query. Clear the search to see all sources in the selected phase.</p>')+
 '</div><div class="c9-advanced-pages">'+
 act('c9-advanced-prev','← Previous','c9-button c9-button--secondary c9-button--small',page===0?'disabled':'')+
 act('c9-advanced-next','Next →','c9-button c9-button--secondary c9-button--small',page+1>=pages?'disabled':'')+
 '</div></div></section>';
 const details=selected?
 '<section class="c9-advanced-detail" id="c9-advanced-detail" tabindex="-1" aria-labelledby="c9-advanced-source-title">'+
 '<div class="c9-advanced-detail-header"><div><p class="c9-eyebrow">ORIGINAL SOURCE · P'+phase.phase+' / '+esc(selected.id)+'</p>'+
 '<h2 id="c9-advanced-source-title">'+esc(titleOf(selected,phase.phase))+'</h2>'+
 '<p>'+esc(selected.theme||selected.category||phase.goal)+'</p></div>'+
 act('c9-advanced-close','Close source','c9-button c9-button--quiet c9-button--small')+'</div>'+
 (detail(selected).length?'<div class="c9-advanced-teaching">'+detail(selected).map((note,i)=>
  '<div><span>'+['Learning goal or explanation','Context and distinction','Misconception and revision','Further source guidance','Independent transfer'][i]+'</span>'+
  '<p>'+esc(note)+'</p></div>').join('')+'</div>':'')+
 '<div class="c9-advanced-native-links"><h3>Continue in the original learning workspace</h3>'+
 (c9WritingLinkedUnit(phase.phase,selected.id)?
 '<div class="c9-advanced-write-handoff">'+act('c9-writing-source','Write & revise an evidence-based response →',
 'c9-button c9-button--primary','data-phase="'+phase.phase+'" data-id="'+esc(selected.id)+'"')+
 '<p>Use the single original P43 independent writing editor, with source-specific revision criteria.</p></div>':'')+
 (activeLinks.length?'<div>'+activeLinks.map(link=>act('c9-advanced-native',
   esc(link.label)+' →','c9-button c9-button--secondary c9-button--small',
   'data-kind="'+link.kind+'" data-id="'+esc(link.id)+'"')).join('')+'</div>':
 '<p>No direct native task mapping is asserted for this source. Study its authored text and open the general source libraries to continue.</p>')+
 '<div class="c9-advanced-general-links"><a href="#/find">Search native library →</a>'+
 '<a href="#/workshop">Sentence Workshop →</a><a href="#/review">Scheduled Review →</a></div></div>'+
 (lineRows.length?'<div class="c9-advanced-lines"><header><div><h3>Study the original text</h3>'+
 '<p>The lines are original teaching material. Revealing the supplied translation creates no score.</p></div>'+
 act('c9-advanced-translation',ui.translation?'Hide supplied English':'Show supplied English',
 'c9-button c9-button--quiet c9-button--small','aria-pressed="'+Boolean(ui.translation)+'"')+
 '</header><ol>'+lineRows.slice(0,24).map((line,i)=>
  '<li><div><span class="c9-advanced-line-index">'+String(i+1).padStart(2,'0')+'</span>'+
  (line.speaker?'<small>'+esc(line.speaker)+'</small>':'')+
  '<strong lang="zh-Hans">'+esc(line.hanzi)+'</strong>'+
  (line.pinyin?'<span class="c9-advanced-pinyin">'+esc(line.pinyin)+'</span>':'')+
  (ui.translation&&line.english?'<p>'+esc(line.english)+'</p>':'')+'</div>'+
  act('c9-advanced-voice','Play on device','c9-button c9-button--quiet c9-button--small',
  'data-index="'+i+'"')+'</li>').join('')+'</ol>'+
 '<p>Speech uses an installed device Mandarin voice, when available; it is not a verified recording.</p></div>':'')+
 (live.length?'<p class="c9-advanced-recorded"><strong>Native recorded evidence:</strong> '+esc(live.join(' · '))+'</p>':
 '<p class="c9-advanced-recorded">No native independently correct source evidence found for this selection. Browsing alone changes nothing.</p>')+
 '</section>':
 '<section class="c9-advanced-detail-empty"><h2>Choose an original source</h2>'+
 '<p>Open any source above to read its teaching notes and text, then continue in the existing native lessons and practice screens.</p></section>';
 return '<div class="c9-advanced-workspace">'+intro+stages+catalog+details+
 '<p class="c9-advanced-disclaimer">Installed P35–P51 material is original and editorially targeted; official HSK inventory, language certification, calibrated mastery, evaluated pronunciation and externally sourced recordings are not claimed. Native learner state and backup formats remain unchanged.</p></div>';
}
