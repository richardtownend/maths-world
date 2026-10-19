/* ---------- 5. Sand timers: cooking forwards and backwards ---------- */
const TMR={60:{h:92,name:'an hour',col:'#ff9ed2'},30:{h:66,name:'half an hour',col:'#8fd6ff'},15:{h:46,name:'a quarter',col:'#ffd23a'}};
function sandTimer(parent,x,y,d,{s=1}={}){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent),H=TMR[d].h,w=H*.42,top=el('g',{},g);
  el('rect',{x:-w/2-4,y:-H,width:w+8,height:7,rx:2,fill:TMR[d].col,stroke:darker(TMR[d].col,.6),'stroke-width':1.5},g);el('rect',{x:-w/2-4,y:-7,width:w+8,height:7,rx:2,fill:TMR[d].col,stroke:darker(TMR[d].col,.6),'stroke-width':1.5},g);
  el('path',{d:`M${-w/2},${-H+6} Q${-w/2},${-H/2-4} -3,${-H/2} Q${-w/2},${-H/2+4} ${-w/2},-6 H${w/2} Q${w/2},${-H/2+4} 3,${-H/2} Q${w/2},${-H/2-4} ${w/2},${-H+6}Z`,fill:'#e8f4ff',stroke:'#8aa0b8','stroke-width':1.5,opacity:.9},g);
  const sand=el('g',{},g);const fill=p=>{sand.innerHTML='';const tp=(1-p)*(H/2-12),bt=p*(H/2-12);if(tp>0)el('path',{d:`M${-w/2+4},${-H/2-tp-4} H${w/2-4} L2,${-H/2-2} H-2Z`,fill:'#ffd23a'},sand);if(bt>0)el('path',{d:`M${-w/2+4},-8 H${w/2-4} L${w/2*.4},${-8-bt} H${-w/2*.4}Z`,fill:'#ffd23a'},sand)};fill(0);
  return{g,run(ms,done){tween(ms,(t,p)=>fill(p),()=>{fill(1);done&&done()})},fill}}
function dishPic(parent,x,y,kind){const g=el('g',{transform:`translate(${x},${y})`},parent);
  if(kind==='cake'){el('rect',{x:-22,y:-14,width:44,height:24,rx:4,fill:'#f4c8a0',stroke:'#a8743a','stroke-width':2},g);el('path',{d:'M-22,-10 q11,-10 22,0 q11,-10 22,0',fill:'#ff9ed2'},g);el('rect',{x:-2,y:-30,width:4,height:14,fill:'#8fd6ff'},g);el('path',{d:'M0,-36 q4,4 0,6 q-4,-2 0,-6',fill:'#ffc04d'},g)}
  else if(kind==='pie'){el('path',{d:'M-26,4 Q0,-24 26,4Z',fill:'#e8b870',stroke:'#a8743a','stroke-width':2},g);el('rect',{x:-28,y:2,width:56,height:10,rx:4,fill:'#c98a4a'},g);[-10,0,10].forEach(dx=>el('path',{d:`M${dx},-12 l3,6`,stroke:'#a8743a','stroke-width':2},g))}
  else if(kind==='soup'){el('path',{d:'M-26,-4 H26 Q24,18 0,20 Q-24,18 -26,-4Z',fill:'#fff4e6',stroke:'#8a6a4a','stroke-width':2},g);el('ellipse',{cy:-4,rx:24,ry:5,fill:'#e8813e'},g);[-8,6].forEach(dx=>el('path',{d:`M${dx},-12 q-4,-6 0,-12 q4,-6 0,-12`,stroke:'#c9c0d0','stroke-width':2,fill:'none'},g))}
  else{el('ellipse',{cy:0,rx:26,ry:16,fill:'#d89a5a',stroke:'#a8743a','stroke-width':2},g);[-12,0,12].forEach(dx=>el('path',{d:`M${dx-5},-8 q5,6 10,0`,stroke:'#a8743a','stroke-width':2,fill:'none'},g))}
  return g}
const dishName={cake:'cake',pie:'pie',soup:'soup',bread:'bread'};

W.sand={scene:'kitchen',
notes:`<p>Elapsed time with sand timers instead of numbers. The big timer runs for an hour, the middle one half an hour, the small one a quarter. A recipe card shows which timers a dish needs. Forwards: it goes in the oven at 3 o'clock and needs the middle timer, so she winds the "ready" clock on. Backwards (the hard way round): it must be ready when the dinner bell rings at 6 and needs the big timer, so she winds the "in the oven" clock back from 6. Go runs the timers and spins the clock to see if it's right. And once she picks the timers herself to fill the gap between two clocks.</p>`,
mount(root){
  /* fwd: wind the ready clock on; back: wind the start clock back; pick: choose timers for the gap */
  const R=[
    {v:[{k:'fwd',a:180,tm:[30],dish:'cake'},{k:'fwd',a:300,tm:[30],dish:'bread'}]},
    {v:[{k:'fwd',a:255,tm:[60,15],dish:'pie'},{k:'fwd',a:135,tm:[60,15],dish:'cake'}]},
    {v:[{k:'back',b:360,tm:[60],dish:'pie'},{k:'back',b:420,tm:[60],dish:'bread'}]},
    {v:[{k:'back',b:30,tm:[30,15],dish:'soup'},{k:'back',b:390,tm:[30,15],dish:'cake'}]},
    {v:[{k:'pick',a:120,b:195,dish:'bread'},{k:'pick',a:270,b:360,dish:'pie'}]},
    {v:[{k:'back',b:420,tm:[60,30],dish:'cake'},{k:'back',b:330,tm:[60,30],dish:'soup'}]}];
  const S={r:0,busy:false,won:false,pi:{},picked:[]};
  const scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let A=null,B=null,card=null;
  const st=navStone({label:'Next dish',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this dish again',onTap:()=>load()});
  /* after two misses, a fresh dish of the same kind */
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;let v=rr.v[pi];if(!v){const b=rr.v[0],k=pi*7+S.r*3,tms=[[30],[60],[60,15],[30,15],[60,30]][k%5],x=[165,240,330,405,120][k%5];v=b.k==='pick'?{k:'pick',a:x,b:x+[45,75,90][k%3],dish:'soup'}:b.k==='fwd'?{k:'fwd',a:x,tm:tms,dish:'bread'}:{k:'back',b:x+120,tm:tms,dish:'pie'}}const q=Object.assign({},v);if(q.k==='pick')q.tm=null;const d=q.tm?q.tm.reduce((x,y)=>x+y,0):q.b-q.a;if(q.k==='fwd')q.b=q.a+d;if(q.k==='back')q.a=q.b-d;return Object.assign(q,{d})};
  const parts=(q,done)=>[['t',q.k==='fwd'?'ready at':q.k==='back'?'in the oven at':'the timers'],['o','='],done?['w','✓']:['o','?']];
  function drawCard(q){if(card)card.remove();card=el('g',{},scene);const tm=q.k==='pick'?S.picked:q.tm,w=Math.max(150,70+tm.length*44);
    el('rect',{x:240-w/2,y:126,width:w,height:118,rx:12,fill:'#fff8ec',stroke:'#c9a77a','stroke-width':3},card);el('text',{x:240,y:146,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#7a4a2e'},card).textContent=`${dishName[q.dish]}`;
    dishPic(card,240-w/2+38,200,q.dish);tm.forEach((d,i)=>{const t=sandTimer(card,240-w/2+92+i*44,226,d,{s:.85});el('text',{x:240-w/2+92+i*44,y:238,'text-anchor':'middle','font-size':9,'font-weight':800,fill:darker(TMR[d].col,.5)},card).textContent=TMR[d].name.replace('half an hour','half').replace('a quarter','quarter').replace('an hour','hour');if(q.k==='pick')interact(t.g,{label:`Recipe timer ${TMR[d].name}`,tap:()=>{if(S.busy||S.won)return;S.picked.splice(i,1);SFX.pop(.8);drawCard(q)}})});
    if(q.k==='pick'&&!tm.length)el('text',{x:270,y:206,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#a8743a'},card).textContent='add timers →'}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();bell(noteHz(9),.08,1.4);guide.cheer();decQ(qL,parts(q,true),true,guide);burst(240,330,{n:16});say(msg);if(S.r>=2)unlock('tsand');later(1400,()=>st.ready(true))}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new dish…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4400,load)}
  function check(){if(S.busy||S.won)return;const q=Q();
    const d=q.k==='pick'?S.picked.reduce((x,y)=>x+y,0):q.d,start=q.k==='back'?A.get():q.a,end=q.k==='fwd'?B.get():q.b;
    if(q.k==='pick'&&!d){say('Tap timers to add them to the recipe card first.');return}
    S.busy=true;/* run the timers one after another while a ghost clock ticks on from the start */
    const tms=q.k==='pick'?S.picked:q.tm,gh=B;gh.set(start);let k=0,t=start;
    const ts=[...card.querySelectorAll('g')];const next=()=>{if(k>=tms.length){done();return}const dd=tms[k];k++;SFX.whoosh&&SFX.whoosh();gh.glide(t+dd,dd*16,()=>{t+=dd;next()})};next();
    function done(){const ok=start+d===end;if(ok){win(q,capF(q.k==='back'?`In the oven at ${tWords(start)}: ${spanWords(d)} later it’s ${tWords(end)}. Ding!`:q.k==='fwd'?`${spanWords(d)} after ${tWords(start)} is ${tWords(end)}. Ding!`:`${spanWords(d)} fills the gap from ${tWords(q.a)} to ${tWords(q.b)}. Ding!`));return}
      miss(q.k==='pick'?(d<q.d?'Not enough timers: it isn’t ready yet.':'Too many timers: it would burn!'):start+d<end?'The timers finish too early.':'The timers aren’t finished yet when the bell rings.')}}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';card=null;[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,picked:[]});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    el('rect',{x:30,y:440,width:440,height:12,rx:4,fill:'#7a4a2e'},scene);
    A=clockKit(scene,{x:150,y:352,r:66});B=clockKit(scene,{x:340,y:352,r:66});
    el('text',{x:150,y:446+28,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},scene).textContent='in the oven';
    const bl=el('g',{transform:'translate(340,474)'},scene);el('text',{x:10,y:0,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},bl).textContent='ready';el('path',{d:'M-38,-12 q8,-12 16,0 v4 h-16z',fill:'#ffc04d',stroke:'#a8743a','stroke-width':1.5},bl);
    el('path',{d:q.k==='back'?'M266,352 H220 M228,344 L220,352 L228,360':'M220,352 H266 M258,344 L266,352 L258,360',stroke:q.k==='back'?'#c9413a':'#7a4a2e','stroke-width':4,fill:'none','stroke-linecap':'round'},scene);if(q.k==='back')el('text',{x:243,y:338,'text-anchor':'middle','font-size':11,'font-weight':800,fill:'#c9413a'},scene).textContent='back';
    drawCard(q);
    if(q.k==='fwd'){A.set(q.a);B.set(q.a);dragWind(B,{snap:15,min:q.a,max:q.a+240,label:'Ready clock: wind it on',can:()=>!S.busy&&!S.won});say(`In at ${tWords(q.a)}. Wind the ready clock on.`)}
    else if(q.k==='back'){A.set(q.b);B.set(q.b);dragWind(A,{snap:15,min:q.b-240,max:q.b,label:'Oven clock: wind it back',can:()=>!S.busy&&!S.won});say(`Ready by ${tWords(q.b)}. Wind the oven clock back.`)}
    else{A.set(q.a);B.set(q.b);[60,30,15].forEach((d,i)=>{const tx=[492,538,578][i],t=sandTimer(ui,tx,400,d);el('text',{x:tx,y:418,'text-anchor':'middle','font-size':12,'font-weight':800,fill:darker(TMR[d].col,.5)},ui).textContent=['hour','half','quarter'][i];
        interact(t.g,{label:`Timer: ${TMR[d].name}`,tap:()=>{if(S.busy||S.won||S.picked.length>=6)return;S.picked.push(d);SFX.pop(1.1);drawCard(q)}})});say('Which timers fill the gap? Tap them onto the card, then Go.')}
    decGo(ui,540,500,'Go: run the timers',check,'Go')}
  W.sand.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
