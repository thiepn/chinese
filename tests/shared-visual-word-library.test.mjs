import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {WORDS} from '../src/lexicon.mjs';
import {C9_SHARED_VISUAL_CATALOG_SHA,C9_WORD_IMAGES,c9VisualForWord,c9VisualMarkup} from '../src/visual-lexicon-c9.mjs';
import {c9WordCatalogResults} from '../src/libraries-c9.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const act=(name,label,classes='',attrs='')=>'<button data-action="'+esc(name)+'" '+attrs+'>'+esc(label)+'</button>';
test('all 12 Chinese Word Library visuals are approved canonical keys with byte-identical original artwork',()=>{
 assert.equal(C9_SHARED_VISUAL_CATALOG_SHA,'541159c3462960f9b2c2273598befc6f3dd2e322');
 assert.equal(C9_WORD_IMAGES.length,12);
 assert.equal(new Set(C9_WORD_IMAGES.map(x=>x.key)).size,12);
 const indexed=new Set(WORDS.map(w=>w.key));
 for(const item of C9_WORD_IMAGES){
  assert.ok(indexed.has(item.key),'Original Word Library key '+item.key);
  assert.ok(/^[a-z0-9-]+\.svg$/.test(item.file));
  assert.ok(/^[a-z]+\.[a-z0-9-]+$/.test(item.conceptId));
  assert.ok(item.alt.length>10);
  const data=readFileSync(new URL('../src/visual-lexicon/assets/'+item.file,import.meta.url));
  const hash=createHash('sha1').update('blob '+data.length+String.fromCharCode(0)).update(data).digest('hex');
  assert.equal(hash,item.blobSha,item.key);
 }
 assert.equal(c9VisualForWord('苹果|pingguo'),null);
 assert.equal(c9VisualForWord('书|shu'),null);
});
test('native Word Library renders mapped images without removing words, data, or original actions',()=>{
 const state={bookmarkedWords:[],vocabularyIntroduced:[]};
 const html=c9WordCatalogResults(state,{query:'商店'},act,esc);
 assert.match(html,/lang="zh-Hans">商店<\/strong>/);
 assert.match(html,/src="\.\/visual-lexicon\/assets\/shop\.svg"/);
 assert.match(html,/data-action="c9-word-open"/);
 assert.match(html,/data-action="vocabulary-start"/);
 assert.match(html,/data-action="word-bookmark"/);
 assert.match(html,/loading="lazy"/);
 assert.match(html,/decoding="async"/);
 assert.equal(c9VisualMarkup('苹果|pingguo',esc),'');
 assert.match(c9VisualMarkup('喝水|heshui',esc),/alt="Illustration of a person lifting a tilted cup to drink"/);
 assert.deepEqual(state,{bookmarkedWords:[],vocabularyIntroduced:[]});
});
test('a failed optional image removes only its own figure, never the original source word',async()=>{
 const prior=globalThis.document;
 let handler;
 globalThis.document={addEventListener:(name,fn,capture)=>{if(name==='error'&&capture===true)handler=fn;}};
 try{
  await import('../src/visual-lexicon-c9.mjs?verify-image-error-handler');
  assert.equal(typeof handler,'function');
  let removed=0;
  handler({target:{nodeName:'IMG',hasAttribute:n=>n==='data-c9-visual',closest:()=>({remove:()=>removed++})}});
  assert.equal(removed,1);
  handler({target:{nodeName:'IMG',hasAttribute:()=>false,closest:()=>({remove:()=>removed++})}});
  assert.equal(removed,1);
 }finally{if(prior===undefined)delete globalThis.document;else globalThis.document=prior;}
});
test('source worker caches only visited vocabulary images with a twelve-image ceiling',async()=>{
 const listeners=new Map(),store=new Map();
 const origin='https://chinese.example.test';
 const shellURL=origin+'/index.html';
 store.set(shellURL,{ok:true,id:'shell'});
 let networkCalls=0,offline=false;
 const cache={
  match:async request=>store.get(request.url)||null,
  put:async(request,response)=>{store.set(request.url,response)},
  keys:async()=>[...store.keys()].map(url=>({url})),
  delete:async request=>store.delete(request.url)
 };
 const worker=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 const cacheTag=worker.match(/^const CACHE='([^']+)';/m)?.[1];
 assert.ok(cacheTag?.includes('shared-word-visuals'));
 assert.ok(app.includes("const C9_EXPECTED_OFFLINE_CACHE='"+cacheTag+"'"));
 runInNewContext(worker,{
  self:{location:{href:origin+'/sw.js',origin},addEventListener:(event,fn)=>listeners.set(event,fn)},
  caches:{open:async()=>cache,keys:async()=>[]},
  fetch:async request=>{networkCalls++;if(offline)throw Error('offline');return{ok:true,id:request.url,clone(){return{ok:true,id:this.id}}}},
  URL,Response:{error:()=>({ok:false})}
 });
 const fetchImage=async file=>{
  let work;
  listeners.get('fetch')({request:{url:origin+'/visual-lexicon/assets/'+file+'.svg',method:'GET',mode:'no-cors'},respondWith:p=>{work=p}});
  assert.ok(work);
  return work;
 };
 for(let i=0;i<14;i++)assert.equal((await fetchImage('sample-'+i)).ok,true);
 const images=()=>[...store.keys()].filter(url=>url.includes('/visual-lexicon/assets/'));
 assert.equal(images().length,12);
 assert.ok(store.has(shellURL),'Required offline shell is retained');
 const previousCalls=networkCalls;offline=true;
 assert.equal((await fetchImage('sample-13')).ok,true);
 assert.equal(networkCalls,previousCalls,'Previously viewed image served from cache offline');
 assert.equal((await fetchImage('sample-0')).ok,false,'Evicted image returns a harmless miss offline');
});
