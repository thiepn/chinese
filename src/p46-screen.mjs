/** P46 HSK 4-targeted learning bridge. Original educational content, not
 * licensed HSK inventory or a separate reading/dialogue grading engine.
 */
import {P46_PASSAGES} from './p46-readings.mjs';
import {P46_CHARACTER_GUIDES,P46_VOCABULARY} from './p46-foundations.mjs';
import {P46_DIALOGUES} from './p46-dialogues.mjs';
import {P46_GRAMMAR_ROWS} from './p46-grammar.mjs';
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {DEMO_LESSONS} from './demo-lessons.mjs';
export const P46_STAGES=Object.freeze([
 Object.freeze({id:'characters',label:'Characters & words'}),
 Object.freeze({id:'grammar',label:'Grammar & contrasts'}),
 Object.freeze({id:'reading',label:'Connected reading'}),
 Object.freeze({id:'listening',label:'Spoken comprehension'}),
 Object.freeze({id:'production',label:'Production & transfer'})
]);
export const p46Story=p=>STORIES.find(s=>s.beginner?.p46?.id===p.id)||null;
export const p46NativeDialogue=p=>DIALOGUES.find(d=>d.p46?.readingId===p.id)||null;
export function p46Evidence(state,p){
 const st=p46Story(p),dialogue=p46NativeDialogue(p);
 const reading=(state.readingEvents||[]).filter(e=>e.storyId===st?.id);
 const listening=(state.dialogueEvents||[]).filter(e=>e.dialogueId===dialogue?.id);
 const nativeWriting=(state.sentenceEvents||[]).filter(e=>
  e.taskId==='beginner-reading:'+st?.id+':writing'||
  e.taskId==='p46:dialogue:'+dialogue?.p46?.id+':final');
 const chars=P46_CHARACTER_GUIDES.slice((p.sequence-1)*3,p.sequence*3);
 return {reading,listening,nativeWriting,chars,st,dialogue,
  introduced:chars.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&(state.learned||[]).includes(l.id))).length};
}
export function p46Next(state,after=null){
 const idx=P46_PASSAGES.findIndex(x=>x.id===after);
 const ordered=idx<0?P46_PASSAGES:[...P46_PASSAGES.slice(idx+1),...P46_PASSAGES.slice(0,idx+1)];
 return ordered.find(p=>{
  const e=p46Evidence(state,p);
  return !e.reading.some(x=>x.correct&&!x.assisted)||!e.listening.some(x=>x.correct&&!x.assisted);
 })||ordered[0]||P46_PASSAGES[0];
}
export function p46Overview(state,act,esc,{compact=false,selected='',query=''}={}){
 const q=String(query||'').toLocaleLowerCase().trim(),next=p46Next(state);
 const items=P46_PASSAGES.filter(p=>!q||[p.title,p.theme,p.goal,p.contrast,
  ...p.lines.map(l=>l.hanzi)].join(' ').toLocaleLowerCase().includes(q));
 const introduced=P46_CHARACTER_GUIDES.filter(g=>DEMO_LESSONS.some(l=>l.hanzi===g.hanzi&&(state.learned||[]).includes(l.id))).length;
 return '<section class="p46-overview" aria-label="Original upper-intermediate Mandarin bridge">'+
 '<div class="p46-hero"><p class="eyebrow">P46 · ORIGINAL HSK 4-TARGETED BRIDGE</p>'+
 '<h2>Work with longer Mandarin, without losing the original learning path.</h2>'+
 '<p>Six original 12-sentence three-paragraph texts, six connected six-turn spoken exchanges, 18 contextual character lessons, ten grammar contrasts and source-qualified word families. Progress is recorded only through established Course, Reader, Dialogue, Wordbook and Sentence Workshop authorities.</p>'+
 '<p class="muted">HSK 4 is an editorial teaching target, not an official HSK 3.0/4.0 inventory or proficiency certificate. Device audio is speech synthesis.</p>'+
 '<div class="p46-summary"><span>'+introduced+' / '+P46_CHARACTER_GUIDES.length+' canonical character lessons introduced</span>'+
 act('p46-open','Continue: '+esc(next.title)+' →','button primary','data-id="'+next.id+'"')+'</div></div>'+
 (compact?act('p46-enter','Open the upper-intermediate bridge →','button outline'):
 '<label for="p46-search">Find a situation, meaning contrast or Chinese term</label>'+
 '<input id="p46-search" type="search" value="'+esc(query)+'" placeholder="e.g. 审核, evidence, community">'+
 '<div class="p46-unit-grid">'+items.map(p=>{const e=p46Evidence(state,p);
 return act('p46-open','<small>UNIT '+p.sequence+' / '+P46_PASSAGES.length+' · '+esc(p.theme)+'</small>'+
 '<strong>'+esc(p.title)+'</strong><span>'+esc(p.goal)+'</span>'+
 '<em>'+e.introduced+'/3 characters introduced · '+e.reading.length+' reader and '+e.listening.length+' dialogue attempts</em>',
 'p46-unit '+(p.id===selected?'selected':''),'data-id="'+p.id+'"');
 }).join('')+'</div>'+(!items.length?'<p class="muted">No authored P46 unit matches the query.</p>':'')+
 '<div class="p46-actions">'+act('p46-native-review','Original due-card Review →','button outline')+
 act('p45-enter','Return to P45 cumulative transfer →','button outline')+'</div>')+'</section>';
}
export function p46Lesson(p,state,act,esc,{stage='characters',readerHelp=false,audioHelp=false,
 readerIndex=0,listenerIndex=0,readerFeedback=null,listenerFeedback=null,assisted=false}={}){
 if(!p)return '';
 const status=p46Evidence(state,p),chars=status.chars,grammar=p.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const d=status.dialogue?.p46,readQuestion=p.questions[readerIndex],listenerQuestion=d?.questions[listenerIndex];
 const e=readerFeedback?readQuestion?.evidence:null,le=listenerFeedback?listenerQuestion?.evidenceIndex:null;
 const readMode=['beginner-detail','beginner-reason','beginner-sequence'][readerIndex];
 return '<section class="p46-lesson" aria-label="Upper-intermediate lesson">'+
 '<header class="p46-heading"><div><p class="eyebrow">P46 · UNIT '+p.sequence+' / '+P46_PASSAGES.length+' · '+esc(p.theme)+'</p>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(p.goal)+'</p></div>'+
 act('p46-next','Next source →','button outline')+'</header>'+
 '<nav class="p46-stages" aria-label="Learning sections">'+P46_STAGES.map(s=>act('p46-stage',esc(s.label),
 'p46-stage '+(s.id===stage?'active':''),'data-stage="'+s.id+'" aria-pressed="'+(s.id===stage)+'"')).join('')+'</nav>'+
 (stage==='characters'?'<div class="p46-pane"><h3>Character families and contextual vocabulary</h3>'+
 '<p>Introduce the original character through the existing Course to activate its native scheduled cards. A listed word may be studied independently through the original Wordbook.</p>'+
 '<div class="p46-character-grid">'+chars.map(g=>{const native=DEMO_LESSONS.find(l=>l.hanzi===g.hanzi),
 introduced=native&&(state.learned||[]).includes(native.id);
 return '<article class="p46-character"><div class="p46-character-heading"><strong lang="zh-Hans">'+esc(g.hanzi)+'</strong>'+
 '<div><span>'+esc(g.pinyin)+'</span><small>'+esc(g.meaning)+'</small><small>'+esc(g.category)+'</small></div></div>'+
 '<p>'+esc(g.teaching)+'</p><p class="p46-contrast">'+esc(g.pitfall)+'</p>'+
 g.words.map(w=>'<div class="p46-word"><strong lang="zh-Hans">'+esc(w.hanzi)+'</strong><span>'+esc(w.pinyin)+' · '+esc(w.english)+'</span>'+
 act('lookup-word','Wordbook →','button outline small','data-id="'+esc(canonicalWordKey(w.hanzi,w.pinyin))+'"')+'</div>').join('')+
 g.examples.map(line=>'<div class="p46-example"><p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 '<small>'+esc(line.pinyin)+'</small><span>'+esc(line.english)+'</span></div>').join('')+
 act('p46-study-character',(introduced?'Review':'Introduce')+' in canonical Course →','button outline',
 'data-hanzi="'+esc(g.hanzi)+'"')+'</article>';
 }).join('')+'</div>'+
 '<div class="p46-actions">'+act('p46-stage','Continue to grammar →','button primary','data-stage="grammar"')+'</div></div>':'')+
 (stage==='grammar'?'<div class="p46-pane"><h3>Grammar structures as meaning choices</h3>'+
 '<p>The ten new structures also appear in the original Grammar course, with the established native choice and production modes.</p>'+
 '<div class="p46-grammar-grid">'+grammar.map(g=>'<article><h4>'+esc(g.title)+'</h4>'+
 '<p class="p46-grammar-pattern">'+esc(g.pattern)+'</p><p>'+esc(g.explanation)+'</p>'+
 '<p><strong>Contrast:</strong> '+esc(g.contrast)+'</p><p><strong>Common error:</strong> '+esc(g.pitfall)+'</p>'+
 g.examples.map(ex=>'<div class="p46-example"><p lang="zh-Hans">'+esc(ex.hanzi)+'</p>'+
 '<small>'+esc(ex.pinyin)+'</small><span>'+esc(ex.english)+'</span></div>').join('')+
 act('grammar-select','Study and practise in original Grammar →','button outline small','data-id="'+g.id+'"')+'</article>').join('')+'</div>'+
 '<div class="p46-actions">'+act('p46-stage','Continue to reading →','button primary','data-stage="reading"')+'</div></div>':'')+
 (stage==='reading'?'<div class="p46-pane"><h3>Read three linked paragraphs before answering</h3>'+
 '<p>'+esc(p.contrast)+'</p>'+
 p.paragraphs.map((sect,i)=>'<article class="p46-paragraph"><h4>Paragraph '+(i+1)+' · '+esc(sect.title)+'</h4>'+
 p.lines.slice(sect.start,sect.end+1).map((line,j)=>'<div class="p46-reading-line"><span>'+(sect.start+j+1)+'</span><div>'+
 '<p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+(readerHelp?'<small>'+esc(line.pinyin)+'</small><span>'+esc(line.english)+'</span>':'')+'</div>'+
 act('speak','Hear','button outline small','data-text="'+esc(line.hanzi)+'"')+'</div>').join('')+'</article>').join('')+
 '<div class="p46-actions">'+act('p46-reader-help',readerHelp?'Hide translations':'Reveal Pinyin and English · assisted','button outline')+'</div>'+
 '<div class="p46-native"><h4>Native reader question '+(readerIndex+1)+' / '+p.questions.length+'</h4>'+
 '<p>'+esc(readQuestion?.prompt||'')+'</p>'+
 (readerFeedback?'<div class="p46-feedback" role="status"><strong>'+(
 readerFeedback.correct?(readerFeedback.assisted?'Correct, assisted':'Correct native reader event'):'Not the authored reference answer')+'</strong>'+
 '<p>Reference: '+esc(readQuestion.answer)+'</p>'+
 (Number.isInteger(e)?'<p><strong>Evidence line '+(e+1)+':</strong></p><p lang="zh-Hans">'+esc(p.lines[e]?.hanzi||'')+'</p>'+
 '<small>'+esc(p.lines[e]?.pinyin||'')+'</small><p>'+esc(p.lines[e]?.english||'')+'</p>':'')+
 '<p>'+esc(readQuestion.explanation)+'</p></div>'+
 '<div class="p46-actions">'+act('p46-reader-next',readerIndex+1<p.questions.length?'Next reader question →':'Continue to listening →','button primary')+
 act('p46-reader-retry','Try again','button outline')+'</div>':
 '<div class="p46-answers">'+(readQuestion?.options||[]).map(o=>act('p46-reader-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p46-actions">'+act('p46-reader-reveal','Show model · assisted','button outline')+
 act('p46-stage','Continue without answering →','button outline','data-stage="listening"')+'</div>')+'</div></div>':'')+
 (stage==='listening'?'<div class="p46-pane"><h3>Listen to the six-turn conversation</h3>'+
 '<p>Try listening without the written script, then identify which claim was proposed, verified or rejected.</p>'+
 '<div class="p46-actions">'+act('p46-play','Listen to the full dialogue','button primary')+
 act('p46-play-slow','Replay slowly','button outline')+
 act('p46-audio-help',audioHelp?'Hide transcript':'Reveal Hanzi, Pinyin and English · assisted','button outline')+'</div>'+
 (d?.turns||[]).map((turn,i)=>'<div class="p46-listening-turn"><strong>'+esc(turn.speaker)+'</strong>'+
 '<div>'+(audioHelp?'<p lang="zh-Hans">'+esc(turn.hanzi)+'</p><small>'+esc(turn.pinyin)+'</small><span>'+esc(turn.english)+'</span>':
 '<p>Listen first; identify the intention and the evidence before checking the script.</p>')+'</div>'+
 act('p46-turn-play','Replay turn','button outline small','data-index="'+i+'"')+'</div>').join('')+
 '<div class="p46-native"><h4>Native listening question '+(listenerIndex+1)+' / '+(d?.questions.length||0)+'</h4>'+
 '<p>'+esc(listenerQuestion?.prompt||'')+'</p>'+
 (listenerFeedback?'<div class="p46-feedback" role="status"><strong>'+(
 listenerFeedback.correct?(listenerFeedback.assisted?'Correct, assisted':'Correct native dialogue event'):'Check the spoken evidence')+'</strong>'+
 '<p>Reference: '+esc(listenerQuestion.answer)+'</p>'+
 (Number.isInteger(le)?'<p><strong>Evidence turn '+(le+1)+':</strong></p><p lang="zh-Hans">'+esc(d.turns[le]?.hanzi||'')+'</p>'+
 '<small>'+esc(d.turns[le]?.pinyin||'')+'</small><p>'+esc(d.turns[le]?.english||'')+'</p>':'')+
 '<p>'+esc(listenerQuestion.explanation)+'</p></div>'+
 '<div class="p46-actions">'+act('p46-listener-next',listenerIndex+1<d.questions.length?'Next listening question →':'Continue to production →','button primary')+
 act('p46-listener-retry','Retry','button outline')+'</div>':
 '<div class="p46-answers">'+(listenerQuestion?.options||[]).map(o=>act('p46-listener-answer',esc(o),'choice','data-option="'+esc(o)+'"')).join('')+'</div>'+
 '<div class="p46-actions">'+act('p46-listener-reveal','Reveal reference · assisted','button outline')+
 act('p46-stage','Continue to production →','button outline','data-stage="production"')+'</div>')+'</div></div>':'')+
 (stage==='production'?'<div class="p46-pane"><h3>Reconstruct, then explain the situation independently</h3>'+
 '<p>Reconstruct exact source sentences through the original Sentence Workshop. Then speak a short summary without copying the model. Neither an original paragraph nor speech is automatically graded.</p>'+
 '<p class="p46-contrast">'+esc(p.oral)+'</p>'+
 '<div class="p46-actions">'+act('p46-write','Reconstruct the reading conclusion →','button primary','data-kind="reading"')+
 act('p46-write','Reconstruct the final spoken turn →','button outline','data-kind="dialogue"')+
 act('p43-enter','Write two independent paragraphs in P43 →','button outline')+
 act('p45-enter','Apply the meaning in cumulative P45 →','button outline')+'</div>'+
 '<div class="p46-actions">'+act('p46-next','Continue to next upper-intermediate unit →','button primary')+'</div></div>':'')+
 '<aside class="p46-evidence"><h3>Original evidence and review authority</h3>'+
 '<p>'+status.reading.length+' original Reader events; '+status.listening.length+' original Dialogue events; '+
 status.nativeWriting.length+' original exact-form writing events. '+
 status.introduced+' / '+chars.length+' canonical new character lessons introduced.</p>'+
 '<div class="p46-actions">'+act('p46-native-review','Study genuinely due cards in original Review →','button outline')+
 act('p41-browse','P41 intermediate reading →','button outline small')+
 act('p45-enter','P45 independent transfer →','button outline small')+'</div></aside>'+
 '<p class="p46-disclosure">P46 review dates are controlled only by the original scheduler. Reading and listening are recorded only by their native assessment writers. Hidden answer explanations and TTS are assistance for subsequent answers on this unit; they do not demonstrate independent proficiency. Original teaching content has not been independently language-certified.</p></section>';
}
