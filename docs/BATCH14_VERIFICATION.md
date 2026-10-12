# Character Study — Major Build Batch 14 Evidence

Date: 12 October 2026. All development occurred inside a local isolated copy extracted from Batch 13. No remote repository, credential, DNS, or production operations were performed.

## Source custody

- Source-tree SHA-256 (deterministic relative paths + NUL + bytes + NUL, sorted, `src/`, `scripts/`, `tests/`, and `package.json`): `0b9bf1f7361a2e64c3faa132932cc2f5906c4c2faab867249190f4bf34ba1d99`
- 63 source/test/tool files hashed individually in `docs/BATCH14_SOURCE_SHA256.json`.
- Original Batch 13 source is preserved in its separate ZIP; this new ZIP is a standalone local source candidate.

## New implementation

1. `src/sentence-ladder.mjs`: 74 lesson-linked four-stage exercises, durable optional checkpoint and response events, error-led adaptive suggestions, independently graded written pinyin, recorded assistance, legacy validation.
2. `src/sense-contrast.mjs`: two-context teaching contrasts for 12 senses, transparent outstanding-error prioritization.
3. `src/app.mjs`, `src/index.html`, `src/styles.css`: new Sentence Ladder route and user controls; Today and Learn adaptive panels; connections to readings/dialogues; accessible responsive chunk buttons and keyboard input; answer-concealment behavior.
4. `src/study.mjs`: optional extension fields and input validation, without changing the legacy state schema version or scheduled-review events.
5. `src/sw.js`: new cache version v14 and two additional offline modules.
6. New source-level tests and persisted-help, malformed-import, ongoing checkpoints, and no-false-mastery regression coverage.

## Consolidated verified results

- **PASS:** 204 of 204 Node automated tests, 0 failed; log: `docs/BATCH14_NODE_TESTS.log`.
- **PASS:** `npm run build`, 43 built assets.
- **PASS:** `npm run verify`, SHA-256 verification for all 43 built assets.
- **PASS:** All 43 static built resources responded HTTP 200 from a temporary local HTTP server. Expected 404 for a missing resource.
- **PASS:** Archive integrity is to be verified after packaging; archive SHA-256 is reported separately.
- **NOT TESTED:** End-to-end live Chromium interaction, IndexedDB saved state reload, service-worker offline reload, real screen-reader and physical mobile usability. A direct headless Chromium attempt timed out after 9 seconds without returning a DOM. Passing Node and HTTP tests does not imply those browser behaviors passed.

## Compatibility and substantive limitations

- All 74 demo lessons, 12 readings, 10 dialogues and previous practice features remain in source; tests cover all 74 ladder configurations.
- The older `formatVersion: 1` backup is supported; optional `ladderSession`/`ladderEvents` are checked without requiring them for older backups.
- Supplementary attempts and assisted answers **never** grant scheduled-review mastery; actual browser persistence must still be checked on a supported device.
- Sentence reconstruction is evaluated against the **original demonstrated sentence**, not all valid Chinese alternatives. Chunks are orthographic, not certified lexical segmentation.
- Tone grading checks *typed pinyin*, not recorded or live speech. Device TTS is not independently linguistically validated.
- Author-created demo content only; **no protected official HSK inventory**. Rights and full-corpus verification remain unresolved. Final visual direction still lacks owner approval.

## Run

`npm start` from `character-study`, using Node.js 20+. Open `http://127.0.0.1:4173/` in a normal browser. For consolidated source tests run `npm test && npm run build && npm run verify`.
