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
        if not source_files or source_files!=dist_files:
            raise AssertionError("src/dist inventory differs; build the current checkout")
        mismatched=[str(p) for p in source_files
                    if hashlib.sha256((src_root/p).read_bytes()).digest()!=
                       hashlib.sha256((dist_root/p).read_bytes()).digest()]
        if mismatched:
            raise AssertionError("Stale dist files: "+", ".join(mismatched[:6]))
        record("Exact source versus local build","PASS",
               str(len(source_files))+" source/dist assets identical")
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
