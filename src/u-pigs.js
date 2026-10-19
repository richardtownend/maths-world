
/* ---------- 4. Pigs: sharing apples fairly ---------- */
function pigFig(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),body=el('g',{},g);
  [-14,-6,6,14].forEach(dx=>el('rect',{x:dx-3,y:6,width:6,height:12,rx:2,fill:'#e88aa6'},body));
  el('ellipse',{cx:0,cy:0,rx:24,ry:16,fill:'#ffb0c8'},body);el('path',{d:'M22,-4 q8,-2 6,5 q-3,3 -5,0',stroke:'#e88aa6','stroke-width':2,fill:'none'},body);
  el('circle',{cx:-20,cy:-8,r:12,fill:'#ffb0c8'},body);el('path',{d:'M-28,-18 l-4,-8 l8,4Z M-14,-19 l2,-9 l5,7Z',fill:'#e88aa6'},body);
  el('ellipse',{cx:-30,cy:-5,rx:5.5,ry:4.5,fill:'#ff8fb0',stroke:'#e06a90','stroke-width':1},body);el('circle',{cx:-31.5,cy:-5,r:1,fill:'#a0405a'},body);el('circle',{cx:-28.5,cy:-5,r:1,fill:'#a0405a'},body);
  el('circle',{cx:-23,cy:-12,r:1.8,fill:'#241a3a'},body);el('circle',{cx:-16,cy:-12,r:1.8,fill:'#241a3a'},body);
  const mouth=el('path',{d:'M-27,2 q3,3 6,0',stroke:'#a0405a','stroke-width':1.6,fill:'none','stroke-linecap':'round'},body);
  return{g,body,mouth,x,y}}
function apple(parent,x,y,s=1,op=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`,opacity:op},parent);
  el('circle',{r:8,fill:'#e8435a'},g);el('circle',{cx:-2.5,cy:-2.5,r:2.2,fill:'#fff',opacity:.45},g);el('path',{d:'M0,-8 v-4',stroke:'#6a4a2a','stroke-width':1.6},g);el('path',{d:'M0,-10 q5,-5 8,-1 q-5,3 -8,1Z',fill:'#5c8f48'},g);return g}
W.pigs={scene:'patch',
notes:`<p>Sharing (division) as the farmer feeding pigs fairly. There are 12 apples in the basket and 3 pigs. She drags the gold line (handle on the right, so a right hand doesn't cover the pigs) up to choose how many apples every pig will get; ghost apples show the piles. Nothing happens until she presses Go, so there's time to count. Then the farmer throws them out, one round at a time. Too high and they run out before everyone's done ("Not fair!"); too low and there are enough left for another round each. Exactly right and the pigs are happy, and the "?" fills in. Every pig gets the same pile, so the shares make rows and columns like the trays: 12 ÷ 3 = 4 and 3 × 4 = 12.</p>
<p>The last round doesn't share exactly (13 ÷ 4): 3 each, and 1 left over that isn't enough for everyone, so the farmer keeps it. Rounds: 6 ÷ 2, 10 ÷ 5, 12 ÷ 3, 20 ÷ 5, 18 ÷ 3, 13 ÷ 4.</p>`,
mount(root){
  const R=[[6,2],[10,5],[12,3],[20,5],[18,3],[13,4]];
  const S={r:0,busy:false,won:false,k:0,wins:0};
  const BASE=414,STEP=20,MAXK=8,HX=560;
  const qL=el('g',{},root),yard=el('g',{},root),ghostL=el('g',{},root),appL=el('g',{},root),pigL=el('g',{},root),farmL=el('g',{},root),lineL=el('g',{},root),ui=el('g',{},root);
  /* the pen */
  el('path',{d:'M150,476 Q330,460 540,478',stroke:'#7a5a3a','stroke-width':8,fill:'none'},yard);
  for(let x=160;x<=540;x+=38)el('rect',{x:x-3,y:448,width:6,height:40,rx:2,fill:'#8a6a44'},yard);
  el('ellipse',{cx:350,cy:492,rx:200,ry:14,fill:'#5a3a22',opacity:.5},yard);
  /* the farmer and the basket */
  const farmer=creature(farmL,{x:64,y:420,r:24,i:7,label:'The farmer',hat:'beanie'});
  const basket=el('g',{transform:'translate(84,478)'},farmL);el('path',{d:'M-34,-18 h68 l-6,30 h-56Z',fill:'#b0743a',stroke:'#6a4420','stroke-width':2},basket);for(let k=0;k<3;k++)el('path',{d:`M-32,${-10+k*9} h64`,stroke:'#6a4420','stroke-width':1,opacity:.6},basket);
  const pile=el('g',{},basket),bnum=el('text',{x:0,y:30,'text-anchor':'middle','font-size':14},el('g',{class:'num'},basket));
  let NX=[],pigs=[],left=0;
  function drawPile(){pile.innerHTML='';for(let k=0;k<Math.min(left,15);k++)apple(pile,-22+(k%5)*11,-22-Math.floor(k/5)*9,.9);bnum.textContent=`${left} apples`}
  /* the fill line, handle on the right */
  const lineG=el('g',{},lineL),handle=el('g',{},lineL);
  el('circle',{r:19,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},handle);el('path',{d:'M-6,3 l6,-6 l6,6 M-6,8 l6,-6 l6,6',stroke:'#7a4a2e','stroke-width':2,fill:'none','stroke-linecap':'round'},handle);
  const kT=el('text',{x:0,y:-26,'text-anchor':'middle','font-size':15,'font-weight':700},el('g',{class:'num'},handle));
  const LY=k=>BASE-k*STEP;
  function drawLine(){lineG.innerHTML='';ghostL.innerHTML='';const y=LY(S.k)-10;
    el('path',{d:`M${NX[0]-30},${y} H${HX}`,stroke:'#fff0a0','stroke-width':3,'stroke-dasharray':'9 6'},lineG);
    handle.setAttribute('transform',`translate(${HX},${y})`);kT.textContent=`${S.k} each`;
    NX.forEach(x=>{for(let j=0;j<S.k;j++)apple(ghostL,x,LY(j),1,.35)});goB.style.display=S.k?'':'none'}
  interact(handle,{label:'Apple line: drag up to choose how many apples each pig gets',down:()=>({}),
    move:p=>{if(S.busy||S.won)return;const k=clamp(Math.round((BASE-p.y-10)/STEP),0,MAXK);if(k!==S.k){S.k=k;SFX.tick(k);drawLine()}}});
  handle.addEventListener('keydown',e=>{if(S.busy||S.won)return;if(e.key==='ArrowUp'){e.preventDefault();S.k=Math.min(MAXK,S.k+1);drawLine()}if(e.key==='ArrowDown'){e.preventDefault();S.k=Math.max(0,S.k-1);drawLine()}});
  const goB=goStone(ui,HX,540,'Go: the farmer throws the apples',throwAll);
  function throwAll(){if(S.busy||S.won||S.k===0)return;const [w,n]=R[S.r],k=S.k;S.busy=true;goB.style.display='none';ghostL.innerHTML='';farmer.mood('happy');
    for(let r=0;r<k;r++)later(r*420,()=>{farmer.hop(10,300);pigs.forEach((p,i)=>later(i*50,()=>{if(left<=0)return;left--;drawPile();p.n++;const ty=LY(p.n-1),a=apple(appL,84,440);
      tween(380,(t,q)=>a.setAttribute('transform',`translate(${lerp(84,p.x,t).toFixed(1)},${(lerp(440,ty,t)-Math.sin(q*Math.PI)*90).toFixed(1)})`),()=>SFX.crunch(),ease.inOut)}));SFX.whoosh()});
    later(k*420+600,()=>{farmer.mood('');
      if(k*n>w){SFX.wrong();shake(4);pigs.forEach(p=>{if(p.n<k){floatText(p.x,300,'Not fair!',{col:'#ff9ec0',size:20});p.mouth.setAttribute('d','M-28,4 q3,-3 6,0')}});say(`The apples ran out! Not every pig got ${k}. Try a lower line.`);later(2400,reset)}
      else if(left>=n){SFX.wrong();pigs.forEach(p=>p.mouth.setAttribute('d','M-28,4 q3,-3 6,0'));say(`There are still ${left} apples in the basket: enough for another round each! Try a higher line.`);later(2600,reset)}
      else win(left)})}
  function reset(){appL.innerHTML='';const [w]=R[S.r];left=w;pigs.forEach(p=>{p.n=0;p.mouth.setAttribute('d','M-27,2 q3,3 6,0')});drawPile();S.busy=false;drawLine()}
  function win(rem){const [w,n]=R[S.r],e=S.k;S.won=true;roundWon(S.r);S.wins++;if(S.wins>=2)unlock('fair');SFX.fanfare();
    starterQ(qL,rem?[['w',w],['o','÷'],['w',n],['o','='],['w',e],['t',`and ${rem} left over`]]:[['w',w],['o','÷'],['w',n],['o','='],['w',e]],true);
    say(rem?`${e} each, and ${rem} left over: not enough to go round, so the farmer keeps it.`:`${w} ÷ ${n} = ${e}. ${n} pigs with ${e} each: ${n} × ${e} = ${w}.`);
    later(500,()=>{appL.querySelectorAll('g').forEach((a,i)=>later(i*30,()=>a.remove()));pigs.forEach((p,i)=>later(i*140,()=>{SFX.crunch();p.mouth.setAttribute('d','M-28,1 q4,5 8,0');
      tween(900,(t,q)=>p.body.setAttribute('transform',`translate(0,${(-Math.abs(Math.sin(q*Math.PI*3))*14).toFixed(1)})`),()=>p.body.removeAttribute('transform'),ease.lin)}));later(pigs.length*140+1000,()=>{st.ready(true);S.busy=false})})}
  const st=navStone({label:'Next pigs',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start these pigs again',onTap:()=>load()});
  function load(){EPOCH++;FX.innerHTML='';appL.innerHTML='';pigL.innerHTML='';const [w,n]=R[S.r];
    Object.assign(S,{busy:false,won:false,k:0});left=w;st.ready(false);navDots(R.length,S.r);
    NX=range(0,n-1).map(i=>190+(i+.5)*(330/n));pigs=NX.map(x=>Object.assign(pigFig(pigL,x+8,456,n>4?.85:1),{x,n:0}));drawPile();drawLine();
    starterQ(qL,[['w',w],['o','÷'],['w',n],['o','='],['o','?']]);
    say(S.r===0?`Share ${w} apples between ${n} pigs. Drag the gold line up to choose how many each pig gets, then press Go.`:`${w} apples, ${n} pigs. How many each? Set the gold line, then Go.`)}
  S.r=resumeAt(R.length);load();
}};
