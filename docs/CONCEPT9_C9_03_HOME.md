# THIEPN Chinese Concept 9 — C9-03 Home Dashboard

Parent: `78d687bd42fefcacd1c1a7b5241c096e5746b894` on `feature/c9-02-clean-modular-scholar-shell`.
Branch: `feature/c9-03-clean-modular-scholar-home`.
Source-only implementation. No test, build, CI, browser qualification, migration, merge or deployment.

## Actual changed source

- `src/home-c9.mjs`: new pure, read-only Concept 9 Home view built on original `courseOverview`, `courseShortcuts` and `learningHub`. It renders next action, recoverable sessions, real due scheduled prompts, source-scoped demo lesson introductions, correct independent scheduled recall evidence, saved words, today’s existing study-plan activities and recorded-status distinctions, useful quick links and provenance.
- `src/styles-c9-home.css`: layout and visual hierarchy for responsive light/dark Home, restrained inline landscape/calligraphic motif, primary focus/secondary actions, cards, plan lists, progress, and smaller screens.
- `src/app.mjs`: reroutes Today through the existing app render lifecycle to `renderC9Home`, retains all earlier special educational panels under accessible progressive-disclosure sections, preserves onboarding, network status and authoritative action dispatch. Nothing redirects writes or changes learner records.
- `src/index.html`: links new styles in C9 order after app shell.
- `src/sw.js`: precaches the new JS/CSS in an updated offline cache name.

## UX and state

Home first presents one real next step (saved session > due recall > remediation > new lesson > practice, as determined by original `learningHub`). Stats are labels on real source state; no invented official HSK progress. New learners see a truthful empty-introduction state and first lesson. Due = currently due scheduled prompts; independent recall = historically correct unassisted scheduled attempts. Today's study-plan tasks are *suggestions*, and an attempted activity is shown as recorded, not mastered. The plan remains editable from its native route.

Quick Actions and task buttons link to the original native routes and handlers (`hub-primary`, `hub-task`, `hub-resume`, `hub-lesson`). No duplicate writer, learning evaluator, persistence or authorization system exists.

Storage absence produces a warning; offline status uses the original browser network signal and can update dynamically without resetting in-progress page state. Offline cached material is not asserted complete or available unless already cached.

## Preserved

P31–P34 source records, previous C9 shells and tokens, all hash routes, existing IndexedDB version, review schedule and native course/history writers. Main and production unchanged.

## Limitations

Visual/browser/device acceptance, keyboard and screen-reader runtime behavior, font availability and deployment remain NOT_TESTED per request. No official HSK curriculum, new audio, new grading, analytics storage or invented achievements. C9-04+ continues with course/lesson/character layouts and later consolidated qualification.
