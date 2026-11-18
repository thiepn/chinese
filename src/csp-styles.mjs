/** Strict-CSP inline-style normalizer.
 * The app is served with style-src 'self', so style="..." attributes in markup
 * are blocked by the browser (the attribute parses but is never applied).
 * Templates therefore declare intended inline styles as data-csp-style="...",
 * which this module applies through the CSSOM property setters that strict
 * CSP permits. Plain [style] attributes are re-applied through the same path
 * as a safety net so no visual is ever silently lost.
 */
export function parseStyleDeclarations(text){
 const out=[];
 for(const decl of String(text??'').split(';')){
  const i=decl.indexOf(':');if(i<1)continue;
  const prop=decl.slice(0,i).trim().toLowerCase();
  let val=decl.slice(i+1).trim(),priority='';
  if(/\s*!important$/i.test(val)){val=val.replace(/\s*!important$/i,'').trim();priority='important';}
  if(prop&&val)out.push({prop,val,priority});
 }
 return out;
}
function applyDeclarations(el,raw){for(const {prop,val,priority} of parseStyleDeclarations(raw)){try{el.style.setProperty(prop,val,priority)}catch{/* unknown property; skip */}}}
function normalize(root){
 if(!root||root.nodeType!==1)return;
 const targets=(root.matches?.('[data-csp-style],[style]')?[root]:[]).concat([...root.querySelectorAll('[data-csp-style],[style]')]);
 for(const el of targets){
  const declared=el.getAttribute('data-csp-style');
  if(declared){applyDeclarations(el,declared);continue;}
  const raw=el.getAttribute('style');
  if(raw&&raw.trim())applyDeclarations(el,raw);
 }
}
export function applyBlockedInlineStyles(scope){normalize(scope&&scope.nodeType===9?scope.documentElement:scope);}
export function watchBlockedInlineStyles(root){
 applyBlockedInlineStyles(root);
 const observer=new MutationObserver(batches=>{
  for(const batch of batches)for(const node of batch.addedNodes)if(node.nodeType===1)normalize(node);
 });
 observer.observe(root,{childList:true,subtree:true});
 return {disconnect:()=>observer.disconnect()};
}
