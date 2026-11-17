# THIEPN Chinese — Release Candidate 1 (1.0.0-rc1)

Feature-frozen release candidate assembled from the verified functionality at
`4e159489a898b61deed13ea6954c8c848c76762c` (branch
`build/integrity-consolidation`; this evidence record is its child commit and
carries the local tag `v1.0.0-rc1`). Scope freeze: no curriculum, learning
modes, architecture, or cosmetic changes were made beyond one demonstrated
release-blocking defect fix (below). No learner state, curriculum content,
backup format, or scheduler authority changed.

## Release-blocking defect fixed in RC1

The installable PWA advertised the pre-C9 identity: `manifest.webmanifest`
carried `name "Character Study — Mandarin Learning"` and
`short_name "Character Study"` while the product shell is "THIEPN Chinese" —
an installed app would have contradicted the product's own title. The icon
also self-described as a "test application icon". Both are product metadata;
the legitimate feature name "Character Study" (the character-study screen and
curriculum group names) is intentionally unchanged. RC diff: 8 files,
13 insertions / 13 deletions (identity metadata in `src/` and `dist/`,
regenerated manifest and build stamp, version label, README header).

## Release gates

| Gate | Result | Provenance / notes |
| --- | --- | --- |
| Node regression suite | **PASS** 524/525 (0 fail, 1 skip) | this tree; skip = mac/linux launcher needs `sh` (absent on this host) |
| Delivery-integrity suite (PR #97 architecture + completeness pins) | **PASS** 20/21 executable | stale-source refusal, stale-start rebuild, build/verify failure stops, manifest tamper, missing/extra dist assets, CRLF≡LF invariance, source-digest and manifest validation, SW cache identity (+ negative), launcher routing, real Windows launcher (any cwd, failure propagation) |
| Build | **PASS** 344 assets | portable SHA-256 manifest + `docs/BUILD_STAMP.json` |
| Reproducible build | **PASS** | two consecutive builds byte-identical (manifest, stamp, compiled startup) at `ee69299` and again at `4e15948` |
| Verification (`npm run verify`) | **PASS** | delivery gate + shell/offline guard + 428 non-HSK demo lessons |
| Release artifact (dependency-free) | **PASS** | `git archive` extract (948 files, no `node_modules`) → `run-windows.bat --check-only` gate+verify pass with Node.js alone |
| Browser acceptance vs the **release extract** | **PASS** 140/140 · 0 FAIL · 0 NOT_TESTED | headless Edge, 320/390/1440px, provenance `4e15948` |
| Browser supplement vs the **release extract** | **PASS** 17/17 · 0 FAIL · 0 NOT_TESTED | provenance `4e15948` |
| Learner-data integrity | **PASS** | v1 state/backup round-trips in suite; IndexedDB grading + persistence across reload ("native grading and reload"); backup export → validated preview → `REPLACE` restore; multi-tab transactional writes + cross-tab refresh |
| Offline behavior | **PASS** | service-worker offline cached shell, stale-cache migration (v58→current), cache identity `character-study-working-v75-p77-consequence-dialogues` consistent across `dist/sw.js` / `src/sw.js` / `app.mjs` |
| Windows launcher on Windows | **PASS** | `run-windows.bat` from repo and from the release extract, exit codes propagated |
| PR #97 compatibility | **PASS** | its tooling is adopted and its own test suite runs green here; only its October-vintage artifacts are excluded (see below) |

**NOT_TESTED (no environment or authority here):** mac/linux launcher runtime
(no `sh`, no WSL distribution; static pin passes) · real missing-esbuild
message path (simulated in tests) · physical screen-reader/AT acceptance ·
real device audio/TTS · human linguistic review · owner visual approval.

## Reproducible build evidence

`npm run build` writes deterministic artifacts: identical sources produce
byte-identical `dist/`, `docs/DIST_SHA256.json` (line-endings-invariant
hashes) and `docs/BUILD_STAMP.json` (source digest + SW cache identity).
Any stale, tampered, incomplete or over-full `dist/` is refused by
`npm run verify`, `npm run serve` and `npm start` alike (`scripts/dist-gate.mjs`).
To qualify any checkout: `npm start --check-only` (Node.js only).

## Known limitations (accepted product scope, unchanged)

- Original demonstration curriculum (428 lessons, 176 readings, 202
  dialogues, 190+26 grammar lessons); **no official HSK content** and no
  proficiency claims. Mandarin material is not independently certified.
- Speech is device TTS only; not verified pronunciation audio.
- Local-first storage only (IndexedDB + JSON backup export); no cloud, no
  accounts; browser storage is not a permanent backup — export backups.
- Written-answer graders are conservative exact-form checkers; free
  composition deliberately makes no correctness judgments.

## Remaining blockers, separated by owner

**Engineering (for RC/private beta): none open.** All engineering gates pass.

**Requires people or physical devices (blocks public release, not a
disclosed private beta):**
1. Physical screen-reader and keyboard acceptance (real AT).
2. Independent human linguistic review of the Mandarin content.
3. Audio quality and rights review (device TTS output).
4. Owner visual approval (light/dark, desktop/mobile).

**Legal:** official HSK rights/inventory deliberately excluded; any future
official-syllabus claim needs rights clearance first.

## PR #97 disposition

`fix/dist-delivery-integrity` @ `34e4b17` is **superseded**: its build-integrity
architecture (portable hashing, build stamps, serve/start gating, launchers,
tests) is merged here with two additional completeness protections, and its
stale October-vintage `dist/`/manifest/stamp are deliberately not merged. Keep
the branch untouched until an authorized integration closes the draft PR.

## Recommendation — private beta: **GO**, with conditions

1. Distribute only to consenting testers with the disclaimer that this is
   uncertified demonstration content (README + Settings → Curriculum status
   already state it).
2. Tell testers to export JSON backups from Settings (browser storage is not
   a backup).
3. Collect defects only — no feature requests during the freeze.
4. Public release remains **NO GO** until the four human gates above pass.

Run: Node.js 20+ → `npm start` (or `run-windows.bat` /
`run-mac-linux.sh`) → `http://127.0.0.1:4173/`. No `npm install` needed for
the packaged build; `npm install` is only required to rebuild from source
(pinned esbuild).
