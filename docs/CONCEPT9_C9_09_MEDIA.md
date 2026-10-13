# C9-09 — Concept 9 Reading, Listening and Conversations

Parent: 9a607005cbbce49b865a4bfcf86b0a3d4a1f15f7
Branch: feature/c9-09-clean-modular-scholar-reading-listening-conversations

## Source implementation
- New src/media-c9.mjs provides native-authority reading and conversation discovery, source-backed learning metrics, P34 continuation and ungraded turn navigation. Counts derive solely from existing readingEvents/dialogueEvents and original source arrays.
- src/styles-c9-media.css delivers the full Clean Modular Scholar reading/listening/dialogue layout, Hanzi-first text typography, Pinyin and English support hierarchy, feedback, mobile touch controls, light/dark semantic token parity, and source reading rails.
- src/app.mjs wraps original renderStories, renderDialogues and renderReader results. Original question choices, conversation missions, P33 scenario teaching, P34 listening-first transcript safeguards, P27/P28 reading questions and writing handoffs remain in their existing functions, not cloned into new grading engines.
- Independent reading Pinyin and English display toggles mark the current reading attempt assisted on first reveal. Native reveal and hint logic remains authoritative; original story-mode transitions reset only temporary UI support flags, not saved history.
- Conversation previous/next speaking-turn navigation focuses the native turn in-place without rewriting the questionnaire, revealing hidden P34 transcript or storing extra progress. Navigation resets on scenario selection.
- Auxiliary P34 and original beginner catalogs are progressively disclosed so the learner can reach the text or listening prompt first.
- src/index.html includes C9-09 styles last; src/sw.js precaches the new module/styles under a distinct offline cache version.

## Boundaries and limitations
- Original source IDs, authored dialogue/reading/word/grammar facts, learner-state and IndexedDB schemas, readingEvents/dialogueEvents/missionEvents/sentenceEvents writers and single native comprehension evaluators remain unchanged.
- Device Mandarin speech synthesis is not recorded or independently certified audio. No invented conversation completion, official HSK grade, fabricated answer, external network service or mastery store.
- Source-only implementation: NOT_TESTED. No tests, builds, CI, audits, migrations, merges, deployments or paid services. Browser and assistive-technology acceptance is deferred to C9-14.
