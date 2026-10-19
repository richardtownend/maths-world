/* ---------- 7. Captain Grabbit: the boss of the Pirate Isles ---------- */
W.grabbit={scene:'cove',
notes:`<p>The finale of the Pirate Isles. Captain Grabbit, a greedy crab, is sitting on everyone's treasure. He hands a piece back for each puzzle solved, one from each island and each done that island's way: swap coins for one coin, pay with the fewest coins, count up the change along the strip, give one pirate a fair share (swapping at the bank if needed), price a rug that's already cut into tens and ones, and plant the flag on the week the jar reaches the line.</p>
<p>Three feathers: a wrong answer loses one (the next try is a different puzzle); lose all three and Grabbit snatches a piece back. Win all six and Grabbit scuttles off and the chest is open.</p>`,
mount(root){
  const Q=[
    {t:'swap',v:[{tgt:50,pile:[20,20,10,10,5,5,2,1]},{tgt:100,pile:[50,20,20,20,10,5,2,1]}]},
    {t:'tuck',v:[{p:65,purse:[50,20,10,10,5,5,2,1]},{p:85,purse:[50,20,20,10,5,5,2,1]}]},
    {t:'change',v:[{p:265,g:500},{p:640,g:1000}]},
    {t:'loot',v:[{A:84,N:3},{A:72,N:3}]},
    {t:'rug',v:[{a:23,b:14},{a:26,b:12}]},
    {t:'save',v:[{wk:400,price:2600},{wk:500,price:2800}]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const chest=chestFig(side,{});chest.g.setAttribute('transform','translate(540,190)');const gb=grabbitFig(side,{s:.75});gb.g.setAttribute('transform','translate(540,140)');
  const lifeL=el('g',{},hud),trL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*30},34) rotate(-30)`},lifeL);
    el('path',{d:'M0,14 Q-9,0 0,-14 Q9,0 0,14Z',fill:on?'#e8413e':'#3a3450',stroke:on?'#8a2424':'#55536a','stroke-width':2},g);el('line',{x1:0,x2:0,y1:14,y2:-10,stroke:on?'#ffd23a':'#55536a','stroke-width':1.5},g)}}
  function drawTreasure(){trL.innerHTML='';for(let k=0;k<6;k++){const on=k<S.r,g=el('g',{transform:`translate(${30+k*26},70)`},trL);el('circle',{r:10,fill:on?'#ffd23a':'#4a3a50',stroke:on?'#a8743a':'#55536a','stroke-width':2},g);if(on)el('text',{y:4,'text-anchor':'middle','font-size':10,'font-weight':900,fill:'#7a4a1e'},g).textContent='£'}}
  let loopT=0,cur=null;
  const box=(p,x,y,w,h,t)=>{el('rect',{x,y,width:w,height:h,rx:10,fill:'rgba(34,24,48,.75)',stroke:'#ffc04d','stroke-width':2.5},p);if(t)el('text',{x:x+12,y:y+18,'font-size':12,'font-weight':800,fill:'#fff0a0'},p).textContent=t};
  /* coins that move between two places by tapping */
  function coinPair(q,{from,to,fromXY,toXY,fromL,toL,max=12,onChange}){const L=el('g',{},arena);
    const draw=()=>{L.innerHTML='';[...from].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).forEach(([v,i],k)=>{const p=fromXY(k),c=moneyPiece(L,p.x,p.y,v,{s:1.25});interact(c,{label:`Coin ${fmtP(v)} (${fromL})`,tap:()=>{if(S.busy||to.length>=max)return;to.push(from.splice(i,1)[0]);SFX.clink&&SFX.clink();draw();onChange&&onChange()}})});
      to.forEach((v,i)=>{const p=toXY(i),c=moneyPiece(L,p.x,p.y,v,{s:1.25});interact(c,{label:`Coin ${fmtP(v)} (${toL})`,tap:()=>{if(S.busy)return;from.push(to.splice(i,1)[0]);SFX.pop(.8);draw();onChange&&onChange()}})})};draw();return{draw}}
  const M={
    swap(q){const pile=[...q.pile],hop=[];box(arena,40,150,240,170,'your coins');box(arena,300,150,130,170,'swap machine');
      el('text',{x:365,y:278,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff4e6'},arena).textContent='makes one';moneyPiece(arena,365,302,q.tgt,{s:1.2});
      const cp=coinPair(q,{from:pile,to:hop,fromL:'pile',toL:'hopper',fromXY:k=>({x:72+(k%5)*44,y:200+Math.floor(k/5)*48}),toXY:k=>({x:324+(k%4)*28,y:188+Math.floor(k/4)*30})});
      return{say:`Grabbit wants one ${fmtP(q.tgt)} coin. Swap some of your coins for it.`,go:'Swap!',check:()=>sum(hop)===q.tgt?{ok:true,msg:`${hop.length} coins make one ${fmtP(q.tgt)}.`,anim:d=>{SFX.clink&&SFX.clink();bell(noteHz(10),.06,.8);burst(365,302,{n:10,cols:['#ffd23a']});later(600,d)}}:hop.length?{ok:false,msg:`Those make ${fmtP(sum(hop))}, not ${fmtP(q.tgt)}.`}:{ok:false,soft:true,msg:'Put coins in the machine first.'}}},
    tuck(q){const purse=[...q.purse],paid=[];sweetFig(arena,110,200,'drink',1.5);kgTag(arena,110,250,fmtP(q.p));box(arena,190,160,240,120,'the counter');box(arena,40,300,390,110,'your purse');
      const fewest=(()=>{let best=99;const n=purse.length;for(let m=1;m<(1<<n);m++){let s=0,c=0;for(let i=0;i<n;i++)if(m&(1<<i)){s+=purse[i];c++}if(s===q.p&&c<best)best=c}return best})();
      coinPair(q,{from:purse,to:paid,fromL:'purse',toL:'counter',fromXY:k=>({x:76+(k%8)*46,y:350+Math.floor(k/8)*40}),toXY:k=>({x:222+(k%5)*44,y:210+Math.floor(k/5)*40})});
      return{say:`Pay Grabbit ${fmtP(q.p)} with the fewest coins you can.`,go:'Pay',check:()=>{const t=sum(paid);if(!paid.length)return{soft:true,msg:'Tap coins onto the counter first.'};return t!==q.p?{ok:false,msg:t<q.p?'Not enough.':'Too much.'}:paid.length>fewest?{ok:false,msg:'Right money, but you can use fewer coins.'}:{ok:true,msg:`${fmtP(q.p)} in ${paid.length} coins.`,anim:d=>{SFX.clink&&SFX.clink();later(500,d)}}}}},
    change(q){const d=q.g-q.p,laid=[],X0=60,W0=340,Y=280,u=W0/d,stripL=el('g',{},arena);
      const tag=el('g',{transform:'translate(150,180)'},arena);el('rect',{x:-86,y:-30,width:172,height:60,rx:10,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},tag);el('text',{y:-6,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#3a2418'},tag).textContent=`Grabbit’s hat: ${fmtP(q.p)}`;el('text',{y:16,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#3a2418'},tag).textContent=`he pays ${fmtP(q.g)}`;
      const draw=()=>{stripL.innerHTML='';el('rect',{x:X0,y:Y,width:W0,height:22,rx:6,fill:'rgba(255,244,230,.35)',stroke:'#fff4e6','stroke-width':2},stripL);
        for(let m=Math.ceil(q.p/100)*100;m<q.g;m+=100){const x=X0+(m-q.p)*u;el('line',{x1:x,x2:x,y1:Y-6,y2:Y+28,stroke:'#3a2418','stroke-width':2},stripL)}
        el('line',{x1:X0+W0,x2:X0+W0,y1:Y-34,y2:Y+28,stroke:'#3a2418','stroke-width':3},stripL);el('path',{d:`M${X0+W0},${Y-34} l22,7 l-22,7Z`,fill:'#e8413e'},stripL);
        let at=0;laid.forEach(v=>{const x=X0+at*u;if(x>X0+W0+40){at+=v;return}const w=Math.min(v*u,X0+W0+50-x);el('rect',{x,y:Y+2,width:Math.max(2,w-1),height:18,rx:3,fill:at+v>d?'#e8613e':v>=100?'#ffd23a':'#d8dce4',stroke:'#3a2418','stroke-width':1},stripL);at+=v})};
      [5,10,20,50,100,200,500].forEach((v,i)=>{const c=moneyPiece(arena,70+i*52,370,v,{s:1.2});interact(c,{label:`Till: ${fmtP(v)}`,tap:()=>{if(S.busy||laid.length>=14)return;laid.push(v);SFX.clink&&SFX.clink();draw()}})});
      const un=el('g',{transform:'translate(230,420)'},arena);el('rect',{x:-56,y:-14,width:112,height:28,rx:9,fill:'#3a3058',stroke:'#c9a24a','stroke-width':2},un);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},un).textContent='take one back';interact(un,{label:'Take the last coin back',tap:()=>{if(!S.busy&&laid.length){laid.pop();SFX.pop(.8);draw()}}});draw();
      return{say:`Count up Grabbit’s change from ${fmtP(q.p)} to ${fmtP(q.g)}.`,go:'Check the change',check:()=>{const t=sum(laid);if(!laid.length)return{soft:true,msg:'Tap coins from the till first.'};return t===d?{ok:true,msg:`${fmtP(q.p)} up to ${fmtP(q.g)}: ${fmtP(d)} change.`,anim:dn=>{burst(X0+W0,Y,{n:12,cols:['#ffd23a']});later(500,dn)}}:{ok:false,msg:t<d?'The coins stop short of the flag.':'The coins go past the flag.'}}}},
    loot(q){const mid={1000:Math.floor(q.A/10),100:q.A%10},each={1000:0,100:0},NMs={1000:['£10 note','£10 notes'],100:['£1 coin','£1 coins']};let plan=0,col=1000,phase='deal';
      box(arena,40,150,280,140,'the loot');const L=el('g',{},arena);const px=i=>90+i*110;
      for(let i=0;i<q.N;i++)pirateFig(arena,px(i),360,i,1);el('text',{x:90,y:326,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff0a0'},arena).textContent='first pirate';
      const swapOne=()=>{mid[1000]--;mid[100]+=10;SFX.whoosh();if(!mid[1000]){col=100;phase='deal';say('Swapped! Now share the £1 coins.')}else say(`One £10 note became ten £1 coins. ${mid[1000]} more to swap.`);draw()};
      const draw=()=>{L.innerHTML='';[1000,100].forEach(v=>{for(let j=0;j<mid[v];j++){const x=v===1000?76+(j%6)*44:62+(j%14)*18,y=v===1000?190+Math.floor(j/6)*26:246+Math.floor(j/14)*18,c=moneyPiece(L,x,y,v,{s:v===1000?.75:.6});if(v!==col)c.setAttribute('opacity',.55);
          interact(c,{label:`Loot: ${NMs[v][0]}`,tap:()=>{if(S.busy)return;if(v!==col){say(v===100?'Biggest first: share the £10 notes before the £1 coins.':'Those are shared already.');return}if(phase==='swap'){swapOne();return}mid[v]--;plan++;SFX.clink&&SFX.clink();draw()}})}});
        for(let i=0;i<q.N;i++)[1000,100].forEach((v,j)=>{const n=each[v]+(i===0&&v===col&&phase==='deal'?plan:0);for(let k2=0;k2<n;k2++){const c=moneyPiece(L,px(i)+30+j*28,446-k2*(v===100?6:7),v,{s:v===1000?.55:.8});
          if(i===0&&v===col&&k2>=each[v]&&k2===n-1)interact(c,{label:`First pirate: ${NMs[v][0]}`,tap:()=>{if(S.busy)return;mid[v]++;plan--;SFX.pop(.8);draw()}})}})};
      const bk=el('g',{transform:'translate(380,220)'},arena);el('rect',{x:-42,y:-46,width:84,height:92,rx:8,fill:'#e8d8b8',stroke:'#7a5a3a','stroke-width':3},bk);el('text',{y:-26,'text-anchor':'middle','font-size':13,'font-weight':900,fill:'#3a2418'},bk).textContent='BANK';
      moneyPiece(bk,0,0,1000,{s:.7});el('text',{y:30,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},bk).textContent='1 ↔ 10';
      interact(bk,{label:'The bank: swap a leftover',tap:()=>{if(S.busy)return;if(phase==='swap')swapOne();else say('The bank swaps leftovers that won’t go round. Share first, then swap what’s left.')}});draw();
      const share=q.A/q.N;
      return{say:`Share £${q.A} fairly between ${q.N}, biggest first. Tap notes to give the first pirate a fair share, then Deal.`,go:'Deal',check:()=>{
        if(phase==='swap')return{soft:true,msg:'Tap the leftover notes to swap them at the bank first.'};
        const v=col;let cnt=mid[v]+plan,note='';if(!plan&&cnt>=q.N)return{soft:true,msg:`Tap ${NMs[v][1]} to give the first pirate his share, then Deal.`};if(cnt<q.N&&plan){mid[v]=cnt;plan=0;note=`Only ${cnt} for ${q.N} pirates, so each gets none. `}const n=plan;
        if(n*q.N>cnt)return{ok:false,msg:`Not enough ${NMs[v][1]} for everyone to get ${n}.`};
        if(cnt-n*q.N>=q.N)return{ok:false,msg:`There are enough ${NMs[v][1]} left for everyone to get another.`};
        each[v]=n;mid[v]=cnt-n*q.N;plan=0;SFX.chime();
        if(v===1000){if(mid[1000]){phase='swap';draw();return{soft:true,msg:`${note}${mid[1000]} ${mid[1000]>1?'notes':'note'} left: not enough to go round. Tap ${mid[1000]>1?'them':'it'} to swap at the bank.`}}col=100;draw();return{soft:true,msg:`Everyone has ${n} ${n===1?'note':'notes'}. Now the £1 coins.`}}
        draw();return{ok:true,msg:`£${share} each: ${q.N} lots of £${share} is £${q.A}.`,anim:d=>{later(600,d)}}}}},
    rug(q){const xs=tenCuts(q.a),ys=tenCuts(q.b),G=8,c=Math.min((330-(xs.length-2)*G)/q.a,(230-(ys.length-2)*G)/q.b,14),X=50,Y=160;
      for(let j=0;j<ys.length-1;j++)for(let i=0;i<xs.length-1;i++)rugPiece(arena,X+xs[i]*c+i*G,Y+ys[j]*c+j*G,xs[i+1]-xs[i],ys[j+1]-ys[j],c);
      el('text',{x:X,y:Y-12,'font-size':13,'font-weight':800,fill:'#fff4e6'},arena).textContent=`${q.a} squares long, ${q.b} wide: £1 a square`;
      const wh=digitWheels(pane,{x:540,y:360,digits:3,label:'Price'});
      return{say:'Grabbit wants this rug, £1 a square. It’s cut at every ten. What does it cost?',go:'Check the price',check:()=>wh.get()===q.a*q.b?{ok:true,msg:`${q.a} × ${q.b} = £${q.a*q.b}.`,anim:d=>{wh.lock(true);burst(200,260,{n:14,cols:['#ffd23a','#e8413e']});later(700,d)}}:{ok:false,msg:'That’s not it. Price each piece, then add them.'}}},
    save(q){const JX=120,JB=430,JH=240,sc=JH/(q.price*1.3),lineY=JB-q.price*sc,fillG=el('g',{},arena);let flag=0;
      el('path',{d:`M${JX-50},${JB-JH} V${JB}  H${JX+50} V${JB-JH}`,fill:'rgba(220,240,255,.45)',stroke:'#fff','stroke-width':4},arena);el('line',{x1:JX-60,x2:JX+60,y1:lineY,y2:lineY,stroke:'#e8413e','stroke-width':3,'stroke-dasharray':'8 5'},arena);
      prizeFig(arena,JX+110,lineY-6,'bike',1);kgTag(arena,JX+110,lineY+32,fmtP(q.price));box(arena,260,150,170,80,'every week');moneyPiece(arena,300,200,q.wk>=500?q.wk:200,{s:1.2});if(q.wk===400)moneyPiece(arena,340,200,200,{s:1.2});
      const fill=v=>{fillG.innerHTML='';const h=v*sc;el('rect',{x:JX-46,y:JB-h,width:92,height:h,fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},fillG)};
      const cal=el('g',{},arena),drawCal=(hi=0)=>{cal.innerHTML='';for(let w=1;w<=10;w++){const g=el('g',{transform:`translate(${50+(w-1)*36},480)`},cal);el('rect',{x:-15,y:-18,width:30,height:36,rx:5,fill:w<=hi?'#ffe8a0':'#fff4e6',stroke:flag===w?'#e8413e':'#a8743a','stroke-width':flag===w?3:1.5},g);
        el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},g).textContent=w;if(flag===w){el('line',{x1:0,x2:0,y1:-20,y2:-50,stroke:'#3a2418','stroke-width':2.5},g);el('path',{d:'M0,-50 L18,-44 L0,-38Z',fill:'#e8413e'},g)}
        interact(g,{label:`Week ${w}`,tap:()=>{if(S.busy)return;flag=w;SFX.tick(w%8);drawCal()}})}};drawCal();
      const rw=Math.ceil(q.price/q.wk);
      return{say:'Grabbit’s saving for a bike. Plant the flag on the week the jar first reaches the line.',go:'Go: play the weeks',check:()=>!flag?{ok:false,msg:'Plant your flag first.',soft:true}:flag===rw?{ok:true,msg:`Week ${rw}: enough!`,anim:d=>{let w=0;const f=()=>{if(++w>rw){d();return}drawCal(w);tween(300,(t,p)=>fill((w-1+p)*q.wk),()=>{SFX.clink&&SFX.clink();later(100,f)})};f()}}:{ok:false,msg:flag<rw?`Week ${flag}: not up to the line yet.`:`It reaches the line sooner than week ${flag}.`}}}};
  function hit(msg){S.busy=true;gb.mood('oh');gb.shrink();SFX.chime();SFX.whoosh&&SFX.whoosh();shake(3);floatText(540,90,['Arr!','Me gold!','Blistering barnacles!','Nooo!','Shiver me shells!','Not the bike money!'][S.r],{col:'#ffd23a',size:20});
    const c=moneyPiece(side,540,170,100,{s:1.4});tween(700,(t,p)=>c.setAttribute('transform',`translate(${lerp(540,30+S.r*26,p).toFixed(1)},${(lerp(170,70,p)-Math.sin(p*Math.PI)*60).toFixed(1)}) scale(${(1.4-p*.6).toFixed(2)})`),()=>c.remove());
    decQ(qL,[['t','Treasure back!']],true,null);say(`${msg} Grabbit drops some treasure!`);later(700,()=>{S.r++;drawTreasure()});later(2800,()=>{gb.mood('');if(S.r>=Q.length)finale();else load()})}
  function miss(msg){S.busy=true;SFX.wrong();S.lives--;drawLives();shake(3);gb.mood('');SFX.laugh&&SFX.laugh();say(`${msg} Grabbit cackles…`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(3600,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;gb.grow();drawTreasure()}say('No feathers left, and Grabbit snatched some treasure back. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;arena.innerHTML='';pane.innerHTML='';gb.mood('sad');SFX.fanfare();
    tween(1400,(t,p)=>gb.g.setAttribute('transform',`translate(${lerp(540,820,p).toFixed(1)},${(140+Math.sin(p*Math.PI*8)*6).toFixed(1)})`));
    later(900,()=>{chest.g.remove();const ch=chestFig(side,{open:true});ch.g.setAttribute('transform','translate(300,330) scale(2)');popIn(ch.g,.3)});
    for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*460,140+Math.random()*300,{n:10,cols:['#ffd23a','#fff0a0','#e8413e','#4aa0ff']}));
    decQ(qL,[['t','The treasure is back!']],true,null);say('Captain Grabbit scuttles off and the treasure chest is open. You did it!');unlock('grabbit');clearIsland('grabbit');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};go('grabbit')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,S.r,true);drawLives();drawTreasure();
    loop(dt=>{loopT+=dt;gb.tick(loopT)});const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t',`treasure ${S.r+1} of 6`]],false,null);
    decGo(arena,560,500,cur.go,()=>{if(S.busy)return;const r=cur.check();if(r.soft){say(r.msg);return}if(r.ok){if(r.anim){S.busy=true;r.anim(()=>hit(r.msg))}else hit(r.msg)}else miss(r.msg)},cur.go.startsWith('Go')?'Go':cur.go==='Pay'?'Pay':cur.go==='Deal'?'Deal':cur.go==='Swap!'?'Swap':'Check');
    say(S.r===0&&S.lives===3&&!S.vr[0]?`Win back six treasures from Captain Grabbit! ${cur.say}`:cur.say)}
  W.grabbit.dbgQ=()=>({t:Q[S.r].t,v:V(),r:S.r,lives:S.lives});
  load();
}};
