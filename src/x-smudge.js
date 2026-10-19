/* ---------- 7. The Smudge: the boss of the Ratio Isles ---------- */
W.smudge={scene:'grey',
notes:`<p>The finale of the Ratio Isles. The Smudge has drained the colour out of the isles and is sulking under the grey rainbow. Seven questions, one from each island and each answered that island's way: a necklace (red : blue = 2 : 3 with 12 blue, how many red?), a jar of paint to finish, honey pots to share in a ratio with the bar model, pancakes to scale, a giant's frame to draw, a bridge to measure from a map, and which ratio is the same as 2 : 3.</p>
<p>Every right answer splashes one of Kai's colours onto the Smudge. Three paint drops: a wrong answer and the Smudge sniggers and one drop dries up (the next try uses different numbers); lose all three and one colour washes off again. Splash all seven and the Smudge turns back into a rainbow.</p>`,
mount(root){
  const Q=[{t:'beads',c:'beads',v:[[2,3,12],[1,4,12],[3,2,10]]},{t:'paint',c:'paint',v:[[1,2,3],[1,3,2],[2,3,4]]},{t:'pan',c:'pancakes',v:[[2,1,100,6],[4,2,300,10],[3,1,150,9]]},{t:'split',c:'split',v:[[1,3,16],[2,3,15],[3,1,20]]},
    {t:'giant',c:'giant',v:[[3,2,2],[2,1,3],[1,3,2]]},{t:'river',c:'river',v:[[5,5],[10,3.5],[20,4]]},{t:'same',c:'smudge',v:[[2,3,3],[3,5,2],[1,4,3]]}];
  const S={r:0,drops:3,busy:false,done:false,vr:{},pick:null};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),hud=el('g',{},root);
  const MX=500,MY=150,sm=smudgeFig(side,{s:.8});sm.g.setAttribute('transform',`translate(${MX},${MY}) scale(.8)`);
  const dropL=el('g',{},hud);
  function drawDrops(){dropL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.drops,g=el('g',{transform:`translate(${30+k*32},34)`},dropL);
    el('path',{d:'M0,-16 C6,-6 12,0 12,6 A12,12 0 0 1 -12,6 C-12,0 -6,-6 0,-16Z',fill:on?['#ff5a6a','#ffd23a','#4aa0ff'][k]:'#3a3848',stroke:on?'#fff4e6':'#55536a','stroke-width':1.5},g);
    if(on)el('circle',{cx:-4,cy:2,r:3,fill:'#fff',opacity:.6},g)}}
  let loopT=0;
  const goBtn=(fn,txt,lab)=>decGo(arena,520,486,lab,fn,txt);
  function hit(msg,parts){S.busy=true;sm.splash(ISLE_COL[Q[S.r].c]);sm.mood('oh');SFX.chime();SFX.splash&&SFX.splash();shake(5);
    floatText(MX,MY-70,['Splat!','Eek!','Oi!','Bleurgh!','Splosh!','Nooo!','Aaah!'][S.r],{col:ISLE_COL[Q[S.r].c],size:22});later(800,()=>sm.mood(''));
    if(parts)decQ(qL,parts,true,null);say(`${msg} Splat! A colour is back!`);later(2600,()=>{if(S.r===Q.length-1)finale();else{S.r++;load()}})}
  function miss(msg){S.busy=true;SFX.laugh&&SFX.laugh();sm.mood('happy');S.drops--;drawDrops();shake(4);ring(30+S.drops*32,34,{col:'#9a9aae',r1:40});
    say(`${msg} The Smudge sniggers!`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(2800,()=>{sm.mood('');if(S.drops<=0)lost();else load()})}
  function lost(){S.drops=3;if(S.r>0){S.r--;sm.unsplash()}say('Your paint drops dried up, and one colour washed off. Try again!');later(2600,load)}
  const cards=(vals,fmt,lab,y0=250)=>{const L=el('g',{},arena);vals.sort(()=>Math.random()-.5).forEach((v,i)=>ratioCard(L,520,y0+i*72,fmt(v),{w:104,h:56,label:`${lab} ${fmt(v)}`,onTap:c=>{if(S.busy)return;S.pick=v;SFX.pop(1.1);pickCard(L,c)}}));return L};
  const M={
    beads([R,B,blue]){const ans=blue/B*R,inv=Number.isInteger(blue/R*B)?blue/R*B:ans+5,add=blue+(R-B)!==ans?blue+(R-B):ans+2;
      const grp=el('g',{},arena);el('rect',{x:40,y:110,width:250,height:64,rx:14,fill:'#2a2245',stroke:'#c9a24a','stroke-width':2.5},grp);el('text',{x:165,y:104,'text-anchor':'middle','font-size':12.5,'font-weight':700,fill:'#fff0a0'},grp).textContent='the pattern';
      [...Array(R).fill('r'),...Array(B).fill('b')].forEach((c,i)=>bead(grp,64+i*34,142,bcol(c),12));
      const L=beadLayout(Array(blue/B).fill(null).map(()=>[...Array(R).fill('r'),...Array(B).fill('b')]),{x1:430,y0:352,dy:62});
      const jar=el('g',{},arena);el('rect',{x:40,y:200,width:250,height:110,rx:16,fill:'rgba(255,244,230,.1)',stroke:'rgba(255,244,230,.5)','stroke-width':2.5},jar);for(let i=0;i<blue;i++)bead(jar,62+(i%8)*30,226+Math.floor(i/8)*30,BBLUE,12);
      el('text',{x:165,y:330,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#fff4e6'},jar).textContent=`${blue} blue beads`;
      cards([ans,inv,add],v=>String(v),'Red beads');
      goBtn(()=>{if(S.busy)return;if(S.pick==null){say('Tap a card first.');return}const ok=S.pick===ans;S.busy=true;jar.setAttribute('opacity',.35);L.pos.forEach((p,i)=>later(i*40,()=>bead(arena,p.x,p.y,bcol(p.c),12)));
        later(L.pos.length*40+500,()=>ok?hit(`${blue} blue is ${blue/B} groups of ${B}, so ${blue/B} × ${R} = ${ans} red.`,[['w',RAT(R,B)],['o','='],['w',RAT(ans,blue)]]):miss(`Count the groups: ${blue} blue is ${blue/B} groups of ${B}, so ${ans} red, not ${S.pick}.`))},'Thread','Thread the necklace');
      return{parts:[['t','red : blue'],['o','='],['w',RAT(R,B)],['t',`, ${blue} blue, red`],['o','='],['o','?']],say:`Red : blue = ${RAT(R,B)}, with ${blue} blue beads. How many red?`}},
    paint([ra,rb,pre]){const jar=jarKit(arena,{x:150,y:120,w:100,h:300,cap:14,layers:Array(pre).fill('red'),fixed:pre}),tgt=mixPaint([[PAINT.red,ra],[PAINT.white,rb]]);
      swatch(arena,74,180,tgt,'Kai’s colour',`${ra} red : ${rb} white`);paintTub(arena,520,260,'white',()=>{if(!S.busy)jar.add('white')});
      goBtn(()=>{if(S.busy)return;const c=jar.counts(),W=c.white||0;if(!W){say('Add some white first.');return}S.busy=true;jar.lock(true);
        jar.stir(col=>{swatch(arena,74,330,col,'your mix',RAT(pre,W));if(pre*rb===W*ra)hit(`${RAT(pre,W)} is the same as ${RAT(ra,rb)}: the same colour!`,[['w',RAT(ra,rb)],['o','='],['w',RAT(pre,W)]]);else miss(`${RAT(pre,W)} isn’t ${RAT(ra,rb)}: ${pre} red needs ${pre*rb/ra} white.`)})},'Stir','Stir the paint');
      return{parts:[['t','red : white'],['o','='],['w',RAT(ra,rb)],['o','='],['w',RAT(pre,'?')]],say:`The jar has ${pre} red. Add white to make exactly ${ra} red : ${rb} white, then Stir.`}},
    split([a,b,N]){const kit=dealKit(arena,{a,b,N,BX:120,BW:56,YA:250,YB:344,pileY:128,faceX:66,faceS:1});
      goBtn(()=>{if(S.busy)return;const s=kit.state();if(s.left>0){say('Share every pot first.');return}if(!s.equal){say('Not fair yet! Every box the same.');return}kit.lock(true);hit(`${N} ÷ ${a+b} boxes = ${s.k} a box: ${s.a} and ${s.b}.`,[['w',RAT(a,b)],['o','='],['w',RAT(s.a,s.b)]])},'Share','Share out the pots');
      return{parts:[['w',N],['t','pots,'],['t','bear : badger'],['o','='],['w',RAT(a,b)]],say:`Share ${N} pots, bear : badger = ${RAT(a,b)}. Drag them into the boxes, then Share.`}},
    pan([per,e0,m0,T]){let eggs=0;const E=e0*T/per,Mm=m0*T/per,bowl=el('g',{},arena);
      const draw=()=>{bowl.innerHTML='';el('ellipse',{cx:150,cy:300,rx:80,ry:18,fill:'#5a4a7a'},bowl);for(let i=0;i<eggs;i++){const e=el('g',{transform:`translate(${100+(i%5)*26},${292+Math.floor(i/5)*12})`},bowl);el('ellipse',{rx:12,ry:7,fill:'#fff8ec'},e);el('circle',{r:5,fill:'#ffc04d'},e);
          interact(e,{label:`Egg ${i+1} in the bowl: tap to take it out`,tap:()=>{if(S.busy)return;eggs--;draw()}})}
        el('path',{d:'M66,300 Q70,370 150,374 Q230,370 234,300',fill:'#e8dcc8',stroke:'#a8907a','stroke-width':3},bowl)};draw();
      const jug=milkJug(arena,{x:300,y:170,h:220});const box=el('g',{transform:'translate(520,250)'},arena);el('rect',{x:-44,y:-22,width:88,height:44,rx:8,fill:'#c9a77a',stroke:'#8a6a4a','stroke-width':2},box);
      [-27,-9,9,27].forEach(x=>el('ellipse',{cx:x,cy:-4,rx:8,ry:10,fill:'#fff8ec'},box));interact(box,{label:'Crack an egg into the bowl',tap:()=>{if(S.busy||eggs>=10)return;eggs++;SFX.pop(1);draw()}});
      goBtn(()=>{if(S.busy)return;const m=jug.get();if(!eggs||!m){say('Eggs and milk, then Cook.');return}jug.lock(true);
        if(eggs===E&&m===Mm)hit(`${T} people: ${E} egg${E>1?'s':''} and ${Mm} ml. Every ingredient times ${T/per===Math.round(T/per)?T/per:'the same number'}.`,[['w',`${T} people`],['o','='],['w',`${E} eggs + ${Mm} ml`]]);
        else miss(eggs*m0===m*e0?`Good mix, but enough for ${eggs*per/e0} people, not ${T}.`:`The mix is wrong: eggs and milk must be scaled by the same number.`)},'Cook','Cook the pancakes');
      return{parts:[['w',`${per} people`],['o','='],['w',`${e0} egg${e0>1?'s':''} + ${m0} ml`]],say:`That recipe is for ${per} people. Make pancakes for ${T}: crack the eggs, pour the milk, then Cook.`}},
    giant([w,h,f]){const sg=frameGrid(arena,{x0:40,y0:150,cs:20,cols:4,rows:12,w,h,drag:false,title:'Kai’s'});sg.show(w,h);
      const bg=frameGrid(arena,{x0:150,y0:150,cs:20,cols:12,rows:12,w:1,h:1,drag:true,title:'the giant’s',label:'Giant’s frame corner: drag it to size the frame'});
      goBtn(()=>{if(S.busy)return;const [A,B]=bg.get();bg.lock(true);bg.show(w,h);later(800,()=>{if(A===w*f&&B===h*f)hit(`${w} × ${f} = ${A} and ${h} × ${f} = ${B}: in proportion!`,[['w',`${w} × ${h}`],['o','→'],['w',`${A} × ${B}`]]);
        else miss(A*h===B*w?`In proportion, but the wrong size: times ${f}.`:`Kai is ${B/A>h/w?'stretched':'squashed'}: both sides must be multiplied by ${f}.`)})},'Hang','Hang the frame');
      return{parts:[['t','scale factor'],['o','='],['w',`× ${f}`]],say:`The giant’s things are ${f} times as big. Drag the corner to make his frame, then Hang.`}},
    river([sc,n]){const map=riverMap(arena,{x0:56,y0:124,cs:40,cols:8,rows:6}),L=56+2*40,Rr=L+n*40,yc=124+3.5*40;
      el('rect',{x:L,y:124,width:Rr-L,height:240,fill:'#5a9ad8',opacity:.85},map.g);for(let x=56;x<=56+8*40;x+=40)if(x>L-1&&x<Rr+1)el('line',{x1:x,x2:x,y1:124,y2:364,stroke:'#e8f2ff','stroke-width':1.2,opacity:.6},map.g);for(let y=124;y<=364;y+=40)el('line',{x1:L,x2:Rr,y1:y,y2:y,stroke:'#e8f2ff','stroke-width':1.2,opacity:.6},map.g);
      el('line',{x1:L,x2:Rr,y1:yc,y2:yc,stroke:'#7a3a1e','stroke-width':3,'stroke-dasharray':'8 6'},map.g);for(let x=L;x<=Rr+.5;x+=40)el('line',{x1:x,x2:x,y1:yc-7,y2:yc+7,stroke:'#7a3a1e','stroke-width':3},map.g);
      [L,Rr].forEach(x=>el('path',{d:`M${x},${yc} v-24 l14,5 l-14,5`,fill:'#e23a3a',stroke:'#5a3a1a','stroke-width':2.5},map.g));
      const k=el('g',{transform:'translate(57,338) scale(.66)'},arena);el('rect',{width:116,height:30,rx:6,fill:'#fff4e6',stroke:'#8a6a3a'},k);el('rect',{x:8,y:7,width:16,height:16,fill:'none',stroke:'#3a2418','stroke-width':1.5},k);el('text',{x:30,y:20,'font-size':12.5,'font-weight':700,fill:'#3a2418'},k).textContent=`= ${sc} m`;
      const tp=tape(arena,{x:56,y:460,w:380,max:100});
      goBtn(()=>{if(S.busy)return;const v=tp.get();if(!v){say('Set the bridge length on the tape first.');return}tp.lock(true);if(v===sc*n)hit(`${halfTxt(n)} squares × ${sc} m = ${v} m.`,[['w',`${halfTxt(n)} squares`],['o','='],['w',`${v} m`]]);else miss(`${halfTxt(n)} squares × ${sc} m = ${sc*n} m, not ${v} m.`)},'Build','Build the bridge');
      return{parts:[['t','1 square'],['o','='],['w',`${sc} m`],['t',', bridge'],['o','='],['o','?']],say:'How long must the real bridge be? Set the tape, then Build.'}},
    same([a,b,k]){const opts=[[a*k,b*k],[a+k,b+k],[a*k,(b+1)*k]];cards(opts,v=>RAT(...v),'Ratio card',230);
      const big=el('g',{},arena);[[a,b,'#ff9ed2']].forEach(()=>{for(let i=0;i<a;i++)bead(big,80+i*34,220,BRED,14);for(let i=0;i<b;i++)bead(big,80+(a+i)*34,220,BBLUE,14)});
      el('text',{x:80,y:180,'font-size':16,'font-weight':700,fill:'#fff4e6'},big).textContent=`one group: ${RAT(a,b)}`;
      goBtn(()=>{if(S.busy)return;if(S.pick==null){say('Tap a card first.');return}const [x,y]=S.pick;
        if(x*b===y*a)hit(`${RAT(x,y)} is ${RAT(a,b)} with both parts times ${x/a}: the same ratio.`,[['w',RAT(a,b)],['o','='],['w',RAT(x,y)]]);
        else miss(`${RAT(x,y)} isn’t ${RAT(a,b)} with both parts times the same number.`)},'Check','Check the ratio');
      return{parts:[['w',RAT(a,b)],['o','='],['o','?']],say:`Which ratio is the same as ${RAT(a,b)}? Tap a card, then Check.`}}};
  function finale(){S.done=true;S.busy=true;SFX.fanfare();SFX.wake&&SFX.wake();arena.innerHTML='';sm.rainbow();
    const rb=rainbowFig(arena,{bright:true});rb.g.setAttribute('transform','translate(250,360) scale(1.6)');popIn(rb.g,.3);
    for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*360,120+Math.random()*320,{n:10,cols:['#ff5a6a','#ff9a3a','#ffd23a','#5ac85a','#4aa0ff','#9a6cff']}));
    decQ(qL,[['t','The rainbow is back!']],true,null);
    say('Every colour is back! The Smudge is a rainbow again. You did it!');unlock('smudge');clearIsland('smudge');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{S.r=0;S.drops=3;S.done=false;S.vr={};go('smudge')}});s.ready(true)})}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';S.busy=false;S.pick=null;navDots(Q.length,S.r,true);drawDrops();sm.mood('');
    loop(dt=>{loopT+=dt;sm.tick(loopT)});
    const q=Q[S.r],m=M[q.t](V());decQ(qL,m.parts,false,null);
    say(S.r===0&&S.drops===3&&!S.vr[0]?`Mistakes dry up paint drops! ${m.say}`:m.say)}
  load();
}};
