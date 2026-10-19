
/* ================= World 2: Scales ================= */
W.scales={
notes:`<p>Two loaves, two pans, one wobbly beam. The beam is a fair judge of size, so it settles arguments the digits can't.</p>
<p>The riddles alternate between two kinds. In a <b>guess</b> riddle the pans are already loaded and propped up. She taps the pan she thinks will sink (or Wob, for level), then the props fall away. Getting it wrong here is the good bit: ask her what surprised her. In a <b>balance</b> riddle she has to load the right-hand pan until the beam sits level. That is equivalent fractions, found by weight.</p>
<p>The dots along the bottom show progress through the riddles. After the last one it becomes free play: turn the knobs to cut the loaves differently and weigh anything against anything.</p>`,
mount(root){
  const CX=300,PY=252,ARM=160,STR=84,PW=220,PH=32,LW=220,LH=36;
  const LO=[{x:40,y:92},{x:340,y:92}];
  const RID=[
    {t:'guess',a:3,ka:1,b:5,kb:1},{t:'bal',a:2,ka:1,b:4},{t:'guess',a:3,ka:2,b:5,kb:2},
    {t:'bal',a:3,ka:2,b:6},{t:'guess',a:2,ka:1,b:6,kb:3},{t:'bal',a:4,ka:3,b:0},{t:'guess',a:4,ka:3,b:6,kb:5}];
  const VALS=[1,2,3,4,5,6,7,8,9,10,11,12];
  const S={n:[3,5],taken:[new Set(),new Set()],pans:[[],[]],r:0,free:false,pinned:false,pred:null,solved:false,th:0,v:0,lockL:false,wasBal:false,guessN:0,balN:0};

  /* stand and ground */
  el('path',{d:`M${CX-7},${PY} L${CX-20},500 L${CX+20},500 L${CX+7},${PY}Z`,fill:'url(#gStone)'},root);
  el('ellipse',{cx:CX,cy:502,rx:46,ry:9,fill:'#2a2357'},root);
  const props=el('g',{},root);
  const strings=el('g',{},root);
  const sl=[0,1].map(()=>[el('line',{stroke:'rgba(255,244,230,.45)','stroke-width':1.5},strings),el('line',{stroke:'rgba(255,244,230,.45)','stroke-width':1.5},strings)]);
  const beam=el('g',{},root);
  const beamBar=el('rect',{x:CX-ARM-6,y:PY-6,width:ARM*2+12,height:12,rx:6,fill:'#4a3d82',stroke:'rgba(255,244,230,.3)'},beam);
  el('circle',{cx:CX-ARM,cy:PY,r:5,fill:'#fff0a0'},beam);el('circle',{cx:CX+ARM,cy:PY,r:5,fill:'#fff0a0'},beam);
  el('circle',{cx:CX,cy:PY,r:9,fill:'#fff0a0'},root);
  const pans=[0,1].map(t=>{const g=el('g',{},root);
    el('path',{d:`M${-PW/2-8},0 h${PW+16} q-6,18 -32,18 h${-PW+48} q-26,0 -32,-18Z`,fill:'url(#gStone)',stroke:'rgba(255,244,230,.28)'},g);
    const hit=el('rect',{x:-PW/2-10,y:-70,width:PW+20,height:92,fill:'transparent'},g);
    const pl=el('g',{filter:'url(#glow)'},g),lab=el('g',{},g);
    interact(g,{label:t?'right pan':'left pan',tap:()=>guess(t)});
    return{g,pl,lab}});
  const wob=creature(root,{x:CX,y:PY-28,r:17,i:4,label:'Wob'});
  interact(wob.g,{label:'Wob: tap if you think the scales stay level',tap:()=>guess('level')});

  /* loaves and knobs */
  const loafL=el('g',{filter:'url(#glow)'},root);
  const knobs=[0,1].map(s=>{const kx=s?532:68,ky=540;
    el('rect',{x:kx-20,y:ky-62,width:40,height:12,rx:5,fill:s?'url(#gB)':'url(#gA)'},root);
    return knob(root,{x:kx,y:ky,vals:VALS,val:S.n[s],hue:s,label:s?'Cut the green loaf':'Cut the golden loaf',onChange:v=>recut(s,v)})});
  const dots=el('g',{},root);
  const eqG=el('g',{class:'num'},root);el('text',{x:CX,y:PY+STR+52,'text-anchor':'middle','font-size':30},eqG).textContent='=';eqG.style.display='none';
  const st=navStone({label:'Next riddle',onTap:next});

  const wt=t=>S.pans[t].reduce((a,it)=>a+U/it.n,0);
  function renderLoaves(){
    loafL.innerHTML='';
    [0,1].forEach(s=>{const n=S.n[s],w=LW/n,{x,y}=LO[s];
      for(let j=0;j<n;j++){const px=x+j*w+(n>1?1.5:0),pw=w-(n>1?3:0);
        if(S.taken[s].has(j)){ghost(loafL,px,y,pw,LH);continue}
        const g=piece(loafL,px,y,pw,LH,s);
        dragPiece(g,{label:'piece',canStart:()=>canTake(s),
          onDrop:p=>{if(p.y<190)return null;const t=p.x<CX?0:1;return addTo(t,s,j,false)},
          onTap:()=>{if(canTake(s))addTo(s,s,j,true)}})}});
  }
  function canTake(s){if(S.pinned){say('Make your guess first: tap the pan you think will sink.');return false}if(s===0&&S.lockL){say('The golden loaf is part of the riddle. Use the green loaf.');return false}return true}
  function addTo(t,s,j,instant){
    const n=S.n[s];if(wt(t)+U/n>U){say('That pan can only hold one whole loaf.');clonk();shake(4);return null}
    const used=wt(t),ex=CX+(t?1:-1)*ARM*Math.cos(S.th),ey=PY+(t?1:-1)*ARM*Math.sin(S.th)+STR;
    const commit=()=>{S.pans[t].push({s,j,n});S.taken[s].add(j);SFX.pop(1+t*.1);renderLoaves();renderPans();upd()};
    if(instant){commit();return null}
    return{x:ex-PW/2+used/U*PW,y:ey-PH,done:commit};
  }
  function renderPans(){
    [0,1].forEach(t=>{const pl=pans[t].pl;pl.innerHTML='';let acc=0;
      S.pans[t].forEach((it,k)=>{const w=PW/it.n,x=-PW/2+acc/U*PW;acc+=U/it.n;
        const g=piece(pl,x+1,-PH,w-2,PH,it.s);
        interact(g,{label:'piece on the pan',tap:()=>{if(S.pinned){guess(t);return}if(it.s===0&&S.lockL)return;S.pans[t].splice(k,1);S.taken[it.s].delete(it.j);SFX.hop();renderLoaves();renderPans();upd()}})})});
    [0,1].forEach(t=>{const lab=pans[t].lab;lab.innerHTML='';if(!S.pans[t].length)return;
      const grp=[];S.pans[t].forEach(it=>{let g=grp.find(x=>x.s===it.s&&x.n===it.n);if(!g){g={s:it.s,n:it.n,k:0};grp.push(g)}g.k++});
      const parts=[];grp.forEach((g,i)=>{if(i)parts.push(['o','+']);parts.push(['f',g.k,g.n])});
      svgExpr(lab,0,46,parts,17,'middle')});
  }
  function recut(s,v){
    [0,1].forEach(t=>{S.pans[t]=S.pans[t].filter(it=>it.s!==s)});S.taken[s].clear();S.n[s]=v;
    renderLoaves();renderPans();upd();
  }
  function guess(choice){
    if(!S.pinned||S.pred!==null)return;
    S.pred=choice;const tx=choice==='level'?CX:CX+(choice?1:-1)*70;
    wob.moveTo(tx,PY-28,420,null,26);SFX.pop(1.3);
    say(choice==='level'?'You think it stays level. Let’s see…':'You think that side sinks. Let’s see…');
    later(800,()=>{tween(500,t=>{props.setAttribute('transform',`translate(0,${t*80})`);props.style.opacity=1-t});SFX.thud();shake(6);S.pinned=false});
    later(2200,()=>{const d=wt(1)-wt(0),truth=d>0?1:d<0?0:'level';
      if(truth===choice){roundWon(S.r);SFX.fanfare();burst(CX,PY-40,{n:18});ring(CX,PY,{r1:150});wob.mood('happy');wob.hop(20);say(truth==='level'?'Spot on. Different pieces, the same amount.':'You saw it coming. Look at how big each piece is.')}
      else{wob.mood('oh');SFX.wrong();say('Surprise! Look at the size of the pieces, not how many there are.')}
      S.solved=true;S.guessN++;if(S.guessN>=3)unlock('bigger');st.ready(true);
      later(1400,()=>{wob.mood('');wob.moveTo(CX,PY-28,400,null,20)})});
  }
  function drawProps(){props.innerHTML='';props.removeAttribute('transform');props.style.opacity=1;
    [0,1].forEach(t=>{const x=CX+(t?1:-1)*ARM;for(let k=0;k<5;k++)el('ellipse',{cx:x+((k%2)?6:-6),cy:PY+STR+30+k*28,rx:22-k,ry:13,fill:'#3d3278',stroke:'rgba(255,244,230,.2)'},props)})}
  function load(i){
    S.free=i>=RID.length;S.r=i;S.pans=[[],[]];S.taken=[new Set(),new Set()];S.pred=null;S.solved=false;S.wasBal=false;st.ready(false);
    if(S.free){S.n=[3,4];S.lockL=false;S.pinned=false;knobs[0].lock(false);knobs[1].lock(false)}
    else{const R=RID[i];S.n=[R.a,R.b||2];S.lockL=true;S.pinned=R.t==='guess';
      for(let j=0;j<R.ka;j++){S.pans[0].push({s:0,j,n:R.a});S.taken[0].add(j)}
      if(R.t==='guess')for(let j=0;j<R.kb;j++){S.pans[1].push({s:1,j,n:R.b});S.taken[1].add(j)}
      knobs[0].lock(true);knobs[1].lock(R.t==='guess'||R.b>0)}
    knobs[0].set(S.n[0]);knobs[1].set(S.n[1]);
    if(S.pinned){S.th=0;S.v=0;drawProps()}else props.innerHTML='';
    wob.place(CX,PY-28);wob.mood('');
    navDots(RID.length,S.free?RID.length:i);
    renderLoaves();renderPans();upd();
  }
  function next(){load(S.free?0:S.r+1)}
  function upd(){
    if(S.free){say('Free play. Cut the loaves any way you like, and weigh anything against anything.');return}
    const R=RID[S.r];
    if(R.t==='guess'){if(S.pred===null)say('Which side will sink? Tap that pan. Or tap Wob if you think it stays level.')}
    else if(!S.solved)say(R.b?'Make the scales balance, using pieces from the green loaf.':'Make it balance. Turn the green knob to cut the green loaf any way you like.');
  }

  loop(dt=>{
    const L=wt(0),R=wt(1),tgt=S.pinned?0:clamp((R-L)/U*.55,-.3,.3);
    S.v+=(55*(tgt-S.th)-6.5*S.v)*dt;S.th+=S.v*dt;if(S.pinned){S.th=0;S.v=0}
    beam.setAttribute('transform',`rotate(${(S.th*180/Math.PI).toFixed(2)} ${CX} ${PY})`);
    [0,1].forEach(t=>{const sg=t?1:-1,ex=CX+sg*ARM*Math.cos(S.th),ey=PY+sg*ARM*Math.sin(S.th);
      pans[t].g.setAttribute('transform',`translate(${ex.toFixed(1)},${(ey+STR).toFixed(1)})`);
      sl[t][0].setAttribute('x1',ex);sl[t][0].setAttribute('y1',ey);sl[t][0].setAttribute('x2',ex-PW/2-4);sl[t][0].setAttribute('y2',ey+STR);
      sl[t][1].setAttribute('x1',ex);sl[t][1].setAttribute('y1',ey);sl[t][1].setAttribute('x2',ex+PW/2+4);sl[t][1].setAttribute('y2',ey+STR)});
    if(S.pred===null)wob.look(CX+(R>L?200:R<L?-200:0),PY+120);
    const bal=L===R&&L>0&&!S.pinned&&Math.abs(S.th)<.01;
    beamBar.setAttribute('fill',bal?'#8a76d6':'#4a3d82');eqG.style.display=bal?'':'none';
    if(bal&&!S.wasBal){
      if(!S.free&&RID[S.r].t==='bal'&&!S.solved){S.solved=true;S.balN++;roundWon(S.r);if(S.balN>=2)unlock('balance');st.ready(true);SFX.ding();SFX.sparkle();ring(CX,PY,{r1:170,w:6});burst(CX,PY-30,{n:16});wob.mood('happy');wob.hop(20);later(1300,()=>wob.mood(''));say('Balanced! Different pieces, exactly the same amount.')}
      else if(S.free){SFX.ding();ring(CX,PY,{r1:120});wob.hop(12)}
    }
    S.wasBal=bal;
  });
  load(resumeAt(RID.length));
}};
