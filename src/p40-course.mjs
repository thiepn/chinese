/** P40 original intermediate-targeted grammar (authorial lessons, not official HSK items).
 * Append only after g94. Canonical GRAMMAR_LESSONS and Sentence Workshop remain
 * the sole grammar lesson, answer evaluation and production history authorities.
 */
import {P40_GRAMMAR_A} from './p40-grammar-a.mjs';
import {P40_GRAMMAR_B} from './p40-grammar-b.mjs';
import {P40_GRAMMAR_C} from './p40-grammar-c.mjs';
const splitSample=s=>s.split('~');
function unpack(line,i){
 const fields=line.split('|');
 const [title,chapter,pattern,explanation,contrast,pitfall,anchor,choice,incorrect,first,second,transfer]=fields;
 const [correct,...distractors]=choice.split('~');
 const [prompt,hanzi,pinyin,english,chunks]=transfer.split('~');
 const model=splitSample(first);
 const from=model[0].indexOf(correct);
 const masked=from<0?model[0]:model[0].slice(0,from)+'____'+model[0].slice(from+correct.length);
 return Object.freeze({
   id:'g'+(95+i),title,chapter,pattern,explanation,contrast,pitfall,anchor,
   correct,distractors:Object.freeze(distractors),incorrect,
   exampleA:Object.freeze(model),exampleB:Object.freeze(splitSample(second)),
   cloze:Object.freeze([masked,correct,...distractors,...model]),
   transfer:Object.freeze([prompt,hanzi,pinyin,english,Object.freeze(chunks.split('/'))])
 });
}
const all=[P40_GRAMMAR_A,P40_GRAMMAR_B,P40_GRAMMAR_C].flatMap(x=>x.trim().split('\n').filter(Boolean));
export const P40_AUTHORIAL_LESSONS=Object.freeze(all.map(unpack));
export const P40_GRAMMAR_IDS=Object.freeze(P40_AUTHORIAL_LESSONS.map(x=>x.id));
export const P40_GRAMMAR_ROWS=Object.freeze(P40_AUTHORIAL_LESSONS.map(x=>Object.freeze([
 x.id,x.chapter,x.title,x.pattern,x.explanation,x.contrast,x.pitfall,x.anchor,
 x.exampleA,x.exampleB,x.cloze,x.transfer
])));
/** These examples are less suitable for an explicit intended message; they
 * are not represented as universally ungrammatical in every possible context.
 */
export const P40_REPAIR_CASES=Object.freeze(P40_AUTHORIAL_LESSONS.map(x=>Object.freeze({
 id:'p40:fix:'+x.id,taskId:'p40:fix:'+x.id,grammarId:x.id,title:x.title,incorrect:x.incorrect,
 intendedMeaning:x.transfer[3],correct:Object.freeze({
 hanzi:x.transfer[1],pinyin:x.transfer[2],english:x.transfer[3]}),
 contrast:x.contrast,pitfall:x.pitfall,explanation:x.explanation
})));
export const P40_CORRECTION_TASKS=Object.freeze(P40_REPAIR_CASES.map(r=>Object.freeze({
 id:r.taskId,p40Correction:true,grammarId:r.grammarId,grammarTitle:r.title,kind:'p40-grammar-correction',
 english:'Rewrite for the stated meaning: '+r.incorrect+' Intended meaning: '+r.intendedMeaning,
 hanzi:r.correct.hanzi,pinyin:r.correct.pinyin,incorrect:r.incorrect,
 explanation:r.explanation,contrast:r.contrast,pitfall:r.pitfall
})));
export const p40RepairFor=id=>P40_REPAIR_CASES.find(r=>r.grammarId===id)||null;
/** Precise association for all 90 original source lines; the Sentence Library
 * retains its own append-only IDs, scoring, and canonical original author authority.
 */
export const P40_SENTENCE_GRAMMAR_IDS=Object.freeze(P40_AUTHORIAL_LESSONS.flatMap(x=>[x.id,x.id,x.id]));
const sentenceRows=P40_AUTHORIAL_LESSONS.flatMap(x=>[x.exampleA,x.exampleB,x.transfer.slice(1,4)]);
const names=[
 ['Affected objects and recipients','Actions','describe object outcomes and contrast agency'],
 ['Parallel and ordered events','Actions','distinguish simultaneous, immediate and delayed events'],
 ['Correlated change and concession','Planning','express increasing degrees and counterexpectation'],
 ['Additions and sufficient conditions','Communication','combine claims and distinguish logical sufficiency'],
 ['Necessary and robust conditions','Communication','separate necessary from sufficient and hypothetical statements'],
 ['Premises, goals and formal consequences','Planning','give motivations and justify recommendations'],
 ['Topics, evidence and procedures','Study','identify topic, evidence and governing instructions'],
 ['Perspectives and consequences','Communication','express who is affected and highlight surprising facts'],
 ['Focus and newly discovered information','Daily life','focus a known event and correct a prior expectation']
];
export const P40_SENTENCE_TOPICS=Object.freeze(names.map((g,i)=>Object.freeze([
 'P40 · '+g[0],g[1],g[2],3,
 Object.freeze([...new Set(P40_SENTENCE_GRAMMAR_IDS.slice(i*10,i*10+10))]),
 Object.freeze(sentenceRows.slice(i*10,i*10+10).map(x=>Object.freeze([...x])))
])));
