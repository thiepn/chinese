/** P42 intermediate listening-first learner interface.
 * Presentation only. Native DIALOGUES, dialogueEvents, missionEvents,
 * Sentence Workshop and Account ownership remain the sole authorities.
 */
import {P42_SCENES,findP42Scene,p42Evidence} from './p42-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {P41_PASSAGES} from './p41-readings.mjs';
import {P43_UNITS} from './p43-course.mjs';
import {P44_SCENARIOS} from './p44-course.mjs';
import {P45_TRANSFERS} from './p45-course.mjs';
const dialogueFor=s=>DIALOGUES.find(d=>d.p42?.id===s.id);
export function p42Next(state,after=null){
 const index=P42_SCENES.findIndex(s=>s.id===after);
 const choices=index<0?P42_SCENES:[...P42_SCENES.slice(index+1),...P42_SCENES.slice(0,index+1)];
 return choices.find(s=>{
  const d=dialogueFor(s);
  return d&&!(state.dialogueEvents||[]).some(e=>e.dialogueId===d.id&&e.correct&&!e.assisted);
 })||choices[0]||P42_SCENES[0];
}
export function p42Overview(state,act,esc,{compact=false,query='',page=0,selected=null}={}){
 const text=String(query).trim().toLocaleLowerCase();
 const items=P42_SCENES.filter(s=>!text||[s.title,s.theme,s.goal,s.teaching,s.vocabulary.hanzi,
 ...s.turns.map(t=>t[1])].join(' ').toLocaleLowerCase().includes(text));
 const max=Math.max(0,Math.ceil(items.length/6)-1),current=Math.min(max,Math.max(0,Number(page)||0));
 const started=P42_SCENES.filter(s=>(state.dialogueEvents||[]).some(e=>e.dialogueId===dialogueFor(s)?.id)).length;
 const independent=P42_SCENES.filter(s=>(state.dialogueEvents||[]).some(e=>
 e.dialogueId===dialogueFor(s)?.id&&e.correct&&!e.assisted)).length;
 const next=p42Next(state);
 return '<section class="p42-overview" aria-label="P42 original intermediate listening">'+
 '<div class="p42-heading"><div><p class="eyebrow">P42 · ORIGINAL INTERMEDIATE SPOKEN MANDARIN</p>'+
 '<h2>Listen for meaning before reading the script.</h2><p>Twelve original eight-turn situations with complete Simplified Chinese, tone-marked Pinyin and English; 36 precise evidence questions, 24 native written reconstructions and independent spoken-response prompts. Device speech synthesis only: not a recording, pronunciation grade or official HSK 3.0 inventory.</p></div>'+
 '<div class="p42-totals"><strong>'+started+' / '+P42_SCENES.length+'</strong><span>Situations attempted</span>'+
 '<strong>'+independent+' / '+P42_SCENES.length+'</strong><span>With an independent correct dialogue response; not certified mastery</span>'+
 act('p42-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div></div>'+
 (compact?'<div class="button-row">'+act('p42-browse','Browse listening situations →','button outline')+'</div>':
 '<label for="p42-search">Search spoken situation, topic, Chinese term or learning goal</label>'+
 '<input id="p42-search" type="search" value="'+esc(query)+'" placeholder="Try appointment, 资料, misunderstandings" autocomplete="off">'+
 '<div class="p42-grid">'+items.slice(current*6,current*6+6).map(s=>{
 const d=dialogueFor(s),n=(state.dialogueEvents||[]).filter(e=>e.dialogueId===d?.id).length;
 return act('p42-open','<small>LISTENING '+String(s.sequence).padStart(2,'0')+' · '+esc(s.theme)+'</small>'+
 '<strong>'+esc(s.title)+'</strong><span>'+esc(s.goal)+'</span>'+
 '<em>8 turns · 3 evidence questions · '+(n?n+' recorded attempts':'Not attempted')+'</em>',
 'p42-card '+(selected===s.id?'active':''),'data-id="'+s.id+'"');
 }).join('')+'</div>'+(!items.length?'<p class="muted">No scenarios match. Clear the search to see all original dialogues.</p>':'')+
 '<div class="p42-pages">'+act('p42-prev','← Previous','button outline small',current>0?'':'disabled')+
 '<span>Page '+(current+1)+' / '+(max+1)+'</span>'+
 act('p42-page-next','Next →','button outline small',current<max?'':'disabled')+'</div>')+
 '</section>';
}
export function p42ListeningPanel(dialogue,act,esc,{turn=0,revealed=false,feedback=null,question=0}={}){
 const s=dialogue?.p42;if(!s)return '';
 const current=Math.max(0,Math.min(s.turns.length-1,Number(turn)||0));
 const line=s.turns[current],evidence=feedback?p42Evidence(s.id,question):null;
 const grammar=s.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const words=WORDS.filter(w=>w.hanzi.length>1&&s.turns.some(t=>t[1].includes(w.hanzi))).slice(0,8);
 const chars=P39_CHARACTER_GUIDES.filter(g=>s.turns.some(t=>t[1].includes(g.hanzi))).slice(0,5);
 const readings=P41_PASSAGES.filter(p=>p.grammarIds.some(g=>s.grammarIds.includes(g))||
  p.lines.some(line=>line.hanzi.includes(s.vocabulary.hanzi))).slice(0,3);
 const writing=P43_UNITS.find(u=>u.dialogueId===s.id);
 const applied=P44_SCENARIOS.find(u=>u.dialogueId===s.id);
 const cumulative=P45_TRANSFERS.find(t=>t.sourceCase?.dialogueId===s.id);
 const whole=s.turns.map(t=>t[1]).join(' ');
 return '<section class="p42-listening" aria-label="P42 listening-first conversation">'+
 '<div class="p42-intro"><div><p class="eyebrow">P42 · SITUATION '+s.sequence+' / '+P42_SCENES.length+' · '+esc(s.theme)+'</p>'+
 '<h3>'+esc(s.title)+'</h3><p>'+esc(s.goal)+'</p></div>'+
 '<span>Listen first · eight turns · human speech is not recorded or evaluated</span></div>'+
 '<div class="p42-sound-actions">'+act('speak','Play whole exchange','button primary','data-text="'+esc(whole)+'"')+
 act('p42-slow','Replay slower','button outline')+
 act('p42-toggle-transcript',revealed?'Hide Chinese, Pinyin & English':'Reveal transcript · assisted','button outline')+'</div>'+
 '<div class="p42-shadow"><div><span class="eyebrow">TURN '+(current+1)+' / '+s.turns.length+' · SPEAKER '+esc(line[0])+'</span>'+
 (revealed?'<p lang="zh-Hans">'+esc(line[1])+'</p><small>'+esc(line[2])+'</small><p>'+esc(line[3])+'</p>':
 '<p>Replay this turn. Listen for the speaker’s meaning, then try shadowing it aloud before revealing text.</p>')+
 '</div><div class="p42-shadow-buttons">'+act('p42-turn-prev','← Previous turn','button outline small',current>0?'':'disabled')+
 act('p42-turn-play','Listen to this turn','button primary small')+
 act('p42-turn-next','Next turn →','button outline small',current<s.turns.length-1?'':'disabled')+'</div></div>'+
 '<div class="p42-guidance"><h4>Listen for the actual commitment</h4><p>'+esc(s.teaching)+'</p>'+
 '<p><strong>A frequent meaning mistake:</strong> '+esc(s.pitfall)+'</p>'+
 '<p><strong>Spoken-response goal:</strong> '+esc(s.oral)+'</p></div>'+
 (evidence?'<div class="p42-evidence" role="status"><h4>Source evidence for this answer · turn '+(evidence.turn+1)+'</h4>'+
 '<p lang="zh-Hans">'+esc(evidence.model[1])+'</p><small>'+esc(evidence.model[2])+'</small>'+
 '<p>'+esc(evidence.model[3])+'</p><p>'+esc(evidence.reason)+'</p>'+
 '<p><strong>Contrast:</strong> '+esc(evidence.contrast)+'</p></div>':'')+
 '<div class="p42-next-actions"><div class="button-row">'+
 act('p42-write','Reconstruct Speaker B in Sentence Workshop →','button primary','data-id="'+s.id+'" data-turn="3"')+
 act('p42-write','Reconstruct the final response →','button outline','data-id="'+s.id+'" data-turn="7"')+
 (writing?act('p43-open','Prepare an independent paragraph and oral response →','button outline','data-id="'+writing.id+'"'):'')+
 (applied?act('p44-open','Apply this conversation across five skills →','button outline','data-id="'+applied.id+'"'):'')+
 (cumulative?act('p45-open','Apply this conversation independently in P45 →','button outline','data-id="'+cumulative.id+'"'):'')+
 act('mission-start','Three-stage comprehension mission →','button outline')+
 act('p42-next','Next listening situation →','button outline')+'</div></div>'+
 '<div class="p42-links"><strong>Continue with authorized P39 / P40 material</strong>'+
 (grammar.length?'<div>'+grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+'</div>':'')+
 (chars.length?'<div>'+chars.map(g=>act('p39-open',esc(g.hanzi)+' · '+esc(g.meaning),'button outline small','data-id="'+g.id+'"')).join('')+'</div>':'')+
 (words.length?'<div>'+words.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.senses[0]||''),'button outline small','data-id="'+esc(w.key)+'"')).join('')+'</div>':'')+'</div>'+
 (readings.length?'<div class="p42-links"><strong>Related original P41 readings</strong>'+readings.map(p=>act('p41-open',esc(p.title)+' →','button outline small','data-id="'+p.id+'"')).join('')+'</div>':'')+
 '<p class="p42-caveat">Revealing the script or a reference answer marks the subsequent native response assisted, including after hiding it again. Listening exercises use your device’s synthesized Chinese voice, not an approved native-speaker recording. Oral production here is self-practice only; no microphone or automatic speech grading is used.</p></section>';
}
