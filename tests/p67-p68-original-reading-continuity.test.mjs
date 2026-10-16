import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORIES,storyExercise} from '../src/stories.mjs';
import {freshState} from '../src/study.mjs';
import {c9ReadingStudyCatalog,c9ReadingRecommendations,renderC9ReadingContinuation} from '../src/media-c9.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,classes='',attrs='')=>'<button data-action="'+esc(name)+'" '+attrs+'>'+label+'</button>';
const event=(id,story,mode,correct,assisted,at)=>({id,storyId:story.id,mode,correct,assisted,at});

test('P67–P68 source reader queue enumerates every original passage and only original eligible exercise modes',()=>{
 const state=freshState(),before=JSON.stringify(state);
 const pages=c9ReadingStudyCatalog(state);
 assert.equal(pages.counts.all,STORIES.length);
 assert.equal(pages.counts.unattempted,STORIES.length);
 assert.equal(pages.counts.retry,0);
 assert.equal(pages.counts.independent,0);
 assert.ok(pages.pages>1);
 assert.equal(pages.items.length,6);
 for(const item of pages.items){
  assert.ok(STORIES.includes(item.story));
  for(const mode of item.modeHistory){
   assert.ok(['comprehension','cloze','ordering','pronunciation'].includes(mode.mode));
   assert.ok(storyExercise(item.story,mode.mode));
  }
 }
 assert.equal(JSON.stringify(state),before);
});

test('P67–P68 latest failed or assisted attempt is actionable even if the same passage passed earlier',()=>{
 const state=freshState(),s=STORIES[3];
 state.readingEvents=[
  event('t1',s,'comprehension',true,false,1000),
  event('t2',s,'cloze',false,true,2000)
 ];
 const all=c9ReadingStudyCatalog(state);
 assert.equal(all.items[0].story.id,s.id);
 assert.equal(all.items[0].stage,'retry');
 assert.equal(all.items[0].history.independent,true);
 assert.equal(all.items[0].history.latestIndependent,false);
 assert.equal(all.items[0].recommendedMode,'cloze');
 assert.equal(c9ReadingStudyCatalog(state,{filter:'retry'}).items[0].story.id,s.id);
 const html=renderC9ReadingContinuation(state,s.id,act,esc);
 assert.ok(html.includes('Earlier independent correct answer also recorded'));
 assert.ok(html.includes('data-action="c9-reading-queue-start"'));
 assert.ok(html.includes('data-mode="cloze"'));
 assert.ok(html.includes('data-action="c9-media-open-story"'));
});
test('P68 real independent recovery, saved and paginated original-reading filters never award marks',()=>{
 const state=freshState(),s=STORIES[1];
 state.readingEvents=[event('t1',s,'comprehension',false,true,1000),event('t2',s,'comprehension',true,false,2000)];
 state.bookmarkedStories=[STORIES[3].id];
 const before=JSON.stringify(state),snapshot=c9ReadingStudyCatalog(state);
 assert.equal(snapshot.counts.independent,1);
 assert.equal(snapshot.counts.retry,0);
 assert.equal(c9ReadingStudyCatalog(state,{filter:'saved'}).items[0].story.id,STORIES[3].id);
 const page2=c9ReadingStudyCatalog(state,{page:1});
 assert.notEqual(page2.items[0].story.id,snapshot.items[0].story.id);
 assert.equal(c9ReadingRecommendations(state,{limit:4}).length,4);
 const html=renderC9ReadingContinuation(state,s.id,act,esc,{filter:'independent'});
 assert.ok(html.includes('data-action="c9-reading-queue-page"'));
 assert.ok(html.includes('id="c9-reading-queue-filter"'));
 assert.equal(JSON.stringify(state),before);
});
test('P68 source selection routes to existing story exercises, preserves unanswered-response guard and original grade writer',()=>{
 const source=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const beginning=source.indexOf("if(name==='c9-reading-queue-start')");
 const end=source.indexOf("if(name==='c9-media-open-story')",beginning);
 assert.ok(beginning>0&&end>beginning);
 const handler=source.slice(beginning,end);
 for(const required of ["findStory(id)","storyExercise(story,mode)","c9ConfirmLeaveNativeAnswer('stories')",
  "resetStoryExercise()","storyMode=mode","render()","story-practice"])
  assert.ok(handler.includes(required),required);
 assert.ok(source.includes("addReadingEvent(s,story.id,storyMode,correct,assisted,eid)"));
 assert.ok(!handler.includes("addReadingEvent("));
});
