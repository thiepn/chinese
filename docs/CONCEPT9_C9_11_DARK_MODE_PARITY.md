# THIEPN Chinese — Concept 9 C9-11 Complete Dark-Mode Parity

**Exact parent:** `441a7a89d1ecca355b1a9d7e0b704c662cc57e2e` (`feature/c9-10-clean-modular-scholar-progress-search-tools`)
**Development branch:** `feature/c9-11-clean-modular-scholar-dark-mode-parity`
**Status:** Source committed; NOT_TESTED (no browser/device/build/CI or visual audit).

## Implemented source

- `src/styles-c9-dark-parity.css`: new dark-only, last-loaded styling layer across C9 shell/dashboard/lesson/character/vocabulary/grammar/sentence/review/reading/listening/progress/search/settings/secondary workspaces. Extends dark semantic variables established by C9-01 rather than introducing a separate theme.
- Contrast-oriented ink, muted, surface, raised, line, vermilion and scholarly-green roles. Vermilion primary buttons use dark text in dark mode; accent text stays light against the dark surface.
- Dark native form controls, option menus, placeholders, dark UA color-scheme, select/input caret, checkboxes, radio buttons, keyboard-focus rings and disabled/control states.
- Legacy P21–P34 content panels, teaching notes, native vocabulary, Pinyin, pattern explanations, contextual sentence lists, browsing/filter controls, P33/P34 reading and listening dialogs and the original assessment/feedback surfaces receive a consistent dark palette without altering data or event writers.
- States for warning, error, assisted explanations, success, focus, progress bars, inline markings and empty/offline views use distinct semantic backgrounds and borders instead of pale legacy colors.
- Semantic surfaces and readable labels for native progress reports, tables, existing cards, overlays and modal backdrops; Chinese Hanzi/Pinyin remain legible without using remote fonts.
- `src/app.mjs`: the **existing** `applySettings` method still owns the root theme and size settings; it now also updates `<meta name="theme-color">` to match that already-saved setting. This does not persist any new field or call an external service.
- `src/index.html`: registers final C9-11 CSS after all prior styles for predictable, scoped dark rules.
- `src/sw.js`: adds the CSS file to the existing service-worker asset list and bumps the versioned cache name.

## Preservation

- No second theme state, alternate persistence system, app routing, network dependency or new data store.
- Original THIEPN Chinese lesson/curriculum IDs, P31–P34 educational source modules, existing SRS/review scheduler, answer grading, practice events, stored learner history, consent, Settings, import/export/backup, P35+ independent work, other stacked branches, main and production remain unchanged.
- The dark-mode layer is keyed solely to `:root[data-theme="dark"]`, not the device's ambient color scheme; user preference remains authoritative.
- Background illustrations/fonts are CSS/local assets only; no licensed or remote media introduced.

## Limitations and deferred work

- NOT_TESTED: visual runtime, actual mobile browser chrome, operating-system high contrast, popup and assistive-technology interactions, and contrast metrics were not checked per phase constraints.
- This phase cannot certify that all historical native subcomponents have no unmatched color styling; consolidated C9-14 acceptance remains necessary.
- No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services performed.
