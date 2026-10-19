
/* ================= World 9: Toll (a fraction of an amount) ================= */
W.toll={scene:'gorge',
notes:`<p>A fraction <i>of</i> an amount. A troll guards the bridge and wants a fraction of your gems as a toll: 3/4 of 12, say. The bottom number says how many equal shares to make, and the top number says how many of those shares to hand over.</p>
<p><b>Sharing.</b> She turns the crank and the gems are dealt out one at a time into the baskets on the rope, round and round, the way you deal cards. The troll only takes fair shares, so every gem has to be dealt and every basket must match.</p>
<p><b>Paying.</b> She taps the baskets to give, then pulls the rope. The baskets zip across and the troll counts. Too few and he roars; too many and he gobbles the lot with a greedy laugh and you start again.</p>
<p><b>Rounds.</b> 1/2 of 8, 1/3 of 9 and 2/3 of 9 have the right baskets already hung. For 3/4 of 12, 3/5 of 10 and finally 5/6 of 18 she has to hang the right number of baskets herself. Hang the wrong number and the shares come out the wrong size: 12 in 3 baskets is 4 each, so 3 baskets is all 12.</p>
<p>With the numbers on, each basket shows its count and a win writes it out: 3/4 of 12 = 3 × 3 = 9 (12 shared into 4 is 3 each; 3 of those is 9).</p>`,
mount(root){
  const R=[{f:[1,2],g:8,fix:1},{f:[1,3],g:9,fix:1},{f:[2,3],g:9,fix:1},{f:[3,4],g:12,fix:0},{f:[3,5],g:10,fix:0},{f:[5,6],g:18,fix:0}];
  const S={r:0,n:2,cnt:[],land:[],pile:0,ptr:0,sel:new Set(),busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r];
  const GEMC=['#ff7eb6','#7ee0ff','#ffd36a','#a98bff','#8ff0a8'];
  const RY=96,PL=150,PR=450,sag=x=>RY+14*Math.sin(Math.PI*(x-PL)/(PR-PL));

  /* the gorge */
  const land=el('g',{},root);
  el('path',{d:'M140,330 L460,330 L470,640 L130,640Z',fill:'#120d2a'},land);
  [[390,.09],[450,.07],[515,.05]].forEach(([y,o])=>el('ellipse',{cx:300,cy:y,rx:200,ry:22,fill:'#cfc6ff',opacity:o,class:'mote'},land));
  el('path',{d:'M-300,330 L140,330 Q152,380 136,430 Q150,520 128,640 L-300,640Z',fill:'#3b2f5e'},land);
  el('path',{d:'M460,330 L900,330 L900,640 L472,640 Q452,520 466,430 Q448,380 460,330Z',fill:'#3b2f5e'},land);
  el('path',{d:'M-300,330 L140,330',stroke:'#6a8f5a','stroke-width':8,'stroke-linecap':'round'},land);el('path',{d:'M460,330 L900,330',stroke:'#6a8f5a','stroke-width':8,'stroke-linecap':'round'},land);
  [[40,380,18],[100,560,14],[500,400,16],[540,520,20],[20,500,12]].forEach(([x,y,r])=>el('ellipse',{cx:x,cy:y,rx:r,ry:r*.6,fill:'#4a3d72'},land));
  /* rope bridge */
  const bridge=el('g',{},root),bq=t=>({x:lerp(140,460,t),y:330+30*Math.sin(Math.PI*t)});
  el('path',{d:'M140,300 Q300,350 460,300',fill:'none',stroke:'#c9a77a','stroke-width':3},bridge);
  for(let k=0;k<=16;k++){const p=bq(k/16);el('rect',{x:p.x-8,y:p.y-3,width:16,height:7,rx:2,fill:k%2?'#8a6448':'#9c7350',transform:`rotate(${(Math.cos(Math.PI*k/16)*10).toFixed(1)} ${p.x} ${p.y})`},bridge);el('line',{x1:p.x,y1:p.y,x2:p.x,y2:300+25*Math.sin(Math.PI*k/16),stroke:'#c9a77a','stroke-width':1.5},bridge)}
  /* zipline */
  const zip=el('g',{},root);
  [PL,PR].forEach(x=>{el('rect',{x:x-6,y:RY-14,width:12,height:330-RY+14,rx:4,fill:'#7a5a44'},zip);el('circle',{cx:x,cy:RY,r:8,fill:'#c9a77a'},zip)});
  el('path',{d:`M${PL},${RY} Q300,${RY+28} ${PR},${RY}`,fill:'none',stroke:'#e8d2a8','stroke-width':3},zip);

  /* the troll */
  const TX=535,TY=330,troll=el('g',{transform:`translate(${TX},${TY})`},root),tin=el('g',{class:'bob'},troll);
  el('ellipse',{cx:0,cy:4,rx:62,ry:9,fill:'#0d0a24',opacity:.35},troll);
  [-1,1].forEach(s=>el('ellipse',{cx:s*26,cy:-4,rx:20,ry:10,fill:'#5d7650'},tin));
  [-1,1].forEach(s=>{el('path',{d:`M${s*48},-78 Q${s*66},-50 ${s*60},-22`,fill:'none',stroke:'#6d8a5e','stroke-width':18,'stroke-linecap':'round'},tin);el('circle',{cx:s*60,cy:-18,r:12,fill:'#7f9b6e'},tin)});
  el('path',{d:'M-54,-8 C-62,-70 -46,-128 0,-132 C46,-128 62,-70 54,-8 Q0,4 -54,-8Z',fill:'#7f9b6e'},tin);
  el('ellipse',{cx:0,cy:-38,rx:36,ry:28,fill:'#a9bf8c',opacity:.8},tin);
  [-1,1].forEach(s=>el('path',{d:`M${s*26},-122 q${s*10},-26 ${s*28},-30 q${-s*10},14 ${-s*14},34Z`,fill:'#e8dcc0'},tin));
  el('path',{d:'M-14,-131 q6,-14 14,-6 q8,-12 14,4',fill:'none',stroke:'#4f6a44','stroke-width':4,'stroke-linecap':'round'},tin);
  const eyes=[-18,18].map(x=>{el('circle',{cx:x,cy:-92,r:10,fill:'#fff8e0'},tin);const p=el('circle',{cx:x,cy:-92,r:4.5,fill:'#241a3a'},tin);return{x,p}});
  const brow=el('path',{fill:'none',stroke:'#3f5636','stroke-width':6,'stroke-linecap':'round'},tin);
  el('ellipse',{cx:0,cy:-74,rx:15,ry:12,fill:'#93ad7c'},tin);el('ellipse',{cx:-5,cy:-78,rx:5,ry:3,fill:'#fff',opacity:.25},tin);
  const mouth=el('path',{stroke:'#2a1a2a','stroke-width':3.5,'stroke-linecap':'round','stroke-linejoin':'round'},tin);
  const tusks=el('g',{},tin);[-1,1].forEach(s=>el('path',{d:`M${s*14},-52 l${s*3},-10 l${s*4},10Z`,fill:'#fff8e0'},tusks));
  const sack=el('g',{transform:'translate(64,-10)'},tin);el('path',{d:'M-14,0 q-6,-26 14,-30 q20,4 14,30Z',fill:'#8a6a9a'},sack);el('path',{d:'M-6,-28 l12,0',stroke:'#c9a77a','stroke-width':3},sack);
  function tmood(m){const B={'':'M-30,-104 L-8,-102 M8,-102 L30,-104',grump:'M-30,-110 L-6,-98 M6,-98 L30,-110',happy:'M-30,-106 Q-19,-114 -8,-108 M8,-108 Q19,-114 30,-106',greedy:'M-30,-108 Q-19,-112 -8,-104 M8,-104 Q19,-112 30,-108'};
    const M={'':'M-20,-52 Q0,-48 20,-52',grump:'M-20,-46 Q0,-58 20,-46',happy:'M-22,-58 Q0,-32 22,-58',greedy:'M-24,-60 Q0,-26 24,-60Z',roar:'M-16,-58 Q0,-70 16,-58 Q20,-34 0,-32 Q-20,-34 -16,-58Z',eat:'M-10,-50 a10,8 0 1 0 20,0 a10,8 0 1 0 -20,0'};
    brow.setAttribute('d',B[m]||B['']);mouth.setAttribute('d',M[m]||M['']);mouth.setAttribute('fill',m==='greedy'||m==='roar'||m==='eat'?'#3a1f2a':'none')}
  function tlook(x,y){eyes.forEach(e=>{const dx=x-(TX+e.x),dy=y-(TY-92),d=Math.hypot(dx,dy)||1;e.p.setAttribute('cx',(e.x+dx/d*4).toFixed(1));e.p.setAttribute('cy',(-92+dy/d*4).toFixed(1))})}
  let tx=TX,ty=TY;const putT=(x,y)=>{tx=x;ty=y;troll.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`)};
  interact(troll,{label:'The troll',tap:()=>{tmood('roar');SFX.growl(.5);shake(2);later(600,()=>tmood(S.won?'happy':''))}});

  /* our traveller and the cart of gems */
  const hero=creature(root,{x:26,y:300,r:26,i:5,label:'Pip'});
  const CS=1.35,cart=el('g',{},root),cartIn=el('g',{transform:`translate(91,322) scale(${CS}) translate(-91,-322)`},cart),pileL=el('g',{},cartIn);
  el('path',{d:'M58,296 L124,296 L118,322 L64,322Z',fill:'#8a6448',stroke:'#5a3f2c','stroke-width':2.5},cartIn);
  [70,112].forEach(x=>{el('circle',{cx:x,cy:324,r:7,fill:'#3a2a20',stroke:'#c9a77a','stroke-width':2},cartIn)});
  const cartN=el('text',{x:91,y:346,'text-anchor':'middle','font-size':15},el('g',{class:'num'},cartIn));
  let cx0=0;const putC=x=>{cx0=x;cart.setAttribute('transform',`translate(${x.toFixed(1)},0)`)};
  const pileXY=k=>{const row=Math.floor(k/5),col=k%5;return{x:70+col*11+(row%2)*5,y:288-row*9}},pileW=k=>{const p=pileXY(k);return{x:91+(p.x-91)*CS+cx0,y:322+(p.y-322)*CS}};
  function gem(parent,x,y,k,sc=1){const g=el('g',{transform:`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})`},parent);
    el('path',{d:'M0,-7 L6.5,-2 L4,6 L-4,6 L-6.5,-2Z',fill:GEMC[k%GEMC.length],stroke:'#fff','stroke-opacity':.5,'stroke-width':1},g);el('path',{d:'M-3,-3 L0,-6 L2,-3Z',fill:'#fff',opacity:.6},g);return g}
  function drawPile(){pileL.innerHTML='';for(let k=0;k<S.pile;k++){const p=pileXY(k);gem(pileL,p.x,p.y,k)}cartN.textContent=S.pile}

  /* baskets on the rope */
  const bL=el('g',{},root);let B=[];
  const DROP=40,bSp=()=>S.n>1?Math.min(76,280/(S.n-1)):76,bSc=()=>Math.min(1.38,bSp()/56);
  const bX=i=>300+(i-(S.n-1)/2)*(S.n>1?bSp():0);
  const slot=(k)=>({x:((k%3)-1)*12,y:38-Math.floor(k/3)*9});
  const slotW=(b,k)=>{const s=slot(k),sc=bSc();return{x:b.x+sc*s.x,y:b.hy+sc*(DROP+s.y)}};
  function drawBaskets(){bL.innerHTML='';B=[];const sc=bSc();for(let i=0;i<S.n;i++){const x=bX(i),hy=sag(x);
      const g=el('g',{transform:`translate(${x.toFixed(1)},${hy.toFixed(1)}) scale(${sc.toFixed(3)})`},bL),lift=el('g',{},g);
      el('rect',{x:-26,y:-4,width:52,height:DROP+66,fill:'transparent'},lift);el('circle',{cx:0,cy:0,r:5,fill:'none',stroke:'#c9a77a','stroke-width':3},lift);el('line',{x1:0,y1:5,x2:0,y2:DROP+10,stroke:'#c9a77a','stroke-width':2},lift);
      const body=el('g',{transform:`translate(0,${DROP})`},lift);
      el('path',{d:'M-20,26 Q0,-6 20,26',fill:'none',stroke:'#a0785a','stroke-width':3},body);
      const glow=el('path',{d:'M-28,22 L28,22 L22,60 L-22,60Z',fill:'none',stroke:'#fff0a0','stroke-width':5,opacity:0},body);
      el('path',{d:'M-24,26 L24,26 L19,56 L-19,56Z',fill:'#6a4a34'},body);
      el('rect',{x:-26,y:23,width:52,height:6,rx:3,fill:'#d9a873'},body);
      const gl=el('g',{},body);
      el('path',{d:'M-22.5,44 L22.5,44 L19,56 L-19,56Z',fill:'#b88a5c'},body);[-12,0,12].forEach(dx=>el('line',{x1:dx,y1:45,x2:dx*.85,y2:55,stroke:'#8a6448','stroke-width':1.5},body));
      const lab=el('text',{x:0,y:76,'text-anchor':'middle','font-size':15},el('g',{class:'num'},body));
      const tm=el('g',{transform:`translate(0,${DROP+98})`,opacity:0},lift);[-1,1].forEach(s=>el('path',{d:`M${s*6},-6 l${s*4},-8 l${-s*7},4Z`,fill:'#e8dcc0'},tm));el('circle',{r:10,fill:'#7f9b6e',stroke:'#fff0a0','stroke-width':2},tm);[-1,1].forEach(s=>el('circle',{cx:s*3.5,cy:-1,r:1.8,fill:'#241a3a'},tm));el('path',{d:'M-4,4 q4,3 8,0',fill:'none',stroke:'#241a3a','stroke-width':1.5},tm);
      const b={i,x,hy,g,lift,gl,glow,lab,sc,tm};B.push(b);fillBasket(b);
      interact(g,{label:`Basket ${i+1}`,tap:()=>pick(i)})}}
  function fillBasket(b){b.gl.innerHTML='';const n=S.land[b.i]||0;for(let k=0;k<n;k++){const s=slot(k);gem(b.gl,s.x,s.y,k+b.i,1.15)}b.lab.textContent=n||'';
    const on=S.sel.has(b.i);b.lift.setAttribute('transform',on?'translate(0,-12)':'');b.glow.setAttribute('opacity',on?1:0);b.tm.setAttribute('opacity',on?1:0)}

  /* the crank deals the gems round and round */
  const CX=88,CYc=470,crank=el('g',{transform:`translate(${CX},${CYc})`},root);
  el('circle',{r:46,fill:'#2a2150',stroke:'rgba(255,244,230,.25)','stroke-width':2},crank);
  const wheel=el('g',{},crank);el('circle',{r:34,fill:'url(#gKnob)',stroke:'#c9a77a','stroke-width':3},wheel);
  for(let k=0;k<4;k++)el('line',{x1:0,y1:0,x2:30*Math.cos(k*Math.PI/2),y2:30*Math.sin(k*Math.PI/2),stroke:'#c9a77a','stroke-width':3},wheel);
  el('circle',{cx:30,cy:0,r:10,fill:'#ffd36a',stroke:'#fff0d8','stroke-width':2},wheel);el('circle',{r:6,fill:'#c9a77a'},wheel);
  const crankHint=el('path',{d:'M-40,-54 A52,52 0 0 1 40,-54 m-10,-6 l10,6 l-10,6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round',opacity:.7},crank);
  let crAng=0,crAcc=0;const turn=a=>{crAng=a;wheel.setAttribute('transform',`rotate(${(a*180/Math.PI).toFixed(1)})`)};
  interact(crank,{label:'Turn the crank to deal out the gems',
    down:p=>({last:Math.atan2(p.y-CYc,p.x-CX)}),
    move:(p,p0,c)=>{if(S.busy)return;const a=Math.atan2(p.y-CYc,p.x-CX);let d=a-c.last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;c.last=a;
      if(d>0){turn(crAng+d);crAcc+=d;while(crAcc>=Math.PI/2){crAcc-=Math.PI/2;dealOne()}}else turn(crAng+d*.3)},
    tap:()=>{if(S.busy)return;const a0=crAng;tween(180,(t,p)=>turn(a0+Math.PI/2*p),null,ease.out);dealOne()}});

  function dealOne(){
    if(S.busy||S.won)return;if(!S.pile){if(!S.toldAll){S.toldAll=true;say('All the gems are dealt out.')}return}
    crankHint.style.display='none';
    const i=S.ptr%S.n,k=S.cnt[i]||0;S.cnt[i]=k+1;S.pile--;S.ptr++;
    const from=pileW(S.pile),ep=S.ep;drawPile();
    const b=B[i],w=slotW(b,k),fx0=from.x,fy0=from.y,tx1=w.x,ty1=w.y,fl=gem(FX,fx0,fy0,k+i,1.4);
    SFX.tick(i);osc('triangle',1800+i*120,.04,.03,{wet:.2});
    tween(300,(t,p)=>fl.setAttribute('transform',`translate(${lerp(fx0,tx1,p).toFixed(1)},${(lerp(fy0,ty1,p)-Math.sin(p*Math.PI)*70).toFixed(1)}) rotate(${(p*360).toFixed(0)}) scale(1.4)`),()=>{fl.remove();if(S.won||S.ep!==ep)return;S.land[i]=(S.land[i]||0)+1;fillBasket(b);SFX.clink(i);
      if(!S.pile&&S.ptr>=Rr().g&&!S.done){S.done=true;afterDeal()}},ease.inOut);
  }
  function afterDeal(){const even=S.cnt.every(c=>c===S.cnt[0]);
    if(even){SFX.sparkle();B.forEach(b=>ring(b.x,b.hy+42,{r1:40,w:3,dur:500}));const f=Rr().f;say(`Fair shares, ${S.cnt[0]} in each. ${f[0]}/${f[1]} means ${f[0]} of ${f[1]} equal baskets. Tap the troll's, then pull the rope. You keep the rest.`)}
    else{SFX.wrong();tmood('grump');B.forEach(b=>{if(S.cnt[b.i]>Math.min(...S.cnt))wob(b)});say('Uneven! Some baskets have more. The troll only takes fair shares.')}}
  function wob(b){tween(500,(t,p)=>b.g.setAttribute('transform',`translate(${b.x.toFixed(1)},${b.hy.toFixed(1)}) scale(${b.sc.toFixed(3)}) rotate(${(Math.sin(p*Math.PI*6)*10*(1-p)).toFixed(1)})`),null,ease.lin)}
  function pick(i){if(S.busy||S.won)return;
    if(S.pile){SFX.wrong();wob(B[i]);say('Deal out all the gems first. Turn the crank.');return}
    if(S.sel.has(i))S.sel.delete(i);else S.sel.add(i);SFX.pop(S.sel.has(i)?1.2:.8);fillBasket(B[i]);tlook(B[i].x,B[i].hy);
    const n=S.sel.size;say(n?`${NUMW[n][0].toUpperCase()+NUMW[n].slice(1)} basket${n>1?'s':''} for the troll. Pull the rope to send ${n>1?'them':'it'} over. You keep the rest.`:'Tap the baskets for the troll.')}

  /* how many baskets (for the later rounds) */
  const hang=el('g',{},root);
  function drawHang(){hang.innerHTML='';if(Rr().fix)return;const y=530;
    el('ellipse',{cx:300,cy:y+26,rx:80,ry:14,fill:'#3b2f5e'},hang);
    const st=el('g',{transform:`translate(300,${y})`},hang);for(let k=0;k<3;k++){el('path',{d:`M-22,${-k*7} L22,${-k*7} L17,${18-k*7} L-17,${18-k*7}Z`,fill:k?'#a07a52':'#b88a5c',stroke:'#6a4a34','stroke-width':1.5},st)}
    el('text',{x:0,y:-20,'text-anchor':'middle','font-size':14,fill:'#d8c6e4'},st).textContent='baskets';
    [[-1,'−','Take a basket down'],[1,'+','Hang another basket']].forEach(([s,t,lab])=>{const b=el('g',{transform:`translate(${300+s*62},${y+4})`},hang);
      el('circle',{r:20,fill:'url(#gKnob)',stroke:'rgba(255,244,230,.4)','stroke-width':2},b);el('text',{y:7,'text-anchor':'middle','font-size':22,'font-weight':600,fill:'#fff0a0'},b).textContent=t;
      interact(b,{label:lab,tap:()=>setN(S.n+s)})})}
  function setN(n){if(S.busy||S.won)return;n=clamp(n,1,6);if(n===S.n){SFX.wrong();return}
    if(S.ptr){SFX.whoosh();say('The gems tip back into the cart.')}
    S.ep=(S.ep||0)+1;S.n=n;S.cnt=Array(n).fill(0);S.land=Array(n).fill(0);S.pile=Rr().g;S.ptr=0;S.sel.clear();S.done=false;S.toldAll=false;drawPile();drawBaskets();B.forEach(b=>popIn(b.g,.4));SFX.clonk();crankHint.style.display='';
    if(!S.ptr)say(`${NUMW[n][0].toUpperCase()+NUMW[n].slice(1)} basket${n>1?'s':''} on the rope. Turn the crank to deal.`)}

  /* the rope that sends the chosen baskets over */
  const HX=468,HY0=410,HMAX=500,pullG=el('g',{},root),pRope=el('line',{x1:HX,y1:RY+10,x2:HX,y2:HY0,stroke:'#e8d2a8','stroke-width':3},pullG);
  const handle=el('g',{},pullG);el('circle',{r:32,fill:'transparent'},handle);el('rect',{x:-18,y:-6,width:36,height:14,rx:7,fill:'#ff9a6a',stroke:'#fff0d8','stroke-width':2.5},handle);
  let hy=HY0;const putH=y=>{hy=y;handle.setAttribute('transform',`translate(${HX},${y.toFixed(1)})`);pRope.setAttribute('y2',y-6)};putH(HY0);
  interact(handle,{label:'Pull the rope to send the baskets to the troll',down:()=>({y0:hy}),
    move:(p,p0,c)=>{if(S.busy||S.won||c.fired)return;putH(clamp(c.y0+p.y-p0.y,HY0,HMAX));if(hy>=HMAX-2){c.fired=true;give()}},
    up:(p,p0,c)=>{if(!c.fired&&hy<HMAX-2){const y0=hy;tween(220,t=>putH(lerp(y0,HY0,t)),null,ease.back)}},
    tap:()=>{if(S.busy||S.won)return;tween(240,t=>putH(lerp(HY0,HMAX,t)),give,ease.in)}});

  function give(){
    if(S.busy||S.won)return;const back=()=>{const y0=hy;tween(260,t=>putH(lerp(y0,HY0,t)),null,ease.back)};
    if(S.pile){back();SFX.wrong();say('Deal out all the gems first. Turn the crank.');return}
    if(!S.cnt.every(c=>c===S.cnt[0])){back();SFX.wrong();tmood('grump');say('The troll only takes fair shares. Change the number of baskets.');return}
    if(!S.sel.size){back();SFX.wrong();say('Tap the baskets you want to give first.');return}
    S.busy=true;SFX.thud();SFX.whoosh();back();
    const sent=[...S.sel].map(i=>B[i]),tot=sent.reduce((a,b)=>a+S.cnt[b.i],0),want=Rr().g*Rr().f[0]/Rr().f[1];
    tmood('greedy');tlook(PR,RY+40);
    sent.forEach((b,k)=>later(k*120,()=>{const x0=b.x;tween(520,(t,p)=>{const x=lerp(x0,PR-10,p);b.g.setAttribute('transform',`translate(${x.toFixed(1)},${sag(x).toFixed(1)}) scale(${b.sc.toFixed(3)})`)},null,ease.in)}));
    later(600+sent.length*120,()=>{
      sent.forEach(b=>b.g.style.opacity=0);tmood('eat');let c=0;
      const count=()=>{c++;SFX.plink(c%10);floatText(tx-10+((c%3)-1)*18,ty-150-(c%2)*12,String(c),{size:20});if(c<tot)later(110,count);else later(380,verdict)};count();
      function verdict(){
        if(tot===want){S.won=true;S.wins.add(S.r);roundWon(S.r);tmood('happy');SFX.fanfare();burst(tx,ty-90,{n:22,spread:120,cols:['#ff7eb6','#7ee0ff','#ffd36a','#a98bff','#8ff0a8']});ring(tx,ty-70,{r1:150,w:6});floatText(tx-20,ty-170,'Fair toll!');
          if(S.wins.size>=3)unlock('of');st.ready(true);showSum();
          /* the gems you kept go back in the cart, then off you go */
          let dl=300;B.filter(b=>!S.sel.has(b.i)).forEach(b=>{const n=S.land[b.i];for(let k=n-1;k>=0;k--){const w=slotW(b,k),kk=k,bb=b;later(dl,()=>{S.land[bb.i]=kk;fillBasket(bb);const to=pileW(S.pile),fl=gem(FX,w.x,w.y,kk+bb.i,1.4);S.pile++;
            tween(320,(t,p)=>fl.setAttribute('transform',`translate(${lerp(w.x,to.x,p).toFixed(1)},${(lerp(w.y,to.y,p)-Math.sin(p*Math.PI)*50).toFixed(1)}) scale(1.4)`),()=>{fl.remove();drawPile();SFX.clink(kk)},ease.inOut)});dl+=90}});
          tween(300,(t,p)=>pullG.setAttribute('opacity',(1-p).toFixed(2)),null,ease.lin);
          later(dl+500,()=>{tween(700,(t,p)=>putT(lerp(TX,TX+46,p),TY-Math.sin(p*Math.PI)*24),null,ease.inOut);
            later(600,()=>{hero.mood('happy');const steps=22;for(let k=0;k<=steps;k++)later(k*70,()=>{const t=k/steps,p=bq(t);hero.place(p.x-62,p.y-26);putC(p.x-78);if(k%3===0)SFX.tick(k%5)});
              later(steps*70+100,()=>{hero.hop(16);SFX.chime()})})});
          say(`The troll is happy: ${Rr().f[0]}/${Rr().f[1]} of ${Rr().g} is ${want}.`)}
        else if(tot<want){tmood('roar');SFX.growl(1);shake(7);floatText(tx-20,ty-170,'MORE!',{col:'#ffb070',size:30});
          later(500,()=>{sent.forEach(b=>{b.g.style.opacity=1;const x1=b.x;tween(420,(t,p)=>{const x=lerp(PR-10,x1,p);b.g.setAttribute('transform',`translate(${x.toFixed(1)},${sag(x).toFixed(1)}) scale(${b.sc.toFixed(3)})`)},null,ease.out)});S.sel.clear();B.forEach(fillBasket);S.busy=false;later(600,()=>tmood('grump'))});
          say(`Not enough! ${tot} gem${tot>1?'s':''} is less than the troll wants.`)}
        else{tmood('greedy');SFX.burp();later(250,()=>{SFX.laugh()});floatText(tx-20,ty-170,'Ho ho!',{col:'#ffb070',size:28});
          say(`Too many! ${Rr().f[0]}/${Rr().f[1]} is only ${Rr().f[0]} of the ${Rr().f[1]} baskets. The troll kept all ${tot}.`);later(2600,()=>load())}}});
  }
  function showSum(){const f=Rr().f,g=Rr().g,each=g/f[1];
    svgExpr(sumL,300,436,[['f',f[0],f[1]],['t','of'],['w',g],['o','='],['w',f[0]],['o','×'],['w',each],['o','='],['w',f[0]*each]],16,'middle');
    el('text',{x:300,y:470,'text-anchor':'middle','font-size':13,fill:'#d8c6e4'},el('g',{class:'num'},sumL)).textContent=`${g} shared into ${f[1]} is ${each} each; ${f[0]} of those is ${f[0]*each}`}

  /* sign, controls, rounds */
  const signL=el('g',{},root),sumL=el('g',{},root);
  function drawSign(){signL.innerHTML='';const f=Rr().f,parts=[['t','The toll is'],['f',f[0],f[1]],['t',`of your ${Rr().g} gems`]];
    const w=exprWidth(parts,18)+40;el('rect',{x:300-w/2,y:12,width:w,height:56,rx:12,fill:'#e9d7b4',stroke:'#7a5a44','stroke-width':3},signL);
    [-1,1].forEach(s=>el('circle',{cx:300+s*(w/2-10),cy:22,r:3,fill:'#7a5a44'},signL));
    const e=svgExpr(signL,300,40,parts,18,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2418'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'));
    const ts=[...e.querySelectorAll('text')];const nt=ts.find(t=>t.textContent===String(f[0])),dt=ts.find(t=>t.textContent===String(f[1]));if(nt)nt.setAttribute('style','fill:#c27a00;font-weight:700');if(dt)dt.setAttribute('style','fill:#7a4a2a;font-weight:700')}
  navStone({glyph:'redo',label:'Start this toll again',onTap:()=>load()});
  const st=navStone({label:'Next bridge',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';sumL.innerHTML='';const r=Rr();S.ep=(S.ep||0)+1;S.n=r.fix?r.f[1]:2;S.cnt=Array(S.n).fill(0);S.land=Array(S.n).fill(0);S.pile=r.g;S.ptr=0;S.sel.clear();S.busy=false;S.won=false;S.done=false;S.toldAll=false;st.ready(false);
    putT(TX,TY);pullG.setAttribute('opacity',1);tmood('');tlook(300,200);hero.place(26,300);hero.mood('');putC(0);putH(HY0);crankHint.style.display='';
    navDots(R.length,S.r);drawSign();drawPile();drawBaskets();drawHang();
    say(r.fix?`First share all ${r.g} gems equally into the ${r.f[1]} baskets. Turn the crank.`:`${r.f[0]}/${r.f[1]} of your gems. How many equal baskets do you need? Hang them, then turn the crank.`)}
  S.r=resumeAt(R.length);load();
}};
