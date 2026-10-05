import {defineMiddleware} from 'astro:middleware';
import {markExternalLinks} from '../lib/site/external-links.mjs';

export const onRequest=defineMiddleware(async(context,next)=>{
 const response=await next();
 if(!response.headers.get('content-type')?.includes('text/html'))return response;
 const html=markExternalLinks(await response.text(),context.site?.href??'https://paynalton.tech');
 const headers=new Headers(response.headers);headers.delete('content-length');
 return new Response(html,{status:response.status,statusText:response.statusText,headers});
});
