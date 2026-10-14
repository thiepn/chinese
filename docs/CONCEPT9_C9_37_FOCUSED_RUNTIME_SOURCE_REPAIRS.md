# C9-37 — Focused native navigation and offline runtime source repairs

## Exact stack
- Repository: `thiepn/chinese`.
- Verified parent: C9-36 draft PR #38, `fix/c9-36-release-blocking-runtime-visual-repairs`, exact SHA `7c05d32f8161ae24f5a64338a0535d96dadea917`.
- Child: `fix/c9-37-browser-acceptance-runtime-repairs` (stacked, not `main`).
- Original historical IDs, canonical review/grade writers, IndexedDB, P43 private JSON writer, and previous drafts are not replaced or merged.

## Confirmed defects repaired

1. **Service worker startup blocker:** the inherited C9-35 `src/sw.js` wrote `const known=()=>new Set((await cache.keys())...)` inside the status handler. `await` is illegal in a non-`async` arrow. Focused parsing of that exact parent script yielded `SyntaxError: Unexpected identifier 'cache'`. The helper is now `async`, and the updated worker passes a parser check. This is a direct service-worker installation blocker, not a hypothetical browser behavior. Bumped the existing single SW cache to v46.
2. **Resilient offline repair:** a failure in any `cache.addAll` repair batch previously aborted every later batch, blocking otherwise valid assets. Repair now salvages entries in the failed batch individually, continues subsequent bounded batches, and returns actual cache coverage plus failure status. Install remains strict (required assets must load before activation); repair touches only the static resource cache, never personal learning records.
3. **Direct-hash navigation protection:** Back/Forward and pasted `#/grammar/gXX`, `#/sentences/sent-XXX`, or `#/pathway/path-XX` links previously bypassed the unsent-answer guard when only the source ID changed. The handler now checks validated original IDs, confirms answer loss, restores the **entire previous hash** on refusal, and synchronizes the actual native selected source and unsubmitted exercise state after approved navigation. Character deep links also synchronize their original display lesson ID.
4. **Same-source reclicks:** reopening the active grammar lesson, character lesson, reading, dialogue or sentence previously reset session inputs, feedback or native lesson state. Same-source actions now keep their in-tab work and navigate/scroll as appropriate; genuinely different sources still obey the original input-loss confirmation.
5. **Sentence / pathway controllers:** selecting new original source IDs now validates existence and the native departure before clearing the typed sentence/pathway answer. Sentence-topic filters and pagination change only after approval, and search handoffs receive a real success/failure outcome.
6. **Unified discovery / return context:** the original global search formerly installed the new source-return trail and mutated advanced selections before knowing whether the native destination accepted the transition. It now opens the original native action first; only explicit success writes a new in-tab return trail. Previous search context survives rejected navigation. Original IDs, source indexes and native evaluation remain the only authorities.
7. **Course and dialogue continuity:** lesson selection/next/back and pathway Workshop transitions respect unsent answers. Home lesson, Home dialogue, reading crosslinks, Review starts and story practice entry now avoid premature state mutation on rejected route changes. Already-graded sentence, pathway and wordbook feedback no longer spuriously triggers an unsent-answer warning.

## File scope
- `src/app.mjs`: source-scoped navigation, direct hashes, discovery-return integrity, native answer guards and accurate outcomes.
- `src/sw.js`: fixed syntax blocker, v46 worker cache identity and partial offline repair.
- This file: implementation and qualification limitations.

## Focused checks actually performed
- GitHub PR #38 metadata matched exact source parent and draft status before separate branch creation.
- Original `src/sw.js` script failed a focused JavaScript parse (illegal non-async `await`); the changed script **passes** the same parser.
- The changed `src/app.mjs` parses after removing static ES-module import declarations for function-body syntax checking. This does not execute imports, render a browser DOM or validate native module loading.
- Source invariants inspected: exact rollback hash, input guards for original source identities, no premature discovery trail, strict original evaluation ownership, single worker version, and salvage of failed cache batches.
- Original `src/writing-c9.mjs` and `src/home-c9.mjs` were also source-parsed without changes.

## NOT_TESTED / release blockers
**No exact current-head Chrome/Playwright, mobile viewport render, screenshot, personal IndexedDB reload, native grade roundtrip, P43 private backup import/export roundtrip, SW install/actual Cache Storage, offline navigation, accessible keyboard/screen-reader or Mandarin device voice pass was obtained.**

Local Node 22 and Chromium are present, but `git ls-remote https://github.com/thiepn/chinese.git HEAD` fails with DNS error (`Could not resolve host: github.com`). No exact source archive is mounted. Running old tracked `dist/` would test the wrong app and is not acceptable.

On an exact local checkout, use the existing `scripts/c9_browser_acceptance.py` with `--expected-head` equal to the **C9-37** commit and only focused relevant checks. First verify boot and newly repaired service-worker registration, then grammar/sentence/pathway same-hash rejection, source trail and P43 cancellation, original Grade → IndexedDB persistence, user-triggered offline cache repair, and mobile/dark keyboard layout. Inspect genuine screenshots before a release decision.

**Qualification: SOURCE_PARSE_PASS and SOURCE_INSPECTED, NOT_RUNTIME_TESTED, NOT_BUILD_TESTED, NOT_DEVICE_TESTED, NOT_VISUALLY_VERIFIED, NOT_DEPLOYED.** No GitHub Actions, broad test suites, migrations, merges, deployments, production writes, credentials or paid services initiated.
