# THIEPN Chinese — Concept 9 C9-24: Advanced Tools, Progress & Search UI Finalization

## Exact development parent

- C9-23 stacked draft PR #24
- Parent branch: `feature/c9-23-reading-listening-conversations`
- Verified source head: `ac55793b3eaf04c3184aca8325d216568447f97e`
- Child branch: `feature/c9-24-advanced-progress-search-workspaces`

## Actual implemented UI and functionality

### Progress: inspect original learning evidence

- A 14-local-calendar-day response activity display reads **only** the existing `events`, `readingEvents`, `dialogueEvents` and `drillEvents`. Records are grouped by their `at` timestamp into source-specific categories; it does not invent learning days or combine disparate skill scoring engines. Data from activities without matching event types is deliberately excluded from this particular visualization.
- The timeline shows genuine totals of saved responses, independently correct answers, assisted answers and incorrect answers, with accessible day-by-day source counts, and routes to the native Review, Reading, Dialogue and Practice screens.
- Latest per-card difficult Review observations use the original `cardInfo` and **last** actual scheduled-review event. Wrong, assisted or Again answers offer a one-click source-lesson handoff through the **original** `open-lesson` action. No claim that a card remains due, still wrong, or automatically eligible for early review is made.
- Original progress screens, unit-introduction and due-only scheduler counts, saved review history, backup and details disclosure remain authoritative and untouched.
- Recovery list now includes original Guided Practice, Fluency, Sentence Ladder, Study Block, Daily Journey, Course Repair, Wordbook journey, and Context Trail checkpoint identities where genuine native state exists. Route links never fabricate resume events.

### Search: connect learner queries to canonical source

- The original `COURSE_INDEX` and `courseSearch` remain the search authority. C9-24 provides a new source-category breakdown of matching results for current query/type/saved-only filters.
- Source example actions are derived directly from currently installed original Character, Vocabulary, Reading and Dialogue entries and initiate a **real canonical indexed query**. No fake search entries or shadow indexes.
- Source-type actions update the existing native kind filter, saved-only toggles reuse the native saved filter, and a search-focus action takes the learner to the original search input and result grid.
- Query typing updates the original `p30-results` and the secondary source breakdown without discarding typed input focus. Existing `p30-open-result` remains the source-aware action handoff; P31–P34 and historical IDs are unchanged.
- All UI text clarifies where a category lacks saved/introduced meaning and why zero results may be correct.

### Advanced learning tools: practical native handoffs

- Existing Pinyin, Senses, Workshop, Ladder, Study Blocks, Fluency, Daily Journey and Daily Plan now show contextual original-workspace actions and a direct accessible jump to the **real** native exercise.
- For original types with saved session authority (Ladder, Block, Fluency, Daily Journey), session status reflects the existing session object and explicitly distinguishes session persistence from unsent text.
- Source-linked routes lead to existing canonical Reading, Dialogue, Wordbook, Lesson, Grammar, Plan, Review and Progress pages rather than duplicated exercises or assessment writers.
- C9-style responsive layout, keyboard focus, 44px interactive targets, Hanzi-friendly source repair typography, light/dark token reuse and reduced-motion handling were added to existing utility CSS.
- Offline service-worker cache identity updated to refresh modified existing modules and styles.

## Exact modified paths

- `src/utilities-c9.mjs`
- `src/app.mjs`
- `src/styles-c9-utilities.css`
- `src/sw.js`
- `docs/CONCEPT9_C9_24_ADVANCED_PROGRESS_SEARCH.md` (this file)

## Preserved authorities and limitations

- Original Account/IndexedDB learner records, PostgreSQL absent (no server authority added), original CAS and scheduled review `gradeCard`, course lessons, readings, lexical sources, practice engines, stage progress and backups are not reimplemented or altered.
- No automatically generated HSK mastery, CEFR equivalence, performance prediction, fake grades, fabricated audio, simulated attendance, duplicate learning stores, automatic private writing persistence, network requests or paid services.
- C9-24 does **not** integrate the independent P35–P51 curriculum branch. Previous stacked draft PRs and main/production remain unchanged.
- **NOT_TESTED** by deliberate implementation-first instructions: no tests, builds, CI, device/browser runs, screenshots, audits, migrations, merges or deployments. Correct browser behavior and release readiness are therefore not verified.
- C9-25 remains the next integration/feature-consolidation phase; it must reconcile the C9 and independent curriculum stacks before any final release verification.
