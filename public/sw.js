// HYPE offline support: saves the app on first visit, then opens with no internet.
const CACHE='hype-v2';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png','/hits-logo.png'];
const abs=u=>new URL(u,self.location.origin).pathname;
async function precache(){
  const c=await caches.open(CACHE);
  await c.addAll(CORE);
  // Save every JS/CSS file the page uses, plus the fonts/images inside the CSS.
  const html=await (await fetch('/index.html',{cache:'no-store'})).text();
  const files=new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m=>m[1]));
  for(const f of [...files]){
    if(f.endsWith('.css')){
      const css=await (await fetch(f)).text();
      for(const m of css.matchAll(/url\(([^)]+)\)/g)){const u=m[1].replace(/['"]/g,'');if(!u.startsWith('data:'))files.add(abs(new URL(u,self.location.origin+f)))}
    }
  }
  await Promise.all([...files].map(f=>c.add(f).catch(()=>{})));
}
self.addEventListener('install',e=>{e.waitUntil(precache().then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
  if(r.mode==='navigate'){ // newest page when online, saved page when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('/index.html',cp));return res}).catch(()=>caches.match('/index.html').then(x=>x||caches.match('/'))));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})));
});
