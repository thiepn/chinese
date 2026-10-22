/** Pinned read-only consumer subset of thiepn/languages@344d573564f188ba586f31bd690cad09e161d55e. */
export const C9_SHARED_VISUAL_CATALOG_SHA="344d573564f188ba586f31bd690cad09e161d55e";
export const C9_WORD_IMAGES=Object.freeze([
  {
    "key": "书|shu",
    "conceptId": "object.book",
    "file": "book.svg",
    "alt": "Illustration of a closed book",
    "blobSha": "cbb6d7d4f16af1c24a5d20dd053ef9b67e53f20b"
  },
  {
    "key": "水|shui",
    "conceptId": "beverage.water",
    "file": "water.svg",
    "alt": "Illustration of a glass of water",
    "blobSha": "eebaaec38dedc3a57bd143de819fc17e19d4c78f"
  },
  {
    "key": "喝|he",
    "conceptId": "action.drink-from-cup",
    "file": "drink.svg",
    "alt": "Illustration of a person lifting a tilted cup to drink",
    "blobSha": "6743239dfdfd349dced6a93596884a5e79b77e4b"
  },
  {
    "key": "吃|chi",
    "conceptId": "action.eat-food",
    "file": "eat.svg",
    "alt": "Illustration of a person bringing food from a plate to their mouth",
    "blobSha": "77595b0ac4ed09d991efe413a73ce5f053c84b1a"
  },
  {
    "key": "大|da",
    "conceptId": "relation.larger-box",
    "file": "big.svg",
    "alt": "Illustration of a large box beside a much smaller box",
    "blobSha": "44f8a0175b7188fbdd5c231b4833499bb7b0d20e"
  },
  {
    "key": "小|xiao",
    "conceptId": "relation.smaller-box",
    "file": "small.svg",
    "alt": "Illustration of a small box beside a much larger box",
    "blobSha": "b4850f5f8ebd4013be2bcc6c9bbcdde0d8a61be9"
  },
  {
    "key": "人|ren",
    "conceptId": "person.standing",
    "file": "person.svg",
    "alt": "Illustration of a single person standing",
    "blobSha": "b67c455529805f230b233e4c63952ae12e0f7da5"
  },
  {
    "key": "写|xie",
    "conceptId": "action.write-with-pencil",
    "file": "write.svg",
    "alt": "Illustration of a pencil writing",
    "blobSha": "37de3defbea81b780ea6480f7d3e951905f15644"
  },
  {
    "key": "读|du",
    "conceptId": "action.read-book",
    "file": "read.svg",
    "alt": "Illustration of a person reading",
    "blobSha": "479eff055d29031ebeac504ad6e47da6d464f2e9"
  },
  {
    "key": "商店|shangdian",
    "conceptId": "place.retail-shop",
    "file": "shop.svg",
    "alt": "Illustration of a small shop with a striped awning and merchandise in its window",
    "blobSha": "c0acccd97c6b3d162f7e6812742f05a5a3e006cf"
  },
  {
    "key": "绿茶|lucha",
    "conceptId": "beverage.green-tea",
    "file": "tea.svg",
    "alt": "Illustration of a cup of green tea",
    "blobSha": "e8a4dbdcecf372d4642c07445c1f88ef69b8a545"
  },
  {
    "key": "冬天|dongtian",
    "conceptId": "season.winter-snow",
    "file": "winter.svg",
    "alt": "Illustration of a snowy winter landscape",
    "blobSha": "c1416bf9e24f65fbe557a15067a233900d608bba"
  }
].map(row=>Object.freeze(row)));
const byWord=new Map(C9_WORD_IMAGES.map(row=>[row.key,row]));
export function c9VisualForWord(key){return byWord.get(key)??null;}
export function c9VisualMarkup(key,escape){
 const image=c9VisualForWord(key);
 if(!image)return "";
 return '<figure class="c9-vocab-visual"><img data-c9-visual="1" src="./visual-lexicon/assets/'+escape(image.file)+'" alt="'+escape(image.alt)+'" width="320" height="240" loading="lazy" decoding="async"></figure>';
}
if(typeof document!=="undefined"){
 document.addEventListener("error",event=>{
  const img=event.target;
  if(img?.nodeName==="IMG"&&img.hasAttribute("data-c9-visual"))img.closest(".c9-vocab-visual")?.remove();
 },true);
}
