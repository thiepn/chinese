#!/usr/bin/env python3
"""Local-only, isolated C9 browser acceptance. Requires Python Playwright and Chromium.

Build the current C9 branch via npm run build, then start npm run serve locally.
No credentials, paid service, CI, production URL or real user data is accessed.
Prints PASS/FAIL/NOT_TESTED JSON. Screenshots optional.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url",default="http://127.0.0.1:4173")
    parser.add_argument("--chromium",default=os.getenv("CHROME_BIN"))
    parser.add_argument("--artifacts",type=Path)
    parser.add_argument("--expected-head",help="Exact 40-character Git commit required for source provenance")
    args=parser.parse_args()
    url=urlparse(args.base_url)
    if url.scheme!="http" or url.hostname not in ("localhost","127.0.0.1","::1"):
        parser.error("Only loopback HTTP is permitted.")
    if args.artifacts: args.artifacts.mkdir(parents=True,exist_ok=True)
    results=[]
    def record(name,status,details):
        results.append({"check":name,"status":status,"detail":str(details)[:450]})
    def finish():
        counts={s:sum(x["status"]==s for x in results) for s in ("PASS","FAIL","NOT_TESTED")}
        automated_passed=counts["PASS"]>=25 and not counts["FAIL"] and not counts["NOT_TESTED"]
        print(json.dumps({"checks":results,"summary":counts,
                          "automated_acceptance_passed":automated_passed,
                          "release_qualified":False,
                          "manual_gates":["Review actual light/dark mobile and desktop screenshots",
                                          "Screen reader and keyboard acceptance with real assistive technology",
                                          "Review listening-first educational source/evidence behavior",
                                          "Explicit human release authorization"]},
                          ensure_ascii=False,indent=2))
        return 0 if automated_passed else 1
    # A historical tracked dist/ may look healthy while being unrelated to the
    # checked-out Concept 9 source. This is a hard precondition for test validity.
    root=Path(__file__).resolve().parents[1]
    src_root=root/"src"
    dist_root=root/"dist"
    try:
        source_files={p.relative_to(src_root) for p in src_root.rglob("*") if p.is_file()}
        dist_files={p.relative_to(dist_root) for p in dist_root.rglob("*") if p.is_file()}
        compiled={Path("startup.mjs"),Path("styles-startup.css")}
        if not source_files or source_files|compiled!=dist_files:
            raise AssertionError("src/dist source inventory plus compiled assets differs")
        mismatched=[str(p) for p in source_files
                    if p!=Path("index.html") and hashlib.sha256((src_root/p).read_bytes()).digest()!=
                       hashlib.sha256((dist_root/p).read_bytes()).digest()]
        if mismatched:
            raise AssertionError("Stale dist files: "+", ".join(mismatched[:6]))
        html=(dist_root/"index.html").read_text()
        if 'src="./startup.mjs"' not in html or 'href="./styles-startup.css"' not in html:
            raise AssertionError("Production startup does not use compiled bundles")
        if len(list(__import__("re").finditer('rel="stylesheet"',html)))!=1:
            raise AssertionError("Production HTML is still blocking on many stylesheets")
        if 'startup.mjs' not in (dist_root/"sw.js").read_text():
            raise AssertionError("Offline cache omitted compiled app")
        record("Exact source versus local build","PASS",
               str(len(source_files))+" untouched originals plus two compiled startup assets")
    except Exception as exc:
        record("Exact source versus local build","FAIL",exc)
        return finish()
    if args.expected_head:
        try:
            if len(args.expected_head)!=40 or any(c not in "0123456789abcdef" for c in args.expected_head.lower()):
                raise AssertionError("Expected head must be a full 40-character SHA")
            head=subprocess.check_output(["git","rev-parse","HEAD"],cwd=root,
                text=True,stderr=subprocess.DEVNULL,timeout=4).strip()
            if head!=args.expected_head:
                raise AssertionError("Wrong Git checkout: "+head+" != "+args.expected_head)
            record("Exact Git commit provenance","PASS",head)
        except Exception as exc:
            record("Exact Git commit provenance","FAIL",exc)
            return finish()
    else:
        record("Exact Git commit provenance","NOT_TESTED",
               "Specify --expected-head with the final C9-16 SHA for credible acceptance")
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        record("browser","NOT_TESTED","Python Playwright is not installed")
        return finish()
    executable=args.chromium or shutil.which("chromium") or shutil.which("google-chrome")
    if not executable:
        record("browser","NOT_TESTED","Chromium not found")
        return finish()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=executable,headless=True,
                                       args=["--no-sandbox"])
            def session(width=1366,height=850,mobile=False):
                ctx=browser.new_context(viewport={"width":width,"height":height},
                    is_mobile=mobile,has_touch=mobile,service_workers="allow")
                page=ctx.new_page()
                page.set_default_timeout(12000)
                errors=[]
                page.on("pageerror",lambda err:errors.append(str(err)))
                return ctx,page,errors
            def open_route(page,route):
                page.goto(args.base_url.rstrip("/")+"/#/"+route,
                          wait_until="domcontentloaded")
                page.locator("#app-content").wait_for(state="visible")
                page.wait_for_function("()=>document.querySelector('#app-content')?.textContent?.trim().length>40")
            def check(name,fn):
                try:
                    record(name,"PASS",fn() or "OK")
                    return True
                except Exception as exc:
                    record(name,"FAIL",type(exc).__name__+": "+str(exc))
                    return False

            # Measure real compiled startup requests, not expected source names.
            # CI local timing is diagnostic, not a device-wide time guarantee.
            for width,height,mobile in ((390,844,True),(1440,960,False)):
                ctx,page,errors=session(width,height,mobile)
                def compiled_first_home():
                    page.goto(args.base_url.rstrip("/")+"/#/today",wait_until="domcontentloaded")
                    page.locator(".c9-home-hero").wait_for(state="visible")
                    info=page.evaluate("""()=>{
                      const paths=performance.getEntriesByType('resource').map(r=>new URL(r.name).pathname);
                      return {ms:Math.round(performance.now()),
                        js:paths.filter(s=>s.endsWith('.mjs')),
                        css:paths.filter(s=>s.endsWith('.css')),
                        links:document.querySelectorAll('link[rel="stylesheet"]').length};
                    }""")
                    if info["js"]!=["/startup.mjs"] or info["css"]!=["/styles-startup.css"] or info["links"]!=1:
                        raise AssertionError("Startup fetched legacy modules or styles: "+str(info))
                    details=page.locator("details.c9-home-extra")
                    inner=details.locator(".c9-home-extra-inner")
                    if inner.inner_text().strip():
                        raise AssertionError("Closed supplementary Home panels were rendered eagerly")
                    details.locator("summary").click()
                    page.wait_for_function("()=>document.querySelector('.c9-home-extra-inner')?.textContent?.trim().length>80")
                    if errors:raise RuntimeError("; ".join(errors[:2]))
                    return str(info["ms"])+"ms first Home at "+str(width)+"px; one script/stylesheet and lazy original teaching"
                check("Compiled minimal Home boot "+str(width),compiled_first_home)
                ctx.close()
            for route in ["today","learn","character/demo-01","review","practice",
                          "wordbook","grammar","sentences","stories","dialogues","writing",
                          "progress","settings","pinyin","find"]:
                ctx,page,errors=session()
                def route_check():
                    open_route(page,route)
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if not page.locator("main").count(): raise AssertionError("Main landmark absent")
                    return str(len(page.locator("#app-content").inner_text()))+" visible characters"
                check("route "+route,route_check)
                ctx.close()
            # UX path: a new learner must reach the authored first lesson in
            # one action, independently open review, and see only essential
            # destinations until explicitly disclosing optional source tools.
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page,errors=session(width,height,mobile)
                def learner_first_navigation():
                    open_route(page,"today")
                    entry=page.locator(".c9-home-hero-actions [data-action='hub-lesson']")
                    if entry.count()!=1 or not entry.is_visible():
                        raise AssertionError("Home lacks one direct lesson-start action")
                    if "Start lesson 001" not in entry.inner_text():
                        raise AssertionError("New learner cannot identify lesson one")
                    entry.click()
                    page.wait_for_function("()=>location.hash.startsWith('#/learn/demo-')")
                    page.locator("#c9-lesson-overview").wait_for(state="visible")
                    if not page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Start lesson did not open the actual native teaching")
                    page.locator('[data-action="c9-learn-back"]').first.click()
                    guided=page.locator(".c9-guided-course")
                    guided.wait_for(state="visible")
                    if not guided.is_visible() or guided.locator(".c9-guided-list li").count()<2:
                        raise AssertionError("Numbered lesson sequence absent above the catalog")
                    if "001" not in guided.locator(".c9-guided-step").first.inner_text():
                        raise AssertionError("Lesson one not discoverable at the course start")
                    if not page.locator("details.c9-discovery-catalog").evaluate("(e)=>e.open"):
                        raise AssertionError("Back to all lessons stranded the learner behind a closed catalog")
                    if not page.locator(".c9-discovery-catalog-body").is_visible():
                        raise AssertionError("Returning from the native lesson did not show the lesson browser")
                    if page.locator("details.c9-learn-extended").evaluate("(e)=>e.open"):
                        raise AssertionError("Supplementary source atlas expanded by default")
                    if page.locator(".c9-learn-extended-inner").is_visible():
                        raise AssertionError("Closed advanced source atlas still painted")
                    if mobile:
                        if args.artifacts:
                            page.screenshot(path=str(args.artifacts/"clear-first-lesson-mobile.png"),full_page=False)
                        page.locator("#c9-more-toggle").click()
                        menu=page.locator("#c9-mobile-drawer")
                        if not menu.evaluate("(e)=>e.open"):
                            raise AssertionError("Mobile optional destinations did not open")
                        if menu.locator(".c9-drawer-primary .c9-drawer-quicklink").count()!=5:
                            raise AssertionError("Mobile More again exposes too many first-level routes")
                        advanced=menu.locator("details.c9-drawer-advanced")
                        if advanced.evaluate("(e)=>e.open"):
                            raise AssertionError("Specialist tools expanded by default")
                        if advanced.locator(".c9-drawer-groups").is_visible():
                            raise AssertionError("Collapsed specialist menu is still visible")
                        advanced.locator("summary").click()
                        if not advanced.evaluate("(e)=>e.open"):
                            raise AssertionError("Original specialist tools cannot be disclosed")
                        if not advanced.locator('[data-route="wordbook"]').is_visible():
                            raise AssertionError("Original Wordbook route lost after simplification")
                        page.locator("#c9-drawer-close").click()
                    open_route(page,"review")
                    if page.locator(".c9-review-setup .c9-assessment-actions a[href='#/practice']").count()!=1:
                        raise AssertionError("Learner with no scheduled review has no free-practice route")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Home → exact first lesson; course list; five optional mobile destinations; scheduled/free review at "+str(width)+"px"
                check("Direct Chinese learner journey "+str(width),learner_first_navigation)
                ctx.close()
            # A unit selection must survive the original same-route render;
            # the lesson browser must remain visible and the filter selected.
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page,errors=session(width,height,mobile)
                def unit_catalog_continuity():
                    open_route(page,"learn")
                    disclosure=page.locator("details.c9-discovery-catalog")
                    disclosure.locator(":scope > summary").click()
                    if not disclosure.evaluate("(e)=>e.open"):
                        raise AssertionError("Course catalog disclosure did not open")
                    page.locator('.c9-unit-card [data-action="c9-unit-open"]').nth(1).click()
                    if not disclosure.evaluate("(e)=>e.open"):
                        raise AssertionError("Selecting a unit collapsed the entire lesson browser")
                    if page.locator("#c9-learn-unit").input_value()!="2":
                        raise AssertionError("Unit filter did not select exact original chapter")
                    if not page.locator('#c9-learn-unit').evaluate('(e)=>document.activeElement===e'):
                        raise AssertionError('Selecting a chapter did not move focus to chosen unit')
                    if not page.locator("#c9-lesson-browser .c9-lesson-row").first.is_visible():
                        raise AssertionError("The chosen unit contains no accessible lesson rows")
                    page.locator("#c9-lesson-browser [data-action='c9-lesson-open']").first.click()
                    page.locator("#c9-lesson-overview").wait_for(state="visible")
                    if not page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Selected unit lesson did not reach authored teaching")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Original unit 02 → direct authored teaching, without collapsed catalog at "+str(width)+"px"
                check("Chinese unit-browser continuity "+str(width),unit_catalog_continuity)
                ctx.close()
            # Guided teaching mode: real six-section sequence, preserved native
            # lesson sources, optional full-section view and independent Review.
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page,errors=session(width,height,mobile)
                def guided_lesson_steps():
                    open_route(page,"learn")
                    page.locator(".c9-guided-actions [data-action='c9-lesson-open']").first.click()
                    if not page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("First character step not visible")
                    if page.locator(".c9-context-bar").count():
                        raise AssertionError("Global study shortcuts clutter individual guided lessons")
                    if page.locator("#c9-lesson-grammar").is_visible():
                        raise AssertionError("New learner still sees every lesson section at once")
                    flow=page.locator("#c9-lesson-flow-label")
                    if "Step 1 of 6" not in flow.inner_text():
                        raise AssertionError("Teaching progress step one missing")
                    page.locator(".c9-lesson-step-footer:not([hidden]) [data-section='grammar']").click()
                    if not page.locator("#c9-lesson-grammar").is_visible():
                        raise AssertionError("Next step does not reveal original grammar")
                    if page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Previous step not collapsed in focus view")
                    if "Step 2 of 6" not in flow.inner_text():
                        raise AssertionError("Focus step progress failed to advance")
                    mode=page.locator('[data-action="c9-lesson-mode"]')
                    mode.click()
                    if not page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Show all sections does not restore original overview")
                    if not page.locator("#c9-lesson-grammar").is_visible():
                        raise AssertionError("Full view does not restore native grammar")
                    mode.click()
                    if page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Focus mode did not restore one-step teaching")
                    page.locator('.c9-lesson-sections [data-section="finish"]').click()
                    if not page.locator('[data-action="mark-studied"]').is_visible():
                        raise AssertionError("Final step lost original explicit introduction")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Six authentic teaching steps, focus/full toggle and original introduction at "+str(width)+"px"
                check("Guided original lesson UX "+str(width),guided_lesson_steps)
                ctx.close()
            # End-to-end C9-53 usability: specific original lesson handoff,
            # explicit completion without forced advance, optional Review setup.
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page,errors=session(width,height,mobile)
                def original_source_completion():
                    open_route(page,"character/demo-02")
                    link=page.locator('[data-action="c9-character-lesson"]').first
                    if not link.is_visible():
                        raise AssertionError("Character → authored lesson handoff missing")
                    link.click()
                    page.wait_for_function("()=>location.hash.startsWith('#/learn/demo-')")
                    if not page.locator("#c9-lesson-title").inner_text().strip():
                        raise AssertionError("Original character lesson not mounted")
                    if not page.locator('.c9-lesson-workspace #c9-lesson-title [lang="zh-Hans"]').inner_text():
                        raise AssertionError("Specific character source handoff not resolved")
                    page.locator('.c9-lesson-sections [data-section="finish"]').click()
                    before=page.locator('.c9-lesson-header .c9-eyebrow').first.inner_text()
                    page.locator('[data-action="mark-studied"]').first.click()
                    page.locator('.c9-lesson-finish-confirmation').wait_for(state="visible",timeout=12000)
                    if not page.locator('.c9-lesson-finish-confirmation').is_visible():
                        raise AssertionError("No visible completion acknowledgement after saved introduction")
                    if page.locator('.c9-lesson-header .c9-eyebrow').first.inner_text()!=before:
                        raise AssertionError("Introducing lesson jumped to another character without asking")
                    if not page.locator('.c9-lesson-step-footer:not([hidden]) [data-action="c9-lesson-select"]').count():
                        raise AssertionError("No explicit Next lesson action after successful introduction")
                    open_route(page,"review")
                    start=page.locator('[data-action="review-begin"]')
                    if not start.is_visible():
                        raise AssertionError("Scheduled recall is buried behind setup fields")
                    options=page.locator('details.c9-review-options')
                    if options.evaluate("(e)=>e.open"):
                        raise AssertionError("Optional review settings overwhelm first-time learner")
                    options.locator(':scope > summary').click()
                    page.locator('#review-focus').select_option('pronunciation')
                    if not options.evaluate("(e)=>e.open"):
                        raise AssertionError("Custom review focus closed during re-render")
                    if page.locator('#review-focus').input_value()!='pronunciation':
                        raise AssertionError("Chosen original recall focus lost on re-render")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Source-exact lesson, recorded completion without forced advance, one-tap scheduled review and persistent optional focus at "+str(width)+"px"
                check("C9-53 source completion and review "+str(width),original_source_completion)
                ctx.close()
            # Canonical original source URL: reload, Back and Forward are
            # navigation only and never touch grading or learner records.
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page,errors=session(width,height,mobile)
                def canonical_lesson_history():
                    open_route(page,"learn")
                    page.locator(".c9-guided-actions [data-action='c9-lesson-open']").first.click()
                    page.wait_for_function("()=>location.hash==='#/learn/demo-01'")
                    original=page.locator("#c9-lesson-title").inner_text()
                    if not page.locator('[data-action="c9-lesson-copy-link"]').is_visible():
                        raise AssertionError("Lesson has no source-exact share action")
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#c9-lesson-overview").wait_for(state="visible")
                    if page.evaluate("()=>location.hash")!="#/learn/demo-01" or page.locator("#c9-lesson-title").inner_text()!=original:
                        raise AssertionError("Page reload forgot canonical authored lesson identity")
                    page.locator('.c9-lesson-bottom-nav [data-action="c9-lesson-select"]').last.click()
                    page.wait_for_function("()=>location.hash==='#/learn/demo-02'")
                    page.wait_for_function("(original)=>document.querySelector('#c9-lesson-title')?.innerText!==original",arg=original)
                    if page.locator("#c9-lesson-title").inner_text()==original:
                        raise AssertionError("Next lesson URL left old native source visible")
                    page.go_back(wait_until="domcontentloaded")
                    page.wait_for_function("()=>location.hash==='#/learn/demo-01'")
                    page.wait_for_function("(original)=>document.querySelector('#c9-lesson-title')?.innerText===original",arg=original)
                    if page.locator("#c9-lesson-title").inner_text()!=original:
                        raise AssertionError("Back did not restore original lesson")
                    page.go_forward(wait_until="domcontentloaded")
                    page.wait_for_function("()=>location.hash==='#/learn/demo-02'")
                    page.locator('[data-action="c9-learn-back"]').first.click()
                    page.wait_for_function("()=>location.hash==='#/learn'")
                    page.locator(".c9-guided-course").wait_for(state="visible")
                    if not page.locator("details.c9-discovery-catalog").evaluate("(e)=>e.open"):
                        raise AssertionError("All lessons left catalog closed after deep link")
                    open_route(page,"learn/demo-999")
                    page.locator(".c9-guided-course").wait_for(state="visible")
                    if page.locator(".c9-lesson-workspace").count():
                        raise AssertionError("Unknown original ID fabricated a lesson")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Canonical source lesson, reload, Back/Forward, catalog and invalid ID guard "+str(width)
                check("C9-54 canonical lesson navigation "+str(width),canonical_lesson_history)
                ctx.close()
            # C9-50: verify the exact authored source can move between the
            # real Home, Lesson, indexed Wordbook, Character and Reader.
            # This is navigation only: no synthetic grades, strokes or saves.
            for width,height,mobile in ((1440,960,False),(390,844,True),(320,700,True)):
                ctx,page,errors=session(width,height,mobile)
                def p9_source_journey():
                    open_route(page,"today")
                    actions=page.locator(".c9-home-source-actions")
                    actions.wait_for(state="visible")
                    if actions.locator('[data-action="hub-lesson"]').count()!=1:
                        raise AssertionError("Home lost source-exact complete lesson handoff")
                    actions.locator('[data-action="c9-character-open"]').click()
                    page.wait_for_function("()=>location.hash==='#/character/demo-01'")
                    word=page.locator(".c9-character-sample-words [data-action='lookup-word']").first
                    word.wait_for(state="visible")
                    word.click()
                    page.wait_for_function("()=>location.hash==='#/explore'")
                    if not page.locator("main").count():raise AssertionError("Original indexed word view absent")
                    open_route(page,"character/demo-01")
                    page.locator(".c9-character-sample-links [data-action='c9-character-reader']").click()
                    page.wait_for_function("()=>location.hash==='#/reader'")
                    if not page.locator("#app-content").inner_text().strip():
                        raise AssertionError("Original contextual Reader empty")
                    open_route(page,"today")
                    page.locator(".c9-home-source-actions [data-action='hub-lesson']").click()
                    page.locator("details.c9-lesson-resources summary").click()
                    page.locator(".c9-lesson-source-preview").wait_for(state="visible")
                    preview=page.locator(".c9-lesson-source-preview")
                    preview.wait_for(state="visible")
                    start=preview.locator(".c9-lesson-preview-toolbar [data-action='c9-lesson-jump']")
                    start.click()
                    if not page.locator("#c9-lesson-overview").evaluate("(e)=>document.activeElement===e"):
                        raise AssertionError("Start teaching shortcut did not focus the original lesson")
                    preview.locator(".c9-lesson-preview-word [data-action='lookup-word']").first.click()
                    page.wait_for_function("()=>location.hash==='#/explore'")
                    open_route(page,"today")
                    page.locator(".c9-home-source-actions [data-action='hub-lesson']").click()
                    page.locator("details.c9-lesson-resources summary").click()
                    page.locator(".c9-lesson-source-preview").wait_for(state="visible")
                    extra=page.locator('details.c9-lesson-extra')
                    if extra.evaluate('(e)=>e.open'):
                        raise AssertionError('Secondary lesson modes should start closed')
                    extra.locator('summary').click()
                    page.locator(".c9-lesson-header-actions [data-action='c9-character-reader']").click()
                    page.wait_for_function("()=>location.hash==='#/reader'")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Original Reader overflow after source handoff")
                    if errors:raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts and width in (1440,390):
                        open_route(page,"character/demo-01")
                        page.screenshot(path=str(args.artifacts/("c9-50-character-"+str(width)+".png")),full_page=True)
                        open_route(page,"today")
                        page.locator(".c9-home-source-actions [data-action='hub-lesson']").click()
                        page.locator("details.c9-lesson-resources summary").click()
                        page.locator(".c9-lesson-source-preview").wait_for(state="visible")
                        page.screenshot(path=str(args.artifacts/("c9-50-lesson-"+str(width)+".png")),full_page=True)
                        open_route(page,"today")
                        page.screenshot(path=str(args.artifacts/("c9-50-home-"+str(width)+".png")),full_page=True)
                    return "Real original Home→Character→Wordbook→Reader and Lesson stage/word/Reader source handoff "+str(width)+"px"
                check("C9-50 P9 authentic source journey "+str(width),p9_source_journey)
                ctx.close()
            # C9-49 — real source-linked independent communication through
            # the existing P29 attempt writer, without private draft persistence.
            for width,height,mobile in ((1440,900,False),(390,844,True),(320,700,True)):
                ctx,page,errors=session(width,height,mobile)
                def pathway_transfer():
                    open_route(page,"pathway/path-01")
                    jump=page.locator('[data-action="pathway-jump-current"]')
                    jump.wait_for(state="visible")
                    jump.click()
                    mission=page.locator("#p29-current-mission")
                    if not mission.evaluate("(e)=>document.activeElement===e"):
                        raise AssertionError("Original mission shortcut did not move keyboard focus")
                    position=mission.bounding_box()
                    if not position or position["y"]<0 or position["y"]>height*.55:
                        raise AssertionError("Current mission remains buried under band list")
                    button=page.locator('[data-action="pathway-reveal"]').first
                    button.wait_for(state="visible")
                    button.click()
                    disclosure=page.locator("details.p29-transfer")
                    disclosure.wait_for(state="attached")
                    disclosure.locator("summary").first.click()
                    draft=page.locator("#p29-transfer-draft")
                    draft.wait_for(state="visible")
                    draft.fill("我先确认时间，再回复你。")
                    if "我先确认时间" not in draft.input_value():
                        raise AssertionError("Original P29 private source draft not editable")
                    witness=page.locator("details.p29-transfer-witness")
                    witness.locator("summary").first.click()
                    if witness.locator('p[lang="zh-Hans"]').count()!=2:
                        raise AssertionError("Two original Chinese source lines missing")
                    if witness.locator('[data-action="speak"][data-rate="slow"]').count()!=1:
                        raise AssertionError("Native slow Mandarin source playback missing")
                    checks=page.locator(".p29-transfer-selfcheck input")
                    if checks.count()!=3: raise AssertionError("Three self-review criteria missing")
                    checks.first.check()
                    if not checks.first.is_checked():raise AssertionError("Native optional self-check not interactive")
                    if args.artifacts and width in (1440,390):
                        page.screenshot(path=str(args.artifacts/("c9-49-transfer-expanded-"+str(width)+".png")),full_page=True)
                    disclosure.locator('[data-action="pathway-transfer-clear"]').click()
                    if draft.input_value():
                        raise AssertionError("Ungraded source draft not cleared")
                    if "No grade or saved record" not in page.locator("#p29-transfer-privacy").inner_text():
                        raise AssertionError("Source draft privacy feedback missing")
                    draft.fill("一个不保存的私人回答。")
                    dismissed=[]
                    def decline(dialog):
                        dismissed.append(dialog.message)
                        dialog.dismiss()
                    page.on("dialog",decline)
                    page.evaluate("location.hash='#/today'")
                    page.wait_for_timeout(200)
                    page.remove_listener("dialog",decline)
                    if not dismissed or page.evaluate("()=>location.hash")!="#/pathway/path-01":
                        raise AssertionError("Native unsent-answer departure safeguard bypassed")
                    page.once("dialog",lambda dialog:dialog.accept())
                    page.evaluate("location.hash='#/today'")
                    page.wait_for_function("()=>location.hash==='#/today'")
                    open_route(page,"pathway/path-01")
                    # An old graded P29 result may remain locally recorded.
                    # The optional private response must not return with it.
                    if page.locator("#p29-transfer-draft").count() and page.locator("#p29-transfer-draft").input_value():
                        raise AssertionError("Private response survived leaving the pathway")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("P29 changed-context controls overflow viewport")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts and width in (1440,390):
                        page.screenshot(path=str(args.artifacts/("c9-49-pathway-"+str(width)+".png")),full_page=True)
                    return "P29 original transfer, private edit/clear, native source reveal, keyboard checks and unsent-departure protection at "+str(width)+"px"
                check("C9-49 real changed-context P29 "+str(width),pathway_transfer)
                ctx.close()
            # P9 native sidebar and direct real course-unit discovery.
            # Uses actual local route rendering and only synthetic browser state.
            ctx,page,errors=session(1440,900,False)
            def native_pathways():
                open_route(page,"today")
                pathways=page.locator(".c9-sidebar .c9-sidebar-study-more")
                if pathways.count()!=1: raise AssertionError("Study pathways disclosure missing")
                if pathways.evaluate("(e)=>e.open"): raise AssertionError("Pathways should start closed on Home")
                pathways.locator("summary").focus()
                if not pathways.locator("summary").evaluate("(e)=>document.activeElement===e"):
                    raise AssertionError("Disclosure summary cannot receive keyboard focus")
                pathways.locator("summary").press("Enter")
                if not pathways.evaluate("(e)=>e.open"):
                    raise AssertionError("Keyboard Enter did not reveal original study routes")
                for route in ("skills","writing","advanced","pathway","plan"):
                    target=pathways.locator('[data-route="'+route+'"]')
                    if target.count()!=1 or not target.is_visible():
                        raise AssertionError("Study route missing from disclosed menu: "+route)
                open_route(page,"skills")
                if not pathways.evaluate("(e)=>e.open"):
                    raise AssertionError("Active study route did not reopen disclosure")
                if not pathways.locator('[data-route="skills"]').get_attribute("aria-current")=="page":
                    raise AssertionError("Active study route lost selected state")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Five native study routes accessible by keyboard and auto-revealed on active route"
            check("P9 desktop native pathways",native_pathways)
            ctx.close()
            for width,height in ((390,844),(320,700)):
                ctx,page,errors=session(width,height,True)
                def compact_home_context():
                    open_route(page,"today")
                    if not page.locator(".c9-home>.c9-home-roadmap").is_visible():
                        raise AssertionError("Actual course units still hidden in collapsed Home panel")
                    course=page.locator(".c9-home>.c9-home-roadmap")
                    if course.locator(".c9-home-roadmap-unit").count()<1:
                        raise AssertionError("Source course unit suggestions absent")
                    # Home deliberately omits the redundant contextual rail.
                    # Study routes retain the compact native related-destinations row.
                    open_route(page,"learn")
                    context=page.locator(".c9-context-bar").first
                    if context.count()!=1: raise AssertionError("Native contextual toolbar missing")
                    bounds=context.bounding_box()
                    if not bounds or bounds["width"]>width+4 or bounds["height"]>115:
                        raise AssertionError("Context toolbar too large on mobile: "+str(bounds))
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Mobile Home horizontal overflow")
                    open_route(page,"character/demo-01")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Compact character header causes horizontal overflow")
                    glyph=page.locator(".c9-character-glyph").first
                    rect=glyph.bounding_box()
                    if not rect or rect["y"]>900:
                        raise AssertionError("Original character is buried under toolbar and hero")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts:
                        page.screenshot(path=str(args.artifacts/("p9-navigation-character-"+str(width)+".png")),full_page=True)
                    return "Original unit roadmap, short context row and visible character at "+str(width)+"px"
                check("P9 mobile context and study roadmap "+str(width),compact_home_context)
                ctx.close()
            # C9-50 final visual audit: screenshot showed source panel painted
            # even with closed details semantics. Assert actual visibility,
            # keyboard isolation, native sections, and accessible Enter toggle.
            for width,height,mobile in ((1440,900,False),(390,844,True),(320,700,True)):
                ctx,page,errors=session(width,height,mobile)
                def details_visibility():
                    open_route(page,"today")
                    home=page.locator("details.c9-home-listening")
                    deck=home.locator(".c9-listening-deck")
                    if home.evaluate("(e)=>e.open") or deck.is_visible():
                        raise AssertionError("Home closed audio is visually exposed")
                    hs=home.locator("summary")
                    hs.focus()
                    if not hs.evaluate("(e)=>document.activeElement===e"):
                        raise AssertionError("Home disclosure is not keyboard focusable")
                    hs.press("Enter")
                    deck.wait_for(state="visible")
                    hs.press("Enter")
                    if deck.is_visible():raise AssertionError("Home audio did not collapse")
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
                    details=page.locator("details.c9-lesson-resources")
                    preview=details.locator(".c9-lesson-source-preview")
                    child=details.locator(".c9-lesson-resources-content")
                    link=details.locator('[data-action="lookup-word"]').first
                    if details.evaluate("(e)=>e.open") or child.is_visible() or preview.is_visible():
                        raise AssertionError("Closed Lesson source preview is painted")
                    link.evaluate("(e)=>e.focus()")
                    if link.evaluate("(e)=>document.activeElement===e"):
                        raise AssertionError("Closed Lesson content accepts keyboard focus")
                    if not page.locator("#c9-lesson-overview").is_visible():
                        raise AssertionError("Original native first stage missing")
                    if not mobile:
                        layout=page.locator(".c9-lesson-layout").bounding_box()
                        box=details.bounding_box()
                        if not layout or not box or layout["y"]>box["y"]+130:
                            raise AssertionError("Optional preview is still burying native lesson")
                    ds=details.locator("summary")
                    ds.focus()
                    ds.press("Enter")
                    preview.wait_for(state="visible")
                    ds.press("Enter")
                    if preview.is_visible():raise AssertionError("Lesson preview remained open")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Horizontal layout overflow")
                    if errors:raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts:
                        page.screenshot(path=str(args.artifacts/("c9-final-collapsed-lesson-"+str(width)+".png")),full_page=False)
                    return "native closed/open visibility, keyboard and original stage at "+str(width)
                check("C9-50 final disclosure "+str(width),details_visibility)
                ctx.close()
            for width,height,mobile in ((1440,900,False),(390,844,True)):
                ctx,page,errors=session(width,height,mobile)
                def character_first_fold():
                    open_route(page,"character/demo-01")
                    panel=page.locator(".c9-character-identity").bounding_box()
                    glyph=page.locator(".c9-character-glyph").bounding_box()
                    if not panel or not glyph:raise AssertionError("Original glyph missing")
                    if not mobile and (glyph["y"]-panel["y"]>110 or glyph["y"]>height*.7):
                        raise AssertionError("Desktop source glyph was buried in whitespace")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Character page horizontal overflow")
                    if errors:raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts:
                        page.screenshot(path=str(args.artifacts/("c9-final-character-fold-"+str(width)+".png")),full_page=False)
                    return "original glyph visible near meaning at "+str(width)
                check("C9-50 final glyph first fold "+str(width),character_first_fold)
                ctx.close()
            # Mobile-first fidelity: first native lesson stage remains in
            # viewport; its adjacent-lesson pager is preserved at the bottom.
            ctx,page,errors=session(390,844,True)
            def mobile_original_lesson_fold():
                open_route(page,"learn")
                page.locator('[data-action="c9-lesson-open"]').first.click()
                section=page.locator("#c9-lesson-overview").bounding_box()
                if not section or section["y"]>764:
                    raise AssertionError("Original teaching still below mobile bottom navigation: "+str(section))
                if not page.locator(".c9-lesson-bottom-nav [data-action]").count():
                    raise AssertionError("Bottom original lesson pager missing")
                if not page.locator("#c9-lesson-flow-label").is_visible():
                    raise AssertionError("Guided lesson steps are not available at the first fold")
                glyph=page.locator("#c9-lesson-overview .big-hanzi").bounding_box()
                if not glyph or glyph["y"]>=height-180:
                    raise AssertionError("Actual native character still buried below the first fold: "+str(glyph))
                if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                    raise AssertionError("Lesson screen horizontal overflow")
                if errors:raise RuntimeError("; ".join(errors[:2]))
                if args.artifacts:
                    page.screenshot(path=str(args.artifacts/"c9-final-original-mobile-fold.png"),full_page=False)
                return "390px original teaching reaches first viewport without losing lesson controls"
            check("C9-50 P9 original mobile lesson fold",mobile_original_lesson_fold)
            ctx.close()
            # C9-48 — native source-led listening, device-voice lifecycle and
            # read-only source visibility. No synthetic scores or user speech.
            for width,height,mobile in ((1440,960,False),(390,844,True),(320,700,True)):
                ctx,page,errors=session(width,height,mobile)
                def original_listening_journey():
                    open_route(page,"today")
                    box=page.locator("details.c9-home-listening")
                    if box.evaluate("(e)=>e.open"):raise AssertionError("P9 Home speech toolkit must be optional")
                    box.locator("summary").click()
                    home=box.locator(".c9-listening-deck")
                    home.wait_for(state="visible")
                    if home.locator('[data-action="speak"][data-rate="slow"]').count()!=1:
                        raise AssertionError("Home slow listen unavailable")
                    if not home.locator('[data-action="speech-stop"]').count():
                        raise AssertionError("Home stop audio unavailable")
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
                    box=page.locator("details.c9-lesson-resources")
                    if box.evaluate("(e)=>e.open"):raise AssertionError("Original lesson stages should lead")
                    box.locator("summary").click()
                    lesson=box.locator(".c9-listening-deck")
                    lesson.wait_for(state="visible")
                    if lesson.locator(".c9-listening-clip").count()!=3:
                        raise AssertionError("Source-owned character, word and sentence audio stages missing")
                    if lesson.locator('[data-action="speak"][data-rate="slow"]').count()!=3:
                        raise AssertionError("Lesson slow playback controls missing")
                    open_route(page,"character/demo-01")
                    character=page.locator(".c9-character-identity-content > .c9-listening-deck")
                    character.wait_for(state="visible")
                    if character.locator(".c9-listening-clip").count()!=2:
                        raise AssertionError("Character native word/sentence stages missing")
                    original=character.locator('[data-action="speak"][data-rate="slow"]').first
                    if not original.get_attribute("data-text"):
                        raise AssertionError("Audio source has no Mandarin text")
                    original.click()
                    character.locator('[data-action="speech-stop"]').click()
                    if "audio stopped" not in page.locator("#alert-banner").inner_text().lower():
                        raise AssertionError("Playback stop did not report actual cancellation")
                    if not page.locator("#c9-writing-canvas").count():
                        raise AssertionError("Native ungraded character writing lost")
                    guide=page.locator("#c9-writing-trace-toggle")
                    glyph=page.locator("#c9-writing-trace-glyph")
                    if not guide.count() or not glyph.count() or not glyph.is_hidden():
                        raise AssertionError("Default private writing guide state not hidden")
                    guide.click()
                    if guide.get_attribute("aria-pressed")!="true" or glyph.is_hidden():
                        raise AssertionError("Original printed reference tracing not enabled")
                    canvas=page.locator("#c9-writing-canvas")
                    if canvas.get_attribute("aria-label") is None:
                        raise AssertionError("Ungraded keyboard canvas lost its accessible name")
                    guide.click()
                    if guide.get_attribute("aria-pressed")!="false" or not glyph.is_hidden():
                        raise AssertionError("Printed reference tracing did not clear")
                    if "not scored or saved" not in page.locator("#c9-writing-feedback").inner_text():
                        raise AssertionError("Printed reference incorrectly claims scored or stored ink")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Listening deck causes horizontal overflow")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts and width in (1440,390):
                        page.screenshot(path=str(args.artifacts/("c9-48-listening-"+str(width)+".png")),full_page=True)
                    return "Authentic Home/lesson/character source, slow/stop, writing and responsive layout "+str(width)+"px"
                check("C9-48 real source listening "+str(width),original_listening_journey)
                ctx.close()
            # P67–P68 uses original story IDs/modes and native reading
            # history only; no shadow score, scheduler or chapter IDs.
            ctx,page,errors=session(390,844,True)
            def original_reading_mode_progression():
                open_route(page,"stories")
                queue=page.locator(".c9-reading-queue")
                queue.wait_for(state="visible")
                queue.locator("#c9-reading-queue-filter").select_option("unattempted")
                if queue.locator("#c9-reading-queue-filter").input_value()!="unattempted":
                    raise AssertionError("Original reading evidence filter not retained")
                cards=queue.locator('[data-action="c9-reading-queue-start"]')
                if cards.count()<1:
                    raise AssertionError("Original source reading exercises cannot be started")
                target=cards.first.get_attribute("data-id")
                mode=cards.first.get_attribute("data-mode")
                cards.first.click()
                practice=page.locator(".story-practice")
                practice.wait_for(state="visible")
                if mode.upper() not in practice.locator(".eyebrow").inner_text().upper():
                    raise AssertionError("Source-based suggested mode did not open in canonical reading player")
                if not page.locator("#c9-native-reading").is_visible():
                    raise AssertionError("Original passage was lost in reading mode transition")
                answers=practice.locator('[data-action="story-answer"]')
                if answers.count():
                    answers.first.click()
                    page.wait_for_function("()=>Boolean(document.querySelector('.story-practice .reader-feedback'))")
                    if not practice.locator(".reader-feedback").is_visible():
                        raise AssertionError("Original reader grade feedback missing")
                if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                    raise AssertionError("P67 source reading flow causes 390px overflow")
                if errors:raise RuntimeError("; ".join(errors[:2]))
                return "390px original passage "+str(target)+" opened in source mode "+str(mode)+" with native feedback"
            check("P67-P68 original reading queue and source-mode graded practice",original_reading_mode_progression)
            ctx.close()
            # P64–P68 original source bridges: exercise actual native Wordbook
            # and source-scored Reader without fabricated radical/HSK material.
            ctx,page,errors=session(390,844,True)
            def original_word_to_reading_source_bridge():
                open_route(page,"wordbook")
                query=page.locator("#c9-word-query")
                query.fill("我")
                usage=page.locator(".c9-word-usage")
                if usage.count()<1:
                    raise AssertionError("Original dictionary source evidence absent for indexed Chinese word")
                usage.first.locator("summary").click()
                if not usage.first.locator(".c9-word-usage-list article").count():
                    raise AssertionError("Canonical Wordbook source contexts unavailable")
                if "sense" not in usage.first.inner_text().lower():
                    raise AssertionError("Written-form occurrence was confused with authoritative word sense")
                open_route(page,"stories")
                support=page.locator(".c9-reading-vocabulary")
                support.wait_for(state="visible")
                if page.locator(".c9-reading-vocabulary-item").count():
                    raise AssertionError("Reader source definitions leaked before assistance")
                page.locator('[data-action="story-mode"][data-mode="comprehension"]').first.click()
                help=page.locator('[data-action="c9-reading-vocabulary-help"]')
                help.click()
                if page.locator(".c9-reading-vocabulary-item").count()<1:
                    raise AssertionError("Original reader vocabulary failed to reveal after assistance")
                if "current unsubmitted answer will be recorded as assisted" not in page.locator(".c9-reading-vocabulary-caveat").inner_text():
                    raise AssertionError("Source help failed to communicate assisted grading")
                choices=page.locator('.story-practice [data-action="story-answer"]')
                if choices.count():
                    choices.first.click()
                    page.wait_for_function("()=>Boolean(document.querySelector('.story-practice .reader-feedback'))")
                    if "Assisted practice" not in page.locator(".story-practice .reader-feedback").inner_text():
                        raise AssertionError("Native original reading answer incorrectly gained independent credit after source help")
                if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                    raise AssertionError("Wordbook or reading source bridge overflowed 390px viewport")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "390px original dictionary provenance, gated source-word reader assistance and native grading"
            check("P64-P68 original source word and assisted reading bridge",original_word_to_reading_source_bridge)
            ctx.close()
            # Original P70 — the typing path must actually land inside the
            # already authoritative Sentence Library's production mode.
            ctx,page,errors=session(390,844,True)
            def source_typing_progression():
                open_route(page,"sentences")
                pathway=page.locator(".c9-typing-path details")
                pathway.locator("summary").click()
                if not pathway.evaluate("(el)=>el.open"):
                    raise AssertionError("Original typing details did not open")
                pathway.locator("#c9-typing-status").select_option("unattempted")
                if not pathway.evaluate("(el)=>el.open"):
                    raise AssertionError("Typing source filters discarded the active disclosure")
                if pathway.locator("#c9-typing-status").input_value()!="unattempted":
                    raise AssertionError("Native typing evidence filter lost selection")
                pathway.locator("#c9-typing-topic").select_option(index=1)
                first_page=pathway.locator('[data-action="c9-typing-start"]').first.get_attribute("data-id")
                next_page=pathway.locator('[data-action="c9-typing-page"][data-delta="1"]')
                if next_page.is_enabled():
                    next_page.click()
                    second_page=pathway.locator('[data-action="c9-typing-start"]').first.get_attribute("data-id")
                    if first_page==second_page:
                        raise AssertionError("Native typing page did not advance the original source")
                    pathway.locator('[data-action="c9-typing-page"][data-delta="-1"]').click()
                cards=pathway.locator('[data-action="c9-typing-start"]')
                if cards.count()<3:
                    raise AssertionError("Original typed sentence pathway not available")
                selected=cards.first.get_attribute("data-id")
                cards.first.click()
                entry=page.locator("#sentence-library-entry")
                entry.wait_for(state="visible")
                if page.locator('[data-action="sentence-focus"]').count()<1:
                    raise AssertionError("Original independent-focus authority lost")
                entry.fill("这是我自己输入的句子")
                answer=page.locator('[data-action="sentence-answer"]').first
                if not answer.is_enabled():
                    raise AssertionError("Original production grader was not enabled by typed Hanzi")
                answer.click()
                page.wait_for_function("()=>Boolean(document.querySelector('.p26-feedback'))")
                if not page.locator(".p26-feedback").is_visible():
                    raise AssertionError("Existing native sentence feedback missing")
                if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                    raise AssertionError("P70 original typing path has mobile horizontal overflow")
                if errors:raise RuntimeError("; ".join(errors[:2]))
                return "390px original source "+str(selected)+" routed to native typed production and feedback, no duplicate scoring engine"
            check("P70 original independent Chinese typing",source_typing_progression)
            ctx.close()
            # Original roadmap P61–P63/P69: exercise genuine native drawing
            # and private text interaction on a narrow touch viewport.
            ctx,page,errors=session(390,844,True)
            def original_handwriting_and_personal_reading():
                open_route(page,"character/demo-01")
                page.locator('[data-writing-mode="recall"]').click()
                if page.locator("#c9-writing-recall-cue").is_hidden():
                    raise AssertionError("Recall cue is missing")
                if not page.locator("#c9-writing-reference").is_hidden():
                    raise AssertionError("Recall reference was not covered")
                page.locator("#c9-writing-canvas").click()
                keep=page.locator("#c9-writing-keep")
                if not keep.is_enabled():
                    raise AssertionError("Handwriting is not captured in recall mode")
                keep.click()
                if page.locator("#c9-writing-attempt-review").is_hidden():
                    raise AssertionError("Prior local attempt not available to compare")
                if page.locator("#c9-writing-compare").is_disabled():
                    raise AssertionError("Attempt comparison control not enabled")
                page.locator('[data-writing-mode="trace"]').click()
                if page.locator("#c9-writing-trace-glyph").is_hidden():
                    raise AssertionError("Printed source tracing missing")
                if "not scored or saved" not in page.locator("#c9-writing-feedback").inner_text():
                    raise AssertionError("Ungraded writing status not explicit")
                open_route(page,"stories")
                panel=page.locator(".c9-personal-reader details")
                panel.locator("summary").click()
                entry=page.locator("#c9-personal-input")
                entry.fill("我在学校学习中文。我喜欢中文。")
                page.locator("#c9-personal-analyze").click()
                if page.locator(".c9-personal-line").count()!=2:
                    raise AssertionError("Personal pasted sentences were not annotated")
                page.locator('[data-personal-mine="0"]').click()
                if "1" not in page.locator(".c9-personal-mined strong").inner_text():
                    raise AssertionError("Private sentence mining did not update")
                if page.locator(".c9-personal-term").count()<1:
                    raise AssertionError("Canonical source word lookup was not offered")
                if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                    raise AssertionError("Original handwriting/personal reader overflow")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "390px original free writing, recall/copy trace, private source-backed text annotation and sentence selection"
            check("P61-P63/P69 original writing and private reading mobile integration",
                  original_handwriting_and_personal_reading)
            ctx.close()
            # C9-47 — exercise the actual integrated P9 first-fold, source
            # previews, native section routing and dark visual hierarchy.
            for width,height,mobile in [(1440,960,False),(390,844,True),(320,700,True)]:
                ctx,page,errors=session(width,height,mobile)
                def source_led_surfaces():
                    open_route(page,"today")
                    page.locator(".c9-home-first-fold .c9-home-hero").wait_for(state="visible")
                    page.locator(".c9-home-first-fold .c9-home-plan").wait_for(state="visible")
                    home=page.locator(".c9-home-source-preview")
                    if not home.locator('[lang="zh-Hans"]').inner_text().strip():
                        raise AssertionError("Home lost source-authored Chinese example")
                    home_english=home.locator(":scope > p").inner_text()
                    if not home_english: raise AssertionError("Home source gloss absent")
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
                    page.locator("details.c9-lesson-resources summary").click()
                    preview=page.locator(".c9-lesson-source-preview")
                    preview.wait_for(state="visible")
                    if preview.locator("article").count()<3:
                        raise AssertionError("Lesson source trilogy missing")
                    preview.locator('[data-action="c9-lesson-jump"][data-section="vocabulary"]').click()
                    if not page.locator("#c9-lesson-vocabulary").count():
                        raise AssertionError("Native vocabulary section not preserved")
                    open_route(page,"character/demo-01")
                    sample=page.locator(".c9-character-source-sample")
                    sample.wait_for(state="visible")
                    if not sample.locator('[lang="zh-Hans"]').count():
                        raise AssertionError("Character source sample absent")
                    if not page.locator(".c9-character-top>.c9-character-tabs").count():
                        raise AssertionError("Character navigation not in mobile-first hero")
                    sample.locator('[data-action="c9-character-jump"][data-section="writing"]').click()
                    if not page.locator("#c9-writing-canvas").count():
                        raise AssertionError("Original freehand pad removed")
                    if "Not installed" not in page.locator(".c9-character-evidence").inner_text():
                        raise AssertionError("Stroke data limitation removed")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("C9-47 character screen horizontal overflow")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts:
                        page.screenshot(path=str(args.artifacts/("c9-47-character-"+str(width)+".png")),full_page=True)
                    # Home must obey the same source Pinyin visibility setting
                    # as native Lesson and Character Study.
                    open_route(page,"settings")
                    page.locator('input[data-setting="showPinyin"]').uncheck()
                    open_route(page,"today")
                    example=page.locator(".c9-home-source-preview")
                    if not example.locator('[lang="zh-Hans"]').count():
                        raise AssertionError("Pinyin preference hid Chinese text")
                    if example.locator("small").count():
                        raise AssertionError("Home leaked Pinyin after learner disabled it")
                    return "Original next-lesson Home, native Lesson jumps, Character Study source examples and writing at "+str(width)+"px"
                check("C9-47 source study surfaces "+str(width),source_led_surfaces)
                ctx.close()
            for width,height,mobile in [(1440,900,False),(390,844,True)]:
                ctx,page,errors=session(width,height,mobile)
                def dark_source_surfaces():
                    open_route(page,"settings")
                    page.locator('input[data-setting="dark"]').check()
                    open_route(page,"today")
                    if page.evaluate("()=>document.documentElement.dataset.theme")!="dark":
                        raise AssertionError("Original dark theme selection not applied")
                    element=page.locator(".c9-home-source-preview")
                    element.wait_for(state="visible")
                    colors=element.evaluate("""e=>{
                      const s=getComputedStyle(e),t=getComputedStyle(e.querySelector('strong'));
                      return [s.borderTopColor,t.color]
                    }""")
                    if not colors or colors[1] in ("rgba(0, 0, 0, 0)","rgb(0, 0, 0)"):
                        raise AssertionError("Dark Chinese text invisible")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Dark Home horizontal overflow")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts:
                        page.screenshot(path=str(args.artifacts/("c9-47-home-dark-"+str(width)+".png")),full_page=True)
                    return "Native dark mode and P9 source contrast at "+str(width)+"px"
                check("C9-47 dark source contrast "+str(width),dark_source_surfaces)
                ctx.close()
            # Preserve the original transient freehand pad across ungraded
            # translation view changes; no new writer or assessment authority.
            ctx,page,errors=session()
            def translation_keeps_ink():
                open_route(page,"character/demo-01")
                canvas=page.locator("#c9-writing-canvas")
                canvas.scroll_into_view_if_needed()
                bounds=canvas.bounding_box()
                if not bounds: raise AssertionError("Ungraded writing pad unavailable")
                page.mouse.move(bounds["x"]+bounds["width"]*.32,bounds["y"]+bounds["height"]*.32)
                page.mouse.down()
                page.mouse.move(bounds["x"]+bounds["width"]*.61,bounds["y"]+bounds["height"]*.55,steps=6)
                page.mouse.up()
                if "1 line" not in page.locator("#c9-writing-feedback").inner_text():
                    raise AssertionError("Pointer input did not draw one original freehand line")
                page.evaluate("()=>window.__c9Ink=document.querySelector('#c9-writing-canvas')")
                support=page.locator('[data-action="c9-character-support"]')
                support.click()
                if not page.evaluate("()=>window.__c9Ink===document.querySelector('#c9-writing-canvas')"):
                    raise AssertionError("Translation toggle remounted private handwriting")
                if "1 line" not in page.locator("#c9-writing-feedback").inner_text():
                    raise AssertionError("Translation toggle erased unsaved handwriting")
                if not page.locator(".c9-character-sample-english").evaluate("(e)=>e.hidden"):
                    raise AssertionError("Gloss remained visible after hide action")
                support.click()
                if page.locator(".c9-character-sample-english").evaluate("(e)=>e.hidden"):
                    raise AssertionError("Source gloss did not reappear")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Private ungraded ink survives native source visibility checks"
            check("C9-50 in-place Character translation and private ink",translation_keeps_ink)
            ctx.close()
            # C9-46: screenshot-backed original desktop lesson overlap regression.
            # The desktop vertical lesson rail must never paint across the
            # adjacent native teaching panel; the mobile rail may scroll.
            for width,height,mobile in [(1280,900,False),(1440,900,False),(1680,960,False),(390,844,True)]:
                ctx,page,errors=session(width,height,mobile)
                def lesson_hitboxes():
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
                    page.locator(".c9-lesson-layout").wait_for(state="visible")
                    positions=page.evaluate("""() => {
                      const left=document.querySelector('.c9-lesson-left');
                      const main=document.querySelector('.c9-lesson-main');
                      const buttons=[...document.querySelectorAll('.c9-lesson-left .c9-lesson-nav-button')];
                      if(!left||!main||!buttons.length)return null;
                      const r=e=>{const b=e.getBoundingClientRect();
                        return {x:b.left,right:b.right,width:b.width,top:b.top,bottom:b.bottom}};
                      return {left:r(left),main:r(main),buttons:buttons.map(r),
                        columnMode:getComputedStyle(document.querySelector('.c9-lesson-layout')).gridTemplateColumns,
                        overflow:document.documentElement.scrollWidth-innerWidth};
                    }""")
                    if not positions or len(positions["buttons"])<4:
                        raise AssertionError("Native lesson sections missing")
                    if positions["overflow"]>4:
                        raise AssertionError("Original lesson page horizontal overflow")
                    if not mobile:
                        for b in positions["buttons"]:
                            if b["x"]<positions["left"]["x"]-2 or b["right"]>positions["left"]["right"]+2:
                                raise AssertionError("Desktop lesson navigation leaves its left column: "+str(positions))
                        if positions["left"]["right"]>positions["main"]["x"]+2:
                            raise AssertionError("Desktop navigation overlaps lesson main panel")
                    else:
                        if positions["main"]["top"]<positions["left"]["bottom"]-2:
                            raise AssertionError("Mobile horizontal rail covers lesson content")
                    target=page.locator(".c9-lesson-left .c9-lesson-nav-button").first
                    target.focus()
                    if not target.evaluate("(node)=>document.activeElement===node"):
                        raise AssertionError("Lesson section cannot take keyboard focus")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if args.artifacts and width in (390,1440):
                        page.screenshot(path=str(args.artifacts/("c9-46-lesson-"+str(width)+".png")),full_page=True)
                    return "Native lesson rail clear of content and keyboard-focusable at "+str(width)+"px"
                check("C9-46 lesson navigation hitboxes "+str(width),lesson_hitboxes)
                ctx.close()
            ctx,page,errors=session()
            def dark():
                open_route(page,"settings")
                page.locator('input[data-setting="dark"]').check()
                page.wait_for_function("()=>document.documentElement.dataset.theme==='dark'")
                page.reload()
                page.wait_for_function("()=>document.documentElement.dataset.theme==='dark'")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                if args.artifacts:
                    page.screenshot(path=str(args.artifacts/"desktop-dark-settings.png"),full_page=True)
                    page.goto(args.base_url.rstrip("/")+"/#/stories",wait_until="domcontentloaded")
                    page.screenshot(path=str(args.artifacts/"desktop-dark-stories.png"),full_page=True)
                    page.set_viewport_size({"width":390,"height":844})
                    page.screenshot(path=str(args.artifacts/"mobile-dark-stories.png"),full_page=True)
                return "Dark preference survives reload; desktop and mobile captures are optional"
            check("dark-mode and persistence",dark)
            ctx.close()
            ctx,page,errors=session()
            def keydialog():
                open_route(page,"today")
                page.locator("#c9-shortcuts-open").click()
                dlg=page.locator("#c9-shortcuts-dialog")
                if not dlg.evaluate("(e)=>e.open"): raise AssertionError("Dialog not open")
                page.keyboard.press("Escape")
                if dlg.evaluate("(e)=>e.open"): raise AssertionError("Escape did not close")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Native dialog opened and closed"
            check("keyboard help and dialog",keydialog)
            ctx.close()
            ctx,page,errors=session()
            def review():
                open_route(page,"learn")
                page.locator('[data-action="c9-lesson-open"]').first.click()
                page.locator('.c9-lesson-sections [data-section="finish"]').click()
                page.locator('[data-action="mark-studied"]').first.click()
                open_route(page,"review")
                page.locator('[data-action="review-begin"]').click()
                page.locator(".c9-assessment-live").wait_for(state="visible")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original lesson introduction populated native Review"
            ready_for_grading=check("lesson to scheduled Review",review)
            def grade():
                # Verify custody in the *original* learner object store rather
                # than accepting a successful DOM reload as evidence.
                read_events="""async () => new Promise((resolve,reject) => {
                  const open=indexedDB.open('character-study-local-v2');
                  open.onerror=()=>reject(open.error);
                  open.onsuccess=()=>{
                    const db=open.result,tx=db.transaction('learner','readonly');
                    const req=tx.objectStore('learner').get('state');
                    req.onerror=()=>reject(req.error);
                    req.onsuccess=()=>{resolve(req.result?.events?.length||0);db.close();};
                  };
                })"""
                before=page.evaluate(read_events)
                page.locator('[data-action="reveal-review"]').click()
                page.locator('[data-action="grade"][data-grade="0"]').click()
                page.wait_for_function("""() =>
                    document.getElementById('c9-interaction-announcement')
                    ?.textContent?.includes('Native review grade saved')""")
                after=page.evaluate(read_events)
                if after!=before+1:
                    raise AssertionError("Native event writer did not persist exactly one grade")
                page.reload()
                page.locator("#app-content").wait_for(state="visible")
                persisted=page.evaluate(read_events)
                if persisted!=after:
                    raise AssertionError("Review grade was not retained after reload")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original learner IndexedDB events: "+str(before)+" → "+str(persisted)
            if ready_for_grading:
                check("native grading and reload",grade)
            else:
                record("native grading and reload","NOT_TESTED","Cannot grade because lesson-to-review setup failed")
            ctx.close()
            ctx,page,errors=session()
            def writing():
                open_route(page,"character/demo-01")
                page.locator("#c9-writing-canvas").focus()
                for key in ("Space","ArrowRight","ArrowDown","Space"): page.keyboard.press(key)
                if page.locator("#c9-writing-undo").is_disabled(): raise AssertionError("Undo still disabled")
                page.locator("#c9-writing-undo").click()
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Keyboard strokes and Undo handled"
            check("handwriting keyboard input",writing)
            ctx.close()
            # Native source-backed tool controls, beyond checking route visibility.
            ctx,page,errors=session()
            def vocabulary():
                open_route(page,"wordbook")
                search=page.locator("#c9-word-query")
                search.fill("xué")
                page.locator("#c9-word-catalog [data-action='c9-word-open']").first.wait_for(state="visible")
                page.locator("#c9-word-catalog [data-action='c9-word-open']").first.click()
                page.wait_for_function("()=>location.hash==='#/explore'")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Search filtered original source words and opened native detail"
            check("Vocabulary search and dictionary handoff",vocabulary)
            ctx.close()
            ctx,page,errors=session()
            def grammar():
                open_route(page,"grammar")
                # Original grammar directory uses a collapsed native disclosure;
                # selecting the first DOM match without opening it targets a hidden button.
                page.locator('details.c9-library-chapter-lessons summary').first.click()
                first=page.locator('details.c9-library-chapter-lessons[open] [data-action="grammar-select"]').first
                first.wait_for(state="visible")
                name=first.inner_text().strip()
                first.click()
                page.locator(".c9-language-native").wait_for(state="visible")
                if name and name not in page.locator(".c9-language-native").inner_text():
                    raise AssertionError("Selected grammar lesson missing from native workspace")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original grammar lesson selected and native study opened"
            check("Grammar discovery to native lesson",grammar)
            ctx.close()
            ctx,page,errors=session()
            def sentences():
                open_route(page,"sentences")
                page.locator('[data-action="c9-sentence-topic"]').first.click()
                page.locator(".c9-language-native").wait_for(state="visible")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original sentence situation opened native sentence study"
            check("Sentence situation to original practice",sentences)
            ctx.close()
            ctx,page,errors=session()
            def reading():
                open_route(page,"stories")
                switch=page.locator('[data-action="c9-story-pinyin"]')
                switch.wait_for(state="visible")
                switch.click()
                switch=page.locator('[data-action="c9-story-pinyin"]')
                if switch.get_attribute("aria-pressed")!="true":
                    raise AssertionError("Source-based Pinyin help did not activate")
                page.locator(".story-pinyin").first.wait_for(state="visible")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Pinyin support revealed in original story; answer remains assisted"
            check("Reading source support controls",reading)
            ctx.close()
            ctx,page,errors=session()
            def listening():
                open_route(page,"dialogues")
                next_turn=page.locator('[data-action="c9-media-turn"][data-dir="1"]')
                next_turn.wait_for(state="visible")
                before=page.locator(".c9-media-turn-nav strong").inner_text()
                next_turn.click()
                after=page.locator(".c9-media-turn-nav strong").inner_text()
                if before==after:
                    raise AssertionError("Conversation turn did not advance")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original dialogue turn navigation advanced without grading"
            check("Dialogue turn navigation",listening)
            ctx.close()
            ctx,page,errors=session()
            def semantics():
                open_route(page,"today")
                for selector in ("main[aria-label]",'#c9-route-announcement[aria-live="polite"]',
                                 '#c9-interaction-announcement[aria-live="polite"]'):
                    if not page.locator(selector).count():
                        raise AssertionError("Required landmark/live region missing: "+selector)
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Landmark and live regions present; not screen-reader certification"
            check("Accessible DOM landmarks",semantics)
            ctx.close()
            for label,width,height,mobile in [
                ("mobile",390,844,True),("tablet",820,1180,True),("desktop",1366,850,False)]:
                ctx,page,errors=session(width,height,mobile)
                for route in ("today","learn","stories","dialogues","settings"):
                    def layout():
                        open_route(page,route)
                        dimensions=page.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]")
                        if dimensions[0]>dimensions[1]+4: raise AssertionError("Horizontal overflow "+str(dimensions))
                        if errors: raise RuntimeError("; ".join(errors[:2]))
                        if args.artifacts and route in ("today","stories"):
                            page.screenshot(path=str(args.artifacts/(label+"-"+route+".png")),full_page=True)
                        return str(width)+"x"+str(height)+" no document overflow"
                    check(label+" "+route+" responsive",layout)
                ctx.close()
            # Original P43: deliberately synthetic writing, held in tab memory.
            ctx,page,errors=session()
            def private_writing():
                open_route(page,"writing")
                page.locator('[data-action="p43-step"][data-step="compose"]').first.click()
                original="第一段：我学习中文。第二段：我根据原文修改解释。"
                exported="第一段：我学习中文。第二段：我检查资料后再写。"
                unsent="这段文字不应该被自动覆盖。"
                page.locator("#p43-draft").fill(original)
                page.locator('[data-action="p43-save"]').click()
                page.locator("#p43-draft").fill(exported)
                with page.expect_download() as capture:
                    page.locator('[data-action="c9-writing-backup-export"]').click()
                downloaded_json=Path(capture.value.path()).read_text(encoding="utf-8")
                record_data=json.loads(downloaded_json)
                if record_data.get("format")!="thiepn-chinese-p43-writing":
                    raise AssertionError("Wrong private P43 export format")
                if record_data.get("draft")!=exported or record_data.get("revisions")!=[original]:
                    raise AssertionError("Original draft and revision absent from private export")
                page.locator("#p43-draft").fill(unsent)
                disclosure=page.locator("details.c9-writing-backup-paste")
                if not disclosure.evaluate("(e)=>e.open"):
                    disclosure.locator("summary").click()
                page.locator("#c9-writing-backup-paste").fill(downloaded_json)
                page.locator('[data-action="c9-writing-backup-import-paste"]').click()
                page.locator("#c9-writing-pending").wait_for(state="visible")
                if page.locator("#p43-draft").input_value()!=unsent:
                    raise AssertionError("Unconfirmed import overwrote private draft")
                page.locator('[data-action="p43-stay"]').first.click()
                if page.locator("#p43-draft").input_value()!=unsent:
                    raise AssertionError("Cancelled import lost private draft")
                disclosure=page.locator("details.c9-writing-backup-paste")
                if not disclosure.evaluate("(e)=>e.open"):
                    disclosure.locator("summary").click()
                page.locator("#c9-writing-backup-paste").fill(downloaded_json)
                page.locator('[data-action="c9-writing-backup-import-paste"]').click()
                page.locator("#c9-writing-pending").wait_for(state="visible")
                page.locator('[data-action="p43-switch-confirm"]').first.click()
                if page.locator("#p43-draft").input_value()!=exported:
                    raise AssertionError("Confirmed import did not restore original private writing")
                page.locator('[data-action="p43-next"]').click()
                page.locator("#c9-writing-pending").wait_for(state="visible")
                page.locator('[data-action="p43-stay"]').first.click()
                if page.locator("#p43-draft").input_value()!=exported:
                    raise AssertionError("Cancelled topic change lost original writing")
                other=ctx.new_page()
                open_route(other,"writing")
                other.locator('[data-action="p43-step"][data-step="compose"]').first.click()
                if other.locator("#p43-draft").input_value():
                    raise AssertionError("P43 private writing was saved outside its source tab")
                other.close()
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Private JSON download, preview/cancel, confirmed restore, topic guard, tab-only custody"
            check("P43 private writing export/import/cancel",private_writing)
            ctx.close()
            for width,height,mobile in [(320,700,True),(640,360,False)]:
                ctx,page,errors=session(width,height,mobile)
                def writing_layout():
                    open_route(page,"writing")
                    page.locator('[data-action="p43-step"][data-step="compose"]').first.click()
                    dimensions=page.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]")
                    if dimensions[0]>dimensions[1]+4:
                        raise AssertionError("Original writing screen overflow "+str(dimensions))
                    rect=page.locator("#p43-draft").bounding_box()
                    if not rect or rect["x"]<0 or rect["x"]+rect["width"]>width+4:
                        raise AssertionError("Original writing editor clipped from viewport")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return str(width)+"x"+str(height)+" original editor visible"
                check("P43 "+str(width)+"x"+str(height)+" responsive",writing_layout)
                ctx.close()
            # Existing offline cache names are discarded during installation
            # of the new source worker. This tests stale CacheStorage migration,
            # not a running-v58-service-worker takeover in a real user profile.
            ctx,page,errors=session()
            def stale_cache_upgrade():
                legacy="character-study-working-v58-c9-49-context-transfer"
                current="character-study-working-v63-reading-continuity"
                response=page.goto(args.base_url.rstrip("/")+
                    "/__c9_46_preinstall_cache_seed__",wait_until="domcontentloaded")
                if response is None or response.status!=404:
                    raise AssertionError("Stale-cache seed must not execute the app")
                page.evaluate("""async name=>{
                  const store=await caches.open(name);
                  await store.put(new Request(location.origin+'/__c9_46_legacy_marker__'),
                                  new Response('old revision only'));
                }""",legacy)
                if legacy not in page.evaluate("async ()=>await caches.keys()"):
                    raise AssertionError("Older cache was not prepared")
                open_route(page,"today")
                page.wait_for_function("()=>Boolean(navigator.serviceWorker?.controller)",
                                       timeout=25000)
                page.wait_for_function("""async ()=> {
                  const keys=await caches.keys();
                  return !keys.includes('character-study-working-v58-c9-49-context-transfer')&&
                    keys.includes('character-study-working-v63-reading-continuity');
                }""",timeout=15000)
                kept=page.evaluate("""async name=>{
                  const store=await caches.open(name);
                  return (await store.keys()).length;
                }""",current)
                if kept!=8:
                    raise AssertionError("Updated cache lacks complete compiled runtime assets: "+str(kept))
                ctx.set_offline(True)
                try:
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#app-content").wait_for(state="visible")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                finally: ctx.set_offline(False)
                return "Old v58 CacheStorage deleted; 8 compiled runtime assets retained and offline reload works (not live SW takeover)"
            check("C9-50 stale offline cache migration",stale_cache_upgrade)
            ctx.close()
            ctx,page,errors=session()
            def offline():
                open_route(page,"today")
                page.wait_for_function("()=>Boolean(navigator.serviceWorker?.controller)",timeout=20000)
                page.reload()
                ctx.set_offline(True)
                try:
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#app-content").wait_for(state="visible")
                    page.locator(".c9-home-hero").wait_for(state="visible")
                    page.goto(args.base_url.rstrip("/")+"/#/learn",wait_until="domcontentloaded")
                    page.locator(".c9-discovery").wait_for(state="visible")
                    page.goto(args.base_url.rstrip("/")+"/#/character/demo-01",wait_until="domcontentloaded")
                    page.locator(".c9-character-glyph").wait_for(state="visible")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Service worker serves compiled original Home, lesson and character offline"
                finally: ctx.set_offline(False)
            check("offline cached shell",offline)
            ctx.close()
            browser.close()
    except Exception as exc:
        record("browser session","FAIL",type(exc).__name__+": "+str(exc))
    return finish()

if __name__=="__main__":
    sys.exit(main())
