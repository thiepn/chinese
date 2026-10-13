# Concept 9 — C9-13 Visual System & Asset Consolidation

**Stack:** C9-12 (`763d63d6f99af7a22dc49996ace612cfac4e2f9f`) → C9-13 `feature/c9-13-clean-modular-scholar-visual-consolidation`.

## Substantial implementation
- `src/styles-c9-system.css`: final shared component stylesheet. Defines one predictable contract for responsive tap targets, input sizing, keyboard focus and low-specificity card/heading/action/source-note styling shared by C9-01–C9-12. Uses the original C9 light/dark color tokens without a new theme system.
- Migrated the duplicated global 44-pixel target and focus rules out of `styles-c9-mobile-accessibility.css` into that single final stylesheet. Removed the earlier generic focus block in `styles-c9.css` and dark-specific focus copy in `styles-c9-dark-parity.css`. The existing dark-skip-link styling and rich mobile layouts remain in their respective source files.
- Eliminated the literal duplicated `.c9-practice-page .c9-practice-continuity` selector in `styles-c9-review-practice.css`.
- Introduced common non-data classes `c9-unified-card`, `c9-unified-actions` and `c9-unified-source-note` inside existing renderers for Home, course discovery, original lessons, Character Study, vocabulary/grammar/sentence libraries, scheduled Review, reading/conversations and progress/settings surfaces. All original actions, IDs, text, assessment controls and route handlers remain.
- Standardized source-card surfaces, typography, Chinese/Pinyin/English hierarchy, focus outlines, actionable buttons, feedback, form controls and responsive wrapping while retaining screen-specific spacing and content hierarchies.
- `src/index.html` registers `styles-c9-system.css` once, after C9-12. No new remote fonts, images or paid assets.
- `src/sw.js` moves the unreadable one-line precache inventory into named `SHELL_ASSETS`, `CONCEPT9_ASSETS`, and `LEARNING_ASSETS`, retaining the original contents and adding the new CSS. Cache identity updated. Existing offline install/fetch/activation logic otherwise unchanged.

## Ownership and non-goals
- All study/event writers, original local IndexedDB/CAS learner state, source rights, historical IDs, review scheduling, P31–P34 curricula, routes, and backups remain unchanged.
- CSS-only system components have no independent state or duplicate renderer, stores, audio, source data or grading logic.
- Original earlier stacked branches, main and production are not merged, overwritten or deployed.
- Phase intentionally excluded tests, builds, CI, browser audits, migrations, merges, deployments, credentials and paid services.

## Remaining limitations
- **NOT_TESTED:** Actual stylesheets/renderers are not browser-qualified; full accessibility, offline behavior and visual comparison are deferred to explicitly authorized C9-14.
- Inherited native P21–P34 markup remains in its original files where replacing structural markup would risk changing native educational interactions.
- CSS consolidates shared contracts but preserves individual screen-specific rules rather than deleting entire historical style layers prematurely.
