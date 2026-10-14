# C9-34 — Learner Runtime Integration & Release Readiness

## Exact development ancestry

- Repository: `thiepn/chinese`.
- Confirmed parent: C9-33 draft PR #35, branch `fix/c9-33-practical-flow-offline-recovery`, exact HEAD `7cc3fae60cabef3ffb1e3e7c2f27b7f8e8a8f7b7`.
- Separate stacked child branch: `fix/c9-34-learner-runtime-release-readiness`, draft PR based on the C9-33 branch, **not** `main`.
- Existing production/main and all earlier C9/P-series branches remain unchanged. No merge, deployment, migrations, CI or paid actions.

## Actual learner-facing fixes

### 1. Native reading, dialogue, character and vocabulary routes

Before this phase, `c9-media-open-story`, `c9-media-open-dialogue`, `c9-lesson-open` and `lookup-word` updated original selected source IDs and/or cleared native feedback **before** asking `go()` whether an unrelated screen with an unsubmitted typed answer could be left. Rejecting the warning could therefore change underlying native learning context even though the learner stayed on the previous page.

These source handlers now **request the route first** and only then apply the existing original source, selection and feedback mutations. A reading or character switch **within an already-open native screen** also consults its original unsent-answer guard before clearing the current response. There is no new event writer or independent assessment.

### 2. Honest advanced/skill source-to-practice handoffs

`c9-skills-native` and `c9-advanced-native` previously registered a return trail before confirming a departure. If a learner canceled an unsubmitted-answer warning, the stale trail could incorrectly associate the current native screen with another source.

C9-34 checks an authorized destination before recording the handoff and delegates the real lesson, grammar, reading, dialogue and original Sentence Workshop to their existing controllers. Same-screen changes to an original fixed-answer Workshop task honor unsent typed-answer protection. Historical P35–P51 source IDs, task phase mapping, assistance and original grading remain unchanged.

### 3. P43 import: no stale asynchronous file read

The private manual file-import path awaited `file.text()` and could resume after the learner navigated away, selected a newer backup or changed the original P43 unit, showing an old replacement prompt at the wrong time.

C9-34 adds a short-lived **in-memory file-read cancellation token**, confirmed against the original P43 unit/phase/source and current Writing Studio route. Subsequent selections, native writing source changes, cancellation, confirmations and writing-route departures invalidate the earlier read. Stale results and stale errors are discarded; no draft is overwritten without the original explicit confirmation. This is neither autosave nor another storage system.

For slow mobile download managers, the original P43 private JSON Blob URL is retained longer before revocation, while the UI still says a download was requested, **not** that it was saved.

### 4. Skill Paths search CPU work

Skill search repeatedly generated normalized Chinese, Pinyin, English and contextual source-line text for every original record on each keystroke. C9-34 now memoizes only the **immutable authored source's normalized search text** using a module-local `WeakMap`. The existing canonical `plain` normalization (from `lexicon.mjs`) and source selection remain unchanged; there is no persistent search store, no learner progress cache and no claim of measured speedup. This removes repeated original-text normalization during live filtering.

## Modified source

- `src/app.mjs`: approved navigation before native source mutation, stage return handoffs, route-scoped backup cancellation.
- `src/writing-c9.mjs`: asynchronous file-import cancellation, original-context protection, mobile Blob download grace period.
- `src/skills-c9.mjs`: reusable immutable original teaching text normalization.
- `docs/CONCEPT9_C9_34_LEARNER_RUNTIME_RELEASE_READINESS.md`: exact parent, implementation and limitations.

## Authority, verification and remaining blockers

- **Unchanged:** historical P35–P51 source IDs, original `study.mjs` and `study-storage.mjs`, IndexedDB schema, review scheduler, original Reader/Dialogue/Sentence/Grammar learning evidence, native grades, P43 manual JSON backup format v1, source rights and C9-31 offline cache manifest.
- **Targeted source verification:** Exact C9-33 parent/head confirmed through GitHub; reviewed actual native action bodies and return paths, confirmed `plain` is an exported canonical source helper and confirmed `handleC9WritingBackupFile` receives the existing `route` callback. No executed browser/device acceptance.
- **NOT_TESTED / NOT_BUILT / NOT_DEPLOYED.** No browser-level input handoff simulations, file roundtrips, module evaluation, offline installation, CI, test suite, typecheck, audit, migration, merge, deployment, credentials or paid services.
- **Still outstanding:** Browser Back/Forward edge behavior on real devices, offline/PWA activation under interrupted downloads, visually confirmed tablet/mobile dark themes, source-to-native focus after dynamic changes, actual Mandarin speech availability, and manually exported/imported P43 JSON roundtrip. The original multi-stage P46–P51 bespoke assessment controllers remain native rather than duplicated.
- **Release readiness:** This is an implementation branch and *draft* PR, **not** a certified release. The existing C9-28–C9-34 stack must be integrated/reviewed later only by explicit user instruction.
