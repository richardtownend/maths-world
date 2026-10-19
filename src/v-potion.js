
/* ---------- 4. Potion: × and ÷ by 10 and 100 move the digits; Dot stays still ---------- */
const PLACES=[{p:2,n:'hundreds'},{p:1,n:'tens'},{p:0,n:'ones'},{dot:1},{p:-1,n:'tenths'},{p:-2,n:'hundredths'}];
/* a place-value chart with digit tiles you slide left or right as one strip */
function pvKit(parent,{x0,y,cw=84,dw=52,ch=64,num,noDot=false,label='Digits: drag them left or right',onShift}){
  const g=el('g',{},parent),cols={},hdr=el('g',{},g),cellL=el('g',{},g),ghostL=el('g',{},g),tileL=el('g',{},g);let x=x0,dotX=0;
  PLACES.forEach(c=>{const w=c.dot?dw:cw;if(c.dot){dotX=x+w/2}else{cols[c.p]=x+w/2;
      el('rect',{x:x+2,y:y-30,width:w-4,height:24,rx:6,fill:c.p>=0?'#4a3a7a':'#7a3a5a'},hdr);el('text',{x:x+w/2,y:y-13,'text-anchor':'middle','font-size':12.5,'font-weight':700,fill:'#fff4e6'},hdr).textContent=c.n;
      el('rect',{x:x+3,y,width:w-6,height:ch,rx:10,fill:'rgba(255,244,230,.08)',stroke:'rgba(255,244,230,.28)','stroke-width':1.5},cellL)}
    x+=w});
  const x1=x,dot=noDot?null:dotChar(g,dotX,y+ch*.6,13);if(noDot)el('circle',{cx:dotX,cy:y+ch*.6,r:9,fill:'none',stroke:'#6a6088','stroke-width':2.5,'stroke-dasharray':'4 3'},g);
  /* digits of the number, significant ones only, with their places */
  const [ip,fp='']=String(num).split('.'),ds=[];[...ip].forEach((d,i)=>ds.push({d:+d,p:ip.length-1-i}));[...fp].forEach((d,j)=>ds.push({d:+d,p:-(j+1)}));
  while(ds.length>1&&ds[0].d===0)ds.shift();while(ds.length>1&&ds[ds.length-1].d===0&&ds[ds.length-1].p<0)ds.pop();
  const pmax=Math.max(...ds.map(d=>d.p)),pmin=Math.min(...ds.map(d=>d.p)),lo=-2-pmin,hi=2-pmax;let s=0,locked=false;
  const tiles=ds.map(d=>{const t=el('g',{},tileL);el('rect',{x:-cw/2+8,y:6,width:cw-16,height:ch-12,rx:10,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},t);
    el('text',{y:ch/2+14,'text-anchor':'middle','font-size':38,'font-weight':700,fill:'#3a2418'},t).textContent=d.d;return{d,t}});
  const val=()=>ds.reduce((a,d)=>a+d.d*Math.pow(10,d.p+s+2),0);
  function show(anim){ghostL.innerHTML='';const P=new Set(ds.map(d=>d.p+s)),l=Math.min(0,pmin+s),h=Math.max(0,pmax+s);
    for(let p=l;p<=h;p++)if(!P.has(p))el('text',{x:cols[p],y:y+ch/2+14,'text-anchor':'middle','font-size':38,'font-weight':700,fill:DOTC,opacity:.7},ghostL).textContent='0';
    tiles.forEach(({d,t})=>{const tx=cols[d.p+s];if(anim){const f=+(t.dataset.x||tx);tween(220,q=>t.setAttribute('transform',`translate(${lerp(f,tx,q).toFixed(1)},${y})`),null,ease.back)}else t.setAttribute('transform',`translate(${tx},${y})`);t.dataset.x=tx})}
  const set=v=>{v=clamp(v,lo,hi);if(v===s)return;s=v;SFX.tick(s+3);SFX.swish();show(true);onShift&&onShift(s,val())};
  const hit=el('rect',{x:x0,y:y-4,width:x1-x0,height:ch+8,fill:'transparent'},g);
  interact(hit,{label,down:p=>({x0:p.x,s0:s}),move:(p,p0,c)=>{if(!locked)set(c.s0+Math.round((c.x0-p.x)/cw))},tap:()=>{}});
  /* drag left one column = one place bigger; arrow keys too */
  hit.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowLeft'){e.preventDefault();set(s+1)}if(e.key==='ArrowRight'){e.preventDefault();set(s-1)}});
  show(false);
  return{g,dot,get:()=>s,val,set:v=>{s=v;show(false)},lock:b=>{locked=b},x1,cols}}

function flask(parent,x,y,label,good=true){const g=el('g',{transform:`translate(${x},${y})`},parent),inner=el('g',{},g);
  const col=good?'#b48cff':'#6fe3cd';el('circle',{cx:0,cy:12,r:40,fill:col,opacity:.12},inner);
  el('path',{d:'M-10,-44 h20 v24 q30,12 30,40 q0,26 -30,30 h-20 q-30,-4 -30,-30 q0,-28 30,-40Z',fill:'rgba(220,235,255,.18)',stroke:'#dfe6f0','stroke-width':2.5},inner);
  el('path',{d:'M-28,12 q0,-2 2,-4 h52 q2,2 2,4 q0,22 -28,26 h-6 q-22,-4 -22,-26Z',fill:col,opacity:.85},inner);
  for(let k=0;k<4;k++)el('circle',{cx:-12+k*8,cy:20-(k%2)*8,r:2.5,fill:'#fff',opacity:.5},inner);
  el('rect',{x:-13,y:-52,width:26,height:10,rx:3,fill:'#8a5a32'},inner);
  const tag=el('g',{transform:'translate(0,62)'},inner);el('rect',{x:-36,y:-14,width:72,height:28,rx:8,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2},tag);
  el('text',{y:7,'text-anchor':'middle','font-size':18,'font-weight':700,fill:'#3a2418'},tag).textContent=label;
  return{g,inner}}

W.potion={scene:'desk',
notes:`<p>Multiplying and dividing by 10 and 100, as growing and shrinking potions. A little creature is 0.6 cm tall; the bottle says × 10. Its height sits in a place-value chart (hundreds, tens, ones, Dot, tenths, hundredths). She drags the digits left or right (or uses the arrow keys) and presses Pour.</p>
<p>The key idea: × 10 moves every digit one place left, × 100 two places; ÷ moves them right. Dot never moves. He sits in his own column with a face, and the digits slide past him. Gold zeros appear by themselves in empty places (0.07, 120), so she sees why the zeros are there. The creature always grows or shrinks by the right amount, so a wrong answer is visible: "It grew to 6 cm, but your digits say 60." Then a new bottle.</p>
<p>2.5 × 10 is there for the old rule "just add a zero", which gives 2.50 (no change). Rounds: 0.6 × 10, 2.5 × 10, 34 ÷ 10, 0.07 × 100, 5 ÷ 100, 1.2 × 100.</p>`,
mount(root){
  const R=[{p:['0.6','0.4','0.9'],op:'×',k:10},{p:['2.5','3.5','1.5'],op:'×',k:10},{p:['34','27','46'],op:'÷',k:10},{p:['0.07','0.03','0.09'],op:'×',k:100},{p:['5','3','8'],op:'÷',k:100},{p:['1.2','1.5','2.4'],op:'×',k:100}];
  const S={r:0,busy:false,won:false,pi:{}};
  const qL=el('g',{},root),stage=el('g',{},root),chartL=el('g',{},root),ui=el('g',{},root);let kit=null,cr=null,fl=null,sizeL=null;
  const st=navStone({label:'Next potion',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this potion again',onTap:()=>load()});
  const goB=decGo(ui,540,472,'Pour the potion',pour,'Pour');
  const Q=()=>{const q=R[S.r],n=q.p[(S.pi[S.r]||0)%q.p.length],h=toH(n),ans=q.op==='×'?h*q.k:h/q.k;return Object.assign({n,h,ans,sh:(q.op==='×'?1:-1)*(q.k===10?1:2)},q)};
  const CX=118,FEET=246,R0=26;
  function sizeTag(v,col='#fff4e6'){sizeL.innerHTML='';const g=el('g',{transform:`translate(${CX},${FEET+28})`},sizeL);el('rect',{x:-58,y:-16,width:116,height:32,rx:10,fill:'#2a2245',stroke:'#c9a77a','stroke-width':2},g);
    const n=decNum(g,-12,0,fmtH(v),{sz:22,col});el('text',{x:n.x0+n.w+20,y:7,'text-anchor':'middle','font-size':15,'font-weight':700,fill:col},g).textContent='cm';popIn(g,.7)}
  const scaleFor=q=>q.op==='×'?(q.k===10?1.75:2.3):(q.k===10?.6:.42);
  function pour(){if(S.busy||S.won)return;const q=Q(),v=kit.val(),ok=v===q.ans;S.busy=true;kit.lock(true);goB.style.display='none';
    tween(500,(t,p)=>fl.inner.setAttribute('transform',`rotate(${(-62*t).toFixed(1)})`),()=>{SFX.glug();for(let k=0;k<9;k++)later(k*70,()=>{const d=el('circle',{r:4+k%3,fill:q.op==='×'?'#c9a8ff':'#8ff0c8'},FX);tween(520,(t,pp)=>{d.setAttribute('cx',lerp(431,CX+10,t).toFixed(1));d.setAttribute('cy',(lerp(129,FEET-60,t)-Math.sin(pp*Math.PI)*70).toFixed(1))},()=>{d.remove();if(k%3===0)SFX.plop()},ease.lin)});
      later(500,()=>{tween(500,(t)=>fl.inner.setAttribute('transform',`rotate(${(-62*(1-t)).toFixed(1)})`));SFX.shimmer();const s1=scaleFor(q);
        tween(900,(t)=>{const s=lerp(1,s1,t);cr.place(CX,FEET-R0*s,s)},()=>{sizeTag(q.ans,ok?'#fff0a0':'#fff4e6');ok?win(q):lose(q,v)},ease.back)})},ease.inOut)}
  function lose(q,v){SFX.wrong();cr.mood('oh');const d=kit.get()-q.sh;
    say(`It ${q.op==='×'?'grew':'shrank'} to ${fmtH(q.ans)} cm, but your digits say ${fmtH(v)}. ${q.op} ${q.k} moves every digit ${q.k===10?'one place':'two places'} ${q.op==='×'?'left':'right'}. A new bottle…`);
    S.pi[S.r]=(S.pi[S.r]||0)+1;later(3400,load)}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();cr.mood('happy');cr.hop(14);kit.dot.mood('happy');
    starterQ(qL,[['w',q.n],['o',q.op],['w',q.k],['o','='],['w',fmtH(q.ans)]],true);
    const pl=q.k===10?'one place':'two places',dir=q.op==='×'?'left':'right';
    say(S.r===1?`${fmtH(q.ans)}, not ${q.n}0! Every digit moved ${pl} ${dir}. Dot stayed put.`:q.ans<100&&q.op==='÷'?`Every digit moved ${pl} right. Gold zeros fill the empty places: ${fmtH(q.ans)}.`:`Every digit moved ${pl} ${dir}. Dot stayed put: ${fmtH(q.ans)}!`);
    if(S.r>=2)unlock('shift');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';stage.innerHTML='';chartL.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';
    sizeL=el('g',{},stage);cr=creature(stage,{x:CX,y:FEET-R0,r:R0,i:[3,5,8,1,6,0][S.r],label:'The potion taster'});sizeTag(q.h);
    fl=flask(stage,470,150,`${q.op} ${q.k}`,q.op==='×');
    el('text',{x:300,y:186,'text-anchor':'middle','font-size':15,fill:'#d8c6e4','font-style':'italic'},stage).textContent=q.op==='×'?`grows ${q.k} times bigger`:`shrinks to one ${q.k===10?'tenth':'hundredth'} of its size`;
    kit=pvKit(chartL,{x0:39,y:330,num:q.n});
    starterQ(qL,[['w',q.n],['o',q.op],['w',q.k],['o','='],['o','?']]);
    say(S.r===0?`This creature is ${q.n} cm tall. The potion makes it 10 times bigger. Drag the digits, then Pour.`:q.op==='÷'?`A shrinking potion: ${q.op} ${q.k}. Slide the digits to show the new size, then Pour.`:`${q.n} cm, and a ${q.op} ${q.k} potion. Slide the digits, then Pour.`)}
  S.r=resumeAt(R.length);load();
}};
