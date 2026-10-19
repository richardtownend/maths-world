/* ---------- 2. Pizza o'clock: the minute hand eats the clock ---------- */
/* a pizza clock: 4 slices from 12 round to 12; eat(n) shows n eaten (plate showing) */
function pizzaClock(parent,{x,y,r=118}){const ck=clockKit(parent,{x,y,r,pie:4,minute:true,hour:true,numR:.9,numS:.15});const L=ck.pieL;let n=0;const ri=r*.8;
  const wedge=k=>{const a0=k*90*Math.PI/180,a1=(k+1)*90*Math.PI/180;return `M0,0 L${(Math.sin(a0)*ri).toFixed(1)},${(-Math.cos(a0)*ri).toFixed(1)} A${ri},${ri} 0 0 1 ${(Math.sin(a1)*ri).toFixed(1)},${(-Math.cos(a1)*ri).toFixed(1)}Z`};
  const draw=()=>{L.innerHTML='';el('circle',{r:(r+ri)/2,fill:'none',stroke:'#f4d8a0','stroke-width':r-ri+2},L);
    for(let k=0;k<4;k++){if(k<n){el('path',{d:wedge(k),fill:'#e8e4ec',stroke:'#c9c0d0','stroke-width':2},L);[[.4,.3],[.6,.6]].forEach(([u,v])=>{const a=(k+v)*90*Math.PI/180;el('circle',{cx:Math.sin(a)*ri*u,cy:-Math.cos(a)*ri*u,r:2.5,fill:'#e8b870'},L)});continue}
      el('path',{d:wedge(k),fill:'#e8613e',stroke:'#f4c070','stroke-width':4},L);
      [[.38,.3],[.66,.55],[.42,.75],[.75,.22]].forEach(([u,v])=>{const a=(k+v)*90*Math.PI/180;el('circle',{cx:Math.sin(a)*ri*u,cy:-Math.cos(a)*ri*u,r:6.5,fill:'#a82424'},L)})}};
  draw();return Object.assign(ck,{eaten:()=>n,eat(k){n=clamp(k,0,4);draw()},wedgeAt(p){const a=ck.angleAt(p);return Math.floor(a/90)}})}
/* drag the minute hand round the pizza: it eats the slices it sweeps past (0 to 3 quarters) */
function dragEat(pz,{onChange,can=()=>true,label='Minute hand: drag it round the pizza'}){const hit=el('circle',{cx:pz.x,cy:pz.y,r:pz.r+14,fill:'transparent'},pz.g.parentNode);
  const at=p=>{let k=Math.round(pz.angleAt(p)/90)%4;if(k!==pz.eaten()){pz.eat(k);SFX.crunch?SFX.crunch():SFX.pop(1);onChange&&onChange(k)}};
  interact(hit,{label,down:p=>{if(can())at(p);return{}},move:p=>{if(can())at(p)},tap:p=>{if(p&&can())at(p)}});
  hit.addEventListener('keydown',e=>{if(!can())return;const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();pz.eat(clamp(pz.eaten()+d,0,3));SFX.pop(1);onChange&&onChange(pz.eaten())});return hit}

W.pie={scene:'kitchen',
notes:`<p>Quarter past, half past and quarter to, as a pizza. The clock face is a pizza in 4 slices and the minute hand eats it from the top: a quarter eaten is quarter past, half eaten is half past, three slices eaten (a quarter left) is quarter to. She drags the minute hand round and it eats the slices it passes; the short hand creeps on as it goes. Turned round, the pizza is already eaten and she drags the short hand to where it must be (just past 4 for quarter past 4, nearly 6 for quarter to 6). Last, she does both: eat the pizza and set the short hand.</p>`,
mount(root){
  /* eat: tap slices (h0 is the hour when nothing is eaten); hour: drag the short hand, e slices already eaten; both: eat and drag */
  const R=[
    {v:[{k:'eat',h0:4,e:2},{k:'eat',h0:2,e:2}]},
    {v:[{k:'eat',h0:7,e:1},{k:'eat',h0:10,e:1}]},
    {v:[{k:'eat',h0:6,e:3},{k:'eat',h0:2,e:3}]},
    {v:[{k:'hour',h0:4,e:1},{k:'hour',h0:9,e:1}]},
    {v:[{k:'hour',h0:5,e:3},{k:'hour',h0:10,e:3}]},
    {v:[{k:'both',h0:11,e:3},{k:'both',h0:1,e:2}]}];
  const S={r:0,busy:false,won:false,pi:{},hourT:0};
  const scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let pz=null;
  const st=navStone({label:'Next pizza',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this pizza again',onTap:()=>load()});
  /* after two misses, a fresh time of the same kind (never with the hands on top of each other) */
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;let q=rr.v[pi];if(!q){const b=rr.v[0],hs=[1,2,4,5,6,7,9,10,11].filter(h=>!(b.e===1&&h===3)&&!(b.e===3&&h===8)&&h!==b.h0);q=Object.assign({},b,{h0:hs[(pi*5+S.r*3)%hs.length]})}return Object.assign({},q,{t:q.h0*60+q.e*15})};
  const parts=(q,done)=>[['t',tWords(q.t)],['o','='],done?['w','✓']:['o','?']];
  const setHour=t=>{S.hourT=t;pz.hh.setAttribute('transform',`rotate(${((t/2)%360).toFixed(2)})`)};
  const eatTo=(q,n)=>{if(q.k==='eat')pz.set(q.h0*60+n*15);else pz.mh.setAttribute('transform',`rotate(${n*90})`)};
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(230,320,{n:16});say(msg);if(S.r>=2)unlock('tpie');later(1400,()=>st.ready(true))}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new pizza…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3800,load)}
  const pw=e=>['none of it','a quarter of it','half of it','three quarters of it','all of it'][e];
  const why=q=>q.e===1?'Quarter past: a quarter is eaten.':q.e===2?'Half past: half is eaten.':'Quarter to: a quarter is left.';
  function check(){if(S.busy||S.won)return;const q=Q(),n=pz.eaten();
    if(q.k!=='hour'&&n!==q.e){miss(`The minute hand ate ${pw(n)}. ${why(q)}`);return}
    if(q.k!=='eat'){const t=((S.hourT%720)+720)%720,want=q.t%720;if(t!==want){miss(t===(q.h0*60)%720?'The short hand moves on as the pizza is eaten, so it isn’t right on the number.':t===((q.h0+1)*60)%720?`Not yet ${q.h0%12+1} o’clock: it’s ${tWords(q.t)}.`:`The short hand should be near the ${q.e===3?q.h0%12+1:q.h0}.`);return}}
    win(q,`${tWords(q.t)[0].toUpperCase()+tWords(q.t).slice(1)}! ${why(q)}${q.k!=='eat'?` The short hand is ${q.e===3?`nearly at the ${q.h0%12+1}`:q.e===2?`halfway to the ${q.h0%12+1}`:`just past the ${q.h0}`}.`:''}`)}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    el('ellipse',{cx:240,cy:446,rx:170,ry:22,fill:'#7a4a2e',opacity:.35},scene);pz=pizzaClock(scene,{x:240,y:316,r:118});
    const away=Math.round(((q.t+360)%720)/15)*15;
    if(q.k==='eat'){pz.set(q.h0*60);say(S.r===0?`The minute hand eats the pizza as it goes round. Drag it to make ${tWords(q.t)}.`:`Make it ${tWords(q.t)}.`)}
    else if(q.k==='hour'){pz.eat(q.e);pz.mh.setAttribute('transform',`rotate(${q.e*90})`);setHour(away);say(`It’s ${tWords(q.t)}. Drag the short hand round the edge.`)}
    else{pz.mh.setAttribute('transform','rotate(0)');setHour(away);say(`Make it ${tWords(q.t)}: both hands!`)}
    /* one big area over the whole clock: grab the hand nearest your finger and drag it round */
    const hit=el('circle',{cx:240,cy:316,r:150,fill:'transparent'},scene);let grab=null;
    const mAng=()=>pz.eaten()*90,hAng=()=>(S.hourT/2)%360,dist=(a,b)=>{const d=Math.abs(a-b)%360;return Math.min(d,360-d)};
    const moveHour=p=>{const t=Math.round(pz.angleAt(p)*2/15)*15%720;if(t!==S.hourT){setHour(t);SFX.tick(3)}};
    const moveMin=p=>{const k=Math.round(pz.angleAt(p)/90)%4;if(k!==pz.eaten()){pz.eat(k);eatTo(q,k);SFX.crunch?SFX.crunch():SFX.pop(1)}};
    const pick=p=>q.k==='eat'?'m':q.k==='hour'?'h':(dist(pz.angleAt(p),hAng())<dist(pz.angleAt(p),mAng())?'h':'m');
    const mv=p=>{if(S.busy||S.won||!grab)return;grab==='h'?moveHour(p):moveMin(p)};
    interact(hit,{label:q.k==='hour'?'Short hand: drag it round':q.k==='eat'?'Minute hand: drag it round the pizza':'Clock: drag a hand round',down:p=>{grab=pick(p);mv(p);return{}},move:mv,up:()=>{grab=null},tap:p=>{if(p){grab=pick(p);mv(p);grab=null}}});
    hit.addEventListener('keydown',e=>{if(S.busy||S.won)return;const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0,u=e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0;
      if(d&&q.k!=='hour'){e.preventDefault();const k=clamp(pz.eaten()+d,0,3);pz.eat(k);eatTo(q,k);SFX.pop(1)}
      if((u||(d&&q.k==='hour'))&&q.k!=='eat'){e.preventDefault();setHour(((S.hourT+15*(u||d))%720+720)%720);SFX.tick(3)}});
    decGo(ui,540,486,'Check',check,'Check')}
  W.pie.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
