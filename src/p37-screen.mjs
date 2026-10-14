/** P37 Practical Conversation. Presentation only, not a second dialogue evaluator.
 * All durable comprehension, evidence and written recall flows remain with
 * dialogueEvents, missionEvents and sentenceEvents. Branch choices are local.
 */
import {P37_SCENES,P37_THEMES,findP37Scene} from './p37-scenarios.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {findGrammarLesson} from './grammar-course.mjs';
import {findWord,canonicalWordKey} from './lexicon.mjs';
import {STORIES} from './stories.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
const dialogueFor=id=>DIALOGUES.find(d=>d.p37?.id===id)||null;
const events=(state,id)=>{
 const did=dialogueFor(id)?.id;
 return (state.dialogueEvents||[]).filter(e=>e.dialogueId===did).length+
 (state.missionEvents||[]).filter(e=>e.dialogueId===did).length+
 (state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('p37:'+id+':')).length;
};
export const p37Next=(state)=>P37_SCENES.find(s=>!events(state,s.id))||P37_SCENES[0];
export function p37Overview(state,act,esc,{compact=false,theme='all',query='',selected=null,page=0}={}){
 const started=P37_SCENES.filter(s=>events(state,s.id)).length,next=p37Next(state);
 const matches=P37_SCENES.filter(s=>(theme==='all'||s.theme===theme)&&
  (!query||[s.title,s.goal,s.theme,s.teaching,...s.vocabulary.flatMap(w=>[w.hanzi,w.pinyin,w.english])]
   .join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const last=Math.max(0,Math.ceil(matches.length/10)-1),p=Math.max(0,Math.min(last,page));
 const visible=matches.slice(p*10,(p+1)*10);
 return '<section class="p37-overview" aria-label="P37 practical communication">'+
 '<div class="p37-overview-head"><div><p class="eyebrow">P37 · ORIGINAL ELEMENTARY MANDARIN</p>'+
 '<h2>Understand a conversation, then choose what to say</h2>'+
 '<p>30 situation-based, eight-turn exchanges. Listen without a transcript, identify supporting speech, compare natural replies and write an independent Chinese response. No live booking information or official HSK certification.</p></div>'+
 '<div class="p37-progress"><strong>'+started+' / '+P37_SCENES.length+'</strong><small>Scenarios with recorded attempts, not mastery</small>'+
 act('p37-open','Continue: '+esc(next.title)+' →','button primary small','data-id="'+next.id+'"')+'</div></div>'+
 (compact?'<div class="p37-overview-actions">'+act('p37-browse','Browse 30 practical conversations →','button outline')+'</div>':
 '<div class="p37-filter-row" aria-label="Situation filters">'+['all',...P37_THEMES].map(x=>act('p37-theme',esc(x==='all'?'All situations':x),'p37-filter '+(x===theme?'active':''),'data-theme="'+esc(x)+'" aria-pressed="'+(x===theme)+'"')).join('')+'</div>'+
 '<label for="p37-search">Find a situation, grammar pattern or word</label>'+
 '<input id="p37-search" type="search" autocomplete="off" value="'+esc(query)+'" placeholder="e.g. 预约, return, listening">'+
 '<div class="p37-scene-grid">'+visible.map(s=>
 act('p37-open','<span>'+s.sequence+' · '+esc(s.theme)+'</span><strong>'+esc(s.title)+'</strong>'+
 '<small>'+esc(s.goal)+'</small><em>'+ (events(state,s.id)?events(state,s.id)+' recorded attempts':'Not yet attempted')+'</em>',
 'p37-scene '+(selected===s.id?'selected':''),'data-id="'+s.id+'"')).join('')+'</div>'+
 (!visible.length?'<p class="muted">No matching situations. Clear the search or change the category.</p>':'')+
 '<div class="p37-pagination">'+act('p37-page-prev','← Previous','button outline small',p?'':'disabled')+
 '<span>'+(matches.length?p*10+1:0)+'–'+Math.min(matches.length,(p+1)*10)+' of '+matches.length+'</span>'+
 act('p37-page-next','Next →','button outline small',p<last?'':'disabled')+'</div>')+
 '</section>';
}
const tts=(act,esc,text,label)=>act('speak',label,'button outline small','data-text="'+esc(text)+'"');
export function p37Teaching(d,choice,act,esc,{turn=0,assisted=false}={}){
 const s=d?.p37;if(!s)return '';
 const grammar=findGrammarLesson(s.grammar);
 const chosen=Number.isInteger(choice)?s.alternatives[choice]:null;
 const current=s.turns[Math.max(0,Math.min(7,turn))];
 const linked=SENTENCE_LIBRARY.filter(row=>row.grammarIds.includes(s.grammar)).slice(0,3);
 const reading=STORIES.filter(st=>s.vocabulary.some(w=>st.lines.some(ln=>ln.hanzi.includes(w.hanzi)))).slice(0,2);
 return '<section class="p37-study" aria-label="Practical conversation coaching">'+
 '<div class="p37-study-title"><p class="eyebrow">CONVERSATION '+s.sequence+' / 30 · '+esc(s.theme)+'</p>'+
 '<h3>'+esc(s.goal)+'</h3><p>'+esc(s.teaching)+'</p></div>'+
 '<div class="p37-guidance"><article><h4>Pronunciation distinction</h4><p>'+esc(s.sound)+'</p></article>'+
 '<article><h4>Social usage</h4><p>'+esc(s.pragmatics)+'</p></article>'+
 '<article><h4>Common error</h4><p>'+esc(s.pitfall)+'</p></article></div>'+
 '<div class="p37-listening"><div><h3>Listening-first practice</h3><p>Play the full dialogue before revealing the transcript. Replay the current turn slowly, speak it aloud, and compare against device TTS. This device voice is optional and is not a pronunciation grade or recorded assessment.</p></div>'+
 '<div class="p37-controls">'+tts(act,esc,s.turns.map(t=>t[1]).join('。'),'▶ Play all spoken turns')+
 act('p37-slow-all','Play all slowly','button outline small')+
 act('dialogue-support',assisted?'Hide / show transcript · assisted':'Reveal transcript · assisted','button outline small')+'</div>'+
 '<div class="p37-turn-controls"><span>Shadowing turn '+(turn+1)+' of 8 · speaker '+current[0]+'</span>'+
 act('p37-turn-prev','←','button outline small',turn?'':'disabled')+
 act('p37-slow-turn','Hear this turn slowly','button outline small')+
 act('p37-turn-next','→','button outline small',turn<7?'':'disabled')+'</div></div>'+
 '<div class="p37-branches"><h3>Choose your next response</h3><p>Both alternatives are plausible. Their consequences are original teaching examples, not scored answers or actions by another real person.</p>'+
 '<div class="p37-branch-grid">'+s.alternatives.map((a,i)=>
 act('p37-branch','<strong lang="zh-Hans">'+esc(a.hanzi)+'</strong><span>'+esc(a.pinyin)+'</span>'+
 '<small>'+esc(a.english)+'</small><em>'+esc(a.use)+'</em>',
 'p37-branch '+(i===choice?'selected':''),'data-index="'+i+'" aria-pressed="'+(i===choice)+'"')).join('')+'</div>'+
 (chosen?'<div class="p37-reply"><p class="eyebrow">AUTHORIAL PARTNER RESPONSE</p><strong lang="zh-Hans">'+esc(chosen.reply.hanzi)+'</strong>'+
 '<span>'+esc(chosen.reply.pinyin)+'</span><small>'+esc(chosen.reply.english)+'</small>'+
 tts(act,esc,chosen.reply.hanzi,'Listen to this reply')+
 act('p37-branch-clear','Try the other response →','button outline small')+'</div>':'')+'</div>'+
 '<div class="p37-family"><h3>Word families in this situation</h3><div class="p37-words">'+s.vocabulary.map(w=>{
 const rec=findWord(canonicalWordKey(w.hanzi,w.pinyin));
 return '<article><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><span>'+esc(w.pinyin)+'</span>'+
 '<small>'+esc(w.english)+'</small>'+(rec?act('lookup-word','Open canonical Wordbook →','button outline small','data-id="'+esc(rec.key)+'"'):'')+'</article>';
 }).join('')+'</div></div>'+
 '<div class="p37-production"><div><h3>Produce Chinese independently</h3><p>Recall one of three substantive conversation turns without reading the answer. The existing Sentence Workshop checks one exact authored model; valid paraphrases are not automatically graded. Oral preparation is self-directed, never falsely certified.</p></div>'+
 '<div class="p37-production-actions">'+[1,4,7].map(i=>act('p37-write','Write turn '+(i+1)+' →','button outline small','data-id="'+s.id+'" data-turn="'+i+'"')).join('')+'</div></div>'+
 '<div class="p37-transfer"><h3>Connect with what you already know</h3><div class="button-row">'+
 (grammar?act('grammar-select',esc(grammar.title)+' · grammar →','button outline small','data-id="'+grammar.id+'"'):'')+
 act('p34-open-reading','Read an original beginner passage →','button outline small','data-id="p34-01"')+
 act('p37-browse','Browse more practical situations →','button outline small')+'</div>'+
 (linked.length?'<div class="p37-transfer-grid">'+linked.map(x=>act('sentence-select','<strong lang="zh-Hans">'+esc(x.hanzi)+'</strong><small>'+esc(x.english)+'</small>',
 'p37-transfer-card','data-id="'+x.id+'"')).join('')+'</div>':'')+
 (reading.length?'<div class="button-row">'+reading.map(st=>act('open-story-link',esc(st.title)+' · reading →','button outline small','data-id="'+st.id+'"')).join('')+'</div>':'')+
 '</div></section>';
}
