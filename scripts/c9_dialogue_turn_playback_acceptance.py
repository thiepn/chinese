#!/usr/bin/env python3
"""Actual local Chromium click-to-speech routing regression, with an isolated
mock Mandarin voice. No real voice quality, device TTS or linguistic approval.
"""
import json
import time
from playwright.sync_api import sync_playwright, expect

ORIGIN='http://127.0.0.1:4173'
checks=[]
def check(name,ok):
    assert ok,name
    checks.append(name)
def heard(page,expected):
    deadline=time.monotonic()+10
    while time.monotonic()<deadline:
        if page.evaluate("() => (window.__c9Heard||[]).at(-1)")==expected:return
        time.sleep(.08)
    raise AssertionError('Wrong or missing Mandarin source playback')
def state_snapshot(page):
    return page.evaluate("""async () => {
      const {openDatabase,readState}=await import('/study-storage.mjs');
      const db=await openDatabase(); const record=await readState(db);
      db.close();return JSON.stringify(record);
    }""")

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    context=browser.new_context(viewport={'width':390,'height':844},service_workers='allow')
    context.add_init_script("""(() => {
      window.__c9Heard=[];
      class MockMandarinUtterance {
        constructor(text){this.text=text;this.rate=1;}
      }
      Object.defineProperty(window,'SpeechSynthesisUtterance',
        {configurable:true,value:MockMandarinUtterance});
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
        getVoices(){return [{lang:'zh-CN',name:'Isolated Chinese test voice'}];},
        cancel(){},speak(utterance){window.__c9Heard.push(utterance.text);
           utterance.onstart?.();utterance.onend?.();}
      }});
    })()""")
    page=context.new_page()
    page.goto(ORIGIN+'/#/dialogues',wait_until='domcontentloaded')
    expect(page.locator('#dialogue-choice')).to_be_visible(timeout=20000)
    baseline=state_snapshot(page)
    for phase,source in [('P77','p77-dialogues'),('P75','p75-dialogues')]:
        expected=page.evaluate("""async moduleName => {
          const module=await import('/'+moduleName+'.mjs');
          return (moduleName==='p77-dialogues'?module.P77_DIALOGUES:module.P75_DIALOGUES)[0];
        }""",source)
        page.locator('#dialogue-choice').select_option(label=expected['title'])
        expect(page.locator('#c9-native-dialogue .dialogue-turn')).to_have_count(8)
        buttons=page.locator('#c9-native-dialogue .dialogue-turn [data-action="c9-media-listen-turn"]')
        expect(buttons).to_have_count(8)
        for index in (6,1,7):
            button=buttons.nth(index)
            label=button.inner_text()
            check(phase+' turn '+str(index+1)+' has distinct accessible label',
                  'Turn '+str(index+1)+' of 8, speaker '+expected['turns'][index]['speaker'] in label)
            check(phase+' guarded row '+str(index+1)+' holds no source text attribute',
                  button.get_attribute('data-text') is None)
            check(phase+' guarded row '+str(index+1)+' binds canonical source',
                  button.get_attribute('data-dialogue-id') is not None)
            button.click()
            heard(page,expected['turns'][index]['hanzi'])
            check(phase+' clicked turn '+str(index+1)+' plays its own exact Hanzi',
                  page.locator('#c9-native-dialogue .dialogue-turn[aria-current="step"]').get_attribute('data-c9-turn-index')==str(index))
        # Navigator must track the newly selected row, not retain old label.
        nav=page.locator('.c9-media-turn-nav')
        expect(nav.locator('[data-action="c9-media-listen-turn"]')).to_contain_text('Turn 8 of 8')
        nav.locator('[data-action="c9-media-turn"][data-dir="-1"]').click()
        expect(nav.locator('[data-action="c9-media-listen-turn"]')).to_contain_text('Turn 7 of 8')
        nav.locator('[data-action="c9-media-listen-turn"]').click()
        heard(page,expected['turns'][6]['hanzi'])
        check(phase+' navigator playback follows focused source',True)
        # Changing a malicious source identifier must reject without speaking.
        bad=buttons.nth(0)
        bad.evaluate("(element)=>element.dataset.dialogueId='dialogue-invalid'")
        before=page.evaluate("() => window.__c9Heard.length")
        bad.click()
        page.wait_for_timeout(120)
        check(phase+' stale/foreign source action is ignored',
              page.evaluate("() => window.__c9Heard.length")==before)
        check(phase+' blind transcript remains concealed',
              all('Audio turn' in x for x in page.locator('#c9-native-dialogue .dialogue-chinese').all_inner_texts()))
    check('no learner database revisions, grades or private records written during source TTS',state_snapshot(page)==baseline)
    for width in (320,390):
        page.set_viewport_size({'width':width,'height':780})
        check(str(width)+'px buttons fit without horizontal document overflow',
              page.evaluate('() => document.documentElement.scrollWidth<=innerWidth+1'))
    context.close()
    browser.close()
print(json.dumps({'result':'PASS','count':len(checks),'checks':checks}))
