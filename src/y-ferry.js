/* ---------- 4. Ferry: the depot (what to do with the remainder) ---------- */
function ferryToken(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(kind==='child'){el('circle',{cx:0,cy:-6,r:6,fill:'#f4c8a0'},g);el('path',{d:'M-7,10 Q-7,0 0,0 Q7,0 7,10Z',fill:['#ff9ed2','#8fd6ff','#ffc04d','#8ff0c8'][Math.abs(Math.round(x*7+y))%4]},g)}
  else if(kind==='egg')el('ellipse',{rx:7,ry:9,fill:'#fff8ec',stroke:'#c9a77a','stroke-width':1.2},g);
  else if(kind==='car'){el('rect',{x:-10,y:-6,width:20,height:10,rx:3,fill:['#e8413e','#4aa0ff','#ffc04d'][Math.abs(Math.round(x+y))%3]},g);[-5,5].forEach(cx=>el('circle',{cx,cy:5,r:3,fill:'#241a3a'},g))}
  else{el('circle',{r:8,fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},g);el('text',{y:4,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#7a4a1e'},g).textContent='£1'}
  return g}
function ferryBox(parent,x,y,kind,k){if(kind==='table'){const g=el('g',{transform:`translate(${x},${y})`},parent),w=Math.max(54,Math.ceil(k/2)*16+14);el('rect',{x:-w/2,y:-14,width:w,height:18,rx:4,fill:'#a8743a',stroke:'#6a4224','stroke-width':2},g);[-w/2+6,w/2-10].forEach(cx=>el('rect',{x:cx,y:4,width:4,height:14,fill:'#6a4224'},g));return{g,w,slot:i=>[x-w/2+12+Math.floor(i/2)*16,y+(i%2?12:-26)]}}
  const g=el('g',{transform:`translate(${x},${y})`},parent),w=Math.max(54,Math.ceil(k/2)*16+14);
  if(kind==='child'){el('rect',{x:-w/2,y:-18,width:w,height:30,rx:8,fill:'#c9413a'},g);el('rect',{x:-w/2+6,y:-30,width:w-12,height:14,rx:5,fill:'#e8f4ff',opacity:.8},g);[-w/2+10,w/2-10].forEach(cx=>el('circle',{cx,cy:13,r:6,fill:'#241a3a'},g))}
  else if(kind==='egg'){el('rect',{x:-w/2,y:-22,width:w,height:36,rx:5,fill:'#c9a77a',stroke:'#8a6a4a','stroke-width':2},g)}
  else if(kind==='car'){el('path',{d:`M${-w/2-6},-6 H${w/2+6} L${w/2-6},16 H${-w/2+6}Z`,fill:'#3a6aa8'},g);el('rect',{x:-w/2,y:-26,width:w,height:20,rx:3,fill:'#e8f4ff',opacity:.3},g)}
  else{el('rect',{x:-w/2,y:-22,width:w,height:36,rx:4,fill:'#fff4e6',stroke:'#c9413a','stroke-width':2,'stroke-dasharray':'4 3'},g);el('text',{y:24,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#fff4e6'},g).textContent='ticket'}
  return{g,w,slot:i=>[x-w/2+12+Math.floor(i/2)*16,y+(i%2?2:-12)]}}

W.ferry={scene:'river',
notes:`<p>Division with a remainder, and what the question really wants. The story is read a line at a time: the children (or eggs, cars, coins) appear, then the depot sign says how many fit in each car, box, ferry trip or ticket. She orders how many she thinks the question needs on the depot's − / + and presses Go: everything loads up, one at a time. Order too few cars and the last children are left behind on the bank; too many and an empty car goes; the right number and the cars drive off. For "how many boxes can be filled", the last box has to be full; for "how many are left over" she sets the left-over count instead.</p>
<p>Rounds: cars for a trip (round up), full egg boxes (round down), eggs left over, ferry trips (round up), tickets at £3 with £20 (round down), tables of 6 (round up, or exactly). A wrong answer gives a new story.</p>`,
mount(root){
  const R=[
    {p:[{w:['teacher','teacher'],l:[[{n:18,id:'a'},'children are coming on our trip.'],['Each car takes',{n:4,id:'b'},'children.']],n:18,k:4,ask:'up',kind:'child',lab:'cars',one:'car',q:'How many cars are needed?'},{w:['teacher','teacher'],l:[[{n:22,id:'a'},'children are coming on our trip.'],['Each car takes',{n:4,id:'b'},'children.']],n:22,k:4,ask:'up',kind:'child',lab:'cars',one:'car',q:'How many cars are needed?'},{w:['teacher','teacher'],l:[[{n:13,id:'a'},'children are coming on our trip.'],['Each car takes',{n:4,id:'b'},'children.']],n:13,k:4,ask:'up',kind:'child',lab:'cars',one:'car',q:'How many cars are needed?'}]},
    {p:[{w:['farmer','farmer'],l:[['I’ve got',{n:26,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:26,k:6,ask:'down',kind:'egg',lab:'boxes',one:'box',q:'How many boxes can be filled?'},{w:['farmer','farmer'],l:[['I’ve got',{n:21,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:21,k:6,ask:'down',kind:'egg',lab:'boxes',one:'box',q:'How many boxes can be filled?'},{w:['farmer','farmer'],l:[['I’ve got',{n:32,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:32,k:6,ask:'down',kind:'egg',lab:'boxes',one:'box',q:'How many boxes can be filled?'}]},
    {p:[{w:['farmer','farmer'],l:[['I’ve got',{n:23,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:23,k:6,ask:'left',kind:'egg',lab:'boxes',one:'box',q:'How many eggs are left over?'},{w:['farmer','farmer'],l:[['I’ve got',{n:27,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:27,k:6,ask:'left',kind:'egg',lab:'boxes',one:'box',q:'How many eggs are left over?'},{w:['farmer','farmer'],l:[['I’ve got',{n:20,id:'a'},'eggs.'],['A box holds',{n:6,id:'b'},'eggs.']],n:20,k:6,ask:'left',kind:'egg',lab:'boxes',one:'box',q:'How many eggs are left over?'}]},
    {p:[{w:['captain','captain'],l:[[{n:30,id:'a'},'cars are waiting.'],['My ferry takes',{n:8,id:'b'},'cars a trip.']],n:30,k:8,ask:'up',kind:'car',lab:'trips',one:'trip',q:'How many trips?'},{w:['captain','captain'],l:[[{n:19,id:'a'},'cars are waiting.'],['My ferry takes',{n:8,id:'b'},'cars a trip.']],n:19,k:8,ask:'up',kind:'car',lab:'trips',one:'trip',q:'How many trips?'},{w:['captain','captain'],l:[[{n:35,id:'a'},'cars are waiting.'],['My ferry takes',{n:8,id:'b'},'cars a trip.']],n:35,k:8,ask:'up',kind:'car',lab:'trips',one:'trip',q:'How many trips?'}]},
    {p:[{w:['Mo','Mo'],l:[['Tickets cost',{n:3,id:'b',t:'£3'},'each.'],['I’ve got',{n:20,id:'a',t:'£20'}]],n:20,k:3,ask:'down',kind:'coin',lab:'tickets',one:'ticket',q:'How many tickets can Mo buy?'},{w:['Mo','Mo'],l:[['Tickets cost',{n:4,id:'b',t:'£4'},'each.'],['I’ve got',{n:23,id:'a',t:'£23'}]],n:23,k:4,ask:'down',kind:'coin',lab:'tickets',one:'ticket',q:'How many tickets can Mo buy?'},{w:['Mo','Mo'],l:[['Tickets cost',{n:4,id:'b',t:'£4'},'each.'],['I’ve got',{n:14,id:'a',t:'£14'}]],n:14,k:4,ask:'down',kind:'coin',lab:'tickets',one:'ticket',q:'How many tickets can Mo buy?'}]},
    {p:[{w:['teacher','teacher'],l:[[{n:24,id:'a'},'children need seats.'],['Each table seats',{n:6,id:'b'},'children.']],n:24,k:6,ask:'up',kind:'child',box:'table',lab:'tables',one:'table',q:'How many tables are needed?'},{w:['teacher','teacher'],l:[[{n:28,id:'a'},'children need seats.'],['Each table seats',{n:6,id:'b'},'children.']],n:28,k:6,ask:'up',kind:'child',box:'table',lab:'tables',one:'table',q:'How many tables are needed?'},{w:['teacher','teacher'],l:[[{n:33,id:'a'},'children need seats.'],['Each table seats',{n:6,id:'b'},'children.']],n:33,k:6,ask:'up',kind:'child',box:'table',lab:'tables',one:'table',q:'How many tables are needed?'}]}];
  const S={r:0,busy:true,won:false,pi:{},n:1};
  const board=el('g',{},root),yard=el('g',{},root),anim=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let toks=[],dev=null,goB=null;
  const st=navStone({label:'Next story',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this story again',onTap:()=>load()});
  const Q=()=>{const q=R[S.r].p[(S.pi[S.r]||0)%R[S.r].p.length],f=Math.floor(q.n/q.k),r=q.n%q.k;return Object.assign({},q,{f,r,ans:q.ask==='up'?f+(r?1:0):q.ask==='down'?f:r})};
  const parts=(q,done)=>[['t',q.ask==='left'?'left over':q.lab],['o','='],done?['w',q.ans]:['o','?']];
  function go2(){if(S.busy||S.won)return;const q=Q(),n=q.ask==='left'?q.f:S.n,bw=Math.max(54,Math.ceil(q.k/2)*16+14),gap=bw+8;S.busy=true;goB.style.display='none';dev.lock(true);
    const sc=Math.min(1,430/(n*gap||1)),base=`translate(40,436) scale(${sc.toFixed(3)}) translate(-40,-436)`;yard.setAttribute('transform',base);const W2=(x,y)=>[40+(x-40)*sc,436+(y-436)*sc],fin=[];
    const boxes=[...Array(n)].map((_,i)=>ferryBox(yard,40+bw/2+i*gap,436,q.box||q.kind,q.k));boxes.forEach(b=>popIn(b.g,.5));
    const cap=n*q.k,extra=Math.max(0,q.n-cap),loaded=Math.min(q.n,cap),lastFill=loaded-(n-1)*q.k;
    if(extra)el('text',{x:330,y:362,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},anim).textContent=q.ask==='up'?'left behind!':'left over';
    toks.forEach((tk,i)=>{const b=Math.floor(i/q.k),j=i%q.k,ex=i-cap,[x,y]=b<n?boxes[b].slot(j):[270+(ex%8)*16,378+Math.floor(ex/8)*18],m=tk.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)/),x0=+m[1],y0=+m[2];
      const [X,Y]=b<n?W2(x,y):[x,y],ts=b<n?.8*sc:.8;if(b<n)fin.push([tk,X,Y,ts]);later(300+i*60,()=>{SFX.tick(j);tween(240,tt=>tk.setAttribute('transform',`translate(${lerp(x0,X,tt).toFixed(1)},${lerp(y0,Y,tt).toFixed(1)}) scale(${ts.toFixed(2)})`))})});
    later(300+q.n*60+600,()=>{if(n&&lastFill<q.k){const lx=+boxes[n-1].g.getAttribute('transform').match(/translate\(([-\d.]+)/)[1];el('text',{x:lx,y:482,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},yard).textContent=lastFill<=0?'empty!':q.kind==='coin'?`only £${lastFill}`:'not full'}
      const sum=`${q.n} ÷ ${q.k} = ${q.f}${q.r?` remainder ${q.r}`:''}`,why=q.ask==='up'?(q.r?`. The last ${q.r} need one more: ${q.ans} ${q.lab}.`:`, exactly: ${q.ans} ${q.lab}.`)
        :q.ask==='down'?(q.kind==='coin'?`: ${q.ans} tickets, £${q.r} left.`:`: ${q.ans} full ${q.lab}.`):`: ${q.r} left over.`;
      const ok=q.ask==='left'?S.n===q.r:S.n===q.ans;
      if(ok){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(270,400,{n:14});say(sum+why);if(S.r>=2)unlock('wferry');
        if(['child','car'].includes(q.box||q.kind)&&q.box!=='table'){SFX.rumble&&SFX.rumble();tween(1600,t=>{const dx=t*600;yard.setAttribute('transform',`translate(${dx.toFixed(1)},0) ${base}`);fin.forEach(([tk,X,Y,ts])=>tk.setAttribute('transform',`translate(${(X+dx).toFixed(1)},${Y.toFixed(1)}) scale(${ts.toFixed(2)})`))},null,ease.in)}
        later(1400,()=>st.ready(true));return}
      SFX.wrong();const oops=q.ask==='up'?(S.n<q.ans?`${extra} left behind! Nobody can be left behind.`:`An empty ${q.one}! Too many.`):q.ask==='down'?(S.n>q.ans?(q.kind==='coin'?`Mo can’t buy the last ticket with £${lastFill}.`:`The last ${q.one} isn’t full.`):`You could fill another ${q.one}.`):`Not ${S.n}. Count the eggs that don’t fill a box.`;
      say(`${oops} A new story…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(5600,load)})}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';anim.innerHTML='';yard.innerHTML='';yard.removeAttribute('transform');[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:true,won:false,n:q.ask==='left'?0:1});st.ready(false);navDots(R.length,S.r);
    const card=storyCard(board,{lines:q.l,ask:q.q,hidden:true,who:q.w}),y0=92+card.h+34;toks=[];decQ(qL,parts(q,false),false,guide);
    const showToks=()=>{for(let i=0;i<q.n;i++){const t=ferryToken(anim,70+(i%12)*30,y0+Math.floor(i/12)*30,q.kind);t.setAttribute('opacity',0);toks.push(t);later(i*25,()=>t.setAttribute('opacity',1))}SFX.pop(1)};
    const showSign=()=>{const sg=el('g',{transform:'translate(525,252)'},ui);el('rect',{x:-64,y:-30,width:128,height:64,rx:10,fill:'#3a2a24',stroke:'#c9a24a','stroke-width':2.5},sg);
      el('text',{y:-12,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff0a0'},sg).textContent='THE DEPOT';const b=ferryBox(sg,-22,14,q.box||q.kind,q.k);b.g.setAttribute('transform','translate(-22,16) scale(.6)');
      el('text',{x:22,y:20,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},sg).textContent=q.kind==='coin'?`£${q.k}`:`takes ${q.k}`;popIn(sg,.4);SFX.ding&&SFX.ding()};
    const firstIsCost=q.kind==='coin';say('Listen to the story…');
    tellStory(card,firstIsCost?[showSign,showToks]:[showToks,showSign],()=>{S.busy=false;
      if(q.ask==='left'){dev=stepper(ui,{x:525,y:340,min:0,max:q.k,val:0,w:150,label:'Eggs left over',onChange:v=>{S.n=v}});el('text',{x:525,y:306,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},ui).textContent='left over'}
      else{dev=stepper(ui,{x:525,y:340,min:1,max:9,val:1,w:150,label:`Order ${q.lab}`,onChange:v=>{S.n=v}});el('text',{x:525,y:306,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},ui).textContent=`order ${q.lab}`}
      goB=decGo(ui,540,486,q.ask==='left'?'Go: pack the boxes':'Go: load them up',go2,'Go');
      say(q.ask==='left'?'How many will be left over? Set it, then Go.':S.r===0?`Order the ${q.lab} you need from the depot, then Go.`:`Order ${q.lab}, then Go.`)})}
  W.ferry.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
