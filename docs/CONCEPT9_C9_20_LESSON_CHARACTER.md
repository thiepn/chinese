# Concept 9 — C9-20 Complete Lesson & Character Study Experience

**Base:** C9-19 `9b8086f9728b1e5448d8bde1b7331fff31e0759c`. **Branch:** `feature/c9-20-lesson-character-experience`.

## Implemented source changes
- Original six authored lesson sections remain inside the native `lessonDetails()` markup: character/sounds, grammar/P31 source guidance, vocabulary, contextual reading and dialogue, original formative assessment, and explicit introduction/finish. New visual stage headings and adjacent-section navigation inject within those exact six original section openers without duplicating their assessment writers or section IDs.
- Lesson header now shows original-course position and an explicitly non-mastery progressbar, introduced status and currently due original prompts. The evidence panel's due count now derives from the authoritative `dueCards()` result, not an uncoordinated raw timestamp comparison.
- Lesson entry now presents native source-honest status: simply opening a lesson never awards review credit; final-section explicit introduction and native graded recall remain distinct.
- Character Study seal dynamically displays the selected original Hanzi rather than the previously hardcoded 学 on every page.
- Original five Character Study destinations are visually numbered and have a synchronized `aria-current=location` active marker after keyboard/click navigation while continuing to use the original hash route and native delegated click handler.
- Character Study presents the natural original study progression: teaching, disposable manual writing, complete vocabulary words, contextual sentences, source-linked characters. Lesson words and additional matched vocabulary show explicit source-category distinctions.
- Updated manual writing teaching/help as a real accessible disclosure with a persistent `aria-describedby` help paragraph, alongside untouched pointer/keyboard handwriting engine, Undo/Clear and explicitly ungraded canvas.
- Source sentence summary counts only existing authored examples from the original lesson, P31 teaching, and sentence library; no generated example or claim of automated correctness.
- Responsive layout refinements live inside `src/styles-c9-lesson.css` and `src/styles-c9-character.css`, with semantic light/dark CSS tokens, clean Hanzi/Pinyin hierarchy, accessible section navigation, card interaction feedback, minimum touch targets and reduced existing overflow risks.
- `src/sw.js` bumps the existing local service-worker cache key to distribute the changed existing modules/stylesheets without a new store or network dependency.

## Strictly retained ownership
Published lesson IDs, demo/word/sentence sources and original P31–P34 teaching; native Course learning/intro writers; `study.mjs` SRS and review grading; existing owner-scoped IndexedDB and backup format; source identifiers and rights caveats; all previous draft branches, independent P35–P47 drafts, main and production.

## Limitations
- NOT_TESTED per request: browser visual acceptance, startup, actual handwriting interactions, source/route linkage, responsive breakpoints, offline update and accessibility behavior. No builds, tests, CI, audits, migrations, merges, deployments, credentials or paid services.
- Verified stroke-order diagrams, radical decomposition, automatic handwriting recognition, pronunciation grades and official HSK proficiency are not supplied or fabricated.
- Next C9-21 is intended to structurally complete the separate Vocabulary, Grammar & Sentence Workspaces, not recreate native course data or grade writers.
