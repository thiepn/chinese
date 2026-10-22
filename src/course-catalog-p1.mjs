/** P1: read-only course projection over canonical original learning authorities.
 * Never writes learner state, creates a second scheduler, or assigns HSK credit.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {lessonGroups} from './study-groups.mjs';
import {WORDS,canonicalWordKey} from './lexicon.mjs';
import {HSK_TARGETS,hskTargetLessons,hskTargetPractice,hskTargetWords} from './hsk-targets-c9.mjs';

export const P1_ROUTE_MIGRATION=Object.freeze([
 ['today','home','Home / continue','src/home-c9.mjs'],
 ['learn','course','Course / level → unit → lesson','src/learn-hub-c9.mjs'],
 ['review','review','Review / due queue','src/review-practice-c9.mjs'],
 ['explore','course','Course / word discovery','src/libraries-c9.mjs'],
 ['progress','me','Me / progress','src/utilities-c9.mjs'],
 ['settings','me','Me / settings and recovery','src/utilities-c9.mjs'],
 ['character','course','Course / lesson / character','src/character-c9.mjs'],
 ['reader','course','Course / reading / character reader','src/media-c9.mjs'],
 ['stories','course','Course / reading','src/media-c9.mjs'],
 ['practice','course','Course / practice','src/review-practice-c9.mjs'],
 ['dialogues','course','Course / listening and dialogues','src/media-c9.mjs'],
 ['wordbook','course','Course / vocabulary / saved words','src/wordbook-lab.mjs'],
 ['senses','course','Course / vocabulary / meanings','src/sense-lab.mjs'],
 ['workshop','course','Course / sentences / writing','src/sentence-workshop.mjs'],
 ['journey','course','Course / guided lesson','src/course-journey.mjs'],
 ['ladder','course','Course / sentence construction','src/sentence-ladder.mjs'],
 ['block','course','Course / study block','src/study-block.mjs'],
 ['fluency','course','Course / applied practice','src/fluency-studio.mjs'],
 ['plan','home','Home / study plan','src/daily-plan.mjs'],
 ['pinyin','course','Course / pronunciation','src/pinyin-screen.mjs'],
 ['grammar','course','Course / grammar','src/grammar-screen.mjs'],
 ['sentences','course','Course / sentences','src/sentence-screen.mjs'],
 ['pathway','course','Course / applied missions','src/pathway-course.mjs'],
 ['find','course','Course / search','src/workspace-p30.mjs'],
 ['advanced','course','Course / advanced texts','src/advanced-c9.mjs'],
 ['writing','course','Course / writing','src/writing-c9.mjs'],
 ['skills','course','Course / skill tracks','src/skills-c9.mjs']
].map(([route,destination,location,owner])=>Object.freeze({route,destination,location,owner,legacyHash:'#/'+route})));

export const P1_AUTHORITIES=Object.freeze([
 ['introducedLessons','src/study.mjs','learned, introductions','explicit addLesson; not lesson views'],
 ['scheduledRecall','src/study.mjs','cards, events','gradeCard / dueCards'],
 ['learnerPersistence','src/study-storage.mjs','IndexedDB character-study-local-v2/learner/state','transactional revision / validateState'],
 ['backupRestore','src/study-storage.mjs; src/backup-preview.mjs','character-study-demo-backup v1','explicit replacement, preview, expectedRevision'],
 ['courseJourney','src/course-journey.mjs; src/course-continuation.mjs','courseJourney, courseEvents, courseRepairSession, courseRepairEvents','native guided stages'],
 ['vocabulary','src/wordbook-lab.mjs; src/practice-records.mjs','vocabularyIntroduced, wordPracticeEvents, bookmarkedWords','existing wordbook events'],
 ['grammarAndSentence','src/grammar-course.mjs; src/sentence-workshop.mjs','sentenceEvents','native task IDs and answer evaluation'],
 ['reading','src/stories.mjs; src/reader-records.mjs','readingEvents, bookmarkedStories','native reading records'],
 ['dialogue','src/dialogues.mjs','dialogueEvents','native dialogue records'],
 ['practice','src/drills.mjs; src/practice-records.mjs','practiceSession, drillEvents','existing practice events'],
 ['writing','src/writing-c9.mjs; src/p43-course.mjs','private tab-local draft; P43 authoring','do not duplicate or upload'],
 ['placement','src/placement.mjs','placement','suggestions not certifications'],
 ['advancedMissions','src/pathway-course.mjs; src/dialogue-missions.mjs','sentenceEvents, missionEvents','native IDs, no HSK credits'],
 ['skillTracks','src/skills-c9.mjs','existing exercise events','read-only native handoff'],
 ['studyBlocks','src/study-block.mjs; src/context-trail.mjs','studyBlock, studyBlockEvents, blockTrail, blockTrailEvents','native checkpoints'],
 ['fluency','src/fluency-studio.mjs','fluencySession, fluencyEvents, fluencyCompletions','native practice'],
 ['plans','src/daily-plan.mjs','dailyPlan, mistakePins','no autonomous scheduler'],
 ['offline','src/sw.js; scripts/build.mjs; scripts/verify.mjs','versioned service-worker cache','no P1 cache revision; module not a runtime dependency']
].map(([system,owner,stateKeys,contract])=>Object.freeze({system,owner,stateKeys,contract})));

export const P1_SOURCE_FAMILIES=Object.freeze([
 ['original-characters','src/demo-lessons.mjs; src/study-groups.mjs','1–5','original authored demonstration'],
 ['foundations','src/foundational-expansion.mjs; src/p31-*; src/p32-*; src/p33-*; src/p34-*','1','original difficulty grouping'],
 ['elementary','src/p35-*; src/p36-*; src/p37-*; src/p38-*','2','original difficulty grouping'],
 ['intermediate','src/p39-*; src/p40-*; src/p41-*; src/p42-*; src/p43-*; src/p44-*; src/p45-*','3','original difficulty grouping'],
 ['upper-intermediate','src/p46-*; src/p47-*; src/p48-*; src/p49-*','4','original difficulty grouping'],
 ['advanced-bridge','src/p50-*; src/p51-*','5','original difficulty grouping'],
 ['advanced-readings','src/p68-*; src/p71-*','6','original advanced material; not full HSK 6'],
 ['advanced-dialogues','src/p75-*; src/p76-*; src/p77-*','6;7-9','original advanced material; not full HSK 7–9'],
 ['missions','src/pathway-course.mjs; src/pathway-data-*.mjs','6;7-9','original mission bands, not HSK membership'],
 ['lexical-index','src/lexicon.mjs; src/vocabulary-expansion.mjs','1–5','canonical word keys; not official numbered entries'],
 ['grammar','src/grammar-course.mjs; src/grammar-course-data-*.mjs','1–5','original source ranges, not official grammar mapping'],
 ['sentences','src/sentence-library.mjs; src/sentence-corpus-*.mjs','multiple','original sentence content, not official item membership'],
 ['reading','src/stories.mjs; src/connected-reading-*.mjs; src/beginner-reading-*.mjs','1–6','original passages'],
 ['dialogues','src/dialogues.mjs; src/p*-dialogues*.mjs','1–6','scripted dialogues; device TTS not native recordings'],
 ['phonology','src/pinyin-foundations.mjs; src/pinyin-syllables.mjs; src/tone-coach.mjs','multiple','original pronunciation teaching'],
 ['assessment','src/exercises.mjs; src/drills.mjs; src/placement.mjs','multiple','native exercises, not verified exam tasks']
].map(([family,owner,targets,classification])=>Object.freeze({family,owner,targets,classification,rights:'ORIGINAL_DEMO_EDITORIAL_REVIEW_REQUIRED',officialMembership:'NOT_VERIFIED'})));

const OFFICIAL_NEW=Object.freeze({'1':300,'2':200,'3':500,'4':1000,'5':1600,'6':1800,'7-9':5600});
const ref=(kind,item,action)=>Object.freeze({kind,id:item.id,action,route:kind==='grammar'?'grammar':kind==='reading'?'stories':kind==='dialogue'?'dialogues':'pathway'});
const shelf=(kind,items,action)=>Object.freeze({kind,items:Object.freeze(items.map(item=>ref(kind,item,action)))});
/** Source-only hierarchy. No state parameter, mutation, course grade or new content record. */
export function buildP1CourseCatalog(){
 const groups=lessonGroups();
 const observed=new Set();
 return Object.freeze(HSK_TARGETS.map(target=>{
  const id=target.id,lessons=hskTargetLessons(id),lessonIds=new Set(lessons.map(l=>l.id));
  const words=hskTargetWords(id),practice=hskTargetPractice(id);
  const units=groups.map(group=>{
   const selected=group.lessons.filter(lesson=>lessonIds.has(lesson.id));
   if(!selected.length)return null;
   return Object.freeze({
    id:'original-unit-'+group.index,originalGroupIndex:group.index,title:group.name,
    lessons:Object.freeze(selected.map(lesson=>{
     if(observed.has(lesson.id))throw Error('Original lesson assigned to multiple HSK targets or units: '+lesson.id);
     observed.add(lesson.id);
     const vocabularyKeys=words.filter(word=>Array.isArray(word.lessonIds)&&word.lessonIds.includes(lesson.id)).map(word=>word.key);
     return Object.freeze({
      sourceId:lesson.id,originalOrder:lesson.order,hanzi:lesson.hanzi,pinyin:lesson.pinyin,meaning:lesson.meaning,
      officialHskMembership:'NOT_VERIFIED',nativeLessonAction:'c9-lesson-open',
      nativeLessonRoute:'learn',nativeVocabularyAction:'vocabulary-start',
      vocabularyKeys:Object.freeze(vocabularyKeys),
      sentenceStage:lesson.sentence?.hanzi?'context':null
     });
    }))
   });
  }).filter(Boolean);
  const sourceShelves=Object.freeze([
   shelf('grammar',practice.grammar,'grammar-select'),
   shelf('reading',practice.readings,'c9-media-open-story'),
   shelf('dialogue',practice.dialogues,'c9-media-open-dialogue'),
   shelf('mission',practice.missions,'pathway-select')
  ]);
  return Object.freeze({
   targetId:id,title:target.name,focus:target.focus,sourceClassification:'PROVISIONAL_ORIGINAL_DIFFICULTY',
   officialSyllabusMembership:'NOT_VERIFIED',
   units:Object.freeze(units),sourceShelves,
   vocabularyKeys:Object.freeze(words.map(word=>word.key)),
   unsequencedSources:!units.length&&sourceShelves.some(row=>row.items.length),
   noPublishedCourseLessons:units.length===0
  });
 }));
}
/** Coverage numbers are original source counts, never an official syllabus intersection. */
export function buildP1CoverageMatrix(catalog=buildP1CourseCatalog()){
 const indexed=new Set(WORDS.map(w=>w.key));
 let cumulative=0;
 return Object.freeze(catalog.map(level=>{
  const id=level.targetId;
  cumulative+=OFFICIAL_NEW[id];
  const lessonIds=new Set(level.units.flatMap(u=>u.lessons.map(l=>l.sourceId)));
  const lessons=DEMO_LESSONS.filter(l=>lessonIds.has(l.id));
  const keys=new Set(lessons.flatMap(l=>(l.words||[]).map(w=>canonicalWordKey(w.hanzi,w.pinyin))));
  const sources=Object.fromEntries(level.sourceShelves.map(s=>[s.kind,s.items.length]));
  return Object.freeze({
   target:level.title,targetId:id,officialNewVocabularyBenchmark:OFFICIAL_NEW[id],
   officialCumulativeVocabularyBenchmark:cumulative,
   originalCharacterLessons:lessons.length,
   originalIndexedWordKeysFromLessons:[...keys].filter(k=>indexed.has(k)).length,
   originalWordbookKeysLinkedToTarget:level.vocabularyKeys.length,
   originalGrammarLessons:sources.grammar,originalReadings:sources.reading,
   originalScriptedDialogues:sources.dialogue,originalAdvancedMissions:sources.mission,
   originalSequencedUnits:level.units.length,
   officialVocabularyMapping:'NOT_VERIFIED',officialCharacterMapping:'NOT_VERIFIED',
   officialGrammarMapping:'NOT_VERIFIED',officialTaskSkillMapping:'NOT_VERIFIED',
   contentRights:'ORIGINAL_DEMO_EDITORIAL_REVIEW_REQUIRED',
   nativeAudio:'DEVICE_TTS_ONLY',fullCourseClaim:false
  });
 }));
}
export function buildP1Inventory(){
 const course=buildP1CourseCatalog();
 return {schemaVersion:1,inventoryKind:'COURSE_FIRST_P1_SOURCE_ONLY',
  syllabusReference:'CLEC HSK examination syllabus published 2025-11, edition verification/rights required',
  warning:'HSK numbers are target difficulty only. No verified official syllabus-item matches or certification.',
  authorities:P1_AUTHORITIES,sourceFamilies:P1_SOURCE_FAMILIES,routeMigration:P1_ROUTE_MIGRATION,
  coverage:buildP1CoverageMatrix(course),course};
}
