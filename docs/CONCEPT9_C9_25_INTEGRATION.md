# C9-25 — Unified Learner Journey & Installed-Source Integration

**Repository:** `thiepn/chinese`
**Verified exact parent:** C9-24 `feature/c9-24-advanced-progress-search-workspaces` at `7f2f31382e6183ced2565455eeee56311dea6d26` (draft PR #26).
**Stacked child:** `feature/c9-25-unified-learning-integration`.

## Scope fulfilled — actual source changes

### One source-grounded learning path, with native actions

`src/integration-c9.mjs` is a pure renderer over the exact installed original sources and original due-only scheduler. It does not create new records, grades, scores, course completion or a duplicate source index.

- Home adds a connected four-step journey: next not-yet-introduced original character lesson; actual due Review; original reading lacking a recorded independent correct answer where possible; and original conversation lacking a recorded independent correct answer where possible.
- Each step opens the existing native action dispatch. No click, source opening, audio playback or journey stage grants mastery or even an attempted response.
- All content metrics are computed from the actual imported `DEMO_LESSONS`, `STORIES`, `DIALOGUES`, `dueCards(state)` and original `readingEvents` / `dialogueEvents`. If every source in a family already has an independent correct record, the UI explicitly switches to revisit language rather than presenting a false unattempted recommendation.
- Home lists actual persisted native learning sessions (guided practice, fluency, ladder, study block, daily journey, repair, wordbook journey), without duplicating any resume state. Route links return to original session owners; unsent input is not claimed as saved.

### Learn now shows exactly what is installed

- Read-only indexed source atlas links to the existing original Character, Wordbook, Grammar, Sentence Library, Reading, Dialogue and Pathway workspaces. Counts derive from the original source arrays, not an assumed official HSK inventory.
- Expansion disclosure references actual P31 character guides, P33 authored situations and P34 reading/listening situations from the existing branch. This does **not** claim P35–P51 is installed.
- The preceding C9-18–C9-24 theme, learner state, source routes, audio, scheduler, wordbook, source discovery and assessment controls remain intact.

### Search results return to the same discovery work

- Native P30 `p30-open-result` and C9 Learn discovery reuse the existing indexed `courseSearch` results and exact source IDs. `c9LookupSource` recognizes only original canonical source arrays.
- On a legitimate original search/open, a temporary in-tab source handoff records source identity and originating UI context. The destination gets an accessible “Back to search results” or “Back to Learn discovery” control without persisting private search queries.
- Original `p30Query`, `p30Kind`, `p30Saved`, Learn filters and native selected source state continue to be owned by `app.mjs`. The handoff validates the current native source identity to prevent stale source names when switching to another passage, conversation, grammar, sentence, character or pathway.
- Native source-writing and original CAS/state authorities are not modified. No new browser history API or network endpoint is introduced.

### Responsive integration and offline boundary

- `styles-c9-integration.css` uses existing C9 semantic tokens, Hanzi-first typography, keyboard focus, accessible button sizes and compact phone/tablet/desktop layouts.
- `index.html` includes the integration stylesheet; `sw.js` lists the two new local assets and bumps the pre-cache name. Cache groups otherwise remain unchanged.

## P51 content branch reconciliation — **not yet combined**

A GitHub source comparison was performed for planning and ancestry only, **not** a test/build/audit. As checked during C9-25 work:

- Separate content head: `feature/p51-register-source-fluency` at `7116d1506727e030ae9c5e5934c2954786878844`.
- Compared with C9-24, the branches have diverged from common ancestor `6ef40e6b14c710516262c99304a5675bc396e151`: GitHub reported 381 commits ahead and 62 behind for the P51 branch at comparison time.
- P51 has many actual P35–P51 content, screen, reading, dialogue, grammar and production modules, plus an extensively modified native `src/app.mjs`, `src/index.html`, `src/demo-lessons.mjs`, `src/dialogues.mjs`, `src/lexicon.mjs`, etc.
- It would be incorrect to treat those sources as part of this C9-25 branch. Neither branch has been merged or rewritten.

**Future source reconciliation work** must preserve the P51 original authored records, lesson IDs, practice record writers and learner data. It must combine native P51 lesson/reading/dialogue routes with the present C9 UX instead of replacing P51 original content or silently substituting historical IDs; extend `COURSE_INDEX` and the appropriate C9 screens only for genuinely installed material; account for extra source assets in the offline cache and explicitly review state/backup schema compatibility. Reconciliation cannot safely be presumed conflict-free from the GitHub compare result.

## Files and status

- `src/integration-c9.mjs` — new native source/continuity/in-tab provenance rendering
- `src/styles-c9-integration.css` — new responsive integration presentation
- `src/app.mjs` — wired original Home/Learn/Search/Source actions; no grading/persistence replacement
- `src/index.html` — load the new stylesheet
- `src/sw.js` — local asset precache and version
- `docs/CONCEPT9_C9_25_INTEGRATION.md` — this description

**NOT_TESTED.** No builds, CI, test suites, browser/device acceptance, visual review, audits, migrations, merges, deployments, paid services, API keys, remote content fetches or production changes. This PR is a source implementation and source-consolidation step, **not** an assertion of final release readiness or P51 content integration.

C9-25 is not a publication of unlicensed official HSK materials. Human evaluation, linguistically reviewed Mandarin, P51 branch reconciliation and final coordinated release qualification remain outside this implementation-only batch.
