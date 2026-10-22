# Shared Visual Lexicon — Chinese Word Library consumer

This pilot consumes exactly 12 pinned Chinese bindings from `thiepn/languages@541159c3462960f9b2c2273598befc6f3dd2e322`, using the native original `WORDS[].key` (`hanzi|plain(pinyin)`) with no translation matching. The catalog copy and each of its twelve local `src/visual-lexicon/assets/*.svg` are exact source Git blobs. Source asset rights labels remain "Original THIEPN illustration"; no textbook art is used.

The original C9 Word Library displays optional, lazy, alt-described art in read-only word cards only. An image error removes the figure, never the Hanzi, Pinyin, source evidence or study actions. The app's existing service worker retains its eight required runtime assets and opportunistically caches up to 12 successfully viewed local SVGs in the same CacheStorage namespace. Images are not required for offline readiness, so missing/evicted pictures simply leave text-only references; no new scheduler or progress store is introduced. Shell version in both `app.mjs` and `sw.js` is rotated together.

Every picture is absent from answer-graded recall; no account, backup, local storage, learner record, SRS grading, course structure or production host was changed. Original Japanese 103 illustrations and image cache ceiling of 48 are untouched.

This is a draft consumer implementation and is NOT a deployed feature. Node/browser/PWA checks and rights review are required before merge or deploy.

## Exact native whole-word repair

Executed draft CI initially found that some shared Chinese bindings described *character headwords* rather than genuine `WORDS[].key` Word Library records. The consumer now includes nine source-authored original whole-word entries `看书|kanshu`, `写字|xiezi`, `吃饭|chifan`, `喝水|heshui`, `水果|shuiguo`, `汽车|qiche`, `火车|huoche`, `飞机|feiji`, `学生|xuesheng` plus three original P31 `商店|shangdian`, `绿茶|lucha`, `冬天|dongtian`. Every entry was verified against original Chinese lesson `words` or P31 authored vocabulary and against the updated pinned Languages catalog. Twelve relevant SVGs are shipped; five pilot-only images not used in this Word Library have been retired. The original shared catalog continues retaining its character-headword bindings separately for future teaching surfaces. No learner-state or grade changes.
