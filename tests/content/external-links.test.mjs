import {test} from 'node:test';
import assert from 'node:assert/strict';
import {markExternalLinks,isExternalLink} from '../../src/lib/site/external-links.mjs';
const site='https://paynalton.tech';
test('external links distinguish site URLs, protocols and lookalike domains',()=>{
 for(const href of ['/es/','#main','https://paynalton.tech/es/','mailto:a@example.com','tel:123','javascript:alert(1)'])assert.equal(isExternalLink(href,site),false,href);
 for(const href of ['https://example.com','//example.com','https://paynalton.tech.example.com','https://paynalton.tech@example.com'])assert.equal(isExternalLink(href,site),true,href);
});
test('static links preserve editorial HTML and attributes, are safe and idempotent',()=>{
 const before='<html lang="es"><script>const text="<a href=\'https://example.com\'>";</script><p><a href="https://example.com/?a=1&amp;b=2" rel="me opener" target="_self"><em>Texto original</em></a> <a href="/es/">Interno</a></p></html>';
 const html=markExternalLinks(before,site);
 assert.match(html,/rel="me noopener noreferrer"/);assert.match(html,/target="_blank"/);
 assert.match(html,/aria-description="Enlace externo/);assert.match(html,/<em>Texto original<\/em><span/);
 assert.ok(html.includes('<a href="/es/">Interno</a>'));
 assert.ok(html.includes('<script>const text="<a href=\'https://example.com\'>";</script>'));
 assert.ok(html.includes('https://example.com/?a=1&amp;b=2'));
 assert.equal(markExternalLinks(html,site),html);
 assert.match(markExternalLinks('<html lang="en"><a href="https://example.com">Example</a></html>',site),/External link: opens in a new tab/);
});
