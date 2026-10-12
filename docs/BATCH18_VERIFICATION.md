# Batch 18 — Consolidated verification

**Baseline:** preserved original Batch 17 ZIP `character-study-batch17-working-app.zip`; new isolated local workspace.

**Source manifest digest:** `95407d71bd3b71a3148add9e1f364be93fba666639147a81f862126a43f45b36` (sorted SHA-256 paths for src, scripts, tests, package.json). See `BATCH18_SOURCE_SHA256.json`.

## Implemented

- New real `daily-plan.mjs`: seven-day course sequencing with configurable, exactly allocated 10/15/25/40-minute daily budgets; honest day-by-day activity evidence and six-day forward suggestions.
- Reusable mistake collections reconstructed from review, course, Fluency Studio, Sentence Ladder, correction and Study Block histories; manual save/unsave, later-correction state, links back to source material.
- Connected reading/dialogue continuation based on real local events and approved original demo content; no official HSK source import.
- Actionable responsive Plan screen, home/progress summary, activity timeline, written-tone explanation and typed-pinyin repair guidance.
- Desktop navigation consolidated with expandable advanced tools; Plan is available on mobile navigation.
- New optional `dailyPlan` and `mistakePins` fields in version-one learner state, with strict backup validation. No changes to original scheduler `cards`/`events` on supplementary work.

## Executed acceptance

| Check | Observed | Status |
|---|---|---|
| `npm test` | 273/273 passed, 0 failed | PASS |
| `npm run build` | 49 static assets generated | PASS |
| `npm run verify` | 49/49 built assets match manifest | PASS |
| Local HTTP served assets | 49/49 HTTP 200 + byte SHA-256 equal to build | PASS |
| Unknown route/resource | HTTP 404 | PASS |
| Legacy v1 JSON backup with Batch 18 fields omitted | deterministic source tests | PASS (contract tests) |
| Scheduled-review independence | test-grade histories/cards unaffected by plan and pins | PASS (contract tests) |
| Genuine loaded browser UI and keyboard execution | not attempted | NOT TESTED |
| Browser IndexedDB reload/persistence | not executed in browser | NOT TESTED |
| Service-worker offline reload | not executed in browser | NOT TESTED |
| Mandarin linguistic accuracy by independent reviewer | not reviewed | NOT TESTED |

**Test repair:** One initially failing Batch 18 test fixture omitted mandatory legacy `sessionId` fields; this fixture was corrected, not the persistence contract. Cache-assertion references were updated to the new v18 offline manifest without removing existing coverage.

**Limits:** Original demonstration content only; official HSK distribution rights OPEN; complete 2025 curriculum inventory NOT VERIFIED; audio not certified; final visual direction owner approval PENDING; no remote writes or production deployment. The app is not certified production-ready.
