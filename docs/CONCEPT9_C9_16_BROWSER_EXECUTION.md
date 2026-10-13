# THIEPN Chinese — C9-16 Browser Acceptance Execution Attempt

## Exact source and changes

- Required parent: `29f09c17ff04e72f0ae03122e9c26eca8bdddec1` on `feature/c9-15-browser-acceptance-release-blockers`.
- New child: `feature/c9-16-browser-acceptance-execution`. Neither main nor production is changed.
- Updated `scripts/c9_browser_acceptance.py`, preserving the native learner-state, review and assessment authorities.
- Added an exact `src/`↔`dist/` content-inventory and SHA-256 precondition so stale repository-tracked `dist/` cannot stand in for the C9 checkout.
- Added optional `--expected-head <full-40-character-SHA>` Git HEAD verification. When this is omitted the runner explicitly marks commit provenance NOT_TESTED and cannot claim automated acceptance.
- Expanded the actual browser runner to interact with original Vocabulary search/dictionary, Grammar lesson selection, Sentence topic handoff, Reading Pinyin help, Dialogue turn navigation, and accessible DOM landmarks. Its existing lesson→Review→IndexedDB grading, handwriting, settings, keyboard dialog, mobile/tablet/desktop overflow and offline reload checks remain.
- Added optional desktop/mobile dark-mode screenshot capture and a dependency-safe NOT_TESTED result when the prior lesson-introduction flow fails.
- The runner now outputs `automated_acceptance_passed` and an always-false `release_qualified` result until separate human screenshot, screen-reader and explicit release decisions occur. This prevents an automated script from asserting full product release readiness.

## What was actually executed this phase

| Check | Status | Evidence / limitation |
| --- | --- | --- |
| GitHub C9-15 exact parent verification | PASS | Parent head matched the user-supplied SHA |
| Separate stacked C9-16 branch | PASS | Created from that exact commit |
| Local Chromium executable | PASS | `/usr/bin/chromium` exists |
| Python Playwright import | PASS | Installed in local Python environment |
| GitHub checkout via git | FAIL | `git ls-remote https://github.com/thiepn/chinese.git HEAD` could not resolve `github.com`; none of api.github.com/raw.githubusercontent.com/codeload.github.com resolved either |
| Exact C9-16 repository archive | UNAVAILABLE | No current GitHub branch ZIP is attached or mounted; older Library content is not an exact checkout |
| C9 app named import/exports | PASS (source-only) | All 76 named app import declarations checked against matching source exports through connected GitHub |
| Real current-source build | NOT_TESTED | Source not available inside Chromium-capable container |
| Actual Playwright runner on this branch | NOT_TESTED | Cannot qualify historical `dist/` or a mock app as this checkout |
| Actual login-free IndexedDB review grading/reload | NOT_TESTED | Requires checkout and local HTTP server |
| Actual responsive / light / dark screenshots | NOT_TESTED | No browser-rendered images from current branch were obtained |
| Actual touchscreen, keyboard, screen-reader & handwriting | NOT_TESTED | Cannot infer from browser availability or source inspection |
| Actual reader/listener/sentence/grammar interaction | NOT_TESTED | Source-action references verified only; no live app interaction |
| Service worker installation/offline/reload | NOT_TESTED | Requires fresh local build of exact branch |

**Release readiness: HOLD.** No genuine C9-16 browser acceptance result exists. The local runner is available to execute once the exact checkout is mounted. The runner itself remains unexecuted against the target app; its new browser interactions therefore have no PASS claims. It does not replace manual contrast/visual or assistive-technology review.

## Reproducible next execution (real checkout only)

1. Clone or supply an exact ZIP of the C9-16 head and make it the local working source (not previous `dist/`).
2. Use Node >=20, local Python Playwright and a local Chromium binary, with no remote account or production connection.
3. Run `npm run build`, then `npm run serve` in that checkout.
4. Run `python scripts/c9_browser_acceptance.py --expected-head <verified-C9-16-commit-SHA> --base-url http://127.0.0.1:4173 --artifacts /tmp/chinese-c9-16`.
5. Inspect captured light/dark screenshots and recorded PASS/FAIL/NOT_TESTED, review screen-reader behavior with assistive technology, fix confirmed failures on a stacked child and rerun. No merge or deployment is authorized by this document.

## Preservation

- No app-side learning-state changes, no grade writer, progress store, source ID, official HSK membership, historical student record or backup format changed.
- All C9-01–C9-15 stacks, prior source content P31–P34, main and production remain untouched.
- No CI/GitHub Actions, production deployment, schema migration, credential use or paid service.
