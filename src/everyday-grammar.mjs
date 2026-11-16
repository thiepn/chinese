/** Everyday Grammar Core: beginner grammar holes audited as missing from the
 * grammar course (V-not-V questions, particles, prohibition, reduplication,
 * degree/quantity words, numbers and money, nominalizing 的, time clauses,
 * aspectual directionals, causatives, 把/被 depth, direction prepositions,
 * topic-comment). Rows follow the grammar-course 12-field schema and are
 * ordered by learning difficulty, HSK1 staples first.
 * Educational material only; no official syllabus or exam membership claims.
 */
export const EVERYDAY_GRAMMAR_ROWS=[
  [
    "g165",
    "Questions",
    "A-not-A questions with 是不是 and 有没有",
    "是不是 / 有没有 + rest of the statement",
    "A-not-A questions repeat the word inside the question: 是不是 means \"is it or isn't it\" and 有没有 means \"have or haven't\". The answer word (是/不是, 有/没有) comes first in the reply.",
    "A 吗 question wraps the whole statement (你是学生吗？); an A-not-A question builds the choice into the verb itself and expects a direct answer.",
    "Do not mix the halves: it is 是不是 with 是 and 有没有 with 有 — never 是没有 or 有没有吗.",
    "是",
    [
      "你是不是学生？",
      "Nǐ shì bu shì xuésheng?",
      "Are you a student?"
    ],
    [
      "你有没有时间？",
      "Nǐ yǒu mei yǒu shíjiān?",
      "Do you have time?"
    ],
    [
      "他＿＿老师？",
      "是不是",
      "有没有",
      "是吗",
      "他是不是老师？",
      "Tā shì bu shì lǎoshī?",
      "Is he a teacher?"
    ],
    [
      "Ask about the student with A-not-A: 你是学生。",
      "你是不是学生？",
      "Nǐ shì bu shì xuésheng?",
      "Are you a student?",
      [
        "你",
        "是不是",
        "学生",
        "？"
      ]
    ]
  ],
  [
    "g166",
    "Questions",
    "A-not-A questions with verbs and adjectives",
    "Verb + 不 + verb / Adjective + 不 + adjective",
    "Any verb or adjective can repeat around 不 to offer the choice: 去不去 \"go or not\", 好不好 \"good or not\". The full word repeats: 去不去, not 去不.",
    "吗 questions ask whether something is true; V-not-V asks the listener to choose between the two halves, so it sounds more direct.",
    "Repeat the whole verb or adjective on both sides of 不; leaving the second half unfinished is not a question.",
    "好",
    [
      "你去不去学校？",
      "Nǐ qù bu qù xuéxiào?",
      "Are you going to school?"
    ],
    [
      "这个苹果好不好吃？",
      "Zhège píngguǒ hǎo bu hǎo chī?",
      "Is this apple tasty?"
    ],
    [
      "你＿＿茶？",
      "喝不喝",
      "不喝吗",
      "喝过吗",
      "你喝不喝茶？",
      "Nǐ hē bu hē chá?",
      "Do you drink tea?"
    ],
    [
      "Ask about the weather with A-not-A: 今天天气很好。",
      "今天天气好不好？",
      "Jīntiān tiānqì hǎo bu hǎo?",
      "Is the weather good today?",
      [
        "今天",
        "天气",
        "好不",
        "好",
        "？"
      ]
    ]
  ],
  [
    "g167",
    "Questions",
    "Sentence-final 吧 for suggestions and guesses",
    "Statement + 吧",
    "吧 turns a statement into a suggestion or a guess the speaker already leans toward: 我们喝茶吧 \"let's drink tea\", 你是老师吧 \"you're a teacher, right?\".",
    "吗 asks a neutral question with no expectation; 呢 asks back about the listener (你呢？ \"and you?\"). 吧 already carries the speaker's assumption.",
    "Do not use 吧 for a genuine neutral question — it can sound like you have already decided the answer.",
    "你",
    [
      "我们喝茶吧。",
      "Wǒmen hē chá ba.",
      "Let's drink tea."
    ],
    [
      "你是老师吧？",
      "Nǐ shì lǎoshī ba?",
      "You are a teacher, right?"
    ],
    [
      "我们回家＿＿。",
      "吧",
      "吗",
      "呢",
      "我们回家吧。",
      "Wǒmen huí jiā ba.",
      "Let's go home."
    ],
    [
      "Turn the guess into a neutral question: 你是老师吧。",
      "你是老师吗？",
      "Nǐ shì lǎoshī ma?",
      "Are you a teacher?",
      [
        "你",
        "是",
        "老师",
        "吗",
        "？"
      ]
    ]
  ],
  [
    "g168",
    "Foundations",
    "Prohibition and permission: 别, 不用",
    "别 + verb / 不用 + verb",
    "别 before a verb tells someone not to do it: 别说话！ \"don't talk!\". 不用 says the action is not necessary: 你不用等我 \"you don't need to wait for me\".",
    "不 negates what someone does or chooses not to do (我不去学校); 别 and 不用 address someone else's action — prohibition or permission.",
    "别 is for telling other people; don't use it to describe yourself not doing something.",
    "不",
    [
      "别说话！",
      "Bié shuōhuà!",
      "Don't talk!"
    ],
    [
      "你不用等我。",
      "Nǐ bú yòng děng wǒ.",
      "You don't need to wait for me."
    ],
    [
      "＿＿看我的手机。",
      "别",
      "不用",
      "没",
      "别看我的手机。",
      "Bié kàn wǒ de shǒujī.",
      "Don't look at my phone."
    ],
    [
      "Turn the request into a prohibition: 你看我的手机。",
      "你别看我的手机。",
      "Nǐ bié kàn wǒ de shǒujī.",
      "Don't look at my phone.",
      [
        "你",
        "别",
        "看",
        "我的",
        "手机",
        "。"
      ]
    ]
  ],
  [
    "g169",
    "Actions & aspect",
    "Verb reduplication and V一V",
    "Verb + verb (看看) / Verb + 一 + verb (看一看)",
    "Repeating a verb makes the action brief and casual: 看看 \"take a look\", 看一看 \"have a quick look\". It softens suggestions and marks quick attempts.",
    "看 is just the action \"look/read\"; 看看 adds \"briefly or casually\" — a small difference that changes the tone of the sentence.",
    "Reduplication suits short, casual actions; don't use it for long or serious activity (say 我每天学习中文, not 我学习学习中文).",
    "看",
    [
      "我想看看这本书。",
      "Wǒ xiǎng kànkan zhè běn shū.",
      "I want to take a look at this book."
    ],
    [
      "我想看一看。",
      "Wǒ xiǎng kàn yi kàn.",
      "I want to take a quick look."
    ],
    [
      "我想＿＿那本书。",
      "看看",
      "看了",
      "看吗",
      "我想看看那本书。",
      "Wǒ xiǎng kànkan nà běn shū.",
      "I want to take a look at that book."
    ],
    [
      "Make the action brief and casual: 你看这本书。",
      "你看看这本书。",
      "Nǐ kànkan zhè běn shū.",
      "Take a look at this book.",
      [
        "你",
        "看看",
        "这",
        "本",
        "书",
        "。"
      ]
    ]
  ],
  [
    "g170",
    "Nouns & classifiers",
    "有点儿 before an adjective, 一点儿 after it",
    "有点儿 + adjective / adjective + 一点儿",
    "有点儿 comes before the adjective and usually sounds like a complaint: 有点儿冷 \"a bit cold (and unpleasant)\". 一点儿 follows the adjective in requests and comparisons: 便宜一点儿 \"a bit cheaper\".",
    "Before a noun 一点 marks a quantity (一点水 \"a little water\"); after an adjective it means \"a bit more\" and is often written 一点儿.",
    "The positions never swap: 有点儿贵 is right, 贵有点儿 is wrong; 贵一点儿 is right, 一点儿贵 is wrong.",
    "点",
    [
      "这个房间有点儿小。",
      "Zhège fángjiān yǒudiǎnr xiǎo.",
      "This room is a bit small."
    ],
    [
      "我要大一点儿的。",
      "Wǒ yào dà yìdiǎnr de.",
      "I want a slightly bigger one."
    ],
    [
      "今天有点儿＿＿。",
      "冷",
      "多",
      "好",
      "今天有点儿冷。",
      "Jīntiān yǒudiǎnr lěng.",
      "Today is a bit cold."
    ],
    [
      "Make the request softer: 便宜。",
      "便宜一点儿。",
      "Piányi yìdiǎnr.",
      "A bit cheaper.",
      [
        "便宜",
        "一点儿",
        "。"
      ]
    ]
  ],
  [
    "g171",
    "Nouns & classifiers",
    "Counting with measure words and 一些",
    "Number + measure word + noun / 一些 + noun",
    "Chinese counts nouns through a measure word: 三本书 \"three books\" (本 measures books), 两个学生 \"two students\". 一些 means \"some\": 一些水 \"some water\". 这些/那些 mean \"these/those\".",
    "一些 names an unspecified amount; 一点儿 stresses that the amount is small (喝一点儿水 \"drink a little water\").",
    "Never put a number directly before a noun: 三书 is wrong — the measure word 本 must appear: 三本书.",
    "多",
    [
      "我想买一些水果。",
      "Wǒ xiǎng mǎi yìxiē shuǐguǒ.",
      "I want to buy some fruit."
    ],
    [
      "桌上有三本书。",
      "Zhuō shàng yǒu sān běn shū.",
      "There are three books on the table."
    ],
    [
      "我想喝＿＿水。",
      "一些",
      "三本",
      "本",
      "我想喝一些水。",
      "Wǒ xiǎng hē yìxiē shuǐ.",
      "I want to drink some water."
    ],
    [
      "Count the books with a measure word: 桌上有书。",
      "桌上有三本书。",
      "Zhuō shàng yǒu sān běn shū.",
      "There are three books on the table.",
      [
        "桌上",
        "有",
        "三",
        "本",
        "书",
        "。"
      ]
    ]
  ],
  [
    "g172",
    "Nouns & classifiers",
    "Hundreds, thousands and ordinals with 第",
    "百 / 千 / 万 for large numbers; 第 + number for order",
    "三百 is 300 (three hundred), 五千 is 5,000 (five thousand), 一万 is 10,000 (ten thousand). 第 before a number gives order: 第一 \"first\", 第二 \"second\", 第三个人 \"the third person\".",
    "二 is the numeral \"two\" inside numbers (十二 \"twelve\"); 两 is used before measure words (两本书 \"two books\", 两千 \"two thousand\").",
    "Ordinals put 第 first: 第三 is \"the third\"; 三第 is never correct.",
    "年",
    [
      "这个学校有两千个学生。",
      "Zhège xuéxiào yǒu liǎng qiān ge xuésheng.",
      "This school has two thousand students."
    ],
    [
      "第一个人是我的老师。",
      "Dì yī ge rén shì wǒ de lǎoshī.",
      "The first person is my teacher."
    ],
    [
      "一年有三百六十五＿＿。",
      "天",
      "月",
      "个",
      "一年有三百六十五天。",
      "Yì nián yǒu sān bǎi liùshíwǔ tiān.",
      "A year has 365 days."
    ],
    [
      "Make it an ordinal: 三个人。",
      "第三个人。",
      "Dì sān ge rén.",
      "The third person.",
      [
        "第",
        "三",
        "个",
        "人",
        "。"
      ]
    ]
  ],
  [
    "g173",
    "Nouns & classifiers",
    "Prices with 多少钱, 块 and 毛",
    "这个多少钱？ / …块…毛",
    "Ask the price with 多少钱: 这本书多少钱？ \"how much is this book?\". 块 is the spoken unit of one yuan; 毛 is a tenth of a yuan: 三块五毛 \"three yuan fifty\".",
    "多少 asks \"how many/how much\" in general (多少人 \"how many people\"); 多少钱 asks specifically about price.",
    "毛 is a tenth of a yuan: 五毛 is 0.5 yuan, not five yuan.",
    "钱",
    [
      "这本书多少钱？",
      "Zhè běn shū duōshao qián?",
      "How much is this book?"
    ],
    [
      "一杯茶五块钱。",
      "Yì bēi chá wǔ kuài qián.",
      "One cup of tea costs five yuan."
    ],
    [
      "这个手机多少＿＿？",
      "钱",
      "人",
      "水",
      "这个手机多少钱？",
      "Zhège shǒujī duōshao qián?",
      "How much is this phone?"
    ],
    [
      "Ask the price of the book: 这是书。",
      "这本书多少钱？",
      "Zhè běn shū duōshao qián?",
      "How much is this book?",
      [
        "这",
        "本",
        "书",
        "多少钱",
        "？"
      ]
    ]
  ],
  [
    "g174",
    "Nouns & classifiers",
    "Nominalizing 的: talking about 'the one that …'",
    "Verb phrase + 的 = 'the one(s) that …'",
    "的 turns a description into a noun: 我买的 \"the one(s) I bought\", 吃的 \"things to eat\", 热的 \"a hot one\". The noun itself can disappear when the context makes it clear.",
    "Possessive 的 links an owner to a thing (我的书 \"my book\"); nominalizing 的 stands in for the thing itself (我的 \"mine\").",
    "吃的 means \"things to eat\" — the noun after 的 is dropped only when everyone understands what is meant.",
    "少",
    [
      "我想喝热的。",
      "Wǒ xiǎng hē rè de.",
      "I want to drink something hot."
    ],
    [
      "我去买吃的。",
      "Wǒ qù mǎi chī de.",
      "I'm going to buy something to eat."
    ],
    [
      "我想吃你＿＿的。",
      "买",
      "是",
      "有",
      "我想吃你买的。",
      "Wǒ xiǎng chī nǐ mǎi de.",
      "I want to eat the one(s) you bought."
    ],
    [
      "Say 'the one I bought': (我 / 买 / 的)",
      "我买的。",
      "Wǒ mǎi de.",
      "The one I bought.",
      [
        "我",
        "买",
        "的",
        "。"
      ]
    ]
  ],
  [
    "g175",
    "Time & location",
    "Time clauses with 以前, 以后 and 的时候",
    "Event + 以前/以后 / Event + 的时候",
    "以前 \"before\" and 以后 \"after\" attach to the event phrase: 回家以前 \"before going home\", 回家以后 \"after getting home\". 的时候 means \"when …\": 你有时间的时候 \"when you have time\".",
    "Standalone time words like 明天 or 现在 sit before the verb on their own; 以前/以后/的时候 need the whole event phrase in front of them.",
    "The event phrase belongs before 的时候; put the main action after the comma, not inside the clause.",
    "时",
    [
      "回家以前，我给朋友打电话。",
      "Huí jiā yǐqián, wǒ gěi péngyou dǎ diànhuà.",
      "Before going home, I call a friend."
    ],
    [
      "你有时间的时候，给我打电话。",
      "Nǐ yǒu shíjiān de shíhou, gěi wǒ dǎ diànhuà.",
      "When you have time, call me."
    ],
    [
      "来中国＿＿，他不会说中文。",
      "以前",
      "以后",
      "的时候",
      "来中国以前，他不会说中文。",
      "Lái Zhōngguó yǐqián, tā bú huì shuō Zhōngwén.",
      "Before coming to China, he could not speak Chinese."
    ],
    [
      "Combine the two actions with 的时候: 你回家。你给我打电话。",
      "你回家的时候，给我打电话。",
      "Nǐ huí jiā de shíhou, gěi wǒ dǎ diànhuà.",
      "When you get home, call me.",
      [
        "你",
        "回家",
        "的时候",
        "，",
        "给",
        "我",
        "打电话",
        "。"
      ]
    ]
  ],
  [
    "g176",
    "Actions & aspect",
    "Aspectual directionals 起来 and 下去",
    "Verb + 起来 (begins) / Verb + 下去 (continues)",
    "起来 after a verb marks a change into a new state: 热起来 \"turning hot\", 我想起来了 \"I remember now\". 下去 marks an action continuing: 说下去 \"go on speaking\".",
    "上来/进去/出来/进来 show concrete physical direction; 起来/下去 here describe how a situation begins or continues.",
    "站起来 is literally \"stand up\" while 记起来 is \"start to remember\" — the same 起来 can be physical or figurative; context decides.",
    "来",
    [
      "天气慢慢热起来了。",
      "Tiānqì mànmàn rè qǐlái le.",
      "The weather is gradually turning hot."
    ],
    [
      "我想起来了！",
      "Wǒ xiǎng qǐlái le!",
      "I remember now!"
    ],
    [
      "老师又说＿＿了。",
      "下去",
      "起来",
      "过去",
      "老师又说下去了。",
      "Lǎoshī yòu shuō xiàqù le.",
      "The teacher went on speaking."
    ],
    [
      "Say the weather turned hot: (天气 / 热起来 / 了)",
      "天气热起来了。",
      "Tiānqì rè qǐlái le.",
      "The weather has turned hot.",
      [
        "天气",
        "热起来",
        "了",
        "。"
      ]
    ]
  ],
  [
    "g177",
    "Actions & aspect",
    "Causatives with 让 and 叫",
    "A + 让/叫 + B + verb",
    "让 and 叫 put another person to work: 老师让我们看书 \"the teacher makes us read\", 你叫他给我打电话 \"tell him to call me\". 让 also asks for permission: 让我看看 \"let me take a look\".",
    "给 marks who receives or benefits (给他打电话 \"call him\"); 让/叫 marks who is made to act (让我们看书 \"makes us read\").",
    "The person comes right after 让/叫 — no word like English \"to\" in between: 让我看看, never 让我去看看我…",
    "说",
    [
      "老师让我们看书。",
      "Lǎoshī ràng wǒmen kàn shū.",
      "The teacher has us read books."
    ],
    [
      "你叫他给我打电话。",
      "Nǐ jiào tā gěi wǒ dǎ diànhuà.",
      "Tell him to call me."
    ],
    [
      "老师＿＿我们写汉字。",
      "让",
      "把",
      "被",
      "老师让我们写汉字。",
      "Lǎoshī ràng wǒmen xiě Hànzì.",
      "The teacher has us write Chinese characters."
    ],
    [
      "Rewrite with 让: 他看看这本书。",
      "让他看看这本书。",
      "Ràng tā kànkan zhè běn shū.",
      "Let him take a look at this book.",
      [
        "让",
        "他",
        "看看",
        "这",
        "本",
        "书",
        "。"
      ]
    ]
  ],
  [
    "g178",
    "Actions & aspect",
    "把 sentences: what happened to a specific thing",
    "Subject + 把 + definite object + verb + result",
    "把 moves a specific, known object in front of the verb when the sentence reports what happened to it: 我把水喝完了 \"I finished the water\", 他把电脑关了 \"he turned the computer off\". The verb needs a result or 了 — a bare verb is usually wrong.",
    "我喝水 is a neutral statement with the object after the verb; 我把水喝了 starts from the object and highlights what happened to it.",
    "Don't use 把 with a bare verb or an indefinite object: 我把一本书看了 is awkward; say 我看了一本书.",
    "书",
    [
      "我把那杯水喝完了。",
      "Wǒ bǎ nà bēi shuǐ hē wán le.",
      "I drank that glass of water up."
    ],
    [
      "我把作业写完了。",
      "Wǒ bǎ zuòyè xiě wán le.",
      "I finished the homework."
    ],
    [
      "我＿＿水喝完了。",
      "把",
      "被",
      "给",
      "我把水喝完了。",
      "Wǒ bǎ shuǐ hē wán le.",
      "I finished the water."
    ],
    [
      "Rewrite with 把: 他关了电脑。",
      "他把电脑关了。",
      "Tā bǎ diànnǎo guān le.",
      "He turned the computer off.",
      [
        "他",
        "把",
        "电脑",
        "关了",
        "。"
      ]
    ]
  ],
  [
    "g179",
    "Actions & aspect",
    "被 sentences and the 把/被 choice",
    "Receiver + 被 + agent + verb + result",
    "被 makes the receiver the topic: 我的水被他喝了 \"my water was drunk by him\". The same event with 把 is 我把水喝了 — one sentence starts from the thing affected, the other from the person acting.",
    "把 starts from the doer (我把水喝了); 被 starts from the receiver (水被我喝了). Both report the same event with different focus.",
    "被 sentences often carry an unfortunate feeling; for neutral events the plain word order (他喝了水) is usually better.",
    "看",
    [
      "我的水被他喝了。",
      "Wǒ de shuǐ bèi tā hē le.",
      "My water was drunk by him."
    ],
    [
      "电脑被他关了。",
      "Diànnǎo bèi tā guān le.",
      "The computer was turned off by him."
    ],
    [
      "那杯水＿＿我喝完了。",
      "被",
      "把",
      "从",
      "那杯水被我喝完了。",
      "Nà bēi shuǐ bèi wǒ hē wán le.",
      "That glass of water was finished by me."
    ],
    [
      "Rewrite with 被: 他喝了你的水。",
      "你的水被他喝了。",
      "Nǐ de shuǐ bèi tā hē le.",
      "Your water was drunk by him.",
      [
        "你的",
        "水",
        "被",
        "他",
        "喝了",
        "。"
      ]
    ]
  ],
  [
    "g180",
    "Time & location",
    "Direction and distance with 向, 往 and 离",
    "向 + target + verb / 往 + direction / 离 + place",
    "向 targets an action at a person or goal: 向老师学习 \"learn from the teacher\". 往 takes a direction: 往东走 \"walk east\". 离 names the far end of a distance: 我家离学校很近 \"my home is close to the school\".",
    "从…到 spans a whole path (从北京到上海 \"from Beijing to Shanghai\"); 离 names just one endpoint of a distance.",
    "往 is followed by a direction word (往东/往前); 向 can also take a person (向老师学习).",
    "走",
    [
      "你往东走。",
      "Nǐ wǎng dōng zǒu.",
      "Walk toward the east."
    ],
    [
      "我家离学校很近。",
      "Wǒ jiā lí xuéxiào hěn jìn.",
      "My home is very close to the school."
    ],
    [
      "我们要＿＿老师学习。",
      "向",
      "往",
      "离",
      "我们要向老师学习。",
      "Wǒmen yào xiàng lǎoshī xuéxí.",
      "We should learn from the teacher."
    ],
    [
      "Express the distance with 离: (家 / 学校 / 很近)",
      "家离学校很近。",
      "Jiā lí xuéxiào hěn jìn.",
      "Home is close to the school.",
      [
        "家",
        "离",
        "学校",
        "很近",
        "。"
      ]
    ]
  ],
  [
    "g181",
    "Foundations",
    "Topic-first sentences and dropped subjects",
    "Topic + comment; drop subjects that are obvious",
    "Chinese often starts with what the sentence is about: 这本书我看过 \"this book — I have read it\". Pronouns disappear when context makes them clear: 茶我喝了 \"the tea — I drank it\".",
    "English repeats the subject in every clause; Chinese keeps only what the listener needs, so the topic stands first and shared information is dropped.",
    "Drop the subject only when it is obvious from context; a bare verb without any clue about who acts confuses the listener.",
    "这",
    [
      "这本书我看过。",
      "Zhè běn shū wǒ kàn guo.",
      "This book, I have read it."
    ],
    [
      "苹果我买了很多。",
      "Píngguǒ wǒ mǎi le hěn duō.",
      "Apples — I bought a lot."
    ],
    [
      "那杯茶＿＿不喝了。",
      "我",
      "被",
      "是",
      "那杯茶我不喝了。",
      "Nà bēi chá wǒ bù hē le.",
      "That cup of tea — I'm not drinking it."
    ],
    [
      "Front the topic: 我看完了这本书。",
      "这本书我看完了。",
      "Zhè běn shū wǒ kàn wán le.",
      "This book, I have finished reading it.",
      [
        "这",
        "本",
        "书",
        "我",
        "看完了",
        "。"
      ]
    ]
  ]
];
