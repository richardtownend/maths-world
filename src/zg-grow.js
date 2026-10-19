/* ---------- 4. Sunflower: line graphs ---------- */
W.grow={scene:'survey',
notes:`<p>A line graph is a record of something changing. Pip's sunflower grows every week. First the flower stands right next to the graph on the same scale, so she drags each week's dot level with the flower's head (no numbers needed), then Next week and it grows; the dots join into a line. Then the flower is measured on a stick and the graph has a different scale, so she reads the stick and finds the height on the graph. Then reading: tap the part of the line where it grew most (the steepest). Then predicting: it grows the same each week, so where will next week's dot be? And a puddle drying up: drag the flag to the hour the line will reach the bottom. Last: two sunflowers; tap the week they were the same height (where the lines cross).</p>`,
mount(root){
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const climb=(n,a,b,start)=>{let v=start,out=[];for(let i=0;i<n;i++){out.push(v);v+=5*rnd(a,b)}return out};
  const R=[
    {mode:'plot',side:'beside',gen:()=>climb(5,2,4,5*rnd(1,3))},
    {mode:'plot',side:'stick',gen:()=>climb(4,2,5,5*rnd(1,3))},
    {mode:'steep',gen:()=>{const inc=[2,3,4,5].map(x=>x*5).sort(()=>Math.random()-.5);let v=10,o=[v];inc.forEach(d=>o.push(v+=d));return o}},
    {mode:'predict',gen:()=>{const s=5*rnd(2,4),d=5*rnd(2,3);return[0,1,2,3,4].map(i=>s+d*i)}},
    {mode:'puddle',gen:()=>{const d=[3,4,5][rnd(0,2)],h=[5,6,4][rnd(0,2)];return{d,h,start:d*h}}},
    {mode:'cross',gen:()=>{const w=rnd(3,4),m=5*rnd(9,11),a=10,b=5;return{w,A:[1,2,3,4,5,6].map(k=>m+a*(k-w)),B:[1,2,3,4,5,6].map(k=>m+b*(k-w))}}}];
  const S={r:0,busy:false,won:false,miss:0,vals:[],dots:[],wk:0,pick:null,flag:0};
  const scene=el('g',{},root),left=el('g',{},root),chart=el('g',{},root),hitL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let fr=null,go=null;
  const st=navStone({label:'Next graph',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this graph again',onTap:()=>load()});
  const Q=()=>R[S.r],FX0=270,FW=340,FY=140,FH=280,BASE=FY+FH;
  const nW=()=>Q().mode==='puddle'?9:Q().mode==='cross'?6:Q().mode==='predict'?5:S.vals.length,WX=k=>Q().mode==='puddle'?FX0+k*FW/8:FX0+(k+.5)*FW/nW();
  const parts=done=>[['t',{plot:'line graph',steep:'grew most',predict:'next week',puddle:'dry at',cross:'same height'}[Q().mode]],['o','='],done?['w','✓']:['o','?']];
  /* hit areas live in their own layer and are reused, so a drag keeps hold while the chart redraws */
  const H={};function hitRect(label,attrs,h){H[label]=h;let r=hitL.querySelector(`[aria-label="${label}"]`);if(!r){r=el('rect',{fill:'transparent'},hitL);interact(r,{label,down:()=>({}),move:p=>H[label].move(p),tap:p=>H[label].tap(p)});r.addEventListener('keydown',e=>H[label].key(e))}
    Object.entries(attrs).forEach(([k,v])=>r.setAttribute(k,v));return r}
  function setGo(label,fn,txt){if(go)go.remove();go=decGo(ui,560,500,label,fn,txt)}
  function frame(){const q=Q();chart.innerHTML='';
    fr=q.mode==='puddle'?chartFrame(chart,{x:FX0,y:FY,w:FW,h:FH,lo:0,hi:30,step:2,lab:10,unit:'cm deep'}):chartFrame(chart,{x:FX0,y:FY,w:FW,h:FH,lo:0,hi:100,step:q.side==='beside'?5:10,lab:q.side==='beside'?0:20,unit:q.side==='beside'?'':'cm'});
    const n=nW();for(let k=0;k<n;k++){el('text',{x:WX(k),y:BASE+18,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},chart).textContent=q.mode==='puddle'?`${k}`:`wk ${k+1}`}
    if(q.mode==='puddle')el('text',{x:FX0+FW,y:BASE+34,'text-anchor':'end','font-size':11,'font-weight':700,fill:'#7a5a3a'},chart).textContent='hours'}
  const line=(pts,col='#3a8a3a')=>{if(pts.length>1)el('polyline',{points:pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' '),fill:'none',stroke:col,'stroke-width':3.5,'stroke-linejoin':'round'},chart);pts.forEach(([x,y])=>el('circle',{cx:x,cy:y,r:6,fill:col,stroke:'#fff','stroke-width':2},chart))};
  function drawLeft(){left.innerHTML='';const q=Q();
    if(q.mode==='plot'){const h=S.showH!=null?S.showH:S.vals[Math.min(S.wk,S.vals.length-1)];
      if(q.side==='beside')sunflowerFig(left,212,BASE,h/100*FH);
      else{const sx=80,sh=260;el('rect',{x:sx-8,y:BASE-sh,width:16,height:sh,fill:'#ffe8a0',stroke:'#a8743a','stroke-width':1.5},left);for(let v=0;v<=100;v+=5){const y=BASE-v/100*sh;el('line',{x1:sx-8,x2:sx-(v%10?2:-2),y1:y,y2:y,stroke:'#7a5a3a','stroke-width':1},left);if(v%10===0)el('text',{x:sx-12,y:y+4,'text-anchor':'end','font-size':12,'font-weight':700,fill:'#3a2418'},left).textContent=v}
        el('text',{x:sx,y:BASE-sh-8,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#7a5a3a'},left).textContent='cm';sunflowerFig(left,sx+40,BASE,h/100*sh,{s:.8});el('line',{x1:sx-8,x2:sx+40,y1:BASE-h/100*sh,y2:BASE-h/100*sh,stroke:'#e8413e','stroke-width':1.5,'stroke-dasharray':'3 3'},left)}
      el('text',{x:q.side==='beside'?212:120,y:BASE+40,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#3a2418'},left).textContent=`week ${Math.min(S.wk,S.vals.length-1)+1}`}
    if(q.mode==='puddle'){const left0=Math.max(0,S.vals.start-S.vals.d*S.shown),r=60*left0/S.vals.start;el('ellipse',{cx:140,cy:400,rx:Math.max(2,r*1.6),ry:Math.max(1,r*.4),fill:'#6ab0e8',stroke:'#3a7ab8','stroke-width':2},left);
      el('text',{x:140,y:450,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#3a2418'},left).textContent=`after ${S.shown} hour${S.shown===1?'':'s'}`}}
  /* plotting: drag this week's dot up its line */
  function drawPlot(){frame();const q=Q(),pts=S.dots.map((v,k)=>[WX(k),fr.yOf(v)]);line(pts);
    if(S.wk<S.vals.length&&!S.won){const k=S.wk,x=WX(k),v=S.cur;el('line',{x1:x,x2:x,y1:FY,y2:BASE,stroke:'#9a6cff','stroke-width':2,'stroke-dasharray':'4 4'},chart);
      const d=el('g',{transform:`translate(${x},${fr.yOf(v)})`},chart);el('circle',{r:13,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2.5},d);el('path',{d:'M-5,-3 L0,-9 L5,-3Z M-5,3 L0,9 L5,3Z',fill:'#7a4a1e'},d);
      const set=n=>{n=clamp(Math.round(n/5)*5,0,100);if(n===S.cur)return;S.cur=n;SFX.tick((n/5)%8);drawPlot()};
      hitRect('This week’s dot',{x:x-24,y:FY-10,width:48,height:FH+20,fill:'transparent'},{move:p=>{if(S.busy||S.won)return;set(fr.vOf(p.y))},tap:p=>{if(S.busy||S.won||!p)return;set(fr.vOf(p.y))},key:e=>{if(S.busy||S.won)return;const dd=e.key==='ArrowUp'?5:e.key==='ArrowDown'?-5:0;if(!dd)return;e.preventDefault();set(S.cur+dd)}})}}
  function plotNext(){if(S.busy||S.won)return;const q=Q(),want=S.vals[S.wk];
    if(q.side==='beside'&&Math.abs(S.cur-want)<=5)S.cur=want;
    if(S.cur!==want){S.miss++;SFX.wrong();shake(2);if(S.miss>=2){S.busy=true;say(`${q.side==='beside'?'Level with the top of the flower.':'Read the stick, then find that height on the graph.'} A new sunflower…`);later(4200,load)}else say(q.side==='beside'?'Not quite level with the brown middle of the flower. Look straight across.':`Read the stick: then find that height on the graph’s scale.`);return}
    S.dots.push(want);S.wk++;S.miss=0;SFX.chime();if(S.wk>=S.vals.length){drawPlot();return win(q.side==='beside'?'Week by week, the dots make a line: the line climbs because the flower grew every week.':`Week by week, the dots make a line: up ${S.vals[S.vals.length-1]-S.vals[0]} cm in ${S.vals.length-1} weeks.`)}
    S.busy=true;S.cur=S.dots[S.dots.length-1];drawPlot();const h0=S.vals[S.wk-1],h1=S.vals[S.wk];tween(900,t=>{S.showH=h0+(h1-h0)*t;drawLeft()},()=>{S.showH=null;drawLeft();S.busy=false;say('It grew! Drag this week’s dot.')})}
  /* reading: tap the steepest piece, or the week the lines cross */
  function drawRead(){frame();const q=Q();
    if(q.mode==='steep'){const pts=S.vals.map((v,k)=>[WX(k),fr.yOf(v)]);for(let k=0;k<pts.length-1;k++){const [a,b]=[pts[k],pts[k+1]],g=el('g',{},chart);
        el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:S.pick===k?'#9a6cff':'transparent','stroke-width':14,'stroke-linecap':'round',opacity:.5},g);el('rect',{x:a[0]+4,y:FY,width:b[0]-a[0]-8,height:FH,fill:'transparent'},g);
        interact(g,{label:`Weeks ${k+1} to ${k+2}`,tap:()=>{if(S.busy||S.won)return;S.pick=k;SFX.tick(k+2);drawRead()}})}line(pts)}
    if(q.mode==='cross'){const {A,B}=S.vals;for(let k=0;k<6;k++){const g=el('g',{},chart);el('rect',{x:WX(k)-24,y:FY,width:48,height:FH,fill:S.pick===k?'rgba(154,108,255,.18)':'transparent'},g);interact(g,{label:`Week ${k+1}`,tap:()=>{if(S.busy||S.won)return;S.pick=k;SFX.tick(k+2);drawRead()}})}
      line(A.map((v,k)=>[WX(k),fr.yOf(v)]),'#3a8a3a');line(B.map((v,k)=>[WX(k),fr.yOf(v)]),'#e8813a');
      [['Pip’s','#3a8a3a'],['Polly’s','#e8813a']].forEach(([n,c],i)=>{el('rect',{x:FX0+10,y:FY+10+i*20,width:14,height:6,fill:c},chart);el('text',{x:FX0+30,y:FY+17+i*20,'font-size':11,'font-weight':700,fill:'#3a2418'},chart).textContent=`${n} sunflower`})}}
  function drawPredict(){frame();const q=Q(),given=S.vals.slice(0,4),pts=given.map((v,k)=>[WX(k),fr.yOf(v)]);line(pts);
    if(S.reveal!=null){line([pts[3],[WX(4),fr.yOf(S.vals[4])]])}
    const x=WX(4),d=el('g',{transform:`translate(${x},${fr.yOf(S.cur)})`},chart);el('circle',{r:13,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2.5},d);el('path',{d:'M-5,-3 L0,-9 L5,-3Z M-5,3 L0,9 L5,3Z',fill:'#7a4a1e'},d);
    const set=n=>{n=clamp(Math.round(n/5)*5,0,100);if(n===S.cur)return;S.cur=n;SFX.tick((n/5)%8);drawPredict()};
    hitRect('Next week’s dot',{x:x-24,y:FY-10,width:48,height:FH+20,fill:'transparent'},{move:p=>{if(S.busy||S.won)return;set(fr.vOf(p.y))},tap:p=>{if(S.busy||S.won||!p)return;set(fr.vOf(p.y))},key:e=>{if(S.busy||S.won)return;const dd=e.key==='ArrowUp'?5:e.key==='ArrowDown'?-5:0;if(!dd)return;e.preventDefault();set(S.cur+dd)}})}
  function drawPuddle(){frame();const q=Q(),{d,start}=S.vals,pts=[0,1,2,3].map(h=>[WX(h),fr.yOf(start-d*h)]);line(pts,'#3a7ab8');
    if(S.reveal){const end=start/d;line([pts[3],[WX(end),fr.yOf(0)]],'#3a7ab8')}
    const x=WX(S.flag),f=el('g',{transform:`translate(${x},${BASE})`},chart);el('line',{x1:0,x2:0,y1:0,y2:-44,stroke:'#3a2418','stroke-width':2.5},f);el('path',{d:'M0,-44 L20,-37 L0,-30Z',fill:'#e8413e'},f);
    const set=n=>{n=clamp(Math.round(n),0,8);if(n===S.flag)return;S.flag=n;SFX.tick(n);drawPuddle()};
    hitRect('The dry flag',{x:FX0,y:BASE-60,width:FW,height:80,fill:'transparent'},{move:p=>{if(S.busy||S.won)return;set((p.x-FX0)/(FW/8))},tap:p=>{if(S.busy||S.won||!p)return;set((p.x-FX0)/(FW/8))},key:e=>{if(S.busy||S.won)return;const dd=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!dd)return;e.preventDefault();set(S.flag+dd)}})}
  function miss(msg){SFX.wrong();shake(2);S.busy=true;say(`${msg} A new graph…`);later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(q.mode==='steep'){if(S.pick==null){say('Tap a piece of the line.');return}const inc=S.vals.slice(1).map((v,k)=>v-S.vals[k]),best=inc.indexOf(Math.max(...inc));
      if(S.pick!==best){miss('The most growing is where the line is steepest.');return}return win(`Weeks ${best+1} to ${best+2}: the steepest part, up ${inc[best]} cm in one week.`)}
    if(q.mode==='cross'){if(S.pick==null){say('Tap a week.');return}if(S.pick!==S.vals.w-1){miss('They’re the same height where the two lines cross.');return}return win(`Week ${S.vals.w}: the lines cross, so the sunflowers were the same height.`)}
    if(q.mode==='predict'){S.busy=true;S.reveal=1;drawPredict();SFX.whoosh();later(700,()=>{S.busy=false;if(S.cur!==S.vals[4]){miss(`It grows the same each week: ${S.vals[1]-S.vals[0]} cm. Keep the line going straight.`);return}win(`Spot on: it grows ${S.vals[1]-S.vals[0]} cm every week, so the line keeps going straight.`)});return}
    if(q.mode==='puddle'){if(!S.flag){say('Drag the flag along the bottom.');return}const end=S.vals.start/S.vals.d;S.busy=true;S.reveal=1;drawPuddle();
      let h=3;const f=()=>{if(h>=end){S.busy=false;if(S.flag!==end){miss(`Follow the line down: it goes down ${S.vals.d} cm every hour until it reaches the bottom.`);return}win(`Dry after ${end} hours: the line reaches the bottom.`);return}h++;S.shown=h;drawLeft();SFX.pop(.6);later(380,f)};f();return}}
  function win(msg){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(true),true,guide);burst(440,200,{n:14,cols:['#ffd23a','#7fc86a']});say(msg);if(S.r>=2)unlock('ggrow');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});go=null;hitL.innerHTML='';const q=Q();
    Object.assign(S,{busy:false,won:false,miss:0,vals:q.gen(),dots:[],wk:0,pick:null,flag:0,cur:0,reveal:null,shown:3,showH:null});
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);left.innerHTML='';
    if(q.mode==='plot'){drawLeft();drawPlot();setGo('Next week',plotNext,'Go');say(S.r===0?'Pip’s sunflower is next to the graph. Drag this week’s dot level with the brown middle of the flower, then Go for next week.':'Now the flower is measured on a stick. Put each week’s dot at that height on the graph.')}
    else if(q.mode==='predict'){S.cur=S.vals[3];drawPredict();setGo('Go: grow a week',check,'Go');say('It grows the same amount every week. Where will next week’s dot be?')}
    else if(q.mode==='puddle'){drawLeft();drawPuddle();setGo('Go: dry up',check,'Go');say('A puddle is drying up. Drag the flag to the hour it will be dry.')}
    else{drawRead();setGo(q.mode==='steep'?'Check: this piece':'Check: this week',check,'Check');say(q.mode==='steep'?'In which week did the sunflower grow the most? Tap that piece of the line.':'Two sunflowers. In which week were they the same height?')}}
  W.grow.dbgQ=()=>({vals:S.vals,mode:Q().mode,wk:S.wk,cur:S.cur,r:S.r});S.r=resumeAt(R.length);load();
}};
