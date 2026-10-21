#!/usr/bin/env python3
"""F4 original Chinese contextual accuracy across real desktop/mobile Chromium."""
from playwright.sync_api import sync_playwright, expect

ORIGIN="http://127.0.0.1:4173"

with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True)
    for width,height in ((1440,960),(390,844),(320,780)):
        context=browser.new_context(viewport={"width":width,"height":height})
        page=context.new_page()

        def source(kind,index,title):
            page.goto(ORIGIN+"/#/stories",wait_until="domcontentloaded")
            card=page.locator(".c9-"+kind+"-course-grid article").nth(index) if kind=="p68" else page.locator(".c9-p71-native-grid article").nth(index)
            expect(card).to_contain_text(title,timeout=20000)
            card.locator('[data-action="c9-media-open-story"]').first.click()
            expect(page.locator("#c9-native-reading")).to_be_visible(timeout=20000)
            return page.locator(".story-practice")

        # Source passage shows arrival time consistently with the bus's posted
        # earlier arrival, not an unsupported departure-time claim.
        practice=source("p68",1,"Two bus notices")
        expect(page.locator(".c9-media-native")).to_contain_text("今天的到站时间没有变化")
        assert "今天的发车时间没有变化" not in page.locator(".c9-media-native").inner_text()

        # An indoor move is pedagogically possible for the originally planned
        # group event, without implying indoor park-gardening.
        practice=source("p68",4,"Rain changes the volunteer event")
        expect(page.locator(".c9-media-native")).to_contain_text("在公园举行小组活动")
        expect(page.locator(".c9-media-native")).to_contain_text("改在教室举行")
        assert "整理花园" not in page.locator(".c9-media-native").inner_text()

        # The original native reader's assessed answer and evidence agree.
        practice=source("p68",2,"A survey headline is corrected")
        practice.locator('[data-action="story-mode"][data-mode="beginner-sequence"]').click()
        expect(practice.locator("h3")).to_have_text("What does the revised report explicitly state?")
        assert practice.locator(".p28-evidence").count()==0
        practice.locator('[data-action="story-answer"][data-option="The number of people surveyed."]').click()
        evidence=page.locator(".story-practice .p28-evidence")
        expect(evidence).to_be_visible()
        expect(evidence).to_contain_text("参加调查的人数")
        expect(evidence).to_contain_text("Evidence · sentence 5")
        expect(page.locator(".story-practice .reader-feedback")).to_contain_text("Independent attempt recorded")

        # P71 grammar preserves 无论…都 and compares the two real options:
        # a ferry trip versus postponing the event, not two travel modes.
        practice=source("p71",1,"Weather and the ferry schedule")
        expect(page.locator(".c9-media-native")).to_contain_text("无论最后是乘船还是延期举行")
        practice.locator('[data-action="story-mode"][data-mode="beginner-reason"]').click()
        expect(practice.locator("h3")).to_have_text("What must happen whether they take the ferry or postpone the event?")
        assert practice.locator(".p28-evidence").count()==0
        practice.locator('[data-action="story-answer"][data-option="Inform participants in advance."]').click()
        evidence=page.locator(".story-practice .p28-evidence")
        expect(evidence).to_be_visible()
        expect(evidence).to_contain_text("无论最后是乘船还是延期举行")
        expect(evidence).to_contain_text("Evidence · sentence 6")
        expect(evidence).to_contain_text("Whether they take the ferry or postpone the event")
        assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+4"),width
        context.close()
    browser.close()
print("PASS: F4 P68/P71 original bilingual source, cited answers and independent reading at desktop/390/320 Chromium")
