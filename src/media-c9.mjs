/**
 * C9-09 Clean Modular Scholar — Reading, Listening & Conversations.
 * Visual and read-only projections of original source content. All activity
 * evaluation and storage remain in app.mjs native action dispatch.
 */
import {STORIES} from './stories.mjs';
import {DIALOGUES} from './dialogues.mjs';
import {P34_LISTENING} from './p34-course.mjs';
import {p34StudyStats,p34NextReading,p34NextListening} from './p34-screen.mjs';

const count=(value,label)=>value+' '+label+(value===1?'':'s');
const intro=(category,title,description)=>'<header class="c9-media-title"><p class="c9-eyebrow">'+category+' · ORIGINAL MANDARIN</p><h1>'+title+'</h1><p>'+description+'</p></header>';
const fact=(value,description)=>'<div class="c9-media-fact"><strong>'+value+'</strong><span>'+description+'</span></div>';
const link=(route,label)=>'<a class="c9-button c9-button--secondary" href="#/'+route+'">'+label+'</a>';
function renderedEntry(item,kind,selected,act,esc){
 const description=kind==='story'
  ?item.theme+(item.extended?' · Connected paragraphs':item.beginner?' · Beginner text':' · Short reading')
  :count(item.lines.length,'speaking turn')+(item.p34?' · Listening-first':' · Dialogue');
 const actionName=kind==='story'?'c9-media-open-story':'c9-media-open-dialogue';
 return '<article class="c9-media-entry'+(selected===item.id?' is-current':'')+'"><span class="c9-media-entry-type">'+(kind==='story'?'READING':'CONVERSATION')+'</span>'+
 '<h3>'+esc(item.title)+'</h3><p>'+esc(description)+'</p>'+
 act(actionName,selected===item.id?'Currently selected · view below':'Open source →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(item.id)+'"')+'</article>';
}
export function renderC9ReadingHub(state,story,act,esc){
 const attempted=new Set((state.readingEvents||[]).map(e=>e.storyId));
 const independent=new Set((state.readingEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.storyId));
 const p34=p34StudyStats(state),next=p34NextReading(state);
 const first=STORIES.filter(s=>!attempted.has(s.id)).slice(0,3);
 const related=[story,...first,...STORIES.filter(s=>s.theme===story.theme)].filter((s,i,a)=>s&&a.findIndex(x=>x.id===s.id)===i).slice(0,6);
 const facts='<div class="c9-media-facts">'+fact(STORIES.length,'Original readings')+
  fact(attempted.size,'Readings attempted')+fact(independent.size,'With an independent correct answer')+'</div>';
 return '<div class="c9-media-overview">'+intro('READING WORKSPACE','Read Mandarin in context',
 'Work through complete authored passages. Source words, language support and exercises use the original reading system.')+
 facts+'<section class="c9-media-lead c9-unified-card"><div><p class="c9-eyebrow">CURRENT READING</p><h2>'+esc(story.title)+'</h2>'+
 '<p>'+esc(story.theme)+' · '+story.lines.length+' source sentences. Translations and vocabulary hints are optional assisted support.</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+act('story-focus-next','Focus a sentence →','c9-button c9-button--primary')+
 link('dialogues','Continue with conversation')+'</div></div>'+
 '<div class="c9-media-lead-aside"><span>P34 READING + LISTENING</span>'+
 '<strong>'+p34.readings+' / 25</strong><p>Reading passages with independent correct practice</p>'+
 (next?act('p34-open-reading','Next original P34 reading →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
 '</div></section>'+
 '<details class="c9-media-discovery"><summary>Browse nearby readings <span>'+related.length+' selected source texts</span></summary>'+
 '<div class="c9-media-entry-grid">'+related.map(s=>renderedEntry(s,'story',story.id,act,esc)).join('')+'</div></details>'+
 '<p class="c9-media-provenance c9-unified-source-note">Original demonstration texts. “Correct independent answer” is activity evidence, not a passed reading level or official HSK score.</p></div>';
}
export function renderC9DialogueHub(state,dialogue,act,esc){
 const attempted=new Set((state.dialogueEvents||[]).map(e=>e.dialogueId));
 const independent=new Set((state.dialogueEvents||[]).filter(e=>e.correct&&!e.assisted).map(e=>e.dialogueId));
 const listening=p34StudyStats(state),next=p34NextListening(state);
 const related=[dialogue,...DIALOGUES.filter(d=>!attempted.has(d.id)),...DIALOGUES.filter(d=>d.p34)].filter((d,i,a)=>d&&a.findIndex(x=>x.id===d.id)===i).slice(0,6);
 return '<div class="c9-media-overview">'+intro('LISTENING & CONVERSATION','Listen. Understand. Respond.',
 'Hear each turn using optional local Mandarin speech synthesis; answer before revealing the transcript or translations.')+
 '<div class="c9-media-facts">'+fact(DIALOGUES.length,'Original dialogues')+
 fact(attempted.size,'Dialogues with attempts')+fact(independent.size,'With an independent correct answer')+'</div>'+
 '<section class="c9-media-lead c9-unified-card"><div><p class="c9-eyebrow">CURRENT CONVERSATION</p><h2>'+esc(dialogue.title)+'</h2>'+
 '<p>'+count(dialogue.lines.length,'speaking turn')+(dialogue.p34?' · P34 listening-first transcript protection active.':' · Source turns and optional translation support.')+'</p>'+
 '<div class="c9-media-lead-actions c9-unified-actions">'+act('speak','Play whole exchange via device voice','c9-button c9-button--primary','data-text="'+esc(dialogue.lines.map(l=>l.hanzi).join(' '))+'"')+
 link('stories','Browse reading')+'</div></div><div class="c9-media-lead-aside">'+
 '<span>P34 LISTENING EVIDENCE</span><strong>'+listening.listening+' / '+P34_LISTENING.length+'</strong>'+
 '<p>Listening situations with independent correct contextual answers</p>'+
 (next?act('p34-open-listening','Next authored listening situation →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(next.id)+'"'):'')+
 '</div></section>'+
 '<details class="c9-media-discovery"><summary>Browse conversations <span>'+related.length+' source conversations</span></summary>'+
 '<div class="c9-media-entry-grid">'+related.map(d=>renderedEntry(d,'dialogue',dialogue.id,act,esc)).join('')+'</div></details>'+
 '<p class="c9-media-provenance c9-unified-source-note">Device TTS is not native-recorded audio. Transcript or hints produce assisted evidence through the existing P34 native controls.</p></div>';
}
export function renderC9TurnNavigator(d,active,act,esc){
 return '<nav class="c9-media-turn-nav" aria-label="Conversation turn navigation">'+
 '<div><p class="c9-eyebrow">FOLLOW THE EXCHANGE</p><strong>Turn '+(active+1)+' / '+d.lines.length+'</strong>'+
 '<span>Speaker '+esc(d.lines[active]?.speaker||'A')+' · navigation does not reveal hidden listening-first text</span></div>'+
 '<div class="c9-inline">'+act('c9-media-turn','← Previous turn','c9-button c9-button--secondary c9-button--small','data-dir="-1" '+(active===0?'disabled':''))+
 act('c9-media-turn','Next turn →','c9-button c9-button--secondary c9-button--small','data-dir="1" '+(active===d.lines.length-1?'disabled':''))+'</div></nav>';
}
export function renderC9ReaderIntro(lesson,act,esc){
 return intro('SENTENCE READING','Read one sentence carefully',
 'Keep the original comprehension and cloze checks separate from scheduled Review. Source details and translation remain behind native reveal controls.')+
 '<div class="c9-media-reader-source"><span class="c9-eyebrow">ORIGINAL CHARACTER LESSON</span>'+
 '<strong><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span> '+esc(lesson.meaning)+'</strong>'+
 '<span>'+esc(lesson.pinyin)+'</span>'+
 '<div class="c9-inline">'+act('speak','Listen using device voice','c9-button c9-button--secondary c9-button--small','data-text="'+esc(lesson.sentence.hanzi)+'"')+
 act('c9-reader-character','Related character study →','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</div></div>';
}
