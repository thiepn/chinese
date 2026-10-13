/** P39 original HSK 3-targeted (not officially aligned) intermediate language source.
 * Append-only after P35 demo-272. No externally licensed/official HSK inventory.
 */
import {P39_ROWS_A} from './p39-rows-a.mjs';
import {P39_ROWS_B} from './p39-rows-b.mjs';
function row(line,i){
 const [hanzi,pinyin,meaning,category,wordText,exampleText,explanation,pitfall]=line.split('|');
 const words=wordText.split(/;(?=[\p{Script=Han}]+~)/u).map(s=>s.split('~')).map(([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english}));
 const examples=exampleText.split(';').map(s=>s.split('~')).map(([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english}));
 return Object.freeze({id:'demo-'+(273+i),order:273+i,sequence:i+1,hanzi,pinyin,meaning,category,words:Object.freeze(words),examples:Object.freeze(examples),
   explanation,pitfall,pronunciation:'Read '+hanzi+' as '+pinyin+' in these expressions; attend to the tone and to unstressed syllables in the complete word.',
   grammarTitle:'Contrast: '+words.map(w=>w.hanzi).join(' / '),
   grammarPattern:words.map(w=>w.hanzi).join(' · '),
   grammarExplanation:explanation+' '+pitfall,
   officialHskLevel:null,source:'original-p39-authorial'});
}
export const P39_CHARACTER_GUIDES=Object.freeze((P39_ROWS_A+'\n'+P39_ROWS_B).trim().split('\n').filter(Boolean).map(row));
export const P39_THEMES=Object.freeze([...new Set(P39_CHARACTER_GUIDES.map(g=>g.category))]);
export const P39_CHARACTER_ROWS=Object.freeze(P39_CHARACTER_GUIDES.map(g=>Object.freeze([
 g.hanzi,g.pinyin,g.meaning,g.explanation,Object.freeze(g.words.map(w=>[w.hanzi,w.pinyin,w.english])),
 [g.examples[0].hanzi,g.examples[0].pinyin,g.examples[0].english],
 [g.examples[1].hanzi,g.examples[1].pinyin,g.examples[1].english],
 g.grammarTitle,g.grammarPattern,g.grammarExplanation,g.pitfall,g.pronunciation
])));
const idIndex=new Map(P39_CHARACTER_GUIDES.map(g=>[g.id,g]));
const charIndex=new Map(P39_CHARACTER_GUIDES.map(g=>[g.hanzi,g]));
export const findP39Guide=id=>idIndex.get(id)||charIndex.get(id)||null;
export function nextP39Guide(state,theme='all',after=null){
 const pool=P39_CHARACTER_GUIDES.filter(g=>theme==='all'||g.category===theme);
 const i=pool.findIndex(g=>g.id===after);
 return [...pool.slice(i+1),...pool.slice(0,i+1)].find(g=>!(state.learned||[]).includes(g.id))||pool[0]||null;
}
/** An editorial vocabulary card requires actual original sentence evidence;
 * words without their own sample remain available in canonical character word families.
 */
const vocab=new Map();
for(const g of P39_CHARACTER_GUIDES)for(const w of g.words){
 const key=w.hanzi+'|'+w.pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[\s'’-]/g,'');
 const examples=g.examples.filter(s=>s.hanzi.includes(w.hanzi));
 if(!examples.length)continue;
 if(!vocab.has(key))vocab.set(key,{key,hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.english,examples:[],lessonIds:[],notes:[],collocations:[]});
 const record=vocab.get(key);
 if(!record.lessonIds.includes(g.id))record.lessonIds.push(g.id);
 if(!record.notes.includes(g.explanation))record.notes.push(g.explanation);
 if(!record.notes.includes(g.pitfall))record.notes.push(g.pitfall);
 for(const x of examples)if(!record.examples.some(e=>e.hanzi===x.hanzi))record.examples.push(x);
 for(const related of g.words.map(x=>x.hanzi).filter(x=>x!==w.hanzi))if(!record.collocations.includes(related))record.collocations.push(related);
}
export const P39_VOCABULARY=Object.freeze([...vocab.values()].map(v=>Object.freeze({
 ...v,examples:Object.freeze(v.examples),lessonIds:Object.freeze(v.lessonIds),notes:Object.freeze(v.notes),collocations:Object.freeze(v.collocations),
 source:'original-p39',officialHskLevel:null
})));
export const P39_WRITING_TASKS=Object.freeze(P39_CHARACTER_GUIDES.flatMap(g=>g.examples.map((s,i)=>Object.freeze({
 id:'p39:'+g.id+':line'+(i+1),kind:'p39-intermediate-writing',p39LessonId:g.id,
 hanzi:s.hanzi,pinyin:s.pinyin,english:s.english,explanation:g.explanation,misconception:g.pitfall
}))));
/** The established Sentence Library uses append-only ten-slot topic numbers.
 * Final topic contains two sentences and leaves eight unused slots; no older ID changes.
 */
export const P39_SENTENCE_TOPICS=Object.freeze(Array.from({length:Math.ceil(P39_CHARACTER_GUIDES.length/5)},(_,i)=>{
 const guides=P39_CHARACTER_GUIDES.slice(i*5,i*5+5);
 return Object.freeze(['P39 · '+guides[0].category+' · '+(i+1),guides[0].category,
 'transfer intermediate character meanings into complete contextual Mandarin sentences',3,['g37'],
 Object.freeze(guides.flatMap(g=>g.examples.map(s=>Object.freeze([s.hanzi,s.pinyin,s.english]))))]);
}));
