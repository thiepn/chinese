/** Everyday Mandarin Series B: original colloquial daily-life conversations.
 * Continues everyday-dialogues-a; same editorial rules and pinyin conventions.
 */
export const EVERYDAY_DIALOGUES_B=[
 {
  id:'everyday-dialogue-07',
  title:'Seeing a doctor about a sore throat',
  theme:'Symptoms, simple advice and filling a prescription',
  goal:'Describe symptoms, answer the doctor\'s questions and understand simple advice',
  register:'Warm-clinical; the doctor speaks plainly and repeats key advice',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Doctor',hanzi:'请坐。哪里不舒服？',pinyin:'Qǐng zuò. Nǎlǐ bù shūfu?',english:'Please sit down. What\'s bothering you?'},
   {speaker:'Patient',hanzi:'嗓子疼，还有点发烧。',pinyin:'Sǎngzi téng, hái yǒudiǎn fāshāo.',english:'My throat hurts, and I have a slight fever.'},
   {speaker:'Doctor',hanzi:'疼了几天了？咳嗽吗？',pinyin:'Téng le jǐ tiān le? Késou ma?',english:'How many days has it hurt? Any cough?'},
   {speaker:'Patient',hanzi:'从前天开始的，晚上咳得厉害。',pinyin:'Cóng qiántiān kāishǐ de, wǎnshang ké de lìhai.',english:'It started the day before yesterday; I cough badly at night.'},
   {speaker:'Doctor',hanzi:'可能是感冒。我看看嗓子——张嘴，啊。',pinyin:'Kěnéng shì gǎnmào. Wǒ kànkan sǎngzi — zhāng zuǐ, a.',english:'It\'s probably a cold. Let me look at your throat — open your mouth, "ah".'},
   {speaker:'Patient',hanzi:'严重吗？要不要吃药？',pinyin:'Yánzhòng ma? Yào bú yào chī yào?',english:'Is it serious? Do I need medicine?'},
   {speaker:'Doctor',hanzi:'不严重。先吃这个药，一天三次，多喝水，早点休息。',pinyin:'Bù yánzhòng. Xiān chī zhège yào, yì tiān sān cì, duō hē shuǐ, zǎodiǎn xiūxi.',english:'Not serious. Take this medicine first — three times a day — drink plenty of water and rest early.'},
   {speaker:'Patient',hanzi:'好的，谢谢医生。要是还不舒服，我再来。',pinyin:'Hǎo de, xièxie yīshēng. Yàoshi hái bù shūfu, wǒ zài lái.',english:'Okay, thank you, doctor. If I still feel unwell, I\'ll come back.'}
  ],
  questions:[
   {id:'everyday-dialogue-07:q0',prompt:'What are the patient\'s main symptoms?',answer:'A sore throat and a slight fever.',options:['A sore throat and a slight fever.','A headache and a broken arm.','A stomachache and dizziness.','Nothing serious.'],evidenceIndex:1,explanation:'嗓子疼，还有点发烧 lists exactly two symptoms.'},
   {id:'everyday-dialogue-07:q1',prompt:'What does 咳得厉害 describe?',answer:'Coughing severely — 得 links the verb to a degree description.',options:['Coughing severely — 得 links the verb to a degree description.','Coughing only at night.','Not coughing at all.','A cough caused by medicine.'],evidenceIndex:3,explanation:'Verb + 得 + description shows degree: 咳得厉害 "coughs severely". 晚上 just says when.'},
   {id:'everyday-dialogue-07:q2',prompt:'How often should the patient take the medicine?',answer:'Three times a day.',options:['Three times a day.','Once a day.','Three days in a row.','Only at night.'],evidenceIndex:6,explanation:'一天三次 is the standard way to state dosing frequency.'}
  ]
 },
 {
  id:'everyday-dialogue-08',
  title:'Making weekend plans on the phone',
  theme:'Invitations, alternatives and settling on a plan',
  goal:'Propose activities, compare options with 要不 and confirm with 就这样',
  register:'Close friends on the phone; short turns, lots of spoken markers',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Friend A',hanzi:'喂，周末有空吗？一起出去玩啊。',pinyin:'Wèi, zhōumò yǒu kòng ma? Yìqǐ chūqù wán a.',english:'Hey, are you free this weekend? Let\'s hang out.'},
   {speaker:'Friend B',hanzi:'周六不行，我要加班。周日倒是可以。',pinyin:'Zhōuliù bù xíng, wǒ yào jiābān. Zhōurì dào shì kěyǐ.',english:'Saturday doesn\'t work — I\'m working overtime. Sunday is fine, though.'},
   {speaker:'Friend A',hanzi:'那周日。看电影怎么样？',pinyin:'Nà zhōurì. Kàn diànyǐng zěnmeyàng?',english:'Sunday then. How about a movie?'},
   {speaker:'Friend B',hanzi:'最近没什么好电影。要不去爬山？',pinyin:'Zuìjìn méi shénme hǎo diànyǐng. Yàobù qù páshān?',english:'There\'s nothing good on lately. How about hiking instead?'},
   {speaker:'Friend A',hanzi:'爬山可以，就是得早点起。你说几点？',pinyin:'Páshān kěyǐ, jiùshì děi zǎodiǎn qǐ. Nǐ shuō jǐ diǎn?',english:'Hiking works, it\'s just that we have to get up early. What time do you say?'},
   {speaker:'Friend B',hanzi:'八点在地铁站见？晚了人太多。',pinyin:'Bā diǎn zài dìtiě zhàn jiàn? Wǎn le rén tài duō.',english:'Meet at the subway station at eight? Too late and it gets crowded.'},
   {speaker:'Friend A',hanzi:'行，那就这样。我带点水果。',pinyin:'Xíng, nà jiù zhèyàng. Wǒ dài diǎn shuǐguǒ.',english:'Deal, it\'s settled then. I\'ll bring some fruit.'},
   {speaker:'Friend B',hanzi:'好，到时候联系。不见不散！',pinyin:'Hǎo, dàoshíhou liánxì. Bú jiàn bú sàn!',english:'Great, let\'s stay in touch then. Be there or be square!'}
  ],
  questions:[
   {id:'everyday-dialogue-08:q0',prompt:'Why does the plan move to Sunday?',answer:'Friend B must work overtime on Saturday.',options:['Friend B must work overtime on Saturday.','Friend A must work overtime on Saturday.','The movie theater is closed Saturday.','Sunday is warmer.'],evidenceIndex:1,explanation:'Speaker labels matter: Friend B says 我要加班 on Saturday, so Friend A\'s Saturday idea moves to Sunday.'},
   {id:'everyday-dialogue-08:q1',prompt:'What does 要不去爬山 do in the conversation?',answer:'It replaces a rejected idea with a new suggestion.',options:['It replaces a rejected idea with a new suggestion.','It refuses the hiking idea.','It asks who owns a mountain.','It confirms the movie time.'],evidenceIndex:3,explanation:'没什么好电影 closes the movie option; 要不 pivots to "how about hiking".'},
   {id:'everyday-dialogue-08:q2',prompt:'What does 不见不散 mean?',answer:'"We stay until we meet" — a firm promise to show up.',options:['"We stay until we meet" — a firm promise to show up.','"We will not eat before meeting."','"Do not bring extra people."','"The plan is cancelled."'],evidenceIndex:7,explanation:'A fixed parting phrase: neither side leaves without meeting — a warm, firm commitment.'}
  ]
 },
 {
  id:'everyday-dialogue-09',
  title:'Colleagues chatting about the morning commute',
  theme:'Small talk, shared complaints and agreement',
  goal:'Chat about daily annoyances, agree strongly and keep small talk going',
  register:'Casual workplace small talk; 可不是 and 就是 show strong agreement',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Colleague A',hanzi:'今天路上又堵车了，我差点迟到。',pinyin:'Jīntiān lùshang yòu dǔchē le, wǒ chàdiǎn chídào.',english:'Traffic jam again on the way — I almost was late.'},
   {speaker:'Colleague B',hanzi:'可不是嘛，我今天也堵了半个小时。',pinyin:'Kě bu shì ma, wǒ jīntiān yě dǔ le bàn ge xiǎoshí.',english:'Tell me about it — I was stuck for half an hour too.'},
   {speaker:'Colleague A',hanzi:'以后还是坐地铁吧，开车太累了。',pinyin:'Yǐhòu háishì zuò dìtiě ba, kāichē tài lèi le.',english:'Better take the subway from now on; driving is too tiring.'},
   {speaker:'Colleague B',hanzi:'就是。地铁上还能看看手机。',pinyin:'Jiùshì. Dìtiě shang hái néng kànkan shǒujī.',english:'Exactly. And on the subway you can still look at your phone.'},
   {speaker:'Colleague A',hanzi:'对了，昨天的会你听说了吗？',pinyin:'Duì le, zuótiān de huì nǐ tīng shuō le ma?',english:'By the way, did you hear about yesterday\'s meeting?'},
   {speaker:'Colleague B',hanzi:'听说了。反正新计划下个月才开始，不着急。',pinyin:'Tīng shuō le. Fǎnzhèng xīn jìhuà xià ge yuè cái kāishǐ, bù zháojí.',english:'I heard. Anyway the new plan only starts next month — no rush.'},
   {speaker:'Colleague A',hanzi:'那就好。慢慢来，别给自己太大压力。',pinyin:'Nà jiù hǎo. Mànmàn lái, bié gěi zìjǐ tài dà yālì.',english:'That\'s a relief. Take it slow — don\'t put too much pressure on yourself.'},
   {speaker:'Colleague B',hanzi:'嗯，先喝杯咖啡去。你要不要？',pinyin:'Ng, xiān hē bēi kāfēi qù. Nǐ yào bú yào?',english:'Yeah — going to grab a coffee first. Want one?'}
  ],
  questions:[
   {id:'everyday-dialogue-09:q0',prompt:'What does 可不是嘛 express?',answer:'Strong agreement: "exactly, tell me about it".',options:['Strong agreement: "exactly, tell me about it".','A question about the traffic.','Annoyance at the colleague.','A request for evidence.'],evidenceIndex:1,explanation:'可不是 is an emphatic "isn\'t that so" — here it fully agrees about the jam.'},
   {id:'everyday-dialogue-09:q1',prompt:'What does 反正 add to the plan talk?',answer:'It waves the worry away: the change is far off anyway.',options:['It waves the worry away: the change is far off anyway.','It complains about the new plan.','It promises the plan is finished.','It asks when the plan starts.'],evidenceIndex:5,explanation:'反正 "anyway" is followed by the reason not to worry: 下个月才开始.'},
   {id:'everyday-dialogue-09:q2',prompt:'What does 慢慢来 mean here?',answer:'Take it easy — don\'t rush things.',options:['Take it easy — don\'t rush things.','Walk slower to the café.','Come later tomorrow.','The coffee machine is slow.'],evidenceIndex:6,explanation:'慢慢来 literally "come slowly" is the standard phrase for "take it easy".'}
  ]
 },
 {
  id:'everyday-dialogue-10',
  title:'A food delivery at the door',
  theme:'Delivery details, small problems and thanks',
  goal:'Confirm a delivery, solve a missing item and give drop-off instructions',
  register:'Quick polite phone-and-door talk; 麻烦你 softens requests',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Courier',hanzi:'你好，外卖到了。你住几零几？',pinyin:'Nǐ hǎo, wàimài dào le. Nǐ zhù jǐ líng jǐ?',english:'Hi, your delivery has arrived. What\'s your apartment number?'},
   {speaker:'Customer',hanzi:'八零二。麻烦你放门口就行，我马上出来拿。',pinyin:'Bā líng èr. Máfan nǐ fàng ménkǒu jiù xíng, wǒ mǎshàng chūlai ná.',english:'802. Please just leave it at the door — I\'ll come get it right away.'},
   {speaker:'Courier',hanzi:'好的。袋子里有一份面和一杯饮料。',pinyin:'Hǎo de. Dàizi lǐ yǒu yí fèn miàn hé yì bēi yǐnliào.',english:'Okay. In the bag there\'s one noodles and one drink.'},
   {speaker:'Customer',hanzi:'等等，饮料是不是少了一杯？我点了两杯。',pinyin:'Děngdeng, yǐnliào shì bu shì shǎo le yì bēi? Wǒ diǎn le liǎng bēi.',english:'Wait — isn\'t one drink missing? I ordered two.'},
   {speaker:'Courier',hanzi:'我看一下单子……对不起，商家只给了一杯。',pinyin:'Wǒ kàn yíxià dānzi…… Duìbuqǐ, shāngjiā zhǐ gěi le yì bēi.',english:'Let me check the order… sorry, the shop only sent one.'},
   {speaker:'Customer',hanzi:'那怎么办？能补送吗？',pinyin:'Nà zěnme bàn? Néng bǔ sòng ma?',english:'What can we do then? Can it be redelivered?'},
   {speaker:'Courier',hanzi:'你联系商家退款，或者再下一单，我再给你送。',pinyin:'Nǐ liánxì shāngjiā tuìkuǎn, huòzhě zài xià yì dān, wǒ zài gěi nǐ sòng.',english:'Contact the shop for a refund, or place another order and I\'ll bring it to you.'},
   {speaker:'Customer',hanzi:'行，我先申请退款。麻烦你了，谢谢啊。',pinyin:'Xíng, wǒ xiān shēnqǐng tuìkuǎn. Máfan nǐ le, xièxie a.',english:'Okay, I\'ll request the refund first. Sorry for the trouble — thanks!'}
  ],
  questions:[
   {id:'everyday-dialogue-10:q0',prompt:'What does 几零几 ask for?',answer:'The apartment number, digit by digit.',options:['The apartment number, digit by digit.','The delivery time.','The price of the noodles.','The courier\'s phone number.'],evidenceIndex:0,explanation:'几零几 is how people ask for a unit like 802: "eight-oh-two" in spoken Chinese.'},
   {id:'everyday-dialogue-10:q1',prompt:'What problem does the customer notice?',answer:'One of the two ordered drinks is missing.',options:['One of the two ordered drinks is missing.','The noodles are cold.','The delivery is too late.','The bag is broken.'],evidenceIndex:3,explanation:'我点了两杯 contrasts with 只给了一杯 — one drink short.'},
   {id:'everyday-dialogue-10:q2',prompt:'What does 麻烦你了 express at the end?',answer:'Polite thanks with a touch of apology for the trouble.',options:['Polite thanks with a touch of apology for the trouble.','Anger at the courier.','A new order for delivery.','A request to speak to the manager.'],evidenceIndex:7,explanation:'麻烦你 is the standard softener when someone does you a favor — even after a mix-up, it keeps the tone warm.'}
  ]
 },
 {
  id:'everyday-dialogue-11',
  title:'Meeting a friend\'s friend over dinner',
  theme:'Introductions, shared contacts and making plans together',
  goal:'Introduce people, find shared connections and include someone new in plans',
  register:'Warm and casual; modest, friendly first-meeting talk',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Host',hanzi:'来，我介绍一下，这是我的同事小林。',pinyin:'Lái, wǒ jièshào yíxià, zhè shì wǒ de tóngshì Xiǎo Lín.',english:'Come, let me introduce you — this is my colleague Xiao Lin.'},
   {speaker:'New friend',hanzi:'你好你好！常听她提起你。',pinyin:'Nǐ hǎo nǐ hǎo! Cháng tīng tā tíqǐ nǐ.',english:'Hi, hi! I often hear her mention you.'},
   {speaker:'Old friend',hanzi:'哈哈，是吗？她也说过你特别会做饭。',pinyin:'Hāhā, shì ma? Tā yě shuō guo nǐ tèbié huì zuò fàn.',english:'Ha ha, really? She also said you\'re a great cook.'},
   {speaker:'New friend',hanzi:'哪里哪里，就是喜欢做。你们先坐，菜马上就来。',pinyin:'Nǎlǐ nǎlǐ, jiùshì xǐhuan zuò. Nǐmen xiān zuò, cài mǎshàng jiù lái.',english:'Oh, not at all — I just enjoy cooking. Have a seat, the food is coming right up.'},
   {speaker:'Host',hanzi:'对了，你们俩是不是都喜欢爬山？',pinyin:'Duì le, nǐmen liǎ shì bu shì dōu xǐhuan páshān?',english:'By the way — do you both like hiking?'},
   {speaker:'Old friend',hanzi:'对啊，我每个月都去一次。小林也去吗？',pinyin:'Duì a, wǒ měi ge yuè dōu qù yí cì. Xiǎo Lín yě qù ma?',english:'Yeah, I go once a month. Does Xiao Lin go too?'},
   {speaker:'New friend',hanzi:'去！下次一起去吧，我认识一条特别好的路线。',pinyin:'Qù! Xià cì yìqǐ qù ba, wǒ rènshi yì tiáo tèbié hǎo de lùxiàn.',english:'I do! Let\'s go together next time — I know a really good route.'},
   {speaker:'Host',hanzi:'太好了，那就这么说定了。来，先吃饭！',pinyin:'Tài hǎo le, nà jiù zhème shuō dìng le. Lái, xiān chī fàn!',english:'Wonderful — then it\'s settled. Come, let\'s eat first!'}
  ],
  questions:[
   {id:'everyday-dialogue-11:q0',prompt:'How does the new friend respond to the cooking compliment?',answer:'Modestly: 哪里哪里 "not at all".',options:['Modestly: 哪里哪里 "not at all".','Proudly listing dishes.','Asking who said it.','Changing the topic.'],evidenceIndex:3,explanation:'哪里哪里 is the classic modest deflection of praise — literally "where, where".'},
   {id:'everyday-dialogue-11:q1',prompt:'What shared interest does the host point out?',answer:'Hiking.',options:['Hiking.','Cooking.','Music.','Painting.'],evidenceIndex:4,explanation:'你们俩是不是都喜欢爬山 connects the two guests through hiking.'},
   {id:'everyday-dialogue-11:q2',prompt:'What does 说定了 mean?',answer:'"It\'s settled" — the plan is agreed.',options:['"It\'s settled" — the plan is agreed.','"Speak louder."','"Tell the truth."','"Someone decided alone."'],evidenceIndex:7,explanation:'说 + 定 marks reaching a firm decision; 就这么 "just like that" seals it.'}
  ]
 },
 {
  id:'everyday-dialogue-12',
  title:'Asking about gym membership',
  theme:'Options, prices and taking time to decide',
  goal:'Compare offers, ask about conditions and defer a decision politely',
  register:'Sales talk vs. polite hesitation; 考虑一下 buys time',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Staff',hanzi:'你好，想了解健身卡吗？现在办卡有优惠。',pinyin:'Nǐ hǎo, xiǎng liǎojiě jiànshēnkǎ ma? Xiànzài bàn kǎ yǒu yōuhuì.',english:'Hi, interested in a gym card? There\'s a discount if you sign up now.'},
   {speaker:'Customer',hanzi:'有什么卡？我先看看。',pinyin:'Yǒu shénme kǎ? Wǒ xiān kànkan.',english:'What kinds of cards are there? Let me take a look first.'},
   {speaker:'Staff',hanzi:'月卡三百，年卡两千八。年卡算下来一个月才两百多。',pinyin:'Yuè kǎ sānbǎi, nián kǎ liǎngqiānbā. Nián kǎ suàn xiàlai yí ge yuè cái liǎngbǎi duō.',english:'Monthly card three hundred, yearly twenty-eight hundred. The yearly works out to only a bit over two hundred a month.'},
   {speaker:'Customer',hanzi:'年卡有点贵。可以先办次卡吗？',pinyin:'Nián kǎ yǒudiǎn guì. Kěyǐ xiān bàn cì kǎ ma?',english:'The yearly is a bit pricey. Can I get a visit card first?'},
   {speaker:'Staff',hanzi:'次卡也有，十次两百五，三个月内有效。',pinyin:'Cì kǎ yě yǒu, shí cì liǎngbǎiwǔ, sān ge yuè nèi yǒuxiào.',english:'We have visit cards too — ten visits for two fifty, valid within three months.'},
   {speaker:'Customer',hanzi:'这个可以。不过我今天没带钱，考虑一下。',pinyin:'Zhège kěyǐ. Búguò wǒ jīntiān méi dài qián, kǎolǜ yíxià.',english:'That works. But I didn\'t bring money today — let me think it over.'},
   {speaker:'Staff',hanzi:'没问题，这是我的名片。想好了随时联系我。',pinyin:'Méi wèntí, zhè shì wǒ de míngpiàn. Xiǎng hǎo le suíshí liánxì wǒ.',english:'No problem — here\'s my card. Whenever you decide, just contact me.'},
   {speaker:'Customer',hanzi:'好的，谢谢你介绍得这么详细。',pinyin:'Hǎo de, xièxie nǐ jièshào de zhème xiángxì.',english:'Okay, thanks for explaining everything in such detail.'}
  ],
  questions:[
   {id:'everyday-dialogue-12:q0',prompt:'How does the staff make the yearly card sound cheaper?',answer:'Breaking it down to a monthly amount.',options:['Breaking it down to a monthly amount.','Offering a free month.','Comparing it to the visit card.','Quoting a sale ending today.'],evidenceIndex:2,explanation:'算下来 "working it out" spreads 2800 over twelve months to reframe the price.'},
   {id:'everyday-dialogue-12:q1',prompt:'What does 考虑一下 do in the conversation?',answer:'Politely defers the purchase without refusing.',options:['Politely defers the purchase without refusing.','Agrees to buy the yearly card.','Asks for a bigger discount.','Complains about the price.'],evidenceIndex:5,explanation:'考虑一下 "let me think it over" is the standard soft way to leave a sales conversation.'},
   {id:'everyday-dialogue-12:q2',prompt:'What is true about the visit card?',answer:'Ten visits, valid for three months.',options:['Ten visits, valid for three months.','Ten visits, valid for one year.','Unlimited visits for a month.','Free for new members.'],evidenceIndex:4,explanation:'十次两百五，三个月内有效 gives both the count and the validity window.'}
  ]
 }
];
export const EVERYDAY_DIALOGUE_ROWS_B=EVERYDAY_DIALOGUES_B.map(d=>[
 d.title,
 d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 d.questions.map(q=>[q.prompt,...q.options])
]);
