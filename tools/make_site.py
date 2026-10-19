"""Build the site: runs src/build.sh, then writes index.html (with offline fonts, icons and the service worker hook), manifest.webmanifest and sw.js.
Usage: python3 tools/make_site.py"""
import re,shutil,os,hashlib,json,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=ROOT
import subprocess
subprocess.run(['bash',f'{ROOT}/src/build.sh'],check=True)
app=open(f'{ROOT}/src/fraction-worlds.html').read()
# fonts are served from the site itself so the app works offline
app=re.sub(r'<link rel="preconnect"[^>]*>\s*','',app)
app=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\s*','',app)
assert 'googleapis' not in app
ver=hashlib.sha1(app.encode()).hexdigest()[:10]
ff=''
for fn,fam,st,w in [('lexend-latin-400-normal.woff2','Lexend','normal',400),('lexend-latin-600-normal.woff2','Lexend','normal',600),('fraunces-latin-600-normal.woff2','Fraunces','normal',600),('fraunces-latin-500-italic.woff2','Fraunces','italic',500)]:
    ff+=f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:swap;src:url(fonts/{fn}) format("woff2")}}\n'
head=f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#1d1840">
<meta name="description" content="Maths Worlds: comprehension-first maths adventures.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Maths Worlds">
<style>
{ff}html{{-webkit-text-size-adjust:100%;touch-action:manipulation;overscroll-behavior:none}}
body{{padding-top:max(10px,env(safe-area-inset-top));padding-bottom:max(8px,env(safe-area-inset-bottom));padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right));-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}}
</style>
'''
tail=f'''
<script>
/* offline: a service worker keeps a copy of the app on the tablet */
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{{}}));
</script>
'''
html=head+app.replace('<title>Maths Worlds</title>','<title>Maths Worlds</title>\n</head>\n<body>',1)
assert '</head>' in html
html=html.rstrip()+tail+'</body>\n</html>\n'
open(f'{OUT}/index.html','w').write(html)
open(f'{OUT}/manifest.webmanifest','w').write(json.dumps({"name":"Maths Worlds","short_name":"Maths Worlds","description":"Comprehension-first maths adventures.","start_url":"./","scope":"./","display":"fullscreen","orientation":"any","background_color":"#1d1840","theme_color":"#1d1840",
  "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},indent=2))
files=['./','index.html','manifest.webmanifest']+[f'icons/{p}' for p in sorted(os.listdir(f'{OUT}/icons')) if p.endswith('.png')]+[f'fonts/{f}' for f in sorted(os.listdir(f'{OUT}/fonts')) if f.endswith('woff2')]
open(f'{OUT}/sw.js','w').write(f'''/* Maths Worlds offline cache. VERSION changes with every update, so the tablet picks up new versions. */
const VERSION='mw-{ver}';
const FILES={json.dumps(files)};
self.addEventListener('install',e=>{{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))}});
self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))}});
self.addEventListener('fetch',e=>{{const r=e.request;if(r.method!=='GET')return;
  /* the app page: try the network first (to get updates), fall back to the saved copy offline */
  if(r.mode==='navigate'){{e.respondWith(fetch(r).then(res=>{{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}}).catch(()=>caches.match('index.html')));return}}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r)))}});
''')
open(f'{OUT}/.nojekyll','w').write('')
print('version',ver)
