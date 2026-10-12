/** Independently generated exercises from locally authored demo readings, not officially reviewed. */
import {STORIES,findStory} from './stories.mjs';
export const SENTENCE_MODES=Object.freeze(['line-meaning','line-order']);
export function sentenceAssessment(storyId,mode){const story=findStory(storyId);
 if(!story||!SENTENCE_MODES.includes(mode))return null;
 if(mode==='line-order'){
  const chunks=story.lines.map(line=>line.hanzi);
  return {mode,kind:'ordering',prompt:'Rebuild the short passage in its original narrative order.',chunks,
   answer:chunks.join(''),explanation:'Compare the timeline and connections between sentences in the passage.'};
 }
 const index=STORIES.findIndex(s=>s.id===storyId),target=story.lines[index%story.lines.length];
 const choices=[target.english];
 for(const other of STORIES){if(other.id===storyId)continue;for(const line of other.lines){if(!choices.includes(line.english)){choices.push(line.english);break;}}
 if(choices.length===4)break;}
 const shift=index%choices.length;
 return {mode,kind:'choice',prompt:'Which interpretation matches the Chinese sentence?',hanzi:target.hanzi,
  answer:target.english,options:[...choices.slice(shift),...choices.slice(0,shift)],
  explanation:`${target.hanzi} — ${target.english}`};
}
export function validateSentenceAssessments(){for(const s of STORIES)for(const mode of SENTENCE_MODES){const q=sentenceAssessment(s.id,mode);
 if(!q||!q.answer||mode==='line-meaning'&&(q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))||
 mode==='line-order'&&(q.chunks.length!==3||q.chunks.join('')!==q.answer))throw Error('Invalid sentence exercise');
 }return true;}
