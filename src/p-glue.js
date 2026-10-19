
/* ================= World: Glass (simplifying) ================= */
W.glue={scene:'tower',
notes:`<p>Simplifying: the same amount, written with fewer, bigger pieces. Each round is a different stained-glass window in the tower (a long strip, a round rose window, a tall pointed window, a sunrise fan), shattered into lots of little panes. Part of it is coloured and the rest is clear. A glass spirit sleeps in it.</p>
<p>Under the window is a rack of spare glass: the same window shape, cut into 2, 3, 4 or 6 panes. She drags one up into the window. The colour must stay exactly where it was, so the new glass only fits if the colour ends exactly on one of its pane lines. 10/12 of a rose window fits the 6-pane glass (5 coloured: 5/6) but not the 4-pane glass (the colour would stop in the middle of a pane, and glass can't be half coloured, so it cracks).</p>
<p>The spirit only wakes when the window has the fewest panes possible: the simplest form. The sign keeps the chain (8/12 = 4/6 = 2/3) and the win says what both numbers were divided by.</p>
<p>Rounds: 2/4 (strip), 4/6 (rose), 6/8 (tall window), 6/9 (fan), 10/12 (rose), 8/12 (tall window, two steps).</p>`,
mount(root){
  const R=[{n:2,d:4,sh:'strip',col:'#e8435a',bars:[2,3]},{n:4,d:6,sh:'rose',col:'#3f7fe0',bars:[2,3,4]},{n:6,d:8,sh:'lancet',col:'#2fb38a',bars:[2,3,4]},
    {n:6,d:9,sh:'fan',col:'#f2a93a',bars:[2,3,4]},{n:10,d:12,sh:'rose',col:'#9a5ad8',bars:[2,3,4,6]},{n:8,d:12,sh:'lancet',col:'#e86fb0',bars:[2,3,4,6]}];
  const S={r:0,cur:0,chain:[],busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r],gcd=(a,b)=>b?gcd(b,a%b):a,CLR='#dfe9f5',LEAD='#1d1830';
  const P2=(x,y)=>x.toFixed(1)+','+y.toFixed(1);
  const ann=(R0,r0,a0,a1)=>{const lg=(a1-a0)>Math.PI?1:0;return `M${P2(R0*Math.cos(a0),R0*Math.sin(a0))} A${R0},${R0} 0 ${lg} 1 ${P2(R0*Math.cos(a1),R0*Math.sin(a1))} L${P2(r0*Math.cos(a1),r0*Math.sin(a1))} A${r0},${r0} 0 ${lg} 0 ${P2(r0*Math.cos(a0),r0*Math.sin(a0))}Z`};
  /* each window shape: panes along t (0..1) in its own local coordinates */
  const SH={
    strip:{pos:[300,192],spirit:[300,118],lab:270,
      pane:(t0,t1)=>`M${-180+t0*360},-39 H${-180+t1*360} V39 H${-180+t0*360}Z`,
      line:t=>{const x=-180+t*360;return `M${x},-41 l-6,22 l9,20 l-7,40`},mid:t=>[-180+t*360,0],
      frame:g=>{el('path',{d:'M-198,57 L-198,-39 Q-198,-119 0,-123 Q198,-119 198,-39 L198,57Z',fill:'#4a4060',stroke:'#6b5f84','stroke-width':3},g);el('path',{d:'M-180,-39 Q-180,-105 0,-107 Q180,-105 180,-39Z',fill:LEAD},g);el('rect',{x:-208,y:51,width:416,height:12,rx:4,fill:'#5a4f72'},g)}},
    lancet:{pos:[300,214],spirit:[300,104],lab:346,
      pane:(t0,t1)=>`M-46,${95-t1*190} H46 V${95-t0*190} H-46Z`,
      line:t=>{const y=95-t*190;return `M-48,${y} l20,-6 l18,9 l16,-7 l40,4`},mid:t=>[0,95-t*190],
      frame:g=>{el('path',{d:'M-62,111 L-62,-95 Q-62,-122 0,-136 Q62,-122 62,-95 L62,111Z',fill:'#4a4060',stroke:'#6b5f84','stroke-width':3},g);el('path',{d:'M-46,-95 Q-46,-114 0,-124 Q46,-114 46,-95Z',fill:LEAD},g);el('rect',{x:-72,y:105,width:144,height:12,rx:4,fill:'#5a4f72'},g)}},
    rose:{pos:[300,186],spirit:[300,186],lab:316,
      pane:(t0,t1)=>ann(100,28,-Math.PI/2+t0*2*Math.PI,-Math.PI/2+t1*2*Math.PI),
      line:t=>{const a=-Math.PI/2+t*2*Math.PI,c=Math.cos(a),s=Math.sin(a),px=-s*6,py=c*6;return `M${P2(26*c,26*s)} L${P2(55*c+px,55*s+py)} L${P2(75*c-px,75*s-py)} L${P2(102*c,102*s)}`},mid:t=>{const a=-Math.PI/2+t*2*Math.PI;return[64*Math.cos(a),64*Math.sin(a)]},
      frame:g=>{el('circle',{r:118,fill:'#4a4060',stroke:'#6b5f84','stroke-width':3},g);el('circle',{r:102,fill:LEAD},g);for(let k=0;k<16;k++){const a=k*Math.PI/8;el('circle',{cx:110*Math.cos(a),cy:110*Math.sin(a),r:3,fill:'#8a7aa8'},g)}}},
    fan:{pos:[300,272],spirit:[300,272],lab:310,
      pane:(t0,t1)=>ann(150,30,Math.PI+t0*Math.PI,Math.PI+t1*Math.PI),
      line:t=>{const a=Math.PI+t*Math.PI,c=Math.cos(a),s=Math.sin(a),px=-s*6,py=c*6;return `M${P2(28*c,28*s)} L${P2(75*c+px,75*s+py)} L${P2(110*c-px,110*s-py)} L${P2(152*c,152*s)}`},mid:t=>{const a=Math.PI+t*Math.PI;return[92*Math.cos(a),92*Math.sin(a)]},
      frame:g=>{el('path',{d:'M-168,14 A168,168 0 0 1 168,14Z',fill:'#4a4060',stroke:'#6b5f84','stroke-width':3},g);el('path',{d:'M-152,0 A152,152 0 0 1 152,0Z',fill:LEAD},g);el('rect',{x:-180,y:8,width:360,height:12,rx:4,fill:'#5a4f72'},g)}}};
  const sh=()=>SH[Rr().sh];

  /* draw a piece of glass with p panes, coloured up to L */
  function glass(parent,{p,L,broken,tint,crackAt}){const s=sh(),col=Rr().col,g=el('g',{},parent);
    for(let i=0;i<p;i++){const t0=i/p,t1=(i+1)/p,full=t1<=L+1e-6,none=t0>=L-1e-6;
      if(full||none){el('path',{d:s.pane(t0,t1),fill:full?col:CLR,'fill-opacity':full?.95:tint?.3:.38,stroke:LEAD,'stroke-width':4,'stroke-linejoin':'round'},g);if(full)el('path',{d:s.pane(t0,t1),fill:'url(#gGlassGlow)',opacity:.45},g)}
      else{el('path',{d:s.pane(t0,L),fill:col,'fill-opacity':.95},g);el('path',{d:s.pane(L,t1),fill:CLR,'fill-opacity':.38},g);el('path',{d:s.pane(t0,t1),fill:'none',stroke:LEAD,'stroke-width':4},g)}
      if(broken){const[mx,my]=s.mid((t0+t1)/2);el('path',{d:`M${P2(mx-6,my-12)} l5,9 l-4,6 l6,9`,fill:'none',stroke:LEAD,'stroke-width':1.3,opacity:.7},g)}}
    if(crackAt!=null)el('path',{d:s.line(crackAt),fill:'none',stroke:'#fff','stroke-width':3.5,'stroke-linejoin':'round'},g);
    return g}
  const place=(g,x,y,sx,sy)=>g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sx.toFixed(3)},${sy.toFixed(3)})`);

  /* layers */
  const poolL=el('g',{},root),beamL=el('g',{},root),winL=el('g',{},root),glassL=el('g',{},root),fxL=el('g',{},root),spiritL=el('g',{},root),cntL=el('g',{},root),rackL=el('g',{},root),moteL=el('g',{},root);
  function frame(){winL.innerHTML='';const s=sh(),g=el('g',{},winL);place(g,s.pos[0],s.pos[1],1,1);s.frame(g)}
  function drawWindow(){glassL.innerHTML='';const s=sh(),r=Rr(),g=glass(glassL,{p:S.cur||r.d,L:r.n/r.d,broken:!S.cur});place(g,s.pos[0],s.pos[1],1,1);
    cntL.innerHTML='';const p=S.cur||r.d,k=r.n*p/r.d;el('text',{x:300,y:s.lab,'text-anchor':'middle','font-size':15,fill:'#fff4e6'},el('g',{class:'num'},cntL)).textContent=`${k} coloured of ${p} panes`;
    /* coloured light falls on the floor */
    poolL.innerHTML='';el('ellipse',{cx:300,cy:560,rx:220,ry:36,fill:r.col,opacity:.12+.12*(r.n/r.d)},poolL)}
  let spirit;function drawSpirit(){spiritL.innerHTML='';const s=sh(),g=el('g',{transform:`translate(${s.spirit[0]},${s.spirit[1]})`},spiritL);
    const glow=el('circle',{r:30,fill:'#fff3c4',opacity:.15},g);el('circle',{r:20,fill:'#e9f2ff',opacity:.9},g);
    const eyes=el('g',{},g),mouth=el('path',{d:'M-5,8 q5,3 10,0',fill:'none',stroke:'#5a6a9a','stroke-width':2,'stroke-linecap':'round'},g),zz=el('g',{class:'mote'},g);
    el('text',{x:22,y:-14,'font-size':13,fill:'#cfd8ff',opacity:.8},zz).textContent='z';el('text',{x:30,y:-26,'font-size':10,fill:'#cfd8ff',opacity:.6},zz).textContent='z';
    const set=m=>{eyes.innerHTML='';if(m==='awake'){[-7,7].forEach(x=>{el('circle',{cx:x,cy:-3,r:3.5,fill:'#3a3a6a'},eyes);el('circle',{cx:x-1,cy:-4,r:1.2,fill:'#fff'},eyes)});mouth.setAttribute('d','M-7,6 q7,8 14,0');zz.style.display='none';glow.setAttribute('opacity',.55)}
      else if(m==='frown'){[-7,7].forEach(x=>el('path',{d:`M${x-4},-3 q4,-3 8,0`,fill:'none',stroke:'#3a3a6a','stroke-width':2},eyes));mouth.setAttribute('d','M-5,10 q5,-4 10,0');zz.style.display='none'}
      else if(m==='peek'){[-7,7].forEach(x=>el('circle',{cx:x,cy:-3,r:2,fill:'#3a3a6a'},eyes));mouth.setAttribute('d','M-4,8 q4,2 8,0');zz.style.display='none';glow.setAttribute('opacity',.3)}
      else{[-7,7].forEach(x=>el('path',{d:`M${x-4},-3 q4,3 8,0`,fill:'none',stroke:'#3a3a6a','stroke-width':2},eyes));mouth.setAttribute('d','M-5,8 q5,3 10,0');zz.style.display='';glow.setAttribute('opacity',.15)}};
    set('sleep');spirit={g,set}}
  function motes(){moteL.innerHTML='';const c=Rr().col;for(let k=0;k<10;k++){const m=el('circle',{cx:150+Math.random()*300,cy:330+Math.random()*200,r:1.5+Math.random()*1.5,fill:c,opacity:.5,class:'mote'},moteL);m.style.animationDelay=(-k*1.3)+'s'}}

  /* the rack of spare glass: the same window, cut fewer ways */
  let slots=[];
  function drawRack(){rackL.innerHTML='';slots=[];const r=Rr(),s=sh(),n=r.bars.length;
    let geo;if(r.sh==='strip'){const y0=346,gap=n>3?50:58;geo=r.bars.map((p,k)=>({x:300,y:y0+k*gap,sx:1,sy:.48,tag:[96,y0+k*gap]}))}
    else{const sc=r.sh==='fan'?.36:r.sh==='lancet'?.4:.4,sp=Math.min(130,460/n),y=r.sh==='fan'?470:r.sh==='lancet'?440:430;geo=r.bars.map((p,k)=>{const x=300+(k-(n-1)/2)*sp;return{x,y,sx:sc,sy:sc,tag:[x,r.sh==='fan'?y+24:r.sh==='lancet'?y+56:y+58]}})}
    const shelfY=r.sh==='strip'?330:geo[0].y+(r.sh==='fan'?14:r.sh==='lancet'?44:46);
    if(r.sh==='strip')el('rect',{x:74,y:322,width:452,height:n*(n>3?50:58)+8,rx:10,fill:'#3a2618',opacity:.7},rackL);else el('rect',{x:300-Math.min(260,n*70),y:shelfY,width:Math.min(520,n*140),height:12,rx:4,fill:'#5a3f2c'},rackL);
    r.bars.forEach((p,k)=>{const G=geo[k],g=el('g',{},rackL),lift=el('g',{},g),gl=glass(lift,{p,L:0,tint:true});place(gl,G.x,G.y,G.sx,G.sy);
      const tag=el('g',{transform:`translate(${G.tag[0]},${G.tag[1]})`},lift);el('circle',{r:15,fill:'#e9b24c',stroke:'#fff3c4','stroke-width':2},tag);el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#3a2418'},tag).textContent=p;
      const bb={x:G.x-(r.sh==='strip'?210:60),y:G.y-(r.sh==='strip'?24:r.sh==='fan'?60:r.sh==='lancet'?72:48),w:r.sh==='strip'?430:120,h:r.sh==='strip'?48:r.sh==='fan'?92:r.sh==='lancet'?150:116};
      el('rect',{x:bb.x,y:bb.y,width:bb.w,height:bb.h,fill:'transparent'},g);slots.push({p,G});
      interact(g,{label:`Spare glass in ${p} panes`,down:()=>({}),move:(pt,p0)=>{if(S.busy||S.won)return;lift.setAttribute('transform',`translate(${(pt.x-p0.x).toFixed(1)},${(pt.y-p0.y).toFixed(1)})`)},
        up:(pt,p0)=>{if(S.busy||S.won){lift.removeAttribute('transform');return}const dx=pt.x-p0.x,dy=pt.y-p0.y;if(G.y+dy<sh().pos[1]+70){lift.removeAttribute('transform');install(p,{x:G.x+dx,y:G.y+dy,sx:G.sx,sy:G.sy})}else tween(200,(t,q)=>lift.setAttribute('transform',`translate(${(dx*(1-q)).toFixed(1)},${(dy*(1-q)).toFixed(1)})`),()=>lift.removeAttribute('transform'),ease.out)},
        tap:()=>{if(!S.busy&&!S.won)install(p,G)}})})}

  /* try the glass in the window */
  function install(p,from){S.busy=true;const r=Rr(),s=sh(),k=r.n*p/r.d,fits=Number.isInteger(k),L=r.n/r.d,[wx,wy]=s.pos;SFX.whoosh();
    const fl=glass(fxL,{p,L:0,tint:true});
    tween(420,(t,q)=>place(fl,lerp(from.x,wx,q),lerp(from.y,wy,q)-Math.sin(q*Math.PI)*30,lerp(from.sx,1,q),lerp(from.sy,1,q)),()=>{
      fxL.innerHTML='';let i=0;
      const step=()=>{if(i>=p||i/p>=L-1e-6){fits?good():bad();return}const Li=Math.min((i+1)/p,L);fxL.innerHTML='';const g=glass(fxL,{p,L:Li,tint:true});place(g,wx,wy,1,1);SFX.plink((i+3)%10);
        const[mx,my]=s.mid((i+.5)/p);burst(wx+mx,wy+my,{n:5,spread:26,cols:[r.col,'#fff3c4']});i++;later(150,step)};
      later(100,step);
      function good(){const prev=S.cur||r.d;fxL.innerHTML='';
        if(p<prev){S.cur=p;S.chain.push({n:k,d:p});SFX.clonk();SFX.shimmer();drawWindow();drawSign();sweep();
          if(p===r.d/gcd(r.n,r.d))later(600,win);else{spirit.set('peek');later(1400,()=>spirit.set('sleep'));S.busy=false;say(`It fits! ${r.n}/${r.d} = ${k}/${p}: the same colour with fewer panes. The spirit stirs… can it be even fewer?`)}}
        else{S.busy=false;SFX.wrong();say(p===prev?'That glass is already in the window.':`That fits, but it has ${p} panes. The window has ${prev} already: the spirit wants fewer, not more.`)}}
      function bad(){fxL.innerHTML='';const g=glass(fxL,{p,L,tint:true,crackAt:L});place(g,wx,wy,1,1);SFX.crackGlass();shake(6);spirit.set('frown');later(1300,()=>spirit.set('sleep'));
        const[cx,cy]=s.mid(L);for(let j=0;j<9;j++){const sh2=el('path',{d:'M0,-6 L5,4 L-4,3Z',fill:j%2?r.col:CLR,opacity:.9},FX);const vx=(Math.random()-.5)*120,x0=wx+cx,y0=wy+cy;tween(900,(t,q)=>{sh2.setAttribute('transform',`translate(${(x0+vx*q).toFixed(1)},${(y0+220*q*q-40*q).toFixed(1)}) rotate(${(q*400*(j%2?1:-1)).toFixed(0)})`);sh2.setAttribute('opacity',(.9*(1-q)).toFixed(2))},()=>sh2.remove(),ease.lin)}
        say(`Crack! With ${p} panes the colour would stop in the middle of a pane. Glass can't be half coloured.`);
        later(1300,()=>{fxL.innerHTML='';S.busy=false})}},ease.inOut)}
  /* a sheen sweeps across new glass */
  function sweep(){const s=sh(),[wx,wy]=s.pos,b=el('rect',{x:-30,y:-200,width:30,height:400,fill:'#fff',opacity:.35,transform:'rotate(20)'},el('g',{},fxL));const cp=el('clipPath',{id:'gsweep'+S.r},fxL);const g=glass(cp,{p:S.cur,L:0});place(g,wx,wy,1,1);
    const holder=el('g',{'clip-path':`url(#gsweep${S.r})`},fxL);holder.appendChild(b.parentNode);tween(600,(t,q)=>b.parentNode.setAttribute('transform',`translate(${(wx-220+440*q).toFixed(1)},${wy})`),()=>{holder.remove();cp.remove()},ease.inOut)}
  function win(){const r=Rr(),g=gcd(r.n,r.d),s=sh(),[wx,wy]=s.pos;S.won=true;S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=3)unlock('simplify');st.ready(true);S.busy=false;
    spirit.set('awake');SFX.wake();SFX.fanfare();
    tween(1600,(t,q)=>spirit.g.setAttribute('transform',`translate(${s.spirit[0]},${(s.spirit[1]-Math.sin(q*Math.PI)*14).toFixed(1)})`),null,ease.inOut);
    for(let k=0;k<9;k++){const a=Math.PI/2+(k-4)*.2,L=420;el('path',{d:`M${wx},${wy} L${P2(wx+Math.cos(a-.05)*L,wy+Math.sin(a-.05)*L)} L${P2(wx+Math.cos(a+.05)*L,wy+Math.sin(a+.05)*L)}Z`,fill:k%2?r.col:'#fff3c4',opacity:.09},beamL)}
    beamL.style.opacity=0;tween(900,(t,p)=>beamL.style.opacity=p.toFixed(2),null,ease.out);
    poolL.innerHTML='';const pool=el('ellipse',{cx:300,cy:560,rx:260,ry:42,fill:r.col,opacity:.35},poolL);
    burst(wx,wy,{n:30,spread:190,cols:[r.col,'#fff3c4',CLR]});ring(wx,wy,{r1:230,w:6,col:r.col});
    for(let j=0;j<16;j++)later(j*40,()=>{const sh2=el('path',{d:'M0,-5 L4,3 L-3,3Z',fill:j%3?r.col:'#fff3c4',opacity:.95},FX);const x0=wx+(Math.random()-.5)*240,y0=wy-80;tween(1500,(t,q)=>{sh2.setAttribute('transform',`translate(${(x0+Math.sin(q*6+j)*20).toFixed(1)},${(y0+q*330).toFixed(1)}) rotate(${(q*500).toFixed(0)})`);sh2.setAttribute('opacity',(.95*(1-q)).toFixed(2))},()=>sh2.remove(),ease.lin)});
    floatText(300,s.lab+10,S.chain.length===1?'Straight there!':'Simplest!',{col:'#fff3c4'});
    say(`The spirit wakes! ${r.n}/${r.d} = ${r.n/g}/${r.d/g}: the same colour with the fewest panes. Both numbers divided by ${g}.`)}

  /* the sign: the chain of equal fractions */
  const signL=el('g',{},root);
  function drawSign(){signL.innerHTML='';const r=Rr(),items=[{n:r.n,d:r.d},...S.chain],last=items[items.length-1],done=gcd(last.n,last.d)===1&&S.chain.length>0;
    const w0=58,gap=44,total=items.length*w0+(items.length-1)*gap;let x=300-total/2;
    items.forEach((it,k)=>{const isLast=k===items.length-1,g=el('g',{},signL);el('rect',{x,y:6,width:w0,height:58,rx:12,fill:'#f4eef8',stroke:isLast&&done?'#fff0a0':r.col,'stroke-width':isLast&&done?4:2.5},g);
      const e=svgFrac(g,x+w0/2,35,it.n,it.d,20);e.setAttribute('class','');e.querySelectorAll('text').forEach(q=>q.setAttribute('style','fill:#2a2150;font-weight:700'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#2a2150'));
      if(k>0&&isLast)popIn(g,.8);
      if(!isLast){const nx=x+w0;el('text',{x:nx+gap/2,y:42,'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#fff4e6'},signL).textContent='=';
        const dv=it.d/items[k+1].d;if(Number.isInteger(dv))el('text',{x:nx+gap/2,y:22,'text-anchor':'middle','font-size':11,fill:'#fff0a0'},signL).textContent=`÷${dv}`}
      x+=w0+gap})}

  const NM={strip:'long window',rose:'rose window',lancet:'tall window',fan:'sunrise window'};
  function upd(){if(S.busy||S.won)return;say(S.r===0?'The window is shattered into little panes. Swap in spare glass with fewer panes, but the colour must stay exactly the same.':`A shattered ${NM[Rr().sh]}. Fix it with the fewest panes, keeping the colour exactly the same.`)}
  navStone({glyph:'redo',label:'Start this window again',onTap:()=>load()});
  const st=navStone({label:'Next window',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';fxL.innerHTML='';beamL.innerHTML='';Object.assign(S,{cur:0,chain:[],busy:false,won:false});st.ready(false);
    navDots(R.length,S.r);frame();drawWindow();drawSpirit();drawRack();drawSign();motes();upd()}
  S.r=resumeAt(R.length);load();
}};
