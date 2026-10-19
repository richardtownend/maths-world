
/* ================= World 6: Take ================= */
W.take={scene:'shop',
notes:`<p>Subtraction, by sharing out a chocolate bar. Each critter in the queue has a sign saying how much it wants. Tap a critter to call it over, slide the bar into its mouth a square at a time, then tap the critter to bite. Every bite takes that amount away from the bar.</p>
<p>A critter can get <b>just right</b> (a tick), <b>too much</b> (it puffs up and that chocolate is gone) or <b>not enough</b> (it stays hungry and can be topped up). If everyone gets just the right amount, the bar runs out exactly.</p>
<p>Three sheets. First the signs match the squares. Then 1/4 from a bar of eighths, which means two squares. Last, the Big Beast wants more than one bar: it swallows a whole wrapped bar, then the second bar is opened ("a whole bar is 4/4") and lowered in for the rest.</p>
<p>Subtracting fractions whose pieces don't match the squares (like 7/8 − 1/3) has its own island next: Smash.</p>`,
mount(root){
  const BW=300,BH=40,RY=238,TX=318,MX=300,MY=300,BSC=1.1,BSA=3.1;
  const LV=[
    {m:8,wr:0,cr:[[0,1,8],[0,3,8],[0,2,8],[0,2,8]]},
    {m:8,wr:0,cr:[[0,1,4],[0,3,8],[0,1,8],[0,1,4]]},
    {m:4,wr:2,empty:1,cr:[[1,1,4,1],[0,1,2],[0,1,4]]}];
  const S={lv:0,m:8,m0:8,k:1,left:8,wraps:0,crit:[],sel:-1,ins:0,busy:false,wins:new Set(),opened:false,beast:false};
  const sq=()=>BW/S.m,su=()=>U/S.m;

  /* layers: the bar slides between a critter's back and its jaws */
  const spareL=el('g',{},root);
  const rail=el('rect',{x:-400,y:RY+BH/2+4,width:TX+390,height:10,rx:5,fill:'#4a3550'},root);
  const backL=el('g',{},root),barL=el('g',{},root),frontL=el('g',{},root),labL=el('g',{},root),signL=el('g',{},root);
  const stones=el('g',{},root);
  navStone({glyph:'redo',label:'Start this sheet again',onTap:()=>load()});
  const st=navStone({label:'Next sheet',onTap:()=>{S.lv=(S.lv+1)%LV.length;load()}});
  const dotsL=el('g',{},root),cutG=el('g',{},root),pvL=el('g',{},root);
  function cutPreview(v){pvL.innerHTML='';if(v<=S.k||S.beast)return;const s=sq(),x0=TX-10-S.left*s+S.ins*s,n=S.left*v/S.k;if(!Number.isInteger(n))return;const s2=S.left*s/n;
    for(let j=1;j<n;j++){if(j%(v/gcd(v,S.k))===0&&(j*S.k)%v===0)continue;const x=x0+j*s2;if(x>TX)break;el('line',{x1:x,x2:x,y1:RY-26,y2:RY+26,stroke:'#fff6d0','stroke-width':2,'stroke-dasharray':'5 4'},pvL)}}
  let cutGauge=null;
  function recutBar(v){
    pvL.innerHTML='';if(v===S.k)return;
    if(v<S.k){clonk();cutGauge.set(S.k);say('Squares can\u2019t be glued back together. Cut them smaller instead.');return}
    if((S.left*v)%S.k){clonk();cutGauge.set(S.k);say('That cut doesn\u2019t fit these squares. Try another.');return}
    S.ins=0;S.left=S.left*v/S.k;S.k=v;S.m=S.m0*v;builtLeft=-1;SFX.whoosh();SFX.swish();shake(2);
    const s=sq(),x0=TX-10-S.left*s;for(let j=1;j<S.left;j++){const l=el('line',{x1:x0+j*s,x2:x0+j*s,y1:RY-30,y2:RY+30,stroke:'#fff6d0','stroke-width':3},FX);tween(450,(t,p)=>l.setAttribute('opacity',(1-p).toFixed(2)),()=>l.remove())}
    drawBar();say(`Every square is cut into ${NUMW[v]}. The bar is now in ${({2:'halves',3:'thirds',4:'quarters',6:'sixths',8:'eighths',9:'ninths',12:'twelfths',18:'eighteenths',24:'twenty-fourths'})[S.m]||S.m+'ths'}. Same amount of chocolate!`)}

  function snapper(i,big){
    const col=CCOL[(i*3+1)%CCOL.length],dk=darker(col,.78),JL=big?250:200,R=big?62:44,J=big?1.25:1;
    const gb=el('g',{},backL),gf=el('g',{},frontL);
    el('ellipse',{cx:R*.9,cy:R*1.02,rx:R,ry:R*.17,fill:'#0d0a24',opacity:.35},gb);
    const bodyG=el('g',{},gb);
    [R*.45,R*1.25].forEach(fx=>el('ellipse',{cx:fx,cy:R*.92,rx:R*.26,ry:R*.14,fill:dk},bodyG));
    el('path',{d:blobPath(R,1.08,1,i*1.3+.4),transform:`translate(${R*.9},0)`,fill:col},bodyG);
    el('ellipse',{cx:R*1.05,cy:R*.35,rx:R*.5,ry:R*.35,fill:'#fff',opacity:.18},bodyG);
    if(big)[R*.4,R*1.3].forEach(hx=>el('path',{d:`M${hx-10},${-R*.8} l8,-30 l10,26Z`,fill:'#fff0a0'},bodyG));
    const mouth=el('rect',{x:-JL+6,y:-3,width:JL,height:6,rx:6,fill:'#5a1730'},gb);
    const up=el('g',{},gf),lo=el('g',{},gf);
    el('path',{d:`M14,-2 L${-JL+16},-2 Q${-JL},-2 ${-JL},-14 Q${-JL+4},-${30*J} ${-JL+36},-${30*J} L${R*.4},-${36*J} Z`,fill:col},up);
    el('path',{d:`M14,2 L${-JL+16},2 Q${-JL},2 ${-JL},12 Q${-JL+4},${24*J} ${-JL+36},${24*J} L${R*.4},${30*J} Z`,fill:dk},lo);
    for(let x=-JL+16;x<-10;x+=20){el('path',{d:`M${x},-2 l6,9 l6,-9Z`,fill:'#fffaf2'},up);el('path',{d:`M${x+10},2 l6,-8 l6,8Z`,fill:'#fffaf2'},lo)}
    el('circle',{cx:-JL+14,cy:-18*J,r:3,fill:dk},up);
    const eyes=[],eyeG=el('g',{},gf);[[R*.35,-R*.72],[R*.95,-R*.8]].forEach(([ex,ey])=>{const eg=el('g',{transform:`translate(${ex},${ey})`},eyeG);el('circle',{r:R*.24,fill:'#fffaf2'},eg);const pu=el('circle',{cx:-R*.08,r:R*.12,fill:'#241a3a'},eg);eyes.push(pu)});
    const giant=el('g',{},frontL);
    if(big){[-1,1].forEach(sd=>{const eg=el('g',{transform:`translate(${sd*205},-58)`},giant);el('circle',{r:34,fill:'#fffaf2',stroke:dk,'stroke-width':7},eg);const pu=el('circle',{cy:-10,r:16,fill:'#241a3a'},eg);el('circle',{cx:-5,cy:-16,r:5,fill:'#fff'},eg);
      el('path',{d:`M${-34*sd},-30 Q0,-58 ${30*sd},-44`,fill:'none',stroke:dk,'stroke-width':8,'stroke-linecap':'round'},eg)})}
    const o={gb,gf,JL,R,big,x:0,y:0,s:1,sy:1,r:0,op:0,
      place(x,y,s,r=0,sy=s){o.x=x;o.y=y;o.s=s;o.r=r;o.sy=sy;const t=`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${s.toFixed(3)},${sy.toFixed(3)})`;gb.setAttribute('transform',t);gf.setAttribute('transform',t);giant.style.display=r>45?'':'none';eyeG.style.display=r>45?'none':'';giant.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`)},
      open(v){o.op=v;up.setAttribute('transform',`translate(0,${(-24*v).toFixed(1)})`);lo.setAttribute('transform',`translate(0,${(24*v).toFixed(1)})`);mouth.setAttribute('y',(-3-24*v).toFixed(1));mouth.setAttribute('height',(6+48*v).toFixed(1))},
      puff(v){bodyG.setAttribute('transform',`translate(${R*.9},0) scale(${v}) translate(${-R*.9},0)`)},
      moveTo(x,y,s,dur,done,r=o.r,arc=20,e=ease.inOut,sy=s){const a=[o.x,o.y,o.s,o.r,o.sy];tween(dur,t=>o.place(lerp(a[0],x,t),lerp(a[1],y,t)-Math.sin(t*Math.PI)*arc,lerp(a[2],s,t),lerp(a[3],r,t),lerp(a[4],sy,t)),done,e)},
      openTo(v,dur=200,done){const a=o.op;tween(dur,t=>o.open(lerp(a,v,t)),done)}};
    o.open(0);return o;
  }
  const slotX=(k,n)=>300+(k-(n-1)/2)*(n>3?128:150)+28,SLOTY=508,QS=.42;
  const want=c=>c.w*U+U*c.n/c.d;

  const barG=el('g',{},barL),sqG=el('g',{},barG);
  interact(barG,{label:'The chocolate bar: slide it into a mouth',down:()=>({i0:S.ins}),
    move:(p,p0,k)=>{if(S.sel<0||S.busy||!S.left)return;slide(k.i0+Math.round((S.beast?p.y-p0.y:p.x-p0.x)/sq()))},
    tap:()=>{if(!S.left)return;if(S.sel<0){say('Tap a critter in the queue to call it over first.');return}slide(S.ins+1)}});
  let builtLeft=-1,builtM=-1,barT=0;
  function barTo(t1,dur,done){const t0=barT;tween(dur,e=>{barT=lerp(t0,t1,e);const t=barT;barL.setAttribute('transform',`translate(${(MX*t+TX*(1-t)).toFixed(1)},${(MY*t+RY*(1-t)).toFixed(1)}) rotate(${(90*t).toFixed(1)}) translate(${-TX},${-RY})`);rail.style.opacity=1-t},()=>{drawBar();done&&done()},ease.inOut)}
  function drawBar(){
    const s=sq(),right0=TX-10,x0=right0-S.left*s;
    if(builtLeft!==S.left||builtM!==S.m){sqG.innerHTML='';for(let j=0;j<S.left;j++)chocSquare(sqG,x0+j*s,RY-BH/2,s,BH);
      if(S.left)el('rect',{x:x0,y:RY-BH/2,width:S.left*s,height:BH,fill:'transparent'},sqG);builtLeft=S.left;builtM=S.m}
    sqG.setAttribute('transform',`translate(${(S.ins*s).toFixed(1)},0)`);
    labL.innerHTML='';const right=right0+S.ins*s,vx=x0+S.ins*s;
    const M=(x,y)=>S.beast&&barT>.99?[MX-(y-RY),MY+(x-TX)]:[x,y];
    if(S.left){const [lx,ly]=M(Math.max(30,(vx+Math.min(right,TX))/2),S.beast?RY-62:RY-50);svgFrac(labL,S.beast?MX-60:lx,ly,S.left-S.ins,S.m,15)}
    if(S.ins&&S.sel>=0){const [lx,ly]=M(TX+S.ins*s/2,RY+66);svgFrac(labL,S.beast?MX+56:lx,ly,S.ins,S.m,15)}
    drawSpares();
  }
  function slide(v){const c=S.crit[S.sel],s=sq(),max=Math.min(S.left,Math.floor((c.o.JL*(S.beast?BSC:1)-34)/s));v=clamp(v,0,max);if(v===S.ins)return;SFX.tick(v);S.ins=v;drawBar()}
  function chocSquare(parent,x,y,w,h){const g=el('g',{},parent);
    el('rect',{x:x+.5,y:y+.5,width:Math.max(1,w-1),height:h-1,rx:Math.min(5,w/4),fill:'url(#gChoc)'},g);
    el('rect',{x:x+3.5,y:y+3.5,width:Math.max(0,w-7),height:h-7,rx:Math.min(3,w/5),fill:'none',stroke:'#a8714c','stroke-width':1.5,opacity:.8},g);
    el('path',{d:`M${x+4},${y+h-4} L${x+w-4},${y+h-4} L${x+w-4},${y+4}`,fill:'none',stroke:'#3a1f12','stroke-width':1.5,opacity:.6},g);return g}
  function foil(parent,x,y,w,h){const g=el('g',{},parent);
    el('rect',{x,y,width:w,height:h,rx:8,fill:'url(#gFoil)'},g);el('rect',{x:x+w*.3,y,width:w*.4,height:h,fill:'#7b3fa0',stroke:'#f7d36b','stroke-width':2},g);
    el('text',{x:x+w/2,y:y+h/2+6,'text-anchor':'middle','font-size':16,'font-weight':600,fill:'#fff4e6',style:'font-family:var(--font-display);font-style:italic'},g).textContent='Moonbar';
    for(let k=0;k<5;k++)el('path',{d:`M${x+8+k*10},${y} l-6,${h}`,stroke:'#fff',opacity:.12,'stroke-width':3},g);
    const id='fc'+Math.random().toString(36).slice(2,8),cp=el('clipPath',{id},g);el('rect',{x,y,width:w,height:h,rx:8},cp);
    const gl=el('g',{'clip-path':`url(#${id})`},g);const sh=el('rect',{x:x-40,y:y-10,width:26,height:h+20,fill:'#fff',opacity:.45,transform:`skewX(-20)`},gl);
    const sg=el('g',{class:'glint'},gl);sg.appendChild(sh);sg.style.animationDelay=(-Math.random()*3).toFixed(2)+'s';return g}
  function spareT(k){return S.beast?`translate(${80+k*60},8) rotate(90)`:`translate(10,${96+k*56})`}
  function spareC(k){return S.beast?[60+k*60,158]:[160,116+k*56]}
  function drawSpares(){
    spareL.innerHTML='';
    for(let k=0;k<S.wraps;k++){const T=spareT(k),sg=el('g',{transform:T},spareL);foil(sg,0,0,BW,BH);
      const [lx,ly]=S.beast?[60+k*60,332]:[BW+34,116+k*56+7];
      el('text',{x:lx,y:ly,'text-anchor':'middle','font-size':20},el('g',{class:'num'},spareL)).textContent='1';
      interact(sg,{label:'Wrapped bar: tap to open it, or drag it into the Big Beast',
        down:()=>{const cl=sg.cloneNode(true);cl.removeAttribute('tabindex');FX.appendChild(cl);sg.style.opacity=.3;SFX.pop(.8);return{cl}},
        move:(p,p0,c)=>c.cl.setAttribute('transform',`translate(${p.x-p0.x},${p.y-p0.y}) ${T}`),
        up:(p,p0,c)=>{sg.style.opacity='';const cr=S.crit[S.sel];
          if(cr&&cr.big&&S.beast&&Math.abs(p.x-MX)<200&&p.y>MY-170){gulp(c.cl,p.x-p0.x,p.y-p0.y,T,k)}
          else{tween(300,t=>c.cl.setAttribute('transform',`translate(${(p.x-p0.x)*(1-t)},${(p.y-p0.y)*(1-t)}) ${T}`),()=>c.cl.remove(),ease.back);SFX.pop(.7);if(!cr||!cr.big)say('Only the Big Beast can swallow a whole bar.')}},
        tap:(p,c)=>{if(c&&c.cl)c.cl.remove();sg.style.opacity='';unwrapSpare()}})}
  }
  function unwrapSpare(){
    if(S.busy)return;if(S.left){say('Use up the bar on the rail before you open another one.');clonk();return}
    S.wraps--;S.left=S.m;S.opened=true;SFX.crinkle();later(180,()=>SFX.shimmer());burst(160,116,{n:16,cols:['#f7d36b','#c084fc','#fff0a0','#d9c2ff']});ring(160,116,{col:'#c084fc'});
    say(`A whole bar is ${S.m} squares. That is ${S.m}/${S.m}.`);drawBar();
  }
  function gulp(cl,dx,dy,T,k){
    const c=S.crit[S.sel];if(S.busy||!c){cl.remove();return}S.busy=true;S.wraps--;drawSpares();SFX.whoosh();
    const [sx,sy]=spareC(k),ex=MX-sx,ey=MY+80-sy;
    tween(420,t=>cl.setAttribute('transform',`translate(${lerp(dx,ex,t).toFixed(1)},${lerp(dy,ey,t*t).toFixed(1)}) ${T}`),()=>{
      c.o.openTo(0,80,()=>{cl.remove();SFX.snap(.6);SFX.gulp();later(100,()=>SFX.growl(.5));shake(14);crumbs(MX,MY,{n:14,cols:['#c084fc','#f7d36b','#9a6bd6'],up:1});floatText(MX,MY-60,'GULP!',{col:'#d9c2ff',size:34});
        c.got+=U;drawSigns();later(240,()=>c.o.openTo(1,200,()=>{S.busy=false;afterBite(c)}))})},ease.in);
  }
  const bsign=el('g',{},root);
  function drawBeastSign(){bsign.innerHTML='';const c=S.crit[S.sel];if(!S.beast||!c||!c.big)return;
    const g=el('g',{transform:'translate(486,118)'},bsign);
    el('rect',{x:-80,y:-56,width:160,height:124,rx:16,fill:'#fff4e6',stroke:'#7b3fa0','stroke-width':3},g);
    el('text',{y:-32,'text-anchor':'middle','font-size':14,fill:'#7b3fa0','font-weight':600},g).textContent='Big Beast wants';
    const e=svgExpr(g,0,-2,[['w',c.w],['f',c.n,c.d]],20,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));
    const got=Math.round(c.got/su()),gw=Math.floor(got/S.m),gr=got%S.m;
    el('text',{y:40,'text-anchor':'middle','font-size':13,fill:'#7b3fa0'},g).textContent='eaten so far';
    const parts=[];if(gw)parts.push(['w',gw]);if(gr||!gw)parts.push(['f',gr,S.m]);
    const e2=svgExpr(g,0,58,gw||gr?parts:[['w',0]],13,'middle');e2.setAttribute('class','');e2.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2861'));e2.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));
  }
  function drawSigns(){
    drawBeastSign();signL.innerHTML='';const n=S.crit.length;
    S.crit.forEach((c,k)=>{const x=slotX(k,n)-c.o.JL*QS/2+10,y=436,w=c.w?92:64;
      const g=el('g',{},signL);
      el('line',{x1:x,x2:x,y1:y+24,y2:y+40,stroke:'#8a6a7a','stroke-width':3},g);
      el('rect',{x:x-w/2,y:y-26,width:w,height:52,rx:10,fill:c.st==='ok'?'#2f6b4f':c.st==='over'?'#8a4a1a':'#fff4e6',stroke:'rgba(0,0,0,.2)'},g);
      const parts=[];if(c.w)parts.push(['w',c.w]);parts.push(['f',c.n,c.d]);
      const e=svgExpr(g,x,y,parts,15,'middle');e.setAttribute('class','');
      e.querySelectorAll('text').forEach(t=>t.setAttribute('style',`fill:${c.st==='ok'||c.st==='over'?'#fff4e6':'#3a2861'}`));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke',c.st==='ok'||c.st==='over'?'#fff4e6':'#3a2861'));
      if(c.st!=='hungry'){const bx=x+w/2,by=y-26,b=el('g',{transform:`translate(${bx},${by})`},g);
        el('circle',{r:12,fill:c.st==='ok'?'#4fd18b':c.st==='over'?'#ff9a4a':'#7fb8ff',stroke:'#1d1840','stroke-width':2},b);
        el('path',{d:c.st==='ok'?'M-5,0 l3.5,4 l6.5,-8':c.st==='over'?'M-5,3 l5,-6 l5,6':'M-5,-3 l5,6 l5,-6',fill:'none',stroke:'#1d1840','stroke-width':2.6,'stroke-linecap':'round','stroke-linejoin':'round'},b)}
    });
  }
  function select(k){
    if(S.busy)return;const c=S.crit[k];
    if(c.st==='ok'){say('That critter is happy already.');return}
    if(c.st==='over'){say('That one is stuffed!');return}
    if(S.sel===k)return;
    S.busy=true;S.ins=0;SFX.pop(1.2);
    const go=()=>{S.sel=k;
      if(c.big){S.beast=true;queueFade(0);c.o.place(MX,900,BSC,90,BSA);drawBar();drawSigns();barTo(1,450);SFX.growl(1.1);
        later(120,()=>{shake(10);c.o.moveTo(MX,MY+c.o.JL*BSC,BSC,480,()=>{c.o.openTo(1,260,()=>{SFX.snap(.5);S.busy=false;drawBar();
          say(S.wraps?'Big Beast gulps whole bars. Drop them in one at a time, then lower the open bar in for the rest.':'Lower the bar into its mouth, then tap Big Beast to bite.')})},90,0,ease.out,BSA)});return}
      c.o.moveTo(TX+c.o.JL,RY,1,380,()=>{c.o.openTo(1,220,()=>{S.busy=false;drawBar();say('Slide the bar into its mouth, then tap the critter to bite.')})})};
    if(S.sel>=0){const p=S.crit[S.sel];if(p.got>0&&p.got<want(p))p.st='under';S.sel=-1;drawBar();sendBack(p,go)}else go();
    tone(440,.08,'triangle',.06);
  }
  function sendBack(c,done){const k=S.crit.indexOf(c);
    if(c.big&&S.beast){c.o.openTo(0,150,()=>{SFX.rumble();c.o.moveTo(MX,1000,BSC,420,()=>{S.beast=false;c.o.place(slotX(k,S.crit.length),SLOTY,QS,0);barTo(0,400);queueFade(1);drawSigns();drawSpares();done&&done()},90,0,ease.inOut,BSA)});return}
    c.o.openTo(0,150,()=>c.o.moveTo(slotX(k,S.crit.length),SLOTY,QS,340,()=>{drawSigns();done&&done()}))}
  function queueFade(v){const pe=v?'':'none';S.crit.forEach(c=>{if(!c.big){c.o.gb.style.transition=c.o.gf.style.transition='opacity .4s';c.o.gb.style.opacity=c.o.gf.style.opacity=v;c.o.gb.style.pointerEvents=c.o.gf.style.pointerEvents=pe}});signL.style.transition='opacity .4s';signL.style.opacity=v;signL.style.pointerEvents=pe}
  function chomp(){
    const c=S.crit[S.sel];if(S.busy||!c)return;
    if(!S.ins){c.o.openTo(.6,80,()=>c.o.openTo(1,120));SFX.snap(.4);say(c.big&&S.wraps?'Drop a wrapped bar into its mouth, or lower the bar in.':'Slide the bar into its mouth first.');return}
    S.busy=true;const bite=S.ins,bx=S.beast?MX:TX,by=S.beast?MY:RY;
    c.o.openTo(0,90,()=>{SFX.snap(S.beast?.6:1);SFX.crunch();if(S.beast)SFX.growl(.5);shake(S.beast?9:4);crumbs(bx,by,{n:S.beast?16:10,up:S.beast?1:1});
      c.got+=bite*su();S.left-=bite;S.ins=0;drawBar();c.o.puff(1.1);later(160,()=>c.o.puff(1));
      later(130,()=>c.o.openTo(.25,90,()=>c.o.openTo(0,90)));
      later(420,()=>{S.busy=false;afterBite(c)})});
  }
  function afterBite(c){
    const w=want(c);drawSigns();
    const fx=S.beast?MX:TX+c.o.JL,fy=S.beast?MY-90:RY-70;
    if(c.got===w){c.st='ok';drawSigns();SFX.sparkle();burst(fx,fy,{n:18});ring(fx,fy);floatText(fx,fy,c.big?'Delicious!':'Yum!');say('Just right!');S.busy=true;later(600,()=>{S.sel=-1;sendBack(c,()=>{S.busy=false;checkEnd()})})}
    else if(c.got>w){c.st='over';drawSigns();c.o.puff(1.18);SFX.burp();shake(3);floatText(fx,fy,'Too much!',{col:'#ffb070'});say('Too much! That critter is stuffed.');S.busy=true;later(800,()=>{S.sel=-1;sendBack(c,()=>{S.busy=false;checkEnd()})})}
    else{c.o.openTo(1,180);SFX.rumble();floatText(fx,fy,'More!',{col:'#9fd0ff'});say(c.big&&S.beast?'Still hungry. Keep feeding Big Beast.':'Still hungry. Slide in a bit more.');checkEnd()}
  }
  function checkEnd(){
    const hungry=S.crit.filter(c=>c.st==='hungry'||c.st==='under');
    if(!hungry.length){const all=S.crit.every(c=>c.st==='ok');
      if(all){S.wins.add(S.lv);roundWon(S.lv);if(S.wins.size>=2)unlock('take');if(S.opened)unlock('open');st.ready(true);SFX.fanfare();burst(300,RY,{n:28,spread:140});ring(300,RY,{r1:200,w:7});later(200,()=>burst(150,RY-60,{n:14}));later(350,()=>burst(450,RY-60,{n:14}));say(S.left||S.wraps?'Everyone got just the right amount.':'Everyone got just the right amount, and the chocolate is all gone!')}
      else say('Everyone has eaten, but not everyone got the right amount. Try the sheet again?');return}
    if(!S.left&&!S.wraps){SFX.wrong();say('Out of chocolate! Someone got too much. Tap the redo stone to try again.')}
  }
  function load(){
    EPOCH++;FX.innerHTML='';backL.innerHTML='';frontL.innerHTML='';CREATS.clear();builtLeft=-1;S.beast=false;barT=0;barL.removeAttribute('transform');rail.style.opacity=1;signL.style.opacity=1;
    const L=LV[S.lv];S.m=L.m;S.m0=L.m;S.k=1;S.left=L.start||(L.empty?0:L.m);S.wraps=L.wr;cutG.innerHTML='';pvL.innerHTML='';cutGauge=L.cut?gauge(cutG,{x:84,y:150,r:46,vals:[1,2,3],val:1,caption:'cut each square into',label:'Cutting dial: cut every square smaller',onPreview:cutPreview,onChange:recutBar}):null;S.sel=-1;S.ins=0;S.busy=false;S.opened=false;st.ready(false);
    S.crit=L.cr.map(([w,n,d,big],k)=>{const o=snapper(k,!!big);const c={w,n,d,big:!!big,got:0,st:'hungry',o};
      o.place(slotX(k,L.cr.length),SLOTY,QS);
      [o.gb,o.gf].forEach(g=>interact(g,{label:big?'Big Beast':'critter',tap:()=>{if(S.sel===k)chomp();else select(k)}}));
      return c});
    navDots(LV.length,S.lv);
    drawBar();drawSigns();
    say(L.empty?'Two wrapped bars. Big Beast is very hungry. Tap a critter to call it over.':L.cut?'These squares don\u2019t fit every sign. Use the cutting dial to make them smaller, then feed the critters.':'Give every critter exactly what its sign says. Tap a critter to call it over.');
  }
  S.lv=resumeAt(LV.length);load();
}};
