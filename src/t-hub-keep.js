function gloomFig(parent){const g=el('g',{},parent);
  el('ellipse',{rx:175,ry:125,fill:'url(#gGlA)'},g);
  const body=el('path',{fill:'url(#gGlB)',stroke:'#7a5ac0','stroke-width':2,'stroke-opacity':.55},g);
  for(let i=0;i<8;i++){const th=(-64+i*128/7)*Math.PI/180,sx=Math.sin(th),cy=Math.cos(th),bx=98*sx*.96,by=12-92*cy*.96,L=30+10*Math.cos(th*2),nx=sx,ny=-cy,tx=cy,ty=sx,P=(a,b)=>`${(bx+nx*a+tx*b).toFixed(1)},${(by+ny*a+ty*b).toFixed(1)}`;
    el('polygon',{points:[P(-4,-8),P(L*.5,-9.5),P(L,0),P(L*.5,9.5),P(-4,8)].join(' '),fill:'#231a3e',stroke:'#4c3c78','stroke-width':1.5,'stroke-linejoin':'round'},g)}
  [-1,1].forEach(s=>{const e=el('g',{transform:`translate(${s*34},-14)`},g);el('ellipse',{rx:26,ry:18,fill:'#ffd84a',opacity:.25},e);el('path',{d:'M-18,0 Q0,-15 18,0 Q0,13 -18,0Z',fill:'#ffe680'},e);el('ellipse',{rx:3.6,ry:9,fill:'#1a0f2a'},e);
    el('path',{d:s<0?'M-22,-19 L18,-6':'M22,-19 L-18,-6',stroke:'#07040f','stroke-width':6,'stroke-linecap':'round'},e)});
  el('path',{d:'M-40,24 Q0,54 40,24 Q0,38 -40,24Z',fill:'#12081f'},g);el('path',{d:'M-28,29 l5,7 l5,-5Z M-6,32 l5,7 l5,-6Z M15,30 l5,6 l4,-7Z',fill:'#f4ecff'},g);
  const D=t=>{let d='M-96,18 C-100,-52 -52,-82 0,-82 C52,-82 100,-52 96,18';for(let i=0;i<7;i++){const x0=96-i*192/7,x1=96-(i+1)*192/7,xm=(x0+x1)/2+Math.sin(t*1.7+i*1.3)*7,ty=60+Math.sin(t*2.1+i*2.2)*9+(i%2?12:0);d+=` Q${x0.toFixed(1)},${(18+(ty-18)*.55).toFixed(1)} ${xm.toFixed(1)},${ty.toFixed(1)} Q${x1.toFixed(1)},${(18+(ty-18)*.55).toFixed(1)} ${x1.toFixed(1)},18`}return d+'Z'};
  body.setAttribute('d',D(0));return{g,tick:t=>body.setAttribute('d',D(t))}}

function glimFig(parent,r=30){const g=el('g',{},parent),rays=el('g',{},g);
  SHARDC.forEach((c,i)=>{const a=i*Math.PI/4;el('path',{d:`M0,0 L${(Math.cos(a-.12)*150).toFixed(1)},${(Math.sin(a-.12)*150).toFixed(1)} L${(Math.cos(a+.12)*150).toFixed(1)},${(Math.sin(a+.12)*150).toFixed(1)}Z`,fill:c,opacity:.22},rays)});
  el('circle',{r:r*2.6,fill:'url(#gGlC)'},g);
  const cr=creature(g,{x:0,y:0,r,i:8,label:'Glim'});cr.mood('happy');CREATS.delete(cr);
  const crown=el('g',{transform:`translate(0,${-r*.95})`},g);SHARDC.forEach((c,i)=>{const x=(i-3.5)*r*.22;el('path',{d:`M${x-r*.11},0 L${x},${-r*(.34+(i===3||i===4?.14:0))} L${x+r*.11},0Z`,fill:c,stroke:'#fff','stroke-width':.8},crown)});
  return{g,cr,tick:t=>rays.setAttribute('transform',`rotate(${(t*8%360).toFixed(1)})`)}}

function progressBar(parent,x,y,w,frac,col='#ffc04d'){el('rect',{x:x-w/2,y,width:w,height:9,rx:4.5,fill:'#e7dccb'},parent);if(frac>0)el('rect',{x:x-w/2,y,width:Math.max(9,w*frac),height:9,rx:4.5,fill:col},parent)}
