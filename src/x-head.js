/* ================= The Ratio Isles: Kai the chameleon, and the Smudge =================
   The Smudge has drained the colour from the isles. Kai can only change colour when paint is mixed
   in the right ratio, so every island won gives him (and the isles) a colour back. */
const PAINT={red:'#d82424',white:'#fbf6ee',yellow:'#ffd23a',blue:'#2f6fdc'};
const ISLE_COL={beads:'#ff5a6a',paint:'#ff9a3a',split:'#ffd23a',pancakes:'#5ac85a',giant:'#4aa0ff',river:'#9a6cff',smudge:'#ff9ed2'};
const KAI_GREY='#a6a6b8';
const hexRGB=h=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16))};
const rgbHex=c=>'#'+c.map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
const mixRGB=(a,b,t)=>rgbHex(hexRGB(a).map((v,k)=>lerp(v,hexRGB(b)[k],t)));
const lighter=(c,t=.45)=>mixRGB(c,'#ffffff',t),deeper=(c,t=.35)=>mixRGB(c,'#1a1030',t);
/* paint mixes like paint, not like light: a weighted geometric mean of each colour's reflectance (blue + yellow = green) */
function mixPaint(parts){const tot=parts.reduce((a,[,n])=>a+n,0);if(!tot)return null;
  return rgbHex([0,1,2].map(k=>255*Math.exp(parts.reduce((a,[c,n])=>a+n/tot*Math.log(Math.max(.03,hexRGB(c)[k]/255)),0))))}

const RAT=(a,b)=>`${a} : ${b}`;

/* Kai, side on, facing right. put(x,y), tint(colour) */
function kaiFig(parent,s=1,col=KAI_GREY){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g),P=[];
  const add=(e,role)=>{P.push([e,role]);return e};
  add(el('path',{d:'M-19,4 C-34,7 -40,-8 -31,-15 C-24,-20 -16,-13 -20,-7 C-22,-4 -27,-5 -26,-9',fill:'none','stroke-width':7,'stroke-linecap':'round'},b),'tail');
  add(el('path',{d:'M-11,9 l-5,11 M-3,10 l-1,11 M9,9 l4,11 M15,8 l7,10',fill:'none','stroke-width':4.5,'stroke-linecap':'round'},b),'legs');
  add(el('ellipse',{cx:0,cy:0,rx:22,ry:13},b),'body');
  add(el('path',{d:'M-18,-9 L-14,-15 L-10,-11 L-6,-17 L-2,-12 L2,-17 L6,-12 L10,-16 L13,-10',fill:'none','stroke-width':2.5,'stroke-linejoin':'round'},b),'crest');
  add(el('path',{d:'M12,-11 Q30,-15 39,1 Q33,10 13,10Z'},b),'body');
  [[-9,-2,3.4],[1,4,2.6],[-15,4,2.2],[6,-4,2]].forEach(([x,y,r])=>add(el('circle',{cx:x,cy:y,r},b),'spot'));
  add(el('circle',{cx:26,cy:-6,r:7.5},b),'eye');el('circle',{cx:27.5,cy:-6,r:3,fill:'#241a3a'},b);el('circle',{cx:28.5,cy:-7,r:1,fill:'#fff'},b);
  el('path',{d:'M29,4 q4,2 8,-1',fill:'none',stroke:'#3a2a3a','stroke-width':1.6,'stroke-linecap':'round'},b);
  const o={g,col,x:0,y:0,put(x,y){if(x!=null)o.x=x;if(y!=null)o.y=y;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`)},
    paint(c){o.col=c;const d=deeper(c,.3),l=lighter(c,.5);P.forEach(([e,r])=>{if(r==='tail'||r==='legs'||r==='crest')e.setAttribute('stroke',r==='crest'?l:d);else e.setAttribute('fill',r==='spot'||r==='eye'?l:c)})},
    tint(c,dur=700){const c0=o.col;if(RM||!dur){o.paint(c);return}tween(dur,t=>o.paint(mixRGB(c0,c,t)),()=>o.paint(c))}};
  o.paint(col);o.put(0,0);return o}
/* Kai as the guide beside each question box; he turns the island's colour when a round is won */
function kaiGuide(parent){const k=kaiFig(parent,.78),p0=k.put;k.put=(x,y)=>p0(x==null?x:x-14,y);k.put(170,46);return k}
function kaiWin(k,w=CUR){k.tint(ISLE_COL[w]||'#ff9ed2',900);if(!RM){burst(k.x,k.y,{n:10,spread:40,cols:[ISLE_COL[w]||'#ff9ed2','#fff0a0']});tween(500,(t,p)=>k.g.setAttribute('transform',`translate(${k.x},${(k.y-Math.sin(p*Math.PI)*12).toFixed(1)}) scale(${(1+Math.sin(p*Math.PI)*.25).toFixed(2)})`))}}

/* the rainbow at the middle of the Ratio Isles: grey until the Smudge is beaten */
function rainbowFig(parent,{bright=false}={}){const g=el('g',{},parent),bands=el('g',{},g),cols=['#ff5a6a','#ff9a3a','#ffd23a','#5ac85a','#4aa0ff','#9a6cff'];
  cols.forEach((c,i)=>{const r=96-i*11;el('path',{d:`M${-r},0 A${r},${r} 0 0 1 ${r},0`,fill:'none',stroke:bright?c:['#7a7a8c','#6c6c80','#808094','#707084','#7c7c90','#686880'][i],'stroke-width':11},bands)});
  el('ellipse',{cx:-90,cy:4,rx:26,ry:10,fill:bright?'#fff4e6':'#8a8aa0'},g);el('ellipse',{cx:90,cy:4,rx:26,ry:10,fill:bright?'#fff4e6':'#8a8aa0'},g);
  let sm=null;if(!bright){sm=smudgeFig(g,{s:.55});sm.g.setAttribute('transform','translate(0,-38) scale(.55)')}
  else{const k=kaiFig(g,.9,'#5ac85a');k.put(0,-20)}
  return{g,tick:t=>{bands.setAttribute('opacity',bright?(.85+.15*Math.sin(t*2)).toFixed(2):'.9');if(sm)sm.tick(t)}}}
/* the Smudge: a grumpy grey blob. splash(colour) puts paint back on it */
function smudgeFig(parent,{s=1}={}){const g=el('g',{},parent),body=el('g',{},g),spl=el('g',{},g),face=el('g',{},g);
  const blob='M-62,10 C-74,-20 -50,-52 -20,-50 C-6,-74 34,-70 42,-44 C70,-44 80,-10 64,10 C76,34 50,56 24,46 C6,64 -30,62 -40,44 C-66,48 -80,26 -62,10Z';
  el('path',{d:blob,fill:'#6e6e82',stroke:'#4a4a5c','stroke-width':4},body);el('path',{d:'M-40,-30 q20,-14 40,-6',stroke:'#9a9aae','stroke-width':5,fill:'none','stroke-linecap':'round',opacity:.6},body);
  const eyes=el('g',{},face);[-20,22].forEach(x=>{el('ellipse',{cx:x,cy:-6,rx:10,ry:12,fill:'#e8e8f0'},eyes);el('circle',{cx:x+2,cy:-3,r:5,fill:'#241a3a'},eyes)});
  const brow=el('path',{d:'M-32,-24 L-10,-16 M34,-24 L12,-16',stroke:'#3a3a4a','stroke-width':5,'stroke-linecap':'round'},face);
  const mouth=el('path',{d:'M-16,24 Q2,14 20,24',fill:'none',stroke:'#3a3a4a','stroke-width':5,'stroke-linecap':'round'},face);
  let n=0;const o={g,splash(c){const a=n++*1.9,x=Math.cos(a)*(28+(n%3)*10),y=Math.sin(a)*24-4,p=el('g',{transform:`translate(${x.toFixed(1)},${y.toFixed(1)})`},spl);
      el('path',{d:'M-14,0 C-16,-12 -4,-16 2,-12 C12,-16 18,-4 12,2 C16,12 4,16 -2,12 C-12,16 -18,8 -14,0Z',fill:c,opacity:.92},p);el('circle',{cx:20,cy:-10,r:4,fill:c},p);el('circle',{cx:-18,cy:12,r:3,fill:c},p);popIn(p,.2)},
    unsplash(){if(spl.lastChild){spl.lastChild.remove();n=Math.max(0,n-1)}},
    mood(m){if(m==='happy'){brow.setAttribute('d','M-32,-22 Q-20,-30 -8,-22 M34,-22 Q22,-30 10,-22');mouth.setAttribute('d','M-18,16 Q2,36 22,16')}else if(m==='oh'){mouth.setAttribute('d','M-6,22 a8,8 0 1 0 0.1,0')}else{brow.setAttribute('d','M-32,-24 L-10,-16 M34,-24 L12,-16');mouth.setAttribute('d','M-16,24 Q2,14 20,24')}},
    rainbow(){body.querySelector('path').setAttribute('fill','#f4eefa');body.querySelector('path').setAttribute('stroke','#c9a2ff');o.mood('happy')},
    tick(t){body.setAttribute('transform',`scale(${(1+Math.sin(t*2.2)*.025).toFixed(3)},${(1-Math.sin(t*2.2)*.025).toFixed(3)})`)}};
  g.setAttribute('transform',`scale(${s})`);return o}

/* a glass bead */
function bead(parent,x,y,col,r=10){const g=el('g',{transform:`translate(${x},${y})`},parent);el('circle',{r,fill:col,stroke:deeper(col,.35),'stroke-width':1.5},g);
  el('circle',{cx:-r*.35,cy:-r*.35,r:r*.3,fill:'#fff',opacity:.55},g);el('circle',{r:r*.22,fill:deeper(col,.5),opacity:.7},g);return g}
/* a cream card with a big number, used for picking answers */
function ratioCard(parent,x,y,txt,{w=104,h=56,sub=null,label,onTap}={}){const c=el('g',{transform:`translate(${x},${y})`},parent);
  el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);
  el('text',{y:sub?2:8,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418'},c).textContent=txt;
  if(sub)el('text',{y:20,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#7a5a44'},c).textContent=sub;
  interact(c,{label:label||`Card ${txt}`,tap:()=>onTap&&onTap(c)});popIn(c,.5);return c}
const pickCard=(L,c)=>[...L.children].forEach(x=>{x.style.opacity=x===c?1:.55;x.firstChild.setAttribute('stroke',x===c?'#ffc04d':'#c9a77a')});

/* ---------- scenes: a painter's attic, giant country, the grey land ---------- */
SCENE_X.studio=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2e2440'},o);
  for(let x=-660;x<1300;x+=90)el('rect',{x,y:0,width:6,height:520,fill:'#352a4c'},o);
  el('path',{d:'M-700,230 L300,12 L1300,230',fill:'none',stroke:'#3e3258','stroke-width':22},o);
  el('rect',{x:-700,y:520,width:2000,height:300,fill:'#4a3428'},o);for(let x=-680;x<1300;x+=70)el('line',{x1:x,y1:520,x2:x-40,y2:800,stroke:'#3a281e','stroke-width':3},o);
  [[-150,300,'#ff5a6a'],[700,280,'#4aa0ff'],[640,420,'#ffd23a']].forEach(([x,y,c])=>{const e=el('g',{transform:`translate(${x},${y})`,opacity:.55},o);el('rect',{x:-60,y:-80,width:120,height:150,rx:4,fill:'#e8dcc8'},e);el('circle',{cx:-10,cy:-10,r:34,fill:c,opacity:.6},e);el('path',{d:'M-40,70 L-60,230 M40,70 L60,230 M0,70 L0,230',stroke:'#6a4a32','stroke-width':6},e)});
  [[90,560,'#ff9a3a'],[520,600,'#9a6cff'],[300,640,'#5ac85a']].forEach(([x,y,c])=>el('ellipse',{cx:x,cy:y,rx:46,ry:12,fill:c,opacity:.35},o))};
SCENE_X.hills=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#241c48'},o);
  el('path',{d:'M-700,420 Q-300,300 100,400 T900,380 T1400,400 V800 H-700Z',fill:'#2e3a5c'},o);el('path',{d:'M-700,500 Q-200,430 300,500 T1300,480 V800 H-700Z',fill:'#344a5a'},o);
  const boot=el('g',{transform:'translate(-250,430)',opacity:.6},o);el('path',{d:'M-60,-260 h120 v200 q90,10 110,60 v30 h-250Z',fill:'#5a3a2a'},boot);el('rect',{x:-70,y:-280,width:140,height:30,rx:8,fill:'#6a4a32'},boot);
  for(let i=0;i<5;i++)el('line',{x1:-40,x2:40,y1:-230+i*30,y2:-230+i*30,stroke:'#3a2418','stroke-width':4},boot);
  [[760,300],[900,340],[-400,330]].forEach(([x,y])=>{el('rect',{x:x-6,y,width:12,height:60,fill:'#2a2a3a'},o);el('circle',{cx:x,cy:y-10,r:30,fill:'#2a4a3a'},o)})};
SCENE_X.grey=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2c2a36'},o);
  el('path',{d:'M-700,460 Q-200,380 300,450 T1300,430 V800 H-700Z',fill:'#3c3a46'},o);el('path',{d:'M-700,540 Q-100,480 400,540 T1300,520 V800 H-700Z',fill:'#46444f'},o);
  for(let i=0;i<9;i++){const x=-500+i*230,y=440+(i%3)*20;el('path',{d:`M${x},${y} l0,-50 M${x},${y-30} l-14,-14 M${x},${y-40} l12,-14`,stroke:'#55535e','stroke-width':4,'stroke-linecap':'round'},o)}
  for(let i=0;i<6;i++){const c=el('ellipse',{cx:-300+i*300,cy:120+(i%2)*60,rx:90,ry:28,fill:'#4a4856',opacity:.6},o);c.classList.add('mote');c.style.animationDelay=(-i*2.1)+'s'}};
AMB_X.studio=()=>{const r=Math.random();if(r<.5)noise(.25,.02,{type:'bandpass',f:1800,q:2,wet:.2});else if(r<.8)bell(noteHz(4+Math.floor(Math.random()*6)),.01,1.4,{wet:.7});else osc('sine',220,.6,.01,{to:200,wet:.5})};
AMB_X.hills=()=>{const r=Math.random();if(r<.6)noise(2.4,.035,{type:'lowpass',f:380,a:1,wet:.3});else if(r<.85)osc('sine',90,1.2,.03,{to:70,wet:.4});else bell(noteHz(2+Math.floor(Math.random()*4)),.012,2,{wet:.9})};
AMB_X.grey=()=>{const r=Math.random();if(r<.6)noise(2.6,.04,{type:'lowpass',f:300,a:1,wet:.4});else osc('sine',110,1.6,.02,{to:96,wet:.5})};
/* a big − value + stepper: easier on a phone than a dial at the edge of the screen */
function stepper(parent,{x,y,min=1,max=9,val=1,label,fmt=n=>String(n),onChange,w=200}){const g=el('g',{transform:`translate(${x},${y})`},parent);let v=val,locked=false;
  el('rect',{x:-w/2,y:-26,width:w,height:52,rx:26,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2.5},g);
  const t=el('text',{y:7,'text-anchor':'middle','font-size':18,'font-weight':700,fill:'#fff4e6'},g);
  const set=n=>{n=clamp(n,min,max);if(n===v)return;v=n;SFX.tick(v%10);t.textContent=fmt(v);onChange&&onChange(v)};
  [[-1,'−'],[1,'+']].forEach(([d,s])=>{const b=el('g',{transform:`translate(${d*(w/2-26)},0)`},g);el('circle',{r:22,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':2.5},b);
    el('text',{y:9,'text-anchor':'middle','font-size':28,'font-weight':700,fill:'#fff'},b).textContent=s;interact(b,{label:`${d>0?'More':'Fewer'}: ${label}`,tap:()=>{if(!locked)set(v+d)}})});
  const mid=el('rect',{x:-w/2+52,y:-26,width:w-104,height:52,fill:'transparent'},g);interact(mid,{label,tap:()=>{}});
  mid.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();set(v+1)}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();set(v-1)}});
  t.textContent=fmt(v);return{g,get:()=>v,set:n=>{v=n;t.textContent=fmt(v)},lock:b=>{locked=b;g.setAttribute('opacity',b?.55:1)}}}
