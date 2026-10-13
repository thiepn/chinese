import {P33_SCENARIOS} from './p33-scenarios.mjs';
import {P34_LISTENING} from './p34-course.mjs';
import {P37_SCENES} from './p37-scenarios.mjs';
import {P42_SCENES} from './p42-course.mjs';
import {P44_SCENARIOS} from './p44-course.mjs';
import {P45_TRANSFERS} from './p45-course.mjs';
import {P46_DIALOGUES} from './p46-dialogues.mjs';
import {P47_DIALOGUES} from './p47-dialogues.mjs';
import {P48_DIALOGUES} from './p48-dialogues.mjs';
import {P49_CASES} from './p49-course.mjs';
import {P50_DIALOGUES} from './p50-dialogues.mjs';
import {P51_DIALOGUES} from './p51-dialogues.mjs';
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
// P25 grammar-focused dialogue lessons, appended without renumbering earlier conversations.
data.push(...[["Choosing a lesson",[["A","你今天想学语法还是练习听力？","Nǐ jīntiān xiǎng xué yǔfǎ háishi liànxí tīnglì?","Do you want to study grammar or practice listening today?"],["B","我先学语法，然后练习听力。","Wǒ xiān xué yǔfǎ, ránhòu liànxí tīnglì.","I'll study grammar first, then practice listening."],["A","好，我们先看这个例子。","Hǎo, wǒmen xiān kàn zhège lìzi.","Okay, let's look at this example first."]],[["What will B do first?","Study grammar.","Practice speaking.","Go home."],["What do they look at next?","An example.","A map.","A menu."]]],["This book or that book?",[["A","你喜欢这本书还是那本书？","Nǐ xǐhuan zhè běn shū háishi nà běn shū?","Do you like this book or that one?"],["B","这本书比较容易，但是那本书更有趣。","Zhè běn shū bǐjiào róngyì, dànshì nà běn shū gèng yǒuqù.","This book is relatively easy, but the other one is more interesting."],["A","那我们先读这本吧。","Nà wǒmen xiān dú zhè běn ba.","Then let's read this one first."]],[["Which book is easier?","This book.","That book.","Both are equally easy."],["Which book is more interesting?","That book.","This book.","Neither book."]]],["Asking permission",[["A","老师，我可以进来吗？","Lǎoshī, wǒ kěyǐ jìnlái ma?","Teacher, may I come in?"],["B","可以，请进。","Kěyǐ, qǐng jìn.","Yes, please come in."],["A","对不起，我来晚了。","Duìbuqǐ, wǒ lái wǎn le.","Sorry, I arrived late."]],[["Why does A apologize?","They arrived late.","They lost a textbook.","They missed the train."],["Does B permit A to enter?","Yes.","No.","B does not answer."]]],["After class",[["A","我们下课以后去哪儿？","Wǒmen xià kè yǐhòu qù nǎr?","Where shall we go after class?"],["B","先去书店吧，我想买一本书。","Xiān qù shūdiàn ba, wǒ xiǎng mǎi yì běn shū.","Let's go to the bookstore first; I want to buy a book."],["A","好，然后我们去喝茶。","Hǎo, ránhòu wǒmen qù hē chá.","Okay, then we'll go for tea."]],[["Where will they go first?","The bookstore.","The restaurant.","Home."],["What will they do afterward?","Go for tea.","Take a train.","Go to school."]]],["A plan if it rains",[["A","如果周末下雨，我们怎么办？","Rúguǒ zhōumò xià yǔ, wǒmen zěnme bàn?","What should we do if it rains this weekend?"],["B","那就来我家吧，我们一起做饭。","Nà jiù lái wǒ jiā ba, wǒmen yìqǐ zuò fàn.","Then come to my home; we'll cook together."],["A","好，我可以带水果。","Hǎo, wǒ kěyǐ dài shuǐguǒ.","Okay, I can bring fruit."]],[["What is their rainy-day plan?","Cook together at B's home.","Go to the park.","Study at school."],["What can A bring?","Fruit.","A dictionary.","Train tickets."]]],["A phone call for help",[["A","你好，请问你现在方便吗？","Nǐ hǎo, qǐngwèn nǐ xiànzài fāngbiàn ma?","Hello, is now a convenient time?"],["B","方便，你有什么问题？","Fāngbiàn, nǐ yǒu shénme wèntí?","Yes. What question do you have?"],["A","这个句子我不明白，可以请你解释一下吗？","Zhège jùzi wǒ bù míngbai, kěyǐ qǐng nǐ jiěshì yíxià ma?","I don't understand this sentence. Could you explain it?"]],[["What does A need?","An explanation of a sentence.","A train ticket.","An appointment with a doctor."],["Is B available now?","Yes.","No.","B does not say."]]]]);
// Original P33 scenarios join the historical dialogue catalogue without renumbering.
data.push(...P33_SCENARIOS.map((s,i)=>{
 const wrongA=P33_SCENARIOS[(i+9)%P33_SCENARIOS.length].turns[7][1];
 const wrongB=P33_SCENARIOS[(i+17)%P33_SCENARIOS.length].turns[7][1];
 const completion=[
  'Which Chinese response completes this exchange after: '+s.turns[6][3],
  s.turns[7][1],wrongA,wrongB
 ];
 return [s.title,s.turns,[...s.questions,completion]];
}));
// P34 listening scripts follow historical dialogues without renumbering.
data.push(...P34_LISTENING.map(s=>[s.title,s.lines,s.questions]));
// P37 eight-turn scenarios use the same canonical question/event system.
data.push(...P37_SCENES.map((s,i)=>{
 const otherA=P37_SCENES[(i+11)%P37_SCENES.length].turns[7][1];
 const otherB=P37_SCENES[(i+19)%P37_SCENES.length].turns[7][1];
 return [s.title,s.turns,[...s.questions,
 ['Which Chinese reply completes the final exchange after: '+s.turns[6][3],
  s.turns[7][1],otherA,otherB]]];
}));
// P42 original intermediate spoken scenarios append after all historical dialogue IDs.
data.push(...P42_SCENES.map(s=>[s.title,s.turns,
 s.questions.map(q=>[q.prompt,q.answer,...q.wrong])]));
// P44 original integrated spoken exchanges append after all existing dialogue identities.
data.push(...P44_SCENARIOS.map(s=>[s.title,
 s.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 s.questions.map(q=>[q.prompt,...q.options])]));
// P45 mixed-skill transfer questions append after all historical dialogue IDs.
data.push(...P45_TRANSFERS.map(c=>[c.title,c.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 c.questions.map(q=>[q.prompt,...q.options])]));
// P46 listening scripts append after all P45 and earlier dialogue identities.
data.push(...P46_DIALOGUES.map(d=>[d.title,d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 d.questions.map(q=>[q.prompt,...q.options])]));
// P47 original eight-turn conversations follow all historical native dialogue IDs.
data.push(...P47_DIALOGUES.map(d=>[d.title,
 d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 d.questions.map(q=>[q.prompt,...q.options])]));
// P48 original multi-speaker cases append after all existing dialogue identities.
data.push(...P48_DIALOGUES.map(d=>[d.title,d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),d.questions.map(q=>[q.prompt,...q.options])]));
// P49 cumulative scenarios append without rewriting any earlier dialogue or source ID.
data.push(...P49_CASES.map(c=>[c.title,c.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),c.questions.map(q=>[q.prompt,...q.options])]));
// P50 original three- and four-speaker cases append after all earlier IDs.
data.push(...P50_DIALOGUES.map(d=>[d.title,d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),d.questions.map(q=>[q.prompt,...q.options])]));
// P51 original source- and register-aware listening appends after earlier dialogue identities.
data.push(...P51_DIALOGUES.map(d=>[d.title,d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),d.questions.map(q=>[q.prompt,...q.options])]));
export const DIALOGUES=Object.freeze(data.map(([title,lines,questions],i)=>{
 const id=`dialogue-${String(i+1).padStart(2,'0')}`;
 const p33=P33_SCENARIOS.find(s=>s.title===title)||null;
 const p34=P34_LISTENING.find(s=>s.title===title)||null;
 const p37=P37_SCENES.find(s=>s.title===title)||null;
 const p42=P42_SCENES.find(s=>s.title===title)||null;
 const p44=P44_SCENARIOS.find(s=>s.title===title)||null;
 const p45=P45_TRANSFERS.find(s=>s.title===title)||null;
 const p46=P46_DIALOGUES.find(s=>s.title===title)||null;
 const p47=P47_DIALOGUES.find(s=>s.title===title)||null;
 const p48=P48_DIALOGUES.find(s=>s.title===title)||null;
 const p49=P49_CASES.find(s=>s.title===title)||null;
 const p50=P50_DIALOGUES.find(s=>s.title===title)||null;
 const p51=P51_DIALOGUES.find(s=>s.title===title)||null;
 return Object.freeze({id,title,p33,p34,p37,p42,p44,p45,p46,p47,p48,p49,p50,p51,
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
