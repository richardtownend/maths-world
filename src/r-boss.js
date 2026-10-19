
/* ================= Finale: the Gloom ================= */
W.boss={scene:'lair',
notes:`<p>The boss battle: a review of the whole fractions story. The Gloom has eight dark crystals in its crown. Each round is a quick spell from an earlier island, in the same order as the story, from easy to hard. A right answer fires that island's colour into a crystal and lights it.</p>
<p><b>The eight spells.</b> Twins (find the equivalent pizza), Scales (which side is heavier, guessed before the Gloom lets go), Hive (a top-heavy fraction as full pots and some more), Join (chop two melons to the same size slices), Smash (crack a fraction of the whole crystal grid), Toll (share the gems into equal baskets, then throw some of them), Leap (tap where Hopper will land), Lanterns (light a fraction or percentage of a 100-light lantern).</p>
<p><b>The jeopardy.</b> Three lantern lights in the corner. A wrong answer and the Gloom blasts one out. Lose all three and it snatches the last crystal back, so that round is played again (with all three lights back). Most spells change the question after a wrong answer, so the answer can't just be copied from what the mistake showed.</p>
<p>Questions come from small pools, so playing again gives different numbers. With all eight crystals lit, the Gloom turns out to be a small lost creature. If a round goes wrong more than once, that island is the one to revisit.</p>`,
mount(root){
  const BX=300,BY=118;
  const ORDER=['match','scales','hive','join','smash','toll','leap','lanterns'];
  const SCOL={match:'#ffb34d',scales:'#6fe3cd',hive:'#ffe066',join:'#f0475f',smash:'#8fd6ff',toll:'#ff7eb6',leap:'#7fd36b',lanterns:'#c9a2ff'};
  const POOL={
    match:[{t:[2,3],o:[[4,6],[3,4],[2,5],[3,6]]},{t:[3,4],o:[[6,8],[4,6],[3,5],[2,4]]},{t:[1,3],o:[[2,6],[1,4],[2,3],[3,6]]}],
    scales:[[[3,4],[5,8]],[[2,3],[3,5]],[[2,5],[3,10]],[[5,6],[7,10]]],
    hive:[[7,4],[11,4],[7,3],[13,6],[11,6]],
    join:[[1,2,1,3],[1,3,1,4],[1,4,1,6],[1,2,1,5]],
    smash:[[3,4,1,3],[2,3,1,2],[5,6,1,4],[3,4,1,2]],
    toll:[[2,3,12],[3,4,8],[3,5,10],[5,6,12]],
    leap:[[3,4,3],[2,3,4],[1,2,5],[5,6,3]],
    lanterns:[{f:[3,4]},{p:35},{f:[2,5]},{f:[1,4]},{p:60}]
  };
  const S={r:0,hearts:3,lit:0,busy:false,pick:{},done:false};
  const pickQ=k=>{const P=POOL[k];let i=S.pick[k];i=i==null?Math.floor(Math.random()*P.length):(i+1)%P.length;S.pick[k]=i;return P[i]};
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

  /* ---------- layers and gradients ---------- */
  const defs=el('defs',{},root);
  const rg=el('radialGradient',{id:'gGloom',cx:'.5',cy:'.38',r:'.7'},defs);
  const gs0=el('stop',{offset:'0','stop-color':'#3a2a64'},rg),gs1=el('stop',{offset:'1','stop-color':'#0b0619'},rg);
  const ag=el('radialGradient',{id:'gGloomAura'},defs);el('stop',{offset:'0','stop-color':'#8a4ae0','stop-opacity':.5},ag);el('stop',{offset:'1','stop-color':'#8a4ae0','stop-opacity':0},ag);
  const skyL=el('g',{},root),bossG=el('g',{},root),hudL=el('g',{},root),arena=el('g',{},root);
  const vortex=el('g',{},skyL);
  [[150,60,.18],[118,46,.14],[86,32,.12]].forEach(([rx,ry,o],i)=>el('ellipse',{cx:0,cy:0,rx,ry,fill:'none',stroke:'#b48cff',opacity:o,'stroke-width':3,'stroke-dasharray':`${40+i*20} ${30+i*10}`,'stroke-linecap':'round'},vortex));
  const boltL=el('g',{},skyL);

  /* ---------- the Gloom ---------- */
  el('ellipse',{cx:0,cy:0,rx:175,ry:125,fill:'url(#gGloomAura)'},bossG);
  const bodyG=el('g',{},bossG);
  const body=el('path',{fill:'url(#gGloom)',stroke:'#7a5ac0','stroke-width':2,'stroke-opacity':.55},bodyG);
  const flash=el('path',{fill:'#fff',opacity:0},bodyG);
  const crownL=el('g',{},bodyG),face=el('g',{},bodyG);
  function bodyD(t){
    let d='M-96,18 C-100,-52 -52,-82 0,-82 C52,-82 100,-52 96,18';
    const n=7;
    for(let i=0;i<n;i++){const x0=96-i*192/n,x1=96-(i+1)*192/n,xm=(x0+x1)/2+Math.sin(t*1.7+i*1.3)*7,ty=60+Math.sin(t*2.1+i*2.2)*9+(i%2?12:0);
      d+=` Q${x0.toFixed(1)},${(18+(ty-18)*.55).toFixed(1)} ${xm.toFixed(1)},${ty.toFixed(1)} Q${x1.toFixed(1)},${(18+(ty-18)*.55).toFixed(1)} ${x1.toFixed(1)},18`}
    return d+'Z'}
  const EYES=[-1,1].map(s=>{const g=el('g',{transform:`translate(${s*34},-14)`},face);
    const glow=el('ellipse',{rx:26,ry:18,fill:'#ffd84a',opacity:.22},g);
    const lid=el('g',{},g);
    const ball=el('path',{d:'M-18,0 Q0,-15 18,0 Q0,13 -18,0Z',fill:'#ffe680'},lid);
    const pupil=el('ellipse',{rx:3.6,ry:9,fill:'#1a0f2a'},lid);
    const brow=el('path',{stroke:'#07040f','stroke-width':6,'stroke-linecap':'round',fill:'none'},g);
    return{g,glow,lid,ball,pupil,brow,s}});
  const mouth=el('path',{fill:'#12081f',stroke:'#07040f','stroke-width':2},face);
  const teeth=el('path',{fill:'#f4ecff'},face);
  const MOUTH={grin:['M-40,24 Q0,54 40,24 Q0,38 -40,24Z','M-28,29 l5,7 l5,-5Z M-6,32 l5,7 l5,-6Z M15,30 l5,6 l4,-7Z'],
    laugh:['M-46,18 Q0,76 46,18 Q0,32 -46,18Z','M-34,23 l6,9 l6,-6Z M-8,27 l6,9 l6,-8Z M18,25 l6,8 l5,-8Z'],
    hurt:['M-30,36 Q-15,26 0,36 Q15,26 30,36 Q15,44 0,40 Q-15,44 -30,36Z',''],
    soft:['M-22,32 Q0,44 22,32 Q0,38 -22,32Z','']};
  const setMouth=k=>{mouth.setAttribute('d',MOUTH[k][0]);teeth.setAttribute('d',MOUTH[k][1])};
  function setBrows(){const k=S.lit/8,iy=lerp(-6,-20,k);EYES.forEach(e=>e.brow.setAttribute('d',e.s<0?`M-22,-19 L18,${iy.toFixed(1)}`:`M22,-19 L-18,${iy.toFixed(1)}`))}
  function tint(){const k=S.lit/8,mix=(a,b)=>{const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),c=[16,8,0].map(s=>Math.round(lerp((A>>s)&255,(B>>s)&255,k)));return`rgb(${c})`};
    gs0.setAttribute('stop-color',mix('#3a2a64','#7a62c0'));gs1.setAttribute('stop-color',mix('#0b0619','#2e2258'));setBrows()}
  /* crown: eight crystals, one per spell */
  const SH=ORDER.map((k,i)=>{const th=(-64+i*128/7)*Math.PI/180,sx=Math.sin(th),cy=Math.cos(th),bx=98*sx*.96,by=12-92*cy*.96,L=30+10*Math.cos(th*2),nx=sx,ny=-cy,tx=cy,ty=sx;
    const P=(a,b)=>`${(bx+nx*a+tx*b).toFixed(1)},${(by+ny*a+ty*b).toFixed(1)}`;
    const g=el('g',{},crownL);
    const glow=el('polygon',{points:[P(-4,-13),P(L*.55,-15),P(L+9,0),P(L*.55,15),P(-4,13)].join(' '),fill:SCOL[k],opacity:0,filter:'url(#glow)'},g);
    const poly=el('polygon',{points:[P(-4,-8),P(L*.5,-9.5),P(L,0),P(L*.5,9.5),P(-4,8)].join(' '),fill:'#231a3e',stroke:'#4c3c78','stroke-width':1.5,'stroke-linejoin':'round'},g);
    const hl=el('polygon',{points:[P(2,-4),P(L*.45,-5.5),P(L*.8,0)].join(' '),fill:'#fff',opacity:.08},g);
    return{k,g,glow,poly,hl,mid:[bx+nx*L*.55,by+ny*L*.55]}});
  function lightShard(i,on){const s=SH[i];s.poly.setAttribute('fill',on?SCOL[s.k]:'#231a3e');s.poly.setAttribute('stroke',on?'#fff':'#4c3c78');s.hl.setAttribute('opacity',on?.55:.08);s.glow.setAttribute('opacity',on?.7:0);if(on)popIn(s.g,1.6)}
  let T=0,bob=0,kick=0,bsc=1,bop=1,laughT=0;
  const bossXY=(x,y)=>[BX+x*bsc,BY+bob+y*bsc];
  const shardXY=i=>bossXY(...SH[i].mid);
  function idle(){
    loop(dt=>{T+=dt;bob=Math.sin(T*1.3)*5;kick*=.9;laughT=Math.max(0,laughT-dt);const d=bodyD(T);body.setAttribute('d',d);flash.setAttribute('d',d);
      const lj=laughT>0?Math.sin(T*28)*3:0;
      bossG.setAttribute('transform',`translate(${BX},${(BY+bob-kick*12+lj).toFixed(1)}) scale(${(bsc*(1+kick*.05)).toFixed(3)},${(bsc*(1-kick*.06)).toFixed(3)})`);bossG.setAttribute('opacity',bop.toFixed(2));
      vortex.setAttribute('transform',`translate(${BX},${BY+8}) rotate(${(T*14%360).toFixed(1)})`)});
    const blink=()=>later(2600+Math.random()*3000,()=>{tween(180,(t,p)=>{const y=1-Math.sin(p*Math.PI)*.9;EYES.forEach(e=>e.lid.setAttribute('transform',`scale(1,${y.toFixed(2)})`))},null,ease.lin);blink()});blink();
    const zap=()=>later(5000+Math.random()*6000,()=>{if(S.done)return;boltL.innerHTML='';let x=60+Math.random()*480,y=-10,d=`M${x.toFixed(0)},${y}`;while(y<170){x+=(Math.random()-.5)*50;y+=20+Math.random()*20;d+=` L${x.toFixed(0)},${y.toFixed(0)}`}
      const b=el('path',{d,stroke:'#e6dcff','stroke-width':3,fill:'none',filter:'url(#glow)','stroke-linejoin':'round'},boltL);const fl=el('rect',{x:-1200,y:-600,width:3000,height:1800,fill:'#c8b8ff',opacity:.12},boltL);
      SFX.rumble();tween(320,(t,p)=>{b.setAttribute('opacity',(1-p).toFixed(2));fl.setAttribute('opacity',(.12*(1-p)).toFixed(3))},()=>{boltL.innerHTML=''},ease.lin);zap()});zap();
  }
  CREATS.add({g:bossG,look(px,py){EYES.forEach(e=>{const [ex,ey]=bossXY(e.s*34,-14),dx=px-ex,dy=py-ey,d=Math.hypot(dx,dy)||1,m=Math.min(1,d/120)*6;e.pupil.setAttribute('cx',(dx/d*m).toFixed(1));e.pupil.setAttribute('cy',(dy/d*m*.5).toFixed(1))})}});
  function hurt(){kick=1;setMouth('hurt');flash.setAttribute('opacity',.7);tween(400,(t,p)=>flash.setAttribute('opacity',(.7*(1-p)).toFixed(2)));EYES.forEach(e=>e.lid.setAttribute('transform','scale(1,.25)'));SFX.growl(.45);
    later(700,()=>{EYES.forEach(e=>e.lid.removeAttribute('transform'));setMouth(S.lit>=6?'soft':'grin')})}
  function laugh(){laughT=1.1;setMouth('laugh');SFX.laugh();EYES.forEach(e=>e.glow.setAttribute('opacity',.6));later(1100,()=>{setMouth(S.lit>=6?'soft':'grin');EYES.forEach(e=>e.glow.setAttribute('opacity',.22))})}

  /* ---------- lantern lights (lives) and the spell badge ---------- */
  const heartL=el('g',{},hudL),badgeL=el('g',{},hudL);
  const heartXY=k=>[34+k*36,34];
  function drawHearts(){heartL.innerHTML='';for(let k=0;k<3;k++){const [x,y]=heartXY(k),on=k<S.hearts,g=el('g',{transform:`translate(${x},${y})`},heartL);
    if(on)el('circle',{r:19,fill:'#ffc04d',opacity:.25},g);
    el('path',{d:'M0,-19 v5',stroke:'#c9a77a','stroke-width':1.5},g);
    el('path',{d:'M-10,-11 Q0,-16 10,-11 V9 Q0,14 -10,9Z',fill:on?'#e8513e':'#3a3058',stroke:on?'#ffb86a':'#5a4a80','stroke-width':1.5},g);
    el('ellipse',{cx:0,cy:-1,rx:5,ry:7,fill:on?'#ffd27a':'#2a2245'},g);
    el('path',{d:'M0,12 v5',stroke:on?'#ffb86a':'#5a4a80','stroke-width':1.5},g)}}
  function badge(k){badgeL.innerHTML='';const o=el('g',{transform:'translate(46,104)'},badgeL),g=el('g',{},o);
    el('circle',{r:27,fill:'#2c2356',stroke:SCOL[k],'stroke-width':3},g);
    const src=document.querySelector(`.isle[data-w="${k}"] svg`);if(src){const s=el('svg',{x:-21,y:-21,width:42,height:42,viewBox:'0 0 42 42'},g);s.innerHTML=src.innerHTML}
    el('text',{y:46,'text-anchor':'middle','font-size':14,fill:'#fff4e6'},g).textContent=WNAME[k];popIn(g,.4)}

  /* ---------- spells and blasts ---------- */
  function orb(x0,y0,x1,y1,col,dur,arc,done){const o=el('g',{},FX);el('circle',{r:16,fill:col,opacity:.35},o);el('circle',{r:9,fill:col},o);el('circle',{r:4,fill:'#fff'},o);
    let lastT=0;tween(dur,(t,p)=>{const x=lerp(x0,x1,t),y=lerp(y0,y1,t)-Math.sin(t*Math.PI)*arc;o.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);
      if(p-lastT>.06){lastT=p;const s=el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:5,fill:col},FX);tween(400,(q,pp)=>{s.setAttribute('r',(5*(1-pp)).toFixed(1));s.setAttribute('opacity',(1-pp).toFixed(2))},()=>s.remove())}},()=>{o.remove();done()},ease.inOut)}
  const OUCH=['Ouch!','Argh!','Eek!','Oof!','Grr!','Yowch!','Nooo!','Aaah!'];
  function hit(x,y){if(S.done)return;S.busy=true;const i=S.r,col=SCOL[ORDER[i]];SFX.whoosh();SFX.shimmer();
    const [tx,ty]=shardXY(i);
    orb(x,y,tx,ty,col,700,90,()=>{S.lit=i+1;lightShard(i,true);tint();hurt();burst(tx,ty,{n:22,cols:[col,'#fff','#fff0a0'],spread:90});ring(tx,ty,{col,r1:120,w:6});shake(10);SFX.crackGlass();SFX.chime();
      floatText(BX+(i<4?-150:150),150,OUCH[i],{col});
      if(i===7)later(1300,finale);else later(1800,()=>{S.r++;load()})})}
  function miss(x,y,again){S.busy=true;laugh();const k=S.hearts-1,[hx,hy]=heartXY(k);
    orb(BX,BY+40,hx,hy,'#6a3ac0',650,-40,()=>{S.hearts--;drawHearts();shake(7);SFX.thud();ring(hx,hy,{col:'#b48cff',r1:46,w:4});crumbs(hx,hy,{n:8,cols:['#6a3ac0','#2a1a4a','#b48cff'],up:1});
      if(S.hearts<=0)later(600,lost);else later(again?1400:200,()=>{if(again)reroll();else S.busy=false})})}
  function lost(){laugh();shake(6);S.hearts=3;
    if(S.r>0){S.r--;S.lit=S.r;const [tx,ty]=shardXY(S.r);lightShard(S.r,false);tint();crumbs(tx,ty,{n:12,cols:['#2a1a4a','#6a3ac0','#000']});
      say('All your lights went out! The Gloom snatched a crystal back. Win it again!')}
    else say('All your lights went out! They’re lit again: try once more.');
    later(2800,load)}
  function finale(){S.busy=true;S.done=true;boltL.innerHTML='';tween(1500,(t,p)=>vortex.setAttribute('opacity',(1-p).toFixed(2)));say('All eight crystals are lit! Something is happening to the Gloom…');unlock('boss');clearIsland('boss');
    EYES.forEach(e=>e.lid.setAttribute('transform','scale(1,.2)'));setMouth('soft');
    tween(700,(t,p)=>arena.setAttribute('opacity',(1-p).toFixed(2)),()=>{qG=null;arena.innerHTML='';arena.removeAttribute('opacity')});
    for(let k=0;k<6;k++)later(k*260,()=>{flash.setAttribute('opacity',.8);tween(200,(t,p)=>flash.setAttribute('opacity',(.8*(1-p)).toFixed(2)));shake(4+k);SFX.plink(k*2);const [x,y]=shardXY(k%8);burst(x,y,{n:8,cols:[SCOL[ORDER[k]],'#fff']})});
    later(1700,()=>{SFX.fanfare();SFX.wake();shake(14);
      ORDER.forEach((k,i)=>{const [x,y]=shardXY(i);burst(x,y,{n:16,cols:[SCOL[k],'#fff'],spread:180});ring(x,y,{col:SCOL[k],r1:220,w:6,dur:900})});
      tween(900,(t,p)=>{bsc=1+.6*t;bop=1-p},null,ease.out);
      later(700,()=>{const GX=300,GY=250,GR=38,g=el('g',{},arena);badgeL.innerHTML='';
        const halo=el('circle',{cx:GX,cy:GY,r:GR+40,fill:'#fff0a0',opacity:.12},g);
        const orbs=ORDER.map(k=>el('circle',{r:6,fill:SCOL[k],filter:'url(#glow)'},g));
        const glim=creature(g,{x:GX,y:GY,r:GR,i:8,label:'Glim'});glim.mood('happy');
        const cr=el('g',{transform:`translate(${GX},${GY-GR*.95})`},g);ORDER.forEach((k,i)=>{const x=(i-3.5)*8;el('path',{d:`M${x-4},0 L${x},${-12-(i===3||i===4?5:0)} L${x+4},0Z`,fill:SCOL[k],stroke:'#fff','stroke-width':.8},cr)});
        let a0=0;loop(dt=>{a0+=dt*1.4;orbs.forEach((o,i)=>{const t=a0+i*Math.PI/4;o.setAttribute('cx',(GX+Math.cos(t)*78).toFixed(1));o.setAttribute('cy',(GY+Math.sin(t)*30).toFixed(1))});halo.setAttribute('r',(GR+40+Math.sin(a0*2)*6).toFixed(1))});
        popIn(g,.2);later(500,()=>glim.hop(30));later(1300,()=>glim.hop(20));floatText(GX,GY+110,'Victory!',{size:46});
        say('The Gloom was only Glim, a little creature lost in the dark. Every fraction spell worked: you did it!');
        for(let k=0;k<14;k++)later(k*300,()=>{const x=60+Math.random()*480,y=60+Math.random()*200;burst(x,y,{n:12,cols:[SCOL[ORDER[k%8]],'#fff','#fff0a0'],spread:90});SFX.plink(5+k%7)});
        const st=navStone({label:'Battle again',onTap:reset});st.ready(true)})})}
  function reset(){vortex.removeAttribute('opacity');S.r=0;S.hearts=3;S.lit=0;S.done=false;bsc=1;bop=1;SH.forEach((s,i)=>lightShard(i,false));tint();setMouth('grin');EYES.forEach(e=>e.lid.removeAttribute('transform'));DOCK.innerHTML='';load()}

  /* ---------- shared bits for the spells ---------- */
  function numBox(parent,{x,y,w,h,fs,min,max,val,label,side='right',col='#c98a3a',onChange}){
    const g=el('g',{},parent),bx=el('g',{transform:`translate(${x},${y})`},g);
    el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:9,fill:'#fff',stroke:col,'stroke-width':2.5},bx);
    const t=el('text',{y:fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#3a2418'},bx);
    let v=val;const show=()=>{t.textContent=v;onChange&&onChange(v)};const set=nv=>{nv=clamp(nv,min,max);if(nv===v){SFX.tick(0);return}v=nv;show();SFX.tick(v%10)};
    interact(bx,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/22),min,max);if(nv!==v){v=nv;show();SFX.tick(v%10)}},tap:()=>{if(S.busy)return;set(v+1>max?min:v+1)}});
    const AP=side==='vert'?[[x,y-h/2-19,-1],[x,y+h/2+19,1]]:[[side==='left'?x-w/2-20:x+w/2+20,y-15,-1],[side==='left'?x-w/2-20:x+w/2+20,y+15,1]];
    AP.forEach(([ax,ay,s])=>{const a=el('g',{transform:`translate(${ax},${ay})`},g);el('circle',{r:14,fill:'#2a2150',stroke:'rgba(255,240,160,.5)','stroke-width':1.5},a);
      el('path',{d:s<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${label} ${s<0?'up':'down'}`,tap:()=>{if(S.busy)return;set(v-s)}})});
    t.textContent=v;return{get:()=>v}}
  function goBtn(parent,x,y,label,fn,txt='Go'){const g=el('g',{transform:`translate(${x},${y})`},parent);el('circle',{r:30,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':3},g);
    el('text',{y:txt.length>3?5:6,'text-anchor':'middle','font-size':txt.length>3?14:17,'font-weight':700,fill:'#fff'},g).textContent=txt;
    interact(g,{label,tap:()=>{if(S.busy)return;SFX.pop(1.1);fn()}});return g}
  function pill(parent,x,y,parts,sz=18){const w=exprWidth(parts,sz)+30,g=el('g',{class:'num'},parent);el('rect',{x:x-w/2,y:y-24,width:w,height:48,rx:14,fill:'#2a2150',opacity:.92,stroke:'rgba(255,240,160,.35)'},g);svgExpr(g,x,y,parts,sz,'middle');return g}
  let qG=null;const Q=(parts,done=false)=>{if(qG)qG.remove();qG=qBox(arena,300,240,parts,{sz:19,done})};
  const NMW={2:'halves',3:'thirds',4:'quarters',5:'fifths',6:'sixths',8:'eighths',10:'tenths',12:'twelfths'};

  /* ---------- the eight spells ---------- */
  const GAMES={};

  /* 1. Twins (Match) */
  GAMES.match=q=>{const TX=126,TY=392,R0=74;Q([['f',q.t[0],q.t[1]],['o','='],['o','?']]);
    const tg=el('g',{},arena);el('circle',{cx:TX,cy:TY,r:R0+22,fill:'rgba(30,16,60,.55)',stroke:'#9a6cff','stroke-width':2.5,'stroke-dasharray':'6 6'},tg);
    pizza(tg,{cx:TX,cy:TY,R:R0,n:q.t[1],have:q.t[0],fl:0,dish:false});
    const POS=[[350,330],[496,330],[350,486],[496,486]],R=48;
    shuffle(q.o.slice()).forEach((f,i)=>{const [x,y]=POS[i],g=el('g',{},arena);pizza(g,{cx:x,cy:y,R,n:f[1],have:f[0],fl:0,gap:2});svgFrac(g,x,y+R+25,f[0],f[1],14);
      interact(g,{label:'pizza',tap:()=>{if(S.busy||g.dead)return;
        if(f[0]*q.t[1]===q.t[0]*f[1]){S.busy=true;SFX.pop(1.3);g.parentNode.appendChild(g);const s1=R0/R;
          tween(480,t=>g.setAttribute('transform',`translate(${lerp(x,TX,t).toFixed(1)},${lerp(y,TY,t).toFixed(1)}) scale(${lerp(1,s1,t).toFixed(3)}) translate(${-x},${-y})`),()=>{
            radial(arena,TX,TY,R0+12,q.t[1],{stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round'});Q([['f',q.t[0],q.t[1]],['o','='],['f',f[0],f[1]]],true);chime();burst(TX,TY,{n:14});say('Twins! The same amount, cut differently.');later(500,()=>hit(TX,TY))})}
        else{g.dead=true;SFX.wrong();g.setAttribute('opacity',.35);el('path',{d:`M${x-22},${y-22} L${x+22},${y+22} M${x+22},${y-22} L${x-22},${y+22}`,stroke:'#ff7a93','stroke-width':6,'stroke-linecap':'round'},g);
          say('Not twins! Look at how much of each plate is covered.');miss(x,y,false)}}})});
    say('Twin spell! Tap the pizza with exactly the same amount as the Gloom’s.')};

  /* 2. Scales */
  GAMES.scales=q=>{const PX=300,PY=318,L=170,BW=150;let th=0;Q([['f',...q[0]],['o','?'],['f',...q[1]]]);
    const stand=el('g',{},arena);el('path',{d:`M${PX-10},${PY} L${PX-22},500 L${PX+22},500 L${PX+10},${PY}Z`,fill:'#4a3a6e'},stand);el('ellipse',{cx:PX,cy:502,rx:70,ry:10,fill:'#2a2150'},stand);
    const rig=el('g',{},arena),labs=el('g',{},arena);
    function render(){rig.innerHTML='';const c=Math.cos(th),s=Math.sin(th);
      el('line',{x1:PX-L*c,y1:PY-L*s,x2:PX+L*c,y2:PY+L*s,stroke:'#fff0a0','stroke-width':6,'stroke-linecap':'round'},rig);el('circle',{cx:PX,cy:PY,r:9,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2},rig);
      q.forEach(([n,d],i)=>{const sg=i?1:-1,ex=PX+sg*L*c,ey=PY+sg*L*s,py=ey+70;
        el('path',{d:`M${ex},${ey} L${ex-BW/2-6},${py} M${ex},${ey} L${ex+BW/2+6},${py}`,stroke:'rgba(255,244,230,.5)','stroke-width':1.5},rig);
        el('path',{d:`M${ex-BW/2-12},${py} Q${ex},${py+26} ${ex+BW/2+12},${py}Z`,fill:'#8a7ab0',stroke:'#c9b8ee','stroke-width':1.5},rig);
        const w=BW/d;for(let j=0;j<d;j++){const x=ex-BW/2+j*w;if(j<n)piece(rig,x+1,py-30,w-2,28,i);else ghost(rig,x,py-30,w,28)}})}
    render();
    q.forEach(([n,d],i)=>svgFrac(labs,PX+(i?1:-1)*L,PY+130,n,d,17));
    const mist=el('g',{},arena);[[0,0,46,30],[-30,8,26,20],[30,8,26,20],[0,-18,30,18]].forEach(([x,y,rx,ry])=>el('ellipse',{cx:PX+x,cy:PY+y,rx,ry,fill:'#1a0f2e',opacity:.85},mist));
    [-1,1].forEach(s=>el('path',{d:`M${PX+s*20},${PY-10} q${s*30},-30 ${s*70},-12`,stroke:'#1a0f2e','stroke-width':9,fill:'none','stroke-linecap':'round',opacity:.85},mist));
    q.forEach((_,i)=>{const x=PX+(i?1:-1)*L,h=el('rect',{x:x-BW/2-14,y:PY+20,width:BW+28,height:100,rx:16,fill:'transparent'},arena);
      interact(h,{label:i?'Right pan':'Left pan',tap:()=>{if(S.busy)return;S.busy=true;SFX.pop(1);
        const mk=el('circle',{cx:x,cy:PY+66,r:BW/2+22,fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-dasharray':'8 6'},arena);popIn(mk,.8);
        const v=q.map(([n,d])=>n/d),heavy=v[0]>v[1]?0:1,tgt=(heavy?1:-1)*Math.min(14,Math.max(6,Math.abs(v[0]-v[1])*70))*Math.PI/180;
        say('The Gloom lets go…');
        later(500,()=>{tween(400,(t,p)=>mist.setAttribute('opacity',(1-p).toFixed(2)));SFX.whoosh();
          tween(900,t=>{th=tgt*t;render()},()=>{SFX.thud();shake(3);
            Q([['f',...q[0]],['o',heavy?'<':'>'],['f',...q[1]]],heavy===i);if(heavy===i){chime();say('Heavier! You read the scales right.');later(400,()=>hit(x,PY+80))}
            else{say('The other side was heavier!');miss(x,PY+80,true)}},ease.back)})}})});
    say('Scales spell! The Gloom is holding the scales still. Tap the side that’s heavier.')};

  /* 3. Hive */
  GAMES.hive=q=>{const [n,d]=q,W0=Math.floor(n/d),R0=n%d,P=[[92,340],[212,340],[332,340]],R=50;
    const pots=P.map(([x,y])=>{const g=el('g',{},arena);el('circle',{cx:x,cy:y,r:R+10,fill:'#3a2618',stroke:'#c98a3a','stroke-width':4},g);
      for(let j=0;j<d;j++)el('path',{d:wedgeD(x,y,R-1,j/d,(j+1)/d),fill:'rgba(255,224,102,.05)',stroke:'rgba(255,224,102,.45)','stroke-width':1.4,'stroke-dasharray':'4 4'},g);
      return{x,y,g,fill:el('g',{},g)}});
    Q([['f',n,d],['o','='],['o','?']]);
    const X=500,Y=330;el('rect',{x:X-76,y:Y-74,width:150,height:150,rx:16,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},arena);
    const NW=numBox(arena,{x:X-36,y:Y,w:52,h:74,fs:44,min:0,max:3,val:0,label:'Full pots',side:'left'});
    const NN=numBox(arena,{x:X+28,y:Y-30,w:44,h:42,fs:28,min:0,max:d-1,val:0,label:`${NMW[d]} more`});
    el('line',{x1:X+6,x2:X+50,y1:Y,y2:Y,stroke:'#3a2418','stroke-width':3,'stroke-linecap':'round'},arena);
    el('text',{x:X+28,y:Y+40,'text-anchor':'middle','font-size':28,'font-weight':700,fill:'#3a2418'},arena).textContent=d;
    goBtn(arena,X,Y+120,'Go: pour the honey',()=>{S.busy=true;const w=NW.get(),f=NN.get();say('Pouring…');
      for(let j=0;j<n;j++)later(j*150,()=>{const p=pots[Math.floor(j/d)],s=j%d;el('path',{d:wedgeD(p.x,p.y,R,s/d,(s+1)/d),fill:'url(#gHoney)',stroke:'#c98a3a','stroke-width':1.5},p.fill);SFX.glug(1+s*.05);
        if(s===d-1){const b=el('g',{},p.fill);el('circle',{cx:p.x,cy:p.y,r:15,fill:'#fff4e6',stroke:'#c98a3a','stroke-width':2},b);el('text',{x:p.x,y:p.y+7,'text-anchor':'middle','font-size':19,'font-weight':700,fill:'#3a2418'},b).textContent='1';popIn(b,.3);SFX.plink(4)}});
      later(n*150+500,()=>{if(w===W0&&f===R0){chime();say(`${n}/${d} is ${W0} full pots and ${R0}/${d} more: ${W0} ${R0}/${d}.`);
          Q([['f',n,d],['o','='],['w',W0],['f',R0,d]],true);later(700,()=>hit(212,340))}
        else{say(`It made ${W0} full pots and ${R0}/${d} more. The Gloom brings new honey…`);miss(X,Y,true)}})});
    say(`Hive spell! Pour ${n}/${d} of honey into the pots. How many full pots, and how much more?`)};

  /* 4. Join (melons) */
  GAMES.join=q=>{const [a,b,c2,d]=q,P=[[150,322],[450,322]],R=64,QY=452,QR=54,SX0=130,SX1=470,SY=560;let c=1;Q([['f',a,b],['o','+'],['f',c2,d],['o','='],['o','?']]);
    const sx=v=>SX0+(v-1)*(SX1-SX0)/11;
    const mL=el('g',{},arena),oL=el('g',{},arena),pL=el('g',{},arena);
    el('text',{x:300,y:336,'text-anchor':'middle','font-size':40,'font-weight':600,fill:'#fff0a0'},arena).textContent='+';
    [[a,b],[c2,d]].forEach(([k,m],i)=>svgFrac(arena,P[i][0],P[i][1]+R+30,k,m,16));
    const fits=i=>{const m=i?d:b;return c>1&&c%m===0};
    function draw(cut){mL.innerHTML='';oL.innerHTML='';[[a,b],[c2,d]].forEach(([k,m],i)=>{const [x,y]=P[i];pizza(mL,{cx:x,cy:y,R,n:cut?c:m,have:cut?k*c/m:k,fl:2+i,dish:true});
      if(!cut&&c>1){radial(oL,x,y,R+12,c,{stroke:'#fff4e6','stroke-width':1.6,'stroke-dasharray':'5 5',opacity:.8});radial(oL,x,y,R+4,m,{stroke:fits(i)?'#fff0a0':'#ff7a93','stroke-width':4,'stroke-linecap':'round'})}})}
    plate(pL,300,QY,QR);el('circle',{cx:300,cy:QY,r:QR-1,fill:'rgba(255,244,230,.03)',stroke:'rgba(255,244,230,.3)','stroke-width':1.4,'stroke-dasharray':'4 4'},pL);
    const track=el('g',{},arena);el('rect',{x:SX0-22,y:SY-8,width:SX1-SX0+44,height:16,rx:8,fill:'#1d1840',stroke:'rgba(255,244,230,.22)'},track);
    for(let v=1;v<=12;v++)el('circle',{cx:sx(v),cy:SY,r:3,fill:'rgba(255,244,230,.4)'},track);
    const handle=el('g',{},arena);el('circle',{r:20,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},handle);el('circle',{r:9,fill:'#e6eaf2',stroke:'#7d8aa8','stroke-width':2},handle);
    const hn=el('text',{x:0,y:-30,'text-anchor':'middle','font-size':15},el('g',{class:'num'},handle));
    let hx=sx(1);const put=x=>{hx=x;handle.setAttribute('transform',`translate(${x.toFixed(1)},${SY})`);hn.textContent=c===1?'no chop':`chop into ${c}`};
    const setC=v=>{if(v!==c){c=v;SFX.tick(v);draw(false)}put(hx)};
    function release(){put(sx(c));if(c===1)return;
      if(fits(0)&&fits(1)){S.busy=true;track.remove();handle.remove();let left=2;
        [b,d].forEach((m,i)=>{const angs=range(0,c-1).map(j=>j/c).filter(t=>Math.abs(t*m-Math.round(t*m))>1e-9);if(!angs.length){left--;return}
          cutter(mL,P[i][0],P[i][1],R,angs,{knife:true,each:Math.max(70,Math.min(150,600/angs.length)),done:()=>{if(--left===0)serve()}})});if(left===0)serve()}
      else{SFX.clonk();shake(5);say('Clonk! The red cuts don’t sit on the chop lines.');miss(hx,SY,false)}}
    function serve(){draw(true);const A=a*c/b,B=c2*c/d,list=[];for(let j=0;j<A;j++)list.push([0,j]);for(let j=0;j<B;j++)list.push([1,j]);
      list.forEach(([i,j],qq)=>later(250+qq*140,()=>{slice(pL,300,QY,QR,qq/c,(qq+1)/c,2+i,2);SFX.plink(qq)}));
      later(250+list.length*140+300,()=>{chime();Q([['f',a,b],['o','+'],['f',c2,d],['o','='],['f',A+B,c]],true);pill(arena,300,548,[['f',a,b],['o','+'],['f',c2,d],['o','='],['f',A,c],['o','+'],['f',B,c],['o','='],['f',A+B,c]],15);say('Same size slices, so they go on one plate!');later(700,()=>hit(300,QY))})}
    interact(handle,{label:'Chopper: slide to chop both melons',down:()=>({x0:hx}),move:(p,p0,k)=>{if(S.busy)return;const x=clamp(k.x0+p.x-p0.x,SX0,SX1);hx=x;setC(1+Math.round((x-SX0)/(SX1-SX0)*11))},
      up:()=>{if(!S.busy)release()},tap:()=>{if(S.busy)return;setC(c>=12?1:c+1);hx=sx(c);release()}});
    handle.addEventListener('keydown',e=>{if(S.busy)return;if(e.key==='ArrowRight'){e.preventDefault();setC(Math.min(12,c+1));hx=sx(c);put(hx)}if(e.key==='ArrowLeft'){e.preventDefault();setC(Math.max(1,c-1));hx=sx(c);put(hx)}});
    interact(track,{label:'Chopper track',tap:p=>{if(S.busy||!p)return;setC(clamp(Math.round((p.x-SX0)/(SX1-SX0)*11)+1,1,12));hx=sx(c);release()}});
    draw(false);put(hx);
    say('Melon spell! Add the melons: slide the chopper until both light up gold, then let go.')};

  /* 5. Smash */
  GAMES.smash=q=>{const [a,b,c2,d]=q,cols=b,rows=d,Tz=Math.min(62,330/cols,230/rows),gx=250-cols*Tz/2,gy=282+(230-rows*Tz)/2,need=c2*b;
    Q([['f',a,b],['o','−'],['f',c2,d],['o','='],['o','?']]);
    const tiles=[];
    for(let r=0;r<rows;r++)for(let cc=0;cc<cols;cc++){const x=gx+cc*Tz,y=gy+r*Tz,on=cc<a,g=el('g',{},arena),t={x,y,on,mk:false,g};
      if(on){el('rect',{x:x+3,y:y+3,width:Tz-6,height:Tz-6,rx:Tz*.16,fill:'url(#gCrystal)',stroke:'#e9f6ff','stroke-width':1.5},g);el('path',{d:`M${x+Tz*.22},${y+Tz*.3} L${x+Tz*.42},${y+Tz*.18} L${x+Tz*.5},${y+Tz*.4}Z`,fill:'#fff',opacity:.55},g)}
      else el('rect',{x:x+4,y:y+4,width:Tz-8,height:Tz-8,rx:Tz*.16,fill:'rgba(255,244,230,.07)',stroke:'rgba(255,244,230,.55)','stroke-width':1.8,'stroke-dasharray':'5 4'},g);
      t.crack=el('g',{},g);
      interact(g,{label:on?'Crystal tile':'Empty tile',tap:()=>{if(S.busy)return;if(!t.on){SFX.clonk();return}t.mk=!t.mk;t.crack.innerHTML='';
        if(t.mk){el('rect',{x:x+3,y:y+3,width:Tz-6,height:Tz-6,rx:Tz*.16,fill:'#ff7eb6',opacity:.45,stroke:'#ff9ed2','stroke-width':3},t.crack);el('path',{d:`M${x+Tz*.3},${y+Tz*.2} l${Tz*.15},${Tz*.25} l${-Tz*.1},${Tz*.15} l${Tz*.2},${Tz*.22} M${x+Tz*.45},${y+Tz*.45} l${Tz*.25},${-Tz*.1}`,stroke:'#fff','stroke-width':2,fill:'none','stroke-linecap':'round'},t.crack);SFX.crackGlass()}else SFX.tick(2)}});
      tiles.push(t)}
    goBtn(arena,520,397,'Smash the cracked tiles',()=>{const m=tiles.filter(t=>t.mk);
      if(m.length===need){S.busy=true;m.forEach((t,k)=>later(k*70,()=>{t.g.remove();crumbs(t.x+Tz/2,t.y+Tz/2,{n:6,cols:['#e9f8ff','#8fd6ff','#8a6cf0']});SFX.crunch()}));
        later(m.length*70+400,()=>{const N=b*d,A=a*d;chime();Q([['f',a,b],['o','−'],['f',c2,d],['o','='],['f',A-need,N]],true);pill(arena,300,548,[['f',a,b],['o','−'],['f',c2,d],['o','='],['f',A,N],['o','−'],['f',need,N],['o','='],['f',A-need,N]],15);say(`Smashed! ${c2}/${d} of the whole grid is ${need} tiles.`);later(700,()=>hit(250,397))})}
      else if(!m.length){SFX.clonk();say('Tap crystal tiles to crack them first.')}
      else{say(`That isn’t ${c2}/${d} of the whole grid. Count the rows and columns.`);miss(520,397,false)}},'Smash');
    say(`Smash spell! Crack ${c2}/${d} of the whole grid, then smash.`)};

  /* 6. Toll (gems) */
  GAMES.toll=q=>{const [a,b,n]=q,GEMC=['#ff7eb6','#7ee0ff','#b8f07a','#ffd36b','#c9a2ff'];let k=0,B=[];Q([['f',a,b],['t','of'],['w',n],['o','='],['o','?']]);
    function gem(parent,x,y,i,sc=1){const g=el('g',{transform:`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})`},parent);el('path',{d:'M0,-7 L6.5,-2 L4,6 L-4,6 L-6.5,-2Z',fill:GEMC[i%5],stroke:'#fff','stroke-opacity':.5,'stroke-width':1},g);el('path',{d:'M-3,-3 L0,-6 L2,-3Z',fill:'#fff',opacity:.6},g);return g}
    const pileL=el('g',{},arena),bL=el('g',{},arena);
    const pileXY=i=>[58+(i%4)*22+(Math.floor(i/4)%2)*10,368-Math.floor(i/4)*19];
    function pile(m){pileL.innerHTML='';el('ellipse',{cx:98,cy:384,rx:62,ry:12,fill:'#2a2150'},pileL);for(let i=0;i<m;i++)gem(pileL,...pileXY(i),i,1.8)}
    pile(n);
    const bx=i=>350+(i-(k-1)/2)*Math.min(78,330/Math.max(1,k-1||1));
    function drawBaskets(){bL.innerHTML='';B=[];
      for(let i=0;i<k;i++){const x=bx(i),y=360,g=el('g',{},bL),sel=el('ellipse',{cx:x,cy:y-6,rx:38,ry:40,fill:'rgba(255,240,160,.12)',stroke:'#fff0a0','stroke-width':3},g);sel.style.display='none';
        const gm=el('g',{},g);
        el('path',{d:`M${x-26},${y-8} L${x+26},${y-8} L${x+20},${y+22} L${x-20},${y+22}Z`,fill:'#a8743a',stroke:'#6a4420','stroke-width':2},g);
        for(let s=0;s<3;s++)el('path',{d:`M${x-24+s},${y+s*10} L${x+24-s},${y+s*10}`,stroke:'#6a4420','stroke-width':1.2,opacity:.7},g);
        const o={x,y,g,gm,sel,on:false,n:0};B.push(o);
        interact(g,{label:`Basket ${i+1}`,tap:()=>{if(S.busy||!S.dealt)return;o.on=!o.on;sel.style.display=o.on?'':'none';SFX.pop(o.on?1.2:.9)}})}}
    const gemIn=(o,j)=>gem(o.gm,o.x-15+(j%3)*15,o.y-18-Math.floor(j/3)*15,j,1.4);
    function choose(m){if(S.busy)return;if(n%m){SFX.clonk();shake(3);say(`${n} gems won’t share fairly into ${m} baskets. Try another number.`);return}
      k=m;S.dealt=false;S.busy=true;pile(n);drawBaskets();const per=n/k;say('Sharing the gems…');
      for(let j=0;j<n;j++)later(j*90,()=>{const o=B[j%k];pile(n-j-1);gemIn(o,o.n++);SFX.clink(j%7)});
      later(n*90+250,()=>{S.busy=false;S.dealt=true;say(`${k} baskets of ${per}. Tap the baskets that make ${a}/${b} of ${n}, then Throw!`)})}
    const CH=[2,3,4,5,6];CH.forEach((m,i)=>{const x=170+i*58,y=488,g=el('g',{transform:`translate(${x},${y})`},arena);el('circle',{r:23,fill:'#2c2356',stroke:'rgba(255,240,160,.6)','stroke-width':2},g);
      el('path',{d:'M-11,-4 L11,-4 L8,9 L-8,9Z',fill:'#a8743a',opacity:.6},g);el('text',{y:6,'text-anchor':'middle','font-size':20,'font-weight':700,fill:'#fff4e6'},g).textContent=m;
      interact(g,{label:`${m} baskets`,tap:()=>{SFX.pop(1);choose(m)}})});
    el('text',{x:286,y:530,'text-anchor':'middle','font-size':14,fill:'#fff4e6',opacity:.75},arena).textContent='equal baskets';
    goBtn(arena,520,488,'Throw the chosen baskets',()=>{if(!S.dealt){SFX.clonk();say('Share the gems into equal baskets first.');return}
      const ch=B.filter(o=>o.on),tot=ch.length*n/k;if(!ch.length){SFX.clonk();say('Tap the baskets to throw first.');return}
      if(tot*b===n*a){S.busy=true;ch.forEach((o,i)=>{const fx=o.x;tween(500,(t,p)=>o.g.setAttribute('transform',`translate(0,${(-Math.sin(p*Math.PI)*40).toFixed(1)})`))});chime();
        say(`${a}/${b} of ${n} is ${tot} gems!`);Q([['f',a,b],['t','of'],['w',n],['o','='],['w',tot]],true);later(600,()=>hit(350,340))}
      else{say(`That’s ${tot} gems. Is it ${a}/${b} of ${n}?`);miss(520,488,false)}},'Throw');
    say(`Gem spell! Throw ${a}/${b} of your ${n} gems. Share them into equal baskets first.`)};

  /* 7. Leap */
  GAMES.leap=q=>{const [a,b,h]=q,tot=a*h/b,X=v=>70+v*150,SY=430;let mark=null;
    el('rect',{x:20,y:SY-14,width:560,height:64,rx:24,fill:'url(#gRiver)',opacity:.9},arena);
    for(let k=1;k<3*b;k++){if(k%b===0)continue;el('line',{x1:X(k/b),x2:X(k/b),y1:SY-4,y2:SY+10,stroke:'#cfefff','stroke-width':2,opacity:.55},arena)}
    for(let v=0;v<=3;v++){el('rect',{x:X(v)-7,y:SY-26,width:14,height:52,rx:4,fill:'#8a5a32',stroke:'#5a3a1e','stroke-width':1.5},arena);el('text',{x:X(v),y:SY+60,'text-anchor':'middle','font-size':17,fill:'#fff4e6'},arena).textContent=v}
    Q([['f',a,b],['o','×'],['w',h],['o','='],['o','?']]);
    const padL=el('g',{},arena);
    const frog=el('g',{},arena),fin=el('g',{},frog);el('ellipse',{cx:0,cy:16,rx:22,ry:5,fill:'#0d0a24',opacity:.3},frog);
    [-1,1].forEach(sd=>el('ellipse',{cx:sd*18,cy:8,rx:11,ry:7,fill:'#4fa84a'},fin));el('ellipse',{cx:0,cy:0,rx:22,ry:15,fill:'#7fd36b'},fin);el('ellipse',{cx:0,cy:5,rx:13,ry:8,fill:'#c8f0a0'},fin);
    [-1,1].forEach(sd=>{el('circle',{cx:sd*10,cy:-12,r:8,fill:'#7fd36b'},fin);el('circle',{cx:sd*10,cy:-13,r:5.8,fill:'#fffaf2'},fin);el('circle',{cx:sd*10+1.3,cy:-13,r:3,fill:'#241a3a'},fin)});
    el('path',{d:'M-8,2 Q0,8 8,2',fill:'none',stroke:'#2f5a2a','stroke-width':2,'stroke-linecap':'round'},fin);
    const putF=(x,y)=>frog.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);putF(X(0),SY-42);
    const hitB=el('rect',{x:X(0)+10,y:SY-40,width:X(3)-X(0),height:90,fill:'transparent'},arena);
    interact(hitB,{label:'River: tap where Hopper will land',tap:p=>{if(S.busy||!p)return;const k=clamp(Math.round((p.x-X(0))/(150/b)),1,3*b);mark=k/b;padL.innerHTML='';
      const x=X(mark),g=el('g',{},padL);el('ellipse',{cx:x,cy:SY+4,rx:24,ry:8,fill:'#3f9b4f',stroke:'#fff0a0','stroke-width':2},g);el('path',{d:`M${x},${SY+4} l16,-4 l-2,6Z`,fill:'url(#gRiver)'},g);popIn(g,.3);SFX.plop()}});
    goBtn(arena,520,320,'Go: Hopper hops',()=>{if(mark==null){SFX.clonk();say('Tap the river first: where will Hopper land?');return}
      S.busy=true;let k=0;const step=()=>{const x0=X(k*a/b),x1=X((k+1)*a/b);SFX.boing(k);tween(380,(t,p)=>putF(lerp(x0,x1,p),SY-42-Math.sin(p*Math.PI)*55),()=>{k++;if(k<h)step();else land()},ease.lin)};step();
      function land(){const x=X(tot);if(Math.abs(tot-mark)<1e-9){putF(x,SY-28);SFX.croak();chime();
          const w=Math.floor(tot),r=Math.round((tot-w)*b),parts=[['f',a,b],['o','×'],['w',h],['o','='],['f',a*h,b]];if(r&&w)parts.push(['o','='],['w',w],['f',r,b]);else if(!r)parts.push(['o','='],['w',w]);
          pill(arena,300,520,parts,15);Q([['f',a,b],['o','×'],['w',h],['o','='],...(r?(w?[['w',w],['f',r,b]]:[['f',r,b]]):[['w',w]])],true);say('Right on the lily pad!');later(700,()=>hit(x,SY-30))}
        else{putF(x,SY-6);SFX.splash();drops(x,SY,10);frog.setAttribute('opacity',.6);say('Splash! Hopper missed the lily pad. New hops coming…');miss(x,SY,true)}}});
    say(`Leap spell! Hopper hops ${a}/${b} each time, ${h} times. Tap the river where he’ll land.`)};

  /* 8. Lanterns */
  GAMES.lanterns=q=>{const tgt=q.f?q.f[0]*100/q.f[1]:q.p,lab=q.f?`${q.f[0]}/${q.f[1]}`:`${q.p}%`;const CX=200,CY=384,CS=15,GX=CX-CS*4.5,GY=CY-CS*4.5;let t=0,hh=0;
    Q([['t',lab],['o','='],['t','0.??']]);const lan=el('g',{},arena);el('path',{d:`M${CX},${GY-34} v-12`,stroke:'#ffb86a','stroke-width':2},lan);
    const body=el('path',{d:`M${CX-100},${GY-18} Q${CX},${GY-40} ${CX+100},${GY-18} L${CX+100},${GY+CS*10+4} Q${CX},${GY+CS*10+26} ${CX-100},${GY+CS*10+4}Z`,fill:'#8a2a28',stroke:'#ffb86a','stroke-width':2},lan);
    el('rect',{x:GX-12,y:GY-12,width:CS*10+9,height:CS*10+9,rx:8,fill:'#2a1418'},lan);
    const cells=[];for(let c=0;c<10;c++)for(let r=0;r<10;r++){const b=el('circle',{cx:GX+c*CS,cy:GY+r*CS,r:5.5,fill:'#3a2a3a'},lan);cells.push({c,r,b})}
    function paint(){const v=t*10+hh;cells.forEach(cl=>{const i=cl.c*10+cl.r,on=i<v;cl.b.setAttribute('fill',on?(cl.c<t?'#ffc04d':'#d6ecff'):'#3a2a3a')})}
    el('text',{x:400,y:400,'text-anchor':'middle','font-size':44,'font-weight':700,fill:'#fff4e6'},arena).textContent='0.';
    numBox(arena,{x:452,y:384,w:48,h:66,fs:40,min:0,max:9,val:0,label:'Tenths',side:'vert',col:'#ffc04d',onChange:v=>{t=v;paint()}});
    numBox(arena,{x:512,y:384,w:48,h:66,fs:40,min:0,max:9,val:0,label:'Hundredths',side:'vert',col:'#bfe6ff',onChange:v=>{hh=v;paint()}});
    paint();
    goBtn(arena,482,500,'Launch the lantern',()=>{const v=t*10+hh;
      if(v===tgt){S.busy=true;SFX.fanfare();Q([['t',lab],['o','='],['t','0.'+String(tgt).padStart(2,'0')]],true);say(`${lab} = ${tgt}/100 = 0.${String(tgt).padStart(2,'0')}. Up it goes!`);
        tween(1200,(e,p)=>lan.setAttribute('transform',`translate(${(CX+Math.sin(p*6)*6).toFixed(1)},${(CY-150*e).toFixed(1)}) scale(${(1-.5*e).toFixed(3)}) translate(${-CX},${-CY})`),null,ease.inOut);
        for(let k=0;k<6;k++)later(k*150,()=>burst(CX+(Math.random()-.5)*100,CY-60-k*20,{n:6,cols:['#ffc04d','#fff0a0']}));later(900,()=>hit(CX,CY-170))}
      else{SFX.wrong();body.setAttribute('fill','#3a2028');later(900,()=>body.setAttribute('fill','#8a2a28'));say(`That’s ${v} lights out of 100. ${lab} is a different amount.`);miss(482,500,false)}},'Go');
    say(`Lantern spell! Light ${lab} of the lantern. The gold digit lights columns of 10.`)};

  function reroll(){qG=null;arena.innerHTML='';FX.innerHTML='';S.busy=false;S.dealt=false;const k=ORDER[S.r];S.q=pickQ(k);GAMES[k](S.q)}
  function load(){EPOCH++;qG=null;arena.innerHTML='';arena.removeAttribute('opacity');FX.innerHTML='';S.busy=false;S.dealt=false;navDots(8,S.r,true);idle();drawHearts();const k=ORDER[S.r];badge(k);S.q=pickQ(k);GAMES[k](S.q)}
  W.boss.jump=r=>{S.r=r;S.lit=r;S.done=false;SH.forEach((s,i)=>lightShard(i,i<r));tint();load()};
  W.boss.dbg=()=>({r:S.r,hearts:S.hearts,lit:S.lit,q:S.q,busy:S.busy,done:S.done});
  SH.forEach((s,i)=>lightShard(i,false));tint();setMouth('grin');
  load();
}};
