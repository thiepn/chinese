/** P75 authored source-owned Mandarin production briefs.
 * Prompts are original English scaffolds anchored to exact P71 manuscript
 * sentences. No model sentence beyond the original source is invented.
 * All free-form text remains exclusively in the original P43 tab-local editor.
 */
const manuscripts=Object.freeze([["Museum exhibit label","Write two Mandarin paragraphs for museum visitors. State what resembles what; distinguish visual similarity from verified authorship; explain why the revised label retains uncertainty.","Give a 40–60 second spoken curator update in Mandarin. Name the initial attribution, what was checked, what evidence is still absent, and the defensible public wording.","Similar river routes alone prove that the same person drew both historical maps.","Do not turn a missing record into proof the two makers differ. Preserve the distinction between an unverified attribution and a disproved attribution.","Visitors to an archival exhibition",2,4,5,7,9],["Community ferry advisory","Draft a two-paragraph Chinese advisory to visitors: separate weather forecasts from the operator's status, explain backup plans and specify when the notice can be updated.","Pretend you are the event organizer. Tell participants in Mandarin what is known, what is only predicted, and how a confirmed operator notice changes the plan.","A windy forecast means the ferry operator has already cancelled the service.","Do not invent the operator's final timetable; the source says that a notice was published, not the particular outcome.","Participants in a weekend island visit",3,4,5,7,9],["School inquiry summary","Write a fair two-paragraph Mandarin school briefing: describe the allegation as an allegation, explain why a direct quotation cannot be verified, and set out the current investigation status.","As the investigating teacher, orally explain in Mandarin why conflicting memories must not be quoted as a transcript and how students may add evidence.","One person's memory provides a verbatim record of the disputed meeting.","Do not conclude that the reported remarks definitely occurred or definitely did not occur. The source withholds that judgment.","Students affected by an ongoing inquiry",1,4,5,7,9],["Library pilot evaluation","Prepare a Chinese briefing for library leadership: report the small trial, name a concrete mobile usability barrier, evaluate why the sample limits wider claims, and recommend a next step.","As a library technician, explain aloud in Mandarin what was reported, what was changed and what needs reassessment before rollout.","Positive feedback from a small pilot proves the entire city supports the new system.","Do not treat a follow-up test as evidence that usability improved; the source records that testing was invited, not its outcome.","Library service and accessibility reviewers",2,3,4,6,9],["Internship schedule clarification","Write a two-paragraph Mandarin clarification to university staff: contrast interview discussion with agreed terms and explain what must be confirmed before a start can be reported.","As the internship applicant, explain aloud in Mandarin which days were suggested, what remains unsigned and why you are checking the agreement before reporting a start.","A possible Tuesday–Thursday schedule discussed in an interview is already a final signed contract.","Do not report that a written offer has been received or a contract signed; the source only describes a requested written reply.","University internship coordination staff",2,5,6,8,9]]);
export function p71ProductionSource(story){
 const source=story?.beginner?.p71;
 if(story?.beginner?.source!=='original-p71'||!source)return null;
 const index=Number(source.id.slice(4))-1,brief=manuscripts[index];
 if(!brief||!Number.isInteger(index)||index<0||index>=manuscripts.length)return null;
 const [title,writing,oral,misconception,revision,audience,...anchors]=brief;
 if(anchors.some(i=>!story.lines[i]))return null;
 return Object.freeze({storyId:story.id,sourceId:source.id,title,writing,oral,
  misconception,revision,audience,
  anchors:Object.freeze(anchors.map((lineIndex)=>Object.freeze({
   lineIndex,hanzi:story.lines[lineIndex].hanzi,
   pinyin:story.lines[lineIndex].pinyin,english:story.lines[lineIndex].english
  }))),
  status:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null});
}
/** Adapter to the ONE existing P43 writing/speaking studio, not new state. */
export function p71WritingUnit(story,existingUnit){
 const brief=p71ProductionSource(story);
 if(!brief||!existingUnit)return null;
 return Object.freeze({...existingUnit,p71Source:true,sourceRefStoryId:story.id,
  title:brief.title+' · '+story.title,stage:3,sequence:Number(story.beginner.p71.id.slice(4)),
  theme:story.theme,goal:brief.writing,sourceClaim:story.lines[2].english,
  misconception:brief.misconception,revision:brief.revision,oral:brief.oral,
  audience:brief.audience,readingId:null,dialogueId:null,
  grammarIds:Object.freeze([...story.beginner.grammarIds]),
  lines:story.lines,sections:Object.freeze([
   {start:0,end:4,title:'Original claim and evidence limits'},
   {start:5,end:9,title:'Qualified conclusion and responsible response'}
  ]),planning:Object.freeze([
   'Address '+brief.audience+' in Mandarin; identify the source situation without inventing facts.',
   'Compare the provisional claim against the exact source evidence and its limitations.',
   'Write a qualified conclusion, consequences and a next action supported by the source.'
  ]),sourceAnchors:brief.anchors,writingBrief:brief.writing
 });
}
