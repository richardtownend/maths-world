/* ---------- 3. Bars: building and reading bar charts ---------- */
W.bars={scene:'survey',
notes:`<p>Bar charts, built and then read by acting on them. First she drags each bar up to match Pip's tally (the bars have a grip on top). Then the scale counts in 2s, so an odd number stops halfway between two lines; then in 5s, from a pictogram where one picture is 5. Then reading: tap the bar for the animal Pip saw most of, then the fewest. Last, "how many more?": a striped block sits on top of the shorter bar and she drags it up until it's level with the taller one; the block is the difference, and its size is the answer.</p>`,
mount(root){
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pickK=n=>['sheep','goat','duck','hen','cow'].sort(()=>Math.random()-.5).slice(0,n);
  const COL={sheep:'#8fd6ff',goat:'#c9a27a',duck:'#ffd23a',hen:'#e8813a',cow:'#7fc86a'};
  const distinct=(n,a,b,m=1)=>{const out=[];while(out.length<n){const v=m*rnd(a,b);if(!out.includes(v))out.push(v)}return out};
  /* scale: [top, step between lines, label every, snap]; src: where the numbers come from */
  const R=[
    {mode:'build',sc:[10,1,1,1],src:'tally',gen:()=>distinct(3,2,9)},
    {mode:'build',sc:[20,2,2,1],src:'tally',gen:()=>{const v=distinct(3,4,18);if(!v.some(x=>x%2))v[0]=v[0]%2?v[0]:v[0]+1;return v}},
    {mode:'build',sc:[40,5,10,5],src:'picto',gen:()=>distinct(3,1,8,5)},
    {mode:'read',sc:[20,2,2,1],gen:()=>distinct(3,3,19)},
    {mode:'diff',sc:[10,1,1,1],gen:()=>{const a=rnd(2,5),p=[a+rnd(2,5),a];if(Math.random()<.5)p.reverse();return[...p,rnd(3,9)]}},
    {mode:'diff',sc:[20,2,2,1],gen:()=>{const a=rnd(3,8),p=[a,a+rnd(3,9)];if(Math.random()<.5)p.reverse();return[...p,rnd(4,16)]}}];
  const S={r:0,busy:false,won:false,ks:[],vals:[],bars:[],step:0,pick:null,diff:0};
  const scene=el('g',{},root),left=el('g',{},root),chart=el('g',{},root),hitL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);let fr=null;
  const st=navStone({label:'Next chart',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this chart again',onTap:()=>load()});
  const Q=()=>R[S.r],FX0=270,FW=340,FY=140,FH=280,BX=i=>FX0+(i+.5)*FW/3,nm=(k,n=2)=>ANIMAL[k].name[n===1?0:1];
  const parts=done=>[['t',Q().mode==='build'?'bar chart':Q().mode==='read'?(S.step?'fewest':'most'):'how many more'],['o','='],done?['w','✓']:['o','?']];
  function drawLeft(){left.innerHTML='';const q=Q();if(q.mode!=='build')return;
    el('rect',{x:24,y:146,width:204,height:46+3*60,rx:10,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':3},left);el('text',{x:126,y:168,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#7a5a3a'},left).textContent=q.src==='tally'?'Pip’s tally':'Pip’s pictogram';
    if(q.src==='picto'){el('text',{x:126,y:190,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#2a4a7a'},left).textContent='key: 1 picture = 5'}
    S.ks.forEach((k,i)=>{const y=226+i*58;el('rect',{x:32,y:y-24,width:188,height:48,rx:8,fill:'rgba(201,167,122,.12)'},left);animalIcon(left,54,y+2,k,.9);
      if(q.src==='tally')tallyMarks(left,80,y,S.vals[i],{h:24,dx:5.6,gap:8});else for(let j=0;j<S.vals[i]/5;j++)animalIcon(left,90+j*18,y+2,k,.55)})}
  function drawChart(){chart.innerHTML='';const q=Q(),[hi,step,lab]=q.sc;fr=chartFrame(chart,{x:FX0,y:FY,w:FW,h:FH,lo:0,hi,step,lab});S.bars=[];
    S.ks.forEach((k,i)=>{animalIcon(chart,BX(i),FY+FH+20,k,1)});
    if(q.mode==='build'){S.ks.forEach((k,i)=>S.bars.push(dragBar(chart,{x:BX(i),w:50,fr,val:0,snap:q.sc[3],max:hi,col:COL[k],label:`Bar: ${nm(k,1)}`,can:()=>!S.busy&&!S.won})));return}
    S.ks.forEach((k,i)=>{const top=fr.yOf(S.vals[i]),g=el('g',{},chart);el('rect',{x:BX(i)-25,y:top,width:50,height:FY+FH-top,fill:COL[k],stroke:darker(COL[k],.6),'stroke-width':2},g);
      if(q.mode==='read'){if(S.pick===i)el('rect',{x:BX(i)-31,y:top-6,width:62,height:FY+FH-top+6,rx:6,fill:'none',stroke:'#9a6cff','stroke-width':4},g);
        el('rect',{x:BX(i)-30,y:FY,width:60,height:FH,fill:'transparent'},g);interact(g,{label:`Bar: ${nm(k,1)}`,tap:()=>{if(S.busy||S.won)return;S.pick=i;SFX.tick(i+2);drawChart()}})}});
    if(q.mode==='diff'){const [a,b]=[0,1].map(i=>S.vals[i]),lo=Math.min(a,b),li=a<b?0:1,x=BX(li),g=el('g',{},chart);
      const top=fr.yOf(lo+S.diff),base=fr.yOf(lo);if(S.diff>0){el('rect',{x:x-25,y:top,width:50,height:base-top,fill:'url(#gStripe)',stroke:'#9a6cff','stroke-width':2.5,'stroke-dasharray':'5 3'},g)}
      el('line',{x1:x-30,x2:x+30,y1:base,y2:base,stroke:'#9a6cff','stroke-width':2},g);const k=el('g',{transform:`translate(${x},${top})`},g);el('rect',{x:-15,y:-34,width:30,height:30,rx:15,fill:'#c9b0ff',stroke:'#6a3ac8','stroke-width':2},k);el('path',{d:'M-6,-21 L0,-28 L6,-21Z M-6,-17 L0,-10 L6,-17Z',fill:'#4a2a8a'},k);
    }}
  /* the difference block's grip: its hit area lives outside the chart so a drag survives the redraws */
  function diffHit(){hitL.innerHTML='';const q=Q();if(q.mode!=='diff')return;const [a,b]=S.vals,lo=Math.min(a,b),x=BX(a<b?0:1);
    const hit=el('rect',{x:x-36,y:FY-40,width:72,height:fr.yOf(lo)-FY+40,fill:'transparent'},hitL),set=n=>{n=clamp(Math.round(n),0,q.sc[0]-lo);if(n===S.diff)return;S.diff=n;SFX.tick(n%8);drawChart()};
    interact(hit,{label:'Difference block',down:()=>({}),move:p=>{if(S.busy||S.won)return;set(fr.vOf(p.y+16)-lo)},tap:p=>{if(S.busy||S.won||!p)return;set(fr.vOf(p.y+16)-lo)}});
    hit.addEventListener('keydown',e=>{if(S.busy||S.won)return;const d=e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0;if(!d)return;e.preventDefault();set(S.diff+d)})}
  function miss(msg){SFX.wrong();shake(2);S.busy=true;say(`${msg} A new chart…`);later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(q.mode==='build'){const v=S.bars.map(b=>b.get());if(v.every(x=>!x)){say('Drag the bars up by their grips.');return}
      const bad=v.findIndex((x,i)=>x!==S.vals[i]);if(bad>=0){const k=S.ks[bad];miss(q.src==='picto'?`Each picture is 5 ${nm(k)}: count the ${nm(k)} pictures in fives.`:q.sc[1]===2?`The lines go up in 2s. An odd number stops halfway between two lines.`:`Count the ${nm(k)} tally: gates of 5, then the ones.`);return}
      return win(`${S.ks.map((k,i)=>`${S.vals[i]} ${nm(k,S.vals[i])}`).join(', ')}.`)}
    if(q.mode==='read'){if(S.pick==null){say('Tap a bar.');return}const want=S.step?S.vals.indexOf(Math.min(...S.vals)):S.vals.indexOf(Math.max(...S.vals));
      if(S.pick!==want){miss(S.step?'The fewest is the shortest bar.':'The most is the tallest bar.');return}
      if(!S.step){S.step=1;S.pick=null;SFX.chime();decQ(qL,parts(false),false,guide);drawChart();say(`Yes, the ${nm(S.ks[want])}! Now tap the one Pip saw fewest of.`);return}
      return win(`Most ${nm(S.ks[S.vals.indexOf(Math.max(...S.vals))])}, fewest ${nm(S.ks[want])}: you can see it without counting.`)}
    const [a,b]=S.vals,d=Math.abs(a-b),hiK=S.ks[a>b?0:1],loK=S.ks[a>b?1:0];if(!S.diff){say('Drag the striped block up by its grip.');return}
    if(S.diff!==d){miss(S.diff<d?`The block doesn’t reach the top of the ${nm(hiK)} bar yet.`:`The block goes past the top of the ${nm(hiK)} bar.`);return}
    win(`Level! Pip saw ${d} more ${nm(hiK)} than ${nm(loK)}.`)}
  function win(msg){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(true),true,guide);burst(440,200,{n:14});say(msg);if(S.r>=2)unlock('gbars');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:false,won:false,ks:pickK(3),vals:q.gen(),step:0,pick:null,diff:0});
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawLeft();drawChart();diffHit();decGo(ui,560,500,q.mode==='read'?'Check: this bar':'Check the chart',check,'Check');
    const [a,b]=S.vals;
    say(q.mode==='build'?(S.r===0?'Make Pip’s tally into a bar chart: drag each bar up by its grip.':q.src==='picto'?'From the pictogram this time: one picture is 5.':'This scale goes up in 2s.'):q.mode==='read'?'Which animal did Pip see most of? Tap its bar.':`How many more ${nm(S.ks[a>b?0:1])} than ${nm(S.ks[a>b?1:0])}? Drag the striped block up until it’s level.`)}
  W.bars.dbgQ=()=>({ks:S.ks,vals:S.vals,mode:Q().mode,sc:Q().sc,step:S.step,r:S.r,diff:S.diff});S.r=resumeAt(R.length);load();
}};
