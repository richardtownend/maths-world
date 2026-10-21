/* ---------- 8. Roughly: estimating by rounding first ---------- */
W.bridge={scene:'road',
notes:`<p>Why rounding matters: a quick, safe guess. The old bridge has a weight limit and Dex's sacks have awkward weights (487 kg, 312 kg…). She rounds each sack to the nearest 100 by stacking 100 kg crates under it, and the crates pile up into one tower beside the bridge's limit line. Check the crates, then decide: cross, or too heavy? Crossing when it's too heavy cracks the bridge; if it's too heavy she taps a sack to leave behind. Later rounds use 10 kg and 1,000 kg crates, and one round checks Dex's own sum (398 + 207 = 905?): about right, or way off?</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=[{unit:100,limit:1000,vars:[[210,390,180],[320,140,270],[180,260,410],[380,290,410]]},{unit:100,limit:1000,vars:[[480,320,290],[510,370,260],[440,390,330],[310,260,180]]},
    {unit:10,limit:100,vars:[[47,38,21],[52,33,26],[33,24,31],[44,36,28]]},{unit:100,sum:1,vars:[[398,207,905],[512,289,801],[296,403,699],[512,289,1101],[296,403,499]]},{unit:1000,limit:4000,vars:[[1210,2380],[2640,1830],[870,2240],[2710,1580]]}];
  const S={r:0,busy:false,won:false,w:[],n:[],phase:'stack',left:null,q:null};
  const scene=el('g',{},root),cartL=el('g',{},root),stk=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let cart=null,go=null;
  const st=navStone({label:'Next load',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this load again',onTap:()=>load()});
  const kg=v=>`${fmtR(v)} kg`,CX=k=>S.w.length===2?[170,300][k]:[130,250,370][k],BASE=480,CH=21,unitLbl=()=>fmtR(S.q.unit);
  const parts=done=>{const q=S.q;if(q.sum)return[['w',fmtR(S.w[0])],['o','+'],['w',fmtR(S.w[1])],['o','='],['w',fmtR(q.claim)],['t','\u00a0'+(done?(Math.abs(q.claim-(S.w[0]+S.w[1]))>q.unit?'way off!':'about right'):'right?')]];
    const p=[];S.w.forEach((w,i)=>{if(i)p.push(['o','+']);p.push(['w',fmtR(w)])});p.push(['o','≈']);p.push(done?['w',fmtR(est())]:['o','?']);return p};
  const est=()=>S.n.reduce((a,n,i)=>a+(i===S.left?0:n*S.q.unit),0);
  function drawScene(){scene.innerHTML='';const q=S.q;
    el('rect',{x:-700,y:196,width:2000,height:70,fill:'#4a8ac8'},scene);for(let i=0;i<10;i++)el('path',{d:`M${-20+((i*89)%640)},${216+((i*37)%40)} q10,-4 20,0`,stroke:'#cfe8ff','stroke-width':2,fill:'none',opacity:.6},scene);
    el('path',{d:'M-700,200 H130 V266 H-700Z M470,200 H1300 V266 H470Z',fill:'#8ab85a'},scene);
    const br=el('g',{},scene);S.bridge=br;el('rect',{x:120,y:206,width:360,height:12,fill:'#a8743a',stroke:'#6a4220','stroke-width':2},br);for(let x=128;x<476;x+=16)el('line',{x1:x,x2:x,y1:206,y2:218,stroke:'#6a4220','stroke-width':1},br);
    [160,300,440].forEach(x=>el('rect',{x:x-5,y:218,width:10,height:44,fill:'#8a5a34'},br));el('path',{d:'M120,196 H480',stroke:'#8a5a34','stroke-width':4},br);
    if(!q.sum){const sg=el('g',{transform:'translate(300,150)'},scene);el('rect',{x:-2,y:0,width:4,height:46,fill:'#6a4220'},sg);el('circle',{r:26,fill:'#fff',stroke:'#e8413e','stroke-width':5},sg);
      el('text',{y:-2,'text-anchor':'middle','font-size':q.limit>=1000?12.5:14,'font-weight':800,fill:'#3a2418'},sg).textContent=fmtR(q.limit);el('text',{y:12,'text-anchor':'middle','font-size':10,'font-weight':800,fill:'#3a2418'},sg).textContent='kg max'}}
  function drawCart(){cartL.innerHTML='';cart=cartFig(cartL,{s:.8,sacks:S.w.length-(S.left!=null?1:0)});cart.put(64,200,0)}
  function crate(parent,x,y,lab,col='#c98a4a'){const g=el('g',{transform:`translate(${x},${y})`},parent);el('rect',{x:-26,y:-CH,width:52,height:CH-2,rx:3,fill:col,stroke:'#6a4220','stroke-width':1.5},g);el('path',{d:`M-24,${-CH+2} L24,-4 M24,${-CH+2} L-24,-4`,stroke:'#8a5a2e','stroke-width':1,opacity:.6},g);
    el('text',{y:-6,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#3a2418'},g).textContent=lab;return g}
  function drawStacks(){stk.innerHTML='';const q=S.q;
    S.w.forEach((w,i)=>{const x=CX(i),gone=i===S.left,g=el('g',{opacity:gone?.3:1},stk);
      const sk=el('g',{transform:`translate(${x},${BASE-S.n[i]*CH-2})`},g);el('path',{d:'M-20,0 Q-26,-30 -10,-34 L-6,-42 H6 L10,-34 Q26,-30 20,0Z',fill:'#e8d2a8',stroke:'#a8844e','stroke-width':2},sk);
      const tg=el('g',{transform:'translate(0,-56)'},sk);const tw=Math.max(56,fmtR(w).length*9+30);el('rect',{x:-tw/2,y:-13,width:tw,height:24,rx:8,fill:'#fff4e6',stroke:'#7a5a3a','stroke-width':2},tg);el('text',{y:5,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},tg).textContent=q.sum?fmtR(w):kg(w);
      if(S.phase==='leave'&&!gone){el('rect',{x:-40,y:-80,width:80,height:110,fill:'transparent'},sk);interact(sk,{label:`Leave the ${kg(w)} sack behind`,tap:()=>leave(i)})}
      for(let k=0;k<S.n[i];k++)crate(g,x,BASE-k*CH,unitLbl());
      el('line',{x1:x-34,x2:x+34,y1:BASE+1,y2:BASE+1,stroke:'#5a3a24','stroke-width':3},g);
      if(S.phase==='stack'){[[-1,'−'],[1,'+']].forEach(([d,t],j)=>{const b=el('g',{transform:`translate(${x+(j?22:-22)},${BASE+30})`},g);el('circle',{r:17,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2},b);el('text',{y:6.5,'text-anchor':'middle','font-size':20,'font-weight':800,fill:'#fff0a0'},b).textContent=t;
        interact(b,{label:`${d>0?'Add':'Take'} a ${unitLbl()} crate ${d>0?'to':'from'} the ${fmtR(w)} sack`,tap:()=>{if(S.busy||S.won)return;const n=clamp(S.n[i]+d,0,10);if(n===S.n[i])return;S.n[i]=n;SFX.tick(n);drawStacks()}})})}});
    if(!q.sum){/* the tower: every crate piled up beside the bridge's limit line */
      const tx=508,tot=S.n.reduce((a,n,i)=>a+(i===S.left?0:n),0),lim=q.limit/q.unit,top=BASE-Math.max(lim,tot)*CH,tg=el('g',{},stk);
      el('text',{x:tx,y:BASE+26,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':3,'paint-order':'stroke'},tg).textContent='all the crates';
      for(let k=0;k<tot;k++)crate(tg,tx,BASE-k*CH,unitLbl());
      const ly=BASE-lim*CH;el('line',{x1:tx-40,x2:tx+40,y1:ly,y2:ly,stroke:'#e8413e','stroke-width':3,'stroke-dasharray':'6 4'},tg);el('text',{x:tx,y:ly-6,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#fff4e6',stroke:'#8a1a1a','stroke-width':3,'paint-order':'stroke'},tg).textContent=`limit ${kg(q.limit)}`}}
  function setGo(label,fn,txt){if(go)go.remove();go=decGo(ui,548,130,label,fn,txt)}
  function chips(list){[...ui.querySelectorAll('.dchip')].forEach(n=>n.remove());list.forEach(([t,fn],i)=>{const g=el('g',{class:'dchip',transform:`translate(${list.length===1?300:190+i*180},${BASE+34})`},ui);el('rect',{x:-80,y:-20,width:160,height:40,rx:12,fill:i?'#e8705a':'#3aa86a',stroke:'#fff4e6','stroke-width':2},g);
    el('text',{y:6,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#fff'},g).textContent=t;interact(g,{label:t,tap:()=>{if(S.busy||S.won)return;SFX.pop(1.1);fn()}});popIn(g,.5)})}
  function checkStacks(){if(S.busy||S.won||S.phase!=='stack')return;const q=S.q;if(S.n.every(n=>!n)){say(`Stack ${unitLbl()} kg crates under each sack: round it to the nearest ${unitLbl()}.`);return}
    const bad=S.w.findIndex((w,i)=>S.n[i]*q.unit!==roundTo(w,q.unit));
    if(bad>=0){SFX.wrong();shake(2);const w=S.w[bad];S.n[bad]=0;drawStacks();say(`Not the ${fmtR(w)}${q.sum?'':' kg'} sack: which ${unitLbl()} is it nearest? Stack its crates again.`);return}
    SFX.chime();S.phase='decide';drawStacks();if(go){go.remove();go=null}
    if(q.sum){say(`Roughly ${fmtR(S.n[0]*q.unit)} + ${fmtR(S.n[1]*q.unit)} = ${fmtR(est())}. Dex says ${fmtR(q.claim)}. Is he about right?`);chips([['About right',()=>decide(false)],['Way off!',()=>decide(true)]])}
    else{say(`The crates come to about ${kg(est())}. The bridge takes ${kg(q.limit)}. Safe to cross?`);chips([['Cross the bridge',()=>decide(false)],['Too heavy!',()=>decide(true)]])}}
  function decide(heavy){const q=S.q;[...ui.querySelectorAll('.dchip')].forEach(n=>n.remove());
    if(q.sum){const off=Math.abs(q.claim-(S.w[0]+S.w[1]))>q.unit;if(heavy===off){win(`${fmtR(S.w[0])} + ${fmtR(S.w[1])} is really ${fmtR(S.w[0]+S.w[1])}. ${off?'The rough answer spotted the slip!':'The rough answer says it’s about right.'}`);return}
      S.busy=true;SFX.wrong();shake(2);say(`Compare Dex’s answer with your rough one, ${fmtR(est())}. Here’s another sum…`);later(3200,()=>load(true));return}
    const over=est()>q.limit;
    if(!heavy){if(over){crack();return}cross();return}
    if(!over){S.busy=true;SFX.wrong();say(`Look at the crate tower and the red line again. Here’s another load…`);later(3200,()=>load(true));return}
    S.phase='leave';drawStacks();say('Too heavy! Tap a sack for Dex to leave behind.')}
  function leave(i){if(S.busy||S.won)return;S.left=i;SFX.pop(.8);drawStacks();drawCart();if(est()>S.q.limit){say('Still over the line. Try leaving a different sack.');S.left=null;later(1600,()=>{drawStacks();drawCart()});return}
    S.phase='decide';drawStacks();say(`Now about ${kg(est())}: under the line.`);later(900,cross)}
  function cross(){S.busy=true;heehaw();tween(2400,(t,p)=>{cart.put(lerp(64,540,p),200,0);cart.spin(p*480);if(Math.random()<.04)osc('triangle',140+Math.random()*30,.12,.03,{lp:500})},()=>{const real=S.w.reduce((a,w,i)=>a+(i===S.left?0:w),0);
    win(`Safe across! Really ${kg(real)}, and the rough ${kg(est())} was enough to tell.`)},ease.inOut)}
  function crack(){S.busy=true;tween(1200,(t,p)=>cart.put(lerp(64,300,p),200+Math.max(0,p-.7)*40,0),()=>{SFX.crunch?SFX.crunch():noise(.4,.2,{f:400,q:.6});shake(8);S.bridge.setAttribute('transform','rotate(4 300 210)');
    const real=S.w.reduce((a,w)=>a+w,0);say(`Crrrack! About ${kg(est())} is more than ${kg(S.q.limit)} (really ${kg(real)}). The crates were over the red line.`);SFX.wrong();
    later(3600,()=>load(true))})}
  function win(msg){S.won=true;S.busy=false;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(true),true,guide);burst(300,240,{n:16});say(msg);if(S.r>=2)unlock('rbridge');later(1400,()=>st.ready(true))}
  function load(again){EPOCH++;FX.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);go=null;const q=S.q=R[S.r],pw=S.w&&S.w.join(),v=pick(again?q.vars.filter(x=>x.slice(0,S.w.length).join()!==pw):q.vars);
    Object.assign(S,{busy:false,won:false,phase:'stack',left:null});S.w=q.sum?v.slice(0,2):v.slice();q.claim=q.sum?v[2]:null;S.n=S.w.map(()=>0);
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene();drawCart();drawStacks();setGo('Check the crates',checkStacks,'Check');
    say(q.sum?`Dex added up two sacks. Round each to the nearest ${unitLbl()} with crates to check his answer.`:S.r===0?`Can Dex’s cart cross? Round each sack to the nearest 100 kg: stack that many 100 kg crates under it.`:`Round each sack with ${unitLbl()} kg crates, then decide.`)}
  W.bridge.dbgQ=()=>({r:S.r,w:S.w,n:S.n,phase:S.phase,unit:S.q.unit,limit:S.q.limit,sum:!!S.q.sum,claim:S.q.claim,est:est(),busy:S.busy,won:S.won});
  S.r=resumeAt(R.length);load();
}};
