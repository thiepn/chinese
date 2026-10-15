import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEMO_LESSONS} from '../src/demo-lessons.mjs';
import {STORIES,tokenizeSentence} from '../src/stories.mjs';
import {WORDS,findWord} from '../src/lexicon.mjs';
import {freshState,addLesson,gradeCard,validateState} from '../src/study.mjs';
import {CONTEXT_MODES,contextQuestion,validateContextQuestions,lessonConnections,recentRemediation} from '../src/context-lab.mjs';
import {READING_MODES,addReadingEvent} from '../src/reader-records.mjs';
import {toggleWordBookmark,bookmarkedVocabulary,addDrillRecord} from '../src/practice-records.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {createGuidedSession,guidedQuestion,recordGuidedAnswer,advanceGuidedSession} from '../src/guided-session.mjs';
const now=Date.parse('2026-10-12T12:00:00Z');

test('previous complete demonstrator curriculum is unchanged, synthetic rights gates still apply',()=>{
 assert.ok(DEMO_LESSONS.length>=74);assert.ok(STORIES.length>=12);
 assert.ok(DEMO_LESSONS.slice(0,74).every(l=>l.words.length===2&&l.approval==='DEMO_ONLY'&&l.officialHskLevel===null));
 assert.ok(STORIES.every(s=>s.approval==='DEMO_ONLY'&&s.officialHskLevel===null));
});
test('contextual exercises are complete for all stories and never use an unattested external syllabus',()=>{
 assert.equal(validateContextQuestions(),true);assert.deepEqual(CONTEXT_MODES,['evidence','connection']);
 for(const s of STORIES){for(const m of CONTEXT_MODES){const q=contextQuestion(s.id,m);
   assert.equal(q.kind,'choice');assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);
   assert.ok(q.explanation);if(m==='evidence')assert.ok(s.lines.some(l=>l.hanzi===q.answer));}}
 assert.equal(contextQuestion('story-missing','evidence'),null);assert.equal(contextQuestion(STORIES[0].id,'unavailable'),null);
});
test('all context exercise modes can be recorded independently of scheduler history',()=>{
 for(const m of CONTEXT_MODES){let state=freshState();state.practiceSession={id:`context-${m}`,limit:5,items:Array.from({length:5},()=>({type:'story',id:STORIES[0].id,mode:m})),cursor:0,correct:0,assisted:0,startedAt:now,feedback:null};
 const q=guidedQuestion(state.practiceSession);assert.equal(q.mode,m);
 state=recordGuidedAnswer(state,{response:q.answer,eventId:`guided-${m}`,now});
 assert.equal(state.practiceSession.feedback.correct,true);assert.equal(state.practiceSession.feedback.assisted,false);
 assert.equal(state.events.length,0);assert.equal(Object.keys(state.cards).length,0);
 assert.equal(state.readingEvents[0].mode,m);state=advanceGuidedSession(state);
 assert.equal(state.practiceSession.cursor,1);validateState(state);
 const recovered=importBackup(backupDocument(state));assert.equal(recovered.readingEvents[0].mode,m);
 }
});
test('reveal is assisted and cannot credit an independent context exercise',()=>{
 let s=freshState();s.practiceSession={id:'revealed-context',limit:5,items:Array.from({length:5},()=>({type:'story',id:STORIES[3].id,mode:'evidence'})),cursor:0,correct:0,assisted:0,startedAt:now,feedback:null};
 const updated=recordGuidedAnswer(s,{reveal:true,eventId:'revealed',now});assert.equal(updated.readingEvents[0].assisted,true);assert.equal(updated.readingEvents[0].correct,false);
 assert.equal(updated.events.length,0);assert.equal(updated.learned.length,0);
});
test('new focused reading sessions include evidence, connection and legacy modes',()=>{
 let s=freshState();s=addLesson(s,DEMO_LESSONS[0].id,now);
 const session=createGuidedSession(s,{limit:20,focus:'sentences',id:'new-context-session',now});
 const modes=new Set(session.items.filter(i=>i.type==='story').map(i=>i.mode));
 assert.ok(modes.has('connection'));assert.ok(modes.has('evidence'));assert.ok(modes.has('line-meaning'));
 for(let i=0;i<20;i++){const q=guidedQuestion({...session,cursor:i});assert.ok(q?.answer);}
});
test('saved vocabulary wordbook deduplicates, toggles and is included in v1 backup',()=>{
 let s=freshState();const key=WORDS[0].key;
 s=toggleWordBookmark(s,key);assert.deepEqual(s.bookmarkedWords,[key]);assert.deepEqual(bookmarkedVocabulary(s),[findWord(key)]);
 const copy=importBackup(backupDocument(s));assert.deepEqual(copy.bookmarkedWords,s.bookmarkedWords);
 const cleared=toggleWordBookmark(copy,key);assert.deepEqual(cleared.bookmarkedWords,[]);
 assert.throws(()=>toggleWordBookmark(s,'nonexistent|fake'),/Unavailable/);
 assert.throws(()=>validateState({...s,bookmarkedWords:[key,key]}),/Invalid saved/);
 assert.throws(()=>validateState({...s,bookmarkedWords:['nonexistent']}),/Invalid saved/);
});
test('legacy backup without wordbook remains compatible and can acquire new fields',()=>{
 const old=freshState();delete old.bookmarkedWords;delete old.practiceSession;delete old.placement;delete old.bookmarkedStories;delete old.drillEvents;delete old.readingEvents;
 validateState(old);const loaded=importBackup(backupDocument(old));assert.deepEqual(bookmarkedVocabulary(loaded),[]);
 const result=toggleWordBookmark(loaded,WORDS[1].key);assert.deepEqual(result.bookmarkedWords,[WORDS[1].key]);validateState(result);
});
test('lesson connection graph uses actual word links and story occurrences without fake entries',()=>{
 for(const lesson of DEMO_LESSONS){const conn=lessonConnections(lesson.id);assert.ok(conn);assert.ok(conn.words.length>=2);
  for(const match of conn.readings){const story=STORIES.find(s=>s.id===match.id);assert.ok(story.lines.some(l=>l.hanzi.includes(match.word.replaceAll(' ',''))));}
  assert.ok(conn.relatedLessons.every(l=>l.id!==lesson.id));}
 assert.equal(lessonConnections('missing'),null);
});
test('assisted or correct responses do not artificially generate certification',()=>{
 let s=freshState();const l=DEMO_LESSONS[0];s=addLesson(s,l.id,now);
 s=addDrillRecord(s,l.id,'recognition',false,false,'miss1',now);
 let priorities=recentRemediation(s);assert.equal(priorities[0].id,l.id);assert.equal(priorities[0].wrong,1);
 s=addDrillRecord(s,l.id,'recognition',true,false,'good1',now+1);
 s=addDrillRecord(s,l.id,'recognition',true,false,'good2',now+2);
 assert.equal(recentRemediation(s).find(e=>e.id===l.id),undefined);
 const legacy=structuredClone(s);legacy.events.push({id:'legacy-no-outcome',cardId:l.id+':reading',grade:2,at:now+3});
 assert.equal(recentRemediation(legacy).find(e=>e.id===l.id),undefined,'legacy events with unknown correctness cannot invent a missed answer');
 assert.equal(s.events.length,0);assert.equal(s.cards[l.id+':meaning'].repetitions,0);
});
test('reading modes remain backward compatible and reject unknown history',()=>{
 for(const mode of [...CONTEXT_MODES,'comprehension','cloze','ordering','pronunciation','line-meaning','line-order'])assert.ok(READING_MODES.includes(mode));
 let s=addReadingEvent(freshState(),STORIES[0].id,'evidence',true,false,'reading-evidence',now);validateState(s);
 assert.throws(()=>addReadingEvent(s,STORIES[0].id,'unapproved',true,false,'bad',now),/Invalid reading/);
});
test('app provides story sentence guidance, wordbook, adaptable speech and module cache',()=>{
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 for(const marker of ['story-help-line','word-bookmark','open-wordbook','speech-rate','Find evidence','Link the ideas','lessonConnections','visibleExploreResults'])assert.ok(app.includes(marker),marker);
 assert.ok(sw.includes('context-lab.mjs'));assert.ok(sw.includes('working-v57'));
});
