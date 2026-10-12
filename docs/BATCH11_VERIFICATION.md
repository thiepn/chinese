# Batch 11 — Executed source and integration verification

**Scope:** Local disposable working tree extracted from the complete Batch 10 source ZIP. No remote repository, protected official HSK data, authentication accounts, credentials, hosting or production access.

## Delivered features

- Six-stage **Daily Journey** linking preparation/explicit character teaching, two documented demo vocabulary examples, contextual sentence interpretation, tone-sensitive pronunciation recall and follow-up.
- Saved, resumable `courseJourney` stage cursor, feedback and assisted-response flag. `courseEvents` records independent/assisted/wrong attempts separately from scheduled grades.
- Review cards introduced by explicitly finishing the journey use the existing `addLesson`; no success grade is fabricated. The legacy direct lesson-introduction and guided practice experiences remain available.
- Guided-journey completion counts, six original curriculum-unit milestone cards, nonblocking related-learning prerequisites, word/stories/dialogue navigation, and course-first Today/Learn/Progress flow.
- Responsive desktop/mobile layout and keyboard-operable selection and answer controls with helpful accessible text. Final owner visual sign-off is not implied.

## Genuine executed tests (12 October 2026)

| Check | Result | Evidence |
|---|---|---|
| `npm test` Node contract/regression tests | **139/139 PASS** | `BATCH11_TEST.log` |
| `npm run build` | **PASS**, 39 static assets | `BATCH11_BUILD.log` |
| `npm run verify` (SHA-256 + content boundary) | **39/39 PASS** | `BATCH11_VERIFY.log`, `DIST_SHA256.json` |
| Local HTTP shell/static modules | **10/10 HTTP 200** | `BATCH11_HTTP.json` |
| Missing-route negative test | **Expected HTTP 404** | `BATCH11_HTTP.json` |
| Read-only browser-independent DOM-stub route smoke | **PASS**, initial Journey selection renders | Command output recorded in development execution, not a substitute for real browser |
| Archive CRC integrity | See package digest and integrity check | ZIP packaging verification |
| Real Chromium UI acceptance | **NOT TESTED** | Prior environment blocked localhost; no passing live-browser evidence |
| Actual IndexedDB reload/offline service-worker behavior | **NOT TESTED** | Browser origin integration unavailable |
| Real screen-reader and device acceptance | **NOT TESTED** | Requires physical/accessible browser testing |

### Regression and safety coverage

Batch 11 adds **21** new tests on top of the **118** preserved historical tests. They check: all 74 lessons generate valid question types; exact six-stage progression; preparation and answer gating; first-grade feedback; durable hint flag before reveal; negative and independent cases; explicit completion; preservation of current review scheduling and grades; aborted journey history; legacy v1 JSON backup compatibility; course event deduplication; unit milestones distinct from simple exposure; conservative story/dialogue linking; source modules/route/offline cache wiring; and non-official data boundaries.

### Resolved failures during consolidated run

The first run reported one new test assertion that mistakenly treated an ordinary event ID as invalid, and four older tests pinned the previous service-worker cache revision. The invalid-ID assertion was corrected to supply an actually invalid blank ID. Cache checks were updated to require the genuine Batch 11 version, while the service worker was updated to cache **both new modules**. No assertions were removed and no release gate was claimed passed without execution. The rerun passed **139/139**.

### Known limits and product gates

No independently approved Mandarin speech corpus; device TTS voice, if installed, is an uncertified convenience. No authenticated multi-device synchronization or full official HSK content. Full browser data persistence, service-worker offline reload and complete UI/a11y acceptance have not been demonstrated. Browser-managed IndexedDB is not a substitute for portable user backups. All supplementary learning attempts remain distinct from scheduled-review mastery, and even guided course completion is not proficiency certification.

**Result:** Source implementation batch complete; production and official HSK corpus publication **NO GO**. Continue substantial local source development with consolidated testing rather than blocking all work on unrelated browser environment constraints.
