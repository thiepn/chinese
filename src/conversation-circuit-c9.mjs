/**
 * C9-59 — multi-situation conversation circuit: a read-only projection of the
 * ORIGINAL P33 authored sources and actual native event histories.
 *
 * The grouped circuit is thematic navigation, NOT a new authored storyline,
 * lesson identity, scheduler, graded activity, proficiency claim or progress
 * store. Source owners: P33/P34/P43 and the native app graders exclusively.
 */
import {P33_SCENARIOS} from './p33-scenarios.mjs';
import {P34_LISTENING} from './p34-course.mjs';
import {P43_UNITS} from './p43-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {SENTENCE_TASKS} from './sentence-workshop.mjs';

const bySceneId=new Map(DIALOGUES.filter(d=>d.p33).map(d=>[d.p33.id,d]));
const sceneOrder=new Map(P33_SCENARIOS.map((scene,i)=>[scene.id,i]));
const sourceTasks=new Map(P33_SCENARIOS.map(scene=>[scene.id,
  SENTENCE_TASKS.filter(t=>t.p33ScenarioId===scene.id)]));
const sourcesForTheme=theme=>P33_SCENARIOS.filter(scene=>scene.theme===theme);

export function c9ConversationCircuit(dialogue,state={}){
 const scene=dialogue?.p33;
 if(!scene||sceneOrder.get(scene.id)===undefined)return null;
 const sequence=sourcesForTheme(scene.theme).map(source=>{
  const original=bySceneId.get(source.id);
  if(!original)return null;
  const attempts=(state.dialogueEvents||[]).filter(e=>e.dialogueId===original.id);
  const missionAttempts=(state.missionEvents||[]).filter(e=>e.dialogueId===original.id);
  const tasks=sourceTasks.get(source.id)||[];
  const taskIds=new Set(tasks.map(t=>t.id));
  const writing=(state.sentenceEvents||[]).filter(e=>taskIds.has(e.taskId));
  const writingTasks=Object.freeze(tasks.map(task=>{
   const entries=writing.filter(event=>event.taskId===task.id);
   return Object.freeze({id:task.id,turn:task.p33Turn,english:task.english,
    attempts:entries.length,independent:entries.filter(e=>e.correct&&!e.assisted).length,
    last:entries.length?(entries.at(-1).assisted?'assisted':entries.at(-1).correct?'independent correct':'incorrect'):null});
  }));
  return Object.freeze({
   sceneId:source.id,dialogueId:original.id,title:source.title,theme:source.theme,goal:source.goal,
   attempts:attempts.length,independent:attempts.filter(e=>e.correct&&!e.assisted).length,
   missions:missionAttempts.length,writing:writing.length,
   independentWriting:writing.filter(e=>e.correct&&!e.assisted).length,
   writingTasks,writingTaskId:tasks[0]?.id||null
  });
 }).filter(Boolean);
 const index=sequence.findIndex(row=>row.dialogueId===dialogue.id);
 if(index<0)return null;
 // An exact editorial theme is a topical navigation relation only, never
 // evidence that P33 and P34 form one story or share a rubric.
 const sameThemeListening=P34_LISTENING.filter(item=>item.theme===scene.theme);
 const linkedWriting=P43_UNITS.filter(u=>u.dialogueId===dialogue.id);
 return {
  theme:scene.theme,index,count:sequence.length,sequence,
  current:sequence[index],previous:sequence[index-1]||null,next:sequence[index+1]||null,
  listening:sameThemeListening[0]||null,
  listeningMatches:sameThemeListening.length,
  writingUnit:linkedWriting[0]||null
 };
}
/**
 * Source-verified, in-tab return context for the ONE native sentence writer.
 * Caller owns the ephemeral receipt; this only verifies original IDs and
 * displays existing actual graded event history, never writes anything.
 */
export function c9WorkshopSourceContinuation(taskId,origin,state={}){
 const task=SENTENCE_TASKS.find(item=>item.id===taskId);
 if(!task||!origin||origin.taskId!==task.id)return null;
 const events=(state.sentenceEvents||[]).filter(e=>e.taskId===taskId);
 const observed={attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length};
 if(origin.kind==='p33'){
  const scene=P33_SCENARIOS.find(s=>s.id===task.p33ScenarioId);
  const dialogue=scene&&bySceneId.get(scene.id);
  if(!dialogue||dialogue.id!==origin.dialogueId)return null;
  const tasks=sourceTasks.get(scene.id)||[];
  const position=tasks.findIndex(t=>t.id===taskId);
  if(position<0)return null;
  return {kind:'p33',dialogueId:dialogue.id,sourceTitle:scene.title,taskId,
   position,count:tasks.length,nextTaskId:tasks[position+1]?.id||null,...observed};
 }
 if(origin.kind==='p34'){
  const audio=P34_LISTENING.find(s=>s.id===task.p34AudioId);
  const dialogue=audio&&DIALOGUES.find(d=>d.p34?.id===audio.id);
  if(!dialogue||dialogue.id!==origin.dialogueId||task.id!=='p34:'+audio.id+':writing')return null;
  return {kind:'p34',dialogueId:dialogue.id,sourceTitle:audio.title,taskId,
   position:0,count:1,nextTaskId:null,...observed};
 }
 return null;
}
export function renderC9WorkshopSourceContinuation(taskId,origin,state,act,esc){
 const source=c9WorkshopSourceContinuation(taskId,origin,state);
 if(!source)return '';
 const label=source.kind==='p33'?'P33 authored conversational writing':'P34 listening-to-writing';
 return '<section class="c9-workshop-continuation c9-unified-card" id="c9-workshop-continuation" tabindex="-1" aria-labelledby="c9-workshop-return-title">'+
  '<div><p class="c9-eyebrow">ORIGINAL SOURCE · '+label+'</p>'+
  '<h2 id="c9-workshop-return-title">Continue '+esc(source.sourceTitle)+'</h2>'+
  '<p>Native Sentence Workshop task '+(source.position+1)+' / '+source.count+
  '. '+source.attempts+' recorded attempt'+(source.attempts===1?'':'s')+' · '+source.independent+
  ' independently correct. A link is not completion evidence; each response is checked only by the original sentence writer.</p></div>'+
  '<div class="c9-workshop-continuation-actions">'+
  act('c9-workshop-return','Return to exact original '+(source.kind==='p33'?'conversation':'listening')+' →',
   'c9-button c9-button--secondary','data-id="'+esc(source.dialogueId)+'"')+
  (source.nextTaskId?act('c9-workshop-next-source','Next original writing task →','c9-button c9-button--primary',
   'data-id="'+esc(source.nextTaskId)+'"'):'')+'</div>'+
  '<small>Unsubmitted writing remains protected by the native departure prompt. This tab-only source context is not a new saved journey.</small></section>';
}
export function renderC9ConversationCircuit(dialogue,state,act,esc){
 const circuit=c9ConversationCircuit(dialogue,state);
 if(!circuit)return '';
 const {sequence,index,current}=circuit;
 const first=Math.max(0,Math.min(index-1,sequence.length-4));
 const visible=sequence.slice(first,first+4);
 const card=source=>'<li class="c9-circuit-stop'+(source.dialogueId===dialogue.id?' is-current':'')+'">'+
  '<div><span class="c9-eyebrow">ORIGINAL P33 · '+esc(source.sceneId)+'</span>'+
  '<strong>'+esc(source.title)+'</strong><p>'+esc(source.goal)+'</p>'+
  '<small>'+source.attempts+' native question attempt'+(source.attempts===1?'':'s')+
  ' · '+source.independent+' independent correct · '+source.writing+' original written attempt'+(source.writing===1?'':'s')+'</small></div>'+
  (source.dialogueId===dialogue.id?'<span class="c9-circuit-current" aria-current="step">Current situation</span>':
  act('c9-circuit-open','Open situation →','c9-button c9-button--secondary c9-button--small',
   'data-id="'+esc(source.dialogueId)+'"'))+'</li>';
 const nav=([source,label])=>source?act('c9-circuit-open',label,'c9-button c9-button--secondary c9-button--small',
  'data-id="'+esc(source.dialogueId)+'"'):'';
 const p34=circuit.listening?
  '<article class="c9-circuit-extension"><span class="c9-eyebrow">P34 · SAME EXACT THEME, DIFFERENT AUTHORIAL SOURCE</span>'+
  '<strong>'+esc(circuit.listening.title)+'</strong><p>A separate original listening scene shares the theme label. It is not the next turn in this story or proof of comprehension.</p>'+
  act('p34-open-listening','Open original listening and questions →','c9-button c9-button--secondary c9-button--small',
   'data-id="'+esc(circuit.listening.id)+'"')+
  act('c9-circuit-p34-write','Write this distinct original listening prompt →',
   'c9-button c9-button--secondary c9-button--small','data-id="'+esc(circuit.listening.id)+'"')+'</article>':
  '<p class="c9-circuit-no-match">No P34 listening scene has this exact editorial theme label. Other listening scenes remain accessible in the native listening catalog.</p>';
 const writing=circuit.writingUnit?
  '<p>Original P43 composition explicitly links to this conversation: <strong>'+esc(circuit.writingUnit.title)+'</strong>.</p>'+
  act('p43-open','Open linked original P43 composition →','c9-button c9-button--secondary c9-button--small',
   'data-id="'+esc(circuit.writingUnit.id)+'"'):
  '<p>P43 has no explicit original-source link for this P33 dialogue. You can still practise a separate authored composition without claiming it belongs to this story.</p>'+
  act('p43-enter','Browse independent P43 writing topics →','c9-button c9-button--secondary c9-button--small');
 return '<section class="c9-conversation-circuit c9-unified-card" id="c9-conversation-circuit" tabindex="-1" aria-labelledby="c9-circuit-title">'+
  '<header><div><p class="c9-eyebrow">MULTI-SITUATION COMMUNICATION · ORIGINAL SOURCES</p>'+
  '<h2 id="c9-circuit-title">Continue across everyday situations</h2>'+
  '<p>Practise several separately authored conversations under the same original theme. Move from listening and decisions to spoken rehearsal, actual native assessment, and source-owned writing. No automatic progress or completion credit.</p></div>'+
  '<span class="c9-badge">Situation '+(index+1)+' / '+sequence.length+'</span></header>'+
  '<div class="c9-circuit-meta"><strong>'+esc(circuit.theme)+'</strong>'+
  '<span>Current source '+esc(current.sceneId)+' · '+current.attempts+' question attempts · '+current.missions+' native mission attempts · '+current.writing+' source writing attempts</span></div>'+
  '<ol class="c9-circuit-list" start="'+(first+1)+'">'+visible.map(card).join('')+'</ol>'+
  '<nav class="c9-circuit-navigation" aria-label="Original same-theme conversation navigation">'+
  nav([circuit.previous,'← Previous situation'])+nav([circuit.next,'Next situation →'])+
  '</nav>'+
  '<div class="c9-circuit-transfer"><article class="c9-circuit-extension">'+
  '<span class="c9-eyebrow">ORIGINAL SOURCE PRACTICE · NO NEW GRADER</span>'+
  '<strong>Listen → choose → speak → write</strong>'+
  '<p>Open the native role-taking, original comprehension, or the original P33 writing task. These retain their existing graders, assistance flags and private history.</p>'+
  '<div class="c9-circuit-actions">'+
  act('c9-media-focus-native','Rehearse speaker turns →','c9-button c9-button--secondary c9-button--small','data-target="c9-roleplay-studio"')+
  act('c9-media-focus-native','Original listening questions →','c9-button c9-button--secondary c9-button--small','data-target="c9-native-dialogue"')+
  (current.writingTaskId?act('c9-circuit-write','Original source writing task →','c9-button c9-button--primary c9-button--small',
   'data-id="'+esc(current.writingTaskId)+'"'):'')+
  '</div><div class="c9-circuit-writing-steps" aria-label="Original situation writing tasks">'+
  '<strong>Reconstruct all '+current.writingTasks.length+' original authored writing turns</strong>'+
  '<p>Each task opens the existing native Sentence Workshop; previous attempts are observed, not translated into mastery.</p>'+
  '<ol>'+current.writingTasks.map((task,i)=>'<li><span>Turn '+(Number(task.turn)+1)+'</span>'+
   '<div><strong>'+esc(task.english)+'</strong>'+
   '<small>'+task.attempts+' actual attempt'+(task.attempts===1?'':'s')+
   ' · '+task.independent+' independent correct'+(task.last?' · Last: '+esc(task.last):'')+'</small></div>'+
   act('c9-circuit-write','Write original turn '+(i+1)+' →','c9-button c9-button--secondary c9-button--small',
    'data-id="'+esc(task.id)+'"')+'</li>').join('')+'</ol></div></article>'+p34+
  '<article class="c9-circuit-extension"><span class="c9-eyebrow">P43 · SINGLE NATIVE COMPOSITION EDITOR</span>'+
  '<strong>Extend into independent writing</strong>'+writing+'</article></div>'+
  '<p class="c9-circuit-note">Only observed native attempts are shown. Thematic sequence is an editorial grouping of separate original situations, not a continuous invented conversation, HSK curriculum or mastery estimate.</p></section>';
}
