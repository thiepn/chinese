# Character Study — Batch 19 consolidated implementation and verification

## Implementation

This is an isolated extension of Batch 18, not a new app. The source is fully provided under `src/` and the corresponding built assets under `dist/`.

- Introduced a pure unified learning-home model (`src/learning-hub.mjs`): choose a primary action among resumable learning sessions, due recall, unresolved errors and next new original lesson. The model does not write learner data, masteries, grades or session checkpoints.
- Replaced the sprawling Today hero and repeated promotions with a course-first workspace: one primary action, a four-activity daily workload, saved-work resume links, related reading and dialogue, action-oriented mistake repair and compact recommendations. Retained an expandable complete list of all established learning tools.
- Consolidated Learn's repeated promotional panels into one next-step card. Simplified excessive lesson footer buttons without removing the underlying destinations.
- Added a shared study-route shortcut bar for desktop secondary screens and a consolidated saved-session resume strip that avoids showing the current route's own checkpoint.
- Added original-text-only word, reading and dialogue connections (`src/context-continuity.mjs`) and surfaced word matches in lesson and vocabulary detail screens. These are exact written-form matches, not guaranteed sense equivalence.
- Removed duplicate desktop Study Plan/Plan navigation. Streamlined mobile navigation to the five high-use destinations; advanced tools are discoverable from Today and other relevant screens.
- Updated local service-worker cache from v18 to v19 to include both new modules; no extra API, accounts or remote content access.
- Maintained state version 1, older backup loading, existing histories, saved checkpoints, hint flags, full original content, and scheduler separation. No new persistent state required by this batch.

## Consolidated results

| Check | Actual result |
|---|---|
| Node regression tests | **285/285 PASS**; 0 failed |
| Source syntax | **PASS** (`node --check src/app.mjs`) |
| Local build | **PASS** (`npm run build`) |
| SHA-256 built assets | **51/51 PASS** (`npm run verify`) |
| Local server assets | **51/51 HTTP 200** |
| Missing HTTP resource | **404** |
| Zip archive integrity | To be recorded in package manifest after packaging |
| Live Chromium end-to-end interaction | **NOT TESTED**: prior localhost browser environment cannot complete navigation; no false acceptance claim |
| Browser IndexedDB persistence/reload | **NOT TESTED** |
| Service worker real offline reload | **NOT TESTED** |
| Screen-reader/physical mobile acceptance | **NOT TESTED** |

### Test adjustments

The initial consolidated run exposed five assertions pinned to the prior service-worker cache revision (including shorthand `working-v18` checks) and one UI-presence expectation for a recommendation panel. Tests now require **v19** while retaining cache/module checks. The recommendation panel was restored as a compact course recommendation feature rather than deleted. No test was removed or skipped. Final run passed all 285 tests.

### Evidence files

- `docs/BATCH19_TEST.log`
- `docs/BATCH19_BUILD.log`
- `docs/BATCH19_VERIFY.log`
- `docs/BATCH19_HTTP.json`
- `docs/BATCH19_SERVER.log`
- `docs/BATCH19_SOURCE_SHA256.json`
- `docs/BATCH19_RESULTS.json`
- `docs/DIST_SHA256.json`

Source revision SHA-256: `6a696422fe0f2ec4c3e262b1bb0d2de4b0d83d0fad7d47e3fbfde9f9108d455b` (documented tree-hash algorithm; no Git commit created).

## Remaining scope gates

- Original demonstration content only; official HSK inventories have **not** been imported, redistributed, verified or licensed.
- Linguistic and audio qualification, visual owner approval, full-browser accessibility and offline durability remain **OPEN/NOT TESTED**.
- Nothing was pushed, deployed or changed in remote repositories, credentials, DNS, production or learner accounts.
- Target: Batch 20 feature consolidation/freeze, then one dedicated end-to-end and editorial qualification stage.
