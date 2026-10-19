/* ================= The Clockwork Isles: Tock the cuckoo, and the Snooze =================
   Time, mostly without numbers: hands that turn, pizza slices, a snail's lap, ribbons, sand timers and a frog on lily pads.
   Times are kept as minutes after 12 o'clock (t), so winding a hand forwards just adds minutes. */
const TIME_COL='#ffc04d';
const capF=s=>s[0].toUpperCase()+s.slice(1);
const tH=t=>{const h=Math.floor((((t%720)+720)%720)/60);return h===0?12:h};
const tM=t=>(((t%60)+60)%60);
const digi=t=>`${tH(t)}:${String(tM(t)).padStart(2,'0')}`;
function tWords(t){const m=tM(t),h=tH(t),nx=h%12+1;return m===0?`${h} o’clock`:m===30?`half past ${h}`:m===15?`quarter past ${h}`:m===45?`quarter to ${nx}`:m<30?`${m} past ${h}`:`${60-m} to ${nx}`}
function spanWords(d){const h=Math.floor(d/60),m=d%60,q={0:'',15:'a quarter',30:'a half',45:'three quarters'}[m]??`${m} minutes`;
  if(!h)return m===30?'half an hour':m===15?'a quarter of an hour':m===45?'three quarters of an hour':`${m} minutes`;
  return `${h===1?'an hour':`${h} hours`}${m?` and ${q}`:''}`}

/* Tock: a cuckoo in a little clock house, who pops out to cuckoo */
function tockFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  el('path',{d:'M-26,-6 L0,-30 L26,-6Z',fill:'#8a4a2e',stroke:'#5a2e1a','stroke-width':2},b);el('rect',{x:-22,y:-8,width:44,height:40,rx:3,fill:'#c98a4a',stroke:'#7a4a2e','stroke-width':2},b);
  el('rect',{x:-11,y:-2,width:22,height:20,rx:3,fill:'#3a2418'},b);const bird=el('g',{},b);
  el('ellipse',{cx:0,cy:8,rx:10,ry:8,fill:'#ffc04d',stroke:'#c98a1a','stroke-width':1.5},bird);el('circle',{cx:4,cy:3,r:2.2,fill:'#241a3a'},bird);el('path',{d:'M9,5 l8,2 l-8,3Z',fill:'#ff7a3a'},bird);el('path',{d:'M-6,4 q-6,-8 -2,-12 q3,4 4,8',fill:'#ff9ed2'},bird);
  [-14,14].forEach(x=>el('line',{x1:x,x2:x,y1:32,y2:46,stroke:'#c9a24a','stroke-width':2},b));[-14,14].forEach(x=>el('ellipse',{cx:x,cy:50,rx:4,ry:6,fill:'#c9a24a'},b));
  const o={g,x:0,y:0,put(x,y){if(x!=null)o.x=x;if(y!=null)o.y=y;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`)},
    pop(){if(RM)return;tween(420,(t,p)=>bird.setAttribute('transform',`translate(${(Math.sin(p*Math.PI)*16).toFixed(1)},0)`))},
    cheer(){o.pop();cuckooSound()},
    cuckoo(n,done){let k=0;const f=()=>{if(k>=n){done&&done();return}k++;o.pop();cuckooSound();later(520,f)};f()}};
  o.put(0,0);return o}
function cuckooSound(){osc('sine',660,.16,.06,{to:640,wet:.3});osc('sine',520,.22,.06,{to:500,wet:.3,at:.18})}
function tockGuide(parent){const k=tockFig(parent,.62),p0=k.put;k.put=(x,y)=>p0(x==null?x:x-10,y==null?y:y-4);k.put(170,48);return k}

/* a clock face. set(t) moves the hands; hour/minute hands can be hidden; pie=n draws a pizza face cut in n slices */
function clockKit(parent,{x,y,r=90,nums=true,minute=true,hour=true,face='#fff8ec',rim='#c9a24a',pie=0,ticks=true,numR=.76,numS=.2}={}){const g=el('g',{transform:`translate(${x},${y})`},parent);let T=0;
  el('circle',{r:r+8,fill:rim,stroke:darker(rim,.6),'stroke-width':3},g);const fc=el('circle',{r,fill:pie?'#f4c070':face},g);
  const pieL=el('g',{},g);
  if(ticks)for(let i=0;i<60;i++){const a=i*6*Math.PI/180,big=i%5===0;el('line',{x1:Math.sin(a)*(r-(big?11:5)),y1:-Math.cos(a)*(r-(big?11:5)),x2:Math.sin(a)*(r-1),y2:-Math.cos(a)*(r-1),stroke:'#3a2418','stroke-width':big?2.5:1,opacity:pie?.0:big?.9:.4},g)}
  const numL=el('g',{},g);if(nums)for(let i=1;i<=12;i++){const a=i*30*Math.PI/180;el('text',{x:Math.sin(a)*r*numR,y:-Math.cos(a)*r*numR+r*numS*.36,'text-anchor':'middle','font-size':r*numS,'font-weight':800,fill:'#3a2418'},numL).textContent=i}
  const hh=el('g',{},g);el('rect',{x:-5,y:-r*.52,width:10,height:r*.52+8,rx:5,fill:'#3a2418',stroke:'#fff8ec','stroke-width':1.5},hh);
  const mh=el('g',{},g);el('rect',{x:-3,y:-r*.82,width:6,height:r*.82+10,rx:3,fill:'#2a2245',stroke:'#fff8ec','stroke-width':1.5},mh);el('circle',{r:7,fill:'#3a2418'},g);
  hh.style.display=hour?'':'none';mh.style.display=minute?'':'none';
  const o={g,x,y,r,pieL,numL,hh,mh,get:()=>T,
    set(t){T=t;hh.setAttribute('transform',`rotate(${((t/2)%360).toFixed(2)})`);mh.setAttribute('transform',`rotate(${((t%60)*6).toFixed(2)})`)},
    show({hour:h,minute:m}){if(h!=null)hh.style.display=h?'':'none';if(m!=null)mh.style.display=m?'':'none'},
    /* glide the hands from now to t2 */
    glide(t2,ms=900,done){const t0=T;tween(ms,(t,p)=>o.set(t0+(t2-t0)*ease.inOut(p)),()=>{o.set(t2);done&&done()})},
    angleAt(p){return(Math.atan2(p.x-x,-(p.y-y))*180/Math.PI+360)%360}};
  if(pie){/* drawn by the island */}
  o.set(0);return o}
/* drag the hour hand: the time snaps to snap minutes round a 12-hour face */
function dragHour(ck,{snap=15,label='Clock: drag the hour hand',onChange,can=()=>true}){const hit=el('circle',{cx:ck.x,cy:ck.y,r:ck.r+12,fill:'transparent'},ck.g.parentNode);
  const at=p=>{const t=Math.round(ck.angleAt(p)*2/snap)*snap%720;if(t!==((ck.get()%720)+720)%720){ck.set(t);SFX.tick(t/60%10);onChange&&onChange(t)}};
  interact(hit,{label,down:p=>{if(can())at(p);return{}},move:p=>{if(can())at(p)},tap:p=>{if(p&&can())at(p)}});
  hit.addEventListener('keydown',e=>{if(!can())return;const d=e.key==='ArrowRight'||e.key==='ArrowUp'?snap:e.key==='ArrowLeft'||e.key==='ArrowDown'?-snap:0;if(!d)return;e.preventDefault();const t=((ck.get()+d)%720+720)%720;ck.set(t);SFX.tick(3);onChange&&onChange(t)});return hit}
/* wind the minute hand: dragging round adds or takes away minutes, and the hour hand follows like a real clock */
function dragWind(ck,{snap=15,label='Clock: wind the minute hand round',onChange,can=()=>true,min=-1e9,max=1e9}){const hit=el('circle',{cx:ck.x,cy:ck.y,r:ck.r+12,fill:'transparent'},ck.g.parentNode);let last=null,acc=0;
  const fin=()=>{const t=clamp(Math.round(acc/snap)*snap,min,max);if(t!==ck.get()){ck.set(t);SFX.tick(Math.abs(t/snap)%8);onChange&&onChange(t)}};
  interact(hit,{label,down:p=>{if(!can())return{};last=ck.angleAt(p);acc=ck.get();return{}},move:p=>{if(!can()||last==null)return;const a=ck.angleAt(p);let d=a-last;if(d>180)d-=360;if(d<-180)d+=360;last=a;acc+=d/6;acc=clamp(acc,min-snap,max+snap);fin()},up:()=>{last=null},tap:()=>{last=null}});
  hit.addEventListener('keydown',e=>{if(!can())return;const d=e.key==='ArrowRight'||e.key==='ArrowUp'?snap:e.key==='ArrowLeft'||e.key==='ArrowDown'?-snap:0;if(!d)return;e.preventDefault();acc=clamp(ck.get()+d,min,max);fin()});return hit}

/* the Snooze: a big sleepy sloth who stopped every clock */
function snoozeFig(parent,{s=1}={}){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  el('ellipse',{cx:0,cy:10,rx:58,ry:40,fill:'#8a7058',stroke:'#5a4630','stroke-width':3},b);el('ellipse',{cx:0,cy:18,rx:38,ry:24,fill:'#b8a088'},b);
  [-1,1].forEach(sd=>el('path',{d:`M${sd*50},0 q${sd*24},10 ${sd*14},44`,fill:'none',stroke:'#7a6048','stroke-width':12,'stroke-linecap':'round'},b));
  const head=el('g',{transform:'translate(0,-30)'},b);el('circle',{r:30,fill:'#a88a6a',stroke:'#5a4630','stroke-width':3},head);el('ellipse',{cy:4,rx:22,ry:18,fill:'#e8d4b8'},head);
  const eyes=el('g',{},head);[-10,10].forEach(x=>el('ellipse',{cx:x,cy:0,rx:7,ry:5,fill:'#4a3428'},eyes));const lids=el('g',{},head);[-10,10].forEach(x=>el('path',{d:`M${x-7},0 q7,5 14,0`,fill:'none',stroke:'#2a1a10','stroke-width':2.5},lids));
  const open=el('g',{},head);open.style.display='none';[-10,10].forEach(x=>{el('circle',{cx:x,cy:0,r:6,fill:'#fff'},open);el('circle',{cx:x+1,cy:0,r:3,fill:'#241a10'},open)});
  const mouth=el('path',{d:'M-6,12 q6,4 12,0',fill:'none',stroke:'#3a2418','stroke-width':2.5},head);el('ellipse',{cx:0,cy:6,rx:4,ry:3,fill:'#3a2418'},head);
  const zz=el('g',{},g);let sc=1,awake=false;
  return{g,
    tick(t){if(awake)return;b.setAttribute('transform',`scale(${(s*sc*(1+Math.sin(t*1.4)*.025)).toFixed(3)})`);zz.innerHTML='';for(let k=0;k<3;k++){const p=((t*.5+k/3)%1);el('text',{x:30*s+p*30*s,y:-60*s-p*50*s,'font-size':(12+p*14)*s,'font-weight':800,fill:'#d8c6e4',opacity:(1-p).toFixed(2)},zz).textContent='z'}},
    stir(){sc=Math.max(.6,sc-.06);if(RM)return;tween(400,(t,p)=>head.setAttribute('transform',`translate(${(Math.sin(p*Math.PI*4)*4).toFixed(1)},-30)`))},
    unstir(){sc=Math.min(1,sc+.06)},
    wake(){awake=true;zz.innerHTML='';lids.style.display='none';eyes.style.display='none';open.style.display='';mouth.setAttribute('d','M-10,10 q10,14 20,0Z');mouth.setAttribute('fill','#5a2a2a');b.setAttribute('transform',`scale(${s})`)}}}
/* the clock tower in the middle of the Clockwork Isles: stopped (with the Snooze asleep on top) or chiming */
function towerClockFig(parent,{going=false}={}){const g=el('g',{},parent);
  el('rect',{x:-40,y:-70,width:80,height:120,rx:4,fill:'#7a5a4a',stroke:'#4a3428','stroke-width':3},g);el('path',{d:'M-48,-70 L0,-118 L48,-70Z',fill:'#5a3a6a',stroke:'#3a2448','stroke-width':3},g);
  const ck=clockKit(g,{x:0,y:-24,r:30,nums:false,ticks:false});ck.set(going?125:600);
  [-1,1].forEach(sd=>el('rect',{x:sd*20-7,y:20,width:14,height:24,rx:7,fill:'#3a2418'},g));
  let sn=null;if(!going){sn=snoozeFig(g,{s:.45});sn.g.setAttribute('transform','translate(0,-120)')}
  return{g,tick(t){if(sn)sn.tick(t);else ck.set(125+t*20)}}}

/* ---------- scenes ---------- */
SCENE_X.clockwork=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2a1e2e'},o);
  [[60,120,90],[420,80,60],[540,420,110],[-80,460,120],[260,520,70],[700,220,90],[-300,200,100]].forEach(([x,y,r],i)=>{const g=el('g',{transform:`translate(${x},${y})`},o);
    for(let k=0;k<12;k++){const a=k*30*Math.PI/180;el('rect',{x:Math.sin(a)*r-8,y:-Math.cos(a)*r-8,width:16,height:16,fill:'#3a2a3a',transform:`rotate(${k*30},${Math.sin(a)*r},${-Math.cos(a)*r})`},g)}
    el('circle',{r,fill:'#3a2a3a'},g);el('circle',{r:r*.35,fill:'#2a1e2e'},g)});
  el('rect',{x:-700,y:540,width:2000,height:300,fill:'#1e1522'},o)};
SCENE_X.meadow=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#8fc8f0'},o);el('path',{d:'M-700,470 Q-200,410 300,460 T1300,450 V800 H-700Z',fill:'#7fc86a'},o);el('path',{d:'M-700,510 Q0,480 600,515 T1300,505 V800 H-700Z',fill:'#5aa84a'},o)};
SCENE_X.pond=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2a5a4a'},o);el('rect',{x:-700,y:120,width:2000,height:700,fill:'#3a7a8a'},o);
  for(let i=0;i<30;i++)el('path',{d:`M${-600+((i*97)%1800)},${150+((i*61)%380)} q12,-5 24,0`,stroke:'#8fd6ff','stroke-width':2,fill:'none',opacity:.3},o);
  [[-60,300],[620,260],[-200,500],[700,520]].forEach(([x,y])=>{el('path',{d:`M${x},${y} l0,-70 M${x+10},${y} l4,-60`,stroke:'#4a8a3a','stroke-width':4},o);el('ellipse',{cx:x+2,cy:y-74,rx:5,ry:14,fill:'#8a5a34'},o)})};
SCENE_X.railway=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#f0c890'},o);
  el('path',{d:'M-700,420 Q-100,330 400,400 T1300,380 V800 H-700Z',fill:'#a8c870'},o);el('path',{d:'M-700,500 Q100,460 700,505 T1300,490 V800 H-700Z',fill:'#88b058'},o)};
SCENE_X.kitchen=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#f4e8d8'},o);for(let x=-700;x<1300;x+=40)for(let y=0;y<520;y+=40)el('rect',{x:x+1,y:y+1,width:38,height:38,fill:(x/40+y/40)%2?'#e8dcc8':'#f4e8d8'},o);
  el('rect',{x:-700,y:500,width:2000,height:300,fill:'#a8744a'},o);el('rect',{x:-700,y:496,width:2000,height:10,fill:'#7a4a2e'},o)};
AMB_X.clockwork=()=>{osc('square',1400,.015,.004,{wet:.5});osc('square',1100,.015,.004,{wet:.5,at:.5})};
AMB_X.meadow=()=>{const r=Math.random();if(r<.5)osc('sine',1800+Math.random()*900,.12,.006,{to:2400,wet:.6});else noise(.8,.01,{type:'lowpass',f:500,wet:.3})};
AMB_X.pond=()=>{const r=Math.random();if(r<.5)osc('sine',180,.25,.02,{to:120,wet:.4});else noise(.6,.012,{type:'bandpass',f:900,wet:.4})};
AMB_X.railway=()=>{noise(.5,.012,{type:'lowpass',f:300,wet:.3})};
AMB_X.kitchen=()=>{const r=Math.random();if(r<.5)noise(.4,.008,{type:'bandpass',f:3000,wet:.3});else osc('sine',880,.3,.006,{wet:.6})};
