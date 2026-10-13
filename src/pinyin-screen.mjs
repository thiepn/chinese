// P24 learner-facing phonetics reference; speech actions use existing device TTS.
import {PINYIN_INITIALS,PINYIN_FINALS,PINYIN_SYLLABLE_GROUPS,PINYIN_TONES,PINYIN_CONTRASTS,PINYIN_RULES,PINYIN_SANDHI,PINYIN_SECTIONS,PINYIN_WORD_MODELS,soundQuestion,soundBreakdown,toneMarkedSyllable} from './pinyin-foundations.mjs';

export function soundPrimer(reference,action,esc){
 const parts=soundBreakdown(reference);if(!parts?.length)return '';
 return `<section class="p24-sound-primer" aria-label="Pinyin pronunciation connections">
 <div class="p24-primer-head"><strong>How these syllables work</strong><span>Written lexical Pinyin</span></div>
 <div class="p24-primer-parts">${parts.map(p=>`<div><strong>${esc(p.syllable)}</strong><span>Tone ${p.tone===5?'neutral':p.tone}</span><p>${esc(p.initialCue)}</p><p>${esc(p.finalCue)}</p>${p.extra?`<small>${esc(p.extra)}</small>`:''}</div>`).join('')}</div>
 ${action('pinyin-open','Open sound foundations →','button outline small')}</section>`;
}
const speak=(hanzi,action,esc,label='▶ Listen · device voice')=>action('speak',label,'button outline small',`data-text="${esc(hanzi)}"`);
const tabs=(section,action,esc)=>`<nav class="p24-tabs" aria-label="Pinyin sound lessons">${PINYIN_SECTIONS.map(x=>action('pinyin-tab',esc(x.title),section===x.id?'button dark small':'button outline small',`data-section="${x.id}" aria-pressed="${section===x.id}"`)).join('')}</nav>`;
function soundGrid(section,selected,action,esc){
 const items=section==='sounds'?PINYIN_INITIALS:PINYIN_FINALS;
 const unit=items.find(x=>x.text===selected)||items[0];
 return `<section class="simple-panel p24-panel"><div class="panel-heading"><div><p class="eyebrow">${section==='sounds'?'ARTICULATE INITIALS':'FORM CHINESE FINALS'}</p><h2>${items.length} sound explanations</h2></div><span class="muted">Choose a symbol to study</span></div>
 <div class="p24-sound-grid">${items.map(x=>action('pinyin-sound',esc(x.text),'p24-sound '+(x.text===unit.text?'selected':''),`data-sound="${esc(x.text)}" aria-pressed="${x.text===unit.text}"`)).join('')}</div>
 <div class="p24-sound-detail"><span class="p24-sound-symbol">${esc(unit.text)}</span><div><h3>${esc(unit.label||'Final '+unit.text)}</h3><p>${esc(unit.cue)}</p>${unit.contrast?`<p>Useful comparison: <strong>${esc(unit.contrast)}</strong></p>`:''}
 <p><strong>Example:</strong> ${esc(unit.example)}</p>${speak(unit.example.split(' ')[0],action,esc)}
 <p class="muted">Device speech is optional and may differ across browsers and installed voices.</p></div></div></section>`;
}
function syllables(selected,action,esc){
 const current=PINYIN_SYLLABLE_GROUPS.find(g=>g.forms.includes(selected))?selected:'ma';
 return `<section class="simple-panel p24-panel"><p class="eyebrow">COMBINE INITIALS AND FINALS</p><h2>Interactive Pinyin syllable chart</h2>
 <p>Select a syllable to see all four written tones and the unmarked neutral spelling. The examples are illustrative, not an exhaustive official syllable inventory.</p>
 <div class="p24-syllable-current"><strong>${esc(current)}</strong><div>${[1,2,3,4,5].map(n=>`<span><b>${esc(toneMarkedSyllable(current+n)||current)}</b><small>${n===5?'neutral':`tone ${n}`}</small></span>`).join('')}</div></div>
 <div class="p24-chart">${PINYIN_SYLLABLE_GROUPS.map(g=>`<section><h3>${g.initial==='none'?'Zero initial / y / w':esc(g.initial)}</h3><div>${g.forms.map(text=>action('pinyin-syllable',esc(text),'p24-chart-syllable '+(text===current?'selected':''),`data-syllable="${esc(text)}" aria-pressed="${text===current}"`)).join('')}</div></section>`).join('')}</div></section>`;
}
function tones(action,esc){
 return `<section class="simple-panel p24-panel"><p class="eyebrow">LEXICAL TONES</p><h2>Four tones and the neutral syllable</h2><p>Written lexical tones are not an exact depiction of connected spoken pitch.</p>
 <div class="p24-tone-list">${PINYIN_TONES.map(t=>`<article><div><strong>${esc(t.form)}</strong><small>${t.index===5?'neutral':`tone ${t.index}`}</small></div><div><h3 lang="zh-Hans">${esc(t.hanzi)} · ${esc(t.meaning)}</h3><p>${esc(t.cue)}</p>${speak(t.hanzi,action,esc)}</div></article>`).join('')}</div>
 ${action('pinyin-tab','Practice tone distinctions →','button primary',`data-section="practice" data-filter="tones"`)}</section>`;
}
function contrasts(action,esc){
 return `<section class="simple-panel p24-panel"><p class="eyebrow">HEAR AND ARTICULATE THE DIFFERENCE</p><h2>Consonant, final and nasal contrasts</h2>
 <div class="p24-contrast-grid">${PINYIN_CONTRASTS.map(p=>`<article><div class="p24-contrast-pair"><div><strong>${esc(p.left)}</strong><p lang="zh-Hans">${esc(p.leftHanzi)} · ${esc(p.leftPinyin)}</p><small>${esc(p.leftMeaning)}</small>${speak(p.leftHanzi,action,esc)}</div><span>↔</span><div><strong>${esc(p.right)}</strong><p lang="zh-Hans">${esc(p.rightHanzi)} · ${esc(p.rightPinyin)}</p><small>${esc(p.rightMeaning)}</small>${speak(p.rightHanzi,action,esc)}</div></div><p>${esc(p.explanation)}</p></article>`).join('')}</div>
 ${action('pinyin-tab','Practice sound distinctions →','button primary',`data-section="practice" data-filter="contrasts"`)}</section>`;
}
function spelling(action,esc){
 return `<section class="simple-panel p24-panel"><p class="eyebrow">PINYIN WRITING CONVENTIONS</p><h2>Where marks go, and why spellings change</h2>
 <div class="p24-rules">${PINYIN_RULES.map((r,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(r.title)}</h3><p>${esc(r.teaching)}</p><strong>${esc(r.samples)}</strong><p class="muted">${esc(r.conversion)}</p><small>${esc(r.pitfall)}</small></div></article>`).join('')}</div>
 ${action('pinyin-tab','Practice tone-mark spelling →','button primary',`data-section="practice" data-filter="spelling"`)}</section>`;
}
function sandhi(action,esc){
 return `<section class="simple-panel p24-panel"><p class="eyebrow">CONNECTED SPEECH</p><h2>Sandhi, neutral tone and real speech rhythm</h2><p>The written reference remains lexical even when pronunciation changes in a phrase. Device TTS is only a listening aid.</p>
 <div class="p24-sandhi">${PINYIN_SANDHI.map(r=>`<article><div><span class="eyebrow">${esc(r.title)}</span><h3>${esc(r.subtitle)}</h3><p>${esc(r.explanation)}</p><small>${esc(r.cue)}</small></div><div><strong lang="zh-Hans">${esc(r.hanzi)}</strong><p>Written: ${esc(r.lexical)}</p><p>Spoken guide: ${esc(r.spoken)}</p>${speak(r.hanzi,action,esc)}</div></article>`).join('')}</div>
 ${action('pinyin-tab','Review connected-speech questions →','button primary',`data-section="practice" data-filter="sandhi"`)}</section>`;
}
function practice({filter,index,feedback,typed},action,esc){
 const q=soundQuestion(index,filter);if(!q)return '';
 const audioOnly=q.kind==='choice'&&q.section==='contrasts'&&!!q.audioText;
 return `<section class="simple-panel p24-panel p24-exercise"><p class="eyebrow">PRONUNCIATION PRACTICE · NO NEW MASTERY ENGINE</p><h2>Understand, compare and write</h2>
 <label for="pinyin-filter">Practice focus</label><select id="pinyin-filter"><option value="all" ${filter==='all'?'selected':''}>All questions</option>${PINYIN_SECTIONS.filter(x=>['contrasts','tones','spelling','sandhi','practice'].includes(x.id)).map(x=>`<option value="${x.id}" ${filter===x.id?'selected':''}>${esc(x.title)}</option>`).join('')}</select>
 <div class="p24-exercise-card"><p class="eyebrow">Question ${index+1} · ${esc(q.section)}</p><h3>${esc(q.prompt)}</h3>
 ${audioOnly?`<div class="p24-audio-first"><p>Listen before viewing the answer. The voice is synthesized by your device.</p>${speak(q.audioText,action,esc,'▶ Hear the word')}</div>`:q.displayText?`<p class="p24-exercise-target" lang="${q.kind==='pinyin'?'zh-Hans':'en'}">${esc(q.displayText)}</p>`:''}
 ${q.kind==='pinyin'&&q.audioText?speak(q.audioText,action,esc):''}
 ${feedback?`<div class="reader-feedback ${feedback.correct&&!feedback.assisted?'correct':'incorrect'}" role="status"><strong>${feedback.correct&&!feedback.assisted?'Correct answer':'Review the teaching'}</strong><p>${esc(feedback.message)}</p><p><strong>Expected:</strong> ${esc(q.answer)}</p>${audioOnly?`<p lang="zh-Hans">${esc(q.audioText)}</p>`:''}<p>${esc(q.explanation)}</p></div>
 <div class="button-row">${action('pinyin-next','Next example →','button primary')}${action('pinyin-tab','See teaching notes','button outline small',`data-section="${q.section}"`)}</div>`:
 q.kind==='choice'?`<div class="choice-list">${q.options.map((o,i)=>action('pinyin-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(o)}`,'choice',`data-option="${esc(o)}"`)).join('')}</div>${action('pinyin-reveal','Reveal with explanation','button outline small')}`:
 `<div class="answer-entry"><label for="pinyin-answer-entry">${q.kind==='typed'?'Use written tone marks':'Write full pinyin with tone marks or numbers'}</label><input id="pinyin-answer-entry" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(typed)}" placeholder="Enter Pinyin"></div><div class="button-row">${action('pinyin-answer','Check answer →','button primary',typed.trim()?'':'disabled')}${action('pinyin-reveal','Reveal with explanation','button outline small')}</div>`}
 </div><p class="muted">Uses the existing written-answer rules. It does not award review grades or evaluate spoken pronunciation.</p></section>`;
}
export function renderPinyinScreen(s,action,esc,title,gated){
 return `${title('PINYIN & MANDARIN SOUNDS','Learn how Chinese sounds work.','Initials, finals, the four tones, syllable formation, spelling rules, sound differences and natural connected speech.')}${gated()}
 <section class="simple-panel p24-overview"><div>${[[PINYIN_INITIALS.length,'initials'],[PINYIN_FINALS.length,'finals'],[PINYIN_SYLLABLE_GROUPS.reduce((n,g)=>n+g.forms.length,0),'illustrative syllables'],[PINYIN_CONTRASTS.length,'contrast pairs']].map(x=>`<span><strong>${x[0]}</strong><small>${x[1]}</small></span>`).join('')}</div><p>The original teaching text and optional device Chinese speech are aids for learning. No human recordings or speech scoring are included.</p></section>
 ${tabs(s.section,action,esc)}
 ${s.section==='sounds'||s.section==='finals'?soundGrid(s.section,s.selectedSound,action,esc):s.section==='syllables'?syllables(s.selectedSyllable,action,esc):s.section==='tones'?tones(action,esc):s.section==='contrasts'?contrasts(action,esc):s.section==='spelling'?spelling(action,esc):s.section==='sandhi'?sandhi(action,esc):practice(s,action,esc)}
 <section class="simple-panel p24-models"><h2>Sounds in real words</h2><div>${PINYIN_WORD_MODELS.map(w=>`<div><strong lang="zh-Hans">${esc(w.hanzi)}</strong><span>${esc(w.pinyin)}</span><small>${esc(w.meaning)}</small>${speak(w.hanzi,action,esc)}</div>`).join('')}</div>
 <div class="button-row">${action('pinyin-tab','Practice pronunciation →','button primary',`data-section="practice"`)}${action('pinyin-back','Return to learning →','button outline')}</div></section>`;
}