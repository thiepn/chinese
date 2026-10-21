#!/usr/bin/env python3
"""F3 exact P68/P71 authored whole-word Pinyin acceptance (local Chromium)."""
from playwright.sync_api import sync_playwright, expect

ORIGIN="http://127.0.0.1:4173"
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width,height in ((1440,960),(390,844),(320,780)):
        context=browser.new_context(viewport={"width":width,"height":height})
        page=context.new_page()
        for kind,source_selector,hanzi,pinyin in (
            ("P71",".c9-p71-native-grid article","记录","jìlù"),
            ("P68",".c9-p68-course-grid article","确认","quèrèn"),
        ):
            page.goto(ORIGIN+"/#/stories",wait_until="domcontentloaded")
            source=page.locator(source_selector).first
            expect(source).to_be_visible(timeout=20000)
            source.locator('[data-action="c9-media-open-story"]').first.click()
            expect(page.locator("#c9-native-reading")).to_be_visible()
            practice=page.locator(".story-practice")
            practice.locator('[data-action="story-mode"][data-mode="pronunciation"]').click()
            expect(practice).to_contain_text("Type the pinyin for "+hanzi)
            expect(practice.locator("#story-entry")).to_be_visible()
            assert practice.locator(".p28-evidence").count()==0, "Source answer appeared before submission"
            assert pinyin not in practice.locator("h3").inner_text().lower(), "Target Pinyin leaked into prompt"
            practice.locator("#story-entry").fill(pinyin)
            practice.locator('[data-action="story-check"]').click()
            evidence=page.locator(".story-practice .p28-evidence")
            expect(evidence).to_be_visible()
            expect(evidence).to_contain_text("Evidence · sentence")
            expect(page.locator(".story-practice .reader-feedback")).to_contain_text(pinyin)
            assert evidence.locator('[lang="zh-Hans"]').count()==1
            assert hanzi in evidence.inner_text()
            assert "Independent attempt recorded" in practice.inner_text()
            assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+4"),(kind,width)
        context.close()
    browser.close()
print("PASS: F3 P68/P71 authored Pinyin recall, native saved answers and contextual evidence at 1440/390/320px")
