
/* ---------- 2. Dig: hundredths, by zooming into a beach ruler ---------- */
function crabFig(parent,s=1){const g=el('g',{},parent),inner=el('g',{transform:`scale(${s})`},g);
  [-1,1].forEach(d=>{for(let k=0;k<3;k++)el('path',{d:`M${d*12},${4+k*4} q${d*10},${-2} ${d*16},${8}`,stroke:'#d8402a','stroke-width':3,fill:'none','stroke-linecap':'round'},inner);
    el('path',{d:`M${d*14},-4 q${d*10},-10 ${d*14},-18`,stroke:'#e8553a','stroke-width':4,fill:'none','stroke-linecap':'round'},inner);
    el('path',{d:`M${d*28},-22 q${d*8},-6 ${d*4},-14 l${-d*4},8 l${-d*6},-4 q${-d*2},6 ${d*6},10Z`,fill:'#ff6a4a',stroke:'#c0301a','stroke-width':1},inner);
    el('path',{d:`M${d*6},-12 v-12`,stroke:'#e8553a','stroke-width':2.4},inner);el('circle',{cx:d*6,cy:-25,r:4.2,fill:'#fff'},inner);el('circle',{cx:d*6,cy:-25,r:2,fill:'#241a3a'},inner)});
  el('ellipse',{cx:0,cy:2,rx:20,ry:13,fill:'#ff6a4a',stroke:'#c0301a','stroke-width':1.5},inner);el('ellipse',{cx:-6,cy:-3,rx:7,ry:3,fill:'#fff',opacity:.3},inner);
  el('path',{d:'M-6,6 q6,5 12,0',stroke:'#7a1a10','stroke-width':1.8,fill:'none','stroke-linecap':'round'},inner);
  return{g,inner}}
function shellFig(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);el('circle',{r:26,fill:'#fff0a0',opacity:.25},g);
  el('path',{d:'M0,14 L-16,-6 Q-12,-18 0,-18 Q12,-18 16,-6Z',fill:'#ffc0d4',stroke:'#e0809a','stroke-width':1.5},g);for(let k=-2;k<=2;k++)el('path',{d:`M0,14 L${k*6},-17`,stroke:'#e0809a','stroke-width':1.2},g);
  el('rect',{x:-5,y:12,width:10,height:5,rx:2,fill:'#e0809a'},g);return g}
/* a beach ruler from 0 to max (in tenths) that zooms into one tenth to show its hundredths */
function digKit(parent,{x0,x1,yTop,yZoom,max=1,labels=false,target=null,onZoom,label='Crab: drag it along the zoomed ruler'}){
  const g=el('g',{},parent),N=max*10,sw=(x1-x0)/N,top=el('g',{},g),zoomL=el('g',{},g),crabL=el('g',{},g);let z=null,j=5,locked=false,crab=null;
  el('rect',{x:x0-12,y:yTop-20,width:x1-x0+24,height:28,rx:8,fill:'#9a6a40',stroke:'#5a3a22','stroke-width':2},top);
  for(let k=0;k<6;k++)el('path',{d:`M${x0+k*(x1-x0)/6+10},${yTop-14} q30,4 60,0`,stroke:'#7a4a2a','stroke-width':1.5,fill:'none',opacity:.6},top);
  const hi=el('rect',{y:yTop-20,height:28,fill:'#fff0a0',opacity:0},top);
  for(let k=0;k<=N;k++){const x=x0+k*sw,whole=k%10===0;el('line',{x1:x,x2:x,y1:yTop-20,y2:yTop+(whole?14:8),stroke:'#fff4e6','stroke-width':whole?3:2},top);
    if(max===1||whole)decTxt(top,x,yTop+(whole?32:28),fmtH(k*10),{sz:whole?16:14,col:'#fff4e6',weight:whole?700:600});
    else decTxt(top,x,yTop+(k%2?44:28),fmtH(k*10),{sz:13,col:k%5===0?'#fff4e6':'#d8c6e4'})}
  const hits=range(0,N-1).map(s=>{const r=el('rect',{x:x0+s*sw,y:yTop-30,width:sw,height:66,fill:'transparent'},top);interact(r,{label:`Stretch from ${fmtH(s*10)} to ${fmtH(s*10+10)}`,tap:()=>{if(!locked)zoom(s)}});return r});
  const xAtJ=jj=>x0+jj*(x1-x0)/10;
  function zoom(s){z=s;{const avoid=target==null?-1:target-s*10,opts=range(1,9).filter(v=>v!==avoid);j=opts[Math.floor(Math.random()*opts.length)]}SFX.whoosh();SFX.shimmer();hi.setAttribute('x',x0+s*sw);hi.setAttribute('width',sw);hi.setAttribute('opacity',.45);zoomL.innerHTML='';crabL.innerHTML='';
    const a=x0+s*sw,b=a+sw,beam=el('path',{fill:'#fff0a0',opacity:.12},zoomL),ed=el('path',{stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'6 5',fill:'none',opacity:.7},zoomL);
    const lens=el('g',{transform:`translate(${(a+b)/2},${yTop-48})`},zoomL);el('circle',{r:17,fill:'rgba(200,230,255,.18)',stroke:'#c9a24a','stroke-width':4},lens);el('path',{d:'M12,-12 l12,-12',stroke:'#7a4a2e','stroke-width':6,'stroke-linecap':'round'},lens);el('path',{d:'M-6,20 L0,28 L6,20',fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round'},lens);
    const rl=el('g',{opacity:0},zoomL);el('rect',{x:x0-12,y:yZoom-20,width:x1-x0+24,height:28,rx:8,fill:'#b0804a',stroke:'#5a3a22','stroke-width':2},rl);
    for(let k=0;k<=10;k++){const x=xAtJ(k),big=k===0||k===10,mid=k===5;el('line',{x1:x,x2:x,y1:yZoom-20,y2:yZoom+(big?14:mid?10:6),stroke:'#fff4e6','stroke-width':big?3:mid?2.4:1.8},rl);
      if(big)decTxt(rl,x,yZoom+32,fmtH(s*10+k),{sz:17,weight:700});else if(labels)decTxt(rl,x,yZoom+27,fmtH(s*10+k),{sz:13,col:'#d8c6e4'})}
    tween(520,(t)=>{const L=lerp(a,x0,t),R=lerp(b,x1,t),Y=lerp(yTop+8,yZoom-20,t);beam.setAttribute('d',`M${a},${yTop+8} L${b},${yTop+8} L${R},${Y} L${L},${Y}Z`);ed.setAttribute('d',`M${a},${yTop+8} L${L},${Y} M${b},${yTop+8} L${R},${Y}`);rl.setAttribute('opacity',t.toFixed(2))},()=>{
      crab=crabFig(crabL,1);showCrab();popIn(crab.g,.4);onZoom&&onZoom(s)},ease.out)}
  function showCrab(){if(!crab)return;crab.g.setAttribute('transform',`translate(${xAtJ(j)},${yZoom+72})`);ptr.removeAttribute('display');ptr.setAttribute('x1',xAtJ(j));ptr.setAttribute('x2',xAtJ(j))}
  const ptr=el('line',{display:'none',y1:yZoom+8,y2:yZoom+46,stroke:'#ff9a6a','stroke-width':3,'stroke-dasharray':'5 4'},g);
  const dragZ=el('rect',{x:x0-30,y:yZoom+38,width:x1-x0+60,height:60,fill:'transparent'},g);
  const setJ=v=>{v=clamp(v,0,10);if(v===j||z==null)return;j=v;SFX.tick(j);showCrab()};
  const jAt=px=>Math.round((px-x0)/((x1-x0)/10));
  interact(dragZ,{label,down:p=>{if(!locked)setJ(jAt(p.x));return{}},move:p=>{if(!locked)setJ(jAt(p.x))},tap:p=>{if(locked)return;if(!p){setJ(j+1>10?0:j+1);return}setJ(jAt(p.x))}});
  dragZ.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();setJ(j+1)}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();setJ(j-1)}});
  return{g,zoomed:()=>z,value:()=>z==null?null:z*10+j,lock:b=>{locked=b},
    dig(ok,done){const x=xAtJ(j),y=yZoom+72;SFX.crunch();crumbs(x,y+14,{n:14,cols:['#b8a0c8','#8a7090','#d8c6e4']});crab.inner.setAttribute('transform','rotate(-8)');
      later(250,()=>{crab.inner.setAttribute('transform','rotate(8)');crumbs(x,y+14,{n:10,cols:['#b8a0c8','#8a7090']})});
      later(600,()=>{crab.inner.removeAttribute('transform');let f;if(ok){f=shellFig(crabL,x,y+40,1);SFX.chime();burst(x,y+30,{n:14})}else{f=el('g',{transform:`translate(${x},${y+40})`},crabL);el('ellipse',{rx:12,ry:8,fill:'#8a8a9a',stroke:'#5a5a6a','stroke-width':1.5},f);SFX.clonk()}popIn(f,.3);done&&done(x,y)})}}}

W.dig={scene:'beach',
notes:`<p>Hundredths, on a beach ruler. A crab has buried shells along the beach, which runs from 0 to 1 and is marked in tenths. To dig at 0.35 she first taps the stretch it's in (between 0.3 and 0.4); the magnifier zooms that stretch down onto a second ruler, split into 10 hundredths. Then she drags the crab (below the ruler, so her hand doesn't hide it) to the right mark and presses Dig.</p>
<p>Tapping the wrong stretch just zooms in there and shows its ends (0.5 to 0.6), so she can see 0.35 isn't in it. Digging in the wrong place turns up a pebble and says where she dug (0.53), then the crab buries a new shell.</p>
<p>Rounds: 0.35 (hundredths labelled), 0.72, 0.08 (the trap: it's before 0.1, only 8 hundredths), 0.40 (the same place as 0.4, right on a mark), 0.99, and 1.25 on a beach that runs to 2.</p>`,
mount(root){
  const R=[{p:['0.35','0.45','0.65'],lab:1},{p:['0.72','0.28','0.81']},{p:['0.08','0.04','0.06']},{p:['0.40','0.70','0.20']},{p:['0.99','0.91','0.95']},{p:['1.25','1.62','1.07'],max:2}];
  const S={r:0,busy:false,won:false,pi:{}};
  const qL=el('g',{},root),board=el('g',{},root),ui=el('g',{},root);let kit=null;
  const dotG=dotChar(ui,170,44,12);
  const st=navStone({label:'Next shell',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this shell again',onTap:()=>load()});
  const goB=decGo(ui,540,492,'Dig here',dig,'Dig');
  const Q=()=>{const q=R[S.r],s=q.p[(S.pi[S.r]||0)%q.p.length];return{s,v:toH(s),max:q.max||1,lab:q.lab}};
  const parts=(q,done)=>{if(!done)return[['t','Dig at'],['w',q.s]];const t=Math.floor(q.v/10)%10,h=q.v%10,w=Math.floor(q.v/100);
    if(/\.\d0$/.test(q.s))return[['w',q.s],['o','='],['w',fmtH(q.v)],['o','='],['w',t],['t','tenths']];
    if(h&&!t&&!w)return[['w',q.s],['o','='],['w',h],['t','hundredths']];
    return[['w',q.s],['o','='],...(w?[['w',w],['o','+']]:[]),['w',t],['t','tenths +'],['w',h],['t','hundredths']]};
  function dig(){if(S.busy||S.won)return;const q=Q(),v=kit.value();if(v==null){say(`First tap the stretch of beach where ${q.s} is.`);return}
    S.busy=true;kit.lock(true);goB.style.display='none';const ok=v===q.v;
    kit.dig(ok,(x,y)=>{if(ok)win(q);else{floatText(x,y-70,fmtH(v),{col:'#ff9ec0',size:22});
      say(`A pebble! You dug at ${fmtH(v)}, not ${q.s}. The crab buries a new shell…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(2600,load)}})}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();decQ(qL,parts(q,true),true,dotG);dotG.mood('happy');
    const t=Math.floor(q.v/10)%10,h=q.v%10;
    say(/\.\d0$/.test(q.s)?`${q.s} is ${q.v} hundredths: exactly the same place as ${fmtH(q.v)}!`:q.v<10?`${q.s} is only ${h} hundredths: not even one tenth!`:q.v===99?'0.99: just one hundredth short of 1.':q.v>100?`Found it! 1 whole, ${t} tenths and ${h} hundredths.`:`Found it! ${q.s} is ${t} tenths and ${h} hundredths.`);
    if(q.v<10)unlock('hundredths');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='none';
    kit=digKit(board,{x0:50,x1:550,yTop:150,yZoom:350,max:q.max,labels:!!q.lab,target:q.v,onZoom:s=>{goB.style.display='';const a=fmtH(s*10),b=fmtH(s*10+10),inIt=q.v>=s*10&&q.v<=s*10+10;
      say(inIt?`Zoomed in: ${a} to ${b}, split into 10 hundredths. Drag the crab to ${q.s}, then Dig.`:`This stretch runs from ${a} to ${b}. Is ${q.s} in here? Tap another stretch.`)}});
    decQ(qL,parts(q),false,dotG);dotG.mood('');
    say(S.r===0?`A crab buried a shell at ${q.s}. Which stretch of beach is it in? Tap between two marks.`:/\.\d0$/.test(q.s)?`Dig at ${q.s}. It's right on a mark: tap the stretch on either side.`:q.max===2?`This beach runs to 2. Dig at ${q.s}: tap its stretch first.`:`Dig at ${q.s}. Tap the stretch it's in.`)}
  S.r=resumeAt(R.length);load();
}};
