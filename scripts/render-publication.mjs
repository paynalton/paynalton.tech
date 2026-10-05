import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const ui=JSON.parse(await readFile('src/data/site/ui/es.json','utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const glyph='<path d="M5 43V23h15V8h23v18H28v17H5Zm8-8h7V23h15v-7h-7v15H13" fill="none" stroke="#c58b60" stroke-width="3"/>';
const icon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="6" fill="#1c2523"/>${glyph}</svg>`;
await mkdir('public/taller/publication',{recursive:true});await writeFile('public/favicon.svg',icon+'\n');
const font=await readFile('src/assets/taller/fonts/fraunces-latin.woff2'),sans=await readFile('src/assets/taller/fonts/manrope-latin.woff2'),art=await readFile('public/taller/workshop/movil-800.webp');
const html=`<!doctype html><html lang="es"><meta charset="utf-8"><style>@font-face{font-family:Editorial;src:url(data:font/woff2;base64,${font.toString('base64')})}@font-face{font-family:UI;src:url(data:font/woff2;base64,${sans.toString('base64')})}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#101918;color:#f1eee4;border:24px solid #1c2523;padding:46px;font-family:UI}svg{width:65px;height:65px}h1{margin:24px 0 26px;font:500 82px/1 Editorial;letter-spacing:-2px;position:relative}p{position:relative;max-width:590px;margin:0;font:400 43px/1.28 Editorial}small{position:absolute;left:70px;bottom:70px;color:#c58b60;font-size:23px;letter-spacing:2px}.art{position:absolute;right:32px;top:105px;width:445px;height:445px;object-fit:contain;opacity:.85}.rule{position:absolute;bottom:120px;left:70px;width:170px;border-top:2px solid #c58b60}</style><img class="art" src="data:image/webp;base64,${art.toString('base64')}" alt=""><svg viewBox="0 0 48 48">${glyph}</svg><h1>${escape(ui['brand.name'])}</h1><p>${escape(ui['publication.socialDescriptor'])}</p><div class="rule"></div><small>paynalton.tech</small></html>`;
await writeFile('ai_reference/implementacion/PT11/social-preview.html',html);
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE??'/usr/bin/google-chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});await page.setContent(html);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'public/taller/publication/social-es.png'});
 const images=[];
 for(const size of [16,32,180]){
  await page.setViewportSize({width:size,height:size});await page.setContent(`<style>html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}</style>${icon}`);
  const png=await page.screenshot();if(size===180)await writeFile('public/apple-touch-icon.png',png);else images.push({size,png});
 }
 const header=Buffer.alloc(6+16*images.length);header.writeUInt16LE(1,2);header.writeUInt16LE(images.length,4);let offset=header.length;
 for(const [i,{size,png}] of images.entries()){const at=6+i*16;header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(png.length,at+8);header.writeUInt32LE(offset,at+12);offset+=png.length;}
 await writeFile('public/favicon.ico',Buffer.concat([header,...images.map(i=>i.png)]));
}finally{await browser.close();}
console.log('PUB-01 1200×630; PUB-02 SVG, ICO 16/32 y PNG 180, derivados de la identidad local.');
