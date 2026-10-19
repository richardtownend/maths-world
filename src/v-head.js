
/* ================= The Decimal Isles: Dot the decimal point, the lighthouse and the Magpie =================
   Every decimal here is written with Dot glowing in it: wholes on Dot's left, pieces on the right.
   Numbers are kept in hundredths (whole numbers) so nothing ever goes 0.30000000004. */
const DOTC='#ffc94a';
const toH=s=>Math.round(parseFloat(String(s).replace('%',''))*100);
/* hundredths to a written decimal: 35 -> 0.35, 40 -> 0.4, 12000 -> 120 */
function fmtH(h){h=Math.round(h);const w=Math.floor(h/100),f=h%100;return f?`${w}.${String(f).padStart(2,'0').replace(/0$/,'')}`:String(w)}
function dotSpark(parent,x,y,r=5){const g=el('g',{transform:`translate(${x},${y})`,class:'dotsp'},parent);el('circle',{r:r*2.4,fill:DOTC,opacity:.22},g);el('circle',{r,fill:'#fff6c8',stroke:DOTC,'stroke-width':r*.45},g);return g}
/* Dot himself: a little glowing spark with a face */
function dotChar(parent,x,y,r=13){const g=el('g',{},parent),inner=el('g',{class:'bob'},g);
  el('circle',{r:r*2.3,fill:DOTC,opacity:.18},inner);el('circle',{r:r*1.5,fill:DOTC,opacity:.2},inner);
  el('circle',{r,fill:'#ffe48a',stroke:'#fff6c8','stroke-width':r*.18},inner);
  [-1,1].forEach(s=>{el('circle',{cx:s*r*.34,cy:-r*.12,r:r*.2,fill:'#3a2418'},inner);el('circle',{cx:s*r*.34-r*.06,cy:-r*.18,r:r*.07,fill:'#fff'},inner)});
  const mouth=el('path',{d:`M${-r*.3},${r*.26} q${r*.3},${r*.3} ${r*.6},0`,stroke:'#3a2418','stroke-width':r*.12,fill:'none','stroke-linecap':'round'},inner);
  const o={g,x,y,put(nx,ny){o.x=nx;o.y=ny;g.setAttribute('transform',`translate(${nx.toFixed(1)},${ny.toFixed(1)})`)},
    fly(nx,ny,dur=600,done,arc=40){const x0=o.x,y0=o.y;tween(dur,(t,p)=>o.put(lerp(x0,nx,t),lerp(y0,ny,t)-Math.sin(p*Math.PI)*arc),done,ease.inOut)},
    mood(m){mouth.setAttribute('d',m==='oh'?`M${-r*.12},${r*.32} a${r*.12},${r*.12} 0 1 0 ${r*.24},0 a${r*.12},${r*.12} 0 1 0 ${-r*.24},0`:m==='happy'?`M${-r*.38},${r*.18} q${r*.38},${r*.5} ${r*.76},0`:`M${-r*.3},${r*.26} q${r*.3},${r*.3} ${r*.6},0`)}};
  o.put(x,y);return o}
/* a big written decimal with Dot glowing in it. Returns the centre x of each character, for captions */
function decNum(parent,x,y,str,{sz=40,col='#fff4e6',anchor='middle',ghost=[]}={}){const g=el('g',{},parent),cw=sz*.6,dw=sz*.44;let w=0;
  const items=[...String(str)].map((ch,i)=>{const iw=ch==='.'?dw:cw,it={ch,x:w,iw,i};w+=iw;return it});
  const x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
  items.forEach(it=>{const cx=x0+it.x+it.iw/2;it.cx=cx;if(it.ch==='.')dotSpark(g,cx,y+sz*.35-sz*.09,sz*.1);
    else el('text',{x:cx,y:y+sz*.35,'text-anchor':'middle','font-size':sz,'font-weight':700,fill:ghost.includes(it.i)?DOTC:col,opacity:ghost.includes(it.i)?.75:1},g).textContent=it.ch});
  return{g,w,items,x0}}
/* small text with a gold Dot, for labels on rulers and shells */
function decTxt(parent,x,y,str,{sz=14,col='#fff4e6',anchor='middle',weight=600}={}){const t=el('text',{x,y,'text-anchor':anchor,'font-size':sz,'font-weight':weight,fill:col},parent);
  String(str).split(/(\.)/).forEach(s=>{const sp=el('tspan',s==='.'?{class:'dotch'}:{},t);sp.textContent=s});return t}
/* a little hundred square picture: n of 100 shaded, filled in rows of ten */
function hundredPic(parent,x,y,cs,n,{col='#ffc04d',off='rgba(255,244,230,.14)'}={}){const g=el('g',{},parent);
  el('rect',{x:x-3,y:y-3,width:cs*10+6,height:cs*10+6,rx:4,fill:'#2a2245'},g);
  for(let k=0;k<100;k++)el('rect',{x:x+(k%10)*cs+.6,y:y+Math.floor(k/10)*cs+.6,width:cs-1.2,height:cs-1.2,rx:cs*.2,fill:k<n?col:off},g);return g}
/* a lever in a slot: drag the knob up for more. Shows its own value */
function lever(parent,{x,y0,y1,n,label,cap,fmt=v=>v,col='#ffc04d',onChange}){const g=el('g',{},parent),step=(y0-y1)/n;let v=0,locked=false;
  el('rect',{x:x-9,y:y1-14,width:18,height:y0-y1+28,rx:9,fill:'#1d1638',stroke:'rgba(255,244,230,.3)','stroke-width':1.5},g);
  for(let k=0;k<=n;k++)el('line',{x1:x-17,x2:x-11,y1:y0-k*step,y2:y0-k*step,stroke:'rgba(255,244,230,.4)','stroke-width':1.5},g);
  const capT=el('text',{x,y:y1-24,'text-anchor':'middle','font-size':12.5,'font-weight':700,fill:'#fff4e6'},g);capT.textContent=cap||'';
  const kn=el('g',{},g);el('rect',{x:-24,y:-13,width:48,height:26,rx:10,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},kn);el('rect',{x:-16,y:-3,width:32,height:6,rx:3,fill:col,opacity:.9},kn);
  const vt=el('text',{x:x+34,y:0,'font-size':15,'font-weight':700,fill:'#fff0a0'},g);
  const show=()=>{const y=y0-v*step;kn.setAttribute('transform',`translate(${x},${y})`);vt.setAttribute('y',y+5);vt.textContent=fmt(v)};
  const set=k=>{k=clamp(k,0,n);if(k===v)return;v=k;SFX.tick(k);show();onChange&&onChange(v)};
  const hit=el('rect',{x:x-30,y:y1-20,width:60,height:y0-y1+40,fill:'transparent'},g);
  interact(g,{label,down:()=>({}),move:p=>{if(!locked)set(Math.round((y0-p.y)/step))},tap:p=>{if(locked)return;if(!p){set(v+1>n?0:v+1);return}set(Math.round((y0-p.y)/step))}});
  g.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowUp'){e.preventDefault();set(v+1)}if(e.key==='ArrowDown'){e.preventDefault();set(v-1)}});
  show();return{g,get:()=>v,set:k=>{v=clamp(k,0,n);show()},lock:b=>{locked=b;g.style.opacity=b?.6:1}}}
/* the question box, with Dot hovering just to its left */
function decQ(parent,parts,done=false,dot=null){const g=starterQ(parent,parts,done);if(dot){try{const b=g.getBBox();dot.put(Math.max(26,b.x-26),44)}catch(e){}}return g}
/* the decimal world's own Go button: same as the starter one */
const decGo=goStone;

/* ---------- the lighthouse, the Magpie ---------- */
function magpieFig(parent,s=1){const g=el('g',{transform:`scale(${s})`},parent),b=el('g',{},g);
  el('path',{d:'M16,4 L74,26 L68,36 L12,14Z',fill:'#24506e'},b);el('path',{d:'M20,8 L70,29',stroke:'#58c0d8','stroke-width':2.4,opacity:.55},b);
  el('path',{d:'M-6,20 l-3,16 M4,20 l2,16',stroke:'#4a4058','stroke-width':3,'stroke-linecap':'round'},b);el('path',{d:'M-14,36 h10 M0,36 h10',stroke:'#4a4058','stroke-width':2.4,'stroke-linecap':'round'},b);
  el('ellipse',{cx:0,cy:4,rx:28,ry:19,fill:'#1c1830'},b);el('ellipse',{cx:-7,cy:11,rx:16,ry:10,fill:'#f4f0fa'},b);
  const wing=el('g',{},b);el('path',{d:'M-4,-6 Q22,-13 31,7 Q12,10 -4,4Z',fill:'#262042'},wing);el('path',{d:'M3,-3 Q16,-6 23,3 Q10,4 3,1Z',fill:'#f4f0fa',opacity:.92},wing);el('path',{d:'M8,4 Q20,4 30,7',stroke:'#58c0d8','stroke-width':1.6,opacity:.6,fill:'none'},wing);
  const head=el('g',{transform:'translate(-25,-14)'},b);el('circle',{r:14,fill:'#1c1830'},head);
  el('circle',{cx:-4,cy:-3,r:4.4,fill:'#fff'},head);el('circle',{cx:-5,cy:-3,r:2.3,fill:'#120c20'},head);el('circle',{cx:-5.7,cy:-3.9,r:.9,fill:'#fff'},head);
  const beak=el('path',{d:'M-11,1 L-29,5 L-11,9Z',fill:'#5a5468'},head);
  return{g,b,head,wing,beak}}
function lighthouseBody(g,{lit=false,s=1}){
  const hw=y=>16+(y+96)/136*10;
  el('path',{d:`M${-hw(40)},40 L${-hw(-96)},-96 L${hw(-96)},-96 L${hw(40)},40Z`,fill:'#f4ecf8'},g);
  [[-74,-56],[-30,-10],[16,36]].forEach(([a,b])=>el('path',{d:`M${-hw(b)},${b} L${-hw(a)},${a} L${hw(a)},${a} L${hw(b)},${b}Z`,fill:'#e0506a'},g));
  el('path',{d:`M${-hw(40)},40 L${-hw(-96)},-96 L${-hw(-96)+6},-96 L${-hw(40)+8},40Z`,fill:'#fff',opacity:.35},g);
  el('path',{d:'M-7,40 v-16 a7,7 0 0 1 14,0 v16Z',fill:'#4a3a62'},g);el('rect',{x:-4,y:-40,width:8,height:10,rx:2,fill:'#4a3a62'},g);
  el('rect',{x:-25,y:-102,width:50,height:7,rx:3,fill:'#3a3058'},g);for(let k=-3;k<=3;k++)el('rect',{x:k*7-1,y:-110,width:2,height:9,fill:'#3a3058'},g);el('rect',{x:-24,y:-112,width:48,height:3,rx:1.5,fill:'#3a3058'},g);
  el('rect',{x:-15,y:-130,width:30,height:28,rx:4,fill:lit?'#fff3b0':'#2e2850',stroke:'#3a3058','stroke-width':3},g);
  if(lit){el('circle',{cx:0,cy:-116,r:26,fill:'#fff0a0',opacity:.35,filter:'url(#glow)'},g);dotSpark(g,0,-116,6)}
  el('path',{d:'M-21,-130 L0,-152 L21,-130Z',fill:'#e0506a'},g);el('circle',{cx:0,cy:-154,r:3.5,fill:'#3a3058'},g)}
function lighthouseFig(parent,{lit=false}={}){const g=el('g',{},parent),beam=el('g',{},g);
  if(lit)[0,1].forEach(k=>el('path',{d:'M0,-116 L300,-160 L300,-72Z',fill:'#fff0a0',opacity:.2,transform:`rotate(${k*180} 0 -116)`},beam));
  el('ellipse',{cx:0,cy:44,rx:58,ry:14,fill:'#3a3058'},g);el('path',{d:'M-56,44 Q-40,24 -10,30 Q20,20 56,44Z',fill:'#4a4070'},g);
  lighthouseBody(g,{lit});
  let mp=null;if(!lit){mp=magpieFig(el('g',{transform:'translate(6,-170)'},g),.75);dotSpark(mp.head,-30,5,4)}
  return{g,tick:t=>{if(lit)beam.setAttribute('transform',`rotate(${(t*30%360).toFixed(1)} 0 -116)`);if(mp)mp.head.setAttribute('transform',`translate(-25,-14) rotate(${(Math.sin(t*1.7)*10).toFixed(1)})`)}}}
function lighthouseFar(o,x,y,s){const lit=PL&&isCleared('magpie'),g=el('g',{transform:`translate(${x},${y}) scale(${s})`},o);
  el('path',{d:'M-70,46 Q-50,10 -10,20 Q30,6 70,46Z',fill:'#241d44'},g);lighthouseBody(g,{lit});g.setAttribute('opacity',.85);
  if(lit)el('path',{d:'M0,-116 L-420,-170 L-420,-60Z',fill:'#fff0a0',opacity:.12,class:'flicker'},g);return g}

/* ---------- scenes: the harbour, the beach, the top of the lighthouse ---------- */
function seaWater(o,y0,{refl=true,col='#152150'}={}){
  el('rect',{x:-700,y:y0,width:2000,height:900,fill:col},o);el('rect',{x:-700,y:y0,width:2000,height:3,fill:'#3a4a8a',opacity:.8},o);
  if(refl)for(let k=0;k<8;k++)el('ellipse',{cx:562+((k*37)%20-10),cy:y0+10+k*16,rx:38-k*3.5,ry:2.4,fill:'#ffe9c4',opacity:(.32-k*.03).toFixed(2),class:'flicker'},o);
  for(let i=0;i<46;i++){const x=-400+((i*157)%1400),y=y0+12+((i*61)%300);el('path',{d:`M${x},${y} q8,-4 16,0 t16,0`,stroke:'#5a72b8','stroke-width':1.4,fill:'none',opacity:.45},o)}}
SCENE_X.sea=o=>{seaWater(o,300);lighthouseFar(o,40,262,.55);
  [[130,330],[470,380],[300,420]].forEach(([x,y],k)=>{const b=el('g',{transform:`translate(${x},${y})`,class:'mote'},o);b.style.animationDelay=(-k*3)+'s';el('path',{d:'M-10,0 h20 l-4,8 h-12Z',fill:'#e0506a',opacity:.5},b);el('path',{d:'M0,0 v-14',stroke:'#cfc6ff','stroke-width':1.4,opacity:.5},b)})};
SCENE_X.door=o=>{seaWater(o,300)};
SCENE_X.beach=o=>{seaWater(o,226);
  el('path',{d:'M-700,296 C-400,286 -100,308 300,294 C700,282 1000,306 1300,294 L1300,900 L-700,900Z',fill:'#5c4c74'},o);
  el('path',{d:'M-700,312 C-400,302 -100,326 300,312 C700,300 1000,324 1300,312 L1300,900 L-700,900Z',fill:'#7a6690'},o);
  el('path',{d:'M-700,296 C-400,286 -100,308 300,294 C700,282 1000,306 1300,294',stroke:'#dfe4ff','stroke-width':2.5,fill:'none',opacity:.45,'stroke-dasharray':'26 10'},o);
  for(let i=0;i<24;i++){const x=-300+((i*173)%1200),y=330+((i*67)%250);if(i%3)el('ellipse',{cx:x,cy:y,rx:4+i%4,ry:2.5+i%3,fill:'#9a86b0',opacity:.6},o);
    else{const sh=el('g',{transform:`translate(${x},${y}) rotate(${i*23})`,opacity:.55},o);el('path',{d:'M0,0 l-7,-9 q7,-5 14,0Z',fill:'#ffd0dc'},sh)}}
  lighthouseFar(o,575,214,.42)};
SCENE_X.lamp=o=>{seaWater(o,400,{col:'#111a44'});lighthouseFar(o,-40,380,.3);
  el('rect',{x:-700,y:540,width:2000,height:400,fill:'#241d40'},o);el('rect',{x:-700,y:514,width:2000,height:8,rx:4,fill:'#4a4070'},o);
  for(let x=-660;x<1300;x+=46)el('rect',{x,y:522,width:5,height:20,fill:'#4a4070'},o);el('rect',{x:-700,y:540,width:2000,height:5,fill:'#5a5088'},o)};
AMB_X.sea=()=>{const r=Math.random();if(r<.55)noise(2.4,.04,{type:'lowpass',f:500,to:300,a:1,wet:.3});else if(r<.8){osc('sine',1500,.18,.012,{to:1100,wet:.6});osc('sine',1450,.2,.01,{to:1050,at:.24,wet:.6})}else bell(392,.012,2.5,{wet:.9,ratio:2.7})};
AMB_X.door=AMB_X.sea;
AMB_X.beach=()=>{const r=Math.random();if(r<.65)noise(1.8,.05,{type:'bandpass',f:700,to:400,q:.6,a:.7,wet:.3});else{osc('sine',1600,.16,.012,{to:1200,wet:.6});osc('sine',1550,.18,.01,{to:1150,at:.22,wet:.6})}};
AMB_X.lamp=()=>{const r=Math.random();if(r<.5)noise(2.6,.035,{f:500,to:1100,q:2,a:1,wet:.4});else if(r<.8)noise(2,.03,{type:'lowpass',f:400,a:.9,wet:.3});else{osc('sine',1500,.18,.01,{to:1100,wet:.6})}};
