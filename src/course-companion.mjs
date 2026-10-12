/** P21 original beginner teaching companions. Not official HSK content.
 * The existing six-stage journey remains the sole writer of course responses.
 * Each contextual check is a variant of the existing sentence stage on repeat.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {FOUNDATION_ADDITIONS} from './foundational-expansion.mjs';
const COURSE_CONTEXT = [
  {
    "anchor": "我",
    "title": "I, we and possession",
    "pattern": "我 + noun; 我的 + noun; 我们 + verb",
    "explanation": "Use 我 for yourself, 我们 for a group including you, and 的 to connect a possessor with what belongs to them.",
    "pitfall": "我的 is not a plural form of 我.",
    "examples": [
      {
        "hanzi": "这是我的书。",
        "pinyin": "Zhè shì wǒ de shū.",
        "english": "This is my book."
      },
      {
        "hanzi": "我们学习中文。",
        "pinyin": "Wǒmen xuéxí Zhōngwén.",
        "english": "We study Chinese."
      }
    ],
    "question": {
      "prompt": "Which sentence means “This is my book”?",
      "answer": "这是我的书。",
      "options": [
        "这是我的书。",
        "这是我们。",
        "我很书。",
        "你是我的。"
      ]
    }
  },
  {
    "anchor": "你",
    "title": "Yes–no questions with 吗",
    "pattern": "Statement + 吗？",
    "explanation": "Put 吗 at the end of a statement to ask a yes–no question without changing the word order.",
    "pitfall": "Do not put 吗 before the verb.",
    "examples": [
      {
        "hanzi": "你是学生吗？",
        "pinyin": "Nǐ shì xuésheng ma?",
        "english": "Are you a student?"
      },
      {
        "hanzi": "你喜欢茶吗？",
        "pinyin": "Nǐ xǐhuan chá ma?",
        "english": "Do you like tea?"
      }
    ],
    "question": {
      "prompt": "Which sentence asks “Are you a student”?",
      "answer": "你是学生吗？",
      "options": [
        "你是学生吗？",
        "你吗是学生？",
        "你是吗学生？",
        "你是学生。"
      ]
    }
  },
  {
    "anchor": "好",
    "title": "Adjectives without 是",
    "pattern": "Subject + 很 + adjective",
    "explanation": "An adjective can describe a subject directly. 很 is often used before an adjective without strongly meaning “very.”",
    "pitfall": "Avoid 我是很好 for a simple “I am well.”",
    "examples": [
      {
        "hanzi": "今天天气很好。",
        "pinyin": "Jīntiān tiānqì hěn hǎo.",
        "english": "The weather is nice today."
      },
      {
        "hanzi": "这本书很好。",
        "pinyin": "Zhè běn shū hěn hǎo.",
        "english": "This book is good."
      }
    ],
    "question": {
      "prompt": "Which is a natural basic sentence for “The weather is good today”?",
      "answer": "今天天气很好。",
      "options": [
        "今天天气很好。",
        "今天是天气好。",
        "今天很是天气。",
        "天气是今天很好。"
      ]
    }
  },
  {
    "anchor": "是",
    "title": "Identity statements with 是",
    "pattern": "Subject + 是 + noun",
    "explanation": "Use 是 to identify people and things. Ordinary adjectives typically do not need 是.",
    "pitfall": "我是学生 is natural; 我是忙 is not the standard beginner form for “I am busy.”",
    "examples": [
      {
        "hanzi": "她是老师。",
        "pinyin": "Tā shì lǎoshī.",
        "english": "She is a teacher."
      },
      {
        "hanzi": "我不是学生。",
        "pinyin": "Wǒ bú shì xuésheng.",
        "english": "I am not a student."
      }
    ],
    "question": {
      "prompt": "Which sentence means “She is a teacher”?",
      "answer": "她是老师。",
      "options": [
        "她是老师。",
        "她很老师。",
        "她有老师。",
        "她在老师。"
      ]
    }
  },
  {
    "anchor": "人",
    "title": "People and nationality words",
    "pattern": "Place + 人",
    "explanation": "Place names can combine with 人 to describe where someone is from, but a whole word still has its own meaning.",
    "pitfall": "Do not assume every character containing 人 is a nationality.",
    "examples": [
      {
        "hanzi": "他是中国人。",
        "pinyin": "Tā shì Zhōngguórén.",
        "english": "He is Chinese."
      },
      {
        "hanzi": "我的家人都在这里。",
        "pinyin": "Wǒ de jiārén dōu zài zhèlǐ.",
        "english": "My family members are all here."
      }
    ],
    "question": {
      "prompt": "Which sentence means “He is Chinese”?",
      "answer": "他是中国人。",
      "options": [
        "他是中国人。",
        "他去中国人。",
        "他有中国人。",
        "他在中国人。"
      ]
    }
  },
  {
    "anchor": "学",
    "title": "Actions at a location",
    "pattern": "Subject + 在 + place + verb",
    "explanation": "在 can identify where an activity happens. The activity verb follows the place phrase.",
    "pitfall": "Keep 在学校 and 学习 as different parts of the sentence.",
    "examples": [
      {
        "hanzi": "我在学校学习。",
        "pinyin": "Wǒ zài xuéxiào xuéxí.",
        "english": "I study at school."
      },
      {
        "hanzi": "老师在教室说话。",
        "pinyin": "Lǎoshī zài jiàoshì shuōhuà.",
        "english": "The teacher is talking in the classroom."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I study at school”?",
      "answer": "我在学校学习。",
      "options": [
        "我在学校学习。",
        "我学习在学校。",
        "我学校是学习。",
        "我在学习学校。"
      ]
    }
  },
  {
    "anchor": "书",
    "title": "Verbs with objects",
    "pattern": "Verb + object",
    "explanation": "Common Chinese activities are expressed with a verb followed by a noun, such as 看书 or 喝水.",
    "pitfall": "A fixed verb–object expression is learned as a unit, not translated character by character.",
    "examples": [
      {
        "hanzi": "我晚上看书。",
        "pinyin": "Wǒ wǎnshang kàn shū.",
        "english": "I read books in the evening."
      },
      {
        "hanzi": "他喜欢读书。",
        "pinyin": "Tā xǐhuan dúshū.",
        "english": "He enjoys reading."
      }
    ],
    "question": {
      "prompt": "Which phrase means “read a book / books”?",
      "answer": "看书",
      "options": [
        "看书",
        "书看",
        "看水",
        "书喝"
      ]
    }
  },
  {
    "anchor": "看",
    "title": "Looking versus seeing",
    "pattern": "看 + object; 看见 + object",
    "explanation": "看 describes looking or reading; 看见 emphasizes successfully seeing something.",
    "pitfall": "看 and 看见 are related but are not interchangeable in every sentence.",
    "examples": [
      {
        "hanzi": "我在看书。",
        "pinyin": "Wǒ zài kàn shū.",
        "english": "I am reading."
      },
      {
        "hanzi": "我看见你的朋友了。",
        "pinyin": "Wǒ kànjiàn nǐ de péngyou le.",
        "english": "I saw your friend."
      }
    ],
    "question": {
      "prompt": "Which sentence clearly states “I saw your friend”?",
      "answer": "我看见你的朋友了。",
      "options": [
        "我看见你的朋友了。",
        "我看书的朋友。",
        "我听你的朋友书。",
        "我在朋友看。"
      ]
    }
  },
  {
    "anchor": "吃",
    "title": "Wanting to do something",
    "pattern": "想 + verb + object",
    "explanation": "想 can express a desire or intention before a verb. Keep the activity together after 想.",
    "pitfall": "想吃饭 is “want to eat”; it is not a past-tense form.",
    "examples": [
      {
        "hanzi": "我想吃米饭。",
        "pinyin": "Wǒ xiǎng chī mǐfàn.",
        "english": "I want to eat rice."
      },
      {
        "hanzi": "你想喝什么？",
        "pinyin": "Nǐ xiǎng hē shénme?",
        "english": "What would you like to drink?"
      }
    ],
    "question": {
      "prompt": "Which phrase means “want to eat”?",
      "answer": "想吃",
      "options": [
        "想吃",
        "吃想",
        "是吃",
        "有吃"
      ]
    }
  },
  {
    "anchor": "喝",
    "title": "Requesting a drink",
    "pattern": "我想要 + drink",
    "explanation": "想要 is useful for expressing what you would like. In a simple request, the requested drink follows it.",
    "pitfall": "Avoid treating 要 as a universal translation of every English use of “will”.",
    "examples": [
      {
        "hanzi": "我想要一杯茶。",
        "pinyin": "Wǒ xiǎng yào yì bēi chá.",
        "english": "I would like a cup of tea."
      },
      {
        "hanzi": "你要喝水吗？",
        "pinyin": "Nǐ yào hē shuǐ ma?",
        "english": "Do you want to drink water?"
      }
    ],
    "question": {
      "prompt": "Which sentence politely expresses “I would like a cup of tea”?",
      "answer": "我想要一杯茶。",
      "options": [
        "我想要一杯茶。",
        "我茶是一杯想。",
        "茶我要是杯。",
        "我想杯茶有。"
      ]
    }
  },
  {
    "anchor": "水",
    "title": "Measure words and containers",
    "pattern": "Number + measure word + noun",
    "explanation": "Chinese normally uses a measure word between a number and a counted noun. 一杯水 uses 杯 for a cupful.",
    "pitfall": "一本书 and 一杯水 do not use the same measure word.",
    "examples": [
      {
        "hanzi": "我喝一杯水。",
        "pinyin": "Wǒ hē yì bēi shuǐ.",
        "english": "I drink a glass of water."
      },
      {
        "hanzi": "这里有两杯茶。",
        "pinyin": "Zhèlǐ yǒu liǎng bēi chá.",
        "english": "There are two cups of tea here."
      }
    ],
    "question": {
      "prompt": "Which phrase means “a cup of water”?",
      "answer": "一杯水",
      "options": [
        "一杯水",
        "一本水",
        "一个杯水水",
        "一水杯个"
      ]
    }
  },
  {
    "anchor": "大",
    "title": "Describing size",
    "pattern": "Noun + 很 + 大/小",
    "explanation": "大 and 小 are adjectives. Describe an object by putting an adjective after the subject.",
    "pitfall": "The word 很 can be a neutral link in basic positive adjective sentences.",
    "examples": [
      {
        "hanzi": "这个房间很大。",
        "pinyin": "Zhège fángjiān hěn dà.",
        "english": "This room is large."
      },
      {
        "hanzi": "那只猫很小。",
        "pinyin": "Nà zhī māo hěn xiǎo.",
        "english": "That cat is small."
      }
    ],
    "question": {
      "prompt": "Which sentence means “This room is large”?",
      "answer": "这个房间很大。",
      "options": [
        "这个房间很大。",
        "这个房间是大。",
        "这个大很房间。",
        "大这个有房间。"
      ]
    }
  },
  {
    "anchor": "天",
    "title": "Time words and planned actions",
    "pattern": "Tomorrow + subject + verb",
    "explanation": "Chinese verbs generally do not change form to indicate the future. A time expression such as 明天 establishes when something happens.",
    "pitfall": "Do not add an English-style future suffix to the verb.",
    "examples": [
      {
        "hanzi": "明天我去学校。",
        "pinyin": "Míngtiān wǒ qù xuéxiào.",
        "english": "Tomorrow I will go to school."
      },
      {
        "hanzi": "今天我们喝茶。",
        "pinyin": "Jīntiān wǒmen hē chá.",
        "english": "We drink tea today."
      }
    ],
    "question": {
      "prompt": "Which sentence means “Tomorrow I will go to school”?",
      "answer": "明天我去学校。",
      "options": [
        "明天我去学校。",
        "我昨天去学校。",
        "明天学校我去吗。",
        "明天我学校是。"
      ]
    }
  },
  {
    "anchor": "说",
    "title": "Learned ability with 会",
    "pattern": "Subject + 会 + verb",
    "explanation": "会 often expresses an ability acquired through learning, such as knowing how to speak a language.",
    "pitfall": "会说中文 and 在说中文 refer to different ideas.",
    "examples": [
      {
        "hanzi": "我会说中文。",
        "pinyin": "Wǒ huì shuō Zhōngwén.",
        "english": "I can speak Chinese."
      },
      {
        "hanzi": "她会写汉字。",
        "pinyin": "Tā huì xiě Hànzì.",
        "english": "She can write Chinese characters."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I can speak Chinese”?",
      "answer": "我会说中文。",
      "options": [
        "我会说中文。",
        "我说中文会吗。",
        "我在会中文。",
        "我有说会中文。"
      ]
    }
  },
  {
    "anchor": "听",
    "title": "Listening and hearing",
    "pattern": "听 + sound/source; 听见 + sound",
    "explanation": "听 describes the action of listening, while 听见 can emphasize perceiving a sound.",
    "pitfall": "Do not translate 听见 simply as “listen to.”",
    "examples": [
      {
        "hanzi": "我喜欢听音乐。",
        "pinyin": "Wǒ xǐhuan tīng yīnyuè.",
        "english": "I like listening to music."
      },
      {
        "hanzi": "我听见老师说话了。",
        "pinyin": "Wǒ tīngjiàn lǎoshī shuōhuà le.",
        "english": "I heard the teacher speaking."
      }
    ],
    "question": {
      "prompt": "Which phrase clearly means “hear” rather than “listen”?",
      "answer": "听见",
      "options": [
        "听见",
        "听歌",
        "看书",
        "读书"
      ]
    }
  },
  {
    "anchor": "有",
    "title": "Possession and existence",
    "pattern": "Subject + 有 + noun",
    "explanation": "有 describes possession or the existence of something. 没有 negates possession or existence.",
    "pitfall": "Do not use 不有 for ordinary negative possession.",
    "examples": [
      {
        "hanzi": "我有一本中文书。",
        "pinyin": "Wǒ yǒu yì běn Zhōngwén shū.",
        "english": "I have a Chinese book."
      },
      {
        "hanzi": "这里没有人。",
        "pinyin": "Zhèlǐ méiyǒu rén.",
        "english": "There is nobody here."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I do not have a book”?",
      "answer": "我没有书。",
      "options": [
        "我没有书。",
        "我不是有书。",
        "我不有书。",
        "我没有是书。"
      ]
    }
  },
  {
    "anchor": "不",
    "title": "Negation: 不 and 没",
    "pattern": "不 + general action; 没 + 有",
    "explanation": "不 commonly negates habitual, future or descriptive statements. 没有 negates possession and many past-event statements.",
    "pitfall": "Negation depends on the construction, not a one-to-one English translation.",
    "examples": [
      {
        "hanzi": "我今天不去学校。",
        "pinyin": "Wǒ jīntiān bú qù xuéxiào.",
        "english": "I am not going to school today."
      },
      {
        "hanzi": "我没有电脑。",
        "pinyin": "Wǒ méiyǒu diànnǎo.",
        "english": "I do not have a computer."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I do not have a computer”?",
      "answer": "我没有电脑。",
      "options": [
        "我没有电脑。",
        "我不电脑有。",
        "我不是电脑。",
        "我没有去电脑。"
      ]
    }
  },
  {
    "anchor": "再",
    "title": "Doing something again later",
    "pattern": "再 + verb",
    "explanation": "再 usually points to repetition or continuation still to come; 又 often reports something happening again.",
    "pitfall": "Use 明天再来 for a future return, not 明天又来 by default.",
    "examples": [
      {
        "hanzi": "我们明天再见。",
        "pinyin": "Wǒmen míngtiān zàijiàn.",
        "english": "See you tomorrow."
      },
      {
        "hanzi": "请再说一次。",
        "pinyin": "Qǐng zài shuō yí cì.",
        "english": "Please say it once more."
      }
    ],
    "question": {
      "prompt": "Which phrase means “say it again” in a request?",
      "answer": "再说一次",
      "options": [
        "再说一次",
        "又说昨天",
        "一次说又",
        "再一次昨天"
      ]
    }
  },
  {
    "anchor": "家",
    "title": "Movement toward home",
    "pattern": "回 + home/place",
    "explanation": "回家 is a common expression for going home. 来/去 signal movement relative to a location or viewpoint.",
    "pitfall": "回家 normally does not need 在 between 回 and 家.",
    "examples": [
      {
        "hanzi": "我下午回家。",
        "pinyin": "Wǒ xiàwǔ huí jiā.",
        "english": "I go home in the afternoon."
      },
      {
        "hanzi": "朋友明天来我家。",
        "pinyin": "Péngyou míngtiān lái wǒ jiā.",
        "english": "A friend is coming to my home tomorrow."
      }
    ],
    "question": {
      "prompt": "Which phrase means “go home”?",
      "answer": "回家",
      "options": [
        "回家",
        "家回在",
        "是家",
        "家有回"
      ]
    }
  },
  {
    "anchor": "这",
    "title": "Near demonstratives and measure words",
    "pattern": "这 + measure word + noun",
    "explanation": "这 means “this”; many noun phrases use a measure word after it: 这个人, 这本书.",
    "pitfall": "这个书 is possible colloquially but 这本书 is a useful standard model.",
    "examples": [
      {
        "hanzi": "这本书很好。",
        "pinyin": "Zhè běn shū hěn hǎo.",
        "english": "This book is good."
      },
      {
        "hanzi": "这个人是老师。",
        "pinyin": "Zhège rén shì lǎoshī.",
        "english": "This person is a teacher."
      }
    ],
    "question": {
      "prompt": "Which phrase is the taught model for “this book”?",
      "answer": "这本书",
      "options": [
        "这本书",
        "书这本",
        "本这书",
        "这杯书"
      ]
    }
  },
  {
    "anchor": "那",
    "title": "Distant demonstratives",
    "pattern": "那 + measure word + noun",
    "explanation": "那 often means “that,” contrasting with 这 “this.” Choose measure words appropriate to the noun.",
    "pitfall": "那个人 and 那本书 use different noun phrases.",
    "examples": [
      {
        "hanzi": "那个人是我朋友。",
        "pinyin": "Nàge rén shì wǒ péngyou.",
        "english": "That person is my friend."
      },
      {
        "hanzi": "那本书很有趣。",
        "pinyin": "Nà běn shū hěn yǒuqù.",
        "english": "That book is interesting."
      }
    ],
    "question": {
      "prompt": "Which phrase means “that book”?",
      "answer": "那本书",
      "options": [
        "那本书",
        "这本书",
        "哪个书",
        "那杯书"
      ]
    }
  },
  {
    "anchor": "哪",
    "title": "Asking which or where",
    "pattern": "哪 + measure word + noun; 哪里",
    "explanation": "哪 asks which; 哪里 asks where. Remember that 哪 and 那 have different tones and functions.",
    "pitfall": "哪个人? is a question; 那个人 is a statement-like noun phrase.",
    "examples": [
      {
        "hanzi": "你住在哪里？",
        "pinyin": "Nǐ zhù zài nǎlǐ?",
        "english": "Where do you live?"
      },
      {
        "hanzi": "你喜欢哪本书？",
        "pinyin": "Nǐ xǐhuan nǎ běn shū?",
        "english": "Which book do you like?"
      }
    ],
    "question": {
      "prompt": "Which question means “Where do you live”?",
      "answer": "你住在哪里？",
      "options": [
        "你住在哪里？",
        "你住在那里。",
        "你是什么书？",
        "你哪里是书？"
      ]
    }
  },
  {
    "anchor": "多",
    "title": "Asking how many or how much",
    "pattern": "多少 + noun",
    "explanation": "多少 asks about quantity or price. The surrounding sentence provides the context.",
    "pitfall": "多少 is a single question expression in use, not just the sum of “many” and “few.”",
    "examples": [
      {
        "hanzi": "你有多少本书？",
        "pinyin": "Nǐ yǒu duōshao běn shū?",
        "english": "How many books do you have?"
      },
      {
        "hanzi": "这个多少钱？",
        "pinyin": "Zhège duōshao qián?",
        "english": "How much does this cost?"
      }
    ],
    "question": {
      "prompt": "Which question asks “How much does this cost”?",
      "answer": "这个多少钱？",
      "options": [
        "这个多少钱？",
        "这个很多钱。",
        "这个钱多少有。",
        "多少钱这个有。"
      ]
    }
  },
  {
    "anchor": "年",
    "title": "Time words without verb conjugation",
    "pattern": "今年 / 明年 + clause",
    "explanation": "今年 means this year and 明年 means next year. Time expressions commonly appear before the subject or after it.",
    "pitfall": "Chinese verbs do not need to change their ending after 明年.",
    "examples": [
      {
        "hanzi": "今年我学习中文。",
        "pinyin": "Jīnnián wǒ xuéxí Zhōngwén.",
        "english": "This year I study Chinese."
      },
      {
        "hanzi": "明年她去中国。",
        "pinyin": "Míngnián tā qù Zhōngguó.",
        "english": "Next year she will go to China."
      }
    ],
    "question": {
      "prompt": "Which sentence means “Next year she will go to China”?",
      "answer": "明年她去中国。",
      "options": [
        "明年她去中国。",
        "今年她去中国。",
        "她昨天去中国。",
        "她是中国明年。"
      ]
    }
  },
  {
    "anchor": "点",
    "title": "Telling the time",
    "pattern": "Number + 点 (+ 分)",
    "explanation": "Use 点 for clock hours and 分 for minutes; a daypart can make the intended time clear.",
    "pitfall": "八点 is 8 o'clock, not 8 hours of duration.",
    "examples": [
      {
        "hanzi": "现在八点。",
        "pinyin": "Xiànzài bā diǎn.",
        "english": "It is eight o'clock now."
      },
      {
        "hanzi": "我九点去学校。",
        "pinyin": "Wǒ jiǔ diǎn qù xuéxiào.",
        "english": "I go to school at nine."
      }
    ],
    "question": {
      "prompt": "Which expression means “nine o'clock”?",
      "answer": "九点",
      "options": [
        "九点",
        "九年",
        "九杯",
        "九人"
      ]
    }
  },
  {
    "anchor": "来",
    "title": "Coming and going",
    "pattern": "来 toward; 去 away",
    "explanation": "来 typically indicates motion toward a reference point, while 去 indicates going away or toward a destination.",
    "pitfall": "Choose 来 or 去 according to the viewpoint, not simply the English word “move.”",
    "examples": [
      {
        "hanzi": "请来我家。",
        "pinyin": "Qǐng lái wǒ jiā.",
        "english": "Please come to my home."
      },
      {
        "hanzi": "我明天去学校。",
        "pinyin": "Wǒ míngtiān qù xuéxiào.",
        "english": "I will go to school tomorrow."
      }
    ],
    "question": {
      "prompt": "Which sentence invites someone to come to your home?",
      "answer": "请来我家。",
      "options": [
        "请来我家。",
        "请去你的学校。",
        "我明天去学校。",
        "我家去请。"
      ]
    }
  },
  {
    "anchor": "会",
    "title": "Abilities and possibilities",
    "pattern": "会 + learned skill",
    "explanation": "会 can express a skill learned through practice; 能 often concerns capability or circumstances. Some contexts allow either.",
    "pitfall": "Do not treat 会 as identical to English “will” in every sentence.",
    "examples": [
      {
        "hanzi": "我会写汉字。",
        "pinyin": "Wǒ huì xiě Hànzì.",
        "english": "I can write Chinese characters."
      },
      {
        "hanzi": "今天我不能去。",
        "pinyin": "Jīntiān wǒ bù néng qù.",
        "english": "I cannot go today."
      }
    ],
    "question": {
      "prompt": "Which sentence describes an acquired writing skill?",
      "answer": "我会写汉字。",
      "options": [
        "我会写汉字。",
        "我在汉字会。",
        "我有会汉字。",
        "我写会是汉字。"
      ]
    }
  },
  {
    "anchor": "写",
    "title": "Writing for someone",
    "pattern": "给 + person + 写 + item",
    "explanation": "给 can identify the recipient or beneficiary of an action. Keep the person and written item distinct.",
    "pitfall": "Writing a letter to someone is commonly 给某人写信.",
    "examples": [
      {
        "hanzi": "我给朋友写信。",
        "pinyin": "Wǒ gěi péngyou xiě xìn.",
        "english": "I write a letter to a friend."
      },
      {
        "hanzi": "她给老师写邮件。",
        "pinyin": "Tā gěi lǎoshī xiě yóujiàn.",
        "english": "She writes an email to the teacher."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I write a letter to a friend”?",
      "answer": "我给朋友写信。",
      "options": [
        "我给朋友写信。",
        "我写给信朋友。",
        "我朋友信给写。",
        "我有朋友写信。"
      ]
    }
  },
  {
    "anchor": "喜",
    "title": "Liking activities",
    "pattern": "喜欢 + noun or verb phrase",
    "explanation": "喜欢 can be followed by an activity, such as 看书, as well as a noun.",
    "pitfall": "喜欢喝茶 describes liking the activity of drinking tea.",
    "examples": [
      {
        "hanzi": "我喜欢听歌。",
        "pinyin": "Wǒ xǐhuan tīng gē.",
        "english": "I like listening to songs."
      },
      {
        "hanzi": "他们喜欢看书。",
        "pinyin": "Tāmen xǐhuan kàn shū.",
        "english": "They like reading books."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I like listening to songs”?",
      "answer": "我喜欢听歌。",
      "options": [
        "我喜欢听歌。",
        "我听歌喜欢是。",
        "我是歌喜欢。",
        "我有喜欢听。"
      ]
    }
  },
  {
    "anchor": "爱",
    "title": "Expressing affection",
    "pattern": "爱 + person or thing",
    "explanation": "爱 expresses love or strong affection; 喜欢 is usually a less intense or more general preference.",
    "pitfall": "爱 and 喜欢 overlap but differ in emotional strength and context.",
    "examples": [
      {
        "hanzi": "我爱我的家人。",
        "pinyin": "Wǒ ài wǒ de jiārén.",
        "english": "I love my family."
      },
      {
        "hanzi": "我很喜欢这本书。",
        "pinyin": "Wǒ hěn xǐhuan zhè běn shū.",
        "english": "I really like this book."
      }
    ],
    "question": {
      "prompt": "Which sentence means “I love my family”?",
      "answer": "我爱我的家人。",
      "options": [
        "我爱我的家人。",
        "我喜欢看书。",
        "我有很多书。",
        "家人爱我的书。"
      ]
    }
  }
];
const BY_LESSON = new Map();
for (const unit of COURSE_CONTEXT) {
 const lesson = DEMO_LESSONS.find(item=>item.hanzi===unit.anchor);
 if (lesson) BY_LESSON.set(lesson.id,Object.freeze({...unit,lessonId:lesson.id,order:lesson.order}));
}
// Extend the same P21 grammar interface to the P22 character additions.
for(const [index,row] of FOUNDATION_ADDITIONS.entries()){
 const lesson=DEMO_LESSONS[74+index];if(!lesson)continue;
 const otherSentences=FOUNDATION_ADDITIONS.filter((_,i)=>i!==index).map(entry=>entry[6][2]);
 const candidates=[row[6][2],...otherSentences.slice(index*3),...otherSentences];
 const options=[...new Set(candidates)].slice(0,4);
 const rotated=[...options.slice(index%options.length),...options.slice(0,index%options.length)];
 BY_LESSON.set(lesson.id,Object.freeze({lessonId:lesson.id,order:lesson.order,anchor:row[0],
  title:row[7],pattern:row[8],explanation:row[9],
  pitfall:'Learn the entire expression rather than translating every character in isolation.',
  examples:[{hanzi:row[5][0],pinyin:row[5][1],english:row[5][2]},
            {hanzi:row[6][0],pinyin:row[6][1],english:row[6][2]}],
  question:{prompt:`Which English meaning matches “${row[6][0]}”?`,answer:row[6][2],options:rotated}}));
}
export const COURSE_COMPANIONS = Object.freeze([...BY_LESSON.values()].sort((a,b)=>a.order-b.order));
export function companionForLesson(lessonId){return BY_LESSON.get(lessonId)||null;}
export function companionQuestion(lessonId){
 const unit=companionForLesson(lessonId);
 if(!unit)return null;
 return {stage:'sentence',kind:'choice',prompt:unit.question.prompt,
  answer:unit.question.answer,options:[...unit.question.options],
  teaching:unit.explanation,grammarFocus:unit.title};
}
export function nearbyCompanions(lessonId,count=4){
 const current=DEMO_LESSONS.find(l=>l.id===lessonId)?.order||1;
 return [...COURSE_COMPANIONS].sort((a,b)=>Math.abs(a.order-current)-Math.abs(b.order-current)||a.order-b.order).slice(0,count);
}
