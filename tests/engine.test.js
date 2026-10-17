import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanBytes,listMetadata,sniffFormat,outputName} from '../src/engine.js';
import {writeFileSync,mkdirSync} from 'node:fs';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==','base64');
function crc32(b){let c=0xffffffff;for(const n of b){c^=n;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(type,data){const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4);b.set(data,8);b.writeUInt32BE(crc32(b.subarray(4,-4)),b.length-4);return b;}
const fixture=Buffer.concat([png.subarray(0,33),chunk('tEXt',Buffer.from('Author\0Privacy Test')),chunk('iTXt',Buffer.from('XML:com.adobe.xmp\0\0\0\0\0<xmp>GPS secret</xmp>')),png.subarray(33)]);
mkdirSync('tests/fixtures',{recursive:true});writeFileSync('tests/fixtures/metadata.png',fixture);
test('PNG text and XMP removed while original pixel data stays identical',()=>{assert.equal(sniffFormat(fixture),'png');assert.equal(listMetadata(fixture).length,2);const out=cleanBytes(fixture);assert.equal(listMetadata(out.cleaned).length,0);assert.deepEqual(Buffer.from(out.cleaned),png);});
test('cleaning clean files is idempotent',()=>assert.deepEqual(Buffer.from(cleanBytes(png).cleaned),png));
test('JPEG EXIF and comment removed without touching scan bytes',()=>{const jpeg=Buffer.from([255,216,255,225,0,8,69,120,105,102,0,0,255,254,0,5,97,98,99,255,218,0,2,12,34,56,255,217]);assert.equal(listMetadata(jpeg).length,2);const out=cleanBytes(jpeg);assert.equal(listMetadata(out.cleaned).length,0);assert.deepEqual(Buffer.from(out.cleaned),Buffer.from([255,216,255,218,0,2,12,34,56,255,217]));});
test('WebP strips EXIF and XMP and updates RIFF size and feature flags',()=>{const riffChunk=(s,data)=>{const b=Buffer.alloc(8+data.length+(data.length%2));b.write(s);b.writeUInt32LE(data.length,4);b.set(data,8);return b;};const vp=Buffer.alloc(10);vp[0]=12;const data=Buffer.concat([riffChunk('VP8X',vp),riffChunk('EXIF',Buffer.from('private')),riffChunk('XMP ',Buffer.from('secret')),riffChunk('VP8 ',Buffer.from([1,2,3,4]))]);const header=Buffer.alloc(12);header.write('RIFF');header.writeUInt32LE(data.length+4,4);header.write('WEBP',8);const out=Buffer.from(cleanBytes(Buffer.concat([header,data])).cleaned);assert.equal(listMetadata(out).length,0);assert.equal(out.readUInt32LE(4),out.length-8);assert.equal(out[20]&12,0);assert.deepEqual(out.subarray(-4),Buffer.from([1,2,3,4]));});
test('invalid and truncated images fail instead of reporting success',()=>{assert.throws(()=>cleanBytes(Buffer.from('not image')));assert.throws(()=>cleanBytes(fixture.subarray(0,40)));});
test('safe output naming keeps extension and allows anonymity',()=>{assert.equal(outputName('照片.one.jpeg','jpeg'),'照片.one-clean.jpg');assert.match(outputName('secret.png','png',true),/^[a-f0-9-]+-clean\.png$/);});
