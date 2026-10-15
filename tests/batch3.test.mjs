import test from 'node:test';
import assert from 'node:assert/strict';
import {STORIES,findStory,tokenizeSentence,storyExercise,shuffledChunkIndices,validateStory} from '../src/stories.mjs';
import {WORDS,searchCatalog,findWord} from '../src/lexicon.mjs';
import {freshState,addLesson,validateState,cardsForLesson,gradeCard} from '../src/study.mjs';
import {addReadingEvent,storySummary,validateReadingEvents} from '../src/reader-records.mjs';
import {backupDocument,importBackup} from '../src/study-storage.mjs';
import {evaluatePinyin} from '../src/exercises.mjs';

test('twelve original readings contain 36 complete, auditable demonstration sentences',()=>{
 assert.ok(STORIES.length>=12);assert.equal(STORIES.slice(0,12).flatMap(s=>s.lines).length,36);
 for(const story of STORIES.slice(0,12)){assert.equal(validateStory(story),true,story.id);assert.equal(findStory(story.id),story);
  assert.equal(story.officialHskLevel,null);assert.equal(story.approval,'DEMO_ONLY');assert.equal(story.origin,'original-editorial-demo');
  for(const line of story.lines){assert.ok(line.hanzi.length>4&&line.pinyin.length>6&&line.english.length>9);assert.equal(tokenizeSentence(line.hanzi).map(t=>t.text).join(''),line.hanzi);}}
});
test('four reading exercise modes have explicit answer keys and legitimate content',()=>{
 for(const story of STORIES.slice(0,12)){for(const mode of ['comprehension','cloze','ordering','pronunciation']){const ex=storyExercise(story,mode);assert.ok(ex,`${story.id}:${mode}`);
 if(ex.kind==='choice'){assert.equal(ex.options.length,4);assert.equal(new Set(ex.options).size,4);assert.ok(ex.options.includes(ex.answer));}
 if(mode==='ordering'){assert.ok(story.lines.some(l=>l.hanzi===ex.answer));const order=shuffledChunkIndices(ex.chunks,story.id);assert.equal(new Set(order).size,ex.chunks.length);assert.notDeepEqual(order,ex.chunks.map((_,i)=>i));}
 if(mode==='pronunciation')assert.equal(evaluatePinyin(ex.answer,ex.answer).correct,true,`${story.id}: ${ex.answer}`);
 }}
});
test('vocabulary lookup preserves distinct word identities, meanings and parent lesson links',()=>{
 assert.ok(WORDS.length>=110,`found ${WORDS.length}`);assert.equal(new Set(WORDS.map(w=>w.key)).size,WORDS.length);
 const school=searchCatalog('school','words').find(x=>x.hanzi==='学校');assert.ok(school);
 const schoolWord=findWord(school.id);assert.ok(schoolWord.lessonIds.length>=1);assert.equal(schoolWord.officialHskLevel,null);
 assert.ok(searchCatalog('xue','words').some(x=>x.hanzi.includes('学')));
 assert.ok(searchCatalog('学','characters').every(x=>x.type==='character'));
 assert.ok(searchCatalog('student','all').some(x=>x.type==='word'));
 assert.equal(searchCatalog('nonsense-search-xyz').length,0);
});
test('supplementary reading attempts do not create scheduled review successes',()=>{
 const initial=addLesson(freshState(),'demo-01',1700000000000);
 const cards=structuredClone(initial.cards),events=structuredClone(initial.events);
 const next=addReadingEvent(initial,'story-01','comprehension',true,false,'r-1',1700000002000);
 assert.equal(storySummary(next).storiesRead,1);assert.equal(storySummary(next).independentCorrect,1);
 assert.deepEqual(next.cards,cards);assert.deepEqual(next.events,events);
 assert.equal(validateState(next),true);
 const assisted=addReadingEvent(next,'story-01','cloze',true,true,'r-2',1700000003000);
 assert.equal(storySummary(assisted).storiesRead,1);
 assert.equal(storySummary(assisted).attempts,2);
 assert.deepEqual(addReadingEvent(assisted,'story-01','cloze',true,true,'r-2',1700000003000).readingEvents,assisted.readingEvents);
});
test('legacy learning histories and backups preserve old review events after adding reading events',()=>{
 const legacy=addLesson(freshState(),'demo-01',1700000000000);
 delete legacy.readingEvents;const card=cardsForLesson('demo-01')[0];
 const reviewed=gradeCard(legacy,card,2,1700000000000,'q-1',{correct:true,assisted:false});
 assert.equal(validateState(reviewed),true);
 const withReading=addReadingEvent(reviewed,'story-02','ordering',false,true,'r-3',1700000001000);
 const restored=importBackup(backupDocument(withReading));
 assert.deepEqual(restored.events,reviewed.events);assert.equal(restored.readingEvents.length,1);
 assert.deepEqual(restored.learned,legacy.learned);
});
test('invalid and fabricated reading history is rejected before persistence/import',()=>{
 const s=freshState();for(const bad of [
 [{id:'x',storyId:'fake-story',mode:'cloze',correct:true,assisted:false,at:100}],
 [{id:'x',storyId:'story-01',mode:'fake-mode',correct:true,assisted:false,at:100}],
 [{id:'x',storyId:'story-01',mode:'cloze',correct:true,assisted:false,at:100},{id:'x',storyId:'story-01',mode:'cloze',correct:true,assisted:false,at:101}]
 ]){assert.throws(()=>validateReadingEvents(bad));assert.throws(()=>validateState({...s,readingEvents:bad}));}
 assert.throws(()=>addReadingEvent(s,'story-01','fake',true,false,'x'));
});
