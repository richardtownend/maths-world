/* ---------- 6. River: map scale (1 square on the map = 10 m in real life) ---------- */
const halfTxt=n=>Number.isInteger(n)?String(n):`${Math.floor(n)||''}½`;
/* the map: parchment, a grid of squares, and whatever's drawn on it */
function riverMap(parent,{x0=56,y0=124,cs=40,cols=10,rows=7}={}){const g=el('g',{},parent);
  el('rect',{x:x0-16,y:y0-16,width:cols*cs+32,height:rows*cs+32,rx:12,fill:'#d8c49a',stroke:'#8a6a3a','stroke-width':5},g);
  for(let c=0;c<=cols;c++)el('line',{x1:x0+c*cs,x2:x0+c*cs,y1:y0,y2:y0+rows*cs,stroke:'#8a6a3a','stroke-width':1,opacity:.45},g);
  for(let r=0;r<=rows;r++)el('line',{x1:x0,x2:x0+cols*cs,y1:y0+r*cs,y2:y0+r*cs,stroke:'#8a6a3a','stroke-width':1,opacity:.45},g);
  return{g,x0,y0,cs,cols,rows}}
/* a long measuring tape: drag the gold handle; metres are marked along it */
function tape(parent,{x=60,y=470,w=400,max=100,step=5,label='Bridge length: drag the handle',onChange}){const g=el('g',{},parent);let v=0,locked=false;const X=m=>x+m/max*w;
  el('rect',{x:x-8,y:y-16,width:w+16,height:32,rx:8,fill:'#ffe9a8',stroke:'#c9a24a','stroke-width':2},g);
  const fill=el('rect',{x,y:y-10,width:0,height:20,rx:4,fill:'#c98a3a',opacity:.5},g);
  const lab=max<=100?10:max<=200?20:50;for(let m=0;m<=max;m+=step){const big=m%lab===0;el('line',{x1:X(m),x2:X(m),y1:y-16,y2:y-16+(big?12:6),stroke:'#7a5a2a','stroke-width':big?2:1},g);
    if(big)el('text',{x:X(m),y:y+12,'text-anchor':'middle','font-size':10.5,'font-weight':700,fill:'#5a3a1a'},g).textContent=m}
  el('text',{x:x+w+14,y:y+5,'font-size':12,'font-weight':700,fill:'#fff4e6'},g).textContent='m';
  const hd=el('g',{},g);el('path',{d:'M0,-30 l-10,-14 h20Z',fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2},hd);el('line',{x1:0,x2:0,y1:-30,y2:16,stroke:'#ffc04d','stroke-width':3},hd);
  const vt=el('text',{y:-50,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#fff4e6'},hd);
  function draw(){hd.setAttribute('transform',`translate(${X(v)},${y})`);fill.setAttribute('width',X(v)-x);vt.textContent=`${v} m`}
  const set=m=>{m=clamp(Math.round(m/step)*step,0,max);if(m===v)return;v=m;SFX.tick(Math.round(v/step)%10);draw();onChange&&onChange(v)};
  const hit=el('rect',{x:x-14,y:y-60,width:w+28,height:80,fill:'transparent'},g);
  interact(hit,{label,down:p=>{if(!locked)set((p.x-x)/w*max);return{}},move:p=>{if(!locked)set((p.x-x)/w*max)},tap:p=>{if(!locked&&p)set((p.x-x)/w*max)}});
  hit.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();set(v+step)}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();set(v-step)}});
  draw();return{g,get:()=>v,lock:b=>{locked=b;g.setAttribute('opacity',b?.6:1)}}}

W.river={scene:'river',
notes:`<p>Map scale. Kai has a map of the river, and the key says 1 square on the map = 10 m in real life. The crossing is marked on the map; she works out how long the bridge must be in real metres and sets it on the measuring tape, then presses Build. The map rolls away and the real river appears: the bridge reaches the far bank, or falls short into the water, or is too long to fit between the trees.</p>
<p>Rounds: 1 square = 10 m and 3 squares; 1 square = 5 m and 4 squares; 2½ squares at 10 m (half a square is 5 m); then turned round: the treehouse is 60 m along the path and 1 square = 20 m, so draw the path on the map (3 squares). Then: the real river is 40 m wide and it's 4 squares on the map, so what's 1 square worth? Last, 1 square = 25 m and 4 squares (100 m). A wrong try gives a new map.</p>`,
mount(root){
  const R=[{k:'bridge',p:[[10,3],[10,4],[10,2]],max:100},{k:'bridge',p:[[5,4],[5,6],[5,3]],max:50},{k:'bridge',p:[[10,2.5],[10,3.5],[10,1.5]],max:100},
    {k:'draw',p:[[20,60],[10,70],[25,100]]},{k:'scale',p:[[4,40],[3,60],[5,25]]},{k:'bridge',p:[[25,4],[50,3],[20,6]],max:200}];
  const S={r:0,busy:false,won:false,pi:{},end:0,pick:null};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let map=null,tp=null,ctl=null,pathL=null;
  const st=navStone({label:'Next map',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this map again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Build the bridge',build,'Build');
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length];return q.k==='bridge'?{k:'bridge',sc:v[0],n:v[1],max:q.max,real:v[0]*v[1]}:q.k==='draw'?{k:'draw',sc:v[0],real:v[1],n:v[1]/v[0]}:{k:'scale',n:v[0],real:v[1],sc:v[1]/v[0]}};
  const parts=(q,done)=>q.k==='bridge'?(done?[['w',`${halfTxt(q.n)} squares`],['o','='],['w',`${q.real} m`]]:[['t','1 square'],['o','='],['w',`${q.sc} m`],['t',', bridge'],['o','='],['o','?']])
    :q.k==='draw'?[['w',`${q.real} m`],['o','='],done?['w',`${q.n} squares`]:['o','?'],...(done?[]:[['t','squares']]),['t',`(1 square = ${q.sc} m)`]]
    :[['w',`${q.n} squares`],['o','='],['w',`${q.real} m`],['t',', 1 square'],['o','='],done?['w',`${q.sc} m`]:['o','?']];
  /* the river on the map: a band n squares wide crossing it top to bottom, with the crossing marked */
  function drawRiver(q,show=true){const {x0,y0,cs,rows}=map,L=x0+3*cs,Rr=L+q.n*cs,yc=y0+3.5*cs,g=el('g',{},map.g);
    const wav=(x,d)=>{let s=`M${x},${y0}`;for(let r=0;r<rows;r++){const ya=y0+r*cs,yb=ya+cs;s+=` Q${x+(r%2?d:-d)},${ya+cs/2} ${x},${yb}`}return s};
    const lp=wav(L,0),rp=wav(Rr,0);el('path',{d:`${lp} L${Rr},${y0+rows*cs} ${rp.replace('M','L').split(' ').reverse().join(' ')}`,fill:'#5a9ad8',opacity:0},g);
    el('rect',{x:L,y:y0,width:Rr-L,height:rows*cs,fill:'#5a9ad8',opacity:.85},g);[lp,rp].forEach(d=>el('path',{d,fill:'none',stroke:'#3a6a9a','stroke-width':3},g));
    for(let i=0;i<4;i++)el('path',{d:`M${L+6},${y0+30+i*70} q${(Rr-L)/4},-6 ${(Rr-L)/2-6},0 t${(Rr-L)/2-6},0`,stroke:'#cfe6ff','stroke-width':2,fill:'none',opacity:.6},g);
    for(let c=0;c<=map.cols;c++){const x=x0+c*cs;if(x>L-1&&x<Rr+1)el('line',{x1:x,x2:x,y1:y0,y2:y0+rows*cs,stroke:'#e8f2ff','stroke-width':1.2,opacity:.55},g)}
    for(let r=0;r<=rows;r++)el('line',{x1:L,x2:Rr,y1:y0+r*cs,y2:y0+r*cs,stroke:'#e8f2ff','stroke-width':1.2,opacity:.55},g);
    if(show){el('line',{x1:L,x2:Rr,y1:yc,y2:yc,stroke:'#7a3a1e','stroke-width':3,'stroke-dasharray':'8 6'},g);for(let x=L;x<=Rr+.5;x+=cs)el('line',{x1:x,x2:x,y1:yc-7,y2:yc+7,stroke:'#7a3a1e','stroke-width':3},g);[L,Rr].forEach(x=>{el('line',{x1:x,x2:x,y1:yc,y2:yc-26,stroke:'#5a3a1a','stroke-width':3},g);el('path',{d:`M${x},${yc-26} l14,5 l-14,5Z`,fill:'#e23a3a'},g)});
      el('text',{x:(L+Rr)/2,y:yc+24,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#3a2418'},g).textContent='bridge here'}
    return{L,Rr,yc}}
  function key(q){const k=el('g',{transform:'translate(474,112) scale(1.1)'},map.g);el('rect',{width:116,height:30,rx:6,fill:'#fff4e6',stroke:'#8a6a3a','stroke-width':1.5},k);
    el('rect',{x:8,y:7,width:16,height:16,fill:'none',stroke:'#3a2418','stroke-width':1.5},k);el('text',{x:30,y:20,'font-size':12.5,'font-weight':700,fill:'#3a2418'},k).textContent=q.k==='scale'?'= ? m':`= ${q.sc} m`}
  function build(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='scale'){if(S.pick==null){say('Tap the card for what 1 square is worth, then Check.');return}S.busy=true;goB.style.display='none';
      later(500,()=>{if(S.pick===q.sc)win(q,`${q.real} m ÷ ${q.n} squares = ${q.sc} m. Each square on this map is ${q.sc} m in real life.`);else miss(S.pick*q.n===q.real?'':`If 1 square were ${S.pick} m, ${q.n} squares would be ${S.pick*q.n} m, not ${q.real} m.`)});return}
    if(q.k==='draw'){if(!S.end){say('Drag along the path from Kai to draw it on the map, then Walk.');return}S.busy=true;goB.style.display='none';
      const {x0,cs}=map,sx=x0+cs,yy=map.y0+5.5*cs,tx=sx+q.n*cs,k=kaiFig(map.g,.4,'#9a6cff');k.put(sx,yy-14);
      const th=el('g',{transform:`translate(${tx},${yy})`},map.g);el('rect',{x:-3,y:-36,width:6,height:36,fill:'#6a4a32'},th);el('path',{d:'M-16,-36 L0,-52 L16,-36Z',fill:'#c9413a'},th);el('rect',{x:-12,y:-36,width:24,height:14,fill:'#c98a5a'},th);popIn(th,.3);
      tween(1200,t=>k.put(sx+S.end*cs*t,yy-14),()=>{if(S.end===q.n)win(q,`${q.real} m ÷ ${q.sc} m = ${q.n} squares. Kai walked right to the treehouse!`);
        else miss(`Your path is ${halfTxt(S.end)} squares: ${halfTxt(S.end)} × ${q.sc} = ${S.end*q.sc} m, not ${q.real} m.`)},ease.inOut);return}
    const L=tp.get();if(!L){say('Drag the gold handle along the tape to set the bridge length, then Build.');return}
    S.busy=true;tp.lock(true);goB.style.display='none';
    /* the map rolls away; the real river appears */
    tween(500,t=>map.g.setAttribute('opacity',(1-t).toFixed(2)),()=>{map.g.style.display='none';real(q,L)})}
  function real(q,L){const sv=el('g',{},board),gap=q.real,pxm=260/gap,X1=130,X2=X1+gap*pxm,Y=320;
    el('rect',{x:40,y:110,width:420,height:300,rx:12,fill:'#2a4a7a'},sv);el('rect',{x:40,y:Y+30,width:420,height:60,fill:'#3a7ac0'},sv);
    for(let i=0;i<5;i++)el('path',{d:`M${X1+10+i*50},${Y+50} q10,-5 20,0`,stroke:'#cfe6ff','stroke-width':2,fill:'none',opacity:.6},sv);
    el('path',{d:`M40,${Y} H${X1} L${X1+6},${Y+90} H40Z`,fill:'#5a8a4a'},sv);el('path',{d:`M${X2},${Y} H460 V${Y+90} H${X2-6}Z`,fill:'#5a8a4a'},sv);
    [[70,1],[X2+16,1],[X2+70,.8]].forEach(([x,s])=>{if(x>455)return;el('rect',{x:x-4,y:Y-56*s,width:8,height:56*s,fill:'#6a4a32'},sv);el('circle',{cx:x,cy:Y-64*s,r:22*s,fill:'#3a7a4a'},sv)});
    el('text',{x:(X1+X2)/2,y:Y+76,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff4e6'},sv).textContent='the real river';
    const br=el('rect',{x:X1,y:Y-10,width:0,height:10,rx:2,fill:'#c98a3a',stroke:'#7a4a1e','stroke-width':1.5},sv),len=L*pxm,stop=Math.min(len,X2+16-X1);
    SFX.whoosh();tween(1000,t=>br.setAttribute('width',(stop*t).toFixed(1)),()=>{
      if(L===gap){const k=kaiFig(sv,.42,'#9a6cff');k.put(X1-30,Y-14);tween(1300,t=>k.put(X1-30+(gap*pxm+60)*t,Y-14),()=>win(q,`${halfTxt(q.n)} squares × ${q.sc} m = ${q.real} m. The bridge fits exactly!`),ease.inOut);return}
      if(L>gap){SFX.clonk();shake(6);br.setAttribute('fill','#c0503a');const bk=el('g',{transform:`translate(${X1+stop},${Y-5})`},sv);el('path',{d:'M0,-16 L4,-5 L16,-6 L7,2 L12,14 L0,6 L-12,14 L-7,2 L-16,-6 L-4,-5Z',fill:'#fff0a0',stroke:'#e8413e','stroke-width':2},bk);popIn(bk,.2);
        tween(500,t=>br.setAttribute('transform',`rotate(${(-8*Math.sin(t*Math.PI)).toFixed(1)} ${X1} ${Y-5})`));miss(`${L} m is too long: it won’t fit between the trees. On the map it’s ${halfTxt(q.n)} squares of ${q.sc} m.`);return}
      tween(700,t=>br.setAttribute('transform',`rotate(${(40*t).toFixed(1)} ${X1} ${Y-5})`),()=>{SFX.splash?SFX.splash():SFX.plop();drops(X1+len*.8,Y+30,10);miss(`${L} m is too short: splash! On the map it’s ${halfTxt(q.n)} squares of ${q.sc} m.`)},ease.in)},ease.inOut)}
  function miss(msg){SFX.wrong();say((msg?msg+' ':'')+'A new map…');S.pi[S.r]=(S.pi[S.r]||0)+1;S.fresh=true;later(4400,load)}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();kaiWin(guide);decQ(qL,parts(q,true),true,guide);say(msg);burst(300,300,{n:16,cols:['#9a6cff','#fff0a0','#5a9ad8']});
    if(S.r>=2)unlock('mapscale');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';if(ctl)ctl.remove();const q=Q();Object.assign(S,{busy:false,won:false,end:0,pick:null});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);
    ctl=el('g',{},ui);map=riverMap(board);if(S.fresh){const nb=el('g',{transform:'translate(256,104)'},map.g);el('rect',{x:-58,y:-17,width:116,height:32,rx:16,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2},nb);el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#3a2418'},nb).textContent='New map!';popIn(nb,.3)}goB.querySelector('text').textContent=q.k==='draw'?'Walk':q.k==='scale'?'Check':'Build';
    if(q.k==='bridge'){drawRiver(q);key(q);tp=tape(ctl,{max:q.max})}
    else if(q.k==='scale'){drawRiver(q);key(q);const rs=el('g',{transform:'translate(250,96)'},map.g);
      const opts=[q.sc,q.real,q.sc*2].filter((v,i,a)=>a.indexOf(v)===i);while(opts.length<3)opts.push(q.sc+5);opts.sort(()=>Math.random()-.5);const cl=el('g',{},ctl);
      opts.forEach((o,i)=>ratioCard(cl,540,180+i*80,`${o} m`,{w:100,h:56,sub:'per square',label:`Scale card ${o} m`,onTap:c=>{if(S.busy||S.won)return;S.pick=o;SFX.pop(1.1);pickCard(cl,c)}}))}
    else{key(q);const {x0,cs}=map,sx=x0+cs,yy=map.y0+5.5*cs;pathL=el('g',{},map.g);
      el('path',{d:`M${x0},${yy+12} H${x0+map.cols*cs}`,stroke:'#b8a070','stroke-width':22,opacity:.5},map.g);
      const k=kaiFig(map.g,.4,KAI_GREY);k.put(sx,yy-14);const drawP=()=>{pathL.innerHTML='';if(!S.end)return;el('line',{x1:sx,x2:sx+S.end*cs,y1:yy,y2:yy,stroke:'#c9413a','stroke-width':5,'stroke-linecap':'round'},pathL);
        el('circle',{cx:sx+S.end*cs,cy:yy,r:8,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2},pathL);el('text',{x:sx+S.end*cs,y:yy+28,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},pathL).textContent=`${halfTxt(S.end)} squares`};
      const hit=el('rect',{x:x0,y:yy-40,width:map.cols*cs,height:80,fill:'transparent'},map.g),setE=p=>{const v=clamp(Math.round((p.x-sx)/cs*2)/2,0,8.5);if(v!==S.end){S.end=v;SFX.tick(v*2%10);drawP()}};
      interact(hit,{label:'Path on the map: drag along it',down:p=>{if(!S.busy)setE(p);return{}},move:p=>{if(!S.busy)setE(p)},tap:p=>{if(!S.busy&&p)setE(p)}});
      hit.addEventListener('keydown',e=>{if(S.busy)return;if(e.key==='ArrowRight'){e.preventDefault();S.end=Math.min(8.5,S.end+.5);drawP()}if(e.key==='ArrowLeft'){e.preventDefault();S.end=Math.max(0,S.end-.5);drawP()}})}
    decQ(qL,parts(q,false),false,guide);
    say((S.fresh?'A new river: count again! ':'')+(S.r===0?`On the map, 1 square is ${q.sc} m. How long is the real bridge? Set the tape, then Build.`
      :q.k==='bridge'&&!Number.isInteger(q.n)?'Look where the crossing ends! How long is the real bridge?'
      :q.k==='bridge'?`New key: 1 square = ${q.sc} m. How long is the bridge?`
      :q.k==='draw'?`Turned round! The treehouse is ${q.real} m away. Draw the path from Kai, then Walk.`
      :`Turned round! The river is ${q.real} m wide. What is 1 square worth?`));S.fresh=false}
  W.river.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
