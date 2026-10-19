
/* ---------- 2. Fans: angles add up (90° a right angle, 180° a line, 360° a whole turn, 180° in a triangle) ---------- */
const FANC=['#8fd6ff','#ff9ed2','#b8a2ff','#8ff0c8'],BLADEC=['#ffc04d','#ff9a6a'];
function fanPos(cx,cy,a,r){return[cx+r*Math.cos(rad(a)),cy-r*Math.sin(rad(a))]}
function wedgePath(cx,cy,r,a0,a1){if(a1-a0>=359.9)return`M${cx-r},${cy} A${r},${r} 0 1 0 ${cx+r},${cy} A${r},${r} 0 1 0 ${cx-r},${cy}Z`;const [x0,y0]=fanPos(cx,cy,a0,r),[x1,y1]=fanPos(cx,cy,a1,r);return`M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1-a0>180?1:0} 0 ${x1.toFixed(1)},${y1.toFixed(1)}Z`}
function wedgeLabel(parent,cx,cy,r,a0,a1,txt,col='#3a2418',sz=15){const m=(a0+a1)/2,[x,y]=fanPos(cx,cy,m,r*(a1-a0<25?.82:.62));if(a1-a0<12)return;el('text',{x,y:y+5,'text-anchor':'middle','font-size':a1-a0<25?11:sz,'font-weight':700,fill:col},parent).textContent=txt}
function rightMark(parent,cx,cy,a,s=22){const [p1x,p1y]=fanPos(cx,cy,a,s),[p2x,p2y]=fanPos(cx,cy,a+90,s),[p3x,p3y]=fanPos(cx,cy,a+45,s*1.41);el('path',{d:`M${p1x},${p1y} L${p3x},${p3y} L${p2x},${p2y}`,fill:'none',stroke:'#3a2418','stroke-width':2},parent)}
/* a paper fan: given wedges, a gap, and blades she adds from a tray.
   rack=true: her blades wait in a rack below until Close (she can still see the gap, but has to work out its size) */
function fanKit(parent,{cx,cy,R,total=180,given=[],hidden=false,trayX=535,trayY=118,pieces=[90,45,30,15,10,5],rack=[300,520],onChange}){
  const g=el('g',{},parent),base=el('g',{},g),gw=el('g',{},g),bladeL=el('g',{},g),anim=el('g',{},g),rackL=el('g',{},g),tray=el('g',{},g),G=given.reduce((a,b)=>a+b,0),gap=total-G;let blades=[],locked=false,shown=!hidden;
  if(total===180){el('line',{x1:cx-R-30,x2:cx+R+30,y1:cy,y2:cy,stroke:'#fff4e6','stroke-width':4,'stroke-linecap':'round'},base);el('path',{d:wedgePath(cx,cy,R,0,180),fill:'rgba(255,244,230,.06)'},base)}
  else el('circle',{cx,cy,r:R,fill:'rgba(255,244,230,.06)',stroke:'rgba(255,244,230,.35)','stroke-width':2},base);
  let a=0;given.forEach((v,k)=>{el('path',{d:wedgePath(cx,cy,R,a,a+v),fill:FANC[k%4],stroke:'#2a2245','stroke-width':2},gw);if(v===90)rightMark(gw,cx,cy,a);wedgeLabel(gw,cx,cy,R,a,a+v,`${v}°`);a+=v});
  if(gap>0){el('path',{d:wedgePath(cx,cy,R,G,total),fill:'rgba(255,240,160,.07)',stroke:'#fff0a0','stroke-width':2.5,'stroke-dasharray':'7 5'},base);
    if(hidden){const [qx,qy]=fanPos(cx,cy,(G+total)/2,R*.62);el('text',{x:qx,y:qy+12,'text-anchor':'middle','font-size':32,'font-weight':700,fill:'#c9a2ff'},base).textContent='?'}}
  const hub=el('circle',{cx,cy,r:6,fill:'#fff4e6'},g);
  function drawBlades(){bladeL.innerHTML='';rackL.innerHTML='';let b=G;
    if(!shown){const [rx,ry]=rack;el('text',{x:rx,y:ry-26,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},rackL).textContent=blades.length?'your blades (tap one to take it back)':'your blades wait here';
      const w=blades.length*58;blades.forEach((v,k)=>{const x=rx-w/2+k*58+29,c=el('g',{transform:`translate(${x},${ry})`},rackL);el('path',{d:wedgePath(0,12,34,90-v/2,90+v/2),fill:BLADEC[k%2],stroke:'#2a2245','stroke-width':1.5},c);
        el('text',{y:30,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},c).textContent=`${v}°`;interact(c,{label:`Blade ${v}°: take it back`,tap:()=>take(k)})});return}
    blades.forEach((v,k)=>{const over=b+v>total+.01,w=el('path',{d:wedgePath(cx,cy,R-4,b,b+v),fill:over?'#ff5a7a':BLADEC[k%2],stroke:'#2a2245','stroke-width':2,opacity:.95},bladeL);
      if(v===90&&!over)rightMark(bladeL,cx,cy,b);wedgeLabel(bladeL,cx,cy,R,b,b+v,`${v}°`);if(!hidden)interact(w,{label:`Blade ${v}°: take it back`,tap:()=>take(k)});b+=v})}
  function take(k){if(locked)return;blades.splice(k,1);SFX.pop(.8);drawBlades();onChange&&onChange(blades)}
  pieces.forEach((v,k)=>{const y=trayY+k*62,c=el('g',{transform:`translate(${trayX},${y})`},tray);el('rect',{x:-36,y:-26,width:72,height:56,rx:12,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2},c);
    el('path',{d:wedgePath(-10,16,28,90-v/2,90+v/2),fill:'#ffc04d',stroke:'#7a4a2e','stroke-width':1.5},c);el('text',{x:20,y:10,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff4e6'},c).textContent=`${v}°`;
    interact(c,{label:`Add a ${v}° blade`,tap:()=>{if(locked)return;if(blades.length>=8){say('That’s a lot of blades! Take some back.');return}blades.push(v);SFX.pop(1+v/200);drawBlades();onChange&&onChange(blades)}})});
  if(pieces.length)el('text',{x:trayX,y:trayY-40,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},tray).textContent='blades';
  drawBlades();
  /* every wedge in the fan, for the closing animation */
  const segs=()=>{const out=[];let b=0;given.forEach((v,k)=>{out.push([b,b+v,FANC[k%4]]);b+=v});blades.forEach((v,k)=>{out.push([b,b+v,BLADEC[k%2]]);b+=v});return out};
  return{g,gap,G,sum:()=>blades.reduce((a,b)=>a+b,0),blades:()=>blades,lock:b=>{locked=b;tray.style.opacity=b?.4:1},
    reveal(done){shown=true;drawBlades();SFX.whoosh();popIn(bladeL,.6);later(300,()=>done&&done())},
    clear(){blades=[];drawBlades()},
    /* the fan folds shut into a stick, then springs open again */
    close(done){const S0=segs();gw.style.display='none';bladeL.style.display='none';SFX.swish();
      const draw=s=>{anim.innerHTML='';S0.forEach(([a0,a1,c])=>{el('path',{d:wedgePath(cx,cy,R,a0*s,Math.max(a0*s+1.2,a1*s)),fill:c,stroke:'#2a2245','stroke-width':2},anim)})};
      tween(800,(t)=>draw(1-t*.97),()=>{SFX.snap(.8);const tas=el('g',{},anim),[tx,ty]=fanPos(cx,cy,2,R);el('path',{d:`M${cx},${cy} l-6,16`,stroke:'#c9a24a','stroke-width':3},tas);el('circle',{cx:cx-7,cy:cy+20,r:6,fill:'#ff5a7a'},tas);
        later(600,()=>{SFX.unfold&&SFX.unfold();tween(700,(t)=>draw(.03+t*.97),()=>{anim.innerHTML='';gw.style.display='';bladeL.style.display='';done&&done()},ease.back)})},ease.inOut)}}}
/* a shape whose corners tear off and fly into the fan */
function tearShape(parent,pts,cols){const g=el('g',{},parent),n=pts.length,corners=[];
  el('path',{d:'M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' L')+'Z',fill:'rgba(255,244,230,.1)',stroke:'#fff4e6','stroke-width':3,'stroke-linejoin':'round'},g);
  pts.forEach((P,i)=>{const A=pts[(i+n-1)%n],B=pts[(i+1)%n],ang=Q=>((Math.atan2(P[1]-Q[1],Q[0]-P[0])*180/Math.PI)+360)%360;let s=ang(B),e=ang(A);if(e<s)e+=360;
    if(e-s>180){const t=s;s=e-360;e=t}const size=Math.round(e-s),c=el('g',{},g);el('path',{d:wedgePath(0,0,34,s,e),fill:cols[i%cols.length],stroke:'#2a2245','stroke-width':1.5},c);const deco=el('g',{},c);
    if(size===90)rightMark(deco,0,0,s,16);else{const [lx,ly]=fanPos(0,0,(s+e)/2,50);el('text',{x:lx,y:ly+5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},deco).textContent=`${size}°`}
    c.setAttribute('transform',`translate(${P[0]},${P[1]})`);corners.push({c,P,s,e,size,col:cols[i%cols.length]})});
  return{g,corners,
    /* fly the corners to the fan centre, side by side starting at angle 0 */
    fly(cx,cy,done,R=120){let at=0;const k1=R/34,segs=[];corners.forEach((k,i)=>{const start=at,rot=start-k.s;at+=k.size;segs.push([start,at,k.size]);k.c.lastChild.remove();later(i*500,()=>{SFX.swish();tween(700,(t)=>k.c.setAttribute('transform',`translate(${lerp(k.P[0],cx,t).toFixed(1)},${lerp(k.P[1],cy,t).toFixed(1)}) rotate(${(-rot*t).toFixed(1)}) scale(${(1+t*(k1-1)).toFixed(2)})`),()=>SFX.plink(i+3),ease.inOut)})});
      later(corners.length*500+800,()=>{segs.forEach(([a0,a1,sz])=>{if(sz===90)rightMark(g,cx,cy,a0,22);wedgeLabel(g,cx,cy,R,a0,a1,`${sz}°`)});done&&done(at)})}}}

W.fans={scene:'festival',
notes:`<p>Angles add up. It starts with the facts, so nothing comes out of nowhere: four right angles (90°) fill a whole circle, so a whole turn is 360°; two right angles make a straight line, 180°. Then she predicts what the four corners of a rectangle make when they're torn off and pushed together (360°), and the three corners of a triangle (180°: a straight line). Each fact goes up on the fan maker's board and stays there.</p>
<p>Then the gaps. Some of the fan is made; she fills the gap with blades from the tray on the right and presses Close. In these rounds her blades wait in a rack below the fan, so she can see the gap but has to work out its size from the facts on the board (180° − 130° = 50°). Right, and the fan folds shut and springs open again; wrong, and the blades fly in to show the mismatch, then a new fan. Rounds: fill a circle with right angles; fill a line; rectangle corners; triangle corners; a 130° line; a triangle with 75° and 45°; round a point with 90° and 150°.</p>`,
mount(root){
  const R=[{k:'fill',T:360},{k:'fill',T:180},{k:'tear',shape:'rect',T:360,p:[0,1]},{k:'tear',shape:'tri',T:180,p:[0,1,2]},
    {T:180,hid:1,p:[[130],[110],[155]]},{T:180,tri:1,hid:1,p:[[75,45],[50,70],[80,40]]},{T:360,hid:1,p:[[90,150],[120,90],[100,110]]}];
  const FACTS=[['right','right angle','90°'],['turn','whole turn','360°'],['line','straight line','180°'],['tri','triangle','180°']];
  const S={r:0,busy:false,won:false,pi:{},pred:null};
  const board=el('g',{},root),facts=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,shape=null,cardL=null;const guide=shellyGuide(ui);
  const st=navStone({label:'Next fan',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this fan again',onTap:()=>load()});
  const goB=decGo(ui,440,520,'Close the fan',close,'Close');
  const Q=()=>{const q=R[S.r];return Object.assign({},q,{g:q.p?q.p[(S.pi[S.r]||0)%q.p.length]:[]})};
  /* the fan maker's board: facts learned so far */
  function drawFacts(n){facts.innerHTML='';if(!n)return;el('rect',{x:10,y:94,width:122,height:22+n*34,rx:12,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2,opacity:.95},facts);
    el('text',{x:71,y:110,'text-anchor':'middle','font-size':11.5,'font-weight':700,fill:'#fff0a0'},facts).textContent='angle facts';
    FACTS.slice(0,n).forEach(([k,t,v],i)=>{const y=134+i*34,ic=el('g',{transform:`translate(32,${y})`},facts);
      if(k==='turn')el('circle',{r:11,fill:'#8fd6ff',stroke:'#fff4e6','stroke-width':1.5},ic);else if(k==='line'){el('path',{d:wedgePath(0,5,12,0,180),fill:'#ff9ed2'},ic);el('line',{x1:-14,x2:14,y1:5,y2:5,stroke:'#fff4e6','stroke-width':2},ic)}
      else if(k==='right'){el('path',{d:wedgePath(-8,8,18,0,90),fill:'#ffc04d'},ic);rightMark(ic,-8,8,0,8)}else el('path',{d:'M-12,8 L12,8 L-2,-10Z',fill:'#8ff0c8',stroke:'#fff4e6','stroke-width':1.5},ic);
      el('text',{x:50,y:y-3,'font-size':11,'font-weight':600,fill:'#d8c6e4'},facts).textContent=t;el('text',{x:50,y:y+12,'font-size':14,'font-weight':700,fill:'#fff4e6'},facts).textContent=v})}
  const factsFor=r=>r<=0?1:r===1?2:r<=3?3:4;
  const parts=(q,done,gap)=>q.k==='fill'?[...(done?Array(q.T/90).fill(0).flatMap((_,k)=>k?[['o','+'],['w','90°']]:[['w','90°']]):[['o','?']]),['o','='],['w',`${q.T}°`]]
    :q.k==='tear'?[['t',q.shape==='rect'?'4 corners of a rectangle':'3 corners of a triangle'],['o','='],done?['w',`${q.T}°`]:['o','?']]
    :[...q.g.flatMap((v,k)=>k?[['o','+'],['w',`${v}°`]]:[['w',`${v}°`]]),['o','+'],done?['w',`${gap}°`]:['o','?'],['o','='],['w',`${q.T}°`]];
  function close(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='tear'){if(S.pred==null){say('Tap the card for what you think the corners will make, then Go.');return}S.busy=true;goB.style.display='none';
      shape.fly(...(q.T===180?[300,440]:[300,372]),tot=>{const ok=S.pred===tot;if(ok)win(q,0);else{SFX.wrong();say(`They made ${tot}°, not ${S.pred}°! ${q.shape==='rect'?'Four right angles: 4 × 90° = 360°, a whole turn.':'The three corners make a straight line: 180°.'} Will a different ${q.shape==='rect'?'rectangle':'triangle'} do the same? Predict again…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3600,load)}},q.T===180?138:102);return}
    const sum=kit.sum();if(!sum){say('Tap blades in the tray on the right to add them.');return}
    S.busy=true;kit.lock(true);goB.style.display='none';
    const check=()=>{if(sum===kit.gap)kit.close(()=>win(q,kit.gap));else{SFX.wrong();shake(3);
      say(q.k==='fill'?`${sum/90} right angles make ${sum}°: ${sum>kit.gap?'too much':'not enough'} for ${q.T===360?'a whole circle':'a straight line'}. Look, then try again…`:q.hid?`Your blades make ${sum}°, but the gap is ${q.T}° − ${kit.G}° = ${kit.gap}°. Here's a new fan…`:sum>kit.gap?`Your blades make ${sum}°, but the gap is only ${kit.gap}°: ${sum-kit.gap}° pokes past the ${q.T===180?'line':'circle'}. Take a blade back.`:'Not enough: there’s still a gap. Add another blade.');
      if(q.hid||q.k==='fill'){S.pi[S.r]=(S.pi[S.r]||0)+1;later(3400,load)}else later(900,()=>{kit.lock(false);S.busy=false;goB.style.display=''})}};
    (q.hid||q.k==='fill')?kit.reveal(()=>later(400,check)):check()}
  function win(q,gap){S.won=true;roundWon(S.r);SFX.fanfare();decQ(qL,parts(q,true,gap),true,guide);drawFacts(factsFor(S.r+1));
    say(q.k==='fill'?(q.T===360?'Four right angles fill the circle: 4 × 90° = 360°. A whole turn is 360°!':'Two right angles make a straight line: 2 × 90° = 180°. A straight line is half a turn.')
      :q.k==='tear'?(q.shape==='rect'?'A rectangle’s corners are all right angles: 4 × 90° = 360°, a whole turn!':'Any triangle’s three corners make a straight line: they add up to 180°!')
      :q.tri?`${q.g.join('° + ')}° + ${gap}° = 180°: a triangle's angles add up to 180°.`:q.T===180?`${kit.G}° + ${gap}° = 180°: angles on a straight line add up to 180°.`:`${q.g.join('° + ')}° + ${gap}° = 360°: all the way round a point is 360°.`);
    burst(300,300,{n:18});if(S.r>=3)unlock('angsum');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';if(cardL)cardL.remove();cardL=null;const q=Q();Object.assign(S,{busy:false,won:false,pred:null});st.ready(false);navDots(R.length,S.r);goB.style.display='';kit=null;shape=null;
    drawFacts(factsFor(S.r));goB.querySelector('text').textContent=q.k==='tear'?'Go':'Close';
    if(q.k==='tear'){const C=q.T===180?[300,440]:[300,372];kit=fanKit(board,{cx:C[0],cy:C[1],R:q.T===180?140:104,total:q.T,pieces:[]});
      const v=(S.pi[S.r]||0);
      const pts=q.shape==='rect'?[[[170,130],[430,130],[430,220],[170,220]],[[200,120],[400,120],[400,240],[200,240]]][v%2]
        :[[[160,270],[420,270],[230,120]],[[170,280],[440,280],[380,130]],[[200,270],[400,270],[300,110]]][v%3];
      shape=tearShape(board,pts,FANC);
      const opts=q.shape==='rect'?[180,270,360]:[90,180,360];cardL=el('g',{},ui);
      opts.forEach((o,k)=>{const c=el('g',{transform:`translate(${170+k*120},526)`},cardL);el('rect',{x:-48,y:-26,width:96,height:52,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('text',{y:8,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418'},c).textContent=`${o}°`;
        interact(c,{label:`Prediction ${o}°`,tap:()=>{if(S.busy)return;S.pred=o;SFX.pop(1.1);[...cardL.children].forEach(x=>{x.style.opacity=x===c?1:.55;x.firstChild.setAttribute('stroke',x===c?'#ffc04d':'#c9a77a')})}})});
      goB.setAttribute('transform','translate(540,500)')}
    else{goB.setAttribute('transform','translate(440,520)');const C=q.tri?[270,440,140]:q.T===360?[280,300,150]:[270,400,170];
      kit=fanKit(board,{cx:C[0],cy:C[1],R:C[2],total:q.T,given:q.g,hidden:!!q.hid||q.k==='fill',pieces:q.k==='fill'?[90]:[90,45,30,15,10,5],rack:[270,q.T===360?520:q.tri?512:472]});
      if(q.tri){const [a,b]=q.g,A=[200,262],L=130,ta=rad(a),tb=rad(b),t=L*Math.sin(tb)/Math.sin(ta+tb),Cp=[A[0]+t*Math.cos(ta),A[1]-t*Math.sin(ta)],B=[A[0]+L,A[1]];
        const tg=el('g',{},board);el('path',{d:`M${A} L${B} L${Cp}Z`,fill:'rgba(255,244,230,.1)',stroke:'#fff4e6','stroke-width':3,'stroke-linejoin':'round'},tg);
        [[A,0,a,FANC[0],`${a}°`],[B,180-b,180,FANC[1],`${b}°`],[Cp,180+a,360-b,'#e8dcc8','?']].forEach(([P,s,e,c,txt])=>{el('path',{d:wedgePath(P[0],P[1],30,s,e),fill:c,stroke:'#2a2245','stroke-width':1.5},tg);const [lx,ly]=fanPos(P[0],P[1],(s+e)/2,46);el('text',{x:lx,y:ly+5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:txt==='?'?'#c9a2ff':'#fff4e6'},tg).textContent=txt})}}
    decQ(qL,parts(q),false,guide);
    say(S.r===0?'How many right angles (90°) fill a whole circle? Put that many 90° blades in your rack, then Close.':S.r===1?'How many right angles make a straight line? Rack them up, then Close.'
      :q.k==='tear'?(q.shape==='rect'?'Tear the 4 corners off this rectangle and push them together. What will they make? Pick, then Go.':'Tear the 3 corners off this triangle and push them together. What will they make? Pick, then Go.')
      :q.tri?'A triangle’s angles add up to 180°. Two are 75° and 45°: what’s the third? Pick blades, then Close.'.replace('75° and 45°',`${q.g[0]}° and ${q.g[1]}°`)
      :q.T===360?'All the way round is 360°. Work out the gap, pick blades, then Close.':'A straight line is 180°. Work out the gap, pick blades, then Close.')}
  S.r=resumeAt(R.length);load();
}};
