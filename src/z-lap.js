/* ---------- 3. Snail's lap: 5 minutes a stone ---------- */
function lapSnail(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  el('path',{d:'M-20,8 Q-22,-2 -10,-2 L14,-2 Q24,-2 24,6 Q24,10 18,10 L-16,10Z',fill:'#ffb36a',stroke:'#c9813a','stroke-width':1.5},b);
  el('circle',{cx:-2,cy:-10,r:13,fill:'#c98a4a',stroke:'#7a4a2e','stroke-width':2},b);el('path',{d:'M-2,-10 m-7,0 a7,7 0 1 1 7,7 a4,4 0 1 1 -4,-4',fill:'none',stroke:'#7a4a2e','stroke-width':2},b);
  el('path',{d:'M18,-1 l4,-9 M21,-1 l6,-7',stroke:'#c9813a','stroke-width':2},b);[[22,-10],[27,-8]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:2,fill:'#3a2418'},b));return g}
/* a clock with 12 stepping stones round the outside, and a snail that crawls between them */
function snailClock(parent,{x,y,r=104,R0}){const ck=clockKit(parent,{x,y,r}),RS=R0||r+30,stones=el('g',{},parent),sn=lapSnail(parent,.85);let at=0,h=12;
  for(let i=0;i<12;i++){const a=i*30*Math.PI/180;el('ellipse',{cx:x+Math.sin(a)*RS,cy:y-Math.cos(a)*RS+4,rx:15,ry:10,fill:'#8a92a8',stroke:'#5a6278','stroke-width':2},stones)}
  const place=k=>{const a=k*30*Math.PI/180;sn.setAttribute('transform',`translate(${(x+Math.sin(a)*RS).toFixed(1)},${(y-Math.cos(a)*RS-6).toFixed(1)}) ${k>6?'scale(-1,1)':''}`)};
  const o=Object.assign(ck,{stones,sn,stoneAt:p=>Math.round(ck.angleAt(p)/30)%12,pos:()=>at,
    hour(h2){h=h2;ck.set(h*60+at*5)},
    jump(k){at=((k%12)+12)%12;place(at);ck.set(h*60+at*5)},
    crawl(k,done){k=((k%12)+12)%12;if(k===at){done&&done();return}const dir=((k-at+12)%12)<=6?1:-1;const step=()=>{at=(at+dir+12)%12;place(at);ck.set(h*60+at*5);SFX.tick(at%8);if(at!==k)later(140,step);else done&&done()};step()}});
  place(0);return o}
/* a digital clock board */
function digiBoard(parent,x,y,txt,{lit=true}={}){const g=el('g',{transform:`translate(${x},${y})`},parent);el('rect',{x:-62,y:-30,width:124,height:60,rx:10,fill:'#1d1630',stroke:'#c9a24a','stroke-width':3},g);
  el('text',{y:13,'text-anchor':'middle','font-size':34,'font-weight':800,fill:lit?'#8ff0c8':'#3a4a50','font-family':'monospace'},g).textContent=txt;popIn(g,.5);return g}

W.lap={scene:'meadow',
notes:`<p>Minutes past and to, five at a time. The snail crawls round the clock on 12 stepping stones, and each stone takes it 5 minutes: 10 past is 2 stones, 25 past is 5, 20 to 5 is 4 stones before the top. She taps a stone (or drags the snail) and the snail crawls there, pulling the minute hand; the short hand creeps along too. Check, and the digital clock lights up with the same time. Turned round, the digital clock is given and she moves the snail to match; then she counts on (the snail was at quarter past 3 and crawled 4 more stones).</p>`,
mount(root){
  /* h: the hour; s: stones (5 minutes each); from: where the snail starts; dig: show the digital time first */
  const R=[
    {v:[{h:2,s:2},{h:7,s:2}]},
    {v:[{h:6,s:5},{h:1,s:5}]},
    {v:[{h:4,s:8},{h:9,s:8}]},
    {v:[{h:9,s:7,dig:1},{h:3,s:11,dig:1}]},
    {v:[{h:5,s:7,from:3},{h:8,s:6,from:2}]},
    {v:[{h:11,s:10},{h:5,s:10}]}];
  const S={r:0,busy:false,won:false,pi:{}};
  const scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let sc=null;
  const st=navStone({label:'Next time',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this time again',onTap:()=>load()});
  /* after two misses, a fresh time of the same kind */
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;let q=rr.v[pi];if(!q){const b=rr.v[0],k=pi*5+S.r*7,h=[1,2,4,5,7,8,10,11][k%8],past=b.s<6,s=b.from?b.from+[3,4,5][k%3]:past?[1,2,3,4,5][k%5]:[7,8,9,10,11][k%5];q=Object.assign({},b,{h:b.from?[1,4,7,10][k%4]:past||b.dig?h:h,s})}return Object.assign({from:0},q,{t:q.h*60+q.s*5})};
  const parts=(q,done)=>[['t',q.dig?digi(q.t):q.from?'the snail now':tWords(q.t)],['o','='],done?['w','✓']:['o','?']];
  const prompt=q=>q.dig?`The station clock says ${digi(q.t)}. Move the snail to match.`:q.from?`The snail was at ${tWords(q.h*60+q.from*5)}. It crawled ${q.s-q.from} more stones. Where is it now?`:`Make it ${tWords(q.t)}.`;
  function win(q){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(230,320,{n:16});if(!q.dig)digiBoard(ui,530,250,digi(q.t));
    say(q.s<=6?`${q.s} ${q.s===1?'stone':'stones'} past the top: ${tWords(q.t)}, or ${digi(q.t)}.`:`${12-q.s} ${12-q.s===1?'stone':'stones'} to the top: ${tWords(q.t)}, or ${digi(q.t)}.`);if(S.r>=2)unlock('tlap');later(1400,()=>st.ready(true))}
  function check(){if(S.busy||S.won)return;const q=Q(),k=sc.pos();
    if(k!==q.s){SFX.wrong();S.busy=true;const m=k*5;say(`The snail is on ${k} stones: ${k===0?'o’clock':m===30?'half past':m===15?'quarter past':m===45?'quarter to':m<30?`${m} past`:`${60-m} to`}. ${q.s<=6?`${tWords(q.t)} is ${q.s} stones from the top.`:`${tWords(q.t)} is ${12-q.s} stones before the top.`} A new time…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4400,load);return}
    win(q)}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    sc=snailClock(scene,{x:236,y:320,r:100});sc.hour(q.h);sc.jump(q.from);if(q.dig)digiBoard(ui,530,250,digi(q.t));
    const hit=el('circle',{cx:236,cy:320,r:160,fill:'transparent'},scene);let drag=false;
    interact(hit,{label:'Snail: tap a stone',down:()=>({}),move:p=>{if(S.busy||S.won)return;drag=true;sc.jump(sc.stoneAt(p))},up:()=>{drag=false},tap:p=>{if(S.busy||S.won||!p)return;S.busy=true;sc.crawl(sc.stoneAt(p),()=>{S.busy=false})}});
    hit.addEventListener('keydown',e=>{if(S.busy||S.won)return;if(e.key==='ArrowRight'){e.preventDefault();sc.jump(sc.pos()+1);SFX.tick(2)}if(e.key==='ArrowLeft'){e.preventDefault();sc.jump(sc.pos()-1);SFX.tick(2)}});
    say(S.r===0?`The snail takes 5 minutes for each stone. ${prompt(q)} Tap a stone.`:prompt(q));decGo(ui,540,486,'Check',check,'Check')}
  W.lap.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
