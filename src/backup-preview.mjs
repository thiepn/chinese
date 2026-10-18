/** Batch 20: non-mutating comparison before any irreversible learner data replacement. */
import {importBackup,readState,backupDocument} from './study-storage.mjs';
import {recoverySnapshot} from './course-overview.mjs';
export const MAX_BACKUP_BYTES=8_000_000;

export function previewBackup(document,current,{bytes=0}={}){
 if(bytes>MAX_BACKUP_BYTES)throw new Error('Backup exceeds the 8 MB import limit');
 const incoming=importBackup(document); // performs existing full legacy v1 format and learner-state validation
 const previous=recoverySnapshot(current),next=recoverySnapshot(incoming);
 const losses=[];
 if(next.scheduledEvents<previous.scheduledEvents)losses.push('Some scheduled-review events would disappear.');
 if(next.supplementaryEvents<previous.supplementaryEvents)losses.push('Some supplementary learning observations would disappear.');
 if(next.learned<previous.learned)losses.push('Some introduced lessons would be removed.');
 if(previous.sessions.length)losses.push('The current unfinished sessions would be replaced.');
 if(next.wordbook<previous.wordbook)losses.push('Some saved vocabulary bookmarks would disappear.');
 if(next.bookmarks<previous.bookmarks)losses.push('Some saved reading bookmarks would disappear.');
 return {current:previous,incoming:next,warnings:losses,
  formatVersion:document.formatVersion,createdAt:typeof document.createdAt==='string'?document.createdAt:null,
  explicitReplacement:true,mode:'replace-not-merge'};
}
/** Never auto-merge, synthesize lost history, or alter grades when importing. */
export function restoreRequiresAcknowledgement(preview,typed){return Boolean(preview?.explicitReplacement&&typed==='REPLACE');}

/**
 * User-requested backups must reflect the latest COMMITTED IndexedDB state,
 * not a stale window snapshot. Never silently export an empty freshState when
 * storage is inaccessible. Caller owns the eventual download gesture.
 */
export async function exportSavedBackup(db,read=readState){
 if(!db)throw new Error('Local database unavailable; no backup was exported.');
 const saved=await read(db);
 return Object.freeze({document:backupDocument(saved),revision:saved.revision});
}
/** Import preview and replacement CAS must share a fresh stored baseline. */
export async function previewSavedBackup(db,document,options={},read=readState){
 if(!db)throw new Error('Local database unavailable; cannot preview a replacement.');
 const current=await read(db);
 const preview=previewBackup(document,current,options);
 return Object.freeze({preview,learner:importBackup(document)});
}
