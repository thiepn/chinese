#!/usr/bin/env python3
"""True Chromium free-entry HSK targets, source IDs and mobile no-lock navigation."""
from playwright.sync_api import sync_playwright,expect

ORIGIN="http://127.0.0.1:4173/"
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width,height in ((1440,960),(390,844),(320,780)):
        context=browser.new_context(viewport={"width":width,"height":height})
        page=context.new_page()
        page.goto(ORIGIN+"#/learn",wait_until="domcontentloaded")
        expect(page.locator(".c9-level-grid [data-action='c9-hsk-select']")).to_have_count(7,timeout=20000)
        assert page.locator(".c9-level-entry").inner_text().index("Choose your HSK target")>=0
        assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+4"),("initial overflow",width)

        # A newly visiting advanced learner bypasses all earlier introductions.
        page.locator('[data-action="c9-hsk-select"][data-level="5"]').click()
        expect(page.locator("#c9-level-selected-title")).to_have_text("HSK 5 practice")
        assert page.locator('[data-action="c9-hsk-select"][data-level="5"]').get_attribute("aria-pressed")=="true"
        assert page.locator(".c9-level-lesson").count()>0
        assert page.locator(".c9-guided-course").count()==0, "Beginner lesson must not override chosen target"
        first=page.locator(".c9-level-lesson").first
        source_id=first.get_attribute("data-id")
        assert source_id.startswith("demo-")
        first.click()
        expect(page.locator("#c9-lesson-title")).to_be_visible()
        lesson_number=int(source_id.split("-")[-1])
        expect(page.locator(".c9-lesson-header .c9-eyebrow").first).to_contain_text(f"LESSON {lesson_number:03d} / 428")
        expect(page.locator('[data-action="c9-learn-back"]')).to_be_visible()

        # Returning to learning keeps chosen difficulty in this tab.
        page.locator('[data-action="c9-learn-back"]').click()
        expect(page.locator("#c9-level-selected-title")).to_have_text("HSK 5 practice")
        page.locator('[data-action="c9-hsk-browse"]').click()
        assert page.locator("details.c9-discovery-catalog").evaluate("(node) => node.open")
        expect(page.locator("#c9-lesson-browser .c9-lesson-row").first).to_be_visible()

        # HSK 6 is honest advanced original practice, not a fabricated mapped course.
        page.locator('[data-action="c9-hsk-select"][data-level="6"]').click()
        expect(page.locator(".c9-level-selected [data-action='c9-media-open-story']")).to_have_count(5)
        page.locator(".c9-level-selected [data-action='c9-media-open-story']").first.click()
        expect(page.locator("#c9-native-reading")).to_be_visible()
        assert "#/stories" in page.url

        page.goto(ORIGIN+"#/learn",wait_until="domcontentloaded")
        page.locator('[data-action="c9-hsk-select"][data-level="7-9"]').click()
        expect(page.locator("#c9-level-selected-title")).to_have_text("HSK 7–9 practice")
        assert page.locator(".c9-level-selected [data-action='pathway-select']").count()>0
        page.locator(".c9-level-selected [data-action='pathway-select']").first.click()
        assert "#/pathway" in page.url
        assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+4"),("target overflow",width)
        context.close()
    browser.close()
print("PASS: HSK 1–6 and 7–9 free-entry targets, HSK5 direct lesson, HSK6 source, 7–9 mission at desktop/390/320 Chromium")
