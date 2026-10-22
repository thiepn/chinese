#!/usr/bin/env python3
"""Chromium: nested course, canonical lesson introduction, level-scoped native review."""
from playwright.sync_api import sync_playwright,expect
ROOT='http://127.0.0.1:4173/'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in ((1440,960),(390,844),(320,780)):
  ctx=browser.new_context(viewport={'width':width,'height':height})
  page=ctx.new_page()
  page.goto(ROOT+'#/learn/level/5',wait_until='domcontentloaded')
  expect(page.locator('.c9-course-header h1')).to_have_text('HSK 5 course',timeout=20000)
  assert page.locator('.c9-course-module').count()>=5
  assert page.locator('.c9-course-words [data-action="vocabulary-start"]').count()>0
  assert page.locator('.c9-course-module [data-action="grammar-select"]').count()>0
  assert '0 / 44 introduced' in page.locator('#c9-course-lessons').locator('..').inner_text()
  assert page.locator('[data-action="c9-level-pane"]').count()==0
  assert page.locator('[data-action="c9-level-review-start"]').count()==0
  assert not page.locator('.c9-guided-course').count()
  units=page.locator('details.c9-course-expand').filter(has=page.locator('[data-action="c9-level-unit"]'))
  expect(units).to_have_count(1)
  units.locator('summary').click()
  units.locator('[data-action="c9-level-unit"]').first.click()
  expect(page.locator('#c9-lesson-browser .c9-lesson-row').first).to_be_visible()
  lesson=page.locator('.c9-course-primary [data-action="c9-lesson-open"]')
  if not lesson.count():
   lesson=page.locator('.c9-level-lesson[data-action="c9-lesson-open"]').first
  lesson.click()
  expect(page.locator('#c9-lesson-title')).to_be_visible()
  page.locator('[data-action="c9-lesson-jump"][data-section="finish"]').first.click()
  intro=page.locator('[data-action="mark-studied"]').first
  expect(intro).to_be_visible(timeout=12000)
  intro.click()
  expect(page.locator('.c9-lesson-finish-confirmation')).to_be_visible(timeout=12000)
  page.locator('[data-action="c9-learn-back"]').first.click()
  expect(page.locator('.c9-course-header h1')).to_have_text('HSK 5 course')
  assert '1 / 44 introduced' in page.locator('#c9-course-lessons').locator('..').inner_text()
  review=page.locator('[data-action="c9-level-review-start"]')
  expect(review).to_be_visible(timeout=12000)
  review.click()
  page.wait_for_function('()=>location.hash.startsWith("#/review")',timeout=12000)
  expect(page.locator('#review-entry, [data-action="review-pick"]').first).to_be_visible(timeout=12000)
  page.goto(ROOT+'#/learn/level/6',wait_until='domcontentloaded')
  assert page.locator('[data-action="c9-media-open-dialogue"]').count()>0
  page.goto(ROOT+'#/learn/level/7-9',wait_until='domcontentloaded')
  assert page.locator('[data-action="pathway-select"]').count()>0
  assert page.locator('[data-action="c9-level-review-start"]').count()==0
  assert page.evaluate('()=>document.documentElement.scrollWidth <= innerWidth+4'),width
  ctx.close()
 browser.close()
print('PASS: source-owned level 5 lessons, vocabulary, grammar, canonical review; levels 6 and 7–9')
