/** Batch 13: connected teaching projections and evidence-only lesson consolidation.
 * No HSK membership, inferred morpheme pronunciation, acoustic score or mastery grants.
 */
import {findLesson} from './demo-lessons.mjs';
import {unresolvedCourseSkills} from './course-continuation.mjs';
import {toneExplanation} from './tone-coach.mjs';
import {pronunciationPath} from './pronunciation-path.mjs';

export const FACETS=Object.freeze([
 {stage:'character',label:'Character meaning',tip:'Explain what this character contributes in the current lesson.'},
 {stage:'vocabulary',label:'Word meaning',tip:'Read the complete word rather than guessing from one character.'},
 {stage:'sentence',label:'Sentence comprehension',tip:'Read the sentence before revealing its English meaning.'},
 {stage:'recall',label:'Written pronunciation',tip:'Recall syllables and lexical tones without showing pinyin.'}
]);

export function characterWordSentenceBridge(lessonId){
 const lesson=findLesson(lessonId);if(!lesson)return null;
 const focus=Array.from(lesson.hanzi);
 const words=lesson.words.map((word,index)=>{
  const chars=Array.from(word.hanzi),positions=[];
  for(let i=0;i<=chars.length-focus.length;i++)if(focus.every((char,j)=>chars[i+j]===char))positions.push(i);
  const sentenceAt=lesson.sentence.hanzi.indexOf(word.hanzi);
  return {index,hanzi:word.hanzi,pinyin:word.pinyin,meaning:word.english,positions,characters:chars,occursInSentence:sentenceAt>=0,sentenceOffset:sentenceAt};
 });
 return {lessonId:lesson.id,hanzi:lesson.hanzi,reading:lesson.pinyin,meaning:lesson.meaning,note:lesson.note,words,sentence:lesson.sentence,
  teachingCaution:'A full word has its own pronunciation and meaning; its syllables cannot be inferred safely by splitting the word pinyin without verified word-level alignment.'};
}

/** Most recent journey only, including any still-active checkpoint; history never mutated. */
export function lessonConsolidation(state,lessonId){
 if(!findLesson(lessonId))return null;
 const all=(state.courseEvents||[]).filter(e=>e.lessonId===lessonId),end=all.length-1;
 const active=state.courseJourney?.lessonId===lessonId;
 const completedIndices=all.flatMap((event,index)=>event.stage==='completed'?[index]:[]);
 const last=completedIndices.at(-1)??-1;
 const from=active?last+1:(completedIndices.length>=2?completedIndices.at(-2)+1:0);
 const scoped=all.slice(from,active?undefined:last>=0?last+1:undefined);
 const rows=FACETS.map(facet=>{
  const attempts=scoped.filter(e=>e.stage===facet.stage),event=attempts.at(-1)||null;
  const status=!event?'untried':event.correct&&!event.assisted?'independent':event.assisted?'assisted':'retry';
  return {...facet,status,attempts:attempts.length,lastEventId:event?.id||null,wordIndex:event?.wordIndex??null};
 });
 const pending=unresolvedCourseSkills(state,lessonId);
 const unfinished=rows.filter(r=>r.status!=='independent');
 return {lessonId,completed:completedIndices.length>0&&!active,active,rows,
  independent:rows.filter(r=>r.status==='independent').length,checked:rows.filter(r=>r.status!=='untried').length,
  pending,priority:pending[0]?.stage||unfinished[0]?.stage||null,
  note:'These are outcomes of guided checkpoints, not predicted memory retention, official HSK competence, or scheduled-review grades.'};
}

export function lessonRemediationPlan(state,lessonId){
 const summary=lessonConsolidation(state,lessonId);if(!summary)return null;
 const weak=summary.pending;
 const targets=weak.length?weak.map(x=>x.stage):summary.rows.filter(x=>x.status==='untried').map(x=>x.stage);
 const priority=targets[0]||null;
 const action=priority==='recall'?'Rewrite the full pronunciation with tones':priority==='sentence'?'Interpret or rebuild the Chinese sentence':priority==='vocabulary'?'Revisit both complete vocabulary words':priority==='character'?'Recall the character meaning without hints':'Continue scheduled review when it becomes due';
 return {...summary,targets,action};
}

/** Compares typed romanization only; lexical tone contours are not speech recognition. */
export function contextualPronunciationFeedback(response,reference){
 const result=toneExplanation(response,reference),guide=pronunciationPath(reference);
 const mismatch=result.reason==='tone'?'tone':result.reason==='syllables'?'syllables':result.correct?'none':'format';
 const action=mismatch==='tone'?'Compare lexical pitch contours, then independently retype the entire word or sentence.':
  mismatch==='syllables'?'Check each syllable onset and final before attempting tones again.':
  mismatch==='format'?'Enter complete tone-marked pinyin or numbered tones and try again.':'The written syllables and lexical tones match the reference.';
 return {correct:!!result.correct,mismatch,detail:String(result.detail||result.message||''),action,syllables:guide?.syllables||[],scope:'written-pinyin-only'};
}
