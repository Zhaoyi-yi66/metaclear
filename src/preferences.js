const KEY='metaclear.preferences.v1';

export const DEFAULT_PREFERENCES={limit:'500000',format:'original',quality:95,anonymous:false,overwrite:false};

export function normalizePreferences(value={}){
 const limit=['200000','500000','1000000','0'].includes(String(value.limit))?String(value.limit):DEFAULT_PREFERENCES.limit;
 const format=['original','png','jpeg','webp'].includes(value.format)?value.format:DEFAULT_PREFERENCES.format;
 const quality=Math.min(100,Math.max(10,Number.isFinite(Number(value.quality))?Math.round(Number(value.quality)):DEFAULT_PREFERENCES.quality));
 const overwrite=value.overwrite===true;
 return {limit,format,quality,anonymous:overwrite?false:value.anonymous===true,overwrite};
}

export function loadPreferences(storage){
 try{return normalizePreferences(JSON.parse(storage.getItem(KEY)||'{}'));}catch{return {...DEFAULT_PREFERENCES};}
}

export function savePreferences(storage,value){
 try{storage.setItem(KEY,JSON.stringify(normalizePreferences(value)));return true;}catch{return false;}
}
