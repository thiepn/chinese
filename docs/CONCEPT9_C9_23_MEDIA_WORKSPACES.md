# THIEPN Chinese — C9-23 Reading, Listening & Conversations UI Completion

**Direct parent:** `feature/c9-22-review-practice-workspaces` at exact SHA `526f1cd1bab4a82bc59f8034c9ec695b8c7c1e6f`.
**Development child:** `feature/c9-23-reading-listening-conversations`.

## Real implementation

### Source-first Reading
- Original `STORIES` now power a real searchable, pageable reading library with query over original Hanzi, Pinyin, English, theme and title. Filters use original `readingEvents`, bookmarked stories and independently correct attempt evidence. Search, pagination and filters are ephemeral; source IDs and study records are untouched.
- Source result cards show an actual short authored Chinese excerpt, reading length/type, owner-local observed attempts, saved status, and a direct action into the actual native Story reader. No generated passages, duplicated exercise writers or invented completion counts.
- A native-reading handoff and accessible original-sentence navigator provide direct line jump, previous/next, real source-focus state and source-backed in-place focus. Navigation does **not** reveal answers, make progress records or change scheduled review.
- The existing source reader still owns 16+ supplementary reading modes across original simple, connected and beginner readings, reading support, proper English/Pinyin assistance markings, original `storyResult`, `addReadingEvent` and open Chinese reconstruction under its existing `addSentenceEvent`.
- Original connected-paragraph controls, beginner passage parts, optional translation / glossary / word sourcing and P34 reading-to-listening handoffs remain intact.

### Authentic Listening & Conversation
- Original `DIALOGUES` back a searchable, pageable conversation library with title/topic search, filtering by recorded activity, need for review, independent correct evidence and P34 listening-first sources.
- Source result cards never reproduce hidden listening-first transcript text; they link into the actual native `dialogueId` and P33/P34 players without generating any answer or changing learner state.
- The selected conversation has a genuine three-step listening-to-comprehension pathway, optional **device** playback at original rate or slower speed, genuine answer evidence, and clear transcript-assistance status.
- The existing turn navigator now provides keyboard-accessible speaker-by-speaker normal/slower playback using `c9DialogueTurn` and native `speak`; it does not reveal hidden text or grade voice performance.
- Focused native turns expose `aria-current` as you navigate, with mobile focus targets and breakpoint-aware controls.
- Original P34 transcript constraints, shadow/replay modes, original source questions, `addDialogueEvent`, P33 scenarios, conversation mission and source writing return routes remain the only authorities.

### Interface and integration
- Source catalog layouts, responsive discovery inputs, native source-passage controls, listening decision flow, language typography, focus states and light/dark semantic tokens were implemented in existing C9 JS/CSS.
- Original media source arrays, source IDs, canonical activity writers, learner records, IndexedDB/CAS, existing review scheduler, and earlier C9/P31–P34 branches remain unchanged.
- C9-22 remains the untouched direct PR parent. Independent P35–P51 curricular branches remain separate; this feature does not merge them.
- Offline cache key updated for changed original `src/media-c9.mjs`, `src/app.mjs`, `src/styles-c9-media.css`.

## Files changed
- `src/media-c9.mjs`
- `src/app.mjs`
- `src/styles-c9-media.css`
- `src/sw.js`
- `docs/CONCEPT9_C9_23_MEDIA_WORKSPACES.md` (this document)

## Limitations
- **NOT_TESTED**: no builds, tests, CI, browser visual acceptance, mobile-device checks, screen-reader audit, or offline runtime verification. Source changes are committed but full runtime correctness cannot be guaranteed.
- Device TTS is not an authored recorded course soundtrack or professional Mandarin accent/pronunciation score; no microphone analysis or officially licensed HSK corpus is introduced.
- Original source event evidence is limited to actual recorded responses; a browse, link, audio playback, or reveal never becomes an independent success.
- No migrations, merges, deployments, new credentials, new paid services or production changes.
- C9-24 advanced/progress refinement and C9-25 integration and final quality verification remain subsequent phases.
