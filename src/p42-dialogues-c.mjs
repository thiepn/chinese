/** P42 original intermediate listening/dialogue volume C. */
export const P42_DIALOGUE_C=String.raw`A volunteer's availability is not yet certain|Community responsibility|Distinguish intention from a confirmed commitment|The team waits for the volunteer to check a conflicting schedule before treating them as available.|可能 is possibility, 已经确认 is a settled response.|Do not count a person as attending on the strength of an unanswered invitation.|g105,g108,g113|确认~quèrèn~confirm|Explain availability honestly and offer a conditional answer.
A|我们星期六要去社区中心帮忙，你能来吗？|Wǒmen Xīngqīliù yào qù shèqū zhōngxīn bāngmáng, nǐ néng lái ma?|We're helping at the community center on Saturday. Can you come?
B|我很想参加，不过上午可能有别的安排。|Wǒ hěn xiǎng cānjiā, búguò shàngwǔ kěnéng yǒu bié de ānpái.|I'd really like to join, but I might have another commitment in the morning.
A|没关系，我们需要知道谁能真正参加。|Méi guānxi, wǒmen xūyào zhīdào shéi néng zhēnzhèng cānjiā.|That's fine. We need to know who can actually attend.
B|我先查看日程，晚上再给你明确的答复。|Wǒ xiān chákàn rìchéng, wǎnshang zài gěi nǐ míngquè de dáfù.|I'll check my schedule first, then give you a definite reply tonight.
A|好的。在那之前，我不会把你算进确认名单。|Hǎo de. Zài nà zhīqián, wǒ bú huì bǎ nǐ suàn jìn quèrèn míngdān.|All right. Until then, I won't count you among the confirmed participants.
B|谢谢。如果上午不行，下午的工作还需要人吗？|Xièxie. Rúguǒ shàngwǔ bù xíng, xiàwǔ de gōngzuò hái xūyào rén ma?|Thanks. If the morning doesn't work, do you still need help in the afternoon?
A|需要，不过我们也要先确认下午的具体任务。|Xūyào, búguò wǒmen yě yào xiān quèrèn xiàwǔ de jùtǐ rènwu.|We do, but we also need to confirm the specific afternoon tasks.
B|明白了，等我查好时间，我们再决定怎么安排。|Míngbai le, děng wǒ chá hǎo shíjiān, wǒmen zài juédìng zěnme ānpái.|I understand. Once I've checked my availability, we can decide on the arrangement.
Q|Is B on the confirmed Saturday volunteer list?|No, B has not checked their schedule yet.|Yes, B has agreed to the morning.|Yes, B has already finished the work.|4|A explicitly excludes unconfirmed participation.
Q|When does B promise a definite response?|That evening.|Next month.|After Saturday's work.|3|B promises to check and answer that evening.
Q|What must the group still confirm about the afternoon?|The specific tasks.|The event's old poster.|The weather last week.|6|Afternoon help is needed, but the work itself remains to be defined.

Clarifying a teacher's assignment|Education and instructions|Separate a topic announcement from the actual submission rule|The teacher distinguishes what the presentation is about from how its written evidence must be supplied.|关于 marks a topic; 按照 introduces a rule or instruction for action.|Do not assume a presentation topic alone specifies when and how it must be submitted.|g115,g117,g120|要求~yāoqiú~requirement|Ask a precise follow-up about an instruction rather than inventing a deadline.
A|老师，我想确认下星期的报告要求。|Lǎoshī, wǒ xiǎng quèrèn xià xīngqī de bàogào yāoqiú.|Teacher, I'd like to confirm next week's report requirements.
B|好。你准备介绍什么内容？|Hǎo. Nǐ zhǔnbèi jièshào shénme nèiróng?|All right. What will you present?
A|我想介绍关于城市交通变化的调查。|Wǒ xiǎng jièshào guānyú chéngshì jiāotōng biànhuà de diàochá.|I'd like to present a survey about changes in urban transport.
B|这个主题可以，但请按照课程说明引用资料。|Zhège zhǔtí kěyǐ, dàn qǐng ànzhào kèchéng shuōmíng yǐnyòng zīliào.|That topic is fine, but please cite the materials according to the course instructions.
A|我明白了。是不是每张图都需要说明来源？|Wǒ míngbai le. Shì bu shì měi zhāng tú dōu xūyào shuōmíng láiyuán?|I see. Does every figure need a source attribution?
B|对。引用的数据也要让读者能够找到原始来源。|Duì. Yǐnyòng de shùjù yě yào ràng dúzhě nénggòu zhǎo dào yuánshǐ láiyuán.|Yes. Readers should also be able to find the original sources of any data you cite.
A|那提交日期呢？我没在这张纸上看到。|Nà tíjiāo rìqī ne? Wǒ méi zài zhè zhāng zhǐ shàng kàn dào.|What about the submission date? I don't see it on this sheet.
B|日期写在课程网站上，你先查看最新公告。|Rìqī xiě zài kèchéng wǎngzhàn shàng, nǐ xiān chákàn zuìxīn gōnggào.|The date is on the course website. Check the latest announcement first.
Q|Has the teacher accepted the proposed report topic?|Yes, provided the student follows source-citation rules.|No, all transport topics are forbidden.|Yes, without any conditions.|3|The teacher accepts the subject but adds citation requirements.
Q|Where should A find the submission date?|On the latest course website announcement.|On the figure caption.|In a friend's old notes.|7|The date was not on the sheet; the website is the stated source.
Q|What does B require for cited data?|A traceable original source.|A handwritten picture only.|An invented rounded number.|5|Readers must be able to locate the original data source.

A hotel room request without a promise|Travel and customer communication|Differentiate checking availability from granting a change|Front-desk staff cannot promise a new room before confirming availability.|可以帮您查 means can check; 已经换好了 means already changed.|Do not claim the room has been changed merely because staff offered to investigate.|g95,g108,g113|房间~fángjiān~room|Make a polite request and summarize the uncertainty correctly.
A|您好，我昨晚住进来的房间靠近电梯，有点儿吵。|Nín hǎo, wǒ zuówǎn zhù jìnlai de fángjiān kàojìn diàntī, yǒudiǎnr chǎo.|Hello, the room I moved into last night is near the lift and is a little noisy.
B|很抱歉。您希望换到安静一些的房间吗？|Hěn bàoqiàn. Nín xīwàng huàn dào ānjìng yìxiē de fángjiān ma?|I'm sorry. Would you like to change to a quieter room?
A|是的，如果有空房间，我愿意换。|Shì de, rúguǒ yǒu kòng fángjiān, wǒ yuànyì huàn.|Yes. If a room is available, I'd be willing to move.
B|我可以先帮您查看，不过现在还不能保证有空房。|Wǒ kěyǐ xiān bāng nín chákàn, búguò xiànzài hái bù néng bǎozhèng yǒu kòng fáng.|I can check first, but I can't guarantee availability yet.
A|明白。我需要现在就把行李收拾好吗？|Míngbai. Wǒ xūyào xiànzài jiù bǎ xíngli shōushi hǎo ma?|I understand. Do I need to pack my luggage now?
B|不用，请先留在原来的房间，等我们确认。|Bú yòng, qǐng xiān liú zài yuánlái de fángjiān, děng wǒmen quèrèn.|No. Please stay in the original room while we check.
A|好的，我会等您告诉我结果。|Hǎo de, wǒ huì děng nín gàosu wǒ jiéguǒ.|All right. I'll wait for you to tell me the result.
B|谢谢理解。确认以后我们会主动联系您。|Xièxie lǐjiě. Quèrèn yǐhòu wǒmen huì zhǔdòng liánxì nín.|Thank you for understanding. We'll contact you after confirmation.
Q|Has the hotel granted a room change yet?|No, staff still need to check availability.|Yes, the guest already moved.|Yes, the hotel is closing.|3|An offer to check availability is not a confirmed change.
Q|What should the guest do while waiting?|Remain in the original room.|Pack and move immediately.|Wait outside the hotel.|5|Staff expressly ask the guest to stay for now.
Q|What will happen after the hotel confirms the result?|Staff will contact the guest.|The guest must guess the room number.|A new booking is automatically charged.|7|The hotel promises follow-up contact, not a specific room.

Two ways to respond to a misunderstanding|Language exchange and politeness|Ask a clarification question without changing the intended content|An alternative restatement can confirm a speaker's intended meaning without falsely asserting a stronger commitment.|可能来 means might come; 一定来 means definitely coming.|Avoid changing uncertainty into certainty when paraphrasing.|g110,g111,g120|意思~yìsi~meaning|Practise confirming uncertain arrangements without sounding accusatory.
A|小陈刚才说他周末可能来参加活动。|Xiǎochén gāngcái shuō tā zhōumò kěnéng lái cānjiā huódòng.|Xiaochen just said he might join the weekend event.
B|那我可以告诉组长，他一定会来吗？|Nà wǒ kěyǐ gàosu zǔzhǎng, tā yídìng huì lái ma?|Then can I tell the leader he'll definitely come?
A|最好不要这样说，因为他还没有确定。|Zuì hǎo bú yào zhèyàng shuō, yīnwèi tā hái méiyǒu quèdìng.|It's better not to say that, because he hasn't confirmed yet.
B|原来我把可能理解成一定了。|Yuánlái wǒ bǎ kěnéng lǐjiě chéng yídìng le.|I see—I understood 'might' as 'definitely.'
A|我们可以先问他：“你是说还需要确认时间吗？”|Wǒmen kěyǐ xiān wèn tā: “Nǐ shì shuō hái xūyào quèrèn shíjiān ma?”|We can first ask him, “Do you mean you still need to confirm the time?”
B|这样比较礼貌，也不会改变他原来的意思。|Zhèyàng bǐjiào lǐmào, yě bú huì gǎibiàn tā yuánlái de yìsi.|That's more polite and doesn't change what he originally meant.
A|对。等他明确答复，我们再通知组长。|Duì. Děng tā míngquè dáfù, wǒmen zài tōngzhī zǔzhǎng.|Right. We'll inform the leader after he answers clearly.
B|好，我先给他发一条确认消息。|Hǎo, wǒ xiān gěi tā fā yì tiáo quèrèn xiāoxi.|All right. I'll first send him a message asking for confirmation.
Q|What did Xiaochen originally say about attending?|He might attend.|He definitely will attend.|He cannot attend under any circumstances.|0|His original remark expresses possibility.
Q|Why does A recommend asking a clarification question?|To avoid overstating an unconfirmed plan.|To make the message longer.|To cancel the event.|4|The proposed question preserves the original uncertain meaning.
Q|When will they tell the group leader about confirmed attendance?|After receiving a clear reply from Xiaochen.|Before sending any question.|Immediately as a definite yes.|6|The speakers defer confirmation until an explicit answer.`;
