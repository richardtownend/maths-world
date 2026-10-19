/* ---------- 4. Sharing the loot: what long division really does ---------- */
function pirateFig(parent,x,y,i=0,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  const skin=['#f2c9a0','#c98a5a','#8a5a3a','#e8b088'][i%4],band=['#e8413e','#4aa0ff','#3aa86a','#9a6cff'][i%4];
  el('path',{d:'M-20,46 Q-22,12 0,10 Q22,12 20,46Z',fill:'#fff4e6',stroke:'#3a2418','stroke-width':2},g);[18,28,38].forEach(yy=>el('line',{x1:-20,x2:20,y1:yy,y2:yy,stroke:band,'stroke-width':4},g));
  el('circle',{cy:-6,r:16,fill:skin,stroke:'#3a2418','stroke-width':2},g);el('path',{d:'M-16,-10 Q0,-30 16,-10 L18,-6 H-18Z',fill:band,stroke:'#3a2418','stroke-width':1.5},g);el('path',{d:'M16,-8 l10,4 l-8,4',fill:band},g);
  if(i%2){el('circle',{cx:6,cy:-5,r:4.5,fill:'#241a1a'},g);el('line',{x1:-14,y1:-12,x2:14,y2:-3,stroke:'#241a1a','stroke-width':1.5},g);el('circle',{cx:-6,cy:-5,r:2,fill:'#241a1a'},g)}
  else[-6,6].forEach(dx=>el('circle',{cx:dx,cy:-5,r:2,fill:'#241a1a'},g));
  el('path',{d:'M-6,3 q6,5 12,0',stroke:'#3a2418','stroke-width':2,fill:'none'},g);
  return g}
SCENE_X.deck=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#8fd0f0'},o);el('rect',{x:-700,y:150,width:2000,height:140,fill:'#3a9ac8'},o);
  el('rect',{x:-700,y:290,width:2000,height:520,fill:'#b07a4a'},o);for(let y=300;y<800;y+=26)el('line',{x1:-700,x2:1300,y1:y,y2:y,stroke:'#8a5a34','stroke-width':2},o);
  el('rect',{x:-700,y:280,width:2000,height:14,fill:'#7a4a24'},o);el('rect',{x:600,y:-20,width:16,height:310,fill:'#7a4a24'},o)};
AMB_X.deck=()=>{if(Math.random()<.7)noise(1.6,.025,{type:'lowpass',f:500,a:.7,wet:.4});else osc('triangle',90+Math.random()*30,.4,.01,{to:70,wet:.3})};

W.loot={scene:'deck',
notes:`<p>Long division is sharing, done biggest first. The loot sits on the cloth as £100 bags, £10 notes and £1 coins, and a few pirates want a fair share. For each kind, biggest first, she gives the first pirate as many as she thinks each one gets, then presses Deal and everyone gets the same. Too many (it won't go round) or too few (there's enough left for everyone to have another) is a miss. Whatever can't go round is taken to the bank and swapped for ten of the next coin down, which is the little number carried in the bus stop. The bus stop method writes itself alongside as she goes, so she sees what each digit means. What's left at the end stays in the middle: the remainder.</p>`,
mount(root){
  const R=[
    {v:[[84,2],[64,2],[86,2]]},
    {v:[[72,3],[54,3],[52,4]]},
    {v:[[78,3],[96,4],[75,3]]},
    {v:[[372,3],[264,2],[484,4]]},
    {v:[[258,3],[174,2],[195,3]]},
    {v:[[137,4],[253,2],[365,3]]}];
  const K=[10000,1000,100],NM={10000:['£100 bag','bags of £100'],1000:['£10 note','£10 notes'],100:['£1 coin','£1 coins']},DC={10000:'#a8743a',1000:'#c86a2a',100:'#b8900a'};
  const S={r:0,busy:false,won:false,pi:{},miss:0,ci:0,phase:'deal',mid:{},each:{},plan:0,carry:[],qd:[]};
  const scene=el('g',{},root),bus=el('g',{},root),piles=el('g',{},root),midL=el('g',{},root),fly=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  const st=navStone({label:'Next loot',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this loot again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],[A,N]=rr.v[(S.pi[S.r]||0)%rr.v.length],dg=String(A).split('').map(Number);return{A,N,dg,kinds:K.slice(3-dg.length)}};
  const kind=()=>Q().kinds[S.ci];
  const px=(q,i)=>240+(i-(q.N-1)/2)*Math.min(120,390/q.N);
  const parts=(q,done)=>[['t',`£${q.A} shared by ${q.N}`],['o','='],done?['w',`£${Math.floor(q.A/q.N)} each`]:['o','?']];
  /* where each piece on the cloth sits */
  function midSpots(){const out=[];let y=184;K.forEach(v=>{const n=S.mid[v]||0;if(!n)return;const per=v===100?11:n>14?9:7,dx=v===100?28:n>14?34:44,rh=v===10000?40:v===1000?(n>14?22:28):24;
    for(let k=0;k<n;k++){out.push({v,x:146+(k%per)*dx,y:y+Math.floor(k/per)*rh,k,s:v===10000?.95:v===1000&&n>14?.62:.8})}y+=Math.ceil(n/per)*rh+8});return out}
  function stackPos(q,i,v,k){const j=K.indexOf(v);return{x:px(q,i)-30+j*30,y:474-k*(v===100?6:7)}}
  function drawMid(){midL.innerHTML='';const q=Q(),cur=kind();
    el('rect',{x:120,y:144,width:320,height:150,rx:14,fill:'#7a2a3a',stroke:'#c9a24a','stroke-width':3},midL);el('text',{x:132,y:160,'font-size':12,'font-weight':800,fill:'#fff0a0'},midL).textContent='the loot';
    midSpots().forEach(p=>{const c=moneyPiece(midL,p.x,p.y,p.v,{s:p.s});if(p.v!==cur&&!S.won)c.setAttribute('opacity',.55);
      interact(c,{label:`Loot: ${NM[p.v][0]}`,tap:()=>tapMid(p.v)})})}
  function drawPiles(){piles.innerHTML='';const q=Q(),cur=kind();
    for(let i=0;i<q.N;i++){pirateFig(piles,px(q,i),346,i,1.25);if(i===0&&!S.won){el('text',{x:px(q,i),y:306,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff0a0'},piles).textContent='first pirate'}
      el('ellipse',{cx:px(q,i),cy:486,rx:50,ry:10,fill:'rgba(0,0,0,.18)'},piles);
      K.forEach(v=>{const n=(S.each[v]||0)+(i===0&&v===cur&&S.phase==='deal'?S.plan:0);for(let k=0;k<n;k++){const p=stackPos(q,i,v,k),c=moneyPiece(piles,p.x,p.y,v,{s:v===10000?.85:v===1000?.62:.95});
        if(i===0&&v===cur&&S.phase==='deal'&&k>=(S.each[v]||0))interact(c,{label:`First pirate: ${NM[v][0]}`,tap:()=>{if(S.busy||S.won)return;S.plan--;S.mid[v]++;SFX.pop(.8);drawMid();drawPiles()}})}})}}
  function drawBus(){bus.innerHTML='';const q=Q(),x0=490,y0=196,dx=36,n=q.dg.length;
    el('rect',{x:444,y:110,width:190,height:136,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},bus);el('text',{x:539,y:128,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#7a5a3a'},bus).textContent='the written way';
    el('text',{x:x0-14,y:y0+12,'text-anchor':'end','font-size':30,'font-weight':800,fill:'#3a2418'},bus).textContent=q.N;
    el('path',{d:`M${x0-6},${y0+20} Q${x0+2},${y0} ${x0-4},${y0-24} H${x0+n*dx+8}`,stroke:'#3a2418','stroke-width':3,fill:'none'},bus);
    q.dg.forEach((d,j)=>{const x=x0+16+j*dx,v=q.kinds[j];el('text',{x,y:y0+12,'text-anchor':'middle','font-size':30,'font-weight':800,fill:DC[v]},bus).textContent=d;
      if(S.carry[j])el('text',{x:x-14,y:y0-2,'text-anchor':'middle','font-size':15,'font-weight':800,fill:DC[q.kinds[j-1]]},bus).textContent=S.carry[j];
      if(S.qd[j]!=null)el('text',{x,y:y0-32,'text-anchor':'middle','font-size':30,'font-weight':800,fill:DC[v],opacity:S.qd[j]===0&&j===0?.4:1},bus).textContent=S.qd[j]});
    if(S.won&&S.rem)el('text',{x:x0+16+n*dx-14,y:y0-32,'font-size':16,'font-weight':800,fill:'#7a2424'},bus).textContent=` r${S.rem}`;
    q.kinds.forEach((v,j)=>el('text',{x:x0+16+j*dx,y:y0+38,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#7a5a3a'},bus).textContent=['£100s','£10s','£1s'][K.indexOf(v)])}
  function drawAll(){drawMid();drawPiles();drawBus()}
  function flyPiece(v,a,b,delay,ms=380,done){later(delay,()=>{const c=moneyPiece(fly,a.x,a.y,v,{s:.8});tween(ms,(t,p)=>c.setAttribute('transform',`translate(${(a.x+(b.x-a.x)*p).toFixed(1)},${(a.y+(b.y-a.y)*p-Math.sin(p*Math.PI)*30).toFixed(1)}) scale(.8)`),()=>{c.remove();done&&done()})})}
  function tapMid(v){if(S.busy||S.won)return;const q=Q(),cur=kind();
    if(v!==cur){say(v>cur?`Those are shared already.`:`Biggest first: share the ${NM[cur][1]} before the ${NM[v][1]}.`);return}
    if(S.phase==='deal'){if(!S.mid[v]){return}S.mid[v]--;S.plan++;SFX.clink&&SFX.clink();drawMid();drawPiles();return}
    /* swap phase: one leftover goes to the bank and comes back as ten of the next one down */
    const sp=midSpots().filter(p=>p.v===v).pop(),nx=v/10;S.busy=true;S.mid[v]--;drawMid();SFX.whoosh();
    flyPiece(v,sp,{x:66,y:206},0,420,()=>{SFX.clink&&SFX.clink();S.mid[nx]=(S.mid[nx]||0)+10;S.carry[S.ci+1]=(S.carry[S.ci+1]||0)+1;
      for(let k=0;k<10;k++)flyPiece(nx,{x:66,y:206},{x:200+k*14,y:250},k*50,320);
      later(900,()=>{S.busy=false;drawAll();if(!S.mid[v]){S.ci++;S.phase='deal';S.plan=0;say(`Swapped! Now share the ${NM[kind()][1]}.`)}else say(`One ${NM[v][0]} became ten ${NM[nx][1]}. ${S.mid[v]} more to swap.`)})})}
  function miss(msg){SFX.wrong();shake(2);S.miss++;const v=kind();S.mid[v]+=S.plan;S.plan=0;drawAll();
    if(S.miss>=2){S.busy=true;say(`${msg} Some new loot…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4000,load)}else say(`${msg} Try again: think how many go round.`)}
  function deal(){if(S.busy||S.won)return;const q=Q(),v=kind();if(S.phase!=='deal'){say(`Tap the leftover ${NM[v][1]} to swap them at the bank first.`);return}
    let note='';if(S.mid[v]+S.plan<q.N){const all=S.mid[v]+S.plan;if(S.plan){S.mid[v]=all;S.plan=0}note=`Only ${all} ${all>1?NM[v][1]:NM[v][0]} for ${q.N} pirates: not enough for one each, so each gets none. `}
    const n=S.plan,left=S.mid[v];if(n*(q.N-1)>left){miss(`Not enough ${NM[v][1]} for everyone to get ${n}.`);return}
    if(left-n*(q.N-1)>=q.N){miss(`There are enough ${NM[v][1]} left for everyone to get another.`);return}
    S.busy=true;S.mid[v]-=n*(q.N-1);const sp=midSpots();drawMid();let d=0;
    for(let k=0;k<n;k++)for(let i=1;i<q.N;i++){const a=sp[Math.floor(Math.random()*sp.length)]||{x:280,y:220};flyPiece(v,a,stackPos(q,i,v,k),d,300);d+=Math.max(40,240/n/q.N)}
    SFX.whoosh();later(d+340,()=>{S.each[v]=n;S.plan=0;S.qd[S.ci]=n;S.busy=false;SFX.chime();const left=S.mid[v],last=S.ci===q.kinds.length-1;drawAll();
      S.miss=0;if(last){finish(left);return}
      if(left){S.phase='swap';drawAll();say(note?`${note}Tap ${left>1?'them':'it'} to swap at the bank.`:`${left} ${left>1?NM[v][1]:NM[v][0]} left: not enough to go round. Tap ${left>1?'them':'it'} to swap at the bank.`)}
      else{S.ci++;S.plan=0;drawAll();say(`Everyone has ${n}. Now the ${NM[kind()][1]}.`)}})}
  function finish(left){const q=Q();S.won=true;S.rem=left;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);drawAll();burst(230,400,{n:16,cols:['#ffd23a','#fff0a0']});
    say(`Fair shares: £${Math.floor(q.A/q.N)} each.${left?` £${left} left over can't be shared: that's the remainder.`:''}`);if(S.r>=2)unlock('mloot');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';fly.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:false,won:false,miss:0,ci:0,phase:'deal',plan:0,rem:0,mid:{},each:{},carry:[],qd:[]});q.kinds.forEach((v,j)=>S.mid[v]=q.dg[j]);
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    const bk=el('g',{transform:'translate(66,206)'},scene);el('rect',{x:-48,y:-56,width:96,height:100,rx:8,fill:'#e8d8b8',stroke:'#7a5a3a','stroke-width':3},bk);el('path',{d:'M-56,-54 L0,-84 L56,-54Z',fill:'#c9a24a',stroke:'#7a5a3a','stroke-width':3},bk);
    el('text',{y:-62,'text-anchor':'middle','font-size':13,'font-weight':900,fill:'#3a2418'},bk).textContent='BANK';el('rect',{x:-26,y:-36,width:52,height:40,rx:4,fill:'#3a2e2a'},bk);el('text',{y:30,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},bk).textContent='1 ↔ 10';
    interact(bk,{label:'The bank: swap a leftover',tap:()=>{if(S.busy||S.won)return;if(S.phase==='swap')tapMid(kind());else say('The bank swaps leftovers that won’t go round. Share first, then swap what’s left.')}});
    drawAll();decGo(ui,560,500,'Deal',deal,'Deal');
    say(S.r===0?`Share £${q.A} fairly, biggest first. Tap ${NM[kind()][1]} to give the first pirate a fair share, then Deal.`:`Share £${q.A} between ${q.N}. Start with the ${NM[kind()][1]}.`)}
  W.loot.dbgQ=()=>{const q=Q();return{A:q.A,N:q.N,ci:S.ci,phase:S.phase,mid:S.mid,kind:kind(),r:S.r}};S.r=resumeAt(R.length);load();
}};
