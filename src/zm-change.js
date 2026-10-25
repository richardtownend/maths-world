/* ---------- 3. Counting up change, the shopkeeper's way ---------- */
W.change={scene:'cove',
notes:`<p>Giving change by counting up, the way shopkeepers do, instead of taking away. A strip runs from the price to the money paid, with a mark at every whole pound. She taps coins from the till and they line up along the strip from the price, each one as long as it's worth: from £3.60, a 20p and two 10ps reach the £4 mark, then a £1 reaches £5. Check: if the coins finish exactly on the flag, that's the change. Too short or past the flag, a new customer.</p>`,
mount(root){
  const R=[
    {v:[[60,100],[70,100],[45,100]]},
    {v:[[360,500],[440,500],[320,500]]},
    {v:[[275,500],[185,500],[365,500]]},
    {v:[[720,1000],[640,1000],[870,1000]]},
    {v:[[145,200],[335,500],[155,200]]},
    {v:[[1350,2000],[1280,2000],[1460,2000]]}];
  const S={r:0,busy:false,won:false,pi:{},laid:[]};
  const scene=el('g',{},root),strip=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  const st=navStone({label:'Next customer',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this customer again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],[p,g]=rr.v[(S.pi[S.r]||0)%rr.v.length];return{p,g,d:g-p}};
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const parts=(q,done)=>[['t','change'],['o','='],done?['w',fmtP(q.d)]:['o','?']];
  const X0=56,W0=440,Y=300;
  function draw(){strip.innerHTML='';const q=Q(),u=W0/q.d,over=Math.max(0,sum(S.laid)-q.d);
    el('rect',{x:X0,y:Y,width:W0,height:24,rx:6,fill:'rgba(255,244,230,.35)',stroke:'#fff4e6','stroke-width':2},strip);
    for(let m=Math.ceil(q.p/100)*100;m<=q.g;m+=100){const x=X0+(m-q.p)*u;el('line',{x1:x,x2:x,y1:Y-6,y2:Y+30,stroke:'#3a2418','stroke-width':m===q.g?0:2},strip);if(m<q.g&&x-X0>36&&X0+W0-x>30)el('text',{x,y:Y+46,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#3a2418'},strip).textContent=fmtP(m)}
    el('text',{x:X0,y:Y+46,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#7a2424'},strip).textContent=fmtP(q.p);
    const fl=el('g',{transform:`translate(${X0+W0},${Y})`},strip);el('line',{x1:0,x2:0,y1:-40,y2:30,stroke:'#3a2418','stroke-width':3},fl);el('path',{d:'M0,-40 L26,-32 L0,-24Z',fill:'#e8413e'},fl);el('text',{y:46,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#7a2424'},fl).textContent=fmtP(q.g);
    let at=0;S.laid.forEach((v,i)=>{const x=X0+at*u;if(x>X0+W0+50){at+=v;return}const w=Math.min(v*u,X0+W0+60-x);el('rect',{x,y:Y+2,width:Math.max(2,w-1),height:20,rx:3,fill:v>=500?'#6ac8b8':v>=100?'#ffd23a':v>=5?'#d8dce4':'#c8805a',stroke:'#3a2418','stroke-width':1},strip);
      const c=moneyPiece(strip,x+w/2,Y-22-(i%2)*24,v,{s:Math.min(1.1,Math.max(.75,w/30))});if(i===S.laid.length-1)interact(c,{label:'Take the last coin back',tap:()=>{if(S.busy||S.won)return;S.laid.pop();SFX.pop(.8);draw()}});at+=v})}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new customer…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4000,load)}
  function check(){if(S.busy||S.won)return;const q=Q(),t=sum(S.laid);if(!S.laid.length){say('Lay coins along the strip first.');return}
    if(t<q.d){miss(`Not there yet: the coins stop short of ${fmtP(q.g)}.`);return}if(t>q.d){miss(`Too far: the coins go past ${fmtP(q.g)}.`);return}
    S.won=true;roundWon(S.r);SFX.fanfare();SFX.clink&&SFX.clink();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(X0+W0,Y,{n:14,cols:['#ffd23a','#fff0a0']});
    say(`From ${fmtP(q.p)} up to ${fmtP(q.g)}: the change is ${fmtP(q.d)}.`);if(S.r>=2)unlock('mchange');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,laid:[]});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    const IT=[['lolly','lolly'],['comic','comic'],['choc','chocolate bar'],['drink','drink'],['ball','ball'],['ball','football']][S.r];sweetFig(scene,50,170,IT[0],1.3);const tag=el('g',{transform:'translate(160,170)'},scene);el('rect',{x:-80,y:-34,width:160,height:68,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},tag);
    el('text',{y:-8,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},tag).textContent=`costs ${fmtP(q.p)}`;el('text',{y:18,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},tag).textContent=`you pay ${fmtP(q.g)}`;
    moneyPiece(scene,316,170,q.g,{s:1.4});
    const till=el('g',{},ui);el('rect',{x:30,y:384,width:450,height:80,rx:10,fill:'#6a4a3a',stroke:'#3a2418','stroke-width':3},till);el('text',{x:44,y:402,'font-size':12,'font-weight':800,fill:'#fff0a0'},till).textContent='the till';
    /* each compartment holds a stack of coins: there are plenty of every kind */
    [1,2,5,10,20,50,100,200,500].forEach((v,i)=>{const x=62+i*48;el('rect',{x:x-22,y:410,width:44,height:50,rx:6,fill:'#4a3228',stroke:'#2a1a12','stroke-width':1.5},till);
      if(v<500)[6,3].forEach(dy=>moneyPiece(till,x,438+dy,v,{s:1.2}).setAttribute('opacity',.85));else[6,3].forEach(dy=>moneyPiece(till,x,438+dy,v,{s:.78}).setAttribute('opacity',.85));
      const c=moneyPiece(till,x,v<500?436:436,v,{s:v<500?1.2:.78});interact(c,{label:`Till: ${fmtP(v)}`,tap:()=>{if(S.busy||S.won)return;if(S.laid.length>=16)return;S.laid.push(v);SFX.clink&&SFX.clink();draw()}})});
    draw();decGo(ui,540,500,'Check the change',check,'Check');
    say(`The ${IT[1]} costs ${fmtP(q.p)}. You pay with ${fmtP(q.g)}. How much change do you get?${S.r===0?' Count up: lay coins from the till along the strip.':S.r===1?' The till has plenty of every coin: tap one as often as you need.':''}`)}
  W.change.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
