/* ---------- 3. Times: Pip's copier and the seesaw ---------- */
/* animals and food, standing on y */
function thingFig(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  const animal=(col,ear)=>{el('ellipse',{cx:0,cy:-18,rx:24,ry:16,fill:col,stroke:darker(col,.7),'stroke-width':2},g);el('circle',{cx:20,cy:-34,r:13,fill:col,stroke:darker(col,.7),'stroke-width':2},g);ear();
    [[-14,-4],[12,-4]].forEach(([lx])=>el('rect',{x:lx,y:-6,width:6,height:8,rx:2,fill:darker(col,.8)},g));el('circle',{cx:24,cy:-36,r:2.2,fill:'#241a3a'},g);el('circle',{cx:31,cy:-31,r:2,fill:'#3a2418'},g);el('path',{d:'M-24,-22 q-10,-6 -8,-16',fill:'none',stroke:col,'stroke-width':4,'stroke-linecap':'round'},g)};
  if(kind==='cat')animal('#ffb36a',()=>{el('path',{d:'M12,-44 l2,-10 l6,7Z M22,-46 l6,-8 l2,10Z',fill:'#ffb36a',stroke:'#b8763a','stroke-width':1.5},g)});
  else if(kind==='dog'||kind==='puppy'||kind==='mum')animal('#c8945e',()=>{el('ellipse',{cx:12,cy:-34,rx:5,ry:10,fill:'#8a5a34'},g)});
  else if(kind==='rabbit')animal('#f0eef8',()=>{el('ellipse',{cx:16,cy:-54,rx:4,ry:13,fill:'#f0eef8',stroke:'#a8a0c0','stroke-width':1.5},g);el('ellipse',{cx:25,cy:-54,rx:4,ry:13,fill:'#f0eef8',stroke:'#a8a0c0','stroke-width':1.5},g)});
  else if(kind==='goat')animal('#e8e0d0',()=>{el('path',{d:'M14,-44 q-6,-10 -14,-8 M24,-46 q-2,-12 -10,-14',fill:'none',stroke:'#8a7a5a','stroke-width':3},g);el('path',{d:'M26,-24 l2,8 l3,-8',fill:'#e8e0d0'},g)});
  else if(kind==='cheese'){el('path',{d:'M-26,0 L26,0 L26,-22 L-26,-6Z',fill:'#ffd23a',stroke:'#c9a02a','stroke-width':2},g);[[-10,-6],[8,-10],[18,-6]].forEach(([cx,cy])=>el('circle',{cx,cy,r:3,fill:'#e8b82a'},g))}
  else if(kind==='pumpkin'){el('ellipse',{cx:0,cy:-16,rx:20,ry:16,fill:'#ff9a3a',stroke:'#c96a1a','stroke-width':1.8},g);[-8,0,8].forEach(dx=>el('path',{d:`M${dx},-31 q${dx*.6},15 0,30`,fill:'none',stroke:'#c96a1a','stroke-width':1.4},g));el('rect',{x:-2,y:-38,width:5,height:8,rx:2,fill:'#5a8a3a'},g)}
  else if(kind==='melon'||kind==='watermelon'){const c=kind==='melon'?'#f0b060':'#3a8a3a';el('ellipse',{cx:0,cy:-18,rx:kind==='melon'?18:28,ry:18,fill:c,stroke:darker(c,.7),'stroke-width':2},g);[-8,0,8].forEach(dx=>el('path',{d:`M${dx},-35 q${dx/2},17 0,34`,fill:'none',stroke:darker(c,.75),'stroke-width':2},g))}
  else el('rect',{x:-20,y:-30,width:40,height:30,rx:5,fill:'#8a92a8'},g);
  return g}
const kgTag=(parent,x,y,t,q=false)=>{const g=el('g',{transform:`translate(${x},${y})`},parent),w=Math.max(40,String(t).length*10+16);el('rect',{x:-w/2,y:-12,width:w,height:24,rx:8,fill:q?'#f4eefa':'#fff4e6',stroke:q?'#9a6cff':'#c9a77a','stroke-width':2},g);
  el('text',{y:6,'text-anchor':'middle','font-size':15,'font-weight':700,fill:q?'#9a6cff':'#3a2418'},g).textContent=t;return g};
/* a seesaw held level by a peg; let go and the heavier side drops */
function seesawKit(parent,{cx=240,cy=432,L=170}={}){const g=el('g',{},parent);let ang=0;
  el('path',{d:`M${cx-30},${cy+44} L${cx},${cy+4} L${cx+30},${cy+44}Z`,fill:'#6a4a3a',stroke:'#3a2418','stroke-width':2},g);
  const plank=el('g',{},g);el('rect',{x:cx-L-10,y:cy-6,width:2*L+20,height:12,rx:5,fill:'#c9945e',stroke:'#7a5a2a','stroke-width':2},plank);
  const seats=[-1,1].map(sd=>el('g',{transform:`translate(${cx+sd*(L-24)},${cy-6})`},plank));
  const peg=el('g',{},g);el('rect',{x:cx-L+40,y:cy+6,width:16,height:38,rx:3,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},peg);el('rect',{x:cx+L-56,y:cy+6,width:16,height:38,rx:3,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},peg);
  const pose=()=>plank.setAttribute('transform',`rotate(${ang.toFixed(2)},${cx},${cy})`);pose();
  return{g,seat:sd=>seats[sd<0?0:1],
    release(l,r,done){tween(250,t=>peg.setAttribute('opacity',(1-t).toFixed(2)));SFX.whoosh&&SFX.whoosh();let tgt=l===r?0:clamp((r-l)/Math.max(l,r,1)*40,-13,13);if(l!==r&&Math.abs(tgt)<6)tgt=Math.sign(r-l)*6;
      tween(1300,(t,p)=>{ang=tgt*(1-Math.cos(p*Math.PI*3)*Math.exp(-p*3.4));pose()},()=>{ang=tgt;pose();if(l!==r)SFX.thud&&SFX.thud();done&&done()})}}}

W.times={scene:'library',
notes:`<p>"Times as heavy" on a seesaw in Pip's kitchen. The story is read a line at a time and the things appear. Copy rounds: the dog sits on one end with "?", and Pip's copier makes copies of the cat (+ and −) onto the other end; Check lets go of the seesaw. It balances when there are as many cats as "times as heavy" says. The copies then line up into a bar, and she types the dog's weight on a keypad.</p>
<p>Turned round, it looks different: a big cheese is 3 times a small one, so she chops the big cheese (a bar) into equal pieces; one piece goes on the seesaw against the small cheese. Rounds: a cat and a dog, a rabbit and a goat (copy); a big and small cheese, a watermelon and a melon (chop); two pumpkins that weigh 24 kg together, the big one 3 times the small (chop into 3 + 1 = 4 pieces); a puppy and its mum, how heavy together. A wrong answer gives a new story.</p>`,
mount(root){
  /* t: copy (big = f × small, small known), chop (big known, small = big ÷ f), both (together known, f+1 pieces), sum (copy, then both together) */
  const R=[
    {v:[[4,3],[5,3],[6,3]],f:([u,f])=>({t:'copy',u,f,big:['dog','dog'],small:['cat','cat'],w:['cat','dog'],l:[['I weigh',{n:u,id:'a',t:`${u} kg`}],['I weigh',{n:f,id:'b'},'times as much as the cat!']],q:'How heavy is the dog?'})},
    {v:[[6,4],[5,3],[7,5]],f:([u,f])=>({t:'many',u,f,W:u*f,big:['goat','goat'],small:['rabbit','rabbit'],w:['rabbit','goat'],l:[['I weigh',{n:u,id:'a',t:`${u} kg`}],['And I weigh',{n:u*f,id:'b',t:`${u*f} kg`}]],q:'How many times as heavy is the goat?'})},
    {v:[[5,3],[4,5],[6,3]],f:([u,f])=>({t:'chop',u,f,W:u*f,big:['big cheese','cheese'],small:['small cheese','cheese'],l:[['A big cheese weighs',{n:u*f,id:'a',t:`${u*f} kg`}],['That is',{n:f,id:'b'},'times as heavy as a small cheese.']],q:'How heavy is the small cheese?'})},
    {v:[[3,4],[6,3],[4,4]],f:([u,f])=>({t:'chop',u,f,W:u*f,big:['watermelon','watermelon'],small:['melon','melon'],l:[['A watermelon weighs',{n:u*f,id:'a',t:`${u*f} kg`}],['That is',{n:f,id:'b'},'times as heavy as a melon.']],q:'How heavy is the melon?'})},
    {v:[[6,3],[5,4],[7,3]],f:([u,f])=>({t:'both',u,f,W:u*(f+1),big:['big pumpkin','pumpkin'],small:['small pumpkin','pumpkin'],w:['farmer','farmer','farmer'],l:[['I’ve got a big and a small pumpkin.'],['Together they weigh',{n:u*(f+1),id:'a',t:`${u*(f+1)} kg`}],['The big one is',{n:f,id:'b'},'times as heavy.']],q:'How heavy is the small pumpkin?'})},
    {v:[[3,5],[4,4],[2,6]],f:([u,f])=>({t:'sum',u,f,big:['mum','mum'],small:['puppy','puppy'],w:['puppy','mum'],l:[['I weigh',{n:u,id:'a',t:`${u} kg`}],['I weigh',{n:f,id:'b'},'times as much!']],q:'How heavy are they together?'})}];
  const S={r:0,busy:true,won:false,pi:{},n:1,step:0,val:null};
  const board=el('g',{},root),scene=el('g',{},root),barL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let ss=null,dev=null,pad=null,goB=null,BY=300;
  const st=navStone({label:'Next story',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this story again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],q=rr.f(rr.v[(S.pi[S.r]||0)%rr.v.length]);return Object.assign(q,{ans:q.t==='many'?q.f:q.t==='copy'?q.u*q.f:q.t==='sum'?q.u*(q.f+1):q.u,pieces:q.t==='both'?q.f+1:q.f})};
  const chopping=q=>q.t==='chop'||q.t==='both';
  const parts=(q,done)=>q.t==='many'?[['t','times as heavy'],['o','='],done?['w',`×${q.f}`]:['o','?']]:[['t',q.t==='copy'?q.big[0]:q.t==='sum'?'together':q.small[0]],['o','='],done?['w',`${q.ans} kg`]:['o','?']];
  /* copy rounds: the pile of copies on the right seat */
  function pile(q){const s=ss.seat(1);s.innerHTML='';for(let i=0;i<S.n;i++){const k=thingFig(s,-40+(i%3)*40,-Math.floor(i/3)*34,q.small[1],.72);if(i===S.n-1&&S.n>1)popIn(k,.3)}kgTag(s,0,-Math.ceil(S.n/3)*34-36,`${q.u} kg each`)}
  /* chop rounds: the big thing as a bar, cut into n pieces */
  function chopBar(q,mark){barL.innerHTML='';const X=90,WW=300;el('text',{x:X,y:BY-10,'font-size':14,'font-weight':700,fill:'#fff0a0'},barL).textContent=q.t==='both'?`both pumpkins: ${q.W} kg`:`${q.big[0]}: ${q.W} kg`;
    el('rect',{x:X,y:BY,width:WW,height:36,rx:6,fill:q.big[1]==='cheese'?'#ffd23a':q.big[1]==='pumpkin'?'#ff9a3a':'#3a8a3a',stroke:'#3a2418','stroke-width':2.5},barL);
    if(q.big[1]==='cheese')[[30,10],[80,24],[150,12],[210,26],[260,14]].forEach(([dx,dy])=>el('circle',{cx:X+dx,cy:BY+dy,r:5,fill:'#e8b82a'},barL));
    else if(q.big[1]==='watermelon'){el('rect',{x:X+5,y:BY+8,width:WW-10,height:24,rx:4,fill:'#e8413e'},barL);for(let k=0;k<12;k++)el('ellipse',{cx:X+16+k*24,cy:BY+18+(k%2)*6,rx:2,ry:3.5,fill:'#241a3a'},barL)}
    else{const sx=X+WW*q.f/(q.f+1);el('rect',{x:sx,y:BY,width:WW-(sx-X),height:36,rx:6,fill:'#ffc070',stroke:'#3a2418','stroke-width':2.5},barL);el('line',{x1:sx,x2:sx,y1:BY-4,y2:BY+40,stroke:'#3a2418','stroke-width':4},barL);
      el('text',{x:(X+sx)/2,y:BY+56,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},barL).textContent='big pumpkin';el('text',{x:(sx+X+WW)/2,y:BY+56,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},barL).textContent='small';}
    for(let i=1;i<S.n;i++)el('line',{x1:X+i*WW/S.n,x2:X+i*WW/S.n,y1:BY-6,y2:BY+42,stroke:'#fff4e6','stroke-width':3,'stroke-dasharray':'5 3'},barL);
    if(mark)kgTag(barL,X+WW/S.n/2,BY+18,'?',true)}
  /* after a copy round balances: the copies line up as a bar */
  function copyBar(q){barL.innerHTML='';const X=90,k=q.f+(q.t==='sum'?1:0),bw=Math.min(60,300/k);el('text',{x:X,y:BY-10,'font-size':14,'font-weight':700,fill:'#fff0a0'},barL).textContent=q.t==='sum'?'mum and puppy':q.big[0];
    for(let i=0;i<k;i++){const last=q.t==='sum'&&i===k-1;el('rect',{x:X+i*bw,y:BY,width:bw,height:34,rx:5,fill:last?'#ff9ed2':'#ffc04d',stroke:'#a8743a','stroke-width':2},barL);el('text',{x:X+i*bw+bw/2,y:BY+23,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},barL).textContent=q.u}
    bracket(barL,X,X+k*bw,BY+40);kgTag(barL,X+k*bw/2,BY+66,'?',true)}
  function setN(q,n){S.n=n;SFX.crunch?SFX.crunch():SFX.pop(1);if(chopping(q))chopBar(q,false);else pile(q)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(S.step===0){S.busy=true;dev.lock(true);const ok=S.n===q.pieces;
      if(chopping(q)){const piece=q.W/S.n,X=90,WW=300,pw=WW/S.n,f=el('rect',{x:X,y:BY,width:pw,height:36,rx:6,fill:q.big[1]==='cheese'?'#ffd23a':q.big[1]==='pumpkin'?'#ff9a3a':'#3a8a3a',stroke:'#3a2418','stroke-width':2.5},scene);
        const tx=240+146-pw/2,ty=432-6-36-4;tween(600,t=>f.setAttribute('transform',`translate(${(lerp(0,tx-X,t)).toFixed(1)},${(lerp(0,ty-BY,t)).toFixed(1)})`),()=>{f.remove();const sp=ss.seat(1);el('rect',{x:-pw/2,y:-36,width:pw,height:36,rx:6,fill:f.getAttribute('fill'),stroke:'#3a2418','stroke-width':2.5},sp);ss.release(q.u,piece,after)},ease.inOut)}
      else ss.release(q.u*q.f,q.u*S.n,after);
      function after(){if(ok&&q.t==='many'){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(240,360,{n:16});say(`${q.f} × ${q.u} kg = ${q.W} kg, so the ${q.big[0]} is ${q.f} times as heavy.`);if(S.r>=2)unlock('wtimes');later(1400,()=>st.ready(true));return}
        if(ok){SFX.chime();S.step=1;[...ui.children].forEach(n=>{if(n!==guide.g&&n!==goB)n.remove()});if(chopping(q))chopBar(q,true);else copyBar(q);
          pad=numPad(ui,{y:262,post:' kg',label:`How heavy: ${parts(q)[0][1]}`,onChange:v=>{S.val=v}});popIn(pad.g,.5);S.busy=false;say(`Balanced! ${q.q}`);return}
        SFX.wrong();const why=q.t==='both'&&S.n===q.f?`The pieces are cut from both pumpkins, so the small one is a piece too.`:q.t==='many'?`${S.n} ${q.small[0]}s weigh ${S.n*q.u} kg, not ${q.W} kg.`:q.t==='both'?`The big one is ${q.f} small ones, plus the small one: ${q.f+1} pieces.`:chopping(q)?`${q.f} times as heavy means the big one is ${q.f} small ones: ${q.f} pieces.`:`${q.f} times as heavy means ${q.f} ${q.small[0]}s.`;
        say(`It tips! ${why} A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4400,load)}
      return}
    if(S.val==null){say('Set the weight first, then Check.');return}
    const how=q.t==='copy'?`${q.f} × ${q.u} kg = ${q.ans} kg`:q.t==='sum'?`${q.f} × ${q.u} = ${q.u*q.f} for mum, plus ${q.u} for the puppy: ${q.ans} kg`:q.t==='both'?`${q.f} + 1 = ${q.f+1} pieces, and ${q.W} ÷ ${q.f+1} = ${q.ans} kg`:`${q.W} ÷ ${q.f} = ${q.ans} kg`;
    if(S.val===q.ans){S.won=true;pad.lock(true);roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(240,360,{n:16});say(`${how}.`);if(S.r>=2)unlock('wtimes');later(1400,()=>st.ready(true));return}
    SFX.wrong();S.busy=true;const meth=q.t==='copy'?`${q.f} lots of ${q.u} kg`:q.t==='sum'?`${q.f} lots of ${q.u} kg for mum, then add the puppy`:q.t==='both'?`share ${q.W} kg into ${q.f+1} equal pieces`:`share ${q.W} kg into ${q.f} equal pieces`;say(`Not ${S.val} kg. It’s ${meth}. A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4200,load)}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';scene.innerHTML='';barL.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:true,won:false,n:1,step:0,val:null});st.ready(false);navDots(R.length,S.r);
    const card=storyCard(board,{lines:q.l,ask:q.q,hidden:true,who:q.w});BY=Math.max(270,92+card.h+34);ss=seesawKit(scene);decQ(qL,parts(q,false),false,guide);
    const L=ss.seat(-1);
    const beat1=()=>{if(q.t==='copy'||q.t==='sum'||q.t==='many'){pile(q);SFX.pop(1.1)}else if(q.t==='chop'){chopBar(q,false);SFX.pop(1.1)}else{chopBar(q,false);SFX.pop(1.1)}};
    const beat2=()=>{if(chopping(q)){const k=thingFig(L,0,0,q.small[1],1.25);popIn(k,.4);kgTag(L,-58,-30,'?',true)}else{const k=thingFig(L,0,0,q.big[1],1.6);popIn(k,.4);q.t==='many'?kgTag(L,-62,-40,`${q.W} kg`):kgTag(L,-62,-40,'?',true)}SFX.boing&&SFX.boing()};
    say('Listen to the story…');
    tellStory(card,[beat1,beat2],()=>{S.busy=false;
      if(chopping(q)){dev=stepper(ui,{x:525,y:330,min:1,max:8,val:1,w:150,label:'Pieces to cut',fmt:n=>String(n),onChange:n=>setN(q,n)});el('text',{x:525,y:290,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#fff0a0'},ui).textContent='pieces';
        say(q.t==='both'?'Cut both pumpkins into equal pieces, so one piece balances the small pumpkin. Then Check.':`Chop it so one piece balances the ${q.small[0]}. Then Check.`)}
      else{dev=stepper(ui,{x:525,y:330,min:1,max:8,val:1,w:150,label:'Copies',fmt:n=>`×${n}`,onChange:n=>setN(q,n)});
        const cp=el('g',{transform:'translate(525,268)'},ui);el('rect',{x:-44,y:-26,width:88,height:44,rx:8,fill:'#5a6a8a',stroke:'#2a3a5a','stroke-width':2},cp);el('rect',{x:-30,y:-34,width:60,height:10,rx:3,fill:'#8a9ab8'},cp);el('text',{y:4,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},cp).textContent='COPIER';
        say(`Copy the ${q.small[0]} until it balances the ${q.big[0]}. Then Check.`)}
      goB=decGo(ui,540,486,'Check',check,'Check')})}
  W.times.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
