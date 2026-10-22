import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('service worker detects and repairs a URL-present but unusable static response',async()=>{
 const scope='http://127.0.0.1:4173/';
 const paths=['./','./index.html','./startup.mjs','./styles-startup.css','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
 const entries=new Map(paths.map(path=>[new URL(path,scope).href,{ok:true,type:'basic'}]));
 entries.set(new URL('./startup.mjs',scope).href,{ok:false,status:404,type:'basic'});
 const listeners=new Map();
 const cache={
  async match(url){return entries.get(typeof url==='string'?url:url.url)||undefined;},
  async add(path){entries.set(new URL(path,scope).href,{ok:true,type:'basic'});},
  async addAll(paths){for(const path of paths)await this.add(path);}
 };
 const service={location:{href:scope+'sw.js',origin:scope.slice(0,-1)},
  addEventListener(name,cb){listeners.set(name,cb);}};
 const src=readFileSync(new URL('../src/sw.js',import.meta.url),'utf8');
 vm.runInNewContext(src,{self:service,caches:{open:async()=>cache},URL,Set,Promise});
 async function status(type){
  return new Promise((resolve,reject)=>{
   const port={postMessage:resolve};
   listeners.get('message')({data:{type},ports:[port],waitUntil:p=>p.catch(reject)});
  });
 }
 const before=await status('c9-offline-status');
 assert.equal(before.cached,7);
 assert.equal(before.total,8);
 assert.equal(before.complete,false);
 const after=await status('c9-offline-repair');
 assert.equal(after.cached,8);
 assert.equal(after.complete,true);
 assert.equal((await cache.match(new URL('./startup.mjs',scope).href)).ok,true);
});
