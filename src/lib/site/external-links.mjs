import {parse,walkSync,renderSync} from 'ultrahtml';
import labels from '../../data/site/external-link-labels.json' with {type:'json'};

export function isExternalLink(href,site){
 try{const url=new URL(href,site);return ['http:','https:'].includes(url.protocol)&&url.origin!==new URL(site).origin;}
 catch{return false;}
}

// Patch only anchors, preserving editorial text, scripts and all other HTML verbatim.
// This runs during prerendering and development, without client-side JavaScript.
export function markExternalLinks(html,site){
 const document=parse(html),edits=[];
 let locale='es';
 walkSync(document,node=>{if(node.name==='html')locale=node.attributes.lang?.split('-')[0]??locale;});
 const notice=labels[locale]??labels.es;
 walkSync(document,node=>{
  if(node.name!=='a'||!node.attributes.href||!isExternalLink(node.attributes.href,site)||node.attributes['data-external-link']!==undefined)return;
  const attributes={...node.attributes,target:'_blank',rel:[...new Set(`${node.attributes.rel??''} noopener noreferrer`.trim().split(/\s+/).filter(r=>r!=='opener'))].join(' '),'data-external-link':'true','aria-description':notice};
  const opening=renderSync({...node,attributes,children:[]}).replace(/<\/a>$/,'');
  edits.push({start:node.loc[0].start,end:node.loc[0].end,value:opening});
  edits.push({start:node.loc[1].start,end:node.loc[1].start,value:'<span class="external-link-icon" aria-hidden="true"></span>'});
 });
 for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.value+html.slice(edit.end);
 return html;
}
