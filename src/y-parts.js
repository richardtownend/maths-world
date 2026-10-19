/* ---------- 1. Parts: What's in the bag? (a balance scale) ---------- */
/* the mystery thing in a story: a bag, a pencil case, a bus, a tree, a box, a book; its tag shows "?" or her number */
function mysteryFig(parent,x,y,kind){const g=el('g',{transform:`translate(${x},${y})`},parent);
  if(kind==='case'){el('rect',{x:-28,y:-14,width:56,height:26,rx:10,fill:'#7a5ad0',stroke:'#4a3a8a','stroke-width':2},g);el('line',{x1:-24,x2:24,y1:-6,y2:-6,stroke:'#ffc04d','stroke-width':2.5},g)}
  else if(kind==='bus'){el('rect',{x:-32,y:-18,width:64,height:30,rx:7,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},g);[-20,-4,12].forEach(xx=>el('rect',{x:xx,y:-13,width:12,height:10,rx:2,fill:'#e8f4ff'},g));[-18,18].forEach(xx=>el('circle',{cx:xx,cy:13,r:6,fill:'#241a3a'},g))}
  else if(kind==='tree'){el('rect',{x:-5,y:-2,width:10,height:16,fill:'#6a4224'},g);el('circle',{cy:-16,r:22,fill:'#5aa84a'},g);el('circle',{cx:-14,cy:-8,r:12,fill:'#4a9a3a'},g);el('circle',{cx:14,cy:-8,r:12,fill:'#4a9a3a'},g)}
  else if(kind==='box'){el('rect',{x:-28,y:-16,width:56,height:30,rx:3,fill:'#c9a77a',stroke:'#8a6a4a','stroke-width':2},g);el('path',{d:'M-28,-16 L-20,-24 H20 L28,-16',fill:'#b8946a',stroke:'#8a6a4a','stroke-width':2},g);storyIcon(g,-10,-20,'greenapple',.8);storyIcon(g,8,-20,'greenapple',.8)}
  else if(kind==='book'){el('path',{d:'M-28,-14 Q-14,-20 0,-14 Q14,-20 28,-14 V14 Q14,8 0,14 Q-14,8 -28,14Z',fill:'#fff8ec',stroke:'#c9a77a','stroke-width':2},g);el('line',{x1:0,x2:0,y1:-14,y2:14,stroke:'#c9a77a','stroke-width':2},g)}
  else{el('path',{d:'M-22,14 Q-26,-12 -10,-16 L-4,-24 L4,-24 L10,-16 Q26,-12 22,14Z',fill:'#a8743a',stroke:'#6a4224','stroke-width':2},g);el('path',{d:'M-6,-22 q6,6 12,0',stroke:'#ffc04d','stroke-width':3,fill:'none'},g)}
  const tg=el('g',{transform:`translate(0,${kind==='tree'?-48:-40})`},g),r=el('rect',{x:-24,y:-13,width:48,height:26,rx:8,fill:'#f4eefa',stroke:'#9a6cff','stroke-width':2},tg),t=el('text',{y:7,'text-anchor':'middle','font-size':18,'font-weight':700,fill:'#9a6cff'},tg);t.textContent='?';
  popIn(g,.4);return{g,set(v){t.textContent=v==null?'?':String(v);t.setAttribute('fill',v==null?'#9a6cff':'#3a2418');const w=Math.max(48,String(v??'?').length*12+18);r.setAttribute('x',-w/2);r.setAttribute('width',w)}}}
/* a balance scale: things on each pan; let go and it tips to the heavier side */
function balanceKit(parent,{cx=235,cy=300,L=142,drop=78}={}){const g=el('g',{},parent);let ang=0;
  el('path',{d:`M${cx-40},470 L${cx},${cy+6} L${cx+40},470Z`,fill:'#6a4a3a',stroke:'#3a2418','stroke-width':2},g);el('rect',{x:cx-60,y:466,width:120,height:10,rx:4,fill:'#4a3428'},g);
  const wedge=el('g',{},g);el('rect',{x:cx-6,y:cy-26,width:12,height:52,rx:4,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},wedge);el('circle',{cx,cy:cy-28,r:9,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},wedge);
  const beam=el('g',{},g);el('rect',{x:cx-L-8,y:cy-6,width:2*L+16,height:12,rx:6,fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':2},beam);el('circle',{cx,cy,r:9,fill:'#fff0a0',stroke:'#7a5a2a','stroke-width':2},beam);
  const pans=[-1,1].map(sd=>{const p=el('g',{},g),str=el('path',{fill:'none',stroke:'#d8c6a4','stroke-width':2},p),pan=el('g',{},p);el('path',{d:'M-85,0 Q0,26 85,0Z',fill:'#c9a24a',stroke:'#7a5a2a','stroke-width':2},pan);const load=el('g',{},pan);return{p,str,pan,load,sd}});
  function pose(){const a=ang*Math.PI/180;beam.setAttribute('transform',`rotate(${ang.toFixed(2)},${cx},${cy})`);
    pans.forEach(o=>{const ex=cx+o.sd*L*Math.cos(a),ey=cy+o.sd*L*Math.sin(a);o.pan.setAttribute('transform',`translate(${ex.toFixed(1)},${(ey+drop).toFixed(1)})`);o.str.setAttribute('d',`M${ex},${ey} L${ex-82},${ey+drop} M${ex},${ey} L${ex+82},${ey+drop}`)})}
  pose();
  return{g,pan:sd=>pans[sd<0?0:1].load,
    hold(){ang=0;pose()},
    letGo(l,r,done){const w0=wedge;tween(300,t=>{w0.setAttribute('transform',`translate(0,${(-60*t).toFixed(1)})`);w0.setAttribute('opacity',(1-t).toFixed(2))});SFX.whoosh&&SFX.whoosh();let tgt=l===r?0:clamp((r-l)/Math.max(l,r,1)*60,-16,16);if(l!==r&&Math.abs(tgt)<5)tgt=Math.sign(r-l)*5;const a0=ang;
      tween(1400,(t,p)=>{ang=tgt+(a0-tgt)*Math.cos(p*Math.PI*3)*Math.exp(-p*3.2);pose()},()=>{ang=tgt;pose();if(l!==r)SFX.thud&&SFX.thud();done&&done()})}}}

W.parts={scene:'library',
notes:`<p>Part–whole word problems on a balance scale. The story is read a line at a time, and each thing in it lands on the scale as it's read: Leo's mystery bag and the 8 marbles he won on one pan, the 20 he has now on the other. Pip holds the scale level with a wedge. She types what must be in the mystery thing and lets go: the scale balances, or tips to the heavier side. Then the scale turns into the bar picture of the story.</p>
<p>Rounds: red and blue pens in a pencil case (find the whole), people getting off a bus, Mia's shells (the "more" trap: she found 9 more and now has 23, so the 23 is already everything), birds flying from a tree, red and green apples in a box, pages read on two days. A wrong answer gives a new story.</p>`,
mount(root){
  /* items: [side, n|null, kind, name, line]; the null one is the mystery (qk: its look) */
  const R=[
    {v:[[8,6],[9,7],[7,5]],f:([a,b])=>({w:['Jo','Jo','Jo'],l:[['I’ve got',{n:a,id:'a'},'red pens'],['and',{n:b,id:'b'},'blue pens.'],['They all go in my pencil case.']],q:'How many pens are in Jo’s case?',qk:'case',
      it:[[-1,a,'redpen','red',0],[-1,b,'bluepen','blue',1],[1,null,'pen','in the case',2]]})},
    {v:[[20,7],[24,9],[22,8]],f:([W,o])=>({w:['driver','driver'],l:[['My bus had',{n:W,id:'a'},'people on it.'],[{n:o,id:'b'},'people just got off.']],q:'How many are still on the bus?',qk:'bus',
      it:[[1,W,'person','at the start',0],[-1,o,'person','got off',1],[-1,null,'person','still on',2]]})},
    {v:[[23,9],[21,8],[25,7]],f:([W,p])=>({w:['Mia','Mia','Mia'],l:[['I had some shells in my bag.'],['I found',{n:p,id:'a'},'more!'],['Now I’ve got',{n:W,id:'b'}]],q:'How many did Mia have at the start?',qk:'bag',
      it:[[-1,null,'shell','at the start',0],[-1,p,'shell','found',1],[1,W,'shell','now',2]]})},
    {v:[[6,11],[8,7],[5,9]],f:([a,b])=>({w:['Pip','Pip','Pip'],l:[['Some birds sat in a tree.'],[{n:a,id:'a'},'flew away.'],[{n:b,id:'b'},'are still in the tree.']],q:'How many were there at first?',qk:'tree',
      it:[[1,null,'bird','at first',0],[-1,a,'bird','flew away',1],[-1,b,'bird','still there',2]]})},
    {v:[[46,28],[52,35],[41,26]],f:([W,r])=>({w:['grocer','grocer'],l:[['This box has',{n:W,id:'a'},'apples.'],[{n:r,id:'b'},'are red. The rest are green.']],q:'How many are green?',qk:'box',
      it:[[1,W,'apple','all',0],[-1,r,'redapple','red',1],[-1,null,'greenapple','green',1]]})},
    {v:[[37,45],[48,36],[29,46]],f:([a,b])=>({w:['Sam','Sam'],l:[['I read',{n:a,id:'a'},'pages on Monday'],['and',{n:b,id:'b'},'on Tuesday.']],q:'How many pages did Sam read in all?',qk:'book',
      it:[[-1,a,'page','Monday',0],[-1,b,'page','Tuesday',1],[1,null,'page','in all',2]]})}];
  const S={r:0,busy:true,won:false,pi:{},val:null,ready:false};
  const board=el('g',{},root),scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let pad=null,goB=null,bal=null,mys=null,card=null;
  const st=navStone({label:'Next story',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this story again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],v=rr.v[(S.pi[S.r]||0)%rr.v.length],q=rr.f(v),m=q.it.find(i=>i[1]==null),same=q.it.filter(i=>i[0]===m[0]&&i!==m),other=q.it.filter(i=>i[0]!==m[0]);
    const os=other.reduce((a,i)=>a+i[1],0),ss=same.reduce((a,i)=>a+i[1],0);return Object.assign(q,{m,ans:os-ss,whole:same.length===0,W:same.length?os:os,known:same[0]})};
  const parts=(q,done)=>[['t',q.m[3]],['o','='],done?['w',q.ans]:['o','?']];
  function place(q,item,i){const [sd,n,kind,name]=item,slot=q.it.filter(x=>x[0]===sd),k=slot.indexOf(item),xx=slot.length>1?(k?42:-42):0,pan=bal.pan(sd);
    if(n==null){mys=mysteryFig(pan,xx,-20,q.qk);mys.g.setAttribute('transform',`translate(${xx},-20) scale(1.15)`);SFX.pop(.9)}else{storyBundle(pan,xx,-16,kind,n,{s:1.1});SFX.plink(3+i)}
    el('text',{x:xx,y:34,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},pan).textContent=name}
  function letGo(){if(S.busy||S.won||!S.ready)return;const q=Q();if(S.val==null){say('Turn the wheels first.');return}
    S.busy=true;pad.lock(true);goB.style.display='none';const v=S.val,side=sd=>q.it.filter(i=>i[0]===sd).reduce((a,i)=>a+(i[1]==null?v:i[1]),0);
    bal.letGo(side(-1),side(1),()=>{const sum=q.whole?q.it.filter(i=>i[1]!=null).map(i=>i[1]).join(' + ')+` = ${q.ans}`:`${q.W} − ${q.known[1]} = ${q.ans}`;
      if(v===q.ans){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(220,330,{n:16});say(`It balances! ${sum}.`);if(S.r>=2)unlock('wparts');
        later(1300,()=>{tween(400,t=>scene.setAttribute('opacity',(1-t).toFixed(2)));const ws=q.whole?q.m:q.it.find(i=>i[0]!==q.m[0]),ps=q.it.filter(i=>i!==ws);
          afterBar(ui,{y:330,whole:q.whole?q.ans:ws[1],parts:ps.map(i=>i[1]==null?q.ans:i[1]),names:ps.map(i=>i[3]),wname:ws[3]});st.ready(true)});return}
      SFX.wrong();const heavy=side(-1)>side(1)?'left':'right';
      say(`It tips to the ${heavy}! ${!q.whole&&v===q.W+q.known[1]?`That adds them, but ${q.W} is already all of them. `:''}${q.whole?'Add the parts':`Take away: ${q.W} − ${q.known[1]}`}. A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4600,load)})}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';scene.innerHTML='';scene.removeAttribute('opacity');ui.querySelectorAll('.kit').forEach(n=>n.remove());[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});
    const q=Q();Object.assign(S,{busy:true,won:false,val:null,ready:false});st.ready(false);navDots(R.length,S.r);
    card=storyCard(board,{lines:q.l,ask:q.q,hidden:true,who:q.w});bal=balanceKit(scene,{cy:Math.max(310,92+card.h+78)});bal.hold();mys=null;decQ(qL,parts(q,false),false,guide);
    const beats=[];q.it.forEach((it,i)=>{const ln=it[4];beats[ln]=(f=>()=>{f&&f();place(q,it,i)})(beats[ln])});
    say('Listen to the story…');
    tellStory(card,beats,()=>{S.busy=false;S.ready=true;pad=numPad(ui,{y:Math.max(250,92+card.h+14),label:`What is ${q.m[3]}?`,onChange:v=>{S.val=v;if(mys)mys.set(v)}});popIn(pad.g,.5);
      goB=decGo(ui,540,486,'Let go of the scale',letGo,'Go');
      say(S.r===0?`What’s in the ${q.qk==='case'?'pencil case':q.qk}? Set it on the wheels, then Go.`:'Set the mystery number, then Go.')})}
  W.parts.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
