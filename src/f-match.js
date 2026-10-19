/* ================= World 3: Match ================= */
W.match={scene:'oven',
notes:`<p>Equivalent fractions: the same amount cut into different slices. It leads to Glass (the same idea backwards: fewer, bigger pieces) and then Join (adding). Six quick rounds: three of Twins, then three of Recut.</p>
<p><b>Twins.</b> Six pizzas, three matching pairs. Tap one, then the one you think is the same amount. No fraction knowledge needed: it is just "which plates have the same amount of pizza?". A match slides together so both sets of cut lines show at once. The third round has traps like 2/3 and 2/5, which look alike but aren't.</p>
<p><b>Recut.</b> Chef has an order: cut this pizza into sixths (or eighths, twelfths…). Before any cutting, she says how many slices of pizza there will be, then taps Go. The pizza wheel cuts, the slices are counted one by one, and the gold lines keep the old slices visible so she can see nothing was added or eaten. A wrong guess loses that order and Chef brings a new one.</p>
<p>The three Recut rounds ramp up. First the new cuts are drawn as dashed lines, so she can just count. Then only one slice shows its new cuts ("each half becomes 3"), so she has to repeat it in her head. Last, no lines at all: she has to work out that sixths into twelfths means every slice becomes 2. With the goggles on, the win shows the step: 1/2 = 1×3 / 2×3 = 3/6. This is where "multiply the top and the bottom by the same number" comes from.</p>`,
mount(root){
  const S={r:0,oi:[0,0,0],tw:0,rc:new Set(),busy:false,won:false};
  const body=el('g',{},root);
  const chef=creature(root,{x:38,y:560,r:18,i:2,hat:'chef',label:'Chef'});
  let stopCut=null;
  const NR=6;
  function show(){EPOCH++;if(stopCut){stopCut();stopCut=null}FX.innerHTML='';body.innerHTML='';S.busy=false;S.won=false;chef.mood('');navDots(NR,S.r);S.r<3?s1():s0()}
  const nextR=()=>{S.r=(S.r+1)%NR;show()};
  const cheer=()=>{chef.mood('happy');chef.hop(18);later(1100,()=>chef.mood(''))};

  /* ---------- Recut: say how many slices first, then cut and count ---------- */
  const RC=[{see:'all',o:[[1,2,6],[1,3,6],[1,2,4],[2,3,6]]},{see:'one',o:[[3,4,8],[2,3,9],[1,2,8],[2,5,10]]},{see:'none',o:[[2,3,12],[3,4,12],[2,5,10],[5,6,12],[3,4,8]]}];
  const PN={4:'quarters',6:'sixths',8:'eighths',9:'ninths',10:'tenths',12:'twelfths'};
  function s0(){
    const L=S.r-3,lv=RC[L],[a,b,T]=lv.o[S.oi[L]%lv.o.length],k=T/b,A=a*k,CX=204,CY=284,R=142;
    const pz=el('g',{},body),guide=el('g',{},body),lab=el('g',{},body),cnt=el('g',{},body),ex=el('g',{},body),card=el('g',{},body);
    const st=navStone({label:'Next round',onTap:nextR});
    function drawPizza(cut){pz.innerHTML='';pizza(pz,{cx:CX,cy:CY,R,n:cut?T:b,have:cut?A:a,fl:0});if(cut)radial(pz,CX,CY,R+12,b,{stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round',opacity:.9})}
    function drawGuide(){guide.innerHTML='';if(lv.see==='none')return;
      const angs=range(0,T-1).map(j=>j/T).filter(t=>Math.abs(t*b-Math.round(t*b))>1e-9).filter(t=>lv.see==='all'||t<1/b);
      if(lv.see==='one')el('path',{d:wedgeD(CX,CY,R+8,0,1/b),fill:'rgba(255,240,160,.16)',stroke:'#fff0a0','stroke-width':3,'stroke-linejoin':'round'},guide);
      angs.forEach(t=>{const [x,y]=polar(CX,CY,R*.86,t),o={x1:CX,y1:CY,x2:x.toFixed(1),y2:y.toFixed(1),'stroke-dasharray':'7 5'};
        el('line',Object.assign({stroke:'#3a2418','stroke-width':5,opacity:.55},o),guide);el('line',Object.assign({stroke:'#fff6d0','stroke-width':2.4},o),guide)})}
    drawPizza(false);drawGuide();svgFrac(lab,CX,CY-R-34,a,b,18);

    /* the order card: a little pie cut into T, then [?] over T */
    const X=500,Y=280;let v=1;
    const tk=el('g',{transform:`translate(${X-35},${Y-138})`},card);
    el('circle',{r:26,fill:'#fff4e6',stroke:'#c98a3a','stroke-width':2.5},tk);
    for(let j=0;j<T;j++){const [x,y]=polar(0,0,26,j/T);el('line',{x1:0,y1:0,x2:x.toFixed(1),y2:y.toFixed(1),stroke:'#c98a3a','stroke-width':1.6},tk)}
    el('rect',{x:X-122,y:Y-90,width:174,height:168,rx:16,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},card);
    el('text',{x:X-92,y:Y-12,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#3a2418'},card).textContent=a;el('line',{x1:X-106,x2:X-78,y1:Y+2,y2:Y+2,stroke:'#3a2418','stroke-width':3.5,'stroke-linecap':'round'},card);el('text',{x:X-92,y:Y+38,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#3a2418'},card).textContent=b;
    el('text',{x:X-58,y:Y+12,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#3a2418'},card).textContent='=';
    const bx=el('g',{transform:`translate(${X-12},${Y-36})`},card);
    el('rect',{x:-28,y:-25,width:56,height:50,rx:9,fill:'#fff',stroke:'#c98a3a','stroke-width':2.5},bx);
    const vt=el('text',{y:11,'text-anchor':'middle','font-size':32,'font-weight':700,fill:'#3a2418'},bx);
    const showV=()=>{vt.textContent=v};
    const set=nv=>{nv=clamp(nv,1,T);if(nv===v){SFX.tick(0);return}v=nv;showV();SFX.tick(v%10)};
    interact(bx,{label:'How many slices of pizza',down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/22),1,T);if(nv!==v){v=nv;showV();SFX.tick(v%10)}},tap:()=>{if(S.busy||S.won)return;set(v+1>T?1:v+1)}});
    [[-1,'up',1],[1,'down',-1]].forEach(([sg,nm,dv])=>{const g=el('g',{transform:`translate(${X+34},${Y-36+sg*16})`},card);el('circle',{r:14,fill:'#2a2150',stroke:'rgba(255,240,160,.5)','stroke-width':1.5},g);
      el('path',{d:sg<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},g);
      interact(g,{label:`How many slices ${nm}`,tap:()=>{if(S.busy||S.won)return;set(v+dv)}})});
    el('line',{x1:X-40,x2:X+16,y1:Y+2,y2:Y+2,stroke:'#3a2418','stroke-width':3.5,'stroke-linecap':'round'},card);
    el('text',{x:X-12,y:Y+46,'text-anchor':'middle','font-size':32,'font-weight':700,fill:'#3a2418'},card).textContent=T;
    const go=el('g',{transform:`translate(${X-35},${Y+122})`},card);el('circle',{r:30,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':3},go);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff'},go).textContent='Go';
    interact(go,{label:'Go: cut the pizza',tap:check});
    showV();

    function check(){if(S.busy||S.won)return;S.busy=true;guide.innerHTML='';const guess=v;
      const angs=range(0,T-1).map(j=>j/T).filter(t=>Math.abs(t*b-Math.round(t*b))>1e-9);
      say(`Chef cuts it into ${PN[T]}…`);
      stopCut=cutter(pz,CX,CY,R,angs,{each:Math.max(80,Math.min(170,900/angs.length)),done:()=>{stopCut=null;drawPizza(true);later(350,count)}});
      function count(){
        for(let i=0;i<A;i++)later(i*300,()=>{const [x,y]=polar(CX,CY,R*.6,(i+.5)/T);const t=el('text',{x:x.toFixed(1),y:(y+8).toFixed(1),'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#fff',stroke:'#3a2418','stroke-width':4,'paint-order':'stroke'},cnt);t.textContent=i+1;popIn(t,1);SFX.plink(i)});
        later(A*300+450,()=>guess===A?win():miss(guess))}
    }
    function win(){S.busy=false;S.won=true;roundWon(S.r);S.rc.add(S.r);if(S.rc.size>=2)unlock('recut');st.ready(true);SFX.fanfare();cheer();burst(CX,CY,{n:22,spread:150});ring(CX,CY,{r1:R+50,w:5});
      const parts=[['f',a,b],['o','='],['f',`${a}×${k}`,`${b}×${k}`],['o','='],['f',A,T]],ew=exprWidth(parts,17)+30;
      const g=el('g',{class:'num'},ex);el('rect',{x:300-ew/2,y:478,width:ew,height:48,rx:14,fill:'#2a2150',opacity:.92},g);svgExpr(g,300,502,parts,17,'middle');
      say(`${A} slices! ${a}/${b} is the same as ${A}/${T}: the same pizza, in smaller slices.`)}
    function miss(guess){SFX.wrong();shake(5);chef.mood('oh');
      say(`You said ${guess}, but it made ${A}. Chef brings a new order…`);
      later(2600,()=>{S.oi[L]++;show()})}
    say(lv.see==='all'?`Chef will cut this into ${PN[T]}, along the dashed lines. How many slices of pizza will there be?`:lv.see==='one'?`Chef will cut this into ${PN[T]}. One slice shows the new cuts. How many slices of pizza will there be?`:`Chef will cut this into ${PN[T]}. How many slices of pizza will there be?`);
  }

  /* ---------- Twins ---------- */
  const ROUNDS=[[[1,2],[2,4],[1,3],[2,6],[3,4],[6,8]],[[2,3],[4,6],[1,4],[3,12],[1,2],[4,8]],[[2,3],[4,6],[2,5],[4,10],[1,2],[5,10]]];
  function s1(){
    const POS=[[112,166],[300,166],[488,166],[112,356],[300,356],[488,356]],R=66;
    const cards=shuffle5(ROUNDS[S.r].map(f=>({f})));
    let sel=null,matched=0;
    const shelf=el('g',{},body);
    [180,300,420].forEach(x=>el('ellipse',{cx:x,cy:548,rx:40,ry:9,fill:'rgba(255,244,230,.08)'},shelf));
    const st=navStone({label:'Next round',onTap:nextR});
    cards.forEach((c,i)=>{c.x=POS[i][0];c.y=POS[i][1];c.s=1;
      c.g=el('g',{},body);c.ring=el('circle',{cx:0,cy:0,r:R+20,fill:'none',stroke:'#fff0a0','stroke-width':3.5},c.g);c.ring.style.display='none';
      c.inner=el('g',{},c.g);pizza(c.inner,{cx:0,cy:0,R,n:c.f[1],have:c.f[0],fl:0,gap:2});
      svgFrac(c.g,0,R+36,c.f[0],c.f[1],15);
      const put=()=>c.g.setAttribute('transform',`translate(${c.x.toFixed(1)},${c.y.toFixed(1)}) scale(${c.s.toFixed(3)})`);c.put=put;put();
      interact(c.g,{label:'pizza',tap:()=>pick(c)})});
    function lift(c,on){c.ring.style.display=on?'':'none';const s0=c.s,s1=on?1.06:1;tween(160,t=>{c.s=lerp(s0,s1,t);c.put()})}
    function pick(c){
      if(S.busy||c.done)return;
      if(!sel){sel=c;lift(c,true);SFX.pop(1.1);say('Now tap the pizza with exactly the same amount.');return}
      if(sel===c){lift(c,false);sel=null;return}
      const A=sel,B=c;sel=null;S.busy=true;
      if(A.f[0]*B.f[1]===B.f[0]*A.f[1]){
        const fx=B.x,fy=B.y;B.g.parentNode.appendChild(B.g);
        tween(420,t=>{B.x=lerp(fx,A.x,t);B.y=lerp(fy,A.y,t);B.put()},()=>{
          const fine=A.f[1]>=B.f[1]?A:B,coarse=fine===A?B:A;
          B.g.style.display='none';A.inner.innerHTML='';A.ring.style.display='none';A.s=1.1;A.put();
          pizza(A.inner,{cx:0,cy:0,R,n:fine.f[1],have:fine.f[0],fl:0,gap:2});
          radial(A.inner,0,0,R+14,coarse.f[1],{stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round'});
          [...A.g.querySelectorAll('.num')].forEach(n=>n.remove());
          svgExpr(A.g,0,R+40,[['f',coarse.f[0],coarse.f[1]],['o','='],['f',fine.f[0],fine.f[1]]],15,'middle');
          chime();SFX.pop(1.4);burst(A.x,A.y,{n:18});ring(A.x,A.y,{r1:120});cheer();say('Twins! The same amount of pizza, cut into different slices.');
          later(1600,()=>{const sx=[180,300,420][matched],x0=A.x,y0=A.y;matched++;A.done=B.done=true;
            tween(520,t=>{A.x=lerp(x0,sx,t);A.y=lerp(y0,526,t);A.s=lerp(1.1,.36,t);A.put()},()=>{
              S.busy=false;
              if(matched===3){S.tw++;roundWon(S.r);if(S.tw>=2)unlock('twins');st.ready(true);SFX.fanfare();say('All the twins found!')}
              else say('Find another pair of twins.')})})});
      }else{
        clonk();shake(5);chef.mood('oh');say('Not twins. Look at how much of each plate is covered.');
        tween(520,(t,p)=>{const dx=Math.sin(p*Math.PI*7)*6*(1-p);[A,B].forEach(z=>z.g.setAttribute('transform',`translate(${(z.x+dx).toFixed(1)},${z.y}) scale(${z.s})`))},()=>{lift(A,false);A.put();B.put();chef.mood('');S.busy=false},ease.lin);
      }
    }
    say('Find the twins. Tap a pizza, then the pizza with exactly the same amount.');
  }

  function shuffle5(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  S.r=resumeAt(NR);show();
}};
