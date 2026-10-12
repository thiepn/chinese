/** Independently authored illustrative mini-readings, not official HSK material.
 * These have not been reviewed by a language teacher. No implied HSK level.
 */
import { DEMO_LESSONS } from './demo-lessons.mjs';
const raw = [
 ['A school morning','School & routine',[
  ['我每天早上喝水。','Wǒ měitiān zǎoshang hē shuǐ.','I drink water every morning.'],
  ['然后我去学校。','Ránhòu wǒ qù xuéxiào.','Then I go to school.'],
  ['下午我回家看书。','Xiàwǔ wǒ huí jiā kàn shū.','In the afternoon, I go home and read.']],
  ['What does the speaker do in the afternoon?','Goes home and reads.','Goes to a restaurant.','Buys a train ticket.','Goes swimming.'],
  [1,'学校','学校','公园','书店','医院'],
  ['然后','我','去学校','。']],
 ['At the bookstore','Books & shopping',[
  ['今天我和朋友去书店。','Jīntiān wǒ hé péngyou qù shūdiàn.','Today my friend and I go to the bookstore.'],
  ['朋友想买一本中文书。','Péngyou xiǎng mǎi yì běn Zhōngwén shū.','My friend wants to buy a Chinese book.'],
  ['我在书店看书。','Wǒ zài shūdiàn kàn shū.','I read a book in the bookstore.']],
  ['What does the friend want to buy?','A Chinese book.','A cup of tea.','A new phone.','A train ticket.'],
  [1,'中文书','中文书','手机','茶杯','火车'],
  ['我','在书店','看书','。']],
 ['Tea at home','Food & hospitality',[
  ['今天下午朋友来我家。','Jīntiān xiàwǔ péngyou lái wǒ jiā.','My friend comes to my home this afternoon.'],
  ['我给朋友一杯茶。','Wǒ gěi péngyou yì bēi chá.','I give my friend a cup of tea.'],
  ['我们一起喝茶说话。','Wǒmen yìqǐ hē chá shuōhuà.','We drink tea and talk together.']],
  ['What do they do together?','Drink tea and talk.','Watch a football match.','Write an exam.','Take a flight.'],
  [2,'喝茶','喝茶','写信','回家','吃饭'],
  ['我们','一起','喝茶','说话','。']],
 ['A question in class','Questions & language',[
  ['老师问我一个问题。','Lǎoshī wèn wǒ yí ge wèntí.','The teacher asks me a question.'],
  ['我不明白这个问题。','Wǒ bù míngbai zhège wèntí.','I do not understand the question.'],
  ['老师又说了一次。','Lǎoshī yòu shuō le yí cì.','The teacher says it one more time.']],
  ['Why does the teacher repeat the question?','The student did not understand it.','The student was absent.','The class is over.','The teacher lost a book.'],
  [1,'问题','问题','名字','茶杯','飞机'],
  ['我','不明白','这个问题','。']],
 ['The evening phone call','Time & communication',[
  ['晚上我给妈妈打电话。','Wǎnshang wǒ gěi māma dǎ diànhuà.','In the evening I call my mother.'],
  ['妈妈问我今天怎么样。','Māma wèn wǒ jīntiān zěnmeyàng.','My mother asks how my day was.'],
  ['我说今天很好。','Wǒ shuō jīntiān hěn hǎo.','I say today was very good.']],
  ['Who does the speaker call?','Their mother.','Their teacher.','A doctor.','A bookstore clerk.'],
  [0,'打电话','打电话','看书','走路','喝水'],
  ['晚上','我','给妈妈','打电话','。']],
 ['Taking the train','Travel',[
  ['明天我坐火车去北京。','Míngtiān wǒ zuò huǒchē qù Běijīng.','Tomorrow I am taking the train to Beijing.'],
  ['火车早上八点走。','Huǒchē zǎoshang bā diǎn zǒu.','The train leaves at eight in the morning.'],
  ['我想早点到车站。','Wǒ xiǎng zǎodiǎn dào chēzhàn.','I want to arrive at the station early.']],
  ['When does the train leave?','At eight in the morning.','At noon.','At eight in the evening.','Tomorrow afternoon.'],
  [0,'火车','火车','汽车','手机','钱包'],
  ['明天','我','坐火车','去北京','。']],
 ['A rainy day','Weather',[
  ['今天下雨了。','Jīntiān xià yǔ le.','It is raining today.'],
  ['我不想出去。','Wǒ bù xiǎng chūqù.','I do not want to go out.'],
  ['我在家看书喝茶。','Wǒ zài jiā kàn shū hē chá.','I stay home, read and drink tea.']],
  ['Why does the speaker stay home?','It is raining.','They are waiting for a train.','They are visiting a teacher.','They need to buy a book.'],
  [2,'看书','看书','坐车','写信','学习'],
  ['我','在家','看书','喝茶','。']],
 ['A busy student','Study & work',[
  ['我哥哥在大学学习。','Wǒ gēge zài dàxué xuéxí.','My older brother studies at university.'],
  ['他白天上课。','Tā báitiān shàng kè.','He attends classes during the day.'],
  ['晚上他在家写作业。','Wǎnshang tā zài jiā xiě zuòyè.','In the evening he does homework at home.']],
  ['What does the brother do in the evening?','Does homework at home.','Works at a train station.','Drinks tea at a restaurant.','Buys a mobile phone.'],
  [2,'作业','作业','日记','中文书','手机'],
  ['晚上','他','在家','写作业','。']],
 ['Lunch with a friend','Eating & social',[
  ['中午我和朋友一起吃饭。','Zhōngwǔ wǒ hé péngyou yìqǐ chī fàn.','At noon I eat with a friend.'],
  ['朋友想吃米饭。','Péngyou xiǎng chī mǐfàn.','My friend wants to eat rice.'],
  ['我想喝一杯水。','Wǒ xiǎng hē yì bēi shuǐ.','I want to drink a glass of water.']],
  ['What does the speaker want to drink?','A glass of water.','Coffee.','Orange juice.','A bowl of soup.'],
  [1,'米饭','米饭','面包','水果','茶杯'],
  ['朋友','想吃','米饭','。']],
 ['Finding the phone','Objects & places',[
  ['我找不到我的手机。','Wǒ zhǎo bú dào wǒ de shǒujī.','I cannot find my mobile phone.'],
  ['朋友说手机在桌上。','Péngyou shuō shǒujī zài zhuō shàng.','My friend says the phone is on the table.'],
  ['我看见手机了。','Wǒ kànjiàn shǒujī le.','I see the phone now.']],
  ['Where is the phone?','On the table.','Under the bed.','In a train.','At the bookstore.'],
  [1,'手机','手机','电脑','书店','钱包'],
  ['朋友','说','手机','在桌上','。']],
 ['A little time','Making plans',[
  ['你今天有时间吗？','Nǐ jīntiān yǒu shíjiān ma?','Do you have time today?'],
  ['我下午要去工作。','Wǒ xiàwǔ yào qù gōngzuò.','I have to go to work this afternoon.'],
  ['我们明天再见吧。','Wǒmen míngtiān zàijiàn ba.','Let us see each other tomorrow instead.']],
  ['When will the people meet?','Tomorrow.','This afternoon.','Tonight.','Next year.'],
  [1,'工作','工作','学校','喝茶','读书'],
  ['我们','明天','再见','吧','。']],
 ['A weekend walk','Places & movement',[
  ['星期六天气很好。','Xīngqīliù tiānqì hěn hǎo.','The weather is nice on Saturday.'],
  ['我和家人去公园走路。','Wǒ hé jiārén qù gōngyuán zǒu lù.','My family and I go to the park for a walk.'],
  ['走路以后我们回家喝水。','Zǒu lù yǐhòu wǒmen huí jiā hē shuǐ.','After walking we go home and drink water.']],
  ['Where do they go walking?','At the park.','At a shopping mall.','In the classroom.','At the train station.'],
  [1,'公园','公园','学校','书店','银行'],
  ['我','和家人','去公园','走路','。']]
];
export const STORIES=Object.freeze(raw.map(([title,theme,lines,question,cloze,order],i)=>Object.freeze({
 id:`story-${String(i+1).padStart(2,'0')}`,title,theme,origin:'original-editorial-demo',approval:'DEMO_ONLY',officialHskLevel:null,
 lines:Object.freeze(lines.map(([hanzi,pinyin,english])=>Object.freeze({hanzi,pinyin,english}))),
 question:Object.freeze({prompt:question[0],answer:question[1],options:Object.freeze(question.slice(1))}),
 cloze:Object.freeze({line:cloze[0],answer:cloze[1],options:Object.freeze(cloze.slice(2))}),
 order:Object.freeze(order)
})));
export const STORIES_BY_ID=new Map(STORIES.map(s=>[s.id,s]));
export const findStory=(id)=>STORIES_BY_ID.get(id)||null;
const extras=[
 ['每天','měitiān','every day'],['早上','zǎoshang','morning'],['然后','ránhòu','then'],['下午','xiàwǔ','afternoon'],['在家','zài jiā','at home'],['书店','shūdiàn','bookstore'],['一本','yì běn','one (volume)'],['一起','yìqǐ','together'],['朋友','péngyou','friend'],['问题','wèntí','question'],['老师','lǎoshī','teacher'],['不明白','bù míngbai','do not understand'],['一次','yí cì','once'],['晚上','wǎnshang','evening'],['妈妈','māma','mother'],['怎么样','zěnmeyàng','how'],['打电话','dǎ diànhuà','make a phone call'],['火车','huǒchē','train'],['北京','Běijīng','Beijing'],['车站','chēzhàn','station'],['下雨','xià yǔ','to rain'],['出去','chūqù','go out'],['在家','zài jiā','at home'],['大学','dàxué','university'],['上课','shàng kè','attend class'],['作业','zuòyè','homework'],['白天','báitiān','daytime'],['中午','zhōngwǔ','noon'],['米饭','mǐfàn','cooked rice'],['一杯水','yì bēi shuǐ','a glass of water'],['手机','shǒujī','mobile phone'],['桌上','zhuō shàng','on the table'],['找不到','zhǎo bú dào','cannot find'],['明天','míngtiān','tomorrow'],['工作','gōngzuò','work'],['再见','zàijiàn','see you again'],['星期六','Xīngqīliù','Saturday'],['公园','gōngyuán','park'],['走路','zǒu lù','to walk'],['以后','yǐhòu','afterward'],['家人','jiārén','family'],['写作业','xiě zuòyè','do homework'],['去学校','qù xuéxiào','go to school'],['看书','kàn shū','read a book'],['喝水','hē shuǐ','drink water'],['喝茶','hē chá','drink tea'],['去北京','qù Běijīng','go to Beijing'],['中文书','Zhōngwén shū','Chinese-language book'],['回家','huí jiā','go home'],['在书店','zài shūdiàn','at the bookstore']
];
const glossaryMap=new Map();
for(const lesson of DEMO_LESSONS){glossaryMap.set(lesson.hanzi,{hanzi:lesson.hanzi,pinyin:lesson.pinyin,english:lesson.meaning,lessonIds:[lesson.id]});for(const w of lesson.words){const key=w.hanzi.replace(/\s/g,'');if(!glossaryMap.has(key))glossaryMap.set(key,{...w,hanzi:key,lessonIds:[]});if(!glossaryMap.get(key).lessonIds.includes(lesson.id))glossaryMap.get(key).lessonIds.push(lesson.id);}}
for(const [hanzi,pinyin,english] of extras)if(!glossaryMap.has(hanzi))glossaryMap.set(hanzi,{hanzi,pinyin,english,lessonIds:[]});
export const GLOSSARY=Object.freeze([...glossaryMap.values()].map(v=>Object.freeze({...v,lessonIds:Object.freeze(v.lessonIds)})));
const tokenWords=[...glossaryMap.keys()].filter(Boolean).sort((a,b)=>b.length-a.length||a.localeCompare(b));
export function tokenizeSentence(hanzi){const result=[];for(let i=0;i<hanzi.length;){const key=tokenWords.find(w=>hanzi.startsWith(w,i));if(key){result.push({text:key,entry:glossaryMap.get(key)});i+=key.length;}else{const ch=String.fromCodePoint(hanzi.codePointAt(i));result.push({text:ch,entry:null});i+=ch.length;}}return result;}
export function storyExercise(story,mode){if(!story||!STORIES_BY_ID.has(story.id))return null;
 if(mode==='comprehension')return {kind:'choice',prompt:story.question.prompt,answer:story.question.answer,options:story.question.options};
 if(mode==='cloze'){const {line,answer,options}=story.cloze;const sentence=story.lines[line].hanzi;const i=sentence.indexOf(answer);if(i<0)return null;return {kind:'choice',prompt:sentence.slice(0,i)+'＿＿'+sentence.slice(i+answer.length),answer,options};}
 if(mode==='ordering'){return {kind:'ordering',prompt:'Put the Chinese chunks in the correct order.',answer:story.order.join(''),chunks:story.order};}
 if(mode==='pronunciation'){const text=story.cloze.answer;const match=glossaryMap.get(text);if(!match)return null;return {kind:'pinyin',prompt:`Type the pinyin for ${text} (with tones).`,answer:match.pinyin,display:text};}
 return null;
}
export function shuffledChunkIndices(parts,seed){let order=parts.map((_,i)=>i);let n=[...seed].reduce((a,c)=>(Math.imul(a,33)+c.charCodeAt(0))>>>0,5381);for(let i=order.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[order[i],order[j]]=[order[j],order[i]];}if(order.length>1&&order.every((v,i)=>v===i))order.reverse();return order;}
export function validateStory(story){if(!story||story.approval!=='DEMO_ONLY'||story.officialHskLevel!==null||story.lines.length!==3||story.question.options.length!==4||!story.question.options.includes(story.question.answer)||!story.cloze.options.includes(story.cloze.answer)||!story.lines[story.cloze.line].hanzi.includes(story.cloze.answer)||story.order.join('')!==story.lines.find(l=>l.hanzi===story.order.join(''))?.hanzi)return false;return ['comprehension','cloze','ordering','pronunciation'].every(m=>storyExercise(story,m));}

/** Fraction of the story's distinct covered lesson characters that have been introduced.
 * This is not full vocabulary/grammar readability and excludes untaught characters.
 */
export function introducedCharacterCoverage(story,learnedIds){
 const known=new Set(learnedIds);const chars=new Set([...story.lines.map(l=>l.hanzi).join('')]);
 const relevant=DEMO_LESSONS.filter(l=>chars.has(l.hanzi));
 return {introduced:relevant.filter(l=>known.has(l.id)).length,total:relevant.length};
}
