# C9-15 — Browser Acceptance & Release Blocker Resolution

Parent: 12e364c42a57797bb55ac4407b520d517ed19e1b (`feature/c9-14-final-integrated-qualification`).
Child: feature/c9-15-browser-acceptance-release-blockers.

## Source-level change
- `src/app.mjs`: corrected an obsolete `.c9-lesson-heading` selector to `.c9-lesson-header` on opening a lesson in-place. The old selector did not exist in the C9-05 lesson markup, so scroll-to-lesson was a no-op. Original navigation, lesson data and mutation writers remain unchanged.
- `scripts/c9_browser_acceptance.py`: new opt-in local-only Playwright runner using fresh browser contexts. It covers actual startup and key routes, existing lesson introduction and scheduled Review, native grading and reload, dark preference persistence, keyboard dialog, writing-pad controls, mobile/tablet/desktop overflow and real offline reload. It reports PASS/FAIL/NOT_TESTED without automatic certification.

## Actual browser execution prerequisites
Use a local checkout of this exact branch, Node >=20, Python Playwright and local Chromium. Run `npm run build` followed by `npm run serve`, then run `python scripts/c9_browser_acceptance.py --base-url http://127.0.0.1:4173`. Optional screenshot argument: `--artifacts /tmp/chinese-c9-15`.

## Grounded results and limits
- PASS: C9-14 exact parent verified and separate C9-15 stacked branch created.
- PASS: 54 focused original and C9 renderer/data module syntax checks (source parsing), with no newly discovered syntax blockers.
- PASS: Source inspection of original lesson-introduction, review-grade and settings handlers, their existing authorized state writers, and canonical route definitions.
- PASS: The obsolete in-place lesson scroll selector was confirmed and corrected.
- NOT_TESTED: The browser runner against the actual current C9-15 bundle. Chromium and Python Playwright are available in local tooling, but GitHub source download into the browser container is blocked by network DNS. The historical tracked `/dist` is not the current Concept 9 source output; using it would generate misleading browser passes.
- NOT_TESTED: Actual full application startup, browser theme, keyboard focus, genuine IndexedDB grade persistence, touchscreen, visual contrast and offline reload on this C9-15 branch.
- All tests must run on an isolated local build, not a user's production learning database or existing session.

## Release readiness
**HOLD**: The code and local acceptance harness are committed, but the browser acceptance has not been executed against the exact source branch and cannot be called PASS. Production merge/deployment requires a real local/browser run, inspection of captured light/dark desktop/mobile screenshots, keyboard/screen-reader review and review of any failed checks.

No branch merges, remote deployments, paid services, migrations, CI, credentials, changes to original grading/SRS/backup writers, source IDs or historical learner records.
