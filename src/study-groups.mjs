/** Shared static demonstration unit ranges; independent of syllabus editions. */
import {DEMO_LESSONS} from './demo-lessons.mjs';
import {FOUNDATION_ADDITIONS} from './foundational-expansion.mjs';
import {P31_CHARACTER_ROWS} from './p31-foundations.mjs';
import {P35_CHARACTER_ROWS} from './p35-foundations.mjs';
import {P39_CHARACTER_ROWS} from './p39-foundations.mjs';
import {P46_CHARACTER_ROWS} from './p46-foundations.mjs';
import {P47_CHARACTER_ROWS} from './p47-foundations.mjs';
import {P50_CHARACTER_ROWS} from './p50-foundations.mjs';
import {P51_CHARACTER_ROWS} from './p51-foundations.mjs';
const ORIGINAL_GROUPS=[{name:'Foundations',range:[1,13]},{name:'Everyday Language',range:[14,26]},{name:'People & Place',range:[27,40]},{name:'Time & Communication',range:[41,52]},{name:'Travel & Essentials',range:[53,64]},{name:'Work & Culture',range:[65,74]},
 {name:'People & Conversation',range:[75,84]},
 {name:'Politeness & Actions',range:[85,94]},
 {name:'Connecting Ideas',range:[95,104]},
 {name:'Counting & Quantities',range:[105,114]},
 {name:'Prices & Position',range:[115,124]},
 {name:'Food, Weather & Routines',range:[125,134]},
 {name:'Communication & Everyday Life',range:[135,144]},
 {name:'Family & People · New Foundations',range:[145,153]},
 {name:'Places & Directions · New Foundations',range:[154,159]},
 {name:'Home & Surroundings · New Foundations',range:[160,165]},
 {name:'Seasons & Weather · New Foundations',range:[166,175]},
 {name:'Food & Meals · New Foundations',range:[176,183]},
 {name:'Useful Actions · New Foundations',range:[184,190]},
 {name:'Qualities & Comparisons · New Foundations',range:[191,202]}];

// Append the original P31/P35/P39/P46/P47/P50/P51 lesson sources without
// changing the first 20 established unit IDs or any historical lesson ID.
// Derive boundaries from the same authored modules as demo-lessons.mjs.
const ADVANCED_SECTIONS=[
 ['P31 Character Study',P31_CHARACTER_ROWS],
 ['P35 Character Study',P35_CHARACTER_ROWS],
 ['P39 Character Study',P39_CHARACTER_ROWS],
 ['P46 Advanced Character Study',P46_CHARACTER_ROWS],
 ['P47 Advanced Character Study',P47_CHARACTER_ROWS],
 ['P50 Advanced Character Study',P50_CHARACTER_ROWS],
 ['P51 Advanced Character Study',P51_CHARACTER_ROWS]
];
const ADVANCED_UNIT_SIZE=12;
export function lessonGroups(){
 const ranges=[...ORIGINAL_GROUPS];
 let first=75+FOUNDATION_ADDITIONS.length;
 for(const [name,rows] of ADVANCED_SECTIONS){
  for(let i=0;i<rows.length;i+=ADVANCED_UNIT_SIZE){
   const start=first+i;
   ranges.push({name:`${name} · Part ${Math.floor(i/ADVANCED_UNIT_SIZE)+1}`,
    range:[start,Math.min(first+rows.length-1,start+ADVANCED_UNIT_SIZE-1)]});
  }
  first+=rows.length;
 }
 return ranges.map((group,i)=>({
  ...group,index:i+1,
  lessons:DEMO_LESSONS.filter(lesson=>lesson.order>=group.range[0]&&lesson.order<=group.range[1])
 }));
}

