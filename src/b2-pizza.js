
/* ---------- pizza ---------- */
const PZ=[{sauce:'#d9472f',cheese:'url(#gCheeseA)',t1:'#b8322a',t2:'#3f9b4f'},{sauce:'#4f9a3e',cheese:'url(#gCheeseB)',t1:'#f2c84b',t2:'#2f6f2a'}];
const TAU=Math.PI*2;
const range=(a,b)=>Array.from({length:Math.max(0,b-a+1)},(_,i)=>a+i);
const NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const polar=(cx,cy,R,t)=>[cx+R*Math.sin(t*TAU),cy-R*Math.cos(t*TAU)];
function wedgeD(cx,cy,R,a0,a1){
  if(a1-a0>=.9999)return`M${cx},${cy-R}A${R},${R} 0 1 1 ${cx},${cy+R}A${R},${R} 0 1 1 ${cx},${cy-R}Z`;
  const [x0,y0]=polar(cx,cy,R,a0),[x1,y1]=polar(cx,cy,R,a1);
  return`M${cx},${cy}L${x0.toFixed(2)},${y0.toFixed(2)}A${R},${R} 0 ${a1-a0>.5?1:0} 1 ${x1.toFixed(2)},${y1.toFixed(2)}Z`;
}
/* watermelon: fl 2 = red, fl 3 = yellow */
const MEL={2:{flesh:'#f0475f',core:'#ff8a9a'},3:{flesh:'#f6c53f',core:'#ffe27a'}};
function melonSlice(g,inner,cx,cy,R,a0,a1,fl){
  const F=MEL[fl],span=a1-a0;
  el('path',{d:wedgeD(cx,cy,R,a0,a1),fill:'#2c6b34'},inner);
  const st=Math.max(1,Math.round(span*22));
  for(let i=0;i<st;i++){const t0=a0+span*(i+.15)/st,t1=a0+span*(i+.55)/st;el('path',{d:wedgeD(cx,cy,R,t0,t1),fill:'#1d4d26',opacity:.85},inner)}
  el('path',{d:wedgeD(cx,cy,R*.93,a0,a1),fill:'#a8d97f'},inner);
  el('path',{d:wedgeD(cx,cy,R*.88,a0,a1),fill:'#eef7cf'},inner);
  el('path',{d:wedgeD(cx,cy,R*.84,a0,a1),fill:F.flesh},inner);
  el('path',{d:wedgeD(cx,cy,R*.5,a0,a1),fill:F.core,opacity:.35},inner);
  const k=Math.max(1,Math.round(span*14)),seed=Math.round(a0*97);
  for(let i=0;i<k;i++){const t=a0+span*((i+.5)/k),rr=R*((i+seed)%2?.6:.45);
    const [x,y]=polar(cx,cy,rr,t),rot=(t*360).toFixed(0);
    el('ellipse',{cx:x.toFixed(1),cy:y.toFixed(1),rx:R*.028,ry:R*.055,fill:'#2a1418',transform:`rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})`},inner);
    el('ellipse',{cx:(x-R*.008).toFixed(1),cy:(y-R*.02).toFixed(1),rx:R*.009,ry:R*.018,fill:'#fff',opacity:.35,transform:`rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})`},inner)}
  if(span<.9999){const [x0,y0]=polar(cx,cy,R*.84,a0),[x1,y1]=polar(cx,cy,R*.84,a1);el('path',{d:`M${x0.toFixed(1)},${y0.toFixed(1)}L${cx},${cy}L${x1.toFixed(1)},${y1.toFixed(1)}`,fill:'none',stroke:'rgba(120,10,30,.35)','stroke-width':1.2,'stroke-linejoin':'round'},inner)}
  return g;
}
function slice(parent,cx,cy,R,a0,a1,fl=0,gap=0){
  const g=el('g',{class:'sl'},parent),F=PZ[fl],inner=el('g',{},g),span=a1-a0;
  if(MEL[fl]){if(gap&&span<.9999){const m=(a0+a1)/2;inner.setAttribute('transform',`translate(${(Math.sin(m*TAU)*gap).toFixed(2)},${(-Math.cos(m*TAU)*gap).toFixed(2)})`)}return melonSlice(g,inner,cx,cy,R,a0,a1,fl)}
  if(gap&&span<.9999){const m=(a0+a1)/2;inner.setAttribute('transform',`translate(${(Math.sin(m*TAU)*gap).toFixed(2)},${(-Math.cos(m*TAU)*gap).toFixed(2)})`)}
  el('path',{d:wedgeD(cx,cy,R,a0,a1),fill:'#d9934a'},inner);
  el('path',{d:wedgeD(cx,cy,R*.9,a0,a1),fill:'#c9772f',opacity:.5},inner);
  el('path',{d:wedgeD(cx,cy,R*.87,a0,a1),fill:F.sauce},inner);
  el('path',{d:wedgeD(cx,cy,R*.83,a0,a1),fill:F.cheese},inner);
  const k=Math.max(1,Math.round(span*15)),seed=Math.round(a0*97);
  for(let i=0;i<k;i++){const t=a0+span*((i+.5)/k),rr=R*(.34+.4*(((i*7+seed)%10)/10));
    const [x,y]=polar(cx,cy,rr,t);
    if((i+seed)%3===2)el('ellipse',{cx:x.toFixed(1),cy:y.toFixed(1),rx:R*.06,ry:R*.032,fill:F.t2,transform:`rotate(${(t*360+40).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`},inner);
    else{el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:R*.062,fill:F.t1},inner);el('circle',{cx:(x-R*.018).toFixed(1),cy:(y-R*.018).toFixed(1),r:R*.022,fill:'#fff',opacity:.28},inner)}}
  if(span<.9999){const [x0,y0]=polar(cx,cy,R,a0),[x1,y1]=polar(cx,cy,R,a1);el('path',{d:`M${x0.toFixed(1)},${y0.toFixed(1)}L${cx},${cy}L${x1.toFixed(1)},${y1.toFixed(1)}`,fill:'none',stroke:'rgba(90,30,10,.35)','stroke-width':1.2,'stroke-linejoin':'round'},inner)}
  return g;
}
function plate(parent,cx,cy,R){const g=el('g',{},parent);el('circle',{cx,cy,r:R+15,fill:'#efe6f4',opacity:.13},g);el('circle',{cx,cy,r:R+15,fill:'none',stroke:'rgba(255,244,230,.38)','stroke-width':2},g);el('circle',{cx,cy,r:R+6,fill:'none',stroke:'rgba(255,244,230,.12)','stroke-width':1.5},g);return g}
function pizza(parent,{cx,cy,R,n,have,fl=0,gap=2.5,dish=true}){
  const g=el('g',{},parent);if(dish)plate(g,cx,cy,R);
  const sl=[];
  for(let j=0;j<n;j++){const a0=j/n,a1=(j+1)/n,on=typeof have==='function'?have(j):j<have;
    if(on)sl.push(slice(g,cx,cy,R,a0,a1,fl,n>1?gap:0));
    else el('path',{d:wedgeD(cx,cy,R-1,a0,a1),fill:'rgba(255,244,230,.03)',stroke:'rgba(255,244,230,.3)','stroke-width':1.4,'stroke-dasharray':'4 4'},g)}
  return{g,sl};
}
function radial(parent,cx,cy,R,c,attrs){const g=el('g',{},parent);if(c>1)for(let k=0;k<c;k++){const [x,y]=polar(cx,cy,R,k/c);el('line',Object.assign({x1:cx,y1:cy,x2:x.toFixed(1),y2:y.toFixed(1)},attrs),g)}return g}
/* all the new cuts appear together, once */
function cutAll(parent,cx,cy,R,angles,done){
  const g=el('g',{},parent),ls=angles.map(a=>{const [x,y]=polar(cx,cy,R+6,a);return{x,y,l:el('line',{x1:cx,y1:cy,x2:cx,y2:cy,stroke:'#fff6d0','stroke-width':3,'stroke-linecap':'round'},g)}});
  SFX.whoosh();SFX.swish();shake(2);
  tween(300,t=>ls.forEach(o=>{o.l.setAttribute('x2',lerp(cx,o.x,t).toFixed(1));o.l.setAttribute('y2',lerp(cy,o.y,t).toFixed(1))}),()=>{g.remove();done&&done()},ease.out);
}
/* a little pizza wheel rolls out along each new cut */
function cutter(parent,cx,cy,R,angles,{each=160,done,knife=false}={}){
  let alive=true;const wheel=el('g',{},FX),spin=el('g',{},wheel);
  if(knife){/* a melon knife: the blade points along the cut */
    el('path',{d:'M-5,-4 L30,-3 Q38,0 30,4 L-5,4Z',fill:'#e6eaf2',stroke:'#7d8aa8','stroke-width':1.5},spin);
    el('rect',{x:-26,y:-5,width:22,height:10,rx:4,fill:'#7a4a2e'},spin);el('circle',{cx:-20,cy:0,r:1.6,fill:'#e6eaf2'},spin);el('circle',{cx:-11,cy:0,r:1.6,fill:'#e6eaf2'},spin)}
  else{
  el('rect',{x:-3.5,y:6,width:7,height:26,rx:3.5,fill:'#b0643a'},wheel);
  el('circle',{r:11,fill:'#e6eaf2',stroke:'#7d8aa8','stroke-width':2},spin);
  for(let k=0;k<3;k++)el('line',{x1:0,y1:0,x2:Math.cos(k*2.09)*9,y2:Math.sin(k*2.09)*9,stroke:'#7d8aa8','stroke-width':1.5},spin)}
  const trail=el('g',{},parent);
  angles.forEach((a,i)=>later(i*each,()=>{if(!alive)return;const [x,y]=polar(cx,cy,R+6,a);
    const ln=el('line',{x1:cx,y1:cy,x2:cx,y2:cy,stroke:'#fff6d0','stroke-width':2.5,'stroke-linecap':'round'},trail);
    tween(each*.85,t=>{if(!alive)return;const px=lerp(cx,x,t),py=lerp(cy,y,t);ln.setAttribute('x2',px.toFixed(1));ln.setAttribute('y2',py.toFixed(1));wheel.setAttribute('transform',`translate(${px.toFixed(1)},${py.toFixed(1)})`);spin.setAttribute('transform',knife?`rotate(${(a*360-90).toFixed(0)})`:`rotate(${(t*600).toFixed(0)})`)},null,ease.inOut);
    if(knife){SFX.slice();later(each*.6,()=>{if(alive)crumbs(x,y,{n:4,cols:['#ff6f86','#ffd0d8','#f6c53f'],up:1})})}else SFX.swish()}));
  const stop=()=>{alive=false;wheel.remove();trail.remove()};
  later(angles.length*each+60,()=>{if(!alive)return;stop();done&&done()});
  return stop;
}
