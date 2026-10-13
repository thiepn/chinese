/**
 * Concept 9 / C9-10: native-authority Progress, Find, Settings and
 * secondary learning tool presentation. Pure projections of local state,
 * no new stores, scores, search engines, grading or network requests.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {summary,dueCards,lessonGroups,cardInfo} from './study.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {WORDS} from './lexicon.mjs';
import {COURSE_INDEX,FIND_CATEGORIES,courseSearch} from './workspace-p30.mjs';
import {PINYIN_INITIALS,PINYIN_FINALS} from './pinyin-foundations.mjs';
import {SENSE_CASES} from './sense-lab.mjs';
import {SENTENCE_TASKS} from './sentence-workshop.mjs';
import {LADDER_STAGES} from './sentence-ladder.mjs';
import {FLUENCY_BANK} from './fluency-studio.mjs';

const n=(x)=>Number.isFinite(x)?Math.max(0,x):0;
const count=(x,label)=>x+' '+label+(x===1?'':'s');
const intro=(eyebrow,title,desc)=>'<header class="c9-utility-heading"><p class="c9-eyebrow">'+eyebrow+'</p><h1>'+title+'</h1><p>'+desc+'</p></header>';
const metric=(num,label,detail='')=>'<div class="c9-utility-metric"><strong>'+num+'</strong><span>'+label+'</span>'+
 (detail?'<small>'+detail+'</small>':'')+'</div>';
const progress=(done,total,label)=>'<div class="c9-utility-progress"><div><span>'+label+'</span><strong>'+done+' / '+total+'</strong></div>'+
 '<div class="c9-progress" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+(total?Math.min(100,Math.round(done/total*100)):0)+'%"></span></div></div>';
const localLink=(route,label,extra='')=>'<a href="#/'+route+'" class="c9-button c9-button--secondary '+extra+'">'+label+'</a>';
const evidence=(title,caption,amount,route,label)=>'<article class="c9-progress-evidence"><span class="c9-eyebrow">'+title+'</span><strong>'+amount+'</strong><p>'+caption+'</p>'+localLink(route,label,'c9-button--small')+'</article>';
const saved=(state,field)=>Array.isArray(state[field])?state[field].length:0;
const groupIntroduced=(state,unit)=>unit.lessons.filter(lesson=>(state.learned||[]).includes(lesson.id)).length;
function last14(state){
 const now=Date.now(),start=now-14*86400000;
 const rows=(state.events||[]).filter(e=>Number.isFinite(e.at)&&e.at>=start&&e.at<=now);
 return {attempts:rows.length,independent:rows.filter(e=>e.correct&&!e.assisted).length};
}
function evidenceNotice(){
 return '<p class="c9-utility-truth c9-unified-source-note">All values show saved learning observations, not a diagnostic proficiency percentage, calibrated mastery prediction or official HSK certification.</p>';
}
export function renderC9ProgressOverview(state,act,esc){
 const m=summary(state),due=dueCards(state),groups=lessonGroups(),recent=last14(state);
 const readingCorrect=new Set((state.readingEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 const dialogueCorrect=new Set((state.dialogueEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 const sessions=[
  ['Guided practice',state.practiceSession?'Resume existing session':'No saved session','practice'],
  ['Fluency Studio',state.fluencySession?'Resume existing session':'No saved session','fluency'],
  ['Sentence Ladder',state.ladderSession?'Resume existing session':'No saved session','ladder'],
  ['Study Blocks',state.studyBlock?'Resume existing block':'No saved block','block'],
  ['Daily Journey',state.courseJourney?'Resume existing journey':'No saved journey','journey'],
  ['Course repairs',state.courseRepairSession?'Resume existing repair':'No saved repair','journey'],
  ['Vocabulary journey',state.vocabularyJourney?'Resume existing word':'No saved word','wordbook'],
  ['Context trail',state.blockTrail?'Resume existing trail':'No saved trail','block']
 ];
 const savedWork=sessions.filter(row=>row[1].startsWith('Resume'));
 return '<div class="c9-utility-page c9-progress-page">'+
 intro('YOUR LOCAL LEARNING RECORD','Progress without guesswork',
  'See what you actually introduced, attempted and reviewed. These records remain distinct from fluency and official exam levels.')+
 '<div class="c9-utility-metrics">'+metric(m.learned,'Character lessons introduced','of '+m.total+' authored lessons')+
 metric(due.length,'Scheduled prompts due','due according to the native scheduler')+
 metric(m.successful,'Independent correct reviews','original graded answer history')+
 metric(recent.attempts,'Review attempts · last 14 days','including assisted or incorrect attempts')+'</div>'+
 '<section class="c9-utility-panel c9-unified-card"><div class="c9-utility-section-heading"><div><p class="c9-eyebrow">ORIGINAL CURRICULUM</p><h2>Introduced characters by unit</h2></div>'+
 localLink('learn','Learn a character →','c9-button--small')+'</div>'+
 '<p class="c9-utility-description">Opening and exploring lessons is not introduction. Unit counts only change when the original learner writer records a lesson.</p>'+
 '<div class="c9-progress-units">'+groups.map(group=>{
  const introduced=groupIntroduced(state,group);
  return '<div class="c9-progress-unit"><div><strong>'+esc(group.name)+'</strong><small>Unit '+String(group.index).padStart(2,'0')+'</small></div>'+
   progress(introduced,group.lessons.length,'Introduced lessons in '+esc(group.name))+'</div>';
 }).join('')+'</div></section>'+
 '<section class="c9-utility-panel c9-unified-card"><div class="c9-utility-section-heading"><div><p class="c9-eyebrow">DISTINCT TYPES OF EVIDENCE</p><h2>What your activity means</h2></div></div>'+
 '<div class="c9-progress-evidence-grid">'+
 evidence('SCHEDULED REVIEW','Correct without a revealed answer in the original review engine.',m.successful,'review','Review due prompts')+
 evidence('CONNECTED READING','Distinct texts with an independently correct comprehension answer.',readingCorrect.size+' / '+STORIES.length,'stories','Continue reading')+
 evidence('CONVERSATIONS','Distinct dialogues with an independently correct contextual answer.',dialogueCorrect.size+' / '+DIALOGUES.length,'dialogues','Continue listening')+
 evidence('RECENT ACTIVITY','Independently correct scheduled responses in the last 14 days.',recent.independent,'practice','Extra practice')+
 '</div></section>'+
 '<section class="c9-utility-panel c9-unified-card"><div class="c9-utility-section-heading"><div><p class="c9-eyebrow">SAVED CONTINUITY</p><h2>Return to unfinished learning</h2></div></div>'+
 (savedWork.length?'<div class="c9-utility-continuity">'+savedWork.map(([name,_,route])=>
  '<div><span><strong>'+name+'</strong><small>Native checkpoint available in this browser</small></span>'+
  localLink(route,'Resume →','c9-button--small')+'</div>').join('')+'</div>':
 '<div class="c9-utility-empty"><strong>No recoverable learning session is active.</strong><p>You can begin an original lesson or practise due reviews without fabricating a resumed session.</p></div>')+
 '</section>'+renderC9ProgressInsights(state,act,esc)+evidenceNotice()+'</div>';
}
export function renderC9SearchIntro(state,ui,act,esc){
 const families=FIND_CATEGORIES.filter(([id])=>id!=='all').map(([id,label])=>({
  id,label,count:COURSE_INDEX.filter(e=>e.kind===id).length
 }));
 return '<div class="c9-utility-page c9-search-intro">'+
 intro('FIND ORIGINAL MATERIAL','Search your Chinese library',
 'Search original characters, words, grammar, complete sentences, readings, dialogues and pathway missions. Results open the existing source workspace.')+
 '<div class="c9-search-summary"><div><strong>'+COURSE_INDEX.length+'</strong><span>Indexed source entries</span></div>'+
 '<div><strong>'+families.length+'</strong><span>Source categories</span></div>'+
 '<div><strong>'+saved(state,'bookmarkedWords')+saved(state,'bookmarkedStories')+saved(state,'bookmarkedSentences')+'</strong><span>Saved items across word, reading and sentence libraries</span></div></div>'+
 '<section class="c9-utility-panel c9-unified-card c9-search-start"><div class="c9-utility-section-heading"><div><p class="c9-eyebrow">START WITH A COLLECTION</p><h2>Explore by content</h2></div>'+
 act('c9-find-reset','Clear all filters','c9-button c9-button--quiet c9-button--small')+'</div>'+
 '<div class="c9-search-category-grid">'+families.map(row=>
  act('p30-filter','<strong>'+esc(row.label)+'</strong><span>'+row.count+' source entries</span>',
  'c9-search-category'+(ui.kind===row.id?' is-active':''),'data-kind="'+row.id+'" aria-pressed="'+(ui.kind===row.id)+'"')).join('')+
 '</div></section>'+renderC9SearchAssist(state,ui,act,esc)+'<p class="c9-utility-truth c9-unified-source-note">Saved-only search applies only to source types with native saved or introduction records. Other categories may correctly show no results under this filter.</p></div>';
}
const settingsDestinations=Object.freeze([
 ['study','Study preferences','Pinyin, appearance and daily lesson target'],
 ['reading','Reading display','Large Hanzi and comfortable story text'],
 ['recovery','Session recovery','Resumable original learning activities'],
 ['data','Backups and storage','Export, import, status and local data protection'],
 ['curriculum','Source information','What is installed and what is not']
]);
export function renderC9SettingsIntro(state,storageReady,act,esc){
 const countSessions=[
  state.practiceSession,state.courseJourney,state.ladderSession,
  state.studyBlock,state.fluencySession,state.courseRepairSession
 ].filter(Boolean).length;
 return '<div class="c9-utility-page c9-settings-intro">'+
 intro('LEARNER PREFERENCES & LOCAL DATA','Your learning environment',
 'Adjust presentation without changing answers. Review original saved sessions and back up your private progress with the existing export/import controls.')+
 '<div class="c9-settings-context"><div><span class="c9-eyebrow">THIS BROWSER</span><strong>'+
 (storageReady?'Local learner database connected':'Local learner database unavailable')+'</strong>'+
 '<p>'+(storageReady?'Successful native writes are transactional; a backup is still recommended.':
 'Do not assume answers or settings will persist while storage is unavailable.')+'</p></div>'+
 '<div><span class="c9-eyebrow">YOUR RECORD</span><strong>Revision '+esc(state.revision)+'</strong>'+
 '<p>'+countSessions+' recoverable native learning session'+(countSessions===1?'':'s')+' · no cloud account or sync implied.</p></div></div>'+
 '<nav class="c9-settings-nav" aria-label="Settings sections">'+settingsDestinations.map(([id,label,desc])=>
  act('c9-settings-target','<strong>'+esc(label)+'</strong><small>'+esc(desc)+'</small>',
  'c9-settings-nav-item','data-target="c9-settings-'+id+'"')).join('')+'</nav>'+
 '<p class="c9-utility-truth c9-unified-source-note">Import and reset actions remain governed by the original backup preview, acknowledgment and learner-state replacement mechanisms.</p></div>';
}
const TOOLS=Object.freeze([
 {route:'pinyin',name:'Pinyin & tones',description:'Hear contrasts, study initials and finals, then use the original sound-checking exercises.',category:'SOUNDS'},
 {route:'senses',name:'Meaning in context',description:'Compare original polyphonic and word-sense examples before answering.',category:'INTERPRETATION'},
 {route:'workshop',name:'Sentence Workshop',description:'Reconstruct exact authored Mandarin sentences with source-specific feedback.',category:'PRODUCTION'},
 {route:'ladder',name:'Sentence Ladder',description:'Complete four source-connected learning stages in the existing saved session.',category:'PROGRESSION'},
 {route:'block',name:'Study Blocks',description:'Work through multiple original lessons in an existing saved learning block.',category:'PROGRESSION'},
 {route:'fluency',name:'Fluency Studio',description:'Connected source-specific exercises with original persistent answer checkpoints.',category:'PROGRESSION'},
 {route:'journey',name:'Daily Journey',description:'Follow original stages of a character lesson with saved reviewable answers.',category:'PROGRESSION'},
 {route:'plan',name:'Daily Study Plan',description:'Set the original planning preferences and review suggested tasks.',category:'PLANNING'}
]);
const SESSION_STATUS={
 ladder:{key:'ladderSession',resume:'Saved ladder session available'},
 block:{key:'studyBlock',resume:'Saved multi-lesson block available'},
 fluency:{key:'fluencySession',resume:'Saved fluency session available'},
 journey:{key:'courseJourney',resume:'Saved daily learning journey available'}
};
function countLabel(route,state){
 if(route==='pinyin')return PINYIN_INITIALS.length+' initials · '+PINYIN_FINALS.length+' finals';
 if(route==='senses')return count(SENSE_CASES.length,'source meaning contrast');
 if(route==='workshop')return count(SENTENCE_TASKS.length,'authored writing task');
 if(route==='ladder')return count(LADDER_STAGES.length,'original task stage');
 if(route==='fluency')return count(FLUENCY_BANK.length,'original practice prompt');
 if(route==='block')return count(saved(state,'studyBlockEvents'),'saved block event');
 if(route==='journey')return count(saved(state,'courseEvents'),'saved journey event');
 if(route==='plan')return 'Native personal study plan';
 return '';
}
export function renderC9Secondary(route,state,original,act,esc){
 const current=TOOLS.find(tool=>tool.route===route);
 if(!current)return original;
 const active=SESSION_STATUS[route];
 const resume=active&&Boolean(state[active.key]);
 const others=TOOLS.filter(t=>t.route!==route);
 return '<div class="c9-utility-page c9-secondary-workspace">'+
 intro(current.category+' · EXISTING STUDY ENGINE',esc(current.name),esc(current.description))+
 '<div class="c9-secondary-status"><div><span class="c9-eyebrow">SOURCE MATERIAL</span><strong>'+esc(countLabel(route,state))+'</strong></div>'+
 '<div><span class="c9-eyebrow">SESSION STATUS</span><strong>'+
 (resume?active.resume:active?'No active saved session':'Practice on demand')+'</strong>'+
 '<p>All answer checking, hints and grades belong to the original learning workspace.</p></div></div>'+
 '<details class="c9-secondary-directory"><summary>Switch to another learning tool <span>'+others.length+' native destinations</span></summary>'+
 '<nav class="c9-secondary-grid" aria-label="Other original study tools">'+others.map(tool=>
 '<a href="#/'+tool.route+'"><span class="c9-eyebrow">'+tool.category+'</span><strong>'+esc(tool.name)+'</strong>'+
 '<small>'+esc(tool.description)+'</small><span aria-hidden="true">↗</span></a>').join('')+'</nav></details>'+
 renderC9ToolConnections(route,state,act,esc)+'<div id="c9-original-tool" class="c9-secondary-native" tabindex="-1" aria-label="Original '+esc(current.name)+' learning workspace">'+original+'</div>'+
 '<p class="c9-utility-truth c9-unified-source-note">These activities have distinct native practice and continuation records. No HSK mastery or scheduled-review grades are generated by navigation.</p></div>';
}


/** Genuine activity projections, never secondary proficiency/mastery records. */
const DAY_MS=86400000;
const OBSERVATION_FAMILIES=Object.freeze([
 ['review','Scheduled Review','review','events'],
 ['reading','Reading','stories','readingEvents'],
 ['dialogue','Conversation','dialogues','dialogueEvents'],
 ['drill','Standalone drills','practice','drillEvents']
]);
function observationDays(state,days=14,now=Date.now()){
 const today=new Date(now);today.setHours(0,0,0,0);
 const rows=Array.from({length:days},(_,i)=>{
  const day=new Date(today);day.setDate(today.getDate()-(days-1-i));
  return {key:day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate(),
    label:day.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}),
    date:day.getTime(),total:0,independent:0,assisted:0,incorrect:0,byType:Object.fromEntries(OBSERVATION_FAMILIES.map(([id])=>[id,0]))};
 });
 const map=new Map(rows.map(r=>[r.key,r]));
 for(const [kind,_,__,field] of OBSERVATION_FAMILIES){
  for(const e of state[field]||[]){
   if(!Number.isFinite(e?.at))continue;
   const time=new Date(e.at);
   const key=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate(),r=map.get(key);
   if(!r)continue;
   r.total++;r.byType[kind]++;
   if(e.assisted===true)r.assisted++;
   else if(e.correct===true)r.independent++;
   else if(e.correct===false)r.incorrect++;
  }
 }
 return rows;
}
const lastObservedReview=(state)=>{
 const seen=new Set(),records=[];
 for(const ev of [...(state.events||[])].reverse()){
  if(seen.has(ev.cardId))continue;seen.add(ev.cardId);
  const source=cardInfo(ev.cardId);
  if(!source)continue;
  const concern=ev.assisted===true?'Last response used assistance':ev.correct===false?'Last answer was incorrect':ev.grade===0?'Last selected grade was Again':null;
  if(concern)records.push({source,ev,concern});
  if(records.length>=5)break;
 }
 return records;
};
export function renderC9ProgressInsights(state,act,esc){
 const days=observationDays(state),total=days.reduce((v,r)=>v+r.total,0);
 const independent=days.reduce((v,r)=>v+r.independent,0);
 const assisted=days.reduce((v,r)=>v+r.assisted,0);
 const wrong=days.reduce((v,r)=>v+r.incorrect,0);
 const peak=Math.max(1,...days.map(x=>x.total)),repairs=lastObservedReview(state);
 const sums=OBSERVATION_FAMILIES.map(([kind,label,route])=>({
  kind,label,route,total:days.reduce((v,r)=>v+r.byType[kind],0)
 }));
 return '<section class="c9-utility-panel c9-unified-card c9-progress-timebox" aria-labelledby="c9-progress-trend-title">'+
  '<div class="c9-utility-section-heading"><div><p class="c9-eyebrow">RECORDED OBSERVATIONS · LAST 14 LOCAL DAYS</p>'+
   '<h2 id="c9-progress-trend-title">Your study activity, day by day</h2></div>'+
   localLink('plan','Open original study plan →','c9-button--small')+'</div>'+
  '<p class="c9-utility-description">Only persisted scheduled-review, reading, dialogue and standalone-drill answer events appear here. Blank days indicate no recorded attempts in these four categories, not necessarily no study.</p>'+
  '<div class="c9-progress-time-metrics">'+
   metric(total,'Recorded responses')+metric(independent,'Independent correct')+
   metric(assisted,'Assisted responses')+metric(wrong,'Incorrect responses')+'</div>'+
  '<div class="c9-progress-day-bars" role="group" aria-label="Fourteen days of genuine recorded activity">'+
   days.map(r=>'<div class="c9-progress-day" aria-label="'+esc(r.label+': '+r.total+' responses, '+r.independent+' independent correct')+'">'+
    '<span class="c9-progress-day-number">'+r.total+'</span>'+
    '<div class="c9-progress-day-track"><span style="height:'+(r.total?Math.max(5,Math.round(r.total/peak*100)):0)+'%"></span></div>'+
    '<small>'+esc(new Date(r.date).toLocaleDateString(undefined,{weekday:'short'}))+'</small></div>').join('')+
  '</div><div class="c9-progress-day-legend">'+sums.map(r=>
  '<a href="#/'+r.route+'"><strong>'+r.total+'</strong><span>'+r.label+'</span></a>').join('')+'</div>'+
 '</section>'+
 '<section class="c9-utility-panel c9-unified-card c9-progress-repairs" aria-labelledby="c9-progress-repair-title">'+
  '<div class="c9-utility-section-heading"><div><p class="c9-eyebrow">SOURCE-SPECIFIC NEXT STUDY</p>'+
  '<h2 id="c9-progress-repair-title">Review your last difficult observations</h2></div>'+
  localLink('review','Open due-only scheduled review →','c9-button--small')+'</div>'+
  '<p class="c9-utility-description">These are the most recent graded responses for individual original cards where assistance, an incorrect answer or an Again grade was observed. They are not an unresolved-mastery list or proof that a card is currently due.</p>'+
  (repairs.length?'<div class="c9-progress-repair-list">'+repairs.map(({source,ev,concern})=>
   '<article class="c9-progress-repair-item"><div><span class="c9-eyebrow">'+esc(source.kind==='pinyin'?'Pronunciation':source.kind==='choice'?'Sentence meaning':'Word/character meaning')+'</span>'+
   '<h3 lang="zh-Hans">'+esc(source.prompt)+'</h3>'+
   '<p>'+esc(concern)+' · Original source: '+esc(source.lesson.meaning)+'</p></div>'+
   '<div class="c9-progress-repair-actions">'+
   act('c9-progress-source','Study original lesson →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(source.lesson.id)+'"')+
   localLink('review','Check due cards →','c9-button--small')+
   '</div></article>').join('')+'</div>':
   '<div class="c9-utility-empty"><strong>No recent difficult scheduled responses found.</strong>'+
   '<p>This does not establish complete mastery. Introduce original lessons or answer due prompts when available.</p></div>')+
 '</section>';
}
export function renderC9SearchAssist(state,ui,act,esc){
 const results=courseSearch(ui),byType=FIND_CATEGORIES.filter(([id])=>id!=='all').map(([id,label])=>({
   id,label,count:results.filter(x=>x.kind===id).length
 }));
 const examples=[
  ['characters',DEMO_LESSONS[0]?.hanzi,'Character'],
  ['words',WORDS[0]?.hanzi,'Vocabulary'],
  ['reading',STORIES[0]?.title,'Reading'],
  ['dialogues',DIALOGUES[0]?.title,'Conversation']
 ].filter(([k,v])=>v);
 return '<section class="c9-utility-panel c9-unified-card c9-search-assist" aria-labelledby="c9-search-workbench-title">'+
 '<div class="c9-utility-section-heading"><div><p class="c9-eyebrow">ORIGINAL INDEX · LIVE FILTER CONTEXT</p>'+
 '<h2 id="c9-search-workbench-title">Find the right source</h2></div>'+
 act('c9-find-focus','Focus the full search →','c9-button c9-button--primary c9-button--small')+'</div>'+
 '<p class="c9-utility-description">Results below use the existing indexed \`courseSearch\` authority. Example queries, categories and saved-only filters never introduce material, change source identities or write learner progress.</p>'+
 '<div class="c9-search-assist-grid" role="group" aria-label="Matched original source types">'+byType.map(r=>
  act('c9-find-type','<strong>'+r.count+'</strong><span>'+esc(r.label)+'</span>',
   'c9-search-assist-type'+(ui.kind===r.id?' is-current':''),
   'data-kind="'+r.id+'" aria-pressed="'+(ui.kind===r.id)+'"')).join('')+'</div>'+
 '<div class="c9-search-assist-actions"><div><strong>Start with an actual source</strong>'+
 '<p>Examples are drawn from the installed original content.</p></div>'+
 examples.map(([kind,query,label])=>act('c9-find-example',esc(label)+' · '+esc(query),
  'c9-button c9-button--secondary c9-button--small','data-kind="'+kind+'" data-query="'+esc(query)+'"')).join('')+
 act('c9-find-saved',ui.saved?'Show all indexed sources':'Only saved or introduced',
  'c9-button c9-button--quiet c9-button--small','aria-pressed="'+Boolean(ui.saved)+'"')+
 '</div></section>';
}
const TOOL_HANDOFFS=Object.freeze({
 pinyin:[['Speak and hear complete dialogs','dialogues'],['Review Pinyin in due prompts','review'],['See source characters','learn']],
 senses:[['Study saved words','wordbook'],['Explore a source word','find'],['Rebuild a sentence','workshop']],
 workshop:[['Source sentence library','sentences'],['Read in context','stories'],['Grammar teaching','grammar']],
 ladder:[['Return to character course','learn'],['Practice word meanings','wordbook'],['Review due prompts','review']],
 block:[['Continue original journey','journey'],['Sentence Ladder','ladder'],['Daily plan','plan']],
 fluency:[['Connected reading','stories'],['Listening conversation','dialogues'],['Original supplementary practice','practice']],
 journey:[['Original character lesson','learn'],['Study Blocks','block'],['Progress evidence','progress']],
 plan:[['Do due review','review'],['Open original course','learn'],['See recorded progress','progress']]
});
export function renderC9ToolConnections(route,state,act,esc){
 const relevant=TOOL_HANDOFFS[route]||[];
 const active=SESSION_STATUS[route],hasSession=Boolean(active&&state[active.key]);
 return '<section class="c9-advanced-tool-handoff" aria-label="Original learning tool handoffs">'+
 '<div class="c9-advanced-tool-heading"><div><p class="c9-eyebrow">A PRACTICAL LEARNING PATH</p>'+
 '<h2>'+(hasSession?'Your saved native session is ready':'Your original activity is below')+'</h2>'+
 '<p>'+(hasSession?'Continue the stored session where the original activity last saved its checkpoint. Unsubmitted text does not become a saved answer.':
 'This is an original learning tool. Choose the native activity or follow a source-linked path; navigation never awards grades.')+'</p></div>'+
 act('c9-tool-jump','Go to actual exercise ↓','c9-button c9-button--primary')+'</div>'+
 '<div class="c9-advanced-tool-paths">'+relevant.map(([label,target])=>
 '<a href="#/'+target+'"><span>'+esc(label)+'</span><span aria-hidden="true">→</span></a>').join('')+'</div>'+
 '</section>';
}
