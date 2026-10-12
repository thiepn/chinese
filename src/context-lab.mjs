/** Original editorial demonstration questions: no official HSK mapping or certified review. */
import {STORIES,findStory} from './stories.mjs';
import {DEMO_LESSONS,findLesson} from './demo-lessons.mjs';
import {WORDS,findWord} from './lexicon.mjs';
// Answer line is the sentence that most directly supports the existing comprehension question.
const evidenceLines=[2,1,2,1,0,1,0,2,2,1,2,1];
const links=[
 ['Why is the final activity later in the day?','The passage moves from morning to afternoon.','The friend is late.','There is no school today.','The speaker stays home all day.','The time words 早上 and 下午 locate the events.'],
 ['Which detail explains the purpose of visiting the bookstore?','The friend wants to buy a Chinese book.','The speaker is buying a train ticket.','They are meeting a doctor.','They are studying at a park.','The sentence with 想买 expresses an intended purchase.'],
 ['What relationship connects the second and third sentences?','Giving tea leads into drinking tea together.','The friends leave by train.','They stop speaking.','The narrator buys a new teacup.','The last sentence describes their shared activity.'],
 ['Why is the last sentence needed?','It shows the teacher repeats the explanation.','It describes the weather.','It tells the student to go home.','It changes the location to a shop.','不明白 establishes the difficulty, then 又说了一次 is the response.'],
 ['Why does the mother ask a question?','She wants to know how the day went.','She wants to know train times.','She is buying a book.','She is asking for homework.','今天怎么样 asks about the day.'],
 ['Why does the speaker want to arrive early?','The train leaves at a stated morning time.','They want to have a long lunch.','The station closes at night.','The trip is canceled.','The departure time links to the goal of arriving at the station early.'],
 ['How are the first two sentences connected?','Rain explains the decision to stay in.','The speaker has missed a train.','The friend is at school.','The weather improves suddenly.','下雨了 provides context for 不想出去.'],
 ['What is the overall daily sequence?','Study at university, attend class, do homework at night.','Go shopping, take a train, go swimming.','Work at a bookstore then eat out.','Stay home all morning and afternoon.','白天 and 晚上 distinguish the two parts of the day.'],
 ['Which preferences are contrasted?','The friend wants rice; the speaker wants water.','Both want coffee.','One wants a train ticket.','They both want to read.','朋友想吃 contrasts with 我想喝.'],
 ['What resolves the speaker’s problem?','The friend identifies where the phone is.','The speaker buys a replacement.','The phone rings in a train.','The teacher finds a book.','The location in the second sentence resolves 找不到.'],
 ['Why do the speakers postpone their meeting?','One speaker has to work this afternoon.','The train is delayed.','The weather is cold.','They cannot find the park.','下午要去工作 motivates 明天再见.'],
 ['What happens after their walk?','They go home and drink water.','They go to the bookstore.','They wait for a train.','They go to university.','以后 introduces what follows the walk.']
];
export const CONTEXT_MODES=Object.freeze(['evidence','connection']);
export function contextQuestion(storyId,mode){
 const story=findStory(storyId),index=STORIES.findIndex(s=>s.id===storyId);
 if(!story||!CONTEXT_MODES.includes(mode))return null;
 if(mode==='evidence')return {kind:'choice',mode,prompt:`Which Chinese sentence best supports this answer? ${story.question.prompt}`,answer:story.lines[evidenceLines[index]].hanzi,options:story.lines.map(l=>l.hanzi),explanation:`Look for the sentence that directly states: ${story.question.answer}`};
 const [prompt,answer,...rest]=links[index];const distractors=rest.slice(0,3),explanation=rest[3];
 return {kind:'choice',mode,prompt,answer,options:[...distractors.slice(index%4),answer,...distractors.slice(0,index%4)].slice(0,4),explanation};
}
export function validateContextQuestions(){if(evidenceLines.length!==STORIES.length||links.length!==STORIES.length)throw Error('Missing context fixtures');
 for(const s of STORIES)for(const mode of CONTEXT_MODES){const q=contextQuestion(s.id,mode);if(!q||q.kind!=='choice'||new Set(q.options).size!==(mode==='evidence'?3:4)||!q.options.includes(q.answer)||!q.explanation||!q.prompt)throw Error('Invalid contextual reasoning exercise');}
 return true;
}
export function lessonConnections(lessonId){const lesson=findLesson(lessonId);if(!lesson)return null;
 const words=WORDS.filter(w=>w.lessonIds.includes(lesson.id));
 const seen=new Set(),linked=[];
 for(const word of words){for(const s of STORIES){if(s.lines.some(line=>line.hanzi.includes(word.hanzi.replaceAll(' ','')))&&!seen.has(s.id)){linked.push({id:s.id,title:s.title,word:word.hanzi});seen.add(s.id);}}}
 const overlaps=DEMO_LESSONS.filter(l=>l.id!==lesson.id&&l.words.some(w=>lesson.words.some(own=>own.hanzi===w.hanzi))).slice(0,5);
 return {words,readings:linked.slice(0,5),relatedLessons:overlaps};
}
export function recentRemediation(state,{limit=6}={}){
 const attempts=[...(state.events||[]).filter(e=>e.correct===true||e.correct===false||e.grade===0).map(e=>({at:e.at,id:e.cardId?.split(':')[0],correct:e.correct===true&&!e.assisted,kind:'scheduled'})),
 ...(state.drillEvents||[]).map(e=>({at:e.at,id:e.lessonId,correct:e.correct===true&&!e.assisted,kind:'extra'}))]
 .filter(e=>findLesson(e.id)).sort((a,b)=>a.at-b.at);
 const grouped=new Map();for(const ev of attempts){const old=grouped.get(ev.id)||{id:ev.id,wrong:0,streak:0,lastAt:0};
 if(ev.correct){old.streak++;if(old.streak>=2)old.wrong=Math.max(0,old.wrong-1);}else{old.wrong++;old.streak=0;}old.lastAt=ev.at;grouped.set(ev.id,old);}
 return [...grouped.values()].filter(item=>item.wrong>0).map(item=>({...item,lesson:findLesson(item.id),score:item.wrong*4+(item.streak===0?2:0)})).sort((a,b)=>b.score-a.score||b.lastAt-a.lastAt).slice(0,limit);
}
