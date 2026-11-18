/** Exact Word Library keys, pinned to thiepn/languages@541159c3462960f9b2c2273598befc6f3dd2e322; not character headwords. */
export const C9_SHARED_VISUAL_CATALOG_SHA="541159c3462960f9b2c2273598befc6f3dd2e322";
export const C9_WORD_IMAGES=Object.freeze([
  {
    "key": "看书|kanshu",
    "conceptId": "action.read-book",
    "file": "read.svg",
    "alt": "Illustration of a person reading",
    "blobSha": "479eff055d29031ebeac504ad6e47da6d464f2e9"
  },
  {
    "key": "写字|xiezi",
    "conceptId": "action.write-with-pencil",
    "file": "write.svg",
    "alt": "Illustration of a pencil writing",
    "blobSha": "37de3defbea81b780ea6480f7d3e951905f15644"
  },
  {
    "key": "吃饭|chifan",
    "conceptId": "action.eat-food",
    "file": "eat.svg",
    "alt": "Illustration of a person bringing food from a plate to their mouth",
    "blobSha": "77595b0ac4ed09d991efe413a73ce5f053c84b1a"
  },
  {
    "key": "喝水|heshui",
    "conceptId": "action.drink-from-cup",
    "file": "drink.svg",
    "alt": "Illustration of a person lifting a tilted cup to drink",
    "blobSha": "6743239dfdfd349dced6a93596884a5e79b77e4b"
  },
  {
    "key": "水果|shuiguo",
    "conceptId": "food.mixed-fruit",
    "file": "fruit.svg",
    "alt": "Illustration of assorted fruit",
    "blobSha": "6528380fc8feaadd3baa7ad5417e80e18d0ecbff"
  },
  {
    "key": "汽车|qiche",
    "conceptId": "vehicle.car",
    "file": "car.svg",
    "alt": "Illustration of a compact car",
    "blobSha": "1e6171564d06042762904273c2d1beba55ace019"
  },
  {
    "key": "火车|huoche",
    "conceptId": "vehicle.train",
    "file": "train.svg",
    "alt": "Illustration of a passenger train",
    "blobSha": "6ef6b59b6bec5a088793a6cb13c6addc859a6b1a"
  },
  {
    "key": "飞机|feiji",
    "conceptId": "vehicle.airplane",
    "file": "airplane.svg",
    "alt": "Illustration of an airplane",
    "blobSha": "ecd03f74402a21a6e3bfc70f0c355cf7b1eac98e"
  },
  {
    "key": "学生|xuesheng",
    "conceptId": "person.student-with-book",
    "file": "student.svg",
    "alt": "Illustration of a student carrying a schoolbook",
    "blobSha": "14dc2b0419bb55fd2632c6912a5223f951726e50"
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
