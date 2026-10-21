/* ---------- 1. Tally Stones: I, V and X, by bundling sticks ---------- */
W.sticks={scene:'road',
notes:`<p>The first Roman numerals, built the way they began: as tally sticks. Dex walks down the road past the mile posts and stops; she counts the posts he passed and carves the stone, one stick (I) per mile. Five sticks are hard to read, so she taps them to bundle them into a hand, V; two hands make an X. Check unpacks the stone back onto the road, lighting one post per mile: it should stop exactly at Dex. Later she reads a stone and walks Dex to the right post, and finally carves a number given in digits.</p>
<p>No take-aways yet (IV, IX): those are the next island. Numbers here avoid 4 and 9 in the ones.</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=[{mode:'carve',ns:[3,2]},{mode:'carve',ns:[7,6,8]},{mode:'carve',ns:[12,13,11]},{mode:'read',ss:['XVI','XVII','XV']},{mode:'carve',ns:[27,28,26,23],digits:true}];
  const S={r:0,busy:false,won:false,n:0,toks:[],dexAt:0};
  const road=el('g',{},root),posts=el('g',{},root),walkL=el('g',{},root),stoneL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let go=null,dex=null;
  const st=navStone({label:'Next stone',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this stone again',onTap:()=>load()});
  const RY=300,X0=58;let M=12,sp=36;const px=k=>X0+k*sp;
  const val=()=>S.toks.reduce((a,t)=>a+RV[t],0);
  const tokStr=()=>S.toks.join('');
  function drawRoad(){road.innerHTML='';const q=R[S.r];
    el('rect',{x:-700,y:RY-26,width:2000,height:62,fill:'#cbb98e'},road);el('path',{d:`M-700,${RY+6} H1300`,stroke:'#e2d3aa','stroke-width':5,'stroke-dasharray':'16 10'},road);
    const h=el('g',{transform:`translate(${X0-30},${RY-24})`},road);el('rect',{x:-24,y:-36,width:36,height:34,fill:'#f4e4c8',stroke:'#8a6a4a','stroke-width':2},h);el('path',{d:'M-30,-34 L-6,-56 L18,-34Z',fill:'#c9613a',stroke:'#7a3a1a','stroke-width':2},h);el('rect',{x:-12,y:-22,width:10,height:20,fill:'#7a4a2a'},h);
    posts.innerHTML='';for(let k=1;k<=M;k++){const p=el('g',{transform:`translate(${px(k)},${RY-26})`},posts);el('rect',{x:-3,y:-26,width:6,height:28,rx:2,fill:'#8a5a34'},p);el('circle',{cy:-26,r:4.5,fill:'#a8743a'},p);
      if(q.digits&&k%5===0)el('text',{y:-36,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#3a2418'},p).textContent=k}}
  function drawDex(k){walkL.innerHTML='';dex=dexFig(walkL,.72);dex.put(k?px(k)-14:X0-6,RY+30);
    if(k&&R[S.r].mode!=='read'){const rb=el('g',{transform:`translate(${px(k)},${RY-56})`},walkL);el('path',{d:'M0,0 l10,4 l-10,4Z',fill:'#e8413e'},rb)}}
  /* the stone: sticks and bundles, biggest first */
  function drawStone(){stoneL.innerHTML='';const q=R[S.r],ro=q.mode==='read',g=el('g',{transform:'translate(250,452)'},stoneL),W=330,H=96;
    el('rect',{x:-W/2,y:-H/2,width:W,height:H,rx:16,fill:STONE.face,stroke:STONE.edge,'stroke-width':3},g);el('rect',{x:-W/2+8,y:-H/2+8,width:W-16,height:H-16,rx:10,fill:'none',stroke:STONE.side,'stroke-width':2,'stroke-dasharray':'2 5'},g);
    const toks=S.toks,cw=Math.min(36,(W-30)/Math.max(1,toks.length)),x0=-toks.length*cw/2+cw/2;
    toks.forEach((t,i)=>{const tg=el('g',{},g);carve(tg,x0+i*cw,15,t,{sz:44});tg.dataset.t=t;tg.dataset.i=i;
      if(!ro){el('rect',{x:x0+i*cw-cw/2,y:-H/2+6,width:cw,height:H-12,fill:'transparent'},tg);interact(tg,{label:t==='I'?'A stick: tap to bundle five':t==='V'?'A hand of five: tap to join two':'Ten',tap:()=>bundle(t)})}});
    if(!toks.length&&!ro)el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':700,fill:STONE.side},g).textContent='a blank stone'}
  function bundle(t){if(S.busy||S.won)return;const n=S.toks.filter(x=>x===t).length;
    if(t==='X'){say('An X is ten miles: two hands. It’s the biggest we have here.');return}
    if(t==='I'&&n<5){say('A bundle needs five sticks.');SFX.clonk();return}
    if(t==='V'&&n<2){say('Two hands make an X. You only have one V.');SFX.clonk();return}
    const take=t==='I'?5:2,into=t==='I'?'V':'X',idx=[];S.toks.forEach((x,i)=>{if(x===t&&idx.length<take)idx.push(i)});
    const nodes=[...stoneL.querySelectorAll('g[data-i]')].filter(g=>idx.includes(+g.dataset.i)),cx=nodes.length?nodes.reduce((a,g)=>{const b=g.getBBox();return a+b.x+b.width/2},0)/nodes.length:0;S.busy=true;
    tween(320,(e)=>nodes.forEach(g=>{const b=g.getBBox(),dx=(cx-(b.x+b.width/2))*e;g.setAttribute('transform',`translate(${dx.toFixed(1)},0)${into==='X'&&g===nodes[1]?` rotate(${(180*e).toFixed(0)} ${(b.x+b.width/2).toFixed(1)} ${(b.y+b.height/2).toFixed(1)})`:''}`)}),()=>{
      S.toks=S.toks.filter((x,i)=>!idx.includes(i));S.toks.push(into);S.toks.sort((a,b)=>RV[b]-RV[a]);S.busy=false;noise(.06,.14,{f:1600,q:2});osc('triangle',into==='X'?660:520,.12,.08,{to:into==='X'?990:780,wet:.4});drawStone();
      say(into==='V'?'Five sticks tied up: a V, like a hand of five fingers.':'Two hands make ten: an X.')})}
  function addStick(){if(S.busy||S.won)return;if(S.toks.length>=12){say('The stone is full. Bundle some sticks!');SFX.clonk();return}S.toks.push('I');noise(.05,.12,{f:2600,q:2});osc('triangle',900,.05,.06,{wet:.2});drawStone()}
  function rubOut(){if(S.busy||S.won||!S.toks.length)return;S.toks.pop();SFX.pop(.8);drawStone()}
  function tools(){const b=el('g',{transform:'translate(124,548)'},ui);el('rect',{x:-58,y:-24,width:116,height:48,rx:12,fill:'#6a5a8a',stroke:'#c9b8ee','stroke-width':2},b);carve(b,-30,12,'I',{sz:30,col:'#fff4e6',lip:'#3a2a5a'});el('text',{x:14,y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#fff4e6'},b).textContent='a stick';
    interact(b,{label:'Carve a stick (I)',tap:addStick});
    const r=el('g',{transform:'translate(258,548)'},ui);el('rect',{x:-50,y:-20,width:100,height:40,rx:12,fill:'rgba(255,244,230,.14)',stroke:'#c9b8ee','stroke-width':1.5},r);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},r).textContent='rub one out';
    interact(r,{label:'Rub out the last mark',tap:rubOut})}
  const parts=done=>{const q=R[S.r];return q.mode==='read'?[['w',S.str],['o','='],done?['w',S.n]:['o','?'],['t','miles']]:q.digits?[['w',S.n],['o','='],done?['w',toRoman(S.n)]:['o','?']]:[['t','miles'],['o','='],done?['w',toRoman(S.n)]:['o','?']]};
  /* the check: the stone's miles are laid back along the road, one lit post per mile */
  function check(){if(S.busy||S.won)return;const q=R[S.r],ro=q.mode==='read';
    if(!ro&&!S.toks.length){say(q.digits?'Carve the number on the stone first.':'Count the posts Dex passed, then carve one stick per mile.');return}
    if(ro&&!S.dexAt){say('Drag Dex along the road to the right post.');return}
    const v=ro?romanVal(S.str):val();S.busy=true;const lit=el('g',{},posts);
    for(let k=1;k<=Math.min(v,M);k++)later(k*(q.digits?70:110),()=>{el('circle',{cx:px(k),cy:RY-52,r:7,fill:'#fff0a0'},lit);SFX.tick(k%8)});
    later(Math.min(v,M)*(q.digits?70:110)+500,()=>{const want=ro?S.dexAt:S.n;
      if(!ro&&(S.toks.filter(t=>t==='I').length>=5||S.toks.filter(t=>t==='V').length>=2)&&v===S.n){S.busy=false;lit.remove();say(S.toks.filter(t=>t==='I').length>=5?'The right number of miles, but five sticks in a row is hard to read. Tap them to bundle them into a V.':'Right number of miles! But two Vs should be joined into an X.');SFX.clonk();return}
      if(v===want){win();return}
      SFX.wrong();shake(2);say(ro?(v>S.dexAt?`The stone says further than that. Count the X’s as ten and the V as five.`:`The stone says not so far. ${S.str}: X is ten, V is five, each I is one.`):v<S.n?(q.digits?`The stone only reaches ${v}. You need ${S.n}.`:'The lights stop before Dex: he walked further than the stone says.'):(q.digits?`The stone goes past ${S.n}: that’s ${v}.`:'The lights go past Dex: the stone says too many miles.'));later(2600,()=>{lit.remove();S.busy=false})})}
  function win(){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();if(dex)dex.cheer();decQ(qL,parts(true),true,guide);burst(250,440,{n:14});
    const q=R[S.r],r=q.mode==='read'?S.str:toRoman(S.n),nx=(r.match(/X/g)||[]).length,nv=(r.match(/V/g)||[]).length,ni=(r.match(/I/g)||[]).length;
    say(`${r}: ${[nx&&`${nx===1?'one ten':nx+' tens'} (X)`,nv&&'a five (V)',ni&&`${ni} one${ni>1?'s':''} (I)`].filter(Boolean).join(', ')}. That’s ${q.mode==='read'?romanVal(S.str):S.n} miles.`);
    if(S.r>=2)unlock('rsticks');later(1400,()=>st.ready(true))}
  function walkTo(k,done){const x0=X0-6,x1=px(k)-14;S.busy=true;let d=0;tween(Math.min(4200,600+k*170),(t,p)=>{const x=lerp(x0,x1,p);dex.put(x,RY+30);dex.step(x)},()=>{S.busy=false;done&&done()},ease.lin)}
  function load(){EPOCH++;FX.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);go=null;const q=R[S.r];
    Object.assign(S,{busy:false,won:false,toks:[],dexAt:0,n:q.ns?pick(q.ns):0,str:q.ss?pick(q.ss):''});
    const top=q.mode==='read'?romanVal(S.str):S.n;M=Math.max(12,top+4);sp=Math.min(38,(568-X0)/M);
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawRoad();drawStone();go=decGo(ui,548,470,'Check the stone',check,'Check');
    if(q.mode==='read'){S.toks=[...S.str];drawStone();drawDex(0);
      interact(dex.g,{label:'Dex: drag him along the road',down:()=>({}),move:p=>{if(S.busy||S.won)return;const k=clamp(Math.round((p.x+14-X0)/sp),1,M);if(k!==S.dexAt){S.dexAt=k;dex.put(px(k)-14,RY+30);dex.step(px(k));SFX.tick(k%8)}},tap:()=>{}});
      say(S.r===3?`This stone was carved for the traveller. Drag Dex to the post it’s for, then check.`:'Drag Dex to the post the stone says.')}
    else{tools();drawDex(0);
      if(q.digits){say('Carve this number on the stone. Bundle sticks into Vs and Xs.')}
      else{S.busy=true;say('Watch where Dex stops…');walkTo(S.n,()=>{const rb=el('g',{transform:`translate(${px(S.n)},${RY-56})`},walkL);el('path',{d:'M0,0 l10,4 l-10,4Z',fill:'#e8413e'},rb);heehaw();
        say(S.r===0?'How many miles did Dex walk? Count the posts he passed and carve one stick (I) for each.':S.r===1?'Count the posts again. Five sticks? Tap them to bundle them into a V!':'Bundle fives into V, and two Vs into an X.')})}}}
  W.sticks.dbgQ=()=>({r:S.r,n:S.n,str:S.str,toks:S.toks.join(''),dexAt:S.dexAt,M,busy:S.busy});
  S.r=resumeAt(R.length);load();
}};
