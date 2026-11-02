import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {archiveDownloadName,archiveEntryPath,commonRoot,fingerprint,limitLabel,numberedName,originalName,safeRelativePath,uniqueName} from '../src/file-utils.js';

if(!globalThis.crypto)globalThis.crypto=webcrypto;

test('相同内容生成相同指纹，不同内容不会误判',async()=>{
 assert.equal(await fingerprint(new Uint8Array([1,2,3])),await fingerprint(new Uint8Array([1,2,3])));
 assert.notEqual(await fingerprint(new Uint8Array([1,2,3])),await fingerprint(new Uint8Array([1,2,4])));
});

test('输出文件按当前列表位置连续编号',()=>{
 assert.equal(numberedName('photo-clean.jpg',0,12),'001-photo-clean.jpg');
 assert.equal(numberedName('photo-clean.jpg',11,12),'012-photo-clean.jpg');
 assert.equal(numberedName('photo-clean.jpg',999,1000),'1000-photo-clean.jpg');
});

test('覆盖模式保留主体名称并使用真实格式',()=>{
 assert.equal(originalName('旅行照片.png','jpeg'),'旅行照片.jpg');
 assert.equal(originalName('照片.jpeg','png'),'照片.png');
});

test('同名输出不会在压缩包中相互覆盖',()=>{
 const used=new Set;
 assert.equal(uniqueName('照片.jpg',used),'照片.jpg');
 assert.equal(uniqueName('照片.jpg',used),'照片-2.jpg');
 assert.equal(uniqueName('照片.jpg',used),'照片-3.jpg');
});

test('压缩档位标签清晰',()=>{
 assert.equal(limitLabel(200000),'200 KB');
 assert.equal(limitLabel(500000),'500 KB');
 assert.equal(limitLabel(1000000),'1 MB');
});

test('文件夹输出保留层级并增加 clean 后缀',()=>{
 const paths=['旅行照片/第一天/1.jpg','旅行照片/第二天/2.jpg'];
 assert.equal(commonRoot(paths),'旅行照片');
 assert.equal(archiveDownloadName('旅行照片'),'旅行照片-clean.zip');
 assert.equal(archiveEntryPath(paths[0],'001-1-clean.jpg','旅行照片'),'旅行照片-clean/第一天/001-1-clean.jpg');
});

test('混合根目录使用通用中文压缩包名并清理危险路径',()=>{
 assert.equal(commonRoot(['甲/1.jpg','乙/2.jpg']),null);
 assert.equal(archiveDownloadName(null),'净图-已清除图片.zip');
 assert.equal(safeRelativePath('../甲/./1.jpg'),'甲/1.jpg');
});
