
/* a die with pips */
function dieFace(g,v,s=64){g.innerHTML='';el('rect',{x:-s/2,y:-s/2,width:s,height:s,rx:s*.2,fill:'#fff8ec',stroke:'#c9a77a','stroke-width':3},g);
  const P={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[v];
  P.forEach(([x,y])=>el('circle',{cx:x*s*.27,cy:y*s*.27,r:s*.09,fill:v===1?'#e8435a':'#3a2418'},g))}
/* fireflies in jars: full jars of ten, then the rest */
function jarSet(parent,n,x,y,s=.62,fit=0){const J=Math.ceil(n/10)||1,W=58;if(fit)s=Math.min(s,fit/(J*W));const g=el('g',{transform:`translate(${x},${y}) scale(${s.toFixed(3)})`},parent);
  for(let j=0;j<J;j++){const jx=(j-(J-1)/2)*W,k=Math.min(10,n-j*10),full=k===10,jg=el('g',{transform:`translate(${jx},0)`},g);
    if(full)el('ellipse',{cx:0,cy:-40,rx:34,ry:46,fill:'#e6ff8a',opacity:.22},jg);
    el('path',{d:'M-24,-84 h48 v6 l6,8 v62 q0,8 -8,8 h-44 q-8,0 -8,-8 v-62 l6,-8Z',fill:'rgba(200,230,255,.16)',stroke:'#d8c6e4','stroke-width':2},jg);
    if(full)el('rect',{x:-27,y:-92,width:54,height:10,rx:4,fill:'#c98a3a'},jg);
    for(let i=0;i<10;i++)el('circle',{cx:(i%2?9:-9),cy:-64+Math.floor(i/2)*13,r:4.5,fill:i<k?'#e6ff8a':'rgba(230,255,138,.06)',stroke:i<k?'#f6ffc8':'rgba(230,255,138,.18)','stroke-width':1},jg)}
  return g}

/* ---------- 1. Fireflies at the fair: adding dice ---------- */
W.flies={scene:'festival',
notes:`<p>Adding, at the fair. Tap the dice to roll them; the question fills in (8 + 5 = ?). The prize shelf shows four jars of fireflies, each drawn as full jars of ten plus loose ones; she picks the jar that matches the dice. Wrong picks are near misses (one more, one less, or 31 for 13), so she has to add, and see that 13 is a full ten and 3. The right jar opens and the fireflies fly up into the sky.</p>
<p>Rounds: two dice (the second and third always cross ten), then three dice twice, then a missing number: the golden lantern needs 11 fireflies, one die shows 5, and she turns the other die to the face that makes 11, then rings the bell.</p>`,
mount(root){
  const R=[{n:2},{n:2,x:1},{n:2,x:1},{n:3},{n:3,x:1},{miss:1}];
  const S={r:0,busy:false,won:false,rolled:false,d:[],face:1,wins:0};
  const qL=el('g',{},root),stall=el('g',{},root),diceL=el('g',{},root),shelf=el('g',{},root),fx=el('g',{},root);
  /* the stall */
  for(let i=0;i<10;i++)el('path',{d:`M${50+i*50},96 h50 v34 q-25,16 -50,0Z`,fill:i%2?'#fff4e6':'#e8435a'},stall);
  el('rect',{x:46,y:88,width:508,height:12,rx:6,fill:'#c0563a'},stall);[60,540].forEach(x=>el('rect',{x:x-5,y:96,width:10,height:420,fill:'#8a5a32'},stall));
  el('rect',{x:40,y:318,width:520,height:22,rx:6,fill:'#8a5a32'},stall);el('rect',{x:40,y:336,width:520,height:180,fill:'#6a4228'},stall);
  el('rect',{x:70,y:500,width:460,height:16,rx:5,fill:'#8a5a32'},stall);
  const keeper=creature(stall,{x:500,y:286,r:22,i:5,label:'Stallkeeper',hat:'beanie'});
  const bell=el('g',{transform:'translate(110,296)'},stall);el('path',{d:'M-16,6 Q-16,-18 0,-20 Q16,-18 16,6Z',fill:'url(#gBell)',stroke:'#c98a3a','stroke-width':2},bell);el('rect',{x:-20,y:6,width:40,height:6,rx:3,fill:'#8a5a32'},bell);el('circle',{cy:-22,r:3,fill:'#c98a3a'},bell);
  bell.style.display='none';interact(bell,{label:'Ring the bell',tap:ringBell});
  let dice=[],opts=[];
  const st=navStone({label:'Next game',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Play this game again',onTap:()=>load()});
  const rnd=k=>1+Math.floor(Math.random()*k);
  function pickDice(q){for(let t=0;t<60;t++){const d=Array.from({length:q.n},()=>rnd(6)),s=d.reduce((a,b)=>a+b,0);if(!q.x||(s>10&&d.every(v=>v<10)))return d}return [6,5,4].slice(0,q.n)}
  function makeDie(i,x,v,label){const g=el('g',{},diceL),f=el('g',{},g);g.setAttribute('transform',`translate(${x},214)`);dieFace(f,v);g.setAttribute('aria-label',label);return{g,f,x,v}}
  function roll(){if(S.busy||S.rolled||S.won)return;const q=R[S.r];S.busy=true;SFX.rumble&&SFX.rumble();
    const fin=q.miss?[S.d[0]]:pickDice(q);
    const t0=performance.now();const spin=()=>{const p=(performance.now()-t0)/700;
      dice.forEach((d,i)=>{if(q.miss&&i===1)return;dieFace(d.f,p<1?rnd(6):fin[i]);d.g.setAttribute('transform',`translate(${d.x},${(214-Math.sin(Math.min(1,p)*Math.PI)*40).toFixed(1)}) rotate(${p<1?(Math.random()*40-20).toFixed(0):0})`)});
      if(p<1){SFX.tick(rnd(8));later(60,spin)}else{SFX.thud();shake(3);S.d=fin.slice();dice.forEach((d,i)=>{if(!(q.miss&&i===1)){d.v=fin[i];d.g.setAttribute('aria-label',`Die showing ${fin[i]}`)}});S.rolled=true;S.busy=false;afterRoll()}};spin()}
  function afterRoll(){const q=R[S.r];
    if(q.miss){S.T=S.d[0]+S.need;starterQ(qL,[['w',S.d[0]],['o','+'],['o','?'],['o','='],['w',S.T]]);bell.style.display='';
      dice[1].g.style.opacity=1;say(`The golden lantern needs ${S.T} fireflies. One die shows ${S.d[0]}. Tap the other die to turn it, then ring the bell.`);return}
    const sum=S.d.reduce((a,b)=>a+b,0),parts=[];S.d.forEach((v,i)=>{if(i)parts.push(['o','+']);parts.push(['w',v])});parts.push(['o','='],['o','?']);starterQ(qL,parts);
    const set=new Set([sum,sum-1,sum+1]);const sw=sum>=10?(sum%10)*10+Math.floor(sum/10):0;set.add(sw&&sw!==sum&&sw<=29?sw:sum+2);
    const vals=[...set].slice(0,4).sort(()=>Math.random()-.5);
    opts=vals.map((v,i)=>{const x=120+i*120,g=el('g',{},shelf);el('rect',{x:x-56,y:350,width:112,height:142,rx:12,fill:'rgba(255,244,230,.08)',stroke:'rgba(255,244,230,.28)'},g);
      jarSet(g,v,x,476,.85,104);el('text',{x,y:500,'text-anchor':'middle','font-size':16,'font-weight':700},el('g',{class:'num'},g)).textContent=v;
      interact(g,{label:`Prize jar of ${v} fireflies`,tap:()=>pick(v,g,x)});popIn(g,.4);return{v,g,x}});
    say(`${S.d.join(' + ')}. Which prize jar holds that many fireflies? Full jars hold ten.`)}
  function pick(v,g,x){if(S.busy||S.won)return;const sum=S.d.reduce((a,b)=>a+b,0);
    if(v===sum){const parts=[];S.d.forEach((d,i)=>{if(i)parts.push(['o','+']);parts.push(['w',d])});parts.push(['o','='],['w',sum]);starterQ(qL,parts,true);release(x,sum);win(sum>=10?`${S.d.join(' + ')} = ${sum}: a full jar of ten and ${sum-10} more. They're yours!`:`${S.d.join(' + ')} = ${sum}. They're yours!`)}
    else{SFX.wrong();keeper.mood('oh');later(700,()=>keeper.mood(''));tween(400,(t,p)=>g.setAttribute('transform',`translate(${(Math.sin(p*20)*5*(1-p)).toFixed(1)},0)`),null,ease.lin);
      say(v>sum?`That jar has too many. Add the dice again: ${S.d.join(' and ')}.`:`Not enough in that jar. Add the dice again: ${S.d.join(' and ')}.`)}}
  function release(x,n){SFX.fanfare();keeper.mood('happy');keeper.hop(18);for(let k=0;k<Math.min(n,18);k++){const f=el('g',{},fx);el('circle',{r:9,fill:'#e6ff8a',opacity:.3},f);el('circle',{r:3.5,fill:'#f6ffc8'},f);
      const a=Math.random()*6.28,tx=60+Math.random()*480,ty=20+Math.random()*80;tween(1400+Math.random()*600,(t,p)=>f.setAttribute('transform',`translate(${(lerp(x,tx,t)+Math.sin(p*9+a)*20).toFixed(1)},${lerp(430,ty,t).toFixed(1)})`),()=>{tween(2000,(t,p)=>f.setAttribute('opacity',(1-p).toFixed(2)),()=>f.remove())},ease.out)}}
  function turnDie(){if(S.busy||S.won||!R[S.r].miss||!S.rolled)return;S.face=S.face%6+1;dieFace(dice[1].f,S.face);dice[1].g.setAttribute('aria-label',`Second die, showing ${S.face}: tap to turn it`);SFX.tick(S.face);popIn(dice[1].f,.85)}
  function ringBell(){if(S.busy||S.won)return;SFX.ding();const s=S.d[0]+S.face;
    if(s===S.T){starterQ(qL,[['w',S.d[0]],['o','+'],['w',S.face],['o','='],['w',S.T]],true);const g=el('g',{},shelf);jarSet(g,S.T,300,470,.75);popIn(g,.3);release(300,S.T);win(`${S.d[0]} + ${S.face} = ${S.T}. The golden lantern is yours!`)}
    else{SFX.wrong();keeper.mood('oh');later(700,()=>keeper.mood(''));say(`${S.d[0]} and ${S.face} make ${s}, not ${S.T}. Turn the die again.`)}}
  function win(msg){S.won=true;roundWon(S.r);S.wins++;if(S.wins>=2)unlock('maketen');if(R[S.r].miss)unlock('missing');say(msg);later(1200,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';fx.innerHTML='';diceL.innerHTML='';shelf.innerHTML='';const q=R[S.r];Object.assign(S,{busy:false,won:false,rolled:false,face:1,d:[]});keeper.mood('');bell.style.display='none';st.ready(false);navDots(R.length,S.r);
    if(q.miss){S.d=[3+rnd(3)];S.need=2+rnd(4);dice=[makeDie(0,240,S.d[0],'Die: tap to roll'),makeDie(1,360,1,'Second die: tap to turn it')];
      interact(dice[0].g,{label:'Die: tap to roll',tap:roll});interact(dice[1].g,{label:'Second die, showing 1: tap to turn it',tap:turnDie});dice[1].g.style.opacity=.4;
      starterQ(qL,[['o','?'],['o','+'],['o','?'],['o','='],['o','?']]);say('Tap the first die to roll it.')}
    else{const xs=q.n===2?[240,360]:[190,300,410];dice=xs.map((x,i)=>{const d=makeDie(i,x,rnd(6),'Dice: tap to roll');interact(d.g,{label:'Dice: tap to roll',tap:roll});return d});
      starterQ(qL,q.n===2?[['o','?'],['o','+'],['o','?'],['o','='],['o','?']]:[['o','?'],['o','+'],['o','?'],['o','+'],['o','?'],['o','='],['o','?']]);
      say(S.r===0?'Welcome to the fair! Tap the dice to roll. You win that many fireflies.':`Roll the ${q.n===2?'two':'three'} dice!`)}}
  S.r=resumeAt(R.length);load();
}};
