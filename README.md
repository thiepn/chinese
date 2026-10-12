# Character Study — Batch 20 · Feature Freeze Candidate

**This is a local-only feature freeze, NOT a verified educational release.**

### What changed in Batch 20

- Consolidated learner-continuity dashboard with clear distinctions between introduced lessons, scheduled review events, supplemental practice observations, and saved sessions. It never adds mastery credit.
- Quick next steps and a single recovery center for Daily Journey, Study Blocks, Context Trails, Fluency Studio and other saved checkpoints.
- New **safe backup import preview** that validates the legacy-v1 JSON backup before making any changes, compares incoming and current learner histories, warns about potential loss, requires typing `REPLACE`, and rejects a stale preview if the local data revision changes before the replacement transaction.
- Larger Chinese text preference spanning lessons, readings and review. Legacy backups without this optional preference remain readable.
- The course shortcut navigation remains available on small screens, keyboard accessible through horizontal scrolling.
- New read-only course overview and backup preview modules are included in the offline shell cache.

### Included learning data and restrictions

Preserves 74 independent original demonstration lessons, 12 original readings, 10 dialogues, 206 Fluency Studio question configurations, existing study modes, seven-day plan, review and supplemental histories, assistance markers, bookmarks, wordbook, placement, saved session checkpoints and the v1 backup format. *No official HSK content is included.* Neither assistance nor supplemental practice awards scheduled-review mastery.

### Run

Node.js >= 20; no external runtime dependencies. Extract, enter `character-study`, then run `npm start` and open `http://127.0.0.1:4173/`. Run `npm test`, `npm run build`, and `npm run verify` for the included checks.

### Honest qualification state

300/300 Node tests passed; 53/53 built static assets match their SHA-256 manifest; 53/53 HTTP resource checks passed and a missing resource correctly returned 404. **Real HTTP-loaded browser workflows, IndexedDB reload, service-worker offline reload, assistive-technology testing and production use are NOT TESTED.** Browser-based restore and multi-tab interactions require later integrated QA.

No protected official HSK corpora, remote repositories, credentials, DNS, deployments or production environments were touched. Owner visual approval, official syllabus rights, complete HSK inventory, expert linguistic and audio review remain open. Feature-freeze target is met for the local demonstration app; any new features must be separately justified after integrated QA.

See `docs/BATCH20_VERIFICATION.md`, `docs/BATCH20_HTTP.json`, `docs/BATCH20_SOURCE_SHA256.json` and `docs/DIST_SHA256.json` for evidence.

---

# Character Study — Major Build Batch 19

**Course-first local Mandarin demo PWA; feature freeze remains planned for Batch 20.** Batch 19 consolidates previously separate learning screens around a single actionable Today home: resume saved learning sessions, prioritize genuinely due recall, correct observed mistakes, or introduce the next original demo character. Today's four workload activities link to the same Study Plan, Daily Journey, Review, Fluency Studio, reading and dialogue functionality instead of duplicating independent navigation panels.

**Unified interaction:** A compact learning path bar appears on secondary screens, saved checkpoints can be resumed from a single strip, Learn leads directly into the recommended next step, the lesson footer is simplified, and the word detail screen links through to genuine matching original dialogues. Original independent Chinese word matches only; no invented HSK membership. Advanced tools remain accessible through the expandable nav and Today tools area.

**Data and rights:** No change to version-1 learner state format, scheduler, events, cards, helper flags or backups. Hub and context connections are read-only derived views. No official HSK inventory, external network services, credentials, GitHub, deployment or production access. Independent linguistic review, owner's final visual approval and browser-level IndexedDB/offline acceptance remain open.

**Run:** Node 20+, `npm start`. Consolidated checks after build: `npm test && npm run build && npm run verify`. Verification evidence: `docs/BATCH19_VERIFICATION.md`.

---

# Character Study — Major Build Batch 18

**Local-first Mandarin demonstration learning PWA.** Batch 18 adds an integrated seven-day Study Plan, adjustable 10/15/25/40-minute daily budgets, an explainable priority choice (balanced, mistakes, reading, written tones), automatic activity evidence drawn from existing saved learner history, personal collections of missed character/vocabulary/contextual items, and clear links to the relevant original lessons, readings, dialogues and Fluency Studio. A seven-day activity retrospective shows what was actually recorded, without promising mastery or automatic reminders.

**Learning integrity and compatibility:** Plan preferences and saved mistake IDs are optional fields (`dailyPlan`, `mistakePins`) inside the existing version-1 local learner backup. Original course/review/fluency events, cards, scheduling policy and learner checkpoints are unchanged. Legacy backups lacking the new fields remain importable. A previously missed skill can later show as independently corrected without deleting the source history. Help/assisted results remain distinct from independently correct attempts; plan actions do not generate review grades.

**UX:** New desktop and mobile Study Plan navigation, collapsible advanced-tool links on desktop, actionable study tasks, seven-day suggestions, saved mistake controls, source links, a basic contour guide for typed Pinyin, contextual reading/dialogue continuation and a recent-activity visual. Final visual direction remains owner-unapproved.

**Run:** Node.js 20 or newer; no npm installation needed. In this directory run `npm start` and visit `http://127.0.0.1:4173/`. Tests/build verification: `npm test && npm run build && npm run verify`. Browser-service-worker acceptance and real IndexedDB persistence across reload were not tested in this environment. Local HTTP static-asset checks do not replace browser qualification.

**Scope:** Original demonstration content, not approved official HSK. No licensed official exam inventories, remote repositories, accounts, credentials, DNS, production systems or deployments were accessed or modified. Planned feature freeze: Batch 20; next Batch 19 should consolidate UX and existing course tools, not add more isolated exercise modes.

**Evidence:** `docs/BATCH18_VERIFICATION.md`, `docs/BATCH18_TESTS.log`, `docs/BATCH18_BUILD.log`, `docs/BATCH18_VERIFY.log`, `docs/BATCH18_HTTP.json`, and `docs/BATCH18_SOURCE_SHA256.json`.

---

# Character Study — Major Build Batch 17

**Local-first Mandarin demonstration PWA.** Batch 17 adds **Fluency Studio**: checkpointed continuous sessions combining contextual word-sense contrasts, Chinese sentence reconstruction, reading evidence, dialogue evidence, and complete-word typed-pinyin correction. Sessions offer balanced, recent-error, context-focused and tone-focused selection, with 6, 8, 12 or 16 questions. Contextual meaning comparison shows two contrasting meanings and readings after assessment. Each practice item links back to its original lesson, reading, dialogue, or word-sense example. Study Blocks, Daily Journey and Practice Lab remain intact.

**Teaching safeguards:** No assistance or supplementary answer writes scheduled mastery (`events` or `cards`). Every submitted answer and hint is recorded using optional version-1 learner fields (`fluencySession`, `fluencyEvents`, `fluencyCompletions`), and the current session can be resumed after a durable save. Older backups without these fields continue to import. Invalid IDs, duplicated events and malformed sessions are rejected.

**Start locally:** Node.js 20+, no installation of packages: `npm start` then open `http://127.0.0.1:4173/`. For a consolidated check: `npm test && npm run build && npm run verify`. **No official HSK content is included.** This is unreviewed, original Mandarin demo content and no official proficiency claim is made. Real Chromium UI acceptance, IndexedDB persistence across browser restarts, physical screen readers and offline service-worker reload have not been verified here. No remote repository, production, DNS, external credentials, billing or deployment changed.

**Verification:** `docs/BATCH17_VERIFICATION.md` and adjacent `BATCH17_*.log` / `BATCH17_*.json`. The final package retains all 74 lessons, 12 readings, ten dialogues, earlier contextual tasks, study histories, wordbook and legacy backup support.

---

# Character Study — Major Build Batch 16

Batch 16 extends the existing local-first Mandarin learning demo with **saved Context Trails**, **recent-observation skill diagnostics**, and **stronger evidence-based Study Block recommendations**. Study Blocks now optionally connect a three-stage mini-curriculum: identify Chinese evidence in an existing reading, identify an utterance in an existing dialogue, and type a complete word pronunciation with tones. Showing assistance is durably recorded before it reveals teaching support. Supplemental trail events **never award scheduled-review mastery**.

**Preservation:** All 74 original demo lessons, 12 readings, ten dialogues, 66 earlier contextual task configurations, six-stage Daily Journey, four-step Sentence Ladder, Study Blocks, correction histories, scheduled review events, bookmarks, wordbook, placement records, guided checkpoints, and **version-1 JSON backup format** remain supported. The new optional `blockTrail`/`blockTrailEvents` fields are tolerated as missing when importing old backups. A Context Trail is optional and does not block the existing Study Block sequence.

**Run locally:** Node.js 20 or newer, no package installation needed. Execute `npm start` in this directory, then open `http://127.0.0.1:4173/`. For consolidated checks: `npm test && npm run build && npm run verify`.

**Honest status:** The original content is illustrative Mandarin material, not licensed or certified official HSK curriculum. Real-browser IndexedDB reload, service-worker offline reload, and screen-reader acceptance were not established in this environment. No GitHub repository, account, DNS, billing, credentials or production system was accessed or modified. Final visual owner approval remains pending. Full results: `docs/BATCH16_VERIFICATION.md`.

---

## Batch 15: Multi-lesson Study Blocks

Study Blocks now connect 2–4 course journeys and Sentence Ladders into a persisted sequence, ending with cross-lesson Chinese sentence comprehension and full-word tone recall. The app scores only these supplemental checkpoints and never transfers them to scheduled mastery. A saved block can resume after navigating away or restarting, provided browser storage survives. Older v1 learner backup formats are accepted; the new fields are optional.

# Character Study — Major Build Batch 13

Batch 13 adds **connected character → word → sentence teaching**, a four-facet **Daily Journey evidence recap**, targeted consolidation practice, precise saved written-tone-error categories, repeated-journey **complete-word pinyin recall**, and previous/next controls for the 12 mini-readings and ten dialogues. The responsive recap and teaching bridges work across the course and standard lesson views. No speech-recognition or calibrated mastery claim is made.

**Data invariants:** All 74 authored, non-official lessons, 12 readings, ten dialogues, 66 preexisting contextual configurations, saved 6-stage journeys, course repair histories, placement, bookmarks, supplemental event streams, scheduled review events and version-1 JSON backups remain supported. New displays project only from existing events and do not award additional scheduled-review success. The new `feedback.reason` is optional, so older saved checkpoints and backups remain valid.

**Run locally (Node.js 20+, no install):** `npm start` and open `http://127.0.0.1:4173/`. Consolidated checks: `npm test`, `npm run build`, `npm run verify`.

**Actual Batch 13 evidence:** 180/180 Node tests PASS, 41/41 built assets hash-verified, 12/12 HTTP resources returned 200, expected missing resource 404. **Real Chromium interaction, IndexedDB reload and offline reload: NOT TESTED** in this batch; source tests and HTTP checks do not certify browser use. See `docs/BATCH13_VERIFICATION.md`.

**Governance:** This is an original demonstration corpus and has no official HSK memberships. Official corpus redistribution rights, linguistic/audio review and final owner visual approval remain OPEN; no remote repositories, credentials, deployment, DNS or production data were touched.

---

# Character Study — Major Build Batch 12

**Actual expanded course-driven Mandarin demonstration PWA.** Batch 12 adds a checkpointed **Targeted Follow-Up** remediation flow that independently repeats missed or assisted character, vocabulary, sentence, and tone checks. The session survives reload through optional `courseRepairSession`, while optional append-only `courseRepairEvents` records response correctness and assistance. Earlier v1 backups without these fields remain supported. A correct **independent** remediation response clears a corresponding recent learning gap, but never creates scheduled-review mastery or changes previously recorded review events.

**Six-stage Daily Journey retained:** Prepare → Character → Vocabulary → Sentence → Recall → Follow-up. A second completion of the same lesson introduces the **second** relevant vocabulary word in the word check, and may add a contextual cloze checkpoint when the original sentence actually contains an indexed word. Each saved event tracks the word variation for accurate later follow-up. Today and the course route now show a contextual **next-day plan** based on existing due cards, recent completions and unresolved mistakes, plus shortcuts to optional corrective practice. The teaching preview and correction feedback include word and tone context, with independent versus assisted results explained.

**Preserved:** All 74 demonstration lessons, 12 connected readings, 10 dialogues, 12 context-sense cases, 24 reconstruction tasks, 30 dialogue stages, existing course events, study histories, scheduled recall, reading bookmarks, wordbook, placement, checkpointed practice, and original v1 backup schema. Existing field names and historical event IDs are preserved. The new course-remediation fields are optional; extra work does not alter review scheduler authority.

## Run

```sh
# Node.js 20+, no npm install required
npm start
# Open http://127.0.0.1:4173/

# Consolidated verification
npm test
npm run build
npm run verify
```

Use **Today → Begin connected lesson** or **Daily Journey**. After an incorrect or assisted stage, select **Correct weak checkpoints** from the follow-up. If you leave midway, Today offers **Resume saved follow-up**. After a completed journey, Today shows current review work and a next-day continuation plan. Repeating a completed lesson can exercise the other word or a sentence cloze without awarding new mastery.

**Verified Batch 12:** 159/159 Node tests PASS; 40/40 static assets SHA-256 verified; 10/10 real local HTTP GET checks returned 200; full ZIP CRC checked. Browser IndexedDB save/reload, service-worker offline reload, screen-reader interaction and live Chromium acceptance remain NOT TESTED. See `docs/BATCH12_VERIFICATION.md`.

**Restrictions:** Original non-official Mandarin demonstration material only; not a certified complete HSK inventory. Full-source linguistic approval, rights clearance for official HSK content, final owner visual approval, audio quality/rights and production release remain OPEN/NO_GO. No GitHub, accounts, credentials, DNS, billing or production changes.

---

# Character Study — Major Build Batch 11

**An actual course-driven local Mandarin demo PWA, extending the Batch 10 source.** Batch 11 adds a six-stage **Daily Journey** (prepare → character → vocabulary → sentence → tone recall → follow-up), durable stage checkpoints, guided lesson milestones, contextual prerequisite recommendations, integrated vocabulary/story/dialogue links, and a course-first Today/Learn/Progress experience. The new course UI uses responsive, neutral styling, without declaring owner visual approval.

**Core preservation:** All 74 original demonstration lessons, 12 short readings, 10 dialogues, 12 word-sense cases, 24 sentence-reconstruction cases, 30 dialogue-mission stages, prior teaching/review/practice tools, historical grades, assisted flags, placement results, wordbook and reading bookmarks, mixed practice checkpoints, and v1 backups remain supported.

**Important integrity boundary:** `courseJourney` and `courseEvents` are optional v1-state extensions. Per-step results are **supplementary evidence only**. Finishing the journey only introduces any missing recall targets through the existing `addLesson` operation; it does not grant passing recall grades or invent mastery. A hint is durably flagged **before** it can reveal an answer. Course milestones report completion of guided stages, not official HSK proficiency or calibrated mastery.

The curriculum remains **original, non-official demonstration content**, not independently certified linguistic teaching data. Official HSK source rights, complete list reconciliation, final visual approval, and linguistically verified audio remain unresolved. No remote repository or deployment was modified.

## Run and verify

```bash
# Node.js 20 or newer, no npm install necessary
npm start
# Open http://127.0.0.1:4173/

npm test
npm run build
npm run verify
```

Start on **Today → Begin connected lesson**, or select **Daily Journey** in the desktop navigation. The six-stage journey offers a resume checkpoint when interrupted. Follow its contextual links to established Explore, Readings, Dialogues, Wordbook and Practice sections.

**Executed Batch 11 checks:** 139/139 Node tests PASS; build PASS; 39/39 built assets SHA-256 verified; 10 real HTTP asset routes return 200 and one expected missing route returns 404. A separate minimal Node DOM-stub route smoke renders the course-start screen, but this is **not** genuine browser acceptance. Full Chromium, IndexedDB reload, offline service-worker and assistive-technology acceptance remain NOT TESTED in this environment. See [Batch 11 verification](docs/BATCH11_VERIFICATION.md).

---

# Character Study — Major Build Batch 10

**Local-first, original-demo Mandarin learning PWA.** Starts from preserved Batch 9 and adds a continuous connected-learning experience: contextual word senses, written sentence reconstruction and three-stage dialogue mission questions inside checkpointed guided practice, with automatic weak-context prioritization. Includes permanent assistance flags, actionable contextual remediation in Today/Progress, written-tone teaching, and conservative vocabulary links from dialogues. Review priorities now diversify skill and lesson and explain the queue. **All supplementary exercises remain separate from scheduled mastery.**

Retains all 74 demo lessons, 12 readings, 10 original dialogues, 12 sense cases, 24 sentence tasks, 30 mission stages, earlier assessments, review data, placements, bookmarks, session checkpoints and v1 backups. No official HSK curriculum, repository mutation, accounts or deployments.

Run: `npm start` (Node.js 20+), open `http://127.0.0.1:4173/`. Verify with `npm test`, `npm run build`, `npm run verify`. [Actual Batch 10 evidence](docs/BATCH10_VERIFICATION.md).

**Current verification:** 118/118 Node tests; 37/37 static assets verified; 9/9 local HTTP routes served. Real Chromium navigation is administratively blocked in the testing environment. Browser IndexedDB and offline-service-worker reload remain NOT TESTED. Final design and official HSK rights are not approved.

---

# Character Study — Major Build Batch 9

**Local-only working Mandarin PWA demonstrator** built on Batch 8. Includes the original 74 character lessons, 12 readings, ten dialogues, prior modes, checkpoints and v1 JSON backup compatibility. No certified or official HSK inventory is included.

## New learning features

- **Detailed tone coaching:** identifies the first mismatched written pinyin syllable or lexical tone in scheduled recall, lesson pronunciation drills, guided practice, saved words and reading exercises. It is written-form feedback, **not** speech recognition.
- **Word Sense Lab:** 12 original contrastive Chinese examples, including polyphonic 行 and 长; two-choice contextual assessment with explanation and independent/assisted activity tracking.
- **Sentence Workshop:** 24 exact Chinese sentence-reconstruction tasks derived from 12 original mini-readings (first two lines of each), with controlled support, reference reveal and independent/assisted event history. Alternative phrasings are **not** graded as general translations.
- **Three-stage conversation missions:** ten original dialogues each support understanding, Chinese textual-evidence selection and tone-sensitive written pronunciation (30 mission-stage configurations). Answer histories are supplemental, not scheduled review.
- **Wordbook priorities:** study all saved words, most recently missed saved words or words not yet practiced. Wordbook pinyin shows explicit tone feedback.
- **Progress improvements:** three more diagnostic evidence streams, context/teaching shortcuts and a mobile-responsive workshop interface with keyboard labels and focus styling.

**Compatibility:** Existing `STATE_VERSION=1` and `formatVersion=1` backups are unchanged. New `senseEvents`, `sentenceEvents` and `missionEvents` are optional, deduplicated and validated; they do not mutate scheduler cards, grades, legacy events, introductions, placement or guided-session checkpoints. Older backups without these fields can import and accumulate new observations.

**Run:** Node.js 20 or newer, no third-party packages needed.

```bash
npm start
# Open http://127.0.0.1:4173/
npm test
npm run build
npm run verify
```

**Verification:** [Batch 9 evidence](docs/BATCH9_VERIFICATION.md). Chromium headless localhost navigation timed out here; full browser IndexedDB and offline reload remain **NOT TESTED**. All new material is non-official, originally authored demonstration material without independent pedagogical/audio certification.

---

# Character Study — Major Build Batch 8

**Local-only runnable Mandarin learning demonstrator.** Preserves 74 earlier character lessons, 12 mini-readings, previous exercises and all legacy v1 learner backups. No licensed official HSK data is bundled and example material has not had independent linguistic/audio review.

### New in Batch 8

- **Learning pathway:** explainable introduction/revisit suggestions from outstanding due checks and observed error evidence, plus six-unit progress overview; no invented mastery probabilities.
- **Conversation Lab:** ten hand-authored three-turn Mandarin dialogues, 20 context questions, optional sentence playback and hide/reveal pinyin/English support. Reveal-assisted responses are independently recorded and do not affect scheduled-review mastery.
- **Saved wordbook training:** independent word-meaning and tonal pinyin drills for words saved from Explore, including correct/wrong feedback, helper reveal and distinct attempt tracking.
- **Smarter scheduled review queue:** due-only, priority-based, skill-diversified review ordering and diagnostic reasons; no changes to the underlying scheduler or past grades.
- **Diagnostic progress:** recent activity across five distinct learning streams, independent versus assisted counts, faster navigation to vocabulary and dialogues.
- **Desktop/mobile interface:** responsive conversation layouts, generous Chinese typography, compact wordbook cards, visible learning steps and responsive practice controls.

**Compatibility:** v1 state schema and backups retained. Optional `dialogueEvents` and `wordPracticeEvents` are bounded, validated and backed up; older records without these arrays still import. Placement records, existing reviews, bookmarks, guided checkpoints and sentence/reading attempts remain unchanged.

### Run it

Node.js 20+; no third-party dependencies or installation required.

```bash
npm start
# Open http://127.0.0.1:4173/
npm run build
npm test
npm run verify
```

The included `dist/` is ready for local service. Detailed real results and limits: [`docs/BATCH8_VERIFICATION.md`](docs/BATCH8_VERIFICATION.md).

---

# Character Study — Major Build Batch 7 (Local Mandarin Demonstration)

**Latest build:** local-only character learning PWA using 74 authored demonstration lessons and 12 short readings. No official HSK inventory, external API, remote account, credential, repository mutation, DNS change or production deployment. Independently certified linguistic accuracy and audio are not claimed.

## Added in Batch 7

- Two contextual story tasks per reading: locate the precise Chinese evidence sentence for a comprehension answer, and explain the relationship between sentences. Together they give 24 new story question configurations, accessible within Readings and mixed Practice Lab sessions.
- Sentence-focused reading controls: explain individual sentences without revealing every translation, sentence-by-sentence playback and selectable browser-device playback speeds (0.72–1.14×). Device speech requires a local Mandarin voice; playback is not certified linguistic audio. Using a translation or word hint marks that reading attempt assisted.
- Personal saved vocabulary wordbook backed by optional `bookmarkedWords` on the existing v1 state, filter in Explore, and quick links from Progress and reading glossary. Export/import includes saved words; old backups without the field still validate.
- Real word-to-reading cross-links in lessons, drawn only from documented occurrences; related word explanations without invented official HSK levels.
- Transparent recent-error remediation recommendations that reduce their emphasis after subsequent independent correct observations. Existing spaced scheduling and mastery evidence stay separate.
- Responsive layout improvements for phrase cards, mobile context questions, selected sentences, keyboard focus and saved-word controls.

**Consolidated source checks:** 70/70 Node tests pass; 25/25 static build assets pass SHA-256 verification; local HTTP endpoints return 200. Browser-based service-worker offline reload, actual IndexedDB durability and screen-reader acceptance remain NOT TESTED in the execution environment.

## Run

Node.js 20+ required. `npm start` serves the prebuilt application at `http://127.0.0.1:4173/`. `npm test`, `npm run build`, and `npm run verify` run the consolidated checks. No dependency installation is required.

---

## Previous release notes (Batch 6)


**Runnable source; no official HSK inventory, remote repository changes, accounts, credentials, deployments or production changes.** The 74 lessons and 12 readings are independently authored illustrations and have not received independent linguistic/audio certification.

## Added in Batch 6

- **Optional six-question placement check** with saved answers across reloads; suggests a demo starting lesson but never grants completion, review credit, an HSK level, or any calibrated mastery.
- **Interactive character lesson checks**: three formative recall questions in every character lesson: recognition, word meaning and typed tonal pinyin. These are in-page practice and **not** silently persisted as mastery; unsubmitted quick checks are transient.
- **Focused remediation**: visible evidence cards summarize observed errors in meaning, pinyin and contextual sentences, linking directly to lessons and the existing guided Practice Lab. Weak guided sessions now select exercise types based on recently missed scheduled cards, not arbitrary random formats.
- **Two distinct connected sentence question types:** line-level interpretation and reconstruction of a three-sentence narrative. Sentence-order exercises hide original ordering while testing. Both are supplemental reading evidence, not scheduled mastery.
- **Focused guided practice**: sentence reasoning and pronunciation-specific focus modes, alongside the existing balanced, weak and reading modes. Existing session checkpoints are accepted without migrating or changing past answers.
- **More useful learning analytics:** 7-day vs prior-week observation counts; independent correct, assisted and missed attempts; skill-specific review versus optional Practice Lab counts, without invented mastery probabilities.
- **Improved ergonomics and recovery:** review keyboard shortcuts, data-revision display, local-storage health check and a detailed preview before replacing progress from a backup. Mobile bottom navigation now uses six equal slots, with clearer compact lessons and placement controls.
- **Offline asset manifest updated** to include the new modules and v6 cache. Browser-based offline and durable-storage behavior still requires verification in a normal browser; source tests do not certify it.

## Preserved

All **74 character lessons**, **12 readings**, **six original drill formats**, earlier connected-reading modes, previous six-target scheduled reviews, 14-day chart, bookmarks, v1 backup format, review/reading/drill events and checkpointed guided sessions. `STATE_VERSION` remains `1`, with optional new placement metadata and no reinterpretation of earlier observations.

## Run locally

Requires Node.js 20+. No `npm install` is needed.

```bash
npm start
# Open http://127.0.0.1:4173/ in your browser
npm test
npm run build
npm run verify
```

Windows: `run-windows.bat`; macOS/Linux: `./run-mac-linux.sh`. Export progress in Settings before clearing your browser profile. **Browser-managed storage is not a guaranteed backup.**

**Evidence:** `docs/BATCH6_VERIFICATION.md`. Tests and build are genuine; live browser offline/reload, assistive-technology acceptance and device TTS accuracy remain separately unverified where unavailable.

---

# Character Study — Major Build Batch 5 (Local Mandarin Demonstration)

**Status:** Actual source implementation, source-level tests passing. No official HSK content, public deployment, online service, or production changes. Full live-browser acceptance remains unverified in this environment.

## New in Batch 5

- **Checkpointed continuous Practice Lab:** start 5, 10 or 20-question mixed sessions with **Balanced**, **Recent mistakes**, or **Reading & context** focus. Each session draws from the original six character/word drill formats plus all four connected-reading formats. Correct, incorrect, assisted and revealed answers are recorded separately from official/structured review mastery.
- **Resume interrupted sessions:** the active question index and checked-answer feedback live inside the existing transactional IndexedDB learner state and v1 JSON backup format. The session is recoverable after application restart or backup restoration; old Batch 1–4 backups without this optional field still load. Answer text not yet submitted is not checkpointed. Saved supplemental results remain after ending a session.
- **Study recommendations:** the Today screen ranks existing demo lessons using observed recent incorrect answers, due reviews, lesson order, and independent practice. Rankings are transparently heuristic and do not imply calibrated mastery or official HSK level.
- **Reading-based practice:** passage comprehension presents Chinese without English answers; cloze and chunk reconstruction hide the target; contextual pinyin is graded with tones. Hint/reveal use is recorded as assisted, and no supplemental attempt grants scheduled-review mastery.
- **Contextual vocabulary connections:** character lessons link to full word entries. Word detail pages also locate that word in the twelve demonstration mini-readings and open the related reading.
- **Mobile presentation and learning-state UX:** responsive question controls, larger readable Chinese context, practice-progress indicators, guided-session status on Progress and backup/recovery explanation in Settings.
- **Offline shell:** new module files are listed in the service worker and the cache version is incremented for upgrades.

Existing **74 original demonstration lessons**, **12 mini-readings (36 contextual sentences)**, **six original Practice Lab modes**, reading bookmarks, scheduled-review events, supplemental events, local backups, Search, Settings and dark mode remain intact. Demonstration examples are not the official HSK inventory and have not undergone independent linguistic certification.

## Start and verify

Requires Node.js 20+; no npm install required. Extract the ZIP, enter the `character-study` folder and run:

```bash
npm start
# Open http://127.0.0.1:4173/ in your own browser
npm run build
npm test
npm run verify
```

Windows users may double-click `run-windows.bat`. The demo uses only local static files, IndexedDB and optional device TTS. No registration, cloud API or production services are required.

**Evidence:** `docs/BATCH5_VERIFICATION.md` includes the consolidated test outcome and environment limits. Browser-loaded IndexedDB reload, service-worker offline reload and screen-reader acceptance are NOT TESTED here because headless Chromium timed out. **Do not use this demo as official HSK exam prep or verified pronunciation guidance.**

---

# Character Study — Batch 4 (Local Mandarin Learning Demo)

**Status:** substantial working source implementation. No official HSK data, no production deployment, no outside accounts or secrets.

## New in Batch 4

- **Practice Lab:** six distinct demo-only exercises for each of the 74 lessons: identify the character, word meaning, word pinyin, build a word, complete a sentence, and choose character pinyin. Answers are checked independently; hints or reveals are recorded as assisted attempts.
- **Character insights:** 25 human-written usage notes for the first 25 lessons and concise comparisons derived from the existing teaching notes for remaining lessons. These are not historical etymologies or externally certified linguistic content.
- **Review priority:** optional weak-skill ordering based on previous errors, overdue status and new targets. The original scheduler remains unchanged, and these are only priority heuristics, not calibrated recall probabilities.
- **Learning analytics:** 14-day chart of scheduled review attempts and a list of previously missed learning targets.
- **Reading:** save and filter short stories, larger Chinese text option, current-sentence focus, and a glossary coverage count clearly labeled as **introduced lessons**, not mastery.
- **Backward compatibility:** 74 previous lessons, 12 three-sentence readings, existing scheduled review histories and the v1 JSON backup format remain supported; supplementary drill and bookmark records are optional on older imports.
- **Mobile refinements:** accessible buttons and two-column mobile exercise selector, enlarged reading, no gesture-only controls.

## Start locally

Requires Node.js 20 or newer; no dependency installation is needed.

```bash
npm start
```

Open http://127.0.0.1:4173/ in a local browser. On Windows, `run-windows.bat` is also included.

```bash
npm test
npm run build
npm run verify
```

**Browser acceptance limitation:** In this execution environment Chromium headless navigation timed out; actual browser-loaded IndexedDB persistence, service-worker offline reload, and manual assistive technology testing are **NOT TESTED**. Static source tests do not replace these checks.

**Content limitations:** All lessons and short stories are independently authored demonstration materials without independently qualified audio or linguistic editorial approval. They are not claimed to be an official HSK 2025 curriculum or examination preparation. Device speech synthesis is opportunistic and not pronunciation-certified. No internet/cloud APIs or paid services are used.

## Data and scoring boundaries

Scheduled review events (`events`) and independent reading (`readingEvents`) stay separate. New Practice Lab records (`drillEvents`) also remain separate from scheduled review mastery. Bookmarks (`bookmarkedStories`) do not affect mastery. An imported earlier JSON backup may omit these new fields; the application accepts the old schema without inventing completion history.

Read `docs/BATCH4_VERIFICATION.md` for exact test evidence and limitations.

---

# Previous Build Notes — Major Build Batch 3

A runnable, dependency-free, local-first Mandarin learning PWA. **It is a non-official educational demonstration.** No HSK examination inventory is included, inferred, or certified. The Mandarin examples are authored for this demo but have **not** been independently reviewed by a qualified teacher.

## Run locally

Node.js 20+ is required; there are no npm dependencies and no network install is required.

- **Windows:** Extract the ZIP and double-click `run-windows.bat`.
- **macOS / Linux:** Extract and run `./run-mac-linux.sh`.
- **All platforms:** `npm start`, then visit `http://127.0.0.1:4173/`.
- **Rebuild and test:** `npm run build && npm test && npm run verify`.

The archive contains complete `src/` files, a runnable prebuilt `dist/`, scripts, tests, and `docs/BATCH3_VERIFICATION.md`.

## What is now implemented

- **74 connected character lessons in six learning units**, preserving the entire Batch 2 lesson set: two related words with pinyin and meaning plus a contextual Chinese/English sentence in each lesson.
- **12 original connected mini-readings comprising 36 Chinese sentences**, with on-demand full pinyin and translation, clickable word glosses where available, progress indicators, and four practice modes: comprehension, missing word, assemble sentence, and tone-aware pinyin recall. The reading's gloss and translation assistance is tracked and cannot be counted as independent success.
- **Supplementary reading-history events saved in the existing IndexedDB state**, independently from review-card mastery. Old `version:1` learning states and backups remain compatible: missing reading history is interpreted as empty; previously saved events and cards are retained. The new reading history is included in backups and rejected if forged or malformed.
- **Separate character and word search** with diacritic-insensitive pinyin and English meaning lookup, independent word senses where recorded, and links back to related character lessons. Search does not award mastery.
- **Focused review sessions**: all skills, meanings, pinyin/tones, or sentence comprehension; choose 5/10/20/50 due prompts, skip without credit or rescheduling, session summary, reproducible demo scheduling and prior progress intact.
- **Mobile improvements**: responsive story and exercise layouts, legible word pinyin, Settings accessible on narrow mobile, Readings as a mobile destination. Today links to detailed Progress.
- Previous functionality remains: Today, Learn, Review, Explore, Sentence Lab, Progress, Settings, automatic answer checking, search, tone-specific feedback, local storage, JSON backup restore, dark appearance, device TTS and service-worker offline shell.

## Important limitations

1. **No official 2025 HSK list**, HSK mastery guarantee, real pronunciation recording corpus, or production release. Source licensing and full inventory checks remain unresolved.
2. Mandarin content is hand-authored **demonstration material** but not professionally reviewed; there may be inaccuracies or vocabulary beyond a beginner's level.
3. The automatic English evaluator is conservative, and the interval scheduler is an uncalibrated prototype. No learning efficacy claim is made. Reading practice is independent from scheduled mastery.
4. Clickable glosses are a best-effort dictionary derived from the demo lesson words and a limited authored glossary, not fully reviewed morphological segmentation. Audio is optional device TTS and is not certified.
5. Browsers may clear local storage. Export a JSON backup to preserve progress. There is no cloud account or synchronization.
6. The consolidated Node test suite passes, but the environment's Chromium enforces `ERR_BLOCKED_BY_ADMINISTRATOR` on localhost navigation. Genuine browser-origin IndexedDB/service-worker/keyboard acceptance **remains NOT TESTED**. No administrator restriction was bypassed.

## File guide

- `src/stories.mjs` — independent demo mini-stories, glossary and deterministic reading exercises.
- `src/lexicon.mjs` — canonical derived word index/search across existing lesson examples.
- `src/reader-records.mjs` — compatible, distinct reading attempt events.
- `src/app.mjs` and `src/styles.css` — integrated app and responsive experience.
- `src/study.mjs`, `src/study-storage.mjs`, `src/exercises.mjs` — backward-compatible progress, persistence and assessment.
- `src/sw.js` — offline shell, now caching all Batch 3 learning modules.
- `tests/` — 28 Node tests, including six new story/word/history suites.

The project is locally isolated. No remote GitHub repository, domain, credentials, DNS or production environment was accessed or changed.

---

## Major Build Batch 14 — Sentence Ladder & Contextual Contrast

- **Four-stage Sentence Ladder (74 lesson configurations):** distinguish complete word meanings, understand a full sentence, reconstruct its original Chinese text from selectable orthographic chunks, and recall the complete word pronunciation with written-tone checking.
- **Durable, independent supplemental evidence:** optional `ladderSession` and `ladderEvents` fields are transactionally saved in the existing browser state. Selecting chunks, revealing hints, checking an answer, and advancing all preserve their own checkpoint. Guided and assisted attempts never create scheduled-review successes.
- **Rotating vocabulary:** when the same lesson ladder is practiced again, the second example word is used, preventing systematic neglect of the second word.
- **Adaptive error recovery:** Today and Learn can suggest the most relevant connected lesson based on uncorrected practice errors and recent review misses, using explainable heuristics rather than unvalidated memory estimates.
- **Contextual sense contrasts:** after a Word Sense Lab answer, compare two differing uses of the same Chinese character in complete example sentences. Quickly return to new or previously missed contexts.
- **Reading/dialogue continuity:** at the final Sentence Ladder stage, follow contextually related words into readings, dialogues, or the existing six-stage Daily Journey.
- **Mobile:** adaptive sentence chunk buttons, small-screen contrasts, responsive exercise cards, and keyboard handling for typed pinyin.

**Preservation:** The app still contains 74 independently authored demo lessons, 12 readings, 10 dialogues and all previous practice modules. Old `formatVersion: 1` backups that omit `ladderSession` and `ladderEvents` remain supported. This curriculum does **not** contain or claim official HSK inventories; Mandarin language/audio quality is not independently certified.

**Testing:** `npm test`, `npm run build`, `npm run verify` from the extracted `character-study` directory. See `docs/BATCH14_VERIFICATION.md` for the exact consolidated result and untested browser behaviors.
