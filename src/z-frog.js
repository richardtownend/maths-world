/* ---------- 6. Calendar frog: days and weeks on lily pads ---------- */
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function frogFig(parent,s=1){const g=el('g',{},parent),b=el('g',{transform:`scale(${s})`},g);
  el('ellipse',{cx:0,cy:4,rx:16,ry:11,fill:'#5aa84a',stroke:'#3a7a2a','stroke-width':2},b);[-8,8].forEach(x=>{el('circle',{cx:x,cy:-8,r:6,fill:'#7fc86a',stroke:'#3a7a2a','stroke-width':1.5},b);el('circle',{cx:x,cy:-8,r:2.6,fill:'#241a3a'},b)});
  el('path',{d:'M-7,6 q7,5 14,0',fill:'none',stroke:'#2a5a1a','stroke-width':2},b);[-1,1].forEach(sd=>el('path',{d:`M${sd*12},12 q${sd*8},2 ${sd*10},-4`,fill:'none',stroke:'#3a7a2a','stroke-width':3,'stroke-linecap':'round'},b));return g}
/* the calendar pond: 7 days across, a week per row */
function frogPond(parent,{x0=62,y0=176,dx=60,dy=62,rows=5,today}){const g=el('g',{},parent),pads=[];
  DAYS.forEach((d,c)=>el('text',{x:x0+c*dx,y:y0-36,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#fff4e6',stroke:'#1d3a3a','stroke-width':3,'paint-order':'stroke'},g).textContent=d.slice(0,3));
  for(let r=0;r<rows;r++)for(let c=0;c<7;c++){const x=x0+c*dx,y=y0+r*dy,p=el('g',{transform:`translate(${x},${y})`},g);el('path',{d:'M0,0 L24,-6 A25,18 0 1 1 22,8Z',fill:c>4?'#4a9a4a':'#6ab85a',stroke:'#3a7a2a','stroke-width':2},p);pads.push({x,y,p})}
  const sun=el('g',{transform:`translate(${pads[today].x+18},${pads[today].y-16})`},g);el('circle',{r:9,fill:'#ffd23a',stroke:'#c98a1a','stroke-width':1.5},sun);el('text',{x:0,y:-13,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#fff0a0',stroke:'#1d3a3a','stroke-width':3,'paint-order':'stroke'},sun).textContent='today';
  const fr=frogFig(g,.95);let at=today;const put=()=>fr.setAttribute('transform',`translate(${pads[at].x},${pads[at].y-6})`);put();
  return{g,pads,pos:()=>at,hop(k,done){const k2=clamp(k,0,pads.length-1);if(k2===at){SFX.clonk();done&&done();return}const a=pads[at],b=pads[k2];at=k2;SFX.boing?SFX.boing():SFX.pop(1.2);
    if(RM){put();done&&done();return}tween(260,(t,p)=>fr.setAttribute('transform',`translate(${lerp(a.x,b.x,p).toFixed(1)},${(lerp(a.y,b.y,p)-6-Math.sin(p*Math.PI)*26).toFixed(1)})`),()=>{put();done&&done()})},
    mark(k,kind){const p=pads[k],m=el('g',{transform:`translate(${p.x-18},${p.y-22})`},g);el('circle',{r:12,fill:'#fff4e6',stroke:'#ffc04d','stroke-width':2},m);el('text',{y:5,'text-anchor':'middle','font-size':14},m).textContent=kind;popIn(m,.4)}}}

W.frog={scene:'pond',
notes:`<p>Days and weeks, without counting on fingers. The calendar is a pond of lily pads, 7 across (Monday to Sunday) and a week to each row. The frog sits on today. She hops it with the arrows: across is a day, down is a week. "Swimming is on Thursday", "Granny comes next Wednesday" (straight down), "the fair is in 2 weeks", "a week on Thursday" (down, then across), "4 sleeps until the trip" (across the end of the row onto the next), "the show was 8 days ago" (up and back). Check, and the thing appears on that pad.</p>`,
mount(root){
  /* t: today's pad (row*7+col); n: days to hop (minus is back); ev: what happens there */
  const R=[
    {v:[{t:7,n:3,ev:'🏊',say:'Swimming is on Thursday this week.'},{t:8,n:3,ev:'🏊',say:'Swimming is on Friday this week.'}]},
    {v:[{t:9,n:7,ev:'👵',say:'Granny comes next Wednesday.'},{t:12,n:7,ev:'👵',say:'Granny comes next Saturday.'}]},
    {v:[{t:4,n:14,ev:'🎡',say:'The fair comes in 2 weeks.'},{t:1,n:14,ev:'🎡',say:'The fair comes in 2 weeks.'}]},
    {v:[{t:8,n:9,ev:'🎂',say:'The party is a week on Thursday.'},{t:7,n:9,ev:'🎂',say:'The party is a week on Wednesday.'}]},
    {v:[{t:12,n:4,ev:'🚌',say:'4 sleeps until the school trip.'},{t:11,n:5,ev:'🚌',say:'5 sleeps until the school trip.'}]},
    {v:[{t:17,n:-8,ev:'⭐',say:'The show was 8 days ago.'},{t:16,n:-9,ev:'⭐',say:'The show was 9 days ago.'}]}];
  const S={r:0,busy:false,won:false,pi:{}};
  const scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let pond=null;
  const st=navStone({label:'Next day',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this day again',onTap:()=>load()});
  /* after two misses, a fresh day of the same kind */
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;let q=rr.v[pi];if(!q){const b=rr.v[0],k=pi*3+S.r,c=b.n===3?[0,1,2,3][k%4]:b.n===4?[4,5,6][k%3]:[1,4,2,6,0,5,3][k%7],row=Math.floor(b.t/7),t=row*7+c;let n=b.n;
      if(b.n===4)n=7-c+[1,2,3][k%3];q=Object.assign({},b,{t,n,say:b.n===7?`Granny comes next ${DAYS[c]}.`:b.n===14?'The fair comes in 2 weeks.':b.n===9?`The party is a week on ${DAYS[(t+n)%7]}.`:b.n===3?`Swimming is on ${DAYS[(t+n)%7]} this week.`:b.n===4?`${n} sleeps until the school trip.`:`The show was ${-n} days ago.`})}return Object.assign({},q,{g:q.t+q.n})};
  const parts=(q,done)=>done?[['t',`${DAYS[q.t%7]} → ${DAYS[q.g%7]}`]]:[['t',`today is ${DAYS[q.t%7]}`],['o','→'],['o','?']];
  const why=q=>{const w=Math.trunc(q.n/7),d=q.n%7,a=Math.abs(q.n);return q.n===7?'Straight down: one row is a week.':q.n===14?'Two rows down: two weeks.':q.n<0?`A week back is a row up, then ${a-7} more ${a-7===1?'day':'days'} back.`:w?`A row down for the week, then ${d} across.`:q.t%7+q.n>6?'Off the end of the row, and on to the next week.':`${q.n} days across.`};
  function check(){if(S.busy||S.won)return;const q=Q(),k=pond.pos();
    if(k!==q.g){SFX.wrong();S.busy=true;say(`The frog is on ${DAYS[k%7]}${Math.floor(k/7)!==Math.floor(q.g/7)?(k>q.g?', a week too late':', a week too early'):''}. ${why(q)} A new day…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(4400,load);return}
    S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();pond.mark(k,q.ev);decQ(qL,parts(q,true),true,guide);burst(pond.pads[k].x,pond.pads[k].y,{n:16});say(`${DAYS[k%7]}! ${why(q)}`);if(S.r>=2)unlock('tfrog');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    pond=frogPond(scene,{today:q.t});
    const pad=el('g',{transform:'translate(530,340)'},ui);[['▲','up a week',0,-46,-7],['▼','down a week',0,46,7],['◀','back a day',-46,0,-1],['▶','on a day',46,0,1]].forEach(([s,lab,dx,dy,d])=>{const b=el('g',{transform:`translate(${dx},${dy})`},pad);
      el('circle',{r:21,fill:'#2a5a4a',stroke:'#fff0a0','stroke-width':2.5},b);el('text',{y:7,'text-anchor':'middle','font-size':18,fill:'#fff0a0'},b).textContent=s;interact(b,{label:`Hop ${lab}`,tap:()=>{if(S.busy||S.won)return;S.busy=true;pond.hop(pond.pos()+d,()=>{S.busy=false})}})});
    el('text',{x:530,y:430,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#fff4e6'},ui).textContent='↕ a week   ↔ a day';
    say(S.r===0?`Today is ${DAYS[q.t%7]}. ${q.say} Hop the frog there: across is a day, down is a week.`:`Today is ${DAYS[q.t%7]}. ${q.say}`);decGo(ui,540,500,'Check: the frog stops here',check,'Check')}
  W.frog.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
