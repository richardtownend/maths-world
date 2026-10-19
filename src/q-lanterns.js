
/* ================= World: Lanterns (tenths, hundredths, decimals and percentages) ================= */
W.lanterns={scene:'festival',
notes:`<p>Fractions become decimals and percentages. Each lantern is a panel of 100 little lights (10 columns of 10). A whole column is one tenth; a single light is one hundredth. Percent just means "out of 100", so every light is 1%.</p>
<p>She sets the lights with a number written like a decimal: 0 . [tenths] [hundredths]. The gold tenths digit lights whole gold columns; the silver hundredths digit lights single silver lights. So 0.45 is 4 gold columns and 5 silver lights: 45 lights out of 100.</p>
<p>Each order comes in one form (a fraction, a percentage or a decimal) and she has to light exactly that much, then pull the rope to launch the lantern. Right, and it floats away and writes out every form: 3/4 = 75/100 = 0.75 = 75%. Wrong, and it fizzles and says what she actually made.</p>
<p>Rounds: 3/10, 45/100, 1/2, 2/5 (fifths have to become tenths first: 2/5 = 4/10), 3/4, 60%, and 0.08, which catches the classic mix-up with 0.8 (8 hundredths is only 8 single lights).</p>`,
mount(root){
  const R=[{f:[3,10],v:30},{f:[45,100],v:45},{f:[1,2],v:50},{f:[2,5],v:40},{f:[3,4],v:75},{pct:60,v:60},{dec:'0.08',v:8}];
  const GX=190,GY=96,CS=22,GOLD='#ffc04d',SILV='#bfe6ff',OFF='#3a2f55';
  const S={r:0,t:0,h:0,busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r],val=()=>S.t*10+S.h;

  /* the lantern panel */
  const shL=el('g',{},root),panelG=el('g',{},root),frameL=el('g',{},panelG),gridL=el('g',{},panelG),glowL=el('g',{},panelG);
  el('ellipse',{cx:300,cy:GY+CS*10+52,rx:150,ry:14,fill:'#0d0a24',opacity:.3},shL);
  function drawFrame(){frameL.innerHTML='';
    el('path',{d:`M${GX-24},${GY-6} Q300,${GY-40} ${GX+CS*10+24},${GY-6} L${GX+CS*10+24},${GY+CS*10+6} Q300,${GY+CS*10+34} ${GX-24},${GY+CS*10+6}Z`,fill:'#c9413a',opacity:.9,stroke:'#ffb86a','stroke-width':3},frameL);
    el('rect',{x:GX-6,y:GY-6,width:CS*10+12,height:CS*10+12,rx:6,fill:'#1d1428'},frameL);
    el('rect',{x:300-30,y:GY-48,width:60,height:10,rx:4,fill:'#7a3a2a'},frameL);el('rect',{x:300-30,y:GY+CS*10+30,width:60,height:10,rx:4,fill:'#7a3a2a'},frameL);
    el('line',{x1:300,y1:GY+CS*10+40,x2:300,y2:GY+CS*10+60,stroke:'#ffb86a','stroke-width':2},frameL);el('circle',{cx:300,cy:GY+CS*10+64,r:5,fill:'#ffb86a'},frameL)}
  let cells=[];
  function drawGrid(){gridL.innerHTML='';cells=[];for(let c=0;c<10;c++)for(let r=0;r<10;r++){const x=GX+c*CS+CS/2,y=GY+r*CS+CS/2,g=el('g',{transform:`translate(${x},${y})`},gridL);
      const halo=el('circle',{r:9,fill:GOLD,opacity:0},g),bulb=el('circle',{r:6.5,fill:OFF},g);cells.push({c,r,halo,bulb,on:false,kind:null})}
    for(let c=1;c<10;c++)el('line',{x1:GX+c*CS,x2:GX+c*CS,y1:GY,y2:GY+CS*10,stroke:'#2a2140','stroke-width':1},gridL);paint(false)}
  function paint(anim=true){const v=val();cells.forEach((cl,i)=>{const idx=cl.c*10+cl.r,on=idx<v,kind=on?(cl.c<S.t?'t':'h'):null;
      if(cl.on===on&&cl.kind===kind)return;cl.on=on;cl.kind=kind;const col=kind==='t'?GOLD:SILV;
      cl.bulb.setAttribute('fill',on?col:OFF);cl.halo.setAttribute('fill',col);cl.halo.setAttribute('opacity',on?.35:0);
      if(anim&&on){const b=cl.bulb;tween(220,(t,p)=>b.setAttribute('r',(6.5*(1+.5*Math.sin(p*Math.PI))).toFixed(2)),null,ease.out)}});
    cntL.innerHTML='';el('text',{x:300,y:GY+CS*10+84,'text-anchor':'middle','font-size':15,fill:'#fff4e6'},el('g',{class:'num'},cntL)).textContent=`${v} light${v===1?'':'s'} out of 100`}
  const cntL=el('g',{},root);

  /* the decimal: 0 . [tenths] [hundredths] */
  const decL=el('g',{},root);
  function numBox(parent,{x,y,w,h,fs,min,max,val,label,side,col,onChange}){
    const g=el('g',{},parent),bx=el('g',{transform:`translate(${x},${y})`},g);
    el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:10,fill:'#fff',stroke:col,'stroke-width':4},bx);
    const t=el('text',{y:fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#2a2150'},bx);
    let v=val;const show=()=>{t.textContent=v};const set=nv=>{nv=clamp(nv,min,max);if(nv===v){SFX.tick(0);return}v=nv;show();SFX.tick(v);osc('triangle',300+v*40,.05,.04,{wet:.15});onChange(v)};
    interact(bx,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/24),min,max);if(nv!==v){v=nv;show();SFX.tick(v);onChange(v)}},tap:()=>{if(S.busy||S.won)return;set(v+1>max?min:v+1)}});
    [[-1,'up',1],[1,'down',-1]].forEach(([s,nm,dv])=>{const a=el('g',{transform:`translate(${x},${y+s*(h/2+20)})`},g);el('circle',{r:15,fill:'#2a2150',stroke:col,'stroke-width':1.5},a);
      el('path',{d:s<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:col,'stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${label} ${nm}`,tap:()=>{if(S.busy||S.won)return;set(v+dv)}})});
    show();return{get:()=>v,set:nv=>{v=nv;show()}}}
  let NT,NH;
  function drawDec(){decL.innerHTML='';const y=GY+CS*10+164,ink='#fff4e6';
    el('rect',{x:196,y:y-72,width:208,height:144,rx:18,fill:'#2a2150',opacity:.85,stroke:'#ffb86a','stroke-width':2},decL);
    el('text',{x:228,y:y+16,'text-anchor':'middle','font-size':44,'font-weight':700,fill:ink},decL).textContent='0';
    el('circle',{cx:252,cy:y+12,r:5,fill:ink},decL);
    NT=numBox(decL,{x:284,y,w:52,h:66,fs:42,min:0,max:9,val:S.t,label:'Tenths',side:'left',col:GOLD,onChange:v=>{S.t=v;paint();upd()}});
    NH=numBox(decL,{x:346,y,w:52,h:66,fs:42,min:0,max:9,val:S.h,label:'Hundredths',side:'right',col:SILV,onChange:v=>{S.h=v;paint();upd()}});
    el('text',{x:284,y:y+84,'text-anchor':'middle','font-size':12,fill:GOLD},decL).textContent='tenths';el('text',{x:346,y:y+84,'text-anchor':'middle','font-size':11,fill:SILV},decL).textContent='hundredths'}

  /* the launch rope */
  const ropeG=el('g',{},root),HX=478,HY0=GY+150,HMAX=GY+240;
  const rope=el('line',{x1:HX,y1:GY-30,x2:HX,y2:HY0,stroke:'#e8d2a8','stroke-width':3},ropeG),hdl=el('g',{},ropeG);el('circle',{r:30,fill:'transparent'},hdl);
  el('path',{d:'M-12,-8 h24 l-4,24 h-16Z',fill:'#c9413a',stroke:'#ffb86a','stroke-width':2},hdl);el('text',{y:44,'text-anchor':'middle','font-size':13,fill:'#fff4e6'},hdl).textContent='launch';
  let hy=HY0;const putH=y=>{hy=y;hdl.setAttribute('transform',`translate(${HX},${y.toFixed(1)})`);rope.setAttribute('y2',y-8)};putH(HY0);
  interact(hdl,{label:'Pull the rope to launch the lantern',down:()=>({y0:hy}),move:(p,p0,c)=>{if(S.busy||S.won||c.f)return;putH(clamp(c.y0+p.y-p0.y,HY0,HMAX));if(hy>=HMAX-2){c.f=true;launch()}},
    up:(p,p0,c)=>{if(!c.f){const y0=hy;tween(220,t=>putH(lerp(y0,HY0,t)),null,ease.back)}},tap:()=>{if(S.busy||S.won)return;tween(240,t=>putH(lerp(HY0,HMAX,t)),launch,ease.in)}});

  function launch(){if(S.busy||S.won)return;S.busy=true;const y0=hy;tween(260,t=>putH(lerp(y0,HY0,t)),null,ease.back);const r=Rr(),v=val();SFX.whoosh();
    if(v===r.v){/* up it goes */S.won=true;S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=3)unlock('decimals');SFX.fanfare();
      tween(1800,(t,p)=>{panelG.setAttribute('transform',`translate(${(300+Math.sin(p*5)*8).toFixed(1)},${(206-p*p*170).toFixed(1)}) scale(${(1-.5*p).toFixed(3)}) translate(-300,-206)`);panelG.setAttribute('opacity',(p<.6?1:1-(p-.6)/.4).toFixed(2))},null,ease.inOut);
      for(let k=0;k<14;k++)later(k*80,()=>{const s=el('circle',{cx:280+Math.random()*40,cy:GY+CS*10+40,r:2.5,fill:'#ffd36a'},FX);tween(900,(t,p)=>{s.setAttribute('cy',(GY+CS*10+40+p*80).toFixed(1));s.setAttribute('opacity',(1-p).toFixed(2))},()=>s.remove(),ease.lin)});
      later(900,()=>{ring(300,GY,{r1:180,w:5,col:'#ffd36a'});burst(300,GY+40,{n:24,spread:170,cols:[GOLD,SILV,'#ff9a6a']});reveal();st.ready(true);S.busy=false})}
    else{SFX.wrong();tween(900,(t,p)=>panelG.setAttribute('transform',`translate(0,${(-Math.sin(p*Math.PI)*40).toFixed(1)})`),()=>panelG.removeAttribute('transform'),ease.out);
      later(500,()=>{shake(3);cells.forEach(cl=>{if(cl.on)cl.bulb.setAttribute('opacity',.4)});SFX.thud();later(600,()=>cells.forEach(cl=>cl.bulb.setAttribute('opacity',1)))});
      const d=`0.${S.t}${S.h}`,want=r.v;let msg=`It fizzled! You lit ${v} out of 100 (${d}). `;
      if(r.dec&&v===want*10)msg+=`${r.dec} is only ${want} hundredths: ${want} single silver lights, not ${want} gold columns.`;
      else msg+=v<want?'Not enough light.':'Too much light.';
      later(400,()=>{say(msg);S.busy=false})}}
  function reveal(){const r=Rr(),v=r.v,dec=v%10?`0.${Math.floor(v/10)}${v%10}`:`0.${v/10}`,parts=[];
    if(r.f){parts.push(['f',r.f[0],r.f[1]],['o','=']);if(r.f[1]!==100)parts.push(['f',v,100],['o','='])}else parts.push(['f',v,100],['o','=']);
    parts.push(['w',dec],['o','='],['w',`${v}%`]);
    const w=exprWidth(parts,20)+30;el('rect',{x:300-w/2,y:GY+CS*10+8,width:w,height:56,rx:14,fill:'#2a2150',opacity:.92,stroke:GOLD,'stroke-width':2},exL);svgExpr(exL,300,GY+CS*10+36,parts,20,'middle');
    say(`Up it goes! ${r.f?`${r.f[0]}/${r.f[1]}`:r.pct?`${r.pct}%`:r.dec} is ${v} out of 100: ${dec}, or ${v}%.`)}
  const exL=el('g',{},root);

  /* the order */
  const signL=el('g',{},root);
  function drawSign(){signL.innerHTML='';const r=Rr(),g=el('g',{},signL);
    el('rect',{x:220,y:4,width:160,height:62,rx:14,fill:'#fff4e6',stroke:'#c9413a','stroke-width':3},g);
    const lg=el('g',{transform:'translate(246,35)'},g);el('ellipse',{rx:12,ry:15,fill:'#c9413a'},lg);el('rect',{x:-6,y:-19,width:12,height:4,fill:'#7a3a2a'},lg);el('rect',{x:-6,y:15,width:12,height:4,fill:'#7a3a2a'},lg);el('ellipse',{rx:6,ry:10,fill:'#ffd36a',opacity:.8},lg);
    if(r.f){const e=svgFrac(g,315,36,r.f[0],r.f[1],24);e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2418;font-weight:700'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'))}
    else el('text',{x:315,y:46,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#3a2418'},g).textContent=r.pct?`${r.pct}%`:r.dec}

  function upd(){if(S.busy||S.won)return;const r=Rr(),form=r.f?`${r.f[0]}/${r.f[1]}`:r.pct?`${r.pct}%`:r.dec;
    say(val()===0?`This lantern needs ${form} of its lights. Set the gold tenths and silver hundredths, then pull the rope.`:`${form} of the lights, then pull the rope to launch.`)}
  navStone({glyph:'redo',label:'Start this lantern again',onTap:()=>load()});
  const st=navStone({label:'Next lantern',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';exL.innerHTML='';panelG.removeAttribute('transform');panelG.setAttribute('opacity',1);Object.assign(S,{t:0,h:0,busy:false,won:false});st.ready(false);putH(HY0);
    navDots(R.length,S.r);drawSign();drawFrame();drawGrid();drawDec();upd()}
  S.r=resumeAt(R.length);load();
}};
