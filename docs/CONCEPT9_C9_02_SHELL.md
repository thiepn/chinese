# C9-02 — Clean Modular Scholar application shell

Source-only implementation child of `f9c2d3f8596c346af9ba2a5dc8d4278377f2d2c8` on `feature/c9-01-clean-modular-scholar-foundations`. No testing, building, CI, merge or deployment.

## Implemented
- `src/index.html`: THIEPN Chinese branding, accessible inline SVG sprite, grouped desktop Study / Library / More learning tools / Your workspace, compact breadcrumb and global search header, 5-target mobile bar (Home, Learn, Review, Explore, More), accessible native dialog with every secondary learning route.
- `src/styles-c9-shell.css`: responsive visual shell, restrained color and active states, compact typography, bounded desktop columns, touch/safe-area-aware mobile navigation and modal sheet, dark-token styling.
- `src/shell-c9.mjs`: presentation-only mobile dialog and context navigation, header labels, active group styles, tools auto-expansion, focus controls. Existing `app.mjs` still owns all hash routes and learner activity. No extra database or router.
- `src/app.mjs`: shared shell initialization and per-render shell state via existing navUpdate, updated document titles.
- `src/sw.js`: added shell styles/module to offline cache with separate cache version.

## Preserved routes
`today,plan,pathway,learn,review,explore,find,progress,settings,reader,stories,practice,dialogues,wordbook,senses,workshop,journey,ladder,block,fluency,pinyin,grammar,sentences`.

## Boundaries
No changes to P31–P34 source contents, source IDs, learning algorithms, IndexedDB data, progress, mastery, review or event writers. Original local demonstration materials remain explicitly marked as not official HSK corpus. The shell is implemented; screen-specific Concept 9 Home, Lesson and Character Study work is for C9-03 to C9-06.

## Deferred qualification
No tests, builds, CI, browser visual checks or device testing performed. Dialog behavior, small-device layouts and icon rendering remain unverified until consolidated acceptance.
