# C9-27 — Source-based independent Mandarin production and revision

## Exact ancestry

- Repository: `thiepn/chinese`.
- Verified starting `main` head: `f1863c0a0da71f4c76fbd6301063755eae34f0cd`, the completed merge of C9-26.
- Development branch: `feature/c9-27-advanced-writing-revision-handoffs`, created directly from this exact head.
- This is independent child development, not a merge or change to `main`, production, previous UI PRs, or the parallel unmerged P-series PRs.

## Substantial learner-facing implementation

The P35–P51 sources in C9-26 made advanced material discoverable and linked fixed-answer tasks to the original owners. C9-27 restores the original **P43 independent writing studio** as a functional C9 route `#/writing`, with the source-specific arguments and revision prompts authored in **P48, P50 and P51** linked to that *same* in-tab composing surface.

### Original P43 studio, not a new essay database

- Imports the **existing** `p43Overview` and `p43ProductionStudio` from `src/p43-screen.mjs`, the existing 12 source-authored `P43_UNITS`, and `P43_REVIEW_CRITERIA`.
- Source-driven four-step writing workflow: plan, compose, revise and speak. Each unit retains its original P41 reading and P42 conversation references, authored two-paragraph source model, conceptual misconceptions, explanation notes, and independent spoken-transfer prompts.
- Live Hanzi count, one editable multi-paragraph draft, up to 12 explicitly saved **in-tab-only** revision snapshots, source model reveal with translations, side-by-side snapshot comparison, confirmation before replacing the current text, self-review criteria, optional model speech via existing device voice, clipboard export and guarded discard/topic change.
- Editor text, snapshots and self-review flags are deliberately **not** stored in IndexedDB or transmitted. If a user navigates to a native reading, conversation or fixed-answer exercise, the same tab keeps the composition intact; closing/reloading with an unsent draft or snapshot triggers a browser unload warning when supported.
- No automatic essay scoring, simulated speaking evaluation, claimed pronunciation grade, learner-progress completion or new authoritative grading system.

### P48/P50/P51 source-specific applied argumentation

- `src/writing-c9.mjs` imports **original** `P48_ARGUMENTS`, `P50_ARGUMENTS`, `P51_ARGUMENTS` and their **original authored** revision criteria; source identities and `p43Id` links are preserved.
- Each advanced P48/P50/P51 source card in `#/advanced` opens its historically linked P43 unit as the *same* independent writing session.
- Dedicated evidence panel displays source claim, fair objection, source-supported rebuttal, misconception-specific correction, original writing and speaking briefs, phased evidence reasoning guidance, original model passages (behind an explicit assisted-reveal control), and source-qualified, keyboard-operable human self-review prompts.
- Exact source identity links hand off to original `STORIES`, `DIALOGUES` and `SENTENCE_TASKS` whenever an actual native match exists; no invented link, source text, simulated review receipt or regraded attempt is created.
- Original P43 written model practice is mapped by the exact historical task ID `p43:<unit-id>:line4` / `line9`; assisted-source/model reveals set existing Sentence Workshop support context on handoff.
- Reading and listening historical results are displayed only from existing native event collections; user self-inspection cannot grant achievement, mastery or completion.

### Interface and offline delivery

- Adds native **Writing Studio** route and navigation context, surfaced on desktop/mobile and as a direct action on original P43/P48/P50/P51 advanced course source cards.
- Uses existing original P43 stylesheet and an additional deliberately flat C9 theme-consistent `styles-c9-writing.css`: responsive split-source cards, true Hanzi-focused editor, source model comparison, visible focus, semantic controls, reduced-motion, and touch targets.
- Extends the existing `src/sw.js` pre-cache with the new module and CSS and bumps the cache identity. Preserves existing source/module assets and offline app shell.

## State, authority, and rights

Canonical `DEMO_LESSONS`, `GRAMMAR_LESSONS`, `WORDS`, `STORIES`, `DIALOGUES`, `SENTENCE_TASKS`, `study.mjs`, `study-storage.mjs`, original IndexedDB, scheduler, grade records, original source IDs and cross-tab sync remain **unchanged**. C9-27 only adds app-level presentation/actions and temporary in-tab editorial writing state.

Only original authorial P35–P51 sources are used; no official HSK certification, published third-party corpus, hidden recordings, credentialed pronunciation analysis or proficiency estimates are claimed.

## Limitations

- The separate P51 branch includes additional bespoke multi-stage specialist controllers beyond P43 writing and P48/P50/P51 source-specific argumentation. Those remaining reading/listening stage controllers are **not** represented as fully merged into the C9 UI.
- Browser unload warnings are subject to browser rules. In-tab snapshots are not durable backups; users must manually copy work to retain it after refresh or closure.
- This source branch has not undergone runtime/browser/device acceptance, import resolution qualification, learner-state acceptance or accessibility verification. Real source/language accuracy beyond original authorial material has not been independently certified.
- Production has not been updated by this branch.

**NOT_TESTED.** No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services were initiated. This is source implementation on a separate child branch.

## Changed source

- `src/writing-c9.mjs` — original P43 wrapper and source-specific P48/P50/P51 guidance, one tab-local controller
- `src/styles-c9-writing.css` — responsive source-specific composition UI
- `src/advanced-c9.mjs` — source-to-composition handoffs
- `src/app.mjs` — native routing, interaction, workshop and evidence handoff
- `src/ui-c9.mjs`, `src/index.html` — contextual and primary navigation
- `src/sw.js` — offline asset manifest and cache update
- `docs/CONCEPT9_C9_27_ADVANCED_WRITING.md` — this source scope and limitation report
