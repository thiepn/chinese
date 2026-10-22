import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {WORDS,findWord} from '../src/lexicon.mjs';
import {c9WordCatalogResults} from '../src/libraries-c9.mjs';
import {CHINESE_LOCAL_VISUALS,localVocabularyImage} from '../src/visual-lexicon-c9.mjs';
const root=new URL('../src/',import.meta.url);
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const act=(_type,label)=>'<button>'+label+'</button>';
const state={bookmarkedWords:[],vocabularyIntroduced:[]};
test('approved Chinese catalog maps 12 original word keys to byte-intact original SVGs',()=>{
 assert.equal(CHINESE_LOCAL_VISUALS.length,12);
 assert.equal(new Set(CHINESE_LOCAL_VISUALS.map(x=>x.lexemeId)).size,12);
 for(const row of CHINESE_LOCAL_VISUALS){
  assert.ok(WORDS.some(w=>w.key===row.lexemeId),'Unrecognized original word key: '+row.lexemeId);
  const bytes=readFileSync(new URL('./visual-lexicon/assets/'+row.asset,root));
  assert.equal(createHash('sha1').update('blob '+bytes.length+String.fromCharCode(0)).update(bytes).digest('hex'),row.blobSha);
  assert.match(bytes.toString('utf8'),/<svg(?:\s|>)/);
 }
});
test('optional reference art is exact, lazy, same-origin, and absent during recall',()=>{
 const picture=localVocabularyImage({languageId:'chinese',lexemeId:'书|shu',usage:'reference'});
 assert.equal(picture.src,'./visual-lexicon/assets/book.svg');
 assert.equal(picture.loading,'lazy');assert.equal(picture.decoding,'async');
 assert.equal(picture.width,320);assert.equal(picture.height,240);
 for(const input of [
  {languageId:'chinese',lexemeId:'书|shu',usage:'independent-recall'},
  {languageId:'chinese',lexemeId:'unknown',usage:'reference'},
  {languageId:'japanese',lexemeId:'书|shu',usage:'reference'},
  {languageId:'chinese',lexemeId:'书|shu',usage:'reference',assetBase:'https://example.com'},
  {languageId:'chinese',lexemeId:'书|shu',usage:'reference',assetBase:'../escape'}
 ])assert.equal(localVocabularyImage(input),null);
 assert.ok(findWord('书|shu'));
 const html=c9WordCatalogResults(state,{query:'书'},act,esc);
 assert.match(html,/src="\.\/visual-lexicon\/assets\/book\.svg"/);
 assert.match(html,/loading="lazy" decoding="async"/);
 assert.doesNotMatch(c9WordCatalogResults(state,{query:'电脑'},act,esc),/c9-lexicon-image/);
});
test('existing offline shell precaches optional local images, no secondary cache',()=>{
 const sw=readFileSync(new URL('./sw.js',root),'utf8'),app=readFileSync(new URL('./app.mjs',root),'utf8');
 assert.ok(sw.includes("const CACHE='character-study-working-v75-p77-consequence-dialogues-visual-lexicon-v1'"));
 assert.ok(app.includes("const C9_EXPECTED_OFFLINE_ASSETS=20;"));
 for(const row of CHINESE_LOCAL_VISUALS)assert.ok(sw.includes("'./visual-lexicon/assets/"+row.asset+"'"));
 assert.ok(sw.includes('const ASSETS=[...new Set(RUNTIME_ASSETS)];'));
});
