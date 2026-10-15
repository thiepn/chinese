import { DEMO_LESSONS, demoSearch, findLesson } from './demo-lessons.mjs';
import {renderC9Home} from './home-c9.mjs';
import {renderC9LearnHub,renderC9LessonBrowser,renderC9SearchResults,renderC9PathwayHub} from './learn-hub-c9.mjs';
import {renderC9LessonWorkspace,C9_LESSON_SECTIONS} from './lesson-c9.mjs';
import {renderC9CharacterStudy,connectC9Writing,disconnectC9Writing} from './character-c9.mjs';
import {renderC9VocabularyLibrary,c9WordCatalogResults,renderC9GrammarDirectory,renderC9SentenceDirectory,C9_WORD_FILTERS} from './libraries-c9.mjs';
import {renderC9Review,renderC9PracticeHeader,renderC9PracticePaths,renderC9GuidedStep} from './review-practice-c9.mjs';
import {renderC9LearningContinuity,renderC9InstalledSourceAtlas,renderC9SourceReturn,c9LookupSource,C9_SOURCE_ROUTES} from './integration-c9.mjs';
import {renderC9AdvancedWorkspace,findC9AdvancedPhase,c9AdvancedFiltered,c9AdvancedNativeLinks,c9AdvancedSourceLines} from './advanced-c9.mjs';
import {renderC9WritingWorkspace,c9WritingState,handleC9WritingAction,handleC9WritingInput,handleC9WritingBackupFile,hasC9UncopiedWriting,cancelC9WritingFileRead} from './writing-c9.mjs';
import {renderC9NativeHandoff,renderC9DraftContinuation,renderC9SkillWritingReturn} from './navigation-c9.mjs';
import {renderC9SkillsWorkspace,c9SkillTrack,c9SkillPhaseInTrack,c9SkillPhase,c9SkillSource,c9SkillStages,c9SkillStageId,c9SkillLinks,c9SkillNextSource} from './skills-c9.mjs';
import {c9WritingLinkedUnit} from './writing-c9.mjs';
import {renderC9ReadingHub,renderC9DialogueHub,renderC9ReadingCatalog,renderC9DialogueCatalog,renderC9ReadingNavigator,renderC9ListeningWorkflow,renderC9TurnNavigator,renderC9ReaderIntro,renderC9PersonalTextReader,connectC9PersonalTextReader,disconnectC9PersonalTextReader} from './media-c9.mjs';
import {renderC9ProgressOverview,renderC9SearchIntro,renderC9SearchAssist,renderC9SettingsIntro,renderC9Secondary} from './utilities-c9.mjs';
import {captureC9Focus,restoreC9Focus,announceC9Route,announceC9Interaction,installC9KeyboardHelp,C9_NATIVE_DISCLOSURE_CLASSES} from './accessibility-c9.mjs';
import {connectC9Shell,syncC9Shell,C9_ROUTE_LABELS} from './shell-c9.mjs';
import {renderC9NativeAction,renderC9PageHeading,renderC9ContextNav} from './ui-c9.mjs';
import { freshState, addLesson, gradeCard, cardInfo, cardsForLesson, dueCards, summary, validateState, upgradedState, lessonGroups } from './study.mjs';
import { evaluateAnswer, makeOptions, makeCloze } from './exercises.mjs';
import { openDatabase, readState, updateState, resetState, backupDocument, importBackup, replaceState } from './study-storage.mjs';
import { STORIES, findStory, tokenizeSentence, storyExercise, shuffledChunkIndices, introducedCharacterCoverage } from './stories.mjs';
import {DEEP_READING_MODES,deepReadingQuestion,paragraphFor,readingDepthOverview} from './reading-depth.mjs';
import {readingExtendedHeader,readingParagraphMarker,readingExtendedModeButtons,readingExtendedConnections,readingEvidence} from './reading-depth-screen.mjs';
import {BEGINNER_STORIES,BEGINNER_MODES,beginnerQuestion,beginnerReadingStats,beginnerWritingTask,nextBeginnerStory} from './beginner-reading.mjs';
import {beginnerReadingShelf,beginnerReadingHeading,beginnerPartMarker,beginnerModeTabs,beginnerEvidence,beginnerConnections} from './beginner-reading-screen.mjs';
import {PATHWAY_MISSIONS,PATHWAY_MODES,findPathwayMission,pathwayQuestion,pathwayNext,pathwayResume} from './pathway-course.mjs';
import {renderPathwayScreen,pathwayHomePanel} from './pathway-screen.mjs';
import {dashboardHome,learnWorkspace,reviewWorkspace,exploreWorkspace,progressWorkspace,unifiedSearchPage,courseSearchResults,courseSearch,FIND_CATEGORIES} from './workspace-p30.mjs';
import {P31_CHARACTER_GUIDES,P31_THEMES,findP31Guide,nextP31Guide} from './p31-foundations.mjs';
import {p31Overview,p31LessonShelf,p31LessonTeaching,p31VocabularyShelf} from './p31-screen.mjs';
import {p32LearningHub,p32RepairFor} from './p32-learning.mjs';
import {P33_SCENARIOS,findP33Scenario} from './p33-scenarios.mjs';
import {p33SceneShelf,p33ScenarioTeaching} from './p33-screen.mjs';
import {P34_SCENES,P34_LISTENING} from './p34-course.mjs';
import {p34Overview,p34ListeningPanel,p34DialogueFor,p34StoryFor} from './p34-screen.mjs';
import {P31_VOCABULARY} from './p31-vocabulary.mjs';
import { WORDS, findWord, searchCatalog, wordFamily, canonicalWordKey } from './lexicon.mjs';
import { addReadingEvent, storySummary } from './reader-records.mjs';
import { DRILL_MODES, buildDrill, gradeDrill } from './drills.mjs';
import { prioritizedDue, learningAnalytics } from './insights.mjs';
import { guideFor } from './lesson-guides.mjs';
import {addDrillRecord,toggleStoryBookmark,practiceSummary} from './practice-records.mjs';
import {lessonRecommendations} from './recommendations.mjs';
import {createGuidedSession,guidedQuestion,recordGuidedAnswer,advanceGuidedSession,abandonGuidedSession} from './guided-session.mjs';
import {placementQuestion,placementSuggestion,startPlacement,answerPlacement,skipPlacement,PLACEMENT_TOTAL} from './placement.mjs';
import {remediationPlan,skillDiagnostics,weeklyEvidence} from './learning-coach.mjs';
import {CONTEXT_MODES,contextQuestion,lessonConnections,recentRemediation} from './context-lab.mjs';
import {toggleWordBookmark,bookmarkedVocabulary} from './practice-records.mjs';
import {DIALOGUES,findDialogue,dialogueQuestion,dialogueSummary,addDialogueEvent} from './dialogues.mjs';
import {wordbookQuestion,gradeWordbookQuestion,addWordPracticeEvent,wordbookStats,wordbookSequence,introduceVocabulary,beginVocabularyJourney,advanceVocabularyJourney,endVocabularyJourney,vocabularyProgress,VOCABULARY_STEPS,WORD_PRACTICE_MODES} from './wordbook-lab.mjs';
import {lessonPath,unitOverview} from './pathways.mjs';
import {reviewPlan} from './review-strategy.mjs';
import {progressDiagnostics} from './progress-diagnostics.mjs';
import {toneExplanation,toneContrast} from './tone-coach.mjs';
import {SENSE_CASES,senseCase,evaluateSense,addSenseEvent,senseStats} from './sense-lab.mjs';
import {SENTENCE_TASKS,sentenceTask,checkSentence,addSentenceEvent,sentenceStats} from './sentence-workshop.mjs';
import {missionQuestion,gradeMission,addMissionEvent,missionStats} from './dialogue-missions.mjs';
import {contextualProgress,contextualWeaknesses} from './connected-practice.mjs';
import {pronunciationPath,pronunciationRemedy} from './pronunciation-path.mjs';
import {dialogueWordLinks,storyWordLinks} from './context-links.mjs';
import {COURSE_STAGES,courseQuestion,startCourse,answerCourse,advanceCourse,useCourseHint,finishCourse,pauseCourse,courseMetrics,lessonPrerequisites,courseConnections,courseUnitMilestones,courseNextLesson,lastCourseCompletion} from './course-journey.mjs';
import {courseDayPlan,unresolvedCourseSkills,repairQuestion,startCourseRepair,useRepairHint,answerCourseRepair,advanceCourseRepair,abandonCourseRepair,courseRepairSummary} from './course-continuation.mjs';
import {characterWordSentenceBridge,lessonConsolidation,lessonRemediationPlan} from './learning-bridge.mjs';
import {senseContrast,senseRepairQueue} from './sense-contrast.mjs';
import {LADDER_STAGES,ladderQuestion,sentenceChunks,startLadder,ladderSelect,ladderUndo,ladderHint,answerLadder,advanceLadder,abandonLadder,ladderSummary,adaptiveLadderSuggestions} from './sentence-ladder.mjs';
import {selectBlockLessons,startBlock,blockCurrent,blockStepReady,advanceBlock,abandonBlock,blockStatistics,blockSkillEvidence,blockBridgeQuestion,useBlockHint,answerBlockBridge} from './study-block.mjs';
import {crossLessonConnections} from './cross-lesson.mjs';
import {lessonPriority,blockOverview,personalizedBlockPlan} from './block-coach.mjs';
import {beginTrail,trailSources,trailQuestion,trailHint,answerTrail,nextTrail,trailSummary} from './context-trail.mjs';
import {FLUENCY_BANK,planFluency,fluencyPriority,beginFluency,fluencyCurrent,fluencyHint,fluencyAnswer,advanceFluency,abandonFluency,fluencySummary} from './fluency-studio.mjs';
import {PLAN_FOCI,PLAN_MINUTES,planPreferences,setPlanPreferences,plannedDays,mistakeCollections,toggleMistakePin,nextConnectedMaterial,recentStudyRhythm} from './daily-plan.mjs';
import {learningHub,activeLearningSessions,LEARNING_DESTINATIONS} from './learning-hub.mjs';
import {contentConnections} from './context-continuity.mjs';
import {courseOverview,courseShortcuts,recoverySnapshot} from './course-overview.mjs';
import {previewBackup,restoreRequiresAcknowledgement,MAX_BACKUP_BYTES} from './backup-preview.mjs';
import {COURSE_COMPANIONS,companionForLesson,nearbyCompanions} from './course-companion.mjs';
import {PINYIN_INITIALS,PINYIN_FINALS,PINYIN_SECTIONS,soundQuestion,evaluateSoundQuestion} from './pinyin-foundations.mjs';
import {renderPinyinScreen,soundPrimer} from './pinyin-screen.mjs';
import {GRAMMAR_LESSONS,GRAMMAR_CHAPTERS,GRAMMAR_MODES,findGrammarLesson,grammarQuestion,gradeGrammarQuestion,nextGrammarLesson} from './grammar-course.mjs';
import {renderGrammarScreen,grammarLessonList} from './grammar-screen.mjs';
import {SENTENCE_LIBRARY,SENTENCE_TOPICS,SENTENCE_MODES,findLibrarySentence,searchSentences,sentenceQuestion,hasSentenceMode,sentencePracticeId,toggleSentenceSaved,gradeSentenceChoice,sentenceBookmarked} from './sentence-library.mjs';
import {renderSentenceScreen,sentenceResultsPanel} from './sentence-screen.mjs';

const root=document.getElementById('app-content');
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stableRoutes=new Set(['today','learn','review','explore','progress','settings','character','reader','stories','practice','dialogues','wordbook','senses','workshop','journey','ladder','block','fluency','plan','pinyin','grammar','sentences','pathway','find','advanced','writing','skills']);
const route=()=>{const v=(location.hash.match(/^#\/(\w+)/)||[])[1]||'today';return stableRoutes.has(v)?v:'today'};
let c9RenderedRoute=route();
let c9ApprovedDeparture=null;
// C9-39 offline-readiness protocol: report version AND full source manifest
// must match the app revision. An older controller's successful old cache is
// not evidence that this revision's original lessons will work offline.
const C9_EXPECTED_OFFLINE_CACHE='character-study-working-v61-startup-bundle-original-learning';
const C9_EXPECTED_OFFLINE_ASSETS=317;
let c9OfflineShell='checking'; // UI readiness only; never a learner-data authority.
let c9OfflineCoverage=null; // Manifest keys reported by the controlling SW, never learner data.
// Short-lived, single successful route transition.
let state=freshState(),db=null,storageError=null,displayLessonId=DEMO_LESSONS[0].id,activeReviewId=null,revealed=false,showLessonTranslation=true,searchQuery='',searchSelection=null,typedAnswer='',chosenOption='',checkResult=null,readerLessonId=DEMO_LESSONS[0].id,readerMode='meaning',readerResult=null,busy=false;
let storyId=STORIES[0].id,storyMode='comprehension',storyResult=null,storyAssist=false,storyShowTranslation=false,storyGlossary=null,storySequence=[],storyTyped='',storyParagraph=0,storyParagraphOnly=false,storyParagraphTranslations=[];
let c9StoryPinyin=false,c9StoryEnglish=false,c9DialogueTurn=0,c9DialogueSourceId=null;
let c9DiscoveryTrail=null; // In-tab source handoff, never persisted and never an achievement.
let c9NativeTrail=null; // Source-scoped return for native P35–P51 and P43 activity handoffs.
let c9ReturnFocus=null;
const C9_ACTIVE_ANSWER_IDS=Object.freeze({
 review:['review-entry'],workshop:['workshop-entry'],
 grammar:['grammar-entry'],dialogues:['mission-entry'],sentences:['sentence-library-entry'],
 pinyin:['pinyin-answer-entry'],pathway:['pathway-write'],
 practice:['guided-entry','drill-entry','mission-entry'],
 journey:['course-entry','repair-entry'],ladder:['ladder-entry'],
 block:['block-entry','trail-entry'],fluency:['fluency-entry'],
 stories:['story-entry'],wordbook:['wordbook-entry'],
 learn:['lesson-check-entry']
});
function c9OpenNativeAnswer(screen=c9RenderedRoute){
 // A changed-context draft remains ungraded even after a P29 graded answer.
 if(screen==='pathway'&&String(pathwayTransferDraft||'').trim())
  return root.querySelector('#p29-transfer-draft')||{value:pathwayTransferDraft};
 // A visible answer may remain in the original input after submitting it.
 // Warn only about UNSUBMITTED text, not a graded native response.
 if((screen==='review'&&checkResult!==null)||
  (screen==='workshop'&&sentenceFeedback!==null)||
  (screen==='grammar'&&grammarFeedback!==null)||
  (screen==='sentences'&&libraryFeedback!==null)||
  (screen==='pathway'&&pathwayFeedback!==null)||
  (screen==='wordbook'&&wordbookFeedback!==null)||
  (screen==='stories'&&storyResult!==null)||
  (screen==='dialogues'&&missionFeedback!==null)||
  (screen==='pinyin'&&pinyinFeedback!==null))return null;
 const candidates=C9_ACTIVE_ANSWER_IDS[screen]||[];
 return candidates.map(id=>root.querySelector('#'+id))
  .find(el=>el&&!el.disabled&&el.getClientRects().length&&String(el.value||'').trim())||null;
}
function c9ConfirmLeaveNativeAnswer(screen=c9RenderedRoute){
 const field=c9OpenNativeAnswer(screen);
 return !field||window.confirm('A typed answer is still in this learning screen. Leaving may discard the unsubmitted text. Leave anyway?');
}
window.addEventListener('beforeunload',e=>{
 if(hasC9UncopiedWriting()||c9OpenNativeAnswer()){e.preventDefault();e.returnValue='';}
});
let c9AdvancedPhase=35,c9AdvancedQuery='',c9AdvancedPage=0,c9AdvancedSelected=null,c9AdvancedTranslation=false;
const c9SkillsUi={track:'reading',phase:46,sourceId:null,stage:'orientation',
 query:'',page:0,phaseOnly:false,support:false};
let c9SkillWritingHandoff=null; // Only in-tab navigation; no other essay writer.
let c9PendingSkillWritingHandoff=null; // The original P43 switch must be confirmed first.
function c9WriterMatchesSkillBridge(bridge){
 return Boolean(bridge&&c9WritingState.transferPhase===bridge.phase&&
  c9WritingState.sourceId===bridge.sourceId&&
  c9WritingLinkedUnit(bridge.phase,bridge.sourceId)?.id===c9WritingState.unitId);
}
function selectC9SkillSource(phase,id){
 if(!c9SkillPhaseInTrack(c9SkillsUi.track,phase)||!c9SkillSource(phase,id))return false;
 c9SkillsUi.phase=Number(phase);c9SkillsUi.sourceId=id;
 c9SkillsUi.stage=c9SkillStageId(phase,null);
 c9SkillsUi.support=false;c9SkillsUi.page=0;c9SkillsUi.phaseOnly=false;
 return true;
}
let drillLessonId=DEMO_LESSONS[0].id,drillMode='recognition',drillResult=null,drillPicked='',drillTyped='',drillOrder=[],drillAssisted=false;
let storiesOnlyBookmarked=false,storiesLongOnly=false,storiesBeginnerOnly=false,beginnerLevel='all',beginnerPart='all',beginnerWordShown=false,beginnerPartTip='',storyFocusIndex=-1,storyHelpIndex=-1,exploreSavedOnly=false;
let guidedLimit=10,guidedFocus='balanced',guidedTyped='',guidedOrder=[],guidedAssisted=false;
let demoSpeechRate=0.86;
let pinyinSection='sounds',pinyinFilter='all',pinyinIndex=0,pinyinTyped='',pinyinFeedback=null,pinyinSound='b',pinyinSyllable='ma';
let grammarSelected='g01',grammarChapter='all',grammarQuery='',grammarMode='meaning',grammarTyped='',grammarFeedback=null,grammarAssisted=false,grammarOrder=[],grammarShowEnglish=true;
let dialogueId=DIALOGUES[0].id,dialogueStep=0,dialogueSupport=false,dialogueFeedback=null;
let p33Theme='all',p33Query='',p33Branch=null;
let p34ShadowLine=0,p34TranscriptViewed=false;
let wordbookIndex=0,wordbookMode='meaning',wordbookFocus='all',wordbookTyped='',wordbookFeedback=null,explorePage=0;
let senseIndex=0,senseSupport=false,senseFeedback=null;
let sentenceIndex=0,sentenceTyped='',sentenceSupport=false,sentenceFeedback=null;
let p31Theme='all',p31Status='all',p31Page=0,p31WordPage=0;
let p30CoachIndex=0,p30CoachCategory='all',p30Query='',p30Kind='all',p30Saved=false,p30Page=0;
let c9LearnQuery='',c9LearnUnit='all',c9LearnStatus='all',c9LearnKind='all',c9LearnSaved=false,c9LearnPage=0,c9LearnDetail=false;
let c9LessonSection='overview',c9LastLessonId=null,c9CharacterShowTranslations=true;
let c9WordQuery='',c9WordFilter='all',c9WordPage=0;
let c9ReadingQuery='',c9ReadingFilter='all',c9ReadingPage=0,c9DialogueQuery='',c9DialogueFilter='all',c9DialoguePage=0;
let pathwayTransferDraft=''; // Session-only, no IndexedDB or StudyEvent writer.
let pathwaySelected='path-01',pathwayMode='meaning',pathwayMinutes=20,pathwayFocus=false,pathwayAssisted=false,pathwayTyped='',pathwayFeedback=null,pathwayShowPinyin=true,pathwayShowEnglish=true;
let librarySelected='sent-001',libraryQuery='',libraryTopic='all',libraryArea='all',libraryDifficulty='all',libraryGrammar='all',libraryPurpose='all',libraryTone='all',librarySource='all',librarySavedOnly=false,libraryPage=0,libraryMode='meaning',libraryTyped='',libraryOrder=[],libraryFeedback=null,libraryAssisted=false,libraryShowPinyin=true,libraryShowEnglish=true,libraryPracticeFocus=false;
let missionStep=0,missionActive=false,missionSupport=false,missionTyped='',missionFeedback=null;
let lessonCheckpoint={lessonId:null,step:0,response:'',feedback:null};
let exploreKind='all',reviewFocus='all',reviewSize=10,sessionQueue=null,sessionDone=0,sessionCorrect=0,sessionSkipped=0;
let reviewPaused=false,reviewInvalidated=0;
let channel;
let courseTyped='', repairTyped='',ladderTyped='';
let blockFocus='balanced',blockCount=2,blockTyped='',trailTyped='';
let fluencyFocus='balanced',fluencySize=8,fluencyTyped='';
let planMistakeFilter='unresolved';
let pendingRestore=null,restoreAcknowledgement='';
let c9RenderedHash=null;
let c9SearchFocusPending=false;
function alertUser(message,type='info'){const target=$('alert-banner');target.textContent=message;target.className=`alert ${type}`;if(type==='error')target.setAttribute('role','alert');else target.setAttribute('role','status');}
function clearAlert(){const a=$('alert-banner');a.textContent='';a.className='';a.setAttribute('role','status');}
function stat(n,desc){return `<div class="stat"><strong>${n}</strong><span>${desc}</span></div>`}
const action=renderC9NativeAction;
const title=renderC9PageHeading;
document.addEventListener('keydown',e=>{
 if(e.key!=='/'||e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.isComposing)return;
 const target=e.target;
 if(target&&(target.closest('input,textarea,select,[contenteditable=true]')))return;
 e.preventDefault();c9SearchFocusPending=true;go('find');if(location.hash==='#/find'){const input=root.querySelector('#p30-query');if(input){input.focus({preventScroll:true});c9SearchFocusPending=false;}}
});
function navUpdate(){const current=route();for(const a of document.querySelectorAll('[data-route]')){if(a.dataset.route===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}syncC9Shell(current,{due:dueCards(state).length,storageReady:Boolean(db)});document.title=`${C9_ROUTE_LABELS[current]||'Home'} | THIEPN Chinese`;}
function gated(){return `<div class="permission-note" role="note"><strong>Demo curriculum, not official HSK</strong><p>These ${DEMO_LESSONS.length} original Mandarin examples show how the app will work. They have not undergone independent linguistic review. The official 2025 HSK lists are not included or claimed as mastered.</p></div>`}

function onboardingPanel(){const p=state.placement, suggestion=placementSuggestion(state);
 if(p?.status==='skipped')return '';
 if(p?.status==='completed')return `<section class="simple-panel onboarding-panel"><div><p class="eyebrow">OPTIONAL STARTING POINT</p><h2>Placement check complete</h2><p>${suggestion.correct}/${suggestion.total} correct. Suggested starting point: original demo lesson ${findLesson(suggestion.lessonId).order}. This is not a proficiency certificate or completed lessons.</p></div><div class="button-row">${action('placement-lesson','Open suggested lesson →','button primary',`data-id="${suggestion.lessonId}"`)}</div></section>`;
 const active=p?.status==='active',q=active?placementQuestion(p.answers.length):null;
 return `<section class="simple-panel onboarding-panel" aria-label="Optional introduction"><div><p class="eyebrow">WELCOME · OPTIONAL DEMONSTRATION PLACEMENT</p><h2>${active?'What do you already recognize?':'Find a comfortable starting point.'}</h2><p>${active?`Question ${p.answers.length+1} of ${PLACEMENT_TOTAL}. Your choices are saved, but they do not mark lessons as studied.`:'Choose a short recognition check or start with the first lesson. No account required.'}</p></div>
 ${active?`<div class="placement-question"><p lang="zh-Hans" class="placement-hanzi">${esc(q.hanzi)}</p><p>${esc(q.prompt)}</p><div class="choice-list" role="group" aria-label="Choose the character meaning">${q.options.map((option,i)=>action('placement-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(option)}`,'choice',`data-option="${esc(option)}"`)).join('')}</div></div>`:
 `<div class="button-row">${action('placement-start','Take 6-question check →','button primary')}${action('placement-skip','Start from lesson one','button outline')}</div>`}
 ${active?`<div class="button-row">${action('placement-skip','Skip assessment','button outline')}</div>`:''}</section>`;
}
function studyPathPanel(){const items=lessonPath(state,{limit:4}),units=unitOverview(state);return `<section class="simple-panel pathway-panel"><div class="panel-heading"><div><p class="eyebrow">YOUR NEXT STEPS</p><h2>Personal learning path</h2></div><span class="muted">Transparent suggestions · not a proficiency level</span></div><div class="pathway-steps">${items.map((item,i)=>`<button type="button" class="pathway-step" data-action="open-lesson" data-id="${esc(item.id)}"><span class="pathway-rank">${i+1}</span><span lang="zh-Hans" class="pathway-hanzi">${esc(item.lesson.hanzi)}</span><span><strong>${esc(item.lesson.meaning)}</strong><small>${esc(item.kind==='new'?'Introduce next':'Revisit')} · ${esc(item.reason)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div><p class="muted">${units.filter(u=>u.status==='Introduced').length} of ${units.length} demo units fully introduced. Review errors are not counted as completed lessons.</p></section>`;}
function renderDialoguesNative(){const d=findDialogue(dialogueId)||DIALOGUES[0],q=dialogueQuestion(d.id,dialogueStep),stats=dialogueSummary(state);return `${gated()}${renderC9ListeningWorkflow(d,q,dialogueFeedback,dialogueSupport||p34TranscriptViewed,action,esc)}<details class="p34-catalog"><summary>Open P34 listening-first course · 25 situations</summary>${p34Overview(state,action,esc)}</details>${p34ListeningPanel(d,state,action,esc,{line:p34ShadowLine})}<details class="p33-browser"><summary>Browse ${P33_SCENARIOS.length} everyday communication situations</summary>${p33SceneShelf(state,d.p33?.id,action,esc,{theme:p33Theme,query:p33Query})}</details>
<section class="simple-panel dialogue-top"><label for="dialogue-choice">Choose a dialogue<select id="dialogue-choice">${DIALOGUES.map((item,i)=>`<option value="${item.id}" ${d.id===item.id?'selected':''}>${i+1}. ${esc(item.title)}</option>`).join('')}</select></label><div class="stats-grid">${stat(stats.practiced,'Conversations practiced')}${stat(stats.independent,'Independent correct answers')}${stat(stats.attempts,'Supplementary responses')}</div></section><div class="content-continuation" aria-label="Conversation navigation">${action('dialogue-prev','← Previous conversation','button outline small')}${action('dialogue-next-context','Next conversation →','button outline small')}</div>
<div class="dialogue-layout"><article class="simple-panel dialogue-paper" id="c9-native-dialogue" tabindex="-1"><div class="panel-heading"><h2>${esc(d.title)}</h2><span class="muted">${d.lines.length} speaking turns</span></div>${renderC9TurnNavigator(d,c9DialogueTurn,action,esc)}<div class="dialogue-turns">${d.lines.map((line,index)=>`<div class="dialogue-turn ${c9DialogueTurn===index?'is-c9-current':''}" tabindex="-1" data-c9-turn-index="${index}" aria-current="${c9DialogueTurn===index?'step':'false'}"><span class="speaker-label" aria-label="Speaker ${line.speaker}">${esc(line.speaker)}</span><div><p class="dialogue-chinese" ${d.p34&&!dialogueSupport?'':'lang="zh-Hans"'}>${d.p34&&!dialogueSupport?'Audio turn · reveal transcript when ready':esc(line.hanzi)}</p>${dialogueSupport?`<p class="dialogue-pinyin">${esc(line.pinyin)}</p><p class="muted">${esc(line.english)}</p>`:''}<div class="button-row">${action('speak','Listen to this turn','button outline small',`data-text="${esc(line.hanzi)}"`)}</div></div></div>`).join('')}</div><div class="button-row">${action('dialogue-support',dialogueSupport?'Hide language support':'Show pinyin + English','button outline',`aria-pressed="${dialogueSupport}"`)}${action('speak','Listen to the exchange','button outline',`data-text="${esc(d.lines.map(x=>x.hanzi).join(' '))}"`)}</div><p class="muted">Device TTS is optional and is not certified pronunciation audio. Revealing language support makes the next answer assisted.</p>${dialogueWordLinks(d.id).length?`<div class="dialogue-word-links"><p class="eyebrow">EXPLORE WORDS IN THIS EXCHANGE</p><p class="muted">Written-form matches only; verify their meanings in context.</p><div class="word-link-row">${dialogueWordLinks(d.id).map(w=>action('lookup-word',`${esc(w.hanzi)} <small>${esc(w.pinyin)}</small>`,'button outline small',`data-word="${esc(w.hanzi)}"`)).join('')}</div></div>`:''}</article>
<section class="simple-panel dialogue-quiz"><p class="eyebrow">CONTEXT CHECK · ${dialogueStep+1} / ${d.questions.length}</p><h2>${esc(q.prompt)}</h2>${dialogueFeedback?`<div class="reader-feedback ${dialogueFeedback.correct&&!dialogueFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${dialogueFeedback.correct?'Correct answer':'Review the conversation'}</strong><p>Reference: ${esc(q.answer)}</p>${d.p34?`<p><strong>Listening evidence:</strong> ${esc(d.p34.feedback[dialogueStep]||d.p34.teaching)}</p><p lang="zh-Hans">${esc(d.lines[dialogueStep===0?1:3].hanzi)}</p><p class="muted">${esc(d.lines[dialogueStep===0?1:3].pinyin)} · ${esc(d.lines[dialogueStep===0?1:3].english)}</p>`:''}<p>${dialogueFeedback.assisted?'Assisted attempt — not independent evidence.':'Saved as separate conversation practice.'}</p></div><div class="button-row">${action('dialogue-next',dialogueStep+1<d.questions.length?'Next context question →':'Next conversation →','button primary')}${action('dialogue-retry','Repeat this question','button outline')}</div>`:`<div class="choice-list">${q.options.map((opt,i)=>action('dialogue-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div><div class="button-row">${action('dialogue-reveal','Reveal reference','button outline')}</div>`}<p class="muted">These questions assess contextual meaning, not official curriculum mastery.</p></section></div>${p33ScenarioTeaching(d,p33Branch,action,esc)}${renderDialogueMission(d)}`;}
function refreshC9MediaCatalog(kind){
 const reading=kind==='reading',target=root.querySelector(reading?'#c9-reading-results':'#c9-dialogue-results');if(!target)return;
 target.innerHTML=reading?renderC9ReadingCatalog(state,storyId,{query:c9ReadingQuery,filter:c9ReadingFilter,page:c9ReadingPage},action,esc):
  renderC9DialogueCatalog(state,dialogueId,{query:c9DialogueQuery,filter:c9DialogueFilter,page:c9DialoguePage},action,esc);
}
function renderDialogues(){
 const dialogue=findDialogue(dialogueId)||DIALOGUES[0];
 if(c9DialogueSourceId!==dialogue.id){c9DialogueSourceId=dialogue.id;c9DialogueTurn=0;}
 return '<div class="c9-media-workspace c9-media-dialogues">'+
  renderC9DialogueHub(state,dialogue,action,esc,{query:c9DialogueQuery,filter:c9DialogueFilter,page:c9DialoguePage})+
  '<div class="c9-media-native">'+renderDialoguesNative()+'</div></div>';
}
function renderReader(){
 return '<div class="c9-media-workspace c9-media-reader">'+
  renderC9ReaderIntro(readerLesson(),action,esc)+
  '<div class="c9-media-native">'+renderReaderNative()+'</div></div>';
}
function renderStories(){
 const story=findStory(storyId)||STORIES[0];
 return '<div class="c9-media-workspace c9-media-stories">'+
  renderC9ReadingHub(state,story,action,esc,{query:c9ReadingQuery,filter:c9ReadingFilter,page:c9ReadingPage})+
  renderC9PersonalTextReader(esc)+
  '<div class="c9-media-native">'+renderStoriesNative()+'</div></div>';
}
function renderDialogueMission(d){const q=missionQuestion(d.id,missionStep),stats=missionStats(state);
 return `<section class="simple-panel learning-studio"><div class="panel-heading"><div><p class="eyebrow">NEW · THREE-STAGE CONVERSATION MISSION</p><h2>Read, prove, pronounce</h2></div><span class="muted">${stats.independent} independent of ${stats.attempts} attempts</span></div>
 ${!missionActive?`<p>Answer a context question, locate the supporting Chinese turn, then type the entire pronunciation of Speaker B’s sentence. Hints create assisted evidence.</p>${action('mission-start','Start three-step mission →','button primary')}`:
 `<div class="guided-meta"><span>Step ${missionStep+1}/3</span><span>${esc(d.title)}</span></div><div class="progress-rail"><span style="width:${100*missionStep/3}%"></span></div><h3>${esc(q.prompt)}</h3>${q.hanzi?`<p class="practice-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>`:''}
 ${missionFeedback?`<div class="reader-feedback ${missionFeedback.correct&&!missionFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${missionFeedback.correct?'Correct':'Study the feedback'}</strong><p>${esc(missionFeedback.detail||missionFeedback.message)}</p><p>Reference: ${esc(q.answer)}</p><p>${missionFeedback.assisted?'Assisted evidence':'Independent response saved'}</p></div>${action('mission-next',missionStep===2?'Finish mission →':'Next step →','button primary')}`:
 `${q.kind==='choice'?`<div class="choice-list">${q.options.map(o=>action('mission-answer',esc(o),'choice',`data-option="${esc(o)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="mission-entry">Type complete pinyin with tones</label><input id="mission-entry" value="${esc(missionTyped)}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Tone marks or 1–5"></div>${action('mission-answer','Check full pronunciation','button primary',missionTyped.trim()?'':'disabled')}`}
 <div class="button-row">${action('mission-support',missionSupport?'Hint shown · assisted':'Show reference hint','button outline',`aria-pressed="${missionSupport}"`)}${action('mission-reveal','Reveal reference','button outline')}${action('mission-exit','Stop mission','button outline')}</div>${missionSupport?`<p class="lesson-guide">${esc(q.explanation)} Hint used: this attempt will not count as independent.</p>`:''}`}`}</section>`;
}
function renderSenses(){const item=senseCase(senseIndex),stats=senseStats(state);return `${title('MEANING IN CONTEXT','One character. Different meanings.','Compare everyday contexts and polyphonic readings. These are original demonstration examples, not certified HSK entries.')}${gated()}
 <section class="simple-panel learning-studio"><div class="stats-grid">${stat(SENSE_CASES.length,'Meaning contrasts')}${stat(stats.attempts,'Practice attempts')}${stat(stats.independent,'Independent correct')}</div><div class="button-row">${action('sense-weak','Practice missed/new contexts →','button outline small')}</div><div class="guided-meta"><span>Contrast ${senseIndex%SENSE_CASES.length+1} / ${SENSE_CASES.length}</span><span>Target: <span lang="zh-Hans">${esc(item.target)}</span></span></div><p class="practice-hanzi" lang="zh-Hans">${esc(item.hanzi)}</p><h2>What does <span lang="zh-Hans">${esc(item.target)}</span> mean here?</h2>${senseFeedback?`<div class="reader-feedback ${senseFeedback.correct&&!senseFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${senseFeedback.correct?'Context understood':'Review the distinction'}</strong><p>${esc(senseFeedback.message)}</p><p>Reference: ${esc(item.answer)}</p><p>${esc(item.pinyin)} · ${esc(item.english)}</p></div><section class="sense-contrast" aria-label="Compare contextual meanings"><h3>Compare the two usages</h3><p class="muted">These complete example phrases explain the distinction. They are teaching material, not an additional independent quiz.</p><div class="sense-compare-grid">${senseContrast(item.id).contexts.map(c=>`<article><p lang="zh-Hans">${esc(c.hanzi)}</p><strong>${esc(c.sense)}</strong><small>${esc(c.pinyin)} · ${esc(c.english)}</small><small>${esc(c.explanation)}</small></article>`).join('')}</div></section><div class="button-row">${action('sense-next','Next context →','button primary')}${action('sense-weak','Practice least secure meaning →','button outline')}</div>`:
 `<div class="choice-list">${item.options.map(o=>action('sense-answer',esc(o),'choice',`data-option="${esc(o)}"`)).join('')}</div><div class="button-row">${action('sense-support','Show pinyin / English · assisted','button outline')}${action('sense-reveal','Reveal distinction','button outline')}</div>${senseSupport?`<div class="lesson-guide"><p>${esc(item.pinyin)} · ${esc(item.english)}</p><p>Showing support marks the next result assisted.</p></div>`:''}`}</section>`;}
function workshopSourceLabel(task){
 // An explicit source provenance chain avoids nested template literal parsing
 // and keeps the original authoring authority for each writing task.
 if(task.p33ScenarioId)return 'P33 conversation · '+esc(findP33Scenario(task.p33ScenarioId)?.title||'Original conversation');
 if(task.grammarId)return 'Grammar · '+esc(task.grammarTitle||'Original grammar');
 if(task.sentenceId)return 'Sentence Library · '+esc(task.sentenceId);
 if(task.p31LessonId)return 'P31 character · '+esc(findLesson(task.p31LessonId)?.hanzi||'Original character');
 if(task.pathwayId)return 'Pathway · '+esc(findPathwayMission(task.pathwayId)?.title||'Original mission');
 return 'Reading · '+esc(findStory(task.storyId||task.readingId)?.title||'Original text');
}
function renderWorkshop(){const task=sentenceTask(sentenceIndex),stats=sentenceStats(state);return `${title('SENTENCE WORKSHOP','Build the Chinese sentence.','Reconstruct an exact sentence using its English meaning. This checks written form, not open-ended translation fluency.')}${gated()}
 <section class="simple-panel learning-studio"><div class="stats-grid">${stat(SENTENCE_TASKS.length,'Sentence tasks')}${stat(stats.practiced,'Tasks attempted')}${stat(stats.independent,'Independent correct')}</div><div class="button-row"></div><div class="guided-meta"><span>Task ${sentenceIndex%SENTENCE_TASKS.length+1}/${SENTENCE_TASKS.length}</span><span>${workshopSourceLabel(task)}</span></div><p class="eyebrow">${task.p32Correction?'P32 · CORRECT THE MISTAKE':task.p33ScenarioId?'P33 · PRODUCE A CONVERSATION TURN':task.p34AudioId?'P34 · WRITE WHAT YOU HEARD':'ENGLISH-TO-CHINESE · EXACT RECONSTRUCTION'}</p><h2>${esc(task.english)}</h2>${sentenceFeedback?`<div class="reader-feedback ${sentenceFeedback.correct&&!sentenceFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${sentenceFeedback.correct?'Exact form correct':'Compare with the model sentence'}</strong><p>${esc(sentenceFeedback.message)}</p><p class="practice-hanzi" lang="zh-Hans">${esc(task.hanzi)}</p><p>${esc(task.pinyin)}</p>${task.p34AudioId?`<div class="p31-writing-feedback"><strong>Listening-first transfer</strong><p>${esc(task.explanation||'')}</p><p>Compare this authored line with the recording from your device voice; exact written reconstruction does not certify spoken fluency.</p></div>`:''}${task.p33ScenarioId?`<div class="p31-writing-feedback"><strong>Conversation context</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.teaching||'')}</p><strong>Social usage</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.pragmatics||'')}</p><strong>Common confusion</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.pitfall||'')}</p></div>`:''}${task.p32Correction?`<div class="p31-writing-feedback"><strong>Why the learner sentence needs repair</strong><p>${esc(task.explanation)}</p><p>One specific reference sentence is checked; other valid corrections may exist.</p></div>`:''}${task.p31LessonId?`<div class="p31-writing-feedback"><strong>Grammar and meaning</strong><p>${esc(findP31Guide(task.p31LessonId)?.grammarExplanation||'')}</p><strong>Common confusion</strong><p>${esc(findP31Guide(task.p31LessonId)?.pitfall||'')}</p><strong>Pronunciation focus</strong><p>${esc(findP31Guide(task.p31LessonId)?.pronunciation||'')}</p></div>`:''}</div>${action('workshop-next','Next sentence →','button primary')}${task.grammarId?action('grammar-select','Return to grammar teaching','button outline small',`data-id="${task.grammarId}"`):''}${task.sentenceId?action('sentence-select','Return to sentence context →','button outline small',`data-id="${task.sentenceId}"`):''}${task.readingId?action('open-story-link','Return to reading →','button outline small',`data-id="${task.readingId}"`):''}${task.pathwayId?action('pathway-select','Return to pathway mission →','button outline small',`data-id="${task.pathwayId}"`):''}${task.p31LessonId?action('p31-open-lesson','Return to character teaching →','button outline small',`data-id="${task.p31LessonId}"`):''}${task.p33ScenarioId?action('p33-open-scenario','Return to conversation →','button outline small',`data-id="${task.p33ScenarioId}"`):''}${task.p34AudioId?action('p34-open-listening','Return to listening →','button outline small',`data-id="${task.p34AudioId}"`):''}`:
 `<div class="answer-entry"><label for="workshop-entry">Type the complete Chinese sentence</label><textarea id="workshop-entry" rows="2" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Write the Chinese characters">${esc(sentenceTyped)}</textarea></div><div class="button-row">${action('workshop-check','Check written sentence →','button primary',sentenceTyped.trim()?'':'disabled')}${action('workshop-support','Show pinyin · assisted','button outline')}${action('workshop-reveal','Reveal model sentence','button outline')}</div>${sentenceSupport?`<p class="lesson-guide">Model pronunciation: ${esc(task.pinyin)}. Help makes this attempt assisted.</p>`:''}`}</section>`;}

function highlightVocabulary(sentence,word){
 const i=sentence.indexOf(word);if(i<0)return esc(sentence);
 return esc(sentence.slice(0,i))+'<mark>'+esc(word)+'</mark>'+esc(sentence.slice(i+word.length));
}
function wordbookTeaching(q,{feedback=false}={}){
 const word=findWord(q?.key);if(!word)return '';
 return `<div class="p23-word-teaching">
 ${word.notes.length?`<div class="p23-word-note"><strong>Usage & meaning</strong>${word.notes.slice(0,2).map(n=>`<p>${esc(n)}</p>`).join('')}</div>`:''}
 ${word.collocations.length?`<div class="p23-collocations"><strong>Learn these combinations</strong><div>${word.collocations.map(c=>`<span lang="zh-Hans">${esc(c)}</span>`).join('')}</div></div>`:''}
 ${word.examples.length?`<div class="p23-word-examples">${word.examples.slice(0,2).map(ex=>`<div><p lang="zh-Hans">${esc(ex.hanzi)}</p><small>${esc(ex.pinyin)}</small><p>${esc(ex.english)}</p>${action('speak','Listen to example','button outline small',`data-text="${esc(ex.hanzi)}"`)}</div>`).join('')}</div>`:''}
 ${feedback?'<p class="muted">Practice answers are supplementary observations, not scheduled mastery or an official proficiency claim.</p>':''}
 </div>`;
}
function renderWordbookNative(){
 const stats=wordbookStats(state),journey=state.vocabularyJourney;
 const mode=journey?VOCABULARY_STEPS[journey.step]:wordbookMode;
 const q=wordbookQuestion(state,wordbookIndex,mode,wordbookFocus,journey?.key||null);
 const word=q&&findWord(q.key);
 const controls=journey?`<div class="p23-journey-heading"><span class="eyebrow">CONNECTED VOCABULARY JOURNEY · ${journey.step+1}/${VOCABULARY_STEPS.length}</span><div class="course-stage-bar" aria-label="Vocabulary learning stages">${VOCABULARY_STEPS.map((x,i)=>`<span class="${i<journey.step?'passed':i===journey.step?'current':''}" title="${esc(x)}">${i+1}</span>`).join('')}</div><p>Meaning → context → pronunciation → typed recall → listening. Every answer uses the existing Wordbook learning history.</p><div class="button-row">${action('vocabulary-end','Finish this journey later','button outline small')}</div></div>`:
 `<div class="button-row"><label class="compact-select">Study collection<select id="wordbook-focus"><option value="all" ${wordbookFocus==='all'?'selected':''}>Saved words</option><option value="learning" ${wordbookFocus==='learning'?'selected':''}>My introduced vocabulary</option><option value="catalog" ${wordbookFocus==='catalog'?'selected':''}>Browse all vocabulary</option><option value="missed" ${wordbookFocus==='missed'?'selected':''}>Missed saved words</option><option value="unpracticed" ${wordbookFocus==='unpracticed'?'selected':''}>Unpracticed saved words</option></select></label><label class="compact-select">Recall skill<select id="wordbook-mode">${WORD_PRACTICE_MODES.map(m=>`<option value="${m}" ${m===wordbookMode?'selected':''}>${esc(({meaning:'Meaning choice',pinyin:'Write pinyin',typed:'Type meaning',context:'Meaning in context',listening:'Listening first'})[m])}</option>`).join('')}</select></label>${action('open-wordbook','Manage saved words →','button outline small')}</div>`;
 return `${title('VOCABULARY STUDIO','Know words in context.','Learn complete words, meanings, tones, contextual use and listening in one place. Independent word practice remains separate from scheduled character review.')}${gated()}
 <section class="simple-panel p23-vocabulary-header"><div class="stats-grid">${stat(WORDS.length,'Canonical words')}${stat(stats.introduced,'Words introduced')}${stat(stats.saved,'Saved words')}${stat(stats.independent,'Independent practice answers')}</div>${controls}</section>
 ${!q?`<section class="simple-panel"><h2>No words in this selection</h2><p>Introduce a word from Explore, switch to the full vocabulary collection, or save useful words for focused practice.</p>${action('vocabulary-discover','Find a word →','button primary')}</section>`:
 `<section class="simple-panel wordbook-practice p23-wordbook">
 <div class="panel-heading"><div><p class="eyebrow">${journey?'GUIDED WORD STUDY':'FOCUSED RECALL'} · ${esc(mode.toUpperCase())}</p><h2>${esc(q.prompt)}</h2></div><span class="muted">Independent word practice</span></div>
 ${mode==='listening'?`<div class="p23-audio-prompt"><p>The written word is hidden until you answer. Listen before selecting its meaning.</p>${action('speak','▶ Play Chinese audio','button primary',`data-text="${esc(q.hanzi)}"`)}</div>`:`<div class="wordbook-hero" lang="zh-Hans">${esc(q.hanzi)}</div>${action('speak','▶ Listen','button outline small',`data-text="${esc(q.hanzi)}"`)}`}
 ${mode==='context'&&q.example?`<div class="p23-context-question"><p class="eyebrow">READ BEFORE CHOOSING</p><p lang="zh-Hans">${highlightVocabulary(q.example.hanzi,q.hanzi)}</p><small>Interpret the highlighted vocabulary in this sentence.</small></div>`:''}
 ${wordbookFeedback?`<div class="reader-feedback ${wordbookFeedback.correct?'correct':'incorrect'}" role="status"><strong>${wordbookFeedback.correct?'Answer accepted':'Review this word'}</strong><p>${esc(wordbookFeedback.detail||wordbookFeedback.message)}</p><p><strong>Reference:</strong> ${esc(q.answer)} · <span lang="zh-Hans">${esc(q.hanzi)}</span> ${esc(q.pinyin)}</p><p>${esc(word?.senses.join(' / ')||'')}</p></div>${wordbookTeaching(q,{feedback:true})}${mode==='pinyin'?soundPrimer(q.pinyin,action,esc):''}<div class="button-row">${action('wordbook-next',journey?(journey.step===VOCABULARY_STEPS.length-1?'Finish this word →':'Next skill →'):'Next word →','button primary')}${action('vocabulary-discover','Explore word meanings','button outline')}</div>`:
 q.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose vocabulary meaning">${q.options.map((opt,i)=>action('wordbook-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div><div class="button-row">${action('wordbook-reveal','Reveal and explain','button outline')}</div>`:
 `<div class="answer-entry"><label for="wordbook-entry">${mode==='typed'?'Write the English meaning from memory':'Type complete pinyin with tone marks or numbers'}</label><input id="wordbook-entry" type="text" value="${esc(wordbookTyped)}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${mode==='typed'?'Your English meaning':'e.g. xue2xiao4'}"></div><div class="button-row">${action('wordbook-answer','Check answer →','button primary',wordbookTyped.trim()?'':'disabled')}${action('wordbook-reveal','Reveal and explain','button outline')}</div>`}
 ${!wordbookFeedback?`<p class="muted">Study note: other senses, pinyin and example translations appear after your attempt.</p>`:''}
 </section>`}`;
}
function c9WordUi(){return {query:c9WordQuery,filter:c9WordFilter,page:c9WordPage};}
function refreshC9Words(){
 const panel=$('c9-word-catalog');
 if(panel)panel.innerHTML=c9WordCatalogResults(state,c9WordUi(),action,esc);
}
function renderWordbook(){
 const browse=renderC9VocabularyLibrary(state,c9WordUi(),action,esc);
 const study='<section class="c9-language-native c9-language-study" id="c9-native-vocabulary" aria-label="Original vocabulary practice">'+
  '<div class="c9-language-native-head"><div><p class="c9-eyebrow">ORIGINAL VOCABULARY ENGINE</p><h2>Practise word knowledge</h2>'+
  '<p>Existing meaning, pronunciation, listening and contextual tasks; independent attempts stay separate from scheduled review.</p></div></div>'+
  renderWordbookNative()+'</section>';
 return '<div class="c9-language-workspace c9-language-workspace--vocabulary">'+
  (state.vocabularyJourney?study+browse:browse+study)+'</div>';
}
function renderDiagnosticPanel(){const d=progressDiagnostics(state);const connections=contextualProgress(state);const nextWeak=contextualWeaknesses(state).slice(0,3);return `<section class="simple-panel diagnostic-panel"><div class="panel-heading"><h2>Activity by learning mode</h2><span class="muted">Past 7 days · no mastery predictions</span></div><div class="diagnostic-list">${d.sources.map(s=>`<div><strong>${esc(s.name)}</strong><span>${s.recent} checked · ${s.independent} independent correct · ${s.assisted} assisted</span></div>`).join('')}</div><p class="muted">${d.totalRecent} recorded attempts across all modes this week. Scheduled-review events remain separate from supplementary exercises.</p><div class="button-row">${action('open-dialogues','Conversation Lab →','button outline')}${action('open-wordbook-practice','Practice saved words →','button outline')}${action('open-senses','Word sense lab →','button outline')}${action('open-workshop','Sentence workshop →','button outline')}</div><div class="connected-analytics"><h3>Connecting knowledge</h3><p class="muted">These attempts are supplemental, not scheduled mastery.</p><div class="connected-analytics-grid">${connections.map(c=>`<div class="connected-analytics-item"><strong>${esc(c.name)}</strong><span>${c.attempts} attempts · ${c.independent} independent · ${c.misses} misses</span></div>`).join('')}</div><p class="muted">Recommended context to practice: ${nextWeak.map(w=>w.type==='sense'?'word meanings':w.type==='sentence'?'sentence writing':'dialogue understanding').join(' · ')}.</p><div class="button-row">${action('connected-session','Practice these connections →','button primary')}</div></div>${d.extras.map(s=>`<div class="extra-diagnostic"><strong>${esc(s.name)}</strong><span>${s.all} total · ${s.independent} independent this week · ${s.assisted} assisted</span></div>`).join('')}</section>`;}
function coachPanel(){const active=recentRemediation(state,{limit:3});const focus=active.map(item=>({...item,lessonId:item.id,misses:item.wrong,label:'Recovery practice'}));return `<section class="simple-panel coach-panel"><div class="panel-heading"><h2>Learning coach</h2><span class="muted">Observed mistakes, not a mastery prediction</span></div>${active.length?`<p class="muted">Active recovery: ${active.map(item=>`${esc(item.lesson.hanzi)} (${item.wrong} unresolved errors)`).join(' · ')}. Two later independent successes reduce an earlier error signal; they never automatically certify mastery.</p>`:''}${focus.length?`<div class="coach-grid">${focus.map(item=>{const l=findLesson(item.lessonId);return `<article><span class="eyebrow">${esc(item.label)}</span><strong lang="zh-Hans">${esc(l.hanzi)}</strong><p>${item.misses} recorded misses · ${esc(l.meaning)}</p>${action('coach-open-lesson','Revisit lesson →','button outline small',`data-id="${l.id}"`)}</article>`}).join('')}</div><div class="button-row">${action('coach-practice','Practice recent mistakes →','button primary')}</div>`:'<p>No incorrect attempts recorded yet. Work through a few lessons or try the guided Practice Lab.</p>'}</section>`;}

function bridgeTeachingPanel(lessonId){const item=characterWordSentenceBridge(lessonId);if(!item)return '';
 return `<section class="simple-panel learning-bridge" aria-label="Character to word to sentence"><div class="panel-heading"><div><p class="eyebrow">FOLLOW THE MEANING</p><h2>From character to real usage</h2></div><span class="muted">Original demo examples</span></div><div class="bridge-teaching-flow"><div class="bridge-character"><span lang="zh-Hans">${esc(item.hanzi)}</span><strong>${esc(item.reading)}</strong><small>${esc(item.meaning)}</small></div><div class="bridge-words">${item.words.map(w=>`<div class="bridge-word"><span class="eyebrow">WORD ${w.index+1}${w.occursInSentence?' · IN SENTENCE':''}</span><p lang="zh-Hans">${w.characters.map((c,i)=>w.positions.some(pos=>i>=pos&&i<pos+Array.from(item.hanzi).length)?`<mark>${esc(c)}</mark>`:esc(c)).join('')}</p><strong>${esc(w.pinyin)}</strong><small>${esc(w.meaning)}</small></div>`).join('')}</div><div class="bridge-sentence"><span class="eyebrow">CONNECTED SENTENCE</span><p lang="zh-Hans">${esc(item.sentence.hanzi)}</p><small>${esc(item.sentence.pinyin)}</small><p>${esc(item.sentence.english)}</p></div></div><p class="muted">${esc(item.teachingCaution)} These are not official HSK membership claims.</p></section>`;
}
function consolidationPanel(lessonId,{compact=false}={}){const result=lessonRemediationPlan(state,lessonId);if(!result)return '';const lesson=findLesson(lessonId),names={untried:'Not checked',independent:'Independent correct',assisted:'Used teaching support',retry:'Needs another attempt'};
 return `<section class="simple-panel course-consolidation" aria-label="Guided lesson consolidation"><div class="panel-heading"><div><p class="eyebrow">LEARNING EVIDENCE · ${esc(lesson.hanzi)}</p><h2>What your answers showed</h2></div><strong>${result.independent}/4 independent</strong></div><div class="consolidation-rows">${result.rows.map(row=>`<div class="consolidation-row"><strong>${esc(row.label)}</strong><span class="evidence-status ${row.status}">${esc(names[row.status])}</span>${compact?'':`<small>${esc(row.tip)}</small>`}</div>`).join('')}</div><p class="muted">Next: ${esc(result.action)}. ${esc(result.note)}</p><div class="button-row">${result.pending.length?action('course-repair-start',`Correct ${result.pending.length} unresolved skills →`,'button primary',`data-id="${esc(lessonId)}"`):''}${action('course-lesson','Revisit lesson →','button outline small',`data-id="${esc(lessonId)}"`)}${action('start-review','Open due reviews','button outline small')}</div></section>`;
}
/**
 * Original mini-grammar lessons shown in the existing character and journey UI.
 * Reading the explanations is not a grade. On a repeat journey, the original
 * sentence checkpoint presents the companion's contextual transfer question.
 */
function companionPanel(lesson,{compact=false}={}){
 const unit=companionForLesson(lesson?.id);if(!unit)return '';
 const examples=unit.examples.map((example,i)=>`<div class="p21-context-example"><div><span class="p21-context-index">0${i+1}</span><strong lang="zh-Hans">${esc(example.hanzi)}</strong></div><p class="p21-context-pinyin">${esc(example.pinyin)}</p><p>${esc(example.english)}</p>${action('speak','Listen','button outline small',`data-text="${esc(example.hanzi)}"`)}</div>`).join('');
 return `<section class="p21-companion ${compact?'compact':''}" aria-label="Original grammar and context lesson">
 <div class="p21-companion-head"><div><p class="eyebrow">FOUNDATIONS IN CONTEXT · ORIGINAL TEACHING</p><h3>${esc(unit.title)}</h3></div><span class="p21-companion-pattern">${esc(unit.pattern)}</span></div>
 <p class="p21-companion-explain">${esc(unit.explanation)}</p>
 <div class="p21-context-examples">${examples}</div>
 <div class="p21-companion-tip"><strong>Watch for this</strong><p>${esc(unit.pitfall)}</p></div>
 <p class="muted">Repeat this lesson's guided journey for a different word and a contextual grammar question; only submitted journey answers are recorded.</p>
 ${!compact?action('course-lesson','Open connected course practice →','button outline small',`data-id="${esc(lesson.id)}"`):''}${GRAMMAR_LESSONS.filter(g=>g.anchor===lesson.hanzi).slice(0,2).map(g=>action('grammar-select',`Study grammar: ${esc(g.title)} →`,'button outline small',`data-id="${g.id}"`)).join('')}
 </section>`;
}
function companionLibraryPanel(currentId){
 const selected=companionForLesson(currentId),near=nearbyCompanions(currentId,6);
 return `<section class="simple-panel p21-companion-library" aria-label="Beginner grammar and usage library"><div class="panel-heading"><div><p class="eyebrow">INTRODUCTORY TEACHING COLLECTION</p><h2>${COURSE_COMPANIONS.length} contextual grammar guides</h2></div><span class="muted">Original examples · linked to character lessons</span></div><p>Choose a practical pattern, learn from two original Chinese examples, then use its character lesson and connected journey for recall in context.</p><div class="p21-companion-tiles">${near.map(u=>`<button type="button" class="p21-companion-tile ${selected?.lessonId===u.lessonId?'selected':''}" data-action="context-open" data-id="${esc(u.lessonId)}"><span lang="zh-Hans">${esc(u.anchor)}</span><span><strong>${esc(u.title)}</strong><small>${esc(u.pattern)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div><details class="p21-companion-more"><summary>Browse all ${COURSE_COMPANIONS.length} foundations</summary><div class="p21-companion-tiles">${COURSE_COMPANIONS.map(u=>`<button type="button" class="p21-companion-tile" data-action="context-open" data-id="${esc(u.lessonId)}"><span lang="zh-Hans">${esc(u.anchor)}</span><span><strong>${esc(u.title)}</strong><small>${esc(u.pattern)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div></details></section>`;
}

function courseHomePanel(){const m=courseMetrics(state),l=findLesson(courseNextLesson(state)),plan=courseDayPlan(state),recent=plan.lastCompletedLessonId&&findLesson(plan.lastCompletedLessonId);return `<section class="simple-panel course-home" aria-label="Daily course journey"><div><p class="eyebrow">TODAY · CONNECTED LEARNING</p><h2>${state.courseJourney?'Resume your course journey':'One connected journey, one lesson at a time'}</h2><p>Preview a character, learn useful words and grammar in context, understand sentences, recall tones, and continue to the next lesson. Every stage is checkpointed independently of scheduled review.</p><p class="muted">${m.finished} guided lesson journeys completed · ${plan.completedToday} completed today · ${plan.due} scheduled review targets due</p><div class="course-day-focus"><strong>Today's focus</strong><p>${esc(plan.focus)}. ${esc(plan.nextDaySuggestion)}.</p>${plan.repairLessonId?action('course-repair-start',`Revisit ${esc(recent.hanzi)} · ${plan.repairCount} weak checkpoints`,'button outline small',`data-id="${recent.id}"`):''}${state.courseRepairSession?action('course-repair-open','Resume saved follow-up →','button outline small'):''}</div></div><div class="course-home-cta"><span lang="zh-Hans">${esc(l.hanzi)}</span><small>${esc(l.meaning)}</small>${action('course-home-open',state.courseJourney?'Resume journey →':'Begin connected lesson →','button primary',`data-id="${l.id}"`)}</div></section>`;}
function ladderSuggestionsPanel(){
 const suggestions=adaptiveLadderSuggestions(state,{limit:4});
 return `<section class="simple-panel ladder-suggestions" aria-label="Suggested connected practice"><div class="panel-heading"><div><p class="eyebrow">CONTEXTUAL PRACTICE</p><h2>Practice the connections you missed</h2></div><span class="muted">Transparent suggestions, not mastery scores</span></div><div class="ladder-suggestion-grid">${suggestions.map(s=>`<button type="button" class="ladder-suggestion" data-action="ladder-open" data-id="${esc(s.id)}"><span class="ladder-hanzi" lang="zh-Hans">${esc(s.lesson.hanzi)}</span><span><strong>${esc(s.lesson.meaning)}</strong><small>${esc(s.reason)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div><p class="muted">Word choice, sentence understanding, written reconstruction, and full-word pronunciation. Each answer is supplemental and never upgrades scheduled-review mastery.</p></section>`;
}
function renderLadder(){
 const session=state.ladderSession;
 const lesson=session?findLesson(session.lessonId):findLesson(displayLessonId)||DEMO_LESSONS[0];
 const stats=ladderSummary(state,lesson.id);
 if(!session)return `${title('SENTENCE LADDER','Connect a word to a sentence.','Four different tasks use the same lesson context. Learn, retrieve, rebuild and pronounce — without granting scheduled mastery.')}${gated()}<section class="simple-panel ladder-intro"><p class="eyebrow">ORIGINAL DEMONSTRATION · LESSON ${lesson.order}</p><div class="ladder-teaching"><span class="ladder-large" lang="zh-Hans">${esc(lesson.hanzi)}</span><div><h2>${esc(lesson.meaning)}</h2><p>${esc(lesson.note)}</p><p class="muted">${stats.attempts} recorded attempts · ${stats.independent} independent correct · ${stats.assisted} assisted</p></div></div><label for="ladder-lesson">Choose a lesson</label><select id="ladder-lesson">${DEMO_LESSONS.map(l=>`<option value="${l.id}" ${l.id===lesson.id?'selected':''}>${l.order}. ${esc(l.hanzi)} — ${esc(l.meaning)}</option>`).join('')}</select><div class="button-row">${action('ladder-start','Start four-step Sentence Ladder →','button primary',`data-id="${lesson.id}"`)}${action('open-lesson','View character lesson','button outline',`data-id="${lesson.id}"`)}</div></section>${ladderSuggestionsPanel()}`;
 const q=ladderQuestion(session),f=session.feedback,chosen=session.selected||[];
 const feedback=f?`<div class="reader-feedback ${f.correct&&!f.assisted?'correct':'incorrect'}" role="status"><strong>${f.correct&&!f.assisted?'Independent correct answer':'Learning feedback'}</strong><p>${esc(f.message)}</p><p>Reference: <strong lang="${q.kind==='pinyin'?'en':'zh-Hans'}">${esc(q.answer)}</strong></p><p>${f.assisted?'Support used; not independent recall.':!f.correct?'Review this example before moving ahead.':'Recorded as supplemental evidence only.'}</p></div>${q.kind==='pinyin'?toneTeachingPanel(q.answer,f.reason||''):''}`:'';
 const choices=q.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose an answer">${q.options.map((opt,i)=>action('ladder-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div>`:'';
 const order=q.kind==='order'?`<p class="muted">These are written text chunks, not verified Chinese word boundaries. Choose the chunks in the correct sentence order.</p><div class="ladder-built" lang="zh-Hans" aria-live="polite">${chosen.length?chosen.map(i=>`<span>${esc(q.chunks[i])}</span>`).join(''):'Select the first chunk below'}</div><div class="ladder-chunks" role="group" aria-label="Sentence chunks">${q.chunks.map((chunk,i)=>({chunk,i})).reverse().map(({chunk,i})=>action('ladder-select',esc(chunk),'button outline ladder-chunk',`data-index="${i}" ${chosen.includes(i)?'disabled':''}`)).join('')}</div><div class="button-row">${action('ladder-undo','Undo last chunk','button outline small',chosen.length?'':'disabled')}${action('ladder-answer','Check sentence →','button primary',chosen.length===q.chunks.length?'':'disabled')}</div>`:'';
 const input=q.kind==='pinyin'?`<div class="answer-entry"><label for="ladder-entry">Word pinyin with tone marks or numbers</label><input id="ladder-entry" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" value="${esc(ladderTyped)}" placeholder="e.g. xue2 sheng5"></div><div class="button-row">${action('ladder-answer','Check written pronunciation →','button primary',ladderTyped.trim()?'':'disabled')}</div>`:'';
 const help=!f&&session.assistanceUsed?`<div class="course-hint" role="note"><strong>Teaching support revealed</strong><p>${esc(q.teaching)}. This response will be assisted.</p></div>`:'';
 return `${title('SENTENCE LADDER',`Lesson ${lesson.order} · ${esc(lesson.meaning)}`,'Four connected assessments with saved steps. Assessed answers stay hidden until you request support.')}${gated()}<article class="simple-panel ladder-active"><div class="course-progress-head"><strong>Step ${session.cursor+1} of 4</strong><span>${esc(q.stage.toUpperCase())}</span></div><div class="course-stage-bar" aria-label="Sentence Ladder progress">${LADDER_STAGES.map((step,i)=>`<span class="${i<session.cursor?'passed':i===session.cursor?'current':''}" ${i===session.cursor?'aria-current="step"':''} title="${esc(step)}">${i+1}</span>`).join('')}</div><p class="eyebrow">${['RECOGNIZE A COMPLETE WORD','UNDERSTAND THE SENTENCE','REBUILD THE ORIGINAL CHINESE','RECALL THE WORD PRONUNCIATION'][session.cursor]}</p><h2>${esc(q.prompt)}</h2>${q.hanzi?`<p class="course-prompt-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>`:''}${f?feedback+`<div class="button-row">${action('ladder-next',session.cursor===3?'Finish this ladder →':'Continue to next skill →','button primary')}</div>`:`<p class="muted">A hint or answer reveal marks this attempt assisted. No scheduled-review credit is created.</p>${choices}${order}${input}${help}<div class="button-row">${action('ladder-hint','Explain this example','button outline')}${action('ladder-reveal','Reveal answer','button outline')}</div>`}<div class="course-bottom"><p class="muted">Checkpointed to the browser database. Save a backup to protect against device or profile loss.</p><div class="button-row">${action('ladder-pause','Pause — return to Today','button outline small')}${action('ladder-abandon','Discard unfinished ladder','button outline small')}</div></div></article>${f&&q.kind==='order'?`<p class="muted">Only the original demonstrated sentence is evaluated, not every acceptable Chinese rephrasing.</p>`:''}${f&&session.cursor===3?`<section class="simple-panel"><h3>Continue in context</h3><p>Move from isolated recall to reading or conversation.</p><div class="button-row">${courseConnections(lesson.id).readings.slice(0,2).map(st=>action('open-story-link',`Read: ${esc(st.title)} →`,'button outline',`data-id="${st.id}"`)).join('')}${courseConnections(lesson.id).dialogues.slice(0,2).map(d=>action('course-dialogue-link',`Dialogue: ${esc(d.title)} →`,'button outline',`data-id="${d.id}"`)).join('')}${action('course-lesson','Open connected journey','button outline',`data-id="${lesson.id}"`)}</div></section>`:''}`;
}
function renderCourseRepair(){const r=state.courseRepairSession;if(!r)return '';const l=findLesson(r.lessonId),q=repairQuestion(r),f=r.feedback;return `${title('TARGETED FOLLOW-UP',`Repair a learning gap · ${esc(l.hanzi)}`,'This optional saved practice does not award scheduled-review credit or certify mastery.')}${gated()}<article class="simple-panel course-active repair-active"><div class="course-progress-head"><span>Correction ${r.index+1} of ${r.stages.length}</span><span>${esc(q.stage.toUpperCase())}</span></div><div class="course-stage-bar" aria-label="Follow-up progress">${r.stages.map((stage,i)=>`<span class="${i<r.index?'passed':i===r.index?'current':''}" ${i===r.index?'aria-current="step"':''} title="${esc(stage)}">${i+1}</span>`).join('')}</div><p class="eyebrow">INDEPENDENT RETRIEVAL · OPTIONAL FOLLOW-UP</p><h2>${esc(q.prompt)}</h2>${q.hanzi?`<p class="course-prompt-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>`:''}${!f?`${q.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose the meaning">${q.options.map((opt,i)=>action('repair-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="repair-entry">Pronunciation with tones</label><input id="repair-entry" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" value="${esc(repairTyped)}" placeholder="Type the complete pinyin"></div>`}${r.assistanceUsed?`<div class="course-hint" role="note"><strong>Help has been revealed</strong><p>${esc(q.answer)}. This attempt will be recorded as assisted.</p></div>`:''}<div class="button-row">${q.kind==='pinyin'?action('repair-answer','Check answer →','button primary',repairTyped.trim()?'':'disabled'):''}${action('repair-hint','Show teaching support','button outline')}${action('repair-reveal','Reveal answer','button outline')}</div>`:`<div role="status" class="reader-feedback ${f.correct&&!f.assisted?'correct':'incorrect'}"><strong>${f.correct&&!f.assisted?'Independent correction recorded':'Teaching feedback'}</strong><p>${esc(f.message)}</p><p>Reference: ${esc(q.answer)}</p><p>${f.assisted?'Assisted result cannot resolve an independent-recall gap.':f.correct?'This stage can now count as independently corrected.':'Return to teaching and repeat this skill again later.'}</p></div>${q.kind==='pinyin'?toneTeachingPanel(q.answer,f.reason||''):''}<div class="button-row">${action('repair-next',r.index===r.stages.length-1?'Finish follow-up →':'Continue →','button primary')}</div>`}<div class="course-bottom"><span class="muted">Saved after each answer · Correction history stays separate from scheduled mastery</span><div class="button-row">${action('repair-pause','Pause and return to Today','button outline small')}${action('repair-abandon','End unfinished follow-up','button outline small')}</div></div></article>`;}

function renderJourney(){if(state.courseRepairSession)return renderCourseRepair();const j=state.courseJourney,m=courseMetrics(state),l=j?findLesson(j.lessonId):findLesson(displayLessonId)||findLesson(courseNextLesson(state)),units=courseUnitMilestones(state),prereqs=lessonPrerequisites(l.id,state),connections=courseConnections(l.id);const summaryPanel=`<section class="simple-panel"><div class="panel-heading"><h2>Course milestones</h2><span class="muted">Guided completion is not certified mastery</span></div><div class="course-unit-grid">${units.map(u=>`<div class="course-unit"><strong>${u.id.toString().padStart(2,'0')} · ${esc(u.title)}</strong><span>${u.completed}/${u.total} guided journeys · ${u.introduced} introduced</span><div class="progress-rail"><span style="width:${100*u.completed/u.total}%"></span></div></div>`).join('')}</div></section>`;
 const connectionsPanel=`<section class="simple-panel course-connections"><h3>Keep learning in context</h3><p class="muted">Connections are based on literal vocabulary overlap; they are not verified word-sense alignment.</p><div class="word-link-row">${connections.words.map(w=>action('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span> · ${esc(w.meaning)}`,'button outline small',`data-word="${esc(w.hanzi)}"`)).join('')}</div><div class="button-row">${connections.readings.map(r=>action('open-story-link',`Read: ${esc(r.title)} ↗`,'button outline small',`data-id="${r.id}"`)).join('')}${connections.dialogues.map(d=>action('course-dialogue-link',`Dialogue: ${esc(d.title)} ↗`,'button outline small',`data-id="${d.id}"`)).join('')}${action('open-wordbook-practice','Saved-word practice →','button outline small')}${action('open-practice','Extra practice →','button outline small')}</div></section>`;
 const plan=courseDayPlan(state),weak=unresolvedCourseSkills(state,l.id),last=plan.lastCompletedLessonId&&findLesson(plan.lastCompletedLessonId);const followupPanel=`<section class="simple-panel course-next-day"><p class="eyebrow">CONTINUE TOMORROW</p><h3>Your next-day study sequence</h3><ol><li>${plan.due} existing scheduled recall targets are due now; review these without awarding synthetic success.</li><li>${plan.repairCount} unresolved checkpoint skills from the latest completed journey; correct them independently.</li><li>Begin or resume the next connected character lesson.</li></ol><p class="muted">${esc(plan.nextDaySuggestion)}. These are recommendations, not proof of proficiency.</p>${plan.repairLessonId?action('course-repair-start',`Repair the previous lesson (${esc(last.hanzi)}) →`,'button primary',`data-id="${last.id}"`):''}</section>`;
 if(!j)return `${title('DAILY STUDY JOURNEY','Learn in a connected sequence.','Six stages join character teaching, vocabulary, reading, recall and follow-up. No official HSK level is inferred.')}${gated()}<section class="simple-panel course-selection"><p class="eyebrow">RECOMMENDED ORIGINAL DEMO · LESSON ${l.order}</p><div class="course-selection-main"><span lang="zh-Hans" class="course-big-char">${esc(l.hanzi)}</span><div><h2>${esc(l.meaning)}</h2><p>${esc(l.pinyin)} · ${esc(l.note)}</p><p class="muted">${lastCourseCompletion(state,l.id)?'Previously completed — repeating is allowed.':'Not yet completed as a guided journey.'}</p></div></div><label for="course-lesson-picker">Choose a lesson</label><select id="course-lesson-picker">${DEMO_LESSONS.map(item=>`<option value="${item.id}" ${item.id===l.id?'selected':''}>${item.order}. ${esc(item.hanzi)} · ${esc(item.meaning)}</option>`).join('')}</select><div class="course-prereqs"><strong>Suggested preparation (not a lock)</strong>${prereqs.length?prereqs.map(x=>`<span>${x.studied?'✓':'○'} ${esc(x.hanzi)} — ${esc(x.reason)}</span>`).join(''):'<span>No previous lesson needed.</span>'}</div><div class="button-row">${action('course-start','Begin six-stage journey →','button primary',`data-id="${l.id}"`)}${action('open-lesson','Browse full character lesson','button outline',`data-id="${l.id}"`)}${action('ladder-open','Practice word + sentence →','button outline',`data-id="${l.id}"`)}${action('course-next','Next lesson →','button outline small')}</div></section>${companionPanel(l)}${bridgeTeachingPanel(l.id)}${lastCourseCompletion(state,l.id)?consolidationPanel(l.id):''}${followupPanel}${connectionsPanel}${summaryPanel}`;
 const q=courseQuestion(j),stage=COURSE_STAGES[j.cursor],hint=j.assistanceUsed,showFeedback=!!j.feedback;
 return `${title('DAILY STUDY JOURNEY',`Lesson ${l.order} · ${esc(l.meaning)}`,'Your checkpoint is saved after every action. Supplementary answers never change scheduled-review mastery.')}${gated()}<article class="simple-panel course-active"><div class="course-progress-head"><span>Step ${j.cursor+1} of ${COURSE_STAGES.length}</span><span>${esc(stage.toUpperCase())} · ${esc(l.hanzi)}</span></div><div class="course-stage-bar" aria-label="Journey stages">${COURSE_STAGES.map((x,i)=>`<span class="${i<j.cursor?'passed':i===j.cursor?'current':''}" ${i===j.cursor?'aria-current="step"':''} title="${esc(x)}">${i+1}</span>`).join('')}</div><div class="course-stage"><p class="eyebrow">${esc(stage.replaceAll('-',' ').toUpperCase())} · ORIGINAL DEMONSTRATION</p><h2>${esc(q.prompt)}</h2>
 ${q.kind==='prepare'?`<div class="course-teaching"><div class="course-focus" lang="zh-Hans">${esc(l.hanzi)}</div><div><strong>${esc(l.pinyin)} · ${esc(l.meaning)}</strong><p>${esc(l.note)}</p>${toneTeachingPanel(l.pinyin)}</div></div><h3>Two word contexts to compare</h3><p class="muted">The same character can contribute a different meaning or pronunciation in each complete word. Read the full word before checking the meaning.</p><div class="course-vocabulary">${l.words.map(w=>`<div class="course-vocab-entry"><strong lang="zh-Hans">${esc(w.hanzi)}</strong><span>${esc(w.pinyin)}</span><small>${esc(w.english)}</small>${action('speak','Listen','button outline small',`data-text="${esc(w.hanzi)}"`)}</div>`).join('')}</div><div class="course-sentence-preview"><p class="eyebrow">READ BEFORE RECALLING</p><p lang="zh-Hans">${esc(l.sentence.hanzi)}</p><p>${esc(l.sentence.pinyin)} · ${esc(l.sentence.english)}</p>${action('speak','Hear this sentence','button outline small',`data-text="${esc(l.sentence.hanzi)}"`)}</div><p class="muted">Notice how the complete sentence connects the vocabulary to an actual statement. Pinyin and English are teaching aids here; later questions withhold them until you answer.</p><h3>Useful foundations</h3><div class="course-prereqs">${prereqs.map(x=>`<button class="button outline small" data-action="open-lesson" data-id="${x.id}">${esc(x.hanzi)} · ${esc(x.meaning)} ${x.studied?'✓':'○'}</button>`).join('')||'<p class="muted">You can start here.</p>'}</div><div class="button-row">${action('course-advance','I am ready →','button primary')}</div>`:''}
 ${q.kind==='prepare'?companionPanel(l):''}
  ${q.kind==='followup'?`<div class="course-teaching"><div class="course-focus" lang="zh-Hans">${esc(l.hanzi)}</div><div><strong>Connect the lesson to practice</strong><p>Your four checks are recorded as extra course evidence, not scheduled mastery. Finishing introduces any missing recall targets; it does not grade them or certify mastery.</p><p>${esc(l.sentence.hanzi)} · ${esc(l.sentence.english)}</p></div></div><div class="button-row">${action('course-finish',state.learned.includes(l.id)?'Complete journey & keep existing reviews →':'Complete journey & activate recall →','button primary')}${!state.courseRepairSession?action('course-repair-start',weak.length?`Correct ${weak.length} weak checkpoints →`:'Practice 3 consolidation checks →','button outline',`data-id="${l.id}"`):''}${action('start-review','Open scheduled reviews','button outline')}</div><p class="muted">${weak.length?`Unresolved: ${weak.map(x=>esc(x.reason)).join(', ')}. Correction practice remains supplemental.`:'All checked skills were last answered independently. Review retention still needs scheduled attempts.'}</p>`:''}
 ${q.kind==='choice'||q.kind==='pinyin'?`<div class="course-question">${q.grammarFocus?`<p class="eyebrow">GRAMMAR IN CONTEXT · REPEAT LESSON</p><p class="muted">Use the lesson's grammar pattern with a different example.</p>`:''}${q.hanzi?`<p class="course-prompt-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>${q.kind==='choice'?action('speak','Listen to the Chinese','button outline small',`data-text="${esc(q.hanzi)}"`):''}`:''}${!showFeedback?`<p class="muted">Answers remain hidden until checking. Revealing help makes this attempt assisted.</p>${q.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose your answer">${q.options.map((o,i)=>action('course-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(o)}`,'choice',`data-option="${esc(o)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="course-entry">Pinyin with tone marks or tone numbers</label><input id="course-entry" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" value="${esc(courseTyped)}" placeholder="Enter pinyin including tones"></div>`}${hint?`<div class="course-hint" role="note"><strong>Teaching support enabled</strong><p>${esc(q.answer)} · This attempt cannot receive independent credit.</p></div>`:''}<div class="button-row">${q.kind==='pinyin'?action('course-answer','Check my pronunciation →','button primary',courseTyped.trim()?'':'disabled'):''}${action('course-hint','Show a teaching hint','button outline')}${action('course-reveal','Reveal the answer','button outline')}</div>`:`<div class="reader-feedback ${j.feedback.correct&&!j.feedback.assisted?'correct':'incorrect'}" role="status"><strong>${j.feedback.correct&&!j.feedback.assisted?'Correct, independently':'Learning feedback'}</strong><p>${esc(j.feedback.message)}</p><p>Reference: <strong>${esc(q.answer)}</strong></p><p>${j.feedback.assisted?'Assisted attempt, no independent success awarded.':j.feedback.correct?'Independent supplemental success recorded.':'Review this answer before moving forward.'}</p></div>${q.kind==='pinyin'?toneTeachingPanel(q.answer,j.feedback.reason||''):''}<div class="button-row">${action('course-advance','Continue to the next step →','button primary')}</div>`}</div>`:''}
 </div>${stage==='sentence'&&showFeedback?companionPanel(l,{compact:true}):''}<div class="course-bottom"><span class="muted">Saved checkpoint · You can leave and resume later.</span><div class="button-row">${action('course-pause','Return to Today (keep checkpoint)','button outline small')}${action('course-abandon','Discard current journey','button outline small')}</div></div></article>${stage==='prepare'?bridgeTeachingPanel(l.id):''}${stage==='followup'?consolidationPanel(l.id):''}${followupPanel}${connectionsPanel}${summaryPanel}`;
}
function renderTrailPanel(){
 const b=state.studyBlock;if(!b)return '';
 const t=state.blockTrail,st=trailSummary(state),sources=trailSources(state);
 if(!t)return `<section class="simple-panel context-trail"><div class="panel-heading"><div><p class="eyebrow">OPTIONAL CONTEXT TRAIL · BATCH 16</p><h2>Read → converse → pronounce</h2></div><span class="muted">${st.completed} completed trails</span></div><p>Practice original sentences from ${esc(sources.story.title)} and ${esc(sources.dialogue.title)}, then recall a full-word pronunciation. Context trails are supplemental and never award scheduled-review mastery.</p><p class="muted">${sources.relatedStory&&sources.relatedDialogue?'These examples share written vocabulary with your current lessons.':'One or more examples are general demonstration practice rather than linked vocabulary.'}</p>${action('trail-start','Start 3-step contextual trail →','button primary')}</section>`;
 const q=trailQuestion(state),f=t.feedback;
 return `<section class="simple-panel context-trail"><div class="panel-heading"><div><p class="eyebrow">CONTEXT TRAIL</p><h2>${esc(q.source)}</h2></div><span class="muted">Step ${t.cursor+1}/3</span></div><div class="progress-rail"><span style="width:${t.cursor*33}%"></span></div><p class="eyebrow">${q.kind==='reading-evidence'?'READING EVIDENCE':q.kind==='dialogue-evidence'?'CONVERSATION EVIDENCE':'WRITTEN PRONUNCIATION'}</p><div class="trail-sentences" lang="zh-Hans">${q.context.map(line=>`<p>${esc(line)}</p>`).join('')}</div><p>${esc(q.question)}</p>${!f?`${q.options?`<div class="choice-list">${q.options.map((o,i)=>action('trail-answer',`<span>${i+1}</span><span lang="zh-Hans">${esc(o)}</span>`,'choice',`data-option="${esc(o)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="trail-entry">Full-word pinyin, with lexical tones</label><input id="trail-entry" type="text" value="${esc(trailTyped)}" autocomplete="off" spellcheck="false" placeholder="Use tone marks or numbers"></div>`}${t.assisted?`<p class="muted" role="note">Support revealed: ${esc(q.help)} · This answer will be recorded as assisted.</p>`:''}<div class="button-row">${!q.options?action('trail-answer','Check pronunciation →','button primary',trailTyped.trim()?'':'disabled'):''}${action('trail-hint','Show teaching support','button outline')}${action('trail-reveal','Reveal answer','button outline')}</div>`:`<div class="reader-feedback ${f.correct&&!f.assisted?'correct':'incorrect'}" role="status"><strong>${f.correct&&!f.assisted?'Independent correct':'Study feedback'}</strong><p>${esc(f.message)}</p><p>Reference: <span lang="${q.options?'zh-Hans':'en'}">${esc(q.answer)}</span></p><p>${f.assisted?'Assisted attempt.':'Supplementary evidence only.'}</p></div>${action('trail-next',t.cursor===2?'Finish context trail →':'Next context →','button primary')}`}</section>`;
}
function blockDailyInsights(){const data=blockOverview(state),trail=trailSummary(state);return `<section class="simple-panel block-coach"><div class="panel-heading"><div><p class="eyebrow">SKILL EVIDENCE · BATCH 16</p><h2>What to revisit next</h2></div><span class="muted">Observation-based, not mastery certification</span></div><div class="stats-grid">${stat(data.unresolved,'Lessons with unresolved skill evidence')}${stat(data.independent,'Latest independently correct skill facets')}${stat(trail.completed,'Context trails completed')}</div>${data.top.length?`<div class="pathway-steps">${data.top.slice(0,3).map(item=>`<button class="pathway-step" data-action="open-lesson" data-id="${item.lesson.id}"><span lang="zh-Hans" class="pathway-hanzi">${esc(item.lesson.hanzi)}</span><span><strong>${esc(item.lesson.meaning)}</strong><small>${esc(item.reason)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div>`:'<p class="muted">No unresolved observed errors yet. Begin lessons or scheduled review to collect independent evidence.</p>'}${action('block-open',state.studyBlock?'Continue your connected Study Block →':'Plan a connected Study Block →','button outline')}</section>`;}

function fluencyHomePanel(){const m=fluencySummary(state),s=state.fluencySession;return `<section class="simple-panel fluency-promo"><div class="panel-heading"><div><p class="eyebrow">CONNECTED PRACTICE · BATCH 17</p><h2>${s?'Resume Fluency Studio':'Build fluency across contexts'}</h2></div><span class="status-tag">${s?`${s.cursor+1}/${s.questionIds.length} questions`:m.completed+' sessions'}</span></div><p>Mix character meanings, real-word pinyin, reconstructed sentences, reading evidence, and conversations in one saved session. Mistakes affect future suggestions, not scheduled mastery.</p><div class="button-row">${action('fluency-open',s?'Resume saved session →':'Open Fluency Studio →','button primary')}${action('block-open','Multi-lesson Study Block →','button outline')}</div></section>`;}
function fluencyAnalyticsPanel(){const x=fluencySummary(state),events=state.fluencyEvents||[],kinds=['sense','writing','reading','dialogue','tone'];return `<section class="simple-panel fluency-analytics"><div class="panel-heading"><div><p class="eyebrow">OBSERVED PERFORMANCE</p><h2>Fluency Studio diagnostics</h2></div><span class="muted">Extra practice · Not mastery</span></div><div class="stats-grid">${stat(x.completed,'Complete studio sessions')}${stat(x.independent,'Independent correct answers')}${stat(x.unresolved,'Questions worth revisiting')}</div><div class="fluency-skill-grid">${kinds.map(kind=>{const attempts=events.filter(e=>e.questionId.startsWith(kind==='writing'?'write:':kind==='reading'?'read:':kind==='dialogue'?'talk:':kind==='sense'?'sense:':'tone:'));return `<div class="fluency-skill"><strong>${esc(kind==='sense'?'Word senses':kind==='writing'?'Sentence writing':kind==='reading'?'Reading evidence':kind==='dialogue'?'Conversation':'Tone recall')}</strong><span>${attempts.filter(e=>e.correct&&!e.assisted).length}/${attempts.length} independent successes</span></div>`}).join('')}</div>${action('fluency-open',x.active?'Continue saved practice →':'Start contextual practice →','button outline')}</section>`;}
function fluencySourceAction(q){if(!q)return '';if(q.origin.type==='lesson')return action('fluency-source','Open linked lesson ↗','button outline small',`data-id="${esc(q.origin.id)}" data-kind="lesson"`);
 if(q.origin.type==='reading')return action('fluency-source','Read entire passage ↗','button outline small',`data-id="${esc(q.origin.id)}" data-kind="reading"`);
 if(q.origin.type==='dialogue')return action('fluency-source','Open conversation ↗','button outline small',`data-id="${esc(q.origin.id)}" data-kind="dialogue"`);
 return action('fluency-source','Compare related meanings ↗','button outline small',`data-id="${esc(q.origin.id)}" data-kind="sense"`);}
function renderFluency(){const m=fluencySummary(state),session=state.fluencySession;
 if(!session){const kinds=[['balanced','Balanced'],['weak','Recent mistakes'],['context','Reading & meanings'],['pronunciation','Tone focus']];const example=planFluency(state,{size:fluencySize,focus:fluencyFocus});return `${title('FLUENCY STUDIO','One session. Several real contexts.','Connect vocabulary, sentence construction, reading, dialogue and written-tone recall. Only original demonstration content; supplemental results never award scheduled mastery.')}${gated()}<section class="simple-panel fluency-start"><div class="panel-heading"><h2>Configure a continuous session</h2><span class="muted">${FLUENCY_BANK.length} original demo prompts available</span></div><p class="muted">Your recent independently correct and assisted results influence which questions appear. The practice algorithm is a heuristic, not a calibrated proficiency score.</p><div class="mode-tabs" role="group" aria-label="Fluency session focus">${kinds.map(([kind,label])=>action('fluency-focus',label,`button ${fluencyFocus===kind?'dark':'outline'} small`,`data-focus="${kind}"`)).join('')}</div><div class="button-row">${[6,8,12,16].map(size=>action('fluency-size',`${size} questions`,`button ${fluencySize===size?'dark':'outline'} small`,`data-size="${size}"`)).join('')}</div><div class="fluency-preview"><strong>In your next session</strong>${example.slice(0,6).map(id=>{const q=FLUENCY_BANK.find(x=>x.id===id),priority=fluencyPriority(state,q);return `<div class="fluency-preview-item"><span>${esc(q.kind.toUpperCase())}</span><span>${esc(q.hanzi||q.context.slice(0,45))}</span><small>${esc(priority.reason)}</small></div>`}).join('')}</div>${action('fluency-start','Start connected practice →','button primary')}</section>${fluencyAnalyticsPanel()}`;}
 const q=fluencyCurrent(state),f=session.feedback;const sourceLabel={tone:'Full-word pronunciation',sense:'Contextual word sense',writing:'Chinese sentence reconstruction',reading:'Reading evidence',dialogue:'Conversation evidence'};
 return `${title('FLUENCY STUDIO',`Question ${session.cursor+1} of ${session.questionIds.length}`,'Your response history is saved after every submitted answer. You can leave this session and return to it later.')}${gated()}<article class="simple-panel fluency-work"><div class="panel-heading"><p class="eyebrow">${esc(sourceLabel[q.kind])} · ${esc(session.focus)} practice</p><span class="muted">${Math.round(100*session.cursor/session.questionIds.length)}% completed</span></div><div class="progress-rail"><span style="width:${Math.round(100*session.cursor/session.questionIds.length)}%"></span></div><div class="fluency-context">${q.hanzi?`<p class="fluency-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>`:''}<p lang="${q.kind==='writing'?'en':'zh-Hans'}">${esc(q.context)}</p></div><h2>${esc(q.prompt)}</h2>${!f?`${q.options?`<div class="choice-list" role="group" aria-label="Select a contextual answer">${q.options.map((option,i)=>action('fluency-answer',`<span>${String.fromCharCode(65+i)}</span><span lang="${q.kind==='sense'?'en':'zh-Hans'}">${esc(option)}</span>`,'choice',`data-option="${esc(option)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="fluency-entry">${q.kind==='tone'?'Pinyin with tone marks or numbers':'Write the original Chinese sentence'}</label><input id="fluency-entry" type="text" value="${esc(fluencyTyped)}" autocapitalize="off" spellcheck="false" autocomplete="off" placeholder="${q.kind==='tone'?'e.g. ni3 hao3':'Type Chinese characters'}"></div>`}${session.assisted?`<p class="fluency-help" role="note"><strong>Teaching support revealed</strong><span>${esc(q.teaching)}</span><small>Answer will be marked assisted.</small></p>`:''}<div class="button-row">${!q.options?action('fluency-answer','Check my answer →','button primary',fluencyTyped.trim()?'':'disabled'):''}${action('fluency-hint','Show teaching hint','button outline')}${action('fluency-reveal','Reveal answer','button outline')}</div>`:`<div class="reader-feedback ${f.correct&&!f.assisted?'correct':'incorrect'}" role="status"><strong>${f.correct&&!f.assisted?'Correct independently':'Learning feedback'}</strong><p>${esc(f.message)}</p><p><strong>Reference:</strong> <span lang="${q.kind==='sense'?'en':'zh-Hans'}">${esc(q.answer)}</span></p><p>${f.assisted?'Assisted response: no independent credit.':f.correct?'Independent supplemental success recorded.':'This is a practice opportunity, not a review grade.'}</p><p class="fluency-explanation">${esc(q.teaching)}</p>${q.kind==='sense'?(()=>{const c=SENSE_CASES.find(x=>x.id===q.origin.id),other=SENSE_CASES.find(x=>x.target===c?.target&&x.id!==c.id);return other?`<div class="fluency-contrast"><p class="eyebrow">COMPARE TWO REAL CONTEXTS</p><div class="fluency-contrast-grid"><div><p lang="zh-Hans">${esc(c.hanzi)}</p><strong>${esc(c.answer)}</strong><small>${esc(c.pinyin)}</small></div><div><p lang="zh-Hans">${esc(other.hanzi)}</p><strong>${esc(other.answer)}</strong><small>${esc(other.pinyin)}</small></div></div><p class="muted">Readings and senses belong to the complete contexts; one universal reading is not implied.</p></div>`:''})():''}</div><div class="button-row">${action('fluency-next',session.cursor===session.questionIds.length-1?'Finish & save summary →':'Next question →','button primary')}${fluencySourceAction(q)}</div>`}<div class="fluency-bottom"><span class="muted">Local checkpoint · Supplemental only</span><div class="button-row">${action('fluency-pause','Return to Today','button outline small')}${action('fluency-abandon','Discard current session','button outline small')}</div></div></article>`;
}
function blockHomePanel(){const stats=blockStatistics(state),active=state.studyBlock,preview=selectBlockLessons(state,{focus:'balanced',count:2});
 return `<section class="simple-panel study-block-promo" aria-label="Multi-lesson learning"><div><p class="eyebrow">CONNECTED LEARNING · BATCH 15</p><h2>${active?'Resume your multi-lesson Study Block':'Take a connected two-lesson Study Block'}</h2><p>Complete Daily Journey and Sentence Ladder for each lesson. Progress checkpoints remain in your local data; scheduled review grades remain independent.</p><p class="muted">${stats.finished} blocks completed · ${stats.steps} activity milestones recorded${active?` · Step ${active.cursor+1}/${active.steps.length}`:''}</p></div><div class="button-row">${action('block-open',active?'Resume block →':'Choose a Study Block →','button primary')}${!active?action('block-open',`Preview ${esc(preview.map(l=>l.hanzi).join(' · '))}`,'button outline'):''}</div></section>`;}
function blockProgressPanel(){const stats=blockStatistics(state);return `<section class="simple-panel"><div class="panel-heading"><h2>Connected Study Blocks</h2><span class="muted">Learning journey milestones, not recall mastery</span></div><div class="stats-grid">${stat(stats.finished,'Blocks completed')}${stat(stats.steps,'Linked activities completed')}${stat(stats.remaining,'Steps remaining in active block')}</div>${action('block-open',stats.active?'Resume current block →':'Start a multi-lesson block →','button outline')}</section>`;}
function blockResumeBar(){if(!state.studyBlock||route()==='block')return '';const step=blockCurrent(state);return `<div class="block-resume-bar"><span><strong>Study Block in progress</strong> · ${step.index+1}/${step.total} · ${esc(step.lesson.hanzi)} · ${esc(step.kind)}</span>${action('block-open','Return to block →','button outline small')}</div>`;}
function renderBlock(){const current=blockCurrent(state),stats=blockStatistics(state);
 if(!current){const candidates=selectBlockLessons(state,{focus:blockFocus,count:blockCount}),preferences=[['balanced','Balanced'],['weak','Review weak points'],['new','Learn new']].map(([id,label])=>action('block-focus',label,`button ${blockFocus===id?'dark':'outline'} small`,`data-focus="${id}"`)).join('');
 return `${title('STUDY BLOCKS','Learn more than one lesson in context.','Choose two to four connected lesson journeys. Finish each Daily Journey and Sentence Ladder, then return here to continue. Existing progress stays intact.')}${gated()}<section class="simple-panel block-setup"><h2>Set up a block</h2><p class="muted">The plan uses actual previously recorded errors and uncompleted course lessons. It does not manufacture review mastery.</p><div class="mode-tabs">${preferences}</div><div class="button-row">${[2,3,4].map(n=>action('block-count',`${n} lessons`,`button ${blockCount===n?'dark':'outline'} small`,`data-count="${n}"`)).join('')}</div><div class="block-preview">${candidates.map((l,i)=>`<div><span>${i+1}</span><strong lang="zh-Hans">${esc(l.hanzi)}</strong><div><b>${esc(l.meaning)}</b><small>${esc(l.words.map(w=>w.hanzi).join(' / '))}</small><small>${esc(lessonPriority(state,l.id).reason)}</small></div></div>`).join('')}</div>${action('block-start','Begin this Study Block →','button primary')}</section><section class="simple-panel"><h2>Recent learning</h2><p>${stats.finished} completed multi-lesson blocks and ${stats.steps} linked stages recorded. ${blockOverview(state).unresolved} lessons have at least one recently missed or assisted skill. Your original review queue is separate.</p></section>`;
 }
 const b=state.studyBlock,step=current,ready=blockStepReady(state),connections=crossLessonConnections(b.lessonIds),evidence=blockSkillEvidence(state);
 const steps=b.steps.map((s,i)=>{const l=findLesson(s.lessonId);return `<div class="block-step ${i===b.cursor?'active':''} ${i<b.cursor?'complete':''}"><span>${i<b.cursor?'✓':i+1}</span><strong lang="zh-Hans">${esc(l.hanzi)}</strong><div><b>${s.kind==='journey'?'Daily Journey':s.kind==='ladder'?'Sentence Ladder':s.kind==='contrast'?'Cross-lesson meaning':'Full-word pronunciation'}</b><small>${esc(l.meaning)}</small></div><small>${i<b.cursor?'Completed':i===b.cursor?ready?'Ready to advance':'Current task':'Upcoming'}</small></div>`}).join('');
 return `${title('STUDY BLOCKS',`Your ${b.lessonIds.length}-lesson learning block`,'A saved path connecting character lessons, complete words, sentence construction and written-tone recall.')}${gated()}<section class="simple-panel block-work"><div class="panel-heading"><h2>Study sequence</h2><span class="muted">Step ${step.index+1} / ${step.total} · ${esc(b.focus)} focus</span></div><div class="progress-rail"><span style="width:${Math.round(b.cursor/b.steps.length*100)}%"></span></div><div class="block-steps">${steps}</div><div class="block-current"><p class="eyebrow">CURRENT ACTIVITY</p><h3><span lang="zh-Hans">${esc(step.lesson.hanzi)}</span> · ${step.kind==='journey'?'Daily Journey':step.kind==='ladder'?'Sentence Ladder':step.kind==='contrast'?'Sentence meaning':'Word pronunciation'}</h3><p>${step.kind==='journey'?'Complete the six-stage character-to-sentence journey, including feedback and pronunciation recall.':step.kind==='ladder'?'Complete word identification, sentence meaning, original-word-order construction and full-word pinyin.':'Connect the last lesson to what you learned earlier, without revealing the answer first.'}</p>${['contrast','pronunciation'].includes(step.kind)?(()=>{const q=blockBridgeQuestion(state),f=state.studyBlock.feedback;return `<div class="block-assessment"><p lang="zh-Hans" class="course-prompt-hanzi">${esc(q.hanzi)}</p><p>${esc(q.prompt)}</p>${!f?`${q.kind==='choice'?`<div class="choice-list">${q.options.map((o,i)=>action('block-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(o)}`,'choice',`data-option="${esc(o)}"`)).join('')}</div>`:`<div class="answer-entry"><label for="block-entry">Pinyin with lexical tones</label><input id="block-entry" type="text" autocomplete="off" spellcheck="false" value="${esc(blockTyped)}" placeholder="e.g. xue2sheng5"></div>`}${state.studyBlock.assistanceUsed?`<p role="note">Teaching help: ${esc(q.teaching)}. This attempt will be recorded as assisted.</p>`:''}<div class="button-row">${q.kind==='pinyin'?action('block-answer','Check full-word pinyin →','button primary',blockTyped.trim()?'':'disabled'):''}${action('block-hint','Reveal teaching support','button outline')}${action('block-reveal','Reveal answer','button outline')}</div>`:`<div class="reader-feedback ${f.correct&&!f.assisted?'correct':'incorrect'}" role="status"><strong>${f.correct&&!f.assisted?'Independent correct answer':'Teaching feedback'}</strong><p>${esc(f.message)}</p><p>Reference: ${esc(q.answer)}</p><p>${f.assisted?'Assisted, not independent.':'Recorded as supplemental practice only.'}</p></div>`}</div>`})():''}
 ${ready?`<p role="status" class="block-ready">This activity was completed after the block began. Your next activity is ready.</p>`:`<p class="muted">Completion is checked against recorded activity evidence; simply opening the lesson is not enough.</p>`}<div class="button-row">${ready?action('block-advance','Continue to next stage →','button primary'):action('block-launch',`Open ${step.kind==='journey'?'Daily Journey':step.kind==='ladder'?'Sentence Ladder':step.kind==='contrast'?'Sentence meaning':'Word pronunciation'} →`,'button primary')}${action('block-abandon','End this block','button outline small')}</div></div></section>
 <section class="simple-panel"><h2>Evidence and follow-up</h2><p class="muted">Correct answers after revealing assistance remain assisted. These counts do not affect scheduled recall mastery.</p><div class="block-evidence">${evidence.map(e=>{const l=findLesson(e.lessonId);return `<div><span lang="zh-Hans">${esc(l.hanzi)}</span><b>${esc(l.meaning)}</b><small>${e.independent} independent · ${e.mistakes} incorrect/assisted</small>${e.mistakes?action('block-repair','Targeted follow-up →','button outline small',`data-id="${l.id}"`):''}</div>`}).join('')}</div></section>
 <section class="simple-panel"><h2>Word and sentence connections</h2><p class="muted">${esc(connections.notice)}</p>${connections.shared.length?`<div class="block-links">${connections.shared.map(s=>`<div><strong lang="zh-Hans">${esc(s.a.hanzi)} · ${esc(s.b.hanzi)}</strong><p>${esc(s.a.pinyin)} / ${esc(s.b.pinyin)} · ${esc(s.a.english)} / ${esc(s.b.english)}</p><small>${esc(s.note)}</small></div>`).join('')}</div>`:'<p>No shared complete-word or character overlap was found between these specific lesson examples.</p>'}<div class="button-row">${connections.readings.map(s=>action('block-story',`Read: ${esc(s.title)} →`,'button outline small',`data-id="${s.id}"`)).join('')}${connections.dialogues.map(d=>action('block-dialogue',`Dialogue: ${esc(d.title)} →`,'button outline small',`data-id="${d.id}"`)).join('')}</div></section>${renderTrailPanel()}`;
}

function planSummaryPanel(){
 const week=plannedDays(state),first=week[0],mistakes=mistakeCollections(state),prefs=planPreferences(state),finished=first.tasks.filter(t=>t.done).length;
 return `<section class="simple-panel plan-summary"><div class="panel-heading"><div><p class="eyebrow">YOUR STUDY ROUTINE · LOCAL ONLY</p><h2>Today's connected plan</h2></div><span class="status-tag">${finished}/${first.tasks.length} activities attempted</span></div><p>${prefs.minutes}-minute suggested workload · ${esc(prefs.focus)} focus · ${mistakes.unresolved.length} unresolved observations. Completion indicates recorded activity, not mastery.</p><div class="plan-today-items">${first.tasks.map(t=>`<span class="${t.done?'done':''}">${t.done?'✓':'○'} ${esc(t.label)}</span>`).join('')}</div><div class="button-row">${action('plan-open','Open 7-day study plan →','button primary')}${action('plan-mistakes','Review saved mistakes →','button outline')}</div></section>`;
}
function renderPlan(){
 const prefs=planPreferences(state),week=plannedDays(state),coll=mistakeCollections(state),related=nextConnectedMaterial(state);
 const tasks=week[0].tasks.map(t=>`<div class="plan-task ${t.done?'done':''}"><div class="plan-task-icon" aria-hidden="true">${t.done?'✓':'○'}</div><div><strong>${esc(t.label)}</strong><p>${esc(t.why)}</p><small>${t.minutes} min suggested · ${t.done?'Activity recorded':'Not yet recorded'}</small></div>${action('plan-launch',t.done?'Practice again →':'Open →','button outline small',`data-kind="${t.type}"`)}</div>`).join('');
 const renderMistake=x=>`<div class="mistake-item ${x.unresolved?'unresolved':'corrected'}"><div><span class="eyebrow">${esc(x.kind)} · ${x.unresolved?'Needs correction':'Later corrected'}</span><strong>${esc(x.label)}</strong><small>${esc(x.reason)} · ${x.attempts} observations</small></div><div class="button-row">${action('plan-source','Open source →','button outline small',`data-id="${esc(x.id)}"`)}${action('plan-pin',coll.pins.has(x.id)?'Unsave':'Save','button outline small',`data-id="${esc(x.id)}" aria-pressed="${coll.pins.has(x.id)}"`)}</div></div>`;
 return `${title('YOUR LEARNING PLAN','One course, one daily plan.','Seven-day suggestions are derived from local observed activity. They are not reservations, reminders, guaranteed completion or official HSK recommendations.')}${gated()}
 <section class="simple-panel plan-controls"><div class="panel-heading"><h2>Configure your study routine</h2><span class="muted">Saved locally · Included in backups</span></div><div class="plan-config"><div><strong>Daily workload</strong><div class="button-row">${PLAN_MINUTES.map(n=>action('plan-minutes',`${n} min`,`button ${n===prefs.minutes?'dark':'outline'} small`,`data-minutes="${n}" aria-pressed="${n===prefs.minutes}"`)).join('')}</div></div><div><strong>Priority</strong><div class="button-row">${PLAN_FOCI.map(k=>action('plan-focus',k==='mistakes'?'Mistakes':k==='pronunciation'?'Written tones':k==='reading'?'Reading':'Balanced',`button ${k===prefs.focus?'dark':'outline'} small`,`data-focus="${k}" aria-pressed="${k===prefs.focus}"`)).join('')}</div></div></div></section>
 <section class="simple-panel"><div class="panel-heading"><h2>Today · ${esc(week[0].date)}</h2><span class="muted">${week[0].tasks.filter(t=>t.done).length}/${week[0].tasks.length} activity types recorded</span></div><p class="muted">This is an estimated ${prefs.minutes}-minute mix. Actual time and due-review workload may differ.</p><div class="plan-task-list">${tasks}</div></section>
 <section class="simple-panel"><h2>Last seven days · recorded activity</h2><p class="muted">This chart counts activity records, not study minutes or estimated mastery. A quiet day does not automatically mean forgotten knowledge.</p><div class="plan-rhythm" role="img" aria-label="Daily recorded learning events: ${recentStudyRhythm(state).map(d=>`${d.date}, ${d.total} activities`).join('; ')}">${recentStudyRhythm(state).map(d=>`<div><span class="plan-rhythm-bar" style="height:${Math.max(4,Math.min(100,d.total*10))}%"></span><small>${esc(d.date.slice(5))}</small><b>${d.total}</b></div>`).join('')}</div></section>
 <section class="simple-panel"><h2>Next six days</h2><p class="muted">Future days are suggested themes, not committed tasks or predicted review due counts. No notification will be sent.</p><div class="plan-week">${week.slice(1).map(d=>`<div><strong>${esc(d.date)}</strong><span>${esc(d.tasks.map(t=>t.type==='journey'?'Lesson':t.type==='fluency'?'Context':t.type==='review'?'Review':t.type==='reading'?'Reading':'Dialogue').join(' · '))}</span></div>`).join('')}</div></section>
 <section class="simple-panel"><div class="panel-heading"><h2>Your mistake collection</h2><span class="muted">${coll.unresolved.length} unresolved · ${coll.saved.length} manually saved</span></div><p>Incorrect or assisted responses are collected from scheduled review, Daily Journey and Fluency Studio. A later independent answer may resolve a mistake; saved items remain accessible for reference.</p><div class="button-row">${action('plan-filter','Unresolved',`button ${planMistakeFilter==='unresolved'?'dark':'outline'} small`,'data-filter="unresolved"')}${action('plan-filter','Saved',`button ${planMistakeFilter==='saved'?'dark':'outline'} small`,'data-filter="saved"')}${action('plan-filter','Corrected',`button ${planMistakeFilter==='corrected'?'dark':'outline'} small`,'data-filter="corrected"')}</div><div class="mistake-list">${(coll[planMistakeFilter]||[]).slice(0,35).map(renderMistake).join('')||'<p class="muted">No recorded items in this collection yet.</p>'}</div>${action('plan-weak-start','Practice unresolved contextual questions →','button outline')}</section>
 <section class="simple-panel"><h2>Continue in context</h2><div class="plan-material-grid"><article><p class="eyebrow">READING</p><h3>${esc(related.reading.title)}</h3><p>${related.readAttempted}/${STORIES.length} readings attempted</p>${action('plan-next-reading','Continue reading →','button outline')}</article><article><p class="eyebrow">CONVERSATION</p><h3>${esc(related.dialogue.title)}</h3><p>${related.dialoguesAttempted}/${DIALOGUES.length} dialogues attempted</p>${action('plan-next-dialogue','Continue a dialogue →','button outline')}</article></div></section>
 <section class="simple-panel"><h2>Written-tone reference</h2><p>These contours teach pinyin notation; actual speech quality cannot be assessed by typing.</p><div class="plan-tone-grid"><div><strong>1 · mā</strong><small>Level, sustained high pitch</small></div><div><strong>2 · má</strong><small>Rising contour</small></div><div><strong>3 · mǎ</strong><small>Low/dipping citation contour; changes in connected speech</small></div><div><strong>4 · mà</strong><small>Falling contour</small></div><div><strong>0 · ma</strong><small>Unstressed neutral tone</small></div></div>${action('plan-tones','Practice complete-word pinyin →','button primary')}</section>`;
}
function hubResumeStrip(){
 const sessions=activeLearningSessions(state).filter(s=>s.route!==route());if(!sessions.length)return '';
 return `<aside class="hub-resume-strip" aria-label="Saved study sessions"><div><strong>Continue your saved work</strong><span>${sessions.length} unfinished activity${sessions.length===1?'':'ies'} · answers are saved separately from recall mastery</span></div><div class="hub-resume-buttons">${sessions.slice(0,3).map(x=>action('hub-resume',`${esc(x.label)} →`,'button outline small',`data-kind="${x.kind}"`)).join('')}${sessions.length>3?`<span class="muted">+${sessions.length-3} more on Today</span>`:''}</div></aside>`;
}
/* Per-route related navigation now comes from ui-c9.mjs. */
function compactHubPanel(){const hub=learningHub(state);return `<section class="simple-panel hub-compact"><div class="panel-heading"><div><p class="eyebrow">ONE CONNECTED LEARNING PATH</p><h2>Continue with a clear next step</h2></div><span class="muted">${hub.due} due · ${hub.unresolved} unresolved</span></div><div class="hub-primary-row"><div><strong>${esc(hub.primary.label)}</strong><p>${esc(hub.primary.detail)}</p></div>${action('hub-primary','Continue →','button primary')}</div><div class="button-row">${action('hub-go','Study Plan','button outline small','data-route="plan"')}${action('hub-go','Scheduled Review','button outline small','data-route="review"')}${action('hub-go','Context Practice','button outline small','data-route="fluency"')}</div></section>`;}
function hubLearningCard(task){const verbs={review:'Review',journey:'Learn',fluency:'Practice',reading:'Read',dialogue:'Understand'};return `<article class="hub-task ${task.done?'recorded':''}"><span class="hub-task-mark" aria-hidden="true">${task.done?'✓':String(task.index+1).padStart(2,'0')}</span><div><span class="eyebrow">${esc(verbs[task.kind]||'Study')} · ${task.minutes} min suggestion</span><h3>${esc(task.label)}</h3><p>${esc(task.reason)}</p><small>${task.done?'Activity recorded today':'No activity yet today'} · does not imply mastery</small></div>${action('hub-task',task.done?'Repeat →':'Begin →','button outline small',`data-kind="${task.kind}"`)}</article>`;}
function hubHomePanel(){const hub=learningHub(state),path=hub.nextLesson;return `<section class="hub-start simple-panel" aria-label="Connected learning home"><div class="hub-home-heading"><div><p class="eyebrow">TODAY · YOUR NEXT STEP</p><h2>${esc(hub.primary.label)}</h2><p>${esc(hub.primary.detail)}</p></div><div class="hub-home-buttons">${action('hub-primary','Continue learning →','button primary')}${action('hub-go','See full study plan','button outline', 'data-route="plan"')}</div></div><div class="hub-home-metrics"><span><b>${hub.due}</b> due recall</span><span><b>${hub.unresolved}</b> unresolved observations</span><span><b>${hub.introduced}/${hub.total}</b> demo lessons introduced</span></div></section>
 <section class="simple-panel hub-workflow"><div class="panel-heading"><div><p class="eyebrow">YOUR ROUTINE</p><h2>Four connected activities</h2></div><span class="muted">Suggested ${hub.preferences.minutes} min · ${esc(hub.preferences.focus)} priority</span></div><div class="hub-tasks">${hub.cards.map(hubLearningCard).join('')}</div><p class="muted">The planner estimates workload, not future review counts. Recorded activity is different from independent recall or mastery.</p></section>
 ${hub.sessions.length?`<section class="simple-panel"><div class="panel-heading"><h2>Unfinished work</h2><span class="muted">Resume an existing checkpoint instead of restarting</span></div><div class="hub-sessions">${hub.sessions.map(x=>`<div><div><strong>${esc(x.label)}</strong><p>${esc(x.detail)}</p></div>${action('hub-resume','Resume →','button outline small',`data-kind="${x.kind}"`)}</div>`).join('')}</div></section>`:''}
 <section class="simple-panel hub-next"><div class="panel-heading"><h2>Continue in real context</h2><span class="muted">Original demonstration materials</span></div><div class="hub-next-grid"><div><span class="eyebrow">NEXT LESSON</span><h3 lang="zh-Hans">${path?esc(path.hanzi):'复习'}</h3><p>${path?`Lesson ${path.order} · ${esc(path.meaning)}`:`All ${DEMO_LESSONS.length} original lessons introduced`}</p>${path?action('hub-lesson','Open lesson →','button outline small',`data-id="${path.id}"`):action('hub-go','Review →','button outline small','data-route="review"')}</div><div><span class="eyebrow">READING</span><h3>${esc(hub.connected.reading.title)}</h3><p>${hub.connected.readAttempted}/${STORIES.length} readings attempted</p>${action('plan-next-reading','Read in context →','button outline small')}</div><div><span class="eyebrow">CONVERSATION</span><h3>${esc(hub.connected.dialogue.title)}</h3><p>${hub.connected.dialoguesAttempted}/${DIALOGUES.length} dialogues attempted</p>${action('plan-next-dialogue','Practice dialogue →','button outline small')}</div></div></section>
 ${hub.recentMistakes.length?`<section class="simple-panel hub-mistakes"><div class="panel-heading"><h2>Repair observed mistakes</h2><span class="muted">Independent later success can resolve a mistake</span></div>${hub.recentMistakes.map(m=>`<div class="hub-mistake"><div><strong>${esc(m.label)}</strong><small>${esc(m.reason)}</small></div>${action('plan-source','Open teaching →','button outline small',`data-id="${esc(m.id)}"`)}</div>`).join('')}<div class="button-row">${action('plan-mistakes','See your full collection →','button outline small')}${action('plan-weak-start','Practice weakest contexts →','button outline small')}</div></section>`:''}`;}
function finishOverviewPanel({compact=false}={}){
 const o=courseOverview(state);const actions=courseShortcuts(state);return `<section class="simple-panel finish-overview" aria-label="Learning evidence and continuity"><div class="panel-heading"><div><p class="eyebrow">LEARNING CONTINUITY</p><h2>From today's work to your next step</h2></div><span class="muted">Evidence, not a mastery estimate</span></div><div class="finish-evidence"><div><strong>${o.introduced}/${o.total}</strong><span>Lessons introduced</span></div><div><strong>${o.scheduled.attempts}</strong><span>Scheduled attempts</span></div><div><strong>${o.supplementary}</strong><span>Other learning observations</span></div><div><strong>${o.sessions.length}</strong><span>Unfinished sessions</span></div></div>${compact?'':`<div class="finish-shortcuts">${actions.map(a=>`<div><div><strong>${esc(a.label)}</strong><small>${esc(a.description)}</small></div>${action('finish-next','Open →','button outline small',`data-kind="${a.kind}" data-route="${a.route}" ${a.source?`data-source="${a.source}"`:''} ${a.lessonId?`data-lesson="${a.lessonId}"`:''}`)}</div>`).join('')}</div>`}<p class="muted">Scheduled recall is credited only by independent graded review. Supplemental practice, assistance and activity volume are different observations.</p></section>`;
}
function recoveryCenterPanel(){const o=courseOverview(state);return `<section class="simple-panel finish-recovery" aria-label="Session recovery center"><div class="panel-heading"><h2>Saved study sessions</h2><span class="muted">${o.sessions.length} unfinished</span></div>${o.sessions.length?`<div class="finish-shortcuts">${o.sessions.map(item=>`<div><div><strong>${esc(item.label)}</strong><small>${esc(item.detail)}</small></div>${action('hub-resume','Resume →','button outline small',`data-kind="${esc(item.kind)}"`)}</div>`).join('')}</div>`:'<p>No paused study activities. Your completed answers and practice histories remain stored separately.</p>'}<p class="muted">Checkpoints save submitted answers. Unsubmitted text may not survive leaving a screen. Restoring a backup replaces these checkpoints.</p></section>`;}
function backupPreviewPanel(){if(!pendingRestore)return '';const p=pendingRestore.preview;return `<section class="simple-panel finish-backup-preview" aria-label="Backup import preview" role="region"><p class="eyebrow">VALIDATED BACKUP · NOT YET RESTORED</p><h2>Review before replacing your data</h2><p>Backup created: ${p.createdAt?esc(p.createdAt):'Date not provided'} · Version ${p.formatVersion}. This is a <strong>replacement</strong>, not a merge.</p><div class="finish-compare"><div><strong>Current device</strong><p>${p.current.learned} introduced lessons</p><p>${p.current.scheduledEvents} scheduled attempts</p><p>${p.current.supplementaryEvents} other learning observations</p><p>${p.current.sessions.length} unfinished sessions</p><p>${p.current.wordbook} wordbook entries</p></div><div><strong>Incoming backup</strong><p>${p.incoming.learned} introduced lessons</p><p>${p.incoming.scheduledEvents} scheduled attempts</p><p>${p.incoming.supplementaryEvents} other learning observations</p><p>${p.incoming.sessions.length} unfinished sessions</p><p>${p.incoming.wordbook} wordbook entries</p></div></div>${p.warnings.length?`<div class="finish-warning" role="note"><strong>Potential data loss</strong><ul>${p.warnings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:'<p class="muted">No reductions were detected in these summary counts. Records can still differ: replacement overwrites your current history.</p>'}<p class="muted">Export the current state before restoring if you might want it later. Import validation cannot independently prove the backup's origin.</p><div class="setting-row"><label for="restore-ack"><strong>Type REPLACE to confirm</strong><p>This irreversibly overwrites this browser's current learner history.</p></label><input id="restore-ack" type="text" autocomplete="off" spellcheck="false" aria-describedby="restore-ack-status" value="${esc(restoreAcknowledgement)}"></div><p class="muted" id="restore-ack-status">The backup has been checked but has not changed local data.</p><div class="button-row">${action('restore-confirm','Replace local learner data','button danger',restoreRequiresAcknowledgement(p,restoreAcknowledgement)?'':'disabled')}${action('restore-cancel','Cancel import','button outline')}${action('export','Export current data first','button outline')}</div></section>`;}
function vocabularyTodayPanel(){
 const introduced=(state.vocabularyIntroduced||[]).map(findWord).filter(Boolean);
 const selected=state.vocabularyJourney?.key?findWord(state.vocabularyJourney.key):introduced.at(-1);
 return `<section class="simple-panel p23-today-vocabulary"><div class="panel-heading"><div><p class="eyebrow">VOCABULARY IN CONTEXT</p><h2>${state.vocabularyJourney?'Resume your word journey':'Learn a complete Chinese word'}</h2></div><span class="muted">${introduced.length} independently introduced words</span></div><p>${selected?`Continue with ${esc(selected.hanzi)} (${esc(selected.pinyin)}): ${esc(selected.senses[0])}.`:'Discover a complete word, explore its examples, then practice meaning, contextual usage, pronunciation, written recall and listening.'}</p><div class="button-row">${selected?(state.vocabularyJourney?action('vocabulary-resume','Resume saved word journey →','button primary'):action('vocabulary-start','Continue word study →','button primary',`data-id="${esc(selected.key)}"`)):action('vocabulary-discover','Browse original vocabulary →','button primary')}${action('open-wordbook-practice','Vocabulary studio →','button outline')}</div></section>`;
}
function selectedGrammarId(){const id=(location.hash.match(/^#\/grammar\/(g\d{2})/)||[])[1];return findGrammarLesson(id)?id:grammarSelected;}
function renderGrammar(){
 const selected=selectedGrammarId();
 const native=renderGrammarScreen({lessonId:selected,chapter:grammarChapter,query:grammarQuery,mode:grammarMode,typed:grammarTyped,feedback:grammarFeedback,assisted:grammarAssisted,order:grammarOrder,showEnglish:grammarShowEnglish,sentenceEvents:state.sentenceEvents||[]},action,esc,title,gated);
 return '<div class="c9-language-workspace c9-language-workspace--grammar">'+
  renderC9GrammarDirectory(state,action,esc)+
  '<section class="c9-language-native c9-language-study" id="c9-native-grammar" aria-label="Original grammar lessons">'+native+'</section></div>';
}
function grammarSessionReset(){grammarMode='meaning';grammarTyped='';grammarFeedback=null;grammarAssisted=false;grammarOrder=[];}
function openGrammarLesson(id){
 const selected=findGrammarLesson(id);if(!selected)return false;
 // Reopening the same selected grammar unit must not erase a typed answer.
 if(route()==='grammar'&&selectedGrammarId()===id){
  root.querySelector('#c9-native-grammar')?.scrollIntoView({block:'start'});
  return true;
 }
 if(route()==='grammar'&&!c9ConfirmLeaveNativeAnswer('grammar'))return false;
 if(route()!=='grammar'&&!go('grammar'))return false;
 grammarSelected=id;grammarChapter=String(selected.chapterNumber);
 grammarQuery='';grammarSessionReset();
 location.hash='#/grammar/'+id;
 render();
 return true;
}
function grammarUnitSelector(character){
 const related=GRAMMAR_LESSONS.filter(g=>g.anchor===character).slice(0,3);
 return related.length?'<div class="p25-related-lesson"><p class="eyebrow">PRACTICAL GRAMMAR TO LEARN NEXT</p>'+
 related.map(g=>action('grammar-select',esc(g.title)+' →','button outline small',`data-id="${g.id}"`)).join('')+'</div>':'';
}
function grammarTodayPanel(){
 const recently=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('grammar:')).at(-1);
 const mostRecent=recently&&findGrammarLesson(recently.taskId.split(':')[1]);
 const lesson=mostRecent||GRAMMAR_LESSONS[0];
 const count=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('grammar:')).length;
 return `<section class="simple-panel p25-today"><div class="panel-heading"><div><p class="eyebrow">STRUCTURED GRAMMAR COURSE</p><h2>Understand Mandarin sentence patterns</h2></div><span class="muted">${GRAMMAR_LESSONS.length} full lessons · ${count} practice answers</span></div>
 <p>Learn when to use 是, 的, 不, 没, 了, measure words, questions, location phrases and more. Continue with <strong>${esc(lesson.title)}</strong>.</p>
 <div class="button-row">${action('grammar-select','Continue grammar study →','button primary',`data-id="${lesson.id}"`)}${action('grammar-open','Browse all grammar lessons','button outline')}</div></section>`;
}
function selectedLibraryId(){
 const id=(location.hash.match(/^#\/sentences\/(sent-\d{3})/)||[])[1];
 return findLibrarySentence(id)?id:librarySelected;
}
function sentenceUiReset(){libraryMode='meaning';libraryTyped='';libraryOrder=[];libraryFeedback=null;libraryAssisted=false;}
function openLibrarySentence(id){
 if(!findLibrarySentence(id))return false;
 if(route()==='sentences'&&selectedLibraryId()===id){
  root.querySelector('#c9-native-sentences')?.scrollIntoView({block:'start'});
  return true;
 }
 if(route()==='sentences'&&!c9ConfirmLeaveNativeAnswer('sentences'))return false;
 if(route()!=='sentences'&&!go('sentences'))return false;
 librarySelected=id;sentenceUiReset();
 location.hash='#/sentences/'+id;render();return true;
}
function renderSentences(){
 const native=renderSentenceScreen({selected:selectedLibraryId(),query:libraryQuery,topic:libraryTopic,
 area:libraryArea,difficulty:libraryDifficulty,grammar:libraryGrammar,purpose:libraryPurpose,tone:libraryTone,source:librarySource,savedOnly:librarySavedOnly,page:libraryPage,
 mode:libraryMode,typed:libraryTyped,order:libraryOrder,feedback:libraryFeedback,
 assisted:libraryAssisted,showPinyin:libraryShowPinyin,showEnglish:libraryShowEnglish,focus:libraryPracticeFocus,
 learner:state},action,esc,title,gated);
 return '<div class="c9-language-workspace c9-language-workspace--sentences">'+
  renderC9SentenceDirectory(state,action,esc)+
  '<section class="c9-language-native c9-language-study" id="c9-native-sentences" aria-label="Original sentence learning">'+native+'</section></div>';
}
function pathwaySelection(){const id=location.hash.split('/')[2];return findPathwayMission(id)?id:pathwaySelected;}
function pathwayReset(){pathwayMode='meaning';pathwayFocus=false;pathwayAssisted=false;pathwayTyped='';pathwayFeedback=null;pathwayTransferDraft='';}
function openPathwayMission(id){
 const m=findPathwayMission(id);if(!m)return false;
 if(route()==='pathway'&&pathwaySelection()===id)return true;
 if(route()==='pathway'&&!c9ConfirmLeaveNativeAnswer('pathway'))return false;
 if(route()!=='pathway'&&!go('pathway'))return false;
 pathwaySelected=m.id;pathwayReset();location.hash='#/pathway/'+id;render();return true;
}
function renderPathway(){
 if(!/^#\/pathway\/path-\d{2}$/.test(location.hash))return renderC9PathwayHub(state,action,esc);
 const m=findPathwayMission(pathwaySelection())||PATHWAY_MISSIONS[0];
 return '<nav class="c9-pathway-mission-back" aria-label="Pathway navigation"><a href="#/pathway">← All nine original study bands</a><span class="c9-meta">Band '+m.band+' · Original mission</span></nav>'+
  renderPathwayScreen({id:m.id,band:m.band,minutes:pathwayMinutes,mode:pathwayMode,focus:pathwayFocus,assisted:pathwayAssisted,typed:pathwayTyped,feedback:pathwayFeedback,transferDraft:pathwayTransferDraft,showPinyin:pathwayShowPinyin,showEnglish:pathwayShowEnglish,learner:state},action,esc,title,gated);
}
function beginnerReadingTodayPanel(){
 const metrics=beginnerReadingStats(state),last=(state.readingEvents||[]).filter(e=>findStory(e.storyId)?.beginner).at(-1);
 const story=(last&&findStory(last.storyId))||nextBeginnerStory(null,state,beginnerLevel)||BEGINNER_STORIES[0];
 return `<section class="simple-panel p28-today"><div class="panel-heading"><div><p class="eyebrow">BEGINNER MANDARIN READING</p><h2>Read a complete Chinese scene</h2></div><span class="muted">${BEGINNER_STORIES.length} new graded readings · ${metrics.attempted} attempted · ${metrics.written} writing attempts</span></div>
 <p>Move from isolated characters and sentence practice into six connected sentences. Read for meaning, explore one important expression, and answer from the actual passage.</p>
 <div class="p28-today-feature"><div><strong>${esc(story.title)}</strong><p>${esc(story.theme)} · ${esc(story.beginner.grade)}</p></div>
 <div class="button-row">${action('reading-open-beginner','Continue beginner reading →','button primary',`data-id="${story.id}"`)}
 ${action('reading-open-long','Move to longer reading →','button outline')}</div></div></section>`;
}
function connectedReadingTodayPanel(){
 const extended=STORIES.filter(s=>s.extended);
 const recent=(state.readingEvents||[]).filter(e=>findStory(e.storyId)?.extended).at(-1);
 const item=(recent&&findStory(recent.storyId))||extended[0];
 const writing=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('reading:')).length;
 return item?`<section class="simple-panel p27-reading-today"><div class="panel-heading"><div><p class="eyebrow">CONNECTED READING · ORIGINAL PASSAGES</p><h2>Read beyond individual sentences</h2></div><span class="muted">${extended.length} new multi-paragraph readings · ${writing} writing attempts</span></div>
 <p>Follow a complete event or practical document, then explain what happened, why it happened and what the text actually says.</p>
 <div class="p27-today-feature"><div><strong>${esc(item.title)}</strong><span>${esc(item.theme)} · ${item.lines.length} connected Chinese sentences</span></div>
 <div class="button-row">${action('reading-open-long','Open this reading →','button primary',`data-id="${item.id}"`)}${action('open-stories','All readings →','button outline')}</div></div></section>`:'';
}
function sentenceTodayPanel(){
 const saved=(state.bookmarkedSentences||[]).length;
 const last=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('context:')).at(-1);
 const recent=last&&findLibrarySentence(last.taskId.split(':')[1]);
 const selected=recent||findLibrarySentence((state.bookmarkedSentences||[]).at(-1))||SENTENCE_LIBRARY[0];
 const done=(state.sentenceEvents||[]).filter(e=>e.taskId.startsWith('context:')).length;
 return `<section class="simple-panel p26-today"><div class="panel-heading"><div><p class="eyebrow">SENTENCES IN REAL CONTEXT</p><h2>Read, rebuild and use Mandarin</h2></div><span class="muted">${SENTENCE_LIBRARY.length} authored sentences · ${saved} saved</span></div>
 <p>${done} contextual practice attempts so far. Continue with <span lang="zh-Hans">${esc(selected.hanzi)}</span>, or browse ${SENTENCE_TOPICS.length} situations with linked grammar and vocabulary.</p>
 <div class="button-row">${action('sentence-select','Continue sentence study →','button primary',`data-id="${selected.id}"`)}${action('sentence-open','Browse the sentence library →','button outline')}</div></section>`;
}
function pinyinTodayPanel(){
 return `<section class="simple-panel p24-today"><div class="panel-heading"><div><p class="eyebrow">PRONUNCIATION FOUNDATIONS</p><h2>Learn the sounds behind Pinyin</h2></div><span class="muted">${PINYIN_INITIALS.length} initials · ${PINYIN_FINALS.length} finals</span></div>
 <p>Explore tongue positions, vowels, lexical tones, tone sandhi and the spelling rules behind Mandarin words.</p><div class="button-row">${action('pinyin-open','Open sound foundations →','button primary')}${action('pinyin-tab','Practice tones →','button outline small',`data-section="practice" data-filter="tones"`)}</div></section>`;
}
function renderToday(){
 // The actual learning next steps, unit progress and contextual source entries
 // are now visible in Home. Legacy supplementary teaching remains accessible
 // without duplicating the primary P31–P34 course catalogs shown on Learn.
 return renderC9Home(state,action,esc,{storageReady:Boolean(db),offline:navigator.onLine===false,
   offlineShell:c9OfflineShell,showPinyin:state.settings.showPinyin})+
  '<section class="c9-skills-home-cta" aria-label="Continue language skills"><div>'+
  '<strong>Connect characters, reading, dialogue and writing</strong>'+
  '<p>Choose one learning skill, continue with source-backed material, and return to the original native practice.</p></div>'+
  '<a href="#/skills">Open Skill Paths →</a></section>'+
  renderC9LearningContinuity(state,action,esc)+onboardingPanel()+
  '<details class="c9-home-extra"><summary><strong>Additional teaching and study diagnostics</strong><span>Original guided panels, phonetics, contextual practice and evidence</span></summary>'+
  '<div class="c9-home-extra-inner" data-c9-lazy-home="pending"></div></details>';
}
function lessonCard(l){const learned=state.learned.includes(l.id);return `<button type="button" data-action="open-lesson" data-id="${l.id}" class="lesson-row ${displayLessonId===l.id?'selected':''} ${l.order>74?'foundation-expanded':''}"><span class="lesson-number">${String(l.order).padStart(2,'0')}</span><span class="lesson-char" lang="zh-Hans">${esc(l.hanzi)}</span><span class="lesson-label"><strong>${esc(l.pinyin)}</strong><small>${esc(l.meaning)}</small></span><span class="lesson-check ${learned?'learned':''}" aria-label="${learned?'Studied':'Not yet studied'}">${learned?'✓':'→'}</span></button>`}

function lessonQuiz(l){if(lessonCheckpoint.lessonId!==l.id)lessonCheckpoint={lessonId:l.id,step:0,response:'',feedback:null};
 const modes=['recognition','word-meaning','word-pinyin'];if(lessonCheckpoint.step>=modes.length)return `<section class="lesson-checkpoint"><p class="eyebrow">INSTANT PRACTICE · COMPLETE</p><h3>Three guided checks finished</h3><p>These were teaching exercises. They did not add independent review credit.</p>${action('lesson-check-restart','Try again','button outline small')}</section>`;
 const d=buildDrill(l.id,modes[lessonCheckpoint.step]);return `<section class="lesson-checkpoint"><p class="eyebrow">RECALL IN CONTEXT · ${lessonCheckpoint.step+1} / 3</p><h3>Check your understanding</h3><p>${esc(d.prompt)}</p>${d.hanzi?`<p lang="zh-Hans" class="checkpoint-hanzi">${esc(d.hanzi)}</p>`:''}
 ${lessonCheckpoint.feedback?`<div class="reader-feedback ${lessonCheckpoint.feedback.correct?'correct':'incorrect'}" role="status"><strong>${lessonCheckpoint.feedback.correct?'Correct':'Review this connection'}</strong><p>${esc(lessonCheckpoint.feedback.message)}</p><p>${esc(d.explanation)}</p></div>${action('lesson-check-next',lessonCheckpoint.step===2?'Finish quick check →':'Next question →','button primary')}`:
 d.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose your answer">${d.options.map((opt,i)=>action('lesson-check-choice',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div>`:
 `<div class="answer-entry"><label for="lesson-check-entry">Type pinyin with the tones</label><input id="lesson-check-entry" type="text" value="${esc(lessonCheckpoint.response)}" autocomplete="off" autocapitalize="off" spellcheck="false"></div>${action('lesson-check-submit','Check pronunciation','button primary',lessonCheckpoint.response.trim()?'':'disabled')}`}
 <p class="muted">Formative practice only. Scheduled review begins after introducing the lesson.</p></section>`;
}

function sentenceLinksForCharacter(hanzi){
 const rows=SENTENCE_LIBRARY.filter(s=>s.hanzi.includes(hanzi)).slice(0,4);
 return rows.length?`<section class="p26-character-links"><p class="eyebrow">YOUR CHARACTER IN REAL SENTENCES</p><div>${rows.map(row=>action('sentence-select',`<span lang="zh-Hans">${esc(row.hanzi)}</span><small>${esc(row.english)}</small>`,'p26-mini-sentence',`data-id="${row.id}"`)).join('')}</div>${action('sentence-open','See the sentence library →','button outline small')}</section>`:'';
}
function lessonDetails(l){if(!l)return '<p>Lesson unavailable.</p>';const learned=state.learned.includes(l.id);return `<article class="lesson-paper c9-lesson-paper"><div class="lesson-heading"><span class="eyebrow">LESSON ${String(l.order).padStart(2,'0')} OF ${DEMO_LESSONS.length} · ORIGINAL DEMO</span><span class="status-tag ${learned?'complete':''}">${learned?'Introduced':'New'}</span></div>
  <section id="c9-lesson-overview" class="c9-native-section" tabindex="-1" aria-label="Character and pronunciation"><div class="character-focus"><div class="big-hanzi" lang="zh-Hans">${esc(l.hanzi)}</div><div class="character-meta"><div class="reading-row"><span class="reading">${state.settings.showPinyin?esc(l.pinyin):"Pinyin hidden"}</span>${action('speak','<span aria-hidden="true">▶</span> Listen','button mini outline',`data-text="${esc(l.hanzi)}"`)}</div><h2>${esc(l.meaning)}</h2><p>${esc(l.note)}</p><p class="subnote">Pinyin is shown during teaching and hidden during unassisted review.</p><p class="subnote">${esc(toneContrast(l.pinyin)||'Tone analysis unavailable')}</p>${toneTeachingPanel(l.pinyin)}</div></div></section><section id="c9-lesson-grammar" class="c9-native-section" tabindex="-1" aria-label="Grammar and character insights">
  <div class="lesson-guide"><span class="eyebrow">CHARACTER INSIGHT · ORIGINAL TEACHING NOTE</span><h3>${esc(guideFor(l).topic)}</h3><p>${esc(guideFor(l).explanation)}</p><p class="muted">${esc(guideFor(l).comparison)}</p></div>${companionPanel(l,{compact:true})}${p31LessonTeaching(l,action,esc)}${grammarUnitSelector(l.hanzi)}${sentenceLinksForCharacter(l.hanzi)}</section><section id="c9-lesson-vocabulary" class="c9-native-section" tabindex="-1" aria-label="Vocabulary and pronunciation"><div class="lesson-rule"></div><div class="learning-section-heading"><div><p class="eyebrow">HOW IT APPEARS IN WORDS</p><h3>Learn it in context</h3></div><span class="section-index">01 / 02</span></div>
  <div class="word-grid">${l.words.map((w,i)=>`<div class="word-card"><span class="word-index">0${i+1}</span><div lang="zh-Hans" class="word-hanzi">${esc(w.hanzi)}</div><div class="word-pinyin">${state.settings.showPinyin?esc(w.pinyin):"Pinyin hidden"}</div><strong>${esc(w.english)}</strong>${action('lookup-word','Word details ↗','text-button',`data-word="${esc(w.hanzi)}"`)}${action('vocabulary-start','Learn this word →','text-button',`data-id="${esc(canonicalWordKey(w.hanzi,w.pinyin))}"`)}${action('speak','Listen ↗','text-button',`data-text="${esc(w.hanzi)}"`)}</div>`).join('')}</div></section><section id="c9-lesson-context" class="c9-native-section" tabindex="-1" aria-label="Sentences, reading and communication">
  ${lessonConnections(l.id)?.readings.length?`<section class="lesson-context-links"><p class="eyebrow">YOUR CHARACTER IN A REAL CONTEXT</p><h3>See it in connected reading</h3><div class="context-link-grid">${lessonConnections(l.id).readings.map(item=>`<button type="button" class="context-link" data-action="open-story-link" data-id="${item.id}"><strong>${esc(item.title)}</strong><small lang="zh-Hans">${esc(item.word)} · in the story</small><span aria-hidden="true">↗</span></button>`).join('')}</div></section>`:''}
  ${(()=>{const links=contentConnections(l.id);return links.dialogues.length?`<section class="lesson-context-links"><p class="eyebrow">THE SAME WORDS IN CONVERSATION</p><h3>Hear the meaning in context</h3><div class="context-link-grid">${links.dialogues.map(d=>`<button type="button" class="context-link" data-action="hub-dialogue" data-id="${esc(d.id)}"><strong>${esc(d.title)}</strong><small lang="zh-Hans">${esc(d.matches.join(' · '))}</small><span aria-hidden="true">↗</span></button>`).join('')}</div></section>`:''})()}
  <div class="learning-section-heading sentence-title"><div><p class="eyebrow">READ A SENTENCE</p><h3>Put it together</h3></div><span class="section-index">02 / 02</span></div>
  <div class="sentence-block"><p lang="zh-Hans" class="sentence-hanzi">${esc(l.sentence.hanzi)}</p>${showLessonTranslation?`<p class="sentence-pinyin">${esc(l.sentence.pinyin)}</p><p class="sentence-english">${esc(l.sentence.english)}</p>`:'<p class="helper-text">Pinyin and translation are hidden.</p>'}<div class="button-row">${action('toggle-translation',showLessonTranslation?'Hide translation':'Show pinyin & translation','button outline small')}${action('speak','▶ Listen to sentence','button outline small',`data-text="${esc(l.sentence.hanzi)}"`)}${action('speech-rate','Playback speed: '+demoSpeechRate+'×','button outline small')}</div></div>
   ${l.extraSentence?`<div class="p22-extra-sentence" aria-label="More Chinese in context"><div><p class="eyebrow">SECOND EXAMPLE · CONNECTED LANGUAGE</p><strong lang="zh-Hans">${esc(l.extraSentence.hanzi)}</strong></div>${showLessonTranslation?`<p class="p22-reading">${esc(l.extraSentence.pinyin)}</p><p>${esc(l.extraSentence.english)}</p>`:'<p class="muted">Read it independently, or show the translations above.</p>'}${action('speak','Listen to this example','button outline small',`data-text="${esc(l.extraSentence.hanzi)}"`)}</div>`:''}
   </section><section id="c9-lesson-practice" class="c9-native-section" tabindex="-1" aria-label="Formative practice and feedback">${lessonQuiz(l)}
   ${bridgeTeachingPanel(l.id)}</section><section id="c9-lesson-finish" class="c9-native-section" tabindex="-1" aria-label="Lesson introduction and next actions">
   <div class="lesson-footer"><div><strong>${learned?'Ready to practice':'Ready to remember?'}</strong><p>${learned?'Your ${cardsForLesson(l.id).length} recall targets are in Review.':'Introducing this lesson creates ${cardsForLesson(l.id).length} character, word, pronunciation and sentence targets.'}</p></div><div class="button-row">${!learned?action('mark-studied','Introduce lesson & create reviews →','button primary',`data-id="${l.id}"`):action('start-review','Practice recall →','button primary')}${action('next-lesson','Next →','button outline')}${action('practice-lesson','Quick practice','button outline',`data-id="${l.id}"`)}${action('course-lesson','Daily Journey','button outline',`data-id="${l.id}"`)}</div></div></section></article>`}
function foundationalExpansionPanel(){
 const units=lessonGroups().filter(unit=>unit.range[0]>74);
 return `<section class="simple-panel p22-foundation-panel" aria-label="Expanded foundations and new characters">
 <div class="panel-heading"><div><p class="eyebrow">P22 · EXPANDED MANDARIN FOUNDATIONS</p><h2>70 additional characters, in real context</h2></div><span class="muted">Three words and two example sentences per new character</span></div>
 <p>Extend your Mandarin with pronouns, everyday grammar, numbers, directions, food, weather and conversation. Each new lesson has a dedicated grammar companion and expanded recall targets.</p>
 <div class="p22-unit-grid">${units.map(unit=>{const introduced=unit.lessons.filter(lesson=>state.learned.includes(lesson.id)).length;const next=unit.lessons.find(lesson=>!state.learned.includes(lesson.id))||unit.lessons[0];return `<button type="button" class="p22-unit" data-action="foundation-unit" data-id="${esc(next.id)}"><span class="p22-unit-number">${String(unit.index).padStart(2,'0')}</span><strong>${esc(unit.name)}</strong><small>${introduced}/${unit.lessons.length} introduced · Continue with ${esc(next.hanzi)} (${esc(next.pinyin)})</small><span class="p22-unit-go">Explore →</span></button>`}).join('')}</div>
 </section>`;
}
function renderLearnLegacy(){const l=findLesson(displayLessonId)||DEMO_LESSONS[0];const m=summary(state);return `${title('THE LEARNING PATH','Learn characters in words.','${DEMO_LESSONS.length} original demonstration lessons, organized into ${lessonGroups().length} thematic study units.')}${gated()}${learnWorkspace(state,action,esc,{index:p30CoachIndex,category:p30CoachCategory})}${p31LessonShelf(state,action,esc,{theme:p31Theme,status:p31Status,page:p31Page})}<details class="p30-learn-utilities"><summary>Quick learning utilities and course continuity</summary>${compactHubPanel()}${finishOverviewPanel({compact:true})}</details><div class="button-row course-learn-action">${action('course-lesson','Guided Daily Journey →','button primary',`data-id="${l.id}"`)}${action('ladder-open','Practice sentence construction →','button outline',`data-id="${l.id}"`)}${action('pinyin-open','Sound foundations →','button outline')}${action('grammar-open','Grammar course →','button outline')}${action('sentence-open','Sentence library →','button outline')}${action('pathway-open','Learning pathway →','button primary')}${action('reading-open-beginner','Beginner readings →','button outline')}${action('reading-open-long','Extended readings →','button outline')}</div>${foundationalExpansionPanel()}<div class="learn-head"><div><strong>${m.learned} of ${m.total}</strong> lessons introduced</div><div class="progress-rail"><span style="width:${100*m.learned/m.total}%"></span></div></div><div class="learn-layout"><div class="lesson-list" role="group" aria-label="Demo lessons">${lessonGroups().map(g=>`<div class="lesson-group-label"><strong>${g.index.toString().padStart(2,'0')} · ${g.name}</strong><span>${g.lessons.filter(l=>state.learned.includes(l.id)).length}/${g.lessons.length}</span></div>${g.lessons.map(lessonCard).join('')}`).join('')}</div>${lessonDetails(l)}</div>${companionLibraryPanel(l.id)}`}
function c9LearnUi(){return {query:c9LearnQuery,unit:c9LearnUnit,status:c9LearnStatus,kind:c9LearnKind,saved:c9LearnSaved,page:c9LearnPage,view:c9LearnDetail?'lesson':'catalog',selectedId:displayLessonId};}
function refreshC9DiscoveryResults(){
 const ui=c9LearnUi(),browser=$('c9-lesson-browser'),search=$('c9-learn-search-results');
 if(browser)browser.innerHTML=renderC9LessonBrowser(state,ui,action,esc);
 if(search)search.innerHTML=renderC9SearchResults(state,ui,action,esc);
}
function renderLearn(){
 if(!c9LearnDetail){
  const curriculum='<details class="c9-original-curriculum-disclosure"><summary><span><strong>Original P31–P34 learning modules</strong><small>Character foundations, practical sentences, conversations and connected reading</small></span><span aria-hidden="true">⌄</span></summary>'+
   '<section class="c9-original-curriculum" aria-labelledby="c9-original-curriculum-title">'+
   '<header class="c9-original-curriculum-head"><div><p class="c9-eyebrow">ORIGINAL AUTHOR-SUPPLIED TEACHING</p><h2 id="c9-original-curriculum-title">Build skills beyond the character list</h2>'+
   '<p>Characters lead into real vocabulary, grammar, sentence production, listening and connected reading. These are independent original teaching modules, not official HSK certification.</p></div>'+
   '<a href="#/skills" class="c9-button c9-button--primary">Continue by learning skill →</a>'+
   '<a href="#/pathway" class="c9-button c9-button--secondary">Explore nine-band pathway</a></header>'+
   '<div class="c9-original-curriculum-grid">'+
   '<section class="c9-original-curriculum-module" aria-labelledby="c9-p31-title"><div class="c9-original-curriculum-label"><span>01 / CHARACTERS & WORDS</span><h3 id="c9-p31-title">Character foundations</h3><p>Original P31 character families, contextual teaching and practical words.</p></div>'+p31Overview(state,action,esc,true)+'</section>'+
   '<section class="c9-original-curriculum-module" aria-labelledby="c9-p32-title"><div class="c9-original-curriculum-label"><span>02 / GRAMMAR & SENTENCES</span><h3 id="c9-p32-title">Use Chinese in sentences</h3><p>Source-based grammar patterns, sentence applications and controlled practice.</p></div>'+p32LearningHub(state,action,esc)+'</section>'+
   '<section class="c9-original-curriculum-module" aria-labelledby="c9-p33-title"><div class="c9-original-curriculum-label"><span>03 / CONVERSATION</span><h3 id="c9-p33-title">Communicate in real situations</h3><p>Original everyday dialogue situations and response practice.</p></div>'+p33SceneShelf(state,null,action,esc,{compact:true})+'</section>'+
   '<section class="c9-original-curriculum-module" aria-labelledby="c9-p34-title"><div class="c9-original-curriculum-label"><span>04 / CONNECTED READING & LISTENING</span><h3 id="c9-p34-title">Understand continuous language</h3><p>Original connected passage and listening-first course materials.</p></div>'+p34Overview(state,action,esc,{compact:true})+'</section></div></section></details>';
  const extra='<details class="c9-learn-existing"><summary>Full original learning utilities and detailed character shelf</summary><div class="c9-learn-existing-content">'+renderLearnLegacy()+'</div></details>';
  return renderC9LearnHub(state,c9LearnUi(),action,esc)+renderC9InstalledSourceAtlas(state,action,esc)+curriculum+extra;
 }
 const lesson=findLesson(displayLessonId)||DEMO_LESSONS[0];
 if(c9LastLessonId!==lesson.id){c9LastLessonId=lesson.id;c9LessonSection='overview';}
 return renderC9LessonWorkspace({lesson,state,nativeMarkup:lessonDetails(lesson),section:c9LessonSection,showPinyin:state.settings.showPinyin,act:action,esc});
}
function reviewMatches(id){const info=cardInfo(id);if(!info)return false;if(reviewFocus==='weak')return true;if(reviewFocus==='pronunciation')return info.kind==='pinyin';if(reviewFocus==='meanings')return info.kind==='meaning';if(reviewFocus==='sentences')return info.kind==='choice';return true;}
function renderReview(){
 // Preserve original in-memory queue and single-writer gradeCard authority.
 // A card can become unavailable after another tab updates the IndexedDB CAS.
 if(sessionQueue?.length){
   while(sessionQueue.length && (!state.cards[sessionQueue[0]] || !dueCards(state).includes(sessionQueue[0]))){
     sessionQueue.shift();reviewInvalidated++;activeReviewId=null;typedAnswer='';chosenOption='';checkResult=null;revealed=false;
   }
 }
 activeReviewId=sessionQueue?.length?sessionQueue[0]:null;
 return renderC9Review({
  state,queue:sessionQueue,focus:reviewFocus,size:reviewSize,
  done:sessionDone,correct:sessionCorrect,skipped:sessionSkipped,paused:reviewPaused,invalidated:reviewInvalidated,
  revealed,response:typedAnswer,selected:chosenOption,result:checkResult,
  action,esc,toneTeachingPanel,reviewWorkspace
 });
}
function readerLesson(){return findLesson(readerLessonId)||DEMO_LESSONS[0];}
function characterLesson(){const match=location.hash.match(/^#\/character\/(demo-\d{2,3})$/);return findLesson(match?.[1])||findLesson(displayLessonId)||DEMO_LESSONS[0];}
function renderCharacter(){return renderC9CharacterStudy({lesson:characterLesson(),state,act:action,esc,showTranslations:c9CharacterShowTranslations,showPinyin:state.settings.showPinyin});}
function renderReaderNative(){const l=readerLesson(),cloze=makeCloze(l),mode=readerMode==='cloze'&&cloze?'cloze':'meaning';const options=mode==='cloze'?cloze.options:makeOptions(l.sentence.english,'sentence',l.id);
 return `${title('CONTEXTUAL PRACTICE','Sentence Lab','Read Chinese in context. Interpret sentences and reconstruct missing words; this extra practice does not inflate review mastery.')}
 ${gated()}<div class="reader-layout"><section class="simple-panel reader-sidebar"><div class="panel-heading"><h2>Choose a sentence</h2><span>${l.order}/${DEMO_LESSONS.length}</span></div><label class="field-label" for="reader-lesson">Demo lesson</label><select id="reader-lesson">${DEMO_LESSONS.map(item=>`<option value="${item.id}" ${item.id===l.id?'selected':''}>${item.order}. ${esc(item.hanzi)} · ${esc(item.meaning)}</option>`).join('')}</select><p class="muted">Source content is original demonstration material, not an official HSK list.</p><div class="button-row">${action('reader-next','Next sentence →','button outline small')}</div></section>
 <section class="simple-panel reader-paper"><p class="eyebrow">READING & CONTEXT · ORIGINAL DEMO</p><div class="mode-tabs" role="group" aria-label="Practice type">${action('reader-mode','Choose meaning',mode==='meaning'?'button dark small':'button outline small','data-mode="meaning"')}${action('reader-mode','Fill the blank',mode==='cloze'?'button dark small':'button outline small',`data-mode="cloze" ${cloze?'':'disabled'}`)}</div>
 <div class="reader-passage" lang="zh-Hans">${esc(mode==='cloze'?cloze.prompt:l.sentence.hanzi)}</div><p class="muted">${mode==='cloze'?'Select the missing Chinese word.':'Choose the best English meaning without pinyin.'}</p>
 <div class="choice-list" role="group" aria-label="Sentence exercise choices">${options.map((opt,i)=>`<button type="button" class="choice ${readerResult?.answer===opt?'selected':''}" data-action="reader-answer" data-option="${esc(opt)}" ${readerResult?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(opt)}</button>`).join('')}</div>
 ${readerResult?`<div class="reader-feedback ${readerResult.correct?'correct':'incorrect'}" role="status"><strong>${readerResult.correct?'Correct.':'Not quite.'}</strong><p>${mode==='cloze'?`Missing word: ${esc(cloze.answer)}.`:`Sentence meaning: ${esc(l.sentence.english)}.`}</p><p>${esc(l.sentence.pinyin)}</p></div>`:''}
 <div class="button-row">${action('reader-reveal','Show pinyin & translation','button outline small')}${action('speak','▶ Hear sentence','button outline small',`data-text="${esc(l.sentence.hanzi)}"`)}${action('start-review','Go to due reviews →','button outline small')}</div>
 ${showLessonTranslation?`<div class="reader-translation"><p>${esc(l.sentence.pinyin)}</p><strong>${esc(l.sentence.english)}</strong></div>`:''}
 </section></div>`;
}
function resetDrill(){drillResult=null;drillPicked='';drillTyped='';drillOrder=[];drillAssisted=false;}
function resetReadingNavigation(){
 storyParagraph=0;storyParagraphOnly=false;storyParagraphTranslations=[];
 beginnerPart='all';beginnerWordShown=false;beginnerPartTip='';
 storyFocusIndex=-1;
 if((!findStory(storyId)?.extended&&DEEP_READING_MODES.some(([id])=>id===storyMode))||(!findStory(storyId)?.beginner&&BEGINNER_MODES.some(([id])=>id===storyMode)))storyMode='comprehension';
 resetStoryExercise();
}
function resetStoryExercise(){storyResult=null;storyAssist=false;storyShowTranslation=false;c9StoryPinyin=false;c9StoryEnglish=false;storyHelpIndex=-1;storyGlossary=null;storySequence=[];storyTyped='';}
function renderStoriesNative(){const story=findStory(storyId)||STORIES[0],isExtendedMode=DEEP_READING_MODES.some(([mode])=>mode===storyMode),isBeginnerMode=BEGINNER_MODES.some(([mode])=>mode===storyMode),exercise=isBeginnerMode?beginnerQuestion(story,storyMode):isExtendedMode?deepReadingQuestion(story,storyMode):CONTEXT_MODES.includes(storyMode)?contextQuestion(story.id,storyMode):storyExercise(story,storyMode),reading=storySummary(state);const ordering=storyMode==='ordering',coverage=introducedCharacterCoverage(story,state.learned);
 const selected=new Set(storySequence);const shuffled=ordering?shuffledChunkIndices(exercise.chunks,story.id):[];
 const linkedTokens=story.lines.flatMap(line=>tokenizeSentence(line.hanzi)).filter(t=>t.entry);const introducedTokens=linkedTokens.filter(t=>t.entry.lessonIds.some(id=>state.learned.includes(id))).length;
 return `${gated()}<details class="p34-catalog"><summary>Open P34 Reading & Listening · 25 pairs</summary>${p34Overview(state,action,esc)}</details>${story.beginner?.source==='original-p34'?`<div class="p34-read-bridge"><strong>P34 · Paired listening</strong>${action('p34-open-listening','Listen to the separate spoken situation →','button primary small',`data-id="${P34_LISTENING.find(x=>x.readingTitle===story.title)?.id||''}"`)}</div>`:''}<details class="c9-media-catalog"><summary>Browse original beginner reading course</summary><div>${beginnerReadingShelf(state,story,action,esc,beginnerLevel)}</div></details><section class="simple-panel dialogue-shortcut"><div><strong>Try a conversation after reading</strong><p>Original dialogues build on everyday Mandarin in context.</p></div>${action('open-dialogues','Open Conversation Lab →','button primary')}</section><div class="stories-top"><div><label for="story-choice">Reading lesson</label><select id="story-choice">${STORIES.filter(s=>(!storiesLongOnly||s.extended)&&(!storiesBeginnerOnly||s.beginner)&&(!storiesOnlyBookmarked||(state.bookmarkedStories||[]).includes(s.id))).map((s,i)=>`<option value="${s.id}" ${s.id===story.id?'selected':''}>${STORIES.indexOf(s)+1}. ${esc(s.title)} — ${esc(s.theme)}</option>`).join('')}</select></div><div class="story-stat"><strong>${reading.storiesRead}/${STORIES.length}</strong><span>readings with correct independent practice</span></div></div>
 <div class="reading-tools">${action('story-bookmark',(state.bookmarkedStories||[]).includes(story.id)?'★ Saved reading':'☆ Save reading','button outline small')}${action('story-bookmarks-only',storiesOnlyBookmarked?'Show all readings':'Show saved only','button outline small')}${action('reading-beginner-filter',storiesBeginnerOnly?'All reading lengths':'Beginner readings only','button outline small')}${action('reading-long-filter',storiesLongOnly?'All reading lengths':'Extended readings only','button outline small')}${action('reading-text-size',state.settings.readingLarge?'Standard text':'Larger Chinese text','button outline small')}<span class="muted">${(state.bookmarkedStories||[]).length} saved · ${introducedTokens}/${linkedTokens.length} glossary occurrences linked to introduced lessons</span></div><div class="c9-media-support-controls" role="group" aria-label="Reading language support">
 <span>Optional support · revealing either makes this exercise assisted</span>
 ${action('c9-story-pinyin',c9StoryPinyin?'Hide Pinyin':'Show Pinyin','c9-button c9-button--secondary c9-button--small',`aria-pressed="${c9StoryPinyin}"`)}
 ${action('c9-story-english',c9StoryEnglish?'Hide English':'Show English','c9-button c9-button--secondary c9-button--small',`aria-pressed="${c9StoryEnglish}"`)}
 </div>${renderC9ReadingNavigator(story,storyFocusIndex,action,esc)}<div class="stories-layout ${state.settings.readingLarge?'large-reading':''}"><article class="simple-panel story-paper" id="c9-native-reading" tabindex="-1"><p class="eyebrow">READING ${String(STORIES.indexOf(story)+1).padStart(2,'0')} · ${esc(story.theme)}</p><h2>${esc(story.title)}</h2>${beginnerReadingHeading(story,action,esc,beginnerPart,beginnerWordShown)}${readingExtendedHeader(story,action,esc,{paragraph:storyParagraph,only:storyParagraphOnly,translations:storyParagraphTranslations})}<p class="muted">${coverage.introduced}/${coverage.total} relevant demo lesson characters introduced. This does not measure total vocabulary or grammar knowledge. Tap an underlined word for a glossary hint; using hints makes the following answer assisted.</p>
 ${(storyMode==='passage-writing'||storyMode==='beginner-writing')&&!storyAssist&&!storyResult?`<div class="p27-writing-hide"><strong>Recall without a visible source</strong><p>The passage is hidden for reading-to-writing production. Revealing it marks this attempt assisted.</p>${action('reading-show-writing-source','Review passage · assisted','button outline small')}</div>`:story.lines.map((line,i)=>(storyParagraphOnly&&story.extended&&paragraphFor(story,i)!==storyParagraph||story.beginner&&beginnerPart!=='all'&&Math.floor(i/3)!==Number(beginnerPart))?'':`${beginnerPartMarker(story,i,action,esc,beginnerPartTip)}${readingParagraphMarker(story,i,action,esc,storyParagraphTranslations)}<section class="story-line ${storyFocusIndex===i?'reading-line-focused':''}" data-c9-story-line="${i}" tabindex="-1" aria-current="${storyFocusIndex===i?'step':'false'}"><div class="story-line-top"><span class="eyebrow">SENTENCE ${i+1}</span><div class="story-line-actions">${action('speak','▶ Listen','button outline small',`data-text="${esc(line.hanzi)}"`)}${action('story-help-line',storyHelpIndex===i?'Hide help':'Explain','button outline small',`data-index="${i}"`)}</div></div><p lang="zh-Hans" class="story-chinese">${tokenizeSentence(line.hanzi).map(({text,entry})=>entry?`<button type="button" class="story-token" lang="zh-Hans" data-action="story-token" data-token="${esc(entry.hanzi)}" aria-label="Look up ${esc(entry.hanzi)}">${esc(text)}</button>`:esc(text)).join('')}</p>${c9StoryPinyin||c9StoryEnglish||storyShowTranslation||storyHelpIndex===i||story.extended&&storyParagraphTranslations.includes(paragraphFor(story,i))?`<div class="line-support">${c9StoryPinyin||storyShowTranslation||storyHelpIndex===i||story.extended&&storyParagraphTranslations.includes(paragraphFor(story,i))?`<p class="story-pinyin">${esc(line.pinyin)}</p>`:''}${c9StoryEnglish||storyShowTranslation||storyHelpIndex===i||story.extended&&storyParagraphTranslations.includes(paragraphFor(story,i))?`<p class="story-english">${esc(line.english)}</p>`:''}</div>`:''}</section>`).join('')}
 <div class="button-row">${action('story-focus-next',storyFocusIndex===-1?'Focus first sentence':`Focus sentence ${(storyFocusIndex+1)%story.lines.length+1} / ${story.lines.length}`,'button outline small')}${storyFocusIndex!==-1?action('speak','▶ Focused sentence','button outline small',`data-text="${esc(story.lines[storyFocusIndex].hanzi)}"`):''}${storyFocusIndex!==-1?action('story-focus-off','Show all equally','button outline small'):''}${story.extended?action('reading-next-paragraph','Next paragraph →','button outline small'):''}${action('story-reveal',storyShowTranslation?'Hide teaching support':'Show pinyin & English','button outline small')}${action('speak','▶ Hear passage','button outline small',`data-text="${esc(story.lines.map(l=>l.hanzi).join(''))}"`)}${action('speech-rate','Speed: '+demoSpeechRate+'×','button outline small')}</div>
 ${storyGlossary?`<div class="story-glossary" role="status"><strong lang="zh-Hans">${esc(storyGlossary.hanzi)}</strong> · ${esc(storyGlossary.pinyin)}<p>${esc(storyGlossary.english)}</p>${WORDS.find(w=>w.hanzi===storyGlossary.hanzi)?action('word-bookmark',(state.bookmarkedWords||[]).includes(WORDS.find(w=>w.hanzi===storyGlossary.hanzi).key)?'★ Saved word':'☆ Save word','button outline small',`data-id="${esc(WORDS.find(w=>w.hanzi===storyGlossary.hanzi).key)}"`):''}${storyGlossary.wordKey?action('vocabulary-start','Learn this word →','button primary small',`data-id="${esc(storyGlossary.wordKey)}"`):''}${action('speak','▶ Listen to word','button outline small',`data-text="${esc(storyGlossary.hanzi)}"`)}${storyGlossary.lessonIds.length?action('story-linked','View related lesson →','button outline small',`data-id="${storyGlossary.lessonIds[0]}"`):''}</div>`:''}
 </article>
 <section class="simple-panel story-practice"><p class="eyebrow">PRACTICE · ${esc(storyMode.toUpperCase())}</p><div class="mode-tabs" role="group" aria-label="Story exercise type">${[['comprehension','Understand'],['cloze','Missing word'],['ordering','Build sentence'],['pronunciation','Pinyin recall'],['evidence','Find evidence'],['connection','Link the ideas']].map(([mode,text])=>action('story-mode',text,storyMode===mode?'button dark small':'button outline small',`data-mode="${mode}"`)).join('')}</div>${readingExtendedModeButtons(story,storyMode,action,esc)}${beginnerModeTabs(story,storyMode,action,esc)}
 <h3>${esc(exercise.prompt)}</h3>
 ${storyMode==='cloze'?`<p lang="zh-Hans" class="story-exercise-chinese">${esc(exercise.prompt)}</p>`:''}
 ${!storyResult?(ordering?`<p class="muted">Build the sentence using the chunks in order. Select a placed chunk to remove it.</p><div class="story-assembled" aria-label="Your assembled sentence">${storySequence.length?storySequence.map((idx,i)=>action('story-order-remove',esc(exercise.chunks[idx]),'chunk chosen',`data-index="${i}"`)).join(''):'<span class="muted">Your sentence will appear here…</span>'}</div><div class="story-chunks">${shuffled.filter(i=>!selected.has(i)).map(i=>action('story-order-add',esc(exercise.chunks[i]),'chunk',`data-index="${i}"`)).join('')}</div>`:(storyMode==='pronunciation'||exercise.kind==='hanzi')?`<div class="answer-entry"><label for="story-entry">${exercise.kind==='hanzi'?'Write the Chinese model sentence':'Pinyin with tones'}</label><input id="story-entry" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="For example, xue2xiao4" value="${esc(storyTyped)}"></div>`:`<div class="choice-list">${exercise.options.map((o,i)=>`<button type="button" class="choice" data-action="story-answer" data-option="${esc(o)}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div>`):`<div class="reader-feedback ${storyResult.correct?'correct':'incorrect'}" role="status"><strong>${storyResult.correct?'Correct.':'Review this answer.'}</strong><p>${esc(storyResult.message)}</p><p>Expected: <strong>${esc(storyResult.reference)}</strong></p>${readingEvidence(story,exercise,storyResult,esc)}${beginnerEvidence(story,exercise,storyResult,esc)}${storyResult.explanation?`<p>${esc(storyResult.explanation)}</p>`:''}<p class="muted">${storyResult.assisted?'Assisted practice — not counted as independent reading.':'Independent attempt recorded for this demo reading.'}</p></div>`}
 <div class="button-row">${!storyResult?`${ordering||storyMode==='pronunciation'||exercise.kind==='hanzi'?action('story-check','Check answer →','button primary',ordering?!storySequence.length?'disabled':'':!storyTyped.trim()?'disabled':''):''}${action('story-skip','Reveal answer','button outline')}`:action('story-retry','Try this mode again','button outline')}${action('story-prev','← Previous reading','button outline small')}${action('story-next','Next reading →','button primary')}</div><p class="muted">Study-history entries are supplementary and separate from scheduled review. Reading never awards official HSK mastery.</p></section></div>${readingExtendedConnections(story,action,esc)}${beginnerConnections(story,action,esc)}`;
}
function guidedReadingContext(question,assisted){
 if(question.sourceType!=='story')return '';
 const story=findStory(question.sourceId);
 if(question.mode==='line-order')return `<div class="guided-reading-context"><p class="eyebrow">REBUILD THE PASSAGE · ${assisted?'HINT USED':'INDEPENDENT ORDER'}</p><p>Use the three Chinese sentences below. The original sequence is hidden until checking.</p></div>`;
 const hiddenLine=question.mode==='ordering'?story.order.join(''):null;
 const lines=story.lines.map((line,i)=>{
  const chinese=hiddenLine===line.hanzi?'［Reconstruct this sentence］':question.mode==='cloze'?line.hanzi.replace(story.cloze.answer,'＿＿'):line.hanzi;
  return `<div class="guided-reading-line"><p lang="zh-Hans">${esc(chinese)}</p>${assisted?`<p class="muted">${esc(line.pinyin)} · ${esc(line.english)}</p>`:''}</div>`;
 }).join('');
 return `<div class="guided-reading-context"><p class="eyebrow">READ THE CONTEXT ${assisted?'· TRANSLATIONS VISIBLE':'· WITHOUT TRANSLATION'}</p>${lines}</div>`;
}
function toneTeachingPanel(reference,reason=''){
 const info=pronunciationPath(reference);if(!info)return '';
 return `<details class="tone-teaching"><summary>How the written tones work <span aria-hidden="true">⌄</span></summary><div class="tone-grid">${info.syllables.map(p=>`<div class="tone-piece"><span>${p.index} · ${esc(p.syllable)}</span><strong>Tone ${p.tone===0?'0/5':p.tone} · ${esc(p.name)}</strong><small>${esc(p.cue)}</small></div>`).join('')}</div>${reason?`<p><strong>Try next:</strong> ${esc(pronunciationRemedy(reference,reason))}</p>`:''}<p class="muted">${esc(info.advice)}</p>${soundPrimer(reference,action,esc)}</details>`;
}
function contextBridgePanel(){
 const suggestions=contextualWeaknesses(state).slice(0,4);
 const label=s=>s.type==='sense'?'Distinguish a word meaning':s.type==='sentence'?'Rebuild a Chinese sentence':'Understand a conversation';
 return `<section class="simple-panel connection-bridge"><div class="panel-heading"><h2>Practice knowledge in context</h2><span class="muted">Recommended from recorded practice, not official proficiency</span></div><div class="bridge-options">${suggestions.map(s=>`<button type="button" class="bridge-option" data-action="open-connected-item" data-type="${s.type}" data-id="${esc(s.id)}" data-step="${s.step??0}"><span class="bridge-icon" aria-hidden="true">${s.type==='sense'?'文':s.type==='sentence'?'写':'说'}</span><span><strong>${label(s)}</strong><small>${s.weakness>2?'Prioritize recorded errors':'Try a new independent context check'}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="button-row">${action('connected-session','Start a mixed connected session →','button primary')}</div><p class="muted">Answers in this section never change your scheduled-review mastery.</p></section>`;
}
function renderGuidedPractice(){const session=state.practiceSession;
 if(!session)return '';
 if(session.cursor>=session.limit)return `${gated()}${renderC9GuidedStep(state,esc)}<article class="simple-panel guided-session c9-guided-complete"><div class="stats-grid">${stat(session.cursor,'Questions completed')}${stat(session.correct,'Correct independently')}${stat(session.assisted,'Assisted/revealed')}</div><p>Your past practice is retained if you start a new session.</p><div class="button-row">${action('guided-end','Back to Practice Lab','button primary')}${action('go-progress','See activity','button outline')}</div></article>`;
 const q=guidedQuestion(session),chosen=new Set(guidedOrder),orders=q.kind==='ordering'?q.chunks.map((_,i)=>i).sort((a,b)=>(a*13+session.cursor*3)%19-(b*13+session.cursor*3)%19):[];
 const source=q.sourceType==='story'?`Reading · ${esc(findStory(q.sourceId).title)}`:q.sourceType==='drill'?`Lesson · ${esc(findLesson(q.sourceId).hanzi)}`:q.sourceType==='sense'?'Word Sense Lab':q.sourceType==='sentence'?'Sentence Workshop':q.sourceType==='mission'?`Dialogue · ${esc(q.dialogue.title)}`:'Connected practice';
 const usedHint=guidedAssisted||Boolean(session.assistanceUsed);
 return `${gated()}${renderC9GuidedStep(state,esc)}
 <section class="simple-panel guided-session c9-guided-live"><div class="guided-meta"><span>${session.cursor+1} of ${session.limit} · ${source}</span><span>${session.correct} independent correct · ${session.assisted} assisted</span></div><div class="progress-rail"><span style="width:${session.cursor/session.limit*100}%"></span></div>
 ${guidedReadingContext(q,usedHint)}
 ${q.sourceType==='mission'?`<div class="guided-reading-context"><p class="eyebrow">CONVERSATION CONTEXT</p>${q.dialogue.lines.map(line=>`<p lang="zh-Hans">${esc(line.speaker)}: ${esc(line.hanzi)}</p>${usedHint?`<p class="muted">${esc(line.pinyin)} · ${esc(line.english)}</p>`:''}`).join('')}</div>`:''}
 <p class="eyebrow">${q.sourceType==='story'?'CONNECTED READING':q.sourceType==='sense'?'WORD MEANING IN CONTEXT':q.sourceType==='sentence'?'SENTENCE RECONSTRUCTION':q.sourceType==='mission'?'DIALOGUE REASONING':'CHARACTER / WORD PRACTICE'} · ${esc(q.mode.toUpperCase().replaceAll('-',' '))}</p><h2>${esc(q.prompt)}</h2>${q.hanzi?`<p class="practice-hanzi" lang="zh-Hans">${esc(q.hanzi)}</p>`:''}
 ${session.feedback?`<div class="reader-feedback ${session.feedback.correct&&!session.feedback.assisted?'correct':'incorrect'}" role="status"><strong>${session.feedback.correct?'Correct.':'Check the explanation.'}</strong><p>${esc(session.feedback.message)}</p><p><strong>Reference:</strong> ${esc(session.feedback.reference)}</p>${q.kind==='pinyin'?toneTeachingPanel(q.answer,session.feedback.reason):''}<p>${session.feedback.assisted?'Assisted answer · no independent credit.':'Recorded as supplementary practice, not official HSK mastery.'}</p></div><div class="button-row">${action('guided-next','Next question →','button primary')}${action('guided-explore','Study this context ↗','button outline')}</div>`:
 q.kind==='choice'?`<div class="choice-list" role="group" aria-label="Select one answer">${q.options.map((opt,i)=>action('guided-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div>`:
 q.kind==='ordering'?`<p class="muted">Select the Chinese chunks in order. Select an assembled chunk to remove it.</p><div class="story-assembled">${guidedOrder.length?guidedOrder.map((idx,i)=>action('guided-order-remove',esc(q.chunks[idx]),'chunk chosen',`data-index="${i}"`)).join(''):'<span class="muted">Your sentence appears here.</span>'}</div><div class="story-chunks">${orders.filter(i=>!chosen.has(i)).map(i=>action('guided-order-add',esc(q.chunks[i]),'chunk',`data-index="${i}"`)).join('')}</div>`:
 `<div class="answer-entry"><label for="guided-entry">${q.kind==='hanzi'?'Type the Chinese sentence':'Pinyin including tones'}</label><input id="guided-entry" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(guidedTyped)}" placeholder="${q.kind==='hanzi'?'Chinese characters, not pinyin':'Tone marks or numbers'}"></div>`}
 ${!session.feedback?`<div class="button-row">${q.kind!=='choice'?action('guided-check','Check answer','button primary',q.kind==='ordering'?!guidedOrder.length?'disabled':'':!guidedTyped.trim()?'disabled':''):''}${action('guided-hint','Show teaching hint','button outline')}${action('guided-reveal','Reveal answer','button outline')}${action('guided-pause','Pause session','button outline')}${action('guided-abandon','End session','button outline')}</div>${usedHint?`<p class="muted">Hint used. The answer will be recorded as assisted.</p><div class="lesson-guide"><p>${esc(q.explanation||'Review the reading and relevant word meaning.')}</p></div>`:''}`:''}
 </section>`;
}
function renderPracticeNative(){if(state.practiceSession)return renderGuidedPractice();const l=findLesson(drillLessonId)||DEMO_LESSONS[0],d=buildDrill(l.id,drillMode),record=practiceSummary(state),available=state.learned.length;
 const selected=new Set(drillOrder),choices=d.kind==='ordering'?d.chunks.map((_,i)=>i).sort((a,b)=>(a*13+l.order*7)%17-(b*13+l.order*7)%17):[];
 return `${gated()}<details class="c9-assessment-extra"><summary>Fluency recommendations and additional study context</summary><div>${fluencyHomePanel()}</div></details>
 <section class="simple-panel practice-shortcuts"><h2>Practice beyond flashcards</h2><p>Review your saved words or follow a conversation without affecting scheduled-review mastery.</p><div class="button-row">${action('open-wordbook-practice','Saved word drills →','button outline')}${action('open-dialogues','Conversation Lab →','button outline')}${action('connected-session','Connect words, sentences and dialogues →','button outline')}</div></section>
 <section class="simple-panel guided-start" id="c9-native-guided" tabindex="-1"><div><p class="eyebrow">NEW · CONTINUOUS STUDY</p><h2>Guided practice session</h2><p>Mix characters, words, pinyin, and short readings across your learning history. Answers save after each question and can be resumed after reopening the app. Supplemental practice never raises scheduled-review mastery.</p></div><div class="guided-start-actions"><label>Session focus<select id="guided-focus"><option value="balanced" ${guidedFocus==='balanced'?'selected':''}>Balanced mix</option><option value="weak" ${guidedFocus==='weak'?'selected':''}>Focus recent mistakes</option><option value="reading" ${guidedFocus==='reading'?'selected':''}>Reading & context</option><option value="sentences" ${guidedFocus==='sentences'?'selected':''}>Sentence reasoning</option><option value="pronunciation" ${guidedFocus==='pronunciation'?'selected':''}>Pinyin & tones</option><option value="connected" ${guidedFocus==='connected'?'selected':''}>Connect senses, sentences & dialogues</option></select></label><label>Questions<select id="guided-size">${[5,10,20].map(n=>`<option value="${n}" ${n===guidedLimit?'selected':''}>${n} questions</option>`).join('')}</select></label>${action('guided-start','Start session →','button primary')}</div></section>
 <div class="practice-header" id="c9-native-drills" tabindex="-1"><label>Choose a demo lesson<select id="drill-lesson">${DEMO_LESSONS.map(item=>`<option value="${item.id}" ${l.id===item.id?'selected':''}>${item.order}. ${esc(item.hanzi)} — ${esc(item.meaning)}</option>`).join('')}</select></label><p>${record.attempts} supplemental attempts · ${record.independentCorrect} correct without hints · ${available} lessons introduced</p></div>
 <div class="practice-tabs" role="group" aria-label="Exercise format">${[['recognition','Find character'],['word-meaning','Word meaning'],['word-pinyin','Word pinyin'],['word-build','Build a word'],['sentence-cloze','Complete sentence'],['reading-choice','Character pinyin']].map(([mode,label])=>action('drill-mode',label,mode===drillMode?'button dark small':'button outline small',`data-mode="${mode}" aria-pressed="${mode===drillMode}"`)).join('')}</div>
 <article class="simple-panel practice-card"><p class="eyebrow">${esc(drillMode.replaceAll('-',' ').toUpperCase())} · NON-HSK DEMO</p><h2>${esc(d.prompt)}</h2>${d.hanzi?`<p lang="zh-Hans" class="practice-hanzi">${esc(d.hanzi)}</p>`:''}
 ${!drillResult?(d.kind==='choice'?`<div class="choice-list">${d.options.map((option,i)=>action('drill-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(option)}`,'choice',`data-option="${esc(option)}"`)).join('')}</div>`:d.kind==='ordering'?`<p class="muted">Tap the characters in order. Tap an assembled character to remove it.</p><div class="story-assembled">${drillOrder.length?drillOrder.map((idx,i)=>action('drill-order-remove',esc(d.chunks[idx]),'chunk chosen',`data-index="${i}"`)).join(''):'<span class="muted">Your word will appear here.</span>'}</div><div class="story-chunks">${choices.filter(x=>!selected.has(x)).map(i=>action('drill-order-add',esc(d.chunks[i]),'chunk',`data-index="${i}"`)).join('')}</div>`:`<div class="answer-entry"><label for="drill-entry">Pinyin with tones</label><input id="drill-entry" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" value="${esc(drillTyped)}" placeholder="Tone marks or tone numbers"></div>`):`<div class="reader-feedback ${drillResult.correct?'correct':'incorrect'}" role="status"><strong>${drillResult.correct?'Correct.':'Review the example.'}</strong><p>${esc(drillResult.message)}</p><p><strong>Reference:</strong> ${esc(d.answer)}</p><p>${esc(d.explanation)}</p><p class="muted">${drillResult.assisted?'Hint or reveal used. This attempt is assisted.':'Result saved as supplemental practice only.'}</p></div>`}
 ${drillAssisted&&!drillResult?`<div class="lesson-guide"><strong>Teaching hint</strong><p>${esc(l.note)}</p><p class="muted">This attempt will be marked assisted, regardless of the answer.</p></div>`:''}
 <div class="button-row">${!drillResult?`${d.kind!=='choice'?action('drill-check','Check answer','button primary',(d.kind==='pinyin'?!drillTyped.trim():!drillOrder.length)?'disabled':''):''}${action('drill-hint','Hint','button outline')}${action('drill-reveal','Reveal reference','button outline')}`:`${action('drill-retry','Try again','button outline')}${action('drill-next','Next lesson →','button primary')}`}</div></article>`;
}
function renderPractice(){
 return '<div class="c9-practice-page">'+renderC9PracticeHeader(state,action,esc)+
   renderC9PracticePaths(state,action)+
   '<div class="c9-practice-native-section"'+(state.practiceSession?' id="c9-native-guided" tabindex="-1"':'')+'>'+renderPracticeNative()+'</div>'+
   '<p class="c9-assessment-disclaimer">Only existing review and practice actions write learner history. Independent answers, assisted checks, and scheduled review remain separate authorities.</p>'+
 '</div>';
}

function vocabularyShelfPanel(){
 const introduced=(state.vocabularyIntroduced||[]).map(findWord).filter(Boolean);
 const featured=introduced.length?introduced.slice(-6).reverse():WORDS.filter(w=>w.source.includes('p23')).slice(0,8);
 return `<section class="simple-panel p23-vocabulary-shelf"><div class="panel-heading"><div><p class="eyebrow">COMPLETE WORDS · IN CONTEXT</p><h2>Discover vocabulary and begin a word journey</h2></div><span class="muted">${introduced.length} independently introduced · ${WORDS.length} canonical words</span></div>
 <p>Browse pronunciation, several meanings, original sentence examples, useful collocations and related written words. A word journey uses the existing five practice skills.</p>
 <div class="p23-shelf-grid">${featured.map(w=>`<div class="p23-shelf-word"><div><strong lang="zh-Hans">${esc(w.hanzi)}</strong><small>${esc(w.pinyin)} · ${esc(w.senses[0])}</small></div><div class="button-row">${action('lookup-word','Details','button outline small',`data-id="${esc(w.key)}"`)}${action('vocabulary-start','Learn →','button primary small',`data-id="${esc(w.key)}"`)}</div></div>`).join('')}</div>
 <div class="button-row">${action('open-wordbook-practice','Vocabulary studio →','button primary')}${action('vocabulary-catalog','Browse all words','button outline')}</div></section>`;
}
function catalogPager(count){
 const pages=Math.ceil(count/90);if(pages<=1)return '';
 return `<nav class="p23-catalog-pager" aria-label="Search results pages"><span>Page ${explorePage+1} / ${pages}</span>${action('catalog-prev','← Previous','button outline small',explorePage===0?'disabled':'')}${action('catalog-next','Next →','button outline small',explorePage>=pages-1?'disabled':'')}</nav>`;
}
function visibleExploreResults(){const found=searchCatalog(searchQuery,exploreKind);return exploreSavedOnly?found.filter(e=>e.type==='word'&&(state.bookmarkedWords||[]).includes(e.id)):found;}
function renderExploreNative(){const results=visibleExploreResults(),selected=searchSelection;
 const selectedResult=selected?.type==='word'?findWord(selected.id):selected?.type==='character'?findLesson(selected.id):null;
 return `${title('CHARACTER & WORD LOOKUP','Explore Chinese.','Search independent characters and complete vocabulary words, including alternate definitions and related lessons.')}${gated()}${exploreWorkspace(state,action,esc)}<div class="button-row p32-explore-links">${action('p34-open-reading','P34 guided reading →','button outline small','data-id="p34-01"')}${action('p34-open-listening','P34 listening-first →','button outline small','data-id="p34-audio-01"')}${action('p33-browse','Everyday conversations →','button outline small')}${action('grammar-select','P32 beginner grammar →','button outline small','data-id="g37"')}${action('p32-open-sentences','120 new contextual sentences →','button outline small')}</div>${p31VocabularyShelf(state,action,esc,{page:p31WordPage})}${vocabularyShelfPanel()}
 <div class="search-shell"><label class="field-label" for="explore-query">Find a character, word, pinyin or meaning</label><input type="search" id="explore-query" autocomplete="off" spellcheck="false" placeholder="Try 学校, xue, friend, water" value="${esc(searchQuery)}"><div class="mode-tabs" role="group" aria-label="Search category">${['all','characters','words'].map(k=>action('search-kind',k==='all'?'All':k==='words'?'Words':'Characters',exploreKind===k?'button dark small':'button outline small',`data-kind="${k}"`)).join('')}</div><div class="button-row wordbook-filter">${action('open-wordbook-practice','Practice saved words →','button primary')}${action('wordbook-filter',exploreSavedOnly?'Show all entries':'My saved words ('+(state.bookmarkedWords||[]).length+')','button outline small',`aria-pressed="${exploreSavedOnly}"`)}</div><p id="search-count" class="muted">${results.length} results · ${WORDS.length} distinct example word entries · Browsing never changes mastery.</p></div>
 <div class="explore-layout"><div class="p23-search-list"><div id="explore-results" class="results-list">${renderSearchResults(results)}</div><div id="explore-pager">${catalogPager(results.length)}</div></div><article id="explore-detail" class="explore-detail">${selectedResult?selected.type==='word'?wordDetail(selectedResult):exploreDetail(selectedResult):'<div class="empty-panel"><strong>Select an entry.</strong><p>Open a character or word to inspect its meanings, related lessons and usage.</p></div>'}</article></div>`;
}
function renderExplore(){return '<div class="c9-language-workspace c9-lookup-workspace">'+renderExploreNative()+'</div>';}
function renderSearchResults(results){return results.slice(explorePage*90,(explorePage+1)*90).map(e=>`<button class="result-row ${searchSelection?.type===e.type&&searchSelection?.id===e.id?'selected':''}" data-action="select-explore" data-type="${e.type}" data-id="${esc(e.id)}" type="button"><span lang="zh-Hans">${esc(e.hanzi)}</span><span><strong>${esc(e.pinyin)}</strong><small>${esc(e.english)}</small><small class="muted">${e.type==='word'?'Word':'Character'}</small></span><span>→</span></button>`).join('')||'<p class="empty-panel">No matching approved demo entries.</p>'}
function exploreDetail(l){return `<span class="eyebrow">CHARACTER · ORIGINAL DEMO</span><div lang="zh-Hans" class="detail-character">${esc(l.hanzi)}</div><p class="detail-reading">${esc(l.pinyin)}</p><h2>${esc(l.meaning)}</h2><p>${esc(l.note)}</p><h3>Words containing this character</h3><div class="detail-words">${l.words.map(w=>`<button type="button" class="word-ref" data-action="lookup-word" data-word="${esc(w.hanzi)}"><strong lang="zh-Hans">${esc(w.hanzi)}</strong><span>${esc(w.pinyin)}</span><small>${esc(w.english)}</small></button>`).join('')}</div><h3>Used in context</h3><p lang="zh-Hans" class="detail-sentence">${esc(l.sentence.hanzi)}</p><p class="muted">${esc(l.sentence.pinyin)}</p><p>${esc(l.sentence.english)}</p>${action('open-lesson','Study this character →','button primary',`data-id="${l.id}"`)}`;}
function wordDetail(w){
 const linked=w.lessonIds.map(findLesson).filter(Boolean);
 const components=(w.relatedLessonIds||[]).map(findLesson).filter(l=>l&&!linked.some(x=>x.id===l.id));
 const readingUses=STORIES.flatMap(story=>story.lines.filter(line=>line.hanzi.includes(w.hanzi)).map(line=>({story,line}))).slice(0,4);
 const dialogueUses=DIALOGUES.flatMap(dialogue=>dialogue.lines.filter(line=>line.hanzi.includes(w.hanzi)).map(line=>({dialogue,line}))).slice(0,4);
 const progress=vocabularyProgress(state,w.key),family=wordFamily(w.key,9);
 return `<div class="p23-word-entry">
 <p class="eyebrow">CANONICAL WORD · ORIGINAL LEARNING CONTENT</p><div lang="zh-Hans" class="detail-character">${esc(w.hanzi)}</div><p class="detail-reading">${esc(w.pinyin)}</p>${soundPrimer(w.pinyin,action,esc)}<h2>${esc(w.senses.join(' / '))}</h2>
 <p class="muted">${progress.introduced?'Already introduced in your personal vocabulary collection':'New independent vocabulary word'} · ${progress.attempts} recorded Wordbook answers · No official HSK label.</p>
 <div class="button-row">${action('vocabulary-start','Study this word · five skills →','button primary',`data-id="${esc(w.key)}"`)}
 ${action('vocabulary-introduce',progress.introduced?'Added to learning':'Add to my vocabulary','button outline small',`data-id="${esc(w.key)}" ${progress.introduced?'disabled':''}`)}
 ${action('word-bookmark',progress.bookmarked?'★ Saved':'☆ Save','button outline small',`data-id="${esc(w.key)}"`)}
 ${action('speak','▶ Listen','button outline small',`data-text="${esc(w.hanzi)}"`)}</div>
 ${w.notes.length?`<section class="p23-dictionary-section"><h3>Meaning & usage</h3>${w.notes.slice(0,3).map(note=>`<p>${esc(note)}</p>`).join('')}</section>`:''}
 ${GRAMMAR_LESSONS.some(g=>g.examples.some(e=>e.hanzi.includes(w.hanzi)))?`<section class="p23-dictionary-section"><h3>Related grammar examples</h3><div class="button-row">${GRAMMAR_LESSONS.filter(g=>g.examples.some(e=>e.hanzi.includes(w.hanzi))).slice(0,4).map(g=>action('grammar-select',esc(g.title)+' →','button outline small',`data-id="${g.id}"`)).join('')}</div></section>`:''}
 ${SENTENCE_LIBRARY.some(row=>row.hanzi.includes(w.hanzi))?`<section class="p23-dictionary-section"><h3>Original sentence contexts</h3><div class="p26-dictionary-sentences">${SENTENCE_LIBRARY.filter(row=>row.hanzi.includes(w.hanzi)).slice(0,4).map(row=>action('sentence-select',`<span lang="zh-Hans">${esc(row.hanzi)}</span><small>${esc(row.english)}</small>`,'p26-mini-sentence',`data-id="${row.id}"`)).join('')}</div></section>`:''}
 ${w.collocations.length?`<section class="p23-dictionary-section"><h3>Common expressions</h3><div class="p23-phrase-row">${w.collocations.map(x=>`<span lang="zh-Hans">${esc(x)}</span>`).join('')}</div></section>`:''}
 ${w.examples.length?`<section class="p23-dictionary-section"><h3>Learn in complete sentences</h3>${w.examples.slice(0,4).map(ex=>`<div class="word-example"><p lang="zh-Hans">${esc(ex.hanzi)}</p><p class="muted">${esc(ex.pinyin)}</p><p>${esc(ex.english)}</p>${action('speak','Listen to sentence','button outline small',`data-text="${esc(ex.hanzi)}"`)}</div>`).join('')}</section>`:''}
 ${linked.length?`<section class="p23-dictionary-section"><h3>Lessons teaching this word</h3><div class="detail-words">${linked.slice(0,6).map(l=>action('open-lesson',`<strong lang="zh-Hans">${esc(l.hanzi)}</strong> · ${esc(l.meaning)}`,'word-ref',`data-id="${esc(l.id)}"`)).join('')}</div></section>`:''}
 ${components.length?`<section class="p23-dictionary-section"><h3>Characters making up this word</h3><div class="detail-words">${components.slice(0,6).map(l=>action('open-lesson',`<strong lang="zh-Hans">${esc(l.hanzi)}</strong> · ${esc(l.meaning)}`,'word-ref',`data-id="${esc(l.id)}"`)).join('')}</div></section>`:''}
 ${family.length?`<section class="p23-dictionary-section"><h3>Related written words</h3><p class="muted">Shared characters do not guarantee shared meanings.</p><div class="p23-word-family">${family.map(item=>action('lookup-word',`<span lang="zh-Hans">${esc(item.hanzi)}</span><small>${esc(item.pinyin)} · ${esc(item.senses[0])}</small>`,'word-ref',`data-id="${esc(item.key)}"`)).join('')}</div></section>`:''}
 ${readingUses.length?`<section class="p23-dictionary-section"><h3>Connected readings</h3>${readingUses.map(({story,line})=>`<div class="word-example"><p lang="zh-Hans">${esc(line.hanzi)}</p><p>${esc(line.english)}</p>${action('open-story-link',`Read “${esc(story.title)}” →`,'button outline small',`data-id="${esc(story.id)}"`)}</div>`).join('')}</section>`:''}
 ${dialogueUses.length?`<section class="p23-dictionary-section"><h3>Connected conversations</h3>${dialogueUses.map(({dialogue,line})=>`<div class="word-example"><p lang="zh-Hans">${esc(line.hanzi)}</p><p>${esc(line.english)}</p>${action('hub-dialogue',`Open “${esc(dialogue.title)}” →`,'button outline small',`data-id="${esc(dialogue.id)}"`)}</div>`).join('')}</section>`:''}
 </div>`;
}
function renderProgressNative(){const m=summary(state),r=storySummary(state),analytics=learningAnalytics(state),practice=practiceSummary(state);const breakdown=[['Character meaning',['meaning']],['Character reading',['reading']],['Vocabulary meaning',['word0','word1','word2']],['Word pronunciation',['wordread0','wordread1','wordread2']],['Sentence comprehension',['sentence']]];
 const observed=type=>state.events.filter(ev=>ev.correct===true&&!ev.assisted&&type.some(t=>ev.cardId.endsWith(':'+t))).length;
 return `${title('LEARNING EVIDENCE','Your progress, clearly.','Your introduced lessons, independent answers and review history are different forms of evidence.')}${progressWorkspace(state,action,esc)}${planSummaryPanel()}${fluencyAnalyticsPanel()}
 <div class="stats-grid">${stat(m.learned,'Characters introduced')}${stat(m.cards,'Independent review targets')}${stat(m.attempts,'Checked attempts')}${stat(m.successful,'Correct independent answers')}</div><section class="simple-panel"><h2>Connected lesson journeys</h2><div class="stats-grid">${stat(courseMetrics(state).finished,'Guided journeys finished')}${stat(courseMetrics(state).independent,'Independent course checks')}${stat(courseMetrics(state).assisted,'Assisted course checks')}${stat(courseMetrics(state).missed,'Mistaken course checks')}</div><p>${courseRepairSummary(state).attempts} targeted corrections · ${courseRepairSummary(state).independent} independent corrections. Corrected practice is not a scheduled review grade.</p><p>Course completion means you completed the learning stages. It does not certify mastery or add successful scheduled-review grades.</p>${action('course-home-open','Open daily journey →','button primary')}</section><section class="simple-panel"><h2>Personal vocabulary learning</h2><p>${(state.vocabularyIntroduced||[]).length} independently introduced words · ${bookmarkedVocabulary(state).length} bookmarked for focused review. Wordbook attempts do not change scheduled review mastery.</p><div class="saved-words">${bookmarkedVocabulary(state).slice(0,18).map(w=>action('lookup-word',`<span lang="zh-Hans">${esc(w.hanzi)}</span><small>${esc(w.senses[0])}</small>`,'saved-word-pill',`data-word="${esc(w.hanzi)}" data-id="${esc(w.key)}"`)).join('')||'<p class="muted">Save words from Explore to keep a personal shortlist.</p>'}</div><div class="button-row">${action('open-wordbook','Open wordbook →','button outline')}${action('open-wordbook-practice','Practice wordbook →','button primary')}</div></section>
 <section class="simple-panel"><h2>Last 14 days · observed answers</h2><p class="muted">Counts are checked scheduled-review attempts, not calibrated recall probabilities or a streak.</p><div class="activity-bars" role="img" aria-label="Scheduled review attempts by day: ${analytics.bins.map(b=>`${b.day} ${b.attempts}`).join(', ')}">${analytics.bins.map(b=>`<div class="activity-day" title="${b.day}: ${b.attempts} attempts"><span style="height:${Math.max(3,100*b.attempts/Math.max(1,...analytics.bins.map(d=>d.attempts)))}%"></span><small>${b.day.slice(8)}</small></div>`).join('')}</div><p class="muted">${analytics.correct14} unassisted correct answers from ${analytics.attempts14} attempts · ${practice.attempts} separate Practice Lab attempts</p><h3>Items to revisit</h3>${analytics.struggling.length?`<div class="weak-list">${analytics.struggling.slice(0,5).map(w=>`<div><strong lang="zh-Hans">${esc(w.info.prompt)}</strong><span>${esc(w.info.question)} · ${w.failures} previous errors</span>${action('open-lesson','Study →','button outline small',`data-id="${w.info.lesson.id}"`)}</div>`).join('')}</div>`:'<p class="muted">No previously missed scheduled review prompts.</p>'}<div class="button-row">${action('open-practice','Open extra Practice Lab →','button outline')}</div></section>

 ${blockProgressPanel()}${blockDailyInsights()}${renderDiagnosticPanel()}<section class="simple-panel coach-analytics"><h2>Learning evidence · last 7 days</h2><p class="muted">Counts combine scheduled reviews, extra practice and readings, which remain separately classified. Assisted attempts never count as independent correct.</p>
 <div class="stats-grid">${(()=>{const w=weeklyEvidence(state);return `${stat(w.current.attempts,'All recent attempts')}${stat(w.current.independentCorrect,'Independent correct')}${stat(w.current.assisted,'Assisted attempts')}${stat(w.previous.attempts,'Previous 7 days')}`})()}</div>
 <h3>Practice needs by skill</h3><div class="coach-skills">${skillDiagnostics(state).map(s=>`<div><strong>${esc(s.label)}</strong><span>${s.reviewAttempts} scheduled · ${s.practiceAttempts} extra · ${s.reviewedErrors+s.practiceErrors} missed</span></div>`).join('')}</div>${remediationPlan(state).length?action('coach-practice','Work on observed mistakes →','button primary'):''}
 </section>
 <section class="simple-panel"><h2>Guided practice</h2><p>Mixed-session answers are saved in existing supplemental drill and reading histories, never in scheduled-review mastery.</p>${state.practiceSession?`<p><strong>${state.practiceSession.cursor}/${state.practiceSession.limit}</strong> questions completed · ${state.practiceSession.correct} independent correct.</p><div class="button-row">${action('open-practice','Resume guided session →','button primary')}</div>`:'<p class="muted">No active guided session.</p>'}</section>
 <section class="simple-panel"><h2>Connected reading</h2><p>${r.storiesRead} of ${STORIES.length} stories have a correct unassisted attempt; ${r.attempts} supplementary reading exercises recorded. ${practice.bookmarked} readings saved for later.</p><div class="button-row">${action('open-stories','Continue reading →','button outline')}</div></section><section class="simple-panel"><h2>Practice by skill</h2><p class="muted">Counts are correct independent attempts, not an estimated memory probability.</p><div class="skill-breakdown">${breakdown.map(([name,types])=>`<div><strong>${observed(types)}</strong><span>${name}</span></div>`).join('')}</div></section>
 <section class="simple-panel progress-panel"><div class="panel-heading"><h2>Original demo curriculum</h2><span>${m.learned}/${m.total}</span></div><p class="muted">This is not official HSK attainment.</p><div class="unit-progress">${lessonGroups().map(g=>`<div><span>${g.name}</span><div class="progress-rail"><span style="width:${g.lessons.filter(l=>state.learned.includes(l.id)).length/g.lessons.length*100}%"></span></div><span>${g.lessons.filter(l=>state.learned.includes(l.id)).length}/${g.lessons.length}</span></div>`).join('')}</div>
 <div class="character-grid">${DEMO_LESSONS.map(l=>`<button type="button" data-action="open-lesson" data-id="${l.id}" class="character-chip ${state.learned.includes(l.id)?'done':''}" title="${esc(l.meaning)}"><span lang="zh-Hans">${esc(l.hanzi)}</span><small>${state.learned.includes(l.id)?'✓':'—'}</small></button>`).join('')}</div></section>
 ${finishOverviewPanel()}<section class="simple-panel"><h2>What the results mean</h2><p><strong>Introduced</strong> means the native lesson-introduction action was recorded. <strong>Independent correct</strong> means an answer passed the conservative automatic checker without an answer reveal. <strong>Mastery</strong> requires delayed validation and is not certified by this demo.</p><p class="muted">Your history is stored locally. Export a backup if you need to preserve it across browsers or devices.</p></section>`;
}
function renderProgress(){
 return renderC9ProgressOverview(state,action,esc)+
 '<details class="c9-details-disclosure c9-progress-details"><summary>Full learning history and detailed skill analysis <small>Original evidence, charts and learning tools</small></summary>'+
 '<div>'+renderProgressNative()+'</div></details>';
}
function renderSettings(){
 return renderC9SettingsIntro(state,Boolean(db),action,esc)+
 '<div class="c9-settings-sections">'+renderSettingsNative()+'</div>';
}
function renderSettingsNative(){const s=state.settings;return `${title('PREFERENCES & DATA','Make the workspace yours.','Your learning activity is stored locally. Back it up when you want to keep a copy.')}
 <section id="c9-settings-study" class="simple-panel" tabindex="-1"><h2>Study preferences</h2><div class="setting-row"><div><strong>Pinyin during teaching</strong><p>Show pronunciation while studying. It stays hidden during independent review.</p></div><label class="toggle"><input type="checkbox" data-setting="showPinyin" ${s.showPinyin?'checked':''}><span>Show</span></label></div><div class="setting-row"><div><strong>Dark appearance</strong><p>Use a darker, high-contrast learning workspace.</p></div><label class="toggle"><input type="checkbox" data-setting="dark" ${s.dark?'checked':''}><span>Dark</span></label></div><div class="setting-row"><div><strong>Target new lessons per day</strong><p>Preference for future learning recommendations, not a strict limit.</p></div><select data-setting="dailyNew" aria-label="Target new lessons per day">${[2,3,5,8,10,15].map(n=>`<option value="${n}" ${n===s.dailyNew?'selected':''}>${n} lessons</option>`).join('')}</select></div></section>
 <section class="simple-panel"><h2>Optional placement check</h2><p>A six-question demo recognition check can suggest where to begin. It does not create mastery credit, mark lessons learned, or claim an official HSK level.</p><p>${state.placement?.status==='completed'?'Completed · '+state.placement.answers.filter(a=>a.correct).length+'/6 correct':state.placement?.status==='active'?'In progress · '+state.placement.answers.length+'/6 answered':'Not completed'}</p>${action('placement-restart','Restart placement check','button outline')}</section>
 <section id="c9-settings-reading" class="simple-panel" tabindex="-1"><h2>Reading preferences</h2><div class="setting-row"><div><strong>Larger Chinese characters throughout</strong><p>Increase Hanzi sizes in lessons, reviews and reading without exposing answers.</p></div><label class="toggle"><input type="checkbox" data-setting="hanziLarge" ${s.hanziLarge?'checked':''}><span>Large</span></label></div><div class="setting-row"><div><strong>Larger Chinese text in readings</strong><p>Adjust story reading without changing the assessment answer.</p></div><label class="toggle"><input type="checkbox" data-setting="readingLarge" ${s.readingLarge?'checked':''}><span>Large</span></label></div></section><section class="simple-panel"><h2>Session recovery</h2><p>Your saved vocabulary wordbook contains ${(state.bookmarkedWords||[]).length} entries. ${(state.dialogueEvents||[]).length} dialogue and ${(state.wordPracticeEvents||[]).length} wordbook attempts, plus ${(state.senseEvents||[]).length} contextual-sense, ${(state.sentenceEvents||[]).length} sentence-building, and ${(state.missionEvents||[]).length} conversation-mission attempts are included in JSON backups. Each completed mixed-practice answer is saved transactionally together with the current session position. Backups include an unfinished guided session, and older backups with no session remain valid.</p><p>${state.practiceSession?`Guided practice checkpoint: ${state.practiceSession.cursor} of ${state.practiceSession.limit} answered.`:'No unfinished guided session.'}</p>${state.practiceSession?action('open-practice','Resume saved session →','button outline'):''}</section>
 <div id="c9-settings-recovery" tabindex="-1">${recoveryCenterPanel()}</div><section id="c9-settings-data" class="simple-panel" tabindex="-1"><h2>Your learning data</h2><p>Export a JSON backup before switching browsers or clearing site storage. A local browser database cannot protect against device failure.</p><div class="button-row">${action('export','Export backup','button primary')}${action('import-open','Import backup','button outline')}${action('reset','Reset demo progress','button danger')}</div><input id="import-file" type="file" accept="application/json,.json" hidden><div class="button-row">${action('storage-check','Check local storage status','button outline')}</div><p class="muted">Local data revision: ${state.revision} · Browser storage is not a permanent backup.</p><p id="storage-detail" class="muted">${db?'IndexedDB connected. Completed writes are confirmed transactionally.':'Storage unavailable: lessons and reviews cannot be saved.'}</p></section>${backupPreviewPanel()}
 <section id="c9-settings-curriculum" class="simple-panel" tabindex="-1"><h2>Curriculum status</h2><p><strong>Available:</strong> ${DEMO_LESSONS.length} original, author-written Mandarin demonstration lessons, not independently verified as official exam content.</p><p><strong>Not installed:</strong> Official 2025 HSK character and vocabulary inventories, approved audio libraries, and certified examination preparation.</p><p class="muted">No external analytics, cloud services, accounts, or remote curriculum downloads are used by this build.</p></section>`}
function applySettings(){
 const dark=Boolean(state.settings.dark);
 document.documentElement.dataset.theme=dark?'dark':'light';
 document.documentElement.dataset.hanziSize=state.settings.hanziLarge?'large':'normal';
 // Browser toolbar matches the existing, owner-stored theme preference.
 const chromeTheme=document.querySelector('meta[name="theme-color"]');
 if(chromeTheme)chromeTheme.setAttribute('content',dark?'#10191C':'#F8F7F3');
}
function c9FindContext(){return {query:p30Query,kind:p30Kind,saved:p30Saved,page:p30Page,state};}
function refreshC9FindWorkbench(){
 const panel=$('c9-search-assist');
 if(panel)panel.outerHTML=renderC9SearchAssist(state,c9FindContext(),action,esc);
}
function c9CurrentSourceIdForTrail(trail){
 if(!trail)return null;
 if(trail.kind==='characters')return c9LearnDetail?displayLessonId:null;
 if(trail.kind==='words')return searchSelection?.type==='word'?searchSelection.id:null;
 if(trail.kind==='grammar')return selectedGrammarId();
 if(trail.kind==='sentences')return selectedLibraryId();
 if(trail.kind==='reading')return storyId;
 if(trail.kind==='dialogues')return dialogueId;
 if(trail.kind==='pathway')return pathwaySelection()?.id||pathwaySelected;
 if(trail.kind==='advanced')return c9AdvancedSelected?'p'+c9AdvancedPhase+':'+c9AdvancedSelected:null;
 return null;
}
function c9SourceReturnMarkup(){
 if(!c9DiscoveryTrail)return '';
 const current=route(),trail=c9DiscoveryTrail;
 if(current!==trail.route&&current!==trail.origin){
  // Preserve Find → original Advanced source → canonical native exercise
  // while the verified C9-28 handoff remains active. Never show a stale
  // Find return on an unrelated destination.
  if(trail.kind==='advanced'&&c9NativeTrail?.origin==='advanced'&&
   c9NativeTrail.targetRoute===current)return '';
  c9DiscoveryTrail=null;return '';
 }
 if(current===trail.route){
  const activeId=c9CurrentSourceIdForTrail(trail);
  // A closed Advanced detail or changed native selection is no longer
  // the exact original source. Do not expose a misleading return banner.
  if(activeId!==trail.id){c9DiscoveryTrail=null;return '';}
 }
 return renderC9SourceReturn(trail,current,action,esc);
}
function rememberC9NativeHandoff(origin,targetRoute,targetId,title){
 if(!['writing','advanced','skills'].includes(origin)||!targetRoute||!targetId)return;
 c9NativeTrail={origin,targetRoute,targetId,title:String(title||'Original source'),
  sourceId:origin==='writing'?c9WritingState.unitId:origin==='skills'?c9SkillsUi.sourceId:c9AdvancedSelected};
 if(origin!=='advanced'||c9DiscoveryTrail?.kind!=='advanced')
  c9DiscoveryTrail=null;
}
function currentC9NativeTarget(routeName){
 if(routeName==='learn')return c9LearnDetail?displayLessonId:null;
 if(routeName==='grammar')return selectedGrammarId();
 if(routeName==='stories')return storyId;
 if(routeName==='dialogues')return dialogueId;
 if(routeName==='workshop')return sentenceTask(sentenceIndex)?.id||null;
 if(routeName==='explore')return searchSelection?.type==='word'?searchSelection.id:null;
 if(routeName==='advanced')return c9AdvancedSelected;
 return null;
}
function c9NativeContinuationMarkup(){
 const current=route();let banner='';
 if(c9NativeTrail){
  const trail=c9NativeTrail,validTarget=current===trail.targetRoute &&
   currentC9NativeTarget(current)===trail.targetId;
  if(validTarget)banner=renderC9NativeHandoff(trail,action,esc);
  else if(current!==trail.origin)c9NativeTrail=null;
 }
 return banner+renderC9DraftContinuation(hasC9UncopiedWriting(),current,action,esc);
}
function c9AdvancedUi(){return {phase:c9AdvancedPhase,query:c9AdvancedQuery,page:c9AdvancedPage,selected:c9AdvancedSelected,translation:c9AdvancedTranslation};}
function refreshC9AdvancedResults(){
 const target=root.querySelector('#c9-advanced-results');if(!target)return;
 const template=document.createElement('template');
 template.innerHTML=renderC9AdvancedWorkspace(state,c9AdvancedUi(),action,esc);
 const next=template.content.querySelector('#c9-advanced-results');
 if(next)target.innerHTML=next.innerHTML;
}
function renderAdvanced(){return renderC9AdvancedWorkspace(state,c9AdvancedUi(),action,esc);}
function renderSkills(){return renderC9SkillsWorkspace(state,c9SkillsUi,action,esc);}
function renderWriting(){return (c9WriterMatchesSkillBridge(c9SkillWritingHandoff)?
 renderC9SkillWritingReturn(c9SkillWritingHandoff,action,esc):'')+
 renderC9WritingWorkspace(state,c9WritingState,action,esc);}
function renderFind(){const ui=c9FindContext();return '<div class="c9-search-page">'+
  renderC9SearchIntro(state,ui,action,esc)+
  '<div class="c9-search-native" id="c9-original-search" tabindex="-1">'+unifiedSearchPage(ui,action,esc,()=>'',()=> '')+'</div></div>';}

function render(){const sameSource=c9RenderedHash===location.hash;
 const focusSnapshot=sameSource?captureC9Focus(root):null;
 // C9-41 introduced collapsible original learning sections. A native
 // same-route render rebuilds root.innerHTML, otherwise closing the active
 // course or Home disclosure on an unrelated update. Keep only UI visibility
 // in this tab; never persist a source selection or learner answer.
 const openDisclosures=sameSource?C9_NATIVE_DISCLOSURE_CLASSES.filter(name=>
  root.querySelector('details.'+name)?.open):[];
 c9RenderedRoute=route();
 disconnectC9Writing();disconnectC9PersonalTextReader();navUpdate();applySettings();const pages={today:renderToday,learn:renderLearn,character:renderCharacter,review:renderReview,explore:renderExplore,progress:renderProgress,settings:renderSettings,reader:renderReader,stories:renderStories,practice:renderPractice,dialogues:renderDialogues,wordbook:renderWordbook,senses:renderSenses,workshop:renderWorkshop,journey:renderJourney,ladder:renderLadder,block:renderBlock,fluency:renderFluency,plan:renderPlan,pinyin:()=>renderPinyinScreen({section:pinyinSection,filter:pinyinFilter,index:pinyinIndex,typed:pinyinTyped,feedback:pinyinFeedback,selectedSound:pinyinSound,selectedSyllable:pinyinSyllable},action,esc,title,gated),grammar:renderGrammar,sentences:renderSentences,pathway:renderPathway,find:renderFind,advanced:renderAdvanced,writing:renderWriting,skills:renderSkills};root.innerHTML=renderC9ContextNav(route(),esc)+((route()==='today')?'':hubResumeStrip())+c9SourceReturnMarkup()+c9NativeContinuationMarkup()+renderC9Secondary(route(),state,pages[route()](),action,esc);
 for(const name of openDisclosures){
  const disclosure=root.querySelector('details.'+name);
  if(disclosure)disclosure.open=true;
 }
 if(!db){const buttons=root.querySelectorAll('[data-action="plan-minutes"],[data-action="plan-focus"],[data-action="plan-pin"],[data-action="fluency-start"],[data-action="fluency-answer"],[data-action="fluency-hint"],[data-action="fluency-reveal"],[data-action="fluency-next"],[data-action="fluency-abandon"],[data-action="trail-start"],[data-action="trail-hint"],[data-action="trail-answer"],[data-action="trail-reveal"],[data-action="trail-next"],[data-action="block-start"],[data-action="block-launch"],[data-action="block-advance"],[data-action="block-abandon"],[data-action="mark-studied"],[data-action="grade"],[data-action="reset"],[data-action="import-open"],[data-action="guided-start"],[data-action="guided-answer"],[data-action="guided-check"],[data-action="guided-reveal"],[data-action="guided-next"],[data-action="guided-end"],[data-action="guided-abandon"],[data-action="placement-start"],[data-action="placement-restart"],[data-action="placement-answer"],[data-action="placement-skip"],[data-action="course-start"],[data-action="course-hint"],[data-action="course-answer"],[data-action="course-advance"],[data-action="course-finish"],[data-action="course-abandon"],[data-action="course-repair-start"],[data-action="repair-answer"],[data-action="repair-hint"],[data-action="repair-reveal"],[data-action="repair-next"],[data-action="repair-abandon"],[data-action="lesson-check-choice"],[data-action="lesson-check-submit"],[data-action="word-bookmark"],[data-action="dialogue-answer"],[data-action="dialogue-reveal"],[data-action="wordbook-answer"],[data-action="wordbook-reveal"],[data-action="sense-answer"],[data-action="sense-reveal"],[data-action="mission-answer"],[data-action="mission-reveal"],[data-action="workshop-check"],[data-action="workshop-reveal"]');buttons.forEach(b=>{b.disabled=true;b.title='Local persistence unavailable';})}connectC9Writing(root);connectC9PersonalTextReader(root,esc);c9RenderedHash=location.hash;restoreC9Focus(root,focusSnapshot); }
function go(page,answerConfirmed=false){
 const target='#/'+page;
 // Keep the existing same-route refresh behavior for legacy native
 // actions; source-switch adapters decide separately when to preserve input.
 if(location.hash===target){render();return true;}
 const from=c9RenderedRoute;
 if((from!==page||(from==='pathway'&&location.hash!==target))&&!answerConfirmed&&!c9ConfirmLeaveNativeAnswer(from))return false;
 if(from==='pathway'&&location.hash!==target)pathwayTransferDraft='';
 c9ApprovedDeparture={from,to:page};
 location.hash=target;return true;
}
/** Open an ORIGINAL sentence task; this is a navigation adapter, never a
 * duplicate sentence evaluator or a learner-state writer. */
function c9OpenNativeWorkshopTask(index,assisted=false){
 if(!Number.isInteger(index)||index<0||index>=SENTENCE_TASKS.length)return false;
 if(route()==='workshop'&&sentenceIndex===index)return true;
 if(route()==='workshop'&&!c9ConfirmLeaveNativeAnswer('workshop'))return false;
 if(route()!=='workshop'&&!go('workshop'))return false;
 sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
 sentenceSupport=Boolean(assisted);
 render();return true;
}
async function mutate(fn,{renderAfter=true}={}){if(!db){alertUser('Changes cannot be saved. This browser does not provide a working local database.','error');return false}if(busy)return false;busy=true;try{state=await updateState(db,fn);channel?.postMessage('data-changed');clearAlert();if(renderAfter)render();return true}catch(e){alertUser(`Not saved: ${e.message}`,'error');return false}finally{busy=false}}
/* C9-48: one cancellable controller for the original device voice actions.
 * No network TTS, recordings, transcription, listening grades or new state. */
let c9SpeechGeneration=0;
function stopC9Speech(notify=false){
 c9SpeechGeneration++;
 try{window.speechSynthesis?.cancel();}catch{}
 if(notify){alertUser('Chinese audio stopped. Learning progress is unchanged.');announceC9Interaction('Chinese audio stopped.');}
}
function c9SelectMandarinVoice(voices){
 const available=Array.from(voices||[]).filter(v=>String(v.lang||'').toLowerCase().startsWith('zh'));
 return available.find(v=>String(v.lang).toLowerCase().startsWith('zh-cn'))||available[0]||null;
}
async function c9AwaitMandarinVoice(synthesis){
 const existing=c9SelectMandarinVoice(synthesis.getVoices());
 if(existing)return existing;
 // Chromium and mobile browsers may populate local voices after a gesture.
 // Waiting is bounded; absence remains unavailable, never simulated.
 if(typeof synthesis.addEventListener!=='function')return null;
 await new Promise(resolve=>{
  let timer;
  const done=()=>{clearTimeout(timer);synthesis.removeEventListener('voiceschanged',done);resolve();};
  synthesis.addEventListener('voiceschanged',done,{once:true});
  timer=setTimeout(done,1200);
 });
 return c9SelectMandarinVoice(synthesis.getVoices());
}
async function speak(text,rate=demoSpeechRate){
 const phrase=String(text||'').trim();
 if(!phrase)return alertUser('No original Chinese text is available to play.','error');
 if(!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance!=='function')
  return alertUser('Speech playback is unavailable in this browser. The written source remains available.','error');
 stopC9Speech();
 const request=c9SpeechGeneration;
 const synthesis=window.speechSynthesis;
 let voice;
 try{voice=await c9AwaitMandarinVoice(synthesis);}
 catch{if(request===c9SpeechGeneration)alertUser('The device speech list could not be loaded. Read the Chinese source instead.','error');return;}
 if(request!==c9SpeechGeneration)return;
 if(!voice)return alertUser('No Mandarin speech voice is installed. Playback is unavailable; the original text remains accessible.','error');
 const utt=new SpeechSynthesisUtterance(phrase);
 utt.voice=voice;utt.lang=voice.lang;utt.rate=Number.isFinite(rate)?Math.max(.55,Math.min(1.4,rate)):demoSpeechRate;
 utt.onstart=()=>{if(request===c9SpeechGeneration){alertUser('Playing device Mandarin speech ('+utt.rate.toFixed(2)+'×), not a certified source recording.');announceC9Interaction('Chinese speech playing.');}};
 utt.onend=()=>{if(request===c9SpeechGeneration)announceC9Interaction('Chinese speech finished.');};
 utt.onerror=event=>{if(request===c9SpeechGeneration&&!['canceled','interrupted'].includes(event.error)){
  alertUser('The device could not play Mandarin speech. Use the written original source instead.','error');}};
 try{synthesis.speak(utt);}
 catch{if(request===c9SpeechGeneration)alertUser('Speech playback failed on this device. The original Chinese text remains available.','error');}
}
async function act(button){const name=button.dataset.action,id=button.dataset.id;

 const handledWriting=await handleC9WritingAction(button,{
  go,render,alertUser,speak,act,currentRoute:route,
  rememberHandoff:(targetRoute,targetId)=>rememberC9NativeHandoff(
   'writing',targetRoute,targetId,c9WritingState.unitId),
  setWorkshopTask:(taskId,assisted)=>{
   const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
   if(index<0){alertUser('Original writing exercise unavailable.','error');return false;}
   return c9OpenNativeWorkshopTask(index,assisted);
  },
  openAdvanced:(phase,sourceId)=>{
   if(!findC9AdvancedPhase(phase)?.records.some(x=>x.id===sourceId)){
    alertUser('Original scenario unavailable.','error');return false;
   }
   // A declined departure must not replace the current Advanced selection.
   if(route()!=='advanced'&&!go('advanced'))return false;
   c9AdvancedPhase=phase;c9AdvancedSelected=sourceId;c9AdvancedQuery='';c9AdvancedPage=0;
   render();return true;
  }
 });
 if(handledWriting){
  // Only commit a source-return link after the original P43 unit/source
  // actually changed. Declining a source replacement retains the old link.
  if(name==='p43-stay')c9PendingSkillWritingHandoff=null;
  if(name==='p43-switch-confirm'){
   if(c9WriterMatchesSkillBridge(c9PendingSkillWritingHandoff)){
    c9SkillWritingHandoff=c9PendingSkillWritingHandoff;
    render(); // The existing P43 controller rendered before confirming the bridge.
   }
   c9PendingSkillWritingHandoff=null;
  }
  return;
 }

 if(name==='c9-offline-repair'){
  if(!navigator.onLine){alertUser('Reconnect to prepare original offline assets.','error');return false;}
  if(!navigator.serviceWorker?.controller){
   alertUser('Offline installation is not active. Reload this page online, then try again.','error');
   return false;
  }
  await verifyC9OfflineShell('c9-offline-repair');
  alertUser(c9OfflineShell==='ready'?
   'The current service worker reports all original static source assets cached. Offline exercise behavior remains device-dependent.':
   c9OfflineShell==='outdated'?
   'A previous offline version still controls this tab. Save or export any private P43 writing, then reload online to finish updating. Your browser learning records were not modified.':
   'Offline source repair could not be confirmed. Reconnect and try again; progress was not changed.',
   c9OfflineShell==='ready'?'info':'error');
  return c9OfflineShell==='ready';
 }
 if(name==='c9-native-handoff-return'){
  if(!c9NativeTrail||!c9ConfirmLeaveNativeAnswer()||route()!==c9NativeTrail.targetRoute||
   currentC9NativeTarget(route())!==c9NativeTrail.targetId)return;
  const previous=c9NativeTrail;c9NativeTrail=null;
  const target=previous.origin;
  if(target==='skills'){
   c9ReturnFocus='c9-skills-active';
   return go('skills',true);
  }
  if(target==='advanced'){
   c9ReturnFocus='c9-advanced-detail';
   return go('advanced',true);
  }
  if(target==='writing'){
   c9ReturnFocus=c9WritingState.step==='plan'?'c9-transfer-title':
    c9WritingState.step==='compose'||c9WritingState.step==='revise'?'p43-draft':null;
   return go('writing',true);
  }
  return;
 }
 if(name==='c9-native-resume-writing'){
  if(!hasC9UncopiedWriting()||!c9ConfirmLeaveNativeAnswer())return;
  c9NativeTrail=null;
  c9ReturnFocus=c9WritingState.step==='compose'||c9WritingState.step==='revise'?'p43-draft':null;
  return go('writing',true);
 }
 if(name==='c9-skills-return-writing'){
  if(!c9SkillWritingHandoff)return false;
  const previous=c9SkillWritingHandoff;
  if(!go('skills'))return false;
  c9SkillWritingHandoff=null;
  if(c9SkillPhaseInTrack(c9SkillsUi.track,previous.phase)&&
   c9SkillSource(previous.phase,previous.sourceId)){
   c9SkillsUi.phase=previous.phase;c9SkillsUi.sourceId=previous.sourceId;
  }
  c9ReturnFocus='c9-skills-active';render();return true;
 }
 if(name==='c9-skills-track'){
  const t=c9SkillTrack(button.dataset.track);if(!t)return;
  Object.assign(c9SkillsUi,{track:t.id,phase:t.phases[0],sourceId:null,
   stage:c9SkillStageId(t.phases[0],null),query:'',page:0,phaseOnly:false,support:false});
  render();root.querySelector('#c9-skills-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-skills-phase'){
  const phase=Number(button.dataset.phase);
  if(!c9SkillPhaseInTrack(c9SkillsUi.track,phase))return;
  c9SkillsUi.phase=phase;c9SkillsUi.phaseOnly=true;c9SkillsUi.page=0;
  c9SkillsUi.sourceId=null;c9SkillsUi.support=false;
  c9SkillsUi.stage=c9SkillStageId(phase,null);render();return;
 }
 if(name==='c9-skills-all'){
  c9SkillsUi.phaseOnly=false;c9SkillsUi.page=0;render();return;
 }
 if(name==='c9-skills-source'||name==='c9-skills-continue'){
  if(!selectC9SkillSource(button.dataset.phase,id))return;
  render();
  const panel=root.querySelector('#c9-skills-active');
  if(panel){panel.scrollIntoView({block:'start'});panel.focus({preventScroll:true});}
  return;
 }
 if(name==='c9-skills-page'){
  const dir=Number(button.dataset.dir);if(![-1,1].includes(dir))return;
  c9SkillsUi.page=Math.max(0,c9SkillsUi.page+dir);render();
  root.querySelector('#c9-skills-query')?.scrollIntoView({block:'nearest'});return;
 }
 if(name==='c9-skills-dismiss'){
  c9SkillsUi.sourceId=null;c9SkillsUi.support=false;render();
  root.querySelector('#c9-skills-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-skills-stage'||name==='c9-skills-step'){
  const stages=c9SkillStages(c9SkillsUi.phase);
  let chosen=name==='c9-skills-stage'?button.dataset.stage:null;
  if(name==='c9-skills-step'){
   const dir=Number(button.dataset.dir);
   if(![-1,1].includes(dir))return;
   const at=stages.findIndex(x=>x.id===c9SkillsUi.stage);
   chosen=stages[at+dir]?.id;
  }
  if(!chosen||!stages.some(x=>x.id===chosen)||!c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId))return;
  c9SkillsUi.stage=chosen;render();
  root.querySelector('#c9-skills-active')?.focus({preventScroll:true});return;
 }
 if(name==='c9-skills-support'){
  if(!c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId))return;
  c9SkillsUi.support=!c9SkillsUi.support;render();return;
 }
 if(name==='c9-skills-voice'){
  const source=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  if(!source)return;
  const index=Number(button.dataset.index);if(!Number.isInteger(index)||index<0)return;
  let lines=c9AdvancedSourceLines(source);
  if(button.dataset.audio==='listening'){
   const dialogue=DIALOGUES.find(d=>d['p'+c9SkillsUi.phase]?.readingId===source.id||
    d['p'+c9SkillsUi.phase]?.id===source.id);
   lines=dialogue?.lines?.length?dialogue.lines:
    Array.isArray(source.turns)&&source.turns.length?source.turns:lines;
  }
  if(index<lines.length&&lines[index]?.hanzi)return speak(lines[index].hanzi);
  return;
 }
 if(name==='c9-skills-related-source'){
  const current=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  const originalPhase=findC9AdvancedPhase(button.dataset.phase);
  const original=originalPhase?.records.find(x=>x.id===id);
  if(!current||!original||current.sourceType!=='p'+originalPhase.phase||
   current.sourceId!==id)return alertUser('Original source link is unavailable.','error');
  // Preserve the selected Skill Path while visiting the exact prior P44–P48
  // evidence. Returning does not fabricate learning evidence or a new result.
  if(!go('advanced'))return;
  c9AdvancedPhase=originalPhase.phase;c9AdvancedSelected=id;
  c9AdvancedQuery='';c9AdvancedPage=0;c9AdvancedTranslation=false;
  rememberC9NativeHandoff('skills','advanced',id,
   current.title||current.hanzi||current.id);
  return;
 }
 if(name==='c9-skills-word'){
  const source=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  if(!source||!WORDS.some(w=>w.key===id))return false;
  const opened=await act({dataset:{action:'lookup-word',id}});
  if(opened===false)return false;
  rememberC9NativeHandoff('skills','explore',id,source.title||source.hanzi||source.id);
  render();
  return true;
 }
 if(name==='c9-skills-grammar'){
  const source=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  if(!source||!source.grammarIds?.includes(id)||!findGrammarLesson(id))return false;
  const opened=await act({dataset:{action:'grammar-select',id}});
  if(opened===false)return false;
  rememberC9NativeHandoff('skills','grammar',id,source.title||source.hanzi||source.id);
  render();
  return true;
 }
 if(name==='c9-skills-writing'){
  const source=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  const unit=source&&c9WritingLinkedUnit(c9SkillsUi.phase,source.id);
  if(!unit)return alertUser('No original P43 writing unit is linked to this source.','error');
  // Secure the departure before assigning source-return UI. The original
  // P43 handler operates on the one existing editor after navigation succeeds.
  if(!go('writing'))return;
  const proposed={phase:c9SkillsUi.phase,sourceId:source.id,
   title:source.title||source.hanzi||source.id};
  await act({dataset:{action:'c9-writing-source',id:source.id,phase:String(c9SkillsUi.phase)}});
  if(c9WriterMatchesSkillBridge(proposed)){
   c9SkillWritingHandoff=proposed;c9PendingSkillWritingHandoff=null;
   render();
  }else if(c9WritingState.pending==='switch'){
   c9PendingSkillWritingHandoff=proposed;
  }
  return;

 }
 if(name==='c9-skills-native'){
  const source=c9SkillSource(c9SkillsUi.phase,c9SkillsUi.sourceId);
  const linked=source&&c9SkillLinks(c9SkillsUi.phase,source).find(l=>
   l.id===id&&l.kind===button.dataset.kind);
  if(!linked){alertUser('Original native source not available for this case.','error');return false;}
  const destination={lesson:'learn',grammar:'grammar',story:'stories',
   dialogue:'dialogues',workshop:'workshop'}[linked.kind];
  if(!destination)return false;
  // The original controller validates and authorizes its own navigation.
  // Opening a destination first could strand the learner on the wrong page
  // when a source ID or unsent-answer guard rejected the selection.
  if(linked.kind==='workshop'){
   const index=SENTENCE_TASKS.findIndex(x=>x.id===id);
   if(index<0)return false;
   if(route()==='workshop'&&sentenceIndex!==index&&
      !c9ConfirmLeaveNativeAnswer('workshop'))return false;
   if(route()!=='workshop'&&!go('workshop'))return false;
   sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
   sentenceSupport=Boolean(c9SkillsUi.support);
  }else{
   const actionName={lesson:'c9-lesson-open',grammar:'grammar-select',
    story:'c9-media-open-story',dialogue:'c9-media-open-dialogue'}[linked.kind];
   if(!actionName||await act({dataset:{action:actionName,id}})!==true)return false;
   if(linked.kind==='story'&&c9SkillsUi.support){
    storyAssist=true;storyShowTranslation=true;c9StoryEnglish=true;
   }
   if(linked.kind==='dialogue'&&c9SkillsUi.support)dialogueSupport=true;
  }
  rememberC9NativeHandoff('skills',destination,id,
   source.title||source.hanzi||source.id);
  render();
  return true;
 }
 if(name==='c9-advanced-phase'){
  const phase=findC9AdvancedPhase(button.dataset.phase);if(!phase)return;
  c9AdvancedPhase=phase.phase;c9AdvancedQuery='';c9AdvancedPage=0;
  c9AdvancedSelected=null;c9AdvancedTranslation=false;render();
  root.querySelector('#c9-advanced-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-advanced-source'){
  const phase=findC9AdvancedPhase(c9AdvancedPhase);
  if(!phase?.records.some(x=>x.id===id))return;
  c9AdvancedSelected=id;c9AdvancedTranslation=false;render();
  const focus=root.querySelector('#c9-advanced-detail');
  if(focus){focus.scrollIntoView({block:'start',behavior:'auto'});focus.focus({preventScroll:true});}
  return;
 }
 if(name==='c9-advanced-close'){
  c9AdvancedSelected=null;c9AdvancedTranslation=false;render();
  root.querySelector('#c9-advanced-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-advanced-prev'||name==='c9-advanced-next'){
  const phase=findC9AdvancedPhase(c9AdvancedPhase);
  const matches=c9AdvancedFiltered(phase,c9AdvancedQuery);
  const last=Math.max(0,Math.ceil(matches.length/9)-1);
  c9AdvancedPage=Math.min(last,Math.max(0,c9AdvancedPage+(name==='c9-advanced-next'?1:-1)));
  render();root.querySelector('#c9-advanced-catalog-title')?.scrollIntoView({block:'start'});return;
 }
 if(name==='c9-advanced-translation'){
  if(!findC9AdvancedPhase(c9AdvancedPhase)?.records.some(x=>x.id===c9AdvancedSelected))return;
  c9AdvancedTranslation=!c9AdvancedTranslation;render();return;
 }
 if(name==='c9-advanced-voice'){
  const source=findC9AdvancedPhase(c9AdvancedPhase)?.records.find(x=>x.id===c9AdvancedSelected);
  if(!source)return;
  const i=Number(button.dataset.index),lines=c9AdvancedSourceLines(source);
  if(!Number.isInteger(i)||i<0||i>=Math.min(lines.length,24)||!lines[i].hanzi)return;
  return speak(lines[i].hanzi);
 }
 if(name==='c9-advanced-native'){
  const phase=findC9AdvancedPhase(c9AdvancedPhase);
  const source=phase?.records.find(x=>x.id===c9AdvancedSelected);
  const link=source&&c9AdvancedNativeLinks(phase,source).find(l=>
   l.kind===button.dataset.kind&&l.id===id);
  if(!link){alertUser('This original source activity is unavailable.','error');return false;}
  const destination={lesson:'learn',grammar:'grammar',story:'stories',
   dialogue:'dialogues',workshop:'workshop'}[link.kind];
  if(!destination)return false;
  if(link.kind==='workshop'){
   const index=SENTENCE_TASKS.findIndex(t=>t.id===link.id);
   if(index<0)return false;
   if(route()==='workshop'&&sentenceIndex!==index&&
      !c9ConfirmLeaveNativeAnswer('workshop'))return false;
   if(route()!=='workshop'&&!go('workshop'))return false;
   sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
   sentenceSupport=Boolean(c9AdvancedTranslation);
  }else{
   const actionName={lesson:'c9-lesson-open',grammar:'grammar-select',
    story:'c9-media-open-story',dialogue:'c9-media-open-dialogue'}[link.kind];
   if(!actionName||await act({dataset:{action:actionName,id:link.id}})!==true)return false;
  }
  rememberC9NativeHandoff('advanced',destination,link.id,
   source.title||source.hanzi||source.id);
  render();
  return true;
 }
 if(name==='c9-integrate-return'){
  if(!c9DiscoveryTrail)return;
  const from=c9DiscoveryTrail.origin;
  if(!['learn','find'].includes(from))return;
  if(!go(from))return;
  c9DiscoveryTrail=null;
  if(from==='learn'){c9LearnDetail=false;render();}
  if(from==='find')c9SearchFocusPending=true;
  return;
 }
 if(name==='c9-integrate-lesson'||name==='c9-integrate-reading'||name==='c9-integrate-dialogue'){
  const nativeAction={
   'c9-integrate-lesson':'c9-lesson-open',
   'c9-integrate-reading':'c9-media-open-story',
   'c9-integrate-dialogue':'c9-media-open-dialogue'
  }[name];
  const available=name==='c9-integrate-lesson'?findLesson(id):
   name==='c9-integrate-reading'?findStory(id):findDialogue(id);
  if(!available){alertUser('Original linked source unavailable.','error');return false;}
  const opened=await act({dataset:{action:nativeAction,id}});
  if(opened===true)c9DiscoveryTrail=null;
  return opened;
 }
 if(name==='c9-integrate-review'){
  if(!go('review'))return false;
  c9DiscoveryTrail=null;return true; // Native due-only scheduler remains authoritative.
 }

 if(name==='c9-find-reset'){
  p30Query='';p30Kind='all';p30Saved=false;p30Page=0;
  render();root.querySelector('#p30-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-find-focus'){
  const input=root.querySelector('#p30-query');
  input?.scrollIntoView({block:'nearest',behavior:'auto'});input?.focus({preventScroll:true});return;
 }
 if(name==='c9-find-type'){
  const kind=button.dataset.kind;
  if(!FIND_CATEGORIES.some(([key])=>key===kind))return;
  p30Kind=kind;p30Page=0;render();
  root.querySelector('#p30-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-find-example'){
  const kind=button.dataset.kind,query=button.dataset.query;
  if(!FIND_CATEGORIES.some(([key])=>key===kind)||typeof query!=='string'||query.length>120)return;
  const source=courseSearch({query,kind,saved:false,state}).some(x=>x.kind===kind&&(x.title===query||x.title.includes(query)));
  if(!source)return alertUser('This original source is unavailable.','error');
  p30Query=query;p30Kind=kind;p30Saved=false;p30Page=0;render();
  const input=root.querySelector('#p30-query');input?.scrollIntoView({block:'nearest',behavior:'auto'});
  input?.focus({preventScroll:true});announceC9Interaction('Searching the original '+kind+' sources for '+query+'.');return;
 }
 if(name==='c9-find-saved'){
  p30Saved=!p30Saved;p30Page=0;render();
  root.querySelector('#p30-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-progress-source'){
  if(!findLesson(id))return alertUser('Original lesson unavailable.','error');
  return act({dataset:{action:'open-lesson',id}});
 }
 if(name==='c9-tool-jump'){
  const native=root.querySelector('#c9-original-tool');
  if(native){native.scrollIntoView({block:'start',behavior:'auto'});native.focus({preventScroll:true});}
  return;
 }
 if(name==='c9-settings-target'){
  const target=button.dataset.target;
  if(!['c9-settings-study','c9-settings-reading','c9-settings-recovery','c9-settings-data','c9-settings-curriculum'].includes(target))return;
  const section=root.querySelector('#'+target);
  if(!section)return;
  section.scrollIntoView({block:'start',behavior:'auto'});
  section.focus({preventScroll:true});
  return;
 }


 if(name==='c9-media-focus-native'){
  const target=button.dataset.target;
  if(!['c9-native-dialogue','c9-native-reading'].includes(target))return;
  const section=root.querySelector('#'+target);
  if(section){section.scrollIntoView({block:'start',behavior:'auto'});section.focus({preventScroll:true});}return;
 }
 if(name==='c9-media-reset'){
  const kind=button.dataset.kind;
  if(kind==='reading'){c9ReadingQuery='';c9ReadingFilter='all';c9ReadingPage=0;refreshC9MediaCatalog('reading');}
  else if(kind==='dialogue'){c9DialogueQuery='';c9DialogueFilter='all';c9DialoguePage=0;refreshC9MediaCatalog('dialogue');}
  else return;
  const input=root.querySelector('#c9-'+kind+'-query'),filter=root.querySelector('#c9-'+kind+'-filter');
  if(input){input.value='';input.focus({preventScroll:true});}
  if(filter)filter.value='all';
  return;
 }
 if(name==='c9-media-page'){
  const delta=Number(button.dataset.delta),kind=button.dataset.kind;
  if(![-1,1].includes(delta))return;
  if(kind==='reading')c9ReadingPage=Math.max(0,c9ReadingPage+delta);
  else if(kind==='dialogue')c9DialoguePage=Math.max(0,c9DialoguePage+delta);
  else return;
  refreshC9MediaCatalog(kind);
  root.querySelector('#c9-'+kind+'-results')?.scrollIntoView({block:'nearest',behavior:'auto'});
  return;
 }
 if(name==='c9-media-reading-line'||name==='c9-media-reading-jump'){
  const story=findStory(storyId);if(!story)return;
  const delta=Number(button.dataset.dir),base=storyFocusIndex<0?(delta===-1?1:-1):storyFocusIndex;
  const next=name==='c9-media-reading-jump'?Number(button.dataset.index):Math.max(0,Math.min(story.lines.length-1,base+delta));
  if(!Number.isInteger(next)||next<0||next>=story.lines.length)return;
  storyFocusIndex=next;
  if(storyParagraphOnly&&story.extended)storyParagraph=paragraphFor(story,next);
  if(story.beginner&&beginnerPart!=='all')beginnerPart=String(Math.floor(next/3));
  render();
  const target=root.querySelector('[data-c9-story-line="'+next+'"]');
  target?.scrollIntoView({block:'nearest',behavior:'auto'});target?.focus({preventScroll:true});
  announceC9Interaction('Original sentence '+(next+1)+' of '+story.lines.length+' focused. No answer revealed or recorded.');return;
 }
 if(name==='c9-media-listen-whole'||name==='c9-media-listen-slow'){
  const d=findDialogue(dialogueId);if(!d)return;
  return speak(d.lines.map(line=>line.hanzi).join('。'),name==='c9-media-listen-slow'?0.68:demoSpeechRate);
 }
if(name==='c9-media-listen-turn'||name==='c9-media-listen-turn-slow'){
  const d=findDialogue(dialogueId),line=d?.lines[c9DialogueTurn];if(!line)return;
  return speak(line.hanzi,name==='c9-media-listen-turn-slow'?0.68:demoSpeechRate);
 }
  if(name==='c9-media-open-story'){
  const target=findStory(id);if(!target){alertUser('Original reading unavailable.','error');return false;}
  if(route()==='stories'&&storyId===target.id){
   root.querySelector('.story-paper')?.scrollIntoView({block:'start'});return true;
  }
  if(route()==='stories'&&!c9ConfirmLeaveNativeAnswer('stories'))return false;
  if(route()!=='stories'&&!go('stories'))return false;
  storyId=target.id;storyMode=target.beginner?'beginner-detail':'comprehension';
  storiesBeginnerOnly=false;storiesLongOnly=false;storiesOnlyBookmarked=false;
  resetReadingNavigation();render();
  root.querySelector('.story-paper')?.scrollIntoView({block:'start'});return true;
 }
 if(name==='c9-media-open-dialogue'){
  const target=findDialogue(id);if(!target){alertUser('Original conversation unavailable.','error');return false;}
  if(route()==='dialogues'&&dialogueId===target.id){
   root.querySelector('.dialogue-paper')?.scrollIntoView({block:'start'});return true;
  }
  if(route()==='dialogues'&&!c9ConfirmLeaveNativeAnswer('dialogues'))return false;
  if(route()!=='dialogues'&&!go('dialogues'))return false;
  dialogueId=target.id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;
  p34TranscriptViewed=false;p34ShadowLine=0;p33Branch=null;
  missionActive=false;missionFeedback=null;missionStep=0;missionSupport=false;
  c9DialogueSourceId=null;c9DialogueTurn=0;render();
  root.querySelector('.dialogue-paper')?.scrollIntoView({block:'start'});return true;
 }
 if(name==='c9-media-turn'){
  const dialogue=findDialogue(dialogueId);
  if(!dialogue)return;
  const delta=Number(button.dataset.dir);
  if(![-1,1].includes(delta))return;
  const next=Math.max(0,Math.min(dialogue.lines.length-1,c9DialogueTurn+delta));
  if(next===c9DialogueTurn)return;
  c9DialogueTurn=next;
  for(const el of root.querySelectorAll('[data-c9-turn-index]')){
   el.classList.toggle('is-c9-current',Number(el.dataset.c9TurnIndex)===next);
   el.setAttribute('aria-current',Number(el.dataset.c9TurnIndex)===next?'step':'false');
  }
  const bar=root.querySelector('.c9-media-turn-nav');
  if(bar){
   const strong=bar.querySelector('strong'),speaker=bar.querySelector('div:first-child>span');
   if(strong)strong.textContent='Turn '+(next+1)+' / '+dialogue.lines.length;
   if(speaker)speaker.textContent='Speaker '+dialogue.lines[next].speaker+' · navigation does not reveal hidden listening-first text';
   for(const control of bar.querySelectorAll('[data-action="c9-media-turn"]')){
     control.disabled=control.dataset.dir==='-1'?next===0:next===dialogue.lines.length-1;
   }
  }
  const target=root.querySelector('[data-c9-turn-index="'+next+'"]');
  target?.scrollIntoView({block:'nearest',behavior:'auto'});
  target?.focus({preventScroll:true});
  return;
 }
 if(name==='c9-story-pinyin'||name==='c9-story-english'){
  const next=name==='c9-story-pinyin'?!c9StoryPinyin:!c9StoryEnglish;
  if(name==='c9-story-pinyin')c9StoryPinyin=next;else c9StoryEnglish=next;
  if(next)storyAssist=true; // Once helped, the current reading response stays assisted.
  return render();
 }
 if(name==='c9-reader-character'){
  const lesson=findLesson(id);
  if(!lesson)return;
  displayLessonId=lesson.id;
  return go('character/'+lesson.id);
 }


 if(name==='c9-character-open'){
   const selected=findLesson(id);if(!selected)return alertUser('Character lesson unavailable.','error');
   displayLessonId=selected.id;c9CharacterShowTranslations=true;
   const target='#/character/'+selected.id;
   if(location.hash===target)render();else location.hash=target;
   return;
 }
 if(name==='c9-character-lesson'){
   const selected=findLesson(id);if(!selected)return;
   displayLessonId=selected.id;c9LearnDetail=true;c9LessonSection='overview';
   showLessonTranslation=state.settings.showPinyin;
   return go('learn');
 }
 if(name==='c9-character-reader'){
   const selected=findLesson(id);if(!selected)return;
   readerLessonId=selected.id;readerResult=null;showLessonTranslation=false;
   return go('reader');
 }
 if(name==='c9-character-support'){
   // Keep local ungraded handwriting mounted when checking the English gloss.
   c9CharacterShowTranslations=!c9CharacterShowTranslations;
   const page=root.querySelector('.c9-character-page');
   if(!page)return render();
   page.dataset.translations=String(c9CharacterShowTranslations);
   for(const node of page.querySelectorAll('.c9-character-sample-english,.c9-character-example-translation,.c9-character-word-gloss'))
     node.hidden=!c9CharacterShowTranslations;
   for(const node of page.querySelectorAll('.c9-character-example-hidden'))
     node.hidden=c9CharacterShowTranslations;
   button.setAttribute('aria-pressed',String(c9CharacterShowTranslations));
   button.textContent=c9CharacterShowTranslations?'Hide translations':'Show translations';
   return;
 }
 if(name==='c9-character-jump'){
   const section=button.dataset.section;
   if(!['overview','writing','vocabulary','sentences','connections'].includes(section))return;
   const target=root.querySelector('#c9-'+section);
   if(target){target.scrollIntoView({block:'start',behavior:'auto'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
   for(const nav of root.querySelectorAll('.c9-character-tabs [data-action="c9-character-jump"]')){
     const current=nav.dataset.section===section;
     nav.classList.toggle('is-current',current);
     if(current)nav.setAttribute('aria-current','location');else nav.removeAttribute('aria-current');
   }
   return;
 }
 if(name==='c9-word-reset'){
   c9WordQuery='';c9WordFilter='all';c9WordPage=0;
   if(route()==='wordbook'){
     refreshC9Words();
     const input=root.querySelector('#c9-word-query');
     if(input){input.value='';input.focus({preventScroll:true});}
   }else render();
   return;
 }
 if(name==='c9-word-open'){
  if(!findWord(id))return alertUser('Original vocabulary entry unavailable.','error');
  searchSelection={type:'word',id};exploreKind='words';exploreSavedOnly=false;
  searchQuery='';explorePage=0;
  return go('explore');
 }
 if(name==='c9-word-page'){
  const delta=Number(button.dataset.delta);
  if(![-1,1].includes(delta))return;
  c9WordPage=Math.max(0,c9WordPage+delta);
  refreshC9Words();
  root.querySelector('#c9-word-catalog')?.scrollIntoView({block:'nearest'});
  return;
 }
 if(name==='c9-sentence-topic'){
  const topic=SENTENCE_TOPICS.find(x=>x.id===id);if(!topic)return false;
  const first=SENTENCE_LIBRARY.find(x=>x.topicId===topic.id);
  if(!first||!openLibrarySentence(first.id))return false;
  libraryTopic=topic.id;libraryQuery='';libraryArea='all';libraryDifficulty='all';
  libraryGrammar='all';libraryPurpose='all';libraryTone='all';librarySource='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  render();return true;
 }
 if(name==='c9-sentence-all'){
  libraryTopic='all';libraryQuery='';libraryArea='all';libraryDifficulty='all';
  libraryGrammar='all';libraryPurpose='all';libraryTone='all';librarySource='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  return render();
 }
 if(name==='c9-lesson-jump'){
  const section=button.dataset.section;
  if(!c9LearnDetail||!C9_LESSON_SECTIONS.some(s=>s.id===section))return;
  c9LessonSection=section;
  for(const nav of root.querySelectorAll('.c9-lesson-sections [data-action="c9-lesson-jump"]')){
    const active=nav.dataset.section===section;
    nav.classList.toggle('is-current',active);
    if(active)nav.setAttribute('aria-current','location');else nav.removeAttribute('aria-current');
  }
  const target=document.getElementById('c9-lesson-'+section);
  if(target){target.scrollIntoView({block:'start',behavior:'auto'});target.focus({preventScroll:true});}
  return;
 }
 if(name==='c9-lesson-select'){
  const next=findLesson(id);
  if(!next){alertUser('Lesson unavailable.','error');return false;}
  if(c9LearnDetail&&displayLessonId!==next.id&&!c9ConfirmLeaveNativeAnswer('learn'))return false;
  if(c9LearnDetail&&displayLessonId===next.id)return true;
  displayLessonId=next.id;c9LearnDetail=true;c9LessonSection='overview';
  showLessonTranslation=state.settings.showPinyin;
  render();root.querySelector('.c9-lesson-header')?.scrollIntoView({block:'start'});
  root.querySelector('#c9-lesson-title')?.focus({preventScroll:true});return true;
 }
 if(name==='c9-learn-back'){
  if(!c9ConfirmLeaveNativeAnswer('learn'))return false;
  c9LearnDetail=false;render();
  root.querySelector('.c9-discovery-head')?.scrollIntoView({block:'start'});return true;
 }
 if(name==='c9-lesson-open'){
   if(!findLesson(id)){alertUser('Original character lesson unavailable.','error');return false;}
   if(route()==='learn'&&c9LearnDetail&&displayLessonId===id){
    root.querySelector('.c9-lesson-header')?.scrollIntoView({block:'start'});
    return true;
   }
   if(route()==='learn'&&displayLessonId!==id&&!c9ConfirmLeaveNativeAnswer('learn'))return false;
   if(route()!=='learn'&&!go('learn'))return false;
   displayLessonId=id;c9LearnDetail=true;showLessonTranslation=state.settings.showPinyin;
   render();root.querySelector('.c9-lesson-header')?.scrollIntoView({block:'start'});
   return true;
 }
 if(name==='c9-unit-open'){
   const unit=lessonGroups().find(g=>String(g.index)===button.dataset.unit);
   if(!unit)return;
   c9LearnUnit=String(unit.index);c9LearnStatus='all';c9LearnQuery='';c9LearnPage=0;c9LearnDetail=false;
   render();$('c9-learn-unit')?.scrollIntoView({block:'center'});return;
 }
 if(name==='c9-lesson-page'){
   const delta=Number(button.dataset.dir);if(![-1,1].includes(delta))return;
   c9LearnPage=Math.max(0,c9LearnPage+delta);refreshC9DiscoveryResults();
   $('c9-lesson-browser')?.scrollIntoView({block:'nearest'});return;
 }
 if(name==='c9-content-kind'){
   if(!FIND_CATEGORIES.some(([kind])=>kind===button.dataset.kind))return;
   c9LearnKind=button.dataset.kind;
   for(const chip of root.querySelectorAll('[data-action="c9-content-kind"]')){
     const selected=chip.dataset.kind===c9LearnKind;
     chip.classList.toggle('is-selected',selected);chip.setAttribute('aria-pressed',String(selected));
   }
   refreshC9DiscoveryResults();return;
 }
 if(name==='c9-learn-jump'){
   const target=button.dataset.target;
   if(!['c9-units-title','c9-browse-title','c9-content-title','c9-original-curriculum-title'].includes(target))return;
   const node=document.getElementById(target);
   if(node){
    const hiddenModule=node.closest('details');
    if(hiddenModule&&!hiddenModule.open)hiddenModule.open=true;
    node.scrollIntoView({block:'start',behavior:'auto'});
    node.setAttribute('tabindex','-1');
    node.focus({preventScroll:true});
   }
   return;
 }
 if(name==='c9-discovery-reset'){
   c9LearnQuery='';c9LearnUnit='all';c9LearnStatus='all';c9LearnKind='all';
   c9LearnSaved=false;c9LearnPage=0;render();
   root.querySelector('#c9-learn-query')?.focus({preventScroll:true});return;
 }
 if(name==='c9-discovery-full-search'){
   // Preserve the user's current source query and category when handing off
   // to the existing full search, without a second search index.
   p30Query=c9LearnQuery;p30Kind=c9LearnKind;p30Saved=c9LearnSaved;p30Page=0;
   return go('find');
 }
 if(name==='c9-discovery-open'){
   const row=courseSearch({query:c9LearnQuery,kind:c9LearnKind,saved:c9LearnSaved,state})
     .find(x=>x.kind===button.dataset.kind&&x.id===id);
   if(!row)return;
   p30Query=c9LearnQuery;p30Kind=c9LearnKind;p30Saved=c9LearnSaved;p30Page=0;
   return act({dataset:{action:'p30-open-result',kind:row.kind,id:row.id}});
 }

 if(name==='p34-open-reading'){
  const scene=P34_SCENES.find(x=>x.id===id),story=scene&&p34StoryFor(scene.id);
  if(!story){alertUser('Original P34 reading unavailable.','error');return false;}
  if(route()==='stories'&&storyId===story.id)return true;
  if(route()==='stories'&&!c9ConfirmLeaveNativeAnswer('stories'))return false;
  if(route()!=='stories'&&!go('stories'))return false;
  storyId=story.id;storyMode='beginner-detail';storiesBeginnerOnly=true;storiesLongOnly=false;
  beginnerLevel='all';resetReadingNavigation();render();return true;
 }
 if(name==='p34-open-listening'){
  const audio=P34_LISTENING.find(x=>x.id===id),dialogue=audio&&p34DialogueFor(audio.id);
  if(!dialogue){alertUser('Original P34 listening unavailable.','error');return false;}
  if(route()==='dialogues'&&dialogueId===dialogue.id)return true;
  if(route()==='dialogues'&&!c9ConfirmLeaveNativeAnswer('dialogues'))return false;
  if(route()!=='dialogues'&&!go('dialogues'))return false;
  dialogueId=dialogue.id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;
  missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
  p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;render();return true;
 }
 if(name==='p34-shadow-prev'||name==='p34-shadow-next'){
  if(!findDialogue(dialogueId)?.p34)return;
  p34ShadowLine=Math.max(0,Math.min(3,p34ShadowLine+(name==='p34-shadow-next'?1:-1)));
  return render();
 }
 if(name==='p34-slow'||name==='p34-shadow-replay')return speak(button.dataset.text||'',0.68);
 if(name==='p34-write-listening'){
  const item=P34_LISTENING.find(x=>x.id===id);
  if(!item)return false;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p34:'+item.id+':writing');
  if(index<0){alertUser('Original audio writing prompt unavailable.','error');return false;}
  return c9OpenNativeWorkshopTask(index);
 }
 if(name==='p33-open-scenario'){
  const scene=findP33Scenario(id),target=scene&&DIALOGUES.find(d=>d.p33?.id===id);
  if(!target){alertUser('This authored conversation is unavailable.','error');return false;}
  return act({dataset:{action:'c9-media-open-dialogue',id:target.id}});
 }
 if(name==='p33-browse'){
  const opened=await act({dataset:{action:'p33-open-scenario',id:P33_SCENARIOS[0].id}});
  if(opened!==true)return false;
  p33Theme='all';p33Query='';render();return true;
 }
 if(name==='p33-theme'){const theme=button.dataset.theme;
  if(theme!=='all'&&![...new Set(P33_SCENARIOS.map(s=>s.theme))].includes(theme))return;
  p33Theme=theme;return render();
 }
 if(name==='p33-branch'){const index=Number(button.dataset.index);
  if(!findDialogue(dialogueId)?.p33||!Number.isInteger(index)||index<0||index>1)return;
  p33Branch=index;return render();
 }
 if(name==='p33-clear-branch'){p33Branch=null;return render();}
 if(name==='p33-write'){
  const scene=findP33Scenario(id),turn=Number(button.dataset.turn);
  if(!scene||![1,4,7].includes(turn))return false;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p33:'+scene.id+':turn'+turn);
  if(index<0){alertUser('The dialogue writing task is unavailable.','error');return false;}
  return c9OpenNativeWorkshopTask(index);
 }
 if(name==='p32-repair'){
  const repair=p32RepairFor(id?.split(':').at(-1));
  if(!repair||repair.taskId!==id)return false;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===id);
  if(index<0)return false;
  return c9OpenNativeWorkshopTask(index);
 }
 if(name==='p32-open-sentences'){
  const first=SENTENCE_LIBRARY.find(entry=>entry.source==='original-p32');
  if(!first)return false;
  if(!openLibrarySentence(first.id))return false;
  librarySource='original-p32';libraryQuery='';libraryTopic='all';libraryArea='all';
  libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  render();return true;
 }
 if(name==='p31-open-lesson'){
  if(!findP31Guide(id)||!findLesson(id))return false;
  return act({dataset:{action:'c9-lesson-open',id}});
 }
 if(name==='p31-open-library'){
  if(route()==='learn'&&!c9ConfirmLeaveNativeAnswer('learn'))return false;
  if(route()!=='learn'&&!go('learn'))return false;
  p31Theme='all';p31Page=0;c9LearnDetail=false;
  render();root.querySelector('#p31-course-library')?.scrollIntoView({block:'start'});
  return true;
 }
 if(name==='p31-theme'){
  const value=button.dataset.theme;
  if(value!=='all'&&!P31_THEMES.includes(value))return;
  p31Theme=value;p31Page=0;return render();
 }
 if(name==='p31-status'){
  const value=button.dataset.status;
  if(!['all','new','introduced'].includes(value))return;
  p31Status=value;p31Page=0;return render();
 }
 if(name==='p31-next'||name==='p31-prev'){
  const length=P31_CHARACTER_GUIDES.filter(g=>(p31Theme==='all'||g.category===p31Theme)&&(p31Status==='all'||(p31Status==='introduced'?(state.learned||[]).includes(g.id):!(state.learned||[]).includes(g.id)))).length;
  const last=Math.max(0,Math.ceil(length/12)-1);
  p31Page=Math.max(0,Math.min(last,p31Page+(name==='p31-next'?1:-1)));
  return render();
 }
 if(name==='p31-words-next'||name==='p31-words-prev'){
  const last=Math.max(0,Math.ceil(P31_VOCABULARY.length/12)-1);
  p31WordPage=Math.max(0,Math.min(last,p31WordPage+(name==='p31-words-next'?1:-1)));
  return render();
 }
 if(name==='p31-writing'){
  const guide=findP31Guide(id);
  const line=Number(button.dataset.line);
  if(!guide||!Number.isInteger(line)||line<0||line>1)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===`p31:${guide.id}:line${line+1}`);
  if(index<0)return;
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  return go('workshop');
 }
 if(name==='p30-search')return go('find');
 if(name==='p30-coach-filter'){
  const category=button.dataset.kind;
  if(!['all','Foundations','Sounds','Vocabulary','Sentences','Reading','Communication'].includes(category))return;
  p30CoachCategory=category;p30CoachIndex=0;return render();
 }
 if(name==='p30-coach-next'){p30CoachIndex++;return render();}
 if(name==='p30-coach-write'){
  const idx=SENTENCE_TASKS.findIndex(t=>t.id==='p30-coach:'+id);
  if(idx<0)return;
  sentenceIndex=idx;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return go('workshop');
 }
 if(name==='p30-coach-destination'){
  const destination=button.dataset.route;
  if(stableRoutes.has(destination))return go(destination);
  return;
 }
 if(name==='p30-filter'){
  const kind=button.dataset.kind;
  if(!FIND_CATEGORIES.some(([id])=>id===kind))return;
  p30Kind=kind;p30Page=0;return render();
 }
 if(name==='p30-page-next'||name==='p30-page-prev'){
  const result=courseSearchResults({query:p30Query,kind:p30Kind,saved:p30Saved,page:p30Page,state},action,esc);
  p30Page=Math.max(0,Math.min(result.pages-1,p30Page+(name==='p30-page-next'?1:-1)));return render();
 }
 if(name==='p30-open-result'){
  const kind=button.dataset.kind;
  const hits=courseSearch({query:p30Query,kind:p30Kind,saved:p30Saved,state});
  if(!hits.some(x=>x.kind===kind&&x.id===id))return;
  const source=c9LookupSource(kind,id);
  if(!source)return alertUser('Original indexed source is unavailable.','error');
  // Source provenance must follow successful original navigation, never a
  // rejected click. Retain earlier search-return context on failed actions.
  const nextTrail={...source,origin:route()==='learn'?'learn':'find'};
  if(kind==='advanced'){
    const phase=findC9AdvancedPhase(source.phase);
    if(!phase?.records.some(x=>x.id===source.sourceId))return false;
    if(!go('advanced'))return false;
    c9AdvancedPhase=phase.phase;c9AdvancedSelected=source.sourceId;
    c9AdvancedPage=0;c9AdvancedQuery='';c9AdvancedTranslation=false;
    c9DiscoveryTrail=nextTrail;render();return true;
  }
  const mapped={characters:'c9-lesson-open',words:'lookup-word',grammar:'grammar-select',
    sentences:'sentence-select',reading:'c9-media-open-story',
    dialogues:'c9-media-open-dialogue',pathway:'pathway-select'};
  const target=mapped[kind];if(!target)return false;
  if(await act({dataset:{action:target,id}})!==true)return false;
  c9DiscoveryTrail=nextTrail;render();return true;
 }
 if(name==='pathway-jump-current'){
  const target=root.querySelector('#p29-current-mission');
  if(!target)return false;
  target.scrollIntoView({behavior:'auto',block:'start'});
  target.focus({preventScroll:true});
  announceC9Interaction('Current original Mandarin mission, '+(findPathwayMission(pathwaySelection())?.title||'study')+'.');
  return true;
 }
 if(name==='pathway-open'){
  const mission=pathwayResume(state);if(!mission||!go('pathway'))return false;
  pathwaySelected=mission.id;render();return true;
 }
 if(name==='pathway-select')return openPathwayMission(id);
 if(name==='pathway-band'||name==='pathway-prev-band'||name==='pathway-next-band'){
  const current=findPathwayMission(pathwaySelection())||PATHWAY_MISSIONS[0];
  const number=name==='pathway-band'?Number(button.dataset.band):current.band+(name==='pathway-next-band'?1:-1);
  if(!Number.isInteger(number)||number<1||number>9)return;
  const next=pathwayNext(state,number);if(next)openPathwayMission(next.id);return;
 }
 if(name==='pathway-budget'){const n=Number(button.dataset.minutes);if(![10,20,30].includes(n))return;pathwayMinutes=n;return render();}
 if(name==='pathway-mode'||name==='pathway-next-skill'){
  const available=PATHWAY_MODES;
  if(name==='pathway-next-skill'&&pathwayMode===available.at(-1)){
    const m=findPathwayMission(pathwaySelection());const next=pathwayNext(state,m.band,m.id);
    if(next)openPathwayMission(next.id);return;
  }
  const mode=name==='pathway-mode'?button.dataset.mode:available[(available.indexOf(pathwayMode)+1)%available.length];
  if(!available.includes(mode))return;
  pathwayMode=mode;pathwayFeedback=null;pathwayTyped='';pathwayAssisted=false;return render();
 }
 if(name==='pathway-focus'){pathwayFocus=!pathwayFocus;pathwayFeedback=null;pathwayTyped='';pathwayAssisted=false;return render();}
 if(name==='pathway-toggle-pinyin'){pathwayShowPinyin=!pathwayShowPinyin;if(pathwayFocus)pathwayAssisted=true;return render();}
 if(name==='pathway-toggle-english'){pathwayShowEnglish=!pathwayShowEnglish;if(pathwayFocus)pathwayAssisted=true;return render();}
 if(name==='pathway-hint'){if(!pathwayFeedback){pathwayAssisted=true;render();}return;}
 if(name==='pathway-next-mission'){
  const current=findPathwayMission(pathwaySelection());if(!current)return;
  const next=pathwayNext(state,current.band,current.id);if(next)openPathwayMission(next.id);return;
 }
 if(name==='pathway-transfer-clear'){
  const field=root.querySelector('#p29-transfer-draft');pathwayTransferDraft='';
  if(field){field.value='';field.focus({preventScroll:true});}
  const notice=root.querySelector('#p29-transfer-privacy');
  if(notice)notice.textContent='Private response cleared from this tab. No grade or saved record was created.';
  return true;
 }
 if(name==='pathway-workshop'){
  const m=findPathwayMission(pathwaySelection());if(!m)return false;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='pathway:'+m.id+':production');
  if(index<0){alertUser('Original pathway production exercise unavailable.','error');return false;}
  if(!go('workshop'))return false;
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  render();return true;
 }
 if(name==='pathway-open-words')return go('explore');
 if(name==='pathway-open-grammar')return go('grammar');
 if(name==='pathway-open-readings')return go('stories');
 if(name==='pathway-open-pinyin')return go('pinyin');
 if(name==='pathway-answer'||name==='pathway-reveal'){
  if(pathwayFeedback)return;
  const mission=findPathwayMission(pathwaySelection());if(!mission)return;
  const q=pathwayQuestion(mission.id,pathwayMode);if(!q)return;
  const response=q.kind==='hanzi'?pathwayTyped:button.dataset.option||'';
  if(name==='pathway-answer'&&!response.trim())return alertUser('Choose or enter an answer before checking.','error');
  const assisted=pathwayAssisted||!pathwayFocus||name==='pathway-reveal';
  const result=name==='pathway-reveal'?{correct:false,message:'The taught model was revealed. Study it and attempt another item independently.'}:
    q.kind==='hanzi'?checkSentence(q.task,response):evaluateAnswer(response,q.answer,'choice');
  const eid=globalThis.crypto?.randomUUID?.()||'pathway-'+Date.now()+'-'+Math.random();
  const ok=await mutate(prev=>addSentenceEvent(prev,{id:eid,taskId:q.task.id,
    correct:!!result.correct,assisted}));
  if(ok){pathwayFeedback={...result,assisted};render();}
  return;
 }
 if(name==='reading-beginner-filter'){storiesBeginnerOnly=!storiesBeginnerOnly;storiesLongOnly=false;if(storiesBeginnerOnly&&!findStory(storyId)?.beginner){storyId=BEGINNER_STORIES[0].id;storyMode='beginner-detail';}resetReadingNavigation();return render();}
 if(name==='beginner-level'){const level=button.dataset.level;if(!['all','1','2'].includes(level))return;beginnerLevel=level;storiesBeginnerOnly=true;storiesLongOnly=false;const options=BEGINNER_STORIES.filter(s=>level==='all'||String(s.beginner.level)===level);if(options.length&&!options.some(s=>s.id===storyId))storyId=options[0].id;storyMode='beginner-detail';resetReadingNavigation();return render();}
 if(name==='beginner-next-story'){const next=nextBeginnerStory(storyId,state,beginnerLevel);if(!next)return;storiesBeginnerOnly=true;storiesLongOnly=false;storiesOnlyBookmarked=false;storyId=next.id;storyMode='beginner-detail';resetReadingNavigation();return render();}
 if(name==='beginner-part'){const part=button.dataset.part;if(!['all','0','1'].includes(part)||!findStory(storyId)?.beginner)return;beginnerPart=part;storyFocusIndex=part==='all'?-1:Number(part)*3;return render();}
 if(name==='beginner-explain-part'){const part=button.dataset.part;if(!['0','1'].includes(part))return;beginnerPartTip=beginnerPartTip===part?'':part;if(beginnerPartTip)storyAssist=true;return render();}
 if(name==='beginner-reveal-word'){beginnerWordShown=!beginnerWordShown;if(beginnerWordShown)storyAssist=true;return render();}
 if(name==='beginner-writing-workshop'){const task=beginnerWritingTask(storyId);if(!task)return;const index=SENTENCE_TASKS.findIndex(t=>t.id===task.id);if(index<0)return;sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return go('workshop');}
 if(name==='reading-open-beginner'){const requested=findStory(id);const story=requested?.beginner?requested:nextBeginnerStory(storyId,state,beginnerLevel)||BEGINNER_STORIES[0];if(!story)return;storyId=story.id;storyMode='beginner-detail';storiesBeginnerOnly=true;storiesLongOnly=false;resetReadingNavigation();return go('stories');}
 if(name==='reading-long-filter'){
  storiesLongOnly=!storiesLongOnly;storiesBeginnerOnly=false;
  const selection=STORIES.filter(s=>(!storiesLongOnly||s.extended)&&(!storiesOnlyBookmarked||(state.bookmarkedStories||[]).includes(s.id)));
  if(!selection.length){storiesOnlyBookmarked=false;storyId=STORIES.find(s=>s.extended)?.id||STORIES[0].id;}
  else if(!selection.some(s=>s.id===storyId))storyId=selection[0].id;
  resetReadingNavigation();return render();
 }
 if(name==='reading-paragraph'){
  const story=findStory(storyId),index=Number(button.dataset.index);
  if(!story?.extended||!Number.isInteger(index)||index<0||index>=story.extended.paragraphs.length)return;
  storyParagraph=index;storyParagraphOnly=true;storyFocusIndex=story.extended.paragraphs[index].start;return render();
 }
 if(name==='reading-next-paragraph'){
  const story=findStory(storyId);if(!story?.extended)return;
  storyParagraph=(storyParagraph+1)%story.extended.paragraphs.length;storyParagraphOnly=true;
  storyFocusIndex=story.extended.paragraphs[storyParagraph].start;return render();
 }
 if(name==='reading-all-paragraphs'){storyParagraphOnly=false;storyFocusIndex=-1;return render();}
 if(name==='reading-translate-paragraph'){
  const story=findStory(storyId),index=Number(button.dataset.index);
  if(!story?.extended||!Number.isInteger(index)||index<0||index>=story.extended.paragraphs.length)return;
  storyParagraphTranslations=storyParagraphTranslations.includes(index)?storyParagraphTranslations.filter(n=>n!==index):[...storyParagraphTranslations,index];
  if(storyParagraphTranslations.includes(index))storyAssist=true;return render();
 }
 if(name==='reading-show-writing-source'){storyAssist=true;return render();}
 if(name==='reading-writing-workshop'){
  const story=findStory(storyId);if(!story?.extended)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='reading:'+story.id+':writing');if(index<0)return;
  sentenceIndex=index;sentenceFeedback=null;sentenceTyped='';sentenceSupport=false;return go('workshop');
 }
 if(name==='reading-open-long'){
  const found=findStory(id)?.extended?findStory(id):STORIES.find(item=>item.extended);if(!found)return;
  storyId=found.id;storyMode='passage-detail';storyParagraph=0;storyParagraphOnly=false;storyParagraphTranslations=[];
  storyFocusIndex=-1;resetStoryExercise();return go('stories');
 }
 if(name==='sentence-open')return go('sentences');
 if(name==='sentence-grammar-filter'){if(!GRAMMAR_LESSONS.some(g=>g.id===id))return;
  libraryGrammar=id;libraryTopic='all';librarySource='all';libraryPage=0;libraryQuery='';return go('sentences');}
 
 if(name==='sentence-select')return openLibrarySentence(id);
 if(name==='sentence-prev-page'||name==='sentence-next-page'){
  const count=searchSentences({query:libraryQuery,topic:libraryTopic,area:libraryArea,
   difficulty:libraryDifficulty,grammar:libraryGrammar,purpose:libraryPurpose,tone:libraryTone,source:librarySource,savedOnly:librarySavedOnly,state}).length;
  libraryPage=Math.min(Math.max(0,Math.ceil(count/18)-1),
   Math.max(0,libraryPage+(name==='sentence-next-page'?1:-1)));return render();
 }
 if(name==='sentence-show-saved'){librarySavedOnly=!!(state.bookmarkedSentences||[]).length;
  libraryPage=0;return go('sentences');}
 if(name==='sentence-next'||name==='sentence-previous'){
  const matches=searchSentences({query:libraryQuery,topic:libraryTopic,area:libraryArea,
   difficulty:libraryDifficulty,grammar:libraryGrammar,purpose:libraryPurpose,tone:libraryTone,source:librarySource,savedOnly:librarySavedOnly,state});
  const options=matches.length?matches:SENTENCE_LIBRARY;
  const i=Math.max(0,options.findIndex(x=>x.id===selectedLibraryId()));
  const index=(i+(name==='sentence-next'?1:-1)+options.length)%options.length;
  if(openLibrarySentence(options[index].id)){libraryPage=Math.floor(index/18);render();return true;}
  return false;
 }
 if(name==='sentence-mode'||name==='sentence-next-mode'){
  const record=findLibrarySentence(selectedLibraryId());if(!record)return;
  const available=SENTENCE_MODES.filter(m=>hasSentenceMode(record,m));
  const next=name==='sentence-mode'?button.dataset.mode:available[(available.indexOf(libraryMode)+1)%available.length];
  if(!available.includes(next))return;
  libraryMode=next;libraryFeedback=null;libraryTyped='';libraryOrder=[];libraryAssisted=false;return render();
 }
 if(name==='sentence-focus'){libraryPracticeFocus=!libraryPracticeFocus;
 libraryFeedback=null;libraryTyped='';libraryOrder=[];libraryAssisted=!libraryPracticeFocus;
 return render();}
 if(name==='sentence-toggle-pinyin'){libraryShowPinyin=!libraryShowPinyin;if(!libraryPracticeFocus)libraryAssisted=true;return render();}
 if(name==='sentence-toggle-english'){libraryShowEnglish=!libraryShowEnglish;return render();}
 if(name==='sentence-chunk'){
  const q=sentenceQuestion(selectedLibraryId(),libraryMode),index=Number(button.dataset.index);
  if(!q||q.kind!=='ordering'||!Number.isInteger(index)||index<0||index>=q.chunks.length||
    libraryOrder.includes(index)||libraryFeedback)return;
  libraryOrder.push(index);return render();
 }
 if(name==='sentence-undo'){libraryOrder.pop();return render();}
 if(name==='sentence-clear'){libraryOrder=[];return render();}
 if(name==='sentence-hint'){if(!libraryFeedback){libraryAssisted=true;render();}return;}
 if(name==='sentence-save'){
  const selected=id||selectedLibraryId();if(!findLibrarySentence(selected))return;
  await mutate(prev=>toggleSentenceSaved(prev,selected));return;
 }
 if(name==='sentence-workshop'){
  const taskId=sentencePracticeId(selectedLibraryId(),'production');
  const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(index<0)return;
  sentenceIndex=index;sentenceFeedback=null;sentenceTyped='';sentenceSupport=false;
  return go('workshop');
 }
 if(name==='sentence-answer'||name==='sentence-reveal'){
  if(libraryFeedback)return;
  const q=sentenceQuestion(selectedLibraryId(),libraryMode);if(!q)return;
  const response=q.kind==='choice'?button.dataset.option||'':
   q.kind==='ordering'?libraryOrder.map(i=>q.chunks[i]).join(''):libraryTyped;
  if(name==='sentence-answer'&&!response.trim())return alertUser('Enter or choose an answer first.','error');
  if(name==='sentence-answer'&&q.kind==='ordering'&&libraryOrder.length!==q.chunks.length)
   return alertUser('Use all word chunks before checking.','error');
  const assisted=libraryAssisted||!libraryPracticeFocus||name==='sentence-reveal';
  const result=name==='sentence-reveal'?
   {correct:false,reason:'revealed',message:'The model was revealed for learning. Try a different sentence independently.'}:
   q.kind==='choice'?gradeSentenceChoice(q,response):checkSentence(q.task,response);
  const eventId=globalThis.crypto?.randomUUID?.()||'sentence-'+Date.now()+'-'+Math.random();
  const saved=await mutate(prev=>addSentenceEvent(prev,{
    id:eventId,taskId:q.task.id,correct:!!result.correct,assisted}));
  if(saved){libraryFeedback={...result,assisted};render();}
  return;
 }
 if(name==='grammar-open'){return go('grammar');}
 if(name==='grammar-select'){
  const fromWriting=route()==='writing';
  const opened=findGrammarLesson(id)?openGrammarLesson(id):false;
  if(opened===true&&fromWriting)rememberC9NativeHandoff('writing','grammar',id,c9WritingState.unitId);
  return opened;
 }
 if(name==='grammar-next'||name==='grammar-previous'){
  // openGrammarLesson performs exactly one input-loss confirmation.
  const next=nextGrammarLesson(selectedGrammarId(),name==='grammar-next'?1:-1);
  return next?openGrammarLesson(next.id):false;
 }
 if(name==='grammar-chapter'){
  const chapter=GRAMMAR_CHAPTERS.find(c=>String(c.number)===String(button.dataset.chapter));
  return chapter?openGrammarLesson(chapter.lessons[0]):false;
 }
 if(name==='grammar-mode'||name==='grammar-next-mode'){
  if(!grammarFeedback&&grammarTyped.trim()&&!c9ConfirmLeaveNativeAnswer())return;
  const selected=name==='grammar-mode'?button.dataset.mode:
    GRAMMAR_MODES[(GRAMMAR_MODES.indexOf(grammarMode)+1)%GRAMMAR_MODES.length];
  if(!GRAMMAR_MODES.includes(selected))return;
  grammarMode=selected;grammarTyped='';grammarOrder=[];grammarFeedback=null;grammarAssisted=false;return render();
 }
 if(name==='grammar-translation'){grammarShowEnglish=!grammarShowEnglish;return render();}
 if(name==='grammar-chunk'){
  const question=grammarQuestion(selectedGrammarId(),grammarMode);
  const index=Number(button.dataset.index);
  if(!question||question.kind!=='ordering'||!Number.isInteger(index)||index<0||index>=question.chunks.length||grammarOrder.includes(index)||grammarFeedback)return;
  grammarOrder.push(index);return render();
 }
 if(name==='grammar-undo'){grammarOrder.pop();return render();}
 if(name==='grammar-reset'){grammarOrder=[];return render();}
 if(name==='grammar-hint'){if(grammarFeedback)return;grammarAssisted=true;return render();}
 if(name==='grammar-pinyin')return go('pinyin');
 if(name==='grammar-workshop'){
  const id='grammar:'+selectedGrammarId()+':production';
  const index=SENTENCE_TASKS.findIndex(t=>t.id===id);
  if(index<0){alertUser('Original grammar production task unavailable.','error');return false;}
  if(!go('workshop'))return false;
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  render();return true;
 }
 if(name==='grammar-answer'||name==='grammar-reveal'){
  if(grammarFeedback)return;
  const question=grammarQuestion(selectedGrammarId(),grammarMode);if(!question)return;
  const answer=question.kind==='choice'?button.dataset.option||'':
     question.kind==='ordering'?grammarOrder.map(i=>question.chunks[i]).join(''):grammarTyped;
  if(name==='grammar-answer'&&!answer.trim())return alertUser('Choose or write an answer before checking.','error');
  if(question.kind==='ordering'&&name==='grammar-answer'&&grammarOrder.length!==question.chunks.length)return alertUser('Use every word chunk before checking.','error');
  const assisted=grammarAssisted||name==='grammar-reveal';
  const outcome=name==='grammar-reveal'?
    {correct:false,reason:'revealed',message:'The model was shown. Review the explanation, then try another example without help.'}:
    gradeGrammarQuestion(question,answer);
  const eid=globalThis.crypto?.randomUUID?.()||`grammar-${Date.now()}-${Math.random()}`;
  const ok=await mutate(previous=>addSentenceEvent(previous,{id:eid,taskId:question.taskId,correct:!!outcome.correct,assisted}));
  if(ok){grammarFeedback={...outcome,assisted};render();}
  return;
 }
 if(name==='pinyin-open')return go('pinyin');
 if(name==='pinyin-back')return go('learn');
 if(name==='pinyin-tab'){
  const section=button.dataset.section;
  if(!PINYIN_SECTIONS.some(x=>x.id===section))return;
  pinyinSection=section;pinyinFilter=button.dataset.filter||'all';
  pinyinIndex=0;pinyinTyped='';pinyinFeedback=null;
  pinyinSound=section==='finals'?'a':'b';
  return go('pinyin');
 }
 if(name==='pinyin-sound'){pinyinSound=button.dataset.sound||'b';return render();}
 if(name==='pinyin-syllable'){pinyinSyllable=button.dataset.syllable||'ma';return render();}
 if(name==='pinyin-next'){pinyinIndex++;pinyinTyped='';pinyinFeedback=null;return render();}
 if(name==='pinyin-answer'||name==='pinyin-reveal'){
  if(pinyinFeedback)return;
  const question=soundQuestion(pinyinIndex,pinyinFilter);if(!question)return;
  const answer=name==='pinyin-reveal'?'':question.kind==='choice'?button.dataset.option||'':pinyinTyped;
  if(name==='pinyin-answer'&&!answer.trim())return alertUser('Enter or select an answer.','error');
  pinyinFeedback=name==='pinyin-reveal'
   ?{correct:false,assisted:true,message:'Reference revealed. This is teaching support, not an independent answer.'}
   :evaluateSoundQuestion(question,answer);
  return render();
 }
 if(name==='finish-next'){
  if(button.dataset.kind==='resume')return act({dataset:{action:'hub-resume',kind:button.dataset.source}});
  if(button.dataset.kind==='lesson'&&findLesson(button.dataset.lesson))displayLessonId=button.dataset.lesson;
  return go(button.dataset.route);
 }
 if(name==='restore-cancel'){pendingRestore=null;restoreAcknowledgement='';render();return;}
 if(name==='restore-confirm'){
  if(!db||!pendingRestore||!restoreRequiresAcknowledgement(pendingRestore.preview,restoreAcknowledgement))return alertUser('Type REPLACE to authorize the replacement.','error');
  if(busy)return;busy=true;
  try{const restored=await replaceState(db,pendingRestore.learner,{expectedRevision:pendingRestore.preview.current.revision});state=restored;pendingRestore=null;restoreAcknowledgement='';channel?.postMessage('data-changed');render();alertUser('Validated backup restored. Your previous local history was replaced.');}
  catch(err){alertUser(`Restore did not complete: ${err.message}`,'error');}
  finally{busy=false;}
  return;
 }

 if(name==='hub-go'){const target=button.dataset.route;if(LEARNING_DESTINATIONS.some(d=>d.route===target)||['progress','settings','practice','journey','block','ladder','wordbook','senses','workshop'].includes(target))return go(target);return;}
 if(name==='hub-primary'){const item=learningHub(state).primary;if(item.kind==='resume')return act({dataset:{action:'hub-resume',kind:item.source}});if(item.kind==='journey'&&item.lessonId)displayLessonId=item.lessonId;if(item.kind==='remediation'){planMistakeFilter='unresolved';return go('plan');}return go(item.route);}
 if(name==='hub-resume'){const session=activeLearningSessions(state).find(s=>s.kind===button.dataset.kind);if(!session)return alertUser('No saved session remains for this activity.');return go(session.route);}
 if(name==='hub-task')return act({dataset:{action:'plan-launch',kind:button.dataset.kind}});
 if(name==='hub-lesson')return act({dataset:{action:'c9-lesson-open',id}});
 if(name==='hub-dialogue')return act({dataset:{action:'c9-media-open-dialogue',id}});
 if(name==='plan-open'||name==='plan-mistakes'){planMistakeFilter=name==='plan-mistakes'?'unresolved':planMistakeFilter;return go('plan');}
 if(name==='plan-minutes'){const minutes=Number(button.dataset.minutes);return mutate(s=>setPlanPreferences(s,{minutes,focus:planPreferences(s).focus}));}
 if(name==='plan-focus')return mutate(s=>setPlanPreferences(s,{minutes:planPreferences(s).minutes,focus:button.dataset.focus}));
 if(name==='plan-filter'){if(['unresolved','saved','corrected'].includes(button.dataset.filter)){planMistakeFilter=button.dataset.filter;render();}return;}
 if(name==='plan-pin')return mutate(s=>toggleMistakePin(s,id));
 if(name==='plan-weak-start'||name==='plan-tones'){fluencyFocus=name==='plan-tones'?'pronunciation':'weak';return go('fluency');}
 if(name==='plan-next-reading'){storyId=nextConnectedMaterial(state).reading.id;storyFocusIndex=-1;storyShowTranslation=false;resetStoryExercise();return go('stories');}
 if(name==='plan-next-dialogue'){dialogueId=nextConnectedMaterial(state).dialogue.id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;return go('dialogues');}
 if(name==='plan-launch'){
  if(button.dataset.kind==='review')return go('review');
  if(button.dataset.kind==='journey')return go('journey');
  if(button.dataset.kind==='fluency'){fluencyFocus=planPreferences(state).focus==='pronunciation'?'pronunciation':planPreferences(state).focus==='mistakes'?'weak':'balanced';return go('fluency');}
  if(button.dataset.kind==='reading')return act({dataset:{action:'plan-next-reading'}});
  if(button.dataset.kind==='dialogue')return act({dataset:{action:'plan-next-dialogue'}});
  return;
 }
 if(name==='plan-source'){
  const entry=mistakeCollections(state).all.find(x=>x.id===id);if(!entry)return;
  const source=entry.source;if(source?.type==='lesson'&&findLesson(source.id)){displayLessonId=source.id;return go('learn');}
  if(source?.type==='reading'&&findStory(source.id)){storyId=source.id;storyShowTranslation=false;resetStoryExercise();return go('stories');}
  if(source?.type==='dialogue'&&findDialogue(source.id)){dialogueId=source.id;dialogueStep=0;dialogueSupport=false;return go('dialogues');}
  if(source?.type==='sense'){const index=SENSE_CASES.findIndex(c=>c.id===source.id);if(index>=0){senseIndex=index;senseFeedback=null;return go('senses');}}
  return go('fluency');
 }

 if(name==='fluency-open')return go('fluency');
 if(name==='fluency-focus'){if(['balanced','weak','context','pronunciation'].includes(button.dataset.focus)){fluencyFocus=button.dataset.focus;render();}return;}
 if(name==='fluency-size'){const n=Number(button.dataset.size);if([6,8,12,16].includes(n)){fluencySize=n;render();}return;}
 if(name==='fluency-start'){const eid=globalThis.crypto?.randomUUID?.()||`fluency-${Date.now()}-${Math.random()}`;return mutate(s=>beginFluency(s,{id:eid,size:fluencySize,focus:fluencyFocus}));}
 if(name==='fluency-hint')return mutate(s=>fluencyHint(s));
 if(name==='fluency-answer'||name==='fluency-reveal'){
  const q=fluencyCurrent(state);if(!q)return;
  const response=name==='fluency-reveal'?'':q.options?button.dataset.option||'':fluencyTyped;
  const eid=globalThis.crypto?.randomUUID?.()||`fluency-attempt-${Date.now()}-${Math.random()}`;
  return mutate(s=>fluencyAnswer(s,{id:eid,response,reveal:name==='fluency-reveal'}));
 }
 if(name==='fluency-next'){
  const eid=globalThis.crypto?.randomUUID?.()||`fluency-end-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>advanceFluency(s,{id:eid}));if(ok)fluencyTyped='';return;
 }
 if(name==='fluency-pause')return go('today');
 if(name==='fluency-abandon'){if(!confirm('Discard this unfinished Fluency Studio session? Submitted answer history will remain saved.'))return;return mutate(s=>abandonFluency(s));}
 if(name==='fluency-source'){
  const type=button.dataset.kind,target=button.dataset.id;
  if(type==='lesson'&&findLesson(target)){displayLessonId=target;return go('learn');}
  if(type==='reading'&&findStory(target)){storyId=target;storyShowTranslation=false;storyAssist=false;return go('stories');}
  if(type==='dialogue'&&findDialogue(target)){dialogueId=target;dialogueStep=0;dialogueSupport=false;return go('dialogues');}
  if(type==='sense'){const index=SENSE_CASES.findIndex(c=>c.id===target);if(index>=0){senseIndex=index;senseSupport=false;senseFeedback=null;return go('senses');}}
  return;
 }

 if(name==='trail-start')return mutate(s=>beginTrail(s));
 if(name==='trail-hint')return mutate(s=>trailHint(s));
 if(name==='trail-answer'||name==='trail-reveal'){
  const q=trailQuestion(state);if(!q)return;
  const response=name==='trail-reveal'?'':q.options?button.dataset.option||'':trailTyped;
  const eid=globalThis.crypto?.randomUUID?.()||`trail-${Date.now()}-${Math.random()}`;
  return mutate(s=>answerTrail(s,{id:eid,response,reveal:name==='trail-reveal'}));
 }
 if(name==='trail-next'){
  const eid=globalThis.crypto?.randomUUID?.()||`trail-next-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>nextTrail(s,{id:eid}));if(ok)trailTyped='';return;
 }
 if(name==='block-open')return go('block');
 if(name==='block-focus'){blockFocus=button.dataset.focus;return render();}
 if(name==='block-count'){blockCount=Number(button.dataset.count);return render();}
 if(name==='block-start'){
  const sid=globalThis.crypto?.randomUUID?.()||`block-${Date.now()}`;
  return mutate(s=>startBlock(s,{id:sid,focus:blockFocus,count:blockCount}));
 }
 if(name==='block-hint')return mutate(s=>useBlockHint(s));
 if(name==='block-answer'||name==='block-reveal'){
  const q=blockBridgeQuestion(state);if(!q)return;
  const response=name==='block-reveal'?'':q.kind==='pinyin'?blockTyped:button.dataset.option||'';
  const eid=globalThis.crypto?.randomUUID?.()||`bridge-${Date.now()}-${Math.random()}`;
  return mutate(s=>answerBlockBridge(s,{id:eid,response,reveal:name==='block-reveal'}));
 }
 if(name==='block-launch'){
  const step=blockCurrent(state);if(!step)return;
  if(step.kind!=='journey'&&step.kind!=='ladder')return;
  if(step.kind==='journey'){
   if(state.courseJourney&&state.courseJourney.lessonId!==step.lessonId)return alertUser('Finish or discard the other active Daily Journey before starting this step.','error');
   if(!state.courseJourney){const sid=globalThis.crypto?.randomUUID?.()||`block-course-${Date.now()}`;const ok=await mutate(s=>startCourse(s,step.lessonId,{id:sid}));if(!ok)return;}
   displayLessonId=step.lessonId;return go('journey');
  }
  if(state.ladderSession&&state.ladderSession.lessonId!==step.lessonId)return alertUser('Finish or discard the other active Sentence Ladder before starting this step.','error');
  if(!state.ladderSession){const sid=globalThis.crypto?.randomUUID?.()||`block-ladder-${Date.now()}`;const ok=await mutate(s=>startLadder(s,step.lessonId,{id:sid}));if(!ok)return;}
  displayLessonId=step.lessonId;ladderTyped='';return go('ladder');
 }
 if(name==='block-advance'){
  const id=globalThis.crypto?.randomUUID?.()||`block-step-${Date.now()}`;
  const ok=await mutate(s=>advanceBlock(s,{id}));if(ok){blockTyped='';go('block');}return;
 }
 if(name==='block-abandon'){
  if(!confirm('End this Study Block? Completed journeys, practice answers and review histories will remain intact.'))return;
  const id=globalThis.crypto?.randomUUID?.()||`block-stop-${Date.now()}`;return mutate(s=>abandonBlock(s,{id}));
 }
 if(name==='block-story'){if(findStory(id)){storyId=id;return go('stories');}return;}
 if(name==='block-dialogue'){if(findDialogue(id)){dialogueId=id;dialogueStep=0;return go('dialogues');}return;}
 if(name==='block-repair'){
  if(state.courseRepairSession){if(state.courseRepairSession.lessonId===id)return go('journey');return alertUser('Finish your existing follow-up first.','error')}
  const sid=globalThis.crypto?.randomUUID?.()||`block-remedy-${Date.now()}`;
  const ok=await mutate(s=>startCourseRepair(s,id,{id:sid}));if(ok){displayLessonId=id;repairTyped='';go('journey');}return;
 }

 if(name==='ladder-open'){if(state.ladderSession)return go('ladder');if(findLesson(id))displayLessonId=id;ladderTyped='';return go('ladder');}
 if(name==='ladder-start'){const chosen=findLesson(id);if(!chosen)return;const sid=globalThis.crypto?.randomUUID?.()||`ladder-${Date.now()}`;const ok=await mutate(s=>startLadder(s,chosen.id,{id:sid}));if(ok){displayLessonId=chosen.id;ladderTyped='';go('ladder');}return;}
 if(name==='ladder-select'){return mutate(s=>ladderSelect(s,Number(button.dataset.index)));}
 if(name==='ladder-undo'){return mutate(s=>ladderUndo(s));}
 if(name==='ladder-hint'){return mutate(s=>ladderHint(s));}
 if(name==='ladder-answer'||name==='ladder-reveal'){
  const session=state.ladderSession,q=ladderQuestion(session);if(!q||session.feedback)return;
  const response=name==='ladder-reveal'?'':q.kind==='choice'?button.dataset.option||'':q.kind==='pinyin'?ladderTyped:'';
  if(name==='ladder-answer'&&q.kind!=='order'&&!response.trim())return alertUser('Enter an answer before checking.','error');
  const eid=globalThis.crypto?.randomUUID?.()||`ladder-try-${Date.now()}-${Math.random()}`;
  return mutate(s=>answerLadder(s,{id:eid,response,reveal:name==='ladder-reveal'}));
 }
 if(name==='ladder-next'){const ok=await mutate(s=>advanceLadder(s));if(ok)ladderTyped='';return;}
 if(name==='ladder-pause'){ladderTyped='';return go('today');}
 if(name==='ladder-abandon'){if(!confirm('Discard this unfinished Sentence Ladder? Submitted answers remain in the history.'))return;ladderTyped='';return mutate(s=>abandonLadder(s));}

 if(name==='course-repair-open'){if(state.courseRepairSession){repairTyped='';return go('journey');}return;}
 if(name==='course-repair-start'){const target=findLesson(id);if(!target)return;if(state.courseRepairSession)return go('journey');const eid=globalThis.crypto?.randomUUID?.()||`repair-${Date.now()}-${Math.random()}`;const ok=await mutate(s=>startCourseRepair(s,target.id,{id:eid}));if(ok){repairTyped='';displayLessonId=target.id;go('journey');}return;}
 if(name==='repair-hint'){return mutate(s=>useRepairHint(s));}
 if(name==='repair-reveal'||name==='repair-answer'){
  const r=state.courseRepairSession;if(!r||r.feedback)return;
  const q=repairQuestion(r),response=name==='repair-reveal'?'':q?.kind==='pinyin'?repairTyped:button.dataset.option||'';
  if(name==='repair-answer'&&!response.trim())return alertUser('Answer this question before checking.','error');
  const eid=globalThis.crypto?.randomUUID?.()||`repair-try-${Date.now()}-${Math.random()}`;
  return mutate(s=>answerCourseRepair(s,{response,reveal:name==='repair-reveal',id:eid}));
 }
 if(name==='repair-next'){const ok=await mutate(s=>advanceCourseRepair(s));if(ok)repairTyped='';return;}
 if(name==='repair-pause'){return go('today');}
 if(name==='repair-abandon'){if(!confirm('End this unfinished correction session? Previously submitted attempts remain in your history.'))return;return mutate(s=>abandonCourseRepair(s));}
 if(name==='course-home-open'){displayLessonId=courseNextLesson(state);return go('journey');}
  if(name==='foundation-unit'){if(!findLesson(id))return;displayLessonId=id;go('learn');render();root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;}
  if(name==='context-open'){if(!findLesson(id))return;displayLessonId=id;go('learn');render();return;}
  if(name==='course-next'){if(state.courseJourney)return go('journey');const index=DEMO_LESSONS.findIndex(item=>item.id===displayLessonId);displayLessonId=DEMO_LESSONS[Math.min(DEMO_LESSONS.length-1,Math.max(0,index)+1)].id;go('journey');render();return;}
 if(name==='course-lesson'){if(!findLesson(id))return;displayLessonId=id;if(state.courseJourney&&state.courseJourney.lessonId!==id)return go('journey');return go('journey');}
 if(name==='course-dialogue-link'){if(findDialogue(id)){dialogueId=id;dialogueStep=0;return go('dialogues');}return;}
 if(name==='course-start'){if(!findLesson(id))return;const eid=globalThis.crypto?.randomUUID?.()||`course-${Date.now()}`;const ok=await mutate(s=>startCourse(s,id,{id:eid}));if(ok){courseTyped='';render();}return;}
 if(name==='course-hint'){return mutate(s=>useCourseHint(s));}
 if(name==='course-reveal'||name==='course-answer'){
  if(!state.courseJourney||state.courseJourney.feedback)return;
  const q=courseQuestion(state.courseJourney),reply=name==='course-reveal'?'':q?.kind==='pinyin'?courseTyped:button.dataset.option||'';
  if(name==='course-answer'&&!reply.trim())return alertUser('Provide an answer before checking.','error');
  const eid=globalThis.crypto?.randomUUID?.()||`course-try-${Date.now()}-${Math.random()}`;
  return mutate(s=>answerCourse(s,{response:reply,reveal:name==='course-reveal',id:eid}));
 }
 if(name==='course-advance'){const ok=await mutate(s=>advanceCourse(s));if(ok)courseTyped='';return;}
 if(name==='course-finish'){
  const j=state.courseJourney;if(!j||j.cursor!==5)return;
  const eid=globalThis.crypto?.randomUUID?.()||`course-done-${Date.now()}`;
  const ok=await mutate(s=>addLesson(finishCourse(s,{id:eid}),j.lessonId));
  if(ok){displayLessonId=courseNextLesson(state);courseTyped='';render();alertUser('Guided journey saved. The next connected lesson is ready. Missing review targets are due; no recall mastery was awarded.');}return;
 }
 if(name==='course-pause'){return go('today');}
 if(name==='course-abandon'){if(!confirm('Discard this unfinished journey? Previously saved course answers remain in your learning history.'))return;return mutate(s=>pauseCourse(s));}

 if(name==='open-senses'){senseFeedback=null;senseSupport=false;return go('senses');}
 if(name==='open-workshop'){sentenceFeedback=null;sentenceSupport=false;return go('workshop');}
 if(name==='sense-next'){senseIndex++;senseFeedback=null;senseSupport=false;return render();}
 if(name==='sense-support'){senseSupport=true;return render();}
 if(name==='sense-answer'||name==='sense-reveal'){
  if(senseFeedback)return;const item=senseCase(senseIndex),assisted=senseSupport||name==='sense-reveal';const answer=name==='sense-reveal'?'':button.dataset.option||'';const result=evaluateSense(item.id,answer);
  const id=globalThis.crypto?.randomUUID?.()||`sense-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addSenseEvent(s,{id,caseId:item.id,correct:result.correct,assisted}));if(ok){senseFeedback={...result,assisted};render();}return;
 }
 if(name==='workshop-next'){if(!sentenceFeedback&&sentenceTyped.trim()&&!c9ConfirmLeaveNativeAnswer())return;sentenceIndex++;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return render();}
 if(name==='workshop-support'){sentenceSupport=true;return render();}
 if(name==='workshop-check'||name==='workshop-reveal'){
  if(sentenceFeedback)return;const task=sentenceTask(sentenceIndex);if(name==='workshop-check'&&!sentenceTyped.trim())return alertUser('Enter your sentence first.','error');
  const result=checkSentence(task,name==='workshop-reveal'?'':sentenceTyped),assisted=sentenceSupport||name==='workshop-reveal';const id=globalThis.crypto?.randomUUID?.()||`sentence-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addSentenceEvent(s,{id,taskId:task.id,correct:result.correct,assisted}));if(ok){sentenceFeedback={...result,assisted};render();}return;
 }
 if(name==='mission-start'){dialogueSupport=false;missionStep=0;missionActive=true;missionSupport=false;missionTyped='';missionFeedback=null;return render();}
 if(name==='mission-exit'){missionActive=false;missionFeedback=null;return render();}
 if(name==='mission-support'){missionSupport=true;return render();}
 if(name==='mission-next'){if(missionStep===2){missionStep=0;missionActive=false;}else missionStep++;missionFeedback=null;missionSupport=false;missionTyped='';return render();}
 if(name==='mission-answer'||name==='mission-reveal'){
  if(!missionActive||missionFeedback)return;const q=missionQuestion(dialogueId,missionStep),response=name==='mission-reveal'?'':q.kind==='pinyin'?missionTyped:button.dataset.option||'';if(name==='mission-answer'&&!response.trim())return alertUser('Enter an answer first.','error');
  const result=gradeMission(q,response),assisted=missionSupport||p34TranscriptViewed||name==='mission-reveal';const id=globalThis.crypto?.randomUUID?.()||`mission-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addMissionEvent(s,{id,dialogueId,step:missionStep,correct:result.correct,assisted}));if(ok){missionFeedback={...result,assisted};render();}return;
 }
 if(name==='sense-weak'){const best=senseRepairQueue(state)[0];if(best){senseIndex=best.index;senseFeedback=null;senseSupport=false;render();}return;}
 if(name==='open-dialogues')return go('dialogues');
 if(name==='open-wordbook-practice'){wordbookFeedback=null;wordbookTyped='';return go('wordbook');}
 if(name==='dialogue-support'){dialogueSupport=!dialogueSupport;if(dialogueSupport&&findDialogue(dialogueId)?.p34)p34TranscriptViewed=true;if(dialogueSupport&&missionActive)missionSupport=true;return render();}
 if(name==='dialogue-prev'||name==='dialogue-next-context'){
  if(!c9ConfirmLeaveNativeAnswer('dialogues'))return false;
  p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;
  const step=name==='dialogue-prev'?-1:1;
  dialogueId=DIALOGUES[(DIALOGUES.findIndex(d=>d.id===dialogueId)+step+DIALOGUES.length)%DIALOGUES.length].id;
  dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;
  missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
  render();return true;
 }
 if(name==='dialogue-next'){
  if(!c9ConfirmLeaveNativeAnswer('dialogues'))return false;
  const d=findDialogue(dialogueId);if(!d)return false;
  p34ShadowLine=0;p33Branch=null;missionActive=false;missionFeedback=null;
  if(dialogueStep+1<d.questions.length){dialogueStep++;}
  else{dialogueId=DIALOGUES[(DIALOGUES.findIndex(x=>x.id===dialogueId)+1)%DIALOGUES.length].id;dialogueStep=0;p34TranscriptViewed=false;}
  dialogueFeedback=null;dialogueSupport=false;render();return true;
 }
 if(name==='dialogue-retry'){dialogueFeedback=null;return render();}
 if(name==='dialogue-answer'||name==='dialogue-reveal'){
  if(dialogueFeedback)return;const q=dialogueQuestion(dialogueId,dialogueStep);if(!q)return;
  const assisted=dialogueSupport||p34TranscriptViewed||name==='dialogue-reveal',response=name==='dialogue-reveal'?'':button.dataset.option||'';
  const eventId=globalThis.crypto?.randomUUID?.()||`dialogue-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addDialogueEvent(s,{id:eventId,dialogueId,question:dialogueStep,answer:response,assisted}));
  if(ok){dialogueFeedback={correct:response===q.answer,assisted};render();}return;
 }
 if(name==='vocabulary-resume'){if(state.vocabularyJourney){wordbookFocus='learning';wordbookFeedback=null;wordbookTyped='';return go('wordbook');}return;}
 if(name==='vocabulary-start'){const w=findWord(id);if(!w)return;const ok=await mutate(s=>beginVocabularyJourney(s,w.key));if(ok){wordbookFocus='learning';wordbookIndex=0;wordbookFeedback=null;wordbookTyped='';go('wordbook');}return;}
 if(name==='vocabulary-introduce'){if(!findWord(id))return;return mutate(s=>introduceVocabulary(s,id));}
 if(name==='vocabulary-end'){const ok=await mutate(s=>endVocabularyJourney(s));if(ok){wordbookFeedback=null;go('explore');}return;}
 if(name==='vocabulary-discover'){exploreSavedOnly=false;exploreKind='words';searchQuery='';explorePage=0;return go('explore');}
 if(name==='vocabulary-catalog'){exploreSavedOnly=false;exploreKind='words';searchQuery='';explorePage=0;return render();}
 if(name==='catalog-next'||name==='catalog-prev'){const count=visibleExploreResults().length;const max=Math.max(0,Math.ceil(count/90)-1);explorePage=Math.min(max,Math.max(0,explorePage+(name==='catalog-next'?1:-1)));return render();}
 if(name==='wordbook-switch'){if(state.vocabularyJourney)return;wordbookMode=WORD_PRACTICE_MODES[(WORD_PRACTICE_MODES.indexOf(wordbookMode)+1)%WORD_PRACTICE_MODES.length];wordbookFeedback=null;wordbookTyped='';return render();}
 if(name==='wordbook-next'){if(state.vocabularyJourney){const ok=await mutate(s=>advanceVocabularyJourney(s));if(!ok)return;}else wordbookIndex++;wordbookFeedback=null;wordbookTyped='';return render();}
 if(name==='wordbook-answer'||name==='wordbook-reveal'){
  if(wordbookFeedback)return;const j=state.vocabularyJourney;const mode=j?VOCABULARY_STEPS[j.step]:wordbookMode;const q=wordbookQuestion(state,wordbookIndex,mode,wordbookFocus,j?.key||null);if(!q)return;
  const response=name==='wordbook-reveal'?'':(q.kind==='pinyin'||q.kind==='typed')?wordbookTyped:button.dataset.option||'';
  if(name==='wordbook-answer'&&!response.trim())return alertUser('Enter an answer first.','error');
  const result=name==='wordbook-reveal'?{correct:false,reason:'assisted',message:'Answer revealed as teaching support.'}:gradeWordbookQuestion(q,response);
  const eventId=globalThis.crypto?.randomUUID?.()||`wordbook-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addWordPracticeEvent(s,{id:eventId,key:q.key,mode:q.mode,correct:!!result.correct,assisted:name==='wordbook-reveal'}));
  if(ok){wordbookFeedback=result;render();}return;
 }
 if(name==='speech-rate'){demoSpeechRate=({0.72:0.86,0.86:1,1:1.14,1.14:0.72})[demoSpeechRate]||0.86;return render();}
 if(name==='word-bookmark'){return mutate(s=>toggleWordBookmark(s,id));}
 if(name==='wordbook-filter'){exploreSavedOnly=!exploreSavedOnly;return render();}
 if(name==='open-wordbook'){exploreSavedOnly=true;exploreKind='words';searchQuery='';return go('explore');}
 if(name==='lesson-check-restart'){lessonCheckpoint={lessonId:displayLessonId,step:0,response:'',feedback:null};return render();}
 if(name==='lesson-check-next'){if(!lessonCheckpoint.feedback)return;lessonCheckpoint={lessonId:displayLessonId,step:lessonCheckpoint.step+1,response:'',feedback:null};return render();}
 if(name==='lesson-check-choice'||name==='lesson-check-submit'){
  if(lessonCheckpoint.feedback)return;const l=findLesson(displayLessonId);if(!l)return;
  const d=buildDrill(l.id,['recognition','word-meaning','word-pinyin'][lessonCheckpoint.step]);
  const response=name==='lesson-check-choice'?button.dataset.option:lessonCheckpoint.response;
  if(!response?.trim())return;lessonCheckpoint.feedback=gradeDrill(d,response);return render();}
 if(name==='storage-check'){if(!db)return alertUser('IndexedDB unavailable; cannot check storage.','error');try{
  const disk=await readState(db);const estimate=await navigator.storage?.estimate?.();
  const persist=await navigator.storage?.persisted?.();
  alertUser(`Local data read OK · revision ${disk.revision} · ${disk.events.length} review events. ${estimate?.quota?`Browser storage estimate: ${Math.round((estimate.usage||0)/1048576)} / ${Math.round(estimate.quota/1048576)} MB.`:''} Persistence: ${persist===true?'requested/granted':persist===false?'not guaranteed':'unknown'}. Export a backup for device-loss recovery.`);
 }catch(e){alertUser(`Storage check failed: ${e.message}`,'error');}return;}

 if(name==='placement-start'||name==='placement-restart'){const ok=await mutate(s=>startPlacement({...structuredClone(s),placement:null}));if(ok&&route()!=='today')go('today');return;}
 if(name==='placement-answer'){const response=button.dataset.option||'';return mutate(s=>answerPlacement(s,response));}
 if(name==='placement-skip'){return mutate(s=>skipPlacement(s));}
 if(name==='placement-lesson'||name==='coach-open-lesson'){if(findLesson(id)){displayLessonId=id;return go('learn');}return;}
 if(name==='coach-practice'){guidedFocus='weak';guidedLimit=10;return go('practice');}
 if(name==='connected-session'){guidedFocus='connected';guidedLimit=10;return go('practice');}
 if(name==='open-connected-item'){const t=button.dataset.type;if(t==='sense'){const i=SENSE_CASES.findIndex(c=>c.id===id);if(i>=0){senseIndex=i;senseFeedback=null;senseSupport=false;return go('senses');}}if(t==='sentence'){const i=SENTENCE_TASKS.findIndex(c=>c.id===id);if(i>=0){sentenceIndex=i;sentenceFeedback=null;sentenceSupport=false;return go('workshop');}}if(t==='mission'&&findDialogue(id)){dialogueId=id;dialogueStep=0;missionStep=Number(button.dataset.step)||0;missionActive=true;missionSupport=false;missionFeedback=null;return go('dialogues');}return alertUser('Learning connection unavailable.','error');}

 if(name==='guided-start'){const sid=globalThis.crypto?.randomUUID?.()||`practice-${Date.now()}`;const ok=await mutate(s=>({...structuredClone(s),practiceSession:createGuidedSession(s,{limit:guidedLimit,focus:guidedFocus,id:sid})}));if(ok){guidedTyped='';guidedOrder=[];guidedAssisted=false;}return;}
 if(name==='guided-explore'){const item=state.practiceSession?.items[state.practiceSession.cursor];if(!item)return;if(item.type==='sense'){senseIndex=Math.max(0,SENSE_CASES.findIndex(x=>x.id===item.id));return go('senses');}if(item.type==='sentence'){sentenceIndex=Math.max(0,SENTENCE_TASKS.findIndex(x=>x.id===item.id));return go('workshop');}if(item.type==='mission'){dialogueId=item.id;missionStep=item.step;missionActive=true;missionFeedback=null;return go('dialogues');}if(item.type==='story'){storyId=item.id;return go('stories');}displayLessonId=item.id;return go('learn');}
 if(name==='guided-pause'){guidedTyped='';guidedOrder=[];return go('today');}
 if(name==='guided-hint'){guidedAssisted=true;return mutate(s=>{const n=structuredClone(s);if(n.practiceSession&&!n.practiceSession.feedback)n.practiceSession.assistanceUsed=true;return n;});}
 if(name==='guided-order-add'){const q=guidedQuestion(state.practiceSession),i=Number(button.dataset.index);if(q?.kind==='ordering'&&Number.isInteger(i)&&i>=0&&i<q.chunks.length&&!guidedOrder.includes(i)){guidedOrder.push(i);render()}return;}
 if(name==='guided-order-remove'){const i=Number(button.dataset.index);if(Number.isInteger(i)&&i>=0&&i<guidedOrder.length){guidedOrder.splice(i,1);render()}return;}
 if(name==='guided-answer'||name==='guided-check'||name==='guided-reveal'){
  const q=guidedQuestion(state.practiceSession);if(!q||state.practiceSession.feedback)return;
  const response=name==='guided-reveal'?'':q.kind==='ordering'?guidedOrder.map(i=>q.chunks[i]).join(''):(q.kind==='pinyin'||q.kind==='hanzi')?guidedTyped:button.dataset.option||'';
  if(name!=='guided-reveal'&&!response.trim())return alertUser('Answer the question or reveal the reference.','error');
  const eid=globalThis.crypto?.randomUUID?.()||`guided-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>recordGuidedAnswer(s,{response,order:guidedOrder,assisted:guidedAssisted||Boolean(state.practiceSession?.assistanceUsed),reveal:name==='guided-reveal',eventId:eid}));
  if(!ok)alertUser('Your answer could not be saved; try again.','error');return;
 }
 if(name==='guided-next'){const ok=await mutate(s=>advanceGuidedSession(s));if(ok){guidedTyped='';guidedOrder=[];guidedAssisted=false;}return;}
 if(name==='guided-end'||name==='guided-abandon'){
  if(name==='guided-abandon'&&!confirm('End this session? Already saved practice answers will be retained.'))return;
  const ok=await mutate(s=>abandonGuidedSession(s));if(ok){guidedTyped='';guidedOrder=[];guidedAssisted=false;}return;
 }
 if(name==='open-story-link')return act({dataset:{action:'c9-media-open-story',id}});
 if(name==='go-settings')return go('settings');
 if(name==='go-learn')return go('learn');
 if(name==='go-progress')return go('progress');
 if(name==='open-stories'){
  if(!go('stories'))return false;resetStoryExercise();render();return true;
 }
 if(name==='open-practice'){resetDrill();return go('practice');}
 if(name==='practice-lesson'){drillLessonId=findLesson(id)?.id||DEMO_LESSONS[0].id;resetDrill();return go('practice');}
 if(name==='drill-next'){drillLessonId=DEMO_LESSONS[(DEMO_LESSONS.findIndex(l=>l.id===drillLessonId)+1)%DEMO_LESSONS.length].id;resetDrill();return render();}
 if(name==='drill-mode'){drillMode=button.dataset.mode;resetDrill();return render();}
 if(name==='drill-order-add'){const d=buildDrill(drillLessonId,drillMode),i=Number(button.dataset.index);if(d?.kind==='ordering'&&i>=0&&i<d.chunks.length&&!drillOrder.includes(i)){drillOrder.push(i);render()}return;}
 if(name==='drill-order-remove'){const i=Number(button.dataset.index);if(i>=0&&i<drillOrder.length){drillOrder.splice(i,1);render()}return;}
 if(name==='drill-hint'){drillAssisted=true;return render();}
 if(name==='drill-retry'){resetDrill();return render();}
 if(name==='drill-answer'||name==='drill-check'||name==='drill-reveal'){if(drillResult)return;const d=buildDrill(drillLessonId,drillMode);const response=name==='drill-reveal'?'':d.kind==='ordering'?drillOrder.map(i=>d.chunks[i]).join(''):d.kind==='pinyin'?drillTyped:button.dataset.option||'';if(name!=='drill-reveal'&&!response.trim())return alertUser('Complete an answer or reveal the reference.','error');const judged=name==='drill-reveal'?{correct:false,reason:'revealed',message:'Reference revealed; no independent success.'}:gradeDrill(d,response,drillOrder);drillResult={...judged,assisted:drillAssisted||name==='drill-reveal',answer:d.answer};const eid=globalThis.crypto?.randomUUID?.()||`drill-${Date.now()}-${Math.random()}`;const ok=await mutate(s=>addDrillRecord(s,drillLessonId,drillMode,judged.correct,drillResult.assisted,eid));if(!ok)alertUser('Drill answer was not saved.','error');return;}
 if(name==='story-bookmark'){const ok=await mutate(s=>toggleStoryBookmark(s,storyId));if(ok&&storiesOnlyBookmarked&&!(state.bookmarkedStories||[]).includes(storyId)){storyId=state.bookmarkedStories?.[0]||STORIES[0].id;if(!(state.bookmarkedStories||[]).length)storiesOnlyBookmarked=false;render();}return;}
 if(name==='story-bookmarks-only'){if(!storiesOnlyBookmarked&&!(state.bookmarkedStories||[]).length)return alertUser('Save a reading first to use the saved-only filter.');storiesOnlyBookmarked=!storiesOnlyBookmarked;if(storiesOnlyBookmarked&&!(state.bookmarkedStories||[]).includes(storyId))storyId=state.bookmarkedStories?.[0]||storyId;if(storiesOnlyBookmarked&&!(state.bookmarkedStories||[]).length)storiesOnlyBookmarked=false;return render();}
 if(name==='reading-text-size'){await mutate(s=>({...structuredClone(s),settings:{...s.settings,readingLarge:!s.settings.readingLarge}}));return;}
 if(name==='story-prev'){storyId=STORIES[(STORIES.findIndex(s=>s.id===storyId)-1+STORIES.length)%STORIES.length].id;resetReadingNavigation();if(findStory(storyId)?.beginner)storyMode='beginner-detail';return render();}
 if(name==='story-next'){if(!storyResult&&storyTyped.trim()&&!c9ConfirmLeaveNativeAnswer())return;storyId=STORIES[(STORIES.findIndex(s=>s.id===storyId)+1)%STORIES.length].id;resetReadingNavigation();if(findStory(storyId)?.beginner)storyMode='beginner-detail';return render();}
 if(name==='story-focus-next'){const story=findStory(storyId);storyFocusIndex=(storyFocusIndex+1)%story.lines.length;if(storyParagraphOnly&&story.extended)storyParagraph=paragraphFor(story,storyFocusIndex);return render();}
 if(name==='story-help-line'){const i=Number(button.dataset.index);if(!Number.isInteger(i)||i<0||i>=findStory(storyId).lines.length)return;storyHelpIndex=storyHelpIndex===i?-1:i;if(storyHelpIndex!==-1)storyAssist=true;return render();}
 if(name==='story-focus-off'){storyFocusIndex=-1;return render();}
 if(name==='story-mode'){const mode=button.dataset.mode;if(!['comprehension','cloze','ordering','pronunciation',...CONTEXT_MODES,...DEEP_READING_MODES.map(item=>item[0]),...BEGINNER_MODES.map(item=>item[0])].includes(mode)||DEEP_READING_MODES.some(([id])=>id===mode)&&!findStory(storyId)?.extended||BEGINNER_MODES.some(([id])=>id===mode)&&!findStory(storyId)?.beginner)return;storyMode=mode;resetStoryExercise();return render();}
 if(name==='story-token'){const entry=tokenizeSentence(findStory(storyId).lines.map(l=>l.hanzi).join('')).find(t=>t.entry?.hanzi===button.dataset.token)?.entry;if(!entry)return;storyGlossary=entry;storyAssist=true;return render();}
 if(name==='story-linked'){displayLessonId=button.dataset.id;return go('learn');}
 if(name==='story-reveal'){storyShowTranslation=!storyShowTranslation;c9StoryPinyin=storyShowTranslation;c9StoryEnglish=storyShowTranslation;if(storyShowTranslation)storyAssist=true;return render();}
 if(name==='story-order-add'){const i=Number(button.dataset.index),ex=storyExercise(findStory(storyId),storyMode);if(!Number.isInteger(i)||!ex||i<0||i>=ex.chunks.length||storySequence.includes(i))return;storySequence.push(i);return render();}
 if(name==='story-order-remove'){const i=Number(button.dataset.index);if(Number.isInteger(i)&&i>=0&&i<storySequence.length)storySequence.splice(i,1);return render();}
 if(name==='story-retry'){resetStoryExercise();return render();}
 if(name==='story-answer'||name==='story-check'||name==='story-skip'){
  if(storyResult)return;const story=findStory(storyId),deep=DEEP_READING_MODES.some(([mode])=>mode===storyMode),beginner=BEGINNER_MODES.some(([mode])=>mode===storyMode),ex=beginner?beginnerQuestion(story,storyMode):deep?deepReadingQuestion(story,storyMode):CONTEXT_MODES.includes(storyMode)?contextQuestion(storyId,storyMode):storyExercise(story,storyMode);if(!ex)return alertUser('This example is unavailable.','error');
  let entered=name==='story-skip'?'':storyMode==='ordering'?storySequence.map(i=>ex.chunks[i]).join(''):(storyMode==='pronunciation'||ex.kind==='hanzi')?storyTyped:button.dataset.option||'';
  if(name!=='story-skip'&&!entered.trim())return alertUser('Answer before checking, or choose Reveal answer.','error');
  const evaluation=name==='story-skip'?{correct:false,message:'Answer revealed without independent recall.'}:storyMode==='pronunciation'?toneExplanation(entered,ex.answer):ex.kind==='hanzi'?checkSentence(ex.task,entered):storyMode==='ordering'?{correct:storySequence.join(',')===ex.chunks.map((_,i)=>i).join(','),message:'The expected chunk order reconstructs the sentence.'}:evaluateAnswer(entered,ex.answer,'choice');
  const assisted=storyAssist||name==='story-skip',correct=Boolean(evaluation.correct);
  storyResult={correct,assisted,message:evaluation.detail||evaluation.message,entered,reference:ex.answer,explanation:ex.explanation||''};
  const eid=globalThis.crypto?.randomUUID?.()||`reading-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>ex.kind==='hanzi'&&(deep||beginner)?addSentenceEvent(s,{id:eid,taskId:ex.task.id,correct,assisted}):addReadingEvent(s,story.id,storyMode,correct,assisted,eid));
  if(!ok)alertUser('Answer checked but not saved. Export existing progress if storage is unreliable.','error');return;
 }
 if(name==='search-kind'){exploreKind=button.dataset.kind||'all';searchSelection=null;explorePage=0;return render();}
 if(name==='lookup-word'){
  const word=id?findWord(id):WORDS.find(w=>w.hanzi===button.dataset.word);
  if(!word){alertUser('Word not available in the indexed demo lessons.','error');return false;}
  const fromWriting=route()==='writing';
  if(route()!=='explore'&&!go('explore'))return false;
  searchSelection={type:'word',id:word.key};
  if(fromWriting)rememberC9NativeHandoff('writing','explore',word.key,c9WritingState.unitId);
  render();return true;
 }
 if(name==='c9-practice-jump'){const target=button.dataset.target;if(!['c9-native-guided','c9-native-drills'].includes(target))return;
   const section=root.querySelector('#'+target);if(section){section.scrollIntoView({block:'start',behavior:'smooth'});section.focus({preventScroll:true});}return;}
 if(name==='review-begin'){sessionQueue=reviewPlan(state,{now:Date.now(),focus:reviewFocus,limit:reviewSize}).map(item=>item.id);
  sessionDone=0;sessionCorrect=0;sessionSkipped=0;reviewInvalidated=0;reviewPaused=false;
  revealed=false;typedAnswer='';chosenOption='';checkResult=null;activeReviewId=null;render();
  announceC9Interaction(sessionQueue.length?'Scheduled review started. First question ready.':'No due cards matched this focus.');return;}
 if(name==='review-pause'){
  if(!sessionQueue?.length)return false;
  // Pause is a view change, not a discard or a grade. Keep the exact native
  // answer, feedback and selected option ready for resume in this tab.
  reviewPaused=true;render();
  announceC9Interaction('Review paused in this tab. Your current response and ungraded queue are retained.');
  return true;
 }
 if(name==='review-resume'){if(!sessionQueue?.length)return;reviewPaused=false;render();
  root.querySelector('#review-entry')?.focus({preventScroll:true});announceC9Interaction('Review resumed. Original due cards remain in the queue.');return;}
 if(name==='review-stop'){if(!sessionQueue)return;if(sessionQueue.length&&!confirm('Discard the remaining ungraded queue? Saved review grades will be preserved.'))return;
  sessionQueue=null;reviewPaused=false;reviewInvalidated=0;activeReviewId=null;revealed=false;typedAnswer='';chosenOption='';checkResult=null;
  render();announceC9Interaction('Ungraded queue discarded. Saved review history remains.');return;}
 if(name==='review-restart'){sessionQueue=null;reviewPaused=false;reviewInvalidated=0;activeReviewId=null;revealed=false;typedAnswer='';chosenOption='';checkResult=null;return render();}
 if(name==='review-skip'){if(reviewPaused||revealed||!sessionQueue?.length)return;sessionQueue.shift();sessionSkipped++;activeReviewId=null;typedAnswer='';chosenOption='';checkResult=null;render();announceC9Interaction('Question skipped without grading. '+sessionQueue.length+' prompts remain in this session.');return;}
 if(name==='open-reader'){readerLessonId=findLesson(displayLessonId)?.id||DEMO_LESSONS[0].id;readerResult=null;showLessonTranslation=false;return go('reader');}
 if(name==='reader-next'){const idx=DEMO_LESSONS.findIndex(l=>l.id===readerLessonId);readerLessonId=DEMO_LESSONS[(idx+1)%DEMO_LESSONS.length].id;readerResult=null;showLessonTranslation=false;return render();}
 if(name==='reader-mode'){readerMode=button.dataset.mode==='cloze'?'cloze':'meaning';readerResult=null;showLessonTranslation=false;return render();}
 if(name==='reader-answer'){if(readerResult)return;const lesson=readerLesson(),cloze=makeCloze(lesson),answer=readerMode==='cloze'&&cloze?cloze.answer:lesson.sentence.english;readerResult={answer:button.dataset.option,correct:button.dataset.option===answer};return render();}
 if(name==='reader-reveal'){showLessonTranslation=!showLessonTranslation;return render();}
 if(name==='start-next'){const next=summary(state).next;if(next){displayLessonId=next.id;c9LearnDetail=true;go('learn')}else go('review');return}
 if(name==='open-lesson')return act({dataset:{action:'c9-lesson-open',id}});
 if(name==='next-lesson'){
  const idx=DEMO_LESSONS.findIndex(l=>l.id===displayLessonId);
  const next=DEMO_LESSONS[idx+1];
  if(!next){alertUser('Last original lesson reached. Continue with Review or contextual study.');return false;}
  if(!c9ConfirmLeaveNativeAnswer('learn'))return false;
  displayLessonId=next.id;c9LearnDetail=true;c9LessonSection='overview';
  showLessonTranslation=state.settings.showPinyin;render();
  root.querySelector('.c9-lesson-header')?.scrollIntoView({block:'start'});return true;
 }
 if(name==='mark-studied'){if(!findLesson(id))return;const ok=await mutate(s=>addLesson(s,id));if(ok){alertUser(`Lesson introduced. ${cardsForLesson(id).length} distinct recall targets were added.`);const idx=DEMO_LESSONS.findIndex(l=>l.id===id);if(idx<DEMO_LESSONS.length-1){displayLessonId=DEMO_LESSONS[idx+1].id;render();}}return}
 if(name==='toggle-translation'){showLessonTranslation=!showLessonTranslation;render();return}
 if(name==='start-review'){
  if(!go('review'))return false;
  revealed=false;typedAnswer='';chosenOption='';checkResult=null;
  activeReviewId=null;sessionQueue=null;render();return true;
 }
 if(name==='review-pick'){if(reviewPaused||revealed||!sessionQueue?.length)return;chosenOption=button.dataset.option||'';render();root.querySelector('[data-action="review-pick"][aria-pressed="true"]')?.focus();return;}
 if(name==='submit-review'){if(reviewPaused||revealed||!activeReviewId)return;const info=cardInfo(activeReviewId);const answer=info.kind==='choice'?chosenOption:typedAnswer;if(!answer.trim())return alertUser('Enter or select an answer before checking.','error');checkResult=info.kind==='pinyin'?toneExplanation(answer,info.answer):evaluateAnswer(answer,info.answer,info.kind);revealed=true;render();announceC9Interaction(checkResult?.correct?'Answer checked: correct. Review feedback and grading actions are available.':'Answer checked. Compare your response with the reference and choose a grade.');return;}
 if(name==='reveal-review'){if(reviewPaused||revealed||!activeReviewId)return;checkResult={correct:false,reason:'assisted',message:'Answer revealed without independent recall.'};revealed=true;render();announceC9Interaction('Reference revealed; this response is assisted, not independent.');return}
 if(name==='grade'){
  if(reviewPaused||!revealed||!activeReviewId)return false;
  const c=activeReviewId,g=Number(button.dataset.grade);
  const assessment=checkResult;
  const eventId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;
  // A normal mutate() renders immediately. renderReview() can remove this now
  // non-due card before the grade handler shifts its queue, causing a second
  // shift that silently skips the next original prompt. Commit exactly once,
  // update this tab's queue exactly once, THEN render the native Review UI.
  const ok=await mutate(s=>{
   if(!dueCards(s).includes(c))throw Error('Review target was already updated in another tab. No duplicate grade written.');
   return gradeCard(s,c,g,Date.now(),eventId,{
    correct:Boolean(assessment?.correct),assisted:assessment?.reason==='assisted',
    errorType:assessment?.reason
   });
  },{renderAfter:false});
  if(!ok)return false;
  sessionDone++;
  if(assessment?.correct)sessionCorrect++;
  if(sessionQueue?.[0]===c)sessionQueue.shift();
  revealed=false;typedAnswer='';chosenOption='';checkResult=null;
  activeReviewId=null;
  render();
  announceC9Interaction('Native review grade saved. '+(sessionQueue?.length||0)+' prompts remain.');
  return true;
 }
 if(name==='speak')return speak(button.dataset.text||'',button.dataset.rate==='slow'?0.68:demoSpeechRate);
 if(name==='speech-stop'){stopC9Speech(true);return;}
 if(name==='select-explore'){const typ=button.dataset.type;searchSelection=typ==='word'&&findWord(id)?{type:'word',id}:typ==='character'&&findLesson(id)?{type:'character',id}:null;return render();}
 if(name==='export'){try{validateState(state);const content=JSON.stringify(backupDocument(state),null,2);const blob=new Blob([content],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`character-study-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);alertUser('Backup export started. Confirm the file was saved on your device.');}catch(e){alertUser(`Backup failed: ${e.message}`,'error')}return}
 if(name==='import-open')return $('import-file')?.click();
 if(name==='reset'){if(!confirm('Delete all demo learning progress in this browser? Export a backup first if you want to keep it.'))return;const cleared=await mutate(_=>freshState());if(cleared){pendingRestore=null;restoreAcknowledgement='';}return}
}
document.querySelector('.topbar')?.addEventListener('click',ev=>{if(ev.target.closest('[data-action="go-settings"]'))go('settings')});
document.addEventListener('click',ev=>{
 const link=ev.target.closest?.('a[href^="#/"]');
 if(!link||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
 const target=(link.getAttribute('href').match(/^#\/(\w+)/)||[])[1];
 if(target&&target!==c9RenderedRoute){
  if(!c9ConfirmLeaveNativeAnswer(c9RenderedRoute))ev.preventDefault();
  else c9ApprovedDeparture={from:c9RenderedRoute,to:target};
 }
},true);
function renderC9OptionalHomePanels(){
 return gated()+hubHomePanel()+pathwayHomePanel(state,action,esc)+
  beginnerReadingTodayPanel()+connectedReadingTodayPanel()+
  sentenceTodayPanel()+grammarTodayPanel()+pinyinTodayPanel()+
  vocabularyTodayPanel()+finishOverviewPanel();
}
// The optional source-rich diagnostics are not part of first meaningful Home
// content. Generate them only upon the learner opening their native disclosure.
// No additional DB, state engine, navigation destination or grade is created.
root.addEventListener('toggle',event=>{
 const disclosure=event.target;
 if(!disclosure.matches?.('details.c9-home-extra')||!disclosure.open)return;
 const destination=disclosure.querySelector('[data-c9-lazy-home="pending"]');
 if(!destination)return;
 destination.innerHTML=renderC9OptionalHomePanels();
 destination.removeAttribute('data-c9-lazy-home');
},true);
root.addEventListener('click',ev=>{const b=ev.target.closest('[data-action]');if(b){ev.preventDefault();void act(b);}});
root.addEventListener('input',e=>{
 if(handleC9WritingInput(e,root))return;
 if(e.target.id==='c9-skills-query'){
  c9SkillsUi.query=e.target.value;c9SkillsUi.page=0;
  const target=root.querySelector('#c9-skills-results');
  if(target){
   const template=document.createElement('template');
   template.innerHTML=renderC9SkillsWorkspace(state,c9SkillsUi,action,esc);
   const next=template.content.querySelector('#c9-skills-results');
   if(next)target.innerHTML=next.innerHTML;
  }
  return;
 }
 if(e.target.id==='c9-advanced-query'){c9AdvancedQuery=e.target.value;c9AdvancedPage=0;refreshC9AdvancedResults();return;}
 if(e.target.id==='c9-reading-query'){c9ReadingQuery=e.target.value;c9ReadingPage=0;refreshC9MediaCatalog('reading');return;}
 if(e.target.id==='c9-dialogue-query'){c9DialogueQuery=e.target.value;c9DialoguePage=0;refreshC9MediaCatalog('dialogue');return;}
 if(e.target.id==='c9-word-query'){c9WordQuery=e.target.value;c9WordPage=0;refreshC9Words();return;}

 if(e.target.id==='c9-learn-query'){c9LearnQuery=e.target.value;c9LearnPage=0;refreshC9DiscoveryResults();return;}

 if(e.target.id==='p33-scenario-query'){
  p33Query=e.target.value;
  const q=p33Query.trim().toLocaleLowerCase();
  let visible=0;
  for(const button of root.querySelectorAll('.p33-scene-grid .p33-scene-item')){
   const scene=findP33Scenario(button.dataset.id);
   const values=[scene?.title,scene?.theme,scene?.goal,scene?.pragmatics,...(scene?.vocabulary||[]).flatMap(w=>[w.hanzi,w.pinyin,w.english])];
   const match=!q||values.some(v=>String(v||'').toLocaleLowerCase().includes(q));
   button.hidden=!match;
   if(match)visible++;
  }
  const message=root.querySelector('.p33-no-results');
  if(message)message.hidden=visible!==0;
  return;
 }
 if(e.target.id==='p30-query'){
 p30Query=e.target.value;p30Page=0;
 const results=$('p30-results');if(results)results.innerHTML=courseSearchResults({query:p30Query,kind:p30Kind,saved:p30Saved,page:0,state},action,esc).html;
 refreshC9FindWorkbench();return;
}if(e.target.id==='p29-transfer-draft'){pathwayTransferDraft=e.target.value;return;}if(e.target.id==='pathway-write'){pathwayTyped=e.target.value;const b=root.querySelector('[data-action="pathway-answer"]');if(b)b.disabled=!pathwayTyped.trim();return;}if(e.target.id==='restore-ack'){restoreAcknowledgement=e.target.value;const b=root.querySelector('[data-action="restore-confirm"]');if(b)b.disabled=!restoreRequiresAcknowledgement(pendingRestore?.preview,restoreAcknowledgement);return;}if(e.target.id==='fluency-entry'){fluencyTyped=e.target.value;const b=root.querySelector('[data-action="fluency-answer"]');if(b)b.disabled=!fluencyTyped.trim();return;}if(e.target.id==='trail-entry'){trailTyped=e.target.value;const b=root.querySelector('[data-action="trail-answer"]');if(b)b.disabled=!trailTyped.trim();return;}if(e.target.id==='block-entry'){blockTyped=e.target.value;const b=root.querySelector('[data-action="block-answer"]');if(b)b.disabled=!blockTyped.trim();return;}if(e.target.id==='ladder-entry'){ladderTyped=e.target.value;const b=root.querySelector('[data-action="ladder-answer"]');if(b)b.disabled=!ladderTyped.trim();return;}if(e.target.id==='repair-entry'){repairTyped=e.target.value;const b=root.querySelector('[data-action="repair-answer"]');if(b)b.disabled=!repairTyped.trim();return;}if(e.target.id==='course-entry'){courseTyped=e.target.value;const b=root.querySelector('[data-action="course-answer"]');if(b)b.disabled=!courseTyped.trim();return;}if(e.target.id==='mission-entry'){missionTyped=e.target.value;const b=root.querySelector('[data-action="mission-answer"]');if(b)b.disabled=!missionTyped.trim();return;}if(e.target.id==='workshop-entry'){sentenceTyped=e.target.value;const b=root.querySelector('[data-action="workshop-check"]');if(b)b.disabled=!sentenceTyped.trim();return;}if(e.target.id==='lesson-check-entry'){lessonCheckpoint.response=e.target.value;const b=root.querySelector('[data-action="lesson-check-submit"]');if(b)b.disabled=!lessonCheckpoint.response.trim();return;}if(e.target.id==='sentence-library-entry'){
 libraryTyped=e.target.value;
 const button=root.querySelector('[data-action="sentence-answer"]');if(button)button.disabled=!libraryTyped.trim();return;
}
if(e.target.id==='sentence-library-query'){
 libraryQuery=e.target.value;libraryPage=0;
 const panel=$('sentence-results');if(panel)panel.innerHTML=sentenceResultsPanel({selected:selectedLibraryId(),query:libraryQuery,
 topic:libraryTopic,area:libraryArea,difficulty:libraryDifficulty,grammar:libraryGrammar,purpose:libraryPurpose,tone:libraryTone,savedOnly:librarySavedOnly,page:0,learner:state},action,esc).html;
 return;
}
if(e.target.id==='grammar-entry'){grammarTyped=e.target.value;const b=root.querySelector('[data-action="grammar-answer"]');if(b)b.disabled=!grammarTyped.trim();return;}if(e.target.id==='grammar-query'){grammarQuery=e.target.value;for(const item of root.querySelectorAll('[data-grammar-search]'))item.hidden=!item.dataset.grammarSearch.includes(grammarQuery.toLowerCase());return;}if(e.target.id==='pinyin-answer-entry'){pinyinTyped=e.target.value;const button=root.querySelector('[data-action="pinyin-answer"]');if(button)button.disabled=!pinyinTyped.trim();return;}if(e.target.id==='wordbook-entry'){wordbookTyped=e.target.value;const b=root.querySelector('[data-action="wordbook-answer"]');if(b)b.disabled=!wordbookTyped.trim();return;}if(e.target.id==='guided-entry'){guidedTyped=e.target.value;const b=root.querySelector('[data-action="guided-check"]');if(b)b.disabled=!guidedTyped.trim();return;}if(e.target.id==='drill-entry'){drillTyped=e.target.value;const b=root.querySelector('[data-action="drill-check"]');if(b)b.disabled=!drillTyped.trim();return;}if(e.target.id==='story-entry'){storyTyped=e.target.value;const b=root.querySelector('[data-action="story-check"]');if(b)b.disabled=!storyTyped.trim();return;}if(e.target.id==='review-entry'){typedAnswer=e.target.value;const check=root.querySelector('[data-action="submit-review"]');if(check)check.disabled=!typedAnswer.trim();return;}if(e.target.id==='explore-query'){searchQuery=e.target.value;explorePage=0;const matches=visibleExploreResults();$('search-count').textContent=`${matches.length} results · ${WORDS.length} distinct demo word entries · Browsing never changes mastery.`;$('explore-results').innerHTML=renderSearchResults(matches);if($('explore-pager'))$('explore-pager').innerHTML=catalogPager(matches.length);}});
root.addEventListener('change',async e=>{
 if(await handleC9WritingBackupFile(e,{render,alertUser,currentRoute:route}))return;
 if(e.target.id==='c9-advanced-phase-select'){
  const phase=findC9AdvancedPhase(e.target.value);
  if(phase)return act({dataset:{action:'c9-advanced-phase',phase:String(phase.phase)}});
  return;
 }
 if(e.target.id==='c9-reading-filter'){if(!['all','unattempted','repair','saved','independent'].includes(e.target.value))return;c9ReadingFilter=e.target.value;c9ReadingPage=0;refreshC9MediaCatalog('reading');return;}
 if(e.target.id==='c9-dialogue-filter'){if(!['all','unattempted','repair','independent','listening'].includes(e.target.value))return;c9DialogueFilter=e.target.value;c9DialoguePage=0;refreshC9MediaCatalog('dialogue');return;}
 if(e.target.id==='c9-word-status'){if(!C9_WORD_FILTERS.includes(e.target.value))return;c9WordFilter=e.target.value;c9WordPage=0;refreshC9Words();return;}

 if(e.target.id==='c9-learn-unit'||e.target.id==='c9-learn-status'){
   if(e.target.id==='c9-learn-unit'){
     const value=e.target.value;
     if(value!=='all'&&!lessonGroups().some(g=>String(g.index)===value))return;
     c9LearnUnit=value;
   }else{
     if(!['all','new','introduced'].includes(e.target.value))return;
     c9LearnStatus=e.target.value;
   }
   c9LearnPage=0;refreshC9DiscoveryResults();return;
 }
 if(e.target.id==='c9-learn-saved'){c9LearnSaved=e.target.checked;refreshC9DiscoveryResults();return;}
if(e.target.id==='p30-saved'){p30Saved=e.target.checked;p30Page=0;return render();}

 const setting=e.target.dataset.setting;
 if(setting){const value=setting==='dailyNew'?Number(e.target.value):Boolean(e.target.checked);await mutate(s=>{const n=structuredClone(s);n.settings[setting]=value;return n});return;}
 if(e.target.id==='ladder-lesson'){if(findLesson(e.target.value)){displayLessonId=e.target.value;return render();}return;}if(e.target.id==='course-lesson-picker'){if(findLesson(e.target.value)){displayLessonId=e.target.value;return render();}return;}if(['sentence-library-collection','sentence-library-topic','sentence-library-area','sentence-library-level','sentence-library-grammar','sentence-library-purpose','sentence-library-tone'].includes(e.target.id)){
 if(e.target.id==='sentence-library-collection')librarySource=e.target.value;
  else if(e.target.id==='sentence-library-topic')libraryTopic=e.target.value;
 else if(e.target.id==='sentence-library-area')libraryArea=e.target.value;
 else if(e.target.id==='sentence-library-level')libraryDifficulty=e.target.value;
 else if(e.target.id==='sentence-library-grammar')libraryGrammar=e.target.value;
 else if(e.target.id==='sentence-library-purpose')libraryPurpose=e.target.value;
 else libraryTone=e.target.value;
 libraryPage=0;render();return;
}
if(e.target.id==='sentence-library-saved'){librarySavedOnly=e.target.checked;libraryPage=0;render();return;}
if(e.target.id==='grammar-chapter-select'){const chapter=GRAMMAR_CHAPTERS.find(c=>String(c.number)===e.target.value);if(!chapter){grammarChapter='all';return render();}grammarChapter=e.target.value;openGrammarLesson(chapter.lessons[0]);return;}if(e.target.id==='pinyin-filter'){pinyinFilter=e.target.value;pinyinIndex=0;pinyinFeedback=null;pinyinTyped='';render();return;}if(e.target.id==='wordbook-mode'){if(WORD_PRACTICE_MODES.includes(e.target.value)&&!state.vocabularyJourney){wordbookMode=e.target.value;wordbookFeedback=null;wordbookTyped='';render();}return;}if(e.target.id==='wordbook-focus'){wordbookFocus=e.target.value;wordbookIndex=0;wordbookFeedback=null;wordbookTyped='';render();return;}if(e.target.id==='dialogue-choice'){if(findDialogue(e.target.value)){p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;dialogueId=e.target.value;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;missionActive=false;missionStep=0;missionFeedback=null;render();}return;}if(e.target.id==='guided-size'){guidedLimit=Number(e.target.value);return;}if(e.target.id==='guided-focus'){guidedFocus=e.target.value;return;} if(e.target.id==='drill-lesson'){if(findLesson(e.target.value)){drillLessonId=e.target.value;resetDrill();render();}return;}if(e.target.id==='review-focus'){reviewFocus=e.target.value;return render();}if(e.target.id==='review-size'){reviewSize=Number(e.target.value);return render();}if(e.target.id==='story-choice'){if(findStory(e.target.value)){storyId=e.target.value;resetReadingNavigation();if(findStory(storyId)?.beginner)storyMode='beginner-detail';render();}return;}if(e.target.id==='reader-lesson'){readerLessonId=e.target.value;readerResult=null;showLessonTranslation=false;render();return;}
 if(e.target.id==='import-file'&&e.target.files?.length){if(!db)return;try{const file=e.target.files[0];if(file.size>MAX_BACKUP_BYTES)throw new Error('Backup exceeds 8 MB size limit');const doc=JSON.parse(await file.text());const inspected=previewBackup(doc,state,{bytes:file.size});pendingRestore={learner:importBackup(doc),preview:inspected};restoreAcknowledgement='';e.target.value='';go('settings');render();alertUser('Backup validated. Review the comparison below before choosing to replace any learner data.');}catch(err){pendingRestore=null;restoreAcknowledgement='';alertUser(`Import rejected: ${err.message}`,'error')}}
});
document.addEventListener('keydown',e=>{if(route()==='sentences'&&e.code==='Enter'&&e.ctrlKey&&e.target.id==='sentence-library-entry'){
 e.preventDefault();const button=root.querySelector('[data-action="sentence-answer"]');if(button&&!button.disabled)void act(button);return;
}if(route()==='grammar'&&e.code==='Enter'&&e.target.id==='grammar-entry'&&e.ctrlKey){e.preventDefault();const button=root.querySelector('[data-action="grammar-answer"]');if(button&&!button.disabled)void act(button);return;}if(route()==='pinyin'&&e.code==='Enter'&&e.target.id==='pinyin-answer-entry'){e.preventDefault();const button=root.querySelector('[data-action="pinyin-answer"]');if(button&&!button.disabled)void act(button);return;}if(route()==='fluency'&&e.code==='Enter'&&e.target.id==='fluency-entry'){e.preventDefault();const b=root.querySelector('[data-action="fluency-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='block'&&e.code==='Enter'&&e.target.id==='trail-entry'){e.preventDefault();const b=root.querySelector('[data-action="trail-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='block'&&e.code==='Enter'&&e.target.id==='block-entry'){e.preventDefault();const b=root.querySelector('[data-action="block-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='ladder'&&e.code==='Enter'&&e.target.id==='ladder-entry'){e.preventDefault();const b=root.querySelector('[data-action="ladder-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='journey'&&e.code==='Enter'&&e.target.id==='repair-entry'){e.preventDefault();const btn=root.querySelector('[data-action="repair-answer"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()==='journey'&&e.code==='Enter'&&e.target.id==='course-entry'){e.preventDefault();const btn=root.querySelector('[data-action="course-answer"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()==='learn'&&e.code==='Enter'&&e.target.id==='lesson-check-entry'){e.preventDefault();const btn=root.querySelector('[data-action="lesson-check-submit"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()==='practice'&&e.code==='Enter'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.isComposing){
  const target=e.target.id,actionName=target==='guided-entry'?'guided-check':target==='drill-entry'?'drill-check':null;
  if(actionName){const button=root.querySelector('[data-action="'+actionName+'"]');if(button&&!button.disabled){e.preventDefault();void act(button);}return;}
 }
 if(route()!=='review'||reviewPaused||e.altKey||e.ctrlKey||e.metaKey||e.isComposing)return;
 const editing=e.target.closest('input,textarea,select,[contenteditable]');
 if(!revealed&&e.code==='Enter'&&e.target.id==='review-entry'){e.preventDefault();const btn=root.querySelector('[data-action="submit-review"]');if(btn&&!btn.disabled)void act(btn);return;}
 if(editing)return;
 if(!revealed&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){
  const btn=[...root.querySelectorAll('[data-action="review-pick"]')][Number(e.code.slice(-1))-1];if(btn){e.preventDefault();void act(btn)}return;}
 if(!revealed&&e.code==='Enter'){const btn=root.querySelector('[data-action="submit-review"]');if(btn&&!btn.disabled){e.preventDefault();void act(btn)}return;}
 if(!revealed&&e.code==='KeyS'){const btn=root.querySelector('[data-action="review-skip"]');if(btn){e.preventDefault();void act(btn)}return;}
 if(!reviewPaused&&revealed&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){e.preventDefault();const btn=root.querySelector(`[data-action="grade"][data-grade="${Number(e.code.slice(-1))-1}"]`);if(btn)void act(btn)}
});
// Browser history can switch the historical lesson ID without switching routes.
// Resolve only genuine original IDs; malformed hashes never install a new source.
function c9HashLearningSource(screen,hash){
 const patterns={
  grammar:/^#\/grammar\/(g\d{2})$/,
  sentences:/^#\/sentences\/(sent-\d{3})$/,
  pathway:/^#\/pathway\/(path-\d{2})$/
 };
 const id=hash?.match(patterns[screen])?.[1];
 if(!id)return null;
 return screen==='grammar'?(findGrammarLesson(id)?id:null):
  screen==='sentences'?(findLibrarySentence(id)?id:null):
  screen==='pathway'?(findPathwayMission(id)?id:null):null;
}
window.addEventListener('hashchange',()=>{
 const destination=route(),previous=c9RenderedRoute;
 const previousHash=c9RenderedHash||('#/'+previous);
 const currentHash=location.hash;
 const approved=c9ApprovedDeparture?.from===previous&&
  c9ApprovedDeparture?.to===destination;
 c9ApprovedDeparture=null;
 const previousSource=c9HashLearningSource(previous,previousHash);
 const targetSource=c9HashLearningSource(destination,currentHash);
 const sameScreenSourceChanged=destination===previous&&Boolean(targetSource)&&
  targetSource!==(previousSource||(previous==='grammar'?grammarSelected:
   previous==='sentences'?librarySelected:pathwaySelected));
 // Going from a P29 mission to its band index is a source departure even
 // though the route name stays 'pathway' and the new hash has no source ID.
 const pathwayMissionExit=previous==='pathway'&&
  /^#\/pathway\/path-\d{2}$/.test(previousHash)&&currentHash!==previousHash&&!targetSource;
 // Back/Forward and pasted deep links do not go through the original native
 // controller. Guard both route changes and same-route source changes.
 if((destination!==previous||sameScreenSourceChanged||pathwayMissionExit)&&!approved&&
  !c9ConfirmLeaveNativeAnswer(previous)){
  history.replaceState(null,'',previousHash);
  return;
 }
 if(destination!==previous||sameScreenSourceChanged||pathwayMissionExit){stopC9Speech();if(previous==='pathway')pathwayTransferDraft='';}
 // Following a *real* approved hash transition, synchronize source-specific
 // local input with the displayed original source, never with an old lesson.
 if(destination==='grammar'&&targetSource&&targetSource!==grammarSelected){
  grammarSelected=targetSource;
  grammarChapter=String(findGrammarLesson(targetSource).chapterNumber);
  grammarQuery='';grammarSessionReset();
 }
 if(destination==='sentences'&&targetSource&&targetSource!==librarySelected){
  librarySelected=targetSource;sentenceUiReset();
 }
 if(destination==='pathway'&&targetSource&&targetSource!==pathwaySelected){
  pathwaySelected=targetSource;pathwayReset();
 }
 if(destination==='character'){
  const characterId=currentHash.match(/^#\/character\/(demo-\d{2,3})$/)?.[1];
  if(characterId&&findLesson(characterId))displayLessonId=characterId;
 }
 if(previous==='writing'&&destination!=='writing')cancelC9WritingFileRead();
 if(sessionQueue?.length&&destination!=='review')reviewPaused=true;
 revealed=false;typedAnswer='';chosenOption='';checkResult=null;
 render();window.scrollTo(0,0);
 announceC9Route(C9_ROUTE_LABELS[destination]||'Home',$('main'));
if(c9ReturnFocus){
 const focus=root.querySelector('#'+c9ReturnFocus);
 c9ReturnFocus=null;
 if(focus){focus.scrollIntoView({block:'start',behavior:'auto'});focus.focus({preventScroll:true});}
}
if(c9SearchFocusPending&&route()==='find'){root.querySelector('#p30-query')?.focus({preventScroll:true});c9SearchFocusPending=false;}});
window.addEventListener('online',networkLabel);window.addEventListener('offline',networkLabel);
function networkLabel(){
 const online=navigator.onLine;
 const status=c9OfflineShell==='ready'?'Offline shell active':
  c9OfflineShell==='installing'?'Preparing offline content':
  c9OfflineShell==='checking'?'Checking offline setup':
  c9OfflineShell==='outdated'?'Previous offline version active · reload online':
  c9OfflineShell==='incomplete'?'Offline cache incomplete':'Offline shell not ready';
 $('network-state').textContent='Local data · '+(online?'Online':'Offline')+' · '+status;
 const homeStatus=$('c9-home-connectivity');
 if(homeStatus)homeStatus.textContent=(online?'Online':'Offline')+' · '+status;
 const homeNotice=$('c9-home-offline-notice');
 if(homeNotice){
  homeNotice.hidden=online;
  const message=homeNotice.querySelector('span');
  if(message)message.textContent=c9OfflineShell==='ready'?
   'All original static source URLs are cached according to this service worker. Actual offline lessons and local progress still need device verification.':
   c9OfflineShell==='outdated'?
   'The active offline worker belongs to an earlier version. Reconnect and reload online to finish updating the current original static sources.':
   'Offline static source coverage is incomplete or not verified. Reconnect to prepare missing material.';
 }
 // This control must follow asynchronous controller/status changes. Previously
 // Home built it once, so a completed install left a stale repair button, while
 // a later incomplete install offered no repair until navigating away/back.
 const repair=$('c9-home-offline-repair');
 if(repair){
  repair.hidden=!online||!['checking','incomplete'].includes(c9OfflineShell);
  const count=repair.querySelector('[data-c9-offline-count]');
  if(count)count.textContent=c9OfflineCoverage?
   c9OfflineCoverage.cached+' / '+c9OfflineCoverage.total+' static assets cached on this device.':
   'Cache coverage has not yet been verified by this service worker.';
 }
 const upgrade=$('c9-home-offline-upgrade');
 if(upgrade)upgrade.hidden=!online||c9OfflineShell!=='outdated';
}
// Read-only SW cache integrity check. No network, learner state, local
// storage or background authority is involved.
let c9OfflineCheck=0;
async function verifyC9OfflineShell(requestType='c9-offline-status'){
 const controller=navigator.serviceWorker?.controller;
 const generation=++c9OfflineCheck;
 if(!controller){c9OfflineShell='installing';networkLabel();return;}
 c9OfflineShell=requestType==='c9-offline-repair'?'installing':'checking';
 c9OfflineCoverage=null;networkLabel();
 const report=await new Promise(resolve=>{
  const channel=new MessageChannel();let finished=false;
  const finish=value=>{
   if(finished)return;finished=true;clearTimeout(timeout);
   channel.port1.close();resolve(value);
  };
  const timeout=setTimeout(()=>finish(null),
   requestType==='c9-offline-repair'?30000:2500);
  channel.port1.onmessage=event=>finish(event.data);
  try{controller.postMessage({type:requestType},[channel.port2]);}
  catch{finish(null);}
 });
 if(generation!==c9OfflineCheck||navigator.serviceWorker.controller!==controller)return;
 // A complete cache for the PREVIOUS service worker is not sufficient.
 // Ensure both the cache protocol and original static manifest are from the
 // current app revision before exposing offline readiness or repair controls.
 const wellFormed=report?.type==='c9-offline-status'&&
  Number.isInteger(report.cached)&&Number.isInteger(report.total)&&
  report.total>0&&report.cached>=0&&report.cached<=report.total&&
  typeof report.version==='string'&&typeof report.complete==='boolean'&&
  typeof report.failed==='boolean';
 const current=wellFormed&&report.version===C9_EXPECTED_OFFLINE_CACHE&&
  report.total===C9_EXPECTED_OFFLINE_ASSETS;
 c9OfflineCoverage=current?{cached:report.cached,total:report.total}:null;
 c9OfflineShell=!wellFormed?'checking':!current?'outdated':
  report.complete===true&&report.failed===false&&report.cached===report.total?
  'ready':'incomplete';
 networkLabel();
}
async function setupSW(){
 if(!('serviceWorker' in navigator)||location.protocol==='file:'){
  c9OfflineShell='unsupported';networkLabel();return;
 }
 c9OfflineShell=navigator.serviceWorker.controller?'checking':'installing';
 networkLabel();
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  void verifyC9OfflineShell();
 });
 try{
  const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
  const installing=registration.installing;
  if(installing){
   installing.addEventListener('statechange',()=>{
    if(installing.state==='redundant'&&!navigator.serviceWorker.controller){
     ++c9OfflineCheck;c9OfflineShell='failed';networkLabel();
    }else if(installing.state==='activated'){
     void verifyC9OfflineShell();
    }
   });
  }
  if(navigator.serviceWorker.controller)await verifyC9OfflineShell();
  else{c9OfflineShell=registration.installing?'installing':'checking';networkLabel();}
 }catch(error){
  if(navigator.serviceWorker.controller)await verifyC9OfflineShell();
  else{++c9OfflineCheck;c9OfflineShell='failed';networkLabel();}
  console.warn('Offline shell unavailable',error);
 }
}
async function init(){networkLabel();if('BroadcastChannel'in window){channel=new BroadcastChannel('character-study-v2');channel.onmessage=async()=>{if(db){try{state=await readState(db);render()}catch(e){alertUser(`State refresh failed: ${e.message}`,'error')}}};}
 try{db=await openDatabase();state=await readState(db);validateState(state);const migration=upgradedState(state);if(migration)state=await updateState(db,_=>migration);render();}catch(e){storageError=e;render();alertUser(`Local storage unavailable: ${e.message}. The app is read-only until storage works.`,'error');}
 // Offline installation is never a prerequisite for drawing the current
 // learner's dashboard. Let the first paint and interaction take priority;
 // the existing 317-file offline contract and repair flow are unchanged.
 if(typeof window.requestIdleCallback==='function')
  window.requestIdleCallback(()=>void setupSW(),{timeout:3000});
 else setTimeout(()=>void setupSW(),1000);}
connectC9Shell();
installC9KeyboardHelp();
init();
