// P29 original pathway interface. Reuses the host application actions and
// existing sentenceEvents. Study bands do not assert official HSK coverage.
import {PATHWAY_BANDS,PATHWAY_MISSIONS,PATHWAY_MODES,findPathwayMission,pathwayQuestion,
 pathwayStats,pathwayNext,pathwayResume,pathwayDailyRoute,pathwayConnections,pathwayTaskId,pathwayIndependentTransfer} from './pathway-course.mjs';
const names={meaning:'Read & understand',cloze:'Choose in context',listening:'Listen for meaning',production:'Write Chinese'};
export function pathwayHomePanel(state,act,esc){
 const mission=pathwayResume(state),stats=pathwayStats(state,mission.band);
 return `<section class="simple-panel p29-today"><div class="panel-heading"><div><p class="eyebrow">NINE-BAND MANDARIN STUDY PATH</p><h2>Continue your connected course</h2></div><span class="muted">${PATHWAY_MISSIONS.length} original missions · ${stats.attempts} attempts in band ${mission.band}</span></div>
 <p>Practical pathways connect character study, vocabulary, grammar, sentences, reading, optional device listening and Chinese production. Bands are original learning groups—not official HSK 3.0 assignments.</p>
 <div class="p29-home-action"><div><strong>Band ${mission.band} · ${esc(mission.title)}</strong><span>${esc(PATHWAY_BANDS[mission.band-1].purpose)}</span></div><div class="button-row">${act('pathway-select','Continue this mission →','button primary',`data-id="${mission.id}"`)}${act('pathway-open','Browse all nine bands →','button outline')}</div></div></section>`;
}
function missionCard(m,state,act,esc,selected){
 const events=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('pathway:'+m.id+':'));
 const correct=new Set(events.filter(e=>e.correct&&!e.assisted).map(e=>e.taskId.split(':').at(-1)));
 return act('pathway-select',`<span class="p29-mission-num">${String(m.numberInBand).padStart(2,'0')}</span><span class="p29-mission-copy"><strong>${esc(m.title)}</strong><small>${esc(m.purpose)} · ${correct.size} / ${PATHWAY_MODES.length} skills independently answered</small></span><span aria-hidden="true">→</span>`,
  'p29-mission-card '+(selected?'selected':''),`data-id="${m.id}"`);
}
function libraryLinkList(m,act,esc){
 const link=pathwayConnections(m);
 const items=[];
 if(link.grammar)items.push(['Grammar lesson',act('grammar-select',esc(link.grammar.title)+' →','button outline small',`data-id="${link.grammar.id}"`)]);
 if(link.words.length)items.push(['Vocabulary',link.words.map(w=>act('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.senses[0])}`,'button outline small',`data-id="${w.key}"`)).join('')]);
 if(link.characters.length)items.push(['Characters',link.characters.map(l=>act('open-lesson',`<span lang="zh-Hans">${esc(l.hanzi)}</span> · ${esc(l.meaning)}`,'button outline small',`data-id="${l.id}"`)).join('')]);
 if(link.sentences.length)items.push(['Contextual sentences',link.sentences.map(s=>act('sentence-select',`<span lang="zh-Hans">${esc(s.hanzi)}</span>`,'button outline small',`data-id="${s.id}"`)).join('')]);
 if(link.reading)items.push(['Readings',act('open-story-link',esc(link.reading.title)+' →','button outline small',`data-id="${link.reading.id}"`)]);
 if(link.dialogue)items.push(['Dialogues',act('hub-dialogue',esc(link.dialogue.title)+' →','button outline small',`data-id="${link.dialogue.id}"`)]);
 return `<section class="p29-connections"><div class="panel-heading"><div><p class="eyebrow">CONTINUE WITH YOUR REAL COURSE</p><h3>Connected study material</h3></div></div>
 ${items.map(([label,markup])=>`<div class="p29-link-row"><strong>${label}</strong><div>${markup}</div></div>`).join('')}
 <div class="button-row">${act('pathway-open-words','Browse vocabulary →','button outline')}${act('pathway-open-grammar','Grammar course →','button outline')}${act('pathway-open-readings','Connected readings →','button outline')}${act('pathway-open-pinyin','Pinyin and tones →','button outline')}</div></section>`;
}
function authoredLines(m,ui,question,act,esc){
 if(ui.feedback||!ui.focus){
  return `<section class="p29-authored-lines">${m.lines.map((line,i)=>`<article class="p29-authored-line"><span class="eyebrow">CONTEXT ${i+1} / 3</span>
   <h3 lang="zh-Hans">${esc(line.hanzi)}</h3>${ui.showPinyin?`<p class="p29-pinyin">${esc(line.pinyin)}</p>`:''}
   ${ui.showEnglish?`<p class="p29-english">${esc(line.english)}</p>`:''}
   ${act('speak','▶ Device audio','button outline small',`data-text="${esc(line.hanzi)}"`)}</article>`).join('')}</section>`;
 }
 if(ui.mode==='meaning')return `<section class="p29-authored-lines p29-focus-lines">${m.lines.map((line,i)=>
  `<article class="p29-authored-line"><span class="eyebrow">READ ${i+1} / 3</span><h3 lang="zh-Hans">${esc(line.hanzi)}</h3></article>`).join('')}</section>`;
 return `<section class="p29-covered"><p>${ui.mode==='listening'?'The Chinese text is hidden. Play the device Mandarin voice in the exercise below.':
  ui.mode==='production'?'The model is hidden. Write the Chinese sentence from its English meaning.':
  'The original source is hidden. Use the masked sentence in the exercise.'}</p></section>`;
}
function practiceSection(m,ui,act,esc){
 const q=pathwayQuestion(m.id,ui.mode),done=ui.feedback,transfer=pathwayIndependentTransfer(m);
 return `<section class="p29-practice"><div class="panel-heading"><div><p class="eyebrow">FOUR CONNECTED LEARNING SKILLS</p><h3>Apply the scene</h3></div><span class="muted">${ui.focus?'Focused independent practice':'Open-book teaching mode'}</span></div>
 <div class="p29-modes" role="group">${PATHWAY_MODES.map(mode=>act('pathway-mode',esc(names[mode]),'p29-mode '+(ui.mode===mode?'active':''),`data-mode="${mode}" aria-pressed="${ui.mode===mode}"`)).join('')}</div>
 <div class="p29-task"><p class="eyebrow">${esc(names[ui.mode])}</p><h4>${esc(q.prompt)}</h4>
 ${q.context?`<div class="p29-context" lang="${q.kind==='hanzi'?'en':'zh-Hans'}">${esc(q.context)}</div>`:''}
 ${ui.mode==='listening'?`<div class="button-row">${act('speak','▶ Play Mandarin sentence','button primary',`data-text="${esc(q.audioText)}"`)}<span class="muted">Requires an installed Mandarin device voice</span></div>`:''}
 ${done?`<div class="p29-result ${done.correct&&!done.assisted?'correct':'needs-review'}" role="status"><strong>${done.correct&&!done.assisted?'Independent taught answer accepted':'Study this answer and the explanation'}</strong>
 <p>${esc(done.message||'Compare your answer with the original model.')}</p><h4 lang="zh-Hans">${esc(q.mode==='production'?m.writing.hanzi:q.mode==='listening'?m.lines[0].hanzi:q.mode==='cloze'?m.lines.find(l=>l.hanzi.includes(m.cloze))?.hanzi||m.lines[1].hanzi:m.lines[q.evidence?m.question.evidence:0].hanzi)}</h4>
 <p>${esc(q.explanation)}</p>${q.evidence?`<p class="p29-evidence">Evidence: ${esc(q.evidence.hanzi)} · ${esc(q.evidence.english)}</p>`:''}
 <details class="p29-transfer"><summary>Use this Mandarin in a different situation · ungraded</summary>
 <p><strong>Situation:</strong> ${esc(transfer.context)}</p>
 <p><strong>Independent response:</strong> ${esc(transfer.task)}</p>
 <p class="muted">Try speaking aloud or composing a private response. This optional task stores no answers, creates no grades and makes no official HSK claim.</p>
 <details><summary>Compare original Chinese source after your attempt</summary>
 <p lang="zh-Hans">${esc(transfer.witness.hanzi)}</p><p>${esc(transfer.witness.pinyin)} · ${esc(transfer.witness.english)}</p>
 <p lang="zh-Hans">${esc(transfer.contrast.hanzi)}</p><p>${esc(transfer.contrast.pinyin)} · ${esc(transfer.contrast.english)}</p></details>
 <h5>Self-check, not an assessment</h5><ul>${transfer.selfCheck.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></details>
 <div class="button-row">${act('pathway-next-skill','Next skill →','button primary')}${act('pathway-next-mission','Next mission →','button outline')}</div></div>`:
 q.kind==='hanzi'?`<label class="p29-writing-label" for="pathway-write">Write the model in Simplified Chinese</label><textarea id="pathway-write" rows="3" placeholder="输入中文句子" autocomplete="off" autocapitalize="off" spellcheck="false">${esc(ui.typed)}</textarea>
 <div class="button-row">${act('pathway-answer','Check Chinese →','button primary',ui.typed.trim()?'':'disabled')}${act('pathway-hint','Show a Pinyin hint · assisted','button outline small')}${act('pathway-reveal','Reveal model · assisted','button outline small')}</div>`:
 `<div class="choice-list">${q.options.map((option,i)=>act('pathway-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(option)}`,'choice',`data-option="${esc(option)}"`)).join('')}</div>
 <div class="button-row">${act('pathway-hint','Pinyin cue · assisted','button outline small')}${act('pathway-reveal','Reveal model · assisted','button outline small')}</div>`}
 ${ui.assisted&&!done?`<p class="p29-hint">Pinyin support: ${esc((q.mode==='listening'?m.lines[0]:q.mode==='production'?m.writing:m.lines[1]).pinyin)}</p>`:''}
 </div><p class="muted">Responses reuse the app's existing supplementary Sentence Workshop history. An answered practice item is not proof of official HSK completion or scheduled character mastery.</p></section>`;
}
export function renderPathwayScreen(ui,act,esc,title,gated){
 const m=findPathwayMission(ui.id)||PATHWAY_MISSIONS[0],band=PATHWAY_BANDS[ui.band-1]||PATHWAY_BANDS[0];
 const stats=pathwayStats(ui.learner,band.number);
 const plan=pathwayDailyRoute(ui.learner,band.number,ui.minutes);
 return `${title('PROGRESSIVE MANDARIN PATHWAY','Learn Chinese with a connected plan.','Nine app-authored study bands inspired by increasingly demanding communication tasks. No official HSK 3.0 syllabus mapping or exam certification is claimed.')}${gated()}
 <section class="simple-panel p29-disclosure"><strong>Original curriculum, not official HSK levels</strong><p>Band numbers organize these ${PATHWAY_MISSIONS.length} authored sample missions. Bands 7–9 are advanced exploration, not comprehensive advanced teaching or exam preparedness. You can freely access any band and your real character, word, grammar and reading histories remain separate.</p></section>
 <div class="p29-bands" role="group" aria-label="Choose a study band">${PATHWAY_BANDS.map(b=>{const d=pathwayStats(ui.learner,b.number);
 return act('pathway-band',`<span class="p29-band-number">${b.number}</span><strong>${esc(b.title)}</strong><small>${d.observedMissions} / ${d.missions} with independent meaning and writing answers</small>`,
 'p29-band '+(b.number===band.number?'active':''),`data-band="${b.number}"`)}).join('')}</div>
 <section class="simple-panel p29-intro"><div class="panel-heading"><div><p class="eyebrow">STUDY BAND ${band.number} / 9 · ${esc(band.status.toUpperCase())}</p><h2>${esc(band.title)}</h2></div><span class="muted">${stats.attempts} practice attempts · ${stats.begun} missions attempted</span></div>
 <p>${esc(band.purpose)}</p><small>${esc(band.note)}</small></section>
 <div class="p29-layout"><aside class="p29-sidebar">
 <section class="p29-schedule"><div class="panel-heading"><h3>Your next study route</h3><span class="muted">Based on actual attempt records</span></div>
 <div class="p29-budget">${[10,20,30].map(n=>act('pathway-budget',`${n} min`,'p29-budget-btn '+(ui.minutes===n?'active':''),`data-minutes="${n}"`)).join('')}</div>
 <p>${plan.missions.length} original missions suggested for this session; durations are study budgets, not timed tracking.</p>
 <ol>${plan.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 ${plan.missions.map((t,i)=>act('pathway-select',`${i+1}. ${esc(t.title)} →`,'p29-plan-mission',`data-id="${t.id}"`)).join('')}
 </section><div class="p29-mission-list"><h3>Four missions in this band</h3>
 ${PATHWAY_MISSIONS.filter(t=>t.band===band.number).map(t=>missionCard(t,ui.learner,act,esc,t.id===m.id)).join('')}</div>
 <div class="button-row">${act('pathway-prev-band','← Previous band','button outline small',band.number===1?'disabled':'')}${act('pathway-next-band','Next band →','button outline small',band.number===9?'disabled':'')}</div></aside>
 <article class="p29-lesson"><div class="p29-lesson-heading"><p class="eyebrow">ORIGINAL LEARNING MISSION ${m.id.toUpperCase()} · BAND ${m.band}</p>
 <h2>${esc(m.title)}</h2><p>${esc(m.purpose)}${!ui.focus||ui.feedback?' · '+esc(m.teaching):''}</p>
 <div class="button-row">${act('pathway-focus',ui.focus?'Exit focused recall':'Start focused recall','button primary')}
 ${act('pathway-toggle-pinyin',ui.showPinyin?'Hide Pinyin':'Show Pinyin','button outline small')}
 ${act('pathway-toggle-english',ui.showEnglish?'Hide translations':'Show translations','button outline small')}</div></div>
 ${authoredLines(m,ui,pathwayQuestion(m.id,ui.mode),act,esc)}
 ${!ui.focus||ui.feedback?`<section class="p29-teaching"><h3>What to notice</h3><p>${esc(m.teaching)}</p><p>Three connected utterances establish the setting, introduce new information, and present an outcome. Compare what each utterance contributes.</p></section>`:""}
 ${practiceSection(m,ui,act,esc)}
 <div class="p29-lesson-nav">${act('pathway-next-mission','Continue to the next original mission →','button primary')}${act('pathway-workshop','Write this sentence in Sentence Workshop →','button outline')}</div>
 ${!ui.focus||ui.feedback?libraryLinkList(m,act,esc):""}</article></div>`;
}