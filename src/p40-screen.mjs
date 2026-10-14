/** P40 learner-facing intermediate grammar UI.
 * Reads only canonical grammar and Sentence Workshop evidence. Never creates
 * parallel scores, shadow lesson completion or separate progress records.
 */
import {P40_GRAMMAR_IDS,P40_REPAIR_CASES,p40RepairFor} from './p40-course.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {P39_CHARACTER_GUIDES} from './p39-foundations.mjs';
import {WORDS} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';

const attempts=(state,id)=>(state.sentenceEvents||[]).filter(e=>
 e.taskId.startsWith('grammar:'+id+':')||e.taskId==='p40:fix:'+id);
export const p40Attempted=(state,id)=>attempts(state,id).length>0;
export const p40Next=state=>P40_GRAMMAR_IDS.find(id=>!p40Attempted(state,id))||P40_GRAMMAR_IDS[0];
const sections=[
 ['g95','g104','Action, order & degree','Build affected-object sentences, overlapping actions and changing degrees'],
 ['g105','g114','Conditions & reasoning','Explain contrasts, sufficiency, necessity and consequences'],
 ['g115','g124','Evidence & nuance','Distinguish a topic from evidence, express viewpoint and information focus']
];
export function p40Overview(state,act,esc,{compact=false}={}){
 const practiced=P40_GRAMMAR_IDS.filter(id=>p40Attempted(state,id)).length;
 const independent=new Set((state.sentenceEvents||[]).filter(e=>e.correct&&!e.assisted&&
 (e.taskId.startsWith('p40:fix:')||/^grammar:g(?:9[5-9]|1(?:0[0-9]|1[0-9]|2[0-4])):/.test(e.taskId)))
 .map(e=>e.taskId)).size;
 const next=p40Next(state),focus=GRAMMAR_LESSONS.find(l=>l.id===next);
 return '<section class="p40-overview '+(compact?'compact':'')+'" aria-label="P40 intermediate grammar journey">'+
 '<div><p class="eyebrow">P40 · ORIGINAL INTERMEDIATE MANDARIN</p><h2>Choose the construction, then defend the meaning</h2>'+
 '<p>Thirty original intermediate-targeted lessons combine contextual contrasts, 90 written sentence models, 150 native grammar exercises and 30 meaning-repair transfers. Pedagogical sequence only; not an official HSK 3.0 syllabus.</p>'+
 '<div class="p40-stats"><span><strong>'+practiced+' / '+P40_GRAMMAR_IDS.length+'</strong>patterns attempted</span>'+
 '<span><strong>'+independent+'</strong>distinct independently correct tasks</span></div></div>'+
 '<div class="p40-actions">'+(focus?act('grammar-select','Continue: '+esc(focus.title)+' →','button primary','data-id="'+focus.id+'"'):'')+
 act('p40-repair','Repair intended meaning →','button outline','data-id="'+next+'"')+
 act('p40-sentences','90 linked practice sentences →','button outline')+
 act('p46-enter','Continue to P46 advanced meaning contrasts →','button outline')+
 '</div></section>'+
 (compact?'':'<section class="p40-catalog" aria-label="P40 detailed lesson catalogue">'+
 sections.map(([first,last,name,description])=>{
 const group=P40_GRAMMAR_IDS.filter(id=>Number(id.slice(1))>=Number(first.slice(1))&&Number(id.slice(1))<=Number(last.slice(1)));
 const completed=group.filter(id=>p40Attempted(state,id)).length;
 return '<div class="p40-unit"><h3>'+esc(name)+'</h3><p>'+esc(description)+'</p><small>'+completed+' / '+group.length+' attempted · no mastery claim</small>'+
 '<div class="p40-lessons">'+group.map(id=>{
 const l=GRAMMAR_LESSONS.find(g=>g.id===id);
 return l?act('grammar-select','<span>'+esc(id)+'</span><strong>'+esc(l.title)+'</strong><small>'+esc(l.pattern)+'</small><em>'+(p40Attempted(state,id)?'Attempted':'Not attempted')+'</em>',
 'p40-lesson-row','data-id="'+id+'"'):'';
 }).join('')+'</div></div>';
 }).join('')+'</section>');
}
export function p40TeachingExtension(lesson,act,esc,{showModel=false}={}){
 const repair=p40RepairFor(lesson?.id);if(!repair)return '';
 const p39=P39_CHARACTER_GUIDES.filter(g=>g.hanzi===lesson.anchor||
  lesson.examples.some(e=>e.hanzi.includes(g.hanzi))).slice(0,3);
 const words=WORDS.filter(w=>w.hanzi.length>1&&
  lesson.examples.some(e=>e.hanzi.includes(w.hanzi))&&
  w.lessonIds.some(id=>p39.some(g=>g.id===id))).slice(0,5);
 const sourceRows=SENTENCE_LIBRARY.filter(s=>s.source==='original-p40'&&s.grammarIds.includes(lesson.id));
 const readings=STORIES.filter(st=>st.lines.some(line=>
  words.some(w=>line.hanzi.includes(w.hanzi)))).slice(0,2);
 const model=repair.correct;
 return '<section class="p40-teaching" aria-label="P40 nuanced interpretation and independent meaning repair">'+
 '<div class="p40-teaching-head"><p class="eyebrow">P40 · WHY THIS WORD ORDER?</p>'+
 '<h3>Choose the intended meaning, not just a familiar particle</h3>'+
 '<p>Study the contrast, then correct a sentence for one stated interpretation. The example below is less suitable for that meaning; it is not a judgment of every possible context.</p></div>'+
 '<div class="p40-comparison"><div><strong>LESS SUITABLE IN THIS CONTEXT</strong><p lang="zh-Hans">'+esc(repair.incorrect)+'</p>'+
 '<p>'+esc(repair.intendedMeaning)+'</p></div><div><strong>'+(showModel?'MODEL REVEALED · ASSISTED':'REFERENCE HIDDEN · INDEPENDENT FIRST')+'</strong>'+
 (showModel?'<p lang="zh-Hans">'+esc(model.hanzi)+'</p><small>'+esc(model.pinyin)+'</small><p>'+esc(model.english)+'</p>':
 '<p>Use the intended English meaning and the teaching above to write a suitable complete sentence. You can request a reference before writing, but your attempt is then assisted.</p>')+
 '</div></div><div class="p40-explanation"><h4>Which meaning does the grammar change?</h4><p>'+esc(repair.contrast)+'</p>'+
 '<h4>Misconception to avoid</h4><p>'+esc(repair.pitfall)+'</p></div>'+
 '<div class="button-row">'+act('p40-repair',showModel?'Reconstruct with assistance →':'Try independent repair →','button primary','data-id="'+repair.grammarId+'"')+
 act('p40-toggle-model',showModel?'Hide the model':'Reveal model · counts as assisted','button outline','data-id="'+repair.grammarId+'"')+
 act('p40-sentences','More linked P40 sentences →','button outline small')+'</div>'+
 '<div class="p40-source-links"><h4>Connections to the original learning course</h4>'+
 (p39.length?'<div class="p40-linkrow"><strong>P39 characters</strong>'+p39.map(g=>act('p39-open',esc(g.hanzi)+' · '+esc(g.meaning),'button outline small','data-id="'+g.id+'"')).join('')+'</div>':'')+
 (words.length?'<div class="p40-linkrow"><strong>Canonical Wordbook</strong>'+words.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.senses[0]||''),'button outline small','data-id="'+esc(w.key)+'"')).join('')+'</div>':'')+
 (sourceRows.length?'<div class="p40-linkrow"><strong>Sentence Library practice</strong>'+sourceRows.map(s=>act('sentence-select','<span lang="zh-Hans">'+esc(s.hanzi)+'</span><small>'+esc(s.english)+'</small>',
 'p40-sentence-link','data-id="'+s.id+'"')).join('')+'</div>':'')+
 (readings.length?'<div class="p40-linkrow"><strong>Previously authored readings</strong>'+readings.map(r=>act('open-story-link',esc(r.title)+' →','button outline small','data-id="'+r.id+'"')).join('')+'</div>':'')+
 '</div><p class="p40-caveat">Original intermediate-targeted examples, not official HSK 3.0 coverage. Exact-form automated checking cannot adjudicate every valid Mandarin alternative.</p></section>';
}
