#!/usr/bin/env python3
"""F2: genuine Chromium source-to-native learning transfer, without new grades.
Tests three independently authored source stages on new browser profiles.
"""
from playwright.sync_api import sync_playwright, expect

ORIGIN="http://127.0.0.1:4173"
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True)
    for width,height in ((1440,960),(390,844),(320,780)):
        context=browser.new_context(viewport={"width":width,"height":height})
        page=context.new_page()

        def cases():
            page.goto(ORIGIN+"/#/dialogues",wait_until="domcontentloaded")
            lab=page.locator(".c9-p76-case-lab")
            expect(lab).to_be_visible(timeout=20000)
            return lab.locator(".c9-p76-case-grid article").first

        card=cases()
        expect(page.locator(".c9-p76-case-grid article")).to_have_count(5)
        assert card.locator("details [lang='zh-Hans']").count()==0
        assert card.locator("details [data-action='grammar-select']").count()==0
        assert "P77 follow-up evidence withheld" in card.locator("details").inner_text()
        # Only a real original reading answer may unlock this source's review.
        card.locator('[data-action="c9-media-open-story"]').click()
        expect(page.locator("#c9-native-reading")).to_be_visible()
        page.locator('.p28-reading-modes [data-mode="beginner-reason"]').click()
        choices=page.locator('.story-practice [data-action="story-answer"]')
        expect(choices.first).to_be_visible()
        choices.first.click()
        expect(page.locator(".story-practice .reader-feedback")).to_be_visible()
        card=cases()
        assert card.locator("details [lang='zh-Hans']").count()==1
        grammar=card.locator('details [data-action="grammar-select"]')
        assert grammar.count()>=2
        assert card.locator('details [data-action="lookup-word"]').count()<=1
        assert "P75 original evidence withheld" in card.locator("details").inner_text()
        assert "P77 follow-up evidence withheld" in card.locator("details").inner_text()
        grammar_id=grammar.first.get_attribute("data-id")
        grammar.first.click()
        expect(page.locator(".p25-lesson")).to_be_visible()
        assert page.evaluate("() => location.hash")==f"#/grammar/{grammar_id}"

        # An original P75 answer reveals only the earlier negotiation.
        card=cases()
        card.locator('[data-action="c9-media-open-dialogue"]').first.click()
        expect(page.locator("#c9-native-dialogue")).to_be_visible()
        page.locator('.dialogue-quiz [data-action="dialogue-answer"]').first.click()
        expect(page.locator(".c9-p75-dialogue-evidence")).to_be_visible()
        card=cases()
        assert card.locator("details [lang='zh-Hans']").count()==2
        assert "P77 follow-up evidence withheld" in card.locator("details").inner_text()

        # The P77 follow-up has its own canonical answer, not inherited credit.
        card.locator('[data-action="c9-media-open-dialogue"]').nth(1).click()
        expect(page.locator("#c9-native-dialogue")).to_be_visible()
        page.locator('.dialogue-quiz [data-action="dialogue-answer"]').first.click()
        expect(page.locator(".c9-p75-dialogue-evidence")).to_be_visible()
        card=cases()
        assert card.locator("details [lang='zh-Hans']").count()==3
        assert "P77 follow-up evidence withheld" not in card.locator("details").inner_text()
        assert "Negotiation question:" in card.locator(".c9-p76-status").inner_text()
        assert "New-evidence question:" in card.locator(".c9-p76-status").inner_text()
        assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+4"),width
        context.close()
    browser.close()
print("PASS: F2 three native source stages, grammar and lexical transfer, desktop/390/320 Chromium")
