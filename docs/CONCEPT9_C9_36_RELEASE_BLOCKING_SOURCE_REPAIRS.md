# C9-36 — Release-blocking source repairs / targeted runtime handoff

## Source and ancestry
- Repository: `thiepn/chinese`.
- Exact parent: C9-35 draft PR #37, `fix/c9-35-runtime-acceptance-native-repairs`, commit `912250974d259284f52242ad9306a6a693c28eb6`.
- Child: `fix/c9-36-release-blocking-runtime-visual-repairs`, intentionally stacked on C9-35, not `main`.
- No merge, deployment, CI, migration, credentials, paid resources or learner database writes.

## Confirmed source-level defects and repairs

1. **Skill Paths / Advanced native handoffs:** Both handlers used to change routes *before* delegating to the native lesson, grammar, reading or dialogue action. A native action could decline a source change while leaving the learner on an unrelated destination. The source-owning native controller now approves and opens the destination; a source return is recorded only on explicit success. Workshop destinations validate real task IDs and answer-loss guards before committing task state.
2. **Discovery return integrity:** The integrated lesson, story, dialogue and Review links formerly cleared the source-discovery trail before knowing that navigation would succeed. They now preserve the original in-tab search/return context when native navigation declines.
3. **Grammar transitions:** Previous/next asked twice about the same unsubmitted answer; chapter selection changed the displayed chapter even after a canceled switch; the Grammar → Workshop handler reset its task before departure was approved. These paths now use the native source guard once, with state commit after success and explicit missing-task feedback.
4. **Original P34 reading/listening handoffs:** Original reading/dialogue IDs and modes were mutated before departure authorization. Those changes now happen only after navigation succeeds.
5. **P43 writing continuity:** P43 → Advanced and Writing → Skill Paths reject protected navigation without altering the target source/bridge. Grammar and wordbook crosslinks now establish writing-return context only after their original native source and route succeed. The existing P43 → reading/dialogue/workshop return links now require an explicit true outcome, not any non-false result. The original private JSON format and manual export/import remain unchanged.
6. **Native dialogue typed response:** The existing three-stage dialogue mission has an unsubmitted `mission-entry` Pinyin field but the C9 native-answer guard had no `dialogues` mapping. It now guards that active field for route/source/context changes, and previous/next controls ask before discarding it. Graded mission feedback is not mistaken for an unsaved answer. No grading, SRS, dialogue event or source identity was changed.
7. **Home offline recovery:** Home created the repair panel conditionally only at render time, but worker readiness changes asynchronously. This left an obsolete recovery button visible after successful caching or concealed recovery when a later incomplete cache was reported. The existing panel remains mounted and reacts to updated network/worker status, with guarded `hidden` styles. Coverage counts are displayed only after validating an actual nonnegative integer manifest report from the current controlling worker. No new caches, service workers, progress stores or telemetry.

## Preservation
- Unmodified `src/study.mjs`, `src/study-storage.mjs`, IndexedDB structure, review queue and native grade/event writers.
- Unmodified original P31–P51 lessons and historical source IDs; no fabricated audio, lesson completion, HSK rights or mastery.
- P43 open-ended drafts remain **tab-local** and must still be explicitly exported to survive closure; there is no silent autosave, cloud sync or new database.
- Offline coverage checks are **static Cache Storage URL presence**, not proof that the app is usable offline or that Mandarin speech will work.

## Evidence and limits
- GitHub PR #37 metadata and its exact parent SHA were verified before creating the separate child.
- Source inspection identified the concrete incorrect sequencing, stale offline recovery DOM, and missing native-dialogue answer guard. Focused source assertions verify corrected branches and unchanged original education/storage files.
- The environment contains Chromium and the existing `scripts/c9_browser_acceptance.py` acceptance harness, but **does not have an exact current repository checkout**: direct GitHub DNS resolution failed and no exact source archive could be obtained. Historical tracked `dist/` is not an acceptable substitute.
- **SOURCE_REPAIRED / SOURCE_INSPECTED only. NOT_BROWSER_TESTED, NOT_BUILD_TESTED, NOT_DEVICE_TESTED, NOT_VISUALLY_VERIFIED, NOT_DEPLOYED.** No runtime PASS, screenshot PASS, P43 import/export roundtrip, saved grade/reload PASS, accessibility PASS or offline acceptance is asserted.
- There are no repository GitHub Actions workflow definitions, and no CI was manually initiated.

## Minimal authorized runtime acceptance
With an exact C9-36 checkout, build `src/` locally (`npm run build`), serve loopback (`npm run serve`), and reuse `scripts/c9_browser_acceptance.py --expected-head <C9-36 full commit SHA> --base-url http://127.0.0.1:4173 --artifacts <local directory>`. Check full browser startup; unsent grammar/dialogue answers on rejected navigation; native Skill/Advanced links; P43 export/import and refusal; owner IndexedDB Review grade/reload; verified offline cache and actual offline reload; light/dark phone/tablet/desktop overflow, keyboard focus, device speech, and screen reader. Inspect screenshots manually. Run this only after explicit authorization, isolated from personal learner data; no release/merge follows automatically.
