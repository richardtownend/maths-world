/* ---------- 5. Steps: a trip to the shop, in two labelled steps ---------- */
SCENE_X.shop=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2e2238'},o);
  for(let s=0;s<3;s++){const y=110+s*130;el('rect',{x:-700,y:y+70,width:2000,height:10,fill:'#5a3a2a'},o);
    for(let x=-680;x<1300;x+=46){const c=['#e8413e','#4aa0ff','#ffc04d','#8ff0c8','#ff9ed2'][((x/46|0)+s)%5];el('rect',{x,y:y+30,width:30,height:40,rx:5,fill:c,opacity:.35},o);el('rect',{x:x+6,y:y+22,width:18,height:10,rx:2,fill:c,opacity:.35},o)}}
  el('rect',{x:-700,y:520,width:2000,height:300,fill:'#3a2a30'},o);el('path',{d:'M-700,40 h2000',stroke:'#ff9ed2','stroke-width':6,'stroke-dasharray':'30 20',opacity:.3},o)};
AMB_X.shop=()=>{const r=Math.random();if(r<.4)bell(noteHz(5+Math.floor(Math.random()*3)),.008,1.2,{wet:.8});else noise(.3,.015,{type:'bandpass',f:1800,q:2,wet:.2})};
/* things in the shop */
function shopItem(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(kind==='pen'){el('rect',{x:-4,y:-26,width:8,height:40,rx:3,fill:'#4aa0ff',stroke:'#2a5a8a'},g);el('path',{d:'M-4,14 L0,22 L4,14Z',fill:'#f4d8b0'},g)}
  else if(kind==='cake'){el('rect',{x:-16,y:-12,width:32,height:22,rx:4,fill:'#f4c8a0',stroke:'#a8743a'},g);el('path',{d:'M-16,-10 q8,-10 16,-4 q8,-8 16,4',fill:'#ff9ed2'},g);el('circle',{cy:-18,r:4,fill:'#e8413e'},g)}
  else if(kind==='comic'){el('rect',{x:-18,y:-24,width:36,height:46,rx:3,fill:'#ffe066',stroke:'#a8743a','stroke-width':2},g);el('text',{y:-6,'text-anchor':'middle','font-size':11,'font-weight':900,fill:'#e8413e'},g).textContent='POW!'}
  else if(kind==='book'){el('rect',{x:-18,y:-24,width:36,height:46,rx:3,fill:'#7a5ad0',stroke:'#4a3a8a','stroke-width':2},g);el('rect',{x:-12,y:-14,width:24,height:6,fill:'#fff0a0'},g)}
  else if(kind==='week'){el('rect',{x:-16,y:-18,width:32,height:34,rx:4,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2},g);el('rect',{x:-16,y:-18,width:32,height:9,rx:3,fill:'#e8413e'},g)}
  else if(kind==='adult'||kind==='child'){el('rect',{x:-22,y:-14,width:44,height:28,rx:4,fill:kind==='adult'?'#8fd6ff':'#ff9ed2',stroke:'#3a2418','stroke-width':1.5,'stroke-dasharray':'4 2'},g);el('text',{y:5,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#3a2418'},g).textContent=kind}
  else if(kind==='drink'){el('path',{d:'M-10,-20 H10 L7,16 H-7Z',fill:'#8ff0c8',stroke:'#3a8a6a','stroke-width':2},g);el('line',{x1:4,y1:-28,x2:0,y2:-14,stroke:'#e8413e','stroke-width':3},g)}
  return g}
const priceTag=(parent,x,y,t,q=false)=>kgTag(parent,x,y,t,q);

W.steps={scene:'shop',
notes:`<p>Two-step word problems as a trip to the shop. The story hides a question inside it, so each step is its own counter, labelled with its own question in plain words: "Step 1: how much do 4 pens cost?" at the shelf, where she types the total on the till; then "Step 2: how much change from £20?" at the counter, where the Step 1 answer is on the receipt and she counts out the change (or pays) with coins: £1, £2, £5 and £10.</p>
<p>Rounds: pens and change; a comic and a book that costs £3 more, pay for both; cakes from £25; a pizza shared by 4 plus a £2 drink each; saving for 6 weeks then spending £18; tickets for 2 adults and a child. A wrong answer gives a new story.</p>`,
mount(root){
  /* s1: times (n × v), share (W ÷ n), more (a + d); s2: change (from W), both (+ a), spend (− d) */
  const R=[
    {v:[[3,4,20],[3,5,20],[7,2,20]],f:([v,n,W])=>({w:['Ben','Ben'],l:[['Pens are',{n:v,id:'a',t:`£${v}`},'each.'],['I’ll buy',{n,id:'b'},'and pay with',{n:W,id:'c',t:`£${W}`}]],q:'How much change does Ben get?',
      s1:{t:'times',n,v,item:'pen',q:`How much do ${n} pens cost?`,cap:`${n} pens`},s2:{t:'change',W,q:`How much change from £${W}?`,act:'Count out his change'}})},
    {v:[[4,3],[5,2],[3,4]],f:([a,d])=>({w:['Kim','Kim'],l:[['This comic costs',{n:a,id:'a',t:`£${a}`}],['The book costs',{n:d,id:'b',t:`£${d}`},'more.']],q:'How much for both?',
      s1:{t:'more',a,d,q:'How much is the book?',cap:'the book'},s2:{t:'both',a,q:'How much for the book and the comic?',act:'Pay for both',other:'comic'}})},
    {v:[[5,3,25],[4,4,20],[5,3,20]],f:([v,n,W])=>({w:['Mia','Mia'],l:[['I’ve got',{n:W,id:'c',t:`£${W}`}],['I’m buying',{n,id:'b'},'cakes at',{n:v,id:'a',t:`£${v}`},'each.']],q:'How much will Mia have left?',
      s1:{t:'times',n,v,item:'cake',q:`How much do ${n} cakes cost?`,cap:`${n} cakes`},s2:{t:'change',W,q:`How much is left from £${W}?`,act:'Count out what’s left'}})},
    {v:[[24,4,2],[30,5,3],[20,4,1]],f:([W,n,a])=>({w:['Leo','Leo'],l:[['We’re',{n,id:'b'},'friends sharing a',{n:W,id:'a',t:`£${W}`},'pizza.'],['We each buy a',{n:a,id:'c',t:`£${a}`},'drink too.']],q:'How much does each friend pay?',
      s1:{t:'share',W,n,q:'How much is each share of the pizza?',cap:'pizza share'},s2:{t:'both',a,q:'How much with the drink?',act:'Pay for one friend',other:'drink'}})},
    {v:[[5,6,18],[4,5,9],[3,6,8]],f:([v,n,d])=>({w:['Ella','Ella'],l:[['I save',{n:v,id:'a',t:`£${v}`},'a week for',{n,id:'b'},'weeks.'],['Then I spend',{n:d,id:'c',t:`£${d}`}]],q:'How much does Ella have left?',
      s1:{t:'times',n,v,item:'week',q:`How much does she save in ${n} weeks?`,cap:'saved'},s2:{t:'spend',d,q:`How much is left after spending £${d}?`,act:'Count out what’s left'}})},
    {v:[[6,2,4],[7,2,3],[5,3,4]],f:([v,n,a])=>({w:['keeper','keeper'],l:[['Adults pay',{n:v,id:'a',t:`£${v}`},'and children pay',{n:a,id:'c',t:`£${a}`}],['Here come',{n,id:'b'},'adults and 1 child!']],q:'How much do they pay altogether?',
      s1:{t:'times',n,v,item:'adult',q:`How much for ${n} adults?`,cap:`${n} adults`},s2:{t:'both',a,q:'How much with the child?',act:'Pay for everyone',other:'child'}})}];
  const S={r:0,busy:true,won:false,pi:{},step:1,val:null};
  const board=el('g',{},root),panel=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let pad=null,tray=null,goB=null,PY=250;
  const st=navStone({label:'Next story',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this story again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],q=rr.f(rr.v[(S.pi[S.r]||0)%rr.v.length]),a=q.s1,b=q.s2,r1=a.t==='times'?a.n*a.v:a.t==='share'?a.W/a.n:a.a+a.d,r2=b.t==='change'?b.W-r1:b.t==='spend'?r1-b.d:r1+b.a;return Object.assign(q,{r1,r2})};
  const parts=(q,done)=>[['t',q.s2.t==='both'?'altogether':'left'],['o','='],done?['w',`£${q.r2}`]:['o','?']];
  function frame(n,txt){panel.innerHTML='';const g=el('g',{},panel);el('rect',{x:30,y:PY,width:430,height:470-PY+8,rx:16,fill:'rgba(34,24,48,.9)',stroke:n===1?'#8fd6ff':'#ffc04d','stroke-width':3},g);
    const h=el('g',{transform:`translate(30,${PY})`},g);el('rect',{width:430,height:34,rx:14,fill:n===1?'#8fd6ff':'#ffc04d'},h);el('text',{x:14,y:23,'font-size':16,'font-weight':800,fill:'#241a3a'},h).textContent=`Step ${n}: ${txt}`;
    g.setAttribute('opacity',0);tween(350,t=>g.setAttribute('opacity',t.toFixed(2)));return g}
  function step1(q){const a=q.s1,g=frame(1,a.q),cy=PY+110;
    if(a.t==='times'){const sp=Math.min(70,380/a.n);for(let i=0;i<a.n;i++){const x=245-(a.n-1)*sp/2+i*sp;shopItem(g,x,cy,a.item,1.1);priceTag(g,x,cy+44,`£${a.v}`)}}
    else if(a.t==='share'){el('circle',{cx:200,cy,r:56,fill:'#f4c070',stroke:'#a8743a','stroke-width':3},g);el('circle',{cx:200,cy,r:46,fill:'#e8613e'},g);for(let i=0;i<a.n;i++){const t=i/a.n*Math.PI*2;el('line',{x1:200,y1:cy,x2:200+Math.cos(t)*56,y2:cy+Math.sin(t)*56,stroke:'#fff4e6','stroke-width':3},g)}
      priceTag(g,200,cy-72,`£${a.W}`);for(let i=0;i<a.n;i++)storyIcon(g,300+(i%3)*30,cy-20+Math.floor(i/3)*36,'person',1.3);el('text',{x:330,y:cy+56,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},g).textContent=`${a.n} friends`}
    else{shopItem(g,160,cy,'comic',1.3);priceTag(g,160,cy+48,`£${a.a}`);shopItem(g,320,cy,'book',1.3);priceTag(g,320,cy+48,'?',true);el('text',{x:320,y:cy-44,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},g).textContent=`£${a.d} more`}
    el('text',{x:245,y:PY+204,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#fff4e6'},g).textContent='Set it on the till →';
    pad=numPad(ui,{y:262,pre:'£',label:'The till',onChange:v=>{S.val=v}});popIn(pad.g,.5)}
  function step2(q){const b=q.s2,g=frame(2,b.q);[...ui.children].forEach(n=>{if(n!==guide.g&&n!==goB)n.remove()});
    const rc=el('g',{transform:`translate(50,${PY+48})`},g);el('rect',{width:200,height:58,rx:4,fill:'#fff8ec',stroke:'#c9a77a'},rc);el('text',{x:10,y:20,'font-size':12,'font-weight':700,fill:'#7a5a44'},rc).textContent='RECEIPT';
    el('text',{x:10,y:44,'font-size':16,'font-weight':700,fill:'#3a2418'},rc).textContent=`${q.s1.cap}: £${q.r1}`;
    const info=b.t==='change'?`paid with £${b.W}`:b.t==='spend'?`spends £${b.d}`:`${b.other}: £${b.a}`;el('text',{x:270,y:PY+84,'font-size':16,'font-weight':700,fill:'#fff0a0'},g).textContent=info;
    tray=coinTray(g,{x:50,y:PY+124,w:400,h:Math.min(96,470-PY-128),px:500,py:Math.max(276,PY+40),onChange:v=>{S.val=v}});
    el('text',{x:528,y:Math.max(276,PY+40)-34,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},ui).textContent='coins';
    el('text',{x:250,y:PY+116,'font-size':14,'font-weight':700,fill:'#fff4e6'},g).textContent=`${b.act}:`}
  function miss(msg){SFX.wrong();S.busy=true;say(`Not quite. ${msg} A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=Q(),a=q.s1,b=q.s2;
    if(S.step===1){if(S.val==null){say('Set it on the till first, then Check.');return}
      if(S.val!==q.r1){miss(`Step 1 is ${a.t==='times'?`${a.n} lots of £${a.v}`:a.t==='share'?`£${a.W} shared by ${a.n}`:`£${a.a} and £${a.d} more`}.`);return}
      SFX.chime();S.step=2;S.val=0;say(`Yes, £${q.r1}! Now Step 2, with coins.`);step2(q);return}
    if(!S.val){say('Put some coins in the tray, then Check.');return}
    const sum=b.t==='change'?`£${b.W} − £${q.r1} = £${q.r2}`:b.t==='spend'?`£${q.r1} − £${b.d} = £${q.r2}`:`£${q.r1} + £${b.a} = £${q.r2}`;
    if(S.val!==q.r2){miss(`The tray has £${S.val}. Step 2 is ${b.t==='change'?`£${b.W} take away £${q.r1}`:b.t==='spend'?`£${q.r1} take away £${b.d}`:`£${q.r1} add £${b.a}`}.`);return}
    S.won=true;tray.lock(true);roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(250,PY+170,{n:16});
    say(`Two steps: £${q.r1}, then ${sum}.`);if(S.r>=2)unlock('wsteps');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';panel.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:true,won:false,step:1,val:null});st.ready(false);navDots(R.length,S.r);
    const card=storyCard(board,{lines:q.l,ask:q.q,hidden:true,who:q.w});PY=92+card.h+14;decQ(qL,parts(q,false),false,guide);say('Listen to the story…');
    tellStory(card,[],()=>{S.busy=false;step1(q);goB=decGo(ui,540,486,'Check',check,'Check');
      say(S.r===0?`This story has a hidden question. ${q.s1.q} That’s Step 1.`:`Step 1: ${q.s1.q}`)})}
  W.steps.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
