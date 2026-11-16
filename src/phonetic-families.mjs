/** Phonetic families (形声字 sound series): the shared component of these
 * characters hints at their pronunciation. Sounds are close, not identical —
 * tones and initials drift over the centuries — so each family teaches the
 * pattern honestly rather than promising exact readings. Editorial material
 * only; characters are common Mandarin, not an official syllabus inventory.
 */
export const PHONETIC_FAMILIES=Object.freeze([
 {anchor:'青',sound:'qīng sound family',note:'The 青 series keeps a -ing rhyme across tones.',members:[
  {hanzi:'清',pinyin:'qīng',gloss:'clear'},{hanzi:'请',pinyin:'qǐng',gloss:'to ask; please'},
  {hanzi:'情',pinyin:'qíng',gloss:'feeling'},{hanzi:'晴',pinyin:'qíng',gloss:'sunny'},
  {hanzi:'睛',pinyin:'jīng',gloss:'eye'}]},
 {anchor:'包',sound:'bāo sound family',note:'包 members keep the b-/p- initial and -ao rhyme.',members:[
  {hanzi:'抱',pinyin:'bào',gloss:'to hug'},{hanzi:'跑',pinyin:'pǎo',gloss:'to run'},
  {hanzi:'饱',pinyin:'bǎo',gloss:'full (after eating)'},{hanzi:'泡',pinyin:'pào',gloss:'to soak'}]},
 {anchor:'方',sound:'fāng sound family',note:'方 members keep the -ang rhyme.',members:[
  {hanzi:'房',pinyin:'fáng',gloss:'room; house'},{hanzi:'放',pinyin:'fàng',gloss:'to put; to release'},
  {hanzi:'访',pinyin:'fǎng',gloss:'to visit'},{hanzi:'防',pinyin:'fáng',gloss:'to guard against'}]},
 {anchor:'马',sound:'mǎ sound family',note:'马 members keep the m- initial.',members:[
  {hanzi:'妈',pinyin:'mā',gloss:'mom'},{hanzi:'吗',pinyin:'ma',gloss:'question particle'},
  {hanzi:'码',pinyin:'mǎ',gloss:'code; number'},{hanzi:'骂',pinyin:'mà',gloss:'to scold'}]},
 {anchor:'也',sound:'yě sound family',note:'也 sits inside these characters and flattens the vowel.',members:[
  {hanzi:'他',pinyin:'tā',gloss:'he; him'},{hanzi:'她',pinyin:'tā',gloss:'she; her'},
  {hanzi:'地',pinyin:'dì',gloss:'ground; -ly particle'},{hanzi:'池',pinyin:'chí',gloss:'pond'}]},
 {anchor:'每',sound:'měi sound family',note:'每 members keep a -ei/-ai rhyme.',members:[
  {hanzi:'海',pinyin:'hǎi',gloss:'sea'},{hanzi:'悔',pinyin:'huǐ',gloss:'to regret'},
  {hanzi:'梅',pinyin:'méi',gloss:'plum'}]},
 {anchor:'交',sound:'jiāo sound family',note:'交 members keep a j-/x- initial and -iao rhyme.',members:[
  {hanzi:'校',pinyin:'xiào',gloss:'school'},{hanzi:'较',pinyin:'jiào',gloss:'to compare'},
  {hanzi:'咬',pinyin:'yǎo',gloss:'to bite'},{hanzi:'胶',pinyin:'jiāo',gloss:'glue'}]},
 {anchor:'皮',sound:'pí sound family',note:'皮 members keep a p-/b- initial.',members:[
  {hanzi:'披',pinyin:'pī',gloss:'to drape over'},{hanzi:'坡',pinyin:'pō',gloss:'slope'},
  {hanzi:'破',pinyin:'pò',gloss:'broken'},{hanzi:'被',pinyin:'bèi',gloss:'quilt; passive marker'}]},
 {anchor:'及',sound:'jí sound family',note:'及 members keep the j- initial and -i rhyme.',members:[
  {hanzi:'级',pinyin:'jí',gloss:'level; grade'},{hanzi:'极',pinyin:'jí',gloss:'extreme'},
  {hanzi:'吸',pinyin:'xī',gloss:'to breathe in'}]},
 {anchor:'白',sound:'bái sound family',note:'白 members keep a b-/p- initial.',members:[
  {hanzi:'拍',pinyin:'pāi',gloss:'to pat; to take (a photo)'},{hanzi:'怕',pinyin:'pà',gloss:'to fear'},
  {hanzi:'伯',pinyin:'bó',gloss:'uncle (older)'}]},
 {anchor:'反',sound:'fǎn sound family',note:'反 members keep the -an rhyme.',members:[
  {hanzi:'饭',pinyin:'fàn',gloss:'meal; rice'},{hanzi:'板',pinyin:'bǎn',gloss:'board'},
  {hanzi:'版',pinyin:'bǎn',gloss:'edition'}]},
 {anchor:'分',sound:'fēn sound family',note:'分 members keep a f-/b- initial and -en rhyme.',members:[
  {hanzi:'份',pinyin:'fèn',gloss:'portion; copy'},{hanzi:'粉',pinyin:'fěn',gloss:'powder'},
  {hanzi:'盆',pinyin:'pén',gloss:'basin'},{hanzi:'扮',pinyin:'bàn',gloss:'to dress up'}]},
 {anchor:'圭',sound:'guī sound family',note:'圭 members drift widely but keep a g/k/x- initial.',members:[
  {hanzi:'挂',pinyin:'guà',gloss:'to hang'},{hanzi:'娃',pinyin:'wá',gloss:'child; doll'},
  {hanzi:'街',pinyin:'jiē',gloss:'street'},{hanzi:'鞋',pinyin:'xié',gloss:'shoe'}]},
 {anchor:'尧',sound:'yáo sound family',note:'尧 members keep the -ao rhyme.',members:[
  {hanzi:'烧',pinyin:'shāo',gloss:'to burn; to cook'},{hanzi:'晓',pinyin:'xiǎo',gloss:'dawn; to know'},
  {hanzi:'浇',pinyin:'jiāo',gloss:'to water (plants)'},{hanzi:'饶',pinyin:'ráo',gloss:'to forgive'}]},
 {anchor:'采',sound:'cǎi sound family',note:'采 members keep the c- initial and -ai rhyme.',members:[
  {hanzi:'彩',pinyin:'cǎi',gloss:'color'},{hanzi:'菜',pinyin:'cài',gloss:'vegetable; dish'},
  {hanzi:'踩',pinyin:'cǎi',gloss:'to step on'}]},
 {anchor:'亡',sound:'wáng sound family',note:'亡 members keep the -ang rhyme.',members:[
  {hanzi:'忙',pinyin:'máng',gloss:'busy'},{hanzi:'忘',pinyin:'wàng',gloss:'to forget'},
  {hanzi:'芒',pinyin:'máng',gloss:'awn; sharp point'}]},
 {anchor:'令',sound:'lìng sound family',note:'令 members keep the -ing rhyme after l-/n- initials.',members:[
  {hanzi:'零',pinyin:'líng',gloss:'zero'},{hanzi:'领',pinyin:'lǐng',gloss:'to lead; collar'},
  {hanzi:'冷',pinyin:'lěng',gloss:'cold'},{hanzi:'邻',pinyin:'lín',gloss:'neighbor'}]},
 {anchor:'舌',sound:'shé sound family',note:'舌 sits inside these and the rhyme drifts.',members:[
  {hanzi:'话',pinyin:'huà',gloss:'speech; words'},{hanzi:'活',pinyin:'huó',gloss:'to live; lively'},
  {hanzi:'甜',pinyin:'tián',gloss:'sweet'}]},
 {anchor:'平',sound:'píng sound family',note:'平 members keep the p- initial and -ing rhyme.',members:[
  {hanzi:'评',pinyin:'píng',gloss:'to evaluate; review'},{hanzi:'苹',pinyin:'píng',gloss:'apple (in 苹果)'},
  {hanzi:'坪',pinyin:'píng',gloss:'lawn'}]},
 {anchor:'吉',sound:'jí sound family',note:'吉 members keep the j- initial.',members:[
  {hanzi:'结',pinyin:'jié',gloss:'to tie; to settle'},{hanzi:'洁',pinyin:'jié',gloss:'clean'},
  {hanzi:'桔',pinyin:'jú',gloss:'tangerine (in 桔子)'}]}
]);
const byChar=new Map();
for(const family of PHONETIC_FAMILIES)for(const m of family.members)if(!byChar.has(m.hanzi))byChar.set(m.hanzi,family);
export function familyOf(hanzi){return byChar.get(hanzi)||null;}
