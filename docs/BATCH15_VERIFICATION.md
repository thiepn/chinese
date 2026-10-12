# Character Study — Batch 15 development and consolidated verification

Date: 2026-10-12. Local, isolated source-only build. No remote repository or production mutation.

## Actual implementation

- New **Study Blocks** page and navigation: saved 2–4 lesson learning runs with explicit focus modes (balanced, weak skills, and new lessons).
- Each study block chains existing six-stage Daily Journeys and four-stage Sentence Ladders for every selected lesson; next stages open only after an actual saved completion event recorded after the block started.
- Two additional checkpointed cross-lesson exercises after the linked lessons: Chinese sentence meaning recognition and full-word tone-sensitive pinyin recall. Hint/reveal flags survive writes and prevent independent-credit misclassification.
- Block progress/history are additive (`studyBlock` and `studyBlockEvents`), optional in legacy version-1 JSON backups. A cancelled block retains original review, course, and practice history.
- Weakness-based selection uses observed incorrect/assisted journey answers and prior scheduled-review misses. The ordering is a heuristic and is not calibrated mastery estimation.
- Cross-lesson comparisons show full vocabulary words, their stored word pronunciations and meanings, and literal overlap only. Links to relevant short readings and dialogues. No unreviewed morpheme-level claims are asserted.
- Today/Learn/Progress integration with a resumption banner, statistics and mobile layout updates.
- The scheduled-review `events` and `cards` are not modified by new Study Block milestones or cross-lesson assessments; finishing a Daily Journey retains the prior behavior of introducing eligible review cards without grading them.
- All previous 74 demonstration lessons, 12 readings, 10 dialogues, 66 contextual task configurations, existing practice/review/placement/bookmark histories and earlier v1 learner-backup contract remain in the source.

## Consolidated automated results

| Check | Result |
| --- | --- |
| Node automated regression suite | PASS — 217/217 |
| Static build | PASS — 45 source assets copied to dist |
| Built-asset SHA-256 validation | PASS — 45/45 |
| Static HTTP asset responses | PASS — 45/45 returned HTTP 200 |
| Missing-resource HTTP behavior | PASS — HTTP 404 |
| Archive ZIP CRC | Recorded after packaging; see archive report |
| Source-loaded Chromium E2E | NOT TESTED — existing environment previously blocked/timed out on localhost |
| IndexedDB restart/restore in a real browser | NOT TESTED |
| Service-worker offline reload in a real browser | NOT TESTED |
| Assistive-technology audit / owner visual review | NOT TESTED / PENDING |

Initial full regression run identified seven test assertions still pinned to the previous Batch 14 service-worker revision. Those assertions were updated to `working-v15`, retaining asset coverage. A new cross-lesson choice-order test was then added; the final complete regression suite passed. The exercise answer was never deliberately hard-coded to first position.

## Evidence files

- `docs/BATCH15_TEST.log`
- `docs/BATCH15_BUILD.log`
- `docs/BATCH15_VERIFY.log`
- `docs/BATCH15_SERVER.log`
- `docs/BATCH15_HTTP.json`
- `docs/DIST_SHA256.json`
- `docs/BATCH15_SOURCE_MANIFEST.json`

## Restrictions and known limits

- All educational content remains independently authored **non-official demonstration material**. No official 2025 HSK curriculum, restricted redistributable corpus or account data was imported.
- No remote repositories, DNS, credentials, hosts or production infrastructure were accessed or modified.
- No objective audio correctness, linguistic/translation quality, cross-browser persistence, service-worker lifecycle or WCAG certification is claimed.
- Old backup compatibility is exercised by pure state/backup tests, not a complete IndexedDB browser restore.
- Browser-managed local storage can be deleted; user-exported backup is still necessary for independent recovery.
- Supplementary completion, hints and contextual practice never constitute scheduled spaced-review mastery.
