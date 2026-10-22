# P1 — Chinese course-first canonical inventory and safety contract

Scope: same draft PR #91. P1 implements a **read-only source projection**, a deterministic machine-readable inventory CLI and live-data regression tests. It does not change the UI, default routes, grading, app/worker cache, learner storage, login or content. Next authorized phase is P2 navigation.

## Inventory command

Run \`node scripts/p1_course_inventory.mjs\` to emit JSON (no source writes), or \`node scripts/p1_course_inventory.mjs --output /tmp/chinese-course-p1.json\` to save it. Run \`node --test tests/p1-course-catalog.test.mjs\` then the original \`npm test\`, \`npm run build\` and \`npm run verify\` on a complete checkout.

The result includes:
- All 27 stable \`app.mjs\` routes with exact route-to-owner and future Home/Course/Review/Me destinations. \`legacyHash\` is preserved; **P1 creates no new routes**.
- 18 canonical state/content authority groups, covering lesson introductions, original scheduler, local IndexedDB, backups, course sessions, practice, vocabulary, grammar, reading, dialogue, writing, study blocks, review, source and offline identity.
- 16 authored source families, identified by source-file patterns and grouped by provisional study target, with explicit review-required rights and **NOT_VERIFIED** HSK mappings.
- Original-source hierarchy: target → existing original unit group → existing lesson ID → native lesson action and native word keys; level-specific grammar/readings/dialogues/missions stay in separately indexed native source shelves. HSK 6 and shared 7–9 have **no fabricated character units**.
- Seven level rows with real inventory counts, historical official benchmark metadata and explicit verification/rights fields. None is an official syllabus coverage percentage.

## Route migration and original owners

The exported \`P1_ROUTE_MIGRATION\` contains an exact row for each of these 27 routes:

- Home: \`today\`, \`plan\`.
- Course main: \`learn\`, \`explore\`, \`pathway\`, \`skills\`, \`advanced\`.
- Course source/detail: \`character\`, \`reader\`, \`stories\`, \`dialogues\`, \`wordbook\`, \`senses\`, \`grammar\`, \`sentences\`, \`pinyin\`, \`find\`, \`writing\`.
- Course exercise/activity: \`practice\`, \`workshop\`, \`journey\`, \`ladder\`, \`block\`, \`fluency\`.
- Review: \`review\`.
- Me: \`progress\`, \`settings\`.

These groups describe **future navigation**, not route replacements. P2 must preserve deep links and native actions until a tested compatibility transition has been implemented.

## Learning authority invariants

1. \`src/study.mjs\` retains \`STATE_VERSION=1\`, canonical card IDs, scheduled events and the existing \`gradeCard\`/\`dueCards\` scheduler. The catalog must never record a grade, automatically introduce a lesson, duplicate a practice record or create a second mastery system.
2. \`src/study-storage.mjs\` owns database \`character-study-local-v2\`, object store \`learner\`, key \`state\`, transactional revision and validation. Its only state writes are user-intended native actions.
3. Backup identity remains \`character-study-demo-backup\` formatVersion 1 with \`origin=original-editorial-demo\`. The read-only catalog is not included in persisted learner records. Preview/restore keeps explicit replacement and revision checks from \`backup-preview.mjs\`.
4. \`src/learning-hub.mjs\`, \`course-journey.mjs\`, \`wordbook-lab.mjs\`, \`sentence-workshop.mjs\`, \`reader-records.mjs\`, \`dialogues.mjs\`, and P43 private writing retain their original events/validators and ID owners.
5. P1's module is never imported from \`app.mjs\` or the service worker: no compiled runtime or cache contract change is needed. P2 may consume it, but any runtime import then requires an atomic app/SW/cache manifest revision and original offline acceptance.
6. Current original \`DEMO_ONLY\` or independently authored sources do **not** establish official HSK item membership, redistribution rights for external exam-derived datasets, course completeness, native-speaker recordings, oral grading or native audio.

## Source and rights gaps for P2–P11

- Official mapping is NOT_VERIFIED for every HSK target and every vocabulary, character, grammar and task skill, even when numerical original source counts are large. Item-level edition/source/page, written Hanzi, Pinyin, homograph, grammatical role, redistribution permission and independent editorial approval are still required.
- HSK 6 has no dedicated original character or grammar source inventory; shared 7–9 has only advanced missions, not a full course. Do not synthesize invented lesson IDs or "100% complete" states.
- Device TTS is only synthesized scripted playback. Physical Mandarin pronunciation, screen-reader, mobile browser, offline and visual acceptance remain distinct release gates.
- Production and learner data were not modified by P1. The inventory generator deliberately does not accept a learner state and is reproducible from source modules alone.

## P2 entry criteria

Use this exact read-only registry to replace exposed dashboard navigation. P2 should implement four main destinations and preserve all old routes and event writers, then validate that new and returning learners can enter the selected level without reviewing unrelated catalogs. Do not add a second curriculum store or label provisional difficulty bands as verified official HSK levels.
