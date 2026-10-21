/* ================= The Old Road: Dex the donkey, and Gruff the goat =================
   Roman numerals and rounding. An old Roman road winds over the hills, lined with carved milestones. Dex the donkey
   pulls a cart of deliveries along it. Milestones are where Roman numerals live (the Romans really did carve them),
   and the hills are where rounding lives: the milestones sit in the valleys, so a cart let go on a slope rolls to the
   nearer one. A cart balanced exactly on a peak (a 5) is always nudged on by the wind: that is "5 rounds up". */

const ROMAN=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
const RV={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
const toRoman=n=>{let s='';ROMAN.forEach(([v,t])=>{while(n>=v){s+=t;n-=v}});return s};
const romanVal=s=>{let t=0;for(let i=0;i<s.length;i++){const a=RV[s[i]],b=RV[s[i+1]]||0;t+=a<b?-a:a}return t};
const fmtR=(n,dp=0)=>{const s=Math.abs(n).toFixed(dp),[w,f]=s.split('.');return (n<0?'−':'')+w.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(f?'.'+f:'')};
const roundTo=(v,step)=>{const k=v/step,f=Math.floor(k+1e-9);return +(((k-f)>=.5-1e-9?f+1:f)*step).toFixed(6)};
const ROAD_FONT='Fraunces,Georgia,serif',CW=.8;
const STONE={face:'#e2d6bf',side:'#c2b294',edge:'#8a7a5e',ink:'#4a3c2a'};

/* carved letters: dark in the stone, with a light lip below */
function carve(parent,x,y,str,{sz=24,anchor='middle',col=STONE.ink,lip='#fff6e0'}={}){const g=el('g',{},parent);
  el('text',{x,y:y+1.2,'text-anchor':anchor,'font-size':sz,'font-weight':700,fill:lip,opacity:.8,style:`font-family:${ROAD_FONT};letter-spacing:1px`},g).textContent=str;
  el('text',{x,y,'text-anchor':anchor,'font-size':sz,'font-weight':700,fill:col,style:`font-family:${ROAD_FONT};letter-spacing:1px`},g).textContent=str;return g}
const carveW=(str,sz=24)=>str.length*sz*.66+4;
/* a milestone: a stone post with a rounded top, origin at the foot */
function milestone(parent,x,y,{txt='',sz=20,w=null,h=null,flag=false,label=null}={}){const g=el('g',{transform:`translate(${x},${y})`},parent);
  const W=w||Math.max(30,carveW(txt||'II',sz)+12),H=h||Math.max(46,sz*2.3);
  el('ellipse',{cx:0,cy:0,rx:W*.7,ry:5,fill:'#000',opacity:.18},g);
  el('path',{d:`M${-W/2},0 V${-H+W/2} A${W/2},${W/2} 0 0 1 ${W/2},${-H+W/2} V0Z`,fill:STONE.face,stroke:STONE.edge,'stroke-width':2},g);
  el('path',{d:`M${W/2-6},-3 V${-H+W/2}`,stroke:STONE.side,'stroke-width':5,opacity:.7},g);
  if(txt)carve(g,0,-H*.42+sz*.35,txt,{sz});
  if(label!=null)el('text',{x:0,y:19,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':3,'paint-order':'stroke'},g).textContent=label;
  return{g,W,H}}

/* ---------- Dex the donkey, side on, facing right; origin between the feet ---------- */
function dexFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  const legs=[-22,-13,15,24].map((x,i)=>el('path',{d:`M${x},-24 L${x},-2`,stroke:i%2?'#7a6a5c':'#6a5a4c','stroke-width':7,'stroke-linecap':'round'},b));
  const tail=el('g',{},b);el('path',{d:'M-32,-38 q-12,6 -11,22',stroke:'#6a5a4c','stroke-width':3,fill:'none'},tail);el('ellipse',{cx:-43,cy:-14,rx:3.5,ry:6,fill:'#3a2e26'},tail);
  el('ellipse',{cx:0,cy:-36,rx:34,ry:17,fill:'#a39282',stroke:'#5a4a3e','stroke-width':2},b);el('ellipse',{cx:2,cy:-26,rx:23,ry:7,fill:'#ddd3c6'},b);
  const head=el('g',{transform:'translate(30,-48)'},b);
  el('path',{d:'M-8,12 Q-4,-6 6,-16 L16,-8 Q8,4 6,16Z',fill:'#a39282',stroke:'#5a4a3e','stroke-width':2},head);
  el('path',{d:'M-6,8 Q-2,-6 4,-14',stroke:'#3a2e26','stroke-width':5,fill:'none','stroke-linecap':'round'},head);
  const ears=el('g',{},head);[[2,-18,-24],[9,-18,-8]].forEach(([x,y,r])=>{el('ellipse',{cx:x,cy:y-12,rx:4.5,ry:13,fill:'#a39282',stroke:'#5a4a3e','stroke-width':2,transform:`rotate(${r} ${x} ${y})`},ears);el('ellipse',{cx:x,cy:y-12,rx:2,ry:9,fill:'#e8b8a8',transform:`rotate(${r} ${x} ${y})`},ears)});
  el('ellipse',{cx:14,cy:-12,rx:14,ry:10,fill:'#a39282',stroke:'#5a4a3e','stroke-width':2,transform:'rotate(28 14 -12)'},head);
  el('ellipse',{cx:22,cy:-4,rx:9,ry:7,fill:'#ddd3c6',stroke:'#5a4a3e','stroke-width':1.5,transform:'rotate(28 22 -4)'},head);
  el('circle',{cx:25,cy:-4,r:1.4,fill:'#3a2e26'},head);el('circle',{cx:11,cy:-15,r:2.6,fill:'#241a14'},head);el('circle',{cx:11.8,cy:-15.8,r:.9,fill:'#fff'},head);
  const o={g,x:0,y:0,s,
    put(x,y){if(x!=null)o.x=x;if(y!=null)o.y=y;g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`)},
    step(p){/* p: distance walked, swings the legs */legs.forEach((l,i)=>{const a=Math.sin(p*.25+(i%2?Math.PI:0))*14;const x=[-22,-13,15,24][i];l.setAttribute('transform',`rotate(${a.toFixed(1)} ${x} -24)`)});tail.setAttribute('transform',`rotate(${(Math.sin(p*.15)*6).toFixed(1)} -32 -38)`)},
    nod(){if(RM)return;tween(500,(t,p)=>head.setAttribute('transform',`translate(30,-48) rotate(${(Math.sin(p*Math.PI*2)*10).toFixed(1)} 0 10)`),()=>head.setAttribute('transform','translate(30,-48)'))},
    cheer(){if(RM)return;SFX.boing&&SFX.boing();tween(600,(t,p)=>g.setAttribute('transform',`translate(${o.x},${(o.y-Math.sin(p*Math.PI)*12).toFixed(1)})`),()=>o.put());o.nod()}};
  o.put(0,0);return o}
/* the guide: Dex's head and shoulders beside the question box */
function dexGuide(parent){const k=dexFig(parent,.42),p0=k.put;k.put=(x,y)=>p0(x==null?x:x-6,y==null?y:y+22);k.put(170,46);return k}
function heehaw(){osc('triangle',620,.22,.05,{to:420,lp:1800,wet:.3});osc('triangle',380,.32,.05,{to:300,at:.24,lp:1400,wet:.3})}

/* a little wooden cart: origin on the ground between the wheels; tilt follows the road */
function cartFig(parent,{s=1,sacks=2,col='#b07a44',tag=null,handle=true,lift=0}={}){const g=el('g',{},parent),b=el('g',{},g),body=el('g',{transform:`scale(${s})`},b);
  el('rect',{x:-30,y:-36,width:60,height:20,rx:3,fill:col,stroke:'#6a4220','stroke-width':2},body);el('path',{d:'M-28,-29 h56 M-28,-22 h56',stroke:'#8a5a2e','stroke-width':1.2},body);
  for(let i=0;i<sacks;i++)el('path',{d:`M${-24+i*17},-36 q-2,-14 8,-16 q10,2 8,16Z`,fill:'#e8d2a8',stroke:'#a8844e','stroke-width':1.5},body);
  if(handle)el('path',{d:'M30,-24 L46,-30',stroke:'#6a4220','stroke-width':3,'stroke-linecap':'round'},body);
  const wheels=[-16,16].map(x=>{const w=el('g',{transform:`translate(${x},-12)`},body);el('circle',{r:12,fill:'#7a4a24',stroke:'#4a2a14','stroke-width':2},w);const sp=el('g',{},w);for(let k=0;k<4;k++)el('line',{x1:0,y1:-10,x2:0,y2:10,stroke:'#c9a27a','stroke-width':2,transform:`rotate(${k*45})`},sp);el('circle',{r:3,fill:'#c9a27a'},w);return sp});
  let tg=null;if(tag!=null){if(lift)el('line',{x1:0,y1:-50*s,x2:0,y2:-66*s-lift+12,stroke:'#7a5a3a','stroke-width':1.5},b);tg=el('g',{transform:`translate(0,${-66*s-lift})`},b);const w=Math.max(40,String(tag).length*9.5+14);var tbox=el('rect',{x:-w/2,y:-14,width:w,height:26,rx:8,fill:'#fff4e6',stroke:'#7a5a3a','stroke-width':2},tg);el('path',{d:'M-5,12 L0,19 L5,12Z',fill:'#7a5a3a'},tg);
    el('text',{y:5,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},tg).textContent=tag}
  const o={g,body:b,x:0,y:0,a:0,tagBox:tg?tbox:null,tagG:tg,
    put(x,y,a=0){o.x=x;o.y=y;o.a=a;g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);body.setAttribute('transform',`rotate(${a.toFixed(1)}) scale(${s})`);},
    spin(d){wheels.forEach(w=>w.setAttribute('transform',`rotate(${(d/12/s*57.3).toFixed(1)})`))}};
  return o}

/* ---------- the hill road: milestones sit in the valleys (every `step`), peaks halfway between ----------
   values run lo..hi left to right. h(v)=amp·sin²(π(v−lo)/step): a cart rolls downhill to the nearer milestone. */
function hillRoad(parent,{x0=40,x1=560,base=430,lo,hi,step,amp=null,wide=true,tick=0,lab=true,fmt=v=>fmtR(v),blank=false,col='#7ab85a',stones=true,sz=15}){
  const g=el('g',{},parent),k=(x1-x0)/(hi-lo);if(amp==null)amp=Math.min(92,step*k*.34);const xOf=v=>x0+(v-lo)*k,vOf=x=>lo+(x-x0)/k,hOf=v=>amp*Math.pow(Math.sin(Math.PI*(v-lo)/step),2),yOf=v=>base-hOf(v);
  const ang=v=>{const dv=(hi-lo)/400;return clamp(Math.atan2(-(hOf(v+dv)-hOf(v-dv))/(2*dv*k),1)*57.3,-34,34)};
  const L0=wide?-700:x0-14,L1=wide?1300:x1+14;let d=`M${L0},${base} L${x0},${base}`;for(let i=0;i<=240;i++){const v=lo+(hi-lo)*i/240;d+=` L${xOf(v).toFixed(1)},${yOf(v).toFixed(1)}`}d+=` L${L1},${base}`;
  el('path',{d:d+` L${L1},${base+(wide?400:44)} L${L0},${base+(wide?400:44)}Z`,fill:col},g);
  el('path',{d:d,fill:'none',stroke:'#cbb98e','stroke-width':12,'stroke-linejoin':'round'},g);el('path',{d:d,fill:'none',stroke:'#e2d3aa','stroke-width':6,'stroke-dasharray':'14 8','stroke-linejoin':'round'},g);
  if(tick){for(let v=lo;v<=hi+1e-9;v+=tick){const x=xOf(v),y=yOf(v);el('line',{x1:x,x2:x,y1:y+7,y2:y+14,stroke:'#4a6a3a','stroke-width':1.6},g)}}
  const S=[];if(stones)for(let v=lo;v<=hi+1e-9;v+=step){const m=milestone(g,xOf(v),yOf(v)+9,{txt:'',w:28,h:44,label:lab&&!blank?fmt(+v.toFixed(6)):null});S.push({v:+v.toFixed(6),m})}
  const R={g,xOf,vOf,yOf,hOf,ang,k,lo,hi,step,stones:S,
    /* stand a cart on the road at value v */
    place(c,v){c.put(xOf(v),yOf(v)-4,ang(v))},
    /* let go at v0: a damped roll downhill; a cart exactly on a peak is pushed on by the wind. done(endValue) */
    roll(c,v0,done,{wind=null}={}){const peak=Math.abs(Math.sin(Math.PI*(v0-lo)/step))>.9999;let v=v0,vel=peak?step*.06:0;const path=[v];
      const G=step*2.4,dmp=2.6;for(let i=0;i<60*6;i++){const dt=1/60,a=-G*Math.sin(2*Math.PI*(v-lo)/step)-dmp*vel;vel+=a*dt;v+=vel*dt;path.push(v);if(i>40&&Math.abs(vel)<step*.004&&Math.abs(Math.sin(Math.PI*(v-lo)/step))<.02)break}
      const end=roundTo(v,step);path.push(end);
      const go=()=>{let last=-1;SFX.whoosh&&SFX.whoosh();tween(path.length*16.7,(t,p)=>{const i=Math.min(path.length-1,Math.floor(p*(path.length-1))),vv=path[i];R.place(c,vv);c.spin((xOf(vv)-xOf(v0)));if(i-last>18){last=i;SFX.tick&&SFX.tick(2)}},()=>{R.place(c,end);done&&done(end)},ease.lin)};
      if(peak){if(wind)wind();later(900,go)}else go();return end}};
  return R}
/* a puff of wind from the left: a few streaks blow across */
function gust(parent,x,y){SFX.shimmer&&SFX.shimmer();noise(.9,.03,{type:'bandpass',f:2400,to:1200,q:.7,a:.2,wet:.3});for(let k=0;k<4;k++){const l=el('path',{d:'M0,0 q20,-6 40,0 t40,0',stroke:'#fff',fill:'none','stroke-width':3,'stroke-linecap':'round',opacity:0},parent);
  tween(800,(t,p)=>{l.setAttribute('transform',`translate(${(x-120+p*140).toFixed(1)},${y-20+k*12})`);l.setAttribute('opacity',(Math.sin(p*Math.PI)*.8).toFixed(2))},()=>l.remove())}}

/* big digit wheels (▲ digit ▼ for each place), grouped in threes with commas, and an optional decimal point */
function bigWheels(parent,{x,y,digits=4,dp=0,label='Number',col='#2a2245',cw=40,onChange}={}){const g=el('g',{transform:`translate(${x},${y})`},parent),d=Array(digits).fill(0),T=[];let locked=false,touched=false;
  const names=['ones','tens','hundreds','thousands','ten thousands','hundred thousands'],dnames=['tenths','hundredths'];
  const gaps=[];let X=0;for(let i=0;i<digits;i++){const fromRight=digits-1-i-dp;gaps.push(X);X+=cw+6;if(dp&&fromRight===0)X+=14;else if(fromRight>0&&fromRight%3===0)X+=10}
  const W=X-6,off=-W/2+cw/2;
  d.forEach((_,i)=>{const cx=gaps[i]+off,fr=digits-1-i-dp,place=fr>=0?names[fr]:dnames[-fr-1],c=el('g',{transform:`translate(${cx},0)`},g);
    el('rect',{x:-cw/2,y:-26,width:cw,height:52,rx:8,fill:'#fff4e6',stroke:'#c9a77a','stroke-width':3},c);el('line',{x1:-cw/2,x2:cw/2,y1:0,y2:0,stroke:'#e8d8c0','stroke-width':1.5},c);
    T[i]=el('text',{y:11,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#3a2418'},c);T[i].textContent='0';
    if(fr>0&&fr%3===0&&i<digits-1)el('text',{x:cw/2+6,y:20,'text-anchor':'middle','font-size':26,'font-weight':800,fill:'#fff4e6'},c).textContent=',';
    if(dp&&fr===0)el('circle',{cx:cw/2+10,cy:18,r:4,fill:'#fff4e6'},c);
    [[-1,'▲',-44],[1,'▼',44]].forEach(([s,t,yy])=>{const b=el('g',{transform:`translate(0,${yy})`},c);el('circle',{r:15,fill:col,stroke:'#c9a24a','stroke-width':2},b);el('text',{y:5.5,'text-anchor':'middle','font-size':14,fill:'#fff0a0'},b).textContent=t;
      interact(b,{label:`${label} ${place} ${s<0?'up':'down'}`,tap:()=>{if(locked)return;touched=true;d[i]=(d[i]-s+10)%10;T[i].textContent=d[i];SFX.tick(d[i]);if(!RM)tween(160,p=>T[i].setAttribute('transform',`scale(1,${(.4+.6*p).toFixed(2)})`));onChange&&onChange(val())}})})});
  const val=()=>+(d.reduce((a,v)=>a*10+v,0)/Math.pow(10,dp)).toFixed(dp);
  return{g,W,get:()=>touched?val():null,set:n=>{touched=true;String(Math.round(n*Math.pow(10,dp))).padStart(digits,'0').slice(-digits).split('').forEach((c,i)=>{d[i]=+c;T[i].textContent=c})},lock:b=>{locked=b;g.setAttribute('opacity',b?.65:1)}}}

/* the letter tray and a stone to carve on: tap a letter to chisel it on the end, tap a carved letter to knock it off.
   Four of the same in a row won't fit. A smaller letter in front of a bigger one gets a take-away notch under it. */
function carver(parent,{x=300,y=300,letters='IVXLC',max=9,sz=34,onChange,can=()=>true,tray=true,ty=null,notch=true}={}){const g=el('g',{},parent),stoneL=el('g',{},g),trayL=el('g',{},g);let str='';
  const SW=Math.max(200,max*sz*CW+40),SH=sz*2.4;
  const draw=()=>{stoneL.innerHTML='';const st=el('g',{transform:`translate(${x},${y})`},stoneL);
    el('rect',{x:-SW/2,y:-SH/2,width:SW,height:SH,rx:14,fill:STONE.face,stroke:STONE.edge,'stroke-width':3},st);el('rect',{x:-SW/2+8,y:-SH/2+8,width:SW-16,height:SH-16,rx:9,fill:'none',stroke:STONE.side,'stroke-width':2,'stroke-dasharray':'2 5'},st);
    const cw=sz*CW,w0=-str.length*cw/2+cw/2;
    [...str].forEach((c,i)=>{const lx=w0+i*cw,lg=el('g',{},st);carve(lg,lx,sz*.36,c,{sz});
      if(notch&&RV[c]<(RV[str[i+1]]||0)){el('path',{d:`M${lx-7},${sz*.62} h14`,stroke:'#c9413a','stroke-width':3.5,'stroke-linecap':'round'},lg)}
      el('rect',{x:lx-cw/2,y:-SH/2+6,width:cw,height:SH-12,fill:'transparent'},lg);
      interact(lg,{label:`Knock off the ${c}`,tap:()=>{if(!can())return;str=str.slice(0,i)+str.slice(i+1);SFX.crunch?SFX.crunch():noise(.08,.1,{f:1800,q:1});crumbs(x+lx,y+10,{n:5,cols:['#c2b294','#e2d6bf']});draw();onChange&&onChange(str)}})});
    if(!str)el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':700,fill:STONE.side},st).textContent='a blank stone'};
  const add=c=>{if(!can())return;if(str.length>=max){wob();say('That’s as long as the stone can take.');return}
    if(str.endsWith(c.repeat(3))){wob();SFX.wrong();say('Four the same in a row won’t fit on a stone. Is there a shorter way?');return}
    str+=c;noise(.05,.12,{f:2600,q:2,wet:.1});osc('triangle',900+RV[c]%7*60,.05,.06,{wet:.2});draw();onChange&&onChange(str)};
  const wob=()=>{if(RM)return;const st=stoneL.firstChild;tween(300,(t,p)=>st.setAttribute('transform',`translate(${(x+Math.sin(p*Math.PI*6)*6).toFixed(1)},${y})`),()=>st.setAttribute('transform',`translate(${x},${y})`))};
  if(tray){const L=[...letters],TY=ty!=null?ty:y+SH/2+52,gap=62;L.forEach((c,i)=>{const bx=x+(i-(L.length-1)/2)*gap,b=el('g',{transform:`translate(${bx},${TY})`},trayL);
    el('rect',{x:-25,y:-25,width:50,height:50,rx:10,fill:'#6a5a8a',stroke:'#c9b8ee','stroke-width':2},b);el('text',{y:11,'text-anchor':'middle','font-size':30,'font-weight':700,fill:'#fff4e6',style:`font-family:${ROAD_FONT}`},b).textContent=c;
    el('text',{y:40,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff4e6',opacity:.85},b).textContent=RV[c];
    interact(b,{label:`Carve ${c} (${RV[c]})`,tap:()=>add(c)})})}
  draw();return{g,get:()=>str,set:s=>{str=s;draw()},wobble:wob,SW,SH}}
/* reading a carving aloud: each letter lights up and says what it adds (or takes away); done(total) */
function readOut(parent,x,y,str,{sz=34,done}={}){const g=el('g',{},parent),cw=sz*CW,w0=x-str.length*cw/2+cw/2;let t=0;
  [...str].forEach((c,i)=>later(i*650,()=>{const neg=RV[c]<(RV[str[i+1]]||0),v=neg?-RV[c]:RV[c];t+=v;const lx=w0+i*cw;
    el('circle',{cx:lx,cy:y-sz*.05,r:sz*.55,fill:neg?'#ff8a8a':'#fff0a0',opacity:.45},g);
    floatText(lx,y-sz*.9,(neg?'−':'+')+fmtR(Math.abs(v)),{col:neg?'#ffb0b0':'#fff0a0',size:18});SFX.tick(i%8)}));
  later(str.length*650+200,()=>done&&done(romanVal(str)));return g}

/* ---------- Gruff the goat, who headbutts milestones over; faces left ---------- */
function gruffFig(parent,{s=1}={}){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g),bod=el('g',{},b);
  [-18,-6,12,24].forEach(x=>{el('rect',{x:x-4,y:8,width:8,height:26,rx:3,fill:'#e8e2d8',stroke:'#7a6a5a','stroke-width':1.5},bod);el('rect',{x:x-4,y:30,width:8,height:6,rx:1.5,fill:'#3a2e26'},bod)});
  el('path',{d:'M34,-6 q14,-10 10,-22 q-4,8 -12,10Z',fill:'#f4f0e8',stroke:'#7a6a5a','stroke-width':1.5},bod);
  el('ellipse',{cx:4,cy:0,rx:34,ry:19,fill:'#f4f0e8',stroke:'#7a6a5a','stroke-width':2.5},bod);
  [[-10,-8],[6,-12],[20,-6],[-2,6],[14,6]].forEach(([cx,cy])=>el('path',{d:`M${cx-5},${cy} q5,-5 10,0`,stroke:'#cfc6b8','stroke-width':1.6,fill:'none'},bod));
  const head=el('g',{transform:'translate(-30,-18)'},b);
  [[-1,'#b8a68a'],[1,'#a8967a']].forEach(([sd,c])=>el('path',{d:`M${sd*5},-14 C${sd*4},-34 ${sd*28},-36 ${sd*26},-18 C${sd*24},-8 ${sd*14},-10 ${sd*16},-18`,fill:'none',stroke:c,'stroke-width':6.5,'stroke-linecap':'round'},head));
  el('path',{d:'M-14,-8 L-26,-2 L-14,2Z',fill:'#e8e2d8',stroke:'#7a6a5a','stroke-width':1.5},head);el('path',{d:'M14,-8 L24,-4 L14,0Z',fill:'#e8e2d8',stroke:'#7a6a5a','stroke-width':1.5},head);
  el('path',{d:'M-14,-12 Q0,-22 14,-12 L10,14 Q0,22 -10,14Z',fill:'#f4f0e8',stroke:'#7a6a5a','stroke-width':2.5},head);
  el('path',{d:'M-6,16 L0,34 L6,16Z',fill:'#e0d8c8',stroke:'#7a6a5a','stroke-width':1.5},head);
  el('ellipse',{cx:0,cy:12,rx:8,ry:5,fill:'#e8c8c0'},head);el('circle',{cx:-3,cy:12,r:1.2,fill:'#5a3a3a'},head);el('circle',{cx:3,cy:12,r:1.2,fill:'#5a3a3a'},head);
  const eyes=[-6,6].map(ex=>{const e=el('g',{transform:`translate(${ex},-3)`},head);el('ellipse',{rx:4.5,ry:4,fill:'#ffe08a',stroke:'#7a6a5a','stroke-width':1},e);el('rect',{x:-3,y:-1,width:6,height:2.2,rx:1,fill:'#241a14'},e);return e});
  const brow=el('path',{d:'M-11,-9 l8,3 M11,-9 l-8,3',stroke:'#7a6a5a','stroke-width':2.2,'stroke-linecap':'round'},head);
  let sc=1,butt=0;return{g,head,
    tick(t){b.setAttribute('transform',`scale(${(s*sc).toFixed(3)})`);head.setAttribute('transform',`translate(${(-30-butt*14).toFixed(1)},${(-18+butt*6+Math.sin(t*2)*1.5).toFixed(1)}) rotate(${(-butt*16+Math.sin(t*1.3)*3).toFixed(1)})`);bod.setAttribute('transform',`translate(0,${(Math.sin(t*2)*1).toFixed(1)})`)},
    charge(){if(RM)return;tween(500,(t,p)=>{butt=Math.sin(p*Math.PI)})},
    mood(m){brow.setAttribute('d',m==='sad'?'M-11,-6 l8,-3 M11,-6 l-8,-3':m==='oh'?'M-11,-10 l8,0 M11,-10 l-8,0':'M-11,-9 l8,3 M11,-9 l-8,3');eyes.forEach(e=>e.setAttribute('transform',`translate(${e===eyes[0]?-6:6},-3) scale(${m==='oh'?1.25:1})`))},
    shrink(){sc=Math.max(.72,sc-.05)},grow(){sc=Math.min(1,sc+.05)}}}
function bleat(){osc('sawtooth',420,.5,.04,{to:380,lfo:11,lfoDepth:.35,lp:1600,wet:.3})}
/* the middle of the Old Road on the home screen: Gruff butting a leaning milestone, or the milestone standing with Dex */
function roadCentreFig(parent,{won=false}={}){const g=el('g',{},parent);
  const ms=el('g',{transform:won?'translate(-16,10)':'translate(-20,12) rotate(-18)'},g);milestone(ms,0,0,{txt:'MM',sz:18,w:44,h:70});
  let gf=null,dx=null;if(won){dx=dexFig(g,.6);dx.put(30,14)}else{gf=gruffFig(g,{s:.62});gf.g.setAttribute('transform','translate(36,-6)')}
  return{g,tick(t){if(gf)gf.tick(t)}}}

/* ---------- scenes ---------- */
SCENE_X.road=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#f2c98a'},o);el('rect',{x:-700,y:0,width:2000,height:180,fill:'#eab07a'},o);el('rect',{x:-700,y:0,width:2000,height:80,fill:'#d99a7a'},o);
  el('circle',{cx:470,cy:150,r:46,fill:'#fff0c8',opacity:.85},o);
  el('path',{d:'M-700,300 Q-300,230 60,270 T700,250 T1300,270 V800 H-700Z',fill:'#b8c87a'},o);el('path',{d:'M-700,350 Q-200,300 300,335 T1300,325 V800 H-700Z',fill:'#94b864'},o);
  [[-40,300],[30,280],[520,262],[640,270],[90,330]].forEach(([x,y],k)=>{const h=70+k%3*16;el('path',{d:`M${x},${y} q-9,${-h*.5} 0,${-h} q9,${h*.5} 0,${h}Z`,fill:'#3a6a3a'},o);el('rect',{x:x-1.5,y,width:3,height:8,fill:'#5a3a24'},o)});
  el('path',{d:'M-700,420 Q0,395 600,420 T1300,415 V800 H-700Z',fill:'#7aa858'},o)};
AMB_X.road=()=>{const r=Math.random();if(r<.45){const f=2600+Math.random()*900;for(let k=0;k<3;k++)osc('sine',f,.07,.008,{to:f*1.18,at:k*.11,wet:.5})}else if(r<.7)noise(.6,.01,{type:'bandpass',f:5200,q:3,a:.2,wet:.2});else bell(noteHz(5+Math.floor(Math.random()*6)),.008,1.4,{wet:.8,ratio:3})};
SCENE_X.crag=o=>{el('rect',{x:-700,y:0,width:2000,height:800,fill:'#c98a7a'},o);el('rect',{x:-700,y:0,width:2000,height:140,fill:'#a86a7a'},o);
  el('path',{d:'M-700,330 L-420,170 L-260,260 L-80,120 L120,250 L300,150 L470,270 L640,140 L900,300 L1300,220 V800 H-700Z',fill:'#8a6a72'},o);
  el('path',{d:'M-700,420 Q-100,380 300,410 T1300,400 V800 H-700Z',fill:'#7a8a5a'},o)};
AMB_X.crag=()=>{const r=Math.random();if(r<.5)bell(1320+Math.random()*200,.006,.8,{wet:.7,ratio:2.7});else{const f=3000+Math.random()*800;osc('sine',f,.09,.006,{to:f*1.2,wet:.5})}};
