
/* ================= World 4: Join ================= */
W.join={scene:'patch',
notes:`<p>Adding fractions, done with two watermelons (one red, one yellow) and a chopper. You can only put slices together on one plate and count them if they are all the same size.</p>
<p>Slide the chopper along the bottom. Dashed chop lines appear over both melons. Each melon's own cut lines turn gold when they sit on chop lines and red when they don't. When both melons are fully gold, let go: a knife cuts both, and the slices slide onto the answer plate where they can simply be counted. Letting go too early clonks, and after two clonks the chopper marks the positions that work.</p>
<p>It is worth asking: did chopping change how much melon there was? (Match showed that it doesn't.) Is there a smaller chop that also works? Five sums, all within one whole melon: 1/2 + 1/4, 1/3 + 1/6, 1/2 + 1/3, 1/4 + 1/3, 1/2 + 2/5. Going past one whole waits for Hive (top-heavy fractions), then Jugs.</p>
<p>With the goggles on, the whole sum is written in the middle, true to the slices: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.</p>`,
mount(root){
  const PR=[[1,2,1,4],[1,3,1,6],[1,2,1,3],[1,4,1,3],[1,2,2,5]];
  const P=[[150,166],[450,166]],R=92,QY=420,QR=84,SX0=120,SX1=480,SY=560;
  const sx=c=>SX0+(c-1)*(SX1-SX0)/11;
  const S={p:0,c:1,chopped:false,served:false,busy:false,clangs:0,wins:new Set()};
  const pzL=el('g',{},root),ovL=el('g',{},root),ansL=el('g',{},root),exL=el('g',{},root);
  const plus=el('text',{x:300,y:181,'text-anchor':'middle','font-size':44,'font-weight':600,fill:'#fff0a0'},root);plus.textContent='+';
  const chef=creature(root,{x:52,y:474,r:20,i:2,hat:'beanie',label:'Melon farmer'});

  /* chopper slider */
  const track=el('g',{},root);
  el('rect',{x:SX0-22,y:SY-8,width:SX1-SX0+44,height:16,rx:8,fill:'#1d1840',stroke:'rgba(255,244,230,.22)'},track);
  for(let c=1;c<=12;c++)el('circle',{cx:sx(c),cy:SY,r:3,fill:'rgba(255,244,230,.4)'},track);
  const hintL=el('g',{},root);
  interact(track,{label:'Chopper track',tap:p=>{if(S.busy||!p)return;setC(clamp(Math.round((p.x-SX0)/(SX1-SX0)*11)+1,1,12));release()}});
  const handle=el('g',{},root);
  el('circle',{r:20,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},handle);
  el('circle',{r:9,fill:'#e6eaf2',stroke:'#7d8aa8','stroke-width':2},handle);
  const hn=el('text',{x:0,y:-32,'text-anchor':'middle','font-size':15},el('g',{class:'num'},handle));
  let hx=sx(1);const put=x=>{hx=x;handle.setAttribute('transform',`translate(${x.toFixed(1)},${SY})`)};
  interact(handle,{label:'Chopper: slide to chop both melons',down:()=>({x0:hx}),
    move:(p,p0,k)=>{if(S.busy)return;const x=clamp(k.x0+p.x-p0.x,SX0,SX1);put(x);const c=1+Math.round((x-SX0)/(SX1-SX0)*11);if(c!==S.c)setC(c)},
    up:()=>{if(S.busy)return;put(sx(S.c));release()},
    tap:()=>{if(S.busy)return;setC(S.c>=12?1:S.c+1);put(sx(S.c));release()}});
  handle.addEventListener('keydown',e=>{if(S.busy)return;if(e.key==='ArrowRight'){e.preventDefault();setC(Math.min(12,S.c+1));put(sx(S.c))}if(e.key==='ArrowLeft'){e.preventDefault();setC(Math.max(1,S.c-1));put(sx(S.c))}});
  const st=navStone({label:'Next sum',onTap:()=>{S.p=(S.p+1)%PR.length;reset()}});

  let filled=[];
  const pr=()=>PR[S.p];
  const fits=i=>{const b=pr()[i*2+1];return S.c>1&&S.c%b===0};
  function setC(c){S.c=c;S.chopped=false;S.served=false;filled=[];SFX.tick(c);draw();upd()}
  function plates(){const [a,b,c2,d]=pr(),tot=a/b+c2/d;return tot>1+1e-9?[[196,QY],[404,QY]]:[[300,QY]]}
  function draw(){
    const [a,b,c2,d]=pr();pzL.innerHTML='';ovL.innerHTML='';
    [[a,b],[c2,d]].forEach(([k,n],i)=>{const [cx,cy]=P[i];
      const nn=S.chopped?S.c:n,hv=S.served?0:S.chopped?k*S.c/n:k;
      pizza(pzL,{cx,cy,R,n:nn,have:hv,fl:2+i});
      if(!S.chopped&&S.c>1){
        radial(ovL,cx,cy,R+12,S.c,{stroke:'#fff4e6','stroke-width':1.6,'stroke-dasharray':'5 5',opacity:.8});
        radial(ovL,cx,cy,R+4,n,{stroke:fits(i)?'#fff0a0':'#ff7a93','stroke-width':4,'stroke-linecap':'round',opacity:.95});
        if(fits(i))el('circle',{cx,cy,r:R+22,fill:'none',stroke:'#fff0a0','stroke-width':3,opacity:.75},ovL)}
      svgFrac(ovL,cx,cy-R-36,S.chopped?k*S.c/n:k,S.chopped?S.c:n,16)});
    drawAnswer(0);drawExpr();
    hn.textContent=S.c===1?'no chop':`chop into ${S.c}`;
    hintL.innerHTML='';if(S.clangs>=2&&!S.chopped)for(let c=2;c<=12;c++)if(c%b===0&&c%d===0)el('circle',{cx:sx(c),cy:SY-22,r:5,fill:'#fff0a0'},hintL);
  }
  function drawAnswer(){
    ansL.innerHTML='';const pl=S.served?plates():[[300,QY]],c=S.c;
    pl.forEach(([cx,cy],pi)=>{plate(ansL,cx,cy,QR);
      if(!filled.length)el('circle',{cx,cy,r:QR-1,fill:'rgba(255,244,230,.03)',stroke:'rgba(255,244,230,.3)','stroke-width':1.4,'stroke-dasharray':'4 4'},ansL);
      filled.forEach((fl,q)=>{if(Math.floor(q/c)!==pi)return;const s=q%c;slice(ansL,cx,cy,QR,s/c,(s+1)/c,2+fl,c>1?2:0)})});
  }
  function drawExpr(){
    exL.innerHTML='';const [a,b,c2,d]=pr(),c=S.c;
    const parts=[['f',a,b],['o','+'],['f',c2,d]];
    if(S.chopped)parts.push(['o','='],['f',a*c/b,c],['o','+'],['f',c2*c/d,c]);
    if(S.served){const t=a*c/b+c2*c/d;parts.push(['o','='],['f',t,c]);if(t>c){parts.push(['o','='],['w',Math.floor(t/c)]);if(t%c)parts.push(['f',t%c,c])}}
    else parts.push(['o','='],['o','?']);
    qBox(exL,300,296,parts,{sz:S.served?15:16,done:S.served});
  }
  function release(){
    if(S.c===1){upd();return}
    const [a,b,c2,d]=pr();
    if(fits(0)&&fits(1))chop();
    else{S.clangs++;clonk();shake(6);chef.mood('oh');S.busy=true;
      const bad=[0,1].filter(i=>!fits(i));
      tween(520,(t,p)=>{const dx=Math.sin(p*Math.PI*8)*6*(1-p);pzL.setAttribute('transform',`translate(${dx.toFixed(1)},0)`)},()=>{pzL.removeAttribute('transform');chef.mood('');S.busy=false;draw();upd()},ease.lin);
      S.hold=true;later(2600,()=>{S.hold=false;upd()});
      say(S.clangs>=2?'Clonk! The gold dots above the chopper show the chops that fit both melons.':`Clonk! The ${bad.length===2?'melons’':bad[0]?'yellow melon’s':'red melon’s'} own cuts are red: they don’t sit on chop lines.`)}
  }
  function chop(){
    S.busy=true;const [a,b,c2,d]=pr(),c=S.c;let left=2;
    ovL.innerHTML='';
    [b,d].forEach((n,i)=>{const angs=range(0,c-1).map(j=>j/c).filter(t=>Math.abs(t*n-Math.round(t*n))>1e-9);
      if(!angs.length){left--;return}
      cutter(pzL,P[i][0],P[i][1],R,angs,{knife:true,each:Math.max(70,Math.min(150,600/angs.length)),done:()=>{if(--left===0)afterCut()}})});
    if(left===0)afterCut();
    function afterCut(){S.chopped=true;draw();say('Chopped! Every slice on both melons is now the same size.');later(800,serve)}
  }
  function serve(){
    const [a,b,c2,d]=pr(),c=S.c,ka=a*c/b,kb=c2*c/d,pl=plates();
    const list=[];for(let j=0;j<ka;j++)list.push({i:0,j});for(let j=0;j<kb;j++)list.push({i:1,j});
    const fly=list.map(o=>{const g=el('g',{},FX);slice(g,P[o.i][0],P[o.i][1],R,o.j/c,(o.j+1)/c,2+o.i,2);return Object.assign(o,{g})});
    S.served=true;filled=[];draw();
    fly.forEach((o,q)=>later(q*170,()=>{const [tx,ty]=pl[Math.floor(q/c)],s=q%c,[fx,fy]=P[o.i],rot=(s-o.j)/c*360,sc=QR/R;
      tween(520,t=>o.g.setAttribute('transform',`translate(${lerp(fx,tx,t).toFixed(1)},${lerp(fy,ty,t).toFixed(1)}) rotate(${(rot*t).toFixed(1)}) scale(${lerp(1,sc,t).toFixed(3)}) translate(${-fx},${-fy})`),
        ()=>{o.g.remove();filled.push(o.i);drawAnswer();SFX.plink(q);SFX.pop(1+q*.03);const [qx,qy]=pl[Math.floor(q/c)];ring(qx,qy,{r0:QR*.6,r1:QR+20,w:3,dur:400})},ease.inOut)}));
    later(fly.length*170+700,()=>{S.busy=false;SFX.fanfare();burst(300,QY,{n:24,spread:120});ring(300,QY,{r1:170,w:6});if(filled.length>S.c)shake(5);chef.mood('happy');chef.hop(18);later(1200,()=>chef.mood(''));
      S.wins.add(S.p);roundWon(S.p);unlock('common');if(S.wins.size>=2)unlock('join');st.ready(true);upd()});
  }
  function reset(){navDots(PR.length,S.p);S.c=1;S.chopped=false;S.served=false;S.clangs=0;filled=[];put(sx(1));st.ready(false);draw();upd()}
  function upd(){
    if(S.hold||S.busy&&!S.served)return;
    const [a,b,c2,d]=pr(),t=a/b+c2/d;
    if(S.served)say(t>1+1e-9?'Too much for one plate! That makes one whole melon, with some more on the next plate.':'All the slices are the same size, so they go on one plate together. Count them!');
    else if(S.c===1)say('Add the two melons. Slide the chopper until both melons light up gold, then let go.');
    else if(fits(0)&&fits(1))say('Both melons light up gold. Let go to chop!');
    else if(fits(0)||fits(1))say(`The ${fits(0)?'red':'yellow'} melon fits. Keep sliding until the ${fits(0)?'yellow':'red'} one does too.`);
    else say('Neither melon’s own cuts sit on the chop lines yet.');
  }
  S.p=resumeAt(PR.length);reset();
}};
