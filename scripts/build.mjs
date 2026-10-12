import { mkdir, readdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'src'); const out = join(root,'dist');
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
