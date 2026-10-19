
/* ---------- 1. Rock: tenths, snapped off sticks of seaside rock ---------- */
function drawRock(parent,x,y,len,tw,h){const g=el('g',{},parent);if(len<1)return g;const n=Math.round(len/tw);
  el('rect',{x,y,width:len,height:h,rx:Math.min(h/2,len/2),fill:'#ff8fb0',stroke:'#d8487a','stroke-width':1.5},g);
  for(let k=0;k<n;k++)if(k%2)el('rect',{x:x+k*tw,y:y+1,width:tw,height:h-2,fill:'#ffb8cc'},g);
  for(let k=0;k<n;k++)el('path',{d:`M${(x+k*tw+tw*.38).toFixed(1)},${y+h-6} L${(x+k*tw+tw*.62).toFixed(1)},${y+6}`,stroke:'#fff',opacity:.35,'stroke-width':2,'stroke-linecap':'round'},g);
  el('rect',{x:x+5,y:y+h*.12,width:Math.max(0,len-10),height:h*.14,rx:h*.07,fill:'#fff',opacity:.3},g);
  for(let k=1;k<n;k++)el('line',{x1:x+k*tw,x2:x+k*tw,y1:y,y2:y+h,stroke:'#8a1a40','stroke-width':2.6},g);
  return g}
/* sticks of rock, each one whole scored into ten tenths, and a knife on a rail below them */
function rockKit(parent,{x0,y,L,sticks=1,h=34,gap=20,railY,label='Knife: slide it along to choose where to snap'}){
  const g=el('g',{},parent),tw=L/10,N=sticks*10,stickL=el('g',{},g),selL=el('g',{},g),knL=el('g',{},g),rail=el('g',{},g),pieceL=el('g',{},parent);
  const sx=i=>x0+i*(L+gap),end=sx(sticks-1)+L;
  const xAt=k=>{if(k<=0)return x0;const i=Math.ceil(k/10)-1;return sx(i)+(k-i*10)*tw};
  const kAt=px=>{let best=0,bd=1e9;for(let k=0;k<=N;k++){const d=Math.abs(xAt(k)-px);if(d<bd){bd=d;best=k}}return best};
  let k=0,taken=0,locked=false;
  function drawSticks(){stickL.innerHTML='';for(let i=0;i<sticks;i++){const a=Math.max(0,taken-i*10);if(a<10)drawRock(stickL,sx(i)+a*tw,y,(10-a)*tw,tw,h)}}
  el('rect',{x:x0-16,y:railY-5,width:end-x0+32,height:10,rx:5,fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':1.5},rail);
  for(let i=0;i<sticks;i++)for(let j=0;j<=10;j++)el('line',{x1:sx(i)+j*tw,x2:sx(i)+j*tw,y1:railY-12,y2:railY-6,stroke:'#fff4e6','stroke-width':1.5,opacity:.45},rail);
  const blade=el('g',{},knL);el('path',{d:'M-10,-44 h20 v10 l-10,12 l-10,-12Z',fill:'#dfe6f0',stroke:'#8a96aa','stroke-width':1.5},blade);el('rect',{x:-6,y:-60,width:12,height:17,rx:4,fill:'#7a4a2e'},blade);
  el('line',{x1:0,x2:0,y1:-20,y2:h+8,stroke:'#dfe6f0','stroke-width':2,'stroke-dasharray':'4 3',opacity:.85},blade);
  const knob=el('g',{},rail);el('circle',{r:17,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},knob);el('path',{d:'M-6,-5 l-5,5 l5,5 M6,-5 l5,5 l-5,5',stroke:'#7a4a2e','stroke-width':2.2,fill:'none','stroke-linecap':'round'},knob);
  const stem=el('line',{stroke:'#c9a24a','stroke-width':2,opacity:.6},rail);
  function show(){const x=xAt(k);blade.setAttribute('transform',`translate(${x},${y})`);knob.setAttribute('transform',`translate(${x},${railY})`);stem.setAttribute('x1',x);stem.setAttribute('x2',x);stem.setAttribute('y1',y+h+8);stem.setAttribute('y2',railY-17);
    selL.innerHTML='';for(let i=0;i<sticks;i++){const a=clamp(k-i*10,0,10);if(a>0)el('rect',{x:sx(i)-3,y:y-4,width:a*tw+6,height:h+8,rx:h/2+3,fill:'#fff0a0',opacity:.22,stroke:'#fff0a0','stroke-width':2.5},selL)}}
  const set=v=>{v=clamp(v,0,N);if(v===k)return;k=v;SFX.tick(k%10);show()};
  const hit=el('rect',{x:x0-30,y:railY-34,width:end-x0+60,height:68,fill:'transparent'},rail);
  interact(rail,{label,down:p=>{if(!locked)set(kAt(p.x));return{}},move:p=>{if(!locked)set(kAt(p.x))},tap:p=>{if(locked)return;if(!p){set(k+1>N?0:k+1);return}set(kAt(p.x))}});
  rail.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();set(k+1)}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();set(k-1)}});
  drawSticks();show();
  return{g,tw,get:()=>k,set:v=>{k=clamp(v,0,N);show()},lock:b=>{locked=b;knL.style.opacity=b?0:1;rail.style.opacity=b?.5:1},
    /* break off the first k tenths and fly them to (tx,ty); the piece is handed back */
    snap(tx,ty,done){const kk=k,pg=el('g',{},pieceL),inner=el('g',{},pg);for(let i=0;i<sticks;i++){const a=clamp(kk-i*10,0,10);if(a>0)drawRock(inner,sx(i),y,a*tw,tw,h)}
      taken=kk;drawSticks();selL.innerHTML='';SFX.snap(1.2);burst(xAt(kk),y+h/2,{n:8,cols:['#ff8fb0','#fff4f8','#fff0a0'],spread:40});
      const cx=(x0+xAt(kk))/2,cy=y+h/2;tween(700,(t,p)=>pg.setAttribute('transform',`translate(${((tx-cx)*t).toFixed(1)},${((ty-cy)*t-Math.sin(p*Math.PI)*60).toFixed(1)})`),()=>done&&done(pg),ease.inOut)},
    mend(pg){if(pg)pg.remove();taken=0;drawSticks();show();SFX.glue&&SFX.glue()},xAt}}

W.rock={scene:'sea',
notes:`<p>The Decimal Isles start here, and so does Dot: the little glowing spark who <i>is</i> the decimal point. Wholes sit on Dot's left, pieces on Dot's right. Every decimal in this world is drawn with Dot glowing in it.</p>
<p>Tenths, in a seaside rock shop. Each stick of rock is one whole, scored into 10 equal pieces. The customer's order is in the box at the top; she slides the knife along the rail (below the rock, so her hand doesn't hide it) to the right groove and presses Snap. The piece goes to the customer and writes itself out: 0.7, with Dot between the wholes and the tenths. Wrong, and the customer says what she actually snapped (0.4), the rock sticks back together and a new customer comes.</p>
<p>Rounds: 3 tenths (in words), 0.7, 0.5 (half a stick), 1.4 (two sticks: one whole and 4 tenths), then adding: 0.3 + 0.4, and 0.8 + 0.4, which needs more than one stick: ten tenths make a whole, so 1.2.</p>`,
mount(root){
  const R=[{p:[3,6,2],words:1},{p:[7,4,9]},{p:[5]},{p:[14,13,16],n:2},{p:[[3,4],[2,5],[4,4]]},{p:[[8,4],[7,5],[6,6]],n:2}];
  const S={r:0,busy:false,won:false,pi:{}};
  const qL=el('g',{},root),shop=el('g',{},root),folk=el('g',{},root),bench=el('g',{},root),show=el('g',{},root),ui=el('g',{},root);
  /* the shop: awning, counter */
  for(let i=0;i<12;i++)el('path',{d:`M${i*50},84 h50 v26 q-25,14 -50,0Z`,fill:i%2?'#fff4e6':'#ff6f91'},shop);el('rect',{x:0,y:80,width:600,height:8,fill:'#c0405a'},shop);
  [14,586].forEach(x=>el('rect',{x:x-5,y:84,width:10,height:180,fill:'#8a5a32'},shop));
  const sign=el('g',{transform:'translate(84,140)'},shop);el('rect',{x:-50,y:-16,width:100,height:30,rx:8,fill:'#3a2860',stroke:'#ffc04d','stroke-width':2},sign);el('text',{y:5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#ffe08a'},sign).textContent='Rock shop';
  const keeper=creature(folk,{x:76,y:226,r:26,i:4,label:'The rock maker',hat:'chef'});
  const dot=dotChar(folk,178,44,12);
  let cust=null;
  el('rect',{x:0,y:250,width:600,height:62,fill:'#b0743a'},bench);el('rect',{x:0,y:250,width:600,height:6,fill:'#d89a5a'},bench);
  el('rect',{x:0,y:312,width:600,height:96,fill:'#7a4a2a'},bench);el('rect',{x:0,y:404,width:600,height:8,fill:'#5a321d'},bench);
  el('rect',{x:-700,y:412,width:2000,height:300,fill:'#5a3a2a'},bench);for(let y=412;y<620;y+=22)el('line',{x1:-700,x2:1300,y1:y,y2:y,stroke:'#3e2618','stroke-width':2.5},bench);for(let k=0;k<24;k++)el('line',{x1:k*90-560+(k%2)*30,x2:k*90-60+(k%2)*30,y1:412+(k%3)*22,y2:434+(k%3)*22,stroke:'#3e2618','stroke-width':2},bench);
  const kitL=el('g',{},bench);let kit=null,piece=null;
  const st=navStone({label:'Next customer',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this order again',onTap:()=>load()});
  const goB=decGo(ui,530,456,'Snap: break the rock off',snap,'Snap');
  const Q=()=>{const q=R[S.r],it=q.p[(S.pi[S.r]||0)%q.p.length];return Array.isArray(it)?{add:it,t:it[0]+it[1],n:q.n||1}:{t:it,n:q.n||1,words:q.words}};
  const T=t=>fmtH(t*10);
  function parts(q,done){if(q.add)return[['w',T(q.add[0])],['o','+'],['w',T(q.add[1])],['o','='],done?['w',T(q.t)]:['o','?']];
    if(done)return q.t>=10?[['w',T(q.t)],['o','='],['w',Math.floor(q.t/10)],['t',q.t>=20?'wholes +':'whole +'],['w',q.t%10],['t','tenths']]:[['w',T(q.t)],['o','='],['w',q.t],['t','tenths']];
    return q.words?[['t','Snap off'],['w',q.t],['t','tenths']]:[['t','Snap off'],['w',T(q.t)]]}
  function snap(){if(S.busy||S.won)return;const q=Q(),k=kit.get();if(!k){say('Slide the knife along the gold rail first.');return}
    S.busy=true;goB.style.display='none';kit.lock(true);
    if(k===q.t){kit.snap(300,150,pg=>{piece=pg;win(q)})}
    else kit.snap(cust.x-10,cust.y-40,pg=>{SFX.wrong();cust.mood('oh');shake(3);const said=`That's ${T(k)}${q.add?'':''}, not ${T(q.t)}!`;floatText(cust.x-40,cust.y-70,said,{col:'#ff9ec0',size:18});
      say(`That's ${k} tenths: ${T(k)}, not ${T(q.t)}. Here comes a new customer…`);
      later(1800,()=>{kit.mend(pg);S.pi[S.r]=(S.pi[S.r]||0)+1;later(900,load)})})}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();starterQ(qL,parts(q,true),true);cust.mood('happy');cust.hop(16);
    const n=decNum(show,300,214,T(q.t),{sz:46,col:'#fff4e6'}),dt=n.items.find(i=>i.ch==='.');n.g.setAttribute('opacity',0);
    dot.fly(dt?dt.cx:300,232,700,()=>{dot.g.setAttribute('opacity',0);n.g.setAttribute('opacity',1);popIn(n.g,.6);SFX.sparkle();
      n.items.forEach(it=>{if(it.ch==='.')return;const before=!dt||it.cx<dt.cx;el('text',{x:it.cx,y:250,'text-anchor':'middle','font-size':12,'font-weight':700,fill:before?'#ffc04d':'#ff9ec0'},show).textContent=before?(q.t>=20?'wholes':'whole'):'tenths'})},60);
    say(q.add?(q.t>10?`${q.t} tenths! Ten tenths make a whole stick, so it's ${T(q.t)}.`:`${q.add[0]} tenths and ${q.add[1]} tenths make ${q.t} tenths: ${T(q.t)}.`)
      :q.t>=10?`${T(q.t)}! One whole on Dot's left, ${q.t%10} tenths on the right.`:q.t===5?`${T(q.t)} is 5 tenths: exactly half a stick!`:`${T(q.t)}! No wholes on Dot's left, ${q.t} tenths on the right.`);if(S.r===5||(q.add&&q.t>10))unlock('tenths');
    later(1300,()=>{piece&&tween(600,(t,p)=>piece.setAttribute('opacity',(1-p).toFixed(2)),null)});later(1600,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';show.innerHTML='';kitL.innerHTML='';folk.querySelectorAll('.cust').forEach(c=>c.remove());const q=Q();
    Object.assign(S,{busy:false,won:false});piece=null;st.ready(false);navDots(R.length,S.r);goB.style.display='';
    kit=q.n===2?rockKit(kitL,{x0:40,y:262,L:250,sticks:2,h:34,gap:20,railY:356}):rockKit(kitL,{x0:100,y:262,L:400,h:36,railY:356});
    const ci=[0,3,5,7,4,1][(S.r+(S.pi[S.r]||0))%6];cust=creature(folk,{x:528,y:226,r:26,i:ci,label:'The customer'});cust.g.classList.add('cust');
    dot.g.removeAttribute('opacity');decQ(qL,parts(q),false,dot);keeper.mood('');
    say(q.words?`Each stick of rock is one whole, cut into 10 tenths. Slide the knife to ${q.t} tenths, then Snap.`
      :q.add?(q.t>10?`${T(q.add[0])} for one friend, ${T(q.add[1])} for the other. Snap off enough for both friends.`:`${T(q.add[0])} for one friend, ${T(q.add[1])} for the other. Snap off enough for both friends.`)
      :q.n===2?`Two sticks, each one whole. Snap off ${T(q.t)}.`:S.r===1?`Meet Dot, the glowing decimal point! ${T(q.t)} means no wholes and ${q.t} tenths. Snap it off.`:`Snap off ${T(q.t)}, please.`)}
  S.r=resumeAt(R.length);load();
}};
