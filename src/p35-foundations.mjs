/** P35 authorial elementary character/vocabulary syllabus, not official HSK 3.0.
 * Append-only: demo-203 … demo-272. Source sentences are authored in each
 * character row and shared with the existing canonical word/course systems.
 */
import {P35_CHARACTERS_A} from './p35-character-a.mjs';
import {P35_CHARACTERS_B} from './p35-character-b.mjs';
import {P35_CHARACTERS_C} from './p35-character-c.mjs';
import {P35_CHARACTERS_D} from './p35-character-d.mjs';
import {P35_EXTRA_A} from './p35-example-a.mjs';
import {P35_EXTRA_B} from './p35-example-b.mjs';
const raw=Object.freeze([...P35_CHARACTERS_A,...P35_CHARACTERS_B,...P35_CHARACTERS_C,...P35_CHARACTERS_D]);
const furtherExamples=[...P35_EXTRA_A,...P35_EXTRA_B];
const category=i=>i<11?'People & communication':i<17?'Time & scheduling':
 i<22?'Sequence & arrangements':i<32?'Transport & directions':i<41?'Independent study':
 i<52?'Services & health':i<62?'Shopping & choices':'Feelings & nuance';
export const P35_CHARACTER_ROWS=Object.freeze(raw.map(r=>Object.freeze([
 r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9]
])));
export const P35_CHARACTER_GUIDES=Object.freeze(raw.map((r,i)=>Object.freeze({
 id:'demo-'+(203+i),sequence:i+1,hanzi:r[0],pinyin:r[1],meaning:r[2],
 category:category(i),explanation:r[3],grammarTitle:r[7],grammarPattern:r[8],
 grammarExplanation:r[9],pitfall:r[10],pronunciation:r[11],
 words:Object.freeze(r[4].map(w=>Object.freeze({hanzi:w[0],pinyin:w[1],english:w[2]}))),
 examples:Object.freeze([r[5],r[6],furtherExamples[i]].map(s=>Object.freeze({hanzi:s[0],pinyin:s[1],english:s[2]}))),
 officialHskLevel:null,source:'original-p35-authorial'
})));
export const P35_THEMES=Object.freeze([...new Set(P35_CHARACTER_GUIDES.map(g=>g.category))]);
const byId=new Map(P35_CHARACTER_GUIDES.map(g=>[g.id,g]));
const byChar=new Map(P35_CHARACTER_GUIDES.map(g=>[g.hanzi,g]));
export const findP35Guide=ref=>byId.get(ref)||byChar.get(ref)||null;
export const nextP35Guide=(state,theme='all',fromId=null)=>{
 const pool=P35_CHARACTER_GUIDES.filter(g=>theme==='all'||theme===g.category);
 const start=pool.findIndex(g=>g.id===fromId);
 return [...pool.slice(start+1),...pool.slice(0,start+1)].find(g=>!(state.learned||[]).includes(g.id))||pool[0]||null;
};
export const P35_WRITING_TASKS=Object.freeze(P35_CHARACTER_GUIDES.flatMap(g=>g.examples.map((s,i)=>Object.freeze({
 id:'p35:'+g.id+':line'+(i+1),kind:'p35-character-production',p35LessonId:g.id,
 hanzi:s.hanzi,pinyin:s.pinyin,english:s.english,explanation:g.grammarExplanation,
 misconception:g.pitfall
}))));
