/* ---------- 1. The tally gate: keeping count while things go past ---------- */
W.tally={scene:'survey',
notes:`<p>Tallies are for counting things that won't keep still. Pip's farm animals trot through the gate one at a time and into the barn, so once they've gone, the tally is the only record. She taps the tally board row for each animal as it goes through (a little minus rubs out a slip); every fifth mark is drawn across the other four, a gate of five. When they've all gone, Check: right if every row matches. Later the board has more rows (sheep, goats, ducks) and they come faster. Then the other way round: yesterday's tally says how many go to market, and she sends that many through the gate from the flock, which means reading the tally in fives.</p>`,
mount(root){
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  /* live: animals go past and she keeps the tally; send: the tally is given and she sends that many */
  const R=[
    {mode:'live',gen:()=>({sheep:rnd(5,8)}),gap:2300},
    {mode:'live',gen:()=>({sheep:rnd(11,14)}),gap:1700},
    {mode:'live',gen:()=>({sheep:rnd(6,9),goat:rnd(4,7)}),gap:1800},
    {mode:'live',gen:()=>({sheep:rnd(5,8),goat:rnd(7,10),duck:rnd(3,6)}),gap:1700},
    {mode:'send',gen:()=>({sheep:rnd(11,14)}),flock:{sheep:18}},
    {mode:'send',gen:()=>({sheep:rnd(6,9),goat:rnd(10,13)}),flock:{sheep:11,goat:15}}];
  const S={r:0,busy:false,won:false,phase:'ready',want:{},marks:{},sent:{},flock:{}};
  const scene=el('g',{},root),walk=el('g',{},root),board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let go=null;
  const st=navStone({label:'Next tally',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this tally again',onTap:()=>load()});
  const kinds=()=>Object.keys(S.want),RY=k=>176+kinds().indexOf(k)*56,GX=210,LY=402;
  const parts=done=>[['t','tally'],['o','='],done?['w','✓']:['o','?']];
  function drawBoard(){board.innerHTML='';const q=R[S.r],ks=kinds();
    el('rect',{x:440,y:132,width:192,height:36+ks.length*56,rx:10,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':3},board);
    el('text',{x:536,y:152,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#7a5a3a'},board).textContent=q.mode==='live'?'Pip’s tally':'yesterday’s tally';
    ks.forEach(k=>{const y=RY(k),row=el('g',{},board);el('rect',{x:448,y:y-24,width:176,height:48,rx:8,fill:'rgba(201,167,122,.12)'},row);animalIcon(row,470,y+2,k,.9);
      const n=q.mode==='live'?S.marks[k]:S.want[k];tallyMarks(row,496,y,n,{h:26,dx:6.5,gap:10});
      if(q.mode==='live'){interact(row,{label:`Tally: ${ANIMAL[k].name[0]}`,tap:()=>{if(S.busy||S.won||S.phase==='ready')return;S.marks[k]++;SFX.tick(S.marks[k]%8);drawBoard()}});
        const m=el('g',{transform:`translate(616,${y-14})`},board);el('circle',{r:9,fill:'#e8d8c0',stroke:'#a8743a','stroke-width':1.5},m);el('text',{y:4,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#7a4a1e'},m).textContent='−';
        interact(m,{label:`Rub out a ${ANIMAL[k].name[0]} mark`,tap:()=>{if(S.busy||S.won||!S.marks[k])return;S.marks[k]--;SFX.pop(.8);drawBoard()}})}})}
  function drawGate(open){const g=el('g',{},scene);el('rect',{x:GX-4,y:350,width:8,height:76,fill:'#8a5a34'},g);el('rect',{x:GX+56,y:350,width:8,height:76,fill:'#8a5a34'},g);
    const leaf=el('g',{transform:`translate(${GX+4},360)`},g);for(let k=0;k<3;k++)el('rect',{x:0,y:k*20,width:52,height:7,fill:'#c9a27a',stroke:'#8a5a34','stroke-width':1},leaf);el('line',{x1:0,y1:47,x2:52,y2:0,stroke:'#c9a27a','stroke-width':6},leaf);
    if(open)leaf.setAttribute('transform',`translate(${GX+4},360) scale(.15,1)`);return leaf}
  function drawScene(){scene.innerHTML='';const q=R[S.r];el('path',{d:`M-40,${LY+14} H460`,stroke:'#c9a77a','stroke-width':34,opacity:.55},scene);
    if(q.mode==='send'){const pen=el('g',{},scene);el('rect',{x:282,y:318,width:152,height:150,rx:6,fill:'rgba(201,162,122,.25)',stroke:'#8a5a34','stroke-width':4,'stroke-dasharray':'14 6'},pen);el('rect',{x:318,y:296,width:80,height:22,rx:4,fill:'#c9413a'},pen);el('text',{x:358,y:312,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff4e6'},pen).textContent='MARKET';S.leaf=drawGate(false);return}
    const barn=el('g',{transform:'translate(344,300) scale(1.25)'},scene);el('rect',{x:-44,y:20,width:88,height:86,fill:'#c9413a',stroke:'#7a2424','stroke-width':3},barn);el('path',{d:'M-54,24 L0,-22 L54,24Z',fill:'#8a2a2a',stroke:'#5a1a1a','stroke-width':3},barn);
    el('rect',{x:-22,y:52,width:44,height:54,fill:'#3a1a1a'},barn);el('text',{y:12,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#fff4e6'},barn).textContent='BARN';
    S.leaf=drawGate(S.phase!=='ready'&&q.mode==='live')}
  function walkOne(kind,done){const a=animalIcon(walk,-30,LY,kind,1.8);SFX.boing&&Math.random()<.3&&SFX.boing();
    tween(2600,(t,p)=>{const x=-30+p*420,bob=Math.abs(Math.sin(p*Math.PI*9))*3;a.setAttribute('transform',`translate(${x.toFixed(1)},${(LY-bob).toFixed(1)}) scale(1.8)`);if(x>330)a.setAttribute('opacity',Math.max(0,(362-x)/32).toFixed(2))},()=>{a.remove();done&&done()},ease.lin)}
  function openGate(){if(S.busy||S.won||S.phase!=='ready')return;const q=R[S.r];S.phase='live';S.busy=false;SFX.creak?SFX.creak():SFX.whoosh();
    tween(500,t=>S.leaf.setAttribute('transform',`translate(${GX+4},360) scale(${(1-t*.85).toFixed(2)},1)`));
    const order=[];kinds().forEach(k=>{for(let i=0;i<S.want[k];i++)order.push(k)});for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
    S.left=order.length;order.forEach((k,i)=>later(600+i*q.gap,()=>walkOne(k,()=>{if(--S.left===0){S.phase='after';tween(500,t=>S.leaf.setAttribute('transform',`translate(${GX+4},360) scale(${(.15+t*.85).toFixed(2)},1)`));SFX.thud&&SFX.thud();say('That’s all of them through. Check your tally.')}})));
    setGo('Check the tally',check,'Check');say(kinds().length>1?'Tap the right row as each animal goes through!':'Tap the tally as each one goes through!')}
  function setGo(label,fn,txt){if(go)go.remove();go=decGo(ui,560,500,label,fn,txt)}
  /* the send rounds: the flock waits in the field; tap one to send it through the gate */
  function drawFlock(){walk.innerHTML='';const q=R[S.r];let row=0;
    Object.keys(S.flock).forEach(k=>{for(let i=0;i<S.flock[k];i++){const x=34+(i%6)*30,y=334+row*26+(Math.floor(i/6))*26;const a=animalIcon(walk,x,y,k,1);interact(a,{label:`Field: ${ANIMAL[k].name[0]}`,tap:()=>send(k,1)})}row+=Math.ceil((q.flock[k])/6)});
    let n=0;Object.keys(S.sent).forEach(k=>{for(let i=0;i<S.sent[k];i++,n++){const a=animalIcon(walk,300+(n%5)*30,338+Math.floor(n/5)*26,k,1);if(i===S.sent[k]-1)interact(a,{label:`Market pen: ${ANIMAL[k].name[0]}`,tap:()=>send(k,-1)})}})}
  function send(k,d){if(S.busy||S.won)return;if(d>0&&!S.flock[k])return;if(d<0&&!S.sent[k])return;S.flock[k]-=d;S.sent[k]=(S.sent[k]||0)+d;SFX.tick((S.sent[k]||0)%8);drawFlock()}
  function miss(msg){SFX.wrong();shake(2);S.busy=true;say(`${msg} Let’s count again…`);later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=R[S.r],ks=kinds();
    if(q.mode==='live'){if(S.phase==='live'){say('Wait until they’ve all gone through.');return}
      const bad=ks.find(k=>S.marks[k]!==S.want[k]);if(bad){const k=bad,few=S.marks[k]<S.want[k];miss(few?`Some ${ANIMAL[k].name[1]} went past without a mark. Watch the gate and mark each one.`:`Some ${ANIMAL[k].name[1]} got two marks.`);return}}
    else{if(!ks.some(k=>S.sent[k])){say('Tap animals in the field to send them through the gate.');return}
      const bad=ks.find(k=>(S.sent[k]||0)!==S.want[k]);if(bad){miss(`That’s not what the tally says for the ${ANIMAL[bad].name[1]}. Count it in fives: each gate is 5.`);return}}
    S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(true),true,guide);burst(536,200,{n:14});
    say(ks.map(k=>`${S.want[k]} ${ANIMAL[k].name[S.want[k]===1?0:1]}`).join(', ')+(q.mode==='live'?`: ${S.want[ks[0]]>=5?'count the gates in fives, then the ones.':'every one counted.'}`:': just what the tally said.'));
    if(S.r>=2)unlock('gtally');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';walk.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});go=null;const q=R[S.r];
    Object.assign(S,{busy:false,won:false,phase:'ready',want:q.gen(),marks:{},sent:{},flock:{...(q.flock||{})}});kinds().forEach(k=>S.marks[k]=0);
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene();drawBoard();
    if(q.mode==='live'){setGo('Open the gate',openGate,'Go');say(S.r===0?'Pip is counting the sheep into the barn. Open the gate, then tap the tally each time one goes through.':kinds().length>1?'Lots of animals this time, one row each. Open the gate!':'Faster this time! Open the gate.')}
    else{S.phase='send';drawFlock();setGo('Check: off to market',check,'Check');say(S.r===4?'Yesterday’s tally says how many sheep go to market. Tap sheep to send that many into the market pen.':'Send the sheep and goats the tally says into the market pen.')}}
  W.tally.dbgQ=()=>({want:S.want,marks:S.marks,phase:S.phase,r:S.r});S.r=resumeAt(R.length);load();
}};
