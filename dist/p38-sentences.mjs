/** P38 independent original narrative sentence transfer.
 * Four newly authored sentences per reading, 120 total, append-only into
 * the established P26 sentence library (ten sentences per source topic).
 */
import {P38_PASSAGES} from './p38-readings.mjs';
const names=[
 'Changed arrangements and responsible choices',
 'Schedules, study and everyday errands',
 'Food, routes and reflective practice',
 'Evidence, object searches and shared spaces',
 'Notices, commitments and responsibility',
 'Cooperative design and privacy',
 'Collaboration, lending and food preferences',
 'Repairs, work meetings and learning',
 'Study spaces, transit and public service',
 'Customer service, travel conditions and library use',
 'Practical problems and everyday invitations',
 'Clear communication, language learning and volunteering'
];
const sentences=P38_PASSAGES.flatMap(p=>[p.lines[0],p.lines[1],p.lines[2],p.lines[11]].map(line=>({line,passage:p})));
export const P38_SENTENCE_GRAMMAR_IDS=Object.freeze(sentences.map((x,i)=>x.passage.grammarIds[i%2]||x.passage.grammarIds[0]));
export const P38_SENTENCE_TOPICS=Object.freeze(names.map((name,i)=>Object.freeze([
 'P38 · Reading transfer · '+name,
 P38_PASSAGES[Math.floor(i*10/4)]?.theme||'Reading',
 'Independently reconstruct original P38 narrative framing and cause-effect reading language',
 3,
 Object.freeze([...new Set(sentences.slice(i*10,i*10+10).flatMap(x=>x.passage.grammarIds))]),
 Object.freeze(sentences.slice(i*10,i*10+10).map(x=>Object.freeze([x.line.hanzi,x.line.pinyin,x.line.english])))
])));
