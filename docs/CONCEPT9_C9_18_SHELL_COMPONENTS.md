# Concept 9 — C9-18 Unified App Shell & Component Architecture

Parent: merged main at `9fd1b9cb9725c3d02ab8a945f4cf93ef06c8e898`.
Child: `feature/c9-18-unified-shell-components`.

## Implementation
- New `src/ui-c9.mjs` is the single source for course/library/practice route names and context groups, and contains shared render-only HTML primitives for page headings, native actions, contextual navigation and empty/status states.
- `src/shell-c9.mjs` uses that metadata to highlight direct/current routes and parent contexts on desktop/mobile, to report the original dueCards(state) count and actual IndexedDB availability, and to preserve the existing native modal and keyboard handling.
- `src/app.mjs` replaces legacy shortcut rail and heading/button markup without changing native IDs or delegated event writers; slash-to-search focus is retained through the hash transition.
- `src/learn-hub-c9.mjs`, `src/libraries-c9.mjs` share one empty-state component without duplicating source filters or stores.
- `src/index.html` adds section-aware breadcrumb, due-count badges, direct Review shortcut and owner-local storage status.
- Original `src/styles-c9-shell.css`, `src/styles-c9-system.css`, `src/styles-c9.css`, `src/styles-c9-mobile-accessibility.css` are extended/refined for shared visual behavior in established light/dark semantic tokens, with repeated tap-size and keyboard focus ownership consolidated.
- `src/sw.js` precaches new module and bumps versioned cache.

## Preservation and restrictions
- Original P31–P34 teaching material, IDs, original Account/local IndexedDB/CAS, review scheduler, grading, backups, historical learner records and independent P35–P47 drafts unchanged.
- Original action IDs, source-linked routes, navigation dialogs and native graded review retained.
- No build, test, CI, audit, migration, merge, production change, paid service or credentials.
- NOT_TESTED: browser behavior, colors, accessibility, responsiveness, service worker offline and runtime acceptance.
