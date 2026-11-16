/** Everyday Mandarin Readings: twelve original six-sentence narratives in
 * fresh daily-life settings, reinforcing the Everyday Mandarin vocabulary and
 * colloquial grammar. Graded instructional material only; not official HSK.
 * Row shape matches the P28 beginner reading adapter (12 fields): title,
 * theme, purpose, level, lines[6 × hanzi,pinyin,english], questions[3 ×
 * prompt,answer,w1,w2,w3,evidenceLine,explanation], order chunks (joining to
 * exactly one line), cloze[line,answer,d1,d2,d3], writing[prompt,hanzi,pinyin,
 * english,explanation], grammarIds, focusWord, bridge.
 */
export const EVERYDAY_READINGS=[
 [
  'The last bowl before closing','A neighborhood noodle shop and its regulars',
  'Follow a short story about daily work and quiet kindness',2,
  [
   ['晚上十点，街上的店差不多都关了，只有这家面馆还亮着灯。','Wǎnshang shí diǎn, jiē shang de diàn chàbuduō dōu guān le, zhǐyǒu zhè jiā miànguǎn hái liàngzhe dēng.','At ten in the evening the shops on the street are almost all closed; only this noodle shop still has its lights on.'],
   ['老板正在打扫，看见一个年轻人站在门口，看起来很累。','Lǎobǎn zhèngzài dǎsǎo, kànjiàn yí ge niánqīng rén zhàn zài ménkǒu, kàn qǐlai hěn lèi.','The owner was cleaning up when he saw a young man at the door, looking exhausted.'],
   ['年轻人问还有面吗，他说自己刚下班，别的店都关了。','Niánqīng rén wèn hái yǒu miàn ma, tā shuō zìjǐ gāng xiàbān, bié de diàn dōu guān le.','The young man asked whether there were still noodles; he said he had just finished work and every other shop was closed.'],
   ['老板笑了笑，说最后一碗算我请你的，不要钱。','Lǎobǎn xiàole xiào, shuō zuìhòu yì wǎn suàn wǒ qǐng nǐ de, bú yào qián.','The owner smiled and said the last bowl was his treat — no charge.'],
   ['年轻人要给钱，老板摆摆手说下次吧，谁都有累的时候。','Niánqīng rén yào gěi qián, lǎobǎn bǎibai shǒu shuō xià cì ba, shéi dōu yǒu lèi de shíhou.','The young man tried to pay, but the owner waved him off: next time — everyone has tired days.'],
   ['后来那个年轻人常来吃面，每次都会多带一个朋友来。','Hòulái nàge niánqīng rén cháng lái chī miàn, měi cì dōu huì duō dài yí ge péngyou lái.','After that the young man came for noodles often, each time bringing one more friend.']
  ],
  [
   ['Why does the owner refuse the money?','The last bowl is a kindness to a tired worker.','The shop is about to close.','The noodles were not fresh.','He has no change for payment.',3,'算我请你的 frames the bowl as a treat, and 谁都有累的时候 gives the reason.'],
   ['Why is the young man at the door so late?','He just finished work and every other shop is closed.','He is looking for the owner.','He works at the noodle shop.','He lost his wallet on the train.',2,'刚下班 and 别的店都关了 explain why he arrives at closing time.'],
   ['What happens after that night?','He returns often and brings one more friend each time.','He never comes back.','He opens his own noodle shop.','He mails the money to the owner.',5,'后来…常来吃面, 每次都会多带一个朋友来 traces the habit that follows.']
  ],
  ['后来','那个年轻人','常来','吃面','，','每次','都会','多带','一个朋友','来','。'],
  [3,'请','买','卖','拿'],
  ['Say that the last bowl is your treat.','最后一碗算我请你的。','Zuìhòu yì wǎn suàn wǒ qǐng nǐ de.','The last bowl is my treat.','算…的 frames the whole act as "count it as" a treat.'],
  ['g168','g186','g189'],['请','qǐng','to treat (someone); to invite'],
  'From one late bowl to a habit of coming back.'
 ],
 [
  'First week in a new city','Moving, commuting and finding your feet',
  'Read about settling into a new job and a new neighborhood',2,
  [
   ['小林上个月搬到这个城市，公司离家有点远，每天要坐四十分钟地铁。','Xiǎo Lín shàng ge yuè bān dào zhège chéngshì, gōngsī lí jiā yǒudiǎn yuǎn, měitiān yào zuò sìshí fēnzhōng dìtiě.','Xiao Lin moved to this city last month; the office is a bit far from home, so every day is forty minutes on the subway.'],
   ['第一天上班他就迟到了，因为地铁堵在路上，他急得不行。','Dì yì tiān shàngbān tā jiù chídào le, yīnwèi dìtiě dǔ zài lùshang, tā jí de bùxíng.','On his very first day he was late — the train was stuck, and he was beside himself with worry.'],
   ['同事笑着说没关系，反正大家都堵过，习惯就好了。','Tóngshì xiàozhe shuō méi guānxi, fǎnzhèng dàjiā dōu dǔ guo, xíguàn jiù hǎo le.','A colleague laughed and said it was fine — everybody has been stuck in traffic; you get used to it.'],
   ['中午同事带他去附近的小店吃饭，那里的面条又便宜又好吃。','Zhōngwǔ tóngshì dài tā qù fùjìn de xiǎo diàn chī fàn, nàlǐ de miàntiáo yòu piányi yòu hǎochī.','At noon a colleague took him to a small nearby shop where the noodles were both cheap and delicious.'],
   ['现在小林每天早出门半个小时，还带一本书在路上看。','Xiànzài Xiǎo Lín měitiān zǎo chūmén bàn ge xiǎoshí, hái dài yì běn shū zài lùshang kàn.','Now Xiao Lin leaves half an hour earlier every day and brings a book to read on the way.'],
   ['他说新城市挺好的，就是得给自己一点时间适应。','Tā shuō xīn chéngshì tǐng hǎo de, jiùshì děi gěi zìjǐ yìdiǎn shíjiān shìyìng.','He says the new city is pretty good — you just have to give yourself some time to adjust.']
  ],
  [
   ['Why was Xiao Lin late on his first day?','The subway train was stuck.','He forgot the office address.','His book was too interesting.','The colleague gave wrong directions.',1,'因为地铁堵在路上 states the cause; 急得不行 shows how worried he was.'],
   ['Why does the colleague say 习惯就好了?','Being stuck in traffic happens to everyone here.','The subway is always broken.','Xiao Lin lives too far away.','The office keeps moving.',2,'大家都堵过 normalizes the experience, so the advice is simply to get used to it.'],
   ['What does Xiao Lin change afterward?','He leaves half an hour earlier and reads on the way.','He quits the new job.','He moves next to the office.','He stops taking the subway.',4,'现在…早出门半个小时, 还带一本书 shows the new routine.']
  ],
  ['现在','小林','每天','早出门','半个小时','，','还','带一本书','在路上看','。'],
  [1,'迟到','早退','堵车','搬家'],
  ['Say that you will get used to something.','习惯就好了。','Xíguàn jiù hǎo le.','You will get used to it.','了 marks the new situation once the habit forms.'],
  ['g178','g184','g188'],['适应','shìyìng','to adjust; to get used to'],
  'From a hard first day to a workable routine.'
 ],
 [
  'The broken air conditioner','Roommates, summer heat and shared problems',
  'Follow two roommates solving a household problem together',2,
  [
   ['七月的晚上特别热，小赵和小王房间的空调突然坏了。','Qī yuè de wǎnshang tèbié rè, Xiǎo Zhào hé Xiǎo Wáng fángjiān de kōngtiáo tūrán huài le.','One July evening it was especially hot, and the air conditioner in Xiao Zhao and Xiao Wang\'s room suddenly broke.'],
   ['两个人热得睡不着，一个说要不找人来修，一个说先看看再说。','Liǎng ge rén rè de shuì bu zháo, yí ge shuō yàobù zhǎo rén lái xiū, yí ge shuō xiān kànkan zài shuō.','Neither could sleep in the heat; one said how about calling a repairman, the other said let\'s look at it first.'],
   ['他们上网查了查，发现只是滤网太脏，自己就能清洗。','Tāmen shàng wǎng chá le chá, fāxiàn zhǐshì lǜwǎng tài zàng, zìjǐ jiù néng qīngxǐ.','They looked it up online and found the filter was simply dirty — they could clean it themselves.'],
   ['洗完以后空调又有风了，房间慢慢凉下来。','Xǐ wán yǐhòu kōngtiáo yòu yǒu fēng le, fángjiān mànmàn liáng xiàlai.','After washing it, the air conditioner blew again and the room slowly cooled down.'],
   ['两个人坐在地上吃西瓜，觉得省下的钱可以买点好吃的。','Liǎng ge rén zuò zài dìshang chī xīguā, juéde shěng xià de qián kěyǐ mǎi diǎn hǎochī de.','The two sat on the floor eating watermelon, deciding the money saved could buy something tasty.'],
   ['小王说以后东西坏了别着急，先查查，说不定自己就能修好。','Xiǎo Wáng shuō yǐhòu dōngxi huài le bié zháojí, xiān chácha, shuōbudìng zìjǐ jiù néng xiū hǎo.','Xiao Wang said that from now on, when something breaks, don\'t panic — check first; you might fix it yourself.']
  ],
  [
   ['Why can\'t the roommates sleep?','The air conditioner broke on a very hot night.','They drank too much coffee.','Their neighbors are noisy.','They worked through the night.',0,'七月的晚上特别热 combined with 空调突然坏了 explains the sleepless night.'],
   ['How do they solve the problem?','They clean the dirty filter themselves.','They buy a new air conditioner.','They sleep in the office.','They move to a cheaper room.',2,'发现只是滤网太脏，自己就能清洗 shows the fix needs no repairman.'],
   ['What does Xiao Wang advise for the future?','Check things first — you might fix them yourself.','Always call a repairman.','Buy only expensive appliances.','Panic so neighbors will help.',5,'别着急，先查查，说不定自己就能修好 is the lesson of the story.']
  ],
  ['小王说','以后','东西坏了','别着急','，','先查查','，','说不定','自己就能修好','。'],
  [2,'发现','发明','决定','希望'],
  ['Tell someone not to worry before checking first.','别着急，先查查。','Bié zháojí, xiān chácha.','Don\'t panic — check first.','别 + verb is the everyday prohibition; 查查 is casual verb reduplication.'],
  ['g168','g169','g185'],['省','shěng','to save (money); to economize'],
  'From helpless heat to a do-it-yourself fix.'
 ],
 [
  'The vendor who remembers everyone','Market talk, bargains and regular customers',
  'Read everyday market Chinese and friendly bargaining',3,
  [
   ['菜市场的王阿姨记性特别好，谁买过什么，她都记得。','Càishìchǎng de Wáng āyí jìxìng tèbié hǎo, shéi mǎi guo shénme, tā dōu jìde.','Auntie Wang at the produce market has an amazing memory — whatever anyone has bought, she remembers.'],
   ['有个姑娘常来买橘子，王阿姨总会多送两个，说尝尝，今天的特别甜。','Yǒu ge gūniang cháng lái mǎi júzi, Wáng āyí zǒng huì duō sòng liǎng ge, shuō chángchang, jīntiān de tèbié tián.','A young woman often came for oranges; Auntie Wang would always throw in two extra, saying try these — today\'s are especially sweet.'],
   ['姑娘要多给钱，王阿姨把钱推回去，说老顾客不用这么客气。','Gūniang yào duō gěi qián, Wáng āyí bǎ qián tuī huíqu, shuō lǎo gùkè bú yòng zhème kèqi.','When the woman tried to pay more, Auntie Wang pushed the money back, saying regulars needn\'t be so polite.'],
   ['有一天姑娘带了同事来，王阿姨一眼就认出她们是一个公司的。','Yǒu yì tiān gūniang dài le tóngshì lái, Wáng āyí yì yǎn jiù rènchū tāmen shì yí ge gōngsī de.','One day the woman brought a colleague, and Auntie Wang recognized at once that they worked at the same company.'],
   ['她给两个人都便宜了一点，还说下次带朋友来，人多了更便宜。','Tā gěi liǎng ge rén dōu piányi le yìdiǎn, hái shuō xià cì dài péngyou lái, rén duō le gèng piányi.','She gave both of them a small discount and said: bring friends next time — more people, better price.'],
   ['姑娘笑着说好，反正买菜在哪买都一样，不如来熟人的摊位。','Gūniang xiàozhe shuō hǎo, fǎnzhèng mǎi cài zài nǎ mǎi dōu yíyàng, bùrú lái shúrén de tānwèi.','The woman laughed and agreed: produce is the same wherever you buy it, so you might as well come to a familiar stall.']
  ],
  [
   ['Why does Auntie Wang push the money back?','The woman is a regular customer.','The oranges were not ripe.','The market is closing.','She does not accept cash.',2,'老顾客不用这么客气 gives the reason — regulars get treated differently.'],
   ['What happens when the woman brings a colleague?','The vendor recognizes the company and gives both a discount.','The vendor sells out of oranges.','The colleague bargains angrily.','They switch to another market.',3,'一眼就认出她们是一个公司的 leads straight to the discount in the next line.'],
   ['Why does the woman say 不如来熟人的摊位?','Produce is the same anywhere, so she prefers a familiar seller.','The market has only one stall.','Her colleague owns the stall.','Familiar stalls are always cheaper.',5,'在哪买都一样 sets up 不如, which prefers the second option.']
  ],
  ['姑娘','要多给钱','，','王阿姨','把钱推回去','，','说','老顾客','不用这么客气','。'],
  [4,'便宜','贵','贵重','方便'],
  ['Say that you might as well do something.','不如来熟人的摊位。','Bùrú lái shúrén de tānwèi.','You might as well come to a familiar stall.','不如 compares two options and prefers the second.'],
  ['g173','g183','g190'],['摊位','tānwèi','market stall'],
  'From one bag of oranges to a stall full of friends.'
 ],
 [
  'A rainy-day taxi ride','Traffic, kindness and small conversations',
  'Follow a short conversation between a driver and a passenger',2,
  [
   ['下雨天最难打车，小陈等了十分钟，才拦到一辆空车。','Xià yǔ tiān zuì nán dǎ chē, Xiǎo Chén děng le shí fēnzhōng, cái lán dào yí liàng kōngchē.','Rainy days are the hardest for hailing cabs; Xiao Chen waited ten minutes before stopping an empty one.'],
   ['一上车他就说麻烦快一点，他赶时间，三点半要开会。','Yí shàng chē tā jiù shuō máfan kuài yìdiǎn, tā gǎn shíjiān, sān diǎn bàn yào kāihuì.','As soon as he got in he said, please hurry — I\'m short on time; there\'s a meeting at three thirty.'],
   ['司机看了看路上的车，说现在有点堵，不过他知道一条小路。','Sījī kàn le kàn lùshang de chē, shuō xiànzài yǒudiǎn dǔ, búguò tā zhīdào yì tiáo xiǎolù.','The driver glanced at the traffic and said it was jammed, but he knew a small side road.'],
   ['小路两边都是树，雨打在车窗上，两个人安静了一会儿。','Xiǎolù liǎng biān dōu shì shù, yǔ dǎ zài chēchuāng shang, liǎng ge rén ānjìng le yíhuìr.','Trees lined both sides of the road; rain hit the windows and the two sat quietly for a while.'],
   ['到公司的时候才三点二十，小陈要多给钱，司机摆摆手。','Dào gōngsī de shíhou cái sān diǎn èrshí, Xiǎo Chén yào duō gěi qián, sījī bǎibai shǒu.','They arrived at 3:20; when Xiao Chen tried to pay extra, the driver waved his hand.'],
   ['司机说不用不用，路上小心，下次早点出门就不赶了。','Sījī shuō bú yòng bú yòng, lùshang xiǎoxīn, xià cì zǎodiǎn chūmén jiù bù gǎn le.','The driver said no need — take care on the road; leave a bit earlier next time and you won\'t be rushed.']
  ],
  [
   ['How does the driver avoid the traffic?','He takes a small side road he knows.','He drives on the sidewalk.','He cancels the meeting.','He waits for the rain to stop.',2,'现在有点堵 poses the problem; 不过他知道一条小路 solves it.'],
   ['Why does Xiao Chen ask the driver to hurry?','He is short on time for a 3:30 meeting.','He is afraid of the rain.','He wants to catch a train.','The taxi meter is broken.',1,'他赶时间，三点半要开会 states the deadline directly.'],
   ['What does the driver advise at the end?','Leave a bit earlier next time.','Take the side road every day.','Buy an umbrella.','Call him before three.',5,'下次早点出门就不赶了 is the parting advice.']
  ],
  ['下雨天','最难打车','，','小陈','等了十分钟','，','才','拦到','一辆空车','。'],
  [0,'打车','修车','堵车','停车'],
  ['Say that something is not necessary.','不用不用。','Bú yòng bú yòng.','No need.','Repeating 不用 makes the refusal warm rather than blunt.'],
  ['g175','g183','g190'],['拦','lán','to flag down; to stop (a vehicle)'],
  'From a rainy wait to an early arrival.'
 ],
 [
  'The gym card on the fridge','Good intentions, excuses and honest friends',
  'Read a light story about plans, habits and honesty',3,
  [
   ['去年冬天小何办了一张健身卡，年卡花了两千八。','Qùnián dōngtiān Xiǎo Hé bàn le yì zhāng jiànshēnkǎ, nián kǎ huā le liǎngqiānbā.','Last winter Xiao He signed up for a gym card — a yearly card for twenty-eight hundred.'],
   ['第一个月他天天去，觉得自己马上就要变成运动达人了。','Dì yí ge yuè tā tiāntiān qù, juéde zìjǐ mǎshàng jiù yào biànchéng yùndòng dárén le.','The first month he went every day, sure he was about to become a fitness expert.'],
   ['可是从第二个月开始，他不是加班就是太累，卡就放在冰箱上了。','Kěshì cóng dì èr ge yuè kāishǐ, tā bú shì jiābān jiù shì tài lèi, kǎ jiù fàng zài bīngxiāng shàng le.','But from the second month on, he was either working overtime or too tired, and the card ended up on the fridge.'],
   ['朋友来家里做客，看见卡上一层灰，笑着问他去了几次。','Péngyou lái jiālǐ zuòkè, kànjiàn kǎ shàng yì céng huī, xiàozhe wèn tā qù le jǐ cì.','A friend visiting saw dust on the card and jokingly asked how many times he had gone.'],
   ['小何不好意思地说一共就去了十次，朋友说那一次两百八，比打车还贵。','Xiǎo Hé bù hǎoyìsi de shuō yígòng jiù qù le shí cì, péngyou shuō nà yí cì liǎngbǎibā, bǐ dǎ chē hái guì.','Xiao He admitted, embarrassed, that he had gone ten times in all; his friend said that worked out to two eighty a visit — pricier than taxis.'],
   ['两个人笑了半天，最后决定以后一起跑步，反正马路上不收钱。','Liǎng ge rén xiào le bàntiān, zuìhòu juédìng yǐhòu yìqǐ pǎobù, fǎnzhèng mǎlù shang bù shōu qián.','They laughed for ages, then decided to run together from now on — the road is free anyway.']
  ],
  [
   ['Why is the friend amused by the card?','An expensive yearly card has barely been used.','The card belongs to someone else.','The gym has closed down.','Xiao He never paid for the card.',4,'一共就去了十次 against the price gives the joke: 一次两百八，比打车还贵.'],
   ['Why did Xiao He stop going after the first month?','He was either working overtime or too tired.','The gym moved far away.','His friend cancelled the membership.','The card broke.',2,'不是加班就是太累 spells out the two excuses.'],
   ['What do the two decide in the end?','To run together — the road is free.','To sell the gym card.','To go to the gym every morning.','To buy exercise equipment.',5,'以后一起跑步, 反正马路上不收钱 is the shared resolution.']
  ],
  ['两个人','笑了半天','，','最后决定','以后','一起跑步','，','反正','马路上','不收钱','。'],
  [4,'一共','一起','一定','一半'],
  ['Admit something with embarrassment.','不好意思地说……','Bù hǎoyìsi de shuō…','Say with embarrassment…','不好意思 softens an admission the way "awkwardly" does in English.'],
  ['g172','g184','g188'],['达人','dárén','expert; hand (at something)'],
  'From big plans to a cheaper, shared habit.'
 ],
 [
  'Grandmother learns to video call','Family, technology and staying close',
  'Read about patience and family across a distance',2,
  [
   ['奶奶不会用智能手机，每次想孙子了，只能让邻居帮忙打电话。','Nǎinai bú huì yòng zhìnéng shǒujī, měi cì xiǎng sūnzi le, zhǐnéng ràng línjū bāngmáng dǎ diànhuà.','Grandmother couldn\'t use a smartphone; whenever she missed her grandson, she had to ask the neighbor to help make a call.'],
   ['孙子说要不我们视频吧，这样天天都能看见对方。','Sūnzi shuō yàobù wǒmen shìpín ba, zhèyàng tiāntiān dōu néng kànjiàn duìfāng.','Her grandson said, how about video calls — that way we can see each other every day.'],
   ['刚开始奶奶总是点错，不是关了声音就是找不到摄像头。','Gāng kāishǐ nǎinai zǒng shì diǎn cuò, bú shì guān le shēngyīn jiù shì zhǎo bu dào shèxiàngtóu.','At first grandmother kept tapping the wrong thing — muting the sound or losing the camera.'],
   ['孙子一点都不着急，一步一步教，还把每个步骤画在纸上。','Sūnzi yìdiǎn dōu bù zháojí, yí bù yí bù jiào, hái bǎ měi ge bùzhòu huà zài zhǐshàng.','Her grandson wasn\'t impatient at all — he taught her step by step and drew every step on paper.'],
   ['一个月以后，奶奶不但会视频，还会发语音、看照片了。','Yí ge yuè yǐhòu, nǎinai búdàn huì shìpín, hái huì fā yǔyīn, kàn zhàopiàn le.','A month later, grandmother could not only make video calls but also send voice messages and look at photos.'],
   ['现在她每天都给孙子看阳台上新开的花，说你看，今天又多了一朵。','Xiànzài tā měitiān dōu gěi sūnzi kàn yángtái shàng xīn kāi de huā, shuō nǐ kàn, jīntiān yòu duō le yì duǒ.','Now she shows her grandson the newly blooming flowers on her balcony every day: look — one more opened today.']
  ],
  [
   ['Why did the grandmother need the neighbor?','She can\'t use a smartphone but wants to reach her grandson.','She has no phone at home.','Her grandson lives next door.','The neighbor sells phones.',0,'每次想孙子了，只能让邻居帮忙打电话 shows the problem plainly.'],
   ['How does the grandson teach her?','Step by step, drawing every step on paper.','He writes her a long email.','He asks the neighbor to teach her.','He buys her a simpler phone.',3,'一步一步教, 还把每个步骤画在纸上 describes the patient method.'],
   ['What can the grandmother do after a month?','Video calls, voice messages and photos.','Only text messages.','She still needs the neighbor.','She teaches others instead.',4,'不但会视频，还会发语音、看照片了 lists the new skills.']
  ],
  ['孙子','一点都不着急','，','一步一步','教','，','还','把每个步骤','画在纸上','。'],
  [0,'帮忙','学习','开会','见面'],
  ['Describe "not only … but also".','不但会视频，还会发语音。','Búdàn huì shìpín, hái huì fā yǔyīn.','She can not only make video calls but also send voice messages.','不但…还… stacks two abilities with the second as the surprise.'],
  ['g185','g187','g188'],['步骤','bùzhòu','step; procedure'],
  'From one wrong tap to a daily window into each other\'s lives.'
 ],
 [
  'The umbrella left at the café','Small losses, honest strangers and coffee',
  'Follow a small everyday mystery and its warm ending',2,
  [
   ['那天下大雨，小周把伞忘在咖啡馆的桌子下面。','Nà tiān xià dà yǔ, Xiǎo Zhōu bǎ sǎn wàng zài kāfēiguǎn de zhuōzi xiàmiàn.','That day it poured, and Xiao Zhou left her umbrella under a table at the café.'],
   ['到家以后她才发现，可是外面雨太大，回去拿太麻烦了。','Dào jiā yǐhòu tā cái fāxiàn, kěshì wàimiàn yǔ tài dà, huíqù ná tài máfan le.','She only noticed after getting home, but with the rain so heavy, going back for it was too much trouble.'],
   ['第二天她抱着试试看的心情回到咖啡馆，服务员一眼就认出了她。','Dì èr tiān tā bàozhe shìshikàn de xīnqíng huídào kāfēiguǎn, fúwùyuán yì yǎn jiù rènchū le tā.','The next day she returned to the café hoping to try her luck, and the barista recognized her at once.'],
   ['服务员从柜台后面拿出她的伞，说昨天有人捡到，特意留了字条。','Fúwùyuán cóng guìtái hòumiàn ná chū tā de sǎn, shuō zuótiān yǒu rén jiǎndào, tèyì liú le zìtiáo.','The barista brought out her umbrella from behind the counter: someone found it yesterday and even left a note.'],
   ['字条上写着伞很重要就拿走了，看到消息请联系我，我就住在附近。','Zìtiáo shàng xiě zhe sǎn hěn zhòngyào jiù ná zǒu le, kàn dào xiāoxi qǐng liánxì wǒ, wǒ jiù zhù zài fùjìn.','The note said: the umbrella looked important so I took it home — contact me when you see this; I live nearby.'],
   ['小周照着号码打过去，对方把伞送到门口，连楼都没上。','Xiǎo Zhōu zhàozhe hàomǎ dǎ guòqù, duìfāng bǎ sǎn sòng dào ménkǒu, lián lóu dōu méi shàng.','Xiao Zhou called the number; the person delivered the umbrella right to her door without even coming upstairs.']
  ],
  [
   ['Who has the umbrella the next morning?','A stranger who found it and took it home.','The barista sold it.','The police station.','It stayed at the café all night.',4,'昨天有人捡到，特意留了字条 tells where the umbrella went.'],
   ['Why doesn\'t Xiao Zhou fetch it that night?','The rain is too heavy and going back is too much trouble.','She forgets about it completely.','The café is already closed for a month.','She doesn\'t own an umbrella.',1,'可是外面雨太大，回去拿太麻烦了 gives both reasons.'],
   ['How does the story end?','The stranger delivers the umbrella to her door.','The barista keeps the umbrella.','Xiao Zhou buys a new umbrella.','The note is never found.',5,'对方把伞送到门口，连楼都没上 is the warm final image.']
  ],
  ['小周','照着号码','打过去','，','对方','把伞送到门口','，','连楼都没上','。'],
  [0,'忘','记','拿','送'],
  ['Say that something happened only after something else.','到家以后她才发现。','Dào jiā yǐhòu tā cái fāxiàn.','She only noticed after getting home.','才 marks that the discovery came later than expected.'],
  ['g174','g178','g179'],['字条','zìtiáo','(handwritten) note'],
  'From a forgotten umbrella to a stranger\'s kindness.'
 ],
 [
  'A package for the wrong door','Neighbors, delivery mistakes and good manners',
  'Read how neighbors solve a small mix-up together',2,
  [
   ['周六早上，小吴听见门铃响，开门一看，是个很大的箱子。','Zhōuliù zǎoshang, Xiǎo Wú tīngjiàn ménlíng xiǎng, kāimén yí kàn, shì ge hěn dà de xiāngzi.','Saturday morning Xiao Wu heard the doorbell; opening the door, he found a very large box.'],
   ['他最近没买东西，看了看单子，收件人写的是九零二，他住八零二。','Tā zuìjìn méi mǎi dōngxi, kàn le kàn dānzi, shōujiànrén xiě de shì jiǔ líng èr, tā zhù bā líng èr.','He hadn\'t bought anything lately; checking the label, the addressee was 902, while he lived in 802.'],
   ['他把箱子搬到楼上，敲了敲门，可是九零二没人在家。','Tā bǎ xiāngzi bān dào lóushàng, qiāo le qiāo mén, kěshì jiǔ líng èr méi rén zài jiā.','He carried the box upstairs and knocked, but no one was home at 902.'],
   ['楼下的阿姨说别着急，先放你家吧，等他们回来再给。','Lóuxià de āyí shuō bié zháojí, xiān fàng nǐ jiā ba, děng tāmen huílai zài gěi.','The auntie downstairs said not to worry — keep it at your place and give it to them when they return.'],
   ['晚上九点多，九零二的人回来了，听说箱子被小吴搬上来，特别感谢。','Wǎnshang jiǔ diǎn duō, jiǔ líng èr de rén huílai le, tīng shuō xiāngzi bèi Xiǎo Wú bān shànglái, tèbié gǎnxiè.','Around nine that evening the people of 902 came home; hearing Xiao Wu had carried the box up, they were extremely grateful.'],
   ['他们要请他吃饭，小吴笑着说算了算了，都是邻居，应该的。','Tāmen yào qǐng tā chī fàn, Xiǎo Wú xiàozhe shuō suàn le suàn le, dōu shì línjū, yīnggāi de.','They wanted to treat him to dinner, but Xiao Wu laughed: forget it — we\'re neighbors; it\'s what anyone would do.']
  ],
  [
   ['Why does Xiao Wu have the package?','It was delivered to the wrong apartment number.','He ordered it for a friend.','The delivery person is his cousin.','It is a gift from his parents.',1,'收件人写的是九零二，他住八零二 states the mix-up exactly.'],
   ['Why does he keep the box at his home?','No one is home at 902, and the neighbor suggests waiting.','He wants to open it.','The box is too heavy to move.','The delivery company told him to.',3,'先放你家吧，等他们回来再给 is the neighbor\'s practical advice.'],
   ['How does Xiao Wu respond to the thanks?','He declines the dinner: neighbors just help each other.','He accepts the dinner invitation.','He asks for delivery money.','He invites them to his home instead.',5,'算了算了，都是邻居，应该的 is a modest, warm refusal.']
  ],
  ['他','把箱子','搬到楼上','，','敲了敲门','，','可是','九零二','没人在家','。'],
  [2,'搬','敲','推','拉'],
  ['Say "it\'s what anyone would do".','应该的。','Yīnggāi de.','It\'s only right.','的 turns the adjective phrase into a stand-alone judgment.'],
  ['g179','g181','g190'],['收件人','shōujiànrén','addressee; recipient'],
  'From a wrong-door box to an open-door friendship.'
 ],
 [
  'Learning to cook by phone','Food, family recipes and long-distance care',
  'Follow a recipe passed down through a phone call',3,
  [
   ['小刘想做妈妈最拿手的红烧肉，可是怎么做都不像那个味道。','Xiǎo Liú xiǎng zuò māma zuì náshǒu de hóngshāoròu, kěshì zěnme zuò dōu bú xiàng nàge wèidào.','Xiao Liu wanted to make his mother\'s best dish — braised pork — but it never tasted the same.'],
   ['他给妈妈打电话，妈妈在那头笑着说，你火太大了，要小火慢炖。','Tā gěi māma dǎ diànhuà, māma zài nàtóu xiàozhe shuō, nǐ huǒ tài dà le, yào xiǎo huǒ màn dùn.','He called his mother; laughing on the other end, she said the heat was too high — it needs a low, slow simmer.'],
   ['妈妈一步一步讲，他一步一步记，还把调料的量都写在本子上。','Māma yí bù yí bù jiǎng, tā yí bù yí bù jì, hái bǎ tiáoliào de liàng dōu xiě zài běnzi shàng.','Step by step his mother explained, step by step he took notes, writing down every amount of seasoning.'],
   ['四十分钟以后，锅里飘出的香味跟记忆里的一模一样。','Sìshí fēnzhōng yǐhòu, guō lǐ piāo chū de xiāngwèi gēn jìyì lǐ de yì mú yíyàng.','Forty minutes later, the smell rising from the pot was exactly like the one in his memory.'],
   ['他拍了照片发给妈妈，妈妈回了语音：就是这个颜色，出锅吧。','Tā pāi le zhàopiàn fā gěi māma, māma huí le yǔyīn: jiùshì zhège yánsè, chū guō ba.','He snapped a photo and sent it to his mother; she replied with a voice message: that\'s the color — take it out of the pot.'],
   ['那天晚上他吃了两碗饭，觉得会做这道菜以后，离家好像也没那么远了。','Nà tiān wǎnshang tā chī le liǎng wǎn fàn, juéde huì zuò zhè dào cài yǐhòu, lí jiā hǎoxiàng yě méi nàme yuǎn le.','That night he ate two bowls of rice, feeling that once he could cook this dish, home didn\'t seem so far away.']
  ],
  [
   ['Why didn\'t the dish taste right at first?','The heat was too high; it needs a low, slow simmer.','He forgot to buy pork.','His mother refused to teach him.','The phone call kept cutting off.',1,'你火太大了，要小火慢炖 is the mother\'s diagnosis.'],
   ['How does Xiao Liu learn the recipe?','His mother explains step by step and he writes down the amounts.','He watches a video online.','He takes a cooking class.','He tastes and guesses freely.',2,'一步一步讲, 一步一步记, 把调料的量都写在本子上 shows the careful method.'],
   ['How does he feel after cooking it?','Home doesn\'t seem so far away.','He wants to open a restaurant.','He is disappointed.','He plans to visit next week.',5,'离家好像也没那么远了 is the emotional close of the story.']
  ],
  ['妈妈','一步一步讲','，','他','一步一步记','，','还','把调料的量','都写在本子上','。'],
  [0,'味道','颜色','样子','意思'],
  ['Say something is exactly like a memory.','跟记忆里的一模一样。','Gēn jìyì lǐ de yì mú yíyàng.','Exactly like in memory.','一…一… is fixed inside the pattern 一模一样.'],
  ['g177','g187','g188'],['拿手','náshǒu','good at; one\'s specialty'],
  'From a missed taste to a recipe that crosses the distance.'
 ],
 [
  'The first customer review','Work, honest feedback and improvement',
  'Read about receiving criticism and responding well',3,
  [
   ['小孙在一家面包店工作，店是她和朋友一起开的。','Xiǎo Sūn zài yì jiā miànbāodiàn gōngzuò, diàn shì tā hé péngyou yìqǐ kāi de.','Xiao Sun works at a bakery she opened together with a friend.'],
   ['开业第一个月，网上出现了第一条差评，说面包有点干。','Kāiyè dì yí ge yuè, wǎng shàng chūxiàn le dì yì tiáo chàpíng, shuō miànbāo yǒudiǎn gān.','In the first month after opening, the first negative review appeared online, saying the bread was a bit dry.'],
   ['朋友很生气，说这个人根本不懂面包，小孙却觉得应该谢谢他。','Péngyou hěn shēngqì, shuō zhège rén gēnběn bù dǒng miànbāo, Xiǎo Sūn què juéde yīnggāi xièxie tā.','Her friend was angry — this person clearly knows nothing about bread — but Xiao Sun thought they should thank him.'],
   ['她给顾客回了消息，说谢谢你的意见，我们会改进，欢迎下次再来。','Tā gěi gùkè huí le xiāoxi, shuō xièxie nǐ de yìjiàn, wǒmen huì gǎijìn, huānyíng xià cì zài lái.','She replied to the customer: thank you for your feedback — we\'ll improve; you\'re welcome to come again.'],
   ['她们把配方改了两次，多加了水，烤的时间也短了一点。','Tāmen bǎ pèifāng gǎi le liǎng cì, duō jiā le shuǐ, kǎo de shíjiān yě duǎn le yìdiǎn.','They adjusted the recipe twice, adding more water and shortening the baking time a little.'],
   ['两周以后那个人又来了，这次他笑着说，这面包比上次好多了。','Liǎng zhōu yǐhòu nàge rén yòu lái le, zhè cì tā xiàozhe shuō, zhè miànbāo bǐ shàng cì hǎo duō le.','Two weeks later that person came again — this time smiling and saying the bread was much better than last time.']
  ],
  [
   ['How does Xiao Sun respond to the negative review?','She thanks the customer and improves the recipe.','She deletes the review.','She argues with the customer online.','She closes the bakery.',3,'谢谢你的意见，我们会改进 is the reply; the next line shows the changes.'],
   ['Why does Xiao Sun thank the reviewer?','She treats the complaint as useful feedback.','The customer is her friend.','She is being sarcastic.','The bakery made a lot of money.',2,'小孙却觉得应该谢谢他 contrasts with her friend\'s anger and sets up the improvement.'],
   ['What changes after two weeks?','The customer returns and says the bread is much better.','The bakery closes for good.','The friend apologizes.','The review is deleted.',5,'这面包比上次好多了 confirms the improvement with 比 comparison.']
  ],
  ['她们','把配方','改了两次','，','多加了水','，','烤的时间','也短了一点','。'],
  [3,'改进','改变','改正','改善'],
  ['Compare this time with last time.','比上次好多了。','Bǐ shàng cì hǎo duō le.','Much better than last time.','比 comparison with 多了 marking the degree of change.'],
  ['g178','g186','g189'],['配方','pèifāng','recipe; formula'],
  'From one dry loaf to a bakery that listens.'
 ],
 [
  'The hike that started late','Weekends, weather and keeping plans',
  'Read a weekend story with a gentle lesson about time',2,
  [
   ['小周和朋友约好周末去爬山，说好八点在地铁站见。','Xiǎo Zhōu hé péngyou yuē hǎo zhōumò qù páshān, shuō hǎo bā diǎn zài dìtiě zhàn jiàn.','Xiao Zhou and her friends planned a weekend hike, agreeing to meet at the subway station at eight.'],
   ['结果三个人有两个迟到，一个起晚了，一个堵在路上。','Jiéguǒ sān ge rén yǒu liǎng ge chídào, yí ge qǐ wǎn le, yí ge dǔ zài lùshang.','In the end two of the three were late — one overslept, one was stuck in traffic.'],
   ['到山脚已经十点了，太阳很大，大家都有点后悔没早点出门。','Dào shānjiǎo yǐjīng shí diǎn le, tàiyáng hěn dà, dàjiā dōu yǒudiǎn hòuhuǐ méi zǎodiǎn chūmén.','By the time they reached the foot of the mountain it was already ten; the sun was strong and everyone regretted not leaving earlier.'],
   ['爬到一半有人走不动了，大家就坐在树下吃水果、聊天。','Pá dào yí bàn yǒu rén zǒu bu dòng le, dàjiā jiù zuò zài shù xià chī shuǐguǒ, liáotiān.','Halfway up, someone couldn\'t walk on, so they all sat under a tree eating fruit and chatting.'],
   ['有人说其实风景在哪里都一样，重要的是跟谁一起看。','Yǒu rén shuō qíshí fēngjǐng zài nǎlǐ dōu yíyàng, zhòngyào de shì gēn shéi yìqǐ kàn.','Someone said the view is really the same wherever you are — what matters is who you watch it with.'],
   ['下山以后他们说下次一定早点，可是大家都笑了，都知道下次还会晚。','Xià shān yǐhòu tāmen shuō xià cì yídìng zǎodiǎn, kěshì dàjiā dōu xiào le, dōu zhīdào xià cì hái huì wǎn.','After coming down they said next time for sure we\'ll be earlier — but everyone laughed, knowing next time they\'d be late again.']
  ],
  [
   ['Why does the group reach the mountain late?','Two of the three friends arrive late.','The mountain is closed.','They take the wrong subway.','The weather turns back the cable car.',1,'两个迟到, 一个起晚了, 一个堵在路上 gives both causes.'],
   ['Why do they stop halfway up?','Someone can\'t walk on, so they rest and chat.','They forget the way.','The fruit is too heavy.','The view is better down low.',3,'有人走不动了 leads directly to sitting under the tree.'],
   ['What is the lesson at the end?','They promise to be earlier but laugh, knowing they won\'t.','They decide never to hike again.','They blame the friend who overslept.','They plan to move the hike to Monday.',5,'下次一定早点 followed by 都知道下次还会晚 is the gentle joke.']
  ],
  ['下山以后','他们说','下次一定早点','，','可是','大家都笑了','，','都知道','下次还会晚','。'],
  [2,'后悔','害怕','紧张','着急'],
  ['Say that what matters is who you are with.','重要的是跟谁一起看。','Zhòngyào de shì gēn shéi yìqǐ kàn.','What matters is who you watch it with.','的 nominalizes the clause before 是.'],
  ['g175','g181','g190'],['风景','fēngjǐng','scenery; view'],
  'From a late start to a view that made it worth it.'
 ]
];

export const EVERYDAY_READING_ROWS=Object.freeze(EVERYDAY_READINGS.map((r,i)=>{
 const [title,theme,purpose,level,lines,questions,order,cloze,writing,grammar,word,bridge]=r;
 const meta=Object.freeze({
  id:'everyday-reading-'+String(i+1).padStart(2,'0'),
  source:'original-everyday-reading',
  grade:'Everyday Mandarin reading \u00b7 original stage '+level+' (not official HSK)',
  level,format:'six-sentence everyday narrative',purpose,
  questions:Object.freeze(questions.map((q,j)=>Object.freeze({
   id:'everyday-reading:'+String(i+1).padStart(2,'0')+':'+j,
   mode:['beginner-detail','beginner-reason','beginner-sequence'][j],
   prompt:q[0],answer:q[1],options:Object.freeze(q.slice(1,5)),evidence:q[5],explanation:q[6]
  }))),
  grammarIds:Object.freeze([...grammar]),
  focusWord:Object.freeze({hanzi:word[0],pinyin:word[1],english:word[2]}),
  bridge,
  writing:Object.freeze({prompt:writing[0],hanzi:writing[1],pinyin:writing[2],english:writing[3],explanation:writing[4]}),
  paragraphs:Object.freeze([{start:0,end:2,title:'The situation'},{start:3,end:5,title:'What happens next'}]),
  p38:null,p41:null,p46:null,p47:null,p48:null,p50:null,p51:null,p68:null,p71:null
 });
 return Object.freeze([title,theme,lines,
  [questions[0][0],...questions[0].slice(1,5)],
  [cloze[0],cloze[1],cloze[1],cloze[2],cloze[3],cloze[4]],
  order,null,meta]);
}));
