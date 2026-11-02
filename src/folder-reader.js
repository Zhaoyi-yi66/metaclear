function entryFile(entry){
 return new Promise((resolve,reject)=>entry.file(resolve,reject));
}

async function directoryEntries(entry){
 const reader=entry.createReader(),all=[];
 while(true){
  const batch=await new Promise((resolve,reject)=>reader.readEntries(resolve,reject));
  if(!batch.length)break;
  all.push(...batch);
 }
 return all.sort((a,b)=>a.name.localeCompare(b.name,'zh-CN',{numeric:true,sensitivity:'base'}));
}

async function walk(entry){
 if(entry.isFile){const file=await entryFile(entry);return[{file,path:(entry.fullPath||entry.name).replace(/^\/+/,''),fromFolder:(entry.fullPath||'').split('/').filter(Boolean).length>1}];}
 if(!entry.isDirectory)return[];
 const files=[];
 for(const child of await directoryEntries(entry))files.push(...await walk(child));
 return files;
}

export async function collectDroppedFiles(dataTransfer){
 const entries=[...(dataTransfer?.items||[])].map(item=>item.kind==='file'?item.webkitGetAsEntry?.():null).filter(Boolean);
 if(entries.length){
  entries.sort((a,b)=>a.name.localeCompare(b.name,'zh-CN',{numeric:true,sensitivity:'base'}));
  const files=[];for(const entry of entries)files.push(...await walk(entry));return files;
 }
 return[...(dataTransfer?.files||[])].map(file=>({file,path:file.webkitRelativePath||file.name,fromFolder:Boolean(file.webkitRelativePath)}));
}
