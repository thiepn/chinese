/**
 * P64–P68 source-backed cross-product teaching bridges.
 * References ONLY authored original vocabulary, sentence and story records.
 * A written-form occurrence is NOT proof of word sense, radical identity,
 * etymology, phonetic function, visual confusability, or HSK classification.
 * Read-only projections: StudyEvents, Review and source identity stay owned.
 */
import {findWord,WORDS,wordsForWrittenForm} from './lexicon.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES,tokenizeSentence} from './stories.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';

const limitTo=(n,maximum)=>Number.isInteger(n)?Math.max(0,Math.min(maximum,n)):maximum;
const freezeRows=rows=>Object.freeze(rows.map(row=>Object.freeze(row)));
const byLesson=new Map(DEMO_LESSONS.map(lesson=>[lesson.id,lesson]));
const uniqueKey=x=>x.hanzi.normalize('NFC');
const complete=record=>Boolean(record?.hanzi&&record?.pinyin&&record?.english);

/**
 * Find independently authored evidence of this exact written form.
 * Returned source IDs are existing canonical IDs, never generated IDs.
 */
/** Source records with exact written-form occurrence. These are *not* validated
 * contextual sense matches. A canonical sentence or passage is counted only
 * when the authored source itself contains the word's complete Hanzi form.
 * Counts are cached in memory, with no learner writes or API requests. */
const sourceCoverageCache=new Map();
export function sourceWordCoverage(key){
 const word=findWord(key);if(!word)return Object.freeze({sentences:0,stories:0,examples:0});
 if(sourceCoverageCache.has(key))return sourceCoverageCache.get(key);
 let sentences=0,stories=0;
 for(const record of SENTENCE_LIBRARY)if(record.hanzi.includes(word.hanzi))sentences++;
 for(const story of STORIES)for(const line of story.lines)if(line.hanzi.includes(word.hanzi))stories++;
 const result=Object.freeze({sentences,stories,examples:word.examples.length});
 sourceCoverageCache.set(key,result);return result;
}
/** Original written-form occurrences with complete native source links.
 * Identical Chinese text may be independently authored in multiple canonical
 * sources, so all exact source identities survive deduplication of the text.
 */
export function sourceWordUsage(key,{limit=6}={}){
 const word=findWord(key);if(!word)return Object.freeze([]);
 const max=limitTo(limit,20),byText=new Map();
 const add=(record,sourceType,sourceId,sourceTitle,lineIndex=null)=>{
  if(!complete(record)||!record.hanzi.includes(word.hanzi))return;
  const identity=uniqueKey(record);
  const link={sourceType,sourceId,sourceTitle,lineIndex};
  const prior=byText.get(identity);
  if(prior){
   if(!prior.links.some(l=>l.sourceType===sourceType&&l.sourceId===sourceId&&l.lineIndex===lineIndex))
    prior.links.push(link);
   return;
  }
  byText.set(identity,{hanzi:record.hanzi,pinyin:record.pinyin,english:record.english,
   sourceType,sourceId,sourceTitle,lineIndex,links:[link],
   claim:'Exact written-form occurrence; lexical sense in context is not independently verified'});
 };
 // Traverse canonical primary sources before lexical examples. A word already
 // in an original passage cannot be hidden by a duplicate author example.
 for(const sentence of SENTENCE_LIBRARY)add(sentence,'sentence',sentence.id,sentence.topic);
 for(const story of STORIES)for(let i=0;i<story.lines.length;i++)
  add(story.lines[i],'story',story.id,story.title,i);
 for(const record of word.examples)add(record,'word',word.key,word.source);
 const rows=[...byText.values()];
 // Reserve the first slots for native learning handoffs when available,
 // regardless of the relative size of the sentence and passage corpora.
 const selected=[],seen=new Set();
 const pull=type=>{
  const item=rows.find(row=>!seen.has(row)&&row.links.some(link=>link.sourceType===type));
  if(item){selected.push(item);seen.add(item);}
 };
 if(max){pull('sentence');if(selected.length<max)pull('story');}
 for(const item of rows){
  if(selected.length>=max)break;
  if(!seen.has(item)){selected.push(item);seen.add(item);}
 }
 return Object.freeze(selected.slice(0,max).map(item=>Object.freeze({
  ...item,links:Object.freeze(item.links.map(link=>Object.freeze({...link})))
 })));
}
/**
 * Original character lessons linked only through a canonical complete word.
 * This is orthographic co-occurrence, not an etymological decomposition.
 */
export function sourceCharacterLinks(lessonId,{limit=9}={}){
 const lesson=byLesson.get(lessonId);
 if(!lesson)return Object.freeze([]);
 const links=new Map();
 for(const word of WORDS){
  if(!word.hanzi.includes(lesson.hanzi))continue;
  for(const otherId of word.relatedLessonIds){
   if(otherId===lessonId)continue;
   const other=byLesson.get(otherId);
   if(!other)continue;
   let item=links.get(otherId);
   if(!item){item={lesson:other,words:[]};links.set(otherId,item);}
   item.words.push(word);
  }
 }
 return Object.freeze([...links.values()].sort((a,b)=>b.words.length-a.words.length||
  a.lesson.id.localeCompare(b.lesson.id)).slice(0,limitTo(limit,20)).map(link=>Object.freeze({
   lesson:link.lesson,words:Object.freeze(link.words.slice(0,4))
  })));
}
/**
 * Source word help for an original passage. Calling this is read-only;
 * the UI controller must explicitly mark assistance before displaying senses.
 */
export function originalStoryWordSupport(storyId,state,{limit=24}={}){
 const story=STORIES.find(x=>x.id===storyId);if(!story)return Object.freeze([]);
 const seen=new Set(),rows=[],introduced=new Set(state?.learned||[]);
 for(let lineIndex=0;lineIndex<story.lines.length;lineIndex++){
  for(const token of tokenizeSentence(story.lines[lineIndex].hanzi)){
   const readings=wordsForWrittenForm(token.text);
   if(!readings.length)continue;
   if(seen.has(token.text))continue;
   seen.add(token.text);
   const word=readings.length===1?readings[0]:null;
   rows.push(Object.freeze({
    hanzi:token.text,lineIndex,ambiguous:readings.length>1,
    readings:Object.freeze([...readings]),
    wordKey:word?.key||null,
    introduced:word?word.relatedLessonIds.some(id=>introduced.has(id)):false,
    source:word?.source||null
   }));
  }
 }
 return Object.freeze(rows.slice(0,limitTo(limit,80)));
}

/** P65 documented source character comparison, *not* visual confusability,
 * decomposition, radical origin or linguistic certification. Examples and
 * pronunciations must come verbatim from existing original lesson records. */
export function sourceCharacterComparisonSet(lessonId,{limit=4}={}){
 const lesson=byLesson.get(lessonId);
 if(!lesson)return Object.freeze([]);
 const cleanPinyin=value=>String(value||'').normalize('NFC').trim().toLocaleLowerCase();
 const syllable=value=>cleanPinyin(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const validSample=row=>row&&row.hanzi&&row.pinyin&&row.english;
 const linked=new Map(sourceCharacterLinks(lessonId,{limit:20})
   .map(x=>[x.lesson.id,x.words]));
 const set=[];
 for(const other of DEMO_LESSONS){
  if(other.id===lesson.id||!validSample(lesson.sentence)||!validSample(other.sentence))continue;
  const sourceWords=linked.get(other.id)||[];
  const sameReading=cleanPinyin(lesson.pinyin)===cleanPinyin(other.pinyin);
  const sameSyllable=!sameReading&&syllable(lesson.pinyin)===syllable(other.pinyin);
  if(!sourceWords.length&&!sameReading&&!sameSyllable)continue;
  // This ranking is source evidence strength, not an official difficulty label.
  const relation=sameReading?'Same indexed Pinyin':sameSyllable?
   'Same Pinyin letters, different recorded tone':'Both appear in an indexed whole word';
  set.push({lesson:other,relation,words:sourceWords.slice(0,3),
   sample:other.sentence,priority:sameReading?0:sameSyllable?1:2});
 }
 const chosen=set.sort((a,b)=>a.priority-b.priority||b.words.length-a.words.length||
  a.lesson.id.localeCompare(b.lesson.id)).slice(0,Math.max(0,Math.min(8,Number.isInteger(limit)?limit:4)));
 return Object.freeze(chosen.map(x=>Object.freeze({...x,
  words:Object.freeze([...x.words]),
  sample:Object.freeze({...x.sample})
 })));
}
