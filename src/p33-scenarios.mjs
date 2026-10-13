/** P33 authored beginner communication curriculum, not official HSK 3.0 data.
 * Keep scenario IDs stable independently of existing P27 dialogue IDs.
 * These are practical learning examples, not live business/health/transport claims.
 */
import {P33_SCENARIOS_A} from './p33-scenarios-a.mjs';
import {P33_SCENARIOS_B} from './p33-scenarios-b.mjs';
import {P33_SCENARIOS_C} from './p33-scenarios-c.mjs';
import {P33_SCENARIOS_D} from './p33-scenarios-d.mjs';
import {P33_SCENARIOS_E} from './p33-scenarios-e.mjs';
export const P33_SCENARIOS=Object.freeze([...P33_SCENARIOS_A,...P33_SCENARIOS_B,...P33_SCENARIOS_C,...P33_SCENARIOS_D,...P33_SCENARIOS_E].map((row,i)=>Object.freeze({
 ...row,id:'p33-'+String(i+1).padStart(2,'0'),sequence:i+1,
 turns:Object.freeze(row.turns.map(turn=>Object.freeze([...turn]))),
 vocabulary:Object.freeze(row.vocab.map(word=>Object.freeze({hanzi:word[0],pinyin:word[1],english:word[2],
 examples:Object.freeze(row.turns.filter(t=>t[1].includes(word[0])).slice(0,2).map(t=>Object.freeze({hanzi:t[1],pinyin:t[2],english:t[3]})))}))),
 questions:Object.freeze(row.questions.map(q=>Object.freeze([...q]))),
 alternatives:Object.freeze(row.choices.map(choice=>Object.freeze({
 hanzi:choice[0],pinyin:choice[1],english:choice[2],use:choice[3]
 })))
})));
export const findP33Scenario=id=>P33_SCENARIOS.find(s=>s.id===id)||null;
export const P33_THEMES=Object.freeze([...new Set(P33_SCENARIOS.map(s=>s.theme))]);
export const P33_WRITING_TASKS=Object.freeze(P33_SCENARIOS.flatMap(s=>[1,4,7].map((index,step)=>{
 const line=s.turns[index];
 return Object.freeze({id:'p33:'+s.id+':turn'+index,kind:'p33-dialogue-production',p33ScenarioId:s.id,
  p33Turn:index,english:line[3],hanzi:line[1],pinyin:line[2],
  explanation:s.teaching,scenarioTitle:s.title,index:step});
})));
