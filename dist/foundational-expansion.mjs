/** P22 original Simplified Mandarin additions (not official HSK inventory).
 * Append-only lesson rows keep every Batch 20 demo-01 ... demo-74 identity unchanged.
 * Each lesson has three vocabulary examples, two contextual sentences and a
 * practical grammar focus. Text is author-drafted instructional material.
 */
export const FOUNDATION_ADDITIONS = [
  [
    "他",
    "tā",
    "he; him",
    "A third-person pronoun for a male person.",
    [
      [
        "他们",
        "tāmen",
        "they; them"
      ],
      [
        "他的",
        "tā de",
        "his"
      ],
      [
        "他家",
        "tā jiā",
        "his home"
      ]
    ],
    [
      "他是我的朋友。",
      "Tā shì wǒ de péngyou.",
      "He is my friend."
    ],
    [
      "他今天去上课。",
      "Tā jīntiān qù shàng kè.",
      "He goes to class today."
    ],
    "Third-person subjects",
    "他 + verb",
    "Place the person before the action or description."
  ],
  [
    "她",
    "tā",
    "she; her",
    "Written differently from 他 but pronounced with the same first tone.",
    [
      [
        "她们",
        "tāmen",
        "they; them (females)"
      ],
      [
        "她的",
        "tā de",
        "her; hers"
      ],
      [
        "她家",
        "tā jiā",
        "her home"
      ]
    ],
    [
      "她喜欢看书。",
      "Tā xǐhuan kàn shū.",
      "She likes reading."
    ],
    [
      "她在学校学习。",
      "Tā zài xuéxiào xuéxí.",
      "She studies at school."
    ],
    "Pronouns in speech",
    "她 / 他 → tā",
    "The written distinction between she and he is not heard in spoken Mandarin."
  ],
  [
    "们",
    "men",
    "plural marker for pronouns",
    "A neutral-tone plural suffix especially common with personal pronouns.",
    [
      [
        "我们",
        "wǒmen",
        "we; us"
      ],
      [
        "你们",
        "nǐmen",
        "you (plural)"
      ],
      [
        "他们",
        "tāmen",
        "they; them"
      ]
    ],
    [
      "我们一起回家。",
      "Wǒmen yìqǐ huí jiā.",
      "We go home together."
    ],
    [
      "你们会说中文吗？",
      "Nǐmen huì shuō Zhōngwén ma?",
      "Can you all speak Chinese?"
    ],
    "Pronoun plurals",
    "我 → 我们; 你 → 你们",
    "Use 们 with personal pronouns; ordinary counted nouns do not simply take 们."
  ],
  [
    "的",
    "de",
    "possessive and modifying particle",
    "A neutral-tone particle connecting a modifier with the following noun.",
    [
      [
        "我的",
        "wǒ de",
        "my; mine"
      ],
      [
        "你的",
        "nǐ de",
        "your; yours"
      ],
      [
        "老师的书",
        "lǎoshī de shū",
        "the teacher's book"
      ]
    ],
    [
      "这是我的手机。",
      "Zhè shì wǒ de shǒujī.",
      "This is my phone."
    ],
    [
      "他的老师很好。",
      "Tā de lǎoshī hěn hǎo.",
      "His teacher is very good."
    ],
    "Possession with 的",
    "owner + 的 + noun",
    "Use 的 between many possessors and what is possessed; some close relationships omit it."
  ],
  [
    "在",
    "zài",
    "at; in; located at",
    "Expresses location and appears before places where actions occur.",
    [
      [
        "在家",
        "zài jiā",
        "at home"
      ],
      [
        "现在",
        "xiànzài",
        "now"
      ],
      [
        "在学校",
        "zài xuéxiào",
        "at school"
      ]
    ],
    [
      "我在家学习中文。",
      "Wǒ zài jiā xuéxí Zhōngwén.",
      "I study Chinese at home."
    ],
    [
      "老师在教室里。",
      "Lǎoshī zài jiàoshì lǐ.",
      "The teacher is in the classroom."
    ],
    "Activities at places",
    "subject + 在 + place + verb",
    "Put the location phrase before the action in common activity sentences."
  ],
  [
    "了",
    "le",
    "completed-action or changed-state particle",
    "A neutral-tone particle with different grammatical uses.",
    [
      [
        "来了",
        "lái le",
        "has come"
      ],
      [
        "吃了",
        "chī le",
        "ate; have eaten"
      ],
      [
        "好了",
        "hǎo le",
        "all right now; done"
      ]
    ],
    [
      "我吃了米饭。",
      "Wǒ chī le mǐfàn.",
      "I ate rice."
    ],
    [
      "下雨了。",
      "Xià yǔ le.",
      "It has started raining."
    ],
    "Aspect and change with 了",
    "verb + 了; clause + 了",
    "了 does not simply mean the English past tense; notice whether an action finished or a situation changed."
  ],
  [
    "吗",
    "ma",
    "yes–no question particle",
    "Neutral-tone ending for a basic yes–no question.",
    [
      [
        "好吗",
        "hǎo ma",
        "is that okay?"
      ],
      [
        "是吗",
        "shì ma",
        "really?; is that so?"
      ],
      [
        "对吗",
        "duì ma",
        "is that right?"
      ]
    ],
    [
      "你今天有时间吗？",
      "Nǐ jīntiān yǒu shíjiān ma?",
      "Do you have time today?"
    ],
    [
      "他是学生吗？",
      "Tā shì xuésheng ma?",
      "Is he a student?"
    ],
    "Simple yes–no questions",
    "statement + 吗？",
    "Use the same basic word order as a statement and add 吗 to ask a question."
  ],
  [
    "呢",
    "ne",
    "follow-up or topic particle",
    "A neutral-tone ending used to ask about another person or highlight a topic.",
    [
      [
        "你呢",
        "nǐ ne",
        "and you?"
      ],
      [
        "我呢",
        "wǒ ne",
        "what about me?"
      ],
      [
        "他呢",
        "tā ne",
        "what about him?"
      ]
    ],
    [
      "我很好，你呢？",
      "Wǒ hěn hǎo, nǐ ne?",
      "I am well. And you?"
    ],
    [
      "老师呢？",
      "Lǎoshī ne?",
      "What about the teacher?"
    ],
    "Following up with 呢",
    "person/topic + 呢？",
    "Use 呢 to turn attention toward another person or an already established topic."
  ],
  [
    "吧",
    "ba",
    "suggestion or softening particle",
    "A neutral-tone particle that can soften requests or proposals.",
    [
      [
        "走吧",
        "zǒu ba",
        "let us go"
      ],
      [
        "好吧",
        "hǎo ba",
        "all right"
      ],
      [
        "来吧",
        "lái ba",
        "come on"
      ]
    ],
    [
      "我们走吧。",
      "Wǒmen zǒu ba.",
      "Let us go."
    ],
    [
      "一起吃饭吧。",
      "Yìqǐ chī fàn ba.",
      "Let us eat together."
    ],
    "Suggestions with 吧",
    "suggestion + 吧",
    "Add 吧 to make invitations and suggestions sound less abrupt."
  ],
  [
    "给",
    "gěi",
    "to give; for; to",
    "Used as a giving verb and to indicate recipients of actions.",
    [
      [
        "给你",
        "gěi nǐ",
        "for you; give to you"
      ],
      [
        "送给",
        "sòng gěi",
        "to give as a gift"
      ],
      [
        "给朋友",
        "gěi péngyou",
        "to a friend"
      ]
    ],
    [
      "我给你一本书。",
      "Wǒ gěi nǐ yì běn shū.",
      "I give you a book."
    ],
    [
      "我给朋友打电话。",
      "Wǒ gěi péngyou dǎ diànhuà.",
      "I call a friend."
    ],
    "Recipients with 给",
    "给 + person + action",
    "给 often identifies who receives something or benefits from an action."
  ],
  [
    "请",
    "qǐng",
    "please; invite",
    "Polite word before many requests; also means to invite.",
    [
      [
        "请问",
        "qǐngwèn",
        "excuse me; may I ask"
      ],
      [
        "请坐",
        "qǐng zuò",
        "please sit"
      ],
      [
        "请进",
        "qǐng jìn",
        "please come in"
      ]
    ],
    [
      "请问，车站在哪里？",
      "Qǐngwèn, chēzhàn zài nǎlǐ?",
      "Excuse me, where is the station?"
    ],
    [
      "请坐这里。",
      "Qǐng zuò zhèlǐ.",
      "Please sit here."
    ],
    "Polite requests",
    "请 + verb",
    "Use 请 before an action to make a straightforward polite request."
  ],
  [
    "谢",
    "xiè",
    "to thank; thanks component",
    "Most common in 谢谢, a frequent expression of gratitude.",
    [
      [
        "谢谢",
        "xièxie",
        "thank you"
      ],
      [
        "感谢",
        "gǎnxiè",
        "to thank; gratitude"
      ],
      [
        "多谢",
        "duōxiè",
        "many thanks"
      ]
    ],
    [
      "谢谢你的帮助。",
      "Xièxie nǐ de bāngzhù.",
      "Thank you for your help."
    ],
    [
      "她说了谢谢。",
      "Tā shuō le xièxie.",
      "She said thank you."
    ],
    "Thanking someone",
    "谢谢 + person",
    "谢谢 may stand alone or be followed by the person being thanked."
  ],
  [
    "对",
    "duì",
    "correct; toward; pair",
    "Means correct in common replies and toward in certain constructions.",
    [
      [
        "对不起",
        "duìbuqǐ",
        "sorry"
      ],
      [
        "对的",
        "duì de",
        "that is right"
      ],
      [
        "不对",
        "bú duì",
        "incorrect"
      ]
    ],
    [
      "对不起，我来晚了。",
      "Duìbuqǐ, wǒ lái wǎn le.",
      "Sorry, I came late."
    ],
    [
      "这个答案不对。",
      "Zhège dá'àn bú duì.",
      "This answer is not correct."
    ],
    "Correctness and apologies",
    "对 / 不对",
    "Use 对 to agree that something is correct; 对不起 is a fixed apology expression."
  ],
  [
    "起",
    "qǐ",
    "to rise; start",
    "Appears in words about getting up and beginning actions.",
    [
      [
        "起来",
        "qǐlái",
        "to get up; rise"
      ],
      [
        "起床",
        "qǐchuáng",
        "to get out of bed"
      ],
      [
        "一起",
        "yìqǐ",
        "together"
      ]
    ],
    [
      "我每天七点起床。",
      "Wǒ měitiān qī diǎn qǐchuáng.",
      "I get up at seven every day."
    ],
    [
      "我们一起学习。",
      "Wǒmen yìqǐ xuéxí.",
      "We study together."
    ],
    "Daily routine expressions",
    "time + 起床",
    "Use 起床 for getting out of bed and 一起 for doing an activity together."
  ],
  [
    "没",
    "méi",
    "not; have not",
    "Forms 没有 and negates certain events, especially actions not completed.",
    [
      [
        "没有",
        "méiyǒu",
        "not have; there is not"
      ],
      [
        "没事",
        "méi shì",
        "it is okay; nothing is wrong"
      ],
      [
        "没来",
        "méi lái",
        "did not come"
      ]
    ],
    [
      "我今天没有课。",
      "Wǒ jīntiān méiyǒu kè.",
      "I have no classes today."
    ],
    [
      "他昨天没来。",
      "Tā zuótiān méi lái.",
      "He did not come yesterday."
    ],
    "Negating existence and events",
    "没有 + noun; 没 + verb",
    "Use 没有 for lacking something; it also negates many completed-event statements."
  ],
  [
    "能",
    "néng",
    "can; be able to",
    "Ability or possibility arising from circumstances or conditions.",
    [
      [
        "不能",
        "bù néng",
        "cannot"
      ],
      [
        "能够",
        "nénggòu",
        "to be able to"
      ],
      [
        "能来",
        "néng lái",
        "can come"
      ]
    ],
    [
      "你明天能来吗？",
      "Nǐ míngtiān néng lái ma?",
      "Can you come tomorrow?"
    ],
    [
      "我今天不能去。",
      "Wǒ jīntiān bù néng qù.",
      "I cannot go today."
    ],
    "Ability with 能",
    "能 + action",
    "Use 能 for ability or possibility; compare it with 会 for learned skills."
  ],
  [
    "要",
    "yào",
    "to want; need; about to",
    "A frequent modal with several uses depending on context.",
    [
      [
        "不要",
        "bú yào",
        "do not want; do not"
      ],
      [
        "需要",
        "xūyào",
        "to need"
      ],
      [
        "要去",
        "yào qù",
        "going to; need to go"
      ]
    ],
    [
      "我要一杯水。",
      "Wǒ yào yì bēi shuǐ.",
      "I want a glass of water."
    ],
    [
      "我们明天要去北京。",
      "Wǒmen míngtiān yào qù Běijīng.",
      "We are going to Beijing tomorrow."
    ],
    "Wanting and planning",
    "要 + noun/action",
    "When 要 precedes a noun it can express a desire; before a verb it may express intention or necessity."
  ],
  [
    "想",
    "xiǎng",
    "to want to; think; miss",
    "Used for wishes, thinking and sometimes missing someone.",
    [
      [
        "想要",
        "xiǎngyào",
        "to want"
      ],
      [
        "想吃",
        "xiǎng chī",
        "want to eat"
      ],
      [
        "想家",
        "xiǎng jiā",
        "to feel homesick"
      ]
    ],
    [
      "我想学中文。",
      "Wǒ xiǎng xué Zhōngwén.",
      "I want to learn Chinese."
    ],
    [
      "你想喝什么？",
      "Nǐ xiǎng hē shénme?",
      "What do you want to drink?"
    ],
    "Desires with 想",
    "想 + verb",
    "Use 想 before an activity you would like to do; 想家 refers to missing home."
  ],
  [
    "觉",
    "jué",
    "to feel; perceive",
    "Often part of the common expression 觉得; also appears in words about awareness.",
    [
      [
        "觉得",
        "juéde",
        "to feel; think"
      ],
      [
        "感觉",
        "gǎnjué",
        "feeling; to feel"
      ],
      [
        "发觉",
        "fājué",
        "to notice; discover"
      ]
    ],
    [
      "我觉得这个很好。",
      "Wǒ juéde zhège hěn hǎo.",
      "I think this is good."
    ],
    [
      "你觉得怎么样？",
      "Nǐ juéde zěnmeyàng?",
      "What do you think of it?"
    ],
    "Giving an opinion",
    "觉得 + clause",
    "觉得 introduces a personal judgment; 觉 is not normally used alone in this beginner construction."
  ],
  [
    "得",
    "de",
    "structural complement particle",
    "Often neutral tone when connecting a verb with a description of how an action is done.",
    [
      [
        "觉得",
        "juéde",
        "to feel; think"
      ],
      [
        "说得好",
        "shuō de hǎo",
        "speak well"
      ],
      [
        "走得快",
        "zǒu de kuài",
        "walk fast"
      ]
    ],
    [
      "他说得很好。",
      "Tā shuō de hěn hǎo.",
      "He speaks very well."
    ],
    [
      "你走得太快了。",
      "Nǐ zǒu de tài kuài le.",
      "You walk too fast."
    ],
    "Describing how an action is done",
    "verb + 得 + description",
    "Do not confuse complement-particle 得 with possessive 的 or 地; this is the neutral-tone reading."
  ],
  [
    "很",
    "hěn",
    "very; linking adverb",
    "Frequently appears before adjectives, sometimes without strong emphasis.",
    [
      [
        "很好",
        "hěn hǎo",
        "very good; good"
      ],
      [
        "很多",
        "hěn duō",
        "many; a lot"
      ],
      [
        "很少",
        "hěn shǎo",
        "very few"
      ]
    ],
    [
      "这个问题很简单。",
      "Zhège wèntí hěn jiǎndān.",
      "This question is simple."
    ],
    [
      "今天很冷。",
      "Jīntiān hěn lěng.",
      "It is cold today."
    ],
    "Adjective predicates",
    "subject + 很 + adjective",
    "很 before an adjective may simply make an ordinary affirmative description sound natural."
  ],
  [
    "太",
    "tài",
    "too; extremely",
    "An intensifier, often appearing with 了 in exclamations.",
    [
      [
        "太大",
        "tài dà",
        "too big"
      ],
      [
        "太好",
        "tài hǎo",
        "very good"
      ],
      [
        "太晚",
        "tài wǎn",
        "too late"
      ]
    ],
    [
      "今天太热了。",
      "Jīntiān tài rè le.",
      "It is too hot today."
    ],
    [
      "这本书太好了！",
      "Zhè běn shū tài hǎo le!",
      "This book is excellent!"
    ],
    "Expressive degree",
    "太 + adjective + 了",
    "太 can criticize excess or express enthusiasm, depending on the adjective and context."
  ],
  [
    "都",
    "dōu",
    "all; both",
    "An adverb showing that a statement applies to every relevant member of a group.",
    [
      [
        "都是",
        "dōu shì",
        "are all"
      ],
      [
        "都好",
        "dōu hǎo",
        "both/all good"
      ],
      [
        "都在",
        "dōu zài",
        "are all at"
      ]
    ],
    [
      "我们都喜欢中文。",
      "Wǒmen dōu xǐhuan Zhōngwén.",
      "We all like Chinese."
    ],
    [
      "他们都在学校。",
      "Tāmen dōu zài xuéxiào.",
      "They are all at school."
    ],
    "All members of a group",
    "group + 都 + predicate",
    "Put 都 before the main predicate, not at the very end of the sentence."
  ],
  [
    "和",
    "hé",
    "and; with",
    "Connects nouns and pronouns; does not generally connect complete clauses in the same way as English and.",
    [
      [
        "我和你",
        "wǒ hé nǐ",
        "you and I"
      ],
      [
        "和平",
        "hépíng",
        "peace"
      ],
      [
        "和朋友",
        "hé péngyou",
        "with friends"
      ]
    ],
    [
      "我和朋友去公园。",
      "Wǒ hé péngyou qù gōngyuán.",
      "My friend and I go to the park."
    ],
    [
      "茶和水都可以。",
      "Chá hé shuǐ dōu kěyǐ.",
      "Tea and water are both fine."
    ],
    "Joining noun phrases",
    "noun + 和 + noun",
    "和 is natural between people or things, but it is not an all-purpose clause connector."
  ],
  [
    "跟",
    "gēn",
    "with; follow",
    "Often links a person with someone accompanying them.",
    [
      [
        "跟你",
        "gēn nǐ",
        "with you"
      ],
      [
        "跟朋友",
        "gēn péngyou",
        "with a friend"
      ],
      [
        "跟着",
        "gēnzhe",
        "following"
      ]
    ],
    [
      "我跟朋友一起走。",
      "Wǒ gēn péngyou yìqǐ zǒu.",
      "I walk together with a friend."
    ],
    [
      "请跟我来。",
      "Qǐng gēn wǒ lái.",
      "Please follow me."
    ],
    "Accompaniment with 跟",
    "跟 + person + verb",
    "Use 跟 with another person when describing doing something together or following someone."
  ],
  [
    "也",
    "yě",
    "also; too",
    "An adverb that usually comes before the verb or adjective.",
    [
      [
        "也是",
        "yě shì",
        "also is"
      ],
      [
        "也有",
        "yě yǒu",
        "also has"
      ],
      [
        "也好",
        "yě hǎo",
        "also fine"
      ]
    ],
    [
      "我也想喝茶。",
      "Wǒ yě xiǎng hē chá.",
      "I also want tea."
    ],
    [
      "她也是学生。",
      "Tā yě shì xuésheng.",
      "She is also a student."
    ],
    "Adding another statement",
    "subject + 也 + predicate",
    "Place 也 before the predicate, not after it as in English 'too'."
  ],
  [
    "个",
    "gè",
    "general measure word",
    "Common classifier used for people, objects and many everyday nouns.",
    [
      [
        "一个人",
        "yí ge rén",
        "one person"
      ],
      [
        "这个",
        "zhège",
        "this one"
      ],
      [
        "那个",
        "nàge",
        "that one"
      ]
    ],
    [
      "这里有三个人。",
      "Zhèlǐ yǒu sān ge rén.",
      "There are three people here."
    ],
    [
      "我有一个问题。",
      "Wǒ yǒu yí ge wèntí.",
      "I have a question."
    ],
    "Basic classifiers",
    "number + 个 + noun",
    "个 is widespread but not a replacement for every specialized classifier."
  ],
  [
    "本",
    "běn",
    "measure word for bound books",
    "Often a classifier for books; can also refer to roots or origins in other words.",
    [
      [
        "一本书",
        "yì běn shū",
        "one book"
      ],
      [
        "两本书",
        "liǎng běn shū",
        "two books"
      ],
      [
        "本来",
        "běnlái",
        "originally"
      ]
    ],
    [
      "我买了两本书。",
      "Wǒ mǎi le liǎng běn shū.",
      "I bought two books."
    ],
    [
      "这本书很好看。",
      "Zhè běn shū hěn hǎokàn.",
      "This book is very good to read."
    ],
    "Book classifier",
    "number + 本 + 书",
    "Use 本 rather than 个 when counting bound books."
  ],
  [
    "杯",
    "bēi",
    "cup; cup measure word",
    "Names a cup and is used for cupfuls of drinks.",
    [
      [
        "一杯水",
        "yì bēi shuǐ",
        "a glass of water"
      ],
      [
        "茶杯",
        "chábēi",
        "teacup"
      ],
      [
        "杯子",
        "bēizi",
        "cup"
      ]
    ],
    [
      "请给我一杯茶。",
      "Qǐng gěi wǒ yì bēi chá.",
      "Please give me a cup of tea."
    ],
    [
      "桌上有两个杯子。",
      "Zhuō shàng yǒu liǎng ge bēizi.",
      "There are two cups on the table."
    ],
    "Quantity versus container",
    "一杯水 / 一个杯子",
    "一杯水 means one cupful of water; 一个杯子 is one physical cup."
  ],
  [
    "两",
    "liǎng",
    "two; pair",
    "Typically used before classifiers when counting two of something.",
    [
      [
        "两个",
        "liǎng ge",
        "two (items)"
      ],
      [
        "两杯茶",
        "liǎng bēi chá",
        "two cups of tea"
      ],
      [
        "两个人",
        "liǎng ge rén",
        "two people"
      ]
    ],
    [
      "我们有两张票。",
      "Wǒmen yǒu liǎng zhāng piào.",
      "We have two tickets."
    ],
    [
      "她买了两杯水。",
      "Tā mǎi le liǎng bēi shuǐ.",
      "She bought two glasses of water."
    ],
    "Two before measure words",
    "两 + classifier + noun",
    "Use 两 in many counted noun phrases, while 二 is used for counting and in many number expressions."
  ],
  [
    "三",
    "sān",
    "three",
    "The number three, used in dates, time and quantities.",
    [
      [
        "三个人",
        "sān ge rén",
        "three people"
      ],
      [
        "三天",
        "sān tiān",
        "three days"
      ],
      [
        "三本书",
        "sān běn shū",
        "three books"
      ]
    ],
    [
      "我有三本中文书。",
      "Wǒ yǒu sān běn Zhōngwén shū.",
      "I have three Chinese books."
    ],
    [
      "我们三点见。",
      "Wǒmen sān diǎn jiàn.",
      "Let us meet at three o'clock."
    ],
    "Numbers in real situations",
    "三 + classifier / 点",
    "Combine numbers with the appropriate measure word or with 点 for clock time."
  ],
  [
    "四",
    "sì",
    "four",
    "The fourth-tone number four, important to distinguish from 十.",
    [
      [
        "四个人",
        "sì ge rén",
        "four people"
      ],
      [
        "四月",
        "sì yuè",
        "April"
      ],
      [
        "四点",
        "sì diǎn",
        "four o'clock"
      ]
    ],
    [
      "我下午四点回家。",
      "Wǒ xiàwǔ sì diǎn huí jiā.",
      "I go home at four in the afternoon."
    ],
    [
      "四月天气很好。",
      "Sì yuè tiānqì hěn hǎo.",
      "The weather is nice in April."
    ],
    "Syllable and tone distinction",
    "四 sì vs 十 shí",
    "Listen for different consonants and tones in sì and shí."
  ],
  [
    "五",
    "wǔ",
    "five",
    "Third-tone number five, frequently used for time and counting.",
    [
      [
        "五点",
        "wǔ diǎn",
        "five o'clock"
      ],
      [
        "五月",
        "wǔ yuè",
        "May"
      ],
      [
        "五天",
        "wǔ tiān",
        "five days"
      ]
    ],
    [
      "我们五点吃饭。",
      "Wǒmen wǔ diǎn chī fàn.",
      "We eat at five."
    ],
    [
      "我在这里住了五天。",
      "Wǒ zài zhèlǐ zhù le wǔ tiān.",
      "I stayed here for five days."
    ],
    "Time and duration",
    "五点 / 五天",
    "五点 gives a clock time; 五天 describes a span of five days."
  ],
  [
    "六",
    "liù",
    "six",
    "Fourth-tone number six.",
    [
      [
        "六月",
        "liù yuè",
        "June"
      ],
      [
        "六点",
        "liù diǎn",
        "six o'clock"
      ],
      [
        "六个人",
        "liù ge rén",
        "six people"
      ]
    ],
    [
      "今天星期六。",
      "Jīntiān Xīngqīliù.",
      "Today is Saturday."
    ],
    [
      "我们六点出发。",
      "Wǒmen liù diǎn chūfā.",
      "We leave at six o'clock."
    ],
    "Weekday names",
    "星期 + number",
    "星期六 is Saturday; 星期日 or 星期天 is Sunday."
  ],
  [
    "七",
    "qī",
    "seven",
    "First-tone number seven.",
    [
      [
        "七点",
        "qī diǎn",
        "seven o'clock"
      ],
      [
        "七天",
        "qī tiān",
        "seven days"
      ],
      [
        "七月",
        "qī yuè",
        "July"
      ]
    ],
    [
      "我每天七点起床。",
      "Wǒ měitiān qī diǎn qǐchuáng.",
      "I get up at seven every day."
    ],
    [
      "这个星期有七天。",
      "Zhège xīngqī yǒu qī tiān.",
      "This week has seven days."
    ],
    "Daily routine clock times",
    "每天 + time + action",
    "Put a time expression before the activity in basic routine descriptions."
  ],
  [
    "八",
    "bā",
    "eight",
    "First-tone number eight.",
    [
      [
        "八点",
        "bā diǎn",
        "eight o'clock"
      ],
      [
        "八月",
        "bā yuè",
        "August"
      ],
      [
        "八个人",
        "bā ge rén",
        "eight people"
      ]
    ],
    [
      "火车八点出发。",
      "Huǒchē bā diǎn chūfā.",
      "The train leaves at eight."
    ],
    [
      "我有八张照片。",
      "Wǒ yǒu bā zhāng zhàopiàn.",
      "I have eight photographs."
    ],
    "Number and measure word",
    "八 + classifier + noun",
    "The number goes before the classifier in counted noun phrases."
  ],
  [
    "九",
    "jiǔ",
    "nine",
    "Third-tone number nine.",
    [
      [
        "九点",
        "jiǔ diǎn",
        "nine o'clock"
      ],
      [
        "九月",
        "jiǔ yuè",
        "September"
      ],
      [
        "九个人",
        "jiǔ ge rén",
        "nine people"
      ]
    ],
    [
      "我九点去学校。",
      "Wǒ jiǔ diǎn qù xuéxiào.",
      "I go to school at nine."
    ],
    [
      "九月我们开学。",
      "Jiǔ yuè wǒmen kāixué.",
      "We start school in September."
    ],
    "Clock time versus month",
    "九点 / 九月",
    "Use 点 for an hour of the day and 月 for a month."
  ],
  [
    "十",
    "shí",
    "ten",
    "Second-tone number ten, the basis of many larger numbers.",
    [
      [
        "十点",
        "shí diǎn",
        "ten o'clock"
      ],
      [
        "十天",
        "shí tiān",
        "ten days"
      ],
      [
        "十一",
        "shíyī",
        "eleven"
      ]
    ],
    [
      "我十点有课。",
      "Wǒ shí diǎn yǒu kè.",
      "I have class at ten."
    ],
    [
      "明天是十月一日。",
      "Míngtiān shì shí yuè yī rì.",
      "Tomorrow is October first."
    ],
    "Numbers beyond ten",
    "十 + ones digit",
    "Eleven is 十一; twenty is 二十. Larger numbers build from place values."
  ],
  [
    "百",
    "bǎi",
    "hundred",
    "Used for place-value numbers in hundreds.",
    [
      [
        "一百",
        "yì bǎi",
        "one hundred"
      ],
      [
        "两百",
        "liǎng bǎi",
        "two hundred"
      ],
      [
        "百分之百",
        "bǎi fēn zhī bǎi",
        "one hundred percent"
      ]
    ],
    [
      "这本书一百元。",
      "Zhè běn shū yì bǎi yuán.",
      "This book costs one hundred yuan."
    ],
    [
      "我们有两百本书。",
      "Wǒmen yǒu liǎng bǎi běn shū.",
      "We have two hundred books."
    ],
    "Hundreds",
    "number + 百",
    "Use place-value words to construct larger numbers: 一百, 两百, 三百."
  ],
  [
    "千",
    "qiān",
    "thousand",
    "Place-value term used in quantities and prices.",
    [
      [
        "一千",
        "yì qiān",
        "one thousand"
      ],
      [
        "两千",
        "liǎng qiān",
        "two thousand"
      ],
      [
        "千米",
        "qiānmǐ",
        "kilometer"
      ]
    ],
    [
      "这个电脑三千元。",
      "Zhège diànnǎo sān qiān yuán.",
      "This computer costs three thousand yuan."
    ],
    [
      "我们走了一千米。",
      "Wǒmen zǒu le yì qiān mǐ.",
      "We walked one thousand meters."
    ],
    "Thousands",
    "number + 千",
    "Use 千 as the thousands place; in everyday speech 两千 is a common way to say two thousand."
  ],
  [
    "元",
    "yuán",
    "yuan; monetary unit",
    "An everyday currency unit in prices.",
    [
      [
        "十元",
        "shí yuán",
        "ten yuan"
      ],
      [
        "一百元",
        "yì bǎi yuán",
        "one hundred yuan"
      ],
      [
        "人民币",
        "rénmínbì",
        "renminbi; Chinese currency"
      ]
    ],
    [
      "这杯茶十五元。",
      "Zhè bēi chá shíwǔ yuán.",
      "This cup of tea costs fifteen yuan."
    ],
    [
      "一张票要三十元。",
      "Yì zhāng piào yào sānshí yuán.",
      "One ticket costs thirty yuan."
    ],
    "Prices",
    "number + 元",
    "Use 元 after the price amount; 钱 asks more generally about money or cost."
  ],
  [
    "里",
    "lǐ",
    "inside; in",
    "A location component commonly placed after nouns.",
    [
      [
        "里面",
        "lǐmiàn",
        "inside"
      ],
      [
        "家里",
        "jiā lǐ",
        "at home; in the family"
      ],
      [
        "书里",
        "shū lǐ",
        "in the book"
      ]
    ],
    [
      "手机在书包里。",
      "Shǒujī zài shūbāo lǐ.",
      "The phone is in the schoolbag."
    ],
    [
      "老师在教室里。",
      "Lǎoshī zài jiàoshì lǐ.",
      "The teacher is in the classroom."
    ],
    "Inside places",
    "在 + place + 里",
    "The location word 里 follows the noun naming the container or place."
  ],
  [
    "上",
    "shàng",
    "above; on; up",
    "Location and direction word with broad use in compounds.",
    [
      [
        "上面",
        "shàngmiàn",
        "on top; above"
      ],
      [
        "上课",
        "shàng kè",
        "attend class"
      ],
      [
        "上车",
        "shàng chē",
        "get on a vehicle"
      ]
    ],
    [
      "书在桌子上。",
      "Shū zài zhuōzi shàng.",
      "The book is on the table."
    ],
    [
      "我八点上课。",
      "Wǒ bā diǎn shàng kè.",
      "My class starts at eight."
    ],
    "Position with 上",
    "在 + object + 上",
    "Use 上 after an object or surface to mean on top of it."
  ],
  [
    "下",
    "xià",
    "below; down; next",
    "Refers to downward position and appears in time and action expressions.",
    [
      [
        "下面",
        "xiàmiàn",
        "under; below"
      ],
      [
        "下车",
        "xià chē",
        "get off a vehicle"
      ],
      [
        "下午",
        "xiàwǔ",
        "afternoon"
      ]
    ],
    [
      "猫在桌子下面。",
      "Māo zài zhuōzi xiàmiàn.",
      "The cat is under the table."
    ],
    [
      "我下午去上课。",
      "Wǒ xiàwǔ qù shàng kè.",
      "I go to class in the afternoon."
    ],
    "Position with 下",
    "在 + object + 下面",
    "Use 下面 for below an object; 下午 is a fixed time-of-day expression."
  ],
  [
    "前",
    "qián",
    "before; in front",
    "Location and time word indicating earlier or ahead.",
    [
      [
        "前面",
        "qiánmiàn",
        "in front"
      ],
      [
        "以前",
        "yǐqián",
        "before; previously"
      ],
      [
        "前天",
        "qiántiān",
        "the day before yesterday"
      ]
    ],
    [
      "车站在学校前面。",
      "Chēzhàn zài xuéxiào qiánmiàn.",
      "The station is in front of the school."
    ],
    [
      "我以前住在北京。",
      "Wǒ yǐqián zhù zài Běijīng.",
      "I used to live in Beijing."
    ],
    "Front and before",
    "在 + place + 前面",
    "前面 describes a spatial front, while 以前 refers to an earlier time."
  ],
  [
    "后",
    "hòu",
    "after; behind",
    "Expresses position behind something and later time.",
    [
      [
        "后面",
        "hòumiàn",
        "behind"
      ],
      [
        "以后",
        "yǐhòu",
        "afterward"
      ],
      [
        "后来",
        "hòulái",
        "later on"
      ]
    ],
    [
      "商店在学校后面。",
      "Shāngdiàn zài xuéxiào hòumiàn.",
      "The shop is behind the school."
    ],
    [
      "下课以后我回家。",
      "Xià kè yǐhòu wǒ huí jiā.",
      "I go home after class."
    ],
    "After an event",
    "event + 以后",
    "Use 以后 after the event or time that comes first."
  ],
  [
    "左",
    "zuǒ",
    "left",
    "Indicates the left side and occurs in directions.",
    [
      [
        "左边",
        "zuǒbiān",
        "left side"
      ],
      [
        "左手",
        "zuǒshǒu",
        "left hand"
      ],
      [
        "向左",
        "xiàng zuǒ",
        "to the left"
      ]
    ],
    [
      "银行在左边。",
      "Yínháng zài zuǒbiān.",
      "The bank is on the left."
    ],
    [
      "请向左走。",
      "Qǐng xiàng zuǒ zǒu.",
      "Please walk to the left."
    ],
    "Giving directions",
    "向左 + verb",
    "Use 向左 to indicate direction of movement, and 左边 for position."
  ],
  [
    "右",
    "yòu",
    "right",
    "Indicates the right side; contrast with 左.",
    [
      [
        "右边",
        "yòubiān",
        "right side"
      ],
      [
        "右手",
        "yòushǒu",
        "right hand"
      ],
      [
        "向右",
        "xiàng yòu",
        "to the right"
      ]
    ],
    [
      "书店在右边。",
      "Shūdiàn zài yòubiān.",
      "The bookstore is on the right."
    ],
    [
      "请向右走。",
      "Qǐng xiàng yòu zǒu.",
      "Please walk to the right."
    ],
    "Direction contrast",
    "向右 / 向左",
    "Listen and read carefully: right is 右 and left is 左."
  ],
  [
    "外",
    "wài",
    "outside; external",
    "Used for locations outside and things from abroad.",
    [
      [
        "外面",
        "wàimiàn",
        "outside"
      ],
      [
        "外国",
        "wàiguó",
        "foreign country"
      ],
      [
        "外语",
        "wàiyǔ",
        "foreign language"
      ]
    ],
    [
      "外面下雨了。",
      "Wàimiàn xià yǔ le.",
      "It is raining outside."
    ],
    [
      "我在外面等你。",
      "Wǒ zài wàimiàn děng nǐ.",
      "I am waiting for you outside."
    ],
    "Outside a place",
    "在外面 + action",
    "外面 points beyond an enclosed or established place; compare 里面."
  ],
  [
    "内",
    "nèi",
    "inside; within",
    "Often used in more formal expressions involving inside a boundary.",
    [
      [
        "国内",
        "guónèi",
        "domestic; within a country"
      ],
      [
        "室内",
        "shìnèi",
        "indoors"
      ],
      [
        "内容",
        "nèiróng",
        "content"
      ]
    ],
    [
      "今天我们在室内上课。",
      "Jīntiān wǒmen zài shìnèi shàng kè.",
      "Today we have class indoors."
    ],
    [
      "这本书的内容很有趣。",
      "Zhè běn shū de nèiróng hěn yǒuqù.",
      "The content of this book is interesting."
    ],
    "Everyday versus formal location",
    "里面 / 室内",
    "里面 is common for physical position; 内 frequently occurs inside compound nouns."
  ],
  [
    "早",
    "zǎo",
    "early; morning",
    "Appears in greetings and daily routines.",
    [
      [
        "早上",
        "zǎoshang",
        "morning"
      ],
      [
        "早饭",
        "zǎofàn",
        "breakfast"
      ],
      [
        "早起",
        "zǎoqǐ",
        "get up early"
      ]
    ],
    [
      "早上好！",
      "Zǎoshang hǎo!",
      "Good morning!"
    ],
    [
      "我喜欢早起。",
      "Wǒ xǐhuan zǎoqǐ.",
      "I like getting up early."
    ],
    "Morning greetings",
    "早上好！",
    "早上好 is a morning greeting; 早起 describes getting up early."
  ],
  [
    "晚",
    "wǎn",
    "late; evening",
    "Useful for evening routines and timing.",
    [
      [
        "晚上",
        "wǎnshang",
        "evening; night"
      ],
      [
        "晚饭",
        "wǎnfàn",
        "dinner"
      ],
      [
        "晚安",
        "wǎn'ān",
        "good night"
      ]
    ],
    [
      "我们晚上一起吃饭。",
      "Wǒmen wǎnshang yìqǐ chī fàn.",
      "We eat dinner together in the evening."
    ],
    [
      "睡觉以前我说晚安。",
      "Shuìjiào yǐqián wǒ shuō wǎn'ān.",
      "Before sleeping, I say good night."
    ],
    "Evening time",
    "晚上 + activity",
    "Use 晚上 for an evening time, 晚饭 for the evening meal and 晚安 before sleep."
  ],
  [
    "饭",
    "fàn",
    "cooked food; meal",
    "Common in everyday eating expressions.",
    [
      [
        "吃饭",
        "chī fàn",
        "eat a meal"
      ],
      [
        "米饭",
        "mǐfàn",
        "cooked rice"
      ],
      [
        "晚饭",
        "wǎnfàn",
        "dinner"
      ]
    ],
    [
      "我们一起吃晚饭。",
      "Wǒmen yìqǐ chī wǎnfàn.",
      "We eat dinner together."
    ],
    [
      "我喜欢吃米饭。",
      "Wǒ xǐhuan chī mǐfàn.",
      "I like eating rice."
    ],
    "Meal expressions",
    "吃 + meal",
    "吃饭 is often a general expression for having a meal, not only eating rice."
  ],
  [
    "米",
    "mǐ",
    "uncooked rice; meter",
    "Appears in rice-related words and metric measures.",
    [
      [
        "米饭",
        "mǐfàn",
        "cooked rice"
      ],
      [
        "大米",
        "dàmǐ",
        "uncooked rice"
      ],
      [
        "一米",
        "yì mǐ",
        "one meter"
      ]
    ],
    [
      "我买了一袋大米。",
      "Wǒ mǎi le yí dài dàmǐ.",
      "I bought a bag of rice."
    ],
    [
      "这张桌子长一米。",
      "Zhè zhāng zhuōzi cháng yì mǐ.",
      "This table is one meter long."
    ],
    "Multiple word senses",
    "大米 / 米饭 / 一米",
    "Learn the whole compound: 米 relates to rice, but 米 is also a metric length unit."
  ],
  [
    "果",
    "guǒ",
    "fruit; result",
    "Appears in food and outcome-related words.",
    [
      [
        "水果",
        "shuǐguǒ",
        "fruit"
      ],
      [
        "苹果",
        "píngguǒ",
        "apple"
      ],
      [
        "结果",
        "jiéguǒ",
        "result"
      ]
    ],
    [
      "我每天吃水果。",
      "Wǒ měitiān chī shuǐguǒ.",
      "I eat fruit every day."
    ],
    [
      "她买了三个苹果。",
      "Tā mǎi le sān ge píngguǒ.",
      "She bought three apples."
    ],
    "Fruit quantity",
    "number + 个 + apple",
    "Apples are commonly counted with 个 in simple beginner sentences."
  ],
  [
    "菜",
    "cài",
    "dish; vegetable",
    "Can refer to vegetables, food dishes or a cuisine.",
    [
      [
        "蔬菜",
        "shūcài",
        "vegetables"
      ],
      [
        "菜单",
        "càidān",
        "menu"
      ],
      [
        "中国菜",
        "Zhōngguó cài",
        "Chinese cuisine"
      ]
    ],
    [
      "我喜欢吃中国菜。",
      "Wǒ xǐhuan chī Zhōngguó cài.",
      "I like eating Chinese food."
    ],
    [
      "这家饭店的菜单很好。",
      "Zhè jiā fàndiàn de càidān hěn hǎo.",
      "This restaurant has a good menu."
    ],
    "Food vocabulary",
    "喜欢吃 + dish",
    "菜 may name a dish rather than a raw vegetable, depending on the compound."
  ],
  [
    "鱼",
    "yú",
    "fish",
    "Can name the animal or fish as food.",
    [
      [
        "鱼肉",
        "yúròu",
        "fish meat"
      ],
      [
        "小鱼",
        "xiǎoyú",
        "small fish"
      ],
      [
        "吃鱼",
        "chī yú",
        "eat fish"
      ]
    ],
    [
      "我想吃鱼。",
      "Wǒ xiǎng chī yú.",
      "I would like to eat fish."
    ],
    [
      "这条鱼很大。",
      "Zhè tiáo yú hěn dà.",
      "This fish is big."
    ],
    "Animal classifiers",
    "一条鱼",
    "条 is a common classifier for fish and other elongated things."
  ],
  [
    "奶",
    "nǎi",
    "milk; dairy",
    "Found in common drinks and family terms.",
    [
      [
        "牛奶",
        "niúnǎi",
        "milk"
      ],
      [
        "奶茶",
        "nǎichá",
        "milk tea"
      ],
      [
        "奶奶",
        "nǎinai",
        "paternal grandmother"
      ]
    ],
    [
      "早上我喝牛奶。",
      "Zǎoshang wǒ hē niúnǎi.",
      "I drink milk in the morning."
    ],
    [
      "你喜欢奶茶吗？",
      "Nǐ xǐhuan nǎichá ma?",
      "Do you like milk tea?"
    ],
    "Drinks and neutral tones",
    "喝 + 牛奶 / 奶茶",
    "The final syllable of 奶奶 is neutral, while 牛奶 keeps its full third tone."
  ],
  [
    "雨",
    "yǔ",
    "rain",
    "Used for rainy weather and rain-related objects.",
    [
      [
        "下雨",
        "xià yǔ",
        "to rain"
      ],
      [
        "雨水",
        "yǔshuǐ",
        "rainwater"
      ],
      [
        "雨伞",
        "yǔsǎn",
        "umbrella"
      ]
    ],
    [
      "今天下午下雨了。",
      "Jīntiān xiàwǔ xià yǔ le.",
      "It started raining this afternoon."
    ],
    [
      "我的雨伞在家里。",
      "Wǒ de yǔsǎn zài jiā lǐ.",
      "My umbrella is at home."
    ],
    "Weather with 下",
    "下雨 / 下雪",
    "Use 下 with rain or snow to describe weather, not 有雨 as a general substitute."
  ],
  [
    "冷",
    "lěng",
    "cold",
    "Describes low temperature and contrasts with 热.",
    [
      [
        "很冷",
        "hěn lěng",
        "cold"
      ],
      [
        "冷水",
        "lěngshuǐ",
        "cold water"
      ],
      [
        "天气冷",
        "tiānqì lěng",
        "cold weather"
      ]
    ],
    [
      "外面很冷。",
      "Wàimiàn hěn lěng.",
      "It is cold outside."
    ],
    [
      "我想喝热茶，不想喝冷水。",
      "Wǒ xiǎng hē rè chá, bù xiǎng hē lěng shuǐ.",
      "I want hot tea, not cold water."
    ],
    "Weather and temperature",
    "很冷 / 很热",
    "Use adjectives without 是 in a normal basic weather description."
  ],
  [
    "热",
    "rè",
    "hot; warm",
    "Describes high temperature and heat.",
    [
      [
        "很热",
        "hěn rè",
        "very hot"
      ],
      [
        "热水",
        "rèshuǐ",
        "hot water"
      ],
      [
        "热茶",
        "rè chá",
        "hot tea"
      ]
    ],
    [
      "今天太热了。",
      "Jīntiān tài rè le.",
      "It is too hot today."
    ],
    [
      "请给我一杯热水。",
      "Qǐng gěi wǒ yì bēi rè shuǐ.",
      "Please give me a glass of hot water."
    ],
    "Temperature adjectives",
    "太 + 热 + 了",
    "太热了 can express excessive heat, not just the neutral adjective hot."
  ],
  [
    "见",
    "jiàn",
    "to see; meet",
    "Appears in words for meeting and perception.",
    [
      [
        "再见",
        "zàijiàn",
        "goodbye"
      ],
      [
        "看见",
        "kànjiàn",
        "to see"
      ],
      [
        "见面",
        "jiànmiàn",
        "to meet"
      ]
    ],
    [
      "明天我们见面吧。",
      "Míngtiān wǒmen jiànmiàn ba.",
      "Let us meet tomorrow."
    ],
    [
      "我看见老师了。",
      "Wǒ kànjiàn lǎoshī le.",
      "I saw the teacher."
    ],
    "Seeing and meeting",
    "看见 / 见面",
    "看见 means perceiving with sight; 见面 refers to meeting another person."
  ],
  [
    "睡",
    "shuì",
    "to sleep",
    "A verb found in common daily routine phrases.",
    [
      [
        "睡觉",
        "shuìjiào",
        "to sleep"
      ],
      [
        "早睡",
        "zǎo shuì",
        "go to bed early"
      ],
      [
        "睡着",
        "shuìzháo",
        "fall asleep"
      ]
    ],
    [
      "我每天十一点睡觉。",
      "Wǒ měitiān shíyī diǎn shuìjiào.",
      "I go to sleep at eleven every day."
    ],
    [
      "今天我想早点睡。",
      "Jīntiān wǒ xiǎng zǎodiǎn shuì.",
      "I want to go to bed earlier today."
    ],
    "Daily schedule",
    "time + 睡觉",
    "睡觉 is the common activity phrase for sleeping; 早点睡 asks for an earlier bedtime."
  ],
  [
    "住",
    "zhù",
    "to live; stay",
    "Describes residence or staying somewhere.",
    [
      [
        "住在",
        "zhù zài",
        "to live at"
      ],
      [
        "住家",
        "zhùjiā",
        "residence; household"
      ],
      [
        "住院",
        "zhùyuàn",
        "be hospitalized"
      ]
    ],
    [
      "我住在北京。",
      "Wǒ zhù zài Běijīng.",
      "I live in Beijing."
    ],
    [
      "你住在哪里？",
      "Nǐ zhù zài nǎlǐ?",
      "Where do you live?"
    ],
    "Residence with 住在",
    "住在 + place",
    "Use 住在 to say where someone lives; it is not the same as visiting a location."
  ],
  [
    "找",
    "zhǎo",
    "look for; seek",
    "Used for searching and contacting people.",
    [
      [
        "找人",
        "zhǎo rén",
        "look for someone"
      ],
      [
        "找到",
        "zhǎodào",
        "find successfully"
      ],
      [
        "找钱",
        "zhǎo qián",
        "give change"
      ]
    ],
    [
      "我找不到手机。",
      "Wǒ zhǎo bú dào shǒujī.",
      "I cannot find my phone."
    ],
    [
      "她在找一本书。",
      "Tā zài zhǎo yì běn shū.",
      "She is looking for a book."
    ],
    "Action versus successful result",
    "找 / 找到",
    "找 is looking for something; 找到 means successfully finding it."
  ],
  [
    "问",
    "wèn",
    "ask; inquire",
    "Used when asking a person or posing a question.",
    [
      [
        "问题",
        "wèntí",
        "question; problem"
      ],
      [
        "请问",
        "qǐngwèn",
        "excuse me; may I ask"
      ],
      [
        "问好",
        "wènhǎo",
        "send greetings"
      ]
    ],
    [
      "我想问一个问题。",
      "Wǒ xiǎng wèn yí ge wèntí.",
      "I would like to ask a question."
    ],
    [
      "老师问了我的名字。",
      "Lǎoshī wèn le wǒ de míngzi.",
      "The teacher asked my name."
    ],
    "Asking a question",
    "问 + person/question",
    "Use 问 as a verb and 问题 for the question itself."
  ],
  [
    "知",
    "zhī",
    "to know; knowledge component",
    "Often part of 知道 rather than used as a basic stand-alone verb.",
    [
      [
        "知道",
        "zhīdào",
        "to know"
      ],
      [
        "知识",
        "zhīshi",
        "knowledge"
      ],
      [
        "通知",
        "tōngzhī",
        "to inform; notice"
      ]
    ],
    [
      "我知道这个地方。",
      "Wǒ zhīdào zhège dìfang.",
      "I know this place."
    ],
    [
      "你知道他的名字吗？",
      "Nǐ zhīdào tā de míngzi ma?",
      "Do you know his name?"
    ],
    "Knowing information",
    "知道 + information",
    "For basic personal knowledge use the complete verb 知道."
  ],
  [
    "道",
    "dào",
    "way; path; saying component",
    "Occurs in everyday words about knowing and roads.",
    [
      [
        "知道",
        "zhīdào",
        "to know"
      ],
      [
        "道路",
        "dàolù",
        "road"
      ],
      [
        "味道",
        "wèidào",
        "taste; smell"
      ]
    ],
    [
      "我不知道答案。",
      "Wǒ bù zhīdào dá'àn.",
      "I do not know the answer."
    ],
    [
      "这道菜味道很好。",
      "Zhè dào cài wèidào hěn hǎo.",
      "This dish tastes good."
    ],
    "The word 知道",
    "不 + 知道",
    "Knowing something is expressed with 知道; 不知道 means not knowing."
  ],
  [
    "做",
    "zuò",
    "do; make",
    "Used in everyday actions and common verb-object expressions.",
    [
      [
        "做饭",
        "zuò fàn",
        "cook a meal"
      ],
      [
        "做作业",
        "zuò zuòyè",
        "do homework"
      ],
      [
        "做什么",
        "zuò shénme",
        "do what"
      ]
    ],
    [
      "你今天做什么？",
      "Nǐ jīntiān zuò shénme?",
      "What are you doing today?"
    ],
    [
      "我晚上做作业。",
      "Wǒ wǎnshang zuò zuòyè.",
      "I do homework in the evening."
    ],
    "Doing an activity",
    "做 + task/activity",
    "Use 做 with everyday tasks such as cooking and homework; compare 作 in the noun 作业."
  ],
  [
    "玩",
    "wán",
    "play; have fun",
    "A verb for recreational activities and spending time with friends.",
    [
      [
        "好玩",
        "hǎowán",
        "fun"
      ],
      [
        "玩游戏",
        "wán yóuxì",
        "play games"
      ],
      [
        "玩儿",
        "wánr",
        "play; have fun (northern speech)"
      ]
    ],
    [
      "周末我和朋友玩游戏。",
      "Zhōumò wǒ hé péngyou wán yóuxì.",
      "I play games with friends on the weekend."
    ],
    [
      "这个游戏很好玩。",
      "Zhège yóuxì hěn hǎowán.",
      "This game is fun."
    ],
    "Talking about recreation",
    "玩 + activity",
    "Use 玩 with games and many recreational activities; 好玩 describes something enjoyable."
  ]
];
