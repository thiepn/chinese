// P31 original vocabulary editorials; enrich canonical keys rather than replacing them.
import {P31_VOCAB_ROWS_A} from './p31-vocabulary-a.mjs';
import {P31_VOCAB_ROWS_B} from './p31-vocabulary-b.mjs';
export const P31_VOCABULARY=Object.freeze([...P31_VOCAB_ROWS_A,...P31_VOCAB_ROWS_B].map(r=>Object.freeze({
 hanzi:r[0],pinyin:r[1],meaning:r[2],note:r[3],
 examples:Object.freeze(r[4].map(x=>Object.freeze({hanzi:x[0],pinyin:x[1],english:x[2]}))),
 collocations:Object.freeze([...r[5]]),origin:'original-authorial-p31',officialHskLevel:null
})));