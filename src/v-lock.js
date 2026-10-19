
/* ---------- 7. Lock: one amount, three ways (fraction = decimal = percent) ---------- */
const WHEELS={
  f:{name:'fraction',vals:[[1,2],[1,4],[3,4],[1,5],[1,10],[3,10],[7,10],[7,100]],h:v=>v[0]*100/v[1],txt:v=>`${v[0]}/${v[1]}`},
  d:{name:'decimal',vals:['0.07','0.1','0.2','0.25','0.3','0.5','0.7','0.75'],h:v=>toH(v),txt:v=>v},
  p:{name:'percent',vals:['7%','10%','20%','25%','30%','50%','70%','75%'],h:v=>toH(v)/100,txt:v=>v}};
function wheelVal(parent,kind,v,x,y,sz,col){const g=el('g',{},parent);
  if(kind==='f'){el('text',{x,y:y-sz*.18,'text-anchor':'middle','font-size':sz,'font-weight':700,fill:col},g).textContent=v[0];el('line',{x1:x-sz*.6,x2:x+sz*.6,y1:y,y2:y,stroke:col,'stroke-width':Math.max(2,sz*.08),'stroke-linecap':'round'},g);el('text',{x,y:y+sz*.85,'text-anchor':'middle','font-size':sz,'font-weight':700,fill:col},g).textContent=v[1]}
  else if(kind==='d')decTxt(g,x,y+sz*.35,v,{sz,col,weight:700});else el('text',{x,y:y+sz*.35,'text-anchor':'middle','font-size':sz,'font-weight':700,fill:col},g).textContent=v;return g}
/* one rolling wheel of the lock: drag it up or down, or tap the arrows */
function lockWheel(parent,{kind,x,y,start,fixed=false,onChange}){const W=WHEELS[kind],n=W.vals.length,g=el('g',{},parent),body=el('g',{},g),face=el('g',{},g);let i=start,locked=fixed;
  el('rect',{x:x-50,y:y-74,width:100,height:148,rx:16,fill:'#2a2245',stroke:fixed?'#ffc04d':'#c9a24a','stroke-width':fixed?4:3},body);
  el('rect',{x:x-44,y:y-38,width:88,height:76,rx:10,fill:fixed?'#fff0a0':'#fff4e6',stroke:'#c9a77a','stroke-width':2},body);
  for(let k=0;k<4;k++)el('line',{x1:x-44,x2:x+44,y1:y-66+k*4,y2:y-66+k*4,stroke:'#fff4e6',opacity:.08},body);
  function show(){face.innerHTML='';const v=W.vals[i],up=W.vals[(i+n-1)%n],dn=W.vals[(i+1)%n];
    wheelVal(face,kind,v,x,kind==='f'?y-8:y,kind==='f'?24:28,'#3a2418');if(!fixed){wheelVal(face,kind,up,x,y-56,kind==='f'?9:12,'#d8c6e4').setAttribute('opacity',.45);wheelVal(face,kind,dn,x,y+52,kind==='f'?9:12,'#d8c6e4').setAttribute('opacity',.45)}}
  const set=j=>{i=(j+n)%n;SFX.tick(i);SFX.clink&&SFX.clink(i%5);show();onChange&&onChange()};
  if(!fixed){
    [[-1,y-96,'M-8,4 L0,-5 L8,4'],[1,y+96,'M-8,-4 L0,5 L8,-4']].forEach(([d,ay,path])=>{const a=el('g',{transform:`translate(${x},${ay})`},g);el('circle',{r:16,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},a);el('path',{d:path,stroke:'#7a4a2e','stroke-width':3,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${W.name} wheel: ${d<0?'up':'down'}`,tap:()=>{if(!locked)set(i+d)}})});
    interact(body,{label:`${W.name} wheel`,down:()=>({i0:i}),move:(p,p0,c)=>{if(!locked){const j=c.i0+Math.round((p0.y-p.y)/34);if((j+n)%n!==i)set(j)}},tap:p=>{if(locked)return;if(!p)set(i+1);else set(i+(p.y<y?-1:1))}});
    body.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowUp'){e.preventDefault();set(i-1)}if(e.key==='ArrowDown'){e.preventDefault();set(i+1)}})}
  show();return{g,kind,get:()=>W.vals[i],h:()=>W.h(W.vals[i]),lock:b=>{if(!fixed)locked=b},setI:j=>{i=j;show()}}}

W.lock={scene:'door',
notes:`<p>Fractions, decimals and percentages as three ways to write one amount. The lighthouse door has a lock with three rolling wheels: fraction, decimal and percent. The Magpie has set one of them (the gold one, its clue) and she rolls the other two until all three say the same amount, then turns the key.</p>
<p>In the first three rounds a little hundred-square picture under each wheel shows how much it says, so matching is something she can see (a half is 50 of the 100 squares). In the last three the pictures are covered and she does it from what she knows; a wrong try uncovers them to show which wheel doesn't match. Each wheel carries the traps: 0.7 and 0.07, 70% and 7%.</p>
<p>Rounds: 1/2, 1/4, 0.3 (pictures on), then 75%, 1/5, 0.07 (pictures off). The last one opens the door to the Magpie.</p>`,
mount(root){
  const R=[{k:'f',v:0,pics:1},{k:'f',v:1,pics:1},{k:'d',v:4,pics:1},{k:'p',v:7},{k:'f',v:3},{k:'d',v:0}];
  const S={r:0,busy:false,won:false};
  const qL=el('g',{},root),door=el('g',{},root),plate=el('g',{},root),ui=el('g',{},root);let wh=[],pics=[];
  /* the lighthouse door */
  el('path',{d:'M70,560 V200 Q70,90 300,86 Q530,90 530,200 V560Z',fill:'#f4ecf8'},door);el('path',{d:'M70,300 H530 V340 H70Z M70,470 H530 V510 H70Z',fill:'#e0506a',opacity:.9},door);
  const inside=el('g',{},door);el('path',{d:'M106,560 V214 Q106,124 300,120 Q494,124 494,214 V560Z',fill:'#1e1636'},inside);el('ellipse',{cx:300,cy:170,rx:150,ry:60,fill:'#ffd27a',opacity:.25},inside);
  for(let k=0;k<9;k++){const y=530-k*42,x=k%2?250:350;el('path',{d:`M${x-70},${y} h140 l-16,-18 h-108Z`,fill:'#4a3a62',stroke:'#6a5a8a','stroke-width':2},inside)}
  el('path',{d:'M296,560 V150',stroke:'#3a2a52','stroke-width':16},inside);
  const dg=el('g',{},door);el('path',{d:'M106,560 V214 Q106,124 300,120 Q494,124 494,214 V560Z',fill:'#5a3a2a',stroke:'#3a2418','stroke-width':4},dg);
  for(let x=150;x<494;x+=44)el('line',{x1:x,x2:x,y1:140,y2:560,stroke:'#4a2e20','stroke-width':3},dg);
  [[106,230],[106,420]].forEach(([x,y])=>el('rect',{x:x-6,y,width:40,height:14,rx:4,fill:'#3a3058'},dg));
  el('rect',{x:112,y:132,width:376,height:366,rx:22,fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':4},plate);el('rect',{x:124,y:144,width:352,height:342,rx:16,fill:'#8a6a2a',opacity:.45},plate);

  const wL=el('g',{},root),picL=el('g',{},root);
  const dotG=dotChar(ui,170,44,12);
  const st=navStone({label:'Next lock',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this lock again',onTap:()=>load()});
  const goB=decGo(ui,540,500,'Turn the key',turn,'Key');
  const X={f:180,d:300,p:420},WY=250;
  function drawPics(all){picL.innerHTML='';const q=R[S.r];wh.forEach(w=>{const x=X[w.kind]-42,y=384;
    if(q.pics||all){hundredPic(picL,x,y,8.4,Math.round(w.h()),{col:w.kind===q.k?'#ffc04d':'#ff9ec0'})}
    else{el('rect',{x:x-3,y:y-3,width:90,height:90,rx:6,fill:'#2a2245',stroke:'rgba(255,244,230,.25)','stroke-width':1.5},picL);el('text',{x:x+42,y:y+54,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#5a4a80'},picL).textContent='?'}});
    if(q.pics||all)el('text',{x:300,y:488,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff4e6'},picL).textContent='each picture is 100 little squares'}
  function given(q){return WHEELS[q.k].vals[q.v]}
  function turn(){if(S.busy||S.won)return;S.busy=true;wh.forEach(w=>w.lock(true));goB.style.display='none';const q=R[S.r],gh=WHEELS[q.k].h(given(q));
    const bad=wh.filter(w=>Math.abs(w.h()-gh)>1e-9);SFX.clonk();
    if(!bad.length){win(q);return}
    shake(5);SFX.wrong();tween(500,(t,p)=>{const dx=(Math.sin(p*Math.PI*6)*5).toFixed(1);plate.setAttribute('transform',`translate(${dx},0)`);wL.setAttribute('transform',`translate(${dx},0)`)},()=>{plate.removeAttribute('transform');wL.removeAttribute('transform')},ease.lin);
    drawPics(true);const b=bad[0];
    say(`The ${WHEELS[b.kind].name} wheel says ${WHEELS[b.kind].txt(b.get())}: that's not the same as ${WHEELS[q.k].txt(given(q))}. Look at the pictures!`);
    later(2600,()=>{drawPics(false);wh.forEach(w=>w.lock(false));S.busy=false;goB.style.display=''})}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();drawPics(true);
    const f=wh.find(w=>w.kind==='f').get(),d=wh.find(w=>w.kind==='d').get(),p=wh.find(w=>w.kind==='p').get();
    starterQ(qL,[['f',f[0],f[1]],['o','='],['w',d],['o','='],['w',p]],true,dotG);dotG.mood('happy');
    later(500,()=>{SFX.whoosh();const g=el('rect',{x:106,y:120,width:388,height:440,fill:'#fff0a0',opacity:0},door);tween(900,(t,pp)=>{g.setAttribute('opacity',(pp*.35).toFixed(2))});
      tween(900,t=>{plate.setAttribute('transform',`translate(${(-260*t).toFixed(1)},0)`);picL.setAttribute('transform',`translate(${(-260*t).toFixed(1)},0)`);wL.setAttribute('transform',`translate(${(-260*t).toFixed(1)},0)`);dg.setAttribute('transform',`translate(${(-260*t).toFixed(1)},0)`)},null,ease.inOut)});
    say(S.r===5?`${f[0]}/${f[1]} = ${d} = ${p}. The door is open! Up the stairs: the Magpie is waiting.`:`${f[0]}/${f[1]} = ${d} = ${p}: three ways to write the same amount!`);
    if(S.r>=2)unlock('same');later(1600,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';wL.innerHTML='';picL.innerHTML='';[plate,wL,dg,picL].forEach(g=>g.removeAttribute('transform'));door.querySelectorAll('rect[fill="#fff0a0"]').forEach(r=>r.remove());
    const q=R[S.r],gh=WHEELS[q.k].h(given(q));Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';
    wh=['f','d','p'].map(k=>{const W=WHEELS[k],fixed=k===q.k;let s=fixed?q.v:Math.floor(Math.random()*W.vals.length);let guard=0;while(!fixed&&Math.abs(W.h(W.vals[s])-gh)<1e-9&&guard++<20)s=(s+3)%W.vals.length;
      const w=lockWheel(wL,{kind:k,x:X[k],y:WY,start:s,fixed,onChange:()=>drawPics(false)});
      el('text',{x:X[k],y:WY+122,'text-anchor':'middle','font-size':13,'font-weight':700,fill:fixed?'#fff0a0':'#fff4e6'},wL).textContent=fixed?`${W.name}: the clue`:W.name;return w});
    drawPics(false);
    const gp=['f','d','p'].map(k=>k===q.k?(k==='f'?['f',...given(q)]:['w',given(q)]):['o','?']);decQ(qL,[gp[0],['o','='],gp[1],['o','='],gp[2]],false,dotG);dotG.mood('');
    say(S.r===0?'Locked by the Magpie! Roll the wheels to say the same as the gold clue, then turn the Key.':S.r===3?'No pictures now! Roll the wheels to match the clue, then turn the Key.':`The clue is ${WHEELS[q.k].txt(given(q))}. Make all three wheels say the same amount.`)}
  S.r=resumeAt(R.length);load();
}};
