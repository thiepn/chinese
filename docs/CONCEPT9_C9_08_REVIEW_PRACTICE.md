# Concept 9 — C9-08 Review, Active Recall and Practice Workspaces

**Parent:** `000ef4f8b1058ea149b30aeb756ce84bb065393f` on `feature/c9-07-clean-modular-scholar-language-libraries`.
**Child:** `feature/c9-08-clean-modular-scholar-review-practice`. Source-only; NOT_TESTED.

## Source implementation
- `src/review-practice-c9.mjs`: complete scholarly scheduled Review setup, live recall and finish states. Reads original `dueCards`, `cardInfo`, `summary`, `reviewPlan`, and `makeOptions`; calls original `review-begin`, `review-pick`, `submit-review`, `reveal-review`, `review-skip`, `grade`, `review-restart`, and `speak` actions. It does not calculate grades, store study state or change event data.
- Review setup displays real due count and source-derived priority reasons, persistent card count and historically correct independent attempts, focus and length selections, useful no-due state and keyboard information.
- Active recall maintains hidden reference before answer, Hanzi-first prompt, choice or typed response, clearly marked reveal/assisted state, original evaluation feedback, device voice control, correct-vs-incorrect native grading buttons, queue progress and explicit interruption caveat.
- Finished review distinguishes graded, independently correct and skipped cards; skips stay due. The queue is in-memory as before and not falsely advertised as persisted.
- `src/app.mjs`: replaces only the Review **presentation** with C9 renderer. Keeps stale-card defensive logic (including cross-tab state reconciliation), `gradeCard` CAS writer, native evaluators and all existing Review interactions. Original Practice Lab renderer is preserved under `renderPracticeNative` and receives a C9 shell. The fluency sidebar is progressively disclosed instead of crowding core exercises.
- `src/styles-c9-review-practice.css`: responsive Concept 9 Review/Practice typography, feedback surfaces, accessible controls, phone layouts and semantic dark mode. Original guided practice, drill answers, hints, graded feedback and flows keep their native IDs and handlers.
- `src/index.html` loads the final C9 layer; `src/sw.js` precaches the added assets with a new offline cache identity.

## Authentic state boundaries
- Scheduled Review events: original `gradeCard` and IndexedDB write authority; temporary review queue is not resumable after a restart.
- Guided Practice persists via the original `practiceSession`, `recordGuidedAnswer` and session-step writers; interruption recovery is not invented.
- Standalone drills continue to use `addDrillRecord` and are supplemental, not scheduled-review mastery.
- Native answer checks, assisted/revealed labeling and historical IDs remain unchanged. No independent progress engine, SRS algorithm, evaluation store or automated HSK claims.

## Deferred
- Real browser visual comparison, mobile/keyboard focus, dynamic interaction, dark contrast, and interrupted-session execution are NOT_TESTED by explicit instruction.
- No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services. All earlier branches, main and production preserved.
