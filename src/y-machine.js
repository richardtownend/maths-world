/* ---------- 6. Machine: the Number Muncher ("I think of a number") ---------- */
const MOPS={'+':(a,b)=>a+b,'−':(a,b)=>a-b,'×':(a,b)=>a*b,'÷':(a,b)=>a/b},MINV={'+':'−','−':'+','×':'÷','÷':'×'};
const fmtN=v=>Number.isInteger(v)?String(v):String(+v.toFixed(2));
/* the Muncher: eats a number, gulps potions, spits out the answer */
function muncherFig(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),b=el('g',{},g);
  el('path',{d:'M-34,26 Q-42,-30 0,-36 Q42,-30 34,26 Q0,34 -34,26Z',fill:'#9a6cff',stroke:'#5a3aa0','stroke-width':3},b);
  [[-14,-18],[14,-18]].forEach(([ex,ey])=>{el('circle',{cx:ex,cy:ey,r:9,fill:'#fff'},b);el('circle',{cx:ex+2,cy:ey+1,r:4,fill:'#241a3a'},b)});
  const mouth=el('g',{},b);const mo=el('path',{d:'M-20,2 Q0,22 20,2Z',fill:'#3a1a4a'},mouth);[-12,-4,4,12].forEach(tx=>el('path',{d:`M${tx-3},3 l3,6 l3,-6Z`,fill:'#fff'},mouth));
  el('path',{d:'M-30,-28 l-8,-14 l14,8 M30,-28 l8,-14 l-14,8',fill:'#ff9ed2'},b);
  return{g,chomp(){SFX.gulp&&SFX.gulp();if(RM)return;tween(380,(t,p)=>mo.setAttribute('d',`M-20,2 Q0,${(22-18*Math.sin(p*Math.PI*2)).toFixed(1)} 20,2Z`))},
    burp(){SFX.burp&&SFX.burp();if(RM)return;tween(300,(t,p)=>b.setAttribute('transform',`scale(${(1+Math.sin(p*Math.PI)*.12).toFixed(3)})`))}}}

W.machine={scene:'library',
notes:`<p>"I think of a number" problems, as the Number Muncher. The Muncher ate a number, gulped the potions in the story (×2, then +3) and spat out 15. Underneath is the rewind track, running the other way. She drags (or taps) an undo potion under each potion: −3 under +3, ÷2 under ×2. Go rewinds the tape: if the undo potions are right, she works out the number and sets it on the dial; Check feeds it to the Muncher, who gulps the potions and spits out 15 if she's right.</p>
<p>Rounds: +5 makes 12; ×4 makes 20; ×2 then +3 makes 15; +4 then ×3 makes 27; ÷2 then −4 makes 3; ×5 then −7 makes 28. The undo potions include the same potion as the story (+3 under +3), the commonest mistake; one-step rounds have a decoy too. Wrong undo potions show where the rewind goes wrong, then a new number.</p>`,
mount(root){
  const R=[
    {p:[{say:[['I ate a number!'],['I gulped',{n:5,id:'a',t:'+5'},'and spat out',{n:12,id:'b'}]],ops:[['+',5]],out:12},{say:[['I ate a number!'],['I gulped',{n:7,id:'a',t:'+7'},'and spat out',{n:15,id:'b'}]],ops:[['+',7]],out:15},{say:[['I ate a number!'],['I gulped',{n:4,id:'a',t:'+4'},'and spat out',{n:13,id:'b'}]],ops:[['+',4]],out:13}]},
    {p:[{say:[['I ate a number!'],['I gulped',{n:4,id:'a',t:'×4'},'and spat out',{n:20,id:'b'}]],ops:[['×',4]],out:20},{say:[['I ate a number!'],['I gulped',{n:3,id:'a',t:'×3'},'and spat out',{n:24,id:'b'}]],ops:[['×',3]],out:24},{say:[['I ate a number!'],['I gulped',{n:5,id:'a',t:'×5'},'and spat out',{n:30,id:'b'}]],ops:[['×',5]],out:30}]},
    {p:[{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'×2'},'then',{n:3,id:'b',t:'+3'}],['and spat out',{n:15,id:'c'}]],ops:[['×',2],['+',3]],out:15},{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'×2'},'then',{n:5,id:'b',t:'+5'}],['and spat out',{n:21,id:'c'}]],ops:[['×',2],['+',5]],out:21},{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'×2'},'then',{n:1,id:'b',t:'+1'}],['and spat out',{n:19,id:'c'}]],ops:[['×',2],['+',1]],out:19}]},
    {p:[{say:[['I ate a number!'],['I gulped',{n:4,id:'a',t:'+4'},'then',{n:3,id:'b',t:'×3'}],['and spat out',{n:27,id:'c'}]],ops:[['+',4],['×',3]],out:27},{say:[['I ate a number!'],['I gulped',{n:3,id:'a',t:'+3'},'then',{n:4,id:'b',t:'×4'}],['and spat out',{n:36,id:'c'}]],ops:[['+',3],['×',4]],out:36},{say:[['I ate a number!'],['I gulped',{n:1,id:'a',t:'+1'},'then',{n:5,id:'b',t:'×5'}],['and spat out',{n:40,id:'c'}]],ops:[['+',1],['×',5]],out:40}]},
    {p:[{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'÷2'},'then',{n:4,id:'b',t:'−4'}],['and spat out',{n:3,id:'c'}]],ops:[['÷',2],['−',4]],out:3},{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'÷2'},'then',{n:5,id:'b',t:'−5'}],['and spat out',{n:4,id:'c'}]],ops:[['÷',2],['−',5]],out:4},{say:[['I ate a number!'],['I gulped',{n:2,id:'a',t:'÷2'},'then',{n:3,id:'b',t:'−3'}],['and spat out',{n:5,id:'c'}]],ops:[['÷',2],['−',3]],out:5}]},
    {p:[{say:[['I ate a number!'],['I gulped',{n:5,id:'a',t:'×5'},'then',{n:7,id:'b',t:'−7'}],['and spat out',{n:28,id:'c'}]],ops:[['×',5],['−',7]],out:28},{say:[['I ate a number!'],['I gulped',{n:3,id:'a',t:'×3'},'then',{n:4,id:'b',t:'−4'}],['and spat out',{n:23,id:'c'}]],ops:[['×',3],['−',4]],out:23},{say:[['I ate a number!'],['I gulped',{n:4,id:'a',t:'×4'},'then',{n:5,id:'b',t:'−5'}],['and spat out',{n:27,id:'c'}]],ops:[['×',4],['−',5]],out:27}]}];
  const S={r:0,busy:true,won:false,pi:{},slot:[],dial:false,val:0};
  const board=el('g',{},root),mach=el('g',{},root),flow=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root),dragL=el('g',{},root);const guide=pipGuide(ui);
  let tiles=null,slotXY=[],Y1=280,Y2=380,mun=null,goB=null,chk=null,dial=null,shown=0;
  const st=navStone({label:'Next number',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this number again',onTap:()=>load()});
  const Q=()=>{const q=R[S.r].p[(S.pi[S.r]||0)%R[S.r].p.length];let v=q.out;for(let i=q.ops.length-1;i>=0;i--){const [o,n]=q.ops[i];v=MOPS[MINV[o]](v,n)}return Object.assign({},q,{ans:v})};
  const parts=(q,done)=>[['t','its number'],['o','='],done?['w',q.ans]:['o','?']];
  const opT=([o,n])=>`${o}${n}`;
  /* a potion bottle with its label */
  const box=(g,x,y,t,{col='#ff9ed2',w=64}={})=>{const b=el('g',{transform:`translate(${x},${y})`},g);el('rect',{x:-9,y:-30,width:18,height:12,rx:3,fill:'#c9b8e8',stroke:'#5a3aa0','stroke-width':2},b);
    el('rect',{x:-w/2,y:-20,width:w,height:44,rx:14,fill:col,stroke:'#fff0a0','stroke-width':2},b);el('rect',{x:-w/2+6,y:-14,width:8,height:20,rx:4,fill:'#fff',opacity:.35},b);
    el('text',{y:9,'text-anchor':'middle','font-size':21,'font-weight':800,fill:'#241a3a'},b).textContent=t;return b};
  const ball=(g,x,y,t,col='#fff4e6')=>{const b=el('g',{transform:`translate(${x},${y})`},g);el('circle',{r:24,fill:col,stroke:'#c9a77a','stroke-width':2.5},b);el('text',{y:8,'text-anchor':'middle','font-size':20,'font-weight':700,fill:t==='?'?'#9a6cff':'#3a2418'},b).textContent=t;return b};
  const arrow=(g,x0,x1,y)=>el('path',{d:`M${x0},${y} H${x1} M${x1+(x1>x0?-8:8)},${y-6} L${x1},${y} L${x1+(x1>x0?-8:8)},${y+6}`,fill:'none',stroke:'#d8c6e4','stroke-width':3,'stroke-linecap':'round'},g);
  const XS=n=>[...Array(n+2)].map((_,i)=>90+i*(350/(n+1)));
  function drawMachine(q){mach.innerHTML='';const n=q.ops.length,xs=XS(n);
    mun=muncherFig(mach,xs[0],Y1,.82);
    q.ops.forEach((op,i)=>{if(i<shown){arrow(mach,(i?xs[i]+34:xs[0]+32),xs[i+1]-36,Y1);box(mach,xs[i+1],Y1,opT(op))}});if(shown>n){arrow(mach,xs[n]+34,xs[n+1]-28,Y1);ball(mach,xs[n+1],Y1,String(q.out),'#ffe9a8')}
    if(shown<=n||!S.track)return;
    el('text',{x:xs[n+1]+30,y:Y2+6,'font-size':15,'font-weight':700,fill:'#8ff0c8'},mach).textContent='⏪';
    ball(mach,xs[n+1],Y2,String(q.out),'#ffe9a8');slotXY=[];for(let i=n-1;i>=0;i--){arrow(mach,(i===n-1?xs[n+1]-28:xs[i+2]-36),xs[i+1]+36,Y2)}
    q.ops.forEach((op,i)=>{slotXY[i]=[xs[i+1],Y2];const s=el('g',{transform:`translate(${xs[i+1]},${Y2})`},mach);el('rect',{x:-34,y:-24,width:68,height:50,rx:14,fill:'rgba(255,244,230,.08)',stroke:'#8ff0c8','stroke-width':2,'stroke-dasharray':'6 5'},s);
      if(S.slot[i])box(s,0,0,S.slot[i],{col:'#8ff0c8'});interact(s,{label:`Undo slot under ${opT(op)}`,tap:()=>{if(S.busy||S.won||S.dial)return;if(S.slot[i]){S.slot[i]=null;SFX.pop(.8);drawMachine(q)}}})});
    arrow(mach,xs[1]-36,xs[0]+28,Y2);ball(mach,xs[0],Y2,'?')}
  function place(t,p){const q=Q();if(S.busy||S.won||S.dial)return false;let i=-1;if(p){i=slotXY.findIndex(([x,y])=>Math.abs(p.x-x)<44&&Math.abs(p.y-y)<34);if(i<0)return false}
    else{for(let k=q.ops.length-1;k>=0;k--)if(!S.slot[k]){i=k;break}if(i<0)return false}
    S.slot[i]=t;SFX.plink(4);drawMachine(q);return true}
  function drawTiles(q){if(tiles)tiles.remove();tiles=el('g',{},ui);const opts=[];q.ops.forEach(([o,n])=>{opts.push(`${MINV[o]}${n}`,`${o}${n}`)});if(q.ops.length===1){const [o,n]=q.ops[0];opts.push('+−'.includes(o)?`÷${n}`:`−${n}`)}
    el('text',{x:58,y:Y2+56,'font-size':13,'font-weight':700,fill:'#8ff0c8'},tiles).textContent='undo potions:';
    sshuffle([...new Set(opts)],q.out).forEach((t,i)=>{const x=100+i*82,y=Y2+92,b=box(tiles,x,y,t,{col:'#8ff0c8'});
      interact(b,{label:`Undo tile ${t}`,down:()=>({}),move:(p,p0,cx)=>{if(S.busy||S.won||S.dial)return;if(!cx.gh){cx.gh=box(dragL,p.x,p.y,t,{col:'#8ff0c8'})}cx.gh.setAttribute('transform',`translate(${p.x},${p.y})`)},
        up:(p,p0,cx)=>{if(!cx.gh)return;cx.gh.remove();place(t,p)},tap:()=>place(t,null)})})}
  function rewindFX(done){const o=el('g',{},FX);for(let k=0;k<14;k++)el('rect',{x:-200,y:k*44,width:1000,height:6,fill:'#fff',opacity:.08},o);el('text',{x:300,y:250,'text-anchor':'middle','font-size':44,'font-weight':900,fill:'#fff0a0',opacity:.85},o).textContent='⏪ REWIND';
    SFX.whoosh&&SFX.whoosh();tween(1000,(t,p)=>o.setAttribute('transform',`translate(0,${(p*90%30).toFixed(1)})`),()=>{o.remove();done()})}
  const chain=(v0,ops)=>{let v=v0;return ops.map(([o,k])=>{const a=v;v=MOPS[o](v,k);return `${fmtN(a)} ${o} ${k} = ${fmtN(v)}`}).join(', ')};
  const backOps=q=>q.ops.slice().reverse().map(([o,k])=>[MINV[o],k]);
  function go2(){if(S.busy||S.won)return;const q=Q(),n=q.ops.length;if(S.slot.filter(Boolean).length<n){say('Put an undo potion under every potion, then Go.');return}
    const good=q.ops.every((op,i)=>S.slot[i]===`${MINV[op[0]]}${op[1]}`);S.busy=true;goB.style.display='none';
    if(good){rewindFX(()=>{S.busy=false;S.dial=true;SFX.chime();dial=digitWheels(ui,{x:540,y:340,label:'Number dial',onChange:v=>{S.val=v}});popIn(dial.g,.5);
        el('text',{x:540,y:272,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},ui).textContent='its number';chk=decGo(ui,540,486,'Check: feed it to the Muncher',feed,'Feed');
        say('Good undo potions! Now set the dial and feed it.')});return}
    flow.innerHTML='';const xs=XS(n);let v=q.out;const steps=[];for(let i=n-1;i>=0;i--){const o=S.slot[i][0],k=+S.slot[i].slice(1);v=MOPS[o](v,k);steps.push([i,v])}
    rewindFX(()=>{steps.forEach(([i,val],j)=>later(200+j*800,()=>{SFX.tick(j+3);const b=ball(flow,0,0,fmtN(val),'#d8f8e8');b.setAttribute('transform',`translate(${(xs[i]+xs[i+1])/2},${Y2-36}) scale(.72)`);popIn(b,.3)}));
      later(200+n*800+400,()=>{SFX.wrong();const firstBad=[...Array(n).keys()].reverse().find(i=>S.slot[i]!==`${MINV[q.ops[i][0]]}${q.ops[i][1]}`),op=q.ops[firstBad];
        say(`The rewind gives ${fmtN(v)}, but ${opT(op)} is undone by ${MINV[op[0]]}${op[1]}. A new number…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4600,load)})})}
  function feed(){if(S.busy||S.won)return;const q=Q(),n=q.ops.length,xs=XS(n),v0=S.val||0;S.busy=true;dial.lock(true);chk.style.display='none';flow.innerHTML='';
    const b0=ball(flow,540,340,String(v0),'#d8f8e8');tween(600,t=>b0.setAttribute('transform',`translate(${lerp(540,xs[0],t).toFixed(1)},${lerp(340,Y1,t).toFixed(1)}) scale(${(1-t*.6).toFixed(2)})`),()=>{b0.remove();mun.chomp()},ease.inOut);
    let f=v0;const fw=[];q.ops.forEach(([o,k],i)=>{f=MOPS[o](f,k);fw.push([i,f])});
    fw.forEach(([i,val],j)=>later(800+j*700,()=>{mun.burp();const b=ball(flow,0,0,fmtN(val),i<n-1||val===q.out?'#d8f8e8':'#ffd0d0');b.setAttribute('transform',`translate(${(xs[i+1]+xs[i+2])/2},${Y1-38}) scale(.72)`)}));
    later(800+n*700+500,()=>{if(v0===q.ans){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(xs[n+1],Y1,{n:16});
        say(`Yes! It spits out ${q.out}. Backwards: ${chain(q.out,backOps(q))} ✓`);if(S.r>=2)unlock('wmachine');later(1400,()=>st.ready(true));return}
      SFX.wrong();say(`${v0} makes ${fmtN(f)}, not ${q.out}. Start from ${q.out} and undo: ${backOps(q).map(([o,k])=>o+k).join(', then ')}. A new number…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(5000,load)})}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';flow.innerHTML='';mach.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});tiles=null;const q=Q();
    Object.assign(S,{busy:true,won:false,dial:false,val:0,track:false,slot:Array(q.ops.length).fill(null)});shown=0;st.ready(false);navDots(R.length,S.r);
    const c=storyCard(board,{lines:q.say,ask:'What number did the Muncher eat?',hidden:true,who:['Muncher','Muncher','Muncher']});Y1=92+c.h+52;Y2=Y1+90;decQ(qL,parts(q,false),false,guide);drawMachine(q);mun.g.setAttribute('opacity',0);
    const n=q.ops.length,beats=[()=>{drawMachine(q);mun.chomp()}];
    if(n>1)beats.push(()=>{shown=n;drawMachine(q);mun.burp()},()=>{shown=n+1;drawMachine(q);mun.burp()});else beats.push(()=>{shown=n+1;drawMachine(q);mun.burp()});
    say('Listen to the story…');
    tellStory(c,beats,()=>{shown=n+1;S.track=true;drawMachine(q);drawTiles(q);S.busy=false;goB=decGo(ui,540,486,'Go: rewind',go2,'Go');
      say(S.r===0?`Drag the undo potion under ${opT(q.ops[0])}, then Go.`:n>1?'Put the right undo potion under each one, then Go.':'Undo it, then Go.')})}
  W.machine.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
