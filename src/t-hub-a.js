
/* ================= Home: the sky of worlds, and each world's island map ================= */
const SHARDC=['#ffb34d','#6fe3cd','#ffe066','#f0475f','#8fd6ff','#ff7eb6','#7fd36b','#c9a2ff'];
function hubDefs(root){const d=el('defs',{},root),G=(id,stops,a={})=>{const g=el(a.lin?'linearGradient':'radialGradient',Object.assign({id},a.at||{}),d);stops.forEach(([o,c,op])=>el('stop',{offset:o,'stop-color':c,'stop-opacity':op==null?1:op},g))};
  G('gGlA',[['0','#8a4ae0',.45],['1','#8a4ae0',0]]);
  G('gGlB',[['0','#3a2a64'],['1','#0b0619']],{at:{cx:'.5',cy:'.38',r:'.7'}});
  G('gGlC',[['0','#fff6d0',.7],['1','#fff6d0',0]]);
  G('gBeam',[['0','#fff0a0',0],['.7','#fff0a0',.28],['1','#fff6d0',.55]],{lin:1,at:{x1:'0',y1:'0',x2:'0',y2:'1'}});
  G('gAur',[['0','#6fe3cd',0],['.3','#6fe3cd',1],['.65','#b48cff',1],['1','#ff9ed2',0]],{lin:1,at:{x1:'0',y1:'0',x2:'1',y2:'0'}});
  G('gStar',[['0','#fff6d0',0],['1','#fff6d0',1]],{lin:1,at:{x1:'0',y1:'0',x2:'1',y2:'0'}});
  G('gWarm',[['0','#ffd27a',.55],['1','#ffd27a',0]]);
  const f=el('filter',{id:'fLock'},d);el('feColorMatrix',{type:'saturate',values:'.12'},f)}

/* ---------- the living sky: aurora, shooting stars, a sea of clouds, fireflies ---------- */
function skyFX(root,{seaY=468}={}){
  const back=el('g',{},root),aur=el('g',{opacity:.17},back),stars=el('g',{},back),sea=el('g',{},back);
  const A=[0,1,2].map(k=>el('path',{fill:'none',stroke:'url(#gAur)','stroke-width':26-k*6,'stroke-linecap':'round'},aur));
  const band=(y,a,w,col,op)=>{let d=`M-500,${y}`;for(let x=-500;x<1200;x+=w)d+=` q${w/2},${-a} ${w},0`;return el('path',{d:d+' L1200,800 L-500,800Z',fill:col,opacity:op},sea)};
  const B=[[seaY,16,90,'#3f2a62',.8,6],[seaY+30,20,120,'#54397a',.75,-9],[seaY+62,22,150,'#6d4f94',.7,12],[seaY+96,18,110,'#8e70b4',.5,-15]].map(([y,a,w,c,o,v])=>({p:band(y,a,w,c,o),w,v}));
  /* a warm rim of sunset light along the top of the cloud sea */
  el('rect',{x:-500,y:seaY-40,width:1700,height:60,fill:'url(#gWarm)',opacity:.25},sea);
  const flies=[];for(let i=0;i<14;i++){const c=el('circle',{r:1.8+(i%3)*.6,fill:i%4?'#fff0a0':'#bff6e8'},back);flies.push({c,x:Math.random()*600,y:120+Math.random()*360,p:Math.random()*6.28,v:.3+Math.random()*.5})}
  let nextStar=2+Math.random()*3;
  return{tick(T,dt){
    A.forEach((p,k)=>{const y=70+k*34,a=18+k*6;p.setAttribute('d',`M-80,${(y+Math.sin(T*.3+k)*a).toFixed(1)} C150,${(y-40+Math.sin(T*.4+k*2)*a).toFixed(1)} 350,${(y+50+Math.cos(T*.35+k)*a).toFixed(1)} 680,${(y+Math.sin(T*.25+k*3)*a).toFixed(1)}`)});
    B.forEach(b=>b.p.setAttribute('transform',`translate(${((T*b.v)%b.w).toFixed(1)},0)`));
    flies.forEach(f=>{f.y-=dt*8*f.v;f.x+=Math.sin(T*f.v+f.p)*dt*10;if(f.y<90){f.y=480;f.x=Math.random()*600}f.c.setAttribute('cx',f.x.toFixed(1));f.c.setAttribute('cy',f.y.toFixed(1));f.c.setAttribute('opacity',(.35+.45*Math.abs(Math.sin(T*2*f.v+f.p))).toFixed(2))});
    nextStar-=dt;if(nextStar<0){nextStar=4+Math.random()*5;const x0=40+Math.random()*360,y0=20+Math.random()*90,g=el('g',{},stars),ln=el('rect',{x:-70,y:-1.2,width:70,height:2.4,rx:1.2,fill:'url(#gStar)'},g);el('circle',{r:2.4,fill:'#fff'},g);
      tween(900,(t,pp)=>{g.setAttribute('transform',`translate(${(x0+t*220).toFixed(1)},${(y0+t*90).toFixed(1)}) rotate(22)`);g.setAttribute('opacity',(pp<.15?pp/.15:1-(pp-.15)/.85).toFixed(2))},()=>g.remove(),ease.out)}
  }}}
function frontClouds(root,y=574){const g=el('g',{},root);let d=`M-500,${y}`;for(let x=-500;x<1200;x+=80)d+=` q40,-14 80,0`;const p=el('path',{d:d+' L1200,800 L-500,800Z',fill:'#cbb6e4',opacity:.2},g);return{tick:T=>p.setAttribute('transform',`translate(${((T*-7)%80).toFixed(1)},0)`)}}

/* ---------- each island as a little diorama of its own game ---------- */
const DIO={
  share:{top:'#7d5aa0',draw(g){el('rect',{x:-17,y:-15,width:30,height:12,rx:6,fill:'url(#gA)'},g);el('rect',{x:-14,y:-13,width:22,height:2.5,rx:1.2,fill:'#fff',opacity:.4},g);
    [[-25,-7,'#ff8f7a'],[19,-9,'#b8a2ff'],[27,-5,'#8ff0c8']].forEach(([x,y,c])=>{el('circle',{cx:x,cy:y,r:5,fill:c},g);el('circle',{cx:x+1.2,cy:y-1,r:1.3,fill:'#241a3a'},g)})}},
  scales:{top:'#5f6fa8',draw(g){el('path',{d:'M0,-3 V-30',stroke:'#d8c6e4','stroke-width':2.5},g);el('path',{d:'M-6,-3 h12',stroke:'#d8c6e4','stroke-width':2.5},g);el('path',{d:'M-21,-27 L21,-32',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round'},g);
    [[-21,-27,-13,'url(#gA)'],[21,-32,-18,'url(#gB)']].forEach(([x,y,py,f])=>{el('path',{d:`M${x},${y} L${x-8},${py} M${x},${y} L${x+8},${py}`,stroke:'rgba(255,244,230,.5)','stroke-width':1},g);el('path',{d:`M${x-10},${py} Q${x},${py+6} ${x+10},${py}Z`,fill:'#9a8ac0'},g);el('rect',{x:x-7,y:py-6,width:14,height:6,rx:2.5,fill:f},g)})}},
  match:{top:'#7a4a5a',draw(g){el('path',{d:'M-22,-2 Q-23,-34 0,-35 Q23,-34 22,-2Z',fill:'#8a4a3a'},g);el('path',{d:'M-16,-12 h32 M-19,-22 h38',stroke:'#6a3428','stroke-width':1.2},g);el('rect',{x:9,y:-46,width:7,height:12,fill:'#6a3428'},g);
    el('path',{d:'M-10,-2 Q-10,-17 0,-17 Q10,-17 10,-2Z',fill:'#ffb066',class:'flicker'},g);el('ellipse',{cx:0,cy:-4,rx:8,ry:3,fill:'#ffe08a'},g)}},
  glue:{top:'#4a5578',draw(g){el('rect',{x:-10,y:-44,width:20,height:42,fill:'#3a3358'},g);el('path',{d:'M-13,-44 L0,-60 L13,-44Z',fill:'#2a2448'},g);
    el('path',{d:'M-6,-14 V-30 Q0,-38 6,-30 V-14Z',fill:'#e8435a'},g);el('path',{d:'M0,-14 V-30 Q3,-36 6,-30 V-14Z',fill:'#3f7fe0'},g);el('rect',{x:-6,y:-22,width:12,height:3,fill:'#f2c84b'},g);el('path',{d:'M-6,-14 V-30 Q0,-38 6,-30 V-14Z',fill:'none',stroke:'#1d1830','stroke-width':1.5},g)}},
  join:{top:'#3f6a3a',draw(g){el('path',{d:'M-30,-3 q8,-8 16,0 t16,0 t16,0',stroke:'#5c8f48','stroke-width':1.8,fill:'none'},g);el('ellipse',{cx:-11,cy:-9,rx:13,ry:9,fill:'#2c6b34'},g);[-18,-11,-4].forEach(x=>el('path',{d:`M${x},-17 q-1,8 0,16`,stroke:'#1d4d26','stroke-width':2.2,fill:'none'},g));
    el('path',{d:'M6,-4 A12,12 0 0 1 30,-4Z',fill:'#2c6b34'},g);el('path',{d:'M8,-4 A10,10 0 0 1 28,-4Z',fill:'#f0475f'},g);[13,18,23].forEach(x=>el('circle',{cx:x,cy:-8,r:1,fill:'#2a1418'},g))}},
  hive:{top:'#5a7a3a',draw(g){el('path',{d:'M-10,-2 Q-6,-20 -8,-42 M-8,-36 Q4,-40 18,-40',stroke:'#5a3a22','stroke-width':5,fill:'none','stroke-linecap':'round'},g);el('circle',{cx:-10,cy:-44,r:10,fill:'#3f6a3a'},g);
    el('path',{d:'M14,-38 v4',stroke:'#5a3a22','stroke-width':1.5},g);[[14,-30,7],[14,-24,8],[14,-18,6]].forEach(([x,y,r])=>el('ellipse',{cx:x,cy:y,rx:r,ry:3.6,fill:'#f2a93a',stroke:'#c98a3a','stroke-width':1},g));el('ellipse',{cx:28,cy:-30,rx:3,ry:2.2,fill:'#ffd34d'},g)}},
  jugs:{top:'#3f6f8a',draw(g){el('path',{d:'M-24,-18 h40 v6 q0,9 -9,9 h-22 q-9,0 -9,-9Z',fill:'#e6eef5'},g);el('ellipse',{cx:-4,cy:-17,rx:19,ry:3,fill:'#7fd6ff'},g);el('circle',{cx:-10,cy:-20,r:3,fill:'#ffe07a'},g);
    el('rect',{x:20,y:-26,width:9,height:16,rx:2,fill:'rgba(127,214,255,.5)',stroke:'#d8c6e4','stroke-width':1.2},g);el('rect',{x:21,y:-18,width:7,height:7,fill:'#7fd6ff'},g)}},
  take:{top:'#6a4a3a',draw(g){el('rect',{x:-22,y:-16,width:30,height:13,rx:2,fill:'url(#gChoc)'},g);el('path',{d:'M-12,-16 v13 M-2,-16 v13 M-22,-9.5 h30',stroke:'#4a2a18','stroke-width':1},g);el('path',{d:'M8,-16 v6 q-3,0 -4,-3 q-2,-3 -4,-3Z',fill:'#6a4a3a'},g);
    el('circle',{cx:20,cy:-8,r:6,fill:'#ffe07a'},g);el('circle',{cx:21.5,cy:-9.5,r:1.5,fill:'#241a3a'},g);el('path',{d:'M17,-5 q3,2 6,0',stroke:'#241a3a','stroke-width':1,fill:'none'},g)}},
  smash:{top:'#3a3f6a',draw(g){[['-18,-2 -11,-30 -4,-2'],['-6,-2 3,-44 12,-2'],['10,-2 18,-24 25,-2']].forEach(([pts],k)=>{el('polygon',{points:pts,fill:'url(#gCrystal)',stroke:'#e9f6ff','stroke-width':1},g)});el('path',{d:'M1,-34 L4,-26',stroke:'#fff','stroke-width':1.5,opacity:.7},g)}},
  leap:{top:'#2f5a4a',draw(g){el('ellipse',{cx:0,cy:-3,rx:29,ry:7,fill:'url(#gRiver)',stroke:'#5aa0e0','stroke-width':1},g);el('ellipse',{cx:12,cy:-4,rx:7,ry:2.5,fill:'#3f9b4f'},g);el('ellipse',{cx:-16,cy:-3,rx:6,ry:2.2,fill:'#3f9b4f'},g);
    el('ellipse',{cx:-4,cy:-12,rx:9,ry:6,fill:'#7fd36b'},g);[-8,0].forEach(x=>{el('circle',{cx:x,cy:-17,r:3.2,fill:'#7fd36b'},g);el('circle',{cx:x+.6,cy:-17.4,r:1.4,fill:'#241a3a'},g)})}},
  toll:{top:'#5a6a5a',draw(g){el('path',{d:'M-30,-2 L-26,-22 L-16,-26 L-12,-2Z',fill:'#6a5a4a'},g);el('path',{d:'M12,-2 L16,-26 L26,-22 L30,-2Z',fill:'#6a5a4a'},g);el('path',{d:'M-14,-24 Q0,-14 14,-24',stroke:'#c9a77a','stroke-width':2,fill:'none'},g);
    [-8,-3,2,7].forEach(x=>el('path',{d:`M${x},-20 v4`,stroke:'#9c7350','stroke-width':2},g));el('path',{d:'M14,-26 C13,-38 26,-38 25,-26Z',fill:'#7f9b6e'},g);el('circle',{cx:17,cy:-31,r:1.2,fill:'#241a3a'},g);el('circle',{cx:22,cy:-31,r:1.2,fill:'#241a3a'},g);el('path',{d:'M15,-36 l-2,-4 M24,-36 l2,-4',stroke:'#e8dcc0','stroke-width':1.6},g)}},
  fold:{top:'#8a7a6a',draw(g){el('path',{d:'M-24,-6 L2,-15 L26,-6 L0,3Z',fill:'#fdf6ea'},g);el('path',{d:'M-24,-6 L2,-15 L14,-10.5 L-12,-1.5Z',fill:'#5aa8ff'},g);el('path',{d:'M-24,-6 L-11,-10.5 L1,-6 L-12,-1.5Z',fill:'#9a6cff'},g);
    el('path',{d:'M8,-20 l6,-14 l6,14Z M14,-34 l-4,-5 l4,1 l4,-1 l-4,5',fill:'#ff9a4a',stroke:'#c96a2a','stroke-width':.8},g)}},
  picnic:{top:'#3a5a3a',draw(g){el('path',{d:'M-26,-6 L-2,-14 L26,-6 L2,2Z',fill:'url(#pCheck)'},g);el('circle',{cx:0,cy:-10,r:7,fill:'#e0a43c'},g);el('circle',{cx:0,cy:-10,r:5.2,fill:'#c9a2ff'},g);el('path',{d:'M0,-10 L0,-15.2 A5.2,5.2 0 0 1 5.2,-10Z',fill:'#e0a43c'},g);
    el('path',{d:'M14,-6 l1,-7 l4,-4 l5,1 l3,4 l0,6Z',fill:'#6a4a3a'},g);el('circle',{cx:25,cy:-8,r:1,fill:'#241a3a'},g)}},
  lanterns:{top:'#3a3a6a',draw(g){el('ellipse',{cx:0,cy:-3,rx:29,ry:7,fill:'url(#gRiver)'},g);[[-13,-22,1],[5,-36,.9],[18,-20,.8]].forEach(([x,y,s],k)=>{const l=el('g',{transform:`translate(${x},${y}) scale(${s})`},g);el('circle',{r:10,fill:'#ffc04d',opacity:.25},l);el('path',{d:'M-6,-8 Q0,-10 6,-8 V7 Q0,9 -6,7Z',fill:'#e8513e',stroke:'#ffb86a','stroke-width':1},l);el('rect',{x:-2.5,y:-5,width:5,height:10,rx:2,fill:'#ffd27a'},l)})}},
  flies:{top:'#3f5a3a',draw(g){el('rect',{x:-26,y:-8,width:52,height:7,rx:3,fill:'#6a4a2a'},g);
    [[-14,1],[4,1],[20,0]].forEach(([x,f])=>{el('path',{d:`M${x-6},-26 h12 v2 l2,3 v13 q0,2 -2,2 h-12 q-2,0 -2,-2 v-13 l2,-3Z`,fill:'rgba(200,230,255,.25)',stroke:'#d8c6e4','stroke-width':1},g);if(f){el('rect',{x:x-7,y:-29,width:14,height:4,rx:1.5,fill:'#c98a3a'},g);el('circle',{cx:x,cy:-15,r:9,fill:'#e6ff8a',opacity:.25},g)}
      for(let k=0;k<(f?6:3);k++)el('circle',{cx:x-3+(k%2)*6,cy:-21+Math.floor(k/2)*4,r:1.6,fill:'#e6ff8a'},g)});
    [[-24,-36],[12,-42],[28,-30]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:5,fill:'#e6ff8a',opacity:.3},g);el('circle',{cx:x,cy:y,r:2,fill:'#f6ffc8'},g)})}},
  burrows:{top:'#4f7a3a',draw(g){for(let r=0;r<2;r++)for(let c=0;c<4;c++)el('rect',{x:-24+c*12+r*4,y:-20+r*9,width:10,height:8,rx:2,fill:r%2?'#5a7a3a':'#4f6e34',stroke:'#3a5226','stroke-width':.6},g);
    const b=el('g',{transform:'translate(-6,-26)'},g);[-2.5,2.5].forEach(x=>el('ellipse',{cx:x,cy:-12,rx:2,ry:6,fill:'#f4ecf8'},b));el('ellipse',{cx:0,cy:0,rx:7,ry:6,fill:'#f4ecf8'},b);el('circle',{cx:0,cy:-5,r:5,fill:'#fff'},b);el('circle',{cx:1.8,cy:-5.5,r:.9,fill:'#241a3a'},b);
    el('path',{d:'M14,-26 l4,0 l-2,10Z',fill:'#ff8a3a'},g);el('path',{d:'M16,-26 q-3,-4 -4,-6 M16,-26 v-7 M16,-26 q3,-4 4,-6',stroke:'#4fa84a','stroke-width':1.4,fill:'none'},g)}},
  trays:{top:'#6a5a3a',draw(g){el('path',{d:'M-26,-6 L-6,-16 L26,-8 L6,2Z',fill:'#8a5a32',stroke:'#5a3a1e','stroke-width':1},g);
    for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=-17+c*8+r*5,y=-8-c*2.2+r*3.2;el('circle',{cx:x,cy:y,r:2,fill:'#3a2418'},g);if(r<2)el('path',{d:`M${x},${y} q-2,-5 0,-7 q3,2 0,7`,fill:'#7fd36b'},g)}}},
  pigs:{top:'#5a6a3a',draw(g){el('path',{d:'M-30,-6 Q0,-12 30,-4',stroke:'#7a5a3a','stroke-width':3,fill:'none'},g);for(let x=-26;x<=26;x+=13)el('rect',{x:x-1.5,y:-16,width:3,height:12,fill:'#8a6a44'},g);
    [[-12,-18,1],[12,-16,.85]].forEach(([x,y,s])=>{const p=el('g',{transform:`translate(${x},${y}) scale(${s})`},g);el('ellipse',{cx:0,cy:0,rx:10,ry:7,fill:'#ffb0c8'},p);el('circle',{cx:-8,cy:-3,r:5,fill:'#ffb0c8'},p);el('ellipse',{cx:-12,cy:-2,rx:2.2,ry:1.8,fill:'#ff8fb0'},p);el('circle',{cx:-8,cy:-5,r:.9,fill:'#241a3a'},p)});
    [[-2,-34],[8,-38],[20,-32]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:3.6,fill:'#e8435a'},g);el('path',{d:`M${x},${y-3.6} v-2.4`,stroke:'#6a4a2a','stroke-width':1},g)})}},
  rock:{top:'#5a4a7a',draw(g){for(let i=0;i<5;i++)el('path',{d:`M${-26+i*11},-34 h11 v8 q-5.5,5 -11,0Z`,fill:i%2?'#fff4e6':'#ff6f91'},g);el('rect',{x:-27,y:-36,width:55,height:3,fill:'#c0405a'},g);[-26,27].forEach(x=>el('rect',{x:x-1.5,y:-34,width:3,height:30,fill:'#8a5a32'},g));
    el('rect',{x:-24,y:-14,width:48,height:9,rx:4.5,fill:'#ff8fb0',stroke:'#d8487a','stroke-width':.8},g);for(let k=1;k<6;k++)el('line',{x1:-24+k*8,x2:-24+k*8,y1:-13,y2:-6,stroke:'#a8305a','stroke-width':.8},g)}},
  dig:{top:'#7a6690',draw(g){el('path',{d:'M-28,-4 Q-10,-14 6,-6 Q20,-12 28,-4Z',fill:'#9a86b0'},g);el('rect',{x:-28,y:-30,width:56,height:6,rx:2,fill:'#9a6a40'},g);for(let k=0;k<=4;k++)el('line',{x1:-26+k*13,x2:-26+k*13,y1:-30,y2:-24,stroke:'#fff4e6','stroke-width':1},g);
    const c=crabFig(g,.42);c.g.setAttribute('transform','translate(-6,-12)');shellFig(g,16,-12,.38)}},
  snails:{top:'#4f6e34',draw(g){el('rect',{x:-30,y:-12,width:60,height:6,rx:3,fill:'#3f5a3a'},g);[[-8,-14,'#ffb34d'],[16,-22,'#8fd6ff']].forEach(([x,y,c])=>{const s=snailFig(g,c);s.g.setAttribute('transform',`translate(${x},${y}) scale(.4)`)})}},
  potion:{top:'#4a3a62',draw(g){const f=flask(g,0,-24,'×10',true);f.g.setAttribute('transform','translate(0,-24) scale(.38)');el('rect',{x:-30,y:-8,width:60,height:5,rx:2,fill:'#5a3f2c'},g)}},
  tulips:{top:'#4a3020',draw(g){for(let r=0;r<3;r++)for(let c=0;c<6;c++)tulip(g,-22+c*9+r*2,-24+r*7,.42,r===2&&c>3?'#ffd34d':'#ff5a7a')}},
  treasure:{top:'#7a6690',draw(g){el('rect',{x:-16,y:-22,width:32,height:18,rx:3,fill:'#8a5a2a',stroke:'#c9a24a','stroke-width':1.5},g);el('path',{d:'M-16,-22 q16,-14 32,0',fill:'#a8743a',stroke:'#c9a24a','stroke-width':1.5},g);
    [[-8,-24],[0,-27],[8,-24],[22,-8],[-24,-8]].forEach(([x,y])=>{const c=coin(g,3.6);c.setAttribute('transform',`translate(${x},${y})`)})}},
  lock:{top:'#3a4a7a',draw(g){el('path',{d:'M-16,-4 V-30 Q-16,-44 0,-44 Q16,-44 16,-30 V-4Z',fill:'#f4ecf8'},g);el('path',{d:'M-11,-4 V-28 Q-11,-38 0,-38 Q11,-38 11,-28 V-4Z',fill:'#5a3a2a'},g);el('rect',{x:-8,y:-26,width:16,height:12,rx:2,fill:'#c9a24a'},g);[-4,0,4].forEach(x=>el('rect',{x:x-1.4,y:-24,width:2.8,height:8,fill:'#fff4e6'},g))}},
  magpie:{top:'#3a5a8a',draw(g){const m=magpieFig(g,.45);m.g.setAttribute('transform','translate(0,-18) scale(.45)')}},
  turn:{top:'#2a7a8e',draw(g){el('circle',{cx:0,cy:-16,r:16,fill:'none',stroke:'#e8f4ff','stroke-width':1.5},g);el('path',{d:'M0,-16 L0,-32 A16,16 0 0 1 16,-16Z',fill:'#ffc04d',opacity:.7},g);const s=shellyFig(g,.3);s.put(0,-16,45);seagrass(g,22,-30,.35)}},
  fans:{top:'#5a4a7a',draw(g){[[0,60,'#8fd6ff'],[60,130,'#ff9ed2'],[130,180,'#ffc04d']].forEach(([a,b,c])=>el('path',{d:wedgePath(0,-6,26,a,b),fill:c,stroke:'#2a2245','stroke-width':1},g));el('line',{x1:-30,x2:30,y1:-6,y2:-6,stroke:'#fff4e6','stroke-width':2},g)}},
  chart:{top:'#8a6a3a',draw(g){el('rect',{x:-24,y:-34,width:48,height:30,rx:3,fill:'#d8c49a',stroke:'#8a6a3a','stroke-width':1.5},g);for(let k=1;k<4;k++)el('line',{x1:-24+k*12,x2:-24+k*12,y1:-34,y2:-4,stroke:'#8a6a3a',opacity:.5},g);el('path',{d:'M6,-26 l5,5 m0,-5 l-5,5',stroke:'#c0402a','stroke-width':2},g)}},
  tiles:{top:'#5a3f2c',draw(g){const C=['#8fd6ff','#ffb34d','#ff9ed2','#8ff0c8'];for(let i=0;i<4;i++)for(let j=0;j<2;j++)el('rect',{x:-22+i*11,y:-26+j*11,width:10,height:10,rx:1.5,fill:C[(i+j)%4]},g)}},
  pens:{top:'#3a5a2a',draw(g){el('rect',{x:-22,y:-28,width:44,height:22,fill:'#5aa04a',stroke:'#8a5a2a','stroke-width':2.5},g);sheep(g,-6,-18,.6);sheep(g,10,-15,.5)}},
  boxes:{top:'#6a4a62',draw(g){el('path',{d:'M0,-40 l16,8 v18 l-16,8 l-16,-8 v-18Z',fill:'#ffb34d',stroke:'#7a4a2e','stroke-width':1.2},g);el('path',{d:'M-16,-32 l16,8 l16,-8 M0,-24 v18',stroke:'#7a4a2e','stroke-width':1.2,fill:'none'},g);el('path',{d:'M-16,-32 l16,8 v18 l-16,-8Z',fill:'#ff9ed2',opacity:.8},g)}},
  kraken:{top:'#3a5a8a',draw(g){const k=krakenFig(el('g',{transform:'translate(0,-24) scale(.3)'},g));}},
  beads:{top:'#7a3a5a',draw(g){el('path',{d:'M-30,-18 Q0,0 30,-18',fill:'none',stroke:'#d8c6e4','stroke-width':1.5},g);[-24,-12,0,12,24].forEach((x,i)=>bead(g,x,-14+Math.abs(x)*-.25+6,i<2?PAINT.red:PAINT.blue,6))}},
  paint:{top:'#7a5a3a',draw(g){el('rect',{x:-14,y:-44,width:28,height:40,rx:6,fill:'rgba(255,244,230,.2)',stroke:'#e8dcc8','stroke-width':1.5},g);el('rect',{x:-12,y:-18,width:24,height:12,rx:3,fill:PAINT.red},g);el('rect',{x:-12,y:-30,width:24,height:12,fill:'#fbf6ee'},g);el('rect',{x:-12,y:-36,width:24,height:6,fill:'#ff9ab0'},g)}},
  split:{top:'#6a6a3a',draw(g){[[-27,-34,3,'#ffd23a'],[-27,-18,2,'#ffb34d']].forEach(([x,y,n,c])=>{for(let k=0;k<n;k++)el('rect',{x:x+k*16,y,width:15,height:13,fill:c,stroke:'#7a5a2a','stroke-width':1},g)})}},
  pancakes:{top:'#3a6a4a',draw(g){el('ellipse',{cx:0,cy:-8,rx:26,ry:6,fill:'#e8dcc8'},g);[0,1,2].forEach(k=>el('ellipse',{cx:0,cy:-14-k*7,rx:20,ry:5.5,fill:['#e0a64a','#eab35a','#f2c26a'][k]},g));el('path',{d:'M-6,-34 q6,-8 12,0',fill:'#ffd23a'},g)}},
  giant:{top:'#3a5a7a',draw(g){el('rect',{x:-6,y:-50,width:30,height:44,rx:2,fill:'none',stroke:'#c9a24a','stroke-width':3},g);kaiFig(g,.32,'#4aa0ff').put(9,-28);el('rect',{x:-30,y:-22,width:14,height:20,rx:1,fill:'none',stroke:'#c9a24a','stroke-width':2},g)}},
  river:{top:'#4a3a6a',draw(g){const m=el('g',{transform:'translate(0,-6) scale(.62)'},g);el('rect',{x:-30,y:-44,width:60,height:40,rx:4,fill:'#d8c49a'},m);el('path',{d:'M-4,-44 q-6,10 0,20 t0,20 h12 q-6,-10 0,-20 t0,-20z',fill:'#4a8ad0'},m);el('path',{d:'M-12,-24 h32',stroke:'#7a4a2e','stroke-width':4},m)}},
  smudge:{top:'#4a4a5a',draw(g){const s=smudgeFig(el('g',{transform:'translate(0,-26) scale(.36)'},g))}},
  parts:{top:'#3a5a7a',draw(g){g=el('g',{transform:'translate(-22,0)'},g);el('path',{d:'M-6,-14 L0,-40 L6,-14Z',fill:'#6a4a3a'},g);el('rect',{x:-26,y:-44,width:52,height:5,rx:2,fill:'#c9a24a'},g);[-22,22].forEach(x=>el('path',{d:`M${x-10},-30 Q${x},-24 ${x+10},-30Z`,fill:'#c9a24a'},g));el('path',{d:'M-28,-32 q4,-12 10,-2Z',fill:'#a8743a'},g);[16,22,28].forEach(x=>el('circle',{cx:x,cy:-34,r:3,fill:'#8fd6ff'},g))}},
  compare:{top:'#5a3a6a',draw(g){for(let k=0;k<3;k++)el('rect',{x:-22,y:-24-k*10,width:16,height:10,fill:'#8fd6ff',stroke:'#4a7aa0'},g);el('rect',{x:4,y:-24,width:16,height:10,fill:'#ff9ed2',stroke:'#a05a7a'},g);[[-14,-58],[12,-28]].forEach(([x,y])=>el('circle',{cx:x,cy:y+4,r:5,fill:'#f4c8a0'},g))}},
  times:{top:'#3a6a5a',draw(g){el('path',{d:'M-4,-14 L0,-22 L4,-14Z',fill:'#6a4a3a'},g);el('rect',{x:-30,y:-25,width:60,height:4,rx:2,fill:'#c9945e'},g);el('ellipse',{cx:-20,cy:-31,rx:9,ry:6,fill:'#c8945e'},g);[8,16,24].forEach(x=>el('ellipse',{cx:x,cy:-29,rx:4,ry:3,fill:'#ffb36a'},g))}},
  ferry:{top:'#2a5a7a',draw(g){el('path',{d:'M-28,-18 h56 l-8,12 h-40z',fill:'#c9413a'},g);el('rect',{x:-14,y:-32,width:28,height:14,rx:3,fill:'#fff4e6'},g);[-8,0,8].forEach(x=>el('circle',{cx:x,cy:-38,r:4,fill:'#ffc04d'},g))}},
  steps:{top:'#6a5a3a',draw(g){el('rect',{x:-24,y:-40,width:48,height:26,rx:3,fill:'#e8413e'},g);el('path',{d:'M-28,-40 h56 l-6,-8 h-44Z',fill:'#fff4e6'},g);[[-14,'#ffd23a'],[0,'#ffd23a'],[14,'#8fd6a0']].forEach(([x,c])=>el('circle',{cx:x,cy:-27,r:5,fill:c},g))}},
  machine:{top:'#4a3a7a',draw(g){g=el('g',{transform:'translate(12,0)'},g);el('rect',{x:-20,y:-46,width:40,height:30,rx:6,fill:'#9a6cff'},g);[-8,8].forEach(x=>el('circle',{cx:x,cy:-31,r:5,fill:'#fff0a0'},g))}},
  swap:{top:'#7a6a4a',draw(g){moneyPiece(g,-30,-26,10,{s:.8});moneyPiece(g,-12,-30,100,{s:.8})}},
  tuck:{top:'#6a4a3a',draw(g){el('rect',{x:-18,y:-30,width:36,height:16,fill:'#a8743a'},g);el('path',{d:'M-22,-30 L22,-30 L18,-42 H-18Z',fill:'#e8413e'},g)}},
  change:{top:'#4a6a7a',draw(g){el('rect',{x:-22,y:-26,width:44,height:8,rx:3,fill:'#8fd6ff'},g);moneyPiece(g,-10,-34,50,{s:.6});moneyPiece(g,10,-34,100,{s:.6})}},
  loot:{top:'#7a5a3a',draw(g){moneyPiece(g,0,-30,10000,{s:.65})}},
  rug:{top:'#5a3a5a',draw(g){el('rect',{x:-18,y:-40,width:36,height:24,fill:'#c9413a'},g);el('path',{d:'M-18,-28 H18 M2,-40 V-16',stroke:'#fff0a0','stroke-width':1.5,'stroke-dasharray':'3 2'},g)}},
  save:{top:'#3a5a6a',draw(g){g=el('g',{transform:'translate(14,0)'},g);el('rect',{x:-10,y:-44,width:20,height:26,rx:4,fill:'#e8f4ff',stroke:'#8aa0b8','stroke-width':1.5},g);el('rect',{x:-8,y:-30,width:16,height:10,rx:2,fill:'#ffd23a'},g)}},
  tally:{top:'#5a7a4a',draw(g){el('rect',{x:-20,y:-44,width:40,height:28,rx:3,fill:'#fffaf0',stroke:'#c9a77a','stroke-width':1.5},g);tallyMarks(g,-14,-30,5,{h:16,dx:5,w:2})}},
  picto:{top:'#6a5a3a',draw(g){[-12,0,12].forEach(x=>animalIcon(g,x,-30,'hen',.5))}},
  bars:{top:'#4a5a7a',draw(g){[[-14,14,'#4aa0ff'],[0,24,'#e8813a'],[14,10,'#7fc86a']].forEach(([x,h,c])=>el('rect',{x:x-5,y:-18-h,width:10,height:h,fill:c},g))}},
  grow:{top:'#5a7a3a',draw(g){sunflowerFig(g,0,-16,30,{s:.8})}},
  fudge:{top:'#7a4a3a',draw(g){const f=fudgeFig(el('g',{transform:'translate(0,-34) scale(.32)'},g),{s:1});f.tick(0)}},
  grabbit:{top:'#3a4a6a',draw(g){const c=grabbitFig(el('g',{transform:'translate(0,-30) scale(.3)'},g),{s:1});c.tick(0)}},
  sun:{top:'#5a8a4a',draw(g){el('circle',{cy:-30,r:15,fill:'#fff8ec',stroke:'#c9a24a','stroke-width':3},g);el('path',{d:'M0,-30 L8,-38',stroke:'#3a2418','stroke-width':3.5,'stroke-linecap':'round'},g);el('circle',{cx:20,cy:-48,r:6,fill:'#ffd23a'},g)}},
  pie:{top:'#6a4a3a',draw(g){el('circle',{cy:-28,r:15,fill:'#f4c070',stroke:'#c9a24a','stroke-width':2},g);el('path',{d:'M0,-28 V-43 A15,15 0 0 1 15,-28Z',fill:'#2a2245'},g);[[-6,-24],[3,-18],[-7,-34]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:2.5,fill:'#e8413e'},g))}},
  lap:{top:'#4a6a5a',draw(g){el('circle',{cy:-28,r:15,fill:'none',stroke:'#c9a24a','stroke-width':2.5,'stroke-dasharray':'4 3'},g);el('path',{d:'M-6,-14 q0,-8 7,-8 q7,0 7,6 q0,2 -2,2Z',fill:'#ffb36a'},g)}},
  rail:{top:'#6a7a4a',draw(g){el('path',{d:'M-24,-18 H24',stroke:'#7a5a4a','stroke-width':3},g);el('rect',{x:-14,y:-32,width:22,height:12,rx:3,fill:'#e8413e'},g);[-9,3].forEach(x=>el('circle',{cx:x,cy:-19,r:3,fill:'#3a2418'},g));el('path',{d:'M-20,-42 q10,-6 20,0 t20,0',stroke:'#ff9ed2','stroke-width':3,fill:'none'},g)}},
  sand:{top:'#7a5a3a',draw(g){el('path',{d:'M-8,-46 Q-8,-36 0,-32 Q-8,-28 -8,-18 H8 Q8,-28 0,-32 Q8,-36 8,-46Z',fill:'#e8f4ff',stroke:'#8aa0b8','stroke-width':1.5},g);el('path',{d:'M-5,-20 Q0,-26 5,-20Z',fill:'#ffd23a'},g);el('path',{d:'M-11,-46 H11 M-11,-18 H11',stroke:'#a8743a','stroke-width':3},g)}},
  frog:{top:'#3a6a6a',draw(g){el('ellipse',{cy:-20,rx:18,ry:6,fill:'#4a9a3a'},g);el('ellipse',{cy:-27,rx:9,ry:7,fill:'#7fc86a'},g);[-4,4].forEach(x=>el('circle',{cx:x,cy:-34,r:3,fill:'#7fc86a'},g))}},
  snooze:{top:'#3a2a3a',draw(g){const s=snoozeFig(el('g',{transform:'translate(0,-30) scale(.3)'},g),{s:1});s.tick(0)}},
  inkblot:{top:'#2a2440',draw(g){inkblotFig(el('g',{transform:'translate(0,-28) scale(.34)'},g))}},
};
function dioRock(g,top){el('path',{d:'M-37,0 Q-31,14 -17,22 Q-7,40 2,45 Q10,35 18,22 Q32,13 37,0Z',fill:'#2a1f48'},g);el('path',{d:'M-14,20 Q-4,34 2,45 Q6,30 14,22',fill:'#3b2b63',opacity:.8},g);
  el('ellipse',{cx:0,cy:0,rx:37,ry:10.5,fill:darker(top,.75)},g);el('ellipse',{cx:0,cy:-1.5,rx:35,ry:9,fill:top},g);el('ellipse',{cx:-10,cy:-4,rx:16,ry:3,fill:'#fff',opacity:.1},g)}
/* one island node: diorama + its state (locked in mist, next with a beacon, cleared with a flag) */
function islandNode(parent,w,{x,y,s=1,label=true,beam=230}){const P=mine(),open=isOpen(w),clr=P.cleared.includes(w),next=!grown()&&w===frontier(worldOf(w).id)&&!clr;
  const g=el('g',{},parent),inner=el('g',{},g),D=DIO[w];
  if(next){el('rect',{x:-16,y:-beam,width:32,height:beam,fill:'url(#gBeam)'},inner);el('ellipse',{cx:0,cy:-2,rx:46,ry:16,fill:'none',stroke:'#fff0a0','stroke-width':2.5,class:'ring'},inner)}
  if(clr)el('ellipse',{cx:0,cy:4,rx:48,ry:22,fill:'#ffd27a',opacity:.22,filter:'url(#glow)'},inner);
  const body=el('g',{},inner);dioRock(body,D.top);D.draw(body);
  if(!open){body.setAttribute('filter','url(#fLock)');body.setAttribute('opacity',.55);
    const m=el('g',{},inner);[[-20,-16,26,9],[16,-24,24,8],[0,-6,34,8]].forEach(([cx,cy,rx,ry],j)=>{const e=el('ellipse',{cx,cy,rx,ry,fill:'#e6dcf5',opacity:.3},m);e.classList.add('mote');e.style.animationDelay=(-j*2.1-x*.01)+'s'});
    const lk=el('g',{transform:'translate(0,-20)'},inner);el('circle',{r:10,fill:'#2c2356',stroke:'rgba(201,184,238,.6)','stroke-width':1.5},lk);el('rect',{x:-5,y:-2,width:10,height:8,rx:2,fill:'#c9b8ee'},lk);el('path',{d:'M-3,-2 v-3 a3,3 0 0 1 6,0 v3',fill:'none',stroke:'#c9b8ee','stroke-width':1.8},lk)}
  if(clr){el('path',{d:'M30,-2 V-42',stroke:'#e8dcc0','stroke-width':1.8},inner);const f=el('path',{d:'M30,-42 L46,-37 L30,-31Z',fill:'#ffc04d',stroke:'#fff0a0','stroke-width':1},inner);el('path',{d:'M36,-39.5 l1,2 2.2,.3 -1.6,1.5 .4,2.2 -2,-1.1 -2,1.1 .4,-2.2 -1.6,-1.5 2.2,-.3Z',fill:'#fff6d0'},inner)}
  if(label){const t=el('text',{x:0,y:62,'text-anchor':'middle','font-size':14,'font-weight':600,fill:'#fff4e6',opacity:open?1:.55,stroke:'#1d1840','stroke-width':3.5,'paint-order':'stroke'},inner);t.textContent=WNAME[w]}
  g.setAttribute('transform',`translate(${x},${y}) scale(${s})`);return{g,open,clr,next}}
/* a rope bridge between two islands; lit gold once the first is cleared */
function bridge(parent,a,b,lit,s=1){const x0=a.x+(b.x-a.x)*.3,y0=a.y+(b.y-a.y)*.3+3*s,x1=a.x+(b.x-a.x)*.7,y1=a.y+(b.y-a.y)*.7+3*s,mx=(x0+x1)/2,my=(y0+y1)/2+10*s,g=el('g',{},parent);
  const col=lit?'#ffd27a':'rgba(201,184,238,.35)';
  el('path',{d:`M${x0},${y0} Q${mx},${my} ${x1},${y1}`,fill:'none',stroke:col,'stroke-width':1.6*s},g);el('path',{d:`M${x0},${y0-6*s} Q${mx},${my-6*s} ${x1},${y1-6*s}`,fill:'none',stroke:col,'stroke-width':1.1*s,opacity:.7},g);
  for(let k=1;k<6;k++){const t=k/6,px=(1-t)*(1-t)*x0+2*(1-t)*t*mx+t*t*x1,py=(1-t)*(1-t)*y0+2*(1-t)*t*my+t*t*y1;el('path',{d:`M${px.toFixed(1)},${py.toFixed(1)} v${(-6*s).toFixed(1)}`,stroke:lit?'#c9a24a':'rgba(201,184,238,.3)','stroke-width':2*s},g)}
  if(lit)el('path',{d:`M${x0},${y0} Q${mx},${my} ${x1},${y1}`,fill:'none',stroke:'#fff0a0','stroke-width':4*s,opacity:.18,filter:'url(#glow)'},g);return g}
/* the player's hot-air balloon, in their creature's colour */
function balloon(parent,ci){const g=el('g',{},parent),inner=el('g',{},g),col=CCOL[ci%CCOL.length];
  el('path',{d:'M-6,-4 L-8,9 M6,-4 L8,9',stroke:'#c9a77a','stroke-width':1.2},inner);
  const cr=creature(inner,{x:0,y:6,r:8,i:ci,label:'',shadow:false});CREATS.delete(cr);
  el('path',{d:'M-10,8 h20 l-2,10 h-16Z',fill:'#a8743a',stroke:'#6a4420','stroke-width':1},inner);el('path',{d:'M-9,12 h18',stroke:'#6a4420','stroke-width':.8},inner);
  el('path',{d:'M0,-62 C24,-62 32,-42 28,-28 C24,-15 11,-9 6,-4 L-6,-4 C-11,-9 -24,-15 -28,-28 C-32,-42 -24,-62 0,-62Z',fill:col},inner);
  el('path',{d:'M0,-62 C9,-54 10,-16 4,-4 L-4,-4 C-10,-16 -9,-54 0,-62Z',fill:'#fff4e6',opacity:.6},inner);
  el('path',{d:'M-14,-58 C-26,-48 -26,-24 -10,-8',fill:'none',stroke:'#fff4e6','stroke-width':3,opacity:.35},inner);el('ellipse',{cx:-10,cy:-48,rx:5,ry:9,fill:'#fff',opacity:.3,transform:'rotate(20 -10 -48)'},inner);
  el('rect',{x:-6,y:-6,width:12,height:3,rx:1.5,fill:darker(col,.7)},inner);
  return{g,inner,cr}}
/* dive into a world or island: a CSS transform on the whole stage, so the browser's compositor runs it smoothly
   (scaling the SVG itself redraws every glow and blur each frame, which stutters on phones) */
function flyTo(all,x,y,done){SFX.whoosh();SFX.shimmer();const sv=document.getElementById('stage'),wrap=sv.parentNode;
  if(!sv.animate){tween(700,(t,p)=>{const s=1+t*2.6;all.setAttribute('transform',`translate(${(x-x*s).toFixed(1)},${(y-y*s).toFixed(1)}) scale(${s.toFixed(3)})`);all.setAttribute('opacity',(1-p*p).toFixed(2))},done,ease.in);return}
  const r=sv.getBoundingClientRect(),m=sv.getScreenCTM(),px=m.a*x+m.e-r.left,py=m.d*y+m.f-r.top;
  wrap.style.overflow='hidden';sv.style.transformOrigin=`${px.toFixed(1)}px ${py.toFixed(1)}px`;sv.style.willChange='transform,opacity';
  const a=sv.animate([{transform:'scale(1)',opacity:1},{transform:'scale(3.6)',opacity:0}],{duration:700,easing:'cubic-bezier(.55,0,.85,.45)',fill:'forwards'});
  /* undo the zoom before the next scene is built, so anything that measures the stage (the dock) sees its true size */
  a.onfinish=()=>{sv.style.opacity='0';a.cancel();sv.style.transformOrigin='';sv.style.willChange='';wrap.style.overflow='';done&&done();
    requestAnimationFrame(()=>{const b=sv.animate([{opacity:0},{opacity:1}],{duration:320,easing:'ease-out'});sv.style.opacity=''})}}
