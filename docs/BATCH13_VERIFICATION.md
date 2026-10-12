# Character Study — Major Build Batch 13 verification

## Implemented

- Added `src/learning-bridge.mjs` for validated character-in-word positions, literal word-in-sentence matches and four-skill learning-evidence projections. These projections neither infer official HSK levels nor modify learner histories or review scheduling.
- Added a character-to-word-to-sentence annotated teaching bridge to character details and six-stage journey preparation; supports responsive and dark modes.
- Added end-of-lesson recap in Today and journey follow-up, showing independent / assisted / needs reattempt / not checked facets, with targeted independent correction and explicit scheduled-review separation.
- Added a consolidation exercise entry point even when no outstanding weakness exists (uses existing checkpointed independent remediation sessions).
- Repeated guided journeys test pronunciation of the **complete second vocabulary word** including all tones, instead of endlessly repeating isolated-character pronunciation.
- Added optional capped `feedback.reason` to new course and correction checkpoints, enabling contextual written-pinyin contour suggestions; older v1 backups/checkpoints remain valid.
- Added Previous Reading and Previous/Next Dialogue interactions alongside the existing next-reading workflow; navigation clears transient answer/hint state rather than marking answers correct.
- Improved reading/teaching layout for small screens, contrast, assistive statuses and reduced-motion preferences, without claiming final design signoff.
- Advanced only the service-worker cache revision and its asset list to include the new module. No official HSK dataset included.

## Executed results

| Verification | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | PASS: 180/180 |
| `npm run build` | PASS: 41 static assets |
| `npm run verify` | PASS: 41/41 built asset hashes and existing content guards |
| Real Node local server HTTP GETs | PASS: 12/12 routes HTTP 200 |
| Missing route | PASS: HTTP 404 |
| Original lessons | PASS: 74 source contract fixtures |
| Legacy v1 JSON backup contract tests | PASS within Node suite |
| Real Chromium navigation and interactions | NOT TESTED |
| IndexedDB persistence/reload on browser | NOT TESTED |
| Offline SW reload on browser | NOT TESTED |
| Manual linguistic review, TTS audio quality | NOT TESTED |

The first consolidated test execution had six **stale service-worker-version assertions** from older batches. Those were updated to require the new v13 cache revision, retaining their module-presence expectations. No tests were removed. The final consolidated suite passed. Source test results do not prove end-to-end browser or data-storage safety.

## Restrictions

No authoritative official HSK inventory, source-rights claim, public release, credential, deployment, remote repository operation or production mutation. Official rights clearance, corpus reconciliation, visual approval, and independent linguistic/audio certification remain pending. Evidence lives in `docs/BATCH13_TEST.log`, `docs/BATCH13_BUILD.log`, `docs/BATCH13_VERIFY.log`, `docs/BATCH13_HTTP.json`, `docs/DIST_SHA256.json` and `docs/BATCH13_SOURCE_MANIFEST.json`.
