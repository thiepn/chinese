/** P28 graded-reader actions using existing reading and writing records.
 * Personalization is instructional, never an official HSK designation.
 */
import {STORIES} from './stories.mjs';
import {WORDS} from './lexicon.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';

export const BEGINNER_STORIES=Object.freeze(STORIES.filter(story=>story.beginner));
export const BEGINNER_MODES=Object.freeze([
 ['beginner-detail','Find what happened'],
 ['beginner-reason','Explain why'],
 ['beginner-sequence','Connect the events'],
 ['beginner-writing','Write from reading']
]);
export const BEGINNER_READING_WRITING_TASKS=Object.freeze(BEGINNER_STORIES.map(story=>{
 const w=story.beginner.writing;
 return Object.freeze({id:'beginner-reading:'+story.id+':writing',storyId:story.id,
   kind:'beginner-reading-production',readingId:story.id,
   english:w.english,hanzi:w.hanzi,pinyin:w.pinyin,prompt:w.prompt,
   explanation:w.explanation});
}));
const writingById=new Map(BEGINNER_READING_WRITING_TASKS.map(t=>[t.storyId,t]));
export function beginnerWritingTask(storyId){return writingById.get(storyId)||null;}
export function beginnerQuestion(story,mode){
 if(!story?.beginner)return null;
 if(mode==='beginner-writing'){
  const task=beginnerWritingTask(story.id);
  return {kind:'hanzi',mode,prompt:task.prompt,answer:task.hanzi,model:task,
    task,explanation:task.explanation,evidence:null};
 }
 const q=story.beginner.questions.find(item=>item.mode===mode);if(!q)return null;
 const offset=(story.id.charCodeAt(story.id.length-1)+q.evidence)%q.options.length;
 return {kind:'choice',mode,prompt:q.prompt,answer:q.answer,
   options:[...q.options.slice(offset),...q.options.slice(0,offset)],
   evidence:q.evidence,evidenceLine:story.lines[q.evidence],explanation:q.explanation};
}
export function beginnerStoryLinks(story){
 if(!story?.beginner)return {grammar:[],words:[],characters:[],sentences:[]};
 const full=story.lines.map(line=>line.hanzi).join('');
 const words=WORDS.filter(w=>w.hanzi.length>=2&&full.includes(w.hanzi)).slice(0,9);
 const characters=DEMO_LESSONS.filter(l=>full.includes(l.hanzi)).slice(0,7);
 const grammar=story.beginner.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const sentences=SENTENCE_LIBRARY.filter(item=>item.grammarIds.some(id=>story.beginner.grammarIds.includes(id))&&
 words.some(w=>item.hanzi.includes(w.hanzi))).slice(0,5);
 return {words,characters,grammar,sentences};
}
export function beginnerReadingStats(state){
 const events=state.readingEvents||[];
 const done=new Set(events.filter(e=>e.correct&&!e.assisted&&BEGINNER_STORIES.some(s=>s.id===e.storyId)).map(e=>e.storyId));
 const started=new Set(events.filter(e=>BEGINNER_STORIES.some(s=>s.id===e.storyId)).map(e=>e.storyId));
 const writes=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('beginner-reading:'));
 return {attempted:started.size,correctIndependent:done.size,written:writes.length,saved:BEGINNER_STORIES.filter(s=>(state.bookmarkedStories||[]).includes(s.id)).length};
}
export function nextBeginnerStory(storyId,state,level='all'){
 const candidates=BEGINNER_STORIES.filter(s=>level==='all'||String(s.beginner.level)===String(level));
 if(!candidates.length)return null;
 const tried=new Set((state.readingEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 const i=candidates.findIndex(s=>s.id===storyId);
 const after=i<0?candidates:[...candidates.slice(i+1),...candidates.slice(0,i+1)];
 return after.find(s=>!tried.has(s.id))||after[0]||candidates[0];
}
