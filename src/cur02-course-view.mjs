import {chineseCourseCatalog,parseChineseCourseSelection,chineseCourseHash} from './cur02-course.mjs';
const PAGE_SIZE=20;
export function renderChineseCourseLevels(state,act,esc,hash){
 const catalog=chineseCourseCatalog();
 const selection=parseChineseCourseSelection(hash)||{level:'unmapped',page:1};
 const active=catalog.levels.find(row=>row.level===selection.level)||null;
 const lessons=active?active.lessons:catalog.unmapped;
 const last=Math.max(1,Math.ceil(lessons.length/PAGE_SIZE));
 const page=Math.min(last,selection.page);
 const listed=lessons.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 const learned=new Set(state.learned||[]);
 const resume=state.courseJourney?.lessonId;
 const resumable=lessons.find(l=>l.id===resume)||lessons.find(l=>!learned.has(l.id))||lessons[0];
 const levelButtons=catalog.levels.map(row=>
  '<a href="'+chineseCourseHash(row.level)+'" class="cur02-ch-level"'+(row.level===selection.level?' aria-current="page"':'')+
  '><strong>'+row.level+'</strong><span>'+(row.availability==='planned'?'Planned':row.lessons.length+' lessons')+'</span></a>').join('');
 const unclassified='<a class="cur02-ch-unmapped" href="'+chineseCourseHash('unmapped')+'"'+(!active?' aria-current="page"':'')+
   '>Original lessons · CEFR not yet assigned ('+catalog.unmapped.length+')</a>';
 const explanation=active?
   (active.availability==='planned'?
     '<p role="status">No original lessons have an independently verified '+active.level+' CEFR mapping. Choose original lessons below to study available source material without an invented level.</p>':
     '<p>Source-reviewed '+active.level+' lessons; opening one does not confer CEFR proficiency.</p>'):
    '<p>These original demonstration lessons have no verified CEFR assignments. They remain directly accessible and do not count as official HSK or CEFR attainment.</p>';
 const rows=listed.map(lesson=>
  '<li><span class="cur02-ch-number">'+String(lesson.order).padStart(3,'0')+'</span><div>'+
  '<strong><span lang="zh-Hans">'+esc(lesson.hanzi)+'</span> · '+esc(lesson.meaning)+'</strong>'+
  '<span>'+esc(lesson.pinyin)+' · '+(learned.has(lesson.id)?'Introduced':'Not introduced')+'</span></div>'+
  act('c9-lesson-open','Open','c9-button c9-button--secondary c9-button--small','data-id="'+esc(lesson.id)+'"')+'</li>').join('');
 return '<section class="cur02-ch-course" aria-label="Six-level Chinese course">'+
  '<header><h1>Course</h1></header>'+
  '<nav class="cur02-ch-levels" aria-label="CEFR course levels">'+levelButtons+'</nav>'+
  '<div class="cur02-ch-unmapped-nav">'+unclassified+'</div>'+
  '<div class="cur02-ch-level-heading"><h2>'+(active?active.level+' lessons':'Original lessons')+'</h2>'+
  '<span>'+lessons.length+' available · '+(active?'CEFR source review required':'not assigned to a CEFR level')+'</span></div>'+
  explanation+
  (resumable?'<div class="cur02-ch-continue">'+act('c9-lesson-open',resume===resumable.id?'Resume saved course lesson':'Continue at lesson '+resumable.order,
   'c9-button c9-button--primary','data-id="'+esc(resumable.id)+'"')+'</div>':'')+
  (rows?'<ol class="cur02-ch-list">'+rows+'</ol>':(active?'<p>Original source material can be studied under <a href="'+chineseCourseHash('unmapped')+'">Original lessons</a>.</p>':'<p>No original lessons available.</p>'))+
  (lessons.length>PAGE_SIZE?'<nav class="cur02-ch-pages" aria-label="Course lesson pages">'+
    (page>1?'<a href="'+chineseCourseHash(selection.level,page-1)+'">Previous</a>':'')+
    '<span>Page '+page+' of '+last+'</span>'+
    (page<last?'<a href="'+chineseCourseHash(selection.level,page+1)+'">Next</a>':'')+'</nav>':'')+
  '</section>';
}
