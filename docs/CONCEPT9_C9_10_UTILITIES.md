# Concept 9 — C9-10 Progress, Search, Settings & Secondary Tools

Exact parent: dd510c2ef1ccbb4b84cb64644eec704d6230971a (feature/c9-09-clean-modular-scholar-reading-listening-conversations).
Child: feature/c9-10-clean-modular-scholar-progress-search-tools.

## Implementation
- `src/utilities-c9.mjs`: source-backed top-level Progress overview, unified Search collection shortcuts, local Settings entry/navigation, and common native-workspace headings, session continuity and secondary-tool route switcher.
- `src/styles-c9-utilities.css`: responsive Clean Modular Scholar progress units and evidence, search cards and native results, Settings controls/backup, and Pinyin, Word Senses, Sentence Workshop, Sentence Ladder, Study Blocks, Fluency Studio, Daily Journey and Study Plan styling. Uses semantic C9 tokens for light/dark presentation.
- `src/app.mjs`: preserves original Progress and Settings renderer bodies under `renderProgressNative` and `renderSettingsNative`. The new Progress overview uses only authoritative summary(), dueCards(), actual independently correct events and saved-session evidence; the original detailed report stays available in a disclosure. The settings navigation scrolls to original settings panels and recovery/backup controls, without new mutation writers. Original import preview and confirmation flow remains visible. Native unifiedSearchPage, COURSE_INDEX, category handlers and results navigation are retained, with new collection shortcuts and a Clear filters action. Remaining secondary pages are enclosed with presentation-only native route headers and a discoverable tool switcher.
- `src/index.html` adds C9-10 styles after all previous Concept 9 layers; `src/sw.js` includes C9-10 assets under a new cache version.

## Data authority
- Counts are labels for *introduced lessons*, *registered review targets*, *due prompts*, *correct independent responses* and *saved native sessions*. They are deliberately not mastery, HSK proficiency, or calibrated retention scores.
- Scheduled reviews, independent/assisted responses, course and practice checkpoints, settings writes, export, import, replace/reset and storage status retain their original single-writer code and state schema.
- The existing `unifiedSearchPage`, `p30-open-result`, `p30-filter`, saved-only and typed-query behavior remain the only search and source handoff implementation.
- Settings source content, consent/acknowledgment, backup preview and recovery warnings are preserved. C9-10 adds only scroll/focus affordances and layout.
- Original P31–P34 material and prior C9-01–C9-09 phases, old branches, main and production remain unchanged.

## Limitations
- C9-10 redesigns presentation and discovery, not curricular coverage, handwriting grading, external recordings, certification, or new storage.
- Deep original subpanels are restyled incrementally; detailed Progress is disclosed but remains available.
- NOT_TESTED. No builds, tests, CI, audits, migrations, merges, deployments, credentials, or paid services. Actual mobile/browser, screen-reader, contrast and offline acceptance is deferred.
