export async function fingerprint(bytes){
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

export function numberedName(name,index,total){
 const width=Math.max(3,String(total).length);
 return `${String(index+1).padStart(width,'0')}-${name}`;
}

export function limitLabel(limit){
 return limit===1000000?'1 MB':`${Math.round(limit/1000)} KB`;
}
