
/* ================= The Shape Isles: Shelly the mapmaker turtle, and the Kraken =================
   Shelly can only swim straight and turn: angles are turns, perimeter is the walk round the edge,
   coordinates are along-then-up. Turns are in degrees, clockwise (to the right) is positive, 0 is up. */
const rad=d=>d*Math.PI/180,dirV=h=>[Math.sin(rad(h)),-Math.cos(rad(h))];
const MINUS='−',sgn=n=>n<0?MINUS+Math.abs(n):String(n),pt2=(x,y)=>`(${sgn(x)}, ${sgn(y)})`;
/* Shelly, seen from above. put(x,y,heading) */
function shellyFig(parent,s=1){const g=el('g',{},parent),body=el('g',{transform:`scale(${s})`},g),fl=[];
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sy])=>{const f=el('ellipse',{cx:sx*20,cy:sy*12,rx:sy<0?11:7,ry:sy<0?6:5,fill:'#7fc87a',stroke:'#4f8f4a','stroke-width':1.5,transform:`rotate(${sx*sy*-30} ${sx*20} ${sy*12})`},body);fl.push({f,sx,sy})});
  el('path',{d:'M0,26 l-4,8 l8,0Z',fill:'#7fc87a'},body);
  const head=el('g',{},body);el('ellipse',{cx:0,cy:-30,rx:9,ry:11,fill:'#8fd88a',stroke:'#4f8f4a','stroke-width':1.5},head);[-1,1].forEach(d=>{el('circle',{cx:d*4.5,cy:-34,r:2.6,fill:'#fff'},head);el('circle',{cx:d*4.5,cy:-35,r:1.4,fill:'#241a3a'},head)});
  el('ellipse',{cx:0,cy:0,rx:22,ry:26,fill:'#c98a3a',stroke:'#7a4a1e','stroke-width':2},body);
  el('path',{d:'M0,-14 l10,6 v12 l-10,6 l-10,-6 v-12Z',fill:'#e0a64a',stroke:'#7a4a1e','stroke-width':1.5},body);
  [[0,-20],[14,-7],[14,9],[0,20],[-14,9],[-14,-7]].forEach(([x,y])=>el('line',{x1:x*.55,y1:y*.55,x2:x,y2:y,stroke:'#7a4a1e','stroke-width':1.4},body));
  el('path',{d:'M0,-9 L2.5,0 L0,9 L-2.5,0Z',fill:'#fff4e6',opacity:.85},body);
  const o={g,x:0,y:0,h:0,put(x,y,h){if(x!=null)o.x=x;if(y!=null)o.y=y;if(h!=null)o.h=h;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) rotate(${o.h.toFixed(1)})`)},
    paddle(t){fl.forEach(({f,sx,sy},k)=>f.setAttribute('transform',`rotate(${sx*sy*-30+Math.sin(t*12+k)*18} ${sx*20} ${sy*12})`))},
    swim(x,y,dur,done){const x0=o.x,y0=o.y;tween(dur,(t,p)=>{o.put(lerp(x0,x,t),lerp(y0,y,t));o.paddle(p*dur/1000)},done,ease.inOut)}};
  o.put(0,0,0);return o}
/* Shelly as the guide beside each question box */
function shellyGuide(parent){const s=shellyFig(parent,.42);s.put(170,44,-20);return s}

/* ---------- scenes: a lagoon from above, a sea chart, the whirlpool ---------- */
SCENE_X.lagoon=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#1d5a74'},o);
  [[120,180,220,120],[480,420,260,140],[300,560,320,90],[-60,420,200,160],[640,140,200,120]].forEach(([x,y,rx,ry],k)=>el('ellipse',{cx:x,cy:y,rx,ry,fill:k%2?'#24708a':'#2a7a8e',opacity:.7},o));
  [[60,520],[520,90],[560,520],[40,120]].forEach(([x,y])=>{el('ellipse',{cx:x,cy:y,rx:70,ry:46,fill:'#c9b07a',opacity:.45},o);el('ellipse',{cx:x+8,cy:y-6,rx:46,ry:26,fill:'#e0c88e',opacity:.4},o)});
  for(let i=0;i<60;i++){const x=-300+((i*173)%1200),y=((i*97)%640)-20;el('path',{d:`M${x},${y} q10,-5 20,0 t20,0`,stroke:'#8fd6e8','stroke-width':1.3,fill:'none',opacity:.25},o)}
  for(let i=0;i<9;i++){const x=-100+((i*211)%800),y=60+((i*137)%480),g=el('g',{transform:`translate(${x},${y})`,opacity:.45},o);[[0,0,9],[-8,4,6],[7,5,7]].forEach(([dx,dy,r])=>el('circle',{cx:dx,cy:dy,r,fill:'#2a6a7e'},g))}
  for(let i=0;i<5;i++){const f=el('g',{class:'mote'},o);f.style.animationDelay=(-i*2.3)+'s';el('path',{d:`M${-200+i*230},${100+(i*91)%380} q10,-6 20,0 q-10,6 -20,0 l-8,-5 v10Z`,fill:'#0e3a4e',opacity:.5},f)}};
SCENE_X.chart=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#16384e'},o);
  el('rect',{x:30,y:84,width:540,height:500,rx:18,fill:'#d8c49a'},o);el('rect',{x:30,y:84,width:540,height:500,rx:18,fill:'none',stroke:'#8a6a3a','stroke-width':6},o);
  el('rect',{x:44,y:98,width:512,height:472,rx:10,fill:'none',stroke:'#a8885a','stroke-width':1.5,'stroke-dasharray':'8 5'},o);
  [[70,120],[530,120],[70,550],[530,550]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:5,fill:'#8a6a3a'},o));
  for(let i=0;i<14;i++){const x=-400+((i*233)%1400),y=((i*151)%640);if(x>20&&x<580&&y>80&&y<590)continue;el('path',{d:`M${x},${y} q12,-6 24,0 t24,0`,stroke:'#4a8aa8','stroke-width':1.6,fill:'none',opacity:.5},o)}};
SCENE_X.whirl=o=>{el('rect',{x:-700,y:300,width:2000,height:700,fill:'#10203e'},o);
  for(let k=0;k<7;k++)el('ellipse',{cx:470,cy:250,rx:60+k*55,ry:24+k*22,fill:'none',stroke:'#3a5a8a','stroke-width':3,opacity:(.5-k*.06).toFixed(2),'stroke-dasharray':`${30+k*10} ${18+k*6}`,class:'mote'},o);
  for(let i=0;i<30;i++){const x=-400+((i*157)%1400),y=320+((i*61)%260);el('path',{d:`M${x},${y} q8,-4 16,0 t16,0`,stroke:'#4a6aa8','stroke-width':1.4,fill:'none',opacity:.4},o)}};
AMB_X.lagoon=()=>{const r=Math.random();if(r<.5)noise(1.6,.04,{type:'bandpass',f:600,to:350,q:.6,a:.6,wet:.3});else if(r<.85){for(let k=0;k<3;k++)osc('sine',500+Math.random()*500,.06,.012,{to:1200,at:k*.09,wet:.5})}else bell(noteHz(6+Math.floor(Math.random()*5)),.01,1.6,{wet:.8})};
AMB_X.chart=()=>{const r=Math.random();if(r<.4)noise(.3,.03,{type:'highpass',f:2500,a:.05,wet:.2});else if(r<.75)noise(2,.04,{type:'lowpass',f:450,a:.8,wet:.3});else bell(noteHz(5+Math.floor(Math.random()*6)),.012,1.6,{wet:.8,ratio:3})};
AMB_X.whirl=()=>{const r=Math.random();if(r<.5)noise(2.6,.05,{f:300,to:700,q:.7,a:1,wet:.4});else if(r<.8)osc('sawtooth',58,1.4,.03,{to:50,lfo:5,lfoDepth:.1,lp:300,a:.4,wet:.3});else bell(noteHz(2+Math.floor(Math.random()*4)),.012,2.2,{wet:.9,ratio:2.4})};
