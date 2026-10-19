/* ================= The Survey Isles: Pip's survey, and Fudge the fox =================
   Graphs. Pip (the caterpillar from the Story Isles) is counting everything on the farm. Every chart here is
   built by hand, from real things: tallies from animals going through a gate, pictures from tallies, bars from pictures,
   dots from a growing sunflower. Fudge the fox makes charts that lie, and the boss is fixing them. */

/* farm animals, drawn simply so a tally row, a token and a field all match */
const ANIMAL={sheep:{body:'#f4f0e8',head:'#3a2e2a',name:['sheep','sheep']},goat:{body:'#c9a27a',head:'#8a6a4a',name:['goat','goats']},duck:{body:'#ffd23a',head:'#3a8a5a',name:['duck','ducks']},hen:{body:'#c9613a',head:'#e8413e',name:['hen','hens']},cow:{body:'#fff',head:'#3a2e2a',name:['cow','cows']}};
function animalIcon(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),A=ANIMAL[kind];
  if(kind==='duck'||kind==='hen'){el('ellipse',{cx:0,cy:4,rx:13,ry:9,fill:A.body,stroke:'#3a2418','stroke-width':1.5},g);el('circle',{cx:10,cy:-6,r:6,fill:kind==='duck'?A.head:A.body,stroke:'#3a2418','stroke-width':1.5},g);
    el('path',{d:'M15,-6 l7,2 l-7,2Z',fill:'#ff9a3a'},g);el('circle',{cx:11,cy:-7,r:1.4,fill:'#241a1a'},g);if(kind==='hen')el('path',{d:'M7,-12 q2,-5 4,0 q2,-5 4,0',fill:A.head},g)}
  else{const goat=kind==='goat',cow=kind==='cow';[-8,-3,4,9].forEach(lx=>el('rect',{x:lx-1.5,y:6,width:3,height:9,fill:'#3a2e2a'},g));
    if(kind==='sheep'){[[-8,0],[-2,-4],[4,-3],[8,1],[0,3],[-5,4]].forEach(([cx,cy])=>el('circle',{cx,cy,r:6.5,fill:A.body,stroke:'#c9c0b0','stroke-width':1},g))}
    else{el('ellipse',{cx:0,cy:1,rx:13,ry:8,fill:A.body,stroke:'#3a2418','stroke-width':1.5},g);if(cow)[[-5,-1],[4,3]].forEach(([cx,cy])=>el('circle',{cx,cy,r:3.5,fill:'#3a2e2a'},g))}
    el('ellipse',{cx:13,cy:-5,rx:5.5,ry:5,fill:A.head,stroke:'#3a2418','stroke-width':1},g);el('circle',{cx:15,cy:-6,r:1.2,fill:'#fff'},g);
    if(goat)el('path',{d:'M11,-9 l-3,-6 M15,-9 l1,-6',stroke:'#5a4a3a','stroke-width':1.8},g);if(cow)el('path',{d:'M10,-9 l-3,-3 M16,-9 l3,-3',stroke:'#c9a24a','stroke-width':1.8},g)}
  return g}
/* tally marks: every fifth mark goes across the four before it (a gate) */
function tallyMarks(parent,x,y,n,{h=24,dx=7,gap=12,col='#3a2418',w=2.6}={}){const g=el('g',{},parent);let cx=x;
  for(let i=0;i<n;i++){const k=i%5;if(k<4){el('line',{x1:cx+k*dx,x2:cx+k*dx,y1:y-h/2,y2:y+h/2,stroke:col,'stroke-width':w,'stroke-linecap':'round'},g)}
    else{el('line',{x1:cx-4,x2:cx+3*dx+4,y1:y+h/2-3,y2:y-h/2+3,stroke:col,'stroke-width':w,'stroke-linecap':'round'},g);cx+=3*dx+gap}}
  return g}
const tallyWidth=(n,dx=7,gap=12)=>Math.floor(n/5)*(3*dx+gap)+(n%5?(n%5-1)*dx+4:0);
/* a chart frame: y axis from lo to hi with a line every step, labels every lab (lab=0: no numbers) */
function chartFrame(parent,{x,y,w,h,lo=0,hi=10,step=1,lab=1,fmt=v=>String(v),unit=''}){const g=el('g',{},parent),yOf=v=>y+h-(v-lo)/(hi-lo)*h;
  el('rect',{x,y,width:w,height:h,fill:'#fffaf0',stroke:'#c9a77a','stroke-width':2},g);
  for(let v=lo;v<=hi+1e-9;v+=step){const yy=yOf(v),major=lab&&Math.abs((v-lo)/lab-Math.round((v-lo)/lab))<1e-6;el('line',{x1:x,x2:x+w,y1:yy,y2:yy,stroke:major?'#c9b08a':'#e8dcc4','stroke-width':major?1.4:1},g);
    if(major)el('text',{x:x-7,y:yy+4,'text-anchor':'end','font-size':12,'font-weight':700,fill:'#3a2418'},g).textContent=fmt(v)}
  if(unit)el('text',{x:x-7,y:y-8,'text-anchor':'end','font-size':11,'font-weight':700,fill:'#7a5a3a'},g).textContent=unit;
  el('line',{x1:x,x2:x,y1:y,y2:y+h,stroke:'#3a2418','stroke-width':2.5},g);el('line',{x1:x,x2:x+w,y1:y+h,y2:y+h,stroke:'#3a2418','stroke-width':2.5},g);
  return{g,yOf,lo,hi,vOf:py=>lo+(y+h-py)/h*(hi-lo)}}
/* a draggable bar with an up/down grip on top (like the towers on the Story Isles) */
/* (the hit area stays put while the bar redraws, so a drag keeps hold of it) */
function dragBar(parent,{x,w=44,fr,val=0,snap=1,max,col,label,onChange,can=()=>true}){const g=el('g',{},parent),body=el('g',{},g);let v=val;
  const base=fr.yOf(fr.lo),topY=fr.yOf(fr.hi);
  const draw=()=>{body.innerHTML='';const top=fr.yOf(v);if(v>0)el('rect',{x:x-w/2,y:top,width:w,height:base-top,fill:col,stroke:darker(col,.6),'stroke-width':2},body);
    const k=el('g',{transform:`translate(${x},${top})`},body);el('line',{x1:-w/2-4,x2:w/2+4,y1:0,y2:0,stroke:'#3a2418','stroke-width':2.5},k);el('rect',{x:-15,y:-34,width:30,height:30,rx:15,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2},k);
    el('path',{d:'M-6,-21 L0,-28 L6,-21Z M-6,-17 L0,-10 L6,-17Z',fill:'#7a4a1e'},k)};
  const hit=el('rect',{x:x-w/2-8,y:topY-40,width:w+16,height:base-topY+40,fill:'transparent'},g);
  interact(hit,{label,down:()=>({}),move:p=>{if(!can())return;set(fr.vOf(p.y+16))},tap:p=>{if(!can()||!p)return;set(fr.vOf(p.y+16))}});
  hit.addEventListener('keydown',e=>{if(!can())return;const d=e.key==='ArrowUp'||e.key==='ArrowRight'?1:e.key==='ArrowDown'||e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();set(v+d*snap)});
  const set=n=>{n=clamp(Math.round(n/snap)*snap,0,max);if(n===v)return;v=n;SFX.tick((v/snap)%8);draw();onChange&&onChange(v)};
  draw();return{g,get:()=>v,set:n=>{v=n;draw()},redraw:draw}}
/* a sunflower, base at (x,by), head at height hp pixels */
function sunflowerFig(parent,x,by,hp,{s=1}={}){const g=el('g',{},parent);el('path',{d:`M${x},${by} C${x-6},${by-hp*.4} ${x+6},${by-hp*.7} ${x},${by-hp}`,stroke:'#3a8a3a','stroke-width':4*s,fill:'none'},g);
  if(hp>40)[[.35,-1],[.6,1]].forEach(([f,sd])=>el('path',{d:`M${x},${by-hp*f} q${sd*16*s},${-8*s} ${sd*22*s},${2*s} q${-sd*10*s},${6*s} ${-sd*22*s},${-2*s}Z`,fill:'#4aa04a'},g));
  const hd=el('g',{transform:`translate(${x},${by-hp})`},g),r=Math.max(5,Math.min(14,4+hp/14))*s;for(let i=0;i<12;i++)el('ellipse',{cx:0,cy:-r*1.35,rx:r*.35,ry:r*.7,fill:'#ffd23a',transform:`rotate(${i*30})`},hd);
  el('circle',{r,fill:'#7a4a1e'},hd);return g}
/* Fudge the fox, who makes charts that fib */
function fudgeFig(parent,{s=1}={}){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  const tail=el('path',{d:'M26,24 Q60,10 54,-16 Q46,6 22,12Z',fill:'#e8813a',stroke:'#8a4a1a','stroke-width':2},b);el('path',{d:'M54,-16 Q50,-6 44,-2 Q52,-8 54,-16Z',fill:'#fff'},b);
  el('ellipse',{cx:0,cy:22,rx:28,ry:24,fill:'#e8813a',stroke:'#8a4a1a','stroke-width':2.5},b);el('ellipse',{cx:0,cy:28,rx:15,ry:14,fill:'#fff4e6'},b);
  el('path',{d:'M-24,-14 L-30,-44 L-10,-26Z M24,-14 L30,-44 L10,-26Z',fill:'#e8813a',stroke:'#8a4a1a','stroke-width':2},b);
  el('path',{d:'M-26,-16 Q0,-34 26,-16 Q20,8 0,14 Q-20,8 -26,-16Z',fill:'#e8813a',stroke:'#8a4a1a','stroke-width':2.5},b);el('path',{d:'M-12,2 Q0,18 12,2 Q0,8 -12,2Z',fill:'#fff4e6'},b);
  el('circle',{cx:0,cy:8,r:3.5,fill:'#241a1a'},b);const eyes=[-10,10].map(x=>el('ellipse',{cx:x,cy:-10,rx:3,ry:4,fill:'#241a1a'},b));
  const brow=el('path',{d:'M-15,-17 l9,3 M15,-17 l-9,3',stroke:'#5a2a0a','stroke-width':2.2},b);
  let sc=1;return{g,tick(t){b.setAttribute('transform',`scale(${(s*sc).toFixed(3)})`);tail.setAttribute('transform',`rotate(${(Math.sin(t*2.2)*6).toFixed(1)} 24 18)`)},
    mood(m){brow.setAttribute('d',m==='sad'?'M-15,-14 l9,-3 M15,-14 l-9,-3':m==='oh'?'M-15,-19 l9,0 M15,-19 l-9,0':'M-15,-17 l9,3 M15,-17 l-9,3');eyes.forEach(e=>e.setAttribute('ry',m==='oh'?5:4))},
    shrink(){sc=Math.max(.72,sc-.06)},grow(){sc=Math.min(1,sc+.06)}}}
/* the middle of the Survey Isles on the home screen: Fudge with his fibbing chart, or Pip's honest one */
function surveyCentreFig(parent,{won=false}={}){const g=el('g',{},parent),bd=el('g',{transform:'translate(-34,-30)'},g);
  el('rect',{x:-34,y:-34,width:68,height:56,rx:4,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':3},bd);el('rect',{x:-4,y:22,width:8,height:20,fill:'#7a5a3a'},bd);
  (won?[14,26,20]:[6,40,10]).forEach((h,i)=>el('rect',{x:-24+i*18,y:16-h,width:12,height:h,fill:['#4aa0ff','#e8813a','#7fc86a'][i]},bd));
  let fx=null;if(!won){fx=fudgeFig(g,{s:.5});fx.g.setAttribute('transform','translate(26,-6)')}else{const p=pipFig(g,.6);p.put(16,0)}
  return{g,tick(t){if(fx)fx.tick(t)}}}

/* ---------- scene ---------- */
SCENE_X.survey=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#9ad4f4'},o);el('path',{d:'M-700,300 Q-200,250 300,290 T1300,280 V800 H-700Z',fill:'#8fd47a'},o);el('path',{d:'M-700,440 Q0,410 600,445 T1300,435 V800 H-700Z',fill:'#6ab85a'},o);
  for(let x=-700;x<1300;x+=46){el('rect',{x,y:262,width:6,height:40,fill:'#c9a27a'},o)}el('rect',{x:-700,y:270,width:2000,height:5,fill:'#c9a27a'},o);el('rect',{x:-700,y:286,width:2000,height:5,fill:'#c9a27a'},o)};
AMB_X.survey=()=>{const r=Math.random();if(r<.4)osc('sine',1800+Math.random()*700,.08,.006,{to:2300,wet:.6});else if(r<.6)osc('triangle',220,.35,.008,{to:180,wet:.4});else noise(1.2,.02,{type:'lowpass',f:900,a:.5,wet:.4})};
