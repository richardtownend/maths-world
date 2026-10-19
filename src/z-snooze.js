/* ---------- 7. The Snooze: the boss of the Clockwork Isles ---------- */
W.snooze={scene:'clockwork',
notes:`<p>The finale of the Clockwork Isles. The Snooze, a giant sleepy sloth, has stopped the clock tower. Six cogs wind it back up, one from each island and each done that island's way: the short hand on its own (wake up at half past 7), the pizza clock, the snail's stones, ribbons for a train journey, sand timers worked backwards, and the frog on the calendar. Each right answer plays out on the clock (Tock's cuckoo, the pizza clock winding on, the snail's minute hand sweeping round, the train running, the ready clock ticking on, the birthday cake on the frog's pad), then winds a cog and the Snooze stirs.</p>
<p>Three alarm bells: a wrong answer and one stops ringing (the next try uses a different time); lose all three and a cog unwinds. Wind all six and the tower chimes and the Snooze wakes up.</p>`,
mount(root){
  const Q=[{t:'sun',v:[[450],[510]]},{t:'pie',v:[[10,3],[6,1]]},{t:'lap',v:[[4,5],[8,8]]},{t:'rail',v:[[615,705],[150,195]]},{t:'sand',v:[[60,[60,15]],[420,[30,15]]]},{t:'frog',v:[[9,9],[8,6]]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const sn=snoozeFig(side,{s:.6});sn.g.setAttribute('transform','translate(528,150)');const lifeL=el('g',{},hud),cogL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*32},34)`},lifeL);
    el('circle',{r:12,fill:on?'#ffc04d':'#3a3450',stroke:on?'#c98a1a':'#55536a','stroke-width':2},g);[-1,1].forEach(sd=>el('circle',{cx:sd*9,cy:-11,r:4,fill:on?'#ffc04d':'#3a3450'},g));el('path',{d:'M0,0 V-6 M0,0 L4,2',stroke:'#3a2418','stroke-width':1.5},g)}}
  function drawCogs(){cogL.innerHTML='';for(let k=0;k<6;k++){const g=el('g',{transform:`translate(${30+k*26},70)`},cogL),on=k<S.r;for(let i=0;i<8;i++)el('rect',{x:-2.5,y:-11,width:5,height:6,fill:on?'#ffc04d':'#4a3a50',transform:`rotate(${i*45})`},g);el('circle',{r:7,fill:on?'#ffc04d':'#4a3a50'},g)}}
  let loopT=0,cur=null;
  const M={
    sun([t]){const ck=clockKit(arena,{x:240,y:320,r:112,minute:false});ck.set(0);dragHour(ck,{snap:15,label:'Clock: drag the hour hand',can:()=>!S.busy});
      return{say:`Set the Snooze’s alarm for ${tWords(t)}. Drag the short hand.`,go:'Check',check:()=>ck.get()%720===t?{ok:true,msg:`${capF(tWords(t))}: ${t%60?'halfway between the numbers':'right on the number'}.`,anim:d=>{const n=t%60?1:tH(t);let k=0;const f=()=>{if(k++>=n){d();return}cuckooSound();ring(240,320,{col:'#ffc04d',r0:40,r1:140});later(480,f)};f()}}:{ok:false,msg:`That’s ${tWords(ck.get())}.`}}},
    pie([h0,e]){const pz=pizzaClock(arena,{x:240,y:320,r:112}),t=h0*60+e*15;pz.set(h0*60);dragEat(pz,{onChange:n=>pz.set(h0*60+n*15),can:()=>!S.busy});
      return{say:`The Snooze’s breakfast is at ${tWords(t)}. Drag the minute hand round the pizza.`,go:'Check',check:()=>pz.eaten()===e?{ok:true,msg:`${capF(tWords(t))}: ${['','a quarter eaten','half eaten','a quarter left'][e]}.`,anim:d=>{pz.set(h0*60);SFX.whoosh&&SFX.whoosh();pz.glide(t,1100,d)}}:{ok:false,msg:e===3?'Quarter to: a quarter is left.':e===1?'Quarter past: a quarter is eaten.':'Half past: half is eaten.'}}},
    lap([h,s]){const sc=snailClock(arena,{x:240,y:320,r:96});sc.hour(h);sc.jump(0);const t=h*60+s*5,hit=el('circle',{cx:240,cy:320,r:150,fill:'transparent'},arena);
      interact(hit,{label:'Snail: tap a stone',tap:p=>{if(S.busy||!p)return;sc.crawl(sc.stoneAt(p))}});hit.addEventListener('keydown',e=>{if(S.busy)return;if(e.key==='ArrowRight'){e.preventDefault();sc.jump(sc.pos()+1)}if(e.key==='ArrowLeft'){e.preventDefault();sc.jump(sc.pos()-1)}});
      return{say:`The Snooze’s bus comes at ${tWords(t)}. Move the snail: 5 minutes a stone.`,go:'Check',check:()=>sc.pos()===s?{ok:true,msg:`${s} stones: ${tWords(t)}, or ${digi(t)}.`,anim:d=>{sc.set(h*60);SFX.whoosh&&SFX.whoosh();sc.glide(t,1100,()=>{digiBoard(arena,420,200,digi(t));later(700,d)})}}:{ok:false,msg:`${tWords(t)} is ${s<=6?`${s} stones from the top`:`${12-s} stones before the top`}.`}}},
    rail([a,b]){const big=clockKit(arena,{x:210,y:316,r:86});big.set(a);el('text',{x:210,y:448,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#fff4e6'},arena).textContent='leaves';
      const sm=clockKit(arena,{x:420,y:250,r:44});sm.set(b);el('text',{x:420,y:190,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#fff4e6'},arena).textContent='arrives';
      const rib=ribbonRing(arena,big);rib.start(a);
      [[60,'An hour'],[30,'Half an hour'],[15,'A quarter']].forEach(([d,lab],i)=>{const g=el('g',{transform:`translate(530,${296+i*48})`},pane);el('rect',{x:-58,y:-18,width:116,height:36,rx:10,fill:RIB[d].col,stroke:darker(RIB[d].col,.6),'stroke-width':2.5},g);
        el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},g).textContent=lab;interact(g,{label:`Ribbon: ${lab.toLowerCase()}`,tap:()=>{if(!S.busy&&rib.add(d))SFX.pop(1.1)}})});
      const un=el('g',{transform:'translate(530,440)'},pane);el('rect',{x:-40,y:-14,width:80,height:28,rx:9,fill:'#3a3058',stroke:'#c9a24a','stroke-width':2},un);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},un).textContent='take one off';interact(un,{label:'Take a ribbon off',tap:()=>{if(!S.busy)rib.pop()}});
      return{say:'How long is the Snooze’s train ride? Wrap ribbons from leaving to arriving.',go:'Go: run the train',check:()=>{const s=rib.sum();return s===b-a?{ok:true,msg:`${capF(spanWords(b-a))}: ${tWords(a)} to ${tWords(b)}.`,anim:d=>{const tr=trainFig(arena,.7);tr.setAttribute('transform','translate(60,480)');SFX.rumble&&SFX.rumble();big.glide(b,1400);tween(1400,(x,p)=>tr.setAttribute('transform',`translate(${lerp(60,400,ease.inOut(p)).toFixed(1)},480)`),d)}}:{ok:false,msg:s<b-a?'Too short: the train hasn’t arrived.':'Too long: the train got there first.'}}}},
    sand([b,tm]){const d=tm.reduce((x,y)=>x+y,0),A=clockKit(arena,{x:150,y:352,r:66}),B=clockKit(arena,{x:340,y:352,r:66});A.set(b);B.set(b);
      el('text',{x:150,y:446,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#fff4e6'},arena).textContent='in the oven';el('text',{x:340,y:446,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#fff4e6'},arena).textContent='ready';
      const card=el('g',{},arena),w=70+tm.length*44+60;el('rect',{x:240-w/2,y:128,width:w,height:112,rx:12,fill:'#fff8ec',stroke:'#c9a77a','stroke-width':3},card);dishPic(card,240-w/2+38,196,'cake');tm.forEach((t,i)=>sandTimer(card,240-w/2+92+i*44,228,t,{s:.9}));
      dragWind(A,{snap:15,min:b-240,max:b,label:'Oven clock: wind it back',can:()=>!S.busy});
      return{say:`The Snooze’s cake must be ready by ${tWords(b)}. Wind the oven clock back.`,go:'Check',check:()=>A.get()+d===b?{ok:true,msg:`In at ${tWords(b-d)}: ${spanWords(d)} later it’s ${tWords(b)}.`,anim:dn=>{B.set(b-d);SFX.whoosh&&SFX.whoosh();B.glide(b,1200,()=>{bell(noteHz(9),.08,1.4);dn()})}}:{ok:false,msg:A.get()+d<b?'Too early: it would be ready before the bell.':'Too late: it won’t be ready when the bell rings.'}}},
    frog([t,n]){const pond=frogPond(arena,{today:t}),gl=t+n;
      const pad=el('g',{transform:'translate(530,340)'},pane);[['▲','up a week',0,-46,-7],['▼','down a week',0,46,7],['◀','back a day',-46,0,-1],['▶','on a day',46,0,1]].forEach(([s,lab,dx,dy,d])=>{const b=el('g',{transform:`translate(${dx},${dy})`},pad);
        el('circle',{r:21,fill:'#2a5a4a',stroke:'#fff0a0','stroke-width':2.5},b);el('text',{y:7,'text-anchor':'middle','font-size':18,fill:'#fff0a0'},b).textContent=s;interact(b,{label:`Hop ${lab}`,tap:()=>{if(S.busy)return;S.busy=true;pond.hop(pond.pos()+d,()=>{S.busy=false})}})});
      const ev=n===9?`a week on ${DAYS[gl%7]}`:`${n} sleeps away`;
      return{say:`Today is ${DAYS[t%7]}. The Snooze’s birthday is ${ev}. Hop the frog there.`,go:'Check: the frog stops here',check:()=>pond.pos()===gl?{ok:true,msg:`${DAYS[gl%7]}!`,anim:d=>{pond.mark(gl,'🎂');later(700,d)}}:{ok:false,msg:`That’s ${DAYS[pond.pos()%7]}${Math.floor(pond.pos()/7)!==Math.floor(gl/7)?' in the wrong week':''}.`}}}};
  function hit(msg){S.busy=true;sn.stir();SFX.chime();SFX.whoosh&&SFX.whoosh();shake(3);floatText(530,90,['Mmph!','Zzz…?','Huh?','Yawn!','Five more minutes…','Wha…?'][S.r],{col:'#ffc04d',size:20});
    decQ(qL,[['t','Cog wound!']],true,null);say(`${msg} A cog winds up!`);S.r++;drawCogs();later(2800,()=>{if(S.r>=Q.length)finale();else load()})}
  function miss(msg){S.busy=true;SFX.wrong();S.lives--;drawLives();shake(3);ring(30+S.lives*32,34,{col:'#9a9aae',r1:40});say(`${msg} The Snooze snores on…`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(3600,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;sn.unstir();drawCogs()}say('All the alarm bells stopped, and a cog unwound. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;arena.innerHTML='';pane.innerHTML='';sn.wake();tween(700,t=>sn.g.setAttribute('transform',`translate(${lerp(528,420,t).toFixed(1)},${lerp(150,330,t).toFixed(1)}) scale(${(1+t*.5).toFixed(2)})`));SFX.fanfare();
    const tw=towerClockFig(arena,{going:true});tw.g.setAttribute('transform','translate(240,330) scale(1.6)');popIn(tw.g,.3);loop(dt=>{loopT+=dt;tw.tick(loopT)});
    for(let k=0;k<6;k++)later(k*420,()=>bell(noteHz([7,9,11,12,11,7][k]),.09,1.6));for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*360,120+Math.random()*320,{n:10,cols:['#ffc04d','#ff9a3a','#8fd6ff','#ff9ed2']}));
    decQ(qL,[['t','The clocks are ticking!']],true,null);say('The tower chimes and the Snooze is awake (and grumpy). Every clock is ticking again. You did it!');unlock('snooze');clearIsland('snooze');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};go('snooze')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,S.r,true);drawLives();drawCogs();
    loop(dt=>{loopT+=dt;sn.tick(loopT)});const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t',`cog ${S.r+1} of 6`]],false,null);
    decGo(arena,540,500,cur.go,()=>{if(S.busy)return;const r=cur.check();if(r.ok){if(r.anim){S.busy=true;r.anim(()=>hit(r.msg))}else hit(r.msg)}else miss(r.msg)},cur.go.startsWith('Go')?'Go':'Check');
    say(S.r===0&&S.lives===3&&!S.vr[0]?`Wind six cogs to wake the Snooze! Wrong answers stop alarm bells. ${cur.say}`:cur.say)}
  W.snooze.dbgQ=()=>({t:Q[S.r].t,v:V(),r:S.r});
  load();
}};
