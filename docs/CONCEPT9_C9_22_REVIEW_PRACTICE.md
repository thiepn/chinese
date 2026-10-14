# THIEPN Chinese — C9-22 Review & Practice Completion

Base: `feature/c9-21-vocabulary-grammar-sentence-workspaces` at exact parent `21cfbea88933c51ae81762ebdb8efd5e982557fa`.
Child: `feature/c9-22-review-practice-workspaces`.

## Implemented learner-facing behavior

### Original scheduled Review
- Existing original due-only `reviewPlan` and `dueCards` produce the queue, skill breakdown, genuine priority reasons, and original seeded multiple-choice answers. Skill grouping now matches the review strategy's actual card-type classifications, including word-reading prompts.
- Original independent answer, assisted reveal, error-specific comparison, native grading and `gradeCard` remain the only scheduled-review mechanism. Incorrect and assisted work cannot obtain passing grades.
- Clear pause/resume/discard for the **original in-tab queue**; an exit to another route pauses remaining due prompts without inventing a grade. Unsaved input and ungraded comparison feedback are cleared on exit. Paused queues are **not** promised to persist across reloads; grade events do.
- Stale or removed due cards are omitted and transparently counted after changes in another tab. A grade attempts to recheck actual due status inside the original CAS writer before recording a native event.
- Misconception-specific explanation for Pinyin format, syllable spelling, tone contrasts, source meaning, sentence interpretation and assisted reveal. Native source lesson explanation, exact original lesson handoff (with no implicit grade), device speech controls and honest evidence labels.
- Distinct finished-session breakdown of graded, independent-correct and skipped prompts, with actual currently-due count and source-specific return routes.
- Keyboard Review choice keys, submit/skip and native grading keys retained. Review pause and practice entry keyboard handling enhanced without new assessment authority.

### Original Practice Lab
- New purposeful three-path choice: authentic guided mixed practice, original standalone drills and separate due-card Review; actions scroll/focus the **actual native players**.
- Original `practiceSession` and `recordGuidedAnswer` remain the only saved multi-question practice/checkpoint authority. Guided progress displays real saved cursor, independently correct and assisted counts; no invented mastery or additional event stores.
- Saved guided session recovery presentation and clear differentiation between recorded checks and unsent input.
- Native stand-alone six drill formats, source-linked reading, character, word, sentence ordering, Pinyin and feedback remain intact. Original `addDrillRecord` continues to be the only supplemental drill writer.
- Recent drill context comes strictly from actual persisted `drillEvents`; the original drill selectors, saved explanations, hinted answers and guided transitions remain the interactive controls.
- Desktop/tablet/mobile typography, source-repair surface, accessible focus indicators, 44px targets, proper live status and light/dark semantic styles are extended in the pre-existing C9 stylesheet, without a new theme.
- Existing service-worker offline cache version advanced to distribute the changed native modules and CSS.

## Modified source files
- `src/review-practice-c9.mjs`
- `src/app.mjs`
- `src/styles-c9-review-practice.css`
- `src/sw.js`
- `docs/CONCEPT9_C9_22_REVIEW_PRACTICE.md` (this file)

## Boundaries
- No duplicate SRS/FSRS, scoring, event ledger, grading shortcuts, remote storage, lesson source IDs, migrations or Account ownership changes.
- No fabricated completion, official HSK achievements, voice recognition/pronunciation score, automatic free-writing grade or persistent scheduled-Review queue.
- P31–P34 historical sources and records remain intact; independent P35–P51 education branches, existing C9 branches, main and production are preserved.
- **NOT_TESTED** by source-only development instruction: no builds, tests, CI, browser/device acceptance, offline runtime verification or accessibility audits. Live release quality and browser compatibility are not established.
- The later C9-23 and C9-24 feature work and final integration with the independent extended learning-content stack remain separate.
