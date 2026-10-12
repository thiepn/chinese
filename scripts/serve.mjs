import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join,normalize,dirname,extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url))),dir=join(root,'dist');
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
