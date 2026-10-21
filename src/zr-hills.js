/* ---------- 4. The Hills: rounding to the nearest 10 ---------- */
W.hills={scene:'road',
notes:`<p>Rounding, as something that happens. The road runs over hills with a milestone in every valley, every 10. Dex parks the cart on a slope; before he lets go she taps the milestone she thinks it will roll to, then Go: it rolls downhill to the nearer one. The first two rounds have no numbers at all, just the slope. Then the cart has a number on it and she places it on the road herself (counting the little marks from the milestone) before predicting. A cart on exactly 35 balances on the peak until a puff of wind nudges it on: halfway always rounds up. Last, a row of carts: tap every one that will end up at 40.</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=[{lo:0,hi:30,blank:1,vs:[13,27,22,8]},{lo:0,hi:30,blank:1,vs:[14,16,24,26]},{lo:20,hi:50,place:1,vs:[37,43,32,46,28]},{lo:20,hi:50,place:1,vs:[35,45,25]},{lo:30,hi:50,many:1}];
  const S={r:0,busy:false,won:false,v:0,at:null,pick:null,sel:new Set(),carts:[]};
  const roadL=el('g',{},root),cartL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let road=null,cart=null,dex=null,flag=null;
  const st=navStone({label:'Next hill',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this hill again',onTap:()=>load()});
  const parts=done=>{const q=R[S.r];return q.many?[['t','carts that roll to'],['w',40]]:q.blank?[['t','which milestone?']]:[['w',S.v],['o','≈'],done?['w',roundTo(S.v,10)]:['o','?']]};
  function drawRoad(){roadL.innerHTML='';const q=R[S.r];road=hillRoad(roadL,{lo:q.lo,hi:q.hi,step:10,tick:q.blank?0:1,lab:!q.blank,base:470,x0:44,x1:556});
    road.stones.forEach(({v,m})=>{const hit=el('rect',{x:-24,y:-50,width:48,height:80,fill:'transparent'},m.g);if(q.many)return;
      interact(m.g,{label:q.blank?`Milestone ${road.stones.findIndex(s=>s.v===v)+1}`:`Milestone ${v}`,tap:()=>{if(S.busy||S.won)return;if(q.place&&S.at==null){say(`First drag the cart to ${S.v} on the road.`);return}S.pick=v;SFX.tick(v/10);drawFlag()}})})}
  function drawFlag(){if(flag)flag.remove();if(S.pick==null)return;const x=road.xOf(S.pick),y=road.yOf(S.pick);flag=el('g',{transform:`translate(${x},${y-34})`},roadL);el('line',{x1:0,y1:0,x2:0,y2:-34,stroke:'#5a3a24','stroke-width':2.5},flag);el('path',{d:'M0,-34 L22,-27 L0,-20Z',fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},flag);popIn(flag,.4)}
  function check(){if(S.busy||S.won)return;const q=R[S.r];
    if(q.many){if(!S.sel.size){say('Tap the carts that will end up at the 40 milestone.');return}S.busy=true;let left=S.carts.length;
      S.carts.forEach(c=>road.roll(c.o,c.v,end=>{c.end=end;if(--left===0)judgeMany()},{wind:()=>gust(cartL,road.xOf(c.v),road.yOf(c.v)-40)}));return}
    if(q.place&&S.at==null){say(`Drag the cart along the road to ${S.v} first.`);return}
    if(q.place&&S.at!==S.v){SFX.clonk();say(`Is that ${S.v}? Count the little marks from the milestone.`);return}
    if(S.pick==null){say('Tap the milestone you think it will roll to.');return}
    S.busy=true;say('Dex lets go…');
    road.roll(cart,S.v,end=>{if(end===S.pick){win(end);return}SFX.wrong();shake(2);
      const mid=Math.abs(S.v-roundTo(S.v,10))===5||(S.v%10===5);
      say(mid?`Exactly halfway, so it balanced on the top until the wind blew it on to ${end}. On the Old Road the wind always blows forwards: halfway always rounds up.`:q.blank?'It rolled down to the nearer milestone. Look which side of the hilltop it’s on.':`${S.v} is ${Math.abs(end-S.v)} from ${end} but ${Math.abs(S.pick-S.v)} from ${S.pick}: it rolls to the nearer one.`);
      later(3400,()=>{S.busy=false;load(true)})},{wind:()=>{gust(cartL,road.xOf(S.v),road.yOf(S.v)-40);say('Exactly halfway: balanced on the top… and the wind always blows forwards!')}})}
  function judgeMany(){const want=new Set(S.carts.filter(c=>c.end===40).map(c=>c.v)),got=S.sel;
    if(want.size===got.size&&[...want].every(v=>got.has(v))){win(40);return}SFX.wrong();shake(2);
    const missed=[...want].filter(v=>!got.has(v)),wrong=[...got].filter(v=>!want.has(v));
    say(wrong.length?`${wrong[0]} rolled to ${roundTo(wrong[0],10)}, not 40.${wrong[0]%10===5?' Exactly halfway, so the wind blew it on.':''}`:missed[0]%10===5?`${missed[0]} is exactly halfway, so the wind blew it on to 40.`:`${missed[0]} rolled to 40 too: it’s nearer 40 than ${missed[0]<40?30:50}.`);later(3600,()=>{S.busy=false;load(true)})}
  function win(end){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();decQ(qL,parts(true),true,guide);burst(road.xOf(end),road.yOf(end)-30,{n:16});const q=R[S.r];
    say(q.many?`${[...S.sel].sort((a,b)=>a-b).join(', ')} all end up at 40${S.sel.has(35)?' (35 is exactly halfway, so the wind blows it on)':''}.`:q.blank?'Right down into the valley: the nearer milestone.':S.v%10===5?`${S.v} is exactly halfway, so it balanced on the top. The wind always blows forwards, so it rolled on: halfway rounds up. ${S.v} rounds to ${end}.`:`${S.v} is only ${Math.abs(end-S.v)} from ${end}. ${S.v} rounds to ${end}.`);
    if(S.r>=2)unlock('rhills');later(1400,()=>st.ready(true))}
  function load(again){EPOCH++;FX.innerHTML='';cartL.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);flag=null;const q=R[S.r];
    const prev=S.v;Object.assign(S,{busy:false,won:false,at:null,pick:null,sel:new Set(),carts:[]});S.v=q.vs?pick(q.vs.filter(v=>v!==prev).length?q.vs.filter(v=>v!==prev):q.vs):0;
    if(!again)st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawRoad();decGo(ui,548,250,'Let go',check,'Go');dex=null;
    if(q.many){const vs=pick([[33,35,38,41,45,48],[34,36,39,42,44,47],[31,35,37,40,43,46],[32,34,36,41,45,49]]);
      S.carts=vs.map((v,i)=>{const o=cartFig(cartL,{s:.66,sacks:1,tag:String(v),handle:false,lift:i%2?34:0});road.place(o,v);const c={v,o};
        interact(o.tagG,{label:`Cart ${v}`,tap:()=>{if(S.busy||S.won)return;S.sel.has(v)?S.sel.delete(v):S.sel.add(v);SFX.tick(v%8);o.tagBox.setAttribute('stroke',S.sel.has(v)?'#ffd23a':'#7a5a3a');o.tagBox.setAttribute('stroke-width',S.sel.has(v)?5:2);o.tagBox.setAttribute('fill',S.sel.has(v)?'#fff0a0':'#fff4e6')}});return c});
      say('Tap every cart that will end up at the 40 milestone, then Go.');return}
    cart=cartFig(cartL,{s:.9,tag:q.blank?null:String(S.v)});
    if(q.place){cart.put(78,170,0);
      const shelf=el('g',{},cartL);el('text',{x:78,y:192,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#3a2418'},shelf).textContent='drag me';
      interact(cart.g,{label:`The ${S.v} cart: drag it onto the road`,down:()=>({}),move:p=>{if(S.busy||S.won)return;shelf.remove();const v=clamp(Math.round(road.vOf(p.x)),q.lo,q.hi);if(v!==S.at){S.at=v;road.place(cart,v);SFX.tick(v%8)}},tap:()=>{}});
      say(S.r===2?`This cart is ${S.v}. Drag it to ${S.v} on the road, then tap the milestone it will roll to.`:`This cart is exactly halfway between two milestones. Drag it onto the road. Which way will it go? Look at the windsock.`)}
    else{road.place(cart,S.v);
      say(S.r===0?'Dex has stopped the cart on a hill. When he lets go, which milestone will it roll to? Tap it, then Go.':'Close to the top this time! Which milestone will it roll down to?')}}
  W.hills.dbgQ=()=>({r:S.r,v:S.v,at:S.at,pick:S.pick,busy:S.busy,won:S.won,carts:S.carts.map(c=>c.v),xs:road?[road.xOf(S.v),road.yOf(S.v)]:null,cx:cart?[cart.x,cart.y]:null});
  S.r=resumeAt(R.length);load();
}};
