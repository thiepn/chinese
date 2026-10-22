#!/usr/bin/env python3
"""Chromium: source-owning grammar, reading and listening inside a selected course level."""
from playwright.sync_api import sync_playwright,expect
ROOT="http://127.0.0.1:4173/"
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in ((1440,900),(390,844),(320,780)):
  ctx=browser.new_context(viewport={"width":width,"height":height})
  page=ctx.new_page()
  for level,action,route in [('2','grammar-select','#/grammar/'),('3','c9-media-open-story','#/stories/'),
                             ('4','c9-media-open-dialogue','#/dialogues/'),('5','grammar-select','#/grammar/')]:
   page.goto(ROOT+"#/learn/level/"+level,wait_until="domcontentloaded")
   expect(page.locator('.c9-course-header h1')).to_have_text("HSK "+level+" course",timeout=20000)
   item=page.locator('.c9-course-level [data-action="'+action+'"]').first
   expect(item).to_be_visible()
   source_id=item.get_attribute('data-id')
   assert source_id
   item.click()
   page.wait_for_function('(prefix)=>location.hash.startsWith(prefix)',arg=route,timeout=12000)
   assert source_id in page.url,(level,source_id,page.url)
   assert page.evaluate('()=>document.documentElement.scrollWidth <= innerWidth+4'),width
  page.goto(ROOT+'#/learn/level/6',wait_until='domcontentloaded')
  item=page.locator('.c9-course-level [data-action="c9-media-open-dialogue"]').first
  expect(item).to_be_visible()
  item.click()
  page.wait_for_function('()=>location.hash.startsWith("#/dialogues/")',timeout=12000)
  ctx.close()
 browser.close()
print("PASS: source-owned per-level grammar/reading/listening at desktop and mobile; no alternate assessment")
