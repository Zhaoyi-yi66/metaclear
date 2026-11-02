import {deflateSync} from 'node:zlib';
import {writeFileSync} from 'node:fs';

const crcTable=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(data){let c=0xffffffff;for(const byte of data)c=crcTable[(c^byte)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),length=Buffer.alloc(4),crc=Buffer.alloc(4);length.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([length,name,data,crc]);}
function insideShield(x,y,size){const nx=x/size,ny=y/size;if(ny<.18||ny>.85)return false;const half=ny<.52?.29:.29*(1-(ny-.52)/.36);return Math.abs(nx-.5)<half;}
function lineDistance(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));}
for(const size of [192,512]){const raw=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++){raw[y*(size*4+1)]=0;for(let x=0;x<size;x++){const offset=y*(size*4+1)+1+x*4,nx=x/size,ny=y/size;let color=[23,111,85,255];const edge=insideShield(x,y,size)&&(!insideShield(x-size*.025,y,size)||!insideShield(x+size*.025,y,size)||!insideShield(x,y-size*.025,size)||!insideShield(x,y+size*.025,size));const check=Math.min(lineDistance(nx,ny,.34,.51,.45,.62),lineDistance(nx,ny,.45,.62,.68,.38))<.035;if(edge||check)color=[255,255,255,255];raw.set(color,offset);}}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr.set([8,6,0,0,0],8);const png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);writeFileSync(new URL(`../public/icon-${size}.png`,import.meta.url),png);}
