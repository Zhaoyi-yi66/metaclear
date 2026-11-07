import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_PREFERENCES,loadPreferences,normalizePreferences,savePreferences} from '../src/preferences.js';

function memoryStorage(initial=null){let value=initial;return {getItem:()=>value,setItem:(_,next)=>{value=next;},value:()=>value};}

test('首次打开使用安全默认设置',()=>{
 assert.deepEqual(loadPreferences(memoryStorage()),DEFAULT_PREFERENCES);
});

test('记住上次选择的导出设置',()=>{
 const storage=memoryStorage();
 assert.equal(savePreferences(storage,{limit:'1000000',format:'webp',quality:82,anonymous:false,overwrite:true}),true);
 assert.deepEqual(loadPreferences(storage),{limit:'1000000',format:'webp',quality:82,anonymous:false,overwrite:true});
});

test('无效或冲突设置会回到有效范围',()=>{
 assert.deepEqual(normalizePreferences({limit:'bad',format:'gif',quality:200,anonymous:true,overwrite:true}),{limit:'500000',format:'original',quality:100,anonymous:false,overwrite:true});
});
