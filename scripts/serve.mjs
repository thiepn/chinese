import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join,normalize,dirname,extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distGateProblems } from './dist-gate.mjs';
const root=dirname(dirname(fileURLToPath(import.meta.url))),dir=join(root,'dist');
// Refuse to serve a stale or unverified dist/. A fresh checkout that was never
// built, or a tree whose src/ advanced past its last build, must fail loudly
// with an actionable message instead of silently serving an outdated app.
const gateProblems=await distGateProblems({root});
if(gateProblems.length){
 console.error('Refusing to serve: dist/ is not a verified build of the current source.');
 for(const problem of gateProblems)console.error(' - '+problem);
 console.error('Run "npm run build" to rebuild dist/, then "npm start" again.');
 process.exit(1);
}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const rel=normalize(pathname).replace(/^[/\\]+/,'');
 if(rel.split(/[\\/]/).includes('..')){res.writeHead(403);res.end('Forbidden');return;}
 const file=join(dir,rel||'index.html');
 try {
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(data);
 } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not Found');}
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local-only: http://127.0.0.1:${port}/`));
