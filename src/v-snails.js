
/* ---------- 3. Snails: comparing decimals (a longer number isn't a bigger number) ---------- */
function snailFig(parent,col){const g=el('g',{},parent),inner=el('g',{},g);
  el('path',{d:'M-48,10 Q-50,0 -38,-2 L0,-2 Q10,-4 12,-14 Q16,-21 21,-13 Q24,0 15,8 Q8,12 -42,12Z',fill:'#e4f0b0',stroke:'#9ab060','stroke-width':1.5},inner);
  el('path',{d:'M14,-15 l3,-15 M19,-13 l9,-12',stroke:'#9ab060','stroke-width':2.2,'stroke-linecap':'round'},inner);[[17,-31],[28,-26]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:3.6,fill:'#fff'},inner);el('circle',{cx:x+.6,cy:y,r:1.7,fill:'#241a3a'},inner)});
  el('path',{d:'M15,2 q3,2 6,0',stroke:'#6a7a3a','stroke-width':1.4,fill:'none','stroke-linecap':'round'},inner);
  el('circle',{cx:-22,cy:-15,r:19,fill:col,stroke:darker(col,.7),'stroke-width':2},inner);
  el('path',{d:'M-22,-15 m0,0 a4,4 0 1 1 4,4 a8,8 0 1 1 -8,-8 a12,12 0 1 1 12,12',stroke:darker(col,.65),'stroke-width':2,fill:'none'},inner);
  el('ellipse',{cx:-29,cy:-24,rx:5,ry:3,fill:'#fff',opacity:.35},inner);
  return{g,inner}}
/* lanes of snails on a ruler. mode 'pick': choose the one that goes furthest; 'order': tap furthest first */
function snailKit(parent,{x0,x1,max=10,yRule,lanes,vals,mode='pick',onReady,label=v=>`Snail ${v}`}){
  const g0=el('g',{},parent),g=el('g',{},g0),N=max,px=(x1-x0)/N,trailL=el('g',{},g0),snL=el('g',{},g0),markL=el('g',{},g0);
  el('rect',{x:x0-10,y:yRule-16,width:x1-x0+20,height:24,rx:7,fill:'#4f6e34',stroke:'#2e4520','stroke-width':1.5},g);
  for(let k=0;k<=N;k++){const x=x0+k*px,big=k%10===0;el('line',{x1:x,x2:x,y1:yRule-16,y2:yRule+(big?12:6),stroke:'#fff4e6','stroke-width':big?3:1.8},g);decTxt(g,x,yRule+(big?28:24),fmtH(k*10),{sz:big?15:12,weight:big?700:600})}
  el('text',{x:x1+14,y:yRule+4,'font-size':12,fill:'#d8c6e4'},g).textContent='m';
  lanes.forEach(y=>{el('rect',{x:x0-74,y:y-34,width:x1-x0+100,height:52,rx:16,fill:'#3f5a3a',opacity:.55},g);el('rect',{x:x0-74,y:y+10,width:x1-x0+100,height:8,rx:4,fill:'#2e4520',opacity:.6},g)});
  el('line',{x1:x0,x2:x0,y1:yRule+30,y2:lanes[lanes.length-1]+30,stroke:'#fff4e6','stroke-width':3,'stroke-dasharray':'6 5',opacity:.7},g);
  const COL=['#ffb34d','#8fd6ff','#ff7eb6'];let picks=[],locked=false;
  const sn=vals.map((v,i)=>{const s=snailFig(snL,COL[i%3]),h=toH(v),tag=el('g',{},s.g);
    el('line',{x1:-22,x2:-22,y1:-34,y2:-46,stroke:'#c9a77a','stroke-width':2},tag);el('rect',{x:-50,y:-70,width:56,height:26,rx:8,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2},tag);
    decTxt(tag,-22,-51,v,{sz:16,col:'#3a2418',weight:700});
    const o={v,h,i,s,x:x0,y:lanes[i],put(x){o.x=x;s.g.setAttribute('transform',`translate(${(x-22).toFixed(1)},${o.y})`)}};o.put(x0);
    const hit=el('rect',{x:-56,y:-72,width:84,height:88,fill:'transparent'},s.g);
    interact(s.g,{label:label(v),tap:()=>{if(locked)return;tap(o)}});return o});
  function tap(o){SFX.pop(1.1);if(mode==='pick')picks=[o];else{const at=picks.indexOf(o);if(at>=0)picks=picks.slice(0,at);else picks.push(o)}drawMarks();onReady&&onReady(mode==='pick'?picks.length===1:picks.length===sn.length)}
  function drawMarks(){markL.innerHTML='';picks.forEach((o,k)=>{const m=el('g',{transform:`translate(${o.x-86},${o.y-4})`},markL);
    if(mode==='pick'){el('path',{d:'M-4,14 V-16',stroke:'#e8dcc0','stroke-width':3,'stroke-linecap':'round'},m);el('path',{d:'M-4,-16 L16,-9 L-4,-2Z',fill:'#ffc04d',stroke:'#fff6d0','stroke-width':1.5},m)}else{el('circle',{r:15,fill:'#ffc04d',stroke:'#fff6d0','stroke-width':2.5},m);el('text',{y:5.5,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#3a2418'},m).textContent=k+1}popIn(m,.4)})}
  /* after the race: a gold star on the furthest snail, a red cross on a wrong pick */
  function result(best,wrong){const o=sn.find(z=>z.v===best),st=el('g',{transform:`translate(${o.x+30},${o.y-56})`},markL);el('circle',{r:15,fill:'#fff0a0',opacity:.35},st);el('path',{d:'M0,-12 l3.5,8 8.5,.8 -6.5,5.6 2,8.4 -7.5,-4.5 -7.5,4.5 2,-8.4 -6.5,-5.6 8.5,-.8Z',fill:'#ffc04d',stroke:'#fff6d0','stroke-width':1.5},st);popIn(st,.3);
    if(wrong){const w=sn.find(z=>z.v===wrong),c=el('g',{transform:`translate(${w.x+30},${w.y-56})`},markL);el('circle',{r:13,fill:'#ff7a93'},c);el('path',{d:'M-5,-5 L5,5 M5,-5 L-5,5',stroke:'#fff','stroke-width':3,'stroke-linecap':'round'},c);popIn(c,.3)}}
  return{g:g0,sn,result,picks:()=>picks,lock:b=>{locked=b},
    race(done){locked=true;markL.style.opacity=.85;const far=Math.max(...sn.map(o=>o.h)),dist=x=>x0+x/10*px,dur=900+far/100*2600;
      const trails=sn.map(o=>el('line',{x1:x0,x2:x0,y1:o.y+12,y2:o.y+12,stroke:'#dfe8ff','stroke-width':5,opacity:.4,'stroke-linecap':'round'},trailL)),napped=new Set();SFX.whoosh();
      tween(dur,t=>{const d=t*far;sn.forEach((o,k)=>{const x=dist(Math.min(d,o.h));o.put(x);trails[k].setAttribute('x2',x-30);
        o.s.inner.setAttribute('transform',`scale(${(1+Math.sin(t*60+k)*.04).toFixed(3)},1)`);
        if(d>=o.h&&!napped.has(k)){napped.add(k);o.s.inner.removeAttribute('transform');floatText(x+10,o.y-40,'zzz',{size:16,col:'#d8c6e4'});SFX.plop()}});
        markL.innerHTML='';},()=>{drawMarks();done&&done()},ease.lin)}}}

W.snails={scene:'meadow',
notes:`<p>Comparing decimals, with a snail race. Each snail crawls exactly the distance written on its shell (in metres) along a 1 metre track, then falls asleep. She predicts which snail goes furthest by tapping it, then presses Go to watch them race. The track is marked in tenths, so she can see where each one stops.</p>
<p>The big trap: thinking a longer number is a bigger one. 0.3 or 0.25? The 0.25 snail looks like it should win, but 0.3 is 0.30: 30 hundredths beats 25. After each race the numbers are stacked with Dot lined up, and a gold 0 fills the empty place, so she can compare tenths first. A wrong prediction gets a new pair of snails.</p>
<p>Rounds: 0.6 v 0.4, 0.3 v 0.25, 0.09 v 0.1, then three snails to put in order (furthest first): 0.7, 0.65, 0.07; 0.9, 0.19, 0.09; and 1.2, 0.95, 1.05 on a 1.5 metre track.</p>`,
mount(root){
  const R=[{p:[['0.6','0.4'],['0.8','0.5'],['0.3','0.7']]},{p:[['0.3','0.25'],['0.4','0.35'],['0.6','0.55']]},{p:[['0.09','0.1'],['0.2','0.08'],['0.1','0.05']]},
    {p:[['0.7','0.65','0.07'],['0.4','0.38','0.04'],['0.8','0.75','0.08']],ord:1},{p:[['0.9','0.19','0.09'],['0.6','0.16','0.06']],ord:1},{p:[['1.2','0.95','1.05'],['1.1','0.99','1.01']],ord:1,max:15}];
  const S={r:0,busy:false,won:false,pi:{}};
  const qL=el('g',{},root),board=el('g',{},root),panel=el('g',{},root),ui=el('g',{},root);let kit=null;
  const dotG=dotChar(ui,170,44,12);
  const st=navStone({label:'Next race',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this race again',onTap:()=>load()});
  const goB=decGo(ui,540,470,'Go: start the race',race);
  const Q=()=>{const q=R[S.r],vs=q.p[(S.pi[S.r]||0)%q.p.length];return{vs,ord:q.ord,max:q.max||10}};
  const desc=vs=>[...vs].sort((a,b)=>toH(b)-toH(a));
  function why(a,b){const A=toH(a),B=toH(b);if(Math.floor(A/100)!==Math.floor(B/100))return`${Math.floor(A/100)} whole beats ${Math.floor(B/100)} wholes`;
    const ta=Math.floor(A/10)%10,tb=Math.floor(B/10)%10;return ta!==tb?`${ta} tenth${ta===1?'':'s'} beats ${tb} tenth${tb===1?'':'s'}`:`same tenths, so ${A%10} hundredths beats ${B%10}`}
  /* the numbers stacked with Dot lined up, gold zeros filling empty places */
  function stack(vs,y0){panel.innerHTML='';const sz=30,cw=sz*.6,dw=sz*.44,DX=300,h=vs.length*40+22;
    el('rect',{x:DX-110,y:y0-6,width:220,height:h,rx:14,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},panel);
    el('line',{x1:DX,x2:DX,y1:y0+2,y2:y0+h-14,stroke:DOTC,'stroke-width':2,'stroke-dasharray':'3 4',opacity:.8},panel);
    vs.forEach((v,k)=>{let s=v;if(!s.includes('.'))s+='.';const dec=s.split('.')[1].length,pad=s+'0'.repeat(2-dec),ip=pad.split('.')[0].length;
      const ghost=range(0,2-dec-1).map(j=>pad.length-1-j);const n=decNum(panel,DX-ip*cw-dw/2,y0+24+k*40,pad,{sz,col:'#3a2418',anchor:'start',ghost})});
    popIn(panel,.7)}
  function race(){if(S.busy||S.won)return;const q=Q(),picks=kit.picks();if(q.ord?picks.length<q.vs.length:!picks.length){say(q.ord?'Tap all the snails in order first: furthest first.':'Tap the snail you think goes furthest first.');return}
    S.busy=true;goB.style.display='none';kit.race(()=>{const best=desc(q.vs),ok=q.ord?picks.every((o,k)=>o.v===best[k]):picks[0].v===best[0];kit.result(best[0],!ok&&!q.ord?picks[0].v:null);
      const wn=kit.sn.find(o=>o.v===best[0]);burst(wn.x,wn.y-20,{n:14,cols:['#fff0a0','#ffc04d','#8ff0c8']});
      stack(q.ord?best:q.vs,q.ord?400:420);
      if(ok)win(q,best);else{SFX.wrong();say(q.ord?`Not quite: furthest first is ${best.join(', ')}. Line up Dot and compare from the left. New snails coming…`:`${best[0]} went further: ${why(best[0],best[1])}. New snails coming…`);
        S.pi[S.r]=(S.pi[S.r]||0)+1;later(3600,load)}})}
  function win(q,best){S.won=true;roundWon(S.r);SFX.fanfare();
    starterQ(qL,q.ord?best.flatMap((v,k)=>k?[['o','>'],['w',v]]:[['w',v]]):[['w',q.vs[0]],['o',toH(q.vs[0])>toH(q.vs[1])?'>':'<'],['w',q.vs[1]]],true,dotG);dotG.mood('happy');
    say(q.ord?`Right! ${best.join(' > ')}. Line up Dot and compare from the left: wholes, then tenths, then hundredths.`:`${best[0]} goes further: ${why(best[0],best[1])}!`);
    if(S.r>=1&&q.vs.some(v=>v.length!==q.vs[0].length))unlock('compare');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';panel.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='none';
    const vs=[...q.vs].sort(()=>Math.random()-.5),lanes=vs.length===2?[226,320]:[210,290,370];
    kit=snailKit(board,{x0:80,x1:q.max===15?530:520,max:q.max,yRule:100,lanes,vals:vs,mode:q.ord?'order':'pick',label:v=>`Snail ${v}`,onReady:r=>{goB.style.display=r?'':'none'}});
    starterQ(qL,q.ord?vs.flatMap((v,k)=>k?[['t',','],['w',v]]:[['w',v]]):[['w',vs[0]],['o','?'],['w',vs[1]]],false,dotG);dotG.mood('');
    say(S.r===0?'Each snail crawls the distance on its shell, then naps. Which goes furthest? Tap it, then Go.':q.ord?'Three snails! Tap them in order, furthest first, then Go.':`Which snail goes further: ${vs[0]} or ${vs[1]}? Tap it, then Go.`)}
  S.r=resumeAt(R.length);load();
}};
