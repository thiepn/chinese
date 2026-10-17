# Original THIEPN Chinese P61–P80 — learner functionality

Recovered from the **content-first 100-phase roadmap (2026-10-12/13)**, not from later reused release-gate labels. Original phase numbers are product goals, **not proof of implementation**.

## Reconciled starting point

- Merged `main` verified at `73092972f2d907061200b21f531d338f7261a7f0` (C9-50 PR #65).
- Existing open C9 draft PR #64 started this batch at `efb7e8c9ee52db8e47ff53d2bc645f82b2ecce87`; this work continues on **the same** development branch and PR. Production stays unchanged.
- Historical P58 draft #48 (`69f24c7d1d453baae97e22a2c7e1b56638c7022f`), P59 #49 (`9f937a7cf4e4546f74114d216faf3ecc58e4bb0a`), qualification P60 #50 (`41dc3152731b822891ed2409b3376b7b9cd9510d`), qualification P61 #51 (`716d88f7cf1175c888d005c4d7978b254c08175d`), and qualification P62 #53 (`6063ce25b116dcae82f5e6547b5d7248264b002e`) remain historical **drafts**, not product completion.
- Native original source assets: 428 demonstration character lessons, canonical indexed whole words, sentence library, Reader, Stories, Dialogues, P31–P51 original instructional material, the C9 Home/Lesson/Character/Review/Reading surfaces, local StudyEvents/Review and private P43 composition. **No official HSK 4–6 accreditation/corpus, verified stroke-order diagrams, authoritative radical decomposition, or licensed media set has been established.**

## Phase-to-feature audit

Status indicates learner-facing functionality evidenced in original source, not QA/release state.

| Phase | Original feature | Original product coverage after this batch | Remaining core gap |
| --- | --- | --- | --- |
| P61 | Stroke Order & Character Writing | **Partial**: every original character opens native source-glyph copy and optional printed tracing; pointer/keyboard pad | Verified ordered strokes, stroke counts and direction require properly licensed authoritative stroke records |
| P62 | Interactive Handwriting Studio | **Substantial partial**: three guided modes, undo/clear, touch/keyboard, retain prior attempt for repeated freehand comparison, local-only cleanup | No authentic stroke playback or recognition; additional review polish/accessibility acceptance needed |
| P63 | Independent Character Writing Recall | **Partial**: meaning/pinyin cue, hidden near-field reference, optional reveal, independent try/redo for 428 source lessons | User can still navigate to source answer elsewhere on page; no objectively verified handwriting |
| P64 | Radicals & Phonetic Components | **Not implemented as a verified teaching system** | Source-reviewed structural/decomposition and phonetic relation records needed |
| P65 | Confusable Chinese Characters | **Not implemented as reviewed contrast curriculum** | Author-paired sets with verified distinctions, examples, genuine exercises |
| P66 | Advanced Chinese Dictionary | **Partial**: current Explore/Wordbook use canonical lexicon, pinyin, context examples, senses and index-backed source links | Broader definitions, usage contrast, variant support with rights-cleared sources |
| P67 | Premium Chinese Reader UI | **Partial/substantial**: original Reader/Stories, source-line navigation, translation and contextual assistance | Deep reading workflow polish and verified source coverage beyond current catalog |
| P68 | Extensive Graded Reading Library | **Partial**: original P28/P34/P38/P41/P46–P51 source readings | Extensive independently reviewed graded corpus and clear editorial metadata; no false HSK labels |
| P69 | Personal Text Reader & Sentence Mining | **Partial, usable**: new optional paste-and-annotate tool on native Reading, existing glossary/word links, in-tab sentence mining and clipboard | Stronger segmentation and advanced reading tools; no arbitrary pasted text promoted into official lessons or graded records |
| P70 | Chinese Typing & Written Communication | **Partial**: existing native typed answers and P43 paragraph drafts/revisions | Dedicated systematic, independent Chinese typing progression |
| P71 | HSK 4 Character & Vocabulary Course | **Not delivered as official HSK 4** | Licensed/verified level-bound content; existing original P35–P51 material does not imply HSK membership |
| P72 | HSK 4 Grammar & Sentence Patterns | **Not delivered as official HSK 4** | Level-bound reviewed instruction and tasks |
| P73 | HSK 4 Reading & Story Collection | **Not delivered as official HSK 4** | Author-verified mapped reading library |
| P74 | HSK 4 Listening & Conversation | **Not delivered as official HSK 4** | Verified level-aligned listening/audio and dialogues |
| P75 | HSK 5 Vocabulary & Nuanced Expression | **Not delivered as official HSK 5** | Level-scoped lexical content and pragmatic nuance |
| P76 | HSK 5 Grammar & Extended Communication | **Not delivered as official HSK 5** | Level-scoped authentic instruction and independent practice |
| P77 | HSK 5 Extensive Reading | **Not delivered as official HSK 5** | Larger reviewed reading corpus |
| P78 | HSK 5 Audio, Video & Media Learning | **Not delivered as official HSK 5** | Rights-cleared recorded media and verified companion curriculum |
| P79 | HSK 6 Vocabulary & Language Depth | **Not delivered as official HSK 6** | Verified advanced lexical coverage |
| P80 | HSK 6 Integrated Communication | **Not delivered as official HSK 6** | Level-appropriate multi-skill source and evaluation |

## Implemented now on unchanged draft PR #64

1. Reuse **C9 Character Study**, not a new writer, for copy/print tracing/recall. Preserve the existing native glyph, author-supplied teaching, original lesson IDs, and original scheduling. All handwriting remains in memory only; no recognition or grades.
2. Keep a previous user attempt in tab memory, clear the active pad for retry, compare visual marks without fabricated feedback or persistence. Preserve accessible pointer/keyboard interactions and disposal.
3. Reuse the **original Stories glossary tokenizer and canonical Lexicon** on Reading for short user-pasted text. Word annotations open native indexed Wordbook records. Unknown terms remain visibly unverified. Sentence selections and text stay in memory only; copying is explicitly user-initiated. No P43 drafts or canonical StudyEvents are overwritten.
4. Increment app and worker cache together for offline updates; existing 315 source assets remain unchanged in cardinality, and original test expectations follow the actual cache version.

## Next coherent implementation batches

- **P64–P66:** source-backed structural and visual contrast only when actual reviewed records exist; improve canonical dictionary source evidence and lexical distinctions without invented radical/phonetic/etymological facts.
- **P67–P70:** complete reading discovery, explicit source limits, richer private text reader, reliable export/handoff and typing transfer across existing Reader/Wordbook/P43.
- **P71–P80:** expand genuinely authored, rights-cleared advanced language sources first. Treat HSK labels as specifications requiring authentic verified mappings, not labels to attach to existing P35–P51 records.

## Verification discipline

Source compile checks and GitHub provenance can be performed through the authenticated connector. The current sandbox **cannot resolve github.com**, so it lacks a complete exact-head executable checkout. Node module tests, HTTP-origin Chromium, IndexedDB and service-worker checks remain **NOT_TESTED locally** until an actual checkout/CI job supplies results; never reinterpret source inspection as browser PASS. No production merge, deployment, migrations, new accounts, paid services or credentials.


## Original P64–P70 feature-first continuation (October 16, 2026)

**Git state correction:** Original draft PR #64 was merged independently on 2026-10-15 at main commit `b6f6fe0dc398f25ab24c649ac0c9a7aee3a73958`; the final parent-branch PR head was `e30b201391d0d19a7807c79e90e5e06e00ae7d50`. The exact-head original Chromium qualification on that head passed 77/77 checks, after repairing the earlier mobile lesson-fold failure. Following user instructions, this next batch uses the **same existing branch**, creates **no new PR**, and does **not** alter main or production. A merged PR cannot receive further unmerged code changes.

- **P64:** no authority-backed radical/decomposition curriculum was found; do not infer or certify one from font glyphs, shared characters or vague similarity.
- **P65 partial:** `src/character-c9.mjs` now shows existing individually **authored `DEEP_NOTES` comparison advice**, linking exact canonical whole-word entries when they are actually mentioned. `src/lexicon.mjs` enumerates distinct same-written-form readings, identical indexed pinyin of different written words, and whole-word written-component neighbors. Neither module claims visual confusability, etymology, shared meaning or phonetic-component certification.
- **P66 extended:** the *existing* Wordbook catalog includes expandable comparisons with authored whole-word meanings, pronunciation, provenance examples and native full-entry links. All historical `word.key` identities, saved/introduced records and associated practice remain authoritative.
- **P67–P69 extended:** the tab-private pasted-text reader now shows dictionary-indexed whole words with actual source senses and example context, flags unmatched Hanzi tokens as indexing gaps rather than learner errors, links exact matches to original Sentence Library tasks, and provides explicit native Wordbook save/unsave. Unapproved pasted passages, mined sentences and all personal text stay in tab memory; no automatic imports into source material, Grade, Review or StudyEvents. Clipboard copy remains manually invoked.
- **P70 substantial native integration:** an expandable typing pathway in the original Sentences page selects original `sent-NNN` tasks by existing production event evidence and prioritizes independent retries. Launching sets `libraryMode='production'`, native independent focus and hides pinyin support; the unchanged native `sentence-answer` uses `checkSentence` and `addSentenceEvent`. No fabricated typing proficiency, competing scheduler or exercise database.
- The original source/static offline asset inventory remains **315**; the app and service worker use the same revision `character-study-working-v62-source-bridge-bundled-native`. Source-only and local HTTP browser verification are different gates. Changes to the existing source branch do not constitute an update to merged PR #64.

**Remaining:** a verified/licensed visual radical–phonetic decomposition set, reviewed confusable-character pairs, deeper bilingual dictionary editorial coverage, broader advanced reading corpus, personal-text token disambiguation, native typing UX refinements, and all verified HSK 4–6 curricular mapping/media licensing. Treat these as OPEN features, not completed milestone numbers.


### P67–P68 reading-continuation addendum

The existing Reading hub now shows original-source reading recommendations chosen from recorded `readingEvents` and bookmarked original story IDs. Unresolved wrong/assisted attempts appear first, followed by saved unattempted and other original passages. Links invoke the existing `c9-media-open-story` reader action; browsing cannot grade, certify a level or create a new passage. Original source identity, authored passages and the existing reader assessment remain unchanged. The still-missing graded/rights-reviewed reading corpus is **not** inferred from these recommendations.


### Next coherent P69–P70 original learner batch — private reading and full typing discovery

- **P70 now exposes all original `sent-NNN` production records through the existing Sentence Library**: topic filters, retry/unattempted/latest-independent filters, six-per-page browsing, and a real source handoff to focused typed production. Evidence/status comes only from existing `context:<sentence-id>:production` sentence events. Previously recorded independently correct attempts are counted separately from latest-attempt status. The original sentence answer checker and grading remain unchanged. Typed production references still stay hidden while focus is active, including the surrounding original sentence directory.
- **P69 now disambiguates identical written forms with different canonical readings** via `wordsForWrittenForm` in the original Wordbook index. The personal reader shows the alternatives and source-backed senses rather than inventing a contextual disambiguation. A dictionary result does not certify that it is the appropriate translation.
- **P69 private session safety**: repeating annotation of unchanged input preserves mined sentences; replacing annotated content with selected sentences requires explicit consent. Stale annotations are concealed after text edits; canceling replacement preserves earlier selections. More than 32 segments are disclosed as partially processed; unprocessed text remains in the input and never enters the published catalog.
- **Disclosure continuity**: the typing filter disclosure and keyboard focus survive same-route re-renders through the existing accessibility layer.
- The app and service worker share revision `character-study-working-v62-source-bridge-bundled-native`, with inherited offline test expectations advanced rather than weakened. Asset cardinality is unchanged.
- **Still open:** original source-reviewed radical/component datasets (P64), verified visual confusable pairs (P65), full linguistic word-sense editorial expansion (P66), substantially larger approved graded readers (P68), arbitrary text token ambiguity resolution by real linguists (P69), and valid level-scoped HSK 4–6 curriculum (P71–P80). Browsing existing sourced records does not itself establish those products.


### Original P64–P68 cross-source teaching implementation

A new read-only `src/source-bridges-c9.mjs` projects **only** canonical original word keys, demo character IDs, sentence IDs and story IDs. Wordbook displays verified *written-form occurrences* across original word examples, sentence records and passages, each with a native source handoff. Character Study presents shared indexed whole-word examples and navigable original character/word records. The native Reader offers optional original-word teaching support; revealing definitions **explicitly marks the current reader answer assisted** and the original reading grader remains authoritative. Multiple registered readings are shown as unresolved alternatives. No radical, phonetic, historical, visual-confusable, sense-disambiguation or official HSK authority is inferred. This is meaningful P65–P68 native functionality, not a completed verified radical dataset or new approved graded corpus.

The service-worker asset manifest now includes the new source module, with 316 source-inventory assets (8 runtime-precache assets) and paired `character-study-working-v62-source-bridge-bundled-native` application/worker revision. All earlier P61–P80 status claims remain partial where genuine content remains unavailable.


### Latest main UX + compiled startup integration

The P64–P70 branch has been reconciled with the independently advanced main UI/navigation and compiled startup build. The **source manifest** still enumerates 316 unique curriculum/development assets, including `source-bridges-c9.mjs`; the separate **runtime service-worker precache** contains **8 compiled startup/shell assets**, not 316 runtime requests. `src/app.mjs` and `src/sw.js` pair the `character-study-working-v62-source-bridge-bundled-native` revision. Main's mobile navigation, original lesson start and unified Learn/Review flows are preserved. Historical source IDs/graders and privacy records remain owned by their respective original modules.


### P67–P68 next learner-functionality batch — source-owned graded reading continuity

A new original Reading queue traverses **all existing source passages** rather than limiting continuation to four cards. It supports status filtering (latest response needs retry, never attempted, last response independently correct), saved passages, and page navigation. It preserves both ever independently correct evidence and latest-attempt evidence, including cases where an earlier pass is followed by a later assisted or incorrect response. Recommendations select one **actually available** original `storyExercise` mode per passage (comprehension, cloze, ordering or source-backed pronunciation). Actions open the unchanged native story player and its original `addReadingEvent` writer, subject to the existing unsent-response guard. Opening, searching or filtering never creates an event or claims an official HSK tier.

This branch remains on the compiled startup architecture: eight runtime-precache assets and a separate inspected original source catalog. `src/app.mjs`, `src/sw.js`, original Node tests and Chromium acceptance share `character-study-working-v64-context-source-handoffs`. A larger approved reading corpus and linguistic source verification remain genuinely OPEN, not completed by UI extensions.


### P66 original source-context learner completion

The canonical Wordbook now filters indexed words by original source occurrence (any, original sentence, original reading line, or no occurrence in either). These are **literal complete-written-form matches**, never inferred lexical senses or official HSK classifications. Word cards disclose sentence, reading-line and author-example occurrence counts from source IDs. Identical Chinese text occurring in more than one original source preserves **all canonical handoff links** rather than losing source identity to text deduplication. Source-reading links open precisely the cited sentence inside the original passage/player and reuse the existing unsent-answer transition guard. Opening a reference adds no grades or invented completion. Controls are responsive and tested at 390px mobile.

No new radicals, confusable-character claims, scheduler, grade authority, private-user-text persistence or official curricula are introduced. The bundled startup continues to precache 8 runtime assets (the source manifest remains separately verified) at paired revision `character-study-working-v64-context-source-handoffs`.


### P65/P69/P70 original-source continuation — October 17, 2026

The P65 source-authored character-use comparisons and P69 private reader pagination, exact passage handoffs and source-aware study notes from original draft PR #76 were reconciled onto C9-61 main without reverting its newer dialogues, navigation or original source IDs. P70 adds disposable Chinese retyping of user-pasted sentences with manual source reveal, retry, and cross-page typed-draft continuity in a tab-private memory space. Neither private text nor writing becomes approved material, StudyEvents, grades, mastery evidence or a server write. The application and service worker use paired cache revision `character-study-working-v66-p65-p70-original-private-continuity`. Independent linguistic editorial review, authoritative strokes, larger verified graded reading corpora and real device/visual acceptance remain open.


### P64–P68 native cross-source study paths (2026-10-17)
- **P64–P65:** Original characters gain a browseable read-only path through canonical indexed *whole words*, authored original sentences and native source links; this is documented orthographic occurrence, **not** verified radical/phonetic/stroke decomposition.
- **P66:** Wordbook now presents paired original source contexts for the same exact complete written word. Two different Chinese source sentences are visible before optional authored Pinyin/English reveals, with the original sentence/passage handoffs. A written-form match is not proof of equivalent lexical sense.
- **P67–P68:** Original reading pages include cross-source reading comparisons: literal canonical whole-word occurrence in the current passage and a different original sentence/passage. The bilingual supports are hidden until the **existing original reading-assistance action** marks an unanswered native assessment assisted. The original passage remains source-owned, and only original story questions generate practice events.
- Core limits remain: no new graded/certified corpus, no invented HSK alignment, no authoritative decomposition dataset, no invented mastery, and no additional scheduler, storage or events. App/worker cache paired at `character-study-working-v67-p64-p68-source-context-trails`. Full executable acceptance and native-speaker editorial review are separate gates.


### P68–P71 original evidence-content authoring batch (2026-10-17)
- Six genuinely newly authored, source-local six-sentence narratives (36 full bilingual source lines), eighteen editorially **unreviewed** but independently specified comprehension prompts with exact original evidence indices and distractors, and six writing models. Themes: study-room booking, transport schedules, a misleading survey headline, online returns, rain-driven community changes, and verified accessible entrances. All are **DEMO_ONLY** until qualified Mandarin editorial review; no external licensed or official HSK passage is asserted.
- Sources append to existing `BEGINNER_READING_ROWS`/STORIES after all historical rows, preserving every preexisting source ID and reader event. Original `beginnerQuestion`, `storyExercise`, `addReadingEvent`, `sentenceEvents`, Wordbook, canonical grammar IDs, storage and recovery retain authority. No duplicated content/assessment engine.
- Native Readings now displays a six-source evidence course with record-backed latest-attempt status, direct original reading and question actions. Each scene supplies 3 original questions, full Chinese/Pinyin/English reference lines, one cloze, source-sentence ordering, a writing transfer and preexisting indexed word/grammar links.
- **P71 scope:** authored source vocabulary/grammar handoffs do not constitute audited official HSK 4 vocabulary, levels, corpus licensing or a complete HSK 4 program. This remains an external curriculum/editorial dependency.
- Unreviewed original copy remains conspicuously labeled; real native-speaker checks, physical assistive technology, copyrighted-rights acceptance and owner visual sign-off remain NOT_TESTED. App/worker share v68 compiled offline revision; no network transfer or new private learner stores.


### P68–P74 source audit and native evidence review (2026-10-17)
- Every original reading in STORIES is structurally inspected through auditReadingInventory: canonical identities, bilingual lines, valid source question answers and evidence indices, and original answer-mode contracts. Structural checks DO NOT verify language naturalness, Pinyin tone accuracy, translations, copyright or HSK classifications.
- A reviewer may copy a deterministic PUBLIC review packet for any original reading. It includes original Hanzi/Pinyin/English lines, all source questions and exact evidence indices, explicit structural issues, the source module, and an open sign-off checklist. No learner private content, learning events, invented reviewer signature or approval state.
- The six P68 readings previously referenced generic g04/g05 grammar without demonstrated source alignment. Their references now cite g05 (不) or g06 (没/没有) with literal Chinese markers and exact canonical line indices. Existing grammar lessons, their graders and original source IDs are reused.
- Reading offers passage-specific sourced Mandarin sentence examples and original grammar/Wordbook/sentence lesson handoffs. Bilingual assistance remains concealed until the existing native reading assistance action marks an unanswered attempt assisted. Public review-packet copying is a read-only action.
- Original reviews remain UNREVIEWED despite passing structural tests. Qualified Mandarin and rights reviewers must sign off external to the learning app. There is no official HSK 4 mapping or source certification here. Application and service-worker use v69 offline revision.


### P71–P74 original upper-intermediate source curriculum (17 October 2026)
- Appended FIVE new ten-sentence bilingual Mandarin dossiers after every historical canonical story; 50 genuinely new original lines; 15 cited distinct comprehension questions (detail, reason, sequence), five Chinese conclusion-writing models, five cloze and ordering sources, and five sentence-specific device-TTS listening previews. No original source ID changed.
- Topics: uncertain attribution of archived maps, forecast versus ferry-operator notices, disputed quotes without transcripts, library pilot-service access and sample limits, verbal job discussions versus signed internship terms. Real authored condition/consequence evidence anchors reuse original g135 除非, g136 无论, g137 既然 lessons.
- The new P71 source shelf offers each dossier's native inference, sequence and writing exercises and authored original reading. All actual reading and writing attempts remain exclusively in existing storyExercise/beginnerQuestion and original readers' event writers. Native source review packets, exact grammar and Wordbook/Sentence Library links and source-assist guard are retained.
- Five device speech cues use existing browser speech synthesis. They are NOT human voice recordings, independently graded audio comprehension, or proof that device speech synthesis is available on a particular handset. No microphone, server or production data changes.
- Explicitly new authorial DEMO_ONLY UNREVIEWED teaching manuscripts and an **internal** study band, not official HSK 4 vocabulary coverage, an HSK-certified graded corpus or authenticated Chinese editorial approval. Qualified linguistic, Pinyin, rights, mobile assistive-device and human reading-content review remain OPEN.
