/* ---------- 6. Saving up: the same amount, week after week ---------- */
function prizeFig(parent,x,y,kind,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  if(kind==='bike'){[-22,22].forEach(dx=>el('circle',{cx:dx,cy:10,r:15,fill:'none',stroke:'#241a3a','stroke-width':4},g));el('path',{d:'M-22,10 L-6,-12 L16,-12 L22,10 M-6,-12 L2,10 L16,-12 M-10,-18 h10 M14,-12 l4,-10 h8',fill:'none',stroke:'#e8413e','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'},g)}
  else if(kind==='tent'){el('path',{d:'M-34,22 L0,-28 L34,22Z',fill:'#3aa86a',stroke:'#1a5a3a','stroke-width':3},g);el('path',{d:'M0,-28 L-8,22 H8Z',fill:'#1a5a3a'},g)}
  else if(kind==='board'){el('rect',{x:-36,y:-6,width:72,height:12,rx:6,fill:'#9a6cff',stroke:'#4a2a8a','stroke-width':2.5},g);[-22,22].forEach(dx=>el('circle',{cx:dx,cy:12,r:6,fill:'#ffd23a',stroke:'#7a5a2a','stroke-width':2},g))}
  else{el('rect',{x:-30,y:-10,width:52,height:16,rx:4,fill:'#4aa0ff',stroke:'#1a4a8a','stroke-width':2.5,transform:'rotate(-20)'},g);el('path',{d:'M-4,8 L-16,30 M-4,8 L8,30 M-4,8 V30',stroke:'#3a2418','stroke-width':3},g)}
  return g}

W.save={scene:'cove',
notes:`<p>Saving up: the same money goes into the jar every week, and the jar has a line at the price of the prize. She plants a flag on the week she thinks the jar will first reach the line, then presses Go and the weeks play out. Right if the jar reaches the line exactly on her week; it shows her if it got there sooner or not yet. Later rounds: money already in the jar, a week that doesn't land neatly on the line, a treat every few weeks that takes some out, two savers putting in together, and one the other way round: the prize in 9 weeks, so how much each week? (She puts that week's coins in the dish.)</p>`,
mount(root){
  /* wk: saved each week (pence), wk2: a second saver, start: already in the jar, treat:[every n weeks, cost], weeks: fixed weeks (she chooses the weekly amount) */
  const R=[
    {v:[{wk:400,price:2000,prize:'bike'},{wk:300,price:1800,prize:'bike'},{wk:500,price:3000,prize:'bike'}]},
    {v:[{wk:500,price:3200,prize:'board'},{wk:400,price:2200,prize:'board'},{wk:300,price:2000,prize:'board'}]},
    {v:[{wk:300,price:2300,start:500,prize:'scope'},{wk:400,price:3000,start:1000,prize:'scope'},{wk:500,price:3500,start:500,prize:'scope'}]},
    {v:[{wk:500,price:3000,treat:[3,200],prize:'bike'},{wk:400,price:2000,treat:[2,100],prize:'bike'},{wk:600,price:3000,treat:[3,300],prize:'bike'}]},
    {v:[{wk:400,wk2:200,price:3000,prize:'tent'},{wk:300,wk2:100,price:2400,prize:'tent'},{wk:500,wk2:100,price:3000,prize:'tent'}]},
    {v:[{weeks:9,price:4500,prize:'tent',purse:[200,200,100,100,100,50,50,20]},{weeks:8,price:3200,prize:'tent',purse:[200,200,100,100,50,50,20,20]},{weeks:6,price:3000,prize:'tent',purse:[200,200,200,100,50,50,20]}]}];
  const S={r:0,busy:false,won:false,pi:{},flag:0,dish:[],purse:[]};
  const scene=el('g',{},root),jarL=el('g',{},root),card=el('g',{},root),cal=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pollyGuide(ui);
  const st=navStone({label:'Next prize',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this prize again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r];return rr.v[(S.pi[S.r]||0)%rr.v.length]};
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const NW=12,JX=150,JB=440,JH=270;
  const weekly=q=>q.weeks?sum(S.dish):q.wk+(q.wk2||0);
  /* the jar after each week: [start, after week 1, ...] */
  const track=(q,n)=>{let v=q.start||0;const out=[v];for(let w=1;w<=n;w++){v+=weekly(q);if(q.treat&&w%q.treat[0]===0)v-=q.treat[1];out.push(v)}return out};
  const reachWeek=q=>{const t=track(q,40);return t.findIndex(v=>v>=q.price)};
  const parts=(q,done)=>q.weeks?[['t','each week'],['o','='],done?['w',fmtP(sum(S.dish))]:['o','?']]:[['t','weeks'],['o','='],done?['w',String(S.flag)]:['o','?']];
  let jarSc=1,fillG=null;
  function drawJar(v=null){jarL.innerHTML='';const q=Q();jarSc=JH/(q.price*1.3);const lineY=JB-q.price*jarSc;
    el('path',{d:`M${JX-60},${JB-JH-10} V${JB-8} q0,10 10,10 H${JX+50} q10,0 10,-10 V${JB-JH-10}`,fill:'rgba(220,240,255,.45)',stroke:'#fff','stroke-width':4},jarL);
    el('rect',{x:JX-66,y:JB-JH-24,width:132,height:16,rx:5,fill:'#c9813a',stroke:'#7a4a2e','stroke-width':2},jarL);
    fillG=el('g',{},jarL);if(v!=null)fillTo(v);
    el('line',{x1:JX-74,x2:JX+74,y1:lineY,y2:lineY,stroke:'#e8413e','stroke-width':3,'stroke-dasharray':'8 5'},jarL);
    prizeFig(jarL,JX+120,lineY-6,q.prize,1.1);kgTag(jarL,JX+120,lineY+34,fmtP(q.price))}
  function fillTo(v,flash){fillG.innerHTML='';const h=Math.max(0,v)*jarSc;el('rect',{x:JX-56,y:JB-h,width:112,height:h,fill:'#ffd23a',stroke:'#a8743a','stroke-width':1.5},fillG);
    for(let y=JB-12;y>JB-h+4;y-=12)el('line',{x1:JX-56,x2:JX+56,y1:y,y2:y,stroke:'#e8b020','stroke-width':1.5},fillG);if(flash)el('rect',{x:JX-56,y:JB-h,width:112,height:8,fill:flash},fillG)}
  function drawCard(){card.innerHTML='';const q=Q(),X=404,Y=150;
    el('rect',{x:X-8,y:Y-28,width:200,height:q.weeks?226:q.treat||q.wk2||q.start?170:110,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},card);
    el('text',{x:X+92,y:Y-8,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},card).textContent=q.weeks?'each week, in the dish':'every week';
    const coinsFor=v=>{const out=[];let r=v;[500,200,100,50,20,10].forEach(c=>{while(r>=c){out.push(c);r-=c}});return out};
    let y=Y+26;
    if(q.weeks){const g=el('g',{},card);el('ellipse',{cx:X+92,cy:y+6,rx:86,ry:22,fill:'#e8d8c0',stroke:'#a8743a','stroke-width':2},g);
      S.dish.forEach((v,i)=>{const c=moneyPiece(g,X+30+i*30,y+4,v,{s:1});interact(c,{label:`Coin ${fmtP(v)} (dish)`,tap:()=>{if(S.busy||S.won)return;S.purse.push(S.dish.splice(i,1)[0]);SFX.pop(.8);drawCard()}})});
      el('text',{x:X+92,y:y+52,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#7a5a3a'},card).textContent='your purse';
      [...S.purse].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).forEach(([v,i],k)=>{const c=moneyPiece(card,X+14+(k%6)*34,y+78+Math.floor(k/6)*34,v,{s:1.05});interact(c,{label:`Coin ${fmtP(v)} (purse)`,tap:()=>{if(S.busy||S.won)return;if(S.dish.length>=6)return;S.dish.push(S.purse.splice(i,1)[0]);SFX.clink&&SFX.clink();drawCard()}})});return}
    const row=(who,v)=>{if(who)el('text',{x:X+2,y:y+5,'font-size':13,'font-weight':800,fill:'#3a2418'},card).textContent=who;coinsFor(v).forEach((c,i)=>moneyPiece(card,X+(who?70:40)+i*34,y,c,{s:1.1}));y+=40};
    if(q.wk2){row('Polly',q.wk);row('Pip',q.wk2)}else row('',q.wk);
    if(q.start){el('text',{x:X+2,y:y+5,'font-size':13,'font-weight':800,fill:'#3a2418'},card).textContent='in the jar';moneyPiece(card,X+120,y,q.start>=500?q.start:q.start,{s:1.1});y+=40}
    if(q.treat){el('text',{x:X+2,y:y+5,'font-size':13,'font-weight':800,fill:'#7a2424'},card).textContent=`every ${q.treat[0]===2?'2nd':'3rd'} week`;sweetFig(card,X+118,y,'lolly',.7);
      el('text',{x:X+142,y:y+5,'font-size':14,'font-weight':800,fill:'#7a2424'},card).textContent=`−${fmtP(q.treat[1])}`}}
  function drawCal(hi=0){cal.innerHTML='';const q=Q(),X0=46,DX=34,Y=480;
    for(let w=1;w<=NW;w++){const x=X0+(w-1)*DX,g=el('g',{transform:`translate(${x},${Y})`},cal),tr=q.treat&&w%q.treat[0]===0;
      el('rect',{x:-15,y:-18,width:30,height:36,rx:5,fill:w<=hi?'#ffe8a0':'#fff4e6',stroke:S.flag===w?'#e8413e':'#a8743a','stroke-width':S.flag===w?3:1.5},g);
      el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},g).textContent=w;if(tr)sweetFig(g,9,-12,'lolly',.32);
      if(S.flag===w){el('line',{x1:0,x2:0,y1:-20,y2:-54,stroke:'#3a2418','stroke-width':2.5},g);el('path',{d:'M0,-54 L20,-47 L0,-40Z',fill:'#e8413e'},g)}
      if(!q.weeks)interact(g,{label:`Week ${w}`,tap:()=>{if(S.busy||S.won)return;S.flag=w;SFX.tick(w%8);drawCal()}})}
    el('text',{x:X0-15,y:Y-26,'font-size':12,'font-weight':800,fill:'#3a2418'},cal).textContent='weeks'}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new prize…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4500,load)}
  function go(){if(S.busy||S.won)return;const q=Q();if(q.weeks){if(!S.dish.length){say('Put a week’s coins in the dish first.');return}S.flag=q.weeks}else if(!S.flag){say('Plant your flag on a week first.');return}
    const rw=reachWeek(q),stop=q.weeks?q.weeks:Math.min(S.flag,rw<0?S.flag:rw),t=track(q,stop);S.busy=true;drawCal();
    let w=0;const step=()=>{w++;if(w>stop){done();return}const v0=t[w-1],tr=q.treat&&w%q.treat[0]===0,mid=v0+weekly(q);drawCal(w);
      tween(380,(tt,p)=>fillTo(v0+(mid-v0)*p),()=>{SFX.clink&&SFX.clink();if(tr){SFX.crunch?SFX.crunch():SFX.pop();tween(300,(tt,p)=>fillTo(mid-q.treat[1]*p,'#e8413e'),()=>later(160,step))}else later(160,step)})};
    const done=()=>{const v=t[stop];if(q.weeks&&v!==q.price){miss(v<q.price?`Not up to the line by week ${q.weeks}.`:`Past the line by week ${q.weeks}: that’s more than you need each week.`);return}if(stop<S.flag){miss(`The jar reached the line in week ${stop}, sooner than your flag!`);return}
      if(v<q.price){miss(q.weeks?`After ${q.weeks} weeks the jar is still under the line.`:`Week ${stop}: not up to the line yet.`);return}
      S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(JX,JB-q.price*jarSc,{n:16,cols:['#ffd23a','#fff0a0']});
      const spare=v-q.price;say(q.weeks?`${fmtP(sum(S.dish))} a week for ${q.weeks} weeks reaches the line!`:`Week ${stop}: enough!${spare?` ${fmtP(spare)} to spare.`:''}`);if(S.r>=2)unlock('msave');later(1400,()=>st.ready(true))};
    step()}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,flag:q.weeks||0,dish:[],purse:[...(q.purse||[])]});
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);drawJar(q.start||0);drawCard();drawCal();decGo(ui,560,500,'Go: play the weeks',go,'Go');
    const nm={bike:'bike',board:'skateboard',scope:'telescope',tent:'tent'}[q.prize];
    say(q.weeks?`Save up to buy the ${nm} in exactly ${q.weeks} weeks. How much must you save each week? Fill the dish, then Go.`:`${q.wk2?'Polly and Pip save up together':'Save up'} to buy the ${nm}. How many weeks will it take?${S.r===0?' Tap a week to plant your flag, then Go.':q.treat?' Watch out for treat weeks!':''}`)}
  W.save.dbgQ=()=>{const q=Q();return{...q,reach:reachWeek(q),r:S.r}};S.r=resumeAt(R.length);load();
}};
