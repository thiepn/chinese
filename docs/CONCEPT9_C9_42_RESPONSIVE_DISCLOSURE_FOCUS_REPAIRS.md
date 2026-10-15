# Chinese C9-42 — Original UI interruption and responsive source repairs

## Exact verified ancestry

- Parent C9-41 draft PR #52, branch `design/c9-41-original-learner-ui-cohesion`, exact SHA `52ba1cf44cfba58a6411b7475575dd49467e570b`, open/unmerged.
- Separate stacked C9-42 child `design/c9-42-responsive-flow-source-repairs`.
- No merges, deployment, production writes, broad CI, data migrations, learner-state changes, external dependencies or paid services.

## Runtime blocker

In the currently accessible container `git ls-remote https://github.com/thiepn/chinese.git HEAD` fails with `Could not resolve host: github.com`. Chromium, Git and Node exist, but `/mnt/data` has no exact full source checkout. The authorized GitHub connector provides exact-head individual source files and Git objects but no mounted executable checkout. No old `dist`, live production or different-head implementation was substituted.

**NOT_BROWSER_TESTED, NOT_VISUALLY_VERIFIED, NOT_DEVICE_TESTED, NOT_BUILD_TESTED, NOT_DARK_MODE_TESTED, NOT_OFFLINE_TESTED, NOT_STORAGE_TESTED, NOT_ACCESSIBILITY_BROWSER_TESTED.** No genuine screenshots, computed layout dimensions, browser console traces, Review grade/IndexedDB reload or P43 private JSON roundtrips have been taken.

## Source-confirmed defects and implementation

### 1. Collapsible original learning sections reset on the next same-route render

C9-41 introduced `details.c9-home-explore-more` and `details.c9-original-curriculum-disclosure` to keep the Home and Learn pages focused. It also introduced `details.c9-context-more`. The original `render()` in `src/app.mjs` always replaces `root.innerHTML`, so *any* native action or state update that renders again in the same route recreated all three disclosures closed. A learner exploring P31–P34 or an expanded Home unit shelf loses the visible section after a routine update.

**Repair:** capture these three specific native disclosure classes' `open` property before repaint, *only* when `c9RenderedHash===location.hash`, and restore their native `open` state in the newly rendered DOM before re-establishing native focus. No extra router, storage, session authority, synthetic grades or persisted navigation history. Route/source transitions deliberately do **not** carry disclosure state to a different hash.

**Focused isolated source execution:** reproduced extraction from the actual changed source returned `open=true` after same-source rerender when it began open; `open=false` stayed closed; a different hash did not inherit old openness. This is **not** a full DOM/browser run and does not establish scroll-position preservation.

### 2. New disclosure summaries lose keyboard focus on rerender

`captureC9Focus` in the original `accessibility-c9.mjs` identifies focused inputs/actions by ID or data-action. The C9-41 native disclosure `<summary>` elements have neither. The original focus snapshot therefore cannot return keyboard focus to a summary after repaint.

**Repair:** extend the *existing* capture/restore helpers with only the three whitelisted C9 disclosure class names. A focused native summary is restored to the equivalent summary after same-route re-render (and after the disclosure's open state has been restored). The previous ID/action and selection-range handling remains unchanged. No new focus manager.

**Focused isolated source execution:** actual parent capture/restore of a mock focused original-course summary produced `disclosure:null`, `restored:false`; edited function produced `disclosure:'c9-original-curriculum-disclosure'`, `restored:true`. Synthetic focused-element mock, **not browser keyboard evidence**.

### 3. Secondary menu can obscure active lessons on mobile/tablet widths

C9-41 styles declared `.c9-context-more-links` `position:absolute` by default, with in-flow positioning only below 480px. Between 481 and 800 CSS pixels it remained an absolutely positioned surface over later document content, including the first lesson section. Instead of another overlay menu, C9-42 uses the existing native details element in *normal document flow* at widths up to 800px; existing desktop treatment and original navigation destinations remain. This is a source-grounded stacking rule repair, **not** a claim of measured overlap or screenshot verification.

### 4. Search displays a duplicate current-page destination

C9-41's contextual navigation always appended a `#/find` Search control even on `route==='find'`, where Find is already the current item. Removed just the duplicate; all other routes retain the Find entry.

**Source execution:** changed `renderC9ContextNav` returns exactly one `aria-current='page'` and no duplicate Search control on Find; other sampled routes retain one current page and the Find action.

### 5. Cache-first offline visual source revision

Existing `src/sw.js` matches the application's original expected cache name. Bumped both together from v48 to `character-study-working-v49-c9-42-responsive-continuity`, so installed cache-first users do not keep serving previous version JS/CSS in place of C9-42. No changes to the 315 original precache paths or service-worker writer.

**Static source check:** all 315 distinct declared offline URL paths exist in the exact C9-41 repository tree; app and worker versions match. This is not genuine cache installation, offline fetch or HTTP checks.

## Modified files

- `src/app.mjs` — same-hash disclosure capture/restore plus expected SW revision.
- `src/accessibility-c9.mjs` — restore keyboard focus to three existing disclosure summaries.
- `src/ui-c9.mjs` — no redundant Find control on Search.
- `src/styles-c9-system.css` — normal-flow tablet/mobile disclosure links, using existing theme tokens and touch behavior.
- `src/sw.js` — v49 cache-first source revision; original manifest unchanged.
- This implementation record.

## Limited executed evidence and remaining gates

**PASS, source-scoped only:** isolated edited JS parsing (app, accessibility, UI and SW), disclosure preservation across same-source mock repaints, native-summary focus capture/restore mocked execution, selected route navigation HTML generation, source CSS brace consistency, v49 app/SW string match and 315 existing source paths.

**NOT_TESTED:** genuine exact-head app startup and module imports; Chromium desktop/tablet/mobile screenshots and measured overflow; dark-theme contrast; real focus/screen reader/touch; original Review grade→IndexedDB→reload; P43 file export/import/cancel; browser Back/Forward; service-worker activation and offline navigation; real build and SHA-256 output. No UI/UX completion or release sign-off.

## Next action

Acquire a genuinely executable complete current-head checkout; run narrowly focused Chromium at 1440px, 768px, 390px and 320px with light/dark/text zoom, keyboard disclosure focus, Home/Learn learning journey and original Review/P43/offline gates. Capture screenshots and repair only observed defects. Preserve original curriculum, IDs, assessment and private-state boundaries.
