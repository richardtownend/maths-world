/* ---------- Story Isles kit: stories told a line at a time, and ways to give an answer ---------- */
/* reveal a hidden story card a line at a time; beats[i] runs as line i appears; done() after the last */
function tellStory(card,beats,done,gap=1150){for(let i=0;i<card.n;i++)later(250+i*gap,()=>{card.show(i);SFX.crinkle&&SFX.crinkle();beats[i]&&beats[i]()});later(250+card.n*gap-500,()=>done&&done())}
/* little things that appear in the stories */
function storyIcon(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),C=['#ff9ed2','#8fd6ff','#ffc04d','#8ff0c8','#c9a2ff'],c=C[Math.abs(Math.round(x*3+y*7))%5];
  if(kind==='marble'){el('circle',{r:8,fill:c,stroke:'#fff4e6','stroke-width':1.5},g);el('circle',{cx:-3,cy:-3,r:2.5,fill:'#fff',opacity:.7},g)}
  else if(kind==='pen'||kind==='redpen'||kind==='bluepen'){const k=kind==='redpen'?'#e8413e':kind==='bluepen'?'#4aa0ff':c;el('rect',{x:-3,y:-14,width:6,height:22,rx:2,fill:k},g);el('path',{d:'M-3,8 L0,14 L3,8Z',fill:'#f4d8b0'},g)}
  else if(kind==='person'){el('circle',{cy:-9,r:6,fill:'#f4c8a0'},g);el('path',{d:'M-7,10 Q-7,-2 0,-2 Q7,-2 7,10Z',fill:c},g)}
  else if(kind==='bird'){el('ellipse',{rx:9,ry:7,fill:c},g);el('circle',{cx:6,cy:-4,r:4.5,fill:c},g);el('path',{d:'M10,-4 l5,1 l-5,2Z',fill:'#ffc04d'},g);el('circle',{cx:7,cy:-5,r:1.2,fill:'#241a3a'},g)}
  else if(kind==='apple'||kind==='redapple'||kind==='greenapple'){el('circle',{r:8,fill:kind==='greenapple'?'#7fc86a':'#e8413e'},g);el('path',{d:'M0,-8 q2,-5 5,-6',stroke:'#6a4224','stroke-width':2,fill:'none'},g)}
  else if(kind==='page'){el('rect',{x:-8,y:-10,width:16,height:20,rx:2,fill:'#fff8ec',stroke:'#c9a77a'},g);[-4,0,4].forEach(yy=>el('line',{x1:-5,x2:5,y1:yy,y2:yy,stroke:'#c9b8a0'},g))}
  else if(kind==='shell'){el('path',{d:'M-9,6 Q0,-14 9,6Z',fill:'#ffb3a0',stroke:'#c9776a'},g);[-4,0,4].forEach(xx=>el('line',{x1:0,y1:4,x2:xx,y2:-6,stroke:'#c9776a'},g))}
  else if(kind==='block'){el('rect',{x:-8,y:-8,width:16,height:16,rx:3,fill:c,stroke:'#fff4e6','stroke-width':1.5},g)}
  else el('circle',{r:7,fill:c},g);
  return g}
/* a bundle: a heap of a few icons with a number tag (or "?") */
function storyBundle(parent,x,y,kind,label,{q=false,s=1,few=5}={}){const g=el('g',{transform:`translate(${x},${y})`},parent),b=el('g',{transform:`scale(${s})`},g);
  if(q){el('path',{d:'M-22,14 Q-26,-12 -10,-16 L-4,-24 L4,-24 L10,-16 Q26,-12 22,14Z',fill:'#a8743a',stroke:'#6a4224','stroke-width':2},b);el('path',{d:'M-6,-22 q6,6 12,0',stroke:'#ffc04d','stroke-width':3,fill:'none'},b)}
  else{const n=Math.min(few,typeof label==='number'?label:few);for(let i=0;i<n;i++)storyIcon(b,-16+(i%3)*16,4-Math.floor(i/3)*14,kind,.9)}
  const t=el('g',{transform:`translate(0,${q?-2:-30})`},b),w=Math.max(30,String(label).length*11+14);el('rect',{x:-w/2,y:-12,width:w,height:24,rx:8,fill:q?'#f4eefa':'#fff4e6',stroke:q?'#9a6cff':'#c9a77a','stroke-width':2},t);
  el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':700,fill:q?'#9a6cff':'#3a2418'},t).textContent=label;popIn(g,.4);return g}

/* a number entry for the Story Isles: two digit wheels (easier than a keypad); get() is null until she turns one */
function numPad(parent,{x=540,y=236,label='Answer',pre='',post='',onChange}={}){const g=el('g',{},parent);let touched=false;
  const w=digitWheels(g,{x,y:y+76,label:'Answer',onChange:v=>{touched=true;onChange&&onChange(v)}});
  if(pre)el('text',{x:x-62,y:y+88,'text-anchor':'middle','font-size':26,'font-weight':800,fill:'#fff0a0'},g).textContent=pre;
  if(post)el('text',{x,y:y+160,'text-anchor':'middle','font-size':17,'font-weight':800,fill:'#fff0a0'},g).textContent=post.trim();
  return{g,get:()=>touched?w.get():null,set:n=>{touched=n!=null;w.set(n||0)},lock:b=>w.lock(b)}}
/* digit wheels: ▲ digit ▼ for each place, like a scoreboard */
function digitWheels(parent,{x,y,digits=2,label='Number',col='#2a2245',onChange}={}){const g=el('g',{transform:`translate(${x},${y})`},parent),d=Array(digits).fill(0),names=['ones','tens','hundreds'];let locked=false;const T=[];
  const val=()=>d.reduce((a,v)=>a*10+v,0);
  d.forEach((_,i)=>{const cx=(i-(digits-1)/2)*50,place=names[digits-1-i],c=el('g',{transform:`translate(${cx},0)`},g);
    el('rect',{x:-22,y:-28,width:44,height:56,rx:8,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('line',{x1:-22,x2:22,y1:0,y2:0,stroke:'#e8d8c0','stroke-width':1.5},c);
    T[i]=el('text',{y:12,'text-anchor':'middle','font-size':32,'font-weight':700,fill:'#3a2418'},c);T[i].textContent='0';
    [[-1,'▲',-46],[1,'▼',46]].forEach(([s,t,yy])=>{const b=el('g',{transform:`translate(0,${yy})`},c);el('circle',{r:16,fill:col,stroke:'#c9a24a','stroke-width':2},b);el('text',{y:6,'text-anchor':'middle','font-size':15,fill:'#fff0a0'},b).textContent=t;
      interact(b,{label:`${label} ${place} ${s<0?'up':'down'}`,tap:()=>{if(locked)return;d[i]=(d[i]-s+10)%10;T[i].textContent=d[i];SFX.tick(d[i]);flip(T[i]);onChange&&onChange(val())}})})});
  const flip=t=>{if(RM)return;tween(160,p=>t.setAttribute('transform',`scale(1,${(.4+.6*p).toFixed(2)})`))};
  return{g,get:val,set:n=>{String(n).padStart(digits,'0').split('').forEach((c,i)=>{d[i]=+c;T[i].textContent=c})},lock:b=>{locked=b;g.setAttribute('opacity',b?.6:1)}}}

/* coins: tap (or drag) coins from the purse into the tray; tap a coin in the tray to take it back */
function storyCoin(parent,x,y,v){const g=el('g',{transform:`translate(${x},${y})`},parent);
  if(v>=5){el('rect',{x:-28,y:-16,width:56,height:32,rx:4,fill:v>=10?'#e8a060':'#8fd6a0',stroke:'#4a6a4a','stroke-width':2},g);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#2a3a2a'},g).textContent=`£${v}`}
  else{el('circle',{r:v===2?21:19,fill:'#ffd23a',stroke:'#a8743a','stroke-width':2.5},g);el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#7a4a1e'},g).textContent=`£${v}`}
  return g}
function coinTray(parent,{x,y,w=300,h=96,purse=[1,2,5,10],px,py,onChange,label='the tray'}){const g=el('g',{},parent),inT=[];let locked=false;
  el('rect',{x,y,width:w,height:h,rx:14,fill:'rgba(255,244,230,.1)',stroke:'#c9a24a','stroke-width':2.5,'stroke-dasharray':'7 5'},g);
  const tot=el('text',{x:x+w-12,y:y+h-10,'text-anchor':'end','font-size':15,'font-weight':700,fill:'#fff0a0'},g);
  const coinsL=el('g',{},g),drag=el('g',{},g);
  const sum=()=>inT.reduce((a,v)=>a+v,0);
  function draw(){coinsL.innerHTML='';inT.forEach((v,i)=>{const c=storyCoin(coinsL,x+36+(i%6)*58,y+28+Math.floor(i/6)*40,v);interact(c,{label:`Take back a £${v} coin`,tap:()=>{if(locked)return;inT.splice(i,1);SFX.clink&&SFX.clink();draw()}})});
    tot.textContent=`£${sum()}`;onChange&&onChange(sum())}
  const add=v=>{if(locked||inT.length>=12)return;inT.push(v);SFX.clink&&SFX.clink();draw()};
  purse.forEach((v,i)=>{const cx=px+(i%2)*62,cy=py+Math.floor(i/2)*52,c=storyCoin(g,cx,cy,v);
    interact(c,{label:`Add a £${v} coin`,down:()=>({}),move:(p,p0,cx2)=>{if(locked)return;if(!cx2.gh)cx2.gh=storyCoin(drag,p.x,p.y,v);cx2.gh.setAttribute('transform',`translate(${p.x},${p.y})`)},
      up:(p,p0,cx2)=>{if(!cx2.gh)return;cx2.gh.remove();if(p.x>x&&p.x<x+w&&p.y>y&&p.y<y+h)add(v)},tap:()=>add(v)})});
  draw();return{g,get:sum,clear(){inT.length=0;draw()},lock:b=>{locked=b}}}

/* a two-row bar picture, shown after a win: "what happened, as bars" */
function afterBar(parent,{x=80,y,w=340,whole,parts,names=['',''],wname='',col=['#ffb34d','#ff9ed2'],cur=''}){const g=el('g',{},parent),u=w/whole;
  el('text',{x,y:y-10,'font-size':15,'font-weight':700,fill:'#d8c6e4'},g).textContent='as bars:';
  storyBar(g,{x,y,w,h:34,col:'#8fd6ff'});el('text',{x:x+w/2,y:y+23,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},g).textContent=`${cur}${whole}${wname?' '+wname:''}`;
  let cx=x;parts.forEach((p,i)=>{storyBar(g,{x:cx,y:y+40,w:p*u,h:34,col:col[i%2]});el('text',{x:cx+p*u/2,y:y+63,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},g).textContent=`${cur}${p}`;
    if(names[i])el('text',{x:cx+p*u/2,y:y+92,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},g).textContent=names[i];cx+=p*u});
  g.setAttribute('opacity',0);tween(400,t=>g.setAttribute('opacity',t.toFixed(2)));return g}
