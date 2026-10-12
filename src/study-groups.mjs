/** Shared static demonstration unit ranges; independent of syllabus editions. */
import {DEMO_LESSONS} from './demo-lessons.mjs';
export function lessonGroups(){return [{name:'Foundations',range:[1,13]},{name:'Everyday Language',range:[14,26]},{name:'People & Place',range:[27,40]},{name:'Time & Communication',range:[41,52]},{name:'Travel & Essentials',range:[53,64]},{name:'Work & Culture',range:[65,74]},
 {name:'People & Conversation',range:[75,84]},
 {name:'Politeness & Actions',range:[85,94]},
 {name:'Connecting Ideas',range:[95,104]},
 {name:'Counting & Quantities',range:[105,114]},
 {name:'Prices & Position',range:[115,124]},
 {name:'Food, Weather & Routines',range:[125,134]},
 {name:'Communication & Everyday Life',range:[135,144]}].map((g,i)=>({...g,index:i+1,lessons:DEMO_LESSONS.filter(l=>l.order>=g.range[0]&&l.order<=g.range[1])}));}
