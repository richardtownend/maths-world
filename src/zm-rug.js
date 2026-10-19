/* ---------- 5. The rug shop: what long multiplication really does ---------- */
SCENE_X.rugs=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#f4d8a0'},o);el('rect',{x:-700,y:430,width:2000,height:400,fill:'#d8b078'},o);
  for(let x=-700;x<1300;x+=60)el('path',{d:`M${x},0 h30 v60 q-15,14 -30,0Z`,fill:'#e8413e'},o);for(let x=-670;x<1300;x+=60)el('path',{d:`M${x},0 h30 v60 q-15,14 -30,0Z`,fill:'#fff4e6'},o)};
AMB_X.rugs=()=>{if(Math.random()<.5)osc('sine',600+Math.random()*300,.15,.006,{wet:.6});else noise(.8,.02,{type:'bandpass',f:1200,a:.4,wet:.4})};
/* hundreds, tens and ones each have their own colour, on the rug and in the bins */
const RUGK={100:'#7a4ac8',10:'#2f9a5a',1:'#e8902a'};
/* a hundred square, a strip of ten, a single square */
function blockPiece(parent,x,y,kind,col=RUGK[kind]){const g=el('g',{transform:`translate(${x},${y})`},parent);
  if(kind===100){el('rect',{x:-14,y:-14,width:28,height:28,fill:col,stroke:'#3a2418','stroke-width':1.5},g);for(let k=1;k<10;k++){el('line',{x1:-14+k*2.8,x2:-14+k*2.8,y1:-14,y2:14,stroke:'rgba(255,240,200,.35)','stroke-width':.6},g);el('line',{y1:-14+k*2.8,y2:-14+k*2.8,x1:-14,x2:14,stroke:'rgba(255,240,200,.35)','stroke-width':.6},g)}}
  else if(kind===10){el('rect',{x:-3,y:-14,width:6,height:28,fill:col,stroke:'#3a2418','stroke-width':1.2},g);for(let k=1;k<10;k++)el('line',{x1:-3,x2:3,y1:-14+k*2.8,y2:-14+k*2.8,stroke:'rgba(255,240,200,.45)','stroke-width':.6},g)}
  else el('rect',{x:-3,y:-3,width:6,height:6,fill:col,stroke:'#3a2418','stroke-width':1},g);
  return g}
/* which kind of block a w × h piece rolls up into, and how many */
const rugKind=(w,h)=>w===10&&h===10?{k:100,n:1}:w===10?{k:10,n:h}:h===10?{k:10,n:w}:{k:1,n:w*h};
/* the edges of the pieces when a side of n is cut at every ten (tens first) */
const tenCuts=n=>{const out=[0];for(let x=10;x<n;x+=10)out.push(x);out.push(n);return out};
/* one rug piece: coloured by what it rolls into, squares drawn, labelled w × h */
function rugPiece(parent,x,y,w,h,c){const g=el('g',{},parent),kd=rugKind(w,h);
  el('rect',{x:x-Math.max(0,(36-w*c)/2),y:y-Math.max(0,(36-h*c)/2),width:Math.max(36,w*c),height:Math.max(36,h*c),fill:'transparent'},g);
  el('rect',{x,y,width:w*c,height:h*c,fill:RUGK[kd.k],stroke:'#3a2418','stroke-width':2},g);
  for(let i=1;i<w;i++)el('line',{x1:x+i*c,x2:x+i*c,y1:y,y2:y+h*c,stroke:'rgba(255,240,210,.35)','stroke-width':.8},g);
  for(let j=1;j<h;j++)el('line',{y1:y+j*c,y2:y+j*c,x1:x,x2:x+w*c,stroke:'rgba(255,240,210,.35)','stroke-width':.8},g);
  const lab=`${w} × ${h}`,lw=lab.length*7+10,lx=x+w*c/2,ly=y+h*c/2;el('rect',{x:lx-lw/2,y:ly-10,width:lw,height:20,rx:7,fill:'rgba(255,244,230,.92)',stroke:'#3a2418','stroke-width':1},g);
  el('text',{x:lx,y:ly+5,'text-anchor':'middle','font-size':12.5,'font-weight':800,fill:'#3a2418'},g).textContent=lab;return g}

W.rug={scene:'rugs',
notes:`<p>Long multiplication is just counting the squares in a rectangle, cleverly. The rug seller charges £1 a square. She taps the rulers along the top and side to cut the rug at every ten (a long mark on the ruler is a ten), so 24 × 13 falls into 10 × 10 squares, 10-wide strips, and a little piece of ones. Each piece is coloured by what it is (purple hundreds, green tens, orange ones) and labelled, like 10 × 3. Tapping a piece rolls it into the matching bin: hundred squares, strips of ten and single squares, and ten of one kind can be bundled into one of the next (the same swap as the coins). The written method builds alongside: the row of ones (24 × 3) is the first line and the rows of tens (24 × 10) the second, with a coloured bar beside the rug showing which rows make which line. Finally she sets the wheels to the price of the whole rug. A wrong cut or a wrong total twice brings a new rug.</p>`,
mount(root){
  const R=[
    {v:[[13,4],[14,3],[12,6]]},
    {v:[[24,3],[26,3],[17,4]]},
    {v:[[23,12],[21,13],[32,11]]},
    {v:[[24,13],[26,12],[18,14]]},
    {v:[[32,15],[25,16],[27,14]]},
    {v:[[36,24],[28,23],[34,26]]}];
  const S={r:0,busy:false,won:false,pi:{},miss:0,phase:'cut',cv:[],ch:[],parts:[],bin:{100:0,10:0,1:0},lines:[]};
  const scene=el('g',{},root),rugL=el('g',{},root),binL=el('g',{},root),wr=el('g',{},root),fly=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  let wheels=null,go=null;
  const st=navStone({label:'Next rug',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this rug again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],[a,b]=rr.v[(S.pi[S.r]||0)%rr.v.length];return{a,b,ta:Math.floor(a/10)*10,tb:Math.floor(b/10)*10}};
  const RX=64,RY=176,GAP=8,ROW=['#c9413a','#2f6aa8'],TV='Cut line along the top',TH='Cut line down the side';
  const cs=q=>Math.min((320-Math.ceil(q.a/10)*GAP)/q.a,(212-Math.ceil(q.b/10)*GAP)/q.b,24);
  const parts=(q,done)=>[['t','the rug'],['o','='],done?['w',`£${q.a*q.b}`]:['o','?']];
  function drawRug(){rugL.innerHTML='';const q=Q(),c=cs(q);
    if(S.phase==='cut'){
      el('rect',{x:RX-5,y:RY-5,width:q.a*c+10,height:q.b*c+10,rx:4,fill:'#e8c060',stroke:'#7a5a2a','stroke-width':2},rugL);el('rect',{x:RX,y:RY,width:q.a*c,height:q.b*c,fill:'#b8323a'},rugL);
      for(let i=1;i<q.a;i++)el('line',{x1:RX+i*c,x2:RX+i*c,y1:RY,y2:RY+q.b*c,stroke:'rgba(255,230,190,.3)','stroke-width':.8},rugL);for(let j=1;j<q.b;j++)el('line',{y1:RY+j*c,y2:RY+j*c,x1:RX,x2:RX+q.a*c,stroke:'rgba(255,230,190,.3)','stroke-width':.8},rugL);
      cutters(q,c,'v');if(q.b>=10)cutters(q,c,'h');return}
    const xs=S.xs,ys=S.ys,X=i=>RX+xs[i]*c+i*GAP,Y=j=>RY+ys[j]*c+j*GAP;
    S.parts.forEach(p=>{if(p.gone)return;const x=X(p.i),y=Y(p.j);p.cx=x+p.w*c/2;p.cy=y+p.h*c/2;const g=rugPiece(rugL,x,y,p.w,p.h,c);p.g=g;
      interact(g,{label:`Rug piece ${p.i+1},${p.j+1}`,tap:()=>roll(p)})})}
  /* tap the ruler to put a cut there (tap again to take it away); arrows and Enter work too */
  /* draggable scissors, one for each ten that needs cutting off; they snap to the grid lines */
  function cutters(q,c,ax){const v=ax==='v',n=v?q.a:q.b,pos=v?S.cv:S.ch,g=el('g',{},rugL);
    for(let i=0;i<=n;i++){const t=i%10?5:14;el('line',v?{x1:RX+i*c,x2:RX+i*c,y1:RY-6,y2:RY-6-t}:{y1:RY+i*c,y2:RY+i*c,x1:RX-6,x2:RX-6-t},g).setAttribute('style',`stroke:#3a2418;stroke-width:${i%10?1:2.5}`)}
    pos.forEach((k,idx)=>{const lab=`Cutter ${idx+1} ${v?'along the top':'down the side'}`;
      el('line',v?{x1:RX+k*c,x2:RX+k*c,y1:RY-4,y2:RY+q.b*c+4}:{y1:RY+k*c,y2:RY+k*c,x1:RX-4,x2:RX+q.a*c+4},g).setAttribute('style','stroke:#fff;stroke-width:2.5;stroke-dasharray:6 4');
      const h=el('g',{transform:v?`translate(${RX+k*c},${RY-34})`:`translate(${RX-34},${RY+k*c})`},g);el('circle',{r:17,fill:'#ffc04d',stroke:'#7a4a1e','stroke-width':2.5},h);el('text',{y:6,'text-anchor':'middle','font-size':18,transform:v?'rotate(90)':''},h).textContent='✂';
      const set=m=>{m=clamp(m,1,n-1);if(m===pos[idx])return;pos[idx]=m;SFX.tick(m%8);drawRug();rugL.querySelector(`[aria-label="${lab}"]`)?.focus()};
      interact(h,{label:lab,down:()=>({}),move:p=>{if(S.busy||S.phase!=='cut')return;const m=clamp(Math.round(v?(p.x-RX)/c:(p.y-RY)/c),1,n-1);if(m!==pos[idx]){pos[idx]=m;SFX.tick(m%8);h.setAttribute('transform',v?`translate(${RX+m*c},${RY-34})`:`translate(${RX-34},${RY+m*c})`);const ln=h.previousSibling;if(v){ln.setAttribute('x1',RX+m*c);ln.setAttribute('x2',RX+m*c)}else{ln.setAttribute('y1',RY+m*c);ln.setAttribute('y2',RY+m*c)}}},up:()=>drawRug(),tap:()=>{}});
      h.addEventListener('keydown',e=>{if(S.busy||S.phase!=='cut')return;const d=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!d)return;e.preventDefault();set(pos[idx]+d)})})}
  /* where the scissors start: spread out, never already on a ten */
  const startCuts=n=>{const m=Math.floor((n-1)/10),out=[];for(let k=1;k<=m;k++){let x=Math.round(n*k/(m+1));if(x%10===0)x++;while(out.includes(x))x++;out.push(clamp(x,1,n-1))}return out};
  function binSpots(k,n){const out=[];for(let i=0;i<n;i++){if(k===100)out.push({x:430+(i%2)*30,y:334+Math.floor(i/2)*32});else if(k===10)out.push({x:487+(i%7)*7.6,y:334+Math.floor(i/7)*32});else out.push({x:552+(i%6)*8.5,y:324+Math.floor(i/6)*9})}return out}
  function drawBins(){binL.innerHTML='';[[100,414,'hundreds','10 × 10'],[10,478,'tens','10 × 1'],[1,542,'ones','1 × 1']].forEach(([k,x,nm,cap])=>{const g=el('g',{},binL);
    el('rect',{x,y:280,width:60,height:184,rx:10,fill:'rgba(255,244,230,.55)',stroke:RUGK[k],'stroke-width':2.5},g);blockPiece(g,0,0,k).setAttribute('transform',`translate(${x+12},298) scale(.7)`);
    el('text',{x:x+40,y:294,'text-anchor':'middle','font-size':9.5,'font-weight':800,fill:'#3a2418'},g).textContent=cap;el('text',{x:x+40,y:307,'text-anchor':'middle','font-size':11,'font-weight':800,fill:RUGK[k]},g).textContent=`= ${k}`;
    binSpots(k,S.bin[k]).forEach(p=>blockPiece(g,p.x,p.y,k));
    if(k!==100)interact(g,{label:`Bundle ten ${nm}`,tap:()=>bundle(k)})})}
  function drawWr(){wr.innerHTML='';const q=Q(),X=582,DX=17,row=(s,y,col,sz=21)=>s.split('').reverse().forEach((ch,i)=>el('text',{x:X-i*DX,y,'text-anchor':'middle','font-size':sz,'font-weight':800,fill:col},wr).textContent=ch);
    el('rect',{x:410,y:96,width:192,height:120+S.lines.length*22,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},wr);el('text',{x:422,y:114,'font-size':11,'font-weight':800,fill:'#7a5a3a'},wr).textContent='the written way';
    row(String(q.a),136,'#3a2418');row(String(q.b),158,'#3a2418');el('text',{x:X-3.4*DX,y:158,'text-anchor':'middle','font-size':19,'font-weight':800,fill:'#3a2418'},wr).textContent='×';
    el('line',{x1:X-4*DX,x2:X+10,y1:166,y2:166,stroke:'#3a2418','stroke-width':2},wr);
    S.lines.forEach((L,i)=>{if(L.shown)row(String(L.v),188+i*22,L.col)});
    const yT=188+S.lines.length*22;el('line',{x1:X-4*DX,x2:X+10,y1:yT-14,y2:yT-14,stroke:'#3a2418','stroke-width':2},wr);
    if(S.won)row(String(q.a*q.b),yT+8,'#3a2418');else el('text',{x:X-DX,y:yT+8,'text-anchor':'middle','font-size':20,'font-weight':800,fill:'#9a6cff'},wr).textContent='?'}
  function setGo(label,fn,txt){if(go)go.remove();go=decGo(ui,560,500,label,fn,txt)}
  function miss(msg){SFX.wrong();shake(2);S.miss++;if(S.miss>=2){S.busy=true;say(`${msg} A new rug…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4000,load)}else say(`${msg} Have another go.`)}
  /* cuts are right if every piece is a whole ten except one piece of ones (at either end) */
  const goodCuts=(set,n)=>{const c=[...set].sort((x,y)=>x-y),t=tenCuts(n).slice(1,-1),o=t.map(x=>n-x).sort((x,y)=>x-y);return c.join()===t.join()||c.join()===o.join()};
  function cut(){if(S.busy||S.won||S.phase!=='cut')return;const q=Q();    const okV=goodCuts(new Set(S.cv),q.a),okH=q.b<10||goodCuts(new Set(S.ch),q.b);
    if(!okV||!okH){miss(`${!okV?'Along the top':'Down the side'}: each piece should be 10 squares, with the ones left over. The long marks are the tens.`);return}
    S.phase='roll';const xs=[0,...[...S.cv].sort((x,y)=>x-y),q.a],ys=[0,...[...S.ch].sort((x,y)=>x-y),q.b];S.xs=xs;S.ys=ys;S.parts=[];
    for(let j=0;j<ys.length-1;j++)for(let i=0;i<xs.length-1;i++){const w=xs[i+1]-xs[i],h=ys[j+1]-ys[j];S.parts.push({i,j,w,h,...rugKind(w,h)})}
    if(q.b>=10){const onesRows=[],tenRows=[];ys.slice(1).forEach((y,j)=>((y-ys[j])===10?tenRows:onesRows).push(j));
      S.lines=[onesRows,tenRows].filter(r=>r.length).map((rows,li)=>({rows,m:S.parts.filter(p=>rows.includes(p.j)),v:q.a*rows.reduce((s,j)=>s+ys[j+1]-ys[j],0),line:li,col:'#3a2418',h:rows.reduce((s,j)=>s+ys[j+1]-ys[j],0),shown:false}))}
    else S.lines=S.parts.map(p=>({rows:[],m:[p],v:p.w*p.h,line:0,col:RUGK[p.k],shown:false}));
    S.miss=0;SFX.crunch?SFX.crunch():SFX.pop();drawRug();drawWr();setGo('Check the price',check,'Check');say(`Cut! Tap each piece to roll it up.`)}
  function roll(p){if(S.busy||S.won||S.phase!=='roll'||p.gone)return;S.busy=true;const q=Q(),from={x:p.cx,y:p.cy},pg=p.g;SFX.whoosh();
    if(pg){pg.style.transformBox='fill-box';pg.style.transformOrigin='center';tween(240,t=>{pg.setAttribute('opacity',(1-t).toFixed(2));pg.style.transform=`scale(${(1-t*.4).toFixed(3)})`},()=>{p.gone=true;drawRug()})}else{p.gone=true;drawRug()}
    const n=p.n,gap=Math.min(45,420/n),spots=binSpots(p.k,S.bin[p.k]+n).slice(S.bin[p.k]);let landed=0;
    spots.forEach((b,i)=>later(80+i*gap,()=>{const c=blockPiece(fly,from.x,from.y,p.k),dx=(i%3-1)*6;
      tween(520,(t)=>{const x=from.x+dx*(1-t)+(b.x-from.x-dx)*t,y=from.y+(b.y-from.y)*t-Math.sin(t*Math.PI)*46;c.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(1+Math.sin(t*Math.PI)*.25).toFixed(3)})`)},
        ()=>{c.remove();S.bin[p.k]++;drawBins();if(i%3===0)SFX.tick((i/3)%8);if(++landed===n)done()},ease.inOut)}));
    const done=()=>{S.busy=false;const L=S.lines.find(L=>L.m.includes(p));if(L.m.every(x=>x.gone)){L.shown=true;SFX.chime()}drawWr();
      if(S.parts.every(x=>x.gone)){S.phase='count';wheels=digitWheels(ui,{x:230,y:300,digits:3,label:'Price'});popIn(wheels.g,.5);say('All rolled up! Bundle tens if it helps, then set the price of the whole rug.')}
      else say(L.shown?(L.h?`That row is ${q.a} × ${L.h}: a line of the written way.`:`That’s a line of the written way.`):`Tap the next piece.`)}}
  function bundle(k){if(S.busy||S.won||S.phase==='cut')return;if(S.bin[k]<10){say(`Not ten to bundle.`);return}S.busy=true;const sp=binSpots(k,S.bin[k]).slice(-10),to=binSpots(k*10,S.bin[k*10]+1).pop();
    S.bin[k]-=10;drawBins();SFX.whoosh();sp.forEach(b=>{const c=blockPiece(fly,b.x,b.y,k);tween(420,t=>c.setAttribute('transform',`translate(${(b.x+(to.x-b.x)*t).toFixed(1)},${(b.y+(to.y-b.y)*t).toFixed(1)})`),()=>c.remove(),ease.inOut)});
    later(440,()=>{S.bin[k*10]++;S.busy=false;SFX.clink&&SFX.clink();drawBins();say(`Ten ${k===1?'ones':'tens'} make one ${k===1?'ten':'hundred'}.`)})}
  function check(){if(S.busy||S.won)return;const q=Q();if(S.phase==='roll'){say('Roll up every piece first.');return}const v=wheels.get();if(!v){say('Set the wheels to the price first.');return}
    if(v!==q.a*q.b){miss(`The rug isn’t £${v}. Count the hundreds, tens and ones.`);return}
    S.won=true;roundWon(S.r);wheels.lock(true);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);drawWr();burst(230,300,{n:16,cols:['#ffd23a','#e8413e']});
    say(`${q.a*q.b} squares, so the rug costs £${q.a*q.b}.`);if(S.r>=2)unlock('mrug');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';fly.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});wheels=null;go=null;const q=Q();
    Object.assign(S,{busy:false,won:false,miss:0,phase:'cut',cv:startCuts(q.a),ch:q.b>=10?startCuts(q.b):[],parts:[],bin:{100:0,10:0,1:0},lines:[]});
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);drawRug();drawBins();wr.innerHTML='';setGo('Cut!',cut,'Cut!');
    say(S.r===0?`£1 a square. Drag the scissors so each piece is 10 squares, with the ones left over. Then Cut!`:q.b>=10?`£1 a square. Drag the scissors along the top and down the side: pieces of 10, with the ones left over.`:`£1 a square. Drag the scissors: pieces of 10, with the ones left over.`)}
  W.rug.dbgQ=()=>({...Q(),cv:S.cv,ch:S.ch,phase:S.phase,parts:S.parts.length,r:S.r});S.r=resumeAt(R.length);load();
}};
