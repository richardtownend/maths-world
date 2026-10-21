/* ---------- 3. The Year Stone: reading long numbers by splitting them into places ---------- */
W.year={scene:'road',
notes:`<p>Bridges on the old road have the year they were built carved on them, and long Roman numbers are read by splitting them up. First she taps the gaps between letters to split the carving into thousands, hundreds, tens and ones (M | CM | XC). Pairs that take away stay together. Check: right, and each chunk drops into its place column; a place with nothing carved is a 0. Then she sets a digit wheel under each column and checks the year.</p>
<p>D (500) appears in the second bridge (a key on the left shows every letter's value). The last round turns it round: carve this year on the new bridge, checked by reading it back letter by letter.</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)],THIS=Math.max(2026,new Date().getFullYear());
  const R=[{ys:[2014,2019,2008]},{ys:[1850,1820,1860],d:1},{ys:[1990,1970,1980]},{ys:[1949,1864,1999,1945]},{carve:1}];
  const S={r:0,busy:false,won:false,y:0,str:'',cuts:new Set(),phase:'split',W:[]};
  const scene=el('g',{},root),panel=el('g',{},root),cols=el('g',{},root),readL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let cv=null,go=null;
  const st=navStone({label:'Next bridge',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this bridge again',onTap:()=>load()});
  const SZ=50,cw=SZ*CW,PY=212,CX=[106,216,326,436],PL=['thousands','hundreds','tens','ones'];
  /* split a Roman number into its place chunks: M | CM | XC | … */
  const chunks=s=>{const out=[];let i=0;while(i<s.length){const two=s.slice(i,i+2),t=ROMAN.find(([v,r])=>r===two)?two:s[i];out.push(t);i+=t.length}
    const pl=t=>{const v=romanVal(t);return v>=1000?0:v>=100?1:v>=10?2:3};const G=[[],[],[],[]];out.forEach(t=>G[pl(t)].push(t));return G.map(a=>a.join(''))};
  const goodCuts=s=>{const G=chunks(s).filter(Boolean),set=new Set();let k=0;G.slice(0,-1).forEach(g=>{k+=g.length;set.add(k)});return set};
  const parts=done=>R[S.r].carve?[['w',S.y],['o','='],done?['w',toRoman(S.y)]:['o','?']]:[['w',S.str],['o','='],done?['w',S.y]:['o','?']];
  function drawScene(){scene.innerHTML='';
    el('rect',{x:-700,y:300,width:2000,height:300,fill:'#4a8ac8'},scene);for(let i=0;i<14;i++)el('path',{d:`M${-40+((i*97)%680)},${320+((i*41)%120)} q12,-5 24,0`,stroke:'#cfe8ff','stroke-width':2.5,fill:'none',opacity:.6},scene);
    el('path',{d:'M-700,264 H1300 V292 H-700Z',fill:'#c2b294',stroke:STONE.edge,'stroke-width':2},scene);
    [[-60,180],[180,420],[420,660]].forEach(([a,b])=>el('path',{d:`M${a},300 Q${(a+b)/2},${R[S.r].carve?250:236} ${b},300`,fill:'#2a4a7a',opacity:.5},scene));
    el('rect',{x:-700,y:292,width:2000,height:10,fill:'#a8987a'},scene)}
  function drawKey(){const L=R[S.r].d||S.r>=2?'IVXLCDM':'IVXLCM';const kg=el('g',{transform:'translate(536,98)'},panel);el('rect',{x:-40,y:-14,width:84,height:L.length*19+12,rx:8,fill:'#fffaf0',stroke:'#c9a77a','stroke-width':2},kg);
    [...L].forEach((c,i)=>{const t=el('text',{x:-30,y:4+i*19,'font-size':15,'font-weight':700,fill:'#4a3c2a',style:`font-family:${ROAD_FONT}`},kg);t.textContent=c;el('text',{x:38,y:4+i*19,'text-anchor':'end','font-size':12.5,'font-weight':800,fill:c==='D'&&R[S.r].d?'#c9413a':'#7a5a3a'},kg).textContent=fmtR(RV[c])})}
  /* the carving on the parapet, with a tappable gap between every pair of letters */
  function drawPanel(){panel.innerHTML='';drawKey();const s=S.str,w=s.length*cw+40,x0=300-s.length*cw/2;
    const g=el('g',{},panel);el('rect',{x:300-w/2,y:PY-44,width:w,height:76,rx:10,fill:STONE.face,stroke:STONE.edge,'stroke-width':3},g);
    [...s].forEach((c,i)=>carve(g,x0+cw/2+i*cw,PY+12,c,{sz:SZ}));
    if(S.phase!=='split')return;
    for(let i=1;i<s.length;i++){const x=x0+i*cw,cut=S.cuts.has(i),h=el('g',{},g);
      if(cut){el('line',{x1:x,x2:x,y1:PY-38,y2:PY+26,stroke:'#c9413a','stroke-width':4,'stroke-linecap':'round'},h)}else el('line',{x1:x,x2:x,y1:PY+20,y2:PY+26,stroke:STONE.side,'stroke-width':2},h);
      el('rect',{x:x-cw*.32,y:PY-44,width:cw*.64,height:84,fill:'transparent'},h);
      interact(h,{label:`Gap after ${s.slice(0,i)}`,tap:()=>{if(S.busy||S.won)return;cut?S.cuts.delete(i):S.cuts.add(i);SFX.tick(i);drawPanel()}})}}
  function drawCols(){cols.innerHTML='';const G=chunks(S.str);
    CX.forEach((x,i)=>{const g=el('g',{},cols);el('rect',{x:x-52,y:322,width:104,height:66,rx:10,fill:'rgba(255,250,240,.9)',stroke:'#c9a77a','stroke-width':2},g);
      el('text',{x,y:340,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#7a5a3a'},g).textContent=PL[i];
      if(S.phase==='wheels'){if(G[i])carve(g,x,376,G[i],{sz:24});else el('text',{x,y:374,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#a8987a'},g).textContent='nothing'}})}
  function checkSplit(){const good=goodCuts(S.str),cuts=S.cuts;
    if(![...good].every(k=>cuts.has(k))||[...cuts].some(k=>!good.has(k))){
      const extra=[...cuts].find(k=>!good.has(k));let msg;
      if(extra!=null){const a=S.str[extra-1],b=S.str[extra];msg=RV[a]<RV[b]?`${a}${b} belongs together: the ${a} in front takes away from the ${b}.`:`${S.str.slice(0,extra)} and ${S.str.slice(extra)}: both sides of that cut are the same kind (${PL[[1000,100,10,1].findIndex(v=>RV[a]>=v)]}).`}
      else msg='Split wherever the letters change from thousands (M) to hundreds (C, D) to tens (X, L) to ones (I, V).';
      SFX.wrong();shake(2);say(msg);return}
    SFX.chime();S.phase='wheels';drawPanel();drawCols();burst(300,PY,{n:10});
    S.W=CX.map((x,i)=>bigWheels(ui,{x,y:470,digits:1,label:`The ${PL[i]} digit`}));
    if(go)go.remove();go=decGo(ui,548,470,'Check the year',check,'Check');say('Now set each wheel: how many thousands, hundreds, tens and ones?')}
  function check(){if(S.busy||S.won)return;const q=R[S.r];
    if(q.carve){const s=cv.get();if(!s){say(`Carve ${S.y} on the new bridge.`);return}S.busy=true;readL.innerHTML='';
      readOut(readL,300,PY+10,s,{sz:SZ,done:v=>{if(v===S.y&&s===toRoman(S.y)){win();return}SFX.wrong();shake(2);say(v===S.y?'That adds up, but carve it biggest first, with no more than three the same.':`The stone reads ${fmtR(v)}, not ${S.y}. Do the thousands first, then the hundreds, tens and ones.`);later(2600,()=>{readL.innerHTML='';S.busy=false})}});return}
    if(S.phase==='split'){checkSplit();return}
    const vals=S.W.map(w=>w.get());if(vals.every(v=>v==null)){say('Set the wheels under each column.');return}
    const y=vals.reduce((a,v)=>a*10+(v||0),0);if(y===S.y){win();return}
    const G=chunks(S.str),badI=vals.findIndex((v,i)=>(v||0)!==Math.floor(S.y/[1000,100,10,1][i])%10);SFX.wrong();shake(2);
    say(G[badI]?`Look at the ${PL[badI]}: ${G[badI]} is ${romanVal(G[badI])}, so the ${PL[badI]} wheel shows ${Math.floor(S.y/[1000,100,10,1][badI])%10}.`:`Nothing is carved in the ${PL[badI]}, so that wheel is 0.`)}
  function win(){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();decQ(qL,parts(true),true,guide);burst(300,PY,{n:18});S.W.forEach(w=>w.lock(true));
    const G=chunks(toRoman(S.y));say(R[S.r].carve?`${toRoman(S.y)}: ${G.filter(Boolean).join(' | ')}. The new bridge has this year on it!`:`${G.filter(Boolean).map(c=>`${c} is ${fmtR(romanVal(c))}`).join(', ')}. Built in ${S.y}.`);
    if(S.r>=2)unlock('ryear');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';readL.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);go=null;cv=null;const q=R[S.r];
    Object.assign(S,{busy:false,won:false,y:q.carve?THIS:pick(q.ys),cuts:new Set(),phase:q.carve?'carve':'split',W:[]});S.str=toRoman(S.y);
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene();
    if(q.carve){panel.innerHTML='';drawKey();cols.innerHTML='';cv=carver(panel,{x:300,y:PY,letters:'IVXLCDM',max:9,sz:SZ,ty:330,can:()=>!S.busy&&!S.won});
      go=decGo(ui,548,470,'Check the carving',check,'Check');say(`The new bridge is finished! Carve this year, ${S.y}, on it.`)}
    else{S.str=toRoman(S.y);drawPanel();drawCols();go=decGo(ui,548,470,'Check the split',check,'Check');
      say(S.r===0?'When was this bridge built? First, tap the gaps to split the year into thousands, hundreds, tens and ones.':q.d?'A new letter: D is 500, half of M. Split the year into its places.':'Split the year into thousands, hundreds, tens and ones.')}}
  W.year.dbgQ=()=>({r:S.r,y:S.y,str:S.str,phase:S.phase,good:[...goodCuts(S.str)],carved:cv?cv.get():null});
  S.r=resumeAt(R.length);load();
}};
