
/* ---------- 8. The Magpie: the Decimal Isles boss, a mix of every island ---------- */
W.magpie={scene:'lamp',
notes:`<p>The finale of the Decimal Isles, at the top of the lighthouse. The Magpie has stolen Dot to make the lighthouse lamp go dark, and won't give him back. Eight questions, one from each island, each answered the island's own way: snap rock (0.6), race snails (0.4 or 0.35?), the potion chart (0.8 × 10), dig on the beach ruler (0.46), plant tulips (35% + ? = 100%), share treasure (25% of 20), the lock (3/4 = ?%), and a last three-snail race (0.5, 0.45, 0.05).</p>
<p>Every right answer lights one of the eight prisms round the lamp. Three lights: a wrong answer and the Magpie blows one out; lose all three and it takes the last prism back. Light all eight and the Magpie drops Dot into the lamp, and the lighthouse shines again.</p>`,
mount(root){
  const Q=[{t:'rock',v:[6,7,4]},{t:'snail',v:[['0.4','0.35'],['0.3','0.25'],['0.6','0.55']]},{t:'potion',v:['0.8','0.3','0.9']},{t:'dig',v:['0.46','0.63','0.27']},
    {t:'tulips',v:[35,45,15]},{t:'treasure',v:[[25,20],[25,40],[75,8]]},{t:'lock',v:[2,1,3]},{t:'snail',ord:1,v:[['0.5','0.45','0.05'],['0.7','0.65','0.07'],['0.8','0.75','0.08']]}];
  const S={r:0,hearts:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  document.body.classList.add('dotless');
  const qL=el('g',{},root),arena=el('g',{},root),lampL=el('g',{},root),hud=el('g',{},root);
  /* the great lamp, its eight prisms, and the Magpie on top */
  const MX=508,MY=236,GC=['#ffb34d','#6fe3cd','#ffe066','#f0475f','#8fd6ff','#ff7eb6','#7fd36b','#c9a2ff'];
  const beam=el('g',{},lampL);
  el('rect',{x:MX-58,y:MY+44,width:116,height:120,rx:8,fill:'#3a3058'},lampL);el('rect',{x:MX-70,y:MY+40,width:140,height:10,rx:5,fill:'#4a4070'},lampL);
  el('circle',{cx:MX,cy:MY,r:70,fill:'url(#gMoon)',opacity:.4},lampL);
  const glass=el('circle',{cx:MX,cy:MY,r:46,fill:'#2e2850',stroke:'#c9a24a','stroke-width':5},lampL);
  for(let k=0;k<3;k++)el('line',{x1:MX-46+k*46,x2:MX-46+k*46,y1:MY-40,y2:MY+40,stroke:'#c9a24a','stroke-width':2,opacity:.5},lampL);
  const core=el('circle',{cx:MX,cy:MY,r:16,fill:'#3a3058'},lampL);
  el('path',{d:`M${MX-50},${MY-40} L${MX},${MY-74} L${MX+50},${MY-40}Z`,fill:'#e0506a',stroke:'#a03048','stroke-width':2},lampL);
  const GEMS=range(0,7).map(i=>{const a=-Math.PI/2+i*Math.PI/4;const g=el('path',{d:'M0,-13 L10,0 L0,13 L-10,0Z',fill:'#3a2d5e',stroke:'#fff4e6','stroke-width':2,transform:`translate(${(MX+Math.cos(a)*64).toFixed(1)},${(MY+Math.sin(a)*64).toFixed(1)})`},lampL);return g});
  const litGem=(i,on)=>{GEMS[i].setAttribute('fill',on?GC[i]:'#3a2d5e');if(on){GEMS[i].setAttribute('filter','url(#glow)')}else GEMS[i].removeAttribute('filter')};
  const birdG=el('g',{},lampL),mp=magpieFig(birdG,1.25),dot=dotSpark(mp.head,-31,5,4.5);dot.removeAttribute('class');
  const mood=m=>{mp.beak.setAttribute('d',m==='laugh'?'M-11,-1 L-29,1 L-11,4 M-11,6 L-27,12 L-11,10Z':'M-11,1 L-29,5 L-11,9Z')};
  /* lights */
  const heartL=el('g',{},hud);
  function drawHearts(){heartL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.hearts,g=el('g',{transform:`translate(${30+k*34},30)`},heartL);if(on)el('circle',{r:17,fill:'#ffc04d',opacity:.25},g);
    el('path',{d:'M-9,-10 Q0,-15 9,-10 V8 Q0,13 -9,8Z',fill:on?'#e8513e':'#3a3058',stroke:on?'#ffb86a':'#5a4a80','stroke-width':1.5},g);el('ellipse',{cx:0,cy:-1,rx:4.5,ry:6,fill:on?'#ffd27a':'#2a2245'},g)}}
  /* shared outcomes */
  function hit(msg,parts){S.busy=true;litGem(S.r,true);popIn(GEMS[S.r],1.8);SFX.crackGlass();SFX.chime();mood('');shake(5);
    tween(500,(t,p)=>mp.b.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*4)*10).toFixed(1)})`),()=>mp.b.removeAttribute('transform'),ease.lin);
    const [gx,gy]=[MX+Math.cos(-Math.PI/2+S.r*Math.PI/4)*64,MY+Math.sin(-Math.PI/2+S.r*Math.PI/4)*64];ring(gx,gy,{col:GC[S.r],r1:40});
    floatText(MX-20,MY-140,['Squawk!','Craa!','Hey!','Oi!','Rrrk!','Nooo!','Kraa!','Eek!'][S.r],{col:GC[S.r],size:22});
    if(parts)starterQ(qL,parts,true);say(`${msg} A prism lights up!`);later(2600,()=>{if(S.r===7)finale();else{S.r++;load()}})}
  function miss(msg){S.busy=true;SFX.laugh();mood('laugh');S.hearts--;drawHearts();shake(5);ring(30+S.hearts*34,30,{col:'#b48cff',r1:40});
    say(`${msg} The Magpie cackles!`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(2400,()=>{mood('');if(S.hearts<=0)lost();else load()})}
  function lost(){S.hearts=3;if(S.r>0){S.r--;litGem(S.r,false)}say('All your lights went out! The Magpie took a prism back. Try that one again.');later(2600,load)}
  const T=t=>fmtH(t*10);
  /* each question, mounted the way its island does it */
  const M={
    rock(k){const kit=rockKit(arena,{x0:40,y:262,L:360,h:34,railY:336});
      const g=decGo(arena,390,444,'Snap: break the rock off',()=>{if(S.busy)return;const got=kit.get();if(!got)return;kit.lock(true);g.style.display='none';
        kit.snap(220,170,()=>{if(got===k)hit(`${T(k)}: ${k} tenths!`,[['t','Snap off'],['w',T(k)]]);else miss(`That's ${got} tenths: ${T(got)}, not ${T(k)}.`)})},'Snap');
      return{parts:[['t','Snap off'],['w',T(k)]],say:`Snap off ${T(k)} of the rock, then Snap.`}},
    snail(vals,ord){const vs=[...vals].sort(()=>Math.random()-.5),kit=snailKit(arena,{x0:100,x1:400,max:10,yRule:126,lanes:ord?[214,294,374]:[230,330],vals:vs,mode:ord?'order':'pick',label:v=>`Snail ${v}`,onReady:r=>{g.style.display=r?'':'none'}});
      const best=[...vals].sort((a,b)=>toH(b)-toH(a)),g=decGo(arena,390,454,'Go: start the race',()=>{if(S.busy)return;S.busy=true;g.style.display='none';const pk=kit.picks();
        kit.race(()=>{const ok=ord?pk.every((o,k)=>o.v===best[k]):pk[0].v===best[0];kit.result(best[0],!ok&&!ord?pk[0].v:null);
          if(ok)hit(ord?`${best.join(' > ')}: line Dot up and compare from the left!`:`${best[0]} goes further: it's ${best[0]}0, more than ${best[1]}!`,ord?best.flatMap((v,k)=>k?[['o','>'],['w',v]]:[['w',v]]):[['w',best[0]],['o','>'],['w',best[1]]]);
          else miss(ord?`Furthest first is ${best.join(', ')}.`:`${best[0]} went further: ${best[0]} is the same as ${best[0]}0.`)})},'Go');g.style.display='none';
      return{parts:ord?vs.flatMap((v,k)=>k?[['t',','],['w',v]]:[['w',v]]):[['w',vs[0]],['o','?'],['w',vs[1]]],say:ord?'Tap the snails in order, furthest first, then Go.':'Which snail goes further? Tap it, then Go.'}},
    potion(n){const kit=pvKit(arena,{x0:40,y:282,cw:64,dw:42,ch:58,num:n,noDot:true}),ans=toH(n)*10;
      const fl=flask(arena,220,150,'× 10',true);fl.g.setAttribute('transform','translate(220,160) scale(.8)');
      const g=decGo(arena,390,444,'Pour the potion',()=>{if(S.busy)return;kit.lock(true);g.style.display='none';SFX.glug();
        if(kit.val()===ans)hit(`Every digit moved one place left: ${fmtH(ans)}!`,[['w',n],['o','×'],['w',10],['o','='],['w',fmtH(ans)]]);else miss(`Your digits say ${fmtH(kit.val())}. × 10 moves every digit one place left.`)},'Pour');
      return{parts:[['w',n],['o','×'],['w',10],['o','='],['o','?']],say:'Slide the digits to show the answer, then Pour.'}},
    dig(str){const v=toH(str),t=Math.floor(v/10),h=v%10,g=decGo(arena,392,474,'Dig here',()=>{if(S.busy)return;const got=kit.value();if(got==null)return;kit.lock(true);g.style.display='none';
        kit.dig(got===v,()=>{if(got===v)hit(`${str} is ${t} tenths and ${h} hundredths!`,[['w',str],['o','='],['w',t],['t','tenths +'],['w',h],['t','hundredths']]);else miss(`You dug at ${fmtH(got)}, not ${str}.`)})},'Dig');g.style.display='none';
      const kit=digKit(arena,{x0:40,x1:400,yTop:150,yZoom:318,target:v,onZoom:()=>{g.style.display=''}});
      return{parts:[['t','Dig at'],['w',str]],say:`Dig at ${str}: tap its stretch of beach, move the crab, then Dig.`}},
    tulips(pre){const t2=100-pre,fk=fieldKit(arena,{x:40,y:120,cs:22,pre:[{n:pre,col:'#ff5a7a'}],col:'#ffd34d'}),n=()=>L1.get()*10+L2.get();
      const L1=lever(arena,{x:300,y0:346,y1:146,n:10,cap:'tens',fmt:v=>`${v*10}`,label:'Tens lever: plants 10 at a time',col:'#ffd34d'});
      const L2=lever(arena,{x:384,y0:346,y1:146,n:9,cap:'ones',fmt:v=>`${v}`,label:'Ones lever: plants one at a time',col:'#ffd34d'});
      const g=decGo(arena,376,452,'Plant the tulips',()=>{if(S.busy)return;const m=n();if(!m)return;L1.lock(true);L2.lock(true);g.style.display='none';
        if(m>fk.room){miss('Too many: that’s more than the field holds.');return}
        fk.ghost(m);fk.bloom(()=>{if(m===t2)hit(`${pre}% + ${t2}% = 100%: the whole field!`,[['w',`${pre}%`],['o','+'],['w',`${t2}%`],['o','='],['w','100%']]);else miss(`${pre}% + ${m}% is ${pre+m}%, not 100%.`)})},'Plant');
      return{parts:[['w',`${pre}%`],['o','+'],['o','?'],['o','='],['w','100%']],say:`${pre}% is red. What percent is left? Work it out, set the levers, then Plant.`}},
    treasure([p,n]){const kit=barKit(arena,{x0:40,x1:400,y:226,h:84,n,knobAt:[150,424]});
      const g=decGo(arena,330,424,'Share out the treasure',()=>{if(S.busy)return;const pc=kit.pct();if(!pc)return;kit.lock(true);g.style.display='none';const got=n*pc/100;
        kit.share([MX-60,MY+20],[MX-60,MY+20],()=>{if(pc===p)hit(`Each part is ${100/kit.N()}%. ${p}% of ${n} = ${got}!`,[['w',`${p}%`],['t','of'],['w',n],['o','='],['w',got]]);else miss(`That's ${pc}%: ${got} coins, not ${p}%.`)})},'Share');
      return{parts:[['w',`${p}%`],['t','of'],['w',n],['o','='],['o','?']],say:`The Magpie wants ${p}% of ${n} coins. Cut the treasure, pick the parts, then Share.`}},
    lock(fi){const fv=WHEELS.f.vals[fi],ans=fv[0]*100/fv[1],f=lockWheel(arena,{kind:'f',x:130,y:250,start:fi,fixed:true}),p=lockWheel(arena,{kind:'p',x:290,y:250,start:(fi+4)%8});
      el('text',{x:130,y:384,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},arena).textContent='fraction: the clue';el('text',{x:290,y:384,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},arena).textContent='percent';
      const g=decGo(arena,390,440,'Turn the key',()=>{if(S.busy)return;p.lock(true);g.style.display='none';SFX.clonk();
        if(Math.abs(p.h()-ans)<1e-9)hit(`${fv[0]}/${fv[1]} = ${ans}%: ${ans} out of 100!`,[['f',fv[0],fv[1]],['o','='],['w',`${ans}%`]]);else miss(`${p.get()} isn't the same as ${fv[0]}/${fv[1]}.`)},'Key');
      return{parts:[['f',fv[0],fv[1]],['o','='],['o','?']],say:'Roll the percent wheel to match the clue, then turn the Key.'}}};
  function finale(){S.done=true;S.busy=true;SFX.fanfare();SFX.wake&&SFX.wake();arena.innerHTML='';
    const fx=MX-64,fy=MY-104;dot.remove();const d=dotSpark(lampL,fx,fy,6);d.removeAttribute('class');mood('laugh');document.body.classList.remove('dotless');
    tween(900,(t,p)=>d.setAttribute('transform',`translate(${lerp(fx,MX,t).toFixed(1)},${(lerp(fy,MY,t)-Math.sin(p*Math.PI)*50).toFixed(1)})`),()=>{
      d.remove();glass.setAttribute('fill','#fff3b0');core.setAttribute('fill','#fff8d8');core.setAttribute('filter','url(#glow)');SFX.chime();burst(MX,MY,{n:24});
      [0,1].forEach(k=>el('path',{d:`M${MX},${MY} L${MX-640},${MY-120} L${MX-640},${MY+120}Z`,fill:'#fff0a0',opacity:.16,transform:`rotate(${k*180} ${MX} ${MY})`},beam));
      let T=0;loop(dt=>{T+=dt;beam.setAttribute('transform',`rotate(${(Math.sin(T*.5)*35).toFixed(1)} ${MX} ${MY})`);birdG.setAttribute('transform',`translate(${(MX+6+Math.sin(T*1.3)*6).toFixed(1)},${(MY-92-Math.abs(Math.sin(T*2.6))*10).toFixed(1)})`)});
      GEMS.forEach((g,i)=>later(i*90,()=>ring(MX+Math.cos(-Math.PI/2+i*Math.PI/4)*64,MY+Math.sin(-Math.PI/2+i*Math.PI/4)*64,{col:GC[i],r1:40})));
      for(let k=0;k<10;k++)later(k*220,()=>burst(80+Math.random()*360,100+Math.random()*320,{n:10,cols:[GC[k%8],'#fff']}));
      const big=decNum(arena,220,260,'0.5',{sz:90});popIn(big.g,.4);
      el('text',{x:150,y:340,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#ffc04d'},arena).textContent='wholes';el('text',{x:290,y:340,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#ff9ec0'},arena).textContent='pieces';
      starterQ(qL,[['f',1,2],['o','='],['w','0.5'],['o','='],['w','50%']],true);
      say('Dot is back and the lighthouse shines again! Wholes on the left, pieces on the right: you did it!');unlock('dotback');clearIsland('magpie');
      later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.hearts=3;S.done=false;S.vr={};GEMS.forEach((g,i)=>litGem(i,false));go('magpie')}});s.ready(true)})},ease.inOut)}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';S.busy=false;navDots(8,S.r,true);drawHearts();mood('');
    let T=0;loop(dt=>{T+=dt;if(!S.done)birdG.setAttribute('transform',`translate(${MX+6},${(MY-92+Math.sin(T*1.5)*3).toFixed(1)})`);mp.head.setAttribute('transform',`translate(-25,-14) rotate(${(Math.sin(T*1.9)*8).toFixed(1)})`)});
    const q=Q[S.r],m=M[q.t](V(),q.ord);starterQ(qL,m.parts);
    say(S.r===0&&S.hearts===3&&!S.vr[0]?`The Magpie stole Dot! 3 lanterns: each mistake blows one out. ${m.say}`:m.say)}
  load();
}};
