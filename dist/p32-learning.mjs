/** P32 sentence-repair teaching uses the existing Workshop attempt writer.
 * Mistake descriptions are deliberately targeted. Some alternative Chinese
 * strings could be grammatical in another discourse, so this checks a
 * specified intended meaning and taught model rather than all valid Chinese.
 */
import {P32_GRAMMAR_ROWS_A} from './p32-grammar-a.mjs';
import {P32_GRAMMAR_ROWS_B} from './p32-grammar-b.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
const rows=[...P32_GRAMMAR_ROWS_A,...P32_GRAMMAR_ROWS_B];
const mistakes=[
 "妈妈午饭以后是喝茶。", // g37: unnecessary copula with action
 "我明天看书在图书馆。", // g38: place after action
 "我妹妹是很学生。", // g39: adjective before noun category
 "我弟弟是高。", // g40: predicate adjective
 "我是有两本词典。", // g41: is versus have
 "爸爸不有车。", // g42: not have
 "我昨天不看电视。", // g43: past non-occurrence
 "我不是买这本书。", // g44: simple refusal; additionally teach bu sandhi
 "这是老师的书什么？", // g45: wrong question particle
 "你弟弟吗去哪儿？", // g46: unnecessary yes/no particle
 "我明天在书店。", // g47: location versus intended movement
 "这是爸爸有杯子。", // g48: ownership construction
 "我爸爸老师是。", // g49: noun predicate order
 "请给我一英语词典。", // g50: missing book classifier
 "我有二个姐姐。", // g51: counted two
 "我妹妹的生日是二日五月。", // g52: date order
 "我早上七十五点分出门。", // g53: clock time
 "我见朋友明天下午。", // g54: time phrase position
 "学校旁边在一家书店。", // g55: existence versus location
 "我哥哥现在是学中文。", // g56: progressive action
 "我想是一杯茶喝。", // g57: want + action
 "我会说有一点儿中文。", // g58: learned skill
 "我可以打开窗户什么？", // g59: permission question
 "我昨天是买了一本书。", // g60: neutral completed event
 "我昨天没买了东西。", // g61: simple negative event
 "夏天比很春天热。", // g62: comparison pattern
 "我和妹妹一起是学中文。", // g63: joined activity
 "因为我很累，但是我在家休息。" // g64: result versus contrast
];
export const P32_REPAIR_CASES=Object.freeze(rows.map((r,i)=>{
 const [id,chapter,title,pattern,explanation,contrast,pitfall,anchor,exampleA,exampleB,cloze,transform]=r;
 const correct=Object.freeze({hanzi:transform[1],pinyin:transform[2],english:transform[3]});
 return Object.freeze({id:'p32:fix:'+id,grammarId:id,chapter,title,pattern,
  incorrect:mistakes[i],correct,pitfall,explanation,contrast,
  taskId:'p32:fix:'+id});
}));
export const P32_CORRECTION_TASKS=Object.freeze(P32_REPAIR_CASES.map(r=>Object.freeze({
 id:r.taskId,grammarId:r.grammarId,grammarTitle:r.title,kind:'p32-grammar-correction',p32Correction:true,
 english:'Repair this learner sentence for the intended meaning: '+r.incorrect+' Intended meaning: '+r.correct.english,
 hanzi:r.correct.hanzi,pinyin:r.correct.pinyin,
 explanation:r.pitfall,incorrect:r.incorrect
})));
const byGrammar=new Map(P32_REPAIR_CASES.map(r=>[r.grammarId,r]));
export const p32RepairFor=id=>byGrammar.get(id)||null;
export const P32_GRAMMAR_IDS=Object.freeze(P32_REPAIR_CASES.map(r=>r.grammarId));
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function p32LearningHub(state,action,esc=escapeHtml){
 const p32Sentences=SENTENCE_LIBRARY.filter(s=>s.source==='original-p32');
 const attempts=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('grammar:g')||e.taskId.startsWith('p32:fix:'));
 const visited=new Set(attempts.map(e=>e.taskId.match(/g(?:3[7-9]|[4-5]\d|6[0-4])\b/)?.[0]).filter(Boolean));
 const first=P32_GRAMMAR_IDS.find(id=>!visited.has(id))||P32_GRAMMAR_IDS[0];
 const samples=p32Sentences.filter(s=>s.grammarIds.includes(first)).slice(0,3);
 return '<section class="p32-hub" aria-label="Beginner grammar and sentence mastery">'+
 '<div class="p32-hub-head"><div><p class="eyebrow">P32 · ORIGINAL BEGINNER MANDARIN</p><h2>Turn grammar into sentences you can produce</h2>'+
 '<p>Learn one construction, compare an error, then recall the complete sentence independently. Practice history is not an official HSK or course-mastery score.</p></div>'+
 '<div class="p32-hub-metrics"><strong>'+visited.size+' / '+P32_GRAMMAR_IDS.length+'</strong><span>Grammar patterns attempted</span>'+
 '<small>'+p32Sentences.length+' new contextual sentences</small></div></div>'+
 '<div class="p32-hub-actions">'+action('grammar-select','Continue pattern '+esc(first)+' →','button primary', 'data-id="'+first+'"')+
 action('p32-repair','Correct a learner mistake →','button outline','data-id="p32:fix:'+first+'"')+
 action('p32-open-sentences','Browse new P32 sentences →','button outline')+'</div>'+
 '<div class="p32-hub-examples">'+samples.map(s=>action('sentence-select','<strong lang="zh-Hans">'+esc(s.hanzi)+'</strong><small>'+esc(s.pinyin)+' · '+esc(s.english)+'</small>','p32-example-button','data-id="'+esc(s.id)+'"')).join('')+'</div></section>';
}
export function p32RepairPanel(id,action,esc=escapeHtml){
 const r=p32RepairFor(id);if(!r)return '';
 return '<section class="p32-repair" aria-label="Correct a common beginner mistake"><div class="p32-repair-head"><div><p class="eyebrow">P32 · ERROR REPAIR</p><h3>Fix this learner sentence</h3></div><span>Independent written production</span></div>'+
 '<p class="p32-wrong" lang="zh-Hans">'+esc(r.incorrect)+'</p>'+
 '<p>Intended meaning: <strong>'+esc(r.correct.english)+'</strong></p>'+
 '<p class="p32-repair-tip"><strong>Look for:</strong> '+esc(r.pitfall)+'</p>'+
 action('p32-repair','Correct this in the Sentence Workshop →','button primary','data-id="'+r.taskId+'"')+
 '<p class="muted">The workshop compares your answer with one authored model. Valid alternative expressions may require human judgment.</p></section>';
}
