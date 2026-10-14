import { access, mkdir, readdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'src'); const out = join(root,'dist');
// Check the actual offline contract before destroying or rewriting dist.
 // The cache-first worker otherwise serves an earlier app revision forever
 // if its CACHE identity was not advanced alongside the current source files.
const [appSource,swSource]=await Promise.all([
 readFile(join(src,'app.mjs'),'utf8'),readFile(join(src,'sw.js'),'utf8')
]);
const currentCache=swSource.match(/^const CACHE='([^']+)';/m)?.[1];
const expectedCache=appSource.match(/^const C9_EXPECTED_OFFLINE_CACHE='([^']+)';/m)?.[1];
const declaredCount=Number(appSource.match(/^const C9_EXPECTED_OFFLINE_ASSETS=(\d+);/m)?.[1]);
if(!currentCache||!expectedCache||currentCache!==expectedCache||
 !Number.isSafeInteger(declaredCount)||declaredCount<1)
 throw Error('Original offline release contract mismatch: app and service worker versions/count must agree.');
// Original v46/v47 worker sources specify four literal source-asset groups.
// Validate the contract and actual on-disk paths, not a stale dist hash.
const groups=['SHELL_ASSETS','CONCEPT9_ASSETS','LEARNING_ASSETS','ADVANCED_SOURCE_ASSETS'];
const paths=[];
for(const group of groups){
 const raw=swSource.match(new RegExp('const '+group+'=\\[([\\s\\S]*?)\\];'))?.[1];
 if(!raw)throw Error('Offline manifest group missing: '+group);
 paths.push(...[...raw.matchAll(/'(\.\/[^']*)'/g)].map(match=>match[1]));
}
const offlineAssets=[...new Set(paths)];
if(offlineAssets.length!==declaredCount)
 throw Error('Offline source manifest count changed; update the current application contract.');
await Promise.all(offlineAssets.map(path=>access(join(src,path==='./'?'index.html':path.slice(2)))
 .catch(()=>{throw Error('Required original offline asset missing: '+path);})));
// Once all source-level release constraints pass, materialize the build.
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const files=[];
async function copyDir(from,to){for(const entry of await readdir(from,{withFileTypes:true})){
 const source=join(from,entry.name),target=join(to,entry.name);
 if(entry.isDirectory()){await mkdir(target,{recursive:true});await copyDir(source,target);}
 else if(entry.isFile()){await copyFile(source,target);files.push(relative(out,target).replaceAll('\\','/'));}
}}
await copyDir(src,out);
const hashes={};
for(const name of files.sort())hashes[name]=createHash('sha256').update(await readFile(join(out,name))).digest('hex');
await writeFile(join(root,'docs','DIST_SHA256.json'),JSON.stringify(hashes,null,2)+'\n');
console.log(`Built ${files.length} static assets in dist/. SHA-256 manifest: docs/DIST_SHA256.json`);
