/* ---------- 2. Paint: the same ratio makes the same colour ---------- */
const PNAME={red:'red',white:'white',yellow:'yellow',blue:'blue'};
/* a glass jar; scoops of paint sit in layers until it's stirred */
function jarKit(parent,{x,y,w=112,h=320,cap=16,layers=[],fixed=0,label='Paint jar',onChange,onTap}){
  const g=el('g',{},parent),L=el('g',{},g),top=el('g',{},g);let lay=[...layers],locked=false,mixed=null;const lh=(h-16)/cap;
  function draw(){L.innerHTML='';const bx=x+8,bw=w-16;
    if(mixed){const H=lay.length*lh;el('rect',{x:bx,y:y+h-8-H,width:bw,height:H,rx:6,fill:mixed},L);return}
    lay.forEach((c,i)=>{const r=el('rect',{x:bx,y:y+h-8-(i+1)*lh,width:bw,height:lh+.5,fill:PAINT[c],stroke:i<fixed?'none':'rgba(0,0,0,.08)'},L);
      if(i===lay.length-1&&i>=fixed&&!onTap)interact(r,{label:`Top scoop, ${c}: tap to tip it out`,tap:()=>{if(locked)return;lay.pop();SFX.pop(.8);draw();onChange&&onChange()}})})}
  el('rect',{x,y,width:w,height:h,rx:16,fill:'rgba(255,244,230,.1)'},g);g.insertBefore(g.lastChild,L);
  el('rect',{x,y,width:w,height:h,rx:16,fill:'none',stroke:'rgba(255,244,230,.65)','stroke-width':3},top);
  el('rect',{x:x+10,y:y+14,width:7,height:h-40,rx:3.5,fill:'#fff',opacity:.18},top);
  for(let k=1;k<cap;k++)if(k%4===0)el('line',{x1:x+w-14,x2:x+w-4,y1:y+h-8-k*lh,y2:y+h-8-k*lh,stroke:'rgba(255,244,230,.35)','stroke-width':1.5},top);
  if(onTap){const hit=el('rect',{x,y,width:w,height:h,rx:16,fill:'transparent'},g);interact(hit,{label,tap:onTap})}
  draw();
  const counts=()=>{const o={};lay.forEach(c=>o[c]=(o[c]||0)+1);return o};
  return{g,counts,n:()=>lay.length,lock:b=>{locked=b},
    add(c){if(locked)return false;if(lay.length>=cap){say('The jar is full! Tap the top scoop to tip it out.');return false}lay.push(c);SFX.plop?SFX.plop():SFX.pop(1);draw();onChange&&onChange();return true},
    colour:()=>mixPaint(Object.entries(counts()).map(([c,n])=>[PAINT[c],n])),
    /* stir: a spoon swirls and the layers blend into one colour */
    stir(done){const col=mixPaint(Object.entries(counts()).map(([c,n])=>[PAINT[c],n])),sp=el('g',{},top),cx=x+w/2,H=lay.length*lh;SFX.swish&&SFX.swish();
      el('rect',{x:-4,y:-150,width:8,height:150,rx:4,fill:'#c98a3a'},sp);el('ellipse',{cx:0,cy:0,rx:12,ry:8,fill:'#c98a3a'},sp);
      const rs=[...L.children];tween(1100,(t,p)=>{sp.setAttribute('transform',`translate(${(cx+Math.sin(p*14)*(w/2-24)).toFixed(1)},${(y+h-14-Math.min(H,40)/2).toFixed(1)}) rotate(${(Math.sin(p*14)*14).toFixed(1)})`);
        rs.forEach(r=>{const c0=r.dataset.c0||(r.dataset.c0=r.getAttribute('fill'));r.setAttribute('fill',mixRGB(c0.startsWith('#')?c0:'#888888',col,t))})},()=>{sp.remove();mixed=col;draw();done&&done(col)},ease.inOut)},
    unstir(){mixed=null;draw()}}}
function swatch(parent,x,y,col,title,sub){const g=el('g',{transform:`translate(${x},${y})`},parent);el('rect',{x:-62,y:-50,width:124,height:100,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},g);
  el('path',{d:'M-34,-14 C-40,-34 -10,-40 0,-30 C14,-42 40,-30 32,-12 C44,4 22,18 6,10 C-8,22 -36,12 -34,-14Z',fill:col||'none',stroke:col?'none':'#c9a77a','stroke-width':2,'stroke-dasharray':col?'':'5 4'},g);
  el('text',{y:28,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},g).textContent=title;if(sub)el('text',{y:43,'text-anchor':'middle','font-size':11.5,'font-weight':600,fill:'#7a5a44'},g).textContent=sub;return g}
function paintTub(parent,x,y,c,onTap){const g=el('g',{transform:`translate(${x},${y})`},parent);
  el('path',{d:'M-34,-20 L34,-20 L28,30 L-28,30Z',fill:'#e8dcc8',stroke:'#8a6a4a','stroke-width':2},g);el('ellipse',{cx:0,cy:-20,rx:34,ry:9,fill:PAINT[c],stroke:'#8a6a4a','stroke-width':2},g);
  el('text',{y:14,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#3a2418'},g).textContent=PNAME[c];
  const sc=el('g',{transform:'translate(26,-30) rotate(30)'},g);el('ellipse',{cx:0,cy:0,rx:10,ry:7,fill:'#c98a3a'},sc);el('rect',{x:-3,y:-30,width:6,height:28,rx:3,fill:'#c98a3a'},sc);
  interact(g,{label:`Add a scoop of ${PNAME[c]}`,tap:onTap});return g}

W.paint={scene:'studio',
notes:`<p>Equivalent ratios, made visible. Kai's colours are recipes: his pink is 1 red : 3 white. She adds scoops to a glass jar (tap a tub; tap the top scoop to tip it out) and sees the layers, then presses Stir. Only the same ratio gives exactly Kai's shade; anything else comes out too red or too pale, side by side with his colour card. Paint here mixes like real paint (blue and yellow make green).</p>
<p>Rounds: the jar already has 2 red, so add white for 1 : 3 (6 white); green 2 blue : 3 yellow starting from 4 blue (or from 6 yellow, the other way round); 12 scoops of orange at 1 red : 2 yellow (4 and 8); then turned round: which jar will be pinker, 1 : 3 or 3 : 5? (make the reds match: 3 : 9 against 3 : 5); which jar matches 1 : 2 sky blue (2 : 4, not 3 : 4); then a muddled jar to count and simplify, one step at a time (how many red scoops? how many white? 4 : 8 at its simplest is 1 : 2, just as 4/12 = 1/3 of the jar is red); and last a harder one, 2 red : 5 white starting from 4 red (10 white). A wrong mix gives a new start.</p>`,
mount(root){
  const R=[{k:'fill',a:'red',b:'white',ra:1,rb:3,nm:'pink',p:[{a:2},{a:3},{a:4}]},{k:'fill',a:'blue',b:'yellow',ra:2,rb:3,nm:'green',p:[{a:4},{b:6},{a:6}]},
    {k:'total',a:'red',b:'yellow',ra:1,rb:2,nm:'orange',p:[12,9,15]},{k:'cmp',a:'red',b:'white',p:[[[1,3],[3,5]],[[3,4],[1,2]],[[1,4],[2,5]]]},
    {k:'match',a:'blue',b:'white',ra:1,rb:2,nm:'sky blue',p:[[[2,4],[3,4],[2,5]],[[3,8],[3,6],[4,6]],[[5,8],[3,8],[4,8]]]},{k:'reduce',a:'red',b:'white',p:[[4,8],[6,3],[3,9]]},{k:'fill',a:'red',b:'white',ra:2,rb:5,nm:'rose',p:[{a:4},{b:5},{b:10}]}];
  const S={r:0,busy:false,won:false,pi:{},pick:null,step:0};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let jar=null,jars=[],ctl=null;
  const st=navStone({label:'Next colour',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this colour again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Stir the paint',stir,'Stir');
  const Q=()=>{const q=R[S.r];return Object.assign({},q,{v:q.p[(S.pi[S.r]||0)%q.p.length]})};
  const target=q=>mixPaint([[PAINT[q.a],q.ra],[PAINT[q.b],q.rb]]);
  const recipe=q=>`${q.ra} ${q.a} : ${q.rb} ${q.b}`;
  const parts=(q,done,o)=>q.k==='reduce'?(()=>{const [A,B]=q.v,g=gcd(A,B);return[['t','red : white'],['o','='],['w',`${S.step>0?A:'?'} : ${S.step>1?B:'?'}`],['o','='],done?['w',RAT(A/g,B/g)]:['o','?']]})()
    :q.k==='fill'?[['t',q.a],['o',':'],['t',q.b],['o','='],['w',RAT(q.ra,q.rb)],['o','='],['w',RAT(o?o.a:q.v.a||'?',o?o.b:q.v.b||'?')]]
    :q.k==='total'?[['t',`${q.a} : ${q.b}`],['o','='],['w',RAT(q.ra,q.rb)],['t',`,  ${q.v} scoops`]]
    :q.k==='cmp'?[['t','Pinker:'],['w',RAT(...q.v[0])],['t','or'],['w',RAT(...q.v[1])],['o','?']]
    :[['w',RAT(q.ra,q.rb)],['o','='],done?['w',RAT(...o)]:['o','?']];
  function stir(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='cmp'||q.k==='match'){if(S.pick==null){say(q.k==='cmp'?'Tap the jar you think will be pinker, then Stir.':`Tap the jar you think will match Kai’s ${q.nm}, then Stir.`);return}
      S.busy=true;goB.style.display='none';let n=0;jars.forEach((j,i)=>later(i*250,()=>j.stir(()=>{if(++n===jars.length)judgeCmp(q)})));return}
    const c=jar.counts(),A=c[q.a]||0,B=c[q.b]||0;if(!A||!B){say(`Add some ${!A?q.a:q.b} too, then Stir.`);return}
    S.busy=true;jar.lock(true);goB.style.display='none';
    jar.stir(col=>{const ok=A*q.rb===B*q.ra;
      if(q.k==='total'&&ok&&A+B!==q.v){SFX.wrong();say(`Right colour, but ${A+B} scoops, not ${q.v}. A new jar…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3400,load);return}
      const mine=swatch(board,98,330,col,'your mix',RAT(A,B));popIn(mine,.6);const bd=el('g',{transform:'translate(98,255)'},board);el('circle',{r:17,fill:ok?'#5ac85a':'#e8413e',stroke:'#fff4e6','stroke-width':2.5},bd);el('text',{y:7,'text-anchor':'middle','font-size':20,'font-weight':700,fill:'#fff'},bd).textContent=ok?'=':'≠';popIn(bd,.3);
      if(ok){win(q,col,`${RAT(A,B)} is the same as ${RAT(q.ra,q.rb)}: exactly Kai’s ${q.nm}!`,[A,B]);return}
      SFX.wrong();guide.tint(col);const more=A*q.rb>B*q.ra;
      say(`Too ${more?q.a:(q.b==='white'?'pale':q.b)}! ${RAT(A,B)} isn’t ${RAT(q.ra,q.rb)}. A new jar…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4200,load)})}
  /* reduce: count the scoops, then simplify, one step at a time */
  function reduceStep(q){const [A,B]=q.v,g=gcd(A,B),L=el('g',{},ctl);if(S.cards)S.cards.remove();S.cards=L;
    const ask=(title,opts,ok,onWrong)=>{say(title);opts.sort(()=>Math.random()-.5).forEach((o,i)=>ratioCard(L,540,190+i*80,o.t,{w:110,h:60,label:`Answer ${o.t}`,onTap:c=>{if(S.busy||S.won)return;
      if(o.ok){SFX.pop(1.2);pickCard(L,c);S.step++;decQ(qL,parts(q,false),false,guide);later(500,()=>ok())}else{SFX.wrong();c.style.opacity=.35;onWrong(o)}}}))};
    if(S.step===0)ask('Count the red scoops in the jar.',[{t:String(A),ok:1},{t:String(A+1)},{t:String(Math.max(1,A-1))}].filter((o,i,a)=>a.findIndex(x=>x.t===o.t)===i),()=>reduceStep(q),()=>say('Count again: just the red scoops.'));
    else if(S.step===1)ask('Now count the white scoops.',[{t:String(B),ok:1},{t:String(B+1)},{t:String(Math.max(1,B-1))}].filter((o,i,a)=>a.findIndex(x=>x.t===o.t)===i),()=>reduceStep(q),()=>say('Count again: just the white scoops.'));
    else{const sp=[A/g,B/g],half=g%2===0&&g>2?[A/2,B/2]:[sp[0]+1,sp[1]+1];
      ask(`${RAT(A,B)}. What is its simplest recipe? Divide both by the same number.`,[{t:RAT(...sp),ok:1},{t:RAT(sp[1],sp[0]),why:'rev'},{t:RAT(...half),why:g%2===0&&g>2?'half':'add'}],()=>{S.cards.remove();S.busy=true;
          jar.stir(col=>win(q,col,`${RAT(A,B)} ÷ ${g} = ${RAT(...sp)}, the simplest recipe. Just like ${A}/${A+B} = ${sp[0]}/${sp[0]+sp[1]} of the jar is red!`,sp))},
        o=>{say(o.why==='rev'?'That’s white : red, the wrong way round. A new jar…':o.why==='half'?`Same colour, but ${o.t} can be divided again. A new jar…`:`${o.t} isn’t ${RAT(A,B)} divided by anything. A new jar…`);S.busy=true;S.pi[S.r]=(S.pi[S.r]||0)+1;later(3600,load)})}}
  function judgeCmp(q){if(q.k==='cmp'){const f=([a,b])=>a/(a+b),best=f(q.v[0])>f(q.v[1])?0:1,[a1,b1]=q.v[0],[a2,b2]=q.v[1],L=a1*a2/gcd(a1,a2),m1=L/a1,m2=L/a2;
      const sm=(a,b,m)=>m===1?`${RAT(a,b)} stays ${RAT(a,b)}`:`${RAT(a,b)} is ${RAT(L,b*m)}`,why=`Make the reds match: ${sm(a1,b1,m1)}, and ${sm(a2,b2,m2)}. Same red, but ${b1*m1<b2*m2?RAT(a1,b1):RAT(a2,b2)} has less white.`;
      if(S.pick===best)win(q,jars[best].colour(),`${RAT(...q.v[best])} is pinker! ${why}`,q.v[best]);else{SFX.wrong();say(`The other one is pinker. ${why} A new pair…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4800,load)}return}
    const okI=q.v.findIndex(([a,b])=>a*q.rb===b*q.ra);jars.forEach((j,i)=>{if(i===okI)ring(j.cx,300,{col:'#fff0a0',r1:70});const bd=el('g',{transform:`translate(${j.cx},128)`},board);el('circle',{r:15,fill:i===okI?'#5ac85a':'#e8413e',stroke:'#fff4e6','stroke-width':2},bd);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff'},bd).textContent=i===okI?'=':'≠';popIn(bd,.3)});
    if(S.pick===okI)win(q,target(q),`${RAT(...q.v[okI])} matches! It’s ${RAT(q.ra,q.rb)} with every part times ${q.v[okI][0]/q.ra}, so the colour is the same.`,q.v[okI]);
    else{SFX.wrong();const [a,b]=q.v[S.pick];say(`${RAT(a,b)} isn’t ${RAT(q.ra,q.rb)}: ${a} ${q.a} needs ${a*q.rb/q.ra} ${q.b}. New jars…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4600,load)}}
  function win(q,col,msg,o){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();guide.tint(col);decQ(qL,parts(q,true,q.k==='fill'?{a:o[0],b:o[1]}:o),true,guide);if(q.k==='reduce')S.step=2;say(msg);burst(260,300,{n:16,cols:[col,'#fff0a0','#fff4e6']});
    if(S.r>=3)unlock('shade');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';if(ctl)ctl.remove();const q=Q();Object.assign(S,{busy:false,won:false,pick:null,step:0,cards:null});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);jars=[];jar=null;
    ctl=el('g',{},ui);
    if(q.k==='fill'||q.k==='total'){const pre=q.k==='fill'?[...Array(q.v.a||0).fill(q.a),...Array(q.v.b||0).fill(q.b)]:[];
      jar=jarKit(board,{x:214,y:110,layers:pre,fixed:pre.length,cap:16});
      swatch(board,98,180,target(q),`Kai’s ${q.nm}`,recipe(q));
      paintTub(ctl,540,170,q.a,()=>{if(!S.busy&&!S.won)jar.add(q.a)});paintTub(ctl,540,280,q.b,()=>{if(!S.busy&&!S.won)jar.add(q.b)})}
    else if(q.k==='reduce'){const [A,B]=q.v,lay=[...Array(A).fill(q.a),...Array(B).fill(q.b)];let sd=A*13+B*7+3;for(let i=lay.length-1;i>0;i--){sd=(sd*1103515245+12345)%2147483648;const j=sd%(i+1);[lay[i],lay[j]]=[lay[j],lay[i]]}
      jar=jarKit(board,{x:214,y:110,layers:lay,fixed:lay.length,cap:16});goB.style.display='none'}
    else{const X=q.k==='cmp'?[150,330]:[100,250,400];if(q.k==='match')swatch(board,540,190,target(q),`Kai’s ${q.nm}`,recipe(q));
      q.v.forEach(([a,b],i)=>{const lay=[...Array(a).fill(q.a),...Array(b).fill(q.b)],j=jarKit(board,{x:X[i]-50,y:150,w:100,h:300,cap:12,layers:lay,fixed:lay.length,label:`Jar ${RAT(a,b)}`,onTap:()=>{if(S.busy||S.won)return;S.pick=i;SFX.pop(1.1);
        jars.forEach((jj,k)=>jj.hl.setAttribute('opacity',k===i?1:0))}});j.hl=el('rect',{x:X[i]-58,y:142,width:116,height:316,rx:20,fill:'none',stroke:'#ffc04d','stroke-width':4,opacity:0},board);j.cx=X[i];jars.push(j);
        const t=el('text',{x:X[i],y:476,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#fff4e6'},board);t.textContent=`${a} ${q.a} : ${b} ${q.b}`})}
    decQ(qL,parts(q,false),false,guide);if(q.k==='reduce'){reduceStep(q);return}
    say(S.r===0?`Kai’s pink is 1 red : 3 white. The jar has ${q.v.a} red. Add white, then Stir.`
      :q.k==='fill'?`Kai’s ${q.nm} is ${recipe(q)}. The jar has ${q.v.a?q.v.a+' '+q.a:q.v.b+' '+q.b}. Add ${q.v.a?q.b:q.a}, then Stir.`
      :q.k==='total'?`Make ${q.v} scoops of ${q.nm}, ${recipe(q)}. Then Stir.`
      :q.k==='cmp'?'Turned round! Which jar will be pinker? Tap it, then Stir.'
      :`Which jar will match Kai’s ${q.nm}? Tap it, then Stir.`)}
  W.paint.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
