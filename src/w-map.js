
/* ---------- 3. Map: coordinates, along the corridor then up the stairs ---------- */
function chest(parent,x,y,s=1){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);el('circle',{r:28,fill:'#fff0a0',opacity:.3},g);
  el('rect',{x:-16,y:-6,width:32,height:18,rx:3,fill:'#8a5a2a',stroke:'#c9a24a','stroke-width':2},g);el('path',{d:'M-16,-6 q16,-16 32,0',fill:'#a8743a',stroke:'#c9a24a','stroke-width':2},g);
  el('circle',{cx:-6,cy:-12,r:4,fill:'#ffc94a'},g);el('circle',{cx:5,cy:-14,r:4,fill:'#ffc94a'},g);el('rect',{x:-3,y:-2,width:6,height:7,rx:1,fill:'#ffc94a'},g);return g}
/* a sea chart with a coordinate grid; tap a point to drop a buoy */
function mapKit(parent,{ox,oy,cs,xmin,xmax,ymin,ymax,label='Sea chart: tap a point',onPick}){
  const g=el('g',{},parent),grid=el('g',{},g),pathL=el('g',{},g),mk=el('g',{},g),shL=el('g',{},g),top=el('g',{},g);let pick=null,locked=false;
  const xy=(x,y)=>[ox+x*cs,oy-y*cs];
  for(let x=xmin;x<=xmax;x++){const [px]=xy(x,0);el('line',{x1:px,x2:px,y1:oy-ymax*cs-14,y2:oy-ymin*cs+14,stroke:'#8a6a3a','stroke-width':x===0?3:1.2,opacity:x===0?.9:.45},grid)}
  for(let y=ymin;y<=ymax;y++){const [,py]=xy(0,y);el('line',{x1:ox+xmin*cs-14,x2:ox+xmax*cs+14,y1:py,y2:py,stroke:'#8a6a3a','stroke-width':y===0?3:1.2,opacity:y===0?.9:.45},grid)}
  el('path',{d:`M${ox+xmax*cs+14},${oy} l-10,-6 v12Z M${ox},${oy-ymax*cs-14} l-6,10 h12Z`,fill:'#5a3a1a'},grid);
  el('text',{x:ox+xmax*cs+24,y:oy+5,'font-size':16,'font-weight':700,'font-style':'italic',fill:'#5a3a1a'},grid).textContent='x';el('text',{x:ox-5,y:oy-ymax*cs-22,'text-anchor':'middle','font-size':16,'font-weight':700,'font-style':'italic',fill:'#5a3a1a'},grid).textContent='y';
  for(let x=xmin;x<=xmax;x++)if(x){const [px]=xy(x,0);el('text',{x:px,y:oy+18,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#4a2e14'},grid).textContent=sgn(x)}
  for(let y=ymin;y<=ymax;y++)if(y){const [,py]=xy(0,y);el('text',{x:ox-8,y:py+4.5,'text-anchor':'end','font-size':13,'font-weight':700,fill:'#4a2e14'},grid).textContent=sgn(y)}
  el('text',{x:ox-8,y:oy+18,'text-anchor':'end','font-size':13,'font-weight':700,fill:'#4a2e14'},grid).textContent='0';
  const sh=shellyFig(shL,.62);sh.put(...xy(0,0),90);
  const hit=el('rect',{x:ox+xmin*cs-cs/2,y:oy-ymax*cs-cs/2,width:(xmax-xmin+1)*cs,height:(ymax-ymin+1)*cs,fill:'transparent'},top);
  const near=p=>[clamp(Math.round((p.x-ox)/cs),xmin,xmax),clamp(Math.round((oy-p.y)/cs),ymin,ymax)];
  function drop(x,y){pick=[x,y];mk.innerHTML='';const [px,py]=xy(x,y),b=el('g',{transform:`translate(${px},${py})`},mk);el('circle',{r:13,fill:'#ff5a7a',opacity:.25},b);el('path',{d:'M0,0 V-26',stroke:'#5a3a1a','stroke-width':2.5},b);el('path',{d:'M0,-26 L16,-20 L0,-14Z',fill:'#ff5a7a',stroke:'#a0304a','stroke-width':1},b);el('circle',{r:4.5,fill:'#a0304a'},b);popIn(b,.5);SFX.pop(1.1);onPick&&onPick(pick)}
  interact(top,{label,tap:p=>{if(locked)return;if(!p){const [x,y]=pick||[0,0];drop(x+1>xmax?xmin:x+1,y);return}drop(...near(p))}});
  top.addEventListener('keydown',e=>{if(locked)return;const [x,y]=pick||[0,0],K={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(K){e.preventDefault();drop(clamp(x+K[0],xmin,xmax),clamp(y+K[1],ymin,ymax))}});
  return{g,xy,sh,pick:()=>pick,lock:b=>{locked=b},clearPick(){pick=null;mk.innerHTML=''},
    place(x,y,h=90){sh.put(...xy(x,y),h)},
    /* swim along x first, then along y, drawing the route */
    swim(from,to,done){const [fx,fy]=from,[tx,ty]=to,[ax,ay]=xy(fx,fy),[bx]=xy(tx,fy),[,by]=xy(tx,ty);pathL.innerHTML='';
      const l1=el('line',{x1:ax,y1:ay,x2:ax,y2:ay,stroke:'#c0402a','stroke-width':4,'stroke-dasharray':'9 6','stroke-linecap':'round'},pathL),l2=el('line',{x1:bx,y1:ay,x2:bx,y2:ay,stroke:'#2a7ac0','stroke-width':4,'stroke-dasharray':'9 6','stroke-linecap':'round'},pathL);
      const leg2=()=>{if(ty===fy){done&&done();return}sh.put(null,null,ty>fy?0:180);SFX.swish();sh.swim(bx,by,Math.max(350,Math.abs(ty-fy)*220),()=>done&&done());const y0=ay;tween(Math.max(350,Math.abs(ty-fy)*220),t=>l2.setAttribute('y2',lerp(y0,by,t)),null,ease.inOut)};
      if(tx===fx){leg2();return}sh.put(ax,ay,tx>fx?90:270);SFX.whoosh();sh.swim(bx,ay,Math.max(350,Math.abs(tx-fx)*220),leg2);tween(Math.max(350,Math.abs(tx-fx)*220),t=>l1.setAttribute('x2',lerp(ax,bx,t)),null,ease.inOut)},
    tag(x,y,col='#3a2418'){const [px,py]=xy(x,y),g2=el('g',{transform:`translate(${px+4},${py-40})`},top);el('rect',{x:-30,y:-14,width:60,height:24,rx:8,fill:'#fff4e6',stroke:col,'stroke-width':2},g2);el('text',{y:4,'text-anchor':'middle','font-size':14,'font-weight':700,fill:col},g2).textContent=pt2(x,y);popIn(g2,.5);return g2}}}

W.chart={scene:'chart',
notes:`<p>Coordinates, on Shelly's sea chart. Each round gives a point like (3, 2); she taps the chart to drop a buoy there and presses Go. Shelly swims from 0 along the x direction first (red route), then up or down (blue route): along the corridor, then up the stairs. If she lands on the treasure the chart piece is hers; if not, the point she chose is labelled, so the mix-up is visible: (2, 3) instead of (3, 2).</p>
<p>The third round turns the question round and looks different: Shelly is already sitting somewhere, and she picks which coordinate card says where (the cards include the swapped pair). Then the chart grows to four quadrants: negative numbers go left of 0 or below it, (−3, 2) and (2, −4). The last round is a move: Shelly is at (−2, 1) and swims 5 right and 3 down; where does she end up?</p>`,
mount(root){
  const R=[{q1:1,p:[[3,2],[4,1],[2,4]]},{q1:1,p:[[2,5],[5,3],[1,4]]},{q1:1,cards:1,p:[[4,1],[5,2],[1,3]]},{p:[[-3,2],[-4,3],[-2,4]]},{p:[[2,-4],[3,-2],[4,-3]]},{mv:1,p:[[[-2,1],[5,-3]],[[1,3],[-4,-5]],[[-3,-2],[6,4]]]}];
  const S={r:0,busy:false,won:false,pi:{}};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);let kit=null,cardsL=null;const guide=shellyGuide(ui);
  const st=navStone({label:'Next point',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this point again',onTap:()=>load()});
  const goB=decGo(ui,540,520,'Go: Shelly swims there',go2);
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length];return q.mv?Object.assign({},q,{from:v[0],mv:v[1],t:[v[0][0]+v[1][0],v[0][1]+v[1][1]]}):Object.assign({},q,{t:v})};
  const mvTxt=m=>`${Math.abs(m[0])} ${m[0]<0?'left':'right'}, ${Math.abs(m[1])} ${m[1]<0?'down':'up'}`;
  const why=([x,y])=>`${Math.abs(x)} ${x<0?'left of 0':'along'}, then ${Math.abs(y)} ${y<0?'down':'up'}`;
  const parts=(q,done)=>q.cards?[['t','Shelly is at'],done?['w',pt2(...q.t)]:['o','?']]:q.mv?[['w',pt2(...q.from)],['t',mvTxt(q.mv)],['o','→'],done?['w',pt2(...q.t)]:['o','?']]:[['t','Swim to'],['w',pt2(...q.t)]];
  function go2(){if(S.busy||S.won)return;const q=Q();if(q.cards){if(!S.card){say('Tap the card that says where Shelly is first.');return}checkCard(q);return}const p=kit.pick();if(!p){say('Tap the chart first to drop a buoy where Shelly should go.');return}
    S.busy=true;kit.lock(true);goB.style.display='none';const from=q.mv?q.from:[0,0],dest=q.mv?q.t:p;
    kit.swim(from,dest,()=>{const ok=p[0]===q.t[0]&&p[1]===q.t[1];if(ok)win(q);else{SFX.wrong();kit.tag(p[0],p[1],'#a0304a');
      say(q.mv?`Shelly ended up at ${pt2(...q.t)}, not ${pt2(...p)}. Count the moves from where she started. New trip coming…`:`Your buoy is at ${pt2(...p)}: ${why(p)}. ${pt2(...q.t)} is ${why(q.t)}. New treasure coming…`);
      S.pi[S.r]=(S.pi[S.r]||0)+1;later(3600,load)}})}
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();decQ(qL,parts(q,true),true,guide);const [x,y]=kit.xy(...q.t);if(!q.cards)popIn(chest(kit.g,x,y+2,1),.3);burst(x,y,{n:16});kit.tag(...q.t,'#2a7a4a');
    say(q.cards?`${pt2(...q.t)}: ${why(q.t)}. The along number always comes first.`:q.mv?`${pt2(...q.from)}, ${mvTxt(q.mv)}: that's ${pt2(...q.t)}. Treasure!`:`Treasure! ${pt2(...q.t)} is ${why(q.t)}.`);
    if(S.r>=3)unlock('coords');later(1400,()=>st.ready(true))}
  function pickCard(c,v,q){if(S.busy||S.won)return;S.card={c,v};cardsL.querySelectorAll('g').forEach(g=>{g.style.opacity=g===c?1:.55;g.querySelector('rect').setAttribute('stroke',g===c?'#ffc04d':'#8a6a3a')});SFX.pop(1.1);goB.style.display=''}
  function checkCard(q){const {c,v}=S.card;S.busy=true;goB.style.display='none';cardsL.querySelectorAll('g').forEach(g=>g.style.opacity=g===c?1:.35);const ok=v[0]===q.t[0]&&v[1]===q.t[1];
    if(ok){burst(...kit.xy(...q.t),{n:12});S.cardWin=1;win(q)}else{SFX.wrong();kit.tag(...v,'#a0304a');const [x,y]=kit.xy(...v);el('circle',{cx:x,cy:y,r:9,fill:'none',stroke:'#a0304a','stroke-width':3},kit.g);
      say(`${pt2(...v)} is over there: ${why(v)}. Shelly is ${why(q.t)}. New spot coming…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3400,load)}}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';const q=Q();Object.assign(S,{busy:false,won:false,card:null});st.ready(false);navDots(R.length,S.r);goB.style.display=q.cards?'none':'';
    kit=q.q1?mapKit(board,{ox:100,oy:504,cs:56,xmin:0,xmax:6,ymin:0,ymax:6}):mapKit(board,{ox:290,oy:330,cs:40,xmin:-5,xmax:5,ymin:-5,ymax:5});
    if(q.mv)kit.place(...q.from);
    if(q.cards){kit.lock(true);kit.place(...q.t,0);const [x,y]=kit.xy(...q.t);el('circle',{cx:x,cy:y,r:26,fill:'none',stroke:'#fff0a0','stroke-width':3,class:'ring'},board);
      const [a,b]=q.t,opts=[[a,b],[b,a],[a,a],[b,b]].filter((v,i,A)=>A.findIndex(w=>w[0]===v[0]&&w[1]===v[1])===i);while(opts.length<4)opts.push([a+opts.length,b]);opts.sort(()=>Math.random()-.5);
      cardsL=el('g',{},board);opts.forEach((v,k)=>{const c=el('g',{transform:`translate(520,${160+k*86})`},cardsL);el('rect',{x:-52,y:-30,width:104,height:60,rx:12,fill:'#fff4e6',stroke:'#8a6a3a','stroke-width':3},c);
        el('text',{y:8,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418'},c).textContent=pt2(...v);interact(c,{label:`Card ${pt2(...v)}`,tap:()=>pickCard(c,v,q)});popIn(c,.5)})}
    decQ(qL,parts(q),false,guide);
    say(S.r===0?`Tap the chart where ${pt2(...q.t)} is, then Go. Shelly swims along first, then up.`:q.cards?'Turned round! Shelly is sitting on the chart. Tap the card that says where, then Go.':q.mv?`Shelly is at ${pt2(...q.from)}. She swims ${mvTxt(q.mv)}. Tap where she ends up, then Go.`:!q.q1&&S.r===3?`The chart has grown: negative numbers are left of 0 and below it. Tap ${pt2(...q.t)}, then Go.`:`Tap ${pt2(...q.t)} on the chart, then Go.`)}
  S.r=resumeAt(R.length);load();
}};
