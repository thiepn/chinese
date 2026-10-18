/** Transactional local-only learner data; browser storage is not permanent backup. */
import { freshState, validateState, upgradedState, STATE_VERSION } from './study.mjs';
const NAME='character-study-local-v2',STORE='learner';
export function openDatabase(){return new Promise((resolve,reject)=>{
 if(!globalThis.indexedDB)return reject(new Error('IndexedDB not available'));
 const req=indexedDB.open(NAME,1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
 req.onsuccess=()=>{const db=req.result;db.onversionchange=()=>db.close();resolve(db)};
 req.onerror=()=>reject(req.error||new Error('Unable to open learner storage'));
 req.onblocked=()=>reject(new Error('Database open blocked by another tab'));
});}
function transaction(db,mode,operation){return new Promise((resolve,reject)=>{
 let result;let tx;let failure=null;
 try {tx=db.transaction(STORE,mode);const store=tx.objectStore(STORE);operation(store,(value)=>{result=value},(cause)=>{failure=cause;store.transaction.abort()});
 tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(failure||tx.error||new Error('Save aborted'));tx.onerror=()=>reject(failure||tx.error||new Error('Save failed'));}
 catch(e){reject(e)}
});}
export async function readState(db){const raw=await transaction(db,'readonly',(store,finish)=>{const req=store.get('state');req.onsuccess=()=>finish(req.result)});if(!raw)return freshState();validateState(raw);return raw;}
export async function updateState(db,modifier){return transaction(db,'readwrite',(store,finish,fail)=>{
 const req=store.get('state');req.onsuccess=()=>{
  try {const current=req.result||freshState();validateState(current);const result=modifier(current);validateState(result);result.revision=current.revision+1;
    const put=store.put(result,'state');put.onsuccess=()=>finish(result);
  }catch(e){fail(e);}
 };});}
export async function replaceState(db,incoming,{expectedRevision}={}){validateState(incoming);return updateState(db,current=>{if(expectedRevision!==undefined&&current.revision!==expectedRevision)throw new Error('Local data changed after the backup preview; inspect the backup again');return upgradedState(incoming)||structuredClone({...incoming,version:STATE_VERSION});});}
export async function resetState(db){return updateState(db,_=>freshState());}
export function backupDocument(state){validateState(state);return {format:'character-study-demo-backup',formatVersion:1,createdAt:new Date().toISOString(),origin:'original-editorial-demo',learner:structuredClone(state)};}
export function importBackup(blob){if(!blob||blob.format!=='character-study-demo-backup'||blob.formatVersion!==1||blob.origin!=='original-editorial-demo')throw new Error('Unrecognized or incompatible backup');validateState(blob.learner);return blob.learner;}
