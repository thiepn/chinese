# Product Qualification and Quality Improvement Phase — 2026-11-17

Local-only qualification of the current tree. Every claim below is backed by a
named artifact or an exact command result; nothing here claims physical-device,
human, or rights testing that did not run.

## Method

1. Baseline: `npm test`, `npm run build`, `npm run verify` on the untouched tree.
2. Real end-to-end browser testing on headless Microsoft Edge (Playwright, CDP),
   desktop 1440x900 and mobile 390x844 (plus 320/1440 runs inside the main
   suite), against a locally served `dist/` on `http://127.0.0.1:4173`.
   Tooling: `scripts/c9_browser_acceptance.py` (existing suite, 140 checks) and
   `scripts/qualification_supplement.py` (new, 17 checks covering the
   post-C9-57 surfaces the existing suite predates).
3. Every reproduced defect was repaired, re-verified, and committed separately
   with its own evidence (see "Commits" below).
4. Catalog counts, build verification, and release documentation were
   reconciled against the source (this document and the README status header).

## Defects reproduced and repaired

| # | Defect | Impact | Repair | Verified by |
| --- | --- | --- | --- | --- |
| 1 | Committed `dist/` was built at the 2026-10-12 import and never rebuilt; 699 commits (476 touching `src/`) followed. `npm start` served the old 74-lesson "Character Study" shell while the source is the 428-lesson "THIEPN Chinese" product. | The runnable product was an entirely different app generation; the repo's own build verification (`npm run verify`) failed at that HEAD because the stale shell lacked the production startup entry points. | Rebuilt `dist/` (344 assets) and `docs/DIST_SHA256.json` from current source; committed. | Commit `0d069bb`; `npm run verify` PASS; acceptance precondition "Exact source versus local build" PASS. |
| 2 | `npm run verify` had no source-parity guard — its SHA-256 manifest only proved `dist/` matched itself, which is why defect 1 stayed invisible. | Build drift could recur silently. | `scripts/verify.mjs` now fails on any missing/stale/unexplained `dist/` file ("run npm run build"), keeping `index.html` build-rewritten by design. | Commit `b53bc47`; positive run PASS; negative runs: tampered `dist/` → "Dist hash mismatch"; edited `src/` without rebuild (the historical drift case) → "Stale dist copy of src/lexicon.mjs". |
| 3 | `tests/server.test.mjs` pinned the pre-C9 product brand "Character Study" and passed only against the stale build. | One green test asserted a product identity that the shipped source no longer has. | Repinned to the current "THIEPN Chinese" shell identity (per `docs/CONCEPT9_IMPLEMENTATION_CONTRACT.md`). | `npm test` 504/504 with the repaired pin. |
| 4 | `scripts/c9_browser_acceptance.py` crashed while printing its JSON report on Windows consoles (cp1252 cannot encode the check details), discarding all 140 results after running them. | The established acceptance tool could not report results on this platform. | UTF-8 stdout reconfiguration in the reporter. | The 140/140 run below completed and reported. |
| 5 | Tooling defects in the new supplement (stray closure return aborting every check; assertions that ignored collapsed `<details>` disclosures and CSS-transformed labels). | False FAILs that would have misidentified app defects. | Fixed the tool; a DOM probe confirmed the app copy and behavior were correct in all three cases (inspiration caveat present in the disclosure, readiness pre-study deliberately behind the assisted-support gate, listening selector anonymized as "N. Lesson N"). | Final supplement run 17/17 PASS. |

**No learner-data defect was found or introduced.** Learner identities, saved
progress, review history, the v1 backup format, curriculum content, scheduler
authority, existing branches and PRs are untouched. The rebuilt `dist/` ships
the same state schema the tests round-trip (504/504).

## Verified evidence (exact results)

| Check | Result | Where |
| --- | --- | --- |
| Node regression suite | 504/504 PASS, 0 fail, 0 skip | `npm test` |
| Build | PASS, 344 assets, SHA-256 manifest regenerated | `npm run build` |
| Build verification incl. new source-parity guard | PASS, 344/344 assets, 428 non-HSK lessons | `npm run verify` |
| Browser acceptance (boot, routes, journeys, grading, reload, offline, dark mode, keyboard, accessibility landmarks, responsive 320/390/1440) | 140/140 PASS, 0 FAIL, 0 NOT_TESTED | `docs/QUALIFICATION_2026-11-17_ACCEPTANCE.json` |
| Browser supplement (free composition honesty, roleplay improvisation, reading readiness + pre-study, hidden-target listening, sound-family/radical drills, word review deck, progress honesty labels, backup export/preview/REPLACE restore, 3-digit grammar deep links, multi-tab integrity, zero console errors/CSP violations) | 17/17 PASS, 0 FAIL, 0 NOT_TESTED | `docs/QUALIFICATION_2026-11-17_SUPPLEMENT.json` |
| Catalog counts vs source | 428/176/202/190/1,130/1,020/4,127 confirmed by module import | README status header |

Items previously recorded as NOT TESTED and now covered by real browser
evidence at these commits: browser UI acceptance, IndexedDB persistence across
reload, service-worker offline reload and stale-cache migration, browser-based
backup restore (export → validated preview → `REPLACE` → functional app), and
multi-tab interactions (transactional writes, cross-tab refresh).

## NOT_TESTED — unchanged human and legal gates

These were not tested here and no automated evidence substitutes for them:

- **Physical assistive-technology acceptance** (real screen readers, keyboard
  hardware). Automated checks cover DOM landmarks, labels and focus handling
  only.
- **Audio**: device TTS is the only speech source; no recording quality,
  pronunciation accuracy, or audio rights review has happened.
- **Human linguistic review** of the Mandarin teaching content (pedagogy,
  naturalness, accuracy). Automated integrity checks cover corpus consistency
  (pinyin-syllable alignment, evidence indices, schema invariants), not
  correctness of the Chinese itself.
- **Owner visual approval** (light/dark, desktop/mobile).
- **Official HSK rights and inventory** — deliberately excluded from the corpus.
- **Production deployment** — not attempted, not authorized.

## Disposition against the Batch 20 freeze decision

`docs/BATCH20_VERIFICATION.md` required post-freeze progress on five items:

| Gate | Disposition at 2026-11-17 |
| --- | --- |
| Browser integration | **Automated-qualified**: 157 browser checks PASS locally (140 + 17), including the previously open persistence/offline items. Physical-device passes remain. |
| Data recovery | **Automated-qualified**: backup preview + `REPLACE` restore and multi-tab transactional integrity verified in-browser; storage health/recovery center intact. |
| UX accessibility | **Partially qualified**: landmarks, labels, focus continuity, keyboard dialog handling and responsive fits are automated-PASS; real AT acceptance remains NOT_TESTED. |
| Human visual review | **OPEN** — owner approval pending. |
| Legally qualified educational content | **OPEN** — linguistic, audio and rights review pending. |

**PUBLIC RELEASE — still NO GO**, for the two OPEN rows above only. The
engineering-side gates no longer block a private/local demonstration.

## Recommendation

1. **Release qualification path (recommended next):** run the two open human
   gates — a screen-reader pass (NVDA/VoiceOver + keyboard-only) and owner
   visual approval using the captured artifacts — then commission the
   independent linguistic review before any public or classroom use. Treat the
   linguist's corrections as the next content batch.
2. **Development path (optional):** the only development work with demonstrated
   user value left is on `docs/ORIGINAL_P61_P80_FEATURE_ROADMAP.md`'s OPEN list
   (licensed stroke-order data, confusable-character pairs, deeper dictionary
   editorial, broader graded-reading corpus). Do not add new learning modes:
   the product reached its feature freeze, and quality evidence is now the
   scarce asset.
3. **Process:** keep `npm test && npm run build && npm run verify` as the
   mandatory consolidated check (the verify parity guard now enforces build
   freshness), and run both browser suites before any release cut.

## Commits produced by this phase

- `0d069bb` fix(build): reconcile runnable dist/ with 699 commits of source drift
- `a72dd70` test(qualification): supplemental browser acceptance for the November phase surfaces
- `b53bc47` fix(verify): guard npm run verify against source-to-build drift
- (this document, README status header, package.json version label, and the two
  result JSONs — the documentation/evidence commit)

All commits are local. Nothing was pushed, merged, deployed; no PR, branch or
repository setting was changed.
