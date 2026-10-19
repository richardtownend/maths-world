
/* ---------- 7. The Kraken: the Shape Isles boss, a mix of every island ---------- */
/* the Kraken: eight tentacles, each one tangled (0) or free (1) */
function krakenFig(parent,{s=1,free=0}={}){const g=el('g',{transform:`scale(${s})`},parent),tL=el('g',{},g),head=el('g',{},g),st=Array(8).fill(free),paths=[];
  for(let i=0;i<8;i++)paths.push(el('path',{fill:'none',stroke:i%2?'#8a5ae0':'#7a4ad0','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round'},tL));
  el('ellipse',{cx:0,cy:-6,rx:54,ry:48,fill:'#7a4ad0'},head);el('ellipse',{cx:-16,cy:-28,rx:16,ry:9,fill:'#fff',opacity:.18},head);
  [[-12,10],[14,-20],[22,14],[-26,-8]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:4,fill:'#9a6cf0'},head));
  const eyes=[-1,1].map(d=>{const e=el('g',{transform:`translate(${d*20},2)`},head);el('ellipse',{rx:12,ry:14,fill:'#fff6d0'},e);const p=el('ellipse',{rx:5,ry:8,fill:'#1a0f2a'},e);return{e,p}});
  const mouth=el('path',{d:'M-14,30 q14,-8 28,0',stroke:'#2a1240','stroke-width':3.5,fill:'none','stroke-linecap':'round'},head);
  const pt=(i,u,t,f)=>{const a=Math.PI*(.12+.76*i/7),bx=Math.cos(a)*40,by=30+Math.sin(a)*12;
    const fx=bx+Math.cos(a)*u*110+Math.cos(a+Math.PI/2)*Math.sin(u*6+t*2+i)*14*u,fy=by+Math.sin(a)*u*90+Math.sin(a+Math.PI/2)*Math.sin(u*6+t*2+i)*14*u-u*u*40*(i%2?1:-.2);
    const k=u*Math.PI*3+i*.8,kx=Math.sin(k)*34*(1-u*.3)+(i-3.5)*4,ky=60+Math.cos(k*1.3)*26+u*28;return[lerp(kx,fx,f),lerp(ky,fy,f)]};
  function draw(t){paths.forEach((p,i)=>{let d='';for(let k=0;k<=18;k++){const [x,y]=pt(i,k/18,t,st[i]);d+=(k?' L':'M')+x.toFixed(1)+','+y.toFixed(1)}p.setAttribute('d',d)})}
  draw(0);
  return{g,head,eyes,mouth,draw,free(i,dur=900){const f0=st[i];tween(dur,(t,p)=>{st[i]=lerp(f0,1,p)},null,ease.inOut)},
    mood(m){mouth.setAttribute('d',m==='laugh'?'M-16,26 q16,18 32,0Z':m==='happy'?'M-16,26 q16,16 32,0':m==='ow'?'M-6,30 a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0':'M-14,30 q14,-8 28,0');mouth.setAttribute('fill',m==='laugh'||m==='ow'?'#2a1240':'none')},
    tick(t){draw(t);eyes.forEach(({p},k)=>p.setAttribute('transform',`translate(${(Math.sin(t*.9+k)*3).toFixed(1)},0)`))}}}
/* the centre of the Shape Isles on the map: the whirlpool and the Kraken */
function whirlFig(parent,{calm=false}={}){const g=el('g',{},parent),sw=el('g',{},g);
  for(let k=0;k<4;k++)el('ellipse',{cx:0,cy:30,rx:40+k*26,ry:14+k*9,fill:'none',stroke:calm?'#8fd6ff':'#4a6aa8','stroke-width':3,opacity:.6-k*.12,'stroke-dasharray':calm?'':`${24+k*8} ${12+k*4}`},sw);
  const kr=krakenFig(el('g',{transform:'translate(0,-30) scale(.7)'},g),{free:calm?1:0});kr.mood(calm?'happy':'');
  if(calm){const m=el('g',{transform:'translate(0,-118)'},g);el('rect',{x:-30,y:-20,width:60,height:40,rx:4,fill:'#d8c49a',stroke:'#8a6a3a','stroke-width':2},m);el('path',{d:'M-20,8 l10,-12 l8,8 l12,-14',stroke:'#c0402a','stroke-width':2,fill:'none','stroke-dasharray':'4 3'},m);el('path',{d:'M14,-10 l4,4 m0,-4 l-4,4',stroke:'#c0402a','stroke-width':2},m)}
  return{g,tick:t=>{kr.tick(t);if(!calm)sw.setAttribute('transform',`rotate(${(t*20%360).toFixed(1)} 0 30)`)}}}

W.kraken={scene:'whirl',
notes:`<p>The finale of the Shape Isles. The Kraken in the whirlpool has tied itself in a knot and torn Shelly's map into eight pieces. Eight questions, one from each island and each answered that island's way: turn Shelly in murky water, fill a hidden gap in a fan, sail to a coordinate, tile an L-shaped floor, make a pen with a set fence and a set amount of grass, add the missing square to a net, the third corner of a triangle, and a swim of so many right and up.</p>
<p>Every right answer frees one tentacle and wins back a piece of the map. Three shells: a wrong answer and the Kraken knocks one away (and the next try uses different numbers); lose all three and it snatches a map piece back. Free all eight tentacles and the Kraken is untangled and the map is whole.</p>`,
mount(root){
  const L=(w,h,cw,ch)=>{const s=new Set();for(let c=1;c<1+w;c++)for(let r=1;r<1+h;r++)if(!(c>=1+w-cw&&r<1+ch))s.add(`${c},${r}`);return s};
  const Q=[{t:'turn',v:[-90,135,180]},{t:'fan',v:[[125],[155],[110]]},{t:'chart',v:[[-2,3],[3,-1],[-4,-2]]},{t:'tiles',v:[[6,5,3,2],[7,4,3,2],[6,6,2,3]]},
    {t:'pen',v:[[16,15],[18,18],[16,12]]},{t:'box',v:[{c:[[1,1],[0,0],[1,0],[2,0],[1,2]],k:[[1,3],[2,1],[0,1]]},{c:[[1,1],[2,0],[1,0],[0,1],[0,2]],k:[[-1,2],[1,2],[0,3]]},{c:[[1,1],[0,1],[0,2],[1,0],[2,0]],k:[[2,-1],[2,1],[0,0]]}]},
    {t:'tri',v:[[50,65],[70,45],[35,80]]},{t:'move',v:[[[1,-2],[-3,4]],[[-3,1],[5,-4]],[[2,3],[-6,-2]]]}];
  const S={r:0,hearts:3,busy:false,done:false,vr:{}};
  const V=()=>{const q=Q[S.r];return q.v[(S.vr[S.r]||0)%q.v.length]};
  const arena=el('g',{},root),fog=el('g',{},root),qL=el('g',{},root),side=el('g',{},root),hud=el('g',{},root);
  const MX=505,MY=150,kr=krakenFig(el('g',{transform:`translate(${MX},${MY}) scale(.95)`},side));
  /* the map, in eight pieces */
  const MPX=448,MPY=300,mapL=el('g',{},side),PCS=range(0,7).map(i=>{const x=MPX+(i%4)*34,y=MPY+Math.floor(i/4)*34,g=el('g',{},mapL);el('rect',{x,y,width:32,height:32,rx:3,fill:'#3a3058',stroke:'#5a4a80','stroke-width':1.5},g);return{g,x,y}});
  el('text',{x:MPX+68,y:MPY-10,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff0a0'},mapL).textContent="Shelly's map";
  const pieceOn=(i,on)=>{const p=PCS[i];p.g.innerHTML='';el('rect',{x:p.x,y:p.y,width:32,height:32,rx:3,fill:on?'#d8c49a':'#3a3058',stroke:on?'#8a6a3a':'#5a4a80','stroke-width':1.5},p.g);
    if(on){el('path',{d:`M${p.x+4},${p.y+20+(i%3)*3} q8,-6 14,0 t12,0`,stroke:'#4a8aa8','stroke-width':1.6,fill:'none'},p.g);if(i===6)el('path',{d:`M${p.x+12},${p.y+10} l8,8 m0,-8 l-8,8`,stroke:'#c0402a','stroke-width':2.4},p.g);if(i%3===1)el('circle',{cx:p.x+20,cy:p.y+10,r:4,fill:'#7fc87a'},p.g);popIn(p.g,.5)}};
  const heartL=el('g',{},hud);
  function drawHearts(){heartL.innerHTML='';for(let k=0;k<3;k++){const on=k<S.hearts,g=el('g',{transform:`translate(${30+k*34},30)`},heartL);if(on)el('circle',{r:17,fill:'#ffc04d',opacity:.25},g);
    el('path',{d:'M0,10 C-14,10 -15,-5 -8,-10 C-3,-13 3,-13 8,-10 C15,-5 14,10 0,10Z',fill:on?'#ffb0c8':'#3a3058',stroke:on?'#fff4e6':'#5a4a80','stroke-width':1.5},g);for(let j=-2;j<=2;j++)el('line',{x1:0,y1:9,x2:j*5,y2:-10,stroke:on?'#e0809a':'#4a4068','stroke-width':1.2},g);el('rect',{x:-4,y:8,width:8,height:5,rx:1.5,fill:on?'#e0809a':'#4a4068'},g)}}
  let loopT=0;
  function hit(msg,parts){S.busy=true;pieceOn(S.r,true);kr.free(S.r);kr.mood('ow');SFX.chime();SFX.splash&&SFX.splash();shake(5);
    floatText(MX,MY-80,['Blub!','Gurgle!','Oof!','Hey!','Splosh!','Nooo!','Glub!','Aaah!'][S.r],{col:'#c9a2ff',size:22});later(700,()=>kr.mood(''));
    if(parts)decQ(qL,parts,true,null);say(`${msg} A tentacle comes free!`);later(2600,()=>{if(S.r===7)finale();else{S.r++;load()}})}
  function miss(msg){S.busy=true;SFX.laugh();kr.mood('laugh');S.hearts--;drawHearts();shake(5);ring(30+S.hearts*34,30,{col:'#b48cff',r1:40});
    say(`${msg} The Kraken gurgles with glee!`);S.vr[S.r]=(S.vr[S.r]||0)+1;later(2600,()=>{kr.mood('');if(S.hearts<=0)lost();else load()})}
  function lost(){S.hearts=3;if(S.r>0){S.r--;pieceOn(S.r,false)}say('All your shells are gone! The Kraken snatched a map piece back. Try that one again.');later(2600,load)}
  const goBtn=(fn,txt,lab)=>decGo(arena,500,476,lab,fn,txt);
  const M={
    turn(t){const start=[0,45,300][(S.vr[S.r]||0)%3],cx=220,cy=300,[tx,ty]=dirV(start+t),g0=seagrass(arena,cx+tx*188,cy+ty*188,.85),fg=el('path',{d:`M-700,0 H1300 V900 H-700Z M${cx+150},${cy} A150,150 0 1 0 ${cx-150},${cy} A150,150 0 1 0 ${cx+150},${cy}Z`,fill:'#0b2a3a','fill-rule':'evenodd',opacity:.93},arena),kit=turnKit(arena,{cx,cy,R:100,start,left:t<0});
      const b=goBtn(()=>{if(S.busy)return;const T=kit.get();if(!T)return;kit.lock(true);b.style.display='none';const ok=((T-t)%360+360)%360===0;tween(700,(x,p)=>fg.setAttribute('opacity',((1-p)*.93).toFixed(2)));
        kit.swim(170,()=>{if(ok)hit(`${Math.abs(t)}° ${t<0?'left':'right'} = ${kindShort(t)}!`,[['t','Turn'],['w',`${Math.abs(t)}°`],['t',t<0?'left':'right']]);else miss(`Shelly turned ${Math.abs(T)}° ${T<0?'left':'right'}. ${turnWhy(t)}`)})},'Go','Go: Shelly swims');
      return{parts:[['t','Turn'],['w',`${Math.abs(t)}°`],['t',t<0?'left':'right']],say:`Murky water! Turn Shelly ${Math.abs(t)}° ${t<0?'left (anticlockwise)':'right'}, then Go.`}},
    fan(gv){const kit=fanKit(arena,{cx:180,cy:370,R:140,total:180,given:gv,hidden:true,trayX:400,trayY:112,rack:[180,452]}),gap=180-gv[0];
      const b=goBtn(()=>{if(S.busy)return;const s=kit.sum();if(!s)return;kit.lock(true);b.style.display='none';kit.reveal(()=>later(400,()=>{if(s===gap)hit(`${gv[0]}° + ${gap}° = 180°: a straight line!`,[['w',`${gv[0]}°`],['o','+'],['w',`${gap}°`],['o','='],['w','180°']]);else miss(`Your blades make ${s}°. 180° − ${gv[0]}° = ${gap}°.`)}))},'Close','Close the fan');
      return{parts:[['w',`${gv[0]}°`],['o','+'],['o','?'],['o','='],['w','180°']],say:'How big is the gap? Work it out, pick your blades, then Close.'}},
    tri([a,b0]){const kit=fanKit(arena,{cx:180,cy:370,R:140,total:180,given:[a,b0],hidden:true,trayX:400,trayY:112,rack:[180,452]}),gap=180-a-b0;
      const b=goBtn(()=>{if(S.busy)return;const s=kit.sum();if(!s)return;kit.lock(true);b.style.display='none';kit.reveal(()=>later(400,()=>{if(s===gap)hit(`${a}° + ${b0}° + ${gap}° = 180°: a triangle's three angles make a straight line!`,[['w',`${a}°`],['o','+'],['w',`${b0}°`],['o','+'],['w',`${gap}°`],['o','='],['w','180°']]);else miss(`Your blades make ${s}°. 180° − ${a}° − ${b0}° = ${gap}°.`)}))},'Close','Close the fan');
      return{parts:[['w',`${a}°`],['o','+'],['w',`${b0}°`],['o','+'],['o','?'],['o','='],['w','180°']],say:'A triangle has angles of '+a+'° and '+b0+'°. What is the third? Pick blades, then Close.'}},
    chart([x,y]){el('rect',{x:16,y:104,width:410,height:410,rx:14,fill:'#d8c49a',stroke:'#8a6a3a','stroke-width':5},arena);const kit=mapKit(arena,{ox:220,oy:308,cs:36,xmin:-5,xmax:5,ymin:-5,ymax:5});
      const b=goBtn(()=>{if(S.busy)return;const p=kit.pick();if(!p)return;kit.lock(true);b.style.display='none';kit.swim([0,0],p,()=>{if(p[0]===x&&p[1]===y)hit(`${pt2(x,y)}: along first, then ${y<0?'down':'up'}!`,[['t','Swim to'],['w',pt2(x,y)]]);else{kit.tag(...p,'#a0304a');miss(`That's ${pt2(...p)}.`)}})},'Go','Go: Shelly swims there');
      return{parts:[['t','Swim to'],['w',pt2(x,y)]],say:`Tap ${pt2(x,y)} on the chart, then Go.`}},
    move([f,m]){el('rect',{x:16,y:104,width:410,height:410,rx:14,fill:'#d8c49a',stroke:'#8a6a3a','stroke-width':5},arena);const t=[f[0]+m[0],f[1]+m[1]],kit=mapKit(arena,{ox:220,oy:308,cs:36,xmin:-5,xmax:5,ymin:-5,ymax:5});kit.place(...f);const mv=`${Math.abs(m[0])} ${m[0]<0?'left':'right'}, ${Math.abs(m[1])} ${m[1]<0?'down':'up'}`;
      const b=goBtn(()=>{if(S.busy)return;const p=kit.pick();if(!p)return;kit.lock(true);b.style.display='none';kit.swim(f,t,()=>{if(p[0]===t[0]&&p[1]===t[1])hit(`${pt2(...f)}, ${mv}: ${pt2(...t)}!`,[['w',pt2(...f)],['t',mv],['o','→'],['w',pt2(...t)]]);else{kit.tag(...p,'#a0304a');miss(`She ended up at ${pt2(...t)}, not ${pt2(...p)}.`)}})},'Go','Go: Shelly swims there');
      return{parts:[['w',pt2(...f)],['t',mv],['o','→'],['o','?']],say:`Shelly swims ${mv}. Tap where she ends up, then Go.`}},
    tiles([w,h,cw,ch]){const A=w*h-cw*ch,fl=L(w,h,cw,ch),kit=tileKit(arena,{x0:30,y0:110,cs:40,cols:9,rows:7,floor:fl});
      const per=(()=>{let n=0;fl.forEach(k=>{const [c,r]=k.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{if(!fl.has(`${c+a},${r+b}`))n++})});return n})();
      const b=goBtn(()=>{if(S.busy)return;const P=kit.patches();if(!P.length)return;if(kit.bare().length){say(`Some floor is still bare. Cover it all, then Count.`);return}kit.lock(true);b.style.display='none';
        const terms=P.flatMap((p,k)=>k?[['o','+'],['w',`${p.w} × ${p.h}`]]:[['w',`${p.w} × ${p.h}`]]),parts=[['t','Area'],['o','='],...terms,['o','=']];decQ(qL,[...parts,['o','?']],false,null);say('Work out the area of your slabs, then tap the answer.');
        const vals=[...new Set([A,per!==A?per:A+3,A+cw])].sort(()=>Math.random()-.5),cl=el('g',{},arena);
        vals.forEach((n,k)=>{const c=el('g',{transform:`translate(${120+k*110},470)`},cl);el('rect',{x:-48,y:-28,width:96,height:56,rx:12,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('text',{y:4,'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#3a2418'},c).textContent=n;el('text',{y:21,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#7a5a44'},c).textContent='squares';
          interact(c,{label:`Area card ${n}`,tap:()=>{if(S.busy)return;cl.remove();if(n===A)hit(`${A} squares!`,[...parts,['w',A]]);else miss(n===per?`${n} is the distance round the edge, not the squares inside.`:`Not ${n}: work out each slab, then add.`)}})})},'Count','Count the tiles');
      return{parts:[['t','Area'],['o','='],['o','?'],['t','squares']],say:'Tile this floor with rectangles, then Count.'}},
    pen([P,A]){const kit=penKit(arena,{x0:50,y0:140,cs:36,maxW:9,maxH:7,w:2,h:1});
      const b=goBtn(()=>{if(S.busy)return;const [w,h]=kit.get(),per=2*(w+h);kit.lock(true);b.style.display='none';kit.walk(()=>{kit.sides();
        if(per===P&&w*h===A)hit(`${w} + ${h} + ${w} + ${h} = ${P} m, and ${w} × ${h} = ${A} squares!`,[['t','Perimeter'],['o','='],['w',`${P} m`],['t',',  Area'],['o','='],['w',`${A}`],['t','squares']]);
        else miss(per!==P?`That fence is ${per} m, not ${P} m.`:`${P} m of fence, but ${w*h} squares of grass, not ${A}.`)})},'Fence','Fence it: walk round the fence');
      return{parts:[['t','Fence'],['o','='],['w',`${P} m`],['t',',  Grass'],['o','='],['w',`${A}`],['t','squares']],say:`Make a pen with exactly ${P} m of fence AND ${A} squares of grass. Then Fence.`}},
    box(o){const kit=boxKit(arena,{cx:210,cy:300,S:72,cells:o.c,cands:o.k});
      const b=goBtn(()=>{if(S.busy)return;if(!kit.picked())return;kit.lock(true);b.style.display='none';kit.fold(ok=>{if(ok)hit('It folds into a cube!',[['t','6 squares'],['o','→'],['t','a cube'],['w','✓']]);else miss('Two flaps land on the same side. Not a cube!')})},'Fold','Fold the net');
      return{parts:[['t','6 squares'],['o','→'],['t','a cube'],['o','?']],say:'Tap the square that makes a cube, then Fold.'}}};
  function finale(){S.done=true;S.busy=true;SFX.fanfare();SFX.wake&&SFX.wake();arena.innerHTML='';fog.innerHTML='';kr.mood('happy');
    for(let k=0;k<10;k++)later(k*220,()=>burst(60+Math.random()*360,120+Math.random()*320,{n:10,cols:['#c9a2ff','#8fd6ff','#fff0a0','#8ff0c8']}));
    tween(900,(t,p)=>mapL.setAttribute('transform',`translate(${lerp(MPX+68,230,p).toFixed(1)},${lerp(MPY+33,290,p).toFixed(1)}) scale(${(1+p*1.2).toFixed(2)}) translate(${-(MPX+68)},${-(MPY+33)})`),null,ease.inOut);
    const sh=shellyFig(arena,1.2);sh.put(60,450,90);sh.swim(200,440,1400);
    decQ(qL,[['t','The map is whole again!']],true,null);
    say('All eight tentacles are free! The Kraken is untangled and Shelly’s map is whole again. You did it!');unlock('kraken');clearIsland('kraken');
    later(2600,()=>{const s=navStone({label:'Play again',onTap:()=>{go2()}});s.ready(true)})}
  function go2(){S.r=0;S.hearts=3;S.done=false;S.vr={};go('kraken')}
  function load(){EPOCH++;FX.innerHTML='';arena.innerHTML='';fog.innerHTML='';fog.setAttribute('opacity',1);S.busy=false;navDots(8,S.r,true);drawHearts();kr.mood('');
    loop(dt=>{loopT+=dt;kr.tick(loopT)});
    const q=Q[S.r],m=M[q.t](V());decQ(qL,m.parts,false,null);
    say(S.r===0&&S.hearts===3&&!S.vr[0]?`The Kraken tore up the map! Each mistake loses a shell. ${m.say}`:m.say)}
  load();
}};
