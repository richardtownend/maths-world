/* ---------- 7. The Inkblot: the boss of the Story Isles ---------- */
W.inkblot={scene:'inky',
notes:`<p>The finale of the Story Isles. The Inkblot has splashed ink over seven pages of Pip's storybook, and each page is mended the way its island works: the balance scale (what's in Leo's bag?), the height wall (Mum is 25 years older than Jo: drag Jo's tower and set the scoreboard), the copier and seesaw (a dog 5 times as heavy as a cat), the depot (minibuses for 45 people), the shop (step 1 at the till, step 2 in coins), the Number Muncher (undo potions, then the dial), and a last page where she picks which of two bar pictures fits the story before she types the ending.</p>
<p>Every page mended wipes away some ink. Three pencils: a wrong answer snaps one (and the page comes back with different numbers); lose all three and the ink creeps back over a page. Mend all seven and the Inkblot is wiped away.</p>`,
mount(root){
  const Q=[{t:'parts',v:[[20,8],[23,9],[25,7]]},{t:'compare',v:[[34,25],[40,26],[37,29]]},{t:'times',v:[[4,5],[3,6],[7,3]]},{t:'ferry',v:[[45,10],[52,10],[29,8]]},{t:'steps',v:[[4,3,20],[5,3,20],[3,6,25]]},{t:'machine',v:[[3,2,20],[4,3,31],[5,1,26]]},{t:'picture',v:[[3,6,5],[4,5,6],[3,7,4]]}];
  const S={r:0,lives:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),pane=el('g',{},root),hud=el('g',{},root);
  const MX=530,MY=140,ink=inkblotFig(side,{s:.7});ink.g.setAttribute('transform',`translate(${MX},${MY}) scale(.7)`);
  const lifeL=el('g',{},hud);
  function drawLives(){lifeL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.lives,g=el('g',{transform:`translate(${30+k*30},34) rotate(-35)`},lifeL);
    el('rect',{x:-4,y:-18,width:8,height:28,rx:1,fill:on?'#ffc04d':'#3a3450'},g);el('path',{d:'M-4,10 L0,18 L4,10Z',fill:on?'#f4c8a0':'#3a3450'},g);el('rect',{x:-4,y:-23,width:8,height:6,rx:2,fill:on?'#ff9ed2':'#3a3450'},g);
    if(!on)el('path',{d:'M-9,-2 L9,4',stroke:'#191428','stroke-width':3},g)}}
  let loopT=0,cur=null,goB=null;
  const lab=(g,x,y,t,q)=>{const b=el('g',{transform:`translate(${x},${y})`},g),w=Math.max(30,String(t).length*11+12);el('rect',{x:-w/2,y:-12,width:w,height:24,rx:7,fill:q?'#f4eefa':'#fff4e6'},b);
    el('text',{y:6,'text-anchor':'middle','font-size':16,'font-weight':700,fill:q?'#9a6cff':'#3a2418'},b).textContent=t;return b};
  const txt=(g,x,y,t,o={})=>{const e=el('text',Object.assign({x,y,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#fff0a0'},o),g);e.textContent=t;return e};
  const card=(lines,ask,who)=>storyCard(arena,{lines,ask,w:420,who});
  const clearPane=()=>{pane.innerHTML=''};
  /* each page: build it, and return check(done) -> done({ok,msg,ans}) or done({stage:true}) to carry on */
  const M={
    parts([W,p]){const c=card([['I had some marbles in my bag.'],['I won',{n:p,id:'a'},'more!'],['Now I’ve got',{n:W,id:'b'}]],'How many were in Leo’s bag at the start?',['Leo','Leo','Leo']),top=92+c.h;
      const bal=balanceKit(arena,{cy:Math.max(310,top+78)}),mys=mysteryFig(bal.pan(-1),-42,-20,'bag');mys.g.setAttribute('transform','translate(-42,-20) scale(1.15)');storyBundle(bal.pan(-1),42,-16,'marble',p,{s:1.1});storyBundle(bal.pan(1),0,-16,'marble',W,{s:1.1});
      [['at the start',-42,-1],['won',42,-1],['now',0,1]].forEach(([t,x,sd])=>txt(bal.pan(sd),x,34,t,{'font-size':14}));
      const pad=numPad(pane,{y:Math.max(250,top+14),label:'What is in the bag?',onChange:v=>mys.set(v)});const ans=W-p;
      return{say:'What’s in Leo’s bag? Set it on the wheels, then Go.',go:'Go: let go of the scale',check(done){const v=pad.get();if(v==null){say('Turn the wheels first.');return}pad.lock(true);
        bal.letGo(v+p,W,()=>done(v===ans?{ok:true,msg:`It balances! ${W} − ${p} = ${ans}.`,ans}:{ok:false,msg:`It tips! ${W} is all of them now, so take away: ${W} − ${p}.`}));return true}}},
    compare([a,d]){const c=card([['My sunflower is',{n:a,id:'a',t:`${a} cm`},'tall.'],['That’s',{n:d,id:'b',t:`${d} cm`},'taller than Jo’s.']],'How tall is Jo’s sunflower?',['Mum','Mum']),top=92+c.h+56,G=462,u=(G-top)/(a+d),XA=150,XB=300;let dir=0;
      el('rect',{x:40,y:G,width:420,height:6,rx:3,fill:'#6a4a3a'},arena);towerFig(arena,{x:XA,ground:G,h:a*u,look:'stalk',name:'Mum'});const B=towerFig(arena,{x:XB,ground:G,h:a*u,look:'stalk',name:'Jo'});B.grip(true);
      el('line',{x1:XA-40,x2:XB+46,y1:G-a*u,y2:G-a*u,stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'6 5',opacity:.8},arena);
      const set=k=>{if(k===dir)return;dir=k;SFX.boing?SFX.boing():SFX.tick(3);B.set((a+k*d)*u)},near=p=>{let b=0,bd=1e9;[-1,0,1].forEach(k=>{const dd=Math.abs(p.y-(G-(a+k*d)*u));if(dd<bd){bd=dd;b=k}});return b};
      const hit=el('rect',{x:XB-60,y:top-40,width:120,height:G-top+40,fill:'transparent'},arena);
      interact(hit,{label:'Jo’s sunflower: drag its top up or down',down:p=>{set(near(p));return{}},move:p=>set(near(p)),tap:p=>{if(p)set(near(p))}});
      hit.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();set(Math.min(1,dir+1))}if(e.key==='ArrowDown'){e.preventDefault();set(Math.max(-1,dir-1))}});
      txt(pane,540,266,'Jo’s, in cm',{'font-size':15});const wh=digitWheels(pane,{x:540,y:340,label:'Scoreboard'});const ans=a-d;
      return{say:'Drag Jo’s sunflower taller or shorter, set the scoreboard, then Check.',go:'Check',check(done){if(!dir){say('Drag Jo’s sunflower first.');return}
        if(dir!==-1){done({ok:false,msg:`Mum’s is taller, so Jo’s is shorter.`});return}
        done(wh.get()===ans?{ok:true,msg:`Shorter, so take away: ${a} − ${d} = ${ans} cm.`,ans}:{ok:false,msg:`Not ${wh.get()} cm. Shorter, so take away: ${a} − ${d}.`})}}},
    times([u,f]){const c=card([['I weigh',{n:u,id:'a',t:`${u} kg`}],['I weigh',{n:f,id:'b'},'times as much as the cat!']],'How heavy is the dog?',['cat','dog']);let n=1,stage=0,pad=null;
      const ss=seesawKit(arena),L=ss.seat(-1);thingFig(L,0,0,'dog',1.6);kgTag(L,-62,-40,'?',true);
      const pile=()=>{const s=ss.seat(1);s.innerHTML='';for(let i=0;i<n;i++)thingFig(s,-40+(i%3)*40,-Math.floor(i/3)*34,'cat',.72);kgTag(s,0,-Math.ceil(n/3)*34-36,`${u} kg each`)};pile();
      const cp=el('g',{transform:'translate(525,268)'},pane);el('rect',{x:-44,y:-26,width:88,height:44,rx:8,fill:'#5a6a8a',stroke:'#2a3a5a','stroke-width':2},cp);el('text',{y:4,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},cp).textContent='COPIER';
      const sp=stepper(pane,{x:525,y:330,min:1,max:8,val:1,w:150,label:'Copies',fmt:k=>`×${k}`,onChange:k=>{n=k;SFX.pop(1);pile()}});const ans=u*f;
      return{say:'Copy the cat until it balances the dog, then Check.',go:'Check',check(done){
        if(stage===0){sp.lock(true);ss.release(u*f,u*n,()=>{if(n!==f){done({ok:false,msg:`It tips! ${f} times as heavy means ${f} cats.`});return}
            stage=1;clearPane();pad=numPad(pane,{y:262,post:' kg',label:'How heavy is the dog?'});SFX.chime();say('Balanced! How heavy is the dog?');done({stage:true})});return true}
        const v=pad.get();if(v==null){say('Set the weight first.');return}done(v===ans?{ok:true,msg:`${f} × ${u} kg = ${ans} kg.`,ans:`${ans} kg`}:{ok:false,msg:`Not ${v} kg. It’s ${f} lots of ${u} kg.`})}}},
    ferry([N,k]){const c=card([[{n:N,id:'a'},'of us are going to the zoo.'],['A minibus takes',{n:k,id:'b'},'people.']],'How many minibuses are needed?',['teacher','teacher']),y0=92+c.h+30,toks=[];let n=1;
      for(let i=0;i<N;i++)toks.push(ferryToken(arena,60+(i%15)*26,y0+Math.floor(i/15)*26,'child'));
      const sg=el('g',{transform:'translate(525,252)'},pane);el('rect',{x:-64,y:-30,width:128,height:64,rx:10,fill:'#3a2a24',stroke:'#c9a24a','stroke-width':2.5},sg);txt(sg,0,-12,'THE DEPOT',{'font-size':12});txt(sg,0,16,`minibus takes ${k}`,{'font-size':13,fill:'#fff4e6'});
      const sp=stepper(pane,{x:525,y:340,min:1,max:9,val:1,w:150,label:'Order minibuses',onChange:v=>{n=v}});txt(pane,525,306,'order minibuses',{'font-size':14});const ans=Math.ceil(N/k),f=Math.floor(N/k),r=N%k;
      return{say:'Order the minibuses you need from the depot, then Go.',go:'Go: load them up',check(done){sp.lock(true);const bw=Math.max(54,Math.ceil(k/2)*16+14),gap=bw+8,sc=Math.min(1,430/(n*gap)),yard=el('g',{transform:`translate(40,440) scale(${sc.toFixed(3)}) translate(-40,-440)`},arena);
        const boxes=[...Array(n)].map((_,i)=>ferryBox(yard,40+bw/2+i*gap,440,'child',k)),cap=n*k;
        toks.forEach((tk,i)=>{const b=Math.floor(i/k),[x,y]=b<n?boxes[b].slot(i%k):[300+((i-cap)%8)*16,384+Math.floor((i-cap)/8)*18],X=b<n?40+(x-40)*sc:x,Y=b<n?440+(y-440)*sc:y,ts=b<n?.8*sc:.8,m=tk.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)/);
          later(200+i*35,()=>{SFX.tick(i%8);tween(220,t=>tk.setAttribute('transform',`translate(${lerp(+m[1],X,t).toFixed(1)},${lerp(+m[2],Y,t).toFixed(1)}) scale(${ts.toFixed(2)})`))})});
        later(200+N*35+700,()=>done(n===ans?{ok:true,msg:`${N} ÷ ${k} = ${f} remainder ${r}. The last ${r} need a minibus too: ${ans}.`,ans}:{ok:false,msg:n<ans?`${N-cap} left behind! Nobody can be left behind.`:'An empty minibus! Too many.'}));return true}}},
    steps([v,n,Wm]){const c=card([['Cakes are',{n:v,id:'a',t:`£${v}`},'each.'],['I’ll buy',{n,id:'b'},'and pay with',{n:Wm,id:'c',t:`£${Wm}`}]],'How much change does Mia get?',['Mia','Mia']),PY=92+c.h+14;let stage=0,pad=null,tray=null;const r1=v*n,ans=Wm-r1;
      const panel=el('g',{},arena),frame=(k,t)=>{panel.innerHTML='';el('rect',{x:30,y:PY,width:430,height:470-PY+8,rx:16,fill:'rgba(34,24,48,.9)',stroke:k===1?'#8fd6ff':'#ffc04d','stroke-width':3},panel);
        el('rect',{x:30,y:PY,width:430,height:34,rx:14,fill:k===1?'#8fd6ff':'#ffc04d'},panel);el('text',{x:44,y:PY+23,'font-size':16,'font-weight':800,fill:'#241a3a'},panel).textContent=`Step ${k}: ${t}`};
      frame(1,`How much do ${n} cakes cost?`);const sp=Math.min(70,380/n);for(let i=0;i<n;i++){const x=245-(n-1)*sp/2+i*sp;shopItem(panel,x,PY+110,'cake',1.2);kgTag(panel,x,PY+150,`£${v}`)}
      pad=numPad(pane,{y:262,pre:'£',label:'The till'});
      return{say:'Step 1: how much do the cakes cost? Set it on the till, then Check.',go:'Check',check(done){
        if(stage===0){const x=pad.get();if(x==null){say('Set it on the till first.');return}if(x!==r1){done({ok:false,msg:`Step 1 is ${n} lots of £${v}.`});return}
          stage=1;clearPane();frame(2,`How much change from £${Wm}?`);const rc=el('g',{transform:`translate(50,${PY+48})`},panel);el('rect',{width:200,height:50,rx:4,fill:'#fff8ec',stroke:'#c9a77a'},rc);el('text',{x:10,y:32,'font-size':16,'font-weight':700,fill:'#3a2418'},rc).textContent=`${n} cakes: £${r1}`;
          txt(panel,340,PY+80,`paid with £${Wm}`,{'font-size':16});tray=coinTray(panel,{x:50,y:PY+116,w:400,h:Math.min(96,470-PY-120),px:500,py:Math.max(276,PY+40)});txt(pane,528,Math.max(276,PY+40)-34,'coins',{'font-size':14});
          SFX.chime();say(`Yes, £${r1}! Now Step 2: her change, in coins.`);done({stage:true});return}
        const t=tray.get();if(!t){say('Put some coins in the tray first.');return}done(t===ans?{ok:true,msg:`£${Wm} − £${r1} = £${ans} change.`,ans:`£${ans}`}:{ok:false,msg:`The tray has £${t}. Change is £${Wm} take away £${r1}.`})}}},
    machine([m,a,out]){const c=card([['I ate a number!'],['I gulped',{n:m,id:'a',t:`×${m}`},'then',{n:a,id:'b',t:`+${a}`}],['and spat out',{n:out,id:'c'}]],'What number did the Muncher eat?',['Muncher','Muncher','Muncher']),Y1=92+c.h+52,Y2=Y1+90,xs=[90,207,323,440],slot=[null,null];let stage=0,wh=null;const ans=(out-a)/m;
      muncherFig(arena,xs[0],Y1,.82);const bot=(g,x,y,t,col)=>{const b=el('g',{transform:`translate(${x},${y})`},g);el('rect',{x:-9,y:-30,width:18,height:12,rx:3,fill:'#c9b8e8',stroke:'#5a3aa0','stroke-width':2},b);el('rect',{x:-32,y:-20,width:64,height:44,rx:14,fill:col,stroke:'#fff0a0','stroke-width':2},b);txt(b,0,9,t,{'font-size':21,fill:'#241a3a'});return b};
      const ballB=(x,y,t)=>{const b=el('g',{transform:`translate(${x},${y})`},arena);el('circle',{r:24,fill:t==='?'?'#fff4e6':'#ffe9a8',stroke:'#c9a77a','stroke-width':2.5},b);txt(b,0,8,t,{'font-size':20,fill:t==='?'?'#9a6cff':'#3a2418'})};
      const arw=(x0,x1,y)=>el('path',{d:`M${x0},${y} H${x1} M${x1+(x1>x0?-8:8)},${y-6} L${x1},${y} L${x1+(x1>x0?-8:8)},${y+6}`,fill:'none',stroke:'#d8c6e4','stroke-width':3,'stroke-linecap':'round'},arena);
      arw(xs[0]+32,xs[1]-36,Y1);arw(xs[1]+34,xs[2]-36,Y1);arw(xs[2]+34,xs[3]-28,Y1);arw(xs[3]-28,xs[2]+36,Y2);arw(xs[2]-36,xs[1]+36,Y2);arw(xs[1]-36,xs[0]+28,Y2);txt(arena,xs[3]+34,Y2+6,'⏪',{fill:'#8ff0c8'});
      bot(arena,xs[1],Y1,`×${m}`,'#ff9ed2');bot(arena,xs[2],Y1,`+${a}`,'#ff9ed2');ballB(xs[3],Y1,String(out));ballB(xs[3],Y2,String(out));ballB(xs[0],Y2,'?');
      const slots=el('g',{},arena);const drawSlots=()=>{slots.innerHTML='';[1,2].forEach((xi,i)=>{const s=el('g',{transform:`translate(${xs[xi]},${Y2})`},slots);el('rect',{x:-34,y:-24,width:68,height:50,rx:14,fill:'rgba(255,244,230,.08)',stroke:'#8ff0c8','stroke-width':2,'stroke-dasharray':'6 5'},s);
        if(slot[i])bot(s,0,0,slot[i],'#8ff0c8');interact(s,{label:`Undo slot under ${i?'+'+a:'×'+m}`,tap:()=>{if(stage)return;slot[i]=null;drawSlots()}})})};drawSlots();
      txt(arena,110,Y2+58,'undo potions:',{'font-size':13,fill:'#8ff0c8'});
      sshuffle([`÷${m}`,`−${a}`,`×${m}`,`+${a}`],out).forEach((t,i)=>{const b=bot(arena,100+i*82,Y2+94,t,'#8ff0c8');interact(b,{label:`Undo tile ${t}`,tap:()=>{if(stage)return;const k=!slot[1]?1:!slot[0]?0:-1;if(k<0)return;slot[k]=t;SFX.plink(4);drawSlots()}})});
      return{say:'Put an undo potion under each potion, then Check.',go:'Check',check(done){
        if(stage===0){if(!slot[0]||!slot[1]){say('Fill both undo slots first.');return}if(slot[0]!==`÷${m}`||slot[1]!==`−${a}`){done({ok:false,msg:`Undo the last potion first: +${a} is undone by −${a}, and ×${m} by ÷${m}.`});return}
          stage=1;txt(pane,540,272,'its number',{'font-size':14});wh=digitWheels(pane,{x:540,y:340,label:'Number dial'});SFX.chime();say('Good undo potions! Set the number on the dial, then Check.');done({stage:true});return}
        const v=wh.get();done(v===ans?{ok:true,msg:`Backwards: ${out} − ${a} = ${out-a}, ${out-a} ÷ ${m} = ${ans}.`,ans}:{ok:false,msg:`Not ${v}. Start from ${out}: −${a}, then ÷${m}.`})}}},
    picture([A,B,C]){const v={a:A,b:B,c:C},c=card([['I bought',{n:A,id:'a'},'packs of',{n:B,id:'b'},'stickers.'],['I gave',{n:C,id:'c'},'away.']],'How many has Amy got left?',['Amy','Amy']),top=92+c.h+12,fh=Math.min(124,(468-top)/2-5);let stage=0,pick=null,pad=null;const ans=A*B-C;
      const H=30,G2=38,WW=300,draw=(g,trap)=>{const T=A*B,u=WW/(T+(trap?C:0)),bw=T*u/A;for(let i=0;i<A;i++){storyBar(g,{x:i*bw,y:0,w:bw,h:H,col:'#ffc04d',name:i?null:'packs'});lab(g,i*bw+bw/2,H/2,B)}
        if(!trap){storyBar(g,{x:0,y:G2,w:C*u,h:H,dash:true,name:'left'});lab(g,C*u/2,G2+H/2,C);storyBar(g,{x:C*u,y:G2,w:(T-C)*u,h:H,col:'#8fd6ff'});lab(g,C*u+(T-C)*u/2,G2+H/2,'?',1)}
        else{storyBar(g,{x:0,y:G2,w:T*u,h:H,col:'#8fd6ff',name:'left'});storyBar(g,{x:T*u,y:G2,w:C*u,h:H,col:'#ff9ed2'});lab(g,T*u+C*u/2,G2+H/2,C);bracket(g,0,WW,G2+H+4);txt(g,WW/2,G2+H+30,'?',{fill:'#c9b0ff','font-size':18})}};
      const order=sshuffle([false,true],(S.vr[S.r]||0)+3),frames=[];
      order.forEach((trap,i)=>{const y=top+i*(fh+10),f=el('g',{},arena),bg=el('rect',{x:30,y,width:430,height:fh,rx:14,fill:'rgba(255,244,230,.06)',stroke:'rgba(255,244,230,.35)','stroke-width':2.5},f);txt(f,48,y+24,'AB'[i],{'font-size':17,'text-anchor':'start'});
        const pg=el('g',{},f),inner=el('g',{},pg);draw(inner,trap);const bb=inner.getBBox(),s=Math.min(1,350/bb.width,(fh-16)/bb.height);pg.setAttribute('transform',`translate(${(262-(bb.x+bb.width/2)*s).toFixed(1)},${(y+fh/2-(bb.y+bb.height/2)*s).toFixed(1)}) scale(${s.toFixed(3)})`);
        const o={f,bg,trap};frames.push(o);interact(f,{label:`Picture ${'AB'[i]}`,tap:()=>{if(stage)return;pick=o;SFX.pop(1.1);frames.forEach(x=>{x.bg.setAttribute('stroke',x===o?'#ffc04d':'rgba(255,244,230,.35)');x.bg.setAttribute('stroke-width',x===o?4:2.5)})}})});
      W.inkblot.good='AB'[order.indexOf(false)];W.inkblot.bad='AB'[order.indexOf(true)];
      return{say:'The last page! Which picture fits the story? Tap it, then Check.',go:'Check',check(done){
        if(stage===0){if(!pick){say('Tap a picture first.');return}if(pick.trap){done({ok:false,msg:`Not that picture: she gives ${C} away, so her ${A*B} stickers get fewer, not more.`});return}
          stage=1;frames.forEach(x=>{if(x.trap){const f=x.f;tween(300,t=>f.style.opacity=(1-t).toFixed(2));later(320,()=>f.remove())}});pad=numPad(pane,{y:262,label:'Stickers left'});SFX.chime();say('That picture fits! Set the ending, then Check.');done({stage:true});return}
        const x=pad.get();if(x==null){say('Set the ending first.');return}done(x===ans?{ok:true,msg:`${A} × ${B} = ${A*B}, then ${A*B} − ${C} = ${ans}.`,ans}:{ok:false,msg:`Not ${x}. First ${A} lots of ${B}, then take away ${C}.`})}}}};
  function hit(msg,ans){S.busy=true;ink.wipe();ink.mood('oh');SFX.chime();SFX.splash&&SFX.splash();shake(4);floatText(MX,MY-60,['Splat!','Eek!','Oi!','Blot!','Drip!','Nooo!','Gah!'][S.r],{col:'#8fd6ff',size:22});later(800,()=>ink.mood(''));
    decQ(qL,[['t','Page mended!']],true,null);say(`${msg} Some ink wiped away!`);later(3000,()=>{if(S.r===Q.length-1)finale();else{S.r++;load()}})}
  function miss(msg){S.busy=true;SFX.laugh&&SFX.laugh();S.lives--;drawLives();shake(4);ring(30+S.lives*30,34,{col:'#9a9aae',r1:40});say(`${msg} The Inkblot giggles!`);S.vr[S.r]=(S.vr[S.r]||0)+1;
    later(4000,()=>{if(S.lives<=0)lost();else load()})}
  function lost(){S.lives=3;if(S.r>0){S.r--;ink.unwipe()}say('Your pencils all snapped, and the ink crept back over a page. Try again!');later(2600,load)}
  function finale(){S.done=true;S.busy=true;SFX.fanfare();SFX.wake&&SFX.wake();arena.innerHTML='';clearPane();ink.clean();
    const b=bookFig(arena,{clean:true});b.g.setAttribute('transform','translate(250,320) scale(1.6)');popIn(b.g,.3);
    for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*360,120+Math.random()*320,{n:10,cols:['#8fd6ff','#ffc04d','#ff9ed2','#8ff0c8']}));
    decQ(qL,[['t','Every page is mended!']],true,null);say('The ink is wiped away and every story has its ending. You did it!');unlock('inkblot');clearIsland('inkblot');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.lives=3;S.done=false;S.vr={};go('inkblot')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';clearPane();S.busy=false;navDots(Q.length,S.r,true);drawLives();ink.mood('');
    loop(dt=>{loopT+=dt;ink.tick(loopT)});
    const q=Q[S.r];cur=M[q.t](V());decQ(qL,[['t','page'],['o','='],['o','?']],false,null);
    goB=decGo(arena,540,486,cur.go,()=>{if(S.busy)return;S.busy=true;let fired=false;const res=r=>{if(fired)return;fired=true;if(r.stage){S.busy=false;return}if(r.ok)hit(r.msg,r.ans);else miss(r.msg)};
      const started=cur.check(res);if(!fired&&!started)S.busy=false},cur.go.startsWith('Go')?'Go':'Check');
    say(S.r===0&&S.lives===3&&!S.vr[0]?`Mend seven pages! A wrong answer snaps a pencil. ${cur.say}`:cur.say)}
  W.inkblot.dbgQ=()=>({t:Q[S.r].t,v:V(),r:S.r,good:W.inkblot.good,bad:W.inkblot.bad});
  load();
}};
