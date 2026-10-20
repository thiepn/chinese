#!/usr/bin/env python3
"""F1 original Mandarin educational-source UI regression, local HTTP Chromium.
Assertions exercise actual source screens at desktop and mobile widths without
submitting answers, mutating records, or claiming editorial/audio certification.
"""
from playwright.sync_api import sync_playwright, expect

ORIGIN = "http://127.0.0.1:4173"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width, height in ((1440, 900), (390, 844), (320, 780)):
        context = browser.new_context(viewport={"width": width, "height": height})
        page = context.new_page()

        def open_lesson(lesson_id):
            page.goto(f"{ORIGIN}/#/grammar/{lesson_id}", wait_until="domcontentloaded")
            expect(page.locator(".p25-lesson")).to_be_visible(timeout=20000)
            expect(page.locator(".p25-practice")).to_be_visible()

        def select_mode(mode):
            page.locator(f'.p25-practice [data-action="grammar-mode"][data-mode="{mode}"]').click()
            expect(page.locator(".p25-practice")).to_be_visible()

        # P47: comprehension choices must come from the nearby original
        # advanced grammar corpus, not distant beginner translations.
        open_lesson("g141")
        select_mode("meaning")
        opts = page.locator('.p25-practice [data-action="grammar-answer"][data-option]')
        expect(opts).to_have_count(4)
        answers = opts.evaluate_all("(nodes) => nodes.map(n => n.getAttribute('data-option'))")
        assert len(set(answers)) == 4
        assert any("Although the price is lower" in a for a in answers)
        assert any("not only forgot to check" in a for a in answers)

        for grammar_id, prompt, chinese in [
            ("g78", "Say that I cannot hear the broadcast clearly.", "我听不清楚广播。"),
            ("g82", "Exclaim that this meal is so delicious.", "这顿饭太好吃了！"),
            ("g92", "Ask your friend to choose between tea and water.", "你想喝茶还是水？"),
        ]:
            open_lesson(grammar_id)
            select_mode("transformation")
            task = page.locator(".p25-practice .p25-task")
            expect(task).to_contain_text(prompt)
            # A reference is not pre-exposed as a graded answer.
            assert chinese not in task.inner_text(), grammar_id

        open_lesson("g90")
        page.locator('[data-action="grammar-translation"]').click()
        expect(page.locator(".p25-examples")).to_contain_text(
            "You must knock before entering the classroom.")
        assert "in this example" not in page.locator(".p25-examples").inner_text()

        assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+1"), width
        context.close()
    browser.close()
print("PASS: F1 original Mandarin meaning options and translation source in desktop/390/320 Chromium")
