# Consolidated Development Verification — Batch 2

- Date: 2026-10-12
- Local source revision SHA-256 (canonical sorted source-tree record): `2e7444323699c8938fd56c2fdaa544f0208e44a04268ed6767b92f0a6becb801`
- Original demo lessons: **74**, not official HSK, no HSK membership claims.
- Related vocabulary instances: **148**, contextual sentence examples: **74**.
- Active recall targets per lesson: **6**.
- Build: **PASS** (`npm run build`, 12 static assets).
- Automated tests: **PASS** (`npm test`, 22 of 22).
- Dist SHA-256 integrity: **PASS** (`npm run verify`, 12 of 12).
- Local Node HTTP server functionality: **PASS**, included in tests.
- Real-browser Chromium navigation: **NOT TESTED** (`ERR_BLOCKED_BY_ADMINISTRATOR` when opening localhost).
- Actual IndexedDB write/reload and service-worker offline startup: **NOT TESTED** in a real-origin browser.
- Actual screen reader and device acceptance: **NOT TESTED**.

## Major changes

- 48 additional original demo lessons, bringing the total to 74.
- Six topic units and learning goal counts.
- Separate character/word pronunciation and sentence review targets, with legacy progress migration.
- Tone-aware numeric/diacritic pinyin checking and strict English/choice grading.
- Interactive Sentence Lab with sentence meanings and contextual cloze exercises.
- Distinct skill evidence counts and failure-safe assisted reveal handling.

## Restrictions and caveats

No official HSK syllabus data, remote repository modification, production deployment, domain changes, external accounts or credentials.
Original demo examples and speech synthesis are not independently certified. The review schedule is uncalibrated. Browser-managed progress requires regular user backups.
