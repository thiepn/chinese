# Character Study · Batch 20 consolidated verification

**Status:** Local feature-freeze candidate, not production qualified  
**Source-tree SHA-256:** `67b84c427821461040d31fb055fdb94e4fb2938fea0b43c24efc90ae2eaeb7f5`  
**Source file count:** 80  
**Source baseline:** Local Batch 19 ZIP; previous 74 lessons/12 readings/10 dialogues/206 fluency configurations preserved.

## Implemented

1. New read-only `course-overview.mjs`: distinct scheduled and supplementary counts, honest introduction progress, active checkpoint listing and actionable next activities.
2. Unified continuity panels in Today, Learn and Progress; recovery center in Settings.
3. New `backup-preview.mjs`: validated non-destructive preview, before/after comparison, clear loss warnings and exact confirmation phrase; replacement requires matching database revision atomically.
4. Accessible global Chinese text size preference with optional version-1 state field and legacy backups accepted.
5. Responsive course shortcut bar on mobile, with source-owned route links and keyboard navigability.
6. Offline service-worker asset list updated to include both new modules, cache revision v20.

## Actual executed checks

| Check | Result |
|---|---|
| `npm test` | PASS · 300/300 tests, 0 failures |
| `npm run build` | PASS · 53 dist assets |
| `npm run verify` | PASS · 53/53 asset hash checks |
| Local server, HTTP 200 across built assets | PASS · 53/53 |
| Missing resource HTTP 404 | PASS |
| Source SHA-256 manifest | CREATED, 80 source/support files |
| Real browser end-to-end navigation | NOT TESTED |
| Actual IndexedDB save/import/reload | NOT TESTED |
| Real service-worker offline reload | NOT TESTED |
| Real screen-reader and human owner visual approval | NOT TESTED/PENDING |

One consolidated regression run initially found six stale v19 service-worker expectations and one range matcher that excluded version 20. Expectations were updated to v20 **without deleting coverage** and the suite reran successfully. A late revision-guard test was added to the final single batch regression suite, yielding 300 tests.

## Preserved boundaries

No certified HSK 1 corpus, no official HSK inventory redistribution rights, no independently validated sentence/audio corpus, and no production authorization. No remote repository, deployment, credentials or DNS changes. Backups remain **replacement-only**: import does not merge or fabricate learner mastery. An imported dataset replaces local scheduled and supplemental events only with explicit confirmation.

## Freeze decision

**LOCAL FEATURE FREEZE — ACCEPTED AS SOURCE SCOPE**: no further independent learning modes are planned; move to post-freeze browser integration, data recovery, UX accessibility, human visual review, and legally qualified educational content. **PUBLIC RELEASE — NO GO** until these independently pass.
