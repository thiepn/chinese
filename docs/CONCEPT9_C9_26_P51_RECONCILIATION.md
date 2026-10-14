# C9-26 — C9-25 / P51 curriculum reconciliation (source-implemented)

## Exact ancestry and integration strategy

- GitHub repo: `thiepn/chinese`.
- Exact stacked C9-25 parent: `f6c27f5333a49c4f09883c25828f763fbbe20075`, branch `feature/c9-25-unified-learning-integration`, draft PR #27.
- Independent advanced-content parent inspected: `7116d1506727e030ae9c5e5934c2954786878844`, branch `feature/p51-register-source-fluency`.
- Reconciliation child branch: `feature/c9-26-p51-curriculum-reconciliation`.
- Source reconciliation, **not a Git merge or a claim that the P51 legacy UI was fully transplanted**. The new branch is a direct descendant of C9-25; the P51 branch, older C9 draft PRs, `main` and production remain unchanged.
- P51 and C9-25 diverged from `6ef40e6b14c710516262c99304a5675bc396e151`. The P51 branch differed by hundreds of commits including incompatible changes to the original monolithic `src/app.mjs`. Blindly replacing it would discard the C9-18–C9-25 interface and continuity work.

## Content and native-authority reconciliation

The C9-25 source tree received **163 original P35–P51 modules and phase styles**, retaining their exact P51 blob identities. An additional **12 original canonical source modules** were copied directly from the P51 content head, preserving the previously recorded source identities and enabling the historical single-writer mechanisms to index the additional original curriculum.

- `src/demo-lessons.mjs` expands the same `DEMO_LESSONS` with original appended P35, P39, P46, P47, P50 and P51 character rows. It does **not** rewrite `src/study.mjs`, `src/study-storage.mjs`, original cards, grade schedule, IndexedDB schema or backups.
- `src/lexicon.mjs` adds P35–P51 original source vocabulary through its existing canonical word keys and original Wordbook.
- `src/grammar-course.mjs` appends original P36/P40/P46/P47/P50/P51 grammar lesson IDs; `src/sentence-library.mjs` extends the existing native sentence corpus; `src/sentence-workshop.mjs` includes the authorial P35–P51 fixed-response writing tasks in its single original source set.
- `src/beginner-reading-content.mjs`, `src/stories.mjs`, `src/dialogues.mjs`, `src/dialogue-missions.mjs`, `src/beginner-reading-screen.mjs`, `src/grammar-screen.mjs` and `src/sentence-screen.mjs` use the advanced corpus in the existing original user-facing readers, dialogues and practice systems.
- All historical IDs remain as authored in the P51 sources. No P51 pseudo-level, automatic mastery, invented audio, calibrated CEFR/HSK grade, or parallel learner-state database is added.

## Learner-facing C9 Advanced Course

New `src/advanced-c9.mjs` and `src/styles-c9-advanced.css` provide a dedicated C9-semantic route `#/advanced` covering all **17 original P35–P51 curriculum phases**, not a static placeholder:

- Per-phase original source counts, themed phase selection, searchable installed Hanzi/Pinyin/English/teaching notes, paged source cards, authored teaching context and misconception-specific explanation when supplied by a source.
- Open source detail with first-party original Chinese text, provided Pinyin and optionally revealed English translations. Mandarin playback requires an installed device voice; no recorded voice, pronunciation scoring or automatic grade is asserted.
- Exact native source mapping exposes actions to the original **character lesson, grammar engine, Stories reader, Dialogues listener and Sentence Workshop** if the specific original identity exists. No source IDs are fabricated for grades. Native writers remain the only possible authority.
- Original state summaries only show actual character-introduction records, independently correct reading/dialogue events or independent model-writing records linked to that source; a viewed source is never equated with a graded attempt or completed phase.
- Temporary phase, query, selection and translation states are confined to `src/app.mjs` for the current page lifetime. No duplicate store, migration, unapproved persistence or private network synchronization.

Updated C9 navigation and source atlas surface Advanced Course on desktop/mobile. Original Home, Learn, Search, Review, Wordbook, Grammar, Sentences, Reading, Listening, Progress, saved learning sessions and settings remain the single original workspaces. Context navigation and source returns are preserved.

## Offline source boundary

`src/index.html` includes the new stylesheet and route. `src/sw.js` uses a new cache key and explicitly precaches the 163 original P35–P51 source/style assets plus the advanced C9 module/style. Existing shell, canonical learner assets, and offline/data-protection ownership are not replaced. No actual offline installation was performed.

## Exact scope and unresolved P51-specialist UX

**Integrated:** original P35–P51 source modules and canonical indexes, original native learning and grading handoffs, source-specific advanced teaching/browsing, curriculum navigation and accessibility presentation.

**Not ported:** the separate P51 legacy `src/app.mjs`'s bespoke P35–P51 specialist lesson-stage controllers and long-form ungraded editorial production controls. Their original source models exist in the tree; users can study them via the advanced source explorer and access existing native graded model exercises, but this does not promise every specialized P51 multi-stage editor, oral simulation or independent-revision flow is feature-equivalent to the separate P51 branch. A follow-up must reconcile those controllers carefully rather than replacing the main C9 app wholesale.

**Not verified:** runtime import compatibility, exact course route behavior on devices, offline installation or service-worker quota, visual parity across long texts, user-state/backup compatibility with real backups, large-course performance, source-content correctness or linguistic review. These require the final explicit qualification/testing phase.

**NOT_TESTED**: no tests, builds, CI, acceptance, compliance audits, merges, migrations, deployments, paid services or production changes. This is an actual integrated source-development branch and stacked draft PR, **not** a production release or a complete certification.

## Changed paths

- 163 `src/p35-*` … `src/p51-*` modules and corresponding phase styles, exact P51 content blobs
- 12 original native content bridges (see implementation commit)
- `src/advanced-c9.mjs`, `src/styles-c9-advanced.css`
- `src/app.mjs`, `src/ui-c9.mjs`, `src/integration-c9.mjs`, `src/styles-c9-integration.css`, `src/index.html`, `src/sw.js`
- `docs/CONCEPT9_C9_26_P51_RECONCILIATION.md` (this file)
