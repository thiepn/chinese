/** Independently authored illustrative mini-readings, not official HSK material.
 * These have not been reviewed by a language teacher. No implied HSK level.
 */
import { DEMO_LESSONS } from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {CONNECTED_READING_ROWS} from './connected-reading-content.mjs';
import {BEGINNER_READING_ROWS} from './beginner-reading-content.mjs';
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
// P22 connected readings; original story IDs and order remain unchanged.
raw.push(...[
  [
    "An early start",
    "Routine & time",
    [
      [
        "我早上七点起床。",
        "Wǒ zǎoshang qī diǎn qǐchuáng.",
        "I get up at seven in the morning."
      ],
      [
        "我先喝一杯牛奶。",
        "Wǒ xiān hē yì bēi niúnǎi.",
        "First I drink a glass of milk."
      ],
      [
        "八点我去学校上课。",
        "Bā diǎn wǒ qù xuéxiào shàng kè.",
        "At eight I go to school for class."
      ]
    ],
    [
      "When does the speaker get up?",
      "At seven.",
      "At six.",
      "At eight.",
      "At nine."
    ],
    [
      0,
      "起床",
      "起床",
      "工作",
      "睡觉",
      "回家"
    ],
    [
      "我",
      "早上七点",
      "起床",
      "。"
    ]
  ],
  [
    "Directions to the bookstore",
    "Directions & places",
    [
      [
        "我想买一本中文书。",
        "Wǒ xiǎng mǎi yì běn Zhōngwén shū.",
        "I want to buy a Chinese book."
      ],
      [
        "书店在银行右边。",
        "Shūdiàn zài yínháng yòubiān.",
        "The bookstore is to the right of the bank."
      ],
      [
        "朋友跟我一起去。",
        "Péngyou gēn wǒ yìqǐ qù.",
        "A friend goes with me."
      ]
    ],
    [
      "Where is the bookstore?",
      "To the right of the bank.",
      "In front of the station.",
      "Inside the school.",
      "Behind the park."
    ],
    [
      1,
      "右边",
      "右边",
      "左边",
      "上面",
      "下面"
    ],
    [
      "书店",
      "在银行",
      "右边",
      "。"
    ]
  ],
  [
    "The new student's question",
    "School & questions",
    [
      [
        "她是新来的学生。",
        "Tā shì xīn lái de xuésheng.",
        "She is a new student."
      ],
      [
        "她想问老师一个问题。",
        "Tā xiǎng wèn lǎoshī yí ge wèntí.",
        "She wants to ask the teacher a question."
      ],
      [
        "老师请她坐下。",
        "Lǎoshī qǐng tā zuòxià.",
        "The teacher asks her to sit down."
      ]
    ],
    [
      "What does the student want to do?",
      "Ask the teacher a question.",
      "Go shopping.",
      "Buy a train ticket.",
      "Eat dinner."
    ],
    [
      1,
      "问题",
      "问题",
      "朋友",
      "手机",
      "学校"
    ],
    [
      "她",
      "想问老师",
      "一个问题",
      "。"
    ]
  ],
  [
    "Choosing lunch",
    "Food & preferences",
    [
      [
        "中午我们一起吃饭。",
        "Zhōngwǔ wǒmen yìqǐ chī fàn.",
        "At noon we eat together."
      ],
      [
        "我想吃米饭和鱼。",
        "Wǒ xiǎng chī mǐfàn hé yú.",
        "I want rice and fish."
      ],
      [
        "朋友想喝一杯热茶。",
        "Péngyou xiǎng hē yì bēi rè chá.",
        "My friend wants a cup of hot tea."
      ]
    ],
    [
      "What does the speaker want to eat?",
      "Rice and fish.",
      "Milk and bread.",
      "Only fruit.",
      "Noodles and eggs."
    ],
    [
      1,
      "米饭",
      "米饭",
      "牛奶",
      "水果",
      "热水"
    ],
    [
      "我",
      "想吃",
      "米饭",
      "和鱼",
      "。"
    ]
  ],
  [
    "A cold rainy day",
    "Weather & home",
    [
      [
        "今天外面下雨了。",
        "Jīntiān wàimiàn xià yǔ le.",
        "It has started raining outside today."
      ],
      [
        "天气很冷，我不想出去。",
        "Tiānqì hěn lěng, wǒ bù xiǎng chūqù.",
        "It is cold, and I do not want to go out."
      ],
      [
        "我在家看书，喝热水。",
        "Wǒ zài jiā kàn shū, hē rè shuǐ.",
        "I read at home and drink hot water."
      ]
    ],
    [
      "Why does the speaker stay inside?",
      "It is cold and raining.",
      "The teacher asked them to.",
      "They lost their phone.",
      "They are expecting a train."
    ],
    [
      0,
      "下雨",
      "下雨",
      "工作",
      "起床",
      "见面"
    ],
    [
      "今天",
      "外面",
      "下雨",
      "了",
      "。"
    ]
  ],
  [
    "Meeting at three",
    "Plans & friendship",
    [
      [
        "你明天下午能来吗？",
        "Nǐ míngtiān xiàwǔ néng lái ma?",
        "Can you come tomorrow afternoon?"
      ],
      [
        "我们三点在公园见面。",
        "Wǒmen sān diǎn zài gōngyuán jiànmiàn.",
        "We will meet at the park at three."
      ],
      [
        "以后我们一起玩游戏。",
        "Yǐhòu wǒmen yìqǐ wán yóuxì.",
        "Afterward we will play games together."
      ]
    ],
    [
      "When will they meet?",
      "At three in the afternoon.",
      "At eight in the morning.",
      "Tonight at ten.",
      "On Monday morning."
    ],
    [
      1,
      "见面",
      "见面",
      "睡觉",
      "找钱",
      "上课"
    ],
    [
      "我们",
      "三点",
      "在公园",
      "见面",
      "。"
    ]
  ],
  [
    "A book for a friend",
    "Gifts & possession",
    [
      [
        "我有两本中文书。",
        "Wǒ yǒu liǎng běn Zhōngwén shū.",
        "I have two Chinese books."
      ],
      [
        "我想给朋友一本书。",
        "Wǒ xiǎng gěi péngyou yì běn shū.",
        "I want to give a book to a friend."
      ],
      [
        "她说谢谢，我很高兴。",
        "Tā shuō xièxie, wǒ hěn gāoxìng.",
        "She says thank you, and I am happy."
      ]
    ],
    [
      "What does the speaker give the friend?",
      "A Chinese book.",
      "A cup of tea.",
      "A mobile phone.",
      "A train ticket."
    ],
    [
      1,
      "给朋友",
      "给朋友",
      "跟朋友",
      "听歌",
      "找人"
    ],
    [
      "我",
      "想",
      "给朋友",
      "一本书",
      "。"
    ]
  ],
  [
    "A shop with good fruit",
    "Shopping & money",
    [
      [
        "我们走进一家水果店。",
        "Wǒmen zǒu jìn yì jiā shuǐguǒ diàn.",
        "We enter a fruit shop."
      ],
      [
        "我买了三个苹果。",
        "Wǒ mǎi le sān ge píngguǒ.",
        "I bought three apples."
      ],
      [
        "朋友说这些苹果很好吃。",
        "Péngyou shuō zhèxiē píngguǒ hěn hǎochī.",
        "My friend says these apples are delicious."
      ]
    ],
    [
      "How many apples does the speaker buy?",
      "Three.",
      "Two.",
      "Five.",
      "Eight."
    ],
    [
      1,
      "苹果",
      "苹果",
      "水果",
      "米饭",
      "牛奶"
    ],
    [
      "我",
      "买了",
      "三个",
      "苹果",
      "。"
    ]
  ]
]);
// P25 original grammar-focused connected readings appended after P22.
raw.push(...[["A question about tomorrow","Questions and plans",[["明天你要去学校吗？","Míngtiān nǐ yào qù xuéxiào ma?","Are you going to school tomorrow?"],["我明天没有课，但是要去图书馆。","Wǒ míngtiān méiyǒu kè, dànshì yào qù túshūguǎn.","I have no classes tomorrow, but I am going to the library."],["你呢？你明天想做什么？","Nǐ ne? Nǐ míngtiān xiǎng zuò shénme?","How about you? What do you want to do tomorrow?"]],["Where will the speaker go despite having no classes?","To the library.","To the bank.","To a restaurant.","To the train station."],[1,"但是","但是","因为","或者","所以"],["我明天","没有课","，","但是","要去图书馆","。"]],["A quiet corner","Location and existence",[["教室里有很多学生。","Jiàoshì lǐ yǒu hěn duō xuésheng.","There are many students in the classroom."],["我的朋友坐在窗户旁边。","Wǒ de péngyou zuò zài chuānghu pángbiān.","My friend sits by the window."],["桌子上有一本中文书。","Zhuōzi shàng yǒu yì běn Zhōngwén shū.","There is a Chinese book on the table."]],["Where is the Chinese book?","On the table.","Behind the window.","Inside the schoolbag.","Under the chair."],[2,"一本","一本","一杯","一个","一张"],["桌子上","有","一本","中文书","。"]],["A rainy-day decision","Condition and consequence",[["如果明天下雨，我们就不去公园。","Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù gōngyuán.","If it rains tomorrow, we will not go to the park."],["我们可以在家一起看书。","Wǒmen kěyǐ zài jiā yìqǐ kàn shū.","We can read together at home."],["如果天气好，我们还是去公园吧。","Rúguǒ tiānqì hǎo, wǒmen háishi qù gōngyuán ba.","If the weather is good, let's go to the park after all."]],["What is their plan if it rains?","Read together at home.","Go to the park anyway.","Travel by train.","Buy two books."],[0,"如果","如果","虽然","但是","还是"],["如果","明天下雨","，","我们","就不去公园","。"]],["Comparing two books","Comparison and degree",[["我有两本中文书。","Wǒ yǒu liǎng běn Zhōngwén shū.","I have two Chinese books."],["这本书比那本书容易。","Zhè běn shū bǐ nà běn shū róngyì.","This book is easier than that one."],["但是我最喜欢那本书里的故事。","Dànshì wǒ zuì xǐhuan nà běn shū lǐ de gùshi.","But I like the stories in the other book best."]],["Which book is easier?","This book.","The other book.","They are equally difficult.","The speaker does not say."],[1,"比","比","更","最","很"],["这本书","比","那本书","容易","。"]],["A present for the teacher","Recipients and classifiers",[["今天我们想给老师买礼物。","Jīntiān wǒmen xiǎng gěi lǎoshī mǎi lǐwù.","Today we want to buy a gift for the teacher."],["我们买了一本书和一张卡片。","Wǒmen mǎi le yì běn shū hé yì zhāng kǎpiàn.","We bought a book and a card."],["明天我把礼物给老师。","Míngtiān wǒ bǎ lǐwù gěi lǎoshī.","Tomorrow I will give the gift to the teacher."]],["What do they buy?","A book and a card.","Two cups of tea.","A computer and a phone.","A bus ticket."],[1,"一张","一张","一杯","一本","一个"],["我们","买了","一本书","和","一张卡片","。"]],["Two different abilities","Ability and permission",[["我会说一点中文，但是说得不太好。","Wǒ huì shuō yìdiǎn Zhōngwén, dànshì shuō de bú tài hǎo.","I can speak a little Chinese, but not very well."],["今天我不能去上课，因为我生病了。","Jīntiān wǒ bù néng qù shàng kè, yīnwèi wǒ shēngbìng le.","I cannot attend class today because I am ill."],["老师说我可以在家休息。","Lǎoshī shuō wǒ kěyǐ zài jiā xiūxi.","The teacher says I may rest at home."]],["Why can't the speaker attend class?","They are ill.","They cannot speak Chinese.","They are traveling.","The teacher is absent."],[1,"因为","因为","虽然","但是","或者"],["今天","我不能去上课","，","因为","我生病了","。"]]]);
raw.push(...CONNECTED_READING_ROWS);
raw.push(...BEGINNER_READING_ROWS);
export const STORIES=Object.freeze(raw.map(([title,theme,lines,question,cloze,order,extended,beginner],i)=>Object.freeze({
 id:`story-${String(i+1).padStart(2,'0')}`,title,theme,origin:beginner?(beginner.source==='original-p71'?'original-p71-upper-intermediate-original-reading':beginner.source==='original-p68'?'original-p68-evidence-reading':beginner.source==='original-p51'?'original-p51-register-source-reading':beginner.source==='original-p50'?'original-p50-advanced-source-discourse':beginner.source==='original-p48'?'original-p48-comparative-source-reading':beginner.source==='original-p47'?'original-p47-advanced-connected-reading':beginner.source==='original-p46'?'original-p46-upper-intermediate-reading':beginner.source==='original-p41'?'original-p41-intermediate-reading':beginner.source==='original-p38'?'original-p38-elementary-reading':beginner.source==='original-p34'?'original-p34-beginner-reading':'original-p28-beginner-reading'):extended?'original-p27-connected-reading':'original-editorial-demo',approval:'DEMO_ONLY',officialHskLevel:null,extended:extended||null,beginner:beginner||null,
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
// P23 authored complete words become tappable in the existing reading view.
for(const word of WORDS){
 const current=glossaryMap.get(word.hanzi);
 if(!current)glossaryMap.set(word.hanzi,{hanzi:word.hanzi,pinyin:word.pinyin,english:word.senses[0]||'',lessonIds:[...word.lessonIds],wordKey:word.key});
 else current.wordKey??=word.key;
}
export const GLOSSARY=Object.freeze([...glossaryMap.values()].map(v=>Object.freeze({...v,lessonIds:Object.freeze(v.lessonIds)})));
const tokenWords=[...glossaryMap.keys()].filter(Boolean).sort((a,b)=>b.length-a.length||a.localeCompare(b));
export function tokenizeSentence(hanzi){const result=[];for(let i=0;i<hanzi.length;){const key=tokenWords.find(w=>hanzi.startsWith(w,i));if(key){result.push({text:key,entry:glossaryMap.get(key)});i+=key.length;}else{const ch=String.fromCodePoint(hanzi.codePointAt(i));result.push({text:ch,entry:null});i+=ch.length;}}return result;}
export function storyExercise(story,mode){if(!story||!STORIES_BY_ID.has(story.id))return null;
 if(mode==='comprehension')return {kind:'choice',prompt:story.question.prompt,answer:story.question.answer,options:story.question.options};
 if(mode==='cloze'){const {line,answer,options}=story.cloze;const sentence=story.lines[line].hanzi;const i=sentence.indexOf(answer);if(i<0)return null;return {kind:'choice',prompt:sentence.slice(0,i)+'＿＿'+sentence.slice(i+answer.length),answer,options};}
 if(mode==='ordering'){return {kind:'ordering',prompt:'Put the Chinese chunks in the correct order.',answer:story.order.join(''),chunks:story.order};}
 if(mode==='pronunciation'){
  // P68/P71 authored reading focus is the only source-backed whole-word
  // pronunciation target for these passages. The old glossary fallback could
  // silently quiz an unrelated word instead of the authored reading focus.
  const focus=['original-p68','original-p71'].includes(story.beginner?.source)?
   (story.beginner.p68||story.beginner.p71)?.focusWord:null;
  if(focus){
   const evidence=story.lines.findIndex(line=>line.hanzi.includes(focus.hanzi));
   if(evidence<0||!focus.pinyin||!focus.hanzi)return null;
   return {kind:'pinyin',prompt:`Type the pinyin for ${focus.hanzi} (with tones).`,
    answer:focus.pinyin,display:focus.hanzi,evidence,
    explanation:'The target and pronunciation are from the authored source focus word. This source sentence provides usage context; it does not independently certify all contextual senses or actual spoken pronunciation.'};
  }
  const text=glossaryMap.has(story.cloze.answer)?story.cloze.answer:
   tokenWords.find(w=>story.lines.some(l=>l.hanzi.includes(w)));
  const match=glossaryMap.get(text);if(!match)return null;
  return {kind:'pinyin',prompt:`Type the pinyin for ${text} (with tones).`,answer:match.pinyin,display:text};
 }
 return null;
}
export function shuffledChunkIndices(parts,seed){let order=parts.map((_,i)=>i);let n=[...seed].reduce((a,c)=>(Math.imul(a,33)+c.charCodeAt(0))>>>0,5381);for(let i=order.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[order[i],order[j]]=[order[j],order[i]];}if(order.length>1&&order.every((v,i)=>v===i))order.reverse();return order;}
export function validateStory(story){if(!story||story.approval!=='DEMO_ONLY'||story.officialHskLevel!==null||story.lines.length<3||story.question.options.length!==4||!story.question.options.includes(story.question.answer)||!story.cloze.options.includes(story.cloze.answer)||!story.lines[story.cloze.line].hanzi.includes(story.cloze.answer)||story.order.join('')!==story.lines.find(l=>l.hanzi===story.order.join(''))?.hanzi)return false;return ['comprehension','cloze','ordering','pronunciation'].every(m=>storyExercise(story,m));}

/** Fraction of the story's distinct covered lesson characters that have been introduced.
 * This is not full vocabulary/grammar readability and excludes untaught characters.
 */
export function introducedCharacterCoverage(story,learnedIds){
 const known=new Set(learnedIds);const chars=new Set([...story.lines.map(l=>l.hanzi).join('')]);
 const relevant=DEMO_LESSONS.filter(l=>chars.has(l.hanzi));
 return {introduced:relevant.filter(l=>known.has(l.id)).length,total:relevant.length};
}
