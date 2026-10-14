# Chinese C9-40 — Cache-first source release repair and exact-head acceptance blocker

## Verified stack
Parent: open/draft C9-39 PR #42, `fix/c9-39-source-routing-and-offline-repair`, exact commit `41d5c7767c7c18d2bea3ac18b825ae25558ccebc`. The separate stacked child is `fix/c9-40-exact-checkout-runtime-gate`.

## Exact checkout attempt, and honesty of verification
- Local container: `/usr/bin/git`, `/usr/bin/chromium`, Node 22 are present; `/mnt/data` has no matching source/ZIP.
- `git ls-remote https://github.com/thiepn/chinese.git HEAD` failed: `Could not resolve host: github.com`.
- Direct resolved-IP HTTPS also failed; the GitHub ZIP URL was unavailable to the download tool, and the browser-backed download route did not return a source archive.
- Connected GitHub API provided individual exact-head source files and the full Git tree for targeted static examination. This is **not** a runnable checkout. Historical `dist` was not substituted.
- Accordingly **NO genuine Chromium startup, mobile device viewport, screenshots, indexedDB grading/reload, P43 import/export, SW activation, offline reload, browser console or build PASS** is claimed.

## Demonstrated source defect: stale cache-first releases
C9-39 had edited `src/app.mjs`, `src/home-c9.mjs` and Home CSS but left the old `src/sw.js` cache namespace `character-study-working-v46-c9-partial-repair`. The worker is *cache-first* (`cache.match` before `fetch`); the unchanged service-worker revision lets an existing v46 cache return previous app/module/CSS bytes on page reload. A fresh source commit without a new worker cache is not equivalent to a fresh installed release. A complete `315/315` count alone cannot distinguish stale content from updated content. This release-blocking mismatch is provable from the exact source revision and service-worker behavior without claiming a live browser trace.

### Implementation
1. Updated the **single original** service-worker cache namespace to `character-study-working-v47-c9-40-source-revision`. This causes a new required-static-source installation and allows the original activation handler to remove the outdated `character-study-*` cache, with its strict install failure behavior retained.
2. Updated `src/app.mjs`'s original expected offline worker version to the same v47 identity; its strict `315`-asset protocol validation remains intact. Existing P43 private state, native grading, historical records, and learner-state ownership are unchanged.
3. Added narrowly scoped **pre-copy source contract checks** to the existing `scripts/build.mjs`, executed before its destructive `dist` cleanup. The script checks that the app's expected offline cache identity matches the worker's actual cache identity, that the four original literal static asset groups de-duplicate to the app's expected manifest count, and that each declared original offline asset exists in `src/` (the root `./` maps to `index.html`). Only after checking does it perform the original static copy and SHA-256 dist manifest creation. No additional bundler, second writer, generic auditing tool or build pipeline.
4. Old installed v46 clients must still **complete the v47 SW update and online reload** before current content is guaranteed; the existing C9-39 Home outdated-worker notice explains preservation of in-tab P43 writing before reload. No automatic private data import/export/reload is performed.

## Narrow source verification actually performed
- Parent PR metadata and SHA verified before creating the separate stacked branch.
- Fetched **exact parent** SW, app, original builder and recursive repository tree through authorized GitHub read operations.
- Parsed edited app code (after stripping ESM static imports), service-worker JS and builder's async function body (with static import and `import.meta` parser wrappers): **PASS**. These are syntax checks, not live application execution.
- Parsed the exact worker's four literal asset groups: **315 distinct URLs** after deduplication, expected count **315**, **zero** missing corresponding files in the exact parent Git tree, and exact v47 app/worker identity match.
- No tests, broad suites, CI, migrations, merges, deployments, credentials, paid resources, remote production or learner-data changes.

## Changed files
- `src/sw.js` — current cache revision v47; same 315 static assets and one source authority.
- `src/app.mjs` — matching expected worker cache version; same original learning/grade/storage behavior.
- `scripts/build.mjs` — pre-copy release contract / manifest / source-path validation.
- This file.

## Release disposition: HOLD
**PASS**: stack ancestry check, source syntax checks, static offline manifest coverage, app/worker revision agreement, and source-based stale cache identification.

**NOT_TESTED**: exact-head Chromium and mobile screenshots; JS module boot; real Review grade → IndexedDB → reload; original P43 private JSON roundtrip and cancellation; history/hash transitions and typed answers; actual service-worker registration and real offline fetch; real build and `dist` hashes; touch/keyboard/screen reader/dark layouts.

Next phase should prioritize a genuinely accessible full checkout and narrow original `scripts/c9_browser_acceptance.py` acceptance. Do not interpret this source repair as a release certification.
