/** Written-pinyin guidance for demonstration teaching. Not audio or spoken pronunciation scoring. */
import {parsePinyin} from './exercises.mjs';
const contours=Object.freeze({0:{name:'neutral',cue:'short and unstressed; its pitch depends on context'},1:{name:'first',cue:'high and level'},2:{name:'second',cue:'rising toward a higher pitch'},3:{name:'third',cue:'low/dipping in citation form; often low before another non-third syllable'},4:{name:'fourth',cue:'firmly falling'}});
export function pronunciationPath(pinyin){const parsed=parsePinyin(pinyin);if(!parsed||!parsed.length)return null;
 return {syllables:parsed.map((p,index)=>({index:index+1,syllable:p.syllable,tone:p.tone,...contours[p.tone]})),advice:'These are lexical tone labels for written Pinyin. Connected-speech changes (including third-tone sandhi) and speaker-specific pitch must be learned from verified audio; this demo does not judge your spoken voice.'};
}
export function pronunciationRemedy(reference,reason){const guide=pronunciationPath(reference);if(!guide)return 'Check the approved written pinyin reference.';
 if(reason==='tone')return 'Compare the contour of each mismatched lexical tone, then rewrite the full pinyin with tone marks or digits 1–5. Do not treat typed-tone correctness as a speaking assessment.';
 if(reason==='syllables')return 'First check the consonants, vowels and syllable boundaries. Only then compare the lexical tones.';
 return 'Read the character within its complete word or sentence, then attempt independent recall without the visible annotation.';
}
