import {BEGINNER_STORIES,BEGINNER_MODES,beginnerReadingStats,beginnerStoryLinks} from './beginner-reading.mjs';
export function beginnerReadingShelf(state,story,act,esc,level='all'){
 const stats=beginnerReadingStats(state),items=BEGINNER_STORIES.filter(s=>!['original-p38','original-p41','original-p68','original-p71'].includes(s.beginner.source)&&(level==='all'||String(s.beginner.level)===String(level)));
 return `<section class="simple-panel p28-shelf"><div class="panel-heading"><div><p class="eyebrow">BEGINNER READING PATH</p><h2>Short Chinese stories</h2></div><span class="muted">${items.length} P28/P34 passages · ${stats.attempted} attempted · ${stats.correctIndependent} with independent correct answers</span></div>
 <p>Read six connected sentences in the original beginner path. P34 adds 25 source-linked reading and listening pairs; P38 has a separate longer elementary reading catalogue; questions still use the original reading and writing event writers. Learn a useful expression, answer from evidence and rebuild a Chinese sentence. Internal difficulty bands do not represent official HSK levels.</p>
 <div class="p28-levels" role="group">${[['all','All beginners'],['1','First steps'],['2','Building confidence']].map(([id,label])=>act('beginner-level',esc(label),'p28-level '+(level===id?'active':''),`data-level="${id}"`)).join('')}</div>
 <div class="p28-shelf-list">${items.map((s,i)=>act('open-story-link',`<span>${String(i+1).padStart(2,'0')}</span><strong>${esc(s.title)}</strong><small>${esc(s.theme)} · ${esc(s.beginner.grade)}</small>`,'p28-shelf-item '+(s.id===story?.id?'selected':''),`data-id="${s.id}"`)).join('')}</div></section>`;
}
export function beginnerReadingHeading(story,act,esc,part='all',wordShown=false){
 if(!story?.beginner||story.beginner.p38||story.beginner.p41||story.beginner.p71)return '';
 const b=story.beginner;
 return `<section class="p28-intro"><p class="eyebrow">${esc(b.grade)} · ${story.lines.length}-sentence reading</p><p><strong>Communicative purpose:</strong> ${esc(b.purpose)}. ${esc(b.bridge)}</p>
 <div class="p28-learning-steps"><span>01 · Understand the situation</span><span>02 · Follow the outcome</span><span>03 · Find evidence</span><span>04 · Rebuild Chinese</span></div>
 <div class="p28-parts">${[['all','Both parts'],['0','Part 1 · situation'],['1','Part 2 · outcome']].map(([id,label])=>act('beginner-part',esc(label),'p28-part '+(part===id?'active':''),`data-part="${id}"`)).join('')}</div>
 <div class="p28-word"><div><span class="eyebrow">KEY EXPRESSION</span><strong lang="zh-Hans">${esc(b.focusWord.hanzi)}</strong>
 ${wordShown?`<p>${esc(b.focusWord.pinyin)} · ${esc(b.focusWord.english)}</p>`:'<p>Try to infer the meaning from the story before showing it.</p>'}</div>
 <div>${act('beginner-reveal-word',wordShown?'Hide meaning':'Reveal meaning','button outline small')}${act('speak','▶ Listen','button outline small',`data-text="${esc(b.focusWord.hanzi)}"`)}
 </div></div></section>`;
}
export function beginnerPartMarker(story,i,act,esc,explained=''){
 if(!story?.beginner||story.beginner.p38||story.beginner.p41||story.beginner.p71||i!==0&&i!==3)return '';
 const part=i===0?0:1;
 return `<div class="p28-part-heading"><div><span class="eyebrow">PART ${part+1} / 2</span><h3>${part===0?'Who, where and when?':'What happens next?'}</h3></div>
 ${act('beginner-explain-part',explained===String(part)?'Hide strategy':'Reading strategy','button outline small',`data-part="${part}"`)}
 ${explained===String(part)?`<p class="p28-reading-tip">${part===0?'First identify the people, place, and time before translating every word.':'Now locate the change, response or result. Notice time markers and cause-and-effect connectors.'}</p>`:''}</div>`;
}
export function beginnerModeTabs(story,mode,act,esc){
 if(!story?.beginner)return '';
 return `<div class="p28-reading-modes"><p class="eyebrow">GO BEYOND RECOGNITION</p><p>Answer three source-specific meaning questions or write a sentence from the passage. The original cloze, ordering, pronunciation and glossary tools also remain available.</p>
 <div class="mode-tabs">${BEGINNER_MODES.map(([id,label])=>act('story-mode',esc(label),mode===id?'button dark small':'button outline small',`data-mode="${id}"`)).join('')}</div></div>`;
}
export function beginnerEvidence(story,question,result,esc){
 if(!story?.beginner||!result)return '';
 const model=question.model;
 if(question.kind==='hanzi')return `<div class="p28-evidence"><strong>Written model</strong><p lang="zh-Hans">${esc(model.hanzi)}</p><small>${esc(model.pinyin)}</small><p>${esc(model.english)}</p><p>${esc(question.explanation)}</p></div>`;
 const line=story.lines[question.evidence];
 return line?`<div class="p28-evidence"><strong>Evidence · sentence ${question.evidence+1}</strong><p lang="zh-Hans">${esc(line.hanzi)}</p><small>${esc(line.pinyin)}</small><p>${esc(line.english)}</p><p>${esc(question.explanation)}</p></div>`:'';
}
export function beginnerConnections(story,act,esc){
 if(!story?.beginner)return '';
 const links=beginnerStoryLinks(story);
 return `<section class="simple-panel p28-connections"><div class="panel-heading"><h2>Continue from this reading</h2><span class="muted">${esc(story.beginner.grade)}</span></div><p>${esc(story.beginner.bridge)}</p>
 ${links.grammar.length?`<div class="p28-links"><strong>Grammar patterns</strong><div>${links.grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small',`data-id="${g.id}"`)).join('')}</div></div>`:''}
 ${links.words.length?`<div class="p28-links"><strong>Vocabulary</strong><div>${links.words.map(w=>act('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.senses[0])}`,'button outline small',`data-id="${w.key}"`)).join('')}</div></div>`:''}
 ${links.characters.length?`<div class="p28-links"><strong>Character lessons</strong><div>${links.characters.map(l=>act('open-lesson',`<span lang="zh-Hans">${esc(l.hanzi)}</span> · ${esc(l.meaning)}`,'button outline small',`data-id="${l.id}"`)).join('')}</div></div>`:''}
 ${links.sentences.length?`<div class="p28-links"><strong>Related complete sentences</strong><div>${links.sentences.map(s=>act('sentence-select',`<span lang="zh-Hans">${esc(s.hanzi)}</span> · ${esc(s.english)}`,'button outline small',`data-id="${s.id}"`)).join('')}</div></div>`:''}
 <div class="button-row">${act('beginner-writing-workshop','Write in Sentence Workshop →','button primary')}${act('beginner-next-story','Next beginner story →','button outline')}${act('reading-open-long','Try a longer P27 reading →','button outline')}</div></section>`;
}