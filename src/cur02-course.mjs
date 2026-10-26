import {DEMO_LESSONS,allowedDemoLesson} from './demo-lessons.mjs';
/** CEFR level mapping is editorial evidence, never derived from HSK, phase or character position. */
export const CUR02_LEVELS=Object.freeze(['A1','A2','B1','B2','C1','C2']);
export function chineseCourseCatalog(lessons=DEMO_LESSONS,approvedMapping=new Map()){
 const seen=new Set();
 const groups=Object.fromEntries(CUR02_LEVELS.map(level=>[level,[]]));
 const unmapped=[];
 for(const lesson of lessons){
  if(!allowedDemoLesson(lesson))throw Error('CUR02_INVALID_OR_UNOWNED_LESSON');
  if(seen.has(lesson.id))throw Error('CUR02_DUPLICATE_ID:'+lesson.id);
  seen.add(lesson.id);
  const mapped=approvedMapping.get(lesson.id);
  if(mapped!==undefined){
   if(!mapped||!CUR02_LEVELS.includes(mapped.level)||mapped.sourceId!==lesson.id||
     mapped.sourceStatus!=='independently-reviewed-cefr')
    throw Error('CUR02_UNVERIFIED_LEVEL:'+lesson.id);
   groups[mapped.level].push(lesson);
  }else unmapped.push(lesson);
 }
 const levels=CUR02_LEVELS.map(level=>Object.freeze({level,availability:groups[level].length?'available':'planned',lessons:Object.freeze(groups[level])}));
 return Object.freeze({levels,unmapped:Object.freeze(unmapped),total:lessons.length});
}
export function parseChineseCourseSelection(hash){
 const match=/^#\/learn\/level\/(A1|A2|B1|B2|C1|C2|unmapped)(?:\/(\d{1,3}))?$/.exec(hash);
 if(!match)return null;
 const page=match[2]?Number(match[2]):1;
 if(!Number.isSafeInteger(page)||page<1||page>999)return null;
 return {level:match[1],page};
}
export function chineseCourseHash(level,page=1){
 if(!CUR02_LEVELS.includes(level)&&level!=='unmapped')throw Error('CUR02_UNKNOWN_LEVEL');
 if(!Number.isSafeInteger(page)||page<1||page>999)throw Error('CUR02_INVALID_PAGE');
 return '#/learn/level/'+level+(page>1?'/'+page:'');
}
