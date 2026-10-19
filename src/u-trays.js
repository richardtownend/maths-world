/* ---------- 3. Trays: times as rows, then the times table itself ---------- */
W.trays={scene:'patch',
notes:`<p>Times tables, two ways. First three rounds: the seed tray. 3 × 5 means 3 rows of 5: she drags the gold corner of the planting frame to that shape; the seeds pop in row by row counting in fives and bloom, then the tray turns round (5 rows of 3, the same flowers).</p>
<p>Last three rounds: the times table itself. Each cell already holds its answer. She drags a rectangle out from the corner, 6 rows down and 3 across, and the corner cell is 6 × 3. When it's right, the rectangle turned round (3 down, 6 across) lights up on the other side of the diagonal, landing on the same 18, and a little tray beside it fills itself with the seeds. Rounds: 2 × 3, 5 × 2, 3 × 5, then 4 × 5, 6 × 3, 7 × 10 on the grid.</p>`,
mount(root){
  const R=[[2,3],[5,2],[3,5],[4,5],[6,3],[7,10]],GRID=3;
  const S={r:0,busy:false,won:false,ph:'shape',rr:1,cc:1,wins:0};
  const CS=34,GX=110,GY=132,MR=7,MC=10,FLC=['#ff8fb0','#ffd34d','#9ad0ff','#c9a2ff','#8ff0c8','#ffb88a','#ff7a93'];
  const qL=el('g',{},root),trayW=el('g',{},root),gridW=el('g',{},root);
  const trayL=el('g',{},trayW),seedL=el('g',{},trayW),hdl=el('g',{},trayW),labL=el('g',{},trayW);
  el('rect',{x:GX-16,y:GY-16,width:MC*CS+32,height:MR*CS+32,rx:14,fill:'#8a5a32',stroke:'#5a3a1e','stroke-width':3},trayL);
  el('rect',{x:GX-7,y:GY-7,width:MC*CS+14,height:MR*CS+14,rx:8,fill:'#4a2e1a'},trayL);
  for(let r=0;r<MR;r++)for(let c=0;c<MC;c++)el('circle',{cx:GX+c*CS+CS/2,cy:GY+r*CS+CS/2,r:6,fill:'#2e1c10'},trayL);
  const frame=el('rect',{fill:'rgba(255,240,160,.12)',stroke:'#fff0a0','stroke-width':3,'stroke-dasharray':'8 5',rx:8},trayL);
  const hd=el('g',{},hdl);el('circle',{r:19,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},hd);el('path',{d:'M-6,-6 L6,6 M0,-7 L7,0 L0,7',stroke:'#7a4a2e','stroke-width':2.4,fill:'none','stroke-linecap':'round'},hd);
  const rowsT=el('text',{'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff4e6'},labL),colsT=el('text',{'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff4e6'},labL);
  function drawFrame(){frame.setAttribute('x',GX-3);frame.setAttribute('y',GY-3);frame.setAttribute('width',S.cc*CS+6);frame.setAttribute('height',S.rr*CS+6);
    hd.setAttribute('transform',`translate(${GX+S.cc*CS},${GY+S.rr*CS})`);
    rowsT.setAttribute('x',GX-36);rowsT.setAttribute('y',GY+S.rr*CS/2+6);rowsT.textContent=`${S.rr} row${S.rr===1?'':'s'}`;
    colsT.setAttribute('x',GX+S.cc*CS/2);colsT.setAttribute('y',GY+MR*CS+44);colsT.textContent=`${S.cc} in each`}
  interact(hd,{label:'Planting frame corner: drag to set rows and seeds in each row',down:()=>({}),
    move:p=>{if(S.busy||S.won||S.ph!=='shape')return;const r=clamp(Math.round((p.y-GY)/CS),1,MR),c=clamp(Math.round((p.x-GX)/CS),1,MC);if(r!==S.rr||c!==S.cc){S.rr=r;S.cc=c;SFX.tick(r+c);drawFrame()}},
    up:()=>{if(!S.busy&&!S.won)release()},tap:()=>{if(!S.busy&&!S.won)release()}});
  hd.addEventListener('keydown',e=>{if(S.busy||S.won)return;const m={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];if(m){e.preventDefault();S.rr=clamp(S.rr+m[0],1,MR);S.cc=clamp(S.cc+m[1],1,MC);drawFrame()}});
  function release(){const [a,b]=R[S.r];if(S.ph!=='shape')return;
    if(S.rr===a&&S.cc===b)plant();
    else if(S.rr===b&&S.cc===a){SFX.clonk();say(`That's ${b} rows of ${a}: the same amount, but the question says ${a} rows of ${b}. Rows go across.`)}
    else{SFX.clonk();say(`That frame is ${S.rr} row${S.rr===1?'':'s'} of ${S.cc}. Make ${a} rows of ${b}.`)}}
  function plant(){const [a,b]=R[S.r];S.busy=true;S.ph='planting';frame.setAttribute('opacity',.35);hd.setAttribute('opacity',0);
    for(let r=0;r<a;r++)later(r*420,()=>{for(let c=0;c<b;c++){const x=GX+c*CS+CS/2,y=GY+r*CS+CS/2,g=el('g',{},seedL);el('ellipse',{cx:x,cy:y,rx:6,ry:8,fill:'#e8c070',stroke:'#a87830','stroke-width':1},g);popIn(g,.3)}
      SFX.plink(r+3);floatText(GX+b*CS+24,GY+r*CS+CS/2,String((r+1)*b),{size:20,col:'#fff0a0'})});
    later(a*420+400,bloom)}
  function bloom(){const [a,b]=R[S.r];SFX.shimmer();
    for(let r=0;r<a;r++)for(let c=0;c<b;c++)later((r*b+c)*22,()=>{const x=GX+c*CS+CS/2,y=GY+r*CS+CS/2,f=el('g',{},seedL),col=FLC[r%FLC.length];
      el('path',{d:`M${x},${y+4} q-2,-8 0,-12`,stroke:'#5c8f48','stroke-width':2,fill:'none'},f);for(let k=0;k<5;k++){const an=k*1.2566;el('ellipse',{cx:x+Math.cos(an)*5,cy:y-10+Math.sin(an)*5,rx:4.5,ry:3,fill:col,transform:`rotate(${(an*57.3).toFixed(0)} ${(x+Math.cos(an)*5).toFixed(1)} ${(y-10+Math.sin(an)*5).toFixed(1)})`},f)}
      el('circle',{cx:x,cy:y-10,r:2.4,fill:'#fff6c8'},f);popIn(f,.2)});
    later(a*b*22+400,trayWin)}
  function trayWin(){const [a,b]=R[S.r];S.won=true;S.ph='done';starterQ(qL,[['w',a],['o','×'],['w',b],['o','='],['w',a*b]],true);SFX.fanfare();roundWon(S.r);S.wins++;if(S.wins>=2)unlock('rows');
    say(`${a} rows of ${b}: ${a} × ${b} = ${a*b}. Now watch: turn the tray round…`);
    later(1300,()=>{const cx=GX+b*CS/2,cy=GY+a*CS/2;frame.setAttribute('opacity',0);rowsT.textContent='';colsT.textContent='';
      tween(900,t=>seedL.setAttribute('transform',`rotate(${(90*t).toFixed(1)} ${cx} ${cy})`),()=>{SFX.chime();starterQ(qL,[['w',a],['o','×'],['w',b],['o','='],['w',b],['o','×'],['w',a],['o','='],['w',a*b]],true);
        say(`${b} rows of ${a} is the same ${a*b} flowers: ${a} × ${b} = ${b} × ${a}.`);st.ready(true);S.busy=false},ease.inOut)})}
  /* the times-table rounds */
  let grid=null,mini=null;
  function gridRelease(r,c){const [a,b]=R[S.r];if(S.won||S.busy)return;
    if((r===a&&c===b)||(r===b&&c===a)){S.won=true;S.busy=true;grid.mirror(true);mini.set(a,b,true);SFX.fanfare();roundWon(S.r);S.wins++;if(S.wins>=2)unlock('rows');
      starterQ(qL,[['w',a],['o','×'],['w',b],['o','='],['w',a*b]],true);burst(300,300,{n:16});
      say(a===b?`${a} × ${b} = ${a*b}.`:`${a} × ${b} = ${a*b}. Turn the rectangle round, ${b} × ${a}, and it lands on the same ${a*b}, mirrored across the diagonal.`);later(1200,()=>{st.ready(true);S.busy=false})}
    else{SFX.clonk();say(`That's ${r} × ${c} = ${r*c}. Find ${a} × ${b}: ${a} rows down, ${b} across.`)}}
  const st=navStone({label:'Next tray',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this tray again',onTap:()=>load()});
  function load(){EPOCH++;FX.innerHTML='';seedL.innerHTML='';seedL.removeAttribute('transform');frame.setAttribute('opacity',1);hd.setAttribute('opacity',1);gridW.innerHTML='';
    Object.assign(S,{busy:false,won:false,ph:'shape',rr:1,cc:1});st.ready(false);navDots(R.length,S.r);const [a,b]=R[S.r];
    starterQ(qL,[['w',a],['o','×'],['w',b],['o','='],['o','?']]);
    if(S.r<GRID){trayW.style.display='';drawFrame();say(`${a} × ${b} means ${a} rows of ${b}. Drag the gold corner to make the planting frame.`)}
    else{trayW.style.display='none';grid=timesGrid(gridW,{x:28,y:96,cs:32,can:()=>!S.won&&!S.busy,onRelease:gridRelease,onMove:(r,c)=>mini.set(r,c)});mini=autoTray(gridW,{x:396,y:230,w:170,h:170});mini.set(1,1);
      say(`The times table! Drag the gold corner ${a} rows down and ${b} across. The corner square is ${a} × ${b}.`)}}
  S.r=resumeAt(R.length);load();
}};

