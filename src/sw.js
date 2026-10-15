/* Offline app shell. No official HSK corpus, network API or third-party assets. */
const CACHE='character-study-working-v48-c9-41-visual-cohesion';
/* Explicit asset groups keep the offline install in step with C9 styles. */
const SHELL_ASSETS=[
  './',
  './index.html',
  './styles.css',
  './styles-p30.css',
  './styles-p31.css',
  './styles-p32.css',
  './styles-p33.css',
  './styles-p34.css',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const CONCEPT9_ASSETS=[
  './styles-c9.css',
  './styles-c9-shell.css',
  './shell-c9.mjs',
  './ui-c9.mjs',
  './styles-c9-home.css',
  './home-c9.mjs',
  './styles-c9-learn.css',
  './learn-hub-c9.mjs',
  './styles-c9-lesson.css',
  './lesson-c9.mjs',
  './styles-c9-character.css',
  './character-c9.mjs',
  './styles-c9-libraries.css',
  './libraries-c9.mjs',
  './styles-c9-review-practice.css',
  './review-practice-c9.mjs',
  './styles-c9-media.css',
  './media-c9.mjs',
  './styles-c9-utilities.css',
  './utilities-c9.mjs',
  './styles-c9-integration.css',
  './integration-c9.mjs',
  './navigation-c9.mjs',
  './advanced-c9.mjs',
  './styles-c9-advanced.css',
  './skills-c9.mjs',
  './styles-c9-skills.css',
  './writing-c9.mjs',
  './p46-screen.mjs',
  './p47-screen.mjs',
  './p48-screen.mjs',
  './p49-screen.mjs',
  './p50-screen.mjs',
  './p51-screen.mjs',
  './styles-c9-writing.css',
  './styles-c9-dark-parity.css',
  './styles-c9-mobile-accessibility.css',
  './accessibility-c9.mjs',
  './styles-c9-system.css'
];
const LEARNING_ASSETS=[
  './app.mjs',
  './workspace-coaching-p30.mjs',
  './workspace-p30.mjs',
  './p31-character-a.mjs',
  './p31-character-b.mjs',
  './p31-character-c.mjs',
  './p31-character-d.mjs',
  './p31-foundations.mjs',
  './p31-vocabulary-a.mjs',
  './p31-vocabulary-b.mjs',
  './p31-vocabulary.mjs',
  './p31-screen.mjs',
  './p32-grammar-a.mjs',
  './p32-grammar-b.mjs',
  './p32-sentences-a.mjs',
  './p32-sentences-b.mjs',
  './p32-learning.mjs',
  './p33-scenarios-a.mjs',
  './p33-scenarios-b.mjs',
  './p33-scenarios-c.mjs',
  './p33-scenarios-d.mjs',
  './p33-scenarios-e.mjs',
  './p33-branch-replies.mjs',
  './p33-scenarios.mjs',
  './p33-screen.mjs',
  './p34-content-a.mjs',
  './p34-content-b.mjs',
  './p34-content-c.mjs',
  './p34-content-d.mjs',
  './p34-content-e.mjs',
  './p34-course.mjs',
  './p34-screen.mjs',
  './demo-lessons.mjs',
  './vocabulary-expansion.mjs',
  './foundational-expansion.mjs',
  './study.mjs',
  './study-storage.mjs',
  './exercises.mjs',
  './stories.mjs',
  './lexicon.mjs',
  './reader-records.mjs',
  './practice-records.mjs',
  './drills.mjs',
  './insights.mjs',
  './lesson-guides.mjs',
  './guided-session.mjs',
  './recommendations.mjs',
  './placement.mjs',
  './learning-coach.mjs',
  './sentence-assessment.mjs',
  './context-lab.mjs',
  './dialogues.mjs',
  './wordbook-lab.mjs',
  './pathways.mjs',
  './review-strategy.mjs',
  './progress-diagnostics.mjs',
  './tone-coach.mjs',
  './pinyin-foundations.mjs',
  './pinyin-screen.mjs',
  './sense-lab.mjs',
  './sentence-workshop.mjs',
  './dialogue-missions.mjs',
  './connected-practice.mjs',
  './pronunciation-path.mjs',
  './context-links.mjs',
  './course-journey.mjs',
  './course-continuation.mjs',
  './learning-bridge.mjs',
  './sentence-ladder.mjs',
  './sense-contrast.mjs',
  './study-block.mjs',
  './block-coach.mjs',
  './context-trail.mjs',
  './fluency-studio.mjs',
  './daily-plan.mjs',
  './learning-hub.mjs',
  './context-continuity.mjs',
  './course-overview.mjs',
  './course-companion.mjs',
  './grammar-course-data-a.mjs',
  './grammar-course-data-b.mjs',
  './grammar-course.mjs',
  './grammar-screen.mjs',
  './sentence-corpus-a.mjs',
  './sentence-corpus-b.mjs',
  './sentence-variations.mjs',
  './sentence-library.mjs',
  './sentence-screen.mjs',
  './connected-reading-data-a.mjs',
  './connected-reading-data-b.mjs',
  './reading-paragraph-guides.mjs',
  './connected-reading-content.mjs',
  './reading-depth.mjs',
  './reading-depth-screen.mjs',
  './beginner-reading-a.mjs',
  './beginner-reading-b.mjs',
  './beginner-reading-content.mjs',
  './beginner-reading.mjs',
  './beginner-reading-screen.mjs',
  './pathway-data-a.mjs',
  './pathway-data-b.mjs',
  './pathway-data-c.mjs',
  './pathway-course.mjs',
  './pathway-screen.mjs',
  './backup-preview.mjs',
  './cross-lesson.mjs',
  './study-groups.mjs'
];
const ADVANCED_SOURCE_ASSETS=[
  './p35-character-a.mjs',
  './p35-character-b.mjs',
  './p35-character-c.mjs',
  './p35-character-d.mjs',
  './p35-example-a.mjs',
  './p35-example-b.mjs',
  './p35-foundations.mjs',
  './p35-screen.mjs',
  './p35-sentences.mjs',
  './p35-vocabulary.mjs',
  './p36-course.mjs',
  './p36-grammar-a.mjs',
  './p36-grammar-b.mjs',
  './p36-grammar-c.mjs',
  './p36-screen.mjs',
  './p36-sentences.mjs',
  './p37-scenarios.mjs',
  './p37-scenes-a.mjs',
  './p37-scenes-b.mjs',
  './p37-scenes-c.mjs',
  './p37-scenes-d.mjs',
  './p37-screen.mjs',
  './p38-extra-a.mjs',
  './p38-extra-b.mjs',
  './p38-fresh-a.mjs',
  './p38-fresh-b.mjs',
  './p38-fresh-c.mjs',
  './p38-inference.mjs',
  './p38-readings.mjs',
  './p38-screen.mjs',
  './p38-sentences.mjs',
  './p39-foundations.mjs',
  './p39-rows-a.mjs',
  './p39-rows-b.mjs',
  './p39-rows-c.mjs',
  './p39-rows-d.mjs',
  './p39-screen.mjs',
  './p40-course.mjs',
  './p40-grammar-a.mjs',
  './p40-grammar-b.mjs',
  './p40-grammar-c.mjs',
  './p40-screen.mjs',
  './p41-reading-a.mjs',
  './p41-reading-b.mjs',
  './p41-reading-c.mjs',
  './p41-reading-d.mjs',
  './p41-readings.mjs',
  './p41-screen.mjs',
  './p42-course.mjs',
  './p42-dialogues-a.mjs',
  './p42-dialogues-b.mjs',
  './p42-dialogues-c.mjs',
  './p42-screen.mjs',
  './p43-course.mjs',
  './p43-screen.mjs',
  './p43-writing-a.mjs',
  './p43-writing-b.mjs',
  './p43-writing-c.mjs',
  './p44-course.mjs',
  './p44-scenarios-a.mjs',
  './p44-scenarios-b.mjs',
  './p44-scenarios-c.mjs',
  './p44-screen.mjs',
  './p45-course.mjs',
  './p45-review.mjs',
  './p45-screen.mjs',
  './p45-transfer-a.mjs',
  './p45-transfer-b.mjs',
  './p45-transfer-c.mjs',
  './p46-chars-a.mjs',
  './p46-chars-b.mjs',
  './p46-chars-c.mjs',
  './p46-dialogues-a.mjs',
  './p46-dialogues-b.mjs',
  './p46-dialogues.mjs',
  './p46-foundations.mjs',
  './p46-grammar-source.mjs',
  './p46-grammar.mjs',
  './p46-readings-a.mjs',
  './p46-readings-b.mjs',
  './p46-readings.mjs',
  './p46-screen.mjs',
  './p47-character-a.mjs',
  './p47-character-b.mjs',
  './p47-character-c.mjs',
  './p47-character-d.mjs',
  './p47-dialogues-a.mjs',
  './p47-dialogues-b.mjs',
  './p47-dialogues.mjs',
  './p47-foundations.mjs',
  './p47-grammar-a.mjs',
  './p47-grammar-b.mjs',
  './p47-grammar.mjs',
  './p47-production-source.mjs',
  './p47-production.mjs',
  './p47-reading-a.mjs',
  './p47-reading-b.mjs',
  './p47-readings.mjs',
  './p47-screen.mjs',
  './p48-argument-source.mjs',
  './p48-arguments.mjs',
  './p48-dialogue-a.mjs',
  './p48-dialogue-b.mjs',
  './p48-dialogues.mjs',
  './p48-reading-a.mjs',
  './p48-reading-b.mjs',
  './p48-readings.mjs',
  './p48-screen.mjs',
  './p49-cases-a.mjs',
  './p49-cases-b.mjs',
  './p49-cases-c.mjs',
  './p49-course.mjs',
  './p49-review.mjs',
  './p49-screen.mjs',
  './p50-argument-source.mjs',
  './p50-arguments.mjs',
  './p50-character-a.mjs',
  './p50-character-b.mjs',
  './p50-character-c.mjs',
  './p50-dialogue-a.mjs',
  './p50-dialogue-b.mjs',
  './p50-dialogues.mjs',
  './p50-foundations.mjs',
  './p50-grammar-a.mjs',
  './p50-grammar-b.mjs',
  './p50-grammar.mjs',
  './p50-reading-a.mjs',
  './p50-reading-b.mjs',
  './p50-readings.mjs',
  './p50-screen.mjs',
  './p51-argument-source.mjs',
  './p51-arguments.mjs',
  './p51-char-a.mjs',
  './p51-char-b.mjs',
  './p51-char-c.mjs',
  './p51-char-d.mjs',
  './p51-dialogue-a.mjs',
  './p51-dialogue-b.mjs',
  './p51-dialogues.mjs',
  './p51-foundations.mjs',
  './p51-grammar-source.mjs',
  './p51-grammar.mjs',
  './p51-read-a.mjs',
  './p51-read-b.mjs',
  './p51-readings.mjs',
  './p51-screen.mjs',
  './styles-p35.css',
  './styles-p36.css',
  './styles-p37.css',
  './styles-p38.css',
  './styles-p39.css',
  './styles-p40.css',
  './styles-p41.css',
  './styles-p42.css',
  './styles-p43.css',
  './styles-p44.css',
  './styles-p45.css',
  './styles-p46.css',
  './styles-p47.css',
  './styles-p48.css',
  './styles-p49.css',
  './styles-p50.css',
  './styles-p51.css',
];
// C9-31: The C9-29 stage modules also occur in ADVANCED_SOURCE_ASSETS.
// Duplicate Request URLs make Cache.addAll() reject, preventing installation.
const ASSETS=[...new Set([...SHELL_ASSETS,...CONCEPT9_ASSETS,
 ...LEARNING_ASSETS,...ADVANCED_SOURCE_ASSETS])];
const PRECACHE_BATCH_SIZE=24;
/** A controlling SW is not proof that Cache Storage still contains all assets.
 * Only user-visible shell status is returned. Never send learner data.
 */
self.addEventListener('message',event=>{
 if(!['c9-offline-status','c9-offline-repair'].includes(event.data?.type)||
  !event.ports?.[0])return;
 const reply=event.ports[0];
 event.waitUntil((async()=>{
  let cached=0,failed=false;
  try{
   const cache=await caches.open(CACHE);
   const known=async()=>new Set((await cache.keys()).map(request=>request.url));
   if(event.data.type==='c9-offline-repair'){
    try{
     const entries=await known();
     const missing=ASSETS.filter(path=>!entries.has(new URL(path,self.location.href).href));
     // Repair is explicitly learner-triggered. One failed static asset must
     // not prevent the remaining originals from being prepared for offline use.
     for(let i=0;i<missing.length;i+=PRECACHE_BATCH_SIZE){
      const batch=missing.slice(i,i+PRECACHE_BATCH_SIZE);
      try{await cache.addAll(batch);}
      catch{
       // Cache.addAll failed as a group. Retry the original static URLs
       // individually; only an actual unsalvageable URL is a repair failure.
       // Batch-level rejection alone is not evidence of a missing URL.
       for(const path of batch){
        try{await cache.add(path);}catch{failed=true;}
       }
      }
     }
    }catch{failed=true;}
   }
   const keys=await known();
   cached=ASSETS.filter(path=>keys.has(new URL(path,self.location.href).href)).length;
  }catch{failed=true;}
  reply.postMessage({type:'c9-offline-status',version:CACHE,
   cached,total:ASSETS.length,complete:cached===ASSETS.length&&!failed,failed});
 })());
});
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Limit simultaneous requests while preserving all-or-nothing installation:
  // any unavailable *required* module must prevent claiming offline readiness.
  for(let i=0;i<ASSETS.length;i+=PRECACHE_BATCH_SIZE){
   await cache.addAll(ASSETS.slice(i,i+PRECACHE_BATCH_SIZE));
  }
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('character-study-')&&k!==CACHE)
   .map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Do not accidentally serve stale assets from another cache revision.
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try{
   const response=await fetch(event.request);
   return response;
  }catch(error){
   if(event.request.mode==='navigate')
    return await cache.match('./index.html')||Response.error();
   return Response.error();
  }
 })());
});
