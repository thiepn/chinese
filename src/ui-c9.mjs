/**
 * C9-18 / Clean Modular Scholar
 * Shared visual components and route metadata. These are HTML projections only:
 * the existing app router, source IDs, action handler and local writers own state.
 * Strings passed by trusted native renderers can contain existing semantic HTML.
 */
const META=Object.freeze({
 today:{label:'Home',area:'Study',parent:'today',group:'study'},
 learn:{label:'Course',area:'Course',parent:'learn',group:'course'},
 character:{label:'Character Study',area:'Course',parent:'learn',group:'course'},
 review:{label:'Review',area:'Practice',parent:'review',group:'practice'},
 explore:{label:'Explore',area:'Discover',parent:'explore',group:'discover'},
 find:{label:'Search',area:'Discover',parent:'explore',group:'discover'},
 progress:{label:'Progress',area:'My learning',parent:'more',group:'personal'},
 settings:{label:'Settings',area:'My learning',parent:'more',group:'personal'},
 reader:{label:'Character Reading',area:'Reading',parent:'learn',group:'media'},
 stories:{label:'Reading & Stories',area:'Reading',parent:'learn',group:'media'},
 dialogues:{label:'Conversations',area:'Listening',parent:'learn',group:'media'},
 practice:{label:'Practice Lab',area:'Practice',parent:'review',group:'practice'},
 wordbook:{label:'My Wordbook',area:'Language library',parent:'learn',group:'library'},
 senses:{label:'Word Senses',area:'Language library',parent:'learn',group:'library'},
 workshop:{label:'Sentence Workshop',area:'Language library',parent:'learn',group:'library'},
 journey:{label:'Daily Journey',area:'Course',parent:'learn',group:'course'},
 ladder:{label:'Sentence Ladder',area:'Practice',parent:'review',group:'practice'},
 block:{label:'Study Blocks',area:'Practice',parent:'review',group:'practice'},
 fluency:{label:'Fluency Studio',area:'Practice',parent:'review',group:'practice'},
 pinyin:{label:'Pinyin & Sounds',area:'Pronunciation',parent:'learn',group:'sounds'},
 grammar:{label:'Grammar',area:'Language library',parent:'learn',group:'library'},
 sentences:{label:'Sentence Library',area:'Language library',parent:'learn',group:'library'},
 pathway:{label:'Learning Pathway',area:'Course',parent:'learn',group:'course'},
 advanced:{label:'Advanced Course',area:'Original Curriculum · P35–P51',parent:'learn',group:'course'},
 skills:{label:'Skill Paths',area:'Connected learning · original Mandarin',parent:'learn',group:'course'},
 writing:{label:'Writing Studio',area:'Independent writing & revision',parent:'learn',group:'course'},
 plan:{label:'Study Plan',area:'Course',parent:'learn',group:'course'}
});
export const C9_ROUTE_META=META;
export const C9_ROUTE_LABELS=Object.freeze(Object.fromEntries(
 Object.entries(META).map(([route,info])=>[route,info.label])
));
export const c9RouteInfo=route=>META[route]||META.today;
export const C9_CONTEXT_LINKS=Object.freeze({
 course:['learn','skills','advanced','writing','pathway','plan','journey'],
 practice:['review','practice','fluency','block'],
 media:['stories','dialogues','reader','pinyin'],
 library:['wordbook','grammar','sentences','senses'],
 sounds:['pinyin','stories','dialogues','review'],
 discover:['find','explore','wordbook','grammar'],
 personal:['progress','settings','plan','review']
});
const escapeAttribute=value=>String(value??'').replace(/[&<>"']/g,char=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const icon=(name)=>'<svg class="c9-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><use href="#c9-icon-'+name+'"></use></svg>';

/** One source for legacy native button shells; action ID and existing classes remain. */
export function renderC9NativeAction(name,label,classes='button primary',props=''){
 const tokens=String(classes).trim().split(/\s+/).filter(Boolean);
 if(tokens.includes('button')&&!tokens.includes('c9-button')){
  tokens.push('c9-button','c9-native-action');
  if(tokens.includes('primary'))tokens.push('c9-button--primary');
  else if(tokens.includes('dark')||tokens.includes('study'))tokens.push('c9-button--study');
  else if(tokens.includes('outline'))tokens.push('c9-button--secondary');
  else tokens.push('c9-button--quiet');
 }
 return '<button class="'+escapeAttribute(tokens.join(' '))+'" type="button" data-action="'+escapeAttribute(name)+'" '+props+'>'+label+'</button>';
}
/** Retains the original section-intro class expected by older screen styles. */
export function renderC9PageHeading(eyebrow,heading,description){
 return '<header class="section-intro c9-page-intro">'+
 '<p class="eyebrow c9-eyebrow">'+eyebrow+'</p>'+
 '<h1>'+heading+'</h1>'+
 (description?'<p class="c9-page-lede">'+description+'</p>':'')+
 '</header>';
}
export function renderC9EmptyState(heading,description,actionMarkup=''){
 return '<div class="c9-empty c9-empty-state" role="status">'+
 icon('search')+'<div><strong>'+heading+'</strong><p>'+description+'</p></div>'+
 (actionMarkup?'<div class="c9-empty-action">'+actionMarkup+'</div>':'')+
 '</div>';
}
export function renderC9NativeStatus(kind,heading,message){
 const safe=['info','success','warning','error'].includes(kind)?kind:'info';
 return '<div class="c9-native-status c9-native-status--'+safe+'" role="'+(safe==='error'?'alert':'status')+'"><strong>'+heading+'</strong>'+
 (message?'<p>'+message+'</p>':'')+'</div>';
}
/** Context-sensitive sibling navigation within the ORIGINAL route system.
 * Top-level sidebar/mobile nav already exposes the complete app; avoid a
 * second seven-item navigation strip above every teaching question.
 * Disclosure is native and keyboard accessible, without another controller. */
const C9_PINNED_CONTEXT=Object.freeze({
 course:['learn','writing','skills'],
 practice:['review','practice','fluency'],
 media:['stories','dialogues','reader'],
 library:['wordbook','grammar','sentences'],
 sounds:['pinyin','stories','dialogues'],
 discover:['find','explore','wordbook'],
 personal:['progress','settings','plan']
});
export function renderC9ContextNav(route,esc){
 if(route==='today')return '';
 const info=c9RouteInfo(route);
 const links=C9_CONTEXT_LINKS[info.group]||C9_CONTEXT_LINKS.course;
 const available=[...new Set([route,...links])];
 const preferred=C9_PINNED_CONTEXT[info.group]||C9_PINNED_CONTEXT.course;
 const primary=[route,...preferred.filter(id=>id!==route&&available.includes(id))].slice(0,3);
 const secondary=available.filter(id=>!primary.includes(id));
 const destination=id=>{
  const item=c9RouteInfo(id);
  return '<a href="#/'+id+'" class="c9-context-link'+(route===id?' is-active':'')+'"'+
   (route===id?' aria-current="page"':'')+'>'+esc(item.label)+'</a>';
 };
 return '<nav class="c9-context-bar" aria-label="Related learning destinations">'+
 '<div class="c9-context-ident"><span class="c9-eyebrow">'+esc(info.area)+'</span>'+
 '<strong>'+esc(info.label)+'</strong></div>'+
 '<div class="c9-context-links">'+primary.map(destination).join('')+'</div>'+
 (secondary.length?'<details class="c9-context-more"><summary aria-label="Show more '+esc(info.area)+' destinations">More <span aria-hidden="true">⌄</span></summary>'+
 '<div class="c9-context-more-links">'+secondary.map(destination).join('')+'</div></details>':'')+
 (route==='find'?'':'<a href="#/find" class="c9-context-search" aria-label="Find original source material">'+icon('search')+
 '<span>Find</span></a>')+'</nav>';
}


/** C9-48: a read-only playback projection of original authored source lines.
 * Delegates every play/stop action to the ONE existing app.mjs speech controller.
 * Never grades pronunciation, stores recordings or promises human-authored audio.
 */
export function renderC9ListeningDeck(clips,act,esc,{title='Listen and shadow',compact=false,showPinyin=true,showTranslations=true}={}){
 const lines=(Array.isArray(clips)?clips:[]).filter(clip=>
  clip&&typeof clip.hanzi==='string'&&clip.hanzi.trim()&&
  typeof clip.label==='string'&&clip.label.trim()).slice(0,3);
 if(!lines.length)return '';
 const button=(clip,slow)=>act('speak',slow?'Slower':'Listen',
  'c9-button c9-button--secondary c9-button--small',
  'data-text="'+esc(clip.hanzi)+'" data-rate="'+(slow?'slow':'normal')+
  '" aria-label="'+esc((slow?'Play slowly: ':'Play: ')+clip.label)+'"');
 return '<section class="c9-listening-deck'+(compact?' c9-listening-deck--compact':'')+'" aria-label="Mandarin listening practice">'+
  '<div class="c9-listening-deck-heading"><div><span class="c9-eyebrow">LISTENING FIRST · ORIGINAL SOURCE</span><h3>'+esc(title)+'</h3></div>'+
  act('speech-stop','Stop audio','c9-button c9-button--quiet c9-button--small','aria-label="Stop Chinese speech playback"')+'</div>'+
  '<div class="c9-listening-clips">'+lines.map(clip=>'<div class="c9-listening-clip">'+
   '<div class="c9-listening-clip-text"><span>'+esc(clip.label)+'</span>'+
   (!compact?'<strong lang="zh-Hans">'+esc(clip.hanzi)+'</strong>':'')+
   (!compact&&showPinyin&&clip.pinyin?'<small>'+esc(clip.pinyin)+'</small>':'')+
   (!compact&&showTranslations&&clip.english?'<small class="c9-listening-english">'+esc(clip.english)+'</small>':'')+
   '</div><div class="c9-listening-controls">'+button(clip,false)+button(clip,true)+'</div></div>').join('')+'</div>'+
  '<p class="c9-listening-limits">Uses an available Mandarin voice on your device; not a verified recording or pronunciation assessment. If no voice is installed, read the original text instead.</p></section>';
}
