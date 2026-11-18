/** P38 reading adaptations of original P37 scenarios.
 * Eight substantial authenticated authorial lines form each written exchange,
 * framed by new passage narration. Source attribution is explicit: this is
 * educational adaptation of earlier original P37 content, not a new licensed
 * external text or an officially designated HSK 3.0 collection.
 */
import {P37_SCENES} from './p37-scenarios.mjs';
import {P38_EXTRA_A} from './p38-extra-a.mjs';
import {P38_EXTRA_B} from './p38-extra-b.mjs';
import {P38_INFERENCE} from './p38-inference.mjs';
const expandedOriginal=[...P38_EXTRA_A,...P38_EXTRA_B];
const outlines=[
 ["约好的时间有时需要改变，双方都要先确认。","Yuē hǎo de shíjiān yǒushí xūyào gǎibiàn, shuāngfāng dōu yào xiān quèrèn.","Sometimes an agreed time must change, and both sides need to confirm.","最后，大家要记清楚真正确认的日期。","Zuìhòu, dàjiā yào jì qīngchu zhēnzhèng quèrèn de rìqī.","In the end, everyone needs to remember the actual confirmed date."],
 ["上课以前，一位学生发现自己缺少学习材料。","Shàng kè yǐqián, yí wèi xuésheng fāxiàn zìjǐ quēshǎo xuéxí cáiliào.","Before class, a student notices some learning material is missing.","找不到文件并不一定说明文件从来没有发过。","Zhǎo bu dào wénjiàn bìng bù yídìng shuōmíng wénjiàn cónglái méiyǒu fā guo.","Not finding a file doesn't necessarily mean it was never sent."],
 ["工作安排发生变化时，早点沟通很重要。","Gōngzuò ānpái fāshēng biànhuà shí, zǎodiǎn gōutōng hěn zhòngyào.","Early communication matters when work schedules change.","提出新的上班时间不代表经理已经同意。","Tíchū xīn de shàngbān shíjiān bù dàibiǎo jīnglǐ yǐjīng tóngyì.","Proposing a new shift doesn't mean the manager has agreed."],
 ["在商店买东西，有时大小不合适。","Zài shāngdiàn mǎi dōngxi, yǒushí dàxiǎo bù héshì.","Sometimes an item bought in a shop doesn't fit.","问清楚有没有合适的尺码，再决定怎么办。","Wèn qīngchu yǒu méiyǒu héshì de chǐmǎ, zài juédìng zěnme bàn.","Check for the right size before deciding what to do."],
 ["看菜单的时候，只看菜名有时不够。","Kàn càidān de shíhou, zhǐ kàn càimíng yǒushí bú gòu.","Sometimes dish names alone aren't enough when reading a menu.","问清楚配料以后，再点菜更合适。","Wèn qīngchu pèiliào yǐhòu, zài diǎn cài gèng héshì.","It's better to order after checking the ingredients."],
 ["去不熟悉的地方，先问路线可以少走错路。","Qù bù shúxī de dìfang, xiān wèn lùxiàn kěyǐ shǎo zǒu cuò lù.","Asking for directions first can prevent mistakes in unfamiliar places.","换车以前，最好再确认一次站名。","Huàn chē yǐqián, zuì hǎo zài quèrèn yí cì zhànmíng.","Before transferring, it's best to confirm the stop name."],
 ["住进新房间以后，有人发现晚上不太安静。","Zhù jìn xīn fángjiān yǐhòu, yǒu rén fāxiàn wǎnshang bú tài ānjìng.","After entering a new room, someone notices it isn't quiet at night.","前台愿意查看空房，不等于已经换好了房间。","Qiántái yuànyì chákàn kòng fáng, bù děngyú yǐjīng huàn hǎo le fángjiān.","Reception agreeing to check for rooms isn't a completed room change."],
 ["感觉不舒服的时候，说明症状可以帮助沟通。","Gǎnjué bù shūfu de shíhou, shuōmíng zhèngzhuàng kěyǐ bāngzhù gōutōng.","Explaining symptoms can help communication when feeling unwell.","在这段对话里，工作人员没有给任何诊断。","Zài zhè duàn duìhuà lǐ, gōngzuò rényuán méiyǒu gěi rènhé zhěnduàn.","In this dialogue, staff do not give any diagnosis."],
 ["邀请朋友以前，先问对方有没有时间。","Yāoqǐng péngyou yǐqián, xiān wèn duìfāng yǒu méiyǒu shíjiān.","Before inviting a friend, ask whether they have time.","如果原来的安排不行，可以一起商量改天再去。","Rúguǒ yuánlái de ānpái bù xíng, kěyǐ yìqǐ shāngliang gǎitiān zài qù.","If the original plan doesn't work, discuss going another day."],
 ["发现地址写错了，应该先查正式的处理办法。","Fāxiàn dìzhǐ xiě cuò le, yīnggāi xiān chá zhèngshì de chǔlǐ bànfǎ.","When an address is wrong, first check the formal procedure.","不要随便在公开聊天中发送自己的详细地址。","Bú yào suíbiàn zài gōngkāi liáotiān zhōng fāsòng zìjǐ de xiángxì dìzhǐ.","Don't casually post your full address in a public chat."],
 ["小组学习时，同学可能有不同的办法。","Xiǎozǔ xuéxí shí, tóngxué kěnéng yǒu bùtóng de bànfǎ.","Classmates may have different approaches when studying together.","大家可以先试一个简单的办法，再决定要不要改变。","Dàjiā kěyǐ xiān shì yí ge jiǎndān de bànfǎ, zài juédìng yào bu yào gǎibiàn.","Everyone can try a simple method before deciding whether to change it."],
 ["下雨天遇到小问题，有时可以先向朋友求助。","Xià yǔ tiān yùdào xiǎo wèntí, yǒushí kěyǐ xiān xiàng péngyou qiúzhù.","On a rainy day, asking a friend can sometimes solve a small problem.","借别人的东西以前要得到同意，用完要按时归还。","Jiè biérén de dōngxi yǐqián yào dédào tóngyì, yòng wán yào ànshí guīhuán.","Obtain permission before borrowing and return the item on time."],
 ["点饮料时，说清楚自己的口味很有用。","Diǎn yǐnliào shí, shuō qīngchu zìjǐ de kǒuwèi hěn yǒuyòng.","Stating your taste preference is useful when ordering a drink.","少放一点糖和完全不放糖不是一回事。","Shǎo fàng yìdiǎn táng hé wánquán bú fàng táng bú shì yí huí shì.","A little less sugar isn't the same as none at all."],
 ["自行车有问题时，先检查再决定修不修。","Zìxíngchē yǒu wèntí shí, xiān jiǎnchá zài juédìng xiū bu xiū.","When a bicycle has a problem, inspect it before deciding on repairs.","知道哪里坏了以后，才容易说明需要做什么。","Zhīdào nǎli huài le yǐhòu, cái róngyì shuōmíng xūyào zuò shénme.","Knowing what's broken helps explain what work is needed."],
 ["同一个会议的安排也可能临时改变。","Tóng yí ge huìyì de ānpái yě kěnéng línshí gǎibiàn.","Arrangements for a meeting may change unexpectedly.","如果会议链接还没收到，应该去问负责人。","Rúguǒ huìyì liànjiē hái méi shōudào, yīnggāi qù wèn fùzérén.","If the meeting link hasn't arrived, ask the organizer."],
 ["考试和辅导的时间冲突时，要尽早联系对方。","Kǎoshì hé fǔdǎo de shíjiān chōngtū shí, yào jǐnzǎo liánxì duìfāng.","When an exam conflicts with tutoring, contact the other person early.","双方都同意以后，新的辅导时间才算确定。","Shuāngfāng dōu tóngyì yǐhòu, xīn de fǔdǎo shíjiān cái suàn quèdìng.","The new lesson time is settled only after both sides agree."],
 ["选择学习的地方，不能只看它有多近。","Xuǎnzé xuéxí de dìfang, bù néng zhǐ kàn tā yǒu duō jìn.","When choosing a study space, distance isn't the only factor.","一个房间虽然更安静，但是不一定有空位。","Yí ge fángjiān suīrán gèng ānjìng, dànshì bù yídìng yǒu kòng wèi.","A quieter room may not have free seats."],
 ["丢了交通卡和暂时找不到交通卡不完全一样。","Diū le jiāotōng kǎ hé zànshí zhǎo bu dào jiāotōng kǎ bù wánquán yíyàng.","Losing a transit card and temporarily misplacing it aren't identical.","采取下一步行动以前，最好查看官方说明。","Cǎiqǔ xià yí bù xíngdòng yǐqián, zuì hǎo chákàn guānfāng shuōmíng.","Before taking the next step, consult official guidance."],
 ["饭后看账单，有时会发现数量不对。","Fàn hòu kàn zhàngdān, yǒushí huì fāxiàn shùliàng bú duì.","Sometimes the quantity on a restaurant bill is wrong.","先核对订单，再请服务员重新计算比较好。","Xiān héduì dìngdān, zài qǐng fúwùyuán chóngxīn jìsuàn bǐjiào hǎo.","It's best to check the order before asking the server to recalculate."],
 ["安排周末活动时，需要考虑天气变化。","Ānpái zhōumò huódòng shí, xūyào kǎolǜ tiānqì biànhuà.","Weather changes matter when planning weekend activities.","如果天气不适合户外活动，可以选择室内计划。","Rúguǒ tiānqì bù shìhé hùwài huódòng, kěyǐ xuǎnzé shìnèi jìhuà.","If outdoor conditions are unsuitable, an indoor plan is possible."],
 ["借来的书有还书日期，想续借就要先查规定。","Jiè lái de shū yǒu huán shū rìqī, xiǎng xùjiè jiù yào xiān chá guīdìng.","Borrowed books have return dates; check the rules before extending a loan.","没有得到新的许可时，应该按原来的日期还书。","Méiyǒu dédào xīn de xǔkě shí, yīnggāi àn yuánlái de rìqī huán shū.","Without new permission, return the book on the original date."],
 ["打印机没有出纸，不一定是文件发错了。","Dǎyìnjī méiyǒu chū zhǐ, bù yídìng shì wénjiàn fā cuò le.","A printer failing to produce pages doesn't necessarily mean the file was sent incorrectly.","先检查状态，再向管理员求助比较安全。","Xiān jiǎnchá zhuàngtài, zài xiàng guǎnlǐyuán qiúzhù bǐjiào ānquán.","Checking the status before asking an administrator is safer."],
 ["车票上的站台号码有时会发生变化。","Chēpiào shàng de zhàntái hàomǎ yǒushí huì fāshēng biànhuà.","The platform printed on a ticket may sometimes change.","出发以前查看车站最新的屏幕信息很重要。","Chūfā yǐqián chákàn chēzhàn zuìxīn de píngmù xìnxī hěn zhòngyào.","Checking the latest station display before departure is important."],
 ["两个人吃饭，可以问服务员能不能分开结账。","Liǎng ge rén chī fàn, kěyǐ wèn fúwùyuán néng bu néng fēnkāi jiézhàng.","Two diners can ask whether separate payment is possible.","每个人说明自己点了什么，才容易算清楚。","Měi ge rén shuōmíng zìjǐ diǎn le shénme, cái róngyì suàn qīngchu.","Specifying each person's order makes the calculation clearer."],
 ["网上买东西以后，需要核对收到的物品。","Wǎngshàng mǎi dōngxi yǐhòu, xūyào héduì shōudào de wùpǐn.","After an online purchase, check what actually arrived.","发现少了一件时，先保留记录再联系商店。","Fāxiàn shǎo le yí jiàn shí, xiān bǎoliú jìlù zài liánxì shāngdiàn.","If an item is missing, keep records before contacting the shop."],
 ["家人邀请朋友吃饭时，可以先商量时间。","Jiārén yāoqǐng péngyou chī fàn shí, kěyǐ xiān shāngliang shíjiān.","Families can discuss the time before inviting friends to dinner.","同意来吃饭不表示每一道菜都已经决定。","Tóngyì lái chī fàn bù biǎoshì měi yí dào cài dōu yǐjīng juédìng.","Accepting dinner doesn't mean every dish has been decided."],
 ["打电话问路时，楼层和房间号码都要听清楚。","Dǎ diànhuà wèn lù shí, lóucéng hé fángjiān hàomǎ dōu yào tīng qīngchu.","When asking directions by phone, listen carefully to floor and room numbers.","没有听清楚的话，可以礼貌地请对方再说一次。","Méiyǒu tīng qīngchu de huà, kěyǐ lǐmào de qǐng duìfāng zài shuō yí cì.","If you didn't hear clearly, politely ask for repetition."],
 ["语言学习可以安排固定时间，也可以互相提醒。","Yǔyán xuéxí kěyǐ ānpái gùdìng shíjiān, yě kěyǐ hùxiāng tíxǐng.","Language learning can have regular sessions and mutual reminders.","每周练习几次和每次练习多久是两个问题。","Měi zhōu liànxí jǐ cì hé měi cì liànxí duō jiǔ shì liǎng ge wèntí.","How many sessions per week and how long each lasts are different questions."],
 ["帮助别人以前，先说清楚自己能做什么。","Bāngzhù biérén yǐqián, xiān shuō qīngchu zìjǐ néng zuò shénme.","Before helping someone, explain what you're able to do.","不能搬重箱子的人，也可以完成其他重要工作。","Bù néng bān zhòng xiāngzi de rén, yě kěyǐ wánchéng qítā zhòngyào gōngzuò.","A person who can't carry heavy boxes can still do other important work."],
 ["错过预约的时间以后，最好先问新的安排。","Cuòguò yùyuē de shíjiān yǐhòu, zuì hǎo xiān wèn xīn de ānpái.","After missing an appointment window, ask about new arrangements.","没有明确的回复，就不能说新时间已经确认。","Méiyǒu míngquè de huífù, jiù bù néng shuō xīn shíjiān yǐjīng quèrèn.","Without a clear reply, a new time is not confirmed."]
];
const readingEvidencePairs=[
 [7,3],[3,6],[5,8],[3,6],[7,4],[4,6],[3,6],[3,7],[6,7],[3,6],
 [7,4],[3,6],[5,7],[6,7],[2,6],[7,3],[4,8],[3,8],[3,6],[6,7],
 [1,6],[3,8],[4,6],[3,1],[3,6],[3,7],[4,6],[3,6],[3,5],[3,8]
];
export const P38_PASSAGES=Object.freeze(P37_SCENES.map((s,i)=>{
 const intro=outlines[i].slice(0,3),closure=outlines[i].slice(3,6);
 const original=expandedOriginal[i];
 const lines=[
  {hanzi:intro[0],pinyin:intro[1],english:intro[2]},
  ...original.map(line=>({hanzi:line[0],pinyin:line[1],english:line[2]})),
  ...s.turns.map(t=>({hanzi:t[1],pinyin:t[2],english:t[3]})),
  {hanzi:closure[0],pinyin:closure[1],english:closure[2]}
 ];
 const question=(prompt,answer,wrong,evidence,explanation)=>Object.freeze({
  prompt,answer,options:Object.freeze([answer,...wrong]),evidence,explanation
 });
 const others=[P37_SCENES[(i+7)%P37_SCENES.length].questions[0][1],
 P37_SCENES[(i+17)%P37_SCENES.length].questions[0][1]];
 const questions=[
  question(s.questions[0][0],s.questions[0][1],[s.questions[0][2],s.questions[0][3],'Not stated in this passage'],readingEvidencePairs[i][0]+2,s.teaching),
  question(s.questions[1][0],s.questions[1][1],[s.questions[1][2],s.questions[1][3],'Not stated in this passage'],readingEvidencePairs[i][1]+2,s.pitfall),
  question(P38_INFERENCE[i][0],P38_INFERENCE[i][1],[P38_INFERENCE[i][2],P38_INFERENCE[i][3],'This inference is not supported by the passage.'],P38_INFERENCE[i][4],P38_INFERENCE[i][5])
 ];
 const focus=s.vocabulary.find(v=>lines.some(x=>x.hanzi.includes(v.hanzi)))||
 ['可以','时间','老师','我们','学校','我'].map((hanzi,j)=>({
  hanzi,pinyin:['kěyǐ','shíjiān','lǎoshī','wǒmen','xuéxiào','wǒ'][j],
  english:['can','time','teacher','we','school','I'][j]
 })).find(v=>lines.some(x=>x.hanzi.includes(v.hanzi)));
 const target=lines[7],written=lines[10];
 const clozeLine=lines.findIndex(x=>x.hanzi.includes(focus.hanzi));
 const chars=Array.from(target.hanzi);const n=Math.max(1,Math.floor(chars.length/4));
 const chunks=[];for(let j=0;j<chars.length;j+=n)chunks.push(chars.slice(j,j+n).join(''));
 return Object.freeze({
  id:'p38-'+String(i+1).padStart(2,'0'),sequence:i+1,title:'Reading · '+s.title,
  theme:s.theme,format:i%5===0?'practical notice and dialogue':i%5===1?'reported incident with conversation':i%5===2?'service reading and response':i%5===3?'social communication text':'short practical conversation',
  level:2+Math.floor(i/10),source:'original-p38-authorial-adaptation',
  lines:Object.freeze(lines.map(x=>Object.freeze(x))),questions:Object.freeze(questions),
  grammarIds:Object.freeze([s.grammar]),focusWord:focus,
  cloze:Object.freeze({line:clozeLine,word:focus.hanzi,
   choices:Object.freeze([focus.hanzi,...['预约','老师','朋友','时间','学校','火车','因为'].filter(w=>w!==focus.hanzi&&!lines[clozeLine].hanzi.includes(w)).slice(0,3)])}),
  chunks:Object.freeze(chunks),orderLine:7,
  writing:Object.freeze({hanzi:written.hanzi,pinyin:written.pinyin,english:written.english,
   prompt:'Without looking at the written conversation, reconstruct the final speaker response.',
   explanation:s.teaching+' '+s.pitfall}),
  notes:Object.freeze({teaching:s.teaching,pronunciation:s.sound,pragmatics:s.pragmatics,misconception:s.pitfall}),
  originSceneId:s.id,officialHskLevel:null
 });
}));
export const findP38Passage=id=>P38_PASSAGES.find(p=>p.id===id)||null;

/** Adapt P38 to the original P28/P34 reader-source contract and its modes.
 * Three distinct source-evidence questions, cloze, sentence ordering, one
 * native writer and a three-section progression per reading.
 */
export const P38_READING_ROWS=Object.freeze(P38_PASSAGES.map(p=>{
 const spoken=p.lines.map(x=>Object.freeze([x.hanzi,x.pinyin,x.english]));
 const questions=p.questions.map(q=>Object.freeze([q.prompt,q.answer,...q.options.slice(1),
  q.evidence,q.explanation]));
 const word=p.focusWord,cloze=p.cloze;
 return Object.freeze([
 p.title,p.theme,'Read a '+p.format+'; '+p.notes.teaching,p.level,spoken,questions,
 p.chunks,[cloze.line,cloze.word,...cloze.choices.slice(1)],
 [p.writing.prompt,p.writing.hanzi,p.writing.pinyin,p.writing.english,p.writing.explanation],
 p.grammarIds,[word.hanzi,word.pinyin,word.english],
 'Authorial P38 reading adaptation of P37 '+p.originSceneId+'. '+p.notes.misconception
 ]);
}));
