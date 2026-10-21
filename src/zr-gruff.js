/* ---------- 9. Gruff the goat: the boss of the Old Road ---------- */
W.gruff={scene:'crag',
notes:`<p>The finale of the Old Road. Gruff the goat has been headbutting the milestones and scribbling on the signposts, and travellers are lost. Six messes to fix: re-carve a milestone he carved the long way (IIII); stand his knocked-over milestones back up in order, nearest first (IX before XI); correct a signpost he rounded the wrong way (digit wheels); read a bridge's year; fix the inn's sign to one decimal place; and finally a cart on a hill whose milestones are all in Roman numerals: which one will the LXXIV cart roll to?</p>
<p>Three carrots: a wrong answer loses one (and the next try is a different mess); lose all three and Gruff knocks a stone back over. Fix all six and Gruff gives up and trots off.</p>`,
mount(root){
  const Q=[{t:'fix',v:[{n:4,bad:'IIII'},{n:9,bad:'VIIII'},{n:40,bad:'XXXX'},{n:90,bad:'LXXXX'}]},
    {t:'order',v:[['XI','IX','XIV','XVI'],['XL','LX','XC','CX'],['IV','VI','IX','XI'],['XIX','XXI','XXIX','XXXI']]},
    {t:'sign',v:[{v:368000,step:100000,gr:300000,place:'Rome',digits:6},{v:45500,step:10000,gr:40000,place:'the sea',digits:5},{v:7450,step:1000,gr:8000,place:'the mill',digits:4}]},
    {t:'year',v:[{s:'MDCCCLXIV'},{s:'MCMXCIX'},{s:'MMXI'},{s:'MDCCLXXVI'}]},
    {t:'inn',v:[{v:3.46,gr:3.4},{v:2.95,gr:2.9},{v:4.04,gr:4.1}]},
    {t:'final',v:[{v:74,lo:40,hi:80},{v:65,lo:40,hi:80},{v:57,lo:30,hi:70},{v:83,lo:60,hi:100}]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const gf=gruffFig(side,{s:.95});gf.g.setAttribute('transform','translate(520,214)');const lifeL=el('g',{},hud),fixL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*30},34) rotate(30)`},lifeL);
    el('path',{d:'M0,-12 Q5,0 0,14 Q-5,0 0,-12Z',fill:on?'#ff8a3a':'#3a3450',stroke:on?'#a84a1a':'#55536a','stroke-width':1.5},g);el('path',{d:'M0,-12 l-5,-6 M0,-12 l0,-8 M0,-12 l5,-6',stroke:on?'#4a9a3a':'#55536a','stroke-width':2},g)}}
  function drawFixed(){fixL.innerHTML='';for(let k=0;k<Q.length;k++){const on=k<S.r,g=el('g',{transform:`translate(${30+k*26},70)`},fixL);milestone(g,0,10,{w:16,h:22});if(on)el('path',{d:'M-5,0 l3,4 l7,-8',stroke:'#1a5a3a','stroke-width':2.5,fill:'none',transform:'translate(0,-2)'},g);else g.setAttribute('opacity',.45)}}
  let loopT=0,cur=null;
  const card=t=>{el('rect',{x:22,y:120,width:440,height:410,rx:12,fill:'#fffaf0',stroke:'#8a7a5e','stroke-width':3},arena);el('text',{x:40,y:144,'font-size':14,'font-weight':800,fill:'#5a4a2e'},arena).textContent=t};
  const M={
    fix({n,bad}){card('Gruff’s milestone');const gs=el('g',{transform:'translate(120,250) rotate(-8)'},arena);milestone(gs,0,0,{txt:bad,sz:18,w:84,h:70});el('text',{x:120,y:274,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#5a4a2e'},arena).textContent=`for ${n} miles`;
      el('path',{d:'M180,226 l40,0 m-10,-8 l10,8 l-10,8',stroke:'#8a7a5e','stroke-width':3,fill:'none'},arena);
      const cv=carver(arena,{x:242,y:356,letters:'IVXLC',max:6,sz:36,ty:448,can:()=>!S.busy});
      return{say:`Gruff carved ${n} the long way: ${bad} won’t fit on a stone! Carve it properly.`,go:'Check the stone',check:()=>{const s=cv.get();if(!s)return{soft:true,msg:'Carve the number on the blank stone.'};const v=romanVal(s);
        return v===n&&s===toRoman(n)?{ok:true,msg:`${toRoman(n)} is ${n}: ${RV[toRoman(n).slice(-1)]} take away ${RV[toRoman(n).slice(-2,-1)]||0}.`.replace(/: \d+ take away 0\./,'.')}:{ok:false,msg:v===n?'That adds up, but it isn’t the short way. A small letter in front takes away.':`That reads ${v}, not ${n}.`}}}},
    order(list){card('Knocked over! Stand them up, nearest first');const sh=sshuffle(list,S.r*7+(S.vr[S.r]||0)*13+3);let stood=[];const L=el('g',{},arena);
      const draw=()=>{L.innerHTML='';el('path',{d:'M50,420 H430',stroke:'#cbb98e','stroke-width':16},L);
        stood.forEach((s,i)=>milestone(L,90+i*100,412,{txt:s,sz:18,w:60,h:60}));
        sh.forEach((s,i)=>{if(stood.includes(s))return;const g=el('g',{transform:`translate(${100+i*94},${236}) rotate(${[-80,75,-70,85][i]})`},L);milestone(g,0,0,{txt:s,sz:18,w:60,h:60});el('rect',{x:-40,y:-70,width:80,height:80,fill:'transparent'},g);
          interact(g,{label:`Fallen stone ${s}`,tap:()=>{if(S.busy)return;stood.push(s);SFX.thud?SFX.thud():SFX.pop(.7);draw()}})})};draw();
      return{say:'Gruff knocked these milestones over. Tap them in order: the nearest (smallest) first.',go:'Check the order',check:()=>{if(stood.length<list.length)return{soft:true,msg:'Stand all four up first: tap them, smallest first.'};
        const want=[...list].sort((a,b)=>romanVal(a)-romanVal(b)),ok=stood.every((s,i)=>s===want[i]);if(ok)return{ok:true,msg:`${want.map(s=>`${s} (${romanVal(s)})`).join(', ')}.`};const b=stood.findIndex((s,i)=>s!==want[i]),bad=stood[b];stood=[];draw();return{ok:false,msg:`${bad} is ${romanVal(bad)}, but ${want[b]} is only ${romanVal(want[b])}: it’s nearer. A small letter in front takes away.`}}}},
    sign({v,step,gr,place,digits}){card('Gruff’s signpost');const sg=el('g',{transform:'translate(124,330)'},arena);el('rect',{x:-4,y:-60,width:8,height:170,fill:'#8a5a34'},sg);
      el('path',{d:'M-90,-80 H80 L100,-60 L80,-40 H-90Z',fill:'#e8d2a8',stroke:'#8a5a34','stroke-width':2},sg);el('text',{x:-4,y:-55,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},sg).textContent=`${place}: ${fmtR(v)} steps`;
      el('path',{d:'M-90,-30 H80 L100,-10 L80,10 H-90Z',fill:'#e8d2a8',stroke:'#8a5a34','stroke-width':2},sg);el('text',{x:-4,y:-5,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#c9413a'},sg).textContent=`about ${fmtR(gr)}`;
      el('path',{d:'M-70,-10 l150,-6',stroke:'#c9413a','stroke-width':3,opacity:.0},sg);
      const wh=bigWheels(arena,{x:346,y:330,digits,label:'Rounded',cw:28});
      return{say:`Gruff rounded the signpost to the nearest ${fmtR(step)}, and got it wrong. Set the right number on the wheels.`,go:'Check the sign',check:()=>{const g=wh.get();if(g==null)return{soft:true,msg:'Set the wheels.'};const e=roundTo(v,step);
        return g===e?{ok:true,msg:`${fmtR(v)} is nearer ${fmtR(e)} than ${fmtR(gr)}. About ${fmtR(e)} steps.`}:{ok:false,msg:`${fmtR(v)} to the nearest ${fmtR(step)}: look at the next digit down. ${fmtR(g)} isn’t it.`}}}},
    year({s}){card('The old bridge');el('path',{d:'M60,330 Q240,190 420,330 V350 H60Z',fill:'#c2b294',stroke:STONE.edge,'stroke-width':3},arena);el('path',{d:'M150,350 Q240,270 330,350Z',fill:'#4a8ac8'},arena);
      const w=s.length*30*CW+30;el('rect',{x:240-w/2,y:226,width:w,height:46,rx:8,fill:STONE.face,stroke:STONE.edge,'stroke-width':2},arena);carve(arena,240,258,s,{sz:30});
      const wh=[0,1,2,3].map(i=>bigWheels(arena,{x:150+i*60,y:436,digits:1,label:`Year ${['thousands','hundreds','tens','ones'][i]}`,cw:34}));
      return{say:'When was this bridge built? Split it into thousands, hundreds, tens and ones in your head, then set the wheels.',go:'Check the year',check:()=>{const vs=wh.map(w=>w.get());if(vs.every(v=>v==null))return{soft:true,msg:'Set the four wheels to the year.'};
        const y=vs.reduce((a,v)=>a*10+(v||0),0),t=romanVal(s);return y===t?{ok:true,msg:`${s} is ${t}.`}:{ok:false,msg:`Not quite. Split ${s} into its places: thousands, hundreds, tens, ones.`}}}},
    inn({v,gr}){card('The sign to the inn');const sg=el('g',{transform:'translate(150,320)'},arena);el('rect',{x:-4,y:-40,width:8,height:170,fill:'#8a5a34'},sg);
      el('rect',{x:-96,y:-90,width:192,height:70,rx:8,fill:'#e8d2a8',stroke:'#8a5a34','stroke-width':2},sg);el('text',{y:-62,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},sg).textContent=`Inn: ${fmtR(v,2)} miles`;
      el('text',{y:-36,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#c9413a'},sg).textContent=`Gruff: about ${fmtR(gr,1)}`;
      const wh=bigWheels(arena,{x:350,y:320,digits:2,dp:1,label:'Miles',cw:36});
      return{say:'Gruff rounded the inn sign to 1 decimal place, and got it wrong. Set it right.',go:'Check the sign',check:()=>{const g=wh.get();if(g==null)return{soft:true,msg:'Set the wheels.'};const e=roundTo(v,.1);
        return Math.abs(g-e)<1e-9?{ok:true,msg:`${fmtR(v,2)} to 1 decimal place is ${fmtR(e,1)}.`}:{ok:false,msg:`Look at the hundredths in ${fmtR(v,2)}: 5 or more rounds the tenths up.`}}}},
    final({v,lo,hi}){card('The last cart');const r=hillRoad(arena,{lo,hi,step:10,tick:1,base:470,x0:66,x1:418,amp:60,lab:true,fmt:v=>toRoman(v),wide:false});let pk=null,fl=null;
      r.stones.forEach(({v:sv,m})=>{el('rect',{x:-26,y:-50,width:52,height:80,fill:'transparent'},m.g);interact(m.g,{label:`Milestone ${toRoman(sv)}`,tap:()=>{if(S.busy)return;pk=sv;SFX.tick(sv/10);if(fl)fl.remove();fl=el('g',{transform:`translate(${r.xOf(sv)},${r.yOf(sv)-40})`},arena);el('line',{x1:0,y1:0,x2:0,y2:-26,stroke:'#5a3a24','stroke-width':2.5},fl);el('path',{d:'M0,-26 L18,-21 L0,-16Z',fill:'#ffd23a'},fl)}})});
      const c=cartFig(arena,{s:.8,tag:toRoman(v)});r.place(c,v);
      return{say:`The ${toRoman(v)} cart is parked on the hill. Which milestone will it roll to? Tap it.`,go:'Let go',check:()=>{if(pk==null)return{soft:true,msg:'Tap the milestone you think it will roll to.'};const e=roundTo(v,10);
        return{roll:done=>r.roll(c,v,end=>done(end===pk?{ok:true,msg:`${toRoman(v)} is ${v}, nearest ${toRoman(e)} (${e}). Down it rolls!`}:{ok:false,msg:`${toRoman(v)} is ${v}: it rolled to ${toRoman(end)}, ${end}.`}),{wind:()=>gust(arena,r.xOf(v),r.yOf(v)-40)})}}}}};
  function hit(msg){S.busy=true;gf.mood('oh');gf.shrink();SFX.chime();bleat();shake(3);floatText(520,110,['Baa!','Meh!','Hmph!','Bleat!','Baaah…','Fine!'][S.r],{col:'#ffd23a',size:22});
    decQ(qL,[['t','Fixed!']],true,null);say(`${msg} One mess fixed!`);later(700,()=>{S.r++;drawFixed()});later(3000,()=>{gf.mood('');if(S.r>=Q.length)finale();else load()})}
  function miss(msg){S.busy=true;SFX.wrong();S.lives--;drawLives();gf.charge();later(250,()=>shake(5));bleat();say(`${msg} Gruff stamps his hoof…`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(3600,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;gf.grow();drawFixed()}say('No carrots left, and Gruff butted a stone back over. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;arena.innerHTML='';pane.innerHTML='';gf.mood('sad');SFX.fanfare();
    tween(1600,(t,p)=>gf.g.setAttribute('transform',`translate(${lerp(520,820,p).toFixed(1)},${(214+Math.sin(p*Math.PI*8)*4).toFixed(1)})`));
    const road=el('g',{},arena);el('path',{d:'M-100,420 H700',stroke:'#cbb98e','stroke-width':30},road);['V','X','XV','XX'].forEach((s,i)=>later(300+i*350,()=>{const m=milestone(road,90+i*110,404,{txt:s,sz:18,w:48,h:62});popIn(m.g,.3);SFX.thud?SFX.thud():SFX.pop(.8)}));
    const d=dexFig(arena,1.1);d.put(240,330);later(1500,()=>{d.cheer();heehaw()});for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*460,140+Math.random()*260,{n:10,cols:['#ffd23a','#7ab85a','#e2d6bf','#ff8a3a']}));
    decQ(qL,[['t','The road is clear!']],true,null);say('Gruff gives up and trots off up the crag. Every milestone is standing, every sign tells the truth, and Dex’s deliveries are done. You did it!');unlock('gruff');clearIsland('gruff');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};go('gruff')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,S.r,true);drawLives();drawFixed();
    loop(dt=>{loopT+=dt;gf.tick(loopT)});const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t',`mess ${S.r+1} of ${Q.length}`]],false,null);
    decGo(arena,560,500,cur.go,()=>{if(S.busy)return;const r=cur.check();if(r.soft){say(r.msg);return}if(r.roll){S.busy=true;r.roll(res=>res.ok?hit(res.msg):miss(res.msg));return}if(r.ok)hit(r.msg);else miss(r.msg)},'Check');
    say(S.r===0&&S.lives===3&&!S.vr[0]?`Gruff the goat has messed up the road! ${cur.say}`:cur.say)}
  W.gruff.dbgQ=()=>({t:Q[S.r]&&Q[S.r].t,v:Q[S.r]?V():null,r:S.r,lives:S.lives,done:S.done});
  load();
}};
