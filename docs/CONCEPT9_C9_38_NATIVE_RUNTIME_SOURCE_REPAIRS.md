# Chinese C9-38 — Focused runtime-source recovery and release blockers

## Exact ancestry
- Exact parent verified via GitHub draft PR #39 (`fix/c9-37-browser-acceptance-runtime-repairs`): `d1e3bfb9e96c28ad575d4a22763eeed633cac857`.
- Child development branch: `fix/c9-38-native-workspace-recovery`.
- No modification of `main`, earlier PR branches, learner production data, GitHub Actions, integrations, deployments or remote credentials.

## Concrete defects repaired in the original application

### Native Review grading, single event / single queue progression
In inherited `src/app.mjs`, `mutate(...)` *always* rendered immediately after the original `gradeCard` IndexedDB transaction. The source's `renderReview()` removes no-longer-due cards and clears `checkResult` before the awaiting grade action resumed. This mistakenly incremented `reviewInvalidated` and prevented `sessionCorrect` from incrementing, even when the correct answer had actually been submitted. 

C9-38 adds an opt-in `{renderAfter:false}` to the **existing** mutation adapter **only** for `grade`. After an authoritative successful native `gradeCard` save, the handler advances the local queue once, increments its correct count using the captured assessment and renders once. Rejected/failed saves do not advance anything. No new event writer, grading evaluator, due calculation, queue store or SRS engine.

The inherited source action and repaired source action were each executed in an isolated in-memory synthetic JavaScript harness. Both left next cards `[b,c]` (no actual next-card skip): inherited incorrectly yielded `correct=0, invalidated=1, renders=2`; repaired yielded `correct=1, invalidated=0, renders=1`. This is **synthetic source behavior**, **not** live IndexedDB/browser proof.

### Interruption-safe native Review pause
The original `review-pause` unconditionally cleared typed text, selected choice, reveal and assessment state without a discard confirmation. Pause now preserves the ungraded answer and original Review prompt in memory; resume continues the same canonical due-only queue. Stop/discard stays explicitly confirmed. No fabricated grade is awarded.

### Original source transitions and answer preservation
- One existing original-native Workshop destination adapter validates task indexes, asks before discarding typed answers on same-route task changes, and changes only in-tab task controls after a successful departure. It is now reused by P32 repair, P33 original dialogue writing, P34 original listening-to-writing and P43 original composition handoffs.
- P33 source opening delegates to the original `c9-media-open-dialogue` authority rather than changing dialogue ID, mission progress and help state before route acceptance. P33 Browse resets filters only after a successful source opening.
- P34 original reading and listening source actions now explicitly guard same-route changes and retain unfinished native answers. Reopening the same source does not reset its session.
- P32 original sentence source selector and P31 original lesson/library handoffs protect active learner responses before changing source, filter or UI detail state.
- The original global `go()` same-route behavior was preserved to avoid breaking legacy render actions; newly introduced task/source adapters themselves decide when to avoid a destructive reset.

### P43 private JSON recovery
Previously, invalid pasted private P43 JSON triggered a re-render that discarded the pasted textarea's contents and collapsed its disclosure. The original strict `parseC9WritingBackup` validator is unchanged. C9-38 keeps the pasted JSON **only in the existing tab-local P43 presentation state**, safely escapes it back into the textarea, reopens the disclosure after an error, and clears it on original source reset/confirmed replacement. No IndexedDB, upload, persistent storage, account integration, background save, second essay engine, or silent import was added. Confirmation remains mandatory before replacing current writing.

### Offline static Cache Storage
The existing v46 single service worker, strict required-asset installation and user-requested batch repair remain. If a batch's `cache.addAll` rejects but each original static URL succeeds on individual retry, reporting now correctly marks **complete** only from the verified coverage and actual per-URL failure, rather than indefinitely carrying an error from the recovered batch. Individual failed resources still produce `failed=true` and `complete=false`.

## Evidence actually obtained
1. GitHub verified the exact draft parent before child creation; development changes are isolated to this child branch.
2. Local `git ls-remote https://github.com/thiepn/chinese.git HEAD` failed with `Could not resolve host: github.com`. No exact source checkout could be obtained for local Chromium, despite the Chromium binary and Node being installed.
3. Focused JavaScript parsing: edited `src/app.mjs` and `src/writing-c9.mjs` after removing static imports/exports (syntactic function-body check), and edited `src/sw.js` source — all **PASS**. These are not module/DOM/browser runtime passes.
4. GitHub verified **315 distinct declared SW assets** and **zero missing paths** in the exact parent repository tree. This is path existence only, not HTTP fetching or cache installation.
5. The original SW message handler was executed against an isolated **mock Cache Storage**, not an actual browser. A rejected `addAll` batch with successful individual salvage recovered **315/315**, `complete=true,failed=false`. A permanently missing `./app.mjs` recovered **314/315**, `complete=false,failed=true`, while later batches continued. This demonstrates source logic under mocks only.
6. Isolated synthetic native-grade exercise proved the specific correctness/invalidation counter defect and its repair as above. Neither exercise performs a real learner database write.

## NOT_TESTED and release blockers
- **NOT_BROWSER_TESTED:** exact-head Chromium startup, actual script/module loading, JavaScript console and genuine screenshot inspection.
- **NOT_BUILD_TESTED:** no exact source tree available to build or serve. Never substitute historic `dist/`.
- **NOT_DEVICE_TESTED:** mobile/touch/keyboard/screen-reader/dark layout, real Mandarin speech.
- **NOT_STORAGE_TESTED:** true native Review `gradeCard` → IndexedDB → reload/rejoin; original P43 JSON file/clipboard roundtrip and actual confirmation cancellation.
- **NOT_OFFLINE_TESTED:** real service-worker registration/activation, offline reload and static cache responses.
- **NOT_DEPLOYED:** neither production nor any other deployment changed.

The next release gate must obtain an exact current-head checkout, perform **narrow** `scripts/c9_browser_acceptance.py` Chromium checks with commit-provenance verification and real manual screenshot/device inspection, then fix any observed failures. No release authorization is inferred from source or synthetic results.

No broad suites, CI, audits, migrations, merges, deployments, credentials, paid resources or production writes. Existing historical P31–P51 source IDs, authorized content, native grading and local-private learning state remain canonical.
