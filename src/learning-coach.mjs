/** Observable practice evidence and explainable remediation. No predicted learning probabilities. */
import {findLesson} from './demo-lessons.mjs';
import {cardInfo,DAY} from './study.mjs';
const SKILLS=[
 {id:'meaning',label:'Character and word meanings',mode:'word-meaning'},
 {id:'pronunciation',label:'Pronunciation and tones',mode:'word-pinyin'},
 {id:'sentence',label:'Sentence and context',mode:'sentence-cloze'}
];
function cardSkill(info){return info?.kind==='pinyin'?'pronunciation':info?.kind==='choice'?'sentence':'meaning';}
function drillSkill(mode){return mode==='word-pinyin'||mode==='reading-choice'?'pronunciation':mode==='sentence-cloze'?'sentence':'meaning';}
export function remediationPlan(state,{now=Date.now(),limit=4}={}){
 const entries=new Map();function fail(id,skill,at,context){if(!findLesson(id))return;
 const key=id+':'+skill,old=entries.get(key)||{lessonId:id,skill,misses:0,lastAt:0,source:context};old.misses++;old.lastAt=Math.max(old.lastAt,at||0);entries.set(key,old);}
 for(const e of (state.events||[]).slice(-600))if(e.correct===false||e.grade===0){const info=cardInfo(e.cardId);if(info)fail(info.lesson.id,cardSkill(info),e.at,'Review');}
 for(const e of (state.drillEvents||[]).slice(-600))if(e.correct===false)fail(e.lessonId,drillSkill(e.mode),e.at,'Practice');
 const focus=[...entries.values()].map(item=>{const skill=SKILLS.find(s=>s.id===item.skill);return {...item,label:skill.label,mode:skill.mode,score:item.misses*5+(now-item.lastAt<=7*DAY?5:0)};});
 return focus.sort((a,b)=>b.score-a.score||b.lastAt-a.lastAt||a.lessonId.localeCompare(b.lessonId)).slice(0,limit);
}
export function skillDiagnostics(state){return SKILLS.map(skill=>{
  const review=(state.events||[]).filter(e=>{const info=cardInfo(e.cardId);return info&&cardSkill(info)===skill.id});
  const practice=(state.drillEvents||[]).filter(e=>drillSkill(e.mode)===skill.id);
  return {...skill,reviewAttempts:review.length,independentCorrect:review.filter(e=>e.correct===true&&!e.assisted).length,
    reviewedErrors:review.filter(e=>e.correct===false||e.grade===0).length,practiceAttempts:practice.length,
    practiceErrors:practice.filter(e=>!e.correct).length};
 });}
export function weeklyEvidence(state,now=Date.now()){
 const start=now-7*DAY,previous=now-14*DAY;
 const all=[...(state.events||[]).map(e=>({...e,kind:'scheduled'})),
 ...(state.drillEvents||[]).map(e=>({...e,kind:'drill'})),
 ...(state.readingEvents||[]).map(e=>({...e,kind:'reading'}))];
 const count=(from,to)=>{const entries=all.filter(e=>e.at>=from&&e.at<to);return {
  attempts:entries.length,independentCorrect:entries.filter(e=>e.correct===true&&!e.assisted).length,
  assisted:entries.filter(e=>e.assisted).length,scheduled:entries.filter(e=>e.kind==='scheduled').length,
  practice:entries.filter(e=>e.kind!=='scheduled').length};};
 return {current:count(start,now+1),previous:count(previous,start)};
}
