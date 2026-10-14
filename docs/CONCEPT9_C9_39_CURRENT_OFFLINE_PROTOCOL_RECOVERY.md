# C9-39 — Version-specific offline source qualification and exact-head browser blocker

## Scope and source ancestry

- Target repository: `thiepn/chinese`.
- Verified parent: C9-38 stacked draft PR #41, branch `fix/c9-38-native-workspace-recovery`, exact head `ea69ec2e398abbf3cfefd3ffef98cbb47b2a35f3`.
- Dedicated stacked child: `fix/c9-39-source-routing-and-offline-repair`.
- Preserve the original C9 Today/Study/learning navigation, original educational source identities, canonical native Review grading, P43 local-only writing, IndexedDB learner authority, and all prior PR history.

## Confirmed defect: reporting previous-version offline cache as current readiness

The inherited `verifyC9OfflineShell()` accepted any service worker message with positive integer asset totals and `complete:true` if `cached===total`. It did not check the reported `version` or whether the total belonged to the **current original asset manifest**. Consequently a previous controlling worker could report a fully cached older 314-asset manifest and be shown as ready while this version's original 315-asset manifest remained unverified.

Actual code repair:
1. The app explicitly expects the version string `character-study-working-v46-c9-partial-repair` and the 315 original static source asset URLs declared in the existing `src/sw.js` manifest. A worker report must match both, plus strictly typed count, complete and failure fields, before being considered current. This does not introduce another caching engine or write to offline resources.
2. A previous worker's otherwise complete report now yields the distinct `outdated` status, **not** `ready`; stale counts are not displayed as current coverage. The original `incomplete` state still applies to partially cached current sources.
3. Network and Home status, including the offline guidance and a visible recovery notice while online, explain when an older worker remains in control. The notice instructs the learner to preserve any private P43 work before reloading online. No reload or backup is triggered automatically.
4. `src/styles-c9-home.css` explicitly respects `[hidden]` for the new notice despite the existing `display:flex` Home card styles. Mobile text wraps without horizontal overflow from the notice itself.
5. The original user-invoked offline repair now reports the old-worker condition without implying that the cached old version has repaired current sources. The existing service-worker authority and cache manifest are unchanged.

## Focused evidence actually obtained

- Exact draft PR #41 metadata and SHA were retrieved before creating the child branch.
- Container was checked: Node v22 and `/usr/bin/chromium` exist, but `getent hosts github.com` returned nothing and `git ls-remote https://github.com/thiepn/chinese.git HEAD` failed with `Could not resolve host: github.com`. `/mnt/data` has no checkout or source archive. No stale `dist` fallback was run.
- Retrieved the **exact parent** `src/sw.js`; evaluating its original asset list yielded **315** distinct declared URLs. This is a source manifest count, not a live cache or HTTP check.
- Executed the old and repaired `verifyC9OfflineShell()` function source in a narrow mocked-message environment (no browser). With the exact current v46 status and `315/315`, both correctly reported ready. With an older worker's v45 status and `314/314`, the old function incorrectly reported ready; the changed function reported `outdated` and no current coverage. With a current version but wrong `314/314` count, the same correction occurred. An actual current incomplete `314/315` report still produced `incomplete`.
- Edited application and Home module passed focused JS syntax parsing with static ESM imports removed (parser only); the styling rule was inspected. These checks do not exercise the DOM, layout, requests or device registration.

## Modified files

- `src/app.mjs`: strictly qualified current-worker status and transparent repair messaging.
- `src/home-c9.mjs`: distinct Home offline upgrade state, learner-owned P43 preservation guidance, status parity.
- `src/styles-c9-home.css`: hides the upgrade notice reliably and keeps text responsive.
- This document.

## Still NOT_TESTED; release decision HOLD

No exact source checkout was available to the local Chromium runtime. **No genuine application startup, mobile/dark screenshots, original Review grading → IndexedDB persistence → reload, P43 private JSON import/export/cancel roundtrip, cross-route unsent answer rejection, service-worker install/activation, actual offline fetch, accessibility acceptance, build or dist integrity verification has passed.** The existing original `scripts/c9_browser_acceptance.py` was not executed.

A genuine exact-head checkout and targeted Chromium/browser tests are the remaining release gate; screenshots and browser console/failure traces must be inspected before claiming visual or functional acceptance.

**Status:** SOURCE_INSPECTED, FOCUSED_SYNTHETIC_WORKER_PROTOCOL_PASS, SOURCE_PARSE_PASS, NOT_BROWSER_TESTED, NOT_BUILD_TESTED, NOT_DEVICE_TESTED, NOT_STORAGE_TESTED, NOT_OFFLINE_TESTED, NOT_VISUALLY_VERIFIED, NOT_DEPLOYED.

No full suites, CI, migrations, merges, deployments, credentials, paid resources or production data changes.
