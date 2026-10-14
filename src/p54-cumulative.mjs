/** Explicit authored P50–P54 cumulative comparisons. Each link retains the
 * original historical source identity and native owner of its evidence.
 */
const rows=[
 {id:'p54-01',title:'From a survey translation to a verified historical quotation',
  bridge:'In both a survey abstract and an exhibition label, fluent wording may not turn a limited source statement into a universal claim.',
  counter:'Readable summaries are useful, but quantifiers and corrections must survive revision.',
  independent:'Write two new Mandarin paragraphs comparing survey scope, historical transcription uncertainty and a corrected reader-facing version. Distinguish the different original sources.',
  oral:'Explain aloud why correcting “some” to “all” is as problematic as translating respondents into all learners.',
  links:[['p50','p50-02','Earlier source interpretation'],['p51','p51-02','Survey meaning and translation'],['p52','p52-03','Provisional text and later correction'],['p53','p53-04','Version-specific authority']],
  models:[
   ['从有限资料得出的结论，不能被改写成适用于所有人的判断。','Cóng yǒuxiàn zīliào déchū de jiélùn, bù néng bèi gǎixiě chéng shìyòng yú suǒyǒu rén de pànduàn.','A conclusion drawn from limited material cannot be rewritten as a judgment applying to everyone.','Preserve population and textual quantifiers'],
   ['核实引文之后，编辑还需要交代早期版本的不确定之处。','Héshí yǐnwén zhīhòu, biānjí hái xūyào jiāodài zǎoqī bǎnběn de bù quèdìng zhī chù.','After verifying the quotation, the editor must still explain uncertainty in the earlier version.','State correction history rather than silently replacing it']]
 },
 {id:'p54-02',title:'Approval, schedules and observed service status',
  bridge:'Formal plans, interrupted service and verified operation are different kinds of evidence across campus facilities and transit.',
  counter:'Passengers need immediate useful advice; this makes timestamps and actual confirmation more important, not optional.',
  independent:'Compare planned reading-room opening and actual transport operation without inventing a guaranteed accessible route or current departure time.',
  oral:'Explain in ordinary Mandarin how a planned service, a time-stamped interruption and an observed partial reopening differ.',
  links:[['p50','p50-01','Proposed versus operative schedule'],['p51','p51-01','Approved date versus booking record'],['p52','p52-01','Registration and presence evidence'],['p53','p53-01','Approved hours versus inspected access']],
  models:[
   ['正式时刻表列出计划班次，但实际恢复情况需要另行核实。','Zhèngshì shíkèbiǎo lièchū jìhuà bāncì, dàn shíjì huīfù qíngkuàng xūyào lìngxíng héshí.','The official timetable lists planned services, but actual restoration requires separate verification.','Keep schedule and operations distinct'],
   ['转发交通通知时，应保留核实时间和只恢复部分服务的限制。','Zhuǎnfā jiāotōng tōngzhī shí, yīng bǎoliú héshí shíjiān hé zhǐ huīfù bùfen fúwù de xiànzhì.','When forwarding transport updates, retain the verification time and limit that only some service resumed.','Protect timestamp and partial status']]
 },
 {id:'p54-03',title:'Denominators, preference and observed learning evidence',
  bridge:'A survey preference, a pilot average and a logged exercise completion are different measured constructs; none alone proves general mastery or causation.',
  counter:'Clear percentages support communication when readers can see numerator, denominator and measured action.',
  independent:'Explain survey self-selection, changing denominators and the difference between exercise completion and knowledge mastery in a source-bounded Chinese report.',
  oral:'Give a spontaneous explanation of why 80% completion among course visitors is not 80% mastery among registered accounts.',
  links:[['p50','p50-02','Original preferences and measured scope'],['p51','p51-02','Translation of limited survey results'],['p52','p52-02','Observation versus broad trend'],['p53','p53-02','Mean improvement versus causal claim']],
  models:[
   ['没有明确分母的百分比，容易让读者误解被统计的人群。','Méiyǒu míngquè fēnmǔ de bǎifēnbǐ, róngyì ràng dúzhě wùjiě bèi tǒngjì de rénqún.','A percentage without a clear denominator can mislead readers about the population counted.','Preserve who was measured'],
   ['完成练习、表示满意和真正掌握知识，需要分别寻找证据。','Wánchéng liànxí, biǎoshì mǎnyì hé zhēnzhèng zhǎngwò zhīshi, xūyào fēnbié xúnzhǎo zhèngjù.','Completing an exercise, expressing satisfaction and truly mastering material each require distinct evidence.','Do not convert activity into proficiency']]
 },
 {id:'p54-04',title:'Forecast, installation, observation and causation',
  bridge:'Projected water savings, donated goods and a pilot-score change all require a distinction between intended effects, accomplished actions and observed outcomes.',
  counter:'Volunteer motivation and accountability remain important even when causal effect is not yet established.',
  independent:'Write a formal report separating the planned saving, actual water-meter difference, rainfall and planting-area changes; compare the logic with another prior case.',
  oral:'Explain to a volunteer why the observed drop is encouraging without promising a proven saving caused by barrels.',
  links:[['p50','p50-04','Planned action versus verification'],['p51','p51-04','Promised improvement versus observed access'],['p52','p52-04','Pledge, receipt and delivery'],['p53','p53-02','Observed outcome and causation']],
  models:[
   ['虽然用水量有所下降，但现有资料不能确定这完全是新设备造成的。','Suīrán yòngshuǐ liàng yǒusuǒ xiàjiàng, dàn xiànyǒu zīliào bù néng quèdìng zhè wánquán shì xīn shèbèi zàochéng de.','Although water use fell, the existing records cannot establish that the new equipment caused the entire change.','Combine real observation with causal uncertainty'],
   ['项目预测、设备安装和后续读数应当作为三类不同的信息报告。','Xiàngmù yùcè, shèbèi ānzhuāng hé hòuxù dúshù yīngdāng zuòwéi sān lèi bù tóng de xìnxī bàogào.','The project forecast, installed equipment and subsequent readings should be reported as three distinct kinds of information.','Differentiate promise, implementation and measurement']]
 }
];
export const P54_CUMULATIVE=Object.freeze(rows.map(x=>Object.freeze({...x,
 links:Object.freeze(x.links.map(([phase,id,label])=>Object.freeze({phase,id,label}))),
 models:Object.freeze(x.models.map(([hanzi,pinyin,english,purpose])=>Object.freeze({hanzi,pinyin,english,purpose})))
})));
export const p54CumulativeFor=id=>P54_CUMULATIVE.find(x=>x.id===id)||null;
export const P54_CUMULATIVE_TASKS=Object.freeze(P54_CUMULATIVE.flatMap(x=>x.models.map((m,i)=>Object.freeze({
 id:'p54:cumulative:'+x.id+':model'+i,kind:'p54-native-cumulative-exact',
 p54CumulativeId:x.id,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,
 explanation:m.purpose,misconception:x.bridge
}))));
