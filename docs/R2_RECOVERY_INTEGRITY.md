# Recovery integrity — R2 source qualification

The original learner record remains exclusively in the existing IndexedDB
`character-study-local-v2` database. The export action uses a read-only
transaction to capture the **current committed record**, even if another tab
updated it after the exporting tab rendered. No backup is offered if storage
cannot be read. The legacy backup JSON format and version are unchanged.

Import preview reads IndexedDB at preview time, then keeps the existing
`expectedRevision` compare-and-swap at replacement time. If any tab modifies
the record after preview, replacement aborts with the actual revision conflict
message and preserves existing progress. The learner must preview again;
no automatic merge or overwrite is attempted.

This covers saved native lessons, reviews, history, wordbook and checkpoints,
not unsent P43/tab-only private writing. That writing retains its original
separate explicit export. Neither a downloaded backup nor a successful browser
acceptance constitutes a verified device backup; the learner must retain the
file independently.

**Manual release gates remain:** qualified Mandarin/Pinyin/translation review,
rights and educational content approval, actual physical Android/iOS keyboard,
TTS and screen-reader checks, owner visual sign-off and release authorization.
No official HSK classification or approval is claimed.
