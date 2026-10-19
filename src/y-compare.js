/* ---------- 2. Compare: the height wall ---------- */
/* a tall thing standing on the ground: a block tower with a face, a beanstalk, a tree, a house, a rocket, a lighthouse */
function towerFig(parent,{x,ground=470,h,w=70,look='blocks',col='#8fd6ff',name}){const g=el('g',{},parent),body=el('g',{},g);let H=h,grip=false;
  const draw=()=>{body.innerHTML='';const y=ground-H;if(H<=0)return;
    if(grip){const gy=y-(look==='blocks'?60:look==='stalk'?40:30),k=el('g',{transform:`translate(${x},${gy})`},body);el('line',{x1:0,x2:0,y1:-34,y2:34,stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'3 4',opacity:.7},k);
      el('rect',{x:-19,y:-24,width:38,height:48,rx:19,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2.5},k);el('path',{d:'M-7,-6 L0,-15 L7,-6Z M-7,6 L0,15 L7,6Z',fill:'#7a4a2e'},k)}
    if(look==='stalk'){el('rect',{x:x-10,y,width:20,height:H,rx:8,fill:'#5aa84a',stroke:'#3a7a2a','stroke-width':2},body);let k=0;for(let yy=y+24;yy<ground-10;yy+=34,k++){const s=k%2?1:-1;el('path',{d:`M${x},${yy} q${s*24},-14 ${s*34},0 q${-s*12},10 ${-s*34},0`,fill:'#7fc86a'},body)}el('circle',{cx:x,cy:y-4,r:10,fill:'#7fc86a'},body)}
    else if(look==='tree'){el('rect',{x:x-9,y:y+H*.3,width:18,height:H*.7,fill:'#7a5a3a'},body);el('ellipse',{cx:x,cy:y+H*.22,rx:w*.55,ry:Math.max(14,H*.24),fill:'#4a9a3a'},body)}
    else if(look==='house'){el('rect',{x:x-w/2,y:y+18,width:w,height:Math.max(0,H-18),fill:'#e8c89a',stroke:'#8a6a4a','stroke-width':2},body);el('path',{d:`M${x-w/2-6},${y+20} L${x},${y} L${x+w/2+6},${y+20}Z`,fill:'#c9413a'},body);el('rect',{x:x-8,y:ground-22,width:16,height:22,fill:'#7a4a2e'},body)}
    else if(look==='rocket'){el('path',{d:`M${x-w/3},${ground} V${y+26} Q${x},${y-6} ${x+w/3},${y+26} V${ground}Z`,fill:'#e8ecf4',stroke:'#8a92a8','stroke-width':2},body);el('circle',{cx:x,cy:y+40,r:8,fill:'#8fd6ff',stroke:'#4a6a8a','stroke-width':2},body);el('path',{d:`M${x-w/3},${ground} l-12,0 l12,-24Z M${x+w/3},${ground} l12,0 l-12,-24Z`,fill:'#e8413e'},body)}
    else if(look==='light'){el('path',{d:`M${x-w/3},${ground} L${x-w/5},${y+16} H${x+w/5} L${x+w/3},${ground}Z`,fill:'#fff4e6',stroke:'#8a6a4a','stroke-width':2},body);for(let yy=y+40;yy<ground-10;yy+=40)el('rect',{x:x-w/4,y:yy,width:w/2,height:12,fill:'#e8413e'},body);el('rect',{x:x-12,y,width:24,height:16,rx:3,fill:'#ffe066'},body)}
    else{el('rect',{x:x-w/2,y,width:w,height:H,rx:6,fill:col,stroke:darker(col,.65),'stroke-width':2},body);el('rect',{x:x-w/2+6,y:y+4,width:8,height:Math.max(0,H-8),rx:4,fill:'#fff',opacity:.25},body);
      const f=el('g',{transform:`translate(${x},${y-16})`},body);el('circle',{r:16,fill:'#f4c8a0',stroke:'#a8743a','stroke-width':1.5},f);[-6,6].forEach(xx=>el('circle',{cx:xx,cy:-2,r:2.6,fill:'#241a3a'},f));el('path',{d:'M-6,6 q6,5 12,0',stroke:'#3a2418','stroke-width':2,fill:'none'},f);el('path',{d:'M-14,-8 q14,-16 28,0',fill:darker(col,.6)},f)}};
  draw();if(name)el('text',{x,y:ground+22,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#fff4e6',stroke:'#1d1840','stroke-width':3,'paint-order':'stroke'},g).textContent=name;
  const back=p=>1+2.70158*Math.pow(p-1,3)+1.70158*Math.pow(p-1,2);
  return{g,get h(){return H},grip(b){grip=b;draw()},set(h2,anim=true){const h0=H;if(!anim||RM){H=h2;draw();return}tween(480,(t,p)=>{H=h0+(h2-h0)*back(p);draw()},()=>{H=h2;draw()})}}}

W.compare={scene:'library',
notes:`<p>Comparison word problems as two tall things side by side: block towers with faces on top, beanstalks, a tree and a house, a rocket and a lighthouse. The story is read a line at a time and each one grows as it's mentioned. The other one starts the same height as the first; she drags it taller or shorter to match the story (it boings into place) and Checks: the wrong way gives a new story. The right way shows the gap; then she sets the answer on a scoreboard and Checks.</p>
<p>The heart of it is reading, not keywords: "Ali has 8. That is 6 fewer than Sam" says "fewer", but Sam's tower is the taller one. Rounds: 6 fewer; a beanstalk 5 m taller; the "fewer" trap; a tree 12 m taller than the house; the gap between two towers; a rocket 25 m taller than a lighthouse.</p>`,
mount(root){
  /* k: [name, value, look, colour], o: [name, look, colour], on/kn: how to say them, d: difference, dir: other is taller (+1) or shorter (−1) */
  const R=[
    {v:[[14,6],[16,7],[15,8]],f:([a,d])=>({w:['Sam','Ali'],l:[['My tower has',{n:a,id:'a'},'blocks.'],['Mine has',{n:d,id:'b'},'fewer.']],q:'How many blocks in Ali’s tower?',k:['Sam',a,'blocks','#8fd6ff'],o:['Ali','blocks','#ff9ed2'],on:'Ali’s tower',kn:'Sam’s',d,dir:-1,u:''})},
    {v:[[9,5],[8,7],[7,4]],f:([a,d])=>({w:['Zoe','Max'],l:[['My beanstalk is',{n:a,id:'a',t:`${a} m`},'tall.'],['Mine is',{n:d,id:'b',t:`${d} m`},'taller!']],q:'How tall is Max’s beanstalk?',k:['Zoe',a,'stalk'],o:['Max','stalk'],on:'Max’s beanstalk',kn:'Zoe’s',d,dir:1,u:' m'})},
    {v:[[8,6],[9,4],[7,5]],f:([a,d])=>({w:['Ali','Ali'],l:[['My tower has',{n:a,id:'a'},'blocks.'],['That’s',{n:d,id:'b'},'fewer than Sam’s.']],q:'How many blocks in Sam’s tower?',k:['Ali',a,'blocks','#ff9ed2'],o:['Sam','blocks','#8fd6ff'],on:'Sam’s tower',kn:'Ali’s',d,dir:1,u:''})},
    {v:[[30,12],[26,9],[28,13]],f:([a,d])=>({w:['Pip','Pip'],l:[['The tree is',{n:a,id:'a',t:`${a} m`},'tall.'],['That’s',{n:d,id:'b',t:`${d} m`},'taller than the house.']],q:'How tall is the house?',k:['tree',a,'tree'],o:['house','house'],on:'the house',kn:'the tree',d,dir:-1,u:' m'})},
    {v:[[23,15],[31,17],[27,18]],f:([a,b])=>({w:['Leo','Ava'],l:[['My tower has',{n:a,id:'a'},'blocks.'],['Mine has',{n:b,id:'b'},'blocks.']],q:'How many more blocks does Leo have?',k:['Leo',a,'blocks','#ffc04d'],o:['Ava','blocks','#8ff0c8'],on:'Ava’s tower',kn:'Leo’s',d:a-b,dir:-1,u:'',gap:1})},
    {v:[[41,25],[38,19],[35,22]],f:([a,d])=>({w:['Pip','Pip'],l:[['The rocket is',{n:a,id:'a',t:`${a} m`},'tall.'],['That’s',{n:d,id:'b',t:`${d} m`},'taller than the lighthouse.']],q:'How tall is the lighthouse?',k:['rocket',a,'rocket'],o:['lighthouse','light'],on:'the lighthouse',kn:'the rocket',d,dir:-1,u:' m'})}];
  const S={r:0,busy:true,won:false,pi:{},dir:0,step:0,val:null};
  const board=el('g',{},root),scene=el('g',{},root),gapL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let A=null,B=null,u=1,wheels=null,G=462;const XA=150,XB=300;
  const st=navStone({label:'Next story',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this story again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],q=rr.f(rr.v[(S.pi[S.r]||0)%rr.v.length]);return Object.assign(q,{other:q.k[1]+q.dir*q.d,ans:q.gap?q.d:q.k[1]+q.dir*q.d})};
  const parts=(q,done)=>[['t',q.gap?'the gap':q.o[0]],['o','='],done?['w',`${q.ans}${q.u}`]:['o','?']];
  function drawGap(q,show){gapL.innerHTML='';const yk=G-q.k[1]*u;el('line',{x1:XA-40,x2:XB+46,y1:yk,y2:yk,stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'6 5',opacity:.8},gapL);
    if(!show)return;const yo=G-(q.gap?q.k[1]-q.d:q.other)*u,a=Math.min(yk,yo),b=Math.max(yk,yo),bx=XB+48;el('path',{d:`M${bx},${a+2} h8 V${b-2} h-8 M${bx+8},${(a+b)/2} h6`,fill:'none',stroke:'#fff0a0','stroke-width':2.5},gapL);
    el('text',{x:bx+18,y:(a+b)/2+6,'font-size':17,'font-weight':700,fill:'#fff0a0'},gapL).textContent=q.gap&&!S.won?'?':`${q.d}${q.u}`}
  const setDir=d=>{if(d===S.dir||S.busy||S.step||S.won)return;const q=Q();S.dir=d;SFX.boing?SFX.boing():SFX.tick(d+2);B.set((q.k[1]+d*q.d)*u)};
  const hit=el('rect',{x:XB-60,y:120,width:120,height:350,fill:'transparent'},root);
  const near=p=>{const q=Q();let b=0,bd=1e9;[-1,0,1].forEach(d=>{const y=G-(q.k[1]+d*q.d)*u,dd=Math.abs(p.y-y);if(dd<bd){bd=dd;b=d}});return b};
  interact(hit,{label:'The other one: drag its top up or down',down:p=>{if(!Q().gap)setDir(near(p));return{}},move:p=>{if(!Q().gap)setDir(near(p))},tap:p=>{if(p&&!Q().gap)setDir(near(p))}});
  hit.addEventListener('keydown',e=>{if(Q().gap)return;if(e.key==='ArrowUp'){e.preventDefault();setDir(Math.min(1,S.dir+1))}if(e.key==='ArrowDown'){e.preventDefault();setDir(Math.max(-1,S.dir-1))}});
  function askNumber(q){S.step=1;el('text',{x:540,y:266,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#fff0a0'},ui).textContent=q.gap?'the gap':q.o[0];
    wheels=digitWheels(ui,{x:540,y:340,label:'Scoreboard',onChange:v=>{S.val=v}});popIn(wheels.g,.5)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(S.step===0){if(!S.dir){say(`Drag ${q.on} taller or shorter first.`);return}
      if(S.dir!==q.dir){SFX.wrong();shake(2);S.busy=true;say(`Not that way: ${q.on} should be ${q.dir>0?'taller':'shorter'} than ${q.kn}. A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3800,load);return}
      SFX.chime();B.grip(false);drawGap(q,true);askNumber(q);say(`Yes, ${q.dir>0?'taller':'shorter'}! Now set the scoreboard, then Check.`);return}
    const v=S.val||0,sum=q.gap?`${q.k[1]} − ${q.k[1]-q.d} = ${q.d}`:q.dir>0?`${q.k[1]} + ${q.d} = ${q.ans}`:`${q.k[1]} − ${q.d} = ${q.ans}`;
    if(v===q.ans){S.won=true;wheels.lock(true);drawGap(q,true);roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(XB,G-q.other*u-30,{n:16});
      if(!q.gap){const tg=el('g',{transform:`translate(${XB},${G-q.other*u/2})`},ui);el('rect',{x:-28,y:-14,width:56,height:28,rx:8,fill:'#fff4e6',stroke:'#ffc04d','stroke-width':2.5},tg);el('text',{y:7,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#3a2418'},tg).textContent=`${q.ans}${q.u}`;popIn(tg,.4)}
      say(q.gap?`${sum}: the gap.`:`${sum}${q.u}. ${q.dir>0?'Taller, so add':'Shorter, so take away'}${S.r===2?', even though it says “fewer”':''}.`);if(S.r>=2)unlock('wcompare');later(1400,()=>st.ready(true));return}
    SFX.wrong();S.busy=true;say(`Not ${v}${q.u}. ${q.gap?`The gap is ${q.k[1]} − ${q.k[1]-q.d}`:q.dir>0?`Taller, so add: ${q.k[1]} + ${q.d}`:`Shorter, so take away: ${q.k[1]} − ${q.d}`}. A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3800,load)}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';scene.innerHTML='';gapL.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:true,won:false,dir:q.gap?-1:0,step:0,val:null});st.ready(false);navDots(R.length,S.r);
    const card=storyCard(board,{lines:q.l,ask:q.q,hidden:true,who:q.w}),top=92+card.h+56;u=(G-top)/(q.k[1]+q.d);
    el('rect',{x:40,y:G,width:420,height:6,rx:3,fill:'#6a4a3a'},scene);
    A=towerFig(scene,{x:XA,ground:G,h:0,look:q.k[2],col:q.k[3],name:q.k[0]});A.g.setAttribute('opacity',0);B=towerFig(scene,{x:XB,ground:G,h:0,look:q.o[1],col:q.o[2],name:q.o[0]});B.g.setAttribute('opacity',0);
    decQ(qL,parts(q,false),false,guide);decGo(ui,540,486,'Check',check,'Check');say('Listen to the story…');
    tellStory(card,[()=>{A.g.setAttribute('opacity',1);A.set(q.k[1]*u)},()=>{B.g.setAttribute('opacity',1);B.set((q.gap?q.k[1]-q.d:q.k[1])*u);drawGap(q,false)}],()=>{S.busy=false;
      if(q.gap){drawGap(q,true);askNumber(q);say('How big is the gap? Set the scoreboard, then Check.')}
      else{B.grip(true);say(`Drag ${q.on} taller or shorter, then Check.`)}})}
  W.compare.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
