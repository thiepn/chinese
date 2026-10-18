#!/usr/bin/env python3
"""Read-only original P75/P77 editorial-source review acceptance, local Chromium.
The clipboard contains PUBLIC authored source and answer keys only.
No learner answer, private writing or assessment is submitted.
"""
import json
from playwright.sync_api import sync_playwright, expect
origin='http://127.0.0.1:4173'
checks=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    ctx=browser.new_context(viewport={'width':390,'height':844},
        service_workers='allow')
    ctx.grant_permissions(['clipboard-read','clipboard-write'],origin=origin)
    page=ctx.new_page()
    page.goto(origin+'/#/dialogues',wait_until='domcontentloaded')
    expect(page.locator('.c9-p75-dialogue-course')).to_be_visible(timeout=20000)
    expect(page.locator('.c9-p77-consequence-course')).to_be_visible()
    assert page.locator('.c9-p75-dialogue-course [data-action="c9-dialogue-review-copy"]').count()==5
    assert page.locator('.c9-p77-consequence-course [data-action="c9-dialogue-review-copy"]').count()==5
    checks.append('ten independently reviewable conversation manuscripts')
    assert '## Canonical questions, answer keys' not in page.locator('body').inner_text()
    checks.append('answer-key review packets not inserted in DOM by default')
    # Manual reviewer intent must precede clipboard access.
    for phase in ['p75','p77']:
        card=page.locator('.c9-'+phase+('-dialogue-course' if phase=='p75' else '-consequence-course')+' article').first
        card.locator('details summary').first.click()
        button=card.locator('[data-action="c9-dialogue-review-copy"]')
        expect(button).to_be_visible()
        button.click()
        expect(page.locator('#alert-banner')).to_contain_text(
            'editorial approval remains outstanding',timeout=15000)
        packet=page.evaluate('() => navigator.clipboard.readText()')
        assert 'Canonical dialogue ID: dialogue-' in packet
        assert 'Source manuscript ID: '+phase+'-dialogue-01' in packet
        assert 'Status: DEMO_ONLY' in packet and 'UNREVIEWED' in packet
        assert 'Answer: ' in packet and 'Evidence turn: ' in packet
        assert 'Hanzi: ' in packet and 'Pinyin: ' in packet and 'English: ' in packet
        assert 'Reviewer identity, date, evidence' in packet
        assert not any(x in packet for x in ['dialogueEvents','accessToken','privateDraft','learnerEvents'])
        checks.append(phase+' reviewer packet includes canonical source/answer evidence only')
    for width in [320,390]:
        page.set_viewport_size({'width':width,'height':780})
        # The review controls must be keyboard-accessible without horizontal
        # document clipping, even on a narrow phone.
        assert page.evaluate('() => document.documentElement.scrollWidth <= innerWidth+1'),width
        focused=page.locator('.c9-p77-consequence-course [data-action="c9-dialogue-review-copy"]').first
        focused.focus()
        assert focused.evaluate('(el)=>document.activeElement===el')
        checks.append(str(width)+'px reviewer controls reachable without document overflow')
    ctx.close()
    browser.close()
print(json.dumps({'result':'PASS','count':len(checks),'checks':checks}))
