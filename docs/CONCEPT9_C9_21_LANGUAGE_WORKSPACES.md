# THIEPN Chinese — C9-21 Complete Vocabulary, Grammar & Sentence Workspaces

Parent: `631283907701b006a6fcb1dd235fda0cfe3437f8` on `feature/c9-20-lesson-character-experience`.
Child: `feature/c9-21-vocabulary-grammar-sentence-workspaces`.

## Actual source implementation

- Vocabulary: original `WORDS` catalog supports search across its canonical Hanzi/Pinyin/meanings/collocations/notes and bilingual indexed example data. Each original word shows complete meanings, natural authored collocations, original bilingual examples, source notes and extra sentences, with native `speak`, `c9-word-open`, `vocabulary-start`, `word-bookmark` actions.
- Vocabulary: source-backed bookmarked and introduced statuses remain independent; saved five-stage Wordbook journey is visible and resumable using the original `vocabularyJourney` authority; reset clears only ephemeral catalog filters.
- Grammar: all original authored lessons are accessible per chapter, with source examples, complete pattern, authored misconceptions and the original `grammar-select` handoffs; a recent-practice continuation derives solely from existing `sentenceEvents`. No attempt is misrepresented as completion.
- Sentences: visible original topic grouping and authentic bilingual sample per source topic, quick entry to native situation/first sentence, actual saved/attempted counts and last-practiced expression handoff deriving from authoritative sentence-event and bookmark records.
- Shared language workspace navigation links the actual `/wordbook`, `/grammar` and `/sentences` routes, with accessible current-route state. The legacy original Wordbook, Grammar and Sentence renderers are still the actual native learning players and assessment authorities.
- Original Grammar screen now structurally separates explanation, contrast and misconception, with stage headings and a recoverable native P32 supplementary-panel disclosure instead of a permanently expanded duplicate introduction.
- Original Sentence screen now exposes original P26/P32 source provenance, bookmark state and sentence-specific practice observation count, while focused recall makes otherwise hidden browser controls `inert` and screen-reader hidden; original writing, question, assessment, context and sentence event handling remain.
- Existing `styles-c9-libraries.css` was extended rather than creating another stylesheet or theme. Desktop/tablet/mobile surfaces, source cards, Pinyin and Hanzi, original examples, forms, modes, native contrast panels, status/empty states and focus-safe controls use established light/dark tokens.
- Existing Service Worker cache identity bumped for changed original source assets; no new remote resources.

## Preservation and limitations

Historical P31–P34 sources and published IDs; original saved words, introduced words, sentence bookmarks, Wordbook journey and practice events; native `addSentenceEvent`, wordbook event writer, scheduled SRS, IndexedDB authorization and backups; earlier stacked branches, independent P35–P47 drafts, main and production preserved.

NOT_TESTED: builds, tests, CI, browser acceptance, actual viewport rendering, user touch/keyboard behavior, offline installation, screen-reader coverage, migrations, merges and deployments were not run, per explicit restrictions.
Browser verification remains necessary before merging or representing this phase as production-qualified.
