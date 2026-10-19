
/* ---------- 6. Treasure: a percentage of an amount, with a bar model ---------- */
function coin(parent,r=8){const g=el('g',{},parent);el('circle',{r,fill:'#ffc94a',stroke:'#c98a1a','stroke-width':1.5},g);el('circle',{r:r*.55,fill:'none',stroke:'#e8a82a','stroke-width':1.2},g);el('circle',{cx:-r*.35,cy:-r*.35,r:r*.22,fill:'#fff6c8'},g);return g}
/* the whole treasure is one bar (100%); cut it into equal parts and the coins share themselves out */
function barKit(parent,{x0,x1,y,h=84,n,cuts=[1,2,4,5,10],knobAt,label='Cutter: how many equal parts?',onChange}){
  const g=el('g',{},parent),W=x1-x0,partL=el('g',{},g),coinL=el('g',{},g),labL=el('g',{},g);let N=1,sel=new Set(),locked=false;
  el('rect',{x:x0-6,y:y-6,width:W+12,height:h+12,rx:14,fill:'#6a4420',stroke:'#c9a24a','stroke-width':3},g);g.insertBefore(g.lastChild,partL);
  el('text',{x:x0+W/2,y:y+h+30,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff0a0'},g).textContent='the whole treasure = 100%';
  const coins=range(1,n).map(()=>{const c=coin(coinL,7.5);c.cx=x0+W/2;c.cy=y+h/2;return c});
  const putC=(c,x,y2)=>{c.cx=x;c.cy=y2;c.setAttribute('transform',`translate(${x.toFixed(1)},${y2.toFixed(1)})`)};
  const even=()=>n%N===0;
  function layout(anim){const parts=even()?N:1,m=n/parts,pw=W/parts,cols=Math.max(1,Math.floor((pw-8)/17)),rows=Math.ceil(m/cols);
    coins.forEach((c,k)=>{const p=Math.floor(k/m),j=k%m,cx=x0+p*pw+pw/2+((j%cols)-(Math.min(cols,m)-1)/2)*17,cy=y+h/2+(Math.floor(j/cols)-(rows-1)/2)*17;
      if(anim){const fx=c.cx,fy=c.cy;tween(380,t=>putC(c,lerp(fx,cx,t),lerp(fy,cy,t)),null,ease.inOut);c.cx=cx;c.cy=cy}else putC(c,cx,cy)})}
  function drawParts(){partL.innerHTML='';labL.innerHTML='';const pw=W/N,ok=even();
    for(let i=0;i<N;i++){const on=sel.has(i),r=el('rect',{x:x0+i*pw+2,y:y+2,width:pw-4,height:h-4,rx:10,fill:on?'#fff0a0':'#8a5a2a',opacity:on?.55:.55,stroke:on?'#fff0a0':'none','stroke-width':3},partL);
      if(i)el('line',{x1:x0+i*pw,x2:x0+i*pw,y1:y-10,y2:y+h+10,stroke:ok?'#fff4e6':'#ff7a93','stroke-width':3,'stroke-dasharray':ok?'':'6 5'},partL);
      if(N>1&&ok){el('text',{x:x0+i*pw+pw/2,y:y-14,'text-anchor':'middle','font-size':N===10?11.5:15,'font-weight':700,fill:on?'#fff0a0':'#fff4e6'},labL).textContent=`${100/N}%`;
        const hit=el('rect',{x:x0+i*pw,y:y-26,width:pw,height:h+30,fill:'transparent'},labL);interact(hit,{label:`Part ${i+1}: ${100/N}% of the treasure`,tap:()=>{if(locked)return;sel.has(i)?sel.delete(i):sel.add(i);SFX.pop(sel.has(i)?1.2:.8);drawParts();onChange&&onChange()}})}}}
  {const [kx,ky]=knobAt;el('text',{x:kx,y:ky-44,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},g).textContent='cutter';el('path',{d:`M${kx-36},${ky-6} A36,36 0 0 1 ${kx-8},${ky-35}`,fill:'none',stroke:'#fff0a0','stroke-width':2.5,opacity:.7},g);el('path',{d:`M${kx-14},${ky-40} l7,5 -8,3`,fill:'#fff0a0',opacity:.8},g)}
  const kn=knob(g,{x:knobAt[0],y:knobAt[1],r:28,vals:cuts,val:1,hue:2,label,fmt:v=>v===1?'not cut':`cut into ${v}`,onChange:v=>{N=v;sel.clear();SFX.slice();drawParts();layout(true);onChange&&onChange('cut')}});
  drawParts();layout(false);
  return{g,coins,N:()=>N,even,sel:()=>[...sel],pct:()=>even()?sel.size*100/N:0,lock:b=>{locked=b;kn.lock(b)},
    share(to,rest,done){const m=n/N;let k=0;coins.forEach((c,i)=>{const mine=sel.has(Math.floor(i/m)),[tx,ty]=mine?to:rest,fx=c.cx,fy=c.cy;
        later(i*30,()=>{tween(520,(t,p)=>{c.setAttribute('transform',`translate(${lerp(fx,tx+(Math.random()-.5)*20,t).toFixed(1)},${(lerp(fy,ty,t)-Math.sin(p*Math.PI)*60).toFixed(1)})`)},()=>{if(mine&&k++%3===0)SFX.clink(k%5)},ease.inOut)})});
      later(coins.length*30+600,()=>done&&done())},
    back(){sel.clear();drawParts();layout(true)}}}

W.treasure={scene:'beach',
notes:`<p>A percentage of an amount, with the bar model schools use. The pirates' whole treasure is one bar, and the whole is 100%. The captain gets a percentage: say 25% of 40 coins. She turns the cutter to cut the bar into 2, 4, 5 or 10 equal parts; the coins share themselves out and every part is labelled with its percentage (quarters say 25%). She taps the parts the captain gets and presses Share.</p>
<p>The thinking is in the cut: 25% only fits quarters, 10% fits tenths, 30% is 3 tenths, 75% is 3 quarters. A cut that can't share the coins equally (15 into 2) shows red dashes. A wrong share says what she gave ("That's 50%: 20 coins") and the coins come back.</p>
<p>Rounds: 50% of 20, 10% of 30, 25% of 40, 20% of 15, 75% of 8, 30% of 50.</p>`,
mount(root){
  const R=[{t:50,n:20},{t:10,n:30},{t:25,n:40},{t:20,n:15},{t:75,n:8},{t:30,n:50}];
  const S={r:0,busy:false,won:false};
  const qL=el('g',{},root),folk=el('g',{},root),board=el('g',{},root),ui=el('g',{},root);let kit=null;
  const cap=creature(folk,{x:96,y:178,r:30,i:0,label:'The captain',hat:'pirate'});
  const crew=[creature(folk,{x:470,y:184,r:22,i:3,label:'A pirate'}),creature(folk,{x:526,y:180,r:24,i:7,label:'A pirate'})];
  const dotG=dotChar(ui,170,44,12);
  const st=navStone({label:'Next treasure',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this treasure again',onTap:()=>load()});
  const goB=decGo(ui,536,470,'Share out the treasure',share,'Share');
  function onCut(why){if(why!=='cut'||S.busy)return;const q=R[S.r],N=kit.N();say(N===1?`The captain gets ${q.t}% of ${q.n} coins. Turn the cutter to cut the treasure.`:kit.even()?`Cut into ${N}: each part is ${100/N}%. Tap the captain's parts, then Share.`:`${q.n} coins won't share equally into ${N}. Turn the cutter again.`)}
  function share(){if(S.busy||S.won)return;const q=R[S.r];if(!kit.pct()){say(kit.N()===1?'Turn the cutter first to cut the treasure into equal parts.':kit.even()?'Tap the parts the captain gets.':`${q.n} coins won't share equally into ${kit.N()}. Try another cut.`);return}
    S.busy=true;goB.style.display='none';kit.lock(true);const p=kit.pct(),got=q.n*p/100;
    kit.share([cap.x,cap.y+8],[498,190],()=>{floatText(cap.x,cap.y-50,`${got} coins`,{size:20});
      if(p===q.t)win(q,got);else{SFX.wrong();cap.mood(p<q.t?'oh':'');crew.forEach(c=>c.mood(p>q.t?'oh':'happy'));
        const each=100/kit.N(),fits=q.t%each===0;
        say(`That's ${p}%: ${got} coins. The captain gets ${q.t}%.${fits?'':` Parts of ${each}% can't make ${q.t}%: try another cut.`}`);
        later(2600,()=>{kit.back();kit.lock(false);cap.mood('');crew.forEach(c=>c.mood(''));S.busy=false;goB.style.display=''})}})}
  function win(q,got){S.won=true;roundWon(S.r);SFX.fanfare();cap.mood('happy');cap.hop(16);starterQ(qL,[['w',`${q.t}%`],['t','of'],['w',q.n],['o','='],['w',got]],true,dotG);dotG.mood('happy');
    const N=kit.N(),k=kit.sel().length,each=q.n/N;
    say(k===1?`${N} equal parts of ${100/N}%, each ${each} coins. ${q.t}% of ${q.n} = ${got}!`:`Each part is ${100/N}%, ${each} coins. ${k} parts make ${q.t}%: ${got} coins!`);
    if(S.r>=2)unlock('percentof');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=R[S.r];Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';
    [cap,...crew].forEach(c=>c.mood(''));
    kit=barKit(board,{x0:60,x1:540,y:280,h:96,n:q.n,knobAt:[436,476],onChange:onCut});
    starterQ(qL,[['w',`${q.t}%`],['t','of'],['w',q.n],['o','='],['o','?']],false,dotG);dotG.mood('');
    say(S.r===0?`The captain gets 50% of the 20 coins. Turn the cutter, tap the captain's parts, then Share.`:`The captain gets ${q.t}% of ${q.n} coins. Cut the treasure, pick the parts, then Share.`)}
  S.r=resumeAt(R.length);load();
}};
