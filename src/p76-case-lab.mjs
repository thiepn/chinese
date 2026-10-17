/** P76: five original paired-source evidence case labs.
 * The reading and dialogue are separately authored educational texts. The
 * comparisons below are explicit instructional prompts, not shared testimony.
 * All answers are delegated to original dialogue and reading graders.
 */
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
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
  if(!reading||!dialogue||!reading.lines[brief.reading]||!dialogue.lines[brief.dialogue]||!dialogue.questions[brief.question])return null;
  return Object.freeze({id:'p76-case-'+String(i+1).padStart(2,'0'),readingId:reading.id,dialogueId:dialogue.id,
   title:dialogue.title,claim:brief.claim,task:brief.task,spoken:brief.spoken,contrast:brief.contrast,
   readingEvidence:Object.freeze({...reading.lines[brief.reading],index:brief.reading}),
   dialogueEvidence:Object.freeze({...dialogue.lines[brief.dialogue],index:brief.dialogue}),
   nativeQuestion:brief.question,approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null});
 }).filter(Boolean);
}
export function renderP76CaseLab(state,activeId,act,esc){
 const cases=p76Cases(),dialogueEvents=state.dialogueEvents||[],readingEvents=state.readingEvents||[];
 return '<section class="c9-p76-case-lab" aria-label="P76 original paired-source argument laboratory">'+
 '<header><p class="c9-eyebrow">P76 · ORIGINAL ARGUMENT TRANSFER · DEMO_ONLY / UNREVIEWED</p>'+
 '<h2>Challenge the claim across two separate sources</h2><p>Five original evidence comparisons: identify an unsupported inference, check the original reading and a separately authored conversation, then write and rehearse a defensible Mandarin response. These are thematic comparisons, not a single historical record. Answers and progress stay with the original source owners; written and oral responses are not scored.</p></header>'+
 '<div class="c9-p76-case-grid">'+cases.map((c,i)=>{
  const read=readingEvents.filter(e=>e.storyId===c.readingId),talk=dialogueEvents.filter(e=>e.dialogueId===c.dialogueId);
  const checked=talk.some(e=>e.question===c.nativeQuestion&&e.correct&&!e.assisted);
  return '<article'+(activeId===c.dialogueId?' class="is-current"':'')+'>'+
   '<p class="c9-eyebrow">CASE '+(i+1)+' / '+cases.length+' · '+esc(c.id)+'</p>'+
   '<h3>'+esc(c.title)+'</h3><p><strong>Unsupported claim:</strong> '+esc(c.claim)+'</p>'+
   '<p><strong>Source comparison:</strong> '+esc(c.contrast)+'</p>'+
   '<p><strong>Writing task:</strong> '+esc(c.task)+'</p>'+
   '<p><strong>Oral rehearsal:</strong> '+esc(c.spoken)+'</p>'+
   '<p class="c9-p76-status">Reading: '+read.length+' original answer attempts · Conversation: '+talk.length+
   ' original answer attempts · Target dialogue question: '+(checked?'independently correct observed':'not independently confirmed')+
   '. Neither number establishes listening, writing or speaking proficiency.</p>'+
   '<div class="c9-p76-case-actions">'+
   act('c9-p76-native-question','Check the original conversation question →','c9-button c9-button--primary c9-button--small','data-id="'+esc(c.dialogueId)+'" data-question="'+c.nativeQuestion+'"')+
   act('c9-media-open-story','Read separate P71 dossier →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.readingId)+'"')+
   act('c9-p71-open-composition','Compose in the original P43 editor →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(c.readingId)+'"')+
   '</div><details><summary>Reveal exact source evidence · assisted study</summary>'+
   '<p>Reading sentence '+(c.readingEvidence.index+1)+'</p><p lang="zh-Hans">'+esc(c.readingEvidence.hanzi)+'</p><small>'+esc(c.readingEvidence.pinyin)+'</small><p>'+esc(c.readingEvidence.english)+'</p>'+
   '<p>Separate conversation turn '+(c.dialogueEvidence.index+1)+'</p><p lang="zh-Hans">'+esc(c.dialogueEvidence.hanzi)+'</p><small>'+esc(c.dialogueEvidence.pinyin)+'</small><p>'+esc(c.dialogueEvidence.english)+'</p>'+
   '<p>Source help is for study, not independent assessment. Opening the original conversation starts its own source-owned assessment.</p></details>'+
   '</article>';
 }).join('')+'</div></section>';
}
