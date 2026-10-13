// P26 contextual original corpus; not official HSK. Historical IDs are preserved.
import {SENTENCE_TOPICS_A} from './sentence-corpus-a.mjs';
import {SENTENCE_TOPICS_B} from './sentence-corpus-b.mjs';
import {P32_SENTENCE_TOPICS_A} from './p32-sentences-a.mjs';
import {P32_SENTENCE_TOPICS_B} from './p32-sentences-b.mjs';
import {P35_SENTENCE_TOPICS} from './p35-sentences.mjs';
import {P36_SENTENCE_TOPICS,P36_SENTENCE_GRAMMAR_IDS} from './p36-sentences.mjs';
import {P38_SENTENCE_TOPICS,P38_SENTENCE_GRAMMAR_IDS} from './p38-sentences.mjs';
import {SENTENCE_VARIATIONS} from './sentence-variations.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {STORIES,tokenizeSentence,shuffledChunkIndices} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {evaluateAnswer} from './exercises.mjs';

const priorTopics=[...SENTENCE_TOPICS_A,...SENTENCE_TOPICS_B];
const p32Topics=[...P32_SENTENCE_TOPICS_A,...P32_SENTENCE_TOPICS_B];
const p36Offset=priorTopics.length+p32Topics.length+P35_SENTENCE_TOPICS.length;
const p38Offset=p36Offset+P36_SENTENCE_TOPICS.length;
const topics=[...priorTopics,...p32Topics,...P35_SENTENCE_TOPICS,...P36_SENTENCE_TOPICS,...P38_SENTENCE_TOPICS];
export const SENTENCE_TOPICS=Object.freeze(topics.map((t,i)=>Object.freeze({
 id:'topic-'+String(i+1).padStart(2,'0'),title:t[0],area:t[1],purpose:t[2],difficulty:t[3],grammarIds:Object.freeze([...t[4]])
})));
const variants=new Map(SENTENCE_VARIATIONS.map(v=>[v.base,v]));
export const SENTENCE_LIBRARY=Object.freeze(topics.flatMap((t,i)=>t[5].map((row,j)=>{
 const raw=variants.get(row[0]);
 const variant=raw?Object.freeze({hanzi:raw.hanzi,pinyin:raw.pinyin,english:raw.english,explanation:raw.explanation,kind:raw.kind}):null;
 return Object.freeze({id:'sent-'+String(i*10+j+1).padStart(3,'0'),hanzi:row[0],pinyin:row[1],english:row[2],
 topicId:SENTENCE_TOPICS[i].id,topic:SENTENCE_TOPICS[i].title,area:SENTENCE_TOPICS[i].area,
 purpose:SENTENCE_TOPICS[i].purpose,difficulty:SENTENCE_TOPICS[i].difficulty,
 grammarIds:i>=p38Offset?Object.freeze([P38_SENTENCE_GRAMMAR_IDS[(i-p38Offset)*10+j]]):i>=p36Offset?Object.freeze([P36_SENTENCE_GRAMMAR_IDS[(i-p36Offset)*10+j]]):SENTENCE_TOPICS[i].grammarIds,position:j,variant,source:i<priorTopics.length?'original-p26':i<priorTopics.length+p32Topics.length?'original-p32':i<priorTopics.length+p32Topics.length+P35_SENTENCE_TOPICS.length?'original-p35':i<p38Offset?'original-p36':'original-p38',officialHskLevel:null});
})));
const byId=new Map(SENTENCE_LIBRARY.map(s=>[s.id,s]));
export const findLibrarySentence=id=>byId.get(id)||null;
export const SENTENCE_MODES=Object.freeze(['meaning','cloze','ordering','transformation','production']);
export const hasSentenceMode=(s,mode)=>Boolean(s&&SENTENCE_MODES.includes(mode)&&(mode!=='transformation'||s.variant));
export const sentenceBookmarked=(state,id)=>(state.bookmarkedSentences||[]).includes(id);
export function toggleSentenceSaved(state,id){
 if(!findLibrarySentence(id))throw Error('Unavailable original sentence');
 const next=structuredClone(state),saved=next.bookmarkedSentences||[];
 next.bookmarkedSentences=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
 return next;
}
export function validateSentenceBookmarks(state){
 if(state.bookmarkedSentences===undefined)return true;
 const saved=state.bookmarkedSentences;
 if(!Array.isArray(saved)||saved.length>500||new Set(saved).size!==saved.length||
 saved.some(id=>!findLibrarySentence(id)))throw Error('Invalid saved sentence collection');
 return true;
}
const norm=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
export function searchSentences({query='',topic='all',difficulty='all',area='all',grammar='all',purpose='all',tone='all',source='all',savedOnly=false,state={}}={}){
 const q=norm(query);
 return SENTENCE_LIBRARY.filter(s=>
 (source==='all'||s.source===source)&&(topic==='all'||s.topicId===topic)&&(difficulty==='all'||String(s.difficulty)===String(difficulty))&&
 (area==='all'||s.area===area)&&(grammar==='all'||s.grammarIds.includes(grammar))&&(purpose==='all'||s.purpose===purpose)&&
 (tone==='all'||({tone1:/[āēīōūǖ]/u,tone2:/[áéíóúǘ]/u,tone3:/[ǎěǐǒǔǚ]/u,tone4:/[àèìòùǜ]/u}[tone]?.test(s.pinyin)??false))&&
 (!savedOnly||sentenceBookmarked(state,s.id))&&
 (!q||norm([s.hanzi,s.pinyin,s.english,s.topic,s.purpose,s.area,...s.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)?.title||'')].join(' ')).includes(q)));
}
export function sentenceContext(id){
 const s=findLibrarySentence(id);if(!s)return null;
 const siblings=SENTENCE_LIBRARY.filter(x=>x.topicId===s.topicId);
 const near=siblings.slice(Math.max(0,s.position-2),Math.min(10,s.position+3)).filter(x=>x.id!==id);
 const words=WORDS.filter(w=>w.hanzi.length>=2&&s.hanzi.includes(w.hanzi)).sort((a,b)=>b.hanzi.length-a.hanzi.length).slice(0,10);
 const chars=DEMO_LESSONS.filter(l=>s.hanzi.includes(l.hanzi)).slice(0,8);
 const readings=STORIES.filter(story=>words.some(w=>story.lines.some(line=>line.hanzi.includes(w.hanzi)))).slice(0,3);
 const dialogues=DIALOGUES.filter(d=>words.some(w=>d.lines.some(line=>line.hanzi.includes(w.hanzi)))).slice(0,3);
 return {s,near,words,chars,readings,dialogues,grammar:s.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean)};
}
export const sentencePracticeId=(id,mode)=>'context:'+id+':'+mode;
export const SENTENCE_LIBRARY_TASKS=Object.freeze(SENTENCE_LIBRARY.flatMap(s=>
 SENTENCE_MODES.filter(m=>hasSentenceMode(s,m)).map(mode=>{
  const model=mode==='transformation'?s.variant:s;
  return Object.freeze({id:sentencePracticeId(s.id,mode),sentenceId:s.id,kind:'contextual',mode,
   storyId:null,english:model.english,hanzi:model.hanzi,pinyin:model.pinyin});
 })));
const tasks=new Map(SENTENCE_LIBRARY_TASKS.map(t=>[t.id,t]));
function options(answer,candidates,seed){
 const others=[...new Set(candidates.filter(x=>x!==answer))];const offset=seed%Math.max(1,others.length);
 const all=[answer,...[...others.slice(offset),...others.slice(0,offset)].slice(0,3)];
 const shift=seed%all.length;return [...all.slice(shift),...all.slice(0,shift)];
}
const lexical=WORDS.filter(w=>w.hanzi.length>=2).sort((a,b)=>b.hanzi.length-a.hanzi.length);
function cloze(s){
 const target=lexical.find(w=>s.hanzi.includes(w.hanzi))?.hanzi||[...s.hanzi].find(ch=>/\p{Script=Han}/u.test(ch))||'我';
 const i=s.hanzi.indexOf(target),neighbours=SENTENCE_LIBRARY.filter(x=>x.topicId===s.topicId&&x.id!==s.id);
 const local=neighbours.flatMap(x=>lexical.filter(w=>x.hanzi.includes(w.hanzi)).map(w=>w.hanzi));
 const candidates=[...new Set([...local,...lexical.map(w=>w.hanzi),
 ...DEMO_LESSONS.map(l=>l.hanzi)])].filter(w=>w!==target&&!s.hanzi.includes(w));
 const sameLength=candidates.filter(w=>w.length===target.length);
 const combined=[...sameLength,...candidates.filter(w=>w.length!==target.length)];
 return {context:s.hanzi.slice(0,i)+'＿＿'+s.hanzi.slice(i+target.length),
  answer:target,options:options(target,combined,Number(s.id.slice(-3)))};
}
function chunksFor(s){
 const parts=[];
 for(const token of tokenizeSentence(s.hanzi).map(t=>t.text)){
  if(/^[，。！？!?；;、]$/u.test(token)&&parts.length)parts[parts.length-1]+=token;
  else parts.push(token);
 }
 while(parts.length>10){
  const i=parts.findIndex((w,j)=>j<parts.length-1&&w.length<=2&&parts[j+1].length<=2);
  const p=i<0?parts.length-2:i;parts.splice(p,2,parts[p]+parts[p+1]);
 }
 return parts;
}
export function sentenceQuestion(id,mode='meaning'){
 const s=findLibrarySentence(id);if(!hasSentenceMode(s,mode))return null;
 const task=tasks.get(sentencePracticeId(id,mode));
 if(mode==='meaning'){
  const alternatives=SENTENCE_LIBRARY.filter(x=>x.id!==s.id&&x.topicId===s.topicId).map(x=>x.english);
  return {task,kind:'choice',mode,prompt:'Choose the meaning of the complete sentence.',context:s.hanzi,
   answer:s.english,model:s,options:options(s.english,alternatives,Number(id.slice(-3))),
   explanation:'Read this as a complete sentence in '+s.topic.toLowerCase()+'; isolated character glosses are not enough.'};
 }
 if(mode==='cloze'){
  const item=cloze(s);
  return {task,kind:'choice',mode,prompt:'Choose the missing word in the original Chinese sentence.',context:item.context,
    answer:item.answer,model:s,options:item.options,explanation:'Word choice depends on how the entire sentence is used in context.'};
 }
 if(mode==='ordering'){
  const chunks=chunksFor(s);
  return {task,kind:'ordering',mode,prompt:'Rebuild the original Chinese sentence from its word chunks.',
   context:s.english,answer:s.hanzi,model:s,chunks,order:shuffledChunkIndices(chunks,s.id),
   explanation:'Pay attention to time and place phrases, object placement and sentence particles.'};
 }
 if(mode==='transformation'){
  return {task,kind:'hanzi',mode,prompt:'Rewrite the sentence: '+s.variant.explanation,context:s.hanzi,
   answer:s.variant.hanzi,model:s.variant,explanation:s.variant.explanation};
 }
 return {task,kind:'hanzi',mode,prompt:'Write one complete Chinese model sentence for this English meaning.',
   context:s.english,answer:s.hanzi,model:s,
   explanation:'The app checks the taught model only. Alternative valid translations require human interpretation.'};
}
export const gradeSentenceChoice=(q,response)=>evaluateAnswer(response,q.answer,'choice');