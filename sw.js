const C='mockfeed-v7';
const A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.open(C).then(async c=>{
    const r=await c.match(e.request,{ignoreSearch:true});
    const n=fetch(e.request,{cache:'no-cache'}).then(x=>{if(x.ok)c.put(e.request,x.clone());return x}).catch(()=>r);
    return r||n;
  }));
});
