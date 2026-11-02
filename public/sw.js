const CACHE='metaclear-v3';
const CORE=['/','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png'];

self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 const response=await fetch('/',{cache:'reload'});
 const html=await response.clone().text();
 await cache.put('/',response);
 const paths=[...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)].map(match=>match[1]);
 await cache.addAll([...new Set([...CORE.slice(1),...paths])]);
 await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
 event.respondWith((async()=>{
  const cached=await caches.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone());}return response;}
  catch(error){if(event.request.mode==='navigate')return caches.match('/');throw error;}
 })());
});
