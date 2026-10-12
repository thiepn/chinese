/** Evidence-qualified connections derived only from the original demo teaching examples. */
import {findLesson,DEMO_LESSONS} from './demo-lessons.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
export function crossLessonConnections(lessonIds){
 const lessons=[...new Set(lessonIds)].map(findLesson).filter(Boolean),words=lessons.flatMap(lesson=>lesson.words.map(w=>({...w,lessonId:lesson.id})));
 const shared=[];for(let i=0;i<words.length;i++)for(let j=i+1;j<words.length;j++){
  const a=words[i],b=words[j];if(a.lessonId===b.lessonId)continue;
  if(a.hanzi===b.hanzi){shared.push({type:'same-word',a,b,note:'This complete written word appears in more than one lesson. Check the complete-word readings and meanings in their own contexts.'});continue;}
  const common=[...new Set(Array.from(a.hanzi))].filter(c=>b.hanzi.includes(c));if(common.length)shared.push({type:'shared-character',shared:common,a,b,note:'These complete words share a written character. Do not infer a pronunciation or sense from the character alone.'});
 }
 const relatedStory=STORIES.map(story=>({id:story.id,title:story.title,hits:words.filter(w=>story.lines.some(line=>line.hanzi.includes(w.hanzi))).length})).filter(x=>x.hits>0).sort((a,b)=>b.hits-a.hits).slice(0,4);
 const relatedDialogues=DIALOGUES.map(d=>({id:d.id,title:d.title,hits:words.filter(w=>d.lines.some(line=>line.hanzi.includes(w.hanzi))).length})).filter(x=>x.hits>0).sort((a,b)=>b.hits-a.hits).slice(0,3);
 return {words,shared:shared.slice(0,6),readings:relatedStory,dialogues:relatedDialogues,notice:'Connections are literal written-form overlaps, not reviewed proof of the same lexical sense, pronunciation, or grammatical function.'};
}
