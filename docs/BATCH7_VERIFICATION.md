# Batch 7 — consolidated implementation and verification

## Scope and provenance

Isolated local descendant of the preserved Batch 6 source ZIP. No remote repository or GitHub writes, DNS, hosting, accounts, credentials, production, or official HSK corpora. Original 74 non-HSK demonstration lessons and 12 readings remain intact. Demo samples have not been independently editorially certified.

## Implemented

- Two distinct context-specific story assessments across each of twelve readings (24 new question configurations): evidence-line identification and causal/sequence connections, with an explanation on checking. Wired to both Readings and durable supplementary guided practice.
- Sentence-specific pinyin and English help; selecting it flags the current practice answer as assisted. Per-sentence/word and whole-passage browser TTS, with switchable speech rate. Playback requires an installed Chinese voice and is **not** verified accurate or downloadable audio.
- Backward-compatible saved vocabulary (`bookmarkedWords` optional on existing v1 schema), wordbook filter, word saving in reading hints, Explore details and saved-word view in Progress. Strict validation rejects unknown/duplicate word identities.
- Real occurrence-based lesson-to-story context links, recent mistake prioritization with correction after independent successes, and responsive mobile/desktop layout improvements.
- Old reviews, reading events, six drill modes, two prior sentence modes, lesson checks, placement, guided checkpoints, offline modules and v1 backup semantics preserved. Existing independent review scheduler untouched.

## Evidence from current execution

| Verification | Status | Evidence |
|---|---|---|
| Consolidated Node test suite | **PASS 70/70** | `BATCH7_TEST.log` |
| Static application build | **PASS** | `BATCH7_BUILD.log` |
| Static asset SHA-256 check | **PASS 25/25** | `BATCH7_VERIFY.log`; `DIST_SHA256.json` |
| HTTP root/modules/CSS/service worker | **PASS**, six HTTP 200 responses | `BATCH7_HTTP.log` |
| HTTP security response headers | **PASS** CSP/no-sniff present | `BATCH7_HTTP.log` |
| ZIP CRC integrity | Reported after archive creation | `BATCH7_RESULTS.json` |
| Real browser route and interaction acceptance | **NOT TESTED** | Prior localhost Chromium policy/timeout blocker; no successful real-origin acceptance in this batch |
| Actual IndexedDB save/reload/backup in browser | **NOT TESTED** | Node tests cover validation only |
| Offline service-worker reload in browser | **NOT TESTED** | Presence/cache manifest alone is insufficient |
| Physical-device, Mandarin voice, screen-reader | **NOT TESTED** | Requires qualified device/browser observation |
| Official HSK inventory and rights | **OPEN** | No official corpus downloaded or distributed |

**Source fingerprint:** `bedd9cc6a18b8fa56da91e68d79ac2f99fd7638d0a728aad862147f327c715e9`. Method: SHA-256 of sorted `relative-path + space + sha256(file) + newline` for the 40 package source/code/test files. Built assets have separate SHA-256 manifests; this source fingerprint does not claim a Git commit.

## Remaining gates

Browser storage/offline/real navigation; human accessibility/visual review; actual Mandarin audio accuracy; source rights and official HSK inventory reconciliation all remain unresolved. Generic synthetic demo source development is allowed; production release is not authorized.

## Replay

```sh
npm test
npm run build
npm run verify
npm start
```

Start `npm start` and open http://127.0.0.1:4173/. Confirm real browser storage and offline manually on an authorized system before relying on this application for valuable learning progress. Export a backup before using reset/import functions.
