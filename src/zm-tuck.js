/* ---------- 2. Tuck shop: paying exactly ---------- */
function sweetFig(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(kind==='lolly'){el('rect',{x:-2,y:0,width:4,height:30,fill:'#fff4e6'},g);el('circle',{cy:-6,r:14,fill:'#ff9ed2',stroke:'#c9578a','stroke-width':2},g);el('path',{d:'M-8,-6 a8,8 0 1 1 8,8',fill:'none',stroke:'#fff','stroke-width':2.5},g)}
  else if(kind==='comic'){el('rect',{x:-16,y:-20,width:32,height:42,rx:2,fill:'#ffe066',stroke:'#a8743a','stroke-width':2},g);el('text',{y:2,'text-anchor':'middle','font-size':10,'font-weight':900,fill:'#e8413e'},g).textContent='ZAP!'}
  else if(kind==='drink'){el('rect',{x:-11,y:-20,width:22,height:40,rx:5,fill:'#4aa0ff',stroke:'#2a5a8a','stroke-width':2},g);el('rect',{x:-11,y:-6,width:22,height:12,fill:'#fff4e6'},g)}
  else if(kind==='choc'){el('rect',{x:-20,y:-10,width:40,height:20,rx:2,fill:'#6a3a1a',stroke:'#3a1a0a','stroke-width':2},g);el('rect',{x:-20,y:-10,width:16,height:20,fill:'#c9413a'},g)}
  else if(kind==='ball'){el('circle',{r:16,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},g);el('path',{d:'M-16,0 H16',stroke:'#fff','stroke-width':3},g)}
  else{el('path',{d:'M-14,-14 L14,-14 L10,16 H-10Z',fill:'#8ff0c8',stroke:'#3a8a6a','stroke-width':2},g);[-6,0,6].forEach(dx=>el('circle',{cx:dx,cy:-18,r:4,fill:['#ff9ed2','#ffd23a','#8fd6ff'][(dx+6)/6]},g))}
  return g}

W.tuck={scene:'shop',
notes:`<p>Paying the exact amount. The things she's buying sit on the counter with their price tags; her purse is underneath. She taps coins onto the counter to pay (tap one again to take it back). The counter never adds them up for her. Pay: exactly right and the shopkeeper's happy; not enough or too much and it's a new shopping trip. Later: pay with the fewest coins you can, pay for two things at once, and the one you can't pay exactly (only 20p coins for a 45p drink: pay the least you can and get change).</p>`,
mount(root){
  /* items: [kind, price]; min: must use the fewest coins; least: can't pay exactly, pay the least you can */
  const R=[
    {v:[{items:[['lolly',35]],purse:[50,20,10,10,5,2,2,1]},{items:[['lolly',27]],purse:[50,20,10,5,2,2,1,1]},{items:[['lolly',42]],purse:[50,20,20,10,5,2,1]}]},
    {v:[{items:[['comic',120]],purse:[100,50,20,20,10,5]},{items:[['comic',150]],purse:[100,50,20,20,20,10]},{items:[['comic',135]],purse:[100,20,20,10,5,5,2]}]},
    {v:[{items:[['choc',75]],purse:[50,20,20,10,10,5,5,2,1],min:1},{items:[['choc',65]],purse:[50,20,10,10,5,5,2,1],min:1},{items:[['choc',80]],purse:[50,20,20,10,5,5,2,1],min:1}]},
    {v:[{items:[['lolly',45],['drink',38]],purse:[50,20,10,5,2,1,1,20]},{items:[['lolly',36],['drink',38]],purse:[50,20,10,5,2,1,20,1]},{items:[['lolly',36],['drink',55]],purse:[50,20,10,5,2,1,20,5]}]},
    {v:[{items:[['drink',45]],purse:[20,20,20,20],least:1},{items:[['drink',85]],purse:[50,50,50],least:1},{items:[['drink',35]],purse:[20,20,20,20],least:1}]},
    {v:[{items:[['ball',185]],purse:[100,50,50,20,20,20,10,10,5,5,2,1],min:1},{items:[['ball',165]],purse:[100,50,20,20,10,10,5,5,2,1],min:1},{items:[['ball',235]],purse:[200,20,20,10,10,5,5,2,1],min:1}]}];
  const S={r:0,busy:false,won:false,pi:{},purse:[],paid:[]};
  const scene=el('g',{},root),coinsL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  const st=navStone({label:'Next shopping',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this shopping again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],q=rr.v[(S.pi[S.r]||0)%rr.v.length];return Object.assign({},q,{price:q.items.reduce((a,i)=>a+i[1],0)})};
  const sum=a=>a.reduce((x,y)=>x+y,0);
  /* fewest coins to make p from this purse (or null), and the least amount ≥ p this purse can pay */
  const fewest=(purse,p)=>{let best=null;const n=purse.length;for(let m=1;m<(1<<n);m++){let s=0,c=0;for(let i=0;i<n;i++)if(m&(1<<i)){s+=purse[i];c++}if(s===p&&(best===null||c<best))best=c}return best};
  const least=(purse,p)=>{let best=1e9;const n=purse.length;for(let m=1;m<(1<<n);m++){let s=0;for(let i=0;i<n;i++)if(m&(1<<i))s+=purse[i];if(s>=p&&s<best)best=s}return best};
  const parts=(q,done)=>[['t',q.items.length>1?'pay for both':q.least?'pay the least':'pay'],['o','='],done?['w',fmtP(sum(S.paid))]:['o','?']];
  function draw(){coinsL.innerHTML='';const q=Q();
    el('rect',{x:30,y:300,width:330,height:102,rx:10,fill:'#a8744a',stroke:'#6a4224','stroke-width':3},coinsL);el('text',{x:44,y:320,'font-size':13,'font-weight':800,fill:'#fff0a0'},coinsL).textContent='the counter';
    S.paid.forEach((v,i)=>{const c=moneyPiece(coinsL,64+(i%7)*44,338+Math.floor(i/7)*36,v,{s:1.3});interact(c,{label:`Coin ${fmtP(v)} (counter)`,tap:()=>{if(S.busy||S.won)return;S.purse.push(S.paid.splice(i,1)[0]);SFX.pop(.8);draw()}})});
    el('text',{x:44,y:416,'font-size':13,'font-weight':800,fill:'#fff0a0'},coinsL).textContent='your purse';
    [...S.purse].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).forEach(([v,i],k)=>{const c=moneyPiece(coinsL,58+(k%8)*46,446+Math.floor(k/8)*40,v,{s:1.3});interact(c,{label:`Coin ${fmtP(v)} (purse)`,tap:()=>{if(S.busy||S.won)return;S.paid.push(S.purse.splice(i,1)[0]);SFX.clink&&SFX.clink();draw()}})})}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new shopping trip…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4000,load)}
  function check(){if(S.busy||S.won)return;const q=Q(),t=sum(S.paid);if(!S.paid.length){say('Tap coins onto the counter first.');return}
    if(q.least){const best=least(q.purse,q.price);if(t<q.price){miss('Not enough yet.');return}if(t>best){miss(`You could pay less than ${fmtP(t)}.`);return}
      win(q,`${fmtP(t)}: the least you can pay. You get ${fmtP(t-q.price)} change.`);return}
    if(t<q.price){miss(q.items.length>1?'Not enough: add the two prices first.':'Not enough: count your coins up again.');return}if(t>q.price){miss('Too much: you’d need change.');return}
    if(q.min){const f=fewest(q.purse,q.price);if(S.paid.length>f){miss(`Right money, but you can do it with fewer coins. Try the biggest coin first.`);return}}
    win(q,`${fmtP(q.price)} exactly${q.min?`, in just ${S.paid.length} coins`:''}!`)}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.clink&&SFX.clink();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(200,340,{n:14,cols:['#ffd23a','#fff0a0']});say(msg);if(S.r>=2)unlock('mtuck');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,purse:[...q.purse],paid:[]});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    el('rect',{x:30,y:140,width:330,height:120,rx:12,fill:'rgba(34,24,48,.85)',stroke:'#ffc04d','stroke-width':3},scene);
    q.items.forEach(([k,p],i)=>{const x=q.items.length>1?120+i*150:195;sweetFig(scene,x,196,k,1.5);kgTag(scene,x,246,fmtP(p))});if(q.items.length>1)el('text',{x:195,y:204,'text-anchor':'middle','font-size':26,'font-weight':800,fill:'#fff0a0'},scene).textContent='+';
    draw();decGo(ui,540,500,'Pay',check,'Pay');
    say(q.least?`It costs ${fmtP(q.price)}, but you can’t make it exactly. Pay the least you can.`:q.min?`Pay ${fmtP(q.price)} with the fewest coins you can.`:q.items.length>1?'Pay for both, exactly.':S.r===0?'Tap coins from your purse onto the counter. Pay exactly!':'Pay exactly.')}
  W.tuck.dbgQ=()=>({...Q(),r:S.r,purse:S.purse});S.r=resumeAt(R.length);load();
}};
