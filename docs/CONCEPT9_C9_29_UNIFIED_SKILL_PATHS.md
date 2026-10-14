# C9-29 — Unified Skill Paths and Source-Based Course Continuity

## Exact parent / source authority

- Repository: `thiepn/chinese`.
- Previous `main` HEAD confirmed at start: `6493063598bcf7dd8611857250a36cc26201d427`.
- **Exact parent branch:** `feature/c9-28-navigation-functional-integrity`.
- **Exact verified starting parent commit:** `a8828ba5caac91642098dec1d1f3111429d4a2e2` (C9-28, draft PR #30).
- C9-29 child branch: `feature/c9-29-unified-skill-paths`. Base of this stacked draft PR is the C9-28 branch, **not** `main`.
- This phase does **not** merge or edit the earlier PR, `main`, release deployment, previous P-series branches, or production.

## Major real learner-facing features

### One skill-focused course over P35–P51

`src/skills-c9.mjs` is a substantial new integrated interface at `#/skills`. A learner chooses **five meaningful cross-phase skills**, not a developer implementation phase as the top-level learning goal:

1. **Characters & meaningful words:** the original P35–P36 and P39–P40 families, word distinctions and grammar contexts.
2. **Conversations & decisions:** P37, P42, P44, P45 and P49 original authored practical situations, dialogue turns and cross-source conclusions.
3. **Connected reading:** P38, P41, P46 and P47 connected readings, paragraph evidence and interpretation.
4. **Evidence, nuance & register:** P48, P49, P50 and P51 comparative/argumentative source material.
5. **Independent writing & transfer:** original P43 writing, P44 integration and P48/P50/P51 source-qualified production briefs and P43 source links.

Every track lists its **actual original source inventory**, curated source collections and meaningful output goals. It provides cross-phase search, historical-collection filtering, pagination, selected-source details, and a **continue using real native evidence** action. Phase IDs still appear as source provenance, never achieved proficiency.

### Genuine guided P46–P51 stage progression

This phase imports the **original** `P46_STAGES`, `P47_STAGES`, `P48_STAGES`, `P49_STAGES`, `P50_STAGES` and `P51_STAGES` exported by their original screen modules. It presents their stages through the unified skill interface:

- Understand original source goals, contextual focus words, grammar IDs, teaching contrasts and misconception corrections.
- Read source paragraphs and authored Chinese lines without automatic English translation. Paragraph boundaries from original `P46_PASSAGES`–`P51_PASSAGES` stay intact.
- Play original Mandarin lines or dialogue turns through the existing browser-device voice only. No recordings are asserted.
- Compare historically source-qualified claim, question, evidence and explanation text; original P49 cases retain their linked-source identities.
- Independently prepare oral/written reasoning, source scope, counterarguments and revisions, with real P48/P50/P51 argument descriptions.
- Reveal translations/model evidence only by explicit **assisted** action, never by pretending a read-only explanation is a native grade.

Earlier P35–P45 materials receive a four-stage teaching/reading/evidence/production path while preserving each source's actual authored fields. Missing historical links are not invented.

### Native authority handoffs and observed progress

- Native links use `c9AdvancedNativeLinks` from C9-28 (corrected original source ID matching), including actual canonical lessons, grammar, `STORIES`, `DIALOGUES`, `SENTENCE_TASKS` and original P43 writing.
- The source status is **derived only** from original `state.learned`, `readingEvents`, `dialogueEvents` and `sentenceEvents`; it distinguishes independently correct, assisted, incorrect, attempted and unmapped. **No simulated stage completion or mastery.**
- Skill-to-native navigations include exact source-scoped return controls and restore the same selected track, source, stage, query and support preferences. Return controls disappear when the native target changes.
- When authored translations or models have already been revealed, handoffs to native reading, listening and exact-form Sentence Workshop set the existing source-assistance flag appropriately.
- Original P43 remains the **one and only** open-ended multi-draft composition controller, with a return-to-source action. No new writing store, essay assessment, pronunciation grade or cross-session snapshots.

### Main UI integration

- Shared route label and contextual navigation under the original C9 shell.
- Skill Paths link from Home, Learn and the original Advanced Course. Desktop sidebar and mobile More drawer preserve their established layouts.
- Responsive, flat, token-consistent stylesheet at `src/styles-c9-skills.css` for skill selectors, real source catalogs, native evidence cards, authenticated historical stage labels, paragraph reading and touch/keyboard controls.
- Existing service-worker manifest includes the skill UI and original stage sources; cache identity advanced.

## Files / original boundaries

- `src/skills-c9.mjs` — new skill-first guided learning surface.
- `src/styles-c9-skills.css` — new responsive course UI.
- `src/app.mjs` — real skill router, stage navigation, native handoffs, in-tab return context and Home/Learn entry.
- `src/navigation-c9.mjs` — skill-source and P43 return banners.
- `src/ui-c9.mjs`, `src/index.html` — native desktop/mobile route integration.
- `src/advanced-c9.mjs`, `src/styles-c9-advanced.css`, `src/integration-c9.mjs` — original atlas to skill-first course continuation.
- `src/sw.js` — offline asset list/cache version update.
- `docs/CONCEPT9_C9_29_UNIFIED_SKILL_PATHS.md` — this implementation record.

Original `study.mjs`, `study-storage.mjs`, native event writers, original P35–P51 authored content data and historical source IDs remain **untouched**. P43 state is still editor-owned, tab-local and not durable. There is no new learner-progress engine, database migration or extra scheduled-review grade source.

## Honest limitations / next phase

- This restores the original stage **definitions**, substantive source content, paragraph reading, dialogue listening and real native assessment handoffs inside one skill-first C9 interface. It does **not** transplant each P46–P51 bespoke screen's exact original multi-question internal controllers wholesale; graded comprehension remains in original `STORIES` and `DIALOGUES`.
- Model/translation reveal can classify subsequent native activities as assisted, but the original grading authority owns all actual results.
- Some authored source collections are exploratory and do not have an exact native assessment; the UI reports this rather than making one up.
- Local P43 in-tab snapshots remain at risk on refresh or closure; no new persistence created.
- First-load, mobile browser, keyboard-screenreader, cached offline install, stage handoff and real learning-state continuity still require later browser/device qualification.
- HSK labels in some original source modules express editorial targets, **not licensed official HSK 3.0 inventories, approved syllabi, measured competence or certification**.

**NOT_TESTED.** No tests, builds, CI, audits, migrations, merges, deployments, credentials, or paid services were initiated for C9-29. 
