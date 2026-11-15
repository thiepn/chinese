// C9 delivery gate — proves dist/ is a verified build of the current src/ tree
// before any server starts. The gate is pure file inspection (no bundler, no
// learner data) so it runs on every start, including dependency-free checkouts.
import { readFile,readdir } from 'node:fs/promises';
import { join,relative } from 'node:path';
import { createHash } from 'node:crypto';

async function collectFiles(dir,base=dir){
 const out=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const abs=join(dir,entry.name);
  if(entry.isDirectory())out.push(...await collectFiles(abs,base));
  else if(entry.isFile())out.push(relative(base,abs).replaceAll('\\','/'));
 }
 return out.sort();
}

// Hashes cover LF-normalized bytes so a checkout's line-ending translation
// (git autocrlf) cannot change them; binary files (NUL byte) hash raw.
export function normalizeBytes(buffer){
 return buffer.includes(0)?buffer:Buffer.from(buffer.toString('latin1').replace(/\r\n/g,'\n'),'latin1');
}
export function hashBytes(buffer){
 return createHash('sha256').update(normalizeBytes(buffer)).digest('hex');
}

// Digest of every source file name+content. A dist/ built from older source
// files cannot match this digest, so staleness is detected structurally.
export async function srcDigest(srcDir){
 const hash=createHash('sha256');
 for(const name of await collectFiles(srcDir)){
  hash.update(name);hash.update('\0');
  hash.update(normalizeBytes(await readFile(join(srcDir,name))));hash.update('\0');
 }
 return hash.digest('hex');
}

function cacheIdentity(text,what,problems){
 const cache=text.match(/^const CACHE='([^']+)';/m)?.[1];
 if(!cache)problems.push(`${what}: missing const CACHE identity`);
 return cache;
}

export async function distGateProblems({root}){
 const problems=[];
 const src=join(root,'src'),dist=join(root,'dist'),docs=join(root,'docs');
 // 1. dist/ must match the SHA-256 manifest recorded by the last build.
 let manifest;
 try{manifest=JSON.parse(await readFile(join(docs,'DIST_SHA256.json'),'utf8'));}
 catch{problems.push('docs/DIST_SHA256.json is missing or unreadable');manifest=null;}
 if(manifest){
  for(const [file,expected] of Object.entries(manifest)){
   try{
    const actual=hashBytes(await readFile(join(dist,file)));
    if(actual!==expected)problems.push(`dist/${file} does not match the build manifest`);
   }catch{problems.push(`dist/${file} is missing but listed in the build manifest`);}
  }
 }
 // 2. dist/ must have been built from the current source tree.
 let stamp;
 try{stamp=JSON.parse(await readFile(join(docs,'BUILD_STAMP.json'),'utf8'));}
 catch{problems.push('docs/BUILD_STAMP.json is missing or unreadable');stamp=null;}
 if(stamp){
  try{
   const digest=await srcDigest(src);
   if(stamp.srcDigest!==digest)problems.push('dist/ was built from older src/ files (source digest changed)');
  }catch{problems.push('src/ is unreadable; cannot confirm dist/ freshness');}
 }
 // 3. The served shell must be the compiled build, not a flat source copy.
 try{
  const html=await readFile(join(dist,'index.html'),'utf8');
  if(!html.includes('src="./startup.mjs"')||!html.includes('href="./styles-startup.css"'))
   problems.push('dist/index.html is not the compiled shell (startup.mjs / styles-startup.css missing)');
  if(html.includes('src="./app.mjs"')||html.includes('href="./styles.css"'))
   problems.push('dist/index.html still loads the pre-bundle app.mjs / styles.css');
 }catch{problems.push('dist/index.html is missing');}
 // 4. The service-worker cache identity must agree across dist and src, so a
 // cache-first worker can never pin an earlier app revision.
 try{
  const distSw=await readFile(join(dist,'sw.js'),'utf8');
  const srcSw=await readFile(join(src,'sw.js'),'utf8');
  const appSrc=await readFile(join(src,'app.mjs'),'utf8');
  const distCache=cacheIdentity(distSw,'dist/sw.js',problems);
  const srcCache=cacheIdentity(srcSw,'src/sw.js',problems);
  const expected=appSrc.match(/^const C9_EXPECTED_OFFLINE_CACHE='([^']+)';/m)?.[1];
  if(!expected)problems.push('src/app.mjs: missing C9_EXPECTED_OFFLINE_CACHE identity');
  if(distCache&&srcCache&&distCache!==srcCache)
   problems.push(`dist/sw.js cache identity '${distCache}' does not match src/sw.js '${srcCache}'`);
  if(distCache&&expected&&distCache!==expected)
   problems.push(`dist/sw.js cache identity '${distCache}' does not match the app contract '${expected}'`);
 }catch{problems.push('service-worker sources are unreadable');}
 return problems;
}
