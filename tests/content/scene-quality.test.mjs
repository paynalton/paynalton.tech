import test from 'node:test';
import assert from 'node:assert/strict';
import {createQualityMonitor} from '../../src/lib/site/scene-quality.mjs';
test('sustained slow active frames first reduce quality then stop the scene',()=>{
 const monitor=createQualityMonitor(),decisions=[];
 for(let t=0;t<=9000;t+=60){const d=monitor.sample(t,60);if(d!=='keep')decisions.push(d);}
 assert.deepEqual(decisions,['reduce','stop']);
});
test('normal rendering, idle and invalid samples do not degrade quality',()=>{
 const monitor=createQualityMonitor();
 for(let t=0;t<6000;t+=16)assert.equal(monitor.sample(t,16),'keep');
 monitor.reset();assert.equal(monitor.sample(200000,16),'keep');assert.equal(monitor.sample(NaN,80),'keep');assert.equal(monitor.sample(200010,-1),'keep');
});
test('a healthy window interrupts consecutive slow windows',()=>{
 const monitor=createQualityMonitor();let reduced=false;
 for(let t=0;t<9000;t+=50){const interval=t<2100||t>6300?60:16;if(monitor.sample(t,interval)!=='keep')reduced=true;}
 assert.equal(reduced,false);
});
