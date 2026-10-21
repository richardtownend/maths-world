
function floatRock(parent,{x,y,s=1,top='#6f4a92',rim='#5b3b78',under='#2e2150',seam='#3b2b63'}){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},parent);
  el('path',{d:'M-138,-6 Q-120,40 -70,70 Q-30,130 4,150 Q40,120 76,66 Q122,36 138,-6Z',fill:under},g);
  el('path',{d:'M-60,60 Q-20,110 4,150 Q10,100 40,70',fill:seam,opacity:.8},g);
  el('ellipse',{cx:0,cy:-6,rx:140,ry:40,fill:rim},g);el('ellipse',{cx:0,cy:-10,rx:132,ry:34,fill:top},g);el('ellipse',{cx:-30,cy:-18,rx:70,ry:12,fill:'#fff',opacity:.08},g);
  return g}
/* purple lightning around the Gloom while it waits */
function gloomBolts(layer,cx,cy,R){let next=1.5;return dt=>{next-=dt;if(next>0)return;next=2.5+Math.random()*3;const a=Math.random()*Math.PI*2;let x=cx+Math.cos(a)*R*.4,y=cy+Math.sin(a)*R*.3,d=`M${x.toFixed(0)},${y.toFixed(0)}`;
  for(let k=0;k<5;k++){x+=Math.cos(a)*R*.14+(Math.random()-.5)*16;y+=Math.sin(a)*R*.1+(Math.random()-.5)*16;d+=` L${x.toFixed(0)},${y.toFixed(0)}`}
  const b=el('path',{d,stroke:'#d8c8ff','stroke-width':2.5,fill:'none',filter:'url(#glow)','stroke-linejoin':'round'},layer);SFX.rumble&&Math.random()<.4&&SFX.rumble();tween(360,(t,p)=>b.setAttribute('opacity',(1-p).toFixed(2)),()=>b.remove(),ease.lin)}}


/* the Magic Mirror: the centre of the Starter Isles */
function mirrorFig(parent,{solved=false}={}){const g=el('g',{},parent),rays=el('g',{},g);
  if(solved)SHARDC.forEach((c,i)=>{const a=i*Math.PI/4;el('path',{d:`M0,-40 L${(Math.cos(a-.1)*150).toFixed(1)},${(-40+Math.sin(a-.1)*150).toFixed(1)} L${(Math.cos(a+.1)*150).toFixed(1)},${(-40+Math.sin(a+.1)*150).toFixed(1)}Z`,fill:c,opacity:.18},rays)});
  el('ellipse',{cx:0,cy:-40,rx:80,ry:96,fill:'url(#gGlC)',opacity:solved?.9:.35},g);
  el('path',{d:'M-10,40 L-16,62 M10,40 L16,62',stroke:'#c98a3a','stroke-width':5,'stroke-linecap':'round'},g);
  el('ellipse',{cx:0,cy:-40,rx:44,ry:62,fill:'#c98a3a'},g);el('ellipse',{cx:0,cy:-40,rx:40,ry:58,fill:'#ffd27a'},g);
  el('ellipse',{cx:0,cy:-40,rx:34,ry:52,fill:solved?'#e9f4ff':'#9aa8d8'},g);
  const sh=el('path',{d:'M-22,-70 L-6,-86 L-2,-80 L-18,-64Z M-26,-50 L-4,-72 L0,-66 L-22,-44Z',fill:'#fff',opacity:.55},g);
  el('text',{x:0,y:-28,'text-anchor':'middle','font-size':34,'font-weight':700,fill:solved?'#9a6cff':'#3a2861',opacity:.7},g).textContent=solved?'✓':'×÷';
  [[0,-104],[-44,-40],[44,-40],[0,24]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:6,fill:'#ff9ed2',stroke:'#fff4e6','stroke-width':1.5},g));
  return{g,tick:t=>{rays.setAttribute('transform',`rotate(${(t*8%360).toFixed(1)} 0 -40)`);sh.setAttribute('opacity',(.35+.3*Math.sin(t*2)).toFixed(2))}}}
/* what waits in the middle of each world */
const CENTRE={
  fractions:{w:'boss',fig:(g,done)=>done?glimFig(g,34):gloomFig(g),scale:done=>done?1:.6,dy:-46,rock:'#3a2a5c',name:'The Gloom',
    sign:(done,open,left)=>done?['Gloom defeated!','tap to battle again']:open?['Face the Gloom!','all islands cleared']:['The Gloom waits',`${left} island${left===1?'':'s'} to go`],
    locked:left=>`The Gloom is waiting. Clear every island to face it: ${left} to go.`},
  starter:{w:'mirror',fig:(g,done)=>mirrorFig(g,{solved:done}),scale:()=>.9,dy:-10,rock:'#4a5a8a',name:'The Muddler',
    sign:(done,open,left)=>done?['Muddler unmuddled!','tap to battle again']:open?['Face the Muddler!','all islands cleared']:['The Muddler waits',`${left} island${left===1?'':'s'} to go`],
    locked:left=>`The Muddler is hiding in the Magic Mirror. Clear the other islands to face it: ${left} to go.`},
  decimals:{w:'magpie',fig:(g,done)=>lighthouseFig(g,{lit:done}),scale:()=>.72,dy:14,rock:'#3a5a8a',name:'The Magpie',
    sign:(done,open,left)=>done?['The light is back!','tap to battle again']:open?['Face the Magpie!','all islands cleared']:['The Magpie waits',`${left} island${left===1?'':'s'} to go`],
    locked:left=>`The Magpie has stolen Dot and the lighthouse is dark. Clear the other islands to face it: ${left} to go.`},
  shapes:{w:'kraken',fig:(g,done)=>whirlFig(g,{calm:done}),scale:()=>.85,dy:-6,rock:'#2a6a7a',name:'The Kraken',
    sign:(done,open,left)=>done?['The map is whole!','tap to battle again']:open?['Face the Kraken!','all islands cleared']:['The Kraken waits',`${left} island${left===1?'':'s'} to go`],
    locked:left=>`The Kraken is tangled in the whirlpool with Shelly's map. Clear the other islands to face it: ${left} to go.`}};
CENTRE.story={w:'inkblot',fig:(g,done)=>bookFig(g,{clean:done}),scale:()=>.9,dy:10,rock:'#4a3a6a',name:'The Inkblot',
  sign:(done,open,left)=>done?['Stories mended!','tap to battle again']:open?['Face the Inkblot!','all islands cleared']:['The Inkblot waits',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`The Inkblot has splashed the storybook. Clear the other islands to face it: ${left} to go.`};
CENTRE.time={w:'snooze',fig:(g,done)=>towerClockFig(g,{going:done}),scale:()=>.75,dy:24,rock:'#5a4a3a',name:'The Snooze',
  sign:(done,open,left)=>done?['The clocks are ticking!','tap to battle again']:open?['Wake the Snooze!','all islands cleared']:['The Snooze is asleep',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`The Snooze has stopped the clock tower. Clear the other islands to wake it: ${left} to go.`};
CENTRE.money={w:'grabbit',fig:(g,done)=>coveCentreFig(g,{won:done}),scale:()=>.85,dy:20,rock:'#3a6a7a',name:'Captain Grabbit',
  sign:(done,open,left)=>done?['Treasure is back!','tap to battle again']:open?['Face Captain Grabbit!','all islands cleared']:['Grabbit has the gold',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`Captain Grabbit is sitting on the treasure. Clear the other islands to face him: ${left} to go.`};
CENTRE.graphs={w:'fudge',fig:(g,done)=>surveyCentreFig(g,{won:done}),scale:()=>.85,dy:20,rock:'#4a6a3a',name:'Fudge the fox',
  sign:(done,open,left)=>done?['The charts are honest!','tap to battle again']:open?['Face Fudge the fox!','all islands cleared']:['Fudge is fibbing',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`Fudge the fox is making charts that fib. Clear the other islands to face him: ${left} to go.`};
CENTRE.road={w:'gruff',fig:(g,done)=>roadCentreFig(g,{won:done}),scale:()=>.95,dy:22,rock:'#6a7a4a',name:'Gruff the goat',
  sign:(done,open,left)=>done?['The road is clear!','tap to battle again']:open?['Face Gruff the goat!','all islands cleared']:['Gruff is butting',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`Gruff the goat is knocking the milestones over. Clear the other islands to face him: ${left} to go.`};
CENTRE.ratio={w:'smudge',fig:(g,done)=>rainbowFig(g,{bright:done}),scale:()=>.8,dy:20,rock:'#5a5a7a',name:'The Smudge',
  sign:(done,open,left)=>done?['The rainbow is back!','tap to battle again']:open?['Face the Smudge!','all islands cleared']:['The Smudge waits',`${left} island${left===1?'':'s'} to go`],
  locked:left=>`The Smudge is sulking under the grey rainbow. Clear the other islands to face it: ${left} to go.`};
const BEATEN={fractions:'the Gloom is beaten',starter:'the Mirror is solved',decimals:'the lighthouse shines again',shapes:'the Kraken is untangled',ratio:'the rainbow is back',story:'the stories are mended',time:'the clocks are ticking again',money:'the treasure is back',graphs:'the charts are honest',road:'every milestone is standing'},AWAKE={road:'Every island is cleared. Tap the leaning milestone: Gruff the goat is waiting!',graphs:'Every island is cleared. Tap Fudge’s chart: the fox is waiting!',money:'Every island is cleared. Tap the treasure chest: Captain Grabbit is waiting!',time:'Every island is cleared. Tap the clock tower: the Snooze is waiting!',story:'Every island is cleared. Tap the storybook: the Inkblot is waiting!',ratio:'Every island is cleared. Tap the grey rainbow: the Smudge is waiting!',shapes:'Every island is cleared. Tap the whirlpool: the Kraken is waiting!',fractions:'Every island is cleared. The Gloom is awake: tap it to battle!',starter:'Every island is cleared. Tap the Magic Mirror!',decimals:'Every island is cleared. Tap the lighthouse: the Magpie is waiting!'};
/* a whole world in miniature: rock, ring of islands, bridges and what waits in the middle */
function worldModel(parent,wid,{cx,cy,rx,ry,ns,rock=.5,fs=.34}){const WW=worldById(wid),P=mine(),C=CENTRE[wid],ring=WW.isles.slice(0,-1),done=P.cleared.includes(C.w),n=ring.length;
  const g=el('g',{},parent);el('ellipse',{cx,cy,rx:rx+40,ry:ry+40,fill:'url(#gGlC)',opacity:.22},g);
  floatRock(g,{x:cx,y:cy+44*rock/.5,s:rock,top:done?'#8a6ab0':C.rock,rim:darker(C.rock,.8),under:'#241a40',seam:'#2e2150'});
  const N=ring.map((w,i)=>{const f=(240-i*300/(n-1))*Math.PI/180;return{w,i,x:cx+Math.cos(f)*rx,y:cy-Math.sin(f)*ry}});
  const br=el('g',{},g),nd=el('g',{},g);N.forEach((a,i)=>{if(i<n-1)bridge(br,a,N[i+1],P.cleared.includes(a.w),ns)});bridge(br,N[n-1],{x:cx+20,y:cy+40*rock/.5},P.cleared.includes(N[n-1].w),ns);
  [...N].sort((a,b)=>a.y-b.y).forEach(a=>islandNode(nd,a.w,{x:a.x,y:a.y,s:ns,label:false,beam:110}));
  const fg=el('g',{},g),fig=C.fig(fg,done),sc=C.scale(done)*fs/.6;
  return{g,tick:t=>{fig.tick(t);fg.setAttribute('transform',`translate(${cx},${(cy+C.dy*fs/.6+Math.sin(t*1.2)*3).toFixed(1)}) scale(${sc.toFixed(3)})`)}}}

/* ---------- the sky: home screen ---------- */
W.hub={scene:'hub',
notes:`<p>Home: one floating world per maths subject. Ten worlds are open, around the Eclipse in the middle of the sky: the Starter Isles (adding, taking away, times and sharing, ending at the Magic Mirror), the Fraction Isles (ending with the Gloom) the Decimal Isles (decimals and percentages, ending with the Magpie at the lighthouse) the Shape Isles (angles, coordinates, area, perimeter and nets, ending with the Kraken) the Ratio Isles (ratio and proportion, ending with the Smudge) the Story Isles (word problems acted out, ending with the Inkblot) the Clockwork Isles (telling the time, ending with the Snooze) and the Pirate Isles (money, with long division and multiplication, ending with Captain Grabbit), the Survey Isles (tallies, pictograms, bar charts and line graphs, ending with Fudge the fox), and the Old Road (Roman numerals and rounding, ending with Gruff the goat). Each is a little model of its island map. The sign at the top is this player's overall progress, and the balloon is theirs.</p>
<p>Each world sign has a number for the suggested order (a green tick once its boss is beaten) and a gold star on the next one for this player. There are two orders, set per player in the grown-up corner: the younger path (Starter, Survey, Clockwork, Pirate, Story, Fractions, Decimals, Old Road, Ratio, Shapes) and the older path (Clockwork, Pirate, Story, Fractions, Decimals, Old Road, Ratio, Shapes, Survey, then Starter last as a quick one, since its Muddler is one of the ten bosses). The moon gets brighter with each world boss beaten; with all ten, the Eclipse in the middle opens: the final boss, seven puzzles that each mix two worlds.</p>
<p>Tap a world to open its island map. Inside a world each island opens when the one before it is cleared (every round won once). The worlds don’t depend on each other.</p>
<p><b>Grown-up mode</b> (the padlock on the Who’s playing screen) opens everything for testing and holds the players: add, reset or remove them, and change the PIN. Progress is kept on this device only.</p>`,
mount(root){hubDefs(root);
  const name=pname(),P=mine(),done=P.cleared.length,tot=ALLISLES.length,me=grown()?null:player();
  const sky=skyFX(root,{seaY:492}),all=el('g',{},root),others=el('g',{},all),lantL=el('g',{},all),wld=el('g',{},all),fc=frontClouds(root,588),top=el('g',{},root);
  let flying=false;lantL.style.pointerEvents='none';
  /* worlds still to come */
  const SIL=[g=>{el('path',{d:'M-40,-8 Q-40,-60 0,-60 Q40,-60 40,-8 L26,-8 Q26,-44 0,-44 Q-26,-44 -26,-8Z',fill:'#1a1436'},g)},
    g=>{el('path',{d:'M-34,-8 Q-34,-58 0,-62 Q34,-58 34,-8Z',fill:'#1a1436'},g);el('rect',{x:-3,y:-80,width:6,height:20,fill:'#1a1436'},g)}];
  const OT=[];
  OT.forEach(([x,y,s,tp,rm,un],k)=>{const g=el('g',{},others),sil=el('g',{transform:`scale(${s})`,opacity:.8},g);SIL[k](sil);floatRock(g,{x:0,y:0,s,top:tp,rim:rm,under:un,seam:rm}).setAttribute('opacity',.9);
    [[-30,-12,36,9],[24,-26,32,8],[0,6,52,9]].forEach(([cx,cy,rx,ry],j)=>{const m=el('ellipse',{cx,cy,rx,ry,fill:'#e6dcf5',opacity:.38},g);m.classList.add('mote');m.style.animationDelay=(-(k*3+j)*1.7)+'s'});
    el('text',{x:0,y:-10,'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#fff4e6',opacity:.6},g).textContent='?';
    const sg=el('g',{transform:'translate(0,46)'},g);el('rect',{x:-50,y:-12,width:100,height:23,rx:11.5,fill:'#fff4e6',opacity:.92},sg);
    el('text',{x:0,y:4,'text-anchor':'middle','font-size':11.5,'font-weight':700,fill:'#3a2418'},sg).textContent='Coming soon';
    g.setAttribute('transform',`translate(${x},${y})`);
    interact(g,{label:'A world still to come',tap:()=>{if(flying)return;SFX.whoosh();say('That world is still in the mist. A new one is coming soon!')}})});
  const LN=[0,1,2,3].map(k=>{const l=el('g',{},lantL);el('circle',{r:9,fill:'#ffc04d',opacity:.2},l);el('path',{d:'M-4,-6 Q0,-7 4,-6 V5 Q0,6 -4,5Z',fill:'#e8513e'},l);el('rect',{x:-1.6,y:-3,width:3.2,height:6,rx:1.4,fill:'#ffd27a'},l);return{l,x:120+k*120+(k%2)*40,y:420+k*60,v:6+k*1.5}});
  /* the two open worlds */
  const MW=[{id:'fractions',cx:230,cy:160,rx:72,ry:46,ns:.23,rock:.23,fs:.17,sy:222,sw:150},{id:'road',cx:390,cy:150,rx:50,ry:36,ns:.26,rock:.2,fs:.18,sy:214,sw:124},{id:'starter',cx:84,cy:308,rx:56,ry:42,ns:.3,rock:.22,fs:.19,sy:374,sw:132},{id:'shapes',cx:86,cy:476,rx:50,ry:38,ns:.26,rock:.21,fs:.17,sy:536,sw:124},{id:'decimals',cx:516,cy:308,rx:58,ry:44,ns:.3,rock:.23,fs:.19,sy:374,sw:132},{id:'time',cx:228,cy:484,rx:50,ry:38,ns:.26,rock:.21,fs:.17,sy:544,sw:124},{id:'money',cx:372,cy:476,rx:50,ry:38,ns:.26,rock:.21,fs:.17,sy:536,sw:124},{id:'graphs',cx:514,cy:484,rx:48,ry:36,ns:.26,rock:.21,fs:.17,sy:544,sw:124},{id:'ratio',cx:72,cy:150,rx:50,ry:36,ns:.28,rock:.2,fs:.18,sy:214,sw:128},{id:'story',cx:528,cy:150,rx:50,ry:36,ns:.28,rock:.2,fs:.18,sy:214,sw:128}];
  const nextW=me?((me.path==='young'?PATHS.young:PATHS.old).find(w=>!P.cleared.includes(CENTRE[w].w))||(P.cleared.includes('eclipse')?null:'eclipse')):null;
  const models=MW.map(m=>{const WW=worldById(m.id),d=WW.isles.filter(w=>P.cleared.includes(w)).length,box=el('g',{},wld),mod=worldModel(box,m.id,m);
    const sg=el('g',{},box),sw=m.sw;el('rect',{x:m.cx-sw/2,y:m.sy,width:sw,height:50,rx:13,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},sg);
    el('text',{x:m.cx,y:m.sy+21,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#3a2418'},sg).textContent=WW.name;progressBar(sg,m.cx,m.sy+31,sw-34,d/WW.isles.length);
    /* the suggested order: a number on each sign, a tick when its boss is beaten, a gold star on the next one */
    const pth=me&&me.path==='young'?PATHS.young:PATHS.old,num=pth.indexOf(m.id)+1,bossDone=P.cleared.includes(CENTRE[m.id].w);
    if(num){const nb=el('g',{transform:`translate(${m.cx-sw/2-5},${m.sy-5})`},sg);el('circle',{r:12,fill:bossDone?'#3aa86a':'#6a4ac8',stroke:'#fff4e6','stroke-width':2},nb);
      el('text',{y:bossDone?5:4.5,'text-anchor':'middle','font-size':bossDone?14:13,'font-weight':800,fill:'#fff'},nb).textContent=bossDone?'✓':num}
    if(me&&m.id===nextW){el('rect',{x:m.cx-sw/2-3,y:m.sy-3,width:sw+6,height:56,rx:15,fill:'none',stroke:'#ffd23a','stroke-width':3.5,class:'ring'},sg);
      const st=el('g',{transform:`translate(${m.cx+sw/2-6},${m.sy-2})`},sg);el('path',{d:'M0,-12 l3.5,7.5 8.2,1 -6,5.6 1.6,8.1 -7.3,-4 -7.3,4 1.6,-8.1 -6,-5.6 8.2,-1Z',fill:'#ffd23a',stroke:'#c98a1a','stroke-width':1.5},st);
      el('text',{x:0,y:-16,'text-anchor':'middle','font-size':10,'font-weight':800,fill:'#ffd23a'},st).textContent='next'}
    interact(box,{label:WW.name,tap:()=>enter(m)});if(num)box.setAttribute('aria-description',`number ${num} in the suggested order${me&&m.id===nextW?', next up':''}`);return Object.assign({mod,box},m)});
  /* the Eclipse in the middle of the sky: it opens when every world boss is beaten */
  const eG=el('g',{},wld),eFG=el('g',{},eG),eF=eclipseCentreFig(eFG,{won:P.cleared.includes('eclipse')}),eOpen=isOpen('eclipse'),eWon=P.cleared.includes('eclipse'),nb=bossesBeaten();
  const es=el('g',{},eG),esw=150;el('rect',{x:300-esw/2,y:360,width:esw,height:46,rx:13,fill:'#2a2048',stroke:eOpen&&!eWon?'#ffd23a':'#9a6cff','stroke-width':eOpen&&!eWon?3.5:2.5,class:nextW==='eclipse'?'ring':''},es);
  el('text',{x:300,y:380,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#fff1d6'},es).textContent=eWon?'The moon is full!':eOpen?'Face the Eclipse!':'The Eclipse';
  el('text',{x:300,y:397,'text-anchor':'middle','font-size':11,fill:'#d8c6f4'},es).textContent=eWon?'tap to battle again':eOpen?(nb===BOSSES.length?'every boss is beaten':'open for testing'):`${BOSSES.length-nb} boss${BOSSES.length-nb===1?'':'es'} to beat`;
  interact(eG,{label:eOpen?'The Eclipse: face it':'The Eclipse (locked)',tap:()=>{if(flying)return;if(!eOpen){SFX.clonk();say(`A shadow is eating the moon. Each world boss you beat pushes it back a little: beat them all to face the Eclipse. ${9-nb} to go!`);return}
    flying=true;SFX.pop(1.2);CURW='eclipse';flyTo(all,300,300,()=>go('eclipse'))}});
  /* the player's balloon floats by the world they last played */
  const lastW=me&&ST.last[PL]?worldOf(ST.last[PL]).id:'starter',lm=lastW==='eclipse'?{id:'eclipse',cx:450,cy:380,rx:20,ry:20}:models.find(m=>m.id===lastW)||models[0];
  const bal=me?balloon(wld,me.ci,me.look):null;if(bal)bal.g.style.pointerEvents='none';let bx=lm.cx+(lm.id==='starter'?78:-70),by=lm.cy-lm.ry-(lm.id==='starter'?26:50);
  function enter(m){if(flying)return;flying=true;SFX.pop(1.2);CURW=m.id;const go2=()=>flyTo(all,m.cx,m.cy,()=>go('map'));if(bal){const x0=bx,y0=by;const tx=m.id==='fractions'?m.cx-20:m.cx-m.rx*.85,ty=m.id==='fractions'?m.cy-40:m.cy-30;tween(650,t=>{bx=lerp(x0,tx,t);by=lerp(y0,ty,t)},go2,ease.inOut)}else go2()}
  /* overall progress, for this player */
  const pg=el('g',{},top),PW=360;el('rect',{x:300-PW/2,y:6,width:PW,height:62,rx:16,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},pg);
  if(me){const sv=el('svg',{x:300-PW/2+8,y:10,width:54,height:54,viewBox:'-36 -40 72 74'},pg);buddy(sv,{r:24,i:me.ci,look:me.look})}
  else{const k=el('g',{transform:`translate(${300-PW/2+35},37)`},pg);el('circle',{r:22,fill:'#2c2356'},k);el('rect',{x:-9,y:-3,width:18,height:15,rx:3,fill:'#ffc04d'},k);el('path',{d:'M-5 -3v-5a5 5 0 0 1 10 0v5',fill:'none',stroke:'#ffc04d','stroke-width':3},k)}
  const tx=300-PW/2+72;el('text',{x:tx,y:30,'font-size':17,'font-weight':700,fill:'#3a2418'},pg).textContent=name;
  const badges=[P.cleared.includes('mirror')&&['Muddler beaten!','#9a6cff'],P.cleared.includes('boss')&&['Gloom beaten!','#ff7eb6'],P.cleared.includes('magpie')&&['Magpie beaten!','#6fe3cd'],P.cleared.includes('kraken')&&['Kraken beaten!','#8fd6ff'],P.cleared.includes('smudge')&&['Smudge beaten!','#ffd23a'],P.cleared.includes('inkblot')&&['Inkblot beaten!','#8ff0c8'],P.cleared.includes('snooze')&&['Snooze woken!','#ff9a3a'],P.cleared.includes('grabbit')&&['Treasure back!','#ffd23a'],P.cleared.includes('fudge')&&['Charts honest!','#e8813a'],P.cleared.includes('gruff')&&['Road clear!','#7ab85a'],P.cleared.includes('eclipse')&&['The moon is full!','#fff1d6']].filter(Boolean);
  const bsp=Math.min(30,170/Math.max(1,badges.length));badges.forEach(([b,c],i)=>{const bg=el('g',{transform:`translate(${(300+PW/2-24-i*bsp).toFixed(1)},22) scale(${bsp<26?.8:1})`},pg);el('circle',{r:12,fill:'#ffc04d',stroke:'#c98a1a','stroke-width':1.5},bg);el('path',{d:'M0,-7 l2,4.6 5,.5 -3.8,3.3 1.2,5 -4.4,-2.6 -4.4,2.6 1.2,-5 -3.8,-3.3 5,-.5Z',fill:c},bg);const t=el('title',{},bg);t.textContent=b;bg.setAttribute('aria-label',b)});
  el('text',{x:tx,y:50,'font-size':12.5,fill:'#7a5a44'},pg).textContent=`${done} of ${tot} islands, ${P.ideas.length} of ${IDEAS.length} glow seeds`;
  progressBar(pg,tx+(300+PW/2-16-tx)/2,55,300+PW/2-16-tx,done/tot);
  let T=0;loop(dt=>{T+=dt;sky.tick(T,dt);fc.tick(T);
    eF.tick(T);eFG.setAttribute('transform',`translate(300,${(300+Math.sin(T*.7)*4).toFixed(2)}) scale(.62)`);
    models.forEach((m,k)=>{m.mod.tick(T);m.mod.g.setAttribute('transform',`translate(0,${(Math.sin(T*.8+k*1.7)*4).toFixed(2)})`)});
    others.childNodes.forEach((g,k)=>{const [x,y]=OT[k];g.setAttribute('transform',`translate(${x},${(y+Math.sin(T*.7+k*1.4)*4).toFixed(2)})`)});
    LN.forEach(n=>{n.y-=dt*n.v;if(n.y<70){n.y=520;n.x=60+Math.random()*480}n.l.setAttribute('transform',`translate(${(n.x+Math.sin(T*.6+n.v)*8).toFixed(1)},${n.y.toFixed(1)}) scale(${(.6+.4*(n.y/520)).toFixed(2)})`);n.l.setAttribute('opacity',Math.min(1,(n.y-70)/80).toFixed(2))});
    if(bal)bal.g.setAttribute('transform',`translate(${bx.toFixed(1)},${(by+Math.sin(T*1.1)*6).toFixed(1)}) rotate(${(Math.sin(T*.9)*3).toFixed(1)}) scale(.85)`)});
  say(grown()?'Grown-up mode: every island is open. Pick a world.':done?`Welcome back, ${name}! Pick a world to carry on.`:`Hi ${name}! Pick a world to start your adventure.`);
}};

/* ---------- a world's island map: pick an island; the big one waits in the middle ---------- */
W.map={scene:'hub',
notes:`<p>The island map. The islands circle the middle in story order, starting bottom left, joined by rope bridges that light up as each island is cleared. A cleared island flies a gold flag; the next one has a beam of light and the player's balloon beside it; padlocked ones sit in mist, so she can see what's coming.</p>
<p>The middle is the big one at the end: the Gloom on the Fraction Isles, the Magic Mirror on the Starter Isles, the dark lighthouse on the Decimal Isles, the whirlpool on the Shape Isles, the grey rainbow on the Ratio Isles, the inky storybook on the Story Isles. It opens when every island around it is cleared, and can be played again after.</p>`,
mount(root){hubDefs(root);
  const WW=worldById(CURW),C=CENTRE[WW.id],ringW=WW.isles.slice(0,-1),n=ringW.length,P=mine(),CX=300,CY=318,big=n<8,RX=big?220:256,RY=big?170:200,front=frontier(),done0=P.cleared.includes(C.w),cOpen=isOpen(C.w),me=grown()?null:player(),NS=big?1.35:1;
  const sky=skyFX(root,{seaY:462}),all=el('g',{},root),brL=el('g',{},all),ctr=el('g',{},all),ring=el('g',{},all),boltL=el('g',{},all),balL=el('g',{},all),fc=frontClouds(root,580),ui=el('g',{},root);
  let flying=false;
  /* small worlds use less of the circle, so the lowest islands stay clear of the middle one */
  const SW=n>=9?300:n===8?264:Math.min(260,120+30*(n-2)),A0=90+SW/2;
  const L=ringW.map((w,i)=>{const f=(A0-i*SW/(n-1))*Math.PI/180;return{w,i,x:CX+Math.cos(f)*RX,y:CY-Math.sin(f)*RY}});
  L.forEach((l,i)=>{if(i<n-1)bridge(brL,l,L[i+1],P.cleared.includes(l.w),NS)});
  bridge(brL,L[n-1],{x:CX+40,y:CY+92},P.cleared.includes(L[n-1].w),NS);
  const mid=el('g',{},ctr);
  if(WW.id==='fractions'&&!done0){const sw=el('g',{},mid);[[150,62,.22],[124,52,.16],[98,40,.12]].forEach(([rx,ry,o],i)=>el('ellipse',{cx:0,cy:0,rx,ry,fill:'none',stroke:'#b48cff',opacity:o,'stroke-width':3,'stroke-dasharray':`${40+i*20} ${30+i*10}`},sw));mid.sw=sw}
  if(cOpen&&!done0)el('circle',{cx:CX,cy:CY-14,r:146,fill:'none',stroke:'#fff0a0','stroke-width':3,class:'ring'},mid);
  floatRock(mid,{x:CX,y:CY+74,s:.7,top:done0?'#8a6ab0':C.rock,rim:darker(C.rock,.8),under:'#1d1638',seam:'#2a1f48'});
  if(WW.id==='fractions'&&!done0)[[-60,70],[50,82],[-10,96]].forEach(([dx,dy])=>el('path',{d:`M${CX+dx-5},${CY+dy} l5,-12 l5,12 l-5,7Z`,fill:'#9a6cff',opacity:.8,filter:'url(#glow)'},mid));
  const figG=el('g',{},mid),fig=C.fig(figG,done0);
  const left=ringW.filter(w=>!P.cleared.includes(w)).length,[s1,s2]=C.sign(done0,cOpen,left),sg=el('g',{},mid),sw2=164;
  el('rect',{x:CX-sw2/2,y:CY+78,width:sw2,height:44,rx:12,fill:'#fff4e6',stroke:done0||cOpen?'#fff0a0':'#c9a77a','stroke-width':done0||cOpen?3.5:2.5},sg);
  el('text',{x:CX,y:CY+97,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#3a2418'},sg).textContent=s1;
  el('text',{x:CX,y:CY+114,'text-anchor':'middle','font-size':11.5,fill:'#7a5a44'},sg).textContent=s2;
  if(!cOpen){el('rect',{x:CX+sw2/2-24,y:CY+68,width:16,height:13,rx:3,fill:'#7a5a44'},sg);el('path',{d:`M${CX+sw2/2-21},${CY+68} v-4 a5,5 0 0 1 10,0 v4`,fill:'none',stroke:'#7a5a44','stroke-width':2.5},sg)}
  const bolts=WW.id==='fractions'&&!done0?gloomBolts(boltL,CX,CY-40,300):null;
  const nodes={};[...L].sort((a,b)=>a.y-b.y).forEach(l=>{const o=islandNode(ring,l.w,{x:l.x,y:l.y,s:NS,label:false,beam:Math.min(230,l.y-4)/NS});l.g=o.g;nodes[l.w]=Object.assign(o,l);
    interact(o.g,{label:`${WNAME[l.w]}${o.clr?' (cleared)':o.open?'':' (locked)'}`,tap:()=>{if(flying)return;
      if(!o.open){SFX.clonk();shake(3);say(`${WNAME[l.w]} is still locked. Clear ${WNAME[ringW[l.i-1]]} to open it.`);return}
      travel(l.x,l.y,()=>go(l.w))}})});
  const labL=el('g',{},all);L.forEach(l=>{const o=nodes[l.w],t=el('text',{x:l.x,y:l.y+54*NS,'text-anchor':'middle','font-size':big?16:14,'font-weight':600,fill:'#fff4e6',opacity:o.open?1:.6,stroke:'#1d1840','stroke-width':3.5,'paint-order':'stroke'},labL);t.textContent=WNAME[l.w];l.t=t});
  interact(mid,{label:done0?`Play ${WNAME[C.w]} again`:cOpen?`Open ${WNAME[C.w]}`:`${C.name} (locked)`,tap:()=>{if(flying)return;
    if(!cOpen){if(WW.id==='fractions'&&SFX.laugh)SFX.laugh();else SFX.clonk();shake(3);say(C.locked(left));return}
    travel(CX,CY-20,()=>go(C.w))}});
  const here=nodes[front]||{x:CX-80,y:CY+50};
  let bx=here.x+(here.x<CX?-28:28)*NS,by=here.y-88*NS;
  const bal=me?balloon(balL,me.ci,me.look):null;
  function travel(x,y,done){flying=true;SFX.pop(1.2);if(!bal){flyTo(all,x,y,done);return}const x0=bx,y0=by,d=Math.hypot(x-x0,y-60-y0);
    tween(Math.min(1100,350+d*2),t=>{bx=lerp(x0,x,t);by=lerp(y0,y-62,t)-Math.sin(t*Math.PI)*30},()=>flyTo(all,x,y,done),ease.inOut)}
  const dn=WW.isles.filter(w=>P.cleared.includes(w)).length,pw=230,pg=el('g',{},ui);el('rect',{x:CX-pw/2,y:550,width:pw,height:44,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':2.5},pg);
  el('text',{x:CX,y:568,'text-anchor':'middle','font-size':12.5,'font-weight':700,fill:'#3a2418'},pg).textContent=`${WW.name}: ${dn} of ${WW.isles.length} islands`;
  progressBar(pg,CX,576,pw-30,dn/WW.isles.length);
  let T=0;loop(dt=>{T+=dt;sky.tick(T,dt);fc.tick(T);fig.tick(T);if(bolts)bolts(dt);
    figG.setAttribute('transform',`translate(${CX},${(CY+C.dy+Math.sin(T*1.2)*5).toFixed(1)}) scale(${C.scale(done0)})`);if(mid.sw)mid.sw.setAttribute('transform',`translate(${CX},${CY-40}) rotate(${(T*12%360).toFixed(1)})`);
    L.forEach(l=>{const dy=Math.sin(T*1.1+l.i*.7)*2.5;l.g.setAttribute('transform',`translate(${l.x.toFixed(1)},${(l.y+dy).toFixed(2)}) scale(${NS})`);l.t.setAttribute('y',(l.y+54*NS+dy).toFixed(1))});
    if(bal)bal.g.setAttribute('transform',`translate(${bx.toFixed(1)},${(by+Math.sin(T*1.1)*5).toFixed(1)}) rotate(${(Math.sin(T*.9)*3).toFixed(1)})`)});
  const dw=dn;say(grown()?'Grown-up mode: every island is open.':done0?`Every island is cleared and ${BEATEN[WW.id]}. Play any island again!`:cOpen?AWAKE[WW.id]:dw?'Pick an island. Your balloon is waiting by the next one.':`Your adventure starts at ${WNAME[ringW[0]]}: the island with the beam of light. Tap it!`);
}};
