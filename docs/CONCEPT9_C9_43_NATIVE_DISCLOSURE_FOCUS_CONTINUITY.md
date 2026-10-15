# C9-43 — Existing Native Disclosures and Keyboard Focus Continuity

## Stack
Exact verified parent: C9-42 open/draft PR #54 `design/c9-42-responsive-flow-source-repairs`, commit `d14693e19d961bef9ef5dd4997078ec28b7484e4`. This isolated stacked child is `fix/c9-43-original-ux-deeplink-handoff`. Previous branches, main, production and all original learner authorities are untouched.

## Executable/browser availability
An exact source checkout or archive is **not** mounted under `/mnt/data`. In the actual Node/Chromium container, `git ls-remote https://github.com/thiepn/chinese.git HEAD` fails: `Could not resolve host: github.com`. The authenticated connector provides source snapshots and Git objects but cannot supply a complete runnable checkout to this container. No different revision, old `dist`, fabricated screenshots, or production page was treated as the requested exact-head app.

## Actual original-source repair
C9-42 preserved the native `open` state and focused `summary` for only three recent C9-41 sections. The original learner has more native disclosures that undergo the same `root.innerHTML` replacement during a same-hash UI update:

- `.c9-learn-existing` — full original Learn utilities and character shelf;
- `.c9-assessment-extra` — original Review recommendations and tools (also one fluency recommendations section);
- `.c9-media-catalog` — original media/reading course browsing disclosure.

When the learner opens one of these original sections and a same-route render happens, the C9-42 whitelist omits it and recreates it closed. The corresponding keyboard-focused `<summary>` is also missed by `captureC9Focus`/ `restoreC9Focus` and focus can be lost.

**Implementation:** Define one canonical `C9_NATIVE_DISCLOSURE_CLASSES` list in the **existing** `accessibility-c9.mjs`, export and import it into the existing `app.mjs`, and use it for both the same-hash disclosure snapshot and summary focus restoration. Preserve all three pre-existing C9-42 entries while adding only these three source-confirmed original disclosures. No new component, route, store, handler, event writer, grade or source ID. State is only current DOM visibility/focus, never persisted, and no open state carries to a different hash.

Because this is an offline-first cache-first application and the app source has changed, update the **existing** `src/sw.js` and matching app expected version from v49 to `character-study-working-v50-c9-43-native-disclosure-continuity`. Preserve all 315 original required static assets and installed source paths.

## Actual source-scoped evidence
- **PASS:** Confirmed C9-42 PR #54 was open/draft at the exact named SHA before creating the child.
- **PASS (isolated syntax parse):** Modified application module, accessibility helper and service worker all parsed with static imports/exports stripped, not a genuine module load or build.
- **PASS (reproduced source behavior):** Extracted the exact parent/current disclosure snapshot expressions. Before: `c9-learn-existing`, `c9-assessment-extra`, `c9-media-catalog` all absent from same-hash open-state preservation. After: all three retained for the same hash; a changed hash retains none; the three original C9-42 entries remain.
- **PASS (focused source execution):** Mocked a focused `<summary>` separately for all three original classes. Original parent focus helper returns `recognized:false, restored:false`; edited helper returns `recognized:true, restored:true`. This is **not** browser keyboard acceptance.
- **PASS (source manifest):** v50 cache name agrees in application and worker; the worker declares 315 distinct URLs, all present in the exact parent Git tree, none invented.
- No broad CI, tests/builds, migrations, merges, deployments, paid services, credentials or production changes.

## Release/visual disposition: HOLD
**NOT_VISUALLY_VERIFIED, NOT_BROWSER_TESTED, NOT_BUILD_TESTED, NOT_DEVICE_TESTED, NOT_DARK_MODE_TESTED, NOT_ACCESSIBILITY_BROWSER_TESTED, NOT_OFFLINE_TESTED, NOT_STORAGE_TESTED, NOT_DEPLOYED.**

No real Chromium screenshots or computed visual metrics exist for 1440px, 768px, 390px or 320px; no real console, enlarged text, high-contrast, touch, Back/Forward, original Review grading to IndexedDB/reload, P43 private JSON/abort, or SW installation/offline navigation was run. Historical educational IDs, native grading, rights and P43 private writing are untouched. This source implementation does **not** complete visual QA or establish release readiness.

## Next gate
Obtain complete authenticated exact-current-head source checkout on an executable machine. Start the existing original app and inspect Chromium screenshots for desktop/tablet/mobile, light/dark/zoom. Exercise the old/new native disclosure summaries with keyboard and touch, verify same-hash updates and route transitions, then run focused learner-grade persistence, writing privacy, navigation and offline tests. Repair observed defects only.
