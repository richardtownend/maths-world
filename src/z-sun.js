/* ---------- 1. Sun hand: the hour hand on its own ---------- */
/* a little picture of part of the day, on a card she can tap */
function dayPic(parent,x,y,kind,{onTap,label}={}){const c=el('g',{transform:`translate(${x},${y})`},parent);
  const night=kind==='bed',bg=night?'#2a3060':kind==='dinner'?'#f0a070':'#bfe4ff';
  el('rect',{x:-50,y:-42,width:100,height:84,rx:12,fill:bg,stroke:'#c9a77a','stroke-width':3},c);const g=el('g',{},c);
  if(kind==='wake'){el('circle',{cx:-18,cy:4,r:13,fill:'#ffd23a'},g);el('rect',{x:-50,y:4,width:100,height:20,fill:'#7fc86a'},g);el('circle',{cx:16,cy:-6,r:14,fill:'#e8413e'},g);el('circle',{cx:16,cy:-6,r:10,fill:'#fff'},g);el('path',{d:'M16,-6 V-13 M16,-6 L21,-6',stroke:'#3a2418','stroke-width':2},g);[8,24].forEach(bx=>el('circle',{cx:bx,cy:-21,r:4,fill:'#e8413e'},g))}
  else if(kind==='breakfast'){el('path',{d:'M-26,-2 H26 Q24,22 0,24 Q-24,22 -26,-2Z',fill:'#fff4e6',stroke:'#8a6a4a','stroke-width':2},g);[-12,-2,8,16].forEach(bx=>el('circle',{cx:bx,cy:-2,r:4,fill:'#e8b84a'},g));el('rect',{x:18,y:-26,width:5,height:28,rx:2,fill:'#c9c9d8',transform:'rotate(20,20,-12)'},g)}
  else if(kind==='lunch'){el('path',{d:'M-28,14 L0,-22 L28,14Z',fill:'#f4d8a0',stroke:'#a8743a','stroke-width':2},g);el('path',{d:'M-22,6 L0,-14 L22,6',fill:'none',stroke:'#7fc86a','stroke-width':4},g);el('path',{d:'M-24,10 L24,10',stroke:'#e8413e','stroke-width':3},g)}
  else if(kind==='home'){el('rect',{x:-30,y:-8,width:40,height:30,fill:'#e8c89a',stroke:'#8a6a4a','stroke-width':2},g);el('path',{d:'M-34,-8 L-10,-28 L14,-8Z',fill:'#c9413a'},g);el('rect',{x:16,y:0,width:20,height:22,rx:4,fill:'#4aa0ff',stroke:'#2a5a8a','stroke-width':2},g);el('path',{d:'M20,0 q6,-10 12,0',fill:'none',stroke:'#2a5a8a','stroke-width':2},g)}
  else if(kind==='dinner'){el('ellipse',{cx:0,cy:8,rx:32,ry:14,fill:'#fff',stroke:'#8a6a4a','stroke-width':2},g);el('ellipse',{cx:-6,cy:6,rx:12,ry:6,fill:'#c9813a'},g);el('circle',{cx:10,cy:6,r:5,fill:'#5aa84a'},g);el('path',{d:'M-40,-20 V20 M38,-20 V20',stroke:'#c9c9d8','stroke-width':3},g)}
  else{el('rect',{x:-32,y:2,width:64,height:20,rx:4,fill:'#8a6ab0'},g);el('rect',{x:-32,y:-6,width:20,height:12,rx:4,fill:'#fff'},g);el('path',{d:'M22,-26 a12,12 0 1 0 8,18 a9,9 0 1 1 -8,-18Z',fill:'#fff0a0'},g);[[-20,-26],[0,-20],[-34,-14]].forEach(([sx,sy])=>el('circle',{cx:sx,cy:sy,r:1.6,fill:'#fff'},g))}
  el('text',{y:36,'text-anchor':'middle','font-size':13,'font-weight':700,fill:night?'#fff4e6':'#3a2418'},c).textContent={wake:'wake up',breakfast:'breakfast',lunch:'lunch',home:'home time',dinner:'dinner',bed:'bedtime'}[kind];
  if(onTap)interact(c,{label:label||`Picture: ${kind}`,tap:()=>onTap(c)});popIn(c,.5);return c}
const PICKS=[{k:'pick',t:0,pm:1,opts:['wake','lunch','bed'],ans:'lunch'},{k:'pick',t:450,pm:0,opts:['breakfast','home','bed'],ans:'breakfast'},{k:'pick',t:540,pm:1,opts:['lunch','home','bed'],ans:'bed'},{k:'pick',t:180,pm:1,opts:['breakfast','home','dinner'],ans:'home'},{k:'pick',t:300,pm:1,opts:['wake','lunch','dinner'],ans:'dinner'},{k:'pick',t:30,pm:1,opts:['breakfast','lunch','bed'],ans:'lunch'}];
const PICN={wake:'wake up',breakfast:'breakfast',lunch:'lunch',home:'home time',dinner:'dinner',bed:'bedtime'};
/* the sky for a time of day (t in minutes, pm adds 12 hours) */
function skyAt(t,pm){const h=((t%720)+720)%720/60+(pm?12:0);return h<6||h>=21?'#1e2450':h<8?'#f0b090':h<17?'#8fc8f0':h<19?'#f0a070':'#7a5a9a'}

W.sun={scene:'meadow',
notes:`<p>Telling the time from the hour hand alone, for the youngest first. The clock has lost its minute hand: only the short hand is left. She drags it to match part of the day (Tock wakes up at 7, home time is half past 3, dinner is at 5) and the sky changes with it. Check, and Tock cuckoos the hours. Turned round, the hand is set and she picks the picture that fits. Last, she puts three clocks in order through the day, which shows the hand goes round twice a day (dinner at 5 comes after breakfast at 7).</p>`,
mount(root){
  /* set: drag the hand to t; pick: which picture fits t; order: tap the clocks in day order */
  const R=[
    {v:[{k:'set',t:420,pm:0,say:'Tock wakes up at 7 o’clock. Set the clock.'},{k:'set',t:480,pm:0,say:'Tock wakes up at 8 o’clock. Set the clock.'}],gen:i=>{const h=[6,9,10,6][i%4];return{k:'set',t:h*60,pm:0,say:`Tock wakes up at ${h} o’clock. Set the clock.`}}},
    {v:[{k:'pick',t:0,pm:1,opts:['breakfast','lunch','bed'],ans:'lunch'},{k:'pick',t:420,pm:0,opts:['breakfast','lunch','bed'],ans:'breakfast'}],gen:i=>PICKS[i%PICKS.length]},
    {v:[{k:'set',t:210,pm:1,say:'Home time is half past 3. Set the clock.'},{k:'set',t:150,pm:1,say:'Home time is half past 2. Set the clock.'}],gen:i=>{const h=[4,1,4,1][i%4];return{k:'set',t:h*60+30,pm:1,say:`Home time is half past ${h}. Set the clock.`}}},
    {v:[{k:'set',t:330,pm:1,say:'Dinner is at half past 5. Set the clock.'},{k:'set',t:390,pm:1,say:'Dinner is at half past 6. Set the clock.'}],gen:i=>{const h=[5,6,7][i%3];return{k:'set',t:h*60+(i%2?0:30),pm:1,say:`Dinner is at ${i%2?`${h} o’clock`:`half past ${h}`}. Set the clock.`}}},
    {v:[{k:'pick',t:510,pm:1,opts:['home','dinner','bed'],ans:'bed'},{k:'pick',t:210,pm:1,opts:['wake','home','bed'],ans:'home'}],gen:i=>PICKS[(i+3)%PICKS.length]},
    {v:[{k:'order',cl:[[300,1,'dinner'],[420,0,'breakfast'],[30,1,'lunch']]},{k:'order',cl:[[480,1,'bed'],[480,0,'wake'],[210,1,'home']]}],gen:i=>[{k:'order',cl:[[300,1,'dinner'],[450,0,'breakfast'],[0,1,'lunch']]},{k:'order',cl:[[510,1,'bed'],[420,0,'wake'],[180,1,'home']]}][i%2]}];
  const S={r:0,busy:false,won:false,pi:{},pick:null,seq:[]};
  const skyL=el('g',{},root),scene=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=tockGuide(ui);let ck=null;
  const st=navStone({label:'Next clock',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this clock again',onTap:()=>load()});
  const Q=()=>{const rr=R[S.r],pi=S.pi[S.r]||0;return rr.v[pi]||rr.gen(pi)};
  const parts=(q,done)=>[['t',q.k==='order'?'which is which':q.k==='pick'?'what’s happening':'the time'],['o','='],done?['w',q.k==='set'?digi(q.t).replace(':00',''):'✓']:['o','?']];
  function sky(t,pm){skyL.innerHTML='';if(t<0){el('rect',{x:-700,y:0,width:2000,height:470,fill:'#a8b8d0',opacity:.85},skyL);return}el('rect',{x:-700,y:0,width:2000,height:470,fill:skyAt(t,pm),opacity:.85},skyL);const h=((t%720)/60)+(pm?12:0),day=h>=6&&h<21;
    const a=Math.PI*(day?(h-6)/15:((h+3)%24)/9),sx=60+(day?(h-6)/15:((h+3)%24)/9)*480,sy=330-Math.sin(Math.max(0,Math.min(Math.PI,a)))*230;
    if(day)el('circle',{cx:sx,cy:sy,r:26,fill:'#ffd23a'},skyL);else{el('path',{d:`M${sx},${sy-20} a20,20 0 1 0 14,34 a16,16 0 1 1 -14,-34Z`,fill:'#fff0a0'},skyL);[[80,120],[200,80],[420,140],[520,90]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:2,fill:'#fff'},skyL))}}
  function win(q,msg){S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(q,true),true,guide);burst(230,330,{n:16});say(msg);if(S.r>=2)unlock('tsun');later(1400,()=>st.ready(true))}
  function miss(msg){SFX.wrong();S.busy=true;say(`${msg} A new clock…`);S.pi[S.r]=(S.pi[S.r]||0)+1;later(3800,load)}
  function check(){if(S.busy||S.won)return;const q=Q();
    if(q.k==='set'){const t=ck.get()%720;if(t!==q.t){miss(t===((q.t+30)%720)||t===((q.t-30+720)%720)?'Close! Look where the hand is between the numbers.':`That’s ${tWords(t)}.`);return}
      S.busy=true;const n=q.t%60?1:tH(q.t);say('Cuckoo!');guide.cuckoo(n,()=>{S.busy=false;win(q,q.t%60===0?`${n} cuckoos: ${tWords(q.t)}!`:q.t%60===30?`Halfway between: ${tWords(q.t)}! One cuckoo for half past.`:`Just before the ${tH(q.t)%12+1}: ${tWords(q.t)}!`)});return}
    if(q.k==='pick'){if(!S.pick){say('Tap a picture first, then Check.');return}if(S.pick!==q.ans){miss(`The hand says about ${tWords(q.t)}${q.pm?' in the afternoon':''}.`);return}sky(q.t,q.pm);win(q,`About ${tWords(q.t)}: ${{breakfast:'breakfast',lunch:'lunch',bed:'bedtime',home:'home time',wake:'wake up',dinner:'dinner'}[q.ans]}!`);return}
    if(Object.keys(S.asg).length<3){say('Give every clock a picture first.');return}
    if(q.cl.some(([t,pm,kind],i)=>S.asg[i]!==kind)){miss('Not quite. Think about when each one happens in your day.');return}
    win(q,capF([...q.cl].sort((a,b)=>(a[0]+a[1]*720)-(b[0]+b[1]*720)).map(([t,pm,kind])=>`${PICN[kind]} at ${tWords(t)}`).join(', ')+'. The hand goes round twice a day!'))}
  function load(){EPOCH++;FX.innerHTML='';scene.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();Object.assign(S,{busy:false,won:false,pick:null,sel:null,asg:{}});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(q,false),false,guide);
    if(q.k==='order'){sky(-1);const tags=el('g',{},scene),picsL=el('g',{},scene);
      const drawTags=()=>{tags.innerHTML='';Object.entries(S.asg).forEach(([i,kind])=>{const x=110+i*150,b=el('g',{transform:`translate(${x},${350})`},tags);el('rect',{x:-48,y:-14,width:96,height:28,rx:10,fill:'#fff4e6',stroke:'#ffc04d','stroke-width':2.5},b);el('text',{y:6,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#3a2418'},b).textContent=PICN[kind]})};
      q.cl.forEach(([t,pm,kind],i)=>{const x=110+i*150,c=clockKit(scene,{x,y:250,r:66,minute:false});c.set(t);
        const hit=el('circle',{cx:x,cy:250,r:76,fill:'transparent'},scene);
        interact(hit,{label:`Clock ${i+1}`,tap:()=>{if(S.busy||S.won)return;if(!S.sel){if(S.asg[i]){delete S.asg[i];drawTags();SFX.pop(.8)}else say('Tap a picture first, then its clock.');return}
          Object.keys(S.asg).forEach(k=>{if(S.asg[k]===S.sel)delete S.asg[k]});S.asg[i]=S.sel;S.sel=null;picsL.querySelectorAll('.pk').forEach(n=>n.remove());SFX.plink(4);drawTags()}})});
      sshuffle(q.cl.map(c=>c[2]),S.r+(S.pi[S.r]||0)).forEach((kind,i)=>dayPic(picsL,110+i*150,444,kind,{label:`Picture: ${kind}`,onTap:c=>{if(S.busy||S.won)return;S.sel=kind;SFX.pop(1.1);picsL.querySelectorAll('.pk').forEach(n=>n.remove());el('rect',{class:'pk',x:-54,y:-46,width:108,height:92,rx:14,fill:'none',stroke:'#ffc04d','stroke-width':5},c)}}));
      say('Which clock is which? Tap a picture, then its clock.')}
    else{ck=clockKit(scene,{x:q.k==='pick'?190:250,y:310,r:118,minute:false});
      if(q.k==='set'){ck.set(0);sky(0,q.pm);dragHour(ck,{snap:30,label:'Clock: drag the hour hand',onChange:t=>sky(t,q.pm),can:()=>!S.busy&&!S.won});say(q.say)}
      else{ck.set(q.t);sky(-1);q.opts.forEach((o,i)=>dayPic(scene,470,180+i*104,o,{label:`Picture: ${o}`,onTap:c=>{if(S.busy||S.won)return;S.pick=o;SFX.pop(1.1);scene.querySelectorAll('.pk').forEach(n=>n.remove());el('rect',{class:'pk',x:-54,y:-46,width:108,height:92,rx:14,fill:'none',stroke:'#ffc04d','stroke-width':5},c)}}));
        say('What’s happening at this time? Tap the picture, then Check.')}}
    decGo(ui,540,486,'Check',check,'Check')}
  W.sun.dbgQ=()=>({...Q(),r:S.r});S.r=resumeAt(R.length);load();
}};
