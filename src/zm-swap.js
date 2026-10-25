/* ---------- 1. Coin swap: same money, fewer coins ---------- */
W.swap={scene:'shop',
notes:`<p>Changing money into bigger coins, the idea under all of money (and under long division later). Polly's change machine takes coins in its hopper and gives back one bigger coin, but only if the coins come to exactly that coin. She taps coins from her pile into the hopper and pulls the lever: right and a shiny coin drops out; wrong and it clunks them back (two wrong and it's a new pile). First rounds: make exactly £1, 50p, £2. Then the tiny purse: it only holds 3 (or 2) coins, so she changes a big pile into bigger coins, choosing which coin the machine makes each time. New coins drop straight into the purse; a coin that doesn't need changing can be dragged straight into the purse (or put in the hopper on its own and swapped: one coin goes straight through). Check when all the money is in the purse.</p>`,
mount(root){
  /* tgt: the coin the machine makes (fixed), or dial: she chooses; cap: the purse holds this many */
  const R=[
    {v:[{tgt:100,pile:[50,20,20,10,10,5,2,1]},{tgt:100,pile:[50,50,20,10,5,5,2,2]}]},
    {v:[{tgt:50,pile:[20,20,10,10,5,5,2,1]},{tgt:50,pile:[20,10,10,10,5,2,2,1,1]}]},
    {v:[{tgt:200,pile:[100,50,50,20,20,10,10,5]},{tgt:200,pile:[100,50,20,20,20,10,10,5,2]}]},
    {v:[{dial:[20,50,100,200],cap:3,pile:[10,10,10,10,10,10,10,10,10,10,20,20,20,20,20]}]},
    {v:[{dial:[20,50,100,200],cap:2,pile:[20,20,20,20,20,50,50,10,10,10,10,10]}]},
    {v:[{dial:[20,50,100,200],cap:3,pile:[50,50,50,50,20,20,20,10]}]}];
  const S={r:0,busy:false,won:false,pile:[],hop:[],purse:[],di:0,pi:{},miss:0};
  const scene=el('g',{},root),pileL=el('g',{},root),mach=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  const st=navStone({label:'Next pile',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this pile again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r];return rr.v[(S.pi[S.r]||0)%rr.v.length]};
  const tgt=q=>q.dial?q.dial[S.di]:q.tgt;
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const parts=(q,done)=>q.cap?[['t',`purse holds ${q.cap}`],['o','='],done?['w','✓']:['o','?']]:[['t','change into'],['o','='],done?['w',fmtP(q.tgt)]:['o','?']];
  const HX=384,HY=196;
  function draw(){const q=Q();pileL.innerHTML='';const p=[...S.pile].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]);
    el('text',{x:44,y:150,'font-size':14,'font-weight':800,fill:'#fff0a0'},pileL).textContent='your coins';
    p.forEach(([v,i],k)=>{const x0=62+(k%5)*50,y0=190+Math.floor(k/5)*52,c=moneyPiece(pileL,x0,y0,v,{s:1.35});
      /* tap: into the hopper. Purse rounds: drag a coin that needn't change straight into the purse */
      interact(c,{label:`Coin ${fmtP(v)} (pile)`,tap:()=>{if(S.busy||S.won)return;S.hop.push(S.pile.splice(i,1)[0]);SFX.clink&&SFX.clink();draw()},
        down:()=>({}),move:pt=>{if(S.busy||S.won||!q.cap)return;c.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) scale(1.35)`)},
        up:pt=>{if(S.busy||S.won)return;if(q.cap&&Math.hypot(pt.x-538,pt.y-250)<90){S.purse.push(S.pile.splice(i,1)[0]);SFX.clink&&SFX.clink();say(`${fmtP(v)} straight into the purse.`)}else if(Math.hypot(pt.x-HX,pt.y-HY)<80){S.hop.push(S.pile.splice(i,1)[0]);SFX.clink&&SFX.clink()}draw()}})});
    mach.innerHTML='';const m=el('g',{},mach);
    el('rect',{x:HX-74,y:HY-44,width:148,height:250,rx:18,fill:'#5a6a8a',stroke:'#2a3a5a','stroke-width':3},m);el('rect',{x:HX-62,y:HY-32,width:124,height:88,rx:10,fill:'#d8e8f8',stroke:'#2a3a5a','stroke-width':2},m);
    el('text',{x:HX,y:HY-50,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#fff0a0'},m).textContent='CHANGE MACHINE';
    S.hop.forEach((v,k)=>{const c=moneyPiece(m,HX-45+(k%4)*30,HY-12+Math.floor(k/4)*26,v,{s:.95});interact(c,{label:`Coin ${fmtP(v)} (hopper)`,tap:()=>{if(S.busy||S.won)return;S.pile.push(S.hop.splice(k,1)[0]);SFX.pop(.8);draw()}})});
    if(!S.hop.length)el('text',{x:HX,y:HY+18,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#5a6a8a'},m).textContent='tap coins in';
    el('text',{x:HX,y:HY+78,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff4e6'},m).textContent='makes one';
    el('circle',{cx:HX,cy:HY+118,r:30,fill:'#2a3a5a'},m);moneyPiece(m,HX,HY+118,tgt(q),{s:1.55});
    if(q.dial)[['◀',-1],['▶',1]].forEach(([s2,d])=>{const b=el('g',{transform:`translate(${HX+d*50},${HY+118})`},m);el('circle',{r:16,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':2},b);el('text',{y:6,'text-anchor':'middle','font-size':14,fill:'#fff'},b).textContent=s2;
      interact(b,{label:d<0?'Machine: smaller coin':'Machine: bigger coin',tap:()=>{if(S.busy||S.won)return;S.di=clamp(S.di+d,0,q.dial.length-1);SFX.tick(S.di+2);draw()}})});
    const lev=el('g',{transform:`translate(${HX},${HY+176})`},m);el('rect',{x:-40,y:-14,width:80,height:28,rx:10,fill:'#ffc04d',stroke:'#a8743a','stroke-width':2.5},lev);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#3a2418'},lev).textContent='SWAP!';
    interact(lev,{label:'Pull the lever: swap',tap:swap});
    if(q.cap){const pg=el('g',{transform:'translate(538,250)'},m),bag=el('g',{},pg);el('path',{d:'M-60,-24 Q-60,46 0,46 Q60,46 60,-24Z',fill:'#c9813a',stroke:'#7a4a2e','stroke-width':3},bag);el('path',{d:'M-60,-24 Q0,-50 60,-24',fill:'none',stroke:'#7a4a2e','stroke-width':3},bag);
      for(let k=0;k<q.cap;k++)el('circle',{cx:(k-(q.cap-1)/2)*36,cy:10,r:15,fill:'none',stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'3 3'},bag);
      const db=el('g',{transform:'translate(0,-74)'},pg);el('rect',{x:-58,y:-15,width:116,height:30,rx:10,fill:'#3a3058',stroke:'#c9a24a','stroke-width':2},db);el('text',{y:5,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff4e6'},db).textContent='into the purse';
      interact(db,{label:'Purse: drop the hopper coins straight in',tap:()=>{if(S.busy||S.won)return;if(!S.hop.length){say('Tap a coin into the hopper first, then tap the purse.');return}S.purse.push(...S.hop);S.hop=[];SFX.clink&&SFX.clink();draw()}});
      S.purse.forEach((v,k)=>{const over=k>=q.cap,c=moneyPiece(pg,over?-60+(k-q.cap)*30:(k-(q.cap-1)/2)*36,over?-40:10,v,{s:1.05});if(over)c.setAttribute('opacity',.8);interact(c,{label:`Coin ${fmtP(v)} (purse)`,tap:()=>{if(S.busy||S.won)return;S.pile.push(S.purse.splice(k,1)[0]);SFX.pop(.8);draw()}})});
      el('text',{y:72,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#fff0a0'},pg).textContent=`holds ${q.cap} coins`}}
  function swap(){if(S.busy||S.won)return;const q=Q(),t=tgt(q),h=sum(S.hop);if(!S.hop.length){say('Tap some coins into the hopper first.');return}
    if(S.hop.length===1&&q.cap){S.purse.push(S.hop.pop());SFX.clink&&SFX.clink();say('One coin doesn’t need changing: straight into the purse.');draw();return}
    if(S.hop.length===1&&S.hop[0]===t){say('That’s already the coin it makes!');return}
    if(h!==t){S.busy=true;SFX.clonk();shake(3);if(!q.cap){S.miss++;if(S.miss>=2){SFX.wrong();say(`Clunk! Not exactly ${fmtP(t)} again. A new pile…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3500,load);return}}
      say(`Clunk! Not exactly ${fmtP(t)}. ${q.cap?'Back they come.':'Start with the biggest coin.'}`);later(900,()=>{S.pile.push(...S.hop);S.hop=[];S.busy=false;draw()});return}
    S.busy=true;SFX.clink&&SFX.clink();bell(noteHz(10),.06,.8);const n=S.hop.length;S.hop=[];draw();
    later(500,()=>{(q.cap?S.purse:S.pile).push(t);S.busy=false;draw();burst(HX,HY+118,{n:10,cols:['#ffd23a','#fff0a0']});
      if(!q.cap){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);say(`${n} coins in, one ${fmtP(t)} out: the same money, fewer coins.`);if(S.r>=2)unlock('mswap');later(1400,()=>st.ready(true));return}
      say(`${n} coins became one ${fmtP(t)}, into the purse.${S.pile.length?'':' Is it all in? Check.'}`)})}
  function check(){if(S.busy||S.won)return;const q=Q();if(!q.cap){swap();return}const n=S.purse.length;
    if(S.pile.length||S.hop.length){SFX.wrong();shake(2);say('Some money is still outside the purse.');return}
    if(n>q.cap){SFX.wrong();shake(2);say(`${n} coins won’t fit in a purse for ${q.cap}. Change some into bigger coins.`);return}
    S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);say(`It all fits! Still ${fmtP(sum(S.purse))}, just ${n} coins.`);if(S.r>=2)unlock('mswap');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,pile:[...q.pile],hop:[],purse:[],di:0,miss:0});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);draw();
    decGo(ui,540,500,q.cap?'Check: close the purse':'Swap!',check,q.cap?'Check':'Swap');
    say(q.cap?`This purse only holds ${q.cap} coins! Change your money into bigger coins to fit it all in.${S.r===3?' New coins drop into the purse. A coin that needn’t change: drag it straight into the purse.':''}`:S.r===0?`Change your money into a bigger coin: tap in coins that make exactly ${fmtP(q.tgt)}, then Swap!`:`Change some coins into one ${fmtP(q.tgt)}.`)}
  W.swap.dbgQ=()=>({...Q(),r:S.r,pile:S.pile,hop:S.hop,purse:S.purse});S.r=resumeAt(R.length);load();
}};
