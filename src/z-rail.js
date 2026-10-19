/* ---------- 4. Ribbon railway: how long is the journey? ---------- */
const RIB={60:{col:'#ff9ed2',name:'an hour'},30:{col:'#8fd6ff',name:'half an hour'},15:{col:'#ffd23a',name:'a quarter of an hour'}};
/* ribbons wrapped round a clock from the start time: each lap goes on a wider ring */
function ribbonRing(parent,ck){const g=el('g',{},parent);let list=[],t0=0;
  const arc=(a0,a1,R)=>{const p=a=>[(ck.x+Math.sin(a*Math.PI/180)*R).toFixed(1),(ck.y-Math.cos(a*Math.PI/180)*R).toFixed(1)];const [x0,y0]=p(a0),[x1,y1]=p(a1);return `M${x0},${y0} A${R},${R} 0 ${a1-a0>180?1:0} 1 ${x1},${y1}`};
  const draw=()=>{g.innerHTML='';let m=t0;list.forEach((d,i)=>{let left=d;while(left>0){const a0=(m%60)*6,lap=Math.floor((m-t0)/60),R=ck.r+16+lap*13,piece=Math.min(left,60-(m%60));const a1=a0+piece*6;
      el('path',{d:arc(a0,a1-0.6,R),fill:'none',stroke:RIB[d].col,'stroke-width':11,'stroke-linecap':'butt',opacity:.95},g);el('path',{d:arc(a0,a1-0.6,R),fill:'none',stroke:darker(RIB[d].col,.7),'stroke-width':1.5,'stroke-dasharray':'2 5'},g);m+=piece;left-=piece}
      const a=(m%60)*6*Math.PI/180,R=ck.r+16+Math.floor((m-t0-1)/60)*13;el('circle',{cx:ck.x+Math.sin(a)*R,cy:ck.y-Math.cos(a)*R,r:5,fill:'#fff',stroke:darker(RIB[d].col,.6),'stroke-width':2},g)})};
  return{g,start(t){t0=t;list=[];draw()},add(d){if(list.reduce((a,b)=>a+b,0)+d>240)return false;list.push(d);draw();return true},pop(){list.pop();draw()},sum:()=>list.reduce((a,b)=>a+b,0),list:()=>list.slice()}}
function trainFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);el('rect',{x:-30,y:-22,width:44,height:26,rx:5,fill:'#e8413e',stroke:'#8a2424','stroke-width':2},b);el('rect',{x:10,y:-14,width:20,height:18,rx:4,fill:'#c9413a',stroke:'#8a2424','stroke-width':2},b);
  el('rect',{x:-24,y:-17,width:12,height:9,rx:2,fill:'#e8f4ff'},b);el('rect',{x:-8,y:-17,width:12,height:9,rx:2,fill:'#e8f4ff'},b);el('rect',{x:16,y:-28,width:8,height:14,fill:'#3a2418'},b);[-20,-2,20].forEach(x=>el('circle',{cx:x,cy:6,r:6,fill:'#3a2418'},b));return g}

W.rail={scene:'railway',
notes:`<p>How long is a journey, without sums: the time between two clocks is a length round the clock face. The big clock shows when the train leaves; the little one when it arrives. She lays ribbons round the big clock from the leaving time: a pink ribbon is an hour (a whole lap), blue is half an hour, yellow a quarter. The ribbons have to finish where the arriving clock's minute hand is, and the short hand says how many whole laps. Go: the train runs along the ribbons. Last, turned round: the ribbons are given and she winds the arriving clock round herself.</p>
<p>Rounds: 2 o'clock to 3 o'clock (one lap), 4 to half past 4, quarter past 9 to 10 (three quarters), half past 1 to 3, quarter to 12 to quarter past 1 (past 12 o'clock), and winding on an hour and a quarter from half past 2.</p>`,
mount(root){
  const R=[
    {v:[{a:120,b:180},{a:300,b:360}]},
    {v:[{a:240,b:270},{a:450,b:480}]},
    {v:[{a:555,b:600},{a:135,b:180}]},
    {v:[{a:90,b:180},{a:390,b:480}]},
    {v:[{a:705,b:795},{a:675,b:765}]},
    {v:[{a:150,b:225,wind:[60,15]},{a:615,b:705,wind:[60,30]}]}];
  const S={r:0,busy:false,won:false,pi:{}};
  const scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let big=null,small=null,rib=null;
  const st=navStone({label:'Next journey',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this journey again',onTap:()=>load()});
  /* after two misses, a fresh journey of the same kind */
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;let q=rr.v[pi];if(!q){const b=rr.v[0],k=pi*7+S.r*5,d=[45,90,60,75,30,105][k%6],a=[120,195,450,270,555,30][k%6];q=b.wind?{a,b:a+d,wind:d>=60?[60,...(d-60?[d-60]:[])]:[d]}:{a,b:a+d}}return Object.assign({},q,{d:q.b-q.a})};
  const parts=(q,done)=>[['t',q.wind?'arrives':'the journey'],['o','='],done?['w','✓']:['o','?']];
  function runTrain(q,done){const tr=trainFig(scene,.8),x0=60,x1=420;tr.setAttribute('transform',`translate(${x0},468)`);SFX.rumble&&SFX.rumble();
    big.glide(q.b,1400);tween(1400,(t,p)=>tr.setAttribute('transform',`translate(${lerp(x0,x1,ease.inOut(p)).toFixed(1)},468)`),done)}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(240,300,{n:16});say(msg);if(S.r>=2)unlock('trail');later(1400,()=>st.ready(true))}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new journey…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(q.wind){const t=small.get();if(t!==q.b){miss(t<q.b?'Not there yet: wind on a bit more.':'Too far: the train got there before that.');return}S.busy=true;win(q,capF(`${spanWords(q.d)} after ${tWords(q.a)} is ${tWords(q.b)}.`));return}
    const s=rib.sum();if(!s){say('Lay some ribbons round the big clock first.');return}
    if(s!==q.d){miss(s<q.d?'Too short: the ribbons stop before the train arrives.':'Too long: the train arrives before the ribbons end.');return}
    S.busy=true;runTrain(q,()=>{S.busy=false;win(q,`The journey takes ${spanWords(q.d)}: ${tWords(q.a)} to ${tWords(q.b)}.`)})}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    el('rect',{x:30,y:478,width:440,height:6,fill:'#7a5a4a'},scene);for(let x=36;x<470;x+=18)el('rect',{x,y:474,width:8,height:14,fill:'#a8744a'},scene);
    [['leaves',60],['arrives',420]].forEach(([t,x])=>{el('rect',{x:x-26,y:440,width:52,height:20,rx:4,fill:'#fff4e6',stroke:'#7a5a4a','stroke-width':2},scene);el('text',{x,y:455,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#3a2418'},scene).textContent=t});
    big=clockKit(scene,{x:236,y:282,r:92});big.set(q.a);el('text',{x:236,y:422,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},scene).textContent='leaves';
    const SR=q.wind?66:50,SY=q.wind?280:206;small=clockKit(ui,{x:528,y:SY,r:SR,nums:true});small.set(q.wind?q.a:q.b);el('text',{x:528,y:SY-SR-14,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},ui).textContent='arrives';
    rib=ribbonRing(scene,big);rib.start(q.a);
    if(q.wind){q.wind.forEach(d=>rib.add(d));dragWind(small,{snap:15,min:q.a,max:q.a+240,label:'Arriving clock: wind it on',can:()=>!S.busy&&!S.won});
      say('The ribbons show how long. Wind the arriving clock on.')}
    else{[[60,'An hour'],[30,'Half an hour'],[15,'A quarter']].forEach(([d,lab],i)=>{const b=el('g',{transform:`translate(530,${300+i*50})`},ui);el('rect',{x:-58,y:-19,width:116,height:38,rx:10,fill:RIB[d].col,stroke:darker(RIB[d].col,.6),'stroke-width':2.5},b);
        el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#3a2418'},b).textContent=lab;interact(b,{label:`Ribbon: ${lab.toLowerCase()}`,tap:()=>{if(S.busy||S.won)return;if(rib.add(d))SFX.pop(1.1)}})});
      const un=el('g',{transform:'translate(530,446)'},ui);el('rect',{x:-40,y:-14,width:80,height:28,rx:9,fill:'#3a3058',stroke:'#c9a24a','stroke-width':2},un);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff4e6'},un).textContent='take one off';
      interact(un,{label:'Take a ribbon off',tap:()=>{if(S.busy||S.won)return;rib.pop();SFX.pop(.8)}});
      say(S.r===0?'How long is the journey? Wrap ribbons round the big clock from leaving to arriving. Go!':'Wrap ribbons from leaving to arriving. Go!')}
    decGo(ui,540,500,q.wind?'Check':'Go: run the train',check,q.wind?'Check':'Go')}
  W.rail.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
