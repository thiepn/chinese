#!/usr/bin/env python3
"""Local-only, isolated C9 browser acceptance. Requires Python Playwright and Chromium.

Build the current C9 branch via npm run build, then start npm run serve locally.
No credentials, paid service, CI, production URL or real user data is accessed.
Prints PASS/FAIL/NOT_TESTED JSON. Screenshots optional.
"""
import argparse
import json
import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url",default="http://127.0.0.1:4173")
    parser.add_argument("--chromium",default=os.getenv("CHROME_BIN"))
    parser.add_argument("--artifacts",type=Path)
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
        print(json.dumps({"checks":results,"summary":counts,
                          "release_qualified":counts["PASS"]>=15 and not counts["FAIL"] and not counts["NOT_TESTED"]},
                          ensure_ascii=False,indent=2))
        return 0 if counts["PASS"]>=15 and not counts["FAIL"] and not counts["NOT_TESTED"] else 1
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
                try: record(name,"PASS",fn() or "OK")
                except Exception as exc: record(name,"FAIL",type(exc).__name__+": "+str(exc))
            for route in ["today","learn","character/demo-01","review","practice",
                          "wordbook","grammar","sentences","stories","dialogues",
                          "progress","settings","pinyin","find"]:
                ctx,page,errors=session()
                def route_check():
                    open_route(page,route)
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    if not page.locator("main").count(): raise AssertionError("Main landmark absent")
                    return str(len(page.locator("#app-content").inner_text()))+" visible characters"
                check("route "+route,route_check)
                ctx.close()
            ctx,page,errors=session()
            def dark():
                open_route(page,"settings")
                page.locator('input[data-setting="dark"]').check()
                page.wait_for_function("()=>document.documentElement.dataset.theme==='dark'")
                page.reload()
                page.wait_for_function("()=>document.documentElement.dataset.theme==='dark'")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Dark preference survives reload in isolated browser"
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
                page.locator('[data-action="mark-studied"]').first.click()
                open_route(page,"review")
                page.locator('[data-action="review-begin"]').click()
                page.locator(".c9-assessment-live").wait_for(state="visible")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Original lesson introduction populated native Review"
            check("lesson to scheduled Review",review)
            def grade():
                page.locator('[data-action="reveal-review"]').click()
                page.locator('[data-action="grade"][data-grade="0"]').click()
                page.reload()
                page.locator("#app-content").wait_for(state="visible")
                if errors: raise RuntimeError("; ".join(errors[:2]))
                return "Native grade submitted, IndexedDB page reopened"
            check("native grading and reload",grade)
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
            ctx,page,errors=session()
            def offline():
                open_route(page,"today")
                page.wait_for_function("()=>Boolean(navigator.serviceWorker?.controller)",timeout=20000)
                page.reload()
                ctx.set_offline(True)
                try:
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#app-content").wait_for(state="visible")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                    return "Service Worker reloaded the app offline"
                finally: ctx.set_offline(False)
            check("offline cached shell",offline)
            ctx.close()
            browser.close()
    except Exception as exc:
        record("browser session","FAIL",type(exc).__name__+": "+str(exc))
    return finish()

if __name__=="__main__":
    sys.exit(main())
