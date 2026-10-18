#!/usr/bin/env python3
"""Disposable two-tab backup export + restore-CAS regression on loopback only.
Checks real local IndexedDB, native setting writes and user-controlled download.
No production data, accounts, uploads, credentials or migrations.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ORIGIN = 'http://127.0.0.1:4173/'
checks=[]

def check(name, condition):
    assert condition, name
    checks.append(name)

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    context=browser.new_context(accept_downloads=True,service_workers='allow')
    first=context.new_page()
    # Simulate a missed BroadcastChannel notification in the exporting tab.
    # Native IndexedDB is shared and every write in the second tab uses the
    # unchanged application transaction path.
    first.add_init_script("""
      class SilentChannel {
        constructor() {}
        postMessage() {}
        close() {}
      }
      Object.defineProperty(window,'BroadcastChannel',
        {value:SilentChannel,configurable:true});
    """)
    first.goto(ORIGIN+'#/settings',wait_until='domcontentloaded')
    first.locator('#c9-settings-data').wait_for()
    stale_revision=first.locator('#c9-settings-data .muted').first.inner_text()
    original=first.locator('input[data-setting="dark"]').is_checked()

    second=context.new_page()
    second.goto(ORIGIN+'#/settings',wait_until='domcontentloaded')
    second.locator('#c9-settings-data').wait_for()
    dark=second.locator('input[data-setting="dark"]')
    dark.set_checked(not original)
    expect(second.locator('#c9-settings-data .muted').first).not_to_have_text(stale_revision,timeout=15000)
    check('native second-tab committed setting update',True)
    check('first tab visibly missed cross-tab broadcast',
          first.locator('#c9-settings-data .muted').first.inner_text()==stale_revision)

    with first.expect_download(timeout=15000) as event:
        first.locator('#c9-settings-data [data-action="export"]').click()
    download=event.value
    exported=json.loads(Path(download.path()).read_text(encoding='utf-8'))
    check('stale-tab export reads latest disk revision',
          exported['learner']['revision']>int(stale_revision.split('revision:')[-1].split()[0]))
    check('export includes second-tab original saved setting',
          exported['learner']['settings']['dark']==(not original))
    check('original backup format is preserved',
          exported['format']=='character-study-demo-backup' and exported['formatVersion']==1)
    expect(first.locator('#alert-banner')).to_contain_text('Saved revision',timeout=10000)

    # Advance stored revision before preview while the importing tab remains stale.
    before_second=second.locator('#c9-settings-data .muted').first.inner_text()
    second.locator('input[data-setting="dark"]').set_checked(original)
    expect(second.locator('#c9-settings-data .muted').first).not_to_have_text(
        before_second,timeout=15000)
    preview_rev=second.locator('#c9-settings-data .muted').first.inner_text()
    first.locator('#import-file').set_input_files({
        'name':'local-test-backup.json',
        'mimeType':'application/json',
        'buffer':json.dumps(exported).encode('utf-8')
    })
    expect(first.locator('.finish-backup-preview')).to_be_visible(timeout=15000)
    current_text=first.locator('#restore-stored-revision').inner_text()
    expected_revision=int(preview_rev.split('revision:')[-1].split()[0])
    check('preview reads latest committed second-tab revision',
          f'Stored revision at preview: {expected_revision}.' in current_text)
    check('preview did not rewrite local data',
          second.locator('input[data-setting="dark"]').is_checked()==original)

    # A further native mutation must reject the previously approved replacement.
    before_conflict=second.locator('#c9-settings-data .muted').first.inner_text()
    second.locator('input[data-setting="dark"]').set_checked(not original)
    expect(second.locator('#c9-settings-data .muted').first).not_to_have_text(
        before_conflict,timeout=15000)
    first.locator('#restore-ack').fill('REPLACE')
    first.locator('[data-action="restore-confirm"]').click()
    expect(first.locator('#alert-banner')).to_contain_text(
        'Local data changed after the backup preview',timeout=15000)
    check('atomic restore compare-and-swap blocks intervening tab write',True)
    second.reload(wait_until='domcontentloaded')
    check('failed replace preserved newest native stored setting',
          second.locator('input[data-setting="dark"]').is_checked()==(not original))
    context.close()
    browser.close()

print(json.dumps({'result':'PASS','checks':checks,'count':len(checks)}))
