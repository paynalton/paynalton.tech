export const readingKey='paynalton-reading-v1';
export function readingPreferences(value){return {size:['normal','large','larger'].includes(value?.size)?value.size:'normal',surface:value?.surface==='dark'?'dark':'paper'};}
