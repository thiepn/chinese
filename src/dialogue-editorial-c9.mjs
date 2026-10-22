/** Read-only P75/P77 authored dialogue QA. No learner storage or grading authority.
 * These checks find structural defects, NOT correctness of Mandarin or Pinyin.
 */
import {DIALOGUES} from './dialogues.mjs';
import {STORIES} from './stories.mjs';

const manualReview=Object.freeze([
 'Qualified Mandarin naturalness, register and speaker consistency',
 'Pinyin segmentation, tones and proper nouns',
 'Line-by-line English translation accuracy',
 'Evidence-turn interpretation, answer-key fairness and distractors',
 'Cross-episode continuity without claiming identical historical sources',
 'Original authorship and intellectual-property clearance',
 'Accessibility of listening and source-reveal workflows',
 'HSK mapping only if an official corpus has been licensed and checked'
]);
const text=v=>typeof v==='string'&&v.trim().length>0;
const folded=v=>String(v??'').trim().normalize('NFKC').toLocaleLowerCase();

/** Pure defect finder so a malformed proposed editorial source is testable without publishing it. */
export function lintDialogueManuscript(source){
 const issues=[];
 if(!source||!text(source.id))return Object.freeze(['Manuscript ID missing']);
 if(source.approval!=='DEMO_ONLY'||source.editorialStatus!=='unreviewed'||source.officialHskLevel!==null)
  issues.push('Unapproved source must retain DEMO_ONLY, unreviewed and null official HSK metadata');
 if(!text(source.title)||!text(source.goal)||!text(source.readingId))
  issues.push('Title, teaching objective or original reading link missing');
 if(!Array.isArray(source.turns)||source.turns.length!==8)
  issues.push('Expected exactly eight authored source turns');
 const turns=Array.isArray(source.turns)?source.turns:[];
 const repeated=new Set(),speakers=new Set();
 turns.forEach((turn,i)=>{
  if(!text(turn?.speaker)||!text(turn?.hanzi)||!text(turn?.pinyin)||!text(turn?.english))
   issues.push('Turn '+(i+1)+' has incomplete speaker, Hanzi, Pinyin or English');
  if(turn?.speaker)speakers.add(turn.speaker);
  if(!/[\u3400-\u9fff]/u.test(turn?.hanzi||''))issues.push('Turn '+(i+1)+' has no Hanzi text');
  if(/[\u3400-\u9fff]/u.test(turn?.pinyin||'')||!/[a-z]/i.test(turn?.pinyin||''))
   issues.push('Turn '+(i+1)+' has non-Latin or missing Pinyin reference');
  if(text(turn?.hanzi)){
   if(repeated.has(turn.hanzi))issues.push('Turn '+(i+1)+' repeats an exact Mandarin utterance');
   repeated.add(turn.hanzi);
  }
 });
 if(speakers.size<3)issues.push('At least three authored speakers required');
 const qs=Array.isArray(source.questions)?source.questions:[];
 if(qs.length!==3)issues.push('Expected exactly three source-indexed questions');
 const uniquePrompts=new Set();
 qs.forEach((q,i)=>{
  if(!text(q?.prompt)||!text(q?.answer)||!text(q?.explanation))
   issues.push('Question '+(i+1)+' lacks prompt, answer or evidence explanation');
  if(!Array.isArray(q?.options)||q.options.length!==4||
   q.options.some(o=>!text(o))||
   new Set((q.options||[]).map(folded)).size!==4||
   !q.options?.includes(q.answer))
   issues.push('Question '+(i+1)+' has missing, ambiguous or repeated options');
  if(!Number.isInteger(q?.evidenceIndex)||q.evidenceIndex<0||q.evidenceIndex>=turns.length)
   issues.push('Question '+(i+1)+' does not reference an existing source turn');
  if(text(q?.prompt)){
   const key=folded(q.prompt);
   if(uniquePrompts.has(key))issues.push('Question '+(i+1)+' repeats a question prompt');
   uniquePrompts.add(key);
  }
 });
 return Object.freeze(issues);
}
const authored = Object.freeze(DIALOGUES.filter(d=>d.p75||d.p77));
const byId = new Map(authored.map(d=>[d.id,d]));
export function auditDialogueSource(id){
 const dialogue=byId.get(id);
 if(!dialogue)return null;
 const source=dialogue.p75||dialogue.p77;
 const phase=dialogue.p77?'P77':'P75';
 const issues=[...lintDialogueManuscript(source)];
 const reading=STORIES.find(s=>s.beginner?.p71?.id===source.readingId);
 if(!reading)issues.push('Related separately authored P71 reading does not exist');
 if(phase==='P77'){
  const prior=authored.find(x=>x.p75?.id===source.previous);
  if(!prior||prior.p75.readingId!==source.readingId)
   issues.push('Previous independently authored P75 negotiation is missing or references another reading');
 }
 if(source.turns.length!==dialogue.lines.length||
  source.turns.some((t,i)=>['speaker','hanzi','pinyin','english'].some(k=>t[k]!==dialogue.lines[i]?.[k])))
  issues.push('Native dialogue turns diverge from the source-owned manuscript');
 if(source.questions.length!==dialogue.questions.length||
  source.questions.some((q,i)=>q.answer!==dialogue.questions[i]?.answer||
   q.prompt!==dialogue.questions[i]?.prompt||
   q.options.some(v=>!dialogue.questions[i]?.options.includes(v))))
  issues.push('Native question content diverges from source-owned answer authority');
 return Object.freeze({
  id:dialogue.id,sourceId:source.id,phase,readingId:source.readingId,
  previous:source.previous||null,sourcePath:phase==='P77'?'src/p77-dialogues.mjs':'src/p75-dialogues.mjs',
  turnCount:source.turns.length,questionCount:source.questions.length,
  editorialStatus:'unreviewed',approval:'DEMO_ONLY',officialHskLevel:null,
  issues:Object.freeze(issues),manualReview
 });
}
export function auditDialogueInventory(){
 const rows=authored.map(d=>auditDialogueSource(d.id));
 return Object.freeze({total:rows.length,p75:rows.filter(r=>r.phase==='P75').length,
  p77:rows.filter(r=>r.phase==='P77').length,turns:rows.reduce((n,r)=>n+r.turnCount,0),
  questions:rows.reduce((n,r)=>n+r.questionCount,0),unreviewed:rows.length,
  flagged:rows.filter(r=>r.issues.length>0).length});
}
export function dialogueReviewPacket(id){
 const audit=auditDialogueSource(id);
 if(!audit)return null;
 const d=byId.get(id),source=d.p75||d.p77;
 const rows=[
  '# Original dialogue editorial review — '+source.title,
  'Canonical dialogue ID: '+audit.id,
  'Source manuscript ID: '+audit.sourceId,
  'Source file: '+audit.sourcePath,
  'Related independent P71 reading: '+audit.readingId,
  ...(audit.previous?['Previous separately authored P75 dialogue: '+audit.previous]:[]),
  'Status: DEMO_ONLY · UNREVIEWED. Human linguistic approval not granted.',
  'Official HSK mapping: NOT VERIFIED.',
  'Public source only: no learner event history, private writing, or account information.',
  '',
  '## Authored Mandarin turns and bilingual references'
 ];
 source.turns.forEach((t,i)=>rows.push(
  'Turn '+(i+1)+' — '+t.speaker,
  'Hanzi: '+t.hanzi, 'Pinyin: '+t.pinyin,'English: '+t.english));
 rows.push('','## Canonical questions, answer keys and indexed turn evidence');
 source.questions.forEach((q,i)=>rows.push(
  'Question '+(i+1)+' ['+q.id+']: '+q.prompt,
  'Answer: '+q.answer,'Options: '+q.options.join(' | '),
  'Evidence turn: '+(Number.isInteger(q.evidenceIndex)?q.evidenceIndex+1:'NOT INDEXED'),
  'Cited Hanzi: '+(source.turns[q.evidenceIndex]?.hanzi||'INVALID EVIDENCE'),
  'Explanation: '+q.explanation));
 rows.push('','## Machine-detectable structural issues',
  ...(audit.issues.length?audit.issues.map(issue=>'- '+issue):
   ['- None detected. This is NOT a finding of linguistic correctness.']),
  '','## Human review required',...manualReview.map(x=>'- [ ] '+x),
  '','Reviewer identity, date, evidence and source correction PR: [MANUALLY REQUIRED]',
  'This packet cannot approve, license, certify, grade or publish a dialogue.');
 return rows.join('\n');
}
