/** Everyday reply production: "your turn" tasks drawn from the authored
 * Everyday Mandarin dialogues. The learner writes the next line in Chinese;
 * the workshop's composition feedback compares against the authored reply
 * without ever auto-approving free composition. Prompt and model are existing
 * authored content — nothing new is invented here.
 */
import {EVERYDAY_DIALOGUES} from './everyday-dialogues-a.mjs';
import {EVERYDAY_DIALOGUES_B} from './everyday-dialogues-b.mjs';
const packs=[...EVERYDAY_DIALOGUES,...EVERYDAY_DIALOGUES_B];
const tasks=[];
for(const d of packs){
 let taken=0;
 for(const i of [1,3,5]){
  if(taken>=2)break;
  const prompt=d.turns[i-1],line=d.turns[i];
  if(!prompt||!line||[...line.hanzi].length>26)continue;
  taken++;
  tasks.push(Object.freeze({
   id:'everyday-reply:'+String(tasks.length+1).padStart(2,'0'),
   storyId:null,index:packs.indexOf(d),kind:'reply',
   english:'Your turn \u2014 '+prompt.speaker+' says: \u201c'+prompt.english+'\u201d. Write '+line.speaker+'\u2019s reply in Chinese.',
   hanzi:line.hanzi,pinyin:line.pinyin
  }));
 }
}
export const EVERYDAY_REPLY_TASKS=Object.freeze(tasks);
