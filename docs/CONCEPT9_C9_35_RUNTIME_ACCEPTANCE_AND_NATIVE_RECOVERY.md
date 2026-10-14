# C9-35 — Focused Runtime Acceptance & Remaining Functional Repairs

## Exact ancestry / limits
- Repo: `thiepn/chinese`.
- Exact verified parent: C9-34 stacked draft PR **#36**, branch `fix/c9-34-learner-runtime-release-readiness`, SHA `7fc44e05fa4a378375ca462e5233cf96b6ce702a`.
- Child branch: `fix/c9-35-runtime-acceptance-native-repairs`, stacked **on that branch**, not `main`.
- Original P-series source IDs, native `study.mjs`, `study-storage.mjs`, learner state/IndexedDB, due-review and grading event writers are untouched. No CI, broad suite, migration, merge or deployment.

## Practical source improvements

### 1. Native lesson / story / dialogue / workshop handoff integrity
A successful navigation into a new native source is a separate event from merely clicking a source link. Previously certain C9 Skill Paths, Advanced Course and P43 writing actions installed a source-return link **before** discovering that the original native controller had rejected a source change due to an unsent response.

- `openGrammarLesson` now checks the real native grammar answer and destination before changing `grammarSelected`, resetting the session or writing a grammar hash.
- Native reading, character lesson and dialogue actions now return an explicit Boolean success/decline; dialogue changes also check for outstanding same-screen native input before resetting conversational state.
- `c9-skills-native` and `c9-advanced-native` execute real original native actions, confirm the precise valid source ID, then establish the in-tab return link; they do not fabricate successful navigation.
- Original skill-level wordbook/grammar shortcuts also establish their return links only after a successful native action.
- The original P43 reader/dialogue/assessment links similarly establish return context only after success. Original P43 → Sentence Workshop now returns success/failure and confirms the destination **before** mutating its existing native task state. Rejected activities leave original drafts, original native inputs and source returns alone.
- Native grading remains exclusively in the existing original action/event writers; no completion is manufactured.

### 2. Offline/PWA source integrity and explicit repair
A controlling service worker is insufficient evidence that its browser cache still contains the original curriculum files: browsers can evict assets, and an older controller may not understand the current manifest. The C9-34 user-facing label merely stated offline shell active.

C9-35 adds a read-only service-worker `MessageChannel` status reporting `cached`, `total`, cache version and completeness for the same existing unique static `ASSETS` precache manifest. It checks Cache Storage request keys, not learner-state records. `ready` is only shown after a **positive reply** showing all required static assets present. Old/unresponsive worker versions stay `checking`, missing entries report `incomplete`.

The original Home interface now provides **Prepare missing offline assets** when online and cache coverage is missing/unconfirmed. A user-initiated message instructs the same worker to download **only missing** manifest paths in the original bounded precache batches. Partial failures report actual remaining coverage and do not claim full offline availability. The cache name advances to v45; the original SW install/fetch behavior and original app-scoped Cache Storage remain in use.

**Scope limitation:** This confirms the presence of the static source request URLs in Cache Storage, not device-level correctness of HTTP content, Mandarin voice, IndexedDB durability, user account state or every offline learning activity. No private learner data, progress events, account records or writing drafts are transmitted through this worker messaging. There is no remote service, cloud backup, telemetry or second learning store.

### 3. Responsive / keyboard controls
The recovery action retains the original flat C9 editorial button, focus-visible outline and at least 44px target height. It stacks on narrow screens. No theme redesign, modal framework or alternate navigation engine.

### 4. Original progress continuity
Original reader, dialogue, sentence and review events stay authoritative. Skill Paths reads original records only; it does not append event rows for merely viewing source text. The existing private P43 JSON file/clipboard export and import remain version 1 and still share the same strict source/phase/revision validator. No silent autosave or new progress store.

## Source files changed
- `src/app.mjs` — native handoff outcomes and transaction order; verified cache status and owner-requested repair.
- `src/writing-c9.mjs` — P43 native source return only after successful original activity.
- `src/sw.js` — v45 manifest status and user-triggered missing-static-asset repair.
- `src/home-c9.mjs` — accurate readiness and explicit recovery action.
- `src/styles-c9-home.css` — responsive and keyboard-accessible recovery UI.
- `docs/CONCEPT9_C9_35_RUNTIME_ACCEPTANCE_AND_NATIVE_RECOVERY.md` — this implementation record.

## Focused verification evidence (source-only)
- Confirmed the exact PR #36 head and parent branch SHA before branch creation.
- Confirmed the repository's recursive tree is untruncated and **all 314 unique offline manifest asset paths** (321 literal references before `Set` deduplication) exist under `src/`. Literal duplicate entries are intentional consequences of asset groups; the final `ASSETS` array deduplicates them.
- Inspected original `validateDialogueEvents` and `validateSentenceEvents` ownership of true `correct`/`assisted` evidence.
- Focused source-level invariants confirmed explicit cache completeness, missing-asset-only repair, route-source commit after successful native action, shared P43 JSON backup validator and lack of learner-state references in the service-worker message handler.
- **No browser runtime, Android/tablet UI, screen reader, Cache Storage quota/eviction simulation, PWA update, actual asset fetch, offline navigation, original session roundtrip or clipboard/download test was executed.** This is **SOURCE_CHECKED**, **NOT_RUNTIME_TESTED**, **NOT_BUILD_TESTED**, **NOT_DEPLOYED**.

## Remaining limitations
- Browser Cache Storage may be subject to quota eviction; a user-requested repair can fail mid-batch and will report incomplete, not readiness.
- An earlier controlling service worker without the new status contract cannot be positively verified until the versioned update controls the page.
- Some source-only specialist stages have no mapped native graded activity; no new grade is invented.
- Original P43 drafts remain in-tab until manually exported; user-owned clipboard/download backups still require care.
- Keyboard focus, contrast, voice availability and responsive layout need actual device checks.
- No CI, broad test suites, audits, migrations, merges, deployments, production writes, credentials or paid services were initiated.
