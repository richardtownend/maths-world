
/* ================= World: Picnic (a fraction divided by a whole number) ================= */
W.picnic={scene:'picnic',
notes:`<p>Dividing a fraction by a whole number. Part of a moon-pie is left (half, say) and some hungry hedgehogs turn up (three). She swipes across the pie to cut it; the knife is magic and keeps every piece the same size, so each swipe just adds one more piece. When she thinks it's fair she rings the bell to serve. Too few pieces and a hedgehog misses out; too many and they squabble over the spare. Either way the pie mends and she tries again.</p>
<p>Then the real question: how much of a <i>whole</i> pie did each hedgehog get? A ghost of the whole pie appears, cut the same way all round, so she can count: a whole pie makes 6 of those pieces, so each hedgehog had 1/6. That's 1/2 ÷ 3 = 1/6.</p>
<p>This links straight back to Fold: sharing between 3 is the same as taking 1/3 of it, so 1/2 ÷ 3 = 1/3 of 1/2. The win writes both. Rounds: 1/2 ÷ 2, 1/2 ÷ 3, 1/3 ÷ 2, 3/4 ÷ 3, 2/3 ÷ 4, and a stretch to finish: 2/3 ÷ 3. Three shares of two-thirds don't fit a whole pie a whole number of times, so the ghost pie is cut into ninths and each hedgehog's share covers two of them: 2/9.</p>`,
mount(root){
  const R=[{f:[1,2],k:2},{f:[1,2],k:3},{f:[1,3],k:2},{f:[3,4],k:3},{f:[2,3],k:4},{f:[2,3],k:3}];
  const gcd=(a,b)=>b?gcd(b,a%b):a,share=r=>{const n=r.f[0],d=r.f[1]*r.k,g=gcd(n,d);return[n/g,d/g]};
  const CX=290,CY=236,RAD=118,A0=-Math.PI/2;
  const S={r:0,cuts:0,ph:'cut',busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r],span=()=>2*Math.PI*Rr().f[0]/Rr().f[1],pieces=()=>S.cuts+1;
  const MOON='#c9a2ff',MOON2='#8f6ad8';

  /* blanket */
  const bl=el('g',{},root);
  el('path',{d:'M40,560 L120,330 L480,330 L560,560Z',fill:'url(#pCheck)',opacity:.9},bl);
  el('path',{d:'M40,560 L120,330 L480,330 L560,560Z',fill:'none',stroke:'#7a2d3a','stroke-width':3},bl);
  /* lanterns */
  [[70,120],[530,100]].forEach(([x,y],k)=>{const g=el('g',{transform:`translate(${x},${y})`},root);el('line',{x1:0,y1:-120,x2:0,y2:-18,stroke:'#5a4a6a','stroke-width':2},g);
    el('circle',{r:38,fill:'#ffd36a',opacity:.12,class:'flicker'},g);el('rect',{x:-12,y:-18,width:24,height:32,rx:6,fill:'#ffe08a',stroke:'#b07a2a','stroke-width':2},g);el('rect',{x:-8,y:-24,width:16,height:6,rx:2,fill:'#b07a2a'},g)});

  /* the pie */
  const pieL=el('g',{},root),cutL=el('g',{},root),ghostL=el('g',{},root),slashL=el('g',{},root);
  const pt=(a,r=RAD)=>[CX+r*Math.cos(a),CY+r*Math.sin(a)];
  const wedge=(a1,a2,r=RAD,cx=CX,cy=CY)=>{const[x1,y1]=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)],[x2,y2]=[cx+r*Math.cos(a2),cy+r*Math.sin(a2)],lg=(a2-a1)>Math.PI?1:0;return `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${lg} 1 ${x2.toFixed(1)},${y2.toFixed(1)}Z`};
  function drawPie(){pieL.innerHTML='';const sp=span();
    el('circle',{cx:CX,cy:CY+10,r:RAD+18,fill:'#0d0a24',opacity:.3},pieL);
    el('circle',{cx:CX,cy:CY,r:RAD+14,fill:'#e8e2f0',stroke:'#b9a8d0','stroke-width':3},pieL);
    el('circle',{cx:CX,cy:CY,r:RAD,fill:'none',stroke:'#fff4e6','stroke-width':2,'stroke-dasharray':'6 6',opacity:.5},pieL);
    for(let k=0;k<9;k++){const a=A0+sp+((2*Math.PI-sp)*(k+.5)/9),[x,y]=pt(a,RAD*(.3+.6*((k*37)%10)/10));el('circle',{cx:x,cy:y,r:2.5,fill:'#c9a77a',opacity:.6},pieL)}
    if(sp>=2*Math.PI-1e-6)el('circle',{cx:CX,cy:CY,r:RAD,fill:'url(#gCrust)'},pieL);else el('path',{d:wedge(A0,A0+sp),fill:'url(#gCrust)'},pieL);
    el('path',{d:sp>=2*Math.PI-1e-6?`M${CX-RAD+12},${CY} a${RAD-12},${RAD-12} 0 1 0 ${2*(RAD-12)},0 a${RAD-12},${RAD-12} 0 1 0 ${-2*(RAD-12)},0`:wedge(A0+.06,A0+sp-.06,RAD-12),fill:MOON},pieL);
    for(let k=0;k<14;k++){const a=A0+sp*(k+.5)/14,[x,y]=pt(a,RAD*(.25+.55*((k*53)%10)/10));el('circle',{cx:x,cy:y,r:2.2,fill:'#fff',opacity:.8,class:'twinkle'},pieL).style.animationDelay=(-k*.3)+'s'}
    drawCuts(1)}
  let shown=[];
  function cutAngles(n){const sp=span();return Array.from({length:n-1},(_,i)=>A0+sp*(i+1)/n)}
  function drawCuts(p){cutL.innerHTML='';const tgt=cutAngles(pieces());if(shown.length!==tgt.length){const old=shown;shown=tgt.map((a,i)=>old[i]!=null?old[i]:A0+span())}
    const cur=shown.map((a,i)=>lerp(a,tgt[i],p));if(p>=1)shown=tgt;
    cur.forEach(a=>{const[x,y]=pt(a,RAD+4);el('line',{x1:CX,y1:CY,x2:x,y2:y,stroke:'#3a2418','stroke-width':3.5,'stroke-linecap':'round'},cutL);el('line',{x1:CX,y1:CY,x2:x,y2:y,stroke:'#fff4e6','stroke-width':1,opacity:.5},cutL)});
    const cnt=el('g',{class:'num'},cutL);if(pieces()>1){el('rect',{x:CX-44,y:CY+RAD+20,width:88,height:26,rx:13,fill:'#2a2150',opacity:.85},cnt);el('text',{x:CX,y:CY+RAD+38,'text-anchor':'middle','font-size':15,fill:'#fff4e6'},cnt).textContent=`${pieces()} pieces`}}
  function addCut(path){if(S.busy||S.won||S.ph!=='cut')return;if(pieces()>=8){SFX.wrong();say('That is plenty of pieces! Ring the bell, or start again.');return}
    S.cuts++;SFX.slice();shake(2);
    if(path&&path.length>1){const d='M'+path.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' L');const s=el('path',{d,fill:'none',stroke:'#fff','stroke-width':6,'stroke-linecap':'round',opacity:.9},slashL);tween(300,(t,p)=>{s.setAttribute('opacity',(.9*(1-p)).toFixed(2));s.setAttribute('stroke-width',(6*(1-p)+1).toFixed(1))},()=>s.remove(),ease.out)}
    crumbs(CX,CY,{n:8,cols:['#c9a77a','#e8c48a',MOON],up:1});
    tween(260,(t,p)=>drawCuts(p),()=>drawCuts(1),ease.back);upd()}
  /* swipe across the pie to cut */
  const knifeZone=el('circle',{cx:CX,cy:CY,r:RAD+30,fill:'transparent'},root);
  interact(knifeZone,{label:'Swipe across the pie to cut it',down:p=>({path:[p]}),move:(p,p0,c)=>{if(S.ph!=='cut')return;c.path.push(p);const last=c.path[c.path.length-2];el('line',{x1:last.x,y1:last.y,x2:p.x,y2:p.y,stroke:'#fff','stroke-width':4,'stroke-linecap':'round',opacity:.7,class:'trail'},slashL)},
    up:(p,p0,c)=>{slashL.querySelectorAll('.trail').forEach(e=>e.remove());const len=Math.hypot(p.x-p0.x,p.y-p0.y);if(len>60)addCut(c.path)},tap:()=>addCut(null)});

  /* hedgehogs */
  const hogL=el('g',{},root);let hogs=[];
  function hedgehog(x,y,i){const g=el('g',{transform:`translate(${x},${y})`},hogL),b=el('g',{class:'bob'},g);b.style.animationDelay=(-i*.6)+'s';
    el('ellipse',{cx:0,cy:24,rx:34,ry:6,fill:'#0d0a24',opacity:.3},g);
    let sp='M-34,14';for(let k=0;k<=10;k++){const a=Math.PI+k*Math.PI/10,r=k%2?40:30;sp+=` L${(r*Math.cos(a)).toFixed(1)},${(8+r*Math.sin(a)*.9).toFixed(1)}`}el('path',{d:sp+'Z',fill:['#6a4a3a','#7a5a44','#5e4434','#84604a'][i%4]},b);
    el('ellipse',{cx:14,cy:12,rx:22,ry:16,fill:'#e8c9a0'},b);el('ellipse',{cx:34,cy:14,rx:8,ry:6,fill:'#e8c9a0'},b);el('circle',{cx:41,cy:13,r:3.5,fill:'#241a3a'},b);
    const eye=el('circle',{cx:20,cy:6,r:3.2,fill:'#241a3a'},b);el('circle',{cx:19,cy:5,r:1.1,fill:'#fff'},b);
    const mouth=el('path',{d:'M26,20 q4,3 8,0',fill:'none',stroke:'#241a3a','stroke-width':1.8,'stroke-linecap':'round'},b);
    [-14,8].forEach(fx=>el('ellipse',{cx:fx,cy:22,rx:6,ry:3.5,fill:'#5a3f2c'},b));
    const plate=el('ellipse',{cx:0,cy:44,rx:26,ry:8,fill:'#f4eff8',stroke:'#b9a8d0','stroke-width':2},g);const onPlate=el('g',{},g);
    return{g,b,x,y,mouth,onPlate,face:m=>mouth.setAttribute('d',m==='happy'?'M24,18 q6,7 12,0':m==='sad'?'M26,23 q4,-4 8,0':m==='eat'?'M27,20 a3,3 0 1 0 6,0 a3,3 0 1 0 -6,0':'M26,20 q4,3 8,0')}}
  function drawHogs(){hogL.innerHTML='';const k=Rr().k;hogs=[];for(let i=0;i<k;i++){const x=k>1?150+i*(300/(k-1)):300;hogs.push(hedgehog(x-6,446+(i%2)*6,i))}}

  /* the bell */
  const bellG=el('g',{transform:'translate(486,316)'},root);el('circle',{r:34,fill:'transparent'},bellG);
  const bellB=el('g',{},bellG);el('path',{d:'M-20,12 Q-20,-22 0,-24 Q20,-22 20,12 Z',fill:'#ffd36a',stroke:'#fff0a0','stroke-width':2.5},bellB);el('rect',{x:-24,y:10,width:48,height:7,rx:3.5,fill:'#e0a43c'},bellB);el('circle',{cy:20,r:5,fill:'#b07a2a'},bellB);el('circle',{cy:-28,r:5,fill:'none',stroke:'#e0a43c','stroke-width':3},bellB);
  el('text',{y:44,'text-anchor':'middle','font-size':13,fill:'#fff4e6'},bellG).textContent='serve';
  interact(bellG,{label:'Ring the bell to serve the pie',tap:serve});
  function ringBell(){SFX.ding();tween(500,(t,p)=>bellB.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*5)*18*(1-p)).toFixed(1)})`),null,ease.lin)}

  function serve(){if(S.busy||S.won||S.ph!=='cut')return;const r=Rr(),n=pieces();ringBell();
    if(n===1&&r.k>1){SFX.wrong();say('Cut the pie first: swipe across it.');return}
    S.busy=true;const sp=span(),ang=cutAngles(n),bounds=[A0,...ang,A0+sp];
    const fl=[];for(let i=0;i<n;i++){const a1=bounds[i],a2=bounds[i+1],g=el('g',{},FX);el('path',{d:wedge(a1,a2),fill:'url(#gCrust)'},g);el('path',{d:wedge(a1+.05,a2-.05,RAD-12),fill:MOON},g);fl.push({g,am:(a1+a2)/2})}
    pieL.style.opacity=0;cutL.style.opacity=0;
    tween(300,(t,p)=>fl.forEach(f=>f.g.setAttribute('transform',`translate(${(Math.cos(f.am)*16*p).toFixed(1)},${(Math.sin(f.am)*16*p).toFixed(1)})`)),()=>{
      const give=Math.min(n,r.k);
      fl.forEach((f,i)=>{const h=hogs[i];if(!h)return;const sc=.36;later(i*140,()=>{tween(520,(t,p)=>{const x=lerp(CX,h.x,p),y=lerp(CY,h.y+40,p)-Math.sin(p*Math.PI)*60;f.g.setAttribute('transform',`translate(${(x-CX*lerp(1,sc,p)).toFixed(1)},${(y-CY*lerp(1,sc,p)).toFixed(1)}) scale(${lerp(1,sc,p).toFixed(3)})`)},()=>{SFX.plop();h.face('happy')},ease.inOut)})});
      later(n*140+700,()=>{
        if(n===r.k){hogs.forEach((h,i)=>later(i*150,()=>{h.face('eat');SFX.crunch();crumbs(h.x,h.y+30,{n:6,cols:['#c9a77a',MOON]})}));
          later(r.k*150+600,()=>{fl.forEach(f=>f.g.remove());hogs.forEach(h=>h.face('happy'));SFX.chime();S.ph='ask';S.busy=false;drawSign();ghost();drawAnswer();upd()})}
        else if(n<r.k){const sadH=hogs.slice(n);sadH.forEach(h=>{h.face('sad');floatText(h.x,h.y-30,'Hey!',{col:'#ffb070',size:22})});SFX.wrong();shake(4);
          say(`Only ${n} pieces for ${r.k} hedgehogs. Someone missed out! The pie mends: try again.`);later(1800,mend)}
        else{fl.slice(r.k).forEach(f=>{tween(500,(t,p)=>f.g.setAttribute('transform',`translate(${(Math.sin(p*30)*6).toFixed(1)},${(30*p).toFixed(1)})`),null,ease.lin)});hogs.forEach(h=>h.face('sad'));SFX.growl(.5);shake(5);floatText(300,330,'Squabble!',{col:'#ffb070',size:26});
          say(`${n} pieces for ${r.k} hedgehogs: they squabbled over the spare! The pie mends: try again.`);later(1800,mend)}})},ease.out)}
  function mend(){FX.innerHTML='';S.cuts=0;shown=[];pieL.style.opacity=1;cutL.style.opacity=1;hogs.forEach(h=>h.face(''));SFX.shimmer();drawPie();S.busy=false;upd()}

  /* the ghost of a whole pie, cut the same way */
  function ghost(){ghostL.innerHTML='';pieL.style.opacity=1;cutL.style.opacity=0;const r=Rr(),[gn,gd]=share(r),N=gd,step=2*Math.PI/N;
    pieL.innerHTML='';el('circle',{cx:CX,cy:CY,r:RAD+14,fill:'#e8e2f0',stroke:'#b9a8d0','stroke-width':3},pieL);
    const g=el('g',{opacity:0},ghostL);
    for(let i=0;i<N;i++){const a1=A0+i*step,a2=a1+step;el('path',{d:wedge(a1,a2),fill:i<gn?'url(#gCrust)':'rgba(201,162,255,.12)',stroke:'#c9a2ff','stroke-width':2,'stroke-dasharray':i<gn?'':'6 5'},g);if(i<gn)el('path',{d:wedge(a1+.05,a2-.05,RAD-12),fill:MOON},g)}
    const[hx,hy]=pt(A0+step*gn/2,RAD*.62);const tag=el('g',{transform:`translate(${hx},${hy})`},g);el('circle',{r:13,fill:'#fff4e6',stroke:'#7a5a44','stroke-width':2},tag);el('path',{d:'M-7,3 q7,-12 14,0',fill:'#6a4a3a'},tag);el('circle',{cx:3,cy:1,r:1.6,fill:'#241a3a'},tag);
    tween(600,(t,p)=>g.setAttribute('opacity',p.toFixed(2)),null,ease.out);ring(CX,CY,{col:'#c9a2ff',r1:RAD+40,w:4})}

  /* answer card */
  const ansL=el('g',{},root),exL=el('g',{},root);let NB=[];
  function numBox(parent,{x,y,w,h,fs,min,max,val,label}){
    const g=el('g',{},parent),bx=el('g',{transform:`translate(${x},${y})`},g);
    el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:9,fill:'#fff',stroke:'#c98a3a','stroke-width':2.5},bx);
    const t=el('text',{y:fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#3a2418'},bx);
    let v=val;const show=()=>{t.textContent=v};const set=nv=>{nv=clamp(nv,min,max);if(nv===v){SFX.tick(0);return}v=nv;show();SFX.tick(v%10)};
    interact(bx,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/22),min,max);if(nv!==v){v=nv;show();SFX.tick(v%10)}},tap:()=>{if(S.busy||S.won)return;set(v+1>max?min:v+1)}});
    [[-1,'up',1],[1,'down',-1]].forEach(([s,nm,dv])=>{const a=el('g',{transform:`translate(${x+w/2+20},${y+s*15})`},g);el('circle',{r:14,fill:'#2a2150',stroke:'rgba(255,240,160,.5)','stroke-width':1.5},a);
      el('path',{d:s<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${label} ${nm}`,tap:()=>{if(S.busy||S.won)return;set(v+dv)}})});
    show();return{get:()=>v}}
  function drawAnswer(){ansL.innerHTML='';NB=[];if(S.ph!=='ask')return;const x=486,y=236;
    el('rect',{x:x-50,y:y-72,width:100,height:144,rx:16,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},ansL);
    NB.push(numBox(ansL,{x:x-10,y:y-32,w:52,h:46,fs:30,min:0,max:24,val:0,label:'One hedgehog’s pieces'}));
    el('line',{x1:x-38,x2:x+18,y1:y,y2:y,stroke:'#3a2418','stroke-width':3.5,'stroke-linecap':'round'},ansL);
    NB.push(numBox(ansL,{x:x-10,y:y+34,w:52,h:46,fs:30,min:1,max:24,val:1,label:'Pieces in a whole pie'}));
    const go=el('g',{transform:`translate(${x},${y+118})`},ansL);el('circle',{r:30,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':3},go);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff'},go).textContent='Go';
    interact(go,{label:'Go: check the answer',tap:check});bellG.style.display='none'}
  function check(){if(S.busy||S.won)return;const r=Rr(),n=NB[0].get(),d=NB[1].get(),tn=r.f[0],td=r.f[1]*r.k;
    if(n>0&&n*td===tn*d)win(n,d);else{SFX.wrong();shake(4);hogs.forEach(h=>{h.face('sad');later(900,()=>h.face('happy'))});say(share(r)[0]>1?'One hedgehog’s share is the gold part. How many small pieces is it, and how many make a whole pie?':d*r.f[0]!==td&&n===1?'Count how many pieces like that make a whole pie.':'One hedgehog had the gold piece. How many of those make a whole pie?')}}
  function win(n,d){const r=Rr(),[sn,sd]=share(r);S.won=true;S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=3)unlock('sharefrac');st.ready(true);SFX.fanfare();drawSign();
    burst(CX,CY,{n:24,spread:160,cols:[MOON,'#fff0a0','#ff9ed2','#8ff0c8']});ring(CX,CY,{r1:200,w:6});
    hogs.forEach((h,i)=>later(i*120,()=>{tween(420,(t,p)=>h.g.setAttribute('transform',`translate(${h.x},${(h.y-Math.sin(p*Math.PI)*30).toFixed(1)})`),null,ease.lin);SFX.plink(i+3)}));
    const parts=[['f',r.f[0],r.f[1]],['o','÷'],['w',r.k],['o','='],['f',1,r.k],['t','of'],['f',r.f[0],r.f[1]],['o','=']];
    if(r.f[0]>1&&sd!==r.f[1]*r.k)parts.push(['f',r.f[0],r.f[1]*r.k],['o','=']);parts.push(['f',sn,sd]);
    const ew=exprWidth(parts,16)+28;el('rect',{x:CX-ew/2,y:380,width:ew,height:44,rx:14,fill:'#2a2150',opacity:.92},exL);svgExpr(exL,CX,402,parts,16,'middle');
    say(`Each hedgehog got ${sn}/${sd} of a whole pie: ${r.f[0]}/${r.f[1]} shared by ${r.k} is ${sn}/${sd}.`)}

  /* the sign: what's left, who's sharing, and (at the end) the question */
  const signL=el('g',{},root);
  function drawSign(){signL.innerHTML='';const r=Rr(),[sn,sd]=share(r);
    const chips=[{icon:'pie',parts:[['f',r.f[0],r.f[1]],['t','left']]},{icon:'hog',parts:[['o','÷'],['w',r.k]]}];
    if(S.ph!=='cut')chips.push({icon:'one',parts:S.won?[['t','each ='],['f',sn,sd]]:[['t','each = ?']]});
    const ws=chips.map(c=>40+exprWidth(c.parts,20)+14),gap=22,tot=ws.reduce((a,b)=>a+b,0)+gap*(chips.length-1);let x=300-tot/2;
    chips.forEach((c,k)=>{const w=ws[k],on=k===chips.length-1&&S.ph!=='cut'&&!S.won,g=el('g',{},signL);
      el('rect',{x,y:10,width:w,height:62,rx:12,fill:'#fff4e6',stroke:on?'#fff0a0':'#c9a77a','stroke-width':on?4:2},g);
      const ic=el('g',{transform:`translate(${x+20},41)`},g);
      if(c.icon==='pie'){el('path',{d:wedge(-Math.PI/2,-Math.PI/2+span(),12,0,0),fill:MOON,stroke:'#c9a77a','stroke-width':2},ic);el('circle',{r:12,fill:'none',stroke:'#c9a77a','stroke-width':1.5,'stroke-dasharray':'3 3'},ic)}
      else if(c.icon==='hog'){el('path',{d:'M-11,5 L-12,-2 L-8,-8 L-2,-11 L4,-10 L9,-6 L10,5Z',fill:'#6a4a3a'},ic);el('ellipse',{cx:6,cy:2,rx:7,ry:5,fill:'#e8c9a0'},ic);el('circle',{cx:7,cy:0,r:1.3,fill:'#241a3a'},ic)}
      else{el('path',{d:wedge(-Math.PI/2,-Math.PI/2+Math.PI/3,12,0,0),fill:MOON,stroke:'#c9a77a','stroke-width':2},ic)}
      const e=svgExpr(g,x+36,42,c.parts,20,'start');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2418;font-weight:700'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'));
      if(on)popIn(g,.9);x+=w+gap})}

  function upd(){if(S.busy||S.won)return;const r=Rr(),n=pieces(),fw=r.f[0]===1?(r.f[1]===2?'Half':r.f[1]===3?'A third':'A quarter'):`${r.f[0]}/${r.f[1]}`;
    if(S.ph==='cut')say(n===1?`${fw} of a moon-pie is left and ${r.k} hedgehogs want some. Swipe across the pie to cut it fairly.`:`${n} equal pieces. Swipe to cut more, or ring the bell to serve.`);
    else if(S.ph==='ask')say(share(r)[0]>1?'Fair shares! Each share doesn’t fit a whole pie neatly, so the ghost pie is cut smaller. One hedgehog’s share is gold: what fraction of a WHOLE pie is it?':'Fair shares! But how much of a WHOLE pie did each hedgehog get? Count the pieces a whole pie makes.')}
  navStone({glyph:'redo',label:'Start this picnic again',onTap:()=>load()});
  const st=navStone({label:'Next picnic',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';ghostL.innerHTML='';ansL.innerHTML='';exL.innerHTML='';slashL.innerHTML='';bellG.style.display='';pieL.style.opacity=1;cutL.style.opacity=1;
    Object.assign(S,{cuts:0,ph:'cut',busy:false,won:false});shown=[];st.ready(false);navDots(R.length,S.r);drawSign();drawPie();drawHogs();upd()}
  S.r=resumeAt(R.length);load();
}};
