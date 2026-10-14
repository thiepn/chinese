/** P53 original bilingual cross-case reasoning, no alternative learning-state authority. */
export const P53_TRANSFERS=Object.freeze([
  {
    "id": "p53-transfer-01",
    "title": "Authorization, implementation and effective date",
    "from": "p53-01",
    "to": "p53-04",
    "brief": "Compare approved library hours with approved but later-effective workshop policy and what each fails to establish.",
    "objection": "Both approved decisions deserve a clear public notice.",
    "distinction": "Approval alone does not establish a verified access route or authorize retroactive policy enforcement.",
    "oralTask": "Compose separate formal notices and an informal explanation without changing each source's scope.",
    "models": [
      {
        "hanzi": "获得批准并不等于所有实施条件已经得到核实。",
        "pinyin": "Huòdé pīzhǔn bìng bù děngyú suǒyǒu shíshī tiáojiàn yǐjīng dédào héshí.",
        "english": "Receiving approval does not mean every implementation condition has been verified.",
        "purpose": "Separate decision authority from actual site verification."
      },
      {
        "hanzi": "说明新规定时，除了批准状态，还必须明确适用时间。",
        "pinyin": "Shuōmíng xīn guīdìng shí, chúle pīzhǔn zhuàngtài, hái bìxū míngquè shìyòng shíjiān.",
        "english": "When explaining a new rule, state its applicable period as well as its approval status.",
        "purpose": "Preserve effective scope in a formal and informal explanation."
      }
    ]
  },
  {
    "id": "p53-transfer-02",
    "title": "Observation, outcome and causal interpretation",
    "from": "p53-02",
    "to": "p53-01",
    "brief": "Compare a change in mean test scores with a photographed barrier; show why neither observation supports a universal or causal claim.",
    "objection": "Clear observations are worth reporting and inform decisions.",
    "distinction": "A barrier at one route does not establish the status of all entrances; an average score change does not prove the pilot caused it.",
    "oralTask": "Compose two paragraphs identifying one supported observation and one unsupported interpretation per case.",
    "models": [
      {
        "hanzi": "单次现场观察不足以判断所有入口的情况。",
        "pinyin": "Dān cì xiànchǎng guānchá bù zúyǐ pànduàn suǒyǒu rùkǒu de qíngkuàng.",
        "english": "One site observation cannot establish the condition of every entrance.",
        "purpose": "Distinguish a documented observation from universal coverage."
      },
      {
        "hanzi": "成绩变化同样需要适当比较，才能判断项目是否产生了效果。",
        "pinyin": "Chéngjì biànhuà tóngyàng xūyào shìdàng bǐjiào, cái néng pànduàn xiàngmù shìfǒu chǎnshēng le xiàoguǒ.",
        "english": "Score changes likewise need suitable comparisons before the programme's effect can be judged.",
        "purpose": "Transfer the scope-of-evidence principle without confusing different data."
      }
    ]
  },
  {
    "id": "p53-transfer-03",
    "title": "Consent and approval are different authorities",
    "from": "p53-03",
    "to": "p53-04",
    "brief": "Compare privacy consent from aid recipients and approval of a workshop rule. Show what each authorizes without conflating them.",
    "objection": "Both programmes have legitimate needs for clear reporting and communication.",
    "distinction": "An approved programme policy cannot substitute for individual consent to disclose information; a draft option is not an effective requirement.",
    "oralTask": "Prepare a respectful response to a recipient and a separate clear instruction for a participant.",
    "models": [
      {
        "hanzi": "活动规则的批准不能代替个人公开信息的同意。",
        "pinyin": "Huódòng guīzé de pīzhǔn bù néng dàitì gèrén gōngkāi xìnxī de tóngyì.",
        "english": "Approval of programme rules cannot replace an individual's consent to public disclosure.",
        "purpose": "Protect different sources of authorization."
      },
      {
        "hanzi": "我们既要准确说明规定，也要尊重不愿公开身份的人。",
        "pinyin": "Wǒmen jì yào zhǔnquè shuōmíng guīdìng, yě yào zūnzhòng bú yuàn gōngkāi shēnfèn de rén.",
        "english": "We must explain rules accurately and respect people who do not wish to be identified publicly.",
        "purpose": "Preserve privacy while speaking naturally and respectfully."
      }
    ]
  },
  {
    "id": "p53-transfer-04",
    "title": "Transparent reporting without invented certainty",
    "from": "p53-02",
    "to": "p53-03",
    "brief": "Compare accountability for a learning pilot with supply distribution reporting. Keep measured totals distinct from unsupported causal and privacy claims.",
    "objection": "Publishing accurate summary numbers helps accountability in both settings.",
    "distinction": "Numbers do not prove programme causation, and transparent donor reporting need not expose names.",
    "oralTask": "Create two public summaries and respond to one fair objection about missing detail.",
    "models": [
      {
        "hanzi": "公布真实数字有助于透明，但不意味着任何解释都得到了证实。",
        "pinyin": "Gōngbù zhēnshí shùzì yǒuzhù yú tòumíng, dàn bù yìwèizhe rènhé jiěshì dōu dédào le zhèngshí.",
        "english": "Publishing real figures promotes transparency but does not verify every interpretation.",
        "purpose": "Distinguish disclosed measurements from explanations."
      },
      {
        "hanzi": "负责任的报告应同时说明数据的来源、范围和限制。",
        "pinyin": "Fù zérèn de bàogào yīng tóngshí shuōmíng shùjù de láiyuán, fànwéi hé xiànzhì.",
        "english": "Responsible reporting should state a figure's source, scope and limitations together.",
        "purpose": "Transfer provenance and uncertainty across domains."
      }
    ]
  }
].map(x=>Object.freeze({...x,models:Object.freeze(x.models.map(m=>Object.freeze(m)))})));
export const P53_TRANSFER_TASKS=Object.freeze(P53_TRANSFERS.flatMap(c=>c.models.map((m,i)=>Object.freeze({id:'p53:transfer:'+c.id+':model'+i,kind:'p53-cross-case-exact',p53TransferId:c.id,hanzi:m.hanzi,pinyin:m.pinyin,english:m.english,explanation:m.purpose,misconception:c.distinction})));
export const p53TransfersFor=id=>P53_TRANSFERS.filter(t=>t.from===id||t.to===id);
