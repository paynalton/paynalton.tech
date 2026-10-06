/** Isolated PT03/PT06 sample: keep model contracts independent of catalog growth. */
export function referenceSource(source) {
 const raw=structuredClone(source), ids=new Set(['pipila','sodigital','integracion-de-sistemas','ejemplo-lectura']);
 // This sample starts monolingual even when production enables more locales.
 for(const locale of raw.settings.locales){
  locale.enabled=locale.code===raw.settings.baseLocale;
  if(!locale.enabled){delete raw.ui[locale.code];raw.editorial[locale.code]={};}
 }
 raw.entities=raw.entities.filter(e=>ids.has(e.id)).map(e=>({...e,relations:e.relations.filter(r=>ids.has(r.target))}));
 for(const locale of Object.keys(raw.editorial))raw.editorial[locale]=Object.fromEntries(Object.entries(raw.editorial[locale]).filter(([id])=>ids.has(id)));
 for(const group of Object.keys(raw.selection))raw.selection[group]=raw.selection[group].filter(id=>ids.has(id));
 raw.selection.works=['ejemplo-lectura'];raw.selection.featuredWorks=['ejemplo-lectura'];
 return raw;
}
