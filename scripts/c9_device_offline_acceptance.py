#!/usr/bin/env python3
"""Isolated physical-device rehearsal proxy: real Chromium, real local HTTP,
IndexedDB readback, cache corruption/repair, and offline reload. No user data."""
import json
import time
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:4173/'
result = {'environment':'local Chromium only','checks':[]}

def check(name, test):
    assert test, name
    result['checks'].append(name)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(service_workers='allow')
    page = context.new_page()
    page.goto(BASE + '#/settings', wait_until='domcontentloaded')
    page.locator('#c9-device-readiness').wait_for(timeout=20000)
    deadline=time.monotonic()+30
    while not page.evaluate("() => Boolean(navigator.serviceWorker?.controller)"):
        if time.monotonic()>deadline: raise AssertionError('service worker not controlling local page')
        time.sleep(0.2)
    page.locator('[data-action="c9-device-check"]').click()
    expect(page.locator('#c9-device-storage-result')).to_contain_text(
        'Read-only IndexedDB check matched',timeout=15000)
    check('read-only IndexedDB record readback', True)

    # A saved native setting is used as a disposable original learner-state write.
    revision_before=page.locator('#c9-settings-data .muted').first.inner_text()
    original = page.locator('input[data-setting="dark"]').is_checked()
    if original:
        page.locator('input[data-setting="dark"]').uncheck()
    else:
        page.locator('input[data-setting="dark"]').check()
    expect(page.locator('#c9-settings-data .muted').first).not_to_have_text(
        revision_before,timeout=15000)
    expect(page.locator('#c9-device-storage-result')).to_contain_text(
        'Not checked on this device',timeout=15000)
    check('native data change invalidates previous device readback success',True)
    page.locator('[data-action="c9-device-check"]').click()
    expect(page.locator('#c9-device-storage-result')).to_contain_text(
        'complete displayed learner record matched',timeout=15000)
    check('native content matches on explicit reread',True)
    page.reload(wait_until='domcontentloaded')
    page.locator('#c9-device-readiness').wait_for()
    check('native learner state survives online reload',
          page.locator('input[data-setting="dark"]').is_checked() != original)

    # Present URL, unusable cached 404: must not report a complete shell.
    page.evaluate("""async () => {
      const name=(await caches.keys()).find(x=>x==='character-study-working-v91-p47-counterexpectation');
      if(!name)throw Error('current compiled cache absent');
      const cache=await caches.open(name);
      await cache.put(new URL('./startup.mjs',location.href),
        new Response('unusable',{status:404,headers:{'Content-Type':'text/javascript'}}));
    }""")
    page.locator('[data-action="c9-device-check"]').click()
    expect(page.locator('#c9-device-cache-count')).to_contain_text('7 / 8',timeout=15000)
    check('URL-present unusable response rejected',True)
    page.locator('#c9-device-readiness [data-action="c9-offline-repair"]').click()
    expect(page.locator('#c9-device-cache-count')).to_contain_text('8 / 8',timeout=30000)
    check('repaired compiled offline assets',True)

    context.set_offline(True)
    page.reload(wait_until='domcontentloaded',timeout=30000)
    page.locator('#c9-device-readiness').wait_for(timeout=20000)
    check('real service-worker offline app reload',True)
    check('saved native preference survives offline reload',
          page.locator('input[data-setting="dark"]').is_checked() != original)
    page.locator('[data-action="c9-device-check"]').click()
    expect(page.locator('#c9-device-storage-result')).to_contain_text(
        'Read-only IndexedDB check matched',timeout=15000)
    check('offline IndexedDB readback after reload',True)
    context.set_offline(False)
    context.close()
    browser.close()

print(json.dumps({'result':'PASS','count':len(result['checks']),**result}))
