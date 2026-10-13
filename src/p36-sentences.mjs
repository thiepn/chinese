/** P36 original meaning-oriented sentence corpus.
 * 90 new contextual examples from 30 independently authored grammar patterns.
 * Nine append-only ten-line topics preserve canonical P26/P32/P35 IDs.
 * Group grammar IDs are a navigation aid; lesson-specific models remain in
 * original GRAMMAR_LESSONS rather than another duplicated grading authority.
 */
import {P36_GRAMMAR_ROWS} from './p36-course.mjs';
const sentences=P36_GRAMMAR_ROWS.flatMap(r=>Object.freeze([r[8],r[9],r[11].slice(1,4)].map(x=>Object.freeze([...x]))));
const groups=[
 ['Aspect and event boundaries','Actions','contrast completed, changed and experienced events',['g65','g66','g67','g68']],
 ['States, actions and duration','Actions','distinguish continuing states, activities and elapsed time',['g69','g70','g71']],
 ['Frequency and achieved results','Learning','express frequency and distinguish attempted from achieved outcomes',['g72','g73','g74','g75']],
 ['Comprehension and movement','Daily life','report a result and distinguish movement direction',['g75','g76','g77','g78','g79','g80']],
 ['Manner and comparison','Communication','describe how activities happen and compare accurately',['g81','g82','g83','g84']],
 ['Changing qualities and repetition','Daily life','follow trends, repeated events and expectations',['g85','g86','g87']],
 ['Adverbs, ability and obligation','Communication','express continuing situations, modals and choices',['g88','g89','g90']],
 ['Purpose, alternatives and causes','Travel','express a practical purpose, an alternative question and a cause',['g91','g92','g93']],
 ['Consequences and cumulative repair','Daily life','build conditional and explanatory sentences in context',['g88','g89','g90','g91','g92','g93','g94']]
];
export const P36_SENTENCE_TOPICS=Object.freeze(groups.map((g,i)=>Object.freeze([
 'P36 · '+g[0],g[1],g[2],2,Object.freeze(g[3]),
 Object.freeze(sentences.slice(i*10,i*10+10).map(x=>Object.freeze([...x])))
])));
