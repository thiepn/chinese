/** P25 original standalone Mandarin grammar course.
 * Curriculum content extends the character-companion teaching without inventing
 * an HSK affiliation. Exact writing practice feeds the existing Sentence
 * Workshop source IDs and event writer; no duplicate mastery or progress store.
 */
import {GRAMMAR_ROWS_A} from './grammar-course-data-a.mjs';
import {GRAMMAR_ROWS_B} from './grammar-course-data-b.mjs';
import {P32_GRAMMAR_ROWS_A} from './p32-grammar-a.mjs';
import {P32_GRAMMAR_ROWS_B} from './p32-grammar-b.mjs';
import {P36_GRAMMAR_ROWS} from './p36-course.mjs';
import {P40_GRAMMAR_ROWS} from './p40-course.mjs';
import {P46_GRAMMAR_ROWS} from './p46-grammar.mjs';
import {P47_GRAMMAR_ROWS} from './p47-grammar.mjs';
import {P50_GRAMMAR_ROWS} from './p50-grammar.mjs';
import {P51_GRAMMAR_ROWS} from './p51-grammar.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {evaluateAnswer} from './exercises.mjs';

const groups=['Foundations','Questions','Nouns & classifiers','Time & location','Actions & aspect','Connections & comparisons'];
const chapters=Object.freeze(groups.map((name,i)=>Object.freeze({id:'chapter-'+(i+1),name,number:i+1})));
const lessonByChar=new Map(DEMO_LESSONS.map(lesson=>[lesson.hanzi,lesson.id]));
function example(data){return Object.freeze({hanzi:data[0],pinyin:data[1],english:data[2]});}
export const GRAMMAR_LESSONS=Object.freeze([...GRAMMAR_ROWS_A,...GRAMMAR_ROWS_B,...P32_GRAMMAR_ROWS_A,...P32_GRAMMAR_ROWS_B,...P36_GRAMMAR_ROWS,...P40_GRAMMAR_ROWS,...P46_GRAMMAR_ROWS,...P47_GRAMMAR_ROWS,...P50_GRAMMAR_ROWS,...P51_GRAMMAR_ROWS].map((r,index)=>Object.freeze({
 id:r[0],chapter:r[1],chapterNumber:groups.indexOf(r[1])+1,
 order:index+1,title:r[2],pattern:r[3],explanation:r[4],contrast:r[5],
 pitfall:r[6],anchor:r[7],characterLessonId:lessonByChar.get(r[7])||null,
 examples:Object.freeze([example(r[8]),example(r[9])]),
 cloze:Object.freeze({masked:r[10][0],answer:r[10][1],
   options:Object.freeze([r[10][1],r[10][2],r[10][3]]),
   completed:example(r[10].slice(4,7))}),
 transformation:Object.freeze({prompt:r[11][0],model:example(r[11].slice(1,4)),
   chunks:Object.freeze([...r[11][4]])})
})));
export const GRAMMAR_CHAPTERS=Object.freeze(chapters.map(ch=>Object.freeze({...ch,
 lessons:Object.freeze(GRAMMAR_LESSONS.filter(lesson=>lesson.chapter===ch.name).map(l=>l.id))})));
const byId=new Map(GRAMMAR_LESSONS.map(l=>[l.id,l]));
export function findGrammarLesson(id){return byId.get(id)||null;}
/** Resolve an exact canonical source from a grammar deep link.
 * Two- and three-digit IDs belong to the same original 164-lesson course.
 * Reject partial matches so g128 can never silently display g12.
 */
export function grammarIdFromHash(hash){
 const id=/^#\/grammar\/(g\d{2,3})$/.exec(String(hash??''))?.[1];
 return id&&byId.has(id)?id:null;
}
export const GRAMMAR_MODES=Object.freeze(['meaning','cloze','ordering','transformation','production']);
export function grammarWritingTaskId(id,mode){return 'grammar:'+id+':'+mode;}
export const GRAMMAR_PRACTICE_TASKS=Object.freeze(GRAMMAR_LESSONS.flatMap(lesson=>
 GRAMMAR_MODES.map(mode=>Object.freeze({
 id:grammarWritingTaskId(lesson.id,mode),
 grammarId:lesson.id,grammarTitle:lesson.title,kind:'grammar',
 mode,storyId:null,index:lesson.order-1,
 english:mode==='meaning'?lesson.examples[0].english:
   mode==='cloze'?lesson.cloze.completed.english:
   mode==='production'?lesson.examples[1].english:
   mode==='ordering'?lesson.transformation.model.english:lesson.transformation.prompt,
 hanzi:mode==='meaning'?lesson.examples[0].hanzi:
   mode==='cloze'?lesson.cloze.completed.hanzi:
   mode==='production'?lesson.examples[1].hanzi:lesson.transformation.model.hanzi,
 pinyin:mode==='meaning'?lesson.examples[0].pinyin:
   mode==='cloze'?lesson.cloze.completed.pinyin:
   mode==='production'?lesson.examples[1].pinyin:lesson.transformation.model.pinyin
 }))
));
function seededOptions(correct,alternatives,index,{authoredCloze=false}={}){
 // English meaning distractors should not be near-duplicate substrings.
 // Chinese cloze options are different: authored wrong particles/phrases
 // deliberately CONTAIN the short correct target (下午 vs 是下午).
 // Removing those distractors made several original lessons single-answer.
 const choices=[correct,...alternatives.filter(a=>a!==correct&&
  (authoredCloze||(!String(a).includes(correct)&&!String(correct).includes(a))))];
 const unique=[...new Set(choices)].slice(0,4);
 const shift=(index*11+7)%unique.length;
 return [...unique.slice(shift),...unique.slice(0,shift)];
}
export function grammarQuestion(lessonId,mode='meaning'){
 const lesson=findGrammarLesson(lessonId);if(!lesson||!GRAMMAR_MODES.includes(mode))return null;
 if(mode==='meaning'){
  const rivals=GRAMMAR_LESSONS.filter(l=>l.id!==lesson.id).map(l=>l.examples[0].english);
  return {id:'grammar:'+lesson.id+':meaning',mode,kind:'choice',
   prompt:'What does this complete sentence mean?',context:lesson.examples[0].hanzi,
   answer:lesson.examples[0].english,
   options:seededOptions(lesson.examples[0].english,[...rivals.slice((lesson.order*3)%rivals.length),...rivals],lesson.order),
   explanation:lesson.explanation,model:lesson.examples[0],grammar:lesson,taskId:grammarWritingTaskId(lesson.id,mode)};
 }
 if(mode==='cloze'){
  const cloze=lesson.cloze;
  return {id:'grammar:'+lesson.id+':cloze',mode,kind:'choice',
   prompt:'Complete the sentence for the intended meaning.',
   context:cloze.masked,targetMeaning:cloze.completed.english,answer:cloze.answer,
   options:seededOptions(cloze.answer,cloze.options.slice(1),lesson.order,{authoredCloze:true}),
   explanation:lesson.contrast,model:cloze.completed,grammar:lesson,taskId:grammarWritingTaskId(lesson.id,mode)};
 }
 const task=GRAMMAR_PRACTICE_TASKS.find(t=>t.grammarId===lesson.id&&t.mode===mode);
 if(!task)return null;
 return {id:task.id,mode,kind:mode==='ordering'?'ordering':'hanzi',
  prompt:mode==='ordering'?'Reconstruct the Chinese sentence by selecting the word chunks.':
    mode==='transformation'?lesson.transformation.prompt:
    'Write the taught Chinese model sentence from English.',
  context:mode==='production'?lesson.examples[1].english:lesson.transformation.prompt,
  answer:task.hanzi,model:example([task.hanzi,task.pinyin,task.english]),
  chunks:mode==='ordering'?lesson.transformation.chunks:null,taskId:task.id,
  explanation:mode==='transformation'?lesson.contrast:
    'Exact model reconstruction only. Other grammatically valid expressions are not automatically rejected as incorrect Chinese.',
  grammar:lesson};
}
export function gradeGrammarQuestion(q,response){
 if(!q||!GRAMMAR_MODES.includes(q.mode))throw Error('Unknown grammar exercise');
 if(q.kind==='choice'){
  const outcome=evaluateAnswer(response,q.answer,'choice');
  if(q.mode==='cloze'&&!outcome.correct)return {...outcome,
   message:'This choice does not match the intended meaning. Another connector may be grammatical in a different context.'};
  return outcome;
 }
 const normalized=text=>String(text||'').normalize('NFC').replace(/[\s\u3000。，！？.!?,;；、]/gu,'');
 const correct=normalized(response)===normalized(q.answer);
 return {correct,reason:correct?'correct':'exact-form',message:correct?'Model sentence reconstructed.':
  'Your sentence differs from the taught model. Compare word order and particles; valid alternatives may exist.'};
}
export function shuffleGrammarChunks(chunks,index){
 return chunks.map((text,i)=>({text,i})).sort((a,b)=>
 ((Math.imul(a.i+1,index*7+13)>>>0)%97)-((Math.imul(b.i+1,index*7+13)>>>0)%97)||b.i-a.i);
}
export function grammarUnitLinks(id){
 const lesson=findGrammarLesson(id);if(!lesson)return {characters:[],words:[],readings:[],dialogues:[]};
 const exampleText=lesson.examples.map(e=>e.hanzi).join('');
 const candidates=WORDS.filter(w=>w.hanzi.length>=2&&exampleText.includes(w.hanzi)).slice(0,8);
 const readings=STORIES.filter(s=>s.lines.some(line=>line.hanzi.includes(lesson.anchor))).slice(0,3);
 const dialogues=DIALOGUES.filter(d=>d.lines.some(line=>line.hanzi.includes(lesson.anchor))).slice(0,2);
 return {characters:lesson.characterLessonId?[DEMO_LESSONS.find(l=>l.id===lesson.characterLessonId)].filter(Boolean):[],
 words:candidates,readings,dialogues};
}
export function grammarChapterFor(id){const l=findGrammarLesson(id);return l?GRAMMAR_CHAPTERS[l.chapterNumber-1]:null;}
export function nextGrammarLesson(id,step=1){
 const i=GRAMMAR_LESSONS.findIndex(l=>l.id===id);
 return GRAMMAR_LESSONS[(i+step+GRAMMAR_LESSONS.length)%GRAMMAR_LESSONS.length];
}
export function searchGrammar(query='',chapter='all'){
 const q=String(query).toLocaleLowerCase().trim();
 return GRAMMAR_LESSONS.filter(l=>(chapter==='all'||String(l.chapterNumber)===String(chapter))&&(!q||[l.title,l.pattern,l.explanation,l.anchor,...l.examples.flatMap(e=>[e.hanzi,e.pinyin,e.english])].some(v=>v.toLocaleLowerCase().includes(q))));
}
