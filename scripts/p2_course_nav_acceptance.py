"""P2 source-owned desktop/mobile Chromium navigation acceptance.
Runs on the existing disposable local origin, with no learner production writes.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:4173/"
OUT=Path("/tmp/chinese-acceptance")
OUT.mkdir(parents=True,exist_ok=True)
def check(condition, message):
    if not condition:
        raise AssertionError(message)
def route(page, hash_route):
    page.goto(BASE+hash_route, wait_until="domcontentloaded")
    page.locator("#app-content .c9-discovery, #app-content .c9-home-course-launch").first.wait_for(timeout=20000)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    for width,height in [(320,700),(390,844)]:
        context=browser.new_context(viewport={"width":width,"height":height},is_mobile=True,has_touch=True)
        page=context.new_page()
        route(page,"#/learn")
        links=page.locator(".c9-mobile-nav [data-c9-primary]")
        check(links.count()==4, f"{width}px: expected four mobile destinations")
        check([links.nth(i).get_attribute("data-route") for i in range(4)]==["today","learn","review","progress"],f"{width}px: wrong navigation order")
        bounds=page.locator(".c9-mobile-nav").bounding_box()
        check(bounds and bounds["width"]<=width+1, f"{width}px: mobile nav overflows viewport")
        page.locator('[data-action="c9-hsk-select"][data-level="5"]').first.click()
        page.wait_for_url("**/#/learn/level/5",timeout=15000)
        page.locator(".c9-mobile-nav a[data-route='today']").click()
        page.locator(".c9-home-course-launch").wait_for()
        check("HSK 5" in page.locator(".c9-home-course-launch").inner_text(),f"{width}px: selected level lost on Home")
        check(page.locator(".c9-home-course-launch .c9-button--primary").count()==1,f"{width}px: missing single Start/Continue")
        check(page.locator(".c9-home-course-launch a[href='#/learn/level/5']").count()==1,f"{width}px: missing selected course return")
        route(page,"#/learn/level/6")
        page.locator(".c9-mobile-nav a[data-route='today']").click()
        page.locator(".c9-home-course-launch [data-action='c9-media-open-story']").wait_for(timeout=15000)
        check(page.locator(".c9-home-course-launch [data-action='c9-media-open-story']").count()==1,f"{width}px: HSK 6 original reading unavailable")
        route(page,"#/learn/level/7-9")
        page.locator(".c9-mobile-nav a[data-route='today']").click()
        page.locator(".c9-home-course-launch [data-action='pathway-select']").wait_for(timeout=15000)
        check(page.locator(".c9-home-course-launch [data-action='pathway-select']").count()==1,f"{width}px: advanced original mission unavailable")
        page.screenshot(path=str(OUT/f"p2-course-mobile-{width}.png"),full_page=False)
        context.close()
    context=browser.new_context(viewport={"width":1366,"height":850})
    page=context.new_page()
    route(page,"#/learn")
    primary=page.locator(".c9-sidebar .c9-primary-four [data-route]")
    check(primary.count()==4,"Desktop must have four primary destinations")
    check([primary.nth(i).get_attribute("data-route") for i in range(4)]==["today","learn","review","progress"],"Desktop navigation order")
    page.locator(".c9-sidebar .c9-primary-four [data-route='progress']").click()
    page.wait_for_url("**/#/progress",timeout=15000)
    check(page.locator("#app-content").inner_text().strip()!="","Me page must render actual progress")
    page.screenshot(path=str(OUT/"p2-course-desktop-1366.png"),full_page=False)
    context.close()
    browser.close()
print("P2_CHROMIUM_NAVIGATION_PASS: 320px, 390px, 1366px; HSK5/6/7-9 entry, four tabs, native progress")
