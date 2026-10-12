/** Deterministic demo exercise generator and conservative evaluation. Does not make HSK claims. */
import { DEMO_LESSONS } from './demo-lessons.mjs';
const marks={ā:['a',1],á:['a',2],ǎ:['a',3],à:['a',4],ē:['e',1],é:['e',2],ě:['e',3],è:['e',4],ī:['i',1],í:['i',2],ǐ:['i',3],ì:['i',4],ō:['o',1],ó:['o',2],ǒ:['o',3],ò:['o',4],ū:['u',1],ú:['u',2],ǔ:['u',3],ù:['u',4],ǖ:['v',1],ǘ:['v',2],ǚ:['v',3],ǜ:['v',4],ü:['v',0],ń:['n',2],ň:['n',3],ǹ:['n',4]};
const initials=['zh','ch','sh','b','p','m','f','d','t','n','l','g','k','h','j','q','x','r','z','c','s','y','w',''];
const finals=['iang','iong','uang','ueng','ang','eng','ing','ong','iao','ian','uan','uen','uai','uei','ao','ai','ei','ou','ia','ie','iu','in','un','ui','ua','uo','ue','ve','an','en','er','uo','a','o','e','i','u','v','m','n','ng'];
const syllables=new Set(initials.flatMap(i=>finals.map(f=>i+f)));
// Less common syllables are safe for input matching, while invented syllables are rejected.
for(const special of ['zhi','chi','shi','ri','zi','ci','si','yuan','yun','yue','yin','ying','wu','yi','you','ye','ya','yo','yong','yong','wen','wang','weng','nue','lue','lv','nv','hm'])syllables.add(special);
function cleanPinyin(text){let base='',tones=new Map(),digits=new Map();for(const ch of String(text).trim().toLowerCase().replaceAll('u:','v')){
 const current=marks[ch];if(current){if(current[1])tones.set(base.length,current[1]);base+=current[0];}
 else if(ch==='v'||/[a-z]/.test(ch))base+=ch;
 else if(/[1-5]/.test(ch))digits.set(base.length,Number(ch));
 else if(/[\s'’\-·]/.test(ch)){base+='|';}
 else return null;
}return {base,tones,digits};}
export function parsePinyin(text){const src=cleanPinyin(text);if(!src)return null;const parts=src.base.split('|');let offset=0,output=[];
 for(const part of parts){if(!part){offset++;continue}const memo=new Map();function solve(pos){if(pos===part.length)return [];
  if(memo.has(pos))return memo.get(pos);const results=[];
  for(let end=pos+1;end<=part.length;end++){
   const syllable=part.slice(pos,end);if(!syllables.has(syllable))continue;
   const start=offset+pos,stop=offset+end;
   const accents=[...src.tones].filter(([i])=>i>=start&&i<stop);
   const digit=src.digits.get(stop);
   if(accents.length>1||(accents.length&&digit&&digit!==accents[0][1]))continue;
   if([...src.digits.keys()].some(i=>i>start&&i<stop))continue;
   // A numeral at another boundary inside the candidate must not be consumed.
   const tone=accents.length?accents[0][1]:(digit||5);
   const tail=solve(end);if(tail)results.push([{syllable,tone},...tail]);
  }
  // Prefer a valid analysis using the fewest syllables; explicit tone boundaries win ties.
  results.sort((a,b)=>a.length-b.length);const result=results[0]||null;memo.set(pos,result);return result;
 }const parsed=solve(0);if(!parsed)return null;output.push(...parsed);offset+=part.length+1;}
 return output.length?output:null;
}
export function normalizeMeaning(text){return String(text).normalize('NFKC').toLowerCase().replace(/[’']/g,"'").replace(/[^\p{L}\p{N}'\s]/gu,' ').replace(/\s+/g,' ').trim().replace(/^(to |a |an |the )/,'');}
export function evaluateMeaning(input,reference){const got=normalizeMeaning(input);if(!got)return {correct:false,reason:'empty',message:'Enter an answer before checking.'};
 const meanings=String(reference).split(/;|\/(?!\/)/).map(normalizeMeaning).filter(Boolean);
 const correct=meanings.some(m=>m===got);return {correct,reason:correct?'correct':'meaning',message:correct?'Meaning accepted.':'The meaning does not match the approved demo answers. Review the reference.'};}
export function evaluatePinyin(input,reference){const got=parsePinyin(input),want=parsePinyin(reference);
 if(!got)return {correct:false,reason:'format',message:'Use tone-marked pinyin or numbers (for example, nǐ or ni3).'};
 if(!want)return {correct:false,reason:'source',message:'Reference pinyin cannot be checked; this prompt is unavailable.'};
 const gText=got.map(s=>s.syllable).join(''),wText=want.map(s=>s.syllable).join('');
 if(gText!==wText)return {correct:false,reason:'syllables',message:'The syllable spelling is different. Check consonants and vowels.'};
 const gs=got.map(s=>s.syllable+':'+s.tone),ws=want.map(s=>s.syllable+':'+s.tone);
 const correct=gs.length===ws.length&&gs.every((s,i)=>s===ws[i]);
 return {correct,reason:correct?'correct':'tone',message:correct?'Pinyin and tones accepted.':'The syllable sounds match, but at least one tone or syllable boundary differs.'};
}
export function evaluateAnswer(input,reference,kind){if(kind==='pinyin')return evaluatePinyin(input,reference);if(kind==='choice')return {correct:String(input)===String(reference),reason:String(input)===String(reference)?'correct':'choice',message:String(input)===String(reference)?'Correct interpretation.':'That was not the intended interpretation.'};return evaluateMeaning(input,reference);}
function seededShuffle(arr,seed){const out=[...arr];let n=[...String(seed)].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,17);for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
export function makeOptions(correct,mode,lessonId,count=4){const pool=DEMO_LESSONS.flatMap(l=>mode==='sentence'?[l.sentence.english]:l.words.map(w=>w.english));const choices=[correct];for(const value of seededShuffle([...new Set(pool)],`${lessonId}:${mode}`)){if(value!==correct&&!choices.includes(value)&&choices.length<count)choices.push(value)}return seededShuffle(choices,`${lessonId}:${mode}:order`);}
export function makeCloze(lesson){const matched=lesson.words.find(w=>lesson.sentence.hanzi.includes(w.hanzi))||null; if(!matched)return null;
 const index=lesson.sentence.hanzi.indexOf(matched.hanzi);
 const options=seededShuffle([matched.hanzi,...DEMO_LESSONS.flatMap(l=>l.words).map(w=>w.hanzi).filter(w=>w!==matched.hanzi&&!lesson.sentence.hanzi.includes(w)).slice(0,16)].slice(0,4),`${lesson.id}:cloze`);
 return {prompt:lesson.sentence.hanzi.slice(0,index)+'＿＿'+lesson.sentence.hanzi.slice(index+matched.hanzi.length),answer:matched.hanzi,options};}
