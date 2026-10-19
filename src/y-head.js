/* ================= The Story Isles: Pip the bookworm, and the Inkblot =================
   Word problems. The Inkblot has splashed ink over the endings of the library's stories; Pip mends them
   by drawing each story as bars. The numbers in a story are gold chips that can be dragged onto the bars. */
const STORY_COL='#ffc04d';
/* Pip, a bookworm in round glasses */
function pipFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  [[-30,6,9],[-18,8,10],[-5,6,11],[8,2,12]].forEach(([x,y,r],i)=>el('circle',{cx:x,cy:y,r,fill:i%2?'#8fd47a':'#7fc86a',stroke:'#4f8a3a','stroke-width':1.5},b));
  el('circle',{cx:22,cy:-6,r:14,fill:'#8fd47a',stroke:'#4f8a3a','stroke-width':1.5},b);
  [[17,-8],[29,-8]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:6,fill:'#fff',stroke:'#3a2418','stroke-width':2},b);el('circle',{cx:x+1,cy:y,r:2.4,fill:'#241a3a'},b)});
  el('line',{x1:23,x2:23,y1:-8,y2:-8,stroke:'#3a2418','stroke-width':2},b);el('path',{d:'M18,1 q5,4 10,0',fill:'none',stroke:'#3a2418','stroke-width':1.8,'stroke-linecap':'round'},b);
  el('path',{d:'M14,-19 q-2,-8 -8,-10 M28,-19 q2,-8 8,-9',fill:'none',stroke:'#4f8a3a','stroke-width':2},b);
  const o={g,x:0,y:0,put(x,y){if(x!=null)o.x=x;if(y!=null)o.y=y;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`)},
    cheer(){if(RM)return;tween(600,(t,p)=>g.setAttribute('transform',`translate(${o.x},${(o.y-Math.sin(p*Math.PI)*12).toFixed(1)}) rotate(${(Math.sin(p*Math.PI*4)*6).toFixed(1)})`),()=>o.put())}};
  o.put(0,0);return o}
function pipGuide(parent){const k=pipFig(parent,.62),p0=k.put;k.put=(x,y)=>p0(x==null?x:x-12,y);k.put(170,48);return k}

/* the people (and animals) who tell the stories, as little faces beside their speech bubbles */
const CAST={Pip:{f:'pip'},Muncher:{f:'muncher'},driver:{f:'hat',hat:'#2a4a8a',lab:'driver'},captain:{f:'hat',hat:'#ffffff',lab:'captain'},teacher:{f:'kid',hair:'#3a2418',lab:'teacher'},grocer:{f:'hat',hat:'#e8413e',lab:'grocer'},keeper:{f:'hat',hat:'#4a9a3a',lab:'zoo keeper'},farmer:{f:'hat',hat:'#c9a24a',lab:'farmer'},
  cat:{f:'animal',col:'#ffb36a',ear:'tri'},dog:{f:'animal',col:'#c8945e',ear:'flop'},rabbit:{f:'animal',col:'#f0eef8',ear:'long'},goat:{f:'animal',col:'#e8e0d0',ear:'horn'},puppy:{f:'animal',col:'#d8a46e',ear:'flop'},mum:{f:'animal',col:'#a8744e',ear:'flop',lab:'Mum'}};
function castFace(parent,x,y,name){const c=CAST[name]||{f:'kid',hair:['#6a3a2a','#e8b84a','#3a2418','#c9413a','#8a5a3a'][name.length%5],skin:['#f4c8a0','#c88e5e','#e8b088','#8a5a3a'][(name.charCodeAt(0)||0)%4]},g=el('g',{transform:`translate(${x},${y})`},parent);
  const eyes=(dy=-1,col='#241a3a')=>[-5,5].forEach(ex=>el('circle',{cx:ex,cy:dy,r:2.2,fill:col},g));
  if(c.f==='pip'){el('circle',{r:15,fill:'#8fd47a',stroke:'#4f8a3a','stroke-width':1.5},g);[-5.5,5.5].forEach(ex=>{el('circle',{cx:ex,cy:-2,r:5,fill:'#fff',stroke:'#3a2418','stroke-width':1.6},g);el('circle',{cx:ex+.8,cy:-2,r:2,fill:'#241a3a'},g)});el('path',{d:'M-4,7 q4,3 8,0',fill:'none',stroke:'#3a2418','stroke-width':1.5},g)}
  else if(c.f==='muncher'){el('path',{d:'M-15,12 Q-18,-14 0,-16 Q18,-14 15,12Z',fill:'#9a6cff',stroke:'#5a3aa0','stroke-width':1.5},g);eyes(-6,'#fff');el('path',{d:'M-8,3 Q0,11 8,3Z',fill:'#3a1a4a'},g)}
  else if(c.f==='animal'){if(c.ear==='tri')el('path',{d:'M-12,-8 l2,-10 l7,6Z M12,-8 l-2,-10 l-7,6Z',fill:c.col,stroke:darker(c.col,.7)},g);if(c.ear==='long')el('path',{d:'M-7,-10 q-3,-16 2,-18 q3,4 2,18Z M7,-10 q3,-16 -2,-18 q-3,4 -2,18Z',fill:c.col,stroke:'#a8a0c0'},g);
    if(c.ear==='horn')el('path',{d:'M-8,-11 q-6,-8 -2,-14 M8,-11 q6,-8 2,-14',fill:'none',stroke:'#8a7a5a','stroke-width':2.5},g);el('circle',{r:14,fill:c.col,stroke:darker(c.col,.7),'stroke-width':1.5},g);
    if(c.ear==='flop')[-13,13].forEach(ex=>el('ellipse',{cx:ex,cy:-2,rx:4.5,ry:9,fill:darker(c.col,.75)},g));eyes();el('ellipse',{cx:0,cy:5,rx:3,ry:2.2,fill:'#3a2418'},g)}
  else{el('circle',{r:14,fill:c.skin||'#f4c8a0',stroke:'#a8743a','stroke-width':1.2},g);if(c.f==='hat'){el('rect',{x:-14,y:-17,width:28,height:9,rx:3,fill:c.hat,stroke:'#3a2418','stroke-width':1},g);el('rect',{x:-17,y:-10,width:34,height:4,rx:2,fill:c.hat,stroke:'#3a2418','stroke-width':1},g)}
    else el('path',{d:'M-14,-3 Q-14,-17 0,-16 Q14,-17 14,-3 Q8,-10 0,-9 Q-8,-10 -14,-3Z',fill:c.hair},g);eyes(0);el('path',{d:'M-4,6 q4,3 8,0',fill:'none',stroke:'#3a2418','stroke-width':1.5},g)}
  el('text',{y:27,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#fff0a0'},g).textContent=c.lab||name;return g}
/* the story, told in speech bubbles: each line is said by someone (who[i], default Pip); Pip asks the question in purple.
   Numbers are gold chips. lines: [['I had', {n:5,id:'a'}, 'shells.'], …] */
function storyCard(parent,{x=36,y=92,w=440,lines,size=19,chipDrag,ask,hidden=false,who=[]}){if(ask)lines=[...lines,[{ask}]];
  const g=el('g',{},parent),bg=el('g',{},g),fg=el('g',{},g),lh=size*1.6,chips={},sp=size*.3,LN=lines.map(()=>[]),bx=x+46,L0=bx+12,right=x+w-10;let li=0,top=y,row=0,cx=L0,maxX=L0,prev=null;
  const tag=e=>{LN[li].push(e);if(hidden)e.setAttribute('opacity',0)};
  const by=()=>top+8+row*lh+size,nl=()=>{row++;cx=L0};
  const word=(t,attrs)=>{const e=el('text',Object.assign({x:cx,y:by(),'font-size':size,fill:'#3a2418'},attrs),fg);e.textContent=t;let L=t.length*size*.5;try{L=e.getComputedTextLength()||L}catch(_){}
    if(cx+L>right-10&&cx>L0){nl();e.setAttribute('x',cx);e.setAttribute('y',by())}cx+=L+sp;maxX=Math.max(maxX,cx);tag(e)};
  lines.forEach((ln,i)=>{li=i;row=0;cx=L0;maxX=L0;const isAsk=ln.some(sg=>sg&&sg.ask),name=isAsk?'Pip':(who[i]||'Pip');
    ln.forEach(seg=>{
      if(seg.ask){seg.ask.split(' ').forEach(t=>word(t,{'font-weight':700,fill:'#7a4ac0'}));return}
      if(typeof seg==='string'){seg.split(' ').filter(Boolean).forEach(t=>word(t,{}));return}
      const txt=String(seg.t||seg.n),cw=Math.max(32,txt.length*size*.62+14);if(cx+cw>right-10&&cx>L0)nl();
      const c=el('g',{transform:`translate(${cx},${by()-size*.82})`},fg);tag(c);
      el('rect',{width:cw,height:size*1.3,rx:8,fill:STORY_COL,stroke:'#a8743a','stroke-width':2},c);el('text',{x:cw/2,y:size*.98,'text-anchor':'middle','font-size':size,'font-weight':700,fill:'#3a2418'},c).textContent=txt;
      chips[seg.id]={g:c,n:seg.n,t:txt,id:seg.id,x:cx+cw/2,y:by()-size*.82+size*.65,w:cw};if(chipDrag)chipDrag(chips[seg.id]);cx+=cw+sp;maxX=Math.max(maxX,cx)});
    const bh=(row+1)*lh+12,bw=Math.min(right,maxX+6)-bx,b=el('g',{},bg);tag(b);
    el('path',{d:`M${bx+2},${top+16} L${bx-10},${top+21} L${bx+2},${top+26}Z`,fill:isAsk?'#f4eefa':name==='Pip'?'#fff4e6':'#ffffff',stroke:isAsk?'#9a6cff':'#c9a77a','stroke-width':2},b);
    el('rect',{x:bx,y:top,width:bw,height:bh,rx:14,fill:isAsk?'#f4eefa':name==='Pip'?'#fff4e6':'#ffffff',stroke:isAsk?'#9a6cff':'#c9a77a','stroke-width':2.5},b);
    el('rect',{x:bx+2,y:top+12,width:3,height:16,fill:isAsk?'#f4eefa':name==='Pip'?'#fff4e6':'#ffffff'},b);
    if(name!==prev)castFace(b,x+18,top+18,name);prev=name;
    top+=bh+6});
  const H=top-y-6;
  return{g,chips,h:H,n:lines.length,show(i){(LN[i]||[]).forEach(e=>{const t0=+e.getAttribute('opacity');if(t0===1)return;tween(350,t=>e.setAttribute('opacity',t.toFixed(2)))})},showAll(){LN.forEach(l=>l.forEach(e=>e.setAttribute('opacity',1)))}}}
/* drag a copy of a chip around; onDrop(point) returns true if it landed somewhere useful */
function chipDragger(layer,chip,{label,onDrop,canDrag=()=>true}){
  let ghost=null;const mk=p=>{ghost=el('g',{},layer);el('rect',{x:-chip.w/2,y:-16,width:chip.w,height:32,rx:9,fill:STORY_COL,stroke:'#fff6d0','stroke-width':2.5},ghost);
    el('text',{y:7,'text-anchor':'middle','font-size':19,'font-weight':700,fill:'#3a2418'},ghost).textContent=chip.t;ghost.setAttribute('transform',`translate(${p.x},${p.y})`)};
  interact(chip.g,{label:label||`Number ${chip.t}: drag it onto the bars`,down:()=>({}),move:(p,p0,c)=>{if(!canDrag())return;if(!ghost){mk(p);SFX.pop(1.2)}ghost.setAttribute('transform',`translate(${p.x},${p.y})`)},
    up:p=>{if(!ghost)return;const ok=onDrop(p,chip);const gh=ghost;ghost=null;if(ok){gh.remove();return}const [x0,y0]=[p.x,p.y];tween(260,t=>gh.setAttribute('transform',`translate(${lerp(x0,chip.x,t)},${lerp(y0,chip.y,t)})`),()=>gh.remove())},
    tap:()=>{if(canDrag())onDrop(null,chip)}})}
/* a slot on a bar where a number can go */
function barSlot(parent,{x,y,w=56,label}){const g=el('g',{transform:`translate(${x},${y})`},parent);let v=null;
  const r=el('rect',{x:-w/2,y:-17,width:w,height:34,rx:9,fill:'rgba(255,244,230,.92)',stroke:'#8a6a4a','stroke-width':2,'stroke-dasharray':'5 4'},g),t=el('text',{y:7,'text-anchor':'middle','font-size':19,'font-weight':700,fill:'#9a8ab8'},g);
  const o={g,x,y,w,get:()=>v,set(n,{q=false}={}){v=n;t.textContent=n==null?'':String(n);t.setAttribute('fill',q?'#9a6cff':'#3a2418');r.setAttribute('stroke-dasharray',n==null?'5 4':'');r.setAttribute('fill',n==null?'rgba(255,244,230,.92)':q?'#f4eefa':'#ffe9a8');if(n!=null&&!q)popIn(g,.6)},
    hit:p=>p&&Math.abs(p.x-x)<w/2+14&&Math.abs(p.y-y)<30};
  if(label)interact(g,{label,tap:()=>{}});return o}
/* a coloured bar, with a name on its left */
function storyBar(parent,{x,y,w,h=40,col='#8fd6ff',name,dash=false}){const g=el('g',{},parent);
  el('rect',{x,y,width:w,height:h,rx:6,fill:dash?'rgba(255,244,230,.08)':col,stroke:dash?'rgba(255,244,230,.6)':darker(col,.7),'stroke-width':2.5,'stroke-dasharray':dash?'7 5':''},g);
  if(name)el('text',{x:x-10,y:y+h/2+6,'text-anchor':'end','font-size':16,'font-weight':700,fill:'#fff4e6'},g).textContent=name;return g}
/* a bracket under (or over) a stretch of bar */
function bracket(parent,x0,x1,y,up=false){const d=up?-1:1;return el('path',{d:`M${x0+2},${y} v${8*d} H${x1-2} v${-8*d} M${(x0+x1)/2},${y+8*d} v${6*d}`,fill:'none',stroke:'#fff0a0','stroke-width':2.5},parent)}

/* the storybook at the middle of the Story Isles: inky until the Inkblot is beaten */
function bookFig(parent,{clean=false}={}){const g=el('g',{},parent);
  el('path',{d:'M-96,-60 Q-48,-74 0,-58 Q48,-74 96,-60 L96,40 Q48,26 0,42 Q-48,26 -96,40Z',fill:'#7a4a2e'},g);
  el('path',{d:'M-90,-64 Q-46,-78 -2,-62 L-2,36 Q-46,22 -90,36Z',fill:'#fff8ec',stroke:'#c9a77a','stroke-width':1.5},g);
  el('path',{d:'M90,-64 Q46,-78 2,-62 L2,36 Q46,22 90,36Z',fill:'#fff8ec',stroke:'#c9a77a','stroke-width':1.5},g);
  for(let i=0;i<5;i++){el('line',{x1:-80,x2:-14,y1:-46+i*14,y2:-46+i*14-2,stroke:'#c9b8a0','stroke-width':2},g);el('line',{x1:14,x2:80,y1:-48+i*14,y2:-48+i*14+2,stroke:'#c9b8a0','stroke-width':2},g)}
  let ink=null;if(!clean){ink=inkblotFig(g,{s:.55});ink.g.setAttribute('transform','translate(30,-14) scale(.55)')}
  else{el('rect',{x:-70,y:-44,width:44,height:14,rx:3,fill:'#8fd6ff'},g);el('rect',{x:-70,y:-24,width:28,height:14,rx:3,fill:'#ffb34d'},g);pipFig(g,.7).put(46,-14)}
  return{g,tick:t=>{if(ink)ink.tick(t)}}}
/* the Inkblot: a splodge of ink with a cheeky face; wipe() makes it smaller */
function inkblotFig(parent,{s=1}={}){const g=el('g',{},parent),body=el('g',{},g);
  const d='M-50,6 C-62,-22 -36,-48 -8,-42 C8,-62 42,-54 46,-30 C70,-22 66,14 50,22 C58,46 26,56 8,44 C-10,60 -42,52 -40,32 C-62,30 -64,16 -50,6Z';
  const blob=el('path',{d,fill:'#1d1630',stroke:'#3a2f66','stroke-width':3},body);[[-60,40,7],[64,-40,6],[56,48,5],[-58,-34,5]].forEach(([x,y,r])=>el('circle',{cx:x,cy:y,r,fill:'#1d1630'},body));
  const face=el('g',{},g);[-16,18].forEach(x=>{el('ellipse',{cx:x,cy:-8,rx:9,ry:11,fill:'#fff'},face);el('circle',{cx:x+2,cy:-5,r:4.5,fill:'#241a3a'},face)});
  const mouth=el('path',{d:'M-14,18 Q2,30 18,18',fill:'none',stroke:'#fff','stroke-width':4,'stroke-linecap':'round'},face);
  let sc=1;const o={g,
    wipe(){sc=Math.max(.35,sc-.1);body.setAttribute('transform',`scale(${sc})`);face.setAttribute('transform',`scale(${Math.max(.6,sc)})`)},
    unwipe(){sc=Math.min(1,sc+.1);body.setAttribute('transform',`scale(${sc})`);face.setAttribute('transform',`scale(${Math.max(.6,sc)})`)},
    mood(m){mouth.setAttribute('d',m==='oh'?'M-6,22 a7,7 0 1 0 0.1,0':m==='sad'?'M-14,26 Q2,14 18,26':'M-14,18 Q2,30 18,18')},
    clean(){sc=.85;face.setAttribute('transform','');blob.setAttribute('fill','#8fd6ff');blob.setAttribute('stroke','#4a8ab0');o.mood('')},
    tick(t){body.setAttribute('transform',`scale(${(sc*(1+Math.sin(t*2)*.02)).toFixed(3)},${(sc*(1-Math.sin(t*2)*.02)).toFixed(3)})`)}};
  g.setAttribute('transform',`scale(${s})`);return o}

/* ---------- scenes: the library, the inky reading room ---------- */
SCENE_X.library=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#2a2040'},o);
  for(let s=0;s<4;s++){const y=60+s*120;el('rect',{x:-700,y:y+92,width:2000,height:12,fill:'#4a3428'},o);
    for(let x=-680;x<1300;){const w=14+((x*7+s*13)%14+14)%14,h=60+((x*3+s*11)%30+30)%30,c=['#5a3a6a','#3a5a6a','#6a4a3a','#3a4a7a','#6a3a4a'][((x/7|0)+s)%5];el('rect',{x,y:y+92-h,width:w,height:h,fill:c,opacity:.55},o);x+=w+2}}
  el('rect',{x:-700,y:540,width:2000,height:300,fill:'#3a2a24'},o);el('circle',{cx:560,cy:40,r:120,fill:'#ffc04d',opacity:.06},o)};
SCENE_X.inky=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#191428'},o);
  for(let i=0;i<14;i++){const x=-500+((i*233)%1500),y=60+((i*151)%480),r=10+(i*7)%26;el('circle',{cx:x,cy:y,r,fill:'#0d0a1c',opacity:.8},o);el('circle',{cx:x+r,cy:y+r*.8,r:r*.25,fill:'#0d0a1c',opacity:.8},o)}
  el('rect',{x:-700,y:540,width:2000,height:300,fill:'#241c34'},o)};
AMB_X.library=()=>{const r=Math.random();if(r<.5)noise(.35,.02,{type:'bandpass',f:2400,q:2,wet:.2});else if(r<.8)osc('sine',260,.8,.008,{to:250,wet:.6});else bell(noteHz(3+Math.floor(Math.random()*5)),.01,1.6,{wet:.8})};
AMB_X.inky=()=>{const r=Math.random();if(r<.6)noise(1.8,.04,{type:'lowpass',f:320,a:.8,wet:.4});else osc('sine',90,1.4,.02,{to:80,wet:.5})};
/* answer cards in a column on the right, with a Check */
function answerCards(parent,vals,{x=540,y0=180,dy=74,fmt=v=>String(v),label='Answer',onPick}={}){const L=el('g',{},parent);
  vals.forEach((v,i)=>ratioCard(L,x,y0+i*dy,fmt(v),{w:100,h:58,label:`${label} ${fmt(v)}`,onTap:c=>{pickCard(L,c);SFX.pop(1.1);onPick&&onPick(v,c)}}));return L}
const sshuffle=(a,seed=7)=>{a=[...a];let s=seed;for(let i=a.length-1;i>0;i--){s=(s*1103515245+12345)%2147483648;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
