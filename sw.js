const C='pc-v15',F=['./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
const clean=r=>r.redirected?r.blob().then(b=>new Response(b,{status:200,headers:r.headers})):r;
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const c=await caches.open(C);
 const r=await fetch('./',{cache:'reload'});if(!r.ok)throw new Error('page');
 const p=await clean(r);await c.put('./',p.clone());await c.put('./index.html',p.clone());
 for(const u of F){try{const x=await fetch(u,{cache:'reload'});if(x.ok)await c.put(u,x)}catch(_){}}
 await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
 if(q.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match('./');
  const net=fetch(q).then(async r=>{if(r.ok)await c.put('./',await clean(r.clone()));return r}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||new Response('offline',{status:503})})());return}
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(n=>{const k=n.clone();caches.open(C).then(x=>x.put(q,k));return n})))});
