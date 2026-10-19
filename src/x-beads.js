/* ---------- 1. Beads: a ratio is a group that repeats ("for every 2 red there are 3 blue") ---------- */
const BRED=PAINT.red,BBLUE=PAINT.blue,bcol=c=>c==='r'?BRED:BBLUE;
/* lay beads along the necklace rows, a little knot between groups; a group never splits across rows */
function beadLayout(groups,{x0=50,x1=452,y0=272,dy=72,step=30,gap=14}={}){const pos=[],knots=[];let x=x0,row=0;
  groups.forEach((g,gi)=>{const w=g.length*step;if(x+w-step>x1&&x>x0){x=x0;row++}
    g.forEach(c=>{pos.push({c,x,y:y0+row*dy,gi});x+=step});if(gi<groups.length-1){knots.push([x-step/2+gap/2-1,y0+row*dy]);x+=gap}});
  return{pos,knots,rows:row+1}}
function beadJar(parent,x,y,col,label,onTap){const g=el('g',{transform:`translate(${x},${y})`},parent);
  el('rect',{x:-34,y:-30,width:68,height:62,rx:14,fill:'rgba(255,244,230,.12)',stroke:'rgba(255,244,230,.5)','stroke-width':2.5},g);el('rect',{x:-26,y:-38,width:52,height:10,rx:4,fill:'#c9a24a'},g);
  [[-14,14],[0,16],[14,14],[-8,1],[8,2],[0,-12],[-16,-6],[16,-8]].forEach(([a,b])=>bead(g,a,b,col,8));interact(g,{label,tap:onTap});return g}

W.beads={scene:'shop',
notes:`<p>Ratio as a pattern that repeats, in plain words. Kai is threading necklaces. First she just makes the pattern: "1 red, 2 blue" (tap the jars to add beads to the tray, tap a bead to take it out) and Checks. Next the pattern is made for her, and the only question is how many times it repeats to make 12 beads (− and + choose, a faint necklace shows the plan, Thread makes it). Then: the necklace has 12 blue beads, how many times does the 2 red, 3 blue pattern repeat (and so how many red)? Then both steps: make the pattern and the necklace (1 red for every 3 blue, 16 beads).</p>
<p>Then turned round: a finished necklace, build the pattern that repeats, which is where "2 : 3" is written for the first time; and last red : blue = 3 : 2 with 15 beads. Counting the reds and blues and simplifying (4 : 8 is 1 : 2) comes later, in Paint, after "same ratio, same colour".</p>`,
mount(root){
  const R=[{k:'pattern',p:[[1,2],[2,1],[1,3]]},{k:'rep',what:'all',p:[[1,2,15],[1,3,12],[2,1,9]]},{k:'rep',what:'b',p:[[2,3,9],[2,3,12],[1,4,8]]},
    {k:'make',p:[[2,1,18],[1,3,8],[1,3,20]]},{k:'find',p:[[2,3],[1,3],[3,2]]},{k:'make',colon:1,p:[[1,4,10],[3,2,15],[4,1,20]]}];
  const S={r:0,busy:false,won:false,pi:{},mould:[],n:1,fixed:false};
  const board=el('g',{},root),neckL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let kn=null,ctl=null;
  const st=navStone({label:'Next necklace',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this necklace again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Thread the necklace',go2,'Thread');
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length];return{k:q.k,colon:q.colon,what:q.what||'all',R:v[0],B:v[1],want:v[2]}};
  const cnt=()=>({r:S.mould.filter(c=>c==='r').length,b:S.mould.filter(c=>c==='b').length});
  const times=n=>`${n} time${n>1?'s':''}`;
  const parts=(q,done)=>q.k==='pattern'?[['w',q.R],['t','red,'],['w',q.B],['t','blue']]
    :q.k==='rep'?[['t','pattern'],['o','×'],done?['w',S.n]:['o','?'],['o','='],['w',`${q.want} ${q.what==='b'?'blue':'beads'}`]]
    :q.k==='make'&&!q.colon?[['w',q.R],['t','red for every'],['w',q.B],['t','blue'],['t',`,  ${q.want} beads`]]
    :q.k==='make'?[['t','red : blue'],['o','='],['w',RAT(q.R,q.B)],['t',`,  ${q.want} beads`]]
    :[['t','red : blue'],['o','='],done?['w',RAT(q.R,q.B)]:['o','?']];
  const trayL=el('g',{},board);
  function drawTray(){trayL.innerHTML='';el('rect',{x:50,y:118,width:242,height:64,rx:14,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2.5},trayL);
    el('text',{x:171,y:110,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},trayL).textContent='the pattern';
    if(!S.mould.length)el('text',{x:171,y:156,'text-anchor':'middle','font-size':15,fill:'#b8a8d8'},trayL).textContent='tap the jars to add beads';
    else{const {r,b}=cnt(),t=el('text',{x:171,y:206,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff4e6'},trayL);t.textContent=`red : blue = ${r} : ${b}`}
    S.mould.forEach((c,i)=>{const b=bead(trayL,74+i*34,150,bcol(c),12);if(!S.fixed)interact(b,{label:`Pattern bead ${i+1}, ${c==='r'?'red':'blue'}: tap to take it out`,tap:()=>{if(S.busy||S.won)return;S.mould.splice(i,1);SFX.pop(.8);drawTray();plan()}})})}
  function addBead(c){if(S.busy||S.won)return;if(S.mould.length>=6){say('That’s a long pattern! Tap a bead to take it out.');return}S.mould.push(c);SFX.clink?SFX.clink():SFX.pop(1.2);drawTray();plan()}
  function drawNeck(pos,knots,{ghost=false}={}){neckL.innerHTML='';[...new Set(pos.map(p=>p.y))].forEach(y=>el('line',{x1:38,x2:460,y1:y,y2:y,stroke:'#d8c6e4','stroke-width':2,opacity:ghost?.3:.7},neckL));
    knots.forEach(([x,y])=>el('circle',{cx:x,cy:y,r:3.5,fill:'#c9a24a',opacity:ghost?.4:1},neckL));
    return pos.map(p=>{const b=bead(neckL,p.x,p.y,bcol(p.c),13);if(ghost)b.setAttribute('opacity',.33);return b})}
  /* the faint necklace she's planning: the pattern, repeated */
  function plan(){const q=Q();if(q.k!=='rep'&&q.k!=='make')return;if(!S.mould.length){neckL.innerHTML='';return}const L=beadLayout(Array(S.n).fill([...S.mould]));drawNeck(L.pos,L.knots,{ghost:true})}
  function go2(){if(S.busy||S.won)return;const q=Q(),{r,b}=cnt();
    if(!S.mould.length){say('Tap the jars to put beads in the pattern first.');return}
    if(q.k==='pattern'){if(r!==q.R||b!==q.B){SFX.wrong();shake(2);say(`Your pattern has ${r} red and ${b} blue. It should be ${q.R} red and ${q.B} blue.`);return}
      S.busy=true;goB.style.display='none';const L=beadLayout(Array(3).fill([...S.mould])),bs=drawNeck(L.pos,L.knots);bs.forEach((x,i)=>x.setAttribute('opacity',i<S.mould.length?1:.3));
      later(700,()=>win(q,`That’s the pattern: ${q.R} red, ${q.B} blue. A necklace repeats it again and again.`));return}
    if(q.k==='find'){if(r!==q.R||b!==q.B){SFX.wrong();shake(2);
        say(r*q.B===b*q.R?`That’s the pattern twice! Find the smallest bit that repeats.`:`Look again: count the red and blue before it repeats. Yours has ${r} red and ${b} blue.`);return}
      S.busy=true;goB.style.display='none';const L0=beadLayout([[].concat(...Array(3).fill(null).map(()=>[...Array(q.R).fill('r'),...Array(q.B).fill('b')]))],{step:26,x0:56}),L={pos:L0.pos.map((p,i)=>Object.assign({},p,{gi:Math.floor(i/(q.R+q.B))}))};
      [0,1,2].forEach(gi=>later(gi*500,()=>{const ps=L.pos.filter(p=>p.gi===gi),x0=ps[0].x-14,x1=ps[ps.length-1].x+14;const br=el('rect',{x:x0,y:ps[0].y-18,width:x1-x0,height:36,rx:10,fill:'none',stroke:'#fff0a0','stroke-width':3},neckL);popIn(br,.6);SFX.plink(gi+4)}));
      later(1700,()=>win(q,`It repeats ${q.R} red, ${q.B} blue. We write it ${RAT(q.R,q.B)} and say “${q.R} to ${q.B}”.`));return}
    /* rep and make: thread the pattern n times */
    if(!r||!b||r*q.B!==b*q.R){SFX.wrong();shake(2);say(`Your pattern has ${r} red and ${b} blue. It should be ${q.R} red for every ${q.B} blue.`);return}
    S.busy=true;kn.lock(true);goB.style.display='none';const L=beadLayout(Array(S.n).fill([...S.mould])),bs=drawNeck(L.pos,L.knots);bs.forEach(x=>x.setAttribute('opacity',0));
    bs.forEach((x,i)=>later(i*45,()=>{x.setAttribute('opacity',1);SFX.tick(i%10)}));
    later(bs.length*45+400,()=>{const have=q.what==='b'?S.n*b:S.n*(r+b);
      if(have===q.want)win(q,q.what==='b'?`The pattern repeats ${times(S.n)}: ${S.n} × ${b} = ${have} blue, so ${S.n} × ${r} = ${S.n*r} red.`:`${times(S.n)} ${r+b} beads = ${have} beads: ${S.n*r} red and ${S.n*b} blue.`);
      else{SFX.wrong();guide.tint(KAI_GREY,0);say(`That’s ${have} ${q.what==='b'?'blue':'beads'}, not ${q.want}. A new necklace…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3400,load)}})}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();kaiWin(guide);decQ(qL,parts(q,true),true,guide);say(msg);burst(250,300,{n:16,cols:[BRED,BBLUE,'#fff0a0']});
    if(S.r>=4)unlock('forevery');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';neckL.innerHTML='';if(ctl)ctl.remove();const q=Q();Object.assign(S,{busy:false,won:false,mould:[],n:1,fixed:q.k==='rep'});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);
    ctl=el('g',{},ui);if(S.fixed)S.mould=[...Array(q.R).fill('r'),...Array(q.B).fill('b')];
    else{beadJar(ctl,540,150,BRED,'Add a red bead',()=>addBead('r'));beadJar(ctl,540,240,BBLUE,'Add a blue bead',()=>addBead('b'))}
    goB.querySelector('text').textContent=q.k==='pattern'||q.k==='find'?'Check':'Thread';
    kn=null;if(q.k==='rep'||q.k==='make')kn=stepper(ctl,{x:250,y:490,w:230,min:1,max:8,val:1,label:'How many times the pattern repeats',fmt:n=>`× ${n} times`.replace('× 1 times','× 1 time'),onChange:n=>{S.n=n;plan()}});
    drawTray();plan();
    if(q.k==='find'){const L=beadLayout([[].concat(...Array(3).fill(null).map(()=>[...Array(q.R).fill('r'),...Array(q.B).fill('b')]))],{step:26,x0:56});drawNeck(L.pos,[])}
    decQ(qL,parts(q,false),false,guide);
    say(q.k==='pattern'?`Make the pattern: ${q.R} red, ${q.B} blue. Tap the jars, then Check.`
      :q.k==='rep'&&q.what==='all'?`How many times must the pattern repeat to make ${q.want} beads? Then Thread.`
      :q.k==='rep'?`The necklace has ${q.want} blue beads. How many times does the pattern repeat?`
      :q.colon?`Red : blue = ${RAT(q.R,q.B)}. Make the pattern, then a ${q.want}-bead necklace.`
      :q.k==='make'?`Make the pattern, then repeat it to make ${q.want} beads. Then Thread.`
      :'Turned round! Build the pattern that repeats, then Check.')}
  W.beads.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
