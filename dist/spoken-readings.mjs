/** Spoken-reading honesty layer for listening drills.
 * A device voice reading an isolated character may pick a different reading
 * than the one a lesson teaches (还 is spoken hái "still" far more often than
 * huán "return"; 觉 as jiào "sleep" vs jué "perceive"), and neutral-tone
 * particles lose their character in isolation. For every character listed
 * here — or taught with a neutral tone — listening drills speak a
 * disambiguating lesson WORD instead of the bare character, and ask about the
 * syllable that carries the taught reading. Values are the alternate
 * syllables (tones marked) a reader may give the isolated character.
 */
export const POLYPHONE_READINGS=Object.freeze({
 '大':['dài','tài'],'会':['kuài'],'哪':['né'],'了':['liǎo'],'给':['jǐ'],'没':['mò'],
 '觉':['jiào'],'得':['dé','děi'],'都':['dū'],'和':['hè','huó','huò','hú'],'绿':['lù'],
 '识':['zhì'],'地':['de'],'还':['hái'],'便':['pián'],'重':['chóng'],'提':['dī'],
 '参':['shēn','cēn'],'调':['diào'],'行':['háng','hàng'],'长':['zhǎng'],'乐':['yuè','yào'],
 '少':['shào'],'教':['jiào'],'干':['gān'],'空':['kōng'],'假':['jià'],
 '种':['zhòng'],'数':['shǔ','shuò'],'角':['jué'],'只':['zhī'],'分':['fèn'],'更':['gēng'],
 '结':['jiē'],'解':['jiè','xiè'],'看':['kān'],'落':['là','lào'],'难':['nàn'],'强':['qiǎng','jiàng'],
 '曲':['qǔ'],'舍':['shè'],'省':['xǐng'],'似':['shì'],'调':['diào'],'系':['jì'],
 '吓':['hè'],'鲜':['xiǎn'],'相':['xiàng'],'兴':['xìng'],'旋':['xuàn'],'要':['yāo'],
 '应':['yìng'],'与':['yù','yú'],'载':['zài'],'扎':['zā','zhá'],'中':['zhòng'],'转':['zhuàn'],
 '为':['wéi'],'血':['xiě'],'扇':['shān'],'上':['shǎng'],'折':['shé','zhē'],'挑':['tiǎo'],
 '脏':['zāng'],'涨':['zhàng'],'爪':['zhuǎ'],'钻':['zuàn']
});
const TONE_NAMES=Object.freeze({1:'First tone',2:'Second tone',3:'Third tone',4:'Fourth tone',5:'Neutral tone'});
export function toneName(tone){return TONE_NAMES[tone]||TONE_NAMES[5];}
// True when an isolated device-voice reading may not match the taught one.
export function isolatedReadingUnsafe(hanzi,taughtTone){
 return taughtTone===5||Object.hasOwn(POLYPHONE_READINGS,hanzi);
}
