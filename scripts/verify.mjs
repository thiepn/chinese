import { readFile, readdir } from 'node:fs/promises';
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
const html=await readFile(join(dist,'index.html'),'utf8');
if(!html.includes('No official HSK corpus')&&!html.includes('No official HSK curriculum')){
 // Permit exact assertion in description, including lowercase form.
 if(!html.toLowerCase().includes('no official hsk corpus'))throw new Error('Missing official-content notice');
}
for(const req of ['href="#main"','aria-label="Primary mobile navigation"','id="app-content"'])if(!html.includes(req))throw new Error(`HTML structure missing ${req}`);
const sw=await readFile(join(dist,'sw.js'),'utf8');
for(const req of ['index.html','styles.css','app.mjs','demo-lessons.mjs','study.mjs','study-storage.mjs','manifest.webmanifest'])if(!sw.includes(req))throw new Error(`Offline shell missing ${req}`);
if(DEMO_LESSONS.some(x=>x.officialHskLevel!==null))throw new Error('Demo content incorrectly claims HSK status');
if((await readdir(dist)).includes('node_modules'))throw new Error('External dependencies bundled');
console.log(`PASS: ${Object.keys(manifest).length} built assets verified, shell/offline guard present, ${DEMO_LESSONS.length} non-HSK demo lessons`);
