
/* ---------- 6. Boxes: nets that fold into cubes ---------- */
/* fold a net of unit squares by angle theta (0 flat .. PI/2 folded); cells[0] is the base */
function netFold(cells,theta){const n=cells.length,K=(c,r)=>c+','+r,idx=new Map(cells.map((p,i)=>[K(...p),i]));
  const par=Array(n).fill(-1),order=[0],seen=new Set([0]);for(let q=0;q<order.length;q++){const [c,r]=cells[order[q]];[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dc,dr])=>{const j=idx.get(K(c+dc,r+dr));if(j!=null&&!seen.has(j)){seen.add(j);par[j]=order[q];order.push(j)}})}
  const P=cells.map(([c,r])=>[[c,r,0],[c+1,r,0],[c+1,r+1,0],[c,r+1,0]]),N=cells.map(()=>[0,0,1]),kids=Array.from({length:n},()=>[]);par.forEach((p,i)=>{if(p>=0)kids[p].push(i)});
  const sub=f=>{const out=[f];for(let k=0;k<out.length;k++)out.push(...kids[out[k]]);return out};
  const rot=(v,o,a,ang)=>{const x=v[0]-o[0],y=v[1]-o[1],z=v[2]-o[2],c=Math.cos(ang),s=Math.sin(ang),d=a[0]*x+a[1]*y+a[2]*z,cr=[a[1]*z-a[2]*y,a[2]*x-a[0]*z,a[0]*y-a[1]*x];return[o[0]+x*c+cr[0]*s+a[0]*d*(1-c),o[1]+y*c+cr[1]*s+a[1]*d*(1-c),o[2]+z*c+cr[2]*s+a[2]*d*(1-c)]};
  const cen=f=>[0,1,2].map(k=>P[f].reduce((s,p)=>s+p[k],0)/4);
  for(const f of order){const p=par[f];if(p<0)continue;const [c,r]=cells[f],[pc,pr]=cells[p],dc=c-pc,dr=r-pr,hi=dc===1?[0,3]:dc===-1?[1,2]:dr===1?[0,1]:[3,2];
    const h0=P[f][hi[0]],h1=P[f][hi[1]],ax=[h1[0]-h0[0],h1[1]-h0[1],h1[2]-h0[2]],L=Math.hypot(...ax),a=ax.map(v=>v/L),c0=cen(f),tc=rot(c0,h0,a,.1),np=N[p];
    const sg=((tc[0]-c0[0])*np[0]+(tc[1]-c0[1])*np[1]+(tc[2]-c0[2])*np[2])>0?1:-1;
    for(const g of sub(f)){P[g]=P[g].map(v=>rot(v,h0,a,sg*theta));N[g]=rot(N[g],[0,0,0],a,sg*theta)}}
  return{P,N}}
const faceCentres=cells=>netFold(cells,Math.PI/2).P.map(q=>[0,1,2].map(k=>q.reduce((a,p)=>a+p[k],0)/4));
const isCube=cells=>cells.length===6&&new Set(faceCentres(cells).map(c=>c.map(v=>Math.round(v*2)).join(','))).size===6;
function oppositeOf(cells,i){const C=faceCentres(cells),t=[2*(cells[0][0]+.5)-C[i][0],2*(cells[0][1]+.5)-C[i][1],1-C[i][2]];return C.findIndex(q=>Math.hypot(q[0]-t[0],q[1]-t[1],q[2]-t[2])<1e-6)}
const BOXC=['#8fd6ff','#ffb34d','#ff9ed2','#8ff0c8','#c9a2ff','#ffe066'];
/* a net drawn on a table in 3D; candidate squares to tap; Fold animates it */
function boxKit(parent,{cx,cy,S=60,cells,cands=[],marks={},label='Net square',onPick}){
  const g=el('g',{},parent),L=el('g',{},g),yaw0=rad(-22);let el2=rad(90),yaw=0,cam=[0,0,1],picked=null,theta=0,locked=false,bad=new Set();
  const setCam=f=>{el2=rad(lerp(90,40,f));yaw=yaw0*f;cam=[0,Math.cos(el2),Math.sin(el2)]};
  const all=[...cells,...cands],mx=(Math.min(...all.map(p=>p[0]))+Math.max(...all.map(p=>p[0]))+1)/2,my=(Math.min(...all.map(p=>p[1]))+Math.max(...all.map(p=>p[1]))+1)/2;
  const rc=[cells[0][0]+.5,cells[0][1]+.5],prj=([x,y,z])=>{const f=theta/(Math.PI/2);x-=lerp(mx,rc[0],f);y-=lerp(my,rc[1],f);z-=.5*f;const x1=x*Math.cos(yaw)-y*Math.sin(yaw),y1=x*Math.sin(yaw)+y*Math.cos(yaw);return[cx+x1*S,cy+(y1*Math.sin(el2)-z*Math.cos(el2))*S,y1*cam[1]+z*cam[2]]};
  const net=()=>picked?[...cells,picked]:cells;
  const bil=(q,u,v)=>[0,1,2].map(k=>q[0][k]*(1-u)*(1-v)+q[1][k]*u*(1-v)+q[2][k]*u*v+q[3][k]*(1-u)*v);
  function draw(){L.innerHTML='';const cs=net(),{P,N}=netFold(cs,theta);
    if(theta<.01)cands.forEach(c=>{if(picked&&picked[0]===c[0]&&picked[1]===c[1])return;const q=[[c[0],c[1],0],[c[0]+1,c[1],0],[c[0]+1,c[1]+1,0],[c[0],c[1]+1,0]].map(prj);
      const poly=el('polygon',{points:q.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '),fill:'rgba(255,240,160,.12)',stroke:'#fff0a0','stroke-width':2.5,'stroke-dasharray':'7 5'},L);
      interact(poly,{label:`${label} at ${c[0]},${c[1]}`,tap:()=>{if(locked)return;picked=c;SFX.pop(1.1);draw();onPick&&onPick(c)}})});
    const faces=P.map((q,i)=>({i,q,pr:q.map(prj),d:q.reduce((a,p)=>a+p[1]*cam[1]+p[2]*cam[2],0)/4})).sort((a,b)=>a.d-b.d);
    faces.forEach(({i,q,pr})=>{const n=N[i],lit=.62+.38*Math.max(0,n[1]*cam[1]+n[2]*cam[2]),base=bad.has(i)?'#ff5a7a':BOXC[i%6],isPick=picked&&i===cs.length-1&&cs.length>cells.length;
      const poly=el('polygon',{points:pr.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '),fill:base,stroke:'#2a2245','stroke-width':2,'stroke-linejoin':'round',opacity:1},L);
      el('polygon',{points:pr.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '),fill:'#0d0a24',opacity:(1-lit).toFixed(2),'pointer-events':'none'},L);
      if(isPick&&theta<.01)interact(poly,{label:`${label}: chosen`,tap:()=>{if(locked)return;picked=null;SFX.pop(.8);draw();onPick&&onPick(null)}});
      const m=marks[i]!=null?marks[i]:null;if(m!=null){const pip=(u,v)=>{const [x,y]=prj(bil(q,u,v));el('circle',{cx:x,cy:y,r:S*.075,fill:'#3a2418','pointer-events':'none'},L)};
        const PIPS={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.26,.26],[.5,.5],[.74,.74]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.26,.26],[.74,.26],[.5,.5],[.26,.74],[.74,.74]],6:[[.28,.25],[.28,.5],[.28,.75],[.72,.25],[.72,.5],[.72,.75]]};(PIPS[m]||[]).forEach(([u,v])=>pip(u,v));if(m==='?'){const [x,y]=prj(bil(q,.5,.5));el('text',{x,y:y+8,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418','pointer-events':'none'},L).textContent='?'}}})}
  draw();
  return{g,net,picked:()=>picked,setMarks(m){marks=m;draw()},lock:b=>{locked=b},
    fold(done,back){const ok=isCube(net());tween(450,(t)=>{setCam(t);draw()},()=>{SFX.unfold&&SFX.unfold();tween(1600,(t)=>{theta=t*Math.PI/2;draw()},()=>{
      if(!ok){const C=faceCentres(net()).map(c=>c.map(v=>Math.round(v*2)).join(',')),cnt={};C.forEach(k=>cnt[k]=(cnt[k]||0)+1);bad=new Set(C.map((k,i)=>cnt[k]>1?i:-1).filter(i=>i>=0));draw()}
      done&&done(ok)},ease.inOut)},ease.inOut)},
    unfold(done){tween(900,(t)=>{theta=(1-t)*Math.PI/2;draw()},()=>{theta=0;tween(400,t=>{setCam(1-t);draw()},()=>{done&&done()})},ease.inOut)},
  }}

W.boxes={scene:'shop',
notes:`<p>3D shapes from nets. A net is a flat shape that folds up into a box. Five squares of a net lie on the table; dashed outlines show where the sixth could go. She taps one and presses Fold, and the net folds up in 3D. If it makes a cube, the box is done; if not, two flaps land on the same side (they turn red) and one side is left open, then it unfolds for another go with a new net.</p>
<p>Rounds: a cross with its tail missing, a staircase, a row of four, then a flipped round where she picks which of three whole nets folds into a cube, another missing square, then a dice: 1 and 6 are always on opposite faces, so she taps the square that will end up opposite the 1. Last, a harder dice: opposite faces always add up to 7, two faces are already numbered, and she has to work out where a new number goes (the 5 goes opposite the 2, so find the face opposite the 2). (In a net, two squares in a straight line with one square between them end up opposite.)</p>`,
mount(root){
  const R=[{p:[{c:[[1,1],[1,0],[0,1],[2,1],[1,2]],k:[[1,3],[2,2],[0,0]]},{c:[[1,1],[1,0],[1,2],[0,2],[2,0]],k:[[0,3],[2,1],[0,1]]}]},
    {p:[{c:[[1,1],[0,0],[1,0],[2,1],[2,2]],k:[[3,2],[1,2],[2,3]]},{c:[[1,1],[0,1],[1,0],[2,1],[2,2]],k:[[-1,1],[0,2],[2,0]]}]},
    {p:[{c:[[1,1],[0,1],[2,1],[3,1],[1,0]],k:[[2,2],[4,1],[3,0]]},{c:[[1,1],[0,1],[2,1],[3,1],[2,0]],k:[[0,2],[4,1],[1,0]]}]},
    {pick:1,p:[{nets:[[[1,1],[0,0],[1,0],[2,0],[1,2],[1,3]],[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]]]},{nets:[[[1,1],[0,0],[1,0],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[3,0],[4,0],[2,1]],[[0,0],[1,0],[1,1],[2,1],[2,0],[1,2]]]}]},
    {p:[{c:[[1,1],[0,1],[1,0],[2,1],[2,2]],k:[[3,2],[0,2],[2,0],[1,2]]},{c:[[1,1],[1,0],[0,1],[2,1],[1,2]],k:[[-1,1],[0,0],[2,2],[0,2]]}]},
    {dice:1,p:[{c:[[1,1],[0,0],[1,0],[2,0],[1,2],[1,3]],one:1},{c:[[1,1],[0,0],[1,0],[2,1],[2,2],[3,2]],one:2},{c:[[1,1],[1,0],[0,1],[2,1],[1,2],[1,3]],one:2}]},
    /* opposite faces add up to 7: two faces are given, she works out the partner of the new number, then finds the face opposite it */
    {dice:2,p:[{c:[[1,1],[0,0],[1,0],[2,1],[2,2],[3,2]],give:{1:3,0:1},put:4},{c:[[1,1],[0,1],[2,1],[3,1],[1,0],[1,2]],give:{0:2,4:3},put:5},{c:[[1,1],[0,0],[1,0],[2,0],[1,2],[1,3]],give:{2:2,5:6},put:5}]}];
  const S={r:0,busy:false,won:false,pi:{},sel:null};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,cardsL=null;const guide=shellyGuide(ui);
  const st=navStone({label:'Next box',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this box again',onTap:()=>load()});
  const goB=decGo(ui,536,478,'Fold the net',fold,'Fold');
  const Q=()=>{const q=R[S.r],v=Object.assign({},q,q.p[(S.pi[S.r]||0)%q.p.length]);if(q.dice){v.give=v.give||{[v.one]:1};v.put=v.put||6;v.mate=+Object.keys(v.give).find(k=>v.give[k]===7-v.put)}return v};
  function fold(){if(S.busy||S.won)return;const q=Q();
    if(q.dice){if(S.sel==null){say(q.dice===1?'Tap the square that will end up opposite the 1 first.':`Tap the square where the ${q.put} goes first.`);return}}
    else if(q.pick){if(S.pickNet==null){say('Tap the net you think will fold into a cube first.');return}cardsL.remove();kit=boxKit(board,{cx:300,cy:320,S:84,cells:S.pickNet})}
    else if(!kit.picked()){say('Tap one of the dashed squares to add the sixth square first.');return}
    S.busy=true;kit.lock(true);goB.style.display='none';
    kit.fold(ok=>{const cs=kit.net();
      if(q.dice){const o=oppositeOf(cs,q.mate),A=q.c[q.mate],B=q.c[o],line=(A[0]===B[0]&&Math.abs(A[1]-B[1])===2)||(A[1]===B[1]&&Math.abs(A[0]-B[0])===2);if(o===S.sel)win(q,q.dice===2?`${7-q.put} + ${q.put} = 7: opposite faces of a dice always add up to 7!`:line?'1 and 6 are opposite! In a net, squares in a line with one square between them end up opposite.':'1 and 6 are opposite! Folding shows which faces meet.');
        else{SFX.wrong();kit.setMarks(Object.assign({},q.give,{[S.sel]:q.put,[o]:'?'}));say(`The ${q.put} landed next to the ${7-q.put}, not opposite it. Unfolding: the ? shows the face opposite the ${7-q.put}…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(1400,()=>kit.unfold(()=>later(3400,load)))}return}
      if(ok)win(q,q.pick?'That one folds into a cube: six squares, every side covered once.':'It’s a cube! Every side is covered exactly once.');
      else{SFX.wrong();shake(4);say('Two flaps land on the same side (red), and one side is left open. Not a cube! A new net coming…');S.pi[S.r]=(S.pi[S.r]||0)+1;later(1800,()=>kit.unfold(()=>later(1800,load)))}})}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();decQ(qL,q.dice===2?[['w',q.put],['t','is opposite'],['w',7-q.put]]:q.dice?[['w',1],['t','is opposite'],['w',6]]:[['t','6 squares'],['o','→'],['t','a cube'],['w','✓']],true,guide);say(msg);burst(300,330,{n:18});if(S.r>=2)unlock('nets');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false,sel:null,pickNet:null});st.ready(false);navDots(R.length,S.r);goB.style.display='';kit=null;
    if(q.pick){cardsL=el('g',{},board);const order=[0,1,2].sort(()=>Math.random()-.5);
      order.forEach((ni,k)=>{const cs=q.nets[ni],x=110+k*176,y=300,c=el('g',{},cardsL),w=Math.max(...cs.map(p=>p[0]))+1,h=Math.max(...cs.map(p=>p[1]))+1,s=Math.min(34,130/Math.max(w,h));
        el('rect',{x:x-78,y:y-90,width:156,height:180,rx:14,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2.5},c);
        cs.forEach(([cc,rr],i)=>el('rect',{x:x-w*s/2+cc*s,y:y-h*s/2+rr*s,width:s,height:s,fill:BOXC[i%6],stroke:'#2a2245','stroke-width':2},c));
        c.dataset.ni=ni;interact(c,{label:`Net ${k+1}`,tap:()=>{if(S.busy)return;S.pickNet=cs;SFX.pop(1.1);[...cardsL.children].forEach(x=>{x.style.opacity=x===c?1:.55;x.firstChild.setAttribute('stroke',x===c?'#ffc04d':'#c9a24a')});goB.style.display=''}});popIn(c,.5)})}
    else if(q.dice){const marks=Object.assign({},q.give);kit=boxKit(board,{cx:300,cy:320,S:84,cells:q.c,marks});
      /* tap a face of the net to put the 6 there */
      const pickFace=i=>{if(S.busy||q.give[i]!=null)return;S.sel=i;SFX.pop(1.1);kit.setMarks(Object.assign({},q.give,{[i]:q.put}))};
      const L2=el('g',{},board);const yaw=rad(-22),e2=rad(40),all=q.c,mx=(Math.min(...all.map(p=>p[0]))+Math.max(...all.map(p=>p[0]))+1)/2,my=(Math.min(...all.map(p=>p[1]))+Math.max(...all.map(p=>p[1]))+1)/2;
      const prj=([x,y])=>{x-=mx;y-=my;return[300+x*84,320+y*84]};
      q.c.forEach(([c,r],i)=>{if(q.give[i]!=null)return;const pts=[[c,r],[c+1,r],[c+1,r+1],[c,r+1]].map(prj);const poly=el('polygon',{points:pts.map(p=>p.join(',')).join(' '),fill:'transparent'},L2);interact(poly,{label:`Net face ${i}`,tap:()=>pickFace(i)})})}
    else kit=boxKit(board,{cx:300,cy:320,S:84,cells:q.c,cands:q.k});
    if(q.pick)goB.style.display='none';
    decQ(qL,q.dice===2?[['w',q.put],['t','goes opposite'],['o','?']]:q.dice?[['w',1],['t','is opposite'],['o','?']]:[['t','6 squares'],['o','→'],['t','a cube'],['o','?']],false,guide);
    say(S.r===0?'A net is a flat box. Tap a dashed square to add the sixth side, then Fold it up.':q.pick?'Turned round! Which of these nets folds into a cube? Tap one, then Fold.':q.dice===2?`Opposite faces of a dice always add up to 7. Where does the ${q.put} go? Tap its square, then Fold.`:q.dice?'On a dice, 1 and 6 are opposite. Tap the square that will end up opposite the 1, then Fold.':'Which dashed square makes a cube? Tap it, then Fold.')}
  W.boxes.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
