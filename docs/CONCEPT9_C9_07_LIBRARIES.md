# Concept 9 — C9-07 Vocabulary, Grammar and Sentence Libraries

Parent: `7b61dfcf346a8a31892289d2d08d72897f0b9b1b` on `feature/c9-06-clean-modular-scholar-character-study`.
Child: `feature/c9-07-clean-modular-scholar-language-libraries`.

## Source implementation
- `src/libraries-c9.mjs`: original-source vocabulary catalog with local query, saved and introduced filters and 12-item pagination, native word details and device-voice handoff; six original grammar chapter cards with attempted-lesson counts and native lesson selectors; all original sentence-topic cards with saved and attempted counts and native source-filtered selection.
- `src/styles-c9-libraries.css`: responsive light/dark scholarly library layouts, words/Pinyin/English hierarchy, mobile controls, clear filters, chapter progress, sentence context, native grammar, sentence and dictionary styling.
- `src/app.mjs`: presentation-only wrappers around the existing wordbook, grammar, sentence and Explore renderers. Native exercises, native search, all IDs and action handlers remain intact. One source-backed catalog results region is updated on input without dropping the input focus.
- `src/index.html`: stylesheet in existing Concept 9 load order.
- `src/sw.js`: offline precache includes both C9-07 files under a versioned cache.

## Original authority and truthfulness
- Source vocab: `WORDS`/`findWord`/`plain`; intro markers: `state.vocabularyIntroduced`; saved words: `state.bookmarkedWords`. Browsing does not create records.
- Grammar: `GRAMMAR_LESSONS` and `GRAMMAR_CHAPTERS`; attempted lesson counts derived exclusively from existing `sentenceEvents`, distinct from correct independent attempts.
- Sentences: `SENTENCE_LIBRARY`/`SENTENCE_TOPICS`, existing `bookmarkedSentences` and `sentenceEvents`. Topic entry resets conflicting display-only filters, then delegates to `openLibrarySentence` and the native renderer.
- Native writer ownership remains in `mutate`, the original wordbook and sentence exercises; no new assessment, SRS or storage engine, external audio or official HSK membership claims.

## Limitations
- Old study and exercise markup remains in native sections during the incremental visual migration. Final holistic visual comparisons, dark-mode contrast, actual browser keyboard/device interactions and offline behavior are not tested.
- No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services were executed. Previous branches, main, production and learner data unchanged.
