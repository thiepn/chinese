/** Conservative literal written-word suggestions. NOT sentence segmentation or lexical-sense verification. */
import {WORDS} from './lexicon.mjs';
import {findDialogue} from './dialogues.mjs';
import {findStory} from './stories.mjs';
export function writtenWordMatches(lines,{limit=9}={}){
 const text=lines.map(l=>l.hanzi||'').join('\n');
 return WORDS.filter(w=>Array.from(w.hanzi).length>=2&&text.includes(w.hanzi))
  .sort((a,b)=>Array.from(b.hanzi).length-Array.from(a.hanzi).length||a.hanzi.localeCompare(b.hanzi,'zh')).slice(0,limit);
}
export function dialogueWordLinks(id){const d=findDialogue(id);return d?writtenWordMatches(d.lines):[];}
export function storyWordLinks(id){const s=findStory(id);return s?writtenWordMatches(s.lines):[];}
