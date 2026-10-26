import catalog from '../../data/site/amazon-book.json' with {type:'json'};
/** @returns {Array<{locale:string,formats:Array<{format:string,asin:string,stores:Array<{code:string,url:string}>}>}>} */
export function amazonEditions(locale){
 return [...catalog.editions].sort((a,b)=>Number(b.locale===locale)-Number(a.locale===locale)).map(edition=>({
  locale:edition.locale,
  formats:Object.entries(edition.asins).map(([format,asin])=>({format,asin,stores:catalog.formats[format].map(code=>({code,url:`https://www.${catalog.markets[code]}/dp/${asin}`}))})),
 }));
}
export const withdrawnBookDownloads=['es','en'].flatMap(locale=>['pdf','epub'].map(format=>({
 from:`/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-${locale}.${format}`,
 to:`/${locale}/books/cuando-la-tostadora-te-responde/`,
})));
