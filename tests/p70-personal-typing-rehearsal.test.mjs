import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL(p,import.meta.url),'utf8');
const source=read('../src/media-c9.mjs');
const block=source.slice(source.indexOf('/* P69 original-roadmap personal reading:'));
test('P70 private typed recall is a tab-owned activity, not another grade writer',()=>{
 for(const marker of ['personalRecallIndex=-1','personalRecallDraft=', 'data-personal-recall=',
 'c9-personal-recall-input','c9-personal-recall-reveal','c9-personal-recall-retry',
 'c9-personal-recall-close','onPanelInput','personalReaderMined.length||personalRecallDraft.trim()','panel?.addEventListener(\'input\',onPanelInput)',
 'personalRecallDraft=e.target.value.slice(0,PERSONAL_READER_LIMIT)'])
  assert.ok(block.includes(marker),marker);
 for(const prohibited of ['localStorage','sessionStorage','indexedDB','fetch(','addReadingEvent(','addSentenceEvent(','gradeCard('])
  assert.ok(!block.includes(prohibited),prohibited);
});
test('private sentence recall is tested in real-origin Chromium and remains CSS-responsive',()=>{
 const browser=read('../scripts/c9_browser_acceptance.py');
 const css=read('../src/styles-c9-media.css');
 for(const marker of ['data-personal-recall="0"','P70 private draft lost on pagination',
 'P70 private retry did not clear response','P70 private rehearsal did not close','P70 unmined unsent typing draft discarded'])
  assert.ok(browser.includes(marker),marker);
 for(const marker of ['.c9-personal-recall','.c9-personal-recall textarea','@media(max-width:480px)'])
  assert.ok(css.includes(marker),marker);
});
