import { access, mkdir, readdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build as bundle } from 'esbuild';
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
// Audit every original source file, even though the production browser now
// needs only the bundled JS, combined CSS and essential shell resources.
const runtimeBlock=swSource.match(/const RUNTIME_ASSETS=\[([\s\S]*?)\];/)?.[1];
const runtimeAssets=[...runtimeBlock?.matchAll(/'(\.\/[^']*)'/g)||[]].map(x=>x[1]);
if(offlineAssets.length<300||new Set(offlineAssets).size!==offlineAssets.length)
 throw Error('Original curriculum/source inventory unexpectedly shrank');
if(new Set(runtimeAssets).size!==declaredCount||runtimeAssets.length!==declaredCount||
 !runtimeAssets.includes('./startup.mjs')||!runtimeAssets.includes('./styles-startup.css'))
 throw Error('Offline compiled runtime contract mismatch');
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
// Preserve every original source file and learner identity, but give production
// one tree-shaken/minified ESM entry and one CSS request instead of 269 modules
// and 24 render-blocking stylesheets. Source-only tests still import originals.
const sourceHtml=await readFile(join(src,'index.html'),'utf8');
const styleLinks=[...sourceHtml.matchAll(/<link rel="stylesheet" href="\.\/([^"]+\.css)">/g)].map(match=>match[1]);
if(styleLinks.length<20||new Set(styleLinks).size!==styleLinks.length)
 throw Error('Expected the original ordered C9 stylesheet declarations');
await bundle({
 entryPoints:[join(src,'app.mjs')],bundle:true,treeShaking:true,
 minify:true,platform:'browser',format:'esm',target:'es2022',
 outfile:join(out,'startup.mjs'),legalComments:'none',logLevel:'warning'
});
await bundle({
 stdin:{contents:styleLinks.map(name=>'@import "./'+name+'";').join('\n'),
  resolveDir:src,sourcefile:'startup.css',loader:'css'},
 bundle:true,minify:true,outfile:join(out,'styles-startup.css'),
 external:['*.png','*.svg','*.woff','*.woff2','*.jpg','*.webp'],
 logLevel:'warning'
});
const productionHtml=sourceHtml
 .replace(/^\s*<link rel="stylesheet" href="\.\/[^"]+\.css">\s*\n/gm,'')
 .replace('<script type="module" src="./app.mjs"></script>',
  '<link rel="stylesheet" href="./styles-startup.css">\n  <script type="module" src="./startup.mjs"></script>');
if(productionHtml===sourceHtml||productionHtml.includes('href="./styles.css"')||
 !productionHtml.includes('src="./startup.mjs"'))
 throw Error('Production HTML failed to switch to compiled startup assets');
await writeFile(join(out,'index.html'),productionHtml);
files.push('startup.mjs','styles-startup.css');
const hashes={};
for(const name of files.sort())hashes[name]=createHash('sha256').update(await readFile(join(out,name))).digest('hex');
await writeFile(join(root,'docs','DIST_SHA256.json'),JSON.stringify(hashes,null,2)+'\n');
console.log(`Built ${files.length} static assets in dist/. SHA-256 manifest: docs/DIST_SHA256.json`);
