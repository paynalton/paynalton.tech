/** Only active frame intervals count; idle/hidden time must reset the sample. */
export function createQualityMonitor(){
 let start=null,samples=[],slow=0,level=0;
 return {
  reset(){start=null;samples=[];},
  sample(time,interval){
   if(!Number.isFinite(time)||!Number.isFinite(interval)||interval<=0)return 'keep';
   if(start===null)start=time;
   samples.push(interval);
   if(time-start<2000)return 'keep';
   const sorted=samples.toSorted((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];
   slow=median>40?slow+1:0;start=time;samples=[];
   if(slow<2)return 'keep';slow=0;
   if(level===0){level=1;return 'reduce';}return 'stop';
  },
 };
}
