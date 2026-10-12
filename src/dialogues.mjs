/** Independent demo conversations. Editorial samples; no official HSK membership or audio qualification. */
const data=[
 ['At the library',[['A','你想看什么书？','Nǐ xiǎng kàn shénme shū?','What book would you like to read?'],['B','我想看一本中文书。','Wǒ xiǎng kàn yì běn Zhōngwén shū.','I want to read a Chinese-language book.'],['A','我们一起找吧。','Wǒmen yìqǐ zhǎo ba.','Let’s look for it together.']],[['What kind of book does B want?','A Chinese-language book.','A book about trains.','A math textbook.'],['What does A suggest doing together?','Looking for the book.','Going home.','Taking a train.']]],
 ['Morning plans',[['A','你今天早上做什么？','Nǐ jīntiān zǎoshang zuò shénme?','What are you doing this morning?'],['B','我先喝水，然后去学校。','Wǒ xiān hē shuǐ, ránhòu qù xuéxiào.','I drink water first, then go to school.'],['A','下午见！','Xiàwǔ jiàn!','See you this afternoon!']],[['What happens first?','B drinks water.','B goes to school.','A buys tea.'],['When do they expect to meet?','In the afternoon.','At midnight.','Tomorrow morning.']]],
 ['Shopping for tea',[['A','你好，你要买什么？','Nǐ hǎo, nǐ yào mǎi shénme?','Hello, what would you like to buy?'],['B','我想买一杯茶。','Wǒ xiǎng mǎi yì bēi chá.','I would like to buy a cup of tea.'],['A','好的，请等一下。','Hǎo de, qǐng děng yíxià.','Certainly, please wait a moment.']],[['What does B order?','A cup of tea.','A glass of water.','A Chinese dictionary.'],['Why does A ask B to wait?','To prepare the requested purchase.','To wait for a train.','To meet at school.']]],
 ['Finding the classroom',[['A','请问，教室在哪儿？','Qǐngwèn, jiàoshì zài nǎr?','Excuse me, where is the classroom?'],['B','在那边，老师也在里面。','Zài nàbiān, lǎoshī yě zài lǐmiàn.','Over there; the teacher is inside too.'],['A','谢谢你！','Xièxie nǐ!','Thank you!']],[['What is A looking for?','The classroom.','A railway station.','A teacup.'],['What does B say about the teacher?','The teacher is inside.','The teacher is at home.','The teacher is on the train.']]],
 ['A rainy afternoon',[['A','外面下雨了。','Wàimiàn xià yǔ le.','It is raining outside.'],['B','那我们在家看书吧。','Nà wǒmen zài jiā kàn shū ba.','Then let’s read at home.'],['A','好，我去拿书。','Hǎo, wǒ qù ná shū.','Okay, I will go get a book.']],[['Why do they stay home?','Because it is raining.','Because it is too late.','Because they missed the train.'],['What will A do next?','Get a book.','Buy an umbrella.','Call a teacher.']]],
 ['Phone invitation',[['A','你明天有时间吗？','Nǐ míngtiān yǒu shíjiān ma?','Do you have time tomorrow?'],['B','明天下午有时间。','Míngtiān xiàwǔ yǒu shíjiān.','I have time tomorrow afternoon.'],['A','我们一起去公园吧。','Wǒmen yìqǐ qù gōngyuán ba.','Let’s go to the park together.']],[['When is B available?','Tomorrow afternoon.','This morning.','Tonight.'],['What is A proposing?','Going to the park together.','Studying at home.','Buying a phone.']]],
 ['Train departure',[['A','火车几点走？','Huǒchē jǐ diǎn zǒu?','At what time does the train leave?'],['B','早上八点。','Zǎoshang bā diǎn.','At eight in the morning.'],['A','我们七点到车站吧。','Wǒmen qī diǎn dào chēzhàn ba.','Let’s arrive at the station at seven.']],[['When does the train leave?','At eight in the morning.','At seven in the evening.','At noon.'],['Why does A suggest arriving at seven?','To arrive before departure.','Because the train leaves at seven.','Because the station closes at eight.']]],
 ['At dinner',[['A','你想吃米饭吗？','Nǐ xiǎng chī mǐfàn ma?','Would you like rice?'],['B','想，我也想喝水。','Xiǎng, wǒ yě xiǎng hē shuǐ.','Yes, and I would also like water.'],['A','好，我们一起吃。','Hǎo, wǒmen yìqǐ chī.','Okay, let’s eat together.']],[['What does B want to drink?','Water.','Coffee.','Milk.'],['Which statement is supported by the conversation?','They will eat together.','B does not want rice.','They are going to the bookstore.']]],
 ['Homework help',[['A','这个问题我不明白。','Zhège wèntí wǒ bù míngbai.','I do not understand this question.'],['B','我再说一次，好吗？','Wǒ zài shuō yí cì, hǎo ma?','Shall I explain it once more?'],['A','谢谢，请慢一点。','Xièxie, qǐng màn yìdiǎn.','Thank you, a little slower please.']],[['What difficulty does A have?','Understanding the question.','Finding a train.','Buying a new book.'],['What does A ask B to change?','Speak more slowly.','Speak more loudly.','Leave the room.']]],
 ['Evening routine',[['A','你晚上常常做什么？','Nǐ wǎnshang chángcháng zuò shénme?','What do you often do in the evening?'],['B','我先写作业，再看书。','Wǒ xiān xiě zuòyè, zài kàn shū.','I do homework first, then read.'],['A','我晚上常常听音乐。','Wǒ wǎnshang chángcháng tīng yīnyuè.','I often listen to music at night.']],[['Which activity does B do first?','Homework.','Reading.','Listening to music.'],['How are the speakers’ routines different?','A often listens to music; B does homework and reads.','Both only watch films.','Neither reads books.']]]
];
// P22 original conversations; existing dialogue IDs and histories remain unchanged.
data.push(...[
  [
    "First day in class",
    [
      [
        "A",
        "你好，你是新来的学生吗？",
        "Nǐ hǎo, nǐ shì xīn lái de xuésheng ma?",
        "Hello, are you a new student?"
      ],
      [
        "B",
        "是的，我叫小林。",
        "Shì de, wǒ jiào Xiǎolín.",
        "Yes, my name is Xiaolin."
      ],
      [
        "A",
        "欢迎！请坐这里。",
        "Huānyíng! Qǐng zuò zhèlǐ.",
        "Welcome! Please sit here."
      ]
    ],
    [
      [
        "Who is B?",
        "A new student.",
        "A bus driver.",
        "A shopkeeper."
      ],
      [
        "What does A ask B to do?",
        "Sit here.",
        "Buy a book.",
        "Call a friend."
      ]
    ]
  ],
  [
    "At the fruit shop",
    [
      [
        "A",
        "请问，这些苹果多少钱？",
        "Qǐngwèn, zhèxiē píngguǒ duōshao qián?",
        "Excuse me, how much are these apples?"
      ],
      [
        "B",
        "三个十五元。",
        "Sān ge shíwǔ yuán.",
        "Fifteen yuan for three."
      ],
      [
        "A",
        "好，我要三个，谢谢。",
        "Hǎo, wǒ yào sān ge, xièxie.",
        "All right, I would like three, thank you."
      ]
    ],
    [
      [
        "How much are three apples?",
        "Fifteen yuan.",
        "Three yuan.",
        "Fifty yuan."
      ],
      [
        "How many apples does A buy?",
        "Three.",
        "Five.",
        "One."
      ]
    ]
  ],
  [
    "Finding the bank",
    [
      [
        "A",
        "请问，银行在哪边？",
        "Qǐngwèn, yínháng zài nǎbiān?",
        "Excuse me, which way is the bank?"
      ],
      [
        "B",
        "在书店左边。",
        "Zài shūdiàn zuǒbiān.",
        "To the left of the bookstore."
      ],
      [
        "A",
        "谢谢，我知道了。",
        "Xièxie, wǒ zhīdào le.",
        "Thanks, I understand now."
      ]
    ],
    [
      [
        "Where is the bank?",
        "To the left of the bookstore.",
        "Inside the bookstore.",
        "Behind the station."
      ],
      [
        "What does A say at the end?",
        "They understand the direction.",
        "They cannot walk.",
        "They need a ticket."
      ]
    ]
  ],
  [
    "Arranging a meeting",
    [
      [
        "A",
        "你明天能来我家吗？",
        "Nǐ míngtiān néng lái wǒ jiā ma?",
        "Can you come to my home tomorrow?"
      ],
      [
        "B",
        "能。我们几点见面？",
        "Néng. Wǒmen jǐ diǎn jiànmiàn?",
        "Yes. What time shall we meet?"
      ],
      [
        "A",
        "下午三点吧。",
        "Xiàwǔ sān diǎn ba.",
        "How about three in the afternoon?"
      ]
    ],
    [
      [
        "When will they meet?",
        "Tomorrow afternoon at three.",
        "Today at eight.",
        "Tonight at ten."
      ],
      [
        "What place does A suggest?",
        "A's home.",
        "The library.",
        "The station."
      ]
    ]
  ],
  [
    "A cold evening",
    [
      [
        "A",
        "外面很冷，你想喝什么？",
        "Wàimiàn hěn lěng, nǐ xiǎng hē shénme?",
        "It is cold outside. What would you like to drink?"
      ],
      [
        "B",
        "我想喝一杯热茶。",
        "Wǒ xiǎng hē yì bēi rè chá.",
        "I would like a cup of hot tea."
      ],
      [
        "A",
        "好，我也喝茶。",
        "Hǎo, wǒ yě hē chá.",
        "Okay, I will have tea too."
      ]
    ],
    [
      [
        "What drink does B want?",
        "Hot tea.",
        "Cold water.",
        "Milk."
      ],
      [
        "What does A decide?",
        "Also to drink tea.",
        "To go shopping.",
        "To eat fish."
      ]
    ]
  ],
  [
    "What should we cook?",
    [
      [
        "A",
        "今天晚上我们做什么饭？",
        "Jīntiān wǎnshang wǒmen zuò shénme fàn?",
        "What meal shall we cook tonight?"
      ],
      [
        "B",
        "我想吃米饭和鱼。",
        "Wǒ xiǎng chī mǐfàn hé yú.",
        "I want rice and fish."
      ],
      [
        "A",
        "好，我去买菜。",
        "Hǎo, wǒ qù mǎi cài.",
        "All right, I will go buy groceries."
      ]
    ],
    [
      [
        "What does B want to eat?",
        "Rice and fish.",
        "A bowl of noodles.",
        "Fruit only."
      ],
      [
        "What will A do?",
        "Buy groceries.",
        "Meet the teacher.",
        "Go to sleep."
      ]
    ]
  ]
]);
export const DIALOGUES=Object.freeze(data.map(([title,lines,questions],i)=>{
 const id=`dialogue-${String(i+1).padStart(2,'0')}`;
 return Object.freeze({id,title,
  lines:Object.freeze(lines.map(([speaker,hanzi,pinyin,english])=>Object.freeze({speaker,hanzi,pinyin,english}))),
  questions:Object.freeze(questions.map(([prompt,answer,...wrong],j)=>Object.freeze({
   id:`${id}:q${j}`,prompt,answer,options:Object.freeze([answer,...wrong].sort((a,b)=>a.localeCompare(b)))
  })))
 });
}));
export const findDialogue=id=>DIALOGUES.find(d=>d.id===id)||null;
export function dialogueQuestion(id,number=0){const d=findDialogue(id);return d?.questions[number]||null;}
export function validateDialogueEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid dialogue history');const seen=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||seen.has(e.id)||(!Number.isInteger(e.question)||!dialogueQuestion(e.dialogueId,e.question))||!Number.isFinite(e.at)||e.at<0||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean')throw Error('Invalid dialogue event');seen.add(e.id)}return true;}
export function addDialogueEvent(state,{id,dialogueId,question,answer,assisted=false,at=Date.now()}){if(!Number.isInteger(question)||!dialogueQuestion(dialogueId,question)||typeof answer!=='string'||typeof id!=='string'||!id||id.length>100||typeof assisted!=='boolean'||!Number.isFinite(at)||at<0)throw Error('Invalid dialogue answer');const next=structuredClone(state);next.dialogueEvents??=[];if(next.dialogueEvents.some(e=>e.id===id))return next;const correct=answer===dialogueQuestion(dialogueId,question).answer;next.dialogueEvents.push({id,dialogueId,question,correct,assisted,at});validateDialogueEvents(next.dialogueEvents);return next;}
export function dialogueSummary(state){const events=state.dialogueEvents||[];return {attempts:events.length,independent:events.filter(e=>e.correct&&!e.assisted).length,practiced:new Set(events.map(e=>e.dialogueId)).size};}
