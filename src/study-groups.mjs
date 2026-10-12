/** Shared static demonstration unit ranges; independent of syllabus editions. */
import {DEMO_LESSONS} from './demo-lessons.mjs';
export function lessonGroups(){return [{name:'Foundations',range:[1,13]},{name:'Everyday Language',range:[14,26]},{name:'People & Place',range:[27,40]},{name:'Time & Communication',range:[41,52]},{name:'Travel & Essentials',range:[53,64]},{name:'Work & Culture',range:[65,74]}].map((g,i)=>({...g,index:i+1,lessons:DEMO_LESSONS.filter(l=>l.order>=g.range[0]&&l.order<=g.range[1])}));}
