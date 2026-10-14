# Chinese C9-32 — Final Functional Integration and Runtime Recovery

## Ancestry and development boundary

- Repo: `thiepn/chinese`.
- Exact verified starting parent: C9-31 draft PR #33, branch `fix/c9-31-ui-integrity-recovery`, commit `7324c6a0e815f72f3884b339458bae917c9ecc90`.
- Child branch: `fix/c9-32-functional-integration-runtime-recovery`.
- Stack this branch as a **draft PR based on C9-31**, not `main`. No merges, deployments, migrations, CI, full test suites, credentials, or paid services.

## Implemented source recovery

### Original P43 writing is transactional during source navigation

The previous `requestC9Writing` set `pending` or reset the existing editor before calling `go('writing')`. If an unrelated original screen had unsubmitted text and navigation was canceled, the original P43 controller could already have changed source/unit state, potentially losing its existing in-tab work.

**C9-32:** verify the original target P43 unit, then request the route change **before modifying the writing controller**. A canceled route returns false and does not change the current draft, revisions, unit, source, or pending confirmation. A same-page source change still renders immediately after applying its original existing pending-switch/discard protection. The C9 Skill Paths writing-return bridge is assigned only after a successful destination-route request; an unsuccessful departure leaves the existing bridge untouched.

No new writing store, input, grade engine, identity, or persistence system.

### Browser-history and manual-hash unsent answer protection

The previous C9-28 unsent-answer confirmation applied to `go()` and clicked internal anchors. Browser Back/Forward and manual `#/route` edits changed location without these confirmation paths; the hashchange handler cleared original typed answers and redrew the app immediately.

**C9-32:** keep one route-commit marker and one consumed single-transition departure token (entirely in the existing `app.mjs` router). A successful native router action or confirmed route-link click approves only the actual source/destination pair. A browser history or manual hash transition is independently checked against the **previously rendered native screen** before any answer is cleared. If the learner rejects leaving, the original route hash is restored without activating or grading anything, and original native input remains visible.

Original successful submitted answer feedback is respected: Review, Grammar, Reading, Pinyin and Sentence Workshop do not incorrectly trigger an unsent-text confirmation when the current original native response already has feedback. No new duplicate route history store or grading outcome is introduced.

Remaining: browser policies can constrain hash/history restoration and arbitrary choices, screen-reader/device behavior still needs runtime acceptance. No guarantee of protection against process termination, full browser close or external navigation.

### Source-scoped native task mapping

The earlier `matchingC9NativeTasks` compared all P35–P51 task metadata keys against a source ID regardless of historical phase; accidental cross-phase source-ID overlap could therefore connect unrelated tasks. C9-32 now limits metadata matches to the original phase-specific fields (P35–P51), still using original `SENTENCE_TASKS`, exact task-ID prefixes and valid source-linked native story IDs. No arbitrary title-equality matching or invented assessment.

### Skill Paths: actual P49 historical evidence handoff

P49 original source-specific cases contain `sourceType`, `sourceId` and genuine historical P44–P48 references, but the C9 skill interface had no learner-facing way to follow their source-of-evidence.

C9-32 adds an **exact-reference-validated prior-source action** within the P49 learning stage, opening the original historical Advanced Course record, while preserving the current Skill Paths track/source/stage/support settings and providing a validated return. For reading, listening and exact-form production stages, a prominent context-specific action opens the existing native Reader, Dialogue or Sentence Workshop rather than displaying an ungraded source as though it proved comprehension. Native event writers remain the single learning authority.

### Consistent source discovery and honest continuation

Skill Paths now uses the exact `plain` normalization already present in the canonical Wordbook/Find infrastructure. Searching original Hanzi, tone-marked Pinyin with or without diacritics, original source IDs, original source references, vocabulary focus and grammar IDs works without copying or replacing the global search index.

The `Continue` CTA picks **only an authentic native Reader, Dialogue or Sentence Workshop mapping without an independently correct original event**. If none is mapped, the button is disabled with an explicit source-only explanation rather than claiming the learner can continue from a fabricated assessment.

### Mobile and visual continuity

The new contextual evidence/practice handoffs reuse original C9 flat editorial buttons, source surfaces, focus tokens, 44px touch targets, and responsive single-column layout at narrow widths. No new theme, grading system, remote app, or design-system replacement.

## Files changed

- `src/writing-c9.mjs` — transactional P43 source navigation.
- `src/app.mjs` — single-step route confirmation for Back/Forward/manual hash, return-bridge integrity, P49 source navigation, submitted-answer guard.
- `src/advanced-c9.mjs` — phase-specific source-to-native task matching.
- `src/skills-c9.mjs` — original historical P49 source and native practice actions; tone-insensitive discovery; honest next source.
- `src/styles-c9-skills.css` — responsive native practice/source-return UI.
- `docs/CONCEPT9_C9_32_FUNCTIONAL_INTEGRATION_AND_RUNTIME_RECOVERY.md` — this provenance and limitation note.

## Authority / test boundary

Canonical `src/study.mjs`, `src/study-storage.mjs`, IndexedDB data schema, original course/P35–P51 IDs, original native Reader/Dialogue/Sentence/Grammar/Pinyin/Review result writers, due scheduler, manual P43 draft backup v1, prior C9-31 offline cache v44 and external publishing all remain unchanged.

**VERIFICATION: TARGETED SOURCE INSPECTION ONLY.** Confirmed the exact parent branch/PR/SHA and manually inspected original P49 source metadata, P43 handoff code, original P35–P51 source field conventions and the live in-repo route actions. No complete browser interaction, downloads, offline install, device performance or runtime acceptance is claimed.

**NOT_TESTED / NOT_BUILT / NOT_DEPLOYED.** No full test suites, CI, audits, migrations, merges, deployments, browser qualifications, credentials or paid services were executed.

## Remaining known limitations

- Full mobile/tablet and screen-reader device acceptance, service-worker install/update behavior, data portability roundtrip, and real hash/history edge cases require runtime validation.
- Manual writing export still requires deliberate user action; no autosave/cloud sync.
- Native answer protection is scoped to known typed-answer inputs and native feedback states; arbitrary multiple-choice selections and external browser behaviors may differ.
- The unified Skill Paths surfaces source-based instruction and original stage definitions, not every original bespoke P46–P51 internal multi-question interface. All real graded assessment stays in native controllers.
- The current app still eagerly imports its established full curriculum; no unverified speed improvement is asserted.
