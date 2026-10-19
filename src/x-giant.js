/* ---------- 5. Giant: scale factor and "in proportion" ---------- */
/* Kai's portrait, drawn w × h units big; scale it unevenly and he stretches */
function kaiPortrait(parent,w,h){const g=el('g',{},parent);el('rect',{x:0,y:0,width:w,height:h,fill:'#bfe3ff'},g);el('rect',{x:0,y:h*.72,width:w,height:h*.28,fill:'#9ad08a'},g);
  el('circle',{cx:w*.8,cy:h*.2,r:Math.min(w,h)*.12,fill:'#fff0a0'},g);
  const s=Math.min(w/90,h/48),k=kaiFig(g,s,'#5ac85a');k.put(w/2+2*s,h*.62);return g}
/* a grid with a frame anchored at its bottom-left; drag the top-right corner */
function frameGrid(parent,{x0,y0,cs,cols,rows,w=1,h=1,drag=true,title,label='Frame corner: drag it to size the frame',onChange}){
  const g=el('g',{},parent),bg=el('g',{},g),fr=el('g',{},g),hitL=el('g',{},g),BY=y0+rows*cs;let locked=false,shown=null;
  el('rect',{x:x0-8,y:y0-8,width:cols*cs+16,height:rows*cs+16,rx:10,fill:'#1d1840',opacity:.85},bg);
  for(let c=0;c<=cols;c++)el('line',{x1:x0+c*cs,x2:x0+c*cs,y1:y0,y2:BY,stroke:'rgba(255,244,230,.16)','stroke-width':1},bg);
  for(let r=0;r<=rows;r++)el('line',{x1:x0,x2:x0+cols*cs,y1:y0+r*cs,y2:y0+r*cs,stroke:'rgba(255,244,230,.16)','stroke-width':1},bg);
  if(title)el('text',{x:x0+cols*cs/2,y:y0-16,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff0a0'},bg).textContent=title;
  const kn=el('g',{},hitL);el('circle',{r:13,fill:'url(#gBell)',stroke:'#fff6d0','stroke-width':2.5},kn);el('path',{d:'M-5,5 L5,-5 M1,-5 h4 v4',stroke:'#7a4a2e','stroke-width':2.2,fill:'none','stroke-linecap':'round'},kn);
  function draw(){fr.innerHTML='';const X=x0,Y=BY-h*cs,W=w*cs,H=h*cs;
    if(shown){const p=kaiPortrait(fr,shown[0],shown[1]);p.setAttribute('transform',`translate(${X},${Y}) scale(${W/shown[0]},${H/shown[1]})`)}
    else el('rect',{x:X,y:Y,width:W,height:H,fill:'rgba(255,240,160,.1)'},fr);
    el('rect',{x:X,y:Y,width:W,height:H,fill:'none',stroke:'#c9a24a','stroke-width':5},fr);el('rect',{x:X+3,y:Y+3,width:W-6,height:H-6,fill:'none',stroke:'#8a6a2a','stroke-width':1.5},fr);
    const t=el('text',{x:X+W/2,y:BY+24,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff4e6'},fr);t.textContent=`${w} across`;
    const t2=el('text',{x:X+W+8,y:Y+H/2+5,'font-size':14,'font-weight':700,fill:'#fff4e6'},fr);t2.textContent=`${h} up`;
    kn.setAttribute('transform',`translate(${X+W},${Y})`);kn.style.display=drag&&!locked?'':'none'}
  const set=(a,b)=>{a=clamp(a,1,cols);b=clamp(b,1,rows);if(a===w&&b===h)return;w=a;h=b;SFX.tick(w+h);draw();onChange&&onChange(w,h)};
  if(drag){const hit=el('rect',{x:x0-12,y:y0-12,width:cols*cs+24,height:rows*cs+24,fill:'transparent'},hitL);hitL.insertBefore(hit,kn);
    const at=p=>[Math.round((p.x-x0)/cs),Math.round((BY-p.y)/cs)];
    interact(hitL,{label,down:p=>{if(!locked)set(...at(p));return{}},move:p=>{if(!locked)set(...at(p))},tap:p=>{if(!locked&&p)set(...at(p))}});
    hitL.addEventListener('keydown',e=>{if(locked)return;const K={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(K){e.preventDefault();set(w+K[0],h+K[1])}})}
  draw();return{g,get:()=>[w,h],lock:b=>{locked=b;draw()},show:(a,b)=>{shown=[a,b];draw()},resize:(a,b)=>{w=a;h=b;draw()},hide:()=>{shown=null;draw()}}}

W.giant={scene:'hills',
notes:`<p>Scale factor and "in proportion". The giant's things are 2 times (then 3 times) as big as Kai's. On the grid she drags the corner of the giant's frame to size it (the frame shows its sides across and up), then presses Hang. Kai's portrait goes into the frame: if every side was multiplied by the same number he looks just right; if she added instead (2 × 3 to 4 × 5) he comes out squashed or stretched, which is what "out of proportion" means.</p>
<p>Rounds: times 2, times 3, then turned round: the giant's frame is 8 × 4 and his things are 4 times as big, so make Kai's (2 × 1). Then: a 2 × 3 frame and a 6 × 9 frame, how many times bigger? (× 3, + 4 or × 4: adding 4 works across but not up). Last: which of three big frames is in proportion with Kai's? A wrong try gives new numbers.</p>`,
mount(root){
  const R=[{k:'big',f:2,p:[[2,3],[3,1],[1,4]]},{k:'big',f:3,p:[[2,3],[1,2],[3,1]]},{k:'small',f:4,p:[[8,4],[4,12],[12,8]]},{k:'sf',p:[[2,3,3],[3,2,2],[1,3,4]]},{k:'which',p:[[2,3,3],[3,2,2],[1,3,3]]}];
  const S={r:0,busy:false,won:false,pi:{},pick:null};
  const board=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=kaiGuide(ui);let small=null,big=null,cardL=null;
  const st=navStone({label:'Next frame',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this frame again',onTap:()=>load()});
  const goB=decGo(ui,540,486,'Hang the frame',hang,'Hang');
  const Q=()=>{const q=R[S.r],v=q.p[(S.pi[S.r]||0)%q.p.length];if(q.k==='small')return{k:'small',f:q.f,W:v[0],H:v[1],w:v[0]/q.f,h:v[1]/q.f};
    if(q.k==='sf')return{k:'sf',w:v[0],h:v[1],f:v[2],W:v[0]*v[2],H:v[1]*v[2]};if(q.k==='which')return{k:'which',w:v[0],h:v[1],f:v[2],W:v[0]*v[2],H:v[1]*v[2]};return{k:'big',f:q.f,w:v[0],h:v[1],W:v[0]*q.f,H:v[1]*q.f}};
  const CS=24,SG={x0:44,y0:138,cs:CS,cols:4,rows:12},BG={x0:196,y0:138,cs:CS,cols:12,rows:12};
  const parts=(q,done)=>q.k==='sf'?[['w',`${q.w} × ${q.h}`],['o','→'],['w',`${q.W} × ${q.H}`],['t','is'],done?['w',`× ${q.f}`]:['o','?']]
    :q.k==='which'?[['w',`${q.w} × ${q.h}`],['o','→'],done?['w',`${q.W} × ${q.H}`]:['o','?'],['t','in proportion']]
    :done?(q.k==='small'?[['w',`${q.W} × ${q.H}`],['o','→'],['w',`${q.w} × ${q.h}`],['t',`(÷ ${q.f})`]]:[['w',`${q.w} × ${q.h}`],['o','→'],['w',`${q.W} × ${q.H}`],['t',`(× ${q.f})`]])
    :[['t','scale factor'],['o','='],['w',q.k==='small'?`÷ ${q.f}`:`× ${q.f}`]];
  function judge(q,a,b,A,B,want){/* a×b is the original, A×B the copy, want the factor (copy ÷ original) */
    if(A===a*want&&B===b*want)return 'ok';if(A*b===B*a)return 'prop';return A-a===B-b?'added':'stretch'}
  function hang(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='sf'||q.k==='which'){if(S.pick==null){say(q.k==='sf'?'Tap the card you think is right, then Check.':'Tap the frame you think is in proportion, then Hang.');return}
      S.busy=true;goB.style.display='none';
      if(q.k==='sf'){const ok=S.pick===`× ${q.f}`;if(!ok&&S.pick.startsWith('+')){const d=+S.pick.slice(2);big.resize(q.w+d,q.h+d)}big.show(q.w,q.h);small.show(q.w,q.h);
        later(900,()=>{if(ok)win(q,`${q.w} × ${q.f} = ${q.W} and ${q.h} × ${q.f} = ${q.H}: the scale factor is ${q.f}. Both sides are multiplied by it.`);
          else miss(S.pick.startsWith('+')?`Adding ${S.pick.slice(2)} makes ${q.W} × ${q.h+(+S.pick.slice(2))}, and Kai is squashed: the giant’s is ${q.W} × ${q.H}. Scale factors multiply.`:`${q.w} ${S.pick} isn’t ${q.W}. Which number times ${q.w} makes ${q.W}?`)});return}
      cardL.querySelectorAll('[data-o]').forEach(c=>{const [A,B]=c.dataset.o.split(',').map(Number),fg=c.querySelector('.mini');fg.innerHTML='';const s=11,p=kaiPortrait(fg,q.w,q.h);p.setAttribute('transform',`translate(${-A*s/2},${-B*s/2}) scale(${A*s/q.w},${B*s/q.h})`)});
      later(900,()=>{const [A,B]=S.pick.split(',').map(Number);if(A*q.h===B*q.w)win(q,`${A} × ${B} is ${q.w} × ${q.h} with both sides times ${A/q.w}: in proportion, so Kai looks right.`);
        else miss(`${A} × ${B} ${B/A>q.h/q.w?'stretches':'squashes'} Kai: it isn’t ${q.w} × ${q.h} with both sides times the same number.`)});return}
    S.busy=true;const drawn=q.k==='small'?small:big;drawn.lock(true);goB.style.display='none';const [A,B]=drawn.get();
    const [a,b,want]=q.k==='small'?[q.W,q.H,1/q.f]:[q.w,q.h,q.f];
    /* hang the portrait: it's drawn for the original, then scaled into her frame */
    if(q.k==='small')small.show(q.w,q.h);else big.show(q.w,q.h)
    later(900,()=>{const j=judge(q,a,b,A,B,want),word=B/A>b/a?'stretched tall':'squashed flat';
      if(j==='ok'){win(q,q.k==='small'?`${q.W} ÷ ${q.f} = ${A} and ${q.H} ÷ ${q.f} = ${B}. Kai’s frame is ${A} × ${B}, in proportion!`:`${q.w} × ${q.f} = ${A} and ${q.h} × ${q.f} = ${B}. Every side times ${q.f}: Kai looks just right!`);return}
      miss(j==='prop'?`Kai looks right, so it’s in proportion, but it’s the wrong size: every side should be ${q.k==='small'?'divided':'multiplied'} by ${q.f}.`:j==='added'?`You added ${Math.abs(A-a)} to each side, so Kai is ${word}! Multiply every side by ${q.f} instead.`:`Kai is ${word}: the sides weren’t ${q.k==='small'?'divided':'multiplied'} by the same number.`)})}
  function miss(msg){SFX.wrong();shake(2);say(msg+' New frames…');S.pi[S.r]=(S.pi[S.r]||0)+1;later(4600,load)}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();SFX.chime();kaiWin(guide);decQ(qL,parts(q,true),true,guide);say(msg);burst(340,280,{n:16,cols:['#4aa0ff','#fff0a0','#5ac85a']});
    if(S.r>=2)unlock('factor');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';board.innerHTML='';if(cardL)cardL.remove();cardL=null;const q=Q();Object.assign(S,{busy:false,won:false,pick:null});st.ready(false);navDots(R.length,S.r);goB.style.display='';guide.tint(KAI_GREY,0);
    goB.querySelector('text').textContent=q.k==='sf'?'Check':'Hang';
    if(q.k!=='which'){small=frameGrid(board,Object.assign({w:q.k==='small'?1:q.w,h:q.k==='small'?1:q.h,drag:q.k==='small',title:'Kai’s',label:'Kai’s frame corner: drag it to size the frame'},SG));
      big=frameGrid(board,Object.assign({w:q.k==='big'?1:q.W,h:q.k==='big'?1:q.H,drag:q.k==='big',title:'the giant’s',label:'Giant’s frame corner: drag it to size the frame'},BG));
      if(q.k!=='small')small.show(q.w,q.h);else big.show(q.W/q.f,q.H/q.f)}
    else{small=frameGrid(board,Object.assign({w:q.w,h:q.h,drag:false,title:'Kai’s'},SG));small.show(q.w,q.h);cardL=el('g',{},ui);
      const d=q.W-q.w,opts=[[q.W,q.H],[q.w+d,q.h+d],[q.W,(q.h+1)*q.f]].sort(()=>Math.random()-.5);
      opts.forEach(([A,B],i)=>{const cx=258+i*118,cy=300,c=el('g',{transform:`translate(${cx},${cy})`},cardL);c.dataset.o=`${A},${B}`;
        el('rect',{x:-54,y:-120,width:108,height:240,rx:12,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2.5},c);const s=11;
        for(let k=-3;k<=3;k++){el('line',{x1:k*s,x2:k*s,y1:-100,y2:100,stroke:'rgba(255,244,230,.08)'},c)}
        el('g',{class:'mini'},c);el('rect',{x:-A*s/2,y:-B*s/2,width:A*s,height:B*s,fill:'none',stroke:'#c9a24a','stroke-width':3.5},c);
        el('text',{y:110,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#fff4e6'},c).textContent=`${A} × ${B}`;
        interact(c,{label:`Giant frame ${A} by ${B}`,tap:()=>{if(S.busy||S.won)return;S.pick=`${A},${B}`;SFX.pop(1.1);[...cardL.children].forEach(x=>{const r=x.firstChild,on=x===c;r.setAttribute('stroke',on?'#fff0a0':'#c9a24a');r.setAttribute('stroke-width',on?5:2.5);r.setAttribute('fill',on?'#4a3c8a':'#2a2245');x.style.opacity=on?1:.6})}})})}
    if(q.k==='sf'){cardL=el('g',{},ui);const opts=[`× ${q.f}`,`+ ${q.W-q.w}`,`× ${q.f+1}`].sort(()=>Math.random()-.5);
      opts.forEach((o,i)=>ratioCard(cardL,540,170+i*76,o,{w:90,h:56,label:`Scale card ${o}`,onTap:c=>{if(S.busy||S.won)return;S.pick=o;SFX.pop(1.1);pickCard(cardL,c)}}))}
    decQ(qL,parts(q,false),false,guide);
    say(S.r===0?`The giant’s things are ${q.f} times as big. Drag the corner to make his frame, then Hang.`
      :q.k==='big'?`Now ${q.f} times as big. Make the giant’s frame, then Hang.`
      :q.k==='small'?`Turned round! The giant’s is ${q.W} × ${q.H}, ${q.f} times as big. Make Kai’s.`
      :q.k==='sf'?'How many times bigger is the giant’s frame? Tap a card, then Check.'
      :'Which giant frame is in proportion with Kai’s? Tap it, then Hang.')}
  W.giant.dbgQ=Q;S.r=resumeAt(R.length);load();
}};
