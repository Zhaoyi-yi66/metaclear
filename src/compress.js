import {cleanBytes} from './engine.js';
export const LIMIT=500000;
export async function compressImage(image,createCanvas=()=>document.createElement('canvas'),limit=LIMIT){
 if(!Number.isInteger(limit)||limit<10000)throw Error('压缩大小设置无效');
 let width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
 const initial=Math.min(1,Math.sqrt(12000000/(width*height)),4096/Math.max(width,height));
 width=Math.max(1,Math.floor(width*initial));height=Math.max(1,Math.floor(height*initial));
 const canvas=createCanvas();
 try{for(let round=0;round<35;round++){
 canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('无法创建画布');ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);
 const encode=async quality=>{const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',quality));if(!blob||blob.type!=='image/jpeg')throw Error('浏览器不支持 JPG 导出');return cleanBytes(new Uint8Array(await blob.arrayBuffer())).cleaned;};
 let best=await encode(.94);if(best.length<=limit)return{bytes:best,width,height};
 best=await encode(.32);
 if(best.length<=limit){let low=.32,high=.94;for(let n=0;n<7;n++){const mid=(low+high)/2,bytes=await encode(mid);if(bytes.length<=limit){best=bytes;low=mid;}else high=mid;}return{bytes:best,width,height};}
 if(width===1&&height===1)break;width=Math.max(1,Math.floor(width*.8));height=Math.max(1,Math.floor(height*.8));
 }throw Error(`无法压缩到 ${Math.round(limit/1000)} KB，请尝试较小的原图`);}finally{canvas.width=0;canvas.height=0;}
}
