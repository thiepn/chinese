# C9-31 — Focused UI Verification and Targeted Recovery

## Exact ancestry / release boundaries

- Repository: `thiepn/chinese`.
- **Verified C9-30 parent:** stacked draft PR #32, `feature/c9-30-global-discovery-writing-portability`, exact head `5a1e429428f44f2e384c293bd026aa0e8f6d3712`.
- C9-31 child branch: `fix/c9-31-ui-integrity-recovery`, created directly at that parent SHA.
- The parent C9-30 branch and earlier C9-28/C9-29 drafts were left unchanged, as were `main`, production and all existing P-series branches.

## Findings and actual source improvements

### 1. Offline/PWA installation: confirmed duplicate entries

Focused inspection of `src/sw.js` discovered **321 path occurrences but only 314 distinct paths** in the combined precache manifest. Seven paths were duplicated: `./index.html` and each original `./p46-screen.mjs` through `./p51-screen.mjs`. Passing the same URL twice in one `Cache.addAll()` operation is an installation failure risk. This existed in the inherited C9-30 source and could prevent the new service worker from installing.

**Fix:** deduplicate all four existing manifest arrays with one `Set` before precaching. Preserve all required original assets. Precache in 24-request batches to avoid a single uncontrolled fan-out of >300 simultaneous fetches. Reject activation if an actual required asset is unavailable instead of claiming full offline readiness. Scope cache-first reads to the active version instead of searching all other named caches. Maintain the original `character-study-` version family and bump cache identity to v44.

**Targeted source verification:** GitHub tree inspection found **all 314 distinct precache asset paths exist** under `src/` and showed an untruncated repository tree. The static duplicates were enumerated from source. **No actual service-worker installation, network/device acceptance or offline navigation was executed.** File existence cannot establish HTTP response success, MIME validity or deployment correctness.

### 2. Skill Paths audio handoff: empty UI and misleading speaker claim

When an advanced source had no `DIALOGUES` source match and no `source.turns`, C9-29 presented a listening section that suggested source lines could be played but rendered no usable play controls. The device speech event handler also selected an empty list instead of the original source lines.

**Fix:** both the UI and the action now select the **same** exact source evidence: linked native dialogue lines first, actual authored turns second, and `c9AdvancedSourceLines(source)` third. If none exist, disclose that fact. Authored source-only lines are labeled **Source line**, not the fabricated speaker name “Speaker.” Browser voice remains a teaching aid and is never recorded or graded.

### 3. P43 private backup import: source validation and honest overwrite

C9-30 introduced user-controlled JSON export/import while retaining the single original P43 editing controller. Original parsing permitted `transferPhase:0` with an extraneous non-null `sourceId`, and accepted unclear or empty file candidates without source-specific explanation.

**Fix:** require `sourceId:null` when `transferPhase:0`, validate nonzero phase source strings strictly against the original `c9WritingLinkedUnit` historical mapping, and reject empty files. Treat a null/omitted snapshot comparison as **no comparison** rather than silently selecting the first snapshot. A pending import states the validated original unit ID, snapshot count, draft character count and what will be replaced, before any mutation. Original `P43_UNITS` and P48/P50/P51 linked contexts remain authoritative.

### 4. Keyboard/mobile writing recovery

Selecting a backup or encountering an import error caused the original file input to be destroyed by a rerender without returning keyboard focus. Confirm/cancel dialogs likewise could leave keyboard focus lost.

**Fix:** focus the explicitly labeled import confirmation or recoverable error after file selection; on cancel/confirm, restore focus to the original editor when visible or the P43 topic chooser. Give focused confirmation/error targets visible C9-focus-token outlines in light/dark themes and scroll margins for smaller devices. No new modal framework or duplicate control system was created.

### 5. Source search announcements

The existing canonical Find view is reused. Its results heading now reports the number of matching original sources in a small `role=status`, `aria-live=polite` region, instead of requiring assistive-technology users to scan all cards after filter or query changes. The authoritative `courseSearch` data and original search IDs are unchanged.

## Source files changed

- `src/sw.js`: unique source precache, bounded batches, active-cache scoping and cache v44.
- `src/skills-c9.mjs`: faithful reading-line fallback and no invented speaker.
- `src/app.mjs`: same-line playback selection as Skill Paths.
- `src/writing-c9.mjs`: backup-source validation, confirmation previews, keyboard focus.
- `src/styles-c9-writing.css`: mobile/error focus visibility and text overflow.
- `src/workspace-p30.mjs`: accessible search result count.
- `docs/CONCEPT9_C9_31_UI_TARGETED_RECOVERY.md`: this report.

## Authority and limitations

Unchanged: canonical historical P35–P51 IDs, `study.mjs`, `study-storage.mjs`, native IndexedDB learner records, word/grammar/story/dialogue/sentence event writers, due-card scheduling, native assessment, P43 in-tab authoring ownership, and manual user-owned backup format v1. No fake course completion, invented audio, external corpus, HSK accreditation, or extra data store.

**Verification status: TARGETED_SOURCE_REVIEW ONLY.** The parent SHA was confirmed, relevant source paths were inspected and the complete precache file-path set was compared with the repository tree. **NOT_BROWSER_TESTED, NOT_DEVICE_TESTED, NOT_BUILD_TESTED.** No browser screenshot or accessibility-device certification was available or claimed.

**Remaining limitations:** Runtime module resolution, actual service-worker installation and updates, dark-mode visual contrast, screen-reader focus behavior, download/import roundtrip, mobile/tablet overflow, network interruptions and hardware Mandarin voice still require hands-on acceptance. Browser history/manual-hash navigation is not universally blocked from discarding unsent typed native answers. P43 backups are manual; no autosave/cloud sync. Full original specialist P46–P51 internal multi-question controllers are not transplanted into Skill Paths.

**Resource constraints honored:** No full test suite, builds, typechecks, CI, broad audit, migration, merge, deployment, credentials or paid services initiated.
