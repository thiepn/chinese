# C9-30 — Global Discovery, Manual Writing Recovery and Mobile Refinement

## Exact development ancestry

- Repo: `thiepn/chinese`.
- Verified parent: **C9-29 draft PR #31**, branch `feature/c9-29-unified-skill-paths`, exact commit `cbcd0143347cc9ae5af9a83594e34b96a5768b7b`.
- This phase is a **separate stacked child branch** `feature/c9-30-global-discovery-writing-portability`. Its draft PR is targeted to the C9-29 branch.
- Original `main` at branch creation remained `6493063598bcf7dd8611857250a36cc26201d427`. Neither `main` nor the predecessor PRs were merged or modified.

## Implementation-first learner functionality

### True cross-curriculum Find across original sources

The original `COURSE_INDEX` in `src/workspace-p30.mjs` now indexes **all 17 P35–P51 original source collections**, in addition to existing canonical character lessons, Wordbook entries, grammar, sentence, reading, dialogue and pathway sources. It does **not** introduce a second search engine, index store, learning identity or history writer.

- Retains the original `courseSearch` ranking, normalization, pagination, saved-only rules, `p30Query` state and the original C9 Search UI/actions.
- Advanced items carry source-search-only disambiguated references `p<phase>:<historical-id>`, explicitly **not** learner event IDs or invented official syllabus entries.
- Searchable teaching fields include original source title, Hanzi, Pinyin, English, phase label, goal, context, contrast, pitfall, misconception, source claim and up to 32 original authored sentence lines. No external corpus or unverified source has been added.
- The original `FIND_CATEGORIES` gains one **Advanced sources** category, with counts computed from the real source list. The existing saved-only behavior is honest: no fabricated advanced bookmarks; users must disable saved-only to see these entries.
- `c9LookupSource` validates the composite reference against the actual in-memory `C9_ADVANCED_PHASES` and its historical source ID. The original app opens the exact native C9 Advanced detail—not an invented lesson or assessment.
- Search queries, selected category, saved-only setting and pagination remain **in the same tab** through an Advanced detail and back.
- Source-return handoffs now also preserve a validated multi-hop path `Find → Advanced source → canonical native practice → Advanced source → Find`, while clearing unrelated stale discovery context.
- Original source atlas and five C9-29 Skill Paths remain accessible. Their learning evidence is still read only from original canonical state.

### Owner-initiated private P43 writing portability (no shadow store)

The sole original `p43ProductionStudio` composition controller gains a **visible backup/export/import experience**, including mobile controls:

- Download a private JSON file containing the current P43 unit, source-qualified P48/P50/P51 context, draft, up to 12 original in-tab revision snapshots, selected comparison, step, self-review flags, and explicitly revealed source/model support.
- On a deliberate local file selection, validate the format, version, file size (maximum 420,000 bytes), known P43 unit, historical linked source identity, text length, revision count and allowed criterion IDs. A malformed/unrelated backup is rejected with a clear error.
- Import **stages a preview**, including the source unit and snapshot count. It never mutates live writing until the user explicitly confirms replacing the current draft. Cancel retains existing text and revisions.
- Original editing, snapshot, clipboard, model reveal and source-review controls remain inside `src/writing-c9.mjs`; no second essay controller, review history writer or new persistent local database is created.
- Explicit export uses the browser's standard private-file download. Import reads only a user-selected local file via the browser File API. No autosave, remote upload, credential, telemetry, account access or sync is added.
- Banner messaging on unrelated learning screens now points users to this manual, private backup route rather than implying in-tab snapshots are backups. Browser file downloads are not guaranteed to succeed in every client.

### Responsive usability and offline shell

- Original global search filters remain keyboard-operable with visible focus and usable 44 px targets. On narrow screens, nine source categories fit in an accessible horizontally scrollable strip rather than an unwieldy wrapped filter wall.
- Indexed advanced result cards show their category and original phase context. Small screen search cards, fields and page controls receive deliberate readable/touch-safe styling.
- Private P43 backup actions, file input and error messaging stack into a comfortable single column on phones and small tablets, with real labels and focus affordances.
- Existing `src/sw.js` offline cache name is bumped, **without** changing learner data or asserting that untested offline navigation is verified.

## Source changes

- `src/workspace-p30.mjs` — original single search index extended with authored P35–P51 phase records.
- `src/integration-c9.mjs` — validated advanced search lookup and original route mapping.
- `src/app.mjs` — exact deep-link selection, stable Find/Advanced/native multi-hop return, private writing import event.
- `src/writing-c9.mjs` — original P43 editor gains owner-controlled export, bounded import, staged confirmation and recovery.
- `src/navigation-c9.mjs` — accurate unsent writing/export handoff copy.
- `src/utilities-c9.mjs` — complete original source discovery summary and honest saved-only explanation.
- `src/styles-c9-writing.css`, `src/styles-c9-utilities.css` — responsive, accessible source and portability layouts.
- `src/sw.js` — offline cache version for updated app/source assets.
- `docs/CONCEPT9_C9_30_GLOBAL_DISCOVERY_AND_RECOVERY.md` — this implementation and limitation report.

## Authorities and explicit limitations

All canonical learner-state stores, `src/study.mjs`, `src/study-storage.mjs`, original `DEMO_LESSONS`, `WORDS`, `GRAMMAR_LESSONS`, `STORIES`, `DIALOGUES`, `SENTENCE_TASKS`, scheduled-review engine, backups and native event writers are **unchanged**. No new learning event IDs, fabricated grades, stage completion, source qualifications, official HSK membership, proficiency ratings, or pronunciation verification are claimed.

- The P43 editor still does **not** autosave; refresh/closing the tab destroys work unless the user deliberately exports and keeps a local backup file.
- A browser can block downloads, and a user can lose exported files. Export requests must not be interpreted as confirmed external storage.
- Import reads only manually selected, self-contained JSON with deliberately narrow scope, not official learner-state backups or other app document types.
- Advanced phase search entries are **discovery references**. Multiple source contexts may refer to an existing canonical lesson; matching them does not produce separate learning evidence.
- Some staged P46–P51 specialist work still requires original native assessment screens; the C9-29 learner journey is not a claim that all bespoke specialist controllers have been fully transplanted.
- Mobile performance, user-interface acceptance, device audio, offline/PWA installation and browser-level recovery remain unverified for future qualification. C9-30 has no new remote services, background sync or auto-durable draft storage.

**NOT_TESTED:** No tests, builds, typechecks, CI, manual browser/device acceptance, qualification audits, migrations, merges, deployments, credentials or paid services were initiated.
