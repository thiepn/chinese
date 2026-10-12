# Batch 9 — Consolidated Implementation & Verification

**Status:** Source implemented and local checks passed; full interactive browser acceptance not established.

## Baseline

- Input ZIP: `character-study-batch8-working-app.zip` (SHA-256 `31176beffcbce7a1ee05805360d2a51c719f7569faef61cb744a80a401169ab7`)
- Source-tree SHA-256: `1840d49988386458fbc596fc44d2759cc529f0e9224dabf85980f57266c3a76b` (sorted source/test/package/README path+hash manifest in `BATCH9_SOURCE_MANIFEST.json`)
- Original `demo-lessons.mjs`, `stories.mjs`, `dialogues.mjs`, `study-storage.mjs`, `placement.mjs` bytes compared with input archive and preserved exactly.

## Actual checks

| Check | Result |
|---|---|
| `npm test` | **PASS — 100/100 tests** |
| `npm run build` | **PASS — 34 built files** |
| `npm run verify` | **PASS — 34/34 SHA-256 hashes** |
| Local HTTP on `127.0.0.1:4173` | **PASS — 9/9 working route/asset checks, unknown route 404** |
| Headless Chromium localhost navigation | **UNAVAILABLE — timeout exit 124**, no DOM returned |
| Actual IndexedDB persistence / local reload | **NOT TESTED** |
| Service-worker install / offline reload | **NOT TESTED** |
| Real mobile device / screen reader | **NOT TESTED** |

## New implementation

1. Tone diagnosis distinguishes phoneme/syllable and specific tones, with strict isolated syllable input unchanged and sentence-reference punctuation handled in the dedicated tone coach.
2. Word Sense Lab: twelve original sentence-context contrasts with optional help and distinct supplemental events.
3. Sentence Workshop: twenty-four exact Chinese reconstruction tasks, explicit restriction against grading natural paraphrases and answer-help status tracking.
4. Dialogue missions: meaning → supporting Chinese sentence → full written Pinyin, with 3-stage recorded outcomes for each of ten dialogues.
5. Saved-word practice focuses all / recently missed / unpracticed, and provides detailed written pinyin feedback.
6. Progress, navigation and mobile responsive surfaces expanded. New evidence records must never count as scheduled-review mastery.
7. Version-1 backups and prior learner state are still accepted; untrusted/invalid new event IDs, references and duplicates fail import validation.

## Reproduced defects and repairs

- Full-sentence Pinyin contained punctuation that the single-syllable Pinyin parser intentionally rejects. Fixed the **dedicated sentence-grade normalization** while retaining strict single-word validation (older regression requires `ni3?` invalid).
- An active dialogue mission could have exposed an English line via the original conversation-support control without marking the mission assisted. Reset language support at mission start and permanently mark such support as assistance.

## Scope limits and outstanding gates

Original demo curriculum only; no complete HSK corpus, official HSK rights clearance, professionally verified Mandarin corpus, certified device pronunciation, calibrated spaced repetition, final owner visual approval, remote repository modifications, production deployment, or credentials. Browser-origin behavior remains unverified despite successful static HTTP responses and Node tests.

## Reproduce

```bash
npm test
npm run build
npm run verify
npm start
```

Visit `http://127.0.0.1:4173/`. Routes for new features are `#/senses`, `#/workshop`, and a three-stage mission on `#/dialogues`.
