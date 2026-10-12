# Batch 6 — Consolidated Implementation Verification

## Source scope

Local-only derivative of the user's Batch 5 ZIP. No remote repository action, account, secret, cloud API, production deployment or official HSK inventory ingestion. All 74 previous independently authored demonstration lessons and 12 connected short readings remain unchanged.

## Implemented and connected

- Optional six-question placement check with persisted answers, conservative recommendation, and no mastery credit.
- Three-question in-lesson formative check with character recognition, word meaning and typed tonal pinyin; intentionally not persisted as certification or scheduled mastery.
- Focused weakness remediation using review and supplemental practice errors; guided practice drills target pinyin, meanings and contextual sentences.
- Two new connected sentence assessment modes, with original narrative ordering hidden from the test prompt; supplemented reading history remains independent of scheduled review history.
- Separate focused practice plans for sentence reasoning and pronunciation.
- Seven-day observation comparisons and skill diagnostics (scheduled versus optional practice evidence clearly separated).
- Keyboard review shortcuts; six-slot mobile navigation, revised responsive teaching and onboarding styles.
- Read-only storage status/estimate, revision indicator and more explicit import-replacement preview. No automatic sync or backup-loss guarantee.
- Offline shell cache revision v6 includes all new modules.

## Tests executed

| Test | Observed result | Evidence |
|---|---|---|
| Node unit/regression suites | **59/59 PASS** | `BATCH6_TEST.log` |
| Application build | **PASS**: 24 static files | `BATCH6_BUILD.log` |
| Built asset SHA-256 verification | **24/24 PASS** | `BATCH6_VERIFY.log` / `DIST_SHA256.json` |
| Local HTTP server | **PASS**: HTTP 200 for root, placement, sentence assessment and service worker | `BATCH6_HTTP.log` |
| Real headless Chromium loading | **NOT TESTED** successfully: process timed out (exit 124) | `BATCH6_BROWSER_EXIT.txt`, stderr log |
| Interactive loaded Chromium keyboard and mobile acceptance | **NOT TESTED** | Requires permitted browser session |
| Real IndexedDB commit/reload/import verification | **NOT TESTED** | Requires permitted browser session |
| Offline service-worker reload | **NOT TESTED** | Requires service-worker-capable browser origin |
| Physical-device and screen-reader acceptance | **NOT TESTED** | No physical device/AT exercise |
| Independently reviewed linguistic correctness and audio | **NOT TESTED** | Demo examples only |

**Important:** Source-level tests and HTTP 200 responses are not evidence that an interactive browser journey works. Browser permission policy was not bypassed. The Chromium command timed out, so browser-loaded tests are not reported as passed.

## Preservation / regression conditions

- Demo lessons: 74 retained; reading texts: 12 retained.
- Old v1 learner backups missing `placement`, `practiceSession`, reading/drill histories, or bookmarks remain accepted by schema-level tests.
- `STATE_VERSION` and v1 export/import format unchanged. Placement answers use an optional field; no automatic migration of review history.
- Supplemental reading modes `line-meaning` and `line-order` are added as permitted modes without changing previous event meanings.
- Placement and lesson formative prompts never grant independent scheduled mastery.
- Real official HSK curriculum is neither present nor certified; rights, full source inventory, teacher review, audio quality, final owner visual acceptance and deployment remain open.

## Run

```sh
npm start   # opens 127.0.0.1:4173; keep this process running
npm test
npm run build
npm run verify
```

Check real browser manually: start optional placement, finish six choices, reload, confirm summary; introduce a lesson, try the three formative questions; open Practice Lab (sentence and pronunciation focus), complete a saved guided question, reload, verify recovery; create review history and examine the coach, check Progress/Settings, export and import a test backup; reload offline after first successful online load. Preserve original progress by exporting a separate backup before destructive restore tests.
