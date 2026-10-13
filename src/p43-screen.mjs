/** P43 original learner production workspace; strictly UI-only composition.
 * The independent essay, versions and review checkboxes are TAB MEMORY ONLY:
 * no IndexedDB writer, no unauthorized persisted private answer, no AI grader.
 */
import {P43_UNITS,P43_REVIEW_CRITERIA} from './p43-course.mjs';
import {P41_PASSAGES} from './p41-readings.mjs';
import {P42_SCENES} from './p42-course.mjs';
import {GRAMMAR_LESSONS} from './grammar-course.mjs';
import {WORDS} from './lexicon.mjs';
const stageLabel=stage=>stage===1?'Supported description':stage===2?'Evidence-based explanation':'Independent comparison and conclusion';
export function p43Overview(act,esc,{compact=false,selected='',filter='all',query=''}={}){
 const q=String(query).toLocaleLowerCase().trim();
 const items=P43_UNITS.filter(u=>(filter==='all'||u.stage===Number(filter))&&
 (!q||[u.title,u.theme,u.goal,u.sourceClaim,u.misconception].join(' ').toLocaleLowerCase().includes(q)));
 return '<section class="p43-overview" aria-label="P43 original independent production course">'+
 '<div class="p43-hero"><p class="eyebrow">P43 · ORIGINAL INTERMEDIATE WRITING & SPOKEN PRODUCTION</p>'+
 '<h2>Write independently. Revise against source evidence.</h2>'+
 '<p>Twelve original two-paragraph writing journeys, 120 complete model sentences, 24 optional native sentence reconstructions, staged self-review, evidence-linked P41 reading and P42 conversation handoffs. No open-ended or spoken proficiency grading is claimed.</p>'+
 '<p class="muted">Drafts and revision snapshots remain only in this open browser tab until refreshed or closed. They are not learner-progress records or automatic backups.</p></div>'+
 (compact?act('p43-enter','Open the independent writing studio →','button primary'):
 '<div class="p43-filters" role="group" aria-label="Writing stage">'+
 [['all','All stages'],['1','Description'],['2','Source evidence'],['3','Comparisons']].map(([key,label])=>
 act('p43-filter',label,'p43-filter '+(filter===key?'active':''),'data-filter="'+key+'" aria-pressed="'+(filter===key)+'"')).join('')+'</div>'+
 '<label for="p43-search">Find writing topic or purpose</label>'+
 '<input id="p43-search" type="search" autocomplete="off" value="'+esc(query)+'" placeholder="e.g. survey, volunteer, source evidence">'+
 '<div class="p43-catalog">'+items.map(u=>act('p43-open','<small>UNIT '+String(u.sequence).padStart(2,'0')+' · '+esc(stageLabel(u.stage))+'</small>'+
 '<strong>'+esc(u.title)+'</strong><span>'+esc(u.goal)+'</span>',
 'p43-unit '+(selected===u.id?'active':''),'data-id="'+u.id+'"')).join('')+'</div>'+
 (!items.length?'<p class="muted">No matching writing units.</p>':'')
 )+'</section>';
}
export function p43ProductionStudio(u,act,esc,{draft='',revisions=[],compare=-1,reveal=false,step='compose',rubric=[],pending='',showEvidence=false}={}){
 if(!u)return '<p class="muted">Select an authored production unit.</p>';
 const passage=P41_PASSAGES.find(p=>p.id===u.readingId);
 const dialogue=P42_SCENES.find(d=>d.id===u.dialogueId);
 const patterns=u.grammarIds.map(id=>GRAMMAR_LESSONS.find(g=>g.id===id)).filter(Boolean);
 const words=WORDS.filter(w=>w.hanzi.length>1&&u.lines.some(l=>l.hanzi.includes(w.hanzi))).slice(0,6);
 const selected=Number(compare);
 const selectedDraft=revisions[selected];
 const count=Array.from(draft).filter(ch=>/\p{Script=Han}/u.test(ch)).length;
 return '<section class="p43-studio" aria-label="Independent paragraph writing and oral preparation">'+
 '<div class="p43-studio-top"><div><p class="eyebrow">P43 · UNIT '+u.sequence+' / '+P43_UNITS.length+' · '+esc(stageLabel(u.stage))+'</p>'+
 '<h2>'+esc(u.title)+'</h2><p>'+esc(u.goal)+'</p></div>'+
 act('p43-next','Next topic →','button outline')+'</div>'+
 (pending?'<div class="p43-warning" role="status"><strong>Unsaved work in this tab</strong><p>Changing topics will clear the current unsent draft and its in-session snapshots. This does not change any persisted study records.</p>'+
 '<div class="button-row">'+act('p43-stay','Keep my current work','button outline')+
 act('p43-switch-confirm','Discard this work and switch','button primary')+'</div></div>':'')+
 '<div class="p43-tabs" role="group" aria-label="Production steps">'+
 [['plan','1. Plan'],['compose','2. Compose'],['revise','3. Revise'],['speak','4. Speak']].map(([v,name])=>
 act('p43-step',name,'p43-tab '+(step===v?'active':''),'data-step="'+v+'" aria-pressed="'+(step===v)+'"')).join('')+'</div>'+
 (step==='plan'?'<div class="p43-plan"><h3>Plan around the original sources</h3>'+
 '<p><strong>Source claim:</strong> '+esc(u.sourceClaim)+'</p>'+
 '<div class="p43-columns"><div><h4>Paragraph structure</h4><ol>'+u.planning.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>'+
 '<div><h4>Avoid this false inference</h4><p>'+esc(u.misconception)+'</p>'+
 '<h4>Revision target</h4><p>'+esc(u.revision)+'</p></div></div>'+
 (passage?'<div class="p43-source"><h4>Authorized P41 evidence</h4><p>'+esc(passage.title)+'</p>'+
 act('p41-open','Read the original source →','button outline small','data-id="'+passage.id+'"')+
 act('p43-evidence',showEvidence?'Hide source anchor':'Reveal source anchor · assisted','button outline small')+
 (showEvidence?'<p lang="zh-Hans">'+esc(passage.lines[8].hanzi)+'</p><small>'+esc(passage.lines[8].pinyin)+'</small><p>'+esc(passage.lines[8].english)+'</p>':'')+'</div>':'')+
 act('p43-step','Start composing →','button primary','data-step="compose"')+'</div>':'')+
 (step==='compose'||step==='revise'?'<div class="p43-editor"><div class="p43-compose-intro">'+
 '<strong>'+ (step==='revise'?'Revise your own writing':'Write an original two-paragraph Chinese response')+'</strong>'+
 '<p>Write freely in Simplified Chinese. Do not copy the model until you have made your own attempt. Source agreement, grammar and coherence require your judgement; they are not automatically graded.</p></div>'+
 '<label for="p43-draft">Your own Chinese paragraphs</label>'+
 '<textarea id="p43-draft" spellcheck="false" autocapitalize="off" rows="11" placeholder="第一段：说明背景和问题。\n\n第二段：比较证据、解释结果，并给出结论。">'+esc(draft)+'</textarea>'+
 '<div class="p43-draft-status"><span>'+count+' Hanzi characters · in-tab draft only</span><span>'+revisions.length+' explicitly saved session revision'+(revisions.length===1?'':'s')+'</span></div>'+
 '<div class="button-row">'+act('p43-save','Save an in-tab revision snapshot','button primary',draft.trim()?'':'disabled')+
 act('p43-copy','Copy my writing to clipboard','button outline',draft.trim()?'':'disabled')+
 act('p43-discard','Discard current session work','button outline')+'</div>'+
 '<div class="p43-compare"><h4>Compare with a previous version</h4>'+
 (revisions.length?'<div class="p43-version-tabs" role="group">'+revisions.map((v,i)=>act('p43-version','Draft '+(i+1),'p43-version '+(selected===i?'active':''),'data-version="'+i+'"')).join('')+'</div>'+
 (selectedDraft?'<div class="p43-side-by-side"><div><strong>Snapshot '+(selected+1)+'</strong><p lang="zh-Hans">'+esc(selectedDraft)+'</p>'+
 act('p43-restore','Restore this snapshot into editor','button outline small','data-version="'+selected+'"')+'</div>'+
 '<div><strong>Current working draft</strong><p lang="zh-Hans">'+esc(draft||'No new text yet')+'</p></div></div>':''):'<p class="muted">Save a first snapshot to compare it with a later revision. Snapshots are not durable backups.</p>')+'</div>'+
 (step==='revise'?'<div class="p43-rubric"><h4>Self-review, not automatic assessment</h4>'+
 '<p>'+esc(u.revision)+'</p>'+
 P43_REVIEW_CRITERIA.map(c=>act('p43-criterion','<span class="p43-check" aria-hidden="true">'+(rubric.includes(c.id)?'✓':'○')+'</span>'+esc(c.label),
 'p43-criterion '+(rubric.includes(c.id)?'checked':''),'data-id="'+c.id+'" role="checkbox" aria-checked="'+rubric.includes(c.id)+'"')).join('')+
 '<p class="muted">Checking a criterion records your own inspection only inside this tab; it never grants mastery.</p></div>':'')+'</div>':'')+
 (step==='speak'?'<div class="p43-oral"><h3>Speak independently before listening to a model</h3>'+
 '<p>'+esc(u.oral)+'</p><ol><li>State the context and the main source fact in your own Mandarin.</li>'+
 '<li>Explain the change or contrast using a natural connector.</li>'+
 '<li>Close with an evidence-supported conclusion; repeat without looking at the text.</li></ol>'+
 '<p>Speak aloud yourself. No recording, pronunciation score or oral mastery is produced.</p>'+
 (dialogue?act('p42-open','Open the related P42 spoken conversation →','button primary','data-id="'+dialogue.id+'"'):'')+
 act('p43-model-audio','Hear the authored writing model using device speech','button outline')+'</div>':'')+
 '<div class="p43-model-controls"><h3>Authorial model and transfer</h3><p>Compare only after your own attempt. Revealing a model or source hint makes subsequent linked exact-sentence transfer assisted in this tab.</p>'+
 act('p43-reveal',reveal?'Hide the model':'Reveal model with Pinyin and English · assisted','button outline')+
 (reveal?'<div class="p43-model">'+u.sections.map((sect,i)=>
 '<article><h4>Model paragraph '+(i+1)+' · '+esc(sect.title)+'</h4>'+
 u.lines.slice(sect.start,sect.end+1).map(line=>'<div class="p43-model-line"><p lang="zh-Hans">'+esc(line.hanzi)+'</p>'+
 '<small>'+esc(line.pinyin)+'</small><span>'+esc(line.english)+'</span></div>').join('')+'</article>').join('')+'</div>':'')+'</div>'+
 '<div class="p43-native"><h4>Optional native exact-form practice</h4><p>These two fixed sentences are assessed only as exact reconstruction by the original Sentence Workshop. They are not an evaluation of your essay.</p>'+
 act('p43-workshop','Reconstruct the key sentence →','button outline small','data-line="4"')+
 act('p43-workshop','Reconstruct the conclusion →','button outline small','data-line="9"')+'</div>'+
 '<div class="p43-crosslinks"><h4>Source-backed language links</h4>'+
 (passage?act('p41-open','Original P41 reading →','button outline small','data-id="'+passage.id+'"'):'')+
 (dialogue?act('p42-open','Original P42 dialogue →','button outline small','data-id="'+dialogue.id+'"'):'')+
 patterns.map(g=>act('grammar-select',esc(g.title)+' →','button outline small','data-id="'+g.id+'"')).join('')+
 words.map(w=>act('lookup-word',esc(w.hanzi)+' · '+esc(w.pinyin),'button outline small','data-id="'+w.key+'"')).join('')+'</div>'+
 '<p class="p43-footnote">Private unsent answer text is never written to IndexedDB or synchronized by this workspace. In-tab snapshot and self-review state are not progress evidence. An exact model match is not an open-ended writing evaluation; speaking has no microphone or automatic grading. This original content is not an official HSK assessment.</p></section>';
}
