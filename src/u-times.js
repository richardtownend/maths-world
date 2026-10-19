
/* The times table as a grid: drag a rectangle out from the corner and the corner cell is the answer.
   The same rectangle turned round (columns for rows) lands on the same number across the diagonal. */
function timesGrid(parent,{x,y,cs=30,n=10,can=()=>true,onMove,onRelease}){
  const g=el('g',{},parent),sel=el('g',{},g),cells=el('g',{},g),top=el('g',{},g);let r=1,c=1,mirror=false;
  for(let i=1;i<=n;i++){el('rect',{x:x+i*cs,y,width:cs-2,height:cs-2,rx:5,fill:'#ffc04d',opacity:.9},g);el('text',{x:x+i*cs+cs/2-1,y:y+cs/2+5,'text-anchor':'middle','font-size':cs*.45,'font-weight':700,fill:'#3a2418'},g).textContent=i;
    el('rect',{x,y:y+i*cs,width:cs-2,height:cs-2,rx:5,fill:'#6fe3cd',opacity:.9},g);el('text',{x:x+cs/2-1,y:y+i*cs+cs/2+5,'text-anchor':'middle','font-size':cs*.45,'font-weight':700,fill:'#1d3f45'},g).textContent=i}
  el('text',{x:x+cs/2,y:y+cs/2+5,'text-anchor':'middle','font-size':cs*.5,'font-weight':700,fill:'#fff4e6'},g).textContent='×';
  for(let i=1;i<=n;i++)for(let j=1;j<=n;j++){el('rect',{x:x+j*cs,y:y+i*cs,width:cs-2,height:cs-2,rx:4,fill:i===j?'rgba(255,240,160,.1)':'rgba(255,244,230,.05)'},cells);
    el('text',{x:x+j*cs+cs/2-1,y:y+i*cs+cs/2+4,'text-anchor':'middle','font-size':cs*.36,fill:'#fff4e6',opacity:.55},cells).textContent=i*j}
  const hd=el('g',{},top);el('circle',{r:13,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},hd);
  function draw(){sel.innerHTML='';
    if(mirror&&r!==c){el('rect',{x:x+cs-1,y:y+cs-1,width:r*cs,height:c*cs,rx:6,fill:'rgba(111,227,205,.1)',stroke:'#6fe3cd','stroke-width':2,'stroke-dasharray':'6 4'},sel);
      el('rect',{x:x+r*cs,y:y+c*cs,width:cs-2,height:cs-2,rx:5,fill:'#6fe3cd'},sel);el('text',{x:x+r*cs+cs/2-1,y:y+c*cs+cs/2+5,'text-anchor':'middle','font-size':cs*.46,'font-weight':700,fill:'#1d3f45'},sel).textContent=r*c;
      el('path',{d:`M${x+cs},${y+cs} L${x+(n+1)*cs},${y+(n+1)*cs}`,stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'3 5',opacity:.6},sel)}
    el('rect',{x:x+cs-1,y:y+cs-1,width:c*cs,height:r*cs,rx:6,fill:'rgba(255,240,160,.16)',stroke:'#fff0a0','stroke-width':3},sel);
    el('rect',{x:x+c*cs,y:y+r*cs,width:cs-2,height:cs-2,rx:5,fill:'#fff0a0'},sel);el('text',{x:x+c*cs+cs/2-1,y:y+r*cs+cs/2+5,'text-anchor':'middle','font-size':cs*.46,'font-weight':700,fill:'#3a2418'},sel).textContent=r*c;
    hd.setAttribute('transform',`translate(${x+(c+1)*cs-2},${y+(r+1)*cs-2})`)}
  const setRC=(nr,nc)=>{nr=clamp(nr,1,n);nc=clamp(nc,1,n);if(nr!==r||nc!==c){r=nr;c=nc;SFX.tick((r+c)%10);draw();onMove&&onMove(r,c)}};
  interact(hd,{label:'Times table corner: drag to make rows and columns',down:()=>({}),move:p=>{if(!can())return;setRC(Math.floor((p.y-y)/cs),Math.floor((p.x-x)/cs))},up:()=>{if(can())onRelease&&onRelease(r,c)},tap:()=>{if(can())onRelease&&onRelease(r,c)}});
  hd.addEventListener('keydown',e=>{if(!can())return;const m={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];if(m){e.preventDefault();setRC(r+m[0],c+m[1])}});
  draw();
  return{g,get:()=>[r,c],set(nr,nc){r=nr;c=nc;draw()},mirror(b){mirror=b;draw()}}}
/* a tray that fills itself with r rows of c seeds */
function autoTray(parent,{x,y,w=190,h=190}){const g=el('g',{},parent);
  el('rect',{x:x-8,y:y-8,width:w+16,height:h+16,rx:12,fill:'#8a5a32',stroke:'#5a3a1e','stroke-width':3},g);el('rect',{x:x-2,y:y-2,width:w+4,height:h+4,rx:7,fill:'#4a2e1a'},g);
  const L=el('g',{},g);let job=0;
  return{set(r,c,anim){L.innerHTML='';const cs=Math.min(w/Math.max(c,1),h/Math.max(r,1),26),ox=x+(w-c*cs)/2,oy=y+(h-r*cs)/2,me=++job;
    for(let i=0;i<r;i++){const draw=()=>{if(me!==job)return;for(let j=0;j<c;j++){el('ellipse',{cx:ox+j*cs+cs/2,cy:oy+i*cs+cs/2,rx:cs*.22,ry:cs*.3,fill:'#e8c070',stroke:'#a87830','stroke-width':1},L)}if(anim)SFX.plink(i+2)};anim?later(i*120,draw):draw()}}}}
