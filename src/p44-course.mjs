/** P44 source-owned integrated Mandarin scenarios, original learning-only material.
 * P44 enriches existing P41 reading/P42 listening/P43 self-reviewed writing.
 * The additional short spoken comprehension questions are evaluated ONLY by
 * original DIALOGUES / dialogueEvents; fixed responses by Sentence Workshop.
 * Nothing here creates a new authoritative grade, learner store or HSK claim.
 */
import {P44_SCENARIOS_A} from './p44-scenarios-a.mjs';
import {P44_SCENARIOS_B} from './p44-scenarios-b.mjs';
import {P44_SCENARIOS_C} from './p44-scenarios-c.mjs';
import {P41_PASSAGES} from './p41-readings.mjs';
import {P42_SCENES} from './p42-course.mjs';
import {P43_UNITS} from './p43-course.mjs';

const blocks=[P44_SCENARIOS_A,P44_SCENARIOS_B,P44_SCENARIOS_C]
 .flatMap(group=>group.trim().split(/\n\s*\n/).filter(Boolean));
function parse(block,index){
 const [header,...rest]=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 const [title,theme,readingId,dialogueId,writingId,grammarText,goal,pitfall,revision]=header.split('|');
 const id='p44-'+String(index+1).padStart(2,'0');
 const rows=prefix=>rest.filter(s=>s.startsWith(prefix+'|')).map(s=>s.split('|').slice(1));
 const brief=rows('R').map(([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english}));
 const turns=rows('D').map(([speaker,hanzi,pinyin,english])=>Object.freeze({speaker,hanzi,pinyin,english}));
 const questions=rows('Q').map(([prompt,answer,wrong1,wrong2,evidence,explanation])=>Object.freeze({
  prompt,answer,options:Object.freeze([answer,wrong1,wrong2]),
  evidenceTurn:Number(evidence),explanation
 }));
 const responses=rows('W').map(([hanzi,pinyin,english,purpose])=>Object.freeze({hanzi,pinyin,english,purpose}));
 return Object.freeze({
  id,sequence:index+1,title,theme,readingId,dialogueId,writingId,
  grammarIds:Object.freeze(grammarText.split(',')),
  goal,pitfall,revision,source:'original-p44-authorial',officialHskLevel:null,
  brief:Object.freeze(brief),turns:Object.freeze(turns),
  questions:Object.freeze(questions),responses:Object.freeze(responses),
  sourceReading:P41_PASSAGES.find(p=>p.id===readingId)||null,
  sourceDialogue:P42_SCENES.find(s=>s.id===dialogueId)||null,
  sourceWriting:P43_UNITS.find(u=>u.id===writingId)||null
 });
}
export const P44_SCENARIOS=Object.freeze(blocks.map(parse));
export const findP44Scenario=id=>P44_SCENARIOS.find(s=>s.id===id)||null;
export const P44_PHASES=Object.freeze([
 Object.freeze({id:'read',name:'Read the source',description:'Study the new source message; identify established and unconfirmed facts.'}),
 Object.freeze({id:'listen',name:'Listen and clarify',description:'Listen to original spoken turns before revealing the transcript.'}),
 Object.freeze({id:'understand',name:'Check the evidence',description:'Answer native dialogue questions and examine the exact supporting turn.'}),
 Object.freeze({id:'write',name:'Write and revise',description:'Transfer to native exact-form responses and independent P43 composition.'}),
 Object.freeze({id:'speak',name:'Speak and continue',description:'Retell the situation in your own words without claiming pronunciation grading.'})
]);
export const P44_WRITING_TASKS=Object.freeze(P44_SCENARIOS.flatMap(s=>s.responses.map((line,i)=>Object.freeze({
 id:'p44:'+s.id+':response'+i,kind:'p44-integrated-exact-sentence',
 p44ScenarioId:s.id,p44ResponseIndex:i,hanzi:line.hanzi,pinyin:line.pinyin,english:line.english,
 explanation:line.purpose,pitfall:s.pitfall
}))));
export const p44Evidence=(sceneId,index)=>{
 const s=findP44Scenario(sceneId),q=s?.questions[index];
 return q?Object.freeze({turn:q.evidenceTurn,model:s.turns[q.evidenceTurn],explanation:q.explanation}):null;
};
