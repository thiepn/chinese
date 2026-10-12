/** Hand-authored contrastive meanings and polyphonic examples, not HSK claims or certified linguistic review. */
const pairs=[
 ['会','我会说一点中文。','Wǒ huì shuō yìdiǎn Zhōngwén.','I can speak a little Chinese.','learned ability','meeting','The particle 会 before a verb expresses learned ability.'],
 ['会','我们下午开会。','Wǒmen xiàwǔ kāi huì.','We have a meeting this afternoon.','meeting','learned ability','开会 is a word meaning to hold a meeting.'],
 ['点','火车早上八点走。','Huǒchē zǎoshang bā diǎn zǒu.','The train leaves at eight in the morning.',"o’clock / point in time",'a small amount','八点 specifies the hour.'],
 ['点','我想喝一点水。','Wǒ xiǎng hē yìdiǎn shuǐ.','I would like a little water.','a small amount',"o’clock / point in time",'一点 quantifies a small amount.'],
 ['看','我晚上看书。','Wǒ wǎnshang kàn shū.','I read in the evening.','read','see a doctor','看书 is a verb-object phrase meaning to read a book.'],
 ['看','他今天去看医生。','Tā jīntiān qù kàn yīshēng.','He is going to see a doctor today.','see a doctor','read','看医生 means to consult or see a doctor.'],
 ['上','书在桌子上。','Shū zài zhuōzi shàng.','The book is on the table.','on / above','attend a class','桌子上 locates something on top of the table.'],
 ['上','他白天上课。','Tā báitiān shàng kè.','He attends classes during the day.','attend a class','on / above','上课 is the expression for attending or teaching a class.'],
 ['行','我每天在这里行走。','Wǒ měitiān zài zhèlǐ xíngzǒu.','I walk here every day.','walk / travel on foot','bank / business sector','行 in 行走 is read xíng.'],
 ['行','这家银行很近。','Zhè jiā yínháng hěn jìn.','This bank is nearby.','bank / business sector','walk / travel on foot','行 in 银行 is read háng, not xíng.'],
 ['长','这条路很长。','Zhè tiáo lù hěn cháng.','This road is long.','long (cháng)','grow (zhǎng)','长 is cháng when describing length.'],
 ['长','孩子长大了。','Háizi zhǎng dà le.','The child has grown up.','grow (zhǎng)','long (cháng)','长 is zhǎng for growth in 长大.']
];
export const SENSE_CASES=Object.freeze(pairs.map(([target,hanzi,pinyin,english,answer,wrong,explanation],index)=>Object.freeze({id:`sense-${index+1}`,target,hanzi,pinyin,english,answer,options:Object.freeze([answer,wrong].sort()),explanation,origin:'original-editorial-demo',officialHskLevel:null})));
export function senseCase(index){return SENSE_CASES[((index%SENSE_CASES.length)+SENSE_CASES.length)%SENSE_CASES.length];}
export function evaluateSense(id,answer){const item=SENSE_CASES.find(c=>c.id===id);if(!item||typeof answer!=='string')throw Error('Unknown context');return {correct:item.answer===answer,message:item.explanation,reference:item.answer};}
export function validateSenseEvents(events){if(events===undefined)return true;if(!Array.isArray(events)||events.length>30000)throw Error('Invalid sense history');const used=new Set();for(const e of events){if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||used.has(e.id)||!SENSE_CASES.some(c=>c.id===e.caseId)||typeof e.correct!=='boolean'||typeof e.assisted!=='boolean'||!Number.isFinite(e.at)||e.at<0)throw Error('Invalid sense event');used.add(e.id);}return true;}
export function addSenseEvent(state,{id,caseId,correct,assisted=false,at=Date.now()}){const result=structuredClone(state);result.senseEvents??=[];if(result.senseEvents.some(x=>x.id===id))return result;result.senseEvents.push({id,caseId,correct,assisted,at});validateSenseEvents(result.senseEvents);return result;}
export function senseStats(state){const e=state.senseEvents||[];return {attempts:e.length,independent:e.filter(x=>x.correct&&!x.assisted).length,misses:e.filter(x=>!x.correct).length};}
