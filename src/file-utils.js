export async function fingerprint(bytes){
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

export function numberedName(name,index,total){
 const width=Math.max(3,String(total).length);
 return `${String(index+1).padStart(width,'0')}-${name}`;
}

export function originalName(name,format){
 const base=name.replace(/\.[^.]+$/,'');
 return `${base}.${format==='jpeg'?'jpg':format}`;
}

export function uniqueName(name,used){
 if(!used.has(name)){used.add(name);return name;}
 const match=name.match(/^(.*?)(\.[^.]+)?$/),base=match[1],extension=match[2]||'';
 let number=2,candidate;
 do candidate=`${base}-${number++}${extension}`;while(used.has(candidate));
 used.add(candidate);return candidate;
}

export function limitLabel(limit){
 return limit===1000000?'1 MB':`${Math.round(limit/1000)} KB`;
}
