/** Everyday Mandarin Series: original colloquial daily-life conversations.
 * Natural spoken Mandarin with discourse markers (就是, 那个, 要不, 对了,
 * 反正, 可不是) taught in context; questions test comprehension and pragmatics.
 * Editorial samples only; no official HSK membership or audio qualification.
 * Pinyin avoids erhua suffixes so dialogue-mission typing checks stay parseable.
 */
export const EVERYDAY_DIALOGUES=[
 {
  id:'everyday-dialogue-01',
  title:'Ordering lunch at a noodle shop',
  theme:'Ordering food, spice level and packing leftovers',
  goal:'Order a meal, adjust it with 不要 and 打包, and follow the server\'s questions',
  register:'Casual counter service; the server uses 想吃点儿什么-style prompts',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Server',hanzi:'你好，想吃点什么？',pinyin:'Nǐ hǎo, xiǎng chī diǎn shénme?',english:'Hi, what would you like to eat?'},
   {speaker:'Customer',hanzi:'我要一碗牛肉面。对了，不要辣。',pinyin:'Wǒ yào yì wǎn niúròu miàn. Duì le, bú yào là.',english:'I\'ll have a bowl of beef noodles. By the way, no spice.'},
   {speaker:'Server',hanzi:'好的。要不要加个鸡蛋？',pinyin:'Hǎo de. Yào bú yào jiā ge jīdàn?',english:'Sure. Would you like to add an egg?'},
   {speaker:'Customer',hanzi:'行啊，加一个。多少钱？',pinyin:'Xíng a, jiā yí ge. Duōshao qián?',english:'Sure, add one. How much is it?'},
   {speaker:'Server',hanzi:'牛肉面二十块，鸡蛋三块，一共二十三。',pinyin:'Niúròu miàn èrshí kuài, jīdàn sān kuài, yígòng èrshísān.',english:'Beef noodles are twenty yuan, the egg three; twenty-three altogether.'},
   {speaker:'Customer',hanzi:'好的。我吃不完的话，可以打包吗？',pinyin:'Hǎo de. Wǒ chī bu wán de huà, kěyǐ dǎbāo ma?',english:'Okay. If I can\'t finish, can I pack it to go?'},
   {speaker:'Server',hanzi:'当然可以。面好了我叫你。',pinyin:'Dāngrán kěyǐ. Miàn hǎo le wǒ jiào nǐ.',english:'Of course. I\'ll call you when the noodles are ready.'},
   {speaker:'Customer',hanzi:'谢谢！我就坐这儿等。',pinyin:'Xièxie! Wǒ jiù zuò zhèr děng.',english:'Thanks! I\'ll just sit here and wait.'}
  ],
  questions:[
   {id:'everyday-dialogue-01:q0',prompt:'What does the customer change about the order?',answer:'The noodles must not be spicy.',options:['The noodles must not be spicy.','The noodles must not have beef.','The egg is cancelled.','The order is for takeout only.'],evidenceIndex:1,explanation:'对了 adds a late correction: 不要辣 "no spice" is added after ordering the noodles.'},
   {id:'everyday-dialogue-01:q1',prompt:'What does 加一个 refer to?',answer:'Adding one egg to the order.',options:['Adding one egg to the order.','Adding one bowl of noodles.','Adding one more customer.','Adding thirty yuan.'],evidenceIndex:3,explanation:'The server offered 加个鸡蛋, so 行啊，加一个 picks up "one egg" from that offer.'},
   {id:'everyday-dialogue-01:q2',prompt:'Why does the customer ask about 打包?',answer:'To pack any leftovers to go.',options:['To pack any leftovers to go.','To pay in advance.','To eat the noodles outside later immediately.','To order noodles for a friend.'],evidenceIndex:5,explanation:'吃不完的话，可以打包吗 asks, in advance, whether unfinished food can be packed to go.'}
  ]
 },
 {
  id:'everyday-dialogue-02',
  title:'At a coffee shop',
  theme:'Ordering drinks, sweetness and staying in',
  goal:'Order a drink with custom options and answer the barista\'s quick either-or questions',
  register:'Casual service; the barista asks short A-not-A questions',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Barista',hanzi:'你好，请问要点什么？',pinyin:'Nǐ hǎo, qǐngwèn yào diǎn shénme?',english:'Hi, what can I get you?'},
   {speaker:'Customer',hanzi:'一杯热拿铁，少糖。',pinyin:'Yì bēi rè nátiě, shǎo táng.',english:'One hot latte, less sugar.'},
   {speaker:'Barista',hanzi:'大杯还是小杯？',pinyin:'Dà bēi háishì xiǎo bēi?',english:'Large or small?'},
   {speaker:'Customer',hanzi:'大杯吧。在这儿喝，不用打包。',pinyin:'Dà bēi ba. Zài zhèr hē, bú yòng dǎbāo.',english:'Large, I think. I\'m drinking in, no need to pack it.'},
   {speaker:'Barista',hanzi:'好的，一共三十二。扫这里就可以。',pinyin:'Hǎo de, yígòng sānshí\'èr. Sǎo zhèlǐ jiù kěyǐ.',english:'Okay, thirty-two altogether. You can scan here.'},
   {speaker:'Customer',hanzi:'付好了。对了，你们今天有优惠吗？',pinyin:'Fù hǎo le. Duì le, nǐmen jīntiān yǒu yōuhuì ma?',english:'Paid. By the way, do you have any promotions today?'},
   {speaker:'Barista',hanzi:'有，第二杯半价。要不要再来一杯？',pinyin:'Yǒu, dì èr bēi bàn jià. Yào bú yào zài lái yì bēi?',english:'Yes — the second cup is half price. Would you like another one?'},
   {speaker:'Customer',hanzi:'算了算了，一杯就够了。谢谢！',pinyin:'Suàn le suàn le, yì bēi jiù gòu le. Xièxie!',english:'Never mind — one cup is enough. Thanks!'}
  ],
  questions:[
   {id:'everyday-dialogue-02:q0',prompt:'How does the customer customize the drink?',answer:'Less sugar.',options:['Less sugar.','No ice.','No milk.','Extra coffee.'],evidenceIndex:1,explanation:'少糖 means "less sugar" — the only change asked for.'},
   {id:'everyday-dialogue-02:q1',prompt:'What does 大杯吧 express?',answer:'A mild decision: "large, I think".',options:['A mild decision: "large, I think".','A complaint about prices.','A question about cup sizes.','An order for two cups.'],evidenceIndex:3,explanation:'吧 softens the choice: the speaker leans toward 大杯 but keeps the tone light.'},
   {id:'everyday-dialogue-02:q2',prompt:'What does 算了算了 express?',answer:'Dropping the idea: one cup is enough.',options:['Dropping the idea: one cup is enough.','Ordering two more cups.','Paying with exact change.','Thanking the barista twice.'],evidenceIndex:7,explanation:'算了 "forget it" drops the offer of a second cup; repeating it makes the refusal warm rather than blunt.'}
  ]
 },
 {
  id:'everyday-dialogue-03',
  title:'Asking the way to a museum',
  theme:'Directions on foot, distance and landmarks',
  goal:'Ask for walking directions and confirm distance using landmarks',
  register:'Neutral-polite between strangers; short spoken sentences',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Visitor',hanzi:'你好，麻烦问一下，博物馆怎么走？',pinyin:'Nǐ hǎo, máfan wèn yíxià, bówùguǎn zěnme zǒu?',english:'Hi, sorry to bother you — how do I get to the museum?'},
   {speaker:'Local',hanzi:'不远。从这里直走，到前面的路口往左拐。',pinyin:'Bù yuǎn. Cóng zhèlǐ zhí zǒu, dào qiánmiàn de lùkǒu wǎng zuǒ guǎi.',english:'It\'s not far. Go straight from here, and turn left at the intersection ahead.'},
   {speaker:'Visitor',hanzi:'走路大概要多久？',pinyin:'Zǒulù dàgài yào duō jiǔ?',english:'About how long does it take on foot?'},
   {speaker:'Local',hanzi:'十分钟左右吧。就在书店旁边。',pinyin:'Shí fēnzhōng zuǒyòu ba. Jiù zài shūdiàn pángbiān.',english:'Around ten minutes. It\'s right next to the bookstore.'},
   {speaker:'Visitor',hanzi:'好的。那边好停车吗？我朋友开车来。',pinyin:'Hǎo de. Nàbiān hǎo tíngchē ma? Wǒ péngyou kāichē lái.',english:'Okay. Is parking easy over there? My friend is driving here.'},
   {speaker:'Local',hanzi:'不太方便，周末车多。要不你们停在商场？',pinyin:'Bú tài fāngbiàn, zhōumò chē duō. Yàobù nǐmen tíng zài shāngchǎng?',english:'Not really — there are many cars on weekends. How about you park at the mall?'},
   {speaker:'Visitor',hanzi:'好主意。反正商场离博物馆也不远。',pinyin:'Hǎo zhǔyi. Fǎnzhèng shāngchǎng lí bówùguǎn yě bù yuǎn.',english:'Good idea. Anyway, the mall isn\'t far from the museum either.'},
   {speaker:'Local',hanzi:'对，走过去五分钟。祝你玩得开心！',pinyin:'Duì, zǒu guòqù wǔ fēnzhōng. Zhù nǐ wán de kāixīn!',english:'Right — five minutes on foot. Have a good time!'}
  ],
  questions:[
   {id:'everyday-dialogue-03:q0',prompt:'What are the walking directions?',answer:'Straight, then left at the intersection.',options:['Straight, then left at the intersection.','Left first, then straight.','Straight, then right at the bookstore.','Turn around and walk back.'],evidenceIndex:1,explanation:'直走 to the 路口, then 往左拐 — straight, then left at the intersection.'},
   {id:'everyday-dialogue-03:q1',prompt:'Why does the local suggest parking at the mall?',answer:'Parking near the museum is hard on weekends.',options:['Parking near the museum is hard on weekends.','The museum has no road access.','The mall sells museum tickets.','The friend works at the mall.'],evidenceIndex:5,explanation:'不太方便，周末车多 explains the problem, and 要不 introduces the mall as an alternative.'},
   {id:'everyday-dialogue-03:q2',prompt:'What does 反正 add to the visitor\'s reply?',answer:'It shrugs off the trade-off: the mall is close anyway.',options:['It shrugs off the trade-off: the mall is close anyway.','It complains about the distance.','It asks for a better route.','It marks surprise.'],evidenceIndex:6,explanation:'反正 "anyway" waves away the worry: even parked at the mall, the museum is still close.'}
  ]
 },
 {
  id:'everyday-dialogue-04',
  title:'Taking a taxi in a hurry',
  theme:'Destinations, traffic and dropping off',
  goal:'Tell a driver where to go, explain time pressure and choose a drop-off point',
  register:'Casual practical talk; both sides use clipped spoken sentences',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Driver',hanzi:'你好，去哪儿？',pinyin:'Nǐ hǎo, qù nǎr?',english:'Hi, where to?'},
   {speaker:'Passenger',hanzi:'去火车站。麻烦快一点，我赶时间。',pinyin:'Qù huǒchēzhàn. Máfan kuài yìdiǎn, wǒ gǎn shíjiān.',english:'To the train station. Please hurry a little — I\'m short on time.'},
   {speaker:'Driver',hanzi:'现在有点堵，走高架快一些。',pinyin:'Xiànzài yǒudiǎn dǔ, zǒu gāojià kuài yìxiē.',english:'It\'s a bit jammed now; the elevated road is faster.'},
   {speaker:'Passenger',hanzi:'行，您看着走。大概要多久？',pinyin:'Xíng, nín kànzhe zǒu. Dàgài yào duō jiǔ?',english:'Fine, take whatever route you think is best. About how long?'},
   {speaker:'Driver',hanzi:'不堵的话二十分钟。你几点的车？',pinyin:'Bù dǔ de huà èrshí fēnzhōng. Nǐ jǐ diǎn de chē?',english:'Twenty minutes without traffic. What time is your train?'},
   {speaker:'Passenger',hanzi:'三点半。来得及吗？',pinyin:'Sān diǎn bàn. Láidejí ma?',english:'Three thirty. Will I make it?'},
   {speaker:'Driver',hanzi:'来得及。到了我提醒你。',pinyin:'Láidejí. Dào le wǒ tíxǐng nǐ.',english:'You\'ll make it. I\'ll remind you when we arrive.'},
   {speaker:'Passenger',hanzi:'太好了，谢谢！就在门口停一下就行。',pinyin:'Tài hǎo le, xièxie! Jiù zài ménkǒu tíng yíxià jiù xíng.',english:'Great, thanks! Just stop at the entrance for a moment — that\'s all.'}
  ],
  questions:[
   {id:'everyday-dialogue-04:q0',prompt:'Why does the driver choose the elevated road?',answer:'The usual road is jammed, and the elevated road is faster.',options:['The usual road is jammed, and the elevated road is faster.','The train station is on the elevated road.','The passenger asked for a scenic route.','The street is closed for construction.'],evidenceIndex:2,explanation:'现在有点堵 gives the reason; 走高架快一些 is the driver\'s solution.'},
   {id:'everyday-dialogue-04:q1',prompt:'What does 您看着走 mean here?',answer:'Take whatever route you judge best.',options:['Take whatever route you judge best.','Please drive more slowly.','Stop the car right here.','Explain the route first.'],evidenceIndex:3,explanation:'看着 + verb means "decide as you see fit" — the passenger hands the route choice to the driver.'},
   {id:'everyday-dialogue-04:q2',prompt:'What does the passenger want at the destination?',answer:'A quick stop right at the entrance.',options:['A quick stop right at the entrance.','To be dropped off far from the station.','To pay by card only.','To change the destination.'],evidenceIndex:7,explanation:'就在门口停一下就行 — a brief stop at the door is enough; 就行 marks "that\'s all it takes".'}
  ]
 },
 {
  id:'everyday-dialogue-05',
  title:'Bargaining at a fruit market',
  theme:'Prices, quantities and friendly bargaining',
  goal:'Ask prices, propose a discount and agree on a quantity',
  register:'Warm market haggling; both sides use short exclamations',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Shopper',hanzi:'老板，这苹果怎么卖？',pinyin:'Lǎobǎn, zhè píngguǒ zěnme mài?',english:'Boss, how do you sell these apples?'},
   {speaker:'Vendor',hanzi:'五块一斤。又甜又脆，尝一个！',pinyin:'Wǔ kuài yì jīn. Yòu tián yòu cuì, cháng yí ge!',english:'Five yuan a jin. Sweet and crisp — try one!'},
   {speaker:'Shopper',hanzi:'有点贵了。便宜一点吧，我多买点。',pinyin:'Yǒudiǎn guì le. Piányi yìdiǎn ba, wǒ duō mǎi diǎn.',english:'A bit expensive. Make it cheaper and I\'ll buy more.'},
   {speaker:'Vendor',hanzi:'那四块五，不能再少了。',pinyin:'Nà sì kuài wǔ, bù néng zài shǎo le.',english:'Then four-fifty — I can\'t go lower.'},
   {speaker:'Shopper',hanzi:'行，给我来三斤。对了，橘子甜不甜？',pinyin:'Xíng, gěi wǒ lái sān jīn. Duì le, júzi tián bu tián?',english:'Deal, give me three jin. By the way, are the oranges sweet?'},
   {speaker:'Vendor',hanzi:'甜！要不你先买一斤试试？',pinyin:'Tián! Yàobù nǐ xiān mǎi yì jīn shìshi?',english:'Sweet! How about you buy one jin first and try them?'},
   {speaker:'Shopper',hanzi:'好，那就一起。一共多少钱？',pinyin:'Hǎo, nà jiù yìqǐ. Yígòng duōshao qián?',english:'Okay, together then. How much altogether?'},
   {speaker:'Vendor',hanzi:'苹果十三块五，橘子五块，一共十八块五。',pinyin:'Píngguǒ shísān kuài wǔ, júzi wǔ kuài, yígòng shíbā kuài wǔ.',english:'Apples thirteen-fifty, oranges five; eighteen-fifty altogether.'}
  ],
  questions:[
   {id:'everyday-dialogue-05:q0',prompt:'How does the shopper get a lower price?',answer:'Promising to buy more.',options:['Promising to buy more.','Claiming the fruit is bad.','Asking for the boss.','Paying in cash.'],evidenceIndex:2,explanation:'便宜一点吧，我多买点 trades a larger purchase for a small discount.'},
   {id:'everyday-dialogue-05:q1',prompt:'What does 不能再少了 mean?',answer:'The price cannot go any lower.',options:['The price cannot go any lower.','The fruit is running out.','The scale is broken.','Nothing else is sweet.'],evidenceIndex:3,explanation:'再 here means "any further" — the vendor draws the bargaining line at four-fifty.'},
   {id:'everyday-dialogue-05:q2',prompt:'What does 要不 do in the vendor\'s reply?',answer:'It offers a low-risk suggestion: try one jin first.',options:['It offers a low-risk suggestion: try one jin first.','It refuses to sell oranges.','It asks the shopper to leave.','It warns that oranges are sour.'],evidenceIndex:5,explanation:'要不 introduces "how about…" — here a gentle suggestion to test the oranges with a small amount.'}
  ]
 },
 {
  id:'everyday-dialogue-06',
  title:'Returning a sweater at a store',
  theme:'Returns, receipts and exchanging sizes',
  goal:'Explain a problem with a purchase and negotiate a size exchange',
  register:'Polite customer service; staff uses 请 and softened refusals',
  approval:'DEMO_ONLY',editorialStatus:'unreviewed',officialHskLevel:null,
  turns:[
   {speaker:'Customer',hanzi:'你好，我想退这件毛衣。',pinyin:'Nǐ hǎo, wǒ xiǎng tuì zhè jiàn máoyī.',english:'Hi, I\'d like to return this sweater.'},
   {speaker:'Staff',hanzi:'请问有什么问题吗？',pinyin:'Qǐngwèn yǒu shénme wèntí ma?',english:'May I ask what the problem is?'},
   {speaker:'Customer',hanzi:'有点小，穿着不太舒服。小票在这里。',pinyin:'Yǒudiǎn xiǎo, chuān zhe bú tài shūfu. Xiǎopiào zài zhèlǐ.',english:'It\'s a bit small and uncomfortable to wear. Here\'s the receipt.'},
   {speaker:'Staff',hanzi:'好的。要换大一号吗？还是直接退？',pinyin:'Hǎo de. Yào huàn dà yí hào ma? Háishì zhíjiē tuì?',english:'Okay. Would you like to exchange it for one size up, or return it outright?'},
   {speaker:'Customer',hanzi:'先试试大号的吧。有别的颜色吗？',pinyin:'Xiān shìshi dà hào de ba. Yǒu bié de yánsè ma?',english:'Let me try the larger size first. Are there other colors?'},
   {speaker:'Staff',hanzi:'有灰色和黑色。我去拿一件，稍等。',pinyin:'Yǒu huīsè hé hēisè. Wǒ qù ná yí jiàn, shāo děng.',english:'We have grey and black. I\'ll go get one — just a moment.'},
   {speaker:'Customer',hanzi:'谢谢。要是还不合适，我就退了。',pinyin:'Xièxie. Yàoshi hái bú héshì, wǒ jiù tuì le.',english:'Thanks. If it still doesn\'t fit, I\'ll just return it.'},
   {speaker:'Staff',hanzi:'没问题，七天以内都可以退。',pinyin:'Méi wèntí, qī tiān yǐnèi dōu kěyǐ tuì.',english:'No problem — returns are fine within seven days.'}
  ],
  questions:[
   {id:'everyday-dialogue-06:q0',prompt:'Why is the customer returning the sweater?',answer:'It is too small and uncomfortable.',options:['It is too small and uncomfortable.','It has no receipt.','It is the wrong color.','It was a gift.'],evidenceIndex:2,explanation:'有点小，穿着不太舒服 states the fit problem directly.'},
   {id:'everyday-dialogue-06:q1',prompt:'What does 大一号 mean?',answer:'One size larger.',options:['One size larger.','One number cheaper.','One more sweater.','A different brand.'],evidenceIndex:3,explanation:'号 is clothing size; 大一号 is exactly one size up.'},
   {id:'everyday-dialogue-06:q2',prompt:'What is the store\'s return window?',answer:'Within seven days.',options:['Within seven days.','Within one day.','Within one month.','Returns are never allowed.'],evidenceIndex:7,explanation:'七天以内都可以退 — the staff confirms the seven-day window after seeing the receipt.'}
  ]
 }
];
export const EVERYDAY_DIALOGUE_ROWS=EVERYDAY_DIALOGUES.map(d=>[
 d.title,
 d.turns.map(t=>[t.speaker,t.hanzi,t.pinyin,t.english]),
 d.questions.map(q=>[q.prompt,...q.options])
]);
