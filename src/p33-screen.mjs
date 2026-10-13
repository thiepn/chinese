/** P33 learner presentation inside the existing dialogue/course UI.
 * No new progress store; counts are read from existing dialogueEvents, missionEvents,
 * sentenceEvents. Branch choices are session-only practice, not mastery evidence.
 */
import {P33_SCENARIOS,P33_THEMES,findP33Scenario} from './p33-scenarios.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {findWord,canonicalWordKey} from './lexicon.mjs';
import {findGrammarLesson} from './grammar-course.mjs';
import {SENTENCE_LIBRARY} from './sentence-library.mjs';
import {STORIES} from './stories.mjs';

const sceneDialogue=id=>DIALOGUES.find(d=>d.p33?.id===id);
const attempted=(state,id)=>new Set((state.dialogueEvents||[]).filter(e=>e.dialogueId===sceneDialogue(id)?.id).map(e=>e.question)).size;
const say=(act,esc,hanzi,text='Listen')=>act('speak',esc(text),'button outline small','data-text="'+esc(hanzi)+'"');
export function p33SceneShelf(state,selectedId,act,esc,{theme='all',query='',compact=false}={}){
 const q=String(query).trim().toLocaleLowerCase();
 const candidates=P33_SCENARIOS.filter(s=>theme==='all'||s.theme===theme);
 const matches=candidates.filter(s=>!q||
 [s.title,s.theme,s.goal,s.pragmatics,...s.vocabulary.flatMap(v=>[v.hanzi,v.pinyin,v.english])].join(' ').toLocaleLowerCase().includes(q)));
 const current=selectedId&&findP33Scenario(selectedId);
 const completed=P33_SCENARIOS.filter(s=>attempted(state,s.id)>0).length;
 const next=P33_SCENARIOS.find(s=>!attempted(state,s.id))||P33_SCENARIOS[0];
 return '<section class="p33-shelf '+(compact?'compact':'')+'" aria-label="Everyday Mandarin scenarios">'+
 '<div class="p33-shelf-head"><div><p class="eyebrow">P33 · AUTHORED EVERYDAY CHINESE</p><h2>Practise complete real-life conversations</h2>'+
 '<p>Learn the situation, read a full exchange, listen using a device voice, choose a plausible response, then produce Mandarin without looking.</p></div>'+
 '<div class="p33-shelf-metric"><strong>'+completed+' / '+P33_SCENARIOS.length+'</strong><small>Conversations attempted, not certified mastery</small>'+
 act('p33-open-scenario','Continue: '+esc(next.title)+' →','button primary small','data-id="'+next.id+'"')+'</div></div>'+
 (!compact?'<div class="p33-theme-row" role="group" aria-label="Everyday situation categories">'+
 ['all',...P33_THEMES].map(item=>act('p33-theme',esc(item==='all'?'All situations':item),'p33-theme-btn '+(theme===item?'active':''),'data-theme="'+esc(item)+'" aria-pressed="'+(theme===item)+'"')).join('')+'</div>'+
 '<label class="p33-search-label" for="p33-scenario-query">Find a situation or word</label>'+
 '<input id="p33-scenario-query" type="search" autocomplete="off" value="'+esc(query)+'" placeholder="Search restaurant, family, 学校...">':'')+
 '<div class="p33-scene-grid">'+(compact?P33_SCENARIOS.slice(0,4):candidates).map(s=>{
 const count=attempted(state,s.id),d=sceneDialogue(s.id);
 return '<button type="button" class="p33-scene-item '+(s.id===current?.id?'active':'')+
 '" data-action="p33-open-scenario" data-id="'+s.id+'" aria-current="'+(s.id===current?.id)+'"'+(!compact&&!matches.includes(s)?' hidden':'')+'><span>'+
 String(s.sequence).padStart(2,'0')+' · '+esc(s.theme)+'</span><strong>'+esc(s.title)+'</strong>'+
 '<small>'+esc(s.goal)+'</small><em>'+s.turns.length+' dialogue turns · '+(count?count+' questions attempted':'Not attempted')+'</em></button>';
 }).join('')+'</div>'+
 (!compact?'<p class="p33-no-results"'+(matches.length?' hidden':'')+'>No scenes match this query. Change the category or search term.</p>':'')+
 (compact?'<div class="p33-compact-footer">'+act('p33-browse','Browse all '+P33_SCENARIOS.length+' conversations →','button outline')+'</div>':'')+
 '</section>';
}
export function p33ScenarioTeaching(d,chosen,act,esc){
 const s=d?.p33;if(!s)return '';
 const grammar=findGrammarLesson(s.grammar);
 const linked=SENTENCE_LIBRARY.filter(row=>row.grammarIds.includes(s.grammar)).slice(0,3);
 const reading=STORIES.filter(st=>s.vocabulary.some(w=>st.lines.some(line=>line.hanzi.includes(w.hanzi)))).slice(0,2);
 const chosenOption=Number.isInteger(chosen)&&chosen>=0&&chosen<s.alternatives.length?s.alternatives[chosen]:null;
 return '<section class="p33-scenario-detail" aria-label="Everyday scenario language and choices">'+
 '<div class="p33-situation"><p class="eyebrow">SITUATION '+s.sequence+' / '+P33_SCENARIOS.length+' · '+esc(s.theme)+'</p>'+
 '<h3>'+esc(s.goal)+'</h3><p>'+esc(s.teaching)+'</p></div>'+
 '<div class="p33-concept-grid"><div><h4>How it sounds</h4><p>'+esc(s.sound)+'</p></div>'+
 '<div><h4>Social nuance</h4><p>'+esc(s.pragmatics)+'</p></div>'+
 '<div><h4>Common misunderstanding</h4><p>'+esc(s.pitfall)+'</p></div></div>'+
 '<section class="p33-response-branch"><div class="p33-section-head"><h3>Choose your next response</h3><small>Both are meaningful alternatives; the partner replies differently.</small></div>'+
 '<div class="p33-alternatives">'+s.alternatives.map((a,i)=>
 act('p33-branch','<strong lang="zh-Hans">'+esc(a.hanzi)+'</strong><small>'+esc(a.english)+'</small>',
 'p33-alternative '+(chosen===i?'active':''),'data-index="'+i+'" aria-pressed="'+(chosen===i)+'"')).join('')+'</div>'+
 (chosenOption?'<div class="p33-partner-reply" role="status"><p class="eyebrow">YOUR CHOICE</p><p lang="zh-Hans">'+esc(chosenOption.hanzi)+'</p>'+
 '<span>'+esc(chosenOption.pinyin)+'</span><p>'+esc(chosenOption.use)+'</p>'+
 '<p class="eyebrow">PARTNER RESPONSE</p><strong lang="zh-Hans">'+esc(chosenOption.reply.hanzi)+'</strong>'+
 '<span>'+esc(chosenOption.reply.pinyin)+'</span><p>'+esc(chosenOption.reply.english)+'</p>'+
 say(act,esc,chosenOption.reply.hanzi,'Hear partner response')+
 '<div class="button-row">'+act('p33-clear-branch','Compare another response →','button outline small')+'</div></div>':'<p class="muted">Select a response to see the partner’s authored continuation. No grade or progress is written.</p>')+
 '</section>'+
 '<section class="p33-vocab"><div class="p33-section-head"><h3>Words to reuse</h3><small>Words use the existing vocabulary search and review system.</small></div><div class="p33-vocab-grid">'+
 s.vocabulary.map(w=>{
 const record=findWord(canonicalWordKey(w.hanzi,w.pinyin));
 return '<article><p lang="zh-Hans">'+esc(w.hanzi)+'</p><strong>'+esc(w.pinyin)+'</strong><small>'+esc(w.english)+'</small>'+
 '<div class="p33-vocab-actions">'+(record?act('lookup-word','Examples ↗','button outline small','data-id="'+esc(record.key)+'"'):'')+
 say(act,esc,w.hanzi,'Hear word')+'</div></article>';
 }).join('')+'</div></section>'+
 '<section class="p33-transfer"><div><p class="eyebrow">INDEPENDENT TRANSFER</p><h3>Move from understanding to producing</h3>'+
 '<p>'+esc(s.oral)+'</p><p class="muted">Prepare an oral answer yourself. Device TTS plays written models; the app does not record or judge your speech.</p></div>'+
 '<div class="p33-transfer-buttons">'+[1,4,7].map((i,index)=>act('p33-write','Write turn '+(i+1)+' →','button '+(index===0?'primary':'outline')+' small','data-id="'+s.id+'" data-turn="'+i+'"')).join('')+
 '</div></section>'+
 '<section class="p33-connected"><h3>Continue in your existing course</h3><div class="button-row">'+
 (grammar?act('grammar-select',esc(grammar.title)+' →','button outline small','data-id="'+grammar.id+'"'):'')+
 act('pinyin-open','Pronunciation foundations →','button outline small')+
 act('sentence-open','Sentence Library →','button outline small')+
 act('pathway-open','Learning Pathway →','button outline small')+
 act('open-practice','Character review practice →','button outline small')+'</div>'+
 (linked.length?'<p class="eyebrow">RELATED GRAMMAR SENTENCES</p><div class="p33-related">'+
 linked.map(row=>act('sentence-select','<span lang="zh-Hans">'+esc(row.hanzi)+'</span><small>'+esc(row.english)+'</small>',
 'p33-linked-sentence','data-id="'+esc(row.id)+'"')).join('')+'</div>':'')+
 (reading.length?'<p class="eyebrow">CONNECTED READINGS</p><div class="button-row">'+
 reading.map(st=>act('open-story-link',esc(st.title)+' →','button outline small','data-id="'+esc(st.id)+'"')).join('')+'</div>':'')+
 '</section></section>';
}
