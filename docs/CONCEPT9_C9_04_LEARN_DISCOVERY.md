# Concept 9 — C9-04 Learn Hub, Course Discovery and Pathway

Parent: 480d84dba5460a3bdbce883fb95becd1e01f4d6f on feature/c9-03-clean-modular-scholar-home
Child: feature/c9-04-clean-modular-scholar-discovery

## Implemented
- Native Learn route now hosts original-source skill discovery, 20 unit cards, 12-per-page character lesson browsing, searchable course content and source-backed filters.
- The new pure module src/learn-hub-c9.mjs projects existing DEMO_LESSONS, lessonGroups, WORKSPACE_DESTINATIONS, courseSearch, learningHub, courseOverview and pathwayStats; it does not create a second curriculum or grading engine.
- Lesson open and source search actions delegate to existing application actions; original lessonDetails and all legacy learning tools remain accessible. Transient discovery filters are local UI variables only.
- Pathway overview at #/pathway uses nine original bands, real recorded attempts and correct unassisted task IDs; mission route #/pathway/path-NN keeps the existing native pathway player.
- src/styles-c9-learn.css supplies mobile/desktop responsive layouts and existing light/dark semantic token usage. src/index.html and src/sw.js load/precache the assets.

## Preservation
- All historical lesson, mission and source IDs remain unchanged. No official HSK 3.0 level coverage, fabricated locks, grades, mastery or achievements.
- No learner schema, IndexedDB writer, storage, network service, assessment, review engine or credentials changed.
- Previous C9 development branches, main, production and P31-P34 drafts unchanged.

## Deferred
- C9-05: focus on actual lesson workspace interaction design; C9-06: detailed character study UI.
- No tests, builds, CI, audits, browser/device verification, merges or deployments were run. Runtime/visual acceptance remains unverified.
