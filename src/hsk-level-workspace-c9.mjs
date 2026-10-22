/** Pure HSK-target workspace projections over original source and learner evidence.
 * This does not assert official HSK membership, award levels, or write progress.
 */
import {cardsForLesson,dueCards} from './study.mjs';
import {lessonGroups} from './study-groups.mjs';

const safeEvents=(state,key)=>Array.isArray(state[key])?state[key]:[];
const lastById=(events,key)=>{const index=new Map();for(const event of events)index.set(event[key],event);return index;};
const readingStatus=(event)=>!event?'New':event.correct&&!event.assisted?'Independent answer':event.assisted?'Assisted — retry':'Needs retry';
export function levelWorkspaceEvidence(state,{lessons=[],grammar=[],readings=[],dialogues=[],missions=[]},now=Date.now()){
 const introduced=new Set(state.learned||[]),lessonIds=new Set(lessons.map(l=>l.id));
 const due=dueCards(state,now).filter(id=>lessonIds.has(id.split(':')[0]));
 const reviewEvents=safeEvents(state,'events').filter(e=>lessonIds.has(e.cardId.split(':')[0]));
 const sentenceEvents=safeEvents(state,'sentenceEvents');
 const grammarIds=new Set(grammar.map(g=>g.id));
 const missionIds=new Set(missions.map(m=>m.id));
 const grammarEvidence=sentenceEvents.filter(e=>{const parts=e.taskId.split(':');return parts[0]==='grammar'&&grammarIds.has(parts[1])});
 const missionEvidence=sentenceEvents.filter(e=>{const parts=e.taskId.split(':');return parts[0]==='pathway'&&missionIds.has(parts[1])});
 const readingIds=new Set(readings.map(x=>x.id)),dialogueIds=new Set(dialogues.map(x=>x.id));
 const readingEvents=safeEvents(state,'readingEvents').filter(e=>readingIds.has(e.storyId));
 const dialogueEvents=safeEvents(state,'dialogueEvents').filter(e=>dialogueIds.has(e.dialogueId));
 const totalCards=lessons.filter(l=>introduced.has(l.id)).reduce((n,l)=>n+cardsForLesson(l.id).length,0);
 const units=lessonGroups().filter(g=>g.lessons.some(l=>lessonIds.has(l.id))).map(g=>{
  const groupLessons=g.lessons.filter(l=>lessonIds.has(l.id));
  return Object.freeze({index:g.index,name:g.name,lessons:groupLessons,
   introduced:groupLessons.filter(l=>introduced.has(l.id)).length,
   next:groupLessons.find(l=>!introduced.has(l.id))||groupLessons[0]});
 });
 const latestReading=lastById(readingEvents,'storyId'),latestDialogue=lastById(dialogueEvents,'dialogueId');
 const sourceRows=[
  ...readings.map(s=>({id:s.id,type:'reading',title:s.title,action:'c9-media-open-story',event:latestReading.get(s.id)})),
  ...dialogues.map(d=>({id:d.id,type:'dialogue',title:d.title,action:'c9-media-open-dialogue',event:latestDialogue.get(d.id)}))
 ];
 const retry=sourceRows.filter(x=>x.event&&(!x.event.correct||x.event.assisted));
 const incorrectGrammar=grammarEvidence.filter(e=>!e.correct||e.assisted);
 const recentCandidates=[
  ...reviewEvents.map(e=>({at:e.at,id:e.cardId.split(':')[0],action:'c9-lesson-open',type:'lesson'})),
  ...safeEvents(state,'introductions').filter(e=>lessonIds.has(e.id)).map(e=>({at:e.at,id:e.id,action:'c9-lesson-open',type:'lesson'})),
  ...readingEvents.map(e=>({at:e.at,id:e.storyId,action:'c9-media-open-story',type:'reading'})),
  ...dialogueEvents.map(e=>({at:e.at,id:e.dialogueId,action:'c9-media-open-dialogue',type:'dialogue'})),
  ...grammarEvidence.map(e=>({at:e.at,id:e.taskId.split(':')[1],action:'grammar-select',type:'grammar'})),
  ...missionEvidence.map(e=>({at:e.at,id:e.taskId.split(':')[1],action:'pathway-select',type:'mission'}))
 ].filter(x=>Number.isFinite(x.at)).sort((a,b)=>b.at-a.at);
 const newest=recentCandidates[0];
 const unintroduced=lessons.find(l=>!introduced.has(l.id));
 const continuation=newest||(
  unintroduced?{id:unintroduced.id,action:'c9-lesson-open',type:'lesson',at:null}:
  grammar[0]?{id:grammar[0].id,action:'grammar-select',type:'grammar',at:null}:
  readings[0]?{id:readings[0].id,action:'c9-media-open-story',type:'reading',at:null}:
  dialogues[0]?{id:dialogues[0].id,action:'c9-media-open-dialogue',type:'dialogue',at:null}:
  missions[0]?{id:missions[0].id,action:'pathway-select',type:'mission',at:null}:null);
 return Object.freeze({
  introduced:lessons.filter(l=>introduced.has(l.id)).length,total:lessons.length,
  due:due.length,dueIds:due,scheduledCards:totalCards,reviewAttempts:reviewEvents.length,
  independentReview:reviewEvents.filter(e=>e.correct===true&&!e.assisted).length,
  readingAttempts:readingEvents.length,dialogueAttempts:dialogueEvents.length,
  grammarAttempts:grammarEvidence.length,missionAttempts:missionEvidence.length,
  independentReadings:new Set(readingEvents.filter(e=>e.correct&&!e.assisted).map(e=>e.storyId)).size,
  independentDialogues:new Set(dialogueEvents.filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId)).size,
  independentGrammar:new Set(grammarEvidence.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId.split(':')[1])).size,
  independentMissions:new Set(missionEvidence.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId.split(':')[1])).size,
  units,retrySources:retry,incorrectGrammar,sourceRows,continuation
 });
}
export function renderLevelEvidencePanel(evidence,act,esc){
 const stat=(n,label)=>'<div><strong>'+n+'</strong><span>'+label+'</span></div>';
 const source=(item,label)=>act(item.action,label,'c9-button c9-button--primary','data-id="'+esc(item.id)+'"');
 return '<section class="c9-level-overview" aria-label="Your original learning evidence">'+
  '<div class="c9-level-metrics">'+
  stat(evidence.introduced+' / '+evidence.total,'Lessons introduced')+
  stat(evidence.due,'Review cards due')+
  stat(evidence.independentGrammar,'Grammar sources answered independently')+
  stat(evidence.independentReadings+' / '+evidence.independentDialogues,'Readings / dialogues independently answered')+'</div>'+
  (evidence.continuation?'<div class="c9-level-continuation"><strong>Continue</strong>'+
   source(evidence.continuation,'Resume '+evidence.continuation.type)+'</div>':'')+
  '</section>';
}
export function renderLevelUnits(evidence,act,esc){
 return evidence.units.length?'<section class="c9-level-chapters" aria-labelledby="c9-level-chapters-title">'+
  '<h3 id="c9-level-chapters-title">Original lesson units</h3>'+
  '<div class="c9-level-chapter-grid">'+evidence.units.map(unit=>
    '<article class="c9-level-chapter"><strong>'+String(unit.index).padStart(2,'0')+' · '+esc(unit.name)+'</strong>'+
    '<span>'+unit.introduced+' / '+unit.lessons.length+' introduced</span>'+
    act('c9-level-unit','Open '+unit.lessons.length+' lessons','c9-button c9-button--secondary c9-button--small','data-unit="'+unit.index+'"')+
    act('c9-lesson-open','Continue '+esc(unit.next.hanzi),'c9-button c9-button--quiet c9-button--small','data-id="'+esc(unit.next.id)+'"')+
    '</article>').join('')+'</div></section>':'';
}
export function renderLevelReview(evidence,act,esc){
 const items=evidence.retrySources.slice(0,5);
 return '<section class="c9-level-review-panel" aria-labelledby="c9-level-review-title"><h3 id="c9-level-review-title">Scheduled recall</h3>'+
 '<p>'+evidence.due+' cards due from '+evidence.scheduledCards+' introduced recall cards. Only native Review grades change the schedule.</p>'+
 (evidence.due?act('c9-level-review-start','Start '+Math.min(evidence.due,50)+' due cards','c9-button c9-button--primary')+
 '<a href="#/review" class="c9-button c9-button--secondary">All review</a>':
 '<a href="#/review" class="c9-button c9-button--secondary">All scheduled review</a>')+
 (items.length?'<h3>Reading and dialogue retries</h3><div class="c9-level-retry-list">'+items.map(row=>
   act(row.action,esc(row.title)+' · '+readingStatus(row.event),'c9-level-source','data-id="'+esc(row.id)+'"')).join('')+'</div>':'')+
 '</section>';
}
