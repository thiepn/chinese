# Batch 3 consolidated verification

**Result:** Source, build and tests PASS. HTTP-loaded browser qualification NOT TESTED due to administrator-restricted localhost navigation. This is a development candidate, not production certified.

- Source-tree SHA-256: `0f37cbd4a94d01a093cc6acb1f8689f2084111b338c9e9f7022d4b6e2a371134` (canonical code hash; see `BATCH3_SOURCE_SHA256.json`).
- `npm run build`: PASS; 15 static assets.
- `npm test`: **28/28 PASS** (22 inherited + 6 new story, lexical and compatibility cases).
- `npm run verify`: **15/15 SHA-256 assets PASS**.
- Local Node HTTP server: PASS; status and CSP checks, missing-file rejection.
- Chromium live app: **NOT TESTED**, `net::ERR_BLOCKED_BY_ADMINISTRATOR` at `http://127.0.0.1:4173/`. No policy bypass.
- Live IndexedDB persistence/reload: **NOT TESTED**.
- Real service-worker offline reload: **NOT TESTED**.
- Real mobile keyboard, accessibility, and screen-reader acceptance: **NOT TESTED**.

## Implemented additions

- 12 authored connected story texts (3 sentences each), 4 exercise modes (comprehension, fill the blank, chunk reordering, context-linked tone-aware pinyin), vocabulary hints and assistance-aware grading.
- 117 derived unique demo word entries with meaning/pinyin lookup and linked character lessons. No official HSK membership.
- Separate persistent reading attempts and statistics. Old state and backups remain supported without fabricated mastery.
- Review-session settings: focus by skill, limit 5/10/20/50, skip while keeping due status, session summary.
- Responsive story UI, additional mobile navigation, easy Settings access, pinyin readability.

## Explicit blockers

Official HSK syllabus redistribution **OPEN**; complete inventory **NOT VERIFIED**; independent linguistic/audio review **NOT TESTED**; visual design owner approval **PENDING**; remote deployment **NOT AUTHORIZED**.

The ZIP includes source files, the prebuilt runnable `dist/` and these reproducible logs.
