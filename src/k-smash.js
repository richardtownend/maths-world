
/* ================= World 7: Smash ================= */
W.smash={scene:'cave',
notes:`<p>Taking away a fraction whose pieces don't match, like 5/6 − 1/4. The crystal grid is cut into the small tiles both fractions share (twelfths here), and the lit tiles show what you have: 5/6 is ten of the twelve tiles.</p>
<p>The sign says what to smash out. She picks the matching block from the tray (a 1/4 block covers three tiles of this grid), holds it over the lit tiles and lets go. The tiles under it shatter and the rest settle into place. What is left is the answer, and it is already in the shared tiles: 10/12 − 3/12 = 7/12.</p>
<p>The trick she is learning is that a quarter of this grid is three tiles, a third is four tiles, and so on. The block shows it before she lets go: tiles turn gold if the block fits on lit tiles and red if it doesn't. The decoy blocks are the right shape for the grid but the wrong amount for the sign, so she has to read the sign.</p>
<p>The last puzzle is 7/8 − 1/3 on a grid of twenty-fourths.</p>`,
mount(root){
  const PZ=[
    {r:2,c:3,have:[1,1],sm:[[1,2],[1,3]],dec:[[1,6]]},
    {r:3,c:4,have:[5,6],sm:[[1,4]],dec:[[1,3],[1,6]]},
    {r:3,c:4,have:[3,4],sm:[[1,3]],dec:[[1,4],[1,2]]},
    {r:2,c:5,have:[4,5],sm:[[1,2]],dec:[[1,5],[1,10]]},
    {r:4,c:6,have:[7,8],sm:[[1,3]],dec:[[1,4],[1,6]]}];
  const S={p:0,lit:0,done:[],busy:false,wins:new Set()};
  const signL=el('g',{},root),gridL=el('g',{},root),projL=el('g',{},root),trayL=el('g',{},root),exL=el('g',{},root);
  const dots=el('g',{},root);
  navStone({glyph:'redo',label:'Start this puzzle again',onTap:()=>load()});
  const st=navStone({label:'Next puzzle',onTap:()=>{S.p=(S.p+1)%PZ.length;load()}});
  let G={};
  const N=()=>PZ[S.p].r*PZ[S.p].c,kOf=([n,d])=>N()*n/d;
  const tilePos=i=>{const {c,T,x0,y0}=G;return[x0+(i%c)*T,y0+Math.floor(i/c)*T]};
  function tile(parent,x,y,T,on){const g=el('g',{},parent);
    if(on){el('rect',{x:x+3,y:y+3,width:T-6,height:T-6,rx:T*.16,fill:'url(#gCrystal)',stroke:'#e9f6ff','stroke-width':1.5},g);
      el('path',{d:`M${x+T*.22},${y+T*.3} L${x+T*.42},${y+T*.18} L${x+T*.5},${y+T*.4}Z`,fill:'#fff',opacity:.55},g);
      el('path',{d:`M${x+T*.6},${y+T*.7} L${x+T*.78},${y+T*.62}`,stroke:'#fff',opacity:.4,'stroke-width':2,'stroke-linecap':'round'},g)}
    else el('rect',{x:x+4,y:y+4,width:T-8,height:T-8,rx:T*.16,fill:'rgba(255,244,230,.07)',stroke:'rgba(255,244,230,.55)','stroke-width':1.8,'stroke-dasharray':'5 4'},g);
    return g}
  function drawGrid(){
    gridL.innerHTML='';const P=PZ[S.p],{r,c,T,x0,y0}=G;
    el('rect',{x:x0-12,y:y0-12,width:c*T+24,height:r*T+24,rx:20,fill:'#1a1236',stroke:'rgba(190,170,255,.4)','stroke-width':2},gridL);
    G.tiles=[];for(let i=0;i<N();i++){const [x,y]=tilePos(i);G.tiles.push(tile(gridL,x,y,T,i<S.lit))}
  }
  function drawSign(final){
    signL.innerHTML='';const P=PZ[S.p];
    const st0=N()*P.have[0]/P.have[1],parts=[['f',st0,N()]];P.sm.forEach(f=>parts.push(['o','−'],['f',f[0],f[1]]));
    parts.push(['o','=']);if(final){parts.push(['f',S.lit,N()])}else parts.push(['o','?']);
    const w=exprWidth(parts,20)+40;
    el('rect',{x:300-w/2,y:14,width:w,height:62,rx:16,fill:'#fff4e6',stroke:'#9a7ad8','stroke-width':3},signL);
    const e=svgExpr(signL,300,44,parts,20,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));
    const cap=svgExpr(signL,300,96,P.have[0]===P.have[1]?[['t',`${st0}/${N()} is one whole`]]:[['t',`${st0} of ${N()} tiles, the same as`],['f',P.have[0],P.have[1]]],13,'middle');cap.setAttribute('class','');cap.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#d8c6e4'));cap.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#d8c6e4'));
    navDots(PZ.length,S.p);
  }
  function drawExpr(){
    exL.innerHTML='';if(!S.finished)return;const P=PZ[S.p],n=N(),parts=[];
    parts.push(['f',n*P.have[0]/P.have[1],n]);P.sm.forEach(f=>parts.push(['o','−'],['f',f[0],f[1]]));
    parts.push(['o','='],['f',n*P.have[0]/P.have[1],n]);P.sm.forEach(f=>parts.push(['o','−'],['f',kOf(f),n]));parts.push(['o','='],['f',S.lit,n]);
    svgExpr(exL,300,G.y0+G.r*G.T+44,parts,15,'middle');
  }
  function drawTray(){
    trayL.innerHTML='';const P=PZ[S.p];
    const blocks=[...P.sm.map((f,i)=>({f,need:i})),...P.dec.map(f=>({f,need:-1}))];
    const order=blocks.map((b,i)=>({b,key:(i*7+S.p*3)%5})).sort((a,b)=>a.key-b.key).map(o=>o.b);
    const n=order.length,TY=G.trayY;
    order.forEach((b,i)=>{const k=kOf(b.f),cx=300+(i-(n-1)/2)*150;
      if(b.need>=0&&S.done.includes(b.need)){return}
      const sc=Math.min(1,130/(k*G.T)),w=k*G.T*sc,h=G.T*sc;
      const g=el('g',{},trayL),inner=el('g',{transform:`translate(${cx},${TY})`},g);
      el('rect',{x:-w/2-8,y:-h/2-8,width:w+16,height:h+16,rx:14,fill:'rgba(255,244,230,.08)',stroke:'rgba(255,244,230,.25)'},inner);
      for(let j=0;j<k;j++)el('rect',{x:-w/2+j*w/k+2,y:-h/2+2,width:w/k-4,height:h-4,rx:Math.max(2,h*.15),fill:'#ffb3d9',stroke:'#fff','stroke-width':1.2,opacity:.92},inner);
      const lab=el('g',{transform:`translate(0,${-h/2-30})`},inner);el('rect',{x:-28,y:-20,width:56,height:44,rx:10,fill:'#fff4e6'},lab);
      const e=svgFrac(lab,0,0,b.f[0],b.f[1],16);e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));
      let cur=null;
      interact(g,{label:`Block of ${b.f[0]} over ${b.f[1]}`,
        down:()=>{if(S.busy)return{no:1};SFX.pop(1.1);trayL.appendChild(g);return{}},
        move:(p,p0,c)=>{if(c.no)return;g.setAttribute('transform',`translate(${p.x-p0.x},${p.y-p0.y})`);cur=project(p,k);inner.style.opacity=cur?.25:1},
        up:(p,p0,c)=>{if(c.no)return;const pr=project(p,k);projL.innerHTML='';inner.style.opacity=1;
          if(pr&&pr.ok&&b.need>=0){g.remove();smash(pr.start,k,b)}
          else{if(pr){clonk();shake(4);say(b.need<0?`That block is ${b.f[0]}/${b.f[1]}. The sign asks for something else.`:'Some of those tiles are already gone. Hold it over lit tiles.')}
            tween(320,t=>g.setAttribute('transform',`translate(${((p.x-p0.x)*(1-t)).toFixed(1)},${((p.y-p0.y)*(1-t)).toFixed(1)})`),null,ease.back)}},
        tap:()=>{SFX.pop(.8);inner.setAttribute('transform',`translate(${cx},${TY}) scale(1.08)`);later(150,()=>inner.setAttribute('transform',`translate(${cx},${TY})`));say('Drag the block over the glowing tiles, then let go to smash.')}});
    });
  }
  function project(p,k){
    projL.innerHTML='';const {r,c,T,x0,y0}=G;
    if(p.x<x0-T/2||p.x>x0+c*T+T/2||p.y<y0-T/2||p.y>y0+r*T+T/2)return null;
    const col=clamp(Math.floor((p.x-x0)/T),0,c-1),row=clamp(Math.floor((p.y-y0)/T),0,r-1);
    const start=clamp(row*c+col-Math.floor((k-1)/2),0,N()-k),ok=start+k<=S.lit;
    for(let j=0;j<k;j++){const [x,y]=tilePos(start+j),lit=start+j<S.lit;el('rect',{x:x+2,y:y+2,width:T-4,height:T-4,rx:T*.18,fill:ok?'rgba(255,240,160,.35)':'rgba(255,90,120,.3)',stroke:ok?'#fff0a0':lit?'#ff7a93':'#ff7a93','stroke-width':3},projL)}
    return{start,ok};
  }
  function smash(start,k,b){
    S.busy=true;const {T}=G;SFX.snap(.8);SFX.crunch();later(60,()=>SFX.crunch());shake(7);
    for(let j=0;j<k;j++){const [x,y]=tilePos(start+j);const cx=x+T/2,cy=y+T/2;later(j*30,()=>{crumbs(cx,cy,{n:7,cols:['#bfe8ff','#d9c2ff','#ffffff','#9ad8ff'],up:1});G.tiles[start+j].style.opacity=0})}
    ring(tilePos(start)[0]+k*T/2,tilePos(start)[1]+T/2,{col:'#d9c2ff',r1:120});
    floatText(300,G.y0-6,'SMASH!',{col:'#d9c2ff',size:30});
    const keep=[];for(let i=0;i<S.lit;i++)if(i<start||i>=start+k)keep.push(i);
    later(320,()=>{keep.forEach((from,to)=>{if(from===to)return;const g=G.tiles[from],[fx,fy]=tilePos(from),[tx,ty]=tilePos(to);tween(380,t=>g.setAttribute('transform',`translate(${((tx-fx)*t).toFixed(1)},${((ty-fy)*t).toFixed(1)})`),null,ease.back)});SFX.whoosh()});
    later(760,()=>{S.lit-=k;S.done.push(b.need);drawGrid();SFX.pop(1.3);
      const P=PZ[S.p];if(S.done.length===P.sm.length){S.finished=true;S.wins.add(S.p);roundWon(S.p);if(S.wins.size>=3)unlock('smash');st.ready(true);SFX.fanfare();
        const {x0,y0,c,r,T}=G;burst(x0+c*T/2,y0+r*T/2,{n:26,spread:150,cols:['#bfe8ff','#d9c2ff','#fff0a0','#ffb3d9']});ring(x0+c*T/2,y0+r*T/2,{r1:220,w:6,col:'#d9c2ff'});
        drawSign(true);drawExpr();say(`${S.lit} tile${S.lit===1?'':'s'} left out of ${N()}. That is what is left.`)}
      else say('Smashed! Now the next block on the sign.');
      S.busy=false;if(S.finished)trayL.innerHTML='';else drawTray()});
  }
  function load(){
    EPOCH++;FX.innerHTML='';const P=PZ[S.p],n=P.r*P.c;S.lit=n*P.have[0]/P.have[1];S.done=[];S.busy=false;S.finished=false;st.ready(false);
    const T=Math.min(420/P.c,236/P.r,84),x0=300-P.c*T/2,y0=126+(236-P.r*T)/2;G={r:P.r,c:P.c,T,x0,y0,trayY:470};
    drawSign(false);drawGrid();drawTray();exL.innerHTML='';projL.innerHTML='';
    say('Drag the block the sign asks for over the glowing tiles. Let go to smash them out.');
  }
  S.p=resumeAt(PZ.length);load();
}};
