# Character Study — Major Build Batch 17 Verification

## Implementation delivered

- New `src/fluency-studio.mjs`, a source-anchored bank of original demo assessment questions across **contextual senses, exact Chinese sentence reconstruction, reading evidence, dialogue evidence, and complete-word pinyin**. Four selectable practice priorities; question counts of 6, 8, 12, or 16. Priority uses the latest observed answers including earlier reading/sense/sentence evidence; it is not a calibrated memory or learning model.
- Integrated Fluency Studio in sidebar, Today, Learn, Practice, Progress, and a persistent global resume bar. Accessible answer choices, text input and keyboard Enter, contextual feedback, two-context polyphonic comparison, and links back to the cited **original demo** lessons, readings or dialogues. Responsive layout down to 320 CSS px was authored but not independently browser-validated.
- Optional `fluencySession`, `fluencyEvents`, `fluencyCompletions` version-1 state additions. Submitted answers checkpoint in the existing transactional local store. Hint reveal flags the attempt **before** exposing teaching content. Supplemental events **never mutate scheduled-review events, grades or cards**. Version-1 backups omitting the new properties are accepted. Invalid and duplicate events, unsupported question IDs and corrupted session state fail validation.
- All earlier content and workflows remain: 74 original lessons, 12 readings, 10 dialogues, 66 legacy contextual task configurations, Daily Journey, Sentence Ladder, Study Blocks, Context Trails, review events, correction checkpoints, placement, bookmarks, wordbook, and optional older v1 backup fields.

## Actual verification in this working container

| Check | Result | Evidence |
|---|---|---|
| Consolidated Node tests | **PASS 248/248** | `docs/BATCH17_TEST.log` |
| Repeatable static build | **PASS, 48 assets** | `docs/BATCH17_BUILD.log` |
| SHA-256 built asset integrity | **PASS 48/48** | `docs/BATCH17_VERIFY.log`, `docs/DIST_SHA256.json` |
| Actual local HTTP GET, separate port 4197 | **PASS 48/48**, bytes match build SHA-256 | `docs/BATCH17_HTTP.json` |
| Missing HTTP resource | **PASS, 404** | `docs/BATCH17_HTTP.json` |
| Source-tree SHA-256 | Recorded | `docs/BATCH17_SOURCE_ROOT.txt`, `docs/BATCH17_SOURCE_MANIFEST.json` |
| ZIP integrity/CRC | Verified after packaging | Python `zipfile.testzip()` result |
| Live interactive Chromium UI | **NOT TESTED** | Local browser navigation previously blocked or timed out |
| Real browser IndexedDB persistence/reload | **NOT TESTED** | Cannot infer from Node model tests |
| Service-worker offline reload | **NOT TESTED** | Static asset and HTTP checks are not offline acceptance |
| Screen-reader/physical mobile acceptance | **NOT TESTED** | No assistive-device session |

The first consolidated run failed seven checks: five inherited service-worker revision assertions still required v16; a new tone fixture referenced a single-character word that is not in the word bank; and a newly authored weak-priority threshold assumed the wrong score. The revisions and cases were corrected **without removing tests**. A subsequent run exposed a duplicate fixture ID when a test manually overwrote a question ID; the test now uses an actual naturally selected full-word pinyin question. Final results: 248 tests passed, 0 failed.

The first HTTP attempt did not pass because another service could occupy the default port. The final test deliberately launched the local Node server on the **isolated port 4197** and verified all 48 built asset bodies against SHA-256 plus the expected 404.

## Scope boundaries

Original Mandarin demo content only, **not** official HSK coverage and not independently linguistically certified. No remote repositories, credentials, accounts, DNS, public release, hosting or production modifications. Official HSK redistribution rights OPEN, full official corpus NOT VERIFIED, audio linguistic review NOT TESTED, owner visual approval PENDING. Real-world browser durability and offline qualification remain unverified.
