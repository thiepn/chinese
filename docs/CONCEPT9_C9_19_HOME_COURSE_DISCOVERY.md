# C9-19 — Complete Home, Course & Discovery Redesign

Base: C9-18 `ea3041e37a4fe2fb894e1fa5382d0e94e7a2f77a`.
Branch: `feature/c9-19-home-course-discovery`.

## Real learner-facing implementation
- Home now provides a visible, evidence-derived progression across actual course units, with the next unintroduced original character per selected unit. The related native `hub-lesson` action opens the existing lesson workflow without creating or marking any progress.
- Home now provides direct reading, conversation, grammar and Pinyin journeys. Reading/dialogue counts come from the existing source registry, not invented scores.
- Repaired original C9 Home panel-heading/description classes that were unintentionally given card styles, restoring the intentional layout hierarchy.
- Learn now exposes original P31 Character/Vocabulary, P32 Grammar/Sentences, P33 Conversation and P34 Reading/Listening course modules as four visible, labeled learning journeys. Native action IDs, source content and existing grading remain. The less commonly used legacy character shelf/diagnostics stay accessible in one disclosure rather than duplicating the promoted modules.
- C9 Learn course waypoints use native scroll/focus interactions, not fragment URLs that would break the original hash router.
- Discovery groups the original `courseSearch` results by source type, shows grounded per-type counts and provides a full-search handoff retaining the source query and selected category. Reset restores only ephemeral UI filters; it does not alter learner state.
- The original source search engine, P31–P34 teaching, pathway missions, full search index, introduced-unit counts and grading writers remain authoritative; no parallel catalog or review system.
- Existing C9 Home/Learn CSS files now provide actual desktop/tablet/mobile grid composition, source group layouts, focus states, visual teaching distinctions, and light/dark semantic tokens. Existing reusable components preserved.
- Service-worker cache version bumped to distribute changed existing JS and CSS on later normal browser updates without new offline assets.

## Limitations
- NOT_TESTED: browser appearance, actual native interactions, responsiveness, full offline cache update and accessibility. No builds, tests, CI, audits, migrations, merges, deployments, credentials or paid services per instruction.
- P31–P34 modules are still original native layouts within visible course sections; C9-20–C9-24 will progressively refine detailed teaching, learning and media surfaces rather than replace them.
- Original learner records, source rights and IDs, earlier stacked branches, independent P35–P47 drafts, main and production preserved.
