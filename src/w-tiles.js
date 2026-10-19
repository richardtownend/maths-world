
/* ---------- 4. Tiles: area, by covering a floor with rectangles of tiles ---------- */
const TILEC=['#8fd6ff','#ffb34d','#ff9ed2','#8ff0c8','#c9a2ff','#ffe066'];
/* a floor on a grid; drag out rectangles of tiles; the floor is a set of cells, a pond can be tiled over and taken away later */
function tileKit(parent,{x0,y0,cs,cols,rows,floor,pond=new Set(),tri=null,label='Floor: drag out a rectangle of tiles',onChange}){
  const g=el('g',{},parent),bg=el('g',{},g),patchL=el('g',{},g),prev=el('g',{},g),hitL=el('g',{},g),K=(c,r)=>`${c},${r}`;let patches=[],locked=false,ci=0;
  el('rect',{x:x0-6,y:y0-6,width:cols*cs+12,height:rows*cs+12,rx:10,fill:'#2a2245',stroke:'rgba(255,244,230,.2)','stroke-width':1.5},bg);
  for(let c=0;c<=cols;c++)el('line',{x1:x0+c*cs,x2:x0+c*cs,y1:y0,y2:y0+rows*cs,stroke:'rgba(255,244,230,.12)','stroke-width':1},bg);
  for(let r=0;r<=rows;r++)el('line',{x1:x0,x2:x0+cols*cs,y1:y0+r*cs,y2:y0+r*cs,stroke:'rgba(255,244,230,.12)','stroke-width':1},bg);
  floor.forEach(k=>{const [c,r]=k.split(',').map(Number);el('rect',{x:x0+c*cs+1,y:y0+r*cs+1,width:cs-2,height:cs-2,rx:3,fill:'#e8d8b0'},bg)});
  pond.forEach(k=>{const [c,r]=k.split(',').map(Number);el('rect',{x:x0+c*cs,y:y0+r*cs,width:cs,height:cs,fill:'#3f8ac0'},bg);el('path',{d:`M${x0+c*cs+6},${y0+r*cs+cs/2} q${cs/4},-5 ${cs/2},0 t${cs/2-12},0`,stroke:'#8fd6ff','stroke-width':2,fill:'none'},bg)});
  if(tri){const {c,r,w,h}=tri;el('path',{d:`M${x0+c*cs},${y0+(r+h)*cs} L${x0+(c+w)*cs},${y0+(r+h)*cs} L${x0+c*cs},${y0+r*cs}Z`,fill:'#e8d8b0',stroke:'#c9a24a','stroke-width':2.5},bg)}
  /* the floor's outline */
  floor.forEach(k=>{const [c,r]=k.split(',').map(Number),inF=(a,b)=>floor.has(K(a,b))||pond.has(K(a,b)),X=x0+c*cs,Y=y0+r*cs;[[0,-1,X,Y,X+cs,Y],[0,1,X,Y+cs,X+cs,Y+cs],[-1,0,X,Y,X,Y+cs],[1,0,X+cs,Y,X+cs,Y+cs]].forEach(([dc,dr,a,b,c2,d])=>{if(!inF(c+dc,r+dr))el('line',{x1:a,y1:b,x2:c2,y2:d,stroke:'#c9a24a','stroke-width':3,'stroke-linecap':'round'},bg)})});
  const cellAt=p=>[clamp(Math.floor((p.x-x0)/cs),0,cols-1),clamp(Math.floor((p.y-y0)/cs),0,rows-1)];
  const covered=new Map();
  function rectCells(a,b){const c0=Math.min(a[0],b[0]),c1=Math.max(a[0],b[0]),r0=Math.min(a[1],b[1]),r1=Math.max(a[1],b[1]),out=[];for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)out.push([c,r]);return{c0,r0,w:c1-c0+1,h:r1-r0+1,cells:out}}
  function drawPrev(R,bad){prev.innerHTML='';if(!R)return;el('rect',{x:x0+R.c0*cs,y:y0+R.r0*cs,width:R.w*cs,height:R.h*cs,rx:4,fill:bad?'rgba(255,90,122,.3)':'rgba(255,240,160,.3)',stroke:bad?'#ff5a7a':'#fff0a0','stroke-width':3},prev);
    el('text',{x:x0+(R.c0+R.w/2)*cs,y:y0+R.r0*cs-8,'text-anchor':'middle','font-size':15,'font-weight':700,fill:bad?'#ff9ec0':'#fff0a0'},prev).textContent=`${R.w} × ${R.h}`}
  const okCell=([c,r])=>tri?true:(floor.has(K(c,r))||pond.has(K(c,r)))&&!covered.has(K(c,r));
  function place(R){const col=TILEC[ci++%TILEC.length],pg=el('g',{},patchL),P={...R,g:pg,n:R.w*R.h};
    el('rect',{x:x0+R.c0*cs+2,y:y0+R.r0*cs+2,width:R.w*cs-4,height:R.h*cs-4,rx:5,fill:col,opacity:tri?.55:.92,stroke:darker(col,.7),'stroke-width':2},pg);
    for(let c=1;c<R.w;c++)el('line',{x1:x0+(R.c0+c)*cs,x2:x0+(R.c0+c)*cs,y1:y0+R.r0*cs+3,y2:y0+(R.r0+R.h)*cs-3,stroke:darker(col,.75),'stroke-width':1.2,opacity:.6},pg);
    for(let r=1;r<R.h;r++)el('line',{x1:x0+R.c0*cs+3,x2:x0+(R.c0+R.w)*cs-3,y1:y0+(R.r0+r)*cs,y2:y0+(R.r0+r)*cs,stroke:darker(col,.75),'stroke-width':1.2,opacity:.6},pg);
    const lt=`${R.w} × ${R.h}`,fs=Math.min(17,R.w*cs/lt.length*1.6);
    const lb=el('g',{},pg);el('rect',{x:x0+(R.c0+R.w/2)*cs-lt.length*fs*.3-6,y:y0+(R.r0+R.h/2)*cs-fs*.75,width:lt.length*fs*.6+12,height:fs*1.5,rx:6,fill:'#fff4e6',opacity:.92},lb);
    el('text',{x:x0+(R.c0+R.w/2)*cs,y:y0+(R.r0+R.h/2)*cs+fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#3a2418'},lb).textContent=lt;
    R.cells.forEach(([c,r])=>covered.set(K(c,r),P));patches.push(P);popIn(pg,.85);SFX.plink(patches.length+2);
    interact(pg,{label:`Tiles ${R.w} by ${R.h}: tap to lift them`,tap:()=>{if(locked)return;lift(P)}});onChange&&onChange()}
  function lift(P){P.cells.forEach(([c,r])=>covered.delete(K(c,r)));patches=patches.filter(x=>x!==P);P.g.remove();SFX.pop(.8);onChange&&onChange()}
  const hit=el('rect',{x:x0,y:y0,width:cols*cs,height:rows*cs,fill:'transparent'},hitL);
  interact(hitL,{label,down:p=>{if(locked)return{};const a=cellAt(p);drawPrev(rectCells(a,a));return{a}},move:(p,p0,c)=>{if(locked||!c.a)return;const R=rectCells(c.a,cellAt(p));drawPrev(R,!R.cells.every(okCell)||(tri&&patches.length>0))},
    up:(p,p0,c)=>{if(locked||!c.a)return;finish(rectCells(c.a,cellAt(p)))},tap:p=>{if(locked||!p)return;const a=cellAt(p),P=covered.get(K(...a));if(P){lift(P);drawPrev(null);return}finish(rectCells(a,a))}});
  function finish(R){drawPrev(null);if(tri&&patches.length){say('One rectangle round the triangle is enough. Tap it to lift it if you want to try again.');return}
    if(!R.cells.every(okCell)){SFX.wrong();shake(2);say(R.cells.some(([c,r])=>covered.has(K(c,r)))?'Those tiles would sit on top of tiles already down.':'Tiles have to stay on the floor.');return}place(R)}
  /* keyboard: Enter tiles the whole next bare row strip, for testing and switch users */
  return{g,patches:()=>patches,lock:b=>{locked=b},place:(a,b)=>finish(rectCells(a,b)),
    bare:()=>[...floor].filter(k=>!covered.has(k)),overPond:()=>[...pond].filter(k=>covered.has(k)).length,
    sink(done){const cells=[...pond].filter(k=>covered.has(k));cells.forEach((k,i)=>{const [c,r]=k.split(',').map(Number),s=el('rect',{x:x0+c*cs+2,y:y0+r*cs+2,width:cs-4,height:cs-4,fill:'#3f8ac0'},patchL);s.setAttribute('opacity',0);later(i*120,()=>{SFX.plop();drops(x0+c*cs+cs/2,y0+r*cs+cs/2,6);tween(400,(t,p)=>s.setAttribute('opacity',p.toFixed(2)))})});later(cells.length*120+500,()=>done&&done())},
    fold(done){const {c,r,w,h}=tri,A=[x0+c*cs,y0+r*cs],B=[x0+(c+w)*cs,y0+(r+h)*cs],cx=(A[0]+B[0])/2,cy=(A[1]+B[1])/2,f=el('path',{d:`M${A[0]},${A[1]} L${B[0]},${A[1]} L${B[0]},${B[1]}Z`,fill:'#ffb34d',opacity:.85,stroke:'#7a4a2e','stroke-width':2},patchL);
      SFX.unfold&&SFX.unfold();tween(1100,(t,p)=>f.setAttribute('transform',`rotate(${(180*t).toFixed(1)} ${cx} ${cy})`),()=>{SFX.plink(6);done&&done()},ease.inOut)}}}

W.tiles={scene:'desk',
notes:`<p>Area: how many squares cover a shape. Shelly's floors need tiling. She drags out a rectangle on the floor (from one corner to the other) and a slab of tiles drops in, labelled with its size across × down (4 × 3). Tiles must stay on the floor and can't overlap; tap a slab to lift it. When the floor is covered she presses Count: the box writes her slabs as a sum (3 × 5 + 3 × 3 = ?) and she picks the area from three cards, so she has to work it out. One wrong card is usually the perimeter, the distance round the edge, which is the classic mix-up; a wrong card gets a new floor.</p>
<p>Rounds: a rectangle, a bigger rectangle (across × down, no counting one by one), an L-shape (split it into two rectangles), a U-shape (three rectangles, or more), a right-angled triangle (drag the rectangle that fits snugly round it and press Fold: the spare half spins onto the triangle, so it's half of the rectangle), and a floor with a pond: tile right over the pond and the tiles over the water sink, so take them away.</p>`,
mount(root){
  const box=(w,h,f=()=>false)=>{const s=new Set();for(let c=2;c<2+w;c++)for(let r=1;r<1+h;r++)if(!f(c-2,r-1))s.add(`${c},${r}`);return s};
  const R=[{p:[[4,3],[5,3],[4,4]],k:'rect'},{p:[[6,5],[7,4],[6,4]],k:'rect'},{p:[[6,5,3,2],[5,5,2,3],[7,4,3,2]],k:'L'},{p:[[7,4,3,2],[7,5,3,3],[6,4,2,2]],k:'U'},{p:[[6,4],[4,5],[8,3]],k:'tri'},{p:[[6,5,2,2],[7,5,3,1],[6,4,2,1]],k:'pond'}];
  const S={r:0,busy:false,won:false,pi:{}};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,cardL=null;const guide=shellyGuide(ui);
  const st=navStone({label:'Next floor',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this floor again',onTap:()=>load()});
  const goB=decGo(ui,540,480,'Count the tiles',count,'Count');
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length],[w,h,a,b]=v;let f,pond=new Set(),tri=null;
    if(q.k==='rect')f=box(w,h);else if(q.k==='L')f=box(w,h,(c,r)=>c>=w-a&&r<b);else if(q.k==='U'){const m=Math.floor((w-a)/2);f=box(w,h,(c,r)=>c>=m&&c<m+a&&r<b)}
    else if(q.k==='tri'){f=new Set();tri={c:2,r:1,w,h}}else{const pc=Math.floor((w-a)/2),pr=Math.floor((h-b)/2);f=box(w,h,(c,r)=>c>=pc&&c<pc+a&&r>=pr&&r<pr+b);pond=new Set([...box(w,h)].filter(k=>!f.has(k)))}
    const A=q.k==='tri'?w*h/2:f.size;return{k:q.k,w,h,f,pond,tri,A}};
  const perim=q=>{if(q.k==='tri')return null;const all=new Set([...q.f,...q.pond]);let n=0;all.forEach(k=>{const [c,r]=k.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{if(!all.has(`${c+a},${r+b}`))n++})});return n};
  function count(){if(S.busy||S.won)return;const q=Q(),P=kit.patches();if(!P.length){say(q.tri?'Drag a rectangle that fits snugly round the triangle first.':'Drag across the floor to lay a rectangle of tiles.');return}
    if(q.tri){const p=P[0],t=q.tri;if(p.c0!==t.c||p.r0!==t.r||p.w!==t.w||p.h!==t.h){SFX.wrong();say(`Your rectangle is ${p.w} × ${p.h}. Make it fit snugly round the triangle: as wide and as tall as it is.`);return}
      S.busy=true;kit.lock(true);goB.style.display='none';kit.fold(()=>ask(q,[['t','Area'],['o','='],['w',`${t.w} × ${t.h}`],['o','÷'],['w',2],['o','='],['o','?']],[q.A,q.A*2,q.A+2],'The spare half spun onto the triangle. So how many squares is the triangle?'));return}
    const bare=kit.bare();if(bare.length){SFX.wrong();say(`Some floor is still bare: ${bare.length} square${bare.length>1?'s':''} to go.`);return}
    S.busy=true;kit.lock(true);goB.style.display='none';const terms=P.flatMap((p,k)=>k?[['o','+'],['w',`${p.w} × ${p.h}`]]:[['w',`${p.w} × ${p.h}`]]),wet=kit.overPond(),pm=perim(q);
    const tot=P.reduce((a,p)=>a+p.n,0),dis=[q.A,pm!==q.A?pm:q.A+3,q.A+(P[0].w||2)];
    const go2=()=>ask(q,[['t','Area'],['o','='],...terms,...(wet?[['o','−'],['w',wet]]:[]),['o','='],['o','?']],dis,wet?`${wet} tiles sank in the pond! Work out the area: the slabs, take away the sunk ones.`:'Work out the area of your slabs, then tap the answer.');
    wet?kit.sink(go2):go2()}
  function ask(q,parts,vals,msg){decQ(qL,parts,false,guide);say(msg);cardL=el('g',{},ui);const v=[...new Set(vals)];while(v.length<3)v.push(q.A+v.length*2+1);v.sort(()=>Math.random()-.5);
    v.forEach((n,k)=>{const c=el('g',{transform:`translate(540,${190+k*84})`},cardL);el('rect',{x:-52,y:-30,width:104,height:60,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);
      el('text',{y:4,'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#3a2418'},c).textContent=n;el('text',{y:22,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#7a5a44'},c).textContent='squares';
      interact(c,{label:`Area card ${n}`,tap:()=>{if(S.won)return;S.won=true;cardL.querySelectorAll('g').forEach(g=>g.style.opacity=g===c?1:.35);
        if(n===q.A)win(q,parts.map(p=>p[1]==='?'?['w',q.A]:p));else{SFX.wrong();const pm=perim(q);
          say(n===pm?`${n} is the distance round the edge: the perimeter. Area counts the squares inside. A new floor…`:`Not ${n}. Work out each slab across × down, then add. A new floor…`);
          S.pi[S.r]=(S.pi[S.r]||0)+1;later(3200,load)}}});popIn(c,.5)})}
  function win(q,parts){roundWon(S.r);SFX.fanfare();decQ(qL,parts,true,guide);burst(300,300,{n:16});
    say(q.k==='rect'?`${q.w} across × ${q.h} down = ${q.A} squares. Area is across × down.`:q.k==='tri'?`The triangle is exactly half its ${q.w} × ${q.h} rectangle: ${q.A} squares.`:q.k==='pond'?`${q.A} squares: the pond takes some away.`:`${q.A} squares. Split the shape into rectangles, then add.`);
    if(S.r>=2)unlock('area');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';if(cardL)cardL.remove();cardL=null;const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';
    goB.querySelector('text').textContent=q.tri?'Fold':'Count';
    kit=tileKit(board,{x0:70,y0:110,cs:40,cols:10,rows:7,floor:q.f,pond:q.pond,tri:q.tri});
    decQ(qL,[['t','Area'],['o','='],['o','?'],['t','squares']],false,guide);
    say(S.r===0?'Tile the floor: drag from one corner to the other to lay a rectangle of tiles. Then Count.':q.tri?'A triangle! Drag the rectangle that fits snugly round it, then Fold.':q.k==='pond'?'There’s a pond in this floor. Tiles over water will sink! Cover the floor, then Count.':q.k!=='rect'?'This floor isn’t a rectangle. Split it into rectangles of tiles, then Count.':'A bigger floor. One rectangle of tiles, then Count.')}
  W.tiles.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
