import test from 'node:test';
import assert from 'node:assert/strict';
import {P68_SOURCE_READINGS} from '../src/p68-source-readings.mjs';
import {P71_SOURCE_READINGS} from '../src/p71-reading-course.mjs';
import {STORIES} from '../src/stories.mjs';
import {beginnerQuestion} from '../src/beginner-reading.mjs';
import {beginnerEvidence} from '../src/beginner-reading-screen.mjs';
import {addReadingEvent} from '../src/reader-records.mjs';
import {freshState} from '../src/study.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const storyBySource=(source)=>STORIES.find(s=>s.beginner?.p68?.id===source.id||s.beginner?.p71?.id===source.id);

test('F4 P68 bus timetable preserves exact arrival-vs-departure contrast in authentic bilingual rows',()=>{
 const passage=P68_SOURCE_READINGS.find(p=>p.title==='Two bus notices');
 assert.ok(passage);
 assert.match(passage.lines[2].hanzi,/提前十分钟到站/);
 assert.equal(passage.lines[3].hanzi,'她看清楚日期，发现今天的到站时间没有变化。');
 assert.equal(passage.lines[3].pinyin,'Tā kàn qīngchu rìqī, fāxiàn jīntiān de dàozhàn shíjiān méiyǒu biànhuà.');
 assert.equal(passage.lines[3].english,"She checks the date and sees that today's arrival time is unchanged.");
 assert.doesNotMatch(passage.lines[3].hanzi,/发车/);
 assert.equal(storyBySource(passage).lines[3].hanzi,passage.lines[3].hanzi);
 assert.equal(passage.questions[0].answer,'Next week.');
 assert.equal(passage.questions[0].evidence,2);
});
test('F4 rain venue must remain a possible group activity indoors without mis-teaching garden care',()=>{
 const passage=P68_SOURCE_READINGS.find(p=>p.title==='Rain changes the volunteer event');
 assert.ok(passage);
 assert.equal(passage.lines[0].hanzi,'社区志愿者原来计划星期六在公园举行小组活动。');
 assert.equal(passage.lines[0].pinyin,'Shèqū zhìyuànzhě yuánlái jìhuà xīngqīliù zài gōngyuán jǔxíng xiǎozǔ huódòng.');
 assert.equal(passage.lines[0].english,'Community volunteers plan a group activity in the park on Saturday.');
 assert.match(passage.lines[3].hanzi,/室内教室/);
 assert.match(passage.lines[4].hanzi,/改在教室举行/);
 assert.equal(storyBySource(passage).lines[0].hanzi,passage.lines[0].hanzi);
 assert.equal(passage.questions[2].answer,'An indoor classroom.');
 assert.equal(passage.questions[2].evidence,4);
});
test('F4 survey answer-key asks only what its cited source line directly establishes',()=>{
 const passage=P68_SOURCE_READINGS.find(p=>p.title==='A survey headline is corrected');
 const q=passage.questions[2],story=storyBySource(passage);
 assert.equal(q.prompt,'What does the revised report explicitly state?');
 assert.equal(q.answer,'The number of people surveyed.');
 assert.equal(q.evidence,4);
 assert.match(passage.lines[q.evidence].hanzi,/参加调查的人数/);
 assert.match(q.explanation,/fifth sentence explicitly states the number surveyed/);
 assert.match(passage.lines[5].hanzi,/这次调查的结果/);
 assert.equal(q.id,passage.id+':q3');
 const native=beginnerQuestion(story,'beginner-sequence');
 assert.equal(native.answer,q.answer);
 assert.equal(native.evidence,4);
 assert.ok(native.options.includes(q.answer));
 assert.equal(beginnerEvidence(story,native,null,esc),'');
 assert.match(beginnerEvidence(story,native,{correct:true,assisted:false},esc),/参加调查的人数/);
 const original=freshState(),saved=JSON.stringify(original);
 const next=addReadingEvent(original,story.id,'beginner-sequence',true,false,'f4-survey-answer',1000);
 assert.deepEqual(next.readingEvents.at(-1),{id:'f4-survey-answer',storyId:story.id,mode:'beginner-sequence',correct:true,assisted:false,at:1000});
 assert.equal(JSON.stringify(original),saved);
});
test('F4 P71 无论 alternatives are ferry vs postponement, not two modes of transportation',()=>{
 const passage=P71_SOURCE_READINGS.find(p=>p.title==='Weather and the ferry schedule');
 const line=passage.lines[5],q=passage.questions[1],story=storyBySource(passage);
 assert.equal(line.hanzi,'无论最后是乘船还是延期举行，都必须提前告知参加者。');
 assert.equal(line.pinyin,'Wúlùn zuìhòu shì chéngchuán háishi yánqī jǔxíng, dōu bìxū tíqián gàozhī cānjiāzhě.');
 assert.equal(line.english,'Whether they take the ferry or postpone the event, participants must be informed in advance.');
 assert.equal(q.prompt,'What must happen whether they take the ferry or postpone the event?');
 assert.equal(q.answer,'Inform participants in advance.');
 assert.equal(q.evidence,5);
 assert.equal(q.id,passage.id+':q2');
 assert.ok(q.explanation.includes('postponement'));
 assert.match(passage.lines[6].hanzi,/乘船和延期举行两种方案/);
 assert.deepEqual(passage.grammarEvidence.find(x=>x.grammarId==='g136'),{grammarId:'g136',lineIndex:5,token:'无论'});
 const native=beginnerQuestion(story,'beginner-reason');
 assert.equal(native.answer,q.answer);
 assert.equal(native.evidence,5);
 assert.equal(native.evidenceLine.hanzi,line.hanzi);
 assert.equal(beginnerEvidence(story,native,null,esc),'');
 assert.match(beginnerEvidence(story,native,{correct:true,assisted:false},esc),/延期举行/);
});
test('F4 source repairs preserve immutable original P68/P71 IDs and demo-only publication boundaries',()=>{
 assert.equal(P68_SOURCE_READINGS.length,6);
 assert.equal(P71_SOURCE_READINGS.length,5);
 for(const [prefix,readings] of [['p68',P68_SOURCE_READINGS],['p71',P71_SOURCE_READINGS]]){
  for(let i=0;i<readings.length;i++){
   const p=readings[i],story=storyBySource(p);
   assert.equal(p.id,prefix+'-'+String(i+1).padStart(2,'0'));
   assert.equal(p.approval,'DEMO_ONLY');assert.equal(p.officialHskLevel,null);
   assert.ok(story);assert.equal(story.approval,'DEMO_ONLY');assert.equal(story.officialHskLevel,null);
   for(const q of p.questions){
    assert.ok(q.options.includes(q.answer));
    assert.equal(new Set(q.options).size,4);
    assert.ok(p.lines[q.evidence]?.hanzi);
   }
  }
 }
});
