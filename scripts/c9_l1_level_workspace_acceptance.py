#!/usr/bin/env python3
"""L1 original Level Workspace: true Chromium native continuity and scoped Review."""
from playwright.sync_api import sync_playwright,expect

ROOT='http://127.0.0.1:4173/'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in ((1440,960),(390,844),(320,780)):
  context=browser.new_context(viewport={'width':width,'height':height})
  page=context.new_page()
  page.goto(ROOT+'#/learn',wait_until='domcontentloaded')
  expect(page.locator('[data-action="c9-hsk-select"]')).to_have_count(7,timeout=20000)
  page.locator('[data-action="c9-hsk-select"][data-level="5"]').click()
  expect(page.locator('#c9-level-selected-title')).to_have_text('HSK 5 practice')
  expect(page.locator('.c9-level-tab')).to_have_count(3)
  expect(page.locator('.c9-level-overview')).to_contain_text('0 / 44')
  expect(page.locator('.c9-level-chapter')).not_to_have_count(0)
  assert page.locator('.c9-level-continuation [data-action="c9-lesson-open"]').count()==1
  assert not page.locator('.c9-guided-course').count(),'No compulsory foundation route'

  # Original unit browses only its HSK target, never earlier lesson groups.
  page.locator('.c9-level-chapter [data-action="c9-level-unit"]').first.click()
  expect(page.locator('#c9-lesson-browser .c9-lesson-row').first).to_be_visible()
  assert page.locator('#c9-lesson-browser .c9-lesson-row').count()>0

  page.locator('[data-action="c9-level-pane"][data-pane="practice"]').click()
  expect(page.locator('.c9-level-practice-stats')).to_be_visible()
  expect(page.locator('.c9-level-skills [data-action="grammar-select"]').first).to_be_visible()
  page.locator('[data-action="c9-level-pane"][data-pane="review"]').click()
  expect(page.locator('#c9-level-review-title')).to_be_visible()
  assert page.locator('[data-action="c9-level-review-start"]').count()==0,'Unintroduced lessons cannot have due review cards'
  page.locator('[data-action="c9-level-pane"][data-pane="learn"]').click()

  # Start an advanced lesson immediately and INTRODUCE it using the native action.
  page.locator('.c9-level-lesson[data-action="c9-lesson-open"]').first.click()
  expect(page.locator('#c9-lesson-title')).to_be_visible()
  page.locator('[data-action="c9-lesson-jump"][data-section="finish"]').first.click()
  intro=page.locator('[data-action="mark-studied"]').first
  expect(intro).to_be_visible(timeout=12000)
  intro.click()
  expect(page.locator('.c9-lesson-finish-confirmation')).to_be_visible(timeout=12000)
  page.locator('[data-action="c9-learn-back"]').first.click()
  expect(page.locator('#c9-level-selected-title')).to_have_text('HSK 5 practice')
  assert '1 / 44' in page.locator('.c9-level-overview').inner_text()

  # Selecting a level-specific Review queues only its original due cards.
  page.locator('[data-action="c9-level-pane"][data-pane="review"]').click()
  expect(page.locator('[data-action="c9-level-review-start"]')).to_be_visible(timeout=12000)
  page.locator('[data-action="c9-level-review-start"]').click()
  page.wait_for_function('() => location.hash.startsWith("#/review")',timeout=12000)
  expect(page.locator('#review-entry, [data-action="review-pick"]').first).to_be_visible(timeout=12000)

  # Return and open an upper target with genuine original readings and missions.
  page.goto(ROOT+'#/learn',wait_until='domcontentloaded')
  page.locator('[data-action="c9-hsk-select"][data-level="6"]').click()
  page.locator('[data-action="c9-level-pane"][data-pane="practice"]').click()
  assert page.locator('.c9-level-selected [data-action="c9-media-open-dialogue"]').count()>0
  page.locator('[data-action="c9-hsk-select"][data-level="7-9"]').click()
  expect(page.locator('#c9-level-selected-title')).to_have_text('HSK 7–9 practice')
  page.locator('[data-action="c9-level-pane"][data-pane="review"]').click()
  assert page.locator('[data-action="c9-level-review-start"]').count()==0
  assert page.evaluate('() => document.documentElement.scrollWidth <= innerWidth+4'),width
  context.close()
 browser.close()
print('PASS: L1 Level Workspace Learn/Practice/Review, source units, canonical HSK5 due review, level6/7-9 at 1440/390/320 Chromium')
