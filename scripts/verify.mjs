import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const dist=join(root,'dist');
const manifest=JSON.parse(await readFile(join(root,'docs/DIST_SHA256.json'),'utf8'));
for(const [file,expected] of Object.entries(manifest)){
 const actual=createHash('sha256').update(await readFile(join(dist,file))).digest('hex');
 if(expected!==actual)throw new Error(`Dist hash mismatch ${file}`);
}
// Source parity: the shipped build must not drift from src/. The committed
// dist/ was once 699 commits stale while every manifest check still passed.
async function walk(dir,rel=''){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name;if(e.isDirectory())out.push(...await walk(join(dir,e.name),r));else out.push(r);}return out;}
const srcRoot=join(root,'src');
const sourceFiles=await walk(srcRoot);
const sourceSet=new Set(sourceFiles);
const distFiles=new Set(await walk(dist));
const compiled=new Set(['startup.mjs','styles-startup.css']);
for(const rel of sourceFiles){
 if(!distFiles.has(rel))throw new Error(`Missing dist copy of src/${rel}; run npm run build`);
 if(rel==='index.html')continue; // the build rewrites the production shell
 const a=createHash('sha256').update(await readFile(join(srcRoot,rel))).digest('hex');
 const b=createHash('sha256').update(await readFile(join(dist,rel))).digest('hex');
 if(a!==b)throw new Error(`Stale dist copy of src/${rel}; run npm run build`);
}
for(const rel of distFiles)if(!sourceSet.has(rel)&&!compiled.has(rel))
 throw new Error(`Extra dist file without a source: ${rel}`);
const html=await readFile(join(dist,'index.html'),'utf8');
if(!html.includes('No official HSK corpus')&&!html.includes('No official HSK curriculum')){
 // Permit exact assertion in description, including lowercase form.
 if(!html.toLowerCase().includes('no official hsk corpus'))throw new Error('Missing official-content notice');
}
for(const req of ['href="#main"','aria-label="Primary mobile navigation"','id="app-content"'])if(!html.includes(req))throw new Error(`HTML structure missing ${req}`);
const sw=await readFile(join(dist,'sw.js'),'utf8');
for(const req of ['index.html','styles.css','app.mjs','demo-lessons.mjs','study.mjs','study-storage.mjs','manifest.webmanifest','startup.mjs','styles-startup.css'])if(!sw.includes(req))throw new Error(`Offline shell missing ${req}`);
if(!html.includes('src="./startup.mjs"')||!html.includes('href="./styles-startup.css"')||
 html.includes('src="./app.mjs"')||html.includes('href="./styles.css"'))
 throw new Error('Production HTML did not use compact JS/CSS entry points');
if((html.match(/rel="stylesheet"/g)||[]).length!==1)
 throw new Error('More than one render-blocking stylesheet in production');
const js=await readFile(join(dist,'startup.mjs'),'utf8');
const originalNames=(await readdir(join(root,'src'))).filter(name=>name.endsWith('.mjs'));
const sourceTotal=(await Promise.all(originalNames.map(name=>stat(join(root,'src',name))))).reduce((sum,meta)=>sum+meta.size,0);
if(js.length>=sourceTotal)
 throw new Error('Bundled JavaScript is not smaller than the original source modules');
const cssBytes=(await readFile(join(dist,'styles-startup.css'))).length;
console.log('Production startup: '+Math.round(js.length/1024)+' KiB JS and '+
 Math.round(cssBytes/1024)+' KiB CSS; original flat MJS source '+
 Math.round(sourceTotal/1024)+' KiB; one stylesheet and one script request');
if(DEMO_LESSONS.some(x=>x.officialHskLevel!==null))throw new Error('Demo content incorrectly claims HSK status');
if((await readdir(dist)).includes('node_modules'))throw new Error('External dependencies bundled');
console.log(`PASS: ${Object.keys(manifest).length} built assets verified, shell/offline guard present, ${DEMO_LESSONS.length} non-HSK demo lessons`);
