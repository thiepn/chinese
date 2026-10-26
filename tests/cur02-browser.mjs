import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://127.0.0.1:4173/#/learn/level/C2');
 await page.locator('.cur02-ch-levels').waitFor({timeout:30000});
 assert.equal(await page.locator('.cur02-ch-level').count(),6);
 assert.match(await page.locator('.cur02-ch-course').innerText(),/No original lessons have an independently verified C2/);
 await page.locator('.cur02-ch-unmapped').click();
 await page.locator('.cur02-ch-list [data-action="c9-lesson-open"]').first().waitFor();
 await page.locator('.cur02-ch-list [data-action="c9-lesson-open"]').first().click();
 await page.locator('.c9-lesson-workspace').waitFor({timeout:30000});
 assert.match(page.url(),/#\/learn\/demo-\d+/);
 await page.goBack();
 await page.locator('.cur02-ch-course').waitFor({timeout:30000});
 assert.ok((await page.locator('.cur02-ch-list li').count())>0);
 console.log('Chinese CUR-02 Chromium mobile course and preserved lesson entry PASS');
}finally{await browser.close()}
