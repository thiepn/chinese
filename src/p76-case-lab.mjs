/** P76: five original paired-source evidence case labs.
 * The reading and dialogue are separately authored educational texts. The
 * comparisons below are explicit instructional prompts, not shared testimony.
 * All answers are delegated to original dialogue and reading graders.
 */
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {wordsForWrittenForm} from './lexicon.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
const authored=Object.freeze([
 {claim:'Similar river routes prove that both maps have the same maker.',reading:3,dialogue:3,question:0,
  task:'As an exhibition editor, compare what the archive and the curator can actually establish. Write a corrected visitor label in Mandarin.',
  spoken:'Explain why visual resemblance cannot identify a historical author. Then say what new evidence could change the label.',
  contrast:'Both independent manuscripts reject treating resemblance as proof of authorship.'},
 {claim:'A strong-wind forecast is already a formal ferry cancellation.',reading:4,dialogue:4,question:0,
  task:'As the organizer, draft a Chinese notice distinguishing forecast, operator decision and a fallback arrangement.',
  spoken:'Explain to a visitor why an operator notice matters more than a forecast, without inventing a cancellation.',
  contrast:'The reading and conversation separately distinguish predictions from operator authority.'},
 {claim:'A remembered quotation is a verified transcript of the meeting.',reading:4,dialogue:3,question:0,
  task:'As a school investigator, write two Mandarin paragraphs separating allegations, recorded evidence and pending inquiries.',
  spoken:'Explain what can be responsibly communicated while recollections remain disputed.',
  contrast:'Neither source treats personal recollection as a verified verbatim record.'},
 {claim:'A small positive pilot proves the new library service works for everyone.',reading:4,dialogue:3,question:0,
  task:'Write a Mandarin pilot evaluation that reports feedback, accessibility barriers and a justified next test.',
  spoken:'Present the limits of the sample to the library team, then recommend one follow-up step.',
  contrast:'The separate accounts both require testing before wider claims can be supported.'},
 {claim:'An interview suggestion is already a signed internship schedule.',reading:5,dialogue:4,question:0,
  task:'Draft a two-paragraph Mandarin clarification distinguishing proposed dates from confirmed agreement terms.',
  spoken:'Explain which details need written confirmation before a university can report a final placement.',
  contrast:'Both manuscripts distinguish tentative scheduling from final two-party agreement.'}
]);
export function p76Cases(){
 return authored.map((brief,i)=>{
  const reading=STORIES.find(s=>s.beginner?.p71?.id==='p71-'+String(i+1).padStart(2,'0'));
  const dialogue=DIALOGUES.find(d=>d.p75?.readingId===reading?.beginner?.p71?.id);
  const nextDialogue=DIALOGUES.find(d=>d.p77?.readingId===reading?.beginner?.p71?.id);
  const followup=nextDialogue?.p77,first=followup?.questions[0],nextLine=nextDialogue?.lines[first?.evidenceIndex];
  if(!reading||!dialogue||!nextDialogue||followup.previous!==dialogue.p75.id||
     !reading.lines[brief.reading]||!dialogue.lines[brief.dialogue]||
     !dialogue.questions[brief.question]||!first||!nextLine)return null;
  const references=(reading.beginner.p71.grammarEvidence||[]).map(ref=>{
   const lesson=GRAMMAR_LESSONS.find(l=>l.id===ref.grammarId);
   if(!lesson||!reading.lines[ref.lineIndex]?.hanzi.includes(ref.token))return null;
   return Object.freeze({id:lesson.id,title:lesson.title,lineIndex:ref.lineIndex,
    token:ref.token,source:reading.lines[ref.lineIndex]});
  }).filter(Boolean);
  const focus=reading.beginner.p71.focusWord,readings=wordsForWrittenForm(focus.hanzi);
  const word=readings.length===1?readings[0]:null;
  // Character lookup means only orthographic presence, not a proven morpheme meaning.
  const chars=Object.freeze([...new Set(Array.from(focus.hanzi))]
   .map(hanzi=>DEMO_LESSONS.find(lesson=>lesson.hanzi===hanzi))
   .filter(Boolean).map(lesson=>Object.freeze({id:lesson.id,hanzi:lesson.hanzi,pinyin:lesson.pinyin})));
  return Object.freeze({id:'p76-case-'+String(i+1).padStart(2,'0'),readingId:reading.id,dialogueId:dialogue.id,nextDialogueId:nextDialogue.id,
   title:dialogue.title,claim:brief.claim,task:brief.task,spoken:brief.spoken,contrast:brief.contrast,
   readingEvidence:Object.freeze({...reading.lines[brief.reading],index:brief.reading}),
   dialogueEvidence:Object.freeze({...dialogue.lines[brief.dialogue],index:brief.dialogue}),
   nextDialogueEvidence:Object.freeze({...nextLine,index:first.evidenceIndex}),
   nextDialogueQuestion:0,nextQuestionExplanation:first.explanation,
   grammar:Object.freeze(references),focusWord:Object.freeze({...focus,wordKey:word?.key||null,
    ambiguous:readings.length>1}),characters:chars,
   nativeQuestion:brief.question,approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null});
 }).filter(Boolean);
}
// A case only projects original source records and native event history.
export function p76CaseEvidence(state,source){
 if(!source)return null;
 const reading=(state?.readingEvents||[]).filter(e=>e.storyId===source.readingId);
 const original=(state?.dialogueEvents||[]).filter(e=>e.dialogueId===source.dialogueId&&e.question===source.nativeQuestion);
 const next=(state?.dialogueEvents||[]).filter(e=>e.dialogueId===source.nextDialogueId&&e.question===source.nextDialogueQuestion);
 const status=events=>events.length?(events.at(-1).assisted?'assisted':
  events.at(-1).correct?'independent correct':'incorrect'):'not attempted';
 return Object.freeze({reading:Object.freeze({attempts:reading.length,status:status(reading),reviewed:reading.length>0}),
  prior:Object.freeze({attempts:original.length,status:status(original),reviewed:original.length>0,
   everIndependent:original.some(e=>e.correct&&!e.assisted)}),
  followup:Object.freeze({attempts:next.length,status:status(next),reviewed:next.length>0,
   everIndependent:next.some(e=>e.correct&&!e.assisted)})});
}
export function renderP76CaseLab(state,activeId,act,esc){
 const cases=p76Cases(),dialogueEvents=state.dialogueEvents||[],readingEvents=state.readingEvents||[];
 return '<section class="c9-p76-case-lab" aria-label="P76 original paired-source argument laboratory">'+
 '<header><p class="c9-eyebrow">P76 · ORIGINAL ARGUMENT TRANSFER · DEMO_ONLY / UNREVIEWED</p>'+
 '<h2>Trace the claim through three original sources</h2><p>Five reading → negotiation → follow-up evidence sequences. Check each source in the native reader or dialogue; review the attested grammar and vocabulary after recording your source answer. The sources are separately authored, not a verified common transcript.</p></header>'+
 '<div class="c9-p76-case-grid">'+cases.map((c,i)=>{
  const read=readingEvents.filter(e=>e.storyId===c.readingId),talk=dialogueEvents.filter(e=>e.dialogueId===c.dialogueId);
  const progress=p76CaseEvidence(state,c);
  const checked=progress.prior.everIndependent;
  const evidence=(label,row)=>'<div class="c9-p76-source-review"><strong>'+esc(label)+' · source '+(row.index+1)+'</strong>'+
   '<p lang="zh-Hans">'+esc(row.hanzi)+'</p><p>'+esc(row.pinyin)+'</p><p>'+esc(row.english)+'</p></div>';
  return '<article'+(activeId===c.dialogueId?' class="is-current"':'')+'>'+
   '<p class="c9-eyebrow">CASE '+(i+1)+' / '+cases.length+' · '+esc(c.id)+'</p>'+
   '<h3>'+esc(c.title)+'</h3><p><strong>Unsupported claim:</strong> '+esc(c.claim)+'</p>'+
   (progress.reading.reviewed&&progress.prior.reviewed?
    '<p><strong>Source comparison:</strong> '+esc(c.contrast)+'</p>':'')+
   '<p><strong>Writing task:</strong> '+esc(c.task)+'</p>'+
   '<p><strong>Oral rehearsal:</strong> '+esc(c.spoken)+'</p>'+
   '<div class="c9-p76-status" aria-label="Native source evidence status">'+
   '<p>Reading: '+progress.reading.status+' · '+progress.reading.attempts+' attempts</p>'+
   '<p>Negotiation question: '+progress.prior.status+' · '+progress.prior.attempts+' attempts'+
    (checked&&!progress.prior.status.startsWith('independent')?' · earlier independent correct evidence':'')+'</p>'+
   '<p>New-evidence question: '+progress.followup.status+' · '+progress.followup.attempts+' attempts'+
    (progress.followup.everIndependent&&progress.followup.status!=='independent correct'?' · earlier independent correct evidence':'')+'</p></div>'+
   '<div class="c9-p76-case-actions">'+
   act('c9-media-open-dialogue','Check the original conversation question →','c9-button c9-button--primary c9-button--small','data-id="'+esc(c.dialogueId)+'"')+
   (c.nextDialogueId?act('c9-media-open-dialogue','Continue with an original follow-up conversation →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.nextDialogueId)+'"'):'')+
   act('c9-media-open-story','Read separate P71 dossier →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.readingId)+'"')+
   act('c9-p71-open-composition','Compose in the original P43 editor →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.readingId)+'"')+
   '</div><details class="c9-p76-evidence"><summary>Original-source comparison and grammar transfer</summary>'+
   (progress.reading.reviewed?evidence('P71 reading',c.readingEvidence)+
    '<div class="c9-p76-grammar"><strong>Attested grammar in P71</strong>'+
     c.grammar.map(g=>'<div><span lang="zh-Hans">'+esc(g.token)+'</span> · '+esc(g.title)+
      ' · line '+(g.lineIndex+1)+' '+
      act('grammar-select','Study grammar','c9-button c9-button--secondary c9-button--small','data-id="'+esc(g.id)+'"')+'</div>').join('')+
    '<strong>Indexed word: <span lang="zh-Hans">'+esc(c.focusWord.hanzi)+'</span></strong>'+
    (c.focusWord.wordKey?act('lookup-word','Open original Wordbook entry','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.focusWord.wordKey)+'"'):
      '<p>Unindexed or ambiguous written form; no pronunciation or sense guessed.</p>')+
    (c.characters.length?'<div><strong>Original character lessons (shared written characters only)</strong>'+
       c.characters.map(ch=>act('open-lesson','Study '+esc(ch.hanzi)+' · '+esc(ch.pinyin),
        'c9-button c9-button--secondary c9-button--small','data-id="'+esc(ch.id)+'"')).join('')+'</div>':'')+
    '</div>':
    '<p>P71 original evidence withheld until a native reading response is recorded.</p>')+
   (progress.prior.reviewed?evidence('P75 negotiation',c.dialogueEvidence):
    '<p>P75 original evidence withheld until its linked native question is answered.</p>')+
   (progress.followup.reviewed?evidence('P77 changed circumstances',c.nextDialogueEvidence)+
    '<p>'+esc(c.nextQuestionExplanation)+'</p>':
    '<p>P77 follow-up evidence withheld until its first native question is answered.</p>')+
   '<p>These are previously authored source lines for review, not a new score. A prior response does not verify independent listening, language proficiency, or approval. Opening another source may give assistance for a later attempt; use its native assisted controls.</p></details>'+
   '</article>';
 }).join('')+'</div></section>';
}
