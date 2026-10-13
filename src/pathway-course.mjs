// P29 original HSK-oriented pathway, not official HSK membership or exam readiness.
// Supplementary evidence is stored only in existing sentenceEvents.
import {PATHWAY_ROWS_A} from './pathway-data-a.mjs';
import {PATHWAY_ROWS_B} from './pathway-data-b.mjs';
import {PATHWAY_ROWS_C} from './pathway-data-c.mjs';
import {WORDS} from './lexicon.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';

const labels=[
 ['First interactions','Greet people, state identities, make simple requests.','Everyday beginnings'],
 ['Daily exchanges','Arrange times, request directions and solve practical problems.','Connected beginner'],
 ['Context and choice','Explain reasons, compare options and discuss preferences.','Beginner-to-intermediate bridge'],
 ['Cooperative communication','Write concise messages, coordinate plans and summarize information.','Intermediate exploration'],
 ['Contrast and explanation','Explain circumstances, qualify views and manage uncertainty.','Intermediate development'],
 ['Evidence and outcomes','Understand claims, distinguish results and explain decisions.','Upper-intermediate exploration'],
 ['Public reasoning','Interpret viewpoints, caveats and competing claims.','Advanced exploration sample'],
 ['Academic interpretation','Evaluate arguments and support interpretations with evidence.','Advanced exploration sample'],
 ['Independent nuanced discourse','Form qualified conclusions and compare defensible approaches.','Advanced exploration sample']
];
export const PATHWAY_BANDS=Object.freeze(labels.map(([title,purpose,status],i)=>
 Object.freeze({id:'band-'+(i+1),number:i+1,title,purpose,status,
  officialHskMembership:false,coverageClaim:false,
  note:i>=6?'Original advanced exploration samples—not a complete advanced syllabus.':
  'Original study grouping, not an authorized HSK 3.0 assignment.'})));
const rows=[...PATHWAY_ROWS_A,...PATHWAY_ROWS_B,...PATHWAY_ROWS_C];
export const PATHWAY_MISSIONS=Object.freeze(rows.map((r,i)=>{
 const band=PATHWAY_BANDS[Math.floor(i/4)];
 const [title,purpose,grammarId,lines,question,cloze,teaching]=r;
 return Object.freeze({id:'path-'+String(i+1).padStart(2,'0'),index:i,band:band.number,
  numberInBand:i%4+1,bandId:band.id,title,purpose,grammarId,
  lines:Object.freeze(lines.map(l=>Object.freeze({hanzi:l[0],pinyin:l[1],english:l[2]}))),
  question:Object.freeze({prompt:question[0],answer:question[1],
    options:Object.freeze(question.slice(1,5)),evidence:question[5],explanation:question[6]}),
  cloze,teaching,writing:Object.freeze({hanzi:lines[2][0],pinyin:lines[2][1],english:lines[2][2]}),
  provenance:'original-p29',officialHskLevel:null});
}));
const byId=new Map(PATHWAY_MISSIONS.map(m=>[m.id,m]));
export const findPathwayMission=id=>byId.get(id)||null;
export const PATHWAY_MODES=Object.freeze(['meaning','cloze','listening','production']);
export const pathwayTaskId=(id,mode)=>'pathway:'+id+':'+mode;
export const PATHWAY_TASKS=Object.freeze(PATHWAY_MISSIONS.flatMap(m=>PATHWAY_MODES.map(mode=>
 Object.freeze({id:pathwayTaskId(m.id,mode),pathwayId:m.id,mode,
  kind:'pathway-original',hanzi:(mode==='production'?m.writing:m.lines[mode==='listening'?0:1]).hanzi,
  english:(mode==='production'?m.writing:m.lines[mode==='listening'?0:1]).english,
  pinyin:(mode==='production'?m.writing:m.lines[mode==='listening'?0:1]).pinyin}))));
const byTask=new Map(PATHWAY_TASKS.map(t=>[t.id,t]));
const distinctOptions=(correct,wrong,shift=0)=>{
 const arr=[correct,...new Set(wrong.filter(x=>x&&x!==correct))].slice(0,4);
 return [...arr.slice(shift%arr.length),...arr.slice(0,shift%arr.length)];
};
export function pathwayQuestion(id,mode){
 const mission=findPathwayMission(id);if(!mission||!PATHWAY_MODES.includes(mode))return null;
 const task=byTask.get(pathwayTaskId(id,mode));
 if(mode==='production')return {task,mode,kind:'hanzi',answer:mission.writing.hanzi,
  context:mission.writing.english,prompt:'Write the Chinese response from its English meaning.',
  explanation:'Exact-model Chinese production. Other valid expressions may exist; only this authored sentence is checked.'};
 if(mode==='cloze'){
  const source=mission.lines.map(l=>l.hanzi).find(l=>l.includes(mission.cloze))||mission.lines[1].hanzi;
  const i=source.indexOf(mission.cloze);
  return {task,mode,kind:'choice',context:i<0?source:source.slice(0,i)+'＿＿'+source.slice(i+mission.cloze.length),
   prompt:'Choose the expression that completes this contextual sentence.',answer:mission.cloze,
   options:distinctOptions(mission.cloze,
    PATHWAY_MISSIONS.filter(m=>m.band===mission.band&&m.id!==mission.id).map(m=>m.cloze).concat(['但是','所以','没有']),mission.index+2),
   explanation:mission.teaching};
 }
 if(mode==='listening'){
  const sound=mission.lines[0];
  const others=PATHWAY_MISSIONS.filter(m=>m.band===mission.band&&m.id!==mission.id).map(m=>m.lines[0].english);
  return {task,mode,kind:'choice',context:'',audioText:sound.hanzi,
   prompt:'Play the device Mandarin voice, then choose the sentence meaning.',
   answer:sound.english,options:distinctOptions(sound.english,others,mission.index+1),
   explanation:'Listen to the full sentence. Audio uses an optional device Mandarin voice, not native-speaker recordings.'};
 }
 const q=mission.question;
 return {task,mode,kind:'choice',context:mission.lines.map(l=>l.hanzi).join(' '),
  prompt:q.prompt,answer:q.answer,options:distinctOptions(q.answer,q.options.slice(1),mission.index+2),
  evidence:mission.lines[q.evidence],explanation:q.explanation};
}
export function pathwayStats(state,bandNumber){
 const missions=PATHWAY_MISSIONS.filter(m=>m.band===bandNumber);
 const events=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('pathway:'));
 const taskIDs=new Set(missions.flatMap(m=>PATHWAY_MODES.map(mode=>pathwayTaskId(m.id,mode))));
 const relevant=events.filter(e=>taskIDs.has(e.taskId));
 const passed=new Set(relevant.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId));
 return {missions:missions.length,attempts:relevant.length,independent:passed.size,
  begun:new Set(relevant.map(e=>e.taskId.split(':')[1])).size,
  observedMissions:missions.filter(m=>passed.has(pathwayTaskId(m.id,'meaning'))&&passed.has(pathwayTaskId(m.id,'production'))).length};
}
export function pathwayNext(state,bandNumber,afterId){
 const missions=PATHWAY_MISSIONS.filter(m=>m.band===bandNumber);if(!missions.length)return null;
 const passed=new Set((state.sentenceEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.taskId));
 const index=missions.findIndex(m=>m.id===afterId);
 const order=index<0?missions:[...missions.slice(index+1),...missions.slice(0,index+1)];
 return order.find(m=>!passed.has(pathwayTaskId(m.id,'meaning'))||!passed.has(pathwayTaskId(m.id,'production')))||order[0];
}
export function pathwayResume(state){
 const events=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('pathway:'));
 const last=events.at(-1);
 return findPathwayMission(last?.taskId?.split(':')[1])||PATHWAY_MISSIONS[0];
}
export function pathwayDailyRoute(state,bandNumber,minutes=20){
 const size=minutes<=10?1:minutes<=20?2:3,missions=PATHWAY_MISSIONS.filter(m=>m.band===bandNumber);
 const first=pathwayNext(state,bandNumber),start=missions.findIndex(m=>m.id===first?.id);
 const chosen=missions.length?[...missions.slice(Math.max(0,start)),...missions.slice(0,Math.max(0,start))].slice(0,size):[];
 return {minutes,bandNumber,missions:chosen,steps:[
  'Read three connected sentences with optional Pinyin support',
  'Answer an original comprehension and word-choice question',
  'Hear Mandarin via device speech, then reconstruct one Chinese model',
  'Continue in linked character, grammar, vocabulary, sentence and reading systems']};
}
export function pathwayConnections(mission){
 if(!mission)return {grammar:null,words:[],characters:[],sentences:[],reading:null,dialogue:null};
 const full=mission.lines.map(l=>l.hanzi).join('');
 const words=WORDS.filter(w=>w.hanzi.length>=2&&full.includes(w.hanzi)).slice(0,6);
 const characters=DEMO_LESSONS.filter(l=>full.includes(l.hanzi)).slice(0,5);
 const sentences=SENTENCE_LIBRARY.filter(s=>s.grammarIds.includes(mission.grammarId)&&
  words.some(w=>s.hanzi.includes(w.hanzi))).slice(0,3);
 const reading=STORIES.find(s=>words.some(w=>s.lines.some(l=>l.hanzi.includes(w.hanzi))))||null;
 const dialogue=DIALOGUES.find(d=>words.some(w=>d.lines.some(l=>l.hanzi.includes(w.hanzi))))||null;
 return {grammar:GRAMMAR_LESSONS.find(g=>g.id===mission.grammarId)||null,
  words,characters,sentences,reading,dialogue};
}