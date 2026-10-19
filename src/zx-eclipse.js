/* ================= The Eclipse: the final boss, in the middle of the sky =================
   The moon has been going dark all along. The Eclipse, a shadow that eats moonlight, sent all nine villains.
   Each world boss beaten pushes the shadow back a little; with all nine, the Eclipse can be faced.
   Its six puzzles each mix two worlds, using moves the child already knows from the islands. */
const bossesBeaten=()=>{try{return BOSSES.filter(b=>isCleared(b)).length}catch(e){return 0}};
/* the shadow over the sky's moon on every night backdrop: a ninth slides off for each boss beaten */
function moonShadow(parent,cx,cy,r){let won=false;try{won=isCleared('eclipse')}catch(e){}if(won)return;
  const lit=bossesBeaten()/9*.7,id='mShadowClip',cp=el('clipPath',{id},parent);el('circle',{cx,cy,r},cp);
  el('circle',{cx:cx-r*2.1*lit,cy:cy-2,r:r*1.02,fill:'#2a2048','clip-path':`url(#${id})`,opacity:.92},parent)}
/* the moon with the Eclipse's shadow across it: cover 1 = all dark, 0 = the shadow has slid off */
function eclipseFig(parent,{s=1}={}){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g),R=50;
  el('circle',{r:R*2.2,fill:'url(#gMoon)'},b);el('circle',{r:R,fill:'#fff1d6'},b);[[-18,-14,9],[16,10,7],[-6,22,5],[20,-20,4]].forEach(([x,y,r])=>el('circle',{cx:x,cy:y,r,fill:'#f0dcbc'},b));
  const face=el('g',{opacity:0},b);[-15,15].forEach(x=>el('circle',{cx:x,cy:-4,r:3.5,fill:'#7a5a44'},face));el('path',{d:'M-14,12 Q0,24 14,12',fill:'none',stroke:'#7a5a44','stroke-width':3,'stroke-linecap':'round'},face);
  const id=`eclc${Math.random().toString(36).slice(2,7)}`,cp=el('clipPath',{id},b);el('circle',{r:R+1},cp);
  const sh=el('g',{},b),disc=el('g',{'clip-path':`url(#${id})`},sh),body=el('circle',{r:R*1.05,fill:'#2a2048'},disc);
  const eyesG=el('g',{},disc),eyes=[-16,16].map(x=>el('ellipse',{cx:x,cy:-6,rx:6,ry:7,fill:'#ff7eb6'},eyesG)),mouth=el('path',{d:'M-18,14 Q0,26 18,14',fill:'none',stroke:'#ff7eb6','stroke-width':3,'stroke-linecap':'round'},eyesG);
  let cover=1,T=0;const place=()=>{const dx=(1-cover)*R*2.3;body.setAttribute('cx',dx);eyesG.setAttribute('transform',`translate(${dx.toFixed(1)},0)`);eyesG.setAttribute('opacity',clamp((cover-.12)*3,0,1).toFixed(2));face.setAttribute('opacity',(1-cover).toFixed(2))};place();
  return{g,R,setCover(c){cover=clamp(c,0,1);place()},get cover(){return cover},
    slide(to,ms=900,done){const c0=cover;tween(ms,t=>{cover=c0+(to-c0)*t;place()},done,ease.inOut)},
    mood(m){mouth.setAttribute('d',m==='sad'?'M-18,20 Q0,8 18,20':m==='oh'?'M-6,16 a6,6 0 1 0 0.1,0':'M-18,14 Q0,26 18,14')},
    tick(t){T=t;eyes.forEach((e,i)=>e.setAttribute('ry',(Math.sin(t*1.7+i)>.96?1:7).toString()));b.setAttribute('transform',`scale(${s}) rotate(${(Math.sin(t*.4)*2).toFixed(2)})`)}}}
/* the middle of the sky on the home screen */
function eclipseCentreFig(parent,{won=false}={}){const e=eclipseFig(parent,{s:1});e.setCover(won?0:1-bossesBeaten()/9*.7);return{g:e.g,tick:t=>e.tick(t)}}

/* shared bits for the pages */
function brushRow(parent,x,y,items,get,set){const g=el('g',{},parent);const draw=()=>{g.innerHTML='';items.forEach((it,i)=>{const b=el('g',{transform:`translate(${x+i*64},${y})`},g),on=get()===it.k;
    el('rect',{x:-28,y:-22,width:56,height:44,rx:12,fill:on?'#fff4c0':'#fffaf0',stroke:on?'#9a6cff':'#c9a77a','stroke-width':on?4:2},b);it.draw(b);interact(b,{label:`Brush: ${it.name}`,tap:()=>{set(it.k);SFX.tick(i+2);draw()}})})};draw();return{redraw:draw}}

W.eclipse={scene:'night',
notes:`<p>The final boss, in the middle of the sky. The moon has been going dark all along: the Eclipse, a shadow that eats moonlight, sent all nine villains. Each world boss beaten pushes the shadow back a little, and once all nine are beaten the Eclipse can be faced (grown-up mode opens it any time).</p>
<p>Six puzzles, each mixing two worlds and each done with a move from the islands: share Polly's loot between 4 pirates (a quarter is one share); paint a pie chart from Pip's tally (half the slices for half the animals); tile a rug 2 red for every 3 blue; the Eclipse turns the minute hand three-quarters of a turn (wind the clock on); buy 3 lollies at £0.45 with the right coins; and the shadow shrinking 20% of the moon every hour (drag the flag to when it's gone). Each right answer slides the shadow further off the moon. Three stars: a wrong answer loses one and the next try is different; lose all three and the shadow creeps back a step.</p>`,
mount(root){
  const Q=[{t:'loot',v:[{A:72},{A:96},{A:56}]},{t:'pie',v:[{n:8,c:{sheep:4,goat:2,duck:2}},{n:6,per:2,c:{sheep:6,goat:4,duck:2}},{n:12,c:{sheep:6,goat:4,duck:2}}]},
    {t:'tiles',v:[{cols:5,rows:4,a:2,b:3},{cols:4,rows:4,a:3,b:1},{cols:6,rows:3,a:1,b:2}]},{t:'turn',v:[{t0:195,f:[3,4]},{t0:150,f:[1,2]},{t0:255,f:[5,4]}]},
    {t:'shop',v:[{n:3,p:45,purse:[100,50,50,20,20,10,10,5,5,2]},{n:4,p:35,purse:[100,50,20,20,10,5,5,2,1]},{n:3,p:25,purse:[50,50,20,10,5,5,2,2,1]}]},
    {t:'graph',v:[{s:100,d:20},{s:90,d:15},{s:100,d:25},{s:70,d:10}]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{},intro:false};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const ec=eclipseFig(side,{s:.9});ec.g.setAttribute('transform','translate(500,190)');const lifeL=el('g',{},hud),phL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*30},34)`},lifeL);el('path',{d:'M0,-12 l3.5,7.5 8.2,1 -6,5.6 1.6,8.1 -7.3,-4 -7.3,4 1.6,-8.1 -6,-5.6 8.2,-1Z',fill:on?'#ffd23a':'#3a3450',stroke:on?'#c98a1a':'#55536a','stroke-width':1.5},g)}}
  function drawPhases(){phL.innerHTML='';for(let k=0;k<6;k++){const g=el('g',{transform:`translate(${30+k*26},70)`},phL),lit=k<S.r;el('circle',{r:10,fill:lit?'#fff1d6':'#2a2048',stroke:lit?'#ffd27a':'#55536a','stroke-width':2},g)}}
  let loopT=0,cur=null;
  const card=t=>{el('rect',{x:30,y:130,width:410,height:340,rx:14,fill:'rgba(255,250,240,.96)',stroke:'#9a6cff','stroke-width':3},arena);el('text',{x:46,y:153,'font-size':13,'font-weight':800,fill:'#5a3a9a'},arena).textContent=t};
  const mix=(a,b)=>{const g=el('g',{transform:'translate(400,148)'},arena);el('text',{'text-anchor':'end','font-size':11,'font-weight':800,fill:'#9a6cff'},g).textContent=`${a} × ${b}`};
  const M={
    /* fractions × money: a quarter is one share of four */
    loot({A}){card('A quarter of Polly’s loot');mix('Fractions','Money');const N=4,mid={1000:Math.floor(A/10),100:A%10},each={1000:0,100:0},NMs={1000:['£10 note','£10 notes'],100:['£1 coin','£1 coins']};let plan=0,col=1000,phase='deal';
      el('rect',{x:44,y:166,width:250,height:138,rx:10,fill:'#7a2a3a',stroke:'#c9a24a','stroke-width':2.5},arena);el('text',{x:56,y:182,'font-size':11,'font-weight':800,fill:'#fff0a0'},arena).textContent='the loot';
      const L=el('g',{},arena),px=i=>90+i*96;for(let i=0;i<N;i++)pirateFig(arena,px(i),358,i,.95);el('text',{x:90,y:324,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#5a3a9a'},arena).textContent='first pirate';
      const swapOne=()=>{mid[1000]--;mid[100]+=10;SFX.whoosh();if(!mid[1000]){col=100;phase='deal';say('Swapped! Now share the £1 coins.')}else say(`One £10 note became ten £1 coins. ${mid[1000]} more to swap.`);draw()};
      const draw=()=>{L.innerHTML='';[1000,100].forEach(v=>{for(let j=0;j<mid[v];j++){const x=v===1000?70+(j%5)*44:58+(j%13)*18,y=v===1000?204+Math.floor(j/5)*26:256+Math.floor(j/13)*16,c=moneyPiece(L,x,y,v,{s:v===1000?.72:.58});if(v!==col)c.setAttribute('opacity',.55);
          interact(c,{label:`Loot: ${NMs[v][0]}`,tap:()=>{if(S.busy)return;if(v!==col){say(v===100?'Biggest first: share the £10 notes before the £1 coins.':'Those are shared already.');return}if(phase==='swap'){swapOne();return}mid[v]--;plan++;SFX.clink&&SFX.clink();draw()}})}});
        for(let i=0;i<N;i++)[1000,100].forEach((v,j)=>{const n=each[v]+(i===0&&v===col&&phase==='deal'?plan:0);for(let k2=0;k2<n;k2++){const c=moneyPiece(L,px(i)-14+j*28,452-k2*(v===100?5:6),v,{s:v===1000?.5:.72});
          if(i===0&&v===col&&k2>=each[v]&&k2===n-1)interact(c,{label:`First pirate: ${NMs[v][0]}`,tap:()=>{if(S.busy)return;mid[v]++;plan--;SFX.pop(.8);draw()}})}})};
      const bk=el('g',{transform:'translate(368,226)'},arena);el('rect',{x:-40,y:-44,width:80,height:88,rx:8,fill:'#e8d8b8',stroke:'#7a5a3a','stroke-width':3},bk);el('text',{y:-24,'text-anchor':'middle','font-size':13,'font-weight':900,fill:'#3a2418'},bk).textContent='BANK';
      moneyPiece(bk,0,0,1000,{s:.65});el('text',{y:30,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},bk).textContent='1 ↔ 10';
      interact(bk,{label:'The bank: swap a leftover',tap:()=>{if(S.busy)return;if(phase==='swap')swapOne();else say('The bank swaps leftovers that won’t go round. Share first, then swap what’s left.')}});draw();
      return{say:`The Eclipse stole a quarter of Polly’s £${A}. How much is a quarter? Share it fairly between 4 pirates.`,go:'Deal',txt:'Deal',check:()=>{
        if(phase==='swap')return{soft:true,msg:'Tap the leftover notes to swap them at the bank first.'};
        const v=col;let cnt=mid[v]+plan,note='';if(!plan&&cnt>=N)return{soft:true,msg:`Tap ${NMs[v][1]} to give the first pirate his share, then Deal.`};if(cnt<N&&plan){mid[v]=cnt;plan=0;note=`Only ${cnt} for 4, so each gets none. `}const n=plan;
        if(n*N>cnt)return{ok:false,msg:`Not enough ${NMs[v][1]} for everyone to get ${n}.`};if(cnt-n*N>=N)return{ok:false,msg:`There are enough ${NMs[v][1]} left for everyone to get another.`};
        each[v]=n;mid[v]=cnt-n*N;plan=0;SFX.chime();
        if(v===1000){if(mid[1000]){phase='swap';draw();return{soft:true,msg:`${note}${mid[1000]} ${mid[1000]>1?'notes':'note'} left: not enough to go round. Tap ${mid[1000]>1?'them':'it'} to swap at the bank.`}}col=100;draw();return{soft:true,msg:`Everyone has ${n} ${n===1?'note':'notes'}. Now the £1 coins.`}}
        draw();return{ok:true,msg:`Each pirate gets £${A/4}: sharing into 4 finds a quarter, so the Eclipse stole £${A/4}.`}}}},
    /* graphs × fractions: a pie chart is a tally shared round a circle */
    pie({n,c,per=1}){card('Pip’s pie chart');mix('Graphs','Fractions');const ks=Object.keys(c),COL={sheep:'#8fd6ff',goat:'#c9a27a',duck:'#ffd23a'},paint=Array(n).fill(null);let brush=ks[0];
      el('rect',{x:44,y:168,width:150,height:20+ks.length*46,rx:10,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':2},arena);el('text',{x:119,y:184,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#7a5a3a'},arena).textContent='Pip’s tally';
      ks.forEach((k,i)=>{const y=212+i*46;animalIcon(arena,64,y+2,k,.8);tallyMarks(arena,86,y,c[k],{h:22,dx:5.5,gap:8})});
      const P=el('g',{},arena),CX=320,CY=300,R=100,draw=()=>{P.innerHTML='';for(let i=0;i<n;i++){const a0=(i/n)*Math.PI*2-Math.PI/2,a1=((i+1)/n)*Math.PI*2-Math.PI/2,x0=CX+R*Math.cos(a0),y0=CY+R*Math.sin(a0),x1=CX+R*Math.cos(a1),y1=CY+R*Math.sin(a1);
        const s=el('path',{d:`M${CX},${CY} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}Z`,fill:paint[i]?COL[paint[i]]:'#f4ecdc',stroke:'#5a3a9a','stroke-width':2},P);
        interact(s,{label:`Pie slice ${i+1}`,tap:()=>{if(S.busy)return;paint[i]=paint[i]===brush?null:brush;SFX.pop(1+i*.03);draw()}})}};draw();
      brushRow(arena,80,430,ks.map(k=>({k,name:ANIMAL[k].name[0],draw:b=>{el('rect',{x:-22,y:-16,width:12,height:32,rx:3,fill:COL[k]},b);animalIcon(b,8,2,k,.7)}})),()=>brush,v=>{brush=v});
      if(per>1){const kb=el('g',{transform:'translate(320,176)'},arena);el('rect',{x:-70,y:-12,width:140,height:24,rx:8,fill:'#e8f0ff',stroke:'#4a7ab8','stroke-width':1.5},kb);el('text',{y:5,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#2a4a7a'},kb).textContent=`1 slice = ${per} animals`}
      return{say:per>1?`The Eclipse rubbed out Pip’s pie chart! This time each slice is ${per} animals. Pick a colour, then paint.`:`The Eclipse rubbed out Pip’s pie chart! The pie shares out all ${sum(Object.values(c))} animals. Pick a colour, then tap slices to paint them.`,go:'Check the pie',txt:'Check',check:()=>{
        if(paint.some(p=>!p))return{soft:true,msg:'Paint every slice.'};const bad=ks.find(k=>paint.filter(p=>p===k).length*per!==c[k]);
        if(bad)return{ok:false,msg:per>1?`Each slice is ${per} animals: count the ${ANIMAL[bad].name[1]} on the tally in ${per}s.`:`Each slice is one animal. Count the ${ANIMAL[bad].name[1]} on the tally.`};const big=ks.find(k=>c[k]*2===n*per);
        return{ok:true,msg:big?`${c[big]/per} of the ${n} slices are ${ANIMAL[big].name[1]}: that’s half the pie, because half the animals are ${ANIMAL[big].name[1]}.`:`The pie shares out the tally: each animal gets its own slice.`}}}},
    /* ratio × shapes: a pattern that repeats across an area */
    tiles({cols,rows,a,b}){card('The Eclipse’s rug');mix('Ratio','Shapes');const N=cols*rows,paint=Array(N).fill(null);let brush='r';const COL={r:'#e8413e',b:'#4a7ab8'};
      const rc=el('g',{transform:'translate(48,176)'},arena);el('text',{y:14,'font-size':13,'font-weight':800,fill:'#3a2418'},rc).textContent='for every';for(let i=0;i<a;i++)el('rect',{x:70+i*20,y:0,width:16,height:16,rx:3,fill:COL.r},rc);
      el('text',{x:80+a*20,y:14,'font-size':13,'font-weight':800,fill:'#3a2418'},rc).textContent='red,';for(let i=0;i<b;i++)el('rect',{x:116+a*20+i*20,y:0,width:16,height:16,rx:3,fill:COL.b},rc);el('text',{x:124+(a+b)*20,y:14,'font-size':13,'font-weight':800,fill:'#3a2418'},rc).textContent='blue';
      const G=el('g',{},arena),cs=Math.min(48,300/cols,200/rows),X0=235-cols*cs/2,Y0=214,draw=()=>{G.innerHTML='';for(let i=0;i<N;i++){const x=X0+(i%cols)*cs,y=Y0+Math.floor(i/cols)*cs,t=el('rect',{x:x+1,y:y+1,width:cs-2,height:cs-2,rx:4,fill:paint[i]?COL[paint[i]]:'#f4ecdc',stroke:'#5a3a9a','stroke-width':1.5},G);
        interact(t,{label:`Tile ${i+1}`,tap:()=>{if(S.busy)return;paint[i]=paint[i]===brush?null:brush;SFX.pop(1+(i%5)*.05);draw()}})}};draw();
      brushRow(arena,80,440,[{k:'r',name:'red',draw:g=>el('rect',{x:-16,y:-16,width:32,height:32,rx:5,fill:COL.r},g)},{k:'b',name:'blue',draw:g=>el('rect',{x:-16,y:-16,width:32,height:32,rx:5,fill:COL.b},g)}],()=>brush,v=>{brush=v});
      const R=N*a/(a+b);
      return{say:`The Eclipse wants a rug of ${N} tiles in its pattern. Paint every tile: ${a} red for every ${b} blue.`,go:'Check the rug',txt:'Check',check:()=>{if(paint.some(p=>!p))return{soft:true,msg:'Paint every tile.'};const r=paint.filter(p=>p==='r').length;
        return r===R?{ok:true,msg:`${N} tiles in groups of ${a+b}: ${N/(a+b)} groups, so ${R} red and ${N-R} blue.`}:{ok:false,msg:`Think in groups of ${a+b} tiles: each group has ${a} red and ${b} blue. How many groups fit in the rug?`}}}},
    /* time × turns: a fraction of a turn is a time */
    turn({t0,f:[fn,fd]}){card('The Eclipse’s clock');mix('Time','Turns');const ck=clockKit(arena,{x:200,y:310,r:118});ck.set(t0);const want=t0+60*fn/fd;
      dragWind(ck,{snap:15,min:t0,max:t0+120,label:'Clock: wind the minute hand on',can:()=>!S.busy});
      const tc=el('g',{transform:'translate(376,236)'},arena);el('circle',{r:34,fill:'#f4ecdc',stroke:'#5a3a9a','stroke-width':2},tc);const fr=fn/fd;
      const turnArc=(f,col)=>{const full=Math.floor(f),rest=f-full;if(full){tc.setAttribute('transform','translate(392,236)');const w=el('g',{transform:'translate(-40,0) scale(.55)'},tc);el('circle',{r:34,fill:col,stroke:'#5a3a9a','stroke-width':3},w);el('text',{x:-14,y:6,'font-size':18,'font-weight':800,fill:'#5a3a9a'},tc).textContent='+'}if(rest){const a=rest*Math.PI*2,x=34*Math.sin(a),y=-34*Math.cos(a);el('path',{d:`M0,0 L0,-34 A34,34 0 ${rest>.5?1:0} 1 ${x.toFixed(1)},${y.toFixed(1)}Z`,fill:col,opacity:full?1:.75},tc)}};
      turnArc(fr,'#b89cff');el('path',{d:'M0,-44 a44,44 0 0 1 30,12',fill:'none',stroke:'#5a3a9a','stroke-width':2.5,'marker-end':''},tc);
      const words={'1/2':'half a turn','3/4':'three-quarters of a turn','5/4':'one and a quarter turns','1/4':'a quarter of a turn'}[`${fn}/${fd}`]||`${fn}/${fd} of a turn`;
      words.split(' of ').forEach((w,i,a)=>el('text',{y:56+i*15,'text-anchor':'middle','font-size':11.5,'font-weight':800,fill:'#5a3a9a'},tc).textContent=i<a.length-1?w+' of':w);
      return{say:`It’s ${tWords(t0)}. The Eclipse spins the minute hand ${words}. Wind the clock on to the new time.`,go:'Check the clock',txt:'Check',check:()=>{const t=ck.get();if(t===t0)return{soft:true,msg:'Wind the minute hand round.'};
        return t===want?{ok:true,msg:`${capF(words)} of the minute hand is ${60*fn/fd} minutes: ${tWords(want)}.`}:{ok:false,msg:'A whole turn of the minute hand is one hour. Work out that fraction of an hour.'}}}},
    /* decimals × money: the same price, again and again */
    shop({n,p,purse}){card('Lollies for the party');mix('Decimals','Money');const pur=[...purse],paid=[],tot=n*p,L=el('g',{},arena);
      for(let i=0;i<n;i++)sweetFig(arena,70+i*46,214,'lolly',1.2);const tg=el('g',{transform:`translate(${86+n*46},214)`},arena);el('rect',{x:-6,y:-16,width:96,height:32,rx:8,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2},tg);el('text',{x:42,y:6,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},tg).textContent=`£${(p/100).toFixed(2)} each`;
      el('rect',{x:44,y:262,width:384,height:76,rx:10,fill:'#a8744a',stroke:'#6a4224','stroke-width':2.5},arena);el('text',{x:56,y:278,'font-size':11,'font-weight':800,fill:'#fff0a0'},arena).textContent='the counter';el('text',{x:56,y:360,'font-size':11,'font-weight':800,fill:'#5a3a9a'},arena).textContent='your purse';
      const draw=()=>{L.innerHTML='';paid.forEach((v,i)=>{const c=moneyPiece(L,72+(i%8)*44,292+Math.floor(i/8)*30,v,{s:1.1});interact(c,{label:`Coin ${fmtP(v)} (counter)`,tap:()=>{if(S.busy)return;pur.push(paid.splice(i,1)[0]);SFX.pop(.8);draw()}})});
        [...pur].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).forEach(([v,i],k)=>{const c=moneyPiece(L,72+(k%8)*44,394+Math.floor(k/8)*40,v,{s:1.2});interact(c,{label:`Coin ${fmtP(v)} (purse)`,tap:()=>{if(S.busy)return;paid.push(pur.splice(i,1)[0]);SFX.clink&&SFX.clink();draw()}})})};draw();
      return{say:`The party needs ${n} lollies at £${(p/100).toFixed(2)} each. Pay exactly.`,go:'Pay',txt:'Pay',check:()=>{const t=sum(paid);if(!paid.length)return{soft:true,msg:'Tap coins onto the counter.'};
        return t===tot?{ok:true,msg:`${n} lots of £${(p/100).toFixed(2)} is ${fmtP(tot)}.`}:{ok:false,msg:t<tot?`Not enough: count up £${(p/100).toFixed(2)}, ${n} times.`:`Too much: count up £${(p/100).toFixed(2)}, ${n} times.`}}}},
    /* percentages × line graphs: the last puzzle drives the shadow off */
    graph({s:s0,d}){card('The shadow is shrinking!');mix('Percentages','Graphs');const end=s0/d,fr=chartFrame(arena,{x:96,y:178,w:300,h:220,lo:0,hi:100,step:10,lab:20,fmt:v=>`${v}%`,unit:'dark'}),WX=h=>96+h*300/8;
      for(let h=0;h<=8;h++)el('text',{x:WX(h),y:416,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},arena).textContent=h;el('text',{x:396,y:432,'text-anchor':'end','font-size':11,'font-weight':700,fill:'#7a5a3a'},arena).textContent='hours';
      const pts=[0,1,2].map(h=>[WX(h),fr.yOf(s0-d*h)]),lineL=el('g',{},arena),flagL=el('g',{},arena);let flag=0;
      const dl=(P)=>{el('polyline',{points:P.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' '),fill:'none',stroke:'#5a3a9a','stroke-width':3.5},lineL);P.forEach(([x,y])=>el('circle',{cx:x,cy:y,r:6,fill:'#5a3a9a',stroke:'#fff','stroke-width':2},lineL))};dl(pts);
      const drawFlag=()=>{flagL.innerHTML='';const f=el('g',{transform:`translate(${WX(flag)},398)`},flagL);el('line',{x1:0,x2:0,y1:0,y2:-44,stroke:'#3a2418','stroke-width':2.5},f);el('path',{d:'M0,-44 L20,-37 L0,-30Z',fill:'#ffd23a'},f)};drawFlag();
      const hit=el('rect',{x:96,y:340,width:300,height:90,fill:'transparent'},arena),set=n=>{n=clamp(Math.round(n),0,8);if(n===flag)return;flag=n;SFX.tick(n);drawFlag()};
      interact(hit,{label:'The moonrise flag',down:()=>({}),move:p=>{if(S.busy)return;set((p.x-96)/(300/8))},tap:p=>{if(S.busy||!p)return;set((p.x-96)/(300/8))}});
      hit.addEventListener('keydown',e=>{if(S.busy)return;const k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;e.preventDefault();set(flag+k)});
      return{say:`Every hour, another ${d}% of the moon comes out of the shadow. Drag the flag to the hour the moon will be clear, then Go!`,go:'Go: watch the moon',txt:'Go',check:()=>{if(!flag)return{soft:true,msg:'Drag the flag along the bottom.'};
        const stop=Math.min(flag,end),left=Math.max(0,s0-d*flag);return{ok:flag===end,msg:flag===end?`${d}% more each hour: ${s0}% gone in ${end} hours. The moon is free!`:flag<end?`At hour ${flag} the moon is still ${left}% dark. Follow the line down to 0%.`:`The line reached 0% before hour ${flag}. Follow it down and stop where it touches the bottom.`,
          anim:dn=>{let h=2;const f=()=>{if(h>=Math.max(stop,2)){dn();return}h++;dl([[WX(h-1),fr.yOf(s0-d*(h-1))],[WX(h),fr.yOf(s0-d*h)]]);SFX.pop(.7);later(420,f)};f()}}}}}};
  function hit(msg){S.busy=true;ec.mood('oh');SFX.chime();SFX.whoosh&&SFX.whoosh();shake(3);floatText(500,92,['Ooh!','No!','My shadow!','Stop that!','Too bright!','Nooo!'][S.r],{col:'#ff7eb6',size:20});
    decQ(qL,[['t','Moonlight back!']],true,null);say(`${msg}`);ec.slide(1-(S.r+1)/6,1100);later(700,()=>{S.r++;drawPhases()});later(3200,()=>{ec.mood('');if(S.r>=Q.length)finale();else load()})}
  function miss(msg){S.busy=true;SFX.wrong();S.lives--;drawLives();shake(3);ec.mood('');SFX.laugh&&SFX.laugh();say(`${msg} The Eclipse giggles…`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(3800,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;S.vr[S.r]=(S.vr[S.r]||0)+1;ec.slide(1-S.r/6,700);drawPhases()}say('No stars left, and the shadow crept back a little. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;arena.innerHTML='';pane.innerHTML='';SFX.fanfare();ec.mood('sad');
    tween(1600,t=>ec.g.setAttribute('transform',`translate(${lerp(500,300,t).toFixed(1)},${lerp(190,240,t).toFixed(1)}) scale(${lerp(.9,1.6,t).toFixed(3)})`),null,ease.inOut);
    const crew=el('g',{},arena);[[g=>pipFig(g,.9),110,450],[g=>pollyFig(g,.8),190,470],[g=>tockFig(g,.6),270,480],[g=>shellyFig(g,.7),350,476],[g=>kaiFig(g,.6),430,466],[g=>glimFig(g,22),505,446]].forEach(([mk,x,y],i)=>later(900+i*260,()=>{const w=el('g',{transform:`translate(${x},${y+40})`},crew);try{const f=mk(w);if(f&&f.cheer)later(300,()=>f.cheer())}catch(e){}
      tween(500,t=>w.setAttribute('transform',`translate(${x},${(y+40-40*t).toFixed(1)})`),null,ease.back);bell(noteHz([7,9,11,12,14,16][i]),.08,1.4)}));
    for(let k=0;k<14;k++)later(400+k*200,()=>burst(60+Math.random()*480,100+Math.random()*320,{n:10,cols:['#fff1d6','#ffd23a','#ff9ed2','#8fd6ff','#8ff0c8']}));
    decQ(qL,[['t','The moon is full!']],true,null);say('The shadow slides off and the full moon rises. Every guide from every world is here to cheer. You did it, all of it!');unlock('eclipse');clearIsland('eclipse');
    later(7600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};S.intro=true;go('eclipse')}});s.ready(true)})}
  function intro(){EPOCH++;arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,0,true);drawLives();drawPhases();ec.setCover(1);loop(dt=>{loopT+=dt;ec.tick(loopT)});
    decQ(qL,[['t','The Eclipse']],false,null);const b=el('g',{transform:'translate(240,300)'},arena);el('rect',{x:-200,y:-110,width:400,height:200,rx:18,fill:'#2a2048',stroke:'#ff7eb6','stroke-width':3},b);
    ['Hee hee! It was ME all along!','I sent the Gloom, the Muddler, the Magpie,','the Kraken, the Smudge, the Inkblot, the Snooze,','Captain Grabbit AND Fudge, to muddle every world,','so I could gobble up the moon!'].forEach((t,i)=>el('text',{y:-62+i*30,'text-anchor':'middle','font-size':i?14:18,'font-weight':800,fill:i?'#e8dcff':'#ff7eb6'},b).textContent=t);
    decGo(arena,560,500,'Begin: face the Eclipse',()=>{SFX.pop(1.2);S.intro=true;load()},'Go');
    say('Six puzzles, each from two worlds. Every right answer pushes the shadow off the moon!')}
  function load(){if(!S.intro)return intro();EPOCH++;FX.innerHTML='';arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,S.r,true);drawLives();drawPhases();ec.setCover(1-S.r/6);
    loop(dt=>{loopT+=dt;ec.tick(loopT)});const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t',`puzzle ${S.r+1} of 6`]],false,null);
    decGo(arena,560,500,cur.go,()=>{if(S.busy)return;const r=cur.check();if(r.soft){say(r.msg);return}if(r.anim){S.busy=true;r.anim(()=>{S.busy=false;r.ok?hit(r.msg):miss(r.msg)});return}if(r.ok)hit(r.msg);else miss(r.msg)},cur.txt);
    say(cur.say)}
  W.eclipse.dbgQ=()=>({t:Q[S.r].t,v:V(),r:S.r,lives:S.lives,intro:S.intro});
  load();
}};
/* a starry night, with the dark moon high up */
SCENE_X.night=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#1a1436'},o);for(let i=0;i<70;i++)el('circle',{cx:-600+((i*197)%1800),cy:(i*83)%440,r:(i%3)*.5+.6,fill:'#fff4e6',opacity:.6},o);
  el('path',{d:'M-700,480 Q0,440 600,470 T1300,460 V800 H-700Z',fill:'#3a2a5a'},o);el('path',{d:'M-700,520 Q0,500 600,520 T1300,515 V800 H-700Z',fill:'#2a1f48'},o)};
AMB_X.night=()=>{if(Math.random()<.6){const b=7+Math.floor(Math.random()*6);bell(noteHz(b),.01,2.4,{wet:.9,ratio:3})}else noise(1.6,.015,{type:'lowpass',f:500,a:.6,wet:.5})};
