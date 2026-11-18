/** Meaning radicals (semantic components) of common phono-semantic compound
 * characters. These are hand-authored teaching hints about what a component
 * contributes to meaning — not an official radical dictionary, not stroke
 * counts, and not a claim that the hint always predicts the modern word.
 */
export const MEANING_RADICALS=Object.freeze([
 {glyph:'扌',name:'hand',meaning:'hand actions',examples:['打','找','提','挂','拍']},
 {glyph:'氵',name:'water',meaning:'water or liquid',examples:['河','洗','清','泡','池']},
 {glyph:'忄',name:'heart',meaning:'feelings or states of mind',examples:['忙','情','悔','快']},
 {glyph:'心',name:'heart',meaning:'feelings or thought',examples:['想','忘','志']},
 {glyph:'口',name:'mouth',meaning:'mouth actions or speech sounds',examples:['吃','喝','吗','咬']},
 {glyph:'目',name:'eye',meaning:'seeing or the eye',examples:['看','睛','睡']},
 {glyph:'⻊',name:'foot',meaning:'movement with the feet',examples:['跑','跳','踩','路']},
 {glyph:'火',name:'fire',meaning:'fire, heat or cooking',examples:['烧','热','烟']},
 {glyph:'灬',name:'fire',meaning:'heat from below',examples:['热','照','煮']},
 {glyph:'土',name:'earth',meaning:'earth or ground',examples:['地','坡','场','坪']},
 {glyph:'木',name:'wood',meaning:'trees, wood or wooden objects',examples:['林','校','杯','梅','板']},
 {glyph:'钅',name:'metal',meaning:'metal or tools',examples:['钱','钟','银','铁']},
 {glyph:'讠',name:'speech',meaning:'speech or language',examples:['说','话','请','认']},
 {symbol:'',glyph:'言',name:'speech',meaning:'speech or language (full form)',examples:['誓','誉']},
 {glyph:'饣',name:'food',meaning:'food or eating',examples:['饭','饱','饺','饮']},
 {glyph:'衤',name:'clothing',meaning:'clothing',examples:['被','衫','裤']},
 {glyph:'纟',name:'silk',meaning:'thread, cloth or connection',examples:['红','级','纸','结']},
 {glyph:'女',name:'woman',meaning:'woman or family roles',examples:['妈','她','娃','好']},
 {glyph:'亻',name:'person',meaning:'people or their actions',examples:['他','你','伯','休']},
 {glyph:'犭',name:'animal',meaning:'animals',examples:['狗','猫','猪']},
 {glyph:'虫',name:'insect',meaning:'insects or small creatures',examples:['蛇','蚁','蜂']},
 {glyph:'鸟',name:'bird',meaning:'birds',examples:['鸡','鸭','鸣']},
 {glyph:'刂',name:'knife',meaning:'cutting or sharp tools',examples:['刻','利','剑']},
 {glyph:'力',name:'strength',meaning:'strength or effort',examples:['动','助','劳']},
 {glyph:'宀',name:'roof',meaning:'home or shelter',examples:['家','安','室']},
 {glyph:'门',name:'door',meaning:'doors or openings',examples:['间','问','闻']},
 {glyph:'阝',name:'mound',meaning:'places or terrain (left side)',examples:['院','队','阳']},
 {glyph:'疒',name:'illness',meaning:'illness or body conditions',examples:['病','疼','瘦']},
 {glyph:'日',name:'sun',meaning:'sun, light or time',examples:['晴','明','时']},
 {glyph:'月',name:'moon',meaning:'moon, time or the body',examples:['期','明','腿']},
 {glyph:'车',name:'vehicle',meaning:'vehicles or wheels',examples:['轮','轻','辆']},
 {glyph:'贝',name:'shell',meaning:'money or value',examples:['贵','费','财']},
 {glyph:'辶',name:'movement',meaning:'movement along a path',examples:['这','进','远']},
 {glyph:'户',name:'door',meaning:'doors and households',examples:['房','所','扇']},
 {glyph:'石',name:'stone',meaning:'stone or hard materials',examples:['破','码','矿']},
 {glyph:'艹',name:'grass',meaning:'plants and grasses',examples:['菜','花','茶','草']},
 {glyph:'攵',name:'action',meaning:'actions done by hand',examples:['放','教','改']},
 {glyph:'页',name:'head',meaning:'the head or pages',examples:['领','顺','题']},
 {glyph:'冫',name:'ice',meaning:'cold or ice',examples:['冷','冰','净']},
 {glyph:'米',name:'rice',meaning:'rice or grain',examples:['粉','粮','精']},
 {glyph:'皿',name:'vessel',meaning:'containers and dishes',examples:['盆','盘','盛']},
 {glyph:'舌',name:'tongue',meaning:'the tongue or taste',examples:['甜','乱']},
 {glyph:'行',name:'step',meaning:'going or streets',examples:['街','衡']},
 {glyph:'革',name:'leather',meaning:'leather goods',examples:['鞋','鞭']},
 {glyph:'彡',name:'pattern',meaning:'pattern or appearance',examples:['彩','形','影']},
 {glyph:'片',name:'slice',meaning:'flat pieces',examples:['版','牌']},
 {glyph:'雨',name:'rain',meaning:'weather from the sky',examples:['零','雪','雷']}
].map(({glyph,name,meaning,examples})=>Object.freeze({glyph,name,meaning,examples:Object.freeze(examples)})));
// Semantic component of phono-semantic family members (sound families in
// phonetic-families.mjs). Authored only where the component is clear.
export const SEMANTIC_OF=Object.freeze({
 '清':'氵','请':'讠','情':'忄','晴':'日','睛':'目',
 '抱':'扌','跑':'⻊','饱':'饣','泡':'氵',
 '房':'户','放':'攵','访':'讠','防':'阝',
 '妈':'女','吗':'口','码':'石','骂':'口',
 '他':'亻','她':'女','地':'土','池':'氵',
 '海':'氵','悔':'忄','梅':'木',
 '校':'木','较':'车','咬':'口','胶':'月',
 '披':'扌','坡':'土','破':'石','被':'衤',
 '级':'纟','极':'木','吸':'口',
 '拍':'扌','怕':'忄','伯':'亻',
 '饭':'饣','板':'木','版':'片',
 '份':'亻','粉':'米','盆':'皿','扮':'扌',
 '挂':'扌','娃':'女','街':'行','鞋':'革',
 '烧':'火','晓':'日','浇':'氵','饶':'饣',
 '彩':'彡','菜':'艹','踩':'⻊',
 '忙':'忄','忘':'心','芒':'艹',
 '零':'雨','领':'页','冷':'冫','邻':'阝',
 '话':'讠','活':'氵','甜':'舌',
 '评':'讠','苹':'艹','坪':'土',
 '结':'纟','洁':'氵','桔':'木'
});
const byGlyph=new Map(MEANING_RADICALS.map(r=>[r.glyph,r]));
export function radicalOf(glyph){return byGlyph.get(glyph)||null;}
export function semanticOf(hanzi){const glyph=SEMANTIC_OF[hanzi];return glyph?radicalOf(glyph):null;}
