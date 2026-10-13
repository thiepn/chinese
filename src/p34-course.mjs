/** P34 source-only beginner reading/listening course.
 * Original educational examples; not an official HSK list, approved recordings,
 * transport timetable or medical source. P28/P33 historical IDs never change.
 */
import {P34_CONTENT_A} from './p34-content-a.mjs';
import {P34_CONTENT_B} from './p34-content-b.mjs';
import {P34_CONTENT_C} from './p34-content-c.mjs';
import {P34_CONTENT_D} from './p34-content-d.mjs';
import {P34_CONTENT_E} from './p34-content-e.mjs';
export const P34_SCENES=Object.freeze(
 [...P34_CONTENT_A,...P34_CONTENT_B,...P34_CONTENT_C,...P34_CONTENT_D,...P34_CONTENT_E]
 .map((s,i)=>Object.freeze({...s,id:'p34-'+String(i+1).padStart(2,'0'),order:i+1}))
);
export const p34Scene=id=>P34_SCENES.find(s=>s.id===id)||null;
const contrastDistractors={
 '闹钟':['手机','电话','书包'],'办公室':['教室','图书馆','商店'],
 '汤面':['米饭','辣面条','水果'],'地图':['课本','菜单','词典'],
 '约好':['忘了','没有','听说'],'借':['买','看','拿'],'卡片':['书包','手机','牛奶'],
 '布袋':['纸袋','箱子','书包'],'楼层':['时间','号码','方向'],'停':['下','走','来'],
 '通知':['广告','消息','故事'],'出口':['入口','路口','车站'],'蛋糕':['面包','米饭','面条'],
 '出发':['到达','回家','下车'],'号码':['名字','时间','书包'],
 '座位':['车票','书包','椅子'],'改到':['来到','看到','走到'],'笔记':['照片','手机','雨伞'],
 '市场':['学校','书店','银行'],'预约':['工作','比赛','作业'],'看错':['听懂','认识','知道'],
 '安静':['热闹','明亮','漂亮'],'暖和':['便宜','新鲜','好看'],'散步':['看书','坐车','唱歌'],
 '志愿者':['老师','学生','游客']
};

export const P34_READING_ROWS=Object.freeze(P34_SCENES.map(s=>{
 const questions=s.readQ.map(q=>Object.freeze([
   q[0],q[1],q[2],q[3],'The passage does not provide this detail.',q[4],q[5]
 ]));
 const target=s.reading[0][0],break1=Math.min(4,target.length-1),break2=Math.min(break1+4,target.length-1);
 const chunks=[target.slice(0,break1),target.slice(break1,break2),target.slice(break2,-1),target.slice(-1)].filter(Boolean);
 const clozeAt=s.reading.findIndex(line=>line[0].includes(s.word[0]));
 const lineIndex=clozeAt<0?0:clozeAt;
 const word=clozeAt<0?[...s.reading[0][0]][0]:s.word[0];
 const alternatives=(contrastDistractors[word]||['因为','老师','明天','朋友','一个','正在','没有','学校']).filter(w=>w!==word&&
  !s.reading[lineIndex][0].includes(w)).slice(0,3);
 return Object.freeze([
  s.title,s.theme,'P34 reading: '+s.teach,s.level,s.reading,questions,
  chunks,[lineIndex,word,...alternatives],
  ['Reconstruct the core sentence: '+s.write[0],s.write[1],s.write[2],s.write[3],s.teach],
  s.grammar,s.word,
  'After the six-line passage, listen to the separate original audio-only exchange about '+s.theme.toLowerCase()+'.'
 ]);
}));
const audioFeedback=[["The speaker says 起晚了: rising late, not missing the bus.","还有十分钟 is ten minutes remaining until the eight o'clock departure."],["The response says 在办公室 rather than a library or bus stop.","二楼 is floor two; do not confuse a floor with a room number."],["B requests 一个鸡蛋, not several eggs.","不要辣椒 explicitly excludes chilli; 不要辣 is not a request for more spice."],["第二本内容更多 compares the second book's contents.","三十块 is 30 yuan, not 13; distinguish 三十 and 十三."],["B rejects 14:00 and agrees on 三点半, meaning 15:30.","公园门口 is the park entrance, not inside the park."],["A asks for a spare 铅笔, a pencil, not a notebook.","B says 别着急, meaning no rush rather than refusal."],["A says 今天有课, so class prevents a visit today.","星期天 is Sunday; distinguish 星期六 and 星期天."],["下面还有三盒 reports remaining stock, not quantity taken.","我要两盒 is two cartons taken, distinct from three in stock."],["三楼 is explicitly floor three, not floor two.","三零五 is room 305; the zero is spoken líng."],["没有了 signals that the rain has stopped.","B recommends 不滑的鞋, non-slip shoes, because the ground remains wet."],["下午一点开 is 13:00; morning remains closed.","上午暂时关闭 means temporarily closed in the morning."],["The second speaker mentions a 花店 beside the west exit.","我过去找你 means B moves to A's east exit."],["买四个就够了 means four eggs are sufficient.","没有鸡蛋了 is a lack of eggs, not a lack of sugar."],["八点那班 identifies an 08:00 departure, not the arrival.","九点到 is arrival at 09:00, not departure."],["不是 explicitly denies that B is Xiao Zhang.","A says 再看一下号码 and intends to check the number."],["请坐这里吧 offers a seat rather than a meal.","我快到了 says A's destination is near."],["星期天上午 is the proposed replacement day.","博物馆门口 is the entrance to the museum."],["B says 我有点儿不舒服, indicating illness or discomfort.","明天把笔记发给你 promises notes tomorrow."],["青苹果一斤六块 is the unit price for green apples.","Two jin at six yuan each gives 十二块, twelve yuan."],["十点半 is now, while 十一点 is the appointment time.","请坐这边 is permission to sit and wait."],["不是星期四，是星期五 corrects the day to Friday.","下午两点 is 14:00, not noon or 15:00."],["太吵了 describes excessive noise in the living room.","去自己的房间 means studying in one's own room."],["黑色的比蓝色的厚 makes the black coat thicker.","贵一点 means more expensive, but also warmer in winter."],["去公园吧 selects the park, not the riverside.","比较近 gives the reason: the park is closer."],["已经摆好了 means the table setup is already finished.","请先准备饮用水 assigns water preparation, not table setup."]];
export const P34_LISTENING=Object.freeze(P34_SCENES.map((s,index)=>Object.freeze({
 id:'p34-audio-'+String(s.order).padStart(2,'0'),
 sceneId:s.id,title:'Listen · '+s.title,
 theme:s.theme,readingTitle:s.title,
 lines:Object.freeze(s.listen.map(line=>Object.freeze([...line]))),
 questions:Object.freeze(s.audioQ.map(q=>Object.freeze([...q]))),
 evidenceIndex:1,grammarIds:Object.freeze([...s.grammar]),focusWord:Object.freeze([...s.word]),
 teaching:s.teach,feedback:Object.freeze([...audioFeedback[index]]),grade:s.level
})));
export const p34Audio=id=>P34_LISTENING.find(s=>s.id===id)||null;
export const P34_LISTENING_WRITING_TASKS=Object.freeze(P34_LISTENING.map(s=>{
 const line=s.lines[3];
 return Object.freeze({id:'p34:'+s.id+':writing',p34AudioId:s.id,kind:'p34-listening-production',
  english:line[3],hanzi:line[1],pinyin:line[2],
  explanation:'Listen and reconstruct the exact spoken model. '+s.teaching});
}));
export function p34ReadForAudio(id){
 const i=P34_LISTENING.findIndex(s=>s.id===id);return i<0?null:P34_SCENES[i];
}
