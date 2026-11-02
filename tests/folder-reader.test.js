import test from 'node:test';
import assert from 'node:assert/strict';
import {collectDroppedFiles} from '../src/folder-reader.js';

const fileEntry=(name,path)=>({name,fullPath:path,isFile:true,isDirectory:false,file:resolve=>resolve({name})});
const directory=(name,path,children)=>({name,fullPath:path,isFile:false,isDirectory:true,createReader(){let read=false;return{readEntries(resolve){resolve(read?[]:(read=true,children));}};}});

test('拖入文件夹会递归读取并按名称自然排序',async()=>{
 const root=directory('旅行照片','/旅行照片',[
  fileEntry('10.png','/旅行照片/10.png'),
  directory('第一天','/旅行照片/第一天',[fileEntry('2.jpg','/旅行照片/第一天/2.jpg'),fileEntry('1.jpg','/旅行照片/第一天/1.jpg')]),
  fileEntry('2.png','/旅行照片/2.png')
 ]);
 const result=await collectDroppedFiles({items:[{kind:'file',webkitGetAsEntry:()=>root}]});
 assert.deepEqual(result.map(item=>item.path),['旅行照片/2.png','旅行照片/10.png','旅行照片/第一天/1.jpg','旅行照片/第一天/2.jpg']);
 assert.ok(result.every(item=>item.fromFolder));
});

test('普通文件拖入保持原顺序',async()=>{
 const result=await collectDroppedFiles({files:[{name:'b.png'},{name:'a.png'}]});
 assert.deepEqual(result.map(item=>item.path),['b.png','a.png']);
});
