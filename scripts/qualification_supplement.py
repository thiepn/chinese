#!/usr/bin/env python3
"""Local-only supplemental browser qualification for the post-C9-57 learning
surfaces (the November 2026 phases) and the data-integrity workflows that the
main c9_browser_acceptance.py predates.

Covers: free composition honesty, roleplay improvisation, reading readiness
and pre-study scheduling, hidden-target listening drills, sound-family and
radical-clue drills, the scheduled word review deck, progress evidence
labels, the safe backup export/preview/REPLACE round trip, three-digit
grammar deep links, and multi-tab transactional writes with cross-tab
refresh. The whole run also asserts zero console errors and zero CSP
violations.

Requires Python Playwright and a Chromium-based browser (Chrome or Edge).
Prints PASS/FAIL/NOT_TESTED JSON in the same shape as the main acceptance
script. Local loopback only; no credentials, services or real user data.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse


def main():
    # Windows consoles default to cp1252 and crash on Unicode check details.
    if hasattr(sys.stdout,"reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8",errors="replace")
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
        automated_passed=counts["PASS"]>=14 and not counts["FAIL"] and not counts["NOT_TESTED"]
        print(json.dumps({"checks":results,"summary":counts,
                          "automated_acceptance_passed":automated_passed,
                          "release_qualified":False,
                          "manual_gates":["Physical screen-reader and keyboard acceptance with real assistive technology",
                                          "Human linguistic review of Mandarin teaching content",
                                          "Real device audio/TTS quality and rights review",
                                          "Owner visual approval in light and dark modes",
                                          "Explicit human release authorization"]},
                          ensure_ascii=False,indent=2))
        return 0 if automated_passed else 1

    # A stale dist/ would make every runtime finding meaningless.
    root=Path(__file__).resolve().parents[1]
    try:
        src_root=root/"src"; dist_root=root/"dist"
        source_files={p.relative_to(src_root) for p in src_root.rglob("*") if p.is_file()}
        dist_files={p.relative_to(dist_root) for p in dist_root.rglob("*") if p.is_file()}
        compiled={Path("startup.mjs"),Path("styles-startup.css")}
        if not source_files or source_files|compiled!=dist_files:
            raise AssertionError("src/dist source inventory plus compiled assets differs")
        import hashlib
        # Line-ending-invariant hashing, matching scripts/dist-gate.mjs:
        # git checkout translation (autocrlf) must never read as tampering.
        def _h(path):
            b=path.read_bytes()
            return hashlib.sha256(b if b"\0" in b else b.replace(b"\r\n",b"\n")).hexdigest()
        mismatched=[str(p) for p in source_files
                    if p!=Path("index.html") and _h(src_root/p)!=_h(dist_root/p)]
        if mismatched:
            raise AssertionError("Stale dist files: "+", ".join(mismatched[:6]))
        record("Exact source versus local build","PASS",
               f"{len(source_files)} untouched originals plus two compiled startup assets")
    except Exception as exc:
        record("Exact source versus local build","FAIL",exc)
        return finish()
    if args.expected_head and re.fullmatch(r"[0-9a-f]{40}",args.expected_head or ""):
        try:
            head=subprocess.check_output(["git","rev-parse","HEAD"],cwd=root,text=True).strip()
            if head!=args.expected_head: raise AssertionError(f"HEAD {head} is not the expected {args.expected_head}")
            record("Exact Git commit provenance","PASS",head)
        except Exception as exc:
            record("Exact Git commit provenance","FAIL",exc)
            return finish()
    else:
        record("Exact Git commit provenance","NOT_TESTED",
               "Specify --expected-head with the exact commit under qualification")

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        record("browser","NOT_TESTED","Python Playwright is not installed")
        return finish()
    executable=args.chromium or shutil.which("chromium") or shutil.which("google-chrome")
    if not executable:
        record("browser","NOT_TESTED","Chromium not found")
        return finish()

    console_errors=[]   # shared across every context in this run
    csp_violations=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=executable,headless=True,
                                       args=["--no-sandbox"])
            def session(width=1366,height=850,mobile=False):
                ctx=browser.new_context(viewport={"width":width,"height":height},
                    is_mobile=mobile,has_touch=mobile,service_workers="allow")
                page=ctx.new_page()
                page.set_default_timeout(12000)
                attach(page)
                return ctx,page
            def attach(page):
                page.add_init_script("""
                  window.__cspViolations=[];
                  document.addEventListener('securitypolicyviolation',
                    e=>window.__cspViolations.push(e.violatedDirective+' '+e.blockedURI));
                """)
                page.on("pageerror",lambda err:console_errors.append("pageerror: "+str(err)))
                page.on("console",lambda msg:console_errors.append("console: "+msg.text)
                        if msg.type=="error" else None)
                page.on("dialog",lambda dlg:dlg.accept())
            def collect_csp(page):
                for v in page.evaluate("()=>window.__cspViolations||[]"):
                    csp_violations.append(str(v))
            def open_route(page,route):
                page.goto(args.base_url.rstrip("/")+"/#/"+route,
                          wait_until="domcontentloaded")
                page.locator("#app-content").wait_for(state="visible")
                page.wait_for_function("()=>document.querySelector('#app-content')?.textContent?.trim().length>40")
            def shot(page,name):
                if args.artifacts:
                    try: page.screenshot(path=str(args.artifacts/(name.replace(' ','_')+".png")))
                    except Exception: pass
            def check(name,fn):
                try:
                    detail=fn() or "OK"
                    record(name,"PASS",detail)
                    return True
                except Exception as exc:
                    record(name,"FAIL",type(exc).__name__+": "+str(exc))
                    return False
            def open_progress_details(page):
                disc=page.locator("#app-content details").filter(has_text="learning history")
                if disc.count() and not disc.first.evaluate("e=>e.open"):
                    disc.first.locator("summary").click()
                    page.wait_for_function(
                        "()=>[...document.querySelectorAll('#app-content details')]"+
                        ".some(d=>d.open&&/learning history/i.test(d.querySelector('summary')?.textContent||''))")

            # ---- Free composition: honest analysis, no verdict words --------
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page=session(width,height,mobile)
                def free_composition():
                    open_route(page,"writing")
                    studio=page.locator("#free-writing-studio")
                    studio.wait_for(state="visible")
                    btn=studio.locator('[data-action="free-check"]')
                    if not btn.is_disabled():
                        raise AssertionError("Check was enabled before any writing")
                    studio.locator("#free-writing-entry").fill("今天我去学校。我学习中文。")
                    if btn.is_disabled():
                        raise AssertionError("Check stayed disabled after typing")
                    btn.click()
                    fb=studio.locator(".reader-feedback")
                    fb.wait_for(state="visible")
                    text=fb.inner_text()
                    if "cannot judge correctness" not in text:
                        raise AssertionError("Free-writing analysis lost its honest limitation statement")
                    low=text.lower()
                    for bad in ("wrong","incorrect","ungrammatical","error","mistake"):
                        if bad in low:
                            raise AssertionError("Verdict word in free-writing analysis: "+bad)
                    insp=studio.locator("details.free-writing-inspiration")
                    if "one possible answer among many" not in insp.locator("summary").inner_text():
                        raise AssertionError("Inspiration example not labeled as one possibility")
                    insp.locator("summary").click()
                    if "not the answer" not in insp.inner_text():
                        raise AssertionError("Inspiration example presented as the answer")
                    body=studio.inner_text()
                    if "Self-reported practice log" not in body:
                        raise AssertionError("No self-reported practice log line")
                    if "no correctness or fluency is ever claimed" not in body:
                        raise AssertionError("Practice log lost its honesty label")
                    page.wait_for_function(
                        "()=>/[1-9][0-9]* free-composition attempts/"+
                        ".test(document.querySelector('#free-writing-studio')?.textContent||'')")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Free composition overflows the viewport horizontally")
                    collect_csp(page)
                    shot(page,"free_composition_"+str(width))
                    return "Honest content report, no verdict words, practice logged at "+str(width)+"px"
                check("Free composition honesty "+str(width),free_composition)
                ctx.close()

            # ---- Roleplay improvisation: own-line transcript ----------------
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page=session(width,height,mobile)
                def roleplay_improv():
                    open_route(page,"dialogues/dialogue-02")
                    studio=page.locator("#c9-roleplay-studio")
                    studio.wait_for(state="visible")
                    studio.locator("#c9-roleplay-entry").fill("我想继续聊天。")
                    btn=studio.locator('[data-action="c9-roleplay-continue"]')
                    if btn.is_disabled():
                        raise AssertionError("Use-my-reply stayed disabled after typing a line")
                    btn.click()
                    mine=studio.locator(".c9-rehearsal-mine")
                    mine.wait_for(state="visible")
                    text=mine.inner_text()
                    if "YOUR VERSION SO FAR" not in text:
                        raise AssertionError("No learner-version transcript after improvising")
                    if "我想继续聊天。" not in text:
                        raise AssertionError("Typed improvised line missing from the transcript")
                    if "The authored script continues from its own wording" not in text:
                        raise AssertionError("Improvisation transcript lost its honesty caveat")
                    page.wait_for_function(
                        "()=>/practice log, not grades/"+
                        ".test(document.querySelector('#c9-roleplay-studio')?.textContent||'')")
                    if page.evaluate("()=>document.documentElement.scrollWidth-innerWidth")>4:
                        raise AssertionError("Roleplay studio overflows the viewport horizontally")
                    collect_csp(page)
                    shot(page,"roleplay_improv_"+str(width))
                    return "Own-line continuation with transcript and caveat at "+str(width)+"px"
                check("Roleplay improvisation transcript "+str(width),roleplay_improv)
                ctx.close()

            # ---- Reading readiness and pre-study scheduling -----------------
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page=session(width,height,mobile)
                def readiness():
                    open_route(page,"stories")
                    chip=page.locator(".c9-media-entry-readiness").first
                    chip.wait_for(state="visible")
                    ct=chip.inner_text()
                    if "Readiness:" not in ct or "%" not in ct:
                        raise AssertionError("Catalog readiness chip malformed: "+ct[:80])
                    open_route(page,"stories/story-02")
                    note=page.locator(".c9-reading-readiness-note")
                    note.wait_for(state="visible")
                    if "Reading readiness:" not in note.inner_text():
                        raise AssertionError("Reading page has no readiness report")
                    page.locator('[data-action="c9-reading-vocabulary-help"]').click()
                    block=page.locator(".c9-reading-readiness")
                    block.wait_for(state="visible")
                    deck=block.locator('[data-action="readiness-deck"]')
                    if not deck.count():
                        return "Every indexed word already studied at "+str(width)+"px"
                    deck.click()
                    page.wait_for_function(
                        "()=>/pre-study words for review/"+
                        ".test(document.querySelector('#alert-banner')?.textContent||'')")
                    page.wait_for_function(
                        "()=>/not demonstrated/"+
                        ".test(document.querySelector('.c9-reading-readiness')?.textContent||'')")
                    if "not demonstrated" not in page.locator(".c9-reading-readiness").inner_text():
                        raise AssertionError("Scheduled words implied as demonstrated")
                    collect_csp(page)
                    shot(page,"readiness_"+str(width))
                    return "Readiness chips, pre-study scheduling and honest scheduled-not-demonstrated label at "+str(width)+"px"
                check("Reading readiness and pre-study scheduling "+str(width),readiness)
                ctx.close()

            # ---- Listening drills hide the visual target --------------------
            for width,height,mobile in ((390,844,True),(1440,900,False)):
                ctx,page=session(width,height,mobile)
                def listening_hidden():
                    open_route(page,"practice")
                    page.locator('[data-action="drill-mode"][data-mode="listen-meaning"]').click()
                    card=page.locator(".practice-card")
                    card.wait_for(state="visible")
                    if card.locator(".practice-hanzi").count():
                        raise AssertionError("Listening drill displayed the target hanzi")
                    if not card.locator('[data-action="speak"]').count():
                        raise AssertionError("Listening drill has no audio control")
                    header=page.locator(".practice-header")
                    if "target text stays hidden" not in header.inner_text():
                        raise AssertionError("Missing listening-honesty note in the drill header")
                    label=page.locator("#drill-lesson").evaluate("e=>e.selectedOptions[0].textContent")
                    if not re.fullmatch(r"\d+\. Lesson \d+",label.strip()):
                        raise AssertionError("Active lesson not anonymized for listening: "+label[:60])
                    card.locator(".choice").first.click()
                    fb=card.locator(".reader-feedback")
                    fb.wait_for(state="visible")
                    ft=fb.inner_text()
                    if "Reference:" not in ft or "supplemental practice only" not in ft:
                        raise AssertionError("Listening feedback lost reference or supplemental label")
                    page.locator('[data-action="drill-mode"][data-mode="listen-pinyin"]').click()
                    card=page.locator(".practice-card")
                    if not card.locator("#drill-entry").count():
                        raise AssertionError("Dictation mode has no typed entry")
                    if card.locator(".practice-hanzi").count():
                        raise AssertionError("Dictation mode leaked the target text")
                    collect_csp(page)
                    shot(page,"listening_"+str(width))
                    return "Hidden target, anonymized selector, audio-first meaning and dictation at "+str(width)+"px"
                check("Listening drills hide the visual target "+str(width),listening_hidden)
                ctx.close()

            # ---- Sound-family and radical-clue drills ----------------------
            ctx,page=session(1440,900,False)
            def family_drills():
                for mode in ("sound-family","radical-clue"):
                    page.goto(args.base_url.rstrip("/")+"/#/practice",wait_until="domcontentloaded")
                    page.locator('[data-action="drill-mode"][data-mode="'+mode+'"]').click()
                    card=page.locator(".practice-card")
                    card.wait_for(state="visible")
                    n=card.locator(".choice").count()
                    if n!=4:
                        raise AssertionError(mode+" shows "+str(n)+" options, expected 4")
                    card.locator(".choice").first.click()
                    fb=card.locator(".reader-feedback")
                    fb.wait_for(state="visible")
                    ft=fb.inner_text()
                    if "Reference:" not in ft or "supplemental practice only" not in ft:
                        raise AssertionError(mode+" feedback lost reference or supplemental label")
                collect_csp(page)
                shot(page,"family_drills")
                return "Sound-family and radical-clue drills: 4 options each, supplemental-only feedback"
            check("Sound-family and radical-clue drills",family_drills)
            ctx.close()

            # ---- Scheduled word review deck round trip ---------------------
            ctx,page=session(1440,900,False)
            def word_deck():
                open_route(page,"explore")
                page.locator('[data-action="lookup-word"]').first.click()
                entry=page.locator(".p23-word-entry")
                entry.wait_for(state="visible")
                toggle=entry.locator('[data-action="word-deck-toggle"]')
                toggle.click()
                page.wait_for_function(
                    "()=>/two new review targets/"+
                    ".test(document.querySelector('#alert-banner')?.textContent||'')")
                if "In scheduled review" not in page.locator('[data-action="word-deck-toggle"]').inner_text():
                    raise AssertionError("Word-deck toggle did not reflect scheduled state")
                page.locator('[data-action="word-deck-toggle"]').click()
                page.wait_for_function(
                    "()=>/Removed from scheduled review/"+
                    ".test(document.querySelector('#alert-banner')?.textContent||'')")
                if "Schedule review" not in page.locator('[data-action="word-deck-toggle"]').inner_text():
                    raise AssertionError("Word-deck toggle did not return to unscheduled state")
                open_route(page,"progress")
                open_progress_details(page)
                if "Scheduled vocabulary" not in page.locator("#app-content").inner_text():
                    raise AssertionError("Progress lacks the separate Scheduled vocabulary bucket")
                collect_csp(page)
                shot(page,"word_deck")
                return "Schedule/unschedule round trip with two review targets and separated progress bucket"
            check("Scheduled word review deck round trip",word_deck)
            ctx.close()

            # ---- Progress evidence honesty labels --------------------------
            ctx,page=session(1440,900,False)
            def progress_honesty():
                open_route(page,"progress")
                open_progress_details(page)
                text=page.locator("#app-content").inner_text()
                if "a practice log, not grades or pronunciation proof" not in text:
                    raise AssertionError("Progress lacks the production-log honesty label")
                if "not an estimated memory probability" not in text:
                    raise AssertionError("Progress lacks the no-mastery-probability label")
                if "Scheduled vocabulary" not in text:
                    raise AssertionError("Progress lacks the separated Scheduled vocabulary bucket")
                collect_csp(page)
                shot(page,"progress_honesty")
                return "Practice-log, evidence and probability labels present"
            check("Progress evidence honesty labels",progress_honesty)
            ctx.close()

            # ---- Backup export, preview and REPLACE restore ---------------
            ctx,page=session(1440,900,False)
            def backup_roundtrip():
                open_route(page,"settings")
                import tempfile
                tmp=Path(tempfile.gettempdir())/"qualification-backup.json"
                with page.expect_download(timeout=10000) as dl:
                    page.locator('[data-action="export"]').click()
                dl.value.save_as(str(tmp))
                if "Backup export started" not in page.locator("#alert-banner").inner_text():
                    raise AssertionError("Export gave no confirmation")
                blob=json.loads(tmp.read_text(encoding="utf-8"))
                if blob.get("formatVersion")!=1 or blob.get("format")!="character-study-demo-backup":
                    raise AssertionError("Exported backup has an unexpected format: "+str(blob.get("formatVersion")))
                page.locator("#import-file").set_input_files(str(tmp))
                prev=page.locator(".finish-backup-preview")
                prev.wait_for(state="visible")
                pt=prev.inner_text()
                if "VALIDATED BACKUP" not in pt or "This is a replacement" not in pt:
                    raise AssertionError("Import preview missing validation or replacement wording")
                btn=page.locator('[data-action="restore-confirm"]')
                if not btn.is_disabled():
                    raise AssertionError("Replace button enabled without acknowledgement")
                page.locator("#restore-ack").fill("replace")
                if not btn.is_disabled():
                    raise AssertionError("Lowercase acknowledgement wrongly enabled the replacement")
                page.locator("#restore-ack").fill("REPLACE")
                if btn.is_disabled():
                    raise AssertionError("Exact REPLACE acknowledgement did not enable the replacement")
                btn.click()
                page.wait_for_function(
                    "()=>/Validated backup restored/"+
                    ".test(document.querySelector('#alert-banner')?.textContent||'')")
                if page.locator(".finish-backup-preview").count():
                    raise AssertionError("Preview remained after the replacement")
                open_route(page,"progress")
                open_progress_details(page)
                if "a practice log, not grades or pronunciation proof" not in page.locator("#app-content").inner_text():
                    raise AssertionError("Progress broken after backup replacement")
                collect_csp(page)
                shot(page,"backup_roundtrip")
                return "Export, strict REPLACE acknowledgement, preview counts and functional restore"
            check("Backup export, preview and REPLACE restore",backup_roundtrip)
            ctx.close()

            # ---- Three-digit grammar deep link ----------------------------
            ctx,page=session(1440,900,False)
            def grammar_deep_link():
                open_route(page,"grammar/g182")
                text=page.locator("#app-content").inner_text()
                if "Sentence-final 啊 and 呀 for tone of voice" not in text:
                    raise AssertionError("Deep link grammar/g182 rendered the wrong lesson: "+text[:120])
                collect_csp(page)
                shot(page,"grammar_deep_link")
                return "grammar/g182 opens the exact three-digit lesson"
            check("Three-digit grammar deep link",grammar_deep_link)
            ctx.close()

            # ---- Multi-tab transactional writes and refresh ---------------
            ctx,page=session(1440,900,False)
            def multi_tab():
                tabB=ctx.new_page()
                tabB.set_default_timeout(12000)
                attach(tabB)
                open_route(page,"writing")
                open_route(tabB,"writing")
                page.locator("#free-writing-entry").fill("今天我去学校。")
                page.locator('[data-action="free-check"]').click()
                page.wait_for_function(
                    "()=>/\\b1 free-composition attempts/"+
                    ".test(document.querySelector('#free-writing-studio')?.textContent||'')")
                tabB.wait_for_function(
                    "()=>/\\b1 free-composition attempts/"+
                    ".test(document.querySelector('#free-writing-studio')?.textContent||'')",
                    timeout=8000)
                tabB.locator("#free-writing-entry").fill("明天我在家休息。")
                tabB.locator('[data-action="free-check"]').click()
                tabB.wait_for_function(
                    "()=>/\\b2 free-composition attempts/"+
                    ".test(document.querySelector('#free-writing-studio')?.textContent||'')")
                page.wait_for_function(
                    "()=>/\\b2 free-composition attempts/"+
                    ".test(document.querySelector('#free-writing-studio')?.textContent||'')",
                    timeout=8000)
                page.reload(wait_until="domcontentloaded")
                page.wait_for_function(
                    "()=>/\\b2 free-composition attempts/"+
                    ".test(document.querySelector('#free-writing-studio')?.textContent||'')",
                    timeout=8000)
                collect_csp(page); collect_csp(tabB)
                shot(page,"multi_tab")
                tabB.close()
                return "Both tab writes persisted (2 attempts), cross-tab refresh without reload"
            check("Multi-tab transactional writes and refresh",multi_tab)
            ctx.close()

            # ---- Whole-run console and CSP integrity ----------------------
            def clean_run():
                if console_errors:
                    raise AssertionError("; ".join(console_errors[:3]))
                if csp_violations:
                    raise AssertionError("CSP violations: "+"; ".join(csp_violations[:3]))
                return "Zero console errors and zero CSP violations across every checked surface"
            check("Whole-run console and CSP integrity",clean_run)
    except Exception as exc:
        record("browser session","FAIL",type(exc).__name__+": "+str(exc))
    return finish()


if __name__=="__main__":
    sys.exit(main())
