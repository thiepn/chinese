/** P34 listening-first progress and study controls.
 * All answers flow through existing dialogueEvents/missionEvents and the single
 * Sentence Workshop writer. Audio is optional local device speech synthesis.
 */
import {P34_LISTENING,P34_SCENES,p34ReadForAudio} from './p34-course.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {BEGINNER_STORIES} from './beginner-reading.mjs';

export const p34DialogueFor=audioId=>DIALOGUES.find(d=>d.p34?.id===audioId)||null;
export const p34StoryFor=sceneId=>BEGINNER_STORIES.find(s=>s.beginner.source==='original-p34'&&
 s.title===P34_SCENES.find(x=>x.id===sceneId)?.title)||null;
export function p34StudyStats(state){
 const doneReading=new Set((state.readingEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 const doneAudio=new Set((state.dialogueEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 return {readings:P34_SCENES.filter(s=>doneReading.has(p34StoryFor(s.id)?.id)).length,
  listening:P34_LISTENING.filter(s=>doneAudio.has(p34DialogueFor(s.id)?.id)).length,
  writings:(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('p34:')||e.taskId.startsWith('beginner-reading:')&&
   P34_SCENES.some(s=>p34StoryFor(s.id)?.id&&e.taskId.includes(p34StoryFor(s.id).id))).length};
}
export function p34NextReading(state){
 const attempted=new Set((state.readingEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 return P34_SCENES.find(s=>!attempted.has(p34StoryFor(s.id)?.id))||P34_SCENES[0];
}
export function p34NextListening(state){
 const attempted=new Set((state.dialogueEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 return P34_LISTENING.find(s=>!attempted.has(p34DialogueFor(s.id)?.id))||P34_LISTENING[0];
}
export function p34Overview(state,act,esc,{compact=false,mode='all'}={}){
 const stats=p34StudyStats(state),nextR=p34NextReading(state),nextL=p34NextListening(state);
 return '<section class="p34-overview" aria-label="Beginner reading and listening course">'+
 '<div class="p34-heading"><div><p class="eyebrow">P34 · AUTHORED BEGINNER CHINESE</p>'+
 '<h2>Read the story. Then listen to a different conversation.</h2>'+
 '<p>Study connected text, answer with source evidence, then switch to spoken Mandarin without relying on the visible transcript. No official HSK alignment or native-recorded audio is claimed.</p></div>'+
 '<div class="p34-metrics"><span><strong>'+stats.readings+' / 25</strong> reading passages with independent correct attempts</span>'+
 '<span><strong>'+stats.listening+' / 25</strong> listening situations with independent correct attempts</span></div></div>'+
 '<div class="p34-actions">'+
 act('p34-open-reading','Continue reading →','button primary','data-id="'+nextR.id+'"')+
 act('p34-open-listening','Continue listening →','button outline','data-id="'+nextL.id+'"')+'</div>'+
 (!compact?'<div class="p34-reading-grid">'+P34_SCENES.map(s=>{
 const story=p34StoryFor(s.id),audio=P34_LISTENING[s.order-1];
 return '<article class="p34-reading-card"><span class="eyebrow">'+String(s.order).padStart(2,'0')+' · '+esc(s.theme)+' · '+(s.level===1?'First steps':'Building confidence')+'</span>'+
 '<h3>'+esc(s.title)+'</h3><p>'+esc(s.teach)+'</p><div class="p34-card-actions">'+
 act('p34-open-reading','Read six sentences →','button outline small','data-id="'+s.id+'"')+
 act('p34-open-listening','Listen first →','button outline small','data-id="'+audio.id+'"')+'</div></article>';
 }).join('')+'</div>':'')+
 '</section>';
}
export function p34ListeningPanel(d,state,act,esc,{line=0,shadow=false}={}){
 const s=d?.p34;if(!s)return '';
 const scene=p34ReadForAudio(s.id),story=scene&&p34StoryFor(scene.id),stats=p34StudyStats(state);
 const currentLine=s.lines[Math.min(Math.max(0,line),s.lines.length-1)];
 return '<section class="p34-listening-panel" aria-label="Listening-first lesson">'+
 '<div class="panel-heading"><div><p class="eyebrow">P34 · LISTENING WITHOUT A TRANSCRIPT</p><h2>'+esc(s.title)+'</h2></div><span class="muted">Situation '+(P34_LISTENING.indexOf(s)+1)+' / '+P34_LISTENING.length+'</span></div>'+
 '<p>First listen to the whole exchange without reading it. Repeat any line, reconstruct the key details, and answer the canonical dialogue question below. Opening the transcript counts as assisted practice.</p>'+
 '<div class="p34-audio-actions">'+
 act('speak','Play complete dialogue ▶','button primary','data-text="'+esc(s.lines.map(r=>r[1]).join('。'))+'"')+
 act('p34-slow','Replay at slower speed','button outline','data-text="'+esc(s.lines.map(r=>r[1]).join('。'))+'"')+
 act('dialogue-support','Reveal / hide transcript','button outline')+'</div>'+
 '<div class="p34-shadow"><div><span class="eyebrow">SHADOWING · TURN '+(line+1)+' / '+s.lines.length+'</span>'+
 '<p>Listen, pause, say the entire turn aloud yourself, and compare with the model when ready. Your speech is not recorded or graded.</p></div>'+
 '<div class="p34-shadow-actions">'+act('p34-shadow-prev','← Previous turn','button outline small',line===0?'disabled':'')+
 act('p34-shadow-replay','Hear this turn slowly ▶','button primary small','data-text="'+esc(currentLine[1])+'"')+
 act('p34-shadow-next','Next turn →','button outline small',line===s.lines.length-1?'disabled':'')+'</div></div>'+
 '<div class="p34-linkbox"><strong>Connect listening to reading</strong><p>'+esc(s.teaching)+'</p>'+
 (story?act('p34-open-reading','Read the paired six-sentence story →','button outline small','data-id="'+scene.id+'"'):'')+
 act('p34-write-listening','Write the final spoken turn from memory →','button primary small','data-id="'+s.id+'"')+'</div>'+
 '<p class="muted">The full dialogue question and three-stage text-evidence/Pinyin mission below use the existing attempt records. '+stats.listening+' of 25 audio scenarios have an independent correct dialogue response.</p></section>';
}
