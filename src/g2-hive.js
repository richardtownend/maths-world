
/* ================= World: Hive (top-heavy fractions and mixed numbers) ================= */
W.hive={scene:'meadow',
notes:`<p>One idea only: a top-heavy fraction and a mixed number are the same amount, written two ways. 17/12 means seventeen twelfths. Twelve twelfths fill one whole, so seventeen is one whole with five twelfths over: 1 5/12. And back again: 1 5/12 is 12 + 5 = 17 twelfths.</p>
<p>Each honeycomb is one whole, with a cell for every piece: two cells for halves, twelve for twelfths. The key under the combs says what one cell is worth. Each bee fills one cell, and the number by the hive counts them as a fraction (1/12, 2/12, 3/12…). A full comb seals with wax and gets a "1".</p>
<p><b>Look first, then predict.</b> In round one the bees fly straight away and she just reads the picture: 3 halves is 1 whole comb and 1 half over. In round two the honey is already there (1 3/4) and she counts how many quarters it is. After that the combs start empty and she has to work it out before pressing Go, then the bees show whether she was right.</p>
<p>Rounds: 3/2, 1 3/4, 7/3, 2 1/6, 17/12, 2 3/8. A win writes both forms: 17/12 = 1 5/12, and 12 + 5 = 17.</p>`,
mount(root){
  const R=[{t:'im',n:3,d:2,show:1},{t:'mi',n:7,d:4,show:1},{t:'im',n:7,d:3},{t:'mi',n:13,d:6},{t:'im',n:17,d:12},{t:'mi',n:19,d:8}];
  const NM={2:'halves',3:'thirds',4:'quarters',6:'sixths',8:'eighths',12:'twelfths'};
  const S={r:0,busy:false,won:false,wins:new Set()};
  const Rr=()=>R[S.r];
  const HX=74,HY=136,FR=3;

  /* the tree and the hive */
  const tree=el('g',{},root);
  el('path',{d:'M-60,620 L-60,40 Q10,30 30,60 L60,96 Q40,98 20,90 L10,620Z',fill:'#3a2a3e'},tree);
  el('path',{d:'M20,74 Q90,60 150,74',stroke:'#3a2a3e','stroke-width':12,fill:'none','stroke-linecap':'round'},tree);
  const hive=el('g',{transform:`translate(${HX},${HY})`},root);
  el('line',{x1:0,y1:-66,x2:0,y2:-44,stroke:'#5a3f2c','stroke-width':3},hive);
  [[-30,-40,30],[-38,-14,38],[-36,12,36],[-26,36,26]].forEach(([x,y,w],k)=>el('rect',{x:-w,y,width:w*2,height:26,rx:13,fill:k%2?'#e0a43c':'#f2b950',stroke:'#b07a2a','stroke-width':2},hive));
  el('ellipse',{cx:0,cy:30,rx:9,ry:7,fill:'#2a1a12'},hive);
  const cntL=el('g',{},root);
  function count(n){cntL.innerHTML='';if(n==null)return;const d=Rr().d,g=el('g',{transform:`translate(${HX},${HY+104})`},cntL);el('rect',{x:-28,y:-30,width:56,height:58,rx:12,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':2.5},g);
    const e=svgFrac(g,0,0,n,d,20);e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2418'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'))}
  interact(hive,{label:'The hive',tap:()=>{SFX.buzz(.5);for(let k=0;k<3;k++)later(k*90,()=>flyLoop())}});
  function bee(parent){const g=el('g',{},parent);el('ellipse',{cx:-1,cy:-6,rx:5,ry:7,fill:'#e8f4ff',opacity:.75},g);el('ellipse',{cx:4,cy:-6,rx:4,ry:6,fill:'#e8f4ff',opacity:.6},g);
    el('ellipse',{rx:8,ry:6,fill:'#ffd34d'},g);[-2,3].forEach(x=>el('rect',{x,y:-6,width:2.5,height:12,fill:'#2a1a12'},g));el('circle',{cx:7,cy:-1,r:1.3,fill:'#2a1a12'},g);return g}
  function flyLoop(){const b=bee(FX);let a=Math.random()*6;tween(900,(t,p)=>{const x=HX+Math.cos(a+p*6)*40*p,y=HY+30+Math.sin(a+p*6)*24*p-p*20;b.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);b.setAttribute('opacity',(1-p*p).toFixed(2))},()=>b.remove(),ease.lin)}

  /* the bear who wants the honey */
  const bear=creature(root,{x:528,y:442,r:40,i:2,label:'Honey bear'});
  [-1,1].forEach(s=>el('circle',{cx:s*26,cy:-34,r:11,fill:bear.col},bear.inner));
  const jarL=el('g',{},root);

  /* honeycombs: each one is a whole */
  const frL=el('g',{},root),tgtL=el('g',{},root),keyL=el('g',{},root),exL=el('g',{},root);
  const GRID={2:[2,1],3:[3,1],4:[2,2],6:[3,2],8:[4,2],12:[4,3]};
  let cells=[],combs=[];
  const hexD=(x,y,r)=>{let d='';for(let k=0;k<6;k++){const a=Math.PI/180*(60*k-90);d+=(k?'L':'M')+(x+r*Math.cos(a)).toFixed(1)+','+(y+r*Math.sin(a)).toFixed(1)}return d+'Z'};
  function drawCombs(){frL.innerHTML='';tgtL.innerHTML='';keyL.innerHTML='';cells=[];combs=[];const d=Rr().d,[c,rr]=GRID[d];
    const fw=150,fh=132,r=Math.min(20,(fw-18)/(c*1.75+.9),(fh-18)/(rr*1.55+.6)),dx=r*1.75,dy=r*1.52;
    for(let f=0;f<FR;f++){const fx=194+f*160,fy=214;
      const g=el('g',{},frL);el('rect',{x:fx-fw/2,y:fy-fh/2,width:fw,height:fh,rx:12,fill:'#5a3f2c',stroke:'#8a6448','stroke-width':4},g);
      el('rect',{x:fx-fw/2+6,y:fy-fh/2+6,width:fw-12,height:fh-12,rx:8,fill:'#3a2618'},g);
      const seal=el('rect',{x:fx-fw/2+6,y:fy-fh/2+6,width:fw-12,height:fh-12,rx:8,fill:'#fff3c4',opacity:0},g);
      const badge=el('g',{transform:`translate(${fx+fw/2-6},${fy-fh/2+6})`,opacity:0},g);el('circle',{r:16,fill:'#ffd34d',stroke:'#fff3c4','stroke-width':2.5},badge);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#3a2418'},badge).textContent='1';
      combs.push({seal,badge});
      const w=(c-1)*dx+(rr>1?dx/2:0),h=(rr-1)*dy;
      for(let k=0;k<d;k++){const row=Math.floor(k/c),col=k%c,x=fx-w/2+col*dx+(row%2?dx/2:0),y=fy-h/2+row*dy;
        const cell=el('path',{d:hexD(x,y,r*.92),fill:'#4a3222',stroke:'#c98a3a','stroke-width':2},g);
        cells.push({f,k,x,y,r,cell})}}
    /* the key: 1 comb = 1 whole, 1 cell = 1/d */
    const ky=312,kg=el('g',{},keyL);
    el('rect',{x:186,y:ky-22,width:228,height:46,rx:12,fill:'rgba(26,18,40,.55)'},kg);
    el('rect',{x:198,y:ky-12,width:26,height:22,rx:5,fill:'#5a3f2c',stroke:'#8a6448','stroke-width':2},kg);
    el('text',{x:232,y:ky+5,'font-size':15,fill:'#fff4e6'},kg).textContent='= 1 whole';
    el('path',{d:hexD(330,ky,10),fill:'#4a3222',stroke:'#c98a3a','stroke-width':2},kg);
    el('text',{x:346,y:ky+5,'font-size':15,fill:'#fff4e6'},kg).textContent='=';
    const e=svgFrac(kg,376,ky+1,1,d,15);e.setAttribute('class','')}
  function fill(i,on){const c=cells[i];if(!c)return;c.cell.setAttribute('fill',on?'url(#gHoney)':'#4a3222');c.cell.setAttribute('stroke',on?'#ffe08a':'#c98a3a')}
  function sealComb(f,anim){const cb=combs[f];if(!cb)return;if(anim){tween(300,(t,p)=>cb.seal.setAttribute('opacity',(.18*p).toFixed(2)),null,ease.out);cb.badge.setAttribute('opacity',1);popIn(cb.badge,.3)}else{cb.seal.setAttribute('opacity',.18);cb.badge.setAttribute('opacity',1)}}
  function clearCombs(){cells.forEach((_,i)=>fill(i,false));combs.forEach(c=>{c.seal.setAttribute('opacity',0);c.badge.setAttribute('opacity',0)})}
  function drawTarget(){tgtL.innerHTML='';const r=Rr();if(r.t!=='mi')return;for(let i=0;i<r.n;i++){const c=cells[i];el('path',{d:hexD(c.x,c.y,c.r*1.04),fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-dasharray':'4 3'},tgtL)}}

  /* rolling number drums */
  function drum(parent,{x,y,min,max,val,label,onChange}){
    const g=el('g',{transform:`translate(${x},${y})`},parent);
    el('rect',{x:-30,y:-62,width:60,height:124,rx:16,fill:'#2a2150',stroke:'rgba(255,244,230,.25)','stroke-width':2},g);
    el('rect',{x:-26,y:-24,width:52,height:48,rx:10,fill:'#fff4e6'},g);
    const up=el('text',{y:-34,'text-anchor':'middle','font-size':17,fill:'#8f7fb8'},g),mid=el('text',{y:12,'text-anchor':'middle','font-size':32,'font-weight':700,fill:'#3a2861'},g),dn=el('text',{y:52,'text-anchor':'middle','font-size':17,fill:'#8f7fb8'},g);
    el('path',{d:'M-8,-46 l8,-8 l8,8',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round',opacity:.7},g);el('path',{d:'M-8,46 l8,8 l8,-8',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round',opacity:.7},g);
    let v=val;const show=()=>{mid.textContent=v;up.textContent=v<max?v+1:'';dn.textContent=v>min?v-1:''};
    const set=(nv,snd=true)=>{nv=clamp(nv,min,max);if(nv===v)return;v=nv;show();if(snd){SFX.tick(v);osc('triangle',300+v*25,.05,.04,{wet:.15})}onChange&&onChange(v)};
    interact(g,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;set(c.v0+Math.round((p0.y-p.y)/26))},
      tap:p=>{if(S.busy||S.won)return;if(!p){set(v+1>max?min:v+1);return}const ly=p.y-y;set(v+(ly<0?1:-1))}});
    show();return{g,get:()=>v,set:nv=>{v=clamp(nv,min,max);show()}}}

  /* sign, answer area, Go */
  const signL=el('g',{},root),ansL=el('g',{},root);
  function signExpr(g,x,y,parts,sz){const e=svgExpr(g,x,y,parts,sz,'middle');e.setAttribute('class','');e.querySelectorAll('text').forEach(t=>t.setAttribute('style','fill:#3a2418'));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'));return e}
  function drawSign(){signL.innerHTML='';const r=Rr(),w0=Math.floor(r.n/r.d),p0=r.n%r.d;
    const parts=r.t==='im'?[['f',r.n,r.d],['o','='],['t','?']]:[['w',w0],['f',p0,r.d],['o','='],['t','?']];
    const w=exprWidth(parts,22)+48;el('rect',{x:300-w/2,y:10,width:w,height:66,rx:14,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},signL);
    signExpr(signL,300,43,parts,22)}
  let D=[];
  const lab=(x,y,t)=>{el('text',{x,y,'text-anchor':'middle','font-size':13,fill:'#d8c6e4'},ansL).textContent=t};
  /* a number you can roll, drawn as written maths: a box for the number, little arrows to the side */
  function numBox(parent,{x,y,w,h,fs,min,max,val,label,side,onChange}){
    const g=el('g',{},parent),bx=el('g',{transform:`translate(${x},${y})`},g);
    el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:9,fill:'#fff',stroke:'#c98a3a','stroke-width':2.5},bx);
    const t=el('text',{y:fs*.36,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'#3a2418'},bx);
    let v=val;const show=()=>{t.textContent=v};
    const set=nv=>{nv=clamp(nv,min,max);if(nv===v){SFX.tick(0);return}v=nv;show();SFX.tick(v);osc('triangle',300+v*25,.05,.04,{wet:.15});popT();onChange&&onChange(v)};
    const popT=()=>{tween(160,(q,p)=>t.setAttribute('transform',`scale(${(1+.18*Math.sin(p*Math.PI)).toFixed(3)})`),null,ease.out)};
    interact(bx,{label,down:()=>({v0:v}),move:(p,p0,c)=>{if(S.busy||S.won)return;const nv=clamp(c.v0+Math.round((p0.y-p.y)/24),min,max);if(nv!==v){v=nv;show();SFX.tick(v);onChange&&onChange(v)}},
      tap:()=>{if(S.busy||S.won)return;set(v+1>max?min:v+1)}});
    const ax=x+(side==='left'?-1:1)*(w/2+20);
    [[-1,'up',1],[1,'down',-1]].forEach(([s,nm,dv])=>{const a=el('g',{transform:`translate(${ax},${y+s*15})`},g);el('circle',{r:14,fill:'#2a2150',stroke:'rgba(255,240,160,.5)','stroke-width':1.5},a);
      el('path',{d:s<0?'M-6,3 l6,-6 l6,6':'M-6,-3 l6,6 l6,-6',fill:'none',stroke:'#fff0a0','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'},a);
      interact(a,{label:`${label} ${nm}`,tap:()=>{if(S.busy||S.won)return;set(v+dv)}})});
    show();return{g,get:()=>v,set:nv=>{v=clamp(nv,min,max);show()}}}
  function drawAnswer(){ansL.innerHTML='';D=[];const r=Rr(),y=486,ink='#3a2418';
    const card=(x0,x1)=>el('rect',{x:x0,y:y-72,width:x1-x0,height:144,rx:16,fill:'#ffe9a8',stroke:'#c98a3a','stroke-width':3},ansL);
    const fracUnder=(cx,bw)=>{el('line',{x1:cx-bw/2,x2:cx+bw/2,y1:y,y2:y,stroke:ink,'stroke-width':3.5,'stroke-linecap':'round'},ansL);el('text',{x:cx,y:y+42,'text-anchor':'middle','font-size':30,'font-weight':700,fill:ink},ansL).textContent=r.d};
    if(r.t==='im'){
      card(176,388);
      D.push(numBox(ansL,{x:240,y,w:56,h:76,fs:46,min:0,max:3,val:0,label:'Whole combs',side:'left',onChange:upd}));
      D.push(numBox(ansL,{x:316,y:y-28,w:48,h:44,fs:30,min:0,max:r.d-1,val:0,label:`${NM[r.d]} over`,side:'right',onChange:upd}));
      fracUnder(316,52);
    }else{
      card(244,384);
      D.push(numBox(ansL,{x:300,y:y-28,w:58,h:44,fs:30,min:0,max:FR*r.d+2,val:0,label:`How many ${NM[r.d]}`,side:'right',onChange:upd}));
      fracUnder(300,58);
    }
    const go=el('g',{transform:`translate(448,${y})`},ansL);el('circle',{r:32,fill:'#e0a43c',stroke:'#fff0a0','stroke-width':3},go);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#3a2418'},go).textContent='Go';
    interact(go,{label:'Go: check with the bees',tap:run})}

  /* bees fly out and fill cells, one bee per cell */
  function fly(N,done){const r=Rr();clearCombs();SFX.buzz(1);let landed=0;count(0);const stray=[];
    for(let i=0;i<N;i++)later(i*Math.max(80,280-N*8),()=>{const b=bee(FX),c=cells[i],tx=c?c.x:300+(Math.random()-.5)*300,ty=c?c.y:300+Math.random()*40,wob=Math.random()*20-10;
      tween(420,(t,p)=>b.setAttribute('transform',`translate(${lerp(HX,tx,p).toFixed(1)},${(lerp(HY+30,ty,p)-Math.sin(p*Math.PI)*(40+wob)).toFixed(1)})`),()=>{landed++;count(landed);
        if(c){b.remove();fill(i,true);SFX.plink(c.k%10);if(c.k===r.d-1){sealComb(c.f,true);SFX.chime();ring(c.x,c.y,{r1:60,w:4,dur:500})}}
        else{stray.push(b);SFX.wrong();shake(3)}
        if(landed===N)later(350,()=>done(stray))},ease.inOut)})}
  function run(){if(S.busy||S.won)return;const r=Rr();
    if(r.t==='im'){if(r.show){S.busy=true;checkSweep(()=>judge(r.n,[]));return}S.busy=true;fly(r.n,s=>judge(r.n,s));return}
    const N=D[0].get();if(!N){SFX.wrong();say(`Roll the drum: how many ${NM[r.d]}?`);return}
    S.busy=true;exL.innerHTML='';fly(N,s=>judge(N,s))}
  function checkSweep(done){const n=Rr().n;for(let i=0;i<n;i++)later(i*120,()=>{const c=cells[i];ring(c.x,c.y,{r1:24,w:2,dur:300});SFX.plink(i%10)});later(n*120+250,done)}
  function judge(N,stray){const r=Rr(),full=Math.floor(N/r.d),left=N%r.d;let ok;
    if(r.t==='im')ok=D[0].get()===full&&D[1].get()===left;else ok=N===r.n;
    stray.forEach(b=>{let a=Math.random()*6;const bx=+b.getAttribute('transform').match(/translate\(([-\d.]+)/)[1];tween(1400,(t,p)=>{b.setAttribute('transform',`translate(${(bx+Math.cos(a+p*12)*30).toFixed(1)},${(300+Math.sin(a+p*12)*20-p*40).toFixed(1)})`);b.setAttribute('opacity',(1-p).toFixed(2))},()=>b.remove(),ease.lin)});
    if(ok){S.won=true;S.wins.add(S.r);roundWon(S.r);if(S.wins.size>=4)unlock('mixed');st.ready(true);SFX.fanfare();bear.mood('happy');bear.hop(24);
      burst(300,196,{n:22,spread:200,cols:['#ffd34d','#fff3c4','#e0a43c','#fff0a0']});floatText(520,330,'Sweet!');
      const j=el('g',{transform:'translate(548,372)'},jarL);el('path',{d:'M-16,-24 h32 v6 q8,4 8,14 v24 q0,10 -10,10 h-28 q-10,0 -10,-10 v-24 q0,-10 8,-14Z',fill:'url(#gHoney)',stroke:'#fff3c4','stroke-width':2},j);el('rect',{x:-18,y:-30,width:36,height:8,rx:3,fill:'#c98a3a'},j);popIn(j,.3);
      const w=Math.floor(r.n/r.d),p=r.n%r.d,parts=[['f',r.n,r.d],['o','='],['w',w]];if(p)parts.push(['f',p,r.d]);
      keyL.style.display='none';svgExpr(exL,300,368,parts,18,'middle');
      el('text',{x:300,y:408,'text-anchor':'middle','font-size':14,fill:'#d8c6e4'},el('g',{class:'num'},exL)).textContent=w?`${w} whole comb${w>1?'s':''} is ${w*r.d} ${NM[r.d]}, and ${p} more: ${w*r.d} + ${p} = ${r.n}`:`${r.n} ${NM[r.d]}`;
      say(r.t==='im'?`Yes! ${r.n} ${NM[r.d]} is ${w} whole${w>1?'s':''} and ${p} over.`:`Yes! ${w} ${p}/${r.d} is ${r.n} ${NM[r.d]}.`)}
    else{SFX.wrong();bear.mood('oh');later(1400,()=>bear.mood(''));
      if(r.t==='im')say(`Not quite. Look at the combs: ${full} whole and ${left} ${NM[r.d]} over. Roll the drums again.`);
      else if(N<r.n)say(`Not enough: ${N} ${NM[r.d]} left some gold cells empty. Try again.`);
      else{say(`Too many: ${N} ${NM[r.d]} went past the gold cells. Try again.`);for(let i=r.n;i<Math.min(N,cells.length);i++)later((i-r.n)*60,()=>drops(cells[i].x,cells[i].y,4))}
      later(400,()=>{S.busy=false})}
  }
  function upd(){if(S.busy||S.won)return;const r=Rr(),n=NM[r.d];
    if(r.t==='im')say(r.show?`The bees filled ${r.n} ${n}. How many whole combs is that, and how many ${n} over?`:`${r.n} ${n} of honey are coming. How many whole combs will they fill, and how many ${n} over?`);
    else say(r.show?`This honey is ${Math.floor(r.n/r.d)} ${r.n%r.d}/${r.d} combs. How many ${n} is that? Count the cells.`:`Fill the gold cells. How many ${n} of honey is that? Roll the drum, then press Go.`)}
  navStone({glyph:'redo',label:'Start this round again',onTap:()=>load()});
  const st=navStone({label:'Next round',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  function load(){EPOCH++;FX.innerHTML='';exL.innerHTML='';jarL.innerHTML='';count(null);S.busy=false;S.won=false;st.ready(false);bear.mood('');
    navDots(R.length,S.r);drawSign();drawCombs();keyL.style.display='';drawTarget();drawAnswer();const r=Rr();
    if(r.show&&r.t==='im'){S.busy=true;say(`Watch: each bee brings one ${NM[r.d].replace(/ves$/,'f').replace(/s$/,'')} of honey.`);later(700,()=>fly(r.n,()=>{S.busy=false;upd()}))}
    else if(r.show){for(let i=0;i<r.n;i++)fill(i,true);for(let f=0;f<Math.floor(r.n/r.d);f++)sealComb(f,false);upd()}
    else upd()}
  S.r=resumeAt(R.length);load();
}};
