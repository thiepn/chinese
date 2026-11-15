// Delivery-integrity regression suite (C9): a checkout can never silently serve
// an outdated dist/. Covers the serve gate, the build-and-serve launcher, build
// failure handling, the Windows launcher, and the contracted service-worker
// cache identity / bundled entry points of the produced build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp,mkdir,writeFile,readFile,copyFile,rm,cp } from 'node:fs/promises';
import { join,dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { srcDigest,hashBytes,distGateProblems } from '../scripts/dist-gate.mjs';
const repoRoot=dirname(dirname(fileURLToPath(import.meta.url)));

const run=(cmd,args,{cwd,env}={})=>new Promise(resolve=>{
 const child=spawn(cmd,args,{cwd,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});
 let stdout='',stderr='';
 child.stdout.on('data',d=>stdout+=d);
 child.stderr.on('data',d=>stderr+=d);
 child.on('error',error=>resolve({code:-1,stdout,stderr:String(error)}));
 child.on('close',code=>resolve({code:code??-1,stdout,stderr}));
});
const node=(args,opts)=>run(process.execPath,args,opts);
const freePort=()=>new Promise(resolve=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
const hasEsbuild=await import('esbuild').then(()=>true).catch(()=>false);

const STUB_BUILD=`import {appendFile} from 'node:fs/promises';import {join,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
await appendFile(join(root,'calls.log'),'build\\n');
console.log('stub build ran');
if(process.env.STUB_BUILD_FAIL){console.error(process.env.STUB_BUILD_FAIL);process.exit(1);}`;
const STUB_VERIFY=`import {appendFile} from 'node:fs/promises';import {join,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
await appendFile(join(root,'calls.log'),'verify\\n');
console.log('stub verify ran');
if(process.env.STUB_VERIFY_FAIL){console.error(process.env.STUB_VERIFY_FAIL);process.exit(1);}`;
const STUB_SERVE=`import {appendFile} from 'node:fs/promises';import {join,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
await appendFile(join(root,'calls.log'),'serve\\n');
console.log('stub serve started');`;

// Fixture root: real start.mjs + real dist-gate.mjs + stubbed build/verify/serve
// scripts + a fake source tree with a consistent (or deliberately stale) build.
async function makeFixture({staleStamp=false,realServe=false,realBuild=false,realVerify=false,realSrc=false,inRepo=false}={}){
 // Real build.mjs resolves the pinned esbuild from the repo's node_modules, so
 // those fixtures must live inside the repository tree.
 const root=await mkdtemp(inRepo?join(repoRoot,'tests','.tmp-fix-'):join(tmpdir(),'c9-delivery-'));
 for(const dir of ['scripts','src','dist','docs'])await mkdir(join(root,dir));
 await writeFile(join(root,'scripts','build.mjs'),realBuild?
  await readFile(join(repoRoot,'scripts','build.mjs'),'utf8'):STUB_BUILD);
 await writeFile(join(root,'scripts','verify.mjs'),realVerify?
  await readFile(join(repoRoot,'scripts','verify.mjs'),'utf8'):STUB_VERIFY);
 await writeFile(join(root,'scripts','serve.mjs'),realServe?
  await readFile(join(repoRoot,'scripts','serve.mjs'),'utf8'):STUB_SERVE);
 await copyFile(join(repoRoot,'scripts','start.mjs'),join(root,'scripts','start.mjs'));
 await copyFile(join(repoRoot,'scripts','dist-gate.mjs'),join(root,'scripts','dist-gate.mjs'));
 if(realSrc){
  // Full source-tree copy so the real build/verify pipeline runs unchanged.
  await rm(join(root,'src'),{recursive:true,force:true});
  await cp(join(repoRoot,'src'),join(root,'src'),{recursive:true});
 }else{
  await writeFile(join(root,'src','app.mjs'),"const C9_EXPECTED_OFFLINE_CACHE='test-cache-v1';\n");
  await writeFile(join(root,'src','sw.js'),"const CACHE='test-cache-v1';\n");
 }
 const distFiles={
  'index.html':'<link rel="stylesheet" href="./styles-startup.css">\n<script type="module" src="./startup.mjs"></script>\n',
  'startup.mjs':'console.log(1);','styles-startup.css':'body{}','sw.js':"const CACHE='test-cache-v1';\n"
 };
 const manifest={};
 for(const [name,body] of Object.entries(distFiles)){
  await writeFile(join(root,'dist',name),body);
  manifest[name]=hashBytes(Buffer.from(body));
 }
 await writeFile(join(root,'docs','DIST_SHA256.json'),JSON.stringify(manifest,null,2)+'\n');
 await writeFile(join(root,'docs','BUILD_STAMP.json'),JSON.stringify({
  cache:'test-cache-v1',srcDigest:staleStamp?'stale-digest':await srcDigest(join(root,'src'))
 },null,2)+'\n');
 return root;
}
const calls=async root=>{try{return await readFile(join(root,'calls.log'),'utf8')}catch{return ''}};

test('start.mjs rebuilds a stale checkout before serving',async()=>{
 const root=await makeFixture({staleStamp:true});
 try{
  const r=await node(['scripts/start.mjs'],{cwd:root});
  assert.equal(r.code,0,r.stderr);
  assert.equal(await calls(root),'build\nverify\nserve\n');
  assert.match(r.stdout,/stale or unverified/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('start.mjs refuses to start the server when the build fails',async()=>{
 const root=await makeFixture({staleStamp:true});
 try{
  const r=await node(['scripts/start.mjs'],{cwd:root,env:{STUB_BUILD_FAIL:'simulated build failure'}});
  assert.notEqual(r.code,0);
  assert.equal(await calls(root),'build\n');
  assert.match(r.stderr,/The server was NOT started/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('start.mjs names the missing install step when build tooling is absent',async()=>{
 const root=await makeFixture({staleStamp:true});
 try{
  const r=await node(['scripts/start.mjs'],{cwd:root,
   env:{STUB_BUILD_FAIL:"Could not resolve 'esbuild' (Cannot find package 'esbuild')"}});
  assert.notEqual(r.code,0);
  assert.match(r.stderr,/npm install/);
  assert.doesNotMatch(await calls(root),/serve/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('start.mjs never starts the server when verification fails',async()=>{
 const root=await makeFixture();
 try{
  const r=await node(['scripts/start.mjs'],{cwd:root,env:{STUB_VERIFY_FAIL:'simulated verify failure'}});
  assert.notEqual(r.code,0);
  assert.equal(await calls(root),'verify\n');
  assert.match(r.stderr,/The server was NOT started/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('start.mjs --check-only builds and verifies without serving',async()=>{
 const root=await makeFixture({staleStamp:true});
 try{
  const r=await node(['scripts/start.mjs','--check-only'],{cwd:root});
  assert.equal(r.code,0,r.stderr);
  assert.equal(await calls(root),'build\nverify\n');
  assert.match(r.stdout,/Check-only/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('serve.mjs refuses a dist/ that does not match its build manifest',async()=>{
 const root=await makeFixture({realServe:true});
 try{
  await writeFile(join(root,'dist','startup.mjs'),'console.log("tampered");');
  const r=await node(['scripts/serve.mjs'],{cwd:root,env:{PORT:String(await freePort())}});
  assert.equal(r.code,1);
  assert.match(r.stderr,/Refusing to serve/);
  assert.match(r.stderr,/npm run build/);
  assert.doesNotMatch(r.stdout,/Local-only/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('serve.mjs refuses a dist/ built from older source files',async()=>{
 const root=await makeFixture({realServe:true,staleStamp:true});
 try{
  const r=await node(['scripts/serve.mjs'],{cwd:root,env:{PORT:String(await freePort())}});
  assert.equal(r.code,1);
  assert.match(r.stderr,/Refusing to serve/);
  assert.match(r.stderr,/older src\/ files/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('serve.mjs serves a verified build and still rejects missing routes',async()=>{
 const root=await makeFixture({realServe:true});
 const p=await freePort();
 try{
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(p)},stdio:'ignore'});
  const exited=new Promise(resolve=>child.on('exit',resolve));
  try{
   let res;for(let i=0;i<50;i++){try{res=await fetch(`http://127.0.0.1:${p}/`);break}catch{await new Promise(r=>setTimeout(r,40))}}
   assert.ok(res);assert.equal(res.status,200);
   assert.match(await res.text(),/startup\.mjs/);
   assert.equal((await fetch(`http://127.0.0.1:${p}/missing.js`)).status,404);
  }finally{child.kill();await exited}
 }finally{await rm(root,{recursive:true,force:true})}
});

test('launchers route through the guarded build-and-serve start script',async()=>{
 const bat=await readFile(join(repoRoot,'run-windows.bat'),'utf8');
 assert.match(bat,/cd \/d "%~dp0"/);
 assert.match(bat,/scripts\\start\.mjs %\*/);
 const sh=await readFile(join(repoRoot,'run-mac-linux.sh'),'utf8');
 assert.match(sh,/scripts\/start\.mjs "\$@"/);
});

test('Windows launcher builds and verifies before serving from any directory',async t=>{
 if(process.platform!=='win32')return t.skip('Windows launcher requires win32');
 const root=await makeFixture({staleStamp:true});
 const elsewhere=await mkdtemp(join(tmpdir(),'c9-cwd-'));
 try{
  await copyFile(join(repoRoot,'run-windows.bat'),join(root,'run-windows.bat'));
  const r=await run('cmd.exe',['/c',join(root,'run-windows.bat'),'--check-only'],{cwd:elsewhere});
  assert.equal(r.code,0,r.stderr);
  assert.equal(await calls(root),'build\nverify\n');
  assert.match(r.stdout,/Check-only/);
 }finally{await rm(elsewhere,{recursive:true,force:true});await rm(root,{recursive:true,force:true})}
});

test('Windows launcher propagates a build failure without serving',async t=>{
 if(process.platform!=='win32')return t.skip('Windows launcher requires win32');
 const root=await makeFixture({staleStamp:true});
 try{
  await copyFile(join(repoRoot,'run-windows.bat'),join(root,'run-windows.bat'));
  const r=await run('cmd.exe',['/c',join(root,'run-windows.bat')],{cwd:root,
   env:{STUB_BUILD_FAIL:'simulated build failure'}});
  assert.notEqual(r.code,0);
  assert.doesNotMatch(await calls(root),/serve/);
  assert.match(r.stderr+r.stdout,/The server was NOT started/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('mac/linux launcher runs the guarded start script',async t=>{
 const probe=await run('sh',['-c','exit 0']);
 if(probe.code!==0)return t.skip('sh is not available on this platform');
 const root=await makeFixture({staleStamp:true});
 try{
  await copyFile(join(repoRoot,'run-mac-linux.sh'),join(root,'run-mac-linux.sh'));
  const r=await run('sh',[join(root,'run-mac-linux.sh'),'--check-only'],{cwd:root});
  assert.equal(r.code,0,r.stderr);
  assert.equal(await calls(root),'build\nverify\n');
 }finally{await rm(root,{recursive:true,force:true})}
});

test('committed dist/ is a verified build of the current source tree',async()=>{
 const problems=await distGateProblems({root:repoRoot});
 assert.deepEqual(problems,[],'dist/ is stale or unverified: '+problems.join('; '));
});

test('delivery hashes are line-ending invariant across checkouts',async()=>{
 assert.equal(hashBytes(Buffer.from('hǎo\r\nnǐ\r\n')),hashBytes(Buffer.from('hǎo\nnǐ\n')));
 const stamp=JSON.parse(await readFile(join(repoRoot,'docs','BUILD_STAMP.json'),'utf8'));
 // Recompute over LF bytes even though this checkout may materialize CRLF.
 assert.equal(stamp.srcDigest,await srcDigest(join(repoRoot,'src')));
});

test('build carries the contracted service-worker cache identity and bundled entry points',async()=>{
 const app=await readFile(join(repoRoot,'src','app.mjs'),'utf8');
 const srcSw=await readFile(join(repoRoot,'src','sw.js'),'utf8');
 const distSw=await readFile(join(repoRoot,'dist','sw.js'),'utf8');
 const html=await readFile(join(repoRoot,'dist','index.html'),'utf8');
 const expected=app.match(/^const C9_EXPECTED_OFFLINE_CACHE='([^']+)';/m)?.[1];
 const srcCache=srcSw.match(/^const CACHE='([^']+)';/m)?.[1];
 const distCache=distSw.match(/^const CACHE='([^']+)';/m)?.[1];
 assert.ok(expected,'app contract cache identity is missing');
 assert.equal(srcCache,expected,'src/sw.js cache identity drifted from the app contract');
 assert.equal(distCache,expected,'dist/sw.js cache identity drifted from the app contract');
 assert.match(html,/src="\.\/startup\.mjs"/);
 assert.match(html,/href="\.\/styles-startup\.css"/);
 assert.doesNotMatch(html,/src="\.\/app\.mjs"/);
 assert.doesNotMatch(html,/href="\.\/styles\.css"/);
});

test('real build and verification reproduce a fresh dist/',async t=>{
 if(!hasEsbuild)return t.skip('pinned build tooling (esbuild) is not installed');
 // Isolated fixture with the full real source tree: the real build/verify
 // pipeline must produce a dist/ that passes the gate with the contracted
 // service-worker cache identity and bundled entry points.
 const root=await makeFixture({realBuild:true,realVerify:true,realSrc:true,inRepo:true});
 try{
  const build=await node(['scripts/build.mjs'],{cwd:root});
  assert.equal(build.code,0,build.stderr);
  const verify=await node(['scripts/verify.mjs'],{cwd:root});
  assert.equal(verify.code,0,verify.stderr);
  assert.deepEqual(await distGateProblems({root}),[]);
  const app=await readFile(join(root,'src','app.mjs'),'utf8');
  const distSw=await readFile(join(root,'dist','sw.js'),'utf8');
  const html=await readFile(join(root,'dist','index.html'),'utf8');
  const expected=app.match(/^const C9_EXPECTED_OFFLINE_CACHE='([^']+)';/m)?.[1];
  assert.equal(distSw.match(/^const CACHE='([^']+)';/m)?.[1],expected);
  assert.match(html,/src="\.\/startup\.mjs"/);
  assert.match(html,/href="\.\/styles-startup\.css"/);
 }finally{await rm(root,{recursive:true,force:true})}
});

test('real build failure stops the launcher before serving',async t=>{
 if(!hasEsbuild)return t.skip('pinned build tooling (esbuild) is not installed');
 // Real build.mjs against a source tree whose offline contract is broken.
 const root=await makeFixture({staleStamp:true,realBuild:true,inRepo:true});
 try{
  await writeFile(join(root,'src','app.mjs'),"const C9_EXPECTED_OFFLINE_CACHE='other-cache-v2';\n");
  const r=await node(['scripts/start.mjs'],{cwd:root});
  assert.notEqual(r.code,0);
  assert.match(r.stderr,/The server was NOT started/);
  assert.doesNotMatch(await calls(root),/serve/);
 }finally{await rm(root,{recursive:true,force:true})}
});
