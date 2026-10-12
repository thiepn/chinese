/** Specific, non-acoustic feedback on written Pinyin; does not claim speech recognition. */
import {parsePinyin,evaluatePinyin} from './exercises.mjs';
const LABELS=Object.freeze(['neutral','first (level)','second (rising)','third (low/dipping)','fourth (falling)','neutral']);
export function toneExplanation(response,reference){
 // Only full-sentence practice permits separating punctuation. Isolated target input
 // such as 'ni3?' remains invalid under the original strict syllable contract.
 const sentencePinyin=text=>/\s/.test(text)?text.replace(/[,.?!。，？！;；:：]/gu,' '):text;
 response=sentencePinyin(response);reference=sentencePinyin(reference);
 const core=evaluatePinyin(response,reference);
 if(core.correct)return {...core,detail:'Every syllable and lexical tone matches the reference. This checks typed pinyin, not spoken pronunciation.'};
 const got=parsePinyin(response),want=parsePinyin(reference);
 if(!got||!want)return {...core,detail:core.reason==='source'?'This reference cannot be assessed.': 'Use full pinyin syllables with tone marks or numbers 1–5.'};
 let mismatched=got.findIndex((s,i)=>!want[i]||s.syllable!==want[i].syllable);
 if(mismatched===-1&&got.length!==want.length)mismatched=Math.min(got.length,want.length);
 if(mismatched>=0){const a=got[mismatched],b=want[mismatched];const cue=a&&!b?'Remove the extra syllable.':!a&&b?'Add the missing syllable.':'Compare the initial consonant and final vowel(s) before adjusting the tone.';return {...core,reason:'syllables',detail:`Syllable ${mismatched+1}: ${a?.syllable??'missing'} does not match ${b?.syllable??'extra'}. ${cue} Typed pinyin feedback does not analyze speech.`};}
 const at=got.findIndex((s,i)=>s.tone!==want[i].tone);
 if(at!==-1){const thirdSandhi=want[at].tone===3&&want[at+1]?.tone===3?' For adjacent third tones, spoken contours may change; this typed exercise checks the lexical-tone reference.':'';return {...core,reason:'tone',detail:`Syllable ${at+1} (${want[at].syllable}): you entered ${LABELS[got[at].tone]||'unknown'} tone; the reference uses ${LABELS[want[at].tone]||'unknown'} tone. Compare the contour before retrying.${thirdSandhi}`};}
 return {...core,detail:core.message};
}
export function toneContrast(reference){const parts=parsePinyin(reference);if(!parts)return null;
 return parts.map((s,i)=>`${i+1}. ${s.syllable} — ${LABELS[s.tone]}`).join(' · ');
}

/** A teaching sequence for typed lexical-tone repair, never acoustic pronunciation scoring. */
export function toneRepairSteps(response,reference){
 const r=toneExplanation(response,reference),words=parsePinyin(reference);
 if(!words)return {status:'unavailable',steps:['This pronunciation reference needs editorial correction.'],evidence:r};
 if(r.correct)return {status:'correct',steps:['All reference syllables and lexical tones match the typed answer.','Continue with the complete word in a sentence.'],evidence:r};
 return {status:r.reason==='tone'?'tone':'syllables',steps:[r.detail,`Read the complete word: ${reference}.`,`Practice syllables in context: ${toneContrast(reference)}.`,'Try the complete word again without looking at the reference.'],evidence:r};
}
