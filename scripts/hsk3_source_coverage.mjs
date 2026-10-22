/** Source-only HSK target inventory: never an official item-by-item coverage match.
 * Reference: CLEC 2025-11 HSK examination syllabus; metadata counts only.
 * RIGHTS: No official syllabus entries or third-party transcriptions bundled.
 */
import {HSK_TARGETS,hskTargetLessons,hskTargetPractice} from '../src/hsk-targets-c9.mjs';
import {WORDS,canonicalWordKey} from '../src/lexicon.mjs';
const newItems=Object.freeze({'1':300,'2':200,'3':500,'4':1000,'5':1600,'6':1800,'7-9':5600});
const keys=new Set(WORDS.map(w=>w.key));
let cumulative=0;
const rows=HSK_TARGETS.map(target=>{
 cumulative+=newItems[target.id];
 const l=hskTargetLessons(target.id),p=hskTargetPractice(target.id);
 const authored=new Set(l.flatMap(x=>x.words.map(w=>canonicalWordKey(w.hanzi,w.pinyin))));
 const indexed=[...authored].filter(k=>keys.has(k)).length;
 return {
  target:target.name,officialNewVocabularyEntries:newItems[target.id],officialCumulativeEntries:cumulative,
  originalCharacterLessons:l.length,originalIndexedWordKeysFromThoseLessons:indexed,
  originalGrammarLessons:p.grammar.length,originalReaderPassages:p.readings.length,
  originalDialogueSources:p.dialogues.length,originalAdvancedMissions:p.missions.length,
  officialVocabularyCoverage:'NOT_VERIFIED',officialCharacterCoverage:'NOT_VERIFIED',
  officialGrammarCoverage:'NOT_VERIFIED',officialListeningReadingTaskCoverage:'NOT_VERIFIED'
 };
});
if(rows.length!==7||cumulative!==11000)throw Error('Official benchmark metadata changed');
console.log('HSK3_ORIGINAL_SOURCE_COVERAGE='+JSON.stringify(rows));
