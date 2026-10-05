import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/design', workers:1, timeout:45000,
 outputDir:'./test-results/design',
 reporter:[['list'],['json',{outputFile:'test-results/design-report.json'}]],
 use:{baseURL:'http://127.0.0.1:4322',reducedMotion:'reduce',launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844}}},{name:'small',use:{viewport:{width:320,height:800}}}],
 webServer:{command:'npm run preview:design -- --host 127.0.0.1 --port 4322 --ignore-lock',url:'http://127.0.0.1:4322/design-review/home/',reuseExistingServer:false},
});
