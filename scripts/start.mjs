// Build-and-serve launcher. Guarantees the server only ever serves a dist/ that
// is verified against the current source tree: rebuild when stale, verify
// always, and never start the server after a failed build or verification.
// Usage: node scripts/start.mjs [--check-only]
//   --check-only  run freshness/build/verification, then exit without serving.
import { spawn } from 'node:child_process';
import { join,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distGateProblems } from './dist-gate.mjs';
const root=dirname(dirname(fileURLToPath(import.meta.url))),scripts=join(root,'scripts');

function runStep(script,args=[]){
 return new Promise(resolve=>{
  const child=spawn(process.execPath,[join(scripts,script),...args],{cwd:root,stdio:['inherit','pipe','pipe']});
  let output='';
  child.stdout.on('data',chunk=>{output+=chunk;process.stdout.write(chunk)});
  child.stderr.on('data',chunk=>{output+=chunk;process.stderr.write(chunk)});
  child.on('error',error=>resolve({code:-1,output:String(error)}));
  child.on('close',code=>resolve({code:code??-1,output}));
 });
}

function fail(step,code,output){
 console.error(`\n${step} failed (exit code ${code}). The server was NOT started.`);
 if(/esbuild|ERR_MODULE_NOT_FOUND|Cannot find package/i.test(output||''))
  console.error('The pinned build tooling appears to be missing. Run "npm install" once, then retry.');
 console.error('No learner data or saved progress is affected. Fix the error above and run "npm start" again.');
 return code||1;
}

const checkOnly=process.argv.includes('--check-only');
// Freshness first: a current, manifest-verified dist/ starts without a rebuild,
// keeping the documented dependency-free launch working. Anything stale or
// unverified is rebuilt before serving, and a failing build stops everything.
const problems=await distGateProblems({root});
if(problems.length){
 console.log('dist/ is stale or unverified; rebuilding before start.');
 for(const problem of problems)console.log(' - '+problem);
 const build=await runStep('build.mjs');
 if(build.code!==0)process.exit(fail('Build',build.code,build.output));
}
const verify=await runStep('verify.mjs');
if(verify.code!==0)process.exit(fail('Verification',verify.code,verify.output));
if(checkOnly){
 console.log('Check-only: build freshness and verification passed. Server not started.');
 process.exit(0);
}
const serve=await runStep('serve.mjs');
process.exit(serve.code);
