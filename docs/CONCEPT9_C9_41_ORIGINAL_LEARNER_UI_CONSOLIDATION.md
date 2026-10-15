# C9-41 — Source-implemented original learner UI consolidation

## Exact stack and scope

**Verified parent:** open/draft C9-40 PR #43 on `fix/c9-40-exact-checkout-runtime-gate`, exact SHA `b39982690d8e0691134f8319437ffc232057486f`. C9-41 is an independent stacked child `design/c9-41-original-learner-ui-cohesion` (no earlier PR, main or production changes).

**User goal:** complete the actual original Mandarin learner's Home, Course/Learn, Review, Read/Listen/Speak, Writing, Vocabulary, Grammar and Sentence UI/UX; improve typography, hierarchy, touch sizing, focus, dark-mode consistency and findability without creating another interface framework or changing historical learning authorities.

## Implementation: consolidated, not duplicated

1. **One contextual route navigator.** `src/ui-c9.mjs` preserves all existing `C9_CONTEXT_LINKS` and route identifiers, but shows the current route and at most two nearby routes instead of seven simultaneous top-level pills. Less frequently used original links stay reachable inside a native keyboard-accessible `<details>` disclosure; Search remains visible. Desktop sidebar and mobile destinations remain canonical. Reworked the relevant selectors directly in the existing final `styles-c9-system.css`, with 44px activation heights, theme tokens, selected state and a non-overflowing inline mobile disclosure below 480px.
2. **Remove redundant language tabs.** The three inline Vocabulary/Grammar/Sentences tab bars were exact duplicates of the new contextual route controls. Removed them in the existing `renderWordbook`, `renderGrammar`, and `renderSentences` without changing content panels, native action IDs, user selections, answer values, source IDs, event writers or grading.
3. **Home: first, do the actual study action.** Preserved original hero, progress, saved-session continuation and immediate skill shortcuts. Optional longer course roadmap and source directory remain in the same Home DOM but are shown through one accessible native disclosure. This reduces the always-visible page length without removing lessons or destinations. Styling extends `styles-c9-home.css` and uses only original light/dark variables, with readable mobile controls.
4. **Learn: concise source navigation.** Replaced four oversized in-page shortcut cards with an `On this page` row using the *same* original `c9-learn-jump` action and destination IDs. The full P31–P34 teaching collection is moved behind a native disclosure rather than adding a parallel curriculum layer. When selecting `Extended course`, the existing action opens its ancestor `<details>` before scrolling and moving keyboard focus to the real heading. Original modules are still mounted in the source, available and editable by their original controllers. The old full-utilities disclosure remains intact.
5. **Native Review functional repair and truthful guidance.** The old `const progress=(done,total,label)` output referenced an undefined `saved` variable when building `aria-valuenow`, throwing `ReferenceError` when rendering active Review progress. Replaced it with a bounded current count derived from the supplied `done`; this does not change the actual assessment, `gradeCard`, queue or IndexedDB. Updated Review paused and route-leaving copy to accurately disclose in-tab answer retention versus reload boundaries established in C9-38. Focused responsive button/typing adjustments use only `styles-c9-review-practice.css`.
6. **Source-focused reading and language input.** Existing `styles-c9-media.css`, `styles-c9-libraries.css` and `styles-c9-writing.css` now improve Hanzi/Pinyin line-height, wrapping, touch-target minimum, mobile dialogue controls (two-column buttons, single column on narrowest widths), long-form writing textarea and handoff/backup controls. All selectors target preexisting original UI, not new cards or grading engines.
7. **Avoid stale visual assets.** This cache-first app must use a new offline revision whenever its cached app/CSS changes. Bumped `src/sw.js` and the app's original expected cache string together from v47 to **`character-study-working-v48-c9-41-visual-cohesion`**. The original 315 offline assets and source requirements remain unchanged, including the C9-40 builder's contract checking. Do not change any static asset path or authorized media.

## Focused verification actually performed

- **PASS:** GitHub parent PR #43 exact SHA and open/draft state verified before creating separate child branch.
- **PASS (source parsing only):** Edited `src/app.mjs`, `src/ui-c9.mjs`, `src/home-c9.mjs`, `src/learn-hub-c9.mjs`, `src/review-practice-c9.mjs`, and `src/sw.js` parsed successfully using isolated JavaScript function bodies after stripping only static ESM import/export. This does not import or execute the complete app.
- **PASS (static only):** All seven changed existing CSS source files have balanced curly braces. This is not computed-style, contrast, layout, CSS cascade or dark mode verification.
- **PASS (isolated source execution):** Original Review progress function invoked for 1/5 threw `ReferenceError: saved is not defined`; edited function returned `aria-valuenow="1"` and `width:20%`. Actual Review browser or native IndexedDB roundtrip **not** executed.
- **PASS (isolated source execution):** Ran the updated `renderC9ContextNav` using its original route metadata for Home, Learn, Writing, Review, Reading, Conversations, Wordbook, Grammar, Sentences, Pinyin, Advanced and Progress. Found exactly one `aria-current="page"` on non-Home routes, Search preserved and all related links present including inside accessible `<details>`.
- **PASS (static):** v48 service-worker string matches v48 expected app string; source module reports 315 unique static URLs, matching original app manifest count. This is not actual SW installation or offline reload.

## Runtime environment and limitations

The container has `/usr/bin/chromium`, Git and Node but **cannot resolve `github.com`** (`git ls-remote` fails). There is no exact matching checked-out repository or source archive mounted under `/mnt/data`. The connected GitHub app allowed exact SHA source inspection and isolated authorized commits, **not** a runnable complete checkout. No prior deployed website or old `dist` was substituted and no production writes were made.

**NOT_BROWSER_TESTED / NOT_BUILD_TESTED / NOT_VISUALLY_VERIFIED / NOT_DEVICE_TESTED / NOT_ACCESSIBILITY_TESTED / NOT_DARK_MODE_TESTED / NOT_OFFLINE_TESTED / NOT_STORAGE_TESTED / NOT_DEPLOYED.** No real Chromium screenshot of desktop, tablet, phone, dark mode, keyboard navigation or touch controls was captured or inspected. The actual target UI quality **cannot** be signed off from this source-only work.

## Remaining release/visual gates

1. Obtain genuine full exact C9-41 head checkout on an executable machine, validate SHA, start the original local app, and inspect desktop (1440px), tablet (768px), mobile (390px and 320px), both light/dark and text-zoom views.
2. Verify real contextual navigation and native details, direct hash/back/forward, source-specific unfinished answer protection, course jump focus, original Review live answer/grade and IndexedDB after reload, P43 private import/export and unsent writing recovery.
3. Capture and **inspect** actual visual screenshots and DOM layout for overlap, clipping, typography, reading/listening input, buttons, empty/error states, focus and touch ergonomics. Repair measured UI defects rather than declaring the design complete.
4. Execute genuine SW activation and offline reload under the v48 manifest; only then consider release acceptance.

**Final assessment:** meaningful source-implemented UI/UX consolidation and one confirmed Review renderer fix; visual design completion remains **unverified**, not finished or approved. No broad tests, CI, audits, migrations, merges, deployments, credentials, paid services, second writers or learner data changes.
