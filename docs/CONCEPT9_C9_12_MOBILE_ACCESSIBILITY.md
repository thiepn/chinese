# Concept 9 C9-12 — Mobile Usability & Accessibility Refinement

Parent branch: feature/c9-11-clean-modular-scholar-dark-mode-parity
Exact parent SHA: 76da3a576045ad1fde647fc6c2b2599aaeaf3256
Child branch: feature/c9-12-clean-modular-scholar-mobile-accessibility

## Implemented source functionality
- src/accessibility-c9.mjs: read-only focused control snapshot and recovery for in-place rerenders, maintaining text-input selection where the same native control remains. Route changes announce the source workspace and move focus to its heading/main landmark, rather than preserving controls from another route. Keyboard shortcut help is a native local dialog.
- src/app.mjs: integrates focus capture/restore in the sole original render cycle, adjusts `go` to avoid double rendering on a new hash, adds honest scheduled Review feedback and queue announcements, and announces route transitions without writing academic progress. Original gradeCard, state CAS, native lesson/grading systems and source IDs stay unchanged.
- src/shell-c9.mjs: modal and old-WebView fallback drawer focus behavior, escaped/focus-contained fallback, no focus theft from newly navigated study routes, responsive close and aria-expanded updates.
- src/character-c9.mjs: keyboard-operated in-memory freehand writing pad; arrows move a cursor and Space/Enter start/stop lines. Escape raises the pen, and existing Undo/Clear continue working from keyboard and touch. All strokes remain disposable and entirely ungraded.
- src/index.html: screen-reader live announcements, keyboard shortcuts disclosure dialog, a toolbar keyboard-help control and native landmarks. No new state writer or network asset.
- src/styles-c9-mobile-accessibility.css: bottom-navigation safe-area touch targets, small-screen overflow handling, reachable dialogs, readable Hanzi and Pinyin, sticky and scrollable lesson/review controls, visible focus/forced-colors and reduced-motion behavior across C9 workspaces and original native learning tools.
- src/sw.js: includes C9-12 JS and CSS in the original offline service-worker asset list, with a cache version change.

## Preservation and limitations
- No new routes, SRS scheduler, educational grading logic, storage writer, backup format, HSK claims, pronunciation dataset, recorded speech, handwriting scoring or autonomous network calls.
- Original P31–P34 content, historical IDs, existing owner-scoped local learner data, all older stacked branches, main and production remain unchanged.
- Keyboard shortcuts deliberately avoid active input/contenteditable fields, and a native modal dialog is preferred over a custom focus trap. Older nonmodal WebViews receive explicit Escape/Tab fallback handling.
- C9-12 implements accessibility affordances but does not claim WCAG certification or complete screen-reader acceptance.
- NOT_TESTED. No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services performed, per request.
