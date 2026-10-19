/* ---------- 5. Fudge the fox: the boss of the Survey Isles ---------- */
W.fudge={scene:'survey',
notes:`<p>The finale of the Survey Isles. Fudge the fox makes charts that fib, and each page is one of his tricks to catch and fix: a bar chart whose scale starts at 45 so his 52 carrots look miles more than Pip's 48 (drag the bottom of the scale down to 0); a scale that goes 0, 1, 2, 3, then jumps to 10 (tap the number that breaks the pattern); a pictogram where his pictures are drawn bigger (who really has more?); a pictogram with the key hidden (Pip counted the eggs: what must each picture be worth?); and a line graph that skips weeks so his sunflower looks like it grew fast (tap where the weeks are missing).</p>
<p>Three pencils: a wrong answer loses one (the next try is a different chart); lose all three and Fudge sneaks a fib back in. Fix all five and Fudge slinks off.</p>`,
mount(root){
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const Q=[{t:'axis',v:[{a:52,b:48,lo:45},{a:36,b:33,lo:30},{a:44,b:41,lo:40}]},{t:'scale',v:[{lab:[0,5,10,15,30,25],bad:4},{lab:[0,2,4,6,8,20],bad:5},{lab:[0,10,20,40,50,60],bad:3}]},
    {t:'big',v:[{f:3,p:5,top:'f'},{f:5,p:5,top:'p'},{f:4,p:6,top:'p'},{f:6,p:4,top:'f',fair:1}]},{t:'key',v:[{pics:6,real:12,ans:2},{pics:3,real:15,ans:5},{pics:5,real:5,ans:1}]},{t:'line',v:[{wk:[1,2,3,6,7],h:[10,20,30,40,50],gap:2},{wk:[1,2,5,6,7],h:[15,25,35,45,55],gap:1},{wk:[1,2,3,4,8],h:[5,15,25,35,45],gap:3}]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const fx=fudgeFig(side,{s:.85});fx.g.setAttribute('transform','translate(540,190)');const lifeL=el('g',{},hud),fixL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*30},34) rotate(35)`},lifeL);
    el('rect',{x:-4,y:-14,width:8,height:22,fill:on?'#ffd23a':'#3a3450',stroke:on?'#a8743a':'#55536a','stroke-width':1.5},g);el('path',{d:'M-4,8 L0,15 L4,8Z',fill:on?'#f4d8a0':'#3a3450'},g);el('rect',{x:-4,y:-18,width:8,height:5,fill:on?'#ff9ed2':'#3a3450'},g)}}
  function drawFixed(){fixL.innerHTML='';for(let k=0;k<5;k++){const on=k<S.r,g=el('g',{transform:`translate(${30+k*26},70)`},fixL);el('rect',{x:-10,y:-10,width:20,height:20,rx:3,fill:on?'#8ff0c8':'#4a3a50',stroke:on?'#3a8a5a':'#55536a','stroke-width':2},g);if(on)el('path',{d:'M-5,0 l3,4 l7,-8',stroke:'#1a5a3a','stroke-width':2.5,fill:'none'},g)}}
  let loopT=0,cur=null;
  const card=(t)=>{el('rect',{x:40,y:130,width:400,height:330,rx:12,fill:'#fffaf0',stroke:'#e8813a','stroke-width':3},arena);el('text',{x:56,y:152,'font-size':13,'font-weight':800,fill:'#8a4a1a'},arena).textContent=t};
  const M={
    axis({a,b,lo}){card('Fudge’s carrots');const L=el('g',{},arena);let low=lo;
      const draw=()=>{L.innerHTML='';const fr=chartFrame(L,{x:110,y:176,w:250,h:240,lo:low,hi:60,step:5,lab:low%10?5:10});[[a,'Fudge','#e8813a',185],[b,'Pip','#7fc86a',285]].forEach(([v,n,c,x])=>{const top=fr.yOf(v);el('rect',{x:x-30,y:top,width:60,height:416-top,fill:c,stroke:darker(c,.6),'stroke-width':2},L);el('text',{x,y:436,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#3a2418'},L).textContent=n});
        const hd=el('g',{transform:'translate(110,446)'},L);el('line',{x1:0,x2:0,y1:-30,y2:-14,stroke:'#7a4a1e','stroke-width':2},hd);el('circle',{r:15,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2.5},hd);el('path',{d:'M-5,-3 L0,-9 L5,-3Z M-5,3 L0,9 L5,3Z',fill:'#7a4a1e'},hd);
};
      const hit=el('rect',{x:30,y:176,width:110,height:280,fill:'transparent'},arena);let y0=null,l0=0;
        interact(hit,{label:'The bottom of the scale',down:p=>{y0=p.y;l0=low;return{}},move:p=>{if(S.busy||y0==null)return;const n=clamp(l0-Math.round((y0-p.y)/-10)*5,0,lo);if(n!==low){low=n;SFX.tick(low/5%8);draw()}},up:()=>{y0=null},tap:()=>{}});
        hit.addEventListener('keydown',e=>{if(S.busy)return;const d=e.key==='ArrowDown'?-5:e.key==='ArrowUp'?5:0;if(!d)return;e.preventDefault();low=clamp(low+d,0,lo);SFX.tick(low/5%8);draw()});draw();
      return{say:`Fudge says his carrots beat Pip’s by miles! Is that fair? Fix his chart.`,go:'Check the chart',check:()=>low===0?{ok:true,msg:`From 0, ${a} and ${b} look almost the same. Fudge only won by ${a-b}!`}:low===lo?{soft:true,msg:'Drag the bottom of the scale (the grip on the left).'}:{ok:false,msg:'A bar chart’s scale should start at 0.'}}},
    scale({lab,bad}){card('Fudge’s scale');let pick=null;const L=el('g',{},arena);
      const draw=()=>{L.innerHTML='';const x=150,y0=410,dy=44;el('line',{x1:x,x2:x,y1:y0-dy*5-10,y2:y0,stroke:'#3a2418','stroke-width':3},L);
        lab.forEach((v,i)=>{const y=y0-i*dy,g=el('g',{},L);el('line',{x1:x,x2:x+240,y1:y,y2:y,stroke:'#e8dcc4','stroke-width':1.5},g);if(pick===i)el('circle',{cx:x-26,cy:y,r:17,fill:'none',stroke:'#9a6cff','stroke-width':3},g);
          el('text',{x:x-26,y:y+6,'text-anchor':'middle','font-size':17,'font-weight':800,fill:'#3a2418'},g).textContent=v;el('rect',{x:x-50,y:y-18,width:48,height:36,fill:'transparent'},g);interact(g,{label:`Scale label ${v}`,tap:()=>{if(S.busy)return;pick=i;SFX.tick(i+2);draw()}})});
        [[2.5,'#e8813a'],[3.6,'#7fc86a'],[1.6,'#4aa0ff']].forEach(([h,c],i)=>el('rect',{x:x+30+i*70,y:y0-h*dy,width:44,height:h*dy,fill:c,opacity:.85},L))};draw();
      return{say:'Fudge’s scale has a fib in it. Tap the number that breaks the pattern.',go:'Check: this number',check:()=>pick==null?{soft:true,msg:'Tap a number on the scale.'}:pick===bad?{ok:true,msg:`The steps should all be the same: ${lab.slice(0,bad).join(', ')}, then ${lab[bad-1]+lab[1]}, not ${lab[bad]}.`}:{ok:false,msg:'The steps on a scale must all be the same size.'}}},
    big({f,p,top}){card('Who has more hens?');let pick=null;const L=el('g',{},arena),rows=top==='f'?[['Fudge',f,1.6,56],['Pip',p,1,34]]:[['Pip',p,1,34],['Fudge',f,1.6,56]];
      const draw=()=>{L.innerHTML='';rows.forEach(([n,c,s,dx],i)=>{const y=214+i*100,g=el('g',{},L);el('rect',{x:56,y:y-42,width:368,height:84,rx:10,fill:pick===n?'#fff4c0':'rgba(201,167,122,.1)',stroke:pick===n?'#9a6cff':'#e8dcc4','stroke-width':pick===n?4:2},g);
          el('text',{x:70,y:y+5,'font-size':15,'font-weight':800,fill:'#3a2418'},g).textContent=n;for(let j=0;j<c;j++)animalIcon(g,140+j*dx,y,'hen',s);interact(g,{label:`${n}’s hens`,tap:()=>{if(S.busy)return;pick=n;SFX.tick(i+3);draw()}})});
        const sg=el('g',{transform:'translate(240,410)'},L);el('rect',{x:-60,y:-18,width:120,height:36,rx:10,fill:pick==='Same'?'#fff4c0':'#e8f0ff',stroke:pick==='Same'?'#9a6cff':'#4a7ab8','stroke-width':pick==='Same'?4:2},sg);el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#2a4a7a'},sg).textContent='the same';
        interact(sg,{label:'They have the same',tap:()=>{if(S.busy)return;pick='Same';SFX.tick(6);draw()}});
        el('text',{x:240,y:446,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#2a4a7a'},L).textContent='key: one picture = 1 hen'};draw();
      const ans=f>p?'Fudge':f<p?'Pip':'Same';
      return{say:'Fudge says he has the most hens. Who really has more?',go:'Check',check:()=>pick==null?{soft:true,msg:'Tap a row, or “the same”.'}:pick===ans?{ok:true,msg:ans==='Same'?`${f} each! Fudge’s bigger pictures just take up more room.`:ans==='Fudge'?`Fudge really does have more this time: ${f} to ${p}. Count, don’t guess!`:`Pip has ${p}, Fudge has ${f}. Fudge just drew his pictures bigger!`}:{ok:false,msg:'Count the pictures, not how much space they take.'}}},
    key({pics,real,ans}){card('Fudge’s eggs');let pick=null;const L=el('g',{},arena);
      const draw=()=>{L.innerHTML='';el('text',{x:60,y:186,'font-size':13,'font-weight':800,fill:'#3a2418'},L).textContent='Fudge’s pictogram';
        for(let j=0;j<pics;j++){const x=80+j*48;el('ellipse',{cx:x,cy:218,rx:14,ry:18,fill:'#fff4e6',stroke:'#a8743a','stroke-width':2},L)}
        el('text',{x:60,y:276,'font-size':13,'font-weight':800,fill:'#3a2418'},L).textContent='Pip counted the real eggs in the basket:';
        el('path',{d:'M60,300 h360 l-20,90 h-320Z',fill:'#c9a27a',stroke:'#7a5a3a','stroke-width':2},L);for(let j=0;j<real;j++)el('ellipse',{cx:92+(j%10)*32,cy:320+Math.floor(j/10)*30,rx:11,ry:14,fill:'#fff4e6',stroke:'#a8743a','stroke-width':1.5},L);};draw();
      el('rect',{x:478,y:266,width:124,height:24,rx:8,fill:'#fffaf0',stroke:'#e8813a','stroke-width':2},pane);el('text',{x:540,y:283,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#8a4a1a'},pane).textContent='the hidden key:';
      const keys=()=>{[...pane.querySelectorAll('.kk')].forEach(n=>n.remove());[1,2,5].forEach((k,i)=>{const g=el('g',{class:'kk',transform:`translate(540,${312+i*50})`},pane);el('rect',{x:-56,y:-18,width:112,height:36,rx:10,fill:pick===k?'#fff4c0':'#e8f0ff',stroke:pick===k?'#9a6cff':'#4a7ab8','stroke-width':pick===k?4:2},g);
        el('ellipse',{cx:-28,cy:0,rx:8,ry:11,fill:'#fff4e6',stroke:'#a8743a','stroke-width':1.5},g);el('text',{x:4,y:6,'font-size':15,'font-weight':800,fill:'#2a4a7a'},g).textContent=`= ${k}`;interact(g,{label:`Key: one picture is ${k}`,tap:()=>{if(S.busy)return;pick=k;SFX.tick(k);keys()}})})};keys();
      return{say:'Fudge hid the key! Pip counted the real eggs. What must each picture be worth?',go:'Check the key',check:()=>pick==null?{soft:true,msg:'Pick a key.'}:pick===ans?{ok:true,msg:`${pics} pictures × ${ans} = ${real} eggs. The key makes it honest.`}:{ok:false,msg:'Try the key on the pictures: count the pictures in that many and see if it matches the basket.'}}},
    line({wk,h,gap}){card('Fudge’s sunflower');let pick=null;const L=el('g',{},arena);
      const draw=()=>{L.innerHTML='';const fr=chartFrame(L,{x:100,y:180,w:300,h:220,lo:0,hi:60,step:10,lab:20,unit:'cm'}),X=i=>130+i*60;
        el('polyline',{points:h.map((v,i)=>`${X(i)},${fr.yOf(v)}`).join(' '),fill:'none',stroke:'#3a8a3a','stroke-width':3.5},L);h.forEach((v,i)=>el('circle',{cx:X(i),cy:fr.yOf(v),r:6,fill:'#3a8a3a',stroke:'#fff','stroke-width':2},L));
        wk.forEach((w,i)=>el('text',{x:X(i),y:420,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#3a2418'},L).textContent=`wk ${w}`);
        for(let i=0;i<wk.length-1;i++){const g=el('g',{},L);el('rect',{x:X(i)+8,y:426,width:44,height:22,rx:6,fill:pick===i?'rgba(154,108,255,.3)':'transparent',stroke:pick===i?'#9a6cff':'none','stroke-width':2},g);interact(g,{label:`Between week ${wk[i]} and week ${wk[i+1]}`,tap:()=>{if(S.busy)return;pick=i;SFX.tick(i+2);draw()}})}};draw();
      return{say:'Fudge says his sunflower grew the same every week. Tap where he cheated.',go:'Check: here',check:()=>pick==null?{soft:true,msg:'Tap a gap between two weeks.'}:pick===gap?{ok:true,msg:`He skipped from week ${wk[gap]} to week ${wk[gap+1]}: that 10 cm took ${wk[gap+1]-wk[gap]} weeks!`}:{ok:false,msg:'Look at the week numbers: they should go up by one each time.'}}}};
  function hit(msg){S.busy=true;fx.mood('oh');fx.shrink();SFX.chime();SFX.whoosh&&SFX.whoosh();shake(3);floatText(540,100,['Ahem!','Who drew that?','Oops…','Er… a mistake!','Fair cop!'][S.r],{col:'#ffd23a',size:20});
    decQ(qL,[['t','Chart fixed!']],true,null);say(`${msg} One fib fixed!`);later(700,()=>{S.r++;drawFixed()});later(3000,()=>{fx.mood('');if(S.r>=Q.length)finale();else load()})}
  function miss(msg){S.busy=true;SFX.wrong();S.lives--;drawLives();shake(3);fx.mood('');SFX.laugh&&SFX.laugh();say(`${msg} Fudge sniggers…`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(3600,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;fx.grow();drawFixed()}say('No pencils left, and Fudge sneaked a fib back in. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;arena.innerHTML='';pane.innerHTML='';fx.mood('sad');SFX.fanfare();
    tween(1400,(t,p)=>fx.g.setAttribute('transform',`translate(${lerp(540,820,p).toFixed(1)},${(190+Math.sin(p*Math.PI*6)*5).toFixed(1)})`));
    const p=pipFig(arena,1.6);p.put(240,330);later(400,()=>p.cheer());const bd=el('g',{transform:'translate(240,220)'},arena);el('rect',{x:-90,y:-60,width:180,height:110,rx:6,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':3},bd);
    [30,60,45,75].forEach((h,i)=>el('rect',{x:-70+i*38,y:40-h,width:26,height:h,fill:['#8fd6ff','#e8813a','#7fc86a','#ffd23a'][i]},bd));popIn(bd,.3);
    for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*460,140+Math.random()*300,{n:10,cols:['#ffd23a','#7fc86a','#e8813a','#4aa0ff']}));
    decQ(qL,[['t','Every chart is honest!']],true,null);say('Fudge slinks off with his tail down. Every chart tells the truth again, and Pip’s survey is done. You did it!');unlock('fudge');clearIsland('fudge');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};go('fudge')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';pane.innerHTML='';S.busy=false;navDots(Q.length,S.r,true);drawLives();drawFixed();
    loop(dt=>{loopT+=dt;fx.tick(loopT)});const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t',`fib ${S.r+1} of 5`]],false,null);
    decGo(arena,560,500,cur.go,()=>{if(S.busy)return;const r=cur.check();if(r.soft){say(r.msg);return}if(r.ok)hit(r.msg);else miss(r.msg)},'Check');
    say(S.r===0&&S.lives===3&&!S.vr[0]?`Fudge the fox makes charts that fib. Catch all five! ${cur.say}`:cur.say)}
  W.fudge.dbgQ=()=>({t:Q[S.r].t,v:V(),r:S.r,lives:S.lives});
  load();
}};
