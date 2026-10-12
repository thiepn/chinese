/** Batch 20: non-mutating comparison before any irreversible learner data replacement. */
import {importBackup} from './study-storage.mjs';
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
