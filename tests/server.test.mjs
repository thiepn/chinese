import test from 'node:test';import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';import {createServer} from 'node:net';
const port=()=>new Promise(resolve=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
test('local dev server serves actual application and rejects missing routes',async()=>{
 const p=await port(),child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(p)},stdio:'ignore'});
 try{let res;for(let i=0;i<50;i++){try{res=await fetch(`http://127.0.0.1:${p}/`);break}catch{await new Promise(r=>setTimeout(r,40))}}
 assert.ok(res);assert.equal(res.status,200);assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
 const text=await res.text();assert.match(text,/Character Study/);assert.match(text,/No official HSK corpus/);
 for(const file of ['app.mjs','demo-lessons.mjs','study.mjs','study-storage.mjs','sw.js']){
 const r=await fetch(`http://127.0.0.1:${p}/${file}`);assert.equal(r.status,200,file)}
 assert.equal((await fetch(`http://127.0.0.1:${p}/missing.js`)).status,404);
 }finally{child.kill()}
});
