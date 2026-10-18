/**
 * User-triggered, read-only device checks. This is not a migration, sync layer
 * or a claim that browser storage will survive device cleanup.
 */
export async function inspectLocalReadback(db, expectedRevision, readState) {
 if (!db) return Object.freeze({status:'unavailable', expectedRevision, actualRevision:null});
 try {
  const saved=await readState(db);
  const actualRevision=saved?.revision;
  if (!Number.isSafeInteger(actualRevision)||actualRevision<0)
   return Object.freeze({status:'error',expectedRevision,actualRevision:null});
  return Object.freeze({
   status:actualRevision===expectedRevision?'match':'changed',
   expectedRevision,actualRevision
  });
 } catch {
  // Never include learner records, error payloads or private source text here.
  return Object.freeze({status:'error',expectedRevision,actualRevision:null});
 }
}
export function offlineDeviceStatus(shell,coverage) {
 const count=coverage&&Number.isInteger(coverage.cached)&&
  Number.isInteger(coverage.total)?coverage.cached+' / '+coverage.total+' readable compiled assets':'No verified cache count';
 const messages={
  ready:'Current service worker reports all required compiled assets readable. Actual offline lessons still need a device reload test.',
  incomplete:'Some required compiled assets are missing or unusable. Reconnect and repair the cache before offline use.',
  outdated:'A previous version controls this tab. Reload online after saving any unfinished writing.',
  installing:'An offline installation or repair is in progress.',
  checking:'Offline content has not been verified yet.',
  unsupported:'This browser cannot confirm service-worker offline operation.',
  failed:'Offline installation failed. Do not rely on offline use.'
 };
 return Object.freeze({count,message:messages[shell]||messages.checking,ready:shell==='ready'});
}
export function renderDeviceReadiness({storageReady,revision,online,offlineShell,coverage,readback},action,esc) {
 const offline=offlineDeviceStatus(offlineShell,coverage);
 const storage=readback?.status==='match'?
  'Read-only IndexedDB check matched revision '+readback.actualRevision+'. No learner data was changed.':
  readback?.status==='changed'?
  'Saved revision '+readback.actualRevision+' differs from the displayed revision '+readback.expectedRevision+'. Another tab or a recent update may have changed the record. Reload before relying on this view.':
  readback?.status==='error'?
  'Local read-back failed. Do not assume learning progress was saved. Export a backup if possible.':
  readback?.status==='unavailable'?
  'Local IndexedDB is unavailable. Progress cannot be verified.':
  'Not checked on this device. A connected database alone does not prove a stored record can be read back.';
 return '<section id="c9-device-readiness" class="simple-panel c9-device-readiness" tabindex="-1" aria-labelledby="c9-device-readiness-title">'+
  '<h2 id="c9-device-readiness-title">Device readiness and recovery rehearsal</h2>'+
  '<p>Check this browser before relying on saved offline lessons. Checks are read-only; no lesson answer, review grade or draft is created.</p>'+
  '<div class="c9-device-grid">'+
  '<div><strong>Local learner record</strong><p id="c9-device-storage-result" role="status">'+esc(storage)+'</p>'+
  '<small>Displayed revision '+esc(revision)+' · '+(storageReady?'database connected':'database unavailable')+'</small></div>'+
  '<div><strong>Offline compiled files</strong><p id="c9-device-offline-status" role="status">'+esc(offline.message)+'</p>'+
  '<small id="c9-device-cache-count">'+esc(offline.count)+'</small></div></div>'+
  '<div class="button-row">'+action('c9-device-check','Read back local data and recheck offline files','button outline')+
  action('c9-offline-repair','Repair missing offline files (online only)','button outline',online?'':'disabled')+
  '</div>'+
  '<details class="c9-device-rehearsal"><summary>Physical-device acceptance steps (not automatically passed)</summary>'+
  '<ol><li>While online, export a JSON backup from this Settings page and store it outside the browser.</li>'+
  '<li>Complete a short original exercise, return here and run the read-back check.</li>'+
  '<li>Turn off Wi-Fi and mobile data, then reload the installed app. Confirm an original lesson and Review open without network access.</li>'+
  '<li>Reopen Settings and rerun the check. Verify that your recorded answer and revision are still present.</li>'+
  '<li>Restore connectivity. Test Mandarin speech separately; browser TTS voices are device-dependent.</li></ol>'+
  '<p>Offline cache coverage does not guarantee IndexedDB persistence, successful offline reload, screen-reader operation or certified Mandarin content. Do not clear browser data to perform this test.</p></details>'+
  '</section>';
}
