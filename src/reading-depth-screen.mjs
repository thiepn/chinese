// P27 enhancements for the existing Readings page.
import {DEEP_READING_MODES,readingDepthOverview,readingLinks} from './reading-depth.mjs';
export function readingExtendedHeader(story,act,esc,{paragraph=0,only=false,translations=[]}={}){
 const stats=readingDepthOverview(story);if(!stats)return '';
 const meta=story.extended,sections=meta.paragraphs;
 return `<section class="p27-reading-heading" aria-label="Extended original reading">
 <div class="p27-reading-stats"><span><strong>${stats.paragraphs}</strong> paragraphs</span><span><strong>${stats.lines}</strong> Chinese sentences</span><span><strong>${stats.questions}</strong> original comprehension questions</span><span><strong>${esc(stats.type)}</strong> text type</span></div>
 <p>${esc(meta.introduction)}</p>
 <nav class="p27-paragraph-nav" aria-label="Paragraph navigation">${sections.map((sec,i)=>
  act('reading-paragraph',`0${i+1} · ${esc(sec.title)}`,'p27-paragraph-link '+(paragraph===i?'active':''),`data-index="${i}" aria-pressed="${only&&paragraph===i}"`)).join('')}
 ${act('reading-all-paragraphs',only?'Show all paragraphs':'All paragraphs visible','button outline small')}</nav>
 <p class="muted">Focus on a paragraph to read it carefully. The source stays in the original order.</p></section>`;
}
export function readingParagraphMarker(story,index,act,esc,translations=[]){
 const sec=story.extended?.paragraphs?.find(s=>s.start===index);if(!sec)return '';
 const which=story.extended.paragraphs.indexOf(sec);
 return `<div class="p27-paragraph-title" id="reading-paragraph-${which}"><span class="eyebrow">PARAGRAPH ${which+1} / ${story.extended.paragraphs.length}</span><h3>${esc(sec.title)}</h3>
 ${act('reading-translate-paragraph',translations.includes(which)?'Hide paragraph meaning':'Explain this paragraph','button outline small',`data-index="${which}"`)}${translations.includes(which)?`<div class="p27-paragraph-explanation"><strong>Paragraph meaning</strong><p>${esc(sec.summary)}</p><small>${esc(sec.focus)}</small></div>`:''}</div>`;
}
export function readingExtendedModeButtons(story,mode,act,esc){
 if(!story?.extended)return '';
 return `<div class="p27-reading-modes"><p class="eyebrow">BEYOND FACT RECALL</p><p>Answer using evidence from the connected passage; compare explanations after submitting.</p>
 <div class="mode-tabs" role="group" aria-label="Extended reading questions">
 ${DEEP_READING_MODES.map(([id,label])=>act('story-mode',esc(label),mode===id?'button dark small':'button outline small',`data-mode="${id}" aria-pressed="${mode===id}"`)).join('')}</div></div>`;
}
export function readingExtendedConnections(story,act,esc){
 if(!story?.extended)return '';
 const links=readingLinks(story);
 return `<section class="simple-panel p27-reading-connections"><div class="panel-heading"><div><p class="eyebrow">READ → LEARN → WRITE</p><h2>Continue from this passage</h2></div><span class="muted">Original P27 text · not official HSK material</span></div>
 <p>${esc(story.extended.takeaways)}</p>
 ${links.grammar.length?`<div class="p27-link-line"><strong>Grammar used in this reading</strong><div>${links.grammar.map(g=>act('grammar-select',esc(g.title)+' →','button outline small',`data-id="${g.id}"`)).join('')}</div></div>`:''}
 ${links.words.length?`<div class="p27-link-line"><strong>Vocabulary in the source</strong><div>${links.words.map(w=>act('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.senses[0])}`,'button outline small',`data-id="${esc(w.key)}"`)).join('')}</div></div>`:''}
 ${links.sentences.length?`<div class="p27-link-line"><strong>Connected authored sentences</strong><div class="p27-related-sentences">${links.sentences.map(s=>act('sentence-select',`<span lang="zh-Hans">${esc(s.hanzi)}</span><small>${esc(s.english)}</small>`,'p26-mini-sentence',`data-id="${s.id}"`)).join('')}</div></div>`:''}
 <div class="button-row">${act('reading-writing-workshop','Write from this passage in Sentence Workshop →','button primary')}
 ${act('sentence-open','Browse the sentence library →','button outline')}</div></section>`;
}
export function readingEvidence(story,exercise,feedback,esc){
 if(!story?.extended||!feedback||exercise?.evidence===null||exercise?.evidence===undefined)return '';
 const line=story.lines[exercise.evidence];if(!line)return '';
 return `<div class="p27-reading-evidence"><strong>Evidence · sentence ${exercise.evidence+1}, paragraph ${Math.floor(exercise.evidence/3)+1}</strong>
 <p lang="zh-Hans">${esc(line.hanzi)}</p><small>${esc(line.pinyin)}</small><p>${esc(line.english)}</p>
 <p>${esc(exercise.explanation||'The evidence comes from the original passage.')}</p></div>`;
}