/** P36 learner-facing cross-course grammar journey.
 * No shadow mastery, progress writer, alternate grammar grader or new storage.
 * Original grammar and Workshop modules own evidence and answer correction.
 */
import {P36_GRAMMAR_IDS,P36_REPAIR_CASES,p36RepairFor} from './p36-course.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {P35_CHARACTER_GUIDES} from './p35-foundations.mjs';
import {WORDS} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';

export const p36Attempted=(state,id)=>(state.sentenceEvents||[]).some(e=>
 e.taskId.startsWith('grammar:'+id+':')||e.taskId==='p36:fix:'+id);
export const p36Next=(state)=>P36_GRAMMAR_IDS.find(id=>!p36Attempted(state,id))||P36_GRAMMAR_IDS[0];
export function p36Overview(state,act,esc,{compact=false}={}){
 const total=P36_GRAMMAR_IDS.filter(id=>p36Attempted(state,id)).length;
 const next=p36Next(state),lesson=GRAMMAR_LESSONS.find(l=>l.id===next);
 const repairs=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('p36:fix:')).length;
 return '<section class="p36-overview '+(compact?'compact':'')+'" aria-label="P36 elementary grammar course">'+
 '<div><p class="eyebrow">P36 · ORIGINAL ELEMENTARY MANDARIN</p><h2>Grammar that changes what a sentence means</h2>'+
 '<p>Learn an expressive pattern, distinguish the wrong interpretation, answer a contextual question, then independently reconstruct the corrected sentence. Course-targeted elementary material, not an official HSK 3.0 syllabus.</p></div>'+
 '<div class="p36-progress"><strong>'+total+' / '+P36_GRAMMAR_IDS.length+'</strong><span>Patterns with recorded practice attempts</span><small>'+repairs+' correction attempts · neither number certifies mastery</small></div>'+
 '<div class="p36-actions">'+(lesson?act('grammar-select','Continue: '+esc(lesson.title)+' →','button primary','data-id="'+lesson.id+'"'):'')+
 act('p36-repair','Practice a correction →','button outline','data-id="'+next+'"')+
 act('p36-sentences','Find P36 grammar sentences →','button outline')+'</div>'+
 (!compact?'<div class="p36-lesson-grid">'+P36_GRAMMAR_IDS.map((id,i)=>{
 const row=GRAMMAR_LESSONS.find(l=>l.id===id);
 if(!row)return '';
 return act('grammar-select','<span>'+(i+1).toString().padStart(2,'0')+' · '+esc(row.chapter)+'</span>'+
 '<strong>'+esc(row.title)+'</strong><small>'+esc(row.pattern)+'</small>'+
 '<em>'+ (p36Attempted(state,id)?'Attempted':'Not attempted')+'</em>',
 'p36-lesson-card','data-id="'+id+'"');
 }).join('')+'</div>':'')+'</section>';
}
export function p36TeachingExtension(lesson,act,esc){
 const repair=p36RepairFor(lesson?.id);if(!repair)return '';
 const related=P35_CHARACTER_GUIDES.filter(g=>g.hanzi===lesson.anchor||
 g.words.some(w=>lesson.examples.some(e=>e.hanzi.includes(w.hanzi)))).slice(0,3);
 const vocabulary=WORDS.filter(w=>w.hanzi.length>=2&&
 lesson.examples.some(e=>e.hanzi.includes(w.hanzi))&&w.lessonIds.some(id=>id.startsWith('demo-'))).slice(0,4);
 const reading=STORIES.filter(st=>st.lines.some(line=>
   related.some(g=>line.hanzi.includes(g.words[0].hanzi)))).slice(0,2);
 const dialogue=DIALOGUES.filter(d=>d.lines.some(line=>
   related.some(g=>line.hanzi.includes(g.words[0].hanzi)))).slice(0,2);
 const sentences=SENTENCE_LIBRARY.filter(row=>row.source==='original-p36'&&
  (row.hanzi===lesson.examples[0].hanzi||row.hanzi===lesson.examples[1].hanzi||
  row.hanzi===lesson.transformation.model.hanzi)).slice(0,4);
 return '<section class="p36-teaching-ext" aria-label="Misconception repair and transfer">'+
 '<div class="p36-ext-top"><p class="eyebrow">P36 · CONTEXT-SPECIFIC LANGUAGE REPAIR</p>'+
 '<h3>Compare what the learner wrote with the intended message</h3>'+
 '<p>The example sentence is faulty or misleading for the <em>specified meaning</em>; it is not an automatic verdict on every possible context.</p></div>'+
 '<div class="p36-correction"><div><span>LESS SUITABLE FOR THIS MEANING</span>'+
 '<p lang="zh-Hans">'+esc(repair.incorrect)+'</p></div>'+
 '<div><span>TAUGHT MODEL</span><p lang="zh-Hans">'+esc(repair.correct.hanzi)+'</p>'+
 '<small>'+esc(repair.correct.pinyin)+'</small><p>'+esc(repair.correct.english)+'</p></div></div>'+
 '<div class="p36-reason"><strong>Why this matters</strong><p>'+esc(repair.pitfall)+'</p><p>'+esc(repair.contrast)+'</p></div>'+
 '<div class="p36-ext-actions">'+act('p36-repair','Repair this sentence independently →','button primary','data-id="'+repair.grammarId+'"')+
 act('p36-sentences','More examples in the Sentence Library →','button outline')+'</div>'+
 (related.length?'<div class="p36-crosslinks"><strong>Apply P35 character vocabulary</strong><div class="button-row">'+
 related.map(g=>act('p35-open-lesson',esc(g.hanzi)+' · '+esc(g.meaning)+' →','button outline small','data-id="'+g.id+'"')).join('')+'</div></div>':'')+
 (vocabulary.length?'<div class="p36-crosslinks"><strong>Use words in the original Wordbook</strong><div class="button-row">'+
 vocabulary.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin)+' →','button outline small','data-id="'+esc(w.key)+'"')).join('')+'</div></div>':'')+
 (sentences.length?'<div class="p36-crosslinks"><strong>Practise related original sentences</strong><div class="p36-sentence-links">'+
 sentences.map(s=>act('sentence-select','<span lang="zh-Hans">'+esc(s.hanzi)+'</span><small>'+esc(s.english)+'</small>',
 'p36-sentence-link','data-id="'+s.id+'"')).join('')+'</div></div>':'')+
 (reading.length?'<div class="p36-crosslinks"><strong>Reading transfer</strong><div class="button-row">'+
 reading.map(s=>act('open-story-link',esc(s.title)+' →','button outline small','data-id="'+s.id+'"')).join('')+'</div></div>':'')+
 (dialogue.length?'<div class="p36-crosslinks"><strong>Conversation transfer</strong><div class="button-row">'+
 dialogue.map(d=>act('hub-dialogue',esc(d.title)+' →','button outline small','data-id="'+d.id+'"')).join('')+'</div></div>':'')+
 '</section>';
}
