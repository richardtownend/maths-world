
/* The hundred square: 1 to 100 in rows of ten. Going back one row is taking away ten. */
function hundredSq(parent,{x,y,cs=36,onTap}){const g=el('g',{},parent),marks=el('g',{},g),cells=[];
  for(let n=1;n<=100;n++){const r=Math.floor((n-1)/10),c=(n-1)%10,cx=x+c*cs,cy=y+r*cs;
    const cg=el('g',{},g);el('rect',{x:cx+1,y:cy+1,width:cs-2,height:cs-2,rx:6,fill:r%2?'#5a7a3a':'#4f6e34',stroke:'#3a5226','stroke-width':1},cg);
    el('ellipse',{cx:cx+cs/2,cy:cy+cs*.66,rx:cs*.3,ry:cs*.12,fill:'#3a2618',opacity:.5},cg);
    el('text',{x:cx+cs/2,y:cy+cs*.45,'text-anchor':'middle','font-size':cs*.36,'font-weight':600,fill:'#fff4e6',opacity:.85},cg).textContent=n;cells.push(cg)}
  const top=el('g',{},g);
  if(onTap){const hit=el('rect',{x,y,width:cs*10,height:cs*10,fill:'transparent'},g);interact(hit,{label:'The hundred square: tap a square',tap:p=>{if(!p)return;const c=clamp(Math.floor((p.x-x)/cs),0,9),r=clamp(Math.floor((p.y-y)/cs),0,9);onTap(r*10+c+1)}})}
  const xy=n=>{const r=Math.floor((n-1)/10),c=(n-1)%10;return[x+c*cs+cs/2,y+r*cs+cs/2]};
  return{g,top,marks,xy,cs,
    mark(n,col,dashed){const [cx,cy]=xy(n);return el('rect',{x:cx-cs/2+2,y:cy-cs/2+2,width:cs-4,height:cs-4,rx:7,fill:'none',stroke:col,'stroke-width':3.5,'stroke-dasharray':dashed?'5 4':''},marks)},
    carrot(n){const [cx,cy]=xy(n),k=el('g',{transform:`translate(${cx},${cy+cs*.1})`},top);el('path',{d:`M-5,-8 L5,-8 L0,14Z`,fill:'#ff8a3a',stroke:'#c0602a','stroke-width':1},k);el('path',{d:'M0,-8 q-6,-8 -8,-12 M0,-8 q0,-9 0,-14 M0,-8 q6,-8 8,-12',stroke:'#4fa84a','stroke-width':2.4,fill:'none','stroke-linecap':'round'},k);popIn(k,.3);return k}}}
function bunny(parent,cs=36){const g=el('g',{},parent),inner=el('g',{},g),s=cs/36;
  el('ellipse',{cx:0,cy:8*s,rx:13*s,ry:4*s,fill:'#0d0a24',opacity:.3},g);
  [-1,1].forEach(d=>{el('ellipse',{cx:d*5*s,cy:-22*s,rx:4*s,ry:11*s,fill:'#f4ecf8',transform:`rotate(${d*12} ${d*5*s} ${-22*s})`},inner);el('ellipse',{cx:d*5*s,cy:-21*s,rx:2*s,ry:7*s,fill:'#ffb0c8',transform:`rotate(${d*12} ${d*5*s} ${-21*s})`},inner)});
  el('ellipse',{cx:0,cy:0,rx:12*s,ry:10*s,fill:'#f4ecf8'},inner);el('circle',{cx:0,cy:-9*s,r:8.5*s,fill:'#fff'},inner);
  el('circle',{cx:-3*s,cy:-10*s,r:1.6*s,fill:'#241a3a'},inner);el('circle',{cx:3*s,cy:-10*s,r:1.6*s,fill:'#241a3a'},inner);el('circle',{cx:0,cy:-6.5*s,r:1.3*s,fill:'#ff8fb0'},inner);el('circle',{cx:11*s,cy:3*s,r:3.5*s,fill:'#fff'},inner);
  const o={g,x:0,y:0,put(x,y){o.x=x;o.y=y;g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`)},
    hop(x,y,h,dur,done){const x0=o.x,y0=o.y;tween(dur,(t,p)=>o.put(lerp(x0,x,p),lerp(y0,y,p)-Math.sin(p*Math.PI)*h),done,ease.lin)}};return o}
/* hop back from n by b: whole tens first (straight up a row), then ones one at a time; on each step call back */
function hopBack(sq,bun,n,b,{step,done}={}){let cur=n,left=b;const go=()=>{if(left<=0){done&&done(cur);return}
    if(left>=10){const nx=cur-10,[x,y]=sq.xy(nx);SFX.whoosh();bun.hop(x,y-4,sq.cs*.9,520,()=>{cur=nx;left-=10;SFX.boing(3);floatText(x,y-30,'−10',{size:18,col:'#fff0a0'});step&&step(cur,10);later(160,go)})}
    else{const nx=cur-1,[x,y]=sq.xy(nx),wrap=cur%10===1;bun.hop(x,y-4,wrap?sq.cs*1.2:sq.cs*.55,wrap?520:300,()=>{cur=nx;left--;SFX.hop();step&&step(cur,1);if(cur%10===0)floatText(x,y-30,'a ten!',{size:16,col:'#fff0a0'});later(90,go)})}};go()}
function hopCard(parent,v,x,y){const g=el('g',{transform:`translate(${x},${y})`},parent);el('rect',{x:-50,y:-36,width:100,height:72,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},g);
  const t=Math.floor(v/10),o=v%10,W=t*14+(o?Math.ceil(o/5)*14:0),x0=-W/2;
  for(let k=0;k<t;k++)el('rect',{x:x0+k*14,y:-26,width:10,height:44,rx:3,fill:'#ff8a3a',stroke:'#c0602a','stroke-width':1},g);
  for(let k=0;k<o;k++)el('circle',{cx:x0+t*14+Math.floor(k/5)*14+5,cy:-21+(k%5)*9.5,r:3.8,fill:'#ff8a3a'},g);
  el('text',{x:0,y:31,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#3a2418'},el('g',{class:'num'},g)).textContent=`${v} hops`;return g}

/* ---------- 2. Burrows: taking away on the hundred square ---------- */
W.burrows={scene:'meadow',
notes:`<p>Taking away on a hundred square (1 to 100 in rows of ten): a bunny hops back. For 32 − 7 she taps the square where she thinks the bunny will land, then Go. The bunny hops back 2 to 30 (the end of the row above: a ten), then 5 more to 25. Taking away ten is one hop straight up a row, so 41 − 13 is up a row to 31, then 3 back to 28. Right, and a carrot pops up; wrong, and she sees where it lands and gets new numbers.</p>
<p>The last two rounds turn the question round and look different on purpose: a carrot sits on the target and hop cards appear (orange bars are tens, dots are ones). 24 − ? = 18: which card gets the bunny to the carrot? Rounds: 9 − 4, 13 − 5, 32 − 7, 41 − 13, then 24 − ? = 18 and 52 − ? = 37.</p>`,
mount(root){
  const R=[{p:[[9,4],[8,3],[7,5]]},{p:[[13,5],[14,6],[12,4]]},{p:[[32,7],[33,6],[42,5]]},{p:[[41,13],[52,14],[43,15]]},{miss:1,p:[[24,18],[23,17],[25,19]]},{miss:1,p:[[52,37],[45,28],[61,46]]}];
  const S={r:0,busy:false,won:false,pi:{},pick:null,wins:0};
  const qL=el('g',{},root),board=el('g',{},root),ui=el('g',{},root),CS=36,GX=120,GY=88;
  let sq=null,bun=null,pickMark=null,cards=[];
  const Q=()=>{const q=R[S.r],i=(S.pi[S.r]||0)%q.p.length,[n,b]=q.p[i];return q.miss?{n,t:b,miss:true}:{n,b}};
  const st=navStone({label:'Next burrow',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this burrow again',onTap:()=>load()});
  function tap(n){const q=Q();if(S.busy||S.won||q.miss)return;if(n>=q.n){SFX.clonk();say('The bunny hops backwards: pick a square before it.');return}
    S.pick=n;if(pickMark)pickMark.remove();pickMark=sq.mark(n,'#fff0a0');SFX.pop(1.1);goB.style.display=''}
  let goB=null;
  function go(){const q=Q();if(S.busy||S.won||S.pick==null)return;S.busy=true;goB.style.display='none';
    hopBack(sq,bun,q.n,q.b,{done:land=>{if(land===S.pick){sq.carrot(land);win(`${q.n} − ${q.b} = ${land}.${q.b>=10?' Taking ten is one hop up a row.':q.n%10<q.b?` Back to ${q.n-q.n%10} first, then ${q.b-q.n%10} more.`:''}`)}
      else{SFX.wrong();sq.mark(land,'#ff7a93');say(`It landed on ${land}, not ${S.pick}. New numbers coming…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(2600,load)}}})}
  function pickCard(v,g){const q=Q();if(S.busy||S.won)return;S.busy=true;cards.forEach(c=>c.style.opacity=c===g?1:.35);SFX.pop(1.1);
    hopBack(sq,bun,q.n,v,{done:land=>{if(land===q.t){win(`${q.n} − ${v} = ${q.t}. Right on the carrot!`,v)}
      else{SFX.wrong();sq.mark(land,'#ff7a93');say(land>q.t?`Not far enough: it stopped on ${land}. Try another card.`:`Too far: it went past the carrot to ${land}. Try another card.`);
        later(1400,()=>{const [x,y]=sq.xy(q.n);bun.hop(x,y-4,60,500,()=>{sq.marks.innerHTML='';sq.mark(q.n,'#fff0a0',true);cards.forEach(c=>c.style.opacity=1);S.busy=false})})}}})}
  function win(msg,v){const q=Q();S.won=true;roundWon(S.r);S.wins++;if(q.miss?q.n%10<q.n-q.t:q.n%10<q.b)unlock('breakten');SFX.fanfare();
    starterQ(qL,q.miss?[['w',q.n],['o','−'],['w',v],['o','='],['w',q.t]]:[['w',q.n],['o','−'],['w',q.b],['o','='],['w',q.n-q.b]],true);
    say(msg);burst(bun.x,bun.y-20,{n:16,cols:['#ff8a3a','#fff0a0','#8ff0c8']});later(300,()=>bun.hop(bun.x,bun.y,40,500));later(900,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';ui.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false,pick:null});pickMark=null;cards=[];st.ready(false);navDots(R.length,S.r);
    sq=hundredSq(board,{x:GX,y:GY,cs:CS,onTap:q.miss?null:tap});bun=bunny(sq.top,CS);const [x,y]=sq.xy(q.n);bun.put(x,y-4);sq.mark(q.n,'#fff0a0',true);
    if(q.miss){sq.carrot(q.t);starterQ(qL,[['w',q.n],['o','−'],['o','?'],['o','='],['w',q.t]]);
      const correct=q.n-q.t,vals=[...new Set([correct,correct+1,correct-1,correct+10>40?correct-2:correct+10])].slice(0,4).sort(()=>Math.random()-.5);
      el('rect',{x:20,y:458,width:560,height:118,rx:18,fill:'rgba(255,240,160,.1)',stroke:'#fff0a0','stroke-width':2,'stroke-dasharray':'8 6'},ui);
      cards=vals.map((v,i)=>{const g=hopCard(ui,v,105+i*130,518);interact(g,{label:`Hop card: ${v} hops`,tap:()=>pickCard(v,g)});popIn(g,.4);return g});
      say(`Turned round! The bunny is on ${q.n} and wants the carrot on ${q.t}. Which hop card gets it there? Orange bars are tens.`)}
    else{starterQ(qL,[['w',q.n],['o','−'],['w',q.b],['o','='],['o','?']]);goB=goStone(ui,540,420,'Go: hop back',go);goB.style.display='none';
      say(S.r===0?`The bunny is on ${q.n} and hops back ${q.b}. Tap the square where it will land, then Go.`:`${q.n} − ${q.b}: tap where the bunny will land, then Go.${q.b>=10?' Taking ten is one hop up a row.':''}`)}}
  S.r=resumeAt(R.length);load();
}};
