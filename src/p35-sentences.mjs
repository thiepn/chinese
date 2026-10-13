/** P35 original elementary character and full-sentence transfer.
 * Content reuses the 140 authored P35 bilingual lesson sentences.
 * Grouping is exactly five characters × two examples per topic so the
 * historical ten-sentence topic ID mapping remains append-only and collision-free.
 */
import {P35_CHARACTER_GUIDES} from './p35-foundations.mjs';
const foci=[
 ['People & introductions','Communication','introduce and recognize people',['g39','g45']],
 ['Giving help','Communication','offer help and explain needs',['g58','g59']],
 ['Schedule decisions','Planning','describe plans and obligations',['g52','g54']],
 ['Time in action','Planning','sequence actions and report outcomes',['g53','g60']],
 ['Travel questions','Travel','choose transport and routes',['g47','g55']],
 ['Travel movements','Travel','locate places and report arrival',['g38','g55']],
 ['Study questions','Study','interpret questions and respond',['g46','g60']],
 ['Study methods','Study','review and practise language',['g37','g56']],
 ['Health and services','Services','make safe ordinary requests',['g40','g59']],
 ['People and services','Services','identify institutions and services',['g39','g55']],
 ['Borrowing and prices','Shopping','ask about costs and borrowing',['g41','g62']],
 ['Prices and quantities','Shopping','compare value and count objects',['g50','g62']],
 ['Choosing and hoping','Preferences','state preferences and intentions',['g57','g62']],
 ['Feelings and comparisons','Daily life','describe feelings and experiences',['g40','g64']]
];
export const P35_SENTENCE_TOPICS=Object.freeze([
 ...foci.map((focus,i)=>Object.freeze([
  'P35 · '+focus[0],focus[1],focus[2],2,focus[3],
  Object.freeze(P35_CHARACTER_GUIDES.slice(i*5,i*5+5).flatMap(g=>g.examples.slice(0,2).map(s=>Object.freeze([s.hanzi,s.pinyin,s.english]))))
 ])),
 ...['Introducing and requesting','Sequencing and travelling','Directions and exam questions','Study and practical services',
    'Health, shopping and borrowing','Prices, objects and aspirations','Feelings, understanding and enjoyment']
   .map((theme,i)=>Object.freeze([
   'P35 · Transfer · '+theme,['Communication','Travel','Study','Services','Shopping','Choices','Daily life'][i],
   'use a newly learned character in an independently authored third example',2,
   [['g39','g59'],['g47','g54'],['g46','g60'],['g55','g59'],['g50','g62'],['g57','g62'],['g40','g64']][i],
   Object.freeze(P35_CHARACTER_GUIDES.slice(i*10,i*10+10).map(g=>{
    const s=g.examples[2];return Object.freeze([s.hanzi,s.pinyin,s.english]);
   }))
  ]))
]);
