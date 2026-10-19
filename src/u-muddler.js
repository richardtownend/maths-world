
/* ---------- 5. The Mirror: the Muddler, a mixed boss ---------- */
W.mirror={scene:'tower',
notes:`<p>The finale of the Starter Isles: the Muddler, a mischievous imp in the Magic Mirror, has muddled up every island. Eight questions, a mix of everything, and each one is answered the way its own island does it. Adding (6 + 5, then 6 + 4 + 5): dice and four prize jars, pick the right jar. Taking away (32 − 7): the hundred square, tap where the bunny lands and press Go. Times, sharing and missing numbers (3 × 5, 20 ÷ 2, 5 × ? = 35): drag the rectangle on the times table, and the tray beside it fills itself. Every right answer lights a gem round the mirror.</p>
<p>Three lights: a wrong answer and the Muddler blows one out. Lose all three and it scrambles the last gem back. Light all eight and the Muddler is unmuddled. The order: 6 + 5, 3 × 5, 32 − 7, 20 ÷ 2, 6 + 4 + 5, 5 × ? = 35, 41 − 13, 45 ÷ 5. The last one is the point of the whole world: 45 ÷ 5 = 9 is the same rectangle as 5 × 9.</p>`,
mount(root){
  const Q=[{t:'add',d:[6,5]},{t:'x',a:3,b:5},{t:'sub',n:32,b:7},{t:'d',a:2,c:20},{t:'add',d:[6,4,5]},{t:'mb',a:5,c:35},{t:'sub',n:41,b:13},{t:'d',a:5,c:45}];
  const S={r:0,hearts:3,busy:false,done:false,pick:null};
  const qL=el('g',{},root),arena=el('g',{},root),mirL=el('g',{},root),hud=el('g',{},root);
  /* the mirror and the Muddler */
  const MX=510,MY=128;
  el('ellipse',{cx:MX,cy:MY,rx:72,ry:92,fill:'url(#gMoon)',opacity:.5},mirL);
  el('ellipse',{cx:MX,cy:MY,rx:58,ry:76,fill:'#c98a3a'},mirL);el('ellipse',{cx:MX,cy:MY,rx:53,ry:71,fill:'#ffd27a'},mirL);
  const glass=el('ellipse',{cx:MX,cy:MY,rx:47,ry:65,fill:'#4a3a7a'},mirL);
  const imp=el('g',{},mirL),impIn=el('g',{},imp);
  el('path',{d:'M-24,8 Q-26,-22 0,-24 Q26,-22 24,8 Q22,26 0,28 Q-22,26 -24,8Z',fill:'#9a6cff'},impIn);
  el('path',{d:'M-22,-14 L-34,-40 L-8,-22 L0,-46 L8,-22 L34,-40 L22,-14Z',fill:'#ff7eb6',stroke:'#c9418a','stroke-width':1.5},impIn);[[-34,-40],[0,-46],[34,-40]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:4,fill:'#ffc04d'},impIn));
  const eyes=el('g',{},impIn);[-1,1].forEach(s=>{el('ellipse',{cx:s*9,cy:-2,rx:6,ry:7,fill:'#fff'},eyes);el('circle',{cx:s*9+(s<0?2:-2),cy:-1,r:3,fill:'#241a3a'},eyes)});
  const mouth=el('path',{d:'M-10,12 Q0,20 10,12',stroke:'#3a1d5a','stroke-width':2.5,fill:'none','stroke-linecap':'round'},impIn);
  const GEMS=range(0,7).map(i=>{const a=-Math.PI/2+i*Math.PI/4;return el('circle',{cx:MX+Math.cos(a)*58,cy:MY+Math.sin(a)*76,r:6,fill:'#3a2d5e',stroke:'#fff4e6','stroke-width':1.5},mirL)});
  const GC=['#ffb34d','#6fe3cd','#ffe066','#f0475f','#8fd6ff','#ff7eb6','#7fd36b','#c9a2ff'];
  const litGem=(i,on)=>{GEMS[i].setAttribute('fill',on?GC[i]:'#3a2d5e');if(on){GEMS[i].setAttribute('filter','url(#glow)');popIn(GEMS[i],1.8)}else GEMS[i].removeAttribute('filter')};
  const impMood=m=>{mouth.setAttribute('d',m==='laugh'?'M-12,10 Q0,26 12,10Z':m==='ow'?'M-6,16 a6,5 0 1 0 12,0 a6,5 0 1 0 -12,0':m==='happy'?'M-12,10 Q0,24 12,10':'M-10,12 Q0,20 10,12');mouth.setAttribute('fill',m==='laugh'||m==='ow'?'#3a1d5a':'none')};
  /* lights */
  const heartL=el('g',{},hud);
  function drawHearts(){heartL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.hearts,g=el('g',{transform:`translate(${30+k*34},30)`},heartL);if(on)el('circle',{r:17,fill:'#ffc04d',opacity:.25},g);
    el('path',{d:'M-9,-10 Q0,-15 9,-10 V8 Q0,13 -9,8Z',fill:on?'#e8513e':'#3a3058',stroke:on?'#ffb86a':'#5a4a80','stroke-width':1.5},g);el('ellipse',{cx:0,cy:-1,rx:4.5,ry:6,fill:on?'#ffd27a':'#2a2245'},g)}}
  const sum=q=>q.d.reduce((a,b)=>a+b,0);
  const ans=q=>q.t==='add'?sum(q):q.t==='sub'?q.n-q.b:q.t==='x'?q.a*q.b:q.c/q.a;
  const qParts=(q,A)=>{const s=A?['w',ans(q)]:['o','?'];switch(q.t){case'add':return[...q.d.flatMap((v,i)=>i?[['o','+'],['w',v]]:[['w',v]]),['o','='],s];case'sub':return[['w',q.n],['o','−'],['w',q.b],['o','='],s];
    case'x':return[['w',q.a],['o','×'],['w',q.b],['o','='],s];case'mb':return[['w',q.a],['o','×'],s,['o','='],['w',q.c]];case'd':return[['w',q.c],['o','÷'],['w',q.a],['o','='],s]}};
  /* shared outcomes */
  function hit(msg,extra=[]){S.busy=true;litGem(S.r,true);SFX.crackGlass();SFX.chime();impMood('ow');shake(6);
    tween(500,(t,p)=>impIn.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*4)*14).toFixed(1)}) scale(${(1-Math.sin(p*Math.PI)*.2).toFixed(2)})`),()=>{impIn.removeAttribute('transform');impMood('')},ease.lin);
    burst(MX,MY,{n:14,cols:[GC[S.r],'#fff']});floatText(MX,MY-96,['Ouch!','Eek!','Oof!','Hey!','Yikes!','Argh!','Nooo!','Aaah!'][S.r],{col:GC[S.r],size:22});
    starterQ(qL,[...qParts(Q[S.r],true),...extra],true);say(`${msg} A gem lights up!`);
    later(2500,()=>{if(S.r===7)finale();else{S.r++;load()}})}
  function miss(msg,retry){S.busy=true;SFX.laugh();impMood('laugh');S.hearts--;drawHearts();shake(5);ring(30+S.hearts*34,30,{col:'#b48cff',r1:40});
    say(`${msg} The Muddler cackles!`);later(1600,()=>{impMood('');if(S.hearts<=0)lost();else{retry&&retry();S.busy=false}})}
  function lost(){S.hearts=3;if(S.r>0){S.r--;litGem(S.r,false)}say('All your lights went out! The Muddler scrambled a gem back. Try that one again.');later(2600,load)}
  /* adding: dice and prize jars, like the fair */
  function mountAdd(q){const T=sum(q);
    const n=q.d.length,X=i=>260+(i-(n-1)/2)*130;
    q.d.forEach((v,i)=>{const g=el('g',{transform:`translate(${X(i)},228)`},arena);dieFace(g,v,70);g.setAttribute('aria-label',`Die showing ${v}`);popIn(g,.4);
      if(i)el('text',{x:X(i)-65,y:240,'text-anchor':'middle','font-size':36,'font-weight':700,fill:'#fff4e6'},el('g',{class:'num'},arena)).textContent='+'});
    const tens=T%10,sw=tens*10+Math.floor(T/10),set=new Set([T,T+1,T-1]);set.add(sw&&sw!==T&&sw<=29?sw:T+2);
    const vals=[...set].sort(()=>Math.random()-.5);
    vals.forEach((v,i)=>{const x=90+i*125,g=el('g',{},arena);el('rect',{x:x-56,y:330,width:112,height:150,rx:12,fill:'rgba(255,244,230,.08)',stroke:'rgba(255,244,230,.28)'},g);
      jarSet(g,v,x,456,.85,104);el('text',{x,y:478,'text-anchor':'middle','font-size':16,'font-weight':700},el('g',{class:'num'},g)).textContent=v;
      interact(g,{label:`Prize jar of ${v} fireflies`,tap:()=>{if(S.busy||S.done||g.dataset.out)return;
        if(v===T){for(let k=0;k<12;k++)later(k*60,()=>burst(x+(Math.random()-.5)*60,400-Math.random()*60,{n:4,cols:['#e6ff8a','#f6ffc8']}));SFX.whoosh();hit(`${q.d.join(' + ')} = ${T}.${T>10?` That's a full ten and ${T-10}.`:''}`)}
        else{g.dataset.out=1;g.style.opacity=.3;miss(`That jar has ${v}. ${n>2?`Find a pair that makes ten first: ${q.d[1]} + ${q.d[0]} = 10.`:`Count on from ${q.d[0]}: ${q.d[0]}, then ${q.d[1]} more.`}`)}}});popIn(g,.4)})}
  /* taking away: the hundred square and the bunny, like the burrows */
  function mountSub(q){const sq=hundredSq(arena,{x:76,y:96,cs:32,onTap:n=>{if(S.busy||S.done)return;if(n>=q.n){SFX.clonk();say('The bunny hops backwards: pick a square before it.');return}
      S.pick=n;if(pm)pm.remove();pm=sq.mark(n,'#fff0a0');SFX.pop(1.1);goB.style.display=''}});
    const bun=bunny(sq.top,32),home=()=>{const [x,y]=sq.xy(q.n);bun.put(x,y-4)};home();sq.mark(q.n,'#fff0a0',true);let pm=null;
    const goB=goStone(arena,450,470,'Go: hop back',()=>{if(S.busy||S.done||S.pick==null)return;S.busy=true;goB.style.display='none';
      hopBack(sq,bun,q.n,q.b,{done:land=>{if(land===S.pick){sq.carrot(land);hit(`${q.n} − ${q.b} = ${land}.${q.b>=10?' Taking ten is one hop up a row.':` Back to ${q.n-q.n%10} first, then ${q.b-q.n%10} more.`}`)}
        else{const bad=sq.mark(land,'#ff7a93');miss(`It landed on ${land}, not ${S.pick}.`,()=>{bad.remove();if(pm)pm.remove();pm=null;S.pick=null;home()})}}})});
    goB.style.display='none'}
  /* times, sharing, missing: the times table, like the trays */
  function mountGrid(q){let mini=null;
    const ok=(r,c)=>q.t==='x'?(r===q.a&&c===q.b)||(r===q.b&&c===q.a):r*c===q.c&&(r===q.a||c===q.a);
    const grid=timesGrid(arena,{x:72,y:118,cs:30,can:()=>!S.busy&&!S.done,onMove:(r,c)=>mini.set(r,c),onRelease:(r,c)=>{if(S.busy||S.done)return;
      if(ok(r,c)){grid.mirror(true);mini.set(r,c,true);const s=ans(q);
        hit(q.t==='x'?`${q.a} × ${q.b} = ${s}.`:q.t==='d'?`${q.c} ÷ ${q.a} = ${s}: the same rectangle as ${q.a} × ${s}.`:`${q.a} × ${s} = ${q.c}: so ${q.c} ÷ ${q.a} = ${s}.`,
          q.t==='d'?[['t','so'],['w',q.a],['o','×'],['w',s],['o','='],['w',q.c]]:q.t==='mb'?[['t','so'],['w',q.c],['o','÷'],['w',q.a],['o','='],['w',s]]:[])}
      else miss(`${r} × ${c} = ${r*c}. ${q.t==='x'?`Go ${q.a} rows down and ${q.b} across.`:`Find ${q.c} in the ${q.a}s row: ${q.a} rows down, then across.`}`)}});
    mini=autoTray(arena,{x:414,y:280,w:160,h:160});mini.set(1,1)}
  function finale(){S.done=true;S.busy=true;SFX.fanfare();SFX.wake&&SFX.wake();glass.setAttribute('fill','#e9f4ff');GEMS.forEach((g,i)=>later(i*90,()=>ring(+g.getAttribute('cx'),+g.getAttribute('cy'),{col:GC[i],r1:40})));
    impMood('happy');tween(1400,(t,p)=>impIn.setAttribute('transform',`translate(0,${(-Math.sin(p*Math.PI*3)*8).toFixed(1)}) rotate(${(p*360).toFixed(0)})`),()=>impIn.removeAttribute('transform'),ease.inOut);
    for(let k=0;k<10;k++)later(k*220,()=>burst(80+Math.random()*440,80+Math.random()*300,{n:10,cols:[GC[k%8],'#fff']}));
    starterQ(qL,[['w',5],['o','×'],['w',9],['o','='],['w',45],['t','and'],['w',45],['o','÷'],['w',5],['o','='],['w',9]],true);
    say('All eight gems are lit and the Muddler is unmuddled! Adding, taking away, times and sharing: you beat every one.');unlock('flip');clearIsland('mirror');
    later(2400,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.hearts=3;S.done=false;GEMS.forEach((g,i)=>litGem(i,false));glass.setAttribute('fill','#4a3a7a');load()}});s.ready(true)})}
  const HINT={add:'Add the dice and pick the right prize jar.',sub:'Tap where the bunny will land, then Go.',x:'Drag the rectangle on the times table.',mb:'Find the rectangle that makes it.',d:'Rows first, then how far across?'};
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';S.busy=false;S.pick=null;navDots(8,S.r,true);let T=0;loop(dt=>{T+=dt;imp.setAttribute('transform',`translate(${MX},${(MY+4+(S.done?0:Math.sin(T*1.6)*4)).toFixed(1)})`)});drawHearts();const q=Q[S.r];
    if(q.t==='add')mountAdd(q);else if(q.t==='sub')mountSub(q);else mountGrid(q);
    starterQ(qL,qParts(q));
    say(S.r===0?`The Muddler has muddled up all your islands! Each question is answered the island's way. ${HINT.add}`:q.t==='d'?`${q.c} ÷ ${q.a}: ${q.a} rows. How far across to reach ${q.c}?`:HINT[q.t])}
  load();
}};
