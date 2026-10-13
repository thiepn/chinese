# Concept 9 — C9-06 Character Study Signature Experience

Parent: `eb3efe560846982da35669aae78cea3dbaf51eae` (`feature/c9-05-clean-modular-scholar-lesson-workspace`).
Child: `feature/c9-06-clean-modular-scholar-character-study`.
Source-only implementation. No tests, builds, CI, audits, merges, deployments or paid services.

## Actual integrated features
- `src/character-c9.mjs`: a source-backed character study screen mounted through the existing `app.mjs` hash router at `#/character/demo-NN(N)`; deep links are validated against the existing `findLesson` authority. Large Simplified glyph with grid, meaning, accurate source tone-marked Pinyin, device-speech actions, authored notes, vocabulary, example sentences, conservative written-word links and genuine progress evidence.
- Character source provenance distinguishes original lessons, P31 authored guides, actual sentence library entries, and canonical words. Shared characters in whole words are **not** identified as verified radicals, etymologies or meanings.
- Native action handoffs preserve `open-lesson` behavior, `practice-lesson`, `lookup-word`, `speak`, `reader` and `review`; no duplicate scoring, review scheduler or learner-state writer.
- New drawing canvas is functional on pointer devices with normalized freehand strokes, Undo and Clear; drawing only exists in a closure while its view is mounted and is disposed on re-render. No drawing is retained or graded. Does **not** claim stroke order, stroke count or tracing accuracy.
- `src/styles-c9-character.css`: responsive light/dark Concept 9 character hero, scholarly grid, learning panels, touch canvas, mobile sections and keyboard-focus aware controls.
- `src/app.mjs`: adds existing-router `character` presentation route and source-backed `#/character/{id}` links; established routes are unchanged. Native actions route into the original lesson, practice and sentence reader.
- `src/lesson-c9.mjs`, `src/learn-hub-c9.mjs`, `src/styles-c9-learn.css`: links from current C9-05 lessons and source-backed C9-04 discovery rows to the new character study view.
- `src/shell-c9.mjs`: route name and active Learn context, no second router or destination engine.
- `src/index.html`, `src/sw.js`: CSS registration and versioned offline asset precache.

## Integrity/limitations
- Original P31–P34 content, app settings, historical source IDs, original learning state and IndexedDB schema unchanged. All progress labels refer only to actual introduced lessons, scheduled targets and recorded unassisted review attempts.
- The code does not invent verified HSK levels, radical structure, decomposition, stroke order, stroke count, licensed audio, source certification or learning completion.
- Writing canvas is self-directed and disposable. No pose/gesture relay, cloud storage, handwriting scoring, drawing export or external dependencies.
- The `#/reader` exercise remains the original reader rather than being replaced by a second assessment engine.
- Real browser, device, dark-mode contrast, canvas pointer, audio, keyboard and screen-reader operation remain NOT_TESTED as requested. Future C9 phases and consolidated acceptance should examine those behaviors.
