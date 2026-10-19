/* ================= The Pirate Isles: Polly the parrot, and Captain Grabbit =================
   Money. Amounts are kept in pence. Coins and notes are drawn as the real thing, so most of the maths is
   swapping, laying out and sharing things rather than writing sums. */
const fmtP=v=>v<100?`${v}p`:v%100?`£${(v/100).toFixed(2)}`:`£${v/100}`;
const COINS=[1,2,5,10,20,50,100,200];
/* a coin, note or bag of money (v in pence) */
function moneyPiece(parent,x,y,v,{s=1}={}){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),t=fmtP(v);
  if(v>=10000){el('path',{d:'M-20,16 Q-26,-6 -10,-12 L-6,-20 H6 L10,-12 Q26,-6 20,16Z',fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':2},g);el('path',{d:'M-7,-16 q7,5 14,0',stroke:'#7a4a2e','stroke-width':3,fill:'none'},g);
    el('text',{y:8,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#3a2418'},g).textContent=t}
  else if(v>=500){const col={500:'#6ac8b8',1000:'#e8a060',2000:'#9a7ad0',5000:'#e86a5a'}[v]||'#8fd6a0';el('rect',{x:-27,y:-15,width:54,height:30,rx:3,fill:col,stroke:darker(col,.6),'stroke-width':2},g);
    el('circle',{cx:-14,cy:0,r:7,fill:'#fff',opacity:.35},g);el('text',{x:8,y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#241a1a'},g).textContent=t}
  else{const r={1:10,2:12.5,5:9.5,10:13,20:12,50:15,100:13.5,200:16}[v],col=v<=2?'#c8805a':v<100?'#d8dce4':'#ffd23a',edge=v<=2?'#8a4a2a':v<100?'#8a92a8':'#a8743a';
    if(v===20||v===50){const pts=[...Array(7)].map((_,i)=>{const a=i/7*Math.PI*2-Math.PI/2;return `${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`}).join(' ');el('polygon',{points:pts,fill:col,stroke:edge,'stroke-width':2},g)}
    else{el('circle',{r,fill:v===200?'#d8dce4':col,stroke:edge,'stroke-width':2},g);if(v===200)el('circle',{r:r*.68,fill:'#ffd23a'},g)}
    el('text',{y:r*.36,'text-anchor':'middle','font-size':Math.max(8.5,r*.8),'font-weight':800,fill:'#3a2418'},g).textContent=t}
  return g}
/* Polly the parrot, the guide */
function pollyFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  el('path',{d:'M-6,28 l-8,22 l10,-8 l4,12 l4,-12 l10,8 l-8,-22Z',fill:'#4aa0ff'},b);el('ellipse',{cx:0,cy:10,rx:16,ry:22,fill:'#e8413e',stroke:'#a82424','stroke-width':2},b);
  el('path',{d:'M-14,4 q-10,14 -4,26 q8,-6 10,-18Z',fill:'#ffd23a'},b);el('circle',{cx:2,cy:-14,r:13,fill:'#e8413e',stroke:'#a82424','stroke-width':2},b);
  el('circle',{cx:6,cy:-17,r:4.5,fill:'#fff'},b);el('circle',{cx:7,cy:-17,r:2.2,fill:'#241a3a'},b);el('path',{d:'M12,-14 q12,0 8,12 q-4,-6 -10,-4Z',fill:'#3a2418'},b);
  const o={g,x:0,y:0,put(x,y){if(x!=null)o.x=x;if(y!=null)o.y=y;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`)},
    cheer(){SFX.chime&&0;if(RM)return;tween(600,(t,p)=>g.setAttribute('transform',`translate(${o.x},${(o.y-Math.sin(p*Math.PI)*12).toFixed(1)}) rotate(${(Math.sin(p*Math.PI*4)*8).toFixed(1)})`),()=>o.put())}};
  o.put(0,0);return o}
function pollyGuide(parent){const k=pollyFig(parent,.55),p0=k.put;k.put=(x,y)=>p0(x==null?x:x-10,y==null?y:y-2);k.put(170,48);return k}
/* Captain Grabbit: a greedy crab in a pirate hat, sat on the treasure */
function grabbitFig(parent,{s=1}={}){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  [-1,1].forEach(sd=>{for(let k=0;k<3;k++)el('path',{d:`M${sd*30},${10+k*8} q${sd*20},4 ${sd*30},${16+k*4}`,fill:'none',stroke:'#c9413a','stroke-width':5,'stroke-linecap':'round'},b)});
  const claws=[-1,1].map(sd=>{const c=el('g',{transform:`translate(${sd*44},-14)`},b);el('path',{d:`M0,14 q${sd*-6},-10 0,-16`,stroke:'#c9413a','stroke-width':6,fill:'none'},c);el('path',{d:'M-12,-8 q0,-16 12,-16 q12,0 12,14 l-10,-4 l-2,8Z',fill:'#e8413e',stroke:'#8a2424','stroke-width':2},c);return c});
  el('ellipse',{cx:0,cy:8,rx:38,ry:26,fill:'#e8413e',stroke:'#8a2424','stroke-width':3},b);
  [-12,12].forEach(x=>{el('line',{x1:x,x2:x,y1:-12,y2:-26,stroke:'#8a2424','stroke-width':3},b);el('circle',{cx:x,cy:-28,r:7,fill:'#fff',stroke:'#8a2424','stroke-width':2},b)});
  const pup=[-12,12].map(x=>el('circle',{cx:x+1,cy:-28,r:3.2,fill:'#241a3a'},b));const mouth=el('path',{d:'M-10,12 q10,8 20,0',fill:'none',stroke:'#5a1a1a','stroke-width':3,'stroke-linecap':'round'},b);
  el('path',{d:'M-30,-34 Q0,-56 30,-34 Q20,-30 0,-32 Q-20,-30 -30,-34Z',fill:'#241a3a'},b);el('path',{d:'M-6,-44 l3,-3 l3,3 l3,-3 l3,3',stroke:'#fff',fill:'none','stroke-width':1.5},b);
  let sc=1;return{g,
    tick(t){b.setAttribute('transform',`scale(${(s*sc).toFixed(3)})`);claws.forEach((c,i)=>{const sd=i?1:-1;c.setAttribute('transform',`translate(${sd*44},${(-14+Math.sin(t*3+i)*3).toFixed(1)}) rotate(${(Math.sin(t*2.4+i)*8).toFixed(1)})`)})},
    mood(m){mouth.setAttribute('d',m==='sad'?'M-10,16 q10,-8 20,0':m==='oh'?'M-5,12 a5,5 0 1 0 0.1,0':'M-10,12 q10,8 20,0')},
    shrink(){sc=Math.max(.7,sc-.05)},grow(){sc=Math.min(1,sc+.05)}}}
/* the treasure chest */
function chestFig(parent,{open=false}={}){const g=el('g',{},parent);
  el('rect',{x:-44,y:-10,width:88,height:50,rx:6,fill:'#8a5a34',stroke:'#4a2a14','stroke-width':3},g);[-30,30].forEach(x=>el('rect',{x:x-4,y:-10,width:8,height:50,fill:'#c9a24a'},g));
  if(open){el('path',{d:'M-44,-10 L-40,-46 H40 L44,-10Z',fill:'#6a3a1a',stroke:'#4a2a14','stroke-width':3},g);[[-24,-16],[-6,-20],[12,-16],[28,-14],[0,-12]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:9,fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},g)});el('circle',{cx:-10,cy:-24,r:6,fill:'#e8413e'},g)}
  else{el('path',{d:'M-44,-10 Q0,-44 44,-10Z',fill:'#7a4a24',stroke:'#4a2a14','stroke-width':3},g);el('rect',{x:-8,y:-14,width:16,height:16,rx:3,fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':2},g)}
  return{g,tick(){}}}
/* in the middle of the Pirate Isles: Captain Grabbit on the chest, or the chest open */
function coveCentreFig(parent,{won=false}={}){const g=el('g',{},parent),c=chestFig(g,{open:won});let cr=null;if(!won){cr=grabbitFig(g,{s:.55});cr.g.setAttribute('transform','translate(0,-44)')}
  return{g,tick(t){if(cr)cr.tick(t)}}}

/* ---------- scenes ---------- */
SCENE_X.cove=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#8fd0f0'},o);el('rect',{x:-700,y:300,width:2000,height:260,fill:'#3a9ac8'},o);
  for(let i=0;i<24;i++)el('path',{d:`M${-600+((i*131)%1800)},${320+((i*53)%200)} q12,-6 24,0`,stroke:'#cfefff','stroke-width':2.5,fill:'none',opacity:.5},o);
  el('path',{d:'M-700,470 Q0,440 700,470 T1300,465 V800 H-700Z',fill:'#f0d890'},o);
  [[-80,470],[640,460]].forEach(([x,y])=>{el('path',{d:`M${x},${y} q10,-90 30,-170`,stroke:'#8a5a34','stroke-width':10,fill:'none'},o);[[-50,-10],[50,-6],[-30,24],[40,26]].forEach(([dx,dy])=>el('path',{d:`M${x+30},${y-170} q${dx},${dy-20} ${dx*1.6},${dy+10}`,stroke:'#4a9a3a','stroke-width':9,fill:'none','stroke-linecap':'round'},o))})};
AMB_X.cove=()=>{const r=Math.random();if(r<.6)noise(1.4,.03,{type:'lowpass',f:700,a:.6,wet:.4});else osc('sine',1500+Math.random()*600,.1,.006,{to:1900,wet:.6})};
SCENE_X.bank=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#3a2e2a'},o);for(let x=-700;x<1300;x+=90)el('rect',{x,y:80,width:30,height:440,fill:'#4a3a32'},o);el('rect',{x:-700,y:520,width:2000,height:300,fill:'#5a4232'},o)};
AMB_X.bank=()=>{osc('sine',2200+Math.random()*600,.05,.006,{wet:.6})};
