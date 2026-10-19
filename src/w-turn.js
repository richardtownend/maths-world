
/* ---------- 1. Turn: an angle is an amount of turn ---------- */
const kindOf=a=>{a=Math.abs(a);return a===360?'a whole turn':a>180?'a reflex angle':a===180?'a half turn (a straight angle)':a>90?'an obtuse angle':a===90?'a right angle (a quarter turn)':'an acute angle'};
const kindShort=a=>kindOf(a).split(' (')[0];
const turnWhy=a=>{const b=Math.abs(a);if(a===-90)return '90° left is a quarter turn the other way: anticlockwise.';return b===45?'45° is half a quarter turn.':b===90?'90° is a quarter turn.':b===135?'135° is a quarter turn (90°) and half a quarter more (45°).':b===180?'180° is a half turn: face the other way.':b===270?'270° is three quarter turns.':b===120?'120° is a quarter turn and a third of a quarter more.':`${b}° is ${b/90} quarter turns.`};
/* a turning ring round Shelly, marked every 15° from where she started */
function turnKit(parent,{cx,cy,R=120,start=0,left=false,label='Turning ring: drag round to turn Shelly',onTurn}){
  const g=el('g',{},parent),arcL=el('g',{},g),ring=el('g',{transform:`translate(${cx},${cy}) rotate(${start})`},g),shL=el('g',{},g),knL=el('g',{},g);let T=0,locked=false;
  el('circle',{cx,cy,r:R+22,fill:'rgba(10,30,50,.35)'},g);g.insertBefore(g.lastChild,arcL);
  el('circle',{r:R,fill:'none',stroke:'#e8f4ff','stroke-width':3,opacity:.75},ring);
  for(let a=0;a<360;a+=15){const big=a%90===0,mid=a%45===0,L=big?18:mid?12:6,[x,y]=dirV(a);el('line',{x1:x*R,y1:y*R,x2:x*(R-L),y2:y*(R-L),stroke:'#e8f4ff','stroke-width':big?3.5:mid?2.5:1.5,opacity:big?1:.75},ring)}
  (left?[[0,'0°'],[270,'90°'],[180,'180°'],[90,'270°']]:[[0,'0°'],[90,'90°'],[180,'180°'],[270,'270°']]).forEach(([a,t])=>{const [x,y]=dirV(a),lg=el('g',{transform:`translate(${(x*(R+34)).toFixed(1)},${(y*(R+34)).toFixed(1)}) rotate(${-start})`},ring);
    el('rect',{x:-21,y:-11,width:42,height:21,rx:8,fill:left?'#14605a':'#0e3a4e',opacity:.9},lg);el('text',{y:5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff4e6'},lg).textContent=t});
  {const [x,y]=dirV(0);el('path',{d:`M${x*(R-26)-6},${y*(R-26)+4} L${x*(R-26)},${y*(R-26)-6} L${x*(R-26)+6},${y*(R-26)+4}`,stroke:'#fff0a0','stroke-width':2.5,fill:'none'},ring)}
  const sh=shellyFig(shL,1.1);sh.put(cx,cy,start);
  const kn=el('g',{},knL);el('circle',{r:15,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2},kn);el('path',{d:'M-6,-3 a7,7 0 0 1 12,0 M6,-3 l1,-5 M6,-3 l-5,-1',stroke:'#7a4a2e','stroke-width':2,fill:'none','stroke-linecap':'round'},kn);
  const P=a=>{const [x,y]=dirV(a);return[cx+x*(R-30),cy+y*(R-30)]};
  function show(){arcL.innerHTML='';const h=start+T;if(T){const n=Math.max(2,Math.ceil(Math.abs(T)/10));let d=`M${cx},${cy}`;for(let k=0;k<=n;k++){const [x,y]=P(start+T*k/n);d+=` L${x.toFixed(1)},${y.toFixed(1)}`}
      el('path',{d:d+'Z',fill:T>0?'#ffc04d':'#6fe3cd',opacity:.35,stroke:T>0?'#ffc04d':'#6fe3cd','stroke-width':2},arcL)}
    sh.put(cx,cy,h);const [x,y]=dirV(h);kn.setAttribute('transform',`translate(${(cx+x*R).toFixed(1)},${(cy+y*R).toFixed(1)})`)}
  const ang=p=>Math.atan2(p.x-cx,cy-p.y)*180/Math.PI;
  const set=v=>{v=clamp(Math.round(v/15)*15,-360,360);if(v===T)return;T=v;SFX.tick(Math.abs(T/15)%10);show();onTurn&&onTurn(T)};
  const hit=el('circle',{cx,cy,r:R+34,fill:'transparent'},knL);knL.insertBefore(hit,kn);
  interact(knL,{label,down:p=>({a:ang(p),acc:0,T0:T}),move:(p,p0,c)=>{if(locked)return;const a=ang(p);let d=a-c.a;d=((d+540)%360)-180;c.acc+=d;c.a=a;set(c.T0+c.acc)},
    tap:p=>{if(locked)return;if(!p){set(T+15);return}let r=ang(p)-start;r=((r+540)%360)-180;set(r)}});
  knL.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();set(T+15)}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();set(T-15)}});
  show();
  return{g,sh,get:()=>T,lock:b=>{locked=b;knL.style.opacity=b?.25:1},reset(){T=0;show()},
    swim(dist,done){const [x,y]=dirV(start+T);SFX.whoosh();sh.swim(cx+x*dist,cy+y*dist,1100,()=>done&&done(cx+x*dist,cy+y*dist))},
    home(done){sh.swim(cx,cy,700,()=>{T=0;show();done&&done()})}}}
function seagrass(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);el('circle',{r:30,fill:'#8ff0c8',opacity:.15},g);
  for(let k=-3;k<=3;k++)el('path',{d:`M${k*5},12 q${k*4},-18 ${k*3},-34`,stroke:k%2?'#4fa84a':'#6fd06a','stroke-width':4.5,fill:'none','stroke-linecap':'round'},g);return g}

W.turn={scene:'lagoon',
notes:`<p>The Shape Isles start here, with Shelly the mapmaker turtle. She can only swim straight and turn, which is all geometry really is. This island teaches that an angle is an amount of turn.</p>
<p>A ring round Shelly is marked every 15° from the way she is facing (0°), with 90°, 180° and 270° labelled. She drags round the ring to turn Shelly (right turns shade gold, left turns teal), then presses Go and Shelly swims off. In the first round the seagrass is in plain sight; after that the water is murky, so she has to turn by the number: 180° (a half turn), 45° (half a quarter), 90° to the left, 135° (a quarter and half a quarter more). The last round is in sight again, to measure: the seagrass is 120° round, an obtuse angle. Each win names the kind of angle: acute, right, obtuse, straight, reflex.</p>
<p>A wrong turn swims into the murk, finds only rocks, and says how far she actually turned. Turning 90° left lands in the same place as 270° right, and that's accepted (and pointed out).</p>`,
mount(root){
  const R=[{t:90,vis:1,st:[0]},{t:180,st:[0,60,300]},{t:45,st:[0,90,330]},{t:-90,st:[0,45,120]},{t:135,st:[0,30,270]},{t:120,vis:1,alts:[120,150,60],st:[300,0,45]}];
  const S={r:0,busy:false,won:false,tries:0};
  const board=el('g',{},root),fog=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,grass=null;
  const CX=300,CY=318,RR=118,D=212,guide=shellyGuide(ui);
  const st=navStone({label:'Next turn',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this turn again',onTap:()=>load()});
  const goB=decGo(ui,540,490,'Go: Shelly swims',swim);
  const dirTxt=t=>`${Math.abs(t)}° ${t<0?'left':'right'}`;
  const parts=(q,done)=>q.vis&&!done?[['t','Turn'],['o','?']]:[['t','Turn'],['w',`${Math.abs(q.t)}°`],['t',q.t<0?'left':'right'],...(done?[['o','='],['t',kindShort(q.t)]]:[])];
  function swim(){if(S.busy||S.won)return;const q=Qr(),T=kit.get();if(!T){say('Drag the ring round first to turn Shelly.');return}
    S.busy=true;kit.lock(true);goB.style.display='none';const ok=((T-q.t)%360+360)%360===0;
    if(fog.firstChild)tween(800,(t,p)=>fog.setAttribute('opacity',(1-p).toFixed(2)));
    kit.swim(D-20,(x,y)=>{if(ok&&q.vis&&S.r>0){askAngle(q,T);return}if(ok)win(q,T);else{SFX.clonk();for(let k=0;k<3;k++)el('ellipse',{cx:x+(k-1)*18,cy:y+14+(k%2)*6,rx:10,ry:7,fill:'#5a6a7a',stroke:'#3a4a5a','stroke-width':1.5},board);
      say(`Only rocks here! Shelly turned ${dirTxt(T)}. ${turnWhy(q.t)} Try again.`);S.tries++;
      later(2600,()=>{fog.setAttribute('opacity',1);kit.home(()=>{load()})})}})}
  function askAngle(q,T){SFX.crunch();say('Found it! How far round did Shelly turn? Read the ring, then tap the angle.');const a0=Math.abs(q.t),opts=[a0-30,a0,a0+30].sort(()=>Math.random()-.5),L=el('g',{},ui);
    opts.forEach((v,k)=>{const c=el('g',{transform:`translate(${150+k*150},540)`},L);el('rect',{x:-50,y:-26,width:100,height:52,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('text',{y:9,'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#3a2418'},c).textContent=`${v}°`;
      interact(c,{label:`Angle card ${v}°`,tap:()=>{if(S.won)return;if(v===Math.abs(q.t)){L.remove();win(q,T)}else{SFX.wrong();c.style.opacity=.3;S.won=true;say(`It was ${Math.abs(q.t)}°, not ${v}°: count from 0° round to Shelly. A new spot…`);S.tries++;later(2800,()=>{L.remove();load()})}}});popIn(c,.5)})}
  function win(q,T){S.won=true;roundWon(S.r);SFX.fanfare();decQ(qL,parts(q,true),true,guide);SFX.crunch();burst(kit.sh.x,kit.sh.y-20,{n:16,cols:['#8ff0c8','#fff0a0','#6fd06a']});
    const same=Math.sign(T)!==Math.sign(q.t);
    say(same?`${dirTxt(T)} faces the same way as ${dirTxt(q.t)}! Both find the seagrass.`:q.vis&&S.r>0?`${Math.abs(q.t)}°: more than a right angle, less than a half turn. That's an obtuse angle.`:`${dirTxt(q.t)} = ${kindOf(q.t)}.`);
    if(S.r>=2)unlock('turns');later(1400,()=>st.ready(true))}
  const Qr=()=>{const q=R[S.r];return q.alts?Object.assign({},q,{t:q.alts[S.tries%q.alts.length]}):q};
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';fog.innerHTML='';fog.setAttribute('opacity',1);const q=Qr();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);goB.style.display='';
    const start=q.st[S.tries%q.st.length],[tx,ty]=dirV(start+q.t);grass=seagrass(board,CX+tx*D,CY+ty*D,1);
    kit=turnKit(board,{cx:CX,cy:CY,R:RR,start,left:q.t<0});
    if(!q.vis){el('path',{d:`M-700,0 H1300 V900 H-700Z M${CX+RR+54},${CY} A${RR+54},${RR+54} 0 1 0 ${CX-RR-54},${CY} A${RR+54},${RR+54} 0 1 0 ${CX+RR+54},${CY}Z`,fill:'#0b2a3a','fill-rule':'evenodd',opacity:.93},fog);
      for(let k=0;k<14;k++)el('circle',{cx:40+((k*97)%520),cy:110+((k*53)%440),r:20+(k%4)*8,fill:'#123a4e',opacity:.5},fog)}
    decQ(qL,parts(q),false,guide);
    say(S.r===0?'Shelly can only swim straight and turn. Drag the ring to turn her to the seagrass, then Go.':q.vis?'How far round is the seagrass? Turn Shelly to face it, then Go.':q.t<0?`Murky water! Turn Shelly ${Math.abs(q.t)}° to the left (anticlockwise), then Go.`:`Murky water! Turn Shelly ${q.t}° to the right, then Go. Trust the numbers.`)}
  W.turn.dbgQ=Qr;S.r=resumeAt(R.length);load();
}};
