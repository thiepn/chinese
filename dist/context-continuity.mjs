/** Batch 19: original-demo content links based on actual shared words or characters.
 * Search/read only; can never introduce, grade or claim a curriculum mapping.
 */
import {findLesson} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
const maxCount=(n)=>Number.isInteger(n)&&n>0&&n<=25?n:4;
const textLines=x=>(x.lines||x.turns||[]).map(l=>String(l.hanzi||''));
export function contentConnections(lessonId,{limit=4}={}){
 const lesson=findLesson(lessonId);if(!lesson)return {words:[],stories:[],dialogues:[],lesson:null};
 const needles=new Set(lesson.words.map(w=>w.hanzi));
 const references=items=>items.map(item=>{
  const lines=textLines(item);const matches=[...needles].filter(w=>lines.some(line=>line.includes(w)));
  return {id:item.id,title:item.title||item.name||'Original demo',matches,matched:matches.length};
 }).filter(x=>x.matched>0).sort((a,b)=>b.matched-a.matched||a.id.localeCompare(b.id)).slice(0,maxCount(limit));
 return {lesson,words:WORDS.filter(w=>needles.has(w.hanzi)).map(w=>({key:w.key,hanzi:w.hanzi,pinyin:w.pinyin,english:w.senses[0]||''})),stories:references(STORIES),dialogues:references(DIALOGUES)};
}
export function nextInCollection(items,id){
 const current=items.findIndex(x=>x.id===id);
 if(!items.length)return null;
 return items[(current>=0?current+1:0)%items.length];
}
