
/* ================= World 8: Leap ================= */
W.leap={scene:'river',
notes:`<p>Multiplying a fraction by a whole number, as hops along a river. The posts sticking out of the water mark whole numbers. Hopper the frog always hops the same distance, and lots of hops is repeated adding.</p>
<p><b>First, top-heavy fractions.</b> The first two islands are labelled 3/2 and 4/3. Three hops of a half is three halves, so she counts halves. Hopper lands between the posts, and the sign turns over to show 3/2 = 1 1/2: one whole and a half left.</p>
<p><b>Then mixed numbers.</b> Round three is the same island again, but now labelled 1 1/2, so she has to see that it is three halves. After that: 2 1/4 with quarter hops, 2 2/3 with thirds.</p>
<p><b>Bead rounds.</b> The sign says how big each hop is. She slides beads along the abacus to choose how many hops, then presses Go. Hopper does them all in one go, so it has to be worked out first. Too many and Hopper splashes in; too few and Hopper is stranded on a lily pad.</p>
<p><b>Slingshot rounds.</b> The number of hops is fixed; she pulls Hopper back (left or down-left, as far as she likes) to choose how big each hop is. The first landing spot and the hop size show while she pulls.</p>`,
mount(root){river(root,[{mode:'beads',s:[1,2],t:[1,1,2],imp:1},{mode:'beads',s:[1,3],t:[1,1,3],imp:1},{mode:'beads',s:[1,2],t:[1,1,2]},{mode:'beads',s:[3,4],t:[2,1,4]},{mode:'beads',s:[2,3],t:[2,2,3]},{mode:'sling',n:5,t:[2,1,2]},{mode:'sling',n:3,t:[2,1,4]}],'lots')}};
function river(root,R,idea){
  const X=v=>105+v*132,SY=300;
  const OPTS=[[1,4],[1,3],[1,2],[2,3],[3,4],[1,1]];
  const S={r:0,beads:0,stride:null,busy:false,wins:new Set(),won:false};
  const Rr=()=>R[S.r],TU=()=>{const t=Rr().t;return U*t[0]+U*t[1]/t[2]},XU=u=>X(u/U);

  /* the river */
  const water=el('g',{},root);
  el('rect',{x:-400,y:SY,width:1400,height:150,fill:'url(#gRiver)'},water);
  for(let k=0;k<14;k++){const y=SY+14+((k*37)%120),x=-200+((k*173)%900);el('path',{d:`M${x},${y} q16,-5 32,0 t32,0`,fill:'none',stroke:'#9fd0ff',opacity:.18,'stroke-width':2,class:'mote'},water)}
  el('ellipse',{cx:470,cy:SY+60,rx:26,ry:70,fill:'#fff1d6',opacity:.06},water);
  const posts=el('g',{},root),postG=[];
  [0,1,2,3].forEach(v=>{const x=X(v),g=el('g',{},posts);postG[v]=g;
    if(v===0){el('rect',{x:x-3,y:SY-70,width:6,height:60,rx:3,fill:'#7a5a44'},g);el('path',{d:`M${x-46},${SY+14} Q${x-40},${SY-16} ${x},${SY-14} Q${x+34},${SY-12} ${x+30},${SY+14}Z`,fill:'#4a4170',stroke:'rgba(255,244,230,.2)'},g)}
    else{el('rect',{x:x-5,y:SY-66,width:10,height:96,rx:4,fill:'#7a5a44'},g);el('rect',{x:x-5,y:SY+10,width:10,height:4,fill:'#9fd0ff',opacity:.4},g)}
    const pl=el('g',{transform:`translate(${x},${SY-82})`},g);el('circle',{r:15,fill:'#fff4e6',stroke:'#7a5a44','stroke-width':3},pl);el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':600,fill:'#3a2861'},pl).textContent=v});
  const islandL=el('g',{},root),padL=el('g',{},root),labL=el('g',{},root),slingL=el('g',{},root);
  /* Hopper */
  const frog=el('g',{},root),fin=el('g',{},frog);
  el('ellipse',{cx:0,cy:16,rx:24,ry:5,fill:'#0d0a24',opacity:.3},frog);
  [-1,1].forEach(sd=>el('ellipse',{cx:sd*20,cy:8,rx:12,ry:8,fill:'#4fa84a'},fin));
  el('ellipse',{cx:0,cy:0,rx:25,ry:17,fill:'#7fd36b'},fin);el('ellipse',{cx:0,cy:6,rx:15,ry:9,fill:'#c8f0a0'},fin);
  [-1,1].forEach(sd=>{el('circle',{cx:sd*11,cy:-14,r:9,fill:'#7fd36b'},fin);el('circle',{cx:sd*11,cy:-15,r:6.5,fill:'#fffaf2'},fin);el('circle',{cx:sd*11+1.5,cy:-15,r:3.4,fill:'#241a3a'},fin);el('ellipse',{cx:sd*17,cy:0,rx:4,ry:2.4,fill:'#ff8fb0',opacity:.6},fin)});
  const mouth=el('path',{d:'M-9,2 Q0,9 9,2',fill:'none',stroke:'#2f5a2a','stroke-width':2.2,'stroke-linecap':'round'},fin);
  [-1,1].forEach(sd=>el('ellipse',{cx:sd*8,cy:15,rx:5,ry:3,fill:'#4fa84a'},fin));
  let fx=X(0),fy=SY-17;const putF=(x,y,sx=1,sy=1,rot=0)=>{fx=x;fy=y;frog.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)})`);fin.setAttribute('transform',`translate(0,16) scale(${sx.toFixed(3)},${sy.toFixed(3)}) translate(0,-16)`)};
  const face=m=>mouth.setAttribute('d',m==='happy'?'M-10,1 Q0,13 10,1':m==='sad'?'M-8,7 Q0,0 8,7':m==='oh'?'M-3,4 a3,3 0 1 0 6,0 a3,3 0 1 0 -6,0':'M-9,2 Q0,9 9,2');

  /* sign */
  const signL=el('g',{},root),dots=el('g',{},root),exL=el('g',{},root);
  function drawSign(){signL.innerHTML='';const r=Rr(),parts=r.mode==='beads'?[['t','each hop is'],['f',r.s[0],r.s[1]]]:[['t',`${r.n} hops, each hop is ?`]];
    const w=exprWidth(parts,19)+44;el('rect',{x:300-w/2,y:12,width:w,height:56,rx:14,fill:'#fff4e6',stroke:'#4fa84a','stroke-width':3},signL);
    const e=svgExpr(signL,300,40,parts,19,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#2f4a2a'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#2f4a2a'));
    navDots(R.length,S.r)}
  function drawIsland(won){islandL.innerHTML='';const x=XU(TU()),t=Rr().t;postG.forEach((g,v)=>g.style.display=(v&&!t[1]&&t[0]===v)?'none':'');
    el('line',{x1:x-26,y1:SY-108,x2:x-26,y2:SY-2,stroke:'#8a6a44','stroke-width':4,'stroke-linecap':'round'},islandL);
    el('ellipse',{cx:x,cy:SY+4,rx:36,ry:13,fill:'#d9b67a'},islandL);el('ellipse',{cx:x,cy:SY+1,rx:30,ry:8,fill:'#6fbf5a'},islandL);
    el('path',{d:`M${x+14},${SY} q4,-40 -6,-62`,fill:'none',stroke:'#8a6a44','stroke-width':5,'stroke-linecap':'round'},islandL);
    [[-30,-8],[-10,-26],[18,-20],[26,2]].forEach(([dx,dy])=>el('path',{d:`M${x+8},${SY-62} q${dx/2},${dy/2-10} ${dx},${dy}`,fill:'none',stroke:'#4fa84a','stroke-width':6,'stroke-linecap':'round'},islandL));
    const imp=[['f',t[0]*t[2]+t[1],t[2]]],mix=t[1]?[['w',t[0]],['f',t[1],t[2]]]:[['w',t[0]]],parts=won?(Rr().imp?[...imp,['o','='],...mix]:[...mix,['o','='],...imp]):(Rr().imp?imp:mix);
    const w=exprWidth(parts,15)+26,sg=el('g',{transform:`translate(${x-26},${SY-128})`},islandL);el('rect',{x:-w/2,y:-22,width:w,height:42,rx:10,fill:'#fff4e6',stroke:won?'#fff0a0':'#d9b67a','stroke-width':won?3.5:2.5},sg);
    const e=svgExpr(sg,0,0,parts,15,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(q=>q.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));if(won)popIn(sg,.6)}
  function pad(u,k,s){const x=XU(u),g=el('g',{},padL);el('ellipse',{cx:x,cy:SY+3,rx:22,ry:7,fill:'#3f9b4f'},g);el('path',{d:`M${x},${SY+3} l16,-4 l-2,6Z`,fill:'url(#gRiver)'},g);el('ellipse',{cx:x-6,cy:SY+1,rx:6,ry:2,fill:'#8fe07a',opacity:.6},g);popIn(g,.3);
    svgFrac(labL,x,SY+46,k*s[0],s[1],13)}

  /* abacus and Go */
  const ctl=el('g',{},root);
  function drawBeads(){ctl.innerHTML='';if(Rr().mode!=='beads')return;
    const L=110,RX=370,Y=520;el('text',{x:L-20,y:Y+5,'text-anchor':'end','font-size':15,fill:'#d8c6e4'},ctl).textContent='hops';
    el('line',{x1:L,x2:RX,y1:Y,y2:Y,stroke:'#c9b28a','stroke-width':4,'stroke-linecap':'round'},ctl);el('rect',{x:L-8,y:Y-26,width:8,height:52,rx:3,fill:'#7a5a44'},ctl);el('rect',{x:RX,y:Y-26,width:8,height:52,rx:3,fill:'#7a5a44'},ctl);
    const bx=(i,n)=>i<8-n?L+18+i*24:RX-18-(7-i)*24,B=[];let shown=S.beads;
    const cnt=el('text',{x:(L+RX)/2,y:Y+40,'text-anchor':'middle','font-size':16},el('g',{class:'num'},ctl));
    const go=el('g',{transform:'translate(436,520)'},ctl),goC=el('circle',{r:30,stroke:'#c8f0a0','stroke-width':3},go);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':600,fill:'#fff'},go).textContent='Go';
    function lay(n,anim){B.forEach((b,i)=>{const on=i>=8-n,x1=bx(i,n),x0=b.x;b.x=x1;b.body.setAttribute('fill',on?'#ffb34d':'#8a78ad');b.body.setAttribute('stroke',on?'#fff0a0':'rgba(255,244,230,.4)');
        if(anim&&x0!==x1)tween(150,(t,p)=>b.g.setAttribute('transform',`translate(${lerp(x0,x1,p).toFixed(1)},${Y})`),null,ease.out);else b.g.setAttribute('transform',`translate(${x1},${Y})`)});
      cnt.textContent=`${n} hop${n===1?'':'s'}`;goC.setAttribute('fill',n?'#4fa84a':'#3b3a5e')}
    function preview(n){if(n!==shown){shown=n;SFX.tick(n);osc('sine',300+n*40,.05,.03,{wet:.1});lay(n,true)}}
    function setN(n){if(S.busy)return;if(n!==S.beads){S.beads=n;SFX.pop(.9+n*.05)}shown=n;lay(n,true);upd()}
    const want=(i,p,p0)=>p.x>p0.x?Math.max(S.beads,8-i):Math.min(S.beads,7-i);
    for(let i=0;i<8;i++){const g=el('g',{},ctl),body=el('ellipse',{rx:12,ry:15,'stroke-width':2},g);el('ellipse',{cx:-4,cy:-6,rx:3.5,ry:4.5,fill:'#fff',opacity:.35},g);B.push({g,body,x:bx(i,S.beads)});
      interact(g,{label:`Bead ${i+1}`,tap:()=>setN(i>=8-S.beads?7-i:8-i),move:(p,p0)=>{if(!S.busy)preview(want(i,p,p0))},up:(p,p0,c,moved)=>setN(moved?want(i,p,p0):(i>=8-S.beads?7-i:8-i))})}
    lay(S.beads,false);
    interact(go,{label:'Go: Hopper hops',tap:()=>{if(!S.beads||S.busy)return;SFX.croak();run(S.beads,Rr().s)}})}

  /* the spring: pull the ring straight down, a notch for each hop size */
  const RY0=340,D0=18,BAND=40,RMAX=D0+OPTS.length*BAND,springL=el('g',{},root),prevL=el('g',{},root);
  const ringG=el('g',{},root);el('circle',{r:34,fill:'transparent'},ringG);el('circle',{r:15,fill:'none',stroke:'#ffd36a','stroke-width':5},ringG);el('circle',{cx:-4,cy:-5,r:3,fill:'#fff',opacity:.5},ringG);
  const rope=el('path',{fill:'none',stroke:'#e8c48a','stroke-width':3,'stroke-linecap':'round'},springL),track=el('g',{},springL),hintG=el('g',{class:'nudgey'},springL);
  let ry=RY0,pullOn=false;
  function putR(y){ry=y;const x=X(0);ringG.setAttribute('transform',`translate(${x},${y.toFixed(1)})`);
    let d=`M${x},${SY+10}`;const n=10,len=y-15-(SY+10);for(let k=1;k<=n;k++)d+=` L${(x+(k%2?5:-5)*(1-len/RMAX*.8)).toFixed(1)},${(SY+10+len*k/n).toFixed(1)}`;rope.setAttribute('d',d)}
  function drawSpring(){track.innerHTML='';hintG.innerHTML='';prevL.innerHTML='';const on=Rr().mode==='sling';springL.style.display=ringG.style.display=on?'':'none';if(!on)return;
    const x=X(0);el('rect',{x:x+22,y:RY0+D0,width:6,height:OPTS.length*BAND,rx:3,fill:'rgba(255,244,230,.12)'},track);
    OPTS.forEach((o,k)=>{const y=RY0+D0+BAND*(k+.5);el('circle',{cx:x+25,cy:y,r:5,fill:'rgba(255,244,230,.25)','data-k':k},track);svgFrac(track,x+50,y+1,o[0],o[1],12)});
    el('path',{d:`M${x-30},${RY0-8} v22 m-8,-8 l8,8 l8,-8`,fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85},hintG);putR(RY0)}
  function notch(cur){track.querySelectorAll('circle').forEach(c=>{const k=+c.dataset.k;c.setAttribute('r',k===cur?9:5);c.setAttribute('fill',k===cur?'#fff0a0':k<cur?'rgba(255,240,160,.55)':'rgba(255,244,230,.25)')})}
  function preview(prev){prevL.innerHTML='';if(!prev)return;const x=X(0),lx=XU(U*prev[0]/prev[1]),f=prev[0]/prev[1];
    el('path',{d:`M${x},${SY-20} Q${(x+lx)/2},${SY-90-60*f} ${lx},${SY-6}`,fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-dasharray':'6 6'},prevL);
    el('ellipse',{cx:lx,cy:SY+2,rx:18,ry:6,fill:'none',stroke:'#fff0a0','stroke-width':2.5},prevL);
    const g=el('g',{transform:`translate(${lx},${SY-112-60*f})`},prevL);el('rect',{x:-24,y:-22,width:48,height:42,rx:10,fill:'#fff4e6'},g);const e=svgFrac(g,0,0,prev[0],prev[1],15);e.setAttribute('class','');e.querySelectorAll('text').forEach(q=>q.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'))}
  const pull={label:'Pull the ring down to load the spring',
    down:()=>{pullOn=!S.busy&&Rr().mode==='sling';return{}},
    move:(p,p0)=>{if(!pullOn||S.busy)return;hintG.innerHTML='';const d=clamp(p.y-p0.y,0,RMAX+40),i=clamp(Math.floor((d-D0)/BAND),0,OPTS.length-1),prev=d<D0?null:OPTS[i];
      if(prev!==S.stride){S.stride=prev;if(prev){SFX.tick(i);osc('triangle',220+i*70,.07,.05,{wet:.15})}notch(prev?i:-1);preview(prev)}
      const m=Math.min(d,RMAX)/RMAX;putR(RY0+Math.min(d,RMAX));putF(X(0),SY-17+m*9,1+m*.28,1-m*.32)},
    up:()=>{if(!pullOn||S.busy)return;pullOn=false;const s=S.stride,y0=ry;S.stride=null;notch(-1);
      tween(140,t=>{putR(lerp(y0,RY0,t));putF(X(0),SY-17)},()=>{prevL.innerHTML='';if(s){SFX.whoosh();run(Rr().n,s)}else{drawSpring();say('Pull the ring further down, then let go.')}},ease.back)},
    tap:()=>{SFX.croak();face('happy');later(500,()=>face(''));if(Rr().mode==='sling')say('Pull the ring down. The further you pull, the bigger each hop.')}};
  interact(ringG,pull);interact(frog,{...pull,label:'Hopper'});

  function run(n,s){
    S.busy=true;padL.innerHTML='';labL.innerHTML='';exL.innerHTML='';const T=TU(),st=U*s[0]/s[1];let k=0;
    const hop=()=>{k++;const from=XU((k-1)*st),to=XU(k*st),u=k*st,h=60+70*s[0]/s[1];
      SFX.boing(k);face('oh');
      tween(110,(t,p)=>putF(from,SY-17,1+.18*p,1-.2*p),()=>{
        tween(430,(t,p)=>{const x=lerp(from,to,p),y=SY-17-Math.sin(p*Math.PI)*h,sx=p<.5?1-.1*p:.95,sy=p<.5?1.15:1.1-.1*p;putF(x,y,sx,sy,(p-.5)*20)},()=>{
          if(u>T+1e-6){splash(to);return}
          SFX.plop();ring(to,SY+4,{col:'#9fd0ff',r0:8,r1:44,w:3,dur:500});putF(to,SY-17,1.2,.8);later(90,()=>putF(to,SY-17));
          if(Math.abs(u-T)<1e-6){if(k===n)win(n,s);else later(160,hop);return}
          pad(u,k,s);face('');
          if(k<n)later(160,hop);else short(u)},ease.lin)},ease.lin)};
    hop();
  }
  function splash(x){
    face('oh');tween(260,(t,p)=>putF(x,SY-17+30*p,1,1-.4*p),()=>{frog.style.opacity=0;SFX.splash();shake(5);drops(x,SY,14);ring(x,SY+6,{col:'#cfeaff',r1:70,w:4});later(140,()=>ring(x,SY+6,{col:'#9fd0ff',r1:50,w:3}));floatText(x,SY-50,'SPLASH!',{col:'#9fd0ff',size:30});
      say('Too far! Hopper went past the island and fell in.');later(1500,reset)},ease.in);
  }
  function short(u){face('sad');SFX.wrong();floatText(XU(u),SY-60,'Not far enough!',{col:'#ffb070',size:22});say('Hopper ran out of hops before the island.');later(1600,reset)}
  function reset(){frog.style.opacity=1;padL.innerHTML='';labL.innerHTML='';face('');const x0=fx;tween(400,(t,p)=>putF(lerp(x0,X(0),t),SY-17-Math.sin(p*Math.PI)*60),()=>{S.busy=false;drawSpring();upd()},ease.inOut)}
  function win(n,s){
    if(Rr().mode==='sling'){[springL,ringG,prevL].forEach(g=>{g.style.transition='opacity .3s';g.style.opacity=0});later(320,()=>{springL.style.display=ringG.style.display='none';springL.style.opacity=ringG.style.opacity=prevL.style.opacity=1})}
    face('happy');SFX.fanfare();burst(fx,SY-30,{n:24,spread:130,cols:['#fff0a0','#c8f0a0','#9fd0ff','#ffb34d']});ring(fx,SY,{r1:160,w:6});floatText(fx+40,SY-175,'Made it!');
    for(let k=0;k<12;k++)later(k*90,()=>{const fl=el('circle',{cx:fx+(Math.random()-.5)*120,cy:SY-20-Math.random()*60,r:3,fill:'#fff0a0'},FX);tween(1200,(t,p)=>{fl.setAttribute('cy',(+fl.getAttribute('cy')-1.2).toFixed(1));fl.setAttribute('opacity',(1-p).toFixed(2))},()=>fl.remove())});
    later(300,()=>{tween(380,(t,p)=>putF(fx,SY-17-Math.sin(p*Math.PI)*40),null,ease.lin)});
    const parts=[['w',n],['o','×'],['f',s[0],s[1]],['o','=']];if(n<=5){for(let i=0;i<n;i++){if(i)parts.push(['o','+']);parts.push(['f',s[0],s[1]])}parts.push(['o','='])}
    parts.push(['f',n*s[0],s[1]]);const tot=n*s[0],w=Math.floor(tot/s[1]),r=tot%s[1];if(w&&s[1]>1){parts.push(['o','=']);parts.push(['w',w]);if(r)parts.push(['f',r,s[1]])}
    svgExpr(exL,300,462,parts,15,'middle');later(500,()=>{drawIsland(true);SFX.shimmer()});
    S.won=true;S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=4)unlock(idea);st.ready(true);S.busy=false;
    say(`${NUMW[n][0].toUpperCase()+NUMW[n].slice(1)} hops of ${s[0]}/${s[1]} reach the island!`);
  }
  navStone({glyph:'redo',label:'Start this round again',onTap:()=>load()});
  const st=navStone({label:'Next round',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function upd(){if(S.busy||S.won)return;const r=Rr();
    if(r.mode==='beads')say(S.beads?'Press Go when you think that is the right number of hops.':'How many hops to reach the island? Slide beads along the abacus, then press Go.');
    else say('Pull the ring down to load the spring: the further you pull, the bigger each hop.')}
  function load(){EPOCH++;FX.innerHTML='';S.beads=0;S.stride=null;S.busy=false;S.won=false;st.ready(false);frog.style.opacity=1;padL.innerHTML='';labL.innerHTML='';exL.innerHTML='';
    putF(X(0),SY-17);face('');drawSign();drawIsland();drawBeads();drawSpring();upd()}
  S.r=resumeAt(R.length);load();
}
