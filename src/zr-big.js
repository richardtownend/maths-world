/* ---------- rounding on the hill road: one engine for Big Hills, the Great Road and the Last Stretch ----------
   Round kinds:
   place  drag the numbered cart onto the road (snapping to `snap`), tap the milestone it will roll to, Go
   triple one cart on three sizes of hill (10s, 100s, 1,000s): a prediction on each, Go rolls all three
   many   a row of carts: tap every one that will end up at the target milestone
   wheels the cart is parked; set the rounded number on the digit wheels (only the end milestones are labelled)
   paint  drag two handles to paint the stretch of road whose carts all roll to the target; Go sends carts along it */
function roadRounds(id,root,R,{unlockK,nearestWord=s=>`nearest ${fmtR(s)}`}){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const S={r:0,busy:false,won:false,v:0,at:null,picks:{},sel:new Set(),carts:[],wh:null,pa:null,q:null};
  const roadL=el('g',{},root),cartL=el('g',{},root),hitL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let roads=[],cart=null,flags={};
  const st=navStone({label:'Next road',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this road again',onTap:()=>load()});
  const F=(v,q=S.q)=>{let d=0;while(d<(q.dp||0)&&Math.abs(v*10**d-Math.round(v*10**d))>1e-6)d++;return fmtR(v,d)},near=q=>q.near||nearestWord(q.step);
  const parts=done=>{const q=S.q;return q.kind==='many'?[['t','carts that roll to\u00a0'],['w',F(q.target)]]:q.kind==='paint'?[['t','the road that rolls to\u00a0'],['w',F(q.target)]]:q.kind==='triple'?[['w',F(S.v)],['t','\u00a0to the nearest 10, 100 and 1,000']]:
    [['w',F(S.v)],['o','≈'],done?['w',F(roundTo(S.v,q.step))]:['o','?'],['t','\u00a0'+near(q)]]};
  const RD=(o)=>{const r=hillRoad(roadL,Object.assign({fmt:v=>F(v)},o));roads.push(r);return r};
  function flag(ri,v){if(flags[ri])flags[ri].remove();const r=roads[ri],x=r.xOf(v),y=r.yOf(v),f=el('g',{transform:`translate(${x},${y-30})`},roadL);el('line',{x1:0,y1:0,x2:0,y2:-30,stroke:'#5a3a24','stroke-width':2.5},f);el('path',{d:'M0,-30 L20,-24 L0,-18Z',fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},f);flags[ri]=f;popIn(f,.4)}
  /* each milestone can be tapped on the stone, or below the road on its label (which a parked cart never covers) */
  function tappable(ri,label=v=>`Milestone ${F(v)}${roads.length>1?` (${['top','middle','bottom'][ri]} road)`:''}`){const r=roads[ri];r.stones.forEach(({v,m})=>{el('rect',{x:-24,y:-50,width:48,height:80,fill:'transparent'},m.g);
    const tap=()=>{if(S.busy||S.won)return;if(S.q.kind==='place'&&S.at==null){say(`First drag the cart to ${F(S.v)} on the road.`);return}S.picks[ri]=v;SFX.tick(Math.round(v/r.step)%8);flag(ri,v)};
    interact(m.g,{label:label(v),tap});const lo=el('rect',{x:r.xOf(v)-24,y:r.yOf(v)+2,width:48,height:42,fill:'transparent'},hitL);interact(lo,{label:label(v)+' label',tap})})}
  const windAt=(r,v)=>()=>{gust(cartL,r.xOf(v),r.yOf(v)-40);say('Balanced right on the top… here comes the wind!')};
  function fail(msg){SFX.wrong();shake(2);say(msg);later(3800,()=>{S.busy=false;load(true)})}
  function why(v,step,got){const e=roundTo(v,step),half=Math.abs(((v/step)%1+1)%1-.5)<1e-6;
    return half?`${F(v)} is exactly halfway, so the wind blows it on to ${F(e)}. Halfway rounds up.`:`${F(v)} is nearer ${F(e)} than ${F(got)}: it rolls down to ${F(e)}.`}
  function check(){if(S.busy||S.won)return;const q=S.q;
    if(q.kind==='place'){if(S.at==null){say(`Drag the cart onto the road at ${F(S.v)} first.`);return}
      if(Math.abs(S.at-roundTo(S.v,q.snap))>1e-9){SFX.clonk();say(`Is that ${F(S.v)}? Count the little marks from the nearest milestone.`);return}
      if(S.picks[0]==null){say('Tap the milestone you think it will roll to.');return}
      S.busy=true;roads[0].place(cart,S.v);roads[0].roll(cart,S.v,end=>end===S.picks[0]?win(end):fail(why(S.v,q.step,S.picks[0])),{wind:windAt(roads[0],S.v)});return}
    if(q.kind==='triple'){if([0,1,2].some(i=>S.picks[i]==null)){say('Tap a milestone on each road: where will each cart roll?');return}
      S.busy=true;let left=3;const ends=[];S.carts.forEach((c,i)=>roads[i].roll(c,S.v,end=>{ends[i]=end;if(--left===0){const bad=[0,1,2].find(i=>ends[i]!==S.picks[i]);bad==null?win(ends[2]):fail(`On the ${['10s','100s','1,000s'][bad]} road: ${why(S.v,roads[bad].step,S.picks[bad])}`)}},{wind:windAt(roads[i],S.v)}));return}
    if(q.kind==='many'){if(!S.sel.size){say(`Tap the carts that will end up at ${F(q.target)}.`);return}S.busy=true;let left=S.carts.length;
      S.carts.forEach(c=>roads[0].roll(c.o,c.v,end=>{c.end=end;if(--left===0){const want=S.carts.filter(c=>Math.abs(c.end-q.target)<1e-9).map(c=>c.v),got=[...S.sel];
        const wrong=got.find(v=>!want.includes(v)),miss=want.find(v=>!got.includes(v));
        if(wrong==null&&miss==null)win(q.target);else fail(wrong!=null?`${F(wrong)} rolled to ${F(roundTo(wrong,q.step))}, not ${F(q.target)}.${Math.abs(((wrong/q.step)%1+1)%1-.5)<1e-9?' Halfway goes up!':''}`:Math.abs(((miss/q.step)%1+1)%1-.5)<1e-6?`${F(miss)} is exactly halfway, so the wind blew it on to ${F(q.target)}.`:`${F(miss)} rolled to ${F(q.target)} too: it’s nearer ${F(q.target)} than any other milestone.`)}},{wind:()=>gust(cartL,roads[0].xOf(c.v),roads[0].yOf(c.v)-40)}));return}
    if(q.kind==='wheels'){const g=S.wh.get();if(g==null){say('Set the wheels to the milestone you think it will roll to.');return}S.wh.lock(true);S.busy=true;
      roads[0].roll(cart,S.v,end=>{if(Math.abs(g-end)<1e-9)win(end);else{S.wh.lock(false);fail(`It rolled to ${F(end)}. ${Math.abs(g-roundTo(g,q.step))>1e-9?`${F(g)} isn’t a milestone: they’re every ${F(q.step)}.`:why(S.v,q.step,g)}`)}},{wind:windAt(roads[0],S.v)});return}
    if(q.kind==='paint'){const [a,b]=S.pa.get(),lo=q.target-q.step/2,hi=q.target+q.step/2;S.busy=true;
      /* send carts down the painted stretch and just either side of it */
      const vs=[...new Set([a-q.snap,a,(a+b)/2,b-q.snap,b].map(v=>roundTo(clamp(v,q.lo,q.hi),q.snap)))];cartL.innerHTML='';let left=vs.length;const res=[];
      vs.forEach(v=>{const c=cartFig(cartL,{s:.55,sacks:1,handle:false});roads[0].place(c,v);roads[0].roll(c,v,end=>{res.push([v,end]);if(--left===0){
        const okA=Math.abs(a-lo)<1e-9,okB=Math.abs(b-(hi-q.snap))<1e-9;
        if(okA&&okB)win(q.target);else fail(!okA?(a<lo?`A cart at ${F(a)} rolls to ${F(roundTo(a,q.step))}: start the paint further along.`:`A cart at ${F(a-q.snap)} rolls to ${F(q.target)} too: paint further back.`):(b>=hi?`A cart at ${F(b)} ${Math.abs(b-hi)<1e-9?'balances on the peak and the wind blows it on':'rolls on'} to ${F(roundTo(b,q.step))}: stop the paint sooner.`:`A cart at ${F(b+q.snap)} rolls to ${F(q.target)} too: paint further.`))}})})}}
  function win(end){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();decQ(qL,parts(true),true,guide);const q=S.q;
    burst(300,300,{n:16});
    say(q.kind==='many'?`${[...S.sel].sort((a,b)=>a-b).map(v=>F(v)).join(', ')} all roll to ${F(q.target)}.`:q.kind==='paint'?`Every cart from ${F(q.target-q.step/2)} to ${F(q.target+q.step/2-q.snap)} rolls to ${F(q.target)}. The one on the peak at ${F(q.target+q.step/2)} gets blown on.`:
      q.kind==='triple'?`${F(S.v)} rounds to ${F(roundTo(S.v,10))}, ${F(roundTo(S.v,100))} and ${F(roundTo(S.v,1000))}: bigger hills, different milestones.`:`${F(S.v)} rounds to ${F(end)} (${near(q)}).`);
    if(S.r>=2&&unlockK)unlock(unlockK);later(1400,()=>st.ready(true))}
  /* two handles on the road; the stretch between them is painted gold */
  function painter(r,q){const g=el('g',{},roadL),band=el('path',{fill:'none',stroke:'#ffd23a','stroke-width':14,'stroke-linecap':'round',opacity:.85},g);let a=roundTo(q.target-q.step*.9,q.snap),b=roundTo(q.target+q.step*.9,q.snap);
    const draw=()=>{let d='';for(let i=0;i<=60;i++){const v=a+(b-a)*i/60;d+=(i?' L':'M')+r.xOf(v).toFixed(1)+','+r.yOf(v).toFixed(1)}band.setAttribute('d',d);H.forEach(h=>{const v=h.k?b:a;h.g.setAttribute('transform',`translate(${r.xOf(v).toFixed(1)},${(r.yOf(v)+30).toFixed(1)})`);h.t.textContent=F(v)})};
    const H=[0,1].map(k=>{const hg=el('g',{},g);el('line',{x1:0,y1:-28,x2:0,y2:-6,stroke:'#7a4a1e','stroke-width':3},hg);el('circle',{r:16,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2.5},hg);el('path',{d:'M-6,0 L-11,0 M6,0 L11,0 M-11,0 l4,-4 M-11,0 l4,4 M11,0 l-4,-4 M11,0 l-4,4',stroke:'#7a4a1e','stroke-width':2},hg);
      const t=el('text',{y:34,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':3,'paint-order':'stroke'},hg);
      interact(hg,{label:k?'The end of the paint':'The start of the paint',down:()=>({}),move:p=>{if(S.busy||S.won)return;let v=clamp(roundTo(r.vOf(p.x),q.snap),q.lo,q.hi);if(k)v=Math.max(v,a+q.snap);else v=Math.min(v,b-q.snap);if(k?v!==b:v!==a){k?b=v:a=v;SFX.tick(Math.round(v/q.snap)%8);draw()}},tap:()=>{}});return{g:hg,t,k}});
    draw();return{get:()=>[a,b]}}
  function load(again){EPOCH++;FX.innerHTML='';cartL.innerHTML='';roadL.innerHTML='';hitL.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);roads=[];flags={};cart=null;
    const q0=R[S.r],q=S.q=Object.assign({},q0,q0.vars?pick(q0.vars):{}),prev=S.v;
    Object.assign(S,{busy:false,won:false,at:null,picks:{},sel:new Set(),carts:[],wh:null,pa:null});S.v=q.vs?pick(q.vs.filter(v=>v!==prev).length?q.vs.filter(v=>v!==prev):q.vs):0;
    if(!again)st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);
    if(q.kind==='triple'){const V=S.v;[[10,240],[100,368],[1000,496]].forEach(([s,base],i)=>{const lo=Math.floor(V/s)*s-2*s;const r=RD({lo,hi:lo+5*s,step:s,base,x0:150,x1:560,amp:28,sz:13});
        el('text',{x:18,y:base-56,'font-size':14,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':3,'paint-order':'stroke'},roadL).textContent=`hills of ${fmtR(s)}`;
        const c=cartFig(cartL,{s:.6,sacks:1,tag:F(V),handle:false});r.place(c,V);S.carts.push(c)});
      [0,1,2].forEach(i=>tappable(i));decGo(ui,548,148,'Let them go',check,'Go');say(`One cart, three roads. On each road, tap the milestone the ${F(V)} cart will roll to.`);return}
    const r=RD({lo:q.lo,hi:q.hi,step:q.step,tick:q.tick,base:q.kind==='wheels'?520:470,x0:44,x1:556,lab:true});
    if(q.kind==='wheels')r.stones.forEach((s,i)=>{if(i&&i<r.stones.length-1){const lb=s.m.g.lastChild;if(lb&&lb.tagName==='text')lb.textContent='?'}});
    if(q.kind==='many'){const vs=pick(q.sets);S.carts=vs.map((v,i)=>{const o=cartFig(cartL,{s:.66,sacks:1,tag:F(v),handle:false,lift:i%2?34:0});r.place(o,v);const c={v,o};
        interact(o.tagG,{label:`Cart ${F(v)}`,tap:()=>{if(S.busy||S.won)return;S.sel.has(v)?S.sel.delete(v):S.sel.add(v);SFX.tick(i);o.tagBox.setAttribute('stroke',S.sel.has(v)?'#ffd23a':'#7a5a3a');o.tagBox.setAttribute('stroke-width',S.sel.has(v)?5:2);o.tagBox.setAttribute('fill',S.sel.has(v)?'#fff0a0':'#fff4e6')}});return c});
      decGo(ui,548,250,'Let them go',check,'Go');say(`Tap every cart that will end up at ${F(q.target)}, then Go.`);return}
    if(q.kind==='paint'){S.pa=painter(r,q);decGo(ui,548,250,'Send the carts',check,'Go');say(`Paint the stretch of road where any cart would roll to ${F(q.target)}: drag both ends.`);return}
    if(q.kind==='wheels'){cart=cartFig(cartL,{s:.8,tag:F(S.v)});r.place(cart,S.v);S.wh=bigWheels(ui,{x:300,y:250,digits:q.digits,dp:q.dp||0,label:'Milestone'});decGo(ui,548,250,'Let go',check,'Go');
      say(`Which milestone will the ${F(S.v)} cart roll to? Set it on the wheels, then Go.`);return}
    /* place */
    tappable(0);cart=cartFig(cartL,{s:.85,tag:F(S.v)});cart.put(78,190,0);const shelf=el('text',{x:78,y:212,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#3a2418'},cartL);shelf.textContent='drag me';
    interact(cart.g,{label:`The ${F(S.v)} cart: drag it onto the road`,down:()=>({}),move:p=>{if(S.busy||S.won)return;shelf.remove();const v=clamp(roundTo(r.vOf(p.x),q.snap),q.lo,q.hi);if(v!==S.at){S.at=v;r.place(cart,v);SFX.tick(Math.round(v/q.snap)%8)}},tap:()=>{}});
    decGo(ui,548,250,'Let go',check,'Go');say(q.say||`Drag the ${F(S.v)} cart to its place on the road, then tap the milestone it will roll to.`)}
  return{S,load,roads:()=>roads,dbg:()=>({F:null,ans:S.q&&S.q.step?F(roundTo(S.v,S.q.step)):null,tri:S.q&&S.q.kind==='triple'?roads.map(r=>F(roundTo(S.v,r.step))):null,want:S.q&&S.q.kind==='many'?S.carts.filter(c=>Math.abs(roundTo(c.v,S.q.step)-S.q.target)<1e-9).map(c=>F(c.v)):null,cartLabs:S.carts.map(c=>c.v!=null?F(c.v):null),wheel:S.q&&S.q.step?roundTo(S.v,S.q.step):null,pa:S.pa?S.pa.get():null,pxy:S.q&&S.q.kind==='paint'&&roads[0]?[S.q.target-S.q.step/2,S.q.target+S.q.step/2-S.q.snap,...(S.pa?S.pa.get():[])].map(v=>[roads[0].xOf(v),roads[0].yOf(v)+30]):null,r:S.r,v:S.v,at:S.at,kind:S.q&&S.q.kind,q:S.q,picks:S.picks,carts:S.carts.map(c=>c.v),busy:S.busy,won:S.won,cx:cart?[cart.x,cart.y]:null,xs:roads[0]?[roads[0].xOf(S.v),roads[0].yOf(S.v)]:null})}}

/* ---------- 5. Big Hills: rounding to the nearest 100 and 1,000 ---------- */
W.bighills={scene:'road',
notes:`<p>The same hills, bigger. Milestones every 100, with a little mark every 10: she drags the numbered cart to its spot (that's reading the number on a line), taps the milestone it will roll to, and Go. Then hills of 1,000 with marks every 100. Then one cart on three roads at once, hills of 10, 100 and 1,000, so she sees the same number round to three different milestones. Last, a row of carts: tap every one that ends up at 700 (650 sits on the peak and gets blown on).</p>`,
mount(root){
  const E=roadRounds('bighills',root,[
    {kind:'place',lo:300,hi:600,step:100,tick:10,snap:10,vs:[380,420,530,470,560],say:'Hills of 100 now, with a mark every 10. Drag the cart to its place, then tap the milestone it will roll to.'},
    {kind:'place',lo:300,hi:700,step:100,tick:10,snap:10,vs:[650,350,550]},
    {kind:'place',lo:2000,hi:6000,step:1000,tick:100,snap:100,vs:[3700,4300,2600,5300,4800],say:'Hills of 1,000, a mark every 100. Drag the cart to its place, then pick the milestone.'},
    {kind:'triple',vs:[4637,2584,7362,3449]},
    {kind:'many',lo:600,hi:800,step:100,tick:10,target:700,sets:[[620,650,690,720,750,780],[610,640,680,710,740,770],[630,660,700,730,760,790]]}],{unlockK:'rbig'});
  W.bighills.dbgQ=E.dbg;E.S.r=resumeAt(5);E.load();
}};
