# Chinese C9-33 — Practical Learner Flow & Offline Recovery

## Verified ancestry and boundaries

- Repository: `thiepn/chinese`
- Verified parent: C9-32 stacked **draft PR #34**, branch `fix/c9-32-functional-integration-runtime-recovery`, exact SHA `2f8d341115deef39664252c5c2571ed81548b6bb`
- Development child: `fix/c9-33-practical-flow-offline-recovery` (separate stacked draft PR targeting C9-32, never `main`)
- No original learner database or event-writer changes; `main`, production, C9-28–C9-32 draft PRs and prior P-series sources remain unchanged.

## Concrete original functional defects repaired

### Same-screen P43 original writing switches

The inherited `openC9WritingSource` discarded `currentRoute` and `render` from the native API. When the learner was **already in Writing Studio**, `requestC9Writing` incorrectly treated the source switch as a new route and called `go('writing')`, which rendered before `pending='switch'` was set. It could leave the learner without a visible overwrite prompt, despite an existing draft and snapshots.

The native wrapper now passes the existing API through unchanged so same-screen writing changes render the protected confirmation **after** the original P43 pending switch is created. Existing original draft, snapshots, original unit, source ownership and explicit confirmation remain authoritative. This is not a second composition controller.

### Correct source return and canceled navigation

Original Find/Advanced source banners no longer survive after the actual historical source selection is closed or changed: source identity must still match exactly. The `c9-integrate-return` action now **requests navigation before deleting** the discovery trail. If an original unsubmitted native answer blocks the departure, the trail and query context remain available. After a confirmed return, the original Search input is refocused; Learn returns to its own original discovery state.

### Private writing backup that works without downloads

The original P43 editor keeps its existing private local-file export/import **and adds**:

- A user-triggered **Copy private backup JSON** control with clear clipboard/browser failure reporting. The JSON is the *same original version-1 private P43 export format*, not a new record.
- An expandable, mobile-friendly **Paste private JSON** input. The learner chooses to validate that text using the *same existing* `parseC9WritingBackup` historical source/phase, size, schema and revisions checks used for file import.
- A separate original P43 overwrite preview and explicit confirmation before changing draft/unit/snapshot state. Failed imports report errors without altering the original composition. No autosave, remote transfer, new store or automatic clipboard reads.

The user must retain the exported file or copied JSON in a trusted private location. A successful copy call is not a confirmed external backup.

### Writing return links only after actual P43 ownership changes

C9-32 assigned Skill Paths return context before the original P43 source-switch confirmation. When a learner canceled replacement of an existing composition, this could leave a return link to the *incoming* source rather than the original current source.

C9-33 separately stages incoming return context, checks exact original `transferPhase`, `sourceId` and original P43 unit, then commits the new return link **only after the original P43 controller has actually switched**. Canceling the source change retains the prior return, and a successful confirmation updates the visible UI. Original authorial version snapshots and grades are unaffected.

### Offline/PWA readiness instead of silent registration

The existing `setupSW` previously logged a failed service-worker registration only to the console, leaving the Home page to suggest normal online/offline availability even where caching was not ready. C9-33 exposes narrowly factual client-side readiness:

- `checking`, `installing`, `ready`, `failed`, and `unsupported` display states.
- A controller-change listener and installation state notification, without a second caching engine or extra cache writes.
- Home and network status messages that distinguish *an active offline shell* from content/device workflows that are **not certified or browser-tested**. If the shell is not controlled, the learner is told to reconnect rather than being promised all original activities will work offline.
- `c9OfflineShell` is presentation-only and cannot affect learner-state authorization, IndexedDB, review grading or an original course-source identity.

Original C9-31 service-worker cache v44 and its source list are unchanged. No HTTP/network test or PWA installation acceptance occurred.

## Changed files

- `src/writing-c9.mjs` — correct route/callback preservation; private clipboard export and validated pasted backup.
- `src/app.mjs` — precise discovery source return; validated P43 link commitment/cancellation; visible service-worker readiness.
- `src/home-c9.mjs` — honest offline-shell status.
- `src/styles-c9-writing.css` — accessible, responsive pasted backup and focus styles in the existing editorial system.
- `docs/CONCEPT9_C9_33_PRACTICAL_LEARNER_FLOW_AND_OFFLINE_RECOVERY.md` — this source note.

All original historical IDs, `study.mjs`, `study-storage.mjs`, due scheduler, original story/dialogue/sentence/grammar and native assessment writers, IndexedDB structures, existing original P43 JSON format version and manual backup authority are unchanged.

## Verification and limitations

**TARGETED SOURCE INSPECTION ONLY. NOT_TESTED, NOT_BUILT, NOT_DEPLOYED.**

- Exact C9-32 parent SHA / branch / draft PR verified.
- Relevant source handoff, P43 callbacks, file validator, navigation guards and service-worker status paths inspected.
- No full test suites, browser/device tests, PWA install, manual downloads or clipboard/file roundtrip, visual acceptance, CI, audits, migrations, merges, deployments, credentials or paid services.
- Actual mobile/tablet file pickers, clipboard permissions, download availability, service-worker install and updates, screen-reader focus, dark mode contrast and offline availability remain unverified.
- Browser Back/Forward behavior still depends on platform history handling; protection is limited to original known typed-answer forms. The app still eagerly loads much of the original course; no unsupported speed claim.
- Original P46–P51 specialist multi-question controllers remain native authorities; Skill Paths provides guided content and handoffs rather than fabricating their assessments.
- P43 drafts are **in-tab only** unless the learner expressly exports and preserves a backup outside the app. Neither clipboard nor file export implies a saved cloud backup.
