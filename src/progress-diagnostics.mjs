/** Evidence-based study diagnostics. Never labels a learner mastered or assigns official level. */
import {lessonPath,unitOverview} from './pathways.mjs';
import {dialogueSummary} from './dialogues.mjs';
import {wordbookStats} from './wordbook-lab.mjs';
import {senseStats} from './sense-lab.mjs';
import {sentenceStats} from './sentence-workshop.mjs';
import {missionStats} from './dialogue-missions.mjs';
export function progressDiagnostics(state,now=Date.now()){
 const oneWeek=7*86400000,cutoff=now-oneWeek;const streams=[['Scheduled reviews',state.events||[]],['Extra drills',state.drillEvents||[]],['Connected reading',state.readingEvents||[]],['Dialogues',state.dialogueEvents||[]],['Saved-word practice',state.wordPracticeEvents||[]]];
 const sources=streams.map(([name,events])=>{const recent=events.filter(e=>e.at>=cutoff&&e.at<=now);return {name,all:events.length,recent:recent.length,independent:recent.filter(e=>e.correct&&!e.assisted).length,assisted:recent.filter(e=>e.assisted).length};});
 const extras=[['Contextual senses',state.senseEvents||[]],['Sentence writing',state.sentenceEvents||[]],['Dialogue missions',state.missionEvents||[]]].map(([name,events])=>{const recent=events.filter(e=>e.at>=cutoff&&e.at<=now);return {name,all:events.length,recent:recent.length,independent:recent.filter(e=>e.correct&&!e.assisted).length,assisted:recent.filter(e=>e.assisted).length};});
 return {extras,senses:senseStats(state),sentences:sentenceStats(state),missions:missionStats(state),sources,units:unitOverview(state),path:lessonPath(state,{limit:4}),dialogues:dialogueSummary(state),wordbook:wordbookStats(state),independentRecent:sources.reduce((n,s)=>n+s.independent,0),totalRecent:sources.reduce((n,s)=>n+s.recent,0)};
}
