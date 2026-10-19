/* ---------- 3. Split: sharing in a ratio with a bar model ---------- */
function honeyPot(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  el('path',{d:'M-7,-4 Q-9,8 0,8 Q9,8 7,-4Z',fill:'#e0a03a',stroke:'#8a5a1a','stroke-width':1.2},g);el('rect',{x:-6,y:-8,width:12,height:4.5,rx:1.5,fill:'#c98a3a',stroke:'#8a5a1a','stroke-width':1},g);
  el('path',{d:'M-4,-3 q2,4 0,7',stroke:'#ffd27a','stroke-width':1.6,fill:'none'},g);return g}
function bearFace(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),hd=el('g',{},g);
  [-1,1].forEach(d=>{el('circle',{cx:d*18,cy:-18,r:9,fill:'#8a5a32'},hd);el('circle',{cx:d*18,cy:-18,r:4.5,fill:'#c98a5a'},hd)});
  el('circle',{r:25,fill:'#9a6a3e'},hd);el('ellipse',{cx:0,cy:8,rx:12,ry:9,fill:'#d8a878'},hd);
  const tg=el('path',{d:'M-5,13 Q-6,24 0,24 Q6,24 5,13Z',fill:'#e8607a',stroke:'#a83a4a','stroke-width':1,opacity:0},hd);
  el('ellipse',{cx:0,cy:3,rx:5,ry:3.5,fill:'#3a2418'},hd);el('path',{d:'M-6,12 Q0,16 6,12',fill:'none',stroke:'#3a2418','stroke-width':1.6},hd);
  [-1,1].forEach(d=>el('circle',{cx:d*9,cy:-6,r:3,fill:'#241a3a'},hd));return faceFx(g,hd,tg)}
function badgerFace(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),hd=el('g',{},g);
  [-1,1].forEach(d=>el('circle',{cx:d*16,cy:-16,r:6.5,fill:'#6a6a76'},hd));
  el('ellipse',{rx:23,ry:23,fill:'#9a9aa6'},hd);el('path',{d:'M-5,-23 Q0,-24 5,-23 L4,14 Q0,17 -4,14Z',fill:'#f4f4f8'},hd);
  [-1,1].forEach(d=>{el('path',{d:`M${d*6},-20 Q${d*13},-4 ${d*7},12 L${d*14},10 Q${d*19},-6 ${d*14},-18Z`,fill:'#24242c'},hd);el('circle',{cx:d*10,cy:-2,r:2.4,fill:'#fff'},hd);el('ellipse',{cx:d*17,cy:8,rx:5,ry:7,fill:'#f4f4f8'},hd)});
  const tg=el('path',{d:'M-4,18 Q-5,28 0,28 Q5,28 4,18Z',fill:'#e8607a',stroke:'#a83a4a','stroke-width':1,opacity:0},hd);
  el('ellipse',{cx:0,cy:16,rx:5,ry:3.5,fill:'#241a3a'},hd);return faceFx(g,hd,tg)}
/* lick: the tongue sweeps round the lips and the head bobs; munch: a happy wiggle */
function faceFx(g,hd,tg){g.lick=()=>{if(RM)return;SFX.gulp?SFX.gulp():SFX.pop(.7);tween(560,(t,p)=>{const a=Math.sin(p*Math.PI);tg.setAttribute('opacity',a>0.05?1:0);
    tg.setAttribute('transform',`translate(${(Math.sin(p*Math.PI*2)*5).toFixed(1)},${(-a*3).toFixed(1)})`);hd.setAttribute('transform',`translate(0,${(-a*4).toFixed(1)}) rotate(${(Math.sin(p*Math.PI*2)*5).toFixed(1)})`)},()=>{tg.setAttribute('opacity',0);hd.removeAttribute('transform')})};
  g.munch=()=>{if(RM)return;tween(900,(t,p)=>hd.setAttribute('transform',`rotate(${(Math.sin(p*Math.PI*6)*8).toFixed(1)})`),()=>hd.removeAttribute('transform'))};return g}
/* share pots by hand: drag a pot from the pile (or the sack) into a box, or tap a box to drop one in. Drag a pot out of a box to move it or put it back. */
function dealKit(parent,{a,b,N=null,build=false,BX=122,BW=70,YA=246,YB=366,pileY=118,sack=[300,152],faceX=64,faceS=1.1,onChange}){
  const g=el('g',{},parent),bgL=el('g',{},g),barL=el('g',{},g),btnL=el('g',{},g),drag=el('g',{},g);let na=build?1:a,nb=build?1:b,box=[],left=N,locked=false;
  const bear=bearFace(g,faceX,YA+BW/2,faceS),badger=badgerFace(g,faceX,YB+BW/2,faceS);
  const sx=BW/70,slot=(bx,by,i)=>[bx+(14+(i%3)*21)*sx,by+(17+Math.floor(i/3)*20)*sx];
  const boxXY=i=>i<na?[BX+i*BW,YA]:[BX+(i-na)*BW,YB];
  const pileXY=i=>[150+(i%12)*26,pileY+Math.floor(i/12)*28];
  const pileL=el('g',{},g);g.insertBefore(pileL,barL);
  const potsL=el('g',{},pileL),pileHit=N!=null?el('rect',{x:130,y:pileY-22,width:330,height:Math.ceil(N/12)*28+20,fill:'transparent'},pileL):null;
  if(pileHit)interact(pileHit,{label:'The pile of honey pots: drag one into a box',down:()=>({}),move:(p,p0,c)=>{if(!c.d){c.d=1;startDrag(p,null)}moveDrag(p)},up:p=>endDrag(p),tap:()=>say('Drag a pot into a box, or tap a box.')});
  let sackDone=false;
  function drawPile(){potsL.innerHTML='';if(N!=null){for(let i=0;i<left;i++){const [x,y]=pileXY(i);honeyPot(potsL,x,y,1.3)}}
    else if(!sackDone){sackDone=true;const s=el('g',{transform:`translate(${sack[0]},${sack[1]})`},pileL);el('path',{d:'M-34,34 Q-46,-10 -16,-26 L-22,-40 L22,-40 L16,-26 Q46,-10 34,34Z',fill:'#c9a77a',stroke:'#7a5a3a','stroke-width':2.5},s);
      el('path',{d:'M-20,-30 h40',stroke:'#7a5a3a','stroke-width':4},s);el('text',{y:16,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#5a3a22'},s).textContent='?';
      interact(s,{label:'The sack of honey pots: drag one into a box',down:()=>({}),move:(p,p0,c)=>{if(!c.d){c.d=1;startDrag(p,null)}moveDrag(p)},up:p=>endDrag(p),tap:()=>say('Drag a pot into a box, or tap a box.')})}}
  function drawPots(i){const bg=barL.querySelector(`[data-box="${i}"]`);if(!bg)return;const pl=bg.querySelector('.pots');pl.innerHTML='';const [x,y]=boxXY(i);for(let k=0;k<box[i];k++){const [px,py]=slot(x,y,k);honeyPot(pl,px,py,1.1*sx)}}
  function drawBars(){barL.innerHTML='';btnL.innerHTML='';
    for(let i=0;i<na+nb;i++){const [x,y]=boxXY(i),c=i<na?'#ffd23a':'#ffb34d',bg=el('g',{'data-box':i},barL);el('rect',{x,y,width:BW,height:BW,fill:c,opacity:.92,stroke:'#7a5a2a','stroke-width':2.5},bg);el('g',{class:'pots'},bg);
      interact(bg,{label:`${i<na?'Bear':'Badger'} box ${i<na?i+1:i-na+1}`,down:p=>({p}),move:(p,p0,c)=>{if(!c.d&&box[i]>0){c.d=1;startDrag(p,i)}moveDrag(p)},up:p=>endDrag(p),tap:()=>addTo(i,null)});drawPots(i)}
    if(build)[['a',YA,na],['b',YB,nb]].forEach(([w,y,n])=>{const bx=BX+n*BW+24;[['+',1],['−',-1]].forEach(([t,d],j)=>{const bt=el('g',{transform:`translate(${bx+j*40},${y+BW/2})`},btnL);el('circle',{r:17,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2},bt);
      el('text',{y:7,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#fff0a0'},bt).textContent=t;
      interact(bt,{label:`${d>0?'Add a box to':'Take a box from'} the ${w==='a'?'bear':'badger'}’s bar`,tap:()=>{if(locked)return;setBars(w,d)}})})})}
  function setBars(w,d){const A=box.slice(0,na),B=box.slice(na,na+nb);if(w==='a'){if(na+d<1||na+d>5)return;if(d<0&&N!=null)left+=A.pop();else if(d<0)A.pop();else A.push(0);na+=d}
    else{if(nb+d<1||nb+d>5)return;if(d<0&&N!=null)left+=B.pop();else if(d<0)B.pop();else B.push(0);nb+=d}box=[...A,...B];SFX.pop(d>0?1.1:.8);drawPile();drawBars();onChange&&onChange()}
  let dg=null;
  function startDrag(p,from){if(locked)return;if(from==null&&N!=null&&left<=0)return;if(from!=null){box[from]--;drawPots(from)}else if(N!=null){left--;drawPile()}
    dg={from,pot:honeyPot(drag,p.x,p.y,1.5)};SFX.pop(1.2)}
  function moveDrag(p){if(dg)dg.pot.setAttribute('transform',`translate(${p.x},${p.y}) scale(1.5)`)}
  function endDrag(p){if(!dg)return;const d=dg;dg=null;d.pot.remove();const i=[...Array(na+nb).keys()].find(i=>{const [x,y]=boxXY(i);return p.x>=x-8&&p.x<=x+BW+8&&p.y>=y-8&&p.y<=y+BW+8});
    if(i!=null&&box[i]<9){box[i]++;fed(i)}else{if(i!=null)say('That box is full!');if(d.from!=null&&N==null){}else if(N!=null)left++;else if(d.from!=null){} }
    drawPile();drawBars();onChange&&onChange()}
  function fed(i){SFX.plop?SFX.plop():SFX.pop(1);(i<na?bear:badger).lick()}
  function addTo(i){if(locked)return;if(N!=null&&left<=0){say('The pile is empty! Drag a pot out of a box to move it.');return}if(box[i]>=9){say('That box is full!');return}if(N!=null)left--;box[i]++;fed(i);drawPile();drawBars();onChange&&onChange()}
  box=Array(na+nb).fill(0);drawPile();drawBars();
  return{g,bear,badger,lock:b=>{locked=b},bars:()=>[na,nb],
    state:()=>{const A=box.slice(0,na),B=box.slice(na);return{A,B,a:A.reduce((x,y)=>x+y,0),b:B.reduce((x,y)=>x+y,0),left,equal:box.every(v=>v===box[0])&&box[0]>0,k:box[0]}},
    label(){btnL.innerHTML='';const st=this.state();[[st.a,na,YA],[st.b,nb,YB]].forEach(([v,n,y])=>{const t=el('text',{x:BX+n*BW+14,y:y+BW/2+8,'font-size':24,'font-weight':700,fill:'#fff4e6'},g);t.textContent=v;popIn(t,.4)})}}}
/* pass pots between the bear and the badger: drag (or tap a heap to pass one across) */
function giveKit(parent,{A,B,onChange}){const g=el('g',{},parent),hp=[el('g',{},g),el('g',{},g)],drag=el('g',{},g);let n=[A,B],locked=false,dg=null;
  const X=[140,420],bear=bearFace(g,X[0],196,1.3),badger=badgerFace(g,X[1],196,1.3),face=[bear,badger];
  el('path',{d:'M222,300 H338 M326,288 L340,300 L326,312 M258,330 L242,342 L258,354 M240,342 H356',fill:'none',stroke:'rgba(255,244,230,.35)','stroke-width':4,'stroke-linecap':'round'},g);
  const pos=(w,i)=>[X[w]-52+(i%5)*26,306+Math.floor(i/5)*30];
  function draw(){[0,1].forEach(w=>{const L=hp[w];L.innerHTML='';el('ellipse',{cx:X[w],cy:330,rx:90,ry:70,fill:'rgba(255,244,230,.06)',stroke:'rgba(255,244,230,.2)','stroke-width':2},L);
    for(let i=0;i<n[w];i++){const [x,y]=pos(w,i);honeyPot(L,x,y,1.35)}
    const hit=el('ellipse',{cx:X[w],cy:330,rx:96,ry:76,fill:'transparent'},L);
    interact(hit,{label:`The ${w?'badger':'bear'}’s pots: drag one across, or tap to pass one`,down:()=>({}),move:(p,p0,c)=>{if(!c.d&&n[w]>0&&!locked){c.d=1;n[w]--;dg={w,pot:honeyPot(drag,p.x,p.y,1.6)};draw()}if(dg)dg.pot.setAttribute('transform',`translate(${p.x},${p.y}) scale(1.6)`)},
      up:p=>{if(!dg)return;const d=dg;dg=null;d.pot.remove();const to=p.x>280?1:0;n[to]++;if(to!==d.w)face[to].lick();draw();onChange&&onChange()},
      tap:()=>{if(locked||n[w]<=0)return;n[w]--;n[1-w]++;SFX.pop(1);face[1-w].lick();draw();onChange&&onChange()}})})}
  draw();return{g,bear,badger,get:()=>[...n],lock:b=>{locked=b},
    label(){[0,1].forEach(w=>{const t=el('text',{x:X[w],y:452,'text-anchor':'middle','font-size':26,'font-weight':700,fill:'#fff4e6'},g);t.textContent=n[w];popIn(t,.4)})}}}

W.split={scene:'meadow',
notes:`<p>Sharing in a ratio, with the bar model, done by hand. A bear and a badger share honey pots so that for every 3 the bear gets, the badger gets 2 (bear : badger = 3 : 2). The bear's bar has 3 boxes and the badger's has 2, and every box must hold the same. She drags pots from the pile into the boxes (or taps a box to drop one in); whoever gets a pot licks their lips. Dealing them round one at a time is exactly how sharing works, and the bars show why 20 pots at 3 : 2 is 4 in each of 5 boxes. Drag a pot out of a box to move it or put it back. Share checks every pot is used and every box is fair.</p>
<p>Rounds (small piles, so there isn't too much dragging): 10 pots at 3 : 2; 9 at 1 : 2, building the bars with + and −; then passing pots: the bear has 6 and the badger 2, pass pots to make it fair (1 : 1); turned round: the bear got 6 (a sack instead of a pile); flip the ratio: the bear has 6 and the badger 2 (3 : 1), pass pots to make it 1 : 3 (8 pots in 4 parts is 2 a part, so 2 and 6: the bear gives 4); the bear got 6 more than the badger at 4 : 1; 14 at 4 : 3 (build the bars). When passing, tap a heap to pass one pot across, or drag. Mistakes don't reset: she fixes it and tries again.</p>`,
mount(root){
  const R=[{k:'total',a:3,b:2,p:[10,15,20]},{k:'total',build:1,a:1,b:2,p:[9,6,12]},{k:'give',p:[[6,2,1,1],[7,3,1,1],[8,4,1,1]]},{k:'one',who:'a',a:3,b:2,p:[6,9,3]},
    {k:'give',p:[[6,2,1,3],[8,4,1,2],[10,5,1,2]]},{k:'diff',a:4,b:1,p:[6,3,9]},{k:'total',build:1,a:4,b:3,p:[14,7,21]}];
  const S={r:0,busy:false,won:false,pi:{}};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let kit=null;
  const st=navStone({label:'Next share',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this share again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Share out the pots',share,'Share');
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length];return q.k==='give'?{k:'give',A:v[0],B:v[1],a:v[2],b:v[3]}:Object.assign({},q,{v})};
  const nm=w=>w==='a'?'bear':'badger';
  const parts=(q,done,k)=>{if(q.k==='give')return[['t','bear : badger'],['o','='],['w',RAT(q.A,q.B)],['o','→'],['w',RAT(q.a,q.b)],...(done?[['o','='],['w',RAT(...kit.get())]]:[])];const r=[['t','bear : badger'],['o','='],['w',RAT(q.a,q.b)]];
    if(done)return[['w',RAT(q.a,q.b)],['o','='],['w',RAT(q.a*k,q.b*k)]];
    return q.k==='total'?[['w',q.v],['t','pots,'],...r]:q.k==='one'?[...r,['t',`, ${nm(q.who)} gets`],['w',q.v]]:[...r,['t',', bear gets'],['w',q.v],['t','more pots']]};
  function share(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='give'){const [x,y]=kit.get(),T=q.A+q.B,k=T/(q.a+q.b);if(x*q.b!==y*q.a){SFX.wrong();shake(2);say(`Bear ${x}, badger ${y} is ${RAT(x/gcd(x,y),y/gcd(x,y))}, not ${RAT(q.a,q.b)}. Keep passing.`);return}
      S.won=true;kit.lock(true);goB.style.display='none';kit.label();kit.bear.munch();kit.badger.munch();
      win(q,k,`${T} pots in ${q.a+q.b} part${q.a+q.b>1?'s':''} is ${k} a part: bear ${x}, badger ${y}. The bear gave ${q.A-x}.`);return}
    const [na,nb]=kit.bars(),s=kit.state();
    if(na!==q.a||nb!==q.b){SFX.wrong();shake(2);say(`${RAT(q.a,q.b)}: the bear needs ${q.a} box${q.a>1?'es':''}, the badger ${q.b}. Fix the bars with + and −.`);return}
    if(!s.a&&!s.b){say('Drag the pots into the boxes first.');return}
    if(q.k==='total'&&s.left>0){SFX.wrong();say(`${s.left} pot${s.left>1?'s are':' is'} still in the pile. Share them all!`);return}
    if(!s.equal){SFX.wrong();shake(2);say('Not fair! Every box must hold the same number of pots.');return}
    const k=s.k,got=q.k==='diff'?s.a-s.b:q.k==='one'?(q.who==='a'?s.a:s.b):null;
    if(q.k!=='total'&&got!==q.v){SFX.wrong();say(q.k==='diff'?`Fair boxes, but the bear has ${got} more, not ${q.v}.`:`Fair boxes, but the ${nm(q.who)} has ${got}, not ${q.v}.`);return}
    S.won=true;kit.lock(true);goB.style.display='none';kit.label();kit.bear.munch();kit.badger.munch();
    win(q,k,q.k==='total'?`${q.v} ÷ ${q.a+q.b} boxes = ${k} in each. Bear ${s.a}, badger ${s.b}.`:q.k==='diff'?`${q.a-q.b} extra boxes hold ${q.v}, so ${k} in each. Bear ${s.a}, badger ${s.b}.`
      :`${q.v} in ${q.who==='a'?q.a:q.b} boxes = ${k} each. So the ${q.who==='a'?'badger':'bear'} gets ${q.who==='a'?s.b:s.a}, ${s.a+s.b} altogether.`)}
  function win(q,k,msg){roundWon(S.r);SFX.fanfare();SFX.chime();kaiWin(guide);decQ(qL,parts(q,true,k),true,guide);say(msg);burst(300,330,{n:14,cols:['#ffd23a','#ffb34d','#fff0a0']});
    if(S.r>=2)unlock('parts');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);
    goB.querySelector('text').textContent=q.k==='give'?'Done':'Share';
    kit=q.k==='give'?giveKit(board,{A:q.A,B:q.B}):dealKit(board,{a:q.a,b:q.b,N:q.k==='total'?q.v:null,build:!!q.build});decQ(qL,parts(q,false),false,guide);
    say(q.k==='give'?`The bear has ${q.A} pots, the badger ${q.B}. Pass pots across to make it ${RAT(q.a,q.b)}. Then Done.`
      :S.r===0?`Share ${q.v} pots, bear : badger = ${RAT(q.a,q.b)}. Drag pots into the boxes, the same in each. Then Share.`
      :q.build&&S.r===1?`Now ${RAT(q.a,q.b)}. Build the bars with + and −, share the pots, then Share.`
      :q.build?`${q.v} pots at ${RAT(q.a,q.b)}. Build the bars, share the pots, then Share.`
      :q.k==='one'?`Turned round! The ${nm(q.who)} got ${q.v}. Fill every box the same, then Share.`
      :`The bear got ${q.v} more than the badger. Fill every box the same, then Share.`)}
  W.split.dbgQ=Q;W.split.dbgK=()=>kit.state?kit.state():kit.get();S.r=resumeAt(R.length);load();
}};
