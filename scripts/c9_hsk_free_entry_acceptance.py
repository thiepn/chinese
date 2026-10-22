#!/usr/bin/env python3
"""Chromium: level-first course choice, canonical lesson return and advanced original sources."""
from playwright.sync_api import sync_playwright,expect
ORIGIN="http://127.0.0.1:4173/"
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in ((1440,960),(390,844),(320,780)):
  ctx=browser.new_context(viewport={"width":width,"height":height})
  page=ctx.new_page()
  page.goto(ORIGIN+"#/learn",wait_until="domcontentloaded")
  expect(page.locator('.c9-level-grid [data-action="c9-hsk-select"]')).to_have_count(7,timeout=20000)
  page.locator('[data-action="c9-hsk-select"][data-level="5"]').click()
  expect(page.locator(".c9-course-header h1")).to_have_text("HSK 5 course")
  assert page.url.endswith("#/learn/level/5"),page.url
  assert page.locator(".c9-level-lesson").count()>0
  assert page.locator('[data-action="c9-level-pane"]').count()==0
  first=page.locator(".c9-level-lesson").first
  source_id=first.get_attribute("data-id")
  assert source_id.startswith("demo-")
  first.click()
  expect(page.locator("#c9-lesson-title")).to_be_visible()
  assert source_id in page.url
  page.locator('[data-action="c9-learn-back"]').first.click()
  expect(page.locator(".c9-course-header h1")).to_have_text("HSK 5 course")
  page.locator('[data-action="c9-hsk-browse"]').first.click()
  assert page.locator("details.c9-discovery-catalog").evaluate("(e)=>e.open")
  expect(page.locator("#c9-lesson-browser .c9-lesson-row").first).to_be_visible()
  page.goto(ORIGIN+"#/learn/level/6",wait_until="domcontentloaded")
  expect(page.locator(".c9-course-header h1")).to_have_text("HSK 6 course")
  expect(page.locator(".c9-level-lesson-list [data-action='c9-media-open-story']")).to_have_count(5)
  page.locator(".c9-level-lesson-list [data-action='c9-media-open-story']").first.click()
  expect(page.locator("#c9-native-reading")).to_be_visible()
  assert "#/stories" in page.url
  page.goto(ORIGIN+"#/learn/level/7-9",wait_until="domcontentloaded")
  expect(page.locator(".c9-course-header h1")).to_have_text("HSK 7–9 course")
  assert page.locator(".c9-course-level [data-action='pathway-select']").count()>0
  page.locator(".c9-course-level [data-action='pathway-select']").first.click()
  assert "#/pathway" in page.url
  assert page.evaluate("()=>document.documentElement.scrollWidth <= innerWidth+4"),width
  ctx.close()
 browser.close()
print("PASS: native level 5 direct entry/return, HSK6 original reading, HSK7–9 mission and responsive Chromium")
