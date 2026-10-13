/** P42 intermediate-targeted authorial Mandarin dialogues.
 * These are original scripts offered via the existing device speech synthesis,
 * not recordings, speech recognition, officially licensed HSK materials or
 * authenticated language proficiency ratings.
 */
import {P42_DIALOGUE_A} from './p42-dialogues-a.mjs';
import {P42_DIALOGUE_B} from './p42-dialogues-b.mjs';
import {P42_DIALOGUE_C} from './p42-dialogues-c.mjs';
const source=[P42_DIALOGUE_A,P42_DIALOGUE_B,P42_DIALOGUE_C]
 .flatMap(content=>content.trim().split(/\n\s*\n/).filter(Boolean));
function makeScene(block,i){
 const [header,...body]=block.split('\n').filter(Boolean);
 const [title,theme,goal,teaching,contrast,pitfall,grammar,word,oral]=header.split('|');
 const [hanzi,pinyin,english]=word.split('~');
 const turns=body.filter(s=>s.startsWith('A|')||s.startsWith('B|'))
   .map(line=>Object.freeze(line.split('|')));
 const details=body.filter(s=>s.startsWith('Q|')).map(x=>{
  const [prompt,answer,wrongA,wrongB,evidence,explanation]=x.slice(2).split('|');
  return Object.freeze({prompt,answer,wrong:Object.freeze([wrongA,wrongB]),
   evidenceIndex:Number(evidence),explanation});
 });
 const id='p42-'+String(i+1).padStart(2,'0');
 const vocabulary=Object.freeze({hanzi,pinyin,english});
 return Object.freeze({id,sequence:i+1,title,theme,goal,teaching,contrast,pitfall,
  grammarIds:Object.freeze(grammar.split(',')),vocabulary,oral,
  turns:Object.freeze(turns),questions:Object.freeze(details),
  evidenceIndex:details[0].evidenceIndex,
  source:'original-p42-authorial',officialHskLevel:null});
}
export const P42_SCENES=Object.freeze(source.map(makeScene));
export const findP42Scene=id=>P42_SCENES.find(s=>s.id===id)||null;
export const P42_THEMES=Object.freeze([...new Set(P42_SCENES.map(s=>s.theme))]);
/** Two independently authored production prompts per scene reuse the existing
 * canonical Sentence Workshop exact-reconstruction writer and event IDs. */
export const P42_WRITING_TASKS=Object.freeze(P42_SCENES.flatMap(scene=>
 [3,7].map(turn=>{
 const [speaker,hanzi,pinyin,english]=scene.turns[turn];
 return Object.freeze({id:'p42:'+scene.id+':turn'+turn,
  kind:'p42-intermediate-spoken-to-writing',p42SceneId:scene.id,p42Turn:turn,
  sceneTitle:scene.title,speaker,hanzi,pinyin,english,
  explanation:scene.teaching,contrast:scene.contrast,pitfall:scene.pitfall,
  prompt:'Listen to Speaker '+speaker+' and reconstruct the entire turn from memory.'});
})));
/** A separate source-only lookup for evidence-specific learner explanations;
 * no new learner-state writer, microphone recordings or scores. */
export const p42Evidence=(sceneId,questionIndex)=>{
 const scene=findP42Scene(sceneId),q=scene?.questions[questionIndex];
 return scene&&q?Object.freeze({turn:q.evidenceIndex,model:scene.turns[q.evidenceIndex],
  reason:q.explanation,contrast:scene.contrast,pitfall:scene.pitfall}):null;
};
