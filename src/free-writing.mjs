/** Free composition: writing about the learner's own ideas. There is no
 * single correct answer here — the analyzer reports what the writing CONTAINS
 * (sentence count, grammar markers, corpus/studied coverage, punctuation)
 * and suggests what to check next. It never grades, never calls anything
 * wrong, and inspiration examples are labeled as one possibility among many.
 */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {WORDS} from './lexicon.mjs';
import {structuralMarkers} from './compose-feedback.mjs';
export const FREE_PROMPTS=Object.freeze([
 {id:'free-01',title:'My day so far',instruction:'Write 2\u20133 sentences about your day so far.',tip:'Use 了 for completed events; a time word (今天/早上) sets the frame.',inspiration:{hanzi:'今天早上我八点起床，然后去公司。路上有点堵车，但是我没迟到。',pinyin:'Jīntiān zǎoshang wǒ bā diǎn qǐchuáng, ránhòu qù gōngsī. Lùshang yǒudiǎn dǔchē, dànshì wǒ méi chídào.',english:'This morning I got up at eight and then went to the office. There was a bit of traffic, but I was not late.'}},
 {id:'free-02',title:'My family',instruction:'Write 2\u20133 sentences about your family.',tip:'的 links people to roles: 我的妈妈\u2026; 有 lists who is in the family.',inspiration:{hanzi:'我家有四个人。妈妈是老师，爸爸在医院工作。',pinyin:'Wǒ jiā yǒu sì ge rén. Māma shì lǎoshī, bàba zài yīyuàn gōngzuò.',english:'There are four people in my family. Mom is a teacher; dad works at a hospital.'}},
 {id:'free-03',title:'Where I live',instruction:'Describe the place where you live.',tip:'很 + adjective describes; 有 introduces features.',inspiration:{hanzi:'我住在北京。北京很大，冬天很冷，但是春天很好看。',pinyin:'Wǒ zhù zài Běijīng. Běijīng hěn dà, dōngtiān hěn lěng, dànshì chūntiān hěn hǎokàn.',english:'I live in Beijing. Beijing is big; winters are cold, but spring is beautiful.'}},
 {id:'free-04',title:'Invite a friend',instruction:'Write an invitation to a friend for this weekend.',tip:'要不\u2026？ offers an alternative; 吧 softens the suggestion.',inspiration:{hanzi:'周末你有空吗？要不我们去看电影吧。',pinyin:'Zhōumò nǐ yǒu kòng ma? Yàobù wǒmen qù kàn diànyǐng ba.',english:'Are you free this weekend? How about we go see a movie.'}},
 {id:'free-05',title:'Yesterday',instruction:'Tell a short story about what you did yesterday.',tip:'了 marks completed events; 上午/下午 can order them.',inspiration:{hanzi:'昨天我在家休息。上午我看书，下午朋友来了，我们一起做饭。',pinyin:'Zuótiān wǒ zài jiā xiūxi. Shàngwǔ wǒ kàn shū, xiàwǔ péngyou lái le, wǒmen yìqǐ zuò fàn.',english:'Yesterday I rested at home. In the morning I read; in the afternoon a friend came and we cooked together.'}},
 {id:'free-06',title:'Something I enjoy',instruction:'Write about something you like doing.',tip:'喜欢 + verb is the everyday pattern for hobbies.',inspiration:{hanzi:'我喜欢爬山。每个周末我都去，山上的风景很好。',pinyin:'Wǒ xǐhuan páshān. Měi ge zhōumò wǒ dōu qù, shān shàng de fēngjǐng hěn hǎo.',english:'I enjoy hiking. I go every weekend; the scenery on the mountain is wonderful.'}},
 {id:'free-07',title:'Ordering food',instruction:'Write what you want to order and one change.',tip:'我要\u2026 orders; 不要\u2026 changes it politely.',inspiration:{hanzi:'我要一碗牛肉面，不要辣。麻烦再给一杯水。',pinyin:'Wǒ yào yì wǎn niúròu miàn, bú yào là. Máfan zài gěi yì bēi shuǐ.',english:'I would like a bowl of beef noodles, not spicy. Could I also have a glass of water.'}},
 {id:'free-08',title:'My opinion',instruction:'What do you think about working from home? Give a reason.',tip:'我觉得\u2026 gives an opinion; 因为\u2026所以\u2026 gives reasons.',inspiration:{hanzi:'我觉得在家工作很好，因为不用通勤。但是有时候有点孤单。',pinyin:'Wǒ juéde zài jiā gōngzuò hěn hǎo, yīnwèi bú yòng tōngqín. Dànshì yǒushíhou yǒudiǎn gūdān.',english:'I think working at home is good, because there is no commute. But sometimes it is a bit lonely.'}},
 {id:'free-09',title:'Ask for help',instruction:'Write a short message asking a neighbor for help.',tip:'不好意思 and 麻烦你 soften any request.',inspiration:{hanzi:'不好意思，麻烦你帮我看一下孩子，我半个小时就回来。',pinyin:'Bù hǎoyìsi, máfan nǐ bāng wǒ kàn yíxià háizi, wǒ bàn ge xiǎoshí jiù huílai.',english:'Sorry to bother you \u2014 could you watch the child for me for a moment? I will be back in half an hour.'}},
 {id:'free-10',title:'Tomorrow',instruction:'Write your plan for tomorrow.',tip:'明天 + verb sets the plan; \u2026的时候 can link two moments.',inspiration:{hanzi:'明天我要早点出门。上午开会，下午去买菜。',pinyin:'Míngtiān wǒ yào zǎodiǎn chūmén. Shàngwǔ kāihuì, xiàwǔ qù mǎi cài.',english:'Tomorrow I will leave early. A meeting in the morning; in the afternoon I will go shopping.'}},
 {id:'free-11',title:'A small problem',instruction:'Describe a small problem and what happened in the end.',tip:'可是/但是 introduces the twist; 发现 reveals what was really going on.',inspiration:{hanzi:'昨天我的手机坏了。我很着急，可是后来发现只是没电了。',pinyin:'Zuótiān wǒ de shǒujī huài le. Wǒ hěn zháojí, kěshì hòulái fāxiàn zhǐshì méi diàn le.',english:'Yesterday my phone broke. I was worried, but later I found it had simply run out of battery.'}},
 {id:'free-12',title:'Thank-you message',instruction:'Write a short thank-you message to someone who helped you.',tip:'谢谢\u2026 thanks; 请\u2026 offers something back.',inspiration:{hanzi:'谢谢你昨天帮忙！有时间请你吃饭。',pinyin:'Xièxie nǐ zuótiān bāngmáng! Yǒu shíjiān qǐng nǐ chī fàn.',english:'Thank you for your help yesterday! When you have time, let me treat you to a meal.'}}
].map(p=>Object.freeze({...p,inspiration:Object.freeze(p.inspiration)})));
let corpus=null;
function corpusChars(){
 if(!corpus){corpus=new Set();
  for(const l of DEMO_LESSONS){for(const ch of l.hanzi)corpus.add(ch);
   for(const w of l.words)for(const ch of w.hanzi)corpus.add(ch);
   for(const ch of l.sentence.hanzi)corpus.add(ch);
   if(l.extraSentence)for(const ch of l.extraSentence.hanzi)corpus.add(ch);}
  for(const w of WORDS)for(const ch of w.hanzi)corpus.add(ch);}
 return corpus;
}
const isHan=ch=>/[\u4e00-\u9fff]/.test(ch);
export function analyzeComposition(text,{known=null}={}){
 const raw=String(text||'');
 const sentences=raw.split(/[。！？!?.…]+/).map(s=>s.trim()).filter(Boolean);
 const chars=[...raw].filter(isHan);
 const charsUnique=[...new Set(chars)];
 const corpusSet=corpusChars();
 const outside=charsUnique.filter(ch=>!corpusSet.has(ch));
 const studiedMissing=known&&known.size?charsUnique.filter(ch=>!known.has(ch)):[];
 const markers=structuralMarkers(raw);
 const used=Object.entries(markers).filter(([,v])=>v).map(([k])=>k);
 const notes=[];
 if(!chars.length)notes.push('Write some Chinese before checking.');
 else{
  if(sentences.length<2)notes.push('Try two or three sentences \u2014 more practice per attempt.');
  if(!/[。！？!?]/.test(raw))notes.push('End sentences with 。 or ！');
  if(!used.includes('completed'))notes.push('Consider marking a completed event with 了.');
  if(!used.includes('timeWord'))notes.push('A time word (今天/昨天/明天\u2026) usually helps set the frame.');
  if(!used.includes('negation')&&!used.includes('questionWord')&&!used.includes('questionParticle'))notes.push('A question or a contrast (但是/可是) adds conversation to your writing.');
  if(outside.length)notes.push('These characters are outside the lesson and vocabulary corpus: '+outside.slice(0,8).join(' ')+' \u2014 check the spelling or study them next.');
 }
 return {sentences:sentences.length,chars:chars.length,markers:used,outside,studiedMissing,
  message:(chars.length?'Your writing: '+sentences.length+' sentence'+(sentences.length===1?'':'s')+', '+chars.length+' characters. Grammar markers present: '+(used.length?used.join(', '):'none yet')+'. ':'')+
   notes.join('. ')+(notes.length?'. ':'')+
   'This analysis only reports what your writing contains \u2014 it cannot judge correctness, naturalness or meaning. Compare with the inspiration and other examples; a teacher is the judge of real Chinese.'};
}
// Pure-string panel for the Writing Studio. No correctness grading happens
// here \u2014 the learner writes their own ideas and reads a content report.
export function renderFreeWritingPanel(ui,act,esc){
 const prompt=FREE_PROMPTS.find(p=>p.id===ui.promptId)||FREE_PROMPTS[0];
 const entry=String(ui.typed||'');
 return '<section class="simple-panel free-writing" id="free-writing-studio" aria-label="Free composition"><div class="panel-heading"><div><p class="eyebrow">FREE COMPOSITION \u00b7 YOUR OWN IDEAS</p><h2>'+esc(prompt.title)+'</h2></div>'+
  '<span class="muted">No single correct answer \u2014 nothing here is graded</span></div>'+
  '<p>'+esc(prompt.instruction)+'</p><p class="muted">'+esc(prompt.tip)+'</p>'+
  '<div class="button-row">'+FREE_PROMPTS.map(p=>act('free-prompt',esc(p.title),'button '+(p.id===prompt.id?'dark':'outline')+' small','data-id="'+esc(p.id)+'" aria-pressed="'+(p.id===prompt.id)+'"')).join('')+'</div>'+
  '<div class="answer-entry"><label for="free-writing-entry">Write your own Chinese here</label>'+
  '<textarea id="free-writing-entry" rows="3" maxlength="1000" lang="zh-Hans" spellcheck="false" placeholder="\u6211\u2026">'+esc(entry)+'</textarea></div>'+
  '<div class="button-row">'+act('free-check','Check my writing','button primary',entry.trim()?'':'disabled')+act('free-clear','Clear','button outline small')+'</div>'+
  (ui.feedback?'<div class="reader-feedback" role="status"><strong>What your writing contains</strong><p>'+esc(ui.feedback.message)+'</p>'+
   (ui.feedback.studiedMissing&&ui.feedback.studiedMissing.length?'<p class="muted">Outside your studied set: '+esc(ui.feedback.studiedMissing.slice(0,8).join(' '))+'</p>':'')+
   '</div>':'')+
  '<details class="free-writing-inspiration"><summary>See one possible answer among many</summary>'+
  '<p lang="zh-Hans">'+esc(prompt.inspiration.hanzi)+'</p><p class="muted">'+esc(prompt.inspiration.pinyin)+'</p><p>'+esc(prompt.inspiration.english)+'</p>'+
  '<p class="muted">This is one natural answer \u2014 not the answer. Your own wording can be completely different and still be good Chinese.</p></details>'+
  '<p class="muted">Self-reported practice log: '+(ui.stats?ui.stats.free:0)+' free-composition attempts. Writing is recorded as practice only \u2014 no correctness or fluency is ever claimed.</p>'+
  '</section>';
}
