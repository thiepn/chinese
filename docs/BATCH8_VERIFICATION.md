# Batch 8 — Consolidated Verification Report

## Actual implementation

Implemented five pure modules (`dialogues.mjs`, `wordbook-lab.mjs`, `pathways.mjs`, `review-strategy.mjs`, `progress-diagnostics.mjs`) and integrated their screens, actions, local event histories and responsive styles into the existing application. Ten authored Mandarin example dialogues provide 30 turns and 20 assessment items. Saved-word exercises test meaning and tone-sensitive pinyin; explanation reveal is tracked as assisted. Learning paths and review priority are descriptive heuristics; they are not calibrated recall estimates. No official HSK data is included.

## Source and compatibility

- Source fingerprint SHA-256: `66e7012c42497410ad56d85cf2c15ed733e9c8da3de09f82c90338f0f314988c` (deterministic concatenation of sorted relative source/test/script file paths and SHA-256 digests; see `BATCH8_SOURCE_MANIFEST.json`).
- Previous source retained: 74 demonstration lessons, 12 mini-readings, existing character/word and sentence review and practice features, v1 backup format, placement, bookmarks and guided practice checkpoints.
- New optional v1 state fields: `dialogueEvents`, `wordPracticeEvents`. Legacy states missing these fields are accepted. New events do **not** modify scheduled review `events` or grant independent mastery.
- All 74 lessons are still explicitly non-HSK demonstration content. New dialogue prose is not professionally audited; local device TTS is not certified.

## Executed consolidated verification

| Test | Status | Evidence |
|---|---|---|
| `npm run build` | **PASS** | `BATCH8_BUILD.log`; 30 static assets |
| `npm test` | **PASS** | `BATCH8_TEST.log`; **86/86**, zero failures |
| `npm run verify` | **PASS** | `BATCH8_VERIFY.log`; **30/30** asset checks |
| HTTP local server | **PASS** | `BATCH8_HTTP.log`; **9/9** endpoints HTTP 200 with nosniff |
| Chromium headless real origin | **NOT TESTED** | `BATCH8_BROWSER_STATUS.log`; exit **124** (timeout), no valid loaded-app acceptance evidence |
| Browser IndexedDB read/write/reload | **NOT TESTED** | No working live Chromium integration |
| Service-worker offline reload | **NOT TESTED** | No working live Chromium integration |
| Real physical mobile / screen reader | **NOT TESTED** | Environment not available |

This is runnable source with automated contract verification, **not** a production-qualified application. Browser/assistive technology behavior remains to be tested on a normal local machine.

## Invariants and restrictions

- No remote Git operations, credentials, network content fetches, production deployments or DNS changes.
- No official HSK 2025 source inventory ingestion or redistribution. Full inventory rights/legal qualification remains open.
- No final owner visual approval claimed; learning UX needs independent human acceptance.
- Automated tests protect source-level saved state, v1 backup import/export, older lesson counts, distinct exercise histories, tone feedback, review-prompt deduplication and source-only boundaries.

## Reproduce

```bash
npm run build
npm test
npm run verify
npm start
```

Navigate to `http://127.0.0.1:4173/` in your normal browser. Browse Today → Learn → Review → Practice Lab → Readings → Dialogues → My Wordbook / Explore → Progress. Save words from Explore before trying Wordbook drills. Export progress from Settings for a durable independent copy; browser-managed local data can be cleared or lost.
