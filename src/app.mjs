import { DEMO_LESSONS, demoSearch, findLesson } from './demo-lessons.mjs';
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
import {P37_SCENES,P37_THEMES,findP37Scene} from './p37-scenarios.mjs';
import {p37Overview,p37Teaching} from './p37-screen.mjs';
import {P42_SCENES,P42_WRITING_TASKS,findP42Scene,p42Evidence} from './p42-course.mjs';
import {p42Overview,p42ListeningPanel,p42Next} from './p42-screen.mjs';
import {P43_UNITS,findP43Unit,P43_WRITING_TASKS,P43_REVIEW_CRITERIA} from './p43-course.mjs';
import {p43Overview,p43ProductionStudio} from './p43-screen.mjs';
import {P44_SCENARIOS,P44_PHASES,findP44Scenario,P44_WRITING_TASKS} from './p44-course.mjs';
import {p44Overview,p44Journey,p44Next} from './p44-screen.mjs';
import {P45_TRANSFERS,findP45Transfer,P45_WRITING_TASKS} from './p45-course.mjs';
import {p45Recommendations,p45EvidenceFor,p45Summary} from './p45-review.mjs';
import {p45Overview,p45Learning} from './p45-screen.mjs';
import {P46_PASSAGES,findP46Passage} from './p46-readings.mjs';
import {P46_CHARACTER_GUIDES,findP46Guide} from './p46-foundations.mjs';
import {P46_DIALOGUES,findP46Dialogue} from './p46-dialogues.mjs';
import {p46Overview,p46Lesson,p46Next,p46Story,p46NativeDialogue,P46_STAGES} from './p46-screen.mjs';
import {P47_PASSAGES,findP47Passage} from './p47-readings.mjs';
import {P47_CHARACTER_GUIDES,findP47Guide} from './p47-foundations.mjs';
import {P47_DIALOGUES} from './p47-dialogues.mjs';
import {p47Overview,p47Lesson,p47Next,p47Story,p47NativeDialogue,P47_STAGES} from './p47-screen.mjs';
import {P48_PASSAGES,findP48Passage} from './p48-readings.mjs';
import {P48_DIALOGUES} from './p48-dialogues.mjs';
import {findP48Argument,P48_REVISION_CHECKS} from './p48-arguments.mjs';
import {p48Overview,p48Lesson,p48Next,p48Story,p48NativeDialogue,P48_STAGES} from './p48-screen.mjs';
import {P49_CASES,findP49Case,P49_FOCUS_GROUPS} from './p49-course.mjs';
import {p49Recommendations,p49Evidence,p49NativeDialogue} from './p49-review.mjs';
import {p49Overview,p49Lesson,P49_STAGES} from './p49-screen.mjs';
import {P50_PASSAGES,findP50Passage} from './p50-readings.mjs';
import {P50_DIALOGUES} from './p50-dialogues.mjs';
import {findP50Argument,P50_REVISION} from './p50-arguments.mjs';
import {findP50Character} from './p50-foundations.mjs';
import {p50Overview,p50Lesson,p50Next,p50Story,p50NativeDialogue,P50_STAGES} from './p50-screen.mjs';
import {P51_PASSAGES,findP51Passage} from './p51-readings.mjs';
import {P51_DIALOGUES} from './p51-dialogues.mjs';
import {findP51Argument,P51_REVISION} from './p51-arguments.mjs';
import {findP51Character} from './p51-foundations.mjs';
import {p51Overview,p51Lesson,p51Next,p51Story,p51NativeDialogue,P51_STAGES} from './p51-screen.mjs';
import {P52_CASES,findP52Case} from './p52-course.mjs';
import {p52Overview,p52Lesson,p52Next,p52Story,p52NativeDialogue,P52_STAGES} from './p52-screen.mjs';
import {P53_CASES,P53_SELF_REVIEW,findP53Case} from './p53-course.mjs';
import {P53_TRANSFERS} from './p53-transfer.mjs';
import {p53Overview,p53Lesson,p53Next,p53Story,p53NativeDialogue,P53_STAGES} from './p53-screen.mjs';
import {P54_CASES,P54_SELF_REVIEW,findP54Case} from './p54-course.mjs';
import {P54_REGISTER_PAIRS} from './p54-register.mjs';
import {p54CumulativeFor} from './p54-cumulative.mjs';
import {p54Overview,p54Lesson,p54Next,p54Story,p54NativeDialogue,P54_STAGES} from './p54-screen.mjs';
import {P55_BRIEFS,findP55Brief} from './p55-briefs.mjs';
import {p56RepairFor} from './p56-repairs.mjs';
import {p55Native,p55Source,p55Next,p55BriefEvidence,p55NativeWords,p58SourceQuestionCount,P55_ROUTE_BY_PHASE} from './p55-study.mjs';
import {p55Overview,p55Lesson,p55WritingContext,P55_STEPS} from './p55-screen.mjs';
import {P34_SCENES,P34_LISTENING} from './p34-course.mjs';
import {p34Overview,p34ListeningPanel,p34DialogueFor,p34StoryFor} from './p34-screen.mjs';
import {P38_PASSAGES,findP38Passage} from './p38-readings.mjs';
import {p38Overview,p38PassagePanel,p38Next} from './p38-screen.mjs';
import {P41_PASSAGES,findP41Passage} from './p41-readings.mjs';
import {p41Overview,p41PassagePanel,p41Next} from './p41-screen.mjs';
import {P35_CHARACTER_GUIDES,P35_THEMES,findP35Guide,P35_WRITING_TASKS} from './p35-foundations.mjs';
import {P35_VOCABULARY} from './p35-vocabulary.mjs';
import {p35Overview,p35CharacterShelf,p35LessonTeaching,p35VocabShelf} from './p35-screen.mjs';
import {P39_CHARACTER_GUIDES,P39_VOCABULARY,P39_THEMES,findP39Guide} from './p39-foundations.mjs';
import {p39Overview,p39CharacterShelf,p39LessonTeaching,p39VocabShelf} from './p39-screen.mjs';
import {p36Overview} from './p36-screen.mjs';
import {p36RepairFor,p36Next} from './p36-course.mjs';
import {p40RepairFor} from './p40-course.mjs';
import {p40Overview,p40Next} from './p40-screen.mjs';
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
const stableRoutes=new Set(['today','learn','review','explore','progress','settings','reader','stories','practice','dialogues','wordbook','senses','workshop','production','integrated','cumulative','upper','advanced','comparative','cumulative49','discourse50','register51','synthesis52','argument53','fluency54','advanced55','journey','ladder','block','fluency','plan','pinyin','grammar','sentences','pathway','find']);
const route=()=>{const v=(location.hash.match(/^#\/(\w+)/)||[])[1]||'today';return stableRoutes.has(v)?v:'today'};
let state=freshState(),db=null,storageError=null,displayLessonId=DEMO_LESSONS[0].id,activeReviewId=null,revealed=false,showLessonTranslation=true,searchQuery='',searchSelection=null,typedAnswer='',chosenOption='',checkResult=null,readerLessonId=DEMO_LESSONS[0].id,readerMode='meaning',readerResult=null,busy=false;
let storyId=STORIES[0].id,storyMode='comprehension',storyResult=null,storyAssist=false,storyShowTranslation=false,storyGlossary=null,storySequence=[],storyTyped='',storyParagraph=0,storyParagraphOnly=false,storyParagraphTranslations=[];
let drillLessonId=DEMO_LESSONS[0].id,drillMode='recognition',drillResult=null,drillPicked='',drillTyped='',drillOrder=[],drillAssisted=false;
let p38Stage='all',p38Query='',p38Page=0,p38BrowseOpen=false,p38Section='all',p38Pinyin=false,p38English=false;
let p41Stage='all',p41Query='',p41Page=0,p41BrowseOpen=false,p41Section='all',p41Pinyin=false,p41English=false;
let storiesOnlyBookmarked=false,storiesLongOnly=false,storiesBeginnerOnly=false,beginnerLevel='all',beginnerPart='all',beginnerWordShown=false,beginnerPartTip='',storyFocusIndex=-1,storyHelpIndex=-1,exploreSavedOnly=false;
let guidedLimit=10,guidedFocus='balanced',guidedTyped='',guidedOrder=[],guidedAssisted=false;
let demoSpeechRate=0.86;
let pinyinSection='sounds',pinyinFilter='all',pinyinIndex=0,pinyinTyped='',pinyinFeedback=null,pinyinSound='b',pinyinSyllable='ma';
let grammarSelected='g01',grammarChapter='all',grammarQuery='',grammarMode='meaning',grammarTyped='',grammarFeedback=null,grammarAssisted=false,grammarOrder=[],grammarShowEnglish=true;
const p36ViewedModels=new Set();let p36ShowModel=false;
const p40ViewedModels=new Set();let p40ShowModel=false;
let dialogueId=DIALOGUES[0].id,dialogueStep=0,dialogueSupport=false,dialogueFeedback=null;
let p33Theme='all',p33Query='',p33Branch=null;
let p34ShadowLine=0,p34TranscriptViewed=false;
let p37Theme='all',p37Query='',p37Page=0,p37BrowseOpen=false,p37Branch=null,p37Turn=0,p37TranscriptViewed=false;
let p42Query='',p42Page=0,p42BrowseOpen=false,p42Turn=0,p42TranscriptViewed=false;
let p43UnitId=P43_UNITS[0].id,p43Draft='',p43Revisions=[],p43Version=-1,p43Step='plan';
let p43ModelRevealed=false,p43SourceRevealed=false,p43Assisted=false,p43Pending='',p43Filter='all',p43Query='';
let p43Reviewed=[]; // Ephemeral UI-only composition and self-review. Not an authorized learner record.
let p44SessionId=null,p44Phase='read',p44ReadHelp=false,p44ListenHelp=false;
let p44QuestionIndex=0,p44Feedback=null,p44Query='',p44Page=0;
const p44AssistedCases=new Set(); // Tab-only visibility; never counted as proficiency.
let p45CaseId=null,p45Stage='read',p45SourceHelp=false,p45Transcript=false;
let p45Question=0,p45Feedback=null,p45Filter='all';
const p45AssistedCases=new Set(); // No new scheduler or learner-state writer.
let p46UnitId=null,p46Stage='characters',p46ReaderHelp=false,p46AudioHelp=false;
let p46ReaderIndex=0,p46ListenerIndex=0,p46ReaderFeedback=null,p46ListenerFeedback=null,p46Query='';
const p46AssistedUnits=new Set(); // Tab-only source visibility; original events remain authoritative.
let p47UnitId=null,p47Stage='words',p47ReadingHelp=false,p47ListeningHelp=false;
let p47ReadingIndex=0,p47ListeningIndex=0,p47ReadingFeedback=null,p47ListeningFeedback=null,p47Query='',p47ProductionModels=false;
const p47AssistedUnits=new Set(); // Ephemeral help provenance, never a grade or second learner store.
let p48CaseId=null,p48Stage='compare',p48Translations=false,p48Transcript=false,p48Models=false;
let p48ReadingIndex=0,p48ListeningIndex=0,p48ReadingFeedback=null,p48ListeningFeedback=null,p48Query='';
const p48AssistedCases=new Set(); // ephemeral, not an account progress record
const p48SelfReview=new Set(); // ephemeral checklist, never stored or graded
let p49CaseId=null,p49Stage='sources',p49Question=0,p49Feedback=null;
let p49ShowSource=false,p49Transcript=false,p49Models=false,p49Filter='all';
const p49AssistedCases=new Set(); // ephemeral guidance provenance, not learner progress
let p50CaseId=null,p50Stage='language',p50ReadingHelp=false,p50ListeningHelp=false,p50Models=false;
let p50ReadingIndex=0,p50ListeningIndex=0,p50ReadingFeedback=null,p50ListeningFeedback=null,p50Query='';
const p50AssistedCases=new Set(); // tab-only assistance, not an owner-scoped record
const p50Checks=new Set(); // temporary self-review, not a grade
let p51CaseId=null,p51Stage='language',p51ReadingHelp=false,p51ListeningHelp=false,p51Models=false;
let p51ReadingIndex=0,p51ListeningIndex=0,p51ReadingFeedback=null,p51ListeningFeedback=null,p51Query='';
const p51AssistedCases=new Set(); // tab-local support, never owner-scoped learning history
const p51Checks=new Set(); // self-review only, never certified proficiency
let p52CaseId=null,p52Stage='records',p52ReadingHelp=false,p52ListeningHelp=false,p52Models=false;
let p52ReadingIndex=0,p52ListeningIndex=0,p52ReadingFeedback=null,p52ListeningFeedback=null,p52Query='';
const p52AssistedCases=new Set(); // tab-local only; not learner-state or mastery
const p52Checks=new Set(); // tab-local self-review, not grade
let p53CaseId=null,p53Stage='sources',p53ReadingHelp=false,p53ListeningHelp=false,p53Models=false;
let p53ReadingIndex=0,p53ListeningIndex=0,p53ReadingFeedback=null,p53ListeningFeedback=null,p53Query='';
const p53AssistedCases=new Set(); // temporary support marker, never a graded state
const p53Checks=new Set(); // self-review only, not persistent mastery
let p54CaseId=null,p54Stage='register',p54ReadingHelp=false,p54ListeningHelp=false,p54Models=false;
let p54ReadingIndex=0,p54ListeningIndex=0,p54ReadingFeedback=null,p54ListeningFeedback=null,p54Query='';
const p54AssistedCases=new Set(); // temporary disclosure only
const p54Checks=new Set(); // temporary self-review only
let p55FocusId=null,p55Step='sources',p55Question=0,p55Reveal=false,p55Model=false,p55Support=false,p55RepairShown=false,p55Query='';
// P55 UI state only; native academic writers and P43 own attempts and drafts.
const p42ViewedTranscripts=new Set();
const p37ViewedTranscripts=new Set();
function p37RememberPosition(){
 const scene=findDialogue(dialogueId)?.p37;if(!scene)return;
 location.hash='#/dialogues/'+scene.id+'?turn='+p37Turn+(p37Branch===null?'':'&branch='+p37Branch);
}
let wordbookIndex=0,wordbookMode='meaning',wordbookFocus='all',wordbookTyped='',wordbookFeedback=null,explorePage=0;
let senseIndex=0,senseSupport=false,senseFeedback=null;
let sentenceIndex=0,sentenceTyped='',sentenceSupport=false,sentenceFeedback=null;
let p31Theme='all',p31Status='all',p31Page=0,p31WordPage=0;
let p35Theme='all',p35Status='all',p35Query='',p35Page=0,p35VocabPage=0,p35CatalogOpen=false,p35VocabOpen=false;
let p39Theme='all',p39Status='all',p39Query='',p39Page=0,p39VocabPage=0,p39CatalogOpen=false,p39VocabOpen=false;
let p30CoachIndex=0,p30CoachCategory='all',p30Query='',p30Kind='all',p30Saved=false,p30Page=0;
let pathwaySelected='path-01',pathwayMode='meaning',pathwayMinutes=20,pathwayFocus=false,pathwayAssisted=false,pathwayTyped='',pathwayFeedback=null,pathwayShowPinyin=true,pathwayShowEnglish=true;
let librarySelected='sent-001',libraryQuery='',libraryTopic='all',libraryArea='all',libraryDifficulty='all',libraryGrammar='all',libraryPurpose='all',libraryTone='all',librarySource='all',librarySavedOnly=false,libraryPage=0,libraryMode='meaning',libraryTyped='',libraryOrder=[],libraryFeedback=null,libraryAssisted=false,libraryShowPinyin=true,libraryShowEnglish=true,libraryPracticeFocus=false;
let missionStep=0,missionActive=false,missionSupport=false,missionTyped='',missionFeedback=null;
let lessonCheckpoint={lessonId:null,step:0,response:'',feedback:null};
let exploreKind='all',reviewFocus='all',reviewSize=10,sessionQueue=null,sessionDone=0,sessionCorrect=0,sessionSkipped=0;
let channel;
let courseTyped='', repairTyped='',ladderTyped='';
let blockFocus='balanced',blockCount=2,blockTyped='',trailTyped='';
let fluencyFocus='balanced',fluencySize=8,fluencyTyped='';
let planMistakeFilter='unresolved';
let pendingRestore=null,restoreAcknowledgement='';
function alertUser(message,type='info'){const target=$('alert-banner');target.textContent=message;target.className=`alert ${type}`;if(type==='error')target.setAttribute('role','alert');else target.setAttribute('role','status');}
function clearAlert(){const a=$('alert-banner');a.textContent='';a.className='';a.setAttribute('role','status');}
function stat(n,desc){return `<div class="stat"><strong>${n}</strong><span>${desc}</span></div>`}
const action=(name,label,classes='button primary',props='')=>`<button class="${classes}" type="button" data-action="${name}" ${props}>${label}</button>`;
function title(eyebrow,heading,description){return `<div class="section-intro"><p class="eyebrow">${eyebrow}</p><h1>${heading}</h1><p>${description}</p></div>`}
document.addEventListener('keydown',e=>{
 if(e.key!=='/'||e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.isComposing)return;
 const target=e.target;
 if(target&&(target.closest('input,textarea,select,[contenteditable=true]')))return;
 e.preventDefault();go('find');root.querySelector('#p30-query')?.focus();
});
function navUpdate(){const current=route();for(const a of document.querySelectorAll('[data-route]')){if(a.dataset.route===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}document.title=`${current[0].toUpperCase()+current.slice(1)} | Character Study`;}
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
function renderDialogues(){const routeAdvanced=(location.hash.match(/^#\/dialogues\/(dialogue-\d+)/)||[])[1];
 if(routeAdvanced&&DIALOGUES.some(d=>d.id===routeAdvanced&&['p50','p51','p52','p53','p54'].some(k=>d[k]))){
  if(routeAdvanced!==dialogueId){
   dialogueId=routeAdvanced;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;
  }
  const question=new URLSearchParams(location.hash.split('?')[1]||'').get('question');
  const chosen=Number(question);
  const original=findDialogue(routeAdvanced);
  if(question!==null&&['0','1','2'].includes(question)&&chosen<original.questions.length&&
    dialogueStep!==chosen){dialogueStep=chosen;dialogueFeedback=null;}
 }
 const routeP42=(location.hash.match(/^#\/dialogues\/(p42-\d{2})/)||[])[1];
 if(routeP42){const target=DIALOGUES.find(x=>x.p42?.id===routeP42);if(target){
  if(dialogueId!==target.id){dialogueId=target.id;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;
   missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;}
  const position=Number(new URLSearchParams(location.hash.split('?')[1]||'').get('turn')||0);
  p42Turn=Number.isInteger(position)?Math.max(0,Math.min(target.lines.length-1,position)):0;
  p42TranscriptViewed=p42ViewedTranscripts.has(routeP42);
 }}
 const routeScene=(location.hash.match(/^#\/dialogues\/(p37-\d{2})/)||[])[1];
 if(routeScene){const target=DIALOGUES.find(x=>x.p37?.id===routeScene);if(target){
  if(dialogueId!==target.id){
   dialogueId=target.id;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;
   missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
  }
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const position=Number(params.get('turn')||0),choice=params.get('branch');
  p37Turn=Number.isInteger(position)?Math.max(0,Math.min(7,position)):0;
  p37Branch=choice==='0'||choice==='1'?Number(choice):null;
  p37TranscriptViewed=p37ViewedTranscripts.has(routeScene);
 }}
 const d=findDialogue(dialogueId)||DIALOGUES[0],q=dialogueQuestion(d.id,dialogueStep),stats=dialogueSummary(state);return `${title('CONVERSATION LAB','Understand everyday Chinese in context.','Read original multi-turn dialogues, choose responses, listen optionally and practise independent production.')}${gated()}<details class="p42-catalog" ${d.p42||p42BrowseOpen?'open':''}><summary>P42 · Intermediate listening-first · 12 practical conversations</summary>${p42Overview(state,action,esc,{query:p42Query,page:p42Page,selected:d.p42?.id})}</details>${p42ListeningPanel(d,action,esc,{turn:p42Turn,revealed:p42TranscriptViewed||dialogueSupport,feedback:dialogueFeedback,question:dialogueStep})}<details class="p37-catalog" ${d.p37||p37BrowseOpen?'open':''}><summary>P37 · Browse 30 practical conversations</summary>${p37Overview(state,action,esc,{selected:d.p37?.id,theme:p37Theme,query:p37Query,page:p37Page})}</details>${p37Teaching(d,p37Branch,action,esc,{turn:p37Turn,assisted:p37TranscriptViewed||dialogueSupport})}<details class="p34-catalog" ${d.p34?'open':''}><summary>Open P34 listening-first course · 25 situations</summary>${p34Overview(state,action,esc)}</details>${p34ListeningPanel(d,state,action,esc,{line:p34ShadowLine})}<details class="p33-browser" ${d.p33?'open':''}><summary>Browse ${P33_SCENARIOS.length} everyday communication situations</summary>${p33SceneShelf(state,d.p33?.id,action,esc,{theme:p33Theme,query:p33Query})}</details>
<section class="simple-panel dialogue-top"><label for="dialogue-choice">Choose a dialogue<select id="dialogue-choice">${DIALOGUES.map((item,i)=>`<option value="${item.id}" ${d.id===item.id?'selected':''}>${i+1}. ${esc(item.title)}</option>`).join('')}</select></label><div class="stats-grid">${stat(stats.practiced,'Conversations practiced')}${stat(stats.independent,'Independent correct answers')}${stat(stats.attempts,'Supplementary responses')}</div></section><div class="content-continuation" aria-label="Conversation navigation">${action('dialogue-prev','← Previous conversation','button outline small')}${action('dialogue-next-context','Next conversation →','button outline small')}</div>
<div class="dialogue-layout"><article class="simple-panel dialogue-paper"><div class="panel-heading"><h2>${esc(d.title)}</h2><span class="muted">${d.lines.length} speaking turns</span></div><div class="dialogue-turns">${d.lines.map(line=>`<div class="dialogue-turn"><span class="speaker-label" aria-label="Speaker ${line.speaker}">${esc(line.speaker)}</span><div><p class="dialogue-chinese" ${(d.p34||d.p37||d.p42)&&!dialogueSupport?'':'lang="zh-Hans"'}>${(d.p34||d.p37||d.p42)&&!dialogueSupport?'Spoken turn · reveal transcript when ready':esc(line.hanzi)}</p>${dialogueSupport?`<p class="dialogue-pinyin">${esc(line.pinyin)}</p><p class="muted">${esc(line.english)}</p>`:''}<div class="button-row">${action('speak','Listen to this turn','button outline small',`data-text="${esc(line.hanzi)}"`)}</div></div></div>`).join('')}</div><div class="button-row">${action('dialogue-support',dialogueSupport?'Hide language support':'Show pinyin + English','button outline',`aria-pressed="${dialogueSupport}"`)}${action('speak','Listen to the exchange','button outline',`data-text="${esc(d.lines.map(x=>x.hanzi).join(' '))}"`)}</div><p class="muted">Device TTS is optional and is not certified pronunciation audio. Revealing language support makes the next answer assisted.</p>${dialogueWordLinks(d.id).length?`<div class="dialogue-word-links"><p class="eyebrow">EXPLORE WORDS IN THIS EXCHANGE</p><p class="muted">Written-form matches only; verify their meanings in context.</p><div class="word-link-row">${dialogueWordLinks(d.id).map(w=>action('lookup-word',`${esc(w.hanzi)} <small>${esc(w.pinyin)}</small>`,'button outline small',`data-word="${esc(w.hanzi)}"`)).join('')}</div></div>`:''}</article>
<section class="simple-panel dialogue-quiz"><p class="eyebrow">CONTEXT CHECK · ${dialogueStep+1} / ${d.questions.length}</p><h2>${esc(q.prompt)}</h2>${dialogueFeedback?`<div class="reader-feedback ${dialogueFeedback.correct&&!dialogueFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${dialogueFeedback.correct?'Correct answer':'Review the conversation'}</strong><p>Reference: ${esc(q.answer)}</p>${d.p34?`<p><strong>Listening evidence:</strong> ${esc(d.p34.feedback[dialogueStep]||d.p34.teaching)}</p><p lang="zh-Hans">${esc(d.lines[dialogueStep===0?1:3].hanzi)}</p><p class="muted">${esc(d.lines[dialogueStep===0?1:3].pinyin)} · ${esc(d.lines[dialogueStep===0?1:3].english)}</p>`:''}<p>${dialogueFeedback.assisted?'Assisted attempt — not independent evidence.':'Saved as separate conversation practice.'}</p></div><div class="button-row">${action('dialogue-next',dialogueStep+1<d.questions.length?'Next context question →':'Next conversation →','button primary')}${action('dialogue-retry','Repeat this question','button outline')}</div>`:`<div class="choice-list">${q.options.map((opt,i)=>action('dialogue-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(opt)}`,'choice',`data-option="${esc(opt)}"`)).join('')}</div><div class="button-row">${action('dialogue-reveal','Reveal reference','button outline')}</div>`}<p class="muted">These questions assess contextual meaning, not official curriculum mastery.</p></section></div>${p33ScenarioTeaching(d,p33Branch,action,esc)}${renderDialogueMission(d)}`;}
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
function renderWorkshop(){const desired=new URLSearchParams(location.hash.split('?')[1]||'').get('task');
 if(desired?.startsWith('p55:transfer:')){const i=SENTENCE_TASKS.findIndex(x=>x.id===desired&&x.p55BriefId);
  if(i>=0&&i!==sentenceIndex){sentenceIndex=i;sentenceTyped='';sentenceFeedback=null;sentenceSupport=true;}
 }
 const task=sentenceTask(sentenceIndex),stats=sentenceStats(state);return `${title('SENTENCE WORKSHOP','Build the Chinese sentence.','Reconstruct an exact sentence using its English meaning. This checks written form, not open-ended translation fluency.')}${gated()}<div class="button-row"><span class="muted">For original open-ended paragraphs and spoken preparation, use the separate self-review studio. These fixed sentences are checked for exact form only.</span>${action('p43-enter','P43 · Independent writing & spoken production →','button primary')}</div>
 <section class="simple-panel learning-studio"><div class="stats-grid">${stat(SENTENCE_TASKS.length,'Sentence tasks')}${stat(stats.practiced,'Tasks attempted')}${stat(stats.independent,'Independent correct')}</div><div class="button-row">${action('sense-weak','Practice missed/new contexts →','button outline small')}</div><div class="guided-meta"><span>Task ${sentenceIndex%SENTENCE_TASKS.length+1}/${SENTENCE_TASKS.length}</span><span>${task.p33ScenarioId?`P33 conversation · ${esc(findP33Scenario(task.p33ScenarioId)?.title||'Original conversation')}`:task.grammarId?`Grammar · ${esc(task.grammarTitle)}`:`${task.sentenceId?`Sentence Library · ${esc(task.sentenceId)}`:`${task.p39LessonId?`P39 intermediate character · ${esc(findLesson(task.p39LessonId)?.hanzi||'Original character')}`:task.p31LessonId?`P31 character · ${esc(findLesson(task.p31LessonId)?.hanzi||'Original character')}`:${task.pathwayId?`Pathway · ${esc(findPathwayMission(task.pathwayId)?.title||'Original mission')}`:`Reading · ${esc(findStory(task.storyId)?.title||'Original text')}`}`}`}</span></div><p class="eyebrow">${task.p32Correction?'P32 · CORRECT THE MISTAKE':task.p33ScenarioId?'P33 · PRODUCE A CONVERSATION TURN':task.p34AudioId?'P34 · WRITE WHAT YOU HEARD':task.p39LessonId?'P39 · INTERMEDIATE CHARACTER WRITING':task.p35LessonId?'P35 · INDEPENDENT CHARACTER SENTENCE':task.p40Correction?'P40 · REPAIR INTERMEDIATE MEANING':task.p36Correction?'P36 · FIX THE INTENDED MEANING':task.p55BriefId?'P55 · ORIGINAL SOURCE-COMPARISON RECONSTRUCTION':task.p54CaseId||task.p54RegisterId||task.p54CumulativeId?'P54 · ADVANCED SOURCE AND REGISTER RECONSTRUCTION':task.p53TransferId?'P53 · CROSS-CASE ANALOGY AND RECONSTRUCTION':task.p53CaseId?'P53 · SOURCE-SPECIFIC ARGUMENT RECONSTRUCTION':task.p52CaseId?'P52 · CROSS-SOURCE EDITORIAL RECONSTRUCTION':task.p51ArgumentId||task.p51DialogueId||task.p51Character?'P51 · ADVANCED REGISTER AND SOURCE RESPONSE':task.p50ArgumentId||task.p50DialogueId||task.p50Character?'P50 · ADVANCED SOURCE-SUPPORTED RESPONSE':task.p49CaseId?'P49 · ORIGINAL CUMULATIVE EVIDENCE RESPONSE':task.p48ArgumentId||task.p48DialogueId?'P48 · SOURCE-SUPPORTED ARGUMENT RESPONSE':task.p47Character||task.p47DialogueId||task.p47ProductionId?'P47 · ORIGINAL ADVANCED CONTEXTUAL RESPONSE':task.p46Character||task.p46DialogueId?'P46 · ORIGINAL UPPER-INTERMEDIATE PRODUCTION':task.p45TransferId?'P45 · INDEPENDENT EVIDENCE TRANSFER':task.p44ScenarioId?'P44 · INTEGRATED SOURCE RESPONSE':task.p43UnitId?'P43 · ORIGINAL SENTENCE TRANSFER':task.p42SceneId?'P42 · INTERMEDIATE SPOKEN RECONSTRUCTION':task.p37ScenarioId?'P37 · INDEPENDENT CONVERSATION RESPONSE':'ENGLISH-TO-CHINESE · EXACT RECONSTRUCTION'}</p><h2>${esc(task.english)}</h2>${sentenceFeedback?`<div class="reader-feedback ${sentenceFeedback.correct&&!sentenceFeedback.assisted?'correct':'incorrect'}" role="status"><strong>${sentenceFeedback.correct?'Exact form correct':'Compare with the model sentence'}</strong><p>${esc(sentenceFeedback.message)}</p><p class="practice-hanzi" lang="zh-Hans">${esc(task.hanzi)}</p><p>${esc(task.pinyin)}</p>${task.p55BriefId?`<div class="p31-writing-feedback"><strong>P55 source-qualified fixed sentence</strong><p>${esc(task.explanation||'')}</p><strong>Misconception to repair</strong><p>${esc(task.misconception||'')}</p><p>Only this exact authored Hanzi reconstruction is evaluated; unrelated translations and independent argumentation or speech are not graded.</p></div>`:''}${task.p54CaseId||task.p54RegisterId||task.p54CumulativeId?`<div class="p31-writing-feedback"><strong>P54 original source or register comparison</strong><p>${esc(task.explanation||'')}</p><strong>Misconception or contextual distinction</strong><p>${esc(task.misconception||'')}</p><p>Only the exact authored Hanzi response is checked. Alternative valid translations, spontaneous speech, and original essays remain ungraded.</p></div>`:''}${task.p53TransferId?`<div class="p31-writing-feedback"><strong>P53 cross-context source analogy</strong><p>${esc(task.explanation||'')}</p><strong>Do not equate the two different situations</strong><p>${esc(task.misconception||'')}</p><p>Native exact-form response only. Multi-context essays and speaking remain learner-owned and ungraded.</p></div>`:''}${task.p53CaseId?`<div class="p31-writing-feedback"><strong>P53 independent source-reconciliation model</strong><p>${esc(task.explanation||'')}</p><strong>Unwarranted inference to repair</strong><p>${esc(task.misconception||'')}</p><p>Only the exact authored Chinese sentence is evaluated; independently composed arguments, alternate valid sentences and spoken delivery are not automatically graded.</p></div>`:''}${task.p52CaseId?`<div class="p31-writing-feedback"><strong>P52 source-specific correction</strong><p>${esc(task.explanation||'')}</p><strong>Source-scope misconception</strong><p>${esc(task.misconception||'')}</p><p>Only the exact authored sentence is graded; your original paragraph and speech remain ungraded.</p></div>`:''}${task.p51ArgumentId||task.p51DialogueId||task.p51Character?`<div class="p31-writing-feedback"><strong>P51 source and register-sensitive correction</strong><p>${esc(task.explanation||'')}</p><strong>Register or evidence misconception</strong><p>${esc(task.misconception||'')}</p><p>Only this native exact Hanzi sentence is evaluated. Independent paragraphs, spoken explanations and HSK proficiency are not automatically graded.</p></div>`:''}${task.p50ArgumentId||task.p50DialogueId||task.p50Character?`<div class="p31-writing-feedback"><strong>P50 advanced contextual source response</strong><p>${esc(task.explanation||'')}</p><strong>Misconception or register distinction</strong><p>${esc(task.misconception||'')}</p><p>Only this exact original Chinese model is assessed. Free argumentative writing and speaking are never graded by this reconstruction.</p></div>`:''}${task.p49CaseId?`<div class="p31-writing-feedback"><strong>P49 cumulative source-specific correction</strong><p>${esc(task.explanation||'')}</p><strong>Common misconception</strong><p>${esc(task.misconception||'')}</p><p>Only this original Chinese sentence is assessed for exact form. This does not grade an independent essay, spontaneous speaking, HSK proficiency or general mastery.</p></div>`:''}${task.p48ArgumentId||task.p48DialogueId?`<div class="p31-writing-feedback"><strong>P48 source evidence and argumentation</strong><p>${esc(task.explanation||'')}</p><strong>Meaning to preserve</strong><p>${esc(task.misconception||'')}</p><p>This is original exact-form reconstruction only, not an assessment of free essay arguments or oral responses.</p></div>`:''}${task.p47Character||task.p47DialogueId||task.p47ProductionId?`<div class="p31-writing-feedback"><strong>P47 context-specific reconstruction</strong><p>${esc(task.explanation||'')}</p><strong>Meaning to protect</strong><p>${esc(task.misconception||'')}</p><p>Only the exact original model form is evaluated; independent paragraphs and pronunciation remain ungraded.</p></div>`:''}${task.p46Character||task.p46DialogueId?`<div class="p31-writing-feedback"><strong>P46 contextual production</strong><p>${esc(task.explanation||'')}</p><strong>Common interpretation error</strong><p>${esc(task.misconception||'')}</p><p>This task evaluates only the exact originally authored Chinese sentence. Valid alternate wording and speech are not automatically assessed.</p></div>`:''}${task.p45TransferId?`<div class="p31-writing-feedback"><strong>P45 cumulative source repair</strong><p>${esc(findP45Transfer(task.p45TransferId)?.goal||'')}</p><strong>Model purpose</strong><p>${esc(task.explanation||'')}</p><strong>Incorrect inference to avoid</strong><p>${esc(task.pitfall||'')}</p><p>Only this fixed authored sentence is checked for exact form, not essay quality, pronunciation, or HSK mastery.</p></div>`:''}${task.p44ScenarioId?`<div class="p31-writing-feedback"><strong>P44 cross-skill evidence</strong><p>${esc(findP44Scenario(task.p44ScenarioId)?.goal||'')}</p><strong>Why this sentence helps</strong><p>${esc(task.explanation||'')}</p><strong>Unsupported interpretation to avoid</strong><p>${esc(task.pitfall||'')}</p><p>This is only an exact authored sentence check, not open-ended writing or spoken proficiency evaluation.</p></div>`:''}${task.p43UnitId?`<div class="p31-writing-feedback"><strong>P43 source-specific writing transfer</strong><p>${esc(task.explanation||'')}</p><strong>Common unsupported assumption</strong><p>${esc(task.misconception||'')}</p><p>This task checks one exact model sentence, not the quality of an independent two-paragraph draft.</p></div>`:''}${task.p42SceneId?`<div class="p31-writing-feedback"><strong>P42 spoken context and contrast</strong><p>${esc(findP42Scene(task.p42SceneId)?.teaching||'')}</p><p>${esc(task.contrast||'')}</p><strong>Misconception</strong><p>${esc(task.pitfall||'')}</p><p>The exact-form writer does not assess spoken pronunciation or alternate valid wording.</p></div>`:''}${task.p37ScenarioId?`<div class="p31-writing-feedback"><strong>Context</strong><p>${esc(findP37Scene(task.p37ScenarioId)?.teaching||'')}</p><strong>Social nuance</strong><p>${esc(findP37Scene(task.p37ScenarioId)?.pragmatics||'')}</p><strong>Common confusion</strong><p>${esc(findP37Scene(task.p37ScenarioId)?.pitfall||'')}</p></div>`:''}${task.p40Correction||task.p36Correction?`<div class="p31-writing-feedback"><strong>Why this construction needs repair here</strong><p>${esc(task.pitfall||'')}</p><p>${esc(task.contrast||'')}</p><p>The independent answer check uses one taught model, not a claim that all other Mandarin sentences are incorrect.</p></div>`:''}${task.p39LessonId?`<div class="p31-writing-feedback"><strong>Authorial P39 character teaching</strong><p>${esc(findP39Guide(task.p39LessonId)?.explanation||'')}</p><strong>Common mistake</strong><p>${esc(findP39Guide(task.p39LessonId)?.pitfall||'')}</p></div>`:''}${task.p35LessonId?`<div class="p31-writing-feedback"><strong>Authorial P35 character teaching</strong><p>${esc(findP35Guide(task.p35LessonId)?.grammarExplanation||'')}</p><strong>Common mistake</strong><p>${esc(findP35Guide(task.p35LessonId)?.pitfall||'')}</p></div>`:''}${task.p34AudioId?`<div class="p31-writing-feedback"><strong>Listening-first transfer</strong><p>${esc(task.explanation||'')}</p><p>Compare this authored line with the recording from your device voice; exact written reconstruction does not certify spoken fluency.</p></div>`:''}${task.p33ScenarioId?`<div class="p31-writing-feedback"><strong>Conversation context</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.teaching||'')}</p><strong>Social usage</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.pragmatics||'')}</p><strong>Common confusion</strong><p>${esc(findP33Scenario(task.p33ScenarioId)?.pitfall||'')}</p></div>`:''}${task.p32Correction?`<div class="p31-writing-feedback"><strong>Why the learner sentence needs repair</strong><p>${esc(task.explanation)}</p><p>One specific reference sentence is checked; other valid corrections may exist.</p></div>`:''}${task.p31LessonId?`<div class="p31-writing-feedback"><strong>Grammar and meaning</strong><p>${esc(findP31Guide(task.p31LessonId)?.grammarExplanation||'')}</p><strong>Common confusion</strong><p>${esc(findP31Guide(task.p31LessonId)?.pitfall||'')}</p><strong>Pronunciation focus</strong><p>${esc(findP31Guide(task.p31LessonId)?.pronunciation||'')}</p></div>`:''}</div>${action('workshop-next','Next sentence →','button primary')}${task.grammarId?action('grammar-select','Return to grammar teaching','button outline small',`data-id="${task.grammarId}"`):''}${task.sentenceId?action('sentence-select','Return to sentence context →','button outline small',`data-id="${task.sentenceId}"`):''}${task.readingId?action('open-story-link','Return to reading →','button outline small',`data-id="${task.readingId}"`):''}${task.pathwayId?action('pathway-select','Return to pathway mission →','button outline small',`data-id="${task.pathwayId}"`):''}${task.p31LessonId?action('p31-open-lesson','Return to character teaching →','button outline small',`data-id="${task.p31LessonId}"`):''}${task.p33ScenarioId?action('p33-open-scenario','Return to conversation →','button outline small',`data-id="${task.p33ScenarioId}"`):''}${task.p34AudioId?action('p34-open-listening','Return to listening →','button outline small',`data-id="${task.p34AudioId}"`):''}${task.p39LessonId?action('p39-open','Return to P39 character teaching →','button outline small',`data-id="${task.p39LessonId}"`):''}${task.p35LessonId?action('p35-open-lesson','Return to P35 character teaching →','button outline small',`data-id="${task.p35LessonId}"`):''}${task.p40Correction?action('grammar-select','Return to P40 grammar explanation →','button outline small',`data-id="${task.grammarId}"`):''}${task.p36Correction?action('grammar-select','Return to P36 grammar explanation →','button outline small',`data-id="${task.grammarId}"`):''}${task.p55BriefId?action('p55-return','Return to P55 source comparison →','button outline small'):''}${task.p54CaseId||task.p54RegisterId||task.p54CumulativeId?action('p54-return','Return to P54 study →','button outline small'):''}${task.p53TransferId||task.p53CaseId?action('p53-return','Return to P53 argument journey →','button outline small'):''}${task.p52CaseId?action('p52-return','Return to P52 source comparison →','button outline small'):''}${task.p51ArgumentId||task.p51DialogueId||task.p51Character?action('p51-return','Return to P51 register and source journey →','button outline small'):''}${task.p50ArgumentId||task.p50DialogueId||task.p50Character?action('p50-return','Return to P50 advanced discourse →','button outline small'):''}${task.p49CaseId?action('p49-return','Return to P49 cumulative transfer →','button outline small'):''}${task.p48ArgumentId||task.p48DialogueId?action('p48-return','Return to P48 source argument →','button outline small'):''}${task.p47Character||task.p47DialogueId||task.p47ProductionId?action('p47-return','Return to P47 contextual practice →','button outline small'):''}${task.p46Character||task.p46DialogueId?action('p46-return','Return to P46 upper-intermediate lesson →','button outline small'):''}${task.p45TransferId?action('p45-return','Return to cumulative learning →','button outline small'):''}${task.p44ScenarioId?action('p44-return','Return to integrated scenario →','button outline small'):''}${task.p43UnitId?action('p43-open','Return to P43 independent writing →','button outline small',`data-id="${task.p43UnitId}"`):''}${task.p42SceneId?action('p42-open','Return to P42 listening →','button outline small',`data-id="${task.p42SceneId}"`):''}${task.p37ScenarioId?action('p37-open','Return to conversation →','button outline small',`data-id="${task.p37ScenarioId}"`):''}`:
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
function renderWordbook(){
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
function hubPathNav(){
 if(['today','settings'].includes(route()))return '';
 return `<nav class="hub-path-nav" aria-label="Learning workspace shortcuts"><span class="hub-path-label">LEARNING PATH</span>${LEARNING_DESTINATIONS.map(d=>`<a href="#/${d.route}" ${d.route===route()?'aria-current="page"':''}>${esc(d.label)}</a>`).join('')}</nav>`;
}
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
function selectedGrammarId(){const id=(location.hash.match(/^#\/grammar\/(g\d{2,3})(?:$|[?\/])/)||[])[1];return findGrammarLesson(id)?id:grammarSelected;}
function renderGrammar(){
 const selected=selectedGrammarId();
 return renderGrammarScreen({lessonId:selected,chapter:grammarChapter,query:grammarQuery,mode:grammarMode,typed:grammarTyped,feedback:grammarFeedback,assisted:grammarAssisted,order:grammarOrder,showEnglish:grammarShowEnglish,p36ShowModel,p40ShowModel,sentenceEvents:state.sentenceEvents||[]},action,esc,title,gated);
}
function grammarSessionReset(){grammarMode='meaning';grammarTyped='';grammarFeedback=null;grammarAssisted=false;grammarOrder=[];}
function openGrammarLesson(id){
 const selected=findGrammarLesson(id);if(!selected)return;
 grammarSelected=id;grammarChapter=String(selected.chapterNumber);
 grammarQuery='';grammarSessionReset();p36ShowModel=false;p40ShowModel=false;
 location.hash='#/grammar/'+id;
 render();
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
 if(!findLibrarySentence(id))return;
 librarySelected=id;sentenceUiReset();
 location.hash='#/sentences/'+id;render();
}
function renderSentences(){
 return renderSentenceScreen({selected:selectedLibraryId(),query:libraryQuery,topic:libraryTopic,
 area:libraryArea,difficulty:libraryDifficulty,grammar:libraryGrammar,purpose:libraryPurpose,tone:libraryTone,source:librarySource,savedOnly:librarySavedOnly,page:libraryPage,
 mode:libraryMode,typed:libraryTyped,order:libraryOrder,feedback:libraryFeedback,
 assisted:libraryAssisted,showPinyin:libraryShowPinyin,showEnglish:libraryShowEnglish,focus:libraryPracticeFocus,
 learner:state},action,esc,title,gated);
}
function pathwaySelection(){const id=location.hash.split('/')[2];return findPathwayMission(id)?id:pathwaySelected;}
function pathwayReset(){pathwayMode='meaning';pathwayFocus=false;pathwayAssisted=false;pathwayTyped='';pathwayFeedback=null;}
function openPathwayMission(id){const m=findPathwayMission(id);if(!m)return;pathwaySelected=m.id;pathwayReset();location.hash='#/pathway/'+id;render();}
function renderPathway(){const m=findPathwayMission(pathwaySelection())||PATHWAY_MISSIONS[0];return renderPathwayScreen({id:m.id,band:m.band,minutes:pathwayMinutes,mode:pathwayMode,focus:pathwayFocus,assisted:pathwayAssisted,typed:pathwayTyped,feedback:pathwayFeedback,showPinyin:pathwayShowPinyin,showEnglish:pathwayShowEnglish,learner:state},action,esc,title,gated);}
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
function renderToday(){return `${title('YOUR MANDARIN WORKSPACE','One focused learning day.','Continue the next meaningful activity, then study language in context without losing access to your existing tools.')}${gated()}${p51Overview(state,action,esc,{compact:true})}${p50Overview(state,action,esc,{compact:true})}${p49Overview(state,action,esc,{compact:true})}${p48Overview(state,action,esc,{compact:true})}${p47Overview(state,action,esc,{compact:true})}${p46Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${onboardingPanel()}${dashboardHome(state,action,esc,{index:p30CoachIndex,category:p30CoachCategory})}${p31Overview(state,action,esc,true)}${p39Overview(state,action,esc,{compact:true})}${p35Overview(state,action,esc,{compact:true})}${p40Overview(state,action,esc,{compact:true})}${p36Overview(state,action,esc,{compact:true})}${p42Overview(state,action,esc,{compact:true})}${p43Overview(action,esc,{compact:true})}${p44Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${p37Overview(state,action,esc,{compact:true})}${p41Overview(state,action,esc,{compact:true})}${p43Overview(action,esc,{compact:true})}${p44Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${p38Overview(state,action,esc,{compact:true})}${p32LearningHub(state,action,esc)}${p33SceneShelf(state,null,action,esc,{compact:true})}${p34Overview(state,action,esc,{compact:true})}
<details class="p30-other-panels"><summary><strong>Additional course panels and detailed recommendations</strong><span>Learning Hub · reading · grammar · Pinyin · saved vocabulary · activity</span></summary>
${hubHomePanel()}${pathwayHomePanel(state,action,esc)}${beginnerReadingTodayPanel()}${connectedReadingTodayPanel()}${sentenceTodayPanel()}${grammarTodayPanel()}${pinyinTodayPanel()}${vocabularyTodayPanel()}${finishOverviewPanel()}
</details>`;}
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
function lessonDetails(l){if(!l)return '<p>Lesson unavailable.</p>';const learned=state.learned.includes(l.id);return `<article class="lesson-paper"><div class="lesson-heading"><span class="eyebrow">LESSON ${String(l.order).padStart(2,'0')} OF ${DEMO_LESSONS.length} · ORIGINAL DEMO</span><span class="status-tag ${learned?'complete':''}">${learned?'Introduced':'New'}</span></div>
  <div class="character-focus"><div class="big-hanzi" lang="zh-Hans">${esc(l.hanzi)}</div><div class="character-meta"><div class="reading-row"><span class="reading">${state.settings.showPinyin?esc(l.pinyin):"Pinyin hidden"}</span>${action('speak','<span aria-hidden="true">▶</span> Listen','button mini outline',`data-text="${esc(l.hanzi)}"`)}</div><h2>${esc(l.meaning)}</h2><p>${esc(l.note)}</p><p class="subnote">Pinyin is shown during teaching and hidden during unassisted review.</p><p class="subnote">${esc(toneContrast(l.pinyin)||'Tone analysis unavailable')}</p>${toneTeachingPanel(l.pinyin)}</div></div>
  <div class="lesson-guide"><span class="eyebrow">CHARACTER INSIGHT · ORIGINAL TEACHING NOTE</span><h3>${esc(guideFor(l).topic)}</h3><p>${esc(guideFor(l).explanation)}</p><p class="muted">${esc(guideFor(l).comparison)}</p></div>${companionPanel(l,{compact:true})}${p31LessonTeaching(l,action,esc)}${p35LessonTeaching(l,action,esc)}${p39LessonTeaching(l,action,esc,state)}${grammarUnitSelector(l.hanzi)}${sentenceLinksForCharacter(l.hanzi)}<div class="lesson-rule"></div><div class="learning-section-heading"><div><p class="eyebrow">HOW IT APPEARS IN WORDS</p><h3>Learn it in context</h3></div><span class="section-index">01 / 02</span></div>
  <div class="word-grid">${l.words.map((w,i)=>`<div class="word-card"><span class="word-index">0${i+1}</span><div lang="zh-Hans" class="word-hanzi">${esc(w.hanzi)}</div><div class="word-pinyin">${state.settings.showPinyin?esc(w.pinyin):"Pinyin hidden"}</div><strong>${esc(w.english)}</strong>${action('lookup-word','Word details ↗','text-button',`data-word="${esc(w.hanzi)}"`)}${action('vocabulary-start','Learn this word →','text-button',`data-id="${esc(canonicalWordKey(w.hanzi,w.pinyin))}"`)}${action('speak','Listen ↗','text-button',`data-text="${esc(w.hanzi)}"`)}</div>`).join('')}</div>
  ${lessonConnections(l.id)?.readings.length?`<section class="lesson-context-links"><p class="eyebrow">YOUR CHARACTER IN A REAL CONTEXT</p><h3>See it in connected reading</h3><div class="context-link-grid">${lessonConnections(l.id).readings.map(item=>`<button type="button" class="context-link" data-action="open-story-link" data-id="${item.id}"><strong>${esc(item.title)}</strong><small lang="zh-Hans">${esc(item.word)} · in the story</small><span aria-hidden="true">↗</span></button>`).join('')}</div></section>`:''}
  ${(()=>{const links=contentConnections(l.id);return links.dialogues.length?`<section class="lesson-context-links"><p class="eyebrow">THE SAME WORDS IN CONVERSATION</p><h3>Hear the meaning in context</h3><div class="context-link-grid">${links.dialogues.map(d=>`<button type="button" class="context-link" data-action="hub-dialogue" data-id="${esc(d.id)}"><strong>${esc(d.title)}</strong><small lang="zh-Hans">${esc(d.matches.join(' · '))}</small><span aria-hidden="true">↗</span></button>`).join('')}</div></section>`:''})()}
  <div class="learning-section-heading sentence-title"><div><p class="eyebrow">READ A SENTENCE</p><h3>Put it together</h3></div><span class="section-index">02 / 02</span></div>
  <div class="sentence-block"><p lang="zh-Hans" class="sentence-hanzi">${esc(l.sentence.hanzi)}</p>${showLessonTranslation?`<p class="sentence-pinyin">${esc(l.sentence.pinyin)}</p><p class="sentence-english">${esc(l.sentence.english)}</p>`:'<p class="helper-text">Pinyin and translation are hidden.</p>'}<div class="button-row">${action('toggle-translation',showLessonTranslation?'Hide translation':'Show pinyin & translation','button outline small')}${action('speak','▶ Listen to sentence','button outline small',`data-text="${esc(l.sentence.hanzi)}"`)}${action('speech-rate','Playback speed: '+demoSpeechRate+'×','button outline small')}</div></div>
   ${l.extraSentence?`<div class="p22-extra-sentence" aria-label="More Chinese in context"><div><p class="eyebrow">SECOND EXAMPLE · CONNECTED LANGUAGE</p><strong lang="zh-Hans">${esc(l.extraSentence.hanzi)}</strong></div>${showLessonTranslation?`<p class="p22-reading">${esc(l.extraSentence.pinyin)}</p><p>${esc(l.extraSentence.english)}</p>`:'<p class="muted">Read it independently, or show the translations above.</p>'}${action('speak','Listen to this example','button outline small',`data-text="${esc(l.extraSentence.hanzi)}"`)}</div>`:''}
   ${lessonQuiz(l)}
   ${bridgeTeachingPanel(l.id)}
   <div class="lesson-footer"><div><strong>${learned?'Ready to practice':'Ready to remember?'}</strong><p>${learned?'Your ${cardsForLesson(l.id).length} recall targets are in Review.':'Introducing this lesson creates ${cardsForLesson(l.id).length} character, word, pronunciation and sentence targets.'}</p></div><div class="button-row">${!learned?action('mark-studied','Finish lesson & add reviews →','button primary',`data-id="${l.id}"`):action('start-review','Practice recall →','button primary')}${action('next-lesson','Next →','button outline')}${action('practice-lesson','Quick practice','button outline',`data-id="${l.id}"`)}${action('course-lesson','Daily Journey','button outline',`data-id="${l.id}"`)}</div></div></article>`}
function foundationalExpansionPanel(){
 const units=lessonGroups().filter(unit=>unit.range[0]>74);
 return `<section class="simple-panel p22-foundation-panel" aria-label="Expanded foundations and new characters">
 <div class="panel-heading"><div><p class="eyebrow">P22 · EXPANDED MANDARIN FOUNDATIONS</p><h2>70 additional characters, in real context</h2></div><span class="muted">Three words and two example sentences per new character</span></div>
 <p>Extend your Mandarin with pronouns, everyday grammar, numbers, directions, food, weather and conversation. Each new lesson has a dedicated grammar companion and expanded recall targets.</p>
 <div class="p22-unit-grid">${units.map(unit=>{const introduced=unit.lessons.filter(lesson=>state.learned.includes(lesson.id)).length;const next=unit.lessons.find(lesson=>!state.learned.includes(lesson.id))||unit.lessons[0];return `<button type="button" class="p22-unit" data-action="foundation-unit" data-id="${esc(next.id)}"><span class="p22-unit-number">${String(unit.index).padStart(2,'0')}</span><strong>${esc(unit.name)}</strong><small>${introduced}/${unit.lessons.length} introduced · Continue with ${esc(next.hanzi)} (${esc(next.pinyin)})</small><span class="p22-unit-go">Explore →</span></button>`}).join('')}</div>
 </section>`;
}
function renderLearn(){const l=findLesson(displayLessonId)||DEMO_LESSONS[0];const m=summary(state);return `${title('THE LEARNING PATH','Learn characters in words.','${DEMO_LESSONS.length} original demonstration lessons, organized into ${lessonGroups().length} thematic study units.')}${gated()}${p51Overview(state,action,esc,{compact:true})}${p50Overview(state,action,esc,{compact:true})}${p49Overview(state,action,esc,{compact:true})}${p48Overview(state,action,esc,{compact:true})}${p47Overview(state,action,esc,{compact:true})}${p46Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${learnWorkspace(state,action,esc,{index:p30CoachIndex,category:p30CoachCategory})}${p32LearningHub(state,action,esc)}${p33SceneShelf(state,null,action,esc,{compact:true})}${p34Overview(state,action,esc,{compact:true})}${p41Overview(state,action,esc,{compact:true})}${p43Overview(action,esc,{compact:true})}${p44Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${p38Overview(state,action,esc,{compact:true})}${p39Overview(state,action,esc,{compact:true})}${p35Overview(state,action,esc,{compact:true})}${p40Overview(state,action,esc,{compact:true})}${p36Overview(state,action,esc,{compact:true})}${p42Overview(state,action,esc,{compact:true})}${p37Overview(state,action,esc,{compact:true})}<details class="p39-course-details" ${findP39Guide(l.id)||p39CatalogOpen?'open':''}><summary>Explore P39 character lessons and vocabulary</summary>${p39CharacterShelf(state,action,esc,{theme:p39Theme,status:p39Status,query:p39Query,page:p39Page})}${p39VocabShelf(state,action,esc,{page:p39VocabPage})}</details><details class="p35-course-details" ${findP35Guide(l.id)||p35CatalogOpen?'open':''}><summary>Explore P35 character lessons and vocabulary</summary>${p35CharacterShelf(state,action,esc,{theme:p35Theme,status:p35Status,query:p35Query,page:p35Page})}${p35VocabShelf(state,action,esc,{page:p35VocabPage})}</details>${p31LessonShelf(state,action,esc,{theme:p31Theme,status:p31Status,page:p31Page})}<details class="p30-learn-utilities"><summary>Quick learning utilities and course continuity</summary>${compactHubPanel()}${finishOverviewPanel({compact:true})}</details><div class="button-row course-learn-action">${action('course-lesson','Guided Daily Journey →','button primary',`data-id="${l.id}"`)}${action('ladder-open','Practice sentence construction →','button outline',`data-id="${l.id}"`)}${action('pinyin-open','Sound foundations →','button outline')}${action('grammar-open','Grammar course →','button outline')}${action('sentence-open','Sentence library →','button outline')}${action('pathway-open','Learning pathway →','button primary')}${action('reading-open-beginner','Beginner readings →','button outline')}${action('reading-open-long','Extended readings →','button outline')}</div>${foundationalExpansionPanel()}<div class="learn-head"><div><strong>${m.learned} of ${m.total}</strong> lessons introduced</div><div class="progress-rail"><span style="width:${100*m.learned/m.total}%"></span></div></div><div class="learn-layout"><div class="lesson-list" role="group" aria-label="Demo lessons">${lessonGroups().map(g=>`<div class="lesson-group-label"><strong>${g.index.toString().padStart(2,'0')} · ${g.name}</strong><span>${g.lessons.filter(l=>state.learned.includes(l.id)).length}/${g.lessons.length}</span></div>${g.lessons.map(lessonCard).join('')}`).join('')}</div>${lessonDetails(l)}</div>${companionLibraryPanel(l.id)}`}
function reviewMatches(id){const info=cardInfo(id);if(!info)return false;if(reviewFocus==='weak')return true;if(reviewFocus==='pronunciation')return info.kind==='pinyin';if(reviewFocus==='meanings')return info.kind==='meaning';if(reviewFocus==='sentences')return info.kind==='choice';return true;}
function renderReview(){
 const m=summary(state),due=dueCards(state).filter(reviewMatches);
 if(sessionQueue===null)return `${title('FOCUSED REVIEW','Choose your practice.','Select the skill and a manageable number of questions. All due items remain due if you leave or skip them.')}
 ${reviewWorkspace(state,action,esc)}${p51Overview(state,action,esc,{compact:true})}${p50Overview(state,action,esc,{compact:true})}${p49Overview(state,action,esc,{compact:true})}${p48Overview(state,action,esc,{compact:true})}${p47Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}<section class="simple-panel session-setup"><div class="stats-grid">${stat(dueCards(state).length,'All due cards')}${stat(m.cards,'Active recall targets')}${stat(m.successful,'Correct independent attempts')}</div>
 <div class="session-controls"><label>Practice focus<select id="review-focus"><option value="all" ${reviewFocus==='all'?'selected':''}>All skills</option><option value="weak" ${reviewFocus==='weak'?'selected':''}>Prioritize weaker skills</option><option value="meanings" ${reviewFocus==='meanings'?'selected':''}>Character & word meanings</option><option value="pronunciation" ${reviewFocus==='pronunciation'?'selected':''}>Pinyin & tones</option><option value="sentences" ${reviewFocus==='sentences'?'selected':''}>Sentence comprehension</option></select></label>
 <label>Session length<select id="review-size">${[5,10,20,50].map(n=>`<option value="${n}" ${reviewSize===n?'selected':''}>Up to ${n} questions</option>`).join('')}</select></label></div>
 <p class="muted">${due.length} matching reviews are due. A skipped question stays due; no success is credited. Keyboard: 1–4 to choose, Enter to check, S to skip; 1–4 to grade after feedback.</p><div class="review-queue-preview"><strong>Why these reviews come first</strong><div class="review-queue-reasons">${reviewPlan(state,{focus:reviewFocus,limit:Math.min(4,reviewSize)}).map(item=>`<span>${esc(item.family)} · ${esc(item.reason)}</span>`).join('')||'<span>No reviews are due for this focus.</span>'}</div></div><div class="button-row">${action('review-begin','Begin practice →','button primary',due.length?'':'disabled')}${action('go-learn','Learn something new','button outline')}</div></section>`;
 if(sessionQueue.length===0)return `${title('SESSION FINISHED','Practice complete.','Your answers have been recorded individually. Skipped questions remain due.')}
 <section class="simple-panel session-finish"><div class="stats-grid">${stat(sessionDone,'Answered')}${stat(sessionCorrect,'Correct independently')}${stat(sessionSkipped,'Skipped')}${stat(dueCards(state).length,'Still due')}</div><div class="button-row">${action('review-restart','Start another session →','button primary')}${action('go-learn','Continue learning','button outline')}${action('open-stories','Read a short story','button outline')}</div></section>`;
 // A review may have been completed in another tab: never award a second attempt implicitly.
 let id=sessionQueue[0];if(!state.cards[id]||!dueCards(state).includes(id)){sessionQueue.shift();return renderReview();}
 activeReviewId=id;const c=cardInfo(id),options=c.kind==='choice'?makeOptions(c.answer,'sentence',c.lesson.id):[];
 const promptType=c.kind==='pinyin'?'PRONUNCIATION · TONES':c.kind==='choice'?'SENTENCE COMPREHENSION':c.type==='meaning'?'CHARACTER MEANING':'VOCABULARY MEANING';
 const total=sessionDone+sessionSkipped+sessionQueue.length;
 return `${title('ACTIVE RECALL','Check what you remember.','Answer without assistance, then inspect precise feedback.')}
 <div class="review-shell"><div class="review-bar"><span>${sessionDone+sessionSkipped+1} of ${total} · ${sessionQueue.length} remaining</span><span>${esc(reviewFocus==='all'?'Mixed skills':reviewFocus)} · ${sessionCorrect} correct</span></div><div class="progress-rail review-progress"><span style="width:${100*(sessionDone+sessionSkipped)/total}%"></span></div>
 <div class="review-card"><p class="eyebrow">${promptType}</p><p class="review-hanzi" lang="zh-Hans">${esc(c.prompt)}</p><h2>${esc(c.question)}</h2>
 ${!revealed?`<p class="muted">Pronunciation and translations are hidden until checking.</p>
 ${c.kind==='choice'?`<div class="choice-list" role="group" aria-label="Choose sentence meaning">${options.map((opt,i)=>`<button type="button" class="choice ${chosenOption===opt?'selected':''}" data-action="review-pick" data-option="${esc(opt)}" aria-pressed="${chosenOption===opt}"><span>${String.fromCharCode(65+i)}</span>${esc(opt)}</button>`).join('')}</div>`:`<div class="answer-entry"><label for="review-entry">${c.kind==='pinyin'?'Your pinyin (marks or numbers)':'Your English meaning'}</label><input id="review-entry" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${c.kind==='pinyin'?'For example, ni3 or nǐ':'Type the meaning'}" value="${esc(typedAnswer)}"></div>`}
 <div class="button-row">${action('submit-review','Check answer ↵','button primary',((c.kind==='choice'?!chosenOption:!typedAnswer.trim())?'disabled':''))}${action('reveal-review','Reveal answer','button outline')}${action('review-skip','Skip for now','button outline')}</div>`:
 `<div class="review-answer ${checkResult?.correct?'correct':'incorrect'}" role="status"><p class="eyebrow">${checkResult?.correct?'CORRECT':'LEARNING FEEDBACK'}</p><p>${esc(checkResult?.message||'Review this answer.')}</p>${typedAnswer||chosenOption?`<p class="your-answer">You entered: <strong>${esc(typedAnswer||chosenOption)}</strong></p>`:''}<p>Reference answer: <strong>${esc(c.answer)}</strong></p>${c.reading?`<span class="muted">${esc(c.reading)}</span>`:''}${c.kind==='pinyin'?toneTeachingPanel(c.answer,checkResult?.reason||''):''}<div>${action('speak','▶ Listen','button outline small',`data-text="${esc(c.prompt)}"`)}</div></div><div class="button-row">${checkResult?.correct?`${action('grade','Good · Next →','button primary',`data-grade="2"`)}${action('grade','Easy · Next →','button outline',`data-grade="3"`)}`:action('grade','Again · Next →','button primary',`data-grade="0"`)}</div>`}
 </div><p class="study-note">Demo-only scheduler. Accurate answers are recorded per skill; the system does not claim calibrated mastery.</p></div>`;
}
function readerLesson(){return findLesson(readerLessonId)||DEMO_LESSONS[0];}
function renderReader(){const l=readerLesson(),cloze=makeCloze(l),mode=readerMode==='cloze'&&cloze?'cloze':'meaning';const options=mode==='cloze'?cloze.options:makeOptions(l.sentence.english,'sentence',l.id);
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
 p38Section='all';p38Pinyin=false;p38English=false;
 p41Section='all';p41Pinyin=false;p41English=false;
 storyParagraph=0;storyParagraphOnly=false;storyParagraphTranslations=[];
 beginnerPart='all';beginnerWordShown=false;beginnerPartTip='';
 storyFocusIndex=-1;
 if((!findStory(storyId)?.extended&&DEEP_READING_MODES.some(([id])=>id===storyMode))||(!findStory(storyId)?.beginner&&BEGINNER_MODES.some(([id])=>id===storyMode)))storyMode='comprehension';
 resetStoryExercise();
}
function resetStoryExercise(){storyResult=null;storyAssist=Boolean(findStory(storyId)?.beginner?.p41&&(p41Pinyin||p41English));storyShowTranslation=false;storyHelpIndex=-1;storyGlossary=null;storySequence=[];storyTyped='';}
function renderStories(){const routeAdvanced=(location.hash.match(/^#\/stories\/(story-\d+)/)||[])[1];
 if(routeAdvanced&&STORIES.some(x=>x.id===routeAdvanced&&/^original-p5[0-4]$/.test(x.beginner?.source||''))){
  if(routeAdvanced!==storyId){
   storyId=routeAdvanced;storyMode='beginner-detail';resetReadingNavigation();
  }
  const chosenMode=new URLSearchParams(location.hash.split('?')[1]||'').get('mode');
  if(['beginner-detail','beginner-reason','beginner-sequence'].includes(chosenMode)&&
    storyMode!==chosenMode){storyMode=chosenMode;resetStoryExercise();}
 }
 const routeP41=(location.hash.match(/^#\/stories\/(p41-\d{2})/)||[])[1];
 if(routeP41){const selected=STORIES.find(x=>x.beginner?.p41?.id===routeP41);
  if(selected&&selected.id!==storyId){storyId=selected.id;storyMode='beginner-detail';resetReadingNavigation();}
 }
 const routeP38=(location.hash.match(/^#\/stories\/(p38-\d{2})/)||[])[1];
 if(routeP38){const selected=STORIES.find(x=>x.beginner?.p38?.id===routeP38);
  if(selected&&selected.id!==storyId){storyId=selected.id;storyMode='beginner-detail';resetReadingNavigation();}
 }
 const story=findStory(storyId)||STORIES[0],isExtendedMode=DEEP_READING_MODES.some(([mode])=>mode===storyMode),isBeginnerMode=BEGINNER_MODES.some(([mode])=>mode===storyMode),exercise=isBeginnerMode?beginnerQuestion(story,storyMode):isExtendedMode?deepReadingQuestion(story,storyMode):CONTEXT_MODES.includes(storyMode)?contextQuestion(story.id,storyMode):storyExercise(story,storyMode),reading=storySummary(state);const ordering=storyMode==='ordering',coverage=introducedCharacterCoverage(story,state.learned);
 const selected=new Set(storySequence);const shuffled=ordering?shuffledChunkIndices(exercise.chunks,story.id):[];
 const linkedTokens=story.lines.flatMap(line=>tokenizeSentence(line.hanzi)).filter(t=>t.entry);const introducedTokens=linkedTokens.filter(t=>t.entry.lessonIds.some(id=>state.learned.includes(id))).length;
 return `${title('CONNECTED READING','Read a little more.','Read original Mandarin texts, including multi-paragraph stories, notices, dialogues and practical information. No official HSK alignment or human-recorded audio is claimed.')}
 ${gated()}<details class="p41-catalog" ${story.beginner?.p41||p41BrowseOpen?'open':''}><summary>P41 · Intermediate reader · 12 sixteen-sentence passages</summary>${p41Overview(state,action,esc,{stage:p41Stage,query:p41Query,page:p41Page,selected:story.beginner?.p41?.id})}</details>${story.beginner?.p41&&storyMode==='beginner-writing'&&!storyAssist&&!storyResult?'<section class="p38-writing-cover"><strong>P41 independent writing · reading hidden</strong><p>The full passage is withheld until help is requested or an answer is submitted.</p></section>':p41PassagePanel(story,action,esc,{section:p41Section,pinyin:p41Pinyin,english:p41English,assisted:storyAssist})}<details class="p38-catalog" ${story.beginner?.p38||p38BrowseOpen?'open':''}><summary>P38 · Elementary reader · 30 connected passages</summary>${p38Overview(state,action,esc,{stage:p38Stage,query:p38Query,page:p38Page,selected:story.beginner?.p38?.id})}</details>${story.beginner?.p38&&storyMode==='beginner-writing'&&!storyAssist&&!storyResult?
 '<section class="p38-writing-cover"><strong>Independent writing — reading hidden</strong><p>The full P38 passage is withheld until you choose a teaching hint or submit your answer.</p></section>':
 p38PassagePanel(story,action,esc,{section:p38Section,pinyin:p38Pinyin,english:p38English,assisted:storyAssist})}<details class="p34-catalog" ${story.beginner?.source==='original-p34'?'open':''}><summary>Open P34 Reading & Listening · 25 pairs</summary>${p34Overview(state,action,esc)}</details>${story.beginner?.source==='original-p34'?`<div class="p34-read-bridge"><strong>P34 · Paired listening</strong>${action('p34-open-listening','Listen to the separate spoken situation →','button primary small',`data-id="${P34_LISTENING.find(x=>x.readingTitle===story.title)?.id||''}"`)}</div>`:''}${beginnerReadingShelf(state,story,action,esc,beginnerLevel)}<section class="simple-panel dialogue-shortcut"><div><strong>Try a conversation after reading</strong><p>Original dialogues build on everyday Mandarin in context.</p></div>${action('open-dialogues','Open Conversation Lab →','button primary')}</section><div class="stories-top"><div><label for="story-choice">Reading lesson</label><select id="story-choice">${STORIES.filter(s=>(!storiesLongOnly||s.extended)&&(!storiesBeginnerOnly||s.beginner)&&(!storiesOnlyBookmarked||(state.bookmarkedStories||[]).includes(s.id))).map((s,i)=>`<option value="${s.id}" ${s.id===story.id?'selected':''}>${STORIES.indexOf(s)+1}. ${esc(s.title)} — ${esc(s.theme)}</option>`).join('')}</select></div><div class="story-stat"><strong>${reading.storiesRead}/${STORIES.length}</strong><span>readings with correct independent practice</span></div></div>
 <div class="reading-tools">${action('story-bookmark',(state.bookmarkedStories||[]).includes(story.id)?'★ Saved reading':'☆ Save reading','button outline small')}${action('story-bookmarks-only',storiesOnlyBookmarked?'Show all readings':'Show saved only','button outline small')}${action('reading-beginner-filter',storiesBeginnerOnly?'All reading lengths':'Beginner readings only','button outline small')}${action('reading-long-filter',storiesLongOnly?'All reading lengths':'Extended readings only','button outline small')}${action('reading-text-size',state.settings.readingLarge?'Standard text':'Larger Chinese text','button outline small')}<span class="muted">${(state.bookmarkedStories||[]).length} saved · ${introducedTokens}/${linkedTokens.length} glossary occurrences linked to introduced lessons</span></div><div class="stories-layout ${state.settings.readingLarge?'large-reading':''}"><article class="simple-panel story-paper"><p class="eyebrow">READING ${String(STORIES.indexOf(story)+1).padStart(2,'0')} · ${esc(story.theme)}</p><h2>${esc(story.title)}</h2>${beginnerReadingHeading(story,action,esc,beginnerPart,beginnerWordShown)}${readingExtendedHeader(story,action,esc,{paragraph:storyParagraph,only:storyParagraphOnly,translations:storyParagraphTranslations})}<p class="muted">${coverage.introduced}/${coverage.total} relevant demo lesson characters introduced. This does not measure total vocabulary or grammar knowledge. Tap an underlined word for a glossary hint; using hints makes the following answer assisted.</p>
 ${(storyMode==='passage-writing'||storyMode==='beginner-writing')&&!storyAssist&&!storyResult?`<div class="p27-writing-hide"><strong>Recall without a visible source</strong><p>The passage is hidden for reading-to-writing production. Revealing it marks this attempt assisted.</p>${action('reading-show-writing-source','Review passage · assisted','button outline small')}</div>`:story.lines.map((line,i)=>(storyParagraphOnly&&story.extended&&paragraphFor(story,i)!==storyParagraph||story.beginner&&beginnerPart!=='all'&&Math.floor(i/3)!==Number(beginnerPart)||story.beginner?.p41&&p41Section!=='all'&&!(i>=story.beginner.p41.paragraphs[Number(p41Section)-1]?.start&&i<=story.beginner.p41.paragraphs[Number(p41Section)-1]?.end)||story.beginner?.p38&&p38Section!=='all'&&!(p38Section==='1'?i<=3:p38Section==='2'?i>=4&&i<=8:i>=9))?'':`${beginnerPartMarker(story,i,action,esc,beginnerPartTip)}${readingParagraphMarker(story,i,action,esc,storyParagraphTranslations)}<section class="story-line ${storyFocusIndex===i?'reading-line-focused':''}"><div class="story-line-top"><span class="eyebrow">SENTENCE ${i+1}</span><div class="story-line-actions">${action('speak','▶ Listen','button outline small',`data-text="${esc(line.hanzi)}"`)}${action('story-help-line',storyHelpIndex===i?'Hide help':'Explain','button outline small',`data-index="${i}"`)}</div></div><p lang="zh-Hans" class="story-chinese">${tokenizeSentence(line.hanzi).map(({text,entry})=>entry?`<button type="button" class="story-token" lang="zh-Hans" data-action="story-token" data-token="${esc(entry.hanzi)}" aria-label="Look up ${esc(entry.hanzi)}">${esc(text)}</button>`:esc(text)).join('')}</p>${storyShowTranslation||storyHelpIndex===i||story.extended&&storyParagraphTranslations.includes(paragraphFor(story,i))?`<div class="line-support"><p class="story-pinyin">${esc(line.pinyin)}</p><p class="story-english">${esc(line.english)}</p></div>`:''}</section>`).join('')}
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
 if(session.cursor>=session.limit)return `${title('GUIDED PRACTICE','Session complete.','These answers were saved as supplementary practice, not scheduled-review mastery.')}${gated()}<article class="simple-panel guided-session"><div class="stats-grid">${stat(session.cursor,'Questions completed')}${stat(session.correct,'Correct independently')}${stat(session.assisted,'Assisted/revealed')}</div><p>Your past practice is retained if you start a new session.</p><div class="button-row">${action('guided-end','Back to Practice Lab','button primary')}${action('go-progress','See activity','button outline')}</div></article>`;
 const q=guidedQuestion(session),chosen=new Set(guidedOrder),orders=q.kind==='ordering'?q.chunks.map((_,i)=>i).sort((a,b)=>(a*13+session.cursor*3)%19-(b*13+session.cursor*3)%19):[];
 const source=q.sourceType==='story'?`Reading · ${esc(findStory(q.sourceId).title)}`:q.sourceType==='drill'?`Lesson · ${esc(findLesson(q.sourceId).hanzi)}`:q.sourceType==='sense'?'Word Sense Lab':q.sourceType==='sentence'?'Sentence Workshop':q.sourceType==='mission'?`Dialogue · ${esc(q.dialogue.title)}`:'Connected practice';
 const usedHint=guidedAssisted||Boolean(session.assistanceUsed);
 return `${title('GUIDED PRACTICE','One question at a time.','A checkpoint is saved after each graded answer. The session survives an ordinary app restart.')}${gated()}
 <section class="simple-panel guided-session"><div class="guided-meta"><span>${session.cursor+1} of ${session.limit} · ${source}</span><span>${session.correct} independent correct · ${session.assisted} assisted</span></div><div class="progress-rail"><span style="width:${session.cursor/session.limit*100}%"></span></div>
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
function renderPractice(){if(state.practiceSession)return renderGuidedPractice();const l=findLesson(drillLessonId)||DEMO_LESSONS[0],d=buildDrill(l.id,drillMode),record=practiceSummary(state),available=state.learned.length;
 const selected=new Set(drillOrder),choices=d.kind==='ordering'?d.chunks.map((_,i)=>i).sort((a,b)=>(a*13+l.order*7)%17-(b*13+l.order*7)%17):[];
 return `${title('PRACTICE LAB','Think, retrieve, connect.','Six optional formats practice forms, readings, words and sentence contexts. Results are tracked separately from scheduled-review mastery.')}${gated()}${fluencyHomePanel()}
 <section class="simple-panel practice-shortcuts"><h2>Practice beyond flashcards</h2><p>Review your saved words or follow a conversation without affecting scheduled-review mastery.</p><div class="button-row">${action('open-wordbook-practice','Saved word drills →','button outline')}${action('open-dialogues','Conversation Lab →','button outline')}${action('connected-session','Connect words, sentences and dialogues →','button outline')}</div></section>
 <section class="simple-panel guided-start"><div><p class="eyebrow">NEW · CONTINUOUS STUDY</p><h2>Guided practice session</h2><p>Mix characters, words, pinyin, and short readings across your learning history. Answers save after each question and can be resumed after reopening the app. Supplemental practice never raises scheduled-review mastery.</p></div><div class="guided-start-actions"><label>Session focus<select id="guided-focus"><option value="balanced" ${guidedFocus==='balanced'?'selected':''}>Balanced mix</option><option value="weak" ${guidedFocus==='weak'?'selected':''}>Focus recent mistakes</option><option value="reading" ${guidedFocus==='reading'?'selected':''}>Reading & context</option><option value="sentences" ${guidedFocus==='sentences'?'selected':''}>Sentence reasoning</option><option value="pronunciation" ${guidedFocus==='pronunciation'?'selected':''}>Pinyin & tones</option><option value="connected" ${guidedFocus==='connected'?'selected':''}>Connect senses, sentences & dialogues</option></select></label><label>Questions<select id="guided-size">${[5,10,20].map(n=>`<option value="${n}" ${n===guidedLimit?'selected':''}>${n} questions</option>`).join('')}</select></label>${action('guided-start','Start session →','button primary')}</div></section>
 <div class="practice-header"><label>Choose a demo lesson<select id="drill-lesson">${DEMO_LESSONS.map(item=>`<option value="${item.id}" ${l.id===item.id?'selected':''}>${item.order}. ${esc(item.hanzi)} — ${esc(item.meaning)}</option>`).join('')}</select></label><p>${record.attempts} supplemental attempts · ${record.independentCorrect} correct without hints · ${available} lessons introduced</p></div>
 <div class="practice-tabs" role="group" aria-label="Exercise format">${[['recognition','Find character'],['word-meaning','Word meaning'],['word-pinyin','Word pinyin'],['word-build','Build a word'],['sentence-cloze','Complete sentence'],['reading-choice','Character pinyin']].map(([mode,label])=>action('drill-mode',label,mode===drillMode?'button dark small':'button outline small',`data-mode="${mode}" aria-pressed="${mode===drillMode}"`)).join('')}</div>
 <article class="simple-panel practice-card"><p class="eyebrow">${esc(drillMode.replaceAll('-',' ').toUpperCase())} · NON-HSK DEMO</p><h2>${esc(d.prompt)}</h2>${d.hanzi?`<p lang="zh-Hans" class="practice-hanzi">${esc(d.hanzi)}</p>`:''}
 ${!drillResult?(d.kind==='choice'?`<div class="choice-list">${d.options.map((option,i)=>action('drill-answer',`<span>${String.fromCharCode(65+i)}</span>${esc(option)}`,'choice',`data-option="${esc(option)}"`)).join('')}</div>`:d.kind==='ordering'?`<p class="muted">Tap the characters in order. Tap an assembled character to remove it.</p><div class="story-assembled">${drillOrder.length?drillOrder.map((idx,i)=>action('drill-order-remove',esc(d.chunks[idx]),'chunk chosen',`data-index="${i}"`)).join(''):'<span class="muted">Your word will appear here.</span>'}</div><div class="story-chunks">${choices.filter(x=>!selected.has(x)).map(i=>action('drill-order-add',esc(d.chunks[i]),'chunk',`data-index="${i}"`)).join('')}</div>`:`<div class="answer-entry"><label for="drill-entry">Pinyin with tones</label><input id="drill-entry" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" value="${esc(drillTyped)}" placeholder="Tone marks or tone numbers"></div>`):`<div class="reader-feedback ${drillResult.correct?'correct':'incorrect'}" role="status"><strong>${drillResult.correct?'Correct.':'Review the example.'}</strong><p>${esc(drillResult.message)}</p><p><strong>Reference:</strong> ${esc(d.answer)}</p><p>${esc(d.explanation)}</p><p class="muted">${drillResult.assisted?'Hint or reveal used. This attempt is assisted.':'Result saved as supplemental practice only.'}</p></div>`}
 ${drillAssisted&&!drillResult?`<div class="lesson-guide"><strong>Teaching hint</strong><p>${esc(l.note)}</p><p class="muted">This attempt will be marked assisted, regardless of the answer.</p></div>`:''}
 <div class="button-row">${!drillResult?`${d.kind!=='choice'?action('drill-check','Check answer','button primary',(d.kind==='pinyin'?!drillTyped.trim():!drillOrder.length)?'disabled':''):''}${action('drill-hint','Hint','button outline')}${action('drill-reveal','Reveal reference','button outline')}`:`${action('drill-retry','Try again','button outline')}${action('drill-next','Next lesson →','button primary')}`}</div></article>`;
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
function renderExplore(){
 const linkedKey=new URLSearchParams(location.hash.split('?')[1]||'').get('word');
 if(linkedKey&&findWord(linkedKey))searchSelection={type:'word',id:linkedKey};
 const results=visibleExploreResults(),selected=searchSelection;
 const selectedResult=selected?.type==='word'?findWord(selected.id):selected?.type==='character'?findLesson(selected.id):null;
 return `${title('CHARACTER & WORD LOOKUP','Explore Chinese.','Search independent characters and complete vocabulary words, including alternate definitions and related lessons.')}${gated()}${exploreWorkspace(state,action,esc)}${p41Overview(state,action,esc,{compact:true})}${p43Overview(action,esc,{compact:true})}${p44Overview(state,action,esc,{compact:true})}${p45Overview(state,action,esc,{compact:true})}${p38Overview(state,action,esc,{compact:true})}${p42Overview(state,action,esc,{compact:true})}${p37Overview(state,action,esc,{compact:true})}<div class="button-row p36-explore-links">${action('grammar-select','P40 intermediate grammar →','button primary small','data-id="g95"')}${action('p40-sentences','P40 contextual sentences →','button outline small')}${action('grammar-select','P36 elementary grammar →','button outline small','data-id="g65"')}${action('p36-sentences','90 new grammar sentences →','button outline small')}</div><details id="p39-explore-vocabulary" class="p39-course-details" ${p39VocabOpen?'open':''}><summary>P39 · Elementary contextual vocabulary and word families</summary>${p39VocabShelf(state,action,esc,{page:p39VocabPage})}</details><details id="p35-explore-vocabulary" class="p35-course-details" ${p35VocabOpen?'open':''}><summary>P35 · Elementary contextual vocabulary and word families</summary>${p35VocabShelf(state,action,esc,{page:p35VocabPage})}</details><div class="button-row p32-explore-links">${action('p39-browse','P39 intermediate characters →','button outline small')}${action('p39-vocab','P39 contextual words →','button outline small')}${action('p35-browse','P35 character expansion →','button outline small')}${action('p35-vocab-open','P35 contextual vocabulary →','button outline small')}${action('p34-open-reading','P34 guided reading →','button outline small','data-id="p34-01"')}${action('p34-open-listening','P34 listening-first →','button outline small','data-id="p34-audio-01"')}${action('p33-browse','Everyday conversations →','button outline small')}${action('grammar-select','P32 beginner grammar →','button outline small','data-id="g37"')}${action('p32-open-sentences','120 new contextual sentences →','button outline small')}</div>${p31VocabularyShelf(state,action,esc,{page:p31WordPage})}${vocabularyShelfPanel()}
 <div class="search-shell"><label class="field-label" for="explore-query">Find a character, word, pinyin or meaning</label><input type="search" id="explore-query" autocomplete="off" spellcheck="false" placeholder="Try 学校, xue, friend, water" value="${esc(searchQuery)}"><div class="mode-tabs" role="group" aria-label="Search category">${['all','characters','words'].map(k=>action('search-kind',k==='all'?'All':k==='words'?'Words':'Characters',exploreKind===k?'button dark small':'button outline small',`data-kind="${k}"`)).join('')}</div><div class="button-row wordbook-filter">${action('open-wordbook-practice','Practice saved words →','button primary')}${action('wordbook-filter',exploreSavedOnly?'Show all entries':'My saved words ('+(state.bookmarkedWords||[]).length+')','button outline small',`aria-pressed="${exploreSavedOnly}"`)}</div><p id="search-count" class="muted">${results.length} results · ${WORDS.length} distinct example word entries · Browsing never changes mastery.</p></div>
 <div class="explore-layout"><div class="p23-search-list"><div id="explore-results" class="results-list">${renderSearchResults(results)}</div><div id="explore-pager">${catalogPager(results.length)}</div></div><article id="explore-detail" class="explore-detail">${selectedResult?selected.type==='word'?wordDetail(selectedResult):exploreDetail(selectedResult):'<div class="empty-panel"><strong>Select an entry.</strong><p>Open a character or word to inspect its meanings, related lessons and usage.</p></div>'}</article></div>`;
}
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
function renderProgress(){const m=summary(state),r=storySummary(state),analytics=learningAnalytics(state),practice=practiceSummary(state);const breakdown=[['Character meaning',['meaning']],['Character reading',['reading']],['Vocabulary meaning',['word0','word1','word2']],['Word pronunciation',['wordread0','wordread1','wordread2']],['Sentence comprehension',['sentence']]];
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
 ${finishOverviewPanel()}<section class="simple-panel"><h2>What the results mean</h2><p><strong>Introduced</strong> means a lesson was completed. <strong>Independent correct</strong> means an answer passed the conservative automatic checker without an answer reveal. <strong>Mastery</strong> requires delayed validation and is not certified by this demo.</p><p class="muted">Your history is stored locally. Export a backup if you need to preserve it across browsers or devices.</p></section>`;
}
function renderSettings(){const s=state.settings;return `${title('PREFERENCES & DATA','Make the workspace yours.','Your learning activity is stored locally. Back it up when you want to keep a copy.')}
 <section class="simple-panel"><h2>Study preferences</h2><div class="setting-row"><div><strong>Pinyin during teaching</strong><p>Show pronunciation while studying. It stays hidden during independent review.</p></div><label class="toggle"><input type="checkbox" data-setting="showPinyin" ${s.showPinyin?'checked':''}><span>Show</span></label></div><div class="setting-row"><div><strong>Dark appearance</strong><p>Use a darker, high-contrast learning workspace.</p></div><label class="toggle"><input type="checkbox" data-setting="dark" ${s.dark?'checked':''}><span>Dark</span></label></div><div class="setting-row"><div><strong>Target new lessons per day</strong><p>Preference for future learning recommendations, not a strict limit.</p></div><select data-setting="dailyNew" aria-label="Target new lessons per day">${[2,3,5,8,10,15].map(n=>`<option value="${n}" ${n===s.dailyNew?'selected':''}>${n} lessons</option>`).join('')}</select></div></section>
 <section class="simple-panel"><h2>Optional placement check</h2><p>A six-question demo recognition check can suggest where to begin. It does not create mastery credit, mark lessons learned, or claim an official HSK level.</p><p>${state.placement?.status==='completed'?'Completed · '+state.placement.answers.filter(a=>a.correct).length+'/6 correct':state.placement?.status==='active'?'In progress · '+state.placement.answers.length+'/6 answered':'Not completed'}</p>${action('placement-restart','Restart placement check','button outline')}</section>
 <section class="simple-panel"><h2>Reading preferences</h2><div class="setting-row"><div><strong>Larger Chinese characters throughout</strong><p>Increase Hanzi sizes in lessons, reviews and reading without exposing answers.</p></div><label class="toggle"><input type="checkbox" data-setting="hanziLarge" ${s.hanziLarge?'checked':''}><span>Large</span></label></div><div class="setting-row"><div><strong>Larger Chinese text in readings</strong><p>Adjust story reading without changing the assessment answer.</p></div><label class="toggle"><input type="checkbox" data-setting="readingLarge" ${s.readingLarge?'checked':''}><span>Large</span></label></div></section><section class="simple-panel"><h2>Session recovery</h2><p>Your saved vocabulary wordbook contains ${(state.bookmarkedWords||[]).length} entries. ${(state.dialogueEvents||[]).length} dialogue and ${(state.wordPracticeEvents||[]).length} wordbook attempts, plus ${(state.senseEvents||[]).length} contextual-sense, ${(state.sentenceEvents||[]).length} sentence-building, and ${(state.missionEvents||[]).length} conversation-mission attempts are included in JSON backups. Each completed mixed-practice answer is saved transactionally together with the current session position. Backups include an unfinished guided session, and older backups with no session remain valid.</p><p>${state.practiceSession?`Guided practice checkpoint: ${state.practiceSession.cursor} of ${state.practiceSession.limit} answered.`:'No unfinished guided session.'}</p>${state.practiceSession?action('open-practice','Resume saved session →','button outline'):''}</section>
 ${recoveryCenterPanel()}<section class="simple-panel"><h2>Your learning data</h2><p>Export a JSON backup before switching browsers or clearing site storage. A local browser database cannot protect against device failure.</p><div class="button-row">${action('export','Export backup','button primary')}${action('import-open','Import backup','button outline')}${action('reset','Reset demo progress','button danger')}</div><input id="import-file" type="file" accept="application/json,.json" hidden><div class="button-row">${action('storage-check','Check local storage status','button outline')}</div><p class="muted">Local data revision: ${state.revision} · Browser storage is not a permanent backup.</p><p id="storage-detail" class="muted">${db?'IndexedDB connected. Completed writes are confirmed transactionally.':'Storage unavailable: lessons and reviews cannot be saved.'}</p></section>${backupPreviewPanel()}
 <section class="simple-panel"><h2>Curriculum status</h2><p><strong>Available:</strong> ${DEMO_LESSONS.length} original, author-written Mandarin demonstration lessons, not independently verified as official exam content.</p><p><strong>Not installed:</strong> Official 2025 HSK character and vocabulary inventories, approved audio libraries, and certified examination preparation.</p><p class="muted">No external analytics, cloud services, accounts, or remote curriculum downloads are used by this build.</p></section>`}
function applySettings(){document.documentElement.dataset.theme=state.settings.dark?'dark':'light';document.documentElement.dataset.hanziSize=state.settings.hanziLarge?'large':'normal';}
function renderFind(){return unifiedSearchPage({query:p30Query,kind:p30Kind,saved:p30Saved,page:p30Page,state},action,esc,title,gated);}
function p44ReturnStrip(){
 if(!p44SessionId)return '';
 const s=findP44Scenario(p44SessionId);
 return s?'<div class="p44-return-strip"><span>Integrated practice context: '+esc(s.title)+'</span>'+
  action('p44-return','Return to P44 skill journey →','button outline small')+'</div>':'';
}
function renderIntegrated(){
 const id=(location.hash.match(/^#\/integrated\/(p44-\d{2})/)||[])[1];
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const requested=params.get('stage');
 if(id&&findP44Scenario(id)&&id!==p44SessionId){
  p44SessionId=id;p44ReadHelp=false;p44ListenHelp=false;
  p44QuestionIndex=0;p44Feedback=null;p44Phase='read';
 }
 if(id&&P44_PHASES.some(p=>p.id===requested))p44Phase=requested;
 const s=findP44Scenario(p44SessionId)||P44_SCENARIOS[0];
 return title('P44 · INTEGRATED INTERMEDIATE MANDARIN','Use language across real situations.',
 'Read original evidence, interpret a spoken exchange, answer source questions, write exact forms and prepare a meaningful spoken reply.')+
 gated()+p44Journey(s,state,action,esc,{phase:p44Phase,sourceHelp:p44ReadHelp,transcriptHelp:p44ListenHelp,
 assisted:p44AssistedCases.has(s.id),questionIndex:p44QuestionIndex,feedback:p44Feedback})+
 p44Overview(state,action,esc,{selected:s.id,query:p44Query,page:p44Page});
}
function p45ReturnStrip(){
 const c=findP45Transfer(p45CaseId);
 return c?'<div class="p45-return-strip"><span>Current cumulative transfer: '+esc(c.title)+'</span>'+
  action('p45-return','Return to P45 challenge →','button outline small')+'</div>':'';
}
function renderCumulative(){
 const selected=(location.hash.match(/^#\/cumulative\/(p45-\d{2})/)||[])[1];
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 if(selected&&findP45Transfer(selected)&&selected!==p45CaseId){
  p45CaseId=selected;p45Stage='read';p45Question=0;p45Feedback=null;
  p45SourceHelp=false;p45Transcript=false;
 }
 if(selected&&['read','listen','check','produce'].includes(params.get('stage')))p45Stage=params.get('stage');
 const scene=findP45Transfer(p45CaseId)||p45Recommendations(state)[0]?.caseItem||P45_TRANSFERS[0];
 return title('P45 · CUMULATIVE PRACTICE','Transfer meaning across contexts.',
 'Source-linked reading, independent listening, native evidence questions, written reconstruction and oral preparation; due cards stay in the existing Review.')+
 gated()+p45Learning(scene,state,action,esc,{stage:p45Stage,revealed:p45Transcript,
 sourceHelp:p45SourceHelp,assisted:p45AssistedCases.has(scene.id),questionIndex:p45Question,feedback:p45Feedback})+
 p45Overview(state,action,esc,{selected:scene.id,filter:p45Filter});
}
function p46ReturnStrip(){
 const p=findP46Passage(p46UnitId);
 return p?'<div class="p46-return-strip"><span>Upper-intermediate lesson: '+esc(p.title)+'</span>'+
 action('p46-return','Return to P46 →','button outline small')+'</div>':'';
}
function renderUpper(){
 const id=(location.hash.match(/^#\/upper\/(p46-\d{2})/)||[])[1];
 const stage=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP46Passage(id)&&id!==p46UnitId){
  p46UnitId=id;p46Stage='characters';p46ReaderHelp=false;p46AudioHelp=false;
  p46ReaderIndex=0;p46ListenerIndex=0;p46ReaderFeedback=null;p46ListenerFeedback=null;
 }
 if(id&&P46_STAGES.some(s=>s.id===stage))p46Stage=stage;
 const p=findP46Passage(p46UnitId)||p46Next(state);
 return title('P46 · UPPER-INTERMEDIATE BRIDGE','Learn characters, arguments and connected Mandarin.',
 'Original HSK 4-targeted lessons with native Course introductions, grammar, three-paragraph reading, scripted listening and independent production.')+
 gated()+p46Lesson(p,state,action,esc,{stage:p46Stage,readerHelp:p46ReaderHelp,audioHelp:p46AudioHelp,
 readerIndex:p46ReaderIndex,listenerIndex:p46ListenerIndex,readerFeedback:p46ReaderFeedback,
 listenerFeedback:p46ListenerFeedback,assisted:p46AssistedUnits.has(p.id)})+
 p46Overview(state,action,esc,{selected:p.id,query:p46Query});
}
function p47ReturnStrip(){
 const p=findP47Passage(p47UnitId);
 return p?'<div class="p47-return-strip"><span>P47 advanced case: '+esc(p.title)+'</span>'+
 action('p47-return','Return to source-linked practice →','button outline small')+'</div>':'';
}
function renderAdvanced(){
 const id=(location.hash.match(/^#\/advanced\/(p47-\d{2})/)||[])[1];
 const stage=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP47Passage(id)&&id!==p47UnitId){
  p47UnitId=id;p47Stage='words';p47ReadingHelp=false;p47ListeningHelp=false;
  p47ReadingIndex=0;p47ListeningIndex=0;p47ReadingFeedback=null;p47ListeningFeedback=null;p47ProductionModels=false;
 }
 if(id&&P47_STAGES.some(s=>s.id===stage))p47Stage=stage;
 const p=findP47Passage(p47UnitId)||p47Next(state);
 return title('P47 · ADVANCED CONTEXTUAL MANDARIN','Explain meaning with evidence.',
 'Original contextual character families, advanced grammar, four-paragraph reading, scripted conversation and native independent transfer.')+
 gated()+p47Lesson(p,state,action,esc,{stage:p47Stage,readingHelp:p47ReadingHelp,listeningHelp:p47ListeningHelp,
 readingIndex:p47ReadingIndex,listeningIndex:p47ListeningIndex,readingFeedback:p47ReadingFeedback,
 listeningFeedback:p47ListeningFeedback,assisted:p47AssistedUnits.has(p.id),productionModels:p47ProductionModels})+
 p47Overview(state,action,esc,{selected:p.id,query:p47Query});
}
function p48ReturnStrip(){
 const p=findP48Passage(p48CaseId),a=p&&findP48Argument(p.id);
 return p?'<div class="p48-return-strip"><div><strong>Current P48 source argument: '+esc(p.title)+'</strong>'+
 (a?'<p>'+esc(a.writing)+'</p>':'')+'</div>'+
 action('p48-return','Return to P48 source evidence →','button outline small')+'</div>':'';
}
function renderComparative(){
 const id=(location.hash.match(/^#\/comparative\/(p48-\d{2})/)||[])[1];
 const stage=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP48Passage(id)&&id!==p48CaseId){
  p48CaseId=id;p48Stage='compare';p48Translations=false;p48Transcript=false;p48Models=false;
  p48ReadingIndex=0;p48ListeningIndex=0;p48ReadingFeedback=null;p48ListeningFeedback=null;p48SelfReview.clear();
 }
 if(id&&P48_STAGES.some(x=>x.id===stage))p48Stage=stage;
 const current=findP48Passage(p48CaseId)||p48Next(state);
 if(!p48CaseId)p48CaseId=current.id;
 return title('P48 · ARGUMENTATIVE MANDARIN','Compare evidence before forming a conclusion.',
 'Original source dossiers, three-speaker dialogue, native comprehension and P43 independent writing.')+
 gated()+p48Lesson(current,state,action,esc,{stage:p48Stage,translations:p48Translations,
 transcript:p48Transcript,readingIndex:p48ReadingIndex,listeningIndex:p48ListeningIndex,
 readingFeedback:p48ReadingFeedback,listeningFeedback:p48ListeningFeedback,
 models:p48Models,checks:[...p48SelfReview]})+
 p48Overview(state,action,esc,{selected:current.id,query:p48Query});
}
function p49ReturnStrip(){
 const c=findP49Case(p49CaseId);
 return c?'<div class="p49-return-strip"><span>Cumulative native transfer: '+esc(c.title)+' · original '+esc(c.sourceId)+'</span>'+
 action('p49-return','Return to P49 →','button outline small')+'</div>':'';
}
function renderCumulative49(){
 const id=(location.hash.match(/^#\/cumulative49\/(p49-\d{2})/)||[])[1];
 const stage=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP49Case(id)&&id!==p49CaseId){
  p49CaseId=id;p49Stage='sources';p49Question=0;p49Feedback=null;
  p49ShowSource=false;p49Transcript=false;p49Models=false;
 }
 if(id&&P49_STAGES.some(s=>s.id===stage))p49Stage=stage;
 const choice=findP49Case(p49CaseId)||p49Recommendations(state)[0]?.caseItem||P49_CASES[0];
 if(!p49CaseId&&choice)p49CaseId=choice.id;
 return title('P49 · CUMULATIVE INDEPENDENT TRANSFER','Practice the exact misunderstanding.',
 'Original P39–P48 source-linked retrieval, true native answer evidence and canonical due review.')+
 gated()+p49Lesson(choice,state,action,esc,{stage:p49Stage,questionIndex:p49Question,
 feedback:p49Feedback,showSource:p49ShowSource,showTranscript:p49Transcript,showModels:p49Models})+
 p49Overview(state,action,esc,{selected:choice?.id,filter:p49Filter});
}
function p50ReturnStrip(){
 const p=findP50Passage(p50CaseId);
 return p?'<div class="p50-return-strip"><span>Active P50 discourse: '+esc(p.title)+'</span>'+
 action('p50-return','Return to original source journey →','button outline small')+'</div>':'';
}
function renderDiscourse50(){
 const id=(location.hash.match(/^#\/discourse50\/(p50-\d{2})/)||[])[1];
 const requested=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP50Passage(id)&&id!==p50CaseId){
  p50CaseId=id;p50Stage='language';p50ReadingHelp=false;p50ListeningHelp=false;p50Models=false;
  p50ReadingIndex=0;p50ListeningIndex=0;p50ReadingFeedback=null;p50ListeningFeedback=null;p50Checks.clear();
 }
 if(id&&P50_STAGES.some(s=>s.id===requested))p50Stage=requested;
 const p=findP50Passage(p50CaseId)||p50Next(state);if(!p50CaseId&&p)p50CaseId=p.id;
 return title('P50 · ADVANCED MANDARIN DISCOURSE','Reason precisely across original sources.',
 'Authorial HSK 5-targeted character families, grammar, longer reading, dialogue and ungraded argument preparation.')+
 gated()+p50Lesson(p,state,action,esc,{stage:p50Stage,
 readingHelp:p50ReadingHelp,listeningHelp:p50ListeningHelp,models:p50Models,
 readingIndex:p50ReadingIndex,listeningIndex:p50ListeningIndex,
 readingFeedback:p50ReadingFeedback,listeningFeedback:p50ListeningFeedback,
 checks:[...p50Checks]})+p50Overview(state,action,esc,{selected:p?.id||'',query:p50Query});
}
function p51ReturnStrip(){
 const p=findP51Passage(p51CaseId);
 return p?'<div class="p51-return-strip"><span>Active P51 register and source transfer: '+esc(p.title)+'</span>'+
 action('p51-return','Return to original source journey →','button outline small')+'</div>':'';
}
function renderRegister51(){
 const id=(location.hash.match(/^#\/register51\/(p51-\d{2})/)||[])[1];
 const requested=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP51Passage(id)&&id!==p51CaseId){
  p51CaseId=id;p51Stage='language';p51ReadingHelp=false;p51ListeningHelp=false;p51Models=false;
  p51ReadingIndex=0;p51ListeningIndex=0;p51ReadingFeedback=null;p51ListeningFeedback=null;p51Checks.clear();
 }
 if(id&&P51_STAGES.some(s=>s.id===requested))p51Stage=requested;
 const p=findP51Passage(p51CaseId)||p51Next(state);if(!p51CaseId&&p)p51CaseId=p.id;
 return title('P51 · REGISTER AND SOURCE FLUENCY','Reason precisely across original sources.',
 'Authorial HSK 5-targeted character families, grammar, longer reading, dialogue and ungraded argument preparation.')+
 gated()+p51Lesson(p,state,action,esc,{stage:p51Stage,
 readingHelp:p51ReadingHelp,listeningHelp:p51ListeningHelp,models:p51Models,
 readingIndex:p51ReadingIndex,listeningIndex:p51ListeningIndex,
 readingFeedback:p51ReadingFeedback,listeningFeedback:p51ListeningFeedback,
 checks:[...p51Checks]})+p51Overview(state,action,esc,{selected:p?.id||'',query:p51Query});
}
function renderProduction(){
 const id=(location.hash.match(/^#\/production\/(p43-\d{2})/)||[])[1];
 // An external or interrupted deep link must obey the original P43 draft guard.
 if(id&&id!==p43UnitId&&findP43Unit(id)){
  if(p43Draft.trim()||p43Revisions.length){
   if(p43Pending!==id)p43Pending=id;
  }else{
   p43UnitId=id;p43Step='plan';p43Version=-1;p43Reviewed=[];
   p43ModelRevealed=false;p43SourceRevealed=false;p43Assisted=false;
   p43Pending='';p43Revisions=[];p43Draft='';
  }
 }
 const u=findP43Unit(p43UnitId)||P43_UNITS[0];
 return title('INTERMEDIATE PRODUCTION','Write, revise, then speak.','Original P43 writing and oral prompts. Drafts, revisions and self-review stay in browser-tab memory, not persistent learner evidence.')+
 gated()+p43Overview(action,esc,{selected:u.id,filter:p43Filter,query:p43Query})+
 p43ProductionStudio(u,action,esc,{draft:p43Draft,revisions:p43Revisions,compare:p43Version,reveal:p43ModelRevealed,
 step:p43Step,rubric:p43Reviewed,pending:p43Pending,showEvidence:p43SourceRevealed});
}

function p52ReturnStrip(){
 const c=findP52Case(p52CaseId);
 return c?'<div class="p52-return-strip"><span>Active P52 source dossier: '+esc(c.title)+'</span>'+
 action('p52-return','Return to original P52 investigation →','button outline small')+'</div>':'';
}
function renderSynthesis52(){
 const id=(location.hash.match(/^#\/synthesis52\/(p52-\d{2})/)||[])[1];
 const stage=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP52Case(id)&&id!==p52CaseId){
  p52CaseId=id;p52Stage='records';p52ReadingIndex=0;p52ListeningIndex=0;
  p52ReadingFeedback=null;p52ListeningFeedback=null;p52ReadingHelp=false;
  p52ListeningHelp=false;p52Models=false;p52Checks.clear();
 }
 if(id&&P52_STAGES.some(s=>s.id===stage))p52Stage=stage;
 const c=findP52Case(p52CaseId)||p52Next(state);
 if(!p52CaseId&&c)p52CaseId=c.id;
 return title('P52 · SOURCE INVESTIGATION AND EDITORIAL SYNTHESIS',
 'Compare independent Mandarin records and defend what they actually establish.',
 'Four original cross-source cases with canonical Reader and Dialogue questions, exact sentence reconstruction and ungraded independent argument revision.')+
 gated()+p52Lesson(c,state,action,esc,{
 stage:p52Stage,readingIndex:p52ReadingIndex,listeningIndex:p52ListeningIndex,
 readingHelp:p52ReadingHelp,listeningHelp:p52ListeningHelp,showModels:p52Models,
 readingFeedback:p52ReadingFeedback,listeningFeedback:p52ListeningFeedback,
 checks:[...p52Checks]})+
 p52Overview(state,action,esc,{selected:c?.id||'',query:p52Query});
}


function p53ReturnStrip(){
 const c=findP53Case(p53CaseId);
 return c?'<div class="p53-return-strip"><span>P53 source case: '+esc(c.title)+'</span>'+
  action('p53-return','Return to independent argument journey →','button outline small')+'</div>':'';
}
function renderArgument53(){
 const id=(location.hash.match(/^#\/argument53\/(p53-\d{2})/)||[])[1];
 const requested=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP53Case(id)&&id!==p53CaseId){
  p53CaseId=id;p53Stage='sources';p53ReadingIndex=0;p53ListeningIndex=0;
  p53ReadingFeedback=null;p53ListeningFeedback=null;p53ReadingHelp=false;
  p53ListeningHelp=false;p53Models=false;p53Checks.clear();
 }
 if(id&&P53_STAGES.some(s=>s.id===requested))p53Stage=requested;
 const c=findP53Case(p53CaseId)||p53Next(state);
 if(!p53CaseId&&c)p53CaseId=c.id;
 return title('P53 · ADVANCED INDEPENDENT SOURCE ARGUMENTATION',
  'Reconcile source authority, defend an objection, and transfer precisely between audiences.',
  'Original long-form bilingual Mandarin dossiers, multi-speaker evidence, ungraded independent argument preparation and native fixed-form practice.')+
 gated()+p53Lesson(c,state,action,esc,{
 stage:p53Stage,readingIndex:p53ReadingIndex,listeningIndex:p53ListeningIndex,
 readingHelp:p53ReadingHelp,listeningHelp:p53ListeningHelp,models:p53Models,
 readingFeedback:p53ReadingFeedback,listeningFeedback:p53ListeningFeedback,
 checks:[...p53Checks]})+
 p53Overview(state,action,esc,{selected:c?.id||'',query:p53Query});
}


function p54ReturnStrip(){
 const c=findP54Case(p54CaseId);
 return c?'<div class="p54-return-strip"><span>Current source: '+esc(c.title)+'</span>'+
 action('p54-return','Return to P54 learning →','button outline small')+'</div>':'';
}
function renderFluency54(){
 const id=(location.hash.match(/^#\/fluency54\/(p54-\d{2})/)||[])[1];
 const requested=new URLSearchParams(location.hash.split('?')[1]||'').get('stage');
 if(id&&findP54Case(id)&&id!==p54CaseId){
  p54CaseId=id;p54Stage='register';p54ReadingIndex=0;p54ListeningIndex=0;
  p54ReadingFeedback=null;p54ListeningFeedback=null;p54ReadingHelp=false;
  p54ListeningHelp=false;p54Models=false;p54Checks.clear();
 }
 if(id&&P54_STAGES.some(x=>x.id===requested))p54Stage=requested;
 const c=findP54Case(p54CaseId)||p54Next(state);
 if(!p54CaseId&&c)p54CaseId=c.id;
 return title('P54 · CUMULATIVE ADVANCED MANDARIN SOURCE FLUENCY',
 'Read carefully, explain independently, transfer beyond the original case.',
 'Original bilingual dossiers, multi-speaker listening, contextual vocabulary and ungraded written and spoken preparation.')+
 gated()+p54Lesson(c,state,action,esc,{
 stage:p54Stage,readingIndex:p54ReadingIndex,listeningIndex:p54ListeningIndex,
 readingHelp:p54ReadingHelp,listeningHelp:p54ListeningHelp,models:p54Models,
 readingFeedback:p54ReadingFeedback,listeningFeedback:p54ListeningFeedback,checks:[...p54Checks]})+
 p54Overview(state,action,esc,{selected:c?.id||'',query:p54Query});
}


function p55ReturnStrip(){
 const b=findP55Brief(p55FocusId);
 return b?'<div class="p55-return-strip"><div><strong>P55 active source comparison</strong><p>'+
 esc(b.title)+' · '+esc(b.from)+' / '+esc(b.to)+'</p></div><div class="p55-actions">'+
 action('p55-return','Return to source pair →','button outline small')+'</div></div>':'';
}
function renderAdvanced55(){
 const id=(location.hash.match(/^#\/advanced55\/(p55-\d{2})/)||[])[1];
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const requested=params.get('step');
 if(id&&findP55Brief(id)&&id!==p55FocusId){
  p55FocusId=id;p55Step='sources';p55Question=0;p55Reveal=false;p55Model=false;p55Support=false;p55RepairShown=false;
 }
 if(requested&&P55_STEPS.some(x=>x.id===requested))p55Step=requested;
 const q=params.get('question');
 if(q!==null&&['0','1','2'].includes(q))p55Question=Number(q);
 const b=findP55Brief(p55FocusId)||p55Next(state);
 if(!p55FocusId&&b)p55FocusId=b.id;
 return title('P55 · ADVANCED MANDARIN SOURCE CONSOLIDATION',
 'Read the actual sources. Revise without inflating the evidence.',
 'The original P50–P54 Reader, Dialogue, Wordbook, Sentence Workshop, Review and P43 writing remain the exclusive learning authorities.')+
 gated()+p55Lesson(b,state,action,esc,{
 step:p55Step,qIndex:p55Question,reveal:p55Reveal,
 showModel:p55Model,showSupport:p55Support,showRepair:p55RepairShown})+
 p55Overview(state,action,esc,{selected:b?.id||'',query:p55Query});
}

function p55ContextKind(){
 const b=findP55Brief(p55FocusId);if(!b)return null;
 const locationRoute=route(),hash=location.hash,params=new URLSearchParams(hash.split('?')[1]||'');
 const linked=params.get('p55')===b.id;
 const native=[p55Native(b.from),p55Native(b.to)].filter(Boolean);
 if(!linked)return null; // Never show a stale P55 handoff during unrelated original learning.
 if(locationRoute==='production'){
  const routeUnit=(hash.match(/^#\/production\/(p43-\d{2})/)||[])[1]||p43UnitId;
  return linked&&routeUnit===b.writingId?'writing':null;
 }
 if(locationRoute==='workshop'){
  const taskId=params.get('task'),task=taskId?SENTENCE_TASKS.find(t=>t.id===taskId):sentenceTask(sentenceIndex);
  return linked&&task?.p55BriefId===b.id?'return':null;
 }
 if(locationRoute==='explore')return linked&&p55NativeWords(b).some(w=>
  w.key&&(w.key===params.get('word')||w.key===searchSelection?.id))?'return':null;
 if(locationRoute==='stories'){
  const chosen=(hash.match(/^#\/stories\/(story-\d+)/)||[])[1]||storyId;
  return native.some(n=>n.story?.id===chosen)?'return':null;
 }
 if(locationRoute==='dialogues'){
  const chosen=(hash.match(/^#\/dialogues\/(dialogue-\d+)/)||[])[1]||dialogueId;
  return native.some(n=>n.dialogue?.id===chosen)?'return':null;
 }
 const rPrefix={discourse50:'p50',register51:'p51',synthesis52:'p52',
  argument53:'p53',fluency54:'p54'}[locationRoute];
 if(!rPrefix)return null;
 const caseId=(hash.match(new RegExp('^#/'+locationRoute+'/(p[0-9]+-[0-9]{2})'))||[])[1]||
  ({p50:p50CaseId,p51:p51CaseId,p52:p52CaseId,p53:p53CaseId,p54:p54CaseId})[rPrefix];
 return [b.from,b.to].includes(caseId)?'return':null;
}
function render(){const linkedP55=new URLSearchParams(location.hash.split('?')[1]||'').get('p55');
 if(findP55Brief(linkedP55)){
  p55FocusId=linkedP55;
  const backStep=new URLSearchParams(location.hash.split('?')[1]||'').get('p55step');
  if(P55_STEPS.some(x=>x.id===backStep))p55Step=backStep;
  const savedQuestion=new URLSearchParams(location.hash.split('?')[1]||'').get('p55q');
  if(savedQuestion!==null&&['0','1','2'].includes(savedQuestion))
   p55Question=Number(savedQuestion);
 }
 const p55Context=p55ContextKind();
 navUpdate();applySettings();const pages={today:renderToday,learn:renderLearn,review:renderReview,explore:renderExplore,progress:renderProgress,settings:renderSettings,reader:renderReader,stories:renderStories,practice:renderPractice,dialogues:renderDialogues,wordbook:renderWordbook,senses:renderSenses,workshop:renderWorkshop,production:renderProduction,integrated:renderIntegrated,cumulative:renderCumulative,upper:renderUpper,advanced:renderAdvanced,comparative:renderComparative,cumulative49:renderCumulative49,discourse50:renderDiscourse50,register51:renderRegister51,synthesis52:renderSynthesis52,argument53:renderArgument53,fluency54:renderFluency54,advanced55:renderAdvanced55,journey:renderJourney,ladder:renderLadder,block:renderBlock,fluency:renderFluency,plan:renderPlan,pinyin:()=>renderPinyinScreen({section:pinyinSection,filter:pinyinFilter,index:pinyinIndex,typed:pinyinTyped,feedback:pinyinFeedback,selectedSound:pinyinSound,selectedSyllable:pinyinSyllable},action,esc,title,gated),grammar:renderGrammar,sentences:renderSentences,pathway:renderPathway,find:renderFind};root.innerHTML=hubPathNav()+((route()==='today')?'':hubResumeStrip())+
 ((p44SessionId&&['stories','dialogues','production','workshop'].includes(route()))?p44ReturnStrip():'')+
 ((p45CaseId&&['stories','dialogues','production','workshop','integrated'].includes(route()))?p45ReturnStrip():'')+
 ((p46UnitId&&['learn','grammar','stories','dialogues','wordbook','workshop','production','cumulative'].includes(route()))?p46ReturnStrip():'')+
 ((p47UnitId&&['learn','grammar','stories','dialogues','wordbook','workshop','production','upper','cumulative'].includes(route()))?p47ReturnStrip():'')+
 ((p48CaseId&&['stories','dialogues','workshop','production','grammar','wordbook','advanced'].includes(route()))?p48ReturnStrip():'')+
 ((p49CaseId&&['stories','dialogues','workshop','production','grammar','wordbook','cumulative','upper','advanced','comparative','integrated'].includes(route()))?p49ReturnStrip():'')+
 ((p50CaseId&&['learn','stories','dialogues','workshop','production','grammar','wordbook','cumulative49','comparative'].includes(route()))?p50ReturnStrip():'')+
 ((p51CaseId&&['learn','stories','dialogues','workshop','production','grammar','wordbook','discourse50','cumulative49','comparative'].includes(route()))?p51ReturnStrip():'')+
 ((p52CaseId&&['learn','stories','dialogues','workshop','production','grammar','wordbook','register51'].includes(route()))?p52ReturnStrip():'')+
 ((p53CaseId&&['learn','stories','dialogues','workshop','production','grammar','wordbook','synthesis52'].includes(route()))?p53ReturnStrip():'')+
 ((p54CaseId&&['learn','stories','dialogues','workshop','production','grammar','wordbook','argument53'].includes(route()))?p54ReturnStrip():'')+
 ((p55Context==='return')?p55ReturnStrip():'')+
 ((p55Context==='writing')?p55WritingContext(findP55Brief(p55FocusId),action,esc):'')+pages[route()]();if(!db){const buttons=root.querySelectorAll('[data-action="plan-minutes"],[data-action="plan-focus"],[data-action="plan-pin"],[data-action="fluency-start"],[data-action="fluency-answer"],[data-action="fluency-hint"],[data-action="fluency-reveal"],[data-action="fluency-next"],[data-action="fluency-abandon"],[data-action="trail-start"],[data-action="trail-hint"],[data-action="trail-answer"],[data-action="trail-reveal"],[data-action="trail-next"],[data-action="block-start"],[data-action="block-launch"],[data-action="block-advance"],[data-action="block-abandon"],[data-action="mark-studied"],[data-action="grade"],[data-action="reset"],[data-action="import-open"],[data-action="guided-start"],[data-action="guided-answer"],[data-action="guided-check"],[data-action="guided-reveal"],[data-action="guided-next"],[data-action="guided-end"],[data-action="guided-abandon"],[data-action="placement-start"],[data-action="placement-restart"],[data-action="placement-answer"],[data-action="placement-skip"],[data-action="course-start"],[data-action="course-hint"],[data-action="course-answer"],[data-action="course-advance"],[data-action="course-finish"],[data-action="course-abandon"],[data-action="course-repair-start"],[data-action="repair-answer"],[data-action="repair-hint"],[data-action="repair-reveal"],[data-action="repair-next"],[data-action="repair-abandon"],[data-action="lesson-check-choice"],[data-action="lesson-check-submit"],[data-action="word-bookmark"],[data-action="dialogue-answer"],[data-action="dialogue-reveal"],[data-action="wordbook-answer"],[data-action="wordbook-reveal"],[data-action="sense-answer"],[data-action="sense-reveal"],[data-action="mission-answer"],[data-action="mission-reveal"],[data-action="workshop-check"],[data-action="workshop-reveal"]');buttons.forEach(b=>{b.disabled=true;b.title='Local persistence unavailable';})} }
function go(page){location.hash=`#/${page}`;if(route()===page)render();}
async function mutate(fn){if(!db){alertUser('Changes cannot be saved. This browser does not provide a working local database.','error');return false}if(busy)return false;busy=true;try{state=await updateState(db,fn);channel?.postMessage('data-changed');clearAlert();render();return true}catch(e){alertUser(`Not saved: ${e.message}`,'error');return false}finally{busy=false}}
function speak(text,rate=demoSpeechRate){if(!('speechSynthesis'in window)){alertUser('Speech playback is unavailable in this browser.','error');return}const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith('zh'));
 if(!voice){alertUser('No Mandarin speech voice is installed. Playback is unavailable, and the text remains accessible.','error');return}
 const utt=new SpeechSynthesisUtterance(text);utt.voice=voice;utt.lang=voice.lang;utt.rate=rate;speechSynthesis.cancel();speechSynthesis.speak(utt);alertUser('Using your device’s Chinese speech voice. This audio is not linguistically certified.');}
async function act(button){const name=button.dataset.action,id=button.dataset.id;

 if(name==='p55-enter'||name==='p55-open'||name==='p55-next'||name==='p55-return'||name==='p55-overview'){
  const chosen=name==='p55-open'?findP55Brief(id):
   name==='p55-next'?p55Next(state,p55FocusId):findP55Brief(p55FocusId)||p55Next(state);
  if(!chosen)return alertUser('Original advanced source pair unavailable.','error');
  const different=chosen.id!==p55FocusId;
  p55FocusId=chosen.id;
  if(name==='p55-open'||name==='p55-next'||different){
   p55Step='sources';p55Question=0;p55Reveal=false;p55Model=false;p55Support=false;
   p55RepairShown=false; // A new context must not expose previously revealed solutions.
  }
  location.hash='#/advanced55/'+chosen.id+'?step='+p55Step+'&question='+p55Question;
  render();
  (name==='p55-overview'?root.querySelector('.p55-overview'):root.querySelector('.p55-study'))?.
   scrollIntoView({block:'start'});return;
 }
 if(name==='p55-step'){
  if(!findP55Brief(p55FocusId)||!P55_STEPS.some(x=>x.id===button.dataset.step))return;
  p55Step=button.dataset.step;
  location.hash='#/advanced55/'+p55FocusId+'?step='+p55Step+'&question='+p55Question;return render();
 }
 if(name==='p55-review')return go('review');
 if(name==='p55-question-prev'||name==='p55-question-next'){
  p55Question=(p55Question+(name==='p55-question-next'?1:2))%3;
  p55Reveal=false;
  location.hash='#/advanced55/'+p55FocusId+'?step=sources&question='+p55Question;
  return render();
 }
 if(name==='p55-reveal'){p55Reveal=!p55Reveal;return render();}
 if(name==='p55-support'){p55Support=!p55Support;return render();}
 if(name==='p55-reveal-model'){p55Model=!p55Model;return render();}
 if(name==='p55-repair'){if(!findP55Brief(p55FocusId))return;
  p55RepairShown=!p55RepairShown;return render();}
 if(name==='p55-native-word'){
  const b=findP55Brief(p55FocusId),key=id;
  if(!b||!p55NativeWords(b).some(x=>x.key===key)||!findWord(key))
   return alertUser('The linked original Wordbook entry is unavailable.','error');
  searchSelection={type:'word',id:key};
  location.hash='#/explore?word='+encodeURIComponent(key)+'&p55='+b.id+'&p55step=language&p55q='+p55Question;return render();
 }
 if(name==='p55-open-original'){
  const b=findP55Brief(p55FocusId),original=p55Source(button.dataset.source);
  if(!b||!original||![b.from,b.to].includes(original.id))return;
  const actionName=original.id.split('-')[0]+'-open';
  const expectedRoute=P55_ROUTE_BY_PHASE[original.id.split('-')[0]];
  if(!expectedRoute)return alertUser('Original source route unavailable.','error');
  await act({dataset:{action:actionName,id:original.id}});
  const actualCase=(location.hash.match(new RegExp('^#/'+expectedRoute+'/(p[0-9]+-[0-9]{2})'))||[])[1];
  if(route()!==expectedRoute||actualCase!==original.id){
   return alertUser('Original source did not open. P55 handoff was not attached to another page.','error');
  }
  const [path,query='']=location.hash.split('?');
  const params=new URLSearchParams(query);
  params.set('p55',b.id);params.set('p55step',p55Step);
  params.set('p55q',String(p55Question));
  location.hash=path+'?'+params.toString();
  return;
 }
 if(name==='p55-native-read'||name==='p55-native-listen'){
  const b=findP55Brief(p55FocusId),sourceId=button.dataset.source;
  if(!b||![b.from,b.to].includes(sourceId))return;
  const native=p55Native(sourceId),index=Number(button.dataset.question);
  if(!Number.isInteger(index)||index<0||index>2)return;
  const isRead=name==='p55-native-read';
  if(index>=p58SourceQuestionCount(sourceId,isRead?'reading':'dialogue'))
   return alertUser('Original source has no question at that position.','error');
  const params=new URLSearchParams({
   p55:b.id,p55step:p55Step,p55q:String(index)
  });
  if(isRead&&native?.story){
   const modes=['beginner-detail','beginner-reason','beginner-sequence'];
   storyId=native.story.id;storyMode=modes[index];resetReadingNavigation();
   params.set('mode',modes[index]);
   location.hash='#/stories/'+native.story.id+'?'+params.toString();
   return render();
  }
  if(!isRead&&native?.dialogue){
   dialogueId=native.dialogue.id;dialogueStep=index;dialogueFeedback=null;dialogueSupport=false;
   params.set('question',String(index));
   location.hash='#/dialogues/'+native.dialogue.id+'?'+params.toString();
   return render();
  }
  return alertUser('Original question is not accessible in the native learning module.','error');
 }
 if(name==='p55-p43'){
  const b=findP55Brief(p55FocusId),target=b&&findP43Unit(b.writingId);
  if(!target)return alertUser('Original P43 writing unit unavailable.','error');
  if(p43UnitId!==target.id&&(p43Draft.trim()||p43Revisions.length)){
   p43Pending=target.id;
   // Keep the old unit visible until the existing P43 explicit discard/switch confirmation.
   location.hash='#/production/'+p43UnitId+'?p55='+b.id+'&p55step=write&p55q='+p55Question;return render();
  }
  if(p43UnitId!==target.id){
   p43UnitId=target.id;p43Step='plan';p43Reviewed=[];p43Version=-1;
   p43ModelRevealed=false;p43SourceRevealed=false;p43Assisted=false;p43Pending='';
  }
  location.hash='#/production/'+target.id+'?p55='+b.id+'&p55step=write&p55q='+p55Question;return render();
 }
 if(name==='p55-copy-brief'){
  const b=findP55Brief(p55FocusId);if(!b)return;
  const first=p55Source(b.from),second=p55Source(b.to);
  const corrected=p56RepairFor(b.id);
  const text=['P55 original source-based Mandarin writing',b.title,
   'Source A: '+(first?.title||b.from)+' ('+b.from+')',
   'Source B: '+(second?.title||b.to)+' ('+b.to+')',
   'Different-question retrieval: '+b.retrieval,
   'Independent writing: '+b.writing,
   'Fair objection: '+b.objection,
   'Mistaken inference to repair: '+(corrected?.wrong||b.pitfall),
   'Evidence-limited revision: '+(corrected?.principle||b.pitfall),
   'Independent spoken transfer: '+(corrected?.speaking||b.speaking),
   'Preserve original facts, record scope and native source IDs.'].join('\n\n');
  if(!navigator.clipboard?.writeText)return alertUser('Clipboard unavailable. The writing task is visible above for manual copying.','error');
  try{await navigator.clipboard.writeText(text);alertUser('Source-grounded writing brief copied.');}
  catch(_){alertUser('Clipboard permission denied. Copy the task from the source study view.','error');}
  return;
 }
 if(name==='p55-workshop'){
  const b=findP55Brief(p55FocusId);if(!b)return;
  const taskId='p55:transfer:'+b.id+':model';
  const pos=SENTENCE_TASKS.findIndex(x=>x.id===taskId);
  if(pos<0)return alertUser('Original fixed-form transfer sentence unavailable.','error');
  sentenceIndex=pos;sentenceTyped='';sentenceFeedback=null;sentenceSupport=true;
  location.hash='#/workshop?task='+encodeURIComponent(taskId)+'&p55='+b.id+'&p55step=speak&p55q='+p55Question;
  return render();
 }


 if(name==='p54-enter'||name==='p54-open'||name==='p54-next'||name==='p54-return'){
  const chosen=name==='p54-open'?findP54Case(id):
   name==='p54-return'?findP54Case(p54CaseId):
   name==='p54-next'?p54Next(state,p54CaseId):findP54Case(p54CaseId)||p54Next(state);
  if(!chosen)return alertUser('Original P54 source dossier unavailable.','error');
  if(name!=='p54-return'){
   p54CaseId=chosen.id;p54Stage='register';p54ReadingIndex=0;p54ListeningIndex=0;
   p54ReadingFeedback=null;p54ListeningFeedback=null;p54ReadingHelp=false;
   p54ListeningHelp=false;p54Models=false;p54Checks.clear();
  }
  location.hash='#/fluency54/'+chosen.id+'?stage='+p54Stage;
  render();root.querySelector('.p54-journey')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p54-prior'){
  const c=findP54Case(p54CaseId),prior=findP53Case(id||c?.priorCase);
  if(!prior)return alertUser('Source-specific original P53 case unavailable.','error');
  p53CaseId=prior.id;p53Stage='sources';p53ReadingIndex=0;p53ListeningIndex=0;
  p53ReadingFeedback=null;p53ListeningFeedback=null;
  location.hash='#/argument53/'+prior.id+'?stage=sources';return render();
 }
 if(name==='p54-stage'){
  if(!findP54Case(p54CaseId)||!P54_STAGES.some(s=>s.id===button.dataset.stage))return;
  p54Stage=button.dataset.stage;p54ReadingFeedback=null;p54ListeningFeedback=null;
  location.hash='#/fluency54/'+p54CaseId+'?stage='+p54Stage;return render();
 }
 if(name==='p54-review')return go('review');
 if(name==='p54-reading-help'||name==='p54-listening-help'||name==='p54-models'){
  if(!findP54Case(p54CaseId))return;
  if(name==='p54-reading-help'){p54ReadingHelp=!p54ReadingHelp;if(p54ReadingHelp)p54AssistedCases.add(p54CaseId);}
  if(name==='p54-listening-help'){p54ListeningHelp=!p54ListeningHelp;if(p54ListeningHelp)p54AssistedCases.add(p54CaseId);}
  if(name==='p54-models'){p54Models=!p54Models;if(p54Models)p54AssistedCases.add(p54CaseId);}
  return render();
 }
 if(name==='p54-play'||name==='p54-slow'||name==='p54-turn'){
  const c=findP54Case(p54CaseId);if(!c)return;
  const i=Number(button.dataset.index);
  if(name==='p54-turn'&&(!Number.isInteger(i)||i<0||i>=c.turns.length))return;
  return speak(name==='p54-turn'?c.turns[i].hanzi:c.turns.map(t=>t.hanzi).join(' '),
   name==='p54-slow'?0.7:demoSpeechRate);
 }
 if(name==='p54-reader-next'){
  const c=findP54Case(p54CaseId);if(!c)return;
  if(p54ReadingIndex+1<c.questions.length){p54ReadingIndex++;p54ReadingFeedback=null;return render();}
  p54Stage='listen';p54ReadingFeedback=null;
  location.hash='#/fluency54/'+c.id+'?stage=listen';return render();
 }
 if(name==='p54-reader-retry'){p54ReadingFeedback=null;return render();}
 if(name==='p54-reader-answer'||name==='p54-reader-model'){
  const c=findP54Case(p54CaseId),story=c&&p54Story(c);
  if(!story||p54ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p54ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p54-reader-model'){
   p54AssistedCases.add(c.id);p54ReadingFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';if(!q.options.includes(answer))return;
  const assisted=p54AssistedCases.has(c.id),correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p54-reading-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){p54ReadingFeedback={correct,assisted};render();
   root.querySelector('.p54-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p54-listener-next'){
  const c=findP54Case(p54CaseId);if(!c)return;
  if(p54ListeningIndex+1<c.dialogueQuestions.length){p54ListeningIndex++;p54ListeningFeedback=null;return render();}
  p54Stage='produce';p54ListeningFeedback=null;
  location.hash='#/fluency54/'+c.id+'?stage=produce';return render();
 }
 if(name==='p54-listener-retry'){p54ListeningFeedback=null;return render();}
 if(name==='p54-listener-answer'||name==='p54-listener-model'){
  const c=findP54Case(p54CaseId),d=c&&p54NativeDialogue(c);
  if(!d||p54ListeningFeedback)return;
  const q=dialogueQuestion(d.id,p54ListeningIndex);if(!q)return;
  if(name==='p54-listener-model'){
   p54AssistedCases.add(c.id);p54ListeningFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';if(!q.options.includes(answer))return;
  const assisted=p54AssistedCases.has(c.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p54-listening-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:d.id,
   question:p54ListeningIndex,answer,assisted}));
  if(saved){p54ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p54-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p54-native-read'){
  const c=findP54Case(p54CaseId),story=c&&p54Story(c);
  if(!story)return;storyId=story.id;resetReadingNavigation();storyMode='beginner-detail';return go('stories');
 }
 if(name==='p54-native-listen'){
  const c=findP54Case(p54CaseId),d=c&&p54NativeDialogue(c);
  if(!d)return;dialogueId=d.id;dialogueStep=0;dialogueFeedback=null;
  dialogueSupport=false;return go('dialogues');
 }
 if(name==='p54-p43'){
  const c=findP54Case(p54CaseId);if(!c||!findP43Unit(c.p43Id))return;
  if(p43UnitId!==c.p43Id&&(p43Draft.trim()||p43Revisions.length)){
   return alertUser('The current P43 draft or snapshots are tab-local. Copy or resolve them before switching writing units.','error');
  }
  p43UnitId=c.p43Id;return go('production');
 }
 if(name==='p54-register-write'){
  const c=findP54Case(p54CaseId),pairIndex=P54_REGISTER_PAIRS.findIndex(x=>x.id===button.dataset.pair);
  const i=Number(button.dataset.index);
  if(!c||pairIndex<(c.sequence-1)*3||pairIndex>=c.sequence*3||
   !Number.isInteger(i)||i<0||i>1)return;
  const target='p54:register:'+P54_REGISTER_PAIRS[pairIndex].id+':example'+i;
  const pos=SENTENCE_TASKS.findIndex(t=>t.id===target);
  if(pos<0)return alertUser('Original contextual sentence unavailable.','error');
  sentenceIndex=pos;sentenceTyped='';sentenceFeedback=null;sentenceSupport=true;return go('workshop');
 }
 if(name==='p54-cumulative-write'){
  const c=findP54Case(p54CaseId),unit=c&&p54CumulativeFor(c.id),i=Number(button.dataset.index);
  if(!unit||!Number.isInteger(i)||i<0||i>=unit.models.length)return;
  const target='p54:cumulative:'+unit.id+':model'+i;
  const pos=SENTENCE_TASKS.findIndex(t=>t.id===target);
  if(pos<0)return alertUser('The original cumulative sentence is unavailable.','error');
  sentenceIndex=pos;sentenceTyped='';sentenceFeedback=null;sentenceSupport=true;return go('workshop');
 }
 if(name==='p54-write'){
  const c=findP54Case(p54CaseId),i=Number(button.dataset.index);
  if(!c||!Number.isInteger(i)||i<0||i>=c.models.length)return;
  const target='p54:source:'+c.id+':model'+i;
  const pos=SENTENCE_TASKS.findIndex(t=>t.id===target);
  if(pos<0)return alertUser('Original source reconstruction unavailable.','error');
  sentenceIndex=pos;sentenceTyped='';sentenceFeedback=null;sentenceSupport=true;return go('workshop');
 }
 if(name==='p54-check'){
  if(!findP54Case(p54CaseId)||!P54_SELF_REVIEW.some(x=>x.id===id))return;
  if(p54Checks.has(id))p54Checks.delete(id);else p54Checks.add(id);return render();
 }


 if(name==='p53-enter'||name==='p53-open'||name==='p53-next'||name==='p53-return'){
  const chosen=name==='p53-open'?findP53Case(id):
   name==='p53-return'?findP53Case(p53CaseId):
   name==='p53-next'?p53Next(state,p53CaseId):findP53Case(p53CaseId)||p53Next(state);
  if(!chosen)return alertUser('The original P53 source dossier is unavailable.','error');
  if(name!=='p53-return'){
   p53CaseId=chosen.id;p53Stage='sources';p53ReadingIndex=0;p53ListeningIndex=0;
   p53ReadingFeedback=null;p53ListeningFeedback=null;p53ReadingHelp=false;
   p53ListeningHelp=false;p53Models=false;p53Checks.clear();
  }
  location.hash='#/argument53/'+chosen.id+'?stage='+p53Stage;
  render();root.querySelector('.p53-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p53-prior'){
  const c=findP53Case(p53CaseId),prior=findP52Case(id||c?.priorCase);
  if(!prior)return alertUser('The source-specific P52 prerequisite is unavailable.','error');
  p52CaseId=prior.id;p52Stage='records';p52ReadingIndex=0;p52ListeningIndex=0;
  p52ReadingFeedback=null;p52ListeningFeedback=null;
  location.hash='#/synthesis52/'+prior.id+'?stage=records';return render();
 }
 if(name==='p53-stage'){
  if(!findP53Case(p53CaseId)||!P53_STAGES.some(x=>x.id===button.dataset.stage))return;
  p53Stage=button.dataset.stage;p53ReadingFeedback=null;p53ListeningFeedback=null;
  location.hash='#/argument53/'+p53CaseId+'?stage='+p53Stage;return render();
 }
 if(name==='p53-due')return go('review');
 if(name==='p53-reading-help'||name==='p53-listening-help'||name==='p53-models'){
  if(!findP53Case(p53CaseId))return;
  if(name==='p53-reading-help'){p53ReadingHelp=!p53ReadingHelp;if(p53ReadingHelp)p53AssistedCases.add(p53CaseId);}
  if(name==='p53-listening-help'){p53ListeningHelp=!p53ListeningHelp;if(p53ListeningHelp)p53AssistedCases.add(p53CaseId);}
  if(name==='p53-models'){p53Models=!p53Models;if(p53Models)p53AssistedCases.add(p53CaseId);}
  return render();
 }
 if(name==='p53-play'||name==='p53-slow'||name==='p53-turn'){
  const c=findP53Case(p53CaseId);if(!c)return;
  const index=Number(button.dataset.index);
  if(name==='p53-turn'&&(!Number.isInteger(index)||index<0||index>=c.turns.length))return;
  return speak(name==='p53-turn'?c.turns[index].hanzi:c.turns.map(t=>t.hanzi).join(' '),
   name==='p53-slow'?0.7:demoSpeechRate);
 }
 if(name==='p53-reader-next'){
  const c=findP53Case(p53CaseId);if(!c)return;
  if(p53ReadingIndex+1<c.questions.length){p53ReadingIndex++;p53ReadingFeedback=null;return render();}
  p53Stage='debate';p53ReadingFeedback=null;
  location.hash='#/argument53/'+c.id+'?stage=debate';return render();
 }
 if(name==='p53-reader-retry'){p53ReadingFeedback=null;return render();}
 if(name==='p53-reader-answer'||name==='p53-reader-model'){
  const c=findP53Case(p53CaseId),story=c&&p53Story(c);
  if(!story||p53ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p53ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p53-reader-model'){
   p53AssistedCases.add(c.id);p53ReadingFeedback={revealed:true,correct:false,assisted:true};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p53AssistedCases.has(c.id),correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p53-reading-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){p53ReadingFeedback={correct,assisted};render();
   root.querySelector('.p53-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p53-listener-next'){
  const c=findP53Case(p53CaseId);if(!c)return;
  if(p53ListeningIndex+1<c.dialogueQuestions.length){p53ListeningIndex++;p53ListeningFeedback=null;return render();}
  p53Stage='argument';p53ListeningFeedback=null;
  location.hash='#/argument53/'+c.id+'?stage=argument';return render();
 }
 if(name==='p53-listener-retry'){p53ListeningFeedback=null;return render();}
 if(name==='p53-listener-answer'||name==='p53-listener-model'){
  const c=findP53Case(p53CaseId),d=c&&p53NativeDialogue(c);
  if(!d||p53ListeningFeedback)return;
  const q=dialogueQuestion(d.id,p53ListeningIndex);if(!q)return;
  if(name==='p53-listener-model'){
   p53AssistedCases.add(c.id);p53ListeningFeedback={revealed:true,correct:false,assisted:true};return render();
  }
  const answer=button.dataset.option||'';if(!q.options.includes(answer))return;
  const assisted=p53AssistedCases.has(c.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p53-listening-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:d.id,
   question:p53ListeningIndex,answer,assisted}));
  if(saved){p53ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p53-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p53-native-read'){
  const c=findP53Case(p53CaseId),story=c&&p53Story(c);
  if(!story)return;storyId=story.id;resetReadingNavigation();storyMode='beginner-detail';return go('stories');
 }
 if(name==='p53-native-listen'){
  const c=findP53Case(p53CaseId),d=c&&p53NativeDialogue(c);
  if(!d)return;dialogueId=d.id;dialogueStep=0;dialogueFeedback=null;
  dialogueSupport=false;return go('dialogues');
 }
 if(name==='p53-p43'){
  const c=findP53Case(p53CaseId);if(!c||!findP43Unit(c.p43Id))return;
  if(p43UnitId!==c.p43Id&&(p43Draft.trim()||p43Revisions.length)){
   return alertUser('The current P43 writing draft or revision snapshots are tab-local. Copy them or resolve the current draft in P43 before opening a different writing unit.','error');
  }
  p43UnitId=c.p43Id;return go('production');
 }
 if(name==='p53-transfer-write'){
  const c=findP53Case(p53CaseId),bridge=P53_TRANSFERS.find(x=>x.id===button.dataset.bridge);
  const index=Number(button.dataset.index);
  if(!c||!bridge||![bridge.from,bridge.to].includes(c.id)||
   !Number.isInteger(index)||index<0||index>=bridge.models.length)return;
  const target='p53:transfer:'+bridge.id+':model'+index;
  const position=SENTENCE_TASKS.findIndex(t=>t.id===target);
  if(position<0)return alertUser('The original P53 comparison sentence is unavailable.','error');
  sentenceIndex=position;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p53AssistedCases.has(c.id)||p53Models;return go('workshop');
 }
 if(name==='p53-write'){
  const c=findP53Case(p53CaseId),index=Number(button.dataset.index);
  if(!c||!Number.isInteger(index)||index<0||index>=c.models.length)return;
  const id='p53:argument:'+c.id+':model'+index;
  const position=SENTENCE_TASKS.findIndex(t=>t.id===id);
  if(position<0)return alertUser('The original P53 sentence task is unavailable.','error');
  sentenceIndex=position;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p53AssistedCases.has(c.id)||p53Models;return go('workshop');
 }
 if(name==='p53-check'){
  if(!findP53Case(p53CaseId)||!P53_SELF_REVIEW.some(x=>x.id===id))return;
  if(p53Checks.has(id))p53Checks.delete(id);else p53Checks.add(id);return render();
 }


 if(name==='p52-enter'||name==='p52-return'||name==='p52-open'||name==='p52-next'){
  const selected=name==='p52-open'?findP52Case(id):
   name==='p52-return'?findP52Case(p52CaseId):
   name==='p52-next'?p52Next(state,p52CaseId):findP52Case(p52CaseId)||p52Next(state);
  if(!selected)return alertUser('Original source comparison case unavailable.','error');
  if(name!=='p52-return'){
   p52CaseId=selected.id;p52Stage='records';p52ReadingHelp=false;p52ListeningHelp=false;
   p52ReadingIndex=0;p52ListeningIndex=0;p52ReadingFeedback=null;p52ListeningFeedback=null;
   p52Models=false;p52Checks.clear();
  }
  location.hash='#/synthesis52/'+selected.id+'?stage='+p52Stage;
  render();root.querySelector('.p52-journey')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p52-stage'){
  if(!findP52Case(p52CaseId)||!P52_STAGES.some(x=>x.id===button.dataset.stage))return;
  p52Stage=button.dataset.stage;p52ReadingFeedback=null;p52ListeningFeedback=null;
  location.hash='#/synthesis52/'+p52CaseId+'?stage='+p52Stage;return render();
 }
 if(name==='p52-review')return go('review');
 if(name==='p52-reading-help'||name==='p52-listening-help'){
  if(!findP52Case(p52CaseId))return;
  if(name==='p52-reading-help'){p52ReadingHelp=!p52ReadingHelp;if(p52ReadingHelp)p52AssistedCases.add(p52CaseId);}
  else{p52ListeningHelp=!p52ListeningHelp;if(p52ListeningHelp)p52AssistedCases.add(p52CaseId);}
  return render();
 }
 if(name==='p52-play'||name==='p52-play-slow'||name==='p52-turn-play'){
  const c=findP52Case(p52CaseId);if(!c)return;
  const i=Number(button.dataset.index);
  if(name==='p52-turn-play'&&(!Number.isInteger(i)||i<0||i>=c.turns.length))return;
  return speak(name==='p52-turn-play'?c.turns[i].hanzi:c.turns.map(t=>t.hanzi).join(' '),
   name==='p52-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p52-reader-next'){
  const c=findP52Case(p52CaseId);if(!c)return;
  if(p52ReadingIndex+1<c.questions.length){p52ReadingIndex++;p52ReadingFeedback=null;return render();}
  p52Stage='hearing';p52ReadingFeedback=null;
  location.hash='#/synthesis52/'+c.id+'?stage=hearing';return render();
 }
 if(name==='p52-reader-retry'){p52ReadingFeedback=null;return render();}
 if(name==='p52-reader-answer'||name==='p52-reader-model'){
  const c=findP52Case(p52CaseId),story=c&&p52Story(c);
  if(!story||p52ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p52ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p52-reader-model'){
   p52AssistedCases.add(c.id);p52ReadingFeedback={revealed:true,correct:false,assisted:true};return render();
  }
  const answer=button.dataset.option||'';if(!q.options.includes(answer))return;
  const assisted=p52AssistedCases.has(c.id),correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p52-reading-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){p52ReadingFeedback={correct,assisted};render();root.querySelector('.p52-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p52-listener-next'){
  const c=findP52Case(p52CaseId);if(!c)return;
  if(p52ListeningIndex+1<c.dialogueQuestions.length){p52ListeningIndex++;p52ListeningFeedback=null;return render();}
  p52Stage='revision';p52ListeningFeedback=null;
  location.hash='#/synthesis52/'+c.id+'?stage=revision';return render();
 }
 if(name==='p52-listener-retry'){p52ListeningFeedback=null;return render();}
 if(name==='p52-listener-answer'||name==='p52-listener-model'){
  const c=findP52Case(p52CaseId),dialogue=c&&p52NativeDialogue(c);
  if(!dialogue||p52ListeningFeedback)return;
  const q=dialogueQuestion(dialogue.id,p52ListeningIndex);if(!q)return;
  if(name==='p52-listener-model'){
   p52AssistedCases.add(c.id);p52ListeningFeedback={revealed:true,correct:false,assisted:true};return render();
  }
  const answer=button.dataset.option||'';if(!q.options.includes(answer))return;
  const assisted=p52AssistedCases.has(c.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p52-listening-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:dialogue.id,
   question:p52ListeningIndex,answer,assisted}));
  if(saved){p52ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p52-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p52-native-read'){
  const c=findP52Case(p52CaseId),story=c&&p52Story(c);if(!story)return;
  storyId=story.id;resetReadingNavigation();storyMode='beginner-detail';return go('stories');
 }
 if(name==='p52-native-listen'){
  const c=findP52Case(p52CaseId),d=c&&p52NativeDialogue(c);if(!d)return;
  dialogueId=d.id;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;return go('dialogues');
 }
 if(name==='p52-model'){if(!findP52Case(p52CaseId))return;
  p52Models=!p52Models;return render();}
 if(name==='p52-check'){
  if(!['sources','distinctions','objection','limits','register','oral'].includes(id))return;
  if(p52Checks.has(id))p52Checks.delete(id);else p52Checks.add(id);return render();
 }
 if(name==='p52-p43'){
  const c=findP52Case(p52CaseId);if(!c)return;
  p43UnitId=c.p43Id;return go('production');
 }
 if(name==='p52-write'){
  const c=findP52Case(p52CaseId),i=Number(button.dataset.index);
  if(!c||!Number.isInteger(i)||i<0||i>=c.models.length)return;
  const target='p52:source:'+c.id+':model'+i;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===target);
  if(index<0)return alertUser('Original P52 exact-form sentence unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p52AssistedCases.has(c.id)||p52Models;return go('workshop');
 }
 if(name==='p51-enter'||name==='p51-return'||name==='p51-open'||name==='p51-next'){
  const selected=name==='p51-open'?findP51Passage(id):
   name==='p51-return'?findP51Passage(p51CaseId):
   name==='p51-next'?p51Next(state,p51CaseId):findP51Passage(p51CaseId)||p51Next(state);
  if(!selected)return alertUser('Original P51 instructional case unavailable.','error');
  if(name!=='p51-return'){
   p51CaseId=selected.id;p51Stage='language';p51ReadingHelp=false;p51ListeningHelp=false;p51Models=false;
   p51ReadingIndex=0;p51ListeningIndex=0;p51ReadingFeedback=null;p51ListeningFeedback=null;
   p51Checks.clear();
  }
  location.hash='#/register51/'+selected.id+'?stage='+p51Stage;
  render();root.querySelector('.p51-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p51-stage'){
  if(!findP51Passage(p51CaseId)||!P51_STAGES.some(x=>x.id===button.dataset.stage))return;
  p51Stage=button.dataset.stage;p51ReadingFeedback=null;p51ListeningFeedback=null;
  location.hash='#/register51/'+p51CaseId+'?stage='+p51Stage;return render();
 }
 if(name==='p51-review')return go('review');
 if(name==='p51-character'){
  const guide=findP51Character(button.dataset.hanzi);
  const lesson=guide&&DEMO_LESSONS.find(x=>x.hanzi===guide.hanzi);
  if(!lesson)return alertUser('Original P51 character lesson unavailable.','error');
  displayLessonId=lesson.id;return go('learn');
 }
 if(name==='p51-reading-help'||name==='p51-listening-help'||name==='p51-models'){
  if(!findP51Passage(p51CaseId))return;
  if(name==='p51-reading-help'){p51ReadingHelp=!p51ReadingHelp;if(p51ReadingHelp)p51AssistedCases.add(p51CaseId);}
  if(name==='p51-listening-help'){p51ListeningHelp=!p51ListeningHelp;if(p51ListeningHelp)p51AssistedCases.add(p51CaseId);}
  if(name==='p51-models'){p51Models=!p51Models;if(p51Models)p51AssistedCases.add(p51CaseId);}
  return render();
 }
 if(name==='p51-play'||name==='p51-play-slow'||name==='p51-turn-play'){
  const p=findP51Passage(p51CaseId),d=p&&P51_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  const i=Number(button.dataset.index);
  if(name==='p51-turn-play'&&(!Number.isInteger(i)||i<0||i>=d.turns.length))return;
  return speak(name==='p51-turn-play'?d.turns[i].hanzi:d.turns.map(t=>t.hanzi).join(' '),
   name==='p51-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p51-reader-next'){
  const p=findP51Passage(p51CaseId);if(!p)return;
  if(p51ReadingIndex+1<p.questions.length){p51ReadingIndex++;p51ReadingFeedback=null;return render();}
  p51Stage='listen';p51ReadingFeedback=null;
  location.hash='#/register51/'+p.id+'?stage=listen';return render();
 }
 if(name==='p51-reader-retry'){p51ReadingFeedback=null;return render();}
 if(name==='p51-reader-answer'||name==='p51-reader-model'){
  const p=findP51Passage(p51CaseId),story=p&&p51Story(p);
  if(!story||p51ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p51ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p51-reader-model'){
   p51AssistedCases.add(p.id);p51ReadingFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p51AssistedCases.has(p.id),correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p51-reading-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){p51ReadingFeedback={correct,assisted};render();
   root.querySelector('.p51-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p51-listener-next'){
  const p=findP51Passage(p51CaseId),d=p&&P51_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  if(p51ListeningIndex+1<d.questions.length){p51ListeningIndex++;p51ListeningFeedback=null;return render();}
  p51Stage='produce';p51ListeningFeedback=null;
  location.hash='#/register51/'+p.id+'?stage=produce';return render();
 }
 if(name==='p51-listener-retry'){p51ListeningFeedback=null;return render();}
 if(name==='p51-listener-answer'||name==='p51-listener-model'){
  const p=findP51Passage(p51CaseId),dialogue=p&&p51NativeDialogue(p);
  if(!dialogue||p51ListeningFeedback)return;
  const q=dialogueQuestion(dialogue.id,p51ListeningIndex);if(!q)return;
  if(name==='p51-listener-model'){
   p51AssistedCases.add(p.id);p51ListeningFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p51AssistedCases.has(p.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p51-listening-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:dialogue.id,
   question:p51ListeningIndex,answer,assisted}));
  if(saved){p51ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p51-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p51-check'){
  if(!P51_REVISION.some(x=>x.id===id)||!findP51Passage(p51CaseId))return;
  if(p51Checks.has(id))p51Checks.delete(id);else p51Checks.add(id);
  return render();
 }
 if(name==='p51-p43'){
  const p=findP51Passage(p51CaseId),a=p&&findP51Argument(p.id);
  if(!a)return;
  p43UnitId=a.p43Id;return go('production');
 }
 if(name==='p51-write'||name==='p51-argument-write'){
  const p=findP51Passage(p51CaseId);if(!p)return;
  let taskId;
  if(name==='p51-argument-write'){
   const a=findP51Argument(p.id),i=Number(button.dataset.index);
   if(!a||!Number.isInteger(i)||i<0||i>=a.models.length)return;
   taskId='p51:argument:'+p.id+':model'+i;
  }else if(button.dataset.kind==='reading'){
   const story=p51Story(p);if(!story)return;
   taskId='beginner-reading:'+story.id+':writing';
  }else{return;}
  const i=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(i<0)return alertUser('The native exact sentence is unavailable.','error');
  sentenceIndex=i;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p51AssistedCases.has(p.id);return go('workshop');
 }
 if(name==='p50-enter'||name==='p50-return'||name==='p50-open'||name==='p50-next'){
  const selected=name==='p50-open'?findP50Passage(id):
   name==='p50-return'?findP50Passage(p50CaseId):
   name==='p50-next'?p50Next(state,p50CaseId):findP50Passage(p50CaseId)||p50Next(state);
  if(!selected)return alertUser('Original P50 instructional case unavailable.','error');
  if(name!=='p50-return'){
   p50CaseId=selected.id;p50Stage='language';p50ReadingHelp=false;p50ListeningHelp=false;p50Models=false;
   p50ReadingIndex=0;p50ListeningIndex=0;p50ReadingFeedback=null;p50ListeningFeedback=null;
   p50Checks.clear();
  }
  location.hash='#/discourse50/'+selected.id+'?stage='+p50Stage;
  render();root.querySelector('.p50-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p50-stage'){
  if(!findP50Passage(p50CaseId)||!P50_STAGES.some(x=>x.id===button.dataset.stage))return;
  p50Stage=button.dataset.stage;p50ReadingFeedback=null;p50ListeningFeedback=null;
  location.hash='#/discourse50/'+p50CaseId+'?stage='+p50Stage;return render();
 }
 if(name==='p50-review')return go('review');
 if(name==='p50-character'){
  const guide=findP50Character(button.dataset.hanzi);
  const lesson=guide&&DEMO_LESSONS.find(x=>x.hanzi===guide.hanzi);
  if(!lesson)return alertUser('Original P50 character lesson unavailable.','error');
  displayLessonId=lesson.id;return go('learn');
 }
 if(name==='p50-reading-help'||name==='p50-listening-help'||name==='p50-models'){
  if(!findP50Passage(p50CaseId))return;
  if(name==='p50-reading-help'){p50ReadingHelp=!p50ReadingHelp;if(p50ReadingHelp)p50AssistedCases.add(p50CaseId);}
  if(name==='p50-listening-help'){p50ListeningHelp=!p50ListeningHelp;if(p50ListeningHelp)p50AssistedCases.add(p50CaseId);}
  if(name==='p50-models'){p50Models=!p50Models;if(p50Models)p50AssistedCases.add(p50CaseId);}
  return render();
 }
 if(name==='p50-play'||name==='p50-play-slow'||name==='p50-turn-play'){
  const p=findP50Passage(p50CaseId),d=p&&P50_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  const i=Number(button.dataset.index);
  if(name==='p50-turn-play'&&(!Number.isInteger(i)||i<0||i>=d.turns.length))return;
  return speak(name==='p50-turn-play'?d.turns[i].hanzi:d.turns.map(t=>t.hanzi).join(' '),
   name==='p50-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p50-reader-next'){
  const p=findP50Passage(p50CaseId);if(!p)return;
  if(p50ReadingIndex+1<p.questions.length){p50ReadingIndex++;p50ReadingFeedback=null;return render();}
  p50Stage='listen';p50ReadingFeedback=null;
  location.hash='#/discourse50/'+p.id+'?stage=listen';return render();
 }
 if(name==='p50-reader-retry'){p50ReadingFeedback=null;return render();}
 if(name==='p50-reader-answer'||name==='p50-reader-model'){
  const p=findP50Passage(p50CaseId),story=p&&p50Story(p);
  if(!story||p50ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p50ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p50-reader-model'){
   p50AssistedCases.add(p.id);p50ReadingFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p50AssistedCases.has(p.id),correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p50-reading-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){p50ReadingFeedback={correct,assisted};render();
   root.querySelector('.p50-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p50-listener-next'){
  const p=findP50Passage(p50CaseId),d=p&&P50_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  if(p50ListeningIndex+1<d.questions.length){p50ListeningIndex++;p50ListeningFeedback=null;return render();}
  p50Stage='produce';p50ListeningFeedback=null;
  location.hash='#/discourse50/'+p.id+'?stage=produce';return render();
 }
 if(name==='p50-listener-retry'){p50ListeningFeedback=null;return render();}
 if(name==='p50-listener-answer'||name==='p50-listener-model'){
  const p=findP50Passage(p50CaseId),dialogue=p&&p50NativeDialogue(p);
  if(!dialogue||p50ListeningFeedback)return;
  const q=dialogueQuestion(dialogue.id,p50ListeningIndex);if(!q)return;
  if(name==='p50-listener-model'){
   p50AssistedCases.add(p.id);p50ListeningFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p50AssistedCases.has(p.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p50-listening-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:dialogue.id,
   question:p50ListeningIndex,answer,assisted}));
  if(saved){p50ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p50-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p50-check'){
  if(!P50_REVISION.some(x=>x.id===id)||!findP50Passage(p50CaseId))return;
  if(p50Checks.has(id))p50Checks.delete(id);else p50Checks.add(id);
  return render();
 }
 if(name==='p50-p43'){
  const p=findP50Passage(p50CaseId),a=p&&findP50Argument(p.id);
  if(!a)return;
  p43UnitId=a.p43Id;return go('production');
 }
 if(name==='p50-write'||name==='p50-argument-write'){
  const p=findP50Passage(p50CaseId);if(!p)return;
  let taskId;
  if(name==='p50-argument-write'){
   const a=findP50Argument(p.id),i=Number(button.dataset.index);
   if(!a||!Number.isInteger(i)||i<0||i>=a.models.length)return;
   taskId='p50:argument:'+p.id+':model'+i;
  }else if(button.dataset.kind==='reading'){
   const story=p50Story(p);if(!story)return;
   taskId='beginner-reading:'+story.id+':writing';
  }else{return;}
  const i=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(i<0)return alertUser('The native exact sentence is unavailable.','error');
  sentenceIndex=i;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p50AssistedCases.has(p.id);return go('workshop');
 }
 if(name==='p49-enter'||name==='p49-return'||name==='p49-open'||name==='p49-next'){
  const recommendations=p49Recommendations(state);
  const selected=name==='p49-open'?findP49Case(id):
   name==='p49-return'?findP49Case(p49CaseId):
   name==='p49-next'?recommendations.find(r=>r.caseItem.id!==p49CaseId)?.caseItem||recommendations[0]?.caseItem:
   findP49Case(p49CaseId)||recommendations[0]?.caseItem;
  if(!selected)return alertUser('The original P49 cumulative case is unavailable.','error');
  if(name!=='p49-return'){
   p49CaseId=selected.id;p49Stage='sources';p49Question=0;p49Feedback=null;
   p49ShowSource=false;p49Transcript=false;p49Models=false;
  }
  location.hash='#/cumulative49/'+selected.id+'?stage='+p49Stage;
  render();root.querySelector('.p49-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p49-filter'){
  if(!['all','needs','unseen','reviewed'].includes(button.dataset.filter))return;
  p49Filter=button.dataset.filter;return render();
 }
 if(name==='p49-stage'){
  if(!findP49Case(p49CaseId)||!P49_STAGES.some(s=>s.id===button.dataset.stage))return;
  p49Stage=button.dataset.stage;p49Feedback=null;
  location.hash='#/cumulative49/'+p49CaseId+'?stage='+p49Stage;return render();
 }
 if(name==='p49-review')return go('review');
 if(name==='p49-source-help'||name==='p49-transcript'||name==='p49-writing-models'){
  if(!findP49Case(p49CaseId))return;
  if(name==='p49-source-help'){p49ShowSource=!p49ShowSource;if(p49ShowSource)p49AssistedCases.add(p49CaseId);}
  if(name==='p49-transcript'){p49Transcript=!p49Transcript;if(p49Transcript)p49AssistedCases.add(p49CaseId);}
  if(name==='p49-writing-models'){p49Models=!p49Models;if(p49Models)p49AssistedCases.add(p49CaseId);}
  return render();
 }
 if(name==='p49-play'||name==='p49-play-slow'||name==='p49-hear-turn'){
  const c=findP49Case(p49CaseId);if(!c)return;
  const ix=Number(button.dataset.index);
  if(name==='p49-hear-turn'&&(!Number.isInteger(ix)||ix<0||ix>=c.turns.length))return;
  return speak(name==='p49-hear-turn'?c.turns[ix].hanzi:
   c.turns.map(t=>t.hanzi).join(' '),name==='p49-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p49-question-next'){
  const c=findP49Case(p49CaseId);if(!c)return;
  if(p49Question+1<c.questions.length){p49Question++;p49Feedback=null;return render();}
  p49Feedback=null;p49Stage='write';
  location.hash='#/cumulative49/'+c.id+'?stage=write';return render();
 }
 if(name==='p49-question-retry'){p49Feedback=null;return render();}
 if(name==='p49-retry-question'){
  const c=findP49Case(p49CaseId),ix=Number(button.dataset.index);
  if(!c||!Number.isInteger(ix)||ix<0||ix>=c.questions.length)return;
  p49Question=ix;p49Feedback=null;p49Stage='listen';
  location.hash='#/cumulative49/'+c.id+'?stage=listen';return render();
 }
 if(name==='p49-answer'||name==='p49-reveal'){
  const c=findP49Case(p49CaseId),d=c&&p49NativeDialogue(c);
  if(!d||p49Feedback)return;
  const q=dialogueQuestion(d.id,p49Question);if(!q)return;
  if(name==='p49-reveal'){
   p49AssistedCases.add(c.id);
   p49Feedback={revealed:true,correct:false,assisted:true};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p49AssistedCases.has(c.id);
  const eventId=globalThis.crypto?.randomUUID?.()||'p49-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{
   id:eventId,dialogueId:d.id,question:p49Question,answer,assisted
  }));
  if(saved){
   p49Feedback={correct:answer===q.answer,assisted,revealed:false};render();
   root.querySelector('.p49-feedback')?.scrollIntoView({block:'nearest'});
  }
  return;
 }
 if(name==='p49-write'){
  const c=findP49Case(p49CaseId),ix=Number(button.dataset.index);
  if(!c||!Number.isInteger(ix)||ix<0||ix>=c.models.length)return;
  const taskId='p49:'+c.id+':model'+ix;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(index<0)return alertUser('The original P49 exact response is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p49AssistedCases.has(c.id);return go('workshop');
 }
 if(name==='p48-enter'||name==='p48-return'||name==='p48-open'||name==='p48-next'){
  const selected=name==='p48-open'?findP48Passage(id):
   name==='p48-return'?findP48Passage(p48CaseId):
   name==='p48-next'?p48Next(state,p48CaseId):findP48Passage(p48CaseId)||p48Next(state);
  if(!selected)return alertUser('No original comparative-source lesson is available.','error');
  if(name!=='p48-return'){
   p48CaseId=selected.id;p48Stage='compare';p48Translations=false;p48Transcript=false;p48Models=false;
   p48ReadingIndex=0;p48ListeningIndex=0;p48ReadingFeedback=null;p48ListeningFeedback=null;
   p48SelfReview.clear();
  }
  location.hash='#/comparative/'+selected.id+'?stage='+p48Stage;
  render();root.querySelector('.p48-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p48-stage'){
  if(!findP48Passage(p48CaseId)||!P48_STAGES.some(x=>x.id===button.dataset.stage))return;
  p48Stage=button.dataset.stage;p48ReadingFeedback=null;p48ListeningFeedback=null;
  location.hash='#/comparative/'+p48CaseId+'?stage='+p48Stage;return render();
 }
 if(name==='p48-review')return go('review');
 if(name==='p48-translation'||name==='p48-transcript'||name==='p48-models'){
  if(!findP48Passage(p48CaseId))return;
  if(name==='p48-translation'){p48Translations=!p48Translations;if(p48Translations)p48AssistedCases.add(p48CaseId);}
  if(name==='p48-transcript'){p48Transcript=!p48Transcript;if(p48Transcript)p48AssistedCases.add(p48CaseId);}
  if(name==='p48-models'){p48Models=!p48Models;if(p48Models)p48AssistedCases.add(p48CaseId);}
  return render();
 }
 if(name==='p48-play'||name==='p48-play-slow'||name==='p48-hear-turn'){
  const p=findP48Passage(p48CaseId),d=p&&P48_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  const index=Number(button.dataset.index);
  if(name==='p48-hear-turn'&&(!Number.isInteger(index)||index<0||index>=d.turns.length))return;
  return speak(name==='p48-hear-turn'?d.turns[index].hanzi:
   d.turns.map(t=>t.hanzi).join(' '),name==='p48-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p48-reader-next'){
  const p=findP48Passage(p48CaseId);if(!p)return;
  if(p48ReadingIndex+1<p.questions.length){
   p48ReadingIndex++;p48ReadingFeedback=null;return render();
  }
  p48Stage='listen';p48ReadingFeedback=null;
  location.hash='#/comparative/'+p.id+'?stage=listen';return render();
 }
 if(name==='p48-reader-retry'){p48ReadingFeedback=null;return render();}
 if(name==='p48-reader-answer'||name==='p48-reader-model'){
  const p=findP48Passage(p48CaseId),story=p&&p48Story(p);
  if(!story||p48ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p48ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  if(name==='p48-reader-model'){
   p48AssistedCases.add(p.id);p48ReadingFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p48AssistedCases.has(p.id)||name==='p48-reader-model';
  const correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p48-reader-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){
   p48ReadingFeedback={correct,assisted};render();
   root.querySelector('.p48-feedback')?.scrollIntoView({block:'nearest'});
  }
  return;
 }
 if(name==='p48-listener-next'){
  const p=findP48Passage(p48CaseId),d=p&&P48_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  if(p48ListeningIndex+1<d.questions.length){
   p48ListeningIndex++;p48ListeningFeedback=null;return render();
  }
  p48Stage='argue';p48ListeningFeedback=null;
  location.hash='#/comparative/'+p.id+'?stage=argue';return render();
 }
 if(name==='p48-listener-retry'){p48ListeningFeedback=null;return render();}
 if(name==='p48-listener-answer'||name==='p48-listener-model'){
  const p=findP48Passage(p48CaseId),d=p&&p48NativeDialogue(p);
  if(!d||p48ListeningFeedback)return;
  const q=dialogueQuestion(d.id,p48ListeningIndex);if(!q)return;
  if(name==='p48-listener-model'){
   p48AssistedCases.add(p.id);p48ListeningFeedback={revealed:true,assisted:true,correct:false};return render();
  }
  const answer=button.dataset.option||'';
  if(!q.options.includes(answer))return;
  const assisted=p48AssistedCases.has(p.id)||name==='p48-listener-model';
  const eventId=globalThis.crypto?.randomUUID?.()||'p48-dialogue-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:d.id,
   question:p48ListeningIndex,answer,assisted}));
  if(saved){
   p48ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p48-feedback')?.scrollIntoView({block:'nearest'});
  }
  return;
 }
 if(name==='p48-check'){
  if(!P48_REVISION_CHECKS.some(c=>c.id===id)||!findP48Passage(p48CaseId))return;
  if(p48SelfReview.has(id))p48SelfReview.delete(id);else p48SelfReview.add(id);
  return render();
 }
 if(name==='p48-open-p43'){
  const p=findP48Passage(p48CaseId),a=p&&findP48Argument(p.id);
  if(!a)return;
  p43UnitId=a.p43Id;
  return go('production');
 }
 if(name==='p48-argument-write'||name==='p48-write'){
  const p=findP48Passage(p48CaseId);if(!p)return;
  let taskId;
  if(name==='p48-argument-write'){
   const a=findP48Argument(p.id),index=Number(button.dataset.index);
   if(!a||!Number.isInteger(index)||index<0||index>=a.models.length)return;
   taskId='p48:argument:'+p.id+':model'+index;
  }else if(button.dataset.kind==='reading'){
   const story=p48Story(p);if(!story)return;
   taskId='beginner-reading:'+story.id+':writing';
  }else{
   const d=P48_DIALOGUES.find(x=>x.readingId===p.id);
   if(!d||!['turn6','turn9'].includes(button.dataset.kind))return;
   taskId='p48:dialogue:'+d.id+':'+button.dataset.kind;
  }
  const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(index<0)return alertUser('The original fixed-form sentence task is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p48AssistedCases.has(p.id);return go('workshop');
 }
 if(name==='p47-enter'||name==='p47-return'||name==='p47-open'||name==='p47-next'){
  const selected=name==='p47-open'?findP47Passage(id):
   name==='p47-return'?findP47Passage(p47UnitId):
   name==='p47-next'?p47Next(state,p47UnitId):findP47Passage(p47UnitId)||p47Next(state);
  if(!selected)return alertUser('Original P47 unit is not available.','error');
  if(name!=='p47-return'){
   p47UnitId=selected.id;p47Stage='words';p47ReadingHelp=false;p47ListeningHelp=false;
   p47ReadingIndex=0;p47ListeningIndex=0;p47ReadingFeedback=null;p47ListeningFeedback=null;p47ProductionModels=false;
  }
  location.hash='#/advanced/'+selected.id+'?stage='+p47Stage;
  render();root.querySelector('.p47-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p47-stage'){
  if(!P47_STAGES.some(x=>x.id===button.dataset.stage)||!findP47Passage(p47UnitId))return;
  p47Stage=button.dataset.stage;p47ReadingFeedback=null;p47ListeningFeedback=null;
  location.hash='#/advanced/'+p47UnitId+'?stage='+p47Stage;return render();
 }
 if(name==='p47-review'){return go('review');}
 if(name==='p47-character'){
  const g=findP47Guide(button.dataset.hanzi),lesson=g&&DEMO_LESSONS.find(l=>l.hanzi===g.hanzi);
  if(!lesson)return alertUser('The canonical P47 character lesson is unavailable.','error');
  displayLessonId=lesson.id;return go('learn');
 }
 if(name==='p47-reading-help'||name==='p47-listening-help'){
  if(!findP47Passage(p47UnitId))return;
  if(name==='p47-reading-help'){
   p47ReadingHelp=!p47ReadingHelp;if(p47ReadingHelp)p47AssistedUnits.add(p47UnitId);
  }else{
   p47ListeningHelp=!p47ListeningHelp;if(p47ListeningHelp)p47AssistedUnits.add(p47UnitId);
  }
  return render();
 }
 if(name==='p47-play'||name==='p47-play-slow'||name==='p47-turn-play'){
  const p=findP47Passage(p47UnitId),d=p&&P47_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  const index=Number(button.dataset.index);
  if(name==='p47-turn-play'&&(!Number.isInteger(index)||index<0||index>=d.turns.length))return;
  const words=name==='p47-turn-play'?d.turns[index].hanzi:d.turns.map(t=>t.hanzi).join(' ');
  return speak(words,name==='p47-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p47-reader-next'){
  const p=findP47Passage(p47UnitId);if(!p)return;
  if(p47ReadingIndex+1<p.questions.length){
   p47ReadingIndex++;p47ReadingFeedback=null;return render();
  }
  p47Stage='listen';p47ReadingFeedback=null;
  location.hash='#/advanced/'+p.id+'?stage=listen';return render();
 }
 if(name==='p47-reader-retry'){p47ReadingFeedback=null;return render();}
 if(name==='p47-reader-answer'||name==='p47-reader-reveal'){
  const p=findP47Passage(p47UnitId),story=p&&p47Story(p);
  if(!story||p47ReadingFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p47ReadingIndex];
  const q=beginnerQuestion(story,mode);if(!q)return;
  const answer=name==='p47-reader-reveal'?'':button.dataset.option||'';
  if(name==='p47-reader-answer'&&!q.options.includes(answer))return;
  const assisted=p47AssistedUnits.has(p.id)||name==='p47-reader-reveal';
  const correct=answer===q.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p47-reader-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(saved){
   p47ReadingFeedback={correct,assisted};render();
   root.querySelector('.p47-feedback')?.scrollIntoView({block:'nearest'});
  }
  return;
 }
 if(name==='p47-listener-next'){
  const p=findP47Passage(p47UnitId),d=p&&P47_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  if(p47ListeningIndex+1<d.questions.length){
   p47ListeningIndex++;p47ListeningFeedback=null;return render();
  }
  p47Stage='produce';p47ListeningFeedback=null;
  location.hash='#/advanced/'+p.id+'?stage=produce';return render();
 }
 if(name==='p47-listener-retry'){p47ListeningFeedback=null;return render();}
 if(name==='p47-listener-answer'||name==='p47-listener-reveal'){
  const p=findP47Passage(p47UnitId),d=p&&p47NativeDialogue(p);
  if(!d||p47ListeningFeedback)return;
  const q=dialogueQuestion(d.id,p47ListeningIndex);if(!q)return;
  const answer=name==='p47-listener-reveal'?'':button.dataset.option||'';
  if(name==='p47-listener-answer'&&!q.options.includes(answer))return;
  const assisted=p47AssistedUnits.has(p.id)||name==='p47-listener-reveal';
  const eventId=globalThis.crypto?.randomUUID?.()||'p47-dialogue-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:d.id,
   question:p47ListeningIndex,answer,assisted}));
  if(saved){
   p47ListeningFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p47-feedback')?.scrollIntoView({block:'nearest'});
  }
  return;
 }
 if(name==='p47-production-help'){
  if(!findP47Passage(p47UnitId))return;
  p47ProductionModels=!p47ProductionModels;
  if(p47ProductionModels)p47AssistedUnits.add(p47UnitId);
  return render();
 }
 if(name==='p47-production-write'){
  const p=findP47Passage(p47UnitId);
  if(!p)return;
  const index=Number(button.dataset.index);
  if(!Number.isInteger(index)||index<0||index>=2)return;
  const taskId='p47:transfer:'+p.id+':model'+index;
  const taskIndex=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(taskIndex<0)return alertUser('P47 source reconstruction is not registered in the original Workshop.','error');
  sentenceIndex=taskIndex;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p47AssistedUnits.has(p.id);
  return go('workshop');
 }
 if(name==='p47-write'||name==='p47-character-write'){
  const p=findP47Passage(p47UnitId);if(!p)return;
  let taskId;
  if(name==='p47-character-write'){
   const g=findP47Guide(button.dataset.hanzi);if(!g)return;
   taskId='p47:character:'+g.hanzi+':example0';
  }else if(button.dataset.kind==='reading'){
   const story=p47Story(p);if(!story)return;
   taskId='beginner-reading:'+story.id+':writing';
  }else{
   const d=P47_DIALOGUES.find(x=>x.readingId===p.id);
   if(!d)return;
   const turn=button.dataset.kind==='turn3'?3:button.dataset.kind==='turn7'?7:-1;
   if(turn<0)return;
   taskId='p47:dialogue:'+d.id+':turn'+turn;
  }
  const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(index<0)return alertUser('This original exact-form model is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p47AssistedUnits.has(p.id);
  return go('workshop');
 }
 if(name==='p46-enter'||name==='p46-return'||name==='p46-open'||name==='p46-next'){
  const chosen=name==='p46-open'?findP46Passage(id):
   name==='p46-return'?findP46Passage(p46UnitId):
   name==='p46-next'?p46Next(state,p46UnitId):findP46Passage(p46UnitId)||p46Next(state);
  if(!chosen)return alertUser('No original P46 unit available.','error');
  if(name!=='p46-return'){
   p46UnitId=chosen.id;p46Stage='characters';p46ReaderHelp=false;p46AudioHelp=false;
   p46ReaderIndex=0;p46ListenerIndex=0;p46ReaderFeedback=null;p46ListenerFeedback=null;
  }
  location.hash='#/upper/'+chosen.id+'?stage='+p46Stage;
  render();root.querySelector('.p46-lesson')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p46-stage'){
  if(!P46_STAGES.some(x=>x.id===button.dataset.stage)||!findP46Passage(p46UnitId))return;
  p46Stage=button.dataset.stage;p46ReaderFeedback=null;p46ListenerFeedback=null;
  location.hash='#/upper/'+p46UnitId+'?stage='+p46Stage;return render();
 }
 if(name==='p46-native-review'){return go('review');}
 if(name==='p46-study-character'){
  const g=findP46Guide(button.dataset.hanzi),lesson=g&&DEMO_LESSONS.find(l=>l.hanzi===g.hanzi);
  if(!lesson)return alertUser('Original P46 character teaching is not available.','error');
  displayLessonId=lesson.id;return go('learn');
 }
 if(name==='p46-reader-help'||name==='p46-audio-help'){
  if(!findP46Passage(p46UnitId))return;
  if(name==='p46-reader-help'){p46ReaderHelp=!p46ReaderHelp;if(p46ReaderHelp)p46AssistedUnits.add(p46UnitId);}
  else{p46AudioHelp=!p46AudioHelp;if(p46AudioHelp)p46AssistedUnits.add(p46UnitId);}
  return render();
 }
 if(name==='p46-play'||name==='p46-play-slow'||name==='p46-turn-play'){
  const p=findP46Passage(p46UnitId),d=p&&P46_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  const i=Number(button.dataset.index);
  if(name==='p46-turn-play'&&(!Number.isInteger(i)||i<0||i>=d.turns.length))return;
  const message=name==='p46-turn-play'?d.turns[i].hanzi:d.turns.map(x=>x.hanzi).join(' ');
  return speak(message,name==='p46-play-slow'?0.7:demoSpeechRate);
 }
 if(name==='p46-reader-next'){
  const p=findP46Passage(p46UnitId);if(!p)return;
  if(p46ReaderIndex+1<p.questions.length){p46ReaderIndex++;p46ReaderFeedback=null;return render();}
  p46ReaderFeedback=null;p46Stage='listening';
  location.hash='#/upper/'+p.id+'?stage=listening';return render();
 }
 if(name==='p46-reader-retry'){p46ReaderFeedback=null;return render();}
 if(name==='p46-reader-answer'||name==='p46-reader-reveal'){
  const p=findP46Passage(p46UnitId),story=p&&p46Story(p);
  if(!story||p46ReaderFeedback)return;
  const mode=['beginner-detail','beginner-reason','beginner-sequence'][p46ReaderIndex];
  const question=beginnerQuestion(story,mode);if(!question)return;
  const answer=name==='p46-reader-reveal'?'':button.dataset.option||'';
  if(name==='p46-reader-answer'&&!question.options.includes(answer))return;
  const assisted=p46AssistedUnits.has(p.id)||name==='p46-reader-reveal';
  const correct=answer===question.answer;
  const eventId=globalThis.crypto?.randomUUID?.()||'p46-reader-'+Date.now()+'-'+Math.random();
  const ok=await mutate(old=>addReadingEvent(old,story.id,mode,correct,assisted,eventId));
  if(ok){p46ReaderFeedback={correct,assisted};render();
   root.querySelector('.p46-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p46-listener-next'){
  const p=findP46Passage(p46UnitId),d=p&&P46_DIALOGUES.find(x=>x.readingId===p.id);
  if(!d)return;
  if(p46ListenerIndex+1<d.questions.length){p46ListenerIndex++;p46ListenerFeedback=null;return render();}
  p46ListenerFeedback=null;p46Stage='production';
  location.hash='#/upper/'+p.id+'?stage=production';return render();
 }
 if(name==='p46-listener-retry'){p46ListenerFeedback=null;return render();}
 if(name==='p46-listener-answer'||name==='p46-listener-reveal'){
  const p=findP46Passage(p46UnitId),d=p&&p46NativeDialogue(p);
  if(!d||p46ListenerFeedback)return;
  const q=dialogueQuestion(d.id,p46ListenerIndex);if(!q)return;
  const answer=name==='p46-listener-reveal'?'':button.dataset.option||'';
  if(name==='p46-listener-answer'&&!q.options.includes(answer))return;
  const assisted=p46AssistedUnits.has(p.id)||name==='p46-listener-reveal';
  const eventId=globalThis.crypto?.randomUUID?.()||'p46-dialogue-'+Date.now()+'-'+Math.random();
  const ok=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:d.id,
   question:p46ListenerIndex,answer,assisted}));
  if(ok){p46ListenerFeedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p46-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p46-write'||name==='p46-write-character'){
  const p=findP46Passage(p46UnitId);if(!p)return;
  let taskId;
  if(name==='p46-write-character'){
   const g=findP46Guide(button.dataset.hanzi);if(!g)return;
   taskId='p46:character:'+g.hanzi+':example0';
  }else if(button.dataset.kind==='reading'){
   const story=p46Story(p);if(!story)return;
   taskId='beginner-reading:'+story.id+':writing';
  }else{
   const d=P46_DIALOGUES.find(x=>x.readingId===p.id);if(!d)return;
   taskId='p46:dialogue:'+d.id+':final';
  }
  const index=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(index<0)return alertUser('The original exact sentence task was not available.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p46AssistedUnits.has(p.id);
  return go('workshop');
 }
 if(name==='p45-enter'||name==='p45-return'||name==='p45-open'||name==='p45-next'){
  let target;
  if(name==='p45-open')target=findP45Transfer(id);
  else if(name==='p45-return')target=findP45Transfer(p45CaseId);
  else if(name==='p45-next')target=p45Recommendations(state).find(x=>x.caseItem.id!==p45CaseId)?.caseItem;
  else target=findP45Transfer(p45CaseId)||p45Recommendations(state)[0]?.caseItem;
  if(!target)return alertUser('No original P45 cumulative task is available.','error');
  if(name!=='p45-return'){
   p45CaseId=target.id;p45Stage='read';p45SourceHelp=false;p45Transcript=false;
   p45Question=0;p45Feedback=null;
  }
  location.hash='#/cumulative/'+target.id+'?stage='+p45Stage;
  render();root.querySelector('.p45-learning')?.scrollIntoView({block:'start'});
  return;
 }
 if(name==='p45-filter'){
  if(!['all','needs','new','independent'].includes(button.dataset.filter))return;
  p45Filter=button.dataset.filter;return render();
 }
 if(name==='p45-stage'){
  const stage=button.dataset.stage;
  if(!findP45Transfer(p45CaseId)||!['read','listen','check','produce'].includes(stage))return;
  p45Stage=stage;p45Feedback=null;
  location.hash='#/cumulative/'+p45CaseId+'?stage='+stage;return render();
 }
 if(name==='p45-source-help'||name==='p45-transcript'){
  if(!findP45Transfer(p45CaseId))return;
  if(name==='p45-source-help'){p45SourceHelp=!p45SourceHelp;if(p45SourceHelp)p45AssistedCases.add(p45CaseId);}
  else{p45Transcript=!p45Transcript;if(p45Transcript)p45AssistedCases.add(p45CaseId);}
  return render();
 }
 if(name==='p45-native-review'){return go('review');}
 if(name==='p45-play'||name==='p45-play-slow'||name==='p45-turn-audio'||name==='p45-oral-model'){
  const source=findP45Transfer(p45CaseId);if(!source)return;
  const index=Number(button.dataset.index);
  if(name==='p45-turn-audio'&&(!Number.isInteger(index)||index<0||index>=source.turns.length))return;
  if(name==='p45-oral-model')p45AssistedCases.add(source.id);
  const words=name==='p45-turn-audio'?source.turns[index].hanzi:
    name==='p45-oral-model'?source.response.hanzi:source.turns.map(t=>t.hanzi).join(' ');
  return speak(words,name==='p45-play-slow'?0.68:demoSpeechRate);
 }
 if(name==='p45-question-next'){
  const c=findP45Transfer(p45CaseId);if(!c)return;
  if(p45Question+1<c.questions.length){p45Question++;p45Feedback=null;return render();}
  p45Stage='produce';p45Feedback=null;
  location.hash='#/cumulative/'+c.id+'?stage=produce';return render();
 }
 if(name==='p45-question-retry'){p45Feedback=null;return render();}
 if(name==='p45-answer'||name==='p45-reveal'){
  const c=findP45Transfer(p45CaseId);if(!c||p45Feedback)return;
  const original=DIALOGUES.find(d=>d.p45?.id===c.id);
  const q=original&&dialogueQuestion(original.id,p45Question);if(!q)return;
  const answer=name==='p45-reveal'?'':button.dataset.option||'';
  if(name==='p45-answer'&&!q.options.includes(answer))return;
  const assisted=p45AssistedCases.has(c.id)||name==='p45-reveal';
  const eventId=globalThis.crypto?.randomUUID?.()||'p45-dialogue-'+Date.now()+'-'+Math.random();
  const saved=await mutate(old=>addDialogueEvent(old,{id:eventId,
    dialogueId:original.id,question:p45Question,answer,assisted}));
  if(saved){p45Feedback={correct:answer===q.answer,assisted};render();
   root.querySelector('.p45-feedback')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p45-write'){
  const c=findP45Transfer(p45CaseId);if(!c)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p45:'+c.id+':response');
  if(index<0)return alertUser('The P45 response is not registered in the original Sentence Workshop.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p45AssistedCases.has(c.id);
  return go('workshop');
 }
 if(name==='p44-enter'||name==='p44-return'){
  const chosen=findP44Scenario(p44SessionId)||p44Next(state);
  p44SessionId=chosen.id;
  location.hash='#/integrated/'+chosen.id+'?stage='+p44Phase;
  return render();
 }
 if(name==='p44-open'||name==='p44-next-case'){
  const selected=name==='p44-open'?findP44Scenario(id):p44Next(state,p44SessionId);
  if(!selected)return alertUser('The original integrated scenario is unavailable.','error');
  p44SessionId=selected.id;p44Phase='read';p44ReadHelp=false;p44ListenHelp=false;
  p44QuestionIndex=0;p44Feedback=null;
  location.hash='#/integrated/'+selected.id+'?stage=read';
  render();root.querySelector('.p44-journey')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p44-stage'){
  const stage=button.dataset.stage;
  if(!P44_PHASES.some(p=>p.id===stage)||!findP44Scenario(p44SessionId))return;
  p44Phase=stage;p44Feedback=null;
  location.hash='#/integrated/'+p44SessionId+'?stage='+stage;
  return render();
 }
 if(name==='p44-prev-page'||name==='p44-next-page'){
  const q=p44Query.trim().toLocaleLowerCase();
  const size=P44_SCENARIOS.filter(sc=>!q||[sc.title,sc.theme,sc.goal,sc.pitfall,sc.revision,
   ...sc.brief.flatMap(l=>[l.hanzi,l.english])].join(' ').toLocaleLowerCase().includes(q)).length;
  p44Page=Math.max(0,Math.min(Math.max(0,Math.ceil(size/6)-1),p44Page+(name==='p44-next-page'?1:-1)));
  return render();
 }
 if(name==='p44-source-help'){
  if(!findP44Scenario(p44SessionId))return;
  p44ReadHelp=!p44ReadHelp;
  if(p44ReadHelp)p44AssistedCases.add(p44SessionId);
  return render();
 }
 if(name==='p44-transcript'){
  if(!findP44Scenario(p44SessionId))return;
  p44ListenHelp=!p44ListenHelp;
  if(p44ListenHelp)p44AssistedCases.add(p44SessionId);
  return render();
 }
 if(name==='p44-audio'||name==='p44-audio-slow'||name==='p44-play-turn'||name==='p44-oral-model'){
  const sc=findP44Scenario(p44SessionId);if(!sc)return;
  if(name==='p44-oral-model')p44AssistedCases.add(sc.id);
  const index=Number(button.dataset.index);
  if(name==='p44-play-turn'&&(!Number.isInteger(index)||index<0||index>=sc.turns.length))return;
  const message=name==='p44-play-turn'?sc.turns[index].hanzi:
    name==='p44-oral-model'?sc.responses.map(x=>x.hanzi).join(' '):sc.turns.map(t=>t.hanzi).join(' ');
  return speak(message,name==='p44-audio-slow'?0.68:demoSpeechRate);
 }
 if(name==='p44-question-next'){
  const sc=findP44Scenario(p44SessionId);if(!sc)return;
  if(p44QuestionIndex+1<sc.questions.length){
   p44QuestionIndex++;p44Feedback=null;return render();
  }
  p44Feedback=null;p44Phase='write';
  location.hash='#/integrated/'+sc.id+'?stage=write';return render();
 }
 if(name==='p44-question-retry'){p44Feedback=null;return render();}
 if(name==='p44-answer'||name==='p44-reveal-answer'){
  const sc=findP44Scenario(p44SessionId);if(!sc||p44Feedback)return;
  const original=DIALOGUES.find(d=>d.p44?.id===sc.id);
  const q=original&&dialogueQuestion(original.id,p44QuestionIndex);if(!q)return;
  const response=name==='p44-reveal-answer'?'':button.dataset.option||'';
  if(name==='p44-answer'&&!q.options.includes(response))return;
  const assisted=p44AssistedCases.has(sc.id)||name==='p44-reveal-answer';
  const eventId=globalThis.crypto?.randomUUID?.()||'p44-dialogue-'+Date.now()+'-'+Math.random();
  const ok=await mutate(old=>addDialogueEvent(old,{id:eventId,dialogueId:original.id,
    question:p44QuestionIndex,answer:response,assisted}));
  if(ok){p44Feedback={correct:response===q.answer,assisted};render();
   root.querySelector('.p44-evidence')?.scrollIntoView({block:'nearest'});}
  return;
 }
 if(name==='p44-write'){
  const sc=findP44Scenario(p44SessionId);if(!sc)return;
  const index=Number(button.dataset.index);
  if(!Number.isInteger(index)||index<0||index>=sc.responses.length)return;
  const taskId='p44:'+sc.id+':response'+index;
  const taskIndex=SENTENCE_TASKS.findIndex(t=>t.id===taskId);
  if(taskIndex<0)return alertUser('The canonical P44 sentence task is unavailable.','error');
  sentenceIndex=taskIndex;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=p44AssistedCases.has(sc.id);
  return go('workshop');
 }
 if(name==='p43-enter'){
  if(route()!=='production')return go('production');
  root.querySelector('.p43-studio')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p43-open'||name==='p43-next'){
  const selected=name==='p43-next'?P43_UNITS[(P43_UNITS.findIndex(x=>x.id===p43UnitId)+1)%P43_UNITS.length]?.id:id;
  if(!findP43Unit(selected))return;
  if(selected!==p43UnitId&&(p43Draft.trim()||p43Revisions.length)){
   p43Pending=selected;
   const params=new URLSearchParams(location.hash.split('?')[1]||'');
   const context=findP55Brief(params.get('p55'));
   location.hash='#/production/'+p43UnitId+
    (context?'?p55='+context.id+'&p55step=write':'');
   return render();
  }
  if(selected!==p43UnitId){
   p43UnitId=selected;p43Draft='';p43Revisions=[];p43Version=-1;p43Step='plan';
   p43ModelRevealed=false;p43SourceRevealed=false;p43Assisted=false;p43Reviewed=[];p43Pending='';
  }
  location.hash='#/production/'+selected;return render();
 }
 if(name==='p43-filter'){
  if(!['all','1','2','3'].includes(button.dataset.filter))return;
  p43Filter=button.dataset.filter;return render();
 }
 if(name==='p43-stay'){
  p43Pending='';
  // Cancel a pending source-unit switch without leaving its requested target in the URL.
  if(route()==='production'){
   const active='production/'+p43UnitId;
   const context=findP55Brief(new URLSearchParams(location.hash.split('?')[1]||'').get('p55'));
   location.hash='#/'+active+(context?.writingId===p43UnitId?
     '?p55='+context.id+'&p55step=write':'');
  }
  return render();
 }
 if(name==='p43-discard'){p43Pending='discard';return render();}
 if(name==='p43-switch-confirm'){
  if(!p43Pending)return;
  if(p43Pending.startsWith('restore:')){
   const i=Number(p43Pending.slice(8));
   if(!Number.isInteger(i)||i<0||i>=p43Revisions.length){p43Pending='';return render();}
   p43Draft=p43Revisions[i];p43Reviewed=[];p43Pending='';
   p43Step='revise';render();root.querySelector('#p43-draft')?.focus();return;
  }
  const selected=p43Pending==='discard'?p43UnitId:p43Pending;
  if(!findP43Unit(selected))return;
  p43Draft='';p43Revisions=[];p43Version=-1;p43Reviewed=[];
  p43Assisted=false;p43ModelRevealed=false;p43SourceRevealed=false;
  p43Step='plan';p43UnitId=selected;p43Pending='';
  const linkedWriting=new URLSearchParams(location.hash.split('?')[1]||'').get('p55');
  const sourceBrief=findP55Brief(linkedWriting);
  location.hash='#/production/'+selected+
   (sourceBrief?.writingId===selected?'?p55='+sourceBrief.id+'&p55step=write&p55q='+p55Question:'');return render();
 }
 if(name==='p43-step'){
  const stage=button.dataset.step;if(!['plan','compose','revise','speak'].includes(stage))return;
  p43Step=stage;return render();
 }
 if(name==='p43-evidence'){p43SourceRevealed=!p43SourceRevealed;if(p43SourceRevealed)p43Assisted=true;return render();}
 if(name==='p43-reveal'){p43ModelRevealed=!p43ModelRevealed;if(p43ModelRevealed)p43Assisted=true;return render();}
 if(name==='p43-model-audio'){
  const unit=findP43Unit(p43UnitId);if(!unit)return;
  p43Assisted=true;return speak(unit.lines.map(l=>l.hanzi).join(' '),demoSpeechRate);
 }
 if(name==='p43-save'){
  if(!p43Draft.trim())return alertUser('Write your own draft before saving an in-tab snapshot.','error');
  if(p43Revisions.at(-1)===p43Draft)return alertUser('Current writing matches the last saved snapshot.');
  p43Revisions=[...p43Revisions.slice(-7),p43Draft];
  p43Version=p43Revisions.length-1;
  alertUser('Revision snapshot held in this tab only; copy it elsewhere for a durable backup.');return render();
 }
 if(name==='p43-version'){
  const i=Number(button.dataset.version);
  if(!Number.isInteger(i)||i<0||i>=p43Revisions.length)return;
  p43Version=i;return render();
 }
 if(name==='p43-restore'){
  const i=Number(button.dataset.version);
  if(!Number.isInteger(i)||i<0||i>=p43Revisions.length)return;
  if(p43Draft.trim()&&p43Draft!==p43Revisions[i]){
   p43Pending='restore:'+i;return render();
  }
  p43Draft=p43Revisions[i];p43Reviewed=[];
  render();root.querySelector('#p43-draft')?.focus();return;
 }
 if(name==='p43-criterion'){
  const key=id;
  if(!P43_REVIEW_CRITERIA.some(c=>c.id===key))return;
  p43Reviewed=p43Reviewed.includes(key)?p43Reviewed.filter(x=>x!==key):[...p43Reviewed,key];
  return render();
 }
 if(name==='p43-copy'){
  if(!p43Draft.trim())return;
  if(!navigator.clipboard?.writeText)return alertUser('Clipboard API unavailable. Select and copy the text in the editor manually.','error');
  try{await navigator.clipboard.writeText(p43Draft);alertUser('Your current writing was copied to the clipboard.');}
  catch(e){alertUser('Clipboard permission was denied. Select and copy the writing in the editor manually.','error');}
  return;
 }
 if(name==='p43-workshop'){
  const i=Number(button.dataset.line);
  if(![4,9].includes(i))return;
  const targetId='p43:'+p43UnitId+':line'+i;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===targetId);
  if(index<0)return alertUser('Original P43 exact-reconstruction task is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=p43Assisted;
  return go('workshop');
 }
 if(name==='p41-open'){
  const passage=findP41Passage(id),target=passage&&STORIES.find(st=>st.beginner?.p41?.id===id);
  if(!target)return alertUser('The original P41 reading is unavailable.','error');
  storyId=target.id;storyMode='beginner-detail';storiesLongOnly=false;storiesBeginnerOnly=true;
  p41BrowseOpen=true;resetReadingNavigation();
  location.hash='#/stories/'+passage.id;render();
  root.querySelector('.p41-study')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p41-browse'){
  p41BrowseOpen=true;p41Stage='all';p41Page=0;p41Query='';
  if(route()!=='stories')go('stories');
  const node=root.querySelector('.p41-catalog');if(node){node.open=true;node.scrollIntoView({block:'start'});}
  return;
 }
 if(name==='p41-next-reading')return act({dataset:{action:'p41-open',id:p41Next(state,findStory(storyId)?.beginner?.p41?.id).id}});
 if(name==='p41-stage'){
  const v=button.dataset.stage;if(!['all','3','4','5'].includes(v))return;
  p41Stage=v;p41Page=0;p41BrowseOpen=true;return render();
 }
 if(name==='p41-prev'||name==='p41-next-page'){
  const q=p41Query.trim().toLocaleLowerCase();
  const total=P41_PASSAGES.filter(p=>(p41Stage==='all'||String(p.stage)===p41Stage)&&
  (!q||[p.title,p.theme,p.format,p.notes.teaching,p.notes.misconception,...p.grammarIds,
   ...p.lines.map(l=>l.hanzi)].join(' ').toLocaleLowerCase().includes(q))).length;
  const last=Math.max(0,Math.ceil(total/6)-1);
  p41Page=Math.max(0,Math.min(last,p41Page+(name==='p41-next-page'?1:-1)));
  p41BrowseOpen=true;return render();
 }
 if(name==='p41-section'){
  const value=button.dataset.section;if(!['all','1','2','3','4'].includes(value))return;
  p41Section=value;return render();
 }
 if(name==='p41-next-section'){
  p41Section=p41Section==='all'?'1':p41Section==='1'?'2':p41Section==='2'?'3':p41Section==='3'?'4':'all';
  return render();
 }
 if(name==='p41-pinyin'||name==='p41-english'){
  if(!findStory(storyId)?.beginner?.p41)return;
  if(name==='p41-pinyin')p41Pinyin=!p41Pinyin;else p41English=!p41English;
  if(p41Pinyin||p41English)storyAssist=true;
  return render();
 }
 if(name==='p41-audio'){
  const p=findStory(storyId)?.beginner?.p41;if(!p)return;
  const selected=p.paragraphs[Number(p41Section)-1];
  const lines=selected?p.lines.slice(selected.start,selected.end+1):p.lines;
  return speak(lines.map(line=>line.hanzi).join(' '),demoSpeechRate);
 }
 if(name==='p41-write'){
  const p=findP41Passage(id),st=p&&STORIES.find(x=>x.beginner?.p41?.id===id);
  if(!st)return alertUser('Original P41 production source unavailable.','error');
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='beginner-reading:'+st.id+':writing');
  if(index<0)return alertUser('P41 production task unavailable in native Workshop.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=storyAssist||p41Pinyin||p41English;
  return go('workshop');
 }
 if(name==='p38-open'){
 const passage=findP38Passage(id),target=passage&&STORIES.find(st=>st.beginner?.p38?.id===id);
 if(!target)return alertUser('The original reading adaptation is unavailable.','error');
 storyId=target.id;storyMode='beginner-detail';storiesLongOnly=false;storiesBeginnerOnly=true;
 p38BrowseOpen=true;resetReadingNavigation();
 location.hash='#/stories/'+passage.id;render();root.querySelector('.p38-study')?.scrollIntoView({block:'start'});return;
}
if(name==='p38-browse'){
 p38BrowseOpen=true;p38Stage='all';p38Page=0;p38Query='';
 if(route()!=='stories')return go('stories');
 const node=root.querySelector('.p38-catalog');if(node){node.open=true;node.scrollIntoView({block:'start'});}
 return;
}
if(name==='p38-next-reading'){
 const next=p38Next(state);
 return act({dataset:{action:'p38-open',id:next.id}});
}
if(name==='p38-stage'){
 const v=button.dataset.stage;if(!['all','2','3','4'].includes(v))return;
 p38Stage=v;p38Page=0;p38BrowseOpen=true;return render();
}
if(name==='p38-page-prev'||name==='p38-page-next'){
 const q=p38Query.trim().toLocaleLowerCase();
 const n=P38_PASSAGES.filter(p=>(p38Stage==='all'||String(p.level)===p38Stage)&&
 (!q||[p.title,p.theme,p.format,p.notes.teaching,...p.grammarIds].join(' ').toLocaleLowerCase().includes(q))).length;
 p38Page=Math.max(0,Math.min(Math.max(0,Math.ceil(n/10)-1),p38Page+(name==='p38-page-next'?1:-1)));
 p38BrowseOpen=true;return render();
}
if(name==='p38-section'){
 const v=button.dataset.section;if(!['all','1','2','3'].includes(v))return;
 p38Section=v;return render();
}
if(name==='p38-next-section'){
 p38Section=p38Section==='all'?'1':p38Section==='1'?'2':p38Section==='2'?'3':'all';
 return render();
}
if(name==='p38-pinyin'||name==='p38-english'){
 if(!findStory(storyId)?.beginner?.p38)return;
 if(name==='p38-pinyin')p38Pinyin=!p38Pinyin;else p38English=!p38English;
 if(p38Pinyin||p38English)storyAssist=true;
 return render();
}
if(name==='p38-audio'||name==='p38-audio-slow'){
 const p=findStory(storyId)?.beginner?.p38;if(!p)return;
 const sections=[[0,3],[4,8],[9,11]];
 const range=p38Section==='all'?[0,11]:sections[Number(p38Section)-1]||[0,11];
 const text=p.lines.slice(range[0],range[1]+1).map(x=>x.hanzi).join(' ');
 return speak(text,name==='p38-audio-slow'?0.68:demoSpeechRate);
}
if(name==='p38-write'){
 const p=findP38Passage(id),st=p&&STORIES.find(st=>st.beginner?.p38?.id===id);
 if(!st)return alertUser('The reading writing task is unavailable.','error');
 const index=SENTENCE_TASKS.findIndex(t=>t.id==='beginner-reading:'+st.id+':writing');
 if(index<0)return alertUser('The original reading writing task is unavailable.','error');
 sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=storyAssist||p38Pinyin||p38English;
 return go('workshop');
}
if(name==='p34-open-reading'){
  const scene=P34_SCENES.find(x=>x.id===id),story=scene&&p34StoryFor(scene.id);
  if(!story)return alertUser('Original P34 reading unavailable.','error');
  storyId=story.id;storyMode='beginner-detail';storiesBeginnerOnly=true;storiesLongOnly=false;
  beginnerLevel='all';resetReadingNavigation();return go('stories');
 }
 if(name==='p34-open-listening'){
  const audio=P34_LISTENING.find(x=>x.id===id),dialogue=audio&&p34DialogueFor(audio.id);
  if(!dialogue)return alertUser('Original P34 listening unavailable.','error');
  dialogueId=dialogue.id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;
  missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
  p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;return go('dialogues');
 }
 if(name==='p34-shadow-prev'||name==='p34-shadow-next'){
  if(!findDialogue(dialogueId)?.p34)return;
  p34ShadowLine=Math.max(0,Math.min(3,p34ShadowLine+(name==='p34-shadow-next'?1:-1)));
  return render();
 }
 if(name==='p34-slow'||name==='p34-shadow-replay')return speak(button.dataset.text||'',0.68);
 if(name==='p34-write-listening'){
  const item=P34_LISTENING.find(x=>x.id===id);
  if(!item)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p34:'+item.id+':writing');
  if(index<0)return alertUser('Original audio writing prompt unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceSupport=false;sentenceFeedback=null;
  return go('workshop');
 }
 if(name==='p42-open'){
  const scene=findP42Scene(id),target=scene&&DIALOGUES.find(d=>d.p42?.id===scene.id);
  if(!target)return alertUser('The authorial P42 dialogue is unavailable.','error');
  dialogueId=target.id;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;
  p42Turn=0;p42TranscriptViewed=p42ViewedTranscripts.has(scene.id);p42BrowseOpen=true;
  p34ShadowLine=0;p34TranscriptViewed=false;p37Turn=0;p37TranscriptViewed=false;p33Branch=null;
  missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
  location.hash='#/dialogues/'+scene.id+'?turn=0';render();
  root.querySelector('.p42-listening')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p42-browse'){
  p42BrowseOpen=true;p42Query='';p42Page=0;
  if(route()!=='dialogues')return go('dialogues');
  const node=root.querySelector('.p42-catalog');
  if(node){node.open=true;node.scrollIntoView({block:'start'});}return;
 }
 if(name==='p42-prev'||name==='p42-page-next'){
  const q=p42Query.trim().toLocaleLowerCase();
  const size=P42_SCENES.filter(scene=>!q||[scene.title,scene.theme,scene.goal,
   scene.teaching,scene.vocabulary.hanzi,...scene.turns.map(t=>t[1])]
   .join(' ').toLocaleLowerCase().includes(q)).length;
  p42Page=Math.max(0,Math.min(Math.max(0,Math.ceil(size/6)-1),p42Page+(name==='p42-page-next'?1:-1)));
  p42BrowseOpen=true;return render();
 }
 if(name==='p42-next'){
  const next=p42Next(state,findDialogue(dialogueId)?.p42?.id);
  if(next)return act({dataset:{action:'p42-open',id:next.id}});
  return;
 }
 if(name==='p42-turn-prev'||name==='p42-turn-next'){
  const scene=findDialogue(dialogueId)?.p42;if(!scene)return;
  p42Turn=Math.max(0,Math.min(scene.turns.length-1,p42Turn+(name==='p42-turn-next'?1:-1)));
  location.hash='#/dialogues/'+scene.id+'?turn='+p42Turn;return render();
 }
 if(name==='p42-turn-play'){
  const scene=findDialogue(dialogueId)?.p42;if(!scene)return;
  return speak(scene.turns[p42Turn][1],demoSpeechRate);
 }
 if(name==='p42-slow'){
  const scene=findDialogue(dialogueId)?.p42;if(!scene)return;
  return speak(scene.turns.map(t=>t[1]).join(' '),0.68);
 }
 if(name==='p42-toggle-transcript'){
  const scene=findDialogue(dialogueId)?.p42;if(!scene)return;
  p42TranscriptViewed=!p42TranscriptViewed;
  dialogueSupport=p42TranscriptViewed;
  if(p42TranscriptViewed)p42ViewedTranscripts.add(scene.id);
  if(p42TranscriptViewed&&missionActive)missionSupport=true;
  return render();
 }
 if(name==='p42-write'){
  const scene=findP42Scene(id),turn=Number(button.dataset.turn);
  if(!scene||![3,7].includes(turn))return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p42:'+scene.id+':turn'+turn);
  if(index<0)return alertUser('Original P42 written reconstruction is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;
  sentenceSupport=dialogueSupport||p42ViewedTranscripts.has(scene.id);
  return go('workshop');
 }
 if(name==='p37-open'){
 const scene=findP37Scene(id),target=scene&&DIALOGUES.find(d=>d.p37?.id===id);
 if(!target)return alertUser('The authored conversation is unavailable.','error');
 dialogueId=target.id;dialogueStep=0;dialogueFeedback=null;dialogueSupport=false;
 p37Turn=0;p37Branch=null;p37TranscriptViewed=p37ViewedTranscripts.has(scene.id);p37BrowseOpen=true;
 p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;
 missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;
 location.hash='#/dialogues/'+scene.id;render();
 root.querySelector('.p37-study')?.scrollIntoView({block:'start'});return;
}
if(name==='p37-browse'){
 p37BrowseOpen=true;p37Theme='all';p37Query='';p37Page=0;
 if(route()!=='dialogues')return go('dialogues');
 const node=root.querySelector('.p37-catalog');if(node){node.open=true;node.scrollIntoView({block:'start'});}
 return;
}
if(name==='p37-theme'){
 const v=button.dataset.theme;if(v!=='all'&&!P37_THEMES.includes(v))return;
 p37Theme=v;p37Page=0;p37BrowseOpen=true;return render();
}
if(name==='p37-page-prev'||name==='p37-page-next'){
 const q=p37Query.trim().toLocaleLowerCase();
 const count=P37_SCENES.filter(x=>(p37Theme==='all'||x.theme===p37Theme)&&
  (!q||[x.title,x.goal,x.theme,x.teaching,...x.vocabulary.flatMap(w=>[w.hanzi,w.pinyin,w.english])].join(' ').toLocaleLowerCase().includes(q))).length;
 p37Page=Math.max(0,Math.min(Math.max(0,Math.ceil(count/10)-1),p37Page+(name==='p37-page-next'?1:-1)));
 p37BrowseOpen=true;return render();
}
if(name==='p37-branch'){
 const i=Number(button.dataset.index);if(!findDialogue(dialogueId)?.p37||![0,1].includes(i))return;
 p37Branch=i;p37RememberPosition();return render();
}
if(name==='p37-branch-clear'){p37Branch=null;p37RememberPosition();return render();}
if(name==='p37-turn-prev'||name==='p37-turn-next'){
 if(!findDialogue(dialogueId)?.p37)return;
 p37Turn=Math.max(0,Math.min(7,p37Turn+(name==='p37-turn-next'?1:-1)));p37RememberPosition();return render();
}
if(name==='p37-slow-all'||name==='p37-slow-turn'){
 const scene=findDialogue(dialogueId)?.p37;if(!scene)return;
 return speak(name==='p37-slow-all'?scene.turns.map(t=>t[1]).join('。'):scene.turns[p37Turn][1],0.68);
}
if(name==='p37-write'){
 const scene=findP37Scene(id),turn=Number(button.dataset.turn);
 if(!scene||![1,4,7].includes(turn))return;
 const index=SENTENCE_TASKS.findIndex(t=>t.id==='p37:'+scene.id+':turn'+turn);
 if(index<0)return alertUser('Original P37 writing task is unavailable.','error');
 sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=p37TranscriptViewed;
 return go('workshop');
}
if(name==='p33-open-scenario'){
  const scene=findP33Scenario(id),target=scene&&DIALOGUES.find(d=>d.p33?.id===id);
  if(!target)return alertUser('This authored conversation is unavailable.','error');
  dialogueId=target.id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;
  missionActive=false;missionFeedback=null;missionStep=0;missionSupport=false;p33Branch=null;
  if(route()==='dialogues'){render();root.querySelector('.dialogue-paper')?.scrollIntoView({block:'start'});return;}
  go('dialogues');return;
 }
 if(name==='p33-browse'){p33Theme='all';p33Query='';return act({dataset:{action:'p33-open-scenario',id:P33_SCENARIOS[0].id}});}
 if(name==='p33-theme'){const theme=button.dataset.theme;
  if(theme!=='all'&&![...new Set(P33_SCENARIOS.map(s=>s.theme))].includes(theme))return;
  p33Theme=theme;return render();
 }
 if(name==='p33-branch'){const index=Number(button.dataset.index);
  if(!findDialogue(dialogueId)?.p33||!Number.isInteger(index)||index<0||index>1)return;
  p33Branch=index;return render();
 }
 if(name==='p33-clear-branch'){p33Branch=null;return render();}
 if(name==='p33-write'){const scene=findP33Scenario(id),turn=Number(button.dataset.turn);
  if(!scene||![1,4,7].includes(turn))return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='p33:'+scene.id+':turn'+turn);
  if(index<0)return alertUser('The dialogue writing task is unavailable.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return go('workshop');
 }
 if(name==='p40-toggle-model'){
  if(id!==selectedGrammarId()||!p40RepairFor(id))return;
  p40ShowModel=!p40ShowModel;
  if(p40ShowModel)p40ViewedModels.add(id);
  return render();
 }
 if(name==='p40-repair'){
  const target=p40RepairFor(id)?id:p40Next(state),repair=p40RepairFor(target);
  if(!repair)return alertUser('P40 repair is unavailable in the original grammar source.','error');
  const index=SENTENCE_TASKS.findIndex(t=>t.id===repair.taskId);
  if(index<0)return alertUser('P40 repair task could not be found in native Sentence Workshop.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=p40ViewedModels.has(target);
  return go('workshop');
 }
 if(name==='p40-sentences'){
  librarySource='original-p40';libraryQuery='';libraryTopic='all';libraryArea='all';
  libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  librarySelected=SENTENCE_LIBRARY.find(x=>x.source==='original-p40')?.id||librarySelected;
  sentenceUiReset();return go('sentences');
 }
 if(name==='p36-toggle-model'){
  if(id!==selectedGrammarId()||!p36RepairFor(id))return;
  p36ShowModel=!p36ShowModel;
  if(p36ShowModel)p36ViewedModels.add(id);
  return render();
 }
 if(name==='p36-repair'){
  const idToOpen=p36RepairFor(id)?id:p36Next(state);
  const repair=p36RepairFor(idToOpen);
  if(!repair)return alertUser('Original P36 correction unavailable.','error');
  const index=SENTENCE_TASKS.findIndex(t=>t.id===repair.taskId);
  if(index<0)return alertUser('P36 correction is not available in the existing Workshop.','error');
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=p36ViewedModels.has(idToOpen);
  return go('workshop');
 }
 if(name==='p38-sentences'){
 librarySource='original-p38';libraryQuery='';libraryTopic='all';libraryArea='all';
 libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
 librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
 librarySelected=SENTENCE_LIBRARY.find(item=>item.source==='original-p38')?.id||librarySelected;
 sentenceUiReset();return go('sentences');
}
if(name==='p36-sentences'){
  librarySource='original-p36';libraryQuery='';libraryTopic='all';libraryArea='all';
  libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  librarySelected=SENTENCE_LIBRARY.find(s=>s.source==='original-p36')?.id||librarySelected;
  sentenceUiReset();return go('sentences');
 }
 if(name==='p32-repair'){
  const repair=p32RepairFor(id?.split(':').at(-1));
  if(!repair||repair.taskId!==id)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id===id);
  if(index<0)return;
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  return go('workshop');
 }
 if(name==='p32-open-sentences'){
  librarySource='original-p32';libraryQuery='';libraryTopic='all';libraryArea='all';
  libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  librarySelected=SENTENCE_LIBRARY.find(s=>s.source==='original-p32')?.id||librarySelected;
  sentenceUiReset();return go('sentences');
 }
 if(name==='p39-open'){
  if(!findP39Guide(id)||!findLesson(id))return;
  displayLessonId=id;p39CatalogOpen=true;
  if(route()==='learn'){render();root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;}
  go('learn');root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p39-browse'){
  p39CatalogOpen=true;
  if(route()!=='learn')go('learn');
  const el=root.querySelector('#p39-character-library');if(el){el.closest('details').open=true;el.scrollIntoView({block:'start'});}
  return;
 }
 if(name==='p39-vocab'){
  p39VocabOpen=true;
  if(route()!=='explore')go('explore');
  const el=root.querySelector('#p39-explore-vocabulary');if(el){el.open=true;el.scrollIntoView({block:'start'});}
  return;
 }
 if(name==='p39-theme'){
  const t=button.dataset.theme;if(t!=='all'&&!P39_THEMES.includes(t))return;
  p39Theme=t;p39Page=0;p39CatalogOpen=true;return render();
 }
 if(name==='p39-status'){
  const v=button.dataset.status;if(!['all','new','introduced'].includes(v))return;
  p39Status=v;p39Page=0;p39CatalogOpen=true;return render();
 }
 if(name==='p39-prev'||name==='p39-next'){
  const q=p39Query.trim().toLocaleLowerCase();
  const n=P39_CHARACTER_GUIDES.filter(g=>(p39Theme==='all'||g.category===p39Theme)&&
   (p39Status==='all'||(p39Status==='introduced'?(state.learned||[]).includes(g.id):!(state.learned||[]).includes(g.id)))&&
   (!q||[g.hanzi,g.pinyin,g.meaning,g.category,g.explanation,...g.words.flatMap(w=>[w.hanzi,w.pinyin,w.english])].join(' ').toLocaleLowerCase().includes(q))).length;
  p39Page=Math.max(0,Math.min(Math.max(0,Math.ceil(n/10)-1),p39Page+(name==='p39-next'?1:-1)));
  p39CatalogOpen=true;return render();
 }
 if(name==='p39-word-prev'||name==='p39-word-next'){
  p39VocabPage=Math.max(0,Math.min(Math.max(0,Math.ceil(P39_VOCABULARY.length/10)-1),
   p39VocabPage+(name==='p39-word-next'?1:-1)));
  if(route()==='explore')p39VocabOpen=true;else p39CatalogOpen=true;
  return render();
 }
 if(name==='p39-write'){
  const guide=findP39Guide(id),n=Number(button.dataset.index);
  if(!guide||![0,1].includes(n))return;
  const i=SENTENCE_TASKS.findIndex(t=>t.id==='p39:'+guide.id+':line'+(n+1));
  if(i<0)return alertUser('The P39 original writing task is unavailable.','error');
  sentenceIndex=i;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  return go('workshop');
 }
 if(name==='p39-sentences'){
  librarySource='original-p39';libraryQuery='';libraryTopic='all';libraryArea='all';
  libraryDifficulty='all';libraryGrammar='all';libraryPurpose='all';libraryTone='all';
  librarySavedOnly=false;libraryPage=0;libraryPracticeFocus=false;
  librarySelected=SENTENCE_LIBRARY.find(x=>x.source==='original-p39')?.id||librarySelected;
  sentenceUiReset();return go('sentences');
 }
 if(name==='p35-open-lesson'){
  if(!findP35Guide(id)||!findLesson(id))return;
  displayLessonId=id;
  if(route()==='learn'){render();root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;}
  go('learn');root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;
 }
 if(name==='p35-browse'){
  if(route()!=='learn')go('learn');
  const section=root.querySelector('.p35-course-details');if(section){p35CatalogOpen=true;section.open=true;section.scrollIntoView({block:'start'});}
  return;
 }
 if(name==='p35-vocab-open'){
  if(route()!=='explore')go('explore');
  const section=root.querySelector('#p35-explore-vocabulary');if(section){p35VocabOpen=true;section.open=true;section.scrollIntoView({block:'start'});}
  return;
 }
 if(name==='p35-theme'){
  const v=button.dataset.theme;if(v!=='all'&&!P35_THEMES.includes(v))return;
  p35Theme=v;p35CatalogOpen=true;p35Page=0;return render();
 }
 if(name==='p35-status'){
  const v=button.dataset.status;if(!['all','new','introduced'].includes(v))return;
  p35Status=v;p35CatalogOpen=true;p35Page=0;return render();
 }
 if(name==='p35-page-prev'||name==='p35-page-next'){
  const q=p35Query.toLocaleLowerCase().trim();
  const total=P35_CHARACTER_GUIDES.filter(g=>(p35Theme==='all'||g.category===p35Theme)&&
   (p35Status==='all'||(p35Status==='introduced'?(state.learned||[]).includes(g.id):!(state.learned||[]).includes(g.id)))&&
   (!q||[g.hanzi,g.pinyin,g.meaning,g.explanation,g.category,...g.words.flatMap(w=>[w.hanzi,w.pinyin,w.english])].join(' ').toLocaleLowerCase().includes(q))).length;
  p35CatalogOpen=true;p35Page=Math.max(0,Math.min(Math.max(0,Math.ceil(total/12)-1),p35Page+(name==='p35-page-next'?1:-1)));
  return render();
 }
 if(name==='p35-vocab-prev'||name==='p35-vocab-next'){
  if(route()==='explore')p35VocabOpen=true;else p35CatalogOpen=true;
  p35VocabPage=Math.max(0,Math.min(Math.max(0,Math.ceil(P35_VOCABULARY.length/12)-1),
   p35VocabPage+(name==='p35-vocab-next'?1:-1)));
  return render();
 }
 if(name==='p35-write'){
  const guide=findP35Guide(id),index=Number(button.dataset.index);
  if(!guide||![0,1,2].includes(index))return;
  const taskIndex=SENTENCE_TASKS.findIndex(t=>t.id==='p35:'+guide.id+':line'+(index+1));
  if(taskIndex<0)return alertUser('Original P35 writing lesson unavailable.','error');
  sentenceIndex=taskIndex;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;
  return go('workshop');
 }
 if(name==='p31-open-lesson'){
  if(!findP31Guide(id)||!findLesson(id))return;
  displayLessonId=id;
  if(route()==='learn'){render();root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return;}
  go('learn');return;
 }
 if(name==='p31-open-library'){
  p31Theme='all';p31Page=0;
  if(route()==='learn'){render();root.querySelector('#p31-course-library')?.scrollIntoView({block:'start'});return;}
  go('learn');root.querySelector('#p31-course-library')?.scrollIntoView({block:'start'});return;
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
  const mapped={characters:'open-lesson',words:'lookup-word',grammar:'grammar-select',sentences:'sentence-select',
    reading:'open-story-link',dialogues:'hub-dialogue',pathway:'pathway-select'};
  const target=mapped[kind];if(!target)return;
  return act({dataset:{action:target,id}});
 }
 if(name==='pathway-open'){const mission=pathwayResume(state);pathwaySelected=mission.id;return go('pathway');}
 if(name==='pathway-select'){if(findPathwayMission(id))openPathwayMission(id);return;}
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
 if(name==='pathway-workshop'){
  const m=findPathwayMission(pathwaySelection());if(!m)return;
  const index=SENTENCE_TASKS.findIndex(t=>t.id==='pathway:'+m.id+':production');if(index<0)return;
  sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return go('workshop');
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
 
 if(name==='sentence-select'){if(findLibrarySentence(id))openLibrarySentence(id);return;}
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
  libraryPage=Math.floor(index/18);openLibrarySentence(options[index].id);return;
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
 if(name==='grammar-select'){if(findGrammarLesson(id))openGrammarLesson(id);return;}
 if(name==='grammar-next'||name==='grammar-previous'){
  const next=nextGrammarLesson(selectedGrammarId(),name==='grammar-next'?1:-1);if(next)openGrammarLesson(next.id);return;
 }
 if(name==='grammar-chapter'){
  const chapter=GRAMMAR_CHAPTERS.find(c=>String(c.number)===String(button.dataset.chapter));if(!chapter)return;
  grammarChapter=String(chapter.number);openGrammarLesson(chapter.lessons[0]);return;
 }
 if(name==='grammar-mode'||name==='grammar-next-mode'){
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
  if(index>=0){sentenceIndex=index;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;}
  return go('workshop');
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
 if(name==='hub-lesson'){if(findLesson(id)){displayLessonId=id;return go('learn');}return;}
 if(name==='hub-dialogue'){if(findDialogue(id)){p37Turn=0;p37Branch=null;p37TranscriptViewed=false;p34ShadowLine=0;p34TranscriptViewed=false;dialogueId=id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;p33Branch=null;return go('dialogues');}return;}
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
 if(name==='workshop-next'){sentenceIndex++;sentenceTyped='';sentenceFeedback=null;sentenceSupport=false;return render();}
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
  const result=gradeMission(q,response),assisted=missionSupport||p34TranscriptViewed||p37TranscriptViewed||Boolean(findDialogue(dialogueId)?.p42&&p42ViewedTranscripts.has(findDialogue(dialogueId).p42.id))||name==='mission-reveal';const id=globalThis.crypto?.randomUUID?.()||`mission-${Date.now()}-${Math.random()}`;
  const ok=await mutate(s=>addMissionEvent(s,{id,dialogueId,step:missionStep,correct:result.correct,assisted}));if(ok){missionFeedback={...result,assisted};render();}return;
 }
 if(name==='sense-weak'){const best=senseRepairQueue(state)[0];if(best){senseIndex=best.index;senseFeedback=null;senseSupport=false;render();}return;}
 if(name==='open-dialogues')return go('dialogues');
 if(name==='open-wordbook-practice'){wordbookFeedback=null;wordbookTyped='';return go('wordbook');}
 if(name==='dialogue-support'){dialogueSupport=!dialogueSupport;if(dialogueSupport&&findDialogue(dialogueId)?.p42){p42TranscriptViewed=true;p42ViewedTranscripts.add(findDialogue(dialogueId).p42.id);}if(dialogueSupport&&findDialogue(dialogueId)?.p34)p34TranscriptViewed=true;if(dialogueSupport&&findDialogue(dialogueId)?.p37){p37TranscriptViewed=true;p37ViewedTranscripts.add(findDialogue(dialogueId).p37.id);}if(dialogueSupport&&missionActive)missionSupport=true;return render();}
 if(name==='dialogue-prev'||name==='dialogue-next-context'){p42Turn=0;p42TranscriptViewed=false;p37Turn=0;p37Branch=null;p37TranscriptViewed=false;location.hash='#/dialogues';p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;const step=name==='dialogue-prev'?-1:1;dialogueId=DIALOGUES[(DIALOGUES.findIndex(d=>d.id===dialogueId)+step+DIALOGUES.length)%DIALOGUES.length].id;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;missionActive=false;missionStep=0;missionFeedback=null;missionSupport=false;return render();}
 if(name==='dialogue-next'){p42Turn=0;p37Turn=0;p37Branch=null;p34ShadowLine=0;p33Branch=null;missionActive=false;missionFeedback=null;const d=findDialogue(dialogueId);if(dialogueStep+1<d.questions.length){dialogueStep++;}else{dialogueId=DIALOGUES[(DIALOGUES.findIndex(x=>x.id===dialogueId)+1)%DIALOGUES.length].id;dialogueStep=0;p34TranscriptViewed=false;p37TranscriptViewed=false;p42TranscriptViewed=false;location.hash='#/dialogues';}dialogueFeedback=null;dialogueSupport=false;return render();}
 if(name==='dialogue-retry'){dialogueFeedback=null;return render();}
 if(name==='dialogue-answer'||name==='dialogue-reveal'){
  if(dialogueFeedback)return;const q=dialogueQuestion(dialogueId,dialogueStep);if(!q)return;
  const assisted=dialogueSupport||p34TranscriptViewed||p37TranscriptViewed||Boolean(findDialogue(dialogueId)?.p42&&p42ViewedTranscripts.has(findDialogue(dialogueId).p42.id))||name==='dialogue-reveal',response=name==='dialogue-reveal'?'':button.dataset.option||'';
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
 if(name==='open-story-link'){const story=findStory(id);if(!story)return alertUser('Reading unavailable.','error');storyId=story.id;resetReadingNavigation();if(story.beginner)storyMode='beginner-detail';return go('stories');}
 if(name==='go-settings')return go('settings');
 if(name==='go-learn')return go('learn');
 if(name==='go-progress')return go('progress');
 if(name==='open-stories'){resetStoryExercise();return go('stories');}
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
 if(name==='story-next'){storyId=STORIES[(STORIES.findIndex(s=>s.id===storyId)+1)%STORIES.length].id;resetReadingNavigation();if(findStory(storyId)?.beginner)storyMode='beginner-detail';return render();}
 if(name==='story-focus-next'){const story=findStory(storyId);storyFocusIndex=(storyFocusIndex+1)%story.lines.length;if(storyParagraphOnly&&story.extended)storyParagraph=paragraphFor(story,storyFocusIndex);return render();}
 if(name==='story-help-line'){const i=Number(button.dataset.index);if(!Number.isInteger(i)||i<0||i>=findStory(storyId).lines.length)return;storyHelpIndex=storyHelpIndex===i?-1:i;if(storyHelpIndex!==-1)storyAssist=true;return render();}
 if(name==='story-focus-off'){storyFocusIndex=-1;return render();}
 if(name==='story-mode'){const mode=button.dataset.mode;if(!['comprehension','cloze','ordering','pronunciation',...CONTEXT_MODES,...DEEP_READING_MODES.map(item=>item[0]),...BEGINNER_MODES.map(item=>item[0])].includes(mode)||DEEP_READING_MODES.some(([id])=>id===mode)&&!findStory(storyId)?.extended||BEGINNER_MODES.some(([id])=>id===mode)&&!findStory(storyId)?.beginner)return;storyMode=mode;resetStoryExercise();return render();}
 if(name==='story-token'){const entry=tokenizeSentence(findStory(storyId).lines.map(l=>l.hanzi).join('')).find(t=>t.entry?.hanzi===button.dataset.token)?.entry;if(!entry)return;storyGlossary=entry;storyAssist=true;return render();}
 if(name==='story-linked'){displayLessonId=button.dataset.id;return go('learn');}
 if(name==='story-reveal'){storyShowTranslation=!storyShowTranslation;if(storyShowTranslation)storyAssist=true;return render();}
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
 if(name==='lookup-word'){const w=id?findWord(id):WORDS.find(w=>w.hanzi===button.dataset.word);if(w){searchSelection={type:'word',id:w.key};return go('explore');}return alertUser('Word not available in the indexed demo lessons.','error');}
 if(name==='review-begin'){sessionQueue=reviewPlan(state,{now:Date.now(),focus:reviewFocus,limit:reviewSize}).map(item=>item.id);sessionDone=0;sessionCorrect=0;sessionSkipped=0;revealed=false;activeReviewId=null;return render();}
 if(name==='review-restart'){sessionQueue=null;activeReviewId=null;return render();}
 if(name==='review-skip'){if(revealed||!sessionQueue?.length)return;sessionQueue.shift();sessionSkipped++;activeReviewId=null;typedAnswer='';chosenOption='';checkResult=null;return render();}
 if(name==='open-reader'){readerLessonId=findLesson(displayLessonId)?.id||DEMO_LESSONS[0].id;readerResult=null;showLessonTranslation=false;return go('reader');}
 if(name==='reader-next'){const idx=DEMO_LESSONS.findIndex(l=>l.id===readerLessonId);readerLessonId=DEMO_LESSONS[(idx+1)%DEMO_LESSONS.length].id;readerResult=null;showLessonTranslation=false;return render();}
 if(name==='reader-mode'){readerMode=button.dataset.mode==='cloze'?'cloze':'meaning';readerResult=null;showLessonTranslation=false;return render();}
 if(name==='reader-answer'){if(readerResult)return;const lesson=readerLesson(),cloze=makeCloze(lesson),answer=readerMode==='cloze'&&cloze?cloze.answer:lesson.sentence.english;readerResult={answer:button.dataset.option,correct:button.dataset.option===answer};return render();}
 if(name==='reader-reveal'){showLessonTranslation=!showLessonTranslation;return render();}
 if(name==='start-next'){const next=summary(state).next;if(next){displayLessonId=next.id;go('learn')}else go('review');return}
 if(name==='open-lesson'){if(!findLesson(id))return alertUser('Lesson unavailable.','error');displayLessonId=id;showLessonTranslation=state.settings.showPinyin;go('learn');return}
 if(name==='next-lesson'){const idx=DEMO_LESSONS.findIndex(l=>l.id===displayLessonId);displayLessonId=DEMO_LESSONS[(idx+1)%DEMO_LESSONS.length].id;showLessonTranslation=state.settings.showPinyin;render();root.querySelector('.lesson-paper')?.scrollIntoView({block:'start'});return}
 if(name==='mark-studied'){if(!findLesson(id))return;const ok=await mutate(s=>addLesson(s,id));if(ok){alertUser(`Lesson introduced. ${cardsForLesson(id).length} distinct recall targets were added.`);const idx=DEMO_LESSONS.findIndex(l=>l.id===id);if(idx<DEMO_LESSONS.length-1){displayLessonId=DEMO_LESSONS[idx+1].id;render();}}return}
 if(name==='toggle-translation'){showLessonTranslation=!showLessonTranslation;render();return}
 if(name==='start-review'){revealed=false;typedAnswer='';chosenOption='';checkResult=null;activeReviewId=null;sessionQueue=null;go('review');return}
 if(name==='review-pick'){chosenOption=button.dataset.option||'';render();root.querySelector('[data-action="review-pick"][aria-pressed="true"]')?.focus();return;}
 if(name==='submit-review'){if(revealed||!activeReviewId)return;const info=cardInfo(activeReviewId);const answer=info.kind==='choice'?chosenOption:typedAnswer;if(!answer.trim())return alertUser('Enter or select an answer before checking.','error');checkResult=info.kind==='pinyin'?toneExplanation(answer,info.answer):evaluateAnswer(answer,info.answer,info.kind);revealed=true;render();return;}
 if(name==='reveal-review'){checkResult={correct:false,reason:'assisted',message:'Answer revealed without independent recall.'};revealed=true;render();return}
 if(name==='grade'){if(!revealed||!activeReviewId)return;const c=activeReviewId,g=Number(button.dataset.grade);const eventId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;const ok=await mutate(s=>gradeCard(s,c,g,Date.now(),eventId,{correct:Boolean(checkResult?.correct),assisted:checkResult?.reason==='assisted',errorType:checkResult?.reason}));if(ok){sessionDone++;if(checkResult?.correct)sessionCorrect++;if(sessionQueue?.[0]===c)sessionQueue.shift();revealed=false;typedAnswer='';chosenOption='';checkResult=null;activeReviewId=null;render();}return}
 if(name==='speak')return speak(button.dataset.text||'');
 if(name==='select-explore'){const typ=button.dataset.type;searchSelection=typ==='word'&&findWord(id)?{type:'word',id}:typ==='character'&&findLesson(id)?{type:'character',id}:null;return render();}
 if(name==='export'){try{validateState(state);const content=JSON.stringify(backupDocument(state),null,2);const blob=new Blob([content],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`character-study-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);alertUser('Backup export started. Confirm the file was saved on your device.');}catch(e){alertUser(`Backup failed: ${e.message}`,'error')}return}
 if(name==='import-open')return $('import-file')?.click();
 if(name==='reset'){if(!confirm('Delete all demo learning progress in this browser? Export a backup first if you want to keep it.'))return;const cleared=await mutate(_=>freshState());if(cleared){pendingRestore=null;restoreAcknowledgement='';}return}
}
document.querySelector('.topbar')?.addEventListener('click',ev=>{if(ev.target.closest('[data-action="go-settings"]'))go('settings')});
root.addEventListener('toggle',ev=>{
 if(ev.target.id==='p39-explore-vocabulary')p39VocabOpen=ev.target.open;
 else if(ev.target.matches?.('.p39-course-details')&&route()==='learn')p39CatalogOpen=ev.target.open;
 else if(ev.target.id==='p35-explore-vocabulary')p35VocabOpen=ev.target.open;
 else if(ev.target.matches?.('.p35-course-details')&&route()==='learn')p35CatalogOpen=ev.target.open;
},true);
root.addEventListener('click',ev=>{const b=ev.target.closest('[data-action]');if(b){ev.preventDefault();void act(b);}});
root.addEventListener('input',e=>{
 if(e.target.id==='p55-search'){
  p55Query=e.target.value;render();const field=root.querySelector('#p55-search');
  if(field){field.focus();field.setSelectionRange(p55Query.length,p55Query.length);}return;
 }
 if(e.target.id==='p54-search'){
   p54Query=e.target.value;render();const el=root.querySelector('#p54-search');
   if(el){el.focus();el.setSelectionRange(p54Query.length,p54Query.length);}return;
  }
  if(e.target.id==='p53-search'){
   p53Query=e.target.value;render();const el=root.querySelector('#p53-search');
   if(el){el.focus();el.setSelectionRange(p53Query.length,p53Query.length);}return;
  }
  if(e.target.id==='p52-search'){
   p52Query=e.target.value;render();const el=root.querySelector('#p52-search');
   if(el){el.focus();el.setSelectionRange(p52Query.length,p52Query.length);}return;
  }
  if(e.target.id==='p51-search'){
  p51Query=e.target.value;render();
  const el=root.querySelector('#p51-search');
  if(el){el.focus();el.setSelectionRange(p51Query.length,p51Query.length);}
  return;
 }
 if(e.target.id==='p50-search'){
  p50Query=e.target.value;render();
  const el=root.querySelector('#p50-search');
  if(el){el.focus();el.setSelectionRange(p50Query.length,p50Query.length);}
  return;
 }
 if(e.target.id==='p48-search'){
  p48Query=e.target.value;render();
  const field=root.querySelector('#p48-search');
  if(field){field.focus();field.setSelectionRange(p48Query.length,p48Query.length);}
  return;
 }
 if(e.target.id==='p47-search'){
  p47Query=e.target.value;render();
  const el=root.querySelector('#p47-search');
  if(el){el.focus();el.setSelectionRange(p47Query.length,p47Query.length);}
  return;
 }
 if(e.target.id==='p46-search'){
  p46Query=e.target.value;render();
  const field=root.querySelector('#p46-search');
  if(field){field.focus();field.setSelectionRange(p46Query.length,p46Query.length);}
  return;
 }
 if(e.target.id==='p44-search'){
  p44Query=e.target.value;p44Page=0;render();
  const el=root.querySelector('#p44-search');
  if(el){el.focus();el.setSelectionRange(p44Query.length,p44Query.length);}
  return;
 }
 if(e.target.id==='p43-draft'){
  p43Draft=e.target.value;
  if(p43Reviewed.length){
   p43Reviewed=[];
   for(const b of root.querySelectorAll('[data-action="p43-criterion"]')){
    b.classList.remove('checked');b.setAttribute('aria-checked','false');
    const marker=b.querySelector('.p43-check');if(marker)marker.textContent='○';
   }
  }
  const count=Array.from(p43Draft).filter(ch=>/\p{Script=Han}/u.test(ch)).length;
  const label=root.querySelector('.p43-draft-status span');
  if(label)label.textContent=count+' Hanzi characters · in-tab draft only';
  for(const b of root.querySelectorAll('[data-action="p43-save"],[data-action="p43-copy"]'))b.disabled=!p43Draft.trim();
  return;
 }
 if(e.target.id==='p43-search'){
  p43Query=e.target.value;render();
  const field=root.querySelector('#p43-search');
  if(field){field.focus();field.setSelectionRange(p43Query.length,p43Query.length);}
  return;
 }
 if(e.target.id==='p41-search'){
  p41Query=e.target.value;p41Page=0;p41BrowseOpen=true;render();
  const input=root.querySelector('#p41-search');
  if(input){input.focus();input.setSelectionRange(p41Query.length,p41Query.length);}
  return;
 }
 if(e.target.id==='p38-search'){
  p38Query=e.target.value;p38Page=0;p38BrowseOpen=true;render();
  const input=root.querySelector('#p38-search');if(input){input.focus();input.setSelectionRange(p38Query.length,p38Query.length);}
  return;
 }
 if(e.target.id==='p42-search'){
  p42Query=e.target.value;p42Page=0;p42BrowseOpen=true;render();
  const input=root.querySelector('#p42-search');
  if(input){input.focus();input.setSelectionRange(p42Query.length,p42Query.length);}
  return;
 }
 if(e.target.id==='p37-search'){
  p37Query=e.target.value;p37Page=0;p37BrowseOpen=true;render();
  const input=root.querySelector('#p37-search');if(input){input.focus();input.setSelectionRange(p37Query.length,p37Query.length);}
  return;
 }
 if(e.target.id==='p39-search'){
  p39Query=e.target.value;p39Page=0;p39CatalogOpen=true;render();
  const field=root.querySelector('#p39-search');if(field){field.focus();field.setSelectionRange(p39Query.length,p39Query.length);}
  return;
 }
 if(e.target.id==='p35-search'){
  p35Query=e.target.value;p35CatalogOpen=true;p35Page=0;render();
  const field=root.querySelector('#p35-search');
  if(field){field.focus();field.setSelectionRange(p35Query.length,p35Query.length);}
  return;
 }
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
 return;
}if(e.target.id==='pathway-write'){pathwayTyped=e.target.value;const b=root.querySelector('[data-action="pathway-answer"]');if(b)b.disabled=!pathwayTyped.trim();return;}if(e.target.id==='restore-ack'){restoreAcknowledgement=e.target.value;const b=root.querySelector('[data-action="restore-confirm"]');if(b)b.disabled=!restoreRequiresAcknowledgement(pendingRestore?.preview,restoreAcknowledgement);return;}if(e.target.id==='fluency-entry'){fluencyTyped=e.target.value;const b=root.querySelector('[data-action="fluency-answer"]');if(b)b.disabled=!fluencyTyped.trim();return;}if(e.target.id==='trail-entry'){trailTyped=e.target.value;const b=root.querySelector('[data-action="trail-answer"]');if(b)b.disabled=!trailTyped.trim();return;}if(e.target.id==='block-entry'){blockTyped=e.target.value;const b=root.querySelector('[data-action="block-answer"]');if(b)b.disabled=!blockTyped.trim();return;}if(e.target.id==='ladder-entry'){ladderTyped=e.target.value;const b=root.querySelector('[data-action="ladder-answer"]');if(b)b.disabled=!ladderTyped.trim();return;}if(e.target.id==='repair-entry'){repairTyped=e.target.value;const b=root.querySelector('[data-action="repair-answer"]');if(b)b.disabled=!repairTyped.trim();return;}if(e.target.id==='course-entry'){courseTyped=e.target.value;const b=root.querySelector('[data-action="course-answer"]');if(b)b.disabled=!courseTyped.trim();return;}if(e.target.id==='mission-entry'){missionTyped=e.target.value;const b=root.querySelector('[data-action="mission-answer"]');if(b)b.disabled=!missionTyped.trim();return;}if(e.target.id==='workshop-entry'){sentenceTyped=e.target.value;const b=root.querySelector('[data-action="workshop-check"]');if(b)b.disabled=!sentenceTyped.trim();return;}if(e.target.id==='lesson-check-entry'){lessonCheckpoint.response=e.target.value;const b=root.querySelector('[data-action="lesson-check-submit"]');if(b)b.disabled=!lessonCheckpoint.response.trim();return;}if(e.target.id==='sentence-library-entry'){
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
root.addEventListener('change',async e=>{if(e.target.id==='p30-saved'){p30Saved=e.target.checked;p30Page=0;return render();}

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
if(e.target.id==='grammar-chapter-select'){const chapter=GRAMMAR_CHAPTERS.find(c=>String(c.number)===e.target.value);if(!chapter){grammarChapter='all';return render();}grammarChapter=e.target.value;openGrammarLesson(chapter.lessons[0]);return;}if(e.target.id==='pinyin-filter'){pinyinFilter=e.target.value;pinyinIndex=0;pinyinFeedback=null;pinyinTyped='';render();return;}if(e.target.id==='wordbook-mode'){if(WORD_PRACTICE_MODES.includes(e.target.value)&&!state.vocabularyJourney){wordbookMode=e.target.value;wordbookFeedback=null;wordbookTyped='';render();}return;}if(e.target.id==='wordbook-focus'){wordbookFocus=e.target.value;wordbookIndex=0;wordbookFeedback=null;wordbookTyped='';render();return;}if(e.target.id==='dialogue-choice'){if(findDialogue(e.target.value)){p42Turn=0;p42TranscriptViewed=p42ViewedTranscripts.has(findDialogue(e.target.value)?.p42?.id);p37Turn=0;p37Branch=null;p37TranscriptViewed=false;location.hash='#/dialogues';p34ShadowLine=0;p34TranscriptViewed=false;p33Branch=null;dialogueId=e.target.value;dialogueStep=0;dialogueSupport=false;dialogueFeedback=null;missionActive=false;missionStep=0;missionFeedback=null;render();}return;}if(e.target.id==='guided-size'){guidedLimit=Number(e.target.value);return;}if(e.target.id==='guided-focus'){guidedFocus=e.target.value;return;} if(e.target.id==='drill-lesson'){if(findLesson(e.target.value)){drillLessonId=e.target.value;resetDrill();render();}return;}if(e.target.id==='review-focus'){reviewFocus=e.target.value;return render();}if(e.target.id==='review-size'){reviewSize=Number(e.target.value);return render();}if(e.target.id==='story-choice'){if(findStory(e.target.value)){storyId=e.target.value;resetReadingNavigation();if(findStory(storyId)?.beginner)storyMode='beginner-detail';render();}return;}if(e.target.id==='reader-lesson'){readerLessonId=e.target.value;readerResult=null;showLessonTranslation=false;render();return;}
 if(e.target.id==='import-file'&&e.target.files?.length){if(!db)return;try{const file=e.target.files[0];if(file.size>MAX_BACKUP_BYTES)throw new Error('Backup exceeds 8 MB size limit');const doc=JSON.parse(await file.text());const inspected=previewBackup(doc,state,{bytes:file.size});pendingRestore={learner:importBackup(doc),preview:inspected};restoreAcknowledgement='';e.target.value='';go('settings');render();alertUser('Backup validated. Review the comparison below before choosing to replace any learner data.');}catch(err){pendingRestore=null;restoreAcknowledgement='';alertUser(`Import rejected: ${err.message}`,'error')}}
});
document.addEventListener('keydown',e=>{if(route()==='sentences'&&e.code==='Enter'&&e.ctrlKey&&e.target.id==='sentence-library-entry'){
 e.preventDefault();const button=root.querySelector('[data-action="sentence-answer"]');if(button&&!button.disabled)void act(button);return;
}if(route()==='grammar'&&e.code==='Enter'&&e.target.id==='grammar-entry'&&e.ctrlKey){e.preventDefault();const button=root.querySelector('[data-action="grammar-answer"]');if(button&&!button.disabled)void act(button);return;}if(route()==='pinyin'&&e.code==='Enter'&&e.target.id==='pinyin-answer-entry'){e.preventDefault();const button=root.querySelector('[data-action="pinyin-answer"]');if(button&&!button.disabled)void act(button);return;}if(route()==='fluency'&&e.code==='Enter'&&e.target.id==='fluency-entry'){e.preventDefault();const b=root.querySelector('[data-action="fluency-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='block'&&e.code==='Enter'&&e.target.id==='trail-entry'){e.preventDefault();const b=root.querySelector('[data-action="trail-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='block'&&e.code==='Enter'&&e.target.id==='block-entry'){e.preventDefault();const b=root.querySelector('[data-action="block-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='ladder'&&e.code==='Enter'&&e.target.id==='ladder-entry'){e.preventDefault();const b=root.querySelector('[data-action="ladder-answer"]');if(b&&!b.disabled)void act(b);return;}if(route()==='journey'&&e.code==='Enter'&&e.target.id==='repair-entry'){e.preventDefault();const btn=root.querySelector('[data-action="repair-answer"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()==='journey'&&e.code==='Enter'&&e.target.id==='course-entry'){e.preventDefault();const btn=root.querySelector('[data-action="course-answer"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()==='learn'&&e.code==='Enter'&&e.target.id==='lesson-check-entry'){e.preventDefault();const btn=root.querySelector('[data-action="lesson-check-submit"]');if(btn&&!btn.disabled)void act(btn);return;}if(route()!=='review'||e.altKey||e.ctrlKey||e.metaKey||e.isComposing)return;
 const editing=e.target.closest('input,textarea,select,[contenteditable]');
 if(!revealed&&e.code==='Enter'&&e.target.id==='review-entry'){e.preventDefault();const btn=root.querySelector('[data-action="submit-review"]');if(btn&&!btn.disabled)void act(btn);return;}
 if(editing)return;
 if(!revealed&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){
  const btn=[...root.querySelectorAll('[data-action="review-pick"]')][Number(e.code.slice(-1))-1];if(btn){e.preventDefault();void act(btn)}return;}
 if(!revealed&&e.code==='Enter'){const btn=root.querySelector('[data-action="submit-review"]');if(btn&&!btn.disabled){e.preventDefault();void act(btn)}return;}
 if(!revealed&&e.code==='KeyS'){const btn=root.querySelector('[data-action="review-skip"]');if(btn){e.preventDefault();void act(btn)}return;}
 if(revealed&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){e.preventDefault();const btn=root.querySelector(`[data-action="grade"][data-grade="${Number(e.code.slice(-1))-1}"]`);if(btn)void act(btn)}
});
window.addEventListener('hashchange',()=>{revealed=false;typedAnswer='';chosenOption='';checkResult=null;render();window.scrollTo(0,0);$('main').focus({preventScroll:true})});
window.addEventListener('online',networkLabel);window.addEventListener('offline',networkLabel);
function networkLabel(){$('network-state').textContent=navigator.onLine?'Local data · Online':'Local data · Offline'}
async function setupSW(){if(!('serviceWorker'in navigator)||location.protocol==='file:')return;try{await navigator.serviceWorker.register('./sw.js',{scope:'./'});}catch(e){console.warn('Offline shell unavailable',e)}}
async function init(){networkLabel();if('BroadcastChannel'in window){channel=new BroadcastChannel('character-study-v2');channel.onmessage=async()=>{if(db){try{state=await readState(db);render()}catch(e){alertUser(`State refresh failed: ${e.message}`,'error')}}};}
 try{db=await openDatabase();state=await readState(db);validateState(state);const migration=upgradedState(state);if(migration)state=await updateState(db,_=>migration);render();}catch(e){storageError=e;render();alertUser(`Local storage unavailable: ${e.message}. The app is read-only until storage works.`,'error');}
 void setupSW();}
init();
