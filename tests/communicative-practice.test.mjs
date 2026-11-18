// Communicative practice suite: structural diagnostics are honest guidance,
// the production practice log records practice without grades, and the
// roleplay studio surfaces both.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { composeCheck,structuralMarkers } from '../src/compose-feedback.mjs';
import { addProductionEvent,validateProductionEvents,productionStats,PRODUCTION_KINDS } from '../src/production-log.mjs';
import { freshState,validateState,addLesson } from '../src/study.mjs';
import { backupDocument,importBackup } from '../src/study-storage.mjs';
import { DEMO_LESSONS } from '../src/demo-lessons.mjs';

test('structural diagnostics: markers detect taught grammar honestly',()=>{
 const m=structuralMarkers;
 assert.equal(m('我吃完了。').completed,true);
 assert.equal(m('除了他以外我都认识。').completed,false,'除了 is not aspect 了');
 assert.equal(m('我了解这个问题。').completed,false,'了解 is not aspect 了');
 assert.equal(m('他没来。').negation,true);
 assert.equal(m('你去不去学校？').negation,false,'V-not-V is a question, not negation');
 assert.equal(m('你去不去学校？').questionWord,true,'A-not-A counts as a question form');
 assert.equal(m('你有没有时间？').negation,false);
 assert.equal(m('你有没有时间？').questionWord,true);
 assert.equal(m('我把水喝完了。').ba,true);
 assert.equal(m('水被我喝完了。').bei,true);
 assert.equal(m('你去吗？').questionParticle,true);
});

test('structural diagnostics: comparison notes guide without judging',()=>{
 const c=composeCheck('我把水喝完了。','我喝完水。');
 assert.equal(c.verdict,'differs');
 assert.ok(c.message.includes('Structure note:'),'structure notes appear');
 assert.ok(c.message.includes('把'),'the 把 difference is named');
 assert.ok(c.message.includes('了'),'the 了 difference is named');
 assert.ok(c.message.includes('not judged automatically'),'honest caveat kept');
 for(const word of ['wrong','error','incorrect','ungrammatical'])assert.ok(!c.message.includes(word),'no verdict words: '+word);
 const same=composeCheck('你去不去学校？','你去学校。');
 assert.ok(same.message.includes('asks a question'),'question-form difference described');
 // Structural notes stay capped so the feedback remains readable.
 const many=composeCheck('今天我不去学校，我把水喝了，你去吗？','今天。');
 assert.ok((many.message.match(/Structure note/g)||[]).length<=3,'notes capped');
});

test('production log: practice records never carry grades',()=>{
 let s=freshState();
 assert.deepEqual(s.productionEvents,[]);
 s=addProductionEvent(s,{id:'p1',kind:'shadow',targetId:'dialogue-191:1'});
 s=addProductionEvent(s,{id:'p2',kind:'typed',targetId:'dialogue-191:1',matched:false});
 s=addProductionEvent(s,{id:'p3',kind:'typed',targetId:'dialogue-191:3',matched:true});
 assert.equal(productionStats(s).total,3);
 assert.equal(productionStats(s).spoken,1);
 assert.equal(productionStats(s).typed,2);
 assert.equal(productionStats(s).matched,1);
 for(const e of s.productionEvents)assert.ok(!('grade'in e)&&!('correct'in e),'practice events carry no grades');
 const dedup=addProductionEvent(s,{id:'p1',kind:'shadow',targetId:'dialogue-191:1'});
 assert.equal(dedup.productionEvents.length,3,'ids are idempotent');
 assert.throws(()=>addProductionEvent(s,{id:'',kind:'shadow',targetId:'x'}),/Invalid production/);
 assert.throws(()=>addProductionEvent(s,{id:'p9',kind:'grade',targetId:'x'}),/Invalid production/);
 assert.throws(()=>addProductionEvent(s,{id:'p9',kind:'typed',targetId:'x',matched:'yes'}),/Invalid production/);
 assert.deepEqual([...PRODUCTION_KINDS],['shadow','typed','free']);
 assert.doesNotThrow(()=>validateProductionEvents(s.productionEvents));
 assert.throws(()=>validateProductionEvents([{id:'a',kind:'shadow',targetId:'x',at:1},{id:'a',kind:'shadow',targetId:'x',at:2}]),/Invalid production/);
 assert.throws(()=>validateProductionEvents([{id:'a',kind:'shadow',targetId:'x',at:1,grade:2}]),/Invalid production/);
});

test('production log: state, backups and validation integrate safely',()=>{
 let s=addLesson(freshState(),'demo-01',1000);
 s=addProductionEvent(s,{id:'p1',kind:'shadow',targetId:'dialogue-191:1'});
 assert.doesNotThrow(()=>validateState(s));
 const restored=importBackup(backupDocument(s));
 assert.deepEqual(restored.productionEvents,s.productionEvents);
 const old=freshState();
 delete old.productionEvents;
 assert.doesNotThrow(()=>validateState(old),'pre-production states stay valid');
});

test('communicative practice: surfaces are wired and nothing moved',()=>{
 const media=readFileSync(new URL('../src/media-c9.mjs',import.meta.url),'utf8');
 assert.ok(media.includes('composeCheck(source.reply.hanzi,entry)'),'roleplay compares typed replies with the honest engine');
 assert.ok(media.includes('No correctness grade was assigned'),'grade honesty retained');
 assert.ok(media.includes('practice log, not grades'),'practice counts labeled honestly');
 const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
 assert.ok(app.includes("kind:'shadow'"),'speaking self-reports log');
 assert.ok(app.includes("kind:'typed'"),'typed replies log');
 assert.ok(app.includes('not grades or pronunciation proof'),'progress label honest');
 assert.equal(DEMO_LESSONS.length,428);
});
