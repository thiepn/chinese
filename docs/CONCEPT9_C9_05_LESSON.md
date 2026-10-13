# Concept 9 — C9-05 Focused Lesson Workspace

Parent branch: feature/c9-04-clean-modular-scholar-discovery
Exact parent: b1add2aec457dd9e3c47c20316ee78d19fa2c7c6
Child branch: feature/c9-05-clean-modular-scholar-lesson-workspace

## Substantial working source implementation
- `src/lesson-c9.mjs`: responsive lesson shell around **the original lessonDetails markup** with six source-content sections, explicit scroll/focus section navigation, adjacent lesson actions, Chinese/Pinyin/English heading, real introduction/review evidence, and native reading/grammar/conversation links.
- `src/app.mjs`: migrated native lessonDetails markup into six semantic sections *without changing any educational data or dispatch semantics*. Selected lessons now have one rendered lesson instance rather than the previous duplicate detail in an additional legacy disclosure; catalog-level expanded material is still available under existing disclosure. Native lesson next is bounded and status button now says 'Introduce lesson & create reviews' instead of claiming completion.
- `src/styles-c9-lesson.css`: Concept 9 layout and typography, desktop three-column and smaller-screen two/one-column layout, horizontally navigable section bar, focus treatment, Chinese vocabulary and sentence presentation, appropriate dark surfaces.
- `src/index.html`, `src/sw.js`: new stylesheet in load order, new JS and stylesheet in updated offline shell cache.

## Reused original learning authority
- Original lesson IDs and `lessonGroups`; original `lessonDetails`, `lessonQuiz`, `toneTeachingPanel`, `p31LessonTeaching`, `grammarUnitSelector`, `companionPanel`, related readings and dialogues are retained.
- `state.learned` shows only **introduced**, not mastered or officially complete. Existing `cardsForLesson`, scheduled `state.cards`, `dueCards`, and unassisted correct `state.events` are used for factual status counts.
- No new IndexedDB writer, schema, review engine, P31–P34 content, HSK membership claim, lesson completion engine or event records.
- Existing `speak`, `mark-studied`, `lookup-word`, `vocabulary-start`, `lesson-check-*`, `course-lesson`, `practice-lesson`, and reading/communication handoffs stay native.

## Boundaries and limitations
- No tests, builds, CI, audits, device/browser verification, migrations, PRs, merges, deployments, credentials, or paid services.
- This phase reorganizes existing authored lessons; it does not add verified stroke-order assets, writing recognition, or official HSK progress. Those belong to later scoped phases.
- Active section state is UI-only; it never records educational achievement.
- Browser/device responsive details and accessibility runtime behavior remain NOT_TESTED.
