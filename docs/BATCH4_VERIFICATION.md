# Major Build Batch 4 — Implementation and Verification

**Date:** 2026-10-12

## Actual source changes

- Retained all **74** original Mandarin demo lessons, **12** short readings (**36** sentences) and the word index from Batch 3.
- Created `src/drills.mjs` with six deterministic supplemental exercise formats for all 74 characters/lessons (**444** combinations), with direct answer checking and tone-sensitive word-pinyin input. These are demonstration exercises, not validated HSK material.
- Created `src/lesson-guides.mjs` with manual contextual explanations for the first 25 characters, plus safe existing-lesson-derived comparisons for remaining lessons.
- Created `src/insights.mjs` for error-prioritized due-review ordering, activity observations and weak-target summaries. The simple demonstration scheduler was not replaced or calibrated.
- Created `src/practice-records.mjs` for independent supplemental drill events and reading bookmarks. Integrated optional fields into `src/study.mjs`, retaining previous `STATE_VERSION=1` and backup `formatVersion=1` compatibility.
- Updated `src/app.mjs` and `src/styles.css` with the Practice Lab route, deeper lessons, story bookmarks/focus/large-text, weak-first review, 14-day analytics and responsive exercise presentation.
- Updated app navigation, offline cache version and precache asset list. All material remains non-official original demonstration content.

## Consolidated execution

| Evidence | Actual result |
|---|---|
| `node --test tests/*.test.mjs` | **PASS 36/36**, 0 failures, including eight new Batch 4 tests |
| `node scripts/build.mjs` | **PASS**, 19 bundled static assets |
| `node scripts/verify.mjs` | **PASS**, 19/19 asset hashes verified |
| Local HTTP `curl -I http://127.0.0.1:4173/` | **PASS 200 OK**, including `nosniff` and CSP response headers |
| Chromium headless real-origin navigation | **NOT TESTED**: timed out after 12 s before navigation evidence was produced; no browser pass inferred |
| Real IndexedDB reload/write | **NOT TESTED** in a browser |
| Service worker offline reload | **NOT TESTED** in a browser |
| Screen-reader, physical keyboard and phone acceptance | **NOT TESTED** |
| Source artifact checksums | `docs/BATCH4_SOURCE_SHA256.json`; built assets: `docs/DIST_SHA256.json` |

**Existing progress preserved at model level:** `validateState` accepts older backup documents without new optional fields, which is exercised by a new test. Browser-side old-data migration has not been independently executed in a real browser.

## Important limitations and preserved boundaries

- Review priority is an uncalibrated heuristic; analytics report *observed answers*, not mastery probabilities.
- Supplemental drills, reading bookmarks, and hint exposure never award scheduled-review mastery.
- New lessons and content examples have not been independently reviewed by a Mandarin linguist and are **not** official HSK curriculum claims.
- Device speech synthesis is not independently certified audio.
- Official HSK source rights, full inventory reconciliation, audio qualification and owner visual approval remain unresolved.
- No remote repository, account, credential, hosting, DNS or production resources were touched.

## Run after extraction

```bash
npm test
npm run build
npm run verify
npm start
```

Open `http://127.0.0.1:4173/` and exercise Today, Learn, Review, Practice Lab, Readings, Explore, Progress and Settings. Export a backup before clearing site storage. Manually validate the unavailable live browser behaviors before relying on long-term offline data.
