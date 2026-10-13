/** P26 original authored sentence transformations and contrasts. */
export const SENTENCE_VARIATIONS=Object.freeze([
  {
    "base": "我是新来的学生。",
    "hanzi": "我不是新来的学生。",
    "pinyin": "Wǒ bú shì xīn lái de xuésheng.",
    "english": "I am not a new student here.",
    "explanation": "Negate identity with 不是.",
    "kind": "negation"
  },
  {
    "base": "你叫什么名字？",
    "hanzi": "请问您叫什么名字？",
    "pinyin": "Qǐngwèn nín jiào shénme míngzi?",
    "english": "May I ask what your name is?",
    "explanation": "Add 请问 and respectful 您 to make the question more formal.",
    "kind": "politeness"
  },
  {
    "base": "我认识那位老师。",
    "hanzi": "我不认识那位老师。",
    "pinyin": "Wǒ bú rènshi nà wèi lǎoshī.",
    "english": "I don't know that teacher.",
    "explanation": "不 negates present acquaintance.",
    "kind": "negation"
  },
  {
    "base": "我家有四口人。",
    "hanzi": "你家有几口人？",
    "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
    "english": "How many people are in your family?",
    "explanation": "Use 几 and the family classifier 口 to ask for a count.",
    "kind": "question"
  },
  {
    "base": "我想给妈妈打个电话。",
    "hanzi": "你想给妈妈打电话吗？",
    "pinyin": "Nǐ xiǎng gěi māma dǎ diànhuà ma?",
    "english": "Would you like to call your mother?",
    "explanation": "Change the subject and add 吗 for a yes–no question.",
    "kind": "question"
  },
  {
    "base": "我每天六点半起床。",
    "hanzi": "我今天七点起床。",
    "pinyin": "Wǒ jīntiān qī diǎn qǐchuáng.",
    "english": "I got up at seven today.",
    "explanation": "Replace the habitual time with a specific day and time.",
    "kind": "time"
  },
  {
    "base": "我正在厨房准备早餐。",
    "hanzi": "我已经准备好早餐了。",
    "pinyin": "Wǒ yǐjīng zhǔnbèi hǎo zǎocān le.",
    "english": "I've already prepared breakfast.",
    "explanation": "Contrast ongoing preparation with completed preparation.",
    "kind": "aspect"
  },
  {
    "base": "我坐公交车去上班。",
    "hanzi": "我今天骑车去上班。",
    "pinyin": "Wǒ jīntiān qí chē qù shàngbān.",
    "english": "I'm cycling to work today.",
    "explanation": "Change the transport and specify the day.",
    "kind": "transport"
  },
  {
    "base": "这个词是什么意思？",
    "hanzi": "这句话是什么意思？",
    "pinyin": "Zhè jù huà shì shénme yìsi?",
    "english": "What does this sentence mean?",
    "explanation": "Use 句话 for a complete utterance rather than 词 for a word.",
    "kind": "classifier"
  },
  {
    "base": "你能再说一遍吗？",
    "hanzi": "请你再说慢一点。",
    "pinyin": "Qǐng nǐ zài shuō màn yìdiǎn.",
    "english": "Please say it more slowly again.",
    "explanation": "Replace a yes–no request with a polite imperative.",
    "kind": "request"
  },
  {
    "base": "我把不认识的字写下来。",
    "hanzi": "我把新词记在本子上。",
    "pinyin": "Wǒ bǎ xīn cí jì zài běnzi shàng.",
    "english": "I write new words in my notebook.",
    "explanation": "Compare writing down unknown characters with recording vocabulary.",
    "kind": "object"
  },
  {
    "base": "我想借一本简单的中文书。",
    "hanzi": "我想买一本简单的中文书。",
    "pinyin": "Wǒ xiǎng mǎi yì běn jiǎndān de Zhōngwén shū.",
    "english": "I want to buy an easy Chinese book.",
    "explanation": "Replace 借 borrow with 买 buy; the object pattern stays the same.",
    "kind": "verb"
  },
  {
    "base": "图书馆星期日开门吗？",
    "hanzi": "图书馆星期日不开门。",
    "pinyin": "Túshūguǎn xīngqīrì bù kāimén.",
    "english": "The library is not open on Sunday.",
    "explanation": "Use 不 to negate the usual opening pattern.",
    "kind": "negation"
  },
  {
    "base": "这本词典比那本轻。",
    "hanzi": "那本词典比这本重。",
    "pinyin": "Nà běn cídiǎn bǐ zhè běn zhòng.",
    "english": "That dictionary is heavier than this one.",
    "explanation": "Swap comparison order and use the opposing adjective.",
    "kind": "comparison"
  },
  {
    "base": "我想点一碗牛肉面。",
    "hanzi": "我想点两碗牛肉面。",
    "pinyin": "Wǒ xiǎng diǎn liǎng wǎn niúròu miàn.",
    "english": "I'd like to order two bowls of beef noodles.",
    "explanation": "Use 两 before the classifier 碗 for two bowls.",
    "kind": "classifier"
  },
  {
    "base": "这个菜有辣椒吗？",
    "hanzi": "这个菜没有辣椒。",
    "pinyin": "Zhège cài méiyǒu làjiāo.",
    "english": "This dish doesn't contain chili peppers.",
    "explanation": "Turn an existence question into a negative statement with 没有.",
    "kind": "negation"
  },
  {
    "base": "你想喝热茶还是冰水？",
    "hanzi": "你想喝热茶吗？",
    "pinyin": "Nǐ xiǎng hē rè chá ma?",
    "english": "Would you like hot tea?",
    "explanation": "Change an alternative question with 还是 to a yes–no question with 吗.",
    "kind": "question"
  },
  {
    "base": "苹果今天多少钱一斤？",
    "hanzi": "苹果今天十块钱一斤。",
    "pinyin": "Píngguǒ jīntiān shí kuài qián yì jīn.",
    "english": "The apples are ten yuan per jin today.",
    "explanation": "Replace the price question with a price statement.",
    "kind": "price"
  },
  {
    "base": "我想买两斤新鲜的橘子。",
    "hanzi": "我想买一斤新鲜的橘子。",
    "pinyin": "Wǒ xiǎng mǎi yì jīn xīnxiān de júzi.",
    "english": "I'd like to buy one jin of fresh mandarins.",
    "explanation": "Change the quantity and use 一 before the unit 斤.",
    "kind": "quantity"
  },
  {
    "base": "你们可以用手机付款吗？",
    "hanzi": "我们可以用现金付款吗？",
    "pinyin": "Wǒmen kěyǐ yòng xiànjīn fùkuǎn ma?",
    "english": "Can we pay in cash?",
    "explanation": "Use 用 to identify a payment method and change the subject.",
    "kind": "payment"
  },
  {
    "base": "我想试一下这件外套。",
    "hanzi": "我想试一下那件外套。",
    "pinyin": "Wǒ xiǎng shì yíxià nà jiàn wàitào.",
    "english": "I'd like to try on that jacket.",
    "explanation": "Contrast 这 near with 那 farther away or previously mentioned.",
    "kind": "demonstrative"
  },
  {
    "base": "蓝色的比黑色的便宜。",
    "hanzi": "黑色的比蓝色的贵。",
    "pinyin": "Hēisè de bǐ lánsè de guì.",
    "english": "The black one is more expensive than the blue one.",
    "explanation": "Reverse both the comparison order and adjective.",
    "kind": "comparison"
  },
  {
    "base": "我买这件，不买那件。",
    "hanzi": "我买那件，不买这件。",
    "pinyin": "Wǒ mǎi nà jiàn, bù mǎi zhè jiàn.",
    "english": "I'll buy that one, not this one.",
    "explanation": "Swap the demonstratives to reverse the choice.",
    "kind": "contrast"
  },
  {
    "base": "请问最近的地铁站在哪里？",
    "hanzi": "请问最近的公交车站在哪里？",
    "pinyin": "Qǐngwèn zuìjìn de gōngjiāochē zhàn zài nǎlǐ?",
    "english": "Where is the nearest bus stop?",
    "explanation": "Replace the station type without moving the question word.",
    "kind": "question"
  },
  {
    "base": "到了路口以后向左转。",
    "hanzi": "到了路口以后向右转。",
    "pinyin": "Dào le lùkǒu yǐhòu xiàng yòu zhuǎn.",
    "english": "Turn right after reaching the intersection.",
    "explanation": "Opposite directions with 左 and 右.",
    "kind": "direction"
  },
  {
    "base": "走路过去大概需要十分钟。",
    "hanzi": "坐公交车过去大概需要五分钟。",
    "pinyin": "Zuò gōngjiāochē guòqù dàgài xūyào wǔ fēnzhōng.",
    "english": "It takes about five minutes to get there by bus.",
    "explanation": "Change the means of transport and approximate duration.",
    "kind": "time"
  },
  {
    "base": "我想买一张明天早上的票。",
    "hanzi": "我想买两张明天晚上的票。",
    "pinyin": "Wǒ xiǎng mǎi liǎng zhāng míngtiān wǎnshang de piào.",
    "english": "I'd like to buy two tickets for tomorrow evening.",
    "explanation": "Practice 两张 with tickets and change the time.",
    "kind": "classifier"
  },
  {
    "base": "这趟车需要换车吗？",
    "hanzi": "这趟车不需要换车。",
    "pinyin": "Zhè tàng chē bù xūyào huàn chē.",
    "english": "No transfer is needed on this service.",
    "explanation": "Negate necessity with 不需要.",
    "kind": "negation"
  },
  {
    "base": "火车晚点了，我们可能赶不上下一班车。",
    "hanzi": "火车准时到了，我们能赶上下一班车。",
    "pinyin": "Huǒchē zhǔnshí dào le, wǒmen néng gǎn shàng xià yì bān chē.",
    "english": "The train arrived on time, so we can catch the next one.",
    "explanation": "Contrast a delayed arrival and uncertain connection with being on time.",
    "kind": "consequence"
  },
  {
    "base": "下午可能会下大雨。",
    "hanzi": "下午不会下雨。",
    "pinyin": "Xiàwǔ bú huì xià yǔ.",
    "english": "It won't rain this afternoon.",
    "explanation": "Contrast possibility 可能会 with negative prediction 不会.",
    "kind": "modality"
  },
  {
    "base": "如果明天天气好，我们就骑车。",
    "hanzi": "如果明天下雨，我们就坐公交车。",
    "pinyin": "Rúguǒ míngtiān xià yǔ, wǒmen jiù zuò gōngjiāochē.",
    "english": "If it rains tomorrow, we'll take the bus.",
    "explanation": "Keep the 如果…就… structure while changing the condition and outcome.",
    "kind": "conditional"
  },
  {
    "base": "我今天有点不舒服。",
    "hanzi": "我今天感觉很好。",
    "pinyin": "Wǒ jīntiān gǎnjué hěn hǎo.",
    "english": "I feel very well today.",
    "explanation": "Compare feeling unwell with feeling fine.",
    "kind": "description"
  },
  {
    "base": "我昨天晚上开始头疼。",
    "hanzi": "我今天早上不头疼了。",
    "pinyin": "Wǒ jīntiān zǎoshang bù tóuténg le.",
    "english": "My headache had stopped by this morning.",
    "explanation": "Sentence-final 了 can mark a change of state.",
    "kind": "aspect"
  },
  {
    "base": "我每周去两次健身房。",
    "hanzi": "我每周去三次健身房。",
    "pinyin": "Wǒ měi zhōu qù sān cì jiànshēnfáng.",
    "english": "I go to the gym three times a week.",
    "explanation": "次数 counts frequency with 次.",
    "kind": "frequency"
  },
  {
    "base": "今天下午有一个重要的会议。",
    "hanzi": "今天下午没有会议。",
    "pinyin": "Jīntiān xiàwǔ méiyǒu huìyì.",
    "english": "There is no meeting this afternoon.",
    "explanation": "Negate the existence of a meeting with 没有.",
    "kind": "negation"
  },
  {
    "base": "你现在方便接电话吗？",
    "hanzi": "我现在不方便接电话。",
    "pinyin": "Wǒ xiànzài bù fāngbiàn jiē diànhuà.",
    "english": "It isn't convenient for me to take a call now.",
    "explanation": "Use 不方便 to decline a request politely.",
    "kind": "politeness"
  },
  {
    "base": "请把窗户打开一点。",
    "hanzi": "请把窗户关上一点。",
    "pinyin": "Qǐng bǎ chuānghu guān shàng yìdiǎn.",
    "english": "Please close the window a little.",
    "explanation": "Contrast 打开 opening with 关上 closing.",
    "kind": "verb"
  },
  {
    "base": "这个星期六你有时间吗？",
    "hanzi": "我星期六下午有时间。",
    "pinyin": "Wǒ xīngqīliù xiàwǔ yǒu shíjiān.",
    "english": "I am free on Saturday afternoon.",
    "explanation": "Replace an availability question with a time-specific reply.",
    "kind": "time"
  },
  {
    "base": "对不起，我刚才说错了。",
    "hanzi": "对不起，我刚才听错了。",
    "pinyin": "Duìbuqǐ, wǒ gāngcái tīng cuò le.",
    "english": "Sorry, I misheard just now.",
    "explanation": "Compare 说错 speak incorrectly with 听错 mishear.",
    "kind": "result"
  },
  {
    "base": "这个办法比较快，但是贵一点。",
    "hanzi": "这个办法比较慢，但是便宜一点。",
    "pinyin": "Zhège bànfǎ bǐjiào màn, dànshì piányi yìdiǎn.",
    "english": "This method is relatively slow but a little cheaper.",
    "explanation": "Contrast speed against cost using 但是.",
    "kind": "contrast"
  },
  {
    "base": "我把声调写错了。",
    "hanzi": "我把声调改对了。",
    "pinyin": "Wǒ bǎ shēngdiào gǎi duì le.",
    "english": "I corrected the tone.",
    "explanation": "Use result complements 错 and 对 to distinguish incorrect and correct results.",
    "kind": "result"
  },
  {
    "base": "我们把会议改到下午吧。",
    "hanzi": "我们把会议改到明天早上吧。",
    "pinyin": "Wǒmen bǎ huìyì gǎi dào míngtiān zǎoshang ba.",
    "english": "Let's move the meeting to tomorrow morning.",
    "explanation": "The destination time follows 改到.",
    "kind": "time"
  },
  {
    "base": "你好，我订了一个房间。",
    "hanzi": "你好，我想订一个房间。",
    "pinyin": "Nǐ hǎo, wǒ xiǎng dìng yí ge fángjiān.",
    "english": "Hello, I'd like to book a room.",
    "explanation": "Contrast completed booking with desire to book.",
    "kind": "aspect"
  },
  {
    "base": "我最近开始学中国画。",
    "hanzi": "我去年开始学中国画。",
    "pinyin": "Wǒ qùnián kāishǐ xué Zhōngguóhuà.",
    "english": "I started learning Chinese painting last year.",
    "explanation": "Change the time expression from recently to last year.",
    "kind": "time"
  },
  {
    "base": "因为车票太贵，我改了计划。",
    "hanzi": "因为天气不好，我改了计划。",
    "pinyin": "Yīnwèi tiānqì bù hǎo, wǒ gǎi le jìhuà.",
    "english": "I changed my plan because the weather was bad.",
    "explanation": "Replace the cause while preserving 因为.",
    "kind": "reason"
  },
  {
    "base": "我们已经两年没有见面了。",
    "hanzi": "我们上个月刚见过面。",
    "pinyin": "Wǒmen shàng ge yuè gāng jiàn guo miàn.",
    "english": "We only just met last month.",
    "explanation": "Contrast long absence with a recent meeting.",
    "kind": "aspect"
  }
]);
