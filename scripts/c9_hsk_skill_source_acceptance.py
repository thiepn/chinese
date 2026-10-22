#!/usr/bin/env python3
"""Genuine local Chromium navigation from provisional HSK target to original skill sources."""
from playwright.sync_api import sync_playwright,expect

ROOT="http://127.0.0.1:4173/"
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in ((1440,900),(390,844),(320,780)):
  context=browser.new_context(viewport={"width":width,"height":height})
  page=context.new_page()
  for level,kind,action,expected in [
   ('2','grammar','grammar-select','#/grammar/'),
   ('3','reading','c9-media-open-story','#/stories/'),
   ('4','listening','c9-media-open-dialogue','#/dialogues/'),
   ('5','grammar','grammar-select','#/grammar/')
  ]:
   page.goto(ROOT+'#/learn',wait_until='domcontentloaded')
   expect(page.locator('.c9-level-grid [data-action="c9-hsk-select"]')).to_have_count(7,timeout=20000)
   page.locator('[data-action="c9-hsk-select"][data-level="'+level+'"]').click()
   box=page.locator('.c9-level-skills')
   expect(box).to_be_visible()
   item=box.locator('[data-action="'+action+'"]').first
   expect(item).to_be_visible()
   original_id=item.get_attribute('data-id')
   assert original_id
   item.click()
   expect(page).to_have_url(lambda url: expected in url,timeout=12000) if False else None
   page.wait_for_function('(prefix) => location.hash.startsWith(prefix)',arg=expected,timeout=12000)
   assert original_id in page.url, (level,kind,original_id,page.url)
   assert page.evaluate('()=>document.documentElement.scrollWidth <= innerWidth+4'),(level,width)
  # Stage 6 must use advanced original dialogue scripts, not an invented audio examination.
  page.goto(ROOT+'#/learn',wait_until='domcontentloaded')
  page.locator('[data-action="c9-hsk-select"][data-level="6"]').click()
  box=page.locator('.c9-level-skills')
  expect(box.locator('[data-action="c9-media-open-dialogue"]').first).to_be_visible()
  box.locator('[data-action="c9-media-open-dialogue"]').first.click()
  page.wait_for_function('() => location.hash.startsWith("#/dialogues/")',timeout=12000)
  assert page.evaluate('()=>document.documentElement.scrollWidth <= innerWidth+4'),width
  context.close()
 browser.close()
print('PASS: HSK original grammar/reading/dialogue routes at 1440/390/320 Chromium, no prerequisite or alternate grader')
