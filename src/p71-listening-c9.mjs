/** P71–P75 source-owned transcript-hidden listening-first reader.
 * This is a view of original question sources, not a second evaluator,
 * a recorded listening test, a certified score, or a speech-recognition service.
 */
import {beginnerQuestion} from './beginner-reading.mjs';
import {beginnerWritingTask} from './beginner-reading.mjs';
export const P71_BLIND_MODES=Object.freeze([
 ['beginner-detail','Identify the stated fact'],
 ['beginner-reason','Explain the reason'],
 ['beginner-sequence','Trace the consequence']
]);
export function p71ListeningPart(story,part){
 if(story?.beginner?.source!=='original-p71'||!Number.isInteger(part)||part<0||part>1)return null;
 const lines=story.lines.slice(part*5,part*5+5);
 return lines.length===5?lines.map(l=>l.hanzi).join(' '):null;
}
export function p71BlindStudyPrompt(story,mode){
 if(story?.beginner?.source!=='original-p71'||!P71_BLIND_MODES.some(([id])=>id===mode))return null;
 const original=beginnerQuestion(story,mode);
 if(!original||original.kind!=='choice')return null;
 return original;
}
export function renderP71BlindListening(story,mode,result,act,esc){
 const q=p71BlindStudyPrompt(story,mode);
 if(!q)return '';
 const completed=Boolean(result);
 return '<section class="c9-p71-blind" aria-labelledby="c9-p71-blind-title">'+
 '<p class="c9-eyebrow">P71–P75 · ORIGINAL LISTENING-FIRST READER</p>'+
 '<h1 id="c9-p71-blind-title">Listen before looking at the Chinese</h1>'+
 '<p>Source: '+esc(story.title)+'. Listen to both consecutive parts with a Mandarin voice installed on your device. The original transcript, romanization, source translations and answer evidence are withheld until the question is submitted or you deliberately open the source. Playback cannot be verified; this is a reader response following a listening attempt, NOT a certified independent listening score, recorded audio exam or proof the device played sound.</p>'+
 '<div class="c9-p71-blind-player" role="group" aria-label="Source speech playback">'+
 act('c9-p71-blind-play','Play part 1 · original sentences 1–5','c9-button c9-button--primary','data-part="0"')+
 act('c9-p71-blind-play','Play part 2 · original sentences 6–10','c9-button c9-button--secondary','data-part="1"')+
 act('speech-stop','Stop device speech','c9-button c9-button--quiet')+
 '</div>'+
 '<p class="c9-p71-blind-warning">Device speech synthesis is optional. If Mandarin speech is unavailable, open the full written source as assisted practice instead of guessing based on nonexistent audio. No audio or speaking history is created.</p>'+
 '<div class="c9-p71-blind-tabs" role="group" aria-label="Original reading question modes">'+
 P71_BLIND_MODES.map(([id,label])=>act('c9-p71-blind-mode',esc(label),
  'c9-button '+(mode===id?'c9-button--primary':'c9-button--secondary')+' c9-button--small',
  'data-mode="'+id+'" aria-pressed="'+(mode===id)+'"')).join('')+'</div>'+
 '<div class="c9-p71-blind-exercise story-practice" aria-label="Original source question">'+
 '<p class="c9-eyebrow">QUESTION FROM THE ORIGINAL READER</p>'+
 '<h2>'+esc(q.prompt)+'</h2>'+
 (completed?'<div class="reader-feedback '+(result.correct?'correct':'incorrect')+'" role="status">'+
  '<strong>'+(result.correct?'Correct response to original question':'Review the source evidence')+'</strong>'+
  '<p>'+esc(result.message||'Original reader graded the answer.')+'</p>'+
  '<p>Expected answer: <strong>'+esc(result.reference)+'</strong></p>'+
  '<p>'+esc(q.explanation)+'</p>'+
  '<div class="c9-p71-blind-evidence"><span>Original evidence · sentence '+(q.evidence+1)+'</span>'+
  '<p lang="zh-Hans">'+esc(q.evidenceLine.hanzi)+'</p><p>'+esc(q.evidenceLine.pinyin)+'</p><p>'+esc(q.evidenceLine.english)+'</p></div>'+
  '<p>'+(result.assisted?'Original reader recorded this attempt as assisted.':
  'The original reader recorded an unassisted answer. Actual listening and pronunciation were NOT measured.')+'</p></div>':
  '<div class="choice-list">'+q.options.map((answer,i)=>
   '<button type="button" class="choice" data-action="story-answer" data-option="'+esc(answer)+'">'+
   '<span>'+String.fromCharCode(65+i)+'</span>'+esc(answer)+'</button>').join('')+'</div>')+
 '<div class="c9-p71-blind-footer">'+
 (completed?act('story-retry','Try this original question again','c9-button c9-button--secondary'):
 act('story-skip','Reveal reference · original reader records assistance','c9-button c9-button--secondary'))+
 act('c9-p71-blind-reveal',completed?'Read full original passage →':'Open written transcript · marks unanswered practice assisted',
  'c9-button c9-button--secondary')+
 (completed?act('c9-p71-workshop-writing','Rebuild the exact source conclusion in Sentence Workshop →',
  'c9-button c9-button--primary','data-id="'+esc(story.id)+'"'):'')+
 '</div></div>'+
 (completed?'<section class="c9-p71-blind-oral">'+
 '<h2>Speak your reason aloud, then compare it with the source</h2>'+
 '<p>In Mandarin, explain what was first assumed, which evidence changed the conclusion and what remains uncertain. Use sentences from the original source as a reference after your attempt. The browser does not listen, record, check, score or attest your speech.</p>'+
 act('c9-p71-blind-play','Hear original supporting sentence','c9-button c9-button--secondary','data-part="2"')+
 '<p>Evidence reference is shown only after the original question was answered. Spoken output remains self-assessed.</p></section>':'')+
 '</section>';
}

/** Source-owned study route, never a mastery or listening-verification status. */
export function p71PracticeContinuity(story,state){
 if(story?.beginner?.source!=='original-p71')return null;
 const modes=P71_BLIND_MODES.map(([mode,label])=>Object.freeze({mode,label,
  independentRecorded:(state.readingEvents||[]).some(e=>e.storyId===story.id&&e.mode===mode&&e.correct&&!e.assisted)}));
 const task=beginnerWritingTask(story.id);
 const writingRecorded=Boolean(task&&(state.sentenceEvents||[]).some(e=>e.taskId===task.id&&e.correct&&!e.assisted));
 const next=modes.find(s=>!s.independentRecorded);
 return Object.freeze({storyId:story.id,modes:Object.freeze(modes),writingRecorded,
  nextMode:next?.mode||(!writingRecorded?'beginner-writing':null),
  note:'Historical original reader and sentence evidence only; no verified listening, speech, mastery or editorial approval'});
}
