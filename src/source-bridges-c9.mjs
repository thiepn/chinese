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
export function sourceWordUsage(key,{limit=6}={}){
 const word=findWord(key);if(!word)return Object.freeze([]);
 const rows=[],seen=new Set(),max=limitTo(limit,20);
 const add=(record,sourceType,sourceId,sourceTitle,lineIndex=null)=>{
  if(!complete(record)||!record.hanzi.includes(word.hanzi)||rows.length>=max)return;
  const identity=uniqueKey(record);
  if(seen.has(identity))return;
  seen.add(identity);
  rows.push({hanzi:record.hanzi,pinyin:record.pinyin,english:record.english,
   sourceType,sourceId,sourceTitle,lineIndex,
   claim:'Exact written-form occurrence; lexical sense in context is not independently verified'});
 };
 // Give source-owned sentence and passage handoffs a meaningful chance to appear
 // even for richly annotated lexicon entries. Never overwhelm the first page
 // with duplicate lexical examples before displaying canonical practice routes.
 if(word.examples[0])add(word.examples[0],'word',word.key,word.source);
 for(const sentence of SENTENCE_LIBRARY){
  add(sentence,'sentence',sentence.id,sentence.topic);
  if(rows.length>=max)break;
 }
 for(const story of STORIES){
  for(let i=0;i<story.lines.length;i++){
   add(story.lines[i],'story',story.id,story.title,i);
   if(rows.length>=max)break;
  }
  if(rows.length>=max)break;
 }
 for(const record of word.examples.slice(1))add(record,'word',word.key,word.source);
 return freezeRows(rows);
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
