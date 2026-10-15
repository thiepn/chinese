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
            # C9-48 — native source-led listening, device-voice lifecycle and
            # read-only source visibility. No synthetic scores or user speech.
            for width,height,mobile in ((1440,960,False),(390,844,True),(320,700,True)):
                ctx,page,errors=session(width,height,mobile)
                def original_listening_journey():
                    open_route(page,"today")
                    home=page.locator(".c9-home-source-preview .c9-listening-deck")
                    home.wait_for(state="visible")
                    if home.locator('[data-action="speak"][data-rate="slow"]').count()!=1:
                        raise AssertionError("Home slow listen unavailable")
                    if not home.locator('[data-action="speech-stop"]').count():
                        raise AssertionError("Home stop audio unavailable")
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
                    lesson=page.locator(".c9-lesson-workspace > .c9-listening-deck")
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
                    home_english=home.locator("p").inner_text()
                    if not home_english: raise AssertionError("Home source gloss absent")
                    open_route(page,"learn")
                    page.locator('[data-action="c9-lesson-open"]').first.click()
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
            # Existing offline cache names are discarded during installation
            # of the new source worker. This tests stale CacheStorage migration,
            # not a running-v56-service-worker takeover in a real user profile.
            ctx,page,errors=session()
            def stale_cache_upgrade():
                legacy="character-study-working-v56-c9-p9-native-navigation"
                current="character-study-working-v57-c9-48-native-listening"
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
                  return !keys.includes('character-study-working-v56-c9-p9-native-navigation')&&
                    keys.includes('character-study-working-v57-c9-48-native-listening');
                }""",timeout=15000)
                kept=page.evaluate("""async name=>{
                  const store=await caches.open(name);
                  return (await store.keys()).length;
                }""",current)
                if kept!=315:
                    raise AssertionError("Updated cache lacks original source assets: "+str(kept))
                ctx.set_offline(True)
                try:
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#app-content").wait_for(state="visible")
                    if errors: raise RuntimeError("; ".join(errors[:2]))
                finally: ctx.set_offline(False)
                return "Old v56 CacheStorage deleted; 315 v57 assets retained and offline reload works (not live SW takeover)"
            check("C9-48 stale offline cache migration",stale_cache_upgrade)
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
