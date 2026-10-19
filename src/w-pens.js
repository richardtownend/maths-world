
/* ---------- 5. Pens: perimeter (the fence) and area (the grass) are different things ---------- */
function sheep(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  [[-8,6],[6,6]].forEach(([a,b])=>el('rect',{x:a-1.5,y:b,width:3,height:7,fill:'#3a2a3a'},g));
  [[-10,0],[-4,-5],[4,-5],[10,0],[0,2],[-6,3],[6,3]].forEach(([a,b])=>el('circle',{cx:a,cy:b,r:6.5,fill:'#f4f0fa'},g));
  el('ellipse',{cx:-15,cy:-3,rx:5,ry:6,fill:'#3a2a3a'},g);el('circle',{cx:-16.5,cy:-4.5,r:1.2,fill:'#fff'},g);return g}
/* a field of fence posts 1 m apart; the pen's bottom-left corner is fixed and she drags the top-right one */
function penKit(parent,{x0,y0,cs,maxW,maxH,w=2,h=1,fixed=false,sides=null,label='Pen corner: drag it to make the pen',onChange}){
  const g=el('g',{},parent),bg=el('g',{},g),grassL=el('g',{},g),fenceL=el('g',{},g),labL=el('g',{},g),hitL=el('g',{},g),BY=y0+maxH*cs;let locked=false;
  el('rect',{x:x0-16,y:y0-16,width:maxW*cs+32,height:maxH*cs+32,rx:14,fill:'#2e4520',opacity:.85},bg);
  for(let i=0;i<=maxW;i++)for(let j=0;j<=maxH;j++)el('circle',{cx:x0+i*cs,cy:y0+j*cs,r:3,fill:'#a8885a',opacity:.6},bg);
  const corner=()=>[x0+w*cs,BY-h*cs];
  const kn=el('g',{},hitL);el('circle',{r:16,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2.5},kn);el('path',{d:'M-6,6 L6,-6 M1,-6 h5 v5',stroke:'#7a4a2e','stroke-width':2.4,fill:'none','stroke-linecap':'round'},kn);
  function draw(){grassL.innerHTML='';fenceL.innerHTML='';labL.innerHTML='';
    for(let i=0;i<w;i++)for(let j=0;j<h;j++){const x=x0+i*cs,y=BY-(j+1)*cs;el('rect',{x:x+1.5,y:y+1.5,width:cs-3,height:cs-3,rx:4,fill:(i+j)%2?'#5aa04a':'#64ac52'},grassL);el('path',{d:`M${x+cs*.3},${y+cs*.7} l3,-8 l3,8 M${x+cs*.6},${y+cs*.6} l2,-6 l2,6`,stroke:'#86c870','stroke-width':1.5,fill:'none'},grassL)}
    const n=Math.min(3,Math.max(1,Math.floor(w*h/4)));for(let k=0;k<n;k++){const sx=x0+cs*(.6+((k*1.7)%Math.max(.2,w-1.2))),sy=BY-cs*(.5+((k*1.3)%Math.max(.2,h-.8)));sheep(grassL,sx,sy,Math.min(1,cs/40))}
    const [cx,cy]=corner(),rail=(a,b,c,d)=>{el('line',{x1:a,y1:b,x2:c,y2:d,stroke:'#8a5a2a','stroke-width':4,'stroke-linecap':'round'},fenceL);el('line',{x1:a,y1:b-6,x2:c,y2:d-6,stroke:'#a8743a','stroke-width':2.5,'stroke-linecap':'round'},fenceL)};
    const on=k=>!sides||sides.has(k),post=(x,y)=>el('rect',{x:x-3,y:y-10,width:6,height:14,rx:2,fill:'#6a4420'},fenceL);
    if(sides)[[x0,BY,cx,BY],[x0,cy,cx,cy],[x0,BY,x0,cy],[cx,BY,cx,cy]].forEach(([a,b,c,d])=>el('line',{x1:a,y1:b,x2:c,y2:d,stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'6 6',opacity:.6},fenceL));
    if(on('b'))rail(x0,BY,cx,BY);if(on('t'))rail(x0,cy,cx,cy);if(on('l'))rail(x0,BY,x0,cy);if(on('r'))rail(cx,BY,cx,cy);
    for(let i=0;i<=w;i++){if(on('b')||(i===0&&on('l'))||(i===w&&on('r')))post(x0+i*cs,BY);if(on('t')||(i===0&&on('l'))||(i===w&&on('r')))post(x0+i*cs,cy)}
    for(let j=1;j<h;j++){if(on('l'))post(x0,BY-j*cs);if(on('r'))post(cx,BY-j*cs)}
    kn.setAttribute('transform',`translate(${cx},${cy})`);kn.style.display=fixed?'none':''}
  const set=(nw,nh)=>{nw=clamp(nw,1,maxW);nh=clamp(nh,1,maxH);if(nw===w&&nh===h)return;w=nw;h=nh;SFX.tick(w+h);draw();onChange&&onChange(w,h)};
  const hit=el('rect',{x:x0-20,y:y0-20,width:maxW*cs+40,height:maxH*cs+40,fill:'transparent'},hitL);hitL.insertBefore(hit,kn);
  const at=p=>[Math.round((p.x-x0)/cs),Math.round((BY-p.y)/cs)];
  if(!fixed)interact(hitL,{label,down:p=>{if(!locked)set(...at(p));return{}},move:p=>{if(!locked)set(...at(p))},tap:p=>{if(locked)return;if(!p){set(w+1>maxW?1:w+1,h);return}set(...at(p))}});
  hitL.addEventListener('keydown',e=>{if(locked)return;const K={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(K){e.preventDefault();set(w+K[0],h+K[1])}});
  draw();
  return{g,get:()=>[w,h],lock:b=>{locked=b;kn.style.opacity=b?.3:1},clear(){labL.innerHTML=''},redraw:()=>draw(),corner,BY,
    /* walk the fence, counting the metres */
    walk(done){const [cx,cy]=corner(),pts=[];for(let i=0;i<w;i++)pts.push([x0+(i+1)*cs,BY]);for(let j=0;j<h;j++)pts.push([cx,BY-(j+1)*cs]);for(let i=0;i<w;i++)pts.push([cx-(i+1)*cs,cy]);for(let j=0;j<h;j++)pts.push([x0,cy+(j+1)*cs]);
      const dog=el('circle',{cx:x0,cy:BY,r:7,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2},labL),step=Math.max(90,Math.min(220,2600/pts.length));
      pts.forEach(([x,y],k)=>later(k*step,()=>{dog.setAttribute('cx',x);dog.setAttribute('cy',y);SFX.tick(k%10);const t=el('text',{x:x+(x===x0?-12:x===cx?12:0),y:y+(y===BY?22:y===cy?-12:5),'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff0a0'},labL);t.textContent=k+1}));
      later(pts.length*step+300,()=>{dog.remove();done&&done(pts.length)})},
    sides(){labL.innerHTML='';const [cx,cy]=corner();[[ (x0+cx)/2,BY+30,`${w} m`],[(x0+cx)/2,cy-16,`${w} m`],[x0-26,(BY+cy)/2+5,`${h} m`],[cx+26,(BY+cy)/2+5,`${h} m`]].forEach(([x,y,t])=>{const b=el('g',{},labL);el('rect',{x:x-24,y:y-14,width:48,height:22,rx:7,fill:'#fff4e6'},b);el('text',{x,y:y+3,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},b).textContent=t});
      if(w*cs<72||h*cs<30)return;const b=el('g',{},labL);el('rect',{x:(x0+cx)/2-34,y:(BY+cy)/2-14,width:68,height:26,rx:8,fill:'#2e4520',opacity:.85},b);el('text',{x:(x0+cx)/2,y:(BY+cy)/2+5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},b).textContent=`${w*h} sq`}}}

W.pens={scene:'patch',
notes:`<p>Perimeter and area, with a sheep pen. Fence posts are 1 m apart. It starts with the idea itself: a pen is already marked out, and she taps each side to build the fence; each side shows its length and the box adds them up: 3 + 2 + 3 + 2 = 10 m. That's the perimeter, the distance all the way round. Next time she adds it up herself and picks the answer; the other cards are the grass inside (the area) and half the way round.</p>
<p>Then she makes pens: drag the gold corner, press Fence, and a dog walks round counting the metres. "Use exactly 12 m of fence." After that it becomes an investigation rather than a guess: find every pen 12 m of fence can make (1 × 5, 2 × 4, 3 × 3; a pen turned round counts as the same). Each one goes in the notebook with its grass, and once she has them all she picks the one with the most grass. The same for 14 m, then turned round: every pen that holds 12 squares of grass, and which needs the least fence. The pattern to spot: the squarer the pen, the more grass for the fence.</p>`,
mount(root){
  const R=[{k:'walk',p:[[3,2]]},{k:'walkq',p:[[4,3],[5,2],[6,1]]},{k:'p',P:12},{k:'all',P:12},{k:'all',P:14},{k:'allA',A:12}],MW=9,MH=7,CS=36,X0=64,Y0=136;let geo=null;
  const S={r:0,busy:false,won:false,pi:{},found:[],sides:null};
  const board=el('g',{},root),book=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,cardL=null;const guide=shellyGuide(ui);
  const farmer=creature(ui,{x:34,y:470,r:22,i:7,label:'The farmer',hat:'beanie'});
  const st=navStone({label:'Next pen',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this pen again',onTap:()=>load()});
  const goB=decGo(ui,540,480,'Fence it: walk round the fence',fence,'Fence');
  const Q=()=>{const q=R[S.r];return q.p?Object.assign({},q,{w:q.p[(S.pi[S.r]||0)%q.p.length][0],h:q.p[(S.pi[S.r]||0)%q.p.length][1]}):q};
  /* every pen that fits the field, a pen turned round counting as the same */
  const allPens=q=>{const out=[];for(let a=1;a<=30;a++)for(let b=a;b<=30;b++){if(q.k==='all'?2*(a+b)===q.P:a*b===q.A)out.push([a,b])}return out};
  const fitsField=([a,b])=>a<=MH&&b<=MW;
  const key=(w,h)=>`${Math.min(w,h)}x${Math.max(w,h)}`;
  function drawBook(q){book.innerHTML='';const T=allPens(q),done=S.found.length>=T.length;
    el('rect',{x:412,y:118,width:180,height:56+Math.max(T.length,1)*54,rx:12,fill:'#fff4e6',stroke:'#8a6a3a','stroke-width':3},book);
    el('text',{x:504,y:140,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},book).textContent='notebook';
    el('text',{x:504,y:158,'text-anchor':'middle','font-size':11.5,fill:'#7a5a44'},book).textContent=`${S.found.length} of ${T.length} pens found`;
    S.found.forEach(([a,b],i)=>{const y=172+i*54,r=el('g',{},book);el('rect',{x:420,y,width:164,height:46,rx:9,fill:done?'#e8f4d8':'#f4ead8',stroke:done?'#5aa04a':'#c9a77a','stroke-width':done?2.5:1.5},r);
      const s=b>9?4:6;el('rect',{x:428,y:y+23-a*s/2,width:b*s,height:a*s,fill:'#64ac52',stroke:'#8a5a2a','stroke-width':1.5},r);
      el('text',{x:494,y:y+20,'font-size':15,'font-weight':700,fill:'#3a2418'},r).textContent=`${a} × ${b}`;
      el('text',{x:494,y:y+38,'font-size':13,'font-weight':600,fill:'#5a3a22'},r).textContent=q.k==='all'?`${a*b} squares`:`${2*(a+b)} m fence`;if(!fitsField([a,b]))el('text',{x:428,y:y+41,'font-size':9.5,'font-weight':600,fill:'#9a6a4a'},r).textContent='too long!';
      if(done)interact(r,{label:`Notebook pen ${a} by ${b}`,tap:()=>pickBook(q,a,b,r)})})}
  function pickBook(q,a,b,r){if(S.won)return;const T=allPens(q),best=q.k==='all'?Math.max(...T.map(([x,y])=>x*y)):Math.min(...T.map(([x,y])=>2*(x+y))),v=q.k==='all'?a*b:2*(a+b);
    if(v===best){win(q,a,b,q.k==='all'?`${a} × ${b} holds the most grass: ${a*b} squares for ${q.P} m of fence. The squarer the pen, the more grass!`:`${a} × ${b} needs only ${v} m of fence for ${q.A} squares. Squarer pens need less fence!`)}
    else{SFX.wrong();r.style.opacity=.4;say(q.k==='all'?`That one has ${v} squares. Another pen has more!`:`That one needs ${v} m. Another pen needs less!`)}}
  const sumTxt=(q)=>[...S.sides].map(k=>k==='b'||k==='t'?q.w:q.h).join(' + ');
  const parts=(q,done,w,h)=>(q.k==='walk'||q.k==='walkq')&&!(S.sides&&S.sides.size&&(q.k==='walk'||done))?[['t','Perimeter'],['o','='],['o','?']]:q.k==='walk'||q.k==='walkq'?[['t','Perimeter'],['o','='],...(S.sides&&S.sides.size?[...S.sides].flatMap((k,i)=>{const v=k==='b'||k==='t'?w:h;return i?[['o','+'],['w',v]]:[['w',v]]}):[]),...(done?[['o','='],['w',`${2*(w+h)} m`]]:S.sides&&S.sides.size===4&&q.k==='walk'?[]:[['o','='],['o','?']])]
    :q.k==='p'?(done?[['t','Perimeter'],['o','='],['w',`${w} + ${h} + ${w} + ${h}`],['o','='],['w',`${q.P} m`]]:[['t','Perimeter'],['o','='],['w',`${q.P} m`]])
    :q.k==='all'?[['w',`${q.P} m`],['t','of fence: most grass'],['o','='],done?['w',`${w} × ${h}`]:['o','?']]
    :[['w',`${q.A}`],['t','squares: least fence'],['o','='],done?['w',`${2*(w+h)} m`]:['o','?']];
  function tapSide(k){const q=Q();if(S.busy||S.won||S.sides.has(k))return;S.sides.add(k);SFX.thud&&SFX.thud();SFX.plink(S.sides.size+2);kit.redraw();
    const [cx,cy]=kit.corner(),BY=kit.BY,x0=geo.x0,v=k==='b'||k==='t'?q.w:q.h,pos={b:[(x0+cx)/2,BY+32],t:[(x0+cx)/2,cy-20],l:[x0-32,(BY+cy)/2+5],r:[cx+32,(BY+cy)/2+5]}[k];
    if(q.k==='walkq'){SFX.pop(1);if(S.sides.size<4){say('Keep going: tap the next side.');return}}
    else{const b=el('g',{},sideLab);el('rect',{x:pos[0]-24,y:pos[1]-14,width:48,height:22,rx:7,fill:'#fff4e6'},b);el('text',{x:pos[0],y:pos[1]+3,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},b).textContent=`${v} m`;popIn(b,.5);
    decQ(qL,parts(q,false,q.w,q.h),false,guide);
    if(S.sides.size<4){say(`${v} m. Keep going: tap the next side.`);return}}
    if(q.k==='walk')later(500,()=>win(q,q.w,q.h,`${sumTxt(q)} = ${2*(q.w+q.h)} m all the way round. That's the perimeter! The grass inside is the area: ${q.w*q.h} squares.`));
    else{say('Count the metres along each side (posts are 1 m apart), then add them. How far all the way round?');const P=2*(q.w+q.h),vals=[P,q.w*q.h,q.w+q.h].filter((v,i,a)=>a.indexOf(v)===i);while(vals.length<3)vals.push(P+2);vals.sort(()=>Math.random()-.5);cardL=el('g',{},ui);
      vals.forEach((v,i)=>{const c=el('g',{transform:`translate(${150+i*120},530)`},cardL);el('rect',{x:-48,y:-26,width:96,height:52,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('text',{y:8,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418'},c).textContent=`${v} m`;
        interact(c,{label:`Perimeter card ${v}`,tap:()=>{if(S.won)return;S.won=true;if(v===P){cardL.remove();cardL=null;S.sides=new Set(['b','r','t','l']);kit.sides();win(q,q.w,q.h,`${sumTxt(q)} = ${P} m all the way round: the perimeter.`)}else{SFX.wrong();c.style.opacity=.35;
          say(v===q.w*q.h?`${v} is the grass inside (the area). Perimeter is the fence all the way round. A new pen…`:`${v} m is only half way round! Add all four sides. A new pen…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3200,load)}}})})}}
  let sideLab=null;
  function fence(){if(S.busy||S.won)return;const q=Q();if(q.k==='walk'||q.k==='walkq'){say('Tap each side of the pen to build its fence.');return}
    const [w,h]=kit.get(),per=2*(w+h),A=w*h;S.busy=true;kit.lock(true);goB.style.display='none';
    kit.walk(()=>{kit.sides();
      if(q.k==='p'){if(per===q.P){win(q,w,h,`${w} + ${h} + ${w} + ${h} = ${q.P} m: all the way round is the perimeter.`);return}again(A===q.P?`That pen holds ${A} squares of grass, but its fence is ${per} m, not ${q.P} m. Grass is inside; fence goes round.`:`That pen needs ${per} m of fence, not ${q.P} m.`);return}
      const T=allPens(q),fits=q.k==='all'?per===q.P:A===q.A;
      if(!fits){again(q.k==='all'?`That pen needs ${per} m of fence, not ${q.P} m: not one for the notebook.`:`That pen holds ${A} squares, not ${q.A}: not one for the notebook.`);return}
      const k=key(w,h);if(S.found.some(([a,b])=>key(a,b)===k)){again('That one’s already in the notebook (turned round is the same pen). Try a different shape.');return}
      S.found.push([Math.min(w,h),Math.max(w,h)]);S.found.sort((a,b)=>a[0]-b[0]);SFX.chime();drawBook(q);
      if(S.found.length>=T.length){kit.lock(true);say(q.k==='all'?'You found every pen! Now tap the one in the notebook with the most grass.':'You found every pen! Now tap the one that needs the least fence.');S.busy=false}
      else again(`In the notebook: ${Math.min(w,h)} × ${Math.max(w,h)}${q.k==='all'?` holds ${A} squares`:` needs ${per} m`}. ${S.found.length} of ${T.length} found: make another!`)})}
  function again(msg){SFX.wrong();farmer.mood('oh');say(msg);later(2600,()=>{kit.lock(false);farmer.mood('');S.busy=false;goB.style.display='';kit.clear()})}
  function win(q,w,h,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.crunch();farmer.mood('happy');farmer.hop(14);decQ(qL,parts(q,true,w,h),true,guide);say(msg);burst(260,280,{n:14,cols:['#f4f0fa','#8ff0c8','#fff0a0']});
    if(S.r>=3)unlock('perim');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';book.innerHTML='';if(cardL)cardL.remove();cardL=null;const q=Q();Object.assign(S,{busy:false,won:false,found:[]});st.ready(false);navDots(R.length,S.r);farmer.mood('');
    const walkR=q.k==='walk'||q.k==='walkq';S.sides=walkR?new Set():null;goB.style.display=walkR?'none':'';
    geo=walkR?{x0:110,y0:150,cs:52,maxW:6,maxH:4}:{x0:X0,y0:Y0,cs:CS,maxW:MW,maxH:MH};kit=penKit(board,Object.assign({w:walkR?q.w:2,h:walkR?q.h:1,fixed:walkR,sides:S.sides},geo));sideLab=el('g',{},board);
    if(walkR){const [cx,cy]=kit.corner(),BY=kit.BY;[['b',geo.x0,BY-16,cx-geo.x0,32],['t',geo.x0,cy-16,cx-geo.x0,32],['l',geo.x0-16,cy,32,BY-cy],['r',cx-16,cy,32,BY-cy]].forEach(([k,x,y,w2,h2])=>{const r=el('rect',{x,y,width:w2,height:h2,fill:'transparent'},board);interact(r,{label:`Fence side ${k}`,tap:()=>tapSide(k)})})}
    if(q.k==='all'||q.k==='allA'){S.found=allPens(q).filter(p=>!fitsField(p));drawBook(q)}
    decQ(qL,parts(q,false,q.w,q.h),false,guide);
    say(q.k==='walk'?'The fence goes all the way round the pen. Tap each side to build it: posts are 1 m apart.':q.k==='walkq'?'Fence this pen too: tap each side. Then work out the perimeter.'
      :q.k==='p'?'Your turn: make a pen with exactly 12 m of fence. Drag the gold corner, then Fence.'
      :q.k==='all'?`Find every pen you can make with ${q.P} m of fence. Each one goes in the notebook.`:`Turned round! Find every pen that holds ${q.A} squares of grass. 1 × 12 is too long for this field, so it's in the notebook already.`)}
  S.r=resumeAt(R.length);load();
}};
