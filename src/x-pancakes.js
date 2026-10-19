/* ---------- 4. Pancakes: scaling a recipe (every ingredient times the same number) ---------- */
function pancakeStack(parent,x,y,kind='good',s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(kind==='runny'){el('path',{d:'M-24,2 C-30,-6 -10,-8 0,-6 C14,-9 30,-4 24,3 C30,8 12,10 0,8 C-14,11 -30,9 -24,2Z',fill:'#f4e2b0',opacity:.95},g);el('path',{d:'M-18,6 v8 M10,7 v6',stroke:'#f4e2b0','stroke-width':3,'stroke-linecap':'round'},g);return g}
  if(kind==='eggy'){[0,1].forEach(k=>el('ellipse',{cx:(k-.5)*10,cy:-4-k*6,rx:11,ry:7,fill:k?'#a86a2a':'#9a5a22',stroke:'#6a3a12','stroke-width':1.2},g));return g}
  [0,1,2].forEach(k=>el('ellipse',{cx:0,cy:-k*5,rx:18,ry:5.5,fill:['#d8963a','#e0a64a','#eab35a'][k],stroke:'#a86a2a','stroke-width':1},g));el('rect',{x:-4,y:-15,width:8,height:5,rx:1.5,fill:'#fff4b0'},g);return g}
function pcPlate(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);el('ellipse',{cx:0,cy:2,rx:22,ry:8,fill:'#e8e4f0',stroke:'#a8a4b8','stroke-width':1.5},g);el('ellipse',{cx:0,cy:1,rx:14,ry:4.5,fill:'#f4f2f8'},g);return g}
/* a measuring jug: drag the milk level; marks every 100 ml */
function milkJug(parent,{x,y,h=220,max=1000,step=50,val=0,label='Milk jug: drag the milk up or down',onChange}){const g=el('g',{},parent),w=74,lv=el('g',{},g),top=el('g',{},g);let v=val,locked=false;
  const Y=m=>y+h-m/max*h;
  el('path',{d:`M${x},${y-10} L${x+w},${y-10} L${x+w},${y+h} Q${x+w},${y+h+10} ${x+w-10},${y+h+10} L${x+10},${y+h+10} Q${x},${y+h+10} ${x},${y+h}Z`,fill:'rgba(255,244,230,.12)'},g);g.insertBefore(g.lastChild,lv);
  el('path',{d:`M${x},${y-10} L${x+w},${y-10} L${x+w},${y+h} Q${x+w},${y+h+10} ${x+w-10},${y+h+10} L${x+10},${y+h+10} Q${x},${y+h+10} ${x},${y+h}Z M${x+w},${y+20} q30,10 0,70`,fill:'none',stroke:'rgba(255,244,230,.7)','stroke-width':3},top);
  for(let m=100;m<=max;m+=100){el('line',{x1:x,x2:x+(m%500?14:24),y1:Y(m),y2:Y(m),stroke:'#3a6aa8','stroke-width':2},top);el('text',{x:x-6,y:Y(m)+4,'text-anchor':'end','font-size':11,'font-weight':700,fill:'#d8e8ff'},top).textContent=m}
  el('text',{x:x-6,y:y-20,'text-anchor':'end','font-size':11,'font-weight':700,fill:'#d8e8ff'},top).textContent='ml';
  const hand=el('g',{},top);el('path',{d:'M0,0 l12,-8 v16Z',fill:'#ffc04d',stroke:'#fff6d0','stroke-width':1.5},hand);
  function draw(){lv.innerHTML='';if(v>0)el('rect',{x:x+3,y:Y(v),width:w-6,height:h-(Y(v)-y)+6,rx:4,fill:'#f4f8ff'},lv);hand.setAttribute('transform',`translate(${x+w+4},${Y(v)})`)}
  const set=m=>{m=clamp(Math.round(m/step)*step,0,max);if(m===v)return;v=m;SFX.tick(Math.round(m/100));draw();onChange&&onChange(v)};
  const hit=el('rect',{x:x-10,y:y-20,width:w+40,height:h+40,fill:'transparent'},g);
  interact(hit,{label,down:p=>{if(!locked)set((y+h-p.y)/h*max);return{}},move:p=>{if(!locked)set((y+h-p.y)/h*max)},tap:p=>{if(!locked&&p)set((y+h-p.y)/h*max)}});
  hit.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowUp'){e.preventDefault();set(v+step)}if(e.key==='ArrowDown'){e.preventDefault();set(v-step)}});
  draw();return{g,get:()=>v,set:m=>{v=m;draw()},lock:b=>{locked=b}}}

W.pancakes={scene:'oven',
notes:`<p>Scaling a recipe. The recipe card says what 4 people need (2 eggs and 300 ml of milk). She cracks eggs into the bowl (tap the box; tap an egg in the bowl to take it out) and drags the milk in the jug, which is marked every 100 ml, then presses Cook. The cooking shows two different mistakes separately: the wrong mix (too runny or too eggy, because eggs and milk weren't scaled by the same number) and the right mix in the wrong amount (lovely pancakes, but only enough for 6 when 8 are waiting).</p>
<p>Rounds: 8 people (double), 2 people (halve), 12 people (times 3), 6 people (work out 2 people first, then times 3), and turned round: we have 5 eggs and must use them all, so how many people can we feed? She lays the plates with the knob and pours the milk. A wrong try gives a new recipe.</p>`,
mount(root){
  const R=[{p:[[4,2,300,8],[4,3,200,8],[2,1,100,4]]},{p:[[4,2,300,2],[4,2,200,2],[6,3,300,2]]},{p:[[4,2,300,12],[2,1,150,6],[4,3,200,12]]},{p:[[4,2,300,6],[4,2,200,6],[6,4,300,9]]},{flip:1,p:[[4,2,300,5],[2,1,150,4],[4,2,200,3]]}];
  const S={r:0,busy:false,won:false,pi:{},eggs:0,ppl:1};
  const board=el('g',{},root),bowlL=el('g',{},root),plateL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let jug=null,kn=null,ctl=null;
  const st=navStone({label:'Next recipe',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this recipe again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Cook the pancakes',cook,'Cook');
  const Q=()=>{const q=R[S.r],[per,e0,m0,t]=q.p[(S.pi[S.r]||0)%q.p.length];return q.flip?{flip:1,per,e0,m0,have:t,T:t*per/e0}:{per,e0,m0,T:t}};
  const parts=(q,done)=>done?[['w',`${q.T} people`],['o','='],['w',`${q.T*q.e0/q.per} egg${q.T*q.e0/q.per===1?'':'s'}`],['o','+'],['w',`${q.T*q.m0/q.per} ml`]]
    :q.flip?[['w',`${q.have} eggs`],['o','→'],['o','?'],['t','people']]:[['t','Pancakes for'],['w',q.T],['t','people']];
  const nP=()=>Q().flip?S.ppl:Q().T,PX=(i,n)=>{const row=n>6?2:1,per=Math.ceil(n/row),r=Math.floor(i/per),c=i%per;return[250-(per-1)*24+c*48,458+r*44]};
  function drawPlates(){plateL.innerHTML='';const n=nP();el('rect',{x:30,y:426,width:440,height:104,rx:12,fill:'#7a4e2c',stroke:'#a8743a','stroke-width':4},plateL);[452,478,504].forEach(y=>el('line',{x1:40,x2:460,y1:y,y2:y,stroke:'#6a4224','stroke-width':2},plateL));for(let i=0;i<n;i++){const [x,y]=PX(i,n);pcPlate(plateL,x,y,.95)}}
  function drawBowl(){bowlL.innerHTML='';const q=Q(),bx=250,by=300;el('ellipse',{cx:bx,cy:by-26,rx:84,ry:20,fill:'#5a4a7a'},bowlL);
    for(let i=0;i<S.eggs;i++){const x=bx-56+(i%5)*28+(Math.floor(i/5)%2)*14,y=by-30-Math.floor(i/5)*15,e=el('g',{transform:`translate(${x},${y})`},bowlL);el('ellipse',{rx:13,ry:8,fill:'#fff8ec'},e);el('circle',{r:5.5,fill:'#ffc04d'},e);
      if(!(q.flip))interact(e,{label:`Egg ${i+1} in the bowl: tap to take it out`,tap:()=>{if(S.busy||S.won)return;S.eggs--;SFX.pop(.8);drawBowl()}})}
    el('path',{d:`M${bx-90},${by-26} Q${bx-86},${by+46} ${bx},${by+50} Q${bx+86},${by+46} ${bx+90},${by-26}`,fill:'#e8dcc8',stroke:'#a8907a','stroke-width':3},bowlL);el('path',{d:`M${bx-60},${by+6} Q${bx},${by+22} ${bx+60},${by+6}`,stroke:'#c9b8a0','stroke-width':3,fill:'none'},bowlL)}
  function crack(){if(S.busy||S.won||Q().flip)return;if(S.eggs>=10){say('That’s a lot of eggs! Tap one in the bowl to take it out.');return}S.eggs++;SFX.crunch?SFX.crunch():SFX.pop(1);drawBowl()}
  function cook(){if(S.busy||S.won)return;const q=Q(),e=S.eggs,m=jug.get(),T=nP();
    if(!e||!m){say(!e?'Crack some eggs into the bowl first.':'Pour some milk: drag the milk up the jug.');return}
    S.busy=true;jug.lock(true);if(kn)kn.lock(true);goB.style.display='none';SFX.sizzle?SFX.sizzle():SFX.whoosh();
    const ratioOK=e*q.m0===m*q.e0,P=e*q.per/q.e0,kind=ratioOK?'good':m*q.e0>e*q.m0?'runny':'eggy';
    const serve=ratioOK?Math.min(T,Math.floor(P)):T;
    for(let i=0;i<T;i++){const [x,y]=PX(i,T);if(i<serve)later(i*110,()=>{popIn(pancakeStack(plateL,x,y-4,kind,.9),.3);SFX.plop?SFX.plop():SFX.pop(1)})}
    if(ratioOK&&P>T)for(let i=0;i<Math.round(P-T);i++)later((T+i)*110,()=>popIn(pancakeStack(plateL,520,430-i*14,kind,.8),.3));
    later(T*110+700,()=>{
      if(ratioOK&&Math.abs(P-T)<1e-9){win(q,how(q,e,m));return}
      SFX.wrong();
      let msg=!ratioOK?(kind==='runny'?`Too runny! The recipe has ${q.m0} ml of milk for every ${q.e0} egg${q.e0>1?'s':''}: the milk and eggs must be scaled by the same number.`:`Too eggy! The recipe has ${q.e0} egg${q.e0>1?'s':''} for every ${q.m0} ml of milk: scale both by the same number.`)
        :q.flip?`${e} eggs makes enough for ${P} people, but you laid ${T} plates.`:P<T?`Lovely pancakes, but only enough for ${P} people. ${T} are waiting!`:`Lovely pancakes, but enough for ${P} people, and only ${T} are here.`;
      say(msg+' A new recipe…');S.pi[S.r]=(S.pi[S.r]||0)+1;later(4400,load)})}
  const pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
  function how(q,E,M){const T=q.T,per=q.per;if(q.flip)return `1 egg feeds ${per/q.e0} people with ${q.m0/q.e0} ml of milk. ${q.have} eggs: ${q.have} × ${per/q.e0} = ${T} people and ${M} ml. Perfect pancakes!`;if(T%per===0){const f=T/per;return `${T} people is ${per} × ${f}, so ${q.e0} × ${f} = ${pl(E,'egg')} and ${q.m0} × ${f} = ${M} ml. Perfect pancakes!`}
    const g=gcd(per,T),d=per/g,u=T/g;return `${per} people ÷ ${d} = ${g} people: ${pl(q.e0/d,'egg')} and ${q.m0/d} ml.${u>1?` Then × ${u} for ${T}: ${pl(E,'egg')} and ${M} ml.`:''} Perfect pancakes!`}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();kaiWin(guide);decQ(qL,parts(q,true),true,guide);say(msg);burst(300,440,{n:16,cols:['#eab35a','#fff4b0','#5ac85a']});
    if(S.r>=3)unlock('scale');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';plateL.innerHTML='';if(ctl)ctl.remove();const q=Q();Object.assign(S,{busy:false,won:false,eggs:q.flip?q.have:0,ppl:1});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);
    const c=el('g',{transform:'translate(40,92)'},board);el('rect',{width:150,height:116,rx:10,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},c);
    el('text',{x:75,y:24,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#3a2418'},c).textContent=`Pancakes for ${q.per}`;el('line',{x1:16,x2:134,y1:34,y2:34,stroke:'#c9a77a','stroke-width':1.5},c);
    const eg=el('g',{transform:'translate(30,58)'},c);el('ellipse',{rx:8,ry:10,fill:'#fff8ec',stroke:'#c9a77a'},eg);el('text',{x:50,y:62,'font-size':16,'font-weight':700,fill:'#3a2418'},c).textContent=`${q.e0} egg${q.e0>1?'s':''}`;
    const mk=el('g',{transform:'translate(30,92)'},c);el('rect',{x:-7,y:-11,width:14,height:20,rx:3,fill:'#f4f8ff',stroke:'#7a9ac8'},mk);el('text',{x:50,y:97,'font-size':16,'font-weight':700,fill:'#3a2418'},c).textContent=`${q.m0} ml milk`;
    ctl=el('g',{},ui);const box=el('g',{transform:'translate(540,150)'},ctl);el('rect',{x:-44,y:-22,width:88,height:44,rx:8,fill:'#c9a77a',stroke:'#8a6a4a','stroke-width':2},box);
    [-27,-9,9,27].forEach(x=>el('ellipse',{cx:x,cy:-4,rx:8,ry:10,fill:'#fff8ec',stroke:'#d8c8b0'},box));el('text',{y:17,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},box).textContent='eggs';
    if(!q.flip)interact(box,{label:'Crack an egg into the bowl',tap:crack});else box.setAttribute('opacity',.4);
    jug=milkJug(ctl,{x:392,y:160,h:220});
    if(q.flip){kn=stepper(ctl,{x:112,y:392,w:184,min:1,max:12,val:1,label:'How many people',fmt:n=>`${n} ${n>1?'people':'person'}`,onChange:n=>{S.ppl=n;drawPlates()}})}else kn=null;
    drawBowl();drawPlates();decQ(qL,parts(q,false),false,guide);
    say(S.r===0?`The recipe feeds ${q.per}, but ${q.T} are coming! Add eggs and milk, then Cook.`
      :q.flip?`Turned round! Use all ${q.have} eggs. How many people? Set the plates and milk, then Cook.`
      :S.r===3?`${q.T} people. Tip: what would ${gcd(q.per,q.T)} people need first?`
      :`Pancakes for ${q.T} people. Add eggs and milk, then Cook.`)}
  W.pancakes.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
