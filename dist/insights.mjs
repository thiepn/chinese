/** Descriptive evidence and transparent review-priority heuristics; never certified mastery probabilities. */
import {cardInfo,dueCards,DAY} from './study.mjs';
export function cardEvidence(state,id){const attempts=state.events.filter(e=>e.cardId===id).sort((a,b)=>a.at-b.at);const last=attempts.at(-1);const failures=attempts.filter(e=>e.grade===0||e.correct===false).length;const independent=attempts.filter(e=>e.correct===true&&!e.assisted).length;return {attempts:attempts.length,failures,independent,last,needsPractice:!!last&&(last.grade===0||last.correct===false||last.assisted===true)};}
export function prioritizedDue(state,now=Date.now(),mode='all'){
 const ids=dueCards(state,now);if(mode==='all')return ids;
 const ranked=ids.map((id,index)=>{const c=state.cards[id],e=cardEvidence(state,id);const overdue=Math.min(14,Math.max(0,(now-c.due)/DAY));const priority=(e.needsPractice?50:0)+Math.min(20,e.failures*5)+Math.min(10,overdue)+(!e.attempts?8:0);return {id,index,priority};});
 return ranked.sort((a,b)=>b.priority-a.priority||a.index-b.index).map(x=>x.id);
}
export function learningAnalytics(state,now=Date.now()){
 const bins=[];for(let i=13;i>=0;i--){const day=new Date(now-i*DAY);const key=day.toISOString().slice(0,10);bins.push({day:key,attempts:0,correct:0,assisted:0});}
 const byDay=new Map(bins.map(x=>[x.day,x]));
 for(const ev of state.events){const bin=byDay.get(new Date(ev.at).toISOString().slice(0,10));if(!bin)continue;bin.attempts++;if(ev.correct&&!ev.assisted)bin.correct++;if(ev.assisted)bin.assisted++;}
 const types=[['Character meaning',['meaning']],['Character reading',['reading']],['Word meaning',['word0','word1','word2']],['Word pronunciation',['wordread0','wordread1','wordread2']],['Sentence comprehension',['sentence']]];
 const skills=types.map(([name,suffixes])=>{const events=state.events.filter(e=>suffixes.some(s=>e.cardId.endsWith(':'+s)));const tested=new Set(events.map(e=>e.cardId)).size;return {name,attempts:events.length,tested,independent:events.filter(e=>e.correct&&!e.assisted).length,errors:events.filter(e=>e.correct===false).length};});
 const struggling=Object.keys(state.cards).map(id=>({id,...cardEvidence(state,id),info:cardInfo(id)})).filter(x=>x.info&&x.failures>0).sort((a,b)=>b.failures-a.failures||Number(b.needsPractice)-Number(a.needsPractice)).slice(0,8);
 return {bins,skills,struggling,attempts14:bins.reduce((s,d)=>s+d.attempts,0),correct14:bins.reduce((s,d)=>s+d.correct,0)};
}
