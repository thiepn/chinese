/** P36 HSK 2-targeted authorial grammar sources, not official syllabus data.
 * Existing grammar engine remains sole question and grading authority.
 * Grammar IDs g65–g94 are append-only following the P32 g37–g64 content.
 */
import {P36_GRAMMAR_A} from './p36-grammar-a.mjs';
import {P36_GRAMMAR_B} from './p36-grammar-b.mjs';
import {P36_GRAMMAR_C} from './p36-grammar-c.mjs';
const sources=[...P36_GRAMMAR_A,...P36_GRAMMAR_B,...P36_GRAMMAR_C];
export const P36_GRAMMAR_IDS=Object.freeze(sources.map((_,i)=>'g'+(65+i)));
export const P36_GRAMMAR_ROWS=Object.freeze(sources.map((r,i)=>{
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,
 exampleA,exampleB,correct,distractors,incorrect,transfer]=r;
 const model=exampleA[0],place=model.indexOf(correct);
 const masked=place<0?model:model.slice(0,place)+'____'+model.slice(place+correct.length);
 const cloze=[masked,correct,...distractors,...exampleA];
 return Object.freeze(['g'+(65+i),chapter,title,pattern,explanation,contrast,pitfall,
 anchor,Object.freeze([...exampleA]),Object.freeze([...exampleB]),
 Object.freeze(cloze),Object.freeze([transfer[0],...transfer.slice(1,4),[...transfer[4]]])]);
}));
/** A wrong answer is tied to the explicitly stated meaning, not a verdict
 * that the Chinese string is always ungrammatical in any possible discourse.
 */
export const P36_REPAIR_CASES=Object.freeze(sources.map((r,i)=>{
 const id='g'+(65+i),model=r[12];
 return Object.freeze({
 id:'p36:fix:'+id,taskId:'p36:fix:'+id,grammarId:id,title:r[0],
 incorrect:r[11],intendedMeaning:model[3],correct:Object.freeze({
 hanzi:model[1],pinyin:model[2],english:model[3]
 }),contrast:r[4],pitfall:r[5],explanation:r[3]
 });
}));
export const P36_CORRECTION_TASKS=Object.freeze(P36_REPAIR_CASES.map(r=>Object.freeze({
 id:r.taskId,p36Correction:true,grammarId:r.grammarId,grammarTitle:r.title,
 kind:'p36-grammar-correction',
 english:'Repair for the stated context: '+r.incorrect+' Target meaning: '+r.intendedMeaning,
 hanzi:r.correct.hanzi,pinyin:r.correct.pinyin,
 incorrect:r.incorrect,explanation:r.explanation,contrast:r.contrast,pitfall:r.pitfall
})));
export const p36RepairFor=id=>P36_REPAIR_CASES.find(r=>r.grammarId===id)||null;
