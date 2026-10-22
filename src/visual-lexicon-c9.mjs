// Local Chinese package consumer snapshot pinned to @thiepn/visual-lexicon 344d573564f188ba586f31bd690cad09e161d55e.
// Only the three original Chinese bindings that are also canonical WORDS/w.key records; no character-to-word aliases.
export const CHINESE_LOCAL_VISUALS=Object.freeze([
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
