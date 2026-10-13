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
export const P34_LISTENING=Object.freeze(P34_SCENES.map(s=>Object.freeze({
 id:'p34-audio-'+String(s.order).padStart(2,'0'),
 sceneId:s.id,title:'Listen · '+s.title,
 theme:s.theme,readingTitle:s.title,
 lines:Object.freeze(s.listen.map(line=>Object.freeze([...line]))),
 questions:Object.freeze(s.audioQ.map(q=>Object.freeze([...q]))),
 evidenceIndex:1,grammarIds:Object.freeze([...s.grammar]),focusWord:Object.freeze([...s.word]),
 teaching:s.teach,grade:s.level
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
