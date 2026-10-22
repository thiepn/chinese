// Local Chinese package consumer snapshot pinned to @thiepn/visual-lexicon 344d573564f188ba586f31bd690cad09e161d55e.
// Exactly 12 original canonical WORDS/w.key mappings; no translation joins or inferred senses.
export const CHINESE_LOCAL_VISUALS=Object.freeze([
  {
    "lexemeId": "书|shu",
    "conceptId": "object.book",
    "asset": "book.svg",
    "alt": "Illustration of a closed book",
    "blobSha": "cbb6d7d4f16af1c24a5d20dd053ef9b67e53f20b"
  },
  {
    "lexemeId": "水|shui",
    "conceptId": "beverage.water",
    "asset": "water.svg",
    "alt": "Illustration of a glass of water",
    "blobSha": "eebaaec38dedc3a57bd143de819fc17e19d4c78f"
  },
  {
    "lexemeId": "喝|he",
    "conceptId": "action.drink-from-cup",
    "asset": "drink.svg",
    "alt": "Illustration of a person lifting a tilted cup to drink",
    "blobSha": "6743239dfdfd349dced6a93596884a5e79b77e4b"
  },
  {
    "lexemeId": "吃|chi",
    "conceptId": "action.eat-food",
    "asset": "eat.svg",
    "alt": "Illustration of a person bringing food from a plate to their mouth",
    "blobSha": "77595b0ac4ed09d991efe413a73ce5f053c84b1a"
  },
  {
    "lexemeId": "大|da",
    "conceptId": "relation.larger-box",
    "asset": "big.svg",
    "alt": "Illustration of a large box beside a much smaller box",
    "blobSha": "44f8a0175b7188fbdd5c231b4833499bb7b0d20e"
  },
  {
    "lexemeId": "小|xiao",
    "conceptId": "relation.smaller-box",
    "asset": "small.svg",
    "alt": "Illustration of a small box beside a much larger box",
    "blobSha": "b4850f5f8ebd4013be2bcc6c9bbcdde0d8a61be9"
  },
  {
    "lexemeId": "人|ren",
    "conceptId": "person.standing",
    "asset": "person.svg",
    "alt": "Illustration of a single person standing",
    "blobSha": "b67c455529805f230b233e4c63952ae12e0f7da5"
  },
  {
    "lexemeId": "写|xie",
    "conceptId": "action.write-with-pencil",
    "asset": "write.svg",
    "alt": "Illustration of a pencil writing",
    "blobSha": "37de3defbea81b780ea6480f7d3e951905f15644"
  },
  {
    "lexemeId": "读|du",
    "conceptId": "action.read-book",
    "asset": "read.svg",
    "alt": "Illustration of a person reading",
    "blobSha": "479eff055d29031ebeac504ad6e47da6d464f2e9"
  },
  {
    "lexemeId": "商店|shangdian",
    "conceptId": "place.retail-shop",
    "asset": "shop.svg",
    "alt": "Illustration of a small shop with a striped awning and merchandise in its window",
    "blobSha": "c0acccd97c6b3d162f7e6812742f05a5a3e006cf"
  },
  {
    "lexemeId": "绿茶|lucha",
    "conceptId": "beverage.green-tea",
    "asset": "tea.svg",
    "alt": "Illustration of a cup of green tea",
    "blobSha": "e8a4dbdcecf372d4642c07445c1f88ef69b8a545"
  },
  {
    "lexemeId": "冬天|dongtian",
    "conceptId": "season.winter-snow",
    "asset": "winter.svg",
    "alt": "Illustration of a snowy winter landscape",
    "blobSha": "c1416bf9e24f65fbe557a15067a233900d608bba"
  }
].map(x=>Object.freeze(x)));
const byKey=new Map(CHINESE_LOCAL_VISUALS.map(x=>[x.lexemeId,x]));
export function localVocabularyImage({languageId,lexemeId,usage,assetBase='./visual-lexicon'}={}){
 if(languageId!=='chinese'||usage==='independent-recall'||!['introduction','reference','guided-practice'].includes(usage))return null;
 const value=byKey.get(lexemeId);
 if(!value)return null;
 const base=String(assetBase).trim().replace(/\/+$/,'');
 if(!/^(?:\/|\.\/)?[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(base))return null;
 return Object.freeze({src:base+'/assets/'+value.asset,alt:value.alt,conceptId:value.conceptId,
  width:320,height:240,loading:'lazy',decoding:'async'});
}
