
/* ---------- 5. Tulips: per cent means out of 100 ---------- */
function tulip(parent,x,y,s,col,ghost){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(ghost){el('path',{d:'M-6,-4 q0,-10 6,-12 q6,2 6,12 q-6,5 -12,0Z',fill:'none',stroke:col,'stroke-width':1.8,'stroke-dasharray':'3 2'},g);return g}
  el('path',{d:'M0,8 V-2',stroke:'#4fa84a','stroke-width':2.2},g);el('path',{d:'M0,6 q-7,-2 -8,-9 q6,1 8,7Z',fill:'#5c9f48'},g);
  el('path',{d:'M-7,-4 l0,-10 l3.5,4 l3.5,-6 l3.5,6 l3.5,-4 l0,10 q-7,6 -14,0Z',fill:col,stroke:darker(col,.75),'stroke-width':1},g);return g}
/* a field of 100 bulbs in rows of ten, with some already planted, and the new ones as ghosts */
function fieldKit(parent,{x,y,cs,pre=[],col}){const g=el('g',{},parent),bg=el('g',{},g),fl=el('g',{},g),gh=el('g',{},g),off=pre.reduce((a,p)=>a+p.n,0);
  el('rect',{x:x-8,y:y-8,width:cs*10+16,height:cs*10+16,rx:12,fill:'#4a3020',stroke:'#2e1c12','stroke-width':2},bg);
  for(let r=0;r<10;r++)el('rect',{x:x-2,y:y+r*cs+cs*.55,width:cs*10+4,height:cs*.3,rx:cs*.15,fill:'#3a2418',opacity:.7},bg);
  for(let k=0;k<100;k++)el('circle',{cx:x+(k%10+.5)*cs,cy:y+(Math.floor(k/10)+.5)*cs+cs*.15,r:cs*.12,fill:'#7a5a3a'},bg);
  const at=k=>[x+(k%10+.5)*cs,y+(Math.floor(k/10)+.5)*cs];
  let k0=0;pre.forEach(p=>{for(let j=0;j<p.n;j++){const [cx,cy]=at(k0+j);tulip(fl,cx,cy,cs/26,p.col)}k0+=p.n});
  let n=0;
  return{g,off,room:100-off,ghost(m){n=m;gh.innerHTML='';for(let j=0;j<Math.min(m,100-off);j++){const [cx,cy]=at(off+j);tulip(gh,cx,cy,cs/26,col,true)}},
    bloom(done){gh.innerHTML='';const m=Math.min(n,100-off);const L=el('g',{},fl);for(let j=0;j<m;j++)later(j*14,()=>{const [cx,cy]=at(off+j),t=tulip(L,cx,cy,cs/26,col);popIn(t,.2);if(j%10===9||j===m-1)SFX.plink(Math.floor(j/10)+3)});
      later(m*14+400,()=>done&&done(L))},at}}

W.tulips={scene:'patch',
notes:`<p>Percentages: per cent means "out of 100". Percy the gardener has exactly 100 bulbs, in 10 rows of 10. Two levers on the right (out of the way of her hand): one plants a whole row of 10 at a time, the other single bulbs. Ghost tulips show where they'll go; Plant makes them bloom. 45% is 4 rows and 5 more: 45 out of 100. When it's right, the box writes it out: 45% = 45 out of 100 = 0.45.</p>
<p>There's no counter: she reads the rows. A wrong planting says what she made ("54 tulips: that's 54%") and she can adjust the levers.</p>
<p>Rounds: 50%, 30%, 45%, 5% (only five tulips, not 50), then the rest of the field: 35% is red already, what percent is left for yellow (65%); and 40% red with 25% yellow, the rest white (35%).</p>`,
mount(root){
  const RED='#ff5a7a',YEL='#ffd34d',WHT='#f4f0fa';
  const R=[{t:50},{t:30},{t:45},{t:5},{pre:[35],t:65},{pre:[40,25],t:35}];
  const S={r:0,busy:false,won:false};
  const qL=el('g',{},root),board=el('g',{},root),ui=el('g',{},root);let fk=null,L1=null,L2=null,planted=null;
  const percy=creature(ui,{x:58,y:486,r:24,i:6,label:'Percy the gardener',hat:'beanie'});
  const dotG=dotChar(ui,170,44,12);
  const st=navStone({label:'Next order',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this field again',onTap:()=>load()});
  const goB=decGo(ui,494,480,'Plant the tulips',plant,'Plant');
  const colOf=q=>q.pre?(q.pre.length===1?YEL:WHT):RED,nameOf=q=>q.pre?(q.pre.length===1?'yellow':'white'):'red';
  const parts=(q,done)=>{const A=done?['w',`${q.t}%`]:['o','?'];if(q.pre)return[...q.pre.flatMap(p=>[['w',`${p}%`],['o','+']]),A,['o','='],['w','100%']];
    return done?[['w',`${q.t}%`],['o','='],['w',q.t],['t','out of 100'],['o','='],['w',fmtH(q.t)]]:[['t','Plant'],['w',`${q.t}%`],['t',nameOf(q)]]};
  const n=()=>L1.get()*10+L2.get();
  function plant(){if(S.busy||S.won)return;const q=Q(),m=n();if(!m){say('Pull the levers up first: they set how many to plant.');return}
    S.busy=true;goB.style.display='none';L1.lock(true);L2.lock(true);
    if(m>fk.room){SFX.wrong();shake(3);say('Too many: that’s more than the field holds! Bring a lever down.');later(1600,()=>{S.busy=false;goB.style.display='';L1.lock(false);L2.lock(false)});return}
    fk.ghost(m);fk.bloom(Lg=>{planted=Lg;if(m===q.t)win(q);else{SFX.wrong();percy.mood('oh');
      say(q.pre?`${[...q.pre,m].map(v=>v+'%').join(' + ')} is ${q.pre.reduce((a,b)=>a+b,0)+m}%, not 100%. Change the levers and plant again.`:`That's ${m} tulips: ${m}%. Percy wanted ${q.t}%. Change the levers and plant again.`);
      later(2600,()=>{planted.remove();if(!q.pre)fk.ghost(m);percy.mood('');S.busy=false;goB.style.display='';L1.lock(false);L2.lock(false)})}})}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();percy.mood('happy');percy.hop(14);decQ(qL,parts(q,true),true,dotG);dotG.mood('happy');
    const tot=q.pre?q.pre.reduce((a,b)=>a+b,0):0;
    say(q.pre?`${[...q.pre,q.t].map(v=>v+'%').join(' + ')} = 100%: the whole field!`:q.t===5?'5%: just 5 out of 100. Not 50%!':q.t===50?'50 out of 100: half the field! 50% is a half.':`${q.t} tulips out of 100: ${q.t}%. That's ${fmtH(q.t)} of the field!`);
    if(S.r>=2)unlock('percent');later(1400,()=>st.ready(true))}
  const Q=()=>R[S.r];
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';percy.mood('');
    const cols=[RED,YEL];fk=fieldKit(board,{x:76,y:100,cs:30,pre:(q.pre||[]).map((v,i)=>({n:v,col:cols[i]})),col:colOf(q)});
    const blind=!!q.pre,upd=()=>{if(!blind)fk.ghost(n())};
    L1=lever(board,{x:446,y0:396,y1:138,n:10,cap:blind?'tens':'rows of 10',fmt:v=>blind?`${v*10}`:'',label:'Tens lever: plants 10 at a time',col:colOf(q),onChange:upd});
    L2=lever(board,{x:530,y0:396,y1:138,n:9,cap:blind?'ones':'single',fmt:v=>blind?`${v}`:'',label:'Ones lever: plants one at a time',col:colOf(q),onChange:upd});
    decQ(qL,parts(q),false,dotG);dotG.mood('');
    say(S.r===0?'Percy has 100 bulbs. Per cent means out of 100. Plant 50% red: set the levers, then Plant.':q.pre?(q.pre.length===1?'35% is red. What percent is left for yellow? The bulbs are hidden: work it out, set the levers, Plant!':'Red 40%, yellow 25%. What percent is left for white? Work it out, then Plant.'):q.t===5?'Only 5% this time!':`Plant ${q.t}% red tulips.`)}
  S.r=resumeAt(R.length);load();
}};
