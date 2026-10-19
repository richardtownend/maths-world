
/* ================= World: Fold (a fraction of a fraction) ================= */
W.fold={scene:'desk',
notes:`<p>A fraction <i>of</i> a fraction, with paper. The sign says, say, 2/3 of 3/4. First she makes the 3/4: she squashes the paper from the side so it pleats into equal strips (squash further for more strips), then taps to paint 3 of the 4 strips blue. The rest folds away behind.</p>
<p>Now only the blue part is showing, and she takes 2/3 <i>of that</i>: she squashes it from below into 3 equal strips and paints 2 of them pink. Where pink lands on blue it turns purple.</p>
<p>Then she pulls the folded corner and the paper opens out. Because the folds went through every layer, the creases now cut the whole sheet into a grid: 3 rows by 4 columns, 12 pieces, and 6 of them are purple. She enters what fraction of the whole sheet is purple. A right answer folds the paper into an origami creature.</p>
<p>The win writes 2/3 of 3/4 = (2 × 3)/(3 × 4) = 6/12: the creases explain why you multiply the tops and the bottoms. Answers are accepted in any equivalent form, but the sum is shown true to the paper. Rounds: 1/2 of 1/2, 1/2 of 1/3, 1/3 of 3/4, 2/3 of 3/4, 2/3 of 4/5.</p>`,
mount(root){
  const R=[{a:1,b:2,c:1,d:2},{a:1,b:2,c:1,d:3},{a:1,b:3,c:3,d:4},{a:2,b:3,c:3,d:4},{a:2,b:3,c:4,d:5}];
  const P={x:164,y:88,w:272,h:272},BLUE='#5aa8ff',PINK='#ff7eb6',PURP='#9a6cff',PAPER='#fdf6ea';
  const S={r:0,ph:'cols',n:1,cs:new Set(),m:1,rs:new Set(),unf:1,busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r],Wv=()=>P.w*Rr().c/Rr().d;

  const shL=el('g',{},root);el('ellipse',{cx:300,cy:P.y+P.h+22,rx:170,ry:16,fill:'#0d0a24',opacity:.3},shL);
  const paperL=el('g',{},root),hitL=el('g',{},root),gripL=el('g',{},root),exL=el('g',{},root),foxL=el('g',{},root);

  /* the paper */
  function cellFill(col,row){const b=S.cs.has(col);if(b&&S.rs.has(row)&&S.ph!=='cols')return S.ph==='rows'?PINK:PURP;if(b)return BLUE;return PAPER}
  function drawPaper(pl){paperL.innerHTML='';const r=Rr();
    if(pl&&pl.cols){const k=pl.cols,wc=P.w*(1-.1*(k-1)),x0=300-wc/2+(P.x+P.w/2-300),pw=wc/k;
      for(let i=0;i<k;i++){const x=P.x+(i*pw),z=i%2?5:-5;el('path',{d:`M${x},${P.y+z} L${x+pw},${P.y-z} L${x+pw},${P.y+P.h-z} L${x},${P.y+P.h+z}Z`,fill:i%2?'#e7dccb':PAPER,stroke:'#cdbfa8','stroke-width':1},paperL)}
      return}
    if(pl&&pl.rows){const k=pl.rows,hc=P.h*(1-.1*(k-1)),ph=hc/k,w=Wv();
      for(let j=0;j<k;j++){const y=P.y+j*ph,z=j%2?5:-5;el('path',{d:`M${P.x+z},${y} L${P.x+w-z},${y} L${P.x+w+z},${y+ph} L${P.x-z},${y+ph}Z`,fill:j%2?'#cfe4ff':'#9ccaff',stroke:'#7aaee0','stroke-width':1},paperL)}
      foldEdge();return}
    const n=S.n,m=S.m,cw=P.w/n,rh=P.h/m;
    const vis=el('g',{},paperL),hid=el('g',{},paperL);
    const showCols=S.ph==='cols'?n:Math.round(n*r.c/r.d);
    for(let i=0;i<n;i++)for(let j=0;j<m;j++){const g=i<showCols?vis:hid;el('rect',{x:P.x+i*cw,y:P.y+j*rh,width:cw+.5,height:rh+.5,fill:cellFill(i,j)},g)}
    for(let i=1;i<n;i++){const x=P.x+i*cw;el('line',{x1:x,x2:x,y1:P.y,y2:P.y+P.h,stroke:'#b9a98e','stroke-width':1.5,'stroke-dasharray':'5 4'},i<=showCols?vis:hid)}
    for(let j=1;j<m;j++){const y=P.y+j*rh;el('line',{x1:P.x,x2:P.x+showCols*cw,y1:y,y2:y,stroke:'#b9a98e','stroke-width':1.5,'stroke-dasharray':'5 4'},vis);el('line',{x1:P.x+showCols*cw,x2:P.x+P.w,y1:y,y2:y,stroke:'#b9a98e','stroke-width':1.5,'stroke-dasharray':'5 4'},hid)}
    el('rect',{x:P.x,y:P.y,width:showCols*cw,height:P.h,fill:'none',stroke:'#cdbfa8','stroke-width':2},vis);
    if(showCols<n){const ex=P.x+showCols*cw;hid.setAttribute('transform',`translate(${ex},0) scale(${Math.max(.001,S.unf).toFixed(3)},1) translate(${-ex},0)`);el('rect',{x:ex,y:P.y,width:P.w-showCols*cw,height:P.h,fill:'none',stroke:'#cdbfa8','stroke-width':2},hid);if(S.unf<.99)foldEdge()}
    else el('rect',{x:P.x,y:P.y,width:P.w,height:P.h,fill:'none',stroke:'#cdbfa8','stroke-width':2},vis);
    el('path',{d:`M${P.x+6},${P.y+6} l40,0`,stroke:'#fff',opacity:.6,'stroke-width':3,'stroke-linecap':'round'},paperL)}
  function foldEdge(){const x=P.x+Wv();el('rect',{x:x-3,y:P.y-2,width:7,height:P.h+4,rx:3,fill:'#cdbfa8'},paperL);el('rect',{x:x+3,y:P.y+4,width:4,height:P.h-4,fill:'#0d0a24',opacity:.25},paperL)}

  /* tap to paint strips / rows */
  function drawHits(){hitL.innerHTML='';const r=Rr();
    if(S.ph==='cols'&&S.n>1){const cw=P.w/S.n;for(let i=0;i<S.n;i++){const h=el('rect',{x:P.x+i*cw,y:P.y,width:cw,height:P.h,fill:'transparent'},hitL);interact(h,{label:`Strip ${i+1}`,tap:()=>paintCol(i)})}}
    if(S.ph==='rows'&&S.m>1){const rh=P.h/S.m;for(let j=0;j<S.m;j++){const h=el('rect',{x:P.x,y:P.y+j*rh,width:Wv(),height:rh,fill:'transparent'},hitL);interact(h,{label:`Row ${j+1}`,tap:()=>paintRow(j)})}}}
  function paintCol(i){if(S.busy||S.won)return;const r=Rr(),on=!S.cs.has(i);on?S.cs.add(i):S.cs.delete(i);inkSnd(on);drawPaper();const k=S.cs.size;
    if(k===r.c){if(S.n===r.d){S.busy=true;say(`That is ${r.c}/${r.d} blue. Now the rest folds away behind.`);later(450,gather)}else{wob();say(`That makes ${r.c}/${S.n}. You need ${r.c}/${r.d}: count the strips. Squash again to change them.`)}}
    else if(k>r.c)say(`Too many blue strips. You need ${r.c}/${r.d}. Tap one to wipe it.`);else upd()}
  /* blue strips slide together so the rest can fold away behind */
  function gather(){const n=S.n,cw=P.w/n,pt=[...S.cs].sort((x,y)=>x-y),un=[...Array(n).keys()].filter(i=>!S.cs.has(i)),order=[...pt,...un],to={};order.forEach((c,k)=>to[c]=k);
    if(pt.every((c,k)=>c===k)){foldAway();return}SFX.swish();
    tween(420,(t,p)=>{paperL.innerHTML='';for(let i=0;i<n;i++){const x=P.x+lerp(i,to[i],p)*cw,g=el('g',{},paperL);el('rect',{x,y:P.y,width:cw+.5,height:P.h,fill:S.cs.has(i)?BLUE:PAPER,stroke:'#cdbfa8','stroke-width':1},g)}},
      ()=>{S.cs=new Set(pt.map((_,k)=>k));drawPaper();later(150,foldAway)},ease.inOut)}
  function paintRow(j){if(S.busy||S.won)return;const r=Rr(),on=!S.rs.has(j);on?S.rs.add(j):S.rs.delete(j);inkSnd(on);drawPaper();const k=S.rs.size;
    if(k===r.a){if(S.m===r.b){S.busy=true;say('Pink on blue… stir it up!');later(350,()=>mix(()=>{S.ph='unfold';S.busy=false;drawPaper();drawGrips();drawSign();say('Pink and blue make purple. Now pull the folded corner to open the paper out.')}))}else{wob();say(`That makes ${r.a}/${S.m} of the blue part. You need ${r.a}/${r.b}: squash again to change the strips.`)}}
    else if(k>r.a)say(`Too many pink strips. You need ${r.a}/${r.b} of the blue. Tap one to wipe it.`);else upd()}
  /* pink and blue swirl together into purple */
  const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mixC=(a,b,p)=>{const A=hx(a),B=hx(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*p)).join(',')+')'};
  const mixL=el('g',{},root);
  function mix(done){const rows=[...S.rs],cols=[...S.cs],cw=P.w/S.n,rh=P.h/S.m,R0=Math.min(cw,rh)*.36;SFX.shimmer();SFX.swish();later(250,()=>SFX.swish());
    const spiral=(cx,cy,rot,sc)=>{let d='';for(let k=0;k<=28;k++){const t=k/28,a=t*4*Math.PI+rot,r=R0*sc*t;d+=(k?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)}return d};
    tween(1000,(t,p)=>{mixL.innerHTML='';const col=mixC(PINK,PURP,clamp((p-.25)/.6,0,1)),op=Math.sin(p*Math.PI);
      rows.forEach(j=>cols.forEach(i=>{const x=P.x+i*cw,y=P.y+j*rh,cx=x+cw/2,cy=y+rh/2;el('rect',{x,y,width:cw+.5,height:rh+.5,fill:col},mixL);
        el('path',{d:spiral(cx,cy,p*7,1),fill:'none',stroke:BLUE,'stroke-width':4,'stroke-linecap':'round',opacity:op.toFixed(2)},mixL);
        el('path',{d:spiral(cx,cy,p*7+Math.PI,1),fill:'none',stroke:PINK,'stroke-width':4,'stroke-linecap':'round',opacity:op.toFixed(2)},mixL)}))},
      ()=>{mixL.innerHTML='';SFX.sparkle();rows.forEach(j=>ring(P.x+Wv()/2,P.y+(j+.5)*rh,{col:PURP,r1:Wv()*.7,w:4,dur:500}));done()},ease.inOut)}
  const inkSnd=up=>{if(up){SFX.swish();osc('sine',700,.08,.05,{to:1100,wet:.3})}else SFX.tick(0)};
  function wob(){SFX.wrong();tween(420,(t,p)=>paperL.setAttribute('transform',`translate(${(Math.sin(p*Math.PI*6)*6*(1-p)).toFixed(1)},0)`),()=>paperL.removeAttribute('transform'),ease.lin)}
  function foldAway(){SFX.rustle();tween(520,(t,p)=>{S.unf=1-p;S.ph='rows';drawPaper()},()=>{S.unf=0;S.ph='rows';S.busy=false;SFX.crease();drawPaper();drawHits();drawGrips();drawSign();upd()},ease.inOut);S.ph='rows'}

  /* grips: squash from the side, squash from below, open the corner */
  function grip(x,y,w,h,label,hint,cb){const g=el('g',{},gripL);el('rect',{x:x-w/2-10,y:y-h/2-10,width:w+20,height:h+20,fill:'transparent'},g);
    el('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:Math.min(w,h)/2,fill:'#e9b24c',stroke:'#fff3c4','stroke-width':2.5},g);
    for(let k=-1;k<=1;k++)el('line',w>h?{x1:x+k*8,x2:x+k*8,y1:y-h/4,y2:y+h/4,stroke:'#8a5a1a','stroke-width':2}:{x1:x-w/4,x2:x+w/4,y1:y+k*8,y2:y+k*8,stroke:'#8a5a1a','stroke-width':2},g);
    if(hint){const a=el('g',{class:hint.cls},gripL);el('path',{d:hint.d,fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.8},a)}
    interact(g,Object.assign({label},cb));return g}
  function drawGrips(){gripL.innerHTML='';if(S.won)return;const r=Rr();
    if(S.ph==='cols'){const x=P.x+P.w+18,y=P.y+P.h/2;let k=S.n;
      grip(x,y,20,70,'Squash the paper from the side to fold it into strips',S.n===1?{cls:'nudge',d:`M${x+40},${y} l-18,0 m8,-8 l-8,8 l8,8`}:null,{
        down:()=>({k:S.n}),move:(p,p0,c)=>{if(S.busy)return;const d=Math.max(0,p0.x-p.x),nk=clamp(1+Math.floor(d/34),1,6);if(nk!==c.k){c.k=nk;SFX.crease();osc('triangle',220+nk*60,.05,.04,{wet:.1});pleatLabel(nk,'cols')}drawPaper({cols:nk})},
        up:(p,p0,c)=>{if(S.busy)return;pleatLabel(null);if(c.k===S.n){drawPaper();return}S.n=c.k;S.cs=new Set();SFX.rustle();drawPaper();drawHits();drawGrips();upd()}})}
    if(S.ph==='rows'){const x=P.x+Wv()/2,y=P.y+P.h+18;
      grip(x,y,70,20,'Squash the blue part from below to fold it into strips',S.m===1?{cls:'nudgeup',d:`M${x},${y+40} l0,-18 m-8,8 l8,-8 l8,8`}:null,{
        down:()=>({k:S.m}),move:(p,p0,c)=>{if(S.busy)return;const d=Math.max(0,p0.y-p.y),nk=clamp(1+Math.floor(d/30),1,6);if(nk!==c.k){c.k=nk;SFX.crease();osc('triangle',220+nk*60,.05,.04,{wet:.1});pleatLabel(nk,'rows')}drawPaper({rows:nk})},
        up:(p,p0,c)=>{if(S.busy)return;pleatLabel(null);if(c.k===S.m){drawPaper();return}S.m=c.k;S.rs=new Set();SFX.rustle();drawPaper();drawHits();drawGrips();upd()}})}
    if(S.ph==='unfold'){const x=P.x+Wv(),y=P.y+P.h,g=el('g',{},gripL);
      el('circle',{cx:x,cy:y,r:34,fill:'transparent'},g);el('path',{d:`M${x-26},${y} L${x},${y-26} L${x},${y}Z`,fill:'#e9dfd0',stroke:'#fff0a0','stroke-width':2.5},g);
      const glow=el('circle',{cx:x,cy:y,r:30,fill:'none',stroke:'#fff0a0','stroke-width':2.5,class:'ring'},g);
      const hint=el('g',{class:'nudger'},gripL);el('path',{d:`M${x+18},${y+18} l22,0 m-8,-8 l8,8 l-8,8`,fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85},hint);
      const span=P.w-Wv();interact(g,{label:'Pull the corner to unfold the paper',down:()=>({}),
        move:(p,p0)=>{if(S.busy)return;S.unf=clamp((p.x-p0.x)/span,0,1);drawPaper();if(S.unf>.02)hint.style.display='none'},
        up:()=>{if(S.busy)return;if(S.unf>.5)unfold();else{const u0=S.unf;tween(200,(t,p)=>{S.unf=u0*(1-p);drawPaper()},()=>{S.unf=0;drawPaper()},ease.out)}},
        tap:()=>{if(!S.busy)unfold()}})}}
  const plL=el('g',{},root);
  function pleatLabel(k,dir){plL.innerHTML='';if(!k)return;const x=dir==='cols'?P.x+P.w*(1-.1*(k-1))/2:P.x+Wv()/2,y=dir==='cols'?P.y+P.h/2:P.y+P.h*(1-.1*(k-1))/2;
    const g=el('g',{transform:`translate(${x},${y})`},plL);el('circle',{r:34,fill:'#2a2150',opacity:.88,stroke:'#fff0a0','stroke-width':2.5},g);
    el('text',{y:8,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#fff0a0'},g).textContent=k;el('text',{y:25,'text-anchor':'middle','font-size':10,fill:'#fff4e6'},g).textContent=k>1?'strips':'strip'}
  function unfold(){S.busy=true;gripL.innerHTML='';SFX.unfold();const u0=S.unf;
    tween(600,(t,p)=>{S.unf=lerp(u0,1,p);drawPaper()},()=>{S.unf=1;S.ph='answer';drawPaper();SFX.sparkle();ring(300,P.y+P.h/2,{r1:200,w:5});S.busy=false;drawSign();drawAnswer();upd()},ease.back)}

  /* the answer card: written like a fraction */
  const ansL=el('g',{},root);let NB=[];
  function numBox(parent,{x,y,w,h,fs,min,max,val,label,side}){
    const g=el('g',{},parent),bx=el('g',{transform:`translate(${x},${y})`},g);
    el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:9,fill:'#fff',stroke:'#c98a3a','stroke-width':2.5},bx);
    const t=el('text',{y:fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#3a2418'},bx);
    let v=val;const show=()=>{t.textContent=v};
    const set=nv=>{nv=clamp(nv,min,max);if(nv===v){SFX.tick(0);return}v=nv;show();SFX.tick(v%10);osc('triangle',300+v*12,.05,.04,{wet:.15})};
    interact(bx,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/22),min,max);if(nv!==v){v=nv;show();SFX.tick(v%10)}},tap:()=>{if(S.busy||S.won)return;set(v+1>max?min:v+1)}});
    const ax=x+(side==='left'?-1:1)*(w/2+20);
    [[-1,'up',1],[1,'down',-1]].forEach(([s,nm,dv])=>{const a=el('g',{transform:`translate(${ax},${y+s*15})`},g);el('circle',{r:14,fill:'#2a2150',stroke:'rgba(255,240,160,.5)','stroke-width':1.5},a);
      el('path',{d:s<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${label} ${nm}`,tap:()=>{if(S.busy||S.won)return;set(v+dv)}})});
    show();return{get:()=>v}}
  function drawAnswer(){ansL.innerHTML='';NB=[];if(S.ph!=='answer')return;const y=486,ink='#3a2418';
    el('rect',{x:240,y:y-72,width:140,height:144,rx:16,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},ansL);
    el('rect',{x:186,y:y-13,width:26,height:26,rx:5,fill:PURP,stroke:'#fff4e6','stroke-width':2},ansL);el('text',{x:226,y:y+9,'text-anchor':'middle','font-size':26,'font-weight':700,fill:'#fff4e6'},ansL).textContent='=';
    NB.push(numBox(ansL,{x:300,y:y-32,w:58,h:46,fs:30,min:0,max:36,val:0,label:'Purple pieces',side:'right'}));
    el('line',{x1:270,x2:330,y1:y,y2:y,stroke:ink,'stroke-width':3.5,'stroke-linecap':'round'},ansL);
    NB.push(numBox(ansL,{x:300,y:y+34,w:58,h:46,fs:30,min:1,max:36,val:1,label:'Pieces in the whole sheet',side:'right'}));
    const go=el('g',{transform:`translate(450,${y})`},ansL);el('circle',{r:32,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':3},go);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff'},go).textContent='Go';
    interact(go,{label:'Go: check the answer',tap:check})}
  function check(){if(S.busy||S.won)return;const r=Rr(),n=NB[0].get(),d=NB[1].get(),tn=r.a*r.c,td=r.b*r.d;
    if(n*td===tn*d&&n>0){win(n,d)}
    else{SFX.wrong();shake(4);tween(500,(t,p)=>paperL.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*5)*3*(1-p)).toFixed(2)} 300 ${P.y+P.h/2})`),()=>paperL.removeAttribute('transform'),ease.lin);
      say(d!==td?`Count all the pieces the creases make on the whole sheet, then how many are purple.`:`Count the purple pieces again.`)}}
  function win(n,d){const r=Rr();S.won=true;drawSign();S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=3)unlock('foldof');st.ready(true);SFX.fanfare();
    const parts=[['f',r.a,r.b],['t','of'],['f',r.c,r.d],['o','='],['f',`${r.a}×${r.c}`,`${r.b}×${r.d}`],['o','='],['f',r.a*r.c,r.b*r.d]];
    if(n*(r.b*r.d)===r.a*r.c*d&&(n!==r.a*r.c)){parts.push(['o','='],['f',n,d])}
    svgExpr(exL,300,P.y+P.h+44,parts,16,'middle');
    say(`Yes! The creases made ${r.b*r.d} pieces and ${r.a*r.c} are purple: ${r.a}/${r.b} of ${r.c}/${r.d} is ${r.a*r.c}/${r.b*r.d}.`);
    ansL.innerHTML='';later(900,()=>{tween(420,(t,p)=>{paperL.setAttribute('transform',`translate(300,${P.y+P.h/2}) scale(${(1-p).toFixed(3)}) rotate(${(p*90).toFixed(1)}) translate(-300,${-(P.y+P.h/2)})`);paperL.setAttribute('opacity',(1-p).toFixed(2))},()=>{fox();SFX.chime()},ease.in)})}

  /* the origami creature */
  function fox(){foxL.innerHTML='';const g=el('g',{transform:`translate(300,${P.y+P.h/2+10})`},foxL),b=el('g',{class:'bob'},g);
    el('path',{d:'M40,40 L118,-30 L92,46Z',fill:PURP},b);el('path',{d:'M92,46 L118,-30 L104,44Z',fill:'#7d52e0'},b);el('path',{d:'M112,-22 L118,-30 L114,-8Z',fill:PAPER},b);
    el('path',{d:'M-70,60 L70,60 L0,-10Z',fill:BLUE},b);el('path',{d:'M0,-10 L70,60 L0,60Z',fill:'#3f8ee8'},b);
    el('path',{d:'M-62,-40 L62,-40 L0,40Z',fill:PURP},b);el('path',{d:'M0,-40 L62,-40 L0,40Z',fill:'#8558f0'},b);el('path',{d:'M-20,10 L20,10 L0,40Z',fill:PAPER},b);
    [-1,1].forEach(s=>{el('path',{d:`M${s*62},-40 L${s*48},-92 L${s*22},-40Z`,fill:PURP},b);el('path',{d:`M${s*52},-46 L${s*46},-74 L${s*32},-46Z`,fill:PINK,opacity:.7},b)});
    const eyes=[-1,1].map(s=>{const e=el('ellipse',{cx:s*22,cy:-14,rx:6,ry:7,fill:'#241a3a'},b);el('circle',{cx:s*22-2,cy:-17,r:2,fill:'#fff'},b);return e});
    el('circle',{cx:0,cy:36,r:5,fill:'#241a3a'},b);
    popIn(g,.2);burst(300,P.y+P.h/2,{n:26,spread:160,cols:[BLUE,PINK,PURP,'#fff0a0']});ring(300,P.y+P.h/2,{r1:180,w:6});floatText(440,P.y+70,'Paper fox!');
    loop(()=>{const t=performance.now()/1000;const bl=(t%3.2)<.12;eyes.forEach(e=>e.setAttribute('ry',bl?1:7))});
    interact(g,{label:'Paper fox',tap:()=>{SFX.pop(1.3);tween(380,(t,p)=>g.setAttribute('transform',`translate(300,${(P.y+P.h/2+10-Math.sin(p*Math.PI)*40).toFixed(1)})`),null,ease.lin)}})}

  /* sign */
  const signL=el('g',{},root);
  /* the recipe: three steps, the one you're on is lit */
  function drawSign(){signL.innerHTML='';const r=Rr(),step=S.won?3:S.ph==='cols'?0:S.ph==='rows'?1:2;
    const chips=[{col:BLUE,ink:'#2f7fd8',parts:[['f',r.c,r.d]]},{col:PINK,ink:'#e0428a',parts:[['f',r.a,r.b],['t','of the blue']]},{col:PURP,ink:'#6a3fd0',parts:S.won?[['f',r.a*r.c,r.b*r.d]]:[['t','?']]}];
    const ws=chips.map(c=>34+exprWidth(c.parts,20)+16),gap=26,tot=ws.reduce((a,b)=>a+b,0)+gap*2;let x=300-tot/2;
    chips.forEach((c,k)=>{const w=ws[k],on=k===step,done=k<step,g=el('g',{opacity:on||done||S.won?1:.5},signL);
      el('rect',{x,y:10,width:w,height:62,rx:12,fill:PAPER,stroke:on?'#fff0a0':'#cdbfa8','stroke-width':on?4:2},g);
      el('rect',{x:x+10,y:31,width:20,height:20,rx:5,fill:c.col},g);
      const e=svgExpr(g,x+38,42,c.parts,20,'start');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style',`fill:${c.ink};font-weight:700`));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke',c.ink));
      if(done){const t=el('g',{transform:`translate(${x+w-4},14)`},g);el('circle',{r:10,fill:'#6fcf6a',stroke:PAPER,'stroke-width':2},t);el('path',{d:'M-4,0 l3,3 l5,-6',fill:'none',stroke:'#fff','stroke-width':2.5,'stroke-linecap':'round'},t)}
      if(on)popIn(g,.92);
      x+=w;if(k<2){el('path',{d:`M${x+6},41 h12 m-5,-5 l5,5 l-5,5`,fill:'none',stroke:'#fff4e6','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.8},signL);x+=gap}})}

  function upd(){if(S.busy||S.won)return;const r=Rr();
    if(S.ph==='cols')say(S.n===1?`Step 1: paint ${r.c}/${r.d} of the paper blue. First squash it from the side to fold it into equal strips.`:`Tap any strips to paint them blue. You need ${r.c}/${r.d} of the paper.`);
    else if(S.ph==='rows')say(S.m===1?`Step 2: paint ${r.a}/${r.b} of the blue part pink. Squash it from below to fold it into equal strips.`:`Tap any strips to paint them pink. You need ${r.a}/${r.b} of the blue.`);
    else if(S.ph==='answer')say('Step 3: what fraction of the whole sheet is purple? Count the pieces.')}
  navStone({glyph:'redo',label:'Start this sheet again',onTap:()=>load()});
  const st=navStone({label:'Next sheet',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';exL.innerHTML='';foxL.innerHTML='';ansL.innerHTML='';plL.innerHTML='';paperL.removeAttribute('transform');paperL.setAttribute('opacity',1);
    mixL.innerHTML='';Object.assign(S,{ph:'cols',n:1,cs:new Set(),m:1,rs:new Set(),unf:1,busy:false,won:false});st.ready(false);
    navDots(R.length,S.r);drawSign();drawPaper();drawHits();drawGrips();upd()}
  S.r=resumeAt(R.length);load();
}};
