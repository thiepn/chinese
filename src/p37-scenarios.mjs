/** P37 original HSK 2-targeted practical conversation catalogue.
 * Stable authorial IDs. No official HSK 3.0 claims, published source corpus,
 * live reservations/schedules, medical decisions, or credential collection.
 */
import {P37_SCENES_A} from './p37-scenes-a.mjs';
import {P37_SCENES_B} from './p37-scenes-b.mjs';
import {P37_SCENES_C} from './p37-scenes-c.mjs';
import {P37_SCENES_D} from './p37-scenes-d.mjs';
const rows=[...P37_SCENES_A,...P37_SCENES_B,...P37_SCENES_C,...P37_SCENES_D];
// Explicit evidence line for question 1 in each independently authored dialogue.
const evidence=[5,2,4,2,6,3,2,2,5,2,6,2,6,4,1,5,3,3,5,4,2,2,3,4,2,6,4,3,5,3];
export const P37_SCENES=Object.freeze(rows.map((s,i)=>Object.freeze({
 ...s,id:'p37-'+String(i+1).padStart(2,'0'),sequence:i+1,evidenceIndex:evidence[i],
 turns:Object.freeze(s.turns.map(([hanzi,pinyin,english],j)=>Object.freeze([
  j%2===0?'A':'B',hanzi,pinyin,english
 ]))),
 vocabulary:Object.freeze(s.vocab.map(([hanzi,pinyin,english])=>Object.freeze({
  hanzi,pinyin,english,examples:Object.freeze(s.turns.filter(t=>t[0].includes(hanzi)).slice(0,2).map(t=>Object.freeze({
   hanzi:t[0],pinyin:t[1],english:t[2]
  })))
 }))),
 questions:Object.freeze(s.questions.map(q=>Object.freeze([...q]))),
 alternatives:Object.freeze(s.alternatives.map(([hanzi,pinyin,english,use,replyHanzi,replyPinyin,replyEnglish])=>Object.freeze({
  hanzi,pinyin,english,use,reply:Object.freeze({hanzi:replyHanzi,pinyin:replyPinyin,english:replyEnglish})
 }))),
 oral:'Respond in Mandarin to the situation: '+s.goal+'. First repeat the model without looking, then give a personal response.',
 source:'original-p37-authorial',officialHskLevel:null
})));
export const findP37Scene=id=>P37_SCENES.find(s=>s.id===id)||null;
export const P37_THEMES=Object.freeze([...new Set(P37_SCENES.map(s=>s.theme))]);
export const P37_WRITING_TASKS=Object.freeze(P37_SCENES.flatMap(s=>[1,4,7].map(index=>{
 const line=s.turns[index];return Object.freeze({
  id:'p37:'+s.id+':turn'+index,kind:'p37-practical-conversation-production',
  p37ScenarioId:s.id,p37Turn:index,english:line[3],hanzi:line[1],pinyin:line[2],
  explanation:s.teaching,misconception:s.pitfall,scenarioTitle:s.title
 });
})));
