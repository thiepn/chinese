# THIEPN Chinese — Concept 9 Implementation Contract

C9-00 baseline + C9-01 source-only visual foundations.
Status: implementation present, not visually/automatically tested.

## Selected identity

Clean Modular Scholar = quiet academic interface, not a generic SaaS dashboard:
- Light foundation: warm ivory #F8F7F3, white panels, ink text #202827.
- Accent: vermilion #A43E39 for primary actions; scholarly green #355848 for supporting study actions.
- Dark foundation: charcoal #10191C, panel #172226; muted vermilion #CA625B.
- Type: Source Serif 4 or Georgia for display; Inter / Segoe UI for controls; Noto Sans SC for Chinese text; Noto Serif SC for selective large characters. Local font fallback only, no online font dependencies.
- Balanced density: 4/8/12/16/20/24/32/40 px rhythm, 6–10px corner radii, small borders, subtle motion, legible bilingual hierarchy.
- Ink landscapes are optional approved assets in a later phase, never fabricated backgrounds for core learning data.

## Verified development ancestry — 13 October 2026

| PR | Exact head | Parent |
| --- | --- | --- |
| P31 #1 | 617ce260db7043649c249c1120d5a8ce025086f3 | P30 dcd2450c731d1889e82984db031c7388a9768359 |
| P32 #2 | 426641675d0369e45c7819ba0d47c9495ce1ad5c | P31 |
| P33 #3 | 4634830a76b266f46f77e722f39f1be0af8ba53a | P32 |
| P34 #4 | 6ef40e6b14c710516262c99304a5675bc396e151 | P33 |

C9-01 branch feature/c9-01-clean-modular-scholar-foundations is a direct child of the P34 exact head. Original draft PRs, main and production remain unchanged.

## Existing application inventory

- Runtime: native ES modules, HTML and CSS, not React.
- Shell and navigation: src/index.html; route handling and event dispatch: src/app.mjs.
- Existing CSS: src/styles.css and src/styles-p30.css through src/styles-p34.css.
- Learning views: src/workspace-p30.mjs, src/p31-screen.mjs, src/p32-learning.mjs, src/p33-screen.mjs, src/p34-screen.mjs plus the established course and practice modules.
- Local learner state, review scheduling and validation: src/study.mjs.
- IndexedDB writer, transactional updates, backup and restore: src/study-storage.mjs.
- Offline asset manifest: src/sw.js.
- Current theme state: root selector data-theme=dark and the existing settings.dark preference. Do not create a second theme store.
- Existing local demo content and authored pathways are not a certified/official HSK 3.0 corpus. Avoid false official syllabus membership or fabricated completions.

## Native route preservation

Existing routes include #/today, #/plan, #/pathway, #/learn, #/review, #/explore, #/find, #/progress, #/settings and the secondary course/practice/reader/grammar/pinyin/dialogue/wordbook routes. Concept 9 may change visual labels, not historical route authority. Preserve existing bookmarks and navigation links.

## Actual C9-01 implementation

The last-loaded src/styles-c9.css defines:
- Light and dark semantic tokens, including a bridge to P30–P34 semantic CSS variable names.
- Chinese, Pinyin and Latin typography with local/system fallbacks.
- New reusable c9-card, c9-panel, c9-grid, c9-stack, c9-inline, c9-badge, c9-button and variants, c9-icon-button, c9-input/select/textarea, c9-tabs, c9-progress, c9-notice, c9-empty and c9-data-table classes.
- Visible focus, reduced-motion support, responsive primitives and minimum primary control sizing.
- Live integration for existing common buttons, progress rails, P30 home/learn/explore panels, filter controls, typography and alerts.

src/index.html loads the new stylesheet last and uses the light foundation browser theme color. src/manifest.webmanifest uses the matching offline splash/theme palette. src/sw.js includes the new CSS in its explicit offline shell precache and adopts a new cache name.

## Migration strategy

C9-02: desktop sidebar, compact header and mobile navigation.
C9-03: actual today/home dashboard.
C9-04: course discovery and pathway.
C9-05: lesson workspace and section navigation.
C9-06: character study.
C9-07 through C9-10: secondary educational views, review, practice, reading/listening, progress/settings.
C9-11: complete dark-mode parity, including startup theme behavior.
C9-12 and C9-13: responsive/accessibility refinement, visual consolidation and assets.
C9-14: explicitly authorized consolidated visual/functional qualification.

As screens migrate, use shared c9 tokens and primitives, retire obsolete legacy style blocks, and avoid an endless accumulation of route-specific CSS overrides.

## Explicit protection rules

- No new framework, duplicate router, store, grading engine or practice writer.
- No modification of learner schema, backup format, source IDs, HSK claims or original curriculum.
- No client network fonts, paid services or credentials.
- No merges, deployments, production changes or migrations.
- C9-01 is a foundation, not a claim that Home/Lesson/Character Study already match the generated mockup.
- No tests, builds, CI, browser-based comparisons, qualification or audit were run for this source-only phase.
