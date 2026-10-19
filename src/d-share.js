
/* ================= World 1: Share ================= */
W.share={
notes:`<p>This world is about what the bottom number of a fraction means: how many equal shares the whole is cut into.</p>
<p>Each round is an order: "each creature gets 1/4 of the loaf". The dashed gold outline under the loaf shows exactly how big that share is. She brings creatures to the loaf (the loaf cuts itself into one piece each) until the pieces match the outline, then rings the bell. The wrong crowd makes the creatures grumble: too few and the pieces are too big, too many and they are too small. Orders: 1/2, 1/4, 1/3, 1/6, 1/5. After that it is free play.</p>
<p>Each feast leaves one share on the shelf at the top, so she builds a staircase: the bigger the crowd, the shorter the share. Ask her to predict before she rings: will each one get more or less than last time?</p>
<p>The key misconception this targets is "a fifth is bigger than a third because 5 is bigger than 3". Here, 5 is just a bigger crowd, and a bigger crowd means a smaller share. Notice the bellies too: each creature grows by exactly the amount it ate.</p>`,
mount(root){
  const L={x:80,y:236,w:440,h:54},SEATY=212;
  const ORD=[2,4,3,6,5];
  const S={seated:[],busy:false,feasts:new Set(),rang:false,r:0,free:false,won:false};
  const tgt=()=>S.free?0:ORD[S.r];
  const home=i=>({x:84+i*62,y:500+(i%2)*16});

  /* the shelf of shares: one row per crowd size */
  const shelf=el('g',{},root);
  el('line',{x1:L.x,x2:L.x,y1:14,y2:124,stroke:'rgba(255,244,230,.25)','stroke-width':1.5},shelf);
  el('line',{x1:L.x+L.w,x2:L.x+L.w,y1:14,y2:124,stroke:'rgba(255,244,230,.25)','stroke-width':1.5,'stroke-dasharray':'3 4'},shelf);
  const rowY=n=>20+(n-1)*13.5;
  const rows=el('g',{},shelf),rowsN=el('g',{},shelf);

  const seatL=el('g',{},root);
  el('rect',{x:54,y:290,width:492,height:22,rx:11,fill:'url(#gStone)'},root);
  el('rect',{x:66,y:292,width:468,height:3,rx:1.5,fill:'rgba(255,244,230,.2)'},root);
  const loafG=el('g',{filter:'url(#glow)'},root);
  const labG=el('g',{},root),tgtL=el('g',{},root);
  function drawTarget(){tgtL.innerHTML='';if(S.free)return;const n=tgt(),y=354,w=L.w/n;
    el('rect',{x:L.x,y,width:L.w,height:26,rx:8,fill:'none',stroke:'rgba(255,244,230,.22)','stroke-dasharray':'3 5'},tgtL);
    el('rect',{x:L.x+2,y,width:w-4,height:26,rx:8,fill:'rgba(255,240,160,.16)',stroke:'#fff0a0','stroke-width':2.5,'stroke-dasharray':'7 5'},tgtL);
    const qp=[['t','each gets'],['f',1,n]],qw=exprWidth(qp,16)+34;qBox(tgtL,L.x+w+14+qw/2,y+13,qp,{sz:16})}

  /* the bell */
  const bellR=pulseRing(root,568,250,26);
  const bell=el('g',{transform:'translate(568,232)'},root);
  el('path',{d:'M0,-30 C0,-44 14,-44 14,-36',stroke:'#d8c6e4','stroke-width':2.5,fill:'none','stroke-linecap':'round'},bell);
  const sw=el('g',{},bell);
  el('path',{d:'M-17,14 C-17,-6 -10,-24 0,-24 C10,-24 17,-6 17,14 Q0,20 -17,14Z',fill:'url(#gBell)'},sw);
  el('circle',{cx:0,cy:18,r:4.5,fill:'#e3a43a'},sw);
  el('rect',{x:-2.5,y:-31,width:5,height:8,rx:2,fill:'#e3a43a'},sw);
  interact(bell,{label:'Ring the bell to eat',tap:feast});

  const crowdL=el('g',{},root);
  const cs=[];
  for(let i=0;i<8;i++){const h=home(i);cs.push(creature(crowdL,{x:h.x,y:h.y,r:22,i,label:'creature'}))}

  let pieces=[];
  function renderLoaf(anim){
    loafG.innerHTML='';labG.innerHTML='';
    const n=Math.max(1,S.seated.length),w=L.w/n;pieces=[];
    for(let j=0;j<n;j++){pieces.push(piece(loafG,L.x+j*w+(n>1?2:0),L.y,w-(n>1?4:0),L.h,0));if(S.seated.length)svgFrac(labG,L.x+(j+.5)*w,L.y+L.h+42,1,n,15)}
    if(!S.free&&S.seated.length===tgt())el('rect',{x:L.x-6,y:L.y-6,width:L.w+12,height:L.h+12,rx:12,fill:'none',stroke:'#fff0a0','stroke-width':3,opacity:.85},labG);
    if(anim&&n>1){pieces.forEach((g,j)=>{const off=(j-(n-1)/2)*-4;tween(420,t=>g.setAttribute('transform',`translate(${(off*(1-t)).toFixed(2)},0)`),null,ease.back)});for(let j=1;j<n;j++)later(j*40,()=>tone(sizeHz(1/n),.07,'triangle',.06))}
  }
  function settle(){const n=S.seated.length;S.seated.forEach((ci,j)=>{const c=cs[ci];c.moveTo(L.x+(j+.5)*L.w/n,SEATY,420)})}
  function join(ci){if(S.busy||S.seated.includes(ci)||S.seated.length>=8)return;S.rang=false;S.seated.push(ci);seatL.appendChild(cs[ci].g);cs[ci].hop();SFX.pop(1+S.seated.length*.08);settle();renderLoaf(true);upd()}
  function leave(ci){if(S.busy)return;S.rang=false;S.seated=S.seated.filter(x=>x!==ci);crowdL.appendChild(cs[ci].g);const h=home(ci);cs[ci].moveTo(h.x,h.y,420,null,30);SFX.hop();settle();renderLoaf(true);upd()}
  cs.forEach((c,ci)=>interact(c.g,{label:'creature',
    down:()=>{if(S.busy)return{no:1};FX.appendChild(c.g);return{x0:c.x,y0:c.y}},
    move:(p,p0,k)=>{if(!k.no)c.place(k.x0+p.x-p0.x,k.y0+p.y-p0.y)},
    up:(p,p0,k)=>{if(k.no)return;const sat=S.seated.includes(ci);
      if(!sat&&p.y<380){crowdL.appendChild(c.g);join(ci)}
      else if(sat&&p.y>350){seatL.appendChild(c.g);leave(ci)}
      else if(sat){seatL.appendChild(c.g);settle()}
      else{crowdL.appendChild(c.g);const h=home(ci);c.moveTo(h.x,h.y,380)}},
    tap:(p,k)=>{if(k&&k.no)return;if(S.seated.includes(ci)){seatL.appendChild(c.g);leave(ci)}else{crowdL.appendChild(c.g);join(ci)}}
  }));

  function record(n){
    const old=rows.querySelector(`[data-n="${n}"]`);if(old)old.remove();const oldN=rowsN.querySelector(`[data-n="${n}"]`);if(oldN)oldN.remove();
    const g=el('g',{'data-n':n},rows),y=rowY(n),w=L.w/n;
    el('rect',{x:L.x,y,width:L.w,height:9,rx:4.5,fill:'rgba(255,244,230,.07)'},g);
    const bar=el('rect',{x:L.x,y,width:0,height:9,rx:4.5,fill:'url(#gA)'},g);
    tween(600,t=>bar.setAttribute('width',(w*t).toFixed(1)));
    const lab=svgFrac(rowsN,L.x+w+16,y+4.5,1,n,9);lab.setAttribute('data-n',n);
    SFX.shimmer();ring(L.x+w,y+4.5,{r0:4,r1:30,w:3});
  }
  function feast(){
    if(S.busy)return;
    tween(700,(t,p)=>sw.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*5)*22*(1-p)).toFixed(1)})`),null,ease.lin);
    SFX.ding();ring(568,226,{r1:60,w:4});
    if(!S.seated.length){say('Bring at least one creature to the loaf first.');return}
    const n0=S.seated.length;if(!S.free&&n0!==tgt()){const t=tgt();SFX.wrong();shake(4);S.seated.forEach(ci=>{const c=cs[ci];c.mood('oh');later(1100,()=>c.mood(''))});
      say(n0<t?`Each piece is 1/${n0}: too big for this order! Bigger crowd, smaller pieces.`:`Each piece is 1/${n0}: too small for this order! Fewer creatures, bigger pieces.`);return}
    S.busy=true;S.rang=true;bellR.show(false);
    const n=S.seated.length,grow=Math.sqrt(1+3/n),w=L.w/n;
    pieces.forEach((g,j)=>{const c=cs[S.seated[j]],pcx=L.x+(j+.5)*w,pcy=L.y+L.h/2;
      later(250+j*110,()=>{c.mood('eat');const tx=c.x,ty=c.y+c.r*.3;
        tween(440,t=>g.setAttribute('transform',`translate(${lerp(pcx,tx,t).toFixed(1)},${lerp(pcy,ty,t).toFixed(1)}) scale(${(1-t*.88).toFixed(3)}) translate(${-pcx},${-pcy})`),()=>{
          g.remove();SFX.crunch();SFX.pop(.8+j*.06);crumbs(tx,ty,{n:6,cols:['#ffc04d','#d9732a','#fff2bf']});c.mood('happy');tween(560,t=>c.place(null,null,lerp(1,grow,t)),null,ease.back)})})});
    const T=250+n*110+440+650;
    later(T,()=>{record(n);S.seated.forEach((ci,j)=>later(j*70,()=>cs[ci].hop(10)))});
    later(T+1700,()=>{S.seated.forEach(ci=>{const c=cs[ci];tween(520,t=>c.place(null,null,lerp(grow,1,t)));c.mood('')});
      renderLoaf(false);loafG.style.opacity=0;tween(600,t=>{loafG.style.opacity=t});
      S.busy=false;S.feasts.add(n);if(!S.free)roundWon(S.r);if(S.feasts.size>=3)unlock('share');if(!S.free){S.won=true;st.ready(true)}upd()});
  }
  function upd(){
    const n=S.seated.length,f=S.feasts.size;
    if(!S.free){const t=tgt();bellR.show(n>0&&!S.busy&&!S.rang);
      if(S.won)say(S.r<ORD.length-1?'A share for the shelf! Tap the arrow for the next order.':'Every order filled! Look at the shelf: the bigger the crowd, the smaller the share. Tap the arrow for free play.');
      else if(!n)say(`Each creature gets 1/${t} of the loaf. Bring creatures to the loaf until the pieces match the gold outline.`);
      else if(n!==t)say(`${n} creature${n>1?'s':''}: each piece is 1/${n}. The order is 1/${t}.`);
      else say('The pieces match the gold outline. Ring the bell!');return}
    bellR.show(n>0&&!S.busy&&!S.rang);
    if(!n)say(f?'Bring a different crowd to the loaf.':'Drag some creatures up to the glowloaf.');
    else if(!f)say('Everyone gets an equal piece. Ring the bell to eat.');
    else if(f<3)say('Try a bigger crowd, or a smaller one. Each feast leaves one share on the shelf.');
    else say('Look at the shelf. What happens to each share when more creatures come?');
  }
  function load(){EPOCH++;S.seated.forEach(ci=>{crowdL.appendChild(cs[ci].g);const h=home(ci);cs[ci].moveTo(h.x,h.y,300);cs[ci].mood('')});S.seated=[];S.won=false;S.rang=false;S.busy=false;
    st.ready(false);navDots(ORD.length,S.free?ORD.length:S.r);renderLoaf(false);drawTarget();upd()}
  navStone({glyph:'redo',label:'Start this order again',onTap:()=>load()});
  const st=navStone({label:'Next order',onTap:()=>{if(S.free){S.free=false;S.r=0}else if(S.r>=ORD.length-1)S.free=true;else S.r++;load()}});
  S.r=resumeAt(ORD.length);load();
}};
