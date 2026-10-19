
/* ================= World 5: Jugs (the bath) ================= */
W.jugs={scene:'glass',
notes:`<p>Fractions bigger than one whole, with a goal. Two rows of jugs are filled from two taps, and each tap pours a different size of cup: thirds in one row and quarters in the other, say. Each row can hold up to two whole jugs, so a row of seven quarter-cups is one full jug and three quarters of the next (7/4 = 1 3/4).</p>
<p>When she is ready, she pulls the lever and both rows pour into the bath at once. The big critter in the bath wants it filled exactly to the golden line. There is only one pour, so it has to be worked out first. Too little and the critter shivers, too much and the bath overflows.</p>
<p>Six baths, easy to hard. 1: both taps pour quarters, fill to 3/4. 2: halves and quarters, still under one whole (1/2 + 1/4). 3: halves and quarters past one whole (1 1/4). 4: thirds and sixths (1 1/2). 5: halves and thirds, which only meet at sixths (1 1/6). 6: thirds and quarters, which meet at twelfths (1 5/12).</p>
<p>This is adding fractions with different denominators, in disguise: 4/3 + 1/4 has to land on 1 7/12. With the numbers on, each row shows its total both ways (5/4 = 1 1/4), and after the pour the whole sum is written out: 4/3 + 1/4 = 16/12 + 3/12 = 19/12 = 1 7/12. There is usually more than one way to fill the bath right.</p>`,
mount(root){
  const ROWS=[{y:68},{y:214}],JX=[178,272],JW=72,JH=112,BX0=96,BX1=476,BB=528,BH=132,CAP=3;
  const RID=[{a:4,b:4,t:[0,3,4]},{a:2,b:4,t:[0,3,4]},{a:2,b:4,t:[1,1,4]},{a:3,b:6,t:[1,1,2]},{a:2,b:3,t:[1,1,6]},{a:3,b:4,t:[1,5,12]}];
  const S={r:0,cups:[0,0],busy:false,poured:false,lvl:[[0,0],[0,0]],bath:0,amp:0,wins:0};
  const R=()=>RID[S.r],den=i=>i?R().b:R().a,tU=()=>{const t=R().t;return U*t[0]+U*t[1]/t[2]};
  const rowU=i=>U*S.cups[i]/den(i);

  /* rows of jugs with their taps */
  const rowL=el('g',{},root),labL=el('g',{},root),bathBack=el('g',{},root);
  const defs=el('defs',{},root);
  const jugs=ROWS.map((row,i)=>JX.map((cx,j)=>{const id=`jc${i}${j}`,cp=el('clipPath',{id},defs);el('rect',{x:cx-JW/2+4,y:row.y+4,width:JW-8,height:JH-8,rx:10},cp);
    const g=el('g',{},rowL);el('path',{d:`M${cx+JW/2-3},${row.y+26} q24,4 22,34 q-2,28 -22,32`,fill:'none',stroke:'rgba(255,244,230,.35)','stroke-width':6,'stroke-linecap':'round'},g);
    const liq=el('g',{'clip-path':`url(#${id})`},g),body=el('rect',{x:cx-JW/2+4,y:row.y+JH,width:JW-8,height:0,fill:'url(#gWater)'},liq),surf=el('path',{fill:'#b9ecff',opacity:.9},liq);
    el('rect',{x:cx-JW/2,y:row.y,width:JW,height:JH,rx:14,fill:'url(#gGlass)',stroke:'rgba(255,244,230,.55)','stroke-width':2.5},g);
    el('rect',{x:cx-JW/2+8,y:row.y+12,width:6,height:JH-40,rx:3,fill:'#fff',opacity:.18},g);
    const ticks=el('g',{},g);return{cx,y:row.y,body,surf,ticks}}));
  ROWS.forEach((row,i)=>{const my=row.y+JH/2;
    const tap=el('g',{transform:`translate(70,${my})`},root);
    el('circle',{r:30,fill:i?'#2f9a8a':'#2f7fc4',stroke:'#b9ecff','stroke-width':3},tap);
    el('path',{d:'M0,-15 C7,-5 11,2 11,8 A11,11 0 0 1 -11,8 C-11,2 -7,-5 0,-15Z',fill:'#e6f8ff'},tap);
    interact(tap,{label:`Pour one cup into row ${i+1}`,tap:()=>pour(i,1)});
    const sc=el('g',{transform:`translate(124,${my+34})`},root);
    el('circle',{r:16,fill:'url(#gKnob)',stroke:'rgba(255,244,230,.4)'},sc);el('path',{d:'M-7,0 h14',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round'},sc);
    interact(sc,{label:`Take one cup out of row ${i+1}`,tap:()=>pour(i,-1)})});

  /* the bath */
  el('ellipse',{cx:(BX0+BX1)/2,cy:BB+14,rx:(BX1-BX0)/2+20,ry:12,fill:'#0d0a24',opacity:.35},bathBack);
  el('path',{d:`M${BX0-10},${BB-BH-8} h${BX1-BX0+20} v${BH-30} q0,38 -40,38 h${-(BX1-BX0)+60} q-40,0 -40,-38Z`,fill:'#e8e2f0',stroke:'#b9a8d0','stroke-width':3},bathBack);
  el('path',{d:`M${BX0},${BB-BH} h${BX1-BX0} v${BH-28} q0,28 -30,28 h${-(BX1-BX0)+60} q-30,0 -30,-28Z`,fill:'#3b3160'},bathBack);
  const critter=creature(root,{x:392,y:BB-56,r:44,i:3,label:'Bath critter'});
  const bathCp=el('clipPath',{id:'bathclip'},defs);el('path',{d:`M${BX0},${BB-BH-60} h${BX1-BX0} v${BH+60-28} q0,28 -30,28 h${-(BX1-BX0)+60} q-30,0 -30,-28Z`},bathCp);
  const bathLiq=el('g',{'clip-path':'url(#bathclip)'},root),bBody=el('rect',{x:BX0,y:BB,width:BX1-BX0,height:0,fill:'url(#gWater)',opacity:.88},bathLiq),bSurf=el('path',{fill:'#b9ecff',opacity:.85},bathLiq),foam=el('g',{},bathLiq);
  el('rect',{x:BX0-12,y:BB-BH-14,width:BX1-BX0+24,height:10,rx:5,fill:'#f4eff8'},root);
  const bathTicks=el('g',{},root),target=el('g',{},root),streams=el('g',{},root),exL=el('g',{},root);
  const bathY=u=>BB-u/U*(BH/CAP)*1;
  for(let w=1;w<CAP;w++){const y=BB-w*BH/CAP;el('line',{x1:BX0+2,x2:BX0+16,y1:y,y2:y,stroke:'#fff4e6','stroke-width':2.5,opacity:.6},bathTicks);el('text',{x:BX0-22,y:y+5,'text-anchor':'middle','font-size':14},el('g',{class:'num'},bathTicks)).textContent=w}

  /* lever */
  const LX=548,LT=360,LB=470;
  el('rect',{x:LX-7,y:LT-12,width:14,height:LB-LT+24,rx:7,fill:'#1d1840',stroke:'rgba(255,244,230,.25)'},root);
  const lever=el('g',{},root);el('circle',{r:22,fill:'#ff9a6a',stroke:'#fff0d8','stroke-width':3},lever);el('text',{y:6,'text-anchor':'middle','font-size':13,'font-weight':600,fill:'#3a1f12'},lever).textContent='pull';
  let ly=LT;const putL=y=>{ly=y;lever.setAttribute('transform',`translate(${LX},${y.toFixed(1)})`)};putL(LT);
  interact(lever,{label:'Pull the lever to pour both rows into the bath',down:()=>({y0:ly}),move:(p,p0,k)=>{if(S.busy||S.poured)return;putL(clamp(k.y0+p.y-p0.y,LT,LB));if(ly>=LB-2)release()},
    up:()=>{if(ly<LB-2)tween(240,t=>putL(lerp(ly,LT,t)),null,ease.back)},tap:()=>{if(S.busy||S.poured)return;tween(260,t=>putL(lerp(LT,LB,t)),release,ease.in)}});
  navStone({glyph:'redo',label:'Try this bath again',onTap:()=>load()});
  const st=navStone({label:'Next bath',onTap:()=>{S.r=(S.r+1)%RID.length;load()}});

  const fracParts=(u,d)=>{const c=Math.round(u/(U/d)),w=Math.floor(c/d),r=c%d,p=[];if(w)p.push(['w',w]);if(r||!w)p.push(['f',r,d]);return p};
  function drawTicks(){
    jugs.forEach((row,i)=>row.forEach(J=>{J.ticks.innerHTML='';const d=den(i);for(let k=1;k<d;k++){const y=J.y+JH-k/d*JH;el('line',{x1:J.cx-JW/2+4,x2:J.cx-JW/2+16,y1:y,y2:y,stroke:'#fff4e6','stroke-width':2,opacity:.75},J.ticks)}}));
    target.innerHTML='';const y=bathY(tU());
    el('line',{x1:BX0-6,x2:BX1+6,y1:y,y2:y,stroke:'#fff0a0','stroke-width':3.5,'stroke-dasharray':'10 6'},target);
    const fl=el('g',{transform:`translate(${BX0-6},${y})`},target);el('path',{d:'M0,0 v-34 l26,8 l-26,8',fill:'#fff0a0',stroke:'#fff0a0','stroke-width':2,'stroke-linejoin':'round'},fl);
    const sg=el('g',{transform:`translate(${(BX0+BX1)/2-40},${BB-BH-44})`},target);el('rect',{x:-70,y:-24,width:140,height:46,rx:12,fill:'#fff4e6'},sg);
    el('text',{x:-38,y:6,'text-anchor':'middle','font-size':14,'font-weight':600,fill:'#3a2861'},sg).textContent='Fill to';
    const tt=R().t,e=svgExpr(sg,26,0,tt[0]?[['w',tt[0]],['f',tt[1],tt[2]]]:[['f',tt[1],tt[2]]],15,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2861'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2861'));
  }
  function drawLabels(){
    labL.innerHTML='';
    ROWS.forEach((row,i)=>{const d=den(i),c=S.cups[i],x=440,my=row.y+JH/2;
      const g=el('g',{class:'num'},labL);el('text',{x,y:my-30,'text-anchor':'middle','font-size':13,fill:'#d8c6e4'},g).textContent=`each cup is 1/${d}`;
      if(c){const parts=[['f',c,d]];const w=Math.floor(c/d);if(w){parts.push(['o','=']);parts.push(...fracParts(rowU(i),d))}svgExpr(labL,x,my+6,parts,16,'middle')}});
    exL.innerHTML='';
    if(S.poured){const A=R().a,B=R().b,l=lcm(A,B),ca=S.cups[0],cb=S.cups[1],tot=ca*l/A+cb*l/B,parts=[['f',ca,A],['o','+'],['f',cb,B]];
      if(A!==B)parts.push(['o','='],['f',ca*l/A,l],['o','+'],['f',cb*l/B,l]);parts.push(['o','='],['f',tot,l]);if(tot>=l){parts.push(['o','='],...fracParts(U*tot/l,l))}
      svgExpr(exL,262,582,parts,15,'middle')}
  }
  function pour(i,dir){
    if(S.busy||S.poured)return;const d=den(i),c=S.cups[i]+dir;
    if(c<0)return;if(c>2*d){SFX.wrong();shake(3);say('That row is full: two whole jugs.');return}
    S.cups[i]=c;
    if(dir>0){const j=Math.floor((c-1)/d),J=jugs[i][j];SFX.glug(1+(4-d)*.05);later(140,()=>drops(J.cx,J.y+JH-((c-1)%d+1)/d*JH,5))}else SFX.glug(.7);
    drawLabels();
  }
  function release(){
    if(S.busy||S.poured)return;S.busy=true;S.poured=true;SFX.thud();shake(4);SFX.whoosh();
    const total=rowU(0)+rowU(1),T=tU();streams.innerHTML='';
    const paths=[];jugs.forEach((row,i)=>row.forEach((J,j)=>{if(lvl(i,j)>0){const p=el('path',{d:`M${J.cx+20},${J.y+JH-6} Q${J.cx+80},${J.y+JH+40} ${(BX0+BX1)/2-20+j*30},${BB-30}`,fill:'none',stroke:'#8fdcff','stroke-width':10,'stroke-linecap':'round',opacity:.85},streams);paths.push(p)}}));
    const from=S.cups.slice();let gl=0;const gi=setInterval(()=>{SFX.glug(.8+Math.random()*.5);if(++gl>6)clearInterval(gi)},150);
    tween(1100,t=>{S.drain=t;S.bath=total*t},()=>{streams.innerHTML='';S.drain=1;
      const bx=(BX0+BX1)/2,by=bathY(total);
      if(total===T){SFX.fanfare();burst(bx,by,{n:26,spread:130});ring(bx,by,{r1:180,w:6});critter.mood('happy');critter.hop(22);floatText(critter.x,critter.y-70,'Perfect!');S.wins++;roundWon(S.r);if(S.wins>=3)unlock('wholes');st.ready(true);
        for(let k=0;k<10;k++)later(k*120,()=>{const b=el('circle',{cx:BX0+20+Math.random()*(BX1-BX0-40),cy:by,r:4+Math.random()*6,fill:'#fff',opacity:.8},FX);tween(900,(e,p)=>{b.setAttribute('cy',(by-50*e).toFixed(1));b.setAttribute('opacity',(.8*(1-p)).toFixed(2))},()=>b.remove())});
        say('Just right! The perfect bath.')}
      else if(total<T){SFX.wrong();critter.mood('dizzy');floatText(critter.x,critter.y-70,'Brrr!',{col:'#9fd0ff'});later(1600,()=>critter.mood('oh'));say('Too shallow! The critter is cold. Tap the redo stone and try again.')}
      else{SFX.wrong();shake(8);S.amp=10;for(let k=0;k<4;k++)later(k*150,()=>{drops(BX0+10,BB-BH,8);drops(BX1-10,BB-BH,8)});critter.mood('oh');floatText(critter.x,critter.y-70,'Too deep!',{col:'#ffb070'});say('Too much! The bath overflowed. Tap the redo stone and try again.')}
      S.busy=false;drawLabels()},ease.inOut);
  }
  S.drain=0;
  const lvl=(i,j)=>clamp(S.cups[i]/den(i)-j,0,1)*(S.poured?1-(S.drain||0):1);
  function load(){
    navDots(RID.length,S.r);S.cups=[0,0];S.poured=false;S.busy=false;S.bath=0;S.drain=0;S.amp=0;st.ready(false);streams.innerHTML='';putL(LT);critter.mood('');
    drawTicks();drawLabels();say('Fill the bath to the golden line. Pour cups into the two rows, then pull the lever. One pour only!');
  }
  loop(dt=>{const t=performance.now()/1000;
    jugs.forEach((row,i)=>row.forEach((J,j)=>{const L=lvl(i,j);S.lvl[i][j]+=(L-S.lvl[i][j])*Math.min(1,dt*8);const v=S.lvl[i][j],y=J.y+JH-v*JH,x0=J.cx-JW/2+4,x1=J.cx+JW/2-4;
      J.body.setAttribute('y',(y+3).toFixed(1));J.body.setAttribute('height',Math.max(0,J.y+JH-y).toFixed(1));
      if(v<.01){J.surf.setAttribute('d','');return}let d=`M${x0},${y+5}`;for(let x=x0;x<=x1+.1;x+=8)d+=` L${x.toFixed(1)},${(y+Math.sin(x*.12+t*3+i+j)*1.6).toFixed(1)}`;J.surf.setAttribute('d',d+` L${x1},${y+6}Z`)}));
    S.amp*=Math.pow(.3,dt);const by=bathY(S.bath),a=S.amp+1.5;bBody.setAttribute('y',(by+3).toFixed(1));bBody.setAttribute('height',Math.max(0,BB-by).toFixed(1));
    if(S.bath<1){bSurf.setAttribute('d','');return}let d=`M${BX0},${by+6}`;for(let x=BX0;x<=BX1+.1;x+=8)d+=` L${x},${(by+Math.sin(x*.05+t*2.4)*a+Math.sin(x*.11-t*1.7)*a*.5).toFixed(1)}`;bSurf.setAttribute('d',d+` L${BX1},${by+8}Z`)});
  S.r=resumeAt(RID.length);load();
}};
