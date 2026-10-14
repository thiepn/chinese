# C9-28 — Navigation and Functional Integrity

## Git ancestry and delivery

- Repository: `thiepn/chinese`.
- **Exact source parent:** merged `main` at `6493063598bcf7dd8611857250a36cc26201d427` (C9-27 released).
- Separate development branch: `feature/c9-28-navigation-functional-integrity`.
- Implementation commits are restricted to this child branch. No merge to `main`, migration, production change or direct hosting action.

## Implementation

### Fix incorrectly mapped exercise handoffs

`src/advanced-c9.mjs` previously permitted `t.storyId===story?.id` even with no story. Because `undefined===undefined` is true, this could route original P35–P51 learning material to an **unrelated** task lacking `storyId`. The fixed matcher:

- Matches by explicit, historical original source IDs and task metadata (`p35LessonId`, `p43UnitId`, `p48ArgumentId`, etc.), or source-qualified native task ID prefixes, including `p48:argument:<readingId>:model0` and equivalent P50/P51 identities.
- Only considers `t.storyId` when an actual native `STORIES` item was matched to the original source.
- Removes title-equality shortcuts that could accidentally link distinct readings/dialogues with the same title.
- Uses exact original `DEMO_LESSONS`, `GRAMMAR_LESSONS`, `STORIES`, `DIALOGUES` and `SENTENCE_TASKS` records; allows up to three relevant fixed-answer tasks rather than silently choosing an arbitrary first unrelated one.
- Preserves the UI's distinction among teaching, independent native evidence, guided hints and assisted source exposure.

### Two-way source returns

A small `src/navigation-c9.mjs` component renders **real, verified handoffs**, not shadow learning state. When a learner leaves an Advanced Course source for the canonical lesson, grammar, reading, conversation or Sentence Workshop, the app retains original phase, selected source, search, pagination and translation settings in the same tab. The native destination shows a keyboard-accessible button back to Advanced Course.

The existing P43 authoring studio also records source-scoped return links for genuine P41 readings, P42 dialogues, fixed-answer model tasks, P48/P50/P51 related native content, additional source teaching, and vocabulary/grammar references. Returning retains the **same original P43 editor and its in-tab draft**, not a new essay writer. Return banners disappear when the target no longer matches the exact source ID, avoiding stale context.

Existing Learn / Find return mechanisms, canonical IDs and historical native events remain intact.

### Guarded unsent work

- While a private P43 writing draft or saved in-tab revision snapshots exist, relevant destinations display a **visible resume-writing notice**, explicitly stating the text is not a durable backup or a learner grade.
- A native browser confirmation is requested before leaving supported screens with a currently typed (but not yet submitted) answer, including core Review, Workshop, Reading, Grammar, Pinyin, Pathway and practice inputs. This applies to router actions and same-origin in-app route links.
- Worksheet/sentence-next and certain grammar/reading step controls also guard against silently discarding an unsubmitted typed answer.
- Browser close/refresh warning continues to protect P43 in-tab composing work, and additionally warns about supported active typed answers.
- Does **not** invent durable storage or a duplicate learner state. A browser cannot reliably prevent app closure, abrupt process termination or every external URL/hash transition. A prompt is not a saved answer.

### Responsive navigation

The original 17 P35–P51 sources and phase IDs are preserved. Compact mobile screens now use one accessible phase selector plus adjacent previous/next phase navigation rather than requiring scrolling past a dense 17-phase navigation grid. Desktop keeps its original full phase overview. Contextual return/unsent banners have focus-visible targets and mobile-width buttons.

The offline shell includes the new navigation module and an updated cache identity; no offline claims are made without later browser acceptance.

## Original learning authorities left unchanged

- `src/study.mjs` and `src/study-storage.mjs`: no changes to original learner-state schema, IndexedDB, due-card scheduler, review and backup.
- `SENTENCE_TASKS` and event writers: unchanged; no new grades, fake correctness, shadow receipts or premature achievement labels.
- P35–P51 original authored source modules: unchanged.
- P43 in-tab composition remains tab-only; no new persistent answer store.
- P-series draft stacks, existing UI merge commits and production `main`: unchanged.

## Limitations and deferred work

- No browser/device acceptance, runtime verification, offline qualification, automated tests, builds, CI runs, audits or migrations were initiated (**NOT_TESTED**).
- Unsubmitted-answer warnings are tied to known native typed-answer inputs. Unsubmitted choices, browser-back and manually edited hash URLs are not guaranteed to trigger the same warning.
- P43 writing snapshots are intentionally *not* durable backups. Copy/export remains required before refresh/close.
- This phase does not transplant all of the separate P51 staged-reading/listening controllers; additional learner-friendly progression and source discovery belong to later phases.
- Device Mandarin voice is still browser-dependent; no approved human recordings, spoken grading or HSK certification are implied.

## Modified source

- `src/advanced-c9.mjs` — correct native source-ID matching, contextual native tasks, compact phase selector, previous/next navigation.
- `src/navigation-c9.mjs` — one read-only two-way return and unsent-work display layer (new).
- `src/app.mjs` — guarded navigation, exact handoff validation, source restoration and native destination actions.
- `src/writing-c9.mjs` — P43 authorial crosslinks retain original source return context.
- `src/styles-c9-integration.css` — accessible source return and resume banners.
- `src/styles-c9-advanced.css` — responsive mobile phase selector.
- `src/sw.js` — register the new module and app shell version.
- `docs/CONCEPT9_C9_28_NAVIGATION_FUNCTIONAL_INTEGRITY.md` — this implementation report.
