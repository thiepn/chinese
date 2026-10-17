/** P68–P74 source-owned editorial backlog and teaching evidence.
 * Structural checks are machine-checkable; none verify naturalness, official
 * HSK level, translation quality, copyright provenance or editor approval.
 */
import {STORIES,findStory,validateStory} from './stories.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,wordsForWrittenForm} from './lexicon.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
const grammarById=new Map(GRAMMAR_LESSONS.map(x=>[x.id,x]));
const readOnly=rows=>Object.freeze(rows.map(row=>Object.freeze(row)));
const sourcePath=story=>story.beginner?.source==='original-p68'?
 'src/p68-source-readings.mjs':'Original module associated with '+story.origin;
export function auditReadingSource(story){
 if(!story||findStory(story.id)!==story)return null;
 const issues=[],questions=story.beginner?.questions||story.extended?.questions||[];
 if(!validateStory(story))issues.push('Native story schema or answer mode invariant failed');
 for(const [i,line] of story.lines.entries()){
  if(!line.hanzi?.trim()||!line.pinyin?.trim()||!line.english?.trim())
   issues.push('Source line '+(i+1)+' is missing Hanzi, Pinyin or English');
 }
 for(const [i,q] of questions.entries()){
  if(!Number.isInteger(q.evidence)||q.evidence<0||q.evidence>=story.lines.length)
   issues.push('Question '+(i+1)+' has no valid cited source line');
  if(!q.answer||!q.options?.includes(q.answer)||new Set(q.options||[]).size!==q.options.length)
   issues.push('Question '+(i+1)+' has invalid or repeated answer options');
  if(!q.explanation?.trim())issues.push('Question '+(i+1)+' lacks source explanation');
 }
 if(story.beginner?.p68){
  const manuscript=story.beginner.p68;
  for(const link of manuscript.grammarEvidence||[]){
   const lesson=grammarById.get(link.grammarId);
   if(!lesson||!story.lines[link.lineIndex]?.hanzi.includes(link.token))
    issues.push('Grammar '+link.grammarId+' has no complete cited source anchor');
  }
  if(!manuscript.grammarEvidence?.length)
   issues.push('No source-anchored grammar lesson selected');
  if(!story.lines.some(l=>l.hanzi.includes(manuscript.focusWord.hanzi)))
   issues.push('Authored focus word does not occur in this passage');
 }
 return Object.freeze({storyId:story.id,origin:story.origin,
  sourcePath:sourcePath(story),editorialStatus:'unreviewed',
  hskStatus:'not-authoritatively-mapped',questionCount:questions.length,
  issues:Object.freeze(issues),lines:story.lines.length,
  manualReview:Object.freeze(['Chinese naturalness and register','Pinyin tones and names',
   'Bilingual translation faithfulness','Question interpretation and answer evidence',
   'Grammar and word usage in context','Rights and original authorship',
   'Official curriculum mapping, if ever claimed'])});
}
export function auditReadingInventory(){
 const audits=STORIES.map(auditReadingSource);
 return Object.freeze({total:audits.length,p68:audits.filter(x=>x.origin==='original-p68-evidence-reading').length,
  flagged:audits.filter(x=>x.issues.length).length,
  unreviewed:audits.length,
  statuses:readOnly(audits.map(x=>({storyId:x.storyId,issueCount:x.issues.length,editorialStatus:x.editorialStatus})))});
}
export function p68NativeTransfer(story){
 if(story?.beginner?.source!=='original-p68')return null;
 const p=story.beginner.p68,grammar=readOnly(p.grammarEvidence.map(ref=>{
  const lesson=grammarById.get(ref.grammarId),line=story.lines[ref.lineIndex];
  return {id:ref.grammarId,title:lesson?.title||'Unindexed grammar',
   token:ref.token,lineIndex:ref.lineIndex,
   hanzi:line?.hanzi||'',pinyin:line?.pinyin||'',english:line?.english||''};
 }));
 // A shared written form is a study connection only; never infer sense in
 // another authored sentence or an official level.
 const entry=wordsForWrittenForm(p.focusWord.hanzi);
 const word=entry.length===1?entry[0]:null;
 const matches=word?SENTENCE_LIBRARY.filter(x=>x.hanzi.includes(word.hanzi)).slice(0,3):[];
 return Object.freeze({storyId:story.id,grammar,
  focusWord:Object.freeze({...p.focusWord,wordKey:word?.key||null,
   ambiguous:entry.length>1}),sentences:readOnly(matches.map(s=>({
    id:s.id,hanzi:s.hanzi,pinyin:s.pinyin,english:s.english
   })))});
}
export function readingReviewPacket(storyId){
 const story=findStory(storyId),audit=auditReadingSource(story);
 if(!story||!audit)return null;
 const rows=['# Editorial review — '+story.title,
  'Canonical story ID: '+story.id,'Original source: '+audit.sourcePath,
  'Origin category: '+story.origin,'Status: UNREVIEWED (no approval granted)',
  'HSK mapping: NOT AUTHORITATIVELY VERIFIED',
  'Review scope: original source only; do not include learner events or private input',
  '', '## Source lines (bilingual)'];
 for(let i=0;i<story.lines.length;i++){const l=story.lines[i];rows.push(
  (i+1)+'. '+l.hanzi, '   Pinyin: '+l.pinyin,
  '   English: '+l.english);}
 const questions=story.beginner?.questions||story.extended?.questions||[];
 rows.push('','## Authored comprehension and cited evidence');
 for(const [i,q] of questions.entries()){
  rows.push('Question '+(i+1)+': '+q.prompt,'Answer: '+q.answer,
   'Alternatives: '+q.options.join(' | '),
   'Evidence line: '+(Number.isInteger(q.evidence)?q.evidence+1:'NOT INDEXED'),
   'Source explanation: '+(q.explanation||'NOT PROVIDED'));
 }
 const transfer=p68NativeTransfer(story);
 if(transfer){
  rows.push('','## Exact source grammar bridges');
  for(const g of transfer.grammar)rows.push(g.id+' — '+g.title+' | source line '+(g.lineIndex+1)+' | written evidence '+g.token);
  rows.push('Indexed focus written form: '+transfer.focusWord.hanzi+
   (transfer.focusWord.wordKey?' | '+transfer.focusWord.wordKey:' | no unique native dictionary ID'));
 }
 rows.push('','## Machine-checkable source issues',
  ...(audit.issues.length?audit.issues.map(x=>'- '+x):['- None found. This does NOT mean editorial approval.']),
  '','## Independent qualified editorial sign-off required',
  ...audit.manualReview.map(s=>'- [ ] '+s),
  '','Review outcome, reviewer identity, review date and source amendment PR: [MANUALLY REQUIRED]',
  'This generated packet cannot approve, certify, license or publish a reading.');
 return rows.join('\n');
}
