import {stripMetadata,listMetadata,sniffFormat} from 'metadata-remover';
export {listMetadata,sniffFormat};
export function cleanBytes(bytes){
 const result=stripMetadata(bytes);
 if(listMetadata(result.cleaned).length) throw new Error('输出校验未通过：仍检测到支持的元数据。');
 return result;
}
export function outputName(name,format,anonymous=false){const base=anonymous?crypto.randomUUID().slice(0,12):name.replace(/\.[^.]+$/,'');return `${base}-clean.${format==='jpeg'?'jpg':format}`;}
