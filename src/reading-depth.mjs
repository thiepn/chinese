/** P27 reading depth in the existing reading and Sentence Workshop systems.
 * Source-specific questions point to the original evidence sentence. No new
 * spaced-review authority and no assertion of official HSK membership.
 */
import {STORIES} from './stories.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
export const DEEP_READING_MODES=Object.freeze([
 ['passage-detail','Read for facts'],
 ['passage-inference','Infer carefully'],
 ['passage-sequence','Follow the order'],
 ['passage-cause','Explain why'],
 ['passage-vocabulary','Meaning in context'],
 ['passage-writing','Reading → writing']
]);
export const READING_WRITING_TASKS=Object.freeze(STORIES.filter(s=>s.extended).map(s=>{
 const w=s.extended.writing;
 return Object.freeze({id:'reading:'+s.id+':writing',kind:'reading-production',storyId:s.id,
  readingId:s.id,english:w.english,hanzi:w.hanzi,pinyin:w.pinyin,
  prompt:w.prompt,explanation:w.explanation});
}));
const byTask=new Map(READING_WRITING_TASKS.map(t=>[t.id,t]));
export const findReadingWritingTask=id=>byTask.get(id)||null;
export function deepReadingQuestion(story,mode){
 if(!story?.extended)return null;
 if(mode==='passage-writing'){
  const t=findReadingWritingTask('reading:'+story.id+':writing');
  return t?{kind:'hanzi',mode,prompt:t.prompt,answer:t.hanzi,model:t,
   task:t,explanation:t.explanation,evidence:null}:null;
 }
 const key=mode.replace('passage-','');
 const q=story.extended.questions.find(q=>q.mode===key);
 if(!q)return null;
 const seed=story.id.length+q.evidence*7;
 const shift=seed%q.options.length;
 return {kind:'choice',mode,prompt:q.prompt,answer:q.answer,
  options:[...q.options.slice(shift),...q.options.slice(0,shift)],
  evidence:q.evidence,explanation:q.explanation,
  evidenceLine:story.lines[q.evidence]||null};
}
export function paragraphFor(story,i){
 const p=story?.extended?.paragraphs;
 return p?p.findIndex(x=>i>=x.start&&i<=x.end):-1;
}
export function readingLinks(story){
 if(!story?.extended)return {grammar:[],words:[],sentences:[]};
 const full=story.lines.map(l=>l.hanzi).join('');
 const words=WORDS.filter(w=>w.hanzi.length>=2&&full.includes(w.hanzi)).sort((a,b)=>b.hanzi.length-a.hanzi.length).slice(0,9);
 const grammar=story.extended.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const sentences=SENTENCE_LIBRARY.filter(s=>
   s.grammarIds.some(id=>story.extended.grammarIds.includes(id)) &&
   words.some(w=>s.hanzi.includes(w.hanzi))).slice(0,5);
 return {words,grammar,sentences};
}
export function readingDepthOverview(story){
 if(!story?.extended)return null;
 return {paragraphs:story.extended.paragraphs.length,lines:story.lines.length,
  questions:story.extended.questions.length,writingTasks:1,
  type:story.extended.type,difficulty:story.extended.difficulty};
}
